<?php
global $base_url;
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
.second_image{padding-right:5px; width: 450px;}
.third_image{padding-left:5px; width: 450px;}
.second_image img, .third_image img{width:100%;}
@media screen and (max-device-width: 480px) {
   .agent-info{float: none !important; width: 100% !important; min-height: 400px;}
   .agent-info .agent-image{float: none !important;}
   .agent-info .agent-details{float: none !important;}
 }
 
</style>

	<?php if($mc_order == 1) { ?>
	<table width= "900" align="center" style="border: 1px solid #bbb; line-height: normal; color: #000;width: 900px; padding: 1px;">
			<tr>
				<td align="center" style="font-size: 14px;" colspan="2">
					<div style="text-align: center; font-size: 14px; padding-top: 20px; padding-bottom: 20px;"><a href="<?php print $var_name['listing_url']?>" style="color: #000; text-transform: uppercase; font-weight: 600;">Click to view in your browser</a></div>
				</td>
			</tr>
			<?php if($var_name['previews'] == 1) {?>
			<tr>
				<td align="center" colspan="2">
					<div class="message-logo" style="text-align: center; padding-bottom: 10px;">
					<img src="<?php print $base_url; ?>/sites/all/modules/custom/listing_marketing_system/images/webpage-logo-cb-previews.png" style="height: 72px; width: auto;"/>
				</div>
				</td>
			</tr>
			<tr>
				<td align="center" colspan="2">
					<div class="message-title" style="font-size: 40px; text-transform: uppercase; padding-bottom: 20px; font-weight: 200; border-bottom: 1px solid #7a7a7a; width: 60%; color: #6b6f73;"><?php print $var_name['mc_listing_address']; ?></div>
				</td>
			</tr>
				
				
			<?php } else {?>
			<tr>
				<td align="center" colspan="2">
					<div class="message-logo" style="text-align: center; padding-bottom: 10px;">
				<img src="<?php print $base_url; ?>/sites/all/modules/custom/listing_marketing_system/images/webpage-logo-cb.png" style="height: 72px; width: auto;"/>
				</div>
				</td>
			</tr>
			<tr>
				<td align="center" colspan="2">
					<div class="message-title" style="font-size: 40px; text-transform: uppercase; padding-bottom: 20px; font-weight: 200; border-bottom: 1px solid #7a7a7a; width: 60%; color: #6b6f73;"><?php print $var_name['mc_listing_address']; ?></div>
				</td>
			</tr>
			<?php } ?>
		<tr>
			<td colspan="2" align="center" style="font-size: 40px; text-transform: uppercase;">
			<?php if(isset($var_name['agent_detail']['sales_team'])) {?>
			<div class="message-title" style="text-align: center; font-size: 32px; text-transform: uppercase; padding: 25px 0px; font-weight: 200; width: 100%; color: #6b6f73;">Presented by <?php print $var_name['agent_detail']['sales_team']['preferred_name']; ?></div>
		<?php } else { if(isset($var_name['agent_detail']['co_agent'])) { ?>
			<div class="message-title" style="text-align: center; font-size: 32px; text-transform: uppercase; padding: 25px 0px; font-weight: 200; width: 100%; color: #6b6f73;">Presented by <br/><?php print $var_name['agent_detail']['primary_agent']['preferred_name']; ?> and <?php print $var_name['agent_detail']['co_agent']['preferred_name']; ?></div>
		<?php } else { ?>
			<div class="message-title" style="text-align: center; font-size: 32px; text-transform: uppercase; padding: 25px 0px; font-weight: 200; width: 100%; color: #6b6f73;">Presented by <?php print $var_name['agent_detail']['primary_agent']['preferred_name']; ?></div>
		<?php } } ?>
			</td>
		</tr>
		<tr>
			<td colspan="2" align="center"  style="padding-bottom: 10px;">
				<div class="message-first-image">
				<div class="first-image"><img src="<?php print $var_name['first_image']; ?>"/></div>
				</div>
			</td>
		</tr>
		<tr>
			<td align="left">
				<img src="<?php print $var_name['second_image']; ?>"/>
			</td>
			<td align="right">
				<img src="<?php print $var_name['third_image']; ?>"/>
			</td>
		</tr>
		<tr>
			<td colspan="2" align="left" style="font-size: 32px; width: 100%; font-weight: 200; padding: 10px; color: #7a7a7a; ">
				<div class="message-title"><?php print $var_name['listing_headline']; ?></div>
			</td>
		</tr>
		<tr>
			<td align="left" colspan="2" style="padding: 0px 5px 10px 10px; font-size: 20px; font-weight: 300; color: #7a7a7a;">
				<div class="message-online-copy"><?php print $var_name['online_copy']; ?></div>
			</td>
		</tr>
		<tr>
			<td align="left" colspan="2">
				<?php if($var_name['youtube_url'] != '') { ?>
				<div class="message-fourth-image" style="width: 100%; text-align: center; float: left; position: relative; background-image: url(<?php print $var_name['fourth_image']; ?>); background-size: cover;">
					<div style="background-color: rgba(0, 0, 0, .3); padding: 25% 0%;">
						<div class="title" style="font-size: 48px; text-transform: uppercase; color: #fff; width: 100%; z-index: 99;">Virtual Tour</div>
						<div class="mail-play-icon"><a href="<?php print $var_name['youtube_url']; ?>" target="_blank"><img src="<?php print $base_url; ?>/sites/all/modules/custom/listing_marketing_system/images/mail-play-icon.jpg" /></a></div>
					</div>
				</div>
			<?php } ?>
			</td>
		</tr>
		<tr>
			<td colspan="2" align="center">
				<table class="message-forward-contact-me" style="width: 61% !important; padding: 40px; margin-left: auto; margin-right: auto;">
				<tr>
					<td class="message-forward" style="padding: 40px 0; width: 50%;">
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
			</td>
		</tr>
		<tr>
			<td colspan="2" align="center" style="padding: 17px; background-color: #3a3d40; color: #fff; text-transform: uppercase; font-size: 22px; margin: 15px 0px;">
				<div class="message-fourth-image">Request More Information</div>
			</td>
		</tr>
		<tr>
			<td align="center" colspan="2" style="padding-left: 20px; padding-right: 20px;">
				<table>
					<tr>
						<?php if(isset($var_name['agent_detail']['sales_team'])) {?>
							<td align="center">
								<div class="agent-image" style="vertical-align: top; padding-top: 20px;">
									<?php print $var_name['agent_detail']['sales_team']['profile_image']; ?>
								</div>
								<div class="agent-details" style="padding: 20px 0 0 20px; word-wrap: break-word; font-family: Raleway;">
									<span style="font-size: 19px; line-height: 22px; text-transform: uppercase;"><?php print $var_name['agent_detail']['sales_team']['preferred_name']; ?></span><br />
									<?php if($var_name['agent_detail']['sales_team']['about'] != '') { ?>
										<span style="font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['sales_team']['about']; ?></span><br />
									<?php } ?>
									<?php if($var_name['agent_detail']['sales_team']['job_title'] != '') { ?>
										<span style="font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['sales_team']['job_title']; ?></span><br />
									<?php } ?>
									<?php if($var_name['agent_detail']['sales_team']['phone_direct'] != '') { ?>
										<span style="font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['sales_team']['phone_direct']; ?></span><br />
									<?php } ?>
										<span style="font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['sales_team']['person_email']; ?></span><br />
									<?php if($var_name['agent_detail']['sales_team']['agent_web_site'] != '') { ?>
										<span style="font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['sales_team']['agent_web_site']; ?></span><br />
									<?php } ?>
									<?php if($var_name['agent_detail']['sales_team']['state_license'] != '') { ?>
										<span style="font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['sales_team']['state_license']; ?></span><br />
									<?php } ?>
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
							</td>
						<?php } else { if(isset($var_name['agent_detail']['co_agent'])) { ?>
							<td class="primary-agent" align="center" width="445" style="text-align: center; vertical-align: top; padding-top: 20px;">
							<?php } else { ?>
							<td class="primary-agent" align="center" style="text-align: center; vertical-align: top; padding-top: 20px;">
							<?php } ?>
								<div class="agent-image">
									<?php print $var_name['agent_detail']['primary_agent']['profile_image']; ?>
								</div>
					<div class="agent-details" style="padding: 20px 0 0 20px; word-wrap: break-word; font-family: Raleway;">
							<span style="font-size: 19px; line-height: 22px; text-transform: uppercase;"><?php print $var_name['agent_detail']['primary_agent']['preferred_name']; ?></span><br />
							<?php if($var_name['agent_detail']['primary_agent']['about'] != '') { ?>
								<span style="font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['primary_agent']['about']; ?></span><br />
							<?php } ?>
							<?php if($var_name['agent_detail']['primary_agent']['job_title'] != '') { ?>
								<span style="font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['primary_agent']['job_title']; ?></span><br />
							<?php } ?>
							<?php if($var_name['agent_detail']['primary_agent']['phone_direct'] != '') { ?>
								<span style="font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['primary_agent']['phone_direct']; ?></span><br />
							<?php } ?>
							<span style="font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['primary_agent']['person_email']; ?></span><br />
							<?php if($var_name['agent_detail']['primary_agent']['agent_web_site'] != '') { ?>
								<span style="font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['primary_agent']['agent_web_site']; ?></span><br />
							<?php } ?>
							<?php if($var_name['agent_detail']['primary_agent']['state_license'] != '') { ?>
								<span style="font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['primary_agent']['state_license']; ?></span><br />
							<?php } ?>
						<div class="social-links" style="width: 100%; text-align: center; padding-top: 10px;">
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
							</td>
							<?php if(isset($var_name['agent_detail']['co_agent'])) {?>
								<td class="co-agent" align="center" width="445" style="text-align: center; vertical-align: top; padding-top: 20px;  font-family: Raleway;">
									<div class="agent-image">
										<?php print $var_name['agent_detail']['co_agent']['profile_image']; ?>
									</div>
									<div class="agent-details" style="padding: 20px 0 0 20px; word-wrap: break-word;">
											<span style=" font-size: 19px; line-height: 22px; text-transform: uppercase;"><?php print $var_name['agent_detail']['co_agent']['preferred_name']; ?></span><br />
											<?php if($var_name['agent_detail']['co_agent']['about'] != '') { ?>
												<span style="font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['co_agent']['about']; ?></span><br />
											<?php } ?>
											<?php if($var_name['agent_detail']['co_agent']['job_title'] != '') { ?>
												<span style="font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['co_agent']['job_title']; ?></span><br />
											<?php } ?>
											<?php if($var_name['agent_detail']['co_agent']['phone_direct'] != '') { ?>
												<span style="font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['co_agent']['phone_direct']; ?></span><br />
											<?php } ?>
											<span style="font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['co_agent']['person_email']; ?></span><br />
											<?php if($var_name['agent_detail']['co_agent']['agent_web_site'] != '') { ?>
												<span style="font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['co_agent']['agent_web_site']; ?></span><br />
											<?php } ?>
											<?php if($var_name['agent_detail']['co_agent']['state_license'] != '') { ?>
												<span style="font-size: 16px; line-height: 22px;"><?php print $var_name['agent_detail']['co_agent']['state_license']; ?></span><br />
											<?php } ?>
										<div class="social-links" style="width: 100%; text-align: center; padding-top: 10px;">
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
							<?php } ?>
						<?php } ?>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td colspan="2" align="center" style="padding-top: 80px;">
				<div class="message-unsubscribe"><a href="<?php print $var_name['unsubscribe_email']; ?>" style="color: #7a7a7a; padding: 15px 25px 15px 25px; text-transform: uppercase; font-size: 20px; font-weight: 500;" target="_blank">UNSUBSCRIBE</a></div>
			</td>
		</tr>
		<tr>
			<td colspan="2" align="center" style="padding-top: 15px; padding-bottom: 15px; ">
				<div class="message-add" style="text-align: center; font-weight: 400;">This is an advertisement.</div>
			</td>
		</tr>
		<tr>
			<td colspan="2" align="center" style="padding-bottom: 20px;">
				<div class="message-add" style="text-align: center; color: #6a6e73; font-size: 14px;">Coldwell Banker Residential Brokerage | 1801 N California Blvd #100, Walnut Creek, CA</div>
			</td>
		</tr>
		<tr>
			<td colspan="2">
				<table>
					<tr>
					 <td align="left" style="padding: 10px;">
						<div class="agent-logo" style="vertical-align: top;"><img src="<?php print $base_url; ?>/sites/default/files/cbrb-logo-100w.jpg" /></div>
					</td>
					<td align="left" style="padding: 10px; font-size: 12px; line-height: 14px; ">
						<div class="copyright">&copy; <?php echo date("Y"); ?> 
					Coldwell Banker Real Estate LLC. All Rights Reserved. Coldwell Banker&reg; is a registered trademark licensed to Coldwell Banker Real Estate LLC. An Equal Opportunity Company. Equal Housing Opportunity. Each Coldwell Banker Residential Brokerage Office is Owned by a Subsidiary of NRT LLC. Real estate agents affiliated with Coldwell Banker Residential Brokerage are independent contractor sales associates and are not employees of Coldwell Banker Real Estate LLC, Coldwell Banker Residential Brokerage or NRT LLC. CalBRE License #01908304.</div>
					</td>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td colspan="2">
				<div class="message-blank" style="width: 100%;">&nbsp;</div>
			</td>
		</tr>
	</table>
	<?php } else { ?>
		<table width= "900" align="center" style="border: 1px solid #bbb; line-height: normal; color: #000;width: 900px; padding: 1px;">
			<tr>
				<td align="center" style="padding: 20px 0px; font-size: 14px;" colspan="2">
					<a href="<?php print $var_name['listing_url']?>" style="color: #000;">Email not displaying correctly? View it in your browser.</a>
				</td>
			</tr>
			<tr>
			<td align="center" style="padding-bottom: 10px;" colspan="2">
				<?php if($var_name['previews'] == 1) {?>
						<img src="<?php print $base_url; ?>/sites/all/modules/custom/listing_marketing_system/images/webpage-logo-cb-previews.png" style="height: 72px; width: auto;"/>
				<?php } else {?>
						<img src="<?php print $base_url; ?>/sites/all/modules/custom/listing_marketing_system/images/webpage-logo-cb.png" style="height: 72px; width: auto;"/>
				<?php } ?>
			</td>
		</tr>
		<tr>
			<td colspan="2" align="center" style="font-size: 40px; text-transform: uppercase; padding-bottom: 20px;">
				<?php print $var_name['listing_headline']; ?>
			</td>
		</tr>
		<tr>
			<td align="left" colspan="2">
				<img src="<?php print $var_name['first_image']; ?>"/>
			</td>
		</tr>
		<tr>
			<td align="left" style="padding: 10px 0px 10px 0px;">
				<?php print $var_name['listing_address']; ?>
			</td>
			<td align="right" style="font-weight: bold;">
				<?php print $var_name['bedroom_detail']; ?>
			</td>
		</tr>
			<td align="left" colspan="2" style="padding: 5px 5px 10px 10px;">
				<?php print $var_name['online_copy']; ?>
			</td>
		<tr>
		</tr>
		<tr>
			<td align="left"  style="padding: 0px 0px 10px 0px;">
				 <?php print $var_name['price']; ?>
			</td>
			<td align="right"  style="padding: 0px 30px 10px 0px;">
				 <a href="<?php print $var_name['listing_url']?>"><img src="<?php print $base_url; ?>/sites/all/modules/custom/listing_marketing_system/images/click-here-button-with-text.png" /></a>
			</td>
		</tr>
		<tr style="width:100%;">
			<td align="left" class="second_image">
				<img src="<?php print $var_name['second_image']; ?>"/>
			</td>
			<td align="right" class="third_image">
				<img src="<?php print $var_name['third_image']; ?>"/>
			</td>
		</tr>
		<tr>
			<td align="left" colspan="2" style="padding-top: 10px;">
				<img src="<?php print $var_name['fourth_image']; ?>"/>
			</td>
		</tr>
		<tr>
			<td align="left" colspan="2" style="padding: 10px;">
			<table>
				<tr>
					<?php if(isset($var_name['agent_detail']['sales_team'])) {?>
					<td align="left" width="150">
						<div class="agent-image"><img src="<?php print $var_name['agent_detail']['sales_team']['profile_image']; ?>" /></div>
					</td>
					<td style="padding-left: 20px;">
							<?php print $var_name['agent_detail']['sales_team']['preferred_name']; ?><br />
							<?php if($var_name['agent_detail']['sales_team']['job_title'] != '') { ?>
								<?php print $var_name['agent_detail']['sales_team']['job_title']; ?><br />
							<?php } ?>
							<?php if($var_name['agent_detail']['sales_team']['phone_direct'] != '') { ?>
								P <?php print $var_name['agent_detail']['sales_team']['phone_direct']; ?><br />
							<?php } ?>
							<?php if($var_name['agent_detail']['sales_team']['phone_mobile'] != '') { ?>
								C <?php print $var_name['agent_detail']['sales_team']['phone_mobile']; ?><br />
							<?php } ?>
							<?php print $var_name['agent_detail']['sales_team']['person_email']; ?><br />
							<?php if($var_name['agent_detail']['sales_team']['state_license'] != '') { ?>
								<?php print $var_name['agent_detail']['sales_team']['state_license']; ?><br />
							<?php } ?>
							<?php if($var_name['agent_detail']['sales_team']['agent_web_site'] != '') { ?>
								<?php print $var_name['agent_detail']['sales_team']['agent_web_site']; ?><br />
							<?php } ?>
					</td>
				<?php } else { ?>
					<td align="left" width="150">
						<div class="agent-image"><img src="<?php print $var_name['agent_detail']['primary_agent']['profile_image']; ?>"/></div>
					</td>
					<td style="padding-left: 20px;">
							<?php print $var_name['agent_detail']['primary_agent']['preferred_name']; ?><br />
							<?php if($var_name['agent_detail']['primary_agent']['job_title'] != '') { ?>
								<?php print $var_name['agent_detail']['primary_agent']['job_title']; ?><br />
							<?php } ?>
							<?php if($var_name['agent_detail']['primary_agent']['phone_direct'] != '') { ?>
								P <?php print $var_name['agent_detail']['primary_agent']['phone_direct']; ?><br />
							<?php } ?>
							<?php if($var_name['agent_detail']['primary_agent']['phone_mobile'] != '') { ?>
								C <?php print $var_name['agent_detail']['primary_agent']['phone_mobile']; ?><br />
							<?php } ?>
							<?php print $var_name['agent_detail']['primary_agent']['person_email']; ?><br />
							<?php if($var_name['agent_detail']['primary_agent']['state_license'] != '') { ?>
								<?php print $var_name['agent_detail']['primary_agent']['state_license']; ?><br />
							<?php } ?>
							<?php if($var_name['agent_detail']['primary_agent']['agent_web_site'] != '') { ?>
								<?php print $var_name['agent_detail']['primary_agent']['agent_web_site']; ?><br />
							<?php } ?>
					</td>
				<?php if(isset($var_name['agent_detail']['co_agent'])) {?>
					<td align="left" width="150">
						<div class="agent-image"><img src="<?php print $var_name['agent_detail']['co_agent']['profile_image']; ?>"/></div>
					</td>
					<td style="padding-left: 20px;">
							<?php print $var_name['agent_detail']['co_agent']['preferred_name']; ?><br />
							<?php if($var_name['agent_detail']['co_agent']['job_title'] != '') { ?>
								<?php print $var_name['agent_detail']['co_agent']['job_title']; ?><br />
							<?php } ?>
							<?php if($var_name['agent_detail']['co_agent']['phone_direct'] != '') { ?>
								P <?php print $var_name['agent_detail']['co_agent']['phone_direct']; ?><br />
							<?php } ?>
							<?php if($var_name['agent_detail']['co_agent']['phone_mobile'] != '') { ?>
								C <?php print $var_name['agent_detail']['co_agent']['phone_mobile']; ?><br />
							<?php } ?>
							<?php print $var_name['agent_detail']['co_agent']['person_email']; ?><br />
							<?php if($var_name['agent_detail']['co_agent']['state_license'] != '') { ?>
								<?php print $var_name['agent_detail']['co_agent']['state_license']; ?><br />
							<?php } ?>
							<?php if($var_name['agent_detail']['co_agent']['agent_web_site'] != '') { ?>
								<?php print $var_name['agent_detail']['co_agent']['agent_web_site']; ?><br />
							<?php } ?>
					</td>
				<?php } ?>
				<?php } ?>
				</tr>
			</table>
			</td>
		</tr>
		<tr>
			<td colspan="2" align="right" style="padding: 10px 55px 0 0 ;">
				<div class="agent-logo"><img src="<?php print $base_url; ?>/sites/default/files/cbrb-logo-100w.jpg" /></div>
			</td>
		</tr>
		<tr>
			<td colspan="2" style="padding: 10px 0;">
				<div class="message-bottom-border" style="background-color: #002d55;">&nbsp;</div>
			</td>
		</tr>
		<tr>
			<td colspan="2">
				<div class="message-bottom-message" style="padding: 10px; font-size: 12px; line-height: 14px; width: 100%; float: left;">
					&copy; <?php echo date("Y"); ?> 
					Coldwell Banker Real Estate LLC. All Rights Reserved. Coldwell Banker&reg; is a registered trademark licensed to Coldwell Banker Real Estate LLC. An Equal Opportunity Company. Equal Housing Opportunity. Each Coldwell Banker Residential Brokerage Office is Owned by a Subsidiary of NRT LLC. Real estate agents affiliated with Coldwell Banker Residential Brokerage are independent contractor sales associates and are not employees of Coldwell Banker Real Estate LLC, Coldwell Banker Residential Brokerage or NRT LLC. CalBRE License #01908304.
				</div>
			</td>
		</tr>
		<tr>
			<td colspan="2" align="center" style="padding: 20px 0 40px 0;">
				<div class="message-unsubscribe"><a href="<?php print $var_name['unsubscribe_email']; ?>" style="color: #002D55; padding: 15px 25px 15px 25px; text-transform: uppercase;" target="_blank">REMOVE FROM LIST</a></div>
			</td>
		</tr>
		</table>
	<?php } ?>
