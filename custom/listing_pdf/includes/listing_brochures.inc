<?php
/**
 * Callback function cbone_listing_brochures()
 * to displayed the listing Brochures
 * @return $output
 **/
function cbone_listing_brochures($nid){
	cbone_auto_generated_slide_image($nid);
	global $user;
	$output = '';
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
		
	$headline = isset($listing_node->field_lms_listing_headline['und']['0']['value']) ? 'Available.' : 'Missing, default headline will be used.';
	$online_copy = isset($listing_node->field_lms_online_copy['und']['0']['value']) ? 'Available.' : 'Missing.';
	//listing photos count
	$lms_photo_nid = db_select("field_data_field_lms_listing_reference", 'lr');
	$lms_photo_nid->fields('lr', array('entity_id'));
	$lms_photo_nid->condition('lr.entity_type', 'node', 'LIKE');
	$lms_photo_nid->condition('lr.bundle', 'lms_photos', 'LIKE');
	$lms_photo_nid->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$photo_nid = $lms_photo_nid->execute()->fetchField();
	$photo_node = node_load($photo_nid);
	$items = field_get_items('node', $photo_node, 'field_lms_listing_photos');	
	$photos = count($items);
	//Listing marketing coordinator
	$marketing_coordinator = isset($listing_node->field_lms_marketing_coordinator['und']['0']['uid']) ? 'Available.' : 'Missing.';
	//Query to get order id for the listing
	$order_id = '';
	$query=db_select('field_data_field_lms_listing_reference', 'lms')
		->fields('lms', array('entity_id'))
		->condition('field_lms_listing_reference_nid', $nid, '=')
		->condition('entity_type', 'commerce_order', '=')
		->condition('bundle', 'commerce_order', '=');
	$result= $query->execute()->fetchAll();
	if(!empty($result)){
		foreach($result as $value){
			$order_id = $value->entity_id;
		}
	}
	$order = commerce_order_load($order_id);
	$product_id = '';
	if(!empty($order)){
		$line_item_id = $order->commerce_line_items['und'][0]['line_item_id'];
		$line_item = commerce_line_item_load($line_item_id);
		$product_id = $line_item->commerce_product['und'][0]['product_id'];
	}
	//Approve PDF nid by agent
	$query = db_select('cbone_listing_approve_pdf', 'apdf');
	$query->fields('apdf', array('pnid'))
		->condition('apdf.pdf_section', 'pro-brochure', '=')
		->condition('apdf.lnid', $nid, '=');
	$approve_pdf = $query->execute()->fetchField();
	$approve_pdf_count = $query->execute()->rowCount();
	$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
		'listing_uid' => $listing_node->uid,
		'order_id' => $order_id,
		'product_id' => $product_id,
		'approve_pdf' => $approve_pdf,
		'approve_pdf_count' => $approve_pdf_count,
		'headline' => $headline,
		'online_copy' => $online_copy,
		'photos' => $photos,
		'marketing_coordinator' => $marketing_coordinator,
	);
	$output = theme('listing_brochures', array('var_name' => $variables));
	return $output;
}

/**
 * Callback function cbone_print_and_go()
 * to displayed the listing Brochures
 * @return $output
 **/

function cbone_print_and_go($nid){
	cbone_auto_generated_slide_image($nid);
	global $user;
	$output = '';
	$photos = array();
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
		
	//Query to get pdf brouchers, display document values
	$query=db_select('cbone_website_settings', 'cws')
		->fields('cws')
		->condition('nid', $nid, '=');
	$result= $query->execute()->fetchAll();
	if(!empty($result)){
		foreach($result as $value){
			$pdf_brochure = $value->print_and_go;
			$shared_pdf_brochure = $value->shared_lisitng;
			$active = $value->web_page_active;
		}
	}
	else{
		$pdf_brochure = 0;
		$shared_pdf_brochure = 0;
		$active = 0;
	}
		
	$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
		'listing_uid' => $listing_node->uid,
		'pdf_brochures'=>$pdf_brochure,
		'shared_pdf_brochures'=>$shared_pdf_brochure,
		'web_page_active' => $active,
	);
	
	$output = theme('print_and_go', array('var_name' => $variables));
	return $output;
}

/**
 * Callback function cbone_post_card()
 * to displayed the listing Brochures
 * @return $output
 **/
