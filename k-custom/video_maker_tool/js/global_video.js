// create preview area square 
var uid = drupalSettings.user_id;
var team_query = drupalSettings.team_query;
function createPreviewArea(preset_id, action) {
  jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');	
  var vid  = jQuery("input#video-id").val();
  var mid = jQuery("input#selected-mid").val();
  var rid = jQuery("input#selected-rid").val();
  jQuery.ajax({
    url: '/tools/video/maker/preset-media',
    data: {'preset_id': preset_id, 'vid': vid, 'mid': mid, 'rid': rid},
    type: 'POST',
    dataType: 'json', 
    success:function(data) {
		console.log(data);
      var originalHeight = parseFloat(data.preset.height);
      var originalWidth = parseFloat(data.preset.width);      
      jQuery("div#preview-area-actions").show();
      jQuery("textarea#transcoder-specs-desc").val(data.preset.transcoder_specs);       
      jQuery("div#finished-size").html(originalWidth+'w X '+originalHeight+'h');
      //jQuery("div#estimated-duration").html('Estimated Duration: 00:00');
      /*  
      var durationMSP = secondsToMSF(data.media.duration);
       if(data.media.type == "video"){
        jQuery("div#estimated-duration").html('Estimated Duration:'+ durationMSP); 
       }else{
         jQuery("div#estimated-duration").html('Estimated Duration: 00:00');
       }
      */
      
      jQuery("input#media-type").val(data.media.type);
      // transition tab
      if(parseInt(data.media.transition_option) > 0){
        var src = jQuery("input#transition-option-"+data.media.transition_option).attr('data-src');
        jQuery("div#transition-preview").html('<img src="'+src+'" border="0">');
      }
      if(parseInt(data.media.is_first_clip_transition) == 1){
        jQuery("input#first-clip-transition").prop('checked', true);
      }else{
        jQuery("input#first-clip-transition").prop('checked', false);
      }
      if(parseInt(data.media.is_last_clip_transition) == 1){
        jQuery("input#last-clip-transition").prop('checked', true);
      }else{
        jQuery("input#last-clip-transition").prop('checked', false);
      }
      if(parseInt(data.media.is_opt_out_transition) == 1){
        jQuery("input#opt-out-transition").prop('checked', true);
      }else{
        jQuery("input#opt-out-transition").prop('checked', false);
      }
      jQuery("select#transition-duration").val(parseFloat(data.media.transition_duration));
      jQuery("input#transition-option-"+data.media.transition_option).prop('checked', true);
      
      // destroy cropit
      jQuery('#km-video-maker-tool').cropit('destroy');
      jQuery('#media-cropper').find('.cropit-preview-image-container').remove();
      // destroy cropit
      jQuery(".vmt-video-editor-drag").remove();
      jQuery("#video-controls").remove();
      // crop photo or video
      if(data.media.type == 'video') {
        updateVideoClip(action, data, function(result) {
          jQuery('#overlay').remove();
        });
      }else{
        updatePhotoClip(action, data, function(result) {
          jQuery('#overlay').remove();
        });
      }
    }
  });  
}

// populate transition 
function populateTransition() {
  var vid  = jQuery("input#video-id").val();
  var mid = jQuery("input#transition-mid").val();
  var rid = jQuery("input#transition-rid").val();
  jQuery.ajax({
    url: '/tools/video/maker/populate/transition',
    data: {'vid': vid, 'mid': mid, 'rid': rid},
    type: 'POST',
    dataType: 'json', 
    success:function(data) {
      if(parseInt(data.transition_option) > 0){
        var src = jQuery("input#transition-option-"+data.transition_option).attr('data-src');
        jQuery("div#transition-preview").html('<img src="'+src+'" border="0">');
      }
      if(parseInt(data.is_first_clip_transition) == 1){
        jQuery("input#first-clip-transition").prop('checked', true);
      }else{
        jQuery("input#last-clip-transition").prop('checked', false);
      }
      if(parseInt(data.is_last_clip_transition) == 1){
        jQuery("input#last-clip-transition").prop('checked', true);
      }else{
        jQuery("input#last-clip-transition").prop('checked', false);
      }
      if(parseInt(data.is_opt_out_transition) == 1){
        jQuery("input#opt-out-transition").prop('checked', true);
      }else{
        jQuery("input#opt-out-transition").prop('checked', false);
      }
      jQuery("select#transition-duration").val(parseFloat(data.transition_duration));
      jQuery("input#transition-option-"+data.transition_option).prop('checked', true);
    }
  });  
}

