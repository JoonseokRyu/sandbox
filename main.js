 // Chart dimensions
    var w = 400,
        h = 400,
        r = 100;  // was tested with values between 5 and 200

    // Progress variables
    var elapsed = 95;
    var remaining = 100 - elapsed;
    var overTime = 0;

    var refreshRate = 1000; // in milliseconds

    var arc = d3.svg.arc()
        .outerRadius(r)
        .innerRadius( r - (r/3) );

    var pie = d3.layout.pie().value(function (d) { return d.value });

    var svg = d3.select(".space")
        .append("svg")
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
        .domain(["elapsed", "remaining", "over-time"])
        .range(["#339933", "#E6E6E6", "#FF9900"]); // repectively: green, gray, orange

    function update(data) { 
        if( elapsed < 100 ) {
            elapsed += (refreshRate/1000);
            remaining -= (refreshRate/1000);
        } else {
            overTime += (refreshRate/1000);
        }
        
        data = data ? data : { 
            "elapsed": elapsed,
            "remaining": remaining,
            "overTime": overTime
        };
        
        var slices = d3.entries(data);
        var path = svg.selectAll("path").data(pie(slices)); 
        path.enter()
            .append("path")
            .attr("fill", function(d, i) { return color(i); } )
            .attr("d", arc)
            .each(function(d) { this._current = d; });                  
        path.transition()
            .duration(100)
            .attrTween("d", arcTween);
        

        if( r >= 30 ) {
            // refresh progress label if font size allows
            svg.selectAll("text").remove();
            svg.append("text") 
                .attr("x", 0 )
                .attr("y", 0 + r/10 )
                .attr("fill", "#E6E6E6")        
                .attr("stroke", "#B2B2B2") 
                .style("text-anchor", "middle")
                .attr("font-weight", "bold")
                .style("font-size", r/2.5+"px")         
                .text(elapsed + "%");
            
            if( overTime > 0 ) {
                var overTimeLabel="+" + overTime + "s";
                if(overTime > 60) {
                    overTimeLabel = "+" + Math.floor((overTime/60)) + "m " + (overTime%60) + "s";
                }
                svg.append("text") 
                    .attr("x", 0 )
                    .attr("y", 0 + r/2.5 )
                    .attr("fill", "#FFCC80")        
                    .attr("stroke", "#B26B00") 
                    .style("text-anchor", "middle")
                    .attr("font-weight", "bold")
                    .style("font-size", r/4+"px")         
                    .text(overTimeLabel);            
            }
        }
        
        path.exit().remove();
    }
    
    setInterval(function() { update(); }, refreshRate);