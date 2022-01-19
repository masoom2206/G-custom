/**
 * Callback function for adding Line shape
 */
var lineShape, startPoint, endPoint, startHandle, endHandle, rectShape, ellipseShape, polygonShape, starShape, TriangleShape;
var showMeasures = false;

/***************************** Start Line Shape ***************************/

/**
 * custom fabric class object for "Line" shape 
 */
fabric.Lineshape = fabric.util.createClass(fabric.Line, {
	type: 'Lineshape',
	initialize: function(element, options) {
    options || (options = {});
    //this.callSuper('initialize', element, options);
		this.callSuper('initialize', element, fabric.util.object.extend({
      stroke: '#2880E6',
			strokeWidth: 1,
			fill: '#2880E6',
			originX: 'center',
			originY: 'center',
			lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
			hasBorders: false,
			hasControls: false,
			objectCaching: false,
			perPixelTargetFind: true,
			ControlsVisibility: {
				mt: false, 
				mb: false, 
				ml: false, 
				mr: false, 
				bl: false,
				br: false, 
				tl: false, 
				tr: false,
				mtr: false, 
			}
    }, options));
  },
	toObject: function() {
		return fabric.util.object.extend(this.callSuper('toObject'), {
			id : this.id,
			start_handle : this.start_handle,
			end_handle : this.end_handle,
			name : this.name,
			page : this.page,
			layerGroup : this.layerGroup,
			layerGroupTitle : this.layerGroupTitle,
			objectGroup : this.objectGroup,
			actualTop : this.actualTop,
			actualLeft : this.actualLeft,
			layerIndexing : this.layerIndexing,
			parentlayerOrder : this.parentlayerOrder,
			token_data : this.token_data,
			lock_position : this.lock_position,
			hide_data : this.hide_data,
			lock_data : this.lock_data,
			caps_data : this.caps_data,
			caps_data_old_value: this.caps_data_old_value,
			cds_font : this.cds_font,
			max_character : this.max_character,
			position_relative : this.position_relative,
			position_relative_parent_id : this.position_relative_parent_id,
			parent_relative : this.parent_relative,
			parent_number : this.parent_number,
			child_relative : this.child_relative,
			child_number : this.child_number,
			branding_background_color : this.branding_background_color,
			branding_border_color : this.branding_border_color,
      dynamic_opacity_range : this.dynamic_opacity_range,
      line_cap : this.line_cap,
		});
	},
	_render: function(ctx) {
		this.callSuper('_render', ctx);
	},
});
fabric.Lineshape.fromObject = function(object, callback) {
  callback && callback(new fabric.Lineshape([object.x1, object.y1, object.x2, object.y2], object));
};
fabric.Lineshape.async = true;

/**
 * custom fabric class object for "Line" shape Handle
 */
fabric.ConnectorHandle = fabric.util.createClass(fabric.Rect, {

	type: "ConnectorHandle",

	initialize: function (left, top, options) {
  
  	options = options || {};
		//this.callSuper('initialize', element, options);
		this.callSuper('initialize', fabric.util.object.extend({
      left: left,
      top: top,
      width: 30,
      height: 30,
      originX: "center",
      originY: "center",
      selectable: true,
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
      hasBorders: false,
      hasControls: false,     	
			scaleX: 0.3,
			scaleY: 0.3,
			stroke: "#2880E6",  
			strokeWidth: 3,
			fill: "#fff",
			shadow: {
				color: '#fff', //E1E1E1
				blur: 1,
				offsetX: 0,
				offsetY: 0
			},
			ControlsVisibility: {
				mt: false, 
				mb: false, 
				ml: false, 
				mr: false, 
				bl: false,
				br: false, 
				tl: false, 
				tr: false,
				mtr: false, 
			}
    }, options));
  },
	toObject: function() {
		return fabric.util.object.extend(this.callSuper('toObject'), {
			id : this.id,
			name : this.name,
			page : this.page,
			shape : this.shape,
			start_handle : this.start_handle,
			end_handle : this.end_handle,
		});
	},
	_render: function(ctx) {
		this.callSuper('_render', ctx);
	},
});

fabric.ConnectorHandle.fromObject = function (obj, callback) {
	callback && callback(new fabric.ConnectorHandle(obj.left, obj.top, obj));
};

/**
 * custom fabric class object for "Line" shape Start Handle
 */
fabric.ConnectorHandleStart = fabric.util.createClass(fabric.ConnectorHandle, {

	type: "ConnectorHandleStart",

	initialize: function (left, top, options) {
    this.callSuper('initialize', left, top, fabric.util.object.extend({
    	originX: "right",
      stroke: "#2880E6",
			lockRotation: true,
      hasBorders: false,
      hasControls: false, 
			ControlsVisibility: {
				mt: false, 
				mb: false, 
				ml: false, 
				mr: false, 
				bl: false,
				br: false, 
				tl: false, 
				tr: false,
				mtr: false, 
			}
    }, options));
    
    //console.log(this);
  },
	toObject: function() {
		return fabric.util.object.extend(this.callSuper('toObject'), {
			id : this.id,
			name : this.name,
			page : this.page,
			shape : this.shape,
			end_handle : this.end_handle,
		});
	},
	_render: function(ctx) {
		this.callSuper('_render', ctx);
	},
});

