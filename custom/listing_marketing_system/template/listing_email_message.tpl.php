<?php
//print "<pre>";print_r($var_name['agent_detail']);exit;
global $base_url;
/*$headers = array();
 // Add cookie so that we can use the same access as the logged in user, if present.
    $headers = array(
      'Cookie' => $_SERVER['HTTP_COOKIE'],
    );
$url = 'https://www.cbone.me/listing-email/121454';
$message_body = drupal_http_request($url,  array('timeout' => 240, 'headers' => $headers));*/
//$url = 'https://www.cbone.me/listing-email/121454';
//module_load_include('inc', 'listing_marketing_system', 'includes/listing_email');
//$message_body = cbone_listing_email_message(121454);
//print $message_body;exit;
$message_body = 'Hello';
$mc_order = 0;
if($var_name['order_id'] != NULL) {
	if($var_name['product_sku'] != 'LMS-04') {
		$mc_order = 1;
	}
	else {
		$mc_order = 0;
	}
}
?>
<style type="text/css">
@media screen and (max-device-width: 480px) {
   .agent-info{float: none !important; width: 100% !important; min-height: 400px;}
   .agent-info .agent-image{float: none !important;}
   .agent-info .agent-details{float: none !important;}
 }
</style>
<div class="listing-email-message" style="border: 1px solid #bbb; line-height: normal; color: #000;width: 100%; padding: 1px;">
	<?php if($mc_order == 1) { ?>
		<div style="text-align: center; font-size: 14px; padding-top: 20px; padding-bottom: 20px;"><a href="<?php print $var_name['listing_url']?>" style="color: #000; text-transform: uppercase; font-weight: 600;">Click to view in your browser</a></div>
		<div class="message-logo-title">
			<?php if($var_name['previews'] == 1) {?>
				<div class="message-logo" style="text-align: center; padding-bottom: 10px;">
					<img src="<?php print $base_url; ?>/sites/all/modules/custom/listing_marketing_system/images/webpage-logo-cb-previews.png" style="height: 72px; width: auto;"/>
				</div>
				<div class="message-title" style="text-align: center; font-size: 40px; text-transform: uppercase; padding-bottom: 20px; font-weight: 200; border-bottom: 1px solid #7a7a7a; width: 60%; margin-left: auto; margin-right: auto; color: #6b6f73;"><?php print $var_name['mc_listing_address']; ?></div>
			<?php } else {?>
				<div class="message-logo" style="text-align: center; padding-bottom: 10px;">
					<img src="<?php print $base_url; ?>/sites/all/modules/custom/listing_marketing_system/images/webpage-logo-cb.png" style="height: 72px; width: auto;"/>
				</div>
				<div class="message-title" style="text-align: center; font-size: 40px; text-transform: uppercase; padding-bottom: 20px; font-weight: 200; border-bottom: 1px solid #7a7a7a; width: 60%; margin-left: auto; margin-right: auto; color: #6b6f73;"><?php print $var_name['mc_listing_address']; ?></div>
			<?php } ?>
		</div>
		<!--<div class="message-title" style="text-align: center; font-size: 32px; text-transform: uppercase; padding: 25px 0px; font-weight: 200; width: 100%; color: #6b6f73;">Presented by Carol Banker</div>-->
		<?php if(isset($var_name['agent_detail']['sales_team'])) {?>
			<div class="message-title" style="text-align: center; font-size: 32px; text-transform: uppercase; padding: 25px 0px; font-weight: 200; width: 100%; color: #6b6f73;">Presented by <?php print $var_name['agent_detail']['sales_team']['preferred_name']; ?></div>
		<?php } else { if(isset($var_name['agent_detail']['co_agent'])) { ?>
			<div class="message-title" style="text-align: center; font-size: 32px; text-transform: uppercase; padding: 25px 0px; font-weight: 200; width: 100%; color: #6b6f73;">Presented by <br/><?php print $var_name['agent_detail']['primary_agent']['preferred_name']; ?> and <?php print $var_name['agent_detail']['co_agent']['preferred_name']; ?></div>
		<?php } else { ?>
			<div class="message-title" style="text-align: center; font-size: 32px; text-transform: uppercase; padding: 25px 0px; font-weight: 200; width: 100%; color: #6b6f73;">Presented by <?php print $var_name['agent_detail']['primary_agent']['preferred_name']; ?></div>
		<?php } } ?>
		<div class="message-first-image" style="text-align: center; margin-bottom: 10px;">
			<div class="first-image" style="width: 100%;"><img src="<?php print $var_name['first_image']; ?>" style="width: 100%;"/></div>
		</div>
		<div class="message-second-third-image" style="width: 100%; text-align: center; float: left;">
			<div class="second-image" style="float: left; width: 49.5%; max-width:445px;"><img src="<?php print $var_name['second_image']; ?>"/></div>
			<div class="third-image" style="float: right; width: 49.5%; max-width:445px;"><img src="<?php print $var_name['third_image']; ?>" /></div>
		</div>
		<div class="message-title" style="text-align: left; font-size: 32px; width: 100%; font-weight: 200; padding: 10px; color: #7a7a7a; float: left;"><?php print $var_name['listing_headline']; ?></div>
		<div class="message-online-copy" style="padding: 0px 5px 10px 10px; width: 100%; font-size: 20px; font-weight: 300; color: #7a7a7a; float: left;"><?php print $var_name['online_copy']; ?></div>
		<?php if($var_name['youtube_url'] != '') { ?>
			<div class="message-fourth-image" style="width: 100%; text-align: center; float: left; position: relative; background-image: url(<?php print $var_name['fourth_image']; ?>); background-size: cover;">
				<div style="background-color: rgba(0, 0, 0, .3); padding: 25% 0%;">
					<div class="title" style="font-size: 48px; text-transform: uppercase; color: #fff; width: 100%; z-index: 99;">Virtual Tour</div>
					<div class="mail-play-icon"><a href="<?php print $var_name['youtube_url']; ?>" target="_blank"><img src="<?php print $base_url; ?>/sites/all/modules/custom/listing_marketing_system/images/mail-play-icon.jpg" /></a></div>
				</div>
			</div>
		<?php } ?>
		<div style="width: 100%;">
			<table class="message-forward-contact-me" style="width: 61% !important; padding: 40px; margin-left: auto; margin-right: auto;">
				<tr>
					<td class="message-forward" style="padding: 40px 0; width: 50%;">
						<!--<a href="mailto:<?php //print $var_name['agent_email']; ?>">-->
						<a href="mailto:?subject=[mail_subject]&body=<?php print $message_body; ?>" class="forward">
							<div class="message-forward-icon" style="float: left; margin-right: 10px;"><img src="<?php print $base_url; ?>/sites/all/modules/custom/listing_marketing_system/images/forward.jpg" /></div>
							<div class="message-forward-text" style="float: left;">
								<div style="font-size: 21px; text-transform: uppercase; color: #7a7a7a;">Forward</div>
								<div style="color: #7a7a7a;">To A Friend</div>
							</div>
						</a>
					</td>
					<td class="message-contact-me" style="padding: 40px 0; width: 50%;">
						<a href="mailto:<?php print $var_name['agent_email']; ?>">
							<div class="message-contact-me-icon" style="float: left; margin-right: 10px;"><img src="<?php print $base_url; ?>/sites/all/modules/custom/listing_marketing_system/images/contact-me.jpg" /></div>
							<div class="message-contact-me-text" style="float: left;">
								<div style="font-size: 21px; text-transform: uppercase; color: #7a7a7a;">Contact me</div>
								<div style="color: #7a7a7a;">About Real Estate</div>
							</div>
						</a>
					</td>
				</tr>
			</table>
		</div>
		<div class="message-fourth-image" style="width: 100%; text-align: center; float: left; padding: 17px; background-color: #3a3d40; color: #fff; text-transform: uppercase; font-size: 22px; margin: 15px 0px;">Request More Information</div>
		<div class="message-agent-info" style="padding-left: 20px; padding-right: 20px; width: 100%; float: left;">
			<div class="agent-info" style="float: left; width: 100%;">
			<?php if(isset($var_name['agent_detail']['sales_team'])) {?>
				<div class="sales-team" style="float: left; width: 100%; text-align: center;">
					<div class="agent-image" style="vertical-align: top; margin-top: 20px;">
						<?php print $var_name['agent_detail']['sales_team']['profile_image']; ?>
						<!--<img src="<?php //print $var_name['agent_detail']['sales_team']['profile_image']; ?>" style="width: 135px; height: 135px; border-radius: 50%;" />-->
					</div>
					<div class="agent-details" style="">
						<ul style="padding: 0px 0 0 10px;margin-top: 20px; margin-left: 10px; word-wrap: break-word;">
							<li style="list-style: none; font-family: Raleway; font-size: 19px; line-height: 22px; text-transform: uppercase;"><?php print $var_name['agent_detail']['sales_team']['preferred_name']; ?></li>
							<?php if($var_name['agent_detail']['sales_team']['about'] != '') { ?>
								<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['sales_team']['about']; ?></li>
							<?php } ?>
							<?php if($var_name['agent_detail']['sales_team']['job_title'] != '') { ?>
								<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['sales_team']['job_title']; ?></li>
							<?php } ?>
							<?php if($var_name['agent_detail']['sales_team']['phone_direct'] != '') { ?>
								<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['sales_team']['phone_direct']; ?></li>
							<?php } ?>
							<?php/* if($var_name['agent_detail']['sales_team']['phone_mobile'] != '') { ?>
								<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;">C <?php print $var_name['agent_detail']['sales_team']['phone_mobile']; ?></li>
							<?php } */?>
							<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['sales_team']['person_email']; ?></li>
							<?php if($var_name['agent_detail']['sales_team']['agent_web_site'] != '') { ?>
								<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['sales_team']['agent_web_site']; ?></li>
							<?php } ?>
							<?php if($var_name['agent_detail']['sales_team']['state_license'] != '') { ?>
								<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['sales_team']['state_license']; ?></li>
							<?php } ?>
						</ul>
						<div class="social-links" style="width: 100%; text-align: center; margin-top: 10px;">
							<?php
								if(isset($var_name['agent_detail']['sales_team']['twitter'])) {
									print $var_name['agent_detail']['sales_team']['twitter'];
								}
								if(isset($var_name['agent_detail']['sales_team']['facebook'])) {
									print $var_name['agent_detail']['sales_team']['facebook'];
								}
								if(isset($var_name['agent_detail']['sales_team']['linkedin'])) {
									print $var_name['agent_detail']['sales_team']['linkedin'];
								}
								if(isset($var_name['agent_detail']['sales_team']['pinterest'])) {
									print $var_name['agent_detail']['sales_team']['pinterest'];
								}
							?>
						</div>
					</div>
				</div>
			<?php } else { if(isset($var_name['agent_detail']['co_agent'])) { ?>
				<div class="primary-agent" style="float: left; width: 49%; text-align: center;">
			<?php } else { ?>
				<div class="primary-agent" style="width: 100%; text-align: center;">
			<?php } ?>
					<div class="agent-image" style="vertical-align: top; margin-top: 20px;">
						<?php print $var_name['agent_detail']['primary_agent']['profile_image']; ?>
						<!--<img src="<?php //print $var_name['agent_detail']['primary_agent']['profile_image']; ?>" style="width: 135px; height: 135px; border-radius: 50%;" />-->
					</div>
					<div class="agent-details" style="">
						<ul style="padding: 0px 0 0 10px;margin-top: 20px; margin-left: 10px; word-wrap: break-word;">
							<li style="list-style: none; font-family: Raleway; font-size: 19px; line-height: 22px; text-transform: uppercase;"><?php print $var_name['agent_detail']['primary_agent']['preferred_name']; ?></li>
							<?php if($var_name['agent_detail']['primary_agent']['about'] != '') { ?>
								<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['primary_agent']['about']; ?></li>
							<?php } ?>
							<?php if($var_name['agent_detail']['primary_agent']['job_title'] != '') { ?>
								<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['primary_agent']['job_title']; ?></li>
							<?php } ?>
							<?php if($var_name['agent_detail']['primary_agent']['phone_direct'] != '') { ?>
								<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['primary_agent']['phone_direct']; ?></li>
							<?php } ?>
							<?php/* if($var_name['agent_detail']['primary_agent']['phone_mobile'] != '') { ?>
								<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;">C <?php print $var_name['agent_detail']['primary_agent']['phone_mobile']; ?></li>
							<?php } */?>
							<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['primary_agent']['person_email']; ?></li>
							<?php if($var_name['agent_detail']['primary_agent']['agent_web_site'] != '') { ?>
								<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['primary_agent']['agent_web_site']; ?></li>
							<?php } ?>
							<?php if($var_name['agent_detail']['primary_agent']['state_license'] != '') { ?>
								<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['primary_agent']['state_license']; ?></li>
							<?php } ?>
						</ul>
						<div class="social-links" style="width: 100%; text-align: center; margin-top: 10px;">
							<?php
								if(isset($var_name['agent_detail']['primary_agent']['twitter'])) {
									print $var_name['agent_detail']['primary_agent']['twitter'];
								}
								if(isset($var_name['agent_detail']['primary_agent']['facebook'])) {
									print $var_name['agent_detail']['primary_agent']['facebook'];
								}
								if(isset($var_name['agent_detail']['primary_agent']['linkedin'])) {
									print $var_name['agent_detail']['primary_agent']['linkedin'];
								}
								if(isset($var_name['agent_detail']['primary_agent']['pinterest'])) {
									print $var_name['agent_detail']['primary_agent']['pinterest'];
								}
							?>
						</div>
					</div>
				</div>
				<?php if(isset($var_name['agent_detail']['co_agent'])) {?>
				<div class="co-agent" style="float: left; width: 49%; text-align: center;">
					<div class="agent-image" style="vertical-align: top; margin-top: 20px;">
						<?php print $var_name['agent_detail']['co_agent']['profile_image']; ?>
						<!--<img src="<?php //print $var_name['agent_detail']['co_agent']['profile_image']; ?>" style="width: 135px; height: 135px; border-radius: 50%;" />-->
					</div>
					<div class="agent-details" style="">
						<ul style="padding: 0px 0 0 10px;margin-top: 20px; margin-left: 10px; word-wrap: break-word;">
							<li style="list-style: none; font-family: Raleway; font-size: 19px; line-height: 22px; text-transform: uppercase;"><?php print $var_name['agent_detail']['co_agent']['preferred_name']; ?></li>
							<?php if($var_name['agent_detail']['co_agent']['about'] != '') { ?>
								<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['co_agent']['about']; ?></li>
							<?php } ?>
							<?php if($var_name['agent_detail']['co_agent']['job_title'] != '') { ?>
								<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['co_agent']['job_title']; ?></li>
							<?php } ?>
							<?php if($var_name['agent_detail']['co_agent']['phone_direct'] != '') { ?>
								<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['co_agent']['phone_direct']; ?></li>
							<?php } ?>
							<?php/* if($var_name['agent_detail']['co_agent']['phone_mobile'] != '') { ?>
								<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;">C <?php print $var_name['agent_detail']['co_agent']['phone_mobile']; ?></li>
							<?php } */?>
							<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['co_agent']['person_email']; ?></li>
							<?php if($var_name['agent_detail']['co_agent']['agent_web_site'] != '') { ?>
								<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['co_agent']['agent_web_site']; ?></li>
							<?php } ?>
							<?php if($var_name['agent_detail']['co_agent']['state_license'] != '') { ?>
								<li style="list-style: none; font-family: Raleway; font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['co_agent']['state_license']; ?></li>
							<?php } ?>
						</ul>
						<div class="social-links" style="width: 100%; text-align: center; margin-top: 10px;">
							<?php
								if(isset($var_name['agent_detail']['co_agent']['twitter'])) {
									print $var_name['agent_detail']['co_agent']['twitter'];
								}
								if(isset($var_name['agent_detail']['co_agent']['facebook'])) {
									print $var_name['agent_detail']['co_agent']['facebook'];
								}
								if(isset($var_name['agent_detail']['co_agent']['linkedin'])) {
									print $var_name['agent_detail']['co_agent']['linkedin'];
								}
								if(isset($var_name['agent_detail']['co_agent']['pinterest'])) {
									print $var_name['agent_detail']['co_agent']['pinterest'];
								}
							?>
						</div>
					</div>
				</div>
				<?php } ?>
			<?php } ?>
			</div>
		</div>
		<div class="message-unsubscribe" style="text-align: center; margin-top: 80px; width: 100%; float: left;"><a href="<?php print $var_name['unsubscribe_email']; ?>" style="color: #7a7a7a; padding: 15px 25px 15px 25px; text-transform: uppercase; font-size: 20px; font-weight: 500;" target="_blank">UNSUBSCRIBE</a></div>
		<div class="message-add" style="text-align: center; margin-top: 15px; margin-bottom: 15px; width: 100%; float: left; font-weight: 400;">This is an advertisement.</div>
		<div class="message-add" style="text-align: center; margin-bottom: 20px; width: 100%; float: left; color: #6a6e73; font-size: 14px;">Coldwell Banker Residential Brokerage | 1801 N California Blvd #100, Walnut Creek, CA</div>
		<div class="message-bottom-message" style="padding: 10px; font-size: 12px; line-height: 14px; width: 100%; float: left;">
			<div class="agent-logo" style="float: left; vertical-align: top; width: 15%;"><img src="<?php print $base_url; ?>/sites/default/files/cbrb-logo-100w.jpg" /></div>
			<div class="copyright" style="float: left; width: 84%;">&copy; <?php echo date("Y"); ?> 
			Coldwell Banker Real Estate LLC. All Rights Reserved. Coldwell Banker&reg; is a registered trademark licensed to Coldwell Banker Real Estate LLC. An Equal Opportunity Company. Equal Housing Opportunity. Each Coldwell Banker Residential Brokerage Office is Owned by a Subsidiary of NRT LLC. Real estate agents affiliated with Coldwell Banker Residential Brokerage are independent contractor sales associates and are not employees of Coldwell Banker Real Estate LLC, Coldwell Banker Residential Brokerage or NRT LLC. CalBRE License #01908304.</div>
		</div>
		<div class="message-blank" style="width: 100%;">&nbsp;</div>
	<?php } else { ?>
		<div style="text-align: center; font-size: 14px; padding-top: 20px; padding-bottom: 20px;"><a href="<?php print $var_name['listing_url']?>" style="color: #000;">Email not displaying correctly? View it in your browser.</a></div>
		<div class="message-logo-title">
			<?php if($var_name['previews'] == 1) {?>
				<div class="message-logo" style="text-align: center; padding-bottom: 10px;">
					<img src="<?php print $base_url; ?>/sites/all/modules/custom/listing_marketing_system/images/webpage-logo-cb-previews.png" style="height: 72px; width: auto;"/>
				</div>
				<div class="message-title" style="text-align: center; font-size: 40px; text-transform: uppercase; padding-bottom: 20px;"><?php print $var_name['listing_headline']; ?></div>
			<?php } else {?>
				<div class="message-logo" style="text-align: center; padding-bottom: 10px;">
					<img src="<?php print $base_url; ?>/sites/all/modules/custom/listing_marketing_system/images/webpage-logo-cb.png" style="height: 72px; width: auto;"/>
				</div>
				<div class="message-title" style="text-align: center; font-size: 40px; text-transform: uppercase; padding-bottom: 20px;"><?php print $var_name['listing_headline']; ?></div>
			<?php } ?>
		</div>
		<div class="message-first-image" style="text-align: center;">
			<div class="first-image" style="width: 100%;"><img src="<?php print $var_name['first_image']; ?>" style="width: 100%;"/></div>
			<div class="first-image-bottom" style="padding: 10px; width: 100%;float: left;">
				<div class="message-address" style="float: left; width: 48%; text-align: left;"><?php print $var_name['listing_address']; ?></div>
				<div class="message-bedroom" style="float: right; text-align: right; width: 48%; font-weight: bold;"><?php print $var_name['bedroom_detail']; ?></div>
			</div>
		</div>
		<div class="message-online-copy" style="padding: 5px 10px; width: 99%;"><?php print $var_name['online_copy']; ?></div>
		<div class="message-online-copy-bottom" style="margin: 0px 0px 30px 10px; width: 100%; text-align: center; float: left;">
			<div class="message-price" style="float: left; width: 48%; text-align: left;"><?php print $var_name['price']; ?></div>
			<div class="message-more-link" style="float: left; width: 48%; text-align: right;"><a href="<?php print $var_name['listing_url']?>"><img src="<?php print $base_url; ?>/sites/all/modules/custom/listing_marketing_system/images/click-here-button-with-text.png" /></a></div>
			
		</div>
		<div class="message-second-third-image" style="width: 100%; text-align: center; float: left;">
			<div class="second-image" style="float: left; width: 49.5%;"><img src="<?php print $var_name['second_image']; ?>" style="width: 100%;"/></div>
			<div class="third-image" style="float: right; width: 49.5%;"><img src="<?php print $var_name['third_image']; ?>" style="width: 100%;" /></div>
			<!--<div class="second-image" style="float: left; width: 49.5%;"><?php //print $var_name['second_image']; ?></div>
			<div class="third-image" style="float: right; width: 49.5%;"><?php //print $var_name['third_image']; ?></div>-->
		</div>
		<div class="message-fourth-image" style="padding-top: 9px; width: 100%; text-align: center; float: left;"><img src="<?php print $var_name['fourth_image']; ?>" style="width: 100%;"/></div>	
		<div class="message-agent-info" style="padding-left: 20px; padding-right: 20px; width: 100%; float: left;">
			<div class="agent-info" style="float: left; width: 100%;">
			<?php if(isset($var_name['agent_detail']['sales_team'])) {?>
				<div class="sales-team" style="float: left; width: 50%;">
					<div class="agent-image" style="float: left; vertical-align: top; margin-top: 20px;"><img src="<?php print $var_name['agent_detail']['sales_team']['profile_image']; ?>" style="width: 130px; height: auto !important;" /></div>
					<div class="agent-details" style="float: left;">
						<ul style="height: 140px; padding: 0px 0 0 10px;margin-top: 20px; margin-left: 10px; word-wrap: break-word;">
							<li style="list-style: none;"><?php print $var_name['agent_detail']['sales_team']['preferred_name']; ?></li>
							<?php if($var_name['agent_detail']['sales_team']['job_title'] != '') { ?>
								<li style="list-style: none;"><?php print $var_name['agent_detail']['sales_team']['job_title']; ?></li>
							<?php } ?>
							<?php if($var_name['agent_detail']['sales_team']['phone_direct'] != '') { ?>
								<li style="list-style: none;">P <?php print $var_name['agent_detail']['sales_team']['phone_direct']; ?></li>
							<?php } ?>
							<?php if($var_name['agent_detail']['sales_team']['phone_mobile'] != '') { ?>
								<li style="list-style: none;">C <?php print $var_name['agent_detail']['sales_team']['phone_mobile']; ?></li>
							<?php } ?>
							<li style="list-style: none;"><?php print $var_name['agent_detail']['sales_team']['person_email']; ?></li>
							<?php if($var_name['agent_detail']['sales_team']['state_license'] != '') { ?>
								<li style="list-style: none;"><?php print $var_name['agent_detail']['sales_team']['state_license']; ?></li>
							<?php } ?>
							<?php if($var_name['agent_detail']['sales_team']['agent_web_site'] != '') { ?>
								<li style="list-style: none;"><?php print $var_name['agent_detail']['sales_team']['agent_web_site']; ?></li>
							<?php } ?>
						</ul>
					</div>
				</div>
			<?php } else { ?>
				<div class="primary-agent" style="float: left; min-width: 40%;">
					<div class="agent-image" style="float: left; vertical-align: top; margin-top: 20px;"><img src="<?php print $var_name['agent_detail']['primary_agent']['profile_image']; ?>" style="width: 130px; height: auto !important;" /></div>
					<div class="agent-details" style="float: left;">
						<ul style="height: 140px; padding: 0px 0 0 10px;margin-top: 20px; margin-left: 10px; word-wrap: break-word;">
							<li style="list-style: none;"><?php print $var_name['agent_detail']['primary_agent']['preferred_name']; ?></li>
							<?php if($var_name['agent_detail']['primary_agent']['job_title'] != '') { ?>
								<li style="list-style: none;"><?php print $var_name['agent_detail']['primary_agent']['job_title']; ?></li>
							<?php } ?>
							<?php if($var_name['agent_detail']['primary_agent']['phone_direct'] != '') { ?>
								<li style="list-style: none;">P <?php print $var_name['agent_detail']['primary_agent']['phone_direct']; ?></li>
							<?php } ?>
							<?php if($var_name['agent_detail']['primary_agent']['phone_mobile'] != '') { ?>
								<li style="list-style: none;">C <?php print $var_name['agent_detail']['primary_agent']['phone_mobile']; ?></li>
							<?php } ?>
							<li style="list-style: none;"><?php print $var_name['agent_detail']['primary_agent']['person_email']; ?></li>
							<?php if($var_name['agent_detail']['primary_agent']['state_license'] != '') { ?>
								<li style="list-style: none;"><?php print $var_name['agent_detail']['primary_agent']['state_license']; ?></li>
							<?php } ?>
							<?php if($var_name['agent_detail']['primary_agent']['agent_web_site'] != '') { ?>
								<li style="list-style: none;"><?php print $var_name['agent_detail']['primary_agent']['agent_web_site']; ?></li>
							<?php } ?>
						</ul>
					</div>
				</div>
				<?php if(isset($var_name['agent_detail']['co_agent'])) {?>
				<div class="co-agent" style="float: left; min-width: 40%;">
					<div class="agent-image" style="float: left; vertical-align: top; margin-top: 20px;"><img src="<?php print $var_name['agent_detail']['co_agent']['profile_image']; ?>" style="width: 130px; height: auto !important;" /></div>
					<div class="agent-details" style="float: left;">
						<ul style="height: 140px; padding: 0px 0 0 10px;margin-top: 20px; margin-left: 10px; word-wrap: break-word;">
							<li style="list-style: none;"><?php print $var_name['agent_detail']['co_agent']['preferred_name']; ?></li>
							<?php if($var_name['agent_detail']['co_agent']['job_title'] != '') { ?>
								<li style="list-style: none;"><?php print $var_name['agent_detail']['co_agent']['job_title']; ?></li>
							<?php } ?>
							<?php if($var_name['agent_detail']['co_agent']['phone_direct'] != '') { ?>
								<li style="list-style: none;">P <?php print $var_name['agent_detail']['co_agent']['phone_direct']; ?></li>
							<?php } ?>
							<?php if($var_name['agent_detail']['co_agent']['phone_mobile'] != '') { ?>
								<li style="list-style: none;">C <?php print $var_name['agent_detail']['co_agent']['phone_mobile']; ?></li>
							<?php } ?>
							<li style="list-style: none;"><?php print $var_name['agent_detail']['co_agent']['person_email']; ?></li>
							<?php if($var_name['agent_detail']['co_agent']['state_license'] != '') { ?>
								<li style="list-style: none;"><?php print $var_name['agent_detail']['co_agent']['state_license']; ?></li>
							<?php } ?>
							<?php if($var_name['agent_detail']['co_agent']['agent_web_site'] != '') { ?>
								<li style="list-style: none;"><?php print $var_name['agent_detail']['co_agent']['agent_web_site']; ?></li>
							<?php } ?>
						</ul>
					</div>
				</div>
				<?php } ?>
			<?php } ?>
			</div>
			<div class="agent-logo" style="float: left; text-align: right; vertical-align: top; margin-top: 10px; width: 95%;"><img src="<?php print $base_url; ?>/sites/default/files/cbrb-logo-100w.jpg" /></div>
		</div>
		<div class="message-bottom-border" style="background-color: #002d55; margin-top: 10px; margin-bottom: 10px; width: 100%; float: left;">&nbsp;</div>
		<div class="message-bottom-message" style="padding: 10px; font-size: 12px; line-height: 14px; width: 100%; float: left;">
			&copy; <?php echo date("Y"); ?> 
			Coldwell Banker Real Estate LLC. All Rights Reserved. Coldwell Banker&reg; is a registered trademark licensed to Coldwell Banker Real Estate LLC. An Equal Opportunity Company. Equal Housing Opportunity. Each Coldwell Banker Residential Brokerage Office is Owned by a Subsidiary of NRT LLC. Real estate agents affiliated with Coldwell Banker Residential Brokerage are independent contractor sales associates and are not employees of Coldwell Banker Real Estate LLC, Coldwell Banker Residential Brokerage or NRT LLC. CalBRE License #01908304.
		</div>
		<div class="message-unsubscribe" style="text-align: center; margin-top: 20px; margin-bottom: 40px; width: 100%;"><a href="<?php print $var_name['unsubscribe_email']; ?>" style="color: #002D55; padding: 15px 25px 15px 25px; text-transform: uppercase;" target="_blank">REMOVE FROM LIST</a></div>
	<?php } ?>
</div>
