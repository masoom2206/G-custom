<?php
// This file must be at percent_complete_meter/includes/views directory.

/**
 * @file
 * Definition of complete_not_complete_img_handler.
 */

/**
 * Description of what my handler does.
 */
class complete_not_complete_img_handler extends views_handler_field {
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
	$data = 'No Image!';
	
	if(isset($values->_field_data['nid']['entity']->field_fav_completed_class['und']['0']['value'])) {
		$fav_completed_class = $values->_field_data['nid']['entity']->field_fav_completed_class['und']['0']['value'];
		$percent = custom_percent_meter_status($values->nid, 2, 'percent');
		if($fav_completed_class == 'fav-completed-white' && $percent == 100){
			$data = '<img src="/sites/default/files/images/icon/flag/completed_gray.png" border="0">';
		}
		else if($fav_completed_class == 'fav-completed-white' && $percent < 100){
			$data = '<img src="/sites/default/files/images/icon/flag/not-completed-gray.png" border="0">';
		}
		else if($fav_completed_class == 'fav-completed-gray' && $percent == 100){
			$data = '<img src="/sites/default/files/images/icon/flag/completed-white.png" border="0">';
		}
		else if($fav_completed_class == 'fav-completed-gray' && $percent < 100){
			$data = '<img src="/sites/default/files/images/icon/flag/not-completed-white.png" border="0">';
		}
	}
    return $data;
	//print "<pre>";print_r($values);
  }
}