fabric.ConnectorHandleStart.fromObject = function (obj, callback) {
	callback && callback(new fabric.ConnectorHandleStart(obj.left, obj.top, obj));
};

/**
 * custom fabric class object for "Line" shape End Handle
 */
fabric.ConnectorHandleEnd = fabric.util.createClass(fabric.ConnectorHandle, {

	type: "ConnectorHandleEnd",
	initialize: function (left, top, options) {
    this.callSuper('initialize', left, top, fabric.util.object.extend({
    	originX: "left",
      stroke: "#2880E6",
			lockRotation: true,
      hasBorders: false,
      hasControls: false, 
			ControlsVisibility: {
				mt: false, 
				mb: false, 
				ml: false, 
				mr: false, 
				bl: false,
				br: false, 
				tl: false, 
				tr: false,
				mtr: false, 
			}
    }, options));
  },
	toObject: function() {
		return fabric.util.object.extend(this.callSuper('toObject'), {
			id : this.id,
			name : this.name,
			page : this.page,
			shape : this.shape,
			start_handle : this.start_handle,
		});
	},
	_render: function(ctx) {
		this.callSuper('_render', ctx);
	},
});

fabric.ConnectorHandleEnd.fromObject = function (obj, callback) {
	callback && callback(new fabric.ConnectorHandleEnd(obj.left, obj.top, obj));
};

fabric.Point.prototype.angleRelativeFrom = function (startpoint) {
	return Math.atan2(this.y - startpoint.y, this.x - startpoint.x) * 180 / Math.PI;
};

function getAngle() {
	return endPoint.angleRelativeFrom(startPoint);
};

function addLine() {
  drawmode = true;
	showMeasures = true;
	lineXY();
  EnableRightProperties();	
	EnableActionToolbar();
	canvas.selection = false;
	drawLine();
	changeSelectableStatus(false);
}

function drawLine(){
	activeLayerID = $("#layers .template-group .layer-row.g-active").attr("id");
	canvas.on('mouse:down', onLineMouseDown);
	canvas.on('mouse:move', onLineMouseMove);
	canvas.on('mouse:up', onLineMouseUp);
}

//var lineshapeCnt = 0;
var lpoints;
var shifted = false;
$(document).on('keyup keydown', function(e){shifted = e.shiftKey;});
function onLineMouseDown(o) {
  commonOnfreeDrawObjects(onLineMouseDown, onLineMouseMove, onLineMouseUp);
	var pointer = canvas.getPointer(o.e);
  var lineshapeCnt = getLineshapeCnt();
	var counter = lineshapeCnt++;
	var layer_id = 'line-shape-'+counter;
  var start_handle_id = 'line-start-'+counter;
  var end_handle_id = 'line-end-'+counter;

	lpoints = [pointer.x, pointer.y, pointer.x, pointer.y];
	startPoint = new fabric.Point(pointer.x, pointer.y);
  endPoint = new fabric.Point(pointer.x, pointer.y);
	
	var linexy = canvas.getItemById('linemeasures');
	if(linexy){
		linexy.set({
			opacity: 0, 
			selectable: false
		});
	}
	
	lineShape = new fabric.Lineshape(lpoints, {
		stroke: '#2880E6',
		strokeWidth: 1,
		name: 'Path',
		id: layer_id,
		start_handle: start_handle_id,
		end_handle: end_handle_id,
		page: activePage,
		layerGroup: activeLayer,
		layerGroupTitle: activeLayerTitle,
		parentlayerOrder: parentlayerOrder,
		fill: '#2880E6',
		line_cap: 'butt',
    active: true,
    opacity: 1,
    hide_data: 0,
    lock_position: 0,
	});
	lineShape.setControlsVisibility({
		mt: false, 
		mb: false, 
		ml: false, 
		mr: false, 
		bl: false,
		br: false, 
		tl: false, 
		tr: false,
		mtr: false, 
	});
	
	startHandle = new fabric.ConnectorHandleStart(pointer.x, pointer.y, {
		//angle: angle,
		id: start_handle_id,
		name: 'Linehandle',
		shape: layer_id,
		end_handle: end_handle_id,
		opacity: 0, 
		selectable: false, 
		stroke: "#2880E6", 
		strokeWidth: 3,
		fill: "#fff",
	});
	startHandle.setControlsVisibility({
		mt: false, 
		mb: false, 
		ml: false, 
		mr: false, 
		bl: false,
		br: false, 
		tl: false, 
		tr: false,
		mtr: false, 
	});
	startHandle.setShadow("1px 2px 1px rgba(94, 128, 191, 0.5)");
	
	endHandle = new fabric.ConnectorHandleEnd(pointer.x, pointer.y, {
		//angle: angle,
		id: end_handle_id,
		name: 'Linehandle',
		shape: layer_id,
		start_handle: start_handle_id, 
		opacity: 0, 
		selectable: false,
		stroke: "#2880E6", 
		strokeWidth: 3,
		fill: "#fff",
	});
	endHandle.setControlsVisibility({
		mt: false, 
		mb: false, 
		ml: false, 
		mr: false, 
		bl: false,
		br: false, 
		tl: false, 
		tr: false,
		mtr: false, 
	});
	endHandle.setShadow("1px 2px 1px rgba(94, 128, 191, 0.5)");
	canvas.add(startHandle);
	canvas.add(endHandle);
	canvas.add(lineShape);
	canvas.renderAll();
	isMoving = true;	
	add_layer(layer_id, 'Path', 'Lineshape', activePage, activeLayer, '');
	//layerReordering();
	updateProperties(o);
}

