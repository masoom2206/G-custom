<?php
// This file must be at percent_complete_meter/includes/views directory.

/**
 * @file
 * Definition of region_handler_filter_node_region.
 */

/**
 * Description of what my handler does.
 */
class region_handler_filter_node_region extends views_handler_filter  {
	function admin_summary() { }
	function operator_form(&$form, &$form_state) { }
	function can_expose() {
		return FALSE;
	}
	function options_form(&$form, &$form_state) {
		$form['markup'] = array(
		  '#markup' => '<div class="form-item description">' . t('The handler for filter the node list by user region. If you have used term_reference field "field_region" in content type and user profile then the handle will match the user "field_region" data with content type "field_region" data and displayed the node list.') . '</div>',
		);
	}
	function query() {
		global $user;
		if($user->uid > 0){
			$user_detail = user_load($user->uid);
			$area_tid = array();
			if(isset($user_detail->field_region['und'][0]['tid'])) {
				foreach($user_detail->field_region['und'] as $tids) {
					$area_tid[] = $tids['tid'];
				}
			}
			$table = $this->ensure_my_table();
			$join = new views_join();
			$join->construct('field_data_field_region', $this->table_alias, 'nid', 'entity_id');
			$this->query->ensure_table('field_data_field_region', $this->relationship, $join);		
			$this->query->add_where($this->options['group'], "field_data_field_region.entity_type", 'node', "=");
			$this->query->add_where($this->options['group'], "field_data_field_region.field_region_tid", $area_tid, "IN");
			$this->query->add_groupby('node.nid');
			$this->query->add_having_expression(0, "COUNT(*) >= 1");
		}
	}
}
