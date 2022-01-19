<?php

namespace Drupal\stripe_subscription_and_customer;

/**
 * Interface StripeapiServiceInterface.
 */
interface StripeapiServiceInterface {

  function getCustomersID($user_id);

  function createSubscription($customer_id, $price_id);

  function updateCustomersID($customer_id, $user_id);

  function updateSubscriptiondrupal($customer_id, $subscriptions_id, $user_id);

  //function changeSubscription($sub_id, $price_id);
}
