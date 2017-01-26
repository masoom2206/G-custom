<?php
/**
 * @file
 * buyer_content.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function buyer_content_ctools_plugin_api($module = NULL, $api = NULL) {
  if ($module == "field_group" && $api == "field_group") {
    return array("version" => "1");
  }
}

/**
 * Implements hook_node_info().
 */
function buyer_content_node_info() {
  $items = array(
    'client' => array(
      'name' => t('Buyer'),
      'base' => 'node_content',
      'description' => '',
      'has_title' => '1',
      'title_label' => t('Buyer Name'),
      'help' => '',
    ),
  );
  drupal_alter('node_info', $items);
  return $items;
}
