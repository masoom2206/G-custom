<?php
//print "<pre>";
//print_r($var_name['result_slice']);
//exit;

// For current login User'
$current_role = $var_name['account'];
if (!empty($current_role->picture['fid'])) {
  // Load the file
  $file = file_load($current_role->picture['fid']);
  echo theme('image_style', array('style_name' => 'thumbnail', 'path' => $file->uri));
}
// For display listing of recent agents of updated their profile pictures 
	print $current_role->name."<br/>----Recent Activity-----<br/>";
	//$agents = $var_name['agents'];
	$agents = $var_name['result_slice'];
	
if(!empty($agents)) {
		foreach($agents as $agent) {
			$getvalue = explode(",", $agent);
			$uid = $getvalue[0];
			if(!empty($getvalue[1]) && $getvalue[1] !='') {
				$nid = $getvalue[1];
			}
			$load = isset($nid) ? node_load($nid) : '';
			$agent_load = user_load($uid);
			$agent_pic 	= $agent_load->picture;
			if (!empty($agent_pic->fid)) {
				// Load the file
				$file = file_load($agent_pic->fid);
				echo theme('image_style', array('style_name' => 'thumbnail', 'path' => $file->uri));
			}
			print isset($agent_load->field_preferred_name['und'][0]['value']) ? $agent_load->field_preferred_name['und'][0]['value'] : '';
			print isset($load->title) ? '&nbsp;Completed a task in '.$load->title : 'Updated profile picture';
			print "<br/>";
		}	
}
else {
	print "Not result found";
}
// For display listing of 'Active Orders'
	$ractive_nid = $var_name['get_nid']; 
	print "</br>--------- Active Orders---------";
if(!empty($ractive_nid)) {

	foreach($ractive_nid as $active) {
		if(isset($active->nid)) {
			$active_node = node_load($active->nid);
			print "</br>";
			print $active_node->title;
		}
	}
}
else {
	print "<br/>Not found any In Progress orders";
}
// For display listing of 'Pending Order Confirmation'
$pending_nid = $var_name['get_pending_nid']; 
	print "</br>--------- Pending Orders---------";
if(!empty($pending_nid)) {

	foreach($pending_nid as $pending) {
		if(isset($pending->nid)) {
			$pending_node = node_load($pending->nid);
			print "</br>";
			print $pending_node->title;
		}
	}
}
else {
	print "<br/>Not found any Pending orders";
}
// For display listing of 'Complete' orders
$complete_nid = $var_name['get_complete_nid']; 
	print "</br>--------- Completed Orders---------";
if(!empty($complete_nid)) {

	foreach($complete_nid as $complete) {
		if(isset($complete->nid)) {
			$complete_node = node_load($complete->nid);
			print "</br>";
			print $complete_node->title;
		}
	}
}
else {
	print "<br/>Not found any Completed orders";
}
// For listing of most 5 recent agents that have earned badge levels or completed the Daily Quiz.
$quiz_results = $var_name['quiz_results'];
print "</br>--------- Daily Quiz---------</br>";
if(!empty($quiz_results)) {
	foreach($quiz_results as $results) {
		$user_load = user_load($results->uid);
		$last_level_tid = $results->last_level;
		$last_level = taxonomy_term_load($last_level_tid);
		$question_count = $results->question_count;
		if($question_count < 5) {
			$msg = "Completed today's quiz";
		}
		if($question_count == 5) {
			$msg = "Earned the ".$last_level->name;
		}
		//print '<pre>';
		//print_r($last_level);
		//print '</pre>';
		//exit;
		$user_pic 	= $user_load->picture;
		if (!empty($user_pic->fid)) {
			// Load the file
			$file = file_load($user_pic->fid);
			echo "</br>";
			echo theme('image_style', array('style_name' => 'thumbnail', 'path' => $file->uri));
		}
		print isset($user_load->field_preferred_name['und'][0]['value']) ? $user_load->field_preferred_name['und'][0]['value'] : '';
		print "&nbsp;&nbsp;&nbsp;".$msg;
		print "<br/>";
			
	}
}

?>


<!--
<div class = "all-dashboard">
	<div class = "header-dashboard">
		<div class = "cbone-dashboard-logo">
	<!--	<img src="/sites/all/modules/custom/listing_marketing_system/images/cbone-logo-small.jpg">
			CB|ONE
		</div>
		<div class = "dashboard-notification">
			!Notification
		</div>
		<div class = "dashboard-message">
			Message
		</div>
		<div class = "dashboard-logout">
			Logout
		</div>
		<div class = "dashbaord-name">
			Office Name
		</div>
	</div>
	<div class = "dashboard-left">
		<div class = "login-user-info">
			<div class = "dashboard-profile-picture">
				Picture
			</div>
			<div class = "dashboard-profile-name">
				Kacie
			</div>
		</div>
		<div class = "dashboard-menu-links">
		
		
		</div>
			
	</div>
	
	<div class = "dashboard-right">
		right
	</div>
</div>
-->