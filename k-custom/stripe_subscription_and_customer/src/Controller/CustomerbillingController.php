<?php

namespace Drupal\stripe_subscription_and_customer\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\taxonomy\Entity\Term;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\CloseModalDialogCommand;
use Drupal\Core\Ajax\RedirectCommand;

/**
 * Class CustomerbillingController.
 */
class CustomerbillingController extends ControllerBase {

  /**
   * Customerbilling.
   *
   * @return string
   *   Return Hello string.
   */
  public function customerbilling($user) {
    //$user = \Drupal::entityTypeManager()->getStorage('user')->load($uid);
      $user_roles = $user->getRoles();
      $expertUser = 0;
      if(in_array('advanced_content_creator', $user_roles)){
        $expertUser = 1;
      }
      // get role feture
      $vocabulary_name = 'role_features';
      $query = \Drupal::entityQuery('taxonomy_term');
      $query->condition('vid', $vocabulary_name);
      $query->sort('weight');
      $tids = $query->execute();
      $terms = Term::loadMultiple($tids);
      $items = [];
      $config = $this->config('stripe_api.settings');
      $mode = $config->get('mode');
      foreach ($terms as $term) {
        $term_id = $term->id();
        $term_Name = $term->getName();
        if($mode == 'live') {
          $pricing_id = $term->get('field_stripe_pricing_id_monthly_')->getValue();
        } else {
          $pricing_id = $term->get('field_stripe_test_pricing_id_mon')->getValue();
        }
        $subscription_rate = $term->get('field_monthly_subscription_rate')->getValue();
        $link_url = $term->get('field_sign_up_url')->getValue();
        $link_label = $term->get('field_sign_up_button_label')->getValue();
        $link_sub_label = $term->get('field_sign_up_button_sub_label')->getValue();
        if(isset($pricing_id['0']['value'])) {
          $items[$term_id] = array(
            'tid' => $term_id,
            'name' => $term_Name,
            'subscription_rate' => isset($subscription_rate['0']['value']) ? $subscription_rate['0']['value'] : 0,
            'pricing_id' => $pricing_id['0']['value'],
          );
        }
      }

      $conn = \Drupal::database();
      $record = array();
      $query = $conn->select('upgrades_products', 'up')
        ->condition('uid', $user->Id())
        ->condition('up.status', '1', '=')
        ->fields('up');
      $record = $query->execute()->fetchAll();
      $records = [];
      $activeupgrades = [];
      foreach ($record as $key => $valueup) {
        $pricing = \Drupal::service('stripe_subscription_and_customer.stripe_api')->getpricing($valueup->pricing_id);
        $records[$key]['price'] = $pricing->unit_amount;
        $records[$key]['name'] = $pricing->nickname;
        $records[$key]['tid'] = $valueup->subscription_id;
        $records[$key]['uid'] = $valueup->uid;
        $activeupgrades[] = $valueup->pricing_id;
      }

      $add_upgrades = 'add_upgrades';
      $query = \Drupal::entityQuery('taxonomy_term');
      $query->condition('vid', $add_upgrades);
      $query->sort('weight');
      $add_upgrades_tids = $query->execute();
      $add_upgrades_terms = Term::loadMultiple($add_upgrades_tids);
      $add_upgrades_items = [];
      foreach ($add_upgrades_terms as $term) {
        $term_id = $term->id();
        $term_Name = $term->getName();
        $price = $term->get('field_price')->getValue();
        $storage = $term->get('field_storage')->getValue();
        
        if($mode == 'live') {
          $pricing_id_raw = $term->get('field_pricing_id')->getValue();
        } else {
          $pricing_id_raw = $term->get('field_pricing_id_test')->getValue();
        }
        $pricing_id = $pricing_id_raw['0']['value'];
        $pricing = \Drupal::service('stripe_subscription_and_customer.stripe_api')->getpricing($pricing_id);
        $status = 1;
        if(in_array($pricing_id, $activeupgrades)) {
          $status = 0;
        }
        $add_upgrades_items[] = array(
          'tid' => $term_id,
          'name' => $pricing->nickname,
          'price' => $pricing->unit_amount,
          'storage' => $storage['0']['value'],
          'status' => $status
        );
      }
      $customer_id = $user->get('stripe_customer_id')->value;
    if (isset($customer_id) && !empty($customer_id)) {
      $subscription_id = $user->get('stripe_subscription_id')->value;
      if (isset($subscription_id) && !empty($subscription_id)) {
        $subscription = \Drupal::service('stripe_subscription_and_customer.stripe_api')->retrieveSubscription($subscription_id);
        $billing['all'] = $subscription;
        $currentplan = $subscription->items->data[0]['plan']['id'];
        $customer = \Drupal::service('stripe_subscription_and_customer.stripe_api')->retrieveCustomers($customer_id);
        $pyamentmethod = \Drupal::service('stripe_subscription_and_customer.stripe_api')->retrievepaymentMethods($customer_id);
        $billing['customer'] = $customer;
        $billing['pyamentmethod'] = $pyamentmethod;
        $billing['subscription'] = $subscription;
        $billing['items'] = $items;
        $billing['currentplan'] = $currentplan;
        $billing['uid'] = $user->Id();
        $billing['user_add_upgrades'] = $records;
        $billing['add_upgrades'] = $add_upgrades_items;
        $billing['expertUser'] = $expertUser;
        return [
          '#theme' => 'stripe_billing',
          '#billing' => $billing,
        ];
      }
      else {
        return [
          '#markup' => 'No Plan found'
        ];
      }
    }
    else {
      return [
        '#markup' => 'No Plan found'
      ];
    }
  }

}


