<?php
/**
 * Callback function cbone_listing_merge_selection()
 * to displayed the list of listing for selection
 * @return $output
 **/
function cbone_listing_merge_selection($uid){
	global $user;
	$output = '';
	if(isset($_SESSION['my_listing_back']) && $_SESSION['my_listing_back'] != '') {
		$my_listing_back = '/'.$_SESSION['my_listing_back'];
	}
	else {
		$my_listing_back = '/node/510';
	}
	$output .= '<div class="manage-listing-back"><a href="'.$my_listing_back.'"><img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png"></a></div>';
	
	$output .= '<div class="find-merge-listing"><div class="merge-listing-title">Find and Merge Listings</div><div class="merge-listing-description">Select no more than 2 listings at one time to merge, then click the \'NEXT\' button to continue.</div>';
	
	$filter_form = drupal_get_form('merge_list_filter_form');
	$output .= drupal_render($filter_form).'</div>';
	
	$select_form = drupal_get_form('listing_merge_selection_form');
	$output .= drupal_render($select_form);

	//print "<pre>";print_r($user);exit;
	return $output;
}

/**
 * Callback function cbone_listing_merge()
 * to displayed the listing merge functionality
 * @return $output
 **/
function cbone_listing_merge($nid1, $nid2){
	global $user;
	$output = '';
	if(isset($_SESSION['my_listing_back']) && $_SESSION['my_listing_back'] != '') {
		$my_listing_back = '/'.$_SESSION['my_listing_back'];
	}
	else {
		$my_listing_back = '/node/510';
	}
	$output .= '<div class="manage-listing-back"><a href="'.$my_listing_back.'"><img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png"></a></div>';
	
	$output .= '<div class="find-merge-listing"><div class="merge-listing-title">Find and Merge Listings</div><div class="merge-listing-description">Instructions: Carefully review the two listings below. If you decide to merge them, the data from the listing on the left will be merged into the listing on the right. The dupliate listing will then be removed from CB|One. This action is not reversible.</div></div>';
	
	$type1 = node_load($nid1)->type;
	$type2 = node_load($nid1)->type;
	if($type1 != 'lms_listing' && $type2 != 'lms_listing') {
		$output .= '<div class="wrong-merge-listing">Kindly select "LMS Listing" node NID.</div>';
	}
	else {
		$merge_form = drupal_get_form('listing_merge_detail_form', $nid1, $nid2);
		$output .= drupal_render($merge_form);
	}
	
	//$output .= listing_merge_detail($nid1, $nid2);
	return $output;
	//print "<pre>";print_r($user);exit;
}

/**
 * Drupal form API
 * for search listing by address
 **/
function merge_list_filter_form() {
	$form['uid'] = array('#type' => 'hidden', '#value' => arg(1));
	$form['address'] = array(
		'#type' => 'textfield',
		'#title' => t('Filter by Street'),
		'#description' => t('Enter a street name then click \'Apply\''),
		'#size' => 30,
	);
	$form['actions']['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Apply'),
		'#prefix' => '<div class="merge-list-filter-submit">',
		'#suffix' => '</div>',
	);
	return $form;
}
/**
 * Drupal form API
 * for search listing by address
 **/
function merge_list_filter_form_submit($form, &$form_state){
	if(isset($form_state['values']['address']) && $form_state['values']['address'] != '') {
		$address = $form_state['values']['address'];
		$uid = $form_state['values']['uid'];
		drupal_goto('listing-merge-selection/'.$uid, array('query' => array('address' => $address)));
	}
	else {
		drupal_goto('listing-merge-selection');
	}
}
/**
 * Drupal form API
 * to displayed the listing list in tableselect format
 **/