//add to story board
function getClipHTML(mid, imgsrc, duration, clone){
  var rid = getRandomIntInclusive(10000, 99999);
  var clipid = mid+'-'+rid;
  var zoomEffect = 'no-zoom';
  var thumb_image_html = '<li class="list-inline-item added-media" id="story-'+clipid+'-box"><div class="story-board-box"><div class="story-box" id="media-'+clipid+'-box"><img class="clip-item" src="'+imgsrc+'" border="0"><div class="story-act-button"><div class="btn-group dropup"><span class="fa-stack dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fas fa-square fa-stack-2x"></i><i class="fas fa-ellipsis-h fa-stack-1x fa-inverse"></i></span><div class="dropdown-menu dropdown-menu-right"> <a href="javascript:void(0);" class="dropdown-item removeclip" clipid="'+clipid+'"><span class="fas fa-trash-alt removeclip"></span>Remove Clip</a><a href="javascript:void(0);" class="dropdown-item cloneclip" clipid="'+clipid+'"><span class="far fa-clone"></span>Clone Clip</a></div></div></div><input type="hidden" name="mids['+rid+']" value="'+mid+'"/><input type="hidden" class="clip-duration" name="media_duration['+rid+']" data-rid="'+rid+'" value="'+duration+'"/><input type="hidden" class="clip-zoom-effect" name="clip_zoom['+rid+']" data-rid="'+rid+'" value="'+zoomEffect+'"/></div><div class="button-transition" id="transition-'+clipid+'-box"><img src="/modules/custom/video_maker_tool/images/transition.png" border="0"/><input type="hidden" name="transition['+rid+']" value="'+mid+'"></div></div></li>';

  return thumb_image_html;
}

//add to story board
function previewScaleDimension(data){
  var scaledimension = {}; 
  // on the page, image dimensions are also be scaled based on image editor dimensions to maintain aspect ratio.
  var screen_width = parseInt(jQuery("div#media-crop-preview-box").width());
  var screen_height = 400;
  
  var originalHeight  = parseFloat(data.preset.height);
  var originalWidth   = parseFloat(data.preset.width);
  
  var previewScale  = 1;
  var resizeScale   = 100;
  if (screen_width > screen_height) {
    if ((originalWidth > screen_width) && (originalHeight > screen_height)) {
      if (originalWidth >= originalHeight) {
        previewScale  = (originalWidth / screen_width);
        resizeScale   = parseFloat((screen_width * 100) / originalWidth);
      } else {
        previewScale  = (originalHeight / screen_height);
        resizeScale   = parseFloat((screen_height * 100) / originalHeight);
      }
      var previewHeight = originalHeight / previewScale;
      var previewWidth = originalWidth / previewScale;
    } else if (originalWidth > screen_width) {
      previewScale  = (originalWidth / screen_width);
      resizeScale   = parseFloat((screen_width * 100) / originalWidth);
      var previewHeight = originalHeight / previewScale;
      var previewWidth = originalWidth / previewScale;
    } else if (originalHeight > screen_height) {
      previewScale  = (originalHeight / screen_height);
      resizeScale   = parseFloat((screen_height * 100) / originalHeight);
      var previewHeight = originalHeight / previewScale;
      var previewWidth = originalWidth / previewScale;
    } else {
      var previewHeight = originalHeight;
      var previewWidth = originalWidth;
    }
  } else {
    previewScale = (originalWidth / screen_width);
    resizeScale = parseFloat((screen_width * 100) / originalWidth);
    var previewHeight = originalHeight / previewScale;
    var previewWidth = originalWidth / previewScale;
  }
  
  scaledimension.previewScale   = previewScale;
  scaledimension.resizeScale    = resizeScale;
  scaledimension.previewHeight  = previewHeight.toFixed(2);
  scaledimension.previewWidth   = previewWidth.toFixed(2);
  
  return scaledimension;
}

