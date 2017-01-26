<?php
// This file must be at percent_complete_meter/includes/views directory.

/**
 * @file
 * Definition of cbone_flags_handler_field_flag.
 */

/**
 * Description of what my handler does.
 */
class cbone_flags_handler_field_flag extends views_handler_field {
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
	$pnid = arg(1);
	$cnid = $values->nid;
	$output = cbone_flag_link($pnid, $cnid);
	return $output;
  }
}
