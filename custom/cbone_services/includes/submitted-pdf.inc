<?php
/**
 * @file
 * MC settings Configuration tool
 */

/**
 * Callback function mc_submitted_pdf()
 * to displayed the status of submitted PDF to vendor
 **/
function mc_submitted_pdf(){
	$output = '';
	$header = array(
		array('data' => t('Listing NID'), 'field' => 'lnid', 'width'=>'5%'),
		array('data' => t('PDF NID'), 'field' => 'pnid', 'width'=>'5%'),
		array('data' => t('PDF Section')),
		array('data' => t('Vendor Order ID')),
		array('data' => t('Vendor Order Status')),
		array('data' => t('Vendor Message')),
		array('data' => t('Shipment Tracking')),
		array('data' => t('Order Created'),'field' => 'created', 'width'=>'5%'),
		array('data' => t('Order Confirm'),'field' => 'confirm', 'width'=>'5%'),
		array('data' => t('Order Shipped'),'field' => 'shipped', 'width'=>'5%'),
	);
	
	//Fetch the data from cbone_listing_approve_pdf table
	$user_query = db_select("cbone_listing_approve_pdf", "apdf");
	$user_query->fields("apdf");
	if(isset($_GET['uid']) && $_GET['uid'] != ''){
		$user_query->condition("u.uid", $_GET['uid'], '=');
	}
	$table_sort = $user_query->extend('TableSort')->orderByHeader($header);
	$pager = $table_sort->extend('PagerDefault')->limit(20);
	$result = $pager->execute();

	$rows = array();
	// Looping for filling the table rows
	foreach ($result as $data) {
		$rows[] = array(
				$data->lnid,
				$data->pnid,
				$data->pdf_section,
				$data->vendor_order_id,
				$data->vendor_order_status,
				$data->vendor_message,
				$data->shipment_tracking,
				($data->created != '') ? date("d-m-Y", $data->created) : '--',
				($data->confirm != '') ? date("d-m-Y", $data->confirm) : '--',
				($data->shipped != '') ? date("d-m-Y", $data->shipped) : '--',
			);
	}
	$output .= theme('table',
		array(
			'header' => $header,
			'rows'=> $rows,
			'attributes' => array('class' => array('mc-submitted-pdf')),
			'sticky' => TRUE,
			'empty' => 'No data found!',
			)
		);
	$output .= theme('pager', array('quantity' => 3));
	return $output;
}
