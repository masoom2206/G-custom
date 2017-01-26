<?php if($var_name['design'] == 'mc_design') { ?>
	<div id="listing-video">
		<div class="web-listing-video <?php print $var_name['design']; ?>">
			<div class="video-section">
				<div class="video-image">
					<img src="<?php print $var_name['third_image']; ?>"/>
				</div>
				<div class="listing-youtube">
					<iframe width="750" height="545" src="https://www.youtube.com/embed/pPb2lIap6Es"></iframe>
				</div>
				<div class="listing-video" video-url="<?php print $var_name['video_url'];?>"><a href="#" class="video-tour"><img src="/sites/all/modules/custom/listing_marketing_system/images/video-play-mc-design.png"/></a></div>
			</div>
		</div>
	</div>
<?php } else { ?>
	<div>&nbsp;</div>
<?php } ?>
