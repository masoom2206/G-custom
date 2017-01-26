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
	//Listing Address
	$address = array();
	$address[] = isset($listing_node->field_lms_listing_address['und']['0']['value']) ? $listing_node->field_lms_listing_address['und']['0']['value'] : '';
	$address[] = isset($listing_node->field_lms_address_unit['und']['0']['value']) ? $listing_node->field_lms_address_unit['und']['0']['value'] : '';
	$address[] = isset($listing_node->field_lms_listing_city['und']['0']['value']) ? $listing_node->field_lms_listing_city['und']['0']['value'] : '';
	$address[] = isset($listing_node->field_lms_listing_state['und']['0']['value']) ? $listing_node->field_lms_listing_state['und']['0']['value'] : '';
	$address[] = isset($listing_node->field_lms_listing_zip['und']['0']['value']) ? $listing_node->field_lms_listing_zip['und']['0']['value'] : '';
	$listing_address = implode(', ', array_filter($address));
	
	$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
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
	$address[] = isset($listing_node->field_lms_listing_address['und']['0']['value']) ? $listing_node->field_lms_listing_address['und']['0']['value'] : '';
	$address[] = isset($listing_node->field_lms_address_unit['und']['0']['value']) ? $listing_node->field_lms_address_unit['und']['0']['value'] : '';
	$address[] = isset($listing_node->field_lms_listing_city['und']['0']['value']) ? $listing_node->field_lms_listing_city['und']['0']['value'] : '';
	$address[] = isset($listing_node->field_lms_listing_state['und']['0']['value']) ? $listing_node->field_lms_listing_state['und']['0']['value'] : '';
	$address[] = isset($listing_node->field_lms_listing_zip['und']['0']['value']) ? $listing_node->field_lms_listing_zip['und']['0']['value'] : '';
	$listing_address = implode(', ', array_filter($address));

	$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
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
	$address[] = isset($listing_node->field_lms_listing_address['und']['0']['value']) ? $listing_node->field_lms_listing_address['und']['0']['value'] : '';
	$address[] = isset($listing_node->field_lms_address_unit['und']['0']['value']) ? $listing_node->field_lms_address_unit['und']['0']['value'] : '';
	$address[] = isset($listing_node->field_lms_listing_city['und']['0']['value']) ? $listing_node->field_lms_listing_city['und']['0']['value'] : '';
	$address[] = isset($listing_node->field_lms_listing_state['und']['0']['value']) ? $listing_node->field_lms_listing_state['und']['0']['value'] : '';
	$address[] = isset($listing_node->field_lms_listing_zip['und']['0']['value']) ? $listing_node->field_lms_listing_zip['und']['0']['value'] : '';
	$listing_address = implode(', ', array_filter($address));

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
	//Listing Address
	$address = array();
	$address[] = isset($listing_node->field_lms_listing_address['und']['0']['value']) ? $listing_node->field_lms_listing_address['und']['0']['value'] : '';
	$address[] = isset($listing_node->field_lms_address_unit['und']['0']['value']) ? $listing_node->field_lms_address_unit['und']['0']['value'] : '';
	$address[] = isset($listing_node->field_lms_listing_city['und']['0']['value']) ? $listing_node->field_lms_listing_city['und']['0']['value'] : '';
	$address[] = isset($listing_node->field_lms_listing_state['und']['0']['value']) ? $listing_node->field_lms_listing_state['und']['0']['value'] : '';
	$address[] = isset($listing_node->field_lms_listing_zip['und']['0']['value']) ? $listing_node->field_lms_listing_zip['und']['0']['value'] : '';
	$listing_address = implode(', ', array_filter($address));

	$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
	);
	$output = theme('pdf_form_test', array('var_name' => $variables));
	return $output;
}

/**
 * Callback function cbone_convert_pdf_preview_thumb()
 * to create PDF Preview Thumbnails
 * @ array $image
 **/
 /*
function sandbox_create_pdf_preview_thumb($node = NULL, $uid = NULL ){
	$arg = arg(1);
	$node = node_load($arg);
	
	$listing_photos = field_collection_field_get_entity($item_id);
	
	//$uri = $listing_photos->field_lms_listing_document['und']['0']['uri'];
	
	$uri = 'public://pdf-images/node-'.$node->nid.'/pdf-thumb/';
	$pdf_file = drupal_realpath($uri);
	//get PDF file name
	$pdf_file_name = basename($pdf_file);
	$pdf_file_name = preg_replace('/\\.[^.\\s]{3,4}$/', '', $pdf_file_name);

	$pdf_first_page = drupal_realpath($uri);

	$document = new Imagick($pdf_file);
	$page_count = $document->getNumberImages();
	$im = new imagick($pdf_first_page);
	$im->setImageFormat('jpeg');
	$im->thumbnailImage(230, 294);
	 

	$filepath = 'public://pdf-images/node-'.$node->nid.'/pdf-thumb/';
	file_prepare_directory($filepath, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);
	
	*/

