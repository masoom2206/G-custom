<?php
global $user;

//code added by Harinder Singh Maan on 22-09-2016
$custom_user_role = 0;
if(array_search('Marketing Coordinator', $user->roles)){
	$custom_user_role = 1;
}elseif(array_search('Siteadmin', $user->roles)){
	$custom_user_role = 1;
}elseif(array_search('Administrator', $user->roles)){
	$custom_user_role = 1;
}
//code ended

$admin_roles=array(3, 4);
	if(arg(0)== 'user' && is_numeric(arg(1)) && arg(2) == 'edit' )
	{
		$user_detail = user_load(arg(1));
	}
	else{
		$user_detail = user_load($user->uid);
	}

	$enabled = ' field-disabled';
	$disabled = ' field-enabled';
	if(isset($user_detail->field_aam_profile_override_dev['und']['0']['value']) && $user_detail->field_aam_profile_override_dev['und']['0']['value'] == 1) {
		$enabled = ' field-enabled';
		$disabled = ' field-disabled';
	}	
//['field_aam_profile_override']
/*echo "<pre>";
print_r ($form);
echo "</pre>";
exit;*/
//print "<pre>";print_r($form['group_wrapper']['group_basic']['field_date_of_birth']);exit;
if (!in_array('Siteadmin', $user->roles) ){
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
				<p>To edit Preferred Email, Job Title, Preferred Name, Direct Phone, and Mobile Phone check the Edit information box below. Once you select the "Edit" box, the Trident feed will no longer update your CB|ONE profile information automatically. Uncheck the box to have the fields fed from Trident.</p>				
				<p><?php print render($form['field_aam_profile_override_dev']); ?></p>
			</div>
		</div>
	</div>
	<div class="user-profile-form-part-one">
		<?php print render($form['group_wrapper']['group_basic']['picture']['picture_upload']); ?>
		<div class="form-item form-type-textfield form-item-field-first-name disabled">
			<label>First name</label>
			<?php if(isset($user_detail->field_first_name['und']['0']['value'])) {?>
				<input type="text" value="<?php print $user_detail->field_first_name['und']['0']['value']; ?>" disabled="disabled" />
			<?php } else { ?>
				<input type="text" value="N/A" disabled="disabled" />
			<?php } ?>
		</div>
		<div class="form-item form-type-textfield form-item-field-last-name disabled">
			<label>Last name</label>
			<?php if(isset($user_detail->field_last_name['und']['0']['value'])) {?>
				<input type="text" value="<?php print $user_detail->field_last_name['und']['0']['value']; ?>" disabled="disabled" />
			<?php } else { ?>
				<input type="text" value="N/A" disabled="disabled" />
			<?php } ?>
		</div>
		<div class="form-item form-type-textfield form-item-field-preferred-name disabled-field<?php print $disabled; ?>">
			<label>Preferred name</label>
			<?php if(isset($user_detail->field_preferred_name['und']['0']['value'])) {?>
				<input type="text" value="<?php print $user_detail->field_preferred_name['und']['0']['value']; ?>" disabled="disabled" />
			<?php } else { ?>
				<input type="text" value="N/A" disabled="disabled" />
			<?php } ?>
		</div>
		<div class="editable-field<?php print $enabled;?>">
			<?php print render($form['group_wrapper']['group_basic']['field_preferred_name']); ?>
		</div>
		<div class="form-item form-type-textfield form-item-field-job-title disabled-field<?php print $disabled; ?>">
			<label>Job Title</label>
			<?php if(isset($user_detail->field_job_title['und']['0']['value'])) {?>
				<input type="text" value="<?php print $user_detail->field_job_title['und']['0']['value']; ?>" disabled="disabled" />
			<?php } else { ?>
				<input type="text" value="N/A" disabled="disabled" />
			<?php } ?>
		</div>
		<div class="editable-field<?php print $enabled;?>">
			<?php print render($form['group_wrapper']['group_basic']['field_job_title']); ?>
		</div>
		<div class="form-item form-type-textfield form-item-field-office disabled">
			<label>Office</label>
			<input type="text" value="<?php print $office; ?>" disabled="disabled" />
		</div>
		<div class="form-item form-type-textfield form-item-field-title disabled">
			<label>Title</label>
			<?php if(isset($user_detail->field_job_title['und']['0']['value'])) {?>
				<input type="text" value="<?php print $user_detail->field_job_title['und']['0']['value']; ?>" disabled="disabled" />
			<?php } else { ?>
				<input type="text" value="N/A" disabled="disabled" />
			<?php } ?>
		</div>
		<div class="form-item form-type-textfield form-item-field-direct-phone disabled-field<?php print $disabled; ?>">
			<label>Direct phone</label>
			<?php if(isset($user_detail->field_phone_direct['und']['0']['value'])) {?>
				<input type="text" value="<?php print $user_detail->field_phone_direct['und']['0']['value']; ?>" disabled="disabled" />
			<?php } else { ?>
				<input type="text" value="N/A" disabled="disabled" />
			<?php } ?>
		</div>
		<div class="editable-field<?php print $enabled;?>">
			<?php print render($form['group_wrapper']['group_basic']['field_phone_direct']); ?>
		</div>
		<div class="form-item form-type-textfield form-item-field-mobile-phone disabled-field<?php print $disabled; ?>">
			<label>Mobile phone</label>
			<?php if(isset($user_detail->field_phone_mobile['und']['0']['value'])) {?>
				<input type="text" value="<?php print $user_detail->field_phone_mobile['und']['0']['value']; ?>" disabled="disabled" />
			<?php } else { ?>
				<input type="text" value="N/A" disabled="disabled" />
			<?php } ?>
		</div>
		<div class="editable-field<?php print $enabled;?>">
			<?php print render($form['group_wrapper']['group_basic']['field_phone_mobile']); ?>
		</div>
		<div class="form-item form-type-textfield form-item-field-system-email disabled">
			<label>System email</label>
			<input type="text" value="<?php print $user_detail->mail; ?>" disabled="disabled" />
		</div>
		<div class="form-item form-type-textfield form-item-field-preferred-email disabled-field<?php print $disabled; ?>">
			<label>Preferred email</label>
			<?php if(isset($user_detail->field_person_email['und']['0']['value'])) {?>
				<input type="text" value="<?php print $user_detail->field_person_email['und']['0']['value']; ?>" disabled="disabled" />
			<?php } else { ?>
				<input type="text" value="N/A" disabled="disabled" />
			<?php } ?>
		</div>
		<div class="editable-field<?php print $enabled;?>">
			<?php print render($form['group_wrapper']['group_basic']['field_person_email']); ?>
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
		<!-- code added by Harinder Singh Maan on 22-09-2016 -->
			<?php
				if($custom_user_role == 1){
					print render($form['field_marketing_concierge_notes_']);
				}
			?>
		<!-- code ended -->
	</div>
	<div class="user-profile-form-submit">
		<?php print render($form['actions']['submit']); ?>
	</div>
	<div style="display:none;">
		<?php print drupal_render_children($form); ?>
	</div>
</div>
<?php } ?>