function onLineMouseMove(o) {
	if (!isDown) return;
	var pointer = canvas.getPointer(o.e);
  if(shifted){
    var startX = lpoints[0];
    var startY = lpoints[1];
    var x2 = pointer.x - startX;
    var y2 = pointer.y - startY;
    var r = Math.sqrt(x2*x2 + y2*y2);
    var angle = (Math.atan2(y2, x2) / Math.PI * 180);

    angle = (angle) % 360 + 180;

    if (angle <= 22.5 || angle >= 337.5) {
      angle = 0;
    } else if (angle <= 67.5) {
      angle = 45;
    } else if (angle <= 112.5) {
      angle = 90;  
    } else if (angle <= 157.5) {
      angle = 135  
    } else if (angle <= 202.5) {
      angle = 180
    } else if (angle <= 247.5) {
      angle = 225
    } else if (angle <= 292.5) {
      angle = 270
    } else if (angle < 337.5) {
      angle = 315
    }
    angle -= 180;

    var cosx = r * Math.cos(angle * Math.PI / 180);
    var sinx = r * Math.sin(angle * Math.PI / 180);
    
    lineShape.set({
      x2: cosx + startX,
      y2: sinx + startY
    });
  }
  else {
    lineShape.set({ 
      x2: pointer.x, 
      y2: pointer.y 
    }).setCoords();
  }
	
	var _oldCenterX = (lineShape.x1 + lineShape.x2) / 2;
	var _oldCenterY = (lineShape.y1 + lineShape.y2) / 2;
	var _deltaX = lineShape.left - _oldCenterX;
	var _deltaY = lineShape.top - _oldCenterY;
	
	var x1 = lineShape.x1 + _deltaX;
	var x2 = lineShape.x2 + _deltaX;
	var y1 = lineShape.y1 + _deltaY;
	var y2 = lineShape.y2 + _deltaY;
	
	startPoint.setXY(x1, y1);
	endPoint.setXY(x2, y2);
		
	var angle = getAngle();
	
	startHandle.set({
  	left: lineShape.x1,
    top: lineShape.y1,
  	angle: angle
  }).setCoords();
  
  endHandle.set({
		left: lineShape.x2,
    top: lineShape.y2,
  	angle: angle
  }).setCoords();
	
  canvas.renderAll();
	
  //updating right properties on mouse move for line shape
	var prop_x = new setProperties('pos-x', Math.round(lineShape.left));
	var prop_y = new setProperties('pos-y', Math.round(lineShape.top));
	var prop_w = new setProperties('size-width', Math.round(lineShape.width));
	var prop_h = new setProperties('size-height', Math.round(lineShape.height));
	var prop_angle = new setProperties('angle', Math.round(lineShape.angle));
	prop_x.properties();				
	prop_y.properties();
	prop_w.properties();				
	prop_h.properties();  
	prop_angle.properties();
}

function onLineMouseUp(o) {
	lineShape.setCoords();
	var linexy = canvas.getItemById('linemeasures');
	var angle = getAngle();
	if(linexy){
		canvas.remove(linexy);
		canvas.renderAll();
	}
	
	startHandle.set({
		angle: angle,
		opacity: 1, 
		selectable: true
  }).setCoords();
  
  endHandle.set({
		angle: angle,
		opacity: 1, 
		selectable: true
  }).setCoords();
	
  isDown = false;
	isMoving = false;
  showMeasures = false;
	drawmode = false;
  DrawingRectangle = false;
  canvas.selection = true;
	canvas.off('mouse:down', onLineMouseDown);
	canvas.off('mouse:move', onLineMouseMove);
	canvas.off('mouse:up', onLineMouseUp);
  changeSelectableStatus(true);
	canvas.renderAll();
	//updateCanvasState();
	updateCanvasState();
	layerReordering();
  canvas.setActiveObject(lineShape);
}
/**
 * Callback function getLineshapeCnt()
 * to get the count of Lineshape object
 **/
function getLineshapeCnt(){
  var lineshapeCnt = 0;
  canvas.getObjects().forEach(function(obj) {
    if(obj.type === "Lineshape") {
      lineshapeCnt++;
    }
  });
  return lineshapeCnt;
}

function lineXY(){
	var tr_text = parseInt($('.g-ruler-widget.vertical .mouse-marker').css('top'));
	var lr_text = parseInt($('.g-ruler-widget.horizontal .mouse-marker').css('left'));
	lr_text = (Math.round(lr_text)).toString();
	tr_text = (Math.round(tr_text)).toString();
	var lineText = lr_text+', '+tr_text;
	var lmeasurement = new fabric.Text(lineText, {
		top: tr_text,
		left: lr_text,
		name: 'linemeasures',
		id: 'linemeasures',
		fontSize: 11,
		fontFamily: 'Lato',
		selectable: false,
		hasBorders: false,
		hasControls: false,
		borderColor: 'transparent',
	});
	canvas.add(lmeasurement);
	canvas.renderAll();
}

