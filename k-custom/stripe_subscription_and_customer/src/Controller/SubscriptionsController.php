<?php

namespace Drupal\stripe_subscription_and_customer\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\user\Entity\User;
use Drupal\user\UserInterface;
use Stripe\Stripe;
use Drupal\Core\Url;
use Symfony\Component\HttpFoundation\RedirectResponse;
/**
 * Class SubscriptionsController.
 */
class SubscriptionsController extends ControllerBase {

  /**
   * Subscribe.
   *
   * @return string
   *   Return Hello string.
   */
  public function subscribe() {
    $user_id = 463;
    $account = User::load($user_id);
    $key_api = \Drupal::service('stripe_api.stripe_api')->getApiKey();
    $stripe = new \Stripe\StripeClient($key_api);
    $customer = $stripe->customers->create([
        'name' => $account->get('name')->value,
        'email' => $account->get('mail')->value,
        'metadata' => ['user_uid' => $user_id]
    ]);
    //return $customer;
    $customer_id = 'cus_J8TxIYaEY8bfjE'; //$customer->id;
    $price_id = 'price_1IBHHHKGT5UH6O5DDyLeqfaJ';
    $subscription = \Drupal::service('stripe_subscription_and_customer.stripe_api')->createSubscription($customer_id, $price_id);
    
    return [
      '#type' => 'markup',
      '#markup' => $this->t('Implement method: subscribe'.var_dump($key_pub).'---customer-id'.print_r($customer).'-------$subscription--'.$subscription)
    ];
  }
  
  /**
   * Reload.
   *
   * @return string
   *   Return Hello string.
   */
  public function reload($user) {
    $headers = ['Cache-Control' => 'no-cache'];
    $response = new RedirectResponse(Url::fromRoute('stripe_subscription_and_customer.customerbilling_controller_customerbilling', ['user' => $user->Id()])->setAbsolute()->toString());
    return $response;
  }

}