/**
 * function template_details()
 * to displayed the details of templates
 * @return $node_load
 **/
 
function template_details(){

$query = db_select('node', 'n')
		->fields('n')
		->condition('type', 'pdf_design')
		->execute();
		$node_load=array();
		foreach($query as $value){
			$node_load[] = $value;
			}
			return $node_load;
}

/**
 * function pdf_edit_nodes()
 * to displayed the nodes value
 * @return $output
 **/
 
function pdf_edit_nodes($nid, $pdf_design_id){
global $user;
	$output = '';
	$photos = array();
	$x = 0;
	$listing_node = node_load($nid);
	//Listing Address
	$address = array();
	$address[] = isset($listing_node->field_lms_listing_address['und']['0']['value']) ? $listing_node->field_lms_listing_address['und']['0']['value'] : '';
	$address[] = isset($listing_node->field_lms_address_unit['und']['0']['value']) ? $listing_node->field_lms_address_unit['und']['0']['value'] : '';
	$address[] = isset($listing_node->field_lms_listing_city['und']['0']['value']) ? $listing_node->field_lms_listing_city['und']['0']['value'] : '';
	$address[] = isset($listing_node->field_lms_listing_state['und']['0']['value']) ? $listing_node->field_lms_listing_state['und']['0']['value'] : '';
	$address[] = isset($listing_node->field_lms_listing_zip['und']['0']['value']) ? $listing_node->field_lms_listing_zip['und']['0']['value'] : '';
	$listing_address = implode(', ', array_filter($address));
	
	
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
			$x++;
		}
	}
	/*********************listing photos pdf Edit Form**********************************/

	$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
		'pdf_design_id'=>$pdf_design_id,
		'photo_nid' => $photo_nid,
		'photos' => $photos,
		'count' => $item_count,
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
	if(arg(1) !='') {
		$listing_nid = arg(1);
		$listing_node_load = node_load($listing_nid);
		$listing_address = isset($listing_node_load->field_lms_listing_address['und'][0]['value']) ? 				   $listing_node_load->field_lms_listing_address['und'][0]['value'].', ' : '';
		$listing_city = isset($listing_node_load->field_lms_listing_city['und'][0]['value']) ? 
						$listing_node_load->field_lms_listing_city['und'][0]['value'] : '';
		$listing_price = isset($listing_node_load->field_lms_list_price['und'][0]['value']) ? 
						 $listing_node_load->field_lms_list_price['und'][0]['value'] : '';
						 
		$node_load = node_load($result);
		if(!empty($node_load->field_pdf_text)){
			$listing_online_copy	= isset($node_load->field_pdf_text['und'][0]['value']) ? $node_load->field_pdf_text['und'][0]['value'] : 'NULL';
		}
		
		else{
			$listing_online_copy	= isset($listing_node_load->field_lms_online_copy['und'][0]['value']) ? $listing_node_load->field_lms_online_copy['und'][0]['value'] : 'NULL';
		}
						 
		/*$listing_printcopy	= isset($listing_node_load->field_lms_print_copy['und'][0]['value']) ? $listing_node_load->field_lms_print_copy['und'][0]['value'] : '';
		$listing_bullets		= isset($listing_node_load->field_lms_bullets['und'][0]['value']) ? $listing_node_load->field_lms_bullets['und'][0]['value'] : '';
		$listing_shortcopy	= isset($listing_node_load->field_lms_short_copy['und'][0]['value']) ? $listing_node_load->field_lms_short_copy['und'][0]['value'] : '';*/
	}
	
	/*
	$mc_pdf_sql = "select lms_ref.entity_id from field_data_field_lms_listing_reference as lms_ref 
				   inner join field_data_field_template_reference as tr on lms_ref.entity_id = tr.entity_id
				   where lms_ref.field_lms_listing_reference_nid = 39 and tr.field_template_reference_nid = 712 and lms_ref.entity_type = 'node' and lms_ref.bundle = 'mc_pdf' and tr.entity_type = 'node' and tr.bundle = 'mc_pdf'";
	$mc_pdf_query = db_query($mc_pdf_sql);
	$result = $mc_pdf_query->fetchField();
	print '<pre>';
	print_r(node_load($result));
	print '</pre>';
	*/
	$mc_listing_address = isset($mcpdf_load->field_lms_listing_address['und'][0]['value']) ? $mcpdf_load->field_lms_listing_address['und'][0]['value'].', ' : $listing_address;
	$mc_listing_city	= isset($mcpdf_load->field_lms_listing_city['und'][0]['value']) ? $mcpdf_load->field_lms_listing_city['und'][0]['value'] : $listing_city;
	$mc_list_price		= isset($mcpdf_load->field_lms_list_price['und'][0]['value']) ? '$'.$mcpdf_load->field_lms_list_price['und'][0]['value'] : $listing_price;
	$mc_headline		= isset($mcpdf_load->field_lms_listing_headline['und'][0]['value']) ? $mcpdf_load->field_lms_listing_headline['und'][0]['value'] : '';
	$mc_subheadline		= isset($mcpdf_load->field_sub_headline['und'][0]['value']) ? $mcpdf_load->field_sub_headline['und'][0]['value'] : '';
	$mc_printcopy		= isset($mcpdf_load->field_lms_print_copy['und'][0]['value']) ? $mcpdf_load->field_lms_print_copy['und'][0]['value'] : '';
	
	
	/***********default value for the hidden field online_copy************/
	$online_copy_value = node_load(arg(1));
	$online_copy_value_field = isset($online_copy_value->field_lms_online_copy['und'][0]['value']) ? 				 $online_copy_value->field_lms_online_copy['und'][0]['value'].', ' : '';
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
		'#default_value'	=> $mc_headline,
	);
	$form['marketing_sub_headline'] = array(
		'#type' => 'textfield',
		'#title' => 'Subheadline',
		'#size' => 60,
		'#maxlength' => 255,
		'#required' => TRUE,
		'#default_value'	=> $mc_subheadline,
	);
	
	$form['text_options'] = array(
		'#type' => 'checkboxes',
		'#options' => $texts,
		'#required' => FALSE
	);
	
	$form['details'] = array(
		'#type' => 'text_format',
		'#title' => '',
		'#size' => 60,
		'#required' => TRUE,
		'#wysiwyg' => TRUE,
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
			'#value' => t('UPDATE'),
		);
	}
	if($result =='') {
		$form['submit'] = array(
			'#type' => 'submit',
			'#value' => t('SUBMIT'),
		);
	}
	/*$form['done'] = array(
			'#type' => 'submit',
			'#value' => t('DONE'),
			'#submit' => array('after_complete_pdf_form'),
			'#attributes' => array(
							'style' => 'margin-left: 6px;',
						),
		);*/
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
		if(!empty($file)) {
			file_delete($file);
		}
	}
	
	
	
	
	
	
	
	
	//$user_load = user_load($uid);
	$result_val = get_mcpdf_nid();
	if(arg(1) !='') {
		$listing_nid = arg(1);
		$listing_node_load = node_load($listing_nid);
		$listing_address = isset($listing_node_load->field_lms_listing_address['und'][0]['value']) ? 				   $listing_node_load->field_lms_listing_address['und'][0]['value'].', ' : '';
		$listing_city = isset($listing_node_load->field_lms_listing_city['und'][0]['value']) ? 
						$listing_node_load->field_lms_listing_city['und'][0]['value'] : '';
		$listing_price = isset($listing_node_load->field_lms_list_price['und'][0]['value']) ? 
						 $listing_node_load->field_lms_list_price['und'][0]['value'] : '';
	}
	$node = new stdClass();
	$node->type = 'mc_pdf';
	$node->title = 'Brochure '.arg(2).' for '.$listing_address.$listing_city;
	node_object_prepare($node);
	$node->language = 'und';
	$uid = $user->uid;
	$headline 	=	$form_state['values']['marketing_headline'];
	$subheadline=	$form_state['values']['marketing_sub_headline'];
	$details	=	$form_state['values']['details'];
	$mc_node_id	=	$form_state['values']['mc_node_id'];
	//$radio_value=	$form_state['values']['text_options'];
	
	if($result_val == '') {
		$node->uid = $uid;
		$node->field_lms_listing_reference['und'][0]['nid'] = arg(1);
		$node->field_template_reference['und'][0]['nid'] = arg(2);
		$node->field_lms_listing_headline['und'][0]['value'] = $headline;
		$node->field_sub_headline['und'][0]['value'] = $subheadline;
		/*
		if($radio_value == 'print_copy') {
			$node->field_lms_print_copy['und'][0]['value'] = $details;
		}
		if($radio_value == 'bullets') {
			$node->field_lms_bullets['und'][0]['value']	= $details;
		}
		if($radio_value == 'short_copy') {
			$node->field_lms_short_copy['und'][0]['value']	= $details;
		}
		*/
		$node->field_pdf_text['und'][0]['value']	=  $details['value'];
		$node->field_lms_listing_address['und'][0]['value'] = $listing_address;
		$node->field_lms_listing_city['und'][0]['value'] = $listing_city;
		$node->field_lms_list_price['und'][0]['value'] = $listing_price;
		node_save($node);	
		 drupal_set_message(t("Successfully, node is created"), 'status');
		
	}
	if($result_val != '') {
		
		$node_update= 	node_load($mc_node_id);
		$node_update->title = 'Brochure '.arg(2).' for '.$listing_address.$listing_city;
		$node_update->field_lms_listing_headline['und']['0']['value'] = $headline;
		$node_update->field_sub_headline['und']['0']['value'] = $subheadline;
		$node_update->field_pdf_text['und'][0]['value']	=  $details['value'];
		/*
		if($radio_value == 'print_copy') {
			$node_update->field_lms_print_copy['und']['0']['value'] = $details;
		}
		if($radio_value == 'bullets') {
			$node_update->field_lms_bullets['und'][0]['value']	= $details;
		}
		if($radio_value == 'short_copy') {
			$node_update->field_lms_short_copy['und'][0]['value']	= $details;
		}
		*/
		node_save($node_update);
		if(node_submit($node_update)){
			node_save($node_update);
			 drupal_set_message(t("Successfully node id @value updated.", array('@value' => $mc_node_id)), 'status');
		}
		
	}
	
	save_generated_pdf(arg(1), arg(2));
	
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
 * Callback function for menu pdf-delete/%/%/%
 * to delete mc_pdf node and redirect
 * to brochure overview screen
 **/ 
