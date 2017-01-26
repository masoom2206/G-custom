<?php
/**
 * Callback function cbone_listing_brochures_approval()
 * to displayed the pdf list for approval
 **/
function cbone_listing_postcard_approval($nid){
	global $user;
	//Select order_id of listing.
	$query = db_select('field_data_field_lms_listing_reference', 'lms')
		->fields('lms', array('entity_id'))
		->condition('field_lms_listing_reference_nid', $nid, '=')
		->condition('entity_type', 'commerce_order', '=')
		->condition('bundle', 'commerce_order', '=');
	$order_id = $query->execute()->fetchField();
	//Select All node of mc_pdf
	$query = db_select('field_data_field_lms_listing_reference', 'lms');
	$query->join('field_data_field_template_reference', 'tr', 'lms.entity_id = tr.entity_id');
	$query->join('field_data_field_pdf_section', 'ps', 'ps.entity_id = tr.field_template_reference_nid');
	$query->fields('lms', array('entity_id'))
		->condition('lms.field_lms_listing_reference_nid', $nid, '=')
		->condition('lms.entity_type', 'node', 'LIKE')
		->condition('lms.bundle', 'mc_pdf', 'LIKE')
		->condition('ps.field_pdf_section_value', 'post card', 'LIKE');
	$result = $query->execute();
	$nids = array();
	
	$approve_pdf = db_select('cbone_listing_approve_pdf', 'apdf');
	$approve_pdf->fields('apdf', array('pnid', 'pdf_section'))
		->condition('apdf.pdf_section', 'post-card', '=')
		->condition('apdf.lnid', $nid, '=');
	$approve_pdf_nids = $approve_pdf->execute()->fetchAll();
	$listed == 0;
	$sold == 0;
	if(!empty($approve_pdf_nids)) {
		foreach($approve_pdf_nids as $approve_pdf_nid) {
			$approve_mcpdf = node_load($approve_pdf_nid->pnid);
			if($approve_mcpdf->field_postcard_type['und']['0']['value'] == 'listed') {
				$listed = 1;
			}
			else if($approve_mcpdf->field_postcard_type['und']['0']['value'] == 'sold') {
				$sold = 1;
			}
		}
		if($listed == 1 && $sold == 0) {
			foreach($result as $value){
				$pdf_node = node_load($value->entity_id);
				if($pdf_node->field_postcard_type['und']['0']['value'] == 'sold') {
					$nids[] = $value->entity_id;
				}
			}
		}
		else if($listed == 0 && $sold == 1){
			foreach($result as $value){
				$pdf_node = node_load($value->entity_id);
				if($pdf_node->field_postcard_type['und']['0']['value'] == 'listed') {
					$nids[] = $value->entity_id;
				}
			}
		}
	}
	else {
		foreach($result as $value){
			$nids[] = $value->entity_id;
		}
	}
	//Listing Address
	$listing_node = node_load($nid);
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
	if(isset($listing_node->field_lms_listing_state['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_listing_state['und']['0']['value'];
	}
	if(isset($listing_node->field_lms_listing_zip['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_listing_zip['und']['0']['value'];
	}
	$listing_address = implode(', ', $address);
		
	$variables = array(
		'listing_nid' => $nid,
		'listing_address' => $listing_address,
		'nids' => $nids,
		'order_id' => $order_id,
	);
	$output = theme('listing_postcard_approval', array('var_name' => $variables));
	return $output;
}
