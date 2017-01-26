<?php
//print "<pre>";print_r($var_name);exit;
?>
<div class="manage-listing-back">	<a href="/manage-listing/<?php print $var_name['listing_nid']?>">		<img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png">	</a></div>
<div class="manage-listing-photos">
	<div class="listing-photos-header">
		<div class="photos-title">Listing Photos</div>
		<div class="photos-address"><?php print $var_name['listing_address']; ?> <a href="/manage-listing/<?php print $var_name['listing_nid']?>">[return to Listing Tools]</a> <a href="/my-listings">[return to Active Listings]</a></div>
		<div class="listing-photos-count"><num><?php print $var_name['count']; ?></num> photos in Archive. Download All: <a href="/listing-photos/download/<?php print $var_name['photo_nid']?>">Original</a><span><a href="/listing-photos/upload/<?php print $var_name['listing_nid']?>"><img src="/sites/all/modules/custom/listing_marketing_system/images/upload-arrow-white.png">Upload</a></span></div>
	</div>
	<div class="listing-photos-body">
		<ul id="listing-photos-draggable" photo_nid="<?php print $var_name['photo_nid']?>">
		<?php
			foreach($var_name['photos'] as $photos) { ?>
				<li class="photos-draggable" id="<?php print $photos['item_id']?>" revision_id="<?php print $photos['revision_id']?>">
					<div class="photos-data">
						<div class="listing-photo"><?php print $photos['photo']; ?></div>
						<div class="photo-name"><?php print $photos['photo_name']; ?></div>
						<div class="operation-photo">
							<ul>
								<li><a href="/field-collection/field-lms-listing-photos/<?php print $photos['item_id']?>/edit?listing_nid=<?php print $var_name['listing_nid']; ?>&destination=listing-photos/<?php print $var_name['listing_nid']?>"><img src="/sites/all/modules/custom/listing_marketing_system/images/pencil-edit.png"></a></li>
								<li><a href="<?php print $photos['photo_url']; ?>" download><img src="/sites/all/modules/custom/listing_marketing_system/images/download-arrow.png"></a></li>
								<li><a href="/field-collection/field-lms-listing-photos/<?php print $photos['item_id']?>/delete?destination=listing-photos/<?php print $var_name['listing_nid']?>"><img src="/sites/all/modules/custom/listing_marketing_system/images/trashcan.png"></a></li>
							</ul>
						</div>
					</div>
				</li>
			<?php
			}
		?>
		</ul>
		<div class="update-listing-order"><a href="#" id="update-listing-photos-order">Update Photos List</a></div>
	</div>
</div>
