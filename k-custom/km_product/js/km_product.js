var redirect_href_url = '';
var fitPageOnFirstLoad = true;
var user_action = drupalSettings.user_action;
var user_professional_access = drupalSettings.user_professional_access;
var uid = drupalSettings.uid;
console.log(uid);
var user_roles = drupalSettings.user_roles;
var kaboodle_nid = drupalSettings.kaboodle_nid;
var media_base_url = drupalSettings.media_base_url;
var producttype_id = drupalSettings.producttype_id;
//var producttype_id = 199;
jQuery(document).ready(function(){
  window.onload = function() {
    //load all fonts
    if(jQuery("#canvasFontFamily").length){
      kmdsFontsLoad();
    }
  }


  jQuery("div#kmds-product-container").on('click', '.preview', function(e) {
    var tid = jQuery(this).attr('tid');
    jQuery.ajax({
      type: "GET",
      url: '/kmds/design/web/product/'+tid+'/preview',
      dataType: 'json',
      beforeSend: function() {
        
      },
      success: function(response){
        var cheight = (window.innerHeight * 0.75);
        var cWidth = (window.innerWidth * 0.75);
        var render_link = '';
        if(response.template_type == 2 && response.media_id == 0) {
          render_link = '<div class="render-for-distribution"><a href="/km/product/'+response.node_id+'/'+response.product_id+'/template/settings/'+response.id+'?kmproduct=yes">Click here to render for distribution.</a></div>';
        }
        
        jQuery('<div/>', {"class": "g-dialog-container product-tpl kmds-static-image-modal d-block justify-content-center align-items-center visible"})
          .append(jQuery('<div/>', {"class": "g-dialog"})
            .append(jQuery('<div/>', {"class": "g-dialog-content", "id": "preview-dialog-content"})
              .append(render_link)
              .append(jQuery('<div/>', {"class": "d-grid"})
                .append(jQuery('<span/>', {"class": "d-block"})
                  .append(response.template_html)
                )
              )
            )
            .append(jQuery('<div/>', {"class": "g-dialog-footer"})
              .append(jQuery('<a/>', {'class': 'close-modal', 'href': 'javascript:void(0);', text: 'X'}))
            )
          ).appendTo('div#kmds-product-container');
          
        jQuery("div#preview-dialog-content").css({ "max-height": cheight+"px", "overflow-y": "auto" });
      },
    });
  });

  

 if (producttype_id == 'Online Gallery' || producttype_id == 'Playlist') {
    jQuery(".kn-product-start").on('click', '#kmStart', function(e) {
		jQuery('#main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
        if (producttype_id == 'Online Gallery') {
           var title = "IMAGE SELECTIONS";
        } else {
           var title = "PLAYLIST SELECTIONS";
        }

		if(jQuery(".main-container").hasClass("mk-selected")){

		  // var html_content = "<div>append editable item here </div>";
		  var type = 'editItem'	;	   		  
		  if(producttype_id == 'Online Gallery'){
			  var html_content_display2 = '';
		    jQuery('.gallery-item').each(function(i, obj) {
             var content=  jQuery(this).attr('data-sub-html');
             var name = jQuery(content).text();
			  var thumb = jQuery(this).attr('data-thumb');
				var original = jQuery(this).attr('data-src');
				var format = jQuery(this).attr('data-format');
				var gallery = jQuery(this).find('img').attr('src');
				var fid = jQuery(this).attr('data-fid');
			 
				html_content_display2 += "<tr style='background: #fff;' data-galleryUrl='"+gallery+"'  data-originalUrl='"+original+"' data-format='"+format+"' data-fid='"+fid+"'>";
				html_content_display2 += "<td style='border-bottom: 1px solid black;border-top: 1px solid black;border-left: 1px solid black; font-size: 18px;' class='reorder-icon'><i class='fa fa-arrows-alt'></i></td>";
				html_content_display2 += "<td style='border-bottom: 1px solid black;border-top: 1px solid black;' class='mid-image'><img src='"+thumb+"'/></td>";
				html_content_display2 += "<td style='border-bottom: 1px solid black;border-top: 1px solid black;width:290px' class='image-name'>" + name + "</td>";
				html_content_display2 += "<td style='border-bottom: 1px solid black;border-top: 1px solid black;border-right: 1px solid black;' class='img-format'>"+format+"</td>";
				html_content_display2 += "<td style='cursor: pointer;border: none; font-size: 18px;' class='remove-row'><i class='fa fa-trash-alt'></i></td>";
				html_content_display2 += "</tr>";
							 
           }); 
               var html_content = '<table class="continer-div" style="margin:0;border-spacing: 0 2px;">'+html_content_display2 +'</table>';	
             //  var html_content = html_content_display2;
		  }
		  else if (producttype_id == 'Playlist') {
           jQuery( "#playing-song-title2" ).remove();
            jQuery( "#audio-selector" ).removeClass( "d-none" );
			     var html_content_display2 = '';
		    jQuery('.web-playlist-template > tbody  > tr').each(function(index, tr) { 
          var gallery_item = {};
           gallery_item.img = tr.getElementsByClassName('p-image')[0].src;
          gallery_item.name = tr.getElementsByClassName('playlis-title')[0].innerHTML;
          gallery_item.duration = tr.getElementsByClassName('p-duration')[0].innerHTML; 
           gallery_item.url = tr.getElementsByClassName('p-url')[0].innerHTML;
           var format = tr.getElementsByClassName('p-formate')[0].innerHTML;
           var audio_url = tr.getElementsByClassName('p-audio-url')[0].innerHTML;
           var spanelement = tr.querySelector('.p-url');
           gallery_item.fid = spanelement.getAttribute('data-fid');
         
          html_content_display2 += "<tr style='background: #fff;'>";
          
                        html_content_display2 += "<td style='border-bottom: 1px solid black;border-top: 1px solid black;border-left: 1px solid black; font-size: 18px;' class='reorder-icon'><i class='fa fa-arrows-alt'></i></td>";
                        html_content_display2 += "<td style='border-bottom: 1px solid black;border-top: 1px solid black;' class='mid-image'><img  style='width: 25px; height: 26px;' src='" + gallery_item.img + "'/></td>";
                        html_content_display2 += "<td style='border-bottom: 1px solid black;border-top: 1px solid black;width:290px' class='image-name'>" + gallery_item.name + "</td>";
                         html_content_display2 += "<td style='border-bottom: 1px solid black;border-top: 1px solid black;border-right: 1px solid black;'' class='img-format'>" + format + "</td>";
                        html_content_display2 += "<td class='img-duration d-none'>" + gallery_item.duration + "</td>";
                        html_content_display2 += "<td class='img-original-url d-none' data-fid = '"+gallery_item.fid+"'>" + gallery_item.url + "</td>";
                        html_content_display2 += "<td class='img-audio-url d-none' >" + audio_url + "</td>";
                        html_content_display2 += "<td style='cursor: pointer;border: none; font-size: 18px;' class='remove-row'><i class='fa fa-trash-alt'></i></td>";
                        html_content_display2 += "</tr>";
       });
               var html_content = '<table class="continer-div" style="margin:0;border-spacing: 0 2px;">'+html_content_display2 +'</table>';	
             //  var html_content = html_content_display2;
		  }

		}
		else{
		   var html_content = "<div>Select a Media Kit to continue. </div>";
           var type = 'default'	;	   
		}
	   setTimeout(
		function() {
			jQuery('#overlay').remove();
			gallery_playlist_modal('cancel', 'save', title, html_content, type, producttype_id).done(function() {
			   // alert('save');
			}).fail(function() {
				// alert('cancel');
			});
		}, 2000);
    });
    jQuery("#left-sidebar").on('click', '.media-kit-images button', function(e) {
        jQuery('#main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
        var mkits = {};
        mkits = jQuery(this).parents('.media-kit-images').find('.media-kit-image input[type=checkbox]:checked').map(function() {
            return jQuery(this).parents('.media-kit-image').attr('data-value');
        }).get();
        var nid = mkits[0];
        jQuery('#left-sidebar-image-list-continer-inner').remove();
        if (jQuery('#left-sidebar-image-list-continer-inner').length) {
            jQuery('#left-sidebar-image-list-continer-inner').append('<table class="continer-div" style="margin:0;border-spacing: 0 2px;" id="image-list-continer-' + nid + '"></table>');
            var $elem = jQuery('#left-sidebar-image-list-continer-inner #image-list-continer-' + nid);
        } else {
            jQuery('#left-sidebar').append('<div id="left-sidebar-image-list-continer" style="display:none;"><div id="left-sidebar-image-list-continer-inner"><table class="continer-div" style="margin:0;border-spacing: 0 2px;" id="image-list-continer-' + nid + '"></table></div></div>');
            var $elem = jQuery('#left-sidebar-image-list-continer-inner #image-list-continer-' + nid);
        }
        var html_content_display = "";
        var media_kit_url = media_base_url + '/node/' + nid + '?_format=json';
        jQuery.getJSON(media_kit_url, function(result) {
            if (producttype_id == 'Online Gallery') {
                jQuery.each(result.field_vault_photo, function(key, val) {
                    var target_id = val.target_id;
                    var media_image_url = media_base_url + '/media/' + target_id + '/edit?_format=json';
                    jQuery.getJSON(media_image_url, function(image_url) {
                        var image_name = image_url.name[0].value;
                        image_name = image_name.replace("/var/tmp/", "");
                        var format = image_url.field_format[0].value;
                        var name = image_url.name[0].value;
                        var html_content_display2 = "";
						var fid = image_url.field_media_image[0].target_id;

                        html_content_display2 = "<tr style='background: #fff;' data-galleryUrl ='" + image_url.field_media_image[0].online_gallery_style_url + "'  data-originalUrl='" + image_url.field_media_image[0].original_url + "' data-format ='" + format.split('.').join("").toUpperCase() + "' data-fid='"+fid+"'>";

                        html_content_display2 += "<td style='border-bottom: 1px solid black;border-top: 1px solid black;border-left: 1px solid black; font-size: 18px;' class='reorder-icon'><i class='fa fa-arrows-alt'></i></td>";
                        html_content_display2 += "<td style='border-bottom: 1px solid black;border-top: 1px solid black;' class='mid-image'><img src='" + image_url.field_media_image[0].image_import_url + "'/></td>";
                        html_content_display2 += "<td style='border-bottom: 1px solid black;border-top: 1px solid black;width:290px' class='image-name'>" + image_name + "</td>";
                        html_content_display2 += "<td style='border-bottom: 1px solid black;border-top: 1px solid black;border-right: 1px solid black;'' class='img-format'>" + format.split('.').join("").toUpperCase() + "</td>";
                        html_content_display2 += "<td style='cursor: pointer;border: none; font-size: 18px;' class='remove-row'><i class='fa fa-trash-alt'></i></td>";
                        html_content_display2 += "</tr>";
                        $elem.append(html_content_display2);
                    });
                });
            } else {
                var i = 0;
                jQuery( "#playing-song-title2" ).remove();
                jQuery( "#audio-selector" ).removeClass( "d-none" );
                jQuery( "#shape-client-name" ).addClass( "shape" );
                jQuery( "#shape-description" ).addClass( "shape" );
                jQuery( "#shape-playlist-title" ).addClass( "shape" );
                jQuery( "#playlist-body").addClass( "shape" );
                jQuery( "#client-name" ).addClass( "token open-ckeditor" );
                jQuery( "#description" ).addClass( "token open-ckeditor" );
                jQuery( "#headline" ).addClass( "token open-ckeditor" );
                
                jQuery( "#shape-headline").addClass( "shape" );
                jQuery( "#playing-song-title" ).addClass( "token open-ckeditor" );
                jQuery( "#track_song_number" ).addClass( "token open-ckeditor" );
                jQuery( "#song_number" ).addClass( "token open-ckeditor" );
                
                jQuery.each(result.field_vault_audio, function(key, val) {
                    var target_id = val.target_id;
                    var media_image_url = media_base_url + '/media/' + target_id + '/edit?_format=json';
                    jQuery.getJSON(media_image_url, function(image_url) {
                        var image_name = image_url.name[0].value;
                        image_name = image_name.replace("/var/tmp/", "");
                        var img_url = '';
                        if (image_url.field_audio_image.length == 1) {
                           //a img_url = image_url.field_audio_image[0].original_url;
                           img_url = image_url.field_media_audio_file[0].default_url+'/default-playlist-image.png';
                        } else {
                            img_url = image_url.field_media_audio_file[0].default_url+'/default-playlist-image.png';
                        }
                        var format = '';
                        if (image_url.field_format != '') {
                            var format = image_url.field_format[0].value;
                        }
                        var duration = ''
                        if (image_url.field_duration != '') {
                            var duration_full = image_url.field_duration[0].value;
                            var durationarr = duration_full.split(":");
                            var duration = durationarr[1] + ":" + durationarr[2];
                        }
                        var original_url = ''
                        if (image_url.field_media_audio_file != '') {
                            var original_url = image_url.field_media_audio_file[0].original_url;
                        }
                        var name = image_url.name[0].value;

                        //
                        var fid = image_url.field_media_audio_file[0].target_id;
                        var html_content_display2 = "";

                        html_content_display2 = "<tr style='background: #fff;'>";

                        html_content_display2 += "<td style='border-bottom: 1px solid black;border-top: 1px solid black;border-left: 1px solid black; font-size: 18px;' class='reorder-icon'><i class='fa fa-arrows-alt'></i></td>";
                        html_content_display2 += "<td style='border-bottom: 1px solid black;border-top: 1px solid black;' class='mid-image'><img  style='width: 25px; height: 26px;' src='" + img_url + "'/></td>";
                        html_content_display2 += "<td style='border-bottom: 1px solid black;border-top: 1px solid black;width:290px' class='image-name'>" + image_name + "</td>";
                        html_content_display2 += "<td style='border-bottom: 1px solid black;border-top: 1px solid black;border-right: 1px solid black;'' class='img-format'>" + format + "</td>";
                        html_content_display2 += "<td class='img-duration d-none'>" + duration + "</td>";
                        html_content_display2 += "<td class='img-original-url d-none' data-fid='"+fid+"'>" + original_url + "</td>";
                        html_content_display2 += "<td class='img-audio-url d-none'>" + image_url.field_media_audio_file[0].audio_url + "</td>";
                        html_content_display2 += "<td style='cursor: pointer;border: none; font-size: 18px;' class='remove-row'><i class='fa fa-trash-alt'></i></td>";
                        html_content_display2 += "</tr>";
                        $elem.append(html_content_display2);
                        //

                    });
                })

            }

            setTimeout(
                function() {
                    jQuery('#overlay').remove();
                    if (producttype_id == 'Online Gallery') {
                        var title = "IMAGE SELECTIONS";
                        if (jQuery(".main-container").hasClass("mk-selected")) {
                            var html_content = 'Changing Media Kits will remove the previous entries from this gallery. Are  you sure you want to continue?';
                            gallery_playlist_modal('cancel', 'save', title, html_content, 'mkContinue', producttype_id).done(function() {
                                var html_content2 = jQuery('#left-sidebar-image-list-continer-inner').html();
                                gallery_playlist_modal('cancel', 'save', title, html_content2, 'nodefault', producttype_id).done(function() {
                                    jQuery('#left-sidebar-image-list-continer-inner').remove();
									jQuery( "#kmStart" ).removeClass( "disabled-kmstart" );
                                }).fail(function() {
                                    jQuery('#left-sidebar-image-list-continer-inner').remove();
                                });
                            }).fail(function() {});
                        } else {
                            var html_content = jQuery('#left-sidebar-image-list-continer-inner').html();
                            gallery_playlist_modal('cancel', 'save', title, html_content, 'nodefault', producttype_id).done(function() {
                                jQuery('#left-sidebar-image-list-continer-inner').remove();
								jQuery( "#kmStart" ).removeClass( "disabled-kmstart" );
                            }).fail(function() {
                                jQuery('#left-sidebar-image-list-continer-inner').remove();
                            });
                        }


                    } else {
                        var title = "PLAYLIST SELECTIONS";
                        if (jQuery(".main-container").hasClass("mk-selected")) {
                            var html_content = 'Changing Media Kits will remove the previous entries from this Playlist. Are  you sure you want to continue?';
                            gallery_playlist_modal('cancel', 'save', title, html_content, 'mkContinue', producttype_id).done(function() {
                                var html_content2 = jQuery('#left-sidebar-image-list-continer-inner').html();
                                gallery_playlist_modal('cancel', 'save', title, html_content2, 'nodefault', producttype_id).done(function() {
                                    jQuery('#left-sidebar-image-list-continer-inner').remove();
                                    jQuery( "#kmStart" ).removeClass( "disabled-kmstart" );
                                }).fail(function() {
                                    jQuery('#left-sidebar-image-list-continer-inner').remove();
                                });
                            }).fail(function() {});
                        } else {
                            var html_content = jQuery('#left-sidebar-image-list-continer-inner').html();
                            gallery_playlist_modal('cancel', 'save', title, html_content, 'nodefault', producttype_id).done(function() {
                                jQuery('#left-sidebar-image-list-continer-inner').remove();
                                jQuery( "#kmStart" ).removeClass( "disabled-kmstart" );
                            }).fail(function() {
                                jQuery('#left-sidebar-image-list-continer-inner').remove();
                            });
                        }
                    }

                    jQuery(function() {
                        jQuery(".continer-div tbody").sortable();
                        jQuery(".continer-div tbody").disableSelection();
                    });

                }, 2000);

        }).done(function() {
            jQuery(".media-kit-images .progress-overlay").remove();
        });
    });
    //load images on sidebar div while click on image checkbox
    jQuery("#left-sidebar").on('click', 'input#playlist', function(e) {
        var $this = jQuery(this);
        jQuery($this).parents('.media-kit-images').find('.mk-button-selector').addClass('disabled');
        jQuery('.media-kit-images input[type=checkbox]:checked').each(function() {
            jQuery(this).not($this).prop('checked', false);
            jQuery($this).parents('.media-kit-images').find('.mk-button-selector').removeClass('disabled');
        });
    });
    jQuery("body").on('click', '.ui-widget-content #mod-playlist-gallery td.remove-row', function(e) {
        var $this = jQuery(this);
        jQuery(this).parents('tr').remove();
    });

    //playlist track selected, in tracks list.
    jQuery('div#web-product-template').on('click','.playlis-track',function(e){
      e.stopPropagation();
      jQuery('#playlist-body').removeClass('selected-shape');
    });


    function gallery_playlist_modal(cancel, save, title, html_content, type, producttype_id) {
        var def = jQuery.Deferred();

        var mkits_title = {};
		var mk_title = '';
        if (type == 'default') {
            var save_button_class = 'btn btn-primary font-fjalla disabled actv-btn';
            var cancel_text = 'cancel';
            var save_text = 'save';
        } else if (type == 'nodefault') {
            var save_button_class = 'btn btn-primary font-fjalla actv-btn';
            var cancel_text = 'cancel';
            var save_text = 'save';
			mkits_title = jQuery('.media-kit-images').find('.media-kit-image input[type=checkbox]:checked').map(function() {
              return jQuery(this).parents('.media-kit-image').find('.media-kit-image-title').text();
            }).get();
			mk_title = mkits_title[0];
            jQuery(function() {
                jQuery(".continer-div tbody").sortable();
                jQuery(".continer-div tbody").disableSelection();
            });
        } else if (type == 'mkContinue') {
            var save_button_class = 'btn btn-primary font-fjalla actv-btn';
            var cancel_text = 'cancel';
            var save_text = 'continue';

        }else if (type == 'editItem'){
			var save_button_class = 'btn btn-primary font-fjalla actv-btn';
            var cancel_text = 'cancel';
            var save_text = 'save';
			mk_title = jQuery('#km-shape-mk-name #mk-name').text();
			jQuery(function() {
                jQuery(".continer-div tbody").sortable();
                jQuery(".continer-div tbody").disableSelection();
            });
		}
        var buttons = [{
                text: cancel_text,
                "class": 'btn btn-cancel font-fjalla',
                click: function() {
                    jQuery(this).dialog("close");
                    def.reject();
                }
            },
            {
                text: save_text,
                "class": save_button_class,
                click: function() {
                    if (type == 'nodefault' || type == 'editItem' ) {
                        if (producttype_id == 'Online Gallery') {
                            jQuery(".main-container").addClass("mk-selected");
							jQuery('#km-shape-mk-name #mk-name').text(mkits_title['0']);
							jQuery('#km-shape-mk-name #mk-name').addClass('open-ckeditor');
                            jQuery('#main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
                            var gallery_data = {};
                            gallery_data = jQuery('#mod-playlist-gallery.ui-widget-content table tr').map(function(index) {
                                var gallery_item = {};
                                gallery_item.name = jQuery(this).find('td.image-name').text();
                                gallery_item.img = jQuery(this).find('td.mid-image img').attr('src');
                                gallery_item.originalImg = jQuery(this).attr('data-originalUrl');
                                gallery_item.galleryImg = jQuery(this).attr('data-galleryUrl');
								gallery_item.format = jQuery(this).attr('data-format');
								gallery_item.fid = jQuery(this).attr('data-fid');
                                jQuery('#overlay').remove();
                                return gallery_item;
                            }).get();
                            let new_item = '';
                            let html = '';
                            let floag = 0;
                            let page = 0;
                            gallery_data.forEach(function(item, key) {
                                var key = key + 1;
                                // if(key / 9 <= 1){
							    		
                                new_item += '<div id="km-shape-gallery-image' + key + '" class="km-shape gallery-item r-item" data-thumb="'+ item.img +'" data-sub-html="<p>'+item.name+'</p>" data-src="' +item.originalImg+ '" data-format = "'+item.format+'" data-fid = "'+item.fid+'">';
								new_item += '<div class="km-content-overlay"></div>'
                                new_item += '<div style="" data-obj-type="km-gal-image" class="token open-ckeditor" id="km-gallery-image' + key + '" >';
                                new_item += '<img src="' + item.galleryImg + '" alt="gallery">'
                                new_item += '</div>'
								new_item += '<div class="km-content-details km-fadeIn-bottom">'
                                new_item += '<p style="font-family: Verdana">'+item.name+'</p>'
                                new_item += '</div>'
                                new_item += '</div>';
                                floag = floag + 1;
                                if (floag % 12 == 0) {
                                    //page completed, add wrapper
                                    page = floag / 12;
                                    if (page == 1) {
                                        html += '<div class="km-gallery-page km-gallery-item-page-1 active " data-page = "' + page + '" id="km-gall-1">';
                                    } else {
                                        html += '<div id="km-gall-'+page+'" class="km-gallery-page km-gallery-item-page-' + page + '" data-page = "' + page + '" >';
                                    }
									
                                    html += new_item;
                                    html += '</div>';
                                    new_item = '';

                                }
                                //}
                            });
                            if (floag % 12 > 0) {
                                //incomplete pages, having item less than 12
                                var nPage = page + 1;
                                if (nPage == 1) {
                                    html += '<div class="km-gallery-page km-gallery-item-page-1 active " data-page = "' + nPage + '" id="km-gall-1">';
                                } else {
                                    html += '<div class="km-gallery-page km-gallery-item-page-' + nPage + '" data-page = "' + nPage + '"  id="km-gall-'+ nPage+ '">';
                                }
							
                                html += new_item;
                                html += '</div>';
                                jQuery("#web-template .km-gallery").html(html);
                            } else {
                                jQuery("#web-template .km-gallery").html(html);
                            }



                            // define dynamic pagination 

                            var item_per_page = 12;
                            var total_pages = Math.ceil(gallery_data.length / item_per_page);
                            if (total_pages > 1) {
                                //var next = 'next';
                                let items = '<a onclick="selectPage(event, this, \'prev\')" href="#">«</a>';
                                for (let i = 1; i <= total_pages; i++) {
                                    // first page selected
                                    if (i == 1) {
                                        items += '<a onclick="selectPage(event, this, ' + i + ')" href="#" class="enable">' + i + '</a>';
                                    } else {
                                        items += '<a onclick="selectPage(event, this, ' + i + ')" href="#" class="">' + i + '</a>';
                                    }
                                }
                                items += '<a onclick="selectPage(event, this, \'next\')" href="#">»</a>';
                                jQuery('.km-gallery-pagination').show();
                                jQuery('.km-gallery-pagination').html(items);
                            } else {
                                //jQuery('.km-gallery-pagination').hide();
								jQuery('.km-gallery-pagination').html('');
                            }
                        } else {
                            var gallery_data = {};
                            jQuery("#web-template tbody tr").remove();
                            gallery_data = jQuery('#mod-playlist-gallery.ui-widget-content table tr').map(function(index) {
                                var gallery_item = {};
                                gallery_item.name = jQuery(this).find('td.image-name').text();
                                gallery_item.img = jQuery(this).find('td.mid-image img').attr('src');
                                gallery_item.duration = jQuery(this).find('td.img-duration').text();
                                gallery_item.original_url = jQuery(this).find('td.img-original-url').text();
                                gallery_item.audio_url = jQuery(this).find('td.img-audio-url').text()
                                gallery_item.format = jQuery(this).find('td.img-format').text();
                                gallery_item.fid = jQuery(this).find('td.img-original-url').attr('data-fid');

                                var index2 = index + 1;
                                console.log('index3' + index2);
                                jQuery('#web-template >  tbody').append("<tr   style='width: 100%;display: inline-table;'><td><div id='playlis-track" + index2 + "' class='playlis-track shape d-flex-p align-items-center-p'  style='padding: 10px; background: #fff;' ><div class='vol-up-wrap pl-1-p pr-2-p'><img class='val-up' style='width: 20px;' src='" + gallery_item.audio_url + "/volume-down.svg'></div><div><img class='p-image' src='" + gallery_item.img + "' style='width: 25px;height: 24px;'></div><div style='font-family: Verdana;  width: 100%; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; text-align: left;' id='kmmedia-playlis-title" + index2 + "' class='playlis-title token open-ckeditor pl-1-p pr-2-p' data-obj-type='text'>" + gallery_item.name + "</div><div style='color: grey; font-family: Verdana;'  class='p-duration pl-1-p pr-2-p token open-ckeditor' data-obj-type='text'>" + gallery_item.duration + "</div><span id='kmmedia-playlis-url" + index2 + "'  data-fid = '" + gallery_item.fid + "'  style='display: none;' class='p-url pl-1-p pr-2-p'>" + gallery_item.original_url + "</span><div class='p-formate  pl-1-p pr-2-p' style='display: none;'>" + gallery_item.format + "</div><div class='p-audio-url  pl-1-p pr-2-p' style='display: none;'>" + gallery_item.audio_url + "</div></div></td></tr>")

                                return gallery_item;
                            }).get();
                            var rowCount = jQuery('#web-template >tbody >tr').length;
                            jQuery("#web-template  #song_number").html('Tracks:'+rowCount);
                            jQuery(".main-container").addClass("mk-selected");
                        }
                    }

                    jQuery(this).dialog("close");

                    def.resolve();
                }
            }
        ];

        var modal_instance = '#mod-playlist-gallery';
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
				//console.log('hi');
				//console.log(html_content);
				jQuery('.ui-dialog-buttonpane').find('.mkit').remove();
				if (type == 'nodefault' || type == 'editItem') {
				jQuery('.ui-dialog-buttonpane').append('<div class="mkit" style="padding:15px">'+mk_title+'</div>');
				}
            }
        });
        return def.promise();
    }
}


   //confirmation  delete playlist 
   jQuery(".km2").click(function(event) {
	  var def = jQuery.Deferred();
    var title = jQuery(".km2").attr('data-title');
    var url = jQuery(".km2").attr('data-url');
    var url_ref = jQuery(".km2").attr('data-redirect');
	  var save_button_class = 'btn btn-primary font-fjalla actv-btn';
	  var buttons = [
        {
		  text: 'Cancel',
		  click: function() {
			jQuery(this).dialog( "close" );
			def.reject();
		  }
        },
        {
		  text:"Ok",
      "class": save_button_class,
		  click: function() {
      jQuery.ajax({
          url: url,
          type: 'GET',
          dataType: 'json', 
          success:function(data) {}
        });   
			jQuery(this).dialog( "close" );
			def.reject();
      jQuery(location).attr('href', url_ref)
		  }
      }
     ];	
      
	  var modal_instance = '#status-dialog';
	  jQuery(modal_instance).dialog({
		  autoOpen: true,
		  width: 500,
		  // height: 200,
		  modal: true,
		  resizable: false,
		  buttons: buttons,
		  open: function(event, ui) {
			jQuery(modal_instance).dialog('option', 'title', 'Product Delete');
			jQuery(modal_instance).html("Are you sure you want to delete \""+title+"\"? This cannot be undone.");
		  }
		});
	  return def.promise();
   });
   // end confirmation delete playlist

  //Close Image Modal Window
  //jQuery(document).on('click','.close-modal',function (e) {
  jQuery("#page").on('click','.close-modal',function (e) {
    if(jQuery(this).hasClass('user-redirect')){
      if(redirect_href_url != ''){
        window.location.href = redirect_href_url;
      }
      jQuery(".g-dialog-container").remove();
    }
    else if(jQuery(this).hasClass('delete-object')){
      deleteSelectedObject();
      jQuery(".g-dialog-container").remove();
    }
    else if(jQuery(this).hasClass('delete-element')){
      if(jQuery(".selected-element").length){
        jQuery(".selected-element").remove();
      }
      else if(jQuery(".selected-shape").length){
        jQuery(".selected-shape").remove();
      }
      jQuery(".g-dialog-container").remove();
    }
    else if(jQuery(this).hasClass('crop-continue')){
      jQuery(".g-dialog-container.crop-warning").remove();
    }
    else if(jQuery(this).hasClass('apply-image-crop')){
      jQuery('.g-dialog-container').append('<div class="progress-overlay km-overlay-center"><div class="spinner-border"></div></div>');
      jQuery('.g-dialog-container .spinner-border').css('color', '#e75e00');
      var image_attribute = {};
      var activeObj = canvas.getActiveObject();
      if(activeObj){
        if(activeObj.type == 'ImageContainer'){
          if(activeObj.containerImage != ''){
            activeObj = canvas.getItemById(activeObj.containerImage);
          }
        }
        var activeObj = canvas.getActiveObject();
        image_attribute['offset'] = jQuery('.km-image-editor').cropit('offset');
        image_attribute['currentZoom'] = jQuery('.km-image-editor').cropit('zoom');
        image_attribute['rotation'] = activeObj.angle;
        image_attribute['exportZoom'] = jQuery('.km-image-editor').cropit('exportZoom');
        image_attribute['fabricDPI'] = jQuery('#fabricDPI').val();
        image_attribute['selectedImageSize'] = jQuery('.km-image-editor .slider-wrapper .km-image-size').text();
        image_attribute['imageUrl'] = activeObj.src;
        var ArConstraint = (activeObj.imageArConstraint) ? activeObj.imageArConstraint : 'scale-crop';
        image_attribute['ArConstraint'] = ArConstraint;
        if(jQuery(".media-data").hasClass("active-gray")){
          var imgMid = jQuery(".media-data.active-gray").attr("data-fid");
          image_attribute['imgMid'] = imgMid;
          image_attribute['imageUrl'] = jQuery(".media-data.active-gray").attr("data-src");
        }
        else {
          image_attribute['imgMid'] = activeObj.imgfid;
        }
        jQuery.ajax({
          url: '/km-image-crop',
          data: {"image_attribute": JSON.stringify(image_attribute)},
          dataType: "json",
          type: "POST",
          success: function(data) {
            console.log(JSON.stringify(data));
            if(jQuery(".media-data").hasClass("active-gray")){
              var imgfid = jQuery(".media-data.active-gray").attr("data-fid");
              var filename = jQuery(".media-data.active-gray").attr("image-title");
              var ext = filename.substring(filename.lastIndexOf('.'));
              var basename = filename.split(ext)[0];
            }
            else {
              var imgfid = activeObj.imgfid;
              var basename = activeObj.name;
            }
            var imageWidth = activeObj.getScaledWidth();
            var imageHeight = activeObj.getScaledHeight();
            var img = new Image();
            img.src = data.cropImage;
            img.onload = function(){
              var scale_x = parseFloat(imageWidth/img.width);
              var scale_y = parseFloat(imageHeight/img.height);
              activeObj.setElement(img);
              activeObj.set({
                imgfid: imgfid,
                name: basename,
                src: data.cropImage,
                scaleX: (scale_x > 1 || ArConstraint !== 'scale-crop') ? 1 : scale_x,
                scaleY: (scale_y > 1 || ArConstraint !== 'scale-crop') ? 1 : scale_y,
              });
              canvas.renderAll();
              jQuery(".g-dialog-container").remove();
              if(activeObj.dynamicImageCorner){
                console.log("Width = "+activeObj.width+" :: Height = "+activeObj.height);
                var newval = activeObj.dynamicImageCorner;
                var rxw = (((activeObj.width/2)*newval)/100);
                var ryh = (((activeObj.height/2)*newval)/100);
                activeObj.dynamicImageCornerrxw = rxw;
                activeObj.dynamicImageCornerryh = ryh;
                canvas.renderAll();
              }
            }
          }
        });
      }
      else{
        jQuery(".g-dialog-container").remove();
      }
      /*var imgsrc = jQuery('.km-image-editor').cropit('export', {
        type: 'image/jpeg',
        quality: 1.0,
        originalSize: true
      });
      var obj = canvas.getActiveObject();
      if(obj){
        if(obj.type == 'ImageContainer'){
          if(obj.containerImage != ''){
            obj = canvas.getItemById(obj.containerImage);
          }
        }
        if(jQuery(".media-data").hasClass("active-gray")){
          var imgfid = jQuery(".media-data.active-gray").attr("data-fid");
          var filename = jQuery(".media-data.active-gray").attr("image-title");
          var ext = filename.substring(filename.lastIndexOf('.'));
          var basename = filename.split(ext)[0];
        }
        else {
          var imgfid = obj.imgfid;
          var basename = obj.name;
        }
        var img = new Image();
        img.src = imgsrc;
        img.onload = function(){
          obj.setElement(img);
          obj.set({
            imgfid: imgfid,
            name: basename,
            src: imgsrc,
          });
          canvas.renderAll();
          jQuery(".g-dialog-container").remove();
        }
      }*/
    }else if(jQuery(this).hasClass('wp-apply-image-crop')){
      var image_attribute = {};
      var imgMid = '';
      if(jQuery('div#web-product-template img.selected-element').length){
        console.log("apply length");
        var imagesrc = jQuery('div#web-product-template img.selected-element').attr('src');
        imgMid = jQuery("div#web-product-template img.selected-element").attr("imgfid");
      }
      else {
        var imagesrc = jQuery('div#web-product-template .selected-element img').attr('src');
        imgMid = jQuery("div#web-product-template .selected-element img").attr("imgfid");
      }      
      var arconstraint = jQuery('input#arconstraint').val();
      image_attribute['offset'] = jQuery('.km-image-editor').cropit('offset');
      image_attribute['currentZoom'] = jQuery('.km-image-editor').cropit('zoom');
      image_attribute['rotation'] = 0;
      image_attribute['exportZoom'] = jQuery('.km-image-editor').cropit('exportZoom');
      image_attribute['fabricDPI'] = 72;
      image_attribute['selectedImageSize'] = jQuery('input#image-dimensions').val();
      image_attribute['imageUrl'] = imagesrc;
      if(jQuery(".media-data").hasClass("active-gray")){
        imgMid = jQuery(".media-data.active-gray").attr("data-fid");
        image_attribute['imgMid'] = imgMid;
        image_attribute['imageUrl'] = jQuery(".media-data.active-gray").attr("data-src");
      }
      else {
        image_attribute['imgMid'] = (parseInt(imgMid) == 0) ? '' : parseInt(imgMid);
      }
      image_attribute['ArConstraint'] = arconstraint;  console.log("image_attribute = "+image_attribute);
      jQuery.ajax({
        url: '/km-image-crop',
        data: {"image_attribute": JSON.stringify(image_attribute)},
        dataType: "json",
        type: "POST",
        'beforeSend': function(){
          jQuery('.g-dialog-container').append('<div class="progress-overlay km-overlay-center"><div class="spinner-border"></div></div>');
          jQuery('.g-dialog-container .spinner-border').css('color', '#e75e00');
        },
        success: function(data) {
          console.log(JSON.stringify(data));
          //if(jQuery(".rcb-container .rcb-image").length && !jQuery(".rcb-blocks .rcb-container .rcb-image").length){
          if(jQuery('div#web-product-template img.selected-element').length){
            jQuery('div#web-product-template img.selected-element').attr('src', data.cropImage);
            jQuery('div#web-product-template img.selected-element').attr('imgfid', data.imgMid);
            jQuery('div#web-product-template img.selected-element').attr('imgcrop', 1);
          }
          else {
            jQuery('div#web-product-template .selected-element img').attr('src', data.cropImage);
            jQuery('div#web-product-template .selected-element img').attr('imgfid', data.imgMid);
          }
          jQuery(".media-data").removeClass("active-gray")
          jQuery(".g-dialog-container").remove();
        }
      });
      //jQuery(".g-dialog-container").remove();
    }
    else if(jQuery(this).hasClass('delete-object')){
      deleteSelectedObject();
      jQuery(".g-dialog-container").remove();
    }
    /*else if(jQuery(this).hasClass('km-render')){
      var title = jQuery("#title-original").val();
      if(title.trim() == ''){
        jQuery(".km-render-group.title-field .error").remove();
        jQuery(".km-render-group.title-field").append('<span class="error">Title field is required.</span>');
      }
      else {
        var type = jQuery("#page_format").val();
        var design_id = jQuery("#userTemplateName").attr('data-id');
        if(type == 'pdf'){
          var pdfImageURL = '/product/generate/'+design_id+'/pdf';
          //var pdfImageURL = '/admin/config/generate/'+design_id+'/pdf';
        }
        else {
          var pdfImageURL = '/product/generate/'+design_id+'/image';
          //var pdfImageURL = '/admin/config/generate/'+design_id+'/image';
        }
        var km_render = parseInt(jQuery("#km_render").val());
        jQuery(".km-render-group.title-field .error").remove();
        jQuery('.g-dialog-container').append('<div class="progress-overlay km-overlay-center"><div class="spinner-border"></div></div>');
        jQuery('.g-dialog-container .spinner-border').css('color', '#e75e00');
        jQuery.post(pdfImageURL, {"page_format": type}, function(response) {
          if(response){
            var response_data = JSON.parse(response);
            var image_url = response_data.image_url;
            //console.log("URL = "+image_url);
            var media_data = {};
            if(type == 'pdf'){
              var pdf_url = response_data.pdf_url;
              media_data['pdf_url'] = pdf_url;
            }
            media_data['image_url'] = image_url;
            media_data['preset'] = jQuery('#preset_tid').val();
            media_data['title'] = jQuery('#title-original').val();
            media_data['km_render'] = km_render;
            media_data['preset_type'] = type;
            media_data['description'] = jQuery('.description-field .form-control.description').val();
            media_data['mkits'] = jQuery('.wrapped-all-checkboxes input[type=checkbox]:checked').map(function() {
              return jQuery(this).val()
            }).get();
            if(km_render != 0){
              media_data['remove_mkits'] = jQuery('.wrapped-all-checkboxes input[type=checkbox]:not(:checked)').map(function() {
                return jQuery(this).val()
              }).get();
            }
            media_data['tags'] = jQuery('#km-render-tags_tagsinput .tag .tag-text').map(function() {
              return jQuery(this).text()
            }).get();
            var archieve = 0;
            if (jQuery('#km-render-archieve').is(":checked")) {
              archieve = 1;
            }
            media_data['archieve'] = archieve;
            var pageWidth = jQuery('#pageWidth').val();
            var pageHeight = jQuery('#pageWidth').val();
            media_data['preset_dimension'] = pageWidth+' x '+pageHeight+'px';
            jQuery.ajax({
              url: '/media-render',
              data: {
                //"mode": 'ajax',
                "media_data": JSON.stringify(media_data),
              },
              dataType: "json",
              type: "POST",
              success: function(data) {
                var page_settings = {'km_render' : data.mid};
                update_product_template(design_id, page_settings);
                setTimeout(function() {
                  jQuery(".g-dialog-container").remove();
                  console.log(JSON.stringify(data));
                  var user_node_nid = jQuery('#user_node_nid').val();
                  var producTypeId = jQuery('#producTypeId').val();
                  var redirect = '/km/product/'+user_node_nid+'/'+producTypeId+'/template/select?view=grid'
                  window.location.replace(redirect);
                }, 1000);
              }
            });
          }
        });
      }
    }*/else if(jQuery(this).hasClass('wp-render')){
      var title = jQuery("#title-original").val();
      if(title.trim() == ''){
        jQuery(".km-render-group.title-field .error").remove();
        jQuery(".km-render-group.title-field").append('<span class="error">Title field is required.</span>');
      }
      else {
        var media_data = {}; 
        media_data['node_id']       = jQuery('input#node_id').val();
        media_data['product_id']    = jQuery('input#product_id').val();
        media_data['render_id']     = jQuery('input#render_id').val();
        media_data['template_id']   = jQuery('input#template_id').val();
        media_data['title'] = jQuery('input#title-original').val();
        media_data['preset_type'] = 'text';
        media_data['description'] = jQuery('.description-field .form-control.description').val();
        // selected media kits 
        media_data['mkits'] = jQuery('.wrapped-all-checkboxes input[type=checkbox]:checked').map(function() {
          return jQuery(this).val()
        }).get();
        // remove media kits
        media_data['remove_mkits'] = jQuery('.wrapped-all-checkboxes input[type=checkbox]:not(:checked)').map(function() {
          return jQuery(this).val()
        }).get();
        // tags
        media_data['tags'] = jQuery('#km-render-tags_tagsinput .tag .tag-text').map(function() {
          return jQuery(this).text()
        }).get();
        media_data['archieve'] = 0;
        if (jQuery('#km-render-archieve').is(":checked")) {
          media_data['archieve'] = 1;
        }
        
        jQuery.ajax({
          url: '/web/product/render/save',
          data: {
            "mode": 'ajax',
            "media_data": media_data,
          },
          type: "POST",
          beforeSend: function(){
            jQuery(".km-render-group.title-field .error").remove();
            jQuery('.g-dialog-container').append('<div class="progress-overlay km-overlay-center"><div class="spinner-border"></div></div>');
            jQuery('.g-dialog-container .spinner-border').css('color', '#e75e00');
          },
          success: function(data) {
            var redirect = '/km/product/'+data.node_id+'/'+data.product_id+'/template/select?view=grid';
            window.location.replace(redirect);
          }
        });
      }
    }
    else if(jQuery(this).hasClass('km-render')){
      var title = jQuery("#title-original").val();
      if(title.trim() == ''){
        jQuery(".km-render-group.title-field .error").remove();
        jQuery(".km-render-group.title-field").append('<span class="error">Title field is required.</span>');
      }
      else {
        var type = jQuery("#page_format").val();
        var design_id = jQuery("#userTemplateName").attr('data-id');
        var km_cmyk = 0;
        var km_bleed = 0;
        if(type == 'pdf'){
          var pdfImageURL = '/product/generate/'+design_id+'/pdf';
          //var pdfImageURL = '/admin/config/generate/'+design_id+'/pdf';
          if (jQuery('#km-render-cmyk').is(":checked")) {
            km_cmyk = 1;
          }
          if (jQuery('#km-render-bleed').is(":checked")) {
            km_bleed = 1;
          }
        }
        else {
          var pdfImageURL = '/product/generate/'+design_id+'/image';
          //var pdfImageURL = '/admin/config/generate/'+design_id+'/image';
        }
        var km_render = parseInt(jQuery("#km_render").val());
        jQuery(".km-render-group.title-field .error").remove();
        jQuery('.g-dialog-container').append('<div class="progress-overlay km-overlay-center"><div class="spinner-border"></div></div>');
        jQuery('.g-dialog-container .spinner-border').css('color', '#e75e00');
        var page_settings = {'km_cmyk' : km_cmyk, 'km_bleed' : km_bleed};
        var settings = {
          "url":access_check_api + "product/" + design_id,
          "method": "PUT",
          "timeout": 0,
          "headers": {
            "Authorization": "bearer " + API_KEY,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          "data": page_settings
        };
        jQuery.ajax(settings).done(function (response) {
          console.log(response);
          //console.log('Product template updated');
          jQuery.post(pdfImageURL, {"page_format": type}, function(response) {
            if(response){
              var response_data = JSON.parse(response);
              var image_url = response_data.image_url;
              //console.log("URL = "+image_url);
              var media_data = {};
              if(type == 'pdf'){
                var pdf_url = response_data.pdf_url;
                media_data['pdf_url'] = pdf_url;
              }
              media_data['image_url'] = image_url;
              media_data['preset'] = jQuery('#preset_tid').val();
              media_data['title'] = jQuery('#title-original').val();
              media_data['km_render'] = km_render;
              media_data['preset_type'] = type;
              media_data['description'] = jQuery('.description-field .form-control.description').val();
              media_data['mkits'] = jQuery('.wrapped-all-checkboxes input[type=checkbox]:checked').map(function() {
                return jQuery(this).val()
              }).get();
              if(km_render != 0){
                media_data['remove_mkits'] = jQuery('.wrapped-all-checkboxes input[type=checkbox]:not(:checked)').map(function() {
                  return jQuery(this).val()
                }).get();
              }
              media_data['tags'] = jQuery('#km-render-tags_tagsinput .tag .tag-text').map(function() {
                return jQuery(this).text()
              }).get();
              var archieve = 0;
              if (jQuery('#km-render-archieve').is(":checked")) {
                archieve = 1;
              }
              media_data['archieve'] = archieve;
              media_data['km_cmyk'] = km_cmyk;
              media_data['km_bleed'] = km_bleed;
              var pageWidth = jQuery('#pageWidth').val();
              var pageHeight = jQuery('#pageHeight').val();
              media_data['preset_dimension'] = pageWidth+' x '+pageHeight+'px';
              console.log(JSON.stringify(media_data));
              jQuery.ajax({
                url: '/media-render',
                data: {
                  //"mode": 'ajax',
                  "media_data": JSON.stringify(media_data),
                },
                dataType: "json",
                type: "POST",
                success: function(data) {
                  var page_settings = {'km_render' : data.mid};
                  update_product_template(design_id, page_settings);
                  setTimeout(function() {
                    jQuery(".g-dialog-container").remove();
                    console.log(JSON.stringify(data));
                    var user_node_nid = jQuery('#user_node_nid').val();
                    var producTypeId = jQuery('#producTypeId').val();
                    var redirect = '/km/product/'+user_node_nid+'/'+producTypeId+'/template/select?view=grid'
                    window.location.replace(redirect);
                  }, 1000);
                }
              });
            }
          });
        });
      }
    }
    else if(jQuery(this).hasClass('del-article')){
      jQuery('.g-dialog-container').append('<div class="progress-overlay km-overlay-center"><div class="spinner-border"></div></div>');
      jQuery('.g-dialog-container .spinner-border').css('color', '#e75e00');
      var nid = jQuery('.delete-article.active').attr('article')
      var deleteURL = '/tools/html-article/'+nid+'/delete'
      jQuery.post(deleteURL, {"page_format": type}, function(response) {
        if(response){
          jQuery('.delete-article').removeClass("active");
          jQuery(".g-dialog-container").remove();
          var redirect = '/tools/html-article/'+uid
          window.location.replace(redirect);
        }
      });
    }
    else if(jQuery(this).hasClass('upgrade-user')){
      jQuery(".g-dialog-container").remove();
      var redirect = '/tools/profile/'+uid+'/billing'
      window.location.replace(redirect);
    }
    else{
      jQuery(".g-dialog-container").remove();
    }
  });
  
  //slide media kit panel
  jQuery("#media-kit-title-slide-right").click(function(){
    jQuery(".product-container .right-panel").removeClass("col-lg-11").addClass("col-lg-9");
    jQuery(".sidebar-container.slide-right").removeClass("d-block").addClass("d-none");
    
    jQuery( ".sidebar-container.slide-left" ).toggle(1000, function() {
      jQuery(".product-container .left-panel").removeClass("closed-media-kit").addClass("opened-media-kit");
      jQuery("#media-kit-title-slide-left").addClass("active");
      jQuery("#media-kit-title-slide-right").removeClass("active");
      // only for the page having canvas
      if(jQuery("div#canvas-container").length == 1) {
        var w1 = window.outerWidth;
        var w2 = jQuery(".right-panel").width();
        if(w2 > w1){
          canvas.setWidth(w2);
        }
        else {
          canvas.setWidth(w1);
        }
        fitCanvasCenter();
      }else{
        jQuery("div#left-sidebar").removeClass("col-lg-1").addClass("col-lg-3");
      }
    });
  });
  
  jQuery("#media-kit-title-slide-left").click(function(){
    jQuery( ".sidebar-container.slide-left" ).toggle(1000, function() {
      jQuery(".product-container .left-panel").removeClass("opened-media-kit").addClass("closed-media-kit");
      jQuery(".product-container .right-panel").removeClass("col-lg-9").addClass("col-lg-11");
      jQuery(".sidebar-container.slide-right").removeClass("d-none").addClass("d-block");
      jQuery("#media-kit-title-slide-left").removeClass("active");
      jQuery("#media-kit-title-slide-right").addClass("active");
      // only for the page having canvas
      if(jQuery("div#canvas-container").length == 1) {
        var w1 = window.outerWidth;
        var w2 = jQuery(".right-panel").width();
        if(w2 > w1){
          canvas.setWidth(w2);
        }
        else {
          canvas.setWidth(w1);
        }
        fitCanvasCenter();
      }else{
        jQuery("div#left-sidebar").removeClass("col-lg-3").addClass("col-lg-1");
      }
    });
  });
  
  //Displayed modal window before return and cancel button click if changes has not saved.
  jQuery(".return-cancel-edit-template").click(function(e){
    e.preventDefault();
    var save_temp = jQuery("#save_km_template").val();
    if(kmTemplateChanged && save_temp == 1){
      redirect_href_url = jQuery(this).attr("href");
      kmModalWindow("Any unsaved changes may be lost.");
      jQuery(".g-dialog-footer .btn-primary").addClass("user-redirect");
    }
    else {
      var href_url = jQuery(this).attr("href");
      window.location.href = href_url;
    }
  });
  
  //Replace image file at canvas after click on image name
  jQuery(".media-kit-images").on('click','.media-kit-image .media-data',function (e) {
    jQuery(".media-kit-image .media-data").removeClass("active-gray");
    jQuery(this).addClass("active-gray");
    //jQuery("#kmImageCrop").addClass("active");
    if((jQuery(".km-image-crop-modal").length > 0) || (jQuery(".kmwp-image-crop-modal").length > 0)) {
      if(jQuery('div.km-image-editor div.cropit-preview div.spinner-border').length == 0) {
        jQuery('div.km-image-editor div.cropit-preview').append('<div class="spinner-border"></div>');
        jQuery(".g-dialog-container .btn-primary").addClass("disabled");
      }
      // screen size
      var wInnerWidth = parseInt(window.innerWidth*0.75);
      var wInnerHeight = parseInt(window.innerHeight*0.75);
      
      if(jQuery('div#my-kaboodle-web-product-edit').length > 0) {
        // selected image object for web products
        var block_id = jQuery('div#web-product-template .selected-element').attr('id');
        // image area size
        var imageWidth = jQuery('#'+block_id).width();
        var imageHeight = jQuery('#'+block_id).height();
        if(imageWidth == imageHeight){
          imageWidth = 1080;
          imageHeight = 1080;
        }
        else if(imageWidth > imageHeight){
          var scale = 1920 / imageWidth;
          imageWidth = imageWidth*scale;
          imageHeight = imageHeight*scale;
        }
        else if(imageWidth < imageHeight){
          var scale = 1080 / imageHeight;
          imageWidth = imageWidth*scale;
          imageHeight = imageHeight*scale;
        }
      }else{
        var obj = canvas.getActiveObject();
        if(obj){
          var imgWidth = obj.width;
          var imgHeight = obj.height;
          var objWidth = obj.width*obj.scaleX;
          var objHeight = obj.height*obj.scaleY;
          var imageWidth = obj.getScaledWidth();
          var imageHeight = obj.getScaledHeight();
        }
      }
      var $this = jQuery(".media-data.active-gray");
      var imgsrc = jQuery($this).attr("data-src");
      //load image to get the image size.
      var fileReader = new FileReader();
      var dataurl = imgsrc;
      var request = new XMLHttpRequest();
      request.open('GET', dataurl, true);
      request.responseType = 'blob';
      request.onload = function() {
        fileReader.readAsDataURL(request.response);
      };
      request.send();
      fileReader.onload = function(event) {
        var cropWarning = false;
        var img = new Image();
        img.onload = function() {
          if(objWidth > img.width || objHeight > img.height){
            cropWarning = true;
          }
          console.log("imageWidth = "+imageWidth+", imageHeight = "+imageHeight);
          $imageCropper = jQuery('.km-image-editor');
          ReplaceResizeImage($imageCropper, imgsrc, imageWidth, imageHeight, 0, function(result) {
            if(cropWarning){
              kmModalWindow("One or both of your selected image's dimensions are smaller than the designed size. Continuing may result in a poor fit, cropping, and/or loss of quality. Your original will not be altered.");
              jQuery(".g-dialog-footer .btn-primary").addClass("crop-continue");
              jQuery(".g-dialog-footer .btn-primary").text("Continue");
              jQuery(".g-dialog-container").addClass("crop-warning");
              jQuery("#km-image-editor").removeClass("crop-warning");
            }
            var image_dimensions = parseInt(imageWidth) + ' x ' + parseInt(imageHeight);
            jQuery('.km-image-editor .slider-wrapper .km-image-size').text(image_dimensions);
            console.log(result);
            jQuery(".g-dialog-container .btn-primary").removeClass("disabled");
          });
        }
        img.src = event.target.result;
      };
    }
  });
  
  /*jQuery(document).on('click','.media-kit-image .media-data .kit-name',function (e) {
    jQuery("#canvas-wrapper").append(
      jQuery("<div/>", {"class": "progress-overlay replace-image"}).append(
        jQuery("<div/>", {"class": "spinner-border"})
      )
    );
    var imgsrc = jQuery(this).parent(".media-data").attr("data-src");
    var imgfid = jQuery(this).parent(".media-data").attr("data-fid");
    var index = imgsrc.lastIndexOf("/") + 1;
    var filename = imgsrc.substr(index);
    var ext = filename.substring(filename.lastIndexOf('.'));
    var basename = filename.split(ext)[0];
    var obj = canvas.getActiveObject();
    if(obj){
      var img = new Image();
      img.src = imgsrc;
      img.onload = function(){
        obj.setElement(img);
        obj.set({
          imgfid: imgfid,
          name: basename,
        });
        canvas.renderAll();
        jQuery(".progress-overlay.replace-image").remove();
      }
    }
  });*/
  
  
  //Hide zoom list after click out side.
  jQuery("body").click(function (e) {
    if(!jQuery(e.target).hasClass('kmzoom')){
      jQuery('ul.g-menu.g-menu-bottom.fixed.zoomb').removeClass('d-inline');
    }
  });

  //Canvas object lock/unlock functionality
  jQuery(".object-action.lock").click(function(){
    //lock all objects
    var obj_sec = jQuery(this).attr("obj_sec");
    lockCanvasObjects();
    if(obj_sec){
      jQuery("."+obj_sec+" .object-action.lock").addClass("d-none");
      jQuery("."+obj_sec+" .object-action.unlock").removeClass("d-none");
      var lock_access = false;
      var obj = canvas.getActiveObject();
      if(obj.type == 'image'){
        lock_access = true;
      }
      else if(user_professional_access == 0 && obj.type !== 'image'){
        lock_access = true;
      }
      if(lock_access){
        if(obj){
          obj.lock_position = 0;
          obj.lockMovementX = false;
          obj.lockMovementY = false;
          obj.lockScalingX = false;
          obj.lockScalingY = false;
          obj.lockRotation = false;
          obj.hasControls = true;
          obj.selectable = true;
          obj.hasBorders = true;
          obj.borderColor = '#2880E6';
          obj.editable = true;
          canvas.renderAll();
          canvas.setActiveObject(obj);
          jQuery('.km-smart-guides').removeAttr('disabled');
          smartGuideStatus = 0;
        }
      }
    }
  });
  jQuery(".object-action.unlock").click(function(){
    //lock all objects
    lockCanvasObjects();
    var obj_sec = jQuery(this).attr("obj_sec");
    if(obj_sec){
      jQuery("."+obj_sec+" .object-action.unlock").addClass("d-none");
      jQuery("."+obj_sec+" .object-action.lock").removeClass("d-none");
      jQuery(this).addClass("d-none");
      jQuery(".object-action.lock").removeClass("d-none");
      var lock_access = false;
      var obj = canvas.getActiveObject();
      if(obj.type == 'image'){
        lock_access = true;
      }
      else if(user_professional_access == 0 && obj.type !== 'image'){
        lock_access = true;
      }
      if(lock_access){
        if(obj){
          obj.lock_position = 1;
          obj.lockMovementX = true;
          obj.lockMovementY = true;
          obj.lockScalingX = true;
          obj.lockScalingY = true;
          obj.lockRotation = true;
          obj.hasControls = false;
          obj.selectable = true;
          obj.hasBorders = true;
          obj.borderColor = '#eb2cf6';
          obj.editable = true;
          canvas.renderAll();
          canvas.setActiveObject(obj);
          jQuery(".km-smart-guides").prop( "checked", false);
          smartGuideStatus = 0;
          _removeGuide();
          jQuery('.km-smart-guides').attr('disabled', 'disabled');
        }
      }
    }
  });
  //Canvas add new (clone) object functionality
  jQuery(".object-action.add-new").click(function(){
    if(jQuery.inArray('content_creator', user_roles ) !== -1 && jQuery.inArray('advanced_content_creator', user_roles ) == -1){
      professional_user_modal();
    }
    else if(user_professional_access == 0){
      var obj = canvas.getActiveObject();
      if(obj){
        lockCanvasObjects();
        var objs = canvas._objects.filter(function(o){
          if (o.layerIndexing){
            return o;
          }
        });
        var objIndex = parseInt(objs.length + 1);
        //console.log(JSON.stringify(objs))
        var obj_sec = jQuery(this).attr("obj_sec");
        layer_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        obj.clone(function(clonedObj) {
          canvas.discardActiveObject();
          clonedObj.set({
            left: clonedObj.left + 50,
            top: clonedObj.top + 50,
            evented: true,
            id: layer_id,
            lock_position: 0,
            layerIndexing: objIndex,
          });
          clonedObj.lockMovementX = false;
          clonedObj.lockMovementY = false;
          clonedObj.lockScalingX = false;
          clonedObj.lockScalingY = false;
          clonedObj.lockRotation = false;
          clonedObj.hasControls = true;
          clonedObj.selectable = true;
          clonedObj.hasBorders = true;
          clonedObj.borderColor = '#2880E6';
          clonedObj.editable = true;
          canvas.add(clonedObj);
          clonedObj.setCoords();
          canvas.setActiveObject(clonedObj);
          canvas.moveTo(clonedObj, objIndex);
        });
        canvas.requestRenderAll();
        jQuery("."+obj_sec+" .object-action.lock").addClass("d-none");
        jQuery("."+obj_sec+" .object-action.unlock").removeClass("d-none");
        //lockCanvasObjects();
      }
    }
  });
  //Canvas bringforward object functionality
  jQuery(".object-action.bringforward").click(function(){
    var obj = canvas.getActiveObject();
    if(obj){
      lockCanvasObjects();
      var objs = canvas._objects.filter(function(o){
        if (o.layerIndexing){
          return o;
        }
      });
      var objTotal = parseInt(objs.length);
      if(obj.layerIndexing){
        var layerIndex = parseInt(obj.layerIndexing);
        var objIndex = parseInt(layerIndex + 1);
        if(objIndex <= objTotal){
          canvas.getObjects().forEach(function(o) {
            if (o.layerIndexing){
              if(o.id == obj.id){
                canvas.moveTo(o, parseInt(objIndex));
                o.set({
                  layerIndexing : parseInt(objIndex),
                });
                canvas.renderAll();
              }
              else if(o.id !== obj.id && o.layerIndexing == objIndex){
                canvas.moveTo(o, parseInt(layerIndex));
                o.set({
                  layerIndexing : parseInt(layerIndex),
                });
                canvas.renderAll();
              }
            }
          });
        }
      }
    }
  });
  //Canvas sendbackward object functionality
  jQuery(".object-action.sendbackward").click(function(){
    var obj = canvas.getActiveObject();
    if(obj){
      lockCanvasObjects();
      /*var objs = canvas._objects.filter(function(o){
        if (o.layerIndexing){
          return o;
        }
      });
      var objTotal = parseInt(objs.length);*/
      if(obj.layerIndexing){
        var layerIndex = parseInt(obj.layerIndexing);
        var objIndex = parseInt(layerIndex - 1);
        if(objIndex >= 1){
          canvas.getObjects().forEach(function(o) {
            if (o.layerIndexing){
              if(o.id == obj.id){
                canvas.moveTo(o, parseInt(objIndex));
                o.set({
                  layerIndexing : parseInt(objIndex),
                });
                canvas.renderAll();
              }
              else if(o.id !== obj.id && o.layerIndexing == objIndex){
                canvas.moveTo(o, parseInt(layerIndex));
                o.set({
                  layerIndexing : parseInt(layerIndex),
                });
                canvas.renderAll();
              }
            }
          });
        }
      }
    }
  });
  //Canvas object delete functionality
  jQuery(".object-action.delete").click(function(){
    var obj = canvas.getActiveObject();
    if(obj){
      kmModalWindow("Are you sure you want to delete this item?");
      jQuery(".g-dialog-header").text("DELETE THIS ITEM?");
      jQuery(".g-dialog-footer .btn-primary").addClass("delete-object");
    }
  });
  //HTML element delete functionality
  jQuery(".object-action.delete-element").click(function(){
    if(jQuery(".selected-element").length || jQuery(".selected-shape").length){
      kmModalWindow("Are you sure you want to delete this object? There is no undo.");
      jQuery(".g-dialog-header").text("DELETE THIS ITEM?");
      jQuery(".g-dialog-footer .btn-primary").addClass("delete-element");
      jQuery('.g-dialog-container .close-modal.btn-primary').text('Delete');
    }
  });
  //Insert font list from font js
  if(jQuery("#font-family").length){
    jQuery("#font-family").empty();
    var fonts = kmdsFontsList();
    jQuery.each(fonts, function(key, val){
      jQuery("#font-family").append('<option style="font-family:'+val+'" value="'+val+'">'+val+'</option>');
    });
    addFontStyle(fonts[0], 'Regular');
  }

  //open KM image crop functionality
  //jQuery(document).on('click','#kmImageCrop',function (e) {
  jQuery("#kmImageCrop").click(function (e) {
    //Selected image object
    var wInnerWidth = parseInt(window.innerWidth*0.75);
    var wInnerHeight = parseInt(window.innerHeight*0.75);
    //var wInnerWidth = parseInt(window.innerWidth/2);
    //var wInnerHeight = parseInt(window.innerHeight/2);
    var obj = canvas.getActiveObject();
    if(obj){
      if(obj.type == 'ImageContainer'){
        if(obj.containerImage != ''){
          obj = canvas.getItemById(obj.containerImage);
        }
      }
    }
    var imgWidth = obj.width;
    var imgHeight = obj.height;
    var objWidth = obj.width*obj.scaleX;
    //imgWidth = (obj.scaleX > 1) ? objWidth : imgWidth;
    var objHeight = obj.height*obj.scaleY;
    //imgHeight = (obj.scaleY > 1) ? objHeight : imgHeight;
    var imageWidth = obj.getScaledWidth();
    var imageHeight = obj.getScaledHeight();
    //var objsrc = obj.src;
    var objsrc = '';
    if(objWidth > wInnerWidth){
      objWidth = wInnerWidth;
    }
    if(objHeight > wInnerHeight){
      objHeight = wInnerHeight;
    }

    if(jQuery(".media-data.active-gray").length){
      var $this = jQuery(".media-data.active-gray");
      var imgsrc = jQuery($this).attr("data-src");
    }
    else {
      var imgsrc = objsrc;
    }
    if(jQuery(".km-image-crop-modal").length == 0){
      jQuery('<div/>', {"class": "g-dialog-container km-image-crop-modal d-block justify-content-center align-items-center visible", "id":"km-image-editor"})
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
            .append(jQuery("<span/>", {"class": "km-image-size d-none", text: "0x0"}))
          )
          .append(jQuery("<div>", {"class": "cropit-preview"})
            .append(jQuery("<div>", {"class": "spinner-border"}))
          )
        )
        .append(jQuery('<div/>', {"class": "dialog-action text-right p-2"})
          .append(jQuery('<ul/>', {'class': 'crop-modal-instruction', })
            .append(jQuery('<span/>', {'class': 'crop-instruction-title', text: "Instructions:"}))
            .append(jQuery('<li/>', {'class': 'crop-instruction-list', text: "Use the slider at the top to scale the image."}))
            .append(jQuery('<li/>', {'class': 'crop-instruction-list', text: "Click over the image and drag to change the crop."}))
            .append(jQuery('<li/>', {'class': 'crop-instruction-list', text: "Select a new image from the Media Kits."}))
          )
          .append(jQuery('<a/>', {'class': 'close-modal btn btn-cancel mr-2', 'href': 'javascript:void(0);', text: 'Cancel'}))
          .append(jQuery('<a/>', {'class': 'close-modal apply-image-crop btn btn-primary font-fjalla disabled', 'href': 'javascript:void(0);', text: 'Apply'}))
        ).appendTo('#page');
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
      var target_id = obj.imgfid
      var media_image_url = media_base_url+'/media/'+target_id+'/edit?_format=json';
      jQuery.getJSON( media_image_url, function( image_url ) {
        objsrc = image_url.field_media_image[0].original_url;
        ReplaceResizeImage($imageCropper, objsrc, imageWidth, imageHeight, 0, function(result) {
          console.log(result);
          var image_dimensions = parseInt(imageWidth) + ' x ' + parseInt(imageHeight);
          jQuery('.km-image-editor .slider-wrapper .km-image-size').text(image_dimensions);
          jQuery(".g-dialog-container .btn-primary").removeClass("disabled");
        });
      });
    }
    else {
      jQuery('.km-image-editor .cropit-preview').append('<div class="spinner-border"></div>');
      jQuery(".g-dialog-container .btn-primary").addClass("disabled");
      $imageCropper = jQuery('.km-image-editor');
      ReplaceResizeImage($imageCropper, imgsrc, imageWidth, imageHeight, 0, function(result) {
        var image_dimensions = parseInt(imageWidth) + ' x ' + parseInt(imageHeight);
        jQuery('.km-image-editor .slider-wrapper .km-image-size').text(image_dimensions);
        console.log(result);
        jQuery(".g-dialog-container .btn-primary").removeClass("disabled");
      });
    }
  });
  //Remove/add required field error message.
  if(jQuery("input#title-original").length == 1){
    jQuery("#page").on('keypress','input#title-original',function (e) {
      jQuery(".km-render-group.title-field .error").remove();
    }).keyup(function(){
      var title = jQuery("input#title-original").val();
      if(title.trim() == ''){
        jQuery(".km-render-group.title-field .error").remove();
        jQuery(".km-render-group.title-field").append('<span class="error">Title field is required.</span>');
      }
      else {
        jQuery(".km-render-group.title-field .error").remove();
      }
    });
  }
  //Open modal window for professional user to upgrade profile
  jQuery(".professional-user-modal").click(function(e){
    e.preventDefault();
    professional_user_modal();
    // kmModalWindow("This feature is available to Expert level users. You may upgrade now and use it for free until your next monthly billing date.");
    // jQuery(".g-dialog-header").text("UPGRADE TODAY TO ACCESS THIS FEATURE");
    // jQuery(".g-dialog-footer .btn-primary").addClass("upgrade-user");
    // jQuery(".g-dialog-footer .btn-primary").text("Upgrade");
  });
});
(function ($, Drupal, drupalSettings) {
  var initialized;
  Drupal.behaviors.custom_km_product = {
    attach: function (context, settings) {
      //load media kit images
      var uid = drupalSettings.uid;
      var kaboodle_nid = drupalSettings.kaboodle_nid;
      var media_base_url = drupalSettings.media_base_url;
      jQuery(window).on('load', function(){
        if(jQuery('body div.left-panel .media-kit-images').hasClass("empty")){
          jQuery('body div.left-panel .media-kit-images').removeClass("empty");
					//console.log('kaboodle_nid = '+kaboodle_nid);
          var media_kit_url = media_base_url+'/user/shared/media_kits/'+ uid +'/'+kaboodle_nid+'?_format=json';
          if(producttype_id == 'Reusable Content Block' || producttype_id == 'Email Newsletter' || producttype_id == 'Web Page'){
            media_kit_url = media_base_url+'/user/article_media_kits/'+ uid +'/'+kaboodle_nid+'?_format=json';
          }
          var $elem = jQuery('body div.left-panel .media-kit-images');
          jQuery.getJSON( media_kit_url, function( result ) {
						if(result.length){
							jQuery.each(result, function(key, val) {
								if(val.owner == true){
									var member_ico = '';
								} else {
									//var member_ico = jQuery("<img/>", {"src": "/modules/custom/my_groups/images/members.png", "class": "mk-member", "width": 15, "height": 13, "onmouseover": "tooltipfn(this)", "data-km-toggle": "tooltip", "data-title": val.member_name});
									var member_ico = jQuery("<img/>", {"src": "/modules/custom/my_groups/images/members.png", "class": "mk-member", "width": 15, "height": 13, "onmouseover": "uitooltipfn(this)", "title": val.member_name});
								}
                if(producttype_id == 'Playlist' || producttype_id == 'Online Gallery'){
                  if(producttype_id == 'Playlist' && val.audio_status == 'notempty'){
                  $elem.append(
                    jQuery("<div/>", {"class": "media-kit-image empty gal-play", "id": "mediakit-"+val.nid, "data-value": val.nid}).append(
                      jQuery("<span/>", {"class": "media-kit-image-title", text: val.title}).append(member_ico),
                      jQuery("<span/>", {"class": "image-list-caret"}).append(jQuery('<label/>', {"class": "checkbox-container"}).append(
                      jQuery('<input/>', {'type': 'checkbox', "class": "box-check gal-play box-check", "id":"playlist",value:"playlist"}),
                      jQuery('<span/>', {"class": "checkmark"}),
                     )
                     )
                     )
                  );
                  }
                  if(producttype_id == 'Online Gallery' && val.photo_status == 'notempty'){
                  $elem.append(
                    jQuery("<div/>", {"class": "media-kit-image empty gal-play", "id": "mediakit-"+val.nid, "data-value": val.nid}).append(
                      jQuery("<span/>", {"class": "media-kit-image-title", text: val.title}).append(member_ico),
                      jQuery("<span/>", {"class": "image-list-caret"}).append(jQuery('<label/>', {"class": "checkbox-container"}).append(
                      jQuery('<input/>', {'type': 'checkbox', "class": "box-check gal-play box-check", "id":"playlist",value:"playlist"}),
                      jQuery('<span/>', {"class": "checkmark"}),
                    )
                    )
                    )
                  );
                  }
                }
                else{
                   $elem.append(
                    jQuery("<div/>", {"class": "media-kit-image empty", "id": "mediakit-"+val.nid, "data-value": val.nid}).append(
                      jQuery("<span/>", {"class": "media-kit-image-title", text: val.title}).append(member_ico),
                      jQuery("<span/>", {"class": "fas fa-caret-right image-list-caret"}),
                    )
                  );
                }
							});
						} else {
							$elem.append(
								jQuery("<div/>", {"class": "media-kit-image d-flex justify-content-center align-items-center"}).append(
									jQuery('<a/>', {'class': 'no-text-decoration', 'href': '/tools/kaboodle/'+kaboodle_nid, text: 'Click here to add Media Kits'}),
								)
							);
              
						}
            
          if(producttype_id == 'Playlist' || producttype_id == 'Online Gallery'){
            $elem.append(jQuery("<button/>", {"class": "btn btn-primary font-fjalla float-right mt-2 mk-button-selector disabled", text: 'Apply'}));
          } 
						jQuery(".media-kit-images .progress-overlay").remove();
          });
        }
      });
      //Load media kit image list
      jQuery(document).on('click','.media-kit-image',function (e) {
        if(jQuery(".media-kit-image").parent().hasClass('disabled')){
          return;
        }else if(jQuery(e.target).hasClass('media-kit-image-title') || jQuery(e.target).hasClass('image-list-caret')){
          jQuery(".media-kit-image .media-data").removeClass("active-gray");
          var $this = jQuery(this);
          
          if($this.hasClass("active")){
            //console.log('already loaded');
            $this.removeClass("active");
            $this.find('.image-list-caret').removeClass("fa-caret-down").addClass("fa-caret-right");
            $this.find('.mediakit-images').removeClass("d-block").addClass("d-none");
          } else {
            //console.log('load image');
            jQuery(".media-kit-image").removeClass("active");
            $this.addClass("active");
            jQuery(".media-kit-image").find('.image-list-caret').removeClass("fa-caret-down").addClass("fa-caret-right");
            $this.find('.image-list-caret').removeClass("fa-caret-right").addClass("fa-caret-down");
            jQuery('body div.left-panel .mediakit-images').removeClass("d-block").addClass("d-none");
            if($this.hasClass("empty")){
              var nid = $this.attr("data-value");
              $this.removeClass("empty");
              $this.append(
                jQuery("<div/>", {"class": "mediakit-images d-block clicked", "id": "mk-photo-gallery-"+nid}).append(
                  jQuery("<div/>", {"class": "progress-overlay"}).append(
                    jQuery("<div/>", {"class": "spinner-border"})
                  )
                )
              );
              var $elem = $this.find('.mediakit-images');
              var kit_class = jQuery(".media-kit-image.active").find(".media-kit-image-title").text();
              kit_class = kit_class.toLowerCase().replace(/ /g,"-");
              var media_kit_url = media_base_url+'/node/'+ nid +'?_format=json';
              jQuery.getJSON( media_kit_url, function( result ) {
                jQuery.each(result.field_vault_photo, function(key, val) {
                  var target_id = val.target_id;
                  var media_image_url = media_base_url+'/media/'+target_id+'/edit?_format=json';
                  jQuery.getJSON( media_image_url, function( image_url ) {
                    var image_name = image_url.name[0].value;
                    image_name = image_name.replace("/var/tmp/", "");
                    //var index = image_name.lastIndexOf("/") + 1;
                    //var filename = image_name.substr(index);
                    //var ext = image_name.substring(image_name.lastIndexOf('.'));
                    //image_name = image_name.split(ext)[0];
                    $elem.append(
                      jQuery("<div/>", {"class": "media-data d-flex "+kit_class, "image-title": image_name, "data-src": image_url.field_media_image[0].original_url, "onmouseover": "tooltipfn(this)", "data-toggle": "tooltip", "data-title": image_name, "data-fid": target_id}).append(
                        jQuery("<div>", {"class": "kit-image"}).append(
                          jQuery("<img/>", {"src": image_url.field_media_image[0].image_import_url}),
                          jQuery("<div/>", {"class": "overlay"}).append(
                            jQuery("<button/>", {"class": "preview-icon", "data-value-nid": nid, "image-url": image_url.field_media_image[0].original_url})
                          )
                        ),
                        jQuery("<div/>", {"class": "kit-name", text: image_name})
                      )
                    );
                    sortMediaKitImagesList(kit_class);
                  });
                });
              }).done(function() { 
                jQuery(".media-kit-images .progress-overlay").remove();
              });
            }
            else {
              $this.find('.mediakit-images').removeClass("d-none");
              $this.find('.mediakit-images').addClass("d-block");
            }
          }
        }
      });
      //open media kit image gallery
      //jQuery(document).on('click','.media-kit-image .preview-icon',function (e) {
      jQuery(".media-kit-images").on('click','.media-kit-image .preview-icon',function (e) {
        if((jQuery(".kmds-static-image-modal").length == 0) && (jQuery(".km-image-crop-modal").length == 0) && (jQuery(".kmwp-image-crop-modal").length == 0)) {
          var nid = jQuery(this).attr("data-value-nid");
          var src = jQuery(this).attr("image-url");
          var wInnerHeight = window.innerHeight;
          var cheight = (window.innerHeight * 80/100);
          var cWidth = (window.innerWidth * 80/100);
          jQuery('<div/>', {"class": "g-dialog-container kmds-static-image-modal d-block justify-content-center align-items-center visible"})
            .append(jQuery('<div/>', {"class": "g-dialog"})
              .append(jQuery('<div/>', {"class": "g-dialog-content"})
                .append(jQuery('<div/>', {"class": "d-grid"})
                  .append(jQuery('<span/>', {"class": "d-block"})
                    .append(jQuery("<div/>", {"class": "progress-overlay kmds-static-image-modal-spinner"})
                      .append(jQuery("<div/>", {"class": "spinner-border"})))
                    .append(jQuery('<img class="temp-static-image" src="'+ src +'" />'))
                  )
                )
              )
              .append(jQuery('<div/>', {"class": "g-dialog-footer"})
                .append(jQuery('<a/>', {'class': 'close-modal', 'href': 'javascript:void(0);', text: 'X'}))
              )
            ).appendTo('#page');
          let img = new Image();
          img.onload = function() {
            if(img.width >= img.height){
              size1 = img.width;
              size2 = "auto";
              if(img.width > cWidth){
                size1 = cWidth;
                if(img.height > wInnerHeight){
                  size1 = wInnerHeight;
                }
              }
            }
            else if(img.width < img.height){
              size1 = "auto";
              size2 = img.height;
              if(img.height > cheight){
                size2 = cheight;
              }
            }
            jQuery("#page .temp-static-image").css("width", size1);
            jQuery("#page .temp-static-image").css("height", size2);
            jQuery("#page .kmds-static-image-modal .kmds-static-image-modal-spinner").remove();
          }
          img.src = src;
        }
      });
    }
  }
})(jQuery, Drupal, drupalSettings);
//New Document ready function
jQuery(document).ready(function(){
  //load media kit image
  jQuery(".media-kit-images").on('click', '.media-kit-image', function (e) {
    //console.log('Kits Clicked');
    if (producttype_id == 'Online Gallery' || producttype_id == 'Playlist' ) {
      return;	
    }
    if(jQuery(".media-kit-image").parent().hasClass('disabled')){
      return;
    }
    else if(jQuery(e.target).hasClass('media-kit-image-title') || jQuery(e.target).hasClass('image-list-caret')){
      jQuery(".media-kit-image .media-data").removeClass("active-gray");
      //jQuery("#kmImageCrop").removeClass("active");
      //jQuery(".media-kit-images .progress-overlay").remove();
      var $this = jQuery(this);
      if($this.hasClass("active")){
        //console.log('Active Found and Removed');
        $this.removeClass("active");
        $this.find('.image-list-caret').removeClass("fa-caret-down").addClass("fa-caret-right");
        $this.find('.mediakit-images').removeClass("d-block").addClass("d-none");
      }
      else {
        jQuery(".media-kit-image").removeClass("active");
        $this.addClass("active");
        //console.log('Active Not Found and Added');
        jQuery(".media-kit-image").find('.image-list-caret').removeClass("fa-caret-down").addClass("fa-caret-right");
        $this.find('.image-list-caret').removeClass("fa-caret-right").addClass("fa-caret-down");
        jQuery('body div.left-panel .mediakit-images').removeClass("d-block").addClass("d-none");
        if($this.hasClass("empty")){
          //console.log('Empty Div');
          var nid = $this.attr("data-value");
          $this.removeClass("empty");
          $this.append(
            jQuery("<div/>", {"class": "mediakit-images d-block clicked", "id": "mk-photo-gallery-"+nid}).append(
              jQuery("<div/>", {"class": "progress-overlay"}).append(
                jQuery("<div/>", {"class": "spinner-border"})
              )
            )
          );
          var $elem = $this.find('.mediakit-images');
          var kit_class = jQuery(".media-kit-image.active").find(".media-kit-image-title").text();
          kit_class = kit_class.toLowerCase().replace(/ /g,"-");
          var media_kit_url = media_base_url+'/node/'+ nid +'?_format=json';
          jQuery.getJSON( media_kit_url, function( result ) {
          if(producttype_id != 'Playlists'){
            jQuery.each(result.field_vault_photo, function(key, val) {
              var target_id = val.target_id;
              var media_image_url = media_base_url+'/media/'+target_id+'/edit?_format=json';
              jQuery.getJSON( media_image_url, function( image_url ) {
                var image_name = image_url.name[0].value;
                image_name = image_name.replace("/var/tmp/", "");
                //var index = image_name.lastIndexOf("/") + 1;
                //var filename = image_name.substr(index);
                //var ext = image_name.substring(image_name.lastIndexOf('.'));
                //image_name = image_name.split(ext)[0];
                $elem.append(
                  jQuery("<div/>", {"class": "media-data d-flex "+kit_class, "image-title": image_name, "data-src": image_url.field_media_image[0].original_url, "onmouseover": "tooltipfn(this)", "data-toggle": "tooltip", "data-title": image_name, "data-fid": target_id}).append(
                    jQuery("<div>", {"class": "kit-image"}).append(
                      jQuery("<img/>", {"src": image_url.field_media_image[0].image_import_url}),
                      jQuery("<div/>", {"class": "overlay"}).append(
                        jQuery("<button/>", {"class": "preview-icon", "data-value-nid": nid, "image-url": image_url.field_media_image[0].original_url})
                      )
                    ),
                    jQuery("<div/>", {"class": "kit-name", text: image_name})
                  )
                );
                sortMediaKitImagesList(kit_class);
              });
            });
          }
          else{
            jQuery.each(result.field_vault_audio, function(key, val) {
              var target_id = val.target_id;
              var media_image_url = media_base_url+'/media/'+target_id+'/edit?_format=json';
              jQuery.getJSON( media_image_url, function( image_url ) {
                var image_name = image_url.name[0].value;
                image_name = image_name.replace("/var/tmp/", "");
                var img_url= '';
                if(image_url.field_audio_image.length == 1){
                 img_url = image_url.field_audio_image[0].original_url;
                }
                else{
                  img_url = "/modules/custom/km_product/images/default-playlist-image.png";
                } 
                //var index = image_name.lastIndexOf("/") + 1;
                //var filename = image_name.substr(index);
                //var ext = image_name.substring(image_name.lastIndexOf('.'));
                //image_name = image_name.split(ext)[0];
                $elem.append(
                  jQuery("<div/>", {"class": "media-data d-flex "+kit_class, "image-title": image_name, "data-src": img_url, "onmouseover": "tooltipfn(this)", "data-toggle": "tooltip", "data-title": image_name, "data-fid": target_id}).append(
                    jQuery("<div>", {"class": "kit-image"}).append(
                      jQuery("<img/>", {"src": img_url,"class": "au-image"}),
                      jQuery("<div/>", {"class": "overlay"}).append(
                        jQuery("<button/>", {"class": "preview-icon", "data-value-nid": nid, "image-url": img_url})
                      )
                    ),
                    jQuery("<div/>", {"class": "kit-name", text: image_name})
                  )
                );
                sortMediaKitImagesList(kit_class);
              });
            });
          }
          }).done(function() { 
            jQuery(".media-kit-images .progress-overlay").remove();
          });
        }
        else {
          $this.find('.mediakit-images').removeClass("d-none");
          $this.find('.mediakit-images').addClass("d-block");
          //console.log('Not Empty Div');
        }
      }
    }
  });
});
/**
 * Callback function tooltipfn()
 * to displayed tooltip title on mouseover
 **/
