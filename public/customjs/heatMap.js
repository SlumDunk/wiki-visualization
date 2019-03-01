let opacity;
//store the output result of svd api
let svdObject;
let startTime, endTime;
//store the user index and color, each color represents one page edit by adjacent users
let pagesEditedBySameUsers = new Set();
//store the page title and user index of the same pages edited by adjacent users
let editedPageNames = new Set();
let labelDiv;
let randomFlag = false;
let svdApiUrl = "http://127.0.0.1:5000/output";

/**
 * insert tooltip div into the empty heat map block, for storing the
 */
function setLabelDiv() {
    labelDiv = d3.select("#heatMap").insert("div", ":first-child");
    labelDiv.style("opacity", 0)
        .attr("id", "tempPageName")
        .attr("class", "tooltip");
}

/**
 * set the start time and end time
 * @param st
 * @param et
 */
function setTimeRange(st, et) {
    startTime = st;
    endTime = et;
}

/**
 * save the output result of svd
 * @param svdObject
 */
function setSvdObject(svdObject) {
    svdObject = Object.assign([], svdObject);
}

/**
 * return svdObject
 * @returns {*}
 */
function getSvdObject() {
    return svdObject;
}

/**
 * decompose the group data
 * @param data
 * @returns {{svdPages: Array, HeatMap: Array, svdOutPut: Array}}
 */
function ungroupObjects(data) {
    //store the pages are edited
    let pages = [];
    //store the page edit information of each user
    let userPageEdits = [];

    for (let i = 0; i < data.length; i++) {
        //store the edit information for each page
        let pageEdits = [];
        //the pages edit by current user user
        let editPages = data[i].values;
        //type of user
        let userType = data[i].color == "#000" ? "V" : "B";
        //index of user
        let userIndex = data[i].userIndex;
        //user name
        let userName = data[i].key;
        for (let j = 0; j < editPages.length; j++) {
            let pageTitle = editPages[j].key;
            let all_edits = editPages[j].values;
            pages.push({"pageName": pageTitle, "userName": userName, "category": all_edits[0].pageCategory});
            for (let k = 0; k < all_edits.length; k++) {
                pageEdits.push({
                    "pageName": pageTitle,
                    "userName": userName,
                    "EditTime": new Date(all_edits[k].revtime),
                    "isReverted": all_edits[k].isReverted,
                    "editUserType": userType,
                    "userIndex": userIndex
                });
            }
        }
        //sort the array by edit time, ascending
        pageEdits.sort(function (x, y) {
            return d3.ascending(x.EditTime, y.EditTime);
        });
        //store the page edit information of each user
        userPageEdits.push({"key": userName, "values": pageEdits, "u_Type": userType, "userIndex": userIndex});
    }
    //group pages by page name
    let gPages = d3.nest().key(function (d) {
        return d.pageName;
    }).entries(pages);

    //find the same page edit by the adjacent users
    for (let i = 0; i < userPageEdits.length - 1; i++) {
        let previousUser = userPageEdits[i];
        let currentUser = userPageEdits[i + 1];
        //iterate the pages edit by previous user
        for (let j = 0; j < previousUser.values.length; j++) {
            //iterate the pages edit by current user
            for (let k = 0; k < currentUser.values.length; k++) {
                //find the page is edited by both of the users
                if (previousUser.values[j].pageName == currentUser.values[k].pageName) {
                    //generate random color
                    let col = "#" + Math.floor(Math.random() * 16777215).toString(16);
                    let previousUserIndexColor = previousUser.values[j].userIndex + "-" + col;
                    let currentUserIndexColor = currentUser.values[k].userIndex + "-" + col;
                    pagesEditedBySameUsers.add(previousUserIndexColor);
                    pagesEditedBySameUsers.add(currentUserIndexColor);

                    editedPageNames.add(previousUser.values[j].pageName + "-" + previousUser.values[j].userIndex);
                    editedPageNames.add(currentUser.values[k].pageName + "-" + currentUser.values[k].userIndex);
                    break;
                }
            }
        }
    }
    console.log(pagesEditedBySameUsers);
    console.log(editedPageNames);
    //store the matrix of the number of un reverted edits on each page, each row represents one page, each col represents
    // one user
    let svdInput = [];
    //store the pages that will be used by the svd api
    let svdPages = [];

    //iterate each page
    for (let i = 0; i < gPages.length; i++) {
        let row = [];
        let checkForZero = 0;
        for (let j = 0; j < data.length; j++) {
            // added to check if then sum is zero, we dont want such data. // bad data kinda
            let pageEdits = data[j].values;
            //filter the page by page title
            let result = $.grep(pageEdits, function (e) {
                return e.key == gPages[i].key;
            });
            if (result.length != 0) {
                //get the sum of reverted edit of this page by this user
                let sum = d3.nest()
                    .rollup(function (v) {
                        return {
                            total: d3.sum(v, function (d) {
                                if (d.isReverted == "True") return 1; else return 0;
                            })
                        };
                    })
                    .entries(result[0].values);
                //the number of un reverted edits of this page by this user
                let unRevertedNum = (result[0].values.length - sum.total);
                row.push(unRevertedNum);
                checkForZero = checkForZero + unRevertedNum;
            } else {
                row.push(0);
                checkForZero = checkForZero + 0;
            }
        }
        //if there are reverted edits and un reverted edits for this page
        if (checkForZero > 0) {
            svdInput.push(row);
            // storing the page names and page category
            svdPages.push({"key": gPages[i].key, "categories": gPages[i].values[0].category});
        }
    }
    // call the api to execute svd algorithm
    let start = new Date();
    let svdResult = callSVD(svdInput);
    let end = new Date();

    console.log("svd function run time: " + ((end - start) / 1000) + "seconds");

    return {"svdOutPut": svdResult, "HeatMap": userPageEdits, "svdPages": svdPages};
}

