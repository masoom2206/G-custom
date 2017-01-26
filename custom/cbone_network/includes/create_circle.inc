<?php
/**
 * Callback function cbone_network_posts()
 * to download the PDF file
 **/
function cbone_network_posts(){
	global $user, $base_url;
	$account=user_load($user->uid);
	$node_type = array('office_post', 'company_wide_circle_article');
	//$node_type=array('circle_post', 'office_post', 'company_wide_circle_article');
	//$node_type=array('circle_post', 'office_post');
	
	//$query=db_select('node', 'n')->extend('PagerDefault');
	$query=db_select('node', 'n');
	$query->leftJoin('og_membership', 'og', 'n.nid = og.etid');
	$query->leftJoin('field_data_group_access', 'ogacc', 'og.gid = ogacc.entity_id');
	$query->fields('n', array('nid', 'title', 'type'))
			->fields('og', array('etid', 'gid'))
			->condition('n.status', 1, '=')
			->condition('n.type',$node_type, 'IN')
			->orderBy('n.created', 'DESC');
	$result = $query->execute()->fetchAll();
	
	$nids=array();
	if(!empty($result)){
		foreach($result as $value){
			if($value->type == 'office_post' || $value->type == 'circle_post' ){
				$node=node_load($value->nid);
				$circle_nid='';
				if($node->type=='circle_post' ){
					$circle_nid = isset($node->og_group_ref['und']['0']['target_id']) ? $node->og_group_ref['und']['0']['target_id'] : '';
				}
				else if($node->type=='office_post' ){
					$circle_nid = isset($node->og_group_ref1['und']['0']['target_id']) ? $node->og_group_ref1['und']['0']['target_id'] : '';
				}	
			
				$circle_node=node_load($circle_nid);
				if(!empty($circle_node->group_access)){
					if($circle_node->group_access['und']['0']['value'] == 1 && og_is_member('node', $circle_nid, 'user', $account)){
						$nids[]=$value->nid;
					}
					else if($circle_node->group_access['und']['0']['value'] == 0 || og_is_member('node', $circle_nid, 'user', $account)){
						$nids[]=$value->nid;
					}
				}
			}
			else if($value->type == 'company_wide_circle_article'){
				$nids[]=$value->nid;
			}
		}
	}
	$output='';
	if(!empty($nids)){
		$limit = 10;
		$page = pager_default_initialize(count($nids), $limit, 0);
		$offset = $limit * $page;
		
		$pager_nids = array_slice($nids, $offset, $limit);
		foreach($pager_nids as $value){
			$output.='<div class="cbone-circle"><div class="circle-post">';
			$node=node_load($value);
			
			$path_alias = drupal_lookup_path('alias',"node/".$node->nid);
			$path=$base_url.'/'.$path_alias;
			$body = isset($node->body['und']['0']['value']) ? trim_text($node->body['und'][0]['value'], 200, $ellipses = true, $strip_html = true).' '.l(t('Read More and Comment'), $path) : '';
			$download_link = '';
			$items = field_get_items('node', $node, 'field_circle_download');
			if($items) {
				$download_link = '<div class="download-document_post"><h4>Download:</h4><ul>';
				foreach ($items as $delta => $item) {
					$document_post = field_collection_field_get_entity($item);
					if(isset($document_post->field_circle_document['und']['0']['fid'])) {
						$fid = $document_post->field_circle_document['und']['0']['fid'];
						if(isset($document_post->field_circle_download_title['und']['0']['value'])) {
							$download_link .= '<li>'.l(t($document_post->field_circle_download_title['und']['0']['value']), 'document-post/download/'.$fid).'</li>';
						}
						else {
							$download_link .= '<li>'.l(t($document_post->field_circle_document['und']['0']['filename']), 'document-post/download/'.$fid).'</li>';
						}
					}
				}
				$download_link .= '</ul></div>';
			}
			
			$circle_nid='';
			if($node->type=='circle_post' ){
				$circle_nid = isset($node->og_group_ref['und']['0']['target_id']) ? $node->og_group_ref['und']['0']['target_id'] : '';
			}
			else if($node->type=='office_post' ){
				$circle_nid = isset($node->og_group_ref1['und']['0']['target_id']) ? $node->og_group_ref1['und']['0']['target_id'] : '';
			}	
			if(!empty($circle_nid)){
				$circle_node=node_load($circle_nid);
				$circle_path_alias = drupal_lookup_path('alias',"node/".$circle_nid);
				$circle_path=$base_url.'/'.$circle_path_alias;
				$circle_title= l($circle_node->title, $circle_path);
				
				$inappropriate_title='Report as Inappropriate';
				$inappropriate_link= $base_url.'/send-inappropriate-mail/'.$circle_nid.'/'.$node->nid;
				$inappropriate= '<i class="fa fa-flag-o"></i> '.l($inappropriate_title, $inappropriate_link);
			}
			else{
				$circle_nid = isset($node->field_company_circle['und']['0']['tid']) ? $node->field_company_circle['und']['0']['tid'] : '';
				$term=taxonomy_term_load($circle_nid);
				$url = drupal_lookup_path('alias', 'taxonomy/term/'.$term->tid);
				$tax_path=$base_url.'/'.$url;
				$circle_title=l($term->name, $tax_path);
				
				$inappropriate='';
			}
			$node_author=user_load($node->uid);
			$picture='<div class="user-picture">'.theme('image_style', array('path' => !empty($node_author->picture->uri) ? $node_author->picture->uri : variable_get('user_picture_default'), 'style_name' => 'thumbnail')).'</div>';
			$user_name = isset($node_author->field_preferred_name['und']['0']['value']) ? $node_author->field_preferred_name['und']['0']['value'].' ' : '';
			
			$email = isset($node_author->field_person_email['und']['0']['value']) ? '<a href="mailto:'.$node_author->field_person_email['und'][0]['value'].'">Contact</a>' : '';
			
			$office_title='';
				$query=db_select('field_data_field_office_id', 'foid')->distinct();
				$query->innerJoin('field_data_field_member_office', 'fmo', 'foid.field_office_id_value = fmo.field_member_office_value');
				$query->fields('foid', array('entity_id', 'field_office_id_value'))
					->fields('fmo', array('entity_id', 'field_member_office_value'));
				$query->condition('fmo.entity_id', $user->uid, '=');
				$result= $query->execute()->fetchAll();
				if(!empty($result)){
					foreach($result as $value){
					$office_nid=$value->entity_id;
					$office= node_load($office_nid);
					$office_title= $office->title;
					}
				}
				
			$flag = flag_get_flag('like');
			$like_flag = flag_create_link("like", $node->nid);
			$counts = $like_flag;
			
			$comments_count = db_query("SELECT COUNT(cid) AS count FROM {comment} WHERE nid =:nid",array(":nid"=>$node->nid))->fetchField();
			
			$comments=comment_display($node->nid);
			$comment_form= drupal_get_form('comment_create_form', $node->nid);
				
			$output.='<div class="circle-name">'.l($node->title, $path).'</div>
                <div class="main-circle-name"><i class="fa fa-circle-thin"></i> '.$circle_title.'</div>
                <div class="circle-inappropriate"> '.$inappropriate.' </div>
					<div class="circle-poster">
						<div class="circle-poster-image">'.$picture.'</div>
						<div class="circle-poster-info">
							<div class="circle-poster-name">'.$user_name.'</div>
							<div class="circle-poster-office"><i class="fa fa-map-marker"></i> '.$office_title.'</div>
							<div class="circle-poster-social">'.$email.'</div>
						</div>
					</div>
					<div class="circle-post-image">';
					if(!empty($node->field_circle_image)){
						foreach($node->field_circle_image['und'] as $value){
							$output.= theme_image_style(array('style_name' => 'blog_multimedia', 'path' => $value['uri'], 'width'=>'', 'height'=>''));
						}
					}
					$output.='</div><div class="circle-post-video">';
					if(!empty($node->field_video)){
					$display = file_displays('video', $view_mode = 'media_youtube');
					$options = $display['media_youtube_video']['settings'];
						foreach($node->field_video['und'] as $value){
							$output.= theme('media_youtube_video', array('uri'=>$value['uri'], 'options'=>$options));
						}	
					}
					$output.='</div>
					<div class="circle-post-body">'.$body.'</div>
					'.$download_link.'
					<div class="circle-post-like">
						<ul>
							<li class="post-like">'.$counts.'</li>
							<li class="post-comment"><img src="/sites/default/files/images/icon/flag/comment-icon-sm.png"> '.$comments_count.'</li>
						</ul>
					</div>
					<div class="circle-post-comment"> '.$comments.' '.drupal_render($comment_form).'</div>';
			$output.='</div></div>';
		}
		$output.=theme('pager');
	}
	else{
		$output.='<div class="cbone-circle"><div class="circle-post">';
		$output.='No Post has been created yet.';
		$output.='</div></div>';
	}
	return $output;
}
/**
 * Callback function circle_create()
 * to download the PDF file
 **/
