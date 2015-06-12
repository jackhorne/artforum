/*Javascript to handle cheese.html
  depends:    D3, d3js.org/d3.v3.min.js
  stylesheet: cheese-sims.css
  data:       cheese_coeff.txt
  author:     Jack Horne <jack@jackhorne.net>
  updated:    2015-02-18*/

var dFmt = d3.format("$.2f"),
	pFmt = d3.format("0%"),
	gFmt = d3.format(",f"),
	rFmt = d3.format("$,f");
	
var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var x1 = d3.scale.linear()
    .range([0, 300])
	.domain([1,5])
	.clamp(true);
	
var x2 = d3.scale.linear()
	.range([0,300])
	.domain([0,1])
	.clamp(true);
	
var x3 = d3.scale.log()
	.range([0,300])
	.domain([100,100000]);
	
var b1 = d3.svg.brush()
    .x(x1)
    .extent([0,0])
    .on("brush", br1);
	
var b2 = d3.svg.brush()
	.x(x2)
	.extent([0,0])
	.on("brush", br2);
	
var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);

//DRAW PRICE SLIDER
var cx1 = svg.append("g")
		.attr("transform", "translate(20,12)");
	
cx1.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(150, 36)")
		.call(d3.svg.axis()
			.scale(x1)
			.orient("bottom")
			.ticks(5)
			.tickSize(2)
			.tickPadding(8)
			.tickFormat(d3.format("$0")));
			
cx1.append("text")
	.attr("class", "txtVal")
	.attr("x", 12)
	.attr("y", 30)
	.text("Retail Price");
			
cx1.append("rect")
	.attr("class", "sBox")
	.attr("x", 150)
	.attr("y", 16)
	.attr("width", 300)
	.attr("height", 20);
	
var s1 = cx1.append("g")
	.attr("transform", "translate(150,0)")
	.attr("class", "slider")
	.call(b1);
	
s1.selectAll(".extent, .resize").remove();

var ir1 = s1.append("rect")
	.attr("class", "intR1")
	.attr("x", 1)
	.attr("y", 17)
	.attr("height", 17)
	.attr("width", x1(2.49));

var h1 = s1.append("rect")
	.attr("class", "handle")
	.attr("transform", "translate(-6, 14)")
	.attr("x", x1(2.49))
	.attr("y", 0)
	.attr("height", 24)
	.attr("width", 12);
		
var t1 = cx1.append("text")
	.attr("class", "txtVal")
	.attr("x", 480)
	.attr("y", 30)
	.text(dFmt(2.49));

//DRAW DISPLAY SLIDER	
var cx2 = svg.append("g")
		.attr("transform", "translate(20,80)");
	
cx2.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(150, 36)")
		.call(d3.svg.axis()
			.scale(x2)
			.orient("bottom")
			.ticks(3)
			.tickSize(2)
			.tickPadding(8)
			.tickFormat(d3.format("0%")));
			
cx2.append("text")
	.attr("class", "txtVal")
	.attr("x", 12)
	.attr("y", 30)
	.text("Display %");
			
cx2.append("rect")
	.attr("class", "sBox")
	.attr("x", 150)
	.attr("y", 16)
	.attr("width", 300)
	.attr("height", 20);
	
var s2 = cx2.append("g")
	.attr("transform", "translate(150,0)")
	.attr("class", "slider")
	.call(b2);
	
s2.selectAll(".extent, .resize").remove();

var ir2 = s2.append("rect")
	.attr("class", "intR2")
	.attr("x", 1)
	.attr("y", 17)
	.attr("height", 17)
	.attr("width", x2(.2));

var h2 = s2.append("rect")
	.attr("class", "handle")
	.attr("transform", "translate(-6, 14)")
	.attr("x", x2(.2))
	.attr("y", 0)
	.attr("height", 24)
	.attr("width", 12);
		
var t2 = cx2.append("text")
	.attr("class", "txtVal")
	.attr("x", 480)
	.attr("y", 30)
	.text(pFmt(.2));
	
//DRAW OUTPUT SLIDERS
svg.append("text")
	.attr("class", "txtVal")
	.attr("x", 32)
	.attr("y", 188)
	.text("Predicted Sales");

//predicted volume
var cx3 = svg.append("g")
		.attr("transform", "translate(20,196)");
	
