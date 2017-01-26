<?php
/**
  * property_pdf_selection_tool form to select product and page setting.
  */
function property_pdf_selection_tool($form, &$form_state, $settings) {
	unset($_SESSION['page_settings_data']);
	$media_format='';
	$arg = arg();
	if( isset( $arg[2] ) ){
		$media_format = arg(2);
	}
	$default_variations = array();
	if(isset($settings) && !empty($settings)){
		$design_id = $settings['design_id'];
		$json_data = $settings['json_data'];
		$page_settings = json_decode($settings['page_settings']);
		$template_name = $page_settings->template_name;
		$pro_type = $page_settings->product;
		$pdf_dimension = $page_settings->pdf_dimension;
		$pdf_width = $page_settings->pdf_width;
		$pdf_height = $page_settings->pdf_height;
		$bleed = $page_settings->bleed;
		$sides = $page_settings->sides;
		$color_specs = $page_settings->color_specs;
		$snap_grid = $page_settings->snap_grid;
		$resolution = $page_settings->resolution;
		foreach($page_settings->variations as $variations) {
			if($variations != 0){
				$default_variations[] = $variations;
			}
		}
	}
	else{
		$design_id = '';
		$json_data = '';
		$page_settings = '';
		$template_name='';
		$pro_type='0';
		$pdf_dimension='in';
		$pdf_width='';
		$pdf_height='';
		$bleed='';
		$sides='';
		$color_specs='srgb';
		$snap_grid='none';
		$resolution='print';
	}
	$form = array();
	$form['json_data'] = array(
	  '#type' => 'hidden',
	  '#attributes' => array(
			'id' => 'json_data',
		),
	  '#value' => $json_data,
	);
	$form['design_id'] = array(
	  '#type' => 'hidden',
	  '#attributes' => array(
			'id' => 'json_data',
		),
	  '#value' => $design_id,
	);
	$form['template_name'] = array(
	  '#type' => 'textfield',
	  '#title' => t('Template Name'),
	  '#placeholder' => t('Template Name'),
	  '#attributes' => array(
			'id' => 'template_name',
		),
	  '#default_value' => $template_name,
	  '#required' => TRUE,
	  '#prefix' => '<div class="product-setting-main"><div class="product-setting"><div class="product-setting-header"><h3>Template Settings</h3> </div>',
	);
	
	$variations = array();
	$vocab = taxonomy_vocabulary_machine_name_load('template_variation');
	$terms = taxonomy_get_tree($vocab->vid, 0, 1);
    foreach ($terms as $data) {
		$variations[$data->tid] = $data->name;
    }
	$form['variations'] = array(
	  '#type' => 'checkboxes',
	  '#title' => t('Variations'),
	  '#options' => $variations,
	  '#default_value' => $default_variations,
	  '#attributes' => array(
			'id' => 'template_variations',
		),
	  '#required' => TRUE,
	  '#prefix' => '<div class="template-variations">',
	  '#suffix' => '</div>',
	);
	
	$options = array();
	$voc = taxonomy_vocabulary_machine_name_load('product_type');
	$terms = taxonomy_get_tree($voc->vid, 0, 1);
    foreach ($terms as $data) {
		
		$term = taxonomy_term_load($data->tid);
		if(isset($term->field_product_media_format['und'][0]['tid'])){
			$media_term_id = $term->field_product_media_format['und'][0]['tid'];
			if($media_format == 'pdf' && $media_term_id == 810){
				$options[$data->tid] = $data->name;
			}
		}
    }
	$form['product'] = array(
	  '#type' => 'select',
	  '#title' => t('Select a Product type'),
	  '#options' => $options,
	  '#attributes' => array(
			'id' => 'product_type',
		),
	  '#required' => TRUE,
	  '#default_value' => $options[$pro_type],
	  '#prefix' => '<div class="product-setting-header"><h3>Product</h3> </div>',
	   '#suffix' => '</div>',
	);
	
	$dimensions = array('in'=>'in', 'px'=>'px');
	$form['pdf_dimension'] = array(
	  '#type' => 'select',
	  '#title' => t('Dimensions:'),
	  '#options' => $dimensions,
	  '#default_value' => $dimensions[$pdf_dimension],
	  '#attributes' => array(
			'id' => 'pdf_dimension',
		),
	  '#prefix' => '<div class="page-setting-main"><div class="page-setting">',
	);
	$form['pdf_width'] = array(
	  '#type' => 'numberfield',
	  '#title' => t('Width:'),
	  '#attributes' => array(
			'id' => 'pdf_width',
		),
	  '#step' => 0.01,
	  '#required' => TRUE,
	  '#default_value' => $pdf_width,
	);
	$form['pdf_height'] = array(
	  '#type' => 'numberfield',
	  '#title' => t('Height:'),
	  '#attributes' => array(
			'id' => 'pdf_height',
		),
	  '#step' => 0.01,
	  '#required' => TRUE,
	  '#default_value' => $pdf_height,
	);
	$snap_grid = array('none'=>'None', '1/32'=>'1/32', '1/16'=>'1/16', '3/32'=>'3/32', '1/8'=>'1/8', '3/16'=>'3/16', '1/4'=>'1/4');
	$form['snap_grid'] = array(
	  '#type' => 'select',
	  '#title' => t('Snap-to grid size'),
	  '#options' => $snap_grid,
	  '#attributes' => array(
			'id' => 'snap_grid',
		),
	 '#default_value' => $snap_grid[$snap_grid],
	);
	$form['sides'] = array(
	  '#type' => 'numberfield',
	  '#title' => t('No. of Sides:'),
	  '#attributes' => array(
			'id' => 'sides',
		),
	'#min' => 1,
	'#default_value' => $sides,
	'#required' => TRUE,
	 '#suffix' => '</div>',	
	);
	$color_specs = array('srgb'=>'sRGB', 'rgb'=>'RGB', 'cmyk'=>'CMYK');
	$form['color_specs'] = array(
	  '#type' => 'select',
	  '#title' => t('Image Color Space'),
	  '#options' => $color_specs,
	  '#default_value' => $color_specs[$color_specs],
	  '#attributes' => array(
			'id' => 'color_specs',
		),
	  '#prefix' => '<div class="page-setting">',
	);
	$resolution = array('print'=>'Print', 'screen'=>'Screen');
	$form['resolution'] = array(
	  '#type' => 'select',
	  '#title' => t('Output resolution'),
	  '#options' => $resolution,
	  '#default_value' => $resolution[$resolution],
	  '#attributes' => array(
			'id' => 'resolution',
		),
	);
	$form['bleed'] = array(
	  '#type' => 'checkbox',
	  '#title' => t('Bleed & Crop Marks'),
	  '#attributes' => array(
			'id' => 'bleed',
		),
	  '#default_value' => $bleed,
	  '#suffix' => '</div></div></div>',	
	);
	$form['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Continue to template designer'),
		'#prefix' => '<div class="page-setting-submit">',
		'#suffix' => '</div>',
	);
	return $form;
}

