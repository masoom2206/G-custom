<?php
namespace Drupal\video_maker_tool\Controller;
use Drupal\Core\Controller\ControllerBase;
use Drupal\video_maker_tool\Controller\ClassPrepareElement;
use Drupal\video_maker_tool\Controller\ClassTranscoder;
use Drupal\video_maker_tool\Controller\ClassCropMedia;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\taxonomy\Entity\Term;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;
use Drupal\Core\Url;


class GenerateVideoController extends ControllerBase {
  /**
   * generate video constructor
   *
   * @params request data
   * @return null
   */
  public function __construct(){
    $this->objElement     = new ClassPrepareElement();
    $this->objCropMedia   = new ClassCropMedia();
    $this->objTranscoder  = new ClassTranscoder();
    $this->objRender      = new ClassRenderVideo();
  }
  
  /**
   * STEP 1: initiate video making / save media files to temporary directory
   *
   * @params request data
   * @return null
   */
	public function initVideoMaking(){    
    // pickup new video for processing
    $video_id = $this->objElement->getVideoForProcessing();
    if(empty($video_id)){
      $this->logCronExecution(0, 'STEP 1: initiate video making but no video is pending to process now');
      die("Nothing to initiate now.");
    }else{
      $this->logCronExecution($video_id, 'STEP 1: initiate video making and save media files to temporary directory');      
      // update processing phase
      \Drupal::database()->update('vmt_videos')
        ->condition('video_id', $video_id)
        ->condition('processing_phase', 'Initiate')
        ->fields(['processing_phase' => 'Crop-image'])
        ->execute();
        
      die("All media files have been saved into temporary directory for video: {$video_id}.");
    } 
	}	
	
  /**
   * STEP 2: crop image and generate video clip
   *
   * @params request data
   * @return null
   * https://stackoverflow.com/questions/25891342/creating-a-video-from-a-single-image-for-a-specific-duration-in-ffmpeg
   * ffmpeg -loop 1 -i image.png -c:v libx264 -t 15 -pix_fmt yuv420p -vf scale=320:240 out.mp4
   */
	public function editPhotoClip(){
    $video_id = $this->objElement->getProcessingVideoID('Crop-image');
    $this->logCronExecution($video_id, 'STEP 2: crop image and generate video clip');
    // generate video clip
    $query = \Drupal::database()->select('vmt_media', 'm');
    $query->innerJoin('media_field_data', 'mfd', 'mfd.mid = m.mid');
    $query->fields('m', ['id', 'mid', 'video_id', 'start_time', 'duration', 'zoom', 'volume', 'crop_params', 'clip_zoom']);
    $query->condition('m.video_id', $video_id, '=');
    $query->isNull('m.video_clip_path');
    $query->condition('mfd.bundle', 'image');
    $query->orderBy('m.ordering', 'asc');
    $query->range(0, 1);
		$media = $query->execute()->fetchObject();
    
		if(empty($media)){
      // update processing phase
      \Drupal::database()->update('vmt_videos')
        ->condition('video_id', $video_id)
        ->condition('processing_phase', 'Crop-image')
        ->fields(['processing_phase' => 'Crop-video'])
        ->execute();
      die('Video clip generation from images is already completed.');
		}
    
    // media preset dimension
    $preset_id = \Drupal::database()->select('vmt_videos', 'v')
      ->fields('v', ['media_preset_id'])
      ->condition('v.video_id', $video_id, '=')
      ->execute()->fetchField();
    $preset = \Drupal::service('media.preset')->getMediaPresetProperties($preset_id, 'array');
    $media->preset_width = $preset['width'];
    $media->preset_height = $preset['height'];
    $media->file_real_path = \Drupal::service('video.making.process')->downloadMediaFile($media);
    
    // crop image and generate video clip
    $this->objCropMedia->cropPhoto($media);
    // remove data from temporary directory
    \Drupal::service('video.making.process')->removeTempData($video_id);
    die('Photo converted to video successfully.');
	}
  
  
  /**
   * STEP 3: crop video and convert into mp4
   *
   * @params request data
   * @return null
   * https://stackoverflow.com/questions/25891342/creating-a-video-from-a-single-image-for-a-specific-duration-in-ffmpeg
   * ffmpeg -loop 1 -i image.png -c:v libx264 -t 15 -pix_fmt yuv420p -vf scale=320:240 out.mp4
   */
	public function editVideoClip(){
    $video_id = $this->objElement->getProcessingVideoID('Crop-video');
    $this->logCronExecution($video_id, 'STEP 3: crop video and convert into mp4');
    // generate video clip
    $query = \Drupal::database()->select('vmt_media', 'm');
    $query->innerJoin('media_field_data', 'mfd', 'mfd.mid = m.mid');
    $query->fields('m', ['id', 'mid', 'video_id', 'start_time', 'duration', 'zoom', 'volume', 'crop_params']);
    $query->condition('m.video_id', $video_id, '=');
    $query->isNull('m.video_clip_path');
    $query->condition('mfd.bundle', 'video');
    $query->orderBy('m.ordering', 'asc');
    $query->range(0, 1);
		$media = $query->execute()->fetchObject();
		if(empty($media)){
      // update processing phase
      \Drupal::database()->update('vmt_videos')
        ->condition('video_id', $video_id)
        ->condition('processing_phase', 'Crop-video')
        ->fields(['processing_phase' => 'Transition'])
        ->execute();
      die('Video clip conversion is already completed.'); 
		}
    
    // media preset dimension
    $preset_id = \Drupal::database()->select('vmt_videos', 'v')
      ->fields('v', ['media_preset_id'])
      ->condition('v.video_id', $video_id, '=')
      ->execute()->fetchField();
    $preset = \Drupal::service('media.preset')->getMediaPresetProperties($preset_id, 'array');
    $media->preset_width = $preset['width'];
    $media->preset_height = $preset['height'];
    $media->file_real_path = \Drupal::service('video.making.process')->downloadMediaFile($media);
    
    // crop video and convert into mp4
    $this->objCropMedia->cropVideo($media);
    // remove data from temporary directory
    \Drupal::service('video.making.process')->removeTempData($video_id);
		die('Video converted successfully.');
	}
  
