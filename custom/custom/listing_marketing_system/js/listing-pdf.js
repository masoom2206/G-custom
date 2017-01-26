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
	Drupal.behaviors.listing_pdf_photo = {
		attach: function(context, settings) {
			// jQuery('#listing-photos-draggable').sortable({
				// appendTo: "body",
				// helper: "clone",
				// scroll: false,
				// cursorAt: {left: 0, top: 0},
			// });
			jQuery('#listing-marketing-system-form #edit-submit').click(function(e) {
				e.preventDefault();
				jQuery('#listing-marketing-system-form #edit-submit').attr("disabled", true);
				jQuery('#listing-marketing-system-form .step_submit').after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Updating PDF, please wait...</div></div>');
				$( "#listing-marketing-system-form" ).submit();
			});
			jQuery("#sortable1, #sortable2" ).sortable({
				connectWith: ".connectedSortable",
				items: "li:not(.unsortable)",
				appendTo: "body",
				helper: "clone",
				scroll: false,
				cursorAt: {left: 0, top: 0},
				update:function(){
					//item: jQuery('<li>new item</li>').appendTo(jQuery('#sortable1'));
					jQuery(this).addClass('changed-input');
				},
			}).disableSelection();
			
			jQuery('.image-frame-arrangment .update-pdf-photos-order').click(function(e) {
				e.preventDefault();
				var image_count = jQuery(this).attr('id');
				var li_count = jQuery("#sortable1 li").length;
				if(li_count < image_count){
					alert("Kindly select at least "+ image_count + " images for pdf from Available Photos!");
					return false;
				}else{
					if(li_count > image_count){
						alert("You have selected more than "+ image_count + " images. Only the first "+ image_count + " will be saved for this PDF.");
					}
					jQuery('.image-frame-arrangment .update-pdf-photos-order').attr("disabled", true);
					jQuery(this).after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Processing photos, please wait...</div></div>');
					var neworder = new Array();
					jQuery('#sortable1 li.photos-draggable').each(function() {
						//get the id
						var data = {};
						data.id  = jQuery(this).attr("id");
						data.revision_id  = jQuery(this).attr("revision_id");
						//push the object into the array
						neworder.push(data);
					});
					var mcpdf_nid  = jQuery("#sortable1").attr("mcpdf_nid");
					var nid1  = jQuery("#sortable1").attr("nid1");
					var nid2  = jQuery("#sortable1").attr("nid2");
					var editproof  = 0;
					if (jQuery('.pdf-edit-proof').length) {
						var pdf_section = jQuery('.approve-tabs').attr('pdf_section');
						if(pdf_section == 'pro-brochure') {
							editproof  = 1;
						}
						else if(pdf_section == 'post-card'){
							editproof  = 2;
						}						
					}
					// POST to server using $.post or $.ajax
					jQuery.post('/listing-pdf/sortable', {"neworder":neworder, "mcpdf_nid":mcpdf_nid, "nid1":nid1, "nid2":nid2, "editproof":editproof}, function(response) {
						if(response == 'editproof1'){
							jQuery('div.ajax-progress-throbber').remove();
							var redirect_url = "/pro-brochures-approval/" + nid1;
							window.location.pathname = redirect_url;
						}if(response == 'editproof2'){
							jQuery('div.ajax-progress-throbber').remove();
							var redirect_url = "/postcard-approval/" + nid1;
							window.location.pathname = redirect_url;
						}else{
							jQuery('div.ajax-progress-throbber').remove();
							//window.location.href = window.location.href;
							//alert("Listing photos saved successfully.");
							jQuery('#image_popup .image_area').text('Listing photos saved successfully.');
							jQuery('#image_popup').bPopup({
								onOpen: function() {
									jQuery(this).addClass('popup-confirmation');
									jQuery('.b-close span').html("X");
									jQuery('.button').show();
								},
								onClose: function() {
									jQuery(this).removeClass('popup-confirmation');
									jQuery('.image_area').empty();
									jQuery('.b-close span').empty();
									jQuery('.button').hide();
									window.location.href = window.location.href;
								}
							});
						}
					});
				}
			});
			jQuery('#update-pdf-photos-orders').click(function(e) {
				e.preventDefault();
				jQuery(this).after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Processing photos, please wait...</div></div>');
				var neworder = new Array();
				jQuery('li.photos-draggable').each(function() {
					//get the id
					var data = {};
					data.id  = jQuery(this).attr("id");
					data.revision_id  = jQuery(this).attr("revision_id");
					//push the object into the array
					neworder.push(data);
				});
				var mcpdf_nid  = jQuery("#listing-photos-draggable").attr("mcpdf_nid");
				var nid1  = jQuery("#listing-photos-draggable").attr("nid1");
				var nid2  = jQuery("#listing-photos-draggable").attr("nid2");
				// POST to server using $.post or $.ajax
				jQuery.post('/listing-pdf/sortable', {"neworder":neworder, "mcpdf_nid":mcpdf_nid, "nid1":nid1, "nid2":nid2}, function(response) {
					if(response){
						jQuery('div.ajax-progress-throbber').remove();
						window.location.href = window.location.href;
						alert("Listing photos saved successfully.");
					}
				});
			});
			jQuery('.online_marketing_values').live('change', function() { 
				if (this.checked) {
					jQuery(this).after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Please wait...</div></div>');
					var listing_nid  = jQuery("input[name='online_marketing']").attr("listing_nid");
					var mcpdf_nid  = jQuery("input[name='online_marketing']").val();
					//POST to server using $.post or $.ajax
					jQuery.post('/print-and-go/marketing/weblisting', {"mcpdf_nid":mcpdf_nid, "listing_nid":listing_nid}, function(response) {
						if(response){
							jQuery('div.ajax-progress-throbber').remove();
							window.location.href = window.location.href;
							alert("Saved the Single Website Brochure!");
						}
					}); 
				 }
				 else{
					jQuery(this).after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Please wait...</div></div>');
					var listing_nid  = jQuery("input[name='online_marketing']").attr("listing_nid");
					var mcpdf_nid  = 0;
					//POST to server using $.post or $.ajax
					jQuery.post('/print-and-go/marketing/weblisting', {"mcpdf_nid":mcpdf_nid, "listing_nid":listing_nid}, function(response) {
						if(response){
							jQuery('div.ajax-progress-throbber').remove();
							window.location.href = window.location.href;
							alert("Removed the Single Website Brochure!");
						}
					});
				 }
			});
			jQuery('.online_marketing_shared_listing_values').live('change', function() { 
				if (this.checked) {
					jQuery(this).after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Please wait...</div></div>');
					var listing_nid  = jQuery("input[name='online_marketing_shared_listing']").attr("listing_nid");
					var shared_mcpdf_nid  = jQuery("input[name='online_marketing_shared_listing']").val();
					//POST to server using $.post or $.ajax
					jQuery.post('/print-and-go/marketing/sharedlisting', {"shared_mcpdf_nid":shared_mcpdf_nid, "listing_nid":listing_nid}, function(response) {
						if(response){
							jQuery('div.ajax-progress-throbber').remove();
							window.location.href = window.location.href;
							alert("Saved the Shared listing Brochure!");
						}
					}); 
				 }
				 else{
					jQuery(this).after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Please wait...</div></div>');
					var listing_nid  = jQuery("input[name='online_marketing_shared_listing']").attr("listing_nid");
					var shared_mcpdf_nid  = 0;
					//POST to server using $.post or $.ajax
					jQuery.post('/print-and-go/marketing/sharedlisting', {"shared_mcpdf_nid":shared_mcpdf_nid, "listing_nid":listing_nid}, function(response) {
						if(response){
							jQuery('div.ajax-progress-throbber').remove();
							window.location.href = window.location.href;
							alert("Removed the Shared listing Brochure!");
						}
					});
				 }
			});
		}
	};
})(jQuery, Drupal, this, this.document);
