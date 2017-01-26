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
	Drupal.behaviors.web_listing = {
		attach: function(context, settings) {
				//By Nitesh 07-09-2016 for delete share listing for sharee
			/*jQuery('.my-shared-listings-part-three').live('click', function(e){
				var con = confirm("Are you sure you want to remove this shared listing?");
				if (con == true) {
					return true;
				} else {
					return false;
				}
			});*/
			
			
			jQuery('.responsive-menus .toggler').click(function(){
				jQuery( ".responsive-menus #rm-removed" ).css('display', 'block');
			});
			jQuery('#rm-removed li a').on('click', function(){
				//jQuery('.toggler').click();
				alert('hiii');
			});
			var numItemsmain = jQuery('.web-listing-contact .listing-third-image').length;
			if(numItemsmain==0){
				jQuery('.agent-detail').css('width', '100%');
			}
			var numItems = jQuery('.agents-detail').length;
			if(numItems==2){
				jQuery('.agents-detail').css('width', '50%');
			}
			if(numItems==1){
				jQuery('.agents-detail').css('width', '100%');
			}
			//Displayed edit field for node URL at web page
			jQuery('ul.photos-gallery li').hide().filter(':lt(8)').show();
			jQuery('.less-photos').hide();
			jQuery('.more-photos').click(function(e){
				e.preventDefault();
				var val = jQuery(this).attr('value');
				val = parseInt(val) + 1;
				var total = val * 8;
				jQuery('ul.photos-gallery li').filter(':lt('+total+')').show();
				if(jQuery("ul.photos-gallery li").length > total) {
					jQuery(this).attr('value', val);
					jQuery('.less-photos').attr('value', val);
				}
				else {
					jQuery(this).hide();
				}
				if(val != 1) {
					jQuery('.less-photos').show();
				}
			});
			
			jQuery('.less-photos').click(function(e){
				e.preventDefault();
				jQuery('html, body').animate({
					scrollTop: jQuery( jQuery('#gallery') ).offset().top
				}, 900);
				var val = jQuery(this).attr('value');
				var total = 8;
				val = parseInt(val) - 1;				
				if(val == 0){
					total = 8;
					val = 1;
				}
				else {
					total = val * 8;
				}
				jQuery('ul.photos-gallery li').hide().filter(':lt('+total+')').show();
				if(val == 1) {
					jQuery('.less-photos').hide();					
				}
				if(jQuery("ul.photos-gallery li").length > total) {
					jQuery('.more-photos').show();
				}
				jQuery(this).attr('value', val);
				jQuery('.more-photos').attr('value', val);
				/*if(jQuery("ul.photos-gallery li").length > total) {
					jQuery(this).attr('value', val);
					jQuery('.more-photos').attr('value', val);
				}
				else {
					jQuery(this).hide();
				}*/
			});
			
			//show hide plus sign in image gallery at features page
			/*jQuery("ul.photos-gallery li").mouseenter(function(){
				jQuery(this).find('.plus-image').show();
			});
			jQuery("ul.photos-gallery li").mouseleave(function(){
				jQuery(this).find('.plus-image').hide();
			});*/
			//open image in modal window
			jQuery("ul.photos-gallery li").click(function(){
				var url = jQuery(this).attr('photo-url');			
				jQuery('#image_popup').bPopup({
					content: 'image', //'ajax', 'iframe' or 'image'
					contentContainer: '.image_area',
					loadUrl: url,
					onOpen: function() {
						jQuery('.b-close span').html("X");
						jQuery('.button').show();
						jQuery('.image-share-div').addClass('image');
					},
					onClose: function() {
						jQuery('.image_area').empty();
						jQuery('.b-close span').empty();
						jQuery('.image-share-div').hide();
						jQuery('.button').hide();
						jQuery('.image-share-div').removeClass('image');
					}
				});
			});
			//show hide in photo gallery
			/*jQuery("ul.photos-gallery li").mouseover(function(){
				alert('ddd');
				jQuery(this).find('.text-content').show();
				jQuery(this).find('.mc-design-caption').show();
			});
			jQuery("ul.photos-gallery li").mouseout(function(){
				jQuery(this).find('.text-content').hide();
				jQuery(this).find('.mc-design-caption').hide();
			});*/
			//show hide the social plugin at image
			jQuery("#image_popup").mouseenter(function(){
				jQuery('.image-share-div.image').show();
			});
			jQuery("#image_popup").mouseleave(function(){
				jQuery('.image-share-div.image').hide();
			});
			//Open video in modal popup
			jQuery(".listing-video").click(function(e){
				e.preventDefault();
				jQuery('.listing-youtube').bPopup();
			});
			//open document download form
			jQuery("#download-document, #contact-agent").click(function(e){
				e.preventDefault();
				var url = jQuery(this).attr('href');
				//alert(url);
				jQuery("#image_popup").css('width', "800px");
				jQuery("#image_popup").css('height', "750px");
				jQuery('#image_popup').bPopup({
					content: 'iframe', //'ajax', 'iframe' or 'image'
					contentContainer: '.image_area',
					loadUrl: url,
					speed: 650,
					amsl: 0,
					transition: 'slideDown',
					iframeAttr: ('scrolling="yes" frameborder="0"'),
					onOpen: function() {
						jQuery('.b-close span').html("[ CLOSE ]");
						jQuery(".button").css({'width': "100%", 'border-bottom': "1px solid #ddd", 'text-align': "right", 'background': "none", 'color': "#000", 'padding-bottom': "0px", 'font-weight': "normal", 'font-size': "16px", 'margin-top': "10px", 'border-radius': "0px"});
						jQuery('.button').show();
					},
					onClose: function() {
						jQuery('.image_area').empty();
						jQuery('.b-close span').empty();
						jQuery('.button').hide();
					}
				}, function(){
					jQuery("#image_popup iframe").css('width', "800px");
					jQuery("#image_popup iframe").css('height', "750px");
				});
			});
			//Open video in modal popup
			jQuery(".open-house").click(function(e){
				e.preventDefault();
				jQuery('.open-house-dates').bPopup();
			});
			//Change opacity of header menu
			jQuery(window).scroll(function() {
				if (jQuery(this).scrollTop() > 550) {
					//jQuery( ".lms-listing-menu" ).css('opacity', '1');
					jQuery( ".lms-listing-menu" ).css('background', 'rgba(255, 255, 255, 255)');
				} else {
					//console.log('there');
					//jQuery( ".lms-listing-menu" ).css('opacity', '.8');
					jQuery( ".lms-listing-menu" ).css('background', 'rgba(255, 255, 255, .8)');
				}
			});
			//Scroll the page slow
			jQuery('.listing-menu2 a').click(function(){
				jQuery('html, body').animate({
					scrollTop: jQuery( jQuery.attr(this, 'href') ).offset().top
				}, 1500);				
				return false;
			});
			//Responsive menu for mobile device
			/*jQuery('.meanmenu-reveal').live('click', function(){
				//jQuery('.mean-nav').toggleClass('open');
				var txt = jQuery(this).text();
				if(txt == 'X'){
					jQuery('.mean-nav').addClass('open');
				}
				else {
					jQuery('.mean-nav').removeClass('open');
				}
			});*/
			jQuery(document).on('click','.mean-nav li a', function(){
				//jQuery('.meanmenu-reveal').click();
				jQuery('html, body').animate({
					scrollTop: jQuery( jQuery.attr(this, 'href') ).offset().top
				}, 1500);				
				return false;
			});			
		}
	};
})(jQuery, Drupal, this, this.document);