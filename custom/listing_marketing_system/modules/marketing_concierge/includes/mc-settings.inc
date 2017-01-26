<?php
/**
 * @file
 * MC settings Configuration tool
 */

/**
 * Callback function marketing_concierge_settings()
 * to mc settings
 **/
function marketing_concierge_settings(){
	$output = '';
	$title = t('Marketing Concierge Settings');
	$type = 'ul';
	$attributes = array(
		'id' => 'mc-settings',
		'class' => 'mc-settings-list',
	);

	$items = array();
	$form = drupal_get_form('marketing_concierge_mail_list_guideline_form');
	$output .= drupal_render($form);
	$default_url = variable_get('mc_guideline_url', '');
	$items[] = array(
		'data' => l($default_url, $default_url),
		'class' => array('mail-list-guidelines'),
	);
	/*$items[] = array(
		'data' => "URL to mail list guidelines: [".l('http://www.corefact.com/print/info/mailing_list_file_format', 'http://www.corefact.com/print/info/mailing_list_file_format')."]",
		'class' => array('mail-list-guidelines'),
	);*/
	$output .= theme_item_list(array('items' => $items, 'title' => $title, 'type' => $type, 'attributes' => $attributes));
	return $output;
}
/**
 * Form API to select default print vendor
 * to mc print vendor
 **/
function marketing_concierge_mail_list_guideline_form($form, &$form_state){
	$default_url = variable_get('mc_guideline_url', '');
	$form['block'] = array(
		'#type' => 'fieldset',
		'#title' => t('Guideline URL configuration'),
		'#weight' => 3,
		'#collapsible' => TRUE,
		'#collapsed' => TRUE,
		'#tree' => TRUE,
	);
	$form['block']['guideline_url'] = array(
		'#type' => 'textfield',
		'#title' => t('Mail list guideline URL'),
		'#default_value' => $default_url,
		'#size' => 60,
		'#required' => TRUE,
		'#description' => t('Enter mail list guideline URL.'),
	);
	$form['block']['actions']['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Save URL'),
		'#required' => TRUE,
	);
	return $form;	
}

/**
 * Form API to add the mc notifications message
 **/
function marketing_concierge_mail_list_guideline_form_submit($form, &$form_state){
	$value = $form_state['values']['block']['guideline_url'];
	$name = t('mc_guideline_url');
	variable_set($name, $value);
	drupal_set_message(t('Default guideline URL saved successfully.'), 'status');
}

/**
 * Form API to select default print vendor
 * to mc print vendor
 **/
function marketing_concierge_select_vendor_form($form, &$form_state){
	$vendors = array();
	$query = db_select('node', 'n')
		->fields('n', array('nid', 'title'))
		->condition('type', 'vendor', '=')
		->condition('status', 1, '=');
	$result = $query->execute();
	foreach($result as $vendor) {
		$vendors[$vendor->nid] = $vendor->title;
	}
	$default_vendor = variable_get('mc_print_vendor', '');
	$default_vendor_name = isset($vendors[$default_vendor]) ? $vendors[$default_vendor] : 'None';
	$form['default_vendor'] = array(
	  '#markup' => '<div class="default-selected-vender"><p>Currently you have selected default print vendor as:</p><h1>'.$default_vendor_name.'</h1></div>',
	);
	$form['vendor'] = array(
		'#type' => 'select',
		'#title' => t('Select Vendor'),
		'#default_value' => $default_vendor,
		'#options' => $vendors,
		'#required' => TRUE,
		'#description' => t('Select print vendor.'),
	);
	$form['actions']['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Save Vendor'),
		'#required' => TRUE,
	);
	return $form;	
}

/**
 * Form API to add the mc notifications message
 **/
function marketing_concierge_select_vendor_form_submit($form, &$form_state){
	$value = $form_state['values']['vendor'];
	$name = t('mc_print_vendor');
	variable_set($name, $value);
	drupal_set_message(t('Default print vendor saved successfully.'), 'status');
}

/**
 * Callback function mc_order_unit_cost()
 * to saved order unit cost
 **/
function mc_order_unit_cost(){
	$output = 'Order Unit Cost Setting';
	$form = drupal_get_form('mc_order_unit_cost_form');
	$output .= drupal_render($form);
	$serialize_value = variable_get('mc_order_unit_cost', '');
	$unserialize_value = unserialize($serialize_value);
	$header = array('&nbsp;', 'Just Listed', 'Just Sold', 'Pro Brochures');
	$rows = array();
	foreach($unserialize_value as $key => $data) {
		$rows[] = array(
			strtoupper(str_replace("_", " ", $key)),
			$data['just_listed'],
			$data['just_sold'],
			$data['pro_brochures'],
		);
	}
	$output .= theme('table', array('header' => $header, 'rows' => $rows));
	return $output;
}
/**
 * Form API to select default print vendor
 * to mc print vendor
 **/