function uitooltipfn(){
	jQuery.widget.bridge('uitooltip', jQuery.ui.tooltip);
	//jQuery.widget.bridge("tlp", jQuery.ui.tooltip);
  jQuery('.mk-member').uitooltip();
}
/**
 * Callback function tooltipfn()
 * to displayed tooltip title on mouseover
 **/
function tooltipfn(){
  jQuery('[data-km-toggle="tooltip"]').tooltip({
    placement : 'bottom',
    trigger : 'hover'
  });
}
/**
 * Callback function sortMediaKitImagesList()
 * to sort the media kit image list in assets tab
 * at toolx page
 **/
function sortMediaKitImagesList(kit_class){
  if(kit_class){
    var list, i, switching, b, shouldSwitch;
    list = document.getElementById("left-sidebar");
    switching = true;
    while (switching) {
      switching = false;
      b = list.getElementsByClassName(kit_class);
      for (i = 0; i < (b.length - 1); i++) {
        shouldSwitch = false;
        if (b[i].getAttribute("image-title").toLowerCase() > b[i + 1].getAttribute("image-title").toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        b[i].parentNode.insertBefore(b[i + 1], b[i]);
        switching = true;       
      }
    }
  }
}
/**
 * Callback function saveUserTemplate()
 * to save the template in user list
 **/
function saveUserTemplate(){

  if(jQuery('#page-image-canvas').length == 0){	
    var $elem = jQuery('#canvas-container');	
    $elem.append(	
      jQuery('<canvas/>', {'id': 'page-image-canvas', "width": "500", "height": "500"})	
    );
  }
  var fileName = jQuery('#userTemplateName').val();
  if(fileName === '' || typeof fileName === 'undefined'){
    kmModalWindow("Please enter a name for this product.");
    jQuery(".g-dialog-footer .btn-cancel").addClass("d-none");
  }
  else {
    kmTemplateChanged = false;
    jQuery("#render_km_template").attr("disabled", false);
    jQuery("#save_km_template").val(0);
    jQuery("body").append(
      jQuery("<div/>", {"class": "g-dialog-container d-flex justify-content-center align-items-center visible"}).append(
        jQuery("<div/>", {"class": "progress-overlay"}).append(
          jQuery("<div/>", {"class": "spinner-border"})
        )
      )
    );
    jQuery('.g-dialog-container').css('color', '#e75e00');
    //Remove smart guide lines
    smartGuideStatus = 0;
    _removeGuide();
    //Update canvas objects
    canvas.getObjects().forEach(function(obj) {
      if(obj.type == 'text' && obj.name == 'measurement'){
        obj.set({
          opacity: 0
        });
      }
      else if(obj.type == 'image'){
        obj.set({
          OldscaleX: obj.scaleX,
          OldscaleY: obj.scaleY,
        });
      }
      else if(obj.type == 'page'){
        obj.set({
          fabricDPI: fabric.DPI,
        });
        console.log(obj);
       //var dataURL = canvas.toDataURL("image/jpeg",0.7);
          var pageObj = obj;
      }
     
    });
     
    canvas.renderAll();
    var allObj = canvas.getObjects();
    var pageObj = canvas.getActivePageObj();
     console.log('pageObj'+pageObj);
    //canvas.width = active_page_width;
    // canvas.height = active_page_height;
    var active_page_width = pageObj.width;
    var active_page_height = pageObj.height;
    console.log('active_page_width'+active_page_width);
    console.log('active_page_height'+active_page_height);
    // for generating thumnail
    console.log('design_id'+user_template_id);
    var size = pageObj.width >= pageObj.height ? 'width' : 'height';

    var canvasP = new fabric.Canvas('page-image-canvas', {
    backgroundColor : "#ffffff",
    width: pageObj.width,
    height: pageObj.height,
    });
    canvasP.clear();
    var leftDiff = ((pageObj.left - (pageObj.width / 2)) + 1)
    var topDiff = ((pageObj.top - (pageObj.height / 2)) + 1)
    allObj.forEach(function(obj) {
    var o = fabric.util.object.clone(obj);
    o.left = (o.left - leftDiff);
    o.top = (o.top - topDiff);
    o.setCoords();
    canvasP.add(o);
   });
    canvasP.renderAll();
    //var dataURL = canvasP.toDataURL('png');
    var user_template_ids = jQuery('#user_template_id').val();
    var parent_template_id = jQuery('#parent_template_id').val();
    if(user_template_ids == ''){
     // user_template_ids = parent_template_id+'_'+Math.floor((Math.random() * 1000) + 1);
      user_template_ids = uuidv4();
      console.log('user_template_id'+user_template_ids);
    }

    var dataURL = canvasP.toDataURL("image/jpeg",0.7);
    console.log('dataURL'+dataURL);
    var media_base_url = drupalSettings.media_base_url;
    var uid = drupalSettings.uid;
    jQuery.ajax({
      url: media_base_url+"/kmds/design-tool/images",
      type: "POST",
      data: {json_data: dataURL, design_id: user_template_ids, json_type: 'static_image', uid: uid},
      dataType: "json",
      beforeSend: function(x) {
        if (x && x.overrideMimeType) {
          x.overrideMimeType("application/json;charset=UTF-8");
        }
      },
      success: function(result) {
        console.log('static-image '+result.src);
        var cwidth = parseInt(jQuery('#pageWidth').val());
        var cheight = parseInt(jQuery('#pageHeight').val());
        var ruler_status = jQuery('#ruler_status').val();
        var no_of_photos = jQuery('#no_of_photos').val();
        var page_size = jQuery('#page_size').val();
        var cunit = jQuery('#cunit').val();
        var productId = jQuery('#productId').val();
        var producTypeId = jQuery('#producTypeId').val();
        var productName = jQuery('#productName').val();
        var folderName = jQuery('#folderName').val();
        var template_tid = jQuery('#template_tid').val();
        var group = jQuery('#group').val();
        var producTypeName = jQuery('#producTypeName').val();
        var templateAddedTags = jQuery('#templateAddedTags').val();
        var templateAddedDescriptions = jQuery('#templateAddedDescriptions').val();
        var name = drupalSettings.user_name;
        var static_image_url = jQuery('#static_image_url').val();
        var color_space = jQuery('#color_space').val();
        var page_format = jQuery('#page_format').val();
        var page_bleed = jQuery('#page_bleed').val();
        var trim_marks = jQuery('#trim_marks').val();
        var fabricDPI = jQuery('#fabricDPI').val();
        var preset_name = jQuery('#preset_name').val();
        var preset_tid = jQuery('#preset_tid').val();
        var use_kaboodles_id = jQuery('#user_node_nid').val();
        var km_render = jQuery('#km_render').val();
        var user_template_id = jQuery('#user_template_id').val();
        var data = {"name": fileName, "_name": fileName, "user_id":uid, "user":name, "group_tid": productId, "type_tid":producTypeId, "group_name":productName, "folder_name":folderName, "template_tid":template_tid, "template_group":group, "type_name": producTypeName, "width": cwidth, "height":cheight, "measurement":cunit, "template_tags":templateAddedTags, "template_descriptions":templateAddedDescriptions, "ruler_status":ruler_status, "static_image_url":result.src, "template_active": 1, "removal_active": 0, "no_of_photos":no_of_photos, "page_size":page_size, "kmds": 0, "parent":parent_template_id, "color_space":color_space, "page_format":page_format, "page_bleed":page_bleed, "trim_marks":trim_marks, "fabricDPI":fabricDPI, "preset_name":preset_name, "preset_tid":preset_tid, "kaboodles_id":use_kaboodles_id, "km_render":km_render}; 
        console.log('json_string'+JSON.stringify(data));
        var json = canvas.toJSON();
        var dataURL = canvas.toDataURL();
        createSaveUpdateUserTemplate(user_template_id, data, json, dataURL);
        document.title = fileName+' | KaboodleMedia';
      },
      error: function(xhr, status, error) {
        console.log(xhr.responseText);
       }
    });
    /*
    var cwidth = parseInt(jQuery('#pageWidth').val());
    var cheight = parseInt(jQuery('#pageHeight').val());
    var ruler_status = jQuery('#ruler_status').val();
    var no_of_photos = jQuery('#no_of_photos').val();
    var page_size = jQuery('#page_size').val();
    var cunit = jQuery('#cunit').val();
    var productId = jQuery('#productId').val();
    var producTypeId = jQuery('#producTypeId').val();
    var productName = jQuery('#productName').val();
    var folderName = jQuery('#folderName').val();
    var template_tid = jQuery('#template_tid').val();
    var group = jQuery('#group').val();
    var producTypeName = jQuery('#producTypeName').val();
    var templateAddedTags = jQuery('#templateAddedTags').val();
    var templateAddedDescriptions = jQuery('#templateAddedDescriptions').val();
    var name = drupalSettings.user_name;
    var static_image_url = jQuery('#static_image_url').val();
    var parent_template_id = jQuery('#parent_template_id').val();
    var data = {"name": fileName, "_name": fileName, "user_id":uid, "user":name, "group_tid": productId, "type_tid":producTypeId, "group_name":productName, "folder_name":folderName, "template_tid":template_tid, "template_group":group, "type_name": producTypeName, "width": cwidth, "height":cheight, "measurement":cunit, "template_tags":templateAddedTags, "template_descriptions":templateAddedDescriptions, "ruler_status":ruler_status, "static_image_url":static_image_url, "template_active": 1, "removal_active": 0, "no_of_photos":no_of_photos, "page_size":page_size, "kmds": 0, "parent":parent_template_id};
    console.log('json_string'+JSON.stringify(data));
    var json = canvas.toJSON();
    var dataURL = canvas.toDataURL();
    console.log('dataur'+dataURL);
    console.log('user_template_id'+user_template_id);
    console.log('data'+data);
    console.log('json'+json);
    createSaveUpdateUserTemplate(user_template_id, data, json, dataURL);
    document.title = fileName+' | KaboodleMedia';
    */
  }
}
/**
 * Callback function createSaveUpdateUserTemplate()
 * to save user template in API server
 **/
function createSaveUpdateUserTemplate(design_id_s, data_json_S, json_s, dataURL_s) {
	if (design_id_s == null || design_id_s == '') {
		var settings = {
			"url": access_check_api + "product",
			"method": "POST",
			"timeout": 0,
			"headers": {
				"Authorization": "bearer " + API_KEY,
			},
			"data": data_json_S
		};
		jQuery.ajax(settings).done(function (response) {
			// ....
		}).then(
			function fulfillHandler(data) {
				jQuery('#user_template_id').val(data._id);
				createJsonFileUserTemplate(data._id, json_s, dataURL_s);        
			},
			function rejectHandler(jqXHR, textStatus, errorThrown) {
				// ...
			}
		).catch(function errorHandler(error) {
			// ...
		});
	}
	else {
		//for update the records
		var settings = {
			"url":access_check_api + "product/" + design_id_s,
			"method": "PUT",
			"timeout": 0,
			"headers": {
				"Authorization": "bearer " + API_KEY,
				"Content-Type": "application/x-www-form-urlencoded"
			},
			"data": data_json_S
		};
		jQuery.ajax(settings).done(function (response) {
		}).then(
			function  fulfillHandler(data) {
				//console.log(data)
				//queryString.push('d', data._id);
				//savedDesignFlag = true;
				createJsonFileUserTemplate(design_id_s, json_s, dataURL_s);        
			},
			function rejectHandler(jqXHR, textStatus, errorThrown) {
				// ...
			}
		).catch(function errorHandler(error) {
			// ...
		});
	}  
}
/**
 * Callback function createJsonFileUserTemplate
 **/
function createJsonFileUserTemplate(f_design_id, f_json, img_data) {
	var settings = {
		"url": access_check_api + "product/" + f_design_id + "/urls",
		"method": "PUT",
		"timeout": 0,
		"headers": {
			"Authorization": "bearer " + API_KEY
		},
	};
	jQuery.ajax(settings).done(function (response) {
		console.log("From createJsonFileUserTemplate "+JSON.stringify(response));
	}).then(
		 function  fulfillHandler(data_url) {
				var settings = {
					"url": data_url.url,
					"method": "PUT",
					"timeout": 0,
					"headers": {
						"Content-Type": "application/json"
					},
					"data": JSON.stringify(f_json),
				};

				jQuery.ajax(settings).done(function (response) {
					console.log('file save response');
				}).then(
        function  fulfillHandler(response1) {
          var settings = {
            "url": data_url.url_t,
            "method": "PUT",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/json"
            },
            "data": JSON.stringify(img_data),
          };
          jQuery.ajax(settings).done(function (response) {
            console.log('image save response');
          }).then(
          function  fulfillHandler(response2) {
            var data_u_u = {'url' : data_url.url_s, 'url_t': data_url.url_t_s, 'user_id':uid};
            update_design_url(f_design_id, data_u_u);
          },
          function rejectHandler(jqXHR, textStatus, errorThrown) {
          }
          ).catch(function errorHandler(error) {
          // ...
          });
        },
        function rejectHandler(jqXHR, textStatus, errorThrown) {
        }
        ).catch(function errorHandler(error) {
        // ...
        });
				/*var settings = {
					"url": data_url.url_t,
					"method": "PUT",
					"timeout": 0,
					"headers": {
						"Content-Type": "application/json"
					},
					"data": JSON.stringify(img_data),
				};
				jQuery.ajax(settings).done(function (response) {
					console.log('image save response');
				}).then(
        function  fulfillHandler(data_url) {
          console.log('image save response 2 = '+data_url);
        },
        function rejectHandler(jqXHR, textStatus, errorThrown) {
        }
        ).catch(function errorHandler(error) {
        // ...
        });
				var data_u_u = {'url' : data_url.url_s, 'url_t': data_url.url_t_s};
				update_design_url(f_design_id, data_u_u);*/
			},
			function rejectHandler(jqXHR, textStatus, errorThrown) {
				// ...
			}
	 ).catch(function errorHandler(error) {
	// ...
	 });
	
}
/**
 * Callback function update_design_url()
 * to update design url
 **/
