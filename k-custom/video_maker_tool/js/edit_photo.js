function cropitPhoto(data, cropitPhotoCallback) {
  var scaledimension = previewScaleDimension(data);
  var previewWidth  = scaledimension.previewWidth;
  var previewHeight = scaledimension.previewHeight;
  var previewScale  = scaledimension.previewScale;
  resizeImage(data.media.src, scaledimension.resizeScale, function(resizeDataURL) {
  jQuery('div#km-video-maker-tool').cropit({
    allowDragNDrop: false,
    imageBackground: false,
    imageState: {
      src: resizeDataURL            
    },
    minZoom: 'fill',
    maxZoom: 10,
    smallImage: 'allow',
    width: previewWidth,
    height: previewHeight,
    exportZoom: previewScale,
    onImageLoading: function() {
      //console.log('image is getting load...');
    },
    onImageLoaded: function() {
	  jQuery('#cropped-img').val(JSON.stringify(getExportedPhotoProperties()));
	  cropitPhotoCallback(1);
    },
    onOffsetChange: function(object){
		jQuery('#cropped-img').val(JSON.stringify(getExportedPhotoProperties()));
		//console.log('offset changed');
	},	
  });

  if(resizeDataURL == 'blank'){
	 cropitPhotoCallback(0); 
  }
  });
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
function getExportedPhotoProperties(){
	var updated_media_data = {};
	var imageAfterCopped = {};
	imageAfterCopped['bgColor'] = '#000'; 
    imageAfterCopped['currentZoom'] = jQuery('#km-video-maker-tool').cropit('zoom');
    imageAfterCopped['rotation'] = 0;
    imageAfterCopped['offset'] = jQuery('#km-video-maker-tool').cropit('offset');
    imageAfterCopped['exportZoom'] = jQuery('#km-video-maker-tool').cropit('exportZoom');	
    updated_media_data['preset_dimension'] = jQuery('#finished-size').text();
	updated_media_data['imageAfterCopped'] = imageAfterCopped;
	 console.log('updated_media_data2'); 
	 
	return updated_media_data;
}














