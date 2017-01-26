<?php
/**
 * @file
 * Service functions
 */
 
/**
 * Callabck function mc_lms_tool_matrix()
 * to displayed the lms tool matrix table
 **/
function mc_lms_tool_matrix(){
	drupal_add_library('system', 'drupal.collapse');
	$vid = db_query('SELECT vid FROM taxonomy_vocabulary WHERE name like :name', array(':name' => 'Marketing Concierge Status'))->fetchField();
	$header = array(
		array('data' => t('Update')),
		array('data' => t('Role')),
		array('data' => t('Status')),
		array('data' => t('Details')),
		array('data' => t('Photos')),
		array('data' => t('Documents')),
		array('data' => t('Video')),
		array('data' => t('Website')),
		array('data' => t('Embed')),
		array('data' => t('Email')),
		array('data' => t('Share')),
		array('data' => t('Analytics')),
		array('data' => t('Pro&nbsp;Brochures')),
		array('data' => t('Print&nbsp;and&nbsp;Go')),
		array('data' => t('Post&nbsp;Cards')),
		array('data' => t('Post&nbsp;to&nbsp;Circle')),
		array('data' => t('Client&nbsp;Report')),
	);
	$output = '';
	$query = db_select('mc_lms_tool_matrix', 'tm');
	$query->fields('tm', array('user_role'));
	$query->groupBy('tm.user_role');
	$query->orderBy('tm.user_role', 'DESC');
	$result = $query->execute();
	//print "<pre>";print_r($result);exit;
	foreach($result as $user_roles) {
		$query = db_select('mc_lms_tool_matrix', 'tm');
		$query->join('taxonomy_term_data', 't', 't.tid = tm.mc_status');
		$query->join('taxonomy_term_hierarchy', 'th', 't.tid = th.tid');
		$query->fields('tm');
		$query->condition('tm.user_role', $user_roles->user_role, '=');
		$query->condition('th.parent', 0, '=');
		$query->orderBy('t.weight', 'ASC');
		$result_row = $query->execute();
		$rows = array();
		$role_name = '';
		$role_names = array();
		$rids = explode(",", $user_roles->user_role);
		foreach($rids as $rid) {
			$role = user_role_load($rid);
			$role_names[] = $role->name;
		}
		/*$result_data = array();
		foreach($result_row as $data) {
			$result_data[] = $data;
			$parent_tid = $data->mc_status;
			$parents = taxonomy_get_tree($vid, $parent_tid, $max_depth = 1);			
			if(!empty($parents)) {
				foreach($parents as $parent){					
					$query = db_select('mc_lms_tool_matrix', 'tm');
					$query->fields('tm');
					$query->condition('tm.user_role', $user_roles->user_role, '=');
					$query->condition('tm.mc_status', $parent->tid, '=');
					$children = $query->execute()->fetchObject();
					$result_data[] = $children;
				}
			}
		}*/
		
		$role_name = implode(' / ', $role_names);
		$rows[] = array('data' => array(
					array('data' => ''),
					array('data' => '<h4>'.$role_name.'</h4>', 'colspan' => 16, 'class' => array('title-role-name'))
					)
			);
		foreach($result_row as $data) {
			if($data->mc_status == 0) {
				$status = 'No&nbsp;MC&nbsp;Order';
			}
			else {
				$term = taxonomy_term_load($data->mc_status);
				$status = str_replace(" ", "&nbsp;", $term->name);
			}
			$rows[] = array(
				l('Edit', '/admin/config/mc/add/lms-tool-matrix', array('query' => array('id' => $data->id, 'destination' => 'admin/config/mc/lms-tool-matrix'))).'&nbsp;|&nbsp;'.l('Delete', '/admin/config/mc/lms-tool-matrix/delete/'.$data->id, array('query' => array('destination' => 'admin/config/mc/lms-tool-matrix'))),
				'',
				$status,
				tool_matrix_status($data->details),
				tool_matrix_status($data->photos),
				tool_matrix_status($data->documents),
				tool_matrix_status($data->video),
				tool_matrix_status($data->website),
				tool_matrix_status($data->embed),
				tool_matrix_status($data->email),
				tool_matrix_status($data->share),
				tool_matrix_status($data->analytics),
				tool_matrix_status($data->pro_brochures),
				tool_matrix_status($data->print_and_go),
				tool_matrix_status($data->post_cards),
				tool_matrix_status($data->post_to_circle),
				tool_matrix_status($data->client_report),
			);
			$parent_tid = $data->mc_status;
			$parents = taxonomy_get_tree($vid, $parent_tid, $max_depth = 1);			
			if(!empty($parents)) {
				foreach($parents as $parent){					
					$query = db_select('mc_lms_tool_matrix', 'tm');
					$query->fields('tm');
					$query->condition('tm.user_role', $user_roles->user_role, '=');
					$query->condition('tm.mc_status', $parent->tid, '=');
					$children = $query->execute()->fetchObject();
					//$result_data[] = $children;
					if($children->mc_status == 0) {
						$status = '<span class="child-term">No&nbsp;MC&nbsp;Order</span>';
					}
					else {
						$term = taxonomy_term_load($children->mc_status);
						$status = '<span class="child-term">'.str_replace(" ", "&nbsp;", $term->name).'</span>';
					}
					$rows[] = array(
						l('Edit', '/admin/config/mc/add/lms-tool-matrix', array('query' => array('id' => $children->id, 'destination' => 'admin/config/mc/lms-tool-matrix'))).'&nbsp;'.l('Delete', '/admin/config/mc/lms-tool-matrix/delete/'.$children->id, array('query' => array('destination' => 'admin/config/mc/lms-tool-matrix'))),
						'',
						$status,
						tool_matrix_status($children->details),
						tool_matrix_status($children->photos),
						tool_matrix_status($children->documents),
						tool_matrix_status($children->video),
						tool_matrix_status($children->website),
						tool_matrix_status($children->embed),
						tool_matrix_status($children->email),
						tool_matrix_status($children->share),
						tool_matrix_status($children->analytics),
						tool_matrix_status($children->pro_brochures),
						tool_matrix_status($children->print_and_go),
						tool_matrix_status($children->post_cards),
						tool_matrix_status($children->post_to_circle),
						tool_matrix_status($children->client_report),
					);
				}
			}
		}
		$table = theme('table',
			array(
				'header' => $header,
				'rows'=> $rows,
				'attributes' => array('class' => array('mc-lms-tool-matrix')),
				'sticky' => TRUE,
				'empty' => 'No data found!',
				)
			);
		$fieldset = array( 
			'#title' => $role_name,
			'#children' => $table, 
			'#collapsible' => true, 
			'#collapsed' => true, 
			'#attributes' => array( 
				'class' => array('collapsible', 'collapsed')
			),
		); 
		$output .= theme('fieldset', array('element' => $fieldset));
	}
	return $output;
}
 
