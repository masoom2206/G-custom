<?php
/**
 * @file
 * Contains \Drupal\media_vault_tool\Controller\MediaEditFormController.php
 *
 */
namespace Drupal\media_vault_tool\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\NodeInterface;
use Drupal\node\NodeTypeInterface;
use Drupal\Core\Controller\ControllerBase;
use Drupal\media_vault_tool\Controller\MediaDetailController;
use Drupal\node\Entity\Node;
use Drupal\file\Entity\File;
use Drupal\user\Entity\User;
use Drupal\media\Entity\Media;
use Drupal\s3fs\S3fsService;
use Drupal\Core\Url;
use Drupal\Core\Access\AccessResult;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Serializer\Encoder\JsonDecode;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Template\TwigEnvironment;
use Drupal\taxonomy\Entity\Term;

class MediaEditFormController extends ControllerBase implements ContainerInjectionInterface
{
	/**
	 * @var Drupal\Core\Template\TwigEnvironment
	 */
	protected $twig;
	public function __construct(TwigEnvironment $twig){
		$this->twig = $twig;
	}
	
	/**
   * {@inheritdoc}
   */
	public static function create(ContainerInterface $container){
		return new static ($container->get('twig'));
	}

  /**
	 * @return array
	 */
  public function mediaImageEditor(Media $media){
		global $base_secure_url; 
		$current_uid = \Drupal::currentUser()->id();
        $account = \Drupal\user\Entity\User::load($current_uid );
		if (in_array("advanced_content_creator", $account->getRoles())){
		  $advance_access = 1;
		  }
		else{
		  $advance_access = 0;
		  }		
		$media_data = [];
		if (is_object($media)){
      $mid = $media->id();
			if ($media->hasField('field_media_image')){
				$targetid = $media->field_media_image->target_id;
				$file = File::load($targetid);
				$media_data['mid_url'] = file_create_url($file->getFileUri());
				$media_data['file_name'] = $file->getFilename();
				$media_data['name'] = $media->name->value;
				$pix_dim = $media->field_pixel_dimentions->value;
				$b = explode(" x ", $pix_dim);
				if(count($b) == 1){
				  $b = explode("x", $pix_dim);
				}
				$media_data['original_dim'] = (int)$b[0] . ' x ' . (int)$b[1] . ' px';
				$media_data['achived'] = $media->field_archived->value;
				$media_data['file_size'] = $media->field_file_size->value;
				$media_data['copyright'] = $media->field_copyright_number->value;
				$media_data['favorite'] = $media->field_favorite->value;
				$media_data['description'] = $media->field_description_plain_text->value;
				$file_extension = $media->field_format->value;
				/*if($file_extension ){
					//\Drupal::logger('extension1')->debug('asd<pre><code>' . print_r($file_extension, TRUE) . '</code></pre>');
					$remove_dot = explode(".",$file_extension);
					$ext = '';
					if(count($remove_dot) > 1){
					 $ext =  $remove_dot[1];
					} else {
					 $ext =  $remove_dot[0];
					}
				}else{ */
				 $pathInfo = pathinfo($media_data['file_name']);
				 $ext = $pathInfo['extension']; 
				 // \Drupal::logger('extension')->debug('asdf<pre><code>' . print_r($ext, TRUE) . '</code></pre>');
				//}

				$media_data['extenstion'] = $ext;
				$media_data['mid'] = $media->id();
				$tags_name = '';
				foreach ($media->get('field_keywords')->getValue() as $term_id){   
				  if($term_id['target_id']){
					  $tags_name .= \Drupal\taxonomy\Entity\Term::load($term_id['target_id'])->label() . ', ';
				  }					 
				}
				$media_data['tags'] = $tags_name;
                $media_data['source_type'] = $media->field_media_source_type->value;                
		  }
		  $file_owner = $media->getOwnerId();
		  //current used in mkit
			$md = new MediaDetailController();
			$mediaList = $md->getallMediaByfile($media, 'image');
			$media_data['used_mkit'] = $mediaList;
    }
		$data['media_data'] = $media_data;
		$imageEditor = \Drupal::service('imageAsset.editor')->getImageAssetEditor($media);
		$data['editor_content'] = $imageEditor;

		// get media kits
		$query_media_kit = \Drupal::database()->select('node_field_data', 'n')
				->fields('n', ['nid', 'title'])
				->condition('n.uid', $file_owner, '=')->condition('n.type', 'media_kit', '=');
		$nids_media_kit = $query_media_kit->execute()->fetchAll();
		$data['media_kit'] = $nids_media_kit;
		$data['advance_access'] = $advance_access;
		$data['uid'] = $file_owner;
		// get default media kit
		$data['default_kit'] = default_media_kit_by_user($file_owner);
			 //\Drupal::logger('media kit ')->debug('<pre><code>' . print_r($default_kit, TRUE) . '</code></pre>');
		$render_data['theme_data'] = array(
			'#theme' => 'media_edit_photo_template',
			'#data' => $data,
			'#attached' => [
				'library' => [
					'media_vault_tool/custom_image_editor',
					'media_vault_tool/react.min',
					'media_vault_tool/react.dom.min',
					'media_vault_tool/axios',
					'video_maker_tool/vmt.tagsinput',
				],
				'drupalSettings' => [
					'media_base_url' => $base_secure_url,
					'media_owner' => $file_owner,
					'advance_access' => $advance_access,
					'media_data' => $data,
				],
			],
		);
		
		return $render_data;
  }

