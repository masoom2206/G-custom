<?php
	//print "<pre>";print_r($var_name);exit;
	//Current URL Alias
	$request_uri = $_SERVER['REQUEST_URI'];
	$exp_request_uri = explode('/', $request_uri);
	//$var_name['youtube_url'] = '';
?>
<?php if($var_name['design'] == 'mc_design' && $exp_request_uri[1] != 'unbranded' && ($var_name['youtube_url'] != '' || $var_name['video_url'] != '')) { ?>
	<div id="listing-video" style="background: url(<?php print $var_name['third_image']; ?>) no-repeat;background-size: cover; background-position: center;">
		<div class="overlay">&nbsp;</div>
		<div class="web-listing-video <?php print $var_name['design']; ?>">
			<div class="video-section">
				<?php if($var_name['youtube_url'] != '') {
					$url = parse_str( parse_url( $var_name['youtube_url'], PHP_URL_QUERY ), $vars);
					$video_id= $vars['v'];			
				?>
					<div class="listing-youtube">
						<iframe width="750" height="545" src="https://www.youtube.com/embed/<?php print $video_id; ?>"></iframe>
					</div>
					<div class="listing-video" video-url="<?php print $var_name['youtube_url'];?>"><a href="#" class="video-tour"><img src="/sites/all/modules/custom/listing_marketing_system/images/video-play-mc-design.png"/></a></div>
				<?php } else if($var_name['video_url'] != '') {?>
					<div class="listing-youtube">
						<video width="750" height="545" controls>
							<source src="https://cbone-ca.s3-us-west-2.amazonaws.com/lms/agent-6920/video/cbone_listing_5.mp4?brbIZMxkjykO0P.Sww.am6ZOHI0U4Hl3" type="video/mp4">
							Your browser does not support HTML5 video.
						</video>
					</div>
					<div class="listing-video" video-url="<?php print $var_name['video_url'];?>"><a href="#" class="video-tour"><img src="/sites/all/modules/custom/listing_marketing_system/images/video-play-mc-design.png"/></a></div>
				<?php } ?>
			</div>
		</div>
	</div>
<?php } else { ?>
	<div>&nbsp;</div>
<?php } ?>