/**
 * Drupal form API
 * to save LMS Tool Matrix
 * for validate the LMS Tool button
 * @return $form
 */
function add_mc_lms_tool_matrix_form($form, &$form_state) {
	$default_user_role = array(1);
	$default_mc_status = 0;
	$result_row = array();
	$user_role_disabled = FALSE;
	$mc_status_disabled = FALSE;
	if(isset($_GET['id']) && $_GET['id'] != '' && is_numeric($_GET['id'])) {
		drupal_set_title('Update LMS Tool matrix');
		$query = db_select('mc_lms_tool_matrix', 'tm');
		$query->fields('tm');
		$query->condition('tm.id', $_GET['id'], '=');
		$result_row = $query->execute()->fetchAssoc();
		$default_user_role = explode(",", $result_row['user_role']);
		$default_mc_status = $result_row['mc_status'];
		
		//print "<pre>";print_r($result_row);
		//print "<pre>";print_r($default_user_role);exit;
		$form['id'] = array(
			'#type' => 'hidden',
			'#value' => $_GET['id'],
		);
		$user_role_disabled = TRUE;
		$mc_status_disabled = TRUE;
	}
	$roles = user_roles();
	$form['user_role'] = array(
		'#type' => 'select',
		'#title' => t('Select User Role'),
		'#options' => $roles,
		'#default_value' => $default_user_role,
		'#multiple' => TRUE,
		'#disabled' => $user_role_disabled,
		'#description' => t('Select user role to set <em>Yes/No</em> for buttons.'),
	);
	$vid = db_query('SELECT vid FROM taxonomy_vocabulary WHERE name like :name', array(':name' => 'Marketing Concierge Status'))->fetchField();
	$terms = taxonomy_get_tree($vid);
	//print "<pre>";print_r($terms);exit;
	$term_options = array(0 => 'No MC Order');
	foreach($terms as $key => $term) {
		$term_options[$term->tid] = $term->name;
	}
	$form['mc_status'] = array(
		'#type' => 'select',
		'#title' => t('Select MC Status'),
		'#options' => $term_options,
		'#default_value' => $default_mc_status,
		'#disabled' => $mc_status_disabled,
		'#description' => t('Select Marketing Concierge Commerce Order Status.'),
	);
	$buttons = array('Details', 'Photos', 'Documents', 'Video', 'Website', 'Embed', 'Email', 'Share', 'Analytics', 'Pro Brochures', 'Print and Go', 'Post Cards', 'Post to Circle', 'Client Report');
	foreach($buttons as $button) {
		$title = $button;
		$button_rep = str_replace(" ", "_", strtolower($button));
		$field = 'select_'.$button_rep;
		$default_value = 0;
		if(!empty($result_row)) {
			$default_value = $result_row[$button_rep];
		}
		$form['buttons'][$field] = array(
			'#type' => 'radios',
			'#title' => $title,
			'#options' => array(
					0 => t('No'),
					1 => t('Yes'),
					2 => t('Skip'),
				),
			'#default_value' => $default_value,
			'#description' => t('Set "'.$title.'" to <em>Yes</em> if you would like to active this button to selected user role.'),
		);
	}	
	//$form['#validate'][] = 'agent_download_notification_form_validate';
	if(isset($_GET['id']) && $_GET['id'] != '' && is_numeric($_GET['id'])) {
		$form['actions']['submit'] = array(
			'#type' => 'submit',
			'#value' => t('Update Matrix'),
			'#required' => TRUE,
		);
		$form['actions']['delete'] = array(
			'#type' => 'submit',
			'#value' => t('Delete Matrix'),
			'#submit' => array('mc_lms_tool_matrix_delete'),
		);
	}
	else {
		$form['actions']['submit'] = array(
			'#type' => 'submit',
			'#value' => t('Save Matrix'),
			'#required' => TRUE,
		);
	}
	//print "<pre>";print_r($form);exit;
	return $form;
}

