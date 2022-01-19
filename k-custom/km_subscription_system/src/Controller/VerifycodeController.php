<?php

namespace Drupal\km_subscription_system\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class VerifycodeController.
 */
class VerifycodeController extends ControllerBase {

  /**
   * Verifycode.
   *
   * @return string
   *   Return Hello string.
   */
  public function verifycode() {
    $getrequesttime = \Drupal::time()->getRequestTime() - 86400;
    $query = \Drupal::database()->select('km_subscription_system', 'ks');
    $query->fields('ks');
    $query->condition('randomcode',$_POST['verification_code']);
    $query->condition('email',$_POST['email']);
    $query->condition('created',  $getrequesttime, '>');
    $query->range(0, 1);
    $codestatust = $query->execute()->fetchAll();
    if (count($codestatust) <= 0) {
      $res = "false";
    }
    else {
      $res = "true";
    }
    $response = new Response($res, 200, array());
    return $response;
  }
}