function listing_merge_selection_form($form, $form_state) {
	global $user;
	$uid = arg(1);
	if(isset($_GET['address']) && $_GET['address'] != ''){
		$results = db_query("select * from field_data_field_lms_listing_address a INNER JOIN node n ON n.nid = a.entity_id where n.uid = :uid AND n.status = :status AND n.type = :type AND a.field_lms_listing_address_value LIKE :address order by a.field_lms_listing_address_value ASC", array(':address' => '%'.$_GET['address'].'%', ':uid' => $uid, ':status' => 1, ':type' => 'lms_listing'));
	}
	else {
		$results = db_query("select * from field_data_field_lms_listing_address a INNER JOIN node n ON n.nid = a.entity_id where n.uid = :uid AND n.status = :status AND n.type = :type AND a.field_lms_listing_address_value in (select field_lms_listing_address_value from field_data_field_lms_listing_address group by field_lms_listing_address_value having count(*) > 1 ) order by a.field_lms_listing_address_value ASC", array(':uid' => $uid, ':status' => 1, ':type' => 'lms_listing'));
	}
	
	$options = array();
	foreach($results as $row) {
		//load listing node
		$node_data = node_load($row->entity_id);
		//address
		$options[$node_data->nid]['address'] = isset($node_data->field_lms_listing_address['und']['0']['value']) ? $node_data->field_lms_listing_address['und']['0']['value'] : '';
		//city
		$options[$node_data->nid]['city'] = isset($node_data->field_lms_listing_city['und']['0']['value']) ? $node_data->field_lms_listing_city['und']['0']['value'] : '';
		//MLS ID
		$options[$node_data->nid]['mls_id'] = isset($node_data->field_lms_mls_id['und']['0']['value']) ? $node_data->field_lms_mls_id['und']['0']['value'] : '';
		//NRT ID
		$options[$node_data->nid]['nrt_id'] = isset($node_data->field_lms_listing_nrt_id['und']['0']['value']) ? $node_data->field_lms_listing_nrt_id['und']['0']['value'] : '';
		$options[$node_data->nid]['edit_listing'] = array(
			'data' => '<a href="/node/'.$node_data->nid.'/edit"><img src="/sites/all/modules/custom/listing_marketing_system/images/pencil-edit.png" /></a>',
			'class' => array('listing-edit'),
			'width'=>'10%',
		);
		//$x++;
	}
	$header = array(
		'address' => array('data' => t('Listing Address'), 'width'=>'30%'),
		'city' => array('data' => t('Listing City'), 'width'=>'20%'),
		'mls_id' => array('data' => t('MLS ID'), 'width'=>'20%'),
		'nrt_id' => array('data' => t('NRT Property ID'), 'width'=>'20%'),
		'edit_listing' => array('data' => t('Edit Listing'), 'width'=>'10%'),
	);
	$form['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Next'),
	);

	$per_page = 20;
	// Initialize the pager
	$current_page = pager_default_initialize(count($options), $per_page);
	// Split your list into page sized chunks
	$chunks = array_chunk($options, $per_page, TRUE);

	$form['listings'] = array(
		'#type' => 'tableselect',
		'#header' => $header,
		'#options' => isset($chunks[$current_page]) ? $chunks[$current_page] :  $chunks,
		'#empty' => t('No Listing available.'),
	);
	$form['pager'] = array('#markup' => theme('pager', array('quantity' => 3)));
	$form['#validate'][] = 'listing_merge_selection_form_validate';
	return $form;
}
/**
 * Drupal form API
 * to validate the submited listing
 **/
