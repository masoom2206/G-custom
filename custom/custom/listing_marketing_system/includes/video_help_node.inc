<?php
/** * @file * Service functions */

/** * Drupal form API * to save the product node * of marketing concierge * @return $form */function video_help_node_form($form, &$form_state) {	$form['video_help_node'] = array(		'#type' => 'textfield',		'#title' => t('Enter NID of video help node.'),		'#description' => t('Create a "Basic page" node for Video help and enter nid here.<br>The node data will be displayed in popup after click on help button from LMS video page'),		'#size' => 40,		'#default_value' => variable_get('video_help_node_nid', '0'),		'#required' => TRUE,	);	$form['#validate'][] = 'video_help_node_nid_validate';	$form['actions']['submit'] = array(		'#type' => 'submit',		'#value' => t('Save NID'),		'#required' => TRUE,	);	return $form;
}/** * Drupal form API * submit Daily Quiz Question form */function video_help_node_nid_validate($form, &$form_state) {	$value = $form_state['values']['video_help_node'];	if(!is_numeric($value)){		form_set_error('video_help_node', t('Please enter node nid!'));	}}
/**
 * Drupal form API
 * submit Daily Quiz Question form
 */
function video_help_node_form_submit($form, &$form_state) {	$value = $form_state['values']['video_help_node'];	$name = t('video_help_node_nid');	variable_set($name, $value);	drupal_set_message(t('video help node NID saved successfully.'), 'status');
}