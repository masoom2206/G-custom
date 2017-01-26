<?php 
$user= user_load($var_name['agent_id']);
$emailto= $user->field_person_email['und'][0]['value'];
$node= node_load($var_name['listing_id']);
$address = isset($node->field_lms_listing_address['und']['0']['value']) ? $node->field_lms_listing_address['und']['0']['value'] .', ': '';
$city = isset($node->field_lms_listing_city['und']['0']['value']) ? $node->field_lms_listing_city['und']['0']['value'] .'': '';
$request_uri = $_SERVER['REQUEST_URI'];
$exp_request_uri = explode('/', $request_uri);
?>
<div id="directions">
	<div class="web-listing-directions">
		<div class="gallery-head">
			<div class="gallery-title">DIRECTIONS</div>
		</div>
		<div class="static-google-map"><?php print $var_name['map']; ?></div>
		<div class="directions-links">
			<ul class="links">
				<?php if($var_name['map_link'] != '') { ?>
					<li class="get-directions"><img src="/sites/default/files/icon/directions.png" width="42" height="42"><?php print $var_name['map_link']?></li>
				<?php } ?>
				<?php if($exp_request_uri[1] != 'unbranded') { ?>
					<li class="contact-agent"><img src="/sites/default/files/icon/contact-agent.png" width="42" height="42"><a href="mailto:<?php print $emailto; ?>?subject=Inquiry regarding <?php print $address.' '.$city ; ?>" >contact agent</a></li>
				<?php } ?>
				<?php if($var_name['open_house_date'] != '') { ?>
					<li class="open-house"><img src="/sites/default/files/icon/openhouse.png" width="42" height="42"><a href="#" id="open-house">open house</a></li>
					<div class="open-house-dates">
						<div class="house-title">Open House Dates</div>
						<div class="house-date"><?php print $var_name['open_house_date']; ?></div>
					</div>
				<?php } ?>
			</ul>
		</div>
	</div>
</div>
