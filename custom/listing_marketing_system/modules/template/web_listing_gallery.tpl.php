<div id="gallery">
	<div class="web-listing-gallery">
		<div class="gallery-head">
			<div class="gallery-logo"><img src="/sites/all/modules/custom/listing_marketing_system/images/gallery-logo.jpg"/></div>
			<div class="gallery-title">Gallery</div>
		</div>
		<ul class="photos-gallery">
			<?php
				$x = 0;
				$y = 1;
				$output = '';
				foreach($var_name['photos'] as $photo) {
					$image_data = '';
					if($var_name['design'] == 'mc_design') {
						$image_data = '<div class="photo-title">'.$photo['photo_title'].'</div><div class="photo-caption">'.$photo['photo_caption'].'</div>';
					}
					if($x == 8) {
						$y = $y + 1;
						$output .= '<li class="gallery-set'.$y.'" photo-url="'.$photo['photo_url'].'"><span class="plus-image">'.$image_data.'</span>'.$photo['photo'].'</li>';
						$x = 1;
					}
					else {
						$output .= '<li class="gallery-set'.$y.'" photo-url="'.$photo['photo_url'].'"><span class="plus-image">'.$image_data.'</span>'.$photo['photo'].'</li>';
						$x++;
					}
				}
				print $output;
			?>
		</ul>
		<div class="more-photos-link"><a href="#" class="more-photos" value="1"><img src="/sites/all/modules/custom/listing_marketing_system/images/plus.jpg"/> More Photos</a></div>
	</div>
</div>
<div>
	<div id="image_popup">
		<span class="button b-close"><span></span></span>
		<div class="image_area"></div>
		<div class="image-share-div">
			<ul>
				<li class="pinterest-share">P</li>
				<li class="pinterest-share">F</li>
				<li class="share-share">+share</li>
			</ul>
		</div>
	</div>
</div>
