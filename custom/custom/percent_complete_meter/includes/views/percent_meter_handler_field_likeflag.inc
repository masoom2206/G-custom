<?php
// This file must be at percent_complete_meter/includes/views directory.

/**
 * @file
 * Definition of percent_meter_handler_field_likeflag.
 */

/**
 * Description of what my handler does.
 */
class percent_meter_handler_field_likeflag extends views_handler_field {
	function init(&$view, &$options) {
		parent::init($view, $options);
	}
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
	$data = flag_create_link('bookmarks', $values->nid);
    return $data;
  }
}
