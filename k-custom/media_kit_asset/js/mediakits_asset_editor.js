/**
 * @file
 * Attaches behaviors for the social_media module.
 *
 */
(function($, Drupal) {
    var initialized;
    Drupal.behaviors.mediakits_asset_editor = {
        attach: function(context, settings) {
            if (!initialized) {
                initialized = true;
                 var access_file = drupalSettings.access_file;
				 var icid = drupalSettings.icid;
				/*setTimeout(() => {
				if(access_file){
				  var icid = drupalSettings.icid;
				  var link = document.createElement('a');
                  link.href = "/image-download-path/" + icid;
                  link.click();
                  link.remove();
				}
				}, 5000); */
				
			var count = 5;
			function counter() {
				if ( count > 0 ){
					--count;
					var t2 = setTimeout( counter, 1000 );
					jQuery(".time-counter").text(count) ;
				}
				else{
					clearTimeout(t2);
						if(access_file){
              var design_html = "<div style='background-color:#fff;'><div style='padding-top:40px; padding-bottom:40px;'><div style='background-color:#fff; border:2px solid #ccc; border-radius:4%; width: 400px; height:auto; margin-left:auto; margin-right:auto; padding-top:20px; padding-bottom:20px;'><div style='padding-top:20px; padding-bottom:20px;'><img alt='Kaboodle Media logo' data-align='center' data-entity-type='file' data-entity-uuid='9441979e-ab0f-4e9c-ac21-2aac633e5542' src='https://s3.us-west-2.amazonaws.com/kaboodlemedia.dev.test/s3fs_public/inline-images/kaboodle-logo-350w.png?BzcprKz0e4Rgj9uoWE6EmBj97Ut6QbmV' /><div style='text-align:center; font-size:18px; padding-top:40px; padding-bottom:30px;'><p class='text-align-center' style='font-size:24px;'>Your shared file<br />has been downloaded!</p><p style='padding-top:20px;&quot;'>If&nbsp;you are new to Kaboodle Media we<br />encourage you to check us out.</p></div><div class='homepage-action-button text-center ptop-10 bg-ffffff'><a class='subscription-button sign-up-inquire' href='/plans' id=getstartaction'>VIEW PLANS &amp; SIGN-UP</a></div></div></div></div></div>";
						 // jQuery(".download-waiter").html(design_html);	
             jQuery('.after-download').removeClass('d-none');	
             jQuery('.page-message').addClass('d-none')
						  var link = document.createElement('a');
						  link.href = "/mekiakit-download-path/" + icid;
						  link.click();
						  link.remove();
						}
				}
			}
            if(access_file){
				jQuery(".page-message").append('<span class="download-waiter">Your download will start in <span class="time-counter" style="font-weight:700; font-family: Open Sans, sans-serif;">10</span> seconds...</span>') ;
			 var countdown_timeout = counter();
			}    
        }	
        }
        };
})(jQuery, Drupal);        