function circle_create(){
	global $user, $base_url;
	$nid='';
	if( is_numeric(arg(2)) ){
		$nid= arg(2);
	}
	$circle_form=drupal_get_form('create_circle_form', $nid);
	$output= drupal_render($circle_form);
	return $output;
}

/*
		form to create a circle
*/
function create_circle_form($form, &$form_state, $nid=NULL) { 
	if(!empty($nid)){
		$node=node_load($nid);
		$nid=$node->nid;
		$title=$node->title;
		$body = isset($node->body[$node->language][0]['value']) ? $node->body[$node->language][0]['value'] .'': '';
		$banner = isset($node->field_banners[$node->language][0]['value']) ? $node->field_banners[$node->language][0]['value'] .'': '';
		$group_access =	isset($node->group_access[$node->language][0]['value']) ? $node->group_access[$node->language][0]['value'] .'': '';
		$submit_title = t("Save Changes");
	}
	else{
		$nid = '';
		$title = '';
		$body = '';
		$banner = '';
		$group_access =	'';
		$submit_title = t("I'm Ready!");
	}
	$info = field_info_field('field_banners');
	$options = $info['settings']['allowed_values'];
	$banner_options=array();
	foreach ($options as $key=>$value){
	$path= 'public://images/banner/'.$key;
	$image=theme_image_style(array('style_name' => 'medium', 'path' => $path, 'width'=>'', 'height'=>''));
		$banner_options[$key]='<div class="banners_images">'.$image.' '.$value.'</div>';
	}
	$form['wrapper'] = array(
		'#markup' => "<div class='circle_info'>Name your specialized social network and begin networking with like minded individuals across Coldwell Banker's Northern California network. Don't worry, you can change the circle name later.</div>",
	);
	$form['circle_nid'] = array(
			'#type' => 'hidden',
			'#value'=>$nid,
	);
	$form['circle_title'] = array(
		'#type' => 'textfield',
		'#title' => t('Name Your Circle'),
		'#required' => TRUE,
		'#attributes' => array('placeholder'=>'Ex. Vacation Rental Agents'),
		'#default_value'=>$title,
	
	);
	$form['description'] = array(
		'#type' => 'textarea',
		'#title' => t('Description of Your Circle'),
		'#default_value'=>$body,
	);
	$form['private'] = array(
		'#type' => 'checkbox',
		'#title' => t('Private Circle (invitation only)'),
		'#default_value'=>$group_access,
	);
	$form['banners'] = array(
		'#type' => 'radios',
		'#title' => t('Select a Banner Image'),
		'#options'=>$banner_options,
		'#default_value' => $banner,
	);
	$form['submit'] = array(
		'#type' => 'submit',
		'#value' => $submit_title,
		'#prefix'=> '<div class="circle_submit">',
		'#suffix'=> '</div>',
	);
	return $form;
}

