<?php
// This file must be at percent_complete_meter/includes/views directory.
 
/**
* @file
* Views definitions for percent_complete_meter module.
*/
 
/**
* Implements hook_views_data().
*/
function listing_marketing_system_views_data() {
  $data = array();
  //Marketing Concierge Banner filed for view
  $data['node']['marketing_concierge'] = array(
    'title' => t('Marketing Concierge Banner'),
    'help' => t('Marketing Concierge Banner representing the listing\'s Marketing.'),
    'field' => array(
      'handler' => 'lms_handler_field_marketing_concierge',
    ),
  );
  //Marketing Concierge link filed for view
  $data['node']['marketing_concierge_link'] = array(
    'title' => t('Marketing Concierge Link'),
    'help' => t('Marketing Concierge Link to redirect at product page or order page.'),
    'field' => array(
      'handler' => 'lms_handler_field_marketing_concierge_link',
    ),
  );
  //Marketing Listing Photos count filed for view
  $data['node']['listing_photos_count'] = array(
    'title' => t('Listing Photos Count'),
    'help' => t('Listing uploaded photos count.'),
    'field' => array(
      'handler' => 'lms_handler_field_listing_photos_count',
    ),
  );
  //Marketing Listing videos count filed for view
  $data['node']['listing_videos_count'] = array(
    'title' => t('Listing Videos Count'),
    'help' => t('Listing uploaded videos count.'),
    'field' => array(
      'handler' => 'lms_handler_field_listing_videos_count',
    ),
  );
  //Web Listing path URL  $data['node']['web_listing_path'] = array(    'title' => t('Web Listing Path'),    'help' => t('Web listing path for my-listing.'),    'field' => array(      'handler' => 'lms_handler_field_web_listing_path',    ),  );    //Listing MC Status  $data['node']['listing_mc_status'] = array(    'title' => t('Listing MC Status'),    'help' => t('Listing Marketing Concierge status.'),    'field' => array(      'handler' => 'lms_handler_field_listing_mc_status',    ),  );    return $data;}