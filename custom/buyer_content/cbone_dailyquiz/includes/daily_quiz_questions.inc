<?php
/**
 * @file
 * Service functions
 */

/**
 * Call back function daily_quiz_user_list()
 * to displayed daily quiz questions list
 **/
function daily_quiz_user_list(){
	drupal_set_title( t('Daily Quiz User Level List'));
	//Add search form
	$form = drupal_get_form('search_user_level_form');
	$output = drupal_render($form);

	$header = array(
		array('data' => t('User Name'), 'width'=>'20%'),
		array('data' => t('Level Completed'), 'width'=>'40%'),
		array('data' => t('Total Yes'), 'width'=>'10%'),
		array('data' => t('Total No'), 'width'=>'10%'),
		array('data' => t('Last answer date'), 'width'=>'15%'),
		array('data' => t('Operation'), 'width'=>'5%'),
	);
	$query = db_select("dailyquiz_user_last", "ul");
	$query->fields("ul");
	if(isset($_GET['uid']) && $_GET['uid'] != ''){
		$query->condition("ul.uid", $_GET['uid'], '=');
	}	
	$pager = $query->extend('PagerDefault')->limit(10);
	$result = $pager->execute();
	$rows = array();
	while($data = $result->fetchObject()){
		$user_detail = user_load($data->uid);
		$user_name = isset($user_detail->field_preferred_name['und']['0']['value']) ? $user_detail->field_preferred_name['und']['0']['value'] : ucwords($user_detail->name);
		if($data->last_level != 177) {
			if($data->question_count == 5) {
				$last_level = $data->last_level;
			}
			else {
				$last_level = $data->last_level - 1;
			}
		}
		else {
			$last_level = $data->last_level;
		}
		$term = taxonomy_term_load($last_level);
		$completed_level = get_quiz_level_number($last_level);
		$level = '<div class="level-completed">'.$term->name.'<br/><img src="/sites/default/files/images/quiz/badges/badge-icon-'.$completed_level.'-active.png" width="100">';
		
		$query_answeer = db_select("dailyquiz_answer", "qa");
		$query_answeer->fields("qa");
		$query_answeer->condition("qa.uid", $data->uid, '=');
		$query_answeer->condition("qa.answer_status", '0', '<>');
		$result_answeer = $query_answeer->execute();
		$answeer_count = $result_answeer->rowCount();
		
		$answer_no = ($data->answer_status == 0) ? 1 : 0;
		$answer_date = date("Y-F-d", $data->timestamp);
		$rows[] = array(
					$user_name.'<br/>'.$user_detail->mail,
					$level,
					$answeer_count,
					$answer_no,
					$answer_date,
					l('Delete', 'admin/config/daily-quiz/delete/'.$user_detail->uid, array('attributes' => array('class' => array('delete-daily-quiz')))),
				);
	}
	$output .= theme('table',
		array(
			'header' => $header,
			'rows'=> $rows,
			'attributes' => array('class' => array('user-daily-quiz-list-table')),
			'sticky' => TRUE,
			'empty' => 'No level found!',
			)
		);
	$output .= theme('pager', array('quantity' => 3));
	return $output;
}
/**
 * Drupal form API
 * to search user level
 * @return $form
 */
function search_user_level_form($form, &$form_state) {
	$form['search_user_level'] = array(
		'#type' => 'fieldset',
		'#title' => t('Search User Level'),
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
function search_user_level_form_submit($form, &$form_state) {
	$search_user = $form_state['values']['search_user_level']['user'];
	$uid = db_query("SELECT uid FROM users WHERE (name = :user OR mail = :user)", array(':user' => $search_user))->fetchField();
	drupal_goto('admin/config/daily-quiz/user-list', array('query' => array('uid' => $uid)));
	//print "<pre>";print_r($form_state['values']);exit;
}
/**
 * Drupal form API
 * to delte user daily quiz
 * @return $form
 */
function delete_user_daily_quiz_form($form, &$form_state, $uid) {
	$user_detail = user_load($uid);
	$user_name = isset($user_detail->field_preferred_name['und']['0']['value']) ? $user_detail->field_preferred_name['und']['0']['value'] : ucwords($user_detail->name);
	$form = array();
	$form['uid'] = array(
		'#type' => 'value',
		'#value' => $uid,
	);
	return confirm_form(
		$form,
		t('Are you sure you want to delete user quiz for "'.$user_name.'"?'),
		'admin/config/daily-quiz/user-list',
		t('This action cannot be undone.'),
		t('Delete'),
		t('Cancel')
	);
	return $form;
}
/**
 * submit handler for the delete_user_daily_quiz_form
 * this function is invoked only when the user clicks confirm button
 * clickin on cancel, the user goes back to the $path
 */
function delete_user_daily_quiz_form_submit($form, &$form_state) {
	if($form_state['values']['confirm'] == 1) {
		$uid = $form_state['values']['uid'];
		$num_deleted = db_delete('dailyquiz_answer')
			->condition('uid', $uid)
			->execute();
		$num_deleted = db_delete('dailyquiz_user_last')
			->condition('uid', $uid)
			->execute();
		$user_detail = user_load($uid);
		$user_name = isset($user_detail->field_preferred_name['und']['0']['value']) ? $user_detail->field_preferred_name['und']['0']['value'] : ucwords($user_detail->name);
		drupal_set_message('User quiz for "'.$user_name.'" has deleted successfully.');
	}
	$form_state['redirect'] = 'admin/config/daily-quiz/user-list';
}