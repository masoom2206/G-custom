<?php
/**
 * Callback function cbone_listing_brochures_approval()
 * to displayed the pdf list for approval
 **/
function cbone_listing_brochures_approval($nid){
	global $user;
	//Select order_id of listing.
	$query = db_select('field_data_field_lms_listing_reference', 'lms')
		->fields('lms', array('entity_id'))
		->condition('field_lms_listing_reference_nid', $nid, '=')
		->condition('entity_type', 'commerce_order', '=')
		->condition('bundle', 'commerce_order', '=');
	$order_id = $query->execute()->fetchField();
	//Select All node of mc_pdf
	/*$query = db_select('field_data_field_lms_listing_reference', 'lms')
		->fields('lms', array('entity_id'))
		->condition('field_lms_listing_reference_nid', $nid, '=')
		->condition('entity_type', 'node', 'LIKE')
		->condition('bundle', 'mc_pdf', 'LIKE');
	$result = $query->execute();*/
	$query = db_select('field_data_field_lms_listing_reference', 'lms');
	$query->join('field_data_field_template_reference', 'tr', 'lms.entity_id = tr.entity_id');
	$query->join('field_data_field_pdf_section', 'ps', 'ps.entity_id = tr.field_template_reference_nid');
	$query->fields('lms', array('entity_id'))
		->condition('lms.field_lms_listing_reference_nid', $nid, '=')
		->condition('lms.entity_type', 'node', 'LIKE')
		->condition('lms.bundle', 'mc_pdf', 'LIKE')
		->condition('ps.field_pdf_section_value', 'pro brochure', 'LIKE');
	$result = $query->execute();
	$nids = array();
	foreach($result as $value){
		$nids[] = $value->entity_id;
	}
	//Listing Address
	$listing_node = node_load($nid);
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
		
	$variables = array(
		'listing_nid' => $nid,
		'listing_address' => $listing_address,
		'nids' => $nids,
		'order_id' => $order_id,
	);
	$output = theme('listing_brochures_approval', array('var_name' => $variables));
	return $output;
}
/**
 * Callback function pdf_edit_proof_nodes()
 * to edit the mcpdf node by agent.
 **/
