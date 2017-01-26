<?php
	//print "<pre>";print_r($var_name);exit;
	global $user, $base_url;
	$user_detail = user_load($user->uid);
	$user_office_id = isset($user_detail->field_member_office['und']['0']['value']) ? $user_detail->field_member_office['und']['0']['value'] : '';
	$roles_count = count($user->roles);
	$agent = array("Agent", "Agent - beta test");
	$agent_roles_result = array_intersect($agent, $user->roles);	
	$admin = array("Siteadmin", "Administrator");
	$admin_roles_result = array_intersect($admin, $user->roles);
	//New user role "Marketing Concierge"
	$mc_roles = array("Siteadmin", "Administrator", "Marketing Concierge");
	$mc_roles_result = array_intersect($mc_roles, $user->roles);
	//office roles
	$office_roles = array("Office Administrator", "Manager", "Marketing Coordinator");
	$office_roles_result = array_intersect($office_roles, $user->roles);
	$photo_link = ($var_name['photo_nid'] != NULL) ? '/listing-photos/'.$var_name['nid'] : '/node/add/lms-photos?listing='.$var_name['nid'];
	$video_link = ($var_name['photo_nid'] != NULL) ? '/listing-video/'.$var_name['nid'] : '';
	$video_nid = ($var_name['video_nid'] != NULL) ? '/node/'.$var_name['video_nid'].'/edit' : '/node/add/lms-video';
	$document_nid = ($var_name['document_nid'] != NULL) ? '/listing-document/'.$var_name['nid'] : '/node/add/lms-listing-document?listing='.$var_name['nid'];
	$product_image_url = '';
	$website_link = ($var_name['nid'] != NULL) ? '/listing-website/'.$var_name['nid'] : '';
	$brouchers_link = ($var_name['nid'] != NULL) ? '/listing-brochures/'.$var_name['nid'] : '';
	$share_link = ($var_name['nid'] != NULL) ? '/share/'.$var_name['nid'] : '';
	$shared_pdf_brochure = $var_name['shared_pdf_brochure'];
	$post_to_circle_link = ($var_name['nid'] != NULL) ? '/post-to-circle/'.$var_name['nid'] : '';
	$analytics_link = ($var_name['nid'] != NULL) ? '/listing-analytics/'.$var_name['nid'] : '';
	$email_link = ($var_name['nid'] != NULL) ? '/listing-email/'.$var_name['nid'] : '';
	$client_report_link = ($var_name['report_nid'] == NULL) ? '/node/add/lms-client-report?listing_nid='.$var_name['nid'] : '/node/'.$var_name['report_nid'].'/edit?listing_nid='.$var_name['nid'];
	$print_and_go_link = ($var_name['nid'] != NULL) ? '/print-and-go/'.$var_name['nid'] : '';
	$postcard_link = ($var_name['nid'] != NULL) ? '/postcard/'.$var_name['nid'] : '';
	$percent = cbone_flag_meter_status();
	if($var_name['product'] != ''){
		if($var_name['product'] == 'Premier') {
			$product_image_url = '/'.drupal_get_path('module', 'listing_marketing_system'). '/images/mc-premier.png';
		}
		else if($var_name['product'] == 'Platinum') {
			$product_image_url = '/'.drupal_get_path('module', 'listing_marketing_system'). '/images/mc-platinum.png';
		}
		else if($var_name['product'] == 'Platinum Plus') {
			$product_image_url = '/'.drupal_get_path('module', 'listing_marketing_system'). '/images/mc-platinum-plus.png';
		}	
	}
	$marketing_coordinator = '';
	$marketing_status = '';
	$coordinator_status = '';
	//if(isset($var_name['marketing_coordinator_status']) && $var_name['marketing_coordinator_status'] != ''){
	if(isset($var_name['mcc_order_status']) && $var_name['mcc_order_status'] != 0 && $var_name['approve_pdf_status'] == ''){
		$term = taxonomy_term_load($var_name['mcc_order_status']);
		$marketing_status = $term->name;
		$coordinator_status = 'Status: '.$marketing_status;
		//$coordinator_status = $marketing_status;
	}
	else {
		$coordinator_status = $var_name['approve_pdf_status'];
	}
	$listing_user = '';
	if($user->uid == $var_name['agent_uid']) {
		$listing_user = ' listing_user';
	}
	if($var_name['marketing_coordinator_uid'] != ''){
		$uid = $var_name['marketing_coordinator_uid'];
		$mc_user_detail = user_load($uid);
		//print "<pre>";print_r($mc_user_detail);exit;
		$coordinator_title = 'Your Marketing Coordinator';
		$coordinator_name = isset($mc_user_detail->field_preferred_name['und']['0']['value']) ? $mc_user_detail->field_preferred_name['und']['0']['value'].' ' : ucwords($mc_user_detail->name);
		$coordinator_phone = isset($mc_user_detail->field_phone_direct['und']['0']['value']) ? $mc_user_detail->field_phone_direct['und']['0']['value'] : '---';
		$coordinator_photo = '';
		if(isset($mc_user_detail->picture->uri)) {
			$coordinator_photo = file_create_url($mc_user_detail->picture->uri);
		}
		else {
			$coordinator_photo = '/'.drupal_get_path('module', 'listing_marketing_system').'/images/no-image.jpg';
		}
		$marketing_coordinator = '<div class="marketing-coordinator marketing-coordinator-box">
				<div class="marketing-coordinator-photo"><img src="'.$coordinator_photo.'" /></div>
				<div class="marketing-coordinator-title">'.$coordinator_title.'</div>
				<div class="coordinator-name">'.$coordinator_name.'</div>
				<div  class="coordinator-phone-email">					
					<div class="coordinator-phone"><img src="/sites/all/modules/custom/listing_marketing_system/images/mc-phone.jpg" /><span>'.$coordinator_phone.'</span></div>
				</div>
				<div class="coordinator-contact"><a href="mailto:'.$mc_user_detail->mail.'" target="_top">send message</a></div>
			</div>';
	}
	else if(in_array('Marketing Coordinator', $user->roles) && $var_name['mcc_order_status'] != 0 && $var_name['listing_office_id'] == $user_office_id){
		$term = taxonomy_term_load($var_name['mcc_order_status']);
		if($term->name == 'Pending MC Confirmation') {
		$marketing_coordinator = '<div class="accept-and-confirm-order">
				<div class="confirm-order">
					<span><a href="javascript:void(0);" listing-nid="'.$var_name['nid'].'" id="mcc-order-confirm">Accept and Confirm Order</a></span>
				</div>
			</div>';
		}
	}
	else {
		$marketing_coordinator = '';
	}
	if(!empty($office_roles_result)) {
		$my_listing_back = '/office-listings-agent/'.$var_name['agent_uid'];
	}
	else if(isset($_SESSION['my_listing_back']) && $_SESSION['my_listing_back'] != '') {
		$my_listing_back = '/'.$_SESSION['my_listing_back'];
	}
	else {
		$my_listing_back = '/node/510';
	}
