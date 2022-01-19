<?php

namespace Drupal\media_vault_tool\Access;

use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Routing\Access\AccessInterface;

/**
 * Checks access for displaying configuration translation page.
 */
class NodeAddAccessCheck implements AccessInterface{
  
	/**
   * A custom access check.
   *
   * @param \Drupal\node\NodeInterface $node
   *   Run access checks for this custome node edit form.
   *
   * @return \Drupal\Core\Access\AccessResultInterface
   *   The access result.
   */
	public function custom_node_add_access(\Drupal\node\NodeTypeInterface $node_type) { 
		$uid = \Drupal::currentUser()->id();
		$account = \Drupal\user\Entity\User::load($uid);
    $roles = $account->getRoles();
		switch($node_type->id()){
			case 'metadata_preset':
				if (in_array('administrator', $roles) || in_array('va_manager', $roles) || in_array('virtual_assistant', $roles) || in_array('enterprise', $roles) || in_array('content_creator', $roles) || in_array('advanced_content_creator', $roles) || in_array('vendor', $roles)){
					return AccessResult::allowed();
				}
				else{
					return AccessResult::forbidden();
				}
			break;
			
		  case 'branding_preset':
				if (in_array('administrator', $roles) || in_array('va_manager', $roles) || in_array('virtual_assistant', $roles) || in_array('enterprise', $roles) || in_array('content_creator', $roles) || in_array('advanced_content_creator', $roles) || in_array('vendor', $roles)) {
					return AccessResult::allowed();
				}
				else{
					return AccessResult::forbidden();
				}
			break;
			
			default:
				return AccessResult::forbidden();
			break;
		}
  }
}