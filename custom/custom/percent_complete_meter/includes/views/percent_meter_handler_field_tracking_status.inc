<?php
// This file must be at percent_complete_meter/includes/views directory.

/**
 * @file
 * Definition of percent_meter_handler_field_tracking_status.
 */

/**
 * Description of what my handler does.
 */
class percent_meter_handler_field_tracking_status extends views_handler_field {
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
		$options['percent_meter_flag'] = array('default' => FALSE, 'bool' => TRUE);
		return $options;
    }
     
    /**
    * Creates the form item for the options added.
    */
    function options_form(&$form, &$form_state) {
		$options = array();
		$result = db_query("SELECT * FROM flag");
		foreach ($result as $flag) {
			$options[$flag->fid] = $flag->title;
		}
		$form['percent_meter_flag'] = array(
			'#type' => 'select',
			'#title' => t('Selected Flag'),
			'#options' => $options,
			'#default_value' => $this->options['percent_meter_flag'],
			'#description' => t('Select flag to displayed percent meter.'),
		);
      parent::options_form($form, $form_state);
    }
  

  /**
   * Renders the field handler.
   */
  function render($values) {
	$data = '';
	if(isset($this->options['percent_meter_flag'])) {
		$fid = $this->options['percent_meter_flag'];
		$data = percent_meter_status($values->nid, $fid);
	}
    return $data;
  }
}
