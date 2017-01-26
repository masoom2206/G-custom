<?php
/**
 * @file
 * Service functions
 */

/**
 * Callback function user_percent_tracking for admin
 * to displayed the user list with percent meter.
 **/
function user_percent_tracking(){
	//Select saved percent_tracking
	drupal_set_title( t('User Percent Meter Tracking'));
	
	//Add search form
	$form = drupal_get_form('search_user_percent_meter_form');
	$output = drupal_render($form);

	$header = array(
		array('data' => t('UID'),'field' => 'uid', 'width'=>'10%'),
		array('data' => t('Name'),'field' => 'name', 'width'=>'20%'),
		array('data' => t('Percent Meter'), 'width'=>'60%'),
		array('data' => t('Operation'), 'width'=>'10%'),
	);
	
	//Fetch the data from bookings table
	$user_query = db_select("users", "u");
	$user_query->fields("u", array('uid', 'name'));
	$user_query->condition("u.uid", '0', '<>');
	if(isset($_GET['uid']) && $_GET['uid'] != ''){
		$user_query->condition("u.uid", $_GET['uid'], '=');
	}
	$table_sort = $user_query->extend('TableSort')->orderByHeader($header);
	$pager = $table_sort->extend('PagerDefault')->limit(20);
	$result = $pager->execute();

	$rows = array();
	// Looping for filling the table rows
	$path = current_path();
	foreach ($result as $user_data) {
		$user_percent_meter = user_percent_meter($user_data->uid);
		$rows[] = array(
				$user_data->uid,
				ucwords($user_data->name),
				$user_percent_meter,
				'<span class="show-hide-meter" uid="'.$user_data->uid.'">'.t('Show All Meter').'</span>',
			);
	}
	$output .= theme('table',
		array(
			'header' => $header,
			'rows'=> $rows,
			'attributes' => array('class' => array('user-percent-meter-table')),
			'sticky' => TRUE,
			'empty' => 'No user found!',
			)
		);
	$output .= theme('pager', array('quantity' => 3));
	return $output;
}

/**
 * Callback function user_percent_meter
 * to generate percent meter.
 **/

function user_percent_meter($uid){
	$section_meter = '';
	$total_percent = 0;
	$total_count = 0;
	$total_percent_meter = '';
	$total_percent_display = "0%";
	$total_percent_display_width = "8%";
	$percent = "0%";
	$percent_width = "3%";
	$output = '';
	//fetch data from percent_complete table
	$query = db_select("percent_complete", "pc");
	$query->join('percent_tracking', 'pt', 'pt.pcid = pc.pcid');		
	$query->condition("pt.tracking_status", '1', '=');
	$query->condition("pc.parent_entity_id", '0', '<>');
	$query->fields("pc");
	$result = $query->execute();
	while($data = $result->fetchObject()){
		$query1 = db_select("percent_complete_child", "pcc");
		$query1->fields("pcc", array('child_entity_id'));
		$query1->condition("pcc.pcid", $data->pcid, '=');
		$result1 = $query1->execute();
		$x = 0; $y = 0;
		foreach($result1 as $child_entity_ids) {
			$entity_id = $child_entity_ids->child_entity_id;
			//$user_flags = flag_get_user_flags('node', $entity_id, $uid);
			$user_flags = details_page_completed_flagged($entity_id, 2, $uid);
			if($user_flags == 0) {
				$y = $y + 1;
			}
			else {
				$x = $x + 1;
				$y = $y + 1;
			}
		}
		if($x != 0 && $y != 0) {
			$percent = round($x/$y*100);
			$percent = $percent."%";
			$percent_width = $percent;
			$total_percent = $total_percent + $percent;
			$total_count = $total_count + 1;
		}
		$parent_entity = node_load($data->parent_entity_id);
		$section = ucwords(t($parent_entity->title)).' section Detail pages';
		$section_meter .= $section.'! <div class="percent-meter"><div style="width: '.$percent_width.'!important">'.$percent.'</div></div><br/>';
	}
	if($total_count != 0) {
		$total_count = $total_count*100;
		$total_percent_display = round($total_percent/$total_count*100);
		$total_percent_display = $total_percent_display."%";
		$total_percent_display_width = $total_percent_display;
	}
	$total_percent_meter = '<div class="percent-meter percent-meter-'.$uid.'"><div style="width: '.$total_percent_display_width.'!important">'.$total_percent_display.'</div></div><br/>';
	
	$output = $total_percent_meter.'<div class="user-section-meter user-section-meter-'.$uid.'" style="display:none;">'.$section_meter.'</div>';
	return $output;
}

/**
 * Drupal form API
 * to search user level
 * @return $form
 */
function search_user_percent_meter_form($form, &$form_state) {
	$form['search_user_level'] = array(
		'#type' => 'fieldset',
		'#title' => t('Search User Percent Meter'),
		'#collapsible' => TRUE,
		'#collapsed' => TRUE,
		'#tree' => TRUE,
	);
	$form['search_user_level']['user'] = array(
		'#type' => 'textfield',
		'#title' => t('Enter User Name/E-mail'),
		'#size' => 40,
		'#required' => TRUE,
		'#autocomplete_path' => 'user-autocomplete'
	);
	$form['search_user_level']['actions']['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Search'),
		'#required' => TRUE,
	);
	return $form;
}

/**
 * Drupal form API
 * submit Daily Quiz Question form
 */
function search_user_percent_meter_form_submit($form, &$form_state) {
	$search_user = $form_state['values']['search_user_level']['user'];
	$uid = db_query("SELECT uid FROM users WHERE (name = :user OR mail = :user)", array(':user' => $search_user))->fetchField();
	drupal_goto('admin/config/pcm/user/tracking', array('query' => array('uid' => $uid)));
	//print "<pre>";print_r($form_state['values']);exit;
}