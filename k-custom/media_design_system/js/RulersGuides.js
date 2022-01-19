var mode = 2,
	guidesCnt = 0,
	guidevCnt = 0,
	guidehCnt = 0,
	rulerStatus = 1,
	guideStatus = 1,
	isGuide = false,
  _isGuideMove = false,
  _isDragging = false,
  _isMouseDown = false,
  leftmargin,
  topmargin;

function removeInboundGuide(guide, gUid) {
	if (rulerStatus === 1 && guideStatus === 1 && ((guide.name === 'guideh') || (guide.name === 'guidev'))) {
		var gm = canvas.getItemById(gUid+'-info');
		canvas.remove(gm);
		canvas.remove(guide);
		canvas.renderAll();
	}
}

function toggleGuides() {
	var i;
	//guideStatus = (guideStatus) ? 0 : 1;
	guideStatus = 1 - guideStatus;
	var flag = (guideStatus === 1) ? 1 : 0;
	var guides = canvas.getItemsByType('line', true);
	var guides = guides.length !== 0 ? guides : canvas.getItemsByType('guideline', true);
	guides.forEach(function(l) {
		l.set('opacity', flag);
		var lTextObj = canvas.getItemById(l.id+'-info');
		lTextObj.set('opacity', 0);
		//lTextObj.set('opacity', flag);
	});
	canvas.renderAll();
	
	if (guideStatus === 1) {
		$('#show_guidelines').parent('.g-menu-item').addClass('optionEnabled');
		$('#show_guidelines').parent('.g-menu-item').children('.g-menu-item-icon').html('<i class="fa fa-check"></i>');
    $('#canvas-wrapper').attr("pageGuideLines","1");
  } else {
		$('#show_guidelines').parent('.g-menu-item').children('.g-menu-item-icon').html('');
		$('#show_guidelines').parent('.g-menu-item').removeClass('optionEnabled');
    $('#canvas-wrapper').attr("pageGuideLines","0");
	}
  activePageID = $('.page-row.g-active').attr('id');
  //console.log(activePageID);
  active_page_object = canvas.getItemsByPage(activePageID)[0];
  //console.log(active_page_object);
  active_page_object.set({
    pageGuideLines: guideStatus,
  });
  canvas.renderAll();
}

function toggleRulers() {
	rulerStatus = (rulerStatus) ? 0 : 1;
	if (rulerStatus === 1) {
		$('#show_rulers').parent('.g-menu-item').addClass('optionEnabled');
		$('.kmds-g-ruler').css('display', 'block');
		$('#show_rulers').parent('.g-menu-item').children('.g-menu-item-icon').html('<i class="fa fa-check"></i>');
    $('#canvas-wrapper').css('padding', '19px 0 0 19px');
    $('#canvas-wrapper').attr("pageRuler","1");
	} else {
		$('#show_rulers').parent('.g-menu-item').children('.g-menu-item-icon').html('');
		$('#show_rulers').parent('.g-menu-item').removeClass('optionEnabled');
		$('.kmds-g-ruler').css('display', 'none');
    $('#canvas-wrapper').css('padding', '0px');
    $('#canvas-wrapper').attr("pageRuler","0");
	}
  activePageID = $('.page-row.g-active').attr('id');
  //console.log(activePageID);
  active_page_object = canvas.getItemsByPage(activePageID)[0];
  //console.log(active_page_object);
  active_page_object.set({
    pageRuler: rulerStatus,
  });
  canvas.renderAll();
}

