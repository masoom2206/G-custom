<?php
namespace Drupal\video_maker_tool\Controller;
use Drupal\Core\Controller\ControllerBase;
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

class ClassTranscoder {  
  /**
   * trans-code video
   *
   * @params request data
   * @return null
   */
  public function transcodeVideo($video_id){
    $site_config = \Drupal::config('system.site');    
    $server_name = strtolower($site_config->get('site_server_name'));
    if($server_name == 'dev'){
      $pipelineid = '1567626010446-2azpus';
    } else if($server_name == 'staging'){
      $pipelineid = '1618841425855-v85k3e';		
    } else {
      $pipelineid = '1566617956798-8w6no9';
    }
    
    $query = \Drupal::database()->select('vmt_videos', 'v');
    $query->innerJoin('taxonomy_term__field_elastic_transcoder_preset', 'etp', "etp.entity_id = v.media_preset_id AND etp.bundle = 'image_preset'");
    $query->fields('v', ['video_path', 'video_url']);
    $query->fields('etp', ['entity_id', 'field_elastic_transcoder_preset_value']);
    $query->condition('v.video_id', $video_id, '='); 
    $query->isNotNull('v.video_url'); 
    $video = $query->execute()->fetchObject();
    //echo '<pre>'; print_r($video); echo '<pre>';
    
    if(empty($video) || empty($video->video_path)) {
      $response = ['vid' => $video_id, 'cmd' => 'Video sent to AWS trans-coder!', 'output_file' => null, 'output_value' => 'No video is available for trans-coding.', 'return_value' => 1];
      \Drupal::service('video.making.process')->trackProcessingStage($response, 'Send-to-transcode');
      die('No video is available for trans-coding.');
    }
    
    // output file name;
    $keyo   = substr(sha1(time()), 0, 11).'.mp4';
    $thumb  = substr(sha1(time()), 0, 11).'-{count}';
    if(empty($video->video_path)) {
      $response = ['vid' => $video_id, 'cmd' => 'Video sent to AWS trans-coder!', 'output_file' => null, 'output_value' => 'Invalid input video.', 'return_value' => 1];
      \Drupal::service('video.making.process')->trackProcessingStage($response, 'Send-to-transcode');
      die('Invalid input video.');
    }
    
    $data = [];
    $data['pipelineid'] = $pipelineid;
    $data['outputkeyprefix'] = 'output/';
    $data['inputdetails'] = $video->video_path;
    $data['output_details'][0]['preset'] = $video->field_elastic_transcoder_preset_value;
    $data['output_details'][0]['key'] = $keyo;
    $data['output_details'][0]['ThumbnailPattern'] = $thumb;
    //$data['output_details'][0]['SegmentDuration'] = "[1,30]";
    
    \Drupal::logger('VMT:transcodeVideo')->debug('<pre><code>' . print_r($data, TRUE) . '</code></pre>');
    try{
      $etresponse = \Drupal::service('aetl')->trancodeCreateJob($data);
      if(empty($etresponse)){
        $response = ['vid' => $video_id, 'cmd' => 'Video sent to AWS trans-coder!', 'output_file' => null, 'output_value' => 'Error in executing AWS elastic transcoder due to invalid preset.', 'return_value' => 1];
        \Drupal::service('video.making.process')->trackProcessingStage($response, 'Send-to-transcode');
      }else{
        $etdata = $etresponse->toArray();
        // save elastic video trans-code response into database table  
        \Drupal::database()
          ->insert('transcoding_jobs_data')
          ->fields(array(
          'type' => 'video-maker',
          'mid' => $video_id,
          'uid' => 1,
          'target_id' => 1,
          'preset_id' => $etdata['Job']['Output']['PresetId'],
          'thumbnail_pattern' => $etdata['Job']['Output']['ThumbnailPattern'],
          'status' => $etdata['Job']['Output']['Status'],
          'jobs_id' => $etdata['Job']['Id'],
          'submittimemillis' => $etdata['Job']['Timing']['SubmitTimeMillis']))
          ->execute();
          
        $response = ['vid' => $video_id, 'cmd' => 'Video sent to AWS trans-coder!', 'output_file' => null, 'output_value' => null, 'return_value' => 0];
        \Drupal::service('video.making.process')->trackProcessingStage($response, 'Send-to-transcode');
      }
    }catch(Exception $e) {
      //echo 'Message: ' .$e->getMessage();
    }
  }
}
