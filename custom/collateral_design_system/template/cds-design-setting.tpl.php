<?php
module_load_include('inc', 'collateral_design_system', 'includes/cds_design_setting');
?>
<div class="main_design">
	<div class="design-header">
		<?php 
			$block = module_invoke('collateral_design_system', 'block_view', 'top_banner_breadcrumbs');	
			print render($block['content']);
		?>
	</div>
	<div class="cds-design-content">
		<div class="cds-design-content-left design-content-left">
			<div class="product_icon"><img src="/sites/all/modules/custom/collateral_design_system/design_icons/property-pdf-icon.png"></div>
		</div>
		<div class="cds-design-content-right design-content-right">
			<div class="design-content-setting">
				<?php $form = drupal_get_form('property_pdf_selection_tool', $var_name); 
				print drupal_render($form);
				?>
			</div>
		</div>
	</div>
	<div class="footer">
	<p>Powered by <img src="/sites/all/modules/custom/collateral_design_system/design_icons/escrgb.png"></p>
	</div>
</div>
