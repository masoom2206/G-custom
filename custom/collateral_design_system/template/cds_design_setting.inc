<?php
/**
  * property_pdf_selection_tool form to select product and page setting.
  */
function property_pdf_selection_tool($form, &$form_state) {
	$form = array();
	
	$product_type = array(''=>'Select a Product Type and SKU', 'bro'=>'Pro Brochures');
	$form['product'] = array(
	  '#type' => 'select',
	  '#title' => t(''),
	  '#options' => $product_type,
	  '#attributes' => array(
			'id' => 'product_type',
		),
	  '#prefix' => '<div class="product-setting"><div class="product-setting-header"><h3>Product</h3> <div class="product-setting-markup">Select a product type & SKU that this template will apply to</div></div>',
	);
	
	$package_type = array(''=>'Add to this Package(bundle)', 'prime'=>'Prime');
	$form['package'] = array(
	  '#type' => 'select',
	  '#title' => t(''),
	  '#options' => $package_type,
	  '#attributes' => array(
			'id' => 'package_type',
		),
	  '#prefix' => '<div class="product-setting-header"><h3>Package</h3><div class="product-setting-markup">(optional)</div></div>',
	  '#suffix' => '</div>',
	);
	
	$dimensions = array('in'=>'in', 'px'=>'px', 'cm'=>'cm');
	$form['pdf_dimension'] = array(
	  '#type' => 'select',
	  '#title' => t('Dimensions:'),
	  '#options' => $dimensions,
	  '#default_value' => $dimensions['in'],
	  '#attributes' => array(
			'id' => 'pdf_dimension',
		),
	);
	$form['pdf_width'] = array(
	  '#type' => 'numberfield',
	  '#title' => t('Width:'),
	  '#attributes' => array(
			'id' => 'pdf_width',
		),
	  '#step' => 0.01,
	  '#default_value' => '8.5',
	  '#value' => '',
	);
	$form['pdf_height'] = array(
	  '#type' => 'numberfield',
	  '#title' => t('Height:'),
	  '#attributes' => array(
			'id' => 'pdf_height',
		),
	  '#step' => 0.01,
	);
	$form['bleed'] = array(
	  '#type' => 'checkbox',
	  '#title' => t('Bleed:'),
	  '#attributes' => array(
			'id' => 'bleed',
		),
	);
	$form['crop_marks'] = array(
	  '#type' => 'checkbox',
	  '#title' => t('Crop Marks:'),
	  '#attributes' => array(
			'id' => 'crop_marks',
		),
	);
	$form['sides'] = array(
	  '#type' => 'numberfield',
	  '#title' => t('No. of Sides:'),
	  '#attributes' => array(
			'id' => 'sides',
		),
	);
	$form['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Continue to template designer'),
	);
	$form['#action'] = 'property-pdf';
	//$form['#attached']['js'][] = drupal_get_path("module", "property_pdf")."/js/form_submit.js" ;
	return $form;
}

/**
 * property_pdf_selection_tool submit function.
 */
function property_pdf_selection_tool_submit($form, $form_state) {
	echo '<pre>';
	print_r($form_state);
	echo '</pre>';
	//die;
	//$form_state['redirect'] = 'property-pdf';
}