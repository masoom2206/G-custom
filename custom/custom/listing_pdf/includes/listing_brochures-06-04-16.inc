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
	$photos = array();
	$x = 0;
	$listing_node = node_load($nid);
	$address = isset($listing_node->field_lms_listing_address['und']['0']['value']) ? $listing_node->field_lms_listing_address['und']['0']['value'] .', ': '';
	$city = isset($listing_node->field_lms_listing_city['und']['0']['value']) ? $listing_node->field_lms_listing_city['und']['0']['value'] .', ': '';
	$state = isset($listing_node->field_lms_listing_state['und']['0']['value']) ? $listing_node->field_lms_listing_state['und']['0']['value'] .', ': '';
	$zip = isset($listing_node->field_lms_listing_zip['und']['0']['value']) ? $listing_node->field_lms_listing_zip['und']['0']['value'] .', ': '';
	$listing_address = $address.$city.$state.$zip;
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
	$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
		'order_id' => $order_id,
		'product_id' => $product_id,
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
	$address = isset($listing_node->field_lms_listing_address['und']['0']['value']) ? $listing_node->field_lms_listing_address['und']['0']['value'] .', ': '';
	$city = isset($listing_node->field_lms_listing_city['und']['0']['value']) ? $listing_node->field_lms_listing_city['und']['0']['value'] .', ': '';
	$state = isset($listing_node->field_lms_listing_state['und']['0']['value']) ? $listing_node->field_lms_listing_state['und']['0']['value'] .', ': '';
	$zip = isset($listing_node->field_lms_listing_zip['und']['0']['value']) ? $listing_node->field_lms_listing_zip['und']['0']['value'] .', ': '';
	$listing_address = $address.$city.$state.$zip;
	
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
	$address = isset($listing_node->field_lms_listing_address['und']['0']['value']) ? $listing_node->field_lms_listing_address['und']['0']['value'] .', ': '';
	$city = isset($listing_node->field_lms_listing_city['und']['0']['value']) ? $listing_node->field_lms_listing_city['und']['0']['value'] .', ': '';
	$state = isset($listing_node->field_lms_listing_state['und']['0']['value']) ? $listing_node->field_lms_listing_state['und']['0']['value'] .', ': '';
	$zip = isset($listing_node->field_lms_listing_zip['und']['0']['value']) ? $listing_node->field_lms_listing_zip['und']['0']['value'] .', ': '';
	$listing_address = $address.$city.$state.$zip;
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
	$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
		'order_id' => $order_id,
		'product_id' => $product_id,
	);
	$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
	);
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
	$address = isset($listing_node->field_lms_listing_address['und']['0']['value']) ? $listing_node->field_lms_listing_address['und']['0']['value'] .', ': '';
	$city = isset($listing_node->field_lms_listing_city['und']['0']['value']) ? $listing_node->field_lms_listing_city['und']['0']['value'] .', ': '';
	$state = isset($listing_node->field_lms_listing_state['und']['0']['value']) ? $listing_node->field_lms_listing_state['und']['0']['value'] .', ': '';
	$zip = isset($listing_node->field_lms_listing_zip['und']['0']['value']) ? $listing_node->field_lms_listing_zip['und']['0']['value'] .', ': '';
	$listing_address = $address.$city.$state.$zip;

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
	$voc_name = 'product_category';
	$vocab = taxonomy_vocabulary_machine_name_load($voc_name);
	$taxonomy = taxonomy_get_tree($vocab->vid);
	$main = array();
	foreach ($taxonomy as $term) {
		$query = db_select('node', 'n');
		$query->leftJoin('field_data_field_product_group', 'pro_grp', 'n.nid = pro_grp.entity_id');
		$query->leftJoin('field_data_field_sort_number', 'sort_num', 'n.nid = sort_num.entity_id');
		$query->leftJoin('field_data_field_pdf_section', 'pdf_tem', 'n.nid = pdf_tem.entity_id');
		$query->fields('n', array('nid'))
				->condition('n.type', 'pdf_design')
				->condition('pro_grp.field_product_group_tid', $term->tid, '=')
				->condition('pdf_tem.field_pdf_section_value', $pdf_design, '=')
				->orderby('n.nid', 'ASC')
				->orderby('sort_num.field_sort_number_value', 'ASC');
		$result = $query->execute()->fetchCol();
		$main[$term->tid] = $result;
	}
	$querys = db_select('node', 'n');
	$querys->leftJoin('field_data_field_product_group', 'pro_grp', 'n.nid = pro_grp.entity_id');
	$querys->leftJoin('field_data_field_sort_number', 'sort_num', 'n.nid = sort_num.entity_id');
	$querys->leftJoin('field_data_field_pdf_section', 'pdf_tem', 'n.nid = pdf_tem.entity_id');
	$querys->fields('n', array('nid'))
			->condition('n.type', 'pdf_design')
			->condition('pro_grp.field_product_group_tid',  NULL, 'IS')
			->condition('pdf_tem.field_pdf_section_value', $pdf_design, '=')
			->orderby('n.nid', 'ASC')
			->orderby('sort_num.field_sort_number_value', 'ASC');
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
	$pdf_design_node=node_load($pdf_design_id);
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
	$output = '';
	$selected_photos = array();
	$photos = array();
	$x = 0;
	$listing_node = node_load($nid);
	$address = isset($listing_node->field_lms_listing_address['und']['0']['value']) ? $listing_node->field_lms_listing_address['und']['0']['value'] .', ': '';
	$city = isset($listing_node->field_lms_listing_city['und']['0']['value']) ? $listing_node->field_lms_listing_city['und']['0']['value'] .', ': '';
	$state = isset($listing_node->field_lms_listing_state['und']['0']['value']) ? $listing_node->field_lms_listing_state['und']['0']['value'] .', ': '';
	$zip = isset($listing_node->field_lms_listing_zip['und']['0']['value']) ? $listing_node->field_lms_listing_zip['und']['0']['value'] .', ': '';
	$listing_address = $address.$city.$state.$zip;
	
	
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
	if($result !='') {
		$mcpdf_load = node_load($result);
	}
	$pdf_design_node = node_load(arg(2));
	$max_length = isset($pdf_design_node->field_max_text_chars['und'][0]['value']) ? $pdf_design_node->field_max_text_chars['und'][0]['value'] : 500;
	$include_sub_headline = isset($pdf_design_node->field_include_sub_headline['und'][0]['value']) ? $pdf_design_node->field_include_sub_headline['und'][0]['value'] : 0;
	if(arg(1) !='') {
		$listing_nid = arg(1);
		$listing_node_load = node_load($listing_nid);
		$listing_address = isset($listing_node_load->field_lms_listing_address['und'][0]['value']) ? 				   $listing_node_load->field_lms_listing_address['und'][0]['value'].', ' : '';
		$listing_city = isset($listing_node_load->field_lms_listing_city['und'][0]['value']) ? 
						$listing_node_load->field_lms_listing_city['und'][0]['value'] : '';
		$listing_price_format = isset($listing_node_load->field_lms_list_price['und'][0]['value']) ? 
						$listing_node_load->field_lms_list_price['und'][0]['value'] : '';				 
		$node_load = node_load($result);
		
		if(!empty($node_load->field_pdf_text)){
			$listing_online_copy	= isset($node_load->field_pdf_text['und'][0]['value']) ? $node_load->field_pdf_text['und'][0]['value'] : '';
		}
		
		else{
			$description_values_field = isset($listing_node_load->field_lms_mls_description['und'][0]['value']) ? 				 $listing_node_load->field_lms_mls_description['und'][0]['value'].', ' : '';
			$listing_online_copy	= isset($listing_node_load->field_lms_online_copy['und'][0]['value']) ? $listing_node_load->field_lms_online_copy['und'][0]['value'] : $description_values_field;
		}
	}
	$mc_listing_address = isset($mcpdf_load->field_lms_listing_address['und'][0]['value']) ? $mcpdf_load->field_lms_listing_address['und'][0]['value'].', ' : $listing_address;
	$mc_listing_city	= isset($mcpdf_load->field_lms_listing_city['und'][0]['value']) ? $mcpdf_load->field_lms_listing_city['und'][0]['value'] : $listing_city;
	$mc_list_price_format		= isset($mcpdf_load->field_lms_list_price['und'][0]['value']) ? $mcpdf_load->field_lms_list_price['und'][0]['value'] : $listing_price_format;
	$mc_headline		= isset($mcpdf_load->field_lms_listing_headline['und'][0]['value']) ? $mcpdf_load->field_lms_listing_headline['und'][0]['value'] : '';
	$mc_subheadline		= isset($mcpdf_load->field_sub_headline['und'][0]['value']) ? $mcpdf_load->field_sub_headline['und'][0]['value'] : '';
	$mc_printcopy		= isset($mcpdf_load->field_lms_print_copy['und'][0]['value']) ? $mcpdf_load->field_lms_print_copy['und'][0]['value'] : '';
	
	if(is_numeric($mc_list_price_format)){
		$price = '$'.number_format($mc_list_price_format);
	}
	else{
		$price = $mc_list_price_format;
	}
	/***********default value for the hidden field online_copy************/
	$online_copy_value = node_load(arg(1));
	$description_value_field = isset($online_copy_value->field_lms_mls_description['und'][0]['value']) ? 				 $online_copy_value->field_lms_mls_description['und'][0]['value'].', ' : '';
	
	$online_copy_value_field = isset($online_copy_value->field_lms_online_copy['und'][0]['value']) ? 				 $online_copy_value->field_lms_online_copy['und'][0]['value'] : $description_value_field;
	/***********default value for the hidden field online_copy************/			
	$texts = array(
	  $online_copy_value_field => t('IMPORT LISTING COPY'),
	  //$listing_bullets => t('Bullets'), 
	  //$listing_shortcopy => t('Short Copy')
	);

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
	);
		
	$form['online_copy'] = array(
		'#type' => 'textarea',
		'#default_value'	=> $online_copy_value_field,
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
	file_delete($file);
	}
	
	//$user_load = user_load($uid);
	$result_val = get_mcpdf_nid();
	$order_id = 0;
	if(arg(1) !='') {
		$listing_nid = arg(1);
		$listing_node_load = node_load($listing_nid);
		$listing_address = isset($listing_node_load->field_lms_listing_address['und'][0]['value']) ? 				   $listing_node_load->field_lms_listing_address['und'][0]['value'].'' : '';
		$listing_city = isset($listing_node_load->field_lms_listing_city['und'][0]['value']) ? 
						$listing_node_load->field_lms_listing_city['und'][0]['value'] : '';
		$listing_price = isset($listing_node_load->field_lms_list_price['und'][0]['value']) ? 
						 $listing_node_load->field_lms_list_price['und'][0]['value'] : '';
		//Query to get order id for the listing
		$query=db_select('field_data_field_lms_listing_reference', 'lms')
			->fields('lms', array('entity_id'))
			->condition('field_lms_listing_reference_nid', $listing_nid, '=')
			->condition('entity_type', 'commerce_order', '=')
			->condition('bundle', 'commerce_order', '=');
		$result= $query->execute()->fetchAll();
		if(!empty($result)){
			foreach($result as $value){
				$order_id = $value->entity_id;
			}
		}
	}
	if( isset($listing_node_load->field_lms_sales_team) && !empty($listing_node_load->field_lms_sales_team) ){
		$listing_sales_nid= $listing_node_load->field_lms_sales_team['und'][0]['value'];
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
		
	$headline 	=	$form_state['values']['marketing_headline'];
	$subheadline=	$form_state['values']['marketing_sub_headline'];
	$details	=	$form_state['values']['details'];
	$mc_node_id	=	$form_state['values']['mc_node_id'];
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
		
		$node_update= 	node_load($mc_node_id);
		$node_update->title = 'Brochure '.arg(2).' for '.$listing_address.$listing_city;
		$node_update->field_lms_listing_headline['und']['0']['value'] = $headline;
		$node_update->field_sub_headline['und']['0']['value'] = $subheadline;
		$node_update->field_pdf_text['und'][0]['value']	=  $details['value'];
		$node_update->field_lms_listing_address['und'][0]['value'] = $listing_address;
		$node_update->field_lms_listing_city['und'][0]['value'] = $listing_city;
		$node_update->field_lms_list_price['und'][0]['value'] = $listing_price;
		$node_update->field_mc_order_id['und'][0]['target_id'] = $order_id;
		
		$photosquery= db_select('cbone_selected_photos', 'cs')
			->fields('cs', array('selected_photos_fid'))
			->condition('listing_id', arg(1), '=')
			->condition('pdf_design_id', arg(2), '=');
		$photosresult = $photosquery->execute()->fetchField();
		$photosresultarray = unserialize($photosresult); 
		$node_update= 	node_load($mc_node_id);
		if(!empty($photosresultarray)){
			foreach ($photosresultarray as $delta => $value) {
				$fids[]=$value;
				$lms_file = file_load($value);
				$filepath = $lms_file->uri;
				$content = file_get_contents($filepath);
				
				$temp_folder = 'public://lms/mc_pdf/images/';
				file_prepare_directory($temp_folder, FILE_CREATE_DIRECTORY);
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
				node_save($node_update);
				$mc_pdf_folder = 'public://lms/mc_pdf/';
				$real_path_temp_folder = drupal_realpath($mc_pdf_folder);
				$cmd = "rm $real_path_temp_folder 2>&1";
				exec($cmd, $op);	
			}
		}
		mcpdf_agent_image($listing_nid, $mc_node_id);
		if(node_submit($node_update)){
			node_save($node_update);
			mcpdf_agent_image($listing_nid, $mc_node_id);
			 drupal_set_message(t("Updated successfully."), 'status');
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
 
function text_options(){

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
}

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
/**
 * Callback function mcpdf_agent_image()
 * to displayed listing-brochures node
 * @return $form
 **/
function mcpdf_agent_image($listing_nid = NULL, $mcpdf_nid = NULL){
	if($listing_nid != NULL){
		$nid = $listing_nid;
	}
	else{
		$nid = arg(1);
	}
	if($mcpdf_nid != NULL) {
		$result = $mcpdf_nid;
	}
	else {
		$result = get_mcpdf_nid();
	}
	//$nid= arg(1);
	$listing_node_load=node_load($nid);
	//$result = get_mcpdf_nid();
	if($result !='') {
		$mcpdf_load = node_load($result);
	}
	$pfid='';
	$cfid='';
	if(!empty($listing_node_load->field_lms_sales_team)){
		$sales_team = node_load($listing_node_load->field_lms_sales_team['und']['0']['nid']);
		if(!empty($sales_team->field_sales_team_photo)){
			$pfid= $sales_team->field_sales_team_photo['und']['0']['fid'];
		}
	}
	else{
		$user_load = user_load($listing_node_load->uid);
		if(!empty($user_load->picture)){
			$pfid=$user_load->picture->fid;
		}
		
		if(!empty($listing_node_load->field_lms_other_agent)){
			$co_user_load = user_load($listing_node_load->field_lms_other_agent['und']['0']['uid']);
			if(!empty($co_user_load->picture)){
				$cfid=$co_user_load->picture->fid;
			}
		}
	}
	
	$temp_folder = 'public://lms/mc_pdf_users/images/';
	file_prepare_directory($temp_folder, FILE_CREATE_DIRECTORY);
	
	if($pfid != ''){
		$lms_file = file_load($pfid);
		$filepath = $lms_file->uri;
		$content = file_get_contents($filepath);
		$filename = $temp_folder.$lms_file->filename;
		$realpath = drupal_realpath($filename);
		$fp = fopen($realpath, "w");
		fwrite($fp, $content);
		fclose($fp);

		$file = (object)array(
			'uid' => $listing_node_load->uid,
			'filename' => $lms_file->filename,
			'uri' => $filename,
			'filemime' => file_get_mimetype($filename),
			'status' => 1,
			'display' => 1,
		);
		if ($file = file_move($file, $filename, $replace = FILE_EXISTS_RENAME)) {
			$mcpdf_load->field_primary_agent_photo['und'][0] = (array)$file;
		}
	}
	if($cfid != ''){
		$lms_file = file_load($cfid);
		$filepath = $lms_file->uri;
		$content = file_get_contents($filepath);
		$filename = $temp_folder.$lms_file->filename;
		$realpath = drupal_realpath($filename);
		$fp = fopen($realpath, "w");
		fwrite($fp, $content);
		fclose($fp);

		$file = (object)array(
			'uid' => $listing_node_load->uid,
			'filename' => $lms_file->filename,
			'uri' => $filename,
			'filemime' => file_get_mimetype($filename),
			'status' => 1,
			'display' => 1,
		);
		if ($file = file_move($file, $filename, $replace = FILE_EXISTS_RENAME)) {
			$mcpdf_load->field_co_listing_agent_photo['und'][0] = (array)$file;
		}
	}
	node_save($mcpdf_load);
	$mc_pdf_folder = 'public://lms/mc_pdf_users/';
	$real_path_temp_folder = drupal_realpath($mc_pdf_folder);
	$cmd = "rm $real_path_temp_folder 2>&1";
	exec($cmd, $op);	
}