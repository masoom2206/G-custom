  /**
 * A js @file
 * for canvas functionality at 
 * product edit page
 **/
var uid = drupalSettings.uid;
var user_name = drupalSettings.user_name;
var user_email = drupalSettings.user_email;
var template_id = drupalSettings.template_id;
var access_check_api = drupalSettings.access_check_api;
var user_roles = drupalSettings.user_roles;
var media_base_url = drupalSettings.media_base_url;
var handSelected = false;
var movec = false;
var ixx = 0;
var iyy = 0;
var z = [25, 50, 100, 150, 200, 300, 400, 800];
var newpage = 0;
var API_KEY = drupalSettings.auth_code;
var kmTemplateChanged = false;
var active_page_width = window.innerWidth;
var active_page_height = window.innerHeight;
var pageArr = [];
//initialize canvas
fabric.DPI = 72;
var canvas = new fabric.Canvas('c', {
  backgroundColor : "#eaeaea  ",
  //backgroundColor : "#f8f8f8",
  preserveObjectStacking: true,
});
// fabric.Object.prototype.objectCaching = false;

jQuery(window).on('resize', function(){
  canvasResize();
});
jQuery(window).on('scroll', function(){
  canvasResize();
}); 
jQuery(window).on('load', function(){
  canvasResize();
});
/**
 * Keyboard event on onkeyup
 **/
document.onkeyup = function(e) {
	var key;
	if(window.e){
		key = window.e.keyCode;
	}
	else{
		key = e.keyCode;
	}
	switch(key){
		case 32: //handpan "leaving spacebar"
      jQuery('#toolbar .toolbar-button .action-button.g-active').removeClass('g-active');
			if(handSelected){
        console.log("onkeyup ="+key); 
        e.preventDefault();
        handSelected = false;
        deactivateHandtool();
        jQuery('#toolbar .toolbar-button button[data-title=Select]').trigger('click');
			}
			break;
		default:
			break;
	}
}
/**
 * Keyboard event on onkeydown
 **/
document.onkeydown = function(e) {
  // console.log(e.keyCode); 
	var key;
	if(window.e){
		key = window.e.keyCode;
	}
	else{
		key = e.keyCode;
	}
	switch(key){
		case 32: //handpan "press spacebar"
			if(canvas.getActiveObject() && canvas.getActiveObject().type == 'textbox' && canvas.getActiveObject().isEditing){
				return;
			}
			if(e.target.type != 'text'){
        e.preventDefault();
        if(handSelected == false){
          jQuery('#toolbar .toolbar-button .action-button.g-active').removeClass('g-active');
          console.log("onkeydown ="+key); 
          jQuery('#toolbar .toolbar-button #handtool').trigger('click');
        }
        /*else {
          handSelected = false;
          jQuery('#toolbar .toolbar-button button[data-title=Select]').trigger('click');
        }*/
      }
    break;
		case 9: //"press tab key"
      if(!e.shiftKey && !e.ctrlKey && !e.altKey){
        e.preventDefault();
        if(jQuery("#media-kit-title-slide-left").hasClass("active")){
          jQuery("#media-kit-title-slide-left").trigger('click');
        }
        else {
          jQuery("#media-kit-title-slide-right").trigger('click');
        }
        /*if(jQuery(".media-kit-image").hasClass("active")){
          e.preventDefault();
          if(){
            var mediakit = jQuery(".media-kit-image.active").prev().attr("data-value");
            if(mediakit){
              jQuery(".left-panel #mediakit-"+mediakit+" .media-kit-image-title").trigger('click');
            }
          }
          else {
            var mediakit = jQuery(".media-kit-image.active").next().attr("data-value");
            if(mediakit){
              jQuery(".left-panel #mediakit-"+mediakit+" .media-kit-image-title").trigger('click');
            }
          }
        }*/
      }
    break;
		case 97: //zoom "ctrl+1"
			//100%
      if(e.ctrlKey){
        e.preventDefault();
        var zoomv = 100;
        jQuery('#zoomb .caption').html(zoomv+'%');
        zoomv = zoomv/100;
        kmdsDesignZoomIn(zoomv);
      }
    break;
		case 98: //zoom "ctrl+2"
			//200%
      if(e.ctrlKey){
        e.preventDefault();
        var zoomv = 200;
        jQuery('#zoomb .caption').html(zoomv+'%');
        zoomv = zoomv/100;
        kmdsDesignZoomIn(zoomv);
			}
    break;
		case 100: //zoom "ctrl+4"
			//400%
      if(e.ctrlKey){
        e.preventDefault();
        var zoomv = 400;
        jQuery('#zoomb .caption').html(zoomv+'%');
        zoomv = zoomv/100;
        kmdsDesignZoomIn(zoomv);
      }
    break;
		case 101: //zoom "ctrl+5"
			//50%
      if(e.ctrlKey){
        e.preventDefault();
        var zoomv = 50;
        jQuery('#zoomb .caption').html(zoomv+'%');
        zoomv = zoomv/100;
        kmdsDesignZoomIn(zoomv);
      }
    break;
		case 104: //zoom "ctrl+8"
			//800%
      if(e.ctrlKey){
        e.preventDefault();
        var zoomv = 800;
        jQuery('#zoomb .caption').html(zoomv+'%');
        zoomv = zoomv/100;
        kmdsDesignZoomIn(zoomv);
      }
    break;
		case 96: //zoom "ctrl+0"
			//original-view reset zoom
      if(e.ctrlKey){
        e.preventDefault();
        var zoomv = 100;
        jQuery('#zoomb .caption').html(zoomv+'%');
        zoomv = zoomv/100;
        kmdsDesignZoomOut(zoomv);
      }
    break;
    case 46:  /* delete */
      if(!e.shiftKey && !e.ctrlKey && !e.altKey){
        if(canvas.getActiveObject() && !canvas.getActiveObject().isEditing){
          //to delete active object.
          var activeObj = canvas.getActiveObject();
          if(activeObj.lock_position == 0){
            kmModalWindow("Delete this object?  This action cannot be undone.");
            jQuery(".g-dialog-footer .btn-primary").addClass("delete-object");
            jQuery(".g-dialog-footer .btn-primary").text("Delete");
          }
        }
      }
    break;
		default:
    break;
	}
}
/**
 * Keyboard document click event
 **/
jQuery(document).on('click', '.toolbar-button .tool-view',function () {
	var data_view = jQuery(this).attr("data-view");
  var page_format = jQuery("#page_format").val();
  if(page_format == 'pdf'){
    var pageID = jQuery("#displayed-page").attr("pageid");
    var activepageobj = canvas.getItemById(pageID+'MediaBox');
    if(!activepageobj){
      var activepageobj = canvas.getActivePageObj();
    }
  }
  else {
    var activepageobj = canvas.getActivePageObj();
  }
  switch(data_view) {
		case 'handPan':
      //Click on pan icon to move canvas objects
      handSelected = (handSelected) ? false : true;
      movec = false;
      if (handSelected) {
        jQuery('#toolbar .toolbar-button .action-button.g-active').removeClass('g-active');
        jQuery('#handtool').addClass('g-active');
        jQuery( ".canvas-container" ).attr('class', 'canvas-container');
        jQuery( ".canvas-container" ).addClass( "k-cursor-hand-open" );
        canvas.on('mouse:down', canvasmoved);
        canvas.on('mouse:move', canvasmovem);
        canvas.on('mouse:up', canvasmovemu);
      }
      else {
        jQuery('.toolbar-button.toolbar-Select .action-button').addClass('g-active');
        jQuery( ".canvas-container" ).attr('class', 'canvas-container');
        jQuery( ".canvas-container" ).removeClass( "k-cursor-hand-open" );
        deactivateHandtool();
      }
    break;
		case 'selectPan':
      if(handSelected){
        deactivateHandtool();
      }
      jQuery('#toolbar .toolbar-button .action-button.g-active').removeClass('g-active');
      jQuery('#selecttool').addClass('g-active');
    break;
		case 'fitpage':
      //set active page position
      objHeight = activepageobj.height * activepageobj.scaleY; 
      objWidth = activepageobj.width * activepageobj.scaleX;
      var bw = jQuery('#canvas-container').width();
      var bh = jQuery('#canvas-container').height();
      var bw = bw - (bw*15/100);
      var bh = bh - (bh*15/100);
      if (objHeight >= objWidth) {
        zoomFL = (bh/objHeight).toFixed(2);
      }
      else {
        zoomFL = (bw/objWidth).toFixed(2);
      }
      kmdsDesignZoomIn(zoomFL);
      var cs = activepageobj.getCoords();
      x = cs[0].x-2;
      y = cs[0].y-2;

      var ldelta = new fabric.Point(-x, -y);
      canvas.relativePan(ldelta);
      var ldelta = new fabric.Point(0, -y);
      leftRuler.relativePan(ldelta);
      var ldelta = new fabric.Point(-x, 0);
      topRuler.relativePan(ldelta);
      zoomLF = zoomFL * 100;
      jQuery('#zoomb .caption').html(Math.round(zoomLF)+'%');
      jQuery(this).removeClass('g-active');
      addrulernew();
    break;
		case 'zoomIn':
			var zoomin = jQuery('#zoomb .caption').text();
			zoomin = zoomin.split('%')[0];
			var i = z.indexOf(parseInt(zoomin));
			if(i === -1){
				zoomin = kmClosest(z, zoomin, 'zoomin');
			} else {
				zoomin = z[i+1];
			}
			if(typeof zoomin == 'undefined') { return; }
			jQuery('#zoomb .caption').html(zoomin+'%');
			zoomin = zoomin/100;
			kmdsDesignZoomIn(zoomin);
    break;
		case 'zoomOut':
			var currentZoom = canvas.getZoom();
			var zoomout = jQuery('#zoomb .caption').text();
			zoomout = zoomout.split('%')[0];
			var i = z.indexOf(parseInt(zoomout));
			if(i === -1){
				zoomout = kmClosest(z, zoomout, 'zoomout');
			} else {
				zoomout = z[i-1];
			}
			if(typeof zoomout == 'undefined') { return; }
			jQuery('#zoomb .caption').html(zoomout+'%');
			zoomout = zoomout/100;
			kmdsDesignZoomOut(zoomout);
    break;
		case 'zoomb':
      jQuery('ul.g-menu.g-menu-bottom.fixed.zoomb').toggleClass('d-inline');
    break;
		case 'zoomInList':
      jQuery('ul.g-menu.g-menu-bottom.fixed.zoomb').toggleClass('d-inline');
			var zoomVal = jQuery('#zoomb .caption').text();
			zoomVal = zoomVal.split('%')[0];
			zoomL = jQuery(this).attr("data-value");
			jQuery('#zoomb .caption').html(zoomL+'%');
      zoomL = zoomL/100;
			if(zoomL > zoomVal){
				kmdsDesignZoomIn(zoomL);
			} else {
				kmdsDesignZoomOut(zoomL);
			}
			kmdsDesignZoomIn(zoomL);
			//addrulernew(ixx, iyy);
		break;
		default:
			// code block
		break;
	}
});
/**
 * Click event for previous page
 **/
