<?php
global $user;
//print "<pre>";print_r($node);exit;
$menu_block = module_invoke('listing_marketing_system', 'block_view', 'web_listing_menu');
$home_block = module_invoke('listing_marketing_system', 'block_view', 'web_listing_home');
$gallery_block = module_invoke('listing_marketing_system', 'block_view', 'web_listing_gallery');
$features_block = module_invoke('listing_marketing_system', 'block_view', 'web_listing_features');
$video_block = module_invoke('listing_marketing_system', 'block_view', 'web_listing_video');
$directions_block = module_invoke('listing_marketing_system', 'block_view', 'web_listing_directions');
$contact_block = module_invoke('listing_marketing_system', 'block_view', 'web_listing_contact');
 
?>

<div id="node-<?php print $node->nid; ?>" class="<?php print $classes; ?>">
	<!--Listing Menu-->
	<?php print render($menu_block['content']); ?>
	<!--Listing First Image(Home)-->
	<?php print render($home_block['content']); ?>
	<!--Listing Gallery-->
	<?php print render($gallery_block['content']); ?>
	<!--Listing Features-->
	<?php print render($features_block['content']); ?>
	<!--Listing Video-->
	<?php print render($video_block['content']); ?>	
	<!--Listing directions-->
	<?php print render($directions_block['content']); ?>
	<!--Listing contact-->
	<?php print render($contact_block['content']); ?>
</div>