/**
 *generate the heat map for selected user in the scatter plot
 * @param data
 */
function heatMap(data) {
    //store the user
    let selectedUsers = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < svdObject.HeatMap.length; j++) {
            if (svdObject.HeatMap[j].userIndex == data[i]) {
                selectedUsers.push(svdObject.HeatMap[j]);
            }
        }
    }

    if (selectedUsers.length != 0) {
        randomFlag = false;
        //remove old heat map
        d3.selectAll("#heatMapContainer path").remove();
        $("#heatMap").remove();
        $("#heatMapContainer").append("<div id='heatMap'>");
        //reset the label for heat map div
        setLabelDiv();
        //get the user matrix
        let userMatrix = generateHeatMapData(selectedUsers);
        let svg;
        //format the array
        let formatUserMatrix = JSON.parse(JSON.stringify(userMatrix));
        //if the length of the array longer than 6
        if (formatUserMatrix.length > 6) {
            let vandalUsers = [], benignUsers = [], superUsers = [];
            formatUserMatrix.forEach(function (row) {
                if (row.u_type == "V")
                    vandalUsers.push(row);
                else
                    benignUsers.push(row);
            });
            if (vandalUsers.length != 0)
                superUsers.push(createSuperUser(vandalUsers));
            if (benignUsers.length != 0)
                superUsers.push(createSuperUser(benignUsers));
            svg = draw(superUsers);
        } else {
            svg = draw(userMatrix);
        }
        //highlight bars
        drawHighlightBars();

        let copySvdObject = svdObject;
        //redraw scatter plot on heat map svg
        pageScatterPlotNew(copySvdObject.svdOutPut, copySvdObject.svdPages, svg);
    } else {
        let child = d3.select("#heatMap")._groups[0][0].children[0].children[0]
        if (child != null || child != undefined) {
            child.remove();
        }
        d3.selectAll("#heatMap circle").attr("r", 2);
    }
}


/**
 * filter the data needed for the heatmap
 * @param selectedUsers
 * @returns {Array}
 */