function listing_merge_selection_form_validate($form, &$form_state){
	$x = 0;
	$nrt_id = '';
	$wrong_nrt_id = 0;
	$address1 = '';
	$address2 = '';
	foreach($form_state['values']['listings'] as $listings) {
		if($listings != 0) {
			$node_detail = node_load($listings);
			if($nrt_id == '') {
				$nrt_id = isset($node_detail->field_lms_listing_nrt_id['und']['0']['value']) ? $node_detail->field_lms_listing_nrt_id['und']['0']['value'] : '';
			}
			else if(isset($node_detail->field_lms_listing_nrt_id['und']['0']['value']) && $node_detail->field_lms_listing_nrt_id['und']['0']['value'] != ''){
				$wrong_nrt_id = 1;
			}
			if($address1 == '') {
				$address1 = trim($node_detail->field_lms_listing_address['und']['0']['value']);
			}
			else {
				$address2 = trim($node_detail->field_lms_listing_address['und']['0']['value']);
			}
			$x++;
		}
	}
	if($x > 2) {
		form_set_error('form', t('Only two listings may be selected per merge.'));
	}
	else if($address1 != $address2) {
		form_set_error('form', t('Listings must have the same address.'));
	}
	else if($wrong_nrt_id == 1){
		form_set_error('form', t('These listings may not be merged because they have different NRT Property IDs. Please see your Office Administrator or Marketing Coordinator for assistance.'));
	}
	else if($nrt_id == '') {
		form_set_error('form', t('An NRT Property ID is required on one of the selected listings.'));
	}
}

/**
 * Drupal form API
 * for search listing by address
 **/
function listing_merge_selection_form_submit($form, &$form_state){
	//print "<pre>";print_r($form_state['values']);exit;
	$nids = array();
	foreach($form_state['values']['listings'] as $listings) {
		if($listings != 0) {
			$nids[] = $listings;
		}
	}
	$nids_path = implode("/", $nids);
	drupal_goto('listing-merge/'.$nids_path);
}

/**
 * Callback function listing_merge_detail_form()
 * to generate the duplicate merege listing table
 **/
function listing_merge_detail_form($form, $form_state, $nid1, $nid2) {
	$form['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Merge'),
		'#prefix' => '<div class="merge-button">',
		'#suffix' => '</div>',
	);
	$form['cancel'] = array(
		'#type' => 'submit',
		'#value' => t('Cancel'),
		'#prefix' => '<div class="cancel-button">',
		'#suffix' => '</div>',
	);
	$nodedetail1 = node_load($nid1);
	if(isset($nodedetail1->field_lms_listing_nrt_id['und']['0']['value']) && $nodedetail1->field_lms_listing_nrt_id['und']['0']['value'] != '') {
		$nodedetail1 = node_load($nid1);
		$nodedetail2 = node_load($nid2);
		$form['duplicate_listing'] = array('#type' => 'hidden', '#value' => $nid1);
		$form['surviving_listing'] = array('#type' => 'hidden', '#value' => $nid2);
		$lms_listing_document_count = cbone_listing_documents_count($nid1);
		
	}
	else {
		$nodedetail1 = node_load($nid2);
		$nodedetail2 = node_load($nid1);
		$form['duplicate_listing'] = array('#type' => 'hidden', '#value' => $nid2);
		$form['surviving_listing'] = array('#type' => 'hidden', '#value' => $nid1);
		$lms_listing_document_count = cbone_listing_documents_count($nid1);
	}
	//'#attributes' => array('disabled' => 'disabled')
	$form['nrt_id'] = array('#type' => 'checkbox', '#default_value' => TRUE, '#attributes' => array('disabled' => 'disabled'));
	$form['mls_no'] = array('#type' => 'checkbox', '#default_value' => TRUE, '#attributes' => array('disabled' => 'disabled'));
	$form['co_listing_agent'] = array('#type' => 'checkbox', '#default_value' => TRUE,);
	$form['unit_number'] = array('#type' => 'checkbox', '#default_value' => TRUE,);
	$form['bedroom'] = array('#type' => 'checkbox', '#default_value' => TRUE,);
	$form['bath'] = array('#type' => 'checkbox', '#default_value' => TRUE,);
	$form['property_type'] = array('#type' => 'checkbox', '#default_value' => TRUE,);
	$form['price'] = array('#type' => 'checkbox', '#default_value' => TRUE,);
	$form['listing_status'] = array('#type' => 'checkbox', '#default_value' => TRUE,);
	$form['mls_description'] = array('#type' => 'checkbox', '#default_value' => TRUE,);
	$form['photos'] = array('#type' => 'checkbox', '#default_value' => TRUE,);
	/**
	 * Drupal form API
	 * for merge listing for ducument and video by Harinder Singh Maan on 07/09/2016
	 **/
	 //if($lms_listing_document_count > 0){
		$form['documents'] = array('#type' => 'checkbox', '#default_value' => TRUE);
	 //}else{
		//$form['documents'] = array('#type' => 'checkbox', '#default_value' => FALSE);
	// }
	$form['video'] = array('#type' => 'checkbox', '#default_value' => TRUE);
	/*code ended by Harinder Singh Maan on 07/09/2016*/
	return $form;
}
/**
 * Drupal form API
 * for merge listing
 **/
