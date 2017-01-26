<?php
	//print "<pre>";print_r($var_name);exit;
	$pdf_node = array();
	$pdf_node = node_load($var_name['mcpdf_nid']);
	$template_nid = $pdf_node->field_template_reference['und']['0']['nid'];
	$template_node = node_load($template_nid);
	$pdf_section = str_replace(" ", "-", $template_node->field_pdf_section['und']['0']['value']);
	//print "<pre>";print_r($template_node);exit;
	$design_node = node_load($var_name['design_nid']);
	$number_of_images = isset($design_node->field_number_of_images_on_pdf['und']['0']['value']) ? $design_node->field_number_of_images_on_pdf['und']['0']['value']: '';
	module_load_include('inc', 'listing_pdf', 'includes/listing_brochures_approval');
	$form = drupal_get_form('pdf_edit_proof_form');
	$pdf_form = drupal_render($form);
?>
<div class="pdf-edit-proof">
	<!--<div class="edit-proof-header" style="background-image:url(/sites/all/modules/custom/listing_pdf/images/edit-your-proof.jpg); background-position:center top; background-size: 100% auto; background-repeat: no-repeat;">
		<h3 class="block-title">Edit Your Proof</h3>
	</div>-->
	<div class="header-image">
		<img style="width: 100%;" src="/sites/all/modules/custom/listing_pdf/images/edit-your-proof.jpg">
	</div>
	<ul class="tabs">
		<li class="text-tabs active">Text</li>
		<li class="photos-tabs">Photos</li>
		<li class="approve-tabs" pdf_section="<?php print $pdf_section; ?>">Approve</li>
	</ul>
	<div class="edit-proof-data" listing_nid="<?php print $var_name['listing_nid']; ?>" mcpdf_nid="<?php print $var_name['mcpdf_nid']; ?>">
		<div class="edit-proof-text">
			<div class="pdf-preview-image-thumbnail">
				<div class="pdf-preview-image">
					<?php
						$image = 'Preview Image';
						if(isset($pdf_node->field_pdf_preview_image['und']['0']['uri'])) {
							$uri = $pdf_node->field_pdf_preview_image['und']['0']['uri'];
							$config = array(
								"style_name" => "pdf_thumbnail",
								"path" => $uri,
								"height" => NULL,
								"width" => NULL,
							);
							$image = theme_image_style($config);
						}
					?>				
					<div class="pdf_design"><?php print $image; ?></div>
				</div>
				<div class="pdf-proof-thumbnail">
					<?php
						$tempalte_thumbnail='';
						$x = 1;
						foreach($pdf_node->field_pdf_preview_image['und'] as $value){
							$photo_url = file_create_url($value['uri']);
							$config = array(
								"style_name" => "pdf_thumbnail_-_120h",
								"path" => $value['uri'],
								"height" => NULL,
								"width" => NULL,
							);
							$pdf_thumbnail = theme_image_style($config);
					?>
						<div class="pdf_design_thumbnail">
							<div class="pdf_design_thumbnail_image">
								<div class= "magnify" id="mag_<?php print $pdf_node->nid; ?>" photo-url="<?php print $photo_url; ?>">
									<?php print $pdf_thumbnail; ?>
								</div>
							</div>
							<div class="pdf_design_thumbnail_count step_text">SIDE <?php print $x; ?>
								<div class= "magnify" id="mag_<?php print $pdf_node->nid; ?>" photo-url="<?php print $photo_url; ?>">
									<img src="/sites/all/modules/custom/listing_marketing_system/images/magnify.png"/>
								</div>
							</div>
						</div>
					<?php
							$x++;
						}
					?>
				</div>
			</div>
			<div class="edit-pdf-form-wrapper">
				<div class="pdf-form"> <?php print $pdf_form; ?></div>
			</div>
		</div>
		<div class="edit-proof-photos" style="display: none;">
			<div class="dragable_images" id="step_photos">
				<div class="image-frame-arrangment">
					<div class="listing-frame-arrangment">
						<span>Drag Photos from the "Available Photos" area into the "Selected Photos" box below</span>
					</div>
					<div class="box_title">Selected Photos</div>
						<ul id="sortable1" class="connectedSortable" mcpdf_nid="<?php print $var_name['mcpdf_nid']; ?>" nid1="<?php print $var_name['listing_nid']; ?>" nid2="<?php print $var_name['design_nid']; ?>">
						<?php
							if(!empty($var_name['selected_photos'])){
								foreach($var_name['selected_photos'] as $selected_photos) { ?>
									<li class="photos-draggable" id="<?php print $selected_photos['fid']?>" revision_id="<?php print $selected_photos['revision_id']?>">
										<div class="photos-data">
											<div class="listing-photo"><?php print $selected_photos['photo']; ?></div>
										</div>
									</li>
									<?php
								}
							}
						?>
						</ul>
					<div class="submit_sequence">
						<input type="submit" value="Save Selected Photos" class="update-pdf-photos-order enable" id="<?php print $number_of_images; ?>">
					</div>
				</div>
				<div class="listing-photo-galleries"><span>Available Photos</span>
					<ul id="sortable2" class="connectedSortable">
						<?php
						foreach($var_name['photos'] as $photos) { ?>
							<li class="photos-draggable" id="<?php print $photos['fid']?>" revision_id="<?php print $photos['revision_id']?>">
								<div class="photos-data">
									<div class="listing-photo"><?php print $photos['photo']; ?></div>
								</div>
							</li>
						<?php } ?>
					</ul>				
				</div>
			</div>		
		</div>
		<div class="edit-proof-approve" style="display: none;">AAA</div>	
	</div>
</div>
<div class="confirmBox-group">
	<div id="confirmBox">
		<div class="message"></div>
		<div class="buttons">
			<span class="yes">
				<span class="long">Proceed without saving changes</span>
				<span class="short">Proceed</span>
			</span>
			<span class="no">
				<span class="long">Cancel and return</span>
				<span class="short">Cancel</span>
			</span>
		</div>
	</div>
</div>
<div>
	<div id="image_popup">
		<span class="button b-close"><span></span></span>
		<div class="image_area"></div>
	</div>
</div> 