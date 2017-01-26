<div class="breadcrumbs">
<?php 
	$url=strtok(request_path(),'?');
?>
	<!-- For CDS Welcome screen -->
	<?php	if($url =='cds/design'): ?>
		<h2>Collateral Design System</h2>
		
	<!-- For CDS Library screen -->
	<?php	elseif($url=='cds/design/pdf'): ?>
		<h2><?php print l('Collateral Design System','cds/design');?> > Library</h2>
	
	
	<!-- For CDS Setting screen -->
	<?php	elseif($url =='cds/design/pdf/settings'): ?>
		<h2><?php print l('Collateral Design System','cds/design');?> > <?php print l('Library','cds/design/pdf');?> > Settings</h2>
	
	
	<!-- For CDS actual Template Designer screen -->
	
	<?php	elseif( $url =='cds/design/create/pdf'): 
	
			$design_id='';
			if(isset($_GET['design_id']) ){
				$design_id = $_GET['design_id'];
			}
	?>
		<h2><?php print l('Collateral Design System','cds/design');?> > <?php print l('Library','cds/design/pdf');?> > <?php print l('Settings','cds/design/pdf/settings', array('query' => array('design_id'=>$design_id) ) );?> > Template Designer</h2>
	<?php endif;?>
</div>