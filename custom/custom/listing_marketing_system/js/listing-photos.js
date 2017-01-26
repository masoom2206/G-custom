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
	Drupal.behaviors.listing_photos = {
		attach: function(context, settings) {
			jQuery('#listing-photos-draggable').sortable({
				appendTo: "body",
				helper: "clone",
				scroll: false,
				cursorAt: {left: 0, top: 0},
			});
			jQuery('#update-listing-photos-order').click(function(e) {
				e.preventDefault();
				jQuery(this).after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Please wait...</div></div>');
				var neworder = new Array();
				if(jQuery('li.photos-draggable').length > 0) {
					jQuery('li.photos-draggable').each(function() {
						//get the id
						var data = {};
						data.id  = jQuery(this).attr("id");
						data.revision_id  = jQuery(this).attr("revision_id");
						//push the object into the array
						neworder.push(data);
					});
					var photo_nid  = jQuery("#listing-photos-draggable").attr("photo_nid");
					// POST to server using $.post or $.ajax
					jQuery.post('/listing-photos/sortable', {"neworder":neworder, "photo_nid":photo_nid}, function(response) {
						if(response){
							jQuery('div.ajax-progress-throbber').remove();
							alert("Saved the new listing photos order!");
						}
					});
				}
				else {
					jQuery('div.ajax-progress-throbber').remove();
					alert("This listing currently has no photos!");
				}
			});
			jQuery('#listing-document').sortable();			
			jQuery('#update-listing-document-order').click(function(e) {
				e.preventDefault();
				jQuery(this).after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Please wait...</div></div>');
				var neworder = new Array();
				if(jQuery('li.document-draggable').length > 0) {
					jQuery('li.document-draggable').each(function() {
						//get the id
						var data = {};
						data.id  = jQuery(this).attr("id");
						data.revision_id  = jQuery(this).attr("revision_id");
						//push the object into the array
						neworder.push(data);
					});
					var document_nid  = jQuery("#listing-document").attr("document_nid");
					// POST to server using $.post or $.ajax
					jQuery.post('/listing-photos/sortable', {"neworder":neworder, "document_nid":document_nid}, function(response) {
						if(response){
							jQuery('div.ajax-progress-throbber').remove();
							alert("Saved the new listing document order!");
						}
					});
				}
				else {
					jQuery('div.ajax-progress-throbber').remove();
					alert("This listing currently has no document!");
				}
			});
			//delete the images from listing-photos/* page
			jQuery('#delete-selected-photos').click(function(e) {
				e.preventDefault();
				var data = jQuery(":checkbox:checked").map(function() {
					return this.value;
				}).get();
				if(data == ''){
					alert('Kindly select the images');
				}
				else {
					var c = confirm("Are you sure you wish to permanently delete the selected images? This action can not be undone.");
					if (c == true) {
						jQuery(this).after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Please wait...</div></div>');
						var photo_nid  = jQuery("#listing-photos-draggable").attr("photo_nid");
						jQuery.post('/listing-photos/delete', {"data":data, "photo_nid":photo_nid}, function(response) {
							if(response){
								jQuery('div.ajax-progress-throbber').remove();
								alert('Deleted the selected images.');
								location.reload();
							}
						});
					}
				}
			});
		}
	};
})(jQuery, Drupal, this, this.document);