function generateHeatMapData(selectedUsers) {

    let userMatrix = [];

    let currentPage = {"pageName": "", "userName": "", "EditTime": ""}; // Current Page
    let previousPage = {"pageName": "", "userName": "", "EditTime": ""}; // Previous Page


    for (let j = 0; j < selectedUsers.length; j++) {
        //pages this user edit
        let editPages = selectedUsers[j].values;

        let userName = selectedUsers[j].key;
        //group the pages by the edit time difference
        let userPages = [];
        //store the meta pages current user edit
        let metaPages = [];
        //store the pages whose time difference with the previous page, 3hours<=timediff<=15hours
        let timeG3L15 = [];
        //store the pages whose time difference with the previous page, 3hours>=timediff
        let timeL3 = [];
        //store the pages whose time difference with the previous page, 15 hours<=timediff
        let timeG15 = [];
        let index = 0;
        //whether it is the first page
        let firstPage = true;

        for (let i = 0; i < editPages.length; i++) {
            currentPage = editPages[i];
            if (previousPage.pageName == "" && isMetaPage(currentPage.pageName)) {
                metaPages.push({
                    "index": index,
                    "pageTitle": currentPage.pageName,
                    "isReverted": currentPage.isReverted,
                    "editTime": currentPage.EditTime
                });
                index++;
            }
            //we need some special action for first page
            if (firstPage) {
                timeL3.push({
                    "index": index,
                    "pageTitle": currentPage.pageName,
                    "isReverted": currentPage.isReverted,
                    "editTime": currentPage.EditTime
                });
                index++;
                firstPage = false;
            } else {
                let curr_edit_time = currentPage.EditTime.getTime();
                let prev_edit_time = previousPage.EditTime.getTime();

                let timeDiff = curr_edit_time - prev_edit_time;
                timeDiff = millisToMinutesAndSeconds(timeDiff);
                //edit time diff between adjacent pages less than 3 hours
                if (timeDiff <= (3 * 60)) {
                    timeL3.push({
                        "index": index,
                        "pageTitle": currentPage.pageName,
                        "isReverted": currentPage.isReverted,
                        "editTime": currentPage.EditTime
                    });
                    index++;
                } else if (timeDiff >= (3 * 60) & timeDiff <= (15 * 60)) {//3 hours<=time diff<=15 hours
                    timeG3L15.push({
                        "index": index,
                        "pageTitle": currentPage.pageName,
                        "isReverted": currentPage.isReverted,
                        "editTime": currentPage.EditTime
                    });
                    index++;
                } else if (timeDiff >= (15 * 60)) {//timeDiff>=15 hours
                    timeG15.push({
                        "index": index,
                        "pageTitle": currentPage.pageName,
                        "isReverted": currentPage.isReverted,
                        "editTime": currentPage.EditTime
                    });
                    index++;
                }
            }
            previousPage = editPages[i];
        }
        userPages.push({"key": "0", "values": metaPages}); // meta
        userPages.push({"key": "1", "values": timeL3}); // very fast
        userPages.push({"key": "2", "values": timeG3L15}); // fast
        userPages.push({"key": "3", "values": timeG15}); // slow

        userMatrix.push({
            "key": selectedUsers[j].key,
            "name": userName,
            "values": userPages,
            "u_type": selectedUsers[j].u_Type
        });
    }

    return userMatrix;

}

/**
 * check whether the page is meta page
 * @param page
 * @returns {boolean}
 */
function isMetaPage(page) {


    if (page.toLowerCase().indexOf("talk:") >= 0
        | page.toLowerCase().indexOf("user:") >= 0
        | page.toLowerCase().indexOf("wikipedia:") >= 0
        | page.toLowerCase().indexOf("template:") >= 0
        | page.toLowerCase().indexOf("category:") >= 0
        | page.toLowerCase().indexOf("command:") >= 0
        | page.toLowerCase().indexOf("daft:") >= 0
        | page.toLowerCase().indexOf("book:") >= 0
        | page.toLowerCase().indexOf("file:") >= 0
    ) {

        return true;
    } else {
        return false;
    }
}

/**
 * draw the heat map
 * @param userMatrix
 * @returns {{svg: (*|jQuery), g: (*|jQuery)}}
 */
