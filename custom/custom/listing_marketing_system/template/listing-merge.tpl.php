<?php
//print "<pre>";print_r($form);exit;
	$nid1 = arg(1);
	$nid2 = arg(2);
	$nodedetail1 = node_load($nid1);
	if(isset($nodedetail1->field_lms_listing_nrt_id['und']['0']['value']) && $nodedetail1->field_lms_listing_nrt_id['und']['0']['value'] != '') {
		$nodedetail1 = node_load($nid1);
		$nodedetail2 = node_load($nid2);
	}
	else {
		$nodedetail1 = node_load($nid2);
		$nodedetail2 = node_load($nid1);
	}
	$property_type1 = '';
	if(isset($nodedetail1->field_lms_property_type['und']['0']['tid'])) {
		$property_type1 = taxonomy_term_load($nodedetail1->field_lms_property_type['und']['0']['tid'])->name;
	}
	$property_type2 = '';
	if(isset($nodedetail2->field_lms_property_type['und']['0']['tid'])) {
		$property_type2 = taxonomy_term_load($nodedetail2->field_lms_property_type['und']['0']['tid'])->name;
	}
	$listing_status1 = '';
	if(isset($nodedetail1->field_lms_listing_status['und']['0']['tid'])) {
		$listing_status1 = taxonomy_term_load($nodedetail1->field_lms_listing_status['und']['0']['tid'])->name;
	}
	$listing_status2 = '';
	if(isset($nodedetail2->field_lms_listing_status['und']['0']['tid'])) {
		$listing_status2 = taxonomy_term_load($nodedetail2->field_lms_listing_status['und']['0']['tid'])->name;
	}
	$co_agent1 = '';
	if(isset($nodedetail1->field_lms_other_agent['und']['0']['uid'])){
		$co_agent_detail = user_load($nodedetail1->field_lms_other_agent['und']['0']['uid']);
		if(isset($co_agent_detail->field_preferred_name['und']['0']['value'])) {
			$co_agent1 = $co_agent_detail->field_preferred_name['und']['0']['value'];
		}
		else if(isset($co_agent_detail->field_first_name['und']['0']['value'])){
			$co_agent1 = $co_agent_detail->field_first_name['und']['0']['value'].' '.$co_agent_detail->field_last_name['und']['0']['value'];
		}
		else {
			$co_agent1 = ucwords($co_agent_detail->name);
		}
	}
	$co_agent2 = '';
	if(isset($nodedetail2->field_lms_other_agent['und']['0']['uid'])){
		$co_agent_detail = user_load($nodedetail2->field_lms_other_agent['und']['0']['uid']);
		if(isset($co_agent_detail->field_preferred_name['und']['0']['value'])) {
			$co_agent2 = $co_agent_detail->field_preferred_name['und']['0']['value'];
		}
		else if(isset($co_agent_detail->field_first_name['und']['0']['value'])){
			$co_agent2 = $co_agent_detail->field_first_name['und']['0']['value'].' '.$co_agent_detail->field_last_name['und']['0']['value'];
		}
		else {
			$co_agent2 = ucwords($co_agent_detail->name);
		}
	}
	$mls_description1 = '';
	if(isset($nodedetail1->field_lms_mls_description['und']['0']['value'])) {
		$mls_description1 = substr($nodedetail1->field_lms_mls_description['und']['0']['value'], 0, 25).'...';
	}
	$mls_description2 = '';
	if(isset($nodedetail2->field_lms_mls_description['und']['0']['value'])) {
		$mls_description2 = substr($nodedetail2->field_lms_mls_description['und']['0']['value'], 0, 25).'...';
	}
	
	$photo1 = cbone_listing_photo_count($nid1);
	$photo2 = cbone_listing_photo_count($nid2);
	//print "<pre>";print_r($nodedetail2);exit;
?>

<div class="merge-buttons">
	<div class="merge"><?php print render($form['submit']); ?></div>
	<div class="cancel"><?php print render($form['cancel']); ?></div>