/*Create Circle form submit handler*/
function create_circle_form_submit($form, &$form_state, $nid=NULL) { 
	$form_state['redirect'] = 'manage-circles';
	global $base_url, $user;
	$node_id=$form_state['values']['circle_nid'];
	
	if(!empty($node_id)){
	$node=node_load($node_id);
		$node->title = $form_state['values']['circle_title'];
		$node->body[$node->language][0]['value'] = $form_state['values']['description'];
		$node->body[$node->language][0]['value'] = $form_state['values']['description'];
		$node->group_access[$node->language][0]['value'] = $form_state['values']['private'];
		$node->field_banners[$node->language][0]['value']= $form_state['values']['banners'];
		node_save($node); // After this call we'll get a nid
		drupal_set_message(t('Circle "'.$form_state['values']['circle_title'].'" has been updated.'));
	}
	else{
		$node = new stdClass(); // We create a new node object
		$node->type = "circle"; // Or any other content type you want
		$node->title = $form_state['values']['circle_title'];
		$node->language = LANGUAGE_NONE; // Or any language code if Locale module is enabled. More on this below *
		node_object_prepare($node); // Set some default values.
		$node->uid = $user->uid; // Or any id you wish
		$node->body[$node->language][0]['value'] = $form_state['values']['description'];
		$node->body[$node->language][0]['summary'] = $form_state['values']['description'];
		$node->group_access[$node->language][0]['value'] = $form_state['values']['private'];
		$node->field_banners[$node->language][0]['value']= $form_state['values']['banners'];
		$node = node_submit($node); // Prepare node for a submit
		if($node){
			node_save($node); // After this call we'll get a nid
			drupal_set_message(t('Your new Circle "'.$form_state['values']['circle_title'].'" has been created.'));
		}
		else{
			drupal_set_message(t('Your new Circle "'.$form_state['values']['circle_title'].'" has not created.'));
		}
	}
}

/**
 * Callback function cbone_non_groups()
 * to display list of gps user is not assigned
 Browse Circle page
 **/

function cbone_non_groups(){
	global $user, $base_url;
	$groups=array();
	$query=db_select('node', 'n');
	$query->innerJoin('og_membership', 'og', 'n.nid= og.gid');
	$query->fields('n', array('nid'))
			->fields('og', array('gid'))
			->condition('n.type', 'office_group', '=')
			->condition('og.group_type', 'node', '=')
			->condition('og.etid', $user->uid, '=');
	$result = $query->execute()->fetchAll();
	foreach($result as $value){
		$groups[]=$value->nid;
	}
	
	$query=db_select('node', 'n')
			->fields('n', array('nid'))
			->condition('type', 'circle', '=');
	$result = $query->execute()->fetchAll();
	$nids=array();
	foreach($result as $value){
		$nids[]=$value->nid;
	}
	
	$non_groups=array();
	foreach($nids as $value ){
		if(!in_array($value, $groups)){
			$non_groups[]=$value;
		}
	}
	$non_groups_nid=array();
	$output='<div class="non-groups"><ul>';
	foreach($non_groups as $nid){
		$node_group= node_load($nid);
		
		if(isset($node_group->group_access)){
			if($node_group->group_access['und'][0]['value']==0){
				$non_groups_nid[]=$node_group->nid;
			}
		}
		else{
			$non_groups_nid[]=$node_group->nid;
		}
	} 
	$variables = array(
				'circle_nid' => $non_groups_nid,
	);
	$output = theme('browse_circle_page', array('var_name' => $variables));
	return $output;
}
/**
 * Callback function my_office()
 * to display the office of user
 **/
