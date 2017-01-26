<?php
//	print "<pre>";print_r($var_name);exit;
$property_disclaimer = module_invoke('block', 'block_view', '2');
?>
<div id="contact">
	<div class="web-listing-contact">
		<div class="listing-third-image">
			<?php print $var_name['third_image']; ?>
		</div>
		<div class="agent-detail">
			<div class="picture">
				<img src="<?php print $var_name['profile_image']; ?>"/>
			</div>
			<div class="name">
				<?php print trim($var_name['profile_name']); ?>
				<div class="border-bottom"></div>
			</div>			
			<div class="about">
				<?php print trim($var_name['profile_text']); ?>
			</div>
			<div class="Connect">
				<div>Connect With Me</div>
				<div>Comming Soon !</div>
			</div>
		</div>
		<div class="web-listing-footer">
			<div class="icon"><img src="/sites/all/modules/custom/listing_marketing_system/images/cbrb-logo-142w.jpg"/></div>
			<div class="disclaimer"><?php print render($property_disclaimer['content']); ?></div>
			<div class="subscription">Subscribe Listing Alerts<br/>Comming Soon!</div>
		</div>
	</div>
</div>