//show large image on modal window
function imagepreview(){
  var $lg = jQuery("[id^=animated-thumbnial]");
  var gallery = $lg.lightGallery({
    width: '640px',
    height: '490px',
    addClass: 'vmt-clip-lg',
    counter: false,
    download: false,
    enableSwipe: false,
    enableDrag: false,
    share: false,
    autoplay: false,
    thumbMargin : 20,
    autoplayControls: false,
    fullScreen: false,
    zoom: false,
    actualSize: false,
    toogleThumb: false,
    thumbnail:true,           
    thumbWidth: 85,  
    thumbContHeight: 95,
    exThumbImage: 'data-exthumbimage',              
  });
  
  gallery.on('onCloseAfter.lg',function(event, index, fromTouch, fromThumb){
    try{gallery.data('lightGallery').destroy(true);}catch(ex){};
  });
}  

// set default value on slider dbl click
jQuery("#properties-clip-content-section, #properties-soundtrack-content-section").on("dblclick", ".range", function() {
	var default_value = jQuery(this).attr('data-default');
	jQuery(this).val(default_value);
	jQuery(this).trigger('input');
    var bubble = this.closest(".range-wrap").querySelector("output.bubble");
	setBubble(this, bubble, 'zoom');
});

//The maximum is inclusive and the minimum is inclusive
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); 
}

// add leading zero 
function addLeadingZeros(n, length){
  var str = (n > 0 ? n : -n) + "";
  var zeros = "";
  for (var i = length - str.length; i > 0; i--)
    zeros += "0";
  zeros += str;
  return n >= 0 ? zeros : "-" + zeros;
}

// seconds conversion
function hmsToSecondsOnly(hms) {
  var t = hms.split(':'); // split it at the colons
  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  var seconds = (+t[0]) * 60 * 60 + (+t[1]) * 60 + (+t[2]);
  return seconds;
}

// seconds conversion
function secondsToMSF(t) {
  var t = parseFloat(t);
  var m = Math.floor(t/60);
  var s = Math.floor(t - m*60);
  var f = (t*10)%10;
  var msf = addLeadingZeros(m, 2)+':'+addLeadingZeros(s, 2)+'.'+f;
  return msf;
}

function setBubble(range, bubble, type) {
  var val = range.value;
  var min = range.min ? range.min : 0;
  var max = range.max ? range.max : 100;
 
  var percentValue;
  if(bubble.closest(".range-volume")){
	  percentValue = Math.round((val*100)/max)*1; 
  }else{
     percentValue = Math.round((val*100)/max)*2;
  }
  bubble.style.display='block';
  const newVal = Number(((val - min) * 100) / (max - min));
  bubble.innerHTML = percentValue+'%';
  // Sorta magic numbers based on size of the native UI thumb
  bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
}

/**
 * Callback function productCanvasPageImage()
 * to convert canvas page objects to Image
 **/