function my_office(){	
	global $user;
	$header = array('Office Title', '', '');
	$rows = array();
	$office_nid=array();
	$query=db_select('node', 'n');
	$query->innerJoin('og_membership', 'og', 'n.nid= og.gid');
	$query->fields('n', array('nid'))
			->fields('og', array('gid'))
			->condition('n.type', 'office_group', '=')
			->condition('og.group_type', 'node', '=')
			->condition('og.etid', $user->uid, '=');
	$result = $query->execute();
	$result_count = $query->execute()->rowCount();
	if($result_count > 0){
	$roles = array("Agent", "Agent - beta test");
		foreach($result as $value){
		
		if( array_intersect($user->roles, $roles) && $result_count==1){
			drupal_goto('/my-office/'.$value->nid);
		}
		$office_nid[]=$value->nid;		
			$node=node_load($value->nid);
			//$account = user_load($uid);
			$link= '/my-office/'.$node->nid;
			
			//if (node_access("update", $node, $user) === TRUE) {
			if(user_has_role(3, $user) || user_has_role(4, $user)) {
				$edit=l('Edit', '/node/'.$node->nid.'/edit');
				//$add = l(t('Add Office Post'), '/create/office-post/'.$node->nid);
				$add = l(t('Add Office Post'), '/node/add/office-post/'.$node->nid);
			}
			else if (node_access("update", $node, $user) === TRUE) {
				$edit='';
				$add = l(t('Add Office Post'), '/node/add/office-post/'.$node->nid);
			}
			else{
				$edit='';
				$add='';
			}
			$rows[] = array(l($node->title, $link), $edit, $add);
		}
		
	} else {
    $rows[] = array("No office found", '', '');
	}
	$output = theme('table', array('header' => $header, 'rows' => $rows, '#empty' =>t('No Office is added'),  'attributes' => array('width' => '100%')));
	return $output;
}
/**
 * Callback function my_office_details()
 * to display the primary office details of user
 **/

function my_office_details($office_nid) {
  global $user, $base_url;
	$circle_node=node_load($office_nid);
	$title='Post to '.$circle_node->title;
	$url= $base_url.'/node/add/office-post';
	$post_to_circle_title= '<div class="my_office_top_content"><i class="fa fa-pencil-square-o"></i> '.l($title, $url,array('query' => drupal_get_destination())).'</div>';
		
	$output = $post_to_circle_title;
	$query = db_select('node', 'n');
	$query->innerJoin('og_membership', 'om', 'n.nid= om.etid');
	$query->fields('n', array('nid', 'created'))
			->fields('om', array('etid', 'gid'))
			->condition('om.gid', $office_nid, '=')
			->condition('om.group_type', 'node', '=')
			->condition('om.entity_type', 'node', '=')
			->condition('n.type', 'office_post')
			->orderBy('n.created', 'DESC');
	$result = $query->execute();
	$result_count = $query->execute()->rowCount();
	if ($result_count > 0) {
		$office_post_nid=array();
		foreach ($result as $value) {
			$office_post_nid[] = $value->etid;
		}
		$variables = array(
			'office_nid' => $office_nid,
			'office_post_nid' => $office_post_nid,
		);
		$output .= theme('my_office', array('var_name' => $variables));
	}
	else{
		$output .= '<div class="cbone-circle">There are currently no posts to display in this Office Circle.</div>';
	}
	return $output;
}

/**
 * List of cirlce members
 **/
function circle_members($circle_id){
	global $user, $base_url;
	$node=node_load($circle_id);
	$output='<div class="member_circle_title"><h3>Member of '.$node->title.'</h3></div><div class="office_members">';
	$querys= db_select('og_membership', 'om');
		$querys->leftJoin('field_data_field_last_name', 'ln', 'om.etid = ln.entity_id');
		$querys->leftJoin('field_data_field_first_name', 'fn', 'om.etid = fn.entity_id');
		$querys->leftJoin('field_data_field_preferred_name', 'pn', 'om.etid = pn.entity_id');
		$querys->fields('om', array('etid'))
				->condition('om.gid', $circle_id, '=')
				->condition('om.group_type', 'node', '=')
				->condition('om.entity_type', 'user', '=')
				->orderby('ln.field_last_name_value', 'ASC')
				->orderby('fn.field_first_name_value', 'ASC')
				->orderby('pn.field_preferred_name_value', 'ASC');

	$result= $querys->execute()->fetchAll();
	
	if (!empty($result)) {
		foreach($result as $value){
		$user_load= user_load($value->etid);
		$picture=theme('image_style', array('path' => !empty($user_load->picture->uri) ? $user_load->picture->uri : variable_get('user_picture_default'), 'style_name' => 'thumbnail'));
		
			$output.='<div class="office_members_list"><a href="/member-info/'.$user_load->uid.'" rel="modal-node-popup"><div class="user_profiles">';

			$output.='<div class="user_pics">'.$picture.'</div>';
			if(!empty($user_load->field_preferred_name)){
				$output.='<div class="user_datas name">'.$user_load->field_preferred_name['und'][0]['value'].'</div>';
			}
			if(!empty($user_load->field_phone_direct)){
				$output.='<div class="user_datas phone">'.$user_load->field_phone_direct['und'][0]['value'].'</div>';
			}
			if(!empty($user_load->field_person_email)){
				$output.='<div class="user_datas email">'.$user_load->field_person_email['und'][0]['value'].'</div>';
			}
			$output.='</div></a></div>';	
		}
    }
	else{
		$output.='No user assigned to the group';
	}
	$output.= '</div>';
	return $output;
}

/**
 * List of office members
 **/