  /**
	 * @return array
	 */
	public function mediaAudioEditor(Media $media){
		global $base_secure_url;      
		$media_data = [];
		if (is_object($media)){
			if ($media->hasField('field_media_image')){}
		}
		$render_data['theme_data'] = array(
			'#theme' => 'media_edit_photo_template',
			'#data' => $data,
			'#attached' => [
				'library' => [
					'media_vault_tool/custom_image_editor',
					'media_vault_tool/react.min',
					'media_vault_tool/react.dom.min',
					'media_vault_tool/axios',
					'video_maker_tool/vmt.tagsinput',
				],
				'drupalSettings' => ['media_base_url' => $base_secure_url,
					'media_owner' => $file_owner,
				],
			],
		);

		return $render_data;
	}  
   /**
	 * @return array
	 */
	public function mediaVideoEditor(Media $media){
		global $base_secure_url;      
		$media_data = [];
		if (is_object($media)){
			if ($media->hasField('field_media_video_file')){
               $targetid = $media->field_media_video_file->target_id;
                if($targetid){
                    $file = File::load($targetid);
                    $media_data['original_fid'] = $targetid;
                    $media_data['mid_url'] = file_create_url($file->getFileUri());
                    $media_data['file_name'] = $file->getFilename(); 
                    $file_extension = pathinfo($file->getFilename(), PATHINFO_EXTENSION);
					if(strtolower($file_extension) == 'avi'){
				     // html5 video tag does not support avi format,so convert it into	mp4
					$file_path =  drupal_tempnam('temporary://', 'media_'); 
					 if ($file_new = file_copy($file, $file_path, FILE_EXISTS_REPLACE)) {
					   $img_file = drupal_realpath($file_path);
					 }
                     $ffmpegpath   = exec('which ffmpeg');
                     $tempVideo = 'avitomp4.mp4';
                     $temp_file_name_data = 'temporary://' . $tempVideo ;
		             $temp_file_name = \Drupal::service('file_system')->realpath($temp_file_name_data);					 
					 $cmd = "$ffmpegpath -i $img_file $temp_file_name 2>&1";
                     //\Drupal::logger('ffmpeg avi ')->debug('<pre><code>' . print_r($cmd, true) . '</code></pre>');
					 exec($cmd, $error);
					 sleep(5);
					 $fileContent = file_get_contents($temp_file_name);
					 //remove temporary file
					unlink($temp_file_name);
					if ($fileContent){
						$directory = "public://";
						$destination = $directory .$tempVideo ;
						\Drupal::service('file_system')->prepareDirectory($directory, \Drupal\Core\File\FileSystemInterface::CREATE_DIRECTORY);
						try {
							$file_callback = file_save_data($fileContent, $destination, FILE_EXISTS_RENAME);
							$media_data['mid_url_callback'] = file_create_url($file_callback->getFileUri());
                            //\Drupal::logger('ffmpeg avi ')->debug('<pre><code>' . print_r($media_data['mid_url_callback'], true) . '</code></pre>');
						}
						catch(Exception $e) {
				         echo 'Message: ' . $e->getMessage();
			            }
					}
						
					}
					else{
					 $media_data['mid_url_callback'] = file_create_url($file->getFileUri());	
					}
                    					
                }
				$media_data['name'] = $media->name->value;
                $media_data['achived'] = $media->field_archived->value;
				$media_data['file_size'] = $media->field_file_size->value;
                if($media->field_duration->value != ''){
                   $media_data['file_duration'] = $media->field_duration->value; 
                }
                else{
                 $media_data['file_duration'] = '00:00:00';
                }
				$media_data['copyright'] = $media->field_copyright_number->value;
				$media_data['favorite'] = $media->field_favorite->value;
                $media_data['original_file_type'] = $media->field_format->value;
				$media_data['description'] = $media->field_description_plain_text->value;
                $media_data['genre'] = $media->field_genre->target_id;
                $media_data['mid'] = $media->id();
                $thumbnails_style = \Drupal::entityTypeManager()->getStorage('image_style')->load('thumbnail');
                $media_data['preset_id'] = $media->field_made_from_preset->target_id;
                if($media->field_video_thumbnail->target_id){
                      $thumb_target_id = $media->field_video_thumbnail->target_id;
                      $file = File::load($thumb_target_id); 
                      $media_data['thumbnail']['file_url'] = $thumbnails_style->buildUrl($file->getFileUri());
                      $media_data['thumbnail']['fid'] = $file->fid->value ;
                      $media_data['thumbnail']['target_id'] = $thumb_target_id ;
                      $media_data['thumbnail']['file_name'] = $file->getFilename();
                      $media_data['thumbnail']['type'] = 'no-default' ;
                }
                
                else{
                      $default_target_id = $media->thumbnail->target_id;
                    //  $file = File::load($default_target_id); 
                    // $media_data['thumbnail']['file_url'] = $thumbnails_style->buildUrl($file->getFileUri());
                    // $media_data['thumbnail']['fid'] = $file->fid->value ;
                    //  $media_data['thumbnail']['target_id'] = $default_target_id ;
                    //  $media_data['thumbnail']['file_name'] = $file->getFilename();
                      $media_data['thumbnail']['type'] = 'default' ;
                }
                $thumbs_selection = [];
                foreach ($media->get('field_thumbnail_selections')->getValue() as $thumbnails){ 
                   $file_target_id =  $thumbnails['target_id'];
                   $file = File::load($file_target_id); 
                   $thumbs_selection[$file_target_id]['file_url'] = $thumbnails_style->buildUrl($file->getFileUri());
                   $thumbs_selection[$file_target_id]['fid'] = $file->fid->value ;
                }
                $media_data['thumbs_selection'] = $thumbs_selection;
				$tags_name = '';
				foreach ($media->get('field_keywords')->getValue() as $term_id){   
				  if($term_id['target_id']){
					 $tags_name .= \Drupal\taxonomy\Entity\Term::load($term_id['target_id'])->label() . ', ';
				  }					 
				}
                $max_video_duration = '';
				$media_data['tags'] = $tags_name; 
                if($media_data['preset_id'] ){
                  $preset_tid_load = \Drupal\taxonomy\Entity\Term::load($media_data['preset_id'] );
                  if($preset_tid_load->vid->target_id == 'image_preset'){
                    $max_video_duration = $preset_tid_load->field_video_time_limit->value;
                  }
                }   
                $media_data['max_video_duration'] = $max_video_duration;
				$media_data['source_type'] = $media->field_media_source_type->value;
			}
                $vid = 'genre';
                $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid);
                foreach ($terms as $term) {
                    if($term->tid == $media_data['genre']){
                     $genre_terms[$term->tid]['name'] = $term->name;
                      $genre_terms[$term->tid]['selected'] = 1;
                    }
                     else{
                      $genre_terms[$term->tid]['name'] = $term->name;
                      $genre_terms[$term->tid]['selected'] = 0;
                    }
                }
                 $media_data['genre_terms'] = $genre_terms;
                }  
           
         $response = \Drupal::service('social_media.social_media_controller')->getMediaPreset('video');
         $media_preset = json_decode($response->getContent()); 
         $data['media_preset'] = $media_preset;
           $file_owner = $media->getOwnerId();
		  //current used in mkit
			$md = new MediaDetailController();
			$mediaList = $md->getallMediaByfile($media, 'video');
			$media_data['used_mkit'] = $mediaList;
  
		$data['media_data'] = $media_data;
		
		// get media kits
		$query_media_kit = \Drupal::database()->select('node_field_data', 'n')
				->fields('n', ['nid', 'title'])
				->condition('n.uid', $file_owner, '=')->condition('n.type', 'media_kit', '=');
		$nids_media_kit = $query_media_kit->execute()->fetchAll();
				
		$data['media_kit'] = $nids_media_kit;
		// get default media kit
		$data['default_kit'] = default_media_kit_by_user($file_owner);
			 
		$render_data['theme_data'] = array(
			'#theme' => 'media_edit_video_template',
			'#data' => $data,
			'#attached' => [
				'library' => [
					'media_vault_tool/react.min',
					'media_vault_tool/react.dom.min',
					'media_vault_tool/axios',
					'video_maker_tool/vmt.tagsinput',
                    'media_design_system/colorPicker',
					'media_vault_tool/custom_video_editor',
				],
				'drupalSettings' => ['media_base_url' => $base_secure_url,
					'media_data' => $data,
					'media_owner' => $file_owner,
				],
			],
		);

