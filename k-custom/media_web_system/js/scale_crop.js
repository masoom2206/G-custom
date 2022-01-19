jQuery(document).on('dblclick','#webregionblock1',function (e) {
  var obj = jQuery('#left-container .selected-object img');
  var imgsrc =  obj.attr('src');
  
  var pwidth = jQuery('#webregionblock1').width();
  var pheight = jQuery('#webregionblock1').height();
    
  //selected image object
  jQuery('.media-kit-image-list').click();
  var wInnerWidth = parseInt(window.innerWidth/2);
  var wInnerHeight = parseInt(window.innerHeight/2);
  
  jQuery("<img>").attr("src", jQuery('#left-container .selected-object img').attr("src")).load(function(){
    var objWidth = this.width;
    var objHeight = this.height; 
  });

  var objWidth = obj.prop('naturalWidth');
  var objHeight  = obj.prop('naturalHeight');
  if(objWidth > wInnerWidth){
    objWidth = wInnerWidth;
  }
  if(objHeight > wInnerHeight){
    objHeight = wInnerHeight;
  }

  console.log('wInnerWidth: '+ wInnerWidth);
  console.log('wInnerHeight: '+ wInnerHeight);
  console.log('objWidth: '+ objWidth);
  console.log('objHeight: '+ objHeight);
  
  if(jQuery('#scalcrop-image').prop('checked')){      
    if(jQuery(".km-image-crop-modal").length == 0){
      // open modal window
      modalImageEditor();
      // call cropit image function 
      var options = {};
      options.width = objWidth;
      options.height = 180;
      cropitImage(imgsrc, options);
    }
  }
});


//Insert image file at canvas after click on image name
jQuery(document).on('click','.media-data .kit-name', function (e) {
  var activeObj = jQuery('#left-container').find('.selected-object');
  var obj_type = jQuery('#left-container .selected-object').attr('data-obj-type');
  if(activeObj.length && obj_type == 'image') {
    var obj = jQuery(this).parent(".media-data");
    var imgsrc =  obj.attr("data-src");
    
    var pwidth = jQuery('#webregionblock1').width();
    var pheight = jQuery('#webregionblock1').height();
 
    var objWidth = obj.prop('naturalWidth');
    var objHeight  = obj.prop('naturalHeight');
    jQuery("<img>").attr("src", imgsrc).load(function(){
      var objWidth = this.width;
      var objHeight = this.height;
    });
    
    console.log('W: '+pwidth);
    console.log('H: '+pheight);

    // open modal window
    modalImageEditor();
    // call cropit image function 
    var options = {};
    options.width = 750;
    options.height = 180;
    cropitImage(imgsrc, options);
  }
});


/**
 * Callback function cropitImage()
 * to Drag the image editor in product edit page.
 **/
function modalImageEditor() {
  jQuery('<div/>', {"class": "g-dialog-container km-image-crop-modal d-block justify-content-center align-items-center visible", "id":"km-image-editor"})
    .append(jQuery('<div/>', {"class": "km-image-editor"})
      .append(jQuery("<div/>", {"class": "slider-wrapper"})
        .append(jQuery("<div/>", {"class": "slider-section"})
          .append(jQuery("<span/>", {"class": "icon icon-image small-image icon18x24"}))
          .append(jQuery("<input/>", {"class": "cropit-image-zoom-input", "id": "km-image-crop-range", "role": "input-range", "type": "range", "min": "0", "max": "1", "step": "0.01", "value": "0"}))
          .append(jQuery("<span/>", {"class": "icon icon-image large-image icon36x24"}))
          .append(jQuery("<button/>", {"class": "btn invisible blurring-msg", "onmouseover": "tooltipfn(this)", "data-km-toggle": "tooltip", "data-view": "fitpage", "data-placement": "bottom", "data-title": "Some blurring may occur", "data-html": "true", "title": "Some blurring may occur"})
            .append(jQuery("<i/>", {"class": "fas fa-exclamation-triangle"}))
          )
        )
        .append(jQuery("<span/>", {"id": "drag-km-image-editor"})
          .append(jQuery("<i/>", {"class": "fa fa-arrows-alt"}))
        )
      )
      .append(jQuery("<div>", {"class": "cropit-preview"})
        .append(jQuery("<div>", {"class": "spinner-border"}))
      )
    )
    .append(jQuery('<div/>', {"class": "dialog-action text-right p-2"})
      .append(jQuery('<a/>', {'class': 'close-modal btn btn-cancel mr-2', 'href': 'javascript:void(0);', text: 'Cancel'}))
      .append(jQuery('<a/>', {'class': 'close-modal apply-image-crop btn btn-primary font-fjalla', 'href': 'javascript:void(0);', text: 'Apply'}))
    ).appendTo('#canvas-container');
    
  
  //jQuery(".km-image-crop-modal").css({ "width": parseInt(objWidth+120)+"px", "height": parseInt(objHeight+120)+"px" });
  jQuery(".km-image-crop-modal").css({ "width": "750px", "height": "300px" });
  
  dragImageEditor(document.getElementById("km-image-editor"));
  //Add class when image drag start
  jQuery(".cropit-preview img")
  .mousedown(function() {
    jQuery(".cropit-preview").addClass("dragging")
  })
  .mouseup(function() {
    jQuery(".cropit-preview").removeClass("dragging")
  });
}

