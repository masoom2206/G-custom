<?php
// cbone_services.inc
/**
 * Callback for get the pro brochures PDF.
 *
 * @param int $nid
 * @return object
 */
function _pro_brochures_retrieve($lnid, $pnid, $auth) {
	return cbone_get_brochures_pdf($lnid, $pnid);
}
/**
 * Callback for get the postcards PDF.
 *
 * @param int $nid
 * @return object
 */
function _postcards_retrieve($lnid, $pnid, $auth) {
	return cbone_get_postcards_pdf($lnid, $pnid);
}

/**
 * Access callback cbone_services_access.
 * to allow the cbone services access to print vender
 */
function cbone_services_access($lnid, $pnid, $auth) {
	$return = FALSE;
	$default_vendor = variable_get('mc_print_vendor', '0');
	$vendor_detail = node_load($default_vendor);
	$vender_auth = $vendor_detail->field_secret_key['und']['0']['value'];
	//$auth = arg(4);
	if($vender_auth == $auth) {
		$return = TRUE;
	}
	return $return;
}
