<?php
/**
 * @file
 * Service functions
 */

/**
 * Callback function percent_tracking for admin
 * to percent tracking list.
 **/
function percent_tracking(){

	$header = array(
		array('data' => t('ID'), 'width'=>'5%'),
		array('data' => t('Tracking Name'), 'width'=>'25%'),
		array('data' => t('Parent NID'), 'width'=>'20%'),
		array('data' => t('Count'), 'width'=>'5%'),
		array('data' => t('Tracked NIDs'), 'width'=>'25%'),
		array('data' => t('Tracking Status'), 'width'=>'10%'),
		array('data' => t('Action'), 'width'=>'10%'),
	);
	$status = (arg(5) == 'on') ? 1 : 0;
	//Select saved percent_tracking
	$query = db_select("percent_complete", "pc");
	$query->join('percent_tracking', 'pt', 'pt.pcid = pc.pcid');
	$query->fields("pc");
	$query->condition("pc.parent_entity_id", '0', '<>');
	$query->condition("pt.tracking_status", $status, '=');
	$result = $query->execute();
	$table_data = array();
	$s_no = 1;
	while($data = $result->fetchObject()){
		$actions = l(t('Edit'), 'admin/config/pcm/percent/tracking/edit/'.$data->pcid).' | '.l(t('Delete'), 'admin/config/pcm/percent/tracking/delete/'.$data->pcid, array('query' => array('destination' => 'admin/config/pcm/percent/tracking/on')));

		$query1 = db_select("percent_complete_child", "pcc");
		$query1->fields("pcc", array('child_entity_id'));
		$query1->condition("pcid", $data->pcid, '=');
		$result1 = $query1->execute();

		$query2 = db_select("percent_tracking", "pt");
		$query2->fields("pt", array('tracking_status'));
		$query2->condition("pcid", $data->pcid, '=');
		$result2 = $query2->execute()->fetchField();
		if($result2 == NULL) {
			$tracking_status = 'On';
		}
		elseif($result2 == 0) {
			$tracking_status = 'Off';
		}
		else {
			$tracking_status = 'On';
		}

		//$nids = array();
		$titles = array();
		foreach($result1 as $data1) {
			if($data1->child_entity_id != 0){
				$child_entity = node_load($data1->child_entity_id);
				//$nids[] = $data1->child_entity_id;
				$titles[] = t($child_entity->title.' ('.$data1->child_entity_id.')');
			}
		}
		$child_entities = !empty($titles) ? implode('<br/>', $titles) : 'empty';
		$parent_entity = node_load($data->parent_entity_id);
		$table_data[] = array(
						$s_no,
						ucwords(t($parent_entity->title)).' section Detail pages',						
						!empty($parent_entity) ? t($parent_entity->title.' ('.$data->parent_entity_id.')') : 'empty',
						$data->child_count,
						$child_entities,
						$tracking_status,
						$actions
					);
		$s_no = $s_no + 1;
	}
	$build = array();
	$build['percent_complete'] = array(
	'#theme' => 'table',
	'#header' => $header,
	'#rows' => $table_data,
	'#empty' => 'No percent tracking found !',
	'#prefix' => '<div class="tracking-link"><h1>' . t('Percent Meter Tracking') . '</h1><br/><span>'.l(t('Add New Tracking'), 'admin/config/pcm/percent/tracking/add').'</span> | <span>'.l(t('On Tracking'), 'admin/config/pcm/percent/tracking/on').'</span> | <span>'.l(t('Off Tracking'), 'admin/config/pcm/percent/tracking/off').'</span></div>',
	'#suffix' => '<br />',
	);
	return $build;
}

/**
 * Drupal form API
 * Form add/edit Percent Tracking
 */
