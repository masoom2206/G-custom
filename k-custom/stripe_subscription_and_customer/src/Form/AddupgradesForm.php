<?php

namespace Drupal\stripe_subscription_and_customer\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\CloseModalDialogCommand;
use Drupal\Core\Ajax\RedirectCommand;
use Drupal\taxonomy\Entity\Term;

/**
 * Class AddupgradesForm.
 */
class AddupgradesForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'addupgrades_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $uid = NULL, $tid = NULL) {
    $term = Term::load($tid);
    $term_Name = $term->getName();
    $form['#prefix'] = '<div id="ajax_form_multistep_form"><div class="col-sm-12"><h1>' . $term_Name . '</h1></div><div id="result-message result_message message"></div>';
    $form['#suffix'] = '</div>';
    $form['markup'] = [
     '#markup' => '<div class="step">Are you sure you want to add the upgrade: "' . $term_Name . '"? Upgrades take effect immediately but you won\'t be billed until your next billing date.</div>'
    ];
    $form['uid'] = [
      '#type' => 'hidden',
      '#value' => $uid,
      '#weight' => '0',
    ];
    $form['tid'] = [
      '#type' => 'hidden',
      '#value' => $tid,
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
      '#value' => t('UPGRADE'),
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
    // Display result.
    $values = $form_state->getValues();
    if(isset($values['uid'])) {
      $uid = $values['uid'];
      $account = \Drupal\user\Entity\User::load($uid);

        $tid = $values['tid'];
        $term = Term::load($tid);
        $term_Name = $term->getName();
        $config = $this->config('stripe_api.settings');
        $mode = $config->get('mode');
        if($mode == 'live') {
          $pricing_id_mon = $term->get('field_pricing_id')->getValue();
        } else {
          $pricing_id_mon = $term->get('field_pricing_id_test')->getValue();
        }
        $addstorgae = $term->get('field_storage')->getValue();
        $addstorgae_value = $addstorgae[0]['value'];
        $price_id = $pricing_id_mon[0]['value'];

      $customer_id = $account->get('stripe_customer_id')->value;
      if (isset($customer_id) && !empty($customer_id)) {
        $subscription_id = $account->get('stripe_subscription_id')->value;
      }
      $storage = \Drupal::service('stripe_subscription_and_customer.stripe_api')->addstorageSubscription($subscription_id, $price_id);
      $user =  \Drupal\user\Entity\User::load($uid);
      $current_storage = $account->get('field_storage_space')->value;
      $storagevalue = $addstorgae_value + $current_storage;
      $user->set('field_storage_space', $storagevalue);
      $user->set('field_addition_data_subscription', $storage->id);
      //Save user account
      $user->save();
      $field  = array(
        'uid'   =>  $uid,
        'sub_id' => $storage->id,
        'subscription_id' =>  $tid,
        'customer_id' =>  $customer_id,
        'pricing_id' => $price_id,
        'status' => 1,
        'created' => time(),
        'updated' => time()
      );

      $query = \Drupal::database();
      $query ->insert('upgrades_products')
         ->fields($field)
         ->execute();
    }
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
