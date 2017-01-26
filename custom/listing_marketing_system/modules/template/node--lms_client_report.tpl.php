<?php
global $base_url;
//print "<pre>";print_r($node);exit;
$listing_nid = $node->field_lms_listing_reference['und']['0']['nid'];
$listing_node = node_load($listing_nid);
$client_name = isset($listing_node->field_client_first_name['und']['0']['value']) ? $listing_node->field_client_first_name['und']['0']['value'] : 'Seller';

	if(isset($listing_node->field_lms_sales_team['und']['0']['nid'])) {
		$nid = $node->field_lms_sales_team['und']['0']['nid'];
		$sales_team = node_load($nid);
		$profile_image = isset($sales_team->field_sales_team_photo['und']['0']['uri']) ? file_create_url($sales_team->field_sales_team_photo['und']['0']['uri']) : '/sites/all/modules/custom/listing_marketing_system/images/default-image.jpg';
		$profile_text = isset($sales_team->body['und']['0']['value']) ? substr($sales_team->body['und']['0']['value'], 0, 150) : '';
		$profile_name = $sales_team->title;
	}
	else if(isset($listing_node->field_lms_other_agent['und']['0']['uid'])) {
		$uid = $listing_node->field_lms_other_agent['und']['0']['uid'];
		$agent_detail = user_load($uid);
		$profile_image = isset($agent_detail->picture->fid) ? file_create_url($agent_detail->picture->uri) : '/sites/all/modules/custom/listing_marketing_system/images/default-image.jpg';
		$field_job_title = isset($agent_detail->field_job_title['und']['0']['value']) ? $agent_detail->field_job_title['und']['0']['value'] : '';		
		$profile_name = isset($agent_detail->field_firstname['und']['0']['value']) ? $agent_detail->field_firstname['und']['0']['value'].' ' : $agent_detail->name;
		$profile_name .= isset($agent_detail->field_lastname['und']['0']['value']) ? $agent_detail->field_lastname['und']['0']['value'] : '';
		$phone = isset($agent_detail->field_phone_direct['und']['0']['value']) ? $agent_detail->field_phone_direct['und']['0']['value'] : '';
		$mobile = isset($agent_detail->field_phone_mobile['und']['0']['value']) ? $agent_detail->field_phone_mobile['und']['0']['value'] : '';
		$person_email = isset($agent_detail->field_person_email['und']['0']['value']) ? $agent_detail->field_person_email['und']['0']['value'] : '';
		$web_site = isset($agent_detail->field_agent_web_site['und']['0']['value']) ? $agent_detail->field_agent_web_site['und']['0']['value'] : '';
		$state_license = isset($agent_detail->field_state_license['und']['0']['value']) ? $agent_detail->field_state_license['und']['0']['value'] : '';
	}
	else {
		$uid = $listing_node->uid;
		$agent_detail = user_load($uid);
		//print "<pre>";print_r($agent_detail);exit;
		$profile_image = isset($agent_detail->picture->fid) ? file_create_url($agent_detail->picture->uri) : '/sites/all/modules/custom/listing_marketing_system/images/default-image.jpg';
		$field_job_title = isset($agent_detail->field_job_title['und']['0']['value']) ? $agent_detail->field_job_title['und']['0']['value'] : '';
		$profile_name = isset($agent_detail->field_firstname['und']['0']['value']) ? $agent_detail->field_firstname['und']['0']['value'].' ' : $agent_detail->name;
		$profile_name .= isset($agent_detail->field_lastname['und']['0']['value']) ? $agent_detail->field_lastname['und']['0']['value'] : '';
		$phone = isset($agent_detail->field_phone_direct['und']['0']['value']) ? $agent_detail->field_phone_direct['und']['0']['value'] : '';
		$mobile = isset($agent_detail->field_phone_mobile['und']['0']['value']) ? $agent_detail->field_phone_mobile['und']['0']['value'] : '';
		$person_email = isset($agent_detail->field_person_email['und']['0']['value']) ? $agent_detail->field_person_email['und']['0']['value'] : '';
		$web_site = isset($agent_detail->field_agent_web_site['und']['0']['value']) ? $agent_detail->field_agent_web_site['und']['0']['value'] : '';
		$state_license = isset($agent_detail->field_state_license['und']['0']['value']) ? $agent_detail->field_state_license['und']['0']['value'] : '';
	}

?>
<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?>">
	<div class="lms-client-report-node">
		<div class="lms-client-report-header"><img src="<?php print $base_url; ?>/sites/default/files/images/email/client_report_email_header.jpg"></div>
		<div class="lms-client-report-body">
			<div>Dear <?php print $client_name; ?></div>
			<div class="report_intro_copy"><?php print $node->field_client_report_intro_copy['und']['0']['value']; ?></div>
			<div class="completed-item">
				<ul>
				<?php
					foreach($node->field_client_report_items['und'] as $items) {
				?>
					<li><img src="<?php print $base_url; ?>/sites/default/files/images/email/email_client_report_bullet.jpg"> <?php print $items['value']; ?></li>
				<?php
					}
				?>
				<?php
					if(isset($node->field_client_report_addl_items['und']['0']['value'])) {
						foreach($node->field_client_report_addl_items['und'] as $items) {
				?>
							<li><img src="<?php print $base_url; ?>/sites/default/files/images/email/email_client_report_bullet.jpg"> <?php print $items['value']; ?></li>
				<?php
						}
					}
				?>
				</ul>
			</div>
			<div class="report_conclusion"><?php print $node->field_client_report_conclusion['und']['0']['value']; ?></div>
			<div class="report-footer">
				<div class="sincerely">Sincerely,</div>
				<div class="sender-info">
					<div class="sender-image"><img src="<?php print $profile_image; ?>" /></div>
					<div class="sender-detail">
						<div class="name"><?php print $profile_name; ?></div>
						<div class="title"><?php print $field_job_title; ?></div>
						<div class="phone"><?php print $phone; ?></div>
						<div class="mobile"><?php print $mobile; ?></div>
						<div class="email"><?php print $person_email; ?></div>
						<div class="website"><?php print $web_site; ?></div>
						<div class="extra"><?php print $state_license; ?></div>
					</div>
				</div>
				<div class="disclaimer-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. </div>
			</div>
		</div>
	</div>
</div>


