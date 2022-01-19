<?php

namespace Drupal\stripe_subscription_and_customer\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class AdminConfigurationForm.
 */
class AdminConfigurationForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'stripe_subscription_and_customer.adminconfiguration',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'admin_configuration_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('stripe_subscription_and_customer.adminconfiguration');
    $form['status'] = [
      '#type' => 'radios',
      '#title' => $this->t('Status'),
      '#options' => ['Test' => $this->t('Test'), 'Live' => $this->t('Live')],
      '#default_value' => $config->get('status'),
    ];
    $form['mail_tid'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Subscription Mail Term ID'),
      '#default_value' => $config->get('mail_tid'),
    ];
    $form['mail_tid_notify'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Trail will end Subscription Mail Term ID'),
      '#default_value' => $config->get('mail_tid_notify'),
    ];
    $form['mail_tid_update'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Update on Subscription Mail Term ID'),
      '#default_value' => $config->get('mail_tid_update'),
    ];
    $form['mail_tid_failed'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Stripe set to retry payment processing on payment fail mail Term ID'),
      '#default_value' => $config->get('mail_tid_failed'),
    ];
    $form['mail_tid_failed_cancel'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Subscription cancelation by Stripe for non-payment mail Term ID'),
      '#default_value' => $config->get('mail_tid_failed_cancel'),
    ];
    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);

    $this->config('stripe_subscription_and_customer.adminconfiguration')
      ->set('status', $form_state->getValue('status'))
      ->set('mail_tid', $form_state->getValue('mail_tid'))
      ->set('mail_tid_notify', $form_state->getValue('mail_tid_notify'))
      ->set('mail_tid_update', $form_state->getValue('mail_tid_update'))
      ->set('mail_tid_failed', $form_state->getValue('mail_tid_failed'))
      ->set('mail_tid_failed_cancel', $form_state->getValue('mail_tid_failed_cancel'))
      ->save();
  }

}
