<?php
/**
 * Callback function cbone_marketing_concierge_order()
 * to render the additional order options
 **/
function cbone_marketing_concierge_order($order_id) {
  global $user;
	$order = commerce_cart_order_load($user->uid);
	$data = array();
	$package_data = '';
	foreach ($order->commerce_line_items['und'] as $key => $value) {
	  $line_item_id = $value['line_item_id'];
	  $line_item = commerce_line_item_load($line_item_id);
	  $product_id = $line_item->commerce_product['und']['0']['product_id'];
	  $product = commerce_product_load($product_id);
	  $product_id_array = array(1,2,3,7);
	  if ( in_array($product_id, $product_id_array) ) {
	    $banner = file_create_url($product->field_mc_product_banner['und']['0']['uri']);
	    $logo = file_create_url($product->field_mc_image['und']['0']['uri']);
	    $title = $product->title;
	    $package_data = get_package_configuration_data($product_id);
	  }
	}
	//saved unit cost
	$serialize_value = variable_get('mc_order_unit_cost', '0');
	$unit_cost = unserialize($serialize_value);
	$variables = array(
		'banner' => $banner,
		'logo' => $logo,
		'title' => $title,
		'unit_cost' => $unit_cost,
		'package' => $package_data,
		'datad' => $order
	);
	$output = theme('mc_additional_order', array('var_name' => $variables));
	return $output;
}

function get_package_configuration_data($product_id) {
  $result = '';
  if (isset($product_id)) {
    $id = $form_state['data'];
    $result = db_select('mc_package_configuration', 'n')
      ->fields('n')
      ->condition('product_id', $product_id,'=')
      ->execute()
      ->fetchObject();
  }
  return $result;
}

/**
 * Form API for MC order
 * to add additional fee amount
 **/
function marketing_concierge_additional_order_form($form, &$form_state, $form_id) {
  global $user;
	$order = commerce_cart_order_load($user->uid);
	$order_id = $order->order_id;
	$direct_mail = array();
	$direct_mail[] = isset($order->field_direct_mail_postcards['und']['0']['value']) ? $order->field_direct_mail_postcards['und']['0']['value'] : 'mail_radius_surrounding_property';
	$direct_mail[] = isset($order->field_direct_mail_postcards['und']['1']['value']) ? $order->field_direct_mail_postcards['und']['1']['value'] : '';
	$just_listed = isset($order->field_just_listed_postcard['und']['0']['value']) ? $order->field_just_listed_postcard['und']['0']['value'] : '';
	$just_sold = isset($order->field_just_sold_postcard['und']['0']['value']) ? $order->field_just_sold_postcard['und']['0']['value'] : '';
	$just_pro = isset($order->field_just_pro_brochure['und']['0']['value']) ? $order->field_just_pro_brochure['und']['0']['value'] : '';
	$radius_mail = isset($order->field_mail_to_a_radius['und']['0']['value']) ? $order->field_mail_to_a_radius['und']['0']['value'] : 0;
	
	$form['order_id'] = array(
		'#type' => 'hidden',
		'#value' => $order_id,
	);
	$form['radius_mail'] = array(
		'#type' => 'checkbox',
		'#title' => t('Mail to a radius'),
		'#default_value' => $radius_mail,
	);
	$direct_mail_options = array('mail_radius_surrounding_property' => t('Mail to a radius surrounding the property'), 'upload_own_list' => t('Upload my own list <span><a href="http://www.corefact.com/print/info/mailing_list_file_format" target="_blank">(Click here for guidelines)</a></span>'));
	$form['direct_mail_postcards'] = array(
		'#type' => 'checkboxes',
		'#title' => t('Direct Mail Postcards'),
		'#options' => $direct_mail_options,
		'#default_value' => $direct_mail,
	);
	$form['direct_mail_upload'] = array(
		'#markup' => '<div class="direct-mail-file"><a href="/upload/direct-mail-list/'.$order_id.'" id="direct-mail-upload" rel="modal-node-popup">Upload</a></div>',
	);
	$form['listed_postcards'] = array(
		'#type' => 'textfield', 
		'#title' => t('Additional Just Listed Postcards bbb'), 
		'#default_value' => $just_listed,
		'#size' => 10, 
		'#attributes' => array('placeholder' => t('(quantity)'), 'class' => array('additional-postcards'), 'subtotal-class' => array('listed-postcards')),
		'#element_validate' => array('element_validate_integer_positive'),
	);
	$form['sold_postcards'] = array(
		'#type' => 'textfield', 
		'#title' => t('Additional Just Sold Postcards'), 
		'#default_value' => $just_sold,
		'#size' => 10, 
		'#attributes' => array('placeholder' => t('(quantity)'), 'class' => array('additional-postcards'), 'subtotal-class' => array('sold-postcards')),
		'#element_validate' => array('element_validate_integer_positive'),
	);
	$form['pro_brochures'] = array(
		'#type' => 'textfield', 
		'#title' => t('Additional Pro Brochures'), 
		'#default_value' => $just_pro,
		'#size' => 10, 
		'#attributes' => array('placeholder' => t('(quantity)'), 'class' => array('additional-postcards'), 'subtotal-class' => array('pro-brochures')),
		'#element_validate' => array('element_validate_integer_positive'),
	);
	$form['#validation'][] = 'marketing_concierge_additional_order_form_validate';
	$form['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Continue'),
		'#prefix' => '<div class="additional-order-submit">',
		'#suffix' => '</div>',
	);
	return $form;
}
/**
 * Form validate API for MC order
 * to check the uploaded file.
 **/
