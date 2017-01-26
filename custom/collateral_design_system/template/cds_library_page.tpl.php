<?php
  drupal_add_js(drupal_get_path('module', 'listing_pdf') . '/js/jquery.colorbox.js');
	drupal_add_css(drupal_get_path('module', 'listing_pdf') . '/css/colorbox.css');
	$media_format='';
	$arg = arg();
	if( isset( $arg[2] ) ){
		$media_format = arg(2);
	}
	global $base_url;
	$result = db_select('custom_save_template_json', 'cst')
				->fields('cst')
				->execute();
	$dir_uri = file_stream_wrapper_get_instance_by_uri('modules://');
	$real_path = $dir_uri;
	$real_path_explode = explode('public_html', $dir_uri);
	$output = '<div class="result">';
	
	foreach($result as $data){
		$explode = explode('://', $data->image_path);
		$canvas_img_path = $real_path_explode[1]."/".$explode[1];
		$json_data = $data->json_data;
		$decode_json_data = json_decode($json_data);
		$image_count = 0;
		if(is_array($decode_json_data)){
			$custom_image_count_from_json_data = json_decode($json_data);
			foreach($custom_image_count_from_json_data as $custom_data){
				$custom_image_count_from_json_data_child = json_decode($custom_data);
				foreach($custom_image_count_from_json_data_child->objects as $json_data_value_child){
					if($json_data_value_child->type == 'image'){
						$image_count++;
					}
				}
			}
		}else{
			foreach($decode_json_data->objects as $json_data_value){
				if($json_data_value->type == 'image'){
					$image_count++;
				}
			}
		}
		foreach($decode_json_data->objects as $json_data_value){
			if($json_data_value->type == 'image'){
				$image_count++;
			}
		}
		$page_settings_data = json_decode($data->page_settings);
		$config = array(
				  "style_name" => "cds_saved_tempates",
				  "path" =>$data->image_path,
				);
		$goatse_picture= theme_image_style($config);
		$basename_img_path = basename($canvas_img_path);
		$basename_img = explode(".", $basename_img_path);
		$edit_url = url('cds/design/'.$media_format.'/settings', array('query' => array('design_id'=> $data->id)));
		$output.='<div class="cds-saved-template-image-show-area">
						<div class = "cds-saved-template-img">
							'.$goatse_picture.'
							<div class="node_details"> <!--node_details-- -->
								<div class="node-title">
									<span>'.$page_settings_data->template_name.'</span>
								</div>
								<div class="node-side_photos">
									<span>Sides: '.$page_settings_data->sides.'</span>
									<span> Photos: '.$image_count.' </span>
								</div>
								<div class="temp_icons">
									<span class="edit_brochure">
										<a href="'.$edit_url.'" alt="Edit" title="Edit">
											<img src="/sites/all/modules/custom/listing_marketing_system/images/pencil-edit.png">
										</a>
									</span>
									<span class="delete_brochure">
										
									<img src="/sites/all/modules/custom/listing_marketing_system/images/trashcan.png" onclick="json_delete_pdf(\''.$data->id.'\');">
									</span>
									<ul id="auto-loop" class="gallery5">
										<div class="magnify">
											<li>
												<a href="'.$base_url.'/sites/all/modules'.$canvas_img_path.'" class="group1 groupd group'.$basename_img[0].'" data-id="group'.$basename_img[0].'" alt="Zoom In" title="Zoom In">
												
													<img src="/sites/all/modules/custom/listing_marketing_system/images/magnify.png">
												</a>
											</li>';
								 $data_images_other = drupal_json_decode($data->images_other);
                 foreach ($data_images_other as $key => $value  ) {
                   $explode = explode('://', $value);
                   $canvas_img_path2 = $real_path_explode[1]."/".$explode[1];
                   $output .= '<li>
												<a href="'.$base_url.'/sites/all/modules'.$canvas_img_path2.'" class="group1 groupd group'.$basename_img[0].'" data-id="group'.$basename_img[0].'" alt="Zoom In" title="Zoom In">
												  <img src="/sites/all/modules/custom/listing_marketing_system/images/magnify.png">
												</a>
											</li>';
                 }
											
										$output .= '</div>
									</ul>
									</div>
							</div>
						</div>
					</div>';
	}
	$output .= '</div><script>
  jQuery(document).ready(function(){
    jQuery(".groupd").each(function( index ) {
      var daid = jQuery(this).attr("data-id");
       console.log(daid);
      jQuery("."+daid).colorbox({rel:daid, transition:"none", height:"100%"});
    });
    
  });
</script>';
  print $output;
