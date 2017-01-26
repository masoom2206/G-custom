<?php

/**
* Call back function cbone_feed_result_list()
* to displayed CBOne feed result list
*/
function cbone_feed_result_list(){
	drupal_set_title( t('CBOne Feed Result List'));
	//Add search form
	$form = drupal_get_form('search_feed_result_form');
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
			 case 'NRT Property ID':
			   $order = 'feed_nrt_id';
			   break;
			 case 'Agent ID':
			   $order = 'feed_agent_id';
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
	$header = array(
		array('data' => t('Feed Type'), 'width'=>'10%', 'sort' => 'desc'),
		array('data' => t('NRT Property ID'), 'field' => 'feed_nrt_id', 'width'=>'15%', 'sort' => 'desc'),
		array('data' => t('Agent ID'), 'field' => 'feed_agent_id', 'width'=>'10%'),
		array('data' => t('Result Status'), 'field' => 'feed_result_status', 'width'=>'10%'),
		array('data' => t('Date'), 'field' => 'feed_timestamp', 'width'=>'25%'),
		array('data' => t('Result Message'), 'width'=>'40%'),
	);
	$query = db_select("feed_processing_results", "fr");
	$query->fields("fr");
	if(isset($_GET['nrt_id']) && $_GET['nrt_id'] != ''){
		$query->condition("fr.feed_nrt_id", $_GET['nrt_id'], '=');
	}
	if(isset($_GET['agent_id']) && $_GET['agent_id'] != ''){
		$query->condition("fr.feed_agent_id", $_GET['agent_id'], '=');
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
		$feed_date = date("Y-F-d", $data->feed_timestamp);
		//$term = taxonomy_term_load($_GET['feed_type']);
		//$feed_type = $term->name;
		$rows[] = array(
					$data->feed_type,
					$data->feed_nrt_id,
					$data->feed_agent_id,
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
	$output .= theme('pager', array('quantity' => 3));
	return $output;
}

/**
* Drupal form API
* to search Feed Result List
* @return $form
*/
 
function search_feed_result_form($form, &$form_state) {
	
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
		$options[$term->tid] = $term->name;
	}
	
	$form = array();
	$form['search_feed_result'] = array(
		'#type' => 'fieldset',
		'#title' => t('Search Feed Result'),
		'#collapsible' => TRUE,
		'#collapsed' => TRUE,
		'#tree' => TRUE,
	);
	$form['search_feed_result']['feed_type'] = array(
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
	if(isset($form_state['values']['search_feed_result']['feed_type'])) {
		$tid = $form_state['values']['search_feed_result']['feed_type'];
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
	$form['search_feed_result']['date'] = array(
		'#title' => t('Date'),
		'#type' => 'select',
		'#options' => $day_before,
		'#default_value' => isset($_GET['date']) ? $_GET['date'] : ' ',
		'#prefix' => '<div id="date">',
		'#suffix' => '</div>'
	);
	
	$form['search_feed_result']['result_status'] = array(
		'#type' => 'select',
		'#title' => t('Results Status'),
		'#options' => $status,
		'#default_value' => isset($_GET['result_status']) ? $_GET['result_status'] : '',

	);
	$form['search_feed_result']['nrt_id'] = array(
		'#type' => 'textfield',
		'#title' => t('NRT Property ID'),
		'#default_value' => isset($_GET['nrt_id']) ? $_GET['nrt_id'] : '',
		'#size' => 40,
	);
	$form['search_feed_result']['agent_id'] = array(
		'#type' => 'textfield',
		'#title' => t('Agent ID'),
		'#default_value' => isset($_GET['agent_id']) ? $_GET['agent_id'] : '',
		'#size' => 40,
	);
	/*$form['search_feed_result']['date'] = array(
		'#type' => 'date_popup',
		'#title' => t('Date'),
		'#date_format' => 'Y-m-d',
		'#date_year_range' => '-5:+2',
	);*/
	$form['search_feed_result']['actions']['submit'] = array(
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
 
function search_feed_result_form_submit($form, &$form_state) {

	//print "<pre>";print_r($form_state['values']['search_feed_result']['feed_type']);exit;
	$feed_type_id = $form_state['values']['search_feed_result']['feed_type'];
	//$term = taxonomy_term_load($feed_type_id);
	//$feed_type = $term->name;
	$result_status = $form_state['values']['search_feed_result']['result_status'];
	if($result_status == '0') {
		$result_status = '';
	}
	$nrt_id = $form_state['values']['search_feed_result']['nrt_id'];
	$agent_id = $form_state['values']['search_feed_result']['agent_id'];
	$date = $form_state['values']['search_feed_result']['date'];
	//print gettype($date); exit;

	drupal_goto('admin/config/lms/feed-result', array('query' => array('feed_type' => $feed_type_id, 'date' => $date, 'nrt_id' => $nrt_id, 'agent_id' => $agent_id, 'result_status' => $result_status)));
}

function date_dropdown_callback($form, &$form_state) {
		return $form['search_feed_result']['date'];
}

