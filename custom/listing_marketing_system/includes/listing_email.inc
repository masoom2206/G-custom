<?php
/**
 * Callback function cbone_listing_website()
 * to displayed the listing website setup
 * @return $output
 **/
function cbone_listing_email($nid){
	global $user;
	$output = '';
	$listing_node = node_load($nid);
	//Listing Address
	$address = array();
	if(isset($listing_node->field_lms_listing_address['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_listing_address['und']['0']['value'];
	}
	if(isset($listing_node->field_lms_address_unit['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_address_unit['und']['0']['value'];
	}
	if(isset($listing_node->field_lms_listing_city['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_listing_city['und']['0']['value'];
	}
	if(isset($listing_node->field_lms_listing_state['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_listing_state['und']['0']['value'];
	}
	if(isset($listing_node->field_lms_listing_zip['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_listing_zip['und']['0']['value'];
	}
	$listing_address = implode(', ', $address);
		
	$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
		'listing_uid' => $listing_node->uid,
	);
	$output = theme('listing_email', array('var_name' => $variables));
	return $output;
}

/**
 * Callback function cbone_listing_email_message()
 * to displayed the listing website setup
 * @return $output
 **/
function cbone_listing_email_message($nid, $email = NULL){
	global $user, $base_url;
	$output = '';
	//Check MC order for Listing
	$order = db_select("field_data_field_lms_listing_reference", 'lr');
	$order->fields('lr', array('entity_id'));
	$order->condition('lr.entity_type', 'commerce_order', 'LIKE');
	$order->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$order_id = $order->execute()->fetchField();
	$product = array();
	$product_sku = '';
	if($order_id != NULL) {
		$order = commerce_order_load($order_id);
		$line_item_id = $order->commerce_line_items['und']['0']['line_item_id'];
		$line_item = commerce_line_item_load($line_item_id);
		$product_id = $line_item->commerce_product['und']['0']['product_id'];
		$product = commerce_product_load($product_id);
		$product_sku = $product->sku;
	}
	//Listing Node detail
	$listing_node = node_load($nid);
	//print "<pre>";print_r($listing_node);exit;
	//images
	$first_image = cbone_web_listing_photo_table($listing_node->nid, 'first');
	$second_image = cbone_web_listing_photo_table($listing_node->nid, 'second');
	$third_image = cbone_web_listing_photo_table($listing_node->nid, 'third');
	//$second_image = cbone_web_listing_photo_table($listing_node->nid, 'email2');
	//$third_image = cbone_web_listing_photo_table($listing_node->nid, 'email3');
	$fourth_image = cbone_web_listing_photo_table($listing_node->nid, 'fourth');
	//heading
	$listing_headline = isset($listing_node->field_lms_listing_headline['und']['0']['value']) ? $listing_node->field_lms_listing_headline['und']['0']['value'] : '';
	//logo
	$previews = 0;
	if(isset($listing_node->field_lms_presentation['und']['0'])) {
		foreach($listing_node->field_lms_presentation['und']['0'] as $presentation) {
			if($presentation == 'previews') {
				$previews = 1;
			}
		}
	}
	//Listing Address
	if(isset($listing_node->field_lms_hide_listing_address['und']['0']['value']) && $listing_node->field_lms_hide_listing_address['und']['0']['value'] == 1) {		
		$listing_address = t('Address Available Upon Request');
		$mc_listing_address = t('Address Available Upon Request');
	}
	else {
		$address = array();
		$mc_address = array();
		if(isset($listing_node->field_lms_listing_address['und']['0']['value'])) {
			$address[] = $listing_node->field_lms_listing_address['und']['0']['value'];
			$mc_listing_address = $listing_node->field_lms_listing_address['und']['0']['value'].'<br/>';
		}
		if(isset($listing_node->field_lms_address_unit['und']['0']['value'])) {
			$address[] = $listing_node->field_lms_address_unit['und']['0']['value'];
		}
		if(isset($listing_node->field_lms_listing_city['und']['0']['value'])) {
			$address[] = $listing_node->field_lms_listing_city['und']['0']['value'];
			$mc_address[] = $listing_node->field_lms_listing_city['und']['0']['value'];
		}
		if(isset($listing_node->field_lms_listing_state['und']['0']['value'])) {
			$address[] = $listing_node->field_lms_listing_state['und']['0']['value'];
			$mc_address[] = $listing_node->field_lms_listing_state['und']['0']['value'];
		}
		if(isset($listing_node->field_lms_listing_zip['und']['0']['value'])) {
			$address[] = $listing_node->field_lms_listing_zip['und']['0']['value'];
		}
		$listing_address = implode(', ', $address);
		$implode_mc_address = implode(', ', $mc_address);
		$mc_listing_address .= $implode_mc_address;
	}
	//bedroom detail
	$bedroom = array();
	if(isset($listing_node->field_lms_total_bedrooms['und']['0']['value'])) {
		$bedroom[] = $listing_node->field_lms_total_bedrooms['und']['0']['value'].' beds';
	}
	if(isset($listing_node->field_lms_total_baths['und']['0']['value'])) {
		$bedroom[] = $listing_node->field_lms_total_baths['und']['0']['value'].' bath';
	}
	if(isset($listing_node->field_lms_square_feet['und']['0']['value']) && is_numeric($listing_node->field_lms_square_feet['und']['0']['value']) ) {
		$bedroom[] = 'approximately '. number_format($listing_node->field_lms_square_feet['und']['0']['value']).' square feet';
	}
	$bedroom_detail = implode(', ', $bedroom);
	//Online Copy
	$online_copy = isset($listing_node->field_lms_online_copy['und']['0']['value']) ? $listing_node->field_lms_online_copy['und']['0']['value'] : '';
	//Price
	$price = '&nbsp';
	if(isset($listing_node->field_lms_list_price['und']['0']['value']) || isset($listing_node->field_lms_listing_data['und']['0']['value']) ) {
		if( isset($listing_node->field_lms_listing_data['und']['0']['value']) && $listing_node->field_lms_listing_data['und']['0']['value']== 1){
			$price = t('Price Upon Request');
		}
		else if( isset($listing_node->field_lms_list_price['und']['0']['value'])){
			if(is_numeric($listing_node->field_lms_list_price['und']['0']['value'])){
				$price = 'Offered at $'. number_format($listing_node->field_lms_list_price['und']['0']['value']);
			}
			else{
				$price = 'Offered at '.$listing_node->field_lms_list_price['und']['0']['value'];
			}
		}	
	}
	//Primary Agent
	$agent_uid = isset($listing_node->field_lms_agent_uid['und']['0']['value']) ? $listing_node->field_lms_agent_uid['und']['0']['value'] : $listing_node->uid;
	$primart_agent_detail = user_load($agent_uid);
	$agent_email = isset($primart_agent_detail->field_preferred_email['und']['0']['value']) ? $primart_agent_detail->field_preferred_email['und']['0']['value'] : $primart_agent_detail->mail;
	
	//Agent Detail
	$agent_detail = array();
	if(isset($listing_node->field_lms_sales_team['und']['0']['nid'])) {
		$sales_team_nid = $listing_node->field_lms_sales_team['und']['0']['nid'];
		$sales_team = node_load($sales_team_nid);
		//square_thumbnail
		if($order_id != NULL) {
			if($product->sku != 'LMS-04') {
				$image = array(
					'style_name' => 'square_thumbnail',
					'path' => isset($sales_team->field_sales_team_photo['und']['0']['uri']) ? $sales_team->field_sales_team_photo['und']['0']['uri'] : 'public://images/default-image.jpg',
					'title' => $sales_team->field_sales_team_photo['und']['0']['filename'],
					'attributes' => array('style' => array('border-radius: 50%')),
				);
				$agent_detail['sales_team']['profile_image'] = theme('image_style', $image);
			}
			else {
				$img_url = isset($sales_team->field_sales_team_photo['und']['0']['uri']) ? $sales_team->field_sales_team_photo['und']['0']['uri'] : variable_get('user_picture_default');
				
				 $agent_detail['sales_team']['profile_image'] = image_style_url('listing_emal_thumbnail', $img_url);
			}
		}
		else{
			//$agent_detail['sales_team']['profile_image'] = isset($sales_team->field_sales_team_photo['und']['0']['uri']) ? file_create_url($sales_team->field_sales_team_photo['und']['0']['uri']) : $base_url.'/sites/all/modules/custom/listing_marketing_system/images/default-image.jpg';
			$img_url = isset($sales_team->field_sales_team_photo['und']['0']['uri']) ? $sales_team->field_sales_team_photo['und']['0']['uri'] : variable_get('user_picture_default');
				
			$agent_detail['sales_team']['profile_image'] = image_style_url('listing_emal_thumbnail', $img_url);
		}
		
		
		
		$profile_text = isset($sales_team->body['und']['0']['value']) ? substr($sales_team->body['und']['0']['value'], 0, 150) : '';
		$agent_detail['sales_team']['preferred_name'] = $sales_team->title;
		$agent_detail['sales_team']['about'] = isset($sales_team->body['und']['0']['value']) ? $sales_team->body['und']['0']['value'] : '';
		$agent_detail['sales_team']['job_title'] = isset($primart_agent_detail->field_job_title['und']['0']['value']) ? $primart_agent_detail->field_job_title['und']['0']['value'] : '';		
		$agent_detail['sales_team']['phone_mobile'] = isset($primart_agent_detail->field_phone_mobile['und']['0']['value']) ? $primart_agent_detail->field_phone_mobile['und']['0']['value'] : '';
		$agent_detail['sales_team']['phone_direct'] = isset($primart_agent_detail->field_phone_direct['und']['0']['value']) ? $primart_agent_detail->field_phone_direct['und']['0']['value'] : '';
		$agent_detail['sales_team']['person_email'] = isset($primart_agent_detail->field_person_email['und']['0']['value']) ? $primart_agent_detail->field_person_email['und']['0']['value'] : $primart_agent_detail->mail;
		if(!empty($sales_team->field_team_twitter_link['und']['0']['value'])){
			$url = $sales_team->field_team_twitter_link['und']['0']['value'];
			$url = preg_replace("(^https?:?//)", "", $url);
			$agent_detail['sales_team']['twitter'] = '<span class="social" style="margin-right: 5px;"><a href="http://'.$url.'" title="Twitter"><img src="'.$base_url.'/sites/default/files/icon/twitter-32.png" width="25" height="25"></a></span>';
		}
		if(!empty($sales_team->field_team_facebook_link['und']['0']['value'])){
			$url = $sales_team->field_team_facebook_link['und']['0']['value'];
			$url = preg_replace("(^https?:?//)", "", $url);
			$agent_detail['sales_team']['facebook'] = '<span class="social" style="margin-right: 5px;"><a href="http://'.$url.'" title="Facebook"><img src="'.$base_url.'/sites/default/files/icon/facebook-32.png" width="25" height="25"></a></span>';
		}
		if(!empty($sales_team->field_team_linkedin_link['und']['0']['value'])){
			$url = $sales_team->field_team_linkedin_link['und']['0']['value'];
			$url = preg_replace("(^https?:?//)", "", $url);
			$agent_detail['sales_team']['linkedin'] = '<span class="social" style="margin-right: 5px;"><a href="http://'.$url.'" title="LinkedIn"><img src="'.$base_url.'/sites/default/files/icon/linkedin-32.png" width="25" height="25"></a></span>';
		}
		if(!empty($sales_team->field_user_pinterest['und']['0']['value'])){
			$agent_detail['sales_team']['pinterest'] = '<span class="social" style="margin-right: 5px;"><a href="'.$sales_team->field_user_pinterest['und']['0']['value'].'" title="Pinterest"><img src="'.$base_url.'/sites/default/files/icon/pinterest-32.png"></a></span>';
		}
		if(isset($primart_agent_detail->field_state_license['und']['0']['value'])) {
			$license = $primart_agent_detail->field_state_license['und']['0']['value'];
			$state_license_exp = explode('=', $license);
			$license = 'CalBRE #'.$state_license_exp[1];
			$agent_detail['sales_team']['state_license'] = $license;
		}
		else {
			$agent_detail['sales_team']['state_license'] = '';
		}
		$agent_detail['sales_team']['agent_web_site'] = isset($sales_team->field_team_website['und']['0']['url']) ? $sales_team->field_team_website['und']['0']['url'] : '';
	}
	else {
		if(isset($listing_node->field_lms_other_agent['und']['0']['uid'])) {
			$uid = $listing_node->field_lms_other_agent['und']['0']['uid'];
			$co_agent_detail = user_load($uid);
			if($order_id != NULL) {
				if($product->sku != 'LMS-04') {
					$image = array(
						'style_name' => 'square_thumbnail',
						'path' => isset($co_agent_detail->picture->uri) ? $co_agent_detail->picture->uri : 'public://images/default-image.jpg',
						'title' => $co_agent_detail->picture->filename,
						'attributes' => array('style' => array('border-radius: 50%')),
					);
					$agent_detail['co_agent']['profile_image'] = theme('image_style', $image);
				}
				else {
					//$agent_detail['co_agent']['profile_image'] = isset($co_agent_detail->picture->fid) ? file_create_url($co_agent_detail->picture->uri) : $base_url.'/sites/all/modules/custom/listing_marketing_system/images/default-image.jpg';
					
					$img_url = isset($co_agent_detail->picture->fid) ? $co_agent_detail->picture->uri : variable_get('user_picture_default');
				
				 $agent_detail['co_agent']['profile_image'] = image_style_url('listing_emal_thumbnail', $img_url);
				}
			}
			else{
				//$agent_detail['co_agent']['profile_image'] = isset($co_agent_detail->picture->fid) ? file_create_url($co_agent_detail->picture->uri) : $base_url.'/sites/all/modules/custom/listing_marketing_system/images/default-image.jpg';
				$img_url = isset($co_agent_detail->picture->fid) ? $co_agent_detail->picture->uri : variable_get('user_picture_default');
				
				 $agent_detail['co_agent']['profile_image'] = image_style_url('listing_emal_thumbnail', $img_url);
			}
			$agent_detail['co_agent']['preferred_name'] = isset($co_agent_detail->field_preferred_name['und']['0']['value']) ? $co_agent_detail->field_preferred_name['und']['0']['value'] : ucwords($co_agent_detail->name);
			$agent_detail['co_agent']['about'] = isset($co_agent_detail->field_person_about['und']['0']['value']) ? $co_agent_detail->field_person_about['und']['0']['value'] : '';
			$agent_detail['co_agent']['job_title'] = isset($co_agent_detail->field_job_title['und']['0']['value']) ? $co_agent_detail->field_job_title['und']['0']['value'] : '';		
			$agent_detail['co_agent']['phone_mobile'] = isset($co_agent_detail->field_phone_mobile['und']['0']['value']) ? $co_agent_detail->field_phone_mobile['und']['0']['value'] : '';
			$agent_detail['co_agent']['phone_direct'] = isset($co_agent_detail->field_phone_direct['und']['0']['value']) ? $co_agent_detail->field_phone_direct['und']['0']['value'] : '';
			$agent_detail['co_agent']['person_email'] = isset($co_agent_detail->field_person_email['und']['0']['value']) ? $co_agent_detail->field_person_email['und']['0']['value'] : '';
			if(!empty($co_agent_detail->field_user_twitter['und']['0']['value'])){
				$url = $co_agent_detail->field_user_twitter['und']['0']['value'];
				$url = preg_replace("(^https?:?//)", "", $url);
				$agent_detail['co_agent']['twitter'] = '<span class="social" style="margin-right: 5px;"><a href="http://'.$url.'" title="Twitter"><img src="'.$base_url.'/sites/default/files/icon/twitter-32.png" width="25" height="25"></a></span>';
			}
			if(!empty($co_agent_detail->field_user_facebook['und']['0']['value'])){
				$url = $co_agent_detail->field_user_facebook['und']['0']['value'];
				$url = preg_replace("(^https?:?//)", "", $url);
				$agent_detail['co_agent']['facebook'] = '<span class="social" style="margin-right: 5px;"><a href="http://'.$url.'" title="Facebook"><img src="'.$base_url.'/sites/default/files/icon/facebook-32.png" width="25" height="25"></a></span>';
			}
			if(!empty($co_agent_detail->field_user_linked_in['und']['0']['value'])){
				$url = $co_agent_detail->field_user_linked_in['und']['0']['value'];
				$url = preg_replace("(^https?:?//)", "", $url);
				$agent_detail['co_agent']['linkedin'] = '<span class="social" style="margin-right: 5px;"><a href="http://'.$url.'" title="LinkedIn"><img src="'.$base_url.'/sites/default/files/icon/linkedin-32.png" width="25" height="25"></a></span>';
			}
			if(!empty($co_agent_detail->field_user_pinterest['und']['0']['value'])){
				$agent_detail['co_agent']['pinterest'] = '<span class="social" style="margin-right: 5px;"><a href="'.$co_agent_detail->field_user_pinterest['und']['0']['value'].'" title="Pinterest"><img src="'.$base_url.'/sites/default/files/icon/pinterest-32.png"></a></span>';
			}
			if(isset($co_agent_detail->field_state_license['und']['0']['value'])) {
				$license = $co_agent_detail->field_state_license['und']['0']['value'];
				$state_license_exp = explode('=', $license);
				$license = 'CalBRE #'.$state_license_exp[1];
				$agent_detail['co_agent']['state_license'] = $license;
			}
			else {
				$agent_detail['co_agent']['state_license'] = '';
			}
			$agent_detail['co_agent']['agent_web_site'] = isset($co_agent_detail->field_agent_web_site['und']['0']['value']) ? $co_agent_detail->field_agent_web_site['und']['0']['value'] : '';
		}
		//$uid = $listing_node->uid;
		//$primart_agent_detail = user_load($uid);
		if($order_id != NULL) {
			if($product->sku != 'LMS-04') {
				$image = array(
					'style_name' => 'square_thumbnail',
					'path' => isset($primart_agent_detail->picture->uri)? $primart_agent_detail->picture->uri : 'public://images/default-image.jpg',
					'title' => $primart_agent_detail->picture->filename,
					'attributes' => array('style' => array('border-radius: 50%')),
				);
				$agent_detail['primary_agent']['profile_image'] = theme('image_style', $image);
			}
			else {
				//$agent_detail['primary_agent']['profile_image'] = isset($primart_agent_detail->picture->fid) ? file_create_url($primart_agent_detail->picture->uri) : $base_url.'/sites/all/modules/custom/listing_marketing_system/images/default-image.jpg';
				
				$img_url = isset($primart_agent_detail->picture->fid) ? $primart_agent_detail->picture->uri : variable_get('user_picture_default');
				
				 $agent_detail['primary_agent']['profile_image'] = image_style_url('listing_emal_thumbnail', $img_url);
			}
		}
		else{
			//$agent_detail['primary_agent']['profile_image'] = isset($primart_agent_detail->picture->fid) ? file_create_url($primart_agent_detail->picture->uri) : $base_url.'/sites/all/modules/custom/listing_marketing_system/images/default-image.jpg';
			
			$img_url = isset($primart_agent_detail->picture->fid) ? $primart_agent_detail->picture->uri : variable_get('user_picture_default');
				
				 $agent_detail['primary_agent']['profile_image'] = image_style_url('listing_emal_thumbnail', $img_url);
		}
		
		$agent_detail['primary_agent']['preferred_name'] = isset($primart_agent_detail->field_preferred_name['und']['0']['value']) ? $primart_agent_detail->field_preferred_name['und']['0']['value'] : ucwords($primart_agent_detail->name);
		$agent_detail['primary_agent']['about'] = isset($primart_agent_detail->field_person_about['und']['0']['value']) ? $primart_agent_detail->field_person_about['und']['0']['value'] : '';
		$agent_detail['primary_agent']['job_title'] = isset($primart_agent_detail->field_job_title['und']['0']['value']) ? $primart_agent_detail->field_job_title['und']['0']['value'] : '';		
		$agent_detail['primary_agent']['phone_mobile'] = isset($primart_agent_detail->field_phone_mobile['und']['0']['value']) ? $primart_agent_detail->field_phone_mobile['und']['0']['value'] : '';
		$agent_detail['primary_agent']['phone_direct'] = isset($primart_agent_detail->field_phone_direct['und']['0']['value']) ? $primart_agent_detail->field_phone_direct['und']['0']['value'] : '';
		$agent_detail['primary_agent']['person_email'] = isset($primart_agent_detail->field_person_email['und']['0']['value']) ? $primart_agent_detail->field_person_email['und']['0']['value'] : $primart_agent_detail->mail;
		if(!empty($primart_agent_detail->field_user_twitter['und']['0']['value'])){
			$url = $primart_agent_detail->field_user_twitter['und']['0']['value'];
			$url = preg_replace("(^https?:?//)", "", $url);
			$agent_detail['primary_agent']['twitter'] = '<span class="social" style="margin-right: 5px;"><a href="http://'.$url.'" title="Twitter"><img src="'.$base_url.'/sites/default/files/icon/twitter-32.png" width="25" height="25"></a></span>';
		}
		if(!empty($primart_agent_detail->field_user_facebook['und']['0']['value'])){
			$url = $primart_agent_detail->field_user_facebook['und']['0']['value'];
			$url = preg_replace("(^https?:?//)", "", $url);
			$agent_detail['primary_agent']['facebook'] = '<span class="social" style="margin-right: 5px;"><a href="http://'.$url.'" title="Facebook"><img src="'.$base_url.'/sites/default/files/icon/facebook-32.png" width="25" height="25"></a></span>';
		}
		if(!empty($primart_agent_detail->field_user_linked_in['und']['0']['value'])){
			$url = $primart_agent_detail->field_user_linked_in['und']['0']['value'];
			$url = preg_replace("(^https?:?//)", "", $url);
			$agent_detail['primary_agent']['linkedin'] = '<span class="social" style="margin-right: 5px;"><a href="http://'.$url.'" title="LinkedIn"><img src="'.$base_url.'/sites/default/files/icon/linkedin-32.png" width="25" height="25"></a></span>';
		}
		if(!empty($primart_agent_detail->field_user_pinterest['und']['0']['value'])){
			$agent_detail['primary_agent']['pinterest'] = '<span class="social" style="margin-right: 5px;"><a href="'.$primart_agent_detail->field_user_pinterest['und']['0']['value'].'" title="Pinterest"><img src="'.$base_url.'/sites/default/files/icon/pinterest-32.png"></a></span>';
		}
		if(isset($primart_agent_detail->field_state_license['und']['0']['value'])) {
			$license = $primart_agent_detail->field_state_license['und']['0']['value'];
			$state_license_exp = explode('=', $license);
			$license = 'CalBRE #'.$state_license_exp[1];
			$agent_detail['primary_agent']['state_license'] = $license;
		}
		else {
			$agent_detail['primary_agent']['state_license'] = '';
		}
		$agent_detail['primary_agent']['agent_web_site'] = isset($primart_agent_detail->field_agent_web_site['und']['0']['value']) ? $primart_agent_detail->field_agent_web_site['und']['0']['value'] : '';
	}
	if(!empty($state_license)) {
		$state_license_exp = explode('=', $state_license);
		$state_license = 'CalBRE #'.$state_license_exp[1];
	}
	//Footer disclaimer
	$property_disclaimer = module_invoke('block', 'block_view', '2');
	$disclaimer = render($property_disclaimer['content']);
	$alias = drupal_get_path_alias($path = 'node/'.$nid);
	$listing_url = url('http://www.homecb.com/'.$alias);
	if($email == NULL) {
		$unsubscribe_email = 'javascript: void(0)';
	}
	else {
		//$md5_email = md5($email);
		$unsubscribe_email = $base_url.'/listing-email-unsubscribe/'.$email;
	}
	$lms_video_nid = db_select("field_data_field_lms_listing_reference", 'lr');
	$lms_video_nid->fields('lr', array('entity_id'));
	$lms_video_nid->condition('lr.entity_type', 'node', 'LIKE');
	$lms_video_nid->condition('lr.bundle', 'lms_video', 'LIKE');
	$lms_video_nid->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$video_nid = $lms_video_nid->execute()->fetchField();
	$listing_video = node_load($video_nid);
	$youtube_url = '';
	$active_url = isset($listing_video->field_active_video['und']['0']['value']) ? $listing_video->field_active_video['und']['0']['value'] : '';
	if($active_url == 'embed') {
		$youtube_url = isset($listing_video->field_lms_embed_video['und']['0']['uri']) ? file_create_url($listing_video->field_lms_embed_video['und']['0']['uri']).'': '';
	}
	else if($active_url == 'create' || empty($active_url)) {
		$youtube_url = isset($listing_video->field_you_tube_url['und']['0']['value']) ? $listing_video->field_you_tube_url['und']['0']['value'] : '';
	}
	
	$variables = array(
		'order_id' => $order_id,
		'product_sku' => $product_sku,
		'first_image' => $first_image,
		'second_image' => $second_image,
		'third_image' => $third_image,
		'fourth_image' => $fourth_image,
		'listing_nid' => $nid,
		'listing_headline' => $listing_headline,
		'previews' => $previews,
		'listing_address' => $listing_address,
		'mc_listing_address' => $mc_listing_address,
		'bedroom_detail' => $bedroom_detail,
		'online_copy' => $online_copy,
		'price' => $price,
		'agent_email' => $agent_email,
		'agent_detail' => $agent_detail,
		'disclaimer' => $disclaimer,
		'listing_url' => $listing_url,
		'unsubscribe_email' => $unsubscribe_email,
		'youtube_url' => $youtube_url,
	);
	//$output = theme('listing_email_message', array('var_name' => $variables));
	$output = theme('listing_email_message_table', array('var_name' => $variables));
	return $output;
}


/**
 * Drupal form API
 * for listing mail functionality
 **/
function cbone_listing_email_form() {
	$nid = arg(1);
	$listing_node = node_load($nid);

	//Listing Address
	if(isset($listing_node->field_lms_hide_listing_address['und']['0']['value']) && $listing_node->field_lms_hide_listing_address['und']['0']['value'] == 1) {		
		$listing_address = t('Address Available Upon Request');
	}
	else {
		$address = array();
		if(isset($listing_node->field_lms_listing_address['und']['0']['value'])) {
			$address[] = $listing_node->field_lms_listing_address['und']['0']['value'];
		}
		if(isset($listing_node->field_lms_address_unit['und']['0']['value'])) {
			$address[] = $listing_node->field_lms_address_unit['und']['0']['value'];
		}
		if(isset($listing_node->field_lms_listing_city['und']['0']['value'])) {
			$address[] = $listing_node->field_lms_listing_city['und']['0']['value'];
		}
		$listing_address = implode(', ', $address);
	}
	$listing_alias = drupal_lookup_path('alias',"node/".$nid);
	$user_detail = array();
	if(isset($listing_node->uid)) {
		$user_detail = user_load($listing_node->uid);
	}
	$preferred_name = isset($user_detail->field_preferred_name['und']['0']['value']) ? $user_detail->field_preferred_name['und']['0']['value'] : $user_detail->name;
	$person_email = isset($user_detail->field_person_email['und']['0']['value']) ? $user_detail->field_person_email['und']['0']['value'] : $user_detail->mail;
	$phone_direct = isset($user_detail->field_phone_direct['und']['0']['value']) ? $user_detail->field_phone_direct['und']['0']['value'] : '';
	$phone_mobile = isset($user_detail->field_phone_mobile['und']['0']['value']) ? $user_detail->field_phone_mobile['und']['0']['value'] : '';
	$subject = isset($listing_node->field_lms_listing_headline['und']['0']['value']) ? $listing_node->field_lms_listing_headline['und']['0']['value'] : $listing_node->title;
	
	$form['lesson_nid'] = array(
		'#type' => 'hidden',
		'#value' => $nid,
	);
	$form['preferred_name'] = array(
		'#type' => 'hidden',
		'#value' => $preferred_name,
	);
	$form['person_email'] = array(
		'#type' => 'hidden',
		'#value' => $person_email,
	);
	$form['send_to'] = array(
		'#type' => 'textfield',
		'#title' => t('<b>Send To</b>: <span>Enter or paste email addresses separated by commas. Limit is 5 addresses per send.</span>'),
		'#size' => 90,
	);
	$form['subject'] = array(
		'#type' => 'textfield',
		'#title' => t('<b>Subject</b>:'),
		'#size' => 80,
		'#default_value' => t($subject),
	);
	$form['message'] = array(
		'#markup' => cbone_listing_email_message($nid),
	);
	$form['#validate'][] = 'cbone_listing_email_form_validate';
	$form['actions']['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Send'),
		'#prefix' => '<div class="listing-email-submit">',
		'#suffix' => '</div>',
	);
	return $form;
}
/**
 * Drupal form validate API
 * for download document
 **/
function cbone_listing_email_form_validate($form, $form_state){
	if($form_state['values']['send_to'] == '') {
		form_set_error('send_to', 'Please enter addresses.');
	}
	else {
		$send_to = $form_state['values']['send_to'];
		$send_to = str_replace(', ', ',', $send_to);
		$emails = explode(',', $send_to);
		if(count($emails) > 5) {
			form_set_error('send_to', '"Send to" exceeds 5 addresses.');
		}
		else {
			foreach($emails as $email) {
				if(!valid_email_address($email)) {
					form_set_error('send_to', 'One or more of your email addresses is malformed. Please check your entries and try again.');
				}
			}
		}
	}
}
/**
 * Drupal form submit API
 * for download document
 **/
function cbone_listing_email_form_submit($form, $form_state){
	//print "<pre>";print_r($form_state['values']);exit;
	$nid = $form_state['values']['lesson_nid'];
	$listing_node = node_load($nid);
	$send_to = $form_state['values']['send_to'];
	$send_to = str_replace(',', ', ', $send_to);
	$send_to_explode = explode(', ', $send_to);
	foreach($send_to_explode as $email) {
		$email = trim($email);
		
		$not_email = db_select("do_not_email", 'dne');
		$not_email->fields('dne', array('id'));
		$not_email->condition('dne.email', $email, '=');
		$num_of_results = $not_email->execute()->rowCount();
		if($num_of_results == 0) {
			$message = cbone_listing_email_message($nid, $email);
			$message = str_replace('[mail_subject]', $form_state['values']['subject'], $message);
			$mailto = $email;
			//$subject = isset($listing_node->field_lms_listing_headline['und']['0']['value']) ? $listing_node->field_lms_listing_headline['und']['0']['value'] : $listing_node->title;
			$subject = $form_state['values']['subject'];
			$preferred_name = $form_state['values']['preferred_name'];
			$person_email = $form_state['values']['person_email'];
			$header = "From: $preferred_name <$person_email>\r\n";
			$header .= "Reply-To: $person_email\r\n";
			$header .= "MIME-Version: 1.0\r\n";
			$header .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
			if (mail($mailto, $subject, $message, $header)) {
				drupal_set_message(t('Message successfully sent to '.$email), 'status');
			}
			else {
				drupal_set_message(t("Enable to send message try again"), 'error');
			}
		}
		else {
			drupal_set_message(t("Message not sent to $email. This address is on the \"Do Not Mail\" list"), 'status');
		}
	}	
	/*print "<pre>";print_r($send_to_explode);exit;
	$mailto = str_replace(',', ', ', $send_to);
	$subject = isset($listing_node->field_lms_listing_headline['und']['0']['value']) ? $listing_node->field_lms_listing_headline['und']['0']['value'] : $listing_node->title;
	$preferred_name = $form_state['values']['preferred_name'];
	$person_email = $form_state['values']['person_email'];
	$header = "From: do-not-reply@cbone.me $preferred_name <$person_email>\r\n";
	$header .= "Reply-To: $person_email\r\n";
	$header = "MIME-Version: 1.0\r\n";
	$header .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
	//Mail Message
	//$message = str_replace("\n", "<br/>", $form_state['values']['message']);
	$message = cbone_listing_email_message($nid);
	if (mail($mailto, $subject, $message, $header)) {
		drupal_set_message(t('Message successfully sent'), 'status');
	} else {
		drupal_set_message(t("Enable to send message try again"), 'error');
	}*/
	drupal_goto('manage-listing/'.$nid);
}
/**
 * callback function cbone_listing_email_unsubscribe()
 * to unsubscribe the listing mail
 **/
function cbone_listing_email_unsubscribe($email){
	//$mail = db_query("SELECT mail FROM users WHERE md5(mail) LIKE :mail", array('mail' => $email))->fetchField();
	db_merge('do_not_email')
		  ->key(array('email' => $email))
		  ->fields(array(
			  'unsubscribe' => 1,
			  'datestamp' => REQUEST_TIME,
		  ))
		  ->execute();
	return "You have successfully unsubscribe LMS Listing email.";
}
/**
 * Callback function cbone_web_listing_photo()
 * to displayed listing photo at web page.
 * return photos
 **/
function cbone_web_listing_photo_table($nid, $type){
  //fetch photos nid
  $lms_photo_nid = db_select("field_data_field_lms_listing_reference", 'lr');
  $lms_photo_nid->fields('lr', array('entity_id'));
  $lms_photo_nid->condition('lr.entity_type', 'node', 'LIKE');
  $lms_photo_nid->condition('lr.bundle', 'lms_photos', 'LIKE');
  $lms_photo_nid->condition('lr.field_lms_listing_reference_nid', $nid, '=');
  $photo_nid = $lms_photo_nid->execute()->fetchField();
  $photo_node = node_load($photo_nid);
  $url = '';
  $items = field_get_items('node', $photo_node, 'field_lms_listing_photos');
  if(!empty($items)) {
    if($type == 'first' && isset($items['0'])) {
      $count = cbone_web_listing_photo_exist($items['0']['value']);
      if($count) {
        $listing_photos = field_collection_field_get_entity($items['0']);
        if(isset($listing_photos->field_lms_listing_photo['und']['0']['uri'])) {
          $img_url = $listing_photos->field_lms_listing_photo['und']['0']['uri'];
          $url = image_style_url('email_template_1_image', $img_url);
        }
      }
      return $url;
    }
    else if($type == 'second' && isset($items['1'])) {
      $count = cbone_web_listing_photo_exist($items['1']['value']);
      if($count) {
        $listing_photos = field_collection_field_get_entity($items['1']);
         if(isset($listing_photos->field_lms_listing_photo['und']['0']['uri'])) {
          $img_url = $listing_photos->field_lms_listing_photo['und']['0']['uri'];
          $url = image_style_url('email_template_2__3_image', $img_url);
        }
      }
      return $url;
    }
    else if($type == 'third1' && isset($items['2'])) {
      $photos = '';
      $count = cbone_web_listing_photo_exist($items['2']['value']);
      if($count) {
        $listing_photos = field_collection_field_get_entity($items['2']);
        if(isset($listing_photos->field_lms_listing_photo['und']['0']['uri'])) {
          $img_url = $listing_photos->field_lms_listing_photo['und']['0']['uri'];
          $url = image_style_url('email_template_2__3_image', $img_url);
        }
      }
      return $url;
      //$url = file_create_url($listing_photos->field_lms_listing_photo['und']['0']['uri']);
      //return $url;
    }
	else if($type == 'third' && isset($items['2'])) {
      $count = cbone_web_listing_photo_exist($items['2']['value']);
      if($count) {
        $listing_photos = field_collection_field_get_entity($items['2']);
        if(isset($listing_photos->field_lms_listing_photo['und']['0']['uri'])) {
          $img_url = $listing_photos->field_lms_listing_photo['und']['0']['uri'];
          $url = image_style_url('email_template_2__3_image', $img_url);
        }
      }
      return $url;
    }
    else if($type == 'fourth' && isset($items['3'])) {
      $count = cbone_web_listing_photo_exist($items['3']['value']);
      if($count) {
        $listing_photos = field_collection_field_get_entity($items['3']);
         if(isset($listing_photos->field_lms_listing_photo['und']['0']['uri'])) {
          $img_url = $listing_photos->field_lms_listing_photo['und']['0']['uri'];
          $url = image_style_url('email_template_4_image', $img_url);
        }
      }
      return $url;
    }    
  }
}