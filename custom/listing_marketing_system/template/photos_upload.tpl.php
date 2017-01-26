<?php
?><div class="manage-listing-back">	<a href="/listing-photos/<?php print $var_name['listing_nid']?>">		<img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png">	</a></div>
<div class="manage-listing-photos">
	<div class="listing-photos-header">
		<div class="photos-title">Listing Photos</div>
		<div class="photos-address photos-upload"><?php print $var_name['listing_address']; ?> <a href="/manage-listing/<?php print $var_name['listing_nid']?>">[return to Listing Tools]</a> <a href="/my-listings">[return to Active Listings]</a></div>
	</div>
	<div class="listing-photos-body">			<?php			$form = drupal_get_form('listing_photos_upload_form', $var_name['photo_nid']);			print drupal_render($form);		?>

	</div>
</div>