function renderVideoProduct(product_name){
  var video_id = jQuery('input#video-id').val();
  var modal_title = 'Render '+product_name;
  var type = 'Video';
  if(jQuery('div#video-product-render').hasClass('d-none')){
    jQuery('div#video-product-render').removeClass('d-none').addClass('d-block');
  }else{
    var render_form = jQuery('<div/>', {"class": "wrap-km-render-block"})
    .append(
      jQuery('<div/>', {"class": "km-render-group title-field"}).append(
        jQuery('<label/>', {"class": "title-original", text: "Title"}).append(
          jQuery('<span/>', {"class": "required", text: "*"})
        ),
        jQuery('<input/>', {'type': 'text', "class": "form-control title-original", "name": "title", "id": "title-original", "readonly": "readonly"}),
      ),
      jQuery('<div/>', {"class": "km-render-group dimensions-field"}).append(
        jQuery('<label/>', {"class": "km-render-Dimensions", 'html': "Dimensions:&nbsp;"}).append(
        jQuery('<span/>', {"class": "og-dim"}))
      ),
      jQuery('<div/>', {"class": "km-render-group type-field"}).append(
        jQuery('<label/>', {"class": "km-render-type", 'html': "Type:&nbsp;"}).append(
        jQuery('<span/>', {"class": "og-dim", text: type}))
      ),
      jQuery('<div/>', {"class": "km-render-group archieve-field"}).append(
        jQuery('<div/>', {"class": "checkbox"}).append(
          jQuery('<label/>', {"class": "checkbox-container"}).append(
            jQuery('<input/>', {'type': 'checkbox', "class": "box-check", "name": "archieve", "id":"km-render-archieve", "value":"1", "checked": false}),
            jQuery('<label/>', {"class":"checkb", "for": "km-render-archieve"}),
            jQuery('<span/>', {"class": "custom-label ml-2", text: "Archived"}),
          )
        )
      ),
      jQuery('<div/>', {"class": "km-render-group tags-field"}).append(
        jQuery('<span/>', {"class": "d-none tags"}),
        jQuery('<label/>', {"class": "tags", text: "Tags"}),
        jQuery('<input/>', {'type': 'text', "class": "form-control tags video-maker-tags", "name": "tags", "id": "km-video-render-tags"}),
      ),
      jQuery('<div/>', {"class": "km-render-group description-field"}).append(
        jQuery('<label/>', {"class": "description", text: "Description"}),
        jQuery('<textarea/>', {"name": "description", "class": "form-control description", "aria-label": "With textarea", text:""}),
      ),
      jQuery('<div/>', {"class": "form-group media-kit-field"}).append(
        jQuery('<label/>', {"class": "media-kit", text:"Assigned Media Kits"}),
        jQuery('<div/>', {"class": "wrapped-all-checkboxes"}),
      ),
      jQuery('<input/>', {"type": "hidden", "name": "render_video_id", "id": "render-video-id", "value": video_id}),
    );
    // open modal form
    kmVideoModalWindow(render_form);
    jQuery('.g-dialog-container .g-dialog-header').text(modal_title);
    
    //Add functionality for tags field
    setTimeout(function(){ 
      jQuery('input.video-maker-tags').tagsInput({
        minChars: 2,
        unique: true,
        'autocomplete': {
          source: '/getTags/' + uid,
        },
        onAddTag: function(fld, tag) {
          if (jQuery('.tagsinput span.tag').length) {
            jQuery('.tagsinput input.tag-input').attr('placeholder', '');
          } else {
            jQuery('.tagsinput input.tag-input').attr('placeholder', 'Add a tag');
          }
        },
        onRemoveTag: function(fld, tag) {
          if (jQuery('.tagsinput span.tag').length) {
            jQuery('.tagsinput input.tag-input').attr('placeholder', '');
          } else {
            jQuery('.tagsinput input.tag-input').attr('placeholder', 'Add a tag');
          }
        },
      });
    }, 50);
  
  
    // Add user media kit list in "Assigned Media Kits" section
    var queryString = {"media_kit": "media_kit", "video_id": video_id};
    if(team_query.gid){
      queryString = {"media_kit": "media_kit", "video_id": video_id, 'team': team_query.gid, 'uid': team_query.muid};
    }
    //jQuery.post('/tools/video/maker/render/edit', {"media_kit": "media_kit", "video_id": video_id}, function(response) {
    jQuery.post('/tools/video/maker/render/edit', queryString, function(response) {
      if(response){
        var originalHeight = parseFloat(response.preset.height);
        var originalWidth = parseFloat(response.preset.width);
        jQuery("label.km-render-Dimensions span.og-dim").html(originalWidth+'w X '+originalHeight+'h');
        // media kits
        jQuery.each(response.media_kit, function(key, val){
          var checked = 0;
          if(response.render_data != null){
            if((response.render_data.media_kits != null) && (jQuery.inArray(val.nid, response.render_data.media_kits) >= 0)){
              checked = 1;
            }
          }
          
          if(val.title == 'All Media Assets'){
            jQuery('<label/>', {"class": "checkbox-container"}).append(
              jQuery('<input/>', {'type': 'checkbox', "class": "box-check", "name":"media_kits[]", "id":"km-media-"+val.nid, "value":val.nid, "checked": true, "disabled":true}),
              jQuery('<label/>', {"class":"checkb", "for": "km-media-"+val.nid}),
              jQuery('<span/>', {"class": "custom-label ml-2", text: val.title}),
              jQuery('<input/>', {'type': 'checkbox', "class": "box-check d-none", "name":"media_kits[]", "id":"km-media-all-"+val.nid, "value":val.nid, "checked": true}),
            ).appendTo('.wrapped-all-checkboxes');
          }
          else if(checked == 1){
            jQuery('<label/>', {"class": "checkbox-container"}).append(
              jQuery('<input/>', {'type': 'checkbox', "class": "box-check", "name":"media_kits[]", "id":"km-media-"+val.nid, "value":val.nid, "checked": true, "disabled":false}),
              jQuery('<label/>', {"class":"checkb", "for": "km-media-"+val.nid}),
              jQuery('<span/>', {"class": "custom-label ml-2", text: val.title}),
            ).appendTo('.wrapped-all-checkboxes');
          }
          else {
            jQuery('<label/>', {"class": "checkbox-container"}).append(
              jQuery('<input/>', {'type': 'checkbox', "class": "box-check", "name":"media_kits[]", "id":"km-media-"+val.nid, "value":val.nid, "checked": false, "disabled":false}),
              jQuery('<label/>', {"class":"checkb", "for": "km-media-"+val.nid}),
              jQuery('<span/>', {"class": "custom-label ml-2", text: val.title}),
            ).appendTo('.wrapped-all-checkboxes');
          }
        });
        
        if(response.render_data){
          // media title 
          jQuery(".wrap-km-render-block #title-original").val(response.render_data.title);
          // media description
          jQuery(".wrap-km-render-block .description-field .description").val(response.render_data.description);
          // archived 
          if(response.render_data.archieve == 1){
            jQuery(".wrap-km-render-block #km-render-archieve").prop( "checked", true );
          }
          // show tags
          setTimeout(function(){
            jQuery('input.video-maker-tags').importTags(response.render_data.tags);
          }, 75);
        }
      }
    });
  }
}