cx3.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(150, 36)")
		.call(d3.svg.axis()
			.scale(x3)
			.orient("bottom")
			.ticks(4, "s")
			.tickSize(2, 1)
			.tickPadding(8));
			
cx3.append("text")
	.attr("class", "txtVal2")
	.attr("x", 30)
	.attr("y", 30)
	.text("units/week");
			
cx3.append("rect")
	.attr("class", "sBox")
	.attr("x", 150)
	.attr("y", 16)
	.attr("width", 300)
	.attr("height", 20);
	
var ir3 = cx3.append("rect")
	.attr("class", "intR3")
	.attr("x", 151)
	.attr("y", 17)
	.attr("height", 17);

var h3 = cx3.append("path")
	.attr("class", "indctr")
	.attr("d", "M0,0 L5,24 L10,0 z");
	
var t3 = cx3.append("text")
	.attr("class", "txtVal")
	.attr("x", 480)
	.attr("y", 30);
	
//predicted revenue
var cx4 = svg.append("g")
		.attr("transform", "translate(20,250)");
	
cx4.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(150, 36)")
		.call(d3.svg.axis()
			.scale(x3)
			.orient("bottom")
			.ticks(4, "$s")
			.tickSize(2, 1)
			.tickPadding(8));
			
cx4.append("text")
	.attr("class", "txtVal2")
	.attr("x", 30)
	.attr("y", 30)
	.text("revenue/week");
			
cx4.append("rect")
	.attr("class", "sBox")
	.attr("x", 150)
	.attr("y", 16)
	.attr("width", 300)
	.attr("height", 20);
	
var ir4 = cx4.append("rect")
	.attr("class", "intR3")
	.attr("x", 151)
	.attr("y", 17)
	.attr("height", 17);

var h4 = cx4.append("path")
	.attr("class", "indctr")
	.attr("d", "M0,0 L5,24 L10,0 z");
	
var t4 = cx4.append("text")
	.attr("class", "txtVal")
	.attr("x", 480)
	.attr("y", 30);


//initialise values	
solveit_bayes();

//SLIDER ADJUSTMENT EVENTS
function br1() {

  var value = d3.round(b1.extent()[0], 2);

  if (d3.event.sourceEvent) {
    value = d3.round(x1.invert(d3.mouse(this)[0]), 2);
    b1.extent([value, value]);
  }

  h1.attr("x", x1(value));
  ir1.attr("width", x1(value));
  t1.text(dFmt(value));
  solveit_bayes();
  
}

function br2() {

  var value = d3.round(b2.extent()[0], 2);

  if (d3.event.sourceEvent) {
    value = d3.round(x2.invert(d3.mouse(this)[0]), 2);
    b2.extent([value, value]);
  }

  h2.attr("x", x2(value));
  ir2.attr("width", x2(value));
  t2.text(pFmt(value));
  solveit_bayes();
  
}

//FETCH DATA AND SOLVE THE REGRESSION EQUATION
function solveit_bayes() {

	d3.tsv("cheese_coeff.txt", function(error, data) {
	
		var xval1 = Math.log(x1.invert(h1.attr("x")));
		var xval2 = x2.invert(h2.attr("x"));
		
		var regr = data.map(function(d) {
			return parseFloat(d.incpt) +
					parseFloat(d.b_price) * xval1 +
					parseFloat(d.b_disp) * xval2; } );
					
		var regrMn = Math.exp(d3.mean(regr));
		var revHat = regrMn * x1.invert(h1.attr("x"));
						
		ir3.attr("width", x3(regrMn));
		ir4.attr("width", x3(revHat));
		
		h3.attr("transform", "translate(" + (145 + x3(regrMn)) + ", 14)");
		h4.attr("transform", "translate(" + (145 + x3(revHat)) + ", 14)");
		
		t3.text(gFmt(regrMn));
		t4.text(rFmt(revHat));
		
	} );
	
}

//DEPRECATED (aggregate solution to the regression model)
var incpt = 10.33087771,
	beta1 = -2.19530138,
	beta2 = 1.16073794;

function solveit() {

	var xval1 = Math.log(x1.invert(h1.attr("x")));
	var xval2 = x2.invert(h2.attr("x"));
	
	var regr = Math.exp(incpt + beta1 * xval1 + beta2 * xval2);
	
	ir3.attr("width", x3(regr));
	h3.attr("transform", "translate(" + (145 + x3(regr)) + ", 14)");
	t3.text(gFmt(regr));
}

