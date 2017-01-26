<div id="features">
	<div class="web-listing-feature <?php print $var_name['design']; ?>">
	<?php if($var_name['design'] == 'mc_design') { ?>
		<div class="feature-first">
			<div class="feature-title" style="background: url(<?php print $var_name['second_image']; ?>) no-repeat; background-size: cover;">Features</div>
			<div class="mc-design-bottom">
				<div class="feature-online-copy"><?php print $var_name['feature_content']; ?></div>
				<div class="download-listing-document">
					<div><a href="/listing-document/download/<?php print $var_name['listing_nid']; ?>" id="download-document"><img src="/sites/all/modules/custom/listing_marketing_system/images/document.jpg"/></a></div>
					<div class="download">Download</div>
					<div class="download">Listing Documents and Floor Plans</div>
				</div>
			</div>
		</div>
	<?php } else { ?>
		<div class="feature-first">
			<div class="feature-title">Features</div>
			<div class="feature-online-copy"><?php print $var_name['feature_content']; ?></div>
			<?php if($var_name['youtube_url'] != '') { ?>
				<div class="listing-youtube">
					<iframe width="750" height="545" src="https://www.youtube.com/embed/pPb2lIap6Es"></iframe>
				</div>
				<div class="listing-video" video-url="<?php print $var_name['video_url'];?>"><a href="#" class="video-tour"><img src="/sites/all/modules/custom/listing_marketing_system/images/YouTube-Play.jpg"/></a></div>
			<?php } ?>

			<div class="download-listing-document">
				<div><a href="/listing-document/download/<?php print $var_name['listing_nid']; ?>" id="download-document"><img src="/sites/all/modules/custom/listing_marketing_system/images/document.jpg"/></a></div>
				<div class="download">Download</div>
				<div class="download">Listing Documents and Floor Plans</div>
			</div>
		</div>
		<div class="feature-second">
			<?php print $var_name['second_image']; ?>
		</div>
	<?php } ?>
	</div>
</div>
