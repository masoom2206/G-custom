(function($, Drupal, drupalSettings) {
  var initialized;
  Drupal.behaviors.custom_video_editor = {
    attach: function(context, settings) {
      if (!initialized) {
        initialized = true;
        var media_base_url = drupalSettings.media_base_url;
        var media_owner = drupalSettings.media_owner;
        var media_data = drupalSettings.media_data;
        var vdo_duration = media_data.media_data.file_duration;
        var max_vdo_duration = media_data.media_data.max_video_duration;
        var preset_id_if_any = media_data.media_data.preset_id;
		//console.log(preset_id_if_any);
        var res = vdo_duration.split(":");
        var video_duration_time_seconds = parseInt(res['0'])*3600 +  parseInt(res['1'])*60 +  parseInt(res['2']);
        var slider_max_value = '';
        var slider_value = {};
        //max_vdo_duration = 100;
        if(max_vdo_duration !== null && max_vdo_duration !== '') {
             if(video_duration_time_seconds > max_vdo_duration ){
              slider_max_value = video_duration_time_seconds;
              slider_value = [0, max_vdo_duration];  
              var slider_end_point =  max_vdo_duration;               
             }
            else{
              slider_max_value = video_duration_time_seconds;
              slider_value = [0, video_duration_time_seconds];
              var slider_end_point =  video_duration_time_seconds;               
            }
        }
        else{
          slider_max_value = video_duration_time_seconds;
          slider_value = [0, video_duration_time_seconds];
          var slider_end_point =  video_duration_time_seconds;          
        }
        jQuery('input.starting-point').val(0);
        jQuery('input.ending-point').val(slider_end_point);
        jQuery('input.result').val(slider_end_point);
        var text = "Uploaded file";
        var default_preset_value = jQuery("#mediaPreset option").filter(function() {
          return jQuery(this).text() === text;
        }).first().attr("value");
		if(media_data.media_data.source_type == 'uploaded' || media_data.media_data.source_type == null || media_data.media_data.source_type == 'Upload Modified'){
		  // jQuery('#video-duration-slider').slider({ disabled: true }); 
		  // jQuery('.editor-prop').find('ul li').addClass('disabled');
		   jQuery('#mediaPreset').val(default_preset_value);
		}
		else if(media_data.media_data.source_type == 'generated'){
			jQuery("select#mediaPreset option[value='"+ default_preset_value + "']").attr('disabled', true); 
		}
        
        // modal dialog box
        function vdo_Editor_modal(cancel_button_text, ok_button_text, title, html_content) {
             var def = $.Deferred();
			var buttons = {} ;             
            if(cancel_button_text) {
                buttons[cancel_button_text] = function() {jQuery( this ).dialog( "close" );def.reject();};
            }
			if(ok_button_text) {
                buttons[ok_button_text] = function() {jQuery( this ).dialog( "close" );def.resolve();};
            }
          jQuery('#vdo-editor-dialog').dialog({
            autoOpen: true,
            width: 500,
            modal: true,
            resizable: false,
            buttons: buttons,
            open: function(event, ui) {
              jQuery('#vdo-editor-dialog').dialog('option', 'title', title);
              jQuery("#vdo-editor-dialog").html(html_content);
                                 
            }
          });
          return def.promise();
        }
        // save video functionality
        jQuery('.video-edit-form-footer').on('click', '.video-edit-form-save', function(e) {
          e.preventDefault(); 
          var completeVideoData = {};
          var $this = jQuery(this);
		  
		 /* if(media_data.media_data.source_type == 'uploaded' || media_data.media_data.source_type == null || media_data.media_data.source_type == 'Upload Modified' ){
			var disabled = 'disabled';  
		  }
		  else{
			  if(jQuery('#mediaPreset').val()== -1){
				var disabled = 'disabled';  
			  }
			  else{
				var disabled = '';  
			  } 
			  var disabled = '';
		  }
          
          var message = '<div style="padding-left:20px; text-align: left;"><div class="checkbox">';
              message += '<label class="checkbox-container disabled">';
              message += '<input type="checkbox" value="1" class="box-check" checked="" style="" disabled="">';
              message += '<span class="custom-label">Update any changes to information</span>';
              message += '<span class="checkmark"></span>';
              message += '</label>';
              message += '</div>';
              message += '<div class="checkbox trancode-check">';
              message += '<label class="checkbox-container '+ disabled +'">';
              message += '<input type="checkbox" value="2" class="box-check">';
              message += '<span class="custom-label">Replace video<br><div style="padding-left:25px">If checked, your video will be scheduled for optimized rendering. We will notify you as soon as it is ready.</div></span>';
              message += '<span class="checkmark"></span>';
              message += '</label>';
              message += '</div>'
              message += '<div>If you wish to save this as a new video, click CANCEL and use "SAVE AS NEW VIDEO" button.</div>';
              message += '</div>' ; 
			  */
			  completeVideoData.exportedData = getExportedVideoProperties();
			   console.log(video_duration_time_seconds);
			   console.log(completeVideoData.exportedData.videoDuration.duration);
			   console.log(completeVideoData.exportedData.curruntZoom);
			  // console.log('dura');
              if( (completeVideoData.exportedData.curruntZoom > 1) || (video_duration_time_seconds > completeVideoData.exportedData.videoDuration.duration)  ){
				var transcode = 1 ;
			  }
			  else{
				var transcode = 0 ;  
			  }
			 completeVideoData.transcode = transcode ;				 
             completeVideoData.type = 'self' ; 
             completeVideoData.mid = $this.attr('data-mid');
             completeVideoData.formTextData = getTextFormData($this.parents('.video-field-block'));
			 if ( transcode == 1) {
		      var message = 'Are you sure you want to replace this video? If you wish to save this as a new video, click CANCEL and use the "SAVE AS NEW VIDEO" button.';		 
			  vdo_Editor_modal('cancel', 'save', 'REPLACE EXISTING VIDEO?', message).done(function() {
				 jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
				// var transcode = (jQuery('.trancode-check .box-check').is(":checked")) ? 1 : 0;
				 jQuery.ajax({
				  url: '/media-video-update/' + completeVideoData.mid ,
				  data: {
					"mode": 'ajax',
					"completeVideoData": completeVideoData,
				  },
				  type: "POST",
				  success: function(data) {
					  var destination = window.location.href.split("=");
					  if (destination[1] === undefined || destination[1] === null) {
						//console.log('no need to redirect');
						location.reload();
					  } else {
						window.location.replace(destination[1]);
					  }
					  jQuery('#overlay').remove();
					  console.log(data);
				  },
				  error: function (textStatus, errorThrown) {
					alert(textStatus.responseText);
				   jQuery('#overlay').remove();
				  }
				 });
	   
			  }).fail(function() {}); 
			 }
             else{
				 jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
				// var transcode = (jQuery('.trancode-check .box-check').is(":checked")) ? 1 : 0;
				 jQuery.ajax({
				  url: '/media-video-update/' + completeVideoData.mid ,
				  data: {
					"mode": 'ajax',
					"completeVideoData": completeVideoData,
				  },
				  type: "POST",
				  success: function(data) {
					  var destination = window.location.href.split("=");
					  if (destination[1] === undefined || destination[1] === null) {
						//console.log('no need to redirect');
						location.reload();
					  } else {
						//window.location.replace(destination[1]);
						location.reload();
					  }
					  jQuery('#overlay').remove();
					  console.log(data);
				  },
				  error: function (textStatus, errorThrown) {
					alert(textStatus.responseText);
				   jQuery('#overlay').remove();
				  }
				 });				
			 }			 
        });
        //save video as new functionality
        jQuery('.video-edit-form-footer').on('click', '.video-edit-form-save-new', function(e) {
          e.preventDefault();
          var completeVideoData = {};
          var $this = jQuery(this);
          var message = "Your video will be scheduled for optimized rendering. We will notify you as soon as it is ready."
          vdo_Editor_modal('cancel', 'save', 'SAVE AS NEW VIDEO', message).done(function() {
             jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
             completeVideoData.transcode = 1 ;				 
             completeVideoData.type = 'new' ;
             completeVideoData.mid = $this.attr('data-mid');
             completeVideoData.formTextData = getTextFormData($this.parents('.video-field-block'));  
             completeVideoData.exportedData = getExportedVideoProperties(); 
            // alert(' We are working on this. We have collected all the data of video that need to send for FFMPEG. Please see in console.');
             //console.log(completeVideoData);
             jQuery.ajax({
              url: '/media-video-update/' + completeVideoData.mid ,
              data: {
                "mode": 'ajax',
                "completeVideoData": completeVideoData,
              },
              type: "POST",
              success: function(data) {
				  var destination = window.location.href.split("=");
				  if (destination[1] === undefined || destination[1] === null) {
					//console.log('no need to redirect');
					//location.reload();
				  } else {
					window.location.replace(destination[1]);
				  }
                  jQuery('#overlay').remove();
                  console.log(data);
              },
              error: function (textStatus, errorThrown) {
                alert(textStatus.responseText);
               jQuery('#overlay').remove();
              }
             });
                
          }).fail(function() {});
                          
        });
        //cancel button functionality
        jQuery('.video-edit-form-footer').on('click', '.video-edit-form-cancel', function(e) {
          e.preventDefault(); 
          var destination = window.location.href.split("=");
          console.log('form change');
            if (formChanged == 1) {
                var message = 'Are you sure you want to cancel? Any changes will be lost.'
              vdo_Editor_modal('','okay', '', message).done(function() {
                 if (destination[1] === undefined || destination[1] === null) {
                      //console.log('no need to redirect');
                      location.reload();
                  } else {
                      window.location.replace(destination[1]);
                    }                
              }).fail(function() {
                   console.log('cancel');
              });
            } 
            else{
              if (destination[1] === undefined || destination[1] === null) {
                location.reload();
              } else {
                window.location.replace(destination[1]);
              }
            }            
        });
        // detect if right text form changed
          var formChanged = 0;
          jQuery('body').on('DOMSubtreeModified', '.wrap-video-field-block', function() {
            //console.log('dom changed');  
           // formChanged = 1;
          });
          jQuery('.custom-media-video-edit-form input, .custom-media-video-edit-form textarea').change(function() {
               console.log('field changed'); 
            formChanged = 1;
          });
        
        jQuery('.wrapped-all-checkboxes-thumbs').on('click', '.box-check', function(e) {
          var $this = jQuery(this);
          var mid = '';
          jQuery('.wrapped-all-checkboxes-thumbs input[type=checkbox]:checked').each(function() {
            jQuery(this).not($this).prop('checked', false);
            mid = $this.val();
          })
        });
        // tags field implementation
        jQuery('input#tags').tagsInput({
          minChars: 2,
          unique: true,
          'autocomplete': {
            source: '/getTags/' + media_owner,
          },
          onAddTag: function(fld, tag) {
            //console.log(tag);
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
        // auto fill tags if existing
        /*  jQuery('input#tags').importTags(jQuery('span.tags').text()); */
        if (jQuery('.tagsinput span.tag').length) {
          jQuery('.tagsinput input.tag-input').attr('placeholder', '');
        }
        jQuery('#tags_tagsinput').on('change', function(e) {
          var current_tag = jQuery(this).find('#tags_tag').val();
          if (current_tag != '') {
            jQuery('input#tags').addTag(current_tag);
          }
        });
        //color picker initialized
        var colors = jQuery('#colorSelector').colorPicker({
          customBG: '#222',
          readOnly: true,
          //delayOffset: 8, // pixels offset when shifting mouse up/down inside input fields before it starts acting as slider
          CSSPrefix: 'cp-', // the standard prefix for (almost) all class declarations (HTML, CSS)
          size: 3, // one of the 4 sizes: 0 = XXS, 1 = XS, 2 = S, 3 = L (large); resize to see what happens...
          allMixDetails: true, // see Colors...
          noAlpha: true, // disable alpha input (all sliders are gone and current alpha therefore locked)
          init: function(elm, colors) {},
          actionCallback: function(elm, action) { // callback on any action within colorPicker (buttons, sliders, ...)
            //console.log(action);
            var bg = jQuery('#colorSelector').css('background-color');
            jQuery('#stage').css('background-color', bg);
            if (action == 'saveAsBackground' || action == 'resetColor') {
              jQuery('.cp-app').hide('fast');
              jQuery("#colorSelector").blur();
            }
          },
        });
        // close color picker dialog on enter
        jQuery(document).keypress(function(event) {
          var keycode = (event.keyCode ? event.keyCode : event.which);
          if (keycode == '13') {
            // focusout color picker input
            jQuery("#colorSelector").blur();
            jQuery('.cp-app').hide('fast');
          }
        });
        // thumbnails preview and delete button functionality 
        if (window.File && window.FileList && window.FileReader) {
          jQuery("#v-thumb").on("change", function(e) {
            var $this = jQuery(this);
            //console.log(this.files[0]);
            var filesize = bytesToSize(this.files[0].size);
            var filename = this.files[0].name;
            if (this.files[0].size > 2000000) {
              var error_messahe = "<span class='email-null-error text-danger'>File size must be less than 2mb.</span>";
              $this.parents('.video-thumbnail-field').prepend(error_messahe);
              jQuery('#v-thumb').val('');
              setTimeout(function() {
                $('.email-null-error').remove();
              }, 3000);
              return;
            }
            var fileExtension = ['jpeg', 'jpg', 'png'];
            if (jQuery.inArray($this.val().split('.').pop().toLowerCase(), fileExtension) == -1) {
              var error_messahe = "<span class='email-null-error text-danger'>formats are allowed : " + fileExtension.join(', ') + "</span>"
              $this.parents('.video-thumbnail-field').prepend(error_messahe);
              jQuery('#v-thumb').val('');
              setTimeout(function() {
                $('.email-null-error').remove();
              }, 3000);
              // alert("Only formats are allowed : "+fileExtension.join(', '));
              return;
            }
            var f = this.files[0]
            var fileReader = new FileReader();
            fileReader.onload = (function(e) {
              var file = e.target;
              //console.log(e.target.result);
              var filesize_wrap = '(' + filesize + ')';
			  $this.parents('.video-thumbnail-field').addClass('new-thumb-uploaded');
			  $this.parents('.video-thumbnail-field').removeClass('new-thumb-removed');
              $this.parents('.video-thumbnail-field').find('.custom-thumbnail-field').addClass('d-none');
              $this.parents('.video-thumbnail-field').find('.preview-file-name').removeClass('d-none');
              $this.parents('.video-thumbnail-field').find('.preview-file-name .file-name').text(filename);
              $this.parents('.video-thumbnail-field').find('.preview-file-name .file-size').text(filesize_wrap);
              $this.parents('.video-thumbnail-field').find('.preview-thumbnails img').attr('src', e.target.result);
              $this.parents('.video-thumbnail-field').find('.preview-thumbnails').removeClass("d-none");
              $this.parents('.video-thumbnail-field').find('.remove-thumbnails .remove-preview-thumbnail').removeClass("d-none");
            });
            fileReader.readAsDataURL(f);
          });
        } else {
          alert("Your browser doesn't support to File API")
        }

        function bytesToSize(bytes) {
          var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
          if (bytes == 0) return '0 Byte';
          var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
          return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        }
        jQuery('.video-thumbnail-field').on('click', '.remove-preview-thumbnail', function(e) {
          e.preventDefault();
          var $this = jQuery(this);
          var defaut_thumb = "/modules/custom/media_vault_tool/img/video.png";
          jQuery('#v-thumb').val('');
          $this.addClass('d-none');
		  $this.parents('.video-thumbnail-field').removeClass('new-thumb-uploaded');
		  $this.parents('.video-thumbnail-field').addClass('new-thumb-removed');
          $this.parents('.video-thumbnail-field').find('.preview-file-name').addClass('d-none');
          $this.parents('.video-thumbnail-field').find('.preview-file-name .file-name').text('');
          $this.parents('.video-thumbnail-field').find('.preview-file-name .file-size').text('');
          $this.parents('.video-thumbnail-field').find('.preview-thumbnails img').attr('src', defaut_thumb);
          $this.parents('.video-thumbnail-field').find('.custom-thumbnail-field').removeClass("d-none");
          //$this.parents('.video-thumbnail-field').find('.thumbnail-validation-desc').removeClass("d-none");
        });
        jQuery('#mediaPreset').on('change', function(e) {
          //var default_preset_value = 'Original Video';
          jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
          var preset = jQuery(this).val();
          if (preset > 0) {
            if (preset != default_preset_value) {
              preset_val = 1;
			 // jQuery('#video-duration-slider').slider({ disabled: false });
			 // jQuery('.editor-prop').find('ul li').removeClass('disabled');
            } else {
              preset_val = 0;
			//  jQuery('#video-duration-slider').slider({ disabled: true });
			//  jQuery('.editor-prop').find('ul li').addClass('disabled');
            }
			
          } 
          var mid = 'default';
          if (preset_val) {
            jQuery.ajax({
              url: '/getMediaUrl/' + mid,
              data: {
                "mode": 'ajax',
                "image_preset_tid": preset,
              },
              type: "GET",
              success: function(data) {
               // console.log(data);
                definePreviewArea(data.media_preset.height, data.media_preset.width, function(result) {
                  jQuery('#overlay').remove();
                  jQuery('.max-duration span.max-duration').text(data.media_preset.video_limit + 'secs');
                  max_vdo_duration = data.media_preset.video_limit;
                  if(data.media_preset.video_limit !== null && data.media_preset.video_limit !== '') {
                         if(video_duration_time_seconds > data.media_preset.video_limit ){
                          slider_max_value = video_duration_time_seconds;
                          slider_value = [0, data.media_preset.video_limit];
                          var slider_end_point =  data.media_preset.video_limit;                        
                         }
                        else{
                          slider_max_value = video_duration_time_seconds;
                          slider_value = [0, video_duration_time_seconds];
                          var slider_end_point =  video_duration_time_seconds;                          
                        }
                    }
                    else{
                      slider_max_value = video_duration_time_seconds;
                      slider_value = [0, video_duration_time_seconds];
                      var slider_end_point =  video_duration_time_seconds;                                                
                    }
                   jQuery('input.starting-point').val(0);
                   jQuery('input.ending-point').val(slider_end_point);
                   jQuery('input.result').val(slider_end_point); 
                  jQuery( "#video-duration-slider" ).slider( "option", "values", slider_value );
                  jQuery( "#video-duration-slider" ).slider( "option", "max", slider_max_value ); 
                  jQuery(".custom-tooltip-1").attr('title', 0 + 'sec');
                  jQuery(".custom-tooltip-2").attr('title', slider_end_point +'secs' );
                  
                  if(preset_id_if_any == preset ){
                     //enable save button
                   jQuery('#video-editor-form').find('button.video-edit-form-save').removeClass('disabled');  
                  }
                  else{
                    //disable save button
                   jQuery('#video-editor-form').find('button.video-edit-form-save').addClass('disabled');
                  }                  
                  
                });
              }
            });
          }
          else{
                definePreviewArea(v.videoHeight , v.videoWidth , function(result) {
                    jQuery('#overlay').remove();
                    //max_vdo_duration = media_data.media_data.max_video_duration;
                   // max_vdo_duration = 100;
                    if(max_vdo_duration !== null && max_vdo_duration !== '') {
                         if(video_duration_time_seconds > max_vdo_duration ){
                          slider_max_value = video_duration_time_seconds;
                          slider_value = [0, max_vdo_duration]; 
                          var slider_end_point =  max_vdo_duration;                              
                         }
                        else{
                          slider_max_value = video_duration_time_seconds;
                          slider_value = [0, video_duration_time_seconds];  
                          var slider_end_point =  video_duration_time_seconds;    
                        }
                    }
                    else{
                      slider_max_value = video_duration_time_seconds;
                      slider_value = [0, video_duration_time_seconds];
                      var slider_end_point =  video_duration_time_seconds;                          
                    }
                   jQuery('input.starting-point').val(0);
                   jQuery('input.ending-point').val(slider_end_point);
                   jQuery('input.result').val(slider_end_point);                     
                  jQuery( "#video-duration-slider" ).slider( "option", "values", slider_value );
                  jQuery( "#video-duration-slider" ).slider( "option", "max", slider_max_value ); 
                  jQuery(".custom-tooltip-1").attr('title', 0 + 'sec');
                  jQuery(".custom-tooltip-2").attr('title',slider_end_point +'secs' );
                  //enable save button
                  jQuery('#video-editor-form').find('button.video-edit-form-save').removeClass('disabled');
                  
                }); 
          }
        });
        // define video preview area
        function definePreviewArea(media_preset_height, media_preset_widtht, fn) {
          var originalHeight = parseFloat(media_preset_height);
          var originalWidth = parseFloat(media_preset_widtht);
          // We customize image editor dimensions as real dimensions cant be shown.
          // on the page. Image dimensions are also be scaled based on image editor dimensions to maintain aspect ratio.
          var screen_width = parseInt(jQuery("div.video-editor").width());
          var screen_height = 650;
          if (screen_width > screen_height) {
            if (originalWidth > screen_width && originalHeight > screen_height) {
              if (originalWidth >= originalHeight) {
                var previewScale = (originalWidth / screen_width);
                var resize = parseFloat((screen_width * 100) / originalWidth);
              } else {
                var previewScale = (originalHeight / screen_height);
                var resize = parseFloat((screen_height * 100) / originalHeight);
              }
              var previewHeight = originalHeight / previewScale;
              var previewWidth = originalWidth / previewScale;
            } else if (originalWidth > screen_width) {
              var previewScale = (originalWidth / screen_width);
              var resize = parseFloat((screen_width * 100) / originalWidth);
              var previewHeight = originalHeight / previewScale;
              var previewWidth = originalWidth / previewScale;
            } else if (originalHeight > screen_height) {
              var previewScale = (originalHeight / screen_height);
              var resize = parseFloat((screen_height * 100) / originalHeight);
              var previewHeight = originalHeight / previewScale;
              var previewWidth = originalWidth / previewScale;
            } else {
              var previewHeight = originalHeight;
              var previewWidth = originalWidth;
              resize = 100;
              previewScale = 1;
            }
          } else {
            var previewScale = (originalWidth / screen_width);
            var resize = parseFloat((screen_width * 100) / originalWidth);
            var previewHeight = originalHeight / previewScale;
            var previewWidth = originalWidth / previewScale;
          }
          jQuery('.video-editor #stage').css({
            'width': previewWidth,
            'height': previewHeight,
          });
          jQuery('.video-editor #stage').attr('data-previeScale', previewScale );
          var v = document.getElementsByTagName('video')[0];

           var ralativeVDOWidth= (v.videoWidth * resize) / 100;
           var ralativeVDOheight = (v.videoHeight * resize) / 100;
          
          if(previewWidth > previewHeight ){
            if(ralativeVDOheight >= previewHeight ){
               v.height = previewHeight;
               v.removeAttribute("width");                  
            } 
            else{
              v.height = ralativeVDOheight;
              v.removeAttribute("width");
            }            
  
          }
          else{
            if(ralativeVDOWidth >= previewWidth ){
                v.width = previewWidth;
                v.removeAttribute("height");                
            } 
            else{
              v.width = ralativeVDOWidth;
               v.removeAttribute("height");
            }
          }
            jQuery('.video-zoom-slider .range-slider').val(0);
            jQuery('.video-zoom-slider .range-slider').trigger('input');
            zoom = 1;
            rotate = 0;
            v.style.top = 0 + 'px';
            v.style.left = 0 + 'px';
            v.style[prop]='rotate('+rotate+'deg) scale('+zoom+')';
            fn(1);
        }
        
        jQuery('#stage').on('mouseenter mouseleave',function () {
         jQuery(this).find('.custom-video-control-wrapper').fadeToggle('slow');
        });
        
       // custom video player
        /* predefine zoom and rotate */
        var zoom = 1,
          rotate = 0;
        /* Grab the necessary DOM elements */
        var stage = document.getElementById('stage'),
          v = document.getElementsByTagName('video')[0],
          controls = document.getElementById('controls');
        // custom controlss
        //get HTML5 video time duration
        v.onloadedmetadata = (event) => {
          jQuery('.current').text(secondsTimeSpanToHMS(Math.floor(v.currentTime)));
          jQuery('.duration').text(secondsTimeSpanToHMS(Math.floor(v.duration)));
        };

        var waitForEl = function(videoHeight, videoWidth, callback) {
                    if (videoHeight > 0 && videoWidth > 0 ) {
                       definePreviewArea( videoHeight, videoWidth, function(result) {
                           console.log(' initialize cefined preview area');
                          // console.log(result);
                      }); 
                       callback();              
                    }
                      else {
                        setTimeout(function() {
                          waitForEl(v.videoHeight, v.videoWidth, callback);
                        }, 1000);
                  }
                };
        waitForEl(v.videoHeight, v.videoWidth, function() {
          console.log('defined custom');
        });

    
            
        //update HTML5 video current play time
        v.ontimeupdate = (event) => {
          var currentPos = v.currentTime; //Get currenttime
          var maxduration = v.duration; //Get video duration
          // console.log(currentPos);
          // console.log(maxduration);
          var percentage = 100 * currentPos / maxduration; //in %
          //console.log(percentage);
          jQuery('.timeBar').css('width', percentage + '%');
          var currentTime = secondsTimeSpanToHMS(Math.floor(v.currentTime));
          var dura = secondsTimeSpanToHMS(Math.floor(v.duration));
          jQuery('.current').text(currentTime);
          //jQuery('.duration').text(dura);
          if (currentPos == maxduration || percentage == 100) {
            console.log('change icon');
            jQuery('.custom-video-controls .video-play-pause').find('i').addClass('fa-play');
            jQuery('.custom-video-controls .video-play-pause').find('i').removeClass('fa-pause');
          }
        };
        var timeDrag = false; /* Drag status */
        jQuery('.progressBar').mousedown(function(e) {
          timeDrag = true;
          updatebar(e.pageX);
        });
        jQuery(document).mouseup(function(e) {
          if (timeDrag) {
            timeDrag = false;
            updatebar(e.pageX);
          }
        });
        jQuery(document).mousemove(function(e) {
          if (timeDrag) {
            updatebar(e.pageX);
          }
        });
        
        //Mute/Unmute control clicked
        jQuery('.muted').click(function() {
          v.muted = !v.muted;
          return false;
        });

        //update Progress Bar control
        var updatebar = function(x) {
          var progress = jQuery('.progressBar');
          var maxduration = v.duration; //Video duraiton
          var position = x - progress.offset().left; //Click pos
          var percentage = 100 * position / progress.width();
          //Check within range
          if (percentage > 100) {
            percentage = 100;
          }
          if (percentage < 0) {
            percentage = 0;
          }
          //Update progress bar and video currenttime
          jQuery('.timeBar').css('width', percentage + '%');
          v.currentTime = maxduration * percentage / 100;
        };
 

        function secondsTimeSpanToHMS(s) {
          var h = Math.floor(s / 3600); //Get whole hours
          s -= h * 3600;
          var m = Math.floor(s / 60); //Get remaining minutes
          s -= m * 60;
          return h + ":" + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s); //zero padding on minutes and seconds
        }
        //play/pause video
        jQuery('.video-play-pause').on('click', function() {
          if (v.paused) {
            v.play();
            jQuery(this).find('i').removeClass('fa-play');
            jQuery(this).find('i').addClass('fa-pause');
          } else {
            v.pause();
            jQuery(this).find('i').addClass('fa-play');
            jQuery(this).find('i').removeClass('fa-pause');
          }
        });
        // mute/unmute audio
        jQuery('.video-audie-control').on('click', function() {
          v.muted = !v.muted;
          jQuery(this).find('i').toggleClass('fa fa-volume-up fas fa-volume-mute');
        });
        jQuery(".video-audie-control-wrap").hover(function() {
          jQuery('.volumeBarRange').removeClass('d-none');
        }, function() {
          jQuery('.volumeBarRange').addClass('d-none');
        });
        // audio controll
        jQuery('.volumeBarRange').on('input', '.range-slider', function() {
          v.volume = parseFloat(jQuery(this).val());
        });
        //zoom-in, zoomout video
        jQuery('.video-zoom-slider').on('input', '.range-slider', function() {
          if (parseFloat(jQuery(this).val()) == 0) {
            jQuery(this).parents('.slider-wrapper').find('button').addClass('invisible');
          } else {
            jQuery(this).parents('.slider-wrapper').find('button').removeClass('invisible');
          }
          if (zoom == 1) {
            zoom = zoom + parseFloat(jQuery(this).val());
          } else {
            var nextZoom = parseFloat(jQuery(this).val());
            var previous_zoom = zoom - 1;
            if (nextZoom >= previous_zoom) {
              //increase zoom
              zoom = zoom + parseFloat(nextZoom - previous_zoom);
            } else {
              // decrease zoom
              zoom = zoom - parseFloat(previous_zoom - nextZoom);
            }
          }
          v.style[prop] = 'scale(' + zoom + ') rotate(' + rotate + 'deg)';
        });
        jQuery('body').on('click', '.export', function(e) {
            e.preventDefault();
            var a = getExportedVideoProperties();
            console.log(a);
        });
        function getExportedVideoProperties(){
             var exportedVideo = {};
             var v = document.getElementsByTagName('video')[0];
             exportedVideo['original_vdo_width'] = v.videoWidth;
             exportedVideo['original_vdo_height'] = v.videoHeight;
			 exportedVideo['relative_vdo_width'] = jQuery('#video-editor-pane').width();
			 exportedVideo['relative_vdo_height'] = jQuery('#video-editor-pane').height();
            exportedVideo['preset'] = jQuery('select#mediaPreset').val();
            exportedVideo['original_fid'] = jQuery('#video-editor-pane').attr('data-fid');
            exportedVideo['curruntZoom'] = zoom;
            exportedVideo['previewScale'] = jQuery('.video-editor #stage').attr('data-previeScale');
            exportedVideo['bg-color'] = (jQuery('#stage').css('background-color') == '') ? '#000' : rgb2hex(jQuery('#stage').css('background-color'));
            exportedVideo['rotation'] = getRotationDegrees(jQuery('#video-editor-pane')); 
            var relativeStageWidth = parseFloat(jQuery("#stage").css("width"))* exportedVideo['previewScale'];
            var relativeStageHeight = parseFloat(jQuery("#stage").css("height"))* exportedVideo['previewScale'];
            exportedVideo['preset_dimensions'] = relativeStageWidth+ 'X' + relativeStageHeight;
            exportedVideo['offset'] =  getVideoEditorOffset();
            exportedVideo['videoDuration'] = getVideoClipDuration(jQuery('.crop-duration'));
            return exportedVideo;
        }
        // get text form data

         function getTextFormData(obj){
             var formData = {};
             var genre = {};
			 var uploaded_thumb = {};
            formData.fileName = obj.find('.favo-icon span.file-name').text();
            formData.favourite = (obj.find('.favo-icon #favo').is(":checked")) ? 1 : 0;
            formData.title = obj.find('.title-field #title').val();
            formData.archived = (obj.find('.archieve-field .box-check').is(":checked")) ? 1 : 0;
            genre.value = obj.find('select#genre-field').val();
            formData.genre = genre;
            formData.tags = obj.find('#tags_tagsinput .tag .tag-text').map(function() {
                          return jQuery(this).text()
                        }).get();
            formData.description = obj.find('.description-field .form-control.description').val();
            formData.copyRights = obj.find('.copyright-field .copyright').val();
            formData.mkits = obj.find('.wrapped-all-checkboxes input[type=checkbox]:checked').map(function() {
                          return jQuery(this).val()
                        }).get();
            formData.remove_mkits = obj.find('.wrapped-all-checkboxes input[type=checkbox]:not(:checked)').map(function() {
              return jQuery(this).val()
            }).get();   
            formData.availTumbsList = obj.find('.wrapped-all-checkboxes-thumbs input[type=checkbox]').map(function() {
                          return jQuery(this).val()
                        }).get();
            formData.availTumbsListSelected = obj.find('.wrapped-all-checkboxes-thumbs input[type=checkbox]:checked').map(function() {
                          return jQuery(this).val()
                        }).get();
            if(obj.find('.video-thumbnail-field').hasClass('new-thumb-uploaded')){
             uploaded_thumb.src = obj.find('.video-thumbnail-field .preview-thumbnails img').attr('src');
			 uploaded_thumb.name = obj.find('.video-thumbnail-field .preview-file-name .file-name').text();
            }
            else if(obj.find('.video-thumbnail-field').hasClass('new-thumb-removed')){
             uploaded_thumb.src = '';
			 uploaded_thumb.name = '';
            }
            else{
				if(obj.find('.video-thumbnail-field .preview-thumbnails').hasClass('no-default')){
				// uploaded_thumb.src = obj.find('.video-thumbnail-field .preview-thumbnails img').attr('src');
			    // uploaded_thumb.name = obj.find('.video-thumbnail-field .preview-file-name .file-name').text();
                 formData.thumbalready = obj.find('.video-thumbnail-field .preview-thumbnails img').attr('data-fid');				 
				}
				else{
                 uploaded_thumb.src = '';
			     uploaded_thumb.name = '';					
				}
			}			
            formData.uploaded_thumb	= uploaded_thumb;			
            return formData ;      
         }
        // rotate the video
        jQuery('.rotate-vdo').on('click', '.clock-rotate', function() {
          rotate = rotate + 5;
          v.style[prop] = 'rotate(' + rotate + 'deg) scale(' + zoom + ')';
        });
        jQuery('.rotate-vdo').on('click', '.ant-clock-rotate', function() {
          rotate = rotate - 5;
          v.style[prop] = 'rotate(' + rotate + 'deg) scale(' + zoom + ')';
        });
        // handtoll move video inside Work Area
        var coordinates = function(element) {
          element = jQuery(element);
          var top = element.position().top;
          var left = element.position().left;
          // $('#results').text('X: ' + left + ' ' + 'Y: ' + top);
        }
        jQuery('#video-editor-pan').draggable({
            //containment: "#stage",
           // scroll: false,
           cursor: "move",
          start: function() {
            coordinates('#video-editor-pane');
          },
          stop: function() {
            coordinates('#video-editor-pane');
          },
          drag: function( event, ui ) {
               var offset = jQuery(this).offset();
               var xPos = (offset.left) - jQuery(this).offsetParent().offset().left;
               var yPos = (offset.top) - jQuery(this).offsetParent().offset().top;
               var curruntZoom = zoom;
           // console.log(curruntZoom);
            // previewScale
            var previewScale = jQuery('.video-editor #stage').attr('data-previeScale');
          //  console.log(previewScale);
            var relativeVideoWidth = parseFloat(jQuery('#video-editor-pane').attr('width'))*curruntZoom;
           // console.log(relativeVideoWidth);
            var relativeVideoHeight = parseFloat(jQuery('#video-editor-pane').attr('height')*curruntZoom);
            var relativeStageWidth = parseFloat(jQuery("#stage").css("width"));
            var relativeStageHeight = parseFloat(jQuery("#stage").css("height"));
           }
        });

        // getVideoEditorOffset
        function getVideoEditorOffset(){
           var offsetValue = {};
           var offset = jQuery('#video-editor-pane').offset();
           var xPos = (offset.left) - jQuery('#video-editor-pane').offsetParent().offset().left;
           var yPos = (offset.top) - jQuery('#video-editor-pane').offsetParent().offset().top;
           offsetValue.xPos = xPos ;
           offsetValue.yPos = yPos ;
          return offsetValue; 
        }
        // get rotation
        // getRotationDegrees(jQuery('#video-editor-pane'));       
          function getRotationDegrees(obj) {
            var matrix = obj.css("-webkit-transform") ||
              obj.css("-moz-transform") ||
              obj.css("-ms-transform") ||
              obj.css("-o-transform") ||
              obj.css("transform");
            if (matrix !== 'none') {
              var values = matrix.split('(')[1].split(')')[0].split(',');
              var a = values[0];
              var b = values[1];
              var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
            } else {
              var angle = 0;
            }
            return (angle < 0) ? angle + 360 : angle;
          }
          
          function getVideoClipDuration(obj){
            var videoDuration = {};
            videoDuration.starting = obj.find('#starting-point').val();
            videoDuration.ending = obj.find('#ending-point').val();
            videoDuration.duration = obj.find('#result').val();
            return videoDuration; 
          }
        
        /* Array of possible browser specific settings for transformation */
        var properties = ['transform', 'WebkitTransform', 'MozTransform', 'msTransform', 'OTransform'],
          prop = properties[0];
        /* Iterators and stuff */
        var i, j, t;
        /* Find out which CSS transform the browser supports */
        for (i = 0, j = properties.length; i < j; i++) {
          if (typeof stage.style[properties[i]] !== 'undefined') {
            prop = properties[i];
            break;
          }
        }
 // rgb to hexa code converter
   var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");      
   function rgb2hex(rgb) {
            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
          }

  function hex(x) {
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
  }
// duration slider
        jQuery("#video-duration-slider").slider({
          animate: "slow",
          range: true,
          min: 0,
          max: slider_max_value,
          values: slider_value,
          slide: function(event, ui) {
              //console.log(event);
            var minValue = ui.values[0] + 'sec';
            var maxValue = ui.values[1] + 'sec';
            if ((ui.values[1] - ui.values[0]) < 5) {
             return false;
            }
            if(max_vdo_duration !== null && max_vdo_duration !== '') {
              if ((ui.values[1] - ui.values[0]) > max_vdo_duration) {
               return false;
              }   
            }
            jQuery('input.starting-point').val(ui.values[0]);
            jQuery('input.ending-point').val(ui.values[1]);
            jQuery('input.result').val(ui.values[1] - ui.values[0]);
            jQuery(".custom-tooltip-1").attr('title', minValue);
            jQuery(".custom-tooltip-2").attr('title', maxValue);
          }
        });
        //slider range data tooltip set
        var $handler = jQuery("#video-duration-slider .ui-slider-handle");
        $handler.eq(0).append("<div class='tooltip-wrap'><div class='custom-tooltip-1' data-toggle='tooltip' data-html='true' title='" + jQuery('#video-duration-slider').slider('values', 0) + "sec'></div></div>");
        $handler.eq(1).append("<div class='tooltip-wrap'><div class='custom-tooltip-2' data-toggle='tooltip' data-html='true' title='" + jQuery('#video-duration-slider').slider('values', 1) + "sec'></div></div>");
      }
    }
  }
})(jQuery, Drupal, drupalSettings);