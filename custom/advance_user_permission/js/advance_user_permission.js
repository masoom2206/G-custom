(function ($) {
  Drupal.behaviors.advance_user_permission = {
    attach: function (context, settings) {
      // Code to be run on page load, and
      // on ajax load added here
      alert('fdasf');
      $("div.permission > .form-item").each(function(){
        $(this).children("input:checkbox").click(function(){
          message = (this.checked) ? "message1" : "message2"; 
           alert(message);
        });  
      });
    }
  };
}(jQuery));