/**
 * Callback function kmModalWindow()
 * to display KM modal window
 **/
function kmVideoModalWindow(render_form){
  var queryString = '';
  if(team_query.gid){
    queryString = '?team='+team_query.gid+'&uid='+team_query.muid;
  }
  jQuery('<div/>', {"class": "g-dialog-container d-block justify-content-center km-render-form-block visible", "id": "video-product-render"})
  .append(jQuery('<form/>', {"id": "video-render-form", "action": "/tools/video/maker/render"+queryString, "method": "POST"})
    .append(jQuery('<div/>', {"class": "g-dialog p-0"})
      .append(jQuery('<div/>', {"class": "g-dialog-header p-27"}))
      .append(jQuery('<div/>', {"class": "g-dialog-content gray-border-top-bottom"})
        .append(jQuery('<div/>', {"class": "d-grid"})
          .append(jQuery('<span/>', {"class": "d-block p-15", "html": render_form}))
        )
      )
      .append(jQuery('<div/>', {"class": "g-dialog-footer text-right p-2"})
        .append(jQuery('<a/>', {'class': 'btn btn-cancel mr-2', 'href': 'javascript:void(0);', text: 'Cancel'}))
        .append(jQuery('<input/>', {'class': 'close-modal btn btn-primary font-fjalla', 'type': 'submit', 'name': 'Render', 'value': 'render'}))
      )
    )).appendTo('#page');
}

jQuery("#page").on('click','div.g-dialog-footer a.btn-cancel',function (e) {
  jQuery(".g-dialog-container").remove();
});
jQuery("#properties-clip-content-section").on("change keyup", '.clip-duration .duration', function() {
	var selectedMid = jQuery(this).attr('data-rid');
     var duration_raw_string =  jQuery(this).val();
     var duration_raw_array =  duration_raw_string.split(":");
     var duration_in_secs = parseFloat(duration_raw_array[0])*60 + parseFloat(duration_raw_array[1]);
     console.log('onchange');
     if(duration_in_secs < 5){
      //console.log('Duration < 5 == '+duration_in_secs);
      jQuery( "#properties-photo-clip .video-clip-zoom input.form-check-input" ).each(function( index ) {
        jQuery(this).attr("disabled", true);
      });
     }
     else {
      //console.log('Duration > 5 == '+duration_in_secs);
      jQuery( "#properties-photo-clip .video-clip-zoom input.form-check-input" ).each(function( index ) {
        jQuery(this).removeAttr("disabled");
      });
     }
     updateClipDurationFromSlider(selectedMid , duration_in_secs, function(result){
		console.log('updated estimated duration');  
	  });
    });