  /**
   * STEP 4: apply transition between video clips
   * update vmt_transition set is_transition_applied = 0;
   * @params request data
   * @return null
   */
	public function applyTransition(){
    $video_id = $this->objElement->getProcessingVideoID('Transition');
    $this->logCronExecution($video_id, 'STEP 4: apply transition between video clips');
    // get last transition first and then sequentially 
    $tquery = \Drupal::database()->select('vmt_transition', 'vt');
    $tquery->leftJoin('taxonomy_term_field_data', 'tt', "tt.vid = 'video_transitions' AND tt.tid = vt.transition_option");
    $tquery->fields('vt');
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
    // check if any transition added 
    $alltquery = \Drupal::database()->select('vmt_transition', 'vt');
    $alltquery->fields('vt', ['transition_option']);
    $alltquery->condition('vt.video_id', $video_id, '=');
    $alltquery->condition('vt.transition_option', 0, '<>');
    $alltransition = $alltquery->execute()->fetchAll();
    if(!empty($alltransition)){
      // Fade-in first clip
      if(($transition->is_first_clip == 1) && ($transition_name <> 'none')) {
        $transition_name = 'fade-in';
      }
      // Fade-out last clip
      if(($transition->is_last_clip == 1) && ($transition_name <> 'none')){
        $transition_name = 'fade-out';
      }
      // for none, fade in and out between clips
      if(($transition->is_first_clip == 0) && ($transition->is_last_clip == 0)){
        //$transition_name = ($transition_name == 'none') ? 'xfade-none' : $transition_name;
        $transition_name = (($transition_name == 'fade-in') || ($transition_name == 'fade-out')) ? 'xfade-fade' : $transition_name;  
      }
    }
    
    // set transition name
    $transition->name = $transition_name;
    // get media ordering
    $ordering = ($transition->is_first_clip == 1) ? 1 : ($transition->ordering -1);
    
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
            ->isNull('transition_video')
            ->fields(['transition_video' => $transition_video, 'transition_video_s3fsurl' => $s3fs_file_url, 'join_video_flag' => 1])
            ->execute();
        }
      break;
      
