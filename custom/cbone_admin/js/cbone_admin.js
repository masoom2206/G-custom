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
	Drupal.behaviors.cbone_admin = {
		attach: function(context, settings) {
			//show hide search field in mobile screen
			jQuery('.cbone-mobile-search-icon').click(function(e){
				jQuery(".cbone-mobile-search-field").toggle();
			});
		}
	};
})(jQuery, Drupal, this, this.document);
