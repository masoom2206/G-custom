<?php
// This file must be at percent_complete_meter/includes/views directory.

/**
 * @file
 * Definition of lms_handler_field_marketing_concierge.
 */

/**
 * Description of what my handler does.
 */
class lms_handler_field_marketing_concierge extends views_handler_field {
   function construct() {

    }
     
    /**
    * Loads additional fields.
    */
    function query() {
    }
     
    /**
    * Default options form.
    */
    function option_definition() {
    $options = parent::option_definition();
    return $options;
    }
     
    /**
    * Creates the form item for the options added.
    */
    function options_form(&$form, &$form_state) {
      parent::options_form($form, $form_state);
    }
  

  /**
   * Renders the field handler.
   */
  function render($values) {
	$title = '';
	//$nid = $values->_field_data['nid']['entity']->field_lms_listing_reference['und']['0']['nid'];
	$nid = $values->nid;
	$order_id = db_select("field_data_field_lms_listing_reference", 'lr');
	$order_id->fields('lr', array('entity_id'));
	$order_id->condition('lr.entity_type', 'commerce_order', 'LIKE');
	$order_id->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$result = $order_id->execute()->fetchField();
	if($result != NULL){
		$order = commerce_order_load($result);
		$line_item = commerce_line_item_load($order->commerce_line_items['und']['0']['line_item_id']);
		$product = commerce_product_load($line_item->commerce_product['und']['0']['product_id']);
		$product_title_class = strtolower(str_replace(" ", "-", $product->title));
		$title = '<div class="'.$product_title_class.'"><span>'.$product->title.'</span></div>';
	}
	return $title;
  }
}
