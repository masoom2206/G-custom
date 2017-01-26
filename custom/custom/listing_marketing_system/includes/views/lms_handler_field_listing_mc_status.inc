<?php
// This file must be at percent_complete_meter/includes/views directory.

/**
 * @file
 * Definition of lms_handler_field_listing_mc_status.
 */

/**
 * Description of what my handler does.
 */
class lms_handler_field_listing_mc_status extends views_handler_field {
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
	$output = 'N/A';
	$nid = $values->nid;
	$node_data = node_load($nid);		$mc_status_tid = isset($node_data->field_mc_status_ref['und']['0']['tid']) ? $node_data->field_mc_status_ref['und']['0']['tid'] : '';		if($mc_status_tid != ''){
		$mc_status_term = taxonomy_term_load($mc_status_tid);				$output = $mc_status_term->name;
	}
	return $output;
  }
}
