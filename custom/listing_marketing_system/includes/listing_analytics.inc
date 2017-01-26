<?php
/**
 * Callback function cbone_listing_website()
 * to displayed the listing website setup
 * @return $output
 **/
function cbone_listing_analytics($nid){
	global $user;
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
	/*$node_counter = db_select("node_counter", 'nc');
	$node_counter->fields('nc');
	$node_counter->condition('nc.nid', $nid, '=');
	$counter = $node_counter->execute()->fetchAll();*/

	
	$today = db_query("SELECT COUNT(id) FROM nodeviewcount WHERE FROM_UNIXTIME(timestamp,'%y-%m-%d') = CURDATE() AND nid = :nid", array(':nid' => $nid))->fetchField();
	$current_week = db_query("SELECT COUNT(id) FROM nodeviewcount WHERE YEARWEEK(FROM_UNIXTIME(timestamp,'%y-%m-%d'), 1) = YEARWEEK(CURDATE(), 1) AND nid = :nid", array(':nid' => $nid))->fetchField();
	$current_month = db_query("SELECT COUNT(id) FROM nodeviewcount WHERE FROM_UNIXTIME(timestamp,'%m') = EXTRACT(MONTH FROM CURDATE()) AND nid = :nid", array(':nid' => $nid))->fetchField();
	$current_year = db_query("SELECT COUNT(id) FROM nodeviewcount WHERE FROM_UNIXTIME(timestamp,'%Y') = EXTRACT(YEAR FROM CURDATE()) AND nid = :nid", array(':nid' => $nid))->fetchField();
	
	$data = array();
	$mon_view_count = '';
	for($x = 01; $x <= 12; $x++) {
		$monthName = date('M', mktime(0, 0, 0, $x, 10));
		if($x <= 9) {
			$x = '0'.$x;
		}
		$mon_count = db_query("SELECT COUNT(id) FROM nodeviewcount WHERE FROM_UNIXTIME(timestamp,'%m') = :mon AND nid = :nid", array(':mon' => "$x", ':nid' => $nid))->fetchField();
		if($x == 12) {
			$mon_view_count .= $mon_count;
		}
		else {
			$mon_view_count .= $mon_count.', ';
		}
		$data[] = array($x, $mon_count);
	}
  
	$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
		'listing_uid' => $listing_node->uid,
		'daycount' => $today,
		'weekcount' => $current_week,
		'monthcount' => $current_month,
		'yearcount' => $current_year,
		'mon_view_count' => $mon_view_count,
	);
	$output = theme('listing_analytics', array('var_name' => $variables));
	return $output;

}
