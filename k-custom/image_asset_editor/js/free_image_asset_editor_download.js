/**
 * @file
 * Attaches behaviors for the social_media module.
 *
 */
(function($, Drupal) {
    var initialized;
    Drupal.behaviors.image_asset_editor = {
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
						  //jQuery(".download-waiter").text('Your image has been downloaded successfully.') ;
                          jQuery('.after-download').removeClass('d-none');	
                          jQuery('.download-image-page').addClass('d-none');
						  var link = document.createElement('a');
						  link.href = "/image-download-path/" + icid;
						  link.click();
						  link.remove();
						}
				}
			}
            if(access_file){
				jQuery(".page-message").append('<span class="download-waiter">Your download will start in <span class="time-counter" style="font-weight:700;font-family: Open Sans";>10</span> seconds...</span>') ;
			 var countdown_timeout = counter();
			}

	        }
        }
    };
})(jQuery, Drupal);

