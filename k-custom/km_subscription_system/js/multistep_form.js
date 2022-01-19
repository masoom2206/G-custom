(function ($, Drupal) {
  Drupal.behaviors.km_subscription_system = {
    attach: function (context,settings) {
      // Initialize form validation on the registration form.
      // It has the name attribute "registration"
      if( jQuery('input[name="captcha_response"]').length == 1 || jQuery('input[name="verification_code"]').length == 1 ) {
        jQuery('.subbutton ').prop('disabled', 'disabled');
      }
      $(".get-start-for-free-form").validate({
        // Specify validation rules
        rules: {
          // The key name on the left side is the name attribute
          // of an input field. Validation rules are defined
          // on the right side
          free_standard_account: {
            required: true,
          },
          first_name: {
            required: true,
            minlength: 2,
            lettersonly: true,
          },
          last_name: {
            required: true,
            minlength: 2,
            lettersonly: true,
          },
          email_address: {
            required: true,
            // Specify that email should be validated
            // by the built-in "email" rule
            email: true,
            properemail: true,
            remote: {
              url: "/validation/checkEmail",
              type: "post",
              data:
              {
              email: function()
                {
                return jQuery('[name="email_address"]').val();
                }
              }
            },
          },
          verification_code: {
            required: true,
            remote: {
              url: "/validation/verification_code",
              type: "post",
              data:
              {
              email: function()
                {
                return jQuery('[name="email_address"]').val();
                }
              }
            },
          },
          password: {
            required: true,
            minlength: 5,
          },
          repeat_password: {
            required: true,
            minlength: 5,
            equalTo: "#password",
          }
        },
        // Specify validation error messages
        messages: {
          first_name: {
            required:"Please enter your first name.",
            minlength: "Your First must be at least 2 characters long.",
            lettersonly: "Only Letters is allowed.",
          },
          last_name: {
            required:"Please enter your last name.",
            minlength: "Your First must be at least 2 characters long.",
            lettersonly: "Only Letters is allowed.",
          },
          password: {
            required: "Please provide a password.",
            minlength: "Your password must be at least 5 characters long.",
          },
          repeat_password:{
            required: "Please provide a password.",
            minlength: "Your password must be at least 5 characters long.",
            equalTo: "Repeat m password not match.",
          },
          email_address: {
            required:"Please enter an email address",
            email:"Please enter a valid email address",
            remote: "The Email Address is already in use!",
            properemail: "Please enter a valid email address",
          },
          verification_code: {
            required:"Please enter an verification code.",
            remote: "Incorrect code entered. Please try again, or submit the link in the email we sent you.",
          },
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function(form) {
          jQuery(".form-submit").attr("disabled", true);
          form.submit();
        }
      });
      
      //Form email code verification validate
      $(".emailverification-form").validate({
        // Specify validation rules
        rules: {
          // The key name on the left side is the name attribute
          // of an input field. Validation rules are defined
          // on the right side
          email_id: {
            required: true,
            // Specify that email should be validated
            // by the built-in "email" rule
            email: true,
            properemail: true,
            remote: {
              url: "/validation/checkEmailValid",
              type: "post",
              data:
              {
              email: function()
                {
                return jQuery('[name="email_id"]').val();
                }
              }
            },
          },
          verification_code: {
            required: true,
            remote: {
              url: "/validation/verification_code",
              type: "post",
              data:
              {
              email: function()
                {
                return jQuery('[name="email_id"]').val();
                }
              }
            },
          },
        },
        // Specify validation error messages
        messages: {
          email_id: {
            required: "Please enter an email address.",
            email: "Email address is not known. Please use the email address you originally submitted.",
            properemail: "Please enter a valid email address.",
            remote: "Email address is not known. Please use the email address you originally submitted.",
          },
          verification_code: {
            required:"Please enter an verification code.",
            remote: "Incorrect code entered. Please try again, or submit the link in the email we sent you.",
          },
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function(form) {
          jQuery(".form-submit").attr("disabled", true);
          form.submit();
        }
      });
      jQuery.validator.addMethod("lettersonly", function(value, element) {
        return this.optional(element) || /^[0-9a-zñáéíóúü' -]+$/i.test(value);
      }, "Letters only please");
      jQuery.validator.addMethod("properemail", function(value, element) {
        return this.optional(element) || /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,5}\b$/i.test(value);
      }, "Please enter a valid email address.");
      jQuery('.get-start-for-free-form input').on('blur keyup', function() {
        if( jQuery('input[name="captcha_response"]').length == 1 ) {
          if(grecaptcha.getResponse() != '')  {
            if (jQuery(".get-start-for-free-form").valid()) {
              jQuery('.subbutton ').prop('disabled', false);  
            } else {
              jQuery('.subbutton ').prop('disabled', 'disabled');
            }
          }
        }
        else  if( jQuery('input[name="verification_code"]').length == 1 )  {
          if (jQuery(".get-start-for-free-form").valid()) {
            jQuery('.subbutton ').prop('disabled', false);  
          } else {
            jQuery('.subbutton ').prop('disabled', 'disabled');
          }
        }
        else {
           jQuery('.subbutton ').prop('disabled', false);   
        }
      });
      jQuery('.emailverification-form input').on('blur keyup', function() {
        if( jQuery('input[name="captcha_response"]').length == 1 ) {
          if(grecaptcha.getResponse() != '')  {
            if (jQuery(".emailverification-form").valid()) {
              jQuery('.subbutton ').prop('disabled', false);  
            } else {
              jQuery('.subbutton ').prop('disabled', 'disabled');
            }
          }
        }
        else  if( jQuery('input[name="verification_code"]').length == 1 )  {
          if (jQuery(".emailverification-form").valid()) {
            jQuery('.subbutton ').prop('disabled', false);  
          } else {
            jQuery('.subbutton ').prop('disabled', 'disabled');
          }
        }
        else {
           jQuery('.subbutton ').prop('disabled', false);   
        }
      });
      //
    var server_name = drupalSettings.km_subscription_system.server_name;
    var expert_val = 0;
   if(server_name == 'dev'){
      expert_val = 543;
   }else if(server_name == 'staging'){
      expert_val = 600;
   }else {
		expert_val = 600;
	} 
   if(jQuery("input[name='free_standard_account']:checked").val() == expert_val){
    jQuery("#user-notice").removeClass("d-none");
  }else{
  jQuery("#user-notice").addClass("d-none");
  }  
   jQuery('input:radio[name="free_standard_account"]').change(
    function(){
        if (jQuery(this).is(':checked')) {
            
          if(jQuery("input[name='free_standard_account']:checked").val() == expert_val){
           jQuery("#user-notice").removeClass("d-none");
          }else{
            jQuery("#user-notice").addClass("d-none");
         }
        }
    });
      //
    }
  };
})(jQuery, Drupal);

function correctCaptcha() {
  if( jQuery('.get-start-for-free-form input[name="captcha_response"]').length == 1 ) {
    if(grecaptcha.getResponse() != '')  {
      if (jQuery(".get-start-for-free-form").valid()) {
        jQuery('.subbutton ').prop('disabled', false);  
      } else {
        jQuery('.subbutton ').prop('disabled', 'disabled');
      }
    }
  }
  if( jQuery('.emailverification-form input[name="captcha_response"]').length == 1 ) {
    if(grecaptcha.getResponse() != '')  {
      if (jQuery(".emailverification-form").valid()) {
        jQuery('.subbutton ').prop('disabled', false);  
      } else {
        jQuery('.subbutton ').prop('disabled', 'disabled');
      }
    }
  }
}

function recaptchaExpired() {
  jQuery('.subbutton ').prop('disabled', 'disabled');
}