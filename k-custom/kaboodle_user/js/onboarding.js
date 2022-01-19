(function ($, Drupal, drupalSettings) {
  var initialized;
  Drupal.behaviors.OnBehavior = {
    attach: function (context, settings) {
      
        initialized = true;
         var links = document.getElementsByTagName('a');
         for(var i=0;i<links.length;i++){
            links[i].href='#';
            links[i].onclick = function(){  $('#on-boarding-submit').modal('show'); return false; };
          }
  
  /* $('#user-status-btn').click(function() {
     $('#on-boarding').modal('hide');
  });
  $('#user-boarding-btn').click(function() {
    $('#on-boarding-submit').modal('hide');
  }); */
 $('#user-boarding-btn-leave').click(function() {
      $('#edit-submit').click();
  });
    }
  }
})(jQuery, Drupal, drupalSettings);

jQuery(window).on('load', function(){
  //jQuery('#on-boarding').addClass('load-onboarding-msg');
	jQuery('#on-boarding').modal('show');
});