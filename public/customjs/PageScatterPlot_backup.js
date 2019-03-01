
var color;
var already =[];
function pageScatterPlotNew(mdata,pageNames, svg)
{
    already =[];
    var Oldsvg = svg.svg;
    var odlG = svg.g;
    var data = [];
    var maxx  = 1000, maxy =1000;
    var minx = 0, miny = 0;


    console.log("----pageNames---");
    console.log(pageNames);

    var  dimValues = [];
    for(var j =0; j<mdata[0].length;j++) {
        var val = 0;
        for (var i = 0; i < mdata.length; i++) {
             val = val + Math.abs( mdata[i][j]);
        }
        dimValues.push({"index": j, "value":val});
    }


    dimValues.sort(function(x, y){
        return d3.ascending(x.value, y.value);
    });

    console.log("dim Values--------====");
    console.log(dimValues);
    for(var i=0 ; i< mdata.length; i++)
    {
        if(minx<mdata[i][dimValues[0].index]) minx = mdata[i][dimValues[1].index];
        if(miny<mdata[i][dimValues[0].index]) miny = mdata[i][dimValues[1].index];
        if(maxx>mdata[i][dimValues[0].index]) maxx = mdata[i][dimValues[1].index];
        if(maxy>mdata[i][dimValues[0].index]) maxy = mdata[i][dimValues[1].index];
        var eachObj = {"id": mdata[i][dimValues[0].index],
            "value": mdata[i][dimValues[1].index],
            "name": pageNames[i].key,
            "categories":pageNames[i].categories,
            "uKey": mdata[i][dimValues[0].index] + mdata[i][dimValues[1].index]
        }
        data.push(eachObj);
    }

    var  data2 = d3.nest()
        .key(function(d) { return d.uKey; })
        .entries(data)
        .map(function(group) {
            return {
                name: group.key,
                id: group.values[0].id,
                name: group.values[0].name,
                value: group.values[0].value,
                count: group.values.length,
                values : group.values,
                categories : group.values[0].categories
            }
            });



    data = data2.sort(function(x, y){
        return d3.descending(x.value, y.value);
    });


    data = data.sort(function(x, y){
        return d3.descending(x.id, y.id);
    });



    // set the dimensions and margins of the graph
    let  margin = {top: 40, right: 40, bottom: 40, left: 40},
        width = Oldsvg.attr("width") - margin.left - margin.right,
		//width = 1460,
        height = Oldsvg.attr("height") - margin.top - margin.bottom - 200;


// parse the date / time
    var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
    var g = Oldsvg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




    x.domain(d3.extent(data, function(d) { return d.id ; }));
    y.domain(d3.extent(data, function(d) { return d.value  + d.value  ; }));



    var cell = g.append("g")
        .selectAll("g")
        .data(data).enter().append("g");

    // Add the scatterplot
       // g.selectAll("dot")
        //.data(data)
        //.enter()

	
		
    cell.append("circle")
        .attr("r", function(d){
            return d.count > 1 ? 5 : 2;
        })
        .style("fill", function (d) {
            if(d.count> 1)
            {
                return "#ddd";
            }
            else if(d.count> 10)
            {
                return "#eee";
            }
            else
            {
                return "#aaa";
            }
        })
        .style("stroke-width",0.1)
        .style("stroke", function (d) {

                return "#000";
        })
        .attr("class", function(d) { return "cir_" +  d.name.replace(/[_\W]+/g, "-"); })
        .attr("cx", function(d) { return x(d.id); })
        .attr("cy", function(d) { return y(d.value); })
		.on("mouseout", handleMouseOut)
        .on("mouseover", handleMouseOver);

    cell.append("title")
        .text(function(d) { return (d.name +  " | Categories:  " + categorySplitter(d.categories)); });
	//cell.append("text")
	  //  .attr("dx", function(d) { return (x(d.id) - 35); })
		//.attr("dy", function(d) { return (y(d.value) + 15); })
	    //.text(function(d){return (d.name)});	
		//.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		//.text(function(d){return "test"; });	


            
    


    height = 0;
    for(var i =0;i<data.length;i++)
    {
        color = randomColor;
        console.log("wtf!");
        d = data[i];
        console.log(d);

        if(d.values.length  <= 1) {

            var list1 = d3.selectAll(".rect_" + d.name.replace(/[_\W]+/g, "-")); // all rects
            var listCircle = d3.selectAll(".cir_" + d.name.replace(/[_\W]+/g, "-")); // all rects

            var n = list1._groups[0];
            var cn = listCircle._groups[0];

            var circle = [];
            circle.push(cn[0]);
            var rects = [];
            for (var x = 0; x < n.length; x++) {
                if (n[x].tagName == "rect") {
                    rects.push(n[x]);
                }
                else {
                    circle.push(n[x]);
                }
            }


            for (var c = 0; c < circle.length; c++) {
                var yt = 0;
                for (var r = 0; r < rects.length; r++) {
                    var x = rects[r].x;
                    var y = rects[r].y;
                    var x1 = circle[c].cx;
                    var y1 = circle[c].cy;
                    var rectw = rects[r].width.baseVal.value;
                    yt++;
                    console.log("recta!!");

                    console.log(rects[r]);
                    var lineData = [
                        {"x": x1.baseVal.value, "y": y1.baseVal.value},
                        {"x": x1.baseVal.value, "y": (y1.baseVal.value + height) },
                        {"x": (x.baseVal.value + x1.baseVal.value) / 2, "y": (y1.baseVal.value + y.baseVal.value) / 3},
                        {"x": x.baseVal.value + rectw, "y": y.baseVal.value},
                        {"x": x.baseVal.value + rectw, "y": y.baseVal.value},
                        {"x": x.baseVal.value + rectw, "y": y.baseVal.value},
                        {"x": x.baseVal.value , "y": y.baseVal.value},
                        {"x": x.baseVal.value , "y": y.baseVal.value},
                        {"x": x.baseVal.value, "y": y.baseVal.value},
                        {"x": (x.baseVal.value + x1.baseVal.value) / 2, "y": (y1.baseVal.value + y.baseVal.value) / 3},
                        {"x": x1.baseVal.value, "y": (y1.baseVal.value + height) },
                        {"x": x1.baseVal.value, "y": y1.baseVal.value},
                    ];
                    lineClass = "Line_" + d.name.replace(/[_\W]+/g, "-");
                    odlG.append("path")
                        .datum(lineData)
                        .attr("class", "line")
                        .style("stroke", "#ddd")
                        .style("stroke-width", 0.1)
                        .style("fill", "#ddd")
                        .style("opacity", 0.2)
                        .attr("class", oldHoverClass)
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


        }
        else
        {console.log("this is wat i am talking");
            console.log( d.values);
            for(var j =0; j< d.values.length; j++)
            {

                color = randomColor;
                console.log( d.values[j].name.replace(/[_\W]+/g, "-"));
                var list1 = d3.selectAll(".rect_" + d.values[j].name.replace(/[_\W]+/g, "-")); // all rects
                var listCircle = d3.selectAll(".cir_" + d.name.replace(/[_\W]+/g, "-")); // all rects
                var n = list1._groups[0];
                var cn = listCircle._groups[0];


                var circle = [];
                circle.push(cn[0]);
                var rects = [];
                if(circle.length > 0)
                    for (var x = 0; x < n.length; x++) {
                        if (n[x].tagName == "rect") {
                            rects.push(n[x]);
                        }
                        else {
                            circle.push(n[x]);
                        }
                    }


                if(circle.length > 0)
                    for (var c = 0; c < circle.length; c++) {
                        var yt = 0;
                        var x1 = circle[c].cx;
                        var y1 = circle[c].cy;
                        for (var r = 0; r < rects.length; r++) {
                            var x = rects[r].x;
                            var y = rects[r].y;
                            var rectw = rects[r].width.baseVal.value;
                            yt++;

                            var lineData = [
                                //{"x": (x.baseVal.value + x1.baseVal.value) / 2, "y": (y1.baseVal.value + y.baseVal.value) / 3},
                                //{"x": x1.baseVal.value, "y": (y1.baseVal.value + y.baseVal.value) / 2},
                                {"x": x1.baseVal.value, "y": y1.baseVal.value},
                                {"x": x1.baseVal.value, "y": (y1.baseVal.value + height)},
                                {"x": (x.baseVal.value + x1.baseVal.value) / 2, "y": (y1.baseVal.value + y.baseVal.value) / 3},
                                {"x": x.baseVal.value + rectw, "y": y.baseVal.value},
                                {"x": x.baseVal.value + rectw, "y": y.baseVal.value},
                                {"x": x.baseVal.value + rectw, "y": y.baseVal.value},
                                {"x": x.baseVal.value, "y": y.baseVal.value},
                                {"x": x.baseVal.value, "y": y.baseVal.value},
                                {"x": x.baseVal.value, "y": y.baseVal.value},
                                {"x": (x.baseVal.value + x1.baseVal.value) / 2, "y": (y1.baseVal.value + y.baseVal.value) / 3},
                                {"x": x1.baseVal.value, "y": (y1.baseVal.value + height)},
                                {"x": x1.baseVal.value, "y": y1.baseVal.value},

                            ];
                            lineClass = "Line_" + d.name.replace(/[_\W]+/g, "-");
                            var c = color;

                            odlG.append("path")
                                .datum(lineData)
                                .attr("class", "line")
                                .style("stroke", c)
                                .style("fill", c)
                                .style("stroke-width", 0.1)
                                .style("opacity", 0.2)

                                .attr("class", oldHoverClass)
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

            }

        }
        height = height + 2;

    }


}


		
function checkIfPlotted(obj)
{
    console.log("hello!00098785");
    console.log(already);
    var tc = true;
    var t = 0;
    for(var i =0;i<already.length;i++)
    {

        if(obj.x  === already[i].x && obj.y === already[i].y)
        {

            tc = false;
            t= i;
        }

    }
   if(tc)
   {
       already.push(obj);
   }else
   {
       already[t] = obj;
   }
    return tc;
}

function categorySplitter(cat_string){
    var toReturn = cat_string.replace("set([", '');
    toReturn = toReturn.replace("])", '');
    var array;
    if(toReturn.length > 2)
    {
       // console.log(toReturn);
        array  = toReturn.split(',')
       // console.log(array);
        return array[0].replace("u'Category:","").replace("'","") + (array[1] != undefined ?  ", " + array[1].replace("u'Category:","").replace("'","") : "")
        + (array[2] != undefined ? ", " + array[2].replace("u'Category:","").replace("'","") : "");
    }else{
        return "";
    }

}




randomColor = (function(){
    var golden_ratio_conjugate = 0.618033988749895;
    var h = Math.random();

    var hslToRgb = function (h, s, l){
        var r, g, b;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return '#'+Math.round(r * 255).toString(16)+Math.round(g * 255).toString(16)+Math.round(b * 255).toString(16);
    };

    return function(){
        h += golden_ratio_conjugate;
        h %= 1;
        return hslToRgb(h, 0.5, 0.60);
    };
})();

function handleMouseOut(d, i) {
            // Use D3 to select element, change color back to normal
           

            // Select text by id and then remove
            d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();  // Remove text location
          }

function handleMouseOver(d, i){
	
			var oldHoverClass ;
            d3.selectAll("."+oldHoverClass).remove();
			console.log("d-name: "+d.name);
			console.log("d-name-replaced: "+d.name.replace(/[_\W]+/g, "-"));
            oldHoverClass = "Line_" + d.name.replace(/[_\W]+/g, "-");

if(d.values.length  <= 1) {

    var list1 = d3.selectAll(".rect_" + d.name.replace(/[_\W]+/g, "-")); // all rects
    var listCircle = d3.selectAll(".cir_" + d.name.replace(/[_\W]+/g, "-")); // all rects
	console.log("In values less than 1");
    var n = list1._groups[0];
    var cn = listCircle._groups[0];

    var circle = [];
    circle.push(cn[0]);
    var rects = [];
    for (var x = 0; x < n.length; x++) {
        if (n[x].tagName == "rect") {
            rects.push(n[x]);
        }
        else {
            circle.push(n[x]);
        }
    }


    for (var c = 0; c < circle.length; c++) {
        var yt = 0;
        for (var r = 0; r < rects.length; r++) {
            var x = rects[r].x;
            var y = rects[r].y;
            var x1 = circle[c].cx;
            var y1 = circle[c].cy;
            var rectw = rects[r].width.baseVal.value;
            yt++;
            console.log("recta!!");
            console.log(rects[r].width);
            var lineData = [
                {"x": x1.baseVal.value, "y": y1.baseVal.value},
                {"x": x1.baseVal.value, "y": (y1.baseVal.value + y.baseVal.value) / 2},
                {"x": (x.baseVal.value + x1.baseVal.value) / 2, "y": (y1.baseVal.value + y.baseVal.value) / 3},
                {"x": x.baseVal.value + rectw, "y": y.baseVal.value},
                {"x": x.baseVal.value + rectw, "y": y.baseVal.value},
                {"x": x.baseVal.value + rectw, "y": y.baseVal.value},
                {"x": x.baseVal.value , "y": y.baseVal.value},
                {"x": x.baseVal.value , "y": y.baseVal.value},
                {"x": x.baseVal.value, "y": y.baseVal.value},
                {"x": (x.baseVal.value + x1.baseVal.value) / 2, "y": (y1.baseVal.value + y.baseVal.value) / 3},
                {"x": x1.baseVal.value, "y": (y1.baseVal.value + y.baseVal.value) / 2},
                {"x": x1.baseVal.value, "y": y1.baseVal.value},
            ];
            oldHoverClass = "Line_" + d.name.replace(/[_\W]+/g, "-");
			//console.log("path-class: "+oldHoverClass);
            odlG.append("path")
                .datum(lineData)
                .attr("class", "line")
                .style("stroke", "#ddd")
                .style("stroke-width", 0.1)
                .style("fill", "#ddd")
                .attr("class", oldHoverClass)
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

}
else
{
	console.log("this is wat i am talking");
    console.log( d.values);
        for(var j =0; j< d.values.length; j++)
        {

            color = randomColor;
            console.log( d.values[j].name.replace(/[_\W]+/g, "-"));
            var list1 = d3.selectAll(".rect_" + d.values[j].name.replace(/[_\W]+/g, "-")); // all rects
            var listCircle = d3.selectAll(".cir_" + d.name.replace(/[_\W]+/g, "-")); // all rects
            var n = list1._groups[0];
            var cn = listCircle._groups[0];


            var circle = [];
            circle.push(cn[0]);
            var rects = [];
            if(circle.length > 0)
            for (var x = 0; x < n.length; x++) {
                if (n[x].tagName == "rect") {
                    rects.push(n[x]);
                }
                else {
                    circle.push(n[x]);
                }
            }


            if(circle.length > 0)
            for (var c = 0; c < circle.length; c++) {
                var yt = 0;
                var x1 = circle[c].cx;
                var y1 = circle[c].cy;
                for (var r = 0; r < rects.length; r++) {
                    var x = rects[r].x;
                    var y = rects[r].y;
                    var rectw = rects[r].width.baseVal.value;
                    yt++;

                    var lineData = [
                        //{"x": (x.baseVal.value + x1.baseVal.value) / 2, "y": (y1.baseVal.value + y.baseVal.value) / 3},
                        //{"x": x1.baseVal.value, "y": (y1.baseVal.value + y.baseVal.value) / 2},
                        {"x": x1.baseVal.value, "y": y1.baseVal.value},
                        {"x": x1.baseVal.value, "y": (y1.baseVal.value + y.baseVal.value) / 2},
                        {"x": (x.baseVal.value + x1.baseVal.value) / 2, "y": (y1.baseVal.value + y.baseVal.value) / 3},
                        {"x": x.baseVal.value + rectw, "y": y.baseVal.value},
                        {"x": x.baseVal.value + rectw, "y": y.baseVal.value},
                        {"x": x.baseVal.value + rectw, "y": y.baseVal.value},
                        {"x": x.baseVal.value, "y": y.baseVal.value},
                        {"x": x.baseVal.value, "y": y.baseVal.value},
                        {"x": x.baseVal.value, "y": y.baseVal.value},
                        {"x": (x.baseVal.value + x1.baseVal.value) / 2, "y": (y1.baseVal.value + y.baseVal.value) / 3},
                        {"x": x1.baseVal.value, "y": (y1.baseVal.value + y.baseVal.value) / 2},
                        {"x": x1.baseVal.value, "y": y1.baseVal.value},

                    ];
                    oldHoverClass = "Line_" + d.name.replace(/[_\W]+/g, "-");
                    var c = color;
                    odlG.append("path")
                        .datum(lineData)
                        .attr("class", "line")
                        .style("stroke", c)
                        .style("fill", c)
                        .style("stroke-width", 0.1)

                        .attr("class", oldHoverClass)
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

        }

	}

		// Specify where to put label of text
            cell.append("text").attr({
               id: "t" + d.x + "-" + d.y + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
                x: function() { return (x(d.id) - 35); },
                y: function() { return (y(d.value) + 15); }
            })
            .text(function(d) {
              return d.name;  // Value of the text
            });
        
}