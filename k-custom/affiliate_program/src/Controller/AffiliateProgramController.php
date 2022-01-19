<?php

/**
 * @file
 * AffiliateProgramController class.
 */

namespace Drupal\affiliate_program\Controller;

use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\OpenModalDialogCommand;
use Drupal\Core\Controller\ControllerBase;

class AffiliateProgramController extends ControllerBase {

  /**
   * Callback function modal
   * to open modal window
   */
  public function modal($key = null) {
    $options = [
      'dialogClass' => 'popup-dialog-class',
      'width' => '50%',
    ];
    $response = new AjaxResponse();
    $response->addCommand(new OpenModalDialogCommand(t('Modal title'), t('The modal text'), $options));
    
    return $response;
  }
  /**
   * Callback function getTitle
   * for dynamic page title
   */
  public function getTitle(){
    $current_user = \Drupal::currentUser();
    $cuid = $current_user->Id();
    $uid = $current_user->Id();
    if(isset($_GET['uid'])){
      $uid = $_GET['uid'];
    }
    if($uid == $cuid && $cuid !== 1){
      $user =  \Drupal\user\Entity\User::load($uid);
      $conn = \Drupal::database();
      $query = $conn->select('affiliate_program', 'ap')
        ->condition('uid', $uid)
        ->condition('admin_approved', 1)
        ->fields('ap');
      $record = $query->execute()->fetchAssoc();
      if($record){
        return  $this->t('Affiliate Program');
      }
    }
    return  $this->t('Affiliate Program Application');
  }
  /**
   * Callback function affiliateJoin
   * for Affiliate registration
   */
  public function affiliateJoin(){
    $build = array();
    $build['#markup'] = $this->t('Coming Soon!');
    return $build;
  }
}