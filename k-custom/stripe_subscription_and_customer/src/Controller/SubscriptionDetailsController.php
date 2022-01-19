<?php

namespace Drupal\stripe_subscription_and_customer\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Class SubscriptionDetailsController.
 */
class SubscriptionDetailsController extends ControllerBase {

  /**
   * Getsubscriptioninformation.
   *
   * @return string
   *   Return Hello string.
   */
  public function getSubscriptionInformation() {
    return [
      '#type' => 'markup',
      '#markup' => $this->t('Implement method: getSubscriptionInformation')
    ];
  }

}
