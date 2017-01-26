<?php
// This file must be at percent_complete_meter/includes/views directory.
 
/**
* @file
* Views definitions for percent_complete_meter module.
*/
 
/**
* Implements hook_views_data().
*/
function cbone_flags_views_data() {
  $data = array();
  //User primary office filed for view
  $data['node']['cbone_flag'] = array(
    'title' => t('CB|One Flag'),
    'help' => t('CB|One Step By Step Flag.'),
    'field' => array(
      'handler' => 'cbone_flags_handler_field_flag',
    ),
  );
  $data['node']['listing_pc_meter'] = array(
    'title' => t('Listing Percent Meter'),
    'help' => t('Listing Percent Complete Meter.'),
    'field' => array(
      'handler' => 'cbone_handler_field_listing_pc_meter',
    ),
  );
  //complete_not_complete_img filed for view
  $data['node']['cbone_complete_img'] = array(
    'title' => t('Displayed complete not complete image for CB|One flag'),
    'help' => t('Displayed complete not complete image based on Fav-Completed Class field for CB|One flag.'),
    'field' => array(
      'handler' => 'cbone_complete_img_handler',
    ),
  );  
  return $data;
}
