<?php
namespace Drupal\kaboodle_user\Controller;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\RedirectResponse;

class UserCustomController extends ControllerBase {

   // user profile edit custom form
   public function user_edit_profile() {
    $user = \Drupal::currentUser();
    $user_entity = \Drupal::entityTypeManager()
      ->getStorage('user')
      ->load($user->id());

    $formObject = \Drupal::entityTypeManager()
      ->getFormObject('user', 'default')
      ->setEntity($user_entity);

    $form = \Drupal::formBuilder()->getForm($formObject);
    
    $render_data['theme_data'] = array(
      '#theme' => 'user_profile_edit',
      '#user_edit_form' => $form,
    );
      
    return $render_data;  
  }
  
  // get user raw data
  public function getUser($user) {
    $uid = $user->id();
    echo '<pre>'; print_r($user); echo '</pre>';
    die('here');
  }
}
