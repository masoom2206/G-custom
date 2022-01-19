var smartGuideStatus = 0;
var guidesCnt = 0;
fabric.SmartGuideline = fabric.util.createClass(fabric.Line, {
	type: 'SmartGuideline',
	selectable: false,
	hasControls: false,
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
    	stroke: 'green', //#00f
      originX: "center",
      originY: "center",
      lockScalingX: true,
      lockScalingY: true,
      hasBorders: false,
      perPixelTargetFind: true,
      borderColor: 'transparent',
      ignoreZoom: true,
      object_link : this.object_link,
		});
	},
	_render: function(ctx) {
		this.callSuper('_render', ctx);
	}
});
fabric.SmartGuideline.fromObject = function(object, callback) {
  callback && callback(new fabric.SmartGuideline(object));
};
/******************************************************************************/
/*jQuery(".canvas-container").mouseover(function() {
  //canvas off start
  canvas.off('mouse:down', _drawObjectGuides);
  canvas.off('object:moving', _moveObjectGuides);
  //canvas off end
  canvas.on('mouse:down', _drawObjectGuides);
  canvas.on('object:moving', _moveObjectGuides);
});*/
/**
 * Callback function _drawObjectGuides()
 **/
function _drawObjectGuides() {
  //var obj = canvas.getActiveObject();
  var objects = canvas
      .getObjects()
      .filter(o => o.type !== "SmartGuideline" && o.type !== "page" && o.type !== 'text' && o.type !== 'line' && o.type !== 'guideline' && o.type !== 'PageTrimBox' && o.type !== 'PageMediaBox' && o.type !== 'ConnectorHandleEnd' && o.type !== 'ConnectorHandleStart');
  _removeGuide();
  for (var obj of objects) {
    if(jQuery("#canvas-container").hasClass('kmds')){
      smartGuideStatus = 1;
    }
    if(obj && smartGuideStatus == 1 && obj.opacity > 0){
      obj.guides = {};
      //_removeGuide();
      //var objCoords = obj.getBoundingRect();
      var w = obj.getScaledWidth();
      var h = obj.getScaledHeight();
      var obj_top = obj.top;
      var obj_left = obj.left;
      if(obj.type == 'circle' || obj.type == 'image'){
        obj_top = obj_top - h / 2;
        obj_left = obj_left - w / 2;
      }
      _drawGuide("top", obj_top, obj);
      _drawGuide("left", obj_left, obj);
      _drawGuide("centerX", obj_left + w / 2, obj);
      _drawGuide("centerY", obj_top + h / 2, obj);
      _drawGuide("right", obj_left + w, obj);
      _drawGuide("bottom", obj_top + h, obj);
      obj.setCoords();
    }
    /*else {
      smartGuideStatus = 0;
      _removeGuide();
    }*/
  }
}
/**
 * Callback function _drawActiveObjectGuides()
 **/
function _drawActiveObjectGuides(obj) {
  if(obj && smartGuideStatus == 1 && obj.opacity > 0){
    _snapObjectGuide();
    var w = obj.getScaledWidth();
    var h = obj.getScaledHeight();
    var obj_top = obj.top;
    var obj_left = obj.left;
    if(obj.type == 'circle' || obj.type == 'image'){
      obj_top = obj_top - h / 2;
      obj_left = obj_left - w / 2;
    }
    _drawGuide("top", obj_top, obj);
    _drawGuide("left", obj_left, obj);
    _drawGuide("centerX", obj_left + w / 2, obj);
    _drawGuide("centerY", obj_top + h / 2, obj);
    _drawGuide("right", obj_left + w, obj);
    _drawGuide("bottom", obj_top + h, obj);
    obj.setCoords();
  }
}
/**
 * Callback function inRange()
 * If the 2 different coordinates are in range
 **/
function inRange(a, b) {
  return Math.abs(a - b) <= 10;
}
/**
 * Callback function snapObject()
 * to position the object in range
 **/
function snapObject(obj, side, pos) {
  var w = obj.getScaledWidth();
  var h = obj.getScaledHeight();
  if(obj.type == 'circle' || obj.type == 'image'){
    if(side == 'top'){
      pos = pos + h/2;
    }
    else if(side == 'left'){
      pos = pos + w/2;
    }
  }
  obj.set(side, pos);
  obj.setCoords();
  _drawActiveObjectGuides(obj);
}
/**
 * Callback function _drawGuide()
 **/
