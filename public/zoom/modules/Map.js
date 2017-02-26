function Map(){
	var projection = d3.geoMercator();
	var m = {t:20,r:20,b:20,l:20},
		w, h, W=800, H=600;
	var plot;
	var zoom = d3.zoom()
		.scaleExtent([.5,4])
		.on('zoom', zoomed);

	var exports = function(div){
		//Reset width and height and projection
		W = Math.max(div.node().clientWidth, W);
		H = Math.max(div.node().clientHeight, H);
		w = W - m.l - m.r;
		h = H - m.t - m.b;

		projection
			.center([-71.091903,42.350037])
			.translate([w/2, h/2])
			.scale(410000);

		div.style('width',W+'px')
			.style('height',H+'px');

		var datum = div.datum() || [];

		//Append DOM
		var svg = div.selectAll('svg').data([1]);
		var svgEnter = svg.enter().append('svg');
		var plotEnter = svgEnter.append('g').attr('class','map');

		svgEnter.append('rect')
			.attr('x',0)
			.attr('y',0)
			.attr('width',W) //same size with svg, W
			.attr('height',H)
			.style('fill','none')
			.style('pointer-events','all')
			.call(zoom);

		plot = svgEnter.merge(svg)
			.attr('width',W)
			.attr('height',H)
			.select('.map')
			.attr('transform','translate('+m.l+','+m.t+')');

		//Draw dots
		var stations = plot.selectAll('.station')
			.data(datum);
		var stationsEnter = stations.enter()
			.append('g').attr('class','station');
		stationsEnter.append('circle').attr('r',5)
			.style('fill','none').style('stroke','red').style('stroke-width','2px');
		stationsEnter.append('circle').attr('r',2)
			.style('fill','red');
		stations.merge(stationsEnter)
			.attr('transform',function(d){
				var xy = projection(d.lngLat);
				return 'translate('+xy[0]+','+xy[1]+')';
			});
		stations.exit().remove();

	}

	function zoomed(){
		var t = d3.event.transform;

		plot.attr('transform','translate('+(t.x+m.l)+','+(t.y+m.t)+')scale('+t.k+')');
		plot.selectAll('circle').style('stroke-width',1/t.k +'px');
	}

	exports.width = function(_){
		if(!arguments.length) return W;
		W = _;
		return this;
	}

	exports.height = function(_){
		if(!arguments.length) return H;
		H = _;
		return this;
	}

	return exports;
}