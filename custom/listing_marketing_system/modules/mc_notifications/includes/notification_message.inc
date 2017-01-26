<?php
/**
 * @file
 * MC Notifications Configuration tool
 */

/**
 * Callback function notification_message_list()
 * to mc notification message list
 **/
function notification_message_list($nid){
	$output = '';
	$output .= l('Add Notification Message', 'admin/config/marketing-concierge/mc-notifications/add-message');
	$header = array(
		array('data' => t('Title'), 'width'=>'50%'),
		array('data' => t('Status'), 'width'=>'20%'),
		array('data' => t('Send To'), 'width'=>'15%'),
		array('data' => t('Operation'), 'width'=>'15%'),
	);
	$query = db_select('mc_notifications', 'mcn');
	$query->fields('mcn');
	$query->orderBy('mcn.id', 'ASC');
	$result = $query->execute();
	$rows = array();
	foreach($result as $mcn_messages) {
		//print "<pre>";print_r($mcn_messages);exit;
		$rows[] = array(
			l($mcn_messages->title, 'mcn/message-body/'.$mcn_messages->id, array('attributes' => array('rel' => 'modal-node-popup'))),
			$mcn_messages->mc_status,
			strtoupper($mcn_messages->mc_send_to),
			l('Edit', 'admin/config/marketing-concierge/mc-notifications/add-message', array('query' => array('id' => $mcn_messages->id), 'attributes' => array('rel' => 'modal-node-popup')))."&nbsp;&nbsp;&nbsp;".l('Delete', 'admin/config/marketing-concierge/mc-notifications/message/delete/'.$mcn_messages->id)
		);
	}
	$output .= theme('table',
		array(
			'header' => $header,
			'rows'=> $rows,
			'attributes' => array('class' => array('mc-notifications')),
			'sticky' => TRUE,
			'empty' => 'No notification message!',
			)
		);
	return $output;
}
/**
 * Form API to add the mc notifications message
 **/
