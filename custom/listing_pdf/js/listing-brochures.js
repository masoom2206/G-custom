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
				var posttype = jQuery(this).attr("posttype");
				var pdf_section = jQuery(this).attr('pdf_section');
				var data = jQuery(":checkbox:checked").map(function() {
					return this.id;
				}).get();
				jQuery.post('/pdf-send-for-approval', {"data":data, "nid":nid, "pdf_section":pdf_section,"posttype":posttype}, function(response) {
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
			//Added by nitesh
			jQuery(".reuse_approved_pdf").click(function(e) {
				var type = jQuery(this).attr('postcard-type');
				if(type == 'listed'){
					var msg = "Creating a just-sold version of this postcard will overwrite the existing just-listed version. Click OK to proceed, or click Cancel to step back and download a copy of the just-listed PDF";
				}else{
					var msg = "Creating a just-listed version of this postcard will overwrite the existing just-sold version. Click OK to proceed, or click Cancel to step back and download a copy of the just-sold PDF";
				}
				if(!confirm(msg)){ return false; };
			
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
				var data = jQuery(":checkbox:checked").map(function() {
					return this.id;
				}).get();
				if(data != 'reject-proofs'){
					 if (!confirm('Are you sure you are ready to submit your order? Once you click "Submit to printer" your order will immediately be sent to the printer and no further edits or changes can be made. Click "Cancel" to close this window and return without submitting the order.')) {
					return false;
				  }
				}
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
				if(data.length === 0 && approve == ''){
					jQuery('div.ajax-progress-throbber').remove();
					alert("Kindly view PDF and select approve!");
					return false;
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
					else if(response == 'error'){
						jQuery('div.ajax-progress-throbber').remove();
						alert("We're sorry but this order encountered a problem. We can not send this order to the print vendor.");
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
					var marketing_headline = jQuery('#edit-marketing-headline').val();
					var details_value = jQuery('#edit-details-value').text();
					if(marketing_headline != '' && details_value != ''){
						var msg = "Are you sure you want to replace the existing Headline and Marketing Copy from the listing data?";
						var r = confirm(msg);
						if (r == true) {
							var listing_copy = jQuery('.listing-copy-value').html();
							var listing_headline = jQuery('.listing-headline-value').text();
							if(listing_copy != 'N/A' && listing_copy != ''){
								//jQuery('#edit-details-value').text(listing_copy);
								CKEDITOR.instances['edit-details-value'].setData(listing_copy);
								jQuery('#edit-marketing-headline').val(listing_headline);
							}
							else {
								alert("Empty listing copy.");
								jQuery(this).prop('checked', false);
							}
						}
						else {
							jQuery('#edit-text-options-import-listing-copy').prop('checked', false);
							return false;
						}
						/*doConfirm(msg, function yes(){
							var listing_copy = jQuery('.listing-copy-value').html();
							var listing_headline = jQuery('.listing-headline-value').text();
							if(listing_copy != 'N/A' && listing_copy != ''){
								//jQuery('#edit-details-value').text(listing_copy);
								CKEDITOR.instances['edit-details-value'].setData(listing_copy);
								jQuery('#edit-marketing-headline').val(listing_headline);
							}
							else {
								alert("Empty listing copy.");
								jQuery(this).prop('checked', false);
							}
						}, function no(){
							jQuery('#edit-text-options-import-listing-copy').prop('checked', false);
							return false;
						});*/
					}
					else {
						var listing_copy = jQuery('.listing-copy-value').html();
						var listing_headline = jQuery('.listing-headline-value').text();
						if(listing_copy != 'N/A' && listing_copy != ''){
							//jQuery('#edit-details-value').text(listing_copy);
							CKEDITOR.instances['edit-details-value'].setData(listing_copy);
							jQuery('#edit-marketing-headline').val(listing_headline);
						}
						else {
							alert("Empty listing copy.");
							jQuery(this).prop('checked', false);
						}
					}
				}
				else {
					var original_text = jQuery('#edit-details-value').attr("original-text");
					CKEDITOR.instances['edit-details-value'].setData(original_text);
					var original_headline = jQuery('#edit-marketing-headline').attr("original-text");
					jQuery('#edit-marketing-headline').val(original_headline);
					//alert(original_text);
				}
			});
			//Auto generate mcpdf
			jQuery("[id^='generate-mcpdf-']").click(function(e){
				e.preventDefault();				
				var listing_nid = jQuery(this).attr('listing_nid');
				var template = jQuery(this).attr('template');
				//parseInt($("#testid").val(), 10);
				var require_photo = parseInt(jQuery(this).attr('require-photo'), 10);
				var listing_photos = parseInt(jQuery('.listing-photos').attr('photos'), 10);
				if(require_photo > listing_photos){
					var less = require_photo - listing_photos;
					alert("This PDF Design requires "+require_photo+" photos but the listing only has "+listing_photos+" photos. Please upload "+less+" additional photos for this listing or select another design with fewer photos.")
					return false;
				}
				else {
					var url = Drupal.settings.basePath + "sites/all/modules/custom/listing_pdf/images/waitscreens.gif";
					jQuery('#image_popup').bPopup({
						content:'image', //'ajax', 'iframe' or 'image'
						contentContainer:'.image_area',
						loadUrl:url, //Uses jQuery.load()
						modalClose:false,
					});
					jQuery.post('/auto-generate-mcpdf', {"listing_nid":listing_nid, "template":template}, function(response) {
						if(response == 'done'){
							location.href = Drupal.settings.basePath + "generate-pdf/"+listing_nid+"/"+template;
						}
					});
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
