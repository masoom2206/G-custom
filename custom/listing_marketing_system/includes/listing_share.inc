<?php
/**
 * Callback function share_nodes()
 * to displayed the shared list of users
 * @return $output
 **/
function share_nodes($nid){
	global $user;
	$output = '';
	$photos = array();
	$x = 0;
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

	$variables = array(
		'listing_address' => $listing_address,
		'listing_nid' => $nid,
		'listing_uid' => $listing_node->uid,
	);
	$output = theme('listing_share', array('var_name' => $variables));
	return $output;
}

/*
form displayed on share page
*/
function agent_field_form($form, &$form_state, $nid, $no_js_use = FALSE) { 
	$arg=$nid;
  // Because we have many fields with the same values, we have to set
  // #tree to be able to access them.
  	//Query to get pdf design nid, display document values
	//Added by nitesh
    $shared_pdf_brochure='';
    $query = db_select('cbone_website_settings', 'cws')
      ->fields('cws', array('shared_lisitng'))
      ->condition('nid', $nid, '=');
    $result = $query->execute()->fetchField();
    if(!empty($result)){
      $shared_pdf_brochure = $result;
    }
  $form['#tree'] = TRUE;
  $form['names_fieldset'] = array(
    '#type' => 'fieldset',
	'#title'=>'SHARE LISTING WITH',
    '#autocomplete_path' => 'agents/autocomplete/'.$arg,
	'#required'=>TRUE,
    '#prefix' => '<div id="names-fieldset-wrapper">',
    '#suffix' => '</div>',
  );

  // Build the fieldset with the proper number of names. We'll use
  // $form_state['num_names'] to determine the number of textfields to build.
  if (empty($form_state['num_names'])) {
    $form_state['num_names'] = 1;
  }
  for ($i = 0; $i < $form_state['num_names']; $i++) {
    $form['names_fieldset']['name'][$i] = array(
      '#type' => 'textfield',
       '#autocomplete_path' => 'agents/autocomplete/'.$arg,
	   '#required'=>TRUE,
       
    );
  }
  /*$form['names_fieldset']['add_name'] = array(
    '#type' => 'submit',
    '#value' => t('Add another Item'),
    '#submit' => array('agent_field_form_add_more_add_one'),
    '#ajax' => array(
      'callback' => 'agent_field_form_add_more_callback',
      'wrapper' => 'names-fieldset-wrapper',
    ),
	'#prefix' => '<div id="add-more-items">',
    '#suffix' => '</div>',
  );
  if ($form_state['num_names'] > 1) {
    $form['names_fieldset']['remove_name'] = array(
      '#type' => 'submit',
      '#value' => t('Remove last Item'),
      '#submit' => array('agent_field_form_add_more_remove_one'),
      '#ajax' => array(
        'callback' => 'agent_field_form_add_more_callback',
        'wrapper' => 'names-fieldset-wrapper',
      ),
	  '#prefix' => '<div id="remove-more-items">',
		'#suffix' => '</div>',
    );
  }*/
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Add Agent'),
	'#prefix' => '<div id="agent_submit">',
	'#suffix' => '</div>',
	'#attributes' => array("brochure_id" => $shared_pdf_brochure),
  );

  // For demonstration only! You don't need this.
  if ($no_js_use) {
    if (!empty($form['names_fieldset']['remove_name']['#ajax'])) {
      unset($form['names_fieldset']['remove_name']['#ajax']);
    }
    unset($form['names_fieldset']['add_name']['#ajax']);
  }
  return $form;
}

/*Ajax call back to add more element*/
function agent_field_form_add_more_callback($form, $form_state) {
  return $form['names_fieldset'];
}

/*Ajax call back to remove one element*/
function agent_field_form_add_more_remove_one($form, &$form_state) {
  if ($form_state['num_names'] > 1) {
    $form_state['num_names']--;
  }
  $form_state['rebuild'] = TRUE;
}

/*Ajax call back to add one element*/
function agent_field_form_add_more_add_one($form, &$form_state) {
  $form_state['num_names']++;
  $form_state['rebuild'] = TRUE;
}