function mc_order_unit_cost_form($form, &$form_state){
	$serialize_value = variable_get('mc_order_unit_cost', '');;
	$unserialize_value = unserialize($serialize_value);
	$orders = array('premier' => 'Premier', 'platinum' => 'Platinum', 'platinum_plus' => 'Platinum Plus');
	$form['block'] = array(
		'#type' => 'fieldset',
		'#title' => t('Order Unit Cost Setting'),
		'#collapsible' => TRUE,
		'#collapsed' => TRUE,
		'#tree' => TRUE,
	);
	foreach($orders as $key => $order) {
		$form['block'][$key] = array(
			'#type' => 'fieldset',
			'#title' => t($order.' Unit Cost Setting'),
			'#collapsible' => TRUE,
			'#collapsed' => TRUE,
			'#tree' => TRUE,
		);
		$form['block'][$key]['just_listed'] = array(
			'#type' => 'textfield',
			'#title' => t('Just Listed for '.$order),
			'#default_value' => $unserialize_value[$key]['just_listed'],
			'#size' => 60,
			'#field_prefix' => '$',
		);
		$form['block'][$key]['just_sold'] = array(
			'#type' => 'textfield',
			'#title' => t('Just Sold for '.$order),
			'#default_value' => $unserialize_value[$key]['just_sold'],
			'#size' => 60,
			'#field_prefix' => '$',
		);
		$form['block'][$key]['pro_brochures'] = array(
			'#type' => 'textfield',
			'#title' => t('Pro Brochures for '.$order),
			'#default_value' => $unserialize_value[$key]['pro_brochures'],
			'#size' => 60,
			'#field_prefix' => '$',
		);
	}
	$form['block']['actions']['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Save URL'),
		'#required' => TRUE,
	);
	return $form;	
}
/**
 * Form API to add the mc notifications message
 **/
function mc_order_unit_cost_form_submit($form, &$form_state){
	$value = $form_state['values']['block'];
	unset($value['actions']);
	$serialize_value = serialize($value);
	$name = t('mc_order_unit_cost');
	variable_set($name, $serialize_value);
	drupal_set_message(t('Default Unit Cost saved successfully.'), 'status');
}
/**
 * Callback function mc_order_term_condition()
 * to saved order unit cost
 **/
function mc_order_term_condition(){
	$output = '';
	$form = drupal_get_form('mc_order_term_condition_form');
	$output .= drupal_render($form);
	$default_condition = variable_get('mc_order_term_condition', '');
	$output .= "<H1>MC Order Term and Condition</H1>";
	$output .= $default_condition;
	return $output;
}

/**
 * Form API to select default print vendor
 * to mc print vendor
 **/
function mc_order_term_condition_form($form, &$form_state){
	$default_condition = variable_get('mc_order_term_condition', '');;
	$form['block'] = array(
		'#type' => 'fieldset',
		'#title' => t('MC Term and Condition Setting'),
		'#collapsible' => TRUE,
		'#collapsed' => TRUE,
		'#tree' => TRUE,
	);
	$form['block']['condition'] = array(
		'#type' => 'text_format',
		'#title' => '',
		//'#size' => 60,
		'#format' => 'full_html',
		//'#maxlength' => $max_length,
		//'#maxlength_js' => TRUE,
		'#default_value'	=> $default_condition,
	);
	$form['block']['actions']['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Save Term and Condition'),
		'#required' => TRUE,
	);
	return $form;	
}
/**
 * Form API to add the mc notifications message
 **/
function mc_order_term_condition_form_submit($form, &$form_state){
	$value = $form_state['values']['block']['condition']['value'];
	$name = t('mc_order_term_condition');
	variable_set($name, $value);
	drupal_set_message(t('MC order term and condition saved successfully.'), 'status');
}

/**
 * Callback function mc_insertion_order_settings()
 * to saved recipient’s email address
 **/
function mc_insertion_order_settings(){
	$output = '';
	$form = drupal_get_form('mc_insertion_order_settings_form');
	$output .= drupal_render($form);
	$default_recipient = variable_get('mc_insertion_order_recipient_email', '');
	$output .= "<div><b>Notification Recipient Email:</b>&nbsp;&nbsp;$default_recipient</div>";
	$default_subject = variable_get('mc_insertion_order_mail_subject', '');
	$output .= "<div><b>Mail Subject:</b>&nbsp;&nbsp;$default_subject</div>";
	$default_body = variable_get('mc_insertion_order_mail_body', '');
	$output .= "<div><b>Mail Body:</b></div>$default_body<div>";
	return $output;
}
/**
 * Form API to select default print vendor
 * to mc print vendor
 **/
