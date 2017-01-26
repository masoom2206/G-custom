<?php
/**
 * Callback function cbone_auto_generate_mcpdf()
 * to auto generate the mc pDF node and PDF for MC
 * @return ''
 * URL: auto-generate-mcpdf
 **/
function cbone_auto_generate_mcpdf(){
	$template = $_POST['template'];
	$template_node = node_load($template);
	$listing_nid = $_POST['listing_nid'];
	$listing_node = node_load($listing_nid);
	$listing_address = isset($listing_node->field_lms_listing_address['und'][0]['value']) ? $listing_node->field_lms_listing_address['und'][0]['value'].'' : '';
	$listing_city = isset($listing_node->field_lms_listing_city['und'][0]['value']) ? $listing_node->field_lms_listing_city['und'][0]['value'] : '';
	$listing_price = isset($listing_node->field_lms_list_price['und'][0]['value']) ? $listing_node->field_lms_list_price['und'][0]['value'] : '';		
	//get order id for the listing
	$order_id = cbone_listing_commerce_order($listing_nid);
	//Default value for mc_pdf field
	$headline = isset($listing_node->field_lms_listing_headline['und']['0']['value']) ? $listing_node->field_lms_listing_headline['und']['0']['value'] : 'MC PDF Marketing Headline';
	$subheadline = '';
	$postcard_type = '';
	$details = isset($listing_node->field_lms_online_copy['und']['0']['value']) ? $listing_node->field_lms_online_copy['und']['0']['value'] : 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem.';

	$node = new stdClass();
	$node->type = 'mc_pdf';
	$node->title = 'Brochure '.$template.' for '.$listing_address.$listing_city;
	node_object_prepare($node);
	$node->language = 'und';
	$node->uid = $listing_node->uid;
	$node->field_lms_listing_reference['und'][0]['nid'] = $listing_nid;
	$node->field_template_reference['und'][0]['nid'] = $template;
	$node->field_lms_listing_headline['und'][0]['value'] = $headline;
	$node->field_sub_headline['und'][0]['value'] = $subheadline;
	$node->field_postcard_type['und'][0]['value'] = $postcard_type;		
	$node->field_pdf_text['und'][0]['value'] =  $details;
	$node->field_lms_listing_address['und'][0]['value'] = $listing_address;
	$node->field_lms_listing_city['und'][0]['value'] = $listing_city;
	$node->field_lms_list_price['und'][0]['value'] = $listing_price;
	$node->field_mc_order_id['und'][0]['target_id'] = $order_id;
	if($template_node->field_pdf_section['und'][0]['value'] == 'post card') {
		$node->field_postcard_type['und']['0']['value'] = 'listed';
	}
	node_save($node);
	$mcpdf_nid = $node->nid;
	listing_pdf_photos($mcpdf_nid, $listing_nid, $template);
	module_load_include('inc', 'listing_pdf', 'includes/listing_brochures');
	mcpdf_agent_image($listing_nid, $mcpdf_nid);
	save_generated_pdf($listing_nid, $template);
	pdf_image_generation($listing_nid, $template);
	cbone_delete_mcpdf_agent_images($mcpdf_nid);
	cbone_delete_mcpdf_images($mcpdf_nid);
	print 'done';
}
/**
 * Callback function cbone_listing_commerce_order()
 * to fetch listing commerce order
 * @return $order_id
 **/
function cbone_listing_commerce_order($nid){
	$commerce_order = db_select("field_data_field_lms_listing_reference", 'lr');
	$commerce_order->fields('lr', array('entity_id'));
	$commerce_order->condition('lr.entity_type', 'commerce_order', 'LIKE');
	$commerce_order->condition('lr.bundle', 'commerce_order', 'LIKE');
	$commerce_order->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$commerce_order_count = $commerce_order->execute()->rowCount();
	if($commerce_order_count != 0) {
		$order_id = $commerce_order->execute()->fetchField();
	}
	else {
		$order_id = $commerce_order_count;
	}
	return $order_id;
}


/**
 * Callback function listing_pdf_photos()
 * to saved the listing photos in mc PDF
 **/
function listing_pdf_photos($mcpdf_nid, $listing_nid, $template){
	$mcpdf_node = node_load($mcpdf_nid);
	$lms_photo_nid = db_select("field_data_field_lms_listing_reference", 'lr');
	$lms_photo_nid->fields('lr', array('entity_id'));
	$lms_photo_nid->condition('lr.entity_type', 'node', 'LIKE');
	$lms_photo_nid->condition('lr.bundle', 'lms_photos', 'LIKE');
	$lms_photo_nid->condition('lr.field_lms_listing_reference_nid', $listing_nid, '=');
	$photo_nid = $lms_photo_nid->execute()->fetchField();
	$photo_node = node_load($photo_nid);
	$items = field_get_items('node', $photo_node, 'field_lms_listing_photos');
	if(!empty($items)) {
		$fids = array();
		foreach ($items as $delta => $item) {
			$listing_photos = field_collection_field_get_entity($item);
			$fid = $listing_photos->field_lms_listing_photo['und']['0']['fid'];
		
			$fids[] = $fid;
			$lms_file = file_load($fid);
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
				'uid' => $mcpdf_node->uid,
				'filename' => $lms_file->filename,
				'uri' => $filename,
				'filemime' => file_get_mimetype($filename),
				'status' => 1,
				'display' => 1,
			);
			if ($file = file_move($file, $filename, $replace = FILE_EXISTS_RENAME)) {
				$mcpdf_node->field_pdf_photos['und'][$delta] = (array)$file;
				//$listing_video->save( TRUE );
			}
			node_save($mcpdf_node);
			$mc_pdf_folder = 'public://lms/mc_pdf/';
			$real_path_temp_folder = drupal_realpath($mc_pdf_folder);
			$cmd = "rm $real_path_temp_folder 2>&1";
			exec($cmd, $op);	
		}
	}
	//node_save($mcpdf_node);
	$serializefids = serialize($fids);
	$reuslt = db_merge('cbone_selected_photos')
	  ->key(array('mcpdf_id' => $mcpdf_nid))
	  ->fields(array(
		  'listing_id' => $listing_nid,
		  'pdf_design_id' => $template,
		  'mcpdf_id' => $mcpdf_nid,
		  'selected_photos_fid' => $serializefids,
	  ))
	  ->execute();
}

