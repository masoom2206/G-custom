<?php
/***
**
**/
function mc_package_configuration() {
  ctools_include('modal');
  ctools_include('ajax');
  ctools_modal_add_js();
  $result = db_select('mc_package_configuration', 'n')
    ->fields('n')
    ->execute()
    ->fetchAll();
  $rows = array();
  $header = array('Package Name', 'Just Listed', 'Just Sold', 'Pro Brochures', 'Actions');
  foreach ($result as $key => $value ) {
    $link_edit = l(t('Edit'), 'admin/config/marketing-concierge/mc-package-configuration/package/'.$value->product_id.'/edit/nojs', array('attributes' => array('class' => 'ctools-use-modal')));
    $link_delete = l(t('Delete'), 'admin/config/marketing-concierge/mc-package-configuration/package/'.$value->product_id.'/delete/nojs', array('attributes' => array('class' => 'ctools-use-modal')));
    $rows[] = array($value->product_name, $value->just_listed, $value->just_listed, $value->pro_brochures, $link_edit . ' | ' . $link_delete);
  }
  $data = t('<h1>Package Configuration</h1>');
  $data .= l(t('Add a package configuration'), 'admin/config/marketing-concierge/mc-package-configuration/add/package/nojs', array('attributes' => array('class' => 'ctools-use-modal')));
  $data .= '<br/>';
  return $data .= theme('table', array(
            'header' => $header, 
            'rows' => $rows,
            'attributes' => array('width' => '100%')
        ));
}


function mc_add_package_configuration($ajax) {
  if ($ajax) {
    ctools_include('ajax');
    ctools_include('modal');

    $form_state = array(
      'ajax' => TRUE,
      'title' => t('Add a package configuration'),
    );

    // Use ctools to generate ajax instructions for the browser to create
    // a form in a modal popup.
    $output = ctools_modal_form_wrapper('mc_add_package_configuration_form', $form_state);

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
    return drupal_get_form('mc_add_package_configuration_form');
  }
}


function mc_add_package_configuration_form($form, $form_state) {
  $product = mc_add_package_get_product_list();
  if (isset($form_state['data'])) {
    $id = $form_state['data'];
    $result = db_select('mc_package_configuration', 'n')
      ->fields('n')
      ->condition('product_id', $id,'=')
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
  $form['just_listed'] = array(
    '#type' => 'textfield',
    '#title' => t('Just Listed'),
    '#element_validate' => array('element_validate_integer'),
    '#default_value' => isset($result) ? $result->just_listed : NULL,
    '#required' => TRUE
  );
  $form['just_sold'] = array(
    '#type' => 'textfield',
    '#title' => t('Just Sold'),
    '#default_value' => isset($result) ? $result->just_sold : NULL,
    '#element_validate' => array('element_validate_integer'),
    '#required' => TRUE
  );
  $form['pro_brochures'] = array(
    '#type' => 'textfield',
    '#title' => t('Pro Brochures'),
    '#default_value' => isset($result) ? $result->pro_brochures : NULL,
    '#element_validate' => array('element_validate_integer'),
    '#required' => TRUE
  );
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('submit'),
  );
  return $form;
}

function mc_add_package_configuration_form_submit($form, &$form_state) {
  $product_id = $form_state['values']['product'];
  $title = $form_state['complete form']['product']['#options'][$product_id];
  $pieces = explode("<--->", $title);
  db_merge('mc_package_configuration')
  	->key(array('product_id' => $product_id))
  	->fields(array(
  	      'sku' => $pieces[1],
  	      'product_name' => $pieces[0],
  	      'product_id' => $product_id,
  	      'just_listed' => $form_state['values']['just_listed'],
  	      'just_sold' => $form_state['values']['just_sold'],
  	      'pro_brochures' => $form_state['values']['pro_brochures'],
  	      'other' => time()
  	))
  	->execute();
    drupal_set_message('Package has been updated.');
    ctools_include('ajax');
    ctools_add_js('ajax-responder');
    // Tell the browser to close the modal.
    $form_state['ajax_commands'][] = ctools_modal_command_dismiss();
    $form_state['ajax_commands'][]  = ctools_ajax_command_redirect('admin/config/marketing-concierge/mc-package-configuration');
}

function mc_add_package_get_product_list() {
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

function mc_edit_delete_package_configuration($id, $action, $ajax) {
  if ($ajax) {
    ctools_include('ajax');
    ctools_include('modal');


    // Use ctools to generate ajax instructions for the browser to create
    // a form in a modal popup.
    if ($action == 'edit') {
      $form_id = 'mc_add_package_configuration_form';
      $title = 'Edit a package configuration';
    } else if($action == 'delete') {
      $form_id = 'mc_add_package_configuration_delete';
      $title = 'Delete a package configuration';
    }
    $form_state = array(
      'ajax' => TRUE,
      'title' => $title,
      'data' => $id
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
    return drupal_get_form('mc_add_package_configuration_form');
  }
}

/**
 * Form builder. Delete Mailgun mailing list.
 */
function mc_add_package_configuration_delete($form, &$form_state) {
  $product_id = arg(5);
  $form['product_id'] = array(
    '#type' => 'hidden',
    '#value' => $product_id
  );
  $form = confirm_form($form,
    'Are you sure, Do you want to delete?',
    'admin/config/marketing-concierge/mc-package-configuration',
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
function mc_add_package_configuration_delete_submit($form, &$form_state) {
  // Required actions here
  drupal_Set_message('Prouct package have been deleted.');
  $product_id = $form_state['values']['product_id'];
  db_delete('mc_package_configuration')
    ->condition('product_id', $product_id, '=')
    ->execute();
  ctools_include('ajax');
  ctools_add_js('ajax-responder');
  // Tell the browser to close the modal.
  $form_state['ajax_commands'][] = ctools_modal_command_dismiss();
  $form_state['ajax_commands'][]  = ctools_ajax_command_redirect('admin/config/marketing-concierge/mc-package-configuration');
}
