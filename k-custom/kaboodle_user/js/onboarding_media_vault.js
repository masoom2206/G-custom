(function ($, Drupal, drupalSettings) {
  var initialized;
  Drupal.behaviors.OnBehaviorMediaVault = {
    attach: function (context, settings) {
     $('#on-boarding-media-vault').modal('show');
     $('#user-upload-assets-btn').click(function() {
      // $('#on-boarding-media-vault').modal('hide');
       $("#media_vault_same_value")[0].click();
    });
    $('#user-boarding-btn-continue').click(function() {
       $("#media_vault_link_value")[0].click();
    });
    }
  }
})(jQuery, Drupal, drupalSettings);