function cbone_post_card($nid){
	cbone_auto_generated_slide_image($nid);
	global $user;
	$output = '';
	$photos = array();
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
		
	$headline = isset($listing_node->field_lms_listing_headline['und']['0']['value']) ? 'Available.' : 'Missing, default headline will be used.';
	$online_copy = isset($listing_node->field_lms_online_copy['und']['0']['value']) ? 'Available.' : 'Missing.';
	//listing photos count
	$lms_photo_nid = db_select("field_data_field_lms_listing_reference", 'lr');
	$lms_photo_nid->fields('lr', array('entity_id'));
	$lms_photo_nid->condition('lr.entity_type', 'node', 'LIKE');
	$lms_photo_nid->condition('lr.bundle', 'lms_photos', 'LIKE');
	$lms_photo_nid->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$photo_nid = $lms_photo_nid->execute()->fetchField();
	$photo_node = node_load($photo_nid);
	$items = field_get_items('node', $photo_node, 'field_lms_listing_photos');	
	$photos = count($items);
	//Listing marketing coordinator
	$marketing_coordinator = isset($listing_node->field_lms_marketing_coordinator['und']['0']['uid']) ? 'Available.' : 'Missing.';

	//Query to get order id for the listing
	$order_id = '';
	$query=db_select('field_data_field_lms_listing_reference', 'lms')
		->fields('lms', array('entity_id'))
		->condition('field_lms_listing_reference_nid', $nid, '=')
		->condition('entity_type', 'commerce_order', '=')
		->condition('bundle', 'commerce_order', '=');
	$result= $query->execute()->fetchAll();
	if(!empty($result)){
		foreach($result as $value){

			$order_id = $value->entity_id;
		}
	}
	$order = commerce_order_load($order_id);
	$product_id = '';
	if(!empty($order)){
		$line_item_id = $order->commerce_line_items['und'][0]['line_item_id'];
		$line_item = commerce_line_item_load($line_item_id);
		$product_id = $line_item->commerce_product['und'][0]['product_id'];
	}
	//Approve PDF nid by agent
	$query = db_select('cbone_listing_approve_pdf', 'apdf');
	$query->fields('apdf')
		->condition('apdf.pdf_section', 'post-card', '=')
		->condition('apdf.lnid', $nid, '=');
	$approve_pdf_nids = $query->execute()->fetchAll();
	$approve_listed = 0;
	$approve_sold = 0;
	$approve_listed_pdf = 0;
	$approve_sold_pdf = 0;
	if(!empty($approve_pdf_nids)) {
		foreach($approve_pdf_nids as $approve_pdf_nid) {
			$approve_mcpdf = node_load($approve_pdf_nid->pnid);
			$re_use = isset($approve_mcpdf->field_reuse_count['und']['0']['value']) ? $approve_mcpdf->field_reuse_count['und']['0']['value'] : '0';
			if($approve_mcpdf->field_postcard_type['und']['0']['value'] == 'listed') {				
				$approve_listed = 1;
				$approve_listed_pdf = $approve_mcpdf->nid;
			}
			//updated by Nitesh at 22-09-16
			else if($approve_mcpdf->field_postcard_type['und']['0']['value'] == 'sold') {
				if($approve_pdf_nid->postcard_type == 'listed') {
					$approve_listed = 1;
					$approve_listed_pdf = $approve_mcpdf->nid;
				}
				else if($approve_pdf_nid->postcard_type == 'sold') {
					$approve_sold = 1;
					$approve_sold_pdf = $approve_mcpdf->nid;
				}
			}
		}
	}
	$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
		'listing_uid' => $listing_node->uid,
		'order_id' => $order_id,
		'product_id' => $product_id,
		'approve_listed' => $approve_listed,
		'approve_sold' => $approve_sold,
		'approve_listed_pdf' => $approve_listed_pdf,
		'approve_sold_pdf' => $approve_sold_pdf,
		'headline' => $headline,
		'online_copy' => $online_copy,
		'photos' => $photos,
		'marketing_coordinator' => $marketing_coordinator,
	);
	/*$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
	);*/
	$output = theme('post_card', array('var_name' => $variables));
	return $output;
}
/**
 * Callback function cbone_pdf_test_form()
 * to displayed the Testing Purpose
 * @return $output
 **/
function cbone_pdf_test_form($nid){
	cbone_auto_generated_slide_image($nid);
	global $user;
	$output = '';
	$photos = array();
	$x = 0;
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
	$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
	);
	$output = theme('pdf_form_test', array('var_name' => $variables));
	return $output;
}

/**
 * function template_details()
 * to displayed the details of templates
 * @return $node_load
 **/
 
function template_details($pdf_design){
	global $user;
	$voc_name = 'product_category';
	$vocab = taxonomy_vocabulary_machine_name_load($voc_name);
	$taxonomy = taxonomy_get_tree($vocab->vid);
	$main = array();
	foreach ($taxonomy as $term) {
		if($user->uid == 1 || in_array('Administrator', $user->roles)){
			$db_cond = db_or();		
			$db_cond->condition('pdf_status.field_template_status_value', 'pending', '=')
					->condition('pdf_status.field_template_status_value', 'dev', '=')
					->condition('pdf_status.field_template_status_value', 'prd', '=');
		}
		else{
			$db_cond = db_and();		
			$db_cond->condition('pdf_status.field_template_status_value', 'prd', '=');
		}
		
		$query = db_select('node', 'n');
		$query->leftJoin('field_data_field_product_group', 'pro_grp', 'n.nid = pro_grp.entity_id');
		$query->leftJoin('field_data_field_sort_number', 'sort_num', 'n.nid = sort_num.entity_id');
		$query->leftJoin('field_data_field_pdf_section', 'pdf_tem', 'n.nid = pdf_tem.entity_id');
		$query->leftJoin('field_data_field_template_status', 'pdf_status', 'n.nid = pdf_status.entity_id');
		$query->fields('n', array('nid'))
				->condition('n.type', 'pdf_design')
				->condition('pro_grp.field_product_group_tid', $term->tid, '=')
				->condition('pdf_tem.field_pdf_section_value', $pdf_design, '=')
				->condition($db_cond)
				->orderby('sort_num.field_sort_number_value', 'ASC')
				->orderby('n.title', 'ASC');
				
		$result = $query->execute()->fetchCol();
		$main[$term->tid] = $result;
	}
	if($user->uid == 1 || in_array('Administrator', $user->roles)){
		$db_conds = db_or();		
		$db_conds->condition('pdf_status.field_template_status_value', 'pending', '=')
				->condition('pdf_status.field_template_status_value', 'dev', '=')
				->condition('pdf_status.field_template_status_value', 'prd', '=');
	}
	else{
		$db_conds = db_and();		
		$db_conds->condition('pdf_status.field_template_status_value', 'prd', '=');
	}
	$querys = db_select('node', 'n');
	$querys->leftJoin('field_data_field_product_group', 'pro_grp', 'n.nid = pro_grp.entity_id');
	$querys->leftJoin('field_data_field_sort_number', 'sort_num', 'n.nid = sort_num.entity_id');
	$querys->leftJoin('field_data_field_pdf_section', 'pdf_tem', 'n.nid = pdf_tem.entity_id');
	$querys->leftJoin('field_data_field_template_status', 'pdf_status', 'n.nid = pdf_status.entity_id');

	$querys->fields('n', array('nid'))
			->condition('n.type', 'pdf_design')
			->condition('pro_grp.field_product_group_tid',  NULL, 'IS')
			->condition('pdf_tem.field_pdf_section_value', $pdf_design, '=')
			->condition($db_conds)
			->orderby('sort_num.field_sort_number_value', 'ASC')
			->orderby('n.title', 'ASC');
	$results = $querys->execute()->fetchCol();
	$main[0] = $results;
	return $main;
}

