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
	Drupal.behaviors.agent_dashboard = {
		attach: function(context, settings) {
			jQuery('.percent-meter-reset').click(function(e){
				e.preventDefault();
				var type = jQuery(this).attr('reset-type');
				if(type == 'daily-quiz') {
					var msg = "Are you sure you wish to reset this person's Daily Quiz to 0% complete?";
				}
				else if(type == 'basic') {
					var msg = "Are you sure you wish to reset this person's Basics Section to 0% complete?";
				}
				var con = confirm(msg);
				if (con == true) {
					jQuery(this).after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div></div>');
					var agent_uid = jQuery(this).attr('agent-uid');
					jQuery.post('/percent-meter/reset', {"agent_uid":agent_uid, "type":type}, function(response) {
						if(response == 'done'){
							jQuery('div.ajax-progress-throbber').remove();
							location.reload();
						}
					});
				} else {
					return false;
				}
			});
			jQuery('.more_links a').click(function(e){
				e.preventDefault();
				var type = jQuery(this).attr('type');
				type = type.replace('-', ' ');
				type = type.toLowerCase().replace(/\b[a-z]/g, function(letter) {
					return letter.toUpperCase();
				});
				jQuery(".quicktabs-tabs li a:contains('"+type+"')").click();
			});
			jQuery('.office_dashboard_top_menu_links .messages').live('click', function(e){
				e.preventDefault();
				var delete_id = jQuery('#delete-mc-notification-message').attr('delete_id');
				var office_id = jQuery( ".office_id" ).text();
				/*var id = "&id="+delete_id+"&office_id"+office_id;
				jQuery.ajax({
					'url': '/office-dashboard-msg',
					'type': 'POST',
					'dataType': 'json',
					'data': id,
					'success': function(data) {*/
				jQuery.post('/office-dashboard-msg', {"id":delete_id,"office_id":office_id}, function(data) {
					if(data){
						jQuery('.messages sup.message-count').text(data.message_count);
						jQuery("#message-"+delete_id+" .message-list .order-detail").removeClass('unread');
						jQuery("#message-"+delete_id+" .message-list .order-detail").addClass('read');
					}
				});
				jQuery(".quicktabs-tabs li a:contains('Messages')").click();
				jQuery(".quicktabs-tabs li a:contains('Messages')").parent().removeClass('active');
				jQuery(".quicktabs-tabs li a:contains('Dashboard')").parent().addClass('active');
			});
			//replace mc notification message after click on list
			jQuery('.message-list').live('click', function(e){
				e.preventDefault();
				var delete_id = jQuery('#delete-mc-notification-message').attr('delete_id');
				var id = jQuery(this).attr('message-id');
				if(delete_id != id) {
					jQuery(this).after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Please wait...</div></div>');
					jQuery('.message-list').removeClass('active');
					jQuery(this).addClass('active');
					jQuery('.caret-icon img').attr('src', '/sites/all/modules/custom/listing_marketing_system/modules/lms_dashboard/images/caret-right-white.jpg');
					jQuery(this).find('.caret-icon img').attr('src', '/sites/all/modules/custom/listing_marketing_system/modules/lms_dashboard/images/caret-right-green.jpg');
					/*var id = "&id="+id;
					jQuery.ajax({
						'url': '/office-dashboard-msg',
						'type': 'POST',
						'dataType': 'json',
						'data': id,
						'success': function(data) {*/
					var office_id = jQuery( ".office_id" ).text();
					jQuery.post('/office-dashboard-msg', {"id":id,"office_id":office_id}, function(data) {
						if(data){
							jQuery('.dashboard-message .msg-date').text('Date: '+data.date);
							jQuery('#delete-mc-notification-message').attr('delete_id', data.id);
							jQuery('.dashboard-message .message-subject').text('Subject: '+data.subject);
							jQuery('.dashboard-message .message-body').html("Message Body:<br/>"+data.message);
							jQuery('.messages sup.message-count').text(data.message_count);
							jQuery('div.ajax-progress-throbber').remove();
							jQuery("#message-"+data.id+" .message-list .order-detail").removeClass('unread');
							jQuery("#message-"+data.id+" .message-list .order-detail").addClass('read');
						}
					});
				}
			});
			//Delete mc notification message after click on delete link
			jQuery('#delete-mc-notification-message').live('click', function(e){
				e.preventDefault();
				var delete_id = jQuery(this).attr('delete_id');
				if(delete_id) {
					var msg = "Are you sure, you want to delete the message";
					doConfirm(msg, function yes(){
						jQuery('#delete-mc-notification-message').after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Please wait...</div></div>');
						var id = "&id="+delete_id;
						jQuery.ajax({
							'url': '/delete-dashboard-msg',
							'type': 'POST',
							'dataType': 'json',
							'data': id,
							'success': function(data) {
								var next_id = jQuery('.message-list.active').parent().next().find('.message-list').attr('message-id');
								var $return = update_mc_message(delete_id, next_id)
							}
						});
					}, function no(){
						jQuery('div.ajax-progress-throbber').remove();
						return false;
					});
				}
			});
			jQuery("#edit-message-sort").change(function () {
				if(jQuery("#mc-message-list li").length > 0){
					var sort = jQuery( "#edit-message-sort option:selected" ).text();
					var office_id = jQuery( ".office_id" ).text();
					//alert(sort);				
					jQuery('#edit-message-sort').after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">Please wait...</div></div>');
					jQuery.post('/office/dashboard-msg', {"sort":sort,"office_id":office_id}, function(response) {
						if(response){
							jQuery('div.ajax-progress-throbber').remove();
							jQuery('div.dashboard-message-list #mc-message-list').remove();
							jQuery('div.dashboard-message-list').append(response);
							jQuery('div.dashboard-message-list .order-detail').css('width', '84.8%');
							jQuery('div.dashboard-message-list .caret-icon').css('width', '33%');
							jQuery("#mc-message-list li").first().find('.message-list').click();
						}
					});
				}
			});
			jQuery("#office-dashboard-group").change(function() {
				var id = jQuery(this).val();
				location.href = Drupal.settings.basePath + "office/dashboard/"+id;
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

/**
 * Calback function update_mc_message()
 * to delete/update mc notification message
 **/
function update_mc_message(message_id, next_id){
	var $this = jQuery('#message-'+next_id);
	var id = "&id="+next_id;
	/*jQuery.ajax({
		'url': '/office-dashboard-msg',
		'type': 'POST',
		'dataType': 'json',
		'data': id,
		'success': function(data) {*/
	var office_id = jQuery( ".office_id" ).text();
	jQuery.post('/office-dashboard-msg', {"id":next_id,"office_id":office_id}, function(data) {
		if(data){
			jQuery('.message-list').removeClass('active');
			jQuery($this).find('.message-list').addClass('active');
			jQuery('.caret-icon img').attr('src', '/sites/all/modules/custom/listing_marketing_system/modules/lms_dashboard/images/caret-right-white.jpg');
			jQuery($this).find('.caret-icon img').attr('src', '/sites/all/modules/custom/listing_marketing_system/modules/lms_dashboard/images/caret-right-green.jpg');
			jQuery('.dashboard-message .msg-date').text('Date: '+data.date);
			jQuery('#delete-mc-notification-message').attr('delete_id', data.id);
			jQuery('.dashboard-message .message-subject').text('Subject: '+data.subject);
			jQuery('.dashboard-message .message-body').html("Message Body:<br/>"+data.message);
			jQuery('div.ajax-progress-throbber').remove();
			jQuery('#message-'+message_id).hide(500);
		}
	});
}