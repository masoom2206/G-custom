<?php
//print "<pre>";print_r($var_name);exit;
global $user;
$roles = array_map('strtolower', $user->roles);
$agent = array("Agent", "Agent - beta test");
$agent_roles_result = array_intersect($agent, $user->roles);

?>
<div class="manage-listing-back">	<a href="/manage-listing/<?php print $var_name['listing_nid']?>">		<img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png">	</a></div>
<div class="manage-listing-photos">
	<div class="listing-photos-header">
		<div class="photos-title">Listing Video</div>
		<div class="photos-address document-address"><?php print $var_name['listing_address']; ?> <a href="/manage-listing/<?php print $var_name['listing_nid']?>">[return to Listing Tools]</a> <a href="/my-listings">[return to Active Listings]</a></div>		
	</div>
	<div class="youtube-settings">
		<div class="youtube-settings-title">Settings</div>
		<div class="youtube-settings-checkbox">
			<?php if(!empty($var_name['video_data'])) {
				$form = drupal_get_form('yoututbe_video_upload', $var_name['video_data']);
				//print drupal_render($form);
			?>
				<input type="checkbox" name="youtube" value="YouTube"/> Post to YouTube channel
			<?php } else { ?>
				<input type="checkbox" name="youtube" value="YouTube" disabled="disabled"/> Post to YouTube channel
			<?php } ?>
		</div>
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
		<?php } else {?>
			<div class="background-video-music"><input type="checkbox" id="background_music" disabled="disabled"/> Background music</div>
		<?php } ?>
	</div>
	<div class="listing-video-link">
		<div class="listing-video-title">Video Links</div>
		<div class="youtube-video-url">
			<div class="youtube-video-url-first">YouTube Video URL</div>
			<div class="youtube-video-url-second">Youtube video has been not completed or posted for this listing.</div>
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
		</div>
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
		<div class="listing-photo-gallery"><span>Photo Gallery</span></div>
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