<?php

namespace Drupal\media_vault_tool\Access;

use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Routing\Access\AccessInterface;
use Drupal\media\Entity\Media;
use Drupal\user\Entity\User;

/**
 * Checks access for displaying configuration translation page.
 */
class MediaAccess implements AccessInterface{
	/**
   * A custom access check.
   *
   * @param \Drupal\media\Entity\Media $media
   *   Run access checks for this custome media edit form.
   *
   * @return \Drupal\Core\Access\AccessResultInterface
   *   The access result.
   */
	public function custom_media_edit_access(Media $media) { 
		$uid = \Drupal::currentUser()->id();
		$account = \Drupal\user\Entity\User::load($uid);
    $roles = $account->getRoles();
		$owner = $media->getOwnerId();
    if((in_array('administrator', $roles) || in_array('va_manager', $roles) || in_array('virtual_assistant', $roles) || in_array('enterprise', $roles)) && $uid != $owner){
			return AccessResult::allowed();
		}
		else if ($uid == $owner) {
			return AccessResult::allowed();
		}
		else{
			return AccessResult::forbidden();
		}
  }
  /**
  * custom media tags permission
  */
  	public function custom_media_tags_access(User $user) { 
		$uid = \Drupal::currentUser()->id();
		$account = \Drupal\user\Entity\User::load($uid);
        $roles = $account->getRoles();
        // user's tags that can be accessed by other users
		$tags_owner = $user->get('uid')->value;
    if((in_array('administrator', $roles) || in_array('va_manager', $roles) || in_array('virtual_assistant', $roles) || in_array('enterprise', $roles)) && $uid != $tags_owner){
			return AccessResult::allowed();
		}
		else if ($uid == $tags_owner) {
			return AccessResult::allowed();
		}
		else{
			return AccessResult::forbidden();
		}
  }
}