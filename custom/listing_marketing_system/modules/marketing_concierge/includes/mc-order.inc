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
  $additional_items_cost_query =  db_select('mc_package_addon_configuration', 'a')
    ->fields('a')
    ->condition('product_name', $title ,'like')
    ->execute()
    ->fetchAll();
  foreach($additional_items_cost_query as $addkey => $addvalue) {
    $unit_cost[$unit_cost_element][$addvalue->product_addon_sku] = $addvalue->addon_unit_price;
  }
  $variables = array(
    'banner' => $banner,
    'logo' => $logo,
    'title' => $title,
    'unit_cost' => $unit_cost,
    'package' => $package_data,
    'datad' => $order
  );
  if (isset($_SESSION['listing_reference_nid'])) {
    $order->field_lms_listing_reference['und']['0']['nid'] = $_SESSION['listing_reference_nid'];
    commerce_order_save($order);
    unset($_SESSION['listing_reference_nid']);
  }  
  $output = theme('mc_additional_order', array('var_name' => $variables));
  return $output;
}

function get_package_configuration_data($product_id) {
  $result = '';
  if (isset($product_id)) {
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
function marketing_concierge_additional_order_form($form, &$form_state, $variable) {
  global $user;
  $order = commerce_cart_order_load($user->uid);
  $order_id = $order->order_id;
  $just_listed = isset($order->field_just_listed_postcard['und']['0']['value']) ? $order->field_just_listed_postcard['und']['0']['value'] : '';
  $just_non_listed = isset($order->field_additional_ono_mailed_just['und']['0']['value']) ? $order->field_additional_ono_mailed_just['und']['0']['value'] : '';
  $just_sold = isset($order->field_just_sold_postcard['und']['0']['value']) ? $order->field_just_sold_postcard['und']['0']['value'] : '';
  $just_non_sold = isset($order->field_additional_non_mailed_just['und']['0']['value']) ? $order->field_additional_non_mailed_just['und']['0']['value'] : '';
  $just_pro = isset($order->field_just_pro_brochure['und']['0']['value']) ? $order->field_just_pro_brochure['und']['0']['value'] : '';
  $radius_mail = isset($order->field_mail_to_a_radius['und']['0']['value']) ? $order->field_mail_to_a_radius['und']['0']['value'] : 0;
  $direct_mail = array();
  $direct_mail[] = isset($order->field_direct_mail_postcards['und']['0']['value']) ? $order->field_direct_mail_postcards['und']['0']['value'] : '';
  $direct_mail[] = isset($order->field_direct_mail_postcards['und']['1']['value']) ? $order->field_direct_mail_postcards['und']['1']['value'] : '';
  $ship_listed_qty = isset($order->field_ship_to_office_just_listed) ? $order->field_ship_to_office_just_listed['und'][0]['value'] : '';
  $ship_solded_qty = isset($order->field_ship_to_office_just_sold) ? $order->field_ship_to_office_just_sold['und'][0]['value'] : '';
  $paper_preference = isset($order->field_paper_preference) ? $order->field_paper_preference['und'][0]['value'] : '';
  $brochure_size = isset($order->field_brochure_size) ? $order->field_brochure_size['und'][0]['value'] : '';
  if (isset($values['direct_mail_postcards_qty_9']) && !empty($values['direct_mail_postcards_qty_9'])) {
    $order->field_ship_to_office_just_listed['und'][0]['value'] = $values['direct_mail_postcards_qty_9'];
  }  
  if (isset($values['direct_mail_postcards_qty_10']) && !empty($values['direct_mail_postcards_qty_10'])) {
    $order->field_ship_to_office_just_sold['und'][0]['value'] = $values['direct_mail_postcards_qty_10'];
  }  
  
  $form_state['step'] = isset($form_state['step']) ? $form_state['step'] : 1;
  $form['#prefix'] = '<div id="ajax_form_multistep_form">';
  $form['#suffix'] = '</div>';
  $form['order_id'] = array(
    '#type' => 'hidden',
    '#value' => $order_id,
  );
  switch($form_state['step']) {
    case 1:
      $default_value = '';
      if (isset($form_state['values']['step_1'])) {
        $radius_mail = $form_state['values']['step_1'];
      }
      elseif (isset($form_state['storage']['step_1'])) {
        $radius_mail = $form_state['storage']['step_1'];
      }
      $form['step_one_markup'] = array(
        '#markup' => '<div class="mc-form-heading cpas"> <img src="'. $variable['logo'].'"/>&nbsp;'. $variable['title'].'&nbsp;|&nbsp;Package Options</div><div><p><br/><b>Your '. $variable['package']->product_name .'package includes(among other items)</b></p></div><div><span style="display: inline-block; width: 7%; class="manage-listing-back"><a href="/marketing-concierge/'.  $_SESSION['listing_reference_nid'] .'"><img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png"><br>&nbsp;<br>&nbsp;</a></span><span style="display: inline-block; width: 45%;" >'. $variable['package']->just_listed .' Just Listed Postcards (mailed) <br/>'. $variable['package']->just_sold .' Just Sold Postcards (mailed) <br/>'. $variable['package']->pro_brochures .' Pro Brochures</span><span style="display: inline-block; width: 45%;">NOTE: Your Postcard distribution options<br/>will presented on the next screen.<br>&nbsp;</span></div>',
      );
	  
      $form['radius_mail'] = array(
        '#type' => 'checkbox',
        '#title' => t('Mail to a radius'),
        '#default_value' => $radius_mail,
      );
      $form['listed_postcards'] = array(
        '#type' => 'textfield', 
        '#title' => t('Additional mailed Just Listed Postcards'), 
        '#default_value' => $just_listed,
        '#size' => 10,
        '#attributes' => array('placeholder' => t('(quantity)'), 'class' => array('additional-postcards'), 'subtotal-class' => array('listed-postcards')),
        '#element_validate' => array('element_validate_integer_positive'),
      );
      $form['listed_non_postcards'] = array(
        '#type' => 'textfield', 
        '#title' => t('Additional non-mailed Just Listed Postcards (plus $6 added shipping)'), 
        '#default_value' => $just_non_listed,
        '#size' => 10, 
        '#attributes' => array('placeholder' => t('(quantity)'), 'class' => array('additional-postcards'), 'subtotal-class' => array('listed-non-mail-postcards')),
        '#element_validate' => array('element_validate_integer_positive'),
      );
      $form['sold_postcards'] = array(
        '#type' => 'textfield', 
        '#title' => t('Additional maild Just Sold Postcards'), 
        '#default_value' => $just_sold,
        '#size' => 10, 
        '#attributes' => array('placeholder' => t('(quantity)'), 'class' => array('additional-postcards'), 'subtotal-class' => array('sold-postcards')),
        '#element_validate' => array('element_validate_integer_positive'),
      );
      $form['sold_non_postcards'] = array(
        '#type' => 'textfield', 
        '#title' => t('Additional non-mailed Just Sold Postcards (plus $6 added shipping)'), 
        '#default_value' => $just_non_sold,
        '#size' => 10, 
        '#attributes' => array('placeholder' => t('(quantity)'), 'class' => array('additional-postcards'), 'subtotal-class' => array('sold-non-mail-postcards')),
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
      $form['paper_preference'] = array(
        '#type' => 'select',
        '#default_value' => $paper_preference,
        '#title' => t('Paper Preference'),
        '#options' => array('' => '-None-','Glossy' => t('Glossy'), 'Matte' => t('Matte'))
      );
	  
	  if($variable['title']=='Premier'){
		   $brochure_size_options = array('' => '-None-', '8.5x11' => t('8.5” x 11” (portrait)'), '11x8.5' => t('11” x 8.5” (landscape)'));
	  } 
	  if($variable['title']=='Platinum'){
		   $brochure_size_options = array('' => '-None-', '8.5x11' => t('8.5” x 11” (portrait)'), '11x8.5' => t('11” x8.5” (landscape)'), '8x8' => t('8” x 8” (folded size)'), '5.5x5.5' => t('5.5” x 5.5” (folded tri-fold)'), '11x17' => t('11” x 17” (calendar fold)'));
	  } 
	  if($variable['title']=='Platinum Plus'){
		   $brochure_size_options = array('' => '-None-', '8.5x11' => t('8.5” x 11” (portrait)'), '11x8.5' => t('11” x8.5” (landscape)'), '8x8' => t('8” x 8” (folded size)'), '5.5x5.5' => t('5.5” x 5.5” (folded tri-fold)'), '11x17' => t('11” x 17” (calendar fold)'));
	  }
      $form['brochure_size'] = array(
        '#type' => 'select',
        '#default_value' => $brochure_size,
        '#title' => t('Brochure Size'),
        '#options' => $brochure_size_options
      );
	  $form['view_options_markup'] = array(
        '#markup' => '<div id="view-option-markup">'.l(t('Click Here To View Options'), 'https://www.cbone.me/content/marketing-concierge-postcard-brochure-templates', array('attributes' => array('target' => '_blank'))).'</div>'
      );
    break;
    case 2:
      $default_value = '';
      if (isset($form_state['values']['step_2'])) {
        $default_value = $form_state['values']['step_2'];
      }
      elseif (isset($form_state['storage']['step_2'])) {
        $default_value = $form_state['storage']['step_2'];
      }
      $valuesdata = $form_state['values'];
      $total_listed = $variable['package']->just_listed + $valuesdata['listed_postcards'];
      $total_sold = $variable['package']->just_sold + $valuesdata['sold_postcards'];
      $shipped_listed = '';
      if (isset($valuesdata['listed_non_postcards']) && !empty($valuesdata['listed_non_postcards']) && $valuesdata['listed_non_postcards'] > 0) {
        $shipped_listed = $valuesdata['listed_non_postcards'].' Just Listed Postcards (shipped)<br/>';
      }
      $shipped_sold = '';
      if (isset($valuesdata['sold_non_postcards']) && !empty($valuesdata['sold_non_postcards']) && $valuesdata['listed_non_postcards'] > 0) {
        $shipped_sold = $valuesdata['sold_non_postcards'].' Just Sold Postcards (shipped)<br/>';
      }
      $pro_brochures = $variable['package']->pro_brochures + $valuesdata['pro_brochures'];
      ctools_include('ajax');
      ctools_include('modal');
      // Add Ctools' JavaScript to the page.
      ctools_modal_add_js();
      $sample_style = array(
        'ctools-sample-style' => array(
          'modalSize' => array(
            'type' => 'fixed',
            'width' => 600,
            'height' => 500,
            'addWidth' => 20,
            'addHeight' => 15
          ),
          'modalOptions' => array(
            'opacity' => .5,
            'background-color' => '#246'
          ),
          'animation' => 'slideRight',
          'modalTheme' => 'CToolsSampleModal',
          'throbber' => theme('image', array(
            'path' => ctools_image_path('ajax-loader.gif', 'ctools_ajax_sample'),
            'alt' => t('Loading...'),
            'title' => t('Loading')
          )),
        ),
      );
      drupal_add_js($sample_style, 'setting');
      ctools_add_js('ctools-ajax-sample', 'ctools_ajax_sample');
      ctools_add_css('ctools-ajax-sample', 'ctools_ajax_sample');
      //$links = ctools_modal_text_button(t('Upload'), 'upload/direct-mail-list/'.$order_id.'/nojs', t('Upload'), 'ctools-modal-ctools-sample-style direct-mail-upload');
      //$direct_mail_options = array('mail_radius_surrounding_property' => t('Mail to a radius surrounding the property'), 'upload_own_list' => t('Upload my own list <span class="direct-mail-file">'.$links.'</span>'));
      $links9 = ctools_modal_text_button(t('Upload'), 'upload/direct-mail-listed/'.$order_id.'/nojs', t('Upload'), 'ctools-modal-ctools-sample-style direct-mail-upload');
      $direct_mail_options9 = array('mail_radius_surrounding_property' => t('Mail to a radius surrounding the property'), 'upload_own_list' => t('Upload my own list <span class="direct-mail-file">'.$links9.'</span>'));
      $links10 = ctools_modal_text_button(t('Upload'), 'upload/direct-mail-sold/'.$order_id.'/nojs', t('Upload'), 'ctools-modal-ctools-sample-style direct-mail-upload');
      $direct_mail_options10 = array('mail_radius_surrounding_property' => t('Mail to a radius surrounding the property'), 'upload_own_list' => t('Upload my own list <span class="direct-mail-file">'.$links10.'</span>'));
      $form['step_two_markup_1'] = array(
        '#markup' => '<div class="mc-form-heading cpas"> <img src="'. $variable['logo'].'"/>&nbsp;'. $variable['title'].'&nbsp;|&nbsp;Package Mail Distribution Options</div><div><p><br/><b>Your '. $variable['package']->product_name .' package includes (among other items)</b></p></div><div style="position: relative;"><div style="display: inline-block; width: 7%; clear: both;" class="additional-order-submit manage-listing-back">',
      );
      if ($form_state['step'] !== 1) {
        $form['buttons']['back'] = array (
          '#type' => 'submit',
          '#value' => t('Back'),
          '#limit_validation_errors' => array(),
          '#submit' => array('ajax_form_multistep_form_back_submit'),
          '#ajax' => array (
            'wrapper' => 'ajax_form_multistep_form',
            'callback' => 'ajax_form_multistep_form_ajax_callback',
          ),
        );
      }
      $form['step_two_markup_2'] = array(
        '#markup' => '</div><div style="width: 45%; clear: both; display: inline-block;" >'. $total_listed .' Just Listed Postcards (mailed) <br/>'. $shipped_listed .''. $total_sold . ' Just Sold Postcards (mailed) <br/>'.$shipped_sold .' '. $pro_brochures .' Pro Brochures (shipped)</div><div style="display: inline-block; position: absolute; width: 45%; top: 0px; right: 0px; font-size: 13px;"><b>Please note:</b> Your mailing order will be based on the total quantity of pieces you\'ve ordered, not on the size of your custom uploaded mailing list. For example, if you order 200 postcards but only upload a list of 150 recipients, the remaining 50 will go to a radius around the property. If you order 200 postcards but upload 1,000 recipients, the postcards will only be sent to the first 200 people on your list. To ensure your postcards reach the recipients you are targeting, please be sure you upload a list that coincides with the total order of postcards you are requesting, otherwise the default rules above will apply.<div><b>'.l(t('Click here for guidelines for upload mail list.'), 'http://www.corefact.com/print/info/mailing_list_file_format', array('external' => TRUE)).'</b> </div></div></div>',);
      $result = db_select('commerce_product', 'n')
        ->fields('n')
        ->condition('status', 1)
        ->condition('type', 'just_listed_and_just_sold_option', 'like')
        ->execute()
        ->fetchAll();
      $form['direct_mail_upload_markup'] = array(
        '#markup' => '<br/><br/><label for="edit-direct-mail-postcards-9">'.t('Mailed Postcard Delivery Options').'</label>',
      );
      $form['direct_mail_postcards_9'] = array(
          '#type' => 'checkboxes',
          '#title' => t('Just listed postcards'),
          '#options' => $direct_mail_options9,
          '#default_value' => $direct_mail,
          '#required' => TRUE,
		  '#required_error' => t('Just Listed Postcards mailing option is required.'),
      );
       if (!empty($shipped_listed)) {
          $form['direct_mail_postcards_qty_9'] = array(
            '#type' => 'textfield',
            '#size' => 10,
            '#default_value' => $ship_listed_qty,
            '#suffix' => '<span>(May be not exceed: '.($total_listed + $valuesdata['listed_non_postcards']).')</span>',
            '#title' => t('Ship to office')
          );
       }
       $form['direct_mail_postcards_10'] = array(
          '#type' => 'checkboxes',
          '#title' => t('Just sold postcards'),
          '#options' => $direct_mail_options10,
          '#default_value' => $direct_mail,
          '#required' => TRUE,
		  '#required_error' => t('Just Sold Postcards mailing option is required.'),
      );
      if (!empty($shipped_sold)) {
        $form['direct_mail_postcards_qty_10'] = array(
          '#type' => 'textfield',
          '#size' => 10,
          '#suffix' => '<span>(May be not exceed: '.($total_sold + $valuesdata['sold_non_postcards']).')</span>',
          '#default_value' => $ship_solded_qty,
          '#title' => t('Ship to office')
        );
      } 
    break;
  }
 $form['buttons'] = array (
    '#type' => 'container',
  );
  if ($form_state['step'] !== 1) {
    $form['buttons']['back'] = array (
      '#type' => 'submit',
      '#value' => t('Back'),
      '#prefix' => '<div class="additional-order-submit">',
      '#suffix' => '</div>',
      '#limit_validation_errors' => array(),
      '#submit' => array('ajax_form_multistep_form_back_submit'),
      '#ajax' => array (
        'wrapper' => 'ajax_form_multistep_form',
        'callback' => 'ajax_form_multistep_form_ajax_callback',
      ),
    );
  }
  if ($form_state['step'] !== 2) {
    $form['buttons']['forward'] = array (
      '#type' => 'submit',
      '#value' => t('Continue'),
      '#prefix' => '<div class="additional-order-submit">',
      '#suffix' => '</div>',
      '#ajax' => array (
        'wrapper' => 'ajax_form_multistep_form',
        'callback' => 'ajax_form_multistep_form_ajax_callback',
      ),
    );
  }
  else  {
    $form['buttons']['submit'] = array (
      '#type' => 'submit',
      '#value' => t('Continue'),
      '#prefix' => '<div class="additional-order-submit">',
      '#suffix' => '</div>',
      '#ajax' => array (
        'wrapper' => 'ajax_form_multistep_form',
        'callback' => 'ajax_form_multistep_form_ajax_callback',
      ),
    );
  }
  return $form;
}

function ajax_form_multistep_form_back_submit($form, &$form_state) {
  $form_state['step']--;
  $form_state['rebuild'] = TRUE;
}

 
function ajax_form_multistep_form_ajax_callback($form, &$form_state) {
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
  if($form_state['step'] == 2){
	  $sstest = $values['direct_mail_postcards_9']['upload_own_list'];
	  $stest = count($order->field_just_listed_mail_list['und']['0']['fid']);
	  if ($stest == 0 && $sstest != '0') {
		form_set_error('direct_mail_postcards_9', 'Please upload your list before continuing.');
	  }
	  $lstest = $values['direct_mail_postcards_10']['upload_own_list'];
	  $ltest = count($order->field_just_sold_mail_list['und']['0']['fid']);
	  if ($ltest == 0 && $lstest != '0') {
		form_set_error('direct_mail_postcards_10', 'Please upload your list before continuing.');
	  }
	}
}
/**
 * Form Submit API for MC order
 * to add additional fee amount
 **/
function marketing_concierge_additional_order_form_submit($form, &$form_state){
   $step = $form_state['step'];
  $form_state['storage']['step_' . $step] = $form_state['values']['step_' . $step];
  global $user;
  $uid = $user->uid;
  $product_titles = array("Premier", "Platinum", "Platinum Plus", "Prime");
  $values = $form_state['values'];
  $order = commerce_order_load($values['order_id']);
  // Check to see if the next/forward button was clicked
  if (isset($form_state['values']['forward']) && $form_state['values']['op'] == $form_state['values']['forward']) {
    // Increase the step by one, to move on to the next step
    commerce_shipping_delete_shipping_line_items($order, FALSE);
    foreach($order->commerce_line_items['und'] as $line_items) {
      $line_item_id = $line_items['line_item_id'];
      $order_line_item = commerce_line_item_load($line_item_id);
      $product_id = $order_line_item->commerce_product['und']['0']['product_id'];
      $product = commerce_product_load($product_id);
      if (!in_array($product->title, $product_titles)) {
        $order = commerce_cart_order_product_line_item_delete($order, $line_item_id, TRUE);
      }
    }
    $shipping_price = 0;
    $order->field_mail_to_a_radius['und']['0']['value'] = $values['radius_mail'];
    $order->field_just_listed_postcard['und']['0']['value'] = '';
    if ($values['listed_postcards'] != '' && is_numeric($values['listed_postcards'])) {
      $order->field_just_listed_postcard['und']['0']['value'] = $values['listed_postcards'];
      $product = commerce_product_load_by_sku("addl-just-listed-postcards");
      $line_item = commerce_product_line_item_new($product, $values['listed_postcards']);
      $line_item = commerce_cart_product_add($uid, $line_item, FALSE);
    }
    $order->field_additional_ono_mailed_just['und']['0']['value'] = '';
    if ($values['listed_non_postcards'] != '' && is_numeric($values['listed_non_postcards'])) {
      $order->field_additional_ono_mailed_just['und']['0']['value'] = $values['listed_non_postcards'];
      $product = commerce_product_load_by_sku("addl-just-listed-postcards-non-mailed");
      $line_item = commerce_product_line_item_new($product, $values['listed_non_postcards']);
      $line_item = commerce_cart_product_add($uid, $line_item, FALSE);
      $order->field_ship_to_office_just_listed['und'][0]['value'] = $values['listed_non_postcards'];
      $shipping_price = 6;
    }
    $order->field_just_sold_postcard['und']['0']['value'] = '';
    if ($values['sold_postcards'] != '' && is_numeric($values['sold_postcards'])) {
      $order->field_just_sold_postcard['und']['0']['value'] = $values['sold_postcards'];
      $product = commerce_product_load_by_sku("addl-just-sold-postcards");
      $line_item = commerce_product_line_item_new($product, $values['sold_postcards']);
      $line_item = commerce_cart_product_add($uid, $line_item, FALSE);

    }
    $order->field_additional_non_mailed_just['und']['0']['value'] = '';
    if ($values['sold_non_postcards'] != '' && is_numeric($values['sold_non_postcards'])) {
      $order->field_additional_non_mailed_just['und']['0']['value'] = $values['sold_non_postcards'];
      $product = commerce_product_load_by_sku("addl-just-sold-postcards-non-mailed");
      $line_item = commerce_product_line_item_new($product, $values['sold_non_postcards']);
      $line_item = commerce_cart_product_add($uid, $line_item, FALSE);
      $order->field_ship_to_office_just_sold['und'][0]['value'] = $values['sold_non_postcards'];
      $shipping_price = 6 + $shipping_price;
    }    
    $order->field_just_pro_brochure['und']['0']['value'] = '';
    if ($values['pro_brochures'] != '' && is_numeric($values['pro_brochures'])) {
      $order->field_just_pro_brochure['und']['0']['value'] = $values['pro_brochures'];
      $product = commerce_product_load_by_sku("addl-pro-brochures");
      $line_item = commerce_product_line_item_new($product, $values['pro_brochures']);
      $line_item = commerce_cart_product_add($uid, $line_item, FALSE);
    }
    $order->field_paper_preference['und']['0']['value'] = '';
    if ($values['paper_preference'] != '') {
      $order->field_paper_preference['und']['0']['value'] = $values['paper_preference'];
    }
    $order->field_brochure_size['und']['0']['value'] = '';
    if ($values['brochure_size'] != '') {
      $order->field_brochure_size['und']['0']['value'] = $values['brochure_size'];
    }
    if ($shipping_price > 0) {
      $service = 'shipping';
      $shipping_service = commerce_shipping_service_load($service);

      // Build the custom unit price array.
      $unit_price = array(
        'amount' => commerce_currency_decimal_to_amount($shipping_price, 'USD'), 
        'currency_code' => 'USD', 
        'data' => array(),
      );

      // Add a price component for the custom amount.
      $unit_price['data'] = commerce_price_component_add(
        $unit_price, 
        $shipping_service['price_component'], 
        $unit_price, 
        TRUE, 
        FALSE
      );
      $line_item = commerce_shipping_line_item_new($service, $unit_price, $order_id);
      $line_item = commerce_shipping_add_shipping_line_item($line_item, $order, FALSE);
      //$line_item = commerce_shipping_line_item_new('Shipping', 12, $order->order_id);
      //$new_line_item = commerce_shipping_add_shipping_line_item($line_item, $order, FALSE);
    }
    commerce_order_save($order);
    $form_state['step']++;
    $form_state['rebuild'] = TRUE;
  }
  elseif (isset($form_state['values']['submit']) && $form_state['values']['op'] == $form_state['values']['submit']) { 
    $values = $form_state['values'];
    $order->field_direct_mail_postcards['und'][0]['value'] = $values['direct_mail_postcards_9']['mail_radius_surrounding_property'];
    $order->field_direct_mail_postcards['und'][1]['value'] = $values['direct_mail_postcards_9']['upload_own_list'];
    $order->field_direct_mail['und'][0]['value'] = $values['direct_mail_postcards_10']['mail_radius_surrounding_property'];
    $order->field_direct_mail['und'][1]['value'] = $values['direct_mail_postcards_10']['upload_own_list'];
    $order->field_ship_to_office_just_listed['und'][0]['value'] = '';
    if (isset($values['direct_mail_postcards_qty_9']) && !empty($values['direct_mail_postcards_qty_9'])) {
      $order->field_ship_to_office_just_listed['und'][0]['value'] = $values['direct_mail_postcards_qty_9'];
    }
    $order->field_ship_to_office_just_sold['und'][0]['value'] = '';
    if (isset($values['direct_mail_postcards_qty_10']) && !empty($values['direct_mail_postcards_qty_10'])) {
      $order->field_ship_to_office_just_sold['und'][0]['value'] = $values['direct_mail_postcards_qty_10'];
    }  
    commerce_order_save($order);
    $items = array($form_state['storage']['step_1'], $form_state['storage']['step_2'], $form_state['storage']['step_3']);
    //drupal_set_message(t('You submitted the following values:!values', array('!values' => theme('item_list', array('items' => $items)))));
    // The form has been completed, so we want to return the user to step 1
    // as well as clear any saved values.
    $form_state['rebuild'] = TRUE;
    $form_state['redirect'] = 'checkout';
    $path = "checkout";
    ctools_include('ajax');
    ctools_add_js('ajax-responder');
    $commands[] = ctools_ajax_command_redirect($path);
    print ajax_render($commands);
    exit;
  }
}


function upload_direct_mail_list($id, $ajax) {
  if ($ajax) {
    ctools_include('ajax');
    ctools_include('modal');

    $form_state = array(
      'ajax' => TRUE,
      'title' => t('MyModule Modal Form'),
    );

    // Use ctools to generate ajax instructions for the browser to create
    // a form in a modal popup.
    $output = ctools_modal_form_wrapper('upload_direct_mail_list_form', $form_state);

    // If the form has been submitted, there may be additional instructions
    // such as dismissing the modal popup.
    if (!empty($form_state['ajax_commands'])) {
      $output = $form_state['ajax_commands'];
    }

    // Return the ajax instructions to the browser via ajax_render().
    print ajax_render($output);
    drupal_exit();
  }
  else {
    return drupal_get_form('upload_direct_mail_list_form');
  }
}






/**
 * Form API for MC order
 * to add additional fee amount
 **/
function upload_direct_mail_list_form($form, &$form_state) {
  $order_id = arg(2);
  $order = commerce_order_load($order_id);
  //print "<pre>";print_r($order);exit;
  if (isset($order->field_just_listed_mail_list['und']['0']['fid']) && arg(1) == 'direct-mail-listed') {
    $listed_file_url = file_create_url($order->field_just_listed_mail_list['und']['0']['uri']);
    $listed_file_name = $order->field_just_listed_mail_list['und']['0']['filename'];
    $listed_fid = $order->field_just_listed_mail_list['und']['0']['fid'];
    /*$sold_fid = '';
    $sold_file = '';
    if (isset($order->field_just_sold_mail_list['und']['0']['fid'])) {
      $sold_file_url = file_create_url($order->field_just_sold_mail_list['und']['0']['uri']);
      $sold_file_name = $order->field_just_sold_mail_list['und']['0']['filename'];
      $sold_fid = $order->field_just_sold_mail_list['und']['0']['fid'];
      $sold_file = '<li><a href="'.$sold_file_url.'" target="_blank">'.$sold_file_name.'</a></li>';
    }*/
    $form['upload_page_title'] = array(
      '#markup' => '<div class="upload-page-title">Uploaded Mailing List</div>',
    );
    $form['mail_file'] = array(
      '#markup' => '<div class="uploaded-files">
        <ul>
          <li><a href="'.$listed_file_url.'" target="_blank">'.$listed_file_name.'</a></li>
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
    /*$form['sold_fid'] = array(
      '#type' => 'hidden',
      '#value' => $sold_fid,
    );*/
    $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Remove Files'),
      '#required' => TRUE,
    );    
  }
  else if (isset($order->field_just_sold_mail_list['und']['0']['fid']) && arg(1) == 'direct-mail-sold') {
    $sold_file_url = file_create_url($order->field_just_sold_mail_list['und']['0']['uri']);
    $sold_file_name = $order->field_just_sold_mail_list['und']['0']['filename'];
    $sold_fid = $order->field_just_sold_mail_list['und']['0']['fid'];
    $sold_fid = '';
    $sold_file = '';
    if (isset($order->field_just_sold_mail_list['und']['0']['fid'])) {
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
          <li><a href="'.$sold_file_url.'" target="_blank">'.$sold_file_name.'</a></li>
        </ul>
      </div>',
    );
    $form['order_id'] = array(
      '#type' => 'hidden',
      '#value' => $order_id,
    );
    /*$form['listed_fid'] = array(
      '#type' => 'hidden',
      '#value' => $listed_fid,
    );*/
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
	if (!isset($order->field_just_listed_mail_list['und']['0']['fid'])) {
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
		if (!isset($order->field_just_sold_mail_list['und']['0']['fid'])) {
			$form['same_listed_list'] = array(
			  '#type' => 'checkbox',
			  '#title' => t('Also use for Just Sold Mailing List.'),
			);
		}
	}
	if (!isset($order->field_just_sold_mail_list['und']['0']['fid'])) {
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
	}
    $form['actions']['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Save Documents'),
      '#required' => TRUE,
    );
    $form['#validation'][] = 'upload_direct_mail_list_form_validate';
  }
  return $form;
}
/**
 * Form Validation API for MC order
 * to validate the file form field
 **/
function upload_direct_mail_list_form_validate($form, &$form_state) {
  $values = $form_state['values'];
  $listed_count = count($values['listed_mailing_list']);
  $sold_count = count($values['sold_mailing_list']);
  if ($listed_count > 1) {
    form_set_error('listed_mailing_list', 'Kindly select only one file.');
  }
  if ($values['same_listed_list'] == 0 && $sold_count > 1) {
    form_set_error('sold_mailing_list', 'Kindly select only one file.');
  }
}
/**
 * Form Submit API for MC order
 * to add additional fee amount
 **/
function upload_direct_mail_list_form_submit($form, &$form_state){
  $values = $form_state['values'];
  // print "<pre>";print_r($values);exit;
  if ($values['op'] == 'Remove Files'){
    $order_id = $values['order_id'];
    $order = commerce_order_load($order_id);
    if ($values['sold_fid'] != '') {
      $sold_fid = $values['sold_fid'];
      $file = file_load($sold_fid);
      file_delete($file);
      unset($order->field_just_sold_mail_list['und']);
    }
	else{
	$listed_fid = $values['listed_fid'];
    $file = file_load($listed_fid);
    file_delete($file);
    unset($order->field_just_listed_mail_list['und']);
	}
    commerce_order_save($order);
    drupal_set_message('Files deleted successfully!');
  }
  else {
    $order_id = $values['order_id'];
    $order = commerce_order_load($order_id);
    if (isset($values['listed_mailing_list'][0])) {
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
      if ($values['same_listed_list'] == 1) {
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
    if ($values['same_listed_list'] == 0 && isset($values['sold_mailing_list'][0])) {
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
	ctools_include('ajax');
	ctools_include('modal');
	ctools_add_js('ajax-responder');
	//$form_state['ajax_commands'][] = ctools_ajax_command_redirect($form_state['object']->redirectpath);
	$selector = '#project-messages';
	$form_state['ajax_commands'][] = ajax_command_html($selector, '' . theme('status_messages') . '');
	$form_state['ajax_commands'][] = ctools_modal_command_dismiss();
	
	

}