function office_members($office_nid){
	global $user, $base_url;
	$output='<div class="office_members">';
	
	$query=db_select('node', 'n');
	$query->innerJoin('og_membership', 'og', 'n.nid= og.gid');
	$query->fields('n', array('nid'))
			->fields('og', array('gid'))
			->condition('n.type', 'office_group', '=')
			->condition('og.group_type', 'node', '=')
			->condition('og.etid', $user->uid, '=');
	$result = $query->execute()->fetchAll();
	$nids=array();
	if(!empty($result)){
		foreach($result as $value){
			$nids[]=$value->nid;
		}
	}
	$user_ids=array();
	$querys= db_select('og_membership', 'om');
		$querys->leftJoin('field_data_field_last_name', 'ln', 'om.etid = ln.entity_id');
		$querys->leftJoin('field_data_field_first_name', 'fn', 'om.etid = fn.entity_id');
		$querys->leftJoin('field_data_field_preferred_name', 'pn', 'om.etid = pn.entity_id');
		$querys->fields('om', array('etid'))
				->condition('om.gid', $office_nid, '=')
				->condition('om.group_type', 'node', '=')
				->condition('om.entity_type', 'user', '=')
				->orderby('ln.field_last_name_value', 'ASC')
				->orderby('fn.field_first_name_value', 'ASC')
				->orderby('pn.field_preferred_name_value', 'ASC');
	$results= $querys->execute()->fetchAll();
	if (!empty($results)) {
		foreach($results as $values){
			$user_ids[]=$values->etid;
		}
	}
	$user_uni=array_unique($user_ids);
	if (!empty($user_ids)) {
		foreach($user_ids as $value){
		$user_load= user_load($value);
		$picture=theme('image_style', array('path' => !empty($user_load->picture->uri) ? $user_load->picture->uri : variable_get('user_picture_default'), 'style_name' => 'thumbnail'));
		
			$output.='<div class="office_members_list"><a href="/member-info/'.$user_load->uid.'" rel="modal-node-popup"><div class="user_profiles">';

			$output.='<div class="user_pics">'.$picture.'</div>';
			if(!empty($user_load->field_preferred_name)){
				$output.='<div class="user_datas name">'.$user_load->field_preferred_name['und'][0]['value'].'</div>';
			}
			if(!empty($user_load->field_phone_direct)){
				$output.='<div class="user_datas phone">'.$user_load->field_phone_direct['und'][0]['value'].'</div>';
			}
			if(!empty($user_load->field_person_email)){
				$output.='<div class="user_datas email">'.$user_load->field_person_email['und'][0]['value'].'</div>';
			}
			$output.='</div></a></div>';	
		}
    }
	else{
		$output.='No user assigned to the group';
	}
	$output.= '</div>';
	return $output;
}
///******Request sent callback*************/
function request_sent($circle_id){
	$node = node_load($circle_id);
	$output='<div class="thanks-message">You have successfully submitted your membership request for '.$node->title.'.</br> Once it is approved you will be able to access the group. </div>';
	return $output;
}

///******Request cancel callback*************/
function request_cancel($circle_id){
	$node = node_load($circle_id);
	$output='<div class="thanks-message">You have cancelled your membership request for '.$node->title.'.</br></div>';
	return $output;
}

/*
	CALLBACK FUNCTION To display COMMENT
*/
function comment_display($nid){
		$results = db_select('comment')
                  ->fields('comment', array('cid', 'name','subject', 'nid'))
                  ->condition('nid', $nid, '=')
                  ->execute()
                  ->fetchAll();
		if(!empty($results)){
			$output='<ul>';
			foreach($results as $comment) {
				$comment_data=comment_load($comment->cid);
				$user_load=user_load($comment_data->uid);
				$office_title='';
				$query=db_select('field_data_field_office_id', 'foid')->distinct();
				$query->innerJoin('field_data_field_member_office', 'fmo', 'foid.field_office_id_value = fmo.field_member_office_value');
				$query->fields('foid', array('entity_id', 'field_office_id_value'))
					->fields('fmo', array('entity_id', 'field_member_office_value'));
				$query->condition('fmo.entity_id', $user_load->uid, '=');
				$result= $query->execute()->fetchAll();
				if(!empty($result)){
					foreach($result as $value){
					$office_nid=$value->entity_id;
					$office= node_load($office_nid);
					$office_title= $office->title;
					}
				}
				$preferred_name = isset($user_load->field_preferred_name['und'][0]['value']) ? $user_load->field_preferred_name['und'][0]['value'] : $user_load->name;
				$picture='<div class="user-picture">'.theme('image_style', array('path' => !empty($user_load->picture->uri) ? $user_load->picture->uri : variable_get('user_picture_default'), 'style_name' => 'thumbnail')).'</div>';
				$output.='<li><div class="views-field views-field-nothing">        
								<span class="field-content"><div class="post-comment">
									<div class="circle-poster">
										<div class="circle-poster-image">  <div class="user-picture">'.$picture.'</div></div>
										<div class="circle-poster-info">
											<div class="circle-poster-name">'.$preferred_name.'</div>
											<div class="circle-poster-office"><i class="fa fa-map-marker"></i> '.$office_title.'</div>
											<div class="circle-poster-social"><a href="/contact" rel="modal-node-popup">Contact</a></div>
											<div class="comment-body">'.$comment_data->comment_body['und'][0]['value'].'</div>
										</div>
									</div>
								</div>
							</span></div></li>';
			}
			$output.='</ul>';
		}
		else{
			$output=t('Currently no comments added');
		}
		return $output;
}

