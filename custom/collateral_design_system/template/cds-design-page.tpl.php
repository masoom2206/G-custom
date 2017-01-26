<?php
global $base_url;
	$title = $_SESSION['page_settings_data']['template_name'];
	$px_width = $_SESSION['page_settings_data']['pdf_width'];
	$up_px_width = $_SESSION['page_settings_data']['up_pdf_width'];
	$px_height = $_SESSION['page_settings_data']['pdf_height'];
	$up_px_height = $_SESSION['page_settings_data']['up_pdf_height'];
	//$variation = $_SESSION['page_settings_data']['variations'];
	$bleed = $_SESSION['page_settings_data']['bleed'];
	$dimensions = $_SESSION['page_settings_data']['pdf_dimension'];
	$slides = $_SESSION['page_settings_data']['sides'];
	$resolution = $_SESSION['page_settings_data']['resolution'];
	$snap_grid = $_SESSION['page_settings_data']['snap_grid'];
	$up_snap_grid = ($_SESSION['page_settings_data']['snap_grid'])*96;
	$option_value = array('in', 'px', 'cm');
	$resolution_value = array('print'=>'Print', 'screen'=>'Screen');
	$snap_grid_options = array('none'=>'None', '1/32'=>'1/32', '1/16'=>'1/16', '3/32'=>'3/32', '1/8'=>'1/8', '3/16'=>'3/16', '1/4'=>'1/4');
	$output = '';
	$reso_output = '';
	foreach($option_value as $options){
		if($dimensions == $options){
			$output .= '<option value="'.$options.'" selected="selected">'.$options.'</option>';
		}else{
			$output .= '<option value="'.$options.'">'.$options.'</option>';
		}
	}
	foreach($resolution_value as $key => $options){
		if($resolution == $key){
			$reso_output .= '<option value="'.$key.'" selected="selected">'.$options.'</option>';
		}else{
			$reso_output .= '<option value="'.$key.'">'.$options.'</option>';
		}
	}
	foreach($snap_grid_options as $key => $options){
		if($snap_grid == $key){
			$snap_output .= '<option value="'.$key.'" selected="selected">'.$options.'</option>';
		}else{
			$snap_output .= '<option value="'.$key.'">'.$options.'</option>';
		}
	}
	if($bleed == 'bleed'){
		$bleed_field = '<input id="bleed" type="checkbox" value="" name="height" width="15" checked disabled>';
	}else{
		$bleed_field = '<input id="bleed" type="checkbox" value="" name="height" width="15" disabled>';
	}
	$cds_saved_template_json_decode = json_decode($_SESSION['page_settings_data']['json_data']);
	$custom_cds_saved_json_data = '';
	$z = 1;
	if(is_array($cds_saved_template_json_decode)){
		foreach($cds_saved_template_json_decode as $data){
			if(!empty($data)){
				$custom_cds_saved_json_data .= '<li class='.$z.'>'.$data.'</li>';
				$z++;
			}
		}
	}else{
		$custom_cds_saved_json_data .= '<li class='.$z.'>'.$_SESSION['page_settings_data']['json_data'].'</li>';
	}
	$saved_template_json_data = '<div class = "cds-saved-template-json-data" style="display:none;">'.$custom_cds_saved_json_data.'</div>';
	
	$page_settings_array = array();
	foreach($_SESSION['page_settings_data'] as $key=>$value){
		if($key != 'json_data'){
			$page_settings_array[$key] = $value;
		}
	}
	$page_settings_data = json_encode($page_settings_array);
	$page_setting = '<div id="page-setting-data-value" style="display:none;">'.$page_settings_data.'</div>';
	print $saved_template_json_data;
	print $page_setting;
