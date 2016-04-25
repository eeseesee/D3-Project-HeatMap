$(document).ready(function() {
  // data variables
  var dataURL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";
  var xColumn = "year";
  var yColumn = "month";
  var cColumn = "variance";
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var colors = ["#290AD8", "#264DFF", "#3FA0FF", "#72D9FF", "#AAF7FF", "#E0FFFF", "#f7f7f7", "#FFE099", "#FFAD72", "#F76D5E", "#D82632","#A50021"];
 function formatMonth(num) {
   if (num == 1) return "January";
   if (num == 2) return "February";
   if (num == 3) return "March";
   if (num == 4) return "April";
   if (num == 5) return "May";
   if (num == 6) return "June";
   if (num == 7) return "July";
   if (num == 8) return "August";
   if (num == 9) return "September";
   if (num == 10) return "October";
   if (num == 11) return "November";
   if (num == 12) return "December";
 }

  // display variables
  var margin = {
      top: 10,
      right: 40,
      bottom: 120,
      left: 100
    },
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
  var xLabel = "Year";
  var legendLabel = "Degrees Celsius From Average Temp";
  var legendWidth = 300;

  // render data to svg box
  function render(d) {

    // tool tip
    var tip = d3.tip()
      .attr('class', 'tooltip-custom')
      .offset([-10, 0])
      .html(function(d) {
        var temp = (Math.floor(d[cColumn] * 100) / 100);
        if (temp >= 0){
          return "<div>" + d[yColumn] + " " + d[xColumn] + "<br>"+temp+"&#8451; above average</div>";
        } else{
          temp = Math.abs(temp);
          return "<div>" + d[yColumn] + " " + d[xColumn] + "<br>"+temp+"&#8451; below average</div>";
        }
      })

    //
    var cMin = d3.min(d, function(d) {return d[cColumn] });
    var cMax = d3.max(d, function(d) {return d[cColumn] });

    var xMin = d3.min(d, function(d) {return d[xColumn] });
    var xMax = d3.max(d, function(d) {return d[xColumn] });

    var barWidth = Math.ceil(width / (xMax-xMin));
    var barHeight = Math.ceil(height / months.length);

  // Make scale
   //var xScale = d3.time.scale().range([0, width]).domain([xMin,xMax]);
   var xScale = d3.scale.linear().range([0, width]).domain([xMin,xMax]);
   var yScale = d3.scale.ordinal().rangeBands([0,height]).domain(months);
   var cScale = d3.scale.quantile().domain([cMin,cMax]).range(colors);

  // Make axes
  var xAxis = d3.svg.axis().scale(xScale).orient("bottom").tickFormat(d3.format("0000")).ticks(17);
  var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(12);

  // Initilize the chart size
  var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add axes
  chart.append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  chart.append("g")
    .append("text")
    .attr("class", "axisLabel")
    .attr("transform",
      "translate(" + (width / 2) + " ," +
      (height + margin.bottom - 80) + ")")
    .style("text-anchor", "middle")
    .text(xLabel);

  chart.append("g")
    .attr("class", "yAxis")
    .call(yAxis);

  // add tip
  chart.call(tip);

  // bind data
  var bars = chart.selectAll("rect")
    .data(d);

  // on enter
  bars.enter().append("rect")

  // on update
  bars
    .attr("class", "bar")
    .attr("x", function(d) {return xScale(d[xColumn]);})
    .attr("y", function(d) {return yScale(d[yColumn]);})
    .style("fill", function(d) {return cScale(d[cColumn]);})
    .attr("height", barHeight)
    .attr("width", barWidth)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  // add legend
  var legend = chart.selectAll(".legend")
    .data(cScale.quantiles());

  legend.enter().append("g")
    .attr("class", "legend");

  legend.append("rect")
    .attr("x", function(d, i) {
      return ((legendWidth/colors.length) * i + (width/2) - legendWidth/2 + (legendWidth/colors.length)/2);
    })
    .attr("y", height + margin.bottom - 55)
    .attr("width", legendWidth/colors.length)
    .attr("height", barHeight / 2)
    .style("fill", function(d, i) {
      return colors[i];
    });

  legend.append("text")
    .attr("class", "scales")
    .text(function(d) {
      return (Math.floor(d));
    })
    .attr("x", function(d, i) {
      return ((legendWidth/colors.length) * i + (width/2 - legendWidth/2) + (legendWidth/colors.length));
    })
    .attr("y",height + margin.bottom-25)
    .style("text-anchor", "middle");

  chart.append("text")
    .attr("class", "axisLabel")
    .text(legendLabel)
    .attr("x", width/2)
    .attr("y",height + margin.bottom-5)
    .style("text-anchor", "middle");

};

// get and format data
d3.json(dataURL, function(json) {
  var d = json.monthlyVariance;
  d.forEach(function(d){
    d.year = +d.year;
    d.month = formatMonth(d.month);
    d.variance = +d.variance;
  });
  render(d);
});

});
