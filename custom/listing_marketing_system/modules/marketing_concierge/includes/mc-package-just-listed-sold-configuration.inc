<?php
/***
**
**/
function mc_package_just_listed_sold_configuration() {
 ctools_include('modal');
  ctools_include('ajax');
  ctools_modal_add_js();
  $result = db_select('mc_package_addon_configuration', 'n')
    ->fields('n')
    ->execute()
    ->fetchAll();
  $rows = array();
  $header = array('Package SKU', 'Package Name', 'Add-On SKU (new)', 'Unit Price', 'Actions');
  foreach ($result as $key => $value ) {
    $link_edit = l(t('Edit'), 'admin/config/marketing-concierge/mc-package-configuration/package-addon/'.$value->product_id.'/'.$value->product_addon_id.'/edit/nojs', array('attributes' => array('class' => 'ctools-use-modal')));
    $link_delete = l(t('Delete'), 'admin/config/marketing-concierge/mc-package-configuration/package-addon/'.$value->product_id.'/'.$value->product_addon_id.'/delete/nojs', array('attributes' => array('class' => 'ctools-use-modal')));
    $rows[] = array($value->sku, $value->product_name, $value->product_addon_sku, $value->addon_unit_price, $link_edit . ' | ' . $link_delete);
  }
  $data = t('<h1>Just Listed and Just Sold options Configuration</h1>');
  $data .= l(t('Add a Just Listed and Just Sold options'), 'admin/config/marketing-concierge/mc-package-configuration/add/package-addon/nojs', array('attributes' => array('class' => 'ctools-use-modal')));
  $data .= '<br/>';
  return $data .= theme('table', array(
            'header' => $header, 
            'rows' => $rows,
            'attributes' => array('width' => '100%')
        ));
}


function mc_add_package_addon_configuration($ajax) {
  if ($ajax) {
    ctools_include('ajax');
    ctools_include('modal');

    $form_state = array(
      'ajax' => TRUE,
      'title' => t('Add a Just Listed and Just Sold options'),
    );

    // Use ctools to generate ajax instructions for the browser to create
    // a form in a modal popup.
    $output = ctools_modal_form_wrapper('mc_add_just_liste_sold_configuration_form', $form_state);

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
    return drupal_get_form('mc_add_just_liste_sold_configuration_form');
  }
}

function mc_add_just_liste_sold_configuration_form($form, $form_state) {
  $product = mc_add_just_listed_sold_get_product_list();
  $productaddon = mc_add_just_listed_sold_get_product_addon_list();
  if (isset($form_state['data'])) {
    $id = $form_state['data'];
    $addonid = $form_state['addondata'];
    $result = db_select('mc_package_addon_configuration', 'n')
      ->fields('n')
      ->condition('product_id', $id,'=')
      ->condition('product_addon_id', $addonid,'=')
      ->execute()
      ->fetchObject();
  }
  $form['product'] = array(
    '#type' => 'select',
    '#title' => t('Package Name'),
    '#required' => TRUE,
    '#default_value' => (isset($form_state['data'])) ? $form_state['data'] : '',
    '#disabled' => (isset($form_state['data'])) ? TRUE : FALSE,
    '#options' => $product
  );
  $form['addon_product'] = array(
    '#type' => 'select',
    '#title' => t('Addon product'),
    '#required' => TRUE,
    '#default_value' => (isset($form_state['data'])) ? $form_state['addondata'] : '',
    '#disabled' => (isset($form_state['data'])) ? TRUE : FALSE,
    '#options' => $productaddon
  );
  $form['unit_price'] = array(
    '#type' => 'textfield',
    '#title' => t('Unit Price'),
    '#default_value' => isset($result) ? $result->addon_unit_price : NULL,
    '#element_validate' => array('element_validate_number'),
    '#required' => TRUE
  );
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('submit'),
  );
  return $form;
}

function mc_add_just_listed_sold_get_product_list() {
  $result = db_select('commerce_product', 'n')
    ->fields('n')
    ->condition('status', 1)
    ->condition('sku', 'LMS%', 'like')
    ->execute()
    ->fetchAll();

  $option = array();
  foreach ($result as $key => $value ) {
    $option[$value->product_id] = $value->title.'<--->'.$value->sku;
  }
  return $option;
}