/**
 * function pdf_edit_nodes()
 * to displayed the nodes value
 * @return $output
 **/
 
function pdf_edit_nodes($nid, $pdf_design_id){
global $user;
	$photosresultarray=array();
	$result = get_mcpdf_nid();
	if($result !='') {
		$photosquery= db_select('cbone_selected_photos', 'cs')
			->fields('cs', array('selected_photos_fid'))
			->condition('mcpdf_id', $result, '=');
		$photosresult = $photosquery->execute()->fetchField();
		$photosresultarray = unserialize($photosresult); 
	}
	else{
		$query= db_delete('cbone_selected_photos')
			->condition('listing_id', $nid, '=')
			->condition('pdf_design_id', $pdf_design_id, '=');
		$result = $query->execute();
	}
	$pdf_design_node = node_load($pdf_design_id);
	if(!empty($pdf_design_node)) {
		if($pdf_design_node->field_pdf_section['und'][0]['value'] == 'pro brochure'){
			$pdf_section='listing-brochures';
			$designs='Pro Brochures';
		}
		else if($pdf_design_node->field_pdf_section['und'][0]['value'] == 'print and go'){
			$pdf_section='print-and-go';
			$designs='Print and Go';
		}
		else if($pdf_design_node->field_pdf_section['und'][0]['value'] == 'post card'){
			$pdf_section='postcard';
			$designs='Post Card';
		}
		else{
			$pdf_section='';
			$designs='';
		}
	}
	else{
		$pdf_section='';
		$designs='';
	}
	$output = '';
	$selected_photos = array();
	$photos = array();
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
	
	/*********************listing photos pdf Edit Form**********************************/
	$lms_photo_nid = db_select("field_data_field_lms_listing_reference", 'lr');
	$lms_photo_nid->fields('lr', array('entity_id'));
	$lms_photo_nid->condition('lr.entity_type', 'node', 'LIKE');
	$lms_photo_nid->condition('lr.bundle', 'lms_photos', 'LIKE');
	$lms_photo_nid->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$photo_nid = $lms_photo_nid->execute()->fetchField();
	$photo_node = node_load($photo_nid);

	$items = field_get_items('node', $photo_node, 'field_lms_listing_photos');
	$item_count = 0;
	if(!empty($items)) {
		$item_count = count($items);
		foreach ($items as $delta => $item) {
			$listing_photos = field_collection_field_get_entity($item);
			if (!empty($photosresultarray) && in_array($listing_photos->field_lms_listing_photo['und']['0']['fid'], $photosresultarray)) {
				$selected_photos[$delta]['fid'] = $listing_photos->field_lms_listing_photo['und']['0']['fid']; 
				$selected_photos[$delta]['item_id'] = $item['value'];     //$listing_photos->item_id;
				$selected_photos[$delta]['delta'] = $delta;
				$selected_photos[$delta]['revision_id'] = $item['revision_id'];   //$listing_photos->revision_id;
				
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
				$photos[$delta]['item_id'] = $item['value'];     //$listing_photos->item_id;
				$photos[$delta]['delta'] = $delta;
				$photos[$delta]['revision_id'] = $item['revision_id'];   //$listing_photos->revision_id;
				
				$image = array(
					'style_name' => 'my_listing_160x110',
					'path' => $listing_photos->field_lms_listing_photo['und']['0']['uri'],
					'title' => $listing_photos->field_lms_listing_photo['und']['0']['filename']
				);
				$photos[$delta]['photo'] = theme('image_style', $image);		
				$photos[$delta]['photo_url'] = file_create_url($listing_photos->field_lms_listing_photo['und']['0']['uri']);
				$photos[$delta]['photo_name'] = $listing_photos->field_lms_listing_photo['und']['0']['filename'];
			}
			$x++;
		}
	}
	$sorted_photos=array();
	if(!empty($photosresultarray) && !empty($selected_photos)){
		foreach($photosresultarray as $value){
			foreach($selected_photos as $key => $values){
				if($value == $values['fid']){
					$sorted_photos[$key] = $values;
				}
			}
		}
	}
	
	/*********************listing photos pdf Edit Form**********************************/
	//Query to get pdf brouchers, display document values
	$pdf_brochure = 0;
	$shared_pdf_brochure = 0;
	$active = 0;
	$query=db_select('cbone_website_settings', 'cws')
		->fields('cws')
		->condition('nid', $nid, '=');
	$result= $query->execute()->fetchAll();
	if(!empty($result)){
	
		foreach($result as $value){
			$pdf_brochure = $value->print_and_go;
			$shared_pdf_brochure = $value->shared_lisitng;
			$active = $value->web_page_active;
		}
	}
	
	//Query to get order id for the listing
	$order_id = '';
	$order_query=db_select('field_data_field_lms_listing_reference', 'lms')
		->fields('lms', array('entity_id'))
		->condition('field_lms_listing_reference_nid', $nid, '=')
		->condition('entity_type', 'commerce_order', '=')
		->condition('bundle', 'commerce_order', '=');
	$order_result= $order_query->execute()->fetchAll();
	if(!empty($order_result)){
		foreach($order_result as $value){
			$order_id = $value->entity_id;
		}
	}
	$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
		'listing_uid' => $listing_node->uid,
		'pdf_design_id'=>$pdf_design_id,
		'photo_nid' => $photo_nid,
		'photos' => $photos,
		'selected_photos' => $sorted_photos,
		'count' => $item_count,
		'pdf_section'=>$pdf_section,
		'designs'=>$designs,
		'pdf_brochures'=>$pdf_brochure,
		'shared_pdf_brochures'=>$shared_pdf_brochure,
		'web_page_active'=>$active,
		'order_id'=>$order_id,
	);
	$output = theme('listing_pdf', array('var_name' => $variables));
	return $output;
}

