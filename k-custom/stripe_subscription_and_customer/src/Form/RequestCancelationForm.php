<?php

namespace Drupal\stripe_subscription_and_customer\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\CloseModalDialogCommand;
use Drupal\Core\Ajax\RedirectCommand;
/**
 * Class RequestCancelationForm.
 */
class RequestCancelationForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'request_cancelation_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $uid = NULL, $sid = NULL) {
      $conn = \Drupal::database();
      $record = array();
      $query = $conn->select('upgrades_products_cancel_request', 'up')
        ->condition('sub_id', $sid)
        ->fields('up');
      $record = $query->execute()->fetchAssoc();

    $form['#prefix'] = '<div id="ajax_form_multistep_form"><div class="col-sm-12"><h1>Cancel storage upgrade</h1></div><div id="result-message result_message message"></div>';
    $form['#suffix'] = '</div>';
    /*$form['subject'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Subject'),
      '#maxlength' => 128,
      '#size' => 64,
      '#weight' => '0',
    ];*/
    $form['message'] = [
      '#type' => 'Message',
      '#title' => $this->t('Message'),
      '#weight' => '0',
    ];
    $form['message'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Message'),
      '#weight' => '0',
    ];
    $form['uid'] = [
      '#type' => 'hidden',
      '#title' => $this->t('uid'),
      '#weight' => '0',
      '#value' => $uid
    ];
    $form['sid'] = [
      '#type' => 'hidden',
      '#title' => $this->t('Tid'),
      '#weight' => '0',
      '#value' => $sid
    ];
    $form['send_yourself_a_copy'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Send yourself a copy'),
      '#weight' => '0',
    ];
    $form['buttons']['cancel'] = [
      '#type' => 'submit',
      '#value' => t('cancel'),
      '#prefix' => '<div class="d-flex"><div class="step1-button">',
      '#suffix' => '</div>',
      '#limit_validation_errors' => array(),
      '#attributes' => ['class' => ['calbutton']],
      '#ajax' => [
        // We pass in the wrapper we created at the start of the form
        'wrapper' => 'ajax_form_multistep_form',
        // We pass a callback function we will use later to render the form for the user
        'callback' => '::ajax_form_multistep_form_ajax_cancel_addupgrades',
        'event' => 'click',
      ],
    ];
    $form['buttons']['forward'] = [
      '#type' => 'submit',
      '#value' => t('REMOVE PRODUCT'),
      '#prefix' => '<div class="step1-button">',
      '#suffix' => '</div></div>',
      '#attributes' => ['class' => ['subbutton']],
      '#ajax' => [
        // We pass in the wrapper we created at the start of the form
        'wrapper' => 'ajax_form_multistep_form',
        // We pass a callback function we will use later to render the form for the user
        'callback' => '::ajax_form_change_plan_form_ajax_callback_addupgrades',
        'event' => 'click',
      ],
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
    $values = $form_state->getValues();
    if(isset($values['uid'])) {
      $uid = $values['uid'];
      $sid = $values['sid'];
      $des = $values['message'];
      $conn = \Drupal::database();
      $record = [];
      $query = $conn->select('upgrades_products', 'up')
        ->condition('subscription_id', $sid)
        ->fields('up');
      $record = $query->execute()->fetchAssoc();

      $fields = [
        'uid'   =>  $uid,
        'tid' => 1,
        'sub_id' =>  $sid,
        'customer_id' =>  $record['customer_id'],
        'pricing_id' => $record['pricing_id'],
        'status' => 1,
        'description' => $des,
        'created' => time(),
        'updated' => time()
      ];
      $query = \Drupal::database();
      $query ->insert('upgrades_products_cancel_request')
         ->fields($fields)
         ->execute();
    }
    /*foreach ($form_state->getValues() as $key => $value) {
      \Drupal::messenger()->addMessage($key . ': ' . ($key === 'text_format'?$value['value']:$value));
    }*/
  }


  public function ajax_form_change_plan_form_ajax_callback_addupgrades(array &$form, FormStateInterface $form_state) {
    $values = $form_state->getValues();
    $uid = $values['uid'];
    $response = new AjaxResponse();
    $response->addCommand(new CloseModalDialogCommand());
    $response->addCommand(new RedirectCommand('/tools/profile/'.$uid.'/billing'));
    return $response;
  }
  
  public function ajax_form_multistep_form_ajax_cancel_addupgrades(array &$form, FormStateInterface $form_state) {
    $messages = \Drupal::messenger()->deleteAll();
    $response = new AjaxResponse();
    $response->addCommand(new CloseModalDialogCommand());
    return $response;
  }
}
