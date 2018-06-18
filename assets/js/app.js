// D3 Scatterplot Assignment

// Students:
// =========
// Follow your written instructions and create a scatter plot with D3.js.

// Define SVG area dimensions
var svgWidth = 1000;
var svgHeight = 1000;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };
  
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//import data from csv
d3.csv("./assets/js/data.csv", function(error, StateData) {
    if (error) throw error;
    console.log(StateData);

    // parse data
    StateData.forEach(function(data) {
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
    });

        // xLinearScale function above csv import
    var xLinearScale = d3.scaleLinear()
     .domain(d3.extent(StateData, d=> d.income))
     .range([0, width]);

     // Create y scale function
    var yLinearScale = d3.scaleLinear()
     .domain([0, d3.max(StateData, d => d.obesity)])
     .range([height, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

     // append y axis
     chartGroup.append("g")
       .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
       .data(StateData)
       .enter()
       .append("circle")
       .attr("cx", d => xLinearScale(d.income))
       .attr("cy", d => yLinearScale(d.obesity))
       .attr("r", 20)
       .attr("fill", "darkseagreen")
       .attr("opacity", ".5");
    
    //var circletext = chartGroup.selectAll("text")
    //    .data(StateData)
    //    .enter()
    //    .append("text")
    //    .text(d => d.abbr)
    //    .attr("x", d => xLinearScale(d.income))
    //    .attr("y", d => yLinearScale(d.obesity))
    //    .attr("font_family", "georgia")  // Font type
    //    .attr("font-size", "9.5px")  // Font size
    
    // Step 1: Initialize Tooltip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Obesity (%): ${d.obesity}<br>Income ($): ${d.income}`);
      });
    
    // Step 2: Create the tooltip in chartGroup.
    chartGroup.call(toolTip);

    // Step 3: Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function(d) {
        toolTip.show(d);
    })
    // Step 4: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
          toolTip.hide(d);
        });
 
 // text label for the x axis
 svg.append("text")             
 .attr("transform",
       "translate(" + (width/1.5) + " ," + 
                      (height + margin.bottom) + ")")
 .style("text-anchor", "middle")
 .text("Median Household Income ($)");

// text label for the y axis
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+125)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Obesity (%)");     

svg.append("text")
    .attr("x", (width / 1.5))             
    .attr("y", 0 - ((margin.top-50) / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "20px") 
    .style("text-decoration", "underline")  
    .text("Median Household Income vs. Obesity");

});