function mc_add_just_listed_sold_get_product_addon_list() {
  $result = db_select('commerce_product', 'n')
    ->fields('n')
    ->condition('status', 1)
    ->condition('type', 'just_listed_and_just_sold_option', 'like')
    ->execute()
    ->fetchAll();

  $option = array();
  foreach ($result as $key => $value ) {
    $option[$value->product_id] = $value->title.'<--->'.$value->sku;
  }
  return $option;
}

function mc_add_just_liste_sold_configuration_form_submit($form, &$form_state) {
  $product_id = $form_state['values']['product'];
  $title = $form_state['complete form']['product']['#options'][$product_id];
  $pieces = explode("<--->", $title);
  $productaddon_id = $form_state['values']['addon_product'];
  $titleaddon = $form_state['complete form']['addon_product']['#options'][$productaddon_id];
  $piecesaddon = explode("<--->", $titleaddon);
  db_merge('mc_package_addon_configuration')
  	->key(array('product_id' => $product_id, 'product_addon_id' => $productaddon_id))
  	->fields(array(
  	      'sku' => $pieces[1],
  	      'product_name' => $pieces[0],
  	      'product_id' => $product_id,
  	      'product_addon_sku' => $piecesaddon[1],
  	      'product_addon_name' => $piecesaddon[0],
  	      'product_addon_id' => $productaddon_id,
  	      'addon_unit_price' => $form_state['values']['unit_price'],
  	      'other' => time()
  	))
  	->execute();
    drupal_set_message('Just Listed and Just Sold option has been updated.');
    ctools_include('ajax');
    ctools_add_js('ajax-responder');
    // Tell the browser to close the modal.
    $form_state['ajax_commands'][] = ctools_modal_command_dismiss();
    $form_state['ajax_commands'][]  = ctools_ajax_command_redirect('admin/config/marketing-concierge/mc-package-configuration/just_listed_and_just_sold_options');
}

function mc_edit_delete_package_addon_configuration($id, $addonid, $action, $ajax) {
  if ($ajax) {
    ctools_include('ajax');
    ctools_include('modal');
    // Use ctools to generate ajax instructions for the browser to create
    // a form in a modal popup.
    if ($action == 'edit') {
      $form_id = 'mc_add_just_liste_sold_configuration_form';
      $title = 'Edit a package configuration';
    } else if($action == 'delete') {
      $form_id = 'mc_add_just_liste_sold_configuration_delete';
      $title = 'Delete a package configuration';
    }
    $form_state = array(
      'ajax' => TRUE,
      'title' => $title,
      'data' => $id,
      'addondata' => $addonid,
    );
    $output = ctools_modal_form_wrapper($form_id, $form_state);

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
    return drupal_get_form('mc_add_just_liste_sold_configuration_form');
  }
}

/**
 * Form builder. Delete Mailgun mailing list.
 */
function mc_add_just_liste_sold_configuration_delete($form, &$form_state) {
  $product_id = arg(5);
  $productaddon_id = arg(6);
  $form['product_id'] = array(
    '#type' => 'hidden',
    '#value' => $product_id
  );
  $form['productaddon_id'] = array(
    '#type' => 'hidden',
    '#value' => $productaddon_id
  );
  $form = confirm_form($form,
    'Are you sure, Do you want to delete?',
    'admin/config/marketing-concierge/mc-package-configuration/just_listed_and_just_sold_options',
    'Are you sure, Do you want to delete? The action cannot be undone.',
    'Delete',
    'Cancel'
  );
  return $form;
}

/*
 * Callback : delete mailing list and its members
 *
 */
function mc_add_just_liste_sold_configuration_delete_submit($form, &$form_state) {
  // Required actions here
  drupal_Set_message('Prouct package have been deleted.');
  $product_id = $form_state['values']['product_id'];
  $productaddon_id = $form_state['values']['productaddon_id'];
  db_delete('mc_package_addon_configuration')
    ->condition('product_id', $product_id, '=')
    ->condition('product_addon_id', $productaddon_id, '=')
    ->execute();
  ctools_include('ajax');
  ctools_add_js('ajax-responder');
  // Tell the browser to close the modal.
  $form_state['ajax_commands'][] = ctools_modal_command_dismiss();
  $form_state['ajax_commands'][]  = ctools_ajax_command_redirect('admin/config/marketing-concierge/mc-package-configuration/just_listed_and_just_sold_options');
}