/**
 * Callback function cropitImage()
 * to Drag the image editor in product edit page.
 **/
function cropitImage(imgsrc, options) { 
  $imageCropper = jQuery('.km-image-editor');
  $imageCropper.cropit({
    allowDragNDrop: false,
    imageBackground: false,
    imageState: {
      src: imgsrc,
    },
    //freeMove: 'true',
    minZoom: 'fill',
    maxZoom: 10,
    smallImage: 'stretch', //'allow',
    width: options.width,
    height: options.height,
    exportZoom: 1,
    onZoomChange: function(){
       console.log('zoom level changing');
      if(!jQuery('.controls-wrapper button').hasClass('activated')){
        var currentZoom = $imageCropper.cropit('zoom');
        if(currentZoom == 1){
          jQuery('.controls-wrapper button').addClass('invisible');  
        }else{
          jQuery('.controls-wrapper button').removeClass('invisible'); 
        }
      }
    },
    onImageLoading: function() {
       console.log('loading...');
      //right pane scal and crop checkbox is checked, slider is visible
      var scal_crop = jQuery('#scalcrop-image').prop('checked');
      if(!scal_crop){
        jQuery('.slider-section').hide();
      }
    },
    onImageLoaded: function() {
      console.log('loaded');
      var customZoomLevel = 1;          
      jQuery("#canvas-container .km-image-crop-modal .spinner-border").remove();
      
      /*
      var crop_height = jQuery(".cropit-preview").height();
      crop_height = parseInt(crop_height+120);
      jQuery("#km-image-editor").css("height", crop_height);
      console.log('crop_height : '+crop_height);
      */
      
      //Add class when image drag start
      jQuery(".cropit-preview img")
      .mousedown(function() {
        jQuery(".cropit-preview").addClass("dragging")
      })
      .mouseup(function() {
        jQuery(".cropit-preview").removeClass("dragging")
      });
    },
    onZoomDisabled: function() {
      console.log('zoom is disabled');
      var current_max_zoom = $imageCropper.cropit('maxZoom');
      console.log(current_max_zoom);
      $imageCropper.cropit('maxZoom', current_max_zoom + 1 );
    },
  });
}


/**
 * Callback function dragImageEditor()
 * to Drag the image editor in product edit page.
 **/
function dragImageEditor(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var elmntHeight = parseInt(elmnt.offsetHeight - 50);
  var elmntWidth = parseInt(elmnt.offsetWidth - 50);
  var windowWidth = parseInt(window.innerWidth - 50);
  var windowHeight = parseInt(window.innerHeight - elmntHeight);
  if (document.getElementById("drag-km-image-editor")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById("drag-km-image-editor").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }
  // Function for mouse drag event
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragImageEditor;
    // call a function whenever the cursor moves:
    document.onmousemove = imageEditorDrag;
  }
  // Function to drag image editor
  function imageEditorDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    if(pos4 > 10 && pos4 < windowHeight){
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    }
    if(pos3 > elmntWidth && pos3 < windowWidth){
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  }
  // Function to close mouse drag event
  function closeDragImageEditor() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

