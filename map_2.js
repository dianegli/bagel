var color = d3.scaleSequential(d3.interpolateGnBu).domain([0, 120]);

var svg = d3.select("#maptest"),
    width = +svg.attr("width"),
    height = +svg.attr("height");


d3.json("test3.json", function(error, nyc) {
    if (error) throw error;

    var container = svg.append('svg')

    var path = d3.geoPath()
        .projection(d3.geoConicConformal()
            .parallels([33, 45])
            .rotate([96, -39])
            .fitSize([width, height], nyc));

    container.selectAll("path")
        .data(nyc.features)
        .enter().append("path")
        .attr("d", path)
        .attr("stroke-width", 0.2)
        .attr("stroke", "white")
        .attr('fill', function(d) { return color(Math.sqrt(d.properties.total_pop)); })

        .on("mouseenter", function(d) {
            console.log(d);

            d3.select(this)
                .style("stroke-width", 1.5)
                .style("stroke", "black")

            d3.select("#neighborhoodPopover")
                .transition()
                .style("opacity", 1)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px")
                .text(d.properties.ntaname + ", Total Population: " + d.properties.total_pop)

        })
        .on("mouseleave", function(d) {
            d3.select(this)
                .style("stroke-width", 0)
                .style("fill", function(d) { return color(Math.sqrt(d.properties.total_pop)); })

            d3.select("#cneighborhoodPopoverountyText")
                .transition()
                .style("opacity", 0);

        });

    console.log(nyc);
});