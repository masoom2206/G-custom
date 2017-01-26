<?php
	global $user, $base_url;
	$path = current_path();
	module_load_include('inc', 'listing_pdf', 'includes/listing_brochures');
	$form = drupal_get_form('listing_marketing_system_form');
	$pdf_form=drupal_render($form);
	//text_options();
	$values = get_mcpdf_nid();
	$mcpdf_uid = node_load($values);
	drupal_add_js(drupal_get_path('module', 'listing_marketing_system') . '/js/listing-pdf.js');
	drupal_add_js(drupal_get_path('module', 'listing_marketing_system') . '/js/jquery-ui.js');
	$node_load = node_load($var_name['pdf_design_id']);
	$sides = isset($node_load->field_template_sides['und']['0']['value']) ? $node_load->field_template_sides['und']['0']['value']: '';
				
	$number_of_images = isset($node_load->field_number_of_images_on_pdf['und']['0']['value']) ? $node_load->field_number_of_images_on_pdf['und']['0']['value']: '';
	$order_val='';
	if($values !='' && !empty($values) && !empty($var_name['order_id'])) {
		$order_val = ' - Order '.$var_name['order_id'].'-'.$values;
	}
	/*code added by Harinder Singh Maan for pass photo save message on condition base on listing.js save selected photo function 05-10-2016*/
	$custom_current_pdf_nid = arg(1);
	$custom_node_load = node_load($values);
	
	$query=db_select('cbone_website_settings', 'cws')
		->fields('cws')
		->condition('nid', $custom_current_pdf_nid, '=');
		$result= $query->execute()->fetchAll();
	if(!empty($result)){
		foreach($result as $value){
			$shared_pdf_brochure = $value->shared_lisitng;
		}
	}
	
	if(isset($custom_node_load->field_shared_listing_pdf['und'][0]) && $shared_pdf_brochure == $var_name['pdf_design_id']){
		$confirmation_msg =  t('Updated successfully. Reminder: This brochure is the basis for those used by agents you`ve shared this listing with. Remember to re-generate the shared flyer(s) to reflect any changes you`re making. You can do so by choosing the "share" item from this listing`s tool grid.');
	}else{
		$confirmation_msg = t('Updated successfully.');
	}
	/*code ended 05-10-2016*/
	if(user_has_role(9, $user)){
		$alisting_url = "/office-listings-agent/".$var_name['listing_uid'];
	}else{
		$alisting_url = "/my-listings";
	}
?>

<div class="manage-listing-back" id="page_top">
	<a href="/<?php print $var_name['pdf_section']?>/<?php print $var_name['listing_nid']?>">
		<img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png">	
	</a>
