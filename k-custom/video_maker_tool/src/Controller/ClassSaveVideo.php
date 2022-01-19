<?php 
namespace Drupal\video_maker_tool\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\media\Entity\Media;

class ClassSaveVideo {
  public function __construct($data){
    $this->request = $data;
  }
  
  /**
   * Save video data
   *
   * @params null
   * @return Video ID
   */
  public function save() {
    if(isset($_GET['team'])){
      $uid = $_GET['uid'];
    }
    else {
      $uid = \Drupal::currentUser()->id();
    }
    $time = time(); 
    $video_id = $this->request->request->get('video_id');
    $video_name = $this->request->request->get('video_name');
    $media_preset_id = $this->request->request->get('media_preset');
    $save_as_template = $this->request->request->get('save_as_template');
    $save_as_template = empty($save_as_template) ? 0 : 1;
    $selected_mid = $this->request->request->get('selected_mid');
    $selected_rid = $this->request->request->get('selected_rid');
    $media_type = $this->request->request->get('media_type');
    $transcoder_specs = $this->request->request->get('transcoder_specs');
    $media_duration   = $this->request->request->get('media_duration');
    $clip_zoom   = $this->request->request->get('clip_zoom');
    //$clip_duration  = $this->request->request->get('clip_duration'); 
	
    // transition tab data
    $transitions = [];
    $transitions['transition']  = $this->request->request->get('transition');
    $transitions['mid']         = $this->request->request->get('transition_mid');
    $transitions['rid']         = $this->request->request->get('transition_rid');
    $transitions['duration']    = $this->request->request->get('transition_duration');
    $transitions['option']      = $this->request->request->get('transition_option');
    
    // get soundtrack data 
    $sound_track_data = $this->request->request->get('soundtrack-data');
    if($sound_track_data){
      $soundtrak_array = json_decode( $sound_track_data, true );
      $soundtrak_array['fadein']  = $this->request->request->get('first_sound');
      $soundtrak_array['fadeout'] = $this->request->request->get('last_sound');
      $soundtrak_array['loop'] = $this->request->request->get('loop_sound');
      $soundtrak_array['vol'] = $this->request->request->get('volume-sound');
      $sound_track_data = json_encode($soundtrak_array);	
    }
    
    // media files in story board
    $mids = $this->request->request->get('mids');
    // clip tab data
    $start_time     = 0;
    $zoom           = 0;
    $volume         = 0;
    // just for the selected element
    if($media_type == 'video'){
      $start_time     = $this->request->request->get('start_time');
      $zoom           = empty($this->request->request->get('zoom')) ? 0 : $this->request->request->get('zoom');
      $volume         = empty($this->request->request->get('volume')) ? 0 : $this->request->request->get('volume');
      $raw_data       = $this->request->request->get('cropped-vdo');
    }elseif($media_type == 'image'){
      $start_time     = 0;
      $raw_data = $this->request->request->get('cropped-img');
    }else{
      
    }
    
    if($video_id == 0){
      $video_id = \Drupal::database()->insert('vmt_videos')
      ->fields([
          'user_id'           => $uid,  
          'video_name'        => $video_name,
          'media_preset_id'   => $media_preset_id,
          'transcoder_specs'  => $transcoder_specs,
          'save_as_template'  => $save_as_template,
          'sound_track'       => $sound_track_data,
          'created'           => $time,
          'updated'           => $time,
      ])
      ->execute();
      
      // update transitions 
      $this->saveTransition($video_id, $transitions, 'add');
    }else{
      \Drupal::database()->update('vmt_videos')
      ->fields([
          'video_name'        => $video_name,
          'media_preset_id'   => $media_preset_id,
          'transcoder_specs'  => $transcoder_specs,
          'save_as_template'  => $save_as_template,
          'sound_track'       => $sound_track_data,
          'updated'           => $time,
      ])
      ->condition('video_id', $video_id, '=')
      ->execute();
      
      // delete media those removed from story board
      $this->removedMedia($video_id, $mids);
      
      // update transitions 
      $this->saveTransition($video_id, $transitions, 'edit');
      
      // sync media name with video name
      $this->syncMediaName($video_id, $video_name);
    }
    
    // save media from story board
    $ordering = 0;
    foreach($mids as $rid => $mid) {
      $ordering++;
      // media fields
      $media_fields = [];
      // duration and end time
      $duration = empty($media_duration[$rid]) ? 5 : $media_duration[$rid];
      $media_fields['duration']   = $duration;
      if(($selected_mid == $mid) && ($selected_rid == $rid)){
        $media_fields['start_time'] = $start_time;
        $media_fields['type']       = $media_type;
        $media_fields['zoom']       = $zoom;
        $media_fields['volume']     = $volume;
        $media_fields['crop_params']   = $raw_data;
        $media_fields['selected']   = 1;
      }else{
        $media_fields['selected']   = 0;
      }
      $clip_zoom_effect = empty($clip_zoom[$rid]) ? 'no-zoom' : $clip_zoom[$rid];
      $media_fields['clip_zoom']   = $clip_zoom_effect;
      $media_fields['ordering'] = $ordering;
      
      \Drupal::database()->merge('vmt_media')
      ->keys(['video_id' => $video_id, 'mid' => $mid, 'rid' => $rid])
      ->fields($media_fields)
      ->execute();
    }
    
    return $video_id; 
  }
  
  
  /**
   * save transition
   *
   * @params null
   * @return null
   */
  public function saveTransition($video_id, $data, $action) {
    $transitions          = $data['transition'];
    $transition_mid       = $data['mid'];
    $transition_rid       = $data['rid'];
    $transition_duration  = $data['duration'];
    $transition_option    = $data['option'];
    
    // delete transition those removed from story board
    $this->removedTransition($video_id, $transitions);

    $total_transitions = count($transitions);
    $transition_count = 0;
    $ordering = 0;
    foreach($transitions as $rid => $mid) {
      $transition_count++;
      $ordering++;
      
      $transition_fields = [];
      // first or last clip
      $transition_fields['is_first_clip'] = ($transition_count == 1) ? 1 : 0;
      $transition_fields['is_last_clip']  = ($transition_count == $total_transitions) ? 1 : 0;
      
      if($action == 'add'){
        $transition_fields['transition_duration'] = $transition_duration;
        $transition_fields['transition_option']   = $transition_option;
      }else{
        if(($transition_mid == $mid) && ($transition_rid == $rid)){
          $transition_fields['transition_duration'] = $transition_duration;
          $transition_fields['transition_option']   = $transition_option;  
        }
      }
      // set ordering
      $transition_fields['ordering'] = $ordering;
      
      \Drupal::database()->merge('vmt_transition')
      ->keys(['video_id' => $video_id, 'mid' => $mid, 'rid' => $rid])
      ->fields($transition_fields)
      ->execute();
    }
  }
  
  
  /**
   * remove media from story board
   *
   * @params null
   * @return null
   */
  public function removedMedia($video_id, $medias) {
    $mids = array_values($medias);
    $rids = array_keys($medias);
    $query = \Drupal::database()->delete('vmt_media');
    $query->condition('video_id', $video_id);
    $group = $query->orConditionGroup()
      ->condition('mid', $mids, 'NOT IN')
      ->condition('rid', $rids, 'NOT IN');
    $query->condition($group);
    $query->execute();
  }
  
  /**
   * remove media from story board
   *
   * @params null
   * @return null
   */
  public function removedTransition($video_id, $transitions) {
    $mids = array_values($transitions);
    $rids = array_keys($transitions);
    $query = \Drupal::database()->delete('vmt_transition');
    $query->condition('video_id', $video_id);
    $group = $query->orConditionGroup()
      ->condition('mid', $mids, 'NOT IN')
      ->condition('rid', $rids, 'NOT IN');
    $query->condition($group);
    $query->execute();
  }
  
  /**
   * sync media name with video name
   *
   * @params null
   * @return null
   */
  public function syncMediaName($video_id, $video_name) {
    $video_media_id = \Drupal::database()->select('vmt_videos', 'v')
      ->fields('v', ['video_media_id'])
      ->condition('v.video_id', $video_id, '=')
      ->execute()->fetchField();
    
    if(!empty($video_media_id)){
      $media = Media::load($video_media_id);
      if(!empty($media)){
        $media->set('name', $video_name);
        $media->save();
      }
    }    
  }
  
}