/*
submit function for form on share page
*/
function agent_field_form_submit($form, &$form_state){
	$nid=arg(1);
	$node = node_load($nid);
	$listing_user = user_load($node->uid);
	if(!empty($listing_user->field_preferred_name) && isset($listing_user->field_preferred_name) ){
		$listing_user_name = $listing_user->field_preferred_name['und'][0]['value'];
	}
	else {
		$listing_user_name = "Agent";
	}
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
		
	if( !empty($node->field_lms_shared_agent) && isset($node->field_lms_shared_agent) ){
		$user_count=count($node->field_lms_shared_agent['und']);
	}
	else{
		$user_count=0;
	}
	$uids = $form_state['values']['names_fieldset']['name'];
	$i=$user_count;
	foreach($uids as $values){
		$pos = strpos($values, ":");
		$uid = intval(substr($values, $pos+1));
		$user=user_load($uid);
		if(!empty($user->field_firstname) && isset($user->field_firstname) ){
			$name= $user->field_firstname['und'][0]['value'];
		}
		else{
				$name= 'Agent';
		}
		
		$node->field_lms_shared_agent['und'][$i]['uid'] = $uid;
		
		if($nodes=node_submit($node)){
			$node_update=node_save($node);
		
			$site_email = variable_get('site_mail', '');
			$mailto = $user->mail;
			$subject = 'You Have Received a Shared Listing on CB|ONE';
			$header = "From: CB|One <$site_email>\r\n";
			$header .= "Reply-To: $site_email\r\n";
			$header .= "MIME-Version: 1.0\r\n";
			$header .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
			//Mail Message
			//$message = "Dear <br/>".$name."<br/>";
			$message = "Good news! $listing_user_name has shared his/her listing with you via CB|ONE. You may now log into CB|ONE select \"My Dashboard\" and scroll down to \"Shared Listings\" to access the shared property flyer with your contact information embedded.<br/><br/>Thank you and good luck with this listing.<br/><br/>";
			$message .= "Sincerely,<br/><br/>The Coldwell Banker Team<br/><br/>";
			$mail = mail($mailto, $subject, $message, $header);		
		}
		else{
			}
			$i++;
	}
}

/*
agent remove form displayed on share page
*/

function agent_list_remove_form($form = array(), &$form_state) {
	$arg=arg(1);
	$node=node_load($arg);
	$form = array();
	$header = array(
		'subject' => array('data' => t('Agent List')),
		'createpdf' => array('data' => t('')),
	);
	
	$query = db_select('field_data_field_lms_shared_agent', 'lsa')->extend('PagerDefault')->extend('TableSort');
	$result = $query
		->fields('lsa', array('field_lms_shared_agent_uid'))
		->condition('entity_id', $node->nid, '=')
		->limit(20)
		->execute();
	
	$uids = array();
	foreach ($result as $row) {
		$uids[] = $row->field_lms_shared_agent_uid;
	}
	$users = user_load_multiple($uids);
	 
	$options = array();
	$destination = drupal_get_destination();
	
	$query = db_select('cbone_website_settings', 'cws')
			->fields('cws', array('shared_lisitng'))
			->condition('nid', $arg, '=');
	$shared_pdf_brochure = $query->execute()->fetchField();
	if(!empty($shared_pdf_brochure)){
		$nid2 = $shared_pdf_brochure;
		$mcpdf_id_pdf = get_mcpdf_nid($arg, $nid2);
		$mcpdf_node = node_load($mcpdf_id_pdf);
	}
	$filename = array();
	foreach ($users as $shared_user) {
		$text = '';
		if(isset($mcpdf_node->field_shared_listing_pdf['und'])){
			foreach( $mcpdf_node->field_shared_listing_pdf['und'] as $key=>$value){
				$filename[] = $mcpdf_node->field_shared_listing_pdf['und'][$key]['filename'];
			}
			$pdf_file = 'shared-listing'.'-'.$arg.'-'.$shared_user->uid.'.pdf';
			if( in_array($pdf_file, $filename) ){
					$text = 'Update PDF';
			}
			else{
				$text = 'Create PDF';
			}
		}
		else{
			$text = 'Create PDF';
		}
				
		$options[$shared_user->uid] = array(
			'subject' => $shared_user->field_preferred_name['und'][0]['value'],
			'createpdf' => '<button class="shared_pdf_generation btn btn-primary "id="'.$shared_user->uid.'" listing_nid="'.$node->nid.'" value="'.$text.'">'.$text.'</button>',
		);
	}
	$form['wrapper'] = array(
		'#markup' => '<div>Agents this listing is currently shared with</div>',
	);
	$form['nid'] = array(
		'#type' => 'hidden',
		'#title' => t(''),
	);
	$form['uid'] = array(
		'#type' => 'hidden',
		'#title' => t(''),
	);
	$form['agents_list'] = array(
		'#type' => 'tableselect',
		'#header' => $header,
		'#options' => $options,
		'#empty' => t('No agents shared.'),
	);
	$form['pager'] = array('#theme' => 'pager');
	$form['rmsubmit'] = array(
		'#type' => 'submit',
		'#value' => t('Remove Agent(s)'),
	);
	
	if (!isset($form_state['storage']['confirm'])) {
		return $form;
	}
	else
	{	
		$path = current_path();
		$uids=  $form_state['values']['agents_list'];
		$remove = array(0);
		$result = array_diff($uids, $remove); 
		if(isset($form_state['values']['nid']) && !empty($form_state['values']['nid']) ){
			unset($form_state['values']['agents_list']);
		}
		else if(!empty($result) && isset($result)){
			unset($form_state['values']['nid']);
			$users_list='<div>Are you sure you wish to "Un-Share" this listing with</div><ul>';
			foreach ($result as $uid){
				 if($uid !=0){
					$user_load=user_load($uid);
					$users_list.='<li>'.$user_load->field_preferred_name['und'][0]['value'].'</li>';
				 }
			}
			$users_list.='</ul>';
			return confirm_form(
				array(),
				'Are you sure you wish to "Un-Share" this listing with',
				$path,
				$users_list,
				'Yes',
				'Cancel'
			);
		}
		else{
			drupal_set_message("No agent is selected to Un-Share. Please select any agent to remove.");
			drupal_goto($path);
		}	
	}
}

