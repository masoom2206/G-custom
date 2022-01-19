<?php

namespace Drupal\km_subscription_system\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\RedirectResponse;


/**
 * Class DefaultController.
 */
class DefaultController extends ControllerBase {

  /**
   * Userautologin.
   *
   * @return string
   *   Return Hello string.
   */
  public function userautologin() {
    if (isset($_SESSION['km_subscription_system_user_id'])) {
      $uid = $_SESSION['km_subscription_system_user_id'];
      $user = \Drupal\user\Entity\User::load($uid);
      user_login_finalize($user);
      unset($_SESSION['km_subscription_system_user_id']);
    }
    if (isset($_SESSION['km_subscription_system'])) {
      $user = $_SESSION['km_subscription_system']['user'];
      user_login_finalize($user);
      unset($_SESSION['km_subscription_system']);
    }
    $response = new RedirectResponse('/');
    $response->send();
    return $response;
  }
}
