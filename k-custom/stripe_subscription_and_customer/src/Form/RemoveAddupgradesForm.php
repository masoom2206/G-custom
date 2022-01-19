<?php

namespace Drupal\stripe_subscription_and_customer\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\CloseModalDialogCommand;
use Drupal\Core\Ajax\RedirectCommand;
/**
 * Class RemoveAddupgradesForm.
 */
class RemoveAddupgradesForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'remove_addupgrades_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $uid = NULL, $sub_id = NULL) {
    $form['#prefix'] = '<div id="ajax_form_multistep_form"><div class="col-sm-12"><h1>REMOVE 100 GB Media Vault Add\'l Storage</h1></div><div id="result-message result_message message"></div>';
    $form['#suffix'] = '</div>';
    $form['markup'] = [
     '#markup' => '<div class="step">Are you sure you want to remove this item? Some functionality or capacity may be lost. The feature will remain in effect until your next billing date.</div>'
    ];
    $form['uid'] = [
      '#type' => 'hidden',
      '#value' => $uid,
      '#weight' => '0',
    ];
    $form['sub_id'] = [
      '#type' => 'hidden',
      '#value' => $sub_id,
      '#weight' => '0',
    ];
    $form['buttons']['cancel'] = [
      '#type' => 'submit',
      '#value' => t('cancel'),
      '#prefix' => '<div class="d-flex">',
      '#suffix' => '',
      '#limit_validation_errors' => [],
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
      '#prefix' => '',
      '#suffix' => '</div>',
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
    /*foreach ($form_state->getValues() as $key => $value) {
      // @TODO: Validate fields.
    }
    parent::validateForm($form, $form_state);*/
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Display result.
    $values = $form_state->getValues();
    if(isset($values['uid'])) {
      $uid = $values['uid'];
      $account = \Drupal\user\Entity\User::load($uid);
      $customer_id = $account->get('stripe_customer_id')->value;
      if (isset($customer_id) && !empty($customer_id)) {
        $subitem_id = $values['sub_id'];
      }
      try {
        \Drupal::service('stripe_subscription_and_customer.stripe_api')->removeaddstorageSubscription($subitem_id);
        $user =  \Drupal\user\Entity\User::load($uid);
        $user->set('field_addition_data_subscription', '');
        //Save user account
        $user->save();
        $connection = \Drupal::database();
        $connection->merge('upgrades_products')
          ->updateFields([
            'status' => 2,
          ])
          ->key(['sub_id' => $subitem_id, 'uid' => $uid ])
          ->execute();
      }
      catch (Exception $e) {
        //todo -- revert the cancelation after MVP
      }

   }
  }
  public function ajax_form_multistep_form_ajax_cancel_addupgrades(array &$form, FormStateInterface $form_state) {
    $messages = \Drupal::messenger()->deleteAll();
    $response = new AjaxResponse();
    $response->addCommand(new CloseModalDialogCommand());
    return $response;
  }

  public function ajax_form_change_plan_form_ajax_callback_addupgrades(array &$form, FormStateInterface $form_state) {
    $response = new AjaxResponse();
    $response->addCommand(new CloseModalDialogCommand());
    $response->addCommand(new RedirectCommand('/admin/config/stripe/upgrades'));
    return $response;
  }
}