?>
<div id="pdf-main-container" >
    <div id="bd-wrapper" ng-controller="CanvasControls" class="ng-scope">
		<div class="main_design">
			<div class="design-header">
				<span class="design-header-left">
					<?php 
						$block = module_invoke('collateral_design_system', 'block_view', 'top_banner_breadcrumbs');	
						print render($block['content']);
					?>
				</span>
				<span class="design-header-right">
					<img src="/sites/all/modules/custom/collateral_design_system/design_icons/property-pdf-icon.png" height="30" width="30">
					<img src="/sites/all/modules/custom/collateral_design_system/design_icons/newgear.png" height="30" width="30">
				</span>
			</div>
			<div class="design-content">
				<div class="design-content-left">
					<div class="template-setting">
						<h3 class = "cds-page-heading-title"><?php print $title; ?></h3>
						<div class="template-setting-contents">
							<a onclick="save_template()" title="Save Template"><img src="/sites/all/modules/custom/collateral_design_system/text_icons/1481776919_save.png"></a>
							<a class="save-template-as" onclick="" title="Save Template As"><img src="/sites/all/modules/custom/collateral_design_system/text_icons/1481776821_save_as.png"></a>
							<a type="button" title="Preview as Image" ng-click="saveImage()"><img src="/sites/all/modules/custom/collateral_design_system/text_icons/1481776317_PNG.png"></a>
							<a type="button" title="Preview as PDF" onclick="save_pdf()"><img src="/sites/all/modules/custom/collateral_design_system/text_icons/1481776849_PDF.png"></a>
						</div>
						<div class="template-setting-contents-result"></div>
						<div class="page-setting">
							<h3>PAGE SETTINGS</h3>
							<div class="page-setting-contents">
								<input type="hidden" value="<?php echo $up_px_width; ?>" name="up_width" id="up_page_width" >
								<input type="hidden" value="<?php echo $up_px_height; ?>" name="up_height" id="up_page_height" >
								<input type="hidden" value="<?php echo $up_snap_grid; ?>" name="up_snap_grid" id="up_snap_grid" >
								<table>
									<tr>
										<td class = "page-settings-form-label">
											Dimensions :
										</td>
										<td class = "page-settings-form-select-field">
											<select name="dimension" width="10" id="dimension" disabled>
												<?php echo $output; ?>
											</select>
										</td>
									</tr>
									<tr>
										<td class = "page-settings-form-label">
											Width :
										</td>
										<td class = "page-settings-form-input-field">
											 <input type="text" value="<?php echo $px_width; ?>" name="width" width="15" id="page_width" disabled>
										</td>
									</tr>
									<tr>
										<td class = "page-settings-form-label">
											Height :
										</td>
										<td class = "page-settings-form-input-field">
											 <input type="text" value="<?php echo $px_height; ?>" name="height" width="15" id="page_height" disabled>
										</td>
									</tr>
									<tr>
										<td class="page-settings-form-label">
											Snap to Grid :
										</td>
										<td class="page-settings-form-select-field">
											<select name="snap_grid" width="10" id="snap_grid" disabled>
												<?php echo $snap_output; ?>
											</select>
										</td>
									</tr>
									<tr>
										<td class="page-settings-form-label">
											Output resolution :
										</td>
										<td class="page-settings-form-select-field">
											<select name="resolution" width="10" id="resolution" disabled>
												<?php echo $reso_output; ?>
											</select>
										</td>
									</tr>
									<tr>
										<td class = "page-settings-form-label">
											Bleed & Crop Marks:
										</td>
										<td class = "page-settings-form-checkbox-field">
											<?php echo $bleed_field; ?>
										</td>
									</tr>
									<tr>
										<td class = "page-settings-form-label">
											No. of Sides :
										</td>
										<td class = "page-settings-form-input-field">
											 <input type="text" value="<?php echo $slides; ?>" name="sides" width="15" id="sides" disabled>
										</td>
									</tr>
									<tr>
										<td class = "page-settings-form-label">
											Show rulers :
										</td>
										<td class = "page-settings-form-checkbox-field">
											 <input id="rulers" type="checkbox" value="" name="rulers" width="15">
										</td>
									</tr>
									<tr>
										<td class = "page-settings-form-label">
											Show grid lines :
										</td>
										<td class = "page-settings-form-checkbox-field">
											 <input id="grid_lines" type="checkbox" value="" name="grid_lines" width="15">
										</td>
									</tr>
									<tr>
										<td class = "page-settings-form-label">
											Cursor coordinates :
										</td>
										<td class = "page-settings-form-checkbox-field">
											 <input id="cursor_coordinates" type="checkbox" value="" name="cursor_coordinates" width="15">
										</td>
									</tr>
								</table>
							</div>
						</div>
						<section class="zoomer zoomer__pane zoomer--presentation">
						<span id="zoomOut">-</span>
						<div id="zoom-level">
							<span id="canvaslevel"><h2>100%</h2></span>
							<div class="out overout">
								
								<div class="zoomer__popover zoomer__pane" style="display:none;">
									<a href="#" class="arrow"></a>
									<ul class="zoomer__popoverList">
									<li class="zoomer__item zoomer__popoverItem" id="10">10%</li>
									<li class="zoomer__item zoomer__popoverItem" id="25">25%</li>
									<li class="zoomer__item zoomer__popoverItem" id="50">50%</li>			
									<li class="zoomer__item zoomer__popoverItem" id="75">75%</li>										
									<li class="zoomer__item zoomer__popoverItem" id="100">100%</li>

									<li class="zoomer__item zoomer__popoverItem" id="125">125%</li>

									<li class="zoomer__item zoomer__popoverItem" id="150">150%</li>

									<li class="zoomer__item zoomer__popoverItem" id="175">175%</li>

									<li class="zoomer__item zoomer__popoverItem" id="200">200%</li>

									<li class="zoomer__item zoomer__popoverItem" id="300">300%</li>
									
									</ul>
								</div>
							</div>
						</div>
						<span id="zoomIn">+</span>							
						</section>
					</div>
					<div class="page-elements">
						<h3>Elements</h3>
						<div class="page-elements-contents">
							<div class="left-tabs"> <!-- required for floating -->
							  <!-- Nav tabs -->
							  <div class="tabs">
								<ul class="nav-tabs tabs-left sideways">
									<li class="active"><a href="#text-v" data-toggle="tab"><div class="cat_icon"><img class="svg-icon" src="https://dev.cbone.me/sites/default/files/rsz_textgraphic.png"></div><div class="cat_name">TEXT</div></a></li>
									<?php
									$category_options = array();
									$voc = taxonomy_vocabulary_machine_name_load('upload_category');
									$terms = taxonomy_get_tree($voc->vid, 0, 1);
									foreach ($terms as $data) {
										$taxonomy_load = taxonomy_term_load($data->tid);
										$taxo_uri = $taxonomy_load->field_upload_category_icon['und'][0]['uri'];
										$real_path = drupal_realpath($taxo_uri);
										$explode = explode('public_html/', $real_path);
										$tax_img_path = $base_url.'/'.$explode[1];
										$taxo_img = '<img class = "svg-icon" src = "'.$tax_img_path.'" />';
										$category_options[$data->tid] = $data->name;
										if(isset($taxonomy_load->field_upload_category_icon['und'][0])){
											print '<li><a class="'.strtolower($data->name).'" href="#'.strtolower($data->name).'-v" data-toggle="tab"><div class="cat_icon">'.$taxo_img.'</div><div class="cat_name">'.$data->name.'</div></a></li>';
										}else{
											print '<li><a class="'.strtolower($data->name).'" href="#'.strtolower($data->name).'-v" data-toggle="tab"><div class="cat_icon">'.$data->description.'</div><div class="cat_name">'.$data->name.'</div></a></li>';
										}
									}
									//die;
									?>
									<li><a class="upload" href="#up-v" data-toggle="tab"><div class="cat_icon"><svg class="svg-icon" viewBox="0 0 22 22">
										<path fill="#FFFFFF" d="M18.7 6.2l-7-6s-.1-.1-.2-.1l-.1-.1c-.2-.1-.5-.1-.7 0 0 0-.1 0-.1.1-.1 0-.1.1-.2.1l-7 6c-.4.4-.5 1-.1 1.4.4.4 1 .5 1.4.1L10 3.2V19c0 .6.4 1 1 1s1-.4 1-1V3.2l5.3 4.6c.2.1.5.2.7.2.3 0 .6-.1.8-.3.3-.5.3-1.1-.1-1.5z"/>
									</svg></div><div class="cat_name">Upload</div></a></li>
								  </ul>
							  </div>
							</div>
							<div class="right-tabs tab-content">
							  <!-- Tab panes -->
								<div class="tab-pane cds-text-options active" id="text-v">
									<p><button class="text add-heading" ng-click="addHeading()">Add Headline</button></p>
									<p><button class="text add-subheading" ng-click="addSubheading()">Add Sub-headline</button></p>
									<p><button class="text add-singleline" ng-click="addStatictext()">Add Single-line text</button></p>
									<p><button class="text add-multiline" ng-click="addText()">Add Multiple-line Text</button></p>
								</div>
								
							  <?php
								foreach($category_options as $key => $category){
									$folder_list='<div class="tab-pane" id="'.strtolower($category).'-v">';
									$folder_options = folder_select_list_options($key);
									if(!empty($folder_options)){
										$folder_list.='<div style="display: block; height: 210px;">
										<ul class="categories" id="'.strtolower($category).'-result">';
										foreach($folder_options as $key => $folders){
												$name = strtolower($folders);
												$folder_list.='<li class="innertab"  id="'.strtolower($category).'"><a href="#" data-query="'.$name.'">'.$folders.'</a></li>';
											}
										$folder_list.='</ul></div><div class="'.strtolower($category).'-result"></div>';
									}
									else{
										$data = cds_pdf_elements($category);
										$folder_list.='<div class="'.strtolower($category).'-result">'.$data.'</div>';
									}
									$folder_list.='</div>';
								print $folder_list;
								}
							  ?>
								<div class="tab-pane" id="up-v">
									<button id = "cds-upload-pdf">PDF</button>
									<button id = "cds-upload-images" style="background-color: #238C00;">IMAGES</button>
									<form name="form" action="" method="get">
									  <input id="clickedbutton" type="hidden" value=" " name="clickedbutton" />
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="design-content-right">
					<?php $form = drupal_get_form('property_ads_form'); ?>
							<div id="custom-canvas-confirm-popup">
								<div class="custom-confirm-area">
									<div id="all-images">
										<?php
											print drupal_render($form);
										?>
									</div>
								</div>
								<br/>
							</div>
							<?php $form2 = drupal_get_form('property_ads_form_pdf','PDF'); ?>
							<div id="custom-canvas-confirm-popup2">
								<div class="custom-confirm-area">
									<div id="all-images">
										<?php
											print drupal_render($form2);
										?>
									</div>
								</div>
								<br/>
							</div>
					<div id="canvas-wrapper-main">
						<div class="design-content-right-top">
						
						<div id="image-wrapper" ng-show="getImage()">
							<?php 
								$block = module_invoke('collateral_design_system', 'block_view', 'image_menu');	
								print render($block['content']);
							?>
						</div>
						<div id="text-wrapper" ng-show="getText()">
							<?php 
								$block = module_invoke('collateral_design_system', 'block_view', 'text_menu');	
								print render($block['content']);
							?>
						</div>
						<div id="bg-wrapper" ng-show="getBg()">
							<div class="toolbar-menu">
								<button class="toolbar__button toolbar__button--delete toolbar__button--icon" style="margin-left: 796px;" ng-click="deletebackgroundimage()" data-item="delete">
								</button>
							</div>
						</div>					
					</div>
					<!-- commented part create for crop marks layout --> 
					<!--<div class = "cds-parent-canvas-div" style="width: <?php //echo ($up_px_width+45).'px'; ?>; height: <?php //echo ($up_px_height+45).'px'; ?>; padding: 20px; margin-top: 8%;">
						<div class="cds-inner-canvas-div" style="width: <?php //echo $up_px_width.'px'; ?>; height: <?php //echo $up_px_height.'px'; ?>;"></div>
						<span> -->
							<div id="canvas-wrapper-left" class="designs">
									<div id="canvas-wrapper" class="designs">
										<?php
											for($i=1; $i <= $slides; $i++){
												print '<div class="container-div" id="canvas-container'.$i.'" data-id="'.$i.'"><canvas id="canvas'.$i.'" width="'.$up_px_width.'" height="'.$up_px_height.'" class="canvas" style="border:1px solid;"></canvas></div>';
											}
										?>
									</div>
								</div>
								<div class="container1" style=" display:none;   border: 1px dashed;    bottom: 0;    height: 427px !important;    left: 0;    position: relative;    right: 0;    top: 0;    width: 603px !important; margin-top: 4px;    margin-left: 64px; float:left;">
								</div>
							</div>
						<!--</span>
					</div> -->
				</div>
			</div>
		</div>
    </div>
 </div>
 <div class="footer">
	<p>Powered by <img src="/sites/all/modules/custom/collateral_design_system/design_icons/escrgb.png"></p>
	</div>
 <div class="confirmBox-group">
	<div id="confirmBox">
		<div class="message"></div>
		<div class="buttons">
			<span class="yes">
				<span class="long">Delete</span>
			</span>
			<span class="no">
				<span class="long">Don’t delete</span>
			</span>
		</div>
	</div>
	<div class="cover"></div>
</div>