function mc_insertion_order_settings_form($form, &$form_state){
	//$default_vendor = variable_get('mc_print_vendor', '');
	$default_email = variable_get('mc_insertion_order_recipient_email', '');
	$default_subject = variable_get('mc_insertion_order_mail_subject', '');
	$default_body = variable_get('mc_insertion_order_mail_body', '');
	$form['block'] = array(
		'#type' => 'fieldset',
		'#title' => t('Ad Insertion Settings'),
		'#weight' => 3,
		'#collapsible' => TRUE,
		'#collapsed' => TRUE,
		'#tree' => TRUE,
	);
	$form['block']['recipient_email'] = array(
		'#type' => 'textfield',
		'#title' => t('Notification Recipient Email Address'),
		'#default_value' => $default_email,
		'#size' => 60,
	);
	$form['block']['mail_subject'] = array(
		'#type' => 'textfield',
		'#title' => t('Mail Subject'),
		'#default_value' => $default_subject,
		'#size' => 60,
	);
	$form['block']['mail_body'] = array(
		'#type' => 'text_format',
		'#title' => 'Mail Body',
		//'#size' => 60,
		'#format' => 'full_html',
		//'#maxlength' => $max_length,
		//'#maxlength_js' => TRUE,
		'#default_value'	=> $default_body,
	);
		// Token tree display STARTS
	  if (module_exists('token')) {
		$form['block']['token_tree'] = array(
		  '#theme' => 'token_tree',
		  '#token_types' => array('mc_notifications'),
		);
	  }
	  else {
		$form['block']['token_tree'] = array(
		  '#markup' => '<p>' . t('Enable the <a href="@drupal-token">Token module</a> to view the available token browser.', array('@drupal-token' => 'http://drupal.org/project/token')) . '</p>',
		);
	  }
	$form['#validation'][] = 'mc_insertion_order_settings_form_validate';
	 // Token tree display ENDS
	$form['block']['actions']['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Save'),
		'#required' => TRUE,
	);
	return $form;	
}
/**
 * Form API to validate the form
 **/
function mc_insertion_order_settings_form_validate($form, &$form_state){
	$email = trim($form_state['values']['block']['recipient_email']);
	if(!valid_email_address($email)){
		form_set_error('block][recipient_email', t('Insert valid email address.'));
	}
	$subject = trim($form_state['values']['block']['mail_subject']);
	if($subject == ''){
		form_set_error('block][mail_subject', t('Insert mail subject.'));
	}
}
/**
 * Form API to add the mc notifications message
 **/
function mc_insertion_order_settings_form_submit($form, &$form_state){
	$email = $form_state['values']['block']['recipient_email'];
	$name = t('mc_insertion_order_recipient_email');
	variable_set($name, $email);
	$subject = trim($form_state['values']['block']['mail_subject']);
	$name = t('mc_insertion_order_mail_subject');
	variable_set($name, $subject);
	$mail_body = trim($form_state['values']['block']['mail_body']['value']);
	$name = t('mc_insertion_order_mail_body');
	variable_set($name, $mail_body);
	drupal_set_message(t('Default notification recipient email address saved successfully.'), 'status');
}

/**
 * Callback function mc_direct_mail_help()
 * to saved MC Direct mail help text
 **/
function mc_direct_mail_help(){
	$output = '';
	drupal_set_title('MC Direct Mail');
	$form = drupal_get_form('mc_direct_mail_help_form');
	$output .= drupal_render($form);
	$default_help_text = variable_get('mc_direct_mail_help', '');
	$output .= "<H1>MC Direct Mail Help Text</H1><div>MC expanded help text on \"additional items\" screen of MC ordering process:</div>";
	$output .= $default_help_text;
	return $output;
}

/**
 * Form API to select default print vendor
 * to mc print vendor
 **/
function mc_direct_mail_help_form($form, &$form_state){
	$default_help_text = variable_get('mc_direct_mail_help', '');;
	$form['block'] = array(
		'#type' => 'fieldset',
		'#title' => t('MC Direct Mail Help Setting'),
		'#collapsible' => TRUE,
		'#collapsed' => TRUE,
		'#tree' => TRUE,
	);
	$form['block']['help_text'] = array(
		'#type' => 'text_format',
		'#title' => '',
		//'#size' => 60,
		'#format' => 'full_html',
		//'#maxlength' => $max_length,
		//'#maxlength_js' => TRUE,
		'#default_value'	=> $default_help_text,
	);
	$form['block']['actions']['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Save Help Text'),
		'#required' => TRUE,
	);
	return $form;	
}
/**
 * Form API to add the mc notifications message
 **/
function mc_direct_mail_help_form_submit($form, &$form_state){
	$value = $form_state['values']['block']['help_text']['value'];
	$name = t('mc_direct_mail_help');
	variable_set($name, $value);
	drupal_set_message(t('MC direct mail help text saved successfully.'), 'status');
}
