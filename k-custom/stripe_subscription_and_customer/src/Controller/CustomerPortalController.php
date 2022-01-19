<?php

namespace Drupal\stripe_subscription_and_customer\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Class CustomerPortalController.
 */
class CustomerPortalController extends ControllerBase {

  /**
   * Portal.
   *
   * @return string
   *   Return Hello string.
   */
  public function portal($cusid, $uid) {
    $host = \Drupal::request()->getSchemeAndHttpHost();
    $session = \Drupal::service('stripe_subscription_and_customer.stripe_api')->retrievecustomerPortal($cusid, $host.'/tools/profile/'.$uid.'/billing');
    // Redirect to the customer portal.
    header("Location: " . $session->url);
    exit();
    return [
      '#type' => 'markup',
      '#markup' => $this->t('Implement method: portal with parameter(s): $cusid'),
    ];
  }

}
