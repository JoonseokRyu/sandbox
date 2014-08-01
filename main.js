 // Chart dimensions
 var w = 300,
     h = 300,
     r = 100; // was tested with values between 5 and 200

 // Progress variables
 var elapsed = 95;
 var remaining = 100 - elapsed;
 var overTime = 0;

 var refreshRate = 500; // in milliseconds
 var data = [[50, 25, 45, 70, 90, 20, 10, 80],
 [50, 25, 45, 70, 90, 20, 10, 80]];
 // var data = [50,10];
 var arc = d3.svg.arc()
     .outerRadius(r)
     .innerRadius(r *2/3);

 var pie = d3.layout.pie()
     .value(function(d) {
         return d.value;
     });

 var svg = d3.select("svg")
     // .append("svg")
     .attr("width", w)
     .attr("height", h)
     .attr("style", "display:block; margin: 0 auto;")
     .append("g")
     .attr("transform", "translate(" + r + "," + r + ")");

 function arcTween(a) {
     var i = d3.interpolate(this._current, a);
     this._current = i(0);
     return function(t) {
         return arc(i(t));
     };
 }

 // Hand picked colors for categories
 var color = d3.scale.ordinal()
     .domain([0,1,2,3])
     // .domain(["0", "1", "over-time"])
     .range(["#2d2d2d", "#d49514", "#ef23aa"]); // repectively: green, gray, orange

 function update(data) {

     var slices = d3.entries(data);
     var path = svg.selectAll("path")
         .data(pie(slices));
     path.enter()
         .append("path")
         .attr("fill", function(d, i) {
             return color(i);
         })
         .attr("filter", "url(#blurFilter)")
        .attr("d", arc)
         .each(function(d) {
             this._current = d;
         });
     path.transition()
         .duration(500)
     .attrTween("d", arcTween);

     if (r >= 30) {
         // refresh progress label if font size allows
         svg.selectAll("text")
             .remove();
         svg.append("text")
             .attr("x", 0)
             .attr("y", 0 + r / 6)
             .attr("fill", "#cccccc")
             .attr("stroke", "#666666")
             .style("text-anchor", "middle")
             // .attr("font-weight", "bold")
             .style("font-size", r / 2.5 + "px")
             .text("75");

         svg.append("text")
             .attr("x", 0)
             .attr("y", 1.5*r)
             .attr("fill", "#cccccc")
             .attr("stroke", "#666666")
             .style("text-anchor", "middle")
             // .attr("font-weight", "bold")
             .style("font-size", r / 2.5 + "px")
             .text("CPU");
     }

     path.exit()
         .remove();
 }

var next = 0;
 setInterval(function() {
    // var d  = data[next];
    // next = (++next) % data.length;

     update(data);
 }, refreshRate);