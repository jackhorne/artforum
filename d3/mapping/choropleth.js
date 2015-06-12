
/*Javascript to handle Oregon Electoral Map
  depends:    D3, http://d3js.org/d3.v3.min.js
              queue, http://d3js.org/qyeye.v1.min.js
  stylesheet: or_map_styles.css
  version:    0.0.0
  updated:    2015-02-XX
  author:     Jack Horne <jack@jackhorne.net>*/

var body = d3.select("body");

var width=900,
	height=700;
	
var cFmt = d3.format(",f"),
    pFmt = d3.format(".1%");
	
var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);

var dById = d3.map();
	
var q = d3.scale.quantize()
	.domain([-.55, .55])
	.range(d3.range(8).map(function(i) { return "q" + i + "-8"; } ));

var projection = d3.geo.mercator()
		.scale(6000)
		.translate([13100, 5500]);
	
var path = d3.geo.path()
	.projection(projection);
	
queue()
	.defer(d3.json, "or_counties_map.json")
	.defer(d3.tsv, "or_votes.txt", function(d) { 
		dById.set(d.id, [d.obama_margin, d.obama, d.romney, d.obama_pct, d.romney_pct]); 
	} )
	.await(ready);
	
var tooltip = body.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

function ready(error, oregon) {

	svg.selectAll("path")
			.data(oregon.features)
		.enter().append("path")
			.attr("d", path)
			.attr("id", function(d) { return d.properties.name; } )
			.attr("class", function(d) { return q(dById.get(d.properties.name)[0]); } )
			.on("mouseover", function(d) {
				tooltip.transition()
					.duration(200)
					.style("opacity", 1);
				tooltip.html(
					"<span class='countyName'>" + d.properties.name + "</span>" +
					"<br/>" +
					"<span class='electionResult'>Obama: " + 
						cFmt(dById.get(d.properties.name)[1]) + 
						" (" + pFmt(dById.get(d.properties.name)[3]) + ")<br/>" +
					"Romney: " +
						cFmt(dById.get(d.properties.name)[2]) +
						" (" + pFmt(dById.get(d.properties.name)[4]) + ")" +
					"</span>"
				)
					.style("left", (d3.event.pageX + 15) + "px")
					.style("top", (d3.event.pageY - 15) + "px");
			} )
			.on("mouseout", function(d) {
				tooltip.transition()
					.duration(500)
					.style("opacity", 0);

			} );
			
}