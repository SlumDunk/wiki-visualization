let selectUsers = [];
let selectedUserIndex = [];
let dh = 200;
let numberFormat = d3.format('.2s');
let svdCallFlag = false;
let plotId = 0;
let test = [];

/**
 * draw a scatter plot
 * @param data
 * @param divId
 * @param axisNames name of x-axis+'V'+name of y axis
 * @param w
 * @param h
 * @constructor
 */
function ScatterPlot(data, divId, axisNames, w, h) {

    data.forEach(function (d1) {
        d1.timeG15 = +d1.timeG15;
        d1.timeL3 = +d1.timeL3;
        d1.numOfNonMetaPages = +d1.numOfNonMetaPages;
        d1.numOfMetaPages = +d1.numOfMetaPages;
        d1.mtimeL3 = +d1.mtimeL3;
        d1.mtimeG15 = +d1.mtimeG15;
        d1.timeG3L15 = +d1.timeG3L15;
    });


    selectUsers = [];
    divId = "#" + divId;

    // set the dimensions and margins of the graph
    let margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = w - margin.left - margin.right,
        height = h - margin.top - margin.bottom;


    //set the range of x axis, set the default range
    let aAxis = d3.scaleLinear().range([0, width]);
    //set the range of y axis,set the default range
    let yAxis = d3.scaleLinear().range([height, 0]);

    let xScale = d3.scaleLog().range([0, width]);
    let yScale = d3.scaleLog().range([height, 0]);


    let svg = d3.select(divId).append("svg").attr("id", "plotId" + plotId)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    plotId += 1;
    let g = svg.append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //append name of y axis
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "10")
        .text(GetAxisLabels(axisNames, "y"));

    //append name of x axis
    g.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + margin.top + 10) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "10")
        .text(GetAxisLabels(axisNames, "x"));


    //update the range of axis base on the range of data
    aAxis.domain(d3.extent(data, function (d) {
        return GetRightPlot(d, axisNames, "x");
    }));
    yAxis.domain(d3.extent(data, function (d) {
        return GetRightPlot(d, axisNames, "y");
    }));

    xScale.domain(d3.extent(data, function (d) {
        return GetRightPlot(d, axisNames, "x");
    }));
    yScale.domain(d3.extent(data, function (d) {
        return GetRightPlot(d, axisNames, "y");
    }));


    // Add the scatterplot
    let circles = g.selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("r", 1)
        .attr("id", function (d) {//set the id of the circle equal to the index of user
            return "circleId_" + d.userIndex;
        })
        .attr("cx", function (d) {
            return aAxis(GetRightPlot(d, axisNames, "x"));
        })
        .attr("cy", function (d) {
            return yAxis(GetRightPlot(d, axisNames, "y"));
        })
        .attr("class", function (d) {
            //orange color
            if (d.color == "#F6B67F") {
                return "benignUser";
            } else {
                return "vandalUser";
            }
        })
        .style("fill", function (d) {
            return ("" + d.color + "");
        });

    //define start function for lasso
    let lasso_start = function () {
        lasso.items()
            .attr("r", 1) // reset size
            .classed("not_possible", true)
            .classed("selected", false);
    };
    //define draw function for lasso
    let lasso_draw = function () {
        // Style the possible dots
        lasso.possibleItems()
            .classed("not_possible", false)
            .classed("possible", true);

        // Style the not possible dot
        lasso.notPossibleItems()
            .classed("not_possible", true)
            .classed("possible", false);
    };
    //define end function for lasso
    let lasso_end = function () {

        // Reset the color of all dots
        lasso.items()
            .classed("not_possible", false)
            .classed("possible", false);

        // Style the selected dots
        lasso.selectedItems()
            .classed("selected", true)
            .attr("r", 3);
        //get the selected points
        let selectedPoints = lasso.selectedItems()._groups[0];
        //set of selected users
        selectUsers = [];
        //set of the indexes of selected users
        selectedUserIndex = [];
        for (let i = 0; i < selectedPoints.length; i++) {
            selectedUserIndex.push(lasso.selectedItems()._groups[0][i].__data__.userIndex);
            selectUsers.push(lasso.selectedItems()._groups[0][i].__data__);

        }
        //resize all the circle into original size 1
        d3.selectAll("circle").attr("r", 1);

        let circles = d3.selectAll("circle");
        for (let i = 0; i < circles._groups[0].length; i++) {
            for (let j = 0; j < selectedUserIndex.length; j++) {
                //current circle id
                let circleId = circles._groups[0][i].id.substr(circles._groups[0][i].id.indexOf("_") + 1);
                //if current circle is selected, enlarge current circle
                if (circleId == selectedUserIndex[j]) {
                    circles._groups[0][i].setAttribute("r", 3);
                }
            }
        }
        //update the heat map, render the users selected
        heatMap(selectedUserIndex);

        // Reset the style of the not selected dots
        lasso.notSelectedItems()
            .attr("r", 1);

    };
    //define the lasso component and register functions for it
    let lasso = d3.lasso()
        .closePathSelect(true)
        .closePathDistance(100)
        .items(circles)
        .targetArea(svg)
        .on("start", lasso_start)
        .on("draw", lasso_draw)
        .on("end", lasso_end);
    //add lasso to the svg
    svg.call(lasso);

    // Add the X Axis
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(aAxis).ticks(5));

    // Add the Y Axis
    g.append("g")
        .call(d3.axisLeft(yAxis).ticks(5));
    //is not used currently
    if (!svdCallFlag) {
        svdCallFlag = true;
    }

}

