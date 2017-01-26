<?php
/****
****** Callback to post to circle page
****/
function post_to_circle($nid){

	global $user, $base_url;
	$url =url($base_url.'/create/circle', array('query' => drupal_get_destination()));

	$query=db_select('node', 'n')
		->fields('n', array('nid'))
		->condition('n.type', 'circle', '=')
		->condition('n.uid', $user->uid, '=');
	$result=$query->execute()->fetchAll();
	if(empty($result) ){
		drupal_set_message(t('You currently do not have any Circles that you are authorized to post to. Please use the this form to create a new Circle. After you create the Circle you will be redirected to create your post.'));
		drupal_goto($url);
	}
	else{
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
			
		$variables = array(
			'listing_address' => $listing_address,
			'listing_nid' => $nid,
		);
		$output = theme('post_to_circle', array('var_name' => $variables));
		return $output;
	}
}