
var selectUsers = [];
var selectedUserIndex = [];
var dw = 200;
var dh = 200;
var numberFormat = d3.format(".2s");
var svdCallFlag = false;
var lassoNumber = 0;
var test = [];
var newLassoFlag = false;
function ScatterPlot(data, divId, Scase, w,h)
{


    data.forEach(function(d1) {
        d1.timeG15 = +d1.timeG15;
        d1.timeL3 = +d1.timeL3;
        d1.noOfNonMetaPages = +d1.noOfNonMetaPages;
        d1.noOfMetaPages = +d1.noOfMetaPages;
        d1.mtimeL3 = +d1.mtimeL3;
        d1.mtimeG15 = +d1.mtimeG15;
        d1.timeG3L15 = +d1.timeG3L15;
    });


  selectUsers = [];
var divId =  "#" + divId;

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;


// set the ranges
////console.log("Width: "+width+" Height: "+height);
var xLinear = d3.scaleLinear().range([0, width]);
var yLinear = d3.scaleLinear().range([height, 0]);

var x = d3.scaleLog().range([0, width]);
var y = d3.scaleLog().range([height, 0]);



var svg = d3.select(divId).append("svg").attr("id", "lassoNumber"+lassoNumber)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
lassoNumber+=1;
 var g = svg.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
    

  g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left+ 10)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size","10")
      .text(GetPlotLabels(Scase,"y"));


 g.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 10) + ")")
      .style("text-anchor", "middle")
      .style("font-size","10")
      .text(GetPlotLabels(Scase,"x"));




  // Scale the range of the data
  ////console.log(d3.extent(data, function(d) { return GetRightPlot(d,Scase,"x"); }));
  xLinear.domain(d3.extent(data, function(d) { return GetRightPlot(d,Scase,"x"); }));
  yLinear.domain(d3.extent(data, function(d) { return GetRightPlot(d,Scase,"y"); }));

  x.domain(d3.extent(data, function(d) { return GetRightPlot(d,Scase,"x"); }));
  y.domain(d3.extent(data, function(d) { return GetRightPlot(d,Scase,"y"); }));


  // Add the scatterplot
  var circles= g.selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("r", 1)
	  .attr("id", function(d){ return "circleId_"+d.userIndex;})
      .attr("cx", function(d) { return xLinear(GetRightPlot(d,Scase,"x")); })
      .attr("cy", function(d) { return yLinear(GetRightPlot(d,Scase,"y")); })
      .attr("class", function (d) {
          if(d.color == "#F6B67F")
          {
			  
              return "benignUser";
          }
          else
          {
			 
              return "vandalUser";
          }
      })
      .style("fill", function(d) { return ("" + d.color + ""); });


