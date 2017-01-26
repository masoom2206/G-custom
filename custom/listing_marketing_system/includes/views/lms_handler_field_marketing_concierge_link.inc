<?php
// This file must be at percent_complete_meter/includes/views directory.

/**
 * @file
 * Definition of lms_handler_field_marketing_concierge_link.
 */

/**
 * Description of what my handler does.
 */
class lms_handler_field_marketing_concierge_link extends views_handler_field {
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
	$link = '';
	//$nid = $values->_field_data['nid']['entity']->field_lms_listing_reference['und']['0']['nid'];
	$nid = $values->nid;
	$order_id = db_select("field_data_field_lms_listing_reference", 'lr');
	$order_id->fields('lr', array('entity_id'));
	$order_id->condition('lr.entity_type', 'commerce_order', 'LIKE');
	$order_id->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$result = $order_id->execute()->fetchField();
	if($result != NULL){
		$order = commerce_order_load($result);
		unset($_SESSION['listing_reference_nid']);
		$link = '<span class="marketing-concierge-link order-page"><a href="user/'.$order->uid.'/orders/'.$result.'"><img src="/sites/all/modules/custom/listing_marketing_system/images/bell-icon-gray-sm.png">&nbsp;Marketing Concierge</a></span>';
		//l('Marketing Concierge', 'user/'.$order->uid.'/orders/'.$result)
	}
	else {
		$link = '<span class="marketing-concierge-link product-page"><a href="marketing-concierge/'.$nid.'"><img src="/sites/all/modules/custom/listing_marketing_system/images/bell-icon-white-sm.png">&nbsp;Order Marketing Concierge</a></span>';
		//l('Order Marketing Concierge', 'marketing-concierge/'.$nid)
	}
	return $link;
  }
}
