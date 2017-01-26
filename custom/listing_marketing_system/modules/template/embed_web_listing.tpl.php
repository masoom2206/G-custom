<?php
	//print "<pre>";print_r($var_name);exit;
?>
<div id="home" class="embed-web-listing">
	<div class="embed-listing-title">My Active Listings</div>
	<?php foreach($var_name['data'] as $data) { 
		$urlAlias = drupal_lookup_path('alias',"node/".$data['listing_nid']);
	?>
	<div class="lms-listing-home">
		<div class="listing-first-image">
			<a href="/<?php print $urlAlias; ?>" target ="_blank"><img src="<?php print $data['first_image']; ?>" width="950" height="450"></a>
		</div>
		<div class="rool-detail">
			<div class="web-heading"><?php print $data['address']; ?></div>			
			<div class="bedroom-detail"><?php print $data['bedroom_detail']; ?></div>
		</div>
	</div>
	<?php } ?>
</div>