?>
<div class="manage-listing-tools">
	<div class="listing-tools-header">
		<div class="manage-listing-logo"><a href="https://www.cbone.me"><img src="/sites/all/modules/custom/listing_marketing_system/images/cbone-logo-small.jpg"></a></div>
		<?php if($var_name['product'] != ''){ ?>
			<div class="purchase-product-logo">
				<div class="product-logo"><img src="<?php print $product_image_url; ?>"/></div>
				<div class="order-name"><?php print $var_name['product']; ?></div>
				<div class="order-status"><?php print $coordinator_status; ?></div>
			</div>
		<?php } ?>
	</div>
	<?php if($var_name['product'] == '' && !empty($mc_roles_result)){ ?>
		<div class="manage-listing-back"></div>
		<div class="manage-listing-tool-body">
			<div class="no-listing-product">
				<div class="mc-static-text"><span>Marketing Concierge | </span>Sit back and relax. It's handled. Upgrade here to professionally printed brochures, direct mail, enhanced websites and more. Choose from four packages and your Marketing Coordinator will handle the rest. Or simply follow the steps below to self service.</div>
				<div class="mc-image"><a href="/marketing-concierge/<?php print $var_name['nid']; ?>" id="upgrade-marketing-concierge" class="upgrade-mc<?php print $listing_user; ?><?php print $var_name['listing_photos_status']; ?><?php print $var_name['listing_data_status']; ?> <?php print $var_name['listing_marketing_headline']; ?>"><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/mc-tool.jpg" /></a></div>
				<div class="mc-title">upgrade to<br/>marketing concierge</div>	
			</div>
		</div>
	<?php } ?><!--my-listings-->
	<div class="manage-listing-back"><a href="<?php print $my_listing_back; ?>"><img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png"></a></div>
	<div class="manage-listing-tool-body">
		<div class="listing-tools-body">
			<div class="tools-title"><div>Listing</div>
				<div class="listing-address"><?php print $var_name['listing_address']; ?></div>
				<div class="listing-support">Support ID: <?php print $var_name['agent_uid']; ?>.<?php print $var_name['nid']; ?></div>		
			</div>
			<?php print $marketing_coordinator; ?>
			<ul class="listing-tool">	
				<li>
					<?php if($var_name['mc_tool_matrix']['details'] == 0){ ?>
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/listing-details-disabled.png"></div>
							<div>details</div>					
					<?php } else { ?>
						<a href="/node/<?php print $var_name['nid'];?>/edit">
							<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/listing-details.png"></div>
							<div>details</div>
						</a>
					<?php } ?>
				</li>
				<li>
					<?php if($var_name['mc_tool_matrix']['photos'] == 0){ ?>
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/photos-disabled.png"></div>
						<div>photos</div>
					<?php } else { ?>
						<a href="<?php print $photo_link; ?>">
							<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/photos.png"></div>
							<div>photos</div>
						</a>
					<?php } ?>
				</li>
				<li>
					<?php if($var_name['mc_tool_matrix']['documents'] == 0){ ?>
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/documents-disabled.png"></div>
							<div>documents</div>
					<?php } else { ?>
						<a href="<?php print $document_nid; ?>">
							<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/documents.png"></div>
							<div>documents</div>
						</a>
					<?php } ?>
				</li>
				<li>
					<?php if($var_name['mc_tool_matrix']['video'] == 0){ ?>
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/video-disabled.png"></div>
						<div>video</div>
					<?php } else { ?>
						<a href="<?php print $video_link; ?>">
							<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/video.png"></div>
							<div>video</div>
						</a>
					<?php } ?>
				</li>
			</ul>		
			<div class="tools-title">Marketing and Social Media Tools</div>	
			<ul>
				<li>
					<?php if($var_name['mc_tool_matrix']['website'] == 0){ ?>
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/property-website-disabled.png"></div>
						<div>website</div>					
					<?php } else { ?>
						<a href="<?php print $website_link; ?>">
							<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/property-website.png"></div>
							<div>website</div>
						</a>
					<?php } ?>
				</li>
				<li>
					<?php if($var_name['mc_tool_matrix']['embed'] == 0){ ?>
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/embed-html-disabled.png"></div>
						<div>embed</div>
					<?php } else { ?>
						<a href="#" id="listing-embed-link">
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/embed-html.png"></div>
						<div>embed</div>
					<?php } ?>
				</li>
				<li>
					<?php if($var_name['mc_tool_matrix']['email'] == 0){ ?>
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/email-disabled.png"></div>
						<div>email</div>
					<?php } else { ?>
						<a href="<?php print $email_link; ?>" id="listing-email">
							<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/email.png"></div>
							<div>email</div>
						</a>
					<?php } ?>
				</li>
				<li>
					<?php if($var_name['mc_tool_matrix']['share'] == 0){ ?>
						<div>
							<img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/share-disabled.png"></div>
						<div>share</div>
					<?php } else { ?>
						<div>
							<a href="<?php print $share_link; ?>" id="<?php print$shared_pdf_brochure; ?>" class="share_listing"><div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/share.png"></div>
							<div>share</div>
							</a>
						</div>
					<?php } ?>
				</li>
				<li>
					<?php if($var_name['mc_tool_matrix']['analytics'] == 0){ ?>
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/analytics-disabled.png"></div>
							<div>analytics</div>
					<?php } else { ?>
						<a href="<?php print $analytics_link; ?>" id="listing-analystics">
							<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/analytics.png"></div>
							<div>analytics</div>
						</a>
					<?php } ?>
				</li>
				<!--Pro Brochures Icon condition Start-->
				<li>
					<?php if($var_name['mc_tool_matrix']['pro_brochures'] == 0) { ?>
						<div>
							<img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/pro-brochures-disabled.png">
						</div>
						<div>pro brochures</div>
					<?php } else if($var_name['mc_tool_matrix']['pro_brochures'] == 1) { ?>
						<?php if($var_name['pro_brochure_mc_pdf_count'] > 0){ ?>
							<?php if(!empty($office_roles_result)) { ?>
								<a href="<?php print $brouchers_link; ?>">
							<?php } else { ?>
								<a href="<?php print '/pro-brochures-approval/'.$var_name['nid']; ?>">
							<?php }  ?>						
								<div>
									<img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/pro-brochure-approve.png">
								</div>
								<div>pro brochures</div>
							</a>
						<?php } else { ?>
							<a href="<?php print $brouchers_link; ?>">
								<div>
									<img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/pro-brochures.png">
								</div>
								<div>pro brochures</div>
							</a>
						<?php } ?>
					<?php } else if($var_name['mc_tool_matrix']['pro_brochures'] == 2) { ?>
						<?php if($var_name['pro_brochure_mc_pdf_count'] > 0){ ?>
							<?php if(!empty($office_roles_result)) { ?>
								<a href="<?php print $brouchers_link; ?>">
							<?php } else { ?>
								<a href="<?php print '/pro-brochures-approval/'.$var_name['nid']; ?>">
							<?php }  ?>						
								<div>
									<img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/pro-brochure-approve.png">
								</div>
								<div>pro brochures</div>
							</a>
						<?php } else { ?>
							<div>
								<img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/pro-brochures-disabled.png">
							</div>
							<div>pro brochures</div>
						<?php }?>
					<?php }?>
				</li>
				<!--Pro Brochures Icon condition End-->
				<li>
					<?php if($var_name['mc_tool_matrix']['print_and_go'] == 0){ ?>
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/print-go-brochures-disabled.png"></div>
						<div>print and go</div>
					<?php } else { ?>
						<a href="<?php print $print_and_go_link; ?>">
							<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/print-go-brochures.png"></div>
							<div>print and go</div>
						</a>
					<?php } ?>
				</li>
				<!--PostCard Icon condition Start-->
				<li>
					<?php if($var_name['mc_tool_matrix']['post_cards'] == 0) { ?>
						<div>
							<img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/post-cards-disabled.png">
						</div>
						<div>postcards</div>
					<?php } else if($var_name['mc_tool_matrix']['post_cards'] == 1) { ?>
						<?php if($var_name['postcard_mc_pdf_count'] > 0){ ?>
							<?php if(!empty($office_roles_result)) { ?>
								<a href="<?php print $postcard_link; ?>">
							<?php } else { ?>
								<a href="<?php print '/postcard-approval/'.$var_name['nid']; ?>">
							<?php }  ?>
								<div>
									<img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/post-cards-approve.png">
								</div>
								<div>postcards</div>
							</a>
						<?php } else { ?>
							<a href="<?php print $postcard_link; ?>">
								<div>
									<img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/post-cards.png">
								</div>
								<div>postcards</div>
							</a>
						<?php } ?>
					<?php } else if($var_name['mc_tool_matrix']['post_cards'] == 2) { ?>
						<?php if($var_name['postcard_mc_pdf_count'] > 0){ ?>
							<?php if(!empty($office_roles_result)) { ?>
								<a href="<?php print $postcard_link; ?>">
							<?php } else { ?>
								<a href="<?php print '/postcard-approval/'.$var_name['nid']; ?>">
							<?php }  ?>
								<div>
									<img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/post-cards-approve.png">
								</div>
								<div>postcards</div>
							</a>
						<?php } else { ?>
							<div>
								<img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/post-cards-disabled.png">
							</div>
							<div>postcards</div>
						<?php } ?>
					<?php } ?>
				</li>
				<!--PostCard Icon condition End-->
				<li>
					<?php if($var_name['mc_tool_matrix']['post_to_circle'] == 0){ ?>
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/post-cards-disabled.png"></div>
						<div>post to circle</div>				
					<?php } else { ?>
					    <a href="<?php print $post_to_circle_link; ?>">
							<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/post-to-circle.png"></div>
							<div>post to circle</div>				
						</a>
					<?php } ?>
				</li>
				<li>
					<?php if($var_name['mc_tool_matrix']['client_report'] == 0){ ?>
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/client-report-disabled.png"></div>
							<div>client report</div>
					<?php } else { ?>
						<a href="<?php print $client_report_link; ?>">
							<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/client-report.png"></div>
							<div>client report</div>
						</a>
					<?php } ?>
				</li>
			</ul>
			<?php if(!empty($admin_roles_result)) { ?>
				<div class="tools-title">Collaborative Services</div>
				<ul>
					<li>
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/photography.png"></div>
						<div>photography</div>
					</li>
				</ul>
			<?php } ?>
			<div class="listing-completed-notcompleted">
				<?php if($percent == 100) { ?>
					<div><img src="/sites/default/files/images/icon/flag/completed_gray.png" border="0"></div>
				<?php } else { ?>
					<div><img src="/sites/default/files/images/icon/flag/not-completed-gray.png" border="0"></div>
				<?php } ?>
			</div>
		</div>
	</div>
