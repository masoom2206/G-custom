<?php
/**
 * @file
 * listing_terms.field_group.inc
 */

/**
 * Implements hook_field_group_info().
 */
function listing_terms_field_group_info() {
  $export = array();

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_data_processing|taxonomy_term|feeds|form';
  $field_group->group_name = 'group_data_processing';
  $field_group->entity_type = 'taxonomy_term';
  $field_group->bundle = 'feeds';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Data Processing',
    'weight' => '3',
    'children' => array(
      0 => 'field_local_destination_path',
      1 => 'field_run_time',
      2 => 'field_results_retention',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-data-processing field-group-fieldset',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_data_processing|taxonomy_term|feeds|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_notifications|taxonomy_term|feeds|form';
  $field_group->group_name = 'group_notifications';
  $field_group->entity_type = 'taxonomy_term';
  $field_group->bundle = 'feeds';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Notifications',
    'weight' => '10',
    'children' => array(
      0 => 'field_notification_email',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-notifications field-group-fieldset',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_notifications|taxonomy_term|feeds|form'] = $field_group;

  return $export;
}
