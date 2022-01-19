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

class VideoTestController extends ControllerBase {
  /**
   * Returns product templates page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function saveMediaFiles(){
    $input = "s3://s3fs_public/vmt/process/79/kitchenbanner.jpg";
    $output = "s3://s3fs_public/vmt/process/79/output.mp4";
    
    $cmd = FFMPEG_PATH." -framerate 30 -i $input -c:v libx264 -r 30 -pix_fmt yuv420p $output 2>&1";
  	exec($cmd, $coutput, $creturn);
    
    echo $cmd;
    echo '<pre>'; print_r($coutput); echo '</pre>';
    echo $creturn;
    
    echo '<hr>';
    
    $input = "public://vmt/process/79/kitchenbanner.jpg";
    $output = "public://vmt/process/79/output.mp4";
    
    $cmd = FFMPEG_PATH." -framerate 30 -i $input -c:v libx264 -r 30 -pix_fmt yuv420p $output 2>&1";
  	exec($cmd, $coutput, $creturn);
    
    echo $cmd;
    echo '<pre>'; print_r($coutput); echo '</pre>';
    echo $creturn;
    
    die();  
    
    
    
    $video_id = 79;
    // Story board media files
    $mquery = \Drupal::database()->select('vmt_media', 'm')
      ->fields('m', ['id', 'mid', 'start_time', 'duration', 'zoom', 'volume', 'ordering'])
      ->condition('m.video_id', $video_id, '=')
      ->orderBy('m.ordering', 'ASC')
      ->range(0, 1);
    $media = $mquery->execute()->fetchAll();
    
    if(!empty($media)){
      // create temporary directory
      $pubdir = \Drupal::service('video.making.process')->createPubDir($video_id);
      // save media files into temporary directory
      foreach($media as $k => $data){
        $clip = \Drupal::service('video.making.process')->saveMediaFile($pubdir, $data->mid);
        echo '<pre>'; print_r($clip); echo '</pre>';
        
        
        if(!empty($clip)){
          $media_fields = [];
          $media_fields['fid']            = $clip['fid'];
          $media_fields['type']           = $clip['type'];
          $media_fields['file_uri']  		  = $clip['file_uri'];
          $media_fields['file_tmp_path']  = $clip['file_tmp_path'];
          $media_fields['file_real_path'] = $clip['file_real_path'];
          
          // update media table
          \Drupal::database()->update('vmt_media')
            ->condition('id', $data->id)
            ->condition('video_id', $video_id)
            ->fields($media_fields)
            ->execute();
        }
      }
    }else{
      die("The video: {$video_id} is already processed or this step is already done.");
    }
    
    die('here');
  }
}
