<?php
	//print "<pre>";print_r($var_name);exit;
	$request_uri = $_SERVER['REQUEST_URI'];
	$exp_request_uri = explode('/', $request_uri);
?>
<div id="features">
	<div class="web-listing-feature <?php print $var_name['design']; ?>">
	<?php if($var_name['design'] == 'mc_design') { ?>
		<div class="feature-first">
			<div class="feature-title" style="background: url(<?php print $var_name['second_image']; ?>) no-repeat; background-size: cover; background-position: center;">
				<div class="title">Features</div>
				<div class="overlay">&nbsp;</div>
			</div>
			<div class="mc-design-bottom">
				<div class="feature-online-copy"><?php print $var_name['feature_content']; ?></div>
				<?php if($exp_request_uri[1] != 'unbranded') {?>
					<?php if($var_name['display_document'] == 0 && $var_name['download_documents'] == 1){ ?>
						<div class="download-listing-document">
							<div><a href="/listing-document/download/<?php print $var_name['listing_nid']; ?>" id="download-document"><img src="/sites/all/modules/custom/listing_marketing_system/images/paper-icon.png" width="28" height="39"/></a></div>
							<div class="download">Download</div>
							<div class="download">Listing Documents and Floor Plans</div>
						<!--Modal window container-->
							<div id="image_popup">
								<span class="button b-close"><span></span></span>
								<div class="image_area"></div>
							</div>
						</div>
					<?php } ?>
					<?php if($var_name['pdf_design_nid'] != '' && $var_name['pdf_design_nid'] != 0 && $var_name['pdf_brochure'] == 0){ ?>
						<div class="download-listing-document">
							<div>
								<a href="/download_pdf/<?php print $var_name['listing_nid']; ?>/<?php print $var_name['pdf_design_nid']; ?>">
									<img src="/sites/all/modules/custom/listing_marketing_system/images/paper-icon.png" width="28" height="39"/>
								</a>
							</div>
							<div class="download">Download Brochure</div>
						</div>
					<?php } ?>
				<?php } ?>
			</div>
		</div>
	<?php } else { ?>
		<div class="region region-user18 col-xs-12 col-sm-12 col-md-6 col-lg-6 feature-first">
			<div class="feature-title">Features</div>
			<div class="feature-online-copy"><?php print $var_name['feature_content']; ?></div>
			<?php if($exp_request_uri[1] != 'unbranded') {?>
				<?php if($var_name['youtube_url'] != '') {
					$url = parse_str( parse_url( $var_name['youtube_url'], PHP_URL_QUERY ), $vars);
					$video_id= $vars['v'];			
				?>
					<div class="listing-youtube">
						<iframe width="750" height="545" src="https://www.youtube.com/embed/<?php print $video_id; ?>"></iframe>
					</div>
					<div class="listing-video" video-url="<?php print $var_name['youtube_url'];?>"><a href="#" class="video-tour"><img src="/sites/all/modules/custom/listing_marketing_system/images/YouTube-Play.jpg" width="163" height="43"/></a></div>
				<?php } ?>
				<?php if($var_name['display_document'] == 0 && $var_name['download_documents'] == 1){ ?>
					<div class="download-listing-document">
						<div><a href="/listing-document/download/<?php print $var_name['listing_nid']; ?>" id="download-document"><img src="/sites/all/modules/custom/listing_marketing_system/images/document.jpg" width="28" height="39"/></a></div>
						<div class="download">Download</div>
						<div class="download">Listing Documents and Floor Plans</div>
					</div>
					<!--Modal window container-->
					<div id="image_popup">
						<span class="button b-close"><span></span></span>
						<div class="image_area"></div>
					</div>
				<?php } ?>
				<?php if($var_name['pdf_design_nid'] != '' && $var_name['pdf_design_nid'] != 0 && $var_name['pdf_brochure'] == 0){ ?>
					<div class="download-listing-document">
						<div>
							<a href="/download_pdf/<?php print $var_name['listing_nid']; ?>/<?php print $var_name['pdf_design_nid']; ?>">
								<img src="/sites/all/modules/custom/listing_marketing_system/images/document.jpg" width="28" height="39"/>
							</a>
						</div>
						<div class="download">Download Brochure</div>
					</div>
				<?php } ?>
			<?php } ?>
		</div>
		<div class="region region-user19 col-xs-12 col-sm-12 col-md-6 col-lg-6 feature-second">
			<?php print $var_name['second_image']; ?>
		</div>
	<?php } ?>
	</div>
</div>