function calculateStartEndPoint(lineShape){
	var _oldCenterX = (lineShape.x1 + lineShape.x2) / 2;
	var _oldCenterY = (lineShape.y1 + lineShape.y2) / 2;
	var _deltaX = lineShape.left - _oldCenterX;
	var _deltaY = lineShape.top - _oldCenterY;
	
	var x1 = lineShape.x1 + _deltaX;
	var x2 = lineShape.x2 + _deltaX;
	var y1 = lineShape.y1 + _deltaY;
	var y2 = lineShape.y2 + _deltaY;
	
	lineShape.set({
		x1: x1,
		y1: y1,
		x2: x2,
		y2: y2
	}).setCoords();
	
	if(startPoint && endPoint){
		startPoint.setXY(x1, y1);
		endPoint.setXY(x2, y2);
	} else {
		console.log('undefined');
		startPoint = new fabric.Point(x1, y1);
		endPoint = new fabric.Point(x2, y2);
	}
}

function handleMove(o){
	var obj = o.target;
	var pointer = canvas.getPointer(o.e);	

	if(obj && obj.type == 'Lineshape'){
		var start_handle = canvas.getItemById(obj.start_handle);
		var end_handle = canvas.getItemById(obj.end_handle);
		var _oldCenterX = (obj.x1 + obj.x2) / 2;
		var _oldCenterY = (obj.y1 + obj.y2) / 2;
		var _deltaX = obj.left - _oldCenterX;
		var _deltaY = obj.top - _oldCenterY;
		var x1 = obj.x1 + _deltaX;
		var x2 = obj.x2 + _deltaX;
		var y1 = obj.y1 + _deltaY;
		var y2 = obj.y2 + _deltaY;
		
		calculateStartEndPoint(obj);
		
		var angle = getAngle();
		
		start_handle.set({
			left: x1,
			top: y1,
			angle: angle
		}).setCoords();
		
		end_handle.set({
			left: x2,
			top: y2,
			angle: angle
		}).setCoords();
		
		canvas.renderAll();
	}
	
	if(obj && obj.type == 'ConnectorHandleStart'){
		var lineShape = canvas.getItemById(obj.shape);
		var end_handle = canvas.getItemById(obj.end_handle);
		canvas.setActiveObject(lineShape);
		calculateStartEndPoint(lineShape);

		var angle = getAngle(); 
		
		lineShape.set({ 
			x1: obj.left, 
			y1: obj.top 
		}).setCoords();
		
		obj.set({
			left: obj.left,
			top: obj.top,
			angle: angle
		}).setCoords();
		
		end_handle.set({
			angle: angle
		}).setCoords();
		
		canvas.renderAll();
	}
	
	if(obj && obj.type == 'ConnectorHandleEnd'){
		var lineShape = canvas.getItemById(obj.shape);
		var start_handle = canvas.getItemById(obj.start_handle);
		canvas.setActiveObject(lineShape);
		calculateStartEndPoint(lineShape);
		
		var angle = getAngle();
		
		lineShape.set({ 
			x2: obj.left, 
			y2: obj.top 
		}).setCoords();
		
		start_handle.set({
			angle: angle
		}).setCoords();
		
		obj.set({
			left: obj.left,
			top: obj.top,
			angle: angle
		}).setCoords();
		
		canvas.renderAll();
	}
	if(canvas.getActiveObject() && canvas.getActiveObject().type == 'Lineshape'){
		var prop_x = new setProperties('pos-x', Math.round(canvas.getActiveObject().left));
		var prop_y = new setProperties('pos-y', Math.round(canvas.getActiveObject().top));
		var prop_w = new setProperties('size-width', Math.round(canvas.getActiveObject().width));
		var prop_h = new setProperties('size-height', Math.round(canvas.getActiveObject().height));
		var prop_angle = new setProperties('angle', Math.round(canvas.getActiveObject().angle));
		prop_x.properties();				
		prop_y.properties();
		prop_w.properties();				
		prop_h.properties();  
		prop_angle.properties();
	}
}

/***************************** End Line Shape ***************************/


/***************************** Start Rectangle Shape ***************************/

/**
 * custom fabric class object for "Rectangle" shape 
 */
