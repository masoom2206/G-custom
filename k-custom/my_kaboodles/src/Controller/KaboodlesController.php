<?php

/**
 * @file
 * Contains \Drupal\my_kaboodles\Controller\KaboodlesController.php
 *
 */

namespace Drupal\my_kaboodles\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;
use Drupal\image\Entity\ImageStyle;
use Drupal\Core\Access\AccessResult;
use Drupal\s3fs\S3fsService;

/**
 * Defines KaboodlesController class.
 */
class KaboodlesController extends ControllerBase{
  /**
  * Display the my-kaboodles page markup.
  *
  * @return array
  */
  public function content(AccountInterface $user, int $kaboodle_archive) {
    $me       = \Drupal::currentUser();
    $my_roles = $me->getRoles();
    $uid      = \Drupal::currentUser()->id();
    // get user 
    $user_id = $user->get('uid')->value;
    if (!empty($user_id) && in_array('administrator', $my_roles)) {
      $uid = $user_id;
    }
    
    $data = $this->my_kaboodle_content_query($uid, 0, 'kaboodle_list');
    $archived_data = $this->my_kaboodle_content_query($uid, 1, 'kaboodle_archived_list');
    $element = 901;
    $foo = '';
    $ret = array();
    $archived_ret = array();
    if (empty($data)) {
      // in case of no Kaboodle, just display a message 
      $shared_block = $this->my_kaboodle_shared_content($uid);
      return [
        '#theme' => 'my_kaboodles_template',
        '#foo'   => $this->t('empty data - ' . $foo),
        '#uid'   => $uid,
        '#archive' => $kaboodle_archive,
        '#shared_block' => $shared_block,
        '#pager' => [
            '#type' => 'pager',
            '#element' => $element,
        ],
      ];
    } else {
      // list Kaboodles
      foreach ($data as $row) {
        $out = array();
        $out['title'] = $row->get('title')->value;
        
        $nid = $row->id();
        $img_val = $row->get('field_cover_image')->referencedEntities();
        $mid     = $img_val[0]->get('mid')->value;
       // $url = 'https://s3.us-west-2.amazonaws.com/kaboodlemedia.dev.test/s3fs_public/default_images/kaboodle1000x1000.png';
        $config = \Drupal::config('s3fs.settings')->get();
        $s3 = s3fsService::getAmazonS3Client($config);
        $key = 's3fs_public/default_images';
        $url = $s3->getObjectUrl($config['bucket'], $key).'/kaboodle1000x1000.png';
        if($mid){
          $media   = Media::load($mid);
          $fid     = $media->getSource()->getSourceFieldValue($media);
          if($fid){
            $file    = File::load($fid);
            $image_uri = $file->getFileUri();
            $style = ImageStyle::load('my_kaboodles');
            // Get URL.
            $url = $style->buildUrl($image_uri);
          }
        }
        $out['img']  = $url;
        $out['nid']  = $nid;
        $ret[] = $out;
      }
			
			// Archived list Kaboodles
      foreach ($archived_data as $archived_row) {
        $archived_out = array();
        $archived_out['title'] = $archived_row->get('title')->value;
        
        $nid = $archived_row->id();
        $img_val = $archived_row->get('field_cover_image')->referencedEntities();
        $mid     = $img_val[0]->get('mid')->value;
        //$url = 'https://s3.us-west-2.amazonaws.com/kaboodlemedia.dev.test/s3fs_public/default_images/kaboodle1000x1000.png';
        $config = \Drupal::config('s3fs.settings')->get();
        $s3 = s3fsService::getAmazonS3Client($config);
        $key = 's3fs_public/default_images';
        $url = $s3->getObjectUrl($config['bucket'], $key).'/kaboodle1000x1000.png';
        if($mid){
          $media   = Media::load($mid);
          $fid     = $media->getSource()->getSourceFieldValue($media);
          if($fid){
            $file    = File::load($fid);
            $image_uri = $file->getFileUri();
            $style = ImageStyle::load('my_kaboodles');
            // Get URL.
            $url = $style->buildUrl($image_uri);
          }
        }
        $archived_out['img']  = $url;
        $archived_out['nid']  = $nid;
        $archived_ret[] = $archived_out;
      }
      
      // TODO SHARED KABOODLES
      // TODO PAGING
      $element = '901';
      $shared_block = $this->my_kaboodle_shared_content($uid);
      return [
        'results' => [
          '#theme' => 'my_kaboodles_template',
          '#foo'   => $this->t('bar - ' . $foo ),
          '#data'  => $ret,
          '#archived_data'  => $archived_ret,
          '#uid'   => $uid,
          '#archive' => $kaboodle_archive,
          '#shared_block' => $shared_block,
          '#pager' => [
              '#type' => 'pager',
              '#element' => $element,
          ],
        ],
      ];
    }
  }
  
