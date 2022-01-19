(function($, Drupal, drupalSettings) {
  var initialized;
  Drupal.behaviors.custom_image_editor = {
    attach: function(context, settings) {
      if (!initialized) {
        var media_base_url = drupalSettings.media_base_url;
        var media_owner = drupalSettings.media_owner;
		var advanced_access = drupalSettings.advance_access;
		var media_data = drupalSettings.media_data;
		var selected_preset = media_data.selected_preset;
        // if no preset selected,default "Original Image" should be selected
        // get option value for "Original Image"
        var text = "Uploaded file";
        var default_preset_value = jQuery("#mediaPreset option").filter(function() {
          return jQuery(this).text() === text;
        }).first().attr("value");
		
        $('main', context).once('custom_image_editor').each(function() {
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
          jQuery('input#tags').importTags(jQuery('span.tags').text());
          if (jQuery('.tagsinput span.tag').length) {
            jQuery('.tagsinput input.tag-input').attr('placeholder', '');
          }
          jQuery('#tags_tagsinput').on('change', function(e) {
            var current_tag = jQuery(this).find('#tags_tag').val();
            if (current_tag != '') {
              jQuery('input#tags').addTag(current_tag);
            }
          });
      /*  if(media_data.media_data.source_type == 'uploaded' || media_data.media_data.source_type == null || media_data.media_data.source_type == 'Upload Modified'){
			jQuery('#mediaPreset').val(default_preset_value);	  
		}
		else if(media_data.media_data.source_type == 'generated'){
			jQuery("select#mediaPreset option[value='"+ default_preset_value + "']").attr('disabled', true); 
		    jQuery('#mediaPreset').val(selected_preset);
            jQuery('#mediaPreset').trigger('change'); 	  	
		} */
          // detect if right text form changed
          var formChanged = 0;
          jQuery('body').on('DOMSubtreeModified', '.wrap-photo-field-block', function() {
            formChanged = 1;
          });
          jQuery('.wrap-photo-field-block input, .wrap-photo-field-block textarea').change(function() {
            formChanged = 1;
          });
          // cancel button functionality
          jQuery("body").on('click', '.photo-field-block .photo-edit-form-cancel', function(e) {
            e.preventDefault();
            var destination = window.location.href.split("=");
            if (formChanged == 1) {
              jQuery("div#cancel-media-dialog").dialog({
                autoOpen: true,
                modal: true,
                width: 500,
                buttons: {
                  No: function() {
                    jQuery("div#cancel-media-dialog").dialog("close");
                  },
                  Yes: function() {
                    jQuery("div#cancel-media-dialog").dialog("close");
                    if (destination[1] === undefined || destination[1] === null) {
                      //console.log('no need to redirect');
                      location.reload();
                    } else {
                      window.location.replace(destination[1]);
                    }
                  },
                },
                close: function() {}
              });
            } else {
              if (destination[1] === undefined || destination[1] === null) {
                console.log('no need to redirect');
                location.reload();
              } else {
                window.location.replace(destination[1]);
              }
            }

          });
		  jQuery(".right-header").on('click','.background-check input.box-check',function (e) {
			  if(jQuery(this).is(":checked")){
			   jQuery(this).parents('li').find('.bg-wrap').removeClass('disabled');
			   var bg = jQuery('#colorSelector').css('background-color');
               jQuery('.cropit-preview').css('background-color', bg);
			  }
			  else{
			   jQuery(this).parents('li').find('.bg-wrap').addClass('disabled');
			   jQuery('.cropit-preview').css('background-color', '');

			 }

			});

		function renderImage(canvas, blob) {
			const ctx = canvas.getContext('2d')
			const img = new Image()
			img.onload = (event) => {
			   // console.log(event.target);
				ctx.drawImage(event.target, 0, 0)
			}
			  img.src = blob;
		}	
          // update title field based on preset selected
          jQuery('#mediaPreset').on('change', function(e) {
            var preset = jQuery(this).val();
			var preset_name = jQuery("#mediaPreset option:selected").text();
            if (preset > 0) {
				if(preset_name == "Custom Image Size"){
                 var preset_val = 0;
				}
				else if(preset_name == "Uploaded file"){
				 var preset_val = 0;
				}
				else{
				 var preset_val = 1;	
				}
            }
            var mid = 'default';
            // /getMediaUrl/ define in social media controller
            if (preset_val) {
              jQuery.ajax({
                url: '/getMediaUrl/' + mid,
                data: {
                  "mode": 'ajax',
                  "image_preset_tid": preset,
                },
                type: "GET",
                success: function(data) {
                  var current_dim = 'Preset dimensions: <span>' + parseInt(data.media_preset.width) + ' x ' + parseInt(data.media_preset.height) + ' px  </span>';
                  jQuery('.current-dimensions-field label').html(current_dim);
                  var preset_type = 'Preset type: <span>' + data.media_preset.image_format.toLowerCase() + '</span>';
                  jQuery('.preset-type-field label').html(preset_type);

                  if (jQuery('.original-preset-type-field span').text().trim().toLowerCase() == data.media_preset.image_format.toLowerCase()) {
                    jQuery('.preset-type-field button').addClass('invisible');
                   // jQuery('.photo-edit-form-footer button.photo-edit-form-save').removeClass('disabled');
                  } else {
                    jQuery('.preset-type-field button').removeClass('invisible');
                  //  jQuery('.photo-edit-form-footer button.photo-edit-form-save ').addClass('disabled');
                  }
				  
                }
              });
            } else {
		      if (preset_name == "Uploaded file") {		
              var current_dim = 'Preset dimensions: <span>' + jQuery('.original-dimensions-field span.og-dim').text() + '</span>';
              jQuery('.current-dimensions-field label').html(current_dim);
              var preset_type = 'Preset type: <span>' + jQuery('.original-preset-type-field span').text().trim().toLowerCase() + '</span>';
              jQuery('.preset-type-field label').html(preset_type);
              jQuery('.photo-edit-form-footer button.photo-edit-form-save').removeClass('disabled');
              jQuery('.preset-type-field button').addClass('invisible');
			  }
            }
          });


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
          // save as new image functionality
          jQuery("body").on('click', '.photo-field-block .photo-edit-form-save-new', function(e) {
            e.preventDefault();
            $this = jQuery(this);
            if (jQuery.trim(jQuery($this).parents('#image-editor-form').find('.wrap-photo-field-block .form-control.title-field').val()) == '') {
              form_warning_modal();
              var msg = 'Title field is required.';
              jQuery("#save-form-warning").html(msg);
              return;
            }
            jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
            var updated_media_data = {};
            var imageAfterCopped = {};
			var adjust = {};
            /*updated_media_data['imageData'] = jQuery('.image-editor').cropit('export', {
              type: 'image/jpeg',
              quality: 1.0,
              originalSize: true,
              fillBg: jQuery('#colorSelector').val(),
            });*/
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
            imageAfterCopped['rotation'] = getRotationDegrees(jQuery('.cropit-preview-image'));
            imageAfterCopped['exportZoom'] = jQuery('.image-editor').cropit('exportZoom');
			imageAfterCopped['data_fid'] = jQuery('.original-image').attr('data-fid');
			imageAfterCopped['data_original'] = jQuery('.original-image').attr('data-original');
            // console.log(imageAfterCopped);
		/*	adjust['brightness'] = parseInt(jQuery('.brightness').find('span.FilterValue').text());
			adjust['contrast'] =  parseInt(jQuery('.contrast').find('span.FilterValue').text());
			adjust['hue'] =  parseInt(jQuery('.hue').find('span.FilterValue').text());
			adjust['saturation'] =  parseInt(jQuery('.saturation').find('span.FilterValue').text());
			adjust['blur'] =  parseInt(jQuery('.blur').find('span.FilterValue').text());
			adjust['sharpen'] =  parseInt(jQuery('.sharpen').find('span.FilterValue').text());
            imageAfterCopped['adjust'] = adjust	;	
			console.log(adjust);*/
            updated_media_data['imageAfterCopped'] = imageAfterCopped;
			
            updated_media_data['mid'] = $this.attr('data-mid');
            if(jQuery('#mediaPreset').val()){
				updated_media_data['preset'] = jQuery('#mediaPreset').val();
            }else{
				updated_media_data['preset'] = default_preset_value;  
			}
            updated_media_data['preset_dimension'] = $this.parents('#image-editor-form').find('.current-dimensions-field label span').text().trim();
            updated_media_data['file_name'] = $this.parents('#image-editor-form').find('.wrap-photo-field-block span.file-name').text().trim();
            updated_media_data['title'] = $this.parents('#image-editor-form').find('.wrap-photo-field-block .form-control.title-field').val();
            updated_media_data['copy_right'] = $this.parents('#image-editor-form').find('.wrap-photo-field-block .form-control.copyright').val();
            updated_media_data['description'] = $this.parents('#image-editor-form').find('.form-control.description').val();
            updated_media_data['mkits'] = jQuery('.wrapped-all-checkboxes input[type=checkbox]:checked').map(function() {
              return jQuery(this).val()
            }).get();
            updated_media_data['remove_mkits'] = jQuery('.wrapped-all-checkboxes input[type=checkbox]:not(:checked)').map(function() {
              return jQuery(this).val()
            }).get();

            updated_media_data['tags'] = jQuery('#tags_tagsinput .tag .tag-text').map(function() {
              return jQuery(this).text()
            }).get();
            var archieve = 0;
            if (jQuery('.archieve-field .box-check').is(":checked")) {
              archieve = 1;
            }
            updated_media_data['archieve'] = archieve;
            var favorite = 0;
            if (jQuery('.favo-icon #favo').is(":checked")) {
              favorite = 1;
            }
            updated_media_data['favorite'] = favorite;
            updated_media_data['preset_type'] = jQuery('.preset-type-field span').text().toLowerCase().trim();
            var destination = window.location.href.split("=");
            if (destination[1] === undefined || destination[1] === null) {
              //console.log('no need to redirect');
              var current_url = destination[0].split("?");
              $redirect_url = current_url[0];
            } else {
              $redirect_url = destination[1];
            }

            jQuery.ajax({
              url: '/media-update/' + $this.attr('data-mid'),
              data: {
                "mode": 'ajax',
                "updated_media": updated_media_data,
				"advanced_access": advanced_access,
                "update": 'new',
                "redirect": $redirect_url,

              },
              type: "POST",
              success: function(data) {
                var destination = window.location.href.split("=");
                if (destination[1] === undefined || destination[1] === null) {
                  console.log('no need to redirect');
                  location.reload();
                  // jQuery('#overlay').remove();
                } else {
                  window.location.replace(destination[1]);
                  //jQuery('#overlay').remove();
                }
                jQuery('#overlay').remove();
              }
            });


          });
          var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");

          //Function to convert rgb color to hex format
          function rgb2hex(rgb) {
            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
          }

          function hex(x) {
            return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
          }

          // form warning modal
          function form_warning_modal() {
            jQuery('#save-form-warning').dialog({
              autoOpen: true,
              width: 500,
              height: 200,
              modal: true,
              resizable: false,
              buttons: {
                Ok: function() {
                  jQuery(this).dialog("close");
                }
              },

            });
          }
          //save button functionality
          jQuery("body").on('click', '.photo-field-block .photo-edit-form-save', function(e) {
            e.preventDefault();
            var $this = jQuery(this);
            if (jQuery.trim(jQuery($this).parents('#image-editor-form').find('.wrap-photo-field-block .form-control.title-field').val()) == '') {
              form_warning_modal();
              var msg = 'Title field is required.';
              jQuery("#save-form-warning").html(msg);
              return;
            }

            jQuery("div#save-media-dialog").dialog({
              autoOpen: true,
              width: 500,
              modal: true,
              buttons: {
                No: function() {
                  jQuery("div#save-media-dialog").dialog("close");
                },
                Yes: function() {
                  jQuery("div#save-media-dialog").dialog("close");
                  jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
                  var updated_media_data = {};
                  var imageAfterCopped = {};
				  var adjust = {};
                  /*updated_media_data['imageData'] = jQuery('.image-editor').cropit('export', {
                    type: 'image/jpeg',
                    quality: 1.0,
                    originalSize: true,
                    fillBg: jQuery('#colorSelector').val(),
                  }); */
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
                  imageAfterCopped['rotation'] = getRotationDegrees(jQuery('.cropit-preview-image'));
                  imageAfterCopped['exportZoom'] = jQuery('.image-editor').cropit('exportZoom');
				  imageAfterCopped['data_fid'] = jQuery('.original-image').attr('data-fid');
				  imageAfterCopped['data_original'] = jQuery('.original-image').attr('data-original');
                  // console.log(imageAfterCopped);
				 /* adjust['brightness'] = parseInt(jQuery('.brightness').find('span.FilterValue').text());
			      adjust['contrast'] =  parseInt(jQuery('.contrast').find('span.FilterValue').text());
				  adjust['hue'] =  parseInt(jQuery('.hue').find('span.FilterValue').text());
			      adjust['saturation'] =  parseInt(jQuery('.saturation').find('span.FilterValue').text());
				  adjust['blur'] =  parseInt(jQuery('.blur').find('span.FilterValue').text());
				  adjust['sharpen'] =  parseInt(jQuery('.sharpen').find('span.FilterValue').text());
                  imageAfterCopped['adjust'] = adjust	;	*/
                  updated_media_data['imageAfterCopped'] = imageAfterCopped;
                  updated_media_data['mid'] = $this.attr('data-mid');
				  if(jQuery('#mediaPreset').val()){
					  updated_media_data['preset'] = jQuery('#mediaPreset').val();
                  }else{
					updated_media_data['preset'] = default_preset_value;  
				  }
                  
                  updated_media_data['preset_dimension'] = $this.parents('#image-editor-form').find('.current-dimensions-field label span').text().trim();
                  updated_media_data['file_name'] = $this.parents('#image-editor-form').find('.wrap-photo-field-block span.file-name').text().trim();
                  updated_media_data['title'] = $this.parents('#image-editor-form').find('.wrap-photo-field-block .form-control.title-field').val();
                  updated_media_data['copy_right'] = $this.parents('#image-editor-form').find('.wrap-photo-field-block .form-control.copyright').val();
                  updated_media_data['description'] = $this.parents('#image-editor-form').find('.form-control.description').val();
                  updated_media_data['mkits'] = jQuery('.wrapped-all-checkboxes input[type=checkbox]:checked').map(function() {
                    return jQuery(this).val()
                  }).get();
                  updated_media_data['remove_mkits'] = jQuery('.wrapped-all-checkboxes input[type=checkbox]:not(:checked)').map(function() {
                    return jQuery(this).val()
                  }).get();

                  updated_media_data['tags'] = jQuery('#tags_tagsinput .tag .tag-text').map(function() {
                    return jQuery(this).text()
                  }).get();
                  var archieve = 0;
                  if (jQuery('.archieve-field .box-check').is(":checked")) {
                    archieve = 1;
                  }
                  updated_media_data['archieve'] = archieve;
                  var favorite = 0;
                  if (jQuery('.favo-icon #favo').is(":checked")) {
                    favorite = 1;
                  }
                  updated_media_data['favorite'] = favorite;
                  updated_media_data['preset_type'] = jQuery('.preset-type-field span').text().toLowerCase().trim();
                  var destination = window.location.href.split("=");
                  if (destination[1] === undefined || destination[1] === null) {
                    //console.log('no need to redirect');
                    var current_url = destination[0].split("?");
                    $redirect_url = current_url[0];
                  } else {
                    $redirect_url = destination[1];
                  }

                  jQuery.ajax({
                    url: '/media-update/' + $this.attr('data-mid'),
                    data: {
                      "mode": 'ajax',
                      "updated_media": updated_media_data,
					  "advanced_access": advanced_access,
                      "update": 'self',
                      "redirect": $redirect_url,
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
                    }
                  });
                },
              },
              create: function() {
                jQuery(this).closest(".ui-dialog").find(".ui-button").first().addClass("btn btn-cancel");
                // jQuery(this).closest(".ui-dialog").find(".ui-button").last().addClass("btn btn-primary custom-tweet-button");
              },
              close: function() {}
            });


          });

        });

      }
    }
	
  }
})(jQuery, Drupal, drupalSettings);