fabric.Rectshape = fabric.util.createClass(fabric.Rect, {
	type: 'Rectshape',
	selectable: true,
	hasControls: true,
	hasRotatingPoint: true,
  lockRotation: false,
	initialize: function(points, options) {
		options || (options = { });
		this.callSuper('initialize', points, options);
	},
	toObject: function() {
		return fabric.util.object.extend(this.callSuper('toObject'), {
			id : this.id,
			name : this.name,
			page : this.page,
			layerGroup : this.layerGroup,
			layerGroupTitle : this.layerGroupTitle,
			objectGroup : this.objectGroup,
			actualTop : this.actualTop,
			actualLeft : this.actualLeft,
			layerIndexing : this.layerIndexing,
			parentlayerOrder : this.parentlayerOrder,
			token_data : this.token_data,
			lock_position : this.lock_position,
			hide_data : this.hide_data,
			lock_data : this.lock_data,
			caps_data : this.caps_data,
			caps_data_old_value: this.caps_data_old_value,
			cds_font : this.cds_font,
			max_character : this.max_character,
			position_relative : this.position_relative,
			position_relative_parent_id : this.position_relative_parent_id,
			parent_relative : this.parent_relative,
			parent_number : this.parent_number,
			child_relative : this.child_relative,
			child_number : this.child_number,
			branding_background_color : this.branding_background_color,
			branding_border_color : this.branding_border_color,
			dynamic_opacity_range : this.dynamic_opacity_range,
			dynamic_corner : this.dynamic_corner,
      object_link : this.object_link,
		});
	},
	_render: function(ctx) {
		this.callSuper('_render', ctx);
	}
});
fabric.Rectshape.fromObject = function(object, callback) {
	callback && callback(new fabric.Rectshape(object));
};

/**
 * Rectshape render for border on layer mouse over
 */
var originalRectshapeRender = fabric.Rectshape.prototype._render;
fabric.Rectshape.prototype._render = function(ctx) {
  originalRectshapeRender.call(this, ctx);
  //Don't draw border if it is active(selected/ editing mode)
  if (this.active) return;
  if(this.showTextBoxBorder){
    var w = this.width,
      h = this.height,
      x = -this.width / 2,
      y = -this.height / 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.closePath();
    var stroke = ctx.strokeStyle;
    ctx.strokeStyle = this.textboxBorderColor;
    ctx.stroke();
    ctx.strokeStyle = stroke;
  }
}
fabric.Rectshape.prototype.cacheProperties = fabric.Rectshape.prototype.cacheProperties.concat('active');

/**
 * Callback function for adding Rectangle shape
 */
function addRectshape() {
  drawmode = true;
	showMeasures = true;
	lineXY();
  EnableRightProperties();	
	EnableActionToolbar();
	canvas.selection = false;
	drawRectShape();
	changeSelectableStatus(false);
}

function drawRectShape(){
	activeLayerID = $("#layers .template-group .layer-row.g-active").attr("id");
	canvas.on('mouse:down', onRectshapeMouseDown);
	canvas.on('mouse:move', onRectshapeMouseMove);
	canvas.on('mouse:up', onRectshapeMouseUp);
}

function onRectshapeMouseDown(o) {
	var layer_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  commonOnfreeDrawObjects(onRectshapeMouseDown, onRectshapeMouseMove, onRectshapeMouseUp);
	var pointer = canvas.getPointer(o.e);
	origX = pointer.x;
  origY = pointer.y;
	
	var linexy = canvas.getItemById('linemeasures');
	if(linexy){
		linexy.set({
			opacity: 0, 
			selectable: false
		});
	}
	
	rectShape = new fabric.Rectshape({
		left: origX,
    top: origY,
		actualLeft: origX,
		actualTop: origY,
		fill: '#F0EFEF',
		name: 'Rectangle',
		id: layer_id,
		page: activePage,
		layerGroup: activeLayer,
		layerGroupTitle: activeLayerTitle,
		parentlayerOrder: parentlayerOrder,
	});
	
	canvas.add(rectShape);
	canvas.renderAll();
	isMoving = true;

	add_layer(layer_id, 'Rectangle', 'Rectshape', activePage, activeLayer, '');
	//layerReordering();
	updateProperties(o);
}

function onRectshapeMouseMove(o) {
	if (!isDown) return;
	var pointer = canvas.getPointer(o.e);
	if (origX > pointer.x) {
		rectShape.set({
			left: Math.abs(pointer.x)
		});
	}
	if (origY > pointer.y) {
		rectShape.set({
			top: Math.abs(pointer.y)
		});
	}

	rectShape.set({
		width: Math.abs(origX - pointer.x)
	});
	rectShape.set({
		height: Math.abs(origY - pointer.y)
	});
	
	canvas.clearContext(canvas.contextTop);
	rectShape._renderControls(canvas.contextTop, {
		hasControls: false
	});
	canvas.renderAll();
	
//updating right properties on mouse move for text
	var prop_x = new setProperties('pos-x', Math.round(rectShape.left));
	var prop_y = new setProperties('pos-y', Math.round(rectShape.top));
	var prop_w = new setProperties('size-width', Math.round(rectShape.width));
	var prop_h = new setProperties('size-height', Math.round(rectShape.height));
	var prop_angle = new setProperties('angle', Math.round(rectShape.angle));
	prop_x.properties();				
	prop_y.properties();
	prop_w.properties();				
	prop_h.properties();  
	prop_angle.properties();
}

function onRectshapeMouseUp(o) {
	rectShape.setCoords();
	var linexy = canvas.getItemById('linemeasures');
	if(linexy){
		canvas.remove(linexy);
		canvas.renderAll();
	}
  isDown = false;
	isMoving = false;
  showMeasures = false;
	drawmode = false;
  DrawingRectangle = false;
  canvas.selection = true;
	canvas.off('mouse:down', onRectshapeMouseDown);
	canvas.off('mouse:move', onRectshapeMouseMove);
	canvas.off('mouse:up', onRectshapeMouseUp);
  changeSelectableStatus(true);
  canvas.renderAll();
	//updateCanvasState();
	updateCanvasState();
	layerReordering();
  canvas.setActiveObject(rectShape);
}

