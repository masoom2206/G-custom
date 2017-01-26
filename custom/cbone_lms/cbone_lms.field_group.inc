<?php
/**
 * @file
 * cbone_lms.field_group.inc
 */

/**
 * Implements hook_field_group_info().
 */
function cbone_lms_field_group_info() {
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
  $field_group->identifier = 'group_ids|node|lms_listing|form';
  $field_group->group_name = 'group_ids';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'lms_listing';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Identifiers',
    'weight' => '5',
    'children' => array(
      0 => 'field_lms_agent_uid',
      1 => 'field_lms_agent_id',
      2 => 'field_lms_mls_id',
      3 => 'field_lms_listing_nrt_id',
      4 => 'field_office_ref',
      5 => 'field_lms_metro_id',
      6 => 'field_lms_office_id',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-ids field-group-fieldset',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_ids|node|lms_listing|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_lms_documents|field_collection_item|field_lms_listing_documents|form';
  $field_group->group_name = 'group_lms_documents';
  $field_group->entity_type = 'field_collection_item';
  $field_group->bundle = 'field_lms_listing_documents';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Documents',
    'weight' => '0',
    'children' => array(
      0 => 'field_lms_listing_document',
      1 => 'field_lms_document_type',
      2 => 'field_number_of_pages',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-lms-documents field-group-fieldset',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_lms_documents|field_collection_item|field_lms_listing_documents|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_lms_marketing_concierge|node|lms_listing|form';
  $field_group->group_name = 'group_lms_marketing_concierge';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'lms_listing';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Marketing Concierge',
    'weight' => '17',
    'children' => array(
      0 => 'field_lms_allow_agent_edit',
      1 => 'field_lms_purchase_marketing',
      2 => 'field_lms_marketing_status',
      3 => 'field_lms_marketing_coordinator',
      4 => 'field_lms_product',
      5 => 'field_mc_status_ref',
      6 => 'field_property_web_page_design',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-lms-marketing-concierge field-group-fieldset',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_lms_marketing_concierge|node|lms_listing|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_lms_marketing_copy|node|lms_listing|form';
  $field_group->group_name = 'group_lms_marketing_copy';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'lms_listing';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Marketing Copy',
    'weight' => '15',
    'children' => array(
      0 => 'field_lms_print_copy',
      1 => 'field_lms_online_copy',
      2 => 'field_lms_bullets',
      3 => 'field_lms_short_copy',
      4 => 'field_lms_mls_description',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => '',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_lms_marketing_copy|node|lms_listing|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_lms_open_house_tour|node|lms_listing|form';
  $field_group->group_name = 'group_lms_open_house_tour';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'lms_listing';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Open House Tour Dates',
    'weight' => '16',
    'children' => array(
      0 => 'field_lms_open_house_tour_dates',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-lms-open-house-tour field-group-fieldset',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_lms_open_house_tour|node|lms_listing|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_lms_selling_agent|node|lms_listing|form';
  $field_group->group_name = 'group_lms_selling_agent';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'lms_listing';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Selling Agent',
    'weight' => '19',
    'children' => array(
      0 => 'field_lms_other_agent',
      1 => 'field_lms_sales_team',
      2 => 'field_lms_primary_agent',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-lms-selling-agent field-group-fieldset',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_lms_selling_agent|node|lms_listing|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_location|node|lms_listing|form';
  $field_group->group_name = 'group_location';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'lms_listing';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Location',
    'weight' => '6',
    'children' => array(
      0 => 'field_lms_listing_address',
      1 => 'field_lms_listing_city',
      2 => 'field_lms_listing_state',
      3 => 'field_lms_listing_zip',
      4 => 'field_lms_gps_coordinates',
      5 => 'field_lms_hide_listing_address',
      6 => 'field_lms_address_unit',
    ),
    'format_type' => 'fieldset',
    'format_settings' => array(
      'formatter' => 'collapsible',
      'instance_settings' => array(
        'description' => '',
        'classes' => 'group-location field-group-fieldset',
        'required_fields' => 1,
      ),
    ),
  );
  $export['group_location|node|lms_listing|form'] = $field_group;

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
