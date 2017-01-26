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
	Drupal.behaviors.listing_pro_brochures = {
		attach: function(context, settings) {
			jQuery("[id^='submit-approval-for-']").click(function(e){
				e.preventDefault();
				jQuery(this).after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Please wait...</div></div>');
				var nid = jQuery(this).attr("listing-nid");
				var data = jQuery(":checkbox:checked").map(function() {
					return this.id;
				}).get();
				jQuery.post('/pdf-send-for-approval', {"data":data, "nid":nid}, function(response) {
					if(response == 'done'){
						jQuery('div.ajax-progress-throbber').remove();
						alert("The agent has been successfully notified.");
						location.reload();
					}
					else if(response == 'empty'){
						jQuery('div.ajax-progress-throbber').remove();
						alert("Select pdf for approval.");
					}
				});
			});
			//uncheck edit and approve check if reject check clicked
			jQuery("#reject-proofs").click(function(e){
				jQuery("[class^='approve-pdf-']").prop('checked', false);
				jQuery('.edit-pdf').prop('checked', false);
			});
			//uncheck reject check if approve check clicked
			jQuery("[class^='approve-pdf-']").click(function(e){
				jQuery('#reject-proofs').prop('checked', false);
				jQuery('.edit-pdf').prop('checked', false);
			});
			//uncheck reject check if edit check clicked
			jQuery(".edit-pdf").click(function(e){
				jQuery('.edit-pdf').prop('checked', false);
				jQuery(this).prop('checked', true);
				jQuery("[class^='approve-pdf-']").prop('checked', false);
				jQuery('#reject-proofs').prop('checked', false);
			});
			//Submit the brochures approval page for further functionality
			jQuery("#submit-approval-reject-link").click(function(e){
				e.preventDefault();
				jQuery(this).after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Please wait...</div></div>');
				var listing_nid = jQuery(this).attr("listing_nid");
				var pdf_section = jQuery(this).attr('pdf_section');
				var data = jQuery(":checkbox:checked").map(function() {
					return this.id;
				}).get();
				var approve = '';
				var mcpdfs = new Array();
				jQuery('.brochures-approval-body ul li').each(function() {
					//get the id
					var data = {};
					data.id  = jQuery(this).attr("id");
					data.note  = jQuery(this).find(".marketing-coordinator-note textarea").val();
					//push the object into the array
					mcpdfs.push(data);
				});
				var note = '';
				if(jQuery("[class^='approve-pdf-']").is(':checked')) {				
					approve = jQuery("input[name='approve']:checked").attr("id");
					note = jQuery(".marketing-coordinator-note textarea").val();
				}
				jQuery.post('/brochures-approval-update', {"data":data, "listing_nid":listing_nid, "pdf_section":pdf_section, "approve":approve, "note":note, "mcpdfs":mcpdfs}, function(response) {
					if(response == 'done'){
						jQuery('div.ajax-progress-throbber').remove();
						alert("Thank you. Your order has been sent to the printer. You will receive additional information via email.");
						var redirect_url = "/manage-listing/" + listing_nid;
						window.location.pathname = redirect_url;
						//location.reload();
					}
					else if(response == 'reject'){
						jQuery('div.ajax-progress-throbber').remove();
						alert("Your request for new proofs has been sent to your Marketing Coordinator.");
						var redirect_url = "/manage-listing/" + listing_nid;
						window.location.pathname = redirect_url;
					}
					else if(response == 'empty'){
						jQuery('div.ajax-progress-throbber').remove();
						var redirect_url = "/edit-proof/" + listing_nid + "/" + data;
						window.location.pathname = redirect_url;
						//alert("Edit has selected.");
					}
				});
			});
			//Update mcpdf node for pdf view by agent
			jQuery("[id^='view-brochures-pdf-']").click(function(e){
				var mcpdf_nid = jQuery(this).attr("mcpdf_nid");
				if(jQuery('.approve-pdf-' + mcpdf_nid).attr('disabled',true)){
					jQuery.post('/brochures-pdf-view', {"mcpdf_nid":mcpdf_nid}, function(response) {
						if(response == 'done'){
							jQuery('#reject-proofs').prop('checked', false);
							jQuery('.edit-pdf').prop('checked', false);
							jQuery('.approve-pdf-' + mcpdf_nid).attr('disabled', false);
							jQuery('.approve-pdf-' + mcpdf_nid).prop('checked', true);
						}
					});
				}
			});
			//Show/Hide the tab data at PDF proof edit page
			jQuery("li.text-tabs").click(function(e){
				jQuery(".pdf-edit-proof ul.tabs li").removeClass("active");
				jQuery('.edit-proof-data > div').hide();
				jQuery('.edit-proof-text').show();
				jQuery(this).addClass("active");
			});
			jQuery("li.photos-tabs").click(function(e){
				jQuery(".pdf-edit-proof ul.tabs li").removeClass("active");
				jQuery('.edit-proof-data > div').hide();
				jQuery('.edit-proof-photos').show();
				jQuery(this).addClass("active");
			});
			//Check if user has edit the mc_pdf but not saved at "/edit-proof/[nid]/nid" page
			jQuery('#pdf-edit-proof-form').on('change keyup keydown', 'input, textarea', function (e) {
				var keys = [13,37,38,39,40,27,17,18,9,16,20,91,93,48,36,35,45,46,33,34,144,145,19,112,113,114,115,116,117,118,119,120,121,122,123];
				if(jQuery.inArray(e.keyCode, keys) == -1) {
					var original_text = jQuery(this).attr("original-text");
					var current_text =  jQuery(this).val();
					//alert("original_text = "+original_text);
					//alert("current_text = "+current_text);
					if(original_text == current_text){
						jQuery(this).removeClass('changed-input');
					}
					else {
						jQuery(this).addClass('changed-input');
					}
					if(this.checked) {
						jQuery(this).addClass('changed-input');
					}
					//jQuery(this).addClass('changed-input');
				}
			});
			//redirect the user if click on approve tab
			jQuery("li.approve-tabs").click(function(e){
				jQuery(".pdf-edit-proof ul.tabs li").removeClass("active");
				jQuery(this).addClass("active");
				var pdf_section = jQuery(this).attr('pdf_section');
				if(pdf_section == 'pro-brochure') {
					var listing_nid = jQuery('.edit-proof-data').attr("listing_nid");
					var redirect_url = "/pro-brochures-approval/" + listing_nid;
				}
				else if(pdf_section == 'post-card'){
					var listing_nid = jQuery('.edit-proof-data').attr("listing_nid");
					var redirect_url = "/postcard-approval/" + listing_nid;
				}
				if (jQuery('.changed-input').length) {
					var msg = "You have changes that have not been saved.";
					doConfirm(msg, function yes(){
						window.location.pathname = redirect_url;
					}, function no(){
						return false;
					});
				}
				else {
					window.location.pathname = redirect_url;
				}
			});
			//IMPORT LISTING COPY in textarea field at /edit-proof/[nid]/[nid]
			jQuery("#edit-text-options-import-listing-copy").click(function(e){
				if(this.checked) {
					var listing_copy = jQuery('.listing-copy-value').html();
					if(listing_copy != 'N/A' && listing_copy != ''){
						//jQuery('#edit-details-value').text(listing_copy);
						CKEDITOR.instances['edit-details-value'].setData(listing_copy);
					}
					else {
						alert("Empty listing copy.");
						jQuery(this).prop('checked', false);
					}
				}
				else {
					var original_text = jQuery('#edit-details-value').attr("original-text");
					CKEDITOR.instances['edit-details-value'].setData(original_text);
					//alert(original_text);
				}
			});
		}
	};
})(jQuery, Drupal, this, this.document);

/**
 * Calback function doConfirm()
 * to displayed the custom confirm form
 **/
function doConfirm(msg, yesFn, noFn) {
    var confirmBox = jQuery("#confirmBox");
    confirmBox.find(".message").text(msg);
    confirmBox.find(".yes,.no").unbind().click(function()
    {
        confirmBox.hide();
    });
    confirmBox.find(".yes").click(yesFn);
    confirmBox.find(".no").click(noFn);
    confirmBox.show();
}