      case 'fade-in':
        \Drupal::logger('VMT:fade-in')->debug('<pre><code>' . print_r(1, TRUE) . '</code></pre>');
        $query->condition('m.ordering', $ordering);
        $media = $query->execute()->fetchObject();
        if(!empty($media)){
          \Drupal::logger('VMT:fade-in')->debug('<pre><code>' . print_r(2, TRUE) . '</code></pre>');
          $response = \Drupal::service('video.making.process')->applyFadein($media, $transition);
        }
      break;
      
      case 'fade-out':
        \Drupal::logger('VMT:fade-out')->debug('<pre><code>' . print_r(1, TRUE) . '</code></pre>');
        $query->condition('m.ordering', $ordering);
        $media = $query->execute()->fetchObject();
        if(!empty($media)){
          \Drupal::logger('VMT:fade-out')->debug('<pre><code>' . print_r(2, TRUE) . '</code></pre>');
          $response = \Drupal::service('video.making.process')->applyFadeout($media, $transition);
        }
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
    }
    
    // remove data from temporary directory
    \Drupal::service('video.making.process')->removeTempData($video_id);
    die('Transition is applied successfully.');
	}
  
  /**
   * STEP 5: join video clips if required
   *
   * @params request data
   * @return null
   */
	public function joinVideoClips(){
    $video_id = $this->objElement->getProcessingVideoID('Join-video');
    $this->logCronExecution($video_id, 'STEP 5: join video clips if required');
    // join video clips if required
    $query = \Drupal::database()->select('vmt_media', 'm')
		  ->fields('m', ['transition_video', 'transition_video_s3fsurl'])
      ->condition('m.video_id', $video_id, '=')
		  ->isNotNull('m.transition_video')
		  ->condition('m.join_video_flag', 1)
      ->orderBy('m.ordering', 'asc')
		  ->execute();
		$media = $query->fetchAll();
    if(empty($media)) {
      die('No video generated.');
    }
    
    \Drupal::service('video.making.process')->joinVideo($video_id, $media);
    // update processing phase
    \Drupal::database()->update('vmt_videos')
      ->condition('video_id', $video_id)
      ->condition('processing_phase', 'Join-video')
      ->fields(['is_manual_process' => 0, 'processing_phase' => 'Send-transcode'])
      ->execute();
    
    // remove data from temporary directory
    \Drupal::service('video.making.process')->removeTempData($video_id);
    die('Final video generated successfully.');
	}
  
  
  /**
   * STEP 6: send video to aws trans-code
   *
   * @params request data
   * @return null
   */
  public function transcodeVideo(){
    $video_id = $this->objElement->getProcessingVideoID('Send-transcode');   
    $this->logCronExecution($video_id, 'STEP 6: send video to aws trans-code');
    // trans-code video
    $this->objTranscoder->transcodeVideo($video_id);
    
    // update processing phase
    \Drupal::database()->update('vmt_videos')
      ->condition('video_id', $video_id)
      ->condition('processing_phase', 'Send-transcode')
      ->fields(['processing_phase' => 'Finish-transcode'])
      ->execute();
      
    die('video sent to aws trans-code successfully.');
  }
  
  /**
   * STEP 7: finish trans-code and render video
   *
   * @params request data
   * @return null
   */
  public function finishTranscode() {
    $video_id = $this->objElement->getProcessingVideoID('Finish-transcode');
    $this->logCronExecution($video_id, 'STEP 7: finish trans-code and render video');
    // trans-code video
    $query = \Drupal::database()->select('vmt_videos', 'v');
    $query->innerJoin('transcoding_jobs_data', 'tjd', "tjd.mid = v.video_id");
    $query->fields('v', ['video_id']);
    $query->condition('v.video_id', $video_id, '=');  
    $query->condition('tjd.status', 'Submitted', '='); 
    $query->condition('tjd.type', 'video-maker', '='); 
    $video = $query->execute()->fetchObject();
    
    if(empty($video)){
      die('No video is pending for trans-coding.');
    }
    \Drupal::service('video.making.process')->finishTranscode($video_id);
    
    die('Final video generated successfully.');
  }
  
  
  /**
   * log cron execution
   *
   * @params request data
   * @return null
   */
  public function logCronExecution($video_id, $processing_step) {
    $video_id = \Drupal::database()->insert('vmt_cron_job')
      ->fields([
          'video_id'           => $video_id,  
          'processing_step'   => $processing_step,
      ])
      ->execute();
  }
}
