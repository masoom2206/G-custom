<?php 
namespace Drupal\video_maker_tool\Controller;
use Symfony\Component\HttpFoundation\Response;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;

class ClassPreviewVideo {
  /**
   * @construct
   *
   * @params null
   * @return null
   */
  public function __construct() {
    // defined transitions
    $this->transition = [
      'cross-fade'  => 'crossfade', 
      'dissolve'    => 'dissolve', 
      'radial'      => 'radial', 
      'wipeleft'    => 'wipeleft', 
      'wiperight'   => 'wiperight', 
      'wipeup'      => 'slideup', 
      'wipedown'    => 'slidedown',
      'diptoblack'  => 'fadeblack',
      'diptowhite'  => 'fadewhite',
      'fade-in'     => 'fade-in',
      'fade-out'    => 'fade-out',
    ];
  }
  
  /**
   * Save Video.
   *
   * @params request data
   * @return null
   */
  public function preview() {
    //Delete Old Folder
    $action = \Drupal::request()->get('action');
    $video_id = \Drupal::request()->get('videoID');
    if($video_id > 0){
      $accessVideo = $this->access_video($video_id);
      if(!$accessVideo){
        throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException();
      }
    }
    $mp3_path = '';
    if($action == 'delete'){
      $response = [];
      $preview_files = \Drupal::request()->get('preview_files');
      if(count($preview_files['files']) > 0){
        foreach($preview_files['files'] as $key=>$s3files){
          $s3fs_file_key = $s3files['s3path'];
          $result = $this->deleteFileFromS3Bucket($s3fs_file_key);
          if ($result['DeleteMarker']){
            $response[$key] = $s3fs_file_key . ' Deleted';
          }
          else {
            $response[$key] = $s3fs_file_key . ' Not Deleted';
          }
        }
      }
      //print "<pre>";print_r($response);exit;
      $image_temp_folder = 'temporary://vmt/'.$video_id.'/';
      $realpath = drupal_realpath($image_temp_folder);
      $cmd = "rm -r $realpath 2>&1";
      exec($cmd, $op);
      $response['video_id'] = $video_id;
      return new JsonResponse($response);
    }
    else if($action == 'create'){
      $response = [];
      $image_temp_folder = 'temporary://vmt/'.$video_id.'/';
      $realpath = drupal_realpath($image_temp_folder);
      $cmd = "rm -r $realpath 2>&1";
      exec($cmd, $op);
      $mquery = \Drupal::database()->select('vmt_media', 'm');
      $mquery->innerJoin('vmt_transition', 'vt', "vt.video_id = m.video_id AND vt.mid = m.mid AND vt.rid = m.rid");
      $mquery->leftJoin('taxonomy_term_field_data', 'tt', "tt.vid = 'video_transitions' AND tt.tid = vt.transition_option");
      $mquery->fields('m', ['id', 'video_id', 'mid', 'start_time', 'duration', 'zoom', 'volume', 'ordering', 'crop_params', 'clip_zoom']);
      $mquery->fields('vt', ['transition_duration', 'transition_option']);
      $mquery->fields('tt', ['name']);
      $mquery->condition('m.video_id', $video_id, '=');
      $mquery->orderBy('m.ordering', 'ASC');
      $mediaData = $mquery->distinct()->execute()->fetchAll();
      //print "<pre>";print_r($mediaData);
      if(!empty($mediaData)){
        //Audio file for video
        $video_data = \Drupal::database()->select('vmt_videos', 'v')
          ->fields('v', ['sound_track', 'media_preset_id'])
          ->condition('v.video_id', $video_id, '=')
          ->execute()->fetchObject();
        $preset_id = $video_data->media_preset_id;
        $mediaPreset = \Drupal::service('media.preset')->getMediaPresetProperties($preset_id, 'array');
        $dimensions = (int)$mediaPreset['width']."x".(int)$mediaPreset['height'];
        $scaleDimensions = (int)$mediaPreset['width'].":".(int)$mediaPreset['height'];
        $scaleW = (int)$mediaPreset['width'];
        $scaleH = (int)$mediaPreset['height'];
        // Get First Transition 
        $ftquery = \Drupal::database()->select('vmt_transition', 'vt');
        $ftquery->join('taxonomy_term_field_data', 'tt', "tt.vid = 'video_transitions' AND tt.tid = vt.transition_option");
        $ftquery->fields('vt');
        $ftquery->fields('tt', ['name']);
        $ftquery->condition('vt.video_id', $video_id, '=');
        $ftquery->condition('vt.is_first_clip', 1, '=');
        $ftransition = $ftquery->execute()->fetchObject();
        // get last transition 
        $ltquery = \Drupal::database()->select('vmt_transition', 'vt');
        $ltquery->join('taxonomy_term_field_data', 'tt', "tt.vid = 'video_transitions' AND tt.tid = vt.transition_option");
        $ltquery->fields('vt');
        $ltquery->fields('tt', ['name']);
        $ltquery->condition('vt.video_id', $video_id, '=');
        $ltquery->condition('vt.is_last_clip', 1, '=');
        $ltransition = $ltquery->execute()->fetchObject();
        // print "<pre>";print_r($ftransition);print_r($ltransition);exit;
        $x = 0;
        $mediaDataCount = count($mediaData);
        foreach($mediaData as $k => $data){
          $mid = $data->mid;
          $clip_zoom = $data->clip_zoom;
          $duration = ($data->duration == 0) ? 5 : $data->duration;
          //$duration = 5;
          $media = Media::load($data->mid);
          // image
          if($media->hasField('field_media_image') && !empty($media->field_media_image->entity)) {
            $fid = $media->field_media_image->target_id;
            $file_uri = $media->field_media_image->entity->getFileUri();
            $type = 'image';
          }
          // video
          else if($media->hasField('field_media_video_file') && !empty($media->field_media_video_file->entity)) {
            $fid = $media->field_media_video_file->target_id;
            $file_uri = $media->field_media_video_file->entity->getFileUri();
            $type = 'video';
          }
          // audio
          else if($media->hasField('field_media_audio_file') && !empty($media->field_media_audio_file->entity)) {
            $fid = $media->field_media_audio_file->target_id;
            $file_uri = $media->field_media_audio_file->entity->getFileUri();
            $type = 'audio';
          }
          //Work for new File
          $image_temp_folder = 'temporary://vmt/'.$video_id.'/video/temp/'.$x.'/';
          file_prepare_directory($image_temp_folder, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);
          $file = File::load($fid);
          $file_name = $file->getFilename();
          //Get the file
          if($type == 'image'){
            $content = file_get_contents($file_uri);
            //Store in the filesystem.
            $file_name = sprintf("%05d", 0).'.jpg';
            $filename = $image_temp_folder.$file_name;
            $image_realpath = drupal_realpath($filename);
            $fp = fopen($image_realpath, "w");
            fwrite($fp, $content);
            fclose($fp);
            $imageResize = $this->previewImageResize($image_realpath, $data, $preset_id);
            $image_temp_folder = 'temporary://vmt/'.$video_id.'/video/temp/'.$x;
            $realpath = drupal_realpath($image_temp_folder);
            $videoFinal1="$realpath/vmt1.mp4";
            $videoFinal="$realpath/vmt.mp4";
            /*****Working******/
            //$cmd = FFMPEG_PATH." -loop 1 -i $realpath/00000.jpg -c:v libx264 -t {$duration} -pix_fmt yuv420p -vf scale={$dimensions} {$videoFinal1} 2>&1";
            //exec($cmd,$op);
            $dduration = ($duration*25);
            $zoomlevel = 0.5;
            if($clip_zoom == 'zoom-in' && $duration >= 5){
              $cmd = FFMPEG_PATH." -loop 1 -i $realpath/00000.jpg -vf \"scale=-2:2*ih,zoompan=z='min(zoom+0.0015,1.5)':d={$dduration}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s={$dimensions},scale=-2:380\" -c:v libx264 -t {$duration} -s \"{$dimensions}\" -y {$videoFinal1} 2>&1";
              //$cmd = FFMPEG_PATH." -loop 1 -i $realpath/00000.jpg -vf \"scale=-2:2*ih,zoompan=z='min(max(zoom,pzoom)+0.0015,1.15)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)',scale=-2:380\" -c:v libx264 -t {$duration} -s \"{$dimensions}\" -y {$videoFinal1} 2>&1";
              //$scaleW $scaleH
              //$cmd = FFMPEG_PATH." -loop 1 -i $realpath/00000.jpg -vf \"scale=-{$scaleDimensions},zoompan=z='min(max(zoom,pzoom)+0.0015,1.15)':d=1:x='{$scaleW}/2-({$scaleW}/zoom/2)':y='{$scaleH}/2-({$scaleH}/zoom/2)',scale=-{$scaleDimensions}\" -c:v libx264 -t {$duration} -s \"{$dimensions}\" -y {$videoFinal1} 2>&1";
              //$cmd = FFMPEG_PATH." -loop 1 -i $realpath/00000.jpg -vf \"scale=-1:{$scaleH},pad={$scaleDimensions}:(ow-iw)/2:(oh-ih)/2,zoompan=z='min(max(zoom,pzoom)+0.0015,1.15)':d=1:x='{$scaleW}/2-({$scaleW}/zoom/2)':y='{$scaleH}/2-({$scaleH}/zoom/2)',scale={$dimensions}\" -c:v libx264 -t {$duration} -pix_fmt yuv420p -s \"{$dimensions}\" -y {$videoFinal1} 2>&1";
              
              //$cmd = FFMPEG_PATH." -loop 1 -i $realpath/00000.jpg -c:v libx264 -t {$duration} -pix_fmt yuv420p -vf \"scale={$dimensions}, zoompan=z='min(max(zoom,pzoom)+0.0015,1.5)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)',scale={$dimensions}\" -s \"{$dimensions}\" -y {$videoFinal1} 2>&1";
              
              /**Its working fine for Zoom-in with given dimentions**/
              //$cmd = FFMPEG_PATH." -loop 1 -i $realpath/00000.jpg -filter_complex \"[0:v]scale=-1:{$scaleH},pad={$scaleDimensions}:(ow-iw)/2:(oh-ih)/2,loop=loop=-1:size=2,zoompan='s={$dimensions}:d=${duration}:z=min(max(zoom,pzoom)+0.0015,1.5)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)',setsar=1[v]\" -map '[v]' -an -t ${duration} -y {$videoFinal1} 2>&1";
              /**Its working fine for Zoom-out with given dimentions**/
              //$cmd = FFMPEG_PATH." -loop 1 -i $realpath/00000.jpg -filter_complex \"[0:v]scale=iw*4:ih*4,pad=iw*4:ih*4:(ow-iw)/2:(oh-ih)/2,zoompan='s={$dimensions}:d=${duration}:z=if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0015))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)',setsar=1[v]\" -map '[v]' -an -t ${duration} -y {$videoFinal1} 2>&1";
              
              //$cmd = FFMPEG_PATH." -loop 1 -i $realpath/00000.jpg -filter_complex \"[0:v]scale=iw*4:ih*4,zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0015))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={$dduration}:s={$dimensions},scale={$dimensions}\" -c:v libx264  -t {$duration} -s \"{$dimensions}\" -y {$videoFinal1} 2>&1";
              
              
              //$cmd = FFMPEG_PATH." -y -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -loop 1 -i $realpath/00000.jpg -vf \"scale=-2:2*ih,zoompan=z='min(max(zoom,pzoom)+0.0015,1.15)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)',scale=-2:380\" -c:v libx264 -t {$duration} -r 30 -video_track_timescale 60000 -qscale:v 2 -pix_fmt yuv420p -s \"{$dimensions}\" -map 0:a -map 1:v -y {$videoFinal1} 2>&1";
              //$cmd = FFMPEG_PATH." -y -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -loop 1 -i $realpath/00000.jpg -filter_complex \"scale=iw*4:ih*4,zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0015))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={$dduration},scale={$dimensions}\" -c:v libx264  -t {$duration} -r 30 -video_track_timescale 60000 -qscale:v 2 -pix_fmt yuv420p -s \"{$dimensions}\" -map 0:a -map 1:v -y {$videoFinal1} 2>&1";
              
              //$cmd = FFMPEG_PATH." -loop 1 -i $realpath/00000.jpg -filter_complex \"[0:v]scale={$dimensions},zoompan=z='min(zoom+0.0015,1.5)':x='iw/2-(iw/zoom)/2':y='ih/2-(ih/zoom)/2':d={$dduration},trim=duration={$duration}[v]\" -map \"[v]\" -c:v libx264 -pix_fmt yuv420p -y {$videoFinal1} 2>&1";
              //$cmd = FFMPEG_PATH." -loop 1 -i $realpath/00000.jpg -filter_complex \"[0:v]scale={$dimensions},zoompan=z='min(zoom+0.0015,1.5)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=125,trim=duration={$duration}[v]\" -map \"[v]\" -c:v libx264 -pix_fmt yuv420p -y {$videoFinal1} 2>&1";
            }
            else if($clip_zoom == 'zoom-out' && $duration >= 5){
              $cmd = FFMPEG_PATH." -loop 1 -i $realpath/00000.jpg -filter_complex \"[0:v]scale=iw*4:ih*4,zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0015))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={$dduration}:s={$dimensions},scale={$dimensions}\" -c:v libx264  -t {$duration} -s \"{$dimensions}\" -y {$videoFinal1} 2>&1";
              
              //$cmd = FFMPEG_PATH." -loop 1 -i $realpath/00000.jpg -filter_complex \"[0:v]scale={$dimensions},zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0015))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=125,trim=duration={$duration}[v]\" -map \"[v]\" -c:v libx264 -pix_fmt yuv420p -y {$videoFinal1} 2>&1";
            }
            else {
              $cmd = FFMPEG_PATH." -loop 1 -i $realpath/00000.jpg -c:v libx264 -t {$duration} -pix_fmt yuv420p -vf scale={$dimensions} -y {$videoFinal1} 2>&1";
            }
            //$cmd = FFMPEG_PATH." -loop 1 -i $realpath/00000.jpg -filter_complex \"[0:v]scale={$dimensions},zoompan=z='min(zoom+0.0025,1.5)':d=125,trim=duration={$duration}[v]\" -map \"[v]\" -c:v libx264 -pix_fmt yuv420p -y {$videoFinal1} 2>&1";
            exec($cmd,$opp);
            //print "Zoom.>><pre/>$cmd<br/>";print_r($opp);print file_create_url($image_temp_folder."/vmt.mp4");;exit;
            $cmd = FFMPEG_PATH." -y -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -i {$videoFinal1} -c:v copy -c:a aac -shortest -c:v libx264 -video_track_timescale 60000 -qscale:v 2 -pix_fmt yuv420p {$videoFinal} 2>&1";
            exec($cmd,$op,$return_value);
            // Save the record at aws bucket
            $bucket_data = ['x' => $x, 'vid' => $video_id, 'output_file' => $videoFinal, 'return_value' => $return_value];
            $s3fs_file  = $this->putObjectS3Bucket($bucket_data);
            /***********/
            //video without audio
            $video_file = file_create_url($image_temp_folder."/vmt.mp4");
            $response['files'][$x]['video_file'] = $video_file;
            $response['files'][$x]['video_file_uri'] = $videoFinal;
            $response['files'][$x]['s3path'] = $s3fs_file['s3path'];
            $response['files'][$x]['s3url'] = $s3fs_file['s3url'];
          }
          else {
            $content = file_get_contents($file_uri);
            $realpath = drupal_realpath($image_temp_folder);
            $videoFinal = "$realpath/vmt.mp4";
            //Store in the filesystem.
            $file_name = $file->getFilename();
            $filename = $image_temp_folder.$file_name;
            $clip_realpath = drupal_realpath($filename);
            $fp = fopen($clip_realpath, "w");
            fwrite($fp, $content);
            fclose($fp);
            $videoClipResize = $this->previewVideoClipResize($clip_realpath, $videoFinal, $data, $preset_id, $realpath, $x);
            $video_file = file_create_url($image_temp_folder."vmt.mp4");
            $response['files'][$x]['video_file'] = $video_file;
            $response['files'][$x]['video_file_uri'] = $videoFinal;
            $response['files'][$x]['s3path'] = $videoClipResize['s3path'];
            $response['files'][$x]['s3url'] = $videoClipResize['s3url'];
          }
          if($x == 0 && !empty($ftransition)){
            if($ftransition->name == 'Fade-in'){
              //$videoFinal = $this->applyFadein($videoFinal, $data, $x);
              $videoFinal = $this->applyFadein($response['files'][$x]['s3path'], $data, $x);
              $response['files'][$x]['video_file_uri'] = $videoFinal;
              // Save the record at aws bucket
              $bucket_data = ['x' => $x, 'vid' => $video_id, 'output_file' => $videoFinal, 'return_value' => 0];
              $s3fs_file  = $this->putObjectS3Bucket($bucket_data);
              // $response['files']['notfadein'.$x]['s3path'] = $response['files'][$x]['s3path'];
              $s3fs_file_key = $response['files'][$x]['s3path'];
              $result = $this->deleteFileFromS3Bucket($s3fs_file_key);
              $response['files'][$x]['s3path'] = $s3fs_file['s3path'];
              $response['files'][$x]['s3url'] = $s3fs_file['s3url'];
            }
            else if($ftransition->name == 'Fade-out'){
              //$videoFinal = $this->applyFadeout($videoFinal, $data, $x);
              $videoFinal = $this->applyFadeout($response['files'][$x]['s3path'], $data, $x);
              $response['files'][$x]['video_file_uri'] = $videoFinal;
              // Save the record at aws bucket
              $bucket_data = ['x' => $x, 'vid' => $video_id, 'output_file' => $videoFinal, 'return_value' => 0];
              $s3fs_file  = $this->putObjectS3Bucket($bucket_data);
              // $response['files']['notfadeout'.$x]['s3path'] = $response['files'][$x]['s3path'];
              $s3fs_file_key = $response['files'][$x]['s3path'];
              $result = $this->deleteFileFromS3Bucket($s3fs_file_key);
              $response['files'][$x]['s3path'] = $s3fs_file['s3path'];
              $response['files'][$x]['s3url'] = $s3fs_file['s3url'];
            }
          }
          else if($x == ($mediaDataCount-1) && !empty($ltransition)){
            if($ltransition->name == 'Fade-in'){
              //$videoFinal = $this->applyFadein($videoFinal, $data, $x);
              $videoFinal = $this->applyFadein($response['files'][$x]['s3path'], $data, $x);
              $response['files'][$x]['video_file_uri'] = $videoFinal;
              // Save the record at aws bucket
              $bucket_data = ['x' => $x, 'vid' => $video_id, 'output_file' => $videoFinal, 'return_value' => 0];
              $s3fs_file  = $this->putObjectS3Bucket($bucket_data);
              // $response['files']['notfadein'.$x]['s3path'] = $response['files'][$x]['s3path'];
              $s3fs_file_key = $response['files'][$x]['s3path'];
              $result = $this->deleteFileFromS3Bucket($s3fs_file_key);
              $response['files'][$x]['s3path'] = $s3fs_file['s3path'];
              $response['files'][$x]['s3url'] = $s3fs_file['s3url'];
            }
            else if($ltransition->name == 'Fade-out'){
              //$videoFinal = $this->applyFadeout($videoFinal, $data, $x);
              $videoFinal = $this->applyFadeout($response['files'][$x]['s3path'], $data, $x);
              $response['files'][$x]['video_file_uri'] = $videoFinal;
              // Save the record at aws bucket
              $bucket_data = ['x' => $x, 'vid' => $video_id, 'output_file' => $videoFinal, 'return_value' => 0];
              $s3fs_file  = $this->putObjectS3Bucket($bucket_data);
              // $response['files']['notfadeout'.$x]['s3path'] = $response['files'][$x]['s3path'];
              $s3fs_file_key = $response['files'][$x]['s3path'];
              $result = $this->deleteFileFromS3Bucket($s3fs_file_key);
              $response['files'][$x]['s3path'] = $s3fs_file['s3path'];
              $response['files'][$x]['s3url'] = $s3fs_file['s3url'];
            }
          }
          $response['files'][$x]['fid'] = $fid;
          $response['files'][$x]['mid'] = $mid;
          $response['files'][$x]['type'] = $type;
          $response['files'][$x]['file_uri'] = $file_uri;
          $response['files'][$x]['file_url'] = file_create_url($filename);
          $response['files'][$x]['transition_duration'] = $data->transition_duration;
          $response['files'][$x]['transition_option'] = $data->transition_option;
          $transition_name = ($data->name) ? strtolower(preg_replace('/[^a-z0-9-]/i', '', $data->name)) : '';
          $response['files'][$x]['term_name'] = ($data->name) ? $data->name : '';
          $response['files'][$x]['transition_name'] = $this->transition[$transition_name];
          $response['files'][$x]['video_id'] = $data->video_id;
          $x++;
        }
        // print "<pre>";print_r($response);exit;
        $time = 0;
        $time_sec = 0;
        $video_uri = '';
        $fileCount = count($response['files']);
        $fileAfterTransition = [];
        $skipFile = '';
        $lastDone = 0;
        foreach($response['files'] as $fileNo => $uri){
          //$video_uri = $uri['video_file_uri'];
          $video_uri = $uri['s3path'];
          if(!empty($uri['transition_name']) && $fileNo < ($fileCount-1)) {
            if(empty($skipFile)){
              //$video_uri1 = $response['files'][$fileNo]['video_file_uri'];
              $video_uri1 = $response['files'][$fileNo]['s3path'];
            }
            else {
              //print "Not empty skipFile = $skipFile<br/>";
              $video_uri1 = $fileAfterTransition['skipFile'];
              $skipFile = '';
            }
            //$video_uri2 = $response['files'][$fileNo+1]['video_file_uri'];
            $video_uri2 = $response['files'][$fileNo+1]['s3path'];
            $s3fs_file = $this->applyTransition($uri, $video_uri1, $video_uri2, $fileNo);
            $response['files']['transition'.$fileNo]['s3path'] = $s3fs_file['s3path'];
            $response['files'][$fileNo]['transition'] = $s3fs_file['s3url'];
            $skipFile = 'skipFile';
            $fileAfterTransition['skipFile'] = $s3fs_file['s3path'];
            if($fileNo == ($fileCount-2)){
              $lastDone = 1;
            }
          }
          else {
            if($lastDone !== 1){
              if(empty($skipFile)){
                $fileAfterTransition[$fileNo] = $video_uri;
              }
              else {
                $skipFile = '';
              }
            }
          }
        }
        // print "<pre>";print_r($fileAfterTransition);exit;
        $file_temp_folder = 'temporary://vmt/'.$video_id.'/video/';
        file_prepare_directory($file_temp_folder, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);
        $vrealpath = drupal_realpath($file_temp_folder);
        $joinVideosTXT = "$vrealpath/joinVideos.txt";
        $joinVideos = fopen($joinVideosTXT,"w+");
        foreach($fileAfterTransition as $key=>$fileTransition){
          $downloadData['file_key_path'] = $fileTransition;
          $downloadData['x'] = $key;
          $downloadData['video_id'] = $video_id;
          // print "1.>><pre/>";print_r($downloadData);
          $input_file = $this->downloadFileFromS3Bucket($downloadData);
          ob_start();
            passthru(FFMPEG_PATH." -i ".$input_file." 2>&1");
            $duration = ob_get_contents();
          ob_end_clean();
          $search = '/Duration: (.*?)[.]/';
          $duration = preg_match($search, $duration, $matches, PREG_OFFSET_CAPTURE);
          $duration = $matches[1][0];
          list($hours, $mins, $secs) = explode(':', $duration);
          $time_sec = ($hours*3600)+($mins*60)+$secs;
          $strVideo = "file '".$input_file."'"."\r\n";
          $strVideo .= "duration ".$time_sec."\r\n";
          fwrite($joinVideos, $strVideo);
        }
        fclose($joinVideos);
        $text_file = file_create_url($file_temp_folder."joinVideos.txt");
        $response['text_file'] = $text_file;
        $image_temp_folder = 'temporary://vmt/'.$video_id.'/video/temp';
        $realpath = drupal_realpath($image_temp_folder);
        //$videoFinal1 = "$realpath/vmt1.mp4";
        $videoFinal = "$realpath/vmt.mp4";
        $cmd = FFMPEG_PATH." -f concat -safe 0 -i $joinVideosTXT -c copy $videoFinal 2>&1";
        //$cmd = FFMPEG_PATH." -f concat -safe 0 -i $joinVideosTXT -vcodec copy -acodec copy $videoFinal 2>&1";
        exec($cmd, $opp, $rv);
        // Save the record at aws bucket
        $bucket_data = ['x' => 'final', 'vid' => $video_id, 'output_file' => $videoFinal, 'return_value' => $rv];
        $s3fs_file  = $this->putObjectS3Bucket($bucket_data);
        $response['files']['concat']['s3path'] = $s3fs_file['s3path'];
        $response['files']['concat']['s3url'] = $s3fs_file['s3url'];
        //sleep(5);
        //print "<pre>";print_r($opp);print_r($rv);exit;
        if($s3fs_file['s3url']){
          $video_file = $s3fs_file['s3url'];
        }
        else {
          $video_file = file_create_url($image_temp_folder."/vmt.mp4");
        }
        $response['video_file'] = $video_file;
        //Audio file for video
        $sound_track = json_decode($video_data->sound_track);
        if(is_object($sound_track)){
          $volume = ($sound_track->vol) ?  $sound_track->vol: 1;
          $vol = $volume/100;
          $amid = $sound_track->mid;
          $amedia = Media::load($amid);
          if($amedia->hasField('field_media_audio_file') && !empty($amedia->field_media_audio_file->entity)) {
            $image_temp_folder = 'temporary://vmt/'.$video_id.'/video/temp/';
            file_prepare_directory($image_temp_folder, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);
            $fid = $amedia->field_media_audio_file->target_id;
            $file_uri = $amedia->field_media_audio_file->entity->getFileUri();
            //get file to temp folder
            $content = file_get_contents($file_uri);
            $file = File::load($fid);
            //Store in the filesystem.
            $file_name = $file->getFilename();
            $filename = $image_temp_folder.$file_name;
            $mp3_path = drupal_realpath($filename);
            $fp = fopen($mp3_path, "w");
            fwrite($fp, $content);
            fclose($fp);
            $audio_file = file_create_url($filename);
            $response['audio_file'] = $audio_file;
            if(!empty($mp3_path)){
              $mp3_video = "$realpath/vmtaudio.mp4";
              //$cmd = FFMPEG_PATH." -i $videoFinal -i $mp3_path -c:v copy -c:a aac $mp3_video 2>&1";
              //$cmd = FFMPEG_PATH." -i $videoFinal -stream_loop -1 -i $mp3_path -shortest -map 0:v:0 -map 1:a:0 -y $mp3_video 2>&1";
              ob_start();
                passthru(FFMPEG_PATH." -i ".$videoFinal." 2>&1");
                $duration = ob_get_contents();
              ob_end_clean();
              $search = '/Duration: (.*?)[.]/';
              $duration = preg_match($search, $duration, $matches, PREG_OFFSET_CAPTURE);
              $duration = $matches[1][0];
              list($hours, $mins, $secs) = explode(':', $duration);
              $time_sec = ($hours*3600)+($mins*60)+$secs;

              $mp3_audio = "$realpath/mp3_audio.mp3";
              $mp3_fadein = "$realpath/mp3_fadein.mp3";
              $mp3_final = "$realpath/mp3_final.mp3";
              
              $cmd = FFMPEG_PATH." -ss 0 -i $mp3_path -t $time_sec $mp3_audio 2>&1";
              exec($cmd,$op);

              $time_sec = $time_sec-1;
              $cmd = FFMPEG_PATH." -i $mp3_audio -af \"afade=t=in:st=0:d=1\" $mp3_fadein 2>&1";
              exec($cmd,$op);
              $cmd = FFMPEG_PATH." -i $mp3_fadein -af \"afade=t=out:st=$time_sec:d=1\" $mp3_final 2>&1";
              exec($cmd,$op);

              //$cmd = FFMPEG_PATH." -i {$videoFinal} -stream_loop -1 -i {$mp3_final} -strict -4 -c:v copy -filter_complex \"[0:a]aformat=fltp:44100:stereo,apad[0a];[1]aformat=fltp:44100:stereo,volume={$vol}[1a];[0a][1a]amerge[a] \" -map 0:v -map \"[a]\" -ac 2 -shortest {$mp3_video} 2>&1";
              $cmd = FFMPEG_PATH." -i {$videoFinal} -stream_loop -1 -i {$mp3_final} -c:v copy -filter_complex \"[0:a]aformat=fltp:44100:stereo,apad[0a];[1]aformat=fltp:44100:stereo,volume={$vol}[1a];[0a][1a]amerge[a] \" -map 0:v -map \"[a]\" -ac 2 -shortest {$mp3_video} 2>&1";
              exec($cmd,$op,$rv);
              // Save the record at aws bucket
              $bucket_data = ['x' => 'final', 'vid' => $video_id, 'output_file' => $mp3_video, 'return_value' => $rv];
              $s3fs_file  = $this->putObjectS3Bucket($bucket_data);
              $response['files']['final_audio']['s3path'] = $s3fs_file['s3path'];
              $response['files']['final_audio']['s3url'] = $s3fs_file['s3url'];
              //video with audio
              if($s3fs_file['s3url']){
                $video_file = $s3fs_file['s3url'];
              }
              else {
                $video_file = file_create_url($image_temp_folder."/vmtaudio.mp4");
              }
              $response['video_file'] = $video_file;
            }
          }
        }
        //print "<pre>";print_r($fileAfterTransition);print_r($response);exit;
        return new JsonResponse($response);
      }
    }
    else {
      //return new JsonResponse('Error generated!');
      throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException();
    }
  }
  /**
   * Image resize before video creation.
   *
   * @params request data
   * @return null
   */
  public function previewImageResize($image_realpath, $media, $preset_id) {
    if(empty($media->crop_params)) {
      // no crop params avail, still need to resize image into preset dimensions 
      $mediaPreset = \Drupal::service('media.preset')->getMediaPresetProperties($preset_id, 'array');
      $prsetWidth =  (int)$mediaPreset['width'];
      $prsetHeight =  (int)$mediaPreset['height'];
      $mediaOrg = Media::load($media->mid);
      $pix_dim = $mediaOrg->field_pixel_dimentions->value;
      $b = explode(" x ", $pix_dim);
      if(count($b) == 1){
        $b = explode("x", $pix_dim);
      }
      $orgWidth = (int)$b[0];
      $orgHeight = (int)$b[1];
      $bgColor = 'black';
      $dimensions = $prsetWidth.'x'.$prsetHeight;
      $x = ($prsetWidth - $orgWidth)/2;
      $y = ($prsetHeight - $orgHeight)/2; 
      $geometry = sprintf("%+f",$x).sprintf("%+f",$y);
      $cmd = "convert -size $dimensions xc:$bgColor  \( $image_realpath -scale 100% +repage \) -geometry $geometry -composite $image_realpath";
      exec($cmd, $op);
      sleep(5);
    }
    else{
      $crop_params = json_decode($media->crop_params);
      $bgColor = $crop_params->imageAfterCopped->bgColor;
      $currentZoom = $crop_params->imageAfterCopped->currentZoom;
      $scale = ($currentZoom*100).'%';
      $rotation = $crop_params->imageAfterCopped->rotation;
      $exportZoom = $crop_params->imageAfterCopped->exportZoom;
      $x = $crop_params->imageAfterCopped->offset->x;
      $y = $crop_params->imageAfterCopped->offset->y;
      $preset_dimension = $crop_params->preset_dimension;
      $resizedArray = explode(" X ", $preset_dimension);
      $width = (int)$resizedArray[0];
      $height = (int)$resizedArray[1];
      $dimensions = $width.'x'.$height;
      if ($x <= 0 && $y <= 0 ) {
        //if offset is nagative, then it means larger image need to shrink. Copped operation need to perform
        $offset_x_cropped = abs($x*$exportZoom);
        $offset_y_cropped = abs($y*$exportZoom);
        $cropped = $dimensions.'+'.$offset_x_cropped.'+'.$offset_y_cropped;
        $cmd = "convert -size $dimensions xc:$bgColor \( $image_realpath -scale $scale -crop $cropped +repage \) -geometry +0+0 -composite $image_realpath";
      }
      else {
        //. If one offset is negative another is Possitive or both positive 
        $page = '100x100'.sprintf("%+f",$x*$exportZoom).sprintf("%+f",$y*$exportZoom);
        $geometry = sprintf("%+f",$x*$exportZoom).sprintf("%+f",$y*$exportZoom);
        $cmd = "convert -size $dimensions xc:$bgColor  \( $image_realpath -scale $scale +repage \) -geometry $geometry -composite $image_realpath";
      }
      exec($cmd, $op);
      sleep(5);
    }
    
    return $image_realpath;
  }
  /**
   * Image resize before video creation.
   *
   * @params request data
   * @return null
   */
  public function previewVideoClipResize($input_file, $output_file, $media, $preset_id, $realpath, $x) {
    $output_vid_file = "$realpath/vmt-vid.mp4";
    $mediaPreset = \Drupal::service('media.preset')->getMediaPresetProperties($preset_id, 'array');
    $prsetWidth =  (int)$mediaPreset['width'];
    $prsetHeight =  (int)$mediaPreset['height'];
    $video_id = $media->video_id;
    if(empty($media->crop_params)) {
      $scale = $prsetWidth.':'.$prsetHeight;
      $cmd = FFMPEG_PATH." -i $input_file -filter:v \" scale=$scale \" $output_file -c:a copy 2>&1";
      exec($cmd, $output_value, $return_value);
      // Save the record at aws bucket
      $bucket_data = ['x' => $x, 'vid' => $video_id, 'output_file' => $output_file, 'return_value' => $return_value];
      $s3fs_file = $this->putObjectS3Bucket($bucket_data);
    }
    else {
      $duration = gmdate("H:i:s", $media->duration);
      $startTime = gmdate("H:i:s", $media->start_time);
      $crop_params = json_decode($media->crop_params);
      //print "<pre>";print_r($crop_params);
      $volume = $media->volume ? ($media->volume)/100 : 1;
      $original_vdo_width = $crop_params->original_vdo_width;
      $original_vdo_height = $crop_params->original_vdo_height;
      $relative_vdo_width = $crop_params->relative_vdo_width;
      $relative_vdo_height = $crop_params->relative_vdo_height;
      $zoom = $crop_params->scale;
      $previewScale = $crop_params->previewScale;
      $bg = 'black';
      $xPos = $crop_params->offset->xPos;
      $yPos = $crop_params->offset->yPos;
      $preset = $crop_params->preset_dimensions;
      $dim = explode("X",$preset);
      $width = $dim['0'];
      $height = $dim['1'];
      $pad = '';
      $scale = '';
      $crop = '';
      if($original_vdo_width > $width || $original_vdo_height > $height){
        //print "P-1<br/>";
        if($original_vdo_width > $width){
          //print "P-2<br/>";
          $scale = $width*$zoom. ':-1'; 
          $heightUpdate = ($original_vdo_height*$width*$zoom)/ $original_vdo_width;
          $correctHeighttoCrop = ( $heightUpdate > $relative_vdo_height*$zoom*$previewScale ) ?$relative_vdo_height*$zoom*$previewScale : $heightUpdate;
          $yCrop = 0; 
          $x = 0;
          $y = (int)abs($yPos*$previewScale);
          $xx = (int)abs($xPos*$previewScale);
          //$crop = $width.':'.(int)abs($correctHeighttoCrop).':'.(int)abs($xPos*$previewScale).':'.$yCrop;
          $newHeight = (($width/$original_vdo_width)*$original_vdo_height);
          //$crop = $width.':'.(int)abs($newHeight).':'.$xx.':'.$y;
          $crop = $width.':'.$height.':'.$xx.':'.$y;
          $pad='width='.$width.':height='.$height.':x='.$xx.':y='.$y.':color='.$bg;
          //$pad='width='.$width.':height='.(int)abs($correctHeighttoCrop).':x='.$x.':y='.$y.':color='.$bg;
        }
        else{
          //print "P-3<br/>";
          $scale = '-1:'.$height*$zoom;
          $widthUpdate = ($original_vdo_width*$height*$zoom)/ $original_vdo_height;
          $correctWidthtoCrop = ( $widthUpdate > $relative_vdo_width*$zoom*$previewScale ) ?$relative_vdo_width*$zoom*$previewScale : $widthUpdate;
          $xCrop = 0; 
          $x = (int)abs($xPos*$previewScale);
          $y = 0;
          $yy = (int)abs($yPos*$previewScale);
          //$crop = (int)abs($correctWidthtoCrop).':'.$height.':'.$xCrop .':'.(int)abs($yPos*$previewScale);
          $newWodth = (($height/$original_vdo_height)*$original_vdo_width);
          //$crop = (int)abs($newWodth).':'.$height.':'.$xCrop .':'.(int)abs($yPos*$previewScale);
          $crop = $width.':'.$height.':'.$x .':'.$yy;
          $pad='width='.$width.':height='.$height.':x='.$x.':y='.$yy.':color='.$bg;
          //$pad='width='.(int)abs($correctWidthtoCrop).':height='.$height.':x='.$x.':y='.$y.':color='.$bg;
        }
      }
      else{
        //print "P-4<br/>";
        $scale = $original_vdo_width*$zoom.':-1'; 
        if ((int)$xPos <= 0 && (int)$yPos <= 0 ) {
          //print "P-5<br/>";
          $x = 0; 
          $y = 0; 
          $crop = $width.':'.$height.':'.(int)abs($xPos*$previewScale).':'.(int)abs($yPos*$previewScale);
        } 
        elseif((int)$xPos > 0 && (int)$yPos > 0 ){
          //print "P-6<br/>";
          $x = (int)abs($xPos*$previewScale);
          $y = (int)abs($yPos*$previewScale);
          $pad = $width.':'.$height.':'.$x.':'.$y.':'.$bg;
        }
        elseif((int)$xPos > 0 && (int)$yPos <= 0){
          //print "P-7<br/>";
          $x = (int)$xPos*$previewScale;
          $y = 0;
          $pad= $width.':'.$height.':'.$x.':'.$y.':'.$bg;        
          if($width > $original_vdo_width*$zoom && $height > $original_vdo_height*$zoom){
            $crop = $original_vdo_width*$zoom.':'.$original_vdo_height*$zoom.':0:'.(int)abs($yPos*$previewScale);
          }
          elseif ($width < $original_vdo_width*$zoom && $height < $original_vdo_height*$zoom ){
            $crop = $width.':'.$height.':0:'.(int)abs($yPos*$previewScale);
          }
          elseif ($width < $original_vdo_width*$zoom && $height > $original_vdo_height*$zoom ){
            $crop = $width.':'.$original_vdo_height*$zoom.':0:'.(int)abs($yPos*$previewScale);
          } 
          elseif ($width > $original_vdo_width*$zoom && $height < $original_vdo_height*$zoom ){
            $crop = $original_vdo_width*$zoom.':'.$height.':0:'.(int)abs($yPos*$previewScale); 
          }              
        }
        elseif((int)$xPos <= 0 && (int)$yPos > 0){
          //print "P-8<br/>";
          $x = 0;
          $y = (int)$yPos*$previewScale;
          $pad = $width.':'.$height.':'.$x.':'.$y.':'.$bg;
          if($width > $original_vdo_width*$zoom && $height > $original_vdo_height*$zoom  ){
            $crop = $original_vdo_width*$zoom.':'.$original_vdo_height*$zoom.':'.(int)abs($xPos*$previewScale).':0';   
          }
          elseif ($width < $original_vdo_width*$zoom && $height < $original_vdo_height*$zoom ){
            $crop = $width.':'.$height.':'.(int)abs($xPos*$previewScale).':0'; 
          } 
          elseif ($width < $original_vdo_width*$zoom && $height > $original_vdo_height*$zoom ){
            $crop = $width.':'.$original_vdo_height*$zoom.':'.(int)abs($xPos*$previewScale).':0'; 
          } 
          elseif ($width > $original_vdo_width*$zoom && $height < $original_vdo_height*$zoom ){
            $crop = $original_vdo_width*$zoom.':'.$height.':'.(int)abs($xPos*$previewScale).':0'; 
          }            
        }
      }
      //print "pad=$pad == scale=$scale == crop=$crop<br/>";
      $cmd = FFMPEG_PATH." -ss $startTime -i $input_file -t $duration  -filter:v \" scale=$scale, crop=$crop, pad=$pad \" -filter:a \"volume = $volume\"  $output_vid_file 2>&1";
      exec($cmd, $output_value, $return_value);
      //print "<pre>";print_r($output_value);print_r($return_value);exit;
      if($return_value !== 0) {
        $cmd = "rm -r $output_vid_file 2>&1";
        exec($cmd, $op);
        $updateScale =  $prsetWidth.':'.$prsetHeight;
        $cmd = FFMPEG_PATH." -ss $startTime -i $input_file -t $duration  -filter:v \" scale=$updateScale \" -filter:a \"volume = $volume\"  $output_vid_file 2>&1";
        exec($cmd, $output_value, $return_value);
        //print "<pre>";print_r($output_value);print_r($return_value);exit;
      }
      // code is to detect audio stream on video.
      $isAudioCmd = FFPROBE_PATH." -i $output_vid_file -show_streams -select_streams a -loglevel error 2>&1";
      exec($isAudioCmd, $isAudio, $return);
      if(empty($isAudio)){
        // no audio stream is found and add blank audio stream.      
        $cmd = FFMPEG_PATH." -y -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -i {$output_vid_file} -c:v copy -c:a aac -shortest -c:v libx264 -video_track_timescale 60000 -qscale:v 2 -pix_fmt yuv420p {$output_file} 2>&1";
      }
      else{
        //$cmd = FFMPEG_PATH." -y -i {$output_vid_file} -c:v libx264 -video_track_timescale 60000 -qscale:v 2 -codec:a copy -pix_fmt yuv420p {$output_file} 2>&1";
        $cmd = FFMPEG_PATH." -y -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -i {$output_vid_file} -c:v copy -c:a aac -shortest -c:v libx264 -video_track_timescale 60000 -qscale:v 2 -pix_fmt yuv420p {$output_file} 2>&1";
      }
      exec($cmd, $output_value, $return_value);
      // Save the record at aws bucket
      $bucket_data = ['x' => $x, 'vid' => $video_id, 'output_file' => $output_file, 'return_value' => $return_value];
      $s3fs_file = $this->putObjectS3Bucket($bucket_data);
    }
    return $s3fs_file;
  }
  /**
   * Callback Function applyFadein()
   * to apply fade-in effect
   **/
	public function applyFadein($input_file, $data, $x){
    $downloadData['file_key_path'] = $input_file;
    $downloadData['x'] = $x;
    $downloadData['video_id'] = $data->video_id;
    // print "2.>><pre/>";print_r($downloadData);
    $video_uri = $this->downloadFileFromS3Bucket($downloadData);
    ob_start();
      passthru(FFMPEG_PATH." -i ".$video_uri." 2>&1");
      $duration = ob_get_contents();
    ob_end_clean();
    $search = '/Duration: (.*?)[.]/';
    $duration = preg_match($search, $duration, $matches, PREG_OFFSET_CAPTURE);
    $duration = $matches[1][0];
    list($hours, $mins, $secs) = explode(':', $duration);
    $video_duration = ($hours*3600)+($mins*60)+$secs;
    $transition_duration = $data->transition_duration;
    $offset = 0;
    if($video_duration > $transition_duration) {
      $duration = $transition_duration * 30;
    }
    else{
      $duration = $video_duration * 30;
    }
    // if($video_duration > $transition_duration) {
      // $offset = ($video_duration - $transition_duration) * 30;
      // $duration = $transition_duration * 30;
    // }
    // else{
      // $offset = 0;
      // $duration = $video_duration * 30;
    // }
    $video_id = $data->video_id;
    $image_temp_folder = 'temporary://vmt/'.$video_id.'/video/temp/'.$x;
    file_prepare_directory($image_temp_folder, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);
    $realpath = drupal_realpath($image_temp_folder);
    $videoFinal = "$realpath/vmt-vid-fadein.mp4";
    // $offset = 0;
    // $duration = $duration * 30;
    $cmd = FFMPEG_PATH." -i {$video_uri} -y -vf fade=in:{$offset}:{$duration} -c:v libx264 -video_track_timescale 60000 -qscale:v 2 -codec:a copy -pix_fmt yuv420p {$videoFinal} 2>&1";
		exec($cmd, $output_value, $return_value);
    // print "<pre>";print_r($output_value);print_r($return_value);
    // print "<br/>**videoFinal-1 == $videoFinal**</br>";
		return $videoFinal; 
	}
  /**
   * Callback Function applyFadeout()
   * to apply fade-out effect
   **/
	public function applyFadeout($input_file, $data, $x){
    $downloadData['file_key_path'] = $input_file;
    $downloadData['x'] = $x;
    $downloadData['video_id'] = $data->video_id;
    // print "3.>><pre/>";print_r($downloadData);
    $video_uri = $this->downloadFileFromS3Bucket($downloadData);
    ob_start();
      passthru(FFMPEG_PATH." -i ".$video_uri." 2>&1");
      $duration = ob_get_contents();
    ob_end_clean();
    $search = '/Duration: (.*?)[.]/';
    $duration = preg_match($search, $duration, $matches, PREG_OFFSET_CAPTURE);
    $duration = $matches[1][0];
    list($hours, $mins, $secs) = explode(':', $duration);
    $video_duration = ($hours*3600)+($mins*60)+$secs;
    $transition_duration = $data->transition_duration;
    if($video_duration > $transition_duration) {
      //$offset = ($video_duration - $transition_duration) * 30;
      $offset = ($video_duration - $transition_duration) * 20;
      //$offset = ($video_duration - 2) * 30;
      $duration = $transition_duration * 30;
    }
    else{
      $offset = 0;
      $duration = $video_duration * 30;
    }
    $video_id = $data->video_id;
    $image_temp_folder = 'temporary://vmt/'.$video_id.'/video/temp/'.$x;
    file_prepare_directory($image_temp_folder, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);
    $realpath = drupal_realpath($image_temp_folder);
    $videoFinal = "$realpath/vmt-vid-fadeout.mp4";
    // $offset = 0;
    // $duration = $video_duration * 30;
    $cmd = FFMPEG_PATH." -i {$video_uri} -y -vf fade=out:{$offset}:{$duration} -c:v libx264 -video_track_timescale 60000 -qscale:v 2 -codec:a copy -pix_fmt yuv420p {$videoFinal} 2>&1";
		exec($cmd, $output_value, $return_value);
    // print "<pre>";print_r($output_value);print_r($return_value);
    // print "<br/>**videoFinal-2 == $videoFinal**</br>";
		return $videoFinal; 
	}
  