function percent_tracking_form($form, &$form_state, $tracking = NULL){
	$parent_node = '';
	$tracked_nids = '';
	$disabled = FALSE;
	$summary_tracking = 'none';
	$tracking_name = '';
	$submit_value = t('Save tracking');
	if ($tracking) {
		$query = db_select("percent_complete", "pc");
		$query->join('percent_tracking', 'pt', 'pt.pcid = pc.pcid');
		$query->fields("pc", array('parent_entity_id'));
		$query->fields("pt", array('tracking_name', 'tracking_status'));
		$query->condition("pc.pcid", $tracking, '=');
		$result = $query->execute()->fetchAll();
		$parent_node = $result[0]->parent_entity_id;
		
		$summary_tracking = $result[0]->tracking_status;
		$tracking_name = $result[0]->tracking_name;

		$query1 = db_select("percent_complete_child", "pcc");
		$query1->fields("pcc", array('child_entity_id'));
		$query1->condition("pcid", $tracking, '=');
		$result1 = $query1->execute();
		$nids = array();
		foreach($result1 as $data1) {
			if($data1->child_entity_id != 0){
				$child_entity = node_load($data1->child_entity_id);
				$nids[] = $data1->child_entity_id;
			}
		}
		$tracked_nids = implode(', ', $nids);
		$disabled = TRUE;
		$submit_value = t('Update tracking');
	}
	$form['tracking_id'] = array(
		'#type' => 'hidden',
		'#value' => $tracking,
	);
	$form['parent_node'] = array(
		'#type' => 'textfield',
		'#title' => t('Parent node'),
		'#description' => t('Parent node NID'),
		'#default_value' => $parent_node,
		'#disabled' => $disabled,
		'#size' => 40,
	);
	$form['tracking_name'] = array(
		'#type' => 'textfield',
		'#title' => t('Tracking Name'),
		'#description' => t('Name of the tracking'),
		'#default_value' => $tracking_name,
		'#size' => 40,
	);
	$form['tracked_nids'] = array(
		'#type' => 'textfield',
		'#title' => t('Tracked flag node\'s'),
		'#description' => t('Provide tracked flag node\'s with comma seperated!<br/>like:64, 63, 62'),
		'#default_value' => $tracked_nids,
		'#disabled' => $disabled,
		'#size' => 40,
		'#required' => TRUE,
	);
	$form['tracking_status'] = array(
		'#type' => 'select',
		'#title' => t('Tracking Status'),
		'#options' => array(
			'none' => t('Select Tracking Status'),
			0 => t('Off'),
			1 => t('On'),
		),
		'#description' => t('Select tracking Status'),
		'#default_value' => $summary_tracking,
		'#required' => TRUE,
	);
	$form['#validate'][] = 'percent_tracking_form_validate';
	$form['actions']['submit'] = array(
		'#type' => 'submit',
		'#value' => $submit_value,
	);
	if ($tracking) {
		$form['actions']['delete'] = array(
			'#type' => 'submit',
			'#value' => t('Delete tracking'),
		);
	}
	return $form;
}
/**
 * Drupal form API
 * validate Percent Tracking form
 */
function percent_tracking_form_validate($form, &$form_state){
	$parent_node = trim($form_state['values']['parent_node']);
	$tracked_nids = trim($form_state['values']['tracked_nids']);
	$tracked_nids = str_replace(', ', ',', $tracked_nids);
	$tracked_nids = explode(',', $tracked_nids);
	$tracking_status = trim($form_state['values']['tracking_status']);
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
	if($tracking_status == 'none') {
		form_set_error('tracking_status', t('Select tracking status!'));
	}
}
/**
 * Drupal form API
 * submit Percent Tracking form
 */
