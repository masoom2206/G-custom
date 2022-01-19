<?php

namespace Drupal\my_groups\Access;

use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Routing\Access\AccessInterface;

/**
 * Checks access for displaying configuration translation page.
 */
class UserAccessCheck implements AccessInterface{
  /**
   * A custom access check.
   *
   * @param \Drupal\Core\Session\AccountInterface $account
   *   Run access checks for this account.
   *
   * @return \Drupal\Core\Access\AccessResultInterface
   *   The access result.
   */
  public function access(AccountInterface $account, $user) { 
    // Check if admin has "Administer users" permission.
    return AccessResult::allowedIfHasPermission($account, 'administer users')
      // Check if current user id = visited user id.
      ->orIf(AccessResult::allowedIf($user == $account->id()));
  }
	
	/**
	 * A custom access check 
	 *
	 * @param \Drupal\Core\Session\AccountInterface $account
   * Run access checks for this account.
	 * @return \Drupal\Core\Access\AccessResultInterface
   * The access result.
   * /user/[uid] route - allowed to only administartor role
   * /user/[uid]/edit route - allowed to only administartor role
	 */
	public function adminAccess(AccountInterface $account, $user) { 
    $roles = $account->getRoles();
    // Check if user has "administrator" roles.
		if(in_array('administrator', $roles)){
			return AccessResult::allowed();
		}
		else {
			return AccessResult::forbidden();
		}
  }
	
	/**
	 * A custom access check 
	 *
	 * @param \Drupal\Core\Session\AccountInterface $user
   * Run access checks for this account.
	 * @return \Drupal\Core\Access\AccessResultInterface
   * The access result.
   * /tools/profile/[uid] route - allowed to all authenticated role for own user profile
	 */
	public function profileAccess(AccountInterface $user) { 
		$account = \Drupal::currentUser();
    $roles = $user->getRoles();

		if((in_array('content_creator', $roles) || in_array('advanced_content_creator', $roles) || in_array('designer', $roles) || in_array('enterprise', $roles) || in_array('canceled', $roles)) && !empty($account->id()) && $user->id() == $account->id()){
			return AccessResult::allowed();
		}
		else {
			return AccessResult::forbidden();
		}
  }
}