/**
 * function magnify_image()
 * to magnify the image using js
 **/
 
function magnify_image(){

	drupal_add_js("jQuery('.magnify').click(function(){
				var url = jQuery(this).attr('photo-url');			
				jQuery('.magnify-image').bPopup({
					content: 'image', //'ajax', 'iframe' or 'image'
					contentContainer: '.image_container',
					loadUrl: url,
					onOpen: function() {
						jQuery('.b-close').html('X');
						jQuery('.button').show();
						jQuery('.image-share-div').addClass('image');
					},
					onClose: function() {
						jQuery('.image_container').empty();
						jQuery('.b-close').empty();
						jQuery('.image-share-div').hide();
						jQuery('.button').hide();
						jQuery('.image-share-div').removeClass('image');
					}
				});
			});",'inline');

}

function listin_brochures_options($pdf_id) {
	global $user,$base_url;
	if(arg(1) !='') {
		$query=db_select('field_data_field_lms_listing_reference', 'lms_ref');
		$query->innerJoin('field_data_field_template_reference', 'tr', 'lms_ref.entity_id = tr.entity_id');
		$query->fields('lms_ref', array('entity_id'));
		$query->condition('lms_ref.field_lms_listing_reference_nid', arg(1), '=');
		$query->condition('lms_ref.entity_type', 'node', 'LIKE');
		$query->condition('lms_ref.bundle', 'mc_pdf', 'LIKE');
		$query->condition('tr.field_template_reference_nid', $pdf_id, '=');
		$query->condition('tr.entity_type', 'node', 'LIKE');
		$query->condition('tr.bundle', 'mc_pdf', 'LIKE');
		$results= $query->execute()->fetchField(); 
	}
	return $results;

}
/**
 * Callback function listing_marketing_system_form()
 * to displayed edit form
 * @return $form
 **/
 
