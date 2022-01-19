<?php

namespace Drupal\media_vault_tool\Access;

use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Routing\Access\AccessInterface;

/**
 * Checks access for displaying configuration translation page.
 */
class NodeEditAccessCheck implements AccessInterface{
  /**
   * A custom access check.
   *
   * @param \Drupal\node\NodeInterface $node
   *   Run access checks for this node edit form.
   *
   * @return \Drupal\Core\Access\AccessResultInterface
   *   The access result.
   */
  public function node_edit_access(\Drupal\node\NodeInterface $node) { 
		$uid = \Drupal::currentUser()->id();
		$account = \Drupal\user\Entity\User::load($uid);
    $roles = $account->getRoles();
		$node_type = $node->bundle();
		$owner = $node->getOwnerId();
    // Check if admin has "Administer users" roles.
		switch($node_type){
			case 'metadata_preset':
				if(in_array('administrator', $roles)){
					return AccessResult::allowed();
				}
				else {
					return AccessResult::forbidden();
				}
			break;
			
			case 'media_kit':
				if(in_array('administrator', $roles)){
					return AccessResult::allowed();
				}
				else {
					return AccessResult::forbidden();
				}
			break;
        
			case 'branding_preset':	
				if(in_array('administrator', $roles)){
					return AccessResult::allowed();
				}
				else{
					return AccessResult::forbidden();
				}
			break;
			
			case 'kaboodle':	
				if(in_array('administrator', $roles)){
					return AccessResult::allowed();
				}
				else{
					return AccessResult::forbidden();
				}
			break;
    }
  }
	/**
   * A custom access check.
   *
   * @param \Drupal\node\NodeInterface $node
   *   Run access checks for this custome node edit form.
   *
   * @return \Drupal\Core\Access\AccessResultInterface
   *   The access result.
   */
	public function custom_node_edit_access(\Drupal\node\NodeInterface $node) { 
		$uid = \Drupal::currentUser()->id();
		$account = \Drupal\user\Entity\User::load($uid);
    $roles = $account->getRoles();
		$node_type = $node->bundle();
		$owner = $node->getOwnerId();
		$default_kit = default_media_kit();
    // Check if current user has any of the roles (content_creator, advanced_content_creator or enterprise).
		switch($node_type){
			
			case 'media_kit':
				if($node->id() == $default_kit){
					if(in_array('administrator', $roles)){
						return AccessResult::allowed();
					} else {
						return AccessResult::forbidden();
					}
				} else {
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
			break;
			
			case 'metadata_preset':
				if((in_array('administrator', $roles) || in_array('va_manager', $roles) || in_array('virtual_assistant', $roles) || in_array('enterprise', $roles)) && $uid != $owner){
					return AccessResult::allowed();
				}
				else if ($uid == $owner) {
					return AccessResult::allowed();
				}
				else{
					return AccessResult::forbidden();
				}
			break;
        
			case 'branding_preset':	
				if((in_array('administrator', $roles) || in_array('va_manager', $roles) || in_array('virtual_assistant', $roles) || in_array('enterprise', $roles)) && $uid != $owner){
					return AccessResult::allowed();
				}
				else if ($uid == $owner) {
					return AccessResult::allowed();
				}
				else{
					return AccessResult::forbidden();
				}
			break;
			
			case 'kaboodle':	
				if((in_array('administrator', $roles) || in_array('va_manager', $roles) || in_array('virtual_assistant', $roles) || in_array('enterprise', $roles)) && $uid != $owner){
					return AccessResult::allowed();
				}
				else if ($uid == $owner) {
					return AccessResult::allowed();
				}
				else{
					return AccessResult::forbidden();
				}
			break;
		}
  }
}