</div>
<div class="manage-listing-photos">
	<div class="listing-photos-header">
		<div class="photos-title"><?php print $var_name['designs']?> - Design : <?php print $var_name['pdf_design_id'];  print $order_val; ?>
		</div>
		<div class="photos-address document-address"><?php print $var_name['listing_address']; ?> 
			<a href="/manage-listing/<?php print $var_name['listing_nid']?>">[return to Listing Tools]</a> 
			<a href="<?php print $alisting_url; ?>">[return to Active Listings]</a>
		</div>		
	</div>
	<div class="listing-pdf">
		<div class="pdf-thumbnail">
			<?php	
				$large_image_url = '';
				$uris = array();
				if($values != '') {	
					$result = get_mcpdf_nid();
					$pdf_node = node_load($result);
					if(isset($pdf_node->field_pdf_preview_image['und'])) {	
						$uri = $pdf_node->field_pdf_preview_image['und']['0']['uri'];
						$large_image_url = image_style_url('pdf_thumbnail', $uri);
						//get all the images
						foreach($pdf_node->field_pdf_preview_image['und'] as $value){
							$uris[] = $value['uri'];
						}
					}
				}
				else {
					$output='';
					if(isset($node_load->field_template_thumbnail['und'])) {	
						$uri = $node_load->field_template_thumbnail['und'][0]['uri'];
						$large_image_url = image_style_url('pdf_thumbnail', $uri);
						//get all the images
						foreach($node_load->field_template_thumbnail['und'] as $value){
							$uris[] = $value['uri'];
						}
					}
				}			
				$output='';
				$output.='<div class="pdf_design">';
				$output.= '<img src ="'.$large_image_url.'"/>';
				$output.='</div>';
				print $output;
			?>
			<div class="pdf-thumbnail_sides">
			<?php	
				if ( !empty($uris)) {
					$tempalte_thumbnail='';
					$x = 1;
					foreach($uris as $value){
							$photo_url = file_create_url($value);	
							$image_url = image_style_url('pdf_thumbnails_120h', $value);
							$tempalte_thumbnail.='<div class="pdf_design_thumbnail"><div class="pdf_design_thumbnail_image"><div class= "magnify" id="mag_'.$x.'" photo-url="'.$photo_url.'">';
							$tempalte_thumbnail.= '<img src ="'.$image_url.'"/>';
							$tempalte_thumbnail.= '</div></div>';
							$tempalte_thumbnail.='<div class="pdf_design_thumbnail_count step_text">SIDE '.$x.'<div class= "magnify" id="mag_'.$x.'" photo-url="'.$photo_url.'"><img src="/sites/all/modules/custom/listing_marketing_system/images/magnify.png"/></div></div>';
							$tempalte_thumbnail.='</div>';
							$x++;
					}
					print $tempalte_thumbnail;
				}
			?>
			</div><!-----/pdf-thumbnail_sides-- -->
		</div><!-----/pdf-thumbnail-- -->
		<div class="pdf-form-wrapper"><div class="pdf-form-heading step_text">Step 2 : Text</div><div class="pdf-form"> <?php print $pdf_form; ?> 	</div>
			
			<?php 
			if($values !='') { 
				print $pdf_download='<a href="'.$base_url.'/download_pdf/'.$var_name['listing_nid'].'/'.$node_load->nid.'?destination='.$path.'"><img src="/sites/all/modules/custom/listing_marketing_system/images/download-arrow.png"/><span> View/Download Current PDF</span></a>';
				if($node_load->field_pdf_section['und'][0]['value'] == 'print and go'){
					if( $var_name['web_page_active'] == 1){
						$brochure_disabled = '';
					}
					else{
						$brochure_disabled = 'disabled';
					}
					if( $var_name['pdf_brochures'] == $values){
						$brochure_checked = 'checked';
					}
					else{
						$brochure_checked = '';
					}
					if( $var_name['shared_pdf_brochures'] == $node_load->nid){
						$shared_check = 'checked';
					}
					else{
						$shared_check = '';
					}
					$brochure_option='<div class="online_marketing">';
					$brochure_option.= '<div class="node_property"><input id="mcpdf-nid" type="checkbox" '.$brochure_checked.' name="online_marketing" class="online_marketing_values" value ="'.$values.'" listing_nid="'.$var_name['listing_nid'].'" '.$brochure_disabled.'> Add Brochure to Single Property Website</div>';
					
					$brochure_option.= '<div class="node_shared"><input id="mcpdf-nid" type="checkbox" '.$shared_check.' name="online_marketing_shared_listing" class="online_marketing_shared_listing_values" value ="'.$node_load->nid.'" listing_nid="'.$var_name['listing_nid'].'" '.$brochure_disabled.'> Use Brochure for Shared Listing</div>';
					
					$brochure_option.='</div><!--------/online_marketing---- -->';
					print $brochure_option;
				}	
			}
			?>
			<div class="node-sides-photos">
				<span>Sides: <?php print $sides; ?></span>
				<span>  Photos: <?php print $number_of_images; ?></span>
			</div>
		</div><!-----/pdf-form-- -->
	</div><!-----/listing-pdf-- -->
	<div class="dragable_images" id="step_photos">
		<div class="image-frame-arrangment">
			<div class="listing-frame-arrangment">
				<div class="pdf-photo-heading step_text">Step 3 : Photos</div>
				<span>Drag or double click to select the photos from the "Available Photos" area into the "Selected Photos" box.  To change the photo order, click on photo within "Selected Photos" box and drag it to the preferred position</span>
			</div>
			<div class="box_title">Selected Photos</div>
			<ul id="sortable1" class="connectedSortable" mcpdf_nid="<?php print($values); ?>" nid1="<?php print(arg(1)); ?>" nid2="<?php print(arg(2)); ?>">
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
				<?php 
				if($values != '') {	?>
					<input type="submit" value="Save Selected Photos" class="update-pdf-photos-order enable" id="<?php print $number_of_images; ?>">
				<?php }
				else{ ?>
					<div class="mcpdf_create_message">Please complete "Step 1" before adding photos</div>
					<input type="submit" value="Save Selected Photos" class="update-pdf-photos-order disable" id="<?php print $number_of_images; ?>" disabled="disabled">
				<?php }
				?>
				
			</div><!-----/submit_sequence-- -->
			<!--<div class="back_step"><a href="#page_top"><i class="fa fa-arrow-up"></i> Back to Step 1</a></div> -->
		</div>
		<div class="listing-photo-gallery"><span>Available Photos</span>
			<?php 
				if($values != '') {	?>
					<ul id="sortable2" class="connectedSortable">
				<?php }
				else{ ?>
					<ul id="sortable2-disable" class="connectedSortable">
				<?php }
				?>
			
			<?php
				foreach($var_name['photos'] as $photos) { ?>
					<li class="photos-draggable" id="<?php print $photos['fid']?>" revision_id="<?php print $photos['revision_id']?>">
						<div class="photos-data">
							<div class="listing-photo"><?php print $photos['photo']; ?></div>
						</div>
					</li>
				<?php
				}
			?>
			</ul>
			<!--<div class="back_step"><a href="#page_top"><i class="fa fa-arrow-up"></i> Back to Step 1</a></div>-->
		</div>
	</div><!-----/dragable_images-- -->
</div><!-----/manage-listing-photos-- -->
<div class="confirmBox-group">
	<div id="confirmBox">
		<div class="message"></div>
		<div class="buttons">
			<span class="yes">
				<span class="long">Yes</span>
			</span>
			<span class="no">
				<span class="long">No</span>
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
<input type="text" class="confirmation-msg-text" style="display:none;" value="<?php echo $confirmation_msg; ?>"/>