function calculateTotalClipDuration(){
	var total_duration = 0;
	jQuery( "#story-board-elements input.clip-duration" ).each(function( index ) {
	  total_duration = total_duration + parseFloat(jQuery(this).val());
	});
	console.log(secondsToMSF(total_duration));  
	jQuery("div#estimated-duration").html('Duration:'+ secondsToMSF(total_duration));
};
function updateClipDurationFromSlider(selectedMid , time, callback){
	jQuery( "#story-board-elements input.clip-duration" ).each(function( index ) {
	  if(jQuery(this).attr('data-rid') == selectedMid){
       jQuery(this).val(time);
	   calculateTotalClipDuration();
	   callback(1);
     }
	});
}

// soundtrack tab
jQuery(document).on("click", ".audio-row .media-file-name", function () {
	var soundtrack = {};
	var $this = jQuery(this);
	soundtrack.audioname = jQuery($this).text();
	soundtrack.duration = jQuery($this).siblings('.duration').text();
	soundtrack.audiosrc = jQuery($this).siblings('.audio-src').find('.audio-box audio source').attr('src');
	soundtrack.mid = jQuery($this).parents('.audio-row').find('.audio-box').attr('id').split('-')[2];
	soundtrack.fadeIn = 1;
	soundtrack.fadeout = 1;
	soundtrack.loop = 1;
  soundtrack.vol = 100;	
	jQuery('#properties-soundtrack-tab').trigger('click');
	if(jQuery('#properties-soundtrack-content-section').find('.empty-track').length){
		soundtrackHtml(soundtrack,function(result) {
		}); 
	}
	else{
	jQuery("#replace-dialog-sound").dialog({
		autoOpen: true,
		width: 400,
		height: 250,
		modal: true,
		buttons: {
		  CANCEL: function() {
			 jQuery("#replace-dialog-sound").dialog("close");
		  },
		  'REPLACE Audio': function() {
			 soundtrackHtml(soundtrack,function(result) {}); 
        jQuery("#replace-dialog-sound").dialog("close");			
		}
		},
	});
	}
});

// remove audio from soundtrack
jQuery(document).on("click", ".remove-soundtrack-button .rmv-soundtrack", function (e) {
  jQuery('#properties-soundtrack-content-section .sound-track').html('');
  jQuery('#properties-soundtrack-content-section .sound-track').html('<div class="empty-track p-27 text-align-center w-100">Select an audio file<br> from your Media kits.</div>');
});

// validate video form
function validateVideoForm(){
  if(jQuery('input#video_name').val() == ''){
    jQuery('input#video_name').focus();
    jQuery('span#video_name_error').html('Please enter video name.');
    jQuery('span#video_name_error').show();
	jQuery('div.nav-tabs a#properties-profile-tab').trigger('click');
    return false;
  }else{
    jQuery('span#video_name_error').hide();
    return true;
  }
}

//Transition properties save on Transition radio button click
jQuery(".transition-box").on('click','div.transition-options input.transition-option',function (e) {
  var vid  = jQuery("input#video-id").val();
  var mid = jQuery("input#transition-mid").val();
  var rid = jQuery("input#transition-rid").val();
  var duration = jQuery("select#transition-duration").val();
  var transition = jQuery(this).val();
  
  jQuery.ajax({
    url: '/tools/video/maker/populate/propertiesave',
    data: {'type_tab_save':'transition','vid': vid, 'mid': mid, 'rid': rid,'duration': duration, 'transition': transition},
    type: 'POST',
    dataType: 'json', 
    success:function(data) {
      console.log(data);
    }
  });
  
});