function update_design_url(u_design_id, u_data_json) {
	var settings = {
		"url":access_check_api + "product/" + u_design_id,
		"method": "PUT",
		"timeout": 0,
		"headers": {
			"Authorization": "bearer " + API_KEY,
			"Content-Type": "application/x-www-form-urlencoded"
		},
		"data": u_data_json
	};
	jQuery.ajax(settings).done(function (response) {
		console.log(response);
    console.log('datasave');
    var producTypeId = jQuery("#producTypeId").val();
    var nid = jQuery("#user_node_nid").val();
    setTimeout(function() {
      jQuery(".g-dialog-container").remove();
      window.location.href = '/km/product/'+nid+'/'+producTypeId+'/template/settings/'+u_design_id+'?kmproduct=yes';
    }, 3000);
		//alert('save updated');
	});
}
/**
 * Callback function update_product_template()
 * to update product template settings
 * page_settings['user_id'] = 115;
 * update_product_template(design_id, page_settings);
 **/
function update_product_template(u_design_id, u_data_json) {
	var settings = {
		"url":access_check_api + "product/" + u_design_id,
		"method": "PUT",
		"timeout": 0,
		"headers": {
			"Authorization": "bearer " + API_KEY,
			"Content-Type": "application/x-www-form-urlencoded"
		},
		"data": u_data_json
	};
	jQuery.ajax(settings).done(function (response) {
		console.log(response);
		console.log('Product template updated');
	});
}
//manual font size
jQuery(document).on('change','#text-font-size',function () {
  var val = jQuery(this).val();
  if (!val){
  	val = 6;
  }
  if (isNaN(val)) {
    val = 21;
  }
  var activeObject = canvas.getActiveObject();
  activeObject.fontSize = val;
  canvas.renderAll();
  DetectTemplateChanges();
});

