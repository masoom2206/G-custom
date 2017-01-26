<?php
/**
 * @file
 * Service functions
 */

/**
 * Drupal form API
 * to save the Agent notification message
 * for download request
 * @return $form
 */
function agent_download_notification_form($form, &$form_state) {
	$form['agent_notification'] = array(
		'#type' => 'textarea',
		'#title' => t('Enter message for primary agnet notification.'),
		'#description' => t('Primary Agent an email notification  message of the document download request.'),
		'#default_value' => variable_get('agent_notification_message', '0'),
		'#required' => TRUE,
	);
	$form['#validate'][] = 'agent_download_notification_form_validate';
	$form['actions']['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Save Message'),
		'#required' => TRUE,
	);
	return $form;
}
/**
 * Drupal form API
 * submit Daily Quiz Question form
 */
function agent_download_notification_form_validate($form, &$form_state) {
	$value = $form_state['values']['agent_notification'];
	if($value == ''){
		form_set_error('agent_notification', t('Please enter notification message!'));
	}
}
/**
 * Drupal form API
 * submit Daily Quiz Question form
 */
function agent_download_notification_form_submit($form, &$form_state) {
	$value = $form_state['values']['agent_notification'];
	$name = t('agent_notification_message');
	variable_set($name, $value);
	drupal_set_message(t('Primary agent notification message saved successfully.'), 'status');
}