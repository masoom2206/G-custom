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
(function ($, Drupal, window, document, undefined) {
	// To understand behaviors, see https://drupal.org/node/756722#behaviors
	Drupal.behaviors.listing_video = {
		attach: function(context, settings) {
			jQuery('.magnify').click(function(){
				var url = jQuery(this).attr('photo-url');
				jQuery('#image_popup').bPopup({
					content: 'image', //'ajax', 'iframe' or 'image'
					contentContainer: '.image_area',
					loadUrl: url,
					onOpen: function() {
						jQuery('.b-close').html('X');
						jQuery('.button').show();
					},
					onClose: function() {
						jQuery('.image_area').empty();
						jQuery('.b-close').empty();
						jQuery('.button').hide();
					}
				});
			});
		}
	};
})(jQuery, Drupal, this, this.document);
