<?php
global $user, $base_url;
module_load_include('inc', 'listing_marketing_system', 'includes/listing_share');
?>
<div class="manage-listing-back">	<a href="/manage-listing/<?php print $var_name['listing_nid']?>">		<img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png">	</a></div>
<div class="manage-listing-photos">
	<div class="listing-photos-header">
		<div class="photos-title">Listing Add To Circle</div>
		<div class="photos-address document-address"><?php print $var_name['listing_address']; ?> <a href="/manage-listing/<?php print $var_name['listing_nid']?>">[return to Listing Tools]</a> <a href="/my-listings">[return to Active Listings]</a></div>		
	</div>
	<div class="listing-pdf">
	<?php
		$node_load = node_load($var_name['listing_nid']);
		$output='<div class="share_wrapper">';
		module_load_include('inc', 'node', 'node.pages');
		$form = node_add('circle_post');
		unset($form['additional_settings']);
		$output.=drupal_render($form);
		$output.='</div>';
		print $output;
	?>	
	</div>
</div>
