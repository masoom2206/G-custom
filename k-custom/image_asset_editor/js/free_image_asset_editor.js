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
                //var user_id = drupalSettings.user_id;
                // default preset selection
				jQuery('.download-button a').trigger('click');
                var default_preset_value = jQuery("#mediaPreset option").filter(function() {
                    return jQuery(this).text() === "Uploaded file";
                }).first().attr("value");
                jQuery('#mediaPreset').val(default_preset_value);
				if(getUrlParameter('email') == ""){
					// default modal load to grab email address
					jQuery('#main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
					var title = 'welcome to the image converter';
					var html_content = '<div class="text-align-left">';
					html_content += '<span>Please enter your email address to begin. This will be used to send you the converted image.</span>';
					html_content += '<div class="form-group" style="margin:20px;margin-bottom:30px;">';
					// html_content += '<label for="email">Step1: </label>';
					html_content += 'Step1: <input style="width:80%;margin-left: 10px;" type="email" id="email-modal" name="email" placeholder="ENTER YOUR EMAIL ADDRESS">';
					html_content += '</div>';
					html_content += '</div>';
					setTimeout(
						function() {
							jQuery('#overlay').remove();
							free_image_converter_modal(title, html_content, 'default').done(function() {
							}).fail(function() {
								// alert('cancel');
							});
						}, 2000);
				}
				else{
					jQuery('#image-editor-form #email').val(getUrlParameter('email'));
					jQuery('#image-editor-form #email').trigger('keyup');
					jQuery('.form-main-war').removeClass('disabled');
				}



					
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
                jQuery(document).on('click', '.cropit-preview-image-container', function(e) {
                    jQuery('.cp-app').hide('fast');
                    // focusout color picker input
                    jQuery("#colorSelector").blur();

                });

                // image upload field and steps disable if email field is blank.
                jQuery('#image-editor-form').on('keyup', 'input#email', function(e) {
                    if (jQuery(this).val()) {
                        jQuery('.form-main-war').removeClass('disabled');
                    } else {
                        jQuery('.form-main-war').addClass('disabled');
                    }
                });

                // submit process and send image functionality
                jQuery('#image-editor-form').on('click', '.photo-edit-form-save-new', function(e) {
                    e.preventDefault();
                    if (emailValidate(jQuery('input#email').val())) {
						jQuery('#main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
                       getExportedImageProperties(function(exportedImage){
							var imageProperties = {};
							imageProperties = exportedImage;
							jQuery.ajax({
							  url: '/image-converter-submit',
							  data: {
								"mode": 'ajax',
								"convertedImage": imageProperties,
							  },
							  type: "POST",
							  success: function(data) {
								  console.log(data);
								   var response =  0;
							   if(data.response){
									var title = 'your image has been sent';
									var html_content = '<div class="text-align-left">';
										html_content += '<p>The converted image has been sent to your email address:<br> '+data.email+'</p>' ;
										//html_content += '<p>'+data.download_url+'</p>' ;
										html_content += '<p>You should receive it within few minutes, if you do not receive it, please check your junk email folder.</p>' ;
										html_content += '<p>The download link in the email will be valid for 24 hours.</p>' ;
										html_content += '</div>';
									free_image_converter_modal(title, html_content, 'PROCESS_CONFIRMATION').done(function() {
									}).fail(function() {
										// alert('cancel');
										window.location.href = "/image-converter?email=" +data.email;
									});   
							   }
								  jQuery('#overlay').remove();
							  }
							}); 
						   
					   });
					   
                    } else {
                        //alert('invalid email Address');
                        var title = '';
                        var html_content = 'Email address is either blank or invalid. Please enter valid email address to continue.';
                        free_image_converter_modal(title, html_content, 'EMAIL_VALIDATION').done(function() {

                        }).fail(function() {
                            // alert('cancel');
                        });
                    }
                });
                // enable/ disable default load modal continue
                jQuery(document).on('keyup', 'input#email-modal', function(e) {
                    // Does some stuff and logs the event to the console
                    if (jQuery(this).val()) {
                        jQuery(".ui-dialog-buttonset button.cont").removeClass('disabled');
                    } else {
                        jQuery(".ui-dialog-buttonset button.cont").addClass('disabled');
                    }
                });
				function getUrlParameter(name) {
					name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
					var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
					var results = regex.exec(location.href);
					return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, '    '));
				};
				jQuery('#mediaPreset').on('change', function(e) {
					jQuery('#main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');  
				   var preset = jQuery(this).val();
				   var preset_name = jQuery("#mediaPreset option:selected").text();
				   
				   var default_preset_value = jQuery("#mediaPreset option").filter(function() {
                    return jQuery(this).text() === "Uploaded file";
                  }).first().attr("value");
				   jQuery("select#mediaPreset option[value='"+ default_preset_value + "']").attr('disabled', true); 
				   
					var mid = 'default';
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
					   var loaded_url = jQuery('.loaded-image').attr('data-src');
					   ReplaceResizeImage($imageCropper, loaded_url, data.media_preset.height, data.media_preset.width, 0, function(result) {
						   var preset_dimensions = parseInt(data.media_preset.width) + ' x ' + parseInt(data.media_preset.height) + ' px';
						   	jQuery('.preset-dim-field span.preset-dim').text(preset_dimensions);
							jQuery('.preset-type-field span.preset-type').text(data.media_preset.image_format.toLowerCase());
							jQuery('.photo-edit-form-save-new').removeClass('disabled');
						   jQuery('#overlay').remove();
					   });
					  }
                   });
				});

				
                // email validation
                function emailValidate(email) {
                    var check = "" + email;
                    if ((check.search('@') >= 0) && (check.search(/\./) >= 0))
                        if (check.search('@') < check.split('@')[1].search(/\./) + check.search('@')) return true;
                        else return false;
                    else return false;
                }

                // enable/disable background 
                jQuery(".right-header").on('click', '.background-check input.box-check', function(e) {
                    if (jQuery(this).is(":checked")) {
                        jQuery(this).parents('li').find('.bg-wrap').removeClass('disabled');
                        var bg = jQuery('#colorSelector').css('background-color');
                        jQuery('.cropit-preview').css('background-color', bg);
                    } else {
                        jQuery(this).parents('li').find('.bg-wrap').addClass('disabled');
                        jQuery('.cropit-preview').css('background-color', '');

                    }

                });
               
                function free_image_converter_modal(title, html_content, type) {
                    var def = jQuery.Deferred();
                    if (type == 'default') {
                        var cancel_text = 'cancel';
                        var cancel_button_class = 'btn btn-cancel font-fjalla';
                        var save_text = 'continue';
                        var save_button_class = 'btn cont disabled font-fjalla';
                    }
                    if (type == 'EMAIL_VALIDATION') {
                        var cancel_text = 'cancel';
                        var cancel_button_class = 'btn btn-cancel font-fjalla d-none';
                        var save_text = 'Okay';
                        var save_button_class = 'btn font-fjalla';
                    }
					if (type == 'PROCESS_CONFIRMATION'){
						var cancel_text = 'do another';
                        var cancel_button_class = 'btn font-fjalla btn-primary custom-btn';
                        var save_text = 'Okay';
                        var save_button_class = 'btn font-fjalla';
					}
                    var buttons = [{
                            text: cancel_text,
                            "class": cancel_button_class,
                            click: function() {
                                if (type == 'default') {
									jQuery(this).dialog("close");
                                     def.reject();
                                    //redirect to plan page
                                    window.location.href = "/plans";
                                }
								if (type == 'PROCESS_CONFIRMATION'){
									jQuery(this).dialog("close");
                                    def.reject();
									
								}
								

                            }
                        },
                        {
                            text: save_text,
                            "class": save_button_class,
                            click: function() {
                                if (type == 'default') {
                                    if (emailValidate(jQuery('input#email-modal').val())) {
                                        jQuery('#image-editor-form input#email').val(jQuery('input#email-modal').val());
                                        jQuery('.form-main-war').removeClass('disabled');
                                        jQuery(this).dialog("close");
                                        def.resolve();
                                    } else {
                                        jQuery('input#email-modal').after("<span class='email-null-error text-danger'>Please enter valid email.</span>");
                                        setTimeout(function() {
                                            jQuery('.email-null-error').remove();
                                        }, 3000);
                                    }
                                }
                                if (type == 'EMAIL_VALIDATION') {
                                    jQuery(this).dialog("close");
                                    def.resolve();
                                }
								if (type == 'PROCESS_CONFIRMATION'){
									jQuery(this).dialog("close");
                                    def.resolve();
									window.location.href = "/plans";
								}
                            }
                        }
                    ];
                    var modal_instance = '#free-image-converter';
                    jQuery(modal_instance).dialog({
                        autoOpen: true,
                        width: 500,
                        // height: 200,
                        modal: true,
                        resizable: false,
                        buttons: buttons,
                        open: function(event, ui) {
							
                            jQuery(modal_instance).dialog('option', 'title', title);
                            jQuery(modal_instance).html(html_content);
                            jQuery('.ui-dialog-buttonpane').find('.mkit').remove();
                            if (type == 'default') {
                                jQuery(this).next().append('<div class="mkit" style="padding:15px; padding-top:0;">Note: We recommend using a laptop or desktop computer for this feature.</div>');
								const $elem = jQuery(this).next();
                                $elem[0].style.setProperty('padding-top', '10px', 'important');
                            }

                        }
                    });
                    return def.promise();
                }
            }
        }
    };
})(jQuery, Drupal);

 function fn1 () {
    alert();
}
function getExportedImageProperties(callbackfn){
	var imageAfterCopped = {};
	  if(jQuery('.background-check input.box-check').is(":checked")){
	    imageAfterCopped['bgColor'] = (jQuery('#colorSelector').val() == '') ? '#000' : rgb2hex(jQuery('#colorSelector').val());
	  }
	  else{
		var preset_type = jQuery('.preset-type-field span').text().toLowerCase(); 
		if(preset_type == 'jpg' || preset_type == 'jpeg'){
			imageAfterCopped['bgColor'] = '#fff';
		}	
		 else{
			imageAfterCopped['bgColor'] = 'transparent'; 
		 }				
	}
	imageAfterCopped['offset'] = jQuery('.image-editor').cropit('offset');
	imageAfterCopped['currentZoom'] = jQuery('.image-editor').cropit('zoom');
	imageAfterCopped['exportZoom'] = jQuery('.image-editor').cropit('exportZoom');
    imageAfterCopped['preset'] = jQuery('#mediaPreset').val();
	imageAfterCopped['fid'] = jQuery('.loaded-image').attr('data-fid');
	imageAfterCopped['type'] = jQuery('.preset-type-field .preset-type').text();
	imageAfterCopped['dim'] = jQuery('.preset-dim-field .preset-dim').text();
	imageAfterCopped['uploaded_image_src'] = jQuery('.loaded-image').attr('data-src');
	imageAfterCopped['fid'] = jQuery('.loaded-image').attr('data-fid');
	imageAfterCopped['email'] = jQuery('#image-editor-form #email').val();
	callbackfn(imageAfterCopped);
	//return imageAfterCopped;
}
    var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
	  //Function to convert rgb color to hex format
	  function rgb2hex(rgb) {
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	  }
	  function hex(x) {
		return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
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
               /*if(!jQuery('.controls-wrapper button').hasClass('activated')){
                var currentZoom = $imageCropper.cropit('zoom');
                if(currentZoom == 1){
                    console.log('no display');
                   jQuery('.controls-wrapper button').addClass('invisible');  
                }
                else{
                   jQuery('.controls-wrapper button').removeClass('invisible'); 
                }
                 } */

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