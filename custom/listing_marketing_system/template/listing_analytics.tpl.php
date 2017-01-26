<?php
//print "<pre>";print_r($var_name);exit;
// id="listing-modal-back"

if(user_has_role(9, $user)){
	$alisting_url = "/office-listings-agent/".$var_name['listing_uid'];
}else{
	$alisting_url = "/my-listings";
}
?>
<div class="manage-listing-back"><a href="/manage-listing/<?php print $var_name['listing_nid']?>"><img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png"></a></div>
<div class="manage-listing-photos">
	<div class="listing-photos-header">
		<div class="photos-title">Listing Analytics</div>
		<div class="photos-address"><?php print $var_name['listing_address']; ?> <a href="/manage-listing/<?php print $var_name['listing_nid']?>">[return to Listing Tools]</a> <a href="<?php print $alisting_url; ?>">[return to Active Listings]</a></div>		
	</div>
	<div class="listing-analytics-body" style="width: 900px;">
		<ul class="node-view-detail">
			<li class="day-view">
				<div><img src="/sites/all/modules/custom/listing_marketing_system/images/analytics-icon-1.png" /> <span><?php print $var_name['daycount']?></span></div>				
				<div>VIEWS TODAY</div>
			</li>
			<li class="week-view">
				<div><img src="/sites/all/modules/custom/listing_marketing_system/images/analytics-icon-2.png" /> <span><?php print $var_name['weekcount']?></span></div>				
				<div>VIEWS THIS WEEK</div>
			</li>
			<li class="month-view">
				<div><img src="/sites/all/modules/custom/listing_marketing_system/images/analytics-icon-3.png" /> <span><?php print $var_name['monthcount']?></span></div>				
				<div>VIEWS THIS MONTH</div>
			</li>
			<li class="year-view">
				<div><img src="/sites/all/modules/custom/listing_marketing_system/images/analytics-icon-4.png" /> <span><?php print $var_name['yearcount']?></span></div>				
				<div>VIEWS THIS YEAR</div>
			</li>
		</ul>
		<div class="chart-detail" style="margin-bottom: 30px;">
			<div class="chart-title">ACTIVITY</div>
			<?php //print $var_name['chart']; ?>
			<script>		
				jQuery(document).ready(function() {
					var chartData = {
						node: "graph",
						//dataset: [122, 65, 80, 84, 33, 55, 95, 15, 268, 47, 72, 69],
						dataset: [<?php print $var_name['mon_view_count']; ?>],
						labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
						pathcolor: "#042e52",
						fillcolor: "#042e52",
						xPadding: 0,
						yPadding: 0,
						ybreakperiod: 10
					};
					drawlineChart(chartData);
				});
			</script>
			<div style="margin:20px auto; text-align:center;">
				<canvas id="graph" width="900" height="500" align="center"></canvas>
			</div>
		</div>
	</div>
</div>