function listing_marketing_system_form($form, &$form_state) {
	global $user,$base_url;
	$result = get_mcpdf_nid();
	$mcpdf_load = array();
	if($result !='') {
		$mcpdf_load = node_load($result);
	}
	$pdf_design_node = node_load(arg(2));
	$max_length = isset($pdf_design_node->field_max_text_chars['und'][0]['value']) ? $pdf_design_node->field_max_text_chars['und'][0]['value'] : 500;
	$include_sub_headline = isset($pdf_design_node->field_include_sub_headline['und'][0]['value']) ? $pdf_design_node->field_include_sub_headline['und'][0]['value'] : 0;
	if(arg(1) !='') {
		$listing_nid = arg(1);
		$listing_node_load = node_load($listing_nid);
		$listing_address = isset($listing_node_load->field_lms_listing_address['und'][0]['value']) ? $listing_node_load->field_lms_listing_address['und'][0]['value'].', ' : '';
		$listing_city = isset($listing_node_load->field_lms_listing_city['und'][0]['value']) ? $listing_node_load->field_lms_listing_city['und'][0]['value'] : '';
		$listing_price_format = isset($listing_node_load->field_lms_list_price['und'][0]['value']) ? $listing_node_load->field_lms_list_price['und'][0]['value'] : '';
		$listing_online_copy = '';
		if(!empty($mcpdf_load->field_pdf_text)){
			$listing_online_copy = isset($mcpdf_load->field_pdf_text['und'][0]['value']) ? $mcpdf_load->field_pdf_text['und'][0]['value'] : '';
		}		
		/*else{
			$description_values_field = isset($listing_node_load->field_lms_mls_description['und'][0]['value']) ? $listing_node_load->field_lms_mls_description['und'][0]['value'].', ' : '';
			$listing_online_copy = isset($listing_node_load->field_lms_online_copy['und'][0]['value']) ? $listing_node_load->field_lms_online_copy['und'][0]['value'] : $description_values_field;
		}*/
	}
	$mc_listing_address = isset($mcpdf_load->field_lms_listing_address['und'][0]['value']) ? $mcpdf_load->field_lms_listing_address['und'][0]['value'].', ' : $listing_address;
	$mc_listing_city = isset($mcpdf_load->field_lms_listing_city['und'][0]['value']) ? $mcpdf_load->field_lms_listing_city['und'][0]['value'] : $listing_city;
	$mc_list_price_format = isset($mcpdf_load->field_lms_list_price['und'][0]['value']) ? $mcpdf_load->field_lms_list_price['und'][0]['value'] : $listing_price_format;
	$mc_headline = isset($mcpdf_load->field_lms_listing_headline['und'][0]['value']) ? $mcpdf_load->field_lms_listing_headline['und'][0]['value'] : '';
	$mc_subheadline = isset($mcpdf_load->field_sub_headline['und'][0]['value']) ? $mcpdf_load->field_sub_headline['und'][0]['value'] : '';
	$mc_printcopy = isset($mcpdf_load->field_lms_print_copy['und'][0]['value']) ? $mcpdf_load->field_lms_print_copy['und'][0]['value'] : '';
	
	if(is_numeric($mc_list_price_format)){
		$price = '$'.number_format($mc_list_price_format);
	}
	else{
		$price = $mc_list_price_format;
	}
	/***********default value for the hidden field online_copy************/	
	$description_value_field = isset($listing_node_load->field_lms_mls_description['und'][0]['value']) ? $listing_node_load->field_lms_mls_description['und'][0]['value'].', ' : '';
	$online_copy_value_field = isset($listing_node_load->field_lms_online_copy['und'][0]['value']) ? $listing_node_load->field_lms_online_copy['und'][0]['value'] : $description_value_field;	
	$listing_headline = isset($listing_node_load->field_lms_listing_headline['und'][0]['value']) ? $listing_node_load->field_lms_listing_headline['und'][0]['value'] : '';
	/***********default value for the hidden field online_copy************/			
	$texts = array(
		'import_listing_copy' => t('IMPORT LISTING COPY'),
	  //$online_copy_value_field => t('IMPORT LISTING COPY'),
	  //$listing_bullets => t('Bullets'), 
	  //$listing_shortcopy => t('Short Copy')
	);
	if(isset($pdf_design_node->field_pdf_section['und'][0]['value']) && $pdf_design_node->field_pdf_section['und'][0]['value'] == 'post card'){
		$postcard_type = isset($mcpdf_load->field_postcard_type['und'][0]['value']) ? $mcpdf_load->field_postcard_type['und'][0]['value'] : '';
		$options = array('listed' => t('Just Listed'), 'sold' => t('Just Sold'));
		/*$form['postcard_type'] = array(
			'#type' => 'radios',
			'#title' => t('Postcard Type'),
			'#options' => $options,
			'#default_value' => $postcard_type,
			'#required' => TRUE,
		);*/
		/****** Added by Nitesh ****/
		$check_approval = get_pdf_approval_status(arg(1));
		if(empty($check_approval)){
			$disable_for_reuse = 'sold';
			$default_for_reuse = 'listed';
		}
		elseif($check_approval['approve'] == 'listed'){		
			$disable_for_reuse = 'listed';
			$default_for_reuse = 'sold';
		}else{
			$disable_for_reuse = 'sold';
			$default_for_reuse = 'listed';
		}

		$reuse = $_GET['reuse_as'];
		if($reuse == 'sold'){
			$selected_radio = 'sold'; 
			$disable_value = 'listed'; 
		}else {
			$selected_radio = 'listed';
			$disable_value = 'sold'; 
		}
		if(!isset($reuse)){
			$form['postcard_type'] = array(
				'#type' => 'radios',
				'#title' => t('Postcard Type'),
				'#options' => $options,
				'#default_value' => $default_for_reuse,
				'#required' => TRUE,
			);
			$form['postcard_type'][$disable_for_reuse] = array(
			'#disabled' => TRUE,
			);
		}else{
			if($result != '') {				
				$mcpdf_load->field_postcard_type['und'][0]['value'] = $reuse;
				$mcpdf_load->field_reuse_count['und']['0']['value'] = 1;
				$mcpdf_load->field_mc_pdf_view['und']['0']['value'] = 0;
				if(node_submit($mcpdf_load)){
					node_save($mcpdf_load);
				}
			}
			
			$form['postcard_type'] = array(
				'#type' => 'radios',
				'#title' => t('Postcard Type'),
				'#options' => $options,
				'#default_value' => $selected_radio,
				'#required' => TRUE,
			);
			$form['postcard_type'][$disable_value] = array(
			'#disabled' => TRUE,
			);
		}
		/////// ends here ////
	}
	$form['listing_address'] = array(
		'#type' => 'markup',
		'#markup' => $mc_listing_address.$mc_listing_city,
		'#prefix' => '<div class="mc_listingaddress">
						<span id = "add_label" >Address:</span>',
		'#suffix' => '</div>',
	);
	$form['listing_price'] = array(
		'#type' => 'markup',
		'#markup' => $price,
		'#prefix' => '<div class="mc_price"><span id = "price_label" >Price:</span>',
		'#suffix' => '</div>',
	);
	$form['marketing_headline'] = array(
		'#type' => 'textfield',
		'#title' => 'Headline',
		'#size' => 60,
		'#maxlength' => 255,
		'#required' => TRUE,
		'#default_value'	=> $mc_headline,
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
		'#maxlength_js_truncate_html' => TRUE,
		'#default_value'	=> $listing_online_copy,
		'#attributes' => array('original-text' => array($listing_online_copy)),
	);
		
	$form['online_copy'] = array(
		//'#type' => 'textarea',
		//'#default_value'	=> $online_copy_value_field,
		'#markup' => '<div class="listing-copy-value">'.$online_copy_value_field.'</div><div class="listing-headline-value">'.$listing_headline.'</div>',
	);	
	if($result !='') {
		$form['mc_node_id'] = array(
			'#type' => 'hidden',
			'#value' => $result,
		);
		$form['submit'] = array(
			'#type' => 'submit',
			'#value' => t('UPDATE TEXT'),
			'#prefix'=> '<div class = "step_submit">',
		);
		$form['markup'] = array(
			'#type' => 'markup',
			'#markup' => '<a href="#step_photos">GO TO STEP 3- PHOTOS</a>',
			'#prefix' => '<div class="step2">',
			'#suffix' => '</div></div>',
		);
	}
	if($result =='') {
		$form['mc_node_id'] = array(
			'#type' => 'hidden',
			'#value' => '',
		);
		$form['submit'] = array(
			'#type' => 'submit',
			'#value' => t('SAVE STEP-1 AND CONTINUE'),
			'#prefix'=> '<div class = "step_submit">',
			'#suffix' => '</div>',
		);
	}
	return $form;
}
/*
* validte form so that user can not create just sold pdf before just
* listed pdf
*/

