/**
 * @file
 * Attaches behaviors for the social_media module.
 *
 */
(function ($, Drupal) {
  var initialized;
  Drupal.behaviors.media_kit_mks = {
    attach: function (context, settings) {
      if (!initialized) {
        initialized = true;
        var base_url = drupalSettings.base_url;
        var user_id = drupalSettings.mkssettings.uid;
        var media_vault_id = drupalSettings.media_vault_id;
        var default_media_kit_id = drupalSettings.default_media_kit_id;	
        var mkssettings = drupalSettings.mkssettings;
        var media_vault_url = base_url+"/node/"+media_vault_id+"?_format=json";
        //console.log(media_vault_url);
        
        //Media Kits select options
        if(mkssettings.mk_select == 1){
          React.render(
            React.createElement(AppMediaOptions, {base_url: base_url, mkid: default_media_kit_id, options: mkssettings }), document.querySelector("#media-kit-options-"+mkssettings.element_id)
          );
        }
        //Media Kit Search
        if(mkssettings.search == 1){
          React.render(
            React.createElement(AppMediaSearch, {base_url: base_url, mkid: default_media_kit_id, options: mkssettings }), document.querySelector("#media-kit-search-"+mkssettings.element_id)
          );
        }
        
        //Video data secion
        if(Object.keys(mkssettings.tabs.video).length > 0) {
          React.render(
            React.createElement(AppVideo, {base_url: base_url, mkid: default_media_kit_id, options: mkssettings }), document.querySelector("#video-"+mkssettings.element_id)
          );
        }
        
        
        // Photo Kit data section
        if(Object.keys(mkssettings.tabs.photo).length > 0) {
          React.render(
            React.createElement(AppPhoto, {base_url: base_url, mkid: default_media_kit_id, options: mkssettings }), document.querySelector("#photo-"+mkssettings.element_id)
          );
        }
        
        // Audio kit data section  / audio player not working
        if(Object.keys(mkssettings.tabs.audio).length > 0) { 
          React.render(
            React.createElement(AppAudio, {base_url: base_url, mkid: default_media_kit_id, options: mkssettings }), document.querySelector("#audio-"+mkssettings.element_id)
          );
        }
        
        // Text kit data section
        if(Object.keys(mkssettings.tabs.text).length > 0) { 
          React.render(
            React.createElement(AppText, {base_url: base_url, source: media_vault_url, mkid: default_media_kit_id, options: mkssettings, pollInterval: 10000 }), document.querySelector("#text-"+mkssettings.element_id)
          );
        }

      } 
    }
  };
})(jQuery, Drupal);
