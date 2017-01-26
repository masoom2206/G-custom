<?php

/**
* Call back function cbone_lms_sales_team_feed_result_list()
* to displayed CBOne feed result list
*/
function cbone_lms_sales_team_feed_result_list(){
	drupal_set_title( t('CBOne LMS Sales Team Feed Result List'));
	//Add search form
	$form = drupal_get_form('search_sales_team_result_form');
	$output = drupal_render($form);
	if(isset($_GET['feed_type']) && $_GET['feed_type'] !='' && is_numeric($_GET['feed_type'])) {
		$term = taxonomy_term_load($_GET['feed_type']);
		$feed_type = $term->name;
	}
	if(isset($_GET['result_status'])) {
		$result_status = $_GET['result_status'];
	}
	
	 // Ascending or Descending sort feed's results
	if(isset($_GET['sort']) && isset($_GET['order'])){
  
		  if($_GET['sort'] == 'asc') {
			$sort = 'ASC';
		  }
		  else {
			$sort = 'DESC';
		  }
		   // Which column will be sorted
		   switch($_GET['order']){
			 case 'NRT Team ID':
			   $order = 'field_nrt_team_id';
			   break;
			 case 'Metro ID':
			   $order = 'field_stf_metro_id';
			   break;
			 case 'UniqueID':
			   $order = 'field_person_id';
			   break;
			 case 'PrimaryMember':
			   $order = 'field_prim_num';
			   break;
			 case 'Result Status':
			   $order = 'feed_result_status';
			   break;
			 case 'Date':
			   $order = 'feed_timestamp';
			   break;
			
			 default:
			   break;
		   }
		}
		else {
		   // Default sort
		   $sort = 'DESC';
		   $order = 'result_id';
		}
	if($_GET['feed_type'] == 541){
		$header = array(
			array('data' => t('Feed Type'), 'width'=>'10%', 'sort' => 'desc'),
			array('data' => t('Team Name'), 'width'=>'10%'),
			array('data' => t('NRT Team ID'), 'field' => 'field_nrt_team_id', 'width'=>'15%', 'sort' => 'desc'),
			array('data' => t('Result Status'), 'field' => 'feed_result_status', 'width'=>'10%'),
			array('data' => t('Date'), 'field' => 'feed_timestamp', 'width'=>'11%'),
			array('data' => t('Result Message'), 'width'=>'40%'),
		);
		$query = db_select("sales_team_feed_processing_results", "fr");
		$query->fields("fr");
		if(isset($_GET['field_nrt_team_id']) && $_GET['field_nrt_team_id'] != ''){
			$query->condition("fr.field_nrt_team_id", $_GET['field_nrt_team_id'], '=');
		}
		if(isset($_GET['feed_file_name']) && $_GET['feed_file_name'] != ''){
			$query->condition("fr.feed_file_name", $_GET['feed_file_name'], '=');
		}
		if(isset($_GET['field_stf_metro_id']) && $_GET['field_stf_metro_id'] != ''){
			$query->condition("fr.field_stf_metro_id", $_GET['field_stf_metro_id'], '=');
		}
		if(isset($_GET['feed_type']) && $_GET['feed_type'] != '' && is_numeric($_GET['feed_type'])){
			$query->condition("fr.feed_type", $feed_type, '=');
		}
		if(isset($_GET['result_status']) && $_GET['result_status'] != ''){
			$query->condition("fr.feed_result_status", $result_status, '=');
		}
		if(isset($_GET['date']) && $_GET['date'] != '' && $_GET['date'] != '_none') {
			$date_time = $_GET['date'];
			$query->where("FROM_UNIXTIME(fr.feed_timestamp, '%d-%m-%Y') = :date_time", array(':date_time' => $date_time));
		}
		$order = $query->orderBy($order, $sort);
		$pager = $query->extend('TableSort')->extend('PagerDefault')->limit(20);
		$result = $pager->execute();
		$rows = array();
		while($data = $result->fetchObject()){
			$feed_date = date("F d, Y", $data->feed_timestamp);
			//$term = taxonomy_term_load($_GET['feed_type']);
			//$feed_type = $term->name;
			$check_team_id = db_query("select entity_id from field_data_field_nrt_team_id where field_nrt_team_id_value = :team_id", array(":team_id" => trim($data->field_nrt_team_id)))->fetchField();
			$node_load = node_load($check_team_id);
			$rows[] = array(
						$data->feed_type,
						$node_load->title,
						$data->field_nrt_team_id,
						$data->feed_result_status,
						$feed_date,
						$data->feed_result_message,
					);
		}
		$output .= theme('table',
			array(
				'header' => $header,
				'rows'=> $rows,
				'attributes' => array('class' => array('feed-result-status-list')),
				'sticky' => TRUE,
				'empty' => 'No feed result status Found!',
				)
			);
	}
	if($_GET['feed_type'] == 542){
		$header = array(
			array('data' => t('Feed Type'), 'width'=>'10%', 'sort' => 'desc'),
			array('data' => t('User Name'), 'width'=>'10%'),
			array('data' => t('NRT Team ID'), 'field' => 'field_nrt_team_id', 'sort' => 'desc'),
			array('data' => t('Unique ID'), 'field' => 'field_person_id', 'width'=>'10%'),
			array('data' => t('Primary Member'), 'field' => 'field_prim_num', 'width'=>'10%'),
			array('data' => t('Result Status'), 'field' => 'feed_result_status', 'width'=>'10%'),
			array('data' => t('Date'), 'field' => 'feed_timestamp', 'width'=>'11%'),
			array('data' => t('Result Message'), 'width'=>'40%'),
		);
		$query = db_select("sales_team_member_feed_processing_results", "fr");
		$query->fields("fr");
		if(isset($_GET['field_nrt_team_id']) && $_GET['field_nrt_team_id'] != ''){
		$query->condition("fr.field_nrt_team_id", $_GET['field_nrt_team_id'], '=');
		}
		if(isset($_GET['feed_file_name']) && $_GET['feed_file_name'] != ''){
			$query->condition("fr.feed_file_name", $_GET['feed_file_name'], '=');
		}
		if(isset($_GET['field_person_id']) && $_GET['field_person_id'] != ''){
			$query->condition("fr.field_person_id", $_GET['field_person_id'], '=');
		}
		if(isset($_GET['field_prim_num']) && $_GET['field_prim_num'] != ''){
			$query->condition("fr.field_prim_num", $_GET['field_prim_num'], '=');
		}
		if(isset($_GET['feed_type']) && $_GET['feed_type'] != '' && is_numeric($_GET['feed_type'])){
			$query->condition("fr.feed_type", $feed_type, '=');
		}
		if(isset($_GET['result_status']) && $_GET['result_status'] != ''){
			$query->condition("fr.feed_result_status", $result_status, '=');
		}
		if(isset($_GET['date']) && $_GET['date'] != '' && $_GET['date'] != '_none') {
			$date_time = $_GET['date'];
			$query->where("FROM_UNIXTIME(fr.feed_timestamp, '%d-%m-%Y') = :date_time", array(':date_time' => $date_time));
		}
		$order = $query->orderBy($order, $sort);
		$pager = $query->extend('TableSort')->extend('PagerDefault')->limit(20);
		$result = $pager->execute();
		$rows = array();
		while($data = $result->fetchObject()){
			$feed_date = date("F d, Y", $data->feed_timestamp);
			//$term = taxonomy_term_load($_GET['feed_type']);
			//$feed_type = $term->name;
			$check_uid_exists = db_query("SELECT person.entity_id FROM field_data_field_escalet_prsid person LEFT JOIN users u on person.entity_id = u.uid WHERE person.field_escalet_prsid_value = :UniqueID", array(":UniqueID" => trim($data->field_person_id)))->fetchField();
			$user_load = user_load($check_uid_exists);
			if(!empty($user_load->name)){
				$uname = ucfirst(strtolower($user_load->name));
			}
			else{
				$uname = "****************";
			}
			
			$rows[] = array(
						$data->feed_type,
						$uname,
						$data->field_nrt_team_id,
						$data->field_person_id,
						$data->field_prim_num,
						$data->feed_result_status,
						$feed_date,
						$data->feed_result_message,
					);
		}
		$output .= theme('table',
			array(
				'header' => $header,
				'rows'=> $rows,
				'attributes' => array('class' => array('feed-result-status-list')),
				'sticky' => TRUE,
				'empty' => 'No feed result status Found!',
				)
			);
	}
	
	$output .= theme('pager', array('quantity' => 3));
	return $output;
}

