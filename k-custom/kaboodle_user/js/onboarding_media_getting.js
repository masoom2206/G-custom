(function ($, Drupal, drupalSettings) {
  var initialized;
  Drupal.behaviors.OnBehaviorMediaGetting = {
    attach: function (context, settings) {
     $('#on-boarding-media-getting').modal('show');
     $('#user-getting-assets-btn').click(function() {
        //$('#on-boarding-media-getting').modal('hide');
         $("#media_getting_same_value")[0].click();
    });
    }
  }
})(jQuery, Drupal, drupalSettings);