/************************** End Rectangle Shape *********************/

/************************** Start Ellipse Shape *********************/

/**
 * Callback function for adding Ellipse shape
 */
function addEllipseShape() {
  drawmode = true;
	showMeasures = true;
	lineXY();
  EnableRightProperties();	
	EnableActionToolbar();
	canvas.selection = false;
	drawEllipseShape();
	changeSelectableStatus(false);
}

function drawEllipseShape(){
	activeLayerID = $("#layers .template-group .layer-row.g-active").attr("id");
	canvas.on('mouse:down', onEllipseMouseDown);
	canvas.on('mouse:move', onEllipseMouseMove);
	canvas.on('mouse:up', onEllipseMouseUp);
}

function onEllipseMouseDown(o) {
	var layer_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  commonOnfreeDrawObjects(onEllipseMouseDown, onEllipseMouseMove, onEllipseMouseUp);
	
	var pointer = canvas.getPointer(o.e);
	origX = pointer.x;
  origY = pointer.y;
	
	var linexy = canvas.getItemById('linemeasures');
	if(linexy){
		linexy.set({
			opacity: 0, 
			selectable: false
		});
	}
	
	ellipseShape = new fabric.Circle({
		left: origX,
    top: origY,
		originX: 'center',
		originY: 'center',
		actualLeft: origX,
		actualTop: origY,
		fill: '#F0EFEF',
		radius: 0,
		stroke: '#2880E6',
		strokeWidth: 1,
		opacity: 1,
		name: 'Ellipse',
		id: layer_id,
		page: activePage,
		layerGroup: activeLayer,
		layerGroupTitle: activeLayerTitle,
		parentlayerOrder: parentlayerOrder,
	});
	
	canvas.add(ellipseShape);
	canvas.renderAll();
	isMoving = true;

	add_layer(layer_id, 'Ellipse', 'circle', activePage, activeLayer, '');
	updateProperties(o);
}

function onEllipseMouseMove(o) {
	if (!isDown) return;
	var pointer = canvas.getPointer(o.e);
	if (origX > pointer.x) {
		ellipseShape.set({
			left: Math.abs(pointer.x)
		});
	}
	if (origY > pointer.y) {
		ellipseShape.set({
			top: Math.abs(pointer.y)
		});
	}

	ellipseShape.set('radius', Math.abs(origX - Math.abs(pointer.x))); 
	
	canvas.clearContext(canvas.contextTop);
	ellipseShape._renderControls(canvas.contextTop, {
		hasControls: false
	});
	canvas.renderAll();
	
//updating right properties on mouse move for text
	var prop_x = new setProperties('pos-x', Math.round(ellipseShape.left));
	var prop_y = new setProperties('pos-y', Math.round(ellipseShape.top));
	var prop_w = new setProperties('size-width', Math.round(ellipseShape.width));
	var prop_h = new setProperties('size-height', Math.round(ellipseShape.height));
	var prop_angle = new setProperties('angle', Math.round(ellipseShape.angle));
	prop_x.properties();				
	prop_y.properties();
	prop_w.properties();				
	prop_h.properties();  
	prop_angle.properties();
}

function onEllipseMouseUp(o) {
	ellipseShape.setCoords();
	var linexy = canvas.getItemById('linemeasures');
	if(linexy){
		canvas.remove(linexy);
		canvas.renderAll();
	}
  isDown = false;
	isMoving = false;
  showMeasures = false;
	//drawmode = false;
  DrawingRectangle = false;
  canvas.selection = true;
	canvas.off('mouse:down', onEllipseMouseDown);
	canvas.off('mouse:move', onEllipseMouseMove);
	canvas.off('mouse:up', onEllipseMouseUp);
  changeSelectableStatus(true);
  canvas.renderAll();
	updateCanvasState();
	layerReordering();
  canvas.setActiveObject(ellipseShape);
}

/**
 * "fabric object extend" to add
 * custom attribute in "Circle" object
 **/
fabric.Circle.prototype.toObject = (function (toObject) {
  return function () {
		return fabric.util.object.extend(toObject.call(this), {
			id : this.id,
			name : this.name,
			page : this.page,
			layerGroup : this.layerGroup,
			layerGroupTitle : this.layerGroupTitle,
			objectGroup : this.objectGroup,
			actualTop : this.actualTop,
			actualLeft : this.actualLeft,
			layerIndexing : this.layerIndexing,
			parentlayerOrder : this.parentlayerOrder,
			token_data : this.token_data,
			lock_position : this.lock_position,
			hide_data : this.hide_data,
			lock_data : this.lock_data,
			caps_data : this.caps_data,
			caps_data_old_value: this.caps_data_old_value,
			cds_font : this.cds_font,
			max_character : this.max_character,
			position_relative : this.position_relative,
			position_relative_parent_id : this.position_relative_parent_id,
			parent_relative : this.parent_relative,
			parent_number : this.parent_number,
			child_relative : this.child_relative,
			child_number : this.child_number,
			//text_separate : this.text_separate,
			//text_combine : this.text_combine,
			zoomLevel : this.zoomLevel,
			branding_background_color : this.branding_background_color,
			branding_border_color : this.branding_border_color,
      dynamic_opacity_range : this.dynamic_opacity_range,
      object_link : this.object_link,
    });
  };
})(fabric.Circle.prototype.toObject);

