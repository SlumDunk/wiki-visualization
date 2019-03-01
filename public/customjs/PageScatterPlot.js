let color;
// store the svd result of each page
let data = [];
//class for line
let lineClass;
//old group of the svg
let odlG;
//condition for generate random color
let mouseOut = false;
//default use the first column and second column
let xVal = 0, yVal = 1;
//scale of x axis and y axis
let xScale, yScale;
//store the clusters and hulls
let clusters, hulls;

let margin = {top: 40, right: 10, bottom: 40, left: 10}

/**
 * set the columns which will contribute to page scatter plot
 * @param ax
 * @param ay
 */
function setXandYvalues(ax, ay) {
    xVal = ax;
    yVal = ay;
}

/**
 *
 * @param svdOutput
 * @param svdPages
 * @param svg
 */
function pageScatterPlotNew(svdOutput, svdPages, svg) {
    let start = new Date();
    console.log(svdOutput);
    let oldSvg = svg.svg;
    hulls = oldSvg.append("g")
        .attr("id", "hulls");
    odlG = svg.g;
    //a json array to store the sum of each col
    let dimValues = [];

    let rows = svdOutput.length;
    let cols = svdOutput[0].length;
    if (rows > 0 && cols > 0) {
        //get the sum of each col
        for (let j = 0; j < cols; j++) {
            let val = 0;
            for (let i = 0; i < rows; i++) {
                val = val + Math.abs(svdOutput[i][j]);
            }
            dimValues.push({"index": j, "value": val});
        }
    }

    console.log(dimValues);
    //sort the array by the value
    dimValues.sort(function (x, y) {
        return d3.ascending(x.value, y.value);
    });

    let uKey = [];
    for (let i = 0; i < rows; i++) {
        let eachObj = {
            "id": svdOutput[i][dimValues[xVal].index],
            "value": svdOutput[i][dimValues[yVal].index],
            "name": svdPages[i].key,
            "categories": svdPages[i].categories,
            "uKey": svdOutput[i][dimValues[xVal].index] + svdOutput[i][dimValues[yVal].index]

        }
        uKey.push(svdOutput[i][dimValues[xVal].index] + svdOutput[i][dimValues[yVal].index]);
        data.push(eachObj);
    }

    //sort the array by the id attribute
    data = data.sort(function (itemOne, itemTwo) {
        return d3.descending(itemOne.id, itemTwo.id);
    });
    console.log(data);

    let width = oldSvg.attr("width") - margin.left - margin.right,
        height = oldSvg.attr("height") - margin.top - margin.bottom - 100;


    // set the range of x axis and y axis
    xScale = d3.scaleLinear().range([0, width]);
    yScale = d3.scaleLinear().range([height, 0]);

    let g = oldSvg.append("g")
        .attr("transform", "translate(" + margin.left + ",10), scale(1,1)");

    //set the x value of dispersed points
    xScale.domain(d3.extent(data, function (d) {
        return d.id;
    }));
    //set the y value of dispersed points
    yScale.domain(d3.extent(data, function (d) {
        return d.value;
    }));

    let cell = g.append("g")
        .selectAll("g")
        .data(data).enter().append("g");

    cell.append("circle")
        .attr("r", function (d) {
            return 2;
        })
        .style("stroke-width", 2)
        .style("stroke", function (d) {
            return "#ff0000";
        })
        .attr("class", function (d) {
            return "cir_" + d.name.replace(/[_\W]+/g, "-");
        })
        .attr("cx", function (d) {
            return xScale(d.id);
        })
        .attr("cy", function (d) {
            return yScale(d.value);
        })
        .on("mouseout", hMouseOut)
        .on("mouseover", hMouseOver);

    cell.append("title")
        .text(function (d) {
            return (d.name + " | Categories:  " + categorySplitter(d.categories));
        });
    //init the page scatter
    pageScatterPlotInit();
    //draw clusters
    drawClusters();

    //resetting the mdata for nulling out the random stuff...
    let end = new Date();
    console.log("pageScatterPlotInit run time: " + ((end - start) / 1000) + "seconds");
}

