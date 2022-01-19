<?php

namespace Drupal\stripe_subscription_and_customer\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Class CustomerController.
 */
class CustomerController extends ControllerBase {

  /**
   * Customer.
   *
   * @return string
   *   Return Hello string.
   */
  public function customer() {
    return [
      '#type' => 'markup',
      '#markup' => $this->t('Implement method: customer')
    ];
  }

}