// font size dropdown callback function
function textSizeList() {
  document.getElementById("myDropdown").classList.toggle("textsizeshow");
}


// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn') && !event.target.matches('.fa-chevron-down')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('textsizeshow')) {
        openDropdown.classList.remove('textsizeshow');
      }
    }
  }
}

//set font size in text box if click on font size dropdown
jQuery(document).on('click', '.option-item', function() {
  var fsize = jQuery(this).attr('datavalue');
  jQuery('#text-font-size').val(fsize);
  jQuery('#text-font-size').trigger("change");
});
//Apply text font size in canvas object
jQuery(document).on('change','#text-font-size',function () {
  var val = jQuery(this).val();
  if (!val){
  	val = 6;
  }
  if (isNaN(val)) {
    val = 21;
  }
  var activeObject = canvas.getActiveObject();
  activeObject.fontSize = val;
  canvas.renderAll();
  DetectTemplateChanges();
});
//Apply text font and style in canvas object
jQuery(document).on('change','div.my-kaboodles-product-edit #toolbar select', function () {
  if(jQuery('div#canvas-container').length == 1) {
    var cx = canvas.getActiveObject();
    if (cx && this.id) {
      if (this.id != 'fstyle') {
        var x = jQuery('#'+this.id).attr("data-pro");
        if (x) {
          var v = jQuery('#'+this.id).children("option:selected").val();
          if (v) {
            setActiveStyle(x,getActiveStyle(x) === v ? '' : v);
          }
          if(x == 'fontFamily'){
            //kmdsFontsLoad(v);
            setActiveStyle('fontFamily', v);
            addFontStyle(v, 'Regular');
          }
        }
      }
      else if (this.id == 'fstyle') {
        var v = jQuery('#'+this.id).children("option:selected").val();
        setActiveStyle('fontStyle', '');
        if (v) {
          if(v == 'Regular'){
            var font = jQuery('#font-family').children("option:selected").val();
            setActiveStyle('fontFamily', font);
          }
          else{
            var font = jQuery('#font-family').children("option:selected").val();
            font = font+' '+v;
            setActiveStyle('fontFamily', font);
          }
          /*var res = v.split("#");
          setActiveStyle('fontWeight', res[0]);
          if(res[1] == "I") {
            setActiveStyle('fontStyle', 'italic');
          } else {
            setActiveStyle('fontStyle', '');					
          }*/
        }
      }
    }
  }
});
//Apply text alignment in canvas object
jQuery(document).on('click', 'div.my-kaboodles-product-edit button.apri',function () {
  var cx = canvas.getActiveObject();
  if (cx && this.id) {
    var x = jQuery('#'+this.id).attr("data-pro");
    if (x != 'bring' && x != 'export') {
      var v = jQuery('#'+this.id).attr("data-value");
      if (v != 'linethrough' && v != 'underline') {
        if ( x == 'textAlign') {
          //setActiveProp(x, getActiveProp(x) === v ? '' : v);
          setActiveProp(x, v);
        } else {
          //setActiveStyle(x,getActiveStyle(x) === v ? '' : v);
          setActiveStyle(x, v);
        }
      }
    }
  }
});
//Apply text color in canvas object
jQuery(document).on('change','div.my-kaboodles-product-edit input.apri',function () {
  var cx = canvas.getActiveObject();
  var x = jQuery('#'+this.id).attr("data-pro");
  var bv = jQuery('#'+this.id).val();
  if (cx && this.id) {
    if(x == 'kmdstextcolor' ) {
      var v = jQuery('#'+this.id).attr("data-value");
      jQuery(".kmds-color-picker").css("background-color", jQuery('#'+this.id).val());
      setActiveProp(v, jQuery('#'+this.id).val());
    }
    else if(x == 'kmdsimageborder' ) {
      var v = jQuery('#'+this.id).attr("data-value");
      jQuery(".kmds-image-border-section").css("background-color", jQuery('#'+this.id).val());
      setActiveProp(v, jQuery('#'+this.id).val());
    }
    else if(x == 'kmdsshapeborder' ) {
      var v = jQuery('#'+this.id).attr("data-value");
      jQuery(".kmds-shape-border-section").css("background-color", jQuery('#'+this.id).val());
      setActiveProp(v, jQuery('#'+this.id).val());
    }
    canvas.renderAll();
  }
});
//ColorPicker functionality
var top_minus = 0;
jQuery("input.jsscolor").mousedown(function(){
  jQuery("input.jsscolor").removeClass('active');
  jQuery(this).addClass('active');
  var data_pro = jQuery(this).attr('data-pro');
  var position = jQuery(this).offset();
  var windowHeight = window.innerHeight;
  if(parseInt(windowHeight) < parseInt(position.top + 308)){
    top_minus = 315;
  }
  else {
    top_minus = 0;
  }
  var obj = canvas.getActiveObject();
  if(obj){
    var old_page_color = '';
    if(data_pro == 'kmdstextcolor'){
      if(obj.oldkmdstextcolor){
        old_page_color = obj.oldkmdstextcolor;
      }
      else {
        old_page_color = obj.fill;
        obj.set({
          oldkmdstextcolor: old_page_color
        });
        canvas.renderAll();
      }
    }
    else if(data_pro == 'kmdsshapeborder'){
      if(obj.oldkmdsshapeborder){
        old_page_color = obj.oldkmdsshapeborder;
      }
      else {
        old_page_color = obj.stroke;
        obj.set({
          oldkmdsshapeborder: old_page_color
        });
        canvas.renderAll();
      }
    }
    jQuery('input.jsscolor.active').attr("old_color", old_page_color);
  }
});
/**
 * Callback function applyTextcolorPicker()
 * to apply colorPicker with textbox object
 **/
