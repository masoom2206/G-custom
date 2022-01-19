<?php
namespace Drupal\video_maker_tool\Controller;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\field\Entity\FieldConfig;
use Drupal\Core\Render\Markup;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\taxonomy\Entity\Term;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;

class VideoDebugController extends ControllerBase {
  /**
   * Returns product templates page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function debugTransition(){
    $video_id = 152;
    // get last transition first and then sequentially 
    $tquery = \Drupal::database()->select('vmt_transition', 'vt');
    $tquery->leftJoin('taxonomy_term_field_data', 'tt', "tt.vid = 'video_transitions' AND tt.tid = vt.transition_option");
    $tquery->fields('vt', ['video_id', 'mid', 'rid', 'transition_duration', 'transition_option', 'ordering', 'is_first_clip', 'is_last_clip']);
    $tquery->fields('tt', ['name']);
    $tquery->condition('vt.video_id', $video_id, '=');
    $tquery->condition('vt.is_transition_applied', 0, '=');
    $tquery->orderBy('vt.is_last_clip', 'desc');
    $tquery->orderBy('vt.ordering', 'asc');
    $tquery->range(0, 1);
    $transition = $tquery->execute()->fetchObject();
    
    if(empty($transition)) {
      // update processing phase
      \Drupal::database()->update('vmt_videos')
        ->condition('video_id', $video_id)
        ->condition('processing_phase', 'Transition')
        ->fields(['processing_phase' => 'Join-video'])
        ->execute();
      die('No video clip is available for applying transition.');
    }
    
    // get transition name
    $transition_name = empty($transition->name) ? 'none' : strtolower(preg_replace('/[^a-z0-9-]/i', '', $transition->name));
    // Fade-in first clip
    if(($transition->is_first_clip == 1) && ($transition_name <> 'none')) {
      $transition_name = 'fade-in';
    }
    // Fade-out last clip
    if(($transition->is_last_clip == 1) && ($transition_name <> 'none')){
      $transition_name = 'fade-out';
    }
    // set transition name
    $transition->name = $transition_name;
    // get media ordering
    $ordering = ($transition->is_first_clip == 1) ? 1 : ($transition->ordering -1);
    
    //echo '<pre>'; print_r($transition); echo '</pre>';
    
    // media query
    $query = \Drupal::database()->select('vmt_media', 'm');
    $query->fields('m', ['id', 'video_id', 'video_clip_path', 'transition_video', 'duration', 'ordering']);
    $query->condition('m.video_id', $video_id, '=');
    $query->isNotNull('m.video_clip_path');
    
    switch($transition_name){
      case 'none':
        $config = \Drupal::config('s3fs.settings')->get();
        $s3fs = \Drupal::service('s3fs')->getAmazonS3Client($config);
        \Drupal::logger('VMT:No-Transition')->debug('<pre><code>' . print_r(1, TRUE) . '</code></pre>');
        $query->condition('m.ordering', $ordering);
        $media = $query->execute()->fetchObject();
        if(!empty($media)){
          \Drupal::logger('VMT:No-Transition')->debug('<pre><code>' . print_r(2, TRUE) . '</code></pre>');
          // update transition table
          \Drupal::database()->update('vmt_transition')
            ->condition('video_id', $transition->video_id)
            ->condition('mid', $transition->mid)
            ->condition('rid', $transition->rid)
            ->fields(['is_transition_applied' => 1])
            ->execute();
          
          // track transition
          $response = ['vid' => $media->video_id, 'cmd' => 'No transition is applied!', 'output_file' => null, 'output_value' => null, 'return_value' => 0];
          \Drupal::service('video.making.process')->trackProcessingStage($response, 'transition');
          
          // update media table
          $transition_video = $media->video_clip_path;
          $s3fs_file_url = $s3fs->getObjectUrl($config['bucket'], $transition_video); 
          \Drupal::database()->update('vmt_media')
            ->condition('id', $media->id)
            ->condition('video_id', $media->video_id)
            ->condition('video_id', $media->video_id)
            ->isNull('transition_video')
            ->fields(['transition_video' => $transition_video, 'transition_video_s3fsurl' => $s3fs_file_url, 'join_video_flag' => 1])
            ->execute();
        }
        
      echo 1;
      break;
      
      case 'fade-in':
        \Drupal::logger('VMT:fade-in')->debug('<pre><code>' . print_r(1, TRUE) . '</code></pre>');
        $query->condition('m.ordering', $ordering);
        $media = $query->execute()->fetchObject();
        if(!empty($media)){
          \Drupal::logger('VMT:fade-in')->debug('<pre><code>' . print_r(2, TRUE) . '</code></pre>');
          $response = \Drupal::service('video.making.process')->applyFadein($media, $transition);
        }
      echo 2;
      break;
      
      case 'fade-out':
        \Drupal::logger('VMT:fade-out')->debug('<pre><code>' . print_r(1, TRUE) . '</code></pre>');
        $query->condition('m.ordering', $ordering);
        $media = $query->execute()->fetchObject();
        if(!empty($media)){
          \Drupal::logger('VMT:fade-out')->debug('<pre><code>' . print_r(2, TRUE) . '</code></pre>');
          $response = \Drupal::service('video.making.process')->applyFadeout($media, $transition);
        }
      echo 3;
      break;
      
      default:
        $nextone = $ordering + 1;
        $query->condition($query->orConditionGroup()->condition('m.ordering', $ordering)->condition('m.ordering', $nextone));
        $query->orderBy('m.ordering', 'asc');
        $media = $query->execute()->fetchAll();
        \Drupal::logger('VMT:cross-fade')->debug('<pre><code>' . print_r(1, TRUE) . '</code></pre>');
        if(is_array($media) && (count($media) == 2)){
          \Drupal::logger('VMT:cross-fade')->debug('<pre><code>' . print_r(2, TRUE) . '</code></pre>');
          $response = \Drupal::service('video.making.process')->applyTransition($media, $transition);
        }
      echo 4;
    }
    
    
    $query = \Drupal::database()->select('vmt_media', 'm');
    $query->fields('m', ['id', 'video_id', 'video_clip_path', 'transition_video', 'duration', 'ordering']);
    $query->condition('m.video_id', $video_id, '=');
    $media = $query->execute()->fetchAll();
    echo '<pre>'; print_r($media); echo '</pre>';
    
    // remove data from temporary directory
    \Drupal::service('video.making.process')->removeTempData($video_id);
    die('Transition is applied successfully.');
  }
  
  /**
   * Returns product templates page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function debugProcess(){
    $file_key_path = 's3fs_public/vmt/process/79/kitchenbanner.jpg';
    $file_path = \Drupal::service('video.making.process')->downloadFromS3Bucket(79, $file_key_path);
    echo $file_path;
    die('here');
  }
  
  /**
   * Returns product templates page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function listingVideo(){
    global $base_secure_url;
    $account = \Drupal::currentUser();
    $uid = $account->id();
    $variables = [];
    
    $status = \Drupal::request()->query->get('status');
    $status = in_array($status, ['Saved', 'Pending', 'Ready', 'Failed']) ? $status : 'Saved'; 
    $variables['status'] = $status;
    
    $vquery = \Drupal::database()->select('vmt_videos', 'v');
    $vquery->fields('v');
    $vquery->condition('v.render_status', $status, '=');
    $vquery->orderBy('v.video_id', 'desc');
    $pager_query = $vquery->extend('Drupal\Core\Database\Query\PagerSelectExtender')->limit(25);
    $variables['video'] = $pager_query->execute()->fetchAll();
    $variables['pagination'] = ['pager' => ['#type' => 'pager']];
    
    // theme
    $render_data['theme_data'] = [
      '#theme'                  => 'debug-video-listing',
      '#variables'              => $variables,
      '#attached'               => ['library' => ['video_maker_tool/vmt.debug']],
    ];

    return $render_data;    
	}
  
  /**
   * Returns product templates page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function processingDetail($video_id){
    global $base_secure_url;
    $account = \Drupal::currentUser();
    $uid = $account->id();
    
    $variables = [];    
    $vquery = \Drupal::database()->select('vmt_videos', 'v');
    $vquery->fields('v');
    $vquery->condition('v.video_id', $video_id, '=');
    $video = $variables['video'] = $vquery->execute()->fetchObject();
    if(empty($video)){
      throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException();
    }

    $mquery = \Drupal::database()->select('vmt_media', 'm');
    $mquery->fields('m');
    $mquery->condition('m.video_id', $video_id, '=');
    $mquery->orderBy('m.ordering', 'ASC');
    $variables['media'] = $mquery->execute()->fetchAll();

    $pquery = \Drupal::database()->select('vmt_processing_stages', 'p');
    $pquery->fields('p');
    $pquery->condition('p.video_id', $video_id, '=');
    $variables['processing_stages'] = $pquery->execute()->fetchAll();
    //echo '<pre>'; print_r($variables); echo '<pre>'; die();
    
    // theme
    $render_data['theme_data'] = [
      '#theme'                  => 'debug-video-maker',
      '#variables'              => $variables,
      '#attached'               => ['library' => ['video_maker_tool/vmt.debug']],
    ];

    return $render_data;    
	}
  
  /**
   * Returns product templates page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function cleanupProcessing($video_id){
    $vquery = \Drupal::database()->select('vmt_videos', 'v');
    $vquery->fields('v', ['video_id', 'video_name', 'media_preset_id', 'render_status']);
    $vquery->condition('v.video_id', $video_id, '=');
    $video = $vquery->execute()->fetchObject();
    if(empty($video)){
      throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException();
    }
    
    if($video->render_status == 'Saved') {
      //die('There is no need to cleanup of video processing data.');
      //\Drupal::messenger()->addStatus(t("There is no need to cleanup of video processing data.\n"));
    } else {
      // update media table
      \Drupal::database()->update('vmt_media')
      ->condition('video_id', $video_id)
      ->fields(['fid' => 0, 'file_uri' => NULL, 'file_real_path' => NULL, 'video_clip_path' => NULL, 'transition_video' => NULL, 'transition_video_s3fsurl' => NULL, 'join_video_flag' => 0])
      ->execute();
      
      // update transition table
      \Drupal::database()->update('vmt_transition')
      ->condition('video_id', $video_id)
      ->fields(['is_transition_applied' => 0])
      ->execute();
      
      // update video table
      \Drupal::database()->update('vmt_videos')
      ->condition('video_id', $video_id)
      ->fields(['render_status' => 'Pending', 'processing_phase' => 'Pending', 'video_path' => NULL, 'video_url' => NULL, 'in_process' => 0, 'is_manual_process' => 0])
      ->execute();
      
      // remove log data from processing_stages table
      \Drupal::database()->delete('vmt_processing_stages')
      ->condition('video_id', $video_id)
      ->execute();
      
      // remove log data from processing_stages table
      \Drupal::database()->delete('transcoding_jobs_data')
      ->condition('mid', $video_id)
      ->condition('type', 'video-maker')
      ->execute();
      
      // cleanup temp directory
      $tmp_dir = \Drupal::service('video.making.process')->getRealPath($video_id);
      $rdcmd = "rm -dr $tmp_dir 2>&1";
      exec($rdcmd, $output_value, $return_value);
      //die('Cleanup of video processing data is done.');
      //\Drupal::messenger()->addStatus(t("Cleanup of video processing data is done.\n"));
    }
    
    if(\Drupal::routeMatch()->getRouteName() == 'debug.video.maker.cleanup'){
      die('Cleanup of video processing data is done.');
    }
  }
}
