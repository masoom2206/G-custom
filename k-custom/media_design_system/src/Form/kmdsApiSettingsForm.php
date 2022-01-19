<?php

namespace Drupal\media_design_system\Form;

use Drupal\Core\Form\ConfigFormBase;  
use Drupal\Core\Form\FormStateInterface;  

/**
 *  Defines a settings form that configure KMDS API.
 */
class kmdsApiSettingsForm extends ConfigFormBase {
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'kmds_api_settings_form';
  }
  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'media_design_system.kmdsapisettings',
    ];
  }
  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('media_design_system.kmdsapisettings');
		$form['kmds_api'] = [
      '#type' => 'details',
      '#title' => $this->t('KMDS API'),
      '#open' => TRUE,
    ];
    $form['kmds_api']['access_check_api'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Access Check API'),
      '#description' => $this->t('Enter Access check API.'),
      '#default_value' => $config->get('access_check_api'),
			'#required' => TRUE
    ];
    return parent::buildForm($form, $form_state);
  }
  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);
    $values = $form_state->getValues();
    $this->config('media_design_system.kmdsapisettings')
      ->set('access_check_api', $values['access_check_api'])
      ->save();
  }
}