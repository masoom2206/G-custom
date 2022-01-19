<?php

namespace Drupal\stripe_subscription_and_customer\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Class GetRegisterController.
 */
class GetRegisterController extends ControllerBase {

  /**
   * Stripecustomer.
   *
   * @return string
   *   Return Hello string.
   */
  public function stripecustomer() {
    return [
      '#type' => 'markup',
      '#markup' => $this->t('Implement method: stripecustomer')
    ];
  }

}
