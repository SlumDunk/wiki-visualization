var already = [];

function pageScatterPlotNew(mdata, pageNames, svg) {
    already = [];
    var Oldsvg = svg.svg;
    var odlG = svg.g;
    var data = [];
    var maxx = 1000, maxy = 1000;
    var minx = 0, miny = 0;


    console.log("----pageNames---");
    console.log(pageNames);

    var dimValues = [];
    for (var j = 0; j < mdata[0].length; j++) {
        var val = 0;
        for (var i = 0; i < mdata.length; i++) {
            val = val + Math.abs(mdata[i][j]);

        }
        dimValues.push({"index": j, "value": val});
    }


    dimValues.sort(function (x, y) {
        return d3.ascending(x.value, y.value);
    });

    console.log("dim Values--------====");
    console.log(dimValues);
    for (var i = 0; i < mdata.length; i++) {
        if (minx < mdata[i][dimValues[0].index]) minx = mdata[i][dimValues[1].index];
        if (miny < mdata[i][dimValues[0].index]) miny = mdata[i][dimValues[1].index];
        if (maxx > mdata[i][dimValues[0].index]) maxx = mdata[i][dimValues[1].index];
        if (maxy > mdata[i][dimValues[0].index]) maxy = mdata[i][dimValues[1].index];
        var eachObj = {
            "id": mdata[i][dimValues[0].index],
            "value": mdata[i][dimValues[1].index],
            "name": pageNames[i].key,
            "categories": pageNames[i].categories
        }
        data.push(eachObj);
    }
    data = data.sort(function (x, y) {
        return d3.descending(x.id, y.id);
    });

    console.log('jjjjjj2');
    console.log(data);

//var svg  =
    // let margin = {top: 70, right: 50, bottom: 70, left: 50},
    //     width = 1200 - margin.left - margin.right,
    //     height = 200 - margin.top - margin.bottom;
    //
    // var svg = d3.select("#heatMap").append("svg")
    //     .attr("width", width + margin.left + margin.right)
    //     .attr("height", height + margin.top + margin.bottom);


    // var svg = d3.select("svg"),
    let margin = {top: 40, right: 40, bottom: 40, left: 40},
        width = Oldsvg.attr("width") - margin.left - margin.right,
        height = Oldsvg.attr("height") - margin.top - margin.bottom - 200;

    var formatValue = d3.format(",d");

    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var g = Oldsvg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// with out the function

    x.domain(d3.extent(data, function (d) {
        return d.id;
    }));
    y.domain(d3.extent(data, function (d) {
        return d.value + d.value;
    }));

    var simulation = d3.forceSimulation(data)
        .force("x", d3.forceX(function (d) {
            return x(d.id);
        }).strength(1))
        .force("y", d3.forceY(function (d) {
            return y(d.value);
        }).strength(1))
        .force("collide", d3.forceCollide(3))
        //.force("charge", d3.forceManyBody(0))
        .stop();

    for (var i = 0; i < 500; ++i) simulation.tick();

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(20, ".0s"));

    var cell = g.append("g")
        .attr("class", "cells")
        .selectAll("g")
        .data(data).enter().append("g");

    console.log("testing data --->");
    console.log(data);
    cell.append("circle")
        .attr("r", 20)
        .attr("cx", function (d) {

            var ch = checkIfPlotted({x: d.id, y: d.value});
            already.push({x: d.id, y: d.value});
            var x;
            if (ch) {
                x = (ch) ? d.x : 0;
            }
            return x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .style("stroke", "red")
        .style("stroke-width", 0.1)
        .style("fill", "none");

    cell.append("circle")
        .attr("r", 2)
        .attr("class", function (d) {
            return "cir_" + d.name.replace(/[_\W]+/g, "-");
        })
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .on("mouseover", function (d) {


            d3.selectAll("." + oldHoverClass).remove();

            //alert(d.name.replace(/ /g, '_'));
            oldHoverClass = "Line_" + d.name.replace(/[_\W]+/g, "-");
            var list1 = d3.selectAll(".rect_" + d.name.replace(/[_\W]+/g, "-")); // all rects
            var listCircle = d3.selectAll(".cir_" + d.name.replace(/[_\W]+/g, "-")); // all rects

            // console.log(list1);

            var n = list1._groups[0];
            var cn = listCircle._groups[0];

            var circle = [];
            circle.push(cn[0]);
            var rects = [];
            for (var x = 0; x < n.length; x++) {
                if (n[x].tagName == "rect") {
                    rects.push(n[x]);
                } else {
                    circle.push(n[x]);
                }
            }

            // console.log(rects);
            // console.log(circle);


            for (var c = 0; c < circle.length; c++) {
                //console.log("inside");
                for (var r = 0; r < rects.length; r++) {
                    // console.log("inside Line");
                    var x = rects[r].x;
                    var y = rects[r].y;
                    var x1 = circle[c].cx;
                    var y1 = circle[c].cy;


                    //  <path d="M10 10 C 20 20, 40 20, 50 10" stroke="black" fill="transparent"/>

                    var moveTo = "M" + x.baseVal.value.toString() + " " + y.baseVal.value.toString() + " ";
                    var from = "C " + (x.baseVal.value + 20) + " " + (y.baseVal.value + 20) +

                        ", " + (x1.baseVal.value + 30) + " " + (y1.baseVal.value - 20);
                    var complete = moveTo + from.toString() + ", " +
                        x1.baseVal.value.toString() + " " + y1.baseVal.value.toString();
                    //console.log( "see this-->" +  complete);
                    odlG.append("path")
                        .attr("d", complete)
                        .attr("stroke-width", 0.1)
                        .attr("fill", "transparent")
                        .attr("class", oldHoverClass)
                        .attr("stroke", "black");

                    // odlG.append("line")
                    //     .attr("x1", x.baseVal.value)
                    //     .attr("y1", y.baseVal.value)
                    //     .attr("x2", x1.baseVal.value)
                    //     .attr("y2", y1.baseVal.value)
                    //     .attr("stroke-width", 0.1)
                    //     .attr("class",oldHoverClass)
                    //     .attr("stroke", "black");
                }
            }

            // var x = n[0].x;
            // var y = n[0].y;
            // var x1 = n[1].cx;
            // var y1 = n[1].cy;
            // console.log(x.baseVal.value);
            //
            //
            // odlG.append("line")
            //     .attr("x1", x.baseVal.value)
            //     .attr("y1", y.baseVal.value)
            //     .attr("x2", x1.baseVal.value)
            //     .attr("y2", y1.baseVal.value)
            //     .attr("stroke-width", 0.5)
            //     .attr("stroke", "black");


        });

    ;

    // cell.append("path")
    //     .attr("d", function(d) { return "M" + d.join("L") + "Z"; });

    var oldHoverClass;

    //Alma Downtown Historic District

// console.log("Selected objecr ")
// ;    var list1 = d3.selectAll(".Alma_Downtown_Historic_District");
//     console.log(list1);
//
//     var n = list1._groups[0];
//
//
//
//
//     var x = n[0].x;
//     var y = n[0].y;
//     var x1 = n[1].cx;
//     var y1 = n[1].cy;
//     console.log(x.baseVal.value);


    // odlG.append("line")
    //                          .attr("x1", x.baseVal.value)
    //                          .attr("y1", y.baseVal.value)
    //                          .attr("x2", x1.baseVal.value)
    //                         .attr("y2", y1.baseVal.value)
    //     .attr("stroke-width", 0.5)
    //                         .attr("stroke", "black");
    //
    // var circle = odlG.append("circle")
    //                        .attr("cx", x.baseVal.value)
    //                          .attr("cy", y.baseVal.value)
    //                          .attr("r", 4);


    cell.append("title")
        .text(function (d) {
            return (d.name + " | Categories:  " + categorySplitter(d.categories));
        });

}


function checkIfPlotted(obj) {
    console.log("hello!00098785");
    console.log(already);
    var tc = true;
    var t = 0;
    for (var i = 0; i < already.length; i++) {

        if (obj.x === already[i].x && obj.y === already[i].y) {

            tc = false;
            t = i;
        }

    }
    if (tc) {
        already.push(obj);
    } else {
        already[t] = obj;
    }
    return tc;
}

function categorySplitter(cat_string) {
    var toReturn = cat_string.replace("set([", '');
    toReturn = toReturn.replace("])", '');
    var array;
    if (toReturn.length > 2) {
        // console.log(toReturn);
        array = toReturn.split(',')
        // console.log(array);
        return array[0].replace("u'Category:", "").replace("'", "") + (array[1] != undefined ? ", " + array[1].replace("u'Category:", "").replace("'", "") : "")
            + (array[2] != undefined ? ", " + array[2].replace("u'Category:", "").replace("'", "") : "");
    } else {
        return "";
    }

}