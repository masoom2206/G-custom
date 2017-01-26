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
	Drupal.upload_mail_list_plupload = Drupal.upload_mail_list_plupload || {};
	//filesAddedCallback
	Drupal.upload_mail_list_plupload.ListfilesAddedCallback = function (up, files) {
		if(up.files.length == 1){
			jQuery('.form-item-listed-mailing-list a.plupload_button.plupload_add').hide('slow');
		}
		else if(files.length > 1){
			alert("Kindly select only one file.");
			up.splice();
		}
		else if(up.files.length > 1){
			alert("Kindly select only one file.");
			up.splice();
			jQuery('.form-item-listed-mailing-list a.plupload_button.plupload_add').show('slow');
		}
	};
	//FilesRemovedCallback
	Drupal.upload_mail_list_plupload.ListFilesRemovedCallback = function (up, files) {
		if(up.files.length == 0){
			jQuery('.form-item-listed-mailing-list a.plupload_button.plupload_add').show('slow');
		}
	};
	//filesAddedCallback
	Drupal.upload_mail_list_plupload.SoldfilesAddedCallback = function (up, files) {
		if(up.files.length == 1){
			jQuery('.form-item-sold-mailing-list a.plupload_button.plupload_add').hide('slow');
		}
		else if(files.length > 1){
			alert("Kindly select only one file.");
			up.splice();
		}
		else if(up.files.length > 1){
			alert("Kindly select only one file.");
			up.splice();
			jQuery('.form-item-sold-mailing-list a.plupload_button.plupload_add').show('slow');
		}
	};
	//FilesRemovedCallback
	Drupal.upload_mail_list_plupload.SoldFilesRemovedCallback = function (up, files) {
		if(up.files.length == 0){
			jQuery('.form-item-sold-mailing-list a.plupload_button.plupload_add').show('slow');
		}
	};
	// To understand behaviors, see https://drupal.org/node/756722#behaviors
	Drupal.behaviors.marketing_concierge = {
		attach: function(context, settings) {
			//show/hide the upload link at marketing-concierge-order/[order_id] page			
			//jQuery("#edit-direct-mail-postcards-upload-own-list").click(function(e){
			jQuery("#direct-mail-upload").click(function(e){
				jQuery('#edit-direct-mail-postcards-upload-own-list').prop('checked', true);
			});
			/*jQuery("input[name='direct_mail_postcards']").click(function(e){
				if(jQuery("#edit-direct-mail-postcards-upload-own-list").is(':checked')) {
					jQuery(".direct-mail-file").show();
				}
				else {
					jQuery(".direct-mail-file").hide();
				}
			});*/
			//jQuery('#marketing-concierge-additional-order-form').on('keyup keydown', 'input', function (e) {
			jQuery(".additional-postcards").keyup(function(e) {
				this.value = this.value.replace(/[^0-9\.]/g,'');
				var subtotal_class = jQuery(this).attr('subtotal-class');
				if(this.value == ''){
					jQuery(this).parent(".form-item").next(".additional-total").find(".listed-total").text("--");
					jQuery(".package."+subtotal_class+" .amount").text("--");
					update_subtotal_amount();
				}
				else {
					var additional = jQuery(this).val();
					if(jQuery.isNumeric(additional)){
						var rate = jQuery(this).parent(".form-item").next(".additional-total").find(".rate").text();
						var total = additional * rate;
						total = parseFloat(total).toFixed(2);
						//update listed-total
						jQuery(this).parent(".form-item").next(".additional-total").find(".listed-total").text("$"+total);
						//update subtotal
						jQuery(".package."+subtotal_class+" .amount").text("$"+total);
						update_subtotal_amount();
					}
				}
			});
			//show/hide the "Just Sold Mailing List" file field
			jQuery("#upload-direct-mail-list-form #edit-same-listed-list").click(function(e) {
				jQuery(".form-item-sold-mailing-list").toggle();
			});
			//close popup after click on cancel button
			jQuery("#upload-direct-mail-list-form #edit-cancel").click(function(e) {
				e.preventDefault();
				parent.closeBPopup();
			});
			/*$(window).load(function() {
				if(jQuery('.mc-form-submit .form-submit').hasClass('cbone-mc-free')) {
					jQuery('.mc-form-submit .form-submit').click();
				}
			});*/
		}
	};
})(jQuery, Drupal, this, this.document);

/**
 * Callback function update_subtotal_amount()
 * to update the total amount
 **/
function update_subtotal_amount(){
	var subtotal_amount = 00;
	jQuery(".subtotal-total .amount").text("$"+subtotal_amount);
	jQuery('.subtotal .package .amount').each(function() {
		var amount = jQuery(this).text();
		var amountArray = amount.split('$');
		if(jQuery.isNumeric(amountArray[1])) {
			subtotal_amount = subtotal_amount + parseFloat(amountArray[1]);
		}
	});
	subtotal_amount = parseFloat(subtotal_amount).toFixed(2);
	jQuery(".subtotal-total .amount").text("$"+subtotal_amount);
	subtotal_amount = 00;
}
/**
 * Callback function closeBPopup()
 * to close the bpopup after click
 * on cancel button
 **/
function closeBPopup() {
	jQuery("#popup").bPopup().close()
}