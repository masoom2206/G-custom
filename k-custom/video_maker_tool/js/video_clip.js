function updateVideoClip(action, data, callback) {
  var start_time      = data.media.start_time; 
 // var end_time        = parseFloat(data.media.start_time) + parseFloat(data.media.duration);
 //modified end_time by shadab
  var end_time        = parseFloat(data.media.start_time) + parseFloat(data.media.duration_clip);
  var duration        = data.media.duration;
  var duration_clip   = data.media.duration_clip;
 // var zoom          = data.media.zoom;
  var zoom            = 0;
  var volume          = data.media.volume;
  //var volume        = 100;
  maxLeft = 0;
  maxTop  = 0;
  orgzoom = 1;

  var video_clip = '<div id="properties-video-clip"><div class="video-clip-box"><div class="clip-video-thumb"><div class="clip-thumb-box"><img src="'+data.media.thumb_url+'"><div class="overlay"><button type="button" class="video-play round-button" style="display:none" onclick="playvideo(\''+data.media.url+'\', \''+duration+'\' )"></button></div></div></div><div class="clip-video-title">'+data.media.asset_name+'</div><div class="clip-text">Video Clip</div></div><div class="range-preset-control"><div class="preset-icon"><img src="/modules/custom/video_maker_tool/images/image-thumb-icon.png" width="15"/></div><div class="zoom-range-wrap range-wrap range-preset"><input type="range" id="zoom" name="zoom" data-default="0" min="0" max="2" value="'+zoom+'" step="0.01" class="range"><output class="bubble"></output></div><div class="preset-icon"><img src="/modules/custom/video_maker_tool/images/image-thumb-icon.png" width="30"/></div><div class="blut-tool-alert invisible"> <i class="fas fa-exclamation-triangle"></i><span>Some blurring may occur.</span></div></div><div class="trimmed-duration clearfix" data-rid="'+data.media.rid+'"><div id="trimmed-duration-range" ></div><div class="vctd">Trimmed Duration: <span id="trimmed-duration">'+secondsToMSF(duration_clip)+'</span></div><input type="hidden" name="start_time" id="start-time" value="'+start_time+'"><input type="hidden" name="end_time" id="end-time" value="'+end_time+'"><input type="hidden" name="clip_duration" id="clip-duration" value="'+duration_clip+'"></div><div class="range-volume-control"><div class="volume-icon"><i class="fa fa-volume-up"></i></div><div class="volume-range-wrap range-wrap range-volume"><input type="range" id="volume" name="volume" data-default="100" min="0" max="100" value="'+volume+'" step="1" class="range"><output class="bubble"></output></div><div class="blut-tool-alert invisible"> <i class="fas fa-exclamation-triangle"></i><span> put some meaningfull text.</span></div></div></div><div class="hidden-rawdata-clip d-none"><textarea id="cropped-vdo" name="cropped-vdo" rows="4"></textarea></div></div>';
  jQuery("div#properties-clip-content-section").html(video_clip);
  
  
  // zoom range
  const allThumbRanges = document.querySelectorAll("div.zoom-range-wrap");
  allThumbRanges.forEach(wrap => {
    const range = wrap.querySelector("input.range");
    const bubble = wrap.querySelector("output.bubble");
    range.addEventListener("input", () => {
      setBubble(range, bubble, 'zoom');
    });
    //setBubble(range, bubble, 'zoom');
  });
  
  // volume range
  const allVolumeRanges = document.querySelectorAll("div.volume-range-wrap");
  allVolumeRanges.forEach(wrap => {
    const range = wrap.querySelector("input.range");
    const bubble = wrap.querySelector("output.bubble");
    range.addEventListener("input", () => {
      setBubble(range, bubble, 'volume');
    });
    //setBubble(range, bubble, 'volume');
  });
  
  // trimmed duration
  jQuery( "div#trimmed-duration-range" ).slider({
    range: true,
    min: 0,
    max: duration*1000,
    step: 100,
    values: [ start_time*1000, end_time*1000 ],
    create: function( event, ui ) {
      var handle = jQuery(this).find('.ui-slider-handle');
      var bubble = jQuery('<output class="bubble"></output>');
      handle.append(bubble);
    },
    slide: function( event, ui ) {
      var x = parseFloat(ui.values[0])/1000;
      var y = parseFloat(ui.values[1])/1000;
      var t = (y-x).toFixed(1);
      //identify slider handle, this can't identify if start and end slider has same value.
      if(ui.values[0] == ui.value){
        // start slider
        // set video head as per start duration slider
        var video = document.getElementById('vmt-video-editor');
        video.currentTime = x;
      }

      // show bubble and trimmed duration
      jQuery('span.ui-slider-handle:first output.bubble').html(secondsToMSF(x));
      jQuery('span.ui-slider-handle:last output.bubble').html(secondsToMSF(y));
      jQuery('span.ui-slider-handle output.bubble').show();
      jQuery("span#trimmed-duration").html(secondsToMSF(t));
      // save these values into database
      jQuery("input#clip-duration").val(t);
      jQuery("input#start-time").val(x);
      jQuery("input#end-time").val(y);
	  jQuery('#cropped-vdo').val(JSON.stringify(getExportedVideoProperties()));
	  // update estimated duration
	  var selectedMid = jQuery(this).parents('.trimmed-duration').attr('data-rid');
	  updateClipDurationFromSlider(selectedMid , t, function(result){
		console.log('updated estimated duration');      
	  });
	  
    },
    stop: function (event, ui) {
      VideoClipPropertiesSave(); 
    }
  });
    // crop Video
  cropVideo(data, function(result) {
	  if(data.media.crop_params){
		 var currntZoomSettings = data.media.crop_params.scale - 1;
		 jQuery('#zoom').val(currntZoomSettings);
		jQuery('.vmt-video-editor-drag').css('left',data.media.crop_params.left);
		jQuery('.vmt-video-editor-drag').css('top',data.media.crop_params.top);
		jQuery('#cropped-vdo').val(JSON.stringify(getExportedVideoProperties()));
        jQuery('#zoom').trigger('input');		
	  }
	  var video = document.getElementById('vmt-video-editor');
	  if(isVideoHasAudio(video)){
		jQuery('#volume').val(data.media.volume);
        jQuery('#volume').removeClass('no-audio-disable-slider');		
	  }else{
		jQuery('#volume').val(0); 
        jQuery('#volume').addClass('no-audio-disable-slider');
	  }
	  jQuery('#volume').trigger('input');
	  callback(1);
   });
	var v = document.getElementsByTagName('video')[0];
	var previewWidth = parseFloat(jQuery('.cropit-preview').css('width'));
	var previewHeight = parseFloat(jQuery('.cropit-preview').css('height'));

	var supportsVideo = !!document.createElement('video').canPlayType;

	if (supportsVideo) {
		// Obtain handles to main elements
		//var videoContainer = document.getElementById('videoContainer');
		var video = document.getElementById('vmt-video-editor');
    // set video start time
    video.currentTime = start_time;

		var videoControls = document.getElementById('video-controls');

		// Hide the default controls
		video.controls = false;

		// Display the user defined video controls
		videoControls.setAttribute('data-state', 'visible');

		// Obtain handles to buttons and other elements
		var playpause = document.getElementById('playpause');
		//var stop = document.getElementById('stop');
		var mute = document.getElementById('mute');
		var volinc = document.getElementById('volinc');
		var voldec = document.getElementById('voldec');
		var progress = document.getElementById('progress');
		var progressBar = document.getElementById('progress-bar');
		//var fullscreen = document.getElementById('fs');

		// If the browser doesn't support the progress element, set its state for some different styling
		var supportsProgress = (document.createElement('progress').max !== undefined);
		if (!supportsProgress) progress.setAttribute('data-state', 'fake');

         var alterVolumeSlider = function(vol){
			 if(vol == 0){
				video.muted = true; 
			 }
			 else{
				video.muted = false; 
				video.volume = vol;
			 }
		 }
		 
		// Only add the events if addEventListener is supported (IE8 and less don't support it, but that will use Flash anyway)
		if (document.addEventListener) {
			// Wait for the video's meta data to be loaded, then set the progress bar's max value to the duration of the video
			video.addEventListener('loadedmetadata', function() {
				progress.setAttribute('max', video.duration);
			});

			// Changes the button state of certain button's so the correct visuals can be displayed with CSS
			var changeButtonState = function(type) {
				// Play/Pause button
				if (type == 'playpause') {
					if (video.paused || video.ended) {
						playpause.setAttribute('data-state', 'play');
					}
					else {
						playpause.setAttribute('data-state', 'pause');
					}
				}
				// Mute button
				else if (type == 'mute') {
					mute.setAttribute('data-state', video.muted ? 'unmute' : 'mute');
				}
			} 

			// Add event listeners for video specific events
			video.addEventListener('play', function() {
				changeButtonState('playpause');
			}, false);
			video.addEventListener('pause', function() {
				changeButtonState('playpause');
			}, false);

			// Add events for all buttons			
			playpause.addEventListener('click', function(e) {
				if (video.paused || video.ended) video.play();
				else video.pause();
			});			

		

			// As the video is playing, update the progress bar
			video.addEventListener('timeupdate', function() {
				// For mobile browsers, ensure that the progress element's max attribute is set
				if (!progress.getAttribute('max')) progress.setAttribute('max', video.duration);
				progress.value = video.currentTime;
				progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
        if(video.currentTime >= parseFloat(jQuery('#end-time').val()) ){
          video.pause();
        }
			});
			// React to the user clicking within the progress bar
			/*progress.addEventListener('click', function(e) {
				//var pos = (e.pageX  - this.offsetLeft) / this.offsetWidth; // Also need to take the parent into account here as .controls now has position:relative
				var pos = (e.pageX  - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
				video.currentTime = pos * video.duration;
			});*/
        } 
	    	callback(1);
	 }
	    jQuery('#properties-clip-content-section').on('input', '#volume', function() {
			var volume = jQuery(this).val();
			var vol = parseFloat(volume/100);
			if(vol <= 1.0){
				if(vol == 0){
				  jQuery(this).parents('#properties-clip-content-section').find('.volume-icon').empty().append('<i class="fa fa-volume-mute"></i>');
				} 
				else{
					jQuery(this).parents('#properties-clip-content-section').find('.volume-icon').empty().append('<i class="fa fa-volume-up"></i>');
				}
				jQuery(this).parents('.range-volume-control').find('.blut-tool-alert').addClass('invisible');
            }
			else{
			  jQuery(this).parents('#properties-clip-content-section').find('.volume-icon').empty().append('<i class="fa fa-volume-up"></i>');
              jQuery(this).parents('.range-volume-control').find('.blut-tool-alert').removeClass('invisible');
			  vol = 1.0;
			}
			alterVolumeSlider(vol);
			jQuery('#cropped-vdo').val(JSON.stringify(getExportedVideoProperties()));
		});
         var vdoDrag = jQuery('.vmt-video-editor-drag').draggable({
           cursor: "move",
          start: function(event, ui) {},
          stop: function() { 
			jQuery('#cropped-vdo').val(JSON.stringify(getExportedVideoProperties()));
		  },
          drag: function( event, ui ) { 
			   if( ui.position.left > maxLeft ){
                  ui.position.left = maxLeft;
               }
			   else if(Math.abs(ui.position.left) > maxLeft ){
				  ui.position.left = -Math.abs(maxLeft);
			   }
			   if( ui.position.top > maxTop ){
				 ui.position.top = maxTop;  
			   }
			   else if(Math.abs(ui.position.top) > maxTop ){
				 ui.position.top = -Math.abs(maxTop);
			   }
           }
    });

}
var maxLeft = 0;
var maxTop = 0;
var orgzoom = 1;
var relativeVideoWidth;
var relativeVideoHeight;