  /**
   * Callback Function applyTransition()
   * to apply transition effect
   **/
	public function applyTransition($data, $input_file_1, $input_file_2, $x){
    // print "input_file_1 = $input_file_1 <br/>";
    // print "input_file_2 = $input_file_2 <br/>";
    $downloadData1['file_key_path'] = $input_file_1;
    $downloadData1['x'] = $x;
    $downloadData1['video_id'] = $data['video_id'];
    // print "4.>><pre/>";print_r($downloadData1);
    $input_file1 = $this->downloadFileFromS3Bucket($downloadData1);
    // print "input_file1 = $input_file1 <pre>";print_r($downloadData1);
    $downloadData2['file_key_path'] = $input_file_2;
    $downloadData2['x'] = 'x'.$x;
    $downloadData2['video_id'] = $data['video_id'];
    // print "5.>><pre/>";print_r($downloadData2);
    $input_file2 = $this->downloadFileFromS3Bucket($downloadData2);
    // print "input_file2 = $input_file2 <pre>";print_r($downloadData2);//exit;
    ob_start();
      passthru(FFMPEG_PATH." -i ".$input_file1." 2>&1");
      $duration = ob_get_contents();
    ob_end_clean();
    $search = '/Duration: (.*?)[.]/';
    $duration = preg_match($search, $duration, $matches, PREG_OFFSET_CAPTURE);
    $duration = $matches[1][0];
    list($hours, $mins, $secs) = explode(':', $duration);
    $video_duration = ($hours*3600)+($mins*60)+$secs;
    $transition_duration = $data['transition_duration'];
    if($video_duration > $transition_duration) {
      $offset = ($video_duration - $transition_duration);
      $duration = $transition_duration;
    }
    else{
      $offset = 0;
      $duration = $video_duration;
    }
    $video_id = $data['video_id'];
    $image_temp_folder = 'temporary://vmt/'.$video_id.'/video/temp/'.$x;
    file_prepare_directory($image_temp_folder, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);
    $realpath = drupal_realpath($image_temp_folder);
    //$output_file1 = "$realpath/vmt-transition1-$x.mp4";
    $output_file = "$realpath/vmt-transition-$x.mp4";
    $transition_name = $data['transition_name'];
    if($transition_name == 'cross-fade' || $transition_name == 'crossfade'){
      $cmd = FFMPEG_PATH." -i {$input_file1} -i {$input_file2} -filter_complex \"[0][1:v]xfade=transition=fade:duration={$duration}:offset={$offset}; [0:a][1:a]acrossfade=d=0\" -c:v libx264 -video_track_timescale 60000 -qscale:v 2 -pix_fmt yuv420p {$output_file} 2>&1";
    }
    else {
      $cmd = FFMPEG_PATH." -i {$input_file1} -i {$input_file2} -filter_complex \"[0][1:v]xfade=transition={$transition_name}:duration={$duration}:offset={$offset}; [0:a][1:a]acrossfade=d=0\" -c:v libx264 -video_track_timescale 60000 -qscale:v 2 -pix_fmt yuv420p {$output_file} 2>&1";
      //$cmd = FFMPEG_PATH." -i {$input_file1} -i {$input_file2} -filter_complex \"xfade=transition={$transition_name}:duration={$duration}:offset={$offset}\" -c:v libx264 -video_track_timescale 60000 -qscale:v 2 -pix_fmt yuv420p {$output_file} 2>&1";
    }
    exec($cmd, $output_value, $return_value);
    // print "<pre>";print_r($output_value);print_r($return_value);
    // Save the record at aws bucket
    $bucket_data = ['x' => $x, 'vid' => $video_id, 'output_file' => $output_file, 'return_value' => $return_value];
    $s3fs_file  = $this->putObjectS3Bucket($bucket_data);
    // print "s3fs_file <pre>";print_r($s3fs_file);
    return $s3fs_file;
	}
  /**
   * save file at S3 bucket
   *
   * @params request data
   * @return null
   */
  public function putObjectS3Bucket($data) {
    $s3fs_file_url = null;
    $s3fs_file_key = null;
    $config = \Drupal::config('s3fs.settings')->get();
    $s3fs = \Drupal::service('s3fs')->getAmazonS3Client($config);
    $vid = $data['vid'];
    $x = $data['x'];
    if($data['return_value'] === 0) {
      // upload output video clip file at S3 bucket
      if(!empty($data['output_file'])) {
        $source_file = $data['output_file'];
        $file_base_name = basename($source_file);
        $s3fs_file_key = 's3fs-public/vmt/preview/'.$vid.'/'.$x.'/'.$file_base_name;
        if(file_exists($source_file)) {
          $s3fs->putObject(['Bucket' => $config['bucket'], 'Key' => $s3fs_file_key, 'SourceFile' => $source_file, 'ACL' => 'public-read', ]);
          $s3fs_file_url = $s3fs->getObjectUrl($config['bucket'], $s3fs_file_key);
        }
      }
    }
    return ['s3path' => $s3fs_file_key, 's3url' => $s3fs_file_url]; 
  }
  /**
   * download from S3 Bucket
   *
   * @params null
   * @return Video ID
   */
  public function downloadFileFromS3Bucket($data){
    $video_id = $data['video_id'];
    //print "vid = $vid <br/>";
    $file_key_path = $data['file_key_path'];
    //print "file_key_path = $file_key_path  <br/>";
    $x = $data['x'];
    //print "x = $x  <br/>";
    $config = \Drupal::config('s3fs.settings')->get();
    $s3 = \Drupal::service('s3fs')->getAmazonS3Client($config);
    $command = $s3->getCommand('GetObject', array(
     'Bucket' => $config['bucket'],
     'Key'    => $file_key_path,  
     'ResponseContentDisposition' => 'attachment; filename="'.$file_key_path.'"'
    ));
    $response = $s3->createPresignedRequest($command, '+10 minutes');
    $presignedUrl = (string)$response->getUri();
    //print "presignedUrl = $presignedUrl  <br/>";
    // save file to temporary directory
    $file_path = null;
    try {    
      $fileContent = @file_get_contents($presignedUrl);
      if($fileContent){
        //$destination = $this->createTmpDir($vid).'/'.basename($file_key_path);
        $destination = 'temporary://vmt/'.$video_id.'/video/temp/'.$x.'/';
        file_prepare_directory($destination, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);
        //Store in the filesystem.
        $file_name = basename($file_key_path);
        $filename = $destination.$file_name;
        $file_path = drupal_realpath($filename);
        $fp = fopen($file_path, "w");
        fwrite($fp, $fileContent);
        fclose($fp);
        // $destination .= basename($file_key_path);
        // if(\Drupal::service('file_system')->saveData($fileContent, $destination, FILE_EXISTS_REPLACE)){
          // $file_path = drupal_realpath($destination);
          // print "file_path 1 = $file_path  <br/>";
        // }
      }
    } catch(Exception $e) {
      //die($e->getMessage());
    }
    //print "file_path 2 = $file_path  <br/>";
    return $file_path;
  }
  /**
   * Delete from S3 Bucket
   *
   * @params null
   * @return result
   */
  public function deleteFileFromS3Bucket($s3fs_file_key){
    $config = \Drupal::config('s3fs.settings')->get();
    $s3fs = \Drupal::service('s3fs')->getAmazonS3Client($config);
    $result = $s3fs->deleteObject(['Bucket' => $config['bucket'], 'Key' => $s3fs_file_key]);
    return $result;
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
        return false;
      }
      else{
        $owner = $video->user_id;
        $cuid = $account->id();
        $roles = $account->getRoles();
        // user can access own product page
        if($cuid == $owner){
          return true;
        }
        else if(in_array('administrator', $roles)){
          return true;
        }
        else if(!in_array('administrator', $roles)){
          $gid = isset($_GET['team']) ? $_GET['team'] : '';
          $member = \Drupal::service('my_groups.team.service')->getMembersAccess($gid, $cuid, $owner, 'team-video_maker');
          if($member){
            return true;
          }
          return false;
        }
      }
    }
    else {
      return false;
    }
  }
}
