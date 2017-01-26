<?php
/**
 * @file
 * Service functions
 */

/**
 * Callback function region_filter_content_type for admin
 * to configure the content type for region validation.
 **/
function region_filter_content_type(){
	global $user;
	$output = '';
	$select_form = drupal_get_form('content_type_selection_form');
	$output .= drupal_render($select_form);
	return $output;
}
/**
 * Drupal form API
 * to displayed the content type list
 **/
function content_type_selection_form($form, $form_state) {
	global $user;
	$options = array();
	$default_value = array();
	$types = node_type_get_types();
	foreach($types as $type) {
		$options[$type->type]['content_type'] = $type->name.'<br/>'.$type->description;
		$type_type = str_replace("_", "-", $type->type);
		$options[$type->type]['operations'] = l('manage fields', 'admin/structure/types/manage/'.$type_type.'/fields');
		
		$validate = db_select("region_filter", 'rf');
		$validate->fields('rf', array('validate'));
		$validate->condition('rf.content_type', $type->type, 'LIKE');
		$result = $validate->execute()->fetchField();
		if($result == 1) {
			$default_value[$type->type] = true;
		}
		else {
			$default_value[$type->type] = false;
		}
	}
	$header = array(
		'content_type' => array('data' => t('Content Type Name')),
		'operations' => array('data' => t('Operations')),
	);
	$per_page = 10;
	// Initialize the pager
	$current_page = pager_default_initialize(count($options), $per_page);
	// Split your list into page sized chunks
	$chunks = array_chunk($options, $per_page, TRUE);

	$form['wrapper'] = array(
		'#markup' => '<h2>Select content type for region validation.</h2>',
	);
	$form['refion_content_type'] = array(
		'#type' => 'tableselect',
		'#header' => $header,
		'#options' => isset($chunks[$current_page]) ? $chunks[$current_page] :  $chunks,
		'#empty' => t('No content type available.'),
		'#default_value' => $default_value,
	);
	$form['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Save'),
	);
	$form['pager'] = array('#markup' => theme('pager', array('quantity' => 3)));
	return $form;
}
/**
 * Drupal form API
 * to save the content type name for validation
 **/
function content_type_selection_form_submit($form, &$form_state){
	foreach($form_state['values']['refion_content_type'] as $type => $refion_content_type) {
		if(!empty($refion_content_type)) {
			db_merge('region_filter')
				->key(array('content_type' => $type))
				->fields(array(
					'content_type' => $type,
					'validate' => 1,
				))
			->execute();
		}
		else {
			db_merge('region_filter')
				->key(array('content_type' => $type))
				->fields(array(
					'content_type' => $type,
					'validate' => 0,
				))
			->execute();
		}
	}
	drupal_set_message("Content type saved successfully.");
}
