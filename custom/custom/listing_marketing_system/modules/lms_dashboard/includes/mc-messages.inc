<?php
/**
 * @file
 * MC Notifications Configuration tool
 */

/**
 * Callback function cbone_office_dashboard_notifications()
 * to displayed mc notification message list
 **/
function cbone_office_dashboard_notifications(){
	$sort = '';
	if(isset($_POST['sort'])) {
		$sort = $_POST['sort'];
		$office_id = $_POST['office_id'];
	}
	global $user;
	$user_detail = user_load($user->uid);
	if(!isset($_POST['office_id'])) {
		$office_nid = get_office_group_nid();
		if($office_nid != '' && is_numeric($office_nid)) {
			$office_node_detail = node_load($office_nid);
			$office_id = $office_node_detail->field_office_id['und']['0']['value'];
		}
		else {
			$office_id = isset($user_detail->field_member_office['und']['0']['value']) ? $user_detail->field_member_office['und']['0']['value'] : '94002401';
		}
	}
	$output = "";
	$query = db_select('mc_notification_messages', 'nm');
	$query->fields('nm');
	$query->condition('nm.office_id', $office_id, '=');
	if($sort == 'Listing Address') {
		$query->join('field_data_field_lms_listing_address', 'la', 'la.entity_id = nm.lnid');
		$query->orderBy('la.field_lms_listing_address_value', 'ASC');
	}
	else if($sort == 'Sales Associate') {
		$query->join('field_data_field_lms_agent_uid', 'au', 'au.entity_id = nm.lnid');
		$query->join('field_data_field_preferred_name', 'pn', 'pn.entity_id = au.field_lms_agent_uid_uid');
		$query->orderBy('pn.field_preferred_name_value', 'ASC');
	}
	else if($sort == 'Status') {
		$query->orderBy('nm.mc_status', 'ASC');
	}
	else {
		$query->orderBy('created', 'DESC');
	}
	$results = $query->execute()->fetchAll();
	$form = drupal_get_form('cbone_dashboard_message_filter_form');
	$variables = array(
		'results' => $results,
		'form' => $form,
		'sort' => $sort,
		'office_id' => $office_id,
	);
	//$output = drupal_render($form);
	$output = theme('mc_messages', array('var_name' => $variables));
	if(isset($_POST['sort'])) {
		print $output;
	}
	else {
		return $output;
	}
}

/**
 * Callback function cbone_office_dashboard_notifications_message()
 * to displayed mc notification message after click on list
 **/
function cbone_office_dashboard_notifications_message(){
	$output = array();
	if(isset($_POST['id'])){
		$id = $_POST['id'];
		$office_id = $_POST['office_id'];
		cbone_read_dashboard_notifications_message($id);
		$query = db_select('mc_notification_messages', 'nm');
		$query->fields('nm');
		$query->condition('nm.id', $id, '=');
		$results = $query->execute()->fetchAssoc();
		$output['id'] = $results['id'];
		$output['date'] = date("m-d-Y", $results['created']);
		$output['subject'] = $results['notification_title'];
		$output['message'] = $results['notification_message'];
		$output['message_count'] = user_office_message_count($office_id);
	}
	drupal_json_output($output);
}

/**
 * Callback function cbone_delete_dashboard_notifications_message()
 * to delete mc notification message after click on delete link
 **/
function cbone_delete_dashboard_notifications_message(){
	if(isset($_POST['id'])){
		$id = $_POST['id'];
		$num_deleted = db_delete('mc_notification_messages')
		  ->condition('id', $id)
		  ->execute();
	}
	$output = array('done');
	drupal_json_output($output);
}
/**
 * Form API for dashboard message
 **/
function cbone_dashboard_message_filter_form($form, &$form_state) {
	$form['message_sort'] = array(
		'#title' => 'Sort By',
		'#type' => 'select',
		'#options' => array(
			'date' => 'Posted Date',
			'address' => 'Listing Address',
			'sales' => 'Sales Associate',
			'status' => 'Status',
		),
	);
	return $form;
}
