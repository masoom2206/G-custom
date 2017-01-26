<?php
$node = menu_get_object();
	$get_nid = $node->nid;
	$listing_node = node_load($get_nid);
	if(!empty($listing_node->field_lms_listing_headline)){
		$title=$listing_node->field_lms_listing_headline['und'][0]['value'];
	}
	else {
		//Listing Address
		if(isset($listing_node->field_lms_hide_listing_address['und']['0']['value']) && $listing_node->field_lms_hide_listing_address['und']['0']['value'] == 1) {		
			$title = t('Address Available Upon Request');
		}
		else {
			$address = array();
			if(isset($listing_node->field_lms_listing_address['und']['0']['value'])) {
				$address[] = $listing_node->field_lms_listing_address['und']['0']['value'];
			}
			if(isset($listing_node->field_lms_address_unit['und']['0']['value'])) {
				$address[] = $listing_node->field_lms_address_unit['und']['0']['value'];
			}
			if(isset($listing_node->field_lms_listing_city['und']['0']['value'])) {
				$address[] = $listing_node->field_lms_listing_city['und']['0']['value'];
			}
			$title = implode(', ', $address);
		}
	}
 ?>
<div id="gallery">
<div id="fb-root"></div>
<!-- USE 'Asynchronous Loading' version, for IE8 to work
http://developers.facebook.com/docs/reference/javascript/FB.init/ -->
<script>
	window.fbAsyncInit = function() {
		FB.init({
			appId  : '992129794145177',
			status : true, // check login status
			cookie : true, // enable cookies to allow the server to access the session
			xfbml  : true,  // parse XFBML
			version    : 'v2.3'
		});
	};
	(function() {
		var e = document.createElement('script');
		e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
		e.async = true;
		document.getElementById('fb-root').appendChild(e);
	}());
</script>
	<div class="web-listing-gallery">
		<div class="gallery-head">
			<div class="gallery-title">GALLERY</div>
		</div>
		<ul class="photos-gallery">
			<?php
				global $base_url;
				$x = 0;
				$y = 1;
				$total = 0;
				$output = '';
				if(isset($var_name['photos']) && !empty($var_name['photos'])) {
					foreach($var_name['photos'] as $photo) {
						$photo['photo_caption'] = ($photo['photo_caption'] == '') ? 'N/A' : $photo['photo_caption'];
						$image_data = '';
						$share_title=urlencode($photo['photo_title']);
						$share_image=urlencode($photo['photo_url']);
						$path = current_path();
						$path_alias = drupal_lookup_path('alias',$path);
						$current_path = $base_url.'/'.$path_alias;
						$pinterest_share_button='<a href="http://pinterest.com/pin/create/button/?media='.$share_image.'&description='.$share_title.'" class="pin-it-button" count-layout="horizontal"><img src="/sites/default/files/icon/pinterest-32.png" title="Pin It" width="32" height="32" /></a>';
						$facebook_share_button='<a href="https://www.facebook.com/dialog/feed?app_id=992129794145177&display=popup&link='.$current_path .'&redirect_uri='.$current_path .'&picture='.$share_image.'&name='.$title.'"><img id="share_button" src="/sites/default/files/icon/facebook-32.png" alt="Share on Facebook" width="32" height="32" /></a>';
						
						$overlay_content='<span class="text-content">
							<span>'.$pinterest_share_button.' '.$facebook_share_button.'</span>
							</span>';

						if($var_name['design'] == 'mc_design') {
							$image_data = '<div class="photo-title">'.$photo['photo_title'].'</div><div class="photo-caption">'.$photo['photo_caption'].'</div>';
							//.'<div class="mc-design-caption-icon"><img src="/sites/all/modules/custom/listing_marketing_system/images/plus-icon.jpg" /></div></div>'
						}
						if($x == 8) {
							$y = $y + 1;
							$output .= '<li class="gallery-set'.$y.'" photo-urls="'.$photo['photo_url'].'"><a href="'.$photo['photo_url'].'" rel="lightbox[gallery]" title="'.$photo['photo_caption'].'"><span class="mc-design-caption">'.$image_data.'</span>'.$photo['photo'].'</a>'.$overlay_content.'</li>';
							$x = 1;
						}					
						else {
							$output .= '<li class="gallery-set'.$y.'" photo-urls="'.$photo['photo_url'].'"><a href="'.$photo['photo_url'].'" rel="lightbox[gallery]" title="'.$photo['photo_caption'].'"><span class="mc-design-caption">'.$image_data.'</span>'.$photo['photo'].'</a>'.$overlay_content.'</li>';
							$x++;
						}
						$total++;
					}
				}
				print $output;
			?>
		</ul>
		<?php if($total > 8) { ?>
			<div class="more-photos-link"><a href="#" class="less-photos" value="1"><img src="/sites/all/modules/custom/listing_marketing_system/images/minus.png" width="16" height="16"/> Less Photos</a>&nbsp;&nbsp;&nbsp;<a href="#" class="more-photos" value="1"><img src="/sites/all/modules/custom/listing_marketing_system/images/plus.jpg" width="16" height="16"/> More Photos</a></div>
		<?php } ?>
	</div>
</div>
<div>
	<!-- <div id="image_popup">
		<span class="button b-close"><span></span></span>
		<div class="image_area"></div>
		<div class="image-share-div">
			<ul>
				<li class="pinterest-share">P</li>
				<li class="pinterest-share">F</li>
				<li class="share-share">+share</li>
			</ul>
		</div>
	</div>----------- --!>
</div>