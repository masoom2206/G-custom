<?php 
namespace Drupal\video_maker_tool\Controller;
use Symfony\Component\HttpFoundation\Response;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;

class ClassPrepareElement {
  /**
   * get requested video
   *
   * @params null
   * @return Video ID
   */
  public function getVideoForProcessing($phase = 'Initiate') {
    $video_id = (int)\Drupal::request()->query->get('vid');
    if(empty($video_id)){
      $video_id = $this->getCurrentProcessingVideo();
      if($video_id > 0) {
        die("Currently video: {$video_id} is in process.");
      }else{
        // add the first requested video into processing queue
        $this->addProcessingQueue('Initiate');
        $video_id = $this->getCurrentProcessingVideo();
      }
    }else{
      // set manual process flag for the selected pending render video
      \Drupal::database()->update('vmt_videos')
      ->fields(['processing_phase' => 'Initiate', 'in_process' => 1, 'is_manual_process' => 1])
      ->condition('video_id', $video_id)
      ->condition('render_status', 'Pending', '=')
      ->condition('processing_phase', 'Pending', '=')
      ->execute();
    }
    
    return $video_id;
  }
  
  /**
   * get requested video
   *
   * @params null
   * @return Video ID
   */
  public function getCurrentProcessingVideo() {
    // get current processing video
    $query = \Drupal::database()->select('vmt_videos', 'v');
    $query->fields('v', ['video_id']);
    $query->condition('v.render_status', 'Pending', '=');
    $query->condition('v.in_process', 1, '=');
    $query->orderBy('v.is_manual_process', 'DESC');
    $query->range(0, 1);
    $video = $query->execute()->fetchObject();
    
    if(empty($video)){
      return 0;
    }else{
      return $video->video_id;
    } 
  }
  
  /**
   * add the first requested video into processing queue
   *
   * @params null
   * @return Video ID
   */
  public function addProcessingQueue($phase) {
    // get current processing video 
    $video_id = $this->getCurrentProcessingVideo();
    if($video_id == 0) {
      // get the first requested video
      $vquery = \Drupal::database()->select('vmt_videos', 'v')
        ->fields('v', ['video_id'])
        ->condition('v.render_status', 'Pending', '=')
        ->condition('v.in_process', 0, '=')
        ->orderBy('v.render_date', 'ASC')
        ->range(0, 1)
        ->execute(); 
      $video = $vquery->fetchObject();
      
      // add the first requested video into processing queue
      if(!empty($video)){
        \Drupal::database()->update('vmt_videos')
        ->fields(['processing_phase' => $phase, 'in_process' => 1])
        ->condition('video_id', $video->video_id)
        ->execute();
      }
    }
  }
  
  /**
   * get requested video
   *
   * @params null
   * @return Video ID
   */
  public function getProcessingVideo($phase) {
    $query = \Drupal::database()->select('vmt_videos', 'v');
    $query->fields('v', ['video_id']);
    $query->condition('v.render_status', 'Pending', '=');
    $query->condition('v.processing_phase', $phase, '=');
    $query->condition('v.in_process', 1, '=');
    $query->orderBy('is_manual_process', 'DESC');
    $query->range(0, 1);
    $video = $query->execute()->fetchObject();
    
    if(empty($video)){
      return 0;
    }else{
      return $video->video_id;
    }
  }
  
  /**
   * get processing video
   *
   * @params null
   * @return Video ID
   */
  public function getProcessingVideoID($phase) {
    $video_id = $this->getProcessingVideo($phase);
    if(empty($video_id)){      
      die('Nothing to do now.');
    }else{
      \Drupal::logger('VMT:getProcessingVideoID')->debug("The video: {$video_id} is in \"{$phase}\" processing phase.");
    }
    return $video_id; 
  }
}
