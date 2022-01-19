/**
 * @file
 * Attaches behaviors for the social_media module.
 *
 */
(function($, Drupal) {
  var initialized;
  Drupal.behaviors.image_asset_editor = {
    attach: function(context, settings) {
      if (!initialized) {
        initialized = true;
        var user_id = drupalSettings.user_id;
        var media_base_url = drupalSettings.media_base_url;
        var media_data = drupalSettings.media_data;
        var selected_preset = media_data.selected_preset;
        jQuery('.original-image').attr('data-blob', media_data.mid_url); 
		jQuery('.original-image').attr('data-fid', media_data.fid);
		var text = "Uploaded file";
        var default_preset_value = jQuery("#mediaPreset option").filter(function() {
          return jQuery(this).text() === text;
        }).first().attr("value");
        if(media_data.media_data.source_type == 'uploaded' || media_data.media_data.source_type == null || media_data.media_data.source_type == 'Upload Modified'){
			jQuery('#mediaPreset').val(default_preset_value);
            localStorage.setItem("prevPreset", default_preset_value);			
		}
		else if(media_data.media_data.source_type == 'generated'){
			jQuery("select#mediaPreset option[value='"+ default_preset_value + "']").attr('disabled', true); 
		    jQuery('#mediaPreset').val(selected_preset);
			localStorage.setItem("prevPreset", selected_preset);
            jQuery('#mediaPreset').trigger('change'); 	  	
		}
		var original_dim = media_data.original_dim;
		var b = original_dim.split(" x ");
		var width = parseInt(b[0]);
		var height = parseInt(b[1]);
		var preset_dimensions_original = parseInt(width) + ' x ' + parseInt(height) + ' px';
      
        //color picker initialized
        var colors = jQuery('#colorSelector').colorPicker({
          customBG: '#222',
          readOnly: true,
          //delayOffset: 8, // pixels offset when shifting mouse up/down inside input fields before it starts acting as slider
          CSSPrefix: 'cp-', // the standard prefix for (almost) all class declarations (HTML, CSS)
          size: 3, // one of the 4 sizes: 0 = XXS, 1 = XS, 2 = S, 3 = L (large); resize to see what happens...
          allMixDetails: true, // see Colors...
          noAlpha: true, // disable alpha input (all sliders are gone and current alpha therefore locked)
          init: function(elm, colors) {
          },
          actionCallback: function(elm, action) { // callback on any action within colorPicker (buttons, sliders, ...)
            //console.log(action);
            var bg = jQuery('#colorSelector').css('background-color');
            jQuery('.cropit-preview').css('background-color', bg);
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
        // close color picker, if clicked on "work area"
        jQuery(document).on('click','.cropit-preview-image-container', function(e){
          jQuery('.cp-app').hide('fast');
          // focusout color picker input
          jQuery("#colorSelector").blur();
          
        });
        // image editor initialization
		jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
        $imageCropper = jQuery('.image-editor');
          jQuery('.image-editor .image-editor-header').find('li span.size').text(preset_dimensions_original);
          ReplaceResizeImage($imageCropper, media_data.mid_url, height, width, 0, function(result) {
			
		  	jQuery('#overlay').remove();  
        });
        // image editor ant-rotate
        jQuery('.ant-clock-rotate').click(function() {
          jQuery(this).parents('.image-editor').cropit('rotateCCW');
        });
        
        jQuery('.clock-rotate').click(function() {
          jQuery(this).parents('.image-editor').cropit('rotateCW');
        });
        // custom size 
     /*   jQuery('.image-editor-header').on('click', '.custom-size .box-check', function(e){
            if(jQuery(this).is(":checked")){
                jQuery("div#custom-size-modal").dialog({
                  autoOpen: true,
                  modal: true,
                  width:500,
                  height:245,
                  buttons: {
                    CANCEL: function() {
                      jQuery("div#custom-size-modal").dialog("close");
                      jQuery('.custom-size .box-check').prop("checked",false);
                      jQuery('#mediaPreset').removeAttr("disabled");
                      jQuery('#mediaPreset').trigger('change');
                      //remove error class
                      jQuery(this).find('#width').removeClass("ui-state-error"); 
                      jQuery(this).find('#height').removeClass("ui-state-error");

                    },
                    CONTINUE: function() {
                       var custom_width =  jQuery(this).find('#width').val();
                       var custom_height =  jQuery(this).find('#height').val();  
                       if(parseInt(custom_width) > 0 && parseInt(custom_height) > 0){
                         jQuery("div#custom-size-modal").dialog("close"); 
                         jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
                         jQuery('#mediaPreset').val('-1');
                         jQuery('#mediaPreset').attr("disabled",'true');
                        $imageCropper = jQuery('.image-editor');
                        jQuery($imageCropper).cropit('destroy');
                        jQuery('.image-editor .image-editor-header').find('li span.size').text(preset_dimensions_original);
                        ReplaceResizeImage($imageCropper, media_data.mid_url, custom_height, custom_width, 0, function(result) {
                          var get_title = jQuery('.photo-field-block .title-original').val();   
                          jQuery('#title').val(get_title); 
                          var current_dim = 'Custom dimensions: <span>' + parseInt(custom_width) + ' x ' + parseInt(custom_height) + ' px  </span>';
                          var preset_type = 'File type: <span>' + jQuery('.original-preset-type-field span').text().trim().toLowerCase() + '</span>';
                          jQuery('.preset-type-field button').addClass('invisible');
                          jQuery('.preset-type-field label').html(preset_type);
                          jQuery('.current-dimensions-field label').html(current_dim);
                          jQuery('.photo-edit-form-footer button.photo-edit-form-save').removeClass('disabled');

                          if ((parseInt(width) < parseInt(custom_width)) || (parseInt(height) < parseInt(custom_height))) {
                           jQuery('.controls-wrapper button').removeClass('invisible'); 
                           jQuery('.controls-wrapper button').addClass('activated');         
                          }
                          else{
                           jQuery('.controls-wrapper button').addClass('invisible');
                           jQuery('.controls-wrapper button').removeClass('activated');                   
                          } 
                          jQuery('#overlay').remove();
                        }) 
                       }
                       else if(custom_width == '' && custom_height == '' ){
                          jQuery(this).find('#width').addClass("ui-state-error"); 
                          jQuery(this).find('#height').addClass("ui-state-error");
                       }   
                       else if(custom_width == ''){
                           jQuery(this).find('#width').addClass("ui-state-error");
                       }
                       else if(custom_height == ''){
                           jQuery(this).find('#height').addClass("ui-state-error");
                       }                           
                                   
                    
                    },
                  },
                  close: function() {}
                 }); 
            }
            else{
                jQuery('#mediaPreset').removeAttr("disabled");
                jQuery('#mediaPreset').trigger('change');
            }
         }); */
       
        // change preset and load image again in image editor
         jQuery('#mediaPreset').on('change', function(e) {
          var preset = jQuery(this).val();
		  var preset_name = jQuery("#mediaPreset option:selected").text();
          if (preset > 0){
              if(preset_name == "Custom Image Size"){
				if(media_data.media_data.source_type == 'uploaded' || media_data.media_data.source_type == null || media_data.media_data.source_type == 'Upload Modified'){
				  jQuery('.photo-edit-form-footer button.photo-edit-form-save').addClass('disabled');	
                }					
                var preset_val = 0;
                jQuery("div#custom-size-modal").dialog({
                  autoOpen: true,
                  modal: true,
                  width:500,
                  height:245,
                  buttons: {
                    CANCEL: function() {
                      jQuery("div#custom-size-modal").dialog("close");
                     // jQuery('#mediaPreset').trigger('change');
					// console.log(localStorage.getItem("prevPreset"));
					 jQuery('#mediaPreset').val(localStorage.getItem("prevPreset"));
					  //jQuery('#mediaPreset').trigger('change');
                      //remove error class
                      jQuery(this).find('#width').removeClass("ui-state-error"); 
                      jQuery(this).find('#height').removeClass("ui-state-error");
                    },
                    CONTINUE: function() {
                       var custom_width =  jQuery(this).find('#width').val();
                       var custom_height =  jQuery(this).find('#height').val();  
                       if(parseInt(custom_width) > 0 && parseInt(custom_height) > 0){
                         jQuery("div#custom-size-modal").dialog("close"); 
                         jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
                        $imageCropper = jQuery('.image-editor');
                        jQuery($imageCropper).cropit('destroy');
                        jQuery('.image-editor .image-editor-header').find('li span.size').text(preset_dimensions_original);
						var original_image_url = jQuery('.original-image').attr('data-blob');
                        ReplaceResizeImage($imageCropper, original_image_url, custom_height, custom_width, 0, function(result) {
                          var current_dim = 'Custom dimensions: <span>' + parseInt(custom_width) + ' x ' + parseInt(custom_height) + ' px  </span>';
                          var preset_type = 'File type: <span>' + jQuery('.original-preset-type-field span').text().trim().toLowerCase() + '</span>';
                          jQuery('.preset-type-field button').addClass('invisible');
                          jQuery('.preset-type-field label').html(preset_type);
                          jQuery('.current-dimensions-field label').html(current_dim);
                          jQuery('.photo-edit-form-footer button.photo-edit-form-save').removeClass('disabled');

                          if ((parseInt(width) < parseInt(custom_width)) || (parseInt(height) < parseInt(custom_height))) {
                           jQuery('.controls-wrapper button').removeClass('invisible'); 
                           jQuery('.controls-wrapper button').addClass('activated');         
                          }
                          else{
                           jQuery('.controls-wrapper button').addClass('invisible');
                           jQuery('.controls-wrapper button').removeClass('activated');                   
                          } 
                          jQuery('#overlay').remove();
                        }) 
                       }
                       else if(custom_width == '' && custom_height == '' ){
                          jQuery(this).find('#width').addClass("ui-state-error"); 
                          jQuery(this).find('#height').addClass("ui-state-error");
                       }   
                       else if(custom_width == ''){
                           jQuery(this).find('#width').addClass("ui-state-error");
                       }
                       else if(custom_height == ''){
                           jQuery(this).find('#height').addClass("ui-state-error");
                       }                           
                    },
                  },
                  close: function() {}
                 }); 
                }	
				else if(preset_name == "Uploaded file"){
					if(media_data.media_data.source_type == 'uploaded' || media_data.media_data.source_type == null || media_data.media_data.source_type == 'Upload Modified'){
					  jQuery('.photo-edit-form-footer button.photo-edit-form-save').removeClass('disabled');	
					}					
					var preset_val = 0;
					jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
				    $imageCropper = jQuery('.image-editor');
					jQuery($imageCropper).cropit('destroy');
					localStorage.setItem("prevPreset", preset);
					jQuery('.image-editor .image-editor-header').find('li span.size').text(preset_dimensions_original);
					var original_image_url = jQuery('.original-image').attr('data-blob');
					ReplaceResizeImage($imageCropper, original_image_url, height, width, 0, function(result) {
					  jQuery('.controls-wrapper button').addClass('invisible');
					  jQuery('.controls-wrapper button').removeClass('activated');  
					  jQuery('#overlay').remove();
					})	
			    }
                else{
                 var preset_val = 1; 
				   if(media_data.media_data.source_type == 'uploaded' || media_data.media_data.source_type == null || media_data.media_data.source_type == 'Upload Modified'){
					  jQuery('.photo-edit-form-footer button.photo-edit-form-save').addClass('disabled');	
					}					
                }				
            			
            }

          var mid = 'default';
          if ( preset_val ) {
			
			localStorage.setItem("prevPreset", preset);  
			jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');  
            jQuery.ajax({
              url: '/getMediaUrl/' + mid,
              data: {
                "mode": 'ajax',
                "image_preset_tid": preset,
              },
              type: "GET",
              success: function(data) {
                $imageCropper = jQuery('.image-editor');
                jQuery($imageCropper).cropit('destroy');
				var original_image_url = jQuery('.original-image').attr('data-blob');
                ReplaceResizeImage($imageCropper, original_image_url, data.media_preset.height, data.media_preset.width, 0, function(result) {
                  var preset_dimensions = parseInt(data.media_preset.width) + ' x ' + parseInt(data.media_preset.height) + ' px';
                  jQuery('.image-editor .image-editor-header').find('li span.size').text(preset_dimensions);
                  if ((parseInt(width) < parseInt(data.media_preset.width)) || (parseInt(height) < parseInt(data.media_preset.height))) {
                   jQuery('.controls-wrapper button').removeClass('invisible'); 
                   jQuery('.controls-wrapper button').addClass('activated');         
                  }
                  else{
                   jQuery('.controls-wrapper button').addClass('invisible');
                   jQuery('.controls-wrapper button').removeClass('activated');                   
                  }                   
                  jQuery('#overlay').remove();
                });
              }
            });
          } 
		
        });
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
        function ReplaceResizeImage($imageCropper, image_src, media_preset_height, media_preset_width, is_popup, callback) {
          //'destroy not working as expected, below line is added.  this will remove already included image'
          $imageCropper.find('.cropit-preview-image-container').remove();

          if (is_popup) {
            $imageCropper.addClass('popup-class');
          }
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
                //src: 'your_image_path/to_be_crop_image.jpg',
              },
              //freeMove: 'true',
              minZoom: 'fill',
              maxZoom: 10,
              smallImage: 'allow',
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
      }
    }
  };
})(jQuery, Drupal);