function listing_merge_detail_form_submit($form, &$form_state){
	global $user;
	$op = $form_state['values']['op'];
	if($op == 'Cancel'){
		drupal_goto('listing-merge-selection/'.$user->uid);
	}
	else {
		$duplicate_nid = $form_state['values']['duplicate_listing'];
		$duplicate_listing = node_load($duplicate_nid);
		$surviving_nid = $form_state['values']['surviving_listing'];
		$surviving_listing = node_load($surviving_nid);
		$auther_user_id = $surviving_listing->uid;
		//print "<pre>";print_r($surviving_listing);exit;
		$surviving_listing->field_lms_listing_nrt_id['und']['0']['value'] = $duplicate_listing->field_lms_listing_nrt_id['und']['0']['value'];
		$surviving_listing->field_lms_mls_id['und']['0']['value'] = $duplicate_listing->field_lms_mls_id['und']['0']['value'];
		if($form_state['values']['co_listing_agent'] == 1) {
			if(isset($duplicate_listing->field_lms_other_agent['und']['0']['uid'])) {
				$surviving_listing->field_lms_other_agent['und']['0']['uid'] = $duplicate_listing->field_lms_other_agent['und']['0']['uid'];
			}
		}
		if($form_state['values']['unit_number'] == 1) {
			if(isset($duplicate_listing->field_lms_address_unit['und']['0']['value'])) {
				$surviving_listing->field_lms_address_unit['und']['0']['value'] = $duplicate_listing->field_lms_address_unit['und']['0']['value'];
			}
		}
		if($form_state['values']['bedroom'] == 1) {
			if(isset($duplicate_listing->field_lms_total_bedrooms['und']['0']['value'])) {
				$surviving_listing->field_lms_total_bedrooms['und']['0']['value'] = $duplicate_listing->field_lms_total_bedrooms['und']['0']['value'];
			}
		}
		if($form_state['values']['bath'] == 1) {
			if(isset($duplicate_listing->field_lms_total_baths['und']['0']['value'])) {
				$surviving_listing->field_lms_total_baths['und']['0']['value'] = $duplicate_listing->field_lms_total_baths['und']['0']['value'];
			}
		}
		if($form_state['values']['property_type'] == 1) {
			if(isset($duplicate_listing->field_lms_property_type['und']['0']['tid'])) {
				$surviving_listing->field_lms_property_type['und']['0']['tid'] = $duplicate_listing->field_lms_property_type['und']['0']['tid'];
			}
		}
		if($form_state['values']['price'] == 1) {
			if(isset($duplicate_listing->field_lms_list_price['und']['0']['value'])) {
				$surviving_listing->field_lms_list_price['und']['0']['value'] = $duplicate_listing->field_lms_list_price['und']['0']['value'];
			}
		}
		if($form_state['values']['listing_status'] == 1) {
			if(isset($duplicate_listing->field_lms_listing_status['und']['0']['tid'])) {
				$surviving_listing->field_lms_listing_status['und']['0']['tid'] = $duplicate_listing->field_lms_listing_status['und']['0']['tid'];
			}
		}
		if($form_state['values']['mls_description'] == 1) {
			if(isset($duplicate_listing->field_lms_mls_description['und']['0']['value'])) {
				$surviving_listing->field_lms_mls_description['und']['0']['value'] = $duplicate_listing->field_lms_mls_description['und']['0']['value'];
			}
		}
		if($form_state['values']['photos'] == 1) {
			$duplicate_photo_nid = cbone_listing_photo_count($duplicate_listing->nid, 'photo_nid');
			$surviving_photo_nid = cbone_listing_photo_count($surviving_listing->nid, 'photo_nid');
			$duplicate_photo = node_load($duplicate_photo_nid);
			$surviving_photo = node_load($surviving_photo_nid);
			//print "<pre>";print_r($duplicate_photo);exit;
			if(isset($duplicate_photo->field_lms_listing_photos['und']['0'])) {
				$items = field_get_items('node', $duplicate_photo, 'field_lms_listing_photos');
				if(!empty($items)) {
					foreach ($items as $delta => $item) {
						$listing_photos = field_collection_field_get_entity($item);
						if(isset($listing_photos->field_lms_listing_photo['und']['0'])) {
							$file = $listing_photos->field_lms_listing_photo['und']['0'];
							$update_time = strtotime($listing_photos->field_lms_listing_photo_update['und']['0']['value']);
							$fc_item = entity_create('field_collection_item', array('field_name' => 'field_lms_listing_photos'));
							$fc_item->setHostEntity('node', $surviving_photo);
							$fc_wrapper = entity_metadata_wrapper('field_collection_item', $fc_item);
							$fc_wrapper->field_lms_listing_photo->set((array)$file);
							$fc_wrapper->field_lms_listing_photo_update->set(REQUEST_TIME);
							$fc_wrapper->save(TRUE);
						}
					}
				}
			}
		}
		/**
		 * Drupal form API
		 * for merge listing for ducument and video by Harinder Singh Maan on 07/09/2016
		 **/
		if($form_state['values']['documents'] == 1) {
			$duplicate_documents_nid = cbone_listing_documents_count($duplicate_listing->nid, 'document_nid');
			$surviving_documents_nid = cbone_listing_documents_count($surviving_listing->nid, 'document_nid');
			$duplicate_documents = node_load($duplicate_documents_nid);
			$surviving_documents = node_load($surviving_documents_nid);
			if(isset($duplicate_documents->field_lms_listing_documents['und']['0'])) {
				$items = field_get_items('node', $duplicate_documents, 'field_lms_listing_documents');
				if(!empty($items)) {
					foreach ($items as $delta => $item) {
						$listing_document = field_collection_field_get_entity($item);
						if(isset($listing_document->field_lms_listing_document['und']['0'])) {
							$file = $listing_document->field_lms_listing_document['und']['0'];
							$update_time = strtotime($listing_document->field_document_update['und']['0']['value']);
							$fc_item = entity_create('field_collection_item', array('field_name' => 'field_lms_listing_documents'));
							$fc_item->setHostEntity('node', $surviving_documents);
							$fc_wrapper = entity_metadata_wrapper('field_collection_item', $fc_item);
							$fc_wrapper->field_lms_listing_document->set((array)$file);
							$fc_wrapper->field_document_update->set(REQUEST_TIME);
							$fc_wrapper->save(TRUE);
						}
					}
				}
			}
		}
		if($form_state['values']['video'] == 1) {
			$duplicate_video_nid = cbone_listing_video_count($duplicate_listing->nid, 'video_nid');
			$surviving_video_nid = cbone_listing_video_count($surviving_listing->nid, 'video_nid');
			$duplicate_video = node_load($duplicate_video_nid);
			$surviving_video = node_load($surviving_video_nid);
			if(isset($duplicate_video->field_lms_listing_video['und'][0])){
				$duplicate_video_file = $duplicate_video->field_lms_listing_video['und'][0];
				$surviving_video->field_lms_listing_video['und'][0] = $duplicate_video_file;
				
			}
			if(isset($duplicate_video->field_you_tube_url['und'][0])){
				$duplicate_youtube_video_url = $duplicate_video->field_you_tube_url['und'][0];
				$surviving_video->field_you_tube_url['und'][0] = $duplicate_youtube_video_url;
			}
			if(isset($duplicate_video->field_lms_embed_video['und'][0])){
				$duplicate_embed_video_file = $duplicate_video->field_lms_embed_video['und'][0];
				$surviving_video->field_lms_embed_video['und'][0] = $duplicate_embed_video_file;
			}
			node_save($surviving_video);
		}
		
		/*code ended by Harinder Singh Maan on 07/09/2016*/
		node_save($surviving_listing);
		//$duplicate_listing->status = 0;
		//node_save($duplicate_listing);
		node_delete($duplicate_listing->nid);
		drupal_set_message(t('The listings for \''.$surviving_listing->field_lms_listing_address['und']['0']['value'].'\' have been successfully merged.'));
		drupal_goto('listing-merge-selection/'.$auther_user_id);
	}
}
/**
 * Callback function cbone_listing_photo_count()
 * to displayed the listing photos count.
 **/
