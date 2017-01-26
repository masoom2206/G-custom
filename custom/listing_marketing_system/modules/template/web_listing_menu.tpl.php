<?php
	//print "<pre>";print_r($var_name);exit;
?>
<div class="lms-listing-menu <?php print $var_name['design']; ?>">
	<ul class="listing-menu">
		<ul class="listing-menu1">
		<li>
			<?php if($var_name['previews'] == 1) {?>
				<img src="/sites/all/modules/custom/listing_marketing_system/images/webpage-logo-cb-previews.png" width="167" height="60"/>
			<?php } else {?>
				<img src="/sites/all/modules/custom/listing_marketing_system/images/webpage-logo-cb.png" width="102" height="60"/>
			<?php } ?>
		</li>
		<li>
			<a href="#"><?php print $var_name['address']; ?></a>&nbsp;&nbsp;
			<?php if($var_name['audio_fid'] != 0){
				$file = file_load($var_name['audio_fid']);
				$mp3_url = file_create_url($file->uri);
			?>
				<a href="#" url="<?php print $mp3_url; ?>" class="play listing-audio-play"><img src="/sites/all/modules/custom/listing_marketing_system/images/speaker-icon-sm.png"></a>
			<?php } ?>			
		</li>
		</ul>
		<ul class="listing-menu2">
		<li><a href="#home">Home</a></li>
		<li><a href="#gallery">Gallery</a></li>
		<li><a href="#features">Features</a></li>
		<?php if($var_name['design'] == 'mc_design') { ?>
			<li><a href="#listing-video">Video</a></li>
		<?php } ?>
		<li><a href="#directions">Directions</a></li>
		<li><a href="#contact">Contact</a></li>
		</ul>
	</ul>
</div>
