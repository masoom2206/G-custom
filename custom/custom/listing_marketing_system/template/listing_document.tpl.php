<?php
//print "<pre>";print_r($var_name);exit;
?>
<div class="manage-listing-back">	<a href="/manage-listing/<?php print $var_name['listing_nid']?>">		<img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png">	</a></div>
<div class="manage-listing-photos">
	<div class="listing-photos-header">
		<div class="photos-title">Listing Documents</div>
		<div class="photos-address document-address"><?php print $var_name['listing_address']; ?> <a href="/manage-listing/<?php print $var_name['listing_nid']?>">[return to Listing Tools]</a> <a href="/my-listings">[return to Active Listings]</a></div>
		<div class="listing-photos-count upload-document"><span><a href="/listing-document/report/<?php print $var_name['listing_nid']?>"><img src="/sites/all/modules/custom/listing_marketing_system/images/report-icon.png"/>Report</a></span>&nbsp;<span><a href="/listing-document/upload/<?php print $var_name['listing_nid']?>"><img src="/sites/all/modules/custom/listing_marketing_system/images/upload-arrow-white.png">Upload</a></span></div>
	</div>
	<div class="listing-document-body">
		<ul id="listing-document" document_nid="<?php print $var_name['document_nid']?>">
		<?php
			foreach($var_name['document'] as $document) { 
				$document_photo = isset($document['photo']) ? $document['photo'] : '';
				$document_document_pages = isset($document['photo']) ? $document['document_pages'] : 0;
				$document_pdf_fid = isset($document['pdf_fid']) ? $document['pdf_fid'] : '';
				$document_document_name = isset($document['document_name']) ? $document['document_name'] : '';
				if(strlen($document_document_name)> 30 ) {
					$document_document_name = substr($document_document_name, 0,30).'...';
				}
				$document_type = taxonomy_term_load($document['document_type']);				
			?>
				<li class="document-draggable" id="<?php print $document['item_id']?>" revision_id="<?php print $document['revision_id']?>">
					<div class="document-data">
						<div class="listing-document"><img src="<?php print $document_photo; ?>" /></div>
						<div class="document-name">File: <?php print $document_document_name; ?></div>
						<div class="document-name">Upload Date: <?php print $document['document_date']; ?></div>
						<div class="document-name">Pages: <?php print $document_document_pages; ?></div>
						<div class="document-name">Type: <?php print $document_type->name; ?></div>
						<div class="operation-document">
							<ul>
								<li><a href="/field-collection/field-lms-listing-documents/<?php print $document['item_id']?>/edit?listing_nid=<?php print $var_name['listing_nid']; ?>&destination=listing-document/<?php print $var_name['listing_nid']?>"><img src="/sites/all/modules/custom/listing_marketing_system/images/pencil-edit.png"></a></li>
								<li><a href="/listing-pdf/download/<?php print $document_pdf_fid; ?>" target="_blank"><img src="/sites/all/modules/custom/listing_marketing_system/images/download-arrow.png"></a></li>
								<li><a href="/field-collection/field-lms-listing-documents/<?php print $document['item_id']?>/delete?destination=listing-document/<?php print $var_name['listing_nid']?>"><img src="/sites/all/modules/custom/listing_marketing_system/images/trashcan.png"></a></li>
							</ul>
						</div>
					</div>
				</li>
			<?php
			}
		?>
		</ul>
		<div class="update-listing-order"><a href="#" id="update-listing-document-order">Update Documents List</a></div>
	</div>
</div>