function agent_field_remove_value_form_submit($form, &$form_state){
	global $base_url;
	$uid = $form_state['values']['uid'];
	$nid = $form_state['values']['nid'];
	
	$node=node_load($nid);
	// Remove tag with taxonomy id 8
	foreach($node->field_lms_shared_agent[$node->language] as $index => $tag) {
		if($tag['uid'] == $uid) {
			unset($node->field_lms_shared_agent[$node->language][$index]);
		}
	}
	$node_submit= node_submit($node);
	if($node_submit){
		node_save($node);
	}
}

function agent_list_remove_form_submit($form, &$form_state){
	global $base_url;
	$arg=arg(1);
	$node=node_load($arg);
	if (!isset($form_state['storage']['confirm']) ) {
		if( isset($form_state['values']['nid']) && !isset($form_state['storage']['original_form']['agents_list']) && !empty($form_state['values']['nid']) ){
			$nid1 = $form_state['values']['nid'];
			$uid = $form_state['values']['uid'];	
			//Query to get pdf design nid, display document values
			$query = db_select('cbone_website_settings', 'cws')
				->fields('cws', array('shared_lisitng'))
				->condition('nid', $nid1, '=');
			$shared_pdf_brochure = $query->execute()->fetchField();
			if(!empty($shared_pdf_brochure)){
				$nid2 = $shared_pdf_brochure;
				$mcpdf_id_pdf = get_mcpdf_nid($nid1, $nid2);
				cbone_delete_mcpdf_images($mcpdf_id_pdf);
				cbone_delete_mcpdf_agent_images($mcpdf_id_pdf);
				$mcpdf_node = node_load($mcpdf_id_pdf);
				$mcpdf_node->field_shared_agent_uid['und']['0']['uid'] = $uid;//shared agent uid
				node_save($mcpdf_node);
				mcpdf_agent_image($nid1, $mcpdf_id_pdf); // shared agent picture
				
				$mcpdf_node = node_load($mcpdf_id_pdf);
				if(isset($mcpdf_node->field_shared_listing_pdf['und'])){
					foreach( $mcpdf_node->field_shared_listing_pdf['und'] as $key=>$value){
						if($mcpdf_node->field_shared_listing_pdf['und'][$key]['filename'] == 'shared-listing'.'-'.$nid1.'-'.$uid.'.pdf'){
							$pfile = file_load($mcpdf_node->field_shared_listing_pdf['und'][$key]['fid']);
							if(is_object($pfile)){
								unset($mcpdf_node->field_shared_listing_pdf['und'][$key]);
								file_delete($pfile);
							}
						}
					}
				}
				$pdf_nid1 = $nid1;
				$pdf_nid2 = $nid2;
				
				$photosquery= db_select('cbone_selected_photos', 'cs')
						->fields('cs', array('selected_photos_fid'))
						->condition('listing_id', $pdf_nid1, '=')
						->condition('pdf_design_id', $pdf_nid2, '=');
				$photosresult = $photosquery->execute()->fetchField();
				$photosresultarray = unserialize($photosresult); 
					
				$node_update = node_load($mcpdf_id_pdf);
				if(!empty($photosresultarray)){
					mcpdf_image($pdf_nid1, $mcpdf_id_pdf, $photosresultarray);
				}
				//$url = $base_url.'/shared-listing/'.$uid.'/'.$pdf_nid1.'/'.$pdf_nid2; 
				$url = $base_url.'/shared-listing/'.$pdf_nid1.'/'.$pdf_nid2; 
				$headers = array();
				// Add cookie so that we can use the same access as the logged in user, if present.
				$headers = array(
				  'Cookie' => $_SERVER['HTTP_COOKIE'],
				);
				// Fetch the content
				$response = drupal_http_request($url, array('timeout' => 600, 'headers' => $headers));
				if(isset($response->data)){
					$data = $response->data;
				  
					$temp_folder = 'public://lms/'.$pdf_nid1.'/pdf/';
					file_prepare_directory($temp_folder, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);
					$filename = $temp_folder.'shared-listing'.'-'.$nid1.'-'.$uid.".pdf";
					$realpath = drupal_realpath($filename);
					$fp = fopen($realpath, "w");
					fwrite($fp, $data);
					fclose($fp);
					$shared_pdf_size =  filesize($realpath);
					if($shared_pdf_size > 2048){
						$pdf_node = node_load($mcpdf_id_pdf);

						$file = (object)array(
							'uid' => $pdf_node->uid,
							'filename' => 'shared-listing'.'-'.$nid1.'-'.$uid.".pdf",
							'uri' => $filename,
							'filemime' => file_get_mimetype($filename),
							'status' => 1,
							'display' => 1,
						);
						if ($file = file_move($file, $filename, $replace = FILE_EXISTS_RENAME)) {
							$pdf_node->field_shared_listing_pdf['und'][] = (array)$file;
						}
						node_save($pdf_node);
						drupal_set_message('Shared PDF has been created for the Shared agent.');
						$real_path_temp_folder = drupal_realpath($temp_folder);
						$cmd = "rm $real_path_temp_folder 2>&1";
						exec($cmd, $op);
						
						cbone_delete_mcpdf_images($mcpdf_id_pdf);
						cbone_delete_mcpdf_agent_images($mcpdf_id_pdf);
						$node_load = node_load($mcpdf_id_pdf);
					}
					else{
						watchdog('PDF filesize', 'We\'re sorry. An error occurred when building this PDF. Please try again or call the NRT Help Desk at 1.877.678.4357.', array('@tomorrow' => 'tomorrow'), WATCHDOG_ERROR);
						drupal_set_message('We\'re sorry. An error occurred when building this PDF. Please try again or call the NRT Help Desk at 1.877.678.4357.', 'error');
					}
				}
				else{
					 drupal_set_message('An error has occured '.$response->error.' while creating PDF', 'error');
				}
			}
			else {
				 drupal_set_message('Shared PDF for the listing is not selected.', 'error');
			}
		}
		else{
			$form_state['storage']['confirm'] = TRUE;
		$form_state['storage']['original_form'] = $form_state['values'];
		$form_state['rebuild'] = TRUE;
		}
	}
	else if(isset($form_state['storage']['original_form']['agents_list'])){
		$uids=$form_state['storage']['original_form']['agents_list'];
		foreach($uids as $uid){
			foreach($node->field_lms_shared_agent[$node->language] as $index => $tag) {
				if($tag['uid'] == $uid) {
					unset($node->field_lms_shared_agent[$node->language][$index]);
				}
			}
		}
		$node_submit= node_submit($node);
		if($node_submit){
			node_save($node);
		}
		$query = db_select('cbone_website_settings', 'cws')
			->fields('cws', array('shared_lisitng'))
			->condition('nid', $arg, '=');
		$shared_pdf_brochure = $query->execute()->fetchField();
		if(!empty($shared_pdf_brochure)){
			$nid2 = $shared_pdf_brochure;
			$mcpdf_id_pdf = get_mcpdf_nid($arg, $nid2);
			
			$mcpdf_node = node_load($mcpdf_id_pdf);
			foreach($uids as $uid){
				if(isset($mcpdf_node->field_shared_listing_pdf['und'])){
					foreach( $mcpdf_node->field_shared_listing_pdf['und'] as $key=>$value){
						if($mcpdf_node->field_shared_listing_pdf['und'][$key]['filename'] == 'shared-listing'.'-'.$arg.'-'.$uid.'.pdf'){
							$pfile = file_load($mcpdf_node->field_shared_listing_pdf['und'][$key]['fid']);
							if(is_object($pfile)){
								unset($mcpdf_node->field_shared_listing_pdf['und'][$key]);
								file_delete($pfile);
							}
						}
					}
				}
			}
			node_save($mcpdf_node);
			drupal_set_message("Agent removed successfully");		
		}
	}
	else{
		drupal_set_message("Please select at least one action to perform.");
	}
}