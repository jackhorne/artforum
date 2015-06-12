var width=900,
	height=700;
	
var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);

var projection = d3.geo.mercator()
		.scale(6000)
		.translate([13100, 5500]);
	
var path = d3.geo.path()
	.projection(projection);

d3.json("or_counties_map.json", function(error, oregon) {
	if (error) return console.error(error);
	
	console.log(oregon);
	
	svg.selectAll("path")
			.data(oregon.features)
		.enter().append("path")
			.attr("d", path)
			.attr("id", function(d) { return d.properties.name; } );
} );