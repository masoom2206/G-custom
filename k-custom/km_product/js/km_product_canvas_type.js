/**
 * A js @file
 * for canvas custom type for 
 * product edit page
 **/
/**
 * Fabric //active object corners style
**/
fabric.Object.prototype.cornerStyle = 'circle';//default rect
fabric.Object.prototype.borderColor = '#2880E6';
fabric.Object.prototype.cornerColor = '#2880E6';
fabric.Object.prototype.cornerStrokeColor = '#fff';
fabric.Object.prototype.StrokeWidth = 1;
fabric.Object.prototype.minScaleLimit = 0;
fabric.Object.prototype.cornerSize = 10;
fabric.Object.prototype.cornerRadius = 50;
fabric.Object.prototype.rotatingPointOffset = 35;
fabric.Object.prototype.padding = 0;
fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.lock_position = 0;
fabric.Object.prototype.objectGroup = false;
fabric.Object.prototype.layerIndexing = '';
fabric.Object.prototype.parentlayerOrder = '';

fabric.Object.prototype.getZIndex = function() {
  return this.canvas.getObjects().indexOf(this);
}
/**
 * Fabric object hide
 **/
fabric.Object.prototype.hide = function() {
	this.set({ hidden:true, opacity: 0, selectable: false });
};

/**
 * Fabric object show
 **/
fabric.Object.prototype.show = function() {
	this.set({ hidden:false, opacity: 1, selectable: true });
};

/**
 * "fabric object extend" to add
 * custom attribute in "Textbox" object
 **/
fabric.Textbox.prototype.toObject = (function (toObject) {
  return function () {
		return fabric.util.object.extend(toObject.call(this), {
			id : this.id,
			name : this.name,
			page : this.page,
			layerGroup : this.layerGroup,
			layerGroupTitle : this.layerGroupTitle,
			objectGroup : this.objectGroup,
			actualTop : this.actualTop,
      pageRuler : this.pageRuler,
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
      //this attribute used to delete token
			old_text : this.old_text,
			branding_font_family : this.branding_font_family,
			branding_font_color : this.branding_font_color,
      tl: this.aCoords.tl,
    });
  };
})(fabric.Textbox.prototype.toObject);

/**
 * "fabric object extend" to add
 * custom attribute in "image" object
 **/
fabric.Image.prototype.toObject = (function (toObject) {
  return function () {
		return fabric.util.object.extend(toObject.call(this), {
			id : this.id,
			name : this.name,
			page : this.page,
			layerGroup : this.layerGroup,
			layerGroupTitle : this.layerGroupTitle,
			objectGroup : this.objectGroup,
			actualTop : this.actualTop,
      pageRuler : this.pageRuler,
			actualLeft : this.actualLeft,
			layerIndexing : this.layerIndexing,
			parentlayerOrder : this.parentlayerOrder,
			token_data : this.token_data,
			lock_position : this.lock_position,
			hide_data : this.hide_data,
      hide_container : this.hide_container,
			lock_data : this.lock_data,
			caps_data : this.caps_data,
			caps_data_old_value: this.caps_data_old_value,
			cds_font : this.cds_font,
			max_character : this.max_character,
			position_relative : this.position_relative,
			position_relative_parent_id : this.position_relative_parent_id,
			zoomLevel : this.zoomLevel,
			imageSourceOption : this.imageSourceOption,
			imageSourceValue : this.imageSourceValue,
			imageArConstraint : this.imageArConstraint,
			imagePresetGroup : this.imagePresetGroup,
			imagePresetPreset : this.imagePresetPreset,
			imgfid : this.imgfid,
			OldscaleX : this.OldscaleX,
			OldscaleY : this.OldscaleY,
			oldWidth : this.oldWidth,
			oldHeight : this.oldHeight,
			dynamicImageCorner : this.dynamicImageCorner,
			dynamicImageCornerrxw : this.dynamicImageCornerrxw,
			dynamicImageCornerryh : this.dynamicImageCornerryh,
			dynamic_image_opacity_range : this.dynamic_image_opacity_range,
			containerName : this.containerName,
			containerID : this.containerID,
			containerWidth : this.containerWidth,
			containerHeight : this.containerHeight,
      tl: this.aCoords.tl,
    });
  };
})(fabric.Image.prototype.toObject);

/*****adding custom attributes to Text object*****/
fabric.Text.prototype.toObject = (function (toObject) {
  return function () {
		return fabric.util.object.extend(toObject.call(this), {
			id : this.id,
			name : this.name,
			page: this.page,
			activeflag : this.activeflag,
    });
  };
})(fabric.Text.prototype.toObject);

/*****adding custom attributes to Line object*****/
fabric.Line.prototype.toObject = (function (toObject) {
  return function () {
		return fabric.util.object.extend(toObject.call(this), {
			id : this.id,
			name : this.name,
			page: this.page,
			ignoreZoom : this.ignoreZoom,
    });
  };
})(fabric.Line.prototype.toObject);/*****adding custom attributes to Line object*****

/**
 * textbox render for border on layer mouse over
 */
