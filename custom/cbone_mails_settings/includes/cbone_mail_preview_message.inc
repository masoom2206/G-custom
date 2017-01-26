<?php
/**
 * Callback function mc_notification_message_body();
 * to displayed the notification message body.
 **/
function cbone_mail_preview_message_body($id){
	$output = '<div class="notification-message">';
	if(is_numeric($id)) {
		$query = db_select('cbone_mails_settings_mail', 'cmsm');
		$query->fields('cmsm');
		$query->condition('cmsm.id', $id, '=');
		$message = $query->execute()->fetchAssoc();
		if(!empty($message)) {
			$output .= '<div class="message-subject"><span><strong>Subject:</strong>&nbsp;</span>'.$message['subject'].'</div>';
			$output .= '<div class="message-body"><span><strong>Message Body:</strong>&nbsp;</span>'.$message['body'].'</div>';
		}
	}
	$output .= '</div>';
	return $output;
}
