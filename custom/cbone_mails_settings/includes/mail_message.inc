<?php
/**
 * @file
 * MC Notifications Configuration tool
 */

/**
 * Callback function notification_message_list()
 * to mc notification message list
 **/
function mail_message_list($nid) {
	$output = '';
	$output .= l('Add Mail data', 'admin/config/cbone-mail/mail-notifications/message/add-mail');
	$header = array(
		array('data' => t('Title'), 'width'=>'50%'),
		array('data' => t('Status'), 'width'=>'20%'),
		array('data' => t('Active Key'), 'width'=>'15%'),
		array('data' => t('Operation'), 'width'=>'15%'),
	);
	$query = db_select('cbone_mails_settings_mail', 'mcn');
	$query->fields('mcn');
	$query->orderBy('mcn.id', 'ASC');
	$result = $query->execute();
	$rows = array();
	foreach($result as $mcn_messages) {
		//print "<pre>";print_r($mcn_messages);exit;
		$rows[] = array(
			l($mcn_messages->title, 'listing-pdf-mail/message-body/'.$mcn_messages->id, array('attributes' => array('rel' => 'modal-node-popup'))),
			'Active',
			strtoupper($mcn_messages->active_key),
			l('Edit', 'admin/config/cbone-mail/mail-notifications/message/add-mail', array('query' => array('id' => $mcn_messages->id), 'attributes' => array('rel' => 'modal-node-popup')))."&nbsp;&nbsp;&nbsp;".l('Delete', 'admin/config/cbone-mail/mail-notifications/message/delete/'.$mcn_messages->id)
		);
	}
	$output .= theme('table',
		array(
			'header' => $header,
			'rows'=> $rows,
			'attributes' => array('class' => array('mc-notifications')),
			'sticky' => TRUE,
			'empty' => 'No Mail settings data!',
			)
		);
	return $output;
}

/**
 * Form API to add the mc notifications message
 **/
function add_mail_data_message_form($form, &$form_state) {
	$result_row = array();
	if(isset($_GET['id']) && $_GET['id'] != '' && is_numeric($_GET['id'])) {
		$query = db_select('cbone_mails_settings_mail', 'mcn');
		$query->fields('mcn');
		$query->condition('mcn.id', $_GET['id'], '=');
		$result_row = $query->execute()->fetchAssoc();
	}
	$id = (!empty($result_row)) ? $result_row['id'] : '';
	$title = (!empty($result_row)) ? $result_row['title'] : '';
	$subject = (!empty($result_row)) ? $result_row['subject'] : '';
	$active_key = (!empty($result_row)) ? $result_row['active_key'] : '';
	$header_image = (!empty($result_row)) ? $result_row['header_image'] : '';
	$body = (!empty($result_row)) ? $result_row['body'] : '';
  //Form
	$form['id'] = array(
		'#type' => 'hidden',
		'#value' => $id,
	);
	$form['title'] = array(
		'#type' => 'textfield',
		'#title' => t('Mail Title'),
		'#size' => 30,
		'#default_value' => $title,
		'#attributes' => array('placeholder' => t('Mail Title')),
		//'#required' => TRUE,
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
		'#upload_location' => 'public://mail_notification_header',
	);
	$form['body'] = array(
		'#type' => 'text_format',
		'#title' => 'Body',
		'#default_value' => $body,
		'#format' => 'full_html',
	);
	$form['active_key'] = array(
		'#type' => 'textfield',
		'#title' => t('Reply Key'),
		'#default_value' => $active_key,
	);
	// Token tree display STARTS
	  if (module_exists('token')) {
		$form['token_tree'] = array(
		  '#theme' => 'token_tree',
		  '#token_types' => array('mail_token_data'),
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
function add_mail_data_message_form_submit($form, &$form_state) {
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
		$query = db_select('cbone_mails_settings_mail', 'mcn');
		$query->fields('mcn', array('header_image'));
		$query->condition('mcn.id', $id, '=');
		$image_fid = $query->execute()->fetchField();
		if($image_fid != 0 && $image_fid != $values['header_image']){
			$file =  file_load($image_fid);
			if ($file) {
				//print "<pre>";print_r($file);exit;
				file_usage_add($file, 'cbone_mails_settings_mail', 'cmsm', $file->fid);
				file_delete($file);
			}
		}
		db_merge('cbone_mails_settings_mail')
			  ->key(array('id' => $id))
				->fields(array(
					'title' => $values['title'],
					'subject' => $values['subject'],
					'header_image' => $values['header_image'],
					'active_key' => $values['active_key'],
					'body' => $values['body']['value'],
				))
				->execute();
		drupal_set_message(t('Notification message updated successfully.'), 'status');
	}
	else {
		db_insert('cbone_mails_settings_mail')
			->fields(array(
				'title' => $values['title'],
				'subject' => $values['subject'],
				'header_image' => $values['header_image'],
				'active_key' => $values['active_key'],
				'body' => $values['body']['value'],
			))
			->execute();
		drupal_set_message(t('Notification message added successfully.'), 'status');
	}
}