var originalRender = fabric.Textbox.prototype._render;
fabric.Textbox.prototype._render = function(ctx) {
  originalRender.call(this, ctx);
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
fabric.Textbox.prototype.cacheProperties = fabric.Textbox.prototype.cacheProperties.concat('active');
/**
 * Image render for border on layer mouse over
 */
var ImageoriginalRender = fabric.Image.prototype._render;
fabric.Image.prototype._render = function(ctx) {
  ImageoriginalRender.call(this, ctx);
  //Don't draw border if it is active(selected mode)
  if (this.active) return;
  if(this.showImageBorder){
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
    ctx.strokeStyle = this.textboxBorderColor; //make the border color same as textbox object has
    ctx.stroke();
    ctx.strokeStyle = stroke;
  }
}
fabric.Image.prototype.cacheProperties = fabric.Image.prototype.cacheProperties.concat('active');

/**
 * Image render for border on layer mouse over
 */
var activeSelectionRender = fabric.ActiveSelection.prototype._render;
fabric.ActiveSelection.prototype._render = function(ctx) { 
  activeSelectionRender.call(this, ctx);
  //Don't draw border if it is active(selected mode)
  //if (this.active) return;
  if(this.showactiveSelectionBorder == true){
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
    ctx.strokeStyle = this.borderColor; //make the border color same as textbox object has
    ctx.stroke();
    ctx.strokeStyle = stroke;
  }
}

/*****Start create custom fabric class object "Page"*****/
fabric.Page = fabric.util.createClass(fabric.Rect, {
	type: 'Page',
	selectable: false,
	hasControls: false,
	hasRotatingPoint: false,
	hasRotatingPoint: false,
  lockRotation: true,
	initialize: function(points, options) {
		options || (options = { });
		this.callSuper('initialize', points, options);
	},
	toObject: function() {
		return fabric.util.object.extend(this.callSuper('toObject'), {
			id : this.id,
			name : this.name,
			order : this.order,
			actualLeft : this.actualLeft,
			actualTop : this.actualTop,
			pagegroupLeft : this.pagegroupLeft,
			pagegroupTop : this.pagegroupTop,
			pageMeasurement : this.pageMeasurement,
      pageRuler : this.pageRuler,
      fabricDPI : this.fabricDPI,
      tl: this.aCoords.tl,
		});
	},
	_render: function(ctx) {
		this.callSuper('_render', ctx);
	}
});
fabric.Page.fromObject = function(object, callback) {
	callback && callback(new fabric.Page(object));
};

/*****Start create custom fabric class object "Guideline"*****/
var guidesCnt = 0;
fabric.Guideline = fabric.util.createClass(fabric.Line, {
	type: 'Guideline',
	initialize: function (x1, y1, x2, y2, options) {
    options = options || {};
    this.id = options.id || 'guideline-' + guidesCnt++;
    this.callSuper('initialize', [x1, y1, x2, y2], fabric.util.object.extend({
    	stroke: 'green', //#00f
      originX: "center",
      originY: "center",
      selectable: false,
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
      hasBorders: false,
      hasControls: false,
      perPixelTargetFind: true,
      borderColor: 'transparent',
      hasRotatingPoint: false,
      ignoreZoom: true,
    }, options));
  }
});
fabric.Guideline.fromObject = function(object) {
	return new fabric.Guideline(object.x1, object.y1, object.x2, object.y2, object);
};

/**
 * Page render for border on page mouse over
 */
var PageoriginalRender = fabric.Page.prototype._render;
fabric.Page.prototype._render = function(ctx) {
  PageoriginalRender.call(this, ctx);
  //Don't draw border if it is active(selected mode)
  //if (this.active) return;
  if(this.showPageBorder){
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
    ctx.strokeStyle = this.PageBorderColor; //make the border color same as textbox object has
    ctx.stroke();
    ctx.strokeStyle = stroke;
  }
}
fabric.Page.prototype.cacheProperties = fabric.Page.prototype.cacheProperties.concat('active');

/****************End custom fabric class object "Page"************/

/*****Start create custom fabric class object "ImageContainer"*****/
fabric.ImageContainer = fabric.util.createClass(fabric.Rect, {
	type: 'ImageContainer',
	id : this.id,
	name : this.name,
	selectable: true,
	hasControls: true,
	hasRotatingPoint: true,
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
			layerGroupTitle: this.layerGroupTitle,
			actualTop: this.actualTop,
      pageRuler: this.pageRuler,
			actualLeft: this.actualLeft,
			objectGroup : this.objectGroup,
			layerIndexing : this.layerIndexing,
			parentlayerOrder : this.parentlayerOrder,
			hide_container : this.hide_container,
			containerImage : this.containerImage,
		});
	},
	_render: function(ctx) {
		this.callSuper('_render', ctx);
	}
});
fabric.ImageContainer.fromObject = function(object, callback) {
	callback && callback(new fabric.ImageContainer(object));
};

