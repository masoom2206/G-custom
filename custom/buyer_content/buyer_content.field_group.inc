<?php
/**
 * @file
 * buyer_content.field_group.inc
 */

/**
 * Implements hook_field_group_info().
 */
function buyer_content_field_group_info() {
  $export = array();

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_buyer|node|client|form';
  $field_group->group_name = 'group_buyer';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'client';
  $field_group->mode = 'form';
  $field_group->parent_name = 'group_wrapper';
  $field_group->data = array(
    'label' => 'Buyer Information',
    'weight' => '12',
    'children' => array(
      0 => 'field_client_email',
      1 => 'field_buyer_city',
      2 => 'field_buyer_state',
      3 => 'field_buyer_address',
      4 => 'field_buyer_zip',
      5 => 'title',
    ),
    'format_type' => 'htab',
    'format_settings' => array(
      'label' => 'Buyer Information',
      'instance_settings' => array(
        'required_fields' => 1,
        'id' => '',
        'classes' => 'group-buyer field-group-htab',
        'description' => '',
      ),
      'formatter' => 'closed',
    ),
  );
  $export['group_buyer|node|client|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_property|node|client|form';
  $field_group->group_name = 'group_property';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'client';
  $field_group->mode = 'form';
  $field_group->parent_name = 'group_wrapper';
  $field_group->data = array(
    'label' => 'Property',
    'weight' => '13',
    'children' => array(
      0 => 'field_buyer_property_address',
      1 => 'field_buyer_property_photo',
    ),
    'format_type' => 'htab',
    'format_settings' => array(
      'label' => 'Property',
      'instance_settings' => array(
        'required_fields' => 1,
        'id' => '',
        'classes' => 'group-property field-group-htab',
        'description' => '',
      ),
      'formatter' => 'open',
    ),
  );
  $export['group_property|node|client|form'] = $field_group;

  $field_group = new stdClass();
  $field_group->disabled = FALSE; /* Edit this to true to make a default field_group disabled initially */
  $field_group->api_version = 1;
  $field_group->identifier = 'group_wrapper|node|client|form';
  $field_group->group_name = 'group_wrapper';
  $field_group->entity_type = 'node';
  $field_group->bundle = 'client';
  $field_group->mode = 'form';
  $field_group->parent_name = '';
  $field_group->data = array(
    'label' => 'Wrapper',
    'weight' => '0',
    'children' => array(
      0 => 'group_buyer',
      1 => 'group_property',
    ),
    'format_type' => 'htabs',
    'format_settings' => array(
      'formatter' => '',
      'instance_settings' => array(
        'classes' => 'group-wrapper field-group-htabs',
      ),
    ),
  );
  $export['group_wrapper|node|client|form'] = $field_group;

  return $export;
}