//Transition properties save on duration select change
jQuery(".transition-box").on('change','select#transition-duration',function (e) {
  var vid  = jQuery("input#video-id").val();
  var mid = jQuery("input#transition-mid").val();
  var rid = jQuery("input#transition-rid").val();
  var duration = jQuery(this).val();
  var transition = jQuery('input[name="transition_option"]:checked').val();  
  
  jQuery.ajax({
    url: '/tools/video/maker/populate/propertiesave',
    data: {'type_tab_save':'transition','vid': vid, 'mid': mid, 'rid': rid,'duration': duration, 'transition': transition},
    type: 'POST',
    dataType: 'json', 
    success:function(data) {
      console.log(data);
    }
  });
  
});

//photo clip properties save on duration change
jQuery("#properties-clip").on('change keyup','div#properties-photo-clip input.duration',function (e) {
  PhotoClipPropertiesSave();
  /*var vid  = jQuery("input#video-id").val();
  var mid = jQuery("input#transition-mid").val();
  var rid = jQuery("input#transition-rid").val();
  var durationRaw = jQuery(this).val();
  var zoom = JSON.stringify(getExportedPhotoProperties());  
  var duration_raw_array =  durationRaw.split(":");
  var duration = parseFloat(duration_raw_array[0])*60 + parseFloat(duration_raw_array[1]);
   
  jQuery.ajax({
    url: '/tools/video/maker/populate/propertiesave',
    data: {'type_tab_save':'photo_clip','vid': vid, 'mid': mid, 'rid': rid,'duration': duration, 'zoom': zoom},
    type: 'POST',
    dataType: 'json', 
    success:function(data) {
      console.log(data);
    }
  });*/
  
});

//photo clip properties save on zoom change
jQuery("#properties-clip").on('change','div#properties-photo-clip input#zoom-img',function (e) {
  PhotoClipPropertiesSave();
});
function PhotoClipPropertiesSave(){
  var vid  = jQuery("input#video-id").val();
  var mid = jQuery("input#transition-mid").val();
  var rid = jQuery("input#transition-rid").val();
  var durationRaw = jQuery('div#properties-photo-clip input.duration').val();
  var zoom = JSON.stringify(getExportedPhotoProperties());  
  var duration_raw_array =  durationRaw.split(":");
  var duration = parseFloat(duration_raw_array[0])*60 + parseFloat(duration_raw_array[1]);
  var clip_zoom = jQuery(".video-clip-zoom input:checkbox:checked").map(function(){
    return jQuery(this).val();
  }).get();
  
  jQuery.ajax({
    url: '/tools/video/maker/populate/propertiesave',
    data: {'type_tab_save':'photo_clip','vid': vid, 'mid': mid, 'rid': rid,'duration': duration, 'zoom': zoom,'clip_zoom':clip_zoom[0]},
    type: 'POST',
    dataType: 'json', 
    success:function(data) {
      console.log(JSON.stringify(data));
    }
  });  
}

//video clip properties save on zoom change
jQuery("#properties-clip").on('change','div#properties-video-clip input#zoom',function (e) {  
  VideoClipPropertiesSave();
});

//video clip properties save on volume change
jQuery("#properties-clip").on('change','div#properties-video-clip input#volume',function (e) {  
  VideoClipPropertiesSave();
});

//video clip properties save
function VideoClipPropertiesSave(){
  var vid  = jQuery("input#video-id").val();
  var mid = jQuery("input#transition-mid").val();
  var rid = jQuery("input#transition-rid").val();  
  var zoomRaw = JSON.stringify(getExportedVideoProperties());
  var zoom = jQuery('#zoom').val();
  var starttime = jQuery('#start-time').val();
  var duration = jQuery('#clip-duration').val();
  var volume = jQuery('#volume').val();
  jQuery.ajax({
    url: '/tools/video/maker/populate/propertiesave',
    data: {'type_tab_save':'video_clip','vid': vid, 'mid': mid, 'rid': rid,'starttime': starttime,'duration': duration, 'zoom': zoom,'zoomraw': zoomRaw,'volume':volume},
    type: 'POST',
    dataType: 'json', 
    success:function(data) {
      console.log(data);
    }
  });  
};