/**
 * Drupal form API
 * submit LMS Tool Matrix
 */
function add_mc_lms_tool_matrix_form_submit($form, &$form_state) {
	$value = $form_state['values'];
	$user_role = implode(',', $form_state['values']['user_role']);
	//print "<pre>";print_r($value);exit;
	db_merge('mc_lms_tool_matrix')
		  ->key(array('mc_status' => $value['mc_status'], 'user_role' => $user_role))
		  ->fields(array(
				'user_role' => $user_role,
				'mc_status' => $value['mc_status'],
				'details' => $value['select_details'],
				'photos' => $value['select_photos'],
				'documents' => $value['select_documents'],
				'video' => $value['select_video'],
				'website' => $value['select_website'],
				'embed' => $value['select_embed'],
				'email' => $value['select_email'],
				'share' => $value['select_share'],
				'analytics' => $value['select_analytics'],
				'pro_brochures' => $value['select_pro_brochures'],
				'print_and_go' => $value['select_print_and_go'],
				'post_cards' => $value['select_post_cards'],
				'post_to_circle' => $value['select_post_to_circle'],
				'client_report' => $value['select_client_report'],
		  ))
		  ->execute();
	if(isset($value['id'])) {
		drupal_set_message(t('LMS tool matrix updated successfully.'), 'status');
	}
	else {
		drupal_set_message(t('LMS tool matrix added successfully.'), 'status');
	}
}
/**
 * Drupal form API
 * submit LMS Tool Matrix
 */
function mc_lms_tool_matrix_delete($form, &$form_state) {
	$value = $form_state['values'];
	$id = $value['id'];
	$delete_path = "/admin/config/mc/lms-tool-matrix/delete/{$id}";
    $destination = ($_GET['destination']);
    unset($_GET['destination']);
	return drupal_goto($delete_path, array('query' => array('destination' => $destination)));
}
/**
 * form API
 * Notification Message delete confirm form
 */
function mc_lms_tool_matrix_delete_confirm_form($form, $form_state, $id = NULL) { 
	//you can pass variables here if need be
	$form['id'] = array(
		'#type' => 'value',
		'#value' => $id,
	); 
	//you can set a redirect if needed
	$form['#redirect'] = '/admin/config/mc/lms-tool-matrix';

	return confirm_form($form,
		t('Are you sure you wish to delete this LMS Visibility item?'), //message title
		isset($_GET['destination']) ? $_GET['destination'] : 'admin/config/mc/lms-tool-matrix', //redirect if cancelled
		t('Only say yes if you are really sure.'), //message description
		t('Delete Matrix'), //confirm button text
		t('Cancel') //cancel button text
	);  
}
 
/**
 * Submit handler for confirm form
 */
function mc_lms_tool_matrix_delete_confirm_form_submit($form, &$form_state) {
	//verify that the form was confirmed
	$form_state['redirect'] = 'admin/config/mc/lms-tool-matrix';
	if ($form_state['values']['confirm']) {
		//Do something here
		$id = (isset($form_state['values']['id'])) ? $form_state['values']['id'] : arg(5);
		db_delete('mc_lms_tool_matrix')
		  ->condition("id", $id, '=')
		  ->execute();
		drupal_set_message('Your LMS visibility item has been deleted');
	}
}
/**
 * Callback function tool_matrix_status()
 * to return the saved status text.
 **/
function tool_matrix_status($value){
	if($value == 0){
		$output = '<span class="status-no">N</span>';
	}
	else if($value == 1){
		$output = '<span class="status-yes">Y</span>';
	}
	else if($value == 2){
		$output = '<span class="status-skip">S</span>';
	}
	return $output;
}