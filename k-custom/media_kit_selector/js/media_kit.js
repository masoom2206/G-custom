/**
 * @file
 * Attaches behaviors for the social_media module.
 *
 */
(function ($, Drupal) {
  var initialized;
  Drupal.behaviors.media_kit = {
    attach: function (context, settings) {
      if (!initialized) {
        initialized = true;
        var base_url = drupalSettings.base_url;
        var user_id = drupalSettings.options.uid;
        var media_vault_id = drupalSettings.media_vault_id;
        var default_media_kit_id = drupalSettings.default_media_kit_id;	
        var options = drupalSettings.options;
        var media_vault_url = base_url+"/node/"+media_vault_id+"?_format=json";
        //console.log(media_vault_url);

        // Media Kits select options
        if(options.mk_select == 1) {
          React.render(
            React.createElement(AppMediaOptions, {base_url: base_url, mkid: default_media_kit_id, options: options }), document.querySelector("#media-kit-options-"+options.element_id)
          );
        }
        
        //Media Kit Search
        if(options.search == 1){
          React.render(
            React.createElement(AppMediaSearch, {base_url: base_url, mkid: default_media_kit_id, options: options }), document.querySelector("#media-kit-search-"+options.element_id)
          );
        }
        
        
        // Video data secion
        if(Object.keys(options.tabs.video).length > 0) {
          React.render(
            React.createElement(AppVideo, {base_url: base_url, mkid: default_media_kit_id, options: options }), document.querySelector("#video-"+options.element_id)
          );
        }
        
        
        // Photo Kit data section
        if(Object.keys(options.tabs.photo).length > 0) {
          React.render(
            React.createElement(AppPhoto, {base_url: base_url, mkid: default_media_kit_id, options: options }), document.querySelector("#photo-"+options.element_id)
          );
        }
        
        
        // Audio kit data section  / audio player not working
        if(Object.keys(options.tabs.audio).length > 0) { 
          React.render(
            React.createElement(AppAudio, {base_url: base_url, mkid: default_media_kit_id, options: options }), document.querySelector("#audio-"+options.element_id)
          );
        }
        
        // Text kit data section
        if(Object.keys(options.tabs.text).length > 0) { 
          React.render(
            React.createElement(AppText, {base_url: base_url, source: media_vault_url, mkid: default_media_kit_id, options: options, pollInterval: 10000 }), document.querySelector("#text-"+options.element_id)
          );
        }

        
      } 
    }
  };
})(jQuery, Drupal);
