<?php
/**
 * Callback function cbone_listing_photos()
 * to displayed the listing photos
 * @return $output
 **/
function cbone_listing_photos($nid){
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
		
	$lms_photo_nid = db_select("field_data_field_lms_listing_reference", 'lr');
	$lms_photo_nid->fields('lr', array('entity_id'));
	$lms_photo_nid->condition('lr.entity_type', 'node', 'LIKE');
	$lms_photo_nid->condition('lr.bundle', 'lms_photos', 'LIKE');
	$lms_photo_nid->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$photo_nid = $lms_photo_nid->execute()->fetchField();
	$photo_node = node_load($photo_nid);

	$items = field_get_items('node', $photo_node, 'field_lms_listing_photos');
	$item_count = 0;
	$import_photos_count = 0;
	$nrt_id = isset($listing_node->field_lms_listing_nrt_id['und']['0']['value']) ? trim($listing_node->field_lms_listing_nrt_id['und']['0']['value']) : '';
	if(!empty($items)) {
		$item_count = count($items);
		foreach ($items as $delta => $item) {
			//$listing_photos = array();
			$count = cbone_web_listing_photo_exist($item['value']);
			if($count) {
				$listing_photos = field_collection_field_get_entity($item);
				$photos[$delta]['item_id'] = $item['value'];     //$listing_photos->item_id;
				$photos[$delta]['delta'] = $delta;
				$photos[$delta]['revision_id'] = $item['revision_id'];   //$listing_photos->revision_id;
				
				$image = array(
					'style_name' => 'my_listing_160x110',
					'path' => isset($listing_photos->field_lms_listing_photo['und']['0']['uri']) ? $listing_photos->field_lms_listing_photo['und']['0']['uri'] : '',
					'title' => isset($listing_photos->field_lms_listing_photo['und']['0']['filename']) ? $listing_photos->field_lms_listing_photo['und']['0']['filename'] : ''
				);
				$photos[$delta]['photo'] = theme('image_style', $image);		
				$photos[$delta]['photo_url'] = isset($listing_photos->field_lms_listing_photo['und']['0']['uri']) ? file_create_url($listing_photos->field_lms_listing_photo['und']['0']['uri']) : '';
				$photos[$delta]['photo_name'] = isset($listing_photos->field_lms_listing_photo['und']['0']['filename']) ? $listing_photos->field_lms_listing_photo['und']['0']['filename'] : '';
				$x++;
			}
		}
	}
	else {
		$import_photos_count = db_query("SELECT COUNT(*) FROM lms_photo_import WHERE nrt_property_id = :nrt_id AND lms_listing_node = :listing_nid AND lms_photo_node = :photo_nid AND imported = :imported", array('nrt_id' => $nrt_id, 'listing_nid' => $listing_node->nid, 'photo_nid' => $photo_nid, 'imported' => 0))->fetchField();
	}
	$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
		'photo_nid' => $photo_nid,
		'photos' => $photos,
		'count' => $item_count,
		'import_photos_count' => $import_photos_count,
		'nrt_id' => $nrt_id,
	);
	$output = theme('listing_photos', array('var_name' => $variables));
	return $output;
}
/**
 * Callback function listing_photos_upload()
 * to displayed the form to upload photos
 * @return $output
 **/
function listing_photos_upload($nid){
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
		
	$lms_photo_nid = db_select("field_data_field_lms_listing_reference", 'lr');
	$lms_photo_nid->fields('lr', array('entity_id'));
	$lms_photo_nid->condition('lr.entity_type', 'node', 'LIKE');
	$lms_photo_nid->condition('lr.bundle', 'lms_photos', 'LIKE');
	$lms_photo_nid->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$photo_nid = $lms_photo_nid->execute()->fetchField();
	$photo_node = node_load($photo_nid);

	$items = field_get_items('node', $photo_node, 'field_lms_listing_photos');
	$item_count = count($items);
	$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
		'photo_nid' => $photo_nid,
		'count' => $item_count,
	);
	$output = theme('photos_upload', array('var_name' => $variables));
	
	return $output;
}
/**
 * Callback function listing_photos_download()
 * to download all files in zip format
 **/
function listing_photos_download($nid){
	$photo_node = node_load($nid);
	$items = field_get_items('node', $photo_node, 'field_lms_listing_photos');
	$files = array();
	$x = 0;
	foreach ($items as $delta => $item) {
		$listing_photos = field_collection_field_get_entity($item);
		$files[$x]['file_url'] = file_create_url($listing_photos->field_lms_listing_photo['und']['0']['uri']);
		$files[$x]['file_name'] = $listing_photos->field_lms_listing_photo['und']['0']['filename'];
		$x++;
	}
	if(!empty($files)) {
		$zip = new ZipArchive();
		$tmp_file = file_directory_temp().'/'.$nid.'_listing_photos.zip';
		$zip->open($tmp_file, ZipArchive::CREATE);
		foreach($files as $file){
			$download_file = file_get_contents($file['file_url']);
			$zip->addFromString($file['file_name'],$download_file);
		}
		$zip->close();
		header('Content-disposition: attachment; filename=listing_photos.zip');
		header('Content-type: application/zip');
		readfile($tmp_file);
	}
	unlink($tmp_file);
}
/**
 * Callback function listing_photos_delete()
 * to delete the selected photos
 **/
function listing_photos_delete(){
	$photos = $_POST['data'];
	$photo_nid = $_POST['photo_nid'];
	entity_delete_multiple('field_collection_item', $photos);
	print 'Done';
}
