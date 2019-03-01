
var tooltipDivID = "mytooltipBubble";

function getBuble(data)
{
  var height = 350;
var width = 600;
let margin = 40;

console.log(data);

var ToolTip = {};
ToolTip.make = function (unique_id) {
    var div = document.createElement("div");
    div.setAttribute("id", unique_id);
    div.setAttribute("class", "ToolTip");//style
    return div;
};


var ticks = [
"0",
"2005",
"2006",
"2007",
"2008",
"2009",
"2010",
"2011",
"2012",
"Jan,2013",
"Feb,2013",
"Mar,2013",
"Apr,2013",
"May,2013",
"June,2013",
"Jul,2013",
"Aug,2013",
"Sep,203",
"Oct,2013",
"Nov,2013",
"Dec,2013",
"Jan,2014",
"Feb,2014",
"Mar,2014",
"Apr,2014",
"May,2014",
"June,2014",
"Jul,2014"
];
var labelX = 'X';
var labelY = 'Y';
var svg = d3.select('.chart')
                    .append('svg')
                    .attr('class', 'chart')
                    .attr("width", width + margin + margin)
                    .attr("height", height + margin + margin)
                    .append("g")
                    .attr("transform", "translate(" + margin + "," + margin + ")");
                    
var x = d3.scaleLinear()
                      .domain([d3.min(data, function (d) { return d.x; }), d3.max(data, function (d) { return d.x; })])
                      .range([0, width]);

var y = d3.scaleLinear()
                      .domain([d3.min(data, function (d) { return d.y; }), d3.max(data, function (d) { return d.y; })])
                      .range([height, 0]);

var scale = d3.scaleSqrt()
                      .domain([d3.min(data, function (d) { return d.size; }), d3.max(data, function (d) { return d.size; })])
                      .range([1, 20]);

var opacity = d3.scaleSqrt()
                      .domain([d3.min(data, function (d) { return d.size; }), d3.max(data, function (d) { return d.size; })])
                      .range([1, .5]);
                                
var color = d3.scaleOrdinal(d3.schemeCategory10);

var xAxis = d3.axisBottom()
    .scale(x).tickFormat(function(d) { return ticks[d]; });
//console.log(x);
 var yAxis = d3.axisLeft()
    .scale(y);
 
  svg.append("g")
                  .attr("class", "y axis")
                  .call(yAxis)
                  .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("x", 20)
                    .attr("y", -margin)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text(labelY);
                          // x axis and label
                          svg.append("g")
                              .attr("class", "x axis")
                              .attr("transform", "translate(0," + height + ")")
                              .call(xAxis)

                              .append("text")
                                  .attr("x", width + 20)
                                  .attr("y", margin - 10)
                                  .attr("dy", ".71em")
                                  .style("text-anchor", "end")
                                  .text(labelX);
 
var cirlce = svg.selectAll("circle")
                              .data(data)
                              .enter()
                              .insert("circle")
                              .attr("cx", width / 2)
                              .attr("cy", height / 2)
                              .attr("opacity", function (d) { return opacity(d.size); })
                              .attr("r", function (d) { return scale(d.size); })
                              .style("fill", function (d) { return color(d.c); })
                              .on('mouseover', function (d, i) {
                                 // fade(d.c, .1);


                                                                var exists = document.getElementById(tooltipDivID);
                                  if (exists == null) {
                                      var div = ToolTip.make(tooltipDivID);
                                      document.body.appendChild(div);
                                  }
                                  var tooltipdiv = document.getElementById(tooltipDivID);


                                  tooltipdiv.innerHTML = "Category: " + d.MainCategory + "<br/>Sub-Category: " + d.SubCategory ;
                                  tooltipdiv.setAttribute('style',
                                      'top:' + (parseInt(d3.event.pageY) + 10)  + 'px;' +
                                      'left:' + (parseInt(d3.event.pageX) + 10)  + 'px;' +
                                      'border: 2px solid ' + " #3876ad " + ';' +
                                      'border-radius: 2px;'+
                                      'background-color: #428dd1 ;'+
                                      'padding: 2px;'+
                                      'opacity: .7;' +
                                      'font-family: Arial,Helvetica;' +
                                      'font-size: 12px;' +
                                      'color: #fff;' +
                                      'position: absolute;');


                                 //alert(d.MainCategory);
                              })
                             .on('mouseout', function (d, i) {
                                 //fadeOut();
                                 var exists = document.getElementById(tooltipDivID);
                                  if (exists != null) {
                                     // var div = ToolTip.make(tooltipDivID);
                                      document.body.removeChild(exists);
                                  }
                             })
                             .transition()
                            .delay(function (d, i) { return x(d.x) - y(d.y); })
                            .duration(500)
                            .attr("cx", function (d) { return x(d.x); })
                            .attr("cy", function (d) { return y(d.y); })
                            .ease("bounce");


}
             


             function fade(c, opacity) {
                              svg.selectAll("circle")
                                  .filter(function (d) {
                                      return d.c != c;
                                  })
                                .transition()
                                 .style("opacity", opacity);
                          }

                          function fadeOut() {
                              svg.selectAll("circle")
                              .transition()
                                 .style("opacity", function (d) { opacity(d.size); });
                          }