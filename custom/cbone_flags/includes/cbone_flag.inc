<?php
/**
 * Callback function cbone_flag_page()
 * to manage the step by step flagging
 * @return $output
 **/
function cbone_flag_page($ajax, $action, $pnid, $cnid){
	global $user;
	$is_ajax = $ajax === 'ajax';
	if($action == 'flag') {
		$id = db_merge('cbone_flags')
				->key(array('pnid' => $pnid, 'cnid' => $cnid, 'uid' => $user->uid))
				->fields(array(
					'flag' => 1,
					'timestamp' => REQUEST_TIME,
				))
				->execute();
		if ($is_ajax) {
			$commands = array();
			$selector = ".cbone-flag-$pnid-$cnid";
			//$commands[] = ajax_command_replace($selector, '<div class="cbone-unflag">'.l(t('Un Flag'), 'cbone/nojs/unflag/'.$pnid.'/'.$cnid, array('attributes' => array('class' => 'use-ajax'))).'</div>');
			$commands[] = ajax_command_replace($selector, '<div class="cbone-flag-'.$pnid.'-'.$cnid.' cbone-flag-div"><a href="/cbone/nojs/unflag/'.$pnid.'/'.$cnid.'" class="use-ajax"><img src="/sites/default/files/images/icon/flag/completed_gray.png" border="0"></a></div>');
			return array(
			  '#type' => 'ajax',
			  '#commands' => $commands,
			);
		}
		else {
			drupal_set_message(t('Deleted 1 message'));
			drupal_goto();
		}
	}
	else if($action == 'unflag'){
		$id = db_update('cbone_flags')
			->fields(array(
				'flag' => 0,
				'timestamp' => REQUEST_TIME,
			))
			->condition('pnid', $pnid, '=')
			->condition('cnid', $cnid, '=')
			->condition('uid', $user->uid, '=')
			->execute();
		if ($is_ajax) {
			$commands = array();
			$selector = ".cbone-flag-$pnid-$cnid";
			//$commands[] = ajax_command_replace($selector, '<div class="cbone-flag">'.l(t('Flag'), 'cbone/nojs/flag/'.$pnid.'/'.$cnid, array('attributes' => array('class' => 'use-ajax'))).'</div>');
			$commands[] = ajax_command_replace($selector, '<div class="cbone-flag-'.$pnid.'-'.$cnid.' cbone-flag-div"><a href="/cbone/nojs/flag/'.$pnid.'/'.$cnid.'" class="use-ajax"><img src="/sites/default/files/images/icon/flag/not-completed-gray.png" border="0"></a></div>');
			return array(
			  '#type' => 'ajax',
			  '#commands' => $commands,
			);
		}
		else {
			drupal_set_message(t('Deleted 1 message'));
			drupal_goto();
		}
	}
}