$(".g-ruler-widget").on("mousedown", function(e){
  /*var objs = canvas._objects.filter(function(obj){
    if (obj.type == 'line'){
      if(obj.name == 'guidev'){
        guidevCnt++;
      }
      else if(obj.name == 'guideh'){
        guidehCnt++;
      }
    }
  });*/
  //console.log("Guide mousedown");
  _isMouseDown = true;
  canvas.selection = false;
  canvas.on('mouse:move', onGuideMouseMove);
  var type = $('#measurements').val();
  if (rulerStatus && guideStatus){
    if ($(this).hasClass('horizontal')) {
      mode = 2;
      var hpoints = [0, 0, 7000, 0];
      //var hline = new fabric.Guideline(hpoints, {
      var hline = new fabric.Line(hpoints, {
        id: 'guideh-' + guidehCnt,
        name: 'guideh',
        page: activePage,
        strokeHeight: 1,
        left: -3000,
        top: -5000,
        stroke: '#00f',
				ignoreZoom: true,
				scaleX: 1,
				scaleY: 1,
				transformX: 1,
				transformY: 1,
				zoomX: 1,
				zoomY: 1,
        borderColor: 'transparent',
        hasBorders: false,
        hasControls: false,
        lockMovementY: false,
        lockMovementX: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
      });
      hline.setControlsVisibility({
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
      var tr_text = parseInt($('.g-ruler-widget.vertical .mouse-marker').css('top'));
      var htext = (Math.round(tr_text - topmargin)).toString() + 'px';
      var hmeasurement = new fabric.Text(htext, {
        top: hline.top+2,
        left: 30,
        name: 'measurement',
        id: 'guideh-' + guidehCnt + '-info',
        fontSize: 11,
        fontFamily: 'Lato',
        selectable: false,
        hasControls: false,
				borderColor: 'transparent',
      });
			hmeasurement.setControlsVisibility({
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
      canvas.add(hline).setActiveObject(hline);
      canvas.add(hmeasurement);
      canvas.renderAll();
			savedDesignFlag = false;
      guidehCnt++;
    } else if($(this).hasClass('vertical')){
      mode = 1;
      var points = [0, 0, 0, 7000];
      //var vline = new fabric.Guideline(points, {
      var vline = new fabric.Line(points, {
        name: 'guidev',
        page: activePage,
        strokeWidth: 1,
        left: -3000,
        top: -5000,
        id: 'guidev-' + guidevCnt,
        stroke: '#00f',
        originX: 'left',
        originY: 'top',
				ignoreZoom: true,
				scaleX: 1,
				scaleY: 1,
				transformX: 1,
				transformY: 1,
				zoomX: 1,
				zoomY: 1,
				borderColor: 'transparent',
        hasBorders: false,
        hasControls: false,
        lockMovementX: false,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
      });
      vline.setControlsVisibility({
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
      var lr_text = parseInt($('.g-ruler-widget.horizontal .mouse-marker').css('left'));
      var vtext = (Math.round(lr_text - leftmargin)).toString() + 'px';
      var vmeasurement = new fabric.Text(vtext, {
        left: vline.left+2,
        top: 30,
        id: 'guidev-' + guidevCnt + '-info',
        name: 'measurement',
        fontSize: 11,
        fontFamily: 'Lato',
        selectable: false,
        hasControls: false,
				borderColor: 'transparent',
      });
			vmeasurement.setControlsVisibility({
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
      canvas.add(vline).setActiveObject(vline);
      canvas.add(vmeasurement);
      canvas.renderAll();
			savedDesignFlag = false;
      guidevCnt++;
    }
  } 
  guidesCnt = guidesCnt + 1;
});

function onGuideMouseMove(o){
  _isDragging = _isMouseDown;
  if (!_isDragging) return;
	var lineobj = canvas.getActiveObject();
	if (!lineobj) return;
	//if (lineobj.type !== 'line') return;
	if (lineobj.type !== 'line' && lineobj.type !== 'guideline') return;
	if (!rulerStatus && !guideStatus) return;
  //console.log("lineobj type = "+lineobj.type);

	var pointer = canvas.getPointer(o.e);
	var lineTextObj = canvas.getItemById(lineobj.id+'-info');
		//console.log('ixx - '+ixx);
		//console.log('iyy - '+iyy);
  if(lineobj.name == 'guidev'){
    lineobj.set({
      left: pointer.x
      //left: Math.round(pointer.x - leftmargin)
    });
    var lr_text = parseInt($('.g-ruler-widget.horizontal .mouse-marker').css('left'));
		//console.log('lr_text - '+lr_text);
    lineTextObj.set({
      text: (Math.round(lr_text - leftmargin)).toString() + 'px',
      //text: (Math.round(pointer.x - leftmargin)).toString() + 'px',
      left: pointer.x + 10,
      top: pointer.y + 5,
    });    
  } else if(lineobj.name == 'guideh'){
    lineobj.set({
      top: pointer.y
      //top: Math.round(pointer.y - topmargin)
    });
    var tr_text = parseInt($('.g-ruler-widget.vertical .mouse-marker').css('top'));
		//console.log('tr_text - '+tr_text);
    lineTextObj.set({
      //text: (Math.round(tr_text - topmargin)).toString() + 'px',
      text: (Math.round(pointer.y - topmargin)).toString() + 'px',
      left: pointer.x + 10,
      top: pointer.y + 5,
    });
  }
  lineobj.setCoords();
  canvas.renderAll();
}

document.documentElement.addEventListener('mouseup', function(e){
  //console.log("Guide mouseup");
  _isMouseDown = false;
	var isDragEnd = _isDragging;
  _isDragging = false;
  var lineobj = canvas.getActiveObject();
	var pointer = canvas.getPointer(e);
  if (isDragEnd || _isGuideMove) {
    //if(lineobj && lineobj.type == 'line') {
    if(lineobj && (lineobj.type == 'line'|| lineobj.type == 'guideline')) {
      lineobj.setCoords();
			if(lineobj.name == 'guidev' && (e.path[2].className == 'g-ruler-widget vertical' || e.path[2].className == 'kmds-g-ruler')){
				removeInboundGuide(lineobj, lineobj.id)
			}
			if(lineobj.name == 'guideh' && (e.path[2].className == 'g-ruler-widget horizontal' || e.path[2].className == 'kmds-g-ruler')){
				removeInboundGuide(lineobj, lineobj.id)
			}
    }
    canvas.selection = true;
    canvas.off('mouse:move', onGuideMouseMove);
    canvas.off('object:moving', onGuideMove);
    canvas.renderAll();
		savedDesignFlag = false;
  }
	_isGuideMove = false;
	if(!savedDesignFlag){
		DetectTemplateChanges();
	}
});

function onGuideMove(o){
	_isGuideMove = true;
  var lineobj = o.target;
  var lineobj_left = parseInt(lineobj.left);
  var lineobj_top = parseInt(lineobj.top);
	if (!lineobj) return;
	//if (lineobj.type !== 'line') return;
	if (lineobj.type !== 'guideline' && lineobj.type !== 'line') return;
	if (!rulerStatus && !guideStatus) return;
	var pointer = canvas.getPointer(o.e);
	var lineTextObj = canvas.getItemById(lineobj.id+'-info');
  if(lineobj.name == 'guidev'){
    lineobj.set({
      left: pointer.x
      //left: Math.round(pointer.x - leftmargin)
    });
    //console.log("leftmargin = "+leftmargin);
    var lr_text = parseInt($('.g-ruler-widget.horizontal .mouse-marker').css('left'));
    lineTextObj.set({
      //text: (Math.round(lr_text - leftmargin)).toString() + 'px',
      text: (Math.round(pointer.x - leftmargin)).toString() + 'px',
      left: pointer.x + 10,
      top: pointer.y + 5,
    });    
		lineobj.setCoords();
  } else if(lineobj.name == 'guideh'){
    lineobj.set({
      top: pointer.y
      //top: Math.round(pointer.y - topmargin)
    });
    //console.log("topmargin = "+topmargin);
    var tr_text = parseInt($('.g-ruler-widget.vertical .mouse-marker').css('top'));
    lineTextObj.set({
      //text: (Math.round(tr_text - topmargin)).toString() + 'px',
      text: (Math.round(pointer.y - topmargin)).toString() + 'px',
      left: pointer.x + 10,
      top: pointer.y + 5,
    });
		lineobj.setCoords();
  }
  canvas.renderAll();
}

function onGuideOver(o){
  //console.log("onGuideOver");
	//if (!rulerStatus && !guideStatus) return;
  if(rulerStatus){
    if (!guideStatus) return;
    var selectedObj = o.target;
    var pointer = canvas.getPointer(o.e);
    //if(selectedObj && selectedObj.type == 'line'){
    if(selectedObj && (selectedObj.type == 'line' || selectedObj.type == 'guideline')){
      //selectedObj.setActiveObject();
      selectedObj.set('hasBorders', false);
      selectedObj.set('hasControls', false);
      if(selectedObj.name == 'guidev'){
        //selectedObj.set('width', 10);
        $( ".canvas-container" ).attr('class', 'canvas-container');
        $( ".canvas-container" ).addClass( "g-cursor-col-resize" );
      } else if(selectedObj.name == 'guideh'){
        //selectedObj.set('height', 10);
        $( ".canvas-container" ).attr('class', 'canvas-container');
        $( ".canvas-container" ).addClass( "g-cursor-row-resize" );
      }
      var guidetextobj = canvas.getItemById(selectedObj.id+'-info');
      if(guidetextobj.name == 'measurement'){
        guidetextobj.set({
          opacity: 1,
        });
      }
      canvas.renderAll();
    }
  }
}

function onGuideOut(o){
	//if (!rulerStatus && !guideStatus) return;
	if (rulerStatus){
    if (!guideStatus) return;
    var selectedObj = o.target;
    //if(selectedObj && selectedObj.type == 'line'){
    if(selectedObj && (selectedObj.type == 'line' || selectedObj.type == 'guideline')){
      $( ".canvas-container" ).attr('class', 'canvas-container');
      $( ".canvas-container" ).addClass( "g-cursor-select" );
      var guidetextobj = canvas.getItemById(selectedObj.id+'-info');
      if(guidetextobj.name == 'measurement'){
        guidetextobj.set({
          opacity: 0
        });
      }
      //canvas.renderAll();
    }
  }
}
/**
 * Callback function updateRulerGuideOnZoom()
 * to set line stokeWidth on zoom level
 **/
function updateRulerGuideOnZoom(){
  var zoomLevel = canvas.getZoom();
  var zoomDiff = parseFloat(1/zoomLevel);
  canvas.getObjects().forEach(function(o) {
    if(o && (o.type == 'line')){
      var strokeValue = parseFloat(1*zoomDiff);
      o.set('strokeWidth', strokeValue).setCoords();
      var guidetextobj = canvas.getItemById(o.id+'-info');
      var fontValue = parseFloat(11*zoomDiff);
      guidetextobj.set('fontSize', fontValue).setCoords();
      canvas.renderAll();
    }
  });
}
