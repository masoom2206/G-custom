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
/**
 * verify mobile popup
 **/
jQuery(document).ready(function() {
	jQuery('.show-hide-meter').click(function(){
		var uid = jQuery(this).attr('uid');
		jQuery('.user-section-meter-'+uid).toggle(400);
		jQuery('.percent-meter-'+uid).toggle(400);
		if(jQuery(this).text() == 'Show All Meter') {
			jQuery(this).text('Hide All Meter');
		}
		else {
			jQuery(this).text('Show All Meter');
		}
	});
});
