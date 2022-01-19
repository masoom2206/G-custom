jQuery(document).ready(function(){
  //Close Image Modal Window
  jQuery(document).on('click','.close-modal',function (e) {
    if(jQuery(this).hasClass('apply-image-crop')){
      //var imgsrc = jQuery('.km-image-editor').cropit('export');
      var imageData = jQuery('.km-image-editor').cropit('export', {
        type: 'image/jpeg',
        //quality: 0.9,
        quality: 1.0,
        originalSize: true,
      });
      var obj = canvas.getActiveObject();
      if(obj){
        if(obj.type == 'ImageContainer'){
          if(obj.containerImage !== '' && !jQuery(".media-data").hasClass("active-gray")){
            var rec_width = obj.getScaledWidth();
            var rec_height = obj.getScaledHeight();
            obj = canvas.getItemById(obj.containerImage);
            var imgfid = obj.imgfid;
            var basename = obj.name;
            var img = new Image();
            img.src = imageData;
            img.onload = function(){
              obj.setElement(img);
              obj.set({
                imgfid: imgfid,
                name: basename,
                src: imageData,
                scaleX: 1,
                scaleY: 1,
                height: rec_height,
                width: rec_width,
              });
              canvas.renderAll();
              jQuery(".g-dialog-container").remove();
            }
          }
          else {
            if(jQuery(".media-data").hasClass("active-gray")){
              var imgfid = jQuery(".media-data.active-gray").attr("data-fid");
              var basename = jQuery(".media-data.active-gray").attr("image-title");
              //var ext = filename.substring(filename.lastIndexOf('.'));
              //var basename = filename.split(ext)[0];
            }
            else {
              var imgfid = obj.imgfid;
              var basename = obj.name;
            }
            console.log("imgfid = "+imgfid);
            console.log("basename = "+basename);
            var rec_left = obj.left;
            var rec_top = obj.top;
            var lock_position = obj.lock_position;
            var lock_data = obj.lock_data;
            var rec_width = obj.getScaledWidth();
            var rec_height = obj.getScaledHeight();
            var pageID = obj.page;
            var containerWidth = obj.getScaledWidth();
            var containerHeight = obj.getScaledHeight();
            var containerID = obj.id;
            var containerName = obj.name;
            var angle = obj.angle;
            var oldContImageID = (obj.containerImage !== '') ? obj.containerImage : '';
            var layer_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            obj.set({
              fill: 'transparent',
              opacity: 0,
              lockMovementX: true,
              lockMovementY: true,
              selectable: false,
              hasControls: false,
              hasBorders: false,
              hide_container: 0,
              objectCaching: false,
              containerImage: layer_id,
            }).setCoords();
            fabric.util.loadImage(imageData, function(img) {
              contImg = new fabric.Image(img, {
                  left: rec_left,
                  top: rec_top,
                  actualLeft: rec_left,
                  actualTop: rec_top,
                  originX: 'center',
                  originY: 'center',
                  //height: rec_height,
                  //width: rec_width,
                  selectable: false,
                  hasControls: false,
                  hasBorders: false,
                  lockMovementX : true,
                  lockMovementY : true,
                  lockScalingX : true,
                  lockScalingY : true,
                  lockRotation : true,
                  imgfid : imgfid,
                  name : basename,
                  hide_container : 1,
                  layerIndexing : 1,
                  page : pageID,
                  id: layer_id,
                  //angle: angle,
                  containerName: containerName,
                  containerID: containerID,
                  containerWidth: containerWidth,
                  containerHeight: containerHeight,
                });
              contImg.scaleToHeight(rec_height);
              contImg.scaleToWidth(rec_width);
              canvas.add(contImg);
              //canvas.renderAll();
              contImg.set({
                'angle': angle,
              });
              canvas.renderAll().setActiveObject(contImg);
              contImg.setCoords();
              if(oldContImageID !== ''){
                //delete old container image
                var oldConImg = canvas.getItemById(oldContImageID);
                canvas.remove(oldConImg);
                $('#'+oldConImg.id).remove();
              }
              add_layer(layer_id, basename, 'image', pageID, '', '', obj.id);
              $('div#'+obj.id+' .media-kit-image-list').remove();
              if(!$("#"+obj.id+".imageContainer .kmds-image-crop-wrapper").length){
                $("#"+obj.id+".imageContainer .layer-title-group").after($("<span></span>").attr("class", "kmds-image-crop-wrapper layer-icon").attr("id", "kmdsImageCrop").html("&nbsp;"));
              }
              var defImag = canvas.getItemById("default"+obj.id);
              canvas.remove(defImag);
              var added_json = canvas.toJSON();
              canvas.clear();
              canvas.loadFromJSON(added_json, canvas.renderAll.bind(canvas));
              setTimeout(function () {
                // contImg.scaleToHeight(rec_height);
                // contImg.scaleToWidth(rec_width);
                // var widthFactor = rec_width / contImg.width;
                // var heightFactor = rec_height / contImg.height;
                // var minFactor = Math.min(widthFactor, heightFactor);
                // contImg.scale(minFactor);
                // canvas.renderAll();
                var activeCont = canvas.getItemById(obj.id);
                canvas.setActiveObject(activeCont);
                updateContainerImageCoords();
              }, 100);
              $("#default"+obj.id).remove();
              layerReordering();
              $('button.action-button.g-active').removeClass('g-active');
              $('.kmds-static-image-load-spinner').remove();
              $(".g-dialog-container").remove();
              jQuery(".media-data").removeClass("active-gray");
            });
          }
        }
        else{
          jQuery(".g-dialog-container").remove();
        }
      }
      else{
        jQuery(".g-dialog-container").remove();
      }
    }
    else{
      jQuery(".g-dialog-container").remove();
    }
  });
});
/**
 * Callback function kmdsImageCrop()
 * to open image crop modal window.
 **/
