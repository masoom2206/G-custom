<?php

namespace Drupal\km_subscription_system\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class MailsettingForm.
 */
class MailsettingForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'km_subscription_system.mailsetting',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'mailsetting_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('km_subscription_system.mailsetting');
    $form['subject'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Subject'),
      '#description' => $this->t('Subscription Mail Subject'),
      '#maxlength' => 128,
      '#size' => 128,
      '#default_value' => $config->get('subject'),
    ];
    $form['mail_body'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Mail Body'),
      '#default_value' => $config->get('mail_body'),
    ];
    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);

    $this->config('km_subscription_system.mailsetting')
      ->set('subject', $form_state->getValue('subject'))
      ->set('mail_body', $form_state->getValue('mail_body'))
      ->save();
  }

}
