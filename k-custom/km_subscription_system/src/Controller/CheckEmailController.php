<?php

namespace Drupal\km_subscription_system\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class CheckEmailController.
 */
class CheckEmailController extends ControllerBase {

  /**
   * Checkemail.
   *
   * @return string
   *   Return true or false string.
   */
  public function checkemail() {
    $ids = \Drupal::entityQuery('user')
    ->condition('mail', $_POST['email_address'])
    ->execute();

    if (!empty($ids)) {
	   $res = "false";
    }
    else {
        $res = "true";
    }
	  $response = new Response($res, 200, array());
	  return $response;
  }
  /**
   * Checkemail.
   *
   * @return string
   *   Return true or false string.
   */
  public function checkemailvalid() {
    $ids = \Drupal::entityQuery('user')
    ->condition('mail', $_POST['email_id'])
    ->execute();

    if (!empty($ids)) {
      $res = "false";
      $response = new Response($res, 200, array());
      return $response;
    }
    $getrequesttime = \Drupal::time()->getRequestTime() - 86400;
    $query = \Drupal::database()->select('km_subscription_system', 'ks');
    $query->fields('ks');
    $query->condition('email', $_POST['email_id']);
    $query->condition('created',  $getrequesttime, '>');
    $query->range(0, 1);
    $codestatus = $query->execute()->fetchAll();
    if (count($codestatus) <= 0) {
	    $res = "false";
    }
    else {
      $res = "true";
    }
	  $response = new Response($res, 200, array());
	  return $response;
  }
}