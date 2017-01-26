/*
 * Core javascript to create the line chart
 * Version 1.0.4
 * 
 * Copyright 2015 Lakshmikanth Vallampati
 * Released under the MIT License
 * 
 */
function drawlineChart( chartData ){


	var xPadding = 0;
	var yPadding = 30;
	var set = chartData.dataset;
	var label = chartData.labels;
	var graph = jQuery("#"+chartData.node+"");
	var c = graph[0].getContext('2d');

	c.lineWidth = 2;
	c.font = '12pt sans-serif';
	c.textAlign = "center";
	c.strokeStyle = '#8e8e8e';
	c.fillStyle = '#4e4e4e';

	// Draw the axises
	/*l.beginPath();
	l.moveTo(xPadding, 0);
	l.lineTo(xPadding, graph.height() - yPadding);
	l.lineTo(graph.width(), graph.height() - yPadding);
	l.stroke();*/

	// Returns the max Y value in our data list
	function getMaxY() {
		var max = 0;
		for(var i = 0; i < set.length; i ++) {
			if(set[i] > max) {
				max = set[i];
			}
		}
		max += 10 - max % 10;
		return max;
	}
	// Returns the max Y value in our data list
	function getMax() {
		var max = 0;
		for(var i = 0; i < set.length; i ++) {
			if(set[i] > max) {
				max = set[i];
			}
		}
		return max;
	}

	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font="14px Verdana";
	var width = context.measureText(getMaxY()).width + 15;

	var xPadding = width;

	// Return the x pixel for a graph point
	function getXPixel(val) {
		return ((graph.width() - xPadding) / label.length) * val + (xPadding * 1.5);
	}
	
	// Return the y pixel for a graph point
	function getYPixel(val) {
		return graph.height() - (((graph.height() - yPadding) / getMaxY()) * val) - yPadding;
	}
	
	// Draw the X value texts
	for(var i = 0; i < label.length; i ++) {
		c.fillText(label[i], getXPixel(i), graph.height() - yPadding + 30);
	}
	
	// Draw the Y value texts
	c.textAlign = "right"
	c.textBaseline = "middle";
	var breakperiod = chartData.ybreakperiod;
	for(var i = 0; i <= getMaxY(); i += breakperiod) {
		c.fillText(i, xPadding - 10, getYPixel(i)+10);
	}
	
	c.strokeStyle = chartData.pathcolor;
	c.fillStyle = chartData.fillcolor;

	// Draw the line graph
	c.beginPath();
	c.moveTo(getXPixel(0), getYPixel(set[0])+10);
	for(var i = 1; i < set.length; i ++) {
		c.lineTo(getXPixel(i), getYPixel(set[i])+10);
	}
	c.stroke();
			
	// Draw the graph points
	var max = getMax();
	for(var i = 0; i < set.length; i ++) {  
		c.beginPath();
		c.arc(getXPixel(i), getYPixel(set[i])+10, 3, 0, Math.PI * 2, true);
		c.fill();
		if(max == set[i]) {
			/*c.font = '20pt Calibri';
			c.fillStyle = 'blue';
			c.background = 'blue';
			c.fillText(set[i], getXPixel(i) + 20, getYPixel(set[i]) + 10);*/
			/*c.arc(getXPixel(i)+40, getYPixel(set[i])+25, 25, 0, Math.PI * 2, false);
			c.fillStyle ="#042e52";
			c.fill()*/
			c.font = 'bold 14pt Calibri';
			c.textAlign = 'center';

			c.fillStyle ="#042e52";  // <-- Text colour here
			c.fillText(set[i], getXPixel(i)+20, getYPixel(set[i])+10);
		}
	}

}