/* Array of possible browser specific settings for transformation */
var properties = ['transform', 'WebkitTransform', 'MozTransform', 'msTransform', 'OTransform'],
  prop = properties[0];
/* Iterators and stuff */
var i, j, t;
/* Find out which CSS transform the browser supports */
for (i = 0, j = properties.length; i < j; i++) {
	prop = properties[i];
	break;
}
jQuery('#properties-clip-content-section').on('input', '#zoom', function() {
        var scale = jQuery(this).val();
		if(scale == 0){
			jQuery(this).parents('.range-preset-control').find('.blut-tool-alert').addClass('invisible');
		}else{
		  jQuery(this).parents('.range-preset-control').find('.blut-tool-alert').removeClass('invisible');	
		}
        if (orgzoom == 1) {
            orgzoom = orgzoom + parseFloat(jQuery(this).val());
          } else {
            var nextZoom = parseFloat(jQuery(this).val());
            var previous_zoom = orgzoom - 1;
            if (nextZoom >= previous_zoom) {
              //increase zoom
              orgzoom = orgzoom + parseFloat(nextZoom - previous_zoom);
            } else {
              // decrease zoom
              orgzoom = orgzoom - parseFloat(previous_zoom - nextZoom);
            }
          }
		    jQuery('.vmt-video-editor-drag').css(prop,'scale(' + orgzoom + ')' );
			//var v = document.getElementsByTagName('video')[0];
			//v.style[prop] = 'scale(' + orgzoom + ')';
			var previewWidth = parseFloat(jQuery('.cropit-preview').css('width'));
			var previewHeight = parseFloat(jQuery('.cropit-preview').css('height'));
			maxLeft = (previewWidth*orgzoom - previewWidth)/2;
            maxTop = (previewHeight*orgzoom - previewHeight)/2;
			jQuery('#cropped-vdo').val(JSON.stringify(getExportedVideoProperties()));
			console.log(JSON.stringify(getExportedVideoProperties()));
});
        // getVideoEditorOffset
        function getVideoEditorOffset(){
           var offsetValue = {};
           var offset = jQuery('#vmt-video-editor').offset();
           var xPos = (offset.left) - jQuery('.vmt-video-editor-drag').offsetParent().offset().left;
           var yPos = (offset.top) - jQuery('.vmt-video-editor-drag').offsetParent().offset().top;
           offsetValue.xPos = xPos ;
           offsetValue.yPos = yPos ;
          return offsetValue; 
        }
		function getExportedVideoProperties(){
             var exportedVideo = {};
             var video = document.getElementById('vmt-video-editor');
             exportedVideo['original_vdo_width'] = video.videoWidth;
             exportedVideo['original_vdo_height'] = video.videoHeight;
			 exportedVideo['relative_vdo_width'] = jQuery('#vmt-video-editor').width();
			 exportedVideo['relative_vdo_height'] = jQuery('#vmt-video-editor').height();
			 exportedVideo['scale'] = orgzoom;
           // exportedVideo['preset'] = jQuery('select#mediaPreset').val();
            //exportedVideo['original_fid'] = jQuery('#video-editor-pane').attr('data-fid');
           // exportedVideo['curruntZoom'] = zoom;
            exportedVideo['previewScale'] = jQuery('.cropit-preview').attr('data-previescale');
            exportedVideo['bg-color'] = '#000';
            var relativeStageWidth = parseFloat(jQuery(".cropit-preview").css("width"))* exportedVideo['previewScale'];
            var relativeStageHeight = parseFloat(jQuery(".cropit-preview").css("height"))* exportedVideo['previewScale'];
            exportedVideo['preset_dimensions'] = relativeStageWidth+ 'X' + relativeStageHeight;
            exportedVideo['offset'] =  getVideoEditorOffset();
			exportedVideo['left'] = jQuery('.vmt-video-editor-drag').css('left');
			exportedVideo['top'] = jQuery('.vmt-video-editor-drag').css('top');
            return exportedVideo;
        }
		
		 function isVideoHasAudio(video){
			 console.log('ffff');
			var hasAudio = 1;
			if (typeof video.webkitAudioDecodedByteCount !== "undefined") {
				// non-zero if video has audio track
				if (video.webkitAudioDecodedByteCount > 0){
				 hasAudio = 1;
			     return hasAudio;
				}
				else{
			     hasAudio = 0;
			     return hasAudio;
				}
				 
			  }
			  else if (typeof video.mozHasAudio !== "undefined") {
				// true if video has audio track
				if (video.mozHasAudio){
				 // console.log("video has audio");
			     hasAudio = 1;return hasAudio;
				}
				else{
				 // console.log("video doesn't have audio");
			     hasAudio = 0;return hasAudio;
				}
			  }
			  else{
				  return hasAudio;
				console.log("can't tell if video has audio");  
			  }
		 }	  