function add_mc_notification_message_form($form, &$form_state){
	$result_row = array();
	if(isset($_GET['id']) && $_GET['id'] != '' && is_numeric($_GET['id'])) {
		$query = db_select('mc_notifications', 'mcn');
		$query->fields('mcn');
		$query->condition('mcn.id', $_GET['id'], '=');
		$result_row = $query->execute()->fetchAssoc();
	}
	$id = (!empty($result_row)) ? $result_row['id'] : '';
	$title = (!empty($result_row)) ? $result_row['title'] : '';
	$mc_status = (!empty($result_row)) ? $result_row['mc_status'] : '';
	$mc_send_to = (!empty($result_row)) ? $result_row['mc_send_to'] : '';
	$mc_reply_to = (!empty($result_row)) ? $result_row['mc_reply_to'] : '';
	$subject = (!empty($result_row)) ? $result_row['subject'] : '';
	$header_image = (!empty($result_row)) ? $result_row['header_image'] : '';
	$body = (!empty($result_row)) ? $result_row['body'] : '';
	//Form
	$form['id'] = array(
		'#type' => 'hidden',
		'#value' => $id,
	);
	$form['title'] = array(
		'#type' => 'textfield',
		'#title' => t('Notification Message Title'),
		'#size' => 30,
		'#default_value' => $title,
		'#attributes' => array('placeholder' => t('Notification Message Title')),
		//'#required' => TRUE,
	);
	$vid = db_query('SELECT vid FROM taxonomy_vocabulary WHERE name like :name', array(':name' => 'Marketing Concierge Status'))->fetchField();
	$terms = taxonomy_get_tree($vid);
	//print "<pre>";print_r($terms);exit;
	$term_options = array('_none_' => 'Select Status', 'Order Placed' => 'Order Placed');
	foreach($terms as $key => $term) {
		$term_options[$term->name] = $term->name;
	}
	$form['mc_status'] = array(
		'#type' => 'select',
		'#title' => t('Select MC Status'),
		'#options' => $term_options,
		'#default_value' => $mc_status,
		'#required' => TRUE,
		'#description' => t('Select Marketing Concierge Commerce Order Status.'),
	);
	$form['mc_send_to'] = array(
		'#type' => 'select',
		'#title' => t('Send to'),
		'#default_value' => $mc_send_to,
		'#options' => array('_none_' => 'Select Send To', 'agent' => 'Listing Agent', 'mc' => 'Marketing Coordinator'),
		'#required' => TRUE,
		'#description' => t('Select Send to option.'),
	);
	$form['mc_reply_to'] = array(
		'#type' => 'select',
		'#title' => t('Reply to'),
		'#options' => array('_none_' => 'Select Reply To', 'no-reply' => 'No Reply', 'agent' => 'Listing Agent Email', 'mc' => 'Marketing Coordinator Email'),
		'#default_value' => $mc_reply_to,
		'#required' => TRUE,
		'#description' => t('Select Reply to option.'),
	);
	$form['subject'] = array(
		'#type' => 'textfield',
		'#title' => t('Subject'),
		'#size' => 30,
		'#default_value' => $subject,
		'#attributes' => array('placeholder' => t('Enter Subject')),
		'#required' => TRUE,
	);
	$form['header_image'] = array(
		'#type' => 'managed_file',
		'#name' => 'header_image',
		'#title' => t('Header Image'),
		'#size' => 40,
		'#description' => t("Upload Header Image."),
		'#default_value' => $header_image,
		'#theme' => 'header_image_preview',
		//'#theme_wrappers' => array('header_image_preview'),
		'#upload_validators' => array('file_validate_extensions' => array('jpeg jpg png gif')),
		'#upload_location' => 'public://notification_header',
	);
	$form['body'] = array(
		'#type' => 'text_format',
		'#title' => 'Body',
		'#default_value' => $body,
		'#format' => 'full_html',
	);
	// Token tree display STARTS
	  if (module_exists('token')) {
		$form['token_tree'] = array(
		  '#theme' => 'token_tree',
		  '#token_types' => array('mc_notifications'),
		);
	  }
	  else {
		$form['token_tree'] = array(
		  '#markup' => '<p>' . t('Enable the <a href="@drupal-token">Token module</a> to view the available token browser.', array('@drupal-token' => 'http://drupal.org/project/token')) . '</p>',
		);
	  }
	 // Token tree display ENDS
	$form['actions']['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Save Message'),
		'#required' => TRUE,
	);
	return $form;	
}
/**
 * Form API to add the mc notifications message
 **/
function add_mc_notification_message_form_submit($form, &$form_state){
	$values = $form_state['values'];
	//print "<pre>";print_r($values);exit;
	if(isset($values['id']) && $values['id'] != '') {
		$id = $values['id'];
	}
	else if(isset($_GET['id']) && $_GET['id'] != '') {
		$id = $_GET['id'];
	}
	else {
		$id = '';
	}
	if (isset($values['header_image']) && $values['header_image'] != 0) {
		$file = file_load($values['header_image']);
		$file->status = FILE_STATUS_PERMANENT;
		file_save($file);
		file_usage_add($file, 'notification_message', 'mcnm', $file->fid);

		//$foo->image = $file->fid;
	}
	if($id != '') {
		$query = db_select('mc_notifications', 'mcn');
		$query->fields('mcn', array('header_image'));
		$query->condition('mcn.id', $id, '=');
		$image_fid = $query->execute()->fetchField();
		if($image_fid != 0 && $image_fid != $values['header_image']){
			$file =  file_load($image_fid);
			if ($file) {
				//print "<pre>";print_r($file);exit;
				file_usage_delete($file, 'notification_message', 'mcnm', $file->fid);
				file_delete($file);
			}
		}
		db_merge('mc_notifications')
			  ->key(array('id' => $id))
				->fields(array(
					'title' => $values['title'],
					'mc_status' => $values['mc_status'],
					'mc_send_to' => $values['mc_send_to'],
					'mc_reply_to' => $values['mc_reply_to'],
					'subject' => $values['subject'],
					'header_image' => $values['header_image'],
					'body' => $values['body']['value'],
				))
				->execute();
		drupal_set_message(t('Notification message updated successfully.'), 'status');
	}
	else {
		db_insert('mc_notifications')
			->fields(array(
				'title' => $values['title'],
				'mc_status' => $values['mc_status'],
				'mc_send_to' => $values['mc_send_to'],
				'mc_reply_to' => $values['mc_reply_to'],
				'subject' => $values['subject'],
				'header_image' => $values['header_image'],
				'body' => $values['body']['value'],
			))
			->execute();
		drupal_set_message(t('Notification message added successfully.'), 'status');
	}
}
/**
 * form API
 * Notification Message delete confirm form
 */