  /**
   * Callback function my_kaboodles_shared_content()
   * for shared kaboodles
   **/
  public function my_kaboodle_shared_content($uid){
    $foo = '';
    $ret = array();
    $kaboodle_archive = 0;
    $data = $this->my_kaboodle_content_query($uid, $kaboodle_archive, 'kaboodle_shared_list');
    if (empty($data)) {
      return [
        '#theme'   => 'my_kaboodles_shared_template',
        '#foo'     => $this->t('no shared kaboodles - ' . $foo),
        '#uid'     => $uid,
      ];
    }
    else {
      if (empty($data)) {
        return [
          '#theme' => 'my_kaboodles_shared_template',
          '#foo'   => $this->t('empty data - ' . $foo),
          '#uid'   => $uid,
        ];
      }
      else {
        foreach ($data as $row) {
          $out = array();
          $out['title'] = $row->get('title')->value;
          
          $owner_id = $row->getOwnerId();
          $fname = $row->getOwner()->field_first_name->value;
          $lname = $row->getOwner()->field_last_name->value;
          
          $nid = $row->id();
          $img_val = $row->get('field_cover_image')->referencedEntities();
          $mid     = $img_val[0]->get('mid')->value;
          $config = \Drupal::config('s3fs.settings')->get();
          $s3 = s3fsService::getAmazonS3Client($config);
          $key = 's3fs_public/default_images';
          $url = $s3->getObjectUrl($config['bucket'], $key).'/kaboodle1000x1000.png';
          if($mid){
            $media   = Media::load($mid);
            $fid     = $media->getSource()->getSourceFieldValue($media);
            if($fid){
              $file    = File::load($fid);
              $image_uri = $file->getFileUri();
              $style = ImageStyle::load('my_kaboodles');
              // Get URL.
              $url = $style->buildUrl($image_uri);
            }
          }
          $out['img']  = $url;
          $out['nid']  = $nid;
          $out['owner_id'] = $owner_id;
          $out['sharedby'] = $fname.' '.$lname;
          $ret[] = $out;
        }
        $element = '902';
        return [
          'results' => [
            '#theme' => 'my_kaboodles_shared_template',
            '#foo'   => $this->t('bar - ' . $foo ),
            '#data'  => $ret,
            '#uid'   => $uid,
            '#archive' => $kaboodle_archive,
            '#pager' => [
              '#type' => 'pager',
              '#element' => $element,
            ],
          ],
        ];
      }
    }
  }
  
  /**
   * Callback function my_kaboodles_shared_content_query()
   * to fetch the shared kaboodles from database
   **/
  public function my_kaboodle_content_query($uid, $kaboodle_archive, $list) {
    $entity_ids = array();
    $data = array();
    if($list == 'kaboodle_list'){
      $query = \Drupal::entityQuery('node');

      $query->condition('status', 1);
      $query->condition('uid', $uid);
      $query->condition('type', 'kaboodle');

      if (empty($kaboodle_archive)) {
          $group = $query->orConditionGroup()
                  ->notExists('field_archived')
                  ->condition('field_archived', '0', '=');
          $query->condition($group);
      }
      $element = '901';
      $entity_ids = $query->pager(12, $element)->execute();
    } 
		else if($list == 'kaboodle_archived_list'){
      $query = \Drupal::entityQuery('node');

      $query->condition('status', 1);
      $query->condition('uid', $uid);
      $query->condition('type', 'kaboodle');
			$query->condition('field_archived', 1, '=');
      $element = '901';
      $entity_ids = $query->pager(12, $element)->execute();
    }
    else if($list == 'kaboodle_shared_list'){
      // get teams
      /* $teams = \Drupal::database()->select('group_content_field_data', 'gm')
			  ->join('team_membership_status', 'tms', "tms.team_id = gm.gid AND tms.member_id = gm.entity_id")
        ->fields('gm', ['gid'])
        ->condition('gm.entity_id', $uid, '=')
        ->condition('gm.type', 'team-group_membership', '=')
				->condition('tms.status', 1, '=')
        ->groupBy('gm.gid')
        ->execute()->fetchAll(); */
			//$teams = getConfirmedTeams($uid);
			$teams = getInvitedTeams($uid);
      $gids = [];
      if(!empty($teams)){
        foreach($teams as $team){
          $gids[] = $team->gid;
        }
      }
      // get nodes
      if(!empty($gids)){
        $query = \Drupal::entityQuery('node');
        $query->condition('status', 1);
        $query->condition('uid', $uid, '<>');
        if(!empty($gids)){
          $query->condition('field_team', $gids, 'IN');
        }
        $query->condition('type', 'kaboodle');
        $element = '902';
        $entity_ids = $query->pager(4)->execute();
      }
    }
    else {
      $query = \Drupal::entityQuery('node');
      $query->condition('status', 1);
      $query->condition('uid', $uid);
      $query->condition('type', 'kaboodle');
      $element = '902';
      $entity_ids = $query->pager(4, $element)->execute();
    }
    
    if(!empty($entity_ids)){
      $data = \Drupal::entityTypeManager()->getStorage('node')->loadMultiple($entity_ids);
    }
    return $data;
  }
	
	/**
	 * Custom access callback for my kaboodles page
	 */
	public function kaboodles_access(AccountInterface $account, $user){
    $roles = $account->getRoles();
    if(in_array('administrator', $roles) || in_array('va_manager', $roles)){
      return AccessResult::allowed();
    }
    else if ($account->id() == $user && (in_array('content_creator', $roles) || in_array('advanced_content_creator', $roles) || in_array('designer', $roles) || in_array('enterprise', $roles)) ) {
      return AccessResult::allowed();
    }
    else{
      return AccessResult::forbidden();
    }
  }
}