function pdf_edit_proof_nodes($listing_nid, $mcpdf_nid) {
	$photosresultarray = array();
	$photosquery = db_select('cbone_selected_photos', 'cs')
		->fields('cs', array('selected_photos_fid'))
		->condition('mcpdf_id', $mcpdf_nid, '=');
	$photosresult = $photosquery->execute()->fetchField();
	$photosresultarray = unserialize($photosresult);
	//Listing Photo NID
	$lms_photo_nid = db_select("field_data_field_lms_listing_reference", 'lr');
	$lms_photo_nid->fields('lr', array('entity_id'));
	$lms_photo_nid->condition('lr.entity_type', 'node', 'LIKE');
	$lms_photo_nid->condition('lr.bundle', 'lms_photos', 'LIKE');
	$lms_photo_nid->condition('lr.field_lms_listing_reference_nid', $listing_nid, '=');
	$photo_nid = $lms_photo_nid->execute()->fetchField();
	$photo_node = node_load($photo_nid);
	//Field collection of photo node
	$items = field_get_items('node', $photo_node, 'field_lms_listing_photos');
	$item_count = 0;
	if(!empty($items)) {
		$item_count = count($items);
		foreach ($items as $delta => $item) {
			$listing_photos = field_collection_field_get_entity($item);
			if (!empty($photosresultarray) && in_array($listing_photos->field_lms_listing_photo['und']['0']['fid'], $photosresultarray)) {
				$selected_photos[$delta]['fid'] = $listing_photos->field_lms_listing_photo['und']['0']['fid']; 
				$selected_photos[$delta]['item_id'] = $item['value'];
				$selected_photos[$delta]['delta'] = $delta;
				$selected_photos[$delta]['revision_id'] = $item['revision_id'];

				$image = array(
					'style_name' => 'my_listing_160x110',
					'path' => $listing_photos->field_lms_listing_photo['und']['0']['uri'],
					'title' => $listing_photos->field_lms_listing_photo['und']['0']['filename']
				);
				$selected_photos[$delta]['photo'] = theme('image_style', $image);		
				$selected_photos[$delta]['photo_url'] = file_create_url($listing_photos->field_lms_listing_photo['und']['0']['uri']);
				$selected_photos[$delta]['photo_name'] = $listing_photos->field_lms_listing_photo['und']['0']['filename'];
			}
			else{
				$photos[$delta]['fid'] = $listing_photos->field_lms_listing_photo['und']['0']['fid']; 
				$photos[$delta]['item_id'] = $item['value'];
				$photos[$delta]['delta'] = $delta;
				$photos[$delta]['revision_id'] = $item['revision_id'];

				$image = array(
					'style_name' => 'my_listing_160x110',
					'path' => $listing_photos->field_lms_listing_photo['und']['0']['uri'],
					'title' => $listing_photos->field_lms_listing_photo['und']['0']['filename']
				);
				$photos[$delta]['photo'] = theme('image_style', $image);		
				$photos[$delta]['photo_url'] = file_create_url($listing_photos->field_lms_listing_photo['und']['0']['uri']);
				$photos[$delta]['photo_name'] = $listing_photos->field_lms_listing_photo['und']['0']['filename'];
			}
		}
	}
	$sorted_photos = array();
	if(!empty($photosresultarray) && !empty($selected_photos)){
		foreach($photosresultarray as $value){
			foreach($selected_photos as $key => $values){
				if($value == $values['fid']){
					$sorted_photos[$key] = $values;
				}
			}
		}
	}
	//Fetch design nid
	$pdf_design_id = db_select('cbone_selected_photos', 'cs')
		->fields('cs', array('pdf_design_id'))
		->condition('listing_id', $listing_nid, '=')
		->condition('mcpdf_id', $mcpdf_nid, '=');
	$design_nid = $pdf_design_id->execute()->fetchField();
	//print "<pre>";print_r($sorted_photos);exit;
	$variables = array(
		'listing_nid' => $listing_nid,
		'mcpdf_nid' => $mcpdf_nid,
		'design_nid' => $design_nid,
		'photos' => $photos,
		'selected_photos' => $sorted_photos,
	);
	$output = theme('pdf_edit_proof', array('var_name' => $variables));
	return $output;
}

/**
 * FORM API
 * Function pdf_edit_proof_form()
 * @return $form
 **/ 