/**
 * "fabric object extend" to add
 * custom attribute in "Triangle" object
 **/
fabric.Triangle.prototype.toObject = (function (toObject) {
  return function () {
		return fabric.util.object.extend(toObject.call(this), {
			id : this.id,
			name : this.name,
			page : this.page,
			layerGroup : this.layerGroup,
			layerGroupTitle : this.layerGroupTitle,
			objectGroup : this.objectGroup,
			actualTop : this.actualTop,
			actualLeft : this.actualLeft,
			layerIndexing : this.layerIndexing,
			parentlayerOrder : this.parentlayerOrder,
			token_data : this.token_data,
			lock_position : this.lock_position,
			hide_data : this.hide_data,
			lock_data : this.lock_data,
			caps_data : this.caps_data,
			caps_data_old_value: this.caps_data_old_value,
			cds_font : this.cds_font,
			max_character : this.max_character,
			position_relative : this.position_relative,
			position_relative_parent_id : this.position_relative_parent_id,
			parent_relative : this.parent_relative,
			parent_number : this.parent_number,
			child_relative : this.child_relative,
			child_number : this.child_number,
			//text_separate : this.text_separate,
			//text_combine : this.text_combine,
			zoomLevel : this.zoomLevel,
			branding_background_color : this.branding_background_color,
			branding_border_color : this.branding_border_color,
      dynamic_opacity_range : this.dynamic_opacity_range,
      object_link : this.object_link,
    });
  };
})(fabric.Triangle.prototype.toObject);

/**
 * Circle render for border on layer mouse over
 */
/*var originalCircleRender = fabric.Circle.prototype._render;
fabric.Circle.prototype._render = function(ctx) {
  originalCircleRender.call(this, ctx);
  //Don't draw border if it is active(selected/ editing mode)
  if (this.active) return;
  if(this.showCircleBorder){
    var w = this.width,
      h = this.height,
      x = -this.width / 2,
      y = -this.height / 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.closePath();
    var stroke = ctx.strokeStyle;
    ctx.strokeStyle = this.circleBorderColor;
    ctx.stroke();
    ctx.strokeStyle = stroke;
  }
}
fabric.Circle.prototype.cacheProperties = fabric.Circle.prototype.cacheProperties.concat('active');*/


/***************************** End Ellipse Shape ***************************/

/**
 * Callback function for adding Polygon shape
 */
function addPolygon() {
  canvas.add(new fabric.Polygon([
    {x: 185, y: 0},
    {x: 250, y: 100},
    {x: 385, y: 170},
    {x: 0, y: 245} ], {
      left: 20,
      top: 20,
      fill: '#' + getRandomColor()
    }));
}

/**
 * Callback function for adding Triangle shape
 */
/*function addTriangle() {
  canvas.add(new fabric.Triangle({
    left: 10,
    top: 10,
    fill: '#' + getRandomColor(),
    width: 50,
    height: 50,
    opacity: 0.8
  }));
}*/

/**
 * Callback function addTriangle()
 * to add Triangle
 **/
function addTriangle() {
  drawmode = true;
	showMeasures = true;
	lineXY();
  EnableRightProperties();	
	EnableActionToolbar();
	canvas.selection = false;
	drawTriangle();
	changeSelectableStatus(false);
}
/**
 * Callback function drawTriangle()
 * to Call mouse event
 **/
//var triangleShapeCnt = 0;
var tpoints, triangleShap, origX, origY;
var shifted = false;
$(document).on('keyup keydown', function(e){shifted = e.shiftKey;});
function drawTriangle(){
	activeLayerID = $("#layers .template-group .layer-row.g-active").attr("id");
	canvas.on('mouse:down', onTriangleMouseDown);
	canvas.on('mouse:move', onTriangleMouseMove);
	canvas.on('mouse:up', onTriangleMouseUp);
}
/**
 * Callback function onTriangleMouseDown()
 * To call mouse down event for triangle
 **/
function onTriangleMouseDown(o) {
  var layer_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  commonOnfreeDrawObjects(onTriangleMouseDown, onTriangleMouseMove, onTriangleMouseUp);
	//var counter = triangleShapeCnt++;
	//var layer_id = 'triangle-shape-'+counter;
	var pointer = canvas.getPointer(o.e);	
  origX = pointer.x;
  origY = pointer.y;

	var linexy = canvas.getItemById('linemeasures');
	if(linexy){
		linexy.set({
			opacity: 0, 
			selectable: false
		});
	}
	
  /*var triangle = new fabric.Triangle({
    width: 20, height: 30, fill: 'blue', left: 50, top: 50
  });*/
	triangleShap = new fabric.Triangle({
    left: origX,
    top: origY,
		originX: 'center',
		originY: 'center',
		actualLeft: origX,
		actualTop: origY,
    //width: 1,
    //height: 1,
		radius: 0,
		opacity: 1,
		stroke: '#2880E6',
		strokeWidth: 1,
		name: 'Triangle',
		id: layer_id,
		page: activePage,
		layerGroup: activeLayer,
		layerGroupTitle: activeLayerTitle,
		parentlayerOrder: parentlayerOrder,
		fill: 'transparent',
	});
	canvas.add(triangleShap);
	canvas.renderAll();
	isMoving = true;	
	add_layer(layer_id, 'Triangle', 'triangle', activePage, activeLayer, '');
	//layerReordering();
	updateProperties(o);
}
/**
 * Callback function onTriangleMouseMove()
 * To call mouse move event for triangle
 **/