function listing_marketing_system_form_validate($form, &$form_state) {
	if(isset($form_state['values']['postcard_type'])){
		$type = $form_state['values']['postcard_type'];
		$check_approval = get_pdf_approval_status(arg(1));
		if($check_approval['approve'] != 'listed' && $type == 'sold'){		
			// $form['postcard_type'] = array(
				// '#default_value' => 'listed',
			// );
			form_set_error('postcard_type', t('Kindly select postcard type as just listed.'));
		}
		elseif($check_approval['approve'] == 'listed' && $type == 'listed'){
			form_set_error('postcard_type', t('Just listed pdf is already approved.'));
		}
	}
} 


/**
 * submit handler function listing_marketing_system_form_submit()
 * to update exists node and create new node
 **/
 
function listing_marketing_system_form_submit($form, &$form_state) {
	global $user, $base_url;	
	$result = get_mcpdf_nid();
	if(file_exists('S3://PDF/'.$result.'.pdf')){
		$path = 'S3://PDF/'.$result.'.pdf';
		$fid = db_query("SELECT fid FROM {file_managed} WHERE uri = :path", array(':path' => $path))->fetchField();
		$file = file_load($fid);
		if(is_object($file)){
			file_delete($file);
		}
	}
	
	//$user_load = user_load($uid);
	$result_val = get_mcpdf_nid();
	$order_id = 0;
	$listing_node_load = array();
	if(arg(1) !='') {
		$listing_nid = arg(1);
		$listing_node_load = node_load($listing_nid);
		$listing_address = isset($listing_node_load->field_lms_listing_address['und'][0]['value']) ? $listing_node_load->field_lms_listing_address['und'][0]['value'].'' : '';
		$listing_city = isset($listing_node_load->field_lms_listing_city['und'][0]['value']) ? $listing_node_load->field_lms_listing_city['und'][0]['value'] : '';
		$listing_price = isset($listing_node_load->field_lms_list_price['und'][0]['value']) ? $listing_node_load->field_lms_list_price['und'][0]['value'] : '';
		//Query to get order id for the listing
		$query = db_select('field_data_field_lms_listing_reference', 'lms')
			->fields('lms', array('entity_id'))
			->condition('field_lms_listing_reference_nid', $listing_nid, '=')
			->condition('entity_type', 'commerce_order', '=')
			->condition('bundle', 'commerce_order', '=');
		$result = $query->execute()->fetchField();
		if(!empty($result)){
			$order_id = $result;
		}
	}
	if( isset($listing_node_load->field_lms_sales_team['und'])){
		$listing_sales_nid= $listing_node_load->field_lms_sales_team['und'][0]['nid'];
		$sales_team = node_load($listing_sales_nid);		
		$profile_image = isset($sales_team->field_sales_team_photo['und']['0']['fid']) ? $sales_team->field_sales_team_photo['und']['0']['fid'] : '';
		$co_listing_agent_photo='';
	}
	else{
		$listing_user= user_load($listing_node_load->uid);
		$profile_image = isset($listing_user->picture->fid) ? $listing_user->picture->fid : '';
		$listing_colisting_uid=  isset($listing_node_load->field_lms_other_agent['und']['0']['uid']) ? $listing_node_load->field_lms_other_agent['und']['0']['uid'] : '';
		$co_listing_user= user_load($listing_colisting_uid);
		$co_listing_agent_photo = isset($co_listing_user->picture->fid) ? $co_listing_user->picture->fid : '';
	}		
	$headline 		=	$form_state['values']['marketing_headline'];
	$subheadline	=	$form_state['values']['marketing_sub_headline'];
	$postcard_type	=	isset($form_state['values']['postcard_type']) ? $form_state['values']['postcard_type'] : '';
	$details		=	$form_state['values']['details'];
	$mc_node_id		=	$form_state['values']['mc_node_id'];
	//$radio_value=	$form_state['values']['text_options'];
	
	if($result_val == '') {
		$node = new stdClass();
		$node->type = 'mc_pdf';
		$node->title = 'Brochure '.arg(2).' for '.$listing_address.$listing_city;
		node_object_prepare($node);
		$node->language = 'und';
		$uid = $user->uid;
		$node->uid = $uid;
		$node->field_lms_listing_reference['und'][0]['nid'] = arg(1);
		$node->field_template_reference['und'][0]['nid'] = arg(2);
		$node->field_lms_listing_headline['und'][0]['value'] = $headline;
		$node->field_sub_headline['und'][0]['value'] = $subheadline;
		$node->field_postcard_type['und'][0]['value'] = $postcard_type;		
		
		$node->field_pdf_text['und'][0]['value']	=  $details['value'];
		$node->field_lms_listing_address['und'][0]['value'] = $listing_address;
		$node->field_lms_listing_city['und'][0]['value'] = $listing_city;
		$node->field_lms_list_price['und'][0]['value'] = $listing_price;
		$node_update->field_mc_order_id['und'][0]['target_id'] = $order_id;
		node_save($node);
		$mcpdf_nid=$node->nid;
		mcpdf_agent_image($listing_nid, $mcpdf_nid);
		drupal_set_message(t("Created successfully."), 'status');
		save_generated_pdf(arg(1), arg(2));		
	}
	if($result_val != '') {		
		cbone_delete_mcpdf_agent_images($mc_node_id);
		cbone_delete_mcpdf_images($mc_node_id);
		$node_update= 	node_load($mc_node_id);
		$node_update->title = 'Brochure '.arg(2).' for '.$listing_address.$listing_city;
		$node_update->field_lms_listing_headline['und']['0']['value'] = $headline;
		$node_update->field_sub_headline['und']['0']['value'] = $subheadline;
		$node_update->field_postcard_type['und'][0]['value'] = $postcard_type;
		$node_update->field_pdf_text['und'][0]['value']	=  $details['value'];
		$node_update->field_lms_listing_address['und'][0]['value'] = $listing_address;
		$node_update->field_lms_listing_city['und'][0]['value'] = $listing_city;
		$node_update->field_lms_list_price['und'][0]['value'] = $listing_price;
		$node_update->field_mc_order_id['und'][0]['target_id'] = $order_id;
		
		$photosquery = db_select('cbone_selected_photos', 'cs')
			->fields('cs', array('selected_photos_fid'))
			->condition('listing_id', arg(1), '=')
			->condition('pdf_design_id', arg(2), '=')
			->condition('mcpdf_id', $mc_node_id);
		$photosresult = $photosquery->execute()->fetchField();
		$photosresultarray = unserialize($photosresult);
		$node_update = 	node_load($mc_node_id);
		if(!empty($photosresultarray)){
			mcpdf_image(arg(1), $mc_node_id, $photosresultarray);
		}
		if(node_submit($node_update)){
			node_save($node_update);
			mcpdf_agent_image($listing_nid, $mc_node_id);
			/*Updated by Harinder Singh Maan for change updated pdf message according share condition on 05-10-2016*/
			//Query to get pdf brouchers, display document values
			$custom_current_pdf_nid = arg(1);
			$query=db_select('cbone_website_settings', 'cws')
				->fields('cws')
				->condition('nid', $custom_current_pdf_nid, '=');
				$result= $query->execute()->fetchAll();
			if(!empty($result)){
				foreach($result as $value){
					$shared_pdf_brochure = $value->shared_lisitng;
				}
			}

			if(isset($node_update->field_shared_listing_pdf['und'][0]) && $shared_pdf_brochure == arg(2)){
				drupal_set_message(t('Updated successfully.<br/>Reminder: This brochure is the basis for those used by agents you`ve shared this listing with. Remember to re-generate the shared flyer(s) to reflect any changes you`re making. You can do so by choosing the "share" item from this listing`s tool grid.'), 'status');
			}else{
				drupal_set_message(t('Updated successfully.'), 'status');
			}
			/*Updated code ended of 05-10-2016*/
		}
		save_generated_pdf(arg(1), arg(2));
		cbone_delete_mcpdf_agent_images($mc_node_id);
		cbone_delete_mcpdf_images($mc_node_id);
	}	
	
	
	//pdf_image_generation();
	//return '';
}

