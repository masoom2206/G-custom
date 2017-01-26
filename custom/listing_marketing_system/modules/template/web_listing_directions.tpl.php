<div id="directions">
	<div class="web-listing-directions">
		<div class="static-google-map"><?php print $var_name['map']; ?></div>
		<div class="directions-links">
			<ul class="links">
				<li class="get-directions"><?php print $var_name['map_link']?></li>
				<li class="contact-agent"><a href="/user/<?php print $var_name['agent_id']; ?>/contact" id="contact-agent">contact agent</a></li>
				<?php if($var_name['open_house_date'] != '') { ?>
					<li class="open-house"><a href="#" id="open-house">open house</a></li>
					<div class="open-house-dates">
						<div class="house-title">Open House Dates</div>
						<div class="house-date"><?php print $var_name['open_house_date']; ?></div>
					</div>
				<?php } ?>
			</ul>
		</div>
	</div>
</div>
