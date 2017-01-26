<?php
//print "<pre>";print_r($var_name);exit;
	global $user, $base_url;
	$agent = array("Agent", "Agent - beta test");
	$agent_roles_result = array_intersect($agent, $user->roles);	
	$admin = array("Siteadmin", "Administrator");
	$admin_roles_result = array_intersect($admin, $user->roles);
	$photo_link = ($var_name['photo_nid'] != NULL) ? '/listing-photos/'.$var_name['nid'] : '/node/add/lms-photos?listing='.$var_name['nid'];
	$video_link = ($var_name['photo_nid'] != NULL) ? '/listing-video/'.$var_name['nid'] : '';
	$video_nid = ($var_name['video_nid'] != NULL) ? '/node/'.$var_name['video_nid'].'/edit' : '/node/add/lms-video';
	$document_nid = ($var_name['document_nid'] != NULL) ? '/listing-document/'.$var_name['nid'] : '/node/add/lms-listing-document?listing='.$var_name['nid'];
	$product_image_url = '';
	$website_link = ($var_name['nid'] != NULL) ? '/listing-website/'.$var_name['nid'] : '';
	$brouchers_link = ($var_name['nid'] != NULL) ? '/listing-brochures/'.$var_name['nid'] : '';
	$share_link = ($var_name['nid'] != NULL) ? '/share/'.$var_name['nid'] : '';
	$post_to_circle_link = ($var_name['nid'] != NULL) ? '/post-to-circle/'.$var_name['nid'] : '';
	$analytics_link = ($var_name['nid'] != NULL) ? '/listing-analytics/'.$var_name['nid'] : '';
	$email_link = ($var_name['nid'] != NULL) ? '/listing-email/'.$var_name['nid'] : '';
	$client_report_link = ($var_name['report_nid'] == NULL) ? '/node/add/lms-client-report?listing_nid='.$var_name['nid'] : '/node/'.$var_name['report_nid'].'/edit?listing_nid='.$var_name['nid'];
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
	if(isset($var_name['marketing_coordinator_status']) && $var_name['marketing_coordinator_status'] != ''){
		$term = taxonomy_term_load($var_name['marketing_coordinator_status']);
		$marketing_status = $term->name;
		$coordinator_status = 'Status: <span>'.$marketing_status.'</span>';
		$coordinator_status = $marketing_status;
	}
	if($var_name['marketing_coordinator_uid'] != '' && $var_name['marketing_coordinator_uid'] != $user->uid){
		$uid = $var_name['marketing_coordinator_uid'];
		$user_detail = user_load($uid);
		//print "<pre>";print_r($user_detail);exit;
		$coordinator_title = 'Your Marketing Coordinator';
		$coordinator_name = isset($user_detail->field_firstname['und']['0']['value']) ? $user_detail->field_firstname['und']['0']['value'].' ' : ucwords($user_detail->name);
		$coordinator_name .= isset($user_detail->field_lastname['und']['0']['value']) ? $user_detail->field_lastname['und']['0']['value'] : '';
		$coordinator_photo = '';
		if(isset($user_detail->picture->uri)) {
			$coordinator_photo = file_create_url($user_detail->picture->uri);
		}
		else {
			$coordinator_photo = '/'.drupal_get_path('module', 'listing_marketing_system').'/images/no-image.jpg';
		}
		$marketing_coordinator = '<div class="marketing-coordinator marketing-coordinator-box">
				<div class="marketing-coordinator-title">'.$coordinator_title.'</div>
				<div class="marketing-coordinator-photo"><img src="'.$coordinator_photo.'" /></div>
				<div class="marketing-coordinator-name">
					<div class="coordinator-name">'.$coordinator_name.'</div>
					<div class="coordinator-contact"><a href="mailto:'.$user_detail->mail.'" target="_top">Contact</a></div>
				</div>					
			</div>';
	}
	else {
		$marketing_coordinator = '';
	}
	if(isset($_SESSION['my_listing_back']) && $_SESSION['my_listing_back'] != '') {
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
				<div><img src="<?php print $product_image_url; ?>"/></div>
				<div class="order-name"><?php print $var_name['product']; ?></div>
				<div class="order-status">Status: <?php print $coordinator_status; ?></div>
			</div>
		<?php } ?>
	</div>
	<?php if($var_name['product'] == '' && !in_array('Agent', $user->roles)){ ?>
		<div class="manage-listing-back"></div>
		<div class="manage-listing-tool-body">
			<div class="no-listing-product">
				<div class="mc-static-text"><span>Marketing Concierge | </span>Sit back and relax. It's handled. Upgrade here to professionally printed brochures, direct mail, enhanced websites and more. Choose from three packages and your Marketing Coordinator will handle the rest. Or simply follow the steps below to self service.</div>
				<div class="mc-image"><a href="/marketing-concierge/<?php print $var_name['nid']; ?>"><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/mc-tool.jpg" /></a></div>
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
					<?php if(($marketing_status == 'In Progress') && ($var_name['agent_uid'] == $user->uid ||  $var_name['co_agent'] == $user->uid)){ ?>					
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
					<?php if(($marketing_status == 'In Progress') && ($var_name['agent_uid'] == $user->uid ||  $var_name['co_agent'] == $user->uid)){ ?>
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
					<a href="<?php print $document_nid; ?>">
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/documents.png"></div>
						<div>documents</div>
					</a>
				</li>
				<li>
					<?php if(($marketing_status == 'In Progress') && ($var_name['agent_uid'] == $user->uid ||  $var_name['co_agent'] == $user->uid)){ ?>
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
					<?php if(($marketing_status == 'In Progress') && ($var_name['agent_uid'] == $user->uid ||  $var_name['co_agent'] == $user->uid)){ ?>					
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
					<?php if(($marketing_status == 'In Progress') && ($var_name['agent_uid'] == $user->uid ||  $var_name['co_agent'] == $user->uid)){ ?>
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/embed-html-disabled.png"></div>
						<div>embed</div>
					<?php } else { ?>
						<a href="#" id="listing-embed-link">
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/embed-html.png"></div>
						<div>embed</div>
					<?php } ?>
				</li>
				<li>
					<?php if(($marketing_status == 'In Progress') && ($var_name['agent_uid'] == $user->uid ||  $var_name['co_agent'] == $user->uid)){ ?>
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
					<?php if(($marketing_status == 'In Progress') && ($var_name['agent_uid'] == $user->uid ||  $var_name['co_agent'] == $user->uid)){ ?>
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/share-disabled.png"></div>
						<div>share</div>
					<?php } else { ?>
					<a href="<?php print $share_link; ?>">
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/share.png"></div>
						<div>share</div>
						</a>
					<?php } ?>
				</li>
				<li>
					<a href="<?php print $analytics_link; ?>" id="listing-analystics">
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/analytics.png"></div>
						<div>analytics</div>
					</a>
				</li>
				<li>
					<?php if(($marketing_status == 'In Progress') && ($var_name['marketing_coordinator_uid'] == $user->uid ||  in_array('Siteadmin', $user->roles) ||  in_array('Administrator', $user->roles))){ ?>
						<a href="<?php print $brouchers_link; ?>">
							<div>
								<img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/pro-brochures.png">
							</div>
						</a>
						<div>pro brochures</div>
					<?php } else { ?>
						<div>
							<img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/pro-brochures-disabled.png">
						</div>
						<div>pro brochures</div>
					<?php }?>
				</li>
				<li>
					<?php if(empty($agent_roles_result) || $user->uid == 1) { ?>
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/print-go-brochures.png"></div>
						<div>print and go</div>
					<?php } else { ?>
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/print-go-brochures-disabled.png"></div>
						<div>print and go</div>
					<?php } ?>
				</li>
				<li>
					<div>
						<?php if(($marketing_status == 'In Progress') && ($var_name['marketing_coordinator_uid'] == $user->uid ||  in_array('Siteadmin', $user->roles) ||  in_array('Administrator', $user->roles))){ ?>
							<img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/post-cards.png">
						<?php } else { ?>
							<img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/post-cards-disabled.png">
						<?php } ?>
					</div>
					<div>postcards</div>
				</li>
				<li>
					<a href="<?php print $post_to_circle_link; ?>">
						<div><img src="/sites/all/modules/custom/listing_marketing_system/images/tool-icons/post-to-circle.png"></div>
						<div>post to circle</div>
					</a>
				</li>
				<li>
					<?php //if((($marketing_status == 'In Progress') && ($var_name['marketing_coordinator_uid'] == $user->uid)) ||  (in_array('Siteadmin', $user->roles) ||  in_array('Administrator', $user->roles))){ 
					if(!in_array('Agent', $user->roles)){ 
						?>
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
		$variables = array('path' => $base_url.'/embed-listing/'.$var_name['nid'], 'width' => 400, 'height' => 300);
		$embed_code = web_widgets_render_embed_code('iframe', $variables);
		print $embed_code;
	?>
	<ul class="embed-button">
		<!--<li class="clipboard"><a href="#" id="d_clip_button">Copy to Clipboard</a></li>-->
		<li class="save-widget"><a href="/embed-code/download" id="embed_code_download">Save widget code as .txt file</a></li>
	</ul>
</div>
