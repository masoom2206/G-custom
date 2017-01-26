<?php
/**
 * Callback function listing_pdf_download()
 * to download the PDF file
 **/
function listing_pdf_download($fid){
	global $user;
	//$token = md5(uniqid($user->uid, true));
	$token = (isset($_GET['token']) && $_GET['token'] != '') ? $_GET['token'] : '';
	$file = file_load($fid);
	if ($file) {
		$url = file_create_url($file->uri);
		$query = db_select('field_data_field_lms_listing_reference', 'rn');
		$query->join('field_data_field_lms_listing_documents', 'lds', 'lds.entity_id = rn.entity_id');
		$query->join('field_data_field_lms_listing_document', 'ld', 'ld.entity_id = lds.field_lms_listing_documents_value');
		$query->fields('rn',array('field_lms_listing_reference_nid'));
		$query->condition('ld.field_lms_listing_document_fid', $fid, '=');
		$nid = $query->execute()->fetchField();
		
		if(isset($_GET['fid']) && $_GET['fid'] != ''){
			$md_fid = md5($file->fid);
			if($_GET['fid'] == $md_fid) {
				$result_id = db_merge('cbone_document_history')
				  ->key(array('fid' => $fid, 'token' => $token))
				  ->fields(array(
							'lms_nid' => $nid,
							'fid' => $fid,
							'uid' => $user->uid,
							'user_ip' => $_SERVER['REMOTE_ADDR'],
							'download_time' => REQUEST_TIME,
						  ))
				  ->execute();
				header('Content-disposition: attachment; filename='.$file->filename);
				header('Content-type: application/pdf');
				readfile($url);
			}
		}
		else {
			$result_id = db_merge('cbone_document_history')
			  ->key(array('fid' => $fid, 'token' => $token))
			  ->fields(array(
						'lms_nid' => $nid,
						'fid' => $fid,
						'uid' => $user->uid,
						'user_ip' => $_SERVER['REMOTE_ADDR'],
						'view_time' => REQUEST_TIME,
					  ))
			  ->execute();				
			$md_fid = md5($file->fid);
			$variables = array(
				'url' => $url,
				'fid' => $file->fid,
				'md_fid' => $md_fid,
			);
			$output = theme('listing_document_view', array('var_name' => $variables));
			return $output;
		}
	}
}
/**
 * Callback function cbone_listing_document()
 * to displayed the listing document
 * @return $output
 **/
