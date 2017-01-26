<?php
global $user, $base_url;
module_load_include('inc', 'listing_marketing_system', 'includes/listing_brochures');
$template_details = template_details();
magnify_image();
$result = get_mcpdf_nid();
?>
<div class="manage-listing-back">	<a href="/manage-listing/<?php print $var_name['listing_nid']?>">		<img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png">	</a></div>
<div class="manage-listing-photos">
	<div class="listing-photos-header">
		<div class="photos-title">Listing Brochures</div>
		<div class="photos-address document-address"><?php print $var_name['listing_address']; ?> <a href="/manage-listing/<?php print $var_name['listing_nid']?>">[return to Listing Tools]</a> <a href="/my-listings">[return to Active Listings]</a></div>		
	</div>
	<div class="listing-pdf">
	
	
	
	
	<?php
	$output='';
		foreach($template_details as $value) {
			$destination = drupal_get_destination();
			$path = current_path();
			$node_load = node_load($value->nid);
			$results = listin_brochures_options($node_load->nid);

		if($node_load->field_pdf_section['und'][0]['value'] == 'post card'){
			if( !empty($node_load->field_template_thumbnail) && isset($node_load->field_template_thumbnail) ){
				$config = array(
				"style_name" => "large",
				"path" => $node_load->field_template_thumbnail['und'][0]['uri'],
				"height" => NULL,
				"width" => NULL,
				);
				$image= theme_image_style($config);
			}
			else{
				$image="no image found";
			}
			
			
		$photo_url = file_create_url($node_load->field_template_thumbnail['und'][0]['uri']);
		$output.='<div class="brochure_wrapper">
		<div class="brochure_image">';
		$output.= $image;
		$output.='</div> <!--/brochure_image-- -->
			<div class="node-title">
			<span>'.$node_load->title.'</span>
			</div>';
			
			if($results !='' && !empty($results) && node_load($results)->uid==$user->uid) {
			$output.='<div class="send-pdf">
			<a href="">
			<img src="/sites/all/modules/custom/listing_marketing_system/images/mail.png"/>
			</a>
			</div>';
			}
			
			
			$output.='<div class="design">
			<span>Design:'.$node_load->nid.'</span>
			</div>
			
			<div class="brochure_options">
			<span class="edit_brochure"><a href="'.$base_url.'/generate-pdf/'.$var_name['listing_nid'].'/'.$node_load->nid.'"><img src="/sites/all/modules/custom/listing_marketing_system/images/pencil-edit.png"/></a></span>';
		
		
		
		
				if($results !='' && !empty($results) && node_load($results)->uid==$user->uid) {
			$output.='<span class="download_brochure"><a href="'.$base_url.'/download_pdf/'.$var_name['listing_nid'].'/'.$node_load->nid.'?destination='.$path.'"><img src="/sites/all/modules/custom/listing_marketing_system/images/download-arrow.png"/></a></span>
		
			<span class="delete_brochure"><a href="/node/'.$results.'/delete"><img src="/sites/all/modules/custom/listing_marketing_system/images/trashcan.png"/></a></span>';
			}
			$output.='</div><!--/brochure_options -- -->
			
			
			<div class="magnify" id="mag_'.$node_load->nid.'" photo-url="'.$photo_url.'">
			<img src="/sites/all/modules/custom/listing_marketing_system/images/magnify.png"/>
			</div>';
			
			 $output.='<div class="magnify-image mag_'.$node_load->nid.'">
				<div class="exit-magnify-image button b-close" id="mag_'.$node_load->nid.'">CLOSE</div>
				<div class="image_container">';
				$output.= $image;
				$output.='</div><!-----/image_container--- -->
				</div><!-----/magnify-image--- -->';
			
			$output.='</div> <!--/brochure_wrapper-- -->';
		}
	}
		
			print $output;
		
	
	?>
	
	
	</div>
</div>
<div>
	<div id="image_popup">
		<span class="button b-close"><span></span></span>
		<div class="image_area"></div>
	</div>
</div>