function kmdsImageCrop(imgSrc = null){
  //Selected image object
  var wInnerWidth = parseInt(window.innerWidth/2);
  var wInnerHeight = parseInt(window.innerHeight/2);
  var obj = canvas.getActiveObject();
  if(obj.type == 'ImageContainer'){
    if(obj.containerImage != '' && imgSrc == null){
      obj = canvas.getItemById(obj.containerImage);
      var objsrc = obj.src;
      //console.log("objsrc = "+objsrc);
    }
    else {
      var objsrc = imgSrc;
    }
  }
  var imgWidth = obj.width;
  var imgHeight = obj.height;
  var objWidth = obj.width*obj.scaleX;
  var objHeight = obj.height*obj.scaleY;
  /*if(objWidth > wInnerWidth){
    objWidth = wInnerWidth;
  }
  if(objHeight > wInnerHeight){
    objHeight = wInnerHeight;
  }*/

  /*if(jQuery(".media-data.active-gray").length){
    var $this = jQuery(".media-data.active-gray");
    var imgsrc = jQuery($this).attr("data-src");
  }
  else {
    var imgsrc = objsrc;
  }*/
  if(jQuery(".km-image-crop-modal").length == 0){
    jQuery('<div/>', {"class": "g-dialog-container km-image-crop-modal d-block visible", "id":"km-image-editor"})
      .append(jQuery('<div/>', {"class": "km-image-editor"})
        .append(jQuery("<div/>", {"class": "slider-wrapper"})
          .append(jQuery("<span/>", {"class": "icon icon-image small-image icon18x24"}))
          .append(jQuery("<input/>", {"class": "cropit-image-zoom-input", "id": "km-image-crop-range", "role": "input-range", "type": "range", "min": "0", "max": "1", "step": "0.01", "value": "0"}))
          .append(jQuery("<span/>", {"class": "icon icon-image large-image icon36x24"}))
          .append(jQuery("<button/>", {"class": "btn invisible blurring-msg", "onmouseover": "tooltipfn(this)", "data-km-toggle": "tooltip", "data-view": "fitpage", "data-placement": "bottom", "data-title": "Some blurring may occur", "data-html": "true", "title": "Some blurring may occur"})
            .append(jQuery("<i/>", {"class": "fas fa-exclamation-triangle"}))
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
      ).appendTo('#mainframe');
    jQuery(".km-image-crop-modal").css({ "width": parseInt(objWidth+120)+"px", "height": parseInt(objHeight+120)+"px" });
    dragImageEditor(document.getElementById("km-image-editor"));
    //Add class when image drag start
    jQuery(".cropit-preview img")
    .mousedown(function() {
      jQuery(".cropit-preview").addClass("dragging")
    })
    .mouseup(function() {
      jQuery(".cropit-preview").removeClass("dragging")
    });
    $imageCropper = jQuery('.km-image-editor');
    ReplaceResizeImage($imageCropper, objsrc, objHeight, objWidth, imgWidth, imgHeight, 0, function(result) {
      console.log(result);
    });
  }
  else {
    jQuery('.km-image-editor .cropit-preview').append('<div class="spinner-border"></div>');
    $imageCropper = jQuery('.km-image-editor');
    ReplaceResizeImage($imageCropper, imgsrc, objHeight, objWidth, imgWidth, imgHeight, 0, function(result) {
      console.log(result);
    });
  }
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
/**
 * Callback function resizeImage()
 * to return image from canvas
 **/
function resizeImage(image_src, resize, fn) {
  var fileReader = new FileReader();
  if (image_src == '' || typeof image_src == 'undefined') {
    // 	var dataurl = 'https://image.shutterstock.com/image-photo/waterfall-deep-forest-huay-mae-600w-351772952.jpg'; 
    fn('blank');
  }
  else {
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
        var img_canvas = document.createElement("canvas");
        var context = img_canvas.getContext("2d");
        img_canvas.width = parseFloat((img.width * resize) / 100);
        img_canvas.height = parseFloat((img.height * resize) / 100);
        context.drawImage(img, 0, 0, img.width, img.height, 0, 0, img_canvas.width, img_canvas.height);
        fn(img_canvas.toDataURL());
      }
      img.src = event.target.result;
    };
  }
}
/**
 * Callback function resizeImg()
 * to resize the image on given height/width
 **/
function resizeImg(image_src, imgWidth, imgHeight, fn) {
  var fileReader = new FileReader();
  if (image_src == '' || typeof image_src == 'undefined') {
    fn('blank');
  }
  else {
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
        var img_canvas = document.createElement("canvas");
        var context = img_canvas.getContext("2d");
        img_canvas.width = imgWidth;
        img_canvas.height = imgHeight;
        context.drawImage(img, 0, 0, imgWidth, imgHeight);
        fn(img_canvas.toDataURL());
      }
      img.src = event.target.result;
    };
  }
}
/**
 * Callback function ReplaceResizeImage()
 * to generate image editor
 * with the help of cropit
 **/
