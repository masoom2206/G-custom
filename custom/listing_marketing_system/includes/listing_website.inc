<?php
/**
 * Callback function cbone_listing_website()
 * to displayed the listing website setup
 * @return $output
 **/
function cbone_listing_website($nid){
	global $user;
	$output = '';
	$listing_node = node_load($nid);
	//Listing Address
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
		
	$urlAlias = db_query("SELECT alias FROM url_alias WHERE source = :source ORDER BY pid DESC LIMIT 0, 1", array(':source'=> "node/".$nid))->fetchField();	
	//print $urlAlias;exit;
	$product_title = '';
	$order_id = db_select("field_data_field_lms_listing_reference", 'lr');
	$order_id->fields('lr', array('entity_id'));
	$order_id->condition('lr.entity_type', 'commerce_order', 'LIKE');
	$order_id->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$result = $order_id->execute()->fetchField();
	if($result != NULL){
		$order = commerce_order_load($result);
		$line_item = commerce_line_item_load($order->commerce_line_items['und']['0']['line_item_id']);
		$product = commerce_product_load($line_item->commerce_product['und']['0']['product_id']);
		if($product->sku != 'LMS-04') {
			$product_title = $product->title;
		}
	}
	$web_active = db_select("cbone_website_settings", 'ws');
	$web_active->fields('ws', array('web_page_active'));
	$web_active->condition('ws.nid', $nid, '=');
	$active = $web_active->execute()->fetchField();
	
	$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
		'listing_uid' => $listing_node->uid,
		'urlAlias' => $urlAlias,
		'product' => $product_title,
		'active' => $active,
		'nid' => $nid,
	);
	$output = theme('listing_website', array('var_name' => $variables));
	return $output;
}
/**
 * Callback function cbone_save_website_settings()
 * to save Website Settings for listing
 * @return false
 **/
function cbone_save_website_settings(){
	//print "<pre>";print_r($_POST);exit;
	global $user;
	$web_page_active = 0;
	$pdf_brochure = 0;
	$display_documents = 0;
	$background_music = 0;
	if(isset($_POST['url'])) {
		$url_alias = $_POST['url'];
		$alias = db_select("url_alias", 'urla');
		$alias->fields('urla', array('pid'));
		$alias->condition('urla.alias', $url_alias, '=');
		$num_of_results = $alias->execute()->rowCount();
		
		$source = 'node/'.$_POST['nid'];
		$source_query = db_select("url_alias", 'urla');
		$source_query->fields('urla', array('pid'));
		$source_query->condition('urla.alias', $url_alias, '=');
		$source_query->condition('urla.source', $source, '=');
		$num_of_source = $source_query->execute()->rowCount();
        
	}
	if($num_of_source == 0 && $num_of_results > 0) {
		if($num_of_results > 0) {
			print 'alias exists'; 
		}
	}
	else if(is_array($_POST['data']) && $_POST['nid'] != '' && is_numeric($_POST['nid'])) {
		$data = $_POST['data'];
		$nid = $_POST['nid'];
		$listing_node = node_load($nid);
		$url = $_POST['url'];
		foreach($data as $value) {
			if(is_numeric($value)) {
				$design = $value;
			}
			else {
				$$value = 1;
			}
		}
		if($background_music == 1) {
			$background_music = $_POST['mp3'];
		}
		$id = db_merge('cbone_website_settings')
		  ->key(array('nid' => $nid))
		  ->fields(array(
						'nid' => $nid,
						'uid' => $user->uid,
						'web_page_active' => $web_page_active,
						'web_page_url' => $url,
						'pdf_brochure' => $pdf_brochure,
						'display_documents' => $display_documents,
						'background_music' => $background_music,
						'design' => $design,
						'timestamp' => REQUEST_TIME,
				  ))
		  ->execute();
		if($id) {
			$source = 'node/'.$nid;
			if(module_load_include('inc','pathauto','pathauto') !== FALSE) {
				if (function_exists('pathauto_cleanstring')) {
					$currnt_page_title_alias = pathauto_cleanstring($url);
				}
				else {
					$url =  strtolower($url);
					$url =  str_replace('&','',strtolower($url));
					$url =  str_replace(' ','-',strtolower($url));
					$url =  str_replace('--','-',strtolower($url));
					$currnt_page_title_alias = $url; 
				}
			}
			db_delete('url_alias')
				->condition('source', $source)
				->execute();
			// check if url exist
			$newsAlias =  get_custom_url_alias($currnt_page_title_alias);
			$newsAlias2 =  'branded/'.$newsAlias;
			$newsAlias3 =  'unbranded/'.$newsAlias;
			if(!empty($newsAlias)) {
				db_insert('url_alias')
					->fields(array(
						'source' => $source,
						'alias' => $newsAlias3,
						'language' => 'und',
					))
					->execute();
				db_insert('url_alias')
					->fields(array(
						'source' => $source,
						'alias' => $newsAlias2,
						'language' => 'und',
					))
					->execute();
				db_insert('url_alias')
					->fields(array(
						'source' => $source,
						'alias' => $newsAlias,
						'language' => 'und',
					))
					->execute();
				pathauto_persist_entity_state_save('node', $listing_node, 0);
			}
			print 'done';
		}
		else {
			print 'not-done';
		}
	}
	else {
	   print 'not-done';
	}
}
/**
 * Callback function get_custom_url_alias()
 * for check url exist for any node alias
 * and return unique URL alias
 * @return $newAlias
 **/
function get_custom_url_alias($custom_alias){
	$i = 0;
	do {
		if($i==0){ 
			$newAlias = $custom_alias;
			$query = db_query("SELECT pid FROM url_alias WHERE alias =:alias", array(':alias'=>$newAlias));
		}
		else{
			$newAlias =  $custom_alias."-".$i;
			$query = db_query("SELECT pid FROM url_alias WHERE alias =:alias", array(':alias'=>$newAlias));
		}
		if ($query->rowCount() == 0) {
			break;
		}
		$i++;
	} while ($i > 0);
	return $newAlias;
}