/**
 * property_pdf_selection_tool submit function.
 */
function property_pdf_selection_tool_submit($form, &$form_state) {
	$arg = arg(2);
	unset($_SESSION['page_settings_data']);
	if($form_state['values']['pdf_dimension'] == 'in'){
		$px_width = ($form_state['values']['pdf_width'])*96;
		$px_height = ($form_state['values']['pdf_height'])*96;
	}
	else if($form_state['values']['pdf_dimension'] == 'cm'){
		$px_width = ($form_state['values']['pdf_width'])*37.8;
		$px_height = ($form_state['values']['pdf_height'])*37.8;
	}
	else if($form_state['values']['pdf_dimension'] == 'px'){
		$px_width = $form_state['values']['pdf_width'];
		$px_height = $form_state['values']['pdf_height'];
	}
	
	$bleed = '';
	if($form_state['values']['bleed'] == 1){
		$bleed = 'bleed';
	}
	$form_state['values']['up_pdf_width'] = $px_width;								
	$form_state['values']['up_pdf_height'] = $px_height;								
	$form_state['values']['bleed'] = $bleed;								
	$type = $form_state['values']['product'];
	$design_id = $form_state['values']['design_id'];
	$_SESSION['page_settings_data'] = $form_state['values'];
	$form_state['redirect'] = array(
	  'cds/design/create/'.$arg,
	  array(
		'query' => array(
		  'mode' => 'design',
		  'type' => $type,
		  'design_id' => $design_id,
		),
	  ),
	);
}