function _drawGuide(side, pos, obj) {
  //var obj = canvas.getActiveObject();
  let ln;
  //var color = "rgb(178, 207, 255)";
  var color = "rgb(0, 0, 255)";
  //console.log(pos);
  switch (side) {
    case "top":
      var points = [0, 0, 7000, 0];
      ln = new fabric.SmartGuideline(points, {
        left: 0,
        top: pos,
        id: obj.id+'-'+side,
        evented: true,
        stroke: color,
        selectable: false,
        opacity: 0
      });
      break;
    case "bottom":
      var points = [0, 0, 7000, 0];
      ln = new fabric.SmartGuideline(points, {
        left: 0,
        top: pos,
        id: obj.id+'-'+side,
        evented: true,
        stroke: color,
        selectable: false,
        opacity: 0
      });
      break;
    case "centerY":
      var points = [0, 0, 7000, 0];
      ln = new fabric.SmartGuideline(points, {
        left: 0,
        top: pos,
        id: obj.id+'-'+side,
        evented: true,
        stroke: color,
        selectable: false,
        opacity: 0
      });
      break;
    case "left":
      var points = [0, 7000, 0, 0];
      ln = new fabric.SmartGuideline(points, {
        left: pos,
        top: 0,
        id: obj.id+'-'+side,
        evented: true,
        stroke: color,
        selectable: false,
        opacity: 0
      });
      break;
    case "right":
      var points = [0, 7000, 0, 0];
      ln = new fabric.SmartGuideline(points, {
        left: pos,
        top: 0,
        id: obj.id+'-'+side,
        evented: true,
        stroke: color,
        selectable: false,
        opacity: 0
      });
      break;
    case "centerX":
      var points = [0, 7000, 0, 0];
      ln = new fabric.SmartGuideline(points, {
        left: pos,
        top: 0,
        id: obj.id+'-'+side,
        evented: true,
        stroke: color,
        selectable: false,
        opacity: 0
      });
      break;
    default:
      break;
  }
  if(obj.guides[side]){
    if (obj.guides[side] instanceof fabric.SmartGuideline) {
      // remove the line
      canvas.remove(obj.guides[side]);
      delete obj.guides[side];
    }
  }
  obj.guides[side] = ln;
  canvas.add(ln);
  canvas.renderAll();
}
/**
 * Callback function _removeGuide()
 **/
function _removeGuide() {
  //smartGuideStatus = 0;
  var SmartGuideline = canvas.getItemsByType('SmartGuideline', true);
  SmartGuideline.forEach(function(l) {
    canvas.remove(l);
    canvas.renderAll();
  });
}
/**
 * Callback function _moveObjectGuides()
 **/
