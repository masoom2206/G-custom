/**
 * @file
 * Attaches behaviors for the social_media module.
 *
 */
(function ($, Drupal) {
  var initialized;
  Drupal.behaviors.video_listing = {
    attach: function (context, settings) {
      if (!initialized) {
        initialized = true;
        
        jQuery('div.kaboodles-container div.grid-action-btns span.favorite').on('click', 'img.favorite-video-media', function(e) {
          var mid = jQuery(this).attr('mid');
          if(jQuery(this).hasClass('active')){
            var favorite = 0;
            jQuery(this).addClass('inactive');
            jQuery(this).removeClass('active');
            jQuery(this).attr('src', '/modules/custom/video_maker_tool/images/heart-inactive-icon.svg');
          }else{
            var favorite = 1;
            jQuery(this).addClass('active');
            jQuery(this).removeClass('inactive');
            jQuery(this).attr('src', '/modules/custom/video_maker_tool/images/heart-active-icon.svg');
          }
          jQuery.ajax({
            url: "/tools/video/favorite/" +mid,
            data: {favorite: favorite},
            type: "POST",
            success: function(data) {
              
            }
          });
        });
        
        
      } 
    }
  };
})(jQuery, Drupal);
jQuery(document).ready(function(){
  //Delete video after confirm
  jQuery(".delete-video-media").click(function(event) {
    var url_ref = '/'+drupalSettings.path.currentPath;
    var def = jQuery.Deferred();
    var video_id = jQuery(".delete-video-media").attr('video-id');
    var delUrl = '/tools/video/maker/'+video_id+'/delete';
    var buttons = [{
      text: 'Cancel',
      click: function() {
        jQuery(this).dialog( "close" );
        def.reject();
      }
    },
    {
      text:"Delete",
      "class": 'btn btn-primary font-fjalla actv-btn',
      click: function() {
        /*jQuery.ajax({
          url: delUrl,
          type: 'GET',
          dataType: 'json', 
          success:function(data) {}
        });*/
        jQuery(this).dialog( "close" );
        def.reject();
        //window.location.reload();
        jQuery(location).attr('href', delUrl);
      }
    }];
    var modal_instance = '#vmt-video-delete';
    jQuery(modal_instance).dialog({
      autoOpen: true,
      width: 500,
      // height: 200,
      modal: true,
      resizable: false,
      buttons: buttons,
      open: function(event, ui) {
        jQuery(modal_instance).dialog('option', 'title', 'Delete Video');
        jQuery(modal_instance).html("This action deletes the video from the Video Maker only, and cannot be undone. The rendered video will still be available in the Media Vault and Media Kits.");
        //jQuery(modal_instance).html("Are you sure you want to delete this video. The delete action cannot be undone.");
      }
    });
  });
  //Delete video after confirm
  jQuery(".professional_user_modal").click(function(event) {
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
  });
  //Display memebr team after click on tab.
  //jQuery('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  jQuery('a[data-toggle=tab]').click(function(){
    if(jQuery('.member-content').length){
      var uri = window.location.href.toString();
      if (uri.indexOf("?") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
      }
      jQuery('.member-content').addClass('d-none');
      jQuery('.member-teams').removeClass('d-none');
    }
  });
});
function playvideomodal(fid, mid) {
  jQuery.ajax({
    url: "/mediaInfo/" +mid,
    data: {},
    type: "GET",
    success: function(data) {
      playvideo(data.mid_url, data.duration);
    }
  });	
}
