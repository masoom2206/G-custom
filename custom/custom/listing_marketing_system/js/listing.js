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
	Drupal.behaviors.my_listing = {
		attach: function(context, settings) {
			jQuery('.pdf_brochure').live('change', function() { 
				if (this.checked) {
					//alert('checked');
				 }
				 else{
					var id = jQuery(this).attr('id');
					if(id.length > 0){
						//alert('hello');
					}
					else{
						var list_id = jQuery(this).attr('name');
						alert('This listing does not currently have a Print and Go brochure available for download. To prepare and assign a brochure return to the "Listing Tools" > "Print and Go" feature to create and/or select a brochure.');
						jQuery(this).attr('checked', true);
						//var base = Drupal.settings.base_url;
						//window.location.replace(base + "/print-and-go/"+ list_id);
					}
				 }
			});
			//Shared lisitng download link at shared page
			jQuery('.shared_listing_download').live('click', function() { 
				
					var id = jQuery(this).attr('id');
					if(id.length > 0){
						//alert('hello');
					}
					else{
						alert('This listing does not currently have a Print and Go brochure available for download. To prepare and assign a brochure return to the "Listing Tools" > "Print and Go" feature to create and/or select a brochure.');
						return false;
					}
			});
			//Shared lisitng link at manage listing page
			jQuery('.share_listing').live('click', function() { 
				
					var id = jQuery(this).attr('id');
					if(id.length > 0){
						//alert('hello');
					}
					else{
						alert('We\'re sorry. Your listing is not quite ready to be shared. Please be sure you have first activated the single property website (via the "website" tile). Then create and select a "Print and Go" brochure to be shared.');
						return false;
					}
			});
			//Displayed active or Inactive list at my-listings page
			jQuery('.filter-my-list li').click(function(e){
				var className = jQuery(this).attr('status');
				if(className == 'yes') {
					jQuery("#edit-status").val(1).change();
				}
				else {
					jQuery("#edit-status").val(0).change();
				}
			});
			//Displayed edit field for node URL at web page
			jQuery('.edit-web-page-url').click(function(e){
				jQuery('.edit-web-page-url').hide();
				jQuery('.webpageurl').hide();
				jQuery('.action-webpage-url').show();
				jQuery("a.web-listing-link").attr("href", "javascript: void(0)");
			});
			jQuery('.update-web-page-url').click(function(e){
				//jQuery(this).after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Please wait...</div></div>');
				var urli = jQuery('#web_page_url').val();
				//url.replace(/\s+/g, '-').toLowerCase();
				var url = urli.replace(/[!@#$%^&*(<)>+_\s]/g, '-');
				if(url != '') {
					jQuery('.webpageurl').text(url)
					jQuery('.action-webpage-url').hide();
					jQuery('.edit-web-page-url').show();
					jQuery('.webpageurl').show();
					jQuery('div.ajax-progress-throbber').remove();
				}
				else {
					jQuery('div.ajax-progress-throbber').remove();
				}
			});
			//check any one design at web page
			jQuery('.design-name input').click(function(e){
				jQuery('.design-name input').attr('checked', false);
				jQuery(this).attr('checked', true);
			});
			jQuery('#update-listing-website-settings').click(function(e){
				e.preventDefault();
				jQuery(this).after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Please wait...</div></div>');
				var url = jQuery('#web_page_url').val();
				var nid = jQuery(this).attr("listing-nid");
				var data = jQuery(":checkbox:checked").map(function() {
					return this.id;
				}).get();
				var mp3 = '';
				if(jQuery("#background_music").is(':checked')) {
					if($("#listing-musics input[type='radio']").is(":checked")) {
						mp3 = jQuery("#listing-musics input[type='radio']:checked").val();
					}
					else {
						alert('Please select any audio.');
						jQuery('div.ajax-progress-throbber').remove();
						return false;
					}
				}
				jQuery.post('/website-settings', {"data":data, "url":url, "nid":nid, "mp3":mp3}, function(response) {
					if(response == 'done'){
						jQuery('div.ajax-progress-throbber').remove();
						alert("Your Property Web Page settings have been successfully updated.");
					}
					else if(response == 'not-done') {
						jQuery('div.ajax-progress-throbber').remove();
						alert("Your Property Web Page settings have been not updated.");
					}else if(response == 'alias exists') {
						jQuery('div.ajax-progress-throbber').remove();
						alert("The path you have entered is already in use. Please try another.");
					}
					/*if(response){
						alert(response);
						jQuery('div.ajax-progress-throbber').remove();
					}*/
				});
			});
			//Show hide music list.
			if(jQuery("#background_music").is(':checked')) {
				jQuery('#listing-musics').show();
			}
			else {
				jQuery('#listing-musics').hide();
			}
			jQuery('#background_music').click(function(e){
				jQuery("#listing-musics").toggle(this.checked);
			});
			//Playing audio in web setting page.
			var audioElement = document.createElement('audio');
			var fid = '';
			jQuery(".play").click(function (e) {
				var current_fid = jQuery(this).parent().attr('fid');
				e.preventDefault();
				var url = jQuery(this).attr('url');
				var seconds = audioElement.currentTime;			
				if(fid == '' || fid == current_fid) {
					if(seconds == 0 || audioElement.paused == true){
						fid = current_fid;
						audioElement.setAttribute('src', url);
						audioElement.load();
						audioElement.addEventListener("load", function() { 
						audioElement.play(); 
						}, true);
						jQuery('.playing').hide()
						jQuery(this).find('.playing').show();
						audioElement.play();
					}
					else {
						jQuery('.playing').hide()
						audioElement.pause();
					}
				}
				else if(fid != current_fid) {
					fid = current_fid;
					audioElement.setAttribute('src', url); 
					audioElement.load();
					audioElement.addEventListener("load", function() {
					audioElement.play(); 
					}, true);
					jQuery('.playing').hide()
					jQuery(this).find('.playing').show();
					audioElement.play();
				}
			});
			//Play audio at web listing page
			if(jQuery('a.listing-audio-play').length > 0) {
				var url = jQuery('a.listing-audio-play').attr('url');
				audioElement.setAttribute('src', url);
				audioElement.load();
				audioElement.addEventListener("load", function() { 
					audioElement.play(); 
				}, true);
				audioElement.play();
			}
			//Open Embed code page in modal window
			jQuery("#listing-embed-link").click(function(e){
				e.preventDefault();
				jQuery('#listing-embed-code').bPopup();
			});
			//copy embed code in clipboard
			jQuery("#d_clip_button").click(function(e){
				e.preventDefault();
				var text = jQuery("textarea#web_widgets_0").val();
				window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
			});
			//download embed code as .txt file
			jQuery("#embed_code_download").click(function(e){
				e.preventDefault();
				var code = jQuery("textarea#web_widgets_0").val();
				var base = Drupal.settings.base_url;
				window.location.replace(base + "/embed-code/download?code="+ code);
			});
			jQuery("#listing-modal-back").click(function(e){
				e.preventDefault();
				var bPopup = jQuery("#image_popup").bPopup();
				bPopup.close();
				/*jQuery("#image_popup .b-close span").trigger("click");
				alert('click');*/
			});
			//open LMS Client Report in modal window
			if(jQuery('#client_report_preview').length > 0) {
				jQuery('#client_report_preview').hide();
				setTimeout(function() {
					jQuery('#client_report_preview').trigger('click');
				},10);				
			}
			jQuery("#client_report_preview").click(function(e){
				e.preventDefault();
				var nid = jQuery(this).attr('nid');
				var url = '/node/' + nid;
				jQuery('#image_popup').bPopup({
					content: 'iframe', //'ajax', 'iframe' or 'image'
					contentContainer: '.image_area',
					loadUrl: url,
					follow: [false, false],
					position: [250, 100],
					iframeAttr: 'scrolling="yes"',
					onOpen: function() {
						jQuery('.b-close span').html("X");
						jQuery('.button').show();
					},
					onClose: function() {
						jQuery('.image_area').empty();
						jQuery('.b-close span').empty();
						jQuery('.button').hide();
					}
				}, function(){
					jQuery("#image_popup iframe").css('width', "750px");
					jQuery("#image_popup iframe").css('height', "730px");
				});
			});
			jQuery('#cbone-listing-email-form .form-submit').click(function(e){
				var con = confirm("Are you sure you wish to send this message now?");
				if (con == true) {
					jQuery(this).attr("disabled", "disabled");
					jQuery('form#cbone-listing-email-form').submit();
				} else {
					return false;
				}
			});
			//Import listing photos from "lms_photo_import" table
			jQuery('#import-listing-photos').click(function(e){
				e.preventDefault();
				jQuery(this).after('&nbsp;&nbsp;&nbsp;<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Importing, please wait...</div></div>');
				var nrt_id = jQuery(this).attr("nrt_id");
				var listing_nid = jQuery(this).attr("listing_nid");
				var photo_nid = jQuery(this).attr("photo_nid");
				jQuery.post('/feeds/photo-feed', {"nrt_id":nrt_id, "listing_nid":listing_nid, "photo_nid":photo_nid}, function(response) {
					if(response == 'done'){
						jQuery('div.ajax-progress-throbber').remove();
						alert("Photos have imported successfully!");
						location.reload();
					}
				});
			});
			//MyListing Overlay at image
			jQuery(".my-listings-part-one").hover(
				function() {
					var mc_status = jQuery(this).find(".mc-order-status .mc-status").text();
					if(mc_status != 'N/A') {
						jQuery(this).find(".mc-order-status").show();
					}
				},
				function() {
					jQuery(this).find(".mc-order-status").hide();
				}
			);
			//Import listing photos from "lms_photo_import" table
			jQuery('.accept-and-confirm-order #mcc-order-confirm').click(function(e){
				e.preventDefault();
				jQuery('.accept-and-confirm-order .confirm-order').after('&nbsp;&nbsp;&nbsp;<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Please wait...</div></div>');
				var listing_nid = jQuery(this).attr("listing-nid");
				var product = jQuery(this).attr("product");
				jQuery.post('/lms-listing/mcc-order-confirm', {"listing_nid":listing_nid, "product":product}, function(response) {
					if(response == 'done'){
						jQuery('div.ajax-progress-throbber').remove();
						alert("Order completed successfully!");
						location.reload();
					}
					else if(response == 'accepted'){
						jQuery('div.ajax-progress-throbber').remove();
						alert("Order accepted successfully!");
						location.reload();
					}
				});
			});
			//code for /node/add/client page to change state to uppercase
			jQuery("#edit-field-buyer-state-und-0-value, #edit-field-buyer-property-state-und-0-value").bind('keyup blur', function (e) {
				var node = jQuery(this);
				node.val(node.val().replace(/[^a-zA-Z]/g,'')); 
				node.val(node.val().toUpperCase())
			});
			//Placed label in field placeholder in cb_firstlook_property_post_node_form
			jQuery('#cb-firstlook-property-post-node-form').find(".form-type-textfield").each(function(ev) {
				var label = jQuery(this).children("label").text();				
				if(!jQuery(this).find("input[type=text]").val()) {
					if(jQuery.trim(label) == 'URL') {
						label = 'Weblink';
					}
					jQuery(this).find("input[type=text]").attr("placeholder", label);
				}
			});
			//Popup functionality at cb_firstlook_property_post_node_form
			jQuery('#cb-firstlook-property-post-node-form #edit-submit').click(function(e){
				e.preventDefault();
				jQuery('#firstlook-requirements-popup').bPopup();
			});
			jQuery('.firstlook-yes-save').click(function(e){
				e.preventDefault();
				parent.closeBPopup();
				jQuery("#edit-field-first-look-confirmation-und-1").prop('checked', true);
				jQuery("#cb-firstlook-property-post-node-form").submit();
			});
			jQuery('.firstlook-yes-preview').click(function(e){
				e.preventDefault();
				parent.closeBPopup();
				jQuery("#edit-field-first-look-confirmation-und-1").prop('checked', true);
				jQuery("#cb-firstlook-property-post-node-form #edit-preview").click();
			});
			jQuery('.firstlook-no-cancel').click(function(e){
				e.preventDefault();
				parent.closeBPopup();
				jQuery("#edit-field-first-look-confirmation-und-0").prop('checked', true);
			});
			jQuery('#upgrade-marketing-concierge').click(function(e){
				if(!jQuery(this).hasClass('listing_user')){
					e.preventDefault();
					alert('Only the listing agent may order a Marketing Concierge package.');
					return false;
				}
				else {
				  var msgalert = '';
          if(jQuery(this).hasClass('less_listing_data')){
	          msgalert += 'Details > Marketing Copy is required.\n';
          }
          if(jQuery(this).hasClass('listing_marketing_headline')){
	          msgalert += 'Details > Marketing Copy > Listing Marketing Headline is required.\n';
          }
          if(jQuery(this).hasClass('less_listing_photos')){
	          msgalert += 'Photos > Minimum of four photos are required.\n';
          }
          if (msgalert != '') {
            var mainmsgalert = "Oops! We see you haven't completed all of the requirements needed to place a Marketing Concierge order. Please complete the following in order to proceed. \n\n"+msgalert
            e.preventDefault();
            alert(mainmsgalert);
            return false;
          }
				}
			});
		}
	};
})(jQuery, Drupal, this, this.document);



/**
 * Callback function closeBPopup()
 * to close the bpopup after click
 * on cancel button
 **/
function closeBPopup() {
	jQuery("#firstlook-requirements-popup").bPopup().close()
}
