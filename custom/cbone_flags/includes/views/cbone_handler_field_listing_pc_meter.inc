<?php
// This file must be at percent_complete_meter/includes/views directory.

/**
 * @file
 * Definition of cbone_handler_field_listing_pc_meter.
 */

/**
 * Description of what my handler does.
 */
class cbone_handler_field_listing_pc_meter extends views_handler_field {
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
	$pnid = $values->nid;
	$cnid = $values->nid;
	$output = cbone_listing_percent_meter($pnid, $cnid);
	/*$output = '<div class="listing-pc-meter">
	<div class="width-100-number"><div class="number-100"><span class="meter-number">'.$percent.'%</span></div></div>
	<div class="width-100"><div class="width-34" percent="'.$percent.'"><span class="meter-point">&nbsp;</span></div></div>
		</div>';*/
	return $output;
  }
}
