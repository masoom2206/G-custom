<?php
// This file must be at region_filter/includes/views directory.
 
/**
* @file
* Views definitions for region_filter module.
*/
 
/**
* Implements hook_views_data().
*/
function region_filter_views_data() {
  $data = array();
  //region filter filed for view
  $data['node']['region_filter'] = array(
    'title' => t('Node region filter'),
    'help' => t('Node region filter by login user.'),
    'filter' => array(
      'handler' => 'region_handler_filter_node_region',
    ),
  );
  return $data;
}
