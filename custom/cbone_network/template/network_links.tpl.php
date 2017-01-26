<div class="network-links">
	<ul class="user-network-links">
	<?php global $user, $base_url; ?> 
	<?php if(arg(0)=='my-office' && is_numeric(arg(1))){   ?>
	<li><a href="/office-members/<?php echo arg(1); ?>">MEMBERS</a></li>
	<?php } 
	if(arg(0)=='my-office' && arg(1) == ''){ 
		$office_nid='';
		$query=db_select('field_data_field_office_id', 'foid')->distinct();
		$query->innerJoin('field_data_field_member_office', 'fmo', 'foid.field_office_id_value = fmo.field_member_office_value');
		$query->fields('foid', array('entity_id', 'field_office_id_value'))
				->fields('fmo', array('entity_id', 'field_member_office_value'));
		$query->condition('fmo.entity_id', $user->uid, '=');
		$result= $query->execute()->fetchAll();
		if(!empty($result)){
			foreach($result as $value){
			$office_nid=$value->entity_id;			
			}
		} ?>
		<li><a href="/office-members/<?php echo $office_nid; ?>">MEMBERS</a></li>
	<?php 	
	}
	 //if( arg(0)=='content'){
		//$node = menu_get_object();
		//if(!empty($node)){
	$get_nid = arg(1);
	$node_load=node_load($get_nid);
	if(!empty($node_load)){
		if($node_load->type=='circle'){ ?>
		<li><a href="/circle-members/<?php echo $get_nid; ?>">MEMBERS</a></li>
	<?php }
	}
	?>
		<li><a href="/cbone-network">NETWORK</a></li>
        <li><a href="/circle/browse">BROWSE CIRCLES</a></li>
		<li><a href="/create/circle">CREATE A CIRCLE</a></li>
		<li><a href="/upcoming-events">CALENDAR</a></li>
		<li><a href="/my-office">MY OFFICE</a></li>
		<li><a href="/manage-circles">MANAGE MY CIRCLES</a></li>
	</ul>
</div>
