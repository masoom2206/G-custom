<?php
// This file must be at percent_complete_meter/includes/views directory.

/**
 * @file
 * Definition of network_handler_field_post_like.
 */

/**
 * Description of what my handler does.
 */
class network_handler_field_post_like extends views_handler_field {
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
	global $user;
	$uid=$user->uid;
	$nid = $values->nid;
	$flag = flag_get_flag('like');
	$like_flag = flag_create_link("like", $nid);

	$count =  $flag->get_count($nid);
	$counts = $like_flag.''.$count;
	return $counts;
  }
}