/**
 *
 * @param axisNames
 * @param axisType
 * @returns {string}
 * @constructor
 */
function GetAxisLabels(axisNames, axisType) {

    switch (axisNames) {
        case "crsVsCrv":
            if (axisType == "x")
                return "Crs";
            else
                return "Crv";
            break;

        case "CrnVsCrm":
            if (axisType == "x")
                return "Crn";
            else
                return "Crm";
            break;
        case "CrsVsCrvs":
            if (axisType == "x")
                return "Crs";
            else
                return "Crvs";
            break;
        case "CrsmVsCrvm":
            if (axisType == "x")
                return "Crsm";
            else
                return "Crvm";
            break;
        case "EditsVsReverts":
            if (axisType == "x")
                return "Edits";
            else
                return "Reverts";
            break;
        case "crvsVsCrs":
            if (axisType == "x")
                return "Crvs";
            else
                return "Crs";
            break;

    }

}

/**
 *
 * @param d
 * @param axisNames
 * @param axisType
 * @returns {*}
 * @constructor
 */
function GetRightPlot(d, axisNames, axisType) {
    switch (axisNames) {
        case "crsVsCrv":
            if (axisType == "x")
                return d.timeG15;
            else
                return d.timeL3;
            break;

        case "CrnVsCrm":
            if (axisType == "x")
                return d.numOfNonMetaPages;
            else
                return d.numOfMetaPages;
            break;
        case "CrsVsCrvs":
            if (axisType == "x")
                return d.timeL3;
            else
                return d.timeG3L15;
            break;
        case "CrsmVsCrvm":
            if (axisType == "x")
                return d.mtimeL3;
            else
                return d.mtimeG15;
            break;
        case "EditsVsReverts":
            if (axisType == "x")
                return d.numOfGoodEdits;
            else
                return d.numOfBadEdits;
            break;

        case "crvsVsCrs":
            if (axisType == "x")
                return d.timeG15;
            else
                return d.timeG3L15;
            break;
    }
}

/**
 * return the log format of the data, the base is 10
 * @param d
 * @returns {*}
 */
function logFormat(d) {
    let x = Math.log(d) / Math.log(10) + 1e-6;
    return Math.abs(x - Math.floor(x)) < .7 ? numberFormat(d) : "";
}