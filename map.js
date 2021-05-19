//reference: https://bl.ocks.org/d3noob/7030f35b72de721622b8
//reference: https://medium.com/@louisemoxy/a-simple-way-to-make-d3-js-charts-svgs-responsive-7afb04bc2e4b
// https://stackoverflow.com/questions/65553402/d3-change-svg-dimensions-on-resize-window
//http://bl.ocks.org/pstuffa/38111aa2e3077baa67f1d0c42df9bf08
// https://bl.ocks.org/martgnz/56664c7ea8efef56f93ca948ef855d06
//http://bl.ocks.org/enactdev/a647e60b209e67602304


var default_width = 600;
var default_height = 700;
var default_ratio = default_width / default_height;

var margin = { top: 150, right: 10, bottom: 10, left: 150 },
    width = default_width - margin.left - margin.right,
    height = default_height - margin.top - margin.bottom;


// Determine current size, which determines vars
function set_vars() {
    //alert('setting vars')
    current_width = window.innerWidth;
    current_height = window.innerHeight;

    current_ratio = current_width / current_height;

    // Check if height is limiting factor
    if (current_ratio > default_ratio) {
        h = current_height;
        w = h * default_ratio;
        // Else width is limiting
    } else {
        w = current_width;
        h = w / default_ratio;
    }


    if (current_width <= 430) {
        h = 500
        w = 500
        margin.top = 0;
        margin.bottom = 0;

    } else {
        margin.top;
        margin.bottom;

    };
    // Set new width and height based on graph dimensions
    width = w - margin.left - margin.right;
    height = h - margin.top - margin.bottom;

};

set_vars();
console.log(width)

function drawGraphic() {

    d3.json("data/cen_tract_nta_final_geo.json", function(error, nyc) {
        if (error) throw error;

        var color = d3.scaleSequential(d3.interpolateYlGnBu).domain([0, 16]);



        /*
            var viewportWidth = $(window).width();
            var viewportHeight = $(window).height();

            if (viewportWidth <= 430) {
                width = viewportWidth / 1.3;
            } else {
                width = 700;
            };

            if (viewportWidth <= 700) {
                height = viewportHeight/ 1.7;
            } else {
                height = 700;
            };*/




        // var width = viewportWidth;
        // var height = viewportHeight/1.3

        // d3.select("#maptest").append("input")
        //  .attr("type", "button")
        //  .attr("value", "Show me the places with Good Bagels!")
        //  .attr("onclick", "updateData()");


        var svg = d3.select("#maptest")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("border", "1px solid black")
            .style("background-color", "white")
            .style("border-radius", "1em");
        //    .attr("viewBox", "0 0 " + viewportWidth_final + " " + viewportHeight/1.3)
        //    .attr("preserveAspectRatio", "xMidYMid meet")
        // .style("background-color", '#b3befc');



        var g = svg.append("g");


        var zoom = d3.zoom()
            .scaleExtent([1, 40])
            //  .translateExtent([
            //      [-500, -300],
            //      [1500, 1000]
            //  ])
            .on('zoom', () => {
                g.attr('transform', d3.event.transform)
            });


        d3.select("#zoom_in").on("click", function() {
            zoom.scaleBy(svg.transition().duration(750), 1.2);
        });
        d3.select("#zoom_out").on("click", function() {
            zoom.scaleBy(svg.transition().duration(750), 0.8);
        });

        d3.select("#reset").on("click", function() {
            svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
        });

        svg.call(zoom);

        svg.append("g")
            .attr("class", "legendSequential")
            .attr("transform", "translate(" + ((width / 2) - 80) + "," + height / 1.09 + ")");
        //  .attr("transform", "translate(" + width / 1.5 + "," + height / 1.07 + ")");

        var legendSequential = d3.legendColor()
            .shapeWidth(30)
            .cells(5)
            .orient('horizontal')
            .scale(color);

        svg.select(".legendSequential").call(legendSequential);


        var path = d3.geoPath()
            .projection(d3.geoConicConformal()
                .parallels([33, 45])
                .rotate([96, -39])
                .fitSize([width, height], nyc));

        g.selectAll("path")
            .data(nyc.features)
            .enter().append("path")
            .attr("d", path)
            .attr("stroke-width", 0.20)
            .attr("stroke", "black")
            .attr('fill', function(d) { return d.properties.park_cemetery_flag == 1 ? '#F5F5F5' : color(d.properties.n_bagel_shops); })

            .on("mouseenter", function(d) {

                d3.select(this)
                    .style("stroke-width", 1.5)
                  //  .style("opacity", 0.5)
                   // .style("stroke-dasharray", 3)

                d3.select("#neighborhoodPopover")
                    //  .transition()
                    //   .style("font-family", 'Roboto Mono')
                    .style("opacity", 1)
                    .style("color", 'black')
                    .style("padding", "0.2em")
                    .style("font-size", "0.5em")
                    .style("background-color", "#e5f5e0")
                    .style("left", (d3.event.pageX) + 10 + "px")
                    .style("top", (d3.event.pageY) - 30 + "px")
                    .html("<strong>" + d.properties.NTAName + "</strong>" + "<br/>" + "🥯 Shops: " + d.properties.n_bagel_shops)

            })
            .on("mouseleave", function(d) {
                d3.select(this)
                    .style("stroke-width", 0.20)
                //    .style("opacity", 1)

                 d3.select("#neighborhoodPopover").style("opacity", 0)
                   // .style("stroke-dasharray", 0)

            })


    });

};

drawGraphic();

// Use a timer so the chart is not constantly redrawn while window is being resized.
var resizeTimer;
window.onresize = function(event) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        var s = d3.select("#maptest").selectAll('svg');
        s = s.remove();
        set_vars();
        drawGraphic();
    }, 1000);
}


//https://stackoverflow.com/questions/55147410/html-javascript-button-click-again-to-undo

var flag = true;

function updateData() {

    var color = d3.scaleSequential(d3.interpolateYlGnBu).domain([0, 16]);

    if (flag) {

        d3.select("#maptest")
            .select("svg")
            .selectAll("g")
            .selectAll("path")
            .transition(200)
            .attr('fill', function(d) { return d.properties.park_cemetery_flag == 1 ? '#F5F5F5' : color(d.properties.n_bagel_shops); })
            //    .style("stroke", function(d) { return ((d.properties.rating_num >= 3.5) ? 'black' : 'white'); })
            //.attr("stroke-width", function(d) { return ((d.properties.rating_num >= 4) ? 0.6 : 0.1); })
            //.attr("opacity", function(d) { return ((d.properties.rating_num >= 4) ? 1 : 0.9); })
            //  .style("fill", function(d) { return ((d.properties.rating_num >= 4) ? '#D8A499' : 'light grey'); })
            .style("opacity", function(d) { return ((d.properties.rating_num >= 4) ? 1 : 0.2); })


        //  d3.select("#maptest")
        //     .select("g.legendSequential")
        //     .transition(200)
        //     .remove()

    } else {


        d3.select("#maptest")
            .select("svg")
            .selectAll("g")
            .selectAll("path")
            .transition(200)
            .style("opacity", 1)

    }

    flag = !flag

};


function reset() {
    svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity,
        d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
    );
};