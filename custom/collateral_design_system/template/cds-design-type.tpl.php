<?php
	unset($_SESSION['page_settings_data']);
?>
<div class="main_design">
	<div class="design-header">
		<?php 
			$block = module_invoke('collateral_design_system', 'block_view', 'top_banner_breadcrumbs');	
			print render($block['content']);
		?>
	</div>
	<div class="design-content">
		<div class="cds-design-content-left design-content-left">
			<div class="product_icon"><img src="/sites/all/modules/custom/collateral_design_system/design_icons/property-pdf-icon.png"></br><span class="icon_title">Property PDF</span></div>
		</div>
		<div class="cds-design-content-right design-content-right">
			<div class="design-content-right-top">
				<div class="design-content-setting">
					<?php 
						$block = module_invoke('collateral_design_system', 'block_view', 'cds_product_type');		
						print render($block['content']);
					?>
				</div>
			</div>
			<div class="design-saved-template">
				<?php 
					$block = module_invoke('collateral_design_system', 'block_view', 'saved_template');		
					print render($block['content']);
				?>
			</div>
			
		</div>
	</div>
	<div class="footer">
	<p>Powered by <img src="/sites/all/modules/custom/collateral_design_system/design_icons/escrgb.png"></p>
	</div>
</div>
