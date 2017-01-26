<?php
global $user, $base_url;
module_load_include('inc', 'listing_marketing_system', 'includes/listing_brochures');
$form = drupal_get_form('listing_marketing_system_form');
$pdf_form=drupal_render($form);
text_options();
$values = get_mcpdf_nid();
$mcpdf_uid = node_load($values);
drupal_add_js(drupal_get_path('module', 'listing_marketing_system') . '/js/listing-pdf.js');
drupal_add_js(drupal_get_path('module', 'listing_marketing_system') . '/js/jquery-ui.js');

?>
<div class="manage-listing-back">	<a href="/listing-brochures/<?php print $var_name['listing_nid']?>">		<img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png">	</a></div>
<div class="manage-listing-photos">
	<div class="listing-photos-header">
		<div class="photos-title">Listing PDF</div>
		<div class="photos-address document-address"><?php print $var_name['listing_address']; ?> <a href="/manage-listing/<?php print $var_name['listing_nid']?>">[return to Listing Tools]</a> <a href="/my-listings">[return to Active Listings]</a></div>		
	</div>
	<div class="listing-pdf">
	
		<div class="pdf-form"> <?php print $pdf_form; ?> 
		<div class="dragable_images">
		
		
		
		
		<!--nid1 = listing nid(arg1)------ -->
		<!--nid2 = template nid(arg2)------ -->
		<ul id="listing-photos-draggable" mcpdf_nid="<?php print($values); ?>" nid1="<?php print(arg(1)); ?>" nid2="<?php print(arg(2)); ?>">
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
		
		
		</div><!-----/dragable_images-- -->
		<div class="submit_sequence">
		<input type="submit" value="Submit Sequence" id="update-pdf-photos-order">
		</div><!-----/submit_sequence-- -->
		</div><!-----/pdf-form-- -->
		<div class="pdf-thumbnail">
		
		<?php
		/*$result = get_mcpdf_nid();
		$node = node_load($result);
		echo"<pre>";
		print_r($node);
		echo"</pre>";*/
		
		
		
if($values != '' && $mcpdf_uid->uid==$user->uid) {	
	//$node = node_load($values);
	//if(!empty($node->field_pdf_photos)) {
		//pdf_image_generation();
	//}
	$result = get_mcpdf_nid();

	$pdf_node = node_load($result);
	
	$uri = $pdf_node->field_pdf_preview_image['und']['0']['uri'];
	
	/*$path = 's3://PDF/'.$result.'.pdf';
	$fid = db_query("SELECT fid FROM {file_managed} WHERE uri = :path", array(':path' => $path))->fetchField();
	$file = file_load($fid);
	
	
	$uid = $file->uid;
	$path = 's3://pdf-thumbnail/agent-'.$uid.'/listing/'.$result.'.jpeg';
	$file_uri = file_create_url($path);*/
	$file_uri = file_create_url($uri);
	
			$output='';
		
		$output.='<div class="pdf_design">';
		//$output.= theme_image_style($config);
		$output.= '<img src="'.$file_uri.'"/>';
		$output.='</div>';

		print $output;
	
	
}
	
	else {
	$node_load = node_load($var_name['pdf_design_id']);
		$output='';
		$config = array(
			"style_name" => "pdf_thumbnail",
			"path" => $node_load->field_template_thumbnail['und'][0]['uri'],
			"height" => NULL,
			"width" => NULL,
		);
		$output.='<div class="pdf_design">';
		$output.= theme_image_style($config);
		$output.='</div>';
	
		print $output;
	}
	
	?>
		</div><!-----/pdf-thumbnail-- -->
		
		
	</div><!-----/listing-pdf-- -->
</div><!-----/manage-listing-photos-- -->