function mc_notification_delete_confirm_form($form, $form_state, $id = NULL) { 
	//you can pass variables here if need be
	$form['id'] = array(
		'#type' => 'value',
		'#value' => $id,
	); 
	//you can set a redirect if needed
	$form['#redirect'] = '/admin/config/marketing-concierge/mc-notifications/message';

	return confirm_form($form,
		t('Are you sure you want to delete the message?'), //message title
		isset($_GET['destination']) ? $_GET['destination'] : 'admin/config/marketing-concierge/mc-notifications/message', //redirect if cancelled
		t('Only say yes if you are really sure.'), //message description
		t('Delete Message'), //confirm button text
		t('Cancel') //cancel button text
	);  
}
 
/**
 * Submit handler for confirm form
 */
function mc_notification_delete_confirm_form_submit($form, &$form_state) {
	//verify that the form was confirmed
	$form_state['redirect'] = 'admin/config/marketing-concierge/mc-notifications/message';
	if ($form_state['values']['confirm']) {
		//Do something here
		$id = (isset($form_state['values']['id'])) ? $form_state['values']['id'] : arg(5);
		$query = db_select('mc_notifications', 'mcn');
		$query->fields('mcn', array('header_image'));
		$query->condition('mcn.id', $id, '=');
		$image_fid = $query->execute()->fetchField();
		if($image_fid != 0){
			$file =  file_load($image_fid);
			if ($file) {
				file_usage_delete($file, 'notification_message', 'mcnm', $file->fid);
				file_delete($file);
			}
		}
		db_delete('mc_notifications')
		  ->condition("id", $id, '=')
		  ->execute();
		drupal_set_message('Your notification message has been deleted');
	}
}
/**
 * Callback function mc_notification_message_body();
 * to displayed the notification message body.
 **/
function mc_notification_message_body($id){
	$output = '<div class="notification-message">';
	if(is_numeric($id)) {
		$query = db_select('mc_notifications', 'mcn');
		$query->fields('mcn');
		$query->condition('mcn.id', $id, '=');
		$message = $query->execute()->fetchAssoc();
		if(!empty($message)) {
			$output .= '<div class="message-subject"><span><strong>Subject:</strong>&nbsp;</span>'.$message['subject'].'</div>';
			$output .= '<div class="message-body"><span><strong>Message Body:</strong>&nbsp;</span>'.$message['body'].'</div>';
		}
	}
	$output .= '</div>';
	return $output;
}
/**
 * Callback function mc_notification_message();
 * to displayed the notification message body.
 **/
function mc_notification_message($id = NULL, $lnid = NULL){
	$message = array();
	if(is_numeric($id)) {
		$query = db_select('mc_notifications', 'mcn');
		$query->fields('mcn');
		$query->condition('mcn.id', $id, '=');
		$message = $query->execute()->fetchAssoc();
	}
	$variables = array(
		'message' => $message,
		'lnid' => $lnid,
	);
	$output = theme('notification_message', array('var_name' => $variables));
	return $output;
}