function applyTextcolorPicker(){
  var colors = jQuery('input.jsscolor').colorPicker({
    position: 'left',
    customBG: '#222',
    readOnly: true,
    //delayOffset: 8, // pixels offset when shifting mouse up/down inside input fields before it starts acting as slider
    CSSPrefix: 'cp-', // the standard prefix for (almost) all class declarations (HTML, CSS)
    size: 3, // one of the 4 sizes: 0 = XXS, 1 = XS, 2 = S, 3 = L (large); resize to see what happens...
    allMixDetails: true, // see Colors...
    noAlpha: true, // disable alpha input (all sliders are gone and current alpha therefore locked)
    init: function(elm, colors) {
      // colors is a different instance (not connected to colorPicker)
      elm.style.backgroundColor = elm.value;
      elm.style.color = elm.value;
    },
    margin: {left: -450, top: -20},
    actionCallback: function(elm, action){// callback on any action within colorPicker (buttons, sliders, ...)
      if(action == 'saveAsBackground' || action == 'external'){
        var selected_color = '#'+jQuery('.cp-app .cp-HEX .cp-disp').text();
        jQuery('input.jsscolor.active').val(selected_color);
        var data_pro = jQuery('input.jsscolor.active').attr('data-pro');
        applyCanvasObjectColor(data_pro, selected_color);
        if(action == 'saveAsBackground'){
          var colorPickers = jQuery.fn.colorPicker.colorPickers;
          var colorPicker = colorPickers.current;
          $colorPicker = jQuery(colorPicker ? colorPicker.nodes.colorPicker : undefined);
          $colorPicker.hide(0);
          jQuery(':focus').trigger('blur');
        }
      }
      else if(action == 'changeXYValue'){
        var selected_color = jQuery('input.jsscolor.active').val();
        var data_pro = jQuery('input.jsscolor.active').attr('data-pro');
        applyCanvasObjectColor(data_pro, selected_color);
      }
      else if(action == 'resetColor'){
        var old_color = jQuery('input.jsscolor.active').attr("old_color");
        jQuery('input.jsscolor.active').val(old_color);
        jQuery("input.jsscolor.active").css("background-color", old_color);
        var data_pro = jQuery('input.jsscolor.active').attr('data-pro');
        var colorPickers = jQuery.fn.colorPicker.colorPickers;
        var colorPicker = colorPickers.current;
        colorPicker.setColor(old_color, undefined, undefined, true);
        //colorPicker.saveAsBackground();
        applyCanvasObjectColor(data_pro, old_color, 'resetColor');
      }
      var colorPickers = jQuery.fn.colorPicker.colorPickers;
      var colorPicker = colorPickers.current;
      if(colorPicker){
        colorPicker.color.options.margin.top = -top_minus;
        var cp_top = parseInt(jQuery('.cp-app').css('top'));
      }
    }
    // appendTo: document.querySelector('.samples')
  }).each(function(idx, elm) {
    // jQuery(elm).css({'background-color': this.value})
  });
}
/**
 * Callback function applyCanvasObjectColor()
 * to apply the color from new colorPicker
 **/
