<?php
/**
 * @file
 * CB|ONE Configuration functions
 */

/**
 * Callback function cbone_dynamic_front_pages for admin
 * to configure the dynamic front pages.
 **/
function cbone_dynamic_front_pages(){
	global $user;
	$output = '';
	$search_form = drupal_get_form('dynamic_front_page_search_form');
	$output .= drupal_render($search_form);
	$header = array(
		array('data' => t('Node id'), 'width'=>'10%'),
		array('data' => t('Dynamic Front Page Title'), 'width'=>'25%'),
		array('data' => t('Regions'), 'width'=>'15%'),
		array('data' => t('Path'), 'width'=>'10%'),
		array('data' => t('Hashtag'), 'width'=>'30%'),
		array('data' => t('Action'), 'width'=>'10%'),
	);
	//Select saved percent_tracking
	$query = db_select("node", "n");
	$query->fields("n");
	$query->condition("n.type", 'front_page', '=');
	$query->condition("n.status", 1, '=');
	if(isset($_GET['title']) && $_GET['title'] != '') {
		$query->condition('n.title', '%'.$_GET['title'].'%', 'LIKE');
	}
	if(isset($_GET['region']) && is_array($_GET['region'])  && !isset($_GET['region']['All'])) {
		$region = array_keys($_GET['region']);
		$query->join('field_data_field_region', 'fr', 'fr.entity_id = n.nid');
		$query->condition('fr.field_region_tid', $region, 'IN');
	}
	$result = $query->execute();
	$rows = array();
	while($data = $result->fetchObject()){
		$node_details = node_load($data->nid);
		$regions = array();
		foreach($node_details->field_region['und'] as $field_region){
			$region_term = taxonomy_term_load($field_region['tid']);
			$regions[] = $region_term->name;
		}
		$rows[] = array(
			$node_details->nid,
			l($node_details->title, 'node/'.$node_details->nid),
			implode('<br/>', $regions),
			'/node/'.$node_details->nid,
			isset($node_details->field_front_page_hashtag['und']['0']['value']) ? $node_details->field_front_page_hashtag['und']['0']['value'] : '',
			l(t('View'), 'node/'.$node_details->nid).'&nbsp;|&nbsp;'.l(t('Edit'), 'node/'.$node_details->nid.'/edit', array('query' => array('destination' => 'admin/config/cbone/home'))).'&nbsp;|&nbsp;'.l(t('Delete'), 'node/'.$node_details->nid.'/delete', array('query' => array('destination' => 'admin/config/cbone/home'))),
		);
	}
	$output .= '<p class="add-multi-section"><a href="/node/add/front-page?destination=admin/config/cbone/home"><span>+</span> Add Front Page</a></p>';
	$output .= theme('table',
		array(
			'header' => $header,
			'rows'=> $rows,
			'attributes' => array('class' => array('multi-section')),
			'sticky' => TRUE,
			'empty' => 'No result found!',
			)
		);
	$output .= theme('pager', array('quantity' => 3));
	return $output;
}
/**
 * Form API for Task search
 **/
function dynamic_front_page_search_form($form, &$form_state) {
	$form['#attributes'] = array('class' => 'admin-search-form');
	$form['title'] = array(
		'#type' => 'textfield', 
		'#title' => t('Front page title'), 
		'#default_value' => isset($_GET['title']) ? $_GET['title'] : '',
		'#size' => 30, 
		'#maxlength' => 128,
		'#required' => FALSE,
		//'#autocomplete_path' => 'tasks/autocomplete',
	);
	$options = array('All' => t('All'));
	$options += taxonomy_allowed_values(field_info_field('field_region'));
	$form['region'] = array(
		'#type' => 'select',
		'#title' => t('Region'),
		//'#options' => taxonomy_allowed_values(field_info_field('field_region')),
		'#options' => $options,
		'#multiple' => true,
		'#default_value' => isset($_GET['region']) ? $_GET['region'] : 'All',
	);
	$form['submit'] = array(
		'#type' => 'submit',
		'#value' => t('Apply'),
		'#prefix' => '<div class="form-item search-submit">',
		'#suffix' => '</div>', 
	);
	return $form;
}
/**
 * Drupal form API
 * submit projct filter form
 */
function dynamic_front_page_search_form_submit($form, &$form_state) {
	$values = $form_state['values'];
	$url = 'admin/config/cbone/home';
	drupal_goto($url, array('query' => array(
		'title' => $values['title'],
		'region' => $values['region'],
	)));
}
