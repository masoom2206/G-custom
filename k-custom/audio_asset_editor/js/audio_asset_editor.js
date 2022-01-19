/**
 * @file
 * Attaches behaviors for the audio_asset module.
 *
 */
(function($, Drupal) {
  var initialized;
  Drupal.behaviors.audio_asset_editor = {
    attach: function(context, settings) {
      if (!initialized) {
        initialized = true;
        var user_id = drupalSettings.user_id;
        var media_base_url = drupalSettings.media_base_url;

       
      }
    }
  };
})(jQuery, Drupal);