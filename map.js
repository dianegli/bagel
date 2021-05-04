//reference: https://bl.ocks.org/d3noob/7030f35b72de721622b8
//reference: https://medium.com/@louisemoxy/a-simple-way-to-make-d3-js-charts-svgs-responsive-7afb04bc2e4b
// https://stackoverflow.com/questions/65553402/d3-change-svg-dimensions-on-resize-window


d3.json("data/tract_cen_bagels_geo.json", function(error, nyc) {
    if (error) throw error;

    var color = d3.scaleSequential(d3.interpolateGnBu).domain([0, 120]);

    var viewportWidth = $(window).width();
   // console.log(viewportWidth);
    var viewportHeight = $(window).height();
   // var width = viewportWidth*2.5;
   // var height = viewportHeight;

   if (viewportWidth <= 375) {
  viewportWidth_final = viewportWidth;
} else {
  viewportWidth_final = viewportWidth/2;
};

     // var width = viewportWidth;
     // var height = viewportHeight/1.3;

      var width = viewportWidth_final;
      var height = viewportHeight/1.3;

   // d3.select("#maptest").append("input")
      //  .attr("type", "button")
      //  .attr("value", "Show me the places with Good Bagels!")
      //  .attr("onclick", "updateData()");


    var svg = d3.select("#maptest")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", "0 0 " + viewportWidth_final + " " + viewportHeight/1.3)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("background-color", 'white');



    var g = svg.append("g");


    var zoom = d3.zoom()
        .scaleExtent([1, 2])
        .translateExtent([
            [-500, -300],
            [1500, 1000]
        ])
        .on('zoom', () => {
            g.attr('transform', d3.event.transform)
        });

    svg.call(zoom);


    var path = d3.geoPath()
        .projection(d3.geoConicConformal()
            .parallels([33, 45])
            .rotate([96, -39])
            .fitSize([width, height], nyc));

    g.selectAll("path")
        .data(nyc.features)
        .enter().append("path")
        .attr("d", path)
        .attr("stroke-width", 0.1)
        .attr("stroke", "black")
        .attr('fill', function(d) { return color(Math.sqrt(d.properties.count_bagel_shops*1000)); })
        .style("opacity", 0.9)

        .on("mouseenter", function(d) {
            console.log(d);

            d3.select("#neighborhoodPopover")
                .transition()
                .style("opacity", 1)
                .style("font-family", 'Roboto Mono')
                .style("font-size", "1em")
                .style("background-color","#e5f5e0")
             //   .style("left", (d3.event.pageX) + "px")
             //   .style("top", (d3.event.pageY) + "px")
             //   .html("Neighborhood: <br>" +d.properties.ntaname)
               // .attr("dy", "0em")
                .text(d.properties.ntaname + "\n" + "# of 🥯 Shops: " +d.properties.count_bagel_shops)

        })
        .on("mouseleave", function(d) {
            d3.select(this)
                .style("fill", function(d) { return color(Math.sqrt(d.properties.count_bagel_shops*1000)); })
            d3.select("#neighborhoodPopoverountyText")
                .transition()
                .style("opacity", 0);

        })
});


function updateData() {
        var color = d3.scaleSequential(d3.interpolateGnBu).domain([0, 120]);

        d3.select("#maptest")
          .select("svg")
          .select("g")
          .selectAll("path")
          .transition()
      //    .style("stroke", function(d) { return ((d.properties.rating_num >= 3.5) ? 'black' : 'white'); })
          .attr("stroke-width", function(d) { return ((d.properties.rating_num >= 3.5) ? 0.6 : 0.1); })
          .attr("opacity", function(d) { return ((d.properties.rating_num >= 3.5) ? 1 : 0.9); })

};