function draw(userMatrix) {

    let margin = {top: 40, right: 40, bottom: 40, left: 40},
        width = 1260 - margin.left - margin.right,
        height = 420 - margin.top - margin.bottom;

    let heatMapStart = (height / 2) + 60;


    let svg = d3.select("#heatMap").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    let g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    for (let i = 0; i < userMatrix.length; i++) {
        let pages = userMatrix[i].values;
        //sort by counts of each timediff
        pages.sort(function (page1, page2) {
            return d3.ascending(page1.values.length, page2.values.length);
        });

        //order by time diff
        pages.sort(function (page1, page2) {
            return d3.ascending(page1.key, page2.key);
        });

        let eachWidth = 20;

        let metaPagesMatrix = g.selectAll("rect.meta" + i)
            .data(pages[0].values)
            .enter()
            .append("rect");

        let timeL3PagesMatrix = g.selectAll("rect.veryFast" + i)
            .data(pages[1].values)
            .enter()
            .append("rect");

        let timeG3L15PagesMatrix = g.selectAll("rect.fast" + i)
            .data(pages[2].values)
            .enter()
            .append("rect");


        let timeG15PagesMatrix = g.selectAll("rect.slow" + i)
            .data(pages[3].values)
            .enter()
            .append("rect");

        let pushAttr = 10;
        let RectHeight = 5;

        let spaceHeight = 10;

        let cell = g.append("g");

        let circle = cell.append("circle")
            .attr("cx", 5)
            .attr("id", "barCircles")
            .attr("cy", heatMapStart + RectHeight)
            .attr("r", 6);


        cell.append("text")
            .attr("x", 1.5)
            .attr("y", heatMapStart + RectHeight + 4)
            .text(userMatrix[i].u_type)
            .attr("font-size", "10px")
            .style("fill", "#fff");

        cell.append("title")
            .text(userMatrix[i].name);

        let factor = (width) / (endTime - startTime);

        metaPagesMatrix
            .attr("x", function (d) {
                if ((typeof d.editTime) == "string")
                    return (((new Date(d.editTime) - startTime) * factor) + pushAttr);
                else
                    return (((d.editTime - startTime) * factor) + pushAttr);
            })
            .attr("y", heatMapStart)
            .attr("width", eachWidth)
            .attr("height", RectHeight)
            .attr("opacity", 0.5)
            .attr("class", function (d) {
                return "rect_" + d.pageTitle.replace(/[_\W]+/g, "-");
            })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .style("fill", "#000");

        //the y position of next rect
        heatMapStart = heatMapStart + RectHeight;

        timeL3PagesMatrix
            .attr("x", function (d) {
                if ((typeof d.editTime) == "string")
                    return (((new Date(d.editTime) - startTime) * factor) + pushAttr);
                else
                    return (((d.editTime - startTime) * factor) + pushAttr);
            })
            .attr("y", heatMapStart)
            .attr("width", eachWidth)
            .attr("height", RectHeight)
            .attr("opacity", 0.5)
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .attr("class", function (d) {
                return "rect_" + d.pageTitle.replace(/[_\W]+/g, "-");
            })
            .style("fill", function (d) {
                if (d.isReverted == "True") {
                    return "#F00";
                } else {
                    return "#F6B67F";

                }
            });

        heatMapStart = heatMapStart + RectHeight;

        timeG3L15PagesMatrix
            .attr("x", function (d) {
                if ((typeof d.editTime) == "string")
                    return (((new Date(d.editTime) - startTime) * factor) + pushAttr);
                else
                    return (((d.editTime - startTime) * factor) + pushAttr);
            })
            .attr("y", heatMapStart)
            .attr("width", eachWidth)
            .attr("height", RectHeight)
            .attr("opacity", 0.5)
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .attr("class", function (d) {
                return "rect_" + d.pageTitle.replace(/[_\W]+/g, "-");
            })
            .style("fill", "#c49165");

        heatMapStart = heatMapStart + RectHeight;


        timeG15PagesMatrix
            .attr("x", function (d) {
                //return (eachWidth * d.index + pushAttr);
                if ((typeof d.editTime) == "string")
                    return (((new Date(d.editTime) - startTime) * factor) + pushAttr);
                else
                    return (((d.editTime - startTime) * factor) + pushAttr);
            })
            .attr("y", heatMapStart)
            .attr("width", eachWidth)
            .attr("height", RectHeight)
            .attr("opacity", 0.5)
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .attr("class", function (d) {
                return "rect_" + d.pageTitle.replace(/[_\W]+/g, "-");
            })
            .style("fill", function (d) {
                if (d.isReverted == "True") {
                    return "#F00";
                } else {
                    return "#7f5e41";

                }
            });
        heatMapStart = heatMapStart + spaceHeight;
    }

    return {"svg": svg, "g": g};


}