/**
 * split the categories string
 * @param categories
 * @returns {string}
 */
function categorySplitter(categories) {
    categories = categories.replace("set([", '');
    categories = categories.replace("])", '');
    let array;
    if (categories.length > 2) {
        array = categories.split(',')
        return array[0].replace("u'Category:", "").replace("'", "") + (array[1] != undefined ? ", " + array[1].replace("u'Category:", "").replace("'", "") : "")
            + (array[2] != undefined ? ", " + array[2].replace("u'Category:", "").replace("'", "") : "");
    } else {
        return "";
    }

}

/**
 * define the function to generate random color
 * @type
 */
randomColor = (function () {
    if (!mouseOut) {
        let golden_ratio_conjugate = 0.618033988749895;
        let h = Math.random();

        let hslToRgb = function (h, s, l) {
            let r, g, b;

            if (s == 0) {
                r = g = b = l; // achromatic
            } else {
                function hue2rgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                }

                let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                let p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }

            return '#' + Math.round(r * 255).toString(16) + Math.round(g * 255).toString(16) + Math.round(b * 255).toString(16);
        };

        return function () {
            h += golden_ratio_conjugate;
            h %= 1;
            return hslToRgb(h, 0.5, 0.60);
        };
    }
})();

/**
 * call when the mouse move out
 * @param d
 * @param i
 */
function hMouseOut(d, i) {
    let className = this.className.baseVal;
    let pageName = className.substr(className.indexOf("_") + 1);
    let lines = ".Line_" + pageName;
    let l = d3.selectAll(lines)._groups[0];
    for (let i = 0; i < l.length; i++) {
        l[i].style.opacity = 0.2;
    }
}

/**
 * call when mouse over
 * @param d
 * @param i
 */
function hMouseOver(d, i) {
    let className = this.className.baseVal;
    let pageName = className.substr(className.indexOf("_") + 1);
    let lines = ".Line_" + pageName;
    let l = d3.selectAll(lines)._groups[0];
    for (let i = 0; i < l.length; i++) {
        l[i].style.opacity = 1;
    }
}

/**
 * init the page scatter
 */
function pageScatterPlotInit() {
    let height = 0;
    for (let i = 0; i < data.length; i++) {
        color = randomColor;
        let item = data[i];

        let rectangleList = d3.selectAll(".rect_" + item.name.replace(/[_\W]+/g, "-")); // all rects
        let circleList = d3.selectAll(".cir_" + item.name.replace(/[_\W]+/g, "-")); // all circles

        let source_rectangles = rectangleList._groups[0];
        let source_circles = circleList._groups[0];

        let circles = [];
        let rects = [];

        circles.push(source_circles[0]);
        for (let x = 0; x < source_rectangles.length; x++) {
            if (source_rectangles[x].tagName == "rect") {
                rects.push(source_rectangles[x]);
            } else {
                circles.push(source_rectangles[x]);
            }
        }

        for (let c = 0; c < circles.length; c++) {
            height = 0;
            for (let r = 0; r < rects.length; r++) {
                let x_rect = rects[r].x;
                let y_rect = rects[r].y;
                let x_circle = circles[c].cx;
                let y_circle = circles[c].cy;
                let rectw = rects[r].width.baseVal.value;

                let lineData = [
                    {"x": x_circle.baseVal.value, "y": y_circle.baseVal.value - 30},
                    {"x": x_circle.baseVal.value, "y": (y_circle.baseVal.value - 30 + height)},
                    {
                        "x": (x_rect.baseVal.value + x_circle.baseVal.value) / 2,
                        "y": (y_circle.baseVal.value - 30 + y_rect.baseVal.value) / 3
                    },
                    {"x": x_rect.baseVal.value + rectw, "y": y_rect.baseVal.value},
                    {"x": x_rect.baseVal.value + rectw, "y": y_rect.baseVal.value},
                    {"x": x_rect.baseVal.value + rectw, "y": y_rect.baseVal.value},
                    {"x": x_rect.baseVal.value, "y": y_rect.baseVal.value},
                    {"x": x_rect.baseVal.value, "y": y_rect.baseVal.value},
                    {"x": x_rect.baseVal.value, "y": y_rect.baseVal.value},
                    {
                        "x": (x_rect.baseVal.value + x_circle.baseVal.value) / 2,
                        "y": (y_circle.baseVal.value - 30 + y_rect.baseVal.value) / 3
                    },
                    {"x": x_circle.baseVal.value, "y": (y_circle.baseVal.value - 30 + height)},
                    {"x": x_circle.baseVal.value, "y": y_circle.baseVal.value - 30},
                ];

                lineClass = "Line_" + item.name.replace(/[_\W]+/g, "-");

                odlG.insert("path", ":first-child")
                    .datum(lineData)
                    .attr("class", "line")
                    .style("stroke", "#ddd")
                    .style("stroke-width", 0.1)
                    .style("fill", color)
                    .style("opacity", 0.1)
                    .attr("class", lineClass)
                    .attr("d", d3.line()
                        .curve(d3.curveBasis)
                        .x(function (d) {
                            return (d.x);
                        })
                        .y(function (d) {
                            return (d.y);
                        })
                    );
            }
        }
        height = height + 2;
    }
}

