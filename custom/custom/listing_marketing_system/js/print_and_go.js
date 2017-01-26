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
	Drupal.behaviors.print_and_go = {
		attach: function(context, settings) {
			//Displayed active or Inactive list at my-listings page
			/*jQuery('input[name=print_and_go]').on('change', function(){
				 jQuery('input[name=print_and_go]').not(this).prop('checked', false);
			});*/
			jQuery('#update-listing-brochures-id').click(function(e) {
				e.preventDefault();
				jQuery(this).after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Please wait...</div></div>');
				if(jQuery("input[name='online_marketing']").is(':checked')) { 
					var listing_nid  = jQuery("input[name='online_marketing']:checked").attr("listing_nid");
				}
				else{
					var listing_nid  = jQuery("input[name='online_marketing_shared_listing']:checked").attr("listing_nid");
				}
				
				var mcpdf_nid  = jQuery("input[name='online_marketing']:checked").val();
				var shared_mcpdf_nid  = jQuery("input[name='online_marketing_shared_listing']:checked").val();
				// POST to server using $.post or $.ajax
				jQuery.post('/print-and-go/marketing', {"mcpdf_nid":mcpdf_nid, "listing_nid":listing_nid, "shared_mcpdf_nid":shared_mcpdf_nid}, function(response) {
					if(response){
						jQuery('div.ajax-progress-throbber').remove();
						alert("Saved successfully");
					}
				}); 
			});
		}
	};
})(jQuery, Drupal, this, this.document);

