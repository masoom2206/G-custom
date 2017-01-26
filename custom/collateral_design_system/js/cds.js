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
jQuery(document).ready(function() {
	windowHeight = jQuery(window).innerHeight();
	contentHeight = jQuery('.cds-design-content-right').outerHeight();
	if(contentHeight > windowHeight){
		jQuery('.cds-design-content-left').css('height', (contentHeight));
	}
	else{
		jQuery('.cds-design-content-left').css('height', (windowHeight));
	}
	var header_height = jQuery('.design-header').outerHeight();
	jQuery('.design-content-left').css('margin-top', (header_height-2));
	jQuery('.design-content-right').css('margin-top', (header_height-2));
});