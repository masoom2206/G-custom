<?php
// This file must be at percent_complete_meter/includes/views directory.

/**
 * @file
 * Definition of lms_handler_field_listing_videos_count.
 */

/**
 * Description of what my handler does.
 */
class lms_handler_field_listing_videos_count extends views_handler_field {
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
	$videos_count = '0';
	//$nid = $values->_field_data['nid']['entity']->field_lms_listing_reference['und']['0']['nid'];
	$nid = $values->nid;
	$order_id = db_select("field_data_field_lms_listing_reference", 'lr');
	$order_id->fields('lr', array('entity_id'));
	$order_id->condition('lr.entity_type', 'node', 'LIKE');
	$order_id->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$result = $order_id->execute()->fetchField();
	if($result != NULL){
		$photos_id = db_select("field_data_field_lms_listing_video", 'lv');
		$photos_id->fields('lv');
		$photos_id->condition('lv.entity_type', 'node', 'LIKE');
		$photos_id->condition('lv.entity_id', $result, '=');
		$videos_count = $photos_id->execute()->rowCount();
	}
	return 'Videos '.$videos_count;
  }
}
