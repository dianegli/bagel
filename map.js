//reference: https://bl.ocks.org/d3noob/7030f35b72de721622b8


d3.json("test3.json", function(error, nyc) {
    if (error) throw error;

    var color = d3.scaleSequential(d3.interpolateGnBu).domain([0, 120]);

    var width = 800;
    var height = 820;


    d3.select("#maptest").append("input")
        .attr("type", "button")
        .attr("value", "Toggle")
        .attr("onclick", "togglePressed()");


    var svg = d3.select("#maptest")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", '#E8F8F5');



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
        .attr("stroke-width", 0.2)
        .attr("stroke", "white")
        .attr('fill', function(d) { return color(Math.sqrt(d.properties.total_pop)); })

        .on("mouseenter", function(d) {
            console.log(d);

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

            d3.select("#neighborhoodPopoverountyText")
                .transition()
                .style("opacity", 0);

        });
});

function togglePressed() {
    d3.select("#maptest").select("svg").transition().style("background-color", '#000000');
    console.log("hello");

};