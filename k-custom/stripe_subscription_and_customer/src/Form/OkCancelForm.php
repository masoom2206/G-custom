<?php

namespace Drupal\stripe_subscription_and_customer\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\CloseModalDialogCommand;
use Drupal\Core\Ajax\RedirectCommand;
use Drupal\Core\Url;

/**
 * Class AbortCancelForm.
 */
class OkCancelForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'ok_cancel_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['#prefix'] = '<div id="ajax_form_multistep_form"><div class="col-sm-12"></div><div id="result-message result_message message"></div>';
    $form['#suffix'] = '</div>';
    $form['markup'] = [
     '#markup' => '<div class="step">Your cancellation request has been sent.</div>'
    ];

    $form['buttons']['cancel'] = [
      '#type' => 'submit',
      '#value' => t('ok'),
      '#prefix' => '<div class="d-flex"><div class="step1-button">',
      '#suffix' => '</div></div>',
      '#limit_validation_errors' => [],
      '#attributes' => ['class' => ['subbutton']],
      '#ajax' => [
        // We pass in the wrapper we created at the start of the form
        'wrapper' => 'ajax_form_multistep_form',
        // We pass a callback function we will use later to render the form for the user
        'callback' => '::ajax_form_multistep_form_ajax_cancel_ok',
        'url' => Url::fromRoute('stripe_subscription_and_customer.ok_cancel_form'),
        'event' => 'click',
      ],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {


  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $messages = \Drupal::messenger()->deleteAll();
    $response = new AjaxResponse();
    $response->addCommand(new CloseModalDialogCommand());
    return $response;
  }
  
  public function ajax_form_multistep_form_ajax_cancel_abort(array &$form, FormStateInterface $form_state) {
    $messages = \Drupal::messenger()->deleteAll();
    $response = new AjaxResponse();
    $response->addCommand(new CloseModalDialogCommand());
    return $response;
  }
  /**
   * @return \Drupal\Core\Ajax\AjaxResponse
   */
  public function ajax_form_multistep_form_ajax_cancel_ok() {
    $command = new CloseModalDialogCommand();
    $response = new AjaxResponse();
    $response->addCommand($command);
    return $response;
  }
}
