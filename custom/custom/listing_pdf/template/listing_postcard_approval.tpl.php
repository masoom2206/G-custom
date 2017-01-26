<?php
	$listing_nid = arg(1);
?>
<div class="manage-listing-back">	
	<a href="/manage-listing/<?php print $var_name['listing_nid']; ?>"><img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png"></a>
</div>
<div class="brochures-approval-main">
	<div class="listing-photos-header">
		<div class="photos-title">Post Cards - Order <?php print $var_name['order_id']; ?></div>
		<div class="photos-address document-address"><?php print $var_name['listing_address']; ?> <a href="/manage-listing/<?php print $var_name['listing_nid']; ?>">[return to Listing Tools]</a> <a href="/my-listings">[return to Active Listings]</a></div>		
	</div>
</div>
<div class="brochures-approval-main">
	<div class="brochures-approval-header">
		<!--<div class="header-first">Post Cards</div>-->
		<div class="header-second">Select and approve one post card from the option below</div>
	</div>
	<div class="brochures-approval-body">
		<ul>
		<?php
			$x = 1;
			foreach($var_name['nids'] as $key => $nid) {
				$mcpdf_node = node_load($nid);
				if(isset($mcpdf_node->field_mc_pdf_status['und']['0']['tid'])) {
					$mc_pdf_status = taxonomy_term_load($mcpdf_node->field_mc_pdf_status['und']['0']['tid'])->name;
					if($mc_pdf_status == 'PDF Pending Agent Approval') {
						$config = array(
							"style_name" => "listing_brochures_images",
							"path" => $mcpdf_node->field_pdf_preview_image['und'][0]['uri'],
							"height" => NULL,
							"width" => NULL,
						);
						$image = theme_image_style($config);
						$pdf_url = file_create_url($mcpdf_node->field_generated_pdf['und'][0]['uri']);
						$disabled_radion = '';
						if(!isset($mcpdf_node->field_mc_pdf_view['und']['0']['value']) || $mcpdf_node->field_mc_pdf_view['und']['0']['value'] == 0){
							$disabled_radion = 'disabled=""';
						}
		?>
						<li id="<?php print $nid; ?>">
							<div class="approval-option">
								Option <?php print $x; ?> <span>(Order ID: <?php print $var_name['order_id'].'-'.$nid; ?>)</span>
							</div>
							<div class="approval-view-image">
								<div class="approval-view">
									<div class="approval-image">
										<a href="<?php print $pdf_url; ?>" id="view-brochures-pdf-<?php print $mcpdf_node->nid; ?>" mcpdf_nid="<?php print $mcpdf_node->nid; ?>" target="_blank">
											<?php print $image; ?>
										</a>
									</div>
									<div class="view-pdf"><a href="<?php print $pdf_url; ?>" id="view-brochures-pdf-<?php print $mcpdf_node->nid; ?>" mcpdf_nid="<?php print $mcpdf_node->nid; ?>" target="_blank">Click thumbnail to view PDF</a></div>
									<div class="view-pdf-note">Note: You must view the PDF before approving it.</div>
								</div>
								<div class="approval-action">
									<div><input type="radio" name="approve" class="approve-pdf-<?php print $mcpdf_node->nid; ?>" id="<?php print $mcpdf_node->nid; ?>" <?php print $disabled_radion; ?>/> Approve</div>
									<div><a href="/edit-proof/<?php print $listing_nid; ?>/<?php print $mcpdf_node->nid; ?>" class="edit-pdf"><strong>Edit</strong></a></div>
								</div>
							</div>
							<div class="marketing-coordinator-note">
								<div class="note-title">Note to marketing Coordinator</div>
								<div><textarea></textarea></div>
							</div>
						</li>
		<?php
						$x++;
					}
				}
			}
		?>
		</ul>
		<div class="brochures-approval-reject">
			<div><input type="checkbox" id="reject-proofs"/> Reject Please Send New Proofs</div>
			<div class="submit-send-for-approval">
				<a href="#" class="submit-approval-link" pdf_section="post-card" listing_nid="<?php print $listing_nid; ?>" id="submit-approval-reject-link">Submit</a>
			</div>
		</div>
	</div>
</div>