/*
	CALLBACK FUNCTION TP CREATE COMMENT
*/
function comment_create_form($form, &$form_state, $nid){
	$form['nid'] = array(
		'#type' => 'hidden',
		'#value' => $nid,
	);
	$form['description'] = array(
		'#type' => 'textarea',
		'#title' => t('Add Comment <img src="/sites/default/files/images/icon/flag/icon-comment-small.jpg">'),
		'#rows' => 2,
		'#cols' => 60,
		'#resizable' => FALSE,
	);
	$form['submit'] = array(
		'#type' => 'submit',
		'#value' => t("Submit"),
		'#prefix'=> '<div class="comment_submit">',
		'#suffix'=> '</div>',
	);

	  return $form;
}


/*
	CALLBACK FUNCTION To submit COMMENT
*/
function comment_create_form_submit($form, &$form_state){
	global $user, $base_url;
	if($form_state['values']['description'] != ''){
		$users = user_load($user->uid);
		
		$comment_nid=$form_state['input']['nid'];
		$node=node_load($comment_nid);
		$comment_body = $form_state['values']['description'];
		
		// Let's create a managed object $comment = new stdClass(); // We create a new comment object
		$comment->nid = $comment_nid; // nid of a node you want to attach a comment to
		$comment->cid = 0; // leave it as is
		$comment->pid = 0; // parent comment id, 0 if none 
		$comment->uid = $users->uid; // user's id, who left the comment
		$comment->mail = $users->mail; // user's email
		$comment->name = $user->name; // If user is authenticated you can omit this field, it will be auto-populated, if the user is anonymous and you want to name him somehow, input his name here
		$comment->thread = '01/'; // OPTIONAL. If you need comments to be threaded you can fill this value. Otherwise omit it.
		$comment->created = time(); // OPTIONAL. You can set any time you want here. Useful for backdated comments creation.
		$comment->is_anonymous = 0; // leave it as is
		$comment->homepage = ''; // you can add homepage URL here
		$comment->status = COMMENT_PUBLISHED; // We auto-publish this comment
		$comment->language = LANGUAGE_NONE; // The same as for a node
		$comment->subject = $node->title.'-'.$user->name; 
		$comment->comment_body[$comment->language][0]['value'] = $comment_body; // Everything here is pretty much like with a node
		$comment->comment_body[$comment->language][0]['format'] = 'filtered_html'; 
		comment_submit($comment); // saving a comment
		comment_save($comment);
	}else{
		drupal_set_message(t('The Comment field can not be empty.'), 'error');
	}
}

/**
	Callback to manage circles
**/
function manage_circle(){
global $user, $base_url;
$header = array('Circle Title', '', '', '');
$rows = array();
	$query=db_select('node', 'n')
		->fields('n', array('nid'))
		->condition('uid', $user->uid, '=')
		->condition('type', 'circle', '=');
	$result= $query->execute()->fetchAll();
	
	if(!empty($result)){
	
			
			foreach($result as $value) {
				$node=node_load($value->nid);
				$user_load=user_load($node->uid);
				$rows[] = array(
                    t($node->title),
					l('Edit', $base_url.'/edit/circle/'.$node->nid),
					l('Add Circle Post', $base_url.'/node/add/circle-post/'.$node->nid),
					//l('Add People', $base_url.'/group/node/'.$node->nid.'/admin/people/add-user'),
					//l('Invite People', $base_url.'/group/node/'.$node->nid.'/admin/people/invite'),
					l('Manage Members', $base_url.'/group/node/'.$node->nid.'/admin/people'),
                );
			}
			$output=theme('table', array('header' => $header, 'rows' => $rows, '#empty' =>t('No circle is added'),  'attributes' => array('width' => '100%')));
		}
		else{
			$output=t('You have not created any circle.');
		}
		return $output;

}
/**
	Callback to manage Sales Team
**/
function manage_sales_team(){
global $user, $base_url;
$header = array('Sales Team Title', '', '');
$rows = array();
	$query=db_select('node', 'n')
		->fields('n', array('nid'))
		->condition('uid', $user->uid, '=')
		->condition('type', 'lms_sales_team', '=');
	$result= $query->execute()->fetchAll();
	if(!empty($result)){
			foreach($result as $value) {
				$node=node_load($value->nid);
				$path_alias = drupal_lookup_path('alias',"node/".$node->nid);
				$path=$base_url.'/'.$path_alias;
				$user_load=user_load($node->uid);
				$rows[] = array(
                    l($node->title, $path),
					l('Edit', $base_url.'/node/'.$node->nid.'/edit'),
					l('Manage Team', $base_url.'/group/node/'.$node->nid.'/admin/people'),
                );
			}
			$output=theme('table', array('header' => $header, 'rows' => $rows, '#empty' =>t('No sales team is added'),  'attributes' => array('width' => '100%')));
		}
		else{
			$output=t('You have not created any Sales Team.');
		}
		return $output;

}
/*****
	**** Upcoming events page function callback **********
****/
function upcoming_events(){
	date_default_timezone_set('UTC');
	$curr_month = date("F");
	
	$imgpath = "https://www.cbone.me/sites/default/files/images/calendar/".strtolower($curr_month).".jpg";
	$element = array(
	  '#tag' => 'meta', 
	  '#attributes' => array(
		'property' => 'og:image',
		'content' => $imgpath,
	  ),
	);
	
	$d = drupal_add_html_head($element, 'og_image');

	// Original image uri.
	//$path = 'sites/default/files/images/calendar/march.jpg';
	
	$path = 'public://images/calendar/'.strtolower($curr_month).'.jpg';
	// Machine-readable name of the style.
	$style = 'facebook_share';
	// URL of the image style.
	// Use this within your template file by assigning it to $vars['style_url'].
	//$image = theme_image_style(array('style_name' => 'facebook_share', 'path' => $path, 'width'=>'', 'height'=>''));
	$style_url = theme('image_style', array('style_name' => 'facebook_share', 'path' => $path));
	//print_r($style_url);
	return '';
}

