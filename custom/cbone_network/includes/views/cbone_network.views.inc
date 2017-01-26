<?php
// This file must be at percent_complete_meter/includes/views directory.
 
/**
* @file
* Views definitions for percent_complete_meter module.
*/
 
/**
* Implements hook_views_data().
*/
function cbone_network_views_data() {
  $data = array();
  //User primary office filed for view
  $data['node']['user_office'] = array(
    'title' => t('User Office'),
    'help' => t('User Primary Office attached with user profile.'),
    'field' => array(
      'handler' => 'network_handler_field_user_office',
    ),
  );
  //Circle post like count filed for view
  $data['node']['circle_post_like'] = array(
    'title' => t('Circle Post Like'),
    'help' => t('Circle Post Like Count.'),
    'field' => array(
      'handler' => 'network_handler_field_post_like',
    ),
  );
  return $data;
}
