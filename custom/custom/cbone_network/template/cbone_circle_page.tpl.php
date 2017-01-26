<?php
module_load_include('inc', 'cbone_network', 'includes/create_circle');
global $base_url, $user;
$account=user_load($user->uid);
$circle_nid=$var_name['main_circle_nid'];
$circle_node=node_load($circle_nid);

if (og_is_member('node', $circle_nid, 'user', $account)) {
	$title='Post to '.$circle_node->title;
	$url= $base_url.'/node/add/circle-post';
  $post_to_circle_title= '<i class="fa fa-pencil-square-o"></i> '.l($title, $url,array('query' => drupal_get_destination()));
}
else{
	$post_to_circle_title= '';
}

$circles_nids=$var_name['circle_nid'];
foreach ($circles_nids as $value){
	$node=node_load($value);
	$nid=$node->nid;
	
	$path_alias = drupal_lookup_path('alias',"node/".$node->nid);
	$path=$base_url.'/'.$path_alias;
		
	$flag = flag_get_flag('like');
	$like_flag = flag_create_link("like", $nid);

	$count =  $flag->get_count($nid);
	//$counts = $like_flag.''.$count;
	$counts = $like_flag;
	$user_load=user_load($node->uid);
	
	$query=db_select('field_data_field_office_id', 'foid')->distinct();
		$query->innerJoin('field_data_field_member_office', 'fmo', 'foid.field_office_id_value = fmo.field_member_office_value');
		$query->fields('foid', array('entity_id', 'field_office_id_value'))
			->fields('fmo', array('entity_id', 'field_member_office_value'));
		$query->condition('fmo.entity_id', $user_load->uid, '=');
		$result= $query->execute()->fetchAll();
		if(!empty($result)){
			foreach($result as $value){
			$office_nid=$value->entity_id;			
			}
		}
		if(!empty($office_nid)){
			$office_gp=node_load($office_nid);
			$office_gp_title= $office_gp->title;
		}
		else{
			$office_gp_title= '';
		}
		
		$comments = db_query("SELECT COUNT(cid) AS count FROM {comment} WHERE nid =:nid",array(":nid"=>$nid))->fetchField();
		$inappropriate_title='Report as Inappropriate';
		$inappropriate_link= $base_url.'/send-inappropriate-mail/'.$circle_nid.'/'.$nid;
?>
	
	<div class="cbone-circle">
	
	<div class="circle-post">
		<div class="circle-name"><i class="fa fa-circle-thin"></i> <?php print l($node->title, $path); ?></div>
		<div class="circle-inappropriate"><i class="fa fa-flag-o"></i> <?php print l($inappropriate_title, $inappropriate_link,array('query' => drupal_get_destination())); ?></div>
		<div class="circle-poster">
			<div class="circle-poster-image"><?php 
		$picture='<div class="user-picture">'.theme('image_style', array('path' => !empty($user_load->picture->uri) ? $user_load->picture->uri : variable_get('user_picture_default'), 'style_name' => 'thumbnail')).'</div>';
		print $picture;
		?></div>
			<div class="circle-poster-info">
				<div class="circle-poster-name"><?php print $user_load->field_preferred_name['und'][0]['value']; ?></div>
				<div class="circle-poster-office"><i class="fa fa-map-marker"></i> <?php print $office_gp_title; ?></div>
				<div class="circle-poster-social"><a href="/contact" rel="modal-node-popup">Contact</a></div>
			</div>
		</div>
		<div class="circle-post-image"><?php 
		if(!empty($node->field_circle_image)){
			$img_path= $node->field_circle_image['und'][0]['uri'];
			print theme_image_style(array('style_name' => 'circle_page_image', 'path' => $node->field_circle_image['und'][0]['uri'], 'width'=>'', 'height'=>''));
		}
		?></div>
		<div class="circle-post-video"><?php 
			if(!empty($node->field_video)){
			$display = file_displays('video', $view_mode = 'media_youtube');
			$options = $display['media_youtube_video']['settings'];
				foreach($node->field_video['und'] as $value){
					print theme('media_youtube_video', array('uri'=>$value['uri'], 'options'=>$options));
				}	
			}
		?></div>
		<div class="circle-post-body"><?php 
		if(!empty($node->body)){
		print trim_text($node->body['und'][0]['value'], 200, $ellipses = true, $strip_html = true);
			//print $node->body['und'][0]['value'];
			print l(t('Read More'), $path);
		}
		?></div>
			<?php
			$items = field_get_items('node', $node, 'field_circle_download');
			if($items) {
				$output = '<div class="download-document_post"><h4>Download:</h4><ul>';
				foreach ($items as $delta => $item) {
					$document_post = field_collection_field_get_entity($item);
					if(isset($document_post->field_circle_document['und']['0']['fid'])) {
						$fid = $document_post->field_circle_document['und']['0']['fid'];
						if(isset($document_post->field_circle_download_title['und']['0']['value'])) {
							$output .= '<li>'.l(t($document_post->field_circle_download_title['und']['0']['value']), 'document-post/download/'.$fid).'</li>';
						}
						else {
							$output .= '<li>'.l(t($document_post->field_circle_document['und']['0']['filename']), 'document-post/download/'.$fid).'</li>';
						}
					}
				}
				$output .= '</ul></div>';
				print $output;
			}
			?>
		<div class="circle-post-like">
			<ul>
				<li class="post-like"><?php print $counts; ?></li>
				<li class="post-comment"><img src="/sites/default/files/images/icon/flag/comment-icon-sm.png"> <?php print $comments; ?> Comments</li>
			</ul>
		</div>
	</div>
	<div class="circle-post-comment"><?php print comment_display($node->nid);
	$comment_form= drupal_get_form('comment_create_form', $node->nid);
	print drupal_render($comment_form);
	?></div>
</div>
<?php } ?>