/*****
	**** Create circle post page function callback **********
****/
/*
function create_circle_post($nid){
	$output='<div class="share_wrapper">';
		module_load_include('inc', 'node', 'node.pages');
		$form = node_add('circle_post');
		unset($form['additional_settings']);
		$output.=drupal_render($form);
		$output.='</div>';
		return $output;
}
*/
/*****
	**** Create office post page function callback **********
****/
/*
function create_office_post($nid){
	$output='<div class="share_wrapper">';
		module_load_include('inc', 'node', 'node.pages');
		$form = node_add('office_post');
		unset($form['additional_settings']);
		$output.=drupal_render($form);
		$output.='</div>';
		return $output;
}
*/
/****
	Callback to show user details in popup
******/
function member_info($member_id){
global $base_url;
$social_icon_path = variable_get('file_public_path', conf_path() . '/files');
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
					$output.='<div class="social"><a href="'.$user_load->field_user_facebook['und'][0]['value'].'" title="Facebook"><img src="'.$base_url.'/'.$social_icon_path.'/facebook.png"></a></div>';
				}
				if(!empty($user_load->field_user_google_plus)){
					$output.='<div class="social"><a href="'.$user_load->field_user_google_plus['und'][0]['value'].'" title="Google+"><img src="'.$base_url.'/'.$social_icon_path.'/googleplus.png"></a></div>';
				}
				if(!empty($user_load->field_user_linked_in)){
					$output.='<div class="social"><a href="'.$user_load->field_user_linked_in['und'][0]['value'].'" title="LinkedIn"><img src="'.$base_url.'/'.$social_icon_path.'/linkedin.png"></a></div>';
				}
				if(!empty($user_load->field_user_twitter)){
					$output.='<div class="social"><a href="'.$user_load->field_user_twitter['und'][0]['value'].'" title="Twitter"><img src="'.$base_url.'/'.$social_icon_path.'/twitter.png"></a></div>';
				}
				if(!empty($user_load->field_user_instagram)){
					$output.='<div class="social"><a href="'.$user_load->field_user_instagram['und'][0]['value'].'" title="Instagram"><img src="'.$base_url.'/'.$social_icon_path.'/Instagram.png"></a></div>';
				}
				if(!empty($user_load->field_user_pinterest)){
					$output.='<div class="social"><a href="'.$user_load->field_user_pinterest['und'][0]['value'].'" title="Pinterest"><img src="'.$base_url.'/'.$social_icon_path.'/pinterest.png"></a></div>';
				}
			$output.= '</div></div>';
		return $output;
}
/******
*********** Callback to show events in list mode		***********
************/
function events_list(){
drupal_add_js(drupal_get_path('module', 'cbone_network') . '/js/network.js');
$type= array('event', 'office_event');
$query = new EntityFieldQuery();
$query->entityCondition('entity_type', 'node')
	->entityCondition('bundle',$type, 'IN')
	->propertyCondition('status', 1)
	->addTag('node_access')	
	->count(); // count
$result = $query->execute();
$no_itms= $result;
$per_page=2;
if(isset($_GET['page'])){
	$current_page = $_GET['page']; 
	$start = ($current_page - 1) * $per_page;
	$end =$per_page;
}
else{
	$current_page = 1; 
	$start = 0;
	$end = $per_page;
}


$output='<div class="events_list_view">';
$query= db_select('node', 'n')
	->fields('n', array('nid', 'title'))
	->condition('type', 'event', '=')
	->orderby('created', 'DESC')
	->range($start, $end);
	
	$result= $query->execute()->fetchAll();
	if(!empty($result)){
		foreach($result as $value){
			$node= node_load($value->nid);
			$image='';
			if(!empty($node->field_event_photo)){
				$img_path= $node->field_event_photo['und'][0]['uri'];
				$image = theme_image_style(array('style_name' => 'event_list', 'path' => $img_path, 'width'=>'', 'height'=>''));
			}
			$m_date=date('M', strtotime($node->field_event_date['und'][0]['value']));
			$d_date=date('d', strtotime($node->field_event_date['und'][0]['value']));
			$output.='<div class="events_info">
			<div class="event_list_details event_date"><span class="month">'.$m_date.'</span><span class="date_space"></span><span class="day">'.$d_date.'</span></div>
			<div class="event_list_details event_photo">'.$image.'</div>
			<div class="event_list_details event_details">
				<span class="event_title">'.$node->title.'</span>
				<span  class="event_body">'.trim_text($node->body['und'][0]['value'], 200).'</span>
				<div class="event_list_details read_more_event">View Event Details >></div>
			</div>
			</div>';
		}
	}
	$output.='<div class="event_pager"> '.custom_event_pager($current_page, $no_itms, $per_page) .' </div>';
$output.='</div>';
return $output;
}