function pdf_edit_proof_form($form, &$form_state) {
	$mcpdf_nid = arg(2);
	$mcpdf_load = node_load($mcpdf_nid);
	$listing_nid = arg(1);
	$listing_node_load = node_load($listing_nid);
	//pdf design detail
	$pdf_design_node = node_load($mcpdf_load->field_template_reference['und'][0]['nid']);
	$max_length = isset($pdf_design_node->field_max_text_chars['und'][0]['value']) ? $pdf_design_node->field_max_text_chars['und'][0]['value'] : 500;
	$include_sub_headline = isset($pdf_design_node->field_include_sub_headline['und'][0]['value']) ? $pdf_design_node->field_include_sub_headline['und'][0]['value'] : 0;
	//listing node detail
	$listing_address = isset($listing_node_load->field_lms_listing_address['und'][0]['value']) ? $listing_node_load->field_lms_listing_address['und'][0]['value'].', ' : '';
	$listing_city = isset($listing_node_load->field_lms_listing_city['und'][0]['value']) ? $listing_node_load->field_lms_listing_city['und'][0]['value'] : '';
	$listing_price = isset($listing_node_load->field_lms_list_price['und'][0]['value']) ? '$'.number_format($listing_node_load->field_lms_list_price['und'][0]['value']) : '';
	if(!empty($mcpdf_load->field_pdf_text)){
		$listing_online_copy = isset($mcpdf_load->field_pdf_text['und'][0]['value']) ? $mcpdf_load->field_pdf_text['und'][0]['value'] : 'NULL';
	}
	/*else{
		$listing_online_copy = isset($listing_node_load->field_lms_online_copy['und'][0]['value']) ? $listing_node_load->field_lms_online_copy['und'][0]['value'] : 'NULL';
	}*/
	$mc_listing_address = isset($mcpdf_load->field_lms_listing_address['und'][0]['value']) ? $mcpdf_load->field_lms_listing_address['und'][0]['value'].', ' : $listing_address;
	$mc_listing_city = isset($mcpdf_load->field_lms_listing_city['und'][0]['value']) ? $mcpdf_load->field_lms_listing_city['und'][0]['value'] : $listing_city;
	$mc_list_price = (isset($mcpdf_load->field_lms_list_price['und'][0]['value']) && $mcpdf_load->field_lms_list_price['und'][0]['value'] != '') ? '$'.number_format($mcpdf_load->field_lms_list_price['und'][0]['value']) : $listing_price;
	$mc_headline = isset($mcpdf_load->field_lms_listing_headline['und'][0]['value']) ? $mcpdf_load->field_lms_listing_headline['und'][0]['value'] : '';
	$mc_subheadline = isset($mcpdf_load->field_sub_headline['und'][0]['value']) ? $mcpdf_load->field_sub_headline['und'][0]['value'] : '';
	$mc_printcopy = isset($mcpdf_load->field_lms_print_copy['und'][0]['value']) ? $mcpdf_load->field_lms_print_copy['und'][0]['value'] : '';
	
	
	/***********default value for the hidden field online_copy************/
	$description_value_field = isset($listing_node_load->field_lms_mls_description['und'][0]['value']) ? $listing_node_load->field_lms_mls_description['und'][0]['value'].', ' : '';
	$online_copy_value_field = isset($listing_node_load->field_lms_online_copy['und'][0]['value']) ? $listing_node_load->field_lms_online_copy['und'][0]['value'] : $description_value_field;
	$listing_headline = isset($listing_node_load->field_lms_listing_headline['und'][0]['value']) ? $listing_node_load->field_lms_listing_headline['und'][0]['value'] : '';
	/***********default value for the hidden field online_copy************/			
	$texts = array(
		'import_listing_copy' => t('IMPORT LISTING COPY'),
	);

	$form['listing_address'] = array(
		'#type' => 'markup',
		'#markup' => $mc_listing_address.$mc_listing_city,
		'#prefix' => '<div class="mc_listingaddress"><span id = "add_label" >Address:</span>',
		'#suffix' => '</div>',
	);
	$form['listing_price'] = array(
		'#type' => 'markup',
		'#markup' => $mc_list_price,
		'#prefix' => '<div class="mc_price"><span id = "price_label" >Price:</span>',
		'#suffix' => '</div>',
	);
	$form['marketing_headline'] = array(
		'#type' => 'textfield',
		'#title' => 'Headline',
		'#size' => 60,
		'#maxlength' => 255,
		'#required' => TRUE,
		'#default_value' => $mc_headline,
		'#attributes' => array('original-text' => array($mc_headline)),
	);
	if($include_sub_headline == 1){
		$form['marketing_sub_headline'] = array(
			'#type' => 'textfield',
			'#title' => 'Subheadline',
			'#size' => 60,
			'#maxlength' => 255,
			//'#required' => TRUE,
			'#default_value'	=> $mc_subheadline,
		);
	}
	else{
		$form['marketing_sub_headline'] = array(
			'#type' => 'hidden',
			'#title' => 'Subheadline',
		);
	}
	$form['text_options'] = array(
		'#type' => 'checkboxes',
		'#options' => $texts,
		'#required' => FALSE
	);
	
	$form['details'] = array(
		'#type' => 'text_format',
		'#title' => '',
		//'#size' => 60,
		'#format' => 'standard_format',
		'#maxlength' => $max_length,
		'#maxlength_js' => TRUE,
		'#default_value'	=> $listing_online_copy,
		'#attributes' => array('original-text' => array($listing_online_copy)),
	);
		
	$form['online_copy'] = array(
		//'#type' => 'textarea',
		//'#default_value'	=> $online_copy_value_field,
		'#markup' => '<div class="listing-copy-value">'.$online_copy_value_field.'</div><div class="listing-headline-value">'.$listing_headline.'</div>',
	);	
	$form['mc_node_id'] = array(
		'#type' => 'hidden',
		'#value' => $mcpdf_nid,
	);
	$form['listing_nid'] = array(
		'#type' => 'hidden',
		'#value' => $listing_nid,
	);
	$form['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Save Changes'),
		//'#prefix'=> '<div class = "step_submit">',
		//'#suffix' => '</div>',
	);
	return $form;
}
/**
 * FORM API
 * Submit handler
 **/ 