function applyCanvasObjectColor(data_pro, selected_color, type = null){
  var cx = canvas.getActiveObject();
  var x = data_pro;
  var bv = selected_color;
  var this_id = jQuery('input.jsscolor.active').attr('id');
  if (cx && this_id) {
    if(x == 'kmdstextcolor' ) {
      var v = jQuery('#'+this_id).attr("data-value");
      jQuery(".kmds-color-picker").css("background-color", bv);
      setActiveProp(v, bv);
    } else if(x == 'kmdsshapeborder' ) {
      var v = jQuery('#'+this_id).attr("data-value");
      setActiveProp(v, bv);
    } else if(x == 'kmdsshapefill' ) {
      var v = jQuery('#'+this_id).attr("data-value");
      setActiveProp(v, bv);
    }
  }
}
/**
 * Callback function kmModalWindow()
 * to display KM modal window
 **/
function kmModalWindow($message){
  jQuery('<div/>', {"class": "g-dialog-container d-block justify-content-center align-items-center visible"})
    .append(jQuery('<div/>', {"class": "g-dialog p-0"})
      .append(jQuery('<div/>', {"class": "g-dialog-header p-27"}))
      .append(jQuery('<div/>', {"class": "g-dialog-content gray-border-top-bottom"})
        .append(jQuery('<div/>', {"class": "d-grid"})
          .append(jQuery('<span/>', {"class": "d-block p-15", "html": $message}))
        )
      )
      .append(jQuery('<div/>', {"class": "g-dialog-footer text-right p-2"})
        .append(jQuery('<a/>', {'class': 'close-modal btn btn-cancel mr-2', 'href': 'javascript:void(0);', text: 'Cancel'}))
        .append(jQuery('<a/>', {'class': 'close-modal btn btn-primary font-fjalla', 'href': 'javascript:void(0);', text: 'Ok'}))
      )
    ).appendTo('#page');
}
/**
 * Callback function fitCanvasCenter()
 * to render canvas page in center of canvas
 **/