</div>
<table id="cbone-listing-merege">
	<tr>
		<th width="45%" class="head-first">Duplicate Listing</th>
		<th width="7%" class="second">&gt;&gt;&gt;</th>
		<th width="45%" class="head-third">Original Listing (Manually Entered)</th>
	</tr>
	<tr>
		<td class="first address"><?php print isset($nodedetail1->field_lms_listing_address['und']['0']['value']) ? $nodedetail1->field_lms_listing_address['und']['0']['value'] : ''; ?></td>
		<td class="second">&nbsp;</td>
		<td class="third address"><?php print isset($nodedetail2->field_lms_listing_address['und']['0']['value']) ? $nodedetail2->field_lms_listing_address['und']['0']['value'] : ''; ?></td>
	</tr>
	<tr class="listing-row">
		<td class="first">NRT Property ID: <?php print (isset($nodedetail1->field_lms_listing_nrt_id['und']['0']['value']) ? $nodedetail1->field_lms_listing_nrt_id['und']['0']['value'] : ''); ?></td>
		<td class="second"><?php print render($form['nrt_id']); ?> <div class="three-arrow">&gt;&gt;&gt;</div></td>
		<td class="third">NRT Property ID: <?php print (isset($nodedetail2->field_lms_listing_nrt_id['und']['0']['value']) ? $nodedetail2->field_lms_listing_nrt_id['und']['0']['value'] : ''); ?></td>
	</tr>
	<tr class="listing-row">
		<td class="first">MLS Number: <?php print (isset($nodedetail1->field_lms_mls_id['und']['0']['value']) ? $nodedetail1->field_lms_mls_id['und']['0']['value'] : ''); ?></td>
		<td class="second"><?php print render($form['mls_no']); ?> <div class="three-arrow">&gt;&gt;&gt;</div></td>
		<td class="third">MLS Number: <?php print (isset($nodedetail2->field_lms_mls_id['und']['0']['value']) ? $nodedetail2->field_lms_mls_id['und']['0']['value'] : ''); ?></td>
	</tr>
	<tr class="listing-row">
		<td class="first">Co-listing agent: <?php print $co_agent1; ?></td>
		<td class="second"><?php print render($form['co_listing_agent']); ?> <div class="three-arrow">&gt;&gt;&gt;</div></td>
		<td class="third">Co-listing agent: <?php print $co_agent2; ?></td>
	</tr>
	<tr class="listing-row">
		<td class="first">Unit Number: <?php print (isset($nodedetail1->field_lms_address_unit['und']['0']['value']) ? $nodedetail1->field_lms_address_unit['und']['0']['value'] : ''); ?></td>
		<td class="second"><?php print render($form['unit_number']); ?> <div class="three-arrow">&gt;&gt;&gt;</div></td>
		<td class="third">Unit Number: <?php print (isset($nodedetail2->field_lms_address_unit['und']['0']['value']) ? $nodedetail2->field_lms_address_unit['und']['0']['value'] : ''); ?></td>
	</tr>
	<tr class="listing-row">
		<td class="first">Bedrooms: <?php print (isset($nodedetail1->field_lms_total_bedrooms['und']['0']['value']) ? $nodedetail1->field_lms_total_bedrooms['und']['0']['value'] : ''); ?></td>
		<td class="second"><?php print render($form['bedroom']); ?> <div class="three-arrow">&gt;&gt;&gt;</div></td>
		<td class="third">Bedrooms: <?php print (isset($nodedetail2->field_lms_total_bedrooms['und']['0']['value']) ? $nodedetail2->field_lms_total_bedrooms['und']['0']['value'] : ''); ?></td>
	</tr>
	<tr class="listing-row">
		<td class="first">Bath: <?php print (isset($nodedetail1->field_lms_total_baths['und']['0']['value']) ? $nodedetail1->field_lms_total_baths['und']['0']['value'] : ''); ?></td>
		<td class="second"><?php print render($form['bath']); ?> <div class="three-arrow">&gt;&gt;&gt;</div></td>
		<td class="third">Bath: <?php print (isset($nodedetail2->field_lms_total_baths['und']['0']['value']) ? $nodedetail2->field_lms_total_baths['und']['0']['value'] : ''); ?></td>
	</tr>
	<tr class="listing-row">
		<td class="first">Property Type: <?php print $property_type1; ?></td>
		<td class="second"><?php print render($form['property_type']); ?> <div class="three-arrow">&gt;&gt;&gt;</div></td>
		<td class="third">Property Type: <?php print $property_type2; ?></td>
	</tr>
	<tr class="listing-row">
		<td class="first">Price: $<?php print (isset($nodedetail1->field_lms_list_price['und']['0']['value']) ? $nodedetail1->field_lms_list_price['und']['0']['value'] : ''); ?></td>
		<td class="second"><?php print render($form['price']); ?> <div class="three-arrow">&gt;&gt;&gt;</div></td>
		<td class="third">Price: $<?php print (isset($nodedetail2->field_lms_list_price['und']['0']['value']) ? $nodedetail2->field_lms_list_price['und']['0']['value'] : ''); ?></td>
	</tr>
	<tr class="listing-row">
		<td class="first">Listing Status: <?php print $listing_status1; ?></td>
		<td class="second"><?php print render($form['listing_status']); ?> <div class="three-arrow">&gt;&gt;&gt;</div></td>
		<td class="third">Listing Status: <?php print $listing_status2; ?></td>
	</tr>
	<tr class="listing-row">
		<td class="first">MLS Description: <?php print $mls_description1; ?></td>
		<td class="second"><?php print render($form['mls_description']); ?> <div class="three-arrow">&gt;&gt;&gt;</div></td>
		<td class="third">MLS Description: <?php print $mls_description2; ?></td>
	</tr>	
	<tr class="listing-row">
		<td class="first">Photos (<?php print $photo1; ?>): <span>Note: may create duplicates of existing<span></td>
		<td class="second"><?php print render($form['photos']); ?> <div class="three-arrow">&gt;&gt;&gt;</div></td>
		<td class="third">Photos (<?php print $photo2; ?>): </td>
	</tr>
</table>
<div style="display:none;"><?php print drupal_render_children($form); ?></div>
