/*Javascript to handle US Debt-GDP data
  depends:    D3, http://d3js.org/d3.v3.min.js
  stylesheet: debt-styles.css
  data:       debt-data.txt
  author:     Jack Horne <jack@jackhorne.net>
  updated:    2015-02-XX
*/

//NON-GRAPH ELEMENTS
var debt_button = d3.select("#chart").append("button")
	.attr("id", "debt_button")
	.attr("class", "first")
	.text(" Debt ");
	
var shar_button = d3.select("#chart").append("button")
	.attr("id", "shar_button")
	.attr("class", "last active")
	.text("Share of GDP");
	
d3.select("#chart").append("p");

var tooltip = d3.select("#chart").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);
	
var dFmt = d3.format("$,f"),
	pFmt = d3.format(".1%");
	
var labels = ["Federal Accounts", 
              "Public: Federal Reserve", 
			  "Public: All Other"];


//INITIALIZE NON-DATA DEPENDENT GRAPH ELEMENTS
var margin = {top: 20, right: 20, bottom: 30, left: 50},
	width = 960 - (margin.left + margin.right),
	height = 500 - (margin.top + margin.bottom);
	
var svg = d3.select("#chart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top * 2 + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + ", " + (margin.top + 14) + ")" );

var x = d3.scale.linear()
		.range([0,910]) .domain([1940,2015]),
	xAxis = d3.svg.axis().scale(x) 
		.ticks(10) .orient("top") 
		.tickSize(height) .tickFormat(d3.format("d"));
		
var y = d3.scale.linear()
		.range([height, 0]) .domain([0,1.3]),
	yAxis = d3.svg.axis().scale(y) 
		.ticks(10) .orient("right") 
		.tickSize(width + 20) .tickFormat(d3.format(".0%"));
		
var color = d3.scale.ordinal()
	.range(["#aad",  "#71718e", "#556"]);

		
//FETCH AND PROCESS DATA
d3.tsv("debt-data.txt", function(error, data) {

	//do calculations
	color.domain(d3.keys(data[0]).filter(function(key) {
		return key == "debt_pub_all_other" || key == "debt_pub_fed_res" || key == "debt_gov_fed_accts"; } ) );

	data.forEach(function(d) {
		var y0 = 0;
		d.debt_src = color.domain().map(function(name) {
			return { name: name, y0: y0, y1: y0 += +d[name] }; } );
		d.debt_share = d.debt_gross / d.gdp;
		y0 = 0;
		d.debt_src_share = color.domain().map(function(name) {
			return { name: name, y0: y0, y1: y0 += +d[name] / d.gdp }; } );
	} );
			
	//x-axis
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0, " + height + ")" )
		.call(xAxis)
		.call(customXAxis);
		
	function customXAxis(g) {
		g.selectAll("text")
			.attr("x", 0) .attr("dy", 466) .attr("style", "text-anchor: start");
	}
	
	//content
	var year = svg.selectAll(".year")
			.data(data)
		.enter().append("g")
			.attr("class", "bar")
			.attr("transform", function(d) { return "translate(" + (x(d.fy) + 0.75) + ", 0)"; } );
			
	var tiers = year.selectAll("rect")
		.data(function(d) { return d.debt_src_share; } );
		
	tiers.enter().append("rect")
		.attr("width", 0)
		.attr("y", function(d) { return y(d.y0); } )
		.attr("height", 0)
		.style("fill", function(d) { return color(d.name); } );
	
	tiers.transition()
		.duration(1200)
		.delay(function(d, i) { return i * 800; } )
		.attr("width", 11)
		.attr("y", function(d) { return y(d.y1); } )
		.attr("height", function(d) { return y(d.y0) - y(d.y1); } );
						
	//y-axis
	//draw last so that grid lines are in front of chart data
	var yScale = svg.append("g")
		.attr("class", "axis")
		.call(yAxis)
		.call(customYAxis);
		
	function customYAxis(g) {
		g.selectAll("text")
			.attr("x", -6) .attr("dy", 6) .attr("style", "text-anchor: end");
	}
	
	//legend
	var legend = svg.selectAll(".legend")
			.data(color.domain().slice().reverse())
		.enter().append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) { return "translate(0," + (i * 20 - 32) + ")"; });
			
	legend.append("rect")
		.attr("x", width - 18)
		.attr("width", 12)
		.attr("height", 12)
		.style("fill", color);

	legend.append("text")
		.attr("x", width - 24)
		.attr("y", 6)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d,i) { return labels[i]; });
		
	var note = svg.append("g").append("text")
		.attr("x", 20)
		.attr("y", 20)
	
	//event listeners
	year.on("mouseover", function(d) {
		d3.select(this).attr("stroke", "steelblue") .attr("stroke-width", 0.75);
		tooltip.transition()
			.duration(200)
			.style("opacity", 1)
		tooltip.html(
				"<span class='fYear'>FY: " + d.fy + "</span>" + 
				" (end of fiscal year, September 30)<br/>" +
				"<span class='boxValue'>Gross Debt: " + dFmt(d.debt_gross) + "* (" +
				pFmt(d.debt_gross / d.gdp) + " of GDP)<br/>" +
				"Government Held, Federal Accts: " + dFmt(d.debt_gov_fed_accts) + "* (" +
				pFmt(d.debt_gov_fed_accts / d.gdp) + " of GDP)<br/>" +
				"Publicly Held, Federal Reserve: " + dFmt(d.debt_pub_fed_res) + "* (" +
				pFmt(d.debt_pub_fed_res / d.gdp) + " of GDP)<br/>" +
				"Publicly Held, All Other: " + dFmt(d.debt_pub_all_other) + "* (" +
				pFmt(d.debt_pub_all_other / d.gdp) + " of GDP)</span><br/>" +
				"* nominal USD in billions"
			)
			.style("left", (d3.event.pageX + ((d.fy < 1982) ? 10 : -350)) + "px")
			.style("top", (d3.event.pageY - 42) + "px");
	} );
	
	year.on("mouseout", function(d) {
		d3.select(this).attr("stroke", "none");
		tooltip.transition()
			.duration(500)
			.style("opacity", 0);
	} );
	
	debt_button.on("click", function() { var z = this; update(z); } );
	shar_button.on("click", function() { var z = this; update(z); } );
	
	function update(z) {
	
		d3.select(".active").classed("active", false);
		d3.select(z).classed("active", true);
		
		tiers.exit().remove();
		
		if(z.id == "debt_button") {
			y.domain([0,20000]);
			yAxis.tickFormat(d3.format("$,f"));
			note.text("nominal USD in billions");
		}
		
		if(z.id == "shar_button") {
			y.domain([0,1.3]);
			yAxis.tickFormat(d3.format(".0%"));
			note.text("");
		}
		
		yScale.call(yAxis) .call(customYAxis);
		
		tiers.data(function(d) {
			if(z.id == "debt_button") { return d.debt_src; }
			if(z.id == "shar_button") { return d.debt_src_share; }
		} );
		
		tiers.attr("width", 0)
			.attr("y", function(d) { return y(d.y0); } )
			.attr("height", 0);
			
		tiers.transition()
			.duration(1200)
			.delay(function(d, i) { return i * 800; } )
			.attr("width", 11)
			.attr("y", function(d) { return y(d.y1); } )
			.attr("height", function(d) { return y(d.y0) - y(d.y1); } );
	
	} //end update

} ); //end d3.tsv
		