/**
 * highlight the selected clusters
 * @param centerIds
 */
function assignCluster(centerIds) {
    d3.selectAll("#heatMapContainer circle")
        .each(function (d) {
            if (d != null) {
                let dists = computeDistances(centerIds, d);
                let dist_min = d3.min(dists);
                let cluster_num = dists.findIndex(dist => dist == dist_min);
                let color = d3.schemeCategory20[cluster_num];
                d._dist = dist_min;
                d3.select(this)
                    .attr("fill", d3.color(color).brighter(0.5))
                    .attr("id", "pt_cluster_" + cluster_num);
            }
        });
}

/**
 * add hull
 */
function addHull() {

    clusters.forEach(cluster => {

        // parse cluster data
        let d_cluster = d3.selectAll("#pt_cluster_" + cluster)
            .data()
            .map((datum) => [xScale(datum.id), yScale(datum.value)]);

        // path given data points for cluster
        let d_path = d3.polygonHull(d_cluster);

        let colorArray = ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#ec7014", "#cc4c02", "#993404", "#662506"];

        let color = d3.schemeCategory20[+cluster];

        // ref: https://bl.ocks.org/mbostock/4341699
        d3.select("#hull_" + cluster)
            .attr("id", "hull_" + cluster)
            .transition()
            .duration(250)
            .attr("d", d_path === null ? null : "M" + d_path.join("L") + "Z")
            .attr("fill", color)
            .style("stroke", color)
            .style("opacity", 0.2);
    });

}

/**
 * compute distance between center id with destination point
 * @param centerIds
 * @param destination
 * @returns {*}
 */
function computeDistances(centerIds, destination) {
    try {
        let dists = centerIds.map(function (centroid) {
            let dist = Math.sqrt(Math.pow(xScale(destination.id) - xScale(centroid.id), 2) + Math.pow(yScale(destination.value) - yScale(centroid.value), 2));
            return dist;
        });
        return dists;
    } catch (e) {
        console.log(e);
    }
}

/**
 * compute distance cost
 * @returns {number}
 */
function computeCost() {

    let dists = [];
    let temp;
    clusters.forEach(cluster => {
        temp = d3.selectAll("#pt_cluster_" + cluster)
            .data();
        if (temp.length != 0) {
            for (let i = 0; i < temp.length; i++) {
                dists.push(temp[i]._dist);
            }
        }
    });
    return d3.sum(dists);
}

/**
 * compute the ids of centers of each cluster
 * @returns {*}
 */
function computeCenterIds() {

    let centerIds = clusters.map(cluster => {

        let d = d3.selectAll("#pt_cluster_" + cluster)
                .data(),
            n = d.length;

        let x_sum = d3.sum(d, d => d.id),
            y_sum = d3.sum(d, d => d.value);

        return {id: (x_sum / n), value: (y_sum / n)};

    });

    return centerIds;
}

/**
 * filter nan
 * @param polyCenterId
 * @returns {*}
 */
