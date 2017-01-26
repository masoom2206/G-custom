<?php
global $user, $base_url;
//print "<pre>";print_r($var_name['network_list']);//exit;
//module_load_include('inc', 'agent_dashboard', 'includes/user_info');
$count = count($var_name['network_list']);
?>
<section class="slider">
<?php 
if($count>=7) {
?>
	<div class="flexslider carousel">
		<ul class="slides">
		<?php } else{ ?>
		<div class="less_slides">
		<ul class="less_slides_list">
		<?php }?>
			<?php 
				foreach($var_name['network_list'] as $users) {
				$hidden = $users['hidden'];
				$user_id = $users['user_id'];
				$picture = $users['image'];
				$preferred_name = $users['name'];
				$role = $users['role'];
				$banker = $users['banker'];
				$phone = $users['phone'];
				$email = $users['email'];
				$fc_id = $users['fc_id'];
			?>
			<li>
			<div class="agent-network-user">
			<?php if($hidden == 'only users') {?>
			<a href="/users-info/<?php echo 'user-'.$user_id; ?>" rel="modal-node-popup">
			<?php } else { ?>
			<a href="/users-info/<?php echo 'vendor-'.$user_id.'-'.$fc_id; ?>" rel="modal-node-popup">
			<?php } ?>
				<div class="user-image"><?php echo $picture; ?></div>
				<div class="user-name"><?php echo $preferred_name;?></div>
				<div class="user-role"><?php echo $role; ?></div>
				<div class="user-coldwell"><?php echo $banker; ?></div>
				<div class="user-phone"><?php echo $phone; ?></div>
				<div class="user-email"><?php echo $email; ?></div>
			</a>
			</div>
			</li>
			<?php
				}
			?>
		</ul>
	</div>
</section>


<!--
<div class="agent-network-user"><a href="/member-info/[uid]" rel="modal-node-popup">
	<div class="user-image">[picture]</div>
	<div class="user-name">[field_preferred_name]</div>
	<div class="user-role">[rid]</div>
	<div class="user-coldwell">ColdwellBanker</div>
	<div class="user-phone">[field_phone_direct]</div>
	<div class="user-email">[field_person_email]</div>
</a>
</div>
-->