function fitCanvasCenter(){
  var page_format = jQuery("#page_format").val();
  if(page_format == 'pdf'){
    var pageID = jQuery("#displayed-page").attr("pageid");
    var activepageobj = canvas.getItemById(pageID+'MediaBox');
    if(!activepageobj){
      var activepageobj = canvas.getActivePageObj();
    }
  }
  else {
    var activepageobj = canvas.getActivePageObj();
  }
  var cs = activepageobj.getCoords();
  x = cs[0].x-2;
  y = cs[0].y-2;

  var ldelta = new fabric.Point(-x, -y);
  canvas.relativePan(ldelta);
  var ldelta = new fabric.Point(0, -y);
  leftRuler.relativePan(ldelta);
  var ldelta = new fabric.Point(-x, 0);
  topRuler.relativePan(ldelta);
  //Hide page overlay data
  var clipPath = new fabric.Rect({
    left: activepageobj.left - (activepageobj.width/2),
    top: activepageobj.top - (activepageobj.height/2),
    width: parseInt(activepageobj.width),
    height: parseInt(activepageobj.height),
    fill: 'transparent',
    opacity: 1
  });
  //var group = new fabric.Group(activepageobj);
  canvas.clipPath = clipPath;
  //canvas.add(group);
  //canvas.backgroundColor = '#eaeaea';
  canvas.renderAll();
  if(fitPageOnFirstLoad){
    fitPageOnFirstLoad = false;
    objHeight = activepageobj.height * activepageobj.scaleY; 
    objWidth = activepageobj.width * activepageobj.scaleX;
    var bw = jQuery('#canvas-container').width();
    var bh = jQuery('#canvas-container').height();
    var bw = bw - (bw*15/100);
    var bh = bh - (bh*15/100);
    if (objHeight >= objWidth) {
      zoomFL = (bh/objHeight).toFixed(2);
    }
    else {
      zoomFL = (bw/objWidth).toFixed(2);
    }
    kmdsDesignZoomIn(zoomFL);
    zoomLF = zoomFL * 100;
    jQuery('#zoomb .caption').html(Math.round(zoomLF)+'%');
    addrulernew();
  }
}

/**
 * Callback function kmClosest()
 * to @returns the closest number from a sorted array.
 **/