jQuery(document).on('click', '#prevPage', function () {
  var displayedPage = parseInt(jQuery("#displayed-page").text());
  var totalPage = parseInt(jQuery("#total-page-count").attr('totalPage'));
  if(displayedPage > 1){
    displayedPage = displayedPage - 1;
    jQuery("#displayed-page").text(displayedPage);
    jQuery.each( pageArr, function( key, val ) {
      if(val.order === displayedPage){
        enabledTemplatePage(val.id);
      }
    });
    jQuery("#nextPage").removeClass('disable');
    if(displayedPage == 1){
      jQuery(this).addClass('disable');
    }
  }
});
/**
 * Click event for previous page
 **/
jQuery(document).on('click', '#nextPage', function () {
  var displayedPage = parseInt(jQuery("#displayed-page").text());
  var totalPage = parseInt(jQuery("#total-page-count").attr('totalPage'));
  console.log("totalPage ="+totalPage+" *** displayedPage ="+displayedPage);
  if(totalPage > displayedPage){
    displayedPage = displayedPage + 1;
    jQuery("#displayed-page").text(displayedPage);
    jQuery.each( pageArr, function( key, val ) {
      if(val.order === displayedPage){
        enabledTemplatePage(val.id);
      }
    });
    jQuery("#prevPage").removeClass('disable');
    if(displayedPage == totalPage){
      jQuery(this).addClass('disable');
    }
  }
});
/**
 * Callback function canvasResize()
 * to set height/width of canvas
 **/
function canvasResize() {
  var w = window.outerWidth;
  var h = window.outerHeight;
  //var topRuler = document.getElementById('kmds-top-ruler');
  //var leftRuler = document.getElementById('kmds-left-ruler');
  /*var active_page_object = canvas.getActivePageObj();
  if(active_page_object){
    var zoomLevel = canvas.getZoom();
    var page_height = (active_page_object.height * zoomLevel) + active_page_object.top;
    if(h < (page_height + 100)){
      h = h*zoomLevel;
    }
    if(page_height > 1366) {
      leftRuler.setHeight(h);
    }
    var page_width = (active_page_object.width * zoomLevel) + active_page_object.left;
    if(w < page_width){
      w = w*zoomLevel;
    }
    if(page_width > 1366) {
      topRuler.setWidth(w);
    }
  }*/
  canvas.setWidth(w);
  canvas.setHeight(h);
}
jQuery(document).ready(function() {
  topRuler = new fabric.Canvas('kmds-top-ruler');
  leftRuler = new fabric.Canvas('kmds-left-ruler');
  //render template details
  getTemplteFileName();
  //render saved template JSON data
  var objs = render_template_json_data(uid, user_name, user_email);
  //add ruler
  //addrulernew(-300, -300);
  jQuery(".canvas-container").mouseover(function() {
    //canvas off start
    canvas.off('mouse:down', onMouseDownCanvas);
    canvas.off('mouse:up', onMouseUpCanvas);
    //Smart Guide
    canvas.off('mouse:down', _drawObjectGuides);
    canvas.off('object:moving', _moveObjectGuides);
    //canvas.off('object:moved', _movedObjectGuides);
    //canvas off end
    canvas.on('mouse:down', onMouseDownCanvas);
    canvas.on('mouse:up', onMouseUpCanvas);
    canvas.on('mouse:move', onMouseMoveCanvas);
    canvas.on('object:modified', DetectTemplateChanges);
    //Smart Guide
    canvas.on('mouse:down', _drawObjectGuides);
    canvas.on('object:moving', _moveObjectGuides);
    //canvas.on('object:moved', _movedObjectGuides);
  });
  //applying image opacity with selected image object
  jQuery("#km-image-opacity-range").change(function(){
    var newval = jQuery(this).val();
    jQuery("#image-opacity-range").val(newval+"%");
    var obj = canvas.getActiveObject();
    if(obj){
      obj.set({
        opacity: (newval/100),
        dynamic_image_opacity_range: (newval/100),
      });
      canvas.renderAll();
      DetectTemplateChanges();
    }
  });
  jQuery('input#image-opacity-range').on('keypress', function(event){
    return (
      event.keyCode == 8 || 
      event.keyCode == 46 ||
      (event.keyCode >= 37 && event.keyCode <= 40) ||
      (event.charCode >= 48 && event.charCode <= 57)
    );
  }).keyup(function(){
    var newval = parseInt(jQuery('input#image-opacity-range').val());
    if(newval === 0){
      newval = 100;
      var obj = canvas.getActiveObject();
      if(obj){
        obj.set({
          opacity: (newval/100),
          dynamic_image_opacity_range: (newval/100),
        });
        canvas.renderAll();
        DetectTemplateChanges();
        jQuery('#km-image-opacity-range').val(newval);
        jQuery('input[type="range"]').rangeslider('update', true);
      }
      kmModalWindow('<p>Zero opacity is not supported via the Opacity slider.</p>');
      jQuery(".g-dialog-footer .btn-cancel").addClass("d-none");
      //FnNewFolderModal();
      //FnDefaultModal('<p>Zero opacity is not supported via the Opacity slider.<br><br>To completely hide a layer, please utilize the<br><br>visibility feature in the Layers palette.</p>');
    }
    else {
      var obj = canvas.getActiveObject();
      if(obj){
        obj.set({
          opacity: (newval/100),
          dynamic_image_opacity_range: (newval/100),
        });
        canvas.renderAll();
        DetectTemplateChanges();
        jQuery('#km-image-opacity-range').val(newval);
        jQuery('input[type="range"]').rangeslider('update', true);
      }
    }
  }).blur(function() {
    var newval = parseInt(jQuery('input#image-opacity-range').val());
    var obj = canvas.getActiveObject();
    if(obj){
      newval = (newval === 0) ? (obj.opacity * 100) : newval;
    }
    jQuery('input#image-opacity-range').val("").val(newval+"%");
  });
  //END image opacity with selected object
  //apply strokewidth to selected object
  jQuery('input#image-border-stroke-num').on('keypress', function(event){
    return (
      event.keyCode == 8 || 
      event.keyCode == 46 ||
      (event.keyCode >= 37 && event.keyCode <= 40) ||
      (event.charCode >= 48 && event.charCode <= 57)
    );
  }).keyup(function(){
    var stroke_num = parseInt(jQuery('input#image-border-stroke-num').val());
    var obj = canvas.getActiveObject();
    obj.set({
      strokeWidth: stroke_num,
    });
    canvas.renderAll();
    DetectTemplateChanges();
  });
  jQuery('input#shape-border-stroke-num').on('keypress', function(event){
    return (
      event.keyCode == 8 || 
      event.keyCode == 46 ||
      (event.keyCode >= 37 && event.keyCode <= 40) ||
      (event.charCode >= 48 && event.charCode <= 57)
    );
  }).keyup(function(){
    var stroke_num = parseInt(jQuery('input#shape-border-stroke-num').val());
    var obj = canvas.getActiveObject();
    obj.set({
      strokeWidth: stroke_num,
    });
    canvas.renderAll();
    DetectTemplateChanges();
  });
  jQuery('input#lineshape-border-stroke-num').on('keypress', function(event){
    return (
      event.keyCode == 8 || 
      event.keyCode == 46 ||
      (event.keyCode >= 37 && event.keyCode <= 40) ||
      (event.charCode >= 48 && event.charCode <= 57)
    );
  }).keyup(function(){
    var stroke_num = parseInt(jQuery('input#lineshape-border-stroke-num').val());
    var obj = canvas.getActiveObject();
    obj.set({
      strokeWidth: stroke_num,
    });
    canvas.renderAll();
    DetectTemplateChanges();
  });
  //applying image corner with selected object
  jQuery("#km-image-corner-range").change(function(){
    var obj = canvas.getActiveObject();
    if(obj && obj.type == "image"){
      var newval = jQuery(this).val();
      //obj.clipTo = roundedImageCorners.bind(obj);
      var rxw = (((obj.width/2)*newval)/100);
      var ryh = (((obj.height/2)*newval)/100);
      obj.clipTo = function(obj) {
        var rect = new fabric.Rect({
          left:0,
          top:0,
          rx:rxw,
          ry:ryh,
          width:this.width,
          height:this.height,
          fill:'#000000'
        });
        rect._render(obj, false);
      };
      obj.dynamicImageCorner = newval;
      obj.dynamicImageCornerrxw = rxw;
      obj.dynamicImageCornerryh = ryh;
      canvas.renderAll();
      jQuery("#corner-input").val(newval);
      DetectTemplateChanges();
    }
  });
  jQuery('input#corner-input').on('keypress', function(event){
    return (
      event.keyCode == 8 || 
      event.keyCode == 46 ||
      (event.keyCode >= 37 && event.keyCode <= 40) ||
      (event.charCode >= 48 && event.charCode <= 57)
    );
  }).keyup(function(){
    var newval = parseInt(jQuery('input#corner-input').val());
    var obj = canvas.getActiveObject();
    if(obj && obj.type == "image"){
      jQuery('#km-image-corner-range').val(newval);
      jQuery('input[type="range"]').rangeslider('update', true);
      //obj.clipTo = roundedImageCorners.bind(obj);
      var rxw = (((obj.width/2)*newval)/100);
      var ryh = (((obj.height/2)*newval)/100);
      obj.clipTo = function(obj) {
        var rect = new fabric.Rect({
          left:0,
          top:0,
          rx:rxw,
          ry:ryh,
          width:this.width,
          height:this.height,
          fill:'#000000'
        });
        rect._render(obj, false);
      };
      obj.dynamicImageCorner = newval;
      obj.dynamicImageCornerrxw = rxw;
      obj.dynamicImageCornerryh = ryh;
      canvas.renderAll();
      DetectTemplateChanges();
    }
  });
  //END rectangle corner with selected object
  //applying image crop with selected image object
  jQuery("#km-image-crop-range").change(function(){
    var newval = jQuery(this).val();
    var obj = canvas.getActiveObject();
    if(obj){
      var OldscaleX = obj.OldscaleX;
      var image_width = (obj.oldWidth) ? obj.oldWidth : (obj.width * OldscaleX);
      var OldscaleY = obj.OldscaleY;
      var image_height = (obj.oldHeight) ? obj.oldHeight : (obj.height * OldscaleY);
      var newscaleY = (parseFloat(OldscaleY)+parseFloat(newval)).toFixed(2);
      var newscaleX = (parseFloat(OldscaleX)+parseFloat(newval)).toFixed(2);
      var newvalNumX = newscaleX * 100;
      var newvalNumY = newscaleY * 100;
      obj.set({
        width: 100/newvalNumX*image_width,
        height: 100/newvalNumY*image_height,
        scaleX: newscaleX,
        scaleY: newscaleY,
        oldWidth: image_width,
        oldHeight: image_height
      });
      console.log(JSON.stringify(obj));
      canvas.renderAll();
      DetectTemplateChanges();
    }
  });
  //End applying image crop with selected image object
  jQuery(".km-smart-guides").click(function(e){
    if(jQuery.inArray('content_creator', user_roles ) !== -1 && jQuery.inArray('advanced_content_creator', user_roles ) == -1){
      jQuery(".km-smart-guides").prop( "checked", false);
      professional_user_modal();
    }
    else if(jQuery(this).is(':checked')){
      var obj = canvas.getActiveObject();
      if(obj && jQuery.inArray('content_creator', user_roles ) == -1){ //Professional role condition
        smartGuideStatus = 1;
        _snapObjectGuide();
        _drawObjectGuides();
      }
      else {
        smartGuideStatus = 0;
        _removeGuide();
      }
    }
    else {
      smartGuideStatus = 0;
      _removeGuide();
    }
  });
});
/**
 * Callback function addrulernew()
 * to add the ruler at product edit page
 **/