var lasso_start = function() {
			
            lasso.items()
                .attr("r",1) // reset size
                .classed("not_possible",true)
                .classed("selected",false);
        };

        var lasso_draw = function() {
        
            // Style the possible dots
            lasso.possibleItems()
                .classed("not_possible",false)
                .classed("possible",true);

            // Style the not possible dot
            lasso.notPossibleItems()
                .classed("not_possible",true)
                .classed("possible",false);
        };

        var lasso_end = function() {
			
			
			////console.log(d3.selectAll("#scatterPlot .lasso"));
			////console.log(lasso);
            // Reset the color of all dots
            lasso.items()
                .classed("not_possible",false)
                .classed("possible",false);
			
            // Style the selected dots
            lasso.selectedItems()
                .classed("selected",true)
                .attr("r",3);
			
		// //console.log(lasso.selectedItems()._groups[0]);
		var seletedPoints = lasso.selectedItems()._groups[0];

		 selectUsers = [];selectedUserIndex=[];
		for(var i=0;i<seletedPoints.length; i++)
		{
			selectedUserIndex.push(lasso.selectedItems()._groups[0][i].__data__.userIndex);
			selectUsers.push(lasso.selectedItems()._groups[0][i].__data__);

		}
		////console.log(data);
		/*for(var j=0; j<data.length; j++){
			for(var k=0; k<selectUsers.length; k++){
				if(data[j].key === selectUsers[k].key){
					test.push(data[j]);
				}
			}
		}
		//console.log(test);
		//console.log("selectedUserIndex");
		//console.log(selectedUserIndex);*/
		var circles = d3.selectAll("circle");
		d3.selectAll("circle").attr("r",1);
		for(var i=0; i< circles._groups[0].length; i++){
			for(var j=0; j<selectedUserIndex.length; j++){
				var circleId = circles._groups[0][i].id.substr(circles._groups[0][i].id.indexOf("_")+1);
				////console.log(circleId);
				if(circleId == selectedUserIndex[j]){
					////console.log(circles._groups[0][i]);
					circles._groups[0][i].setAttribute("r",3);
				}
			}
		}
		////console.log(circles);
			
		////console.log("selected users ------------->");
		////console.log(selectUsers);
		////console.log(data);
		////console.log("selected users based on their index------------->");
		for(var i=0; i<data.length; i++){
			for(var j=0; j<selectedUserIndex.length; j++){
				if(data[i].userIndex == selectedUserIndex[j]){
					////console.log(data[i]);
					//newLassoFlag = true;
				}
			}
		}
		heatMap(selectedUserIndex);


		// //console.log(seletedPoints.length);

		var selectedObjs = [];
		for(var i = 0;i < seletedPoints.length;i++ )
		{
			selectedObjs.push(seletedPoints[i].__data__);
		}

					// Reset the style of the not selected dots
				lasso.notSelectedItems()
				.attr("r",1);

		};
        
        var lasso = d3.lasso()
            .closePathSelect(true)
            .closePathDistance(100)
            .items(circles)
            .targetArea(svg)
			
			//.targetArea(d3.select(divId))
            .on("start",lasso_start)
            .on("draw",lasso_draw)
            .on("end",lasso_end);
        
        svg.call(lasso);
		
		 ////console.log(lasso.selectedItems());
		//d3.select("table").call(lasso);
//var selectAllLasso = d3.selectAll("#scatterPlot .lasso");
		

	
  // Add the X Axis
  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      //.style("opacity","0.2")
	  //.call(d3.axisBottom(x).ticks(5).tickFormat(logFormat));
      .call(d3.axisBottom(xLinear).ticks(5));

  // Add the Y Axis
  g.append("g")
	//.call(d3.axisLeft(y).ticks(5).tickFormat(logFormat));
      .call(d3.axisLeft(yLinear).ticks(5));

	if(!svdCallFlag){
		//ungroupObjects(data);
		svdCallFlag = true;
	}

}




function  GetPlotLabels(scase,axis) {

    switch(scase)
    {
        case "crsVsCrv":



            if(axis == "x")
                return "Crs";
            else
                return "Crv";
            break;

        case "CrnVsCrm":
            if(axis == "x")
                return "Crn";
            else
                return "Crm";
            break;
        case "CrsVsCrvs":
            if(axis == "x")
                return "Crs";
            else
                return "Crvs";
            break;
        case "CrsmVsCrvm":
            if(axis == "x")
                return "Crsm";
            else
                return "Crvm";
            break;
        case "EditsVsReverts":
        if(axis == "x")
            return "Edits";
        else
            return "Reverts";
        break;
        case "crvsVsCrs":
            if(axis == "x")
                return "Crvs";
            else
                return "Crs";
            break;

    }

}

function GetRightPlot(d,scase,axis)
{
	switch(scase)
	{
		case "crsVsCrv":



			if(axis == "x")
				return d.timeG15;
			else
				return d.timeL3;
		break;

		case "CrnVsCrm":
			if(axis == "x")
				return d.noOfNonMetaPages;
			else
				return d.noOfMetaPages;
			break;
		case "CrsVsCrvs":
			if(axis == "x")
				return d.timeL3;
			else
				return d.timeG3L15;
			break;
		case "CrsmVsCrvm":
			if(axis == "x")
				return d.mtimeL3;
			else
				return d.mtimeG15;
			break;
        case "EditsVsReverts":
            if(axis == "x")
                return d.numOfGoodEdits;
            else
                return d.numOfBadEdits;
            break;

        case "crvsVsCrs":
            if(axis == "x")
                return d.timeG15;
            else
                return d.timeG3L15;
            break;


	}
}
function logFormat(d) {
    var x = Math.log(d) / Math.log(10) + 1e-6;
    return Math.abs(x - Math.floor(x)) < .7 ? numberFormat(d) : "";
  }