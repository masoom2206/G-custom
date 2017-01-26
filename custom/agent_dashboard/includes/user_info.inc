<?php
/**
* Callback to show user details in popup
**/

function users_info($user_id){
	global $base_url;
	$explode = explode('-', $user_id);
	$u_identity = $explode[0];
	$member_id = $explode[1];
	$fc_id = $explode[2];
	$social_icon_path = variable_get('file_public_path', conf_path() . '/files');
	if($u_identity == 'user') {
		$user_load= user_load($member_id);
		$office_gp='';
			if(!empty($user_load->field_member_office)){
				$member_offcie = $user_load->field_member_office['und'][0]['value'];
				$query=db_select('node', 'n')->distinct();
				$query->innerJoin('field_data_field_office_id', 'foid', 'n.nid = foid.entity_id');
				$query->fields('n', array('nid', 'title'))
						->condition('foid.field_office_id_value', $member_offcie, '=');
				$result= $query->execute()->fetchAll();
				if(!empty($result)){
					foreach($result as $value){
					$office_gp=$value->title;			
					}
				}
			}
			$picture=theme('image_style', array('path' => !empty($user_load->picture->uri) ? $user_load->picture->uri : variable_get('user_picture_default'), 'style_name' => 'thumbnail'));
			
					$output='<div class="member_details"><div class="user_details">';
					$output.='<div class="user_pics">'.$picture.'</div>';
					if(!empty($user_load->field_preferred_name)){
						$output.='<div class="user_popup_datas name">'.$user_load->field_preferred_name['und'][0]['value'].'</div>';
					}
					if(!empty($user_load->field_job_title)){
						$output.='<div class="user_popup_datas phone">'.$user_load->field_job_title['und'][0]['value'].'</div>';
					}
					$output.='<div class="user_popup_datas office_member">'.$office_gp.'</div>';
					if(!empty($user_load->field_person_email)){
						$output.='<div class="user_popup_datas email"><a href="mailto:'.$user_load->field_person_email['und'][0]['value'].'">'.$user_load->field_person_email['und'][0]['value'].'</a></div>';
					}
					if(!empty($user_load->field_phone_direct)){
						$output.='<div class="user_popup_datas phone">Direct: <a href="tel:'.$user_load->field_phone_direct['und'][0]['value'].'">'.$user_load->field_phone_direct['und'][0]['value'].'</a></div>';
					}
					if(!empty($user_load->field_phone_mobile)){
						$output.='<div class="user_popup_datas phone">Mobile: <a href="tel:'.$user_load->field_phone_mobile['und'][0]['value'].'">'.$user_load->field_phone_mobile['und'][0]['value'].'</a></div>';
					}
					
					if(!empty($user_load->field_user_facebook)){
						$output.='<div class="social"><a href="//'.$user_load->field_user_facebook['und'][0]['value'].'" title="Facebook" target="_blank"><img src="'.$base_url.'/'.$social_icon_path.'/facebook.png"></a></div>';
					}
					if(!empty($user_load->field_user_google_plus)){
						$output.='<div class="social"><a href="//'.$user_load->field_user_google_plus['und'][0]['value'].'" title="Google+" target="_blank"><img src="'.$base_url.'/'.$social_icon_path.'/googleplus.png"></a></div>';
					}
					if(!empty($user_load->field_user_linked_in)){
						$output.='<div class="social"><a href="//'.$user_load->field_user_linked_in['und'][0]['value'].'" title="LinkedIn" target="_blank"><img src="'.$base_url.'/'.$social_icon_path.'/linkedin.png"></a></div>';
					}
					if(!empty($user_load->field_user_twitter)){
						$output.='<div class="social"><a href="//'.$user_load->field_user_twitter['und'][0]['value'].'" title="Twitter" target="_blank"><img src="'.$base_url.'/'.$social_icon_path.'/twitter.png"></a></div>';
					}
					if(!empty($user_load->field_user_instagram)){
						$output.='<div class="social"><a href="//'.$user_load->field_user_instagram['und'][0]['value'].'" title="Instagram" target="_blank"><img src="'.$base_url.'/'.$social_icon_path.'/Instagram.png"></a></div>';
					}
					if(!empty($user_load->field_user_pinterest)){
						$output.='<div class="social"><a href="//'.$user_load->field_user_pinterest['und'][0]['value'].'" title="Pinterest" target="_blank"><img src="'.$base_url.'/'.$social_icon_path.'/pinterest.png"></a></div>';
					}
				$output.= '</div></div>';
	}
	if($u_identity == 'vendor') {
		$node_load = node_load($member_id);
		$cmpny_name = $node_load->title;
		//$field_vendor_employee = $node_load->field_vendor_employee['und'][]['value'];
		//$field_collection_item_load = field_collection_item_load($member_id);
		$field_collection_item_load = field_collection_item_load($fc_id);
		//Display vendor picture;
		$vendor_pic= theme('image_style', array('path' => !empty($field_collection_item_load->field_vendor_contact_picture['und'][0]['uri']) ? $field_collection_item_load->field_vendor_contact_picture['und'][0]['uri'] : variable_get('user_picture_default'), 'style_name' => 'thumbnail'));
		$output='<div class="member_details"><div class="user_details">';
		$output.='<div class="user_pics">'.$vendor_pic.'</div>';
		if(!empty($field_collection_item_load->field_vendor_contact_name['und'][0]['value'])){
						$output.='<div class="user_popup_datas name">'.$field_collection_item_load->field_vendor_contact_name['und'][0]['value'].'</div>';
		}
		$output.='<div class="user_popup_datas office_member">'.$cmpny_name.'</div>';
		if(!empty($field_collection_item_load->field_vendor_contact_email['und'][0]['value'])){
						$output.='<div class="user_popup_datas email"><a href="mailto:'.$field_collection_item_load->field_vendor_contact_email['und'][0]['value'].'">'.$field_collection_item_load->field_vendor_contact_email['und'][0]['value'].'</a></div>';
		}
		if(!empty($field_collection_item_load->field_vendor_contact_phone['und'][0]['value'])){
						$output.='<div class="user_popup_datas phone">Direct: <a href="tel:'.$field_collection_item_load->field_vendor_contact_phone['und'][0]['value'].'">'.$field_collection_item_load->field_vendor_contact_phone['und'][0]['value'].'</a></div>';
		}
		$output.= '</div></div>';
	}
	return $output;
}
