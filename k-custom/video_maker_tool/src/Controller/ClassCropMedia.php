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

class ClassCropMedia {
  /**
   * crop media.
   * ffmpeg -i input.mp4 -filter:v "crop=w:h:x:y" output.mp4
   * @params request data
   * @return null
   */
	public function cropVideo($media){
    $vid = $media->video_id;
    $input_file = $media->file_real_path;
    $output_file = \Drupal::service('video.making.process')->createVideoFile($vid);
    $prsetWidth =  (int)$media->preset_width;
    $prsetHeight =  (int)$media->preset_height;
    if(empty($media->crop_params)) {
      $scale = $prsetWidth.':'.$prsetHeight;
      $cmd = FFMPEG_PATH." -i $input_file -filter:v \" scale=$scale \" $output_file -c:a copy 2>&1";
      exec($cmd, $output_value, $return_value);
      $response = ['vid' => $vid, 'cmd' => $cmd, 'output_file' => $output_file, 'output_value' => $output_value, 'return_value' => $return_value];
      \Drupal::service('video.making.process')->trackProcessingStage($response, 'crop-video-no-param');
		}else{
			$duration = gmdate("H:i:s", $media->duration);
			$startTime = gmdate("H:i:s", $media->start_time);
			$crop_params = json_decode($media->crop_params);
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
			$width  = $dim['0'];
			$height = $dim['1'];
			$pad    = '';
			$scale  = '' ;
			$crop   = '';
			if($original_vdo_width > $width || $original_vdo_height > $height){
				if($original_vdo_width > $width){
				  $scale = $width*$zoom. ':-1'; 
				  $heightUpdate = ($original_vdo_height*$width*$zoom)/ $original_vdo_width;
				  $correctHeighttoCrop = ( $heightUpdate > $relative_vdo_height*$zoom*$previewScale ) ?$relative_vdo_height*$zoom*$previewScale : $heightUpdate;
				  $yCrop = 0; 
				  $x = 0;
				  $y = (int)abs($yPos*$previewScale );
				  $crop = $width.':'.(int)abs($correctHeighttoCrop).':'.(int)abs($xPos*$previewScale).':'.$yCrop;
				  $pad='width='.$width.':height='.$height.':x='.$x.':y='.$y.':color='.$bg;
				}else{
				  $scale = '-1:'.$height*$zoom;
				  $widthUpdate = ($original_vdo_width*$height*$zoom)/ $original_vdo_height;
				  $correctWidthtoCrop = ( $widthUpdate > $relative_vdo_width*$zoom*$previewScale ) ?$relative_vdo_width*$zoom*$previewScale : $widthUpdate;
				  $xCrop = 0; 
				  $x = (int)abs($xPos*$previewScale);
				  $y = 0;
				  $crop = (int)abs($correctWidthtoCrop).':'.$height.':'.$xCrop .':'.(int)abs($yPos*$previewScale);
				  $pad='width='.$width.':height='.$height.':x='.$x.':y='.$y.':color='.$bg;
				}
			}else{
        $scale = $original_vdo_width*$zoom.':-1'; 
        if ((int)$xPos <= 0 && (int)$yPos <= 0 ) {
          $x = 0; 
          $y = 0; 
          $crop = $width.':'.$height.':'.(int)abs($xPos*$previewScale).':'.(int)abs($yPos*$previewScale);
        }elseif((int)$xPos > 0 && (int)$yPos > 0 ){
          $x = (int)abs($xPos*$previewScale);
          $y = (int)abs($yPos*$previewScale);
          $pad = $width.':'.$height.':'.$x.':'.$y.':'.$bg;
        }elseif((int)$xPos > 0 && (int)$yPos <= 0){
          $x = (int)$xPos*$previewScale;
          $y = 0;
          $pad= $width.':'.$height.':'.$x.':'.$y.':'.$bg; 			 
          if($width > $original_vdo_width*$zoom && $height > $original_vdo_height*$zoom){
            $crop = $original_vdo_width*$zoom.':'.$original_vdo_height*$zoom.':0:'.(int)abs($yPos*$previewScale);             
          }elseif ($width < $original_vdo_width*$zoom && $height < $original_vdo_height*$zoom ){
            $crop = $width.':'.$height.':0:'.(int)abs($yPos*$previewScale); 
          } 
          elseif ($width < $original_vdo_width*$zoom && $height > $original_vdo_height*$zoom ){
            $crop = $width.':'.$original_vdo_height*$zoom.':0:'.(int)abs($yPos*$previewScale); 
          } 
          elseif ($width > $original_vdo_width*$zoom && $height < $original_vdo_height*$zoom ){
            $crop = $original_vdo_width*$zoom.':'.$height.':0:'.(int)abs($yPos*$previewScale); 
          }              
        }elseif((int)$xPos <= 0 && (int)$yPos > 0){
          $x = 0;
          $y = (int)$yPos*$previewScale;
          $pad = $width.':'.$height.':'.$x.':'.$y.':'.$bg;
          if($width > $original_vdo_width*$zoom && $height > $original_vdo_height*$zoom  ){
            $crop = $original_vdo_width*$zoom.':'.$original_vdo_height*$zoom.':'.(int)abs($xPos*$previewScale).':0';   
          }elseif ($width < $original_vdo_width*$zoom && $height < $original_vdo_height*$zoom ){
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
      
      $cmd = FFMPEG_PATH." -ss $startTime -i $input_file -t $duration  -filter:v \" scale=$scale, crop=$crop, pad=$pad \" -filter:a \"volume = $volume\"  $output_file 2>&1";
      exec($cmd, $output_value, $return_value);
      if($return_value === 0) {
        $response = ['vid' => $vid, 'cmd' => $cmd, 'output_file' => $output_file, 'output_value' => $output_value, 'return_value' => $return_value];
        \Drupal::service('video.making.process')->trackProcessingStage($response, 'crop-video-with-params');
      } else {
        $output_file = \Drupal::service('video.making.process')->createVideoFile($vid);
        $updateScale =  $prsetWidth.':'.$prsetHeight;
        $cmd = FFMPEG_PATH." -ss $startTime -i $input_file -t $duration  -filter:v \" scale=$updateScale \" -filter:a \"volume = $volume\"  $output_file 2>&1";
        exec($cmd, $output_value, $return_value);
        $response = ['vid' => $vid, 'cmd' => $cmd, 'output_file' => $output_file, 'output_value' => $output_value, 'return_value' => $return_value];
        \Drupal::service('video.making.process')->trackProcessingStage($response, 'crop-video-failure-callback'); 
      }
    }
    
    // https://stackoverflow.com/questions/47050033/ffmpeg-join-two-movies-with-different-timebase/47051191
    // Video resolution (e.g. -vf scale=1280x720)
    // Video framerate (framerate dont need to match, but the timescale. -video_track_timescale 60000)
    // Video interlacing (e.g. deinterlace using -vf yadif)
    // Video pixel format (e.g. -vf format=yuv420p)
    // Video codec (e.g. -c:v libx264)
    // Audio samplerate (e.g. -ar 48000)
    // Audio channels and track / layout (e.g. -map 0:1 -ac 2)
    // Audio codec(s) (e.g. -c:a aac)
    
    $output_file_video = \Drupal::service('video.making.process')->createVideoFile($vid);
    // code is to detect audio stream on video.
    $isAudioCmd = FFPROBE_PATH." -i $output_file -show_streams -select_streams a -loglevel error 2>&1";
    exec($isAudioCmd, $isAudio, $return);
    //\Drupal::logger('VMT:cropVideo-detectAudio')->debug('Status: '.$return.'<br><pre><code>' . print_r($isAudio, true) . '</code></pre>');
    $prsetScale =  $prsetWidth.':'.$prsetHeight;
    if(empty($isAudio)){
      // no audio stream is found and add blank audio stream.      
      $cmd = FFMPEG_PATH." -y -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -i {$output_file} -vf scale={$prsetScale} -c:v copy -c:a aac -shortest -c:v libx264 -video_track_timescale 60000 -qscale:v 2 -pix_fmt yuv420p {$output_file_video} 2>&1";
    }else{
      $cmd = FFMPEG_PATH." -y -i {$output_file} -vf scale={$prsetScale} -c:v libx264 -video_track_timescale 60000 -qscale:v 2 -codec:a copy -pix_fmt yuv420p {$output_file_video} 2>&1";
    }
    exec($cmd, $output_value, $return_value);
    
    $response = ['vid' => $vid, 'cmd' => $cmd, 'output_file' => $output_file_video, 'output_value' => $output_value, 'return_value' => $return_value];
    $s3fs_file = \Drupal::service('video.making.process')->trackProcessingStage($response, 'crop-video-normalization');
    // update output video for next transition processing 
    \Drupal::database()->update('vmt_media')
      ->condition('id', $media->id)
      ->condition('video_id', $vid)
      ->fields([
        'video_clip_path' => $s3fs_file['path'], 
      ])
      ->execute();
	}
  
  
  /**
   * crop media.
   *
   * @params request data
   * @return null
   */
	public function cropPhoto($media){
    $vid = $media->video_id;
	  $input_file  = $media->file_real_path;
	  $duration = ($media->duration == 0) ? 5 : $media->duration;
	  $output_file = \Drupal::service('video.making.process')->createImageFile($vid);
    $prsetWidth =  (int)$media->preset_width;
    $prsetHeight =  (int)$media->preset_height;
	  if(empty($media->crop_params)) {
      // no crop params avail, still need to resize image into preset dimensions
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
      $cmd = "convert -size $dimensions xc:$bgColor  \( $input_file -scale 100% +repage \) -geometry $geometry -composite $output_file";
      
      // commented code is just reference purpose
      // $cmd = "convert -size $dimensions xc:$bgColor  \( $input_file +repage \) -geometry +0+0 -composite $output_file";				  
      \Drupal::logger('default crop command ')->notice('<pre><code>' . print_r($cmd , true) . '</code></pre>');
	  
      exec($cmd, $output_value, $return_value);
      $response = ['vid' => $vid, 'cmd' => $cmd, 'output_file' => $output_file, 'output_value' => $output_value, 'return_value' => $return_value];
      \Drupal::service('video.making.process')->trackProcessingStage($response, 'crop-photo-no-param');
      sleep(5);
	  }else{
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
				$cmd = "convert -size $dimensions xc:$bgColor \( $input_file -scale $scale -crop $cropped +repage \) -geometry +0+0 -composite $output_file";
			} else {
				//. If one offset is negative another is Possitive or both positive 
				$page = '100x100'.sprintf("%+f",$x*$exportZoom).sprintf("%+f",$y*$exportZoom);
				$geometry = sprintf("%+f",$x*$exportZoom).sprintf("%+f",$y*$exportZoom);
				$cmd = "convert -size $dimensions xc:$bgColor  \( $input_file -scale $scale +repage \) -geometry $geometry -composite $output_file";
			}
		
      exec($cmd, $output_value, $return_value);
      $response = ['vid' => $vid, 'cmd' => $cmd, 'output_file' => $output_file, 'output_value' => $output_value, 'return_value' => $return_value];
      \Drupal::service('video.making.process')->trackProcessingStage($response, 'crop-photo-with-params');
			sleep(5);
	  }
    
    // convert cropped image into video clip
    $prsetDimension = $prsetWidth.'x'.$prsetHeight;
    $output_file_video = \Drupal::service('video.making.process')->createVideoFile($vid);
    $dduration = ($duration*25);
    if($media->clip_zoom == 'zoom-in' && $duration >= 5){
      $cmd = FFMPEG_PATH." -y -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -loop 1 -i {$output_file} -vf \"scale=-2:2*ih,zoompan=z='min(zoom+0.0015,1.5)':d={$dduration}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s={$prsetDimension},scale=-2:380\" -c:v libx264 -t {$duration} -r 30 -video_track_timescale 60000 -qscale:v 2 -pix_fmt yuv420p -s \"{$prsetDimension}\" -map 0:a -map 1:v -y {$output_file_video} 2>&1";
    }
    else if($media->clip_zoom == 'zoom-out' && $duration >= 5){
      $cmd = FFMPEG_PATH." -y -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -loop 1 -i {$output_file} -filter_complex \"scale=iw*4:ih*4,zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0015))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={$dduration}:s={$dimensions},scale={$prsetDimension}\" -c:v libx264 -t {$duration} -r 30 -video_track_timescale 60000 -qscale:v 2 -pix_fmt yuv420p -s \"{$prsetDimension}\" -map 0:a -map 1:v -y {$output_file_video} 2>&1";
    }
    else {
      $cmd = FFMPEG_PATH." -y -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -loop 1 -i {$output_file} -c:v libx264 -t {$duration} -r 30 -video_track_timescale 60000 -qscale:v 2 -pix_fmt yuv420p -vf scale={$prsetDimension} -map 0:a -map 1:v {$output_file_video} 2>&1";
    }
    exec($cmd, $output_value, $return_value);
    $response = ['vid' => $vid, 'cmd' => $cmd, 'output_file' => $output_file_video, 'output_value' => $output_value, 'return_value' => $return_value];
    $s3fs_file = \Drupal::service('video.making.process')->trackProcessingStage($response, 'convert-photo-to-video');
    \Drupal::database()->update('vmt_media')
      ->condition('id', $media->id)
      ->condition('video_id', $vid)
      ->fields([
        'video_clip_path' => $s3fs_file['path'], 
      ])
      ->execute();
  }
}