function marketing_concierge_additional_order_form_validate($form, &$form_state){
	$values = $form_state['values'];
	$direct_mail = $values['direct_mail_postcards'];
	$order = commerce_order_load($values['order_id']);
	if(!isset($order->field_just_listed_mail_list['und']['0']['fid']) && $direct_mail['upload_own_list'] != '0') {
		form_set_error('direct_mail_postcards', 'You have not uploaded a mailing list.');
	}
}
/**
 * Form Submit API for MC order
 * to add additional fee amount
 **/
function marketing_concierge_additional_order_form_submit($form, &$form_state){
	global $user;
	$uid = $user->uid;
	$product_titles = array("Premier", "Platinum", "Platinum Plus", "Prime");
	$values = $form_state['values'];
	$order = commerce_order_load($values['order_id']);
	if(!isset($order->field_lms_listing_reference['und']['0']['nid']) && isset($_SESSION['listing_reference_nid'])) {
		$order->field_lms_listing_reference['und']['0']['nid'] = $_SESSION['listing_reference_nid'];
	}
	foreach($order->commerce_line_items['und'] as $line_items) {
		$line_item_id = $line_items['line_item_id'];
		$order_line_item = commerce_line_item_load($line_item_id);
		$product_id = $order_line_item->commerce_product['und']['0']['product_id'];
		$product = commerce_product_load($product_id);
		if (!in_array($product->title, $product_titles)) {
			$order = commerce_cart_order_product_line_item_delete($order, $line_item_id, TRUE);
		}
	}
	$order->field_direct_mail_postcards['und']['0']['value'] = $values['direct_mail_postcards']['mail_radius_surrounding_property'];
	$order->field_direct_mail_postcards['und']['1']['value'] = $values['direct_mail_postcards']['upload_own_list'];
	$order->field_mail_to_a_radius['und']['0']['value'] = $values['radius_mail'];
	if($values['listed_postcards'] != '' && is_numeric($values['listed_postcards'])) {
		$order->field_just_listed_postcard['und']['0']['value'] = $values['listed_postcards'];
		$product = commerce_product_load_by_sku("addl-just-listed-postcards");
		$line_item = commerce_product_line_item_new($product, $values['listed_postcards']);
		$line_item = commerce_cart_product_add($uid, $line_item, FALSE);
	}
	if($values['sold_postcards'] != '' && is_numeric($values['sold_postcards'])) {
		$order->field_just_sold_postcard['und']['0']['value'] = $values['sold_postcards'];
		$product = commerce_product_load_by_sku("addl-just-sold-postcards");
		$line_item = commerce_product_line_item_new($product, $values['sold_postcards']);
		$line_item = commerce_cart_product_add($uid, $line_item, FALSE);
	}
	if($values['pro_brochures'] != '' && is_numeric($values['pro_brochures'])) {
		$order->field_just_pro_brochure['und']['0']['value'] = $values['pro_brochures'];
		$product = commerce_product_load_by_sku("addl-pro-brochures");
		$line_item = commerce_product_line_item_new($product, $values['pro_brochures']);
		$line_item = commerce_cart_product_add($uid, $line_item, FALSE);
	}
	commerce_order_save($order);
	drupal_goto('/checkout/'.$values['order_id']);
}
/**
 * Form API for MC order
 * to add additional fee amount
 **/