function addrulernew(ix = 0, iy = 0){
  console.log("AddRulerNew*")
  var xwidth = 0;
  var yheight = 0;
  var zoomLevel = canvas.getZoom();
  if (newpage == 0) {
    var page_format = jQuery("#page_format").val();
    if(page_format == 'pdf'){
      var pageID = jQuery("#displayed-page").attr("pageid");
      var active_page_object = canvas.getItemById(pageID+'MediaBox');
      if(!active_page_object){
        var active_page_object = canvas.getActivePageObj();
      }
    }
    else {
      var active_page_object = canvas.getActivePageObj();
    }
    //var active_page_object = canvas.getActivePageObj();
    //var pageCoords = active_page_object.getCoords();
    if(page_format == 'pdf'){
      xwidth = active_page_object.left - ((active_page_object.width-(56*zoomLevel))/2);
      yheight = active_page_object.top - ((active_page_object.height-(56*zoomLevel))/2);
    }
    else {
      xwidth = active_page_object.left - (active_page_object.width/2);
      yheight = active_page_object.top - (active_page_object.height/2);
    }
    active_page_width = active_page_object.width;
    active_page_height = active_page_object.height;
  }
  active_page_width = active_page_width * zoomLevel;
  active_page_height = active_page_height * zoomLevel;
  //console.log("active_page_width = "+active_page_width);
  //console.log("active_page_height = "+active_page_height);
  canvasResize();
  //topRuler = new fabric.Canvas('kmds-top-ruler');
  //leftRuler = new fabric.Canvas('kmds-left-ruler');
  var type = 'px'; //disable for MVP jQuery('#measurements').val();
  var rulerIncrement = 10;
  var maxWidth = 1300;
  var maxHeight = 1700;
  var RuleLine = 50;
  if(type == 'in'){
    var rulerIncrement = 8/zoomLevel;
    var maxWidth = 1440;
    var maxHeight = 720;
  }
  var xz = zoomLevel;
  var div = 1;
  switch(true) {
    case (zoomLevel < 1):
      div = 1;
      xz = 1;
      RuleLine = 50/zoomLevel;
      if(type == 'in'){
        RuleLine = 72/zoomLevel;
      }
    break;
    case (zoomLevel == 1):
      div = 2;
      RuleLine = 50/zoomLevel;
      if(type == 'in'){
        RuleLine = 72/zoomLevel;
      }
    break;
    case (zoomLevel <= 1.5):
      div = 2;
      RuleLine = 30;
      xz = 1;
      if(type == 'in'){
        RuleLine = 52;
      }
    break;
    case (zoomLevel <= 2):
      div = 4;
      RuleLine = 30;
      if(type == 'in'){
        RuleLine = 52;
      }
    break;
    case (zoomLevel <= 2.5):
      div = 4;
      RuleLine = 20;
      xz = 3;
      if(type == 'in'){
        RuleLine = 42;
      }
    break;
    case (zoomLevel <= 3):
      div = 5;
      RuleLine = 20;
      if(type == 'in'){
        RuleLine = 42;
      }
    break;
    case (zoomLevel <= 4):
      div = 5;
      RuleLine = 10;
      if(type == 'in'){
        RuleLine = 32;
      }
    break;
    case (zoomLevel <= 8):
      div = 10;
      RuleLine = 5;
      if(type == 'in'){
        RuleLine = 22;
      }
    break;
    case (zoomLevel <= 16):
      div = 20;
      RuleLine = 2.5;
      if(type == 'in'){
        RuleLine = 12;
      }
    break;
    default:
       div = 4;
       RuleLine = 50;
       xz = 1;
    break;
  }
  //pageZoomHeight = (zoomLevel < 1) ? (1/(zoomLevel*2)) : zoomLevel;
  var pageZoomHeight = (zoomLevel < 1) ? 1.5 : zoomLevel;
  zoomm = zoomLevel;
  ix = ((ix > 0 ) ? Math.ceil(ix/100) * 100 :  Math.ceil(ix/100)  * 100 ) - (maxWidth * zoomm); 
  iy = ((iy > 0 ) ? Math.ceil(iy/100) * 100 :  Math.ceil(iy/100)  * 100 ) - (maxHeight  * zoomm);
  topRuler.clear();
  leftRuler.clear();
  topRuler.setBackgroundColor('#fff');
  leftRuler.setBackgroundColor('#fff');
  // var ix = -100;
  // var iy = -100;
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  xc = canvasWidth + ix + (maxWidth * pageZoomHeight);
  //xc = canvasWidth + ix + (maxWidth * zoomLevel);
  //console.log('XC = '+xc);
  ix = Math.round(ix);
  iy = Math.round(iy);
  //console.log('ixiiii======='+ix);
  var rzo = Math.round(100*zoomLevel);
  //Math.round((RuleLine * zoomm));
  var rz = (rzo/10);
  // ix = ix + (ix % (rz));
  // console.log('ix====++========'+ix);
  //ix = Math.round(ix);
  //  ix = -1550;
  //active_page_width = (active_page_width + (rz/xz * zoomLevel)) - rz/xz;
  active_page_width = (zoomLevel >= 1) ? (active_page_width + 8) : (active_page_width + (8*zoomLevel));
  var start_page_width = (zoomLevel >= 1) ? -8 : -(8*zoomLevel);
  var page_format = jQuery("#page_format").val();
  if(page_format == 'pdf'){
    var start_page_width = (zoomLevel >= 1) ? -40 : -(40*zoomLevel);
  }
  //console.log("active_page_width 2 = "+active_page_width);
  for (ix; ix < 6000 ; ix += rz/xz) {
    if(ix >= start_page_width && ix <= active_page_width) {
      ds = ix.toFixed(1);
     //console.log('ix============'+ix);
      var x = (ds%rzo == 0) ? 10 : 15;
      var topLine = new fabric.Line([ix+xwidth, x, ix+xwidth, 20], {
        stroke: 'black',
        strokeWidth: 1,
        selectable: false
      });
      topRuler.add(topLine);
      var xy = (ds%(rzo/div) == 0) ? 10 : 15;
      // console.log('ix============'+ds+'---x============'+x+'---rz============'+rz+'---rzo====='+rzo);
      //  console.log('--------'+xwidth+'--------');
      var topLine = new fabric.Line([ix+xwidth, xy, ix+xwidth, 15], {
        stroke: 'black',
        strokeWidth: 1,
        selectable: false
      });
      topRuler.add(topLine);
      if(ds%rzo == 0){
        //  console.log('dssssss============'+ds);
        if(type == 'in'){
          text_num = (ds / (RuleLine * zoomLevel)).toFixed(2);
          text_num = parseFloat(text_num);
        }
        else {
          text_num = Math.round(ds/zoomLevel);
        }
        // console.log('text_num============'+text_num);
        var text = new fabric.Text(text_num.toString(),       {
          left: ix+xwidth,
          top: 0,
          fontSize: 10,
          selectable: false
        });
        topRuler.add(text);
      }
      if(ds%(rzo/div) == 0){
        if(type == 'in'){
          text_num = (ds / (RuleLine * zoomLevel)).toFixed(2);
          text_num = parseFloat(text_num);
        }
        else {
          text_num = Math.round(ds/zoomLevel);
        }
        var text = new fabric.Text(text_num.toString(),       {
          left: ix+xwidth,
          top: 0,
          fontSize: 10,
          selectable: false
        });
        topRuler.add(text);
      }
    }
  }
  //100 added to increased thea left ruler to 500
  //yc = canvasHeight + iy + (1300 * zoomm) + 100;
  var obj = canvas.getActivePageObj();
  var pageHeight = (obj.length !== 0) ? canvasHeight : 0;
  //yc = (pageHeight > 505) ? parseInt((pageHeight + 10)*zoomLevel) : (505*zoomLevel);
  yc = (pageHeight > 505) ? parseInt((pageHeight + 10)*pageZoomHeight) : (505*pageZoomHeight);
  //active_page_height = (active_page_height + (rz/xz * zoomLevel)) - rz/xz;
  active_page_height = (zoomLevel >= 1) ? (active_page_height + 8) : (active_page_height + (8*zoomLevel));
  var start_page_height = (zoomLevel >= 1) ? -8 : -(8*zoomLevel);
  var page_format = jQuery("#page_format").val();
  if(page_format == 'pdf'){
    var start_page_height = (zoomLevel >= 1) ? -40 : -(40*zoomLevel);
  }
  //console.log("active_page_height 2 = "+active_page_height);
  for (iy; iy < 6000; iy += rz/xz) {
    if(iy >= start_page_height && iy <= active_page_height) {
      ds = iy.toFixed(1);
      var y = (ds%rzo == 0)?10:5;
      var leftLine = new fabric.Line([xy, iy+yheight, 0, iy+yheight], {
        stroke: 'black',
        strokeWidth: 1,
        selectable: false
      });
      var xy = (ds%(rzo/div) == 0) ? 10 : 15;
      var leftLine = new fabric.Line([y, iy+yheight, 0, iy+yheight], {
        stroke: 'black',
        strokeWidth: 1,
        selectable: false
      });
      leftRuler.add(leftLine);
      if((ds%rzo) == 0){
        //var text_num = (type == 'in') ? (iy / (RuleLine * zoomm)) : iy;
        //var text_num = (type == 'in') ? Math.round(iy / (RuleLine * zoomLevel)) : Math.round(iy / zoomLevel);
        if(type == 'in'){
          text_num = (ds / (RuleLine * zoomLevel)).toFixed(2);
          text_num = parseFloat(text_num);
        }
        else {
          text_num = Math.round(iy / zoomLevel)
        }
        var text2 = new fabric.Text(text_num.toString(), {
          left: 20,
          top: iy+yheight,
          fontSize: 10,
          angle: 90,
          selectable: false
        });
        leftRuler.add(text2);
      }
      if((ds%(rzo/div)) == 0){
        //var text_num = (type == 'in') ? (iy / (RuleLine * zoomm)) : iy;
        //var text_num = (type == 'in') ? Math.round(iy / (RuleLine * zoomLevel)) : Math.round(iy / zoomLevel);
        if(type == 'in'){
          text_num = (ds / (RuleLine * zoomLevel)).toFixed(2);
          text_num = parseFloat(text_num);
        }
        else {
          text_num = Math.round(iy / zoomLevel)
        }
        var text2 = new fabric.Text(text_num.toString(), {
          left: 20,
          top: iy+yheight,
          fontSize: 10,
          angle: 90,
          selectable: false
        });
        leftRuler.add(text2);
      }
    }
  }
}
/**
 * Callback function render_template_json_data()
 * to render saved template data in canvas
 * @at product edit page
 **/
