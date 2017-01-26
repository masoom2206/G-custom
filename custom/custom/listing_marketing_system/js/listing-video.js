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
	Drupal.behaviors.listing_video = {
		attach: function(context, settings) {
			jQuery('.youtube_container').hide();
			jQuery('#create_video_container').show();
			jQuery('.btn-group button').click(function(){
				var target = "#" + jQuery(this).data("target");
				jQuery(".youtube_container").not(target).hide();
				jQuery(".btn").removeClass('active');
				jQuery(this).addClass('active');
				jQuery(target).show();
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
				},
				receive: function( event, ui ){ //this will prevent move than 3 items in droppable list
					if(jQuery(ui.sender).attr('id')==='sortable2'){
						item: jQuery(ui.item).insertBefore(jQuery('.slide-second'));
					}
					if(jQuery(ui.sender).attr('id')==='sortable2' && jQuery('#sortable1').children('li').length>15){
						jQuery(ui.sender).sortable('cancel');
					}
				}
			}).disableSelection();
			jQuery('#create-video-slide').click(function(e) {
				e.preventDefault();
				jQuery(this).before('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Please wait...</div></div>');
				var fids = new Array();
				jQuery('#sortable1 .slide-photos').each(function() {
					//get the fid
					var fid  = jQuery(this).attr("fid");
					//push the object into the array
					fids.push(fid);
				});
				var nid = jQuery('#sortable1').attr("listing-nid");
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
				if(jQuery("#zoom_effect").is(':checked')) {
					zoom = 1;
				}
				else{
					zoom = 0;
				}
				// POST to server using $.post or $.ajax
				jQuery.post('/listing-video/create', {"fids":fids, "nid":nid, "mp3":mp3, "zoom":zoom}, function(response) {
					if(response == 'done'){
						jQuery('div.ajax-progress-throbber').remove();
						location.reload();
						alert("Video has created successfully!");
					}
					else if(response == 'not done') {
						jQuery('div.ajax-progress-throbber').remove();
						alert("Kindly select images!");
					}
				});
			});
			jQuery('#video-slide-help').click(function(e) {
				e.preventDefault();
				jQuery('#video-slide-help-list').bPopup();
			});
			//code for radio functionality at create video page
			jQuery("input[name='youtube']").click(function(e) {
				jQuery(this).parent().append('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Please wait...</div></div>');
				var active = jQuery(this).val();
				var video_nid  = jQuery(this).attr("video_nid");
				// POST to server using $.post or $.ajax
				jQuery.post('/listing-video/active-url', {"active":active, "video_nid":video_nid}, function(response) {
					if(response){
						jQuery('div.ajax-progress-throbber').remove();
						alert("Saved the active video URL!");
					}
				});
				
			});
		}
	};
})(jQuery, Drupal, this, this.document);
