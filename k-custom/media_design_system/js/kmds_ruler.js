//Global Variables
var leftRuler, topRuler, pageLeft = 0, pageTop = 0; //, mainCanvas;
var selectAll, isDown;
var handSelected = false;
/**
 * Callback function redrawRulers()
 * to apply ruler
 **/
function redrawRulers() {
  topRuler.clear();
  leftRuler.clear();
  topRuler.setBackgroundColor('#fff');
  leftRuler.setBackgroundColor('#fff');
  
  var zoomLevel = canvas.getZoom();
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  for (i = 0; i < canvasWidth; i += (5 * zoomLevel)) {
    var x = (i%50 == 0) ? 10 : 15;
    var topLine = new fabric.Line([i, x, i, 20], {
      stroke: 'black',
      strokeWidth: 1,
      selectable: false
    });
    topRuler.add(topLine);
    var y = (i%50==0)?10:5;
    var leftLine = new fabric.Line([y, i, 0, i], {
      stroke: 'black',
      strokeWidth: 1,
      selectable: false
    });
    leftRuler.add(leftLine);
    if(i%50 == 0){
      var text = new fabric.Text((Math.round(i / zoomLevel)).toString(), {
        left: i,
        top: 0,
        fontSize: 10,
        selectable: false
      });
      topRuler.add(text);
      var text2 = new fabric.Text((Math.round(i / zoomLevel)).toString(), {
        left: 20,
        top: i,
        fontSize: 10,
        angle: 90,
        selectable: false
      });
      leftRuler.add(text2);
    }
  }
}
/**
 * Callback function updateRulers()
 * to update ruler for negative position
 **/
function updateRulers() {
  var pageID = $(".page-row.g-active").attr("id");
  var objLeft = 0;
  var objTop = 0;
  canvas.getObjects().forEach(function(obj) {
    if(obj.id === pageID && obj.type == 'page') {
      objLeft = obj.left;
      objTop = obj.top;
    }
  });
  if((objLeft != pageLeft || objTop != pageTop)){
    redrawRulers();
    //Shift the ruler
    var tRuler = new fabric.ActiveSelection(topRuler.getObjects(), {
      topRuler: topRuler,
    });
    tRuler.left += objLeft;
    topRuler.renderAll();
    var lRuler = new fabric.ActiveSelection(leftRuler.getObjects(), {
      leftRuler: leftRuler,
    });
    lRuler.top += objTop;
    leftRuler.renderAll();
    //Add negative ruler
    var zoomLevel = canvas.getZoom();
    var i_num = 0;
    for (i = objLeft; i > 0; i -= (5 * zoomLevel)) {
      i_num = i_num + 5;
      var x = (i_num%50 == 0) ? 10 : 15;
      var topLine = new fabric.Line([i, x, i, 20], {
        stroke: 'black',
        strokeWidth: 1,
        selectable: false
      });
      topRuler.add(topLine);
      if(i_num%50 == 0){
        var text = new fabric.Text('-'+(Math.round(i_num / zoomLevel)).toString(), {
          left: i,
          top: 0,
          fontSize: 10,
          selectable: false
        });
        topRuler.add(text);
      }
    }
    var i_num = 0;
    for (i = objTop; i > 0; i -= (5 * zoomLevel)) {
      i_num = i_num + 5;
      var y = (i_num%50 == 0) ? 10 : 5;
      var leftLine = new fabric.Line([y, i, 0, i], {
        stroke: 'black',
        strokeWidth: 1,
        selectable: false
      });
      leftRuler.add(leftLine);
      if(i_num%50 == 0){
        var text2 = new fabric.Text('-'+(Math.round(i_num / zoomLevel)).toString(), {
          left: 20,
          top: i,
          fontSize: 10,
          angle: 90,
          selectable: false
        });
        leftRuler.add(text2);
      }
    }
    pageLeft = objLeft;
    pageTop = objTop;
  }
}
/**
 * Callback function wheel()
 * to get the scroll action
 **/
function wheel(event){
  var delta = 0;
  if (!event)
    event = window.event;
  if (event.wheelDelta) {
    delta = event.wheelDelta/120;
  } else if (event.detail) {
    delta = -event.detail/3;
  }
  if (delta)
    increasesdCanvas(delta);
}
/**
 * Callback function increasesdCanvas()
 * to increased canvas height width
 * and scroll the page object.
 **/
function increasesdCanvas(delta ){
  currentCanvasHeight = canvas.height
  currentCanvasWidth = canvas.width
  var pageID = $(".page-row.g-active").attr("id");
  if(delta > 0) {
    //canvas.width  = currentCanvasWidth + 10;
    canvas.height = currentCanvasHeight + 10;
    canvas.getObjects().forEach(function(obj) {
      //if(obj.id === pageID && obj.type == 'page') {
        //obj.left += 10;
        obj.top += 10;
     // }
    });
  }
  if(delta < 0){
    //canvas.width  = currentCanvasWidth - 10;
    canvas.height = currentCanvasHeight - 10;
    canvas.getObjects().forEach(function(obj) {
      //if(obj.id === pageID && obj.type == 'page') {
        //obj.left -= 10;
        obj.top -= 10;
      //}
    });
  }
  canvas.renderAll();
  updateRulers();
}

/*$(document).ready(function() {
  
  topRuler = new fabric.Canvas('kmds-top-ruler');
  leftRuler = new fabric.Canvas('kmds-left-ruler');
 
  redrawRulers();
  canvas.on('mouse:up', function(){
    updateRulers();
  });
  canvas.on('mouse:down', function (e) {
    if(handSelected){
      var ev = window.event;
      ev.preventDefault();
      isDown = true;
      canvas.discardActiveObject();
      var selectAll = new fabric.ActiveSelection(canvas.getObjects(), {
        canvas: canvas,
      });
      selectAll.hasControls = false;
      selectAll.hasRotatingPoint = false;
      selectAll.selectable = false;
      canvas.setActiveObject(selectAll);
      canvas.requestRenderAll();
    }
  });
  canvas.on('mouse:up', function (e) {
    if(handSelected){
      var ev = window.event;
      ev.preventDefault();
      isDown = false;
      canvas.discardActiveObject();
    }
  });
  canvas.on('mouse:move', function(e){
    if(handSelected){
      if (!isDown) return;
      var pointer = canvas.getPointer(e.e);
      var selectAll = canvas.getActiveObject();
      selectAll.left = Math.abs(pointer.x);
      selectAll.top = Math.abs(pointer.y);
      console.log("left ="+pointer.x)
      console.log("Top ="+pointer.y)
    }
    canvas.renderAll();
    updateRulers();
  });
  $('#zoom-in').click(function() {
  	canvas.setZoom(canvas.getZoom() * 1.1);
    redrawRulers();
	});
  
  $('#zoom-out').click(function() {
  	canvas.setZoom(canvas.getZoom() / 1.1);
    redrawRulers();
	});
  //mouse wheel scroll event
  if (window.addEventListener)
    window.addEventListener('DOMMouseScroll', wheel, false);
  window.onmousewheel = document.onmousewheel = wheel;
});*/