function cbone_listing_photo_count($nid = NULL, $type = NULL) {
	$photos_count = 0;
	$order_id = db_select("field_data_field_lms_listing_reference", 'lr');
	$order_id->fields('lr', array('entity_id'));
	$order_id->condition('lr.entity_type', 'node', 'LIKE');
	$order_id->condition('lr.bundle', 'lms_photos', 'LIKE');
	$order_id->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$result = $order_id->execute()->fetchField();
	if($result != NULL){
		$photos_id = db_select("field_data_field_lms_listing_photos", 'lp');
		$photos_id->fields('lp');
		$photos_id->condition('lp.entity_type', 'node', 'LIKE');
		$photos_id->condition('lp.bundle', 'lms_photos', 'LIKE');
		$photos_id->condition('lp.entity_id', $result, '=');
		$photos_count = $photos_id->execute()->rowCount();
	}
	if($type == 'photo_nid') {
		return $result;
	}
	else {
		return $photos_count;
	}
}
/**
 * Drupal form API
 * for merge listing for ducument and video by Harinder Singh Maan on 07/09/2016
 **/
function cbone_listing_documents_count($nid = NULL, $type = NULL) {
	$photos_count = 0;
	$order_id = db_select("field_data_field_lms_listing_reference", 'lr');
	$order_id->fields('lr', array('entity_id'));
	$order_id->condition('lr.entity_type', 'node', 'LIKE');
	$order_id->condition('lr.bundle', 'lms_listing_document', 'LIKE');
	$order_id->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$result = $order_id->execute()->fetchField();
	if($result != NULL){
		$documents_id = db_select("field_data_field_lms_listing_documents", 'lp');
		$documents_id->fields('lp');
		$documents_id->condition('lp.entity_type', 'node', 'LIKE');
		$documents_id->condition('lp.bundle', 'lms_listing_document', 'LIKE');
		$documents_id->condition('lp.entity_id', $result, '=');
		$listing_documents_count = $documents_id->execute()->rowCount();
	}
	if($type == 'document_nid') {
		return $result;
	}else {
		return $listing_documents_count;
	}
}
function cbone_listing_video_count($nid = NULL, $type = NULL) {
	$get_all = get_all_listing_attached_recoreds($nid,'All');
	$listing_video_nid = $get_all['lms_video'];

	$listing_video_node_load = node_load($listing_video_nid);
	if(isset($listing_video_node_load->field_lms_listing_video['und']['0'])){
		$listing_video_count = 1;
	}else{
		$listing_video_count = 0;
	}
	
	if($type == 'video_nid') {
		return $listing_video_nid;
	}else {
		return $listing_video_count;
	}
}
/*code ended by Harinder Singh Maan on 07/09/2016*/