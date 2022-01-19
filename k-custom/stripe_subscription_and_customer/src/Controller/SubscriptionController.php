<?php

namespace Drupal\stripe_subscription_and_customer\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Class SubscriptionController.
 */
class SubscriptionController extends ControllerBase {

  /**
   * Subscription.
   *
   * @return string
   *   Return Hello string.
   */
  public function subscription() {
    return [
      '#type' => 'markup',
      '#markup' => $this->t('Implement method: subscription')
    ];
  }

}