function cbone_listing_document($nid){
	global $user;
	$output = '';
	$document = array();
	$x = 0;
	$listing_node = node_load($nid);
	//Listing Address
	$address = array();
	if(isset($listing_node->field_lms_listing_address['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_listing_address['und']['0']['value'];
	}
	if(isset($listing_node->field_lms_address_unit['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_address_unit['und']['0']['value'];
	}
	if(isset($listing_node->field_lms_listing_city['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_listing_city['und']['0']['value'];
	}
	if(isset($listing_node->field_lms_listing_state['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_listing_state['und']['0']['value'];
	}
	if(isset($listing_node->field_lms_listing_zip['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_listing_zip['und']['0']['value'];
	}
	$listing_address = implode(', ', $address);
		
	$lms_document_nid = db_select("field_data_field_lms_listing_reference", 'lr');
	$lms_document_nid->fields('lr', array('entity_id'));
	$lms_document_nid->condition('lr.entity_type', 'node', 'LIKE');
	$lms_document_nid->condition('lr.bundle', 'lms_listing_document', 'LIKE');
	$lms_document_nid->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$document_nid = $lms_document_nid->execute()->fetchField();
	$document_node = node_load($document_nid);

	$items = field_get_items('node', $document_node, 'field_lms_listing_documents');
	$item_count = count($items);
	if(!empty($items)) {
		foreach ($items as $delta => $item) {
			$document[$delta]['item_id'] = $item['value'];
			$document[$delta]['delta'] = $delta;
			$document[$delta]['revision_id'] = $item['revision_id'];
			$listing_photos = field_collection_field_get_entity($item);
			if(isset($listing_photos->field_lms_listing_document['und']['0']['uri'])) {
				if($listing_photos->field_lms_listing_document['und']['0']['filemime'] == 'application/pdf' && !isset($listing_photos->field_document_thumbnail['und']['0']['uri'])) {
					$thumb_uri = cbone_create_pdf_preview_thumb($item, $document_node->uid);
					$listing_photos = field_collection_field_get_entity($item);
				}
				$document[$delta]['photo'] = file_create_url($listing_photos->field_document_thumbnail['und']['0']['uri']);
				$document[$delta]['document_url'] = file_create_url($listing_photos->field_lms_listing_document['und']['0']['uri']);
				$document[$delta]['pdf_fid'] = $listing_photos->field_lms_listing_document['und']['0']['fid'];
				$document[$delta]['document_name'] = $listing_photos->field_lms_listing_document['und']['0']['filename'];
			}
			$document[$delta]['document_date'] = date("m-d-Y", strtotime($listing_photos->field_document_update['und']['0']['value']));
			$document[$delta]['document_pages'] = $listing_photos->field_number_of_pages['und']['0']['value'];
			$document[$delta]['document_type'] = $listing_photos->field_lms_document_type['und']['0']['tid'];
			$x++;
		}
	}
	$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
		'listing_uid' => $listing_node->uid,
		'document_nid' => $document_nid,
		'document' => $document,
		'count' => $item_count,
	);
	$output = theme('listing_document', array('var_name' => $variables));
	return $output;
}
/**
 * Callback function cbone_convert_pdf_preview_thumb()
 * to create PDF Preview Thumbnails
 * @ array $image
 **/
function cbone_create_pdf_preview_thumb($item_id, $uid){
	$listing_photos = field_collection_field_get_entity($item_id);
	
	$uri = $listing_photos->field_lms_listing_document['und']['0']['uri'];
	$pdf_url = file_create_url($uri);
	$pdf_content = file_get_contents($pdf_url);
	$pdf_name = basename($pdf_url);
	$pdf_file_explode = explode("?AWSAccessKeyId", $pdf_name);
	$pdf_file_name = $pdf_file_explode[0];
	
	$filepath = 'public://lms/document/pdf-thumb/';
	file_prepare_directory($filepath, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);	
	$pdf_path = drupal_realpath($filepath).'/'.$pdf_file_name;	
	file_put_contents($pdf_path, $pdf_content);
	
	$pdf_file = drupal_realpath($pdf_path);
	//get PDF file name
	$pdf_file_name = basename($pdf_file);
	$pdf_file_name = preg_replace('/\\.[^.\\s]{3,4}$/', '', $pdf_file_name);

	$pdf_first_page = drupal_realpath($pdf_path) . '[0]';

	$document = new Imagick($pdf_file);
	$page_count = $document->getNumberImages();
	$im = new imagick($pdf_first_page);
	$im->setImageFormat('jpeg');
	$im->thumbnailImage(230, 294, true, true);

	//$filepath = 'public://lms/agent-'.$uid.'/pdf-thumb/';
	//$filepath = 's3://lms/agent-'.$uid.'/pdf-thumb/';
	file_prepare_directory($filepath, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);
	$name = $pdf_file_name.'.jpeg';
	$filename = $filepath.$name;
	$write_source = drupal_realpath($filepath).'/'.$name;
	//print $write_source;exit;
	//print $pdf_file_name;exit;
	$im->writeImage($write_source);
	
	$file = (object)array(
		'uid' => $uid,
		'filename' => $pdf_file_name.'.jpeg',
		'uri' => $filename,
		'filemime' => file_get_mimetype($filename),
		'status' => 1,
		'display' => 1,
	);
	//$s3_path = 's3://lms/agent-'.$uid.'/pdf-thumb/'.$name;
	if ($file = file_move($file, $filename, $replace = FILE_EXISTS_RENAME)) {
		$listing_photos->field_number_of_pages['und']['0']['value']  = $page_count;
		$listing_photos->field_document_thumbnail['und']['0'] = (array)$file;
		$listing_photos->save( TRUE );
	}
	$temp_folder = 'public://lms/document/pdf-thumb/';
	$realpath = drupal_realpath($temp_folder);
	$cmd = "rm -R $realpath 2>&1";
	exec($cmd,$op);
	return TRUE;
}

/**
 * Callback function listing_document_upload()
 * to displayed the form to upload Document
 * @return $output
 **/
function listing_document_upload($nid){
	$listing_node = node_load($nid);
	//Listing Address
	$address = array();
	if(isset($listing_node->field_lms_listing_address['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_listing_address['und']['0']['value'];
	}
	if(isset($listing_node->field_lms_address_unit['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_address_unit['und']['0']['value'];
	}
	if(isset($listing_node->field_lms_listing_city['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_listing_city['und']['0']['value'];
	}
	if(isset($listing_node->field_lms_listing_state['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_listing_state['und']['0']['value'];
	}
	if(isset($listing_node->field_lms_listing_zip['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_listing_zip['und']['0']['value'];
	}
	$listing_address = implode(', ', $address);
		
	$lms_document_nid = db_select("field_data_field_lms_listing_reference", 'lr');
	$lms_document_nid->fields('lr', array('entity_id'));
	$lms_document_nid->condition('lr.entity_type', 'node', 'LIKE');
	$lms_document_nid->condition('lr.bundle', 'lms_listing_document', 'LIKE');
	$lms_document_nid->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$document_nid = $lms_document_nid->execute()->fetchField();
	$document_node = node_load($document_nid);

	$items = field_get_items('node', $document_node, 'field_lms_listing_documents');
	$item_count = count($items);
	$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
		'document_nid' => $document_nid,
		'count' => $item_count,
	);
	$output = theme('document_upload', array('var_name' => $variables));
	
	return $output;
}
/**
 * Callback function listing_document_download()
 * to download listing document from feature sectio
 * from web listing page
 * // listing-document/download/%
 **/
function listing_document_download($nid = NULL){
	$output = '';
	$form = drupal_get_form('listing_document_download_form');
	$nid = ($nid == NULL) ? arg(2) : $nid;
	$node = node_load($nid);
	$listing_address = '';
	//Listing Address
	if(isset($listing_node->field_lms_hide_listing_address['und']['0']['value']) && $listing_node->field_lms_hide_listing_address['und']['0']['value'] == 1) {		
		$listing_address = t('Address Available Upon Request');
	}
	else {
		$address = array();
		if(isset($listing_node->field_lms_listing_address['und']['0']['value'])) {
			$address[] = $listing_node->field_lms_listing_address['und']['0']['value'];
		}
		if(isset($listing_node->field_lms_address_unit['und']['0']['value'])) {
			$address[] = $listing_node->field_lms_address_unit['und']['0']['value'];
		}
		if(isset($listing_node->field_lms_listing_city['und']['0']['value'])) {
			$address[] = $listing_node->field_lms_listing_city['und']['0']['value'];
		}
		$listing_address = implode(', ', $address);
	}
	$output .= '<div class="document-section"><div class="listing-address">'.$listing_address.'</div>';
	$output .= '<div class="document-title">Download Listing Documents</div><div class="document-content">Thank you for your interest in viewing this listing\'s documents. To get started, please enter your contact information and select the documents you would like to receive. You will immediately be sent an email message containing the links to download the document files.</div><div class="document-disclaimer">IMPORTANT NOTE: NEITHER COLDWELL BANKER NOR ITS SALES ASSOCIATES HAS OR WILL INVESTIGATE OR OTHERWISE VERIFY THE INFORMATION SUPPLIED BY SELLERS OR OTHERS.</div></div>';
	$output .= drupal_render($form);
	return $output;
}

/**
 * Drupal form API
 * for download document
 **/
function listing_document_download_form() {
	$nid = arg(2);
	$lms_document_nid = db_select("field_data_field_lms_listing_reference", 'lr');
	$lms_document_nid->fields('lr', array('entity_id'));
	$lms_document_nid->condition('lr.entity_type', 'node', 'LIKE');
	$lms_document_nid->condition('lr.bundle', 'lms_listing_document', 'LIKE');
	$lms_document_nid->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$document_nid = $lms_document_nid->execute()->fetchField();
	$document_node = node_load($document_nid);
	$items = field_get_items('node', $document_node, 'field_lms_listing_documents');
	$fids = array();
	if(!empty($items)) {
		foreach ($items as $delta => $item) {
			$listing_document = field_collection_field_get_entity($item);
			$type = $listing_document->field_lms_document_type['und']['0']['tid'];
			$fids[$type][] = array('fid' => $listing_document->field_lms_listing_document['und']['0']['fid'], 'filename' => $listing_document->field_lms_listing_document['und']['0']['filename']);
		}
	}
	$form['lesson_nid'] = array(
		'#type' => 'hidden',
		'#value' => $nid,
		'#prefix' => '<div class="document-download-first">',
	);
	$form['lesson_agent_id'] = array(
		'#type' => 'hidden',
		'#value' => $document_node->uid,
	);
	$form['name'] = array(
		'#type' => 'textfield',
		'#title' => t(''),
		'#size' => 80,
		'#attributes' => array('placeholder' => t('Name (required)')),
	);
	$form['email'] = array(
		'#type' => 'textfield',
		'#title' => t(''),
		'#size' => 80,
		'#attributes' => array('placeholder' => t('Email (required)')),
	);
	$form['phone'] = array(
		'#type' => 'textfield',
		'#title' => t(''),
		'#size' => 80,
		'#attributes' => array('placeholder' => t('Phone (required)')),
	);
	$form['agent_broker'] = array(
		'#type' => 'textfield',
		'#title' => t(''),
		'#size' => 80,
		'#attributes' => array('placeholder' => t('Your agent\'s broker (if applicable)')),
	);
	$active = array(1 => t('Yes'), 0 => t('No'));
	$form['agent_status'] = array(
		'#type' => 'radios',
		'#title' => t('Are you a real estate agent? <span class="required">(required)</span>'),
		'#options' => $active,
	);
	$form['agent_name'] = array(
		'#type' => 'textfield',
		'#title' => t(''),
		'#size' => 80,
		'#attributes' => array('placeholder' => t('Your agent\'s name (if applicable)')),
		'#suffix' => '</div>',
	);
	$form['documents_wrap_first'] = array(
		'#prefix' => '<div class="document-download-second">',
		'#markup' => '<div class="select-documents">'.t('Select documents <span class="required">(1 or more required)</span>').'</div>',
	);
	if(!empty($fids)) {
		ksort($fids);
		foreach($fids as $type => $fid) {
			$term = taxonomy_term_load($type);
			$option = array();
			foreach($fid as $data) {
				$option[$data['fid']] = $data['filename'];
			}
			$form['documents'.$term->tid] = array(
				'#type' => 'checkboxes',
				'#options' => $option,
				'#title' => $term->name,
			);
		}
	}
	else {
		$form['no_documents'] = array(
			'#markup' => t('Document has not uploaded'),
		);
	}
	$form['documents_wrap_last'] = array(
		'#suffix' => '</div>',
	);
	$form['#validate'][] = 'listing_document_download_form_validate';
	$form['actions']['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Submit'),
		'#prefix' => '<div class="document-download-submit">',
		'#suffix' => '</div>',
	);
	return $form;
}
/**
 * Drupal form validate API
 * for download document
 **/
function listing_document_download_form_validate($form, $form_state){
	//print "<pre>";print_r($form_state['values']);exit;
	if($form_state['values']['name'] == '') {
		form_set_error('name', 'Please enter name.');
	}
	if($form_state['values']['email'] == '') {
		form_set_error('email', 'Please enter email');
	}
	else if($form_state['values']['email'] != '' && !valid_email_address($form_state['values']['email'])) {
		form_set_error('email', 'Please enter valid email.');
	}
	if($form_state['values']['phone'] == '') {
		form_set_error('phone', 'Please enter phone number');
	}
	/*if($form_state['values']['phone'] != '' && !is_numeric($form_state['values']['phone'])) {
		form_set_error('phone', 'Please enter valid phone number.');
	}*/
	if($form_state['values']['agent_status'] == '') {
		form_set_error('agent_status', 'Please choose real estate agent.');
	}
	/*else {
		if($form_state['values']['agent_status'] == 0 && $form_state['values']['agent_name'] == '') {
			form_set_error('agent_name', 'Please enter your agent\'s name.');
		}
		if($form_state['values']['agent_status'] == 1 && $form_state['values']['agent_broker'] == '') {
			form_set_error('agent_broker', 'Please enter your agent\'s broker.');
		}
	}*/
	$vid = taxonomy_vocabulary_machine_name_load('lms_document_type')->vid;
	$terms = taxonomy_get_tree($vid);
	$x = 0;
	foreach($terms as $term){
		if(isset($form_state['values']['documents'.$term->tid])) {
			foreach($form_state['values']['documents'.$term->tid] as $checked_data) {
				if($checked_data != 0) {
					$x++;
				}
			}
		}
	}
	if($x == 0) {
		form_set_error('form', 'Please select at least one document.');
	}
}
/**
 * Drupal form submit API
 * for download document
 **/
function listing_document_download_form_submit($form, $form_state){
	//print "<pre>";print_r($form_state['values']);exit;
	global $base_url, $user;
	$vid = taxonomy_vocabulary_machine_name_load('lms_document_type')->vid;
	$terms = taxonomy_get_tree($vid);
	$checked = array();
	$token  = md5(uniqid($user->uid, true));
	$pdfs = '';
	$documents_requested = '';
	$value = array(
		'lms_nid' => $form_state['values']['lesson_nid'],
		'lms_agent_id' => $form_state['values']['lesson_agent_id'],
		'name' => $form_state['values']['name'],
		'email' => $form_state['values']['email'],
		'phone' => $form_state['values']['phone'],
		'agent_status' => $form_state['values']['agent_status'], 
		'agent_name' => ($form_state['values']['agent_name'] != '') ? $form_state['values']['agent_name'] : '',
		'agent_broker' => ($form_state['values']['agent_broker'] != '') ? $form_state['values']['agent_broker'] : '',
		'token' => $token,
		'timestamp' => REQUEST_TIME,
	);
	$request_id = db_insert('document_request')
		->fields($value)
		->execute();
	foreach($terms as $term){
		if(isset($form_state['values']['documents'.$term->tid])) {			
			$x = 0;
			foreach($form_state['values']['documents'.$term->tid] as $checked_data) {
				if($checked_data != 0) {
					if($x == 0) {
						$pdfs .= $term->name."<br/>\r\n";
					}
					$file = file_load($checked_data);
					$pdfs .= '&nbsp;&nbsp;<a href="'.$base_url.'/listing-pdf/download/'.$checked_data.'?token='.$token.'">'.$file->filename.'</a>'."<br/>\r\n";
					//$documents_requested .= $file->filename.'<br/>';					
					$documents_requested .= '&nbsp;&nbsp;<a href="'.$base_url.'/listing-pdf/download/'.$checked_data.'">'.$file->filename.'</a>'."<br/>\r\n";
					$checked[] = $checked_data;
					$x++;
					$history_id = db_insert('cbone_document_history')
					->fields(array(
						'lms_nid' => $form_state['values']['lesson_nid'],
						'fid' => $checked_data,
						'uid' => $user->uid,
						'user_ip' => $_SERVER['REMOTE_ADDR'],
						'token' => $token,
						'view_time' => NULL,
						'download_time' => NULL,
					))->execute();
					$request_fid = db_insert('document_request_fids')
					->fields(array(
						'dr_id' => $request_id,
						'fids' => $checked_data,
					))->execute();
				}
			}
		}
	}
	$checked = implode(', ', $checked);
	if($request_id) {
		$listing_node = node_load($form_state['values']['lesson_nid']);
		$agent_detail = user_load($listing_node->uid);
		//$name = isset($agent_detail->field_firstname['und']['0']['value']) ? $agent_detail->field_firstname['und']['0']['value'].' ' : $agent_detail->name;
		//$name .= isset($agent_detail->field_lastname['und']['0']['value']) ? $agent_detail->field_lastname['und']['0']['value'] : '';
		$name = isset($agent_detail->field_preferred_name['und']['0']['value']) ? $agent_detail->field_preferred_name['und']['0']['value'].' ' : $agent_detail->name;
		$listing_address = '';
		//Listing Address
		if(isset($listing_node->field_lms_hide_listing_address['und']['0']['value']) && $listing_node->field_lms_hide_listing_address['und']['0']['value'] == 1) {		
			$listing_address = t('Listing Documents Requested');
			$subject = t('Listing Documents Requested');
		}
		else {
			//$address = array();
			$address = '';
			if(isset($listing_node->field_lms_listing_address['und']['0']['value'])) {
				$address .= $listing_node->field_lms_listing_address['und']['0']['value'];
			}
			if(isset($listing_node->field_lms_address_unit['und']['0']['value'])) {
				$address .= ', '.$listing_node->field_lms_address_unit['und']['0']['value'];
			}
			if(isset($listing_node->field_lms_listing_city['und']['0']['value'])) {
				$address .= ' | '.$listing_node->field_lms_listing_city['und']['0']['value'];
			}
			//$listing_address = implode(', ', $address);
			$listing_address = $address;
			$subject = "Listing Documents for $address";
		}
		$mailto = $form_state['values']['email'];
		//$subject = 'Listing Documents for '.$listing_address;
		//$header = "From: CB|One <documents@cbone.me>\r\n";
		$header = "From: CB|One <noreply@cbone.me>\r\n";
		//$header .= "Reply-To: documents@cbone.me\r\n";
		$header .= "Reply-To: noreply@cbone.me\r\n";
		$header .= "MIME-Version: 1.0\r\n";
		$header .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
		//Mail Message
		$message = "Dear ".$form_state['values']['name'].",<br/><br/>\r\n";
		$message .= "Thank you for your interest in this listing's documents. Links to the documents are included below.<br/><br/>\r\n";
		$message .= $pdfs."<br/><br/>\r\n";
		$message .= "<b>IMPORTANT NOTE: NEITHER COLDWELL BANKER NOR ITS SALES ASSOCIATES HAS OR WILL INVESTIGATE OR OTHERWISE VERIFY THE INFORMATION SUPPLIED BY SELLERS OR OTHERS.</b><br/><br/>\r\n";
		$message .= "Please do not reply to this message. Replies to this message are routed to an unmonitored mailbox. If you have questions or need additional information, please contact the listing Agent on this property at the email address below.<br/><br/>\r\n";
		$message .= "Again, thank you,<br/>\r\n";
		$message .= $name."<br/>\r\n";
		$message .= $agent_detail->mail."<br/><br/>\r\n";
		if (mail($mailto, $subject, $message, $header)) {
			//Sent notification mail to agent
			$agent_status = ($form_state['values']['agent_status'] == 1) ? 'Agent' : 'Consumer';
			$agentto = $agent_detail->mail;
			//$subject = 'Document request notice for: '.$listing_address;
			//$header = "From: CB|One <documents@cbone.me>\r\n";
			//$header = "From: CB|One <documents@cbone.me>\r\n";
			$header = "From: CB|One <noreply@cbone.me>\r\n";
			$header .= "Reply-To: noreply@cbone.me\r\n";
			$header .= "MIME-Version: 1.0\r\n";
			$header .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
			//Mail Message
			$message = "Your listing at ".$listing_address." has received the following request for documents:<br/><br/>\r\n";
			$message .= "Requested by: ".$form_state['values']['name']."<br/>\r\n";
			$message .= "Email: ".$form_state['values']['email']."<br/>\r\n";
			$message .= $agent_status.":<br/>\r\n";
			$message .= "Documents requested<br/><br/>\r\n";
			$message .= $documents_requested."<br/><br/>\r\n";
			$message .= "Links to the above documents have been sent to ".$form_state['values']['name'].". A report of all your listing's document downloads is available on CB|One.<br/><br/>\r\n";
			$message .= "Thank you<br/>\r\nThe CB|One team<br/><br/>\r\n";
			mail($agentto, $subject, $message, $header);

			drupal_set_message('An e-mail has been sent to '.$form_state['values']['email']);
			//drupal_goto('node/'.$node->nid);
		} else {
			drupal_set_message(t("Enable to send message try again"), 'error');
			//drupal_goto('node/'.$node->nid);
		}
	}
}
/**
 * Callback function listing_document_report()
 * to displayed the document download report
 **/
function listing_document_report($nid){
	$output = '';
	$listing_node = node_load($nid);
	//Listing Address
	if(isset($listing_node->field_lms_hide_listing_address['und']['0']['value']) && $listing_node->field_lms_hide_listing_address['und']['0']['value'] == 1) {		
		$listing_address = t('Address Available Upon Request');
	}
	else {
		$address = array();
		if(isset($listing_node->field_lms_listing_address['und']['0']['value'])) {
			$address[] = $listing_node->field_lms_listing_address['und']['0']['value'];
		}
		if(isset($listing_node->field_lms_address_unit['und']['0']['value'])) {
			$address[] = $listing_node->field_lms_address_unit['und']['0']['value'];
		}
		if(isset($listing_node->field_lms_listing_city['und']['0']['value'])) {
			$address[] = $listing_node->field_lms_listing_city['und']['0']['value'];
		}
		if(isset($listing_node->field_lms_listing_state['und']['0']['value'])) {
			$address[] = $listing_node->field_lms_listing_state['und']['0']['value'];
		}
		if(isset($listing_node->field_lms_listing_zip['und']['0']['value'])) {
			$address[] = $listing_node->field_lms_listing_zip['und']['0']['value'];
		}
		$listing_address = implode(', ', $address);
	}
	//Listing navigation
	$output = '<div class="manage-listing-back"><a href="/listing-document/'.$nid.'"><img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png"></a></div>
	<div class="manage-listing-photos">
		<div class="listing-photos-header">
			<div class="photos-title">Listing Documents</div>
			<div class="photos-address">'.$listing_address.' <a href="/manage-listing/'.$nid.'">[return to Listing Tools]</a> <a href="/my-listings">[return to Active Listings]</a></div>		
		</div>
	</div>';

	//Add search form
	$form = drupal_get_form('listing_document_report_form', $nid);
	$output .= drupal_render($form);
	$header = array(
		array('data' => t('File Name'), 'field' => 'filename', 'width'=>'15%'),
		array('data' => t('Requested by'), 'field' => 'name', 'width'=>'10%'),
		array('data' => t('Phone'), 'width'=>'10%'),
		array('data' => t('Email'), 'width'=>'15%'),
		array('data' => t('Agent / Consumer'), 'width'=>'10%'),
		array('data' => t('Agent Name'), 'field' => 'agent_name', 'width'=>'10%'),
		array('data' => t('Agent Broker'), 'field' => 'agent_broker', 'width'=>'10%'),
		array('data' => t('Request date'), 'field' => 'timestamp', 'width'=>'10%'),
		array('data' => t('Viewed'), 'field' => 'view_time', 'width'=>'10%'),
		array('data' => t('Downloaded'), 'field' => 'download_time', 'width'=>'10%'),
	);
	//Fetch the data from  document_request table
	$query = db_select("cbone_document_history", "dh");
	$query->fields("dh", array('uid', 'view_time', 'download_time'));
	$query->join('file_managed', 'fm', 'fm.fid = dh.fid');
	$query->fields("fm", array('filename'));
	$query->leftJoin('document_request', 'dr', 'dr.token = dh.token');
	$query->fields("dr");
	$query->condition("dh.lms_nid", $nid, '=');
	if(isset($_GET['fid']) && $_GET['fid'] != '' && $_GET['fid'] != 'all'){
		$query->condition("dh.fid", $_GET['fid'], '=');
	}
	$table_sort = $query->extend('TableSort')->orderByHeader($header);
	$pager = $table_sort->extend('PagerDefault')->limit(20);
	$result = $pager->execute();
	$rows = array();
	foreach ($result as $data) {
		if(empty($data->name)) {
			if($data->uid != 0){
				$user_detail = user_load($data->uid);
				$name = isset($user_detail->field_firstname['und']['0']['value']) ? $user_detail->field_firstname['und']['0']['value'].' ' : $user_detail->name;
				$name .= isset($user_detail->field_lastname['und']['0']['value']) ? $user_detail->field_lastname['und']['0']['value'] : '';
				$email = $user_detail->mail;
			}
			else {
				$name = 'Guest';
				$email = '--';
			}
		}
		else {
			$name = $data->name;
			$email = $data->email;
		}
		$agent_status = ($data->agent_status == 1) ? 'Agent' : 'Consumer';
		$viewed = ($data->view_time != NULL) ? date("m/d/Y h:i:s A", $data->view_time) : 'Not Viewed';
		$download = ($data->download_time != NULL) ? date("m/d/Y h:i:s A", $data->download_time) : 'Not Downloaded';
		$request_time = ($data->timestamp != NULL) ? date("m/d/Y h:i:s A", $data->timestamp) : '--';
		$rows[] = array(
			$data->filename,
			$name,
			$data->phone,
			$email,
			$agent_status,
			$data->agent_name,
			$data->agent_broker,
			$request_time,
			$viewed,
			$download,
		);
	}
	$output .= theme('table',
		array(
			'header' => $header,
			'rows'=> $rows,
			'attributes' => array('class' => array('listing-document-report'), 'border' => 1),
			'sticky' => TRUE,
			'empty' => 'No report found!',
			)
		);
	$output .= theme('pager', array('quantity' => 3));
	return $output;
}
/**
 * Drupal form API
 * to search by file name
 * @return $form
 */
function listing_document_report_form($form, &$form_state, $nid = NULL) {
	$lms_document_nid = db_select("field_data_field_lms_listing_reference", 'lr');
	$lms_document_nid->fields('lr', array('entity_id'));
	$lms_document_nid->condition('lr.entity_type', 'node', 'LIKE');
	$lms_document_nid->condition('lr.bundle', 'lms_listing_document', 'LIKE');
	$lms_document_nid->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$document_nid = $lms_document_nid->execute()->fetchField();
	$document_node = node_load($document_nid);
	$items = field_get_items('node', $document_node, 'field_lms_listing_documents');
	$options = array();
	$options['all'] = '- All -';
	if(!empty($items)) {
		foreach ($items as $delta => $item) {
			$listing_document = field_collection_field_get_entity($item);
			$options[$listing_document->field_lms_listing_document['und']['0']['fid']] = $listing_document->field_lms_listing_document['und']['0']['filename'];
		}
	}
	$fid = (isset($_GET['fid']) && $_GET['fid'] != '') ? $_GET['fid'] : 'all';
	$collapsed = (isset($_GET['fid']) && $_GET['fid'] != '') ? FALSE : TRUE;
	$form['listing_document_report'] = array(
		'#type' => 'fieldset',
		'#title' => t('Search By file name'),
		'#collapsible' => TRUE,
		'#collapsed' => $collapsed,
		'#tree' => TRUE,
	);
	$form['listing_document_report']['listing_nid'] = array(
		'#type' => 'hidden',
		'#value' => $nid,
	);
	$form['listing_document_report']['filename'] = array (
		'#title' => 'Select File Name',
		'#type' => 'select',
		'#options' => $options,
		'#default_value' => $fid,
		'#required' => TRUE,
	);
	$form['listing_document_report']['actions']['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Search'),
		'#required' => TRUE,
	);
	return $form;
}

/**
 * Drupal form API
 * submit Daily Quiz Question form
 */
function listing_document_report_form_submit($form, &$form_state) {
	$fid = $form_state['values']['listing_document_report']['filename'];
	$nid = $form_state['values']['listing_document_report']['listing_nid'];
	drupal_goto('/listing-document/report/'.$nid, array('query' => array('fid' => $fid)));
	//print "<pre>";print_r($form_state['values']);exit;
}
