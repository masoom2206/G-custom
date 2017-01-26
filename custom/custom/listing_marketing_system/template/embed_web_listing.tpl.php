<div id="home" class="embed-web-listing">
	<?php if (isset($var_name['data']) && count($var_name['data']) > 0) { ?>
		<div class="embed-listing-title">My Active Listings</div>
		<?php foreach($var_name['data'] as $data) { 
			$urlAlias = drupal_lookup_path('alias',"node/".$data['listing_nid']);
		?>
		<div class="lms-listing-home nid-<?php echo $data['listing_nid']; ?>">
			<div class="listing-first-image">
				<a href="/<?php print $urlAlias; ?>" target ="_blank"><?php print theme('image_style',array('style_name' => 'embed_widget_image', 'path' => $data['first_image']));  ?></a>
			</div>
			<div class="rool-detail">
				<div class="web-heading"><?php print $data['address']; ?></div>			
				<div class="bedroom-detail"><?php print $data['bedroom_detail']; ?></div>
			</div>
		</div>
	<?php } 
	}
	if (isset($var_name['closedata']) && count($var_name['closedata']) > 0) { ?>
	<div class="embed-listing-title">My Sold Listings</div>
	<?php foreach($var_name['closedata'] as $data) { 
		$urlAlias = drupal_lookup_path('alias',"node/".$data['listing_nid']);
	?>
	<div class="lms-listing-home nid-<?php echo $data['listing_nid']; ?>">
		<div class="listing-first-image">
			<a href="/<?php print $urlAlias; ?>" target ="_blank"><?php print theme('image_style',array('style_name' => 'embed_widget_image', 'path' => $data['first_image']));  ?></a>
		</div>
		<div class="rool-detail">
			<div class="web-heading"><?php print $data['address']; ?></div>			
			<div class="bedroom-detail"><?php print $data['bedroom_detail']; ?></div>
		</div>
	</div>
	<?php } 
	} 	
	if (isset($var_name['buyerlisting']) && count($var_name['buyerlisting']) > 0) { ?>
	<div class="embed-listing-title">My Buyers</div>
	<?php foreach($var_name['buyerlisting'] as $data) { 
		$urlAlias = drupal_lookup_path('alias',"node/".$data['buyer_nid']);
	?>
	<div class="lms-listing-home nid-<?php echo $data['buyer_nid']; ?>">
		<div class="listing-first-image">
			<a href="javascript:" target ="_blank"><?php print theme('image_style', array('style_name' => 'embed_widget_image', 'path' => $data['first_image'], 'getsize' => TRUE, 'attributes' => array('class' => 'thumb', 'width' => '150', 'height' => '162'))); ?></a>
		</div>
		<div class="rool-detail">
			<div class="buyer-address"><?php print $data['address'].' | Purchase Price: '. $data['price']; ?></div>
		</div>
	</div>
	<?php } 
	} ?>
</div>