function ReplaceResizeImage($imageCropper, image_src, srcHeight, srcWidth, imgWidth, imgHeight, is_popup, callback) {
  //'destroy not working as expected, below line is added.  this will remove already included image'
  $imageCropper.cropit('destroy');
  $imageCropper.find('.cropit-preview-image-container').remove();
  if (is_popup) {
    $imageCropper.addClass('popup-class');
  }
  var originalHeight = parseFloat(imgHeight);
  var originalWidth = parseFloat(imgWidth);
  var screen_height = parseFloat(srcHeight);
  var screen_width = parseFloat(srcWidth);
  if(screen_width > screen_height ) {
    if (originalWidth > screen_width && originalHeight > screen_height ) {
      if (originalWidth >= originalHeight) {
        var previewScale = (originalWidth / screen_width);
        var resize = parseFloat((screen_width * 100) / originalWidth);
      }
      else {
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
  //resize = 100;
  previewHeight = srcHeight;
  previewWidth = srcWidth;
  console.log("previewHeight 2 = "+previewHeight);
  console.log("previewWidth 2 = "+previewWidth);
  resizeImage(image_src, resize, function(resizeDataURL) {
    //console.log("resizeDataURL : "+resizeDataURL);
    $imageCropper.cropit({
      allowDragNDrop: false,
      imageBackground: false,
      imageState: {
        src: resizeDataURL,
      },
      //freeMove: 'true',
      minZoom: 'fill',
      maxZoom: 10,
      smallImage: 'stretch', //'allow',
      width: previewWidth,
      height: previewHeight,
      exportZoom: previewScale,
      onZoomChange: function(){
        // console.log('zoom level changing');
        if(!jQuery('.controls-wrapper button').hasClass('activated')){
          var currentZoom = $imageCropper.cropit('zoom');
          if(currentZoom == 1){
            console.log('no display');
            jQuery('.controls-wrapper button').addClass('invisible');  
          }
          else{
            jQuery('.controls-wrapper button').removeClass('invisible'); 
          }
        }
      },
      onImageLoading: function() {
        // console.log('image is loading...');
      },
      onImageLoaded: function() {
        // console.log('image is loaded callback');
        var customZoomLevel = 1;
        /*var img_width = $imageCropper.cropit('imageSize').width;
        var img_height = $imageCropper.cropit('imageSize').height;
        if(previewWidth > previewHeight){
          customZoomLevel = previewWidth/img_width;
        }
        else {
          customZoomLevel = previewHeight/img_height;
        }
        $imageCropper.cropit('zoom', customZoomLevel); 
        $imageCropper.cropit('exportZoom', customZoomLevel);*/
        callback($imageCropper);
        jQuery(".spinner-border").remove();
        var crop_height = jQuery(".cropit-preview").height();
        crop_height = parseInt(crop_height+120);
        jQuery("#km-image-editor").css("height", crop_height);
        //console.log('crop_height : '+crop_height);
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
  });
}
/**
 * Callback function updateContainerImageCoords()
 * To update added image coords.
 **/
function updateContainerImageCoords(canvasObj = null){
  var obj = (canvasObj == null) ? canvas.getActiveObject() : canvasObj;
  if(obj && obj.type == 'ImageContainer'){
    if(obj.containerImage !== ''){
      var contImg = canvas.getItemById(obj.containerImage);
      if(contImg){
        var widthFactor = obj.width / contImg.width;
        var heightFactor = obj.height / contImg.height;
        var minFactor = Math.min(widthFactor, heightFactor);
        contImg.scale(minFactor);
        canvas.renderAll();
      }
    }
  }
  else {
    canvas.getObjects().forEach(function(obj) {
      if(obj.type == 'ImageContainer'){
        if(obj.containerImage !== ''){
          var contImg = canvas.getItemById(obj.containerImage);
          if(contImg){
            var widthFactor = obj.width / contImg.width;
            var heightFactor = obj.height / contImg.height;
            var minFactor = Math.min(widthFactor, heightFactor);
            contImg.scale(minFactor);
            canvas.renderAll();
          }
        }
      }
    });
  }
  if(loadPageArr.length > 1){
    enabledTemplatePage();
    //var pageID = jQuery('.page-row[page-no=1]').attr('id');
    //layerReordering();
    //switch_page(pageID);
  }
}
/**
 * Callback function imageSRCToBase64()
 * to convert image URL to base64
 * @return base64 src
 **/
function imageSRCToBase64(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
      reader.onloadend = function() {
      callback(reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}