//callback to resize image respected to image editor dimensions
function resizeImage(image_src, resize, fn) {
  var fileReader = new FileReader();
  if (image_src == '' || typeof image_src == 'undefined') {
    // 	var dataurl = 'https://image.shutterstock.com/image-photo/waterfall-deep-forest-huay-mae-600w-351772952.jpg'; 
    fn('blank');
  } else {
    var dataurl = image_src;
    var request = new XMLHttpRequest();
    request.open('GET', dataurl, true);
    request.responseType = 'blob';
    request.onload = function() {
      fileReader.readAsDataURL(request.response);
    };
    request.send();
    fileReader.onload = function(event) {
      var img = new Image();
      img.onload = function() {
        // console.log('image onload');
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        context.imageSmoothingQuality = 'high';
        canvas.width = parseFloat((img.width * resize) / 100);
        canvas.height = parseFloat((img.height * resize) / 100);
       // canvas.width = parseInt((img.width * resize) / 100);
       // canvas.height = parseInt((img.height * resize) / 100);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
       // context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
        fn(canvas.toDataURL());
      }
      img.src = event.target.result;
    };
  }
}

//callback to genrate Image Editor Tool
function ReplaceResizeImage($imageCropper, image_src, media_preset_height, media_preset_width, callback) {
  //'destroy not working as expected, below line is added.  this will remove already included image'
  $imageCropper.find('.cropit-preview-image-container').remove();
  
  var originalHeight = parseFloat(media_preset_height);
  var originalWidth = parseFloat(media_preset_width);
  // We customize image editor dimensions as real dimensions cant be shown.
  // on the page. Image dimensions are also be scaled based on image editor dimensions to maintain aspect ratio.
    var screen_width = parseInt(jQuery("div.image-editor").width());
    var screen_height = 650;
  if(screen_width > screen_height ) { 
    if (originalWidth > screen_width && originalHeight > screen_height ) {
      if (originalWidth >= originalHeight) {
        var previewScale = (originalWidth / screen_width);
        var resize = parseFloat((screen_width * 100) / originalWidth); 
      } else {
        var previewScale = (originalHeight / screen_height);
        var resize = parseFloat((screen_height * 100) / originalHeight);
      }
      var previewHeight = originalHeight / previewScale;
      var previewWidth = originalWidth / previewScale;
    }
    else if(originalWidth > screen_width ){
        var previewScale = (originalWidth / screen_width);
        var resize = parseFloat((screen_width * 100) / originalWidth);
        var previewHeight = originalHeight / previewScale;
        var previewWidth = originalWidth / previewScale;
    }
    else if (originalHeight > screen_height){
        var previewScale = (originalHeight / screen_height);
        var resize = parseFloat((screen_height * 100) / originalHeight);
        var previewHeight = originalHeight / previewScale;
        var previewWidth = originalWidth / previewScale;
    }
    else {
      var previewHeight = originalHeight;
      var previewWidth = originalWidth;
      resize = 100;
      previewScale = 1;
    }
  }
  else{
    var previewScale = (originalWidth / screen_width);
    var resize = parseFloat((screen_width * 100) / originalWidth);
    var previewHeight = originalHeight / previewScale;
    var previewWidth = originalWidth / previewScale;
  }
  
  resizeImage(image_src, resize, function(resizeDataURL) {
    $imageCropper.cropit({
      allowDragNDrop: false,
      imageBackground: false,
      imageState: {
        src: resizeDataURL,
      },
      //freeMove: 'true',
      minZoom: 'fill',
      maxZoom: 10,
      smallImage: 'allow',
      width: previewWidth,
      height: previewHeight,
      exportZoom: previewScale,
      onZoomChange: function() {
        // console.log('zoom level changing');
        if(!jQuery('.controls-wrapper button').hasClass('activated')){
          var currentZoom = $imageCropper.cropit('zoom');
          if(currentZoom == 1) {
            console.log('no display');
            jQuery('.controls-wrapper button').addClass('invisible');  
          }else{
            jQuery('.controls-wrapper button').removeClass('invisible'); 
          }
        }
      },
      onImageLoading: function() {
        // console.log('image is loading...');
      },
      onImageLoaded: function() {
        // console.log('image is loaded callback');
        var img_width = $imageCropper.cropit('imageSize').width;
        var img_height = $imageCropper.cropit('imageSize').height;
        callback($imageCropper);
      },
      onZoomDisabled: function() {
        //console.log('zoom is disabled');
        var current_max_zoom = $imageCropper.cropit('maxZoom');
        //console.log(current_max_zoom);
        $imageCropper.cropit('maxZoom', current_max_zoom + 1 );
      },
    });
  });
}