function _moveObjectGuides(e) {
  var obj = e.target;
  _drawActiveObjectGuides(obj);
  // Loop through each object in canvas
  if(obj && smartGuideStatus == 1 && obj.lock_position == 0){
    var objects = canvas
      .getObjects()
      .filter(o => o.type !== "SmartGuideline" && o.type !== "page" && o.type !== 'text' && o.type !== 'line' && o.type !== 'guideline' && o.type !== 'PageTrimBox' && o.type !== 'PageMediaBox' && o.type !== 'ConnectorHandleEnd' && o.type !== 'ConnectorHandleStart' && o.opacity > 0 && o !== obj);
    var matches = new Set();
    for (var i of objects) {
      for (var side in obj.guides) {
        var axis, newPos;
        switch (side) {
          case "right":
            axis = "left";
            newPos = i.guides[side][axis] - obj.getScaledWidth();
            break;
          case "bottom":
            axis = "top";
            newPos = i.guides[side][axis] - obj.getScaledHeight();
            break;
          case "centerX":
            axis = "left";
            newPos = i.guides[side][axis] - obj.getScaledWidth() / 2;
            break;
          case "centerY":
            axis = "top";
            newPos = i.guides[side][axis] - obj.getScaledHeight() / 2;
            break;
          default:
            axis = side;
            newPos = i.guides[side][axis];
            break;
        }
        if (inRange(obj.guides[side][axis], i.guides[side][axis])) {
          matches.add(side);
          snapObject(obj, axis, newPos);
        }

        if (side === "left") {
          if (inRange(obj.guides["left"][axis], i.guides["right"][axis])) {
            matches.add(side);
            snapObject(obj, axis, i.guides["right"][axis]);
          }
        } else if (side === "right") {
          if (inRange(obj.guides["right"][axis], i.guides["left"][axis])) {
            matches.add(side);
            snapObject(obj, axis, i.guides["left"][axis] - obj.getScaledWidth());
          }
        } else if (side === "top") {
          if (inRange(obj.guides["top"][axis], i.guides["bottom"][axis])) {
            matches.add(side);
            snapObject(obj, axis, i.guides["bottom"][axis]);
          }
        } else if (side === "bottom") {
          if (inRange(obj.guides["bottom"][axis], i.guides["top"][axis])) {
            matches.add(side);
            snapObject(obj, axis, i.guides["top"][axis] - obj.getScaledHeight());
          }
        } else if (side === "centerX") {
          if (inRange(obj.guides["centerX"][axis], i.guides["left"][axis])) {
            matches.add(side);
            snapObject(
              obj,
              axis,
              i.guides["left"][axis] - obj.getScaledWidth() / 2
            );
          } else if (
            inRange(obj.guides["centerX"][axis], i.guides["right"][axis])
          ) {
            matches.add(side);
            snapObject(
              obj,
              axis,
              i.guides["right"][axis] - obj.getScaledWidth() / 2
            );
          }
        } else if (side === "centerY") {
          if (inRange(obj.guides["centerY"][axis], i.guides["top"][axis])) {
            matches.add(side);
            snapObject(
              obj,
              axis,
              i.guides["top"][axis] - obj.getScaledHeight() / 2
            );
          } else if (
            inRange(obj.guides["centerY"][axis], i.guides["bottom"][axis])
          ) {
            matches.add(side);
            snapObject(
              obj,
              axis,
              i.guides["bottom"][axis] - obj.getScaledHeight() / 2
            );
          }
        }
      }
    }
    for (var k of matches) {
      obj.guides[k].set("opacity", 1);
    }
    obj.setCoords();
  }
}
/**
 * Callback function _moveObjectGuides()
 **/
/*function _movedObjectGuides(e) {
  // Add the smart guides around the object
  var obj = e.target;
  _drawActiveObjectGuides(obj);
}*/
/**
 * Callback function _drawGuide()
 **/
function _moveGuide(id, side, pos) {
  //_drawObjectGuides();
  var SmartGuideline = canvas.getItemById(id);
  if(SmartGuideline){
    switch (side) {
      case "top":
        SmartGuideline.set({
          left: 0,
          top: pos,
          opacity: 1
        });
        break;
      case "bottom":
        SmartGuideline.set({
          left: 0,
          top: pos,
          opacity: 1
        });
        break;
      case "centerY":
        SmartGuideline.set({
          left: 0,
          top: pos,
          opacity: 1
        });
        break;
      case "left":
        SmartGuideline.set({
          left: pos,
          top: 0,
          opacity: 1
        });
        break;
      case "right":
        SmartGuideline.set({
          left: pos,
          top: 0,
          opacity: 1
        });
        break;
      case "centerX":
        SmartGuideline.set({
          left: pos,
          top: 0,
          opacity: 1
        });
        break;
      default:
        break;
    }
    canvas.renderAll();
  }
}
/**
 * Callback function _hideGuide()
 **/
function _hideGuide(id) {
  var SmartGuideline = canvas.getItemById(id);
  if(SmartGuideline){
    SmartGuideline.set({
      opacity: 0
    });
    canvas.renderAll();
  }
}
/**
 * Callback function _snapObjectGuide()
 **/
function _snapObjectGuide() {
  var obj = canvas.getActiveObject();
  if(obj){
    obj.set({
      lockRotation: true,
      hasControls: false,
      selectable: true,
      hasBorders: true,
      borderColor: '#eb2cf6',
      editable: true,
    });
    canvas.renderAll();
  }
}