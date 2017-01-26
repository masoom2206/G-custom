
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


/*jQuery(document).ready(function(){
		jQuery('.like_model').unbind('click').click(function(e) {
			var entity_id = jQuery(this).attr('data-id');
				jQuery.get("/user-who-liked",{id: +entity_id},function(data){
					jQuery('#likemodal .modal-body').html(data);
				});
		});
		
		jQuery("[data-toggle=modal]").tooltip();
		});*/
		
(function ($, Drupal, window, document, undefined) {
	// To understand behaviors, see https://drupal.org/node/756722#behaviors
	Drupal.behaviors.my_cbone_network = {
		attach: function(context, settings) {
			jQuery('.like_model').unbind('click').click(function(e) {
				var entity_id = jQuery(this).attr('data-id');
				jQuery.get("/user-who-liked",{id: +entity_id},function(data){
					jQuery('#likemodal .modal-body').html(data);
				});
			});
			
			jQuery('#likemodal').on('hidden.bs.modal', function () {
				jQuery("#likemodal .modal-body").html(" ");
			});
			
			jQuery("[data-toggle=modal]").tooltip();
		}
	};
})(jQuery, Drupal, this, this.document);
