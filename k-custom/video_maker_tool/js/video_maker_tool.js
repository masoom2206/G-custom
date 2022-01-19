/**
 * @file
 * Attaches behaviors for the social_media module.
 *
 */
var mediaCount = drupalSettings.mediaCount;
var userProfessional = drupalSettings.userProfessional;
var previewImg = [];
var ikey = 0;
(function ($, Drupal) {
  var initialized;
  Drupal.behaviors.video_maker_tool = {
    attach: function (context, settings) {
      if (!initialized) {
        initialized = true;
        var media_base_url = drupalSettings.media_base_url;
        var user_id = drupalSettings.user_id;
        var media_preset_id = drupalSettings.media_preset_id;
        var video_id = drupalSettings.video_id;
        // update estimated duration
        calculateTotalClipDuration();
        mediaCount = jQuery('li.list-inline-item.added-media').length;

        if(video_id == 0){
          jQuery("#video-preset-dialog").dialog({
            autoOpen: true,
            width: 400,
            height: 250,
            modal: true,
            buttons: {
              Go: function() {
                var video_preset_id = jQuery("#video_preset").val();
                if(video_preset_id > 0){
                  jQuery("#video-preset-dialog").dialog("close");
                }else{
                  jQuery("select#video_preset").addClass("ui-state-error");
                }
              }
            },
            close: function() {
              var video_preset_id = jQuery("#video_preset").val();
              jQuery("#media_preset").val(video_preset_id);
              createPreviewArea(video_preset_id, 'modal_close');
            }
          });
        }else{
          createPreviewArea(media_preset_id, 'video_edit');
          var soundtrack = drupalSettings.soundtrack_data; 
          if(soundtrack){
           jQuery('#properties-soundtrack-tab').trigger('click');	
           soundtrackHtml(jQuery.parseJSON(soundtrack),function(result) {
              setTimeout(function(){
                jQuery('#properties-profile-tab').trigger('click');
                  console.log('soundtrack ececuted after 3 sec');
              }, 5000);
            });	
          }
        }
        
        jQuery("#media_preset").change(function(){
          var video_preset_id = jQuery(this).val();
          var selected_mid = jQuery("#selected-mid").val();
          createPreviewArea(video_preset_id, 'preset_change');
        });
        
        /*
        jQuery('input#tags').tagsInput({
          minChars: 2,
          'autocomplete': {
            source: '/tools/video/tags/'+user_id
          },
          onAddTag: function(fld, tag){
            console.log(tag);
          },
          onRemoveTag: function(fld, tag){
            console.log(tag);
          },
        });
        jQuery('input#tags').importTags('Tag1, Tag2, Tag3');
        */
        
        // select media for the story board
        jQuery('div.video-maker-layout').on('click', 'div.media-box', function(e) {
          mediaCount = jQuery('li.list-inline-item.added-media').length;
          if(mediaCount >= 10 && userProfessional == 1){
            userProfessionalModal();
            return;
          }
          var $this = jQuery(this);
          var mid = '';
          if($this.attr('id')){
            mid = $this.attr('id').split('-')[2];
          }
          var imgsrc = $this.closest('td').attr('data-src');
          var duration_raw_string = jQuery(this).parents('.media-row').find('td.duration').text();
          if(duration_raw_string){
            var duration_raw_array =  duration_raw_string.split(":");
            var duration_in_secs = parseFloat(duration_raw_array[0])*60*60 + parseFloat(duration_raw_array[1])*60 + parseFloat(duration_raw_array[2]);
          } else{
            var duration_in_secs = 5;
          }
          var thumb_image_html = getClipHTML(mid, imgsrc, duration_in_secs, false);
          jQuery('div.story-board li#add-video-photo').before(thumb_image_html);
          calculateTotalClipDuration();
          mediaCount = jQuery('li.list-inline-item.added-media').length;
        });     
        // remove item from story board
        jQuery('div.video-maker-layout').on('click', '.removeclip',  function(e) {
          mediaCount = jQuery('li.list-inline-item.added-media').length;
          var clipid = jQuery(this).attr('clipid');
          jQuery('#story-'+clipid+'-box').remove();
          calculateTotalClipDuration();
          mediaCount = jQuery('li.list-inline-item.added-media').length;
        });
        
        // clone item at story board
        jQuery('div.video-maker-layout').on('click', '.cloneclip',  function(e) {
          mediaCount = jQuery('li.list-inline-item.added-media').length;
          if(mediaCount >= 10 && userProfessional == 1){
            userProfessionalModal();
            return;
          }
          var clipid = jQuery(this).attr('clipid');
          var mid = clipid.split('-')[0];
          var imgsrc = jQuery('#story-'+clipid+'-box img.clip-item').attr('src');
          var duration = jQuery('.cloneclip').parents('.story-box').find('.clip-duration').val();
          var clonehtml = getClipHTML(mid, imgsrc, duration, true);
          jQuery('#story-'+clipid+'-box').after(clonehtml);
          calculateTotalClipDuration();
          mediaCount = jQuery('li.list-inline-item.added-media').length;
        });


        // image preview on story box clock
        jQuery('div.story-board').on("click", "ul#story-board-elements li.list-inline-item div.story-box", function (e) {
          if(!jQuery(e.target).hasClass('clip-item')){
            return;
          };
			
          // add border on the selected item
          jQuery("div.story-board div.story-box img.clip-item" ).each( function( index, el ) {
            jQuery(el).removeClass("active");
          });
          jQuery(this).find('img.clip-item').addClass("active");
          
          // show selected image in preview
          var video_preset_id = jQuery("#media_preset").val();
          var selected_media = jQuery(this).attr('id').split('-');
          var mid = selected_media[1];
          var rid = selected_media[2]; 
          // set value for preview
          jQuery("input#selected-mid").val(mid);
          jQuery("input#selected-rid").val(rid);
          jQuery("input#transition-mid").val(mid);
          jQuery("input#transition-rid").val(rid);
          createPreviewArea(video_preset_id, 'story_board');
          
          // transition button
          jQuery("div.button-transition img").removeClass("active");
          jQuery("div#transition-"+mid+"-"+rid+"-box img").addClass("active");
          // open clip tab
          jQuery("nav.vmt-properties-tabs a#properties-clip-tab").trigger('click');
        });
        
        // change transition preview
        jQuery('div.story-board').on("click", "ul#story-board-elements li.list-inline-item div.button-transition", function () {
          var transition = jQuery(this).attr('id').split('-');
          mid = transition[1];
          rid = transition[2]; 
          jQuery("input#transition-rid").val(rid);
          jQuery("input#transition-mid").val(mid);
          // set active class
          jQuery("div.story-board div.button-transition img").removeClass('active');
          jQuery(this).find('img').addClass('active');
          // populate transition tab
          populateTransition();
          jQuery("nav.vmt-properties-tabs a#properties-transition-tab").trigger('click');
        });
        
        
        // change transition preview
        jQuery("div.transition-box input.transition-option").click(function(){
          var datasrc = jQuery(this).attr('data-src');
          if(datasrc != ''){
            jQuery('div#transition-preview').html('<img src="'+datasrc+'" border="0"></img>'); 
          }else{
            jQuery('div#transition-preview').empty();
          }
        });
        
        // cancel button functionality
        jQuery("a#cancel-vmt").click(function(){
          jQuery("div#cancel-dialog").dialog({
            autoOpen: true,
            width: 400,
            height: 200,
            modal: true,
            buttons: {
              No: function() {
                jQuery("div#cancel-dialog").dialog("close");
              },
              Yes: function() {
                window.location.href = media_base_url+'/tools/video/'+user_id;
              },
            },
            close: function() {
              
            }
          });
        });
        // revert button functionality
        jQuery("a#revert-vmt").click(function(){
          var modal_instance = '#revert-dialog';
          jQuery(modal_instance).dialog({
            autoOpen: true,
            width: 400,
            height: 200,
            modal: true,
            buttons: {
              Cancel: function() {
                jQuery(modal_instance).dialog("close");
              },
              Revert: function() {
                location.reload();
              },
            },
            open: function(event, ui) {
              jQuery(modal_instance).dialog('option', 'title', 'REVERT TO SAVED');
              jQuery(modal_instance).html("Are you sure you want to revert to the last saved version of this video? Any changes will be lost.");
            }
          });
        });
        
        // sortable for story board elements 
        jQuery("ul#story-board-elements").sortable({
          items: "li:not(.not-sortable)",
          update: function( event, ui ) {}
        });
        //Displayed Preview Modal
        var preview = window.location.hash;
        var videoID = parseInt(jQuery("#video-id").val());
        if(preview == '#preview' && videoID !== 0){
          var cheight = (window.innerHeight * 0.60);
          var cWidth = (window.innerWidth * 0.60);
          $message = '<div class="preview-message"><div class="text text-align-center">Please standby while your preview is assembled.<br/>This may take several minutes.<br/>It will play in this window when ready.<br/>Video previews are not finalized or stored.</div><div class="preview-loader text-align-center"><img src="/modules/custom/media_vault_tool/img/km-logo.gif"><div class="preview-progress-bar"><span class="preview-progress-status"></span></div></div></div>'
          jQuery('<div/>', {"class": "g-dialog-container d-block justify-content-center align-items-center visible video-maker-preview"})
            .append(jQuery('<div/>', {"class": "g-dialog p-0"})
              .append(jQuery('<div/>', {"class": "g-dialog-header", text: 'Video Preview'}))
              .append(jQuery('<div/>', {"class": "g-dialog-content gray-border-top-bottom", "id": "preview-video-content"})
                .append(jQuery('<div/>', {"class": "d-grid"})
                  .append(jQuery('<span/>', {"class": "d-block p-15", "html": $message}))
                )
              )
              .append(jQuery('<div/>', {"class": "g-dialog-footer text-right"})
                .append(jQuery('<a/>', {'class': 'close-modal cancel-video-preview btn btn-cancel mr-2', 'href': 'javascript:void(0);', text: 'Cancel'}))
              )
            ).appendTo('#page');
          jQuery("div#preview-video-content").css({ "min-width": cWidth+"px", "height": "auto" });
          setTimeout(function () {
            change_bar_status();
            jQuery.post('/tools/video/maker/preview', {"action": "create", "videoID": videoID}, function(response) {
              if(response){
                jQuery(".preview-progress-status").css('width', '100%');
                console.log('Create Done!');
                setTimeout(function () {
                  jQuery('.preview-message').empty();
                  jQuery('.preview-message').append('<video controls width="550"><source src="'+response.video_file+'" type="video/mp4">Sorry, your browser doesn\'t support embedded videos.</video>');
                  jQuery('#page').append('<input type="hidden" id="video-preview-data" value=\''+JSON.stringify(response)+'\'/>');
                }, 1000);
              }
            });
          }, 2000);
        }
        jQuery("#page").on('click','.close-modal',function (e) {
          if(jQuery(this).hasClass('cancel-video-preview')){
            parent.location.hash = '';
            var preview_files = '';
            if(jQuery("#video-preview-data").length){
              var preview_data = jQuery("#video-preview-data").val();
              preview_files = jQuery.parseJSON(preview_data);
            }
            if (typeof window.history.replaceState == 'function') {
              history.replaceState({}, '', window.location.href.slice(0, -1));
              setTimeout(function () {
                jQuery.post('/tools/video/maker/preview', {"action": "delete", "videoID": videoID, "preview_files": preview_files}, function(response) {
                  if(response){
                    console.log('Delete Done!');
                  }
                });
              }, 1000);
            }
          }
        });
        //Zoom checkbox in clip tab
        //jQuery(".video-clip-zoom input:checkbox").click(function(e) {
        jQuery("#page").on('click','.video-clip-zoom input:checkbox',function (e) {
          var selectedMid = jQuery(this).attr('data-rid');
          var $box = jQuery(this);
          if ($box.is(":checked")) {
            jQuery(".video-clip-zoom input:checkbox").prop("checked", false);
            $box.prop("checked", true);
            //Update clip_zoom array
            jQuery( "#story-board-elements input.clip-zoom-effect" ).each(function( index ) {
              if(jQuery(this).attr('data-rid') == selectedMid){
                jQuery(this).val($box.val());
              }
            });
          }
          else {
            $box.prop("checked", false);
            //Update clip_zoom array
            jQuery( "#story-board-elements input.clip-zoom-effect" ).each(function( index ) {
              if(jQuery(this).attr('data-rid') == selectedMid){
                jQuery(this).val('no-zoom');
              }
            });
          }
          PhotoClipPropertiesSave();
        });
      } 
    }
  };
})(jQuery, Drupal);
/**
 * Callback function userProfessionalModal()
 * to displayed professional modal window.
 **/