function percent_tracking_form_submit($form, &$form_state) {
	$tracking_id = $form_state['values']['tracking_id'];
	if($form_state['values']['op'] == 'Delete tracking') {
		drupal_goto('admin/config/pcm/percent/tracking/delete/'.$tracking_id, array('query' => array('destination' => 'admin/config/pcm/percent/tracking/on')));
	}
	else {
		$tracking_id = $form_state['values']['tracking_id'];
		$parent_node = $form_state['values']['parent_node'];
		$tracking_status = $form_state['values']['tracking_status'];
		$tracking_name = $form_state['values']['tracking_name'];
		$tracked_nids = $form_state['values']['tracked_nids'];
		$tracked_nids = str_replace(', ', ',', $tracked_nids);
		$tracked_nids = explode(',', $tracked_nids);
		$child_count = count($tracked_nids);
		
		$query = db_select("taxonomy_index", "ti");
		$query->fields("ti", array('tid'));
		$query->condition("nid", $parent_node, '=');
		$parent_tid = $query->execute()->fetchField();
		$parent_tid = !empty($parent_tid) ? $parent_tid : '0';

		if($tracking_id != NULL) {
			db_merge('percent_tracking')
			  ->key(array('pcid' => $tracking_id))
			  ->fields(array(
					'pcid' => $tracking_id,
					'tracking_name' => $tracking_name,
					'tracking_status' => $tracking_status,
			  ))
			  ->execute();
			drupal_set_message(t('Tracking status updated successfully'), $type = 'status');
			$form_state['redirect'] = url('admin/config/pcm/percent/tracking/on');
		}
		else {
			$pcid = db_insert('percent_complete')
			  ->fields(array(
					'parent_tid' => $parent_tid,
					'parent_entity_id' => $parent_node,
					'child_count' => $child_count,
			  ))
			  ->execute();
			if($pcid) {
				foreach($tracked_nids as $tracked_nid) {
					$query = db_select("taxonomy_index", "ti");
					$query->fields("ti", array('tid'));
					$query->condition("nid", $tracked_nid, '=');
					$child_tid = $query->execute()->fetchField();
					$child_tid = !empty($child_tid) ? $child_tid : '0';
					
					$pccid = db_insert('percent_complete_child')
					  ->fields(array(
							'pcid' => $pcid,
							'child_tid' => $child_tid,
							'child_entity_id' => $tracked_nid,
					  ))
					  ->execute();
				}
			}
			db_insert('percent_tracking')
			  ->fields(array(
					'pcid' => $pcid,
					'tracking_name' => $tracking_name,
					'tracking_status' => $tracking_status,
			  ))
			  ->execute();
			drupal_set_message(t('New tracking status has been saved successfully'), $type = 'status');
			$form_state['redirect'] = url('admin/config/pcm/percent/tracking/on');
		}
	}
}


/**
 * form API
 * tracking delete confirm form
 */
function percent_tracking_delete_confirm_form($form, $form_state, $tracking = NULL) { 
  //you can pass variables here if need be
  $form['track_id'] = array(
    '#type' => 'value',
    '#value' => $tracking,
  ); 
  //you can set a redirect if needed
  $form['#redirect'] = 'admin/config/pcm/percent/tracking/on';
 
  return confirm_form($form,
    t('Are you sure you want to delete the tracking?'), //message title
    isset($_GET['destination']) ? $_GET['destination'] : 'admin/config/pcm/percent/tracking/on', //redirect if cancelled
    t('Only say yes if you are really sure.'), //message description
    t('Delete Tracking'), //confirm button text
    t('Cancel') //cancel button text
  );  
}
 
/**
 * Submit handler for confirm form
 */
function percent_tracking_delete_confirm_form_submit($form, &$form_state) {
	//verify that the form was confirmed
	if ($form_state['values']['confirm']) {
		//Do something here
		$track_id = $form_state['values']['track_id'];
		db_delete('percent_complete')
		  ->condition("pcid", $track_id, '=')
		  ->execute();
		db_delete('percent_complete_child')
		  ->condition("pcid", $track_id, '=')
		  ->execute();
		db_delete('percent_tracking')
		  ->condition("pcid", $track_id, '=')
		  ->execute();		  
		drupal_set_message('Your tracking has been deleted'); 
	}
}
