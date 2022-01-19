<?php
namespace Drupal\media_kit_asset\Controller;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Drupal\file\Entity\File;
use Drupal\media\Entity\Media;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\s3fs\S3fsService;

class MediaKitAssetEditorController extends ControllerBase {
  /**
   * Returns product templates page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
   public function ImageConverterDownload($encripted_string){
         $result = null;
	/*	$ciphering = "BF-CBC";
		$options = 0;
		$decryption_iv = '1234567891011112';
        $decryption_key = 'FREEIMAGEEDITRO';
		$encryption = str_replace('sla-', '/', $encripted_string); 
    
        $decryption = openssl_decrypt ($encryption, $ciphering, $decryption_key, $options, $decryption_iv);
		\Drupal::logger('media kit image converter')->notice(' decr<pre><code>' . print_r($decryption, true) . '</code></pre>');
    */
    $encryption = str_replace('sla-', '/', $encripted_string);
		if($encryption){
           	$query_result = \Drupal::database()->select('file_share', 'n')
				->fields('n', ['fsid', 's3_path', 'time_stamp'])
				->condition('n.encripted_string', $encryption, '=')->execute()->fetchAll();
      if($query_result){
        $timeStamp = $query_result[0]->time_stamp;
        $icid = $query_result[0]->fsid;				
        $dif = time() - $timeStamp;
        if($dif < 86400){
          $file_url = $query_result[0]->s3_path;
          $download_time = ($query_result[0]->downloads)+1;
          \Drupal::database()->update('file_share')->fields(['downloads'=>$download_time])->condition('encripted_string', $encryption, '=')->execute();
          $file_url_clean = explode("?",$file_url);
          $filename = pathinfo($file_url_clean[0]);
          $file_name = $filename['basename'];
          /*
            header('Content-Type: application/octet-stream');
          header("Content-Transfer-Encoding: Binary"); 
          header("Content-disposition: attachment; filename=\"".$file_name."\""); 
          readfile($file_url);
          */
          /*header('Content-Type: application/octet-stream');
          header("Content-Transfer-Encoding: Binary"); 
          header("Content-disposition: attachment; filename=\"".$file_name."\""); 
          readfile($file_url);
          exit; */
            //allow access
                  //$data['message']= 'Thanks for Download';
                  $path = \Drupal::service('path.alias_manager')->getPathByAlias('/shared-file-confirmed');
          if(preg_match('/node\/(\d+)/', $path, $matches)) {
            $node = \Drupal\node\Entity\Node::load($matches[1]);
            $data['after_download_message'] = $node->body->value;
          }
          $data['url']=$file_url_clean[0] ;
          $access_file = 1;
          //$icid = $break_decr[0];
			 }else{
          //link expired
		     $data['message'] = "We’re sorry. This link has expired. It was valid for 24 hours.";
         $access_file = 0;
       } 
		 }else{
			  $data['message'] = 'Invalid encrypted string. Please check this link again.';
        $access_file = 0;
		}
    }
			$libraries[] = 'media_kit_asset/mediakit_asset.editor';
      $data['access_file'] = $access_file;
			$render_data['theme_data'] = [
			'#theme'                  => 'mediakit_asset_editor_download',
			'#data'                   => $data,
			'#attached'               => [
			  'library' => $libraries, 
			  'drupalSettings' => [
			     'access_file' => $access_file,
                 'icid' => $icid,				 
			  ],
			  ],
			];
		return $render_data;
	}
  
  public function ImageConverterSave($fids, $type){
    global $base_secure_url;	
     // $media = Media::load($fid); 
   //   public function saveFilesAsPublic($fid, $folder){
	  $returtData = [];
	  //$destdir = \Drupal::service('stream_wrapper_manager')->getViaUri('public://')->getUri();
    $folder = 'convertedfile/mediakit';
	  $uid = \Drupal::currentUser()->id();
	  $destdir= "public://{$folder}/{$uid}";
	  \Drupal::service('file_system')->prepareDirectory($destdir, \Drupal\Core\File\FileSystemInterface::CREATE_DIRECTORY);
    $media = Media::load($fids);
    if($type == 'audio'){
      $fid = $media->field_media_audio_file->target_id;
    }
    elseif($type == 'video'){
     $fid = $media->field_media_video_file->target_id;
      
    }
    elseif($type == 'doc'){
       $fid = $media->field_media_file->target_id;
     }
    elseif($type == 'image'){
       $fid = $media->field_media_image->target_id;
     } 
      $file = File::load($fid);
      $file_name = $file->getFilename();
      $file_path = $destdir . '/' . $file_name;
        if ($file = file_copy($file, $file_path, FILE_EXISTS_RENAME)) {
        
        $returtData['original_url'] = file_create_url($file->getFileUri());  
        $current_timestamp = time();
			 $icid =  \Drupal::database()->insert('file_share')
				 ->fields(array(
				  'uid' => $uid,
          'file_name' => $file_name ,
          'file_id'=> $fid,
				  'time_stamp' => $current_timestamp,
				  's3_path' =>$returtData['original_url'] ,
          'ip' => \Drupal::request()->getClientIp(),
          'downloads' =>0,
				 ))
				  ->execute(); 

        } else {
            die("Could not copy " . $file_path . " in " . $destdir);
        }
		//echo $returtData;
    $stingGen = $icid.'-'.$current_timestamp;
	 // $encryption = $this->generateDownlodableImageUrl($stingGen);
   $encryption = md5($stingGen);
    \Drupal::database()->update('file_share')->fields(['encripted_string'=>$encryption])->condition('fsid', $icid, '=')->execute(); 
    $downloadable_url = $base_secure_url.'/file-retriever/'.$encryption;	
    $returtDatas['dwnloadurl'] =  $downloadable_url;
    return new JsonResponse($returtDatas);
 //  } 
	
}

//

 public function ImageDownloadCon($fids){
   	$query_result = \Drupal::database()->select('file_share', 'n')
				->fields('n', ['s3_path'])
				->condition('n.fsid', $fids, '=')->execute()->fetchAll(); 
            if($query_result){				
				$file_url = $query_result[0]->s3_path;
				$file_url_clean = explode("?",$file_url);
				$filename = pathinfo($file_url_clean[0]);
				$file_name = $filename['basename'];
				header('Content-Type: application/octet-stream');
				header("Content-Transfer-Encoding: Binary"); 
				header("Content-disposition: attachment; filename=\"".$file_name."\""); 
				readfile($file_url); 
				exit; 	
			}
	
}

//

public function generateDownlodableImageUrl($stingGen){
	  $downloadable_url = '';
	  $simple_string = $stingGen;
      $ciphering = "BF-CBC";
      $options = 0;
	  $encryption_iv = '1234567891011112';
	  $encryption_key = 'FREEIMAGEEDITRO';
      $encryption = openssl_encrypt($simple_string, $ciphering, $encryption_key, $options, $encryption_iv);
	  $encryption = str_replace('/', 'sla-', $encryption); 
     // $downloadable_url = $base_secure_url.'/file-retriever/'.$encryption;	  
	  return $encryption;
	 
	}
}