function userProfessionalModal(){
  if(mediaCount >= 10 && userProfessional == 1){
    var def = jQuery.Deferred();
    var uid = drupalSettings.user.uid;
    var delUrl = '/tools/profile/'+uid+'/billing';
    var buttons = [{
      text: 'Cancel',
      click: function() {
        jQuery(this).dialog( "close" );
        def.reject();
      }
    },
    {
      text:"Upgrade",
      "class": 'btn btn-primary font-fjalla actv-btn',
      click: function() {
        jQuery(this).dialog( "close" );
        def.reject();
        jQuery(location).attr('href', delUrl);
      }
    }];
    var modal_instance = '#vmt-professional-modal';
    jQuery(modal_instance).dialog({
      autoOpen: true,
      width: 500,
      modal: true,
      resizable: false,
      buttons: buttons,
      open: function(event, ui) {
        jQuery(modal_instance).dialog('option', 'title', 'Upgrade to enable unlimited clips');
        jQuery(modal_instance).html("As a Professional member you may include up to 10 clips in your videos. Upgrade to Expert level to enable unlimited clips.");
      }
    });
  }
}
/*
 * Callback function change_bar_status();
 * to change progress bar color
 * @return width
 **/
function change_bar_status(){
  var barStatus =  Math.ceil(jQuery('.preview-progress-status').width() / jQuery('.preview-progress-bar').width() * 100);
  if(barStatus < 95){
    setTimeout(function () {
      barStatus = barStatus+1;
      jQuery(".preview-progress-status").css('width', barStatus+'%');
      change_bar_status();
    }, 500);
  }
}

