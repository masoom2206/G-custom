(function ($, Drupal, drupalSettings) {
  var initialized;
  Drupal.behaviors.Notification = {
    attach: function (context, settings) {
      if (!initialized) {
        initialized = true; 
      }    
    }
  }
})(jQuery, Drupal, drupalSettings);