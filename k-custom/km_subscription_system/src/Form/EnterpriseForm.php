<?php

namespace Drupal\km_subscription_system\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class EnterpriseForm.
 */
class EnterpriseForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'enterprise_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['name'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Name'),
      '#maxlength' => 64,
      '#size' => 64,
      '#weight' => '0',
    ];
    $form['company'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Company'),
      '#maxlength' => 64,
      '#size' => 64,
      '#weight' => '1',
    ];
    $form['work_email'] = [
      '#type' => 'email',
      '#title' => $this->t('Work email'),
      '#weight' => '0',
    ];
    $form['phone_number'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Phone number'),
      '#maxlength' => 64,
      '#size' => 64,
      '#weight' => '3',
    ];
    $form['i_need_help_with'] = [
      '#type' => 'textarea',
      '#title' => $this->t('I need help with...'),
      '#weight' => '4',
    ];
    $form['captcha'] = [
      '#type' => 'captcha',
      '#title' => $this->t('captcha'),
      '#weight' => '5',
    ];
    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Submit'),
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    foreach ($form_state->getValues() as $key => $value) {
      // @TODO: Validate fields.
    }
    parent::validateForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Display result.
    foreach ($form_state->getValues() as $key => $value) {
      \Drupal::messenger()->addMessage($key . ': ' . ($key === 'text_format'?$value['value']:$value));
    }
  }

}
