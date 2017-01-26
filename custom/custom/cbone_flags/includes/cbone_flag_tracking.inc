<?php
/**
 * @file
 * Service functions
 */

/**
 * Callback function percent_tracking for admin
 * to percent tracking list.
 **/
function cbone_flag_tracking(){

	$header = array(
		array('data' => t('ID'), 'width'=>'5%'),
		array('data' => t('Parent NID'), 'width'=>'20%'),
		array('data' => t('Child NID'), 'width'=>'25%'),
		array('data' => t('Type'), 'width'=>'10%'),
		array('data' => t('Action'), 'width'=>'10%'),
	);
	$status = (arg(5) == 'on') ? 1 : 0;
	//Select saved percent_tracking
	$query = db_select("cbone_flags_tracking", "ft");
	$query->fields("ft");
	if(isset($_GET['type']) && $_GET['type'] != '') {
		$query->condition("ft.type", $_GET['type'], '=');
	}
	$query->groupBy('ft.pnid');
	$result = $query->execute();
	$table_data = array();
	$s_no = 1;
	while($data = $result->fetchObject()){
		$actions = l(t('Delete'), 'admin/config/cbone-flag/tracking/delete/'.$data->pnid, array('query' => array('destination' => 'admin/config/cbone-flag/tracking')));

		$titles = array();
		$query1 = db_select("cbone_flags_tracking", "ft");
		$query1->fields("ft");
		$query1->condition('ft.pnid', $data->pnid,'=');
		$result1 = $query1->execute();

		foreach($result1 as $data1) {
			$child_entity = node_load($data1->cnid);
			$titles[] = t($child_entity->title.' ('.$data1->cnid.')');			
		}
		
		$child_entity = node_load($data->cnid);
		$ctitle = !empty($titles) ? implode('<br/>', $titles) : 'empty';
		
		$parent_entity = node_load($data->pnid);
		$table_data[] = array(
						$s_no,
						!empty($parent_entity) ? t($parent_entity->title.' ('.$data->pnid.')') : 'empty',
						$ctitle,
						ucwords($data->type),
						$actions
					);
		$s_no = $s_no + 1;
	}
	$build = array();
	$build['percent_complete'] = array(
	'#theme' => 'table',
	'#header' => $header,
	'#rows' => $table_data,
	'#empty' => 'No CB|One flag tracking found !',
	'#prefix' => '<div class="tracking-link"><h1>' . t('CB|One Flag Tracking') . '</h1></div>',
	'#suffix' => '<br />',
	);
	return $build;
}

/**
 * Drupal form API
 * Form add/edit Percent Tracking
 */
function cbone_flag_tracking_form($form, &$form_state, $tracking = NULL){
	$form['parent_node'] = array(
		'#type' => 'textfield',
		'#title' => t('Parent node'),
		'#description' => t('Parent node NID'),
		'#size' => 40,
	);
	$form['tracked_nids'] = array(
		'#type' => 'textfield',
		'#title' => t('Tracked flag node\'s'),
		'#description' => t('Provide tracked flag node\'s with comma seperated!<br/>like:64, 63, 62'),
		'#size' => 40,
		'#required' => TRUE,
	);
	$form['tracking_type'] = array(
		'#type' => 'select',
		'#title' => t('Tracking Type'),
		'#options' => array(
			'none' => t('Select Tracking Type'),
			'listing' => t('Listing'),
			'buyer' => t('Buyer'),
		),
		'#default_value' => 'none',
		'#description' => t('Select Tracking Type'),
		'#required' => TRUE,
	);
	$form['#validate'][] = 'cbone_flag_tracking_form_validate';
	$form['actions']['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Save tracking'),
	);
	return $form;
}
/**
 * Drupal form API
 * validate Percent Tracking form
 */
function cbone_flag_tracking_form_validate($form, &$form_state){
	$parent_node = trim($form_state['values']['parent_node']);
	$tracked_nids = trim($form_state['values']['tracked_nids']);
	$tracked_nids = str_replace(', ', ',', $tracked_nids);
	$tracked_nids = explode(',', $tracked_nids);
	$tracking_type = trim($form_state['values']['tracking_type']);
	if(empty($parent_node)) {
		form_set_error('parent_node', t('Please enter parent NID!'));
	}
	else {
		$node_data = node_load($parent_node);
		if(empty($node_data)) {
			form_set_error('parent_node', t('Parent NID: '.$parent_node.' is not a valid NID!'));
		}
	}
	if(empty($tracked_nids)) {
		form_set_error('tracked_nids', t('Please enter tracking NID\'s!'));
	}
	else {
		foreach($tracked_nids as $tracked_nid) {
			$node_data = node_load($tracked_nid);
			if(empty($node_data)) {
				form_set_error('tracked_nids', t('Child NID: '.$tracked_nid.' is not a valid NID!'));
			}
		}
	}
	if($tracking_type == 'none') {
		form_set_error('tracking_type', t('Select tracking status!'));
	}
}
/**
 * Drupal form API
 * submit Percent Tracking form
 */
function cbone_flag_tracking_form_submit($form, &$form_state) {
	$parent_node = $form_state['values']['parent_node'];
	$tracking_type = $form_state['values']['tracking_type'];
	$tracked_nids = $form_state['values']['tracked_nids'];
	$tracked_nids = str_replace(', ', ',', $tracked_nids);
	$tracked_nids = explode(',', $tracked_nids);
		
	foreach($tracked_nids as $tracked_nid) {
		$pccid = db_insert('cbone_flags_tracking')
		  ->fields(array(
				'pnid' => $parent_node,
				'cnid' => $tracked_nid,
				'type' => $tracking_type,
		  ))
		  ->execute();
	}
	drupal_set_message(t('New tracking has been saved successfully'), $type = 'status');
	$form_state['redirect'] = url('admin/config/cbone-flag/add');
}


/**
 * form API
 * tracking delete confirm form
 */
function cbone_flag_tracking_delete_confirm_form($form, $form_state, $tracking = NULL) { 
  //you can pass variables here if need be
  $form['track_id'] = array(
    '#type' => 'value',
    '#value' => $tracking,
  ); 
  //you can set a redirect if needed
  $form['#redirect'] = 'admin/config/cbone-flag/tracking';
 
  return confirm_form($form,
    t('Are you sure you want to delete the tracking?'), //message title
    isset($_GET['destination']) ? $_GET['destination'] : 'admin/config/cbone-flag/tracking', //redirect if cancelled
    t('Only say yes if you are really sure.'), //message description
    t('Delete Tracking'), //confirm button text
    t('Cancel') //cancel button text
  );  
}
 
/**
 * Submit handler for confirm form
 */
function cbone_flag_tracking_delete_confirm_form_submit($form, &$form_state) {
	//verify that the form was confirmed
	if ($form_state['values']['confirm']) {
		//Do something here
		$track_id = $form_state['values']['track_id'];
		db_delete('cbone_flags_tracking')
		  ->condition("pnid", $track_id, '=')
		  ->execute();
		drupal_set_message('Your tracking has been deleted'); 
	}
}