/**
* Drupal form API
* to search Feed Result List
* @return $form
*/
 
function search_sales_team_result_form($form, &$form_state) {
	
	$v = taxonomy_vocabulary_machine_name_load('feeds');
	$terms = taxonomy_get_tree($v->vid);
	if(isset($_GET['feed_type'])) {
		$term = taxonomy_term_load($_GET['feed_type']);
		//if(is_array($term->field_results_retention) && count($term->field_results_retention) > 1) {
			$retention = isset($term->field_results_retention['und']['0']['value']) ? $term->field_results_retention['und']['0']['value'] : '';
		//}
		
	}

	$options = array(' ' => '----Select----');
	$status = array('0' => '----Select----', 'Fail' => 'Fail', 'Success' => 'Success');
	foreach ($terms as $term) {
		if($term->tid == 541 || $term->tid == 542){
			$options[$term->tid] = $term->name;
		}
	}
	
	$form = array();
	$form['search_sales_team_result_form'] = array(
		'#type' => 'fieldset',
		'#title' => t('Search Feed Result'),
		'#collapsible' => TRUE,
		'#collapsed' => TRUE,
		'#tree' => TRUE,
	);
	$form['search_sales_team_result_form']['feed_type'] = array(
		'#title' => t('Feed Type'),
		'#type' => 'select',
		'#options' => $options,
		'#default_value' => isset($_GET['feed_type']) ? $_GET['feed_type'] : ' ',
		'#required' => TRUE,
		'#ajax' => array(
					'callback' => 'date_dropdown_callback',
					'wrapper' => 'date',
					),
	);
	if(isset($form_state['values']['search_sales_team_result_form']['feed_type'])) {
		$tid = $form_state['values']['search_sales_team_result_form']['feed_type'];
		$term = taxonomy_term_load($tid);
		$retention = $term->field_results_retention['und']['0']['value'];
	}
    // Date populated based on Rentention days	
	//$date = date("d-m-Y H:i:s");
	$date = date("d-m-Y");
	$i = 0;
	$j = isset($retention) ? $retention : '';
	$day_before = array('_none' => '--Select Date--');
	for($i; $j > $i; $i++ ) {
		//$day_before[strtotime( $date . ' -'.$i.' day' )] = date( 'd-m-Y', strtotime( $date . ' -'.$i.' day' ) );
		$day_before[date('d-m-Y', strtotime($date.' -'.$i.' day'))] = date('d-m-Y', strtotime($date.' -'.$i.' day'));
	}
	$form['search_sales_team_result_form']['date'] = array(
		'#title' => t('Date'),
		'#type' => 'select',
		'#options' => $day_before,
		'#default_value' => isset($_GET['date']) ? $_GET['date'] : ' ',
		'#prefix' => '<div id="date">',
		'#suffix' => '</div>'
	);
	
	$form['search_sales_team_result_form']['result_status'] = array(
		'#type' => 'select',
		'#title' => t('Results Status'),
		'#options' => $status,
		'#default_value' => isset($_GET['result_status']) ? $_GET['result_status'] : '',

	);
	$form['search_sales_team_result_form']['field_nrt_team_id'] = array(
		'#type' => 'textfield',
		'#title' => t('NRT Team ID'),
		'#default_value' => isset($_GET['field_nrt_team_id']) ? $_GET['field_nrt_team_id'] : '',
		'#size' => 40,
	);
	if($term->tid == 541){
		$form['search_sales_team_result_form']['field_stf_metro_id'] = array(
			'#type' => 'textfield',
			'#title' => t('Metro ID'),
			'#default_value' => isset($_GET['field_stf_metro_id']) ? $_GET['field_stf_metro_id'] : '',
			'#size' => 40,
		);
	}
	if($term->tid == 542){
		$form['search_sales_team_result_form']['field_person_id'] = array(
			'#type' => 'textfield',
			'#title' => t('Person ID'),
			'#default_value' => isset($_GET['field_person_id']) ? $_GET['field_person_id'] : '',
			'#size' => 40,
		);
	}
	$form['search_sales_team_result_form']['actions']['submit'] = array(
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
function search_sales_team_result_form_submit($form, &$form_state) {

	//print "<pre>";print_r($form);exit;
	
	$feed_type_id = $form_state['values']['search_sales_team_result_form']['feed_type'];
	//$term = taxonomy_term_load($feed_type_id);
	//$feed_type = $term->name;
	$result_status = $form_state['values']['search_sales_team_result_form']['result_status'];
	if($result_status == '0') {
		$result_status = '';
	}
	$team_id = $form_state['values']['search_sales_team_result_form']['field_nrt_team_id'];
	$metro_id = $form_state['values']['search_sales_team_result_form']['field_stf_metro_id'];
	$person_id = $form_state['values']['search_sales_team_result_form']['field_person_id'];
	$primary_num = $form_state['values']['search_sales_team_result_form']['field_prim_num'];
	$date = $form_state['values']['search_sales_team_result_form']['date'];
	//print gettype($date); exit;
	if($feed_type_id == 541){
		drupal_goto('admin/config/lst/feed-result', array('query' => array('feed_type' => $feed_type_id, 'date' => $date, 'field_nrt_team_id' => $team_id, 'field_stf_metro_id' => $metro_id, 'result_status' => $result_status)));
	}
	if($feed_type_id == 542){
		drupal_goto('admin/config/lst/feed-result', array('query' => array('feed_type' => $feed_type_id, 'date' => $date, 'field_nrt_team_id' => $team_id,  'field_prim_num' => $primary_num, 'field_person_id' => $person_id, 'result_status' => $result_status)));
	}
}

function date_dropdown_callback($form, &$form_state) {
		return $form['search_sales_team_result_form']['date'];
}
