<!--<link rel="stylesheet" href="http://idangero.us/swiper/dist/css/swiper.min.css">-->
<div id="home">
	<div class="lms-listing-home <?php print $var_name['design']; ?>">
<?php
	$active= active_inactive_listing($var_name['listing_nid']);
	if($active==1){
?>
	
		<div class="listing-first-image">
			<?php if($var_name['design'] == 'mc_design') { ?>
			<?php //print views_embed_view('listing_home_slider', $display_id = 'block', $var_name['listing_nid']); ?>
				<div class="swiper-container">
					<div class="swiper-wrapper">
						<?php foreach($var_name['first_image'] as $photo){ ?>
							<div class="swiper-slide">
								<!--<img src="<?php //print $photo; ?>" alt="Slide 1" width="950" height="450" />-->
								<?php print $photo; ?>
							</div>
						<?php }?>
					</div>
					<div class="swiper-pagination"></div>
					<div class="swiper-button-next"><img src="/sites/all/modules/custom/listing_marketing_system/images/slide-next.png" /></div>
					<div class="swiper-button-prev"><img src="/sites/all/modules/custom/listing_marketing_system/images/slide-prev.png" /></div>
				</div>			
			<?php } else {?>
				<img src="<?php print $var_name['first_image']; ?>">
			<?php } ?>
		</div>
		<div class="rool-detail">
			<?php if($var_name['design'] == 'mc_design') { ?>
				<div class="web-heading"><?php print $var_name['title']; ?></div>
				<div class="bedroom-detail bedroom-sqft"><span><?php print $var_name['bedroom_detail']; ?></span></div>
				<div class="bedroom-detail bedroom-address"><span><img src="/sites/all/modules/custom/listing_marketing_system/images/pin-icon.png" width="12"/>&nbsp;&nbsp;<?php print $var_name['address']; ?></span></div>
			<?php } else {?>
				<?php if($var_name['status'] != '') { ?>
					<div class="web-status"><?php print $var_name['status']; ?></div>
				<?php } ?>
				<div class="web-heading"><?php print $var_name['title']; ?></div>
				<div class="border-web-heading">&nbsp;</div>
				<div class="bedroom-detail"><?php print $var_name['bedroom_detail']; ?></div>
			<?php } ?>
		</div>
	
	<?php } 
	else{ ?>
	<div class="listing-first-image">
		<div class="rool-detail">
			<span>This property web page has not yet been published.</span>
		</div>
	</div>
	<?php }?>
	</div>
</div>
<?php if($var_name['design'] == 'mc_design') { ?>
	<script type="text/javascript" src="//idangero.us/swiper/dist/js/swiper.min.js"></script>
	<script>
		var swiper = new Swiper('.swiper-container', {
			nextButton: '.swiper-button-next',
			prevButton: '.swiper-button-prev',
			paginationClickable: true,
			spaceBetween: 30,
			centeredSlides: true,
			autoplay: 4000,
			autoplayDisableOnInteraction: false,
			speed: 1000,
			loop: true,
			effect:'fade'
		});
		/*var swiper = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			nextButton: '.swiper-button-next',
			prevButton: '.swiper-button-prev',
			slidesPerView: 1,
			paginationClickable: true,
			spaceBetween: 30,
			loop: true
		});*/
	</script>
<?php } ?>