/**
***
callback to custom pager
**
**/
function custom_event_pager($current_page, $no_of_items, $limit){
	$total_no_pages= ceil($no_of_items/$limit);
	$current_page= $current_page;
	$next_page= $current_page-1;
	$pre_page= $current_page+1;
	$output='<div class="pages">';
	if( $current_page == 1 && $current_page != $total_no_pages){
		$output.= '<div class="previous"><a class="pre" id="'.$pre_page.'" href="#"> <- Previous Events </a></div>';
	}
	if( $current_page != 1 && $current_page == $total_no_pages){
		$output.= '<div class="next"><a class="nex" id="'.$next_page.'" href="#"> Next Events -> </a></div>';
	}
	$output.= '</div>';
	return $output;
}

/****
**Callback to send Inappropriate post mail***
***/
function send_inappropriate_mail($circle_nid, $circle_post_nid){
global $user, $base_url;
$user_load=user_load($user->uid);
$user_name = isset($user_load->field_preferred_name['und']['0']['value']) ? $user_load->field_preferred_name['und']['0']['value'].' ' : '';
$user_email = isset($user_load->field_person_email['und']['0']['value']) ? $user_load->field_person_email['und']['0']['value'].' ' : '';
$circle_node=node_load($circle_nid);
$circle_post_node=node_load($circle_post_nid);
$post_user=user_load($circle_post_node->uid);
$post_user_name = isset($post_user->field_preferred_name['und']['0']['value']) ? $post_user->field_preferred_name['und']['0']['value'].' ' : '';
$post_user_email = isset($post_user->field_person_email['und']['0']['value']) ? $post_user->field_person_email['und']['0']['value'].' ' : '';

	$mailto = 'Heidi.Bonnel@westrsc.com, joanna.resnik@westrsc.com, kacie.ricker@westrsc.com, wsmitchell@gmail.com, georgeaiello2@gmail.com';
	$subject = 'Inappropriate content reported';
	$header = "From: CB|One <abuse@cbone.me>\r\n";
	$header .= "Reply-To: abuse@cbone.me\r\n";
	$header .= "MIME-Version: 1.0\r\n";
	$header .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
	//Mail Message
	$message = "The following Circle post was reported to have inappropriate content:<br/>";
	$message .= '<a href="'.$base_url.'/node/'.$circle_post_nid.'">'.$base_url.'/node/'.$circle_post_nid.'</a></br></br>';
	
	$message .= "Posted by: $post_user_name | $post_user_email </br>";
	$message .= "Circle: $circle_node->title </br>";
	$message .= "Reported by: $user_name | $user_email </br>";
	
	$mail=mail($mailto, $subject, $message, $header);
	if($mail){
	 drupal_set_message(t('The selected post has been reported. Thank you!'));
	}
	else{
	 drupal_set_message(t('The selected post has not been reported. Please try in few minutes'));
	}
	$destination = $_GET['destination'];
	drupal_goto($destination);
}

/***Callback to show list of events on particular date***/
function events_list_date($date){
$main_date=date('Y-m-d', strtotime($date));
$css='.events_list_view{border: 1px solid #50ADE1;  line-height: 3em;  padding: 20px;}
	.event_title_modal a{color: #6e7378 !important; text-decoration: none;}
	.date_heading{font-size: 24px;}
	';
drupal_add_css($css, 'inline');
global $user, $base_url;
	$day=date('l', strtotime($date));
	$month=date('F d', strtotime($date));
	$final_date=$day.' | '.$month;
	$output='<div class="date_heading">'.$final_date.'</div>
	<div class="events_list_view">';
	$type= array('event', 'office_event');
	$query= db_select('node', 'n');
	$query->leftJoin('field_data_event_calendar_date', 'offevent', 'n.nid = offevent.entity_id');
	$query->fields('n', array('nid', 'title'))
			->fields('offevent', array('event_calendar_date_value', 'event_calendar_date_value2'))
			->condition('n.type', $type, 'IN')
			->orderby('offevent.event_calendar_date_value', 'ASC')
			->addTag('node_access');
	$result= $query->execute()->fetchAll();
	if(!empty($result)){
		$node_array=array();
		$output.='<ul>';
		foreach($result as $value){
			$node= node_load($value->nid);
			$path_alias = drupal_lookup_path('alias',"node/".$node->nid);
			$path=$base_url.'/'.$path_alias;
			$date1 = isset($node->event_calendar_date['und']['0']['value']) ? $node->event_calendar_date['und']['0']['value'] .'': '';
			$date2 = isset($node->event_calendar_date['und']['0']['value']) ? $node->event_calendar_date['und']['0']['value2'] .'': '';
			if(!empty($date1)){
				$parse_date1= date('Y-m-d', strtotime($value->event_calendar_date_value));
			}
			if(!empty($date2)){
				$parse_date2= date('Y-m-d', strtotime($value->event_calendar_date_value2));
			}
			if( ($parse_date1 < $main_date || $parse_date1 == $main_date) && ($parse_date2 > $main_date || $parse_date2 == $main_date ) ){
			
				$node_array[] = l($node->title, $path);
				$output.='<li><div class="events_info_modal">
					<div class="event_list_date_title_modal">
						<span class="event_title_modal">'.l($node->title, $path, array('attributes' => array('style' => ''))).'</span>
					</div>
					</div></li>';
			}
		}
		$output.='</ul>';
	}
	$output.='</div>';
	return $output;
}
