<div id="home">
	<div class="lms-listing-home <?php print $var_name['design']; ?>">
		<div class="listing-first-image">
			<?php if($var_name['design'] == 'mc_design') { ?>
			<?php print views_embed_view('listing_home_slider', $display_id = 'block', $var_name['listing_nid']); ?>
			<?php } else {?>
				<img src="<?php print $var_name['first_image']; ?>" width="950" height="450">
			<?php } ?>
		</div>
		<div class="rool-detail">
			<?php if($var_name['design'] == 'mc_design') { ?>
				<div class="web-heading"><?php print $var_name['title']; ?></div>
				<div class="bedroom-detail"><span><img src="/sites/all/modules/custom/listing_marketing_system/images/location-icon.jpg"/>&nbsp;&nbsp;<?php print $var_name['address']; ?></span><span class="bedroom"><?php print $var_name['bedroom_detail']; ?></span></div>
			<?php } else {?>
				<div class="web-heading"><?php print $var_name['title']; ?></div>
				<div class="border-web-heading">&nbsp;</div>
				<div class="bedroom-detail"><?php print $var_name['bedroom_detail']; ?></div>
			<?php } ?>
		</div>
	</div>
</div>
