<?php
	global $base_url, $user;
	$office_nid = $var_name['office_nid'];
	$office_node = node_load($office_nid);
	$office_gp_title = $office_node->title;
	$office_post_nid = $var_name['office_post_nid'];
	foreach($office_post_nid as $values){	
		$node = node_load($values);
		$nid = $node->nid;
		$path_alias = drupal_lookup_path('alias',"node/".$node->nid);
		$like_flag = flag_create_link("like", $nid);
		$member = user_load($node->uid);
		$comments = db_query("SELECT COUNT(cid) AS count FROM {comment} WHERE nid =:nid",array(":nid"=>$nid))->fetchField();
?>
		<div class="cbone-circle">
			<div class="circle-post">
			<div class="circle-name"> <?php print l($node->title, $path_alias); ?></div>
			<div class="circle-poster">
				<div class="circle-poster-image"><?php 
			$picture='<div class="user-picture">'.theme('image_style', array('path' => !empty($member->picture->uri) ? $member->picture->uri : variable_get('user_picture_default'), 'style_name' => 'thumbnail')).'</div>';
			print $picture;
			?></div>
				<div class="circle-poster-info">
					<div class="circle-poster-name"><?php print $member->field_preferred_name['und'][0]['value']; ?></div>
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
			<div class="circle-post-body"><?php 
			if(!empty($node->body)){
				print $node->body['und'][0]['value'];
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
					<li class="post-like"><?php print $like_flag; ?> </li>
					<li class="post-comment"><img src="/sites/default/files/images/icon/flag/comment-icon-sm.png"> <?php print $comments; ?> Comments</li>
				</ul>
			</div>
			<div class="circle-post-comment"><?php 
				print comment_display($node->nid);
				$comment_form= drupal_get_form('comment_create_form', $node->nid);
				print drupal_render($comment_form);?>
			</div>
		</div>
<?php } ?>