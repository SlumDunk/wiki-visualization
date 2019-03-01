/**
 * add the scale time line on viz.html
 */
function setTheTimeLine() {

    let margin = {top: 20, right: 40, bottom: 20, left: 40},
        width = 1280 - margin.left - margin.right,
        height = 60 - margin.top - margin.bottom;

    let timeAxis = d3.scaleTime()
        .domain([new Date(2012, 1, 1), new Date(2014, 12, 31)])
        .rangeRound([0, width]);

    let svg = d3.select("#timeLine").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "axis axis--grid")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(timeAxis)
            .ticks(15)
            .tickSize(-height)
            .tickFormat(function () {
                return null;
            }))
        .selectAll(".tick")
        .classed("tick--minor", function (d) {
            return d.getHours();
        });

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(timeAxis)
            .ticks(15)
            .tickPadding(0))
        .attr("text-anchor", null)
        .selectAll("text")
        .attr("x", 6);

    //define the brush
    let brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on("end", brushended);

    let brushObj = svg.append("g")
        .attr("class", "brush")
        .call(brush);
    //set the default start time and end time
    let startDate = new Date('December 1, 2013 00:00:00');
    let endDate = new Date('December 05, 2013 00:00:00');
    setTimeRange(startDate, endDate);
    brushObj.call(brush.move, [startDate, endDate].map(timeAxis));

    /**
     * call when brush end drawing
     */
    function brushended() {
        if (!d3.event.sourceEvent) return; // Only transition after input.
        if (!d3.event.selection) return; // Ignore empty selections.
        //get the selected range
        let selectedScaleRange = d3.event.selection.map(timeAxis.invert),
            //transfer to the time range
            selectedTimeRange = selectedScaleRange.map(d3.timeDay.round);
        //set 1st dimension and 2nd dimension
        setXandYvalues(0, 1);
        // If empty when rounded, use floor & ceil instead.
        if (selectedTimeRange[0] >= selectedTimeRange[1]) {
            selectedTimeRange[0] = d3.timeDay.floor(selectedScaleRange[0]);
            selectedTimeRange[1] = d3.timeDay.offset(selectedTimeRange[0]);
        }
        //set the new start time and date time
        setTimeRange(selectedTimeRange[0], selectedTimeRange[1]);
        //clear the old data state
        pagesEditedBySameUsers.clear();
        //render the new scatter plots
        GenerateScatterPlot({"from": selectedTimeRange[0], "to": selectedTimeRange[1]});

        d3.select(this).transition().call(d3.event.target.move, selectedTimeRange.map(timeAxis));
    }

}