		return $render_data;
	}  
    public function base64ToImageSave(){
		$response = [];
		$output_file  = \Drupal::service('file_system')->realpath('temporary://' . rand() . '.jpeg');
        $ifp = fopen( $output_file, 'wb' ); 
		$imageBase64 =  \Drupal::request()->get('imageBase64');
		$data = explode(',', $imageBase64);
        $imageData = $data[1];
        fwrite( $ifp, base64_decode( $imageData ));
        // clean up the file resource
        fclose( $ifp ); 

        $fileContent = file_get_contents($output_file);
        $directory = "public://";
        $destination = $directory . 'temp_file_new_'.rand().'.jpeg';
        \Drupal::service('file_system')->prepareDirectory($directory, \Drupal\Core\File\FileSystemInterface::CREATE_DIRECTORY);
		try {
			$file = file_save_data($fileContent, $destination, FILE_EXISTS_RENAME);
			ksm($file->id());
			$response['fid']= $file->id();
			$response['file_url']= file_create_url($file->getFileUri());
		 }
        catch(Exception $e) {
            echo 'Message: ' . $e->getMessage();
        }
		return new JsonResponse($response);

	}	
  
	/**
	 * @return json array
	 */
	public function customMediaUpdate(Media $media) {
		$get_updated_media = \Drupal::request()->get('updated_media');
		$redirect = \Drupal::request()->get('redirect');
	 /* $base64_string = $get_updated_media['imageData'];
		$data = explode(',', $base64_string);
		$imageData = $data[1]; */
		$mid = $get_updated_media['mid'];
		$imageProperties = $get_updated_media['imageAfterCopped'];
		$preset = $get_updated_media['preset'];
		$preset_type = $get_updated_media['preset_type'];
		$preset_dimension = $get_updated_media['preset_dimension'];
		$media_kits = $get_updated_media['mkits'];
		$remove_media_kits = isset($get_updated_media['remove_mkits']) ? $get_updated_media['remove_mkits'] : '';
		$file_name = $get_updated_media['file_name'];
		$title = $get_updated_media['title'];
		$copy_right = $get_updated_media['copy_right'];
		$description = $get_updated_media['description'];
		$archieve = $get_updated_media['archieve'];
		$favorite = $get_updated_media['favorite'];
		$tagsTextArray = isset($get_updated_media['tags']) ? $get_updated_media['tags'] : '';
		$mode = \Drupal::request()->get('mode');
		$update = \Drupal::request()->get('update');
		if($update == 'new'){
		 $file_name = $this->updateFileName($file_name, $preset_type);
		} 
		//Tags added/remove to/from media kit
		$get_tags = [];
		if (is_array($tagsTextArray) ){
			foreach($tagsTextArray as $termText){
			 $get_tags[] =  $this->getTagsTermId(trim($termText), $media->getOwnerId());
			}
		}
			 
		// generate new image

		// $fileObject =  $this->convertBase64ToImage($file_name, $preset, $imageData);
		$fileObject =  $this->modifiedImage($file_name, $preset, $mid, $imageProperties, $preset_dimension );
		if ($fileObject) {
			$file_path = $fileObject->getFileUri();
			$id3file = NULL;
			$id3_lib_availability = getid3_load();
			if ($id3_lib_availability == false) {
				drupal_set_message(t("The getid3() module cannot find the getID3 library used to read and write ID3 tags. The site administrator will need to verify that it is installed and then update the <a href='!admin-settings-audio-getid3'>settings</a>.", array('!admin-settings-audio-getid3' => Url::fromRoute('getid3.config'))), 'error', false);
				return $id3file;
			}
			$id3file = getid3_analyze($file_path);
			//$pathinfo = pathinfo($id3file['filenamepath']);
			//$extName = $pathinfo['extension'];
			if ($id3file['video']['dataformat'] == 'png') {
				if (isset($id3file['png']['IHDR']['raw']['bit_depth'])) {
					$bit_depth = $id3file['png']['IHDR']['raw']['bit_depth'] . '-bit';
				}
		    }
			if ($id3file['video']['dataformat'] == 'jpg' || $id3file['video']['dataformat'] == 'jpeg') {
				$bit_depth = isset($id3file['video']['bits_per_sample']) ? $id3file['video']['bits_per_sample'] . '-bit' : '';
			}				 
		}
		//update media
		if($update == 'self'){
			if ($fileObject) {
				$media->field_media_image->target_id = $fileObject->id();
				$media->set('field_bit_depth', $bit_depth);
				$media->set('field_pixel_dimentions', $preset_dimension); 
				$media->set('field_file_size', $this->getFormatedFileSize($fileObject->get('filesize')->getValue() [0]['value'])); 
			}
			$media->set('field_favorite', $favorite);
			$media->set('field_archived', $archieve);
			$media->set('field_copyright_number', $copy_right);
			$media->set('field_description_plain_text', $description);
			if($media->field_media_source_type->value == 'uploaded' || $media->field_media_source_type->value == NULL ){
				$media->set('field_media_source_type', 'Upload Modified');
			}
			//$media->set('field_media_source_type', 'uploaded'); 
			$media->set('field_keywords', $get_tags);
			
			if($preset != -1){
				$media->set('field_format', '.' . $preset_type);
				$media->set('field_made_from_preset',$preset);
			}
			$result = $media->save();
			// not sure, why title field is not updated when file update. again saving title.
			$media->set('name',$title);
			$result = $media->save();
			// user can remove media from kit, if and only if the media already exist. If media is assigned to any media kit, by default 
			//every media is linked with media vault and "Default media kit". User should not allowed to remove media from "Default media kit"
			if (is_array($remove_media_kits) ){
				foreach($remove_media_kits as $kit){
					$r_media_kit = \Drupal::database()->select('node_field_data', 'n')->fields('n', ['nid'])->condition('n.uid', $media->getOwnerId() , '=')->condition('n.nid', $kit,'=')
												->condition('n.type', 'media_kit', '=')->execute()->fetchAssoc();
					if ($r_media_kit) {
						$r_kit = Node::load($kit);
						$items = $r_kit->get('field_vault_photo')->getValue();
						foreach($items as $key =>$value){
							if($value['target_id'] == $mid){
								$r_kit->get('field_vault_photo')->removeItem($key);
								$r_kit->save();
							}
						}
					}
			  }
		  }
		  $message = 'The image asset record has been successfully saved.';
	  }
		//create new media
		else{
			//old media to use to get media owner
			$media_new = Media::create([
				'bundle' => 'image', 
				'name' => $title,
				'field_description_plain_text' => ['value' => $description, ],
				'field_copyright_number' => ['value' => $copy_right, ],
				'field_favorite' => ['value' => $favorite, ],
				'field_archived' => ['value' => $archieve, ],
				'field_media_source_type' => ['value' => 'generated', ],
				'field_format' => ['value' => '.' . $preset_type, ],
			 ]);
			if ($fileObject) {
				$media_new->field_media_image->target_id = $fileObject->id();
				$media_new->set('field_bit_depth', $bit_depth);
				$media_new->set('field_pixel_dimentions', $preset_dimension); 
				$media_new->set('field_file_size', $this->getFormatedFileSize($fileObject->get('filesize')->getValue() [0]['value'])); 
			} 
			if($preset != -1){
				$media_new->set('field_made_from_preset',$preset);
			}             
			$media_new->set('field_keywords', $get_tags);       
			$media_new->uid = $media->getOwnerId();
			$media_new->save();
			$mid = $media_new->id();
			// if new media is created then it should be firstly added into media vault.
			//get media_voult_id and append new media item.
			$database = \Drupal::database();
			$media_vault_id = $database->select('node_field_data', 'n')->fields('n', ['nid'])->condition('n.uid', $media->getOwnerId(), '=')->condition('n.type', 'media_vault', '=')->orderBy('n.nid', 'desc')->range(0, 1)->execute()->fetchField();
			$voult = Node::load($media_vault_id);
			$voult->get('field_vault_photo')->appendItem(['target_id' => $mid, ]);
			$voult->save();
			$message = 'The image asset record has been successfully saved and added to your Media Vault and selected Media Kits.';
		}
			
		// add media to media kit 
		foreach($media_kits as $kit){
			$r_media_kit = \Drupal::database()->select('node_field_data', 'n')->fields('n', ['nid'])->condition('n.uid',$media->getOwnerId(), '=')->condition('n.nid', $kit, '=')
									->condition('n.type', 'media_kit', '=')->execute()->fetchAssoc();
			if ($r_media_kit) {
				 $r_kit = Node::load($kit);
				 if(!$this->whatever($r_kit->get('field_vault_photo')->getValue(), 'target_id', $mid)){
						 $r_kit->get('field_vault_photo')->appendItem(['target_id' => $mid, ]);
						 $r_kit->save();
					}
			}
		}
		$message = drupal_set_message($message, 'status');
		return new JsonResponse($get_updated_media);
	}
    // create/update video media type 
    public function createVideoMedia(object $media, array $mediaData, $owner){
        $tagsTextArray = isset($mediaData['tags']) ? $mediaData['tags'] : '';
        $get_tags = [];
		if (is_array($tagsTextArray) ){
			foreach($tagsTextArray as $termText){
			 $get_tags[] =  $this->getTagsTermId(trim($termText), $owner);
			}
		}
        $media->set('name',  $mediaData['title']);
        $media->set('field_description_plain_text', $mediaData['description']);
        $media->set('field_copyright_number', $mediaData['copyRights']);
        $media->set('field_favorite', $mediaData['favourite']);
        $media->set('field_archived', $mediaData['archived']);
        $media->set('field_keywords', $get_tags);
        if( $mediaData['genre']['value']!= -1 ){
            $media->set('field_genre', $mediaData['genre']['value']);
        }else{
           $media->set('field_genre', '');
        }
		if(isset($mediaData['availTumbsListSelected']) && count($mediaData['availTumbsListSelected'])){
		   $media->set('field_video_thumbnail', $mediaData['availTumbsListSelected']);	
		}
		else{
			if(isset($mediaData['uploaded_thumb'])){
			  if($mediaData['uploaded_thumb']['src'] != ''){
			    $uploaded_thumb = $this->base64toImage($mediaData['uploaded_thumb']['src'],$mediaData['uploaded_thumb']['name']);
			    $media->set('field_video_thumbnail', $uploaded_thumb);  
			  }	else{
				/* if($media->thumbnail->target_id){
					$media->set('field_video_thumbnail', $media->thumbnail->target_id); 
				 } */
				 unset($media->field_video_thumbnail);
			  }
			}
			else{
			  $media->set('field_video_thumbnail', $mediaData['thumbalready']);	
			}
		}
        if($mediaData['transcode'] == 1){
			$media->set('field_made_from_preset', $mediaData['preset']);  
			$term_name = \Drupal\taxonomy\Entity\Term::load($mediaData['preset'])->get('name')->value;
		    if($term_name == 'Uploaded file'){
				$media->set('field_media_source_type', 'Upload Modified');
			}
			else{
			  $media->set('field_media_source_type', 'generated');	
			}
			$media->set('field_render_status', 'Pending');
		}
        $media->uid = $owner;  
        $media->save();
	   \Drupal::logger('Video Asset Editor')->notice('<pre><code>' . print_r('Media updated with text data if any.', true) . '</code></pre>');
        return $media->id(); 
    }
    //alter video such as crop, scale, duration, bg and offset
    public function alterVideo(array $videoExported){
         $duration = gmdate("H:i:s", $videoExported['videoDuration']['duration']);
         $startTime = gmdate("H:i:s", $videoExported['videoDuration']['starting']);
         $rotation = deg2rad($videoExported['rotation']);
         $bg2 = $videoExported['bg-color'];
		 $colorCode = explode("#",$bg2);
		 $bg = $colorCode[1]; 
         $dim = explode("X",$videoExported['preset_dimensions']);
         $width = $dim['0'] ;
         $height = $dim['1'] ;
		 $pad = ' ';
		 $scale = ' ' ;
		 $crop = ' ';
		if($videoExported['original_vdo_width'] > $width || $videoExported['original_vdo_height'] > $height){
			if($videoExported['original_vdo_width'] > $width){
			  $scale = $width*$videoExported['curruntZoom']. ':-1';
			  $heightUpdate = ($videoExported['original_vdo_height']*$width*$videoExported['curruntZoom'])/ $videoExported['original_vdo_width'];
			  $correctHeighttoCrop = ( $heightUpdate > $videoExported['relative_vdo_height']*$videoExported['curruntZoom']*$videoExported['previewScale'] ) ? $videoExported['relative_vdo_height']*$videoExported['curruntZoom']*$videoExported['previewScale'] : $heightUpdate;			  
			  $yCrop = 0; 
			  $x = 0;
			  $y = (int)abs($videoExported['offset']['yPos']*$videoExported['previewScale']);
			  $crop = $width.':'.(int)abs($correctHeighttoCrop).':'.(int)abs($videoExported['offset']['xPos']*$videoExported['previewScale']).':'.$yCrop;
              //$pad='width='.$width.':height='.$height.':x='.$x.':y='.$y.':color='.$bg;
			  $pad = $width.':'.$height.':'.$x.':'.$y.':'.$bg;			  
			}
			else{
			  $scale = '-1:'.$height*$videoExported['curruntZoom'];
			   $widthUpdate = ($videoExported['relative_vdo_width']*$height*$videoExported['curruntZoom'])/ $videoExported['original_vdo_height'];
			   $correctWidthtoCrop = ( $widthUpdate > $videoExported['relative_vdo_width']*$videoExported['curruntZoom']*$videoExported['previewScale'] ) ?$videoExported['relative_vdo_width']*$videoExported['curruntZoom']*$videoExported['previewScale'] : $widthUpdate;
              $xCrop = 0; 
			  $x = (int)abs($videoExported['offset']['xPos']*$videoExported['previewScale']);;
			  $y = 0;
			  $crop = (int)abs($correctWidthtoCrop).':'.$height.':'.$xCrop .':'.(int)abs($videoExported['offset']['yPos']*$videoExported['previewScale']);
             // $pad='width='.$width.':height='.$height.':x='.$x.':y='.$y.':color='.$bg;
			  $pad = $width.':'.$height.':'.$x.':'.$y.':'.$bg;			  
			}
		 }
		 else{
		
         $scale = $videoExported['original_vdo_width']*$videoExported['curruntZoom'].':-1'; 
         if ((int)$videoExported['offset']['xPos'] <= 0 && (int)$videoExported['offset']['yPos'] <= 0 ) {
            $x = 0; 
            $y = 0; 
            $crop = $width.':'.$height.':'.(int)abs($videoExported['offset']['xPos']*$videoExported['previewScale']).':'.(int)abs($videoExported['offset']['yPos']*$videoExported['previewScale']);
           // $pad='width='.$width.':height='.$height.':x='.$x.':y='.$y.':color='.$bg;
         } 
         elseif((int)$videoExported['offset']['xPos'] > 0 && (int)$videoExported['offset']['yPos'] > 0 ){
             $x = (int)abs($videoExported['offset']['xPos']*$videoExported['previewScale']);
             $y = (int)abs($videoExported['offset']['yPos']*$videoExported['previewScale']);
             //$pad='width='.$width.':height='.$height.':x='.$x.':y='.$y.':color='.$bg;
            // $crop = $width.':'.$height.':0:0';
			$pad = $width.':'.$height.':'.$x.':'.$y.':'.$bg;
         } 
         elseif((int)$videoExported['offset']['xPos'] > 0 && (int)$videoExported['offset']['yPos'] <= 0){
             $x = (int)$videoExported['offset']['xPos']*$videoExported['previewScale'];
             $y = 0;
            // $pad='width='.$width.':height='.$height.':x='.$x.':y='.$y.':color='.$bg;
             $pad= $width.':'.$height.':'.$x.':'.$y.':'.$bg; 			 
             if($width > $videoExported['original_vdo_width']*$videoExported['curruntZoom'] && $height > $videoExported['original_vdo_height']*$videoExported['curruntZoom']  ){
               $crop = $videoExported['original_vdo_width']*$videoExported['curruntZoom'].':'.$videoExported['original_vdo_height']*$videoExported['curruntZoom'].':0:'.(int)abs($videoExported['offset']['yPos']*$videoExported['previewScale']);             
             }elseif ($width < $videoExported['original_vdo_width']*$videoExported['curruntZoom'] && $height < $videoExported['original_vdo_height']*$videoExported['curruntZoom'] ){
              $crop = $width.':'.$height.':0:'.(int)abs($videoExported['offset']['yPos']*$videoExported['previewScale']); 
             } 
             elseif ($width < $videoExported['original_vdo_width']*$videoExported['curruntZoom'] && $height > $videoExported['original_vdo_height']*$videoExported['curruntZoom'] ){
              $crop = $width.':'.$videoExported['original_vdo_height']*$videoExported['curruntZoom'].':0:'.(int)abs($videoExported['offset']['yPos']*$videoExported['previewScale']); 
             } 
            elseif ($width > $videoExported['original_vdo_width']*$videoExported['curruntZoom'] && $height < $videoExported['original_vdo_height']*$videoExported['curruntZoom'] ){
              $crop = $videoExported['original_vdo_width']*$videoExported['curruntZoom'].':'.$height.':0:'.(int)abs($videoExported['offset']['yPos']*$videoExported['previewScale']); 
             }              
         } 
         elseif((int)$videoExported['offset']['xPos'] <= 0 && (int)$videoExported['offset']['yPos'] > 0){
           $x = 0;
           $y = (int)$videoExported['offset']['yPos']*$videoExported['previewScale'];
          // $pad='width='.$width.':height='.$height.':x='.$x.':y='.$y.':color='.$bg;
		   $pad = $width.':'.$height.':'.$x.':'.$y.':'.$bg;
             if($width > $videoExported['original_vdo_width']*$videoExported['curruntZoom'] && $height > $videoExported['original_vdo_height']*$videoExported['curruntZoom']  ){
              $crop = $videoExported['original_vdo_width']*$videoExported['curruntZoom'].':'.$videoExported['original_vdo_height']*$videoExported['curruntZoom'].':'.(int)abs($videoExported['offset']['xPos']*$videoExported['previewScale']).':0';   
             }elseif ($width < $videoExported['original_vdo_width']*$videoExported['curruntZoom'] && $height < $videoExported['original_vdo_height']*$videoExported['curruntZoom'] ){
              $crop = $width.':'.$height.':'.(int)abs($videoExported['offset']['xPos']*$videoExported['previewScale']).':0'; 
             } 
             elseif ($width < $videoExported['original_vdo_width']*$videoExported['curruntZoom'] && $height > $videoExported['original_vdo_height']*$videoExported['curruntZoom'] ){
            //  $crop = $width.':'.$videoExported['original_vdo_height']*$videoExported['curruntZoom'].':0:'.abs($videoExported['offset']['yPos']*$videoExported['previewScale']); 
               $crop = $width.':'.$videoExported['original_vdo_height']*$videoExported['curruntZoom'].':'.(int)abs($videoExported['offset']['xPos']*$videoExported['previewScale']).':0'; 
             } 
            elseif ($width > $videoExported['original_vdo_width']*$videoExported['curruntZoom'] && $height < $videoExported['original_vdo_height']*$videoExported['curruntZoom'] ){
            //  $crop = .$videoExported['original_vdo_width']*$videoExported['curruntZoom'].':'.$height.':0:'.abs($videoExported['offset']['yPos']*$videoExported['previewScale']); 
               $crop = $videoExported['original_vdo_width']*$videoExported['curruntZoom'].':'.$height.':'.(int)abs($videoExported['offset']['xPos']*$videoExported['previewScale']).':0'; 
             }            
         }   
		 }		 

		if ($videoExported['original_fid']) {
		   $file = File::load($videoExported['original_fid']);
		   $file_extension = pathinfo($file->getFilename(), PATHINFO_EXTENSION);
		   $output_file = substr(sha1(time()), 0, 11).'.'.$file_extension;
		   $file_key = str_replace("private://","s3fs_private/",$file->getFileUri());
           $unique_key = substr(sha1(time()), 0, 16);
			
			$client = \Drupal::httpClient();
		    $site_config = \Drupal::config('system.site');
	        $server_name = strtolower($site_config->get('site_server_name'));
            if($server_name == 'dev'){
			$url = 'https://0gamssx0a0.execute-api.us-west-2.amazonaws.com/dev/video/background?pad='.$pad.'&scale='.$scale.'&crop='.$crop.'&start='.$startTime.'&end='.$duration.'&key='.$file_key.'&unique_key='.$unique_key.'&output_video='.$output_file;
			}
			elseif($server_name == 'staging'){
			 $url = 'https://wwom7ntocg.execute-api.us-west-2.amazonaws.com/dev/video/event?pad='.$pad.'&scale='.$scale.'&crop='.$crop.'&start='.$startTime.'&end='.$duration.'&key='.$file_key.'&unique_key='.$unique_key.'&output_video='.$output_file;	
			}
			else{
			  $url = 'https://mzopiogtz2.execute-api.us-west-2.amazonaws.com/dev/video/event?pad='.$pad.'&scale='.$scale.'&crop='.$crop.'&start='.$startTime.'&end='.$duration.'&key='.$file_key.'&unique_key='.$unique_key.'&output_video='.$output_file;	
			}
			 $request = $client->get($url);
			 $response =  (string)$request->getBody();
			 $data = json_decode($response);
			  //ksm($data->unique_key);
			  // need to entry on db 
			  \Drupal::logger('ffmpeg url update')->notice('<pre><code>' . print_r($url, true) . '</code></pre>');
			 if(is_object($data)){
				 \Drupal::database()->insert('ffmpeg_queue')
				 ->fields(array(
				  'mid' => $videoExported['new_media'],
				  'uid' => $videoExported['new_media_owner'],
				  'preset' =>$videoExported['preset'] ,
				  'status' => 0 ,
				  'unique_id' => $data->unique_key,
				  //'file_name' => 'file_name',
				 ))
				  ->execute(); 
			 } 

		}

    }
	public function getTrascoderThumbnails($thumbnailPattern, $vdoDuration){
		$thumbnailsAvail = [];
        $as = explode("-",$thumbnailPattern);
		$i = 1;
		while($i <= 10) {
			$output_file = $as['0'].'-0000'.$i.'.jpg';
			$thumbObject = $this->saveTranscodedFile($output_file, $output_file);
			if(is_object($thumbObject)){
			  $thumbnailsAvail[] = $thumbObject->id();
			}
			else{
             break;
			}
		    $i++;
		}
		\Drupal::logger('transcoder')->notice('<pre><code>' . print_r('Thumbs generated successfully', true) . '</code></pre>');
        return $thumbnailsAvail ;
	}
    public function saveTranscodedFile($output_file, $recommend_file){
          $config = \Drupal::config('s3fs.settings')->get();
          $s3 = s3fsService::getAmazonS3Client($config);
          $key = 'output/'.$output_file;
          $command = $s3->getCommand('GetObject', array(
             'Bucket' => $config['bucket'],
             'Key'    => $key,  
             'ResponseContentDisposition' => 'attachment; filename="'.$key.'"'
          ));

         $response = $s3->createPresignedRequest($command, '+10 minutes');
         $presignedUrl = (string)$response->getUri();
         $fileContent = file_get_contents($presignedUrl);
		 if ($fileContent){
			$directory = "public://";
			$destination = $directory . $output_file;
			\Drupal::service('file_system')->prepareDirectory($directory, \Drupal\Core\File\FileSystemInterface::CREATE_DIRECTORY);
			try {
				$file = file_save_data($fileContent, $destination, FILE_EXISTS_RENAME);
                \Drupal::logger('transcoder')->notice('done<pre><code>' . print_r('output files saved on aws', true) . '</code></pre>');
                return $file;
                }
            catch(Exception $e) {
				echo 'Message: ' . $e->getMessage();
			}
         }
    }
    public function sendToTranscoder($url, $presetId, $output_file_name, $file_extension){
        $config = \Drupal::config('aetl.settings')->get(); 
        $uri = str_replace('public://', 's3fs_public/', $url);
        //$keyo = $output_file_name;
		$keyo = substr(sha1(time()), 0, 11).'.'.$file_extension;
		$thumb = substr(sha1(time()), 0, 11).'-{count}';
        $data = [];
	    $site_config = \Drupal::config('system.site');
	    $server_name = strtolower($site_config->get('site_server_name'));
        if($server_name == 'dev'){
		 $pipelineid = '1567626010446-2azpus';
        } else if($server_name == 'staging'){
            $pipelineid = '1618841425855-v85k3e';		
        } else {
            $pipelineid = '1566617956798-8w6no9';
        }
        $data['pipelineid'] = $pipelineid;
        $data['outputkeyprefix'] = 'output/';
        $data['inputdetails'] = $uri;
        $data['output_details'][0]['preset'] = $presetId;
        $data['output_details'][0]['key'] = $keyo;
        $data['output_details'][0]['ThumbnailPattern'] = $thumb;
		//$data['output_details'][0]['SegmentDuration'] = "[1,30]";
        $etd = \Drupal::service('aetl')->trancodeCreateJob($data);
		\Drupal::logger('transcoder')->notice('<pre><code>' . print_r('input files ready to transcode.', true) . '</code></pre>');
        return $etd->toArray();
    }   
    // update video media
    public function updateVideoMedia(Media $media){
        $completeVideoData = \Drupal::request()->get('completeVideoData');
        $completeVideoData['formTextData']['preset'] = $completeVideoData['exportedData']['preset'];
        $exportedVideo = $completeVideoData['exportedData'];
		$exportedVideo['file_name'] = $completeVideoData['formTextData']['fileName']; 
        $formData = $completeVideoData['formTextData'];
		$formData['transcode'] = $completeVideoData['transcode'];
         \Drupal::logger('update video media 1')->debug('<pre><code>' . print_r($completeVideoData, TRUE) . '</code></pre>');
        if(is_object($media)){
            $owner = $media->getOwnerId();
			\Drupal::logger('debug video 1')->debug('<pre><code>' . print_r($owner, TRUE) . '</code></pre>');
            if($completeVideoData['type'] == 'self' ){
               $media_id = $this->createVideoMedia($media, $formData, $owner);
			   \Drupal::logger('debug video 2')->debug('<pre><code>' . print_r($media_id, TRUE) . '</code></pre>');
               if($media_id ){
                 // user can remove media from kit, if and only if the media already exist. If media is assigned to any media kit, by default 
			    //every media is linked with media vault and "Default media kit". User should not allowed to remove media from "Default media kit"
				if(isset($formData['remove_mkits'])){
                if (is_array($formData['remove_mkits']) ){
                    foreach($formData['remove_mkits'] as $kit){
                        $r_media_kit = \Drupal::database()->select('node_field_data', 'n')->fields('n', ['nid'])->condition('n.uid', $owner , '=')->condition('n.nid', $kit,'=')
                                                    ->condition('n.type', 'media_kit', '=')->execute()->fetchAssoc();
                        if ($r_media_kit) {
                            $r_kit = Node::load($kit);
                            $items = $r_kit->get('field_vault_video')->getValue();
                            foreach($items as $key =>$value){
                                if($value['target_id'] == $media_id){
                                    $r_kit->get('field_vault_video')->removeItem($key);
                                    $r_kit->save();
                                }
                            }
                        }
                  }
                }
				}
				if($completeVideoData['transcode'] == 1){
				   $exportedVideo['new_media'] = $media_id;  
                   $exportedVideo['new_media_owner'] = $owner;                    
                   $file_object = $this->alterVideo($exportedVideo); 
				   // \Drupal::logger('Video Asset Editor')->notice('<pre><code>' . print_r('Exported video data sent to alter the video.', true) . '</code></pre>');
			       /*if($file_object){
				    $this->updateVideoFileToMedia($file_object, $media, $owner);   
			       }*/
                   $message = 'The video asset record has been successfully saved.';				   
				}
				else{
				  $message = 'Your video was untouched but your video record has been successfully saved to reflect your changes.';	
				}				
			  
              drupal_set_message($message, 'status');
              }
          }
            else{
                //create new media
                $media_new = Media::create(['bundle' => 'video']); 
                $media_id = $this->createVideoMedia($media_new, $formData, $owner);
				\Drupal::logger('debug video 3')->debug('<pre><code>' . print_r($media_id, TRUE) . '</code></pre>');
                if($media_id){
                    // if new media is created then it should be firstly added into media vault.
                    //get media_voult_id and append new media item.
                    $database = \Drupal::database();
                    $media_vault_id = $database->select('node_field_data', 'n')->fields('n', ['nid'])->condition('n.uid', $owner, '=')->condition('n.type', 'media_vault', '=')->orderBy('n.nid', 'desc')->range(0, 1)->execute()->fetchField();
                    $voult = Node::load($media_vault_id);
                    $voult->get('field_vault_video')->appendItem(['target_id' => $media_id, ]);
                    $voult->save(); 
                   $exportedVideo['new_media'] = $media_id;  
                   $exportedVideo['new_media_owner'] = $owner;			   
                   $file_object = $this->alterVideo($exportedVideo);
				   /*if($file_object){
					   $this->updateVideoFileToMedia($file_object, $media_new, $owner);
				   }*/
				   $message = 'Your video has been added to your Media Vault and selected Media Kits. We will notify you when the transcoding has been completed after which you will be able to view it.';
                   drupal_set_message($message, 'status');
                }
            } 
           	// add media to media kit 
            foreach($formData['mkits'] as $kit){
                $r_media_kit = \Drupal::database()->select('node_field_data', 'n')->fields('n', ['nid'])->condition('n.uid',$owner, '=')->condition('n.nid', $kit, '=')
                                        ->condition('n.type', 'media_kit', '=')->execute()->fetchAssoc();
                if ($r_media_kit) {
                     $r_kit = Node::load($kit);
                     if(!$this->whatever($r_kit->get('field_vault_video')->getValue(), 'target_id', $media_id)){
                             $r_kit->get('field_vault_video')->appendItem(['target_id' => $media_id, ]);
                             $r_kit->save();
                        }
                }
            }        
        }
        

        return new JsonResponse($completeVideoData);
    }
	
	/**
	 * @return boolean
	 */
	public function whatever($array, $key, $val) {
		foreach ($array as $item)
			if (isset($item[$key]) && $item[$key] == $val)
				return true;
				return false;
	}
    
  /**
	 * crop/resize newimage from  old image
	 */
  public function modifiedImage($filename, $preset, $mid, array $imageProperties, $resize_dim){
	    $advanced_access = \Drupal::request()->get('advanced_access');
		if( $preset != -1 ){
			$terms_obj = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($preset);
			$color_space = $terms_obj->field_color_space->value;
		} else {
		  $color_space = '';
		}
		$bgColor = $imageProperties["bgColor"]; 
		$exportZoom = $imageProperties["exportZoom"]; 					 
	  // resize image dimensions
		$resizedArray = explode(" x ", $resize_dim);
		$width = (int)$resizedArray[0];
		$height = (int)$resizedArray[1] ;
		$dimensions = $width.'x'.$height;
		$scale = ($imageProperties['currentZoom']*100).'%';
		$rotate = $imageProperties['rotation'];
		$data_fid = $imageProperties['data_fid'];
		$data_original = (int)$imageProperties['data_original'];
		//adjust tab parameter, need to convert IM parameters
		//$brightness_contrast = $imageProperties['adjust']['brightness'].'x'.$imageProperties['adjust']['contrast'];
		//hue, saturation, and lightness.Lightness always no changed (HSL)
		//$update_saturation = 100+($imageProperties['adjust']['saturation']);
		//$hue_value = $imageProperties['adjust']['hue'];
		//$hue_angle = (360*$hue_value)/100 ;
		//$update_hue = ( $hue_angle * 100/180 ) + 100; 
		//$modulate = "100,".$update_saturation.",".$update_hue;
		//$blur = '0x'.$imageProperties['adjust']['blur'];
		// $radius = $imageProperties['adjust']['blur'];
		// $sigma  = $radius/2;
		 //$sigma = 0;
		// $blur = $radius.'x'.$sigma;
		 //$blur = $radius.'x'.$radius;
		// $blur = $radius.'x0';
		 //sharpen
		 //$radius2 = $imageProperties['adjust']['sharpen'];
		 //$sigma2  = $radius2/3;
		 //$sigma2 = 0;
		// $sharpen = $radius2.'x'.$sigma2;
		//$sharpen = '0x'.$sigma2;
		$generate_recommended_file_name_data = 'temporary://' . $filename;
		$generate_recommended_file_name = \Drupal::service('file_system')->realpath($generate_recommended_file_name_data);
		//get original file realpath. that will be modified
		$media = \Drupal::entityTypeManager()->getStorage('media')->load($mid);
		if (is_object($media)) {
			if ($media->hasField('field_media_image')) {
				//$uri = $media->field_media_image->entity->getFileUri();
				// updated fid, since image is updated via caman.
				//$targetid = $media->field_media_image->target_id;
				$file = File::load($data_fid);
				$file_path =  drupal_tempnam('temporary://', 'media_'); 
				if (file_copy($file, $file_path, FILE_EXISTS_REPLACE)) {
					$img_file = drupal_realpath($file_path);
					if($data_original == 0){
						file_delete($data_fid);
					}
					
				}
			}
		}
			
		if ($imageProperties["offset"]["x"] <= 0 && $imageProperties["offset"]["y"] <= 0 ) {
			//if offset is nagative, then it means larger image need to shrink. Copped operation need to perform
			$offset_x_cropped = abs($imageProperties["offset"]["x"]*$exportZoom);
			$offset_y_cropped = abs($imageProperties["offset"]["y"]*$exportZoom);
			$cropped = $dimensions.'+'.$offset_x_cropped.'+'.$offset_y_cropped;
			// $cmd = "convert $img_file -rotate $rotate -scale $scale -crop $cropped +repage $generate_recommended_file_name";
			/*if($advanced_access){
			  $cmd = "convert -size $dimensions xc:$bgColor \( $img_file -rotate $rotate -scale $scale -crop $cropped -brightness-contrast $brightness_contrast -modulate $modulate +repage \) -blur $blur -sharpen $sharpen -geometry +0+0 -composite $generate_recommended_file_name";	
			} */
			//else{
				$cmd = "convert -size $dimensions xc:$bgColor \( $img_file -rotate $rotate -scale $scale -crop $cropped +repage \) -geometry +0+0 -composite $generate_recommended_file_name";
			//}
			
             			
		} else {
			//. If one offset is negative another is Possitive or both positive 
			$page = '100x100'.sprintf("%+f",$imageProperties["offset"]["x"]*$exportZoom).sprintf("%+f",$imageProperties["offset"]["y"]*$exportZoom);
			$geometry = sprintf("%+f",$imageProperties["offset"]["x"]*$exportZoom).sprintf("%+f",$imageProperties["offset"]["y"]*$exportZoom);
			/*if($advanced_access){
				$cmd = "convert -size $dimensions xc:$bgColor  \( $img_file -rotate $rotate -scale $scale -brightness-contrast $brightness_contrast -modulate $modulate +repage \) -blur $blur -sharpen $sharpen -geometry $geometry -composite $generate_recommended_file_name";
			} */
			//else{
			   $cmd = "convert -size $dimensions xc:$bgColor  \( $img_file -rotate $rotate -scale $scale +repage \) -geometry $geometry -composite $generate_recommended_file_name";	
			//}
		}
		//\Drupal::logger('imagic command')->notice('<pre><code>' . print_r($cmd, true) . '</code></pre>');
		$executed_commond = exec($cmd, $op);
		sleep(5);
		$fileContent = file_get_contents($generate_recommended_file_name);
		//remove temporary file
		unlink($file_path);
		unlink($generate_recommended_file_name);
		if ($fileContent){
			$directory = "public://";
			$destination = $directory . $filename;
			\Drupal::service('file_system')->prepareDirectory($directory, \Drupal\Core\File\FileSystemInterface::CREATE_DIRECTORY);
			try {
				$file = file_save_data($fileContent, $destination, FILE_EXISTS_RENAME);
				return $file;
			}
			catch(Exception $e) {
				echo 'Message: ' . $e->getMessage();
			}
		} else {
			return 0;
		}
	}

	/**
	 * change file name and appended next iteration as suffix.
	 */
	public function updateFileName($file_name, $preset_type = 'jpg'){
		$explode_file_name = explode(".",$file_name);
		if(count($explode_file_name) >= 2){
		  // verify if extension added in filename
		  if(strtolower(end($explode_file_name)) == 'jpg' || strtolower(end($explode_file_name)) == 'png'   ){
				// verify if suffix already added 01,02,etc
				array_pop($explode_file_name);
				$filename_without_ext_Array = explode('_',implode(".",$explode_file_name));
				 
				if(is_numeric(end($filename_without_ext_Array))){
					$next_iteration = sprintf("%02d", end($filename_without_ext_Array) +1);
					// $file_name = str_replace(end($filename_without_ext_Array), $next_iteration , implode(".",$explode_file_name)).'.'.$preset_type;;
					$file_name = $this->str_lreplace(end($filename_without_ext_Array), $next_iteration, implode(".",$explode_file_name)).'.'.$preset_type;;
				} else {
					$file_name = implode(".",$explode_file_name).'_01'.'.'.$preset_type;
				}

				return $file_name;
		  }
		}
  }

	/**
	 * replace last accurance of string.
	 */
	public function str_lreplace($search, $replace, $subject){
		$pos = strrpos($subject, $search);
		if($pos !== false){
			$subject = substr_replace($subject, $replace, $pos, strlen($search));
		}
		return $subject;
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
		  $real_text = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', $name]; //$file->getFilename()
		  \Drupal::service('notification_system.notification_controller')->addNotification('Video Ready', $real_text, $owner);
		 \Drupal::logger('video Asset Editor')->notice('<pre><code>' . print_r('Media updated with FFMPEG and transcoded file. Ready to send notification,', true) . '</code></pre>');
		  return 1;
		}		
	}
    // ffmpeg webhook
	public function ffmpegWebhookNotifications(Request $request){
	   $decoder = new JsonDecode(TRUE);
       $data = $decoder->decode($request->getContent(), JsonEncoder::FORMAT);
       \Drupal::logger('ffmpeg')->notice('<pre><code>' . print_r($data , TRUE) . '</code></pre>');
        $sign_url = $data['responsePayload']['sign_url'];
        $unique_key = $data['responsePayload']['unique_key'];
		$file_name = $data['responsePayload']['name'];
		$fileContent = file_get_contents($sign_url);
		$ext = pathinfo($data['responsePayload']['key'], PATHINFO_EXTENSION);
		//\Drupal::logger('ffmpeg')->notice('signurl<pre><code>' . print_r($sign_url, true) . '</code></pre>');
        $query = \Drupal::database()->select('ffmpeg_queue', 'fq');
        sleep(20);
        $result = $query->fields('fq', array('mid','uid','preset'))->condition('fq.unique_id', $unique_key)->execute()->fetchAll();
        if (!empty($result)) {
			/*\Drupal::logger('ffmpeg')->notice(' web<pre><code>' . print_r($result[0]->mid, true) . '</code></pre>'); */
		$get_mid = $result[0]->mid;
		$get_uid = $result[0]->uid;
		$get_preset = $result[0]->preset;
		
		if ($fileContent){
			\Drupal::logger('ffmpeg')->notice(' web<pre><code>' . print_r('if', true) . '</code></pre>'); 
			$directory = "public://";
			$destination = $directory . 'xyz_temp.'.$ext;
			\Drupal::service('file_system')->prepareDirectory($directory, \Drupal\Core\File\FileSystemInterface::CREATE_DIRECTORY);
			try {
				$file = file_save_data($fileContent, $destination, FILE_EXISTS_RENAME);
				//\Drupal::logger('ffmpeg')->notice(' web fiel<pre><code>' . print_r($file->id(), true) . '</code></pre>'); 
                 $term = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($get_preset);
                if (is_object($term) && $term->vid->target_id == 'image_preset'){
                   if($term->field_elastic_transcoder_preset->value){
                     $etd = $this->sendToTranscoder($file->getFileUri(), $term->field_elastic_transcoder_preset->value, $videoExported['file_name'], $ext ); 
                     $getJobId = $etd['Job']['Id'];
                     \Drupal::database()->insert('transcoding_jobs_data')
                     ->fields(array(
                      'type' => 'media-video',
                      'mid' => $get_mid ,
                      'uid' => $get_uid,
                      'target_id' => 1,
                      'preset_id' => $etd['Job']['Output']['PresetId'],
                      'thumbnail_pattern' => $etd['Job']['Output']['ThumbnailPattern'],
                      'status' => $etd['Job']['Output']['Status'],
                      'jobs_id' => $etd['Job']['Id'],
                      'submittimemillis' => $etd['Job']['Timing']['SubmitTimeMillis']))
                      ->execute();
					 // return 0;
					 // transcoder webhook call
                   }
				   else{
					   //preset not available, don,t need to call webkook transcoder
					   //update file into media
					   \Drupal::logger('ffmpeg')->notice(' web fiel 2 <pre><code>' . print_r('dfd', true) . '</code></pre>'); 
					   $media = Media::load($get_mid);
					   $this->updateVideoFileToMedia($file, $media, $get_uid);
				   }
                }
               
			}
			catch(Exception $e) {
				echo 'Message: ' . $e->getMessage();
			}
		}else{
			\Drupal::logger('ffmpeg')->notice(' web<pre><code>' . print_r('else', true) . '</code></pre>'); 
		}
		 }		


        return new Response(NULL, Response::HTTP_OK);	   
	}
  
  //aws webhook notifications
  public function awsWebhookNotifications(Request $request){
    $decoder = new JsonDecode(TRUE);
    $data = $decoder->decode($request->getContent(), JsonEncoder::FORMAT);
    $output_data = json_decode($data['Message'], true);
    
    \Drupal::logger('WebhookNotifications:data')->debug('<pre><code>' . print_r($data, TRUE) . '</code></pre>');
    \Drupal::logger('WebhookNotifications:content')->debug('<pre><code>' . print_r($output_data, TRUE) . '</code></pre>');
    
    $jobID = $output_data['jobId'];
    $transcoded_fileName = $output_data['outputs'][0]['key'];
    $recommend_file = $output_data['input']['key'];
    $b = explode("/",$recommend_file);
    $thumbnailPattern = $output_data['outputs'][0]['thumbnailPattern'];
    \Drupal::logger('aws notification 1')->debug('<pre><code> thumb' . print_r($thumbnailPattern , TRUE) . '</code></pre>');
    sleep(20);
    
    // get job to update something into the system
    $query = \Drupal::database()->select('transcoding_jobs_data', 'jt');
    $result = $query->fields('jt', array('mid','uid', 'type'))->condition('jt.jobs_id', $jobID)->execute()->fetchObject();
    
    $type   = $result->type;
    switch($type){
      case 'media-video':
        $mid    = $result->mid;
        $owner  = $result->uid;
        try {
          $config = \Drupal::config('aetl.settings')->get();
          $transcoder_client = \Drupal::service('aetl')->getAmazonETClient($config);
          $jobdetails = $transcoder_client->readJob(array(
          'Id' => $jobID,
          ))->toArray();
          \Drupal::logger('aws notification 2')->debug('<pre><code>' . print_r($jobdetails, TRUE) . '</code></pre>');

          if($jobdetails['Job']['Status'] == 'Complete') {
            // return transcoded file 
            $file = $this->saveTranscodedFile($transcoded_fileName, str_replace(' ', '', $b['1']));
            // get transcoded thubnails
            $avail_thumb = $this->getTrascoderThumbnails($thumbnailPattern, 60);
            \Drupal::logger('aws notification 3')->debug('<pre><code>' . print_r($avail_thumb, TRUE) . '</code></pre>');
            $media = Media::load($mid);
            $this->updateVideoFileToMedia($file, $media, $owner, $avail_thumb);
          }
        }
        catch (AwsException $e) {
          //echo $e->getMessage() . "\n";
        }
      break;
      
      case 'video-maker':
        $vid = $result->mid;
        // save transcoded video
        \Drupal::service('video.making.process')->finishTranscode($vid);
      break;
      
      default:

    }
    return new Response(NULL, Response::HTTP_OK);
  }
  
   //aws webhook notifications
    public function awsWebhookNotificationsFail(Request $request){
        $decoder = new JsonDecode(TRUE);
        $data = $decoder->decode($request->getContent(), JsonEncoder::FORMAT);
       \Drupal::logger('aws notification')->debug('<pre><code>' . print_r($data, TRUE) . '</code></pre>');
        \Drupal::logger('aws notification')->debug('<pre><code>' . print_r($request->getContent(), TRUE) . '</code></pre>');
 
       return new Response(NULL, Response::HTTP_OK);
    }
    public function base64toImage($base64, $fileName){
	 $data = explode(',', $base64);
        $imageData = $data[1];
        $generate_recommended_file_name_data = 'temporary://temp_file.jpg';
        $generate_recommended_file_name = \Drupal::service('file_system')->realpath($generate_recommended_file_name_data);
        $bin = base64_decode($imageData);
        // Load GD resource from binary data
        $im = imageCreateFromString($bin);
        if (!$im) {
            die('Base64 value is not a valid image');
        }
        // Specify the location where you want to save the image
        $img_file = \Drupal::service('file_system')->realpath('temporary://' . rand() . '.png');
        imagepng($im, $img_file, 0);
        $cmd = "convert $img_file $generate_recommended_file_name";
        exec($cmd, $op);
        sleep(5);
        $fileContent = file_get_contents($generate_recommended_file_name);
        $directory = "public://";
        $destination = $directory .  $fileName;
        \Drupal::service('file_system')->prepareDirectory($directory, \Drupal\Core\File\FileSystemInterface::CREATE_DIRECTORY);
        $file = file_save_data($fileContent, $destination, FILE_EXISTS_RENAME);	
		return $file->id();
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
   * @return json array
   * 
   * https://www.jqueryscript.net/form/Tags-Input-Autocomplete.html
   */
  public function getPrivateTags(Request $request, $user){
	  $term = trim($request->query->get('term'));
	  $uid = $user->get('uid')->value;
    $query = \Drupal::database()->select('taxonomy_term_field_data', 'td');
		$query->leftJoin('user_term', 'ut', 'td.tid = ut.tid');
		//$query->leftJoin('users_field_data', 'u', 'ut.uid = u.uid');
    $query->fields('td', ['tid', 'name']);
    $query->condition('ut.uid', $uid, '=');
    $query->condition('td.vid', 'keywords', '=');
    $query->condition('td.name', "%$term%", 'like');
    $query->orderBy('td.name', 'ASC');
    $keywords = $query->execute()->fetchAll(); 
    $tags = [];
    foreach($keywords as $tag){
      $tags[$tag->tid] = $tag->name;  
    }
    
    return new JsonResponse($tags);
  }
   
	/**
	 * Get Tags term id
	 */
  public function getTagsTermId($tags, $owner){
		// check if tags already exist, else create tag first then get tid
		$query = \Drupal::database()->select('taxonomy_term_field_data', 'td');
		$query->leftJoin('user_term', 'ut', 'td.tid = ut.tid');
		$query->leftJoin('users_field_data', 'u', 'ut.uid = u.uid');
		$query->fields('td', ['tid', 'name']);
		$query->condition('ut.uid', $owner, '=');
		$query->condition('td.vid', 'keywords', '=');
		$query->condition('td.name', $tags , '=');
		
		$keywords = $query->execute()->fetchAll();
		if(empty($keywords)){
			$create_term = Term::create([
				'name' => $tags, 
				'vid' => 'keywords',
			]);
			$create_term->save();
			$tid = $create_term->id();
			$count = \Drupal::database()->select('user_term', 'user_term')
			->condition('tid', $tid)
			->countQuery()
			->execute()
			->fetchField();
			if ($count > 0) {
				\Drupal::database()->update('user_term')->fields(['uid'=>$owner])->condition('tid', $tid, '=')->execute();
			}              
			return $tid;           
		} 
		else{
			foreach($keywords as $tag){
				return $tag->tid;
			}
		}      
  }
  
  
  //aws webhook notifications
  public function debugTranscode(){
    // get job to update something into the system
    $query = \Drupal::database()->select('transcoding_jobs_data', 'jt');
    $result = $query->fields('jt', array('jobs_id', 'mid','uid', 'thumbnail_pattern'))
    ->condition('jt.type', 'media-video')
    ->condition('jt.status', 'Submitted')
    ->range(0, 1)
    ->execute()->fetchObject();
    
    $mid    = $result->mid;
    $owner  = $result->uid;
    $jobs_id = $result->jobs_id;
    $thumbnail_pattern = $result->thumbnail_pattern;
    try {
      $config = \Drupal::config('aetl.settings')->get();
      $transcoder_client = \Drupal::service('aetl')->getAmazonETClient($config);
      $jobdetails = $transcoder_client->readJob(array(
      'Id' => $jobs_id,
      ))->toArray();
      
      //\Drupal::logger('aws notification')->debug('<pre><code>' . print_r($jobdetails, TRUE) . '</code></pre>');
      echo '<pre>'; print_r($jobdetails); echo '</pre>';
      
      $transcoded_fileName = $jobdetails['Job']['Outputs'][0]['Key'];
      $recommend_file = $jobdetails['Job']['Input']['Key'];
      $rfile = explode("/",$recommend_file);
      
      echo  $transcoded_fileName.' | '.$recommend_file;
      
     

      if($jobdetails['Job']['Status'] == 'Complete') {
        // return transcoded file 
        $file = $this->saveTranscodedFile($transcoded_fileName, str_replace(' ', '', $rfile['1']));
        // get transcoded thubnails
        $avail_thumb = $this->getTrascoderThumbnails($thumbnail_pattern, 60);
        \Drupal::logger('aws notification')->debug('<pre><code>' . print_r($avail_thumb, TRUE) . '</code></pre>');
        $media = Media::load($mid);
        $this->updateVideoFileToMedia($file, $media, $owner, $avail_thumb);
		echo '<pre>'; print_r($media); echo '</pre>';
      }
	   
    }
    catch (AwsException $e) {
      //echo $e->getMessage() . "\n";
	  \Drupal::logger('debugTranscode')->debug('<pre><code>' . print_r($e->getMessage(), TRUE) . '</code></pre>');
    }
	//die('here');
    return new Response(NULL, Response::HTTP_OK);
  }
  
}