/**
 * function text_options()
 * to displayed radios button
 **/
 
/*function text_options(){

	global $user,$base_url;
	$result = get_mcpdf_nid();
	if($result !='') {
		$mcpdf_load = node_load($result);
	}
	
	$mc_printcopy	= isset($mcpdf_load->field_lms_print_copy['und'][0]['value']) ? $mcpdf_load->field_lms_print_copy['und'][0]['value'] : '';
	$mc_bullets		= isset($mcpdf_load->field_lms_bullets['und'][0]['value']) ? $mcpdf_load->field_lms_bullets['und'][0]['value'] : '';
	$mc_shortcopy	= isset($mcpdf_load->field_lms_short_copy['und'][0]['value']) ? $mcpdf_load->field_lms_short_copy['und'][0]['value'] : '';
	//$("textarea#ExampleMessage").val(result.exampleMessage);
	drupal_add_js("jQuery(document).ready(function () {
		var checkboxes = jQuery('#edit-text-options input[type=checkbox]');
			//alert(checkboxes);
			checkboxes.on('change', function() {
				jQuery('#edit-details-value').val(
					checkboxes.filter(':checked').map(function(item) {
						var online_copy_value = jQuery('textarea#edit-online-copy').val();
						CKEDITOR.instances['edit-details-value'].setData(online_copy_value);
					}).get().join( '' )
				 );
			});
	});", "inline");
}*/