function kmClosest(arr, target, process) {
  if (!(arr) || arr.length == 0)
    return null;
  if (arr.length == 1)
    return arr[0];
  for (var i = 1; i < arr.length; i++) {
    // As soon as a number bigger than target is found, return the previous or current
    // number depending on which has smaller difference to the target.
    if (arr[i] > target) {
      var c = arr[i];
      var d = arr[i - 1];
			if(process == 'zoomin'){
				return Math.abs(c);
			} else if (process == 'zoomout'){
				return Math.abs(d);
			}
    }
  }
  // No number in array is bigger so return the last.
  return arr[arr.length - 1];
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
        //context.drawImage(img, 0, 0, img.width, img.height, 0, 0, img_canvas.width, img_canvas.height);
        context.drawImage(img, 0, 0, img_canvas.width, img_canvas.height);
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
function ReplaceResizeImage($imageCropper, image_src, imgWidth, imgHeight, is_popup, callback) {
  //'destroy not working as expected, below line is added.  this will remove already included image'
  $imageCropper.cropit('destroy');
  $imageCropper.find('.cropit-preview-image-container').remove();
  if (is_popup) {
    $imageCropper.addClass('popup-class');
  }
  var screen_width = parseInt(jQuery("div.km-image-editor").width());
  var screen_height = parseInt(jQuery("div.km-image-editor").height());;
  var originalHeight = parseFloat(imgHeight);
  var originalWidth = parseFloat(imgWidth);
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
  console.log("previewHeight 2 = "+previewHeight);
  console.log("previewWidth 2 = "+previewWidth);
  console.log("previewScale 2 = "+previewScale);  
  resizeImage(image_src, resize, function(resizeDataURL) {
    $imageCropper.cropit({
      allowDragNDrop: false,
      imageBackground: false,
      imageState: {
        src: resizeDataURL,
      },
      //freeMove: 'true',
      minZoom: 'fill',
      maxZoom: 10,
      smallImage: 'allow', //'stretch', //'allow',
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
        callback($imageCropper);
        jQuery("div.km-image-editor div.cropit-preview div.spinner-border").remove();
        jQuery("div.g-dialog-container div.dialog-action a.close-modal").removeClass("disabled");
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
    console.log(pos3);
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
 * Get all objects of page including page object
 */

 /*
fabric.Canvas.prototype.getItemsByPage = function(pageId) {
  var objectList = [],
      objects = this.getObjects();
  for (var i = 0, len = this.size(); i < len; i++) {
		if ((objects[i].page && objects[i].page === pageId && objects[i].type !== 'text' && objects[i].type !== 'line' && objects[i].type !== 'guideline') || (objects[i].id === pageId)) {
			objectList.push(objects[i]);
		}
  }
  return objectList;
};
*/

/**
 * Callback function uuidv4()
 * to generate unique id for template
 */
function uuidv4() {
  return 'xxxxxxxxxxxx4xxxyxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
/**
 * Callback function productCanvasPageImage()
 * to convert canvas page objects to Image
 **/
function productCanvasPageImage(){
  var save_temp = jQuery("#save_km_template").val();
  if(kmTemplateChanged && save_temp == 1){
    kmModalWindow("Saved the changes before render.");
  }
  else {
    var type = jQuery("#page_format").val();
    var km_cmyk = jQuery("#km_cmyk").val();
    var km_bleed = jQuery("#km_bleed").val();
    var pageWidth = jQuery('#pageWidth').val();
    var pageHeight = jQuery('#pageHeight').val();
    if(type == 'pdf'){
      pageWidth = parseFloat(pageWidth/72);
      pageHeight = parseFloat(pageHeight/72);
      var dimensions = pageWidth+' x '+pageHeight+' in';
    }
    else {
      var dimensions = pageWidth+' x '+pageHeight+' px';
    }
    var design_id = jQuery("#userTemplateName").attr('data-id');
    var modal_title = 'Render Image';
    if(type == 'pdf'){
      modal_title = 'Render PDF';
    }
    var render_form = jQuery('<div/>', {"class": "wrap-km-render-block"})
    .append(
      jQuery('<div/>', {"class": "km-render-group title-field"}).append(
        jQuery('<label/>', {"class": "title-original", text: "Title"}).append(
          jQuery('<span/>', {"class": "required", text: "*"})
        ),
        jQuery('<input/>', {'type': 'text', "class": "form-control title-original", "id": "title-original"}),
      ),
      jQuery('<div/>', {"class": "km-render-group dimensions-field"}).append(
        jQuery('<label/>', {"class": "km-render-Dimensions", 'html': "Dimensions:&nbsp;"}).append(
        jQuery('<span/>', {"class": "og-dim", text: dimensions}))
      ),
      jQuery('<div/>', {"class": "km-render-group type-field"}).append(
        jQuery('<label/>', {"class": "km-render-type", 'html': "Type:&nbsp;"}).append(
        jQuery('<span/>', {"class": "og-dim", text: type}))
      ),
      jQuery('<div/>', {"class": "km-render-group archieve-field"}).append(
        jQuery('<div/>', {"class": "checkbox"}).append(
          jQuery('<label/>', {"class": "checkbox-container km-render-cmyk"}).append(
            jQuery('<input/>', {'type': 'checkbox', "class": "box-check", "id":"km-render-cmyk", "value":"0", "checked": false}),
            jQuery('<label/>', {"class":"checkb", "for": "km-render-cmyk"}),
            jQuery('<span/>', {"class": "custom-label ml-2", text: "CMYK"}),
          ),
          jQuery('<label/>', {"class": "checkbox-container km-render-bleed"}).append(
            jQuery('<input/>', {'type': 'checkbox', "class": "box-check", "id":"km-render-bleed", "value":"0", "checked": false}),
            jQuery('<label/>', {"class":"checkb", "for": "km-render-bleed"}),
            jQuery('<span/>', {"class": "custom-label ml-2", text: "Bleed and trim marks"}),
          ),
          jQuery('<label/>', {"class": "checkbox-container km-render-archieve"}).append(
            jQuery('<input/>', {'type': 'checkbox', "class": "box-check", "id":"km-render-archieve", "value":"0", "checked": false}),
            jQuery('<label/>', {"class":"checkb", "for": "km-render-archieve"}),
            jQuery('<span/>', {"class": "custom-label ml-2", text: "Archived"}),
          ),
        )
      ),
      jQuery('<div/>', {"class": "km-render-group tags-field"}).append(
        jQuery('<span/>', {"class": "d-none tags"}),
        jQuery('<label/>', {"class": "tags", text: "Tags"}),
        jQuery('<input/>', {'type': 'text', "class": "form-control tags", "id": "km-render-tags"}),
      ),
      jQuery('<div/>', {"class": "km-render-group description-field"}).append(
        jQuery('<label/>', {"class": "description", text: "Description"}),
        jQuery('<textarea/>', {"class": "form-control description", "aria-label": "With textarea", text:""}),
      ),
      jQuery('<div/>', {"class": "form-group media-kit-field"}).append(
        jQuery('<label/>', {"class": "media-kit", text:"Assigned Media Kits"}),
        jQuery('<div/>', {"class": "wrapped-all-checkboxes"}),
      ),
    );
    kmModalWindow(render_form);
    jQuery('.g-dialog-container').removeClass('align-items-center');
    jQuery('.g-dialog-container').addClass('km-render-form-block');
    jQuery('.g-dialog-container .g-dialog-header').text(modal_title);
    jQuery('.g-dialog-container .close-modal.btn-primary').text('Render');
    jQuery('.g-dialog-container .close-modal.btn-primary').addClass('km-render');
    if(km_cmyk == 1){
      jQuery(".wrap-km-render-block #km-render-cmyk").prop( "checked", true );
    }
    if(km_bleed == 1){
      jQuery(".wrap-km-render-block #km-render-bleed").prop( "checked", true );
    }
    if(type !== 'pdf'){
      jQuery('.checkbox-container.km-render-cmyk').addClass('d-none');
      jQuery('.checkbox-container.km-render-bleed').addClass('d-none');
    }
    //Add user media kit list in "Assigned Media Kits" section
    var kmMediaURL = '/km-media-kit';
    var km_render = parseInt(jQuery("#km_render").val());
    jQuery.post(kmMediaURL, {"media_kit": "media_kit", "type": type, "km_render": km_render}, function(response) {
      if(response){
        //console.log(JSON.stringify(response));
        var checked = 0;
        jQuery.each(response.media_kit, function(key, val){
          if(response.media_data){
            checked = 0;
            jQuery.each(response.media_data.used_mkit, function(mkitkey, mkitval){
              if(mkitval.nid == val.nid){
                checked = 1;
              }
            });
          }
          if(val.title == 'All Media Assets'){
            jQuery('<label/>', {"class": "checkbox-container"}).append(
              jQuery('<input/>', {'type': 'checkbox', "class": "box-check", "id":"km-media-"+val.nid, "value":val.nid, "checked": true, "disabled":true}),
              jQuery('<label/>', {"class":"checkb", "for": "km-media-"+val.nid}),
              jQuery('<span/>', {"class": "custom-label ml-2", text: val.title}),
            ).appendTo('.wrapped-all-checkboxes');
          }
          else if(checked == 1){
            jQuery('<label/>', {"class": "checkbox-container"}).append(
              jQuery('<input/>', {'type': 'checkbox', "class": "box-check", "id":"km-media-"+val.nid, "value":val.nid, "checked": true, "disabled":false}),
              jQuery('<label/>', {"class":"checkb", "for": "km-media-"+val.nid}),
              jQuery('<span/>', {"class": "custom-label ml-2", text: val.title}),
            ).appendTo('.wrapped-all-checkboxes');
          }
          else {
            jQuery('<label/>', {"class": "checkbox-container"}).append(
              jQuery('<input/>', {'type': 'checkbox', "class": "box-check", "id":"km-media-"+val.nid, "value":val.nid, "checked": false, "disabled":false}),
              jQuery('<label/>', {"class":"checkb", "for": "km-media-"+val.nid}),
              jQuery('<span/>', {"class": "custom-label ml-2", text: val.title}),
            ).appendTo('.wrapped-all-checkboxes');
          }
        });
        if(response.media_data){
          //console.log(JSON.stringify(response));
          jQuery(".wrap-km-render-block #title-original").val(response.media_data.name);
          jQuery(".wrap-km-render-block .description-field .description").val(response.media_data.description);
          if(response.media_data.achived == 1){
            jQuery(".wrap-km-render-block #km-render-archieve").prop( "checked", true );
          }
          jQuery(".tags-field .tags").text(response.media_data.tags);
          // jQuery.each(response.media_data.used_mkit, function(key, val){
            // jQuery(".wrap-km-render-block #km-media-"+val.nid).prop( "checked", true );
          // });
        }
      }
    });
    //Add functionality for tags field
    jQuery('input#km-render-tags').tagsInput({
      minChars: 2,
      unique: true,
      'autocomplete': {
        source: '/getTags/' + uid,
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
    jQuery('input#km-render-tags').importTags(jQuery('span.tags').text());
  }
}
/**
 * Callback function productCanvasRenderPageImage()
 * to convert canvas page objects to Image
 **/
function productCanvasRenderPageImage(){
  var type = jQuery("#page_format").val();
  var design_id = jQuery("#userTemplateName").attr('data-id');
  if(type == 'pdf'){
    var pdfurl = '/admin/config/generate/'+design_id+'/pdf';
    window.open(pdfurl, '_blank');
  }
  else {
    kmModalWindow("");
    jQuery('.g-dialog-container').append('<div class="progress-overlay km-overlay-center"><div class="spinner-border"></div></div>');
    jQuery('.g-dialog-container .spinner-border').css('color', '#e75e00');
    var pdfImageURL = '/admin/config/generate/'+design_id+'/image';
    jQuery.post(pdfImageURL, {"page_format": type}, function(response) {
      if(response){
        var response_data = JSON.parse(response);
        var image_url = response_data.image_url;
        console.log("URL = "+image_url);
        var media_data = {};
        media_data['image_url'] = image_url;
        media_data['preset'] = jQuery('#preset_tid').val();
        media_data['title'] = jQuery('#userTemplateName').val();
        media_data['preset_type'] = type;
        var pageWidth = jQuery('#pageWidth').val();
        var pageHeight = jQuery('#pageHeight').val();
        media_data['preset_dimension'] = pageWidth+'x'+pageHeight+'px';
        jQuery.ajax({
          url: '/media-render',
          data: {
            "mode": 'ajax',
            "media_data": media_data,
          },
          type: "POST",
          success: function(data) {
            jQuery(".g-dialog-container").remove();
            console.log(JSON.stringify(data));
            // var a = document.createElement("a");
            // document.body.appendChild(a);
            // a.style = "display: none";
            // a.href = image_url;
            // a.download = template_id+'.'+type;
            // a.click();
            // window.URL.revokeObjectURL(image_url);
          }
        });
      }
    });
    /*if(jQuery('#page-image-canvas').length == 0){
      var $elem = jQuery('#canvas-container');
      $elem.append(
        jQuery('<canvas/>', {'id': 'page-image-canvas', "width": "500", "height": "500"})
      );
    }
    var pageID = jQuery("#displayed-page").attr("pageid");
    var allObj = canvas.getItemsByPage(pageID);
    var pageObj = canvas.getItemsByPage(pageID)[0];
    //console.log(JSON.stringify(pageObj));
    //var size = pageObj.width >= pageObj.height ? 'width' : 'height';
    var canvasP = new fabric.Canvas('page-image-canvas', {
      backgroundColor : "#ffffff",
      width: pageObj.width,
      height: pageObj.height,
    });
    canvasP.clear();
    var leftDiff = ((pageObj.left - (pageObj.width / 2)) + 1)
    var topDiff = ((pageObj.top - (pageObj.height / 2)) + 1)
    allObj.forEach(function(obj) {
      var o = fabric.util.object.clone(obj);
      o.left = (o.left - leftDiff);
      o.top = (o.top - topDiff);
      o.setCoords();
      canvasP.add(o);
    });
    canvasP.renderAll();
    if(type == 'png'){
      //var dataURL = canvasP.toDataURL('png');
      var dataURL = canvasP.toDataURL({
         format: 'png',
         quality: 1
      });
      //var mime = dataURL.split(',')[0].split(':')[1].split(';')[0];
      canvasPageImage(dataURL, type);
    }
    else if(type == 'jpg' || type == 'jpeg'){
      //var dataURL = canvasP.toDataURL("image/jpeg",0.7);
      var dataURL = canvasP.toDataURL({
         format: 'jpeg',
         quality: 0.7
      });
      //var mime = dataURL.split(',')[0].split(':')[1].split(';')[0];
      canvasPageImage(dataURL, type);
    }*/
  }
}
/**
 * Callback function canvasPageImage()
 * to convert canvas page to Image
 **/
function canvasPageImage(dataURL, type) {
  var blobUrl = new Array();
  sliceSize = 512;
  //var contentType = type;
  var contentType = 'image/png';
  if(type == 'png'){
    contentType = 'image/png';
  }
  else if(type == 'jpg' || type == 'jpeg'){
    contentType = 'image/jpeg';
  }
  var BASE64_MARKER = ';base64,';   
  var base64Index = dataURL.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var b64Data = dataURL.substring(base64Index);

  var byteCharacters = window.atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  //blobUrl[0] = URL.createObjectURL(blob);
  var image_url = URL.createObjectURL(blob);
  //window.open(image_url, '_blank');

  var a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = image_url;
  a.download = template_id+'.'+type;
  a.click();
  window.URL.revokeObjectURL(image_url);
/*
  var image = new Image();
  //image.src = "data:image/jpg;base64," + dataURL;
  image.src = dataURL;
  var w = window.open("");
  w.document.write(image.outerHTML);
  //window.open(image_url, '_blank');
  var image_datas = new Image();
  image_datas.src = image_url;
  var w =  window.open('');
  w.document.write(image_datas.outerHTML);*/
}
/**
 * Callback function professional_user_modal()
 * to open modal window for professional user
 **/
function professional_user_modal(){
  kmModalWindow("This feature is available to Expert level users. You may upgrade now and use it for free until your next monthly billing date.");
  jQuery(".g-dialog-header").text("UPGRADE TODAY TO ACCESS THIS FEATURE");
  jQuery(".g-dialog-footer .btn-primary").addClass("upgrade-user");
  jQuery(".g-dialog-footer .btn-primary").text("Upgrade");
}
