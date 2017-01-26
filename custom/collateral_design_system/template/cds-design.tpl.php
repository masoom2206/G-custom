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
	<div class="design-content">
		<div class="cds-design-content-left design-content-left">
			<h3>Select Media Type</h3>
			<div class="designs"><a href="/cds/design/pdf"><img src="/sites/all/modules/custom/collateral_design_system/design_icons/property-pdf-icon.png"></br><span class="icon_title">Property PDF</span></a></div>
			<div class="designs"><img src="/sites/all/modules/custom/collateral_design_system/design_icons/property-ad-icon.png"></br><span class="icon_title">Property Ad</span></div>
			<div class="designs"><img src="/sites/all/modules/custom/collateral_design_system/design_icons/property-webpage-icon.png"></br><span class="icon_title">Property Website</span></div>
			<div class="designs"><img src="/sites/all/modules/custom/collateral_design_system/design_icons/property-mail-icon.png"></br><span class="icon_title">Property Email</span></div>
			<div class="designs"><img src="/sites/all/modules/custom/collateral_design_system/design_icons/property-video-icon.png"></br><span class="icon_title">Property Video</span></div>
			<div class="designs"><img src="/sites/all/modules/custom/collateral_design_system/design_icons/property-social-banner.png"></br><span class="icon_title">Facebook Banner</span></div>
		</div>
		<div class="cds-design-content-right design-content-right">
			<div class="design-content-data">
				<div class="data1 welcometext">Welcome to the</div> 
				<div class="data2 welcometext">Collateral Design System</div>  
				<div class="data3 welcometext">Select a Media type to Begin</div>  
			</div>
		</div>
	</div>
	<div class="footer">
	<p>Powered by <img src="/sites/all/modules/custom/collateral_design_system/design_icons/escrgb.png"></p>
	</div>
</div>
