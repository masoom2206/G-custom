<?php

namespace Drupal\media_vault_tool\Form;

use Drupal\Core\Form\ConfigFormBase;  
use Drupal\Core\Form\FormStateInterface;  

/**
 *  Defines a form that configure Media Vault Settings.
 */
class SettingsForm extends ConfigFormBase {
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'media_vault_setting_form';
  }
  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'media_vault_tool.adminsettings',
    ];
  }
  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('media_vault_tool.adminsettings');

    $form['welcome_message'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Welcome message'),
      '#description' => $this->t('Welcome message display to users when they are on Media Value Page'),
      '#default_value' => $config->get('welcome_message'),
    ];
    return parent::buildForm($form, $form_state);
  }
  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);
    $values = $form_state->getValues();
    $this->config('media_vault_tool.adminsettings')
      ->set('welcome_message', $form_state->getValue('welcome_message'))
      ->save();
  }
}