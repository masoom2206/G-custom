<?php
namespace Drupal\video_maker_tool;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\video_maker_tool\Controller\ClassRenderVideo;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\File\FileSystemInterface;
use Drupal\taxonomy\Entity\Term;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;
use Drupal\Core\Url;

class VideoService implements VideoServiceInterface {
  /**
   * @construct
   *
   * @params null
   * @return null
   */
  public function __construct() {
    /*
    // FFMpeg
    $this->ffmpeg = \FFMpeg\FFMpeg::create([
      'ffmpeg.binaries'  => FFMPEG_PATH,
      'ffprobe.binaries' => FFPROBE_PATH,
      'timeout'          => 3600,
      'ffmpeg.threads'   => 12,
    ]);
    
    // FFProbe
    $this->ffprobe = \FFMpeg\FFProbe::create([
      'ffmpeg.binaries'  => FFMPEG_PATH,
      'ffprobe.binaries' => FFPROBE_PATH,
      'timeout'          => 3600,
      'ffmpeg.threads'   => 12,
    ]);
    */
    
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
   * {@inheritdoc}
   */
  public function validate(array $config) {
    // do nothing
  }
    
  /**
   * generate video clip.
   *
   * @params request data
   * @return null
   * ffmpeg -i clip.mp4 -vf "fade=in:0:24,fade=out:5106:24" -acodec copy clip-out.mp4
   * starting 0 up to 30 frames / 1 second
   */
	public function applyFadein($media, $transition){
    \Drupal::logger('VMT:applyFadein')->debug('<pre><code>' . print_r($transition, TRUE) . '</code></pre>');
		$vid = $media->video_id; 
		if(empty($media->transition_video)){
      $source_file = $media->video_clip_path;
    }else{
      $source_file = $media->transition_video;
    }
    
    $input_file = $this->downloadFileFromS3Bucket($vid, $source_file);
    // logic for video and transition duration
    $video_duration = $this->getVideoDuration($input_file);
    $transition_duration = $transition->transition_duration;
    $offset = 0;
    if($transition->ordering == 1) {
      // for the first transition
      if($video_duration > $transition_duration) {
        $duration = $transition_duration * 30;
      }else{
        $duration = $video_duration * 30;
      }
    }else{
      // for the remaining transitions
      if($video_duration > $transition_duration) {
        $offset = ($video_duration - $transition_duration)*30;
        $duration = $transition_duration * 30;
      }else{
        $duration = $video_duration * 30;
      }
    }

    // output video clip file
		$output_file = $this->createVideoFile($vid);
    $cmd = FFMPEG_PATH." -i {$input_file} -y -vf fade=in:{$offset}:{$duration} -c:v libx264 -video_track_timescale 60000 -qscale:v 2 -codec:a copy -pix_fmt yuv420p {$output_file} 2>&1";
		exec($cmd, $output_value, $return_value);    
		$response = ['vid' => $vid, 'cmd' => $cmd, 'output_file' => $output_file, 'output_value' => $output_value, 'return_value' => $return_value];
    // update media & transition tables and track video processing
    $this->updateMediaTransition($media, $transition, $response);
    
		return $response; 
	}
  
  /**
   * generate video clip.
   *
   * @params request data
   * @return null
   * ffmpeg -i clip.mp4 -vf "fade=in:0:24,fade=out:5106:24" -acodec copy clip-out.mp4
   */
	public function applyFadeout($media, $transition){
    \Drupal::logger('VMT:applyFadeout')->debug('<pre><code>' . print_r($transition, TRUE) . '</code></pre>');
		$vid = $media->video_id;
    if(empty($media->transition_video)){
      $source_file = $media->video_clip_path;
    }else{
      $source_file = $media->transition_video;
    }
    
    $input_file = $this->downloadFileFromS3Bucket($vid, $source_file);
    // logic for video and transition duration
    $video_duration = $this->getVideoDuration($input_file);
    $transition_duration = $transition->transition_duration;
    // for the remaining transitions
    if($video_duration > $transition_duration) {
      $offset = ($video_duration - $transition_duration)*30;
      $duration = $transition_duration * 30;
    }else{
      $offset = 0;
      $duration = $video_duration * 30;
    }
    
    // output video clip file
		$output_file = $this->createVideoFile($vid); 
    $cmd = FFMPEG_PATH." -i {$input_file} -y -vf fade=out:{$offset}:{$duration} -c:v libx264 -video_track_timescale 60000 -qscale:v 2 -codec:a copy -pix_fmt yuv420p {$output_file} 2>&1";
		exec($cmd, $output_value, $return_value);

		$response = ['vid' => $vid, 'cmd' => $cmd, 'output_file' => $output_file, 'output_value' => $output_value, 'return_value' => $return_value, 'is_last_clip' => $transition->is_last_clip];
    // update media & transition tables and track video processing
    $this->updateMediaTransition($media, $transition, $response);
		return $response; 
	}
  
  /**
   * generate video clip.
   *
   * @params request data
   * @return null
   * https://ottverse.com/crossfade-between-videos-ffmpeg-xfade-filter/#How_do_you_add_a_CrossFade_using_FFmpeg
   * ffmpeg \
   *  -i video1.mp4 \
   *   -i video2.mp4 \
   *   -filter_complex xfade=transition=<FADE_TYPE>:\
   *   duration=<TRANSITION_DURATION_IN_SECONDS>:\
   *   offset=<OFFSET_RELATIVE_TO_FIRST_STREAM_IN_SECONDS> \
   *   outputVideo.mp4
   */
	public function applyTransition($media, $transition){
    \Drupal::logger('VMT:applyTransition')->debug('<pre><code>' . print_r($transition, TRUE) . '</code></pre>');
		$vid = $transition->video_id;
    $transition_name = $this->transition[$transition->name];
    
    // first input
    if(empty($media[0]->transition_video)){
      $input_file1 = $this->downloadFileFromS3Bucket($vid, $media[0]->video_clip_path);
    }else{
      $input_file1 = $this->downloadFileFromS3Bucket($vid, $media[0]->transition_video);
    }
    
    // logic for video and transition duration
    $video_duration = $this->getVideoDuration($input_file1);
    $transition_duration = $transition->transition_duration;
    // for the remaining transitions
    if($video_duration > $transition_duration) {
      $offset = ($video_duration - $transition_duration);
      $duration = $transition_duration;
    }else{
      $offset = 0;
      $duration = $video_duration;
    }

		// second input
    $input_file2 = $this->downloadFileFromS3Bucket($vid, $media[1]->video_clip_path);
    // output video clip file
		$output_file = $this->createVideoFile($vid);
    if($transition->name == 'cross-fade'){
      $cmd = FFMPEG_PATH." -i {$input_file1} -i {$input_file2} -filter_complex \"[0][1:v]xfade=duration={$duration}:offset={$offset}; [0:a][1:a]acrossfade=d=0\" -c:v libx264 -video_track_timescale 60000 -qscale:v 2 -pix_fmt yuv420p {$output_file} 2>&1";
    }elseif($transition->name == 'xfade-none'){
      $cmd = FFMPEG_PATH." -i {$input_file1} -i {$input_file2} -filter_complex \"[0][1:v]xfade=transition=distance:duration={$duration}:offset={$offset}; [0:a][1:a]acrossfade=d=0\" -c:v libx264 -video_track_timescale 60000 -qscale:v 2 -pix_fmt yuv420p {$output_file} 2>&1";
    }elseif($transition->name == 'xfade-fade'){
      $cmd = FFMPEG_PATH." -i {$input_file1} -i {$input_file2} -filter_complex \"[0][1:v]xfade=transition=fade:duration={$duration}:offset={$offset}; [0:a][1:a]acrossfade=d=0\" -c:v libx264 -video_track_timescale 60000 -qscale:v 2 -pix_fmt yuv420p {$output_file} 2>&1";
    }else{
      //$cmd = FFMPEG_PATH." -i {$input_file1} -i {$input_file2} -filter_complex \"[0][1:v]xfade=transition={$transition_name}:duration={$duration}:offset={$offset}\" -c:v libx264 -video_track_timescale 60000 -qscale:v 2 -pix_fmt yuv420p {$output_file} 2>&1";
      
      $cmd = FFMPEG_PATH." -i {$input_file1} -i {$input_file2} -filter_complex \"[0][1:v]xfade=transition={$transition_name}:duration={$duration}:offset={$offset}; [0:a][1:a]acrossfade=d=0\" -c:v libx264 -video_track_timescale 60000 -qscale:v 2 -pix_fmt yuv420p {$output_file} 2>&1";
    }
    
	  \Drupal::logger('VMT:ShadabapplyTransition')->debug('<pre><code>' . print_r($cmd, TRUE) . '</code></pre>');
		exec($cmd, $output_value, $return_value);
    
    if($transition->name == 'xfade-none'){ $cmd = "No transition is applied!"; }
		$response = ['vid' => $vid, 'cmd' => $cmd, 'output_file' => $output_file, 'output_value' => $output_value, 'return_value' => $return_value];
    // update media & transition tables and track video processing
    $this->updateMediaTransition($media, $transition, $response);
    
		return $response; 
	}
  
  /**
   * save file at S3 bucket
   *
   * @params request data
   * @return null
   */
  public function joinVideo($vid, $clip) {
    if(is_array($clip) && (count($clip) > 1)){
      // create temporary directory
      $tmpdir = $this->createDir($vid);
      // prepare text file for joining video clips
      $join_video_file = "$tmpdir/join_video_files.txt";
      $jvfp = fopen($join_video_file, "w+");
      $filesname = '';
      foreach($clip as $element){
        $input_video_file = $this->downloadFileFromS3Bucket($vid, $element->transition_video);
        if(file_exists($input_video_file)) {
          $video_duration = $this->getVideoDuration($input_video_file);
          $filesname .= "file '".$input_video_file."'"."\r\n";
          $filesname .= "duration ".$video_duration."\r\n";
        }
      }
      fwrite($jvfp, $filesname);
      fclose($jvfp);
      \Drupal::logger('VMT:joinVideo')->debug('<pre><code>' . print_r($filesname, TRUE) . '</code></pre>');
      
      // concat video files together
      $output_file = $this->createVideoFile($vid);
      $cmd = FFMPEG_PATH." -f concat -safe 0 -i $join_video_file -c copy $output_file 2>&1";
      exec($cmd, $output_value, $return_value);
      $response = ['vid' => $vid, 'cmd' => $cmd, 'output_file' => $output_file, 'output_value' => $output_value, 'return_value' => $return_value];
      // track and record video processing
      $s3fs_file  = $this->trackProcessingStage($response, 'join-video');
      $video_path = $s3fs_file['path'];
      $video_url  = $s3fs_file['url'];
    }else{
      $video_path 	= $clip[0]->transition_video;
      $video_url  	= $clip[0]->transition_video_s3fsurl; 
      $response = ['vid' => $vid, 'cmd' => 'Final video created!', 'output_file' => null, 'output_value' => null, 'return_value' => 0];
      $this->trackProcessingStage($response, 'xfade-join-video');
    }
    
    // apply sound track on $output_file (final video at temp directory)
    $soundtrac_response = $this->applySoundtrack($vid, $video_path);
    if(!empty($soundtrac_response)) {
      $video_path = $soundtrac_response['path'];
      $video_url  = $soundtrac_response['url'];      
    }
    
    // trans-code video
    \Drupal::database()->update('vmt_videos')
      ->condition('video_id', $vid)
      ->fields([
        'video_path' => $video_path, 
        'video_url'  => $video_url,
      ])
      ->execute();
  }
  
   /**
   * apply sound track
   *
   * @params request data
   * @return null
   */
  public function applySoundtrack($vid, $final_video){
    $input_video = $this->downloadFileFromS3Bucket($vid, $final_video);
    // get soundtrack settings from database 
    $query = \Drupal::database()->select('vmt_videos', 'v')
        ->fields('v', ['sound_track'])
        ->condition('v.video_id', $vid, '=');
    $video = $query->execute()->fetchObject();
    $soundtrack = json_decode($video->sound_track);
    if(!is_object($soundtrack)){
      return false;
    }
    
    $volume = ($soundtrack->vol) ?  $soundtrack->vol: 1;
    $vol = $volume/100;
    
    $input_audio = $this->downloadAudioFile($vid, $soundtrack->mid);
    // output video file generation
    $rand_num = $this->getRand();
    $output_file = $this->createVideoFile($vid);

    ob_start();
      passthru(FFMPEG_PATH." -i ".$input_video." 2>&1");
      $duration = ob_get_contents();
    ob_end_clean();
    $search = '/Duration: (.*?)[.]/';
    $duration = preg_match($search, $duration, $matches, PREG_OFFSET_CAPTURE);
    $duration = $matches[1][0];
    list($hours, $mins, $secs) = explode(':', $duration);
    $time_sec = ($hours*3600)+($mins*60)+$secs;

    $mp3_audio = \Drupal::service('video.making.process')->getRealPath($vid).'/mp3_audio-'.$rand_num.'-audio.mp3';
    $mp3_fadein = \Drupal::service('video.making.process')->getRealPath($vid).'/mp3_fadein-'.$rand_num.'-audio.mp3';
    $mp3_final = \Drupal::service('video.making.process')->getRealPath($vid).'/mp3_final-'.$rand_num.'-audio.mp3';
    
    $cmd = FFMPEG_PATH." -ss 0 -i $input_audio -t $time_sec $mp3_audio 2>&1";
    exec($cmd,$op);

    $time_sec = $time_sec-1;
    $cmd = FFMPEG_PATH." -i $mp3_audio -af \"afade=t=in:st=1:d=1\" $mp3_fadein 2>&1";
    exec($cmd,$op);
    $cmd = FFMPEG_PATH." -i $mp3_fadein -af \"afade=t=out:st=$time_sec:d=1\" $mp3_final 2>&1";
    exec($cmd,$op);

    if ($soundtrack->loop == true){
      // repeate soundtrack untill video finished
      //$cmd = FFMPEG_PATH." -i {$input_video} -stream_loop -1 -i {$input_audio} -c:v copy -filter_complex \"[0:a]aformat=fltp:44100:stereo,apad[0a];[1]aformat=fltp:44100:stereo,volume={$vol}[1a];[0a][1a]amerge[a] \" -map 0:v -map \"[a]\" -ac 2 -shortest {$output_file} 2>&1";
      $cmd = FFMPEG_PATH." -i {$input_video} -stream_loop -1 -i {$mp3_final} -c:v copy -filter_complex \"[0:a]aformat=fltp:44100:stereo,apad[0a];[1]aformat=fltp:44100:stereo,volume={$vol}[1a];[0a][1a]amerge[a] \" -map 0:v -map \"[a]\" -ac 2 -shortest {$output_file} 2>&1";
    }else{
      // apply volume on audio file THEN apply soundtrack 
      // update audio file, after volume modifications
      $updated_audio_file = \Drupal::service('video.making.process')->getRealPath($vid).'/updateaudio-'.$rand_num.'-audio.mp3';

      //$cmd = FFMPEG_PATH." -i {$input_audio}  -filter:a \"volume = {$vol}\" {$updated_audio_file} 2>&1" ;
      $cmd = FFMPEG_PATH." -i {$mp3_final}  -filter:a \"volume = {$vol}\" {$updated_audio_file} 2>&1" ;
      exec($cmd, $output_value, $return_value);

      $cmd = FFMPEG_PATH." -i  {$input_video} -i {$updated_audio_file}  -c:v copy -filter_complex \"[0:a]aformat=fltp:44100:stereo,apad[0a];[1]aformat=fltp:44100:stereo,apad[1a];[0a][1a]amerge[a] \" -map 0:v -map \"[a]\" -ac 2 -shortest {$output_file} 2>&1";
    }
    exec($cmd, $output_value, $return_value);
    $response = ['vid' => $vid, 'cmd' => $cmd, 'output_file' => $output_file, 'output_value' => $output_value, 'return_value' => $return_value];
    // track and record video processing
    $s3fs_file  = $this->trackProcessingStage($response, 'applied-soundtrack');
    
    return $s3fs_file; 
  }
  
  /**
   * save file at S3 bucket
   *
   * @params request data
   * @return null
   */
  public function putObjectS3Bucket($source_file, $s3fs_file_key) {
    $s3fs_file_url = null;
    $config = \Drupal::config('s3fs.settings')->get();
    $s3fs = \Drupal::service('s3fs')->getAmazonS3Client($config);
    if(file_exists($source_file)) {
      $s3fs->putObject(['Bucket' => $config['bucket'], 'Key' => $s3fs_file_key, 'SourceFile' => $source_file, 'ACL' => 'public-read', ]);
      $s3fs_file_url = $s3fs->getObjectUrl($config['bucket'], $s3fs_file_key);
      
      \Drupal::logger('VMT:putObjectS3Bucket')->debug('@source_file: is uploaded to S3 bucket - @s3fs_file_url',
        array(
          '@source_file' => $source_file,
          '@s3fs_file_url' => $s3fs_file_url,
        ));
    }else{
      \Drupal::logger('VMT:putObjectS3Bucket')->debug('@source_file: not exist.',
        array(
          '@source_file' => $source_file,
        ));
    }
    return $s3fs_file_url;
  }
  
 /**
  * get requested video
  *
  * @params null
  * @return Video ID
  */
  public function updateMediaTransition($media, $transition, $data) { 
    \Drupal::logger('VMT:updateMediaTransition')->debug('<pre><code>' . print_r($media, TRUE) . '</code></pre>');
    // track and record video processing
    $s3fs_file = $this->trackProcessingStage($data, 'transition');
    if(($data['return_value'] === 0) && !empty($s3fs_file)) {
      // update transition table
      \Drupal::database()->update('vmt_transition')
        ->condition('video_id', $transition->video_id)
        ->condition('mid', $transition->mid)
        ->condition('rid', $transition->rid)
        ->fields(['is_transition_applied' => 1, 'command' => $data['cmd']])
        ->execute();
        
      // update storyboard media table 
      if(is_array($media) && (count($media) == 2)){
        foreach($media as $k => $m){
          $fields = [];
          if($k == 0){
            $fields['join_video_flag'] = 0;
          }else{
            $fields['transition_video'] = $s3fs_file['path'];
            $fields['transition_video_s3fsurl'] = $s3fs_file['url'];
            $fields['join_video_flag'] = 1;
          }
          
          // update media table
          \Drupal::database()->update('vmt_media')
            ->condition('id', $m->id)
            ->condition('video_id', $m->video_id)
            ->fields($fields)
            ->execute();
        }
      }else{
        $fields = [];
        $fields['transition_video'] = $s3fs_file['path'];
        $fields['transition_video_s3fsurl'] = $s3fs_file['url'];
        if(!empty($data['is_last_clip']) && ($data['is_last_clip'] == 1)) {
          $fields['video_clip_path'] = $s3fs_file['path'];
        }
        $fields['join_video_flag'] = 1;
        
        // update media table
        \Drupal::database()->update('vmt_media')
          ->condition('id', $media->id)
          ->condition('video_id', $media->video_id)
          ->fields($fields)
          ->execute();
      }
    }
  }
  
  /**
   * save video processing
   *
   * @params request data
   * @return null
   */
  public function trackProcessingStage($data, $stage) {
    $s3fs_file_key = null;
    $s3fs_file_url = null;
    $vid = $data['vid'];
    \Drupal::logger('VMT:trackProcessingStage')->debug($stage.' - <pre><code>' . print_r($data, TRUE) . '</code></pre>');
    
    // exec() return non-zero value in case of failure
    if($data['return_value'] === 0) {
      $status = 'success';
      // upload output video clip file at S3 bucket
      if(!empty($data['output_file'])) {
        $file_base_name = basename($data['output_file']);
        $s3fs_file_key = 's3fs-public/vmt/'.$vid.'/'.$file_base_name;
        $s3fs_file_url = $this->putObjectS3Bucket($data['output_file'], $s3fs_file_key);
      }
    }else{
      $status = 'fail';
      // update final video and status
      \Drupal::database()->update('vmt_videos')
        ->condition('video_id', $vid)
        ->fields([  
          'render_status' => 'Failed',
          'processed_date' => date('Y-m-d H:i:s'),
          'in_process' => 0,
          'is_manual_process' => 0,
        ])
        ->execute();
      
      // media vault render failed
      $query = \Drupal::database()->select('vmt_videos', 'v')
      ->fields('v', ['video_media_id'])
      ->condition('v.video_id', $vid, '=')
      ->condition('v.video_media_id', 0, '>');
      $video = $query->execute()->fetchObject();
      if(!empty($video)) {
        $media = Media::load($video->video_media_id);
        $media->set('field_render_status', 'Failed');
        $media->save();
      }
    }
    
    // save processing stages into database table
    $errors = is_array($data['output_value']) ? json_encode($data['output_value']) : $data['output_value'];  
    \Drupal::service('database')->insert('vmt_processing_stages')
      ->fields([
        'video_id' => $vid,
        'command' => $data['cmd'],
        'output' => $s3fs_file_url,
        'stage' => $stage,
        'errors' => $errors,
        'status' => $status,
        'raw_status' => $data['return_value'],
        'created' => date('Y-m-d H:i:s'),
      ])
      ->execute();
    
    // video notification system in case of failure
    if($status == 'fail'){
      $this->videoFailedNotification($vid, $stage);
    }
    
    return ['path' => $s3fs_file_key, 'url' => $s3fs_file_url]; 
  }
  
  
  /**
   * get video trans-code job detail
   *
   * @params request data
   * @return null
   */
  public function finishTranscode($vid) {
    $query = \Drupal::database()->select('vmt_videos', 'v');
    $query->innerJoin('transcoding_jobs_data', 'tjd', "tjd.mid = v.video_id");
    $query->fields('v', ['video_id', 'user_id', 'video_media_id', 'render_data']);
    $query->fields('tjd', ['id', 'jobs_id', 'preset_id', 'thumbnail_pattern']);
    $query->condition('v.video_id', $vid, '='); 
    //$query->condition('v.video_media_id', 0, '>'); 
    $query->condition('v.render_status', 'Pending', '=');  
    $query->condition('tjd.status', 'Submitted', '='); 
    $query->condition('tjd.type', 'video-maker', '='); 
    $video = $query->execute()->fetchObject();
    
    \Drupal::logger('VMT:finishTranscode')->debug('<pre><code>' . print_r($video, TRUE) . '</code></pre>');
    if(empty($video)){
      die('No video is pending for trans-coding.');
    }
    
    // get trans-code configuration 
    $config = \Drupal::config('aetl.settings')->get();
    $transcoder_client = \Drupal::service('aetl')->getAmazonETClient($config);
    // get required data
    $vid = $video->video_id;
    $transcode_id = $video->id;
    $jobid = $video->jobs_id;
    $render_data = json_decode($video->render_data, true);

    $jobdetails = [];
    try {
      $jobdetails = $transcoder_client->readJob(array(
        'Id' => $jobid,
       ))->toArray();
    }
    catch(AwsException $e) {
      //die($e->getMessage());
    }
    
    \Drupal::logger('VMT:finishTranscode')->debug('<pre><code>' . print_r($jobdetails, TRUE) . '</code></pre>');
    if(empty($jobdetails)){
      die('No video trans-code data available from AWS.');
    }
    
    // Job:Status is one of the following: Submitted, Progressing, Complete, Canceled, or Error
    $job_status = $jobdetails['Job']['Status'];
    if($job_status == 'Complete'){
      // capture thumbnails 
      $thumbs = $this->getThumbnail($vid, $video->thumbnail_pattern);
      
      // transcoded filename
      $transcoded_filename = $jobdetails['Job']['Output']['Key'];
      $file = $this->saveTranscodedVideo($vid, $transcoded_filename);
      if(!empty($file)) {
        $objRenderVideo = new ClassRenderVideo();
        $mid = $objRenderVideo->renderVideoProduct($vid, $render_data);
        // save video file to media
        if($mid){
          //$media = Media::load($video->video_media_id);
          $media = Media::load($mid);
          $this->updateVideoFileToMedia($file, $media, $video->user_id, $thumbs);
        }
        // update final video and status
        \Drupal::database()->update('vmt_videos')
          ->condition('video_id', $vid)
          ->fields([  
            'render_status' => 'Ready',
            'processing_phase' => 'Completed',
            'processed_date' => date('Y-m-d H:i:s'),
            'in_process' => 0,
            'is_manual_process' => 0,
          ])
          ->execute();
      }
      
      // update trans-coding status
      \Drupal::database()->update('transcoding_jobs_data')
      ->condition('id', $transcode_id)
      ->fields([
        'status' => $job_status,
        'starttimemillis' => $jobdetails['Job']['Timing']['StartTimeMillis'], 
        'finishtimemillis' => $jobdetails['Job']['Timing']['FinishTimeMillis'], 
        'processtime' => ($jobdetails['Job']['Timing']['FinishTimeMillis'] - $jobdetails['Job']['Timing']['StartTimeMillis']), 
        'details' => 'VMT - Transcode Complete',        
      ])
      ->execute();
      
      $response = ['vid' => $vid, 'cmd' => 'Video trans-code completed!', 'output_file' => null, 'output_value' => null, 'return_value' => 0];
      $this->trackProcessingStage($response, 'finish-transcode');
      
      die('Video has been trans-coded successfully.');
    }else if($job_status == 'Error'){
      // make media render failed
      if($video->video_media_id){
        $media = Media::load($video->video_media_id);
        $media->set('field_render_status', 'Failed');
        $media->save();
      }
      
      // update trans-coding status
      \Drupal::database()->update('transcoding_jobs_data')
      ->condition('id', $transcode_id)
      ->fields([
        'status' => 'Error',
        'details' => 'VMT - Error in Transcode',        
      ])
      ->execute();
      
      $response = ['vid' => $vid, 'cmd' => 'Error in video trans-code!', 'output_file' => null, 'output_value' => 'Video has not been trans-coded due to some error.', 'return_value' => 1];
      $this->trackProcessingStage($response, 'finish-transcode');
      
      die('Video has not been trans-coded due to some error.');
    } else {
      die('Video has not been trans-coded yet.');
    }
  }
  
  /**
   * trans-code video
   *
   * @params request data
   * @return null
   */
  public function getThumbnail($vid, $thumbnail_pattern){
    $thumbnails = [];
    $awstp = explode("-", $thumbnail_pattern);
		$i = 1;
		while($i <= 10) {
			$output_file = $awstp['0'].'-0000'.$i.'.jpg';
			$thumbObject = $this->saveTranscodedVideo($vid, $output_file);
			if(is_object($thumbObject)){
			  $thumbnails[] = $thumbObject->id();
			}
			else{
        break;
			}
		  
      $i++;
		}
    
    return $thumbnails;
  }
  
  /**
   * save transcoded video
   *
   * @params null
   * @return Video ID
   */
  public function saveTranscodedVideo($vid, $transcoded_filename) {
    $config = \Drupal::config('s3fs.settings')->get();
    $s3 = \Drupal::service('s3fs')->getAmazonS3Client($config);
    
    $key = 'output/'.$transcoded_filename;
    $command = $s3->getCommand('GetObject', array(
     'Bucket' => $config['bucket'],
     'Key'    => $key,  
     'ResponseContentDisposition' => 'attachment; filename="'.$key.'"'
    ));
    
    $response = $s3->createPresignedRequest($command, '+10 minutes');
    $presignedUrl = (string)$response->getUri();
    // transcoded file
    $file = null;
    try {    
      $fileContent = @file_get_contents($presignedUrl);
      if ($fileContent){
        $directory = 'public://vmt/'.$vid.'/output';
        $destination = $directory .'/'. $transcoded_filename;
        \Drupal::service('file_system')->prepareDirectory($directory, FileSystemInterface::CREATE_DIRECTORY);
        $file = file_save_data($fileContent, $destination, FILE_EXISTS_RENAME);          
      }
    } catch(Exception $e) {
      //die($e->getMessage());
    }
    
    return $file;  
  }
  
  /**
   * Create Video.
   *
   * @params request data
   * @return null
   */
  public function updateVideoFileToMedia(object $file, object $media, $owner, array $thumbs = []){
    if(is_object($file)){
		  $file_path = $file->getFileUri();
			$id3file = NULL;
			$id3_lib_availability = getid3_load();
			if($id3_lib_availability == FALSE){
			  drupal_set_message(t("The getid3() module cannot find the getID3 library used to read and write ID3 tags. The site administrator will need to verify that it is installed and then update the <a href='!admin-settings-audio-getid3'>settings</a>.", array('!admin-settings-audio-getid3' => Url::fromRoute('getid3.config'))), 'error', FALSE);
			  return $id3file;
			}
			$id3file = getid3_analyze($file_path);
			$pathinfo = pathinfo($id3file['filenamepath']);
			$str = $pathinfo['extension'];  
			$str = explode('.', $str);
			$extName = end($str);  
		  $audio_format = '';
		  $field_codec = '';
		  if(isset($id3file['audio']['codec'])){
			$audio_format = explode(' ', $id3file['audio']['codec']);
		  }
		  if(isset($id3file['video']['fourcc_lookup'])){
			$field_codec = explode('/', $id3file['video']['fourcc_lookup']);
		  }  
		  $name = $media->name->value;
		  $media->field_media_video_file->target_id = $file->id();
		  $media->set('field_file_size',  $this->getFormatedFileSize($file->get('filesize')->getValue()[0]['value']));
		  $media->set('field_format',  '.'.$extName);
		  $media->set('field_duration', isset($id3file['playtime_string']) ? $this->format_duration($id3file['playtime_string']) : '');
		  $media->set('field_frames_per_second',  isset($id3file['video']['frame_rate']) ? $id3file['video']['frame_rate'] : '');
		  $media->set('field_audio_format', $audio_format);
		  $media->set('field_codec', $field_codec);
		  $media->set('field_render_status', 'Ready');
		  if(count($thumbs)){
        $media->set('field_thumbnail_selections',  $thumbs);
		  }
		  $media->save();
		  $media->set('name',  $name );
		  $media->save();
      
      // add to notification system
      $tokens = ['video_name' => $name];
		  \Drupal::service('notification_system.notification_controller')->addNotification('Video Ready', $tokens, $owner);
      \Drupal::logger('VMT:updateVideoFileToMedia')->debug('<pre><code>' . print_r('Media updated with FFMPEG and transcoded file. Ready to send notification.', true) . '</code></pre>');
		}else{
      \Drupal::logger('VMT:updateVideoFileToMedia')->debug('<pre><code>' . print_r('Media has not updated with FFMPEG and transcoded file.', true) . '</code></pre>');
    }    
	}
  
  /**
   * Format to hh:mm:ss
   */
  public function format_duration($duration){
    // The base case is A:BB
    if(strlen($duration) == 4){
        return "00:0" . $duration;
    }
    // If AA:BB
    else if(strlen($duration) == 5){
        return "00:" . $duration;
    }   // If A:BB:CC
    else if(strlen($duration) == 7){
        return "0" . $duration;
    }
  }
  
  /**
	 * Convert bytes to kilobytes.
	 */
	public function getFormatedFileSize($filesize) {
		$units = array('KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
		$bytes = $filesize;
		if ($bytes <= 0) {
			$bytes = number_format($bytes, 2, '.', '') . " bytes";
		} else {
			$bytes = number_format($bytes / 1024, 2, '.', '');
			for ($i = 0;$i < count($units);$i++) {
				if (number_format($bytes, 2, '.', '') >= 1024) {
					$bytes = number_format($bytes / 1024, 2, '.', '');
				} else {
					$bytes = number_format($bytes, 2, '.', '');
					break;
				}
			}
			$bytes = $bytes . ' ' . $units[$i];
		}
		
		return $bytes;
	}
  
  /**
   * Create Video.
   *
   * @params request data
   * @return null
   */
  public function getVideoDuration($video) {
    $duration = 5;
    if(file_exists($video)) {
      $cmd = FFPROBE_PATH." -i {$video} -show_entries format=duration -v quiet -of csv=\"p=0\" 2>&1";
      exec($cmd, $output, $return);
      if(($return === 0) && (is_array($output) && !empty($output))){
        $duration = $output[0]; 
      }
    }
    
    return $duration;
  }
  
  
  /**
   * save media file into temp directory
   *
   * @params request data
   * @return null
   */
  public function downloadAudioFile($vid, $mid){
    $file_path = null;
    $response = [];
    
    $media = Media::load($mid);
    if(empty($media)){
      $response = ['vid' => $m->video_id, 'cmd' => 'Copy media file to temporary directory!', 'output_file' => null, 'output_value' => 'Couldn\'t load audio file.', 'return_value' => 1];
      $this->trackProcessingStage($response, 'Copy-to-temp-directory');
    }else{
      $fid = null;
      $file_uri = null;
      $type = $media->bundle();    
      // audio
      if(($type == 'audio') && !empty($media->field_media_audio_file->entity)) {
        $fid = $media->field_media_audio_file->target_id;
        $file_uri = $media->field_media_audio_file->entity->getFileUri();
      }
      
      if(empty($fid)){
        $response = ['vid' => $vid, 'cmd' => 'Copy audio file to temporary directory!', 'output_file' => null, 'output_value' => 'File doesn\'t exists.', 'return_value' => 1];
        $this->trackProcessingStage($response, 'Copy-to-temp-directory');
      }else{
        $file = File::load($fid);
        $file_name = $file->getFilename();
        $destination = $this->createTmpDir($vid) . '/' . $file_name;
        if($file = file_copy($file, $destination, FILE_EXISTS_REPLACE)) {
          $file_path = drupal_realpath($destination);
        }else {
          $response = ['vid' => $vid, 'cmd' => 'Copy audio file to temporary directory!', 'output_file' => null, 'output_value' => 'Couldn\'t copy the file into temporary directory.', 'return_value' => 1];
          $this->trackProcessingStage($response, 'Copy-to-temp-directory');
        }
      }
    }
    
    return $file_path;
  }
  
  /**
   * save media file into temp directory
   *
   * @params request data
   * @return null
   */
  public function downloadMediaFile($m){
    $file_path = null;
    $response = [];
    $media = Media::load($m->mid);
    if(empty($media)){
      $response = ['vid' => $m->video_id, 'cmd' => 'Copy media file to temporary directory!', 'output_file' => null, 'output_value' => 'Couldn\'t load media.', 'return_value' => 1];
      $this->trackProcessingStage($response, 'Copy-to-temp-directory');
    }else{
      $fid = null;
      $file_uri = null;
      $type = $media->bundle();
      // image
      if(($type == 'image') && !empty($media->field_media_image->entity)) {
        $fid = $media->field_media_image->target_id;
        $file_uri = $media->field_media_image->entity->getFileUri();
      }
      // video
      if(($type == 'video') && !empty($media->field_media_video_file->entity)) {
        $fid = $media->field_media_video_file->target_id;
        $file_uri = $media->field_media_video_file->entity->getFileUri();
      }
      // audio
      if(($type == 'audio') && !empty($media->field_media_audio_file->entity)) {
        $fid = $media->field_media_audio_file->target_id;
        $file_uri = $media->field_media_audio_file->entity->getFileUri();
      }
      
      if(empty($fid)){
        $response = ['vid' => $m->video_id, 'cmd' => 'Copy media file to temporary directory!', 'output_file' => null, 'output_value' => 'File doesn\'t exists.', 'return_value' => 1];
        $this->trackProcessingStage($response, 'Copy-to-temp-directory');
      }else{
        $file = File::load($fid);
        $file_name = $file->getFilename();
        $destination = $this->createTmpDir($m->video_id) . '/' . $file_name;
        if($file = file_copy($file, $destination, FILE_EXISTS_REPLACE)) {
          // update media table
          \Drupal::database()->update('vmt_media')
            ->condition('id', $m->id)
            ->condition('video_id', $m->video_id)
            ->fields(['fid' => $fid, 'type' => $type, 'file_uri' => $file_uri])
            ->execute();
          $file_path = drupal_realpath($destination);
        }else {
          $response = ['vid' => $m->video_id, 'cmd' => 'Copy media file to temporary directory!', 'output_file' => null, 'output_value' => 'Couldn\'t copy the file into temporary directory.', 'return_value' => 1];
          $this->trackProcessingStage($response, 'Copy-to-temp-directory');
        }
      }
    }
    
    return $file_path;
  }
  
  /**
   * download from S3 Bucket
   *
   * @params null
   * @return Video ID
   */
  public function downloadFileFromS3Bucket($vid, $file_key_path){
    $config = \Drupal::config('s3fs.settings')->get();
    $s3 = \Drupal::service('s3fs')->getAmazonS3Client($config);
    $command = $s3->getCommand('GetObject', array(
     'Bucket' => $config['bucket'],
     'Key'    => $file_key_path,  
     'ResponseContentDisposition' => 'attachment; filename="'.$file_key_path.'"'
    ));
    $response = $s3->createPresignedRequest($command, '+10 minutes');
    $presignedUrl = (string)$response->getUri();
    
    // save file to temporary directory
    $file_path = null;
    try {    
      $fileContent = @file_get_contents($presignedUrl);
      if($fileContent){
        $destination = $this->createTmpDir($vid).'/'.basename($file_key_path);
        if(\Drupal::service('file_system')->saveData($fileContent, $destination, FILE_EXISTS_REPLACE)){
          $file_path = drupal_realpath($destination);
        }else{
          //die("Could not copy file into temporary directory.");
        }
      }
    } catch(Exception $e) {
      //die($e->getMessage());
    }
    
    return $file_path;  
  }
  
  /**
   * create temporary directory
   *
   * @params null
   * @return Video ID
   */
  public function createTmpDir($vid) {
    // create temporary path 
    $directory = TEMP_DIR.'/'.$vid;
    \Drupal::service('file_system')->prepareDirectory($directory, FileSystemInterface::CREATE_DIRECTORY);
    // get temporary path 
    return \Drupal::service('stream_wrapper_manager')->getViaUri($directory)->getUri(); 
  }
  
  /**
   * get temporary directory
   *
   * @params null
   * @return Video ID
   */
  public function getTmpDir($vid) {    
    return \Drupal::service('stream_wrapper_manager')->getViaUri(TEMP_DIR.'/'.$vid)->getUri(); 
  }
  
  /**
   * get temporary directory real path
   *
   * @params null
   * @return Video ID
   */
  public function getRealPath($vid) {    
    return drupal_realpath(TEMP_DIR.'/'.$vid); 
  }
  
  /**
   * get requested video
   *
   * @params null
   * @return Video ID
   */
  public function createDir($vid) {
    // create temporary path 
    $directory = TEMP_DIR.'/'.$vid;
    \Drupal::service('file_system')->prepareDirectory($directory, FileSystemInterface::CREATE_DIRECTORY); 
    return drupal_realpath($directory); 
  }
  
  /**
   * get random string
   *
   * @params null
   * @return string
   */
  public function getRand() {
    return time().'-'.rand(10000, 99999);
  }
  
  /**
   * get random string
   *
   * @params null
   * @return string
   */
  public function createVideoFile($vid, $extension = 'mp4') {
    return $this->getRealPath($vid).'/video-'.$this->getRand().'-clip.'.$extension;
  }
  
  /**
   * get random string
   *
   * @params null
   * @return string
   */
  public function createImageFile($vid, $extension = 'jpg') {
    return $this->getRealPath($vid).'/photo-'.$this->getRand().'-clip.'.$extension;
  }
  
  /*
  * video notifications
  */
  public function videoFailedNotification($vid, $stage) {    
    $query = \Drupal::database()->select('vmt_videos', 'v');
    $query->leftJoin('vmt_processing_stages', 'tjd', "tjd.video_id= v.video_id AND tjd.status = 'fail' AND tjd.stage = '$stage'");
    $query->fields('v', ['video_id', 'video_name', 'user_id','render_status','processing_phase']);
    $query->fields('tjd', ['id', 'stage']);
    $query->condition('v.video_id', $vid, '=');
    $video = $query->execute()->fetchObject();
    
    $tokens = ['video_name' => $video->video_name, 'video_error' => $stage, 'video_error_id'=>$video->id, 'video_id'=> $video->video_id, 'video_error_phase'=> $video->processing_phase];
    \Drupal::service('notification_system.notification_controller')->addNotification('Video Processing Failed', $tokens, $video->user_id);
  }
  
  /**
   * trans-code video
   *
   * @params request data
   * @return null
   */
  public function getS3fsURI($video_url){
    $s3fs_config = \Drupal::config('s3fs.settings')->get();
    $bucket = $s3fs_config['bucket'];
    $s3fsurl = explode("/{$bucket}/", $video_url);
    if(is_array($s3fsurl) && (count($s3fsurl) == 2)){
      return $s3fsurl[1]; 
    }else{
      return null;
    }
  }
  
  /**
   * get random string
   *
   * @params null
   * @return string
   */
  public function removeTempData($vid) {
    // remove temporary directory once video created for trans-coding 
    $tmp_dir = $this->getRealPath($vid);
    $cmd = "rm -dr $tmp_dir 2>&1";
    sleep(15);
    exec($cmd, $output_value, $return_value);

    $response = ['vid' => $vid, 'cmd' => $cmd, 'output_file' => null, 'output_value' => $output_value, 'return_value' => $return_value];
    //\Drupal::service('video.making.process')->trackProcessingStage($response, 'removed-temp-files');
    \Drupal::logger('VMT:removeTempData')->debug('<pre><code>' . print_r($response, TRUE) . '</code></pre>');
  }
}
