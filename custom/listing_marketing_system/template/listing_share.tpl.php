<?php
global $user, $base_url;
module_load_include('inc', 'listing_marketing_system', 'includes/listing_share');
if(user_has_role(9, $user)){
	$alisting_url = "/office-listings-agent/".$var_name['listing_uid'];
}else{
	$alisting_url = "/my-listings";
}
?>
<div class="manage-listing-back">	<a href="/manage-listing/<?php print $var_name['listing_nid']?>">		<img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png">	</a></div>
<div class="manage-listing-photos">
	<div class="listing-photos-header">
		<div class="photos-title">Listing Share</div>
		<div class="photos-address document-address"><?php print $var_name['listing_address']; ?> <a href="/manage-listing/<?php print $var_name['listing_nid']?>">[return to Listing Tools]</a> <a href="<?php print $alisting_url; ?>">[return to Active Listings]</a></div>		
	</div>
	<div class="listing-pdf">
	
	
	
	
	<?php
		$node_load = node_load($var_name['listing_nid']);
		
		
		$output='<div class="share_wrapper">';
		$rmform = drupal_get_form('agent_list_remove_form');
		$output.=drupal_render($rmform);
		
		$output.='</div>';
		print $output;
		
		$form = drupal_get_form('agent_field_form', $var_name['listing_nid']);
		print drupal_render($form);
				?>
	
	
	
	</div>
</div>
