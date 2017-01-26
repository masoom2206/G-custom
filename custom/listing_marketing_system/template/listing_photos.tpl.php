<?php
//print "<pre>";print_r($var_name);exit;
global $user;
if(user_has_role(9, $user)){
	$alisting_url = "/office-listings-agent/".$var_name['listing_uid'];
}else{
	$alisting_url = "/my-listings";
}
?>
<div class="manage-listing-back">	<a href="/manage-listing/<?php print $var_name['listing_nid']?>">		<img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png">	</a></div>
<div class="manage-listing-photos">
	<div class="listing-photos-header">
		<div class="photos-title">Listing Photos</div>
		<div class="photos-address"><?php print $var_name['listing_address']; ?> <a href="/manage-listing/<?php print $var_name['listing_nid']?>">[return to Listing Tools]</a> 
		<a href="<?php print $alisting_url; ?>" >[return to Active Listings]</a></div>
		<?php if($var_name['count'] == 0 && $var_name['import_photos_count'] >= 1) { ?>
			<div class="listing-photos-import">
				<div class="import-count">You have <num><?php print $var_name['import_photos_count']; ?></num> photos available for import</div>
				<div class="import-message">Note: Importing photos may take a few minutes to process. You only need to perform this function once.</div>
				<div class="import-button"><a id="import-listing-photos" href="#" nrt_id="<?php print $var_name['nrt_id']; ?>" listing_nid="<?php print $var_name['listing_nid']; ?>" photo_nid="<?php print $var_name['photo_nid']; ?>">Import Photos</a></div>
			</div>
		<?php } ?>
		<div class="listing-photos-count" >Upload photos by selecting the "Upload" button to the right. Once photos are uploaded, drag and drop the images in the order you would like them to appear on your single property website, flyers, etc. Select tools within the listing marketing system will allow you to modify photo order, but we recommend you organize the photos here, first, so the photos easily flow in your preferred order.<br/><br/>
<b>Marketing Concierge users:</b> Marketing Coordinators will build your marketing elements using the photos in the order you set. Please be sure the images are in your preferred order before you submit your order.</div>
		<div class="listing-photos-count"><num><?php print $var_name['count']; ?></num> photos in Archive.<?php if($var_name['count'] > 0 ) { ?> Download All: <a href="/listing-photos/download/<?php print $var_name['photo_nid']?>">Original</a> <?php } ?> <span><a href="/listing-photos/upload/<?php print $var_name['listing_nid']?>"><img src="/sites/all/modules/custom/listing_marketing_system/images/upload-arrow-white.png">Upload</a></span></div>
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
							<div class="lms-photos-delete">
								<?php
									/*$variables = array(
										'element' => array(
											'#id' => 'some-title',
											'#name' => 'masoom',
											'#attributes' => array(
												'class' => array('handle-applicant', "paid-1"),
												'sid' => 1,
												'field' => 'paid'
											),
											'#return_value' => '1255',
										)
									);
									print theme('checkbox', $variables);*/
								?>
								<input type="checkbox" class="lms-photo-delete" id="delete-photo<?php print $photos['item_id']?>" value="<?php print $photos['item_id']?>" />
								<span>SELECT</span>
							</div>
						</div>
					</div>
				</li>
			<?php
			}
		?>
		</ul>
		<div class="update-listing-order">
			<a href="#" id="update-listing-photos-order">Update Photos List</a>
			<a href="#" id="delete-selected-photos">Delete</a>
		</div>
	</div>
</div>