/**
 * Callback function after_complete_pdf_form()
 * to save changes and redirect
 * to brochure overview screen
 **/

/* function after_complete_pdf_form($form, &$form_state) {
	global $user, $base_url;
	listing_marketing_system_form_submit($form, &$form_state);
	if(arg(1) != '') {
		drupal_goto($base_url.'/listing-brochures/'.arg(1));
	}
 }
 */
function download_pdf_ids() {
 $nid1 = 1;
 $nid2 = 2;
 
 $full_name = 'test/'.$nid1.'/'.$nid2.'.pdf'; 
 return $full_name;
}

/**
 * Callback function listing_video_download()
 * to download the video file
 **/
function download_pdf() {
	$result = get_mcpdf_nid();
	$node_load = node_load($result);
	
	$path = $node_load->field_generated_pdf['und'][0]['uri'];
	$file_name = $node_load->field_generated_pdf['und'][0]['filename'];
	$url = file_create_url($path);
	//$url = "https://sandbox.escalet.com/sites/default/files/PDF/downloaded_pdf_8730.pdf";
	
	//$url = "https://sandbox.escalet.com/sites/default/files/lms/agent-7/conciergeservicespec-rev1.pdf";
	header('Content-disposition: attachment; filename="'.$file_name.'"');
	header("Content-Type: application/octet-stream");
	readfile($url);
	//print readfile($url);
}

function pdf_edit_form_images() {
$query=db_select('field_data_field_lms_listing_reference', 'lms_ref');
$query->leftJoin('field_data_field_lms_listing_photos', 'lms_photo', 'lms_ref.entity_id = lms_photo.entity_id');
$query->leftJoin('file_managed', 'fm', 'lms_photo.field_lms_listing_photos_value = fm.fid');
$query->fields('lms_ref', array('entity_id'));
		$query->fields('lms_photo', array('field_lms_listing_photos_value'));
		$query->fields('fm', array('fid'));
		$query->fields('fm', array('uri'));
		$query->condition('lms_ref.field_lms_listing_reference_nid', arg(1), '=');
		$query->condition('lms_ref.entity_type', 'node', 'LIKE');
		$query->condition('lms_ref.bundle', 'lms_photos', 'LIKE');
		$results= $query->execute()->fetchAll(); 
		
		foreach($results as $value){
		$output='';
		$config = array(
			"style_name" => "thumbnail",
			"path" => $value->uri,
			"height" => NULL,
			"width" => NULL,
		);
		
			if($value->fid!=''){
		$output.='<div class="pdf_edit_form_img">';
		$output.= theme_image_style($config);
		$output.='</div>';
	
		print $output;
			}
		}
}
/**
 * Callback function online_marketing_form()
 * to displayed listing-brochures node
 * @return $form
 **/
 
function online_marketing_form() {	
	$query=db_select('field_data_field_lms_listing_reference', 'lms_ref');
	$query->innerJoin('field_data_field_template_reference', 'tr', 'lms_ref.entity_id = tr.entity_id');
	$query->innerJoin('field_data_field_pdf_section', 'pdf_s', 'pdf_s.entity_id = tr.field_template_reference_nid');
	$query->fields('lms_ref', array('entity_id'));
	$query->condition('lms_ref.field_lms_listing_reference_nid', arg(1), '=');
	$query->condition('lms_ref.entity_type', 'node', 'LIKE');
	$query->condition('lms_ref.bundle', 'mc_pdf', 'LIKE');
	$query->condition('tr.entity_type', 'node', 'LIKE');
	$query->condition('tr.bundle', 'mc_pdf', 'LIKE');
	$query->condition('pdf_s.field_pdf_section_value', 'print and go', 'LIKE');
	$results= $query->execute()->fetchAll(); 
	
	return $results;
}
/**
 * Callback function online_marketing_form_submit()
 * to displayed listing-brochures node
 * @return $form
 **/
 
function online_marketing_form_submit($form, &$form_state) {
db_insert('cbone_website_settings')
    ->fields(array(
	'print_and_go' => $form_state['values']['print_and_go']
	))
    ->condition('nid', arg(1))
    ->execute();
	drupal_set_message("Successfully Updated The Student Details");
}


