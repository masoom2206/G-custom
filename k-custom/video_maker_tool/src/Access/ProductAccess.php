<?php
namespace Drupal\video_maker_tool\Access;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Routing\Access\AccessInterface;
use Drupal\user\Entity\User;

/**
 * Checks access for displaying configuration translation page.
 */
class ProductAccess implements AccessInterface{
  /**
  * custom product permission
  */
  public function access_product(User $user) {
    $account = \Drupal::currentUser();
    $cuid = $account->id();
    // user must login to access the page
    if(empty($cuid)){
      return AccessResult::forbidden();
    }
    
    $roles = $account->getRoles();
    $uid = $user->get('uid')->value;
    // user can access own product page
    if($cuid == $uid){
      return AccessResult::allowed();
    }
    
    if(!in_array('administrator', $roles)){
      $gid = isset($_GET['team']) ? $_GET['team'] : '';
      $member = \Drupal::service('my_groups.team.service')->getMembersAccess($gid, $cuid, $uid, 'team-video_maker');
      if($member){
        return AccessResult::allowed();
      }
      return AccessResult::forbidden();
    }
    
    return AccessResult::allowed();
  }
  /**
  * custom video page access
  */
  public function access_video($video_id = 0) {
    $account = \Drupal::currentUser();
    if($video_id > 0){
      $query = \Drupal::database()->select('vmt_videos', 'v');
      $query->fields('v');
      $query->condition('v.video_id', $video_id, '=');
      $video = $query->execute()->fetchObject();
      if(empty($video)){
        return AccessResult::forbidden();
      }
      else{
        $owner = $video->user_id;
        $cuid = $account->id();
        $roles = $account->getRoles();
        // user can access own product page
        if($cuid == $owner){
          return AccessResult::allowed();
        }
        else if(in_array('administrator', $roles)){
          return AccessResult::allowed();
        }
        else if(!in_array('administrator', $roles)){
          $gid = isset($_GET['team']) ? $_GET['team'] : '';
          $member = \Drupal::service('my_groups.team.service')->getMembersAccess($gid, $cuid, $owner, 'team-video_maker');
          if($member){
            return AccessResult::allowed();
          }
          return AccessResult::forbidden();
        }
      }
    }
    else {
      return AccessResult::forbidden();
    }
  }
}