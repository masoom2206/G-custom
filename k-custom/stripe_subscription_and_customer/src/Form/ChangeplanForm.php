<?php

namespace Drupal\stripe_subscription_and_customer\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\user\PrivateTempStoreFactory;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\CloseModalDialogCommand;
use Drupal\Core\Ajax\RedirectCommand;
use Drupal\taxonomy\Entity\Term;

/**
 * Class ChangeplanForm.
 */
class ChangeplanForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'changeplan_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $pricing = NULL, $uid = NULL) {
    $current_user = \Drupal::currentUser();
    $roles = $current_user->getRoles();
    if(in_array('administrator', $roles) || in_array('va_manager', $roles)) {
      $uid = $uid;
    } else if ($current_user->Id() == $uid) {
      $uid = $uid;
    } else {
      $uid = $current_user->Id();
    }
    $user =  \Drupal\user\Entity\User::load($uid);
    $term = Term::load($pricing);
    $term_Name = $term->getName();
    $config = $this->config('stripe_api.settings');
    $mode = $config->get('mode');
    if($mode == 'live') {
      $pricing_id_mon = $term->get('field_stripe_pricing_id_monthly_')->getValue();
    } else {
      $pricing_id_mon = $term->get('field_stripe_test_pricing_id_mon')->getValue();
    }
    $field_stripe_test_pricing_id_mon = $pricing_id_mon[0]['value'];
    $customer_id = $user->get('stripe_customer_id')->value;
    if (isset($customer_id) && !empty($customer_id)) {
      $subscription_id = $user->get('stripe_subscription_id')->value;
      $subscription = \Drupal::service('stripe_subscription_and_customer.stripe_api')->retrieveSubscription($subscription_id);
      $currentplan = $subscription->items->data[0]['plan']['id'];
    }
    $crrentplanname = $subscription->plan->nickname;
    $sub_id = $subscription->id;
    $palnsub_id = $subscription->items->data[0]->id;
    $form['#prefix'] = '<div id="ajax_form_multistep_form"><div class="col-sm-12"><h1>CHANGE PLAN TO "' .$term_Name . '"</h1></div><div id="result-message result_message message"></div>';
    $form['#suffix'] = '</div>';
    $form['markup'] = [
     '#markup' => '<div class="step">Are you sure you want to change from the "' .$crrentplanname . '" plan to the "' .$term_Name. '" plan? Changes will take effect immediately but you will not be billed until your next billing date.</div>'
    ];
    $form['sub_id'] = [
      '#type' => 'hidden',
      '#title' => $this->t('pricing'),
      '#weight' => '0',
      '#value' => $sub_id,
    ];
    $form['uid'] = [
      '#type' => 'hidden',
      '#value' => $uid,
    ];
    $form['tid'] = [
      '#type' => 'hidden',
      '#value' => $pricing,
    ];
    $form['palnsub_id'] = [
      '#type' => 'hidden',
      '#title' => $this->t('pricing'),
      '#weight' => '0',
      '#value' => $palnsub_id,
    ];
    $form['pricing'] = [
      '#type' => 'hidden',
      '#title' => $this->t('pricing'),
      '#weight' => '0',
      '#value' => $field_stripe_test_pricing_id_mon,
    ];
    $form['buttons']['cancel'] = [
      '#type' => 'submit',
      '#value' => t('cancel'),
      '#prefix' => '<div class="d-flex"><div class="step1-button">',
      '#suffix' => '</div>',
      '#limit_validation_errors' => [],
      '#attributes' => ['class' => ['calbutton']],
      '#ajax' => [
        // We pass in the wrapper we created at the start of the form
        'wrapper' => 'ajax_form_multistep_form',
        // We pass a callback function we will use later to render the form for the user
        'callback' => '::ajax_form_multistep_form_ajax_cancel_change_change',
        'event' => 'click',
      ],
    ];
    $form['buttons']['forward'] = [
      '#type' => 'submit',
      '#value' => t('CHANGE PLAN'),
      '#prefix' => '<div class="step1-button">',
      '#suffix' => '</div></div>',
      '#attributes' => ['class' => ['subbutton']],
      '#ajax' => [
        // We pass in the wrapper we created at the start of the form
        'wrapper' => 'ajax_form_multistep_form',
        // We pass a callback function we will use later to render the form for the user
        'callback' => '::ajax_form_change_plan_form_ajax_callback_change',
        'event' => 'click',
      ],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
   // foreach ($form_state->getValues() as $key => $value) {
      // @TODO: Validate fields.
   // }
   // parent::validateForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Display result.
    $dataform = $form_state->getTriggeringElement();
    if ($dataform['#parents'][0] != 'cancel') {
      $values = $form_state->getValues();
      if(isset($values['sub_id'])) {
        $sub_id = $values['sub_id'];
        $price_id = $values['pricing'];
        $uid = $values['uid'];
        $tid = $values['tid'];
        \Drupal::service('stripe_subscription_and_customer.stripe_api')->upgradSubscription($sub_id, $price_id);
        $user =  \Drupal\user\Entity\User::load($uid);
        $vid = 'role_features';
        $term_obj = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tid);
        $term_data[$tid] = [
          'storage_limit' => $term_obj->get('field_storage_limit')->value,
          'bandwidth' => $term_obj->get('field_bandwidth')->value,
          'role' => $term_obj->get('field_drupal_role')->value,
        ];
        $user->removeRole('enterprise');
        $user->removeRole('content_creator');
        $user->removeRole('advanced_content_creator');
        $user->addRole($term_data[$tid]['role']);
        $user->set('field_bandwidth_allotment', $term_data[$tid]['bandwidth']);
        $user->set('field_storage_space', $term_data[$tid]['storage_limit']);
        //Save user account
        $user->save();
      }
    }
  }

  public function ajax_form_change_plan_form_ajax_callback_change(array &$form, FormStateInterface $form_state) {
    $values = $form_state->getValues();
    $uid = $values['uid'];
    $response = new AjaxResponse();
    $response->addCommand(new CloseModalDialogCommand());
    $response->addCommand(new RedirectCommand('/tools/profile/'.$uid.'/billing'));
    return $response;
  }
  
  public function ajax_form_multistep_form_ajax_cancel_change_change(array &$form, FormStateInterface $form_state) {
    $messages = \Drupal::messenger()->deleteAll();
    $response = new AjaxResponse();
    $response->addCommand(new CloseModalDialogCommand());
    return $response;
  }
}
