<?php
namespace Drupal\affiliate_program\Access;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Routing\Access\AccessInterface;
use Drupal\user\Entity\User;

/**
 * Checks access for displaying configuration translation page.
 */
class AffiliateAccess implements AccessInterface{
  /**
  * custom product permission
  */
  public function access_affiliate_application() {
    $account = \Drupal::currentUser();
    $roles = $account->getRoles();
    $cuid = $account->id();
    // user must login to access the page
    if($cuid > 0){
      if(in_array('administrator', $roles) || in_array('advanced_content_creator', $roles) || in_array('enterprise', $roles)){
        return AccessResult::allowed();
      }
    }
    return AccessResult::forbidden();
  }
}