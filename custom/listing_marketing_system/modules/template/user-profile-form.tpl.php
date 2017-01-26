<?php
global $user;
$admin_roles=array(3, 4);
$user_detail = user_load($user->uid);
//print "<pre>";print_r($form['group_wrapper']['group_basic']['field_date_of_birth']);exit;
if ( !in_array('Administrator', $user_detail->roles) || !in_array('Siteadmin', $user_detail->roles) ){

	$form['group_wrapper']['group_basic']['picture']['#title'] = t('Avatar');
	$form['group_wrapper']['group_basic']['picture']['picture_upload']['#description'] = '';
	$form['group_wrapper']['group_basic']['picture']['picture_upload']['#title'] = t('Change image:');
	$form['group_wrapper']['group_basic']['field_date_of_birth']['und']['0']['value']['date']['#title'] = t('Date of birth');
	$office = isset($user_detail->field_member_office['und']['0']['value']) ? get_user_office($user_detail->field_member_office['und']['0']['value']) : '--';
?>
<div class="user-profile-form">
	<div class="user-profile-form-banner">Your Profile Information</div>
	<div class="basics-info">
		<div class="user_profile_picture"><?php print render($form['group_wrapper']['group_basic']['picture']['picture_current']); ?></div>
		<div id="instruction-wrapper">
			<div class="instruction-title">Instructions</div>
			<div class="instruction-body">
				<p>The information on the left side is fed from Trident and is not editable. If you would like to make changes to this information, you must first contact your Marketing Coordinator or Manager.</p>
				<p>The image/headshot and information on right hand column is editable and may be updated below. Be sure to hit "Save" to ensure this information is applied within CB|ONE.</p>  
			</div>
		</div>
	</div>
	<div class="user-profile-form-part-one">
		<?php print render($form['group_wrapper']['group_basic']['picture']['picture_upload']); ?>
		<div class="form-item form-type-textfield form-item-field-first-name">
			<label>First name</label>
			<input type="text" value="<?php print $user_detail->field_first_name['und']['0']['value']; ?>" disabled="disabled" />
		</div>
		<div class="form-item form-type-textfield form-item-field-last-name">
			<label>Last name</label>
			<input type="text" value="<?php print $user_detail->field_last_name['und']['0']['value']; ?>" disabled="disabled" />
		</div>
		<div class="form-item form-type-textfield form-item-field-preferred-name">
			<label>Preferred name</label>
			<input type="text" value="<?php print $user_detail->field_preferred_name['und']['0']['value']; ?>" disabled="disabled" />
		</div>
		<div class="form-item form-type-textfield form-item-field-office">
			<label>Office</label>
			<input type="text" value="<?php print $office; ?>" disabled="disabled" />
		</div>
		<div class="form-item form-type-textfield form-item-field-title">
			<label>Title</label>
			<input type="text" value="<?php print $user_detail->field_job_title['und']['0']['value']; ?>" disabled="disabled" />
		</div>
		<div class="form-item form-type-textfield form-item-field-direct-phone">
			<label>Direct phone</label>
			<input type="text" value="<?php print $user_detail->field_phone_direct['und']['0']['value']; ?>" disabled="disabled" />
		</div>
		<div class="form-item form-type-textfield form-item-field-mobile-phone">
			<label>Mobile phone</label>
			<input type="text" value="<?php print $user_detail->field_phone_mobile['und']['0']['value']; ?>" disabled="disabled" />
		</div>
		<div class="form-item form-type-textfield form-item-field-system-email">
			<label>System email</label>
			<input type="text" value="<?php print $user_detail->mail; ?>" disabled="disabled" />
		</div>
		<div class="form-item form-type-textfield form-item-field-preferred-email">
			<label>Preferred email</label>
			<input type="text" value="<?php print $user_detail->field_person_email['und']['0']['value']; ?>" disabled="disabled" />
		</div>


		<?php //print render($form['group_wrapper']['group_basic']['field_first_name']); ?>
	</div>
	<div class="user-profile-form-part-two">
		<div id="edit-field-agent-about"><?php print render($form['group_wrapper']['group_basic']['field_person_about']); ?></div>
		<?php print render($form['group_wrapper']['group_basic']['field_agent_web_site']); ?>
		<?php print render($form['group_wrapper']['group_basic']['field_date_of_birth']); ?>
		<?php print render($form['group_wrapper']['group_office']['field_address']); ?>
		<?php print render($form['group_wrapper']['group_office']['field_city']); ?>
		<?php print render($form['group_wrapper']['group_office']['field_state']); ?>
		<?php print render($form['group_wrapper']['group_office']['field_zip']); ?>
		<div class="user-profile-social-media-title">Social Media</div>
		<?php print render($form['group_wrapper']['group_social']['field_user_twitter']); ?>
		<?php print render($form['group_wrapper']['group_social']['field_user_linked_in']); ?>
		<?php print render($form['group_wrapper']['group_social']['field_user_facebook']); ?>
		<?php print render($form['group_wrapper']['group_social']['field_user_instagram']); ?>
		<?php print render($form['group_wrapper']['group_social']['field_user_google_plus']); ?>
	</div>
	<div class="user-profile-form-submit">
		<?php print render($form['actions']['submit']); ?>
	</div>
	<div style="display:none;">
		<?php print drupal_render_children($form); ?>
	</div>
</div>
<?php } 
else{
	print drupal_render($form['group_wrapper']);
}
?>