function render_template_json_data(user_id, username = '', email = '') {
  var settings = {
    "url": access_check_api + "user_access_check",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    "data": {user_id: user_id, username: username, email: email}
  };
  jQuery.ajax(settings).done(function (response) {
    API_KEY = response;
  }).then(
    function fulfillHandler(data) {
      var $hiddenInput = jQuery("<input/>",{type:"hidden",id: "api_key",value:data});
      $hiddenInput.appendTo('body');
      if (template_id != '') {
        var kmdsTemp = getUrlQuery("kmds");
        var accessURL = (kmdsTemp) ? 'designjson' : 'productjson';
        var settings = {
          "url": access_check_api + accessURL + "/" + template_id,
          "method": "GET",
          "timeout": 0,
          "headers": {
            "Authorization": "bearer " + API_KEY,
          },
        };
        jQuery.ajax(settings).done(function (response) {
        //  ....
        }).then(
          function fulfillHandler(datajson) {
            //console.log(datajson);
            if(kmdsTemp){
              var datajsonparse =  JSON.parse(datajson.design);
            }
            else {
              var datajsonparse =  JSON.parse(datajson.product);
            }
            var total_object_counts = datajsonparse.objects.length;
            //console.log("total_object_counts = "+total_object_counts);
            var object_count = 0;
            //var pageArr = [];
            datajsonparse.background = "#eaeaea";
            //console.log("datajsonparse = "+JSON.stringify(datajsonparse));
            canvas.loadFromJSON(datajsonparse, canvas.renderAll.bind(canvas), function(o, object){
              if(!object){ return; }
              if(object.type == 'text' || object.type == 'textbox'){
                //load kmds fonts
                if(object.fontFamily){
                  var fontFamily = object.fontFamily;
                  kmdsFontsLoad(object.fontFamily);
                }
              }
              //hide labels
              if(object.name && object.name == 'pagelabel' && multipageToggle == false){
                object.set('visibility', false);
                object.set('opacity', 0);
              }
              //guides
              if((object.type == 'text' && object.name == 'measurement') || object.type === 'line' || object.type === 'guideline'){
                object.set('borderColor', 'transparent');
                object.setControlsVisibility({
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
                object.set({
                  opacity: 0,
                  lockMovementX: true,
                  lockMovementY: true,
                  lockScalingX: true,
                  lockScalingY: true,
                  lockRotation: true,
                  hasControls: false,
                  selectable: false,
                  hasBorders: false,
                  borderColor: 'transparent',
                  editable: false,
                });
              }
              /*if(object.type == 'line' || object.type == 'guideline'){
                object.set({
                  opacity: 0,
                  lockMovementX: true,
                  lockMovementY: true,
                  lockScalingX: true,
                  lockScalingY: true,
                  lockRotation: true,
                  hasControls: false,
                  selectable: false,
                  hasBorders: false,
                  borderColor: 'transparent',
                  editable: false,
                });
                //object.set('opacity', 0);
                //object.set('hasBorders', false);
                //object.set('borderColor', 'transparent');
                object.setControlsVisibility({
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
              }*/
              if(object.type == 'page'){
                //pageArr.push(object);
                if(object.order == 1){
                  object.set('visibility', true);
                  object.set('opacity', 1);
                  object.set('selectable', false);
                  object.set('evented', false);
                  pageWidth = object.width;
                  pageHeight = object.height;
                  jQuery('#pageWidth').val(pageWidth);
                  jQuery('#pageHeight').val(pageHeight);
                  if(object.backgroundColor == ''){
                    var pagecolor = '#ffffff';
                  }
                  else {
                    var pagecolor = object.backgroundColor;
                  }
                  jQuery('#page-background').val(pagecolor);
                  jQuery('#page-background').css('background-color', pagecolor);
                  active_page_width = object.width;
                  active_page_height = object.height;
                  jQuery("#displayed-page").attr('pageID', object.id);
                  //console.log("object-id = "+object.id);
                }
                else {
                  console.log("Order = "+object.order);
                  object.set('visibility', false);
                  object.set('opacity', 0);
                }
                pageArr.push(object);
                //console.log(JSON.stringify(pageArr));
                //addrulernew(0, 0);
                var cw = parseInt(object.width);
                var ch = parseInt(object.height);
                //jQuery('#canvas-width').val(cw);
                //jQuery('#canvas-height').val(ch);
                //var cunit = (object.pageMeasurement) ? object.pageMeasurement : 'px';
                //jQuery('#measurements').val(cunit);
                //setPageSizeOption(cw, ch);
                //getPageSizePreset(productId);
                //Set ruler
                leftmargin = parseInt(object.left-(cw/2));
                topmargin = parseInt(object.top-(ch/2));
                //leftRuler.relativePan({x: 0, y: parseInt(object.top-(ch/2))});
                //topRuler.relativePan({x: parseInt(object.left-(cw/2)), y: 0});
              }
              else {
                if(object.type !== 'text' && object.type !== 'line' && object.type !== 'guideline'){
                  if(object.type == 'Lineshape' || object.type == 'ConnectorHandleStart' || object.type == 'ConnectorHandleEnd'){
                    object.set('visibility', true);
                    object.setControlsVisibility({
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
                  }
                  else {
                    object.set('visibility', true);
                    object.set('selectable', true);
                    object.set('hasControls', true);
                    object.set('hasBorders', true);
                    object.set('opacity', 1);
                  }
                }
              }
              if(object.dynamic_opacity_range){
                object.set('opacity', object.dynamic_opacity_range);
              }
              if(object.dynamic_image_opacity_range){
                object.set('opacity', object.dynamic_image_opacity_range);
              }
              if(object.type == 'image'){
                if(object.dynamicImageCorner){
                  object.clipTo = null;
                }
              }
              if(object.dynamic_corner){
                object.set({
                  rx: object.dynamic_corner,
                  ry: object.dynamic_corner,
                });
              }
              if(object.type !== 'page' && object.type !== 'text' && object.type !== 'line' && object.type !== 'guideline'){
                canvas.moveTo(object, parseInt(object.layerIndexing));
              }
              if(object.hide_container && object.hide_container == 1){
                object.lockMovementX = true;
                object.lockMovementY = true;
                object.lockScalingX = true;
                object.lockScalingY = true;
                object.lockRotation = true;
                object.selectable = false;
                object.hasControls = false;
                object.hasBorders = false;
              }
              if(object.hide_data && object.hide_data == 1){
                object.lockMovementX = true;
                object.lockMovementY = true;
                object.lockScalingX = true;
                object.lockScalingY = true;
                object.lockRotation = true;
                object.selectable = false;
                object.hasControls = false;
                object.hasBorders = false;
                object.setControlsVisibility({
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
                object.set({
                  opacity: 0,
                  active: true,
                });
              }
              canvas.renderAll();
              object_count++;
              if(parseInt(total_object_counts) == parseInt(object_count)){
                setTimeout(function() {
                  jQuery('#total-page-count').text('of '+pageArr.length);
                  jQuery('#total-page-count').attr('totalPage', pageArr.length);
                  jQuery.each( pageArr, function( key, val ) {
                    if(jQuery('#'+val.id).length === 0){
                      var paggecolor = (val.backgroundColor) == '' ? '#ffffff' : val.backgroundColor;
                      //add_page(val.id, val.width, val.height, paggecolor);
                      jQuery('#page-background').val(paggecolor);
                      jQuery('#page-background').css('background-color', paggecolor);
                    }
                  });
                  console.log("All Objects rendered.");
                  jQuery('body').removeClass('loading');
                  jQuery('#mainframe').css('display', 'flex');
                  var pageID = jQuery("#displayed-page").attr("pageid");
                  enablePageMediaBox(pageID);
                  //refreshLayersOnTemplateLoad();
                  applyDynamicImageCorner();
                  //lock all objects
                  lockCanvasObjects();
                  //render page in center
                  addrulernew(-300, -300);
                  fitCanvasCenter();
                },1000);
              }
            });
            canvas.backgroundColor = "#eaeaea";
            canvas.renderAll();
          },
          function rejectHandler(jqXHR, textStatus, errorThrown) {
          // ...
          }
        ).catch(function errorHandler(error) {
        // ...
        });
        //alert('get json');
      }
      //render template details
      //getTemplteFileName();
    },
    function rejectHandler(jqXHR, textStatus, errorThrown) {
    // ...
    }
  ).catch(function errorHandler(error) {
    // ...
  });
}
/**
 * Callback function getTemplteFileName()
 * to displayed template file name in name field
 **/
function getTemplteFileName(){
  console.log('getTemplteFileName');
	if(template_id){
    console.log('template_id'+template_id);
		var design_id = template_id;	
		jQuery('#userTemplateName').attr('data-id', design_id);
		jQuery('#saveUserTemplate').attr('data-id', design_id);
    var kmdsTemp = getUrlQuery("kmds");
    var accessURL = (kmdsTemp) ? 'design' : 'product';
		var settings = {
			"url": access_check_api + accessURL + "/" + design_id,
			"method": "GET",
			"timeout": 0,
			"headers": {
        "Authorization": "bearer " + API_KEY,
      },
    };
    jQuery.ajax(settings).done(function (response) {
      const promise1 = new Promise(function(resolve, reject) {
        resolve(response);
      }).then(function(data) {
        if(!data._id){
          var nid = jQuery("#user_node_nid").val();
          window.location.href = '/tools/kaboodle/dashboard/'+nid;
        }
        var node_uid = 0;
        if(accessURL == 'product'){
          node_uid = jQuery("#user_node_uid").val();
        }
        console.log('full_data'+JSON.stringify(data));
        document.title = data.name+' | KaboodleMedia';
        var tempOwner = data.user_id;
        if(parseInt(tempOwner) == parseInt(uid) || parseInt(uid) === 1 || parseInt(uid) == parseInt(node_uid)){
          if(parseInt(tempOwner) !== parseInt(node_uid)){
            tempOwner = parseInt(node_uid);
          }
          var cloneTemp = getUrlQuery('clone');
          var templateName = (cloneTemp) ? 'Clone of '+data.name : data.name;
          var templateID = (cloneTemp) ? '' : template_id;
          jQuery('#userTemplateName').val(templateName);
          jQuery('#template_owner').val(tempOwner);
          jQuery('#user_template_id').val(templateID);
          if(cloneTemp){
            jQuery('#parent_template_id').val(template_id);
          }
          else {
            jQuery('#parent_template_id').val(data.parent);
          }
        }
        else {
          jQuery('#parent_template_id').val(template_id);
        }
        var km_render = 0;
        if(data.km_render){
          var media_url = media_base_url+'/media/'+data.km_render+'/edit?_format=json';
          jQuery.ajax({
            type: "GET",
            url: media_url,
            dataType: "json",
            success: function(results){
              km_render = data.km_render;
              console.log("km_render Found");
              if(jQuery("#km_render").length){
                jQuery("#km_render").val(km_render);
              }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
              console.log("km_render Not Found");
              var page_settings = {'km_render' : 0};
              update_product_template(design_id, page_settings);
            }
          });
        }
        //jQuery('#parent_template_id').val(template_id);
        var producTypeId = data.type_tid;
        var productId = data.group_tid;
        var productName = data.group_name;
        var folderName = data.folder_name;
        var template_tid = data.template_tid;
        var group = data.template_group;
        var producTypeName = data.type_name;
        var cunit = data.measurement;
        var templateAddedTags = data.template_tags;
        var templateAddedDescriptions = data.template_descriptions;
        var static_image_url = data.static_image_url;
        var ruler_status = data.ruler_status;
        var no_of_photos = data.no_of_photos;
        var page_size = data.page_size;
        var color_space = data.color_space;
        var page_format = data.page_format;
        var page_bleed = data.page_bleed;
        var trim_marks = data.trim_marks;
        //var km_render = (data.km_render) ? data.km_render : 0;
        var km_cmyk = (data.km_cmyk) ? data.km_cmyk : 0;
        var km_bleed = (data.km_bleed) ? data.km_bleed : 0;
        var fabricDPI = data.fabricDPI;
        fabric.DPI = (fabricDPI) ? fabricDPI : 72;
        var preset_name = data.preset_name;
        var preset_tid = data.preset_tid;
        jQuery("#canvas-container").append('<input type="hidden" id="producTypeId" value="'+producTypeId+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="productId" value="'+productId+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="productName" value="'+productName+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="folderName" value="'+folderName+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="template_tid" value="'+template_tid+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="group" value="'+group+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="producTypeName" value="'+producTypeName+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="cunit" value="'+cunit+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="templateAddedTags" value="'+templateAddedTags+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="templateAddedDescriptions" value="'+templateAddedDescriptions+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="static_image_url" value="'+static_image_url+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="ruler_status" value="'+ruler_status+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="no_of_photos" value="'+no_of_photos+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="page_size" value="'+page_size+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="color_space" value="'+color_space+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="page_format" value="'+page_format+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="page_bleed" value="'+page_bleed+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="trim_marks" value="'+trim_marks+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="km_render" value="'+km_render+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="km_cmyk" value="'+km_cmyk+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="km_bleed" value="'+km_bleed+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="fabricDPI" value="'+fabricDPI+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="preset_name" value="'+preset_name+'" />');
        jQuery("#canvas-container").append('<input type="hidden" id="preset_tid" value="'+preset_tid+'" />');
        //jQuery('#saveUserTemplate').attr('producTypeId', producTypeId).attr('productId', productId).attr('productName', productName);
      });
    });
	}	
}
/**
 * Callback function canvasmoved()
 * for canvas move on moude down
 **/
function canvasmoved(opt) {
  var evt = opt.e;
	if(handSelected == true){
		movec = true;
	}
  this.lastPosX = evt.clientX;
  this.lastPosY = evt.clientY;
	if(handSelected == true){
		movec = true;
	}
}
/**
 * Callback function canvasmovem()
 * for canvas move on moude down
 **/
function canvasmovem(opt) {
  if(movec){
    var e = opt.e;
    var unitx = e.clientX - this.lastPosX;
    var unity = e.clientY - this.lastPosY;
    var delta = new fabric.Point(unitx,unity);
    canvas.relativePan(delta);
    var tdelta = new fabric.Point(unitx, 0);
    topRuler.relativePan(tdelta);
    var ldelta = new fabric.Point(0, unity);
    leftRuler.relativePan(ldelta);
    ixx += -unitx;
    iyy += -unity;
    //topmargin = (topmargin+(unitx));
    //leftmargin = (leftmargin+(unity));
    //addrulernew(ixx,iyy);
    this.lastPosX = e.clientX;
    this.lastPosY = e.clientY;
  }
}
/**
 * Callback function canvasmovemu()
 * for canvas move on moude down
 **/
function canvasmovemu(opt) {
  if(movec){
    var e = opt.e;
    this.isDragging = false;
    this.selection = true;
    movec = false;
    addrulernew();
    console.log('14');
    console.log(e);
  }
}
/**
 * Callback function deactivateHandtool()
 * for deactive canvas move on moude down
 **/
function deactivateHandtool() {
  handSelected = false;
	jQuery('#handtool').removeClass('g-active');
	jQuery( ".canvas-container" ).attr('class', 'canvas-container');
	jQuery( ".canvas-container" ).addClass( "g-cursor-select" );
	canvas.off('mouse:down', canvasmoved);
	canvas.off('mouse:move', canvasmovem);
	canvas.off('mouse:up', canvasmovemu);
}
/**
 * Callback function kmdsDesignZoomIn()
 * to set the canvas zoomIn
 **/
function kmdsDesignZoomIn(zoomin){
  var rulerdata = getZoomIncrement(zoomin, 'px');
  var tick = rulerdata.tick;
  var increment = rulerdata.increment;
  var ratio = 50/increment;
  
  console.log('NIncrement: '+increment);
  console.log('NZoomin: '+zoomin);
  console.log('NRatio: '+ratio);

  var page_format = jQuery("#page_format").val();
  if(page_format == 'pdf'){
    var pageID = jQuery("#displayed-page").attr("pageid");
    var active_page_object = canvas.getItemById(pageID+'MediaBox');
    if(!active_page_object){
      var active_page_object = canvas.getActivePageObj();
    }
  }
  else {
    var active_page_object = canvas.getActivePageObj();
  }
  //get current left/top of page.
  var oldCoordinates = active_page_object.getBoundingRect();
  canvas.zoomToPoint(new fabric.Point(active_page_object.left, active_page_object.top), zoomin);
  //canvas.zoomToPoint(new fabric.Point(active_page_object.left, active_page_object.top), ratio);
  //get current left/top of page.
  var newCoordinates = active_page_object.getBoundingRect();
  var topRulerYDif = (oldCoordinates.left - newCoordinates.left);
  var leftRulerYDif = (oldCoordinates.top - newCoordinates.top);
  var unitx = topRulerYDif;
  var delta = new fabric.Point(-unitx,0);
  topRuler.relativePan(delta);
  var unity = leftRulerYDif;
  var delta = new fabric.Point(0,-unity);
  leftRuler.relativePan(delta);
  //render at 0/0 position
  var cs = active_page_object.getCoords();
  x = cs[0].x-2;
  y = cs[0].y-2;

  var ldelta = new fabric.Point(-x, -y);
  canvas.relativePan(ldelta);
  var ldelta = new fabric.Point(0, -y);
  leftRuler.relativePan(ldelta);
  var ldelta = new fabric.Point(-x, 0);
  topRuler.relativePan(ldelta);
  canvas.renderAll();
  addrulernew(ixx, iyy);
  //DetectTemplateChanges();
}
/**
 * Callback function kmdsDesignZoomOut()
 * to set the canvas zoomOut
 **/
function kmdsDesignZoomOut(zoomout){
  var rulerdata = getZoomIncrement(zoomout, 'px');
  var tick = rulerdata.tick;
  var increment = rulerdata.increment;
  var ratio = 50/increment;
  
  console.log('NIncrement: '+increment);
  console.log('NZoomout: '+zoomout);
  console.log('NRatio: '+ratio);
  
  var page_format = jQuery("#page_format").val();
  if(page_format == 'pdf'){
    var pageID = jQuery("#displayed-page").attr("pageid");
    var active_page_object = canvas.getItemById(pageID+'MediaBox');
    if(!active_page_object){
      var active_page_object = canvas.getActivePageObj();
    }
  }
  else {
    var active_page_object = canvas.getActivePageObj();
  }
  //var active_page_object = canvas.getActivePageObj();
  //get current left/top of page.
  var oldCoordinates = active_page_object.getBoundingRect();
  canvas.zoomToPoint(new fabric.Point(active_page_object.left, active_page_object.top), zoomout);
  //canvas.zoomToPoint(new fabric.Point(active_page_object.left, active_page_object.top), ratio);
  //get current left/top of page.
  var newCoordinates = active_page_object.getBoundingRect();
  var topRulerYDif = (newCoordinates.left - oldCoordinates.left);
  var leftRulerYDif = (newCoordinates.top - oldCoordinates.top);
  var unitx = topRulerYDif;
  var delta = new fabric.Point(unitx,0);
  topRuler.relativePan(delta);
  var unity = leftRulerYDif;
  var delta = new fabric.Point(0,unity);
  leftRuler.relativePan(delta);
  //render at 0/0 position
  var cs = active_page_object.getCoords();
  x = cs[0].x-2;
  y = cs[0].y-2;

  var ldelta = new fabric.Point(-x, -y);
  canvas.relativePan(ldelta);
  var ldelta = new fabric.Point(0, -y);
  leftRuler.relativePan(ldelta);
  var ldelta = new fabric.Point(-x, 0);
  topRuler.relativePan(ldelta);
  canvas.renderAll();
  addrulernew(ixx, iyy);
  //DetectTemplateChanges();
}
/**
 * Callback function onMouseDownCanvas()
 * Canvas mouse down event for object
 */
function onMouseDownCanvas(e) {
	console.log(user_roles);
  jQuery("#left-sidebar .media-kit-images ").addClass("disabled");
  jQuery("#toolbar .textbox-tool").addClass("d-none");
  jQuery("#toolbar .image-tool").addClass("d-none");
  jQuery("#toolbar .shape-tool").addClass("d-none");
  jQuery("#toolbar .lineshape-tool").addClass("d-none");
  var activeObject = e.target;
  if(activeObject && activeObject.type == 'activeSelection'){
    canvas.discardActiveObject();
    canvas.renderAll();
  }
  if(activeObject && activeObject.type == 'PageMediaBox'){
    canvas.sendToBack(activeObject);
  }
	var obj = canvas.getActiveObject();
  if(obj){
    if(obj.lock_position == 1){
      lockCanvasObjects();
      jQuery(".km-smart-guides").prop( "checked", false);
      smartGuideStatus = 0;
    }
    /*obj.lockMovementX = true;
    obj.lockMovementY = true;
    obj.lockScalingX = true;
    obj.lockScalingY = true;
    obj.lockRotation = true;
    obj.hasControls = false;
    obj.selectable = true;
    obj.hasBorders = true;
    obj.borderColor = '#eb2cf6';
    obj.editable = true;
    canvas.renderAll();
    canvas.setActiveObject(obj);*/
    if(obj.type == "textbox"){
      if(!obj.hide_data || obj.hide_data == 0){
        jQuery("#left-sidebar .media-kit-images ").addClass("disabled");
				if(jQuery.inArray('advanced_content_creator', user_roles ) !== -1 || jQuery.inArray('administrator', user_roles ) !== -1 || jQuery.inArray('enterprise', user_roles ) !== -1 || jQuery.inArray('designer', user_roles ) !== -1 || jQuery.inArray('content_creator', user_roles ) !== -1){
					jQuery("#toolbar .textbox-tool").removeClass("d-none");
					jQuery("#toolbar .textbox-tool .textbox-add-text").addClass("d-none");
				}
        updateTextAppearance();
        applyTextcolorPicker();
      }
    }
    else if(obj.type == "image" || obj.type == "ImageContainer"){
      if(!obj.hide_data || obj.hide_data == 0){
        jQuery("#left-sidebar .media-kit-images ").removeClass("disabled");
        jQuery("#toolbar .image-tool").removeClass("d-none");
        //jQuery('input[type="range"]').rangeslider('update', true);
        updateTextAppearance();
        applyTextcolorPicker();
      }
    }
    else if(obj.type == "Rectshape" || obj.type == "circle" || obj.type == "polygon" || obj.type == "triangle" || obj.type == "star" || obj.type == "Lineshape"){
      if(!obj.hide_data || obj.hide_data == 0){
        jQuery("#left-sidebar .media-kit-images ").addClass("disabled");
				if(jQuery.inArray('advanced_content_creator', user_roles ) !== -1 || jQuery.inArray('administrator', user_roles ) !== -1 || jQuery.inArray('enterprise', user_roles ) !== -1 || jQuery.inArray('designer', user_roles ) !== -1 || jQuery.inArray('content_creator', user_roles ) !== -1){
					if(obj.type == "Lineshape"){
            jQuery("#toolbar .lineshape-tool").removeClass("d-none");
          }else{
            jQuery("#toolbar .shape-tool").removeClass("d-none");
            jQuery("#toolbar .shape-tool .shape-add-shape").addClass("d-none");
          }
				}
        updateTextAppearance();
        applyTextcolorPicker();
      }
    }
    //updateRangeSlider();
  }
  else {
    lockCanvasObjects();
  }
}
/**
 * Callback function onMouseUpCanvas()
 * Canvas mouse down event for object
 */
function onMouseUpCanvas(e) {
  var obj = canvas.getActiveObject();
  if(obj){
    if(obj.type == 'activeSelection'){
      var objs = obj._objects.filter(function(o) {
        if((o.type == 'text' && o.name == 'measurement') || o.type == 'line' || o.type == 'guideline'){
          o.opacity = 0;
          o.hasBorders = false;
          o.borderColor = 'transparent';
        }
        else {
          o.borderColor = '#eb2cf6';
        }
      });
      canvas.renderAll();
      canvas.setActiveObject(obj);
      var objsCheck = obj._objects.filter(function(oc){
        if((oc.type == 'text' && oc.name != 'measurement') && oc.type != 'line' && oc.type != 'guideline'){
          return o;
        }
      });
      if(objsCheck.length == 0){
        canvas.discardActiveObject().renderAll();
      }
    }
    if(obj && obj.type == 'ImageContainer'){
      if(obj.containerImage !== ''){
        obj.lockScalingX = true;
        obj.lockScalingY = true;
        obj.lockRotation = true;
      }
    }
    if(obj && typeof obj.hide_container !== 'undefined'){
      if(obj.hide_container == 1){
        obj.lockMovementX = true;
        obj.lockMovementY = true;
        obj.lockScalingX = true;
        obj.lockScalingY = true;
        obj.lockRotation = true;
        obj.selectable = false;
        obj.hasControls = false;
        obj.hasBorders = false;
        obj.set({
          opacity: 1,
          active: true,
        });
        console.log("hide_container refresh = "+activeObject.hide_container);
        canvas.discardActiveObject();
        canvas.renderAll();
      }
    }
    updateCanvasState();
  }
}
/**
 * Callback function onMouseMoveCanvas()
 * Canvas mouse move event for pointer position
 */
function onMouseMoveCanvas(e) {
	var pointer = canvas.getPointer(e.e, true);
  var original_x = parseInt(pointer.x); // parseInt(pointer.x - 330);
  var original_y = parseInt(pointer.y); // parseInt(pointer.y - 22);
  jQuery(".g-ruler-widget.horizontal .mouse-marker").css("left", original_x);
  jQuery(".g-ruler-widget.vertical .mouse-marker").css("top", original_y);
}
/**
 * Callback function DetectTemplateChanges()
 * to set a flag on canvas object changes
 */
function DetectTemplateChanges() {
  kmTemplateChanged = true;
  jQuery("#save_km_template").val(1);
  jQuery("#render_km_template").attr("disabled", true);
  updateCanvasState();
}
/**
 * Update textfield object properties in menu
 */
function updateTextAppearance(){
  var r = true;
  var b,i = false;
	var obj = canvas.getActiveObject();
	if(!obj){return;}
	if(obj){
		if(obj.type == 'page' || obj.type == 'line' || obj.type == 'guideline' || obj.type == 'text'){return;}
		obj.stateProperties.forEach(function(prop) {
			switch (prop) {
				case 'fill':
          if(obj.type == 'textbox'){
            jQuery('#kmds-color-fill').val(obj.fill);
            jQuery('#kmds-color-fill').css("background-color", obj.fill);
          }
          else {
            jQuery('#kmds-shape-fill').val(obj.fill);
            jQuery('#kmds-shape-fill').css("background-color", obj.fill);
          }
        break;
				case 'fontWeight':	
					if(obj.fontWeight == 'bold'){
						b = true;
					} else if(obj.fontWeight == '400') {
						b = false;
					}
					//FnFontStyle(r,b,i);
        break;
				case 'fontStyle':	
					if(obj.fontStyle == 'italic'){
						i = true;											
					} else if(obj.fontStyle == 'normal') {
						i = false;	
					}
					//FnFontStyle(r,b,i);
        break;
				case 'fontSize':	
					document.getElementById('text-font-size').value = obj.fontSize;
        break;
				case 'fontFamily':	
					//document.getElementById('font-family').value = obj.fontFamily;
          //addFontStyle(obj.fontFamily);
					var fontFamilyStyle = kmdsFontsStyleList(obj.fontFamily);
          if(fontFamilyStyle){
            //console.log(fontFamilyStyle);
            addFontStyle(fontFamilyStyle[0], fontFamilyStyle[1]);
            document.getElementById('font-family').value = fontFamilyStyle[0];
            //document.getElementById('fstyle').value = fontFamilyStyle[1];
          }
        break;
				case 'textAlign':	
					jQuery('.align.apri').removeClass('g-active');
					jQuery('#align-'+obj.textAlign).addClass('g-active');
        break;
				case 'stroke':	
					if(obj.stroke == ''){
						var str = 'rgba(0,0,0,0)'; //transparent
					} else {
						var str = obj.stroke;
					}
          if(obj.type == 'image'){
            jQuery('#kmds-image-border').val(str);
            jQuery('#kmds-image-border').css("background-color", str);
            jQuery('#image-border-stroke-num').val(obj.strokeWidth);
          }
          if(obj.type == 'Lineshape'){
            jQuery('#kmds-lineshape-border').val(str);
            jQuery('#kmds-lineshape-border').css("background-color", str);
            jQuery('#lineshape-border-stroke-num').val(obj.strokeWidth);
          }
          else {
            jQuery('#kmds-shape-border').val(str);
            jQuery('#kmds-shape-border').css("background-color", str);
            jQuery('#shape-border-stroke-num').val(obj.strokeWidth);
          }
        break;
			}
		});
    //set opacity range
    if(obj.dynamic_image_opacity_range){
      var new_opacity = (obj.dynamic_image_opacity_range === 0) ? 0 : (obj.dynamic_image_opacity_range * 100);
      obj.set({
        opacity: obj.dynamic_image_opacity_range,
      });
      canvas.renderAll();
      jQuery('#km-image-opacity-range').val(new_opacity);
      jQuery("#image-opacity-range").val(new_opacity+"%");
      //jQuery('#km-image-opacity-range').rangeslider('update', true);
    }
    else {
      var new_opacity = 100;
      jQuery('#km-image-opacity-range').val(new_opacity);
      jQuery("#image-opacity-range").val(new_opacity+"%");
      //jQuery('#km-image-opacity-range').rangeslider('update', true);
    }
	}
}
/**
 * Right sidebar font style option selection
 */
function FnFontStyle(r, b, i){
	if(b && i){ //bold+itallic
		document.getElementById('fstyle').selectedIndex = 7;									
	}
  else if(!b && r && i){ //regular+itallic
		document.getElementById('fstyle').selectedIndex = 3;
	}
  else if(b && !i){  //bold
		document.getElementById('fstyle').selectedIndex = 6;
	}
  else if(!b && !i){ //regular
		document.getElementById('fstyle').selectedIndex = 2;
	}
}
/**
 * Callback function setActiveProp()
 * to set object properties
 */
function setActiveProp(name, value) {
  var object = canvas.getActiveObject();
  if (!object) return;
  object.set(name, value).setCoords();
  canvas.renderAll();
  DetectTemplateChanges();
}
/**
 * Callback function setActiveStyle()
 * to set object style properties
 */
function setActiveStyle(styleName, value, object) {
  object = object || canvas.getActiveObject();
  if (!object) return;
  /*if (object.setSelectionStyles && object.isEditing) {
    var style = { };
    style[styleName] = value;
    object.setSelectionStyles(style);
    object.setCoords();
  }
  else {*/
    object.set(styleName, value);
    if(object.styles && styleName == 'fontFamily'){
      var styles = object.styles;
      jQuery.each(styles, function(key1, val1) {
        jQuery.each(val1, function(key2, val2) {
          if(val2.fontFamily){
            styles[key1][key2]['fontFamily'] = value;
          }
        });
      });
      object.set(styles, styles);
    }
  //}
  object.setCoords();
  canvas.requestRenderAll();
  DetectTemplateChanges();
};
/**
 * Callback function getActiveProp()
 * to get object properties
 */
function getActiveProp(name) {
  var object = canvas.getActiveObject();
  if (!object) return '';

  return object[name] || '';
}
/**
 * Callback function getActiveStyle()
 * to get object style
 */
function getActiveStyle(styleName, object) {
  object = object || canvas.getActiveObject();
  if (!object) return '';
  return (object.getSelectionStyles && object.isEditing)
    ? (object.getSelectionStyles()[styleName] || '')
    : (object[styleName] || '');
};
/**
 * Callback function updateRangeSlider()
 * for range style
 */
/*function updateRangeSlider() {
  var $r = jQuery('input[type="range"]');
  // Initialize
  $r.rangeslider({
    polyfill: false,
    onSlide: function(position, value) {
      //$('#corner-input').val(value);
    },
    onSlideEnd: function(position, value) {
      // Update the rating value once the slide is done
      //$('#corner-input').val(value);
    }
  });
}*/
/**
 * Callback function getUrlQuery()
 * to get the template clone status
 **/
function getUrlQuery($type) {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++){
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	if(vars[$type]) {
		return true;
	}
	else {
		return false;
	}
}
/**
 * Callback function getZoomIncrement()
 * to get zoom increment
 **/
function getZoomIncrement(zoomLevel, unit) {
  var tick, increment;
  // var activePageID = $('.page-row.g-active').attr('id');
  // active_page_object = canvas.getItemsByPage(activePageID)[0];
  // var oldCoordinates = active_page_object.getBoundingRect();
  switch (zoomLevel) {
    case 0.06:
      if(unit == 'in'){
        tick = 8;
        increment = 10;
      }else{
        tick = 5;
        increment = 830; 
      }
    break;
    
    case 0.12:
      if(unit == 'in'){
        tick = 8;
        increment = 10;
      }else{
        tick = 5;
        increment = 420; 
      }
    break;
    
    case 0.25:
      if(unit == 'in'){
        tick = 8;
        increment = 5;
      }else{
        tick = 5;
        increment = 200; 
      }
    break;
    
    case 0.50:
      if(unit == 'in'){
        tick = 8;
        increment = 1;
      }else{
        tick = 5;
        increment = 100; 
      }
    break;
    
    case 0.66:
      if(unit == 'in'){
        tick = 8;
        increment = 1;
      }else{
        tick = 5;
        increment = 80; 
        // canvas.zoomToPoint(new fabric.Point(active_page_object.left, active_page_object.top), .61);
      }
    break;
    
    case 1:
      if(unit == 'in'){
        tick = 8;
        increment = 1;
      }else{
        tick = 5;
        increment = 50; 
      }
    break;
    
    case 1.5:
      if(unit == 'in'){
        tick = 8;
        increment = 0.5;
      }else{
        tick = 5;
        increment = 30; 
        // canvas.zoomToPoint(new fabric.Point(oldCoordinates.left, active_page_object.top), 1.65);
      }
    break;
    
    case 2:
      if(unit == 'in'){
        tick = 8;
        increment = 0.5;
      }else{
        tick = 4;
        increment = 30; 
        // canvas.zoomToPoint(new fabric.Point(oldCoordinates.left, active_page_object.top), 1.35);
      }
    break;
    
    case 3:
      if(unit == 'in'){
        tick = 8;
        increment = 0.2;
      }else{
        tick = 5;
        increment = 20; 
      }
    break;
    
    case 4:
      if(unit == 'in'){
        tick = 8;
        increment = 0.2;
      }else{
        tick = 5;
        increment = 10; 
      }
    break;
    
    case 8:
      if(unit == 'in'){
        tick = 8;
        increment = 0.1;
      }else{
        tick = 5;
        increment = 10; 
      }
    break;
    
    case 16:
      if(unit == 'in'){
        tick = 8;
        increment = 0.05;
      }else{
        tick = 5;
        increment = 5; 
      }
    break;
    
    case 32:
      if(unit == 'in'){
        tick = 8;
        increment = 0.02;
      }else{
        tick = 5;
        increment = 2; 
      }
    break;
    
    case 64:
      if(unit == 'in'){
        tick = 8;
        increment = 0.01;
      }else{
        tick = 5;
        increment = 1; 
      }
    break;
    
    case 128:
      if(unit == 'in'){
        tick = 8;
        increment = 0.01;
      }else{
        tick = 5;
        increment = 1; 
      }
    break;
    
    case 256:
      if(unit == 'in'){
        tick = 8;
        increment = 0.005;
      }else{
        tick = 5;
        increment = 1; 
      }
    break;
    
    default:
      if(unit == 'in'){
        tick = 8;
        increment = 1;
      }else{
        tick = 5;
        increment = 50; 
      }
  }
  
  var data = {};
  data.tick = tick;
  data.increment = increment;
  return data; 
}
/**
 * Callback function applyDynamicImageCorner()
 * to add radios in image object
 **/
/*function applyDynamicImageCorner() {
  var active_page_object = canvas._objects;
  active_page_object.forEach(function(obj) {
    if(obj.type == 'image'){
      if(obj.dynamicImageCorner){
        var newval = obj.dynamicImageCorner;
        obj.clipTo = function(ctx) {
          var rect = new fabric.Rect({
            left:0,
            top:0,
            rx:this.dynamicImageCornerrxw,
            ry:this.dynamicImageCornerryh,
            width:this.width,
            height:this.height,
            fill:'#000000'
          });
          rect._render(ctx, false);
        };
        canvas.renderAll();
      }
    }
  });
}*/
/**
 * Callback function lockCanvasObjects()
 * To lock all Canvas objects
 */
function lockCanvasObjects() {
  var objs = canvas._objects.filter(function(o) {
    if((o.hide_data && o.hide_data == 1) || o.type == 'line' || o.type == 'guideline' || (o.type == 'text' && o.name == 'measurement')){
      o.set({
        lock_position: 1,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        hasControls: false,
        selectable: false,
        hasBorders: false,
        borderColor: 'transparent',
        editable: false,
      });
    }
    else {
      o.set({
        lock_position: 1,
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        hasControls: false,
        selectable: true,
        hasBorders: true,
        borderColor: '#eb2cf6',
        editable: true,
      });
    }
  });
  jQuery(".object-action.unlock").addClass("d-none");
  jQuery(".object-action.lock").removeClass("d-none");
  jQuery('.km-smart-guides').attr('disabled', 'disabled');
  smartGuideStatus = 0;
  canvas.renderAll();
}
/**
 * Callback function deleteSelectedObject()
 * To delete Canvas selected object
 */
function deleteSelectedObject() {
  var activeObj = canvas.getActiveObject();
  //if(activeObj.lock_position == 0){
  if(activeObj){
    canvas.remove(activeObj);
    canvas.discardActiveObject().renderAll();
  }
}

/**
 * Callback function applyDynamicImageCorner()
 * to add radios in image object
 **/
function applyDynamicImageCorner() {
  var activePageObject = canvas.getActivePageObj();
  var activePageID = activePageObject.id;
  enabledTemplatePage(activePageID);
  var active_page_object = canvas._objects;
  active_page_object.forEach(function(obj) {
    if(obj.type == 'image'){
      if(obj.dynamicImageCorner){
        var newval = obj.dynamicImageCorner;
        obj.clipTo = function(ctx) {
          var rect = new fabric.Rect({
            left:0,
            top:0,
            rx:this.dynamicImageCornerrxw,
            ry:this.dynamicImageCornerryh,
            width:this.width,
            height:this.height,
            fill:'#000000'
          });
          rect._render(ctx, false);
        };
        canvas.renderAll();
      }
    }
  });
}
/**
 * Callback function enabledTemplatePage()
 * to disabled/enabled template pages at product page
 **/
function enabledTemplatePage(pageID){
  var activePage = jQuery("#displayed-page").attr('pageID');
  console.log("activePage = "+activePage);
  if(activePage !== pageID){
    console.log("pageID = "+pageID);
    jQuery("#displayed-page").attr('pageID', pageID);
    canvas.discardActiveObject();
    var pageObjects = canvas._objects;
    pageObjects.forEach(function(obj) {
      if(obj.id === pageID){
        obj.set({
          visibility: true,
          opacity: 1,
          //selectable: true,
          //evented: true,
        });
        obj.setControlsVisibility({
          mt: true, 
          mb: true, 
          ml: true, 
          mr: true, 
          bl: true,
          br: true, 
          tl: true, 
          tr: true,
          mtr: true, 
        });
        //Activate active page
        var activePageObj = canvas.getItemById(pageID);
        var pageIndex = canvas.getObjects().indexOf(activePageObj);
        if(pageIndex != 0 ){
          canvas.moveTo(activePageObj, 0);
          canvas.renderAll();	
        } 
        canvas.renderAll();
      }
      else if(obj.page && obj.page === pageID){
        if((obj.type == 'text' && obj.name == 'measurement') || obj.type === 'line' || obj.type === 'guideline' || (obj.hide_data && obj.hide_data == 1) || obj.type == 'ConnectorHandleStart' || obj.type == 'ConnectorHandleEnd' || obj.type == 'PageMediaBox' || obj.type == 'PageTrimBox'){
          return;
        }
        if(obj.dynamic_opacity_range){
          obj.set('opacity', obj.dynamic_opacity_range);
        }
        else if(obj.dynamic_image_opacity_range){
          obj.set('opacity', obj.dynamic_image_opacity_range);
        }
        else {
          obj.set('opacity', 1);
        }
        obj.set({
          visibility: true,
          //opacity: 1,
          selectable: true,
          evented: true,
        });
        obj.setControlsVisibility({
          mt: true, 
          mb: true, 
          ml: true, 
          mr: true, 
          bl: true,
          br: true, 
          tl: true, 
          tr: true,
          mtr: true, 
        });
        //move object on layerindex basis
        var ord = (obj.layerIndexing) ? obj.layerIndexing : 1;
        canvas.moveTo(obj, parseInt(ord));
        canvas.renderAll();
      }
      else {
        if(obj.page && obj.page !== pageID){
          obj.set({
            visibility: false,
            opacity: 0,
            selectable: false,
            evented: false,
          });
          obj.setControlsVisibility({
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
        }
        else if(obj.id !== pageID){
          obj.set({
            visibility: false,
            opacity: 0,
            selectable: false,
            evented: false,
          });
          obj.setControlsVisibility({
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
        }
      }
      canvas.renderAll();
    });
    enablePageMediaBox(pageID);
  }
}
/**
 * Callback function enabledTemplateFirstPageObjects()
 * to disabled/enabled template pages at product page
 **/
function enabledTemplateFirstPageObjects(){
  var pageID = jQuery("#displayed-page").attr('pageID');
  var pageObjects = canvas._objects;
  console.log("enabledTemplateFirstPageObjects");
  pageObjects.forEach(function(obj) {
    if(obj.id === pageID){
      obj.set({
        visibility: true,
        opacity: 1,
        //selectable: true,
        //evented: true,
      });
      obj.setControlsVisibility({
        mt: true, 
        mb: true, 
        ml: true, 
        mr: true, 
        bl: true,
        br: true, 
        tl: true, 
        tr: true,
        mtr: true, 
      });
      //Activate active page
      var activePageObj = canvas.getItemById(pageID);
      var pageIndex = canvas.getObjects().indexOf(activePageObj);
      if(pageIndex != 0 ){
        canvas.moveTo(activePageObj, 0);
        canvas.renderAll();	
      } 
      canvas.renderAll();
    }
    else if(obj.page && obj.page === pageID){
      if((obj.type == 'text' && obj.name == 'measurement') || obj.type === 'line' || obj.type === 'guideline' || (obj.hide_data && obj.hide_data == 1) || obj.type == 'ConnectorHandleStart' || obj.type == 'ConnectorHandleEnd' || obj.type == 'PageMediaBox' || obj.type == 'PageTrimBox'){
        return;
      }
      if(obj.dynamic_opacity_range){
        obj.set('opacity', obj.dynamic_opacity_range);
      }
      else if(obj.dynamic_image_opacity_range){
        obj.set('opacity', obj.dynamic_image_opacity_range);
      }
      else {
        obj.set('opacity', 1);
      }
      obj.set({
        visibility: true,
        //opacity: 1,
        selectable: true,
        evented: true,
      });
      obj.setControlsVisibility({
        mt: true, 
        mb: true, 
        ml: true, 
        mr: true, 
        bl: true,
        br: true, 
        tl: true, 
        tr: true,
        mtr: true, 
      });
      //move object on layerindex basis
      var ord = (obj.layerIndexing) ? obj.layerIndexing : 1;
      canvas.moveTo(obj, parseInt(ord));		
      canvas.renderAll();
    }
    else {
      if(obj.page && obj.page !== pageID){
        obj.set({
          visibility: false,
          opacity: 0,
          selectable: false,
          evented: false,
        });
        obj.setControlsVisibility({
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
      }
      else if(obj.id !== pageID){
        obj.set({
          visibility: false,
          opacity: 0,
          selectable: false,
          evented: false,
        });
        obj.setControlsVisibility({
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
      }
    }
    canvas.renderAll();
  });
  enablePageMediaBox(pageID);
}
/**
 * Callback function addPageMediaBox()
 * to add bleed area with page.
 **/
function enablePageMediaBox(activePageID){
  var pages = canvas.getItemsByType('page', true);
  pages.forEach(function(pageObj) {
    var pageID = pageObj.id;
    var pageMediaBoxObj = canvas.getItemById(pageID+'MediaBox');
    if(!pageMediaBoxObj){
      var pageMediaBox = new fabric.PageMediaBox({
        left: (pageObj.left),
        top: (pageObj.top),
        width: (pageObj.width+56),
        height: (pageObj.height+56),
        id: pageID+'MediaBox',
        page: pageID,
        name: 'Page MediaBox',
        fill: '#fff',
        selectable: false,
        hasControls: false,
        hasBorders: false,
        visibility: true,
        opacity: 1,
        originX: 'center',
        originY: 'center',
        active: true,
        lock_position: 1,
        hide_data: 0,
      });
      canvas.add(pageMediaBox);
      canvas.renderAll();
      canvas.sendToBack(pageMediaBox);
      _drawPageTrimBox(pageID);
    }
    else {
      var trimBoxes = canvas.getItemById(pageID+'-trimboxtop');
      if(!trimBoxes){
        _drawPageTrimBox(pageID);
      }
      else {
        var cropMarks = canvas.getItemById(pageID+'-cropMarksTT');;
        if(!cropMarks){
          _drawCropMarks(pageID);
        }
      }
      var page_format = jQuery("#page_format").val();
      var pageMedia = canvas.getItemsByType('PageMediaBox', true);
      pageMedia.forEach(function(pm) {
        if(page_format == 'pdf' && pm.page == activePageID){
          pm.set('opacity', 1);
          pm.set('visibility', true);
          canvas.renderAll();
          canvas.sendToBack(pm);
        }
        else {
          pm.set('opacity', 0);
          pm.set('visibility', false);
          canvas.renderAll();
        }
      });
      var pageTrim = canvas.getItemsByType('PageTrimBox', true);
      pageTrim.forEach(function(pt) {
        if(page_format == 'pdf' && pt.page == activePageID){
          pt.set('opacity', 1);
          pt.set('visibility', true);
          canvas.renderAll();
        }
        else {
          pt.set('opacity', 0);
          pt.set('visibility', false);
          canvas.renderAll();
        }
      });
    }
  });
}
