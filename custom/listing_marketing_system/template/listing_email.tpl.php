<?php
//print "<pre>";print_r($var_name);exit;
$form = drupal_get_form('cbone_listing_email_form');
// id="listing-modal-back"
if(user_has_role(9, $user)){
	$alisting_url = "/office-listings-agent/".$var_name['listing_uid'];
}else{
	$alisting_url = "/my-listings";
}
?>
<div class="manage-listing-back"><a href="/manage-listing/<?php print $var_name['listing_nid']?>"><img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png"></a></div>
<div class="manage-listing-photos">
	<div class="listing-photos-header">
		<div class="photos-title">Listing Email</div>
		<div class="photos-address"><?php print $var_name['listing_address']; ?> <a href="/manage-listing/<?php print $var_name['listing_nid']?>">[return to Listing Tools]</a> <a href="<?php print $alisting_url; ?>">[return to Active Listings]</a></div>		
	</div>
	<div class="listing-email-body" style="width: 900px;">
		<?php print drupal_render($form); ?>
	</div>
</div>