function onTriangleMouseMove(o) {
	if (!isDown) return;
	var pointer = canvas.getPointer(o.e);

  /*if(shifted){
    var startX = origX;
    var startY = origY;
    var x2 = pointer.x - startX;
    var y2 = pointer.y - startY;
    var r = Math.sqrt(x2*x2 + y2*y2);
    var angle = (Math.atan2(y2, x2) / Math.PI * 180);

    angle = (angle) % 360 + 180;

    if (angle <= 7.5 || angle >= 352.5) {
      angle = 0;
    } else if (angle <= 22.5) {
      angle = 15;
    } else if (angle <= 37.5) {
      angle = 30;
    } else if (angle <= 52.5) {
      angle = 45;
    } else if (angle <= 67.5) {
      angle = 60;
    } else if (angle <= 82.5) {
      angle = 75;
    } else if (angle <= 97.5) {
      angle = 90;  
    } else if (angle <= 112.5) {
      angle = 105;  
    } else if (angle <= 127.5) {
      angle = 120;  
    } else if (angle <= 142.5) {
      angle = 135;
    } else if (angle <= 157.5) {
      angle = 150;
    } else if (angle <= 172.5) {
      angle = 165;
    } else if (angle <= 187.5) {
      angle = 180;
    } else if (angle <= 202.5) {
      angle = 195;
    } else if (angle <= 217.5) {
      angle = 210;
    } else if (angle <= 232.5) {
      angle = 225;
    } else if (angle <= 247.5) {
      angle = 240;
    } else if (angle <= 262.5) {
      angle = 255;
    } else if (angle <= 277.5) {
      angle = 270;
    } else if (angle <= 292.5) {
      angle = 285;
    } else if (angle <= 307.5) {
      angle = 300;
    } else if (angle < 322.5) {
      angle = 315;
    } else if (angle < 337.5) {
      angle = 330;
    } else if (angle < 352.5) {
      angle = 345;
    }
    angle -= 180;

    triangleShap.set({
      angle: angle
    });
    // var cosx = r * Math.cos(angle * Math.PI / 180);
    // var sinx = r * Math.sin(angle * Math.PI / 180);
    
    // triangleShap.set({
      // left: cosx + startX,
      // top: sinx + startY
    // });
  }*/
  //else {
    if (origX > pointer.x) {
      triangleShap.set({
        left: Math.abs(pointer.x)
      });
    }
    if (origY > pointer.y) {
      triangleShap.set({
        top: Math.abs(pointer.y)
      });
    }
  //}

	triangleShap.set('radius', Math.abs(origX - Math.abs(pointer.x))); 
	
	canvas.clearContext(canvas.contextTop);
	triangleShap._renderControls(canvas.contextTop, {
		hasControls: false
	});

	triangleShap.set({
		width: Math.abs(origX - pointer.x)
	});
	triangleShap.set({
		height: Math.abs(origY - pointer.y)
	});
	canvas.renderAll();
	//updating right properties on mouse move for text
  var triangleSampleCoords = triangleShap.getBoundingRect(true, true);
	var prop_x = new setProperties('pos-x', Math.round(triangleSampleCoords.left - leftmargin));
	var prop_y = new setProperties('pos-y', Math.round(triangleSampleCoords.top - topmargin));
	var prop_w = new setProperties('size-width', Math.round(triangleShap.width));
	var prop_h = new setProperties('size-height', Math.round(triangleShap.height));
	var prop_angle = new setProperties('angle', Math.round(triangleShap.angle));
	prop_x.properties();
	prop_y.properties();
	prop_w.properties();
	prop_h.properties();
	prop_angle.properties();
}
/**
 * Callback function onTriangleMouseUp()
 * To call mouse up event for triangle
 **/
function onTriangleMouseUp(o) {
	triangleShap.setCoords();
	var linexy = canvas.getItemById('linemeasures');
	if(linexy){
		canvas.remove(linexy);
		canvas.renderAll();
	}
  isDown = false;
	isMoving = false;
  showMeasures = false;
	drawmode = false;
  DrawingRectangle = false;
  canvas.selection = true;
	canvas.off('mouse:down', onTriangleMouseDown);
	canvas.off('mouse:move', onTriangleMouseMove);
	canvas.off('mouse:up', onTriangleMouseUp);
  changeSelectableStatus(true);
	canvas.renderAll();
	//updateCanvasState();
	updateCanvasState();
	layerReordering();
  canvas.setActiveObject(triangleShap);
}
