<?php
// This file must be at percent_complete_meter/includes/views directory.

/**
 * @file
 * Definition of network_handler_field_user_office.
 */

/**
 * Description of what my handler does.
 */
class network_handler_field_user_office extends views_handler_field {
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
	$office = 'Guest Office';
	if(isset($values->users_node_uid)) {
		$user_detail = user_load($values->users_node_uid);
		if(isset($user_detail->field_member_office['und']['0']['value'])) {
			$office_id = $user_detail->field_member_office['und']['0']['value'];
			$office_title = db_select("node", 'n');
			$office_title->fields('n', array('title'));
			$office_title->join('field_data_field_office_id', 'ofi', 'n.nid = ofi.entity_id');
			$office_title->condition('ofi.field_office_id_value', $office_id, '=');
			$office = $office_title->execute()->fetchField();
		}
	}
	return $office;
  }
}
