<?php
/**
 * @file
 * cbone_lms.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function cbone_lms_ctools_plugin_api($module = NULL, $api = NULL) {
  if ($module == "field_group" && $api == "field_group") {
    return array("version" => "1");
  }
}

/**
 * Implements hook_node_info().
 */
function cbone_lms_node_info() {
  $items = array(
    'lms_listing' => array(
      'name' => t('LMS Listing'),
      'base' => 'node_content',
      'description' => t('Section 1: Listing Details Content Type'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'lms_listing_document' => array(
      'name' => t('LMS Listing Document'),
      'base' => 'node_content',
      'description' => t('Listing Documents Content Type'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'lms_photos' => array(
      'name' => t('LMS Listing Photos'),
      'base' => 'node_content',
      'description' => t('LMS Listing Photos'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'lms_sales_team' => array(
      'name' => t('LMS Sales Team'),
      'base' => 'node_content',
      'description' => '',
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'lms_video' => array(
      'name' => t('LMS Listing video'),
      'base' => 'node_content',
      'description' => t('LMS Listing video, Embedded media field'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'marketing_concierge' => array(
      'name' => t('Marketing Concierge'),
      'base' => 'node_content',
      'description' => t('The Concierge mode requires the purchase of a marketing package via the Commerce module whereby the agent will pay to have a corporate Marketing Coordinator assigned to perform the listing marketing tasks on behalf of the agent.'),
      'has_title' => '1',
      'title_label' => t('Title'),
      'help' => '',
    ),
    'office_group' => array(
      'name' => t('Office Group'),
      'base' => 'node_content',
      'description' => t('Use this content type to create office groups and office home pages.'),
      'has_title' => '1',
      'title_label' => t('Office Name'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
