
/**
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - https://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth

(function ($) {
	// To understand behaviors, see https://drupal.org/node/756722#behaviors
	

		//jQuery(document).ready(function(){
			
			//run ajax on events pager
			// jQuery('.pages a').click(function(e){
				// e.preventDefault();
				// jQuery(this).after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Please wait...</div></div>');
				// var page_id = jQuery(this).attr('id');
				
				// var data = {'page': page_id};
				// url= Drupal.settings.basePath + 'event-list';
				// jQuery.ajax({
				  // type: "GET",
				  // url: url,
				  // data: data,
				  // success: function(data){
					// jQuery( ".events_list_view" ).html( data );
				  // }
				// });
			// });
		//});
})(jQuery);

(function ($, Drupal, window, document, undefined) {
	// To understand behaviors, see https://drupal.org/node/756722#behaviors
	Drupal.behaviors.events = {
		attach: function(context, settings) {
			
			/* START -- Current month header on upcoming event page */
			
			/* END  -- Current month header on upcoming event page */
			
			
			/* Added js for size in mobile view*/



		}
	};
})(jQuery, Drupal, this, this.document);