function pdf_edit_proof_form_submit($form, &$form_state) {
	module_load_include('inc', 'listing_pdf', 'includes/listing_brochures');
	$values = $form_state['values'];
	//print "<pre>";print_r($values);exit;
	//delete the pdf file
	$mc_node_id = $values['mc_node_id'];
	$listing_nid = $values['listing_nid'];
	if(file_exists('S3://PDF/'.$mc_node_id.'.pdf')){
		$path = 'S3://PDF/'.$mc_node_id.'.pdf';
		$fid = db_query("SELECT fid FROM {file_managed} WHERE uri = :path", array(':path' => $path))->fetchField();
		$file = file_load($fid);
		file_delete($file);
	}
	$node_update = 	node_load($mc_node_id);
	$node_update->field_lms_listing_headline['und']['0']['value'] = $values['marketing_headline'];
	//$node_update->field_sub_headline['und']['0']['value'] = $subheadline;
	$node_update->field_pdf_text['und'][0]['value']	=  $values['details']['value'];
	node_save($node_update);
	$photosquery = db_select('cbone_selected_photos', 'cs')
		->fields('cs', array('selected_photos_fid'))
		->condition('listing_id', $listing_nid, '=')
		->condition('mcpdf_id', $mc_node_id, '=');
	$photosresult = $photosquery->execute()->fetchField();
	$photosresultarray = unserialize($photosresult); 
	if(!empty($photosresultarray)){
		$node_update = 	node_load($mc_node_id);
		foreach ($photosresultarray as $delta => $value) {
			$fids[] = $value;
			$lms_file = file_load($value);
			$filepath = $lms_file->uri;
			$content = file_get_contents($filepath);

			$temp_folder = 'public://lms/mc_pdf/images/';
			file_prepare_directory($temp_folder, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);
			$filename = $temp_folder.$lms_file->filename;
			$realpath = drupal_realpath($filename);
			$fp = fopen($realpath, "w");
			fwrite($fp, $content);
			fclose($fp);

			$file = (object)array(
				'uid' => $node_update->uid,
				'filename' => $lms_file->filename,
				'uri' => $filename,
				'filemime' => file_get_mimetype($filename),
				'status' => 1,
				'display' => 1,
			);
			if ($file = file_move($file, $filename, $replace = FILE_EXISTS_RENAME)) {
				$node_update->field_pdf_photos['und'][$delta] = (array)$file;
				//$listing_video->save( TRUE );
			}
		}
		node_save($node_update);
		$mc_pdf_folder = 'public://lms/mc_pdf/';
		$real_path_temp_folder = drupal_realpath($mc_pdf_folder);
		$cmd = "rm $real_path_temp_folder 2>&1";
		exec($cmd, $op);	
	}
	mcpdf_agent_image($listing_nid, $mc_node_id);
	if(node_submit($node_update)){
		node_save($node_update);
		mcpdf_agent_image($listing_nid, $mc_node_id);
		drupal_set_message(t("Updated successfully."), 'status');
	}
	$pdf_design_id = db_select('cbone_selected_photos', 'cs')
		->fields('cs', array('pdf_design_id'))
		->condition('listing_id', $listing_nid, '=')
		->condition('mcpdf_id', $mc_node_id, '=');
	$design_id = $pdf_design_id->execute()->fetchField();
	save_generated_pdf($listing_nid, $design_id);
	cbone_delete_mcpdf_agent_images($mc_node_id);
	cbone_delete_mcpdf_images($mc_node_id);
	//redirect the user;
	$form_state['redirect'] = '/pro-brochures-approval/'.$listing_nid;
}