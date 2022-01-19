<?php
namespace Drupal\image_asset_editor\Controller;
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

class ImageAssetEditorController extends ControllerBase {
  /**
   * Returns product templates page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function getImageAssetEditor(Media $media){
        global $base_secure_url;
        $account = \Drupal::currentUser();
        $uid = $account->id();
				$original_style = \Drupal::entityTypeManager()->getStorage('image_style')->load('original_style');
        if (is_object($media)) {
            if ($media->hasField('field_media_image')) {
                $targetid = $media->field_media_image->target_id;
                $file = File::load($targetid);
				$media_data['fid'] = $targetid;
                //$media_data['mid_url'] = file_create_url($file->getFileUri());
                $media_data['mid_url'] = $original_style->buildUrl($file->getFileUri());
            }
            $media_data['original_dim'] = $media->field_pixel_dimentions->value ;
            $media_data['selected_preset'] = $media->field_made_from_preset->target_id;
			$media_data['source_type'] = $media->field_media_source_type->value;
            if($media_data['selected_preset']){
               $media_data['selected_preset_data'] = \Drupal::service('social_media.social_media_controller')->getMediaPresetProperties($media_data['selected_preset']);
            }
        }

         $response = \Drupal::service('social_media.social_media_controller')->getMediaPreset('image');
         $media_preset = json_decode($response->getContent()); 
         $data['media_preset'] = $media_preset;         
         $data['content'] = 'image editor content';
        $libraries[] = 'media_design_system/colorPicker';
        $libraries[] = 'video_maker_tool/vmt.cropit';
        $libraries[] = 'image_asset_editor/image_asset.editor';
        $render_data['theme_data'] = [
        '#theme'                  => 'image_asset_editor',
        '#data'                   => $data,
        '#attached'               => [
          'library' => $libraries, 
          'drupalSettings' => [
              'media_base_url' => $base_secure_url, 
              'user_id' => $uid,
              'media_data' => $media_data,
            ],
          ],
        ];
        

        return $render_data;    
        }
		
		public function freeImageConverter(){
			global $base_secure_url;
			$account = \Drupal::currentUser();
			$uid = $account->id();
		    $response = \Drupal::service('social_media.social_media_controller')->getMediaPreset('image');
            $media_preset = json_decode($response->getContent());
			//remove custom size image from preset list
            foreach($media_preset as $key=>$val){
				if(strtolower($val->name) == "custom image size"){
					unset($media_preset[$key]);
					break;
				}
            }			
            $data['media_preset'] = $media_preset;  
			$data['content'] = 'image editor content';
			$libraries[] = 'media_design_system/colorPicker';
			$libraries[] = 'video_maker_tool/vmt.cropit';
			$libraries[] = 'media_vault_tool/mvt_plupload';
            $libraries[] = 'media_vault_tool/react.min';
            $libraries[] = 'media_vault_tool/react.dom.min';
            $libraries[] = 'media_vault_tool/axios';
			$libraries[] = 'media_vault_tool/media_vault_tool_css';
			$libraries[] = 'image_asset_editor/free_image_asset.editor';
			$render_data['theme_data'] = [
			'#theme'                  => 'free_image_asset_editor',
			'#data'                   => $data,
			'#attached'               => [
			  'library' => $libraries, 
			  'drupalSettings' => [
				  'media_base_url' => $base_secure_url, 
				  'user_id' => $uid,
				  'media_data' => $data,
				],
			  ],
			];
			

			return $render_data;    
		}
    public function freeImageConverterSubmit(){
		global $base_secure_url;	
        $result = [];
	    if($fileObject = $this->getConvertedImage()){
			$imageProperties = \Drupal::request()->get('convertedImage');
			$email = $imageProperties['email'];
			$convertedImageUrl = file_create_url($fileObject->getFileUri());
			$current_timestamp = time();
			 $icid =  \Drupal::database()->insert('free_image_converter')
				 ->fields(array(
				  'email' => $email,
				  'time_stamp' => $current_timestamp,
				  's3_path' =>$convertedImageUrl,
				 ))
				  ->execute(); 
			$stingGen = $icid.'-'.$current_timestamp.'-'.rand(0,9);
			//$encryption = $this->generateDownlodableImageUrl($stingGen);
			$encryption = md5($stingGen);
			\Drupal::database()->update('free_image_converter')->fields(['encripted_string'=>$encryption])->condition('$icid', $icid, '=')->execute();
			$download_url = $base_secure_url.'/image-converter/file/'.$encryption;
			$real_text = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', $download_url]; 
			\Drupal::service('notification_system.notification_controller')->addNotification('Your free image is ready to download', $real_text, 0, $email);
			$result['convertedImageUrl'] = $convertedImageUrl;
			$result['email'] = $email;
			$result['download_url'] = $download_url;
			$result['response'] = 1;
	    }
		return new JsonResponse($result);
	}	
	public function generateDownlodableImageUrl($stingGen){
	  
	  $downloadable_url = '';
	  $simple_string = $stingGen;
      $ciphering = "BF-CBC";
      $options = 0;
	  $encryption_iv = '12345678';
	  $encryption_key = 'ImgKabConvert';
      $encryption = openssl_encrypt($simple_string, $ciphering, $encryption_key, $options, $encryption_iv);
	  $encryption = str_replace('/', 'sla-', $encryption); 
      //$downloadable_url = $base_secure_url.'/image-converter/file/'.$encryption;	  
	  return $encryption;
	 
	}
	public function freeImageConverterDownload($encripted_string){
		global $base_secure_url;
		//$encripted_string = (string)$encripted_string;
	    \Drupal::logger('free image converter')->notice('plux <pre><code>' . print_r($encripted_string, true) . '</code></pre>');
        $icid = '';		
        $result = null;
		/*$ciphering = "BF-CBC";
		$options = 0;
		$decryption_iv = '12345678';
        $decryption_key = 'ImgKabConvert'; */
		$encryption = str_replace('sla-', '/', $encripted_string); 
       // $decryption = openssl_decrypt ($encryption, $ciphering, $decryption_key, $options, $decryption_iv);
		//\Drupal::logger('free image converter')->notice(' decr<pre><code>' . print_r($decryption, true) . '</code></pre>');
		if($encryption){
           	$query_result = \Drupal::database()->select('free_image_converter', 'n')
				->fields('n', ['icid', 's3_path', 'time_stamp'])
				->condition('n.encripted_string', $encryption, '=')->execute()->fetchAll();

          if($query_result){
			$timeStamp = $query_result[0]->time_stamp;
            $icid = $query_result[0]->icid;				
            $dif = time() - $timeStamp;
            if($dif < 86400){				
				$file_url = $query_result[0]->s3_path;
				\Drupal::database()->update('free_image_converter')->fields(['status'=>'completed'])->condition('encripted_string', $encryption, '=')->execute();
				$file_url_clean = explode("?",$file_url);
				$filename = pathinfo($file_url_clean[0]);
				$file_name = $filename['basename'];
			    //allow access
				$data['after_download_message'] = 'Thanks for using our free image converter. Your download has been completed successfully.' ;
                $data['message']= 'Thanks for using our free image converter.';
				$path = \Drupal::service('path.alias_manager')->getPathByAlias('/image-converter-completed');
				if(preg_match('/node\/(\d+)/', $path, $matches)) {
				  $node = \Drupal\node\Entity\Node::load($matches[1]);
				  $data['after_download_message'] = $node->body->value;
				}
				$data['url']=$file_url_clean[0] ;
				$access_file = 1;
				//$icid = $break_decr[0];
			}
         else{
          //link expired
		   $data['message'] = "We’re sorry. This link has expired. It was valid for 24 hours.";
		   $access_file = 0;
         } 
		 }
		else{
			$data['message'] = 'Invalid encrypted string. Please check this link again.';
			$access_file = 0;
		}
		}
		$data['base_url'] = $base_secure_url;
		$data['access_file'] = $access_file;
		$libraries[] = 'image_asset_editor/free_image_asset_download.editor';
			$render_data['theme_data'] = [
			'#theme'                  => 'free_image_asset_editor_download',
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
	public function downloadConvertedImage($icid){
		    $result = [];
        	$query_result = \Drupal::database()->select('free_image_converter', 'n')
				->fields('n', ['s3_path'])
				->condition('n.icid', $icid, '=')->execute()->fetchAll(); 
            if($query_result){				
				$file_url = $query_result[0]->s3_path;
				$file_url_clean = explode("?",$file_url);
				$filename = pathinfo($file_url_clean[0]);
				$file_name = $filename['basename'];
				header('Content-Type: application/octet-stream');
				header("Content-Transfer-Encoding: Binary"); 
				header("Content-disposition: attachment; filename=\"".$file_name."\""); 
				readfile($file_url); 
				//exit; 
               // $response = new RedirectResponse('/image-converter-completed'); 
               // $response->send();	
                return new JsonResponse($result);					
			}
	}
    public function getConvertedImage(){
	 	$imageProperties = \Drupal::request()->get('convertedImage');
		$mode= \Drupal::request()->get('mode');
		\Drupal::logger('free image converter')->notice('<pre><code>' . print_r($mode, true) . '</code></pre>');
		
	    /*if( $preset != -1 ){
			$terms_obj = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($preset);
			$color_space = $terms_obj->field_color_space->value;
		} else {
		  $color_space = '';
		} */
		$bgColor = $imageProperties["bgColor"]; 
		$exportZoom = $imageProperties["exportZoom"]; 					 
	  // resize image dimensions
		$resizedArray = explode("x", $imageProperties["dim"]);
		$width = (int)$resizedArray[0];
		$height = (int)$resizedArray[1] ;
		$dimensions = $width.'x'.$height;
		$scale = ($imageProperties['currentZoom']*100).'%';
		$time_stamp = time();
		/*$generate_recommended_file_name_data = 'temporary://' . 'tempfile.'.$imageProperties["type"];
		$generate_recommended_file_name = \Drupal::service('file_system')->realpath($generate_recommended_file_name_data); */
		/*  $absolute_path = \Drupal::service('file_system')->realpath('temporary://converter/');
          file_prepare_directory($absolute_path,  FILE_CREATE_DIRECTORY);
		  $generate_recommended_file_name = $absolute_path.'/tempfile.'.$imageProperties["type"];  */
		  $file = File::load($imageProperties["fid"]);
          $filename = $time_stamp.$file->getFilename();
          $mime_type = pathinfo($filename, PATHINFO_EXTENSION);
          $generate_recommended_file_name_data = 'temporary://' . $filename;
          $generate_recommended_file_name = \Drupal::service('file_system')->realpath($generate_recommended_file_name_data);
          $file_path =  drupal_tempnam('temporary://', 'media_'); 
          if (file_copy($file, $file_path, FILE_EXISTS_REPLACE)) {
            $img_file = drupal_realpath($file_path);
			//\Drupal::logger('free image converter')->notice('$img_file <pre><code>' . print_r($img_file , true) . '</code></pre>');
          }
		//$img_file = $imageProperties['uploaded_image_src'];
		if ($imageProperties["offset"]["x"] <= 0 && $imageProperties["offset"]["y"] <= 0 ) {
			//if offset is nagative, then it means larger image need to shrink. Copped operation need to perform
			$offset_x_cropped = abs($imageProperties["offset"]["x"]*$exportZoom);
			$offset_y_cropped = abs($imageProperties["offset"]["y"]*$exportZoom);
			$cropped = $dimensions.'+'.$offset_x_cropped.'+'.$offset_y_cropped;
			$cmd = "convert -size $dimensions xc:$bgColor \( $img_file -scale $scale -crop $cropped +repage \) -geometry +0+0 -composite $generate_recommended_file_name";
           			
		} else {
			//. If one offset is negative another is Possitive or both positive 
			$page = '100x100'.sprintf("%+f",$imageProperties["offset"]["x"]*$exportZoom).sprintf("%+f",$imageProperties["offset"]["y"]*$exportZoom);
			$geometry = sprintf("%+f",$imageProperties["offset"]["x"]*$exportZoom).sprintf("%+f",$imageProperties["offset"]["y"]*$exportZoom);
			$cmd = "convert -size $dimensions xc:$bgColor  \( $img_file -scale $scale +repage \) -geometry $geometry -composite $generate_recommended_file_name";

		}
		$executed_commond = exec($cmd, $op);
		//\Drupal::logger('free image converter')->notice('op<pre><code>' . print_r($op, true) . '</code></pre>');
		sleep(5);
		$fileContent = file_get_contents($generate_recommended_file_name);
		//remove temporary file
		//unlink($generate_recommended_file_name);
		if ($fileContent){
			$directory = "public://converter/";
			\Drupal::service('file_system')->prepareDirectory($directory, \Drupal\Core\File\FileSystemInterface::CREATE_DIRECTORY);
			$destination = $directory . 'convertedfile.'.$imageProperties["type"];

			try {
				$file = file_save_data($fileContent, $destination, FILE_EXISTS_RENAME);
				return $file;
				//$convertedImageUrl = file_create_url($file->getFileUri());
					//	\Drupal::logger('free image converter')->notice('<pre><code>' . print_r($convertedImageUrl, true) . '</code></pre>');
			}
			catch(Exception $e) {
				echo 'Message: ' . $e->getMessage();
			}
		} else {
			//return 0;
			\Drupal::logger('free image converter')->notice(' <pre><code>' . print_r('error converting image', true) . '</code></pre>');
			return 0;
		}	
	}	
}


