/**
 * @file
 * Attaches behaviors for the social_media module.
 *
 */
(function ($, Drupal) {
  var initialized;
  Drupal.behaviors.b = {
    attach: function (context, settings) {
      if (!initialized) {
        initialized = true;
        var user_id = drupalSettings.user_id;
        var base_url = drupalSettings.base_url;
        var default_media_kit_id = drupalSettings.default_media_kit_id;	
        var media_kit_url = base_url+"/node/"+default_media_kit_id+"?_format=json";

        React.render(
          React.createElement(AppMediaOptions, drupalSettings), document.querySelector("#media-kit-options")
        );
      }

    }
  };
})(jQuery, Drupal);
