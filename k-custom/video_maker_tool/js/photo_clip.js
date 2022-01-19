function updatePhotoClip(action, data, callback) {
  var clip_zoom = data.media.clip_zoom;
  var noZoom = (clip_zoom == 'no-zoom') ? 'checked' : '';
  var zoomIn = (clip_zoom == 'zoom-in') ? 'checked' : '';
  var zoomOut = (clip_zoom == 'zoom-out') ? 'checked' : '';
  var zoomDisabled = ((data.media.duration_clip) < 5) ? " disabled" : "";
  var photo_clip = '<div id="properties-photo-clip"><div class="photo-clip-box"><div class="clip-photo-thumb" id="animated-thumbnial"><div class="clip-thumb-box" data-exthumbimage="'+data.media.modal_url+'" data-src="'+data.media.modal_url+'"><img src="'+data.media.thumb_url+'"><div class="overlay"><button type="button" class="preview-icon custom-preview-icon" onclick="imagepreview()"></button></div></div></div><div class="clip-photo-title">'+data.media.asset_name+'</div><div class="clip-text">Photo Clip</div></div><div class="range-preset-control"><div class="preset-icon"><img src="/modules/custom/video_maker_tool/images/image-thumb-icon.png" width="15"></div><div class="zoom-range-wrap range-wrap range-preset"><input type="range" id="zoom-img" name="zoom-img" class="range cropit-image-zoom-input" /><output class="bubble"></output></div><div class="preset-icon"><img src="/modules/custom/video_maker_tool/images/image-thumb-icon.png" width="30"></div></div><div class="clip-duration">Clip Duration: <input type="text" name="clip_duration" data-rid="'+data.media.rid+'" class="duration" value="'+secondsToMSF(data.media.duration_clip)+'"></div><div class="video-clip-zoom"><span class="zoom-caption">Zoom&nbsp;:</span><span class="zoom-no"><input type="checkbox" class="form-check-input" name="video-clip-zoom-no" id="video-clip-zoom-no" data-rid="'+data.media.rid+'" value="no-zoom" '+noZoom+zoomDisabled+'/><label class="form-check-label" for="video-clip-zoom-no">No zoom</label></span><span class="zoom-in"><input type="checkbox" class="form-check-input" name="video-clip-zoom-in" id="video-clip-zoom-in" data-rid="'+data.media.rid+'" value="zoom-in" '+zoomIn+zoomDisabled+' /><label class="form-check-label" for="video-clip-zoom-in">Zoom in</label></span><span class="zoom-out"><input type="checkbox" class="form-check-input" name="video-clip-zoom-out" id="video-clip-zoom-out" data-rid="'+data.media.rid+'" value="zoom-out" '+zoomOut+zoomDisabled+' /><label class="form-check-label" for="video-clip-zoom-out">Zoom out</label></span></div><div class="d-none"><textarea name="cropped-img" id="cropped-img" rows="4"></textarea></div></div>';
  jQuery("div#properties-clip-content-section").html(photo_clip);
  
  const allThumbRanges = document.querySelectorAll("div.zoom-range-wrap");
  allThumbRanges.forEach(wrap => {
    const range = wrap.querySelector("input.range");
    const bubble = wrap.querySelector("output.bubble");
    range.addEventListener("input", () => {
      setBubble(range, bubble, 'zoom');
    });
    //setBubble(range, bubble, 'zoom');
  });
  
  // crop photo
  cropitPhoto(data, function(result) {
	// set cropped parameters, if any
	 if(result == 1){
		 if(data.media.crop_params){
			var currentZoom = data.media.crop_params.imageAfterCopped.currentZoom; 
			var x_pos = data.media.crop_params.imageAfterCopped.offset.x; 
			var y_pos = data.media.crop_params.imageAfterCopped.offset.y; 
			jQuery('div#km-video-maker-tool').cropit('zoom', currentZoom);
            jQuery('div#km-video-maker-tool').cropit('offset', { x: x_pos, y: y_pos }); 
		 }
	 }
	 callback(1);
   });

}



