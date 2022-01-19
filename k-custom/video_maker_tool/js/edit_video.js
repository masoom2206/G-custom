// define video preview area
function cropVideo(data, cropVideoCallback) {
  var scaledimension = previewScaleDimension(data);
  var previewWidth  = scaledimension.previewWidth;
  var previewHeight = scaledimension.previewHeight;
  var previewScale  = scaledimension.previewScale;
  var resizeScale   = scaledimension.resizeScale;
  
  // set scale and dimension
  jQuery('div#media-cropper > div.cropit-preview').attr('data-previeScale', previewScale );
  jQuery('div#media-cropper > div.cropit-preview').css({
    'width': previewWidth,
    'height': previewHeight,
  });
  
  // show video 
 /*jQuery('div#media-cropper > div.cropit-preview').append(jQuery('<video/>', {"id": "vmt-video-editor", "preload": "auto", "autoplay": "autoplay", "controls": "controls", "src": data.media.url, "width": previewWidth, "height": previewHeight, "type": "video/mp4"})); */
  jQuery('div#media-cropper > div.cropit-preview').append('<div class="vmt-video-editor-drag"></div>');
  jQuery('div#media-cropper > div.cropit-preview > .vmt-video-editor-drag').append(jQuery('<video/>', {"id": "vmt-video-editor", "preload": "auto", "src": data.media.url, "type": "video/mp4"}));
    if(jQuery('#video-controls').length){
		jQuery('#video-controls').remove();
	}

   var custom_contr0l = '<div id="video-controls" class="controls" data-state="visible" style="position: absolute;">';
   custom_contr0l +=  '<button id="playpause" type="button" data-state="play">Play/Pause</button>';
   custom_contr0l += '<div class="progress">';
   custom_contr0l +=  '<progress id="progress" value="0" min="0">';
   custom_contr0l +=  '<span id="progress-bar"></span>';
   custom_contr0l +=  '</progress>';
   custom_contr0l +=  '</div>';
  /* custom_contr0l +=  '<button id="mute" type="button" data-state="mute">Mute/Unmute</button>';
   custom_contr0l +=  '<button id="volinc" type="button" data-state="volup">Vol+</button>';
   custom_contr0l +=  '<button id="voldec" type="button" data-state="voldown">Vol-</button>'; */
  // custom_contr0l +=  '<button id="fs" type="button" data-state="go-fullscreen">Fullscreen</button>';
   custom_contr0l += '</div>';
    jQuery('div#media-cropper > div.cropit-preview').append(custom_contr0l);
	
  
  var cropvideo = document.getElementById('vmt-video-editor');
      var b = setInterval(()=>{
        if(cropvideo.readyState >= 3){
		  var v_width   = cropvideo.videoWidth;
		  var v_height  = cropvideo.videoHeight;
		  var ralativeVDOWidth= (v_width * resizeScale) / 100;
		  var ralativeVDOheight = (v_height * resizeScale) / 100;
		  if(previewWidth > previewHeight ){
			if(ralativeVDOheight >= previewHeight ){
			   cropvideo.height = previewHeight;                  
			}else{
			  cropvideo.height = ralativeVDOheight;
			}            
		  }else{
			if(ralativeVDOWidth >= previewWidth ){
				cropvideo.width = previewWidth; 
			}else{
			  cropvideo.width = ralativeVDOWidth;
			}
		  }
            //stop checking every half second
            clearInterval(b);
			cropVideoCallback(1);

        }                   
    },500);

  
}