function sanitize(polyCenterId) {
    if (isNaN(polyCenterId[0]))
        polyCenterId[0] = Math.random() * (1100 - 40) + 40;
    if (isNaN(polyCenterId[1]))
        polyCenterId[1] = 0;
    return polyCenterId;
}

/**
 *
 * @param text
 * @returns {string[]}
 */
function bagOfWords(text) {
    let bag = text.toLowerCase().split(' ').sort(),
        clone = bag.slice();  //needed because sort changes the array in place

    //sort in reverse order of occurrence
    return bag.sort(function (a, b) {
        return (clone.lastIndexOf(b) - clone.indexOf(b) + 1) -
            (clone.lastIndexOf(a) - clone.indexOf(a) + 1);
    }).filter(function (word, idx) { //remove duplicates
        return bag.indexOf(word) === idx;
    });
}

/**
 * generate labels
 */
function generateLabels() {
    let drawnHulls = d3.select("#hulls");
    let textHulls = d3.selectAll(".hull")._groups[0];
    let xAdd = 40, yAdd = 0;
    for (let i = 0; i < textHulls.length; i++) {
        let commonWords;
        try {
            let color = d3.schemeCategory20[i];
            let d_cluster = d3.selectAll("#pt_cluster_" + i)
                .data()
                .map((item) => [xScale(item.id), yScale(item.value)]);
            let clusterData = d3.selectAll("#pt_cluster_" + i).data();
            let d_path = d3.polygonHull(d_cluster);
            let polygonCenterId = d3.polygonCentroid(d_path);
            let names, categories = "";
            clusterData.forEach(function (d) {
                names += d.name;
                categories += ((categorySplitter(d.categories)).split(','));
            });
            commonWords = bagOfWords(categories);
            let removeWords = ["", "with", "by", "from", "in", "of", "the", "and", "articles,", "needing", "all", "pages", "wikipedia", "articles", "a", "an", "as", "on", "pages,", "unsourced", "additional", "seasons,", "no", "references", "category", "containing", "to", "missing", "(operating", "2011", "2012", "2013", "2013,", "2014,", "external", "commons", "links", "dead", "established", "stub", "statements", "stubs,", "article", "wikidata", "disambiguation", "for", "same", "identifiers,", "lacking", "page", "title", "dates", "united", "use", "2012,", "wikidata,", "september", "2010,", "wikiproject", "films", "may", "using", "films,", "film", "lccn", "citations", "2011,"];
            for (let j = 0; j < removeWords.length; j++) {
                let index = commonWords.indexOf(removeWords[j]);
                //remove the word
                if (index > -1) {
                    commonWords.splice(index, 1);
                }
            }

            polygonCenterId = sanitize(polygonCenterId);
            drawnHulls.append("text")
                .attr("x", polygonCenterId[0] + xAdd)
                .attr("y", polygonCenterId[1] + yAdd)
                .text("" + commonWords[0] + ":" + commonWords[1] + ":" + commonWords[2])
                .style("stroke", color)
                .style("opacity", 1)
                .style("font-size", "12px");
            yAdd += 10;
        } catch (e) {
            console.log(e);
        } finally {
            //release memory
            commonWords = null;
        }

    }
}

/**
 * draw cluster
 */
function drawClusters() {
    clusters = d3.range(0, 5).map((n) => n.toString());
    hulls.selectAll("path")
        .data(clusters)
        .enter()
        .append("path")
        .attr("class", "hull").style("opacity", 0.2)
        .attr("id", d => "hull_" + d)
        .attr("transform", "translate(" + margin.left + ",10), scale(1,1)");

    let initialCenterIds = clusters.map(() => data[Math.round(d3.randomUniform(0, data.length)())]);
    //highlight selected clusters
    assignCluster(initialCenterIds);
    //
    addHull();
    let costs = [];
    costs.push(computeCost());
    //
    let iterate = d3.interval(() => {
        let cluster = computeCenterIds()

        assignCluster(cluster)
        addHull();
        let cost = computeCost();
        // stop iterating when algorithm coverges to local minimum
        if (cost == costs[costs.length - 1]) {
            iterate.stop();
        }
        costs.push(cost)

    }, 500);
}