<?php
// This file must be at percent_complete_meter/includes/views directory.
 
/**
* @file
* Views definitions for percent_complete_meter module.
*/
 
/**
* Implements hook_views_data().
*/
function percent_complete_meter_views_data() {
  $data = array();
  //percent complete meter filed for view
  $data['node']['tracking_status'] = array(
    'title' => t('Percent complete meter'),
    'help' => t('Displayed percent complete meter of login user for tracking node.'),
    'field' => array(
      'handler' => 'percent_meter_handler_field_tracking_status',
    ),
  );
  //Bookmark Like flag filed for view
  $data['node']['likeflag'] = array(
    'title' => t('Bookmark Like'),
    'help' => t('Bookmark Like Flag Functionality for node.'),
    'field' => array(
      'handler' => 'percent_meter_handler_field_likeflag',
    ),
  );
  //Details Page Like flag filed for view
  $data['node']['like_details_page'] = array(
    'title' => t('Details Page Like'),
    'help' => t('Details Page Like Flag Functionality for node.'),
    'field' => array(
      'handler' => 'percent_meter_handler_details_page_like',
    ),
  );
  //complete_not_complete_img filed for view
  $data['node']['complete_not_complete_img'] = array(
    'title' => t('Displayed complete not complete image'),
    'help' => t('Displayed complete not complete image based on Fav-Completed Class field.'),
    'field' => array(
      'handler' => 'complete_not_complete_img_handler',
    ),
  );  
  return $data;
}