function upload_direct_mail_list_form($form, &$form_state, $form_id){
	$order_id = arg(2);
	$order = commerce_order_load($order_id);
	//print "<pre>";print_r($order);exit;
	if(isset($order->field_just_listed_mail_list['und']['0']['fid'])) {
		$listed_file_url = file_create_url($order->field_just_listed_mail_list['und']['0']['uri']);
		$listed_file_name = $order->field_just_listed_mail_list['und']['0']['filename'];
		$listed_fid = $order->field_just_listed_mail_list['und']['0']['fid'];
		$sold_fid = '';
		$sold_file = '';
		if(isset($order->field_just_sold_mail_list['und']['0']['fid'])) {
			$sold_file_url = file_create_url($order->field_just_sold_mail_list['und']['0']['uri']);
			$sold_file_name = $order->field_just_sold_mail_list['und']['0']['filename'];
			$sold_fid = $order->field_just_sold_mail_list['und']['0']['fid'];
			$sold_file = '<li><a href="'.$sold_file_url.'" target="_blank">'.$sold_file_name.'</a></li>';
		}
		$form['upload_page_title'] = array(
			'#markup' => '<div class="upload-page-title">Uploaded Mailing List</div>',
		);
		$form['mail_file'] = array(
			'#markup' => '<div class="uploaded-files">
				<ul>
					<li><a href="'.$listed_file_url.'" target="_blank">'.$listed_file_name.'</a></li>
					'.$sold_file.'
				</ul>
			</div>',
		);
		$form['order_id'] = array(
			'#type' => 'hidden',
			'#value' => $order_id,
		);
		$form['listed_fid'] = array(
			'#type' => 'hidden',
			'#value' => $listed_fid,
		);
		$form['sold_fid'] = array(
			'#type' => 'hidden',
			'#value' => $sold_fid,
		);
		$form['actions']['submit'] = array(
			'#type' => 'submit',
			'#value' => t('Remove Files'),
			'#required' => TRUE,
		);		
	}
	else {
		$form['upload_page_title'] = array(
			'#markup' => '<div class="upload-page-title">Upload Mailing List</div>',
		);
		$form['order_id'] = array(
			'#type' => 'hidden',
			'#value' => $order_id,
		);
		$form['listed_mailing_list'] = array(
		  '#type' => 'plupload',
		  '#title' => t('Just Listed Mailing List'),
		  '#description' => t('Drag photos or select by "Add files".'),
		  '#autoupload' => FALSE,
		  '#autosubmit' => FALSE,
		  '#upload_validators' => array(
			'file_validate_extensions' => array('csv txt xls xlsx'),
		  ),
		  '#plupload_settings' => array(
			'singlefile' => TRUE,
		  ),
		);
		$form['same_listed_list'] = array(
			'#type' => 'checkbox',
			'#title' => t('Also use for Just Sold Mailing List.'),
		);
		$form['sold_mailing_list'] = array(
		  '#type' => 'plupload',
		  '#title' => t('Just Sold Mailing List'),
		  '#description' => t('Drag photos or select by "Add files".'),
		  '#autoupload' => FALSE,
		  '#autosubmit' => FALSE,
		  '#upload_validators' => array(
			'file_validate_extensions' => array('csv txt xls xlsx'),
		  ),
		  '#plupload_settings' => array(
			'singlefile' => TRUE,
		  ),
		);
		$form['actions']['submit'] = array(
			'#type' => 'submit',
			'#value' => t('Save Documents'),
			'#required' => TRUE,
		);
		$form['#validation'][] = 'upload_direct_mail_list_form_validate';
		$form['actions']['cancel'] = array(
			'#type' => 'submit',
			'#value' => t('Cancel'),
			'#required' => TRUE,
		);
	}
	return $form;
}
/**
 * Form Validation API for MC order
 * to validate the file form field
 **/