</div>
<div>
	<div id="image_popup">
		<span class="button b-close"><span>[ X ]</span></span>
		<div class="image_area"></div>
	</div>
</div>
<div id="listing-embed-code">
	<span class="button b-close"><span>X</span></span>
	<div class="listing-embed-title">Embed code</div>
	<div class="listing-embed-text">Copy and paste the following embed code into your website or blog to display a list of all your active Property Web Pages. If your website has an embed tool you can probably use that (same as used for embeding You Tube videos). If you are unable to embed code on your website yourself provide the code to your website designer or host provider.</div>
	<?php
		global $base_url;
		$path = $base_url.'/embed-listing/'.$var_name['nid'];
		$style = 'iframe';
		$code = '<!DOCTYPE html>
		<html>
			<body>
				<iframe src="'.$path.'" width="100%" height="900">
				  <p>Your browser does not support iframes.</p>
				</iframe>
			</body>
		</html>';
		print theme('web_widgets_embed_code', array('code' => $code, 'style' => $style));
	?>
	<?php
		/*global $base_url;
		$variables = array('path' => $base_url.'/embed-listing/'.$var_name['nid'], 'width' => 100%, 'height' => 300);
		$embed_code = web_widgets_render_embed_code('iframe', $variables);
		print $embed_code;*/
	?>
	<ul class="embed-button">
		<!--<li class="clipboard"><a href="#" id="d_clip_button">Copy to Clipboard</a></li>-->
		<li class="save-widget"><a href="/embed-code/download/<?php print $var_name['nid'];?>" id="embed_code_downloaded">Save widget code as .txt file</a></li>
	</ul>
</div>