/**
 * handler for mouse over event
 * @param d
 * @param i
 */
function handleMouseOver(d, i) {  // Add interactivity

    let className = this.className.baseVal;
    let pageName = className.substr(className.indexOf("_") + 1);

    let circleClass = ".cir_" + pageName;

    let circles = d3.select(circleClass);

    let lineClass = ".Line_" + pageName;
    let lines = d3.selectAll(lineClass)._groups[0];

    for (let j = 0; j < lines.length; j++) {
        opacity = lines[j].style.opacity;
        lines[j].style.opacity = 1;
    }

    let categories = categorySplitter(circles._groups[0][0].__data__.categories).split(",");
    let title = circles._groups[0][0].__data__.name + " | Category:  " + categories[0];
    let circle = circles._groups[0][0];

    labelDiv.html(title).style("opacity", 0.9)
        .style("left", (circle.cx.baseVal.value + 40) + "px")
        .style("top", (circle.cy.baseVal.value + 40) + "px");
    circles._groups[0][0].setAttribute("r", 10);
}

/**
 * handler for mouse out event
 * @param d
 * @param i
 */
function handleMouseOut(d, i) {
    let className = this.className.baseVal;
    let pageName = className.substr(className.indexOf("_") + 1);

    let circleClass = ".cir_" + pageName;

    let circles = d3.select(circleClass);

    circles._groups[0][0].setAttribute("r", 2);
    let lineClass = ".Line_" + pageName;
    let lines = d3.selectAll(lineClass)._groups[0];
    labelDiv.style("opacity", 0);
    for (let j = 0; j < lines.length; j++) {
        lines[j].style.opacity = 0.2;
    }
}

/**
 * highlight bars
 */
function drawHighlightBars() {

    let circles = d3.selectAll("#barCircles");
    let margin = {top: 40, right: 40, bottom: 40, left: 40};
    let width = 1290 - margin.left - margin.right;
    for (let i = 0; i < circles._groups[0].length; i++) {
        let y = circles._groups[0][i].getAttribute("cy");
        d3.select("#heatMap svg").insert("rect", ":first-child")
            .attr("x", 45)
            .attr("y", parseInt(y) + 35)
            .attr("height", "20px")
            .attr("width", width)
            .attr("class", "highlightBar")
            .style("opacity", "0.5")
            .style("fill", "#f4f4f4");
    }
}

/**
 *
 * @param users
 * @returns {{values: Array, name: string, u_type: *, key: string}}
 */
function createSuperUser(users) {
    let key = "", name = "", metaPages = [], timeL3 = [], timeG3L15 = [], timeG15 = [], values = [], userType;
    users.forEach(function (user) {

        key += ("-" + user.key);
        name += ("-" + user.name);
        userType = user.u_type;
        let pages = user.values;
        pages.forEach(function (page) {
            if (page.values.length != 0) {
                if (page.key == "0") {
                    page.values.forEach(function (item) {
                        metaPages.push(item);
                    });
                } else if (page.key == "1") {
                    page.values.forEach(function (item) {
                        timeL3.push(item);
                    });
                } else if (page.key == "2") {
                    page.values.forEach(function (item) {
                        timeG3L15.push(item);
                    });
                } else if (page.key == "3") {
                    page.values.forEach(function (item) {
                        timeG15.push(item);
                    });
                }
            }
        });
    });
    values.push({"key": "0", "values": metaPages}); // meta
    values.push({"key": "1", "values": timeL3}); // very fast
    values.push({"key": "2", "values": timeG3L15}); // fast
    values.push({"key": "3", "values": timeG15}); // slow
    return ({"key": key, "name": name, "values": values, "u_type": userType});
}

/**
 * call svd api
 * @param svdInput
 * @returns {Array}
 */
function callSVD(svdInput) {
    let result = [];
    $.ajax({
        type: "POST",
        url: svdApiUrl,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        async: false,
        data: JSON.stringify(svdInput),
        success: function (data) {
            result = data;
        }
    });

    return result;
}