/**
 * ImageContainer render for border on ImageContainer mouse over
 */
var ImageContaineroriginalRender = fabric.ImageContainer.prototype._render;
fabric.ImageContainer.prototype._render = function(ctx) {
  ImageContaineroriginalRender.call(this, ctx);
  //Don't draw border if it is active(selected mode)
  //if (this.active) return;
  if(this.showImageBorder){
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
    ctx.strokeStyle = this.textboxBorderColor; //make the border color same as textbox object has
    ctx.stroke();
    ctx.strokeStyle = stroke;
  }
}
fabric.ImageContainer.prototype.cacheProperties = fabric.ImageContainer.prototype.cacheProperties.concat('active');

/****************End custom fabric class object "ImageContainer"************/

/**
 * Callback function for adding Line shape
 */
var lineShape, startPoint, endPoint, startHandle, endHandle, rectShape, ellipseShape, polygonShape, starShape, TriangleShape;

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
 * PageMediaBox for PDF output
 **/
fabric.PageMediaBox = fabric.util.createClass(fabric.Rect, {
	type: 'PageMediaBox',
	selectable: false,
	hasControls: false,
	hasRotatingPoint: false,
	hasRotatingPoint: false,
  lockRotation: true,
	initialize: function(points, options) {
		options || (options = { });
		this.callSuper('initialize', points, options);
	},
	toObject: function() {
		return fabric.util.object.extend(this.callSuper('toObject'), {
			id : this.id,
			name : this.name,
      page : this.page,
      lock_position : this.lock_position,
      hide_data : this.hide_data,
		});
	},
	_render: function(ctx) {
		this.callSuper('_render', ctx);
	}
});
fabric.PageMediaBox.fromObject = function(object, callback) {
	callback && callback(new fabric.PageMediaBox(object));
};
/**
 * PageTrimBox for page trimbox line
 **/
fabric.PageTrimBox = fabric.util.createClass(fabric.Line, {
	type: 'PageTrimBox',
	initialize: function(element, options) {
    options || (options = {});
    //this.callSuper('initialize', element, options);
		this.callSuper('initialize', element, fabric.util.object.extend({
      stroke: '#ff99ff',
			strokeWidth: 1,
			fill: '#ff99ff',
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
			name : this.name,
			page : this.page,
			lock_position : this.lock_position,
			hide_data : this.hide_data,
		});
	},
	_render: function(ctx) {
		this.callSuper('_render', ctx);
	},
});
fabric.PageTrimBox.fromObject = function(object, callback) {
  callback && callback(new fabric.PageTrimBox([object.x1, object.y1, object.x2, object.y2], object));
};
fabric.PageTrimBox.async = true;
/**
 * Get canvas object by object ID
 */
fabric.Canvas.prototype.getActivePageObj = function() {
  var object = null,
      objects = this.getObjects();

  for (var i = 0, len = this.size(); i < len; i++) {
    if (objects[i].type && objects[i].type === 'page' && objects[i].order === 1) {
      object = objects[i];
      break;
    }
  }

  return object;
};
/**
 * Get canvas object by object ID
 */
fabric.Canvas.prototype.getItemById = function(id) {
  var object = null,
      objects = this.getObjects();

  for (var i = 0, len = this.size(); i < len; i++) {
    if (objects[i].id && objects[i].id === id) {
      object = objects[i];
      break;
    }
  }

  return object;
};
/**
 * Get all objects of page including page object
 */
fabric.Canvas.prototype.getItemsByPage = function(pageId) {
  var objectList = [],
    objects = this.getObjects();
  for (var i = 0, len = this.size(); i < len; i++) {
		if ((objects[i].page && objects[i].page === pageId && objects[i].type !== 'text' && objects[i].type !== 'line' && objects[i].type !== 'guideline') || (objects[i].id === pageId)) {
			objectList.push(objects[i]);
		}
  }
  return objectList;
};
/**
 * Get canvas object by Type
 */
fabric.Canvas.prototype.getItemsByType = function(type, flag) {
  var objectList = [],
  objects = this.getObjects();
  for (var i = 0, len = this.size(); i < len; i++) {
    if(flag == true){
      if (objects[i].type && objects[i].type === type && objects[i].name !== 'measurement') {
        objectList.push(objects[i]);
      }
    }
    else {
      if (objects[i].type && objects[i].type !== type && objects[i].name !== 'measurement') {
        objectList.push(objects[i]);
      }
    }
  }
  return objectList;
};
/**
 * Get canvas object by Type
 */
fabric.Canvas.prototype.getItemsByType = function(type, flag) {
  var objectList = [],
  objects = this.getObjects();
  for (var i = 0, len = this.size(); i < len; i++) {
    if(flag == true){
      if (objects[i].type && objects[i].type === type && objects[i].name !== 'measurement') {
        objectList.push(objects[i]);
      }
    }
    else {
      if (objects[i].type && objects[i].type !== type && objects[i].name !== 'measurement') {
        objectList.push(objects[i]);
      }
    }
  }
  return objectList;
};
