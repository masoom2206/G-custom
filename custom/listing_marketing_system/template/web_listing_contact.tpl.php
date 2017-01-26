<?php
global $base_url;
$property_disclaimer = module_invoke('block', 'block_view', '2');
$social_icon_path = "sites/default/files/icon";
$active= active_inactive_listing($var_name['node_nid']);
$node= node_load($var_name['node_nid']);
$user_load = user_load($node->uid);
//Current URL Alias
$request_uri = $_SERVER['REQUEST_URI'];
$exp_request_uri = explode('/', $request_uri);
//print "<pre>";print_r($user_load);exit;
//field_state_license['und']['0']['value']
?>
<div id="contact">
	<div class="web-listing-contact <?php print $var_name['design'];?>">
		<div class="gallery-head">
			<div class="gallery-title">CONTACT</div>
		</div>
	<?php if($exp_request_uri[1] == 'unbranded') { ?>
		<div class="web-listing-footer">			
			<div class="disclaimer unbranded">This information was supplied by Seller and/or other sources. Broker believes this information to be correct but has not verified this information and assumes no legal responsibility for its accuracy. Buyers should investigate these issues to their own satisfaction.</div>
			<div class="subscription"></div>
		</div>
	<?php } else { ?>
	<?php  ///field_lms_sales_team condition start
		if(isset($node->field_lms_sales_team['und']['0']['nid'])) {
		$nid = $node->field_lms_sales_team['und']['0']['nid'];
		$sales_team = node_load($nid);
		//$profile_image = isset($sales_team->field_sales_team_photo['und']['0']['uri']) ? file_create_url($sales_team->field_sales_team_photo['und']['0']['uri']) : '/sites/all/modules/custom/listing_marketing_system/images/default-image.jpg';
		$group_members = _get_users_in_group($nid);
		?>
		<!--<div class="region region-user19 col-xs-12 col-sm-12 col-md-6 col-lg-6 agent-detail">-->
		<div class="agent-detail">
			<div class="picture">
				<!--<img src="<?php //print $profile_image; ?>"/>-->
				<?php
					$image = array(
						'style_name' => 'web_listing_contact_image',
						'path' => isset($sales_team->field_sales_team_photo['und']['0']['uri']) ? $sales_team->field_sales_team_photo['und']['0']['uri'] : variable_get('user_picture_default'),
						'title' => $sales_team->field_sales_team_photo['und']['0']['filename'],
					);
					$photos = theme('image_style', $image);
					print $photos;
				?>
			</div>
			<div class="name">
				<?php print isset($sales_team->title) ? $sales_team->title : '--'; ?>
				<div class="border-bottom"></div>
			</div>
			<div class="group_name">
				<?php 
				$user_name=array();
				foreach ($group_members AS $member) {
					$user = user_load($member->uid);
					$user_name[] = $user->field_preferred_name['und'][0]['value'];
					
				}
				print $bedroom_detail = implode(' | ', $user_name);
				?>				
			</div>
			</br></br>
			<div class="about">
				<?php if(isset($sales_team->body['und']['0']['value'])) { ?>
					<div class="about_content">
						<?php //print substr($sales_team->body['und']['0']['value'], 0, 150).'<div class="border-bottom"></div>'; ?>
						<?php print $sales_team->body['und']['0']['value'].'<div class="border-bottom"></div>'; ?>
					</div>
				<?php } ?>
			</div>
			<div class="Connect">
				<div>Connect With Us</div>
				<div class="border-bottom"></div>
				<div class="social_links">
				<?php 
				if(!empty($user_load->field_phone_direct)){					
					print $phone_direct='<div class="contact_info">Direct <a href="tel:'.$user_load->field_phone_direct['und'][0]['value'].'">'.$user_load->field_phone_direct['und'][0]['value'].'</a></div>';
				}
				if(!empty($user_load->field_phone_mobile)){					
					print $phone_direct='<div class="contact_info">Mobile <a href="tel:'.$user_load->field_phone_mobile['und'][0]['value'].'">'.$user_load->field_phone_mobile['und'][0]['value'].'</a></div>';
				}
				if(!empty($sales_team->field_team_email['und']['0']['value'])){
					print $email='<div class="contact_info"><a href="mailto:'.$sales_team->field_team_email['und']['0']['value'].'">'.$sales_team->field_team_email['und']['0']['value'].'</a></div>';
				}
				if(isset($user_load->field_state_license['und']['0']['value'])){
					$license = 'Cal BRE# ';
					if(!empty($user_load->field_state_license['und']['0']['value'])) {
						$state_license_exp = explode('=', $user_load->field_state_license['und']['0']['value']);
						$license .= $state_license_exp[1];
					}
					print $cal_license = '<div class="contact_info">'.$license.'</div>';
				}
				if(isset($sales_team->field_team_website['und']['0']['url'])){
					$website = $sales_team->field_team_website['und']['0']['url'];
					print $web_site = '<div class="contact_info"><a href="http://'.$website.'">'.$website.'</a></div>';
				}
				if(!empty($sales_team->field_team_facebook_link['und'][0]['value'])){
					$url = $sales_team->field_team_facebook_link['und'][0]['value'];
					$url = preg_replace("(^https?:?//)", "", $url);
					print $facebook='<div class="social"><a href="http://'.$url.'" title="Facebook"><img src="'.$base_url.'/'.$social_icon_path.'/facebook-32.png" width="32" height="32"></a></div>';
				}
				/*if(!empty($user_load->field_user_google_plus)){
					print $google_plus='<div class="social"><a href="'.$user_load->field_user_google_plus['und'][0]['value'].'" title="Google+"><img src="'.$base_url.'/'.$social_icon_path.'/googleplus-32.png" width="32" height="32"></a></div>';
				}*/
				if(!empty($sales_team->field_team_linkedin_link['und'][0]['value'])){
					$url = $sales_team->field_team_linkedin_link['und'][0]['value'];
					$url = preg_replace("(^https?:?//)", "", $url);
					print $linkedin='<div class="social"><a href="http://'.$url.'" title="LinkedIn"><img src="'.$base_url.'/'.$social_icon_path.'/linkedin-32.png" width="32" height="32"></a></div>';
				}
				if(!empty($sales_team->field_team_twitter_link['und'][0]['value'])){
					$url = $sales_team->field_team_twitter_link['und'][0]['value'];
					$url = preg_replace("(^https?:?//)", "", $url);
					print $twitter='<div class="social"><a href="http://'.$url.'" title="Twitter"><img src="'.$base_url.'/'.$social_icon_path.'/twitter-32.png" width="32" height="32"></a></div>';
				}
				/*if(!empty($user_load->field_user_instagram)){
					print $instagram='<div class="social"><a href="'.$user_load->field_user_instagram['und'][0]['value'].'" title="Instagram"><img src="'.$base_url.'/'.$social_icon_path.'/Instagram-32.png"></a></div>';
				}
				if(!empty($user_load->field_user_pinterest)){
					print $pinterest='<div class="social"><a href="'.$user_load->field_user_pinterest['und'][0]['value'].'" title="Pinterest"><img src="'.$base_url.'/'.$social_icon_path.'/pinterest-32.png"></a></div>';
				}
				if(!empty($user_load->field_person_email)){
					print $email='<div class="social"><a href="mailto:'.$user_load->field_person_email['und'][0]['value'].'" title="Email"><img src="'.$base_url.'/'.$social_icon_path.'/mailto-32.png"></a></div>';
				}*/
				?>
				</div>
			</div>
		</div>
		<?php } ///field_lms_sales_team condition end
		else { 	 ///field_lms_other_agent condition start  ?>
		<!--<div class="region region-user19 col-xs-12 col-sm-12 col-md-6 col-lg-6 agent-detail">-->
		<div class="agent-detail">
		<div class="agent-detail-container">
		<div class="agents-detail">
			<div class="picture">
				<?php
					//print theme('image_style', array('path' => !empty($user_load->picture->uri) ? $user_load->picture->uri : variable_get('user_picture_default'), 'style_name' => 'thumbnail'));
					$image = array(
						'style_name' => 'web_listing_contact_image',
						'path' => isset($user_load->picture->uri) ? $user_load->picture->uri : variable_get('user_picture_default'),
						'title' => $user_load->picture->filename,
					);
					$photos = theme('image_style', $image);
					print $photos;
				?>
			</div>
			<div class="name">
				<?php print $user_load->field_preferred_name['und'][0]['value']; ?>
				<div class="border-bottom"></div>
			</div>			
			<div class="about">
				<?php if(isset($user_load->field_person_about['und']['0']['value'])) { ?>
					<div class="about_content">
					<?php print $user_load->field_person_about['und']['0']['value'].'<div class="border-bottom"></div>'; ?>
					</div>
				<?php } ?>
			</div>
			<div class="Connect">
				<div>Connect With Me</div>
				<div class="border-bottom"></div>
				<div class="social_links">
				<?php 
				if(!empty($user_load->field_phone_direct)){
					print $phone_direct='<div class="contact_info">Direct <a href="tel:'.$user_load->field_phone_direct['und'][0]['value'].'">'.$user_load->field_phone_direct['und'][0]['value'].'</a></div>';
				}
				if(!empty($user_load->field_phone_mobile)){					
					print $phone_direct='<div class="contact_info">Mobile <a href="tel:'.$user_load->field_phone_mobile['und'][0]['value'].'">'.$user_load->field_phone_mobile['und'][0]['value'].'</a></div>';
				}
				if(!empty($user_load->field_person_email)){
					print $email='<div class="contact_info"><a href="mailto:'.$user_load->field_person_email['und'][0]['value'].'">'.$user_load->field_person_email['und'][0]['value'].'</a></div>';
				}
				if(isset($user_load->field_state_license['und']['0']['value'])){
					$license = 'Cal BRE# ';
					if(!empty($user_load->field_state_license['und']['0']['value'])) {
						$state_license_exp = explode('=', $user_load->field_state_license['und']['0']['value']);
						$license .= $state_license_exp[1];
					}
					print $cal_license = '<div class="contact_info">'.$license.'</div>';
				}
				if(isset($user_load->field_agent_web_site['und']['0']['value'])){
					$website = $user_load->field_agent_web_site['und']['0']['value'];
					print $web_site = '<div class="contact_info"><a href="http://'.$website.'">'.$website.'</a></div>';
				}
				if(!empty($user_load->field_user_facebook)){
					$url = $user_load->field_user_facebook['und'][0]['value'];
					$url = preg_replace("(^https?:?//)", "", $url);
					print $facebook='<div class="social"><a href="http://'.$url.'" title="Facebook" target="_blank"><img src="'.$base_url.'/'.$social_icon_path.'/facebook-32.png" width="32" height="32"></a></div>';					
				}
				/*if(!empty($user_load->field_user_google_plus)){
					print $google_plus='<div class="social"><a href="'.$user_load->field_user_google_plus['und'][0]['value'].'" title="Google+"><img src="'.$base_url.'/'.$social_icon_path.'/googleplus-32.png" width="32" height="32"></a></div>';
				}*/
				if(!empty($user_load->field_user_linked_in)){
					$url = $user_load->field_user_linked_in['und'][0]['value'];
					$url = preg_replace("(^https?:?//)", "", $url);
					print $linkedin='<div class="social"><a href="http://'.$url.'" title="LinkedIn"><img src="'.$base_url.'/'.$social_icon_path.'/linkedin-32.png" width="32" height="32"></a></div>';
				}
				if(!empty($user_load->field_user_twitter)){
					$url = $user_load->field_user_twitter['und'][0]['value'];
					$url = preg_replace("(^https?:?//)", "", $url);
					print $twitter='<div class="social"><a href="http://'.$url.'" title="Twitter"><img src="'.$base_url.'/'.$social_icon_path.'/twitter-32.png" width="32" height="32"></a></div>';
				}
				/*if(!empty($user_load->field_user_instagram)){
					print $instagram='<div class="social"><a href="'.$user_load->field_user_instagram['und'][0]['value'].'" title="Instagram"><img src="'.$base_url.'/'.$social_icon_path.'/Instagram-32.png"></a></div>';
				}
				if(!empty($user_load->field_user_pinterest)){
					print $pinterest='<div class="social"><a href="'.$user_load->field_user_pinterest['und'][0]['value'].'" title="Pinterest"><img src="'.$base_url.'/'.$social_icon_path.'/pinterest-32.png"></a></div>';
				}
				if(!empty($user_load->field_person_email)){
					print $email='<div class="social"><a href="mailto:'.$user_load->field_person_email['und'][0]['value'].'" title="Email"><img src="'.$base_url.'/'.$social_icon_path.'/mailto-32.png"></a></div>';
				}*/
				?>
				</div>
			</div>
		</div>
		
		<?php 
		if(isset($node->field_lms_other_agent['und']['0']['uid'])) {
		$co_user_load = user_load($node->field_lms_other_agent['und']['0']['uid']);
		?>
		
		<div class="agents-detail">
			<div class="picture">
				<?php
					//print theme('image_style', array('path' => !empty($co_user_load->picture->uri) ? $co_user_load->picture->uri : variable_get('user_picture_default'), 'style_name' => 'thumbnail'));
					$image = array(
						'style_name' => 'web_listing_contact_image',
						'path' => isset($co_user_load->picture->uri) ? $co_user_load->picture->uri : variable_get('user_picture_default'),
						'title' => $co_user_load->picture->filename,
					);
					$photos = theme('image_style', $image);
					print $photos;
				?>
			</div>
			<div class="name">
				<?php print $co_user_load->field_preferred_name['und'][0]['value']; ?>
				<div class="border-bottom"></div>
			</div>			
			<div class="about">
				<?php if(isset($co_user_load->field_person_about['und']['0']['value'])) { ?>
					<div class="about_content">
						<?php print $co_user_load->field_person_about['und']['0']['value'].'<div class="border-bottom"></div>'; ?>
					</div>
				<?php } ?>
			</div>
			<div class="Connect">
				<div>Connect With Me</div>
				<div class="border-bottom"></div>
				<div class="social_links">
				<?php 
				if(!empty($co_user_load->field_phone_direct)){
					print $phone_direct='<div class="contact_info">Direct <a href="tel:'.$co_user_load->field_phone_direct['und'][0]['value'].'">'.$co_user_load->field_phone_direct['und'][0]['value'].'</a></div>';
				}
				if(!empty($co_user_load->field_phone_mobile)){					
					print $phone_direct='<div class="contact_info">Mobile <a href="tel:'.$co_user_load->field_phone_mobile['und'][0]['value'].'">'.$co_user_load->field_phone_mobile['und'][0]['value'].'</a></div>';
				}
				if(!empty($co_user_load->field_person_email)){
					print $email='<div class="contact_info"><a href="mailto:'.$co_user_load->field_person_email['und'][0]['value'].'">'.$co_user_load->field_person_email['und'][0]['value'].'</a></div>';
				}
				if(isset($co_user_load->field_state_license['und']['0']['value'])){
					$license = 'Cal BRE# ';
					if(!empty($co_user_load->field_state_license['und']['0']['value'])) {
						$state_license_exp = explode('=', $co_user_load->field_state_license['und']['0']['value']);
						$license .= $state_license_exp[1];
					}
					print $cal_license = '<div class="contact_info">'.$license.'</div>';
				}
				if(isset($co_user_load->field_agent_web_site['und']['0']['value'])){
					$website = $co_user_load->field_agent_web_site['und']['0']['value'];
					print $web_site = '<div class="contact_info"><a href="http://'.$website.'">'.$website.'</a></div>';
				}
				if(!empty($co_user_load->field_user_facebook)){
					$url = $co_user_load->field_user_facebook['und'][0]['value'];
					$url = preg_replace("(^https?:?//)", "", $url);
					print $facebook='<div class="social"><a href="http://'.$url.'" title="Facebook"><img src="'.$base_url.'/'.$social_icon_path.'/facebook-32.png" width="32" height="32"></a></div>';
				}
				/*if(!empty($co_user_load->field_user_google_plus)){
					print $google_plus='<div class="social"><a href="'.$co_user_load->field_user_google_plus['und'][0]['value'].'" title="Google+"><img src="'.$base_url.'/'.$social_icon_path.'/googleplus-32.png" width="32" height="32"></a></div>';
				}*/
				if(!empty($co_user_load->field_user_linked_in)){
					$url = $co_user_load->field_user_linked_in['und'][0]['value'];
					$url = preg_replace("(^https?:?//)", "", $url);
					print $linkedin='<div class="social"><a href="http://'.$url.'" title="LinkedIn"><img src="'.$base_url.'/'.$social_icon_path.'/linkedin-32.png" width="32" height="32"></a></div>';
				}
				if(!empty($co_user_load->field_user_twitter)){
					$url = $co_user_load->field_user_twitter['und'][0]['value'];
					$url = preg_replace("(^https?:?//)", "", $url);
					print $twitter='<div class="social"><a href="http://'.$url.'" title="Twitter"><img src="'.$base_url.'/'.$social_icon_path.'/twitter-32.png" width="32" height="32"></a></div>';
				}
				/*if(!empty($co_user_load->field_user_instagram)){
					print $instagram='<div class="social"><a href="'.$co_user_load->field_user_instagram['und'][0]['value'].'" title="Instagram"><img src="'.$base_url.'/'.$social_icon_path.'/Instagram-32.png"></a></div>';
				}
				if(!empty($co_user_load->field_user_pinterest)){
					print $pinterest='<div class="social"><a href="'.$co_user_load->field_user_pinterest['und'][0]['value'].'" title="Pinterest"><img src="'.$base_url.'/'.$social_icon_path.'/pinterest-32.png"></a></div>';
				}
				if(!empty($co_user_load->field_person_email)){
					print $email='<div class="social"><a href="mailto:'.$co_user_load->field_person_email['und'][0]['value'].'" title="Email"><img src="'.$base_url.'/'.$social_icon_path.'/mailto-32.png"></a></div>';
				}*/
				?>
				</div>
			</div>
		</div>
		<?php } }  ?>
		</div>
		</div>
		<div class="web-listing-footer">
			<div class="icon"><img src="/sites/default/files/cbrb-logo-100w.jpg" width="100" height="58"/></div>
			<div class="disclaimer">
				<?php //print render($property_disclaimer['content']); ?>
				&copy; <?php echo date("Y"); ?> 
				Coldwell Banker Real Estate LLC. All Rights Reserved. Coldwell Banker&reg; is a registered trademark licensed to Coldwell Banker Real Estate LLC. An Equal Opportunity Company. Equal Housing Opportunity. Each Coldwell Banker Residential Brokerage Office is Owned by a Subsidiary of NRT LLC. Real estate agents affiliated with Coldwell Banker Residential Brokerage are independent contractor sales associates and are not employees of Coldwell Banker Real Estate LLC, Coldwell Banker Residential Brokerage or NRT LLC. CalBRE License #01908304.
			</div>
			<div class="subscription"></div>
		</div>
		<?php } ?>
	</div>
</div>
