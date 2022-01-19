<?php

namespace Drupal\aetl\Form;

use \Drupal\media\Entity;
use \Drupal\Core\Form;
use \Drupal\Core\Form\ConfigFormBase;
use \Drupal\core\Form\FormStateInterface;
use \Drupal\Core\Url;
use \Drupal\Core\Link;
use \Drupal\core\Site\Settings;
use \Drupal\core\StreamWrapper\PublicStream;
use \Symfony\Component\HttpFoundation\Request;

/**
 *  Defines a form that configure Amazon Elastic Transcoder and AWS Lambda Settings.
 */
class FieldSettingsForm extends ConfigFormBase {
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'aetl_field_setting_form';
  }
  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'aetl.fieldsettings',
    ];
  }

  public function buildForm(array $form, FormStateInterface $form_state, Request $request = NULL ) {
    $config = $this->config('aetl.fieldsettings');
    $ds = $config->get('convert_field');
    $df = explode(',', $ds);
    // print 'dfd'; exit;
    // I'd like to be able to pull this information directly from the SDK, but
    // I couldn't find a good way to get the human-readable region names.
    // $fieldsArray = MediaType::getFieldMap();
    $fieldsArray = \Drupal::service('entity_field.manager')->getFieldMapByFieldType('file');
    // $fieldsds = $fieldsArray['node'];
    $checboxdata[] = array();
    foreach ($fieldsArray as $keym => $mediadetail) {
      foreach ($mediadetail as $key => $value ) {
        $checboxdata[$keym][$key] = $key;
      }
    }
    $form['node_type'] = array(
      '#type' => 'checkboxes',
      '#options' => $checboxdata['node'],
      '#title' => $this->t('Choice which Node field file need to transcode'),
      '#default_value' => $df,
    );
    $form['media_file'] = array(
      '#type' => 'checkboxes',
      '#options' => $checboxdata['media'],
      '#title' => $this->t('Choice which Meida type field file need to transcode'),
      '#default_value' => $df,
    );
    // $fields = EntityFieldManagerInterface::getFieldMapByFieldType();
    // print_r($fieldsArray); 
    // print "test";  print_r($fieldsds); exit;
    return parent::buildForm($form, $form_state); 
  }
  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $values = $form_state->getValues();
    $setsave = array();
    if(isset($values['node_type'])) {
      foreach ($values['node_type'] as $key => $value) {
        if($value != '0') {
          $setsave[] = $key;
        }
      }
    }
    if(isset($values['media_file'])) {
      foreach ($values['media_file'] as $key => $value) {
      // print_r( $key .'------'. $value.'<br/>');
        if($value != '0') {
          $setsave[] = $key;
        }
      }
    }
    $setdata = implode(',', $setsave);
    $this->config('aetl.fieldsettings')
    ->set('convert_field', $setdata)
    ->save(); 
   // print_r($values); exit;
    parent::submitForm($form, $form_state);
  }
}
