<?php

namespace Drupal\my_groups\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;
use Drupal\node\Entity\NodeType;
use Drupal\user\Entity\User;

/**
 * Listens to the dynamic route events.
 */
class RouteSubscriber extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {
    drupal_flush_all_caches();
    $uid = \Drupal::currentUser()->id();	
    // log message
    //$logger = \Drupal::logger('AlterRoutes');
    //$logger->info('AlterRoutes > User ID: %uid', ['%uid' => $uid]);
    
		// define custom form in site information settings for adding custom fields
		if ($route = $collection->get('system.site_information_settings')){ 
      $route->setDefault('_form', 'Drupal\media_vault_tool\Form\ExtendedSiteInformationForm');
		}
		
    // Define custom access for '/user/{user}' 
    if ($route = $collection->get('entity.user.canonical')) {
			//$user = User::load($uid);
			//$route->setPath('/tools/my-account/'.$uid);
			//$route->setOption('parameters', $user);
      $route->setDefault('_controller', '\Drupal\onboarding\Controller\OnBoardingController::goto_myaccount');
      //$route->setRequirement('_custom_access', '\Drupal\my_groups\Access\UserAccessCheck::adminAccess');
    }
    if ($route = $collection->get('entity.user.edit_form')) {
      $route->setRequirement('_custom_access', '\Drupal\my_groups\Access\UserAccessCheck::adminAccess');
    }
    if ($route = $collection->get('profile.user_page.single')) {
      $route->setRequirement('_custom_access', '\Drupal\my_groups\Access\UserAccessCheck::access');
    }
    if ($route = $collection->get('profile.user_page.multiple')) {
      $route->setRequirement('_custom_access', '\Drupal\my_groups\Access\UserAccessCheck::access');
    }
    
    // Change path '/user/login' to '/login'.
    if($route = $collection->get('entity.group.collection')) {
      //echo $route->getPath(); die('here');
      $route->setDefault('_title', 'My Teams');
      //$route->setPath('/my-account/'.$uid.'/teams');
    }
    
    if($route = $collection->get('entity.group.add_page')) {
      //$route->setDefault('_title', 'Add Team');
      $route->setPath('team/add');
    }
    
    if($route = $collection->get('entity.group.add_form')) {
      //echo $route->getPath(); die('here');
			//$uid = \Drupal::currentUser()->id();
      //$route->setOption('parameters', $user);
      //$route->setPath('/my-account/{user}/{group_type}/add');
      $route->setPath('/my-account/{group_type}/add');
			
    }
    if($route = $collection->get('entity.group.edit_form')) {
      //echo $route->getPath(); die('here');
      $route->setPath('/my-account/team/{group}/edit');
    }
    
    if($route = $collection->get('entity.group_content.add_form')) {
      $route->setPath('/team/{group}/{plugin_id}/add');
    }
    if($route = $collection->get('entity.group_content.edit_form')) {
      //echo $route->getPath(); die('here');
      $route->setPath('/team/{group}/content/{group_content}/edit');
    }
    
    if($route = $collection->get('entity.group_content.delete_form')) {
      $route->setPath('/team/{group}/content/{group_content}/delete');
    }
    
    if($route = $collection->get('entity.group_content.canonical')) {
      $route->setPath('/team/{group}/content/{group_content}');
    }

		// Alter the edit node route to our custom route
    if ($route = $collection->get('entity.node.edit_form')) {
			$current_path = \Drupal::service('path.current')->getPath();
      $args = explode('/',$current_path);
			if ($args[1] == 'node' && is_numeric($args[2]) && $args[3] == 'edit') {
        $node = \Drupal::routeMatch()->getParameter('node');
        $route->setOption('parameters', $node);
        $route->setRequirement('_custom_access', '\Drupal\media_vault_tool\Access\NodeEditAccessCheck::node_edit_access');
      }
    }
		
	}
}