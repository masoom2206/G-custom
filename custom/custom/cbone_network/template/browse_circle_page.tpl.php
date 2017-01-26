<?php
module_load_include('inc', 'cbone_network', 'includes/create_circle');
global $base_url;
$circles_nids=$var_name['circle_nid'];
if(!empty($circles_nids)){
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
	$user=user_load($node->uid);
	
	$query=db_select('field_data_field_office_id', 'foid')->distinct();
		$query->innerJoin('field_data_field_member_office', 'fmo', 'foid.field_office_id_value = fmo.field_member_office_value');
		$query->fields('foid', array('entity_id', 'field_office_id_value'))
			->fields('fmo', array('entity_id', 'field_member_office_value'));
		$query->condition('fmo.entity_id', $user->uid, '=');
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
		
?>
	
	<div class="cbone-circle">
	<div class="circle-post">
		<div class="circle-name"><i class="fa fa-circle-thin"></i>  <?php print l($node->title, $path); ?></div>
		<div class="membership_request"><a href="/group/node/<?php echo $node->nid; ?>/subscribe/og_user_node?destination=request-sent/<?php echo $node->nid; ?>&width=600&height=600" rel="modal-node-popup"> Request for Membership</a>
		</div>
		<div class="circle-poster">
			<div class="circle-poster-image"><?php 
		$picture='<div class="user-picture">'.theme('image_style', array('path' => !empty($user->picture->uri) ? $user->picture->uri : variable_get('user_picture_default'), 'style_name' => 'thumbnail')).'</div>';
		print $picture;
		?></div>
			<div class="circle-poster-info">
				<div class="circle-poster-name"><?php print $user->field_preferred_name['und'][0]['value']; ?></div>
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
			print $node->body['und'][0]['value'];
		}
		?></div>
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
<?php } 
}
else{ ?>
	<div class="cbone-circle">You are already members of each Circle group.</div>
<?php }
?>