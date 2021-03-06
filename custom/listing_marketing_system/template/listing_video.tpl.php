<?php
//print "<pre>";print_r($var_name);exit;
global $user;
$roles = array_map('strtolower', $user->roles);
$agent = array("Agent", "Agent - beta test");
$agent_roles_result = array_intersect($agent, $user->roles);
$array = array('fid'=>$var_name['video_data'], 'nid'=>$var_name['listing_nid'], 'video_nid'=>$var_name['video_nid']);
$video_node = node_load($var_name['video_nid']);
$status=$var_name['status'];
$youtube_url = isset($video_node->field_active_video['und']['0']['value']) ? $video_node->field_active_video['und']['0']['value'] : '';
if(user_has_role(9, $user)){
	$alisting_url = "/office-listings-agent/".$var_name['listing_uid'];
}else{
	$alisting_url = "/my-listings";
}
?>
<div class="manage-listing-back">	<a href="/manage-listing/<?php print $var_name['listing_nid']?>">		<img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png">	</a></div>
<div class="manage-listing-photos">
	<div class="listing-photos-header">
		<div class="photos-title">Listing Video</div>
		<div class="photos-address document-address"><?php print $var_name['listing_address']; ?> <a href="/manage-listing/<?php print $var_name['listing_nid']?>">[return to Listing Tools]</a> <a href="<?php print $alisting_url; ?>">[return to Active Listings]</a></div>		
	</div>
	<?php if($youtube_url != '' && $youtube_url == 'embed') {
		print '<div><input id="youtube-video-url" type="radio" name="youtube" value="embed" checked="checked" video_nid="'.$var_name['video_nid'].'"> Option 1: Embed Existing YouTube Video</div>';
		$display = 'display: block;';
	}
	else {
		print '<div><input id="youtube-video-url" type="radio" name="youtube" value="embed" video_nid="'.$var_name['video_nid'].'"> Option 1: Embed Existing YouTube Video</div>';
		$display = 'display: none;';
	} ?>
	<div class="youtube-embed-video">
		<?php
			$form = drupal_get_form('yoututbe_video_embed', $var_name['video_nid']);
			print drupal_render($form);
		?>
	</div>	
	<div style="border-bottom: 1px solid; margin: 20px 0;"></div>
	<?php if($youtube_url == '' || $youtube_url == 'create') {
		print '<div><input id="youtube-video-create" type="radio" name="youtube" value="create" checked="checked" video_nid="'.$var_name['video_nid'].'"> Option 2: Create a Video and post to YouTube</div>';
		$display = 'display: none;';
	}
	else {
		print '<div><input id="youtube-video-create" type="radio" name="youtube" value="create" video_nid="'.$var_name['video_nid'].'"> Option 2: Create a Video and post to YouTube</div>';
		$display = 'display: block;';
	} ?>
	<div class="youtube-upload-video">
		<div class="btn-group">
		  <?php 
			if(!empty($var_name['video_data'])){ ?>
				<button id="create_video_containers" data-target="create_video_container" class="btn btn-youtube" type="button">Create Video</button>
				<button id="post_video_containers" data-target="post_video_container" class="btn btn-youtube active" type="button">Post to YouTube</button>
				<button id="links_containers" data-target="links_container" class="btn btn-youtube" type="button">Links and Download</button>
			<?php }
			else{ ?>
				<button id="create_video_containers" data-target="create_video_container" class="btn btn-youtube active" type="button">Create Video</button>
				<button id="post_video_containers" data-target="post_video_container" class="btn btn-youtube" type="button" disabled>Post to YouTube</button>
				<button id="links_containers" data-target="links_container" class="btn btn-youtube" type="button" disabled>Links and Download</button>
			<?php }
		  ?>
		</div>
		
		<?php if(!empty($var_name['video_data'])) {?>
			<div id="create_video_container" class="youtube_container" style="display: none !important;">
		<?php } else {?>
			<div id="create_video_container" class="youtube_container active" style="display: block !important;">
		<?php } ?>
			<div class="youtube-settings">
				<div class="youtube-settings-title">Marketing Concierge Video Settings</div>
				<?php if($var_name['marketing_concierge'] == 1 || empty($agent_roles_result)) {?>
					<div class="background-video-music"><input type="checkbox" id="background_music"/> Background music</div>
					<ul id="listing-musics">
						<?php
							$vocabulary = taxonomy_vocabulary_machine_name_load('music');
							$terms = entity_load('taxonomy_term', FALSE, array('vid' => $vocabulary->vid));
							foreach($terms as $id => $term){
								$tid = $term->tid;
								$name = $term->name;
								$fid = $term->field_mp3_file['und']['0']['fid'];
								$mp3_url = file_create_url($term->field_mp3_file['und']['0']['uri']);
						?>
							<li class="mp3" tid="<?php print $tid; ?>" fid="<?php print $fid; ?>">
								<input type="radio" name="mp3" value="<?php print $fid; ?>"/> 
								<a href="#" url="<?php print $mp3_url; ?>" class="play">
									<img src="/sites/all/modules/custom/listing_marketing_system/images/speaker-icon-sm.png">
									<?php print $name; ?>
									<span class="playing">Playing</span>
								</a>
							</li>
						<?php
							}
						?>
					</ul>
					<div class="video-effect"><input type="checkbox" id="zoom_effect"/> Include Slide zoom effects</div>
				<?php } else {?>
					<div class="background-video-music"><input type="checkbox" id="background_music" disabled="disabled"/> Background music</div>
					<div class="video-effect"><input type="checkbox" id="zoom_effect" disabled="disabled"/> Include Slide zoom effects</div>
				<?php } ?>
			</div>
			<div class="listing-video-body">
				<div class="frame-arrangment">
					<div class="listing-frame-arrangment"><span>Frame Arrangement</span></div>
					
					<ul id="sortable1" class="connectedSortable" listing-nid="<?php print $var_name['listing_nid']?>">
						<li class="slide-photos slide-first unsortable" fid="first"><img src="<?php print $var_name['slide_first']; ?>" width="160" height="110"/></li>
						<li class="slide-photos slide-second unsortable" fid="last"><img src="<?php print $var_name['slide_second']; ?>" width="160" height="110"/></li>
					</ul>
					<div class="create-video">
						<div class="create-video-link"><a href="#" id="create-video-slide">Create Video</a></div>
						<div class="create-video-help"><a href="#" id="video-slide-help">?</a></div>
					</div>
				</div>
				<div class="listing-photo-gallery"><span>Drag or double click to select photos from the "Photo Gallery" area into the "Frame Arrangement" box above.  To change the photo order, click on photo within "Frame Arrangement" box and drag the photo to the preferred position</span></div>
				<div class="listing-photo-list">
					<ul id="sortable2" class="connectedSortable">
					<?php
						foreach($var_name['photos'] as $photos) { ?>
							<li class="slide-photos ui-state-highlight" fid="<?php print $photos['fid']?>">
								<?php print $photos['photo']; ?>
							</li>
						<?php
						}
					?>
					</ul>
				</div>
			</div>
		</div>
		<div id="post_video_container" class="youtube_container">
			<?php 
				$form = drupal_get_form('yoututbe_video_upload', $array);
				print drupal_render($form);
			?>
			<div class="note">
				Please note: Once your video is uploaded to YouTube it may take several minutes to over an hour before the Video will be available in the "Links and Download" tab. 
			</div>
		</div>
		
		<?php if(!empty($var_name['video_data'])) {?>
			<div id="links_container" class="youtube_container active">
		<?php } else {?>
			<div id="links_container" class="youtube_container">
		<?php } ?>
			<div class="listing-video-link">
				<div class="listing-video-title">Video Links</div>
				<div class="youtube-video-url">
					<div class="youtube-video-url-first">YouTube Video URL</div>
					<div class="youtube-video-url-second">
					<?php 
					print $status;
					?>
					</div>
				</div>
				<div class="video-download-link">
					<div class="video-download-link-first">Download Link</div>
					<div class="video-download-link-second">
						<?php if(!empty($var_name['video_data'])) {?>
							<a href="/listing-video/download/<?php print $var_name['video_data']?>">Click here to Download</a>
						<?php } else {?>
							Click here to Download
						<?php } ?>
					</div>
					<div class="youtube-embed-video">
					<?php
						$form = drupal_get_form('yoututbe_video_delete', $var_name['video_nid']);
						print drupal_render($form);
					?>
				</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div id="video-slide-help-list" style="display: none;">
	<span class="button b-close"><span>X</span></span>
	<?php
		$help_nid = variable_get('video_help_node_nid');
		$node_data = node_load($help_nid);
		if(empty($help_nid) || !is_object($node_data)){
			$title = "Create Video Help";
			$body = "Help message will come soon!";
		}
		else {
			$title = $node_data->title;
			$body = $node_data->body['und']['0']['value'];
		}		
	?>
	<h1><?php print $title; ?></h1>
	<div><?php print $body; ?></div>
</div>