/*function delete_mcpdf_node_form($form, $form_state){

$form['mcpdf_nid'] = array(
		'#type' => 'hidden',
		'#title' => 'mcpdf nid',
		'#values'	=> arg(3),
	);
$form['submit'] = array(
	'#type' => 'submit',
	'#value' => t('Yes'),
	'#submit'=>array('delete_mcpdf_submit'),
);
$form['cancel'] = array(
	'#type' => 'submit',
	'#value' => t('Cancel'),
);

return $form;


}


function delete_mcpdf_submit($form, $form_state){
$nid = arg(3);
$query = node_delete($nid);
drupal_set_message("Successfully deleted the node");
$path = 'S3://PDF/'.$nid.'.pdf';
$fid = db_query("SELECT fid FROM {file_managed} WHERE uri = :path", array(':path' => $path))->fetchField();
$file = file_load($fid);
$uid = $file->uid;
if(!empty($file)) {
	file_delete($file);
}
$pdf_image_path='S3://pdf-thumbnail/agent-'.$uid.'/listing-'.arg(1).'/'.$nid.'.jpeg';
file_unmanaged_delete($pdf_image_path);
}
*/


/**
 * Callback function listing_video_download()
 * to download the video file
 **/
function download_pdf() {
/*	$listing_ref_name = node_load(arg(1));	
	$template_ref_name = node_load(arg(2));
	$path = 'public://PDF/'.$listing_ref_name->title.'-'.$template_ref_name->title.'.pdf';
	$file_name = $listing_ref_name->title.'-'.$template_ref_name->title.'.pdf';
	$fid = db_query("SELECT fid FROM {file_managed} WHERE uri = :path", array(':path' => $path))->fetchField();
	$file = file_load($fid);
	$url = file_create_url($file->uri);
	header("Content-Type: application/octet-stream");
	header("Content-Type: application/download");
	header("Content-Transfer-Encoding: Binary");
	header("Content-disposition: attachment; filename=\"cbone_listing.mp4\""); 
	header("Content-Disposition:inline;filename='$file_name");
	print readfile($url);
	drupal_goto($_GET['destination']);*/
	
	
	
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

	/*
	if(arg(1) !='') {
		$query=db_select('field_data_field_lms_listing_reference', 'lms_ref');
		$query->fields('lms_ref', array('entity_id'));
		$query->condition('lms_ref.field_lms_listing_reference_nid', arg(1), '=');
		$query->condition('lms_ref.entity_type', 'node', 'LIKE');
		$query->condition('lms_ref.bundle', 'mc_pdf', 'LIKE');
		$result= $query->execute()->fetchField(); 
	}
	*/
		
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
	//print '<pre>';
	//print_r($results);
	//print '</pre>';
	//exit;
	/*$count = count($results);
	//$result = $values->entity_id;
	//if(!empty($results)) {
		//foreach($results as $values) {
			
			
			
			$form['print_and_go'] = array(
				'#type' => 'radios',
				'#options' => array($result => 'Use for online marketing'),
				'#required' => FALSE
			);
			$form['submit'] = array(
					'#type' => 'submit',
					'#value' => t('SUBMIT'),
			);
			return $form;
		//}
	//}
	*/
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
	
	
