/**
 * Callback function _drawPageTrimBox()
 **/
function _drawPageTrimBox(pageID) {
  _drawTrimBox("top", pageID);
  _drawTrimBox("left", pageID);
  _drawTrimBox("right", pageID);
  _drawTrimBox("bottom", pageID);
  _drawCropMarks(pageID);
}
/**
 * Callback function _drawTrimBox()
 **/
function _drawTrimBox(side, pageID) {
  //var activepage = jQuery('.page-row.g-active').attr('id');
  var obj = canvas.getItemById(pageID);
  var pageCoordinates = obj.getBoundingRect();
  var pageTop = pageCoordinates.top;
  var pageLeft = pageCoordinates.left;
  var p_width = pageCoordinates.width;
  var p_height = pageCoordinates.height;
  var color = "rgb(255, 153, 255)";
  switch (side) {
    case "top":
      var points = [0, 0, p_width, 0];
      var ln = new fabric.PageTrimBox(points, {
        left: pageLeft,
        top: pageTop,
        id: obj.id+'-trimbox'+side,
        name: 'Page TrimBox',
        page: obj.id,
        evented: true,
        stroke: color,
        selectable: false,
        opacity: 1,
        originX: 'left',
        originY: 'center',
        lock_position: 1,
        strokeDashArray: [5, 5],
      });
      break;
    case "bottom":
      var points = [0, 0, p_width, 0];
      var ln = new fabric.PageTrimBox(points, {
        left: pageLeft,
        top: (pageTop+p_height),
        id: obj.id+'-trimbox'+side,
        name: 'Page TrimBox',
        page: obj.id,
        evented: true,
        stroke: color,
        selectable: false,
        opacity: 1,
        originX: 'left',
        originY: 'center',
        lock_position: 1,
        strokeDashArray: [5, 5],
      });
      break;
    case "left":
      var points = [0, p_height, 0, 0];
      var ln = new fabric.PageTrimBox(points, {
        left: pageLeft,
        top: pageTop,
        id: obj.id+'-trimbox'+side,
        name: 'Page TrimBox',
        page: obj.id,
        evented: true,
        stroke: color,
        selectable: false,
        opacity: 1,
        originX: 'center',
        originY: 'top',
        lock_position: 1,
        strokeDashArray: [5, 5],
      });
      break;
    case "right":
      var points = [0, p_height, 0, 0];
      var ln = new fabric.PageTrimBox(points, {
        left: (pageLeft+p_width),
        top: pageTop,
        id: obj.id+'-trimbox'+side,
        name: 'Page TrimBox',
        page: obj.id,
        evented: true,
        stroke: color,
        selectable: false,
        opacity: 1,
        originX: 'center',
        originY: 'top',
        lock_position: 1,
        strokeDashArray: [5, 5],
      });
      break;
    default:
      break;
  }
  canvas.add(ln);
  ln.setCoords();
  canvas.renderAll();
}
/**
 * Callback function _drawCropMarks()
 **/
function _drawCropMarks(pageID) {
/**Crop Marks Start**/
  var obj = canvas.getItemById(pageID);
  var pageCoordinates = obj.getBoundingRect();
  var pageTop = pageCoordinates.top;
  var pageLeft = pageCoordinates.left;
  var p_width = pageCoordinates.width;
  var p_height = pageCoordinates.height;
  var color = "rgb(0, 0, 0)";
  /*Top top*/
  var points = [0, 14, 0, 0];
  var ln = new fabric.PageTrimBox(points, {
    left: pageLeft,
    top: pageTop-28,
    id: obj.id+'-cropMarksTT',
    name: 'Page CropMarks',
    page: obj.id,
    evented: true,
    stroke: color,
    selectable: false,
    opacity: 1,
    originX: 'center',
    originY: 'top',
    lock_position: 1,
  });
  canvas.add(ln);
  ln.setCoords();
  /*Left Top*/
  var points = [0, 0, 14, 0];
  var ln = new fabric.PageTrimBox(points, {
    left: pageLeft-28,
    top: pageTop,
    id: obj.id+'-cropMarksLT',
    name: 'Page CropMarks',
    page: obj.id,
    evented: true,
    stroke: color,
    selectable: false,
    opacity: 1,
    originX: 'left',
    originY: 'center',
    lock_position: 1,
  });
  canvas.add(ln);
  ln.setCoords();
  /*Top Right*/
  var points = [0, 14, 0, 0];
  var ln = new fabric.PageTrimBox(points, {
    left: pageLeft+p_width,
    top: pageTop-28,
    id: obj.id+'-cropMarksTR',
    name: 'Page CropMarks',
    page: obj.id,
    evented: true,
    stroke: color,
    selectable: false,
    opacity: 1,
    originX: 'center',
    originY: 'top',
    lock_position: 1,
  });
  canvas.add(ln);
  ln.setCoords();
  /*Right Right*/
  var points = [0, 0, 14, 0];
  var ln = new fabric.PageTrimBox(points, {
    left: pageLeft+p_width+28,
    top: pageTop,
    id: obj.id+'-cropMarksRR',
    name: 'Page CropMarks',
    page: obj.id,
    evented: true,
    stroke: color,
    selectable: false,
    opacity: 1,
    originX: 'right',
    originY: 'center',
    lock_position: 1,
  });
  canvas.add(ln);
  ln.setCoords();
  canvas.renderAll();
  /*Left Bottom Bottom*/
  var points = [0, 14, 0, 0];
  var ln = new fabric.PageTrimBox(points, {
    left: pageLeft,
    top: pageTop+p_height+28,
    id: obj.id+'-cropMarksLBB',
    name: 'Page CropMarks',
    page: obj.id,
    evented: true,
    stroke: color,
    selectable: false,
    opacity: 1,
    originX: 'left',
    originY: 'bottom',
    lock_position: 1,
  });
  canvas.add(ln);
  ln.setCoords();
  /*Left Bottom*/
  var points = [0, 0, 14, 0];
  var ln = new fabric.PageTrimBox(points, {
    left: pageLeft-28,
    top: pageTop+p_height,
    id: obj.id+'-cropMarksLB',
    name: 'Page CropMarks',
    page: obj.id,
    evented: true,
    stroke: color,
    selectable: false,
    opacity: 1,
    originX: 'left',
    originY: 'center',
    lock_position: 1,
  });
  canvas.add(ln);
  ln.setCoords();
  /*Right Bottom*/
  var points = [0, 0, 14, 0];
  var ln = new fabric.PageTrimBox(points, {
    left: pageLeft+p_width+28,
    top: pageTop+p_height,
    id: obj.id+'-cropMarksRB',
    name: 'Page CropMarks',
    page: obj.id,
    evented: true,
    stroke: color,
    selectable: false,
    opacity: 1,
    originX: 'right',
    originY: 'center',
    lock_position: 1,
  });
  canvas.add(ln);
  ln.setCoords();
  /*Right Bottom Bottom*/
  var points = [0, 14, 0, 0];
  var ln = new fabric.PageTrimBox(points, {
    left: pageLeft+p_width,
    top: pageTop+p_height+28,
    id: obj.id+'-cropMarksRBB',
    name: 'Page CropMarks',
    page: obj.id,
    evented: true,
    stroke: color,
    selectable: false,
    opacity: 1,
    originX: 'left',
    originY: 'bottom',
    lock_position: 1,
  });
  canvas.add(ln);
  ln.setCoords();
  canvas.renderAll();
/**Crop Marks End**/
}