function upload_direct_mail_list_form_validate($form, &$form_state){
	$values = $form_state['values'];
	$listed_count = count($values['listed_mailing_list']);
	$sold_count = count($values['sold_mailing_list']);
	if($listed_count > 1) {
		form_set_error('listed_mailing_list', 'Kindly select only one file.');
	}
	if($values['same_listed_list'] == 0 && $sold_count > 1) {
		form_set_error('sold_mailing_list', 'Kindly select only one file.');
	}
}
/**
 * Form Submit API for MC order
 * to add additional fee amount
 **/
function upload_direct_mail_list_form_submit($form, &$form_state){
	global $user;
	$values = $form_state['values'];
	//print "<pre>";print_r($values);exit;
	if($values['op'] == 'Remove Files'){
		$order_id = $values['order_id'];
		$order = commerce_order_load($order_id);
		$listed_fid = $values['listed_fid'];
		$file = file_load($listed_fid);
		file_delete($file);
		unset($order->field_just_listed_mail_list['und']);
		if($values['sold_fid'] != '') {
			$sold_fid = $values['sold_fid'];
			$file = file_load($sold_fid);
			file_delete($file);
			unset($order->field_just_sold_mail_list['und']);
		}
		commerce_order_save($order);
		drupal_set_message('Files deleted successfully!');
	}
	else {
		$order_id = $values['order_id'];
		$order = commerce_order_load($order_id);
		if(isset($values['listed_mailing_list'][0])) {
			// Prepare the file to upload
			$filepath = 's3://order-mailing-list';
			//$filepath = 'public://lms/agent-'.$node->uid;
			file_prepare_directory($filepath, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);
			//Upload listed_mailing_list file
			$path = $values['listed_mailing_list'][0]['tmppath'];
			$name = $values['listed_mailing_list'][0]['name'];
			$filemime = file_get_mimetype($path);
			$file = (object)array(
				'uid' => $user->uid,
				'filename' => $name,
				'uri' => $path,
				'filemime' => $filemime,
				'status' => 1,
				'display' => 1,
			);
			if($values['same_listed_list'] == 1) {
				if ($sold_file = file_copy($file, $filepath . '/' . $name, $replace = FILE_EXISTS_RENAME)) {
					drupal_set_message($name.' uploaded successfully!');
				}
				else {
					drupal_set_message($name.' could not be uploaded.');
				}
				$order->field_just_sold_mail_list['und']['0'] = (array)$sold_file;
			}
			if ($file = file_move($file, $filepath . '/' . $name, $replace = FILE_EXISTS_RENAME)) {
				drupal_set_message($name.' uploaded successfully!');
			}
			else {
				drupal_set_message($name.' could not be uploaded.');
			}
			$order->field_just_listed_mail_list['und']['0'] = (array)$file;
		}
		if($values['same_listed_list'] == 0 && isset($values['sold_mailing_list'][0])) {
			// Prepare the file to upload
			$filepath = 's3://order-mailing-list';
			//$filepath = 'public://lms/agent-'.$node->uid;
			file_prepare_directory($filepath, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);
			//Upload sold_mailing_list file
			$path = $values['sold_mailing_list'][0]['tmppath'];
			$name = $values['sold_mailing_list'][0]['name'];
			$filemime = file_get_mimetype($path);
			$file = (object)array(
				'uid' => $user->uid,
				'filename' => $name,
				'uri' => $path,
				'filemime' => $filemime,
				'status' => 1,
				'display' => 1,
			);
			if ($file = file_move($file, $filepath . '/' . $name, $replace = FILE_EXISTS_RENAME)) {
				drupal_set_message($name.' uploaded successfully!');
			}
			else {
				drupal_set_message($name.' could not be uploaded.');
			}
			$order->field_just_sold_mail_list['und']['0'] = (array)$file;
		}
		commerce_order_save($order);
	}
	//print "<pre>";print_r($values);exit;
}
