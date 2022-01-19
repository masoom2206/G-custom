<?php
 
/**
* @file
* Contains \Drupal\media_vault_tool\Controller\MediaDetailController.php
*
*/
 
namespace Drupal\media_vault_tool\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\NodeInterface;
use Drupal\Core\Controller\ControllerBase;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Drupal\media\Entity\Media;
use Symfony\Component\HttpFoundation\Request;
use Drupal\onboarding\Controller\OnBoardingController;
use Drupal\file\Entity\File;
use Drupal\taxonomy\Entity\Term;

class MediaDetailController extends ControllerBase {
  /**
   * The current request.
   *
   * @var \Symfony\Component\HttpFoundation\Request $request
   *   The HTTP request object.
   */
  protected $request;
  
  /**
   * Returns a media vault detail page.
   *
   * @return array
   *   A simple renderable array.
   */
	public function render_media_detail_page(AccountInterface $user, int $media_archive){
		global $base_secure_url;
    global $base_url;
    $uid = $user->get('uid')->value;
		$roles = $user->getRoles();
    $render_data = array();
    $nids_media_list = array();
    $query = \Drupal::entityQuery('node')->condition('uid', $uid)->condition('type', 'media_vault');
    $nids = $query->execute();
    
		$current_path = \Drupal::service('path.current')->getPath();
		$args = explode('/',$current_path);
		$file_owner = '';

		if(is_numeric($args[4])){
			$file_owner = $args[4];
		}

		$default_vault = default_media_vault_by_user($file_owner);
		
		$default_kit = default_media_kit_by_user($file_owner);
		
		$user_custom_mkits = custom_media_kit_of_user($file_owner, $default_kit);
		$user_custom_mkit_count = count($user_custom_mkits);
		
    $query_media_kit = \Drupal::database()->select('node_field_data', 'n')
    ->fields('n', ['nid', 'title'])
    ->condition('n.uid', $uid, '=')
    ->condition('n.nid', $default_kit, '<>')
    ->condition('n.type', 'media_kit', '=');
    $nids_media_kit = $query_media_kit->execute()->fetchAll();
		
		
    foreach($nids as $node_id){
      $media_vault_id = $node_id;
      $media_form = 'Media Vault Form';
      $values = 'Media Vault data';
      $data = array('media_form' => $media_form, 'values' => $values);
			
			$render_data['theme_data']['#cache']['max-age'] = 0;
      $render_data['theme_data'] = array(
        '#theme' => 'media_vault_template',
        '#media_vault_title' => $this->t('Media Vault'),
        '#media_archive' => $media_archive,
				'#uid' => $uid,
        '#doubles' => $data,
				'#cache' => ['max-age' => 0],		
        '#attached' => [
          'library' =>  [
            'media_vault_tool/media.vault',
            'media_vault_tool/react.min',
            //'media_vault_tool/react',
            'media_vault_tool/react.dom.min',
            'media_vault_tool/axios',
            'media_vault_tool/media_pagination',
            'media_vault_tool/global',
          ],
        ],
      );
      $render_data['theme_data']['#attached']['drupalSettings']['media']['mediaJS']['media_vault_id'] = $media_vault_id;
      $render_data['theme_data']['#attached']['drupalSettings']['media']['mediaJS']['media_default_kit'] = $default_kit;
      $render_data['theme_data']['#attached']['drupalSettings']['nmk'] = $nids_media_kit;
      
      $render_data['theme_data']['#attached']['drupalSettings']['media_base_url_http'] = $base_url;
      $render_data['theme_data']['#attached']['drupalSettings']['media_base_url'] = $base_secure_url;
      $render_data['theme_data']['#attached']['drupalSettings']['media_archive'] = $media_archive;
      $render_data['theme_data']['#attached']['drupalSettings']['a'] = $uid;
      $render_data['theme_data']['#attached']['drupalSettings']['file_owner'] = $file_owner;
      $render_data['theme_data']['#attached']['drupalSettings']['default_vault'] = $default_vault;
      $render_data['theme_data']['#attached']['drupalSettings']['user_custom_mkit_count'] = $user_custom_mkit_count;
    }
    return $render_data;
	}
	
	/**
   * Returns a media vault uploader tool page.
   *
   * @return array
   *   A simple renderable array.
   */
	public function render_media_uploader_page(\Drupal\user\UserInterface $user, int $media_archive){
		global $base_secure_url;
    global $base_url;
    $uid = $user->get('uid')->value;
		$roles = $user->getRoles();
    $render_data = array();
    $query = \Drupal::entityQuery('node')->condition('uid', $uid)->condition('type', 'media_vault');
    $nids = $query->execute();
    
		$current_path = \Drupal::service('path.current')->getPath();
		$args = explode('/',$current_path);
		$file_owner = '';

		if(is_numeric($args[4])){
			$file_owner = $args[4];
		}
		
		//all files storage
		$onboarding = new OnBoardingController();
		$mv_audio_fids = $onboarding->get_all_fids('audio', $uid);
		$mv_image_fids = $onboarding->get_all_fids('image', $uid);
		$mv_text_fids = $onboarding->get_all_fids('text', $uid);
		$mv_video_fids = $onboarding->get_all_fids('video', $uid);
		
		$total_text_storage = $total_image_storage = $total_audio_storage = $total_video_storage = '';
		$allocated_storage_space_up = $available_space_up = '';
		
		foreach($mv_audio_fids as $af){
			$afile = File::load($af->field_media_audio_file_target_id);
			if($afile){
				$total_audio_storage += intval($afile->get('filesize')->getValue()[0]['value']);
			}
		}foreach($mv_image_fids as $pf){
			$pfile = File::load($pf->field_media_image_target_id);
			if($pfile){
				$total_image_storage += intval($pfile->get('filesize')->getValue()[0]['value']);
			}
		}foreach($mv_text_fids as $tf){
			$tfile = File::load($tf->field_media_file_target_id);
			if($tfile){
				$total_text_storage += intval($tfile->get('filesize')->getValue()[0]['value']);
			}
		}foreach($mv_video_fids as $vf){
			$vfile = File::load($vf->field_media_video_file_target_id);
			if($vfile){
				$total_video_storage += intval($vfile->get('filesize')->getValue()[0]['value']);
			}
		}
		$audio_storage = ($total_audio_storage == '') ? '-' : formatedFileSize($total_audio_storage, true);
		$image_storage = ($total_image_storage == '') ? '-' : formatedFileSize($total_image_storage, true);
		$text_storage = ($total_text_storage == '') ? '-' : formatedFileSize($total_text_storage, true);
		$video_storage = ($total_video_storage == '') ? '-' : formatedFileSize($total_video_storage, true);
		$total_mv_storage = $total_audio_storage + $total_image_storage + $total_text_storage + $total_video_storage;
		
		$total_storage = formatedFileSize($total_mv_storage, true);
		$total_storage = strtoupper($total_storage);
		
		$vid = 'role_features';
		$terms =\Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid);
		foreach ($terms as $term) {
			$term = Term::load($term->tid);
			if($term->field_drupal_role->value == 'content_creator' && in_array('content_creator', $roles)){
				$allocated_storage_space = $term->field_storage_limit->value;
				$allocated_storage_space_up = $allocated_storage_space.'.00 GB';
				$available_space = formatedFileSize(($term->field_storage_limit->value * 1073741824) - $total_mv_storage, true);  //1 GB = 1073741824
				$available_space_up = strtoupper($available_space);
			} else if($term->field_drupal_role->value == 'advanced_content_creator' && in_array('advanced_content_creator', $roles)){
				//$term = Term::load($term->tid);
				$allocated_storage_space = $term->field_storage_limit->value;
				$allocated_storage_space_up = $allocated_storage_space.'.00 GB';
				$available_space = formatedFileSize(($term->field_storage_limit->value * 1073741824) - $total_mv_storage, true);
				$available_space_up = strtoupper($available_space);
			} else if($term->field_drupal_role->value == 'designer' && in_array('designer', $roles)){
				//$term = Term::load($term->tid);
				$allocated_storage_space = $term->field_storage_limit->value;
				$allocated_storage_space_up = $allocated_storage_space.'.00 GB';
				$available_space = formatedFileSize(($term->field_storage_limit->value * 1073741824) - $total_mv_storage, true);
				$available_space_up = strtoupper($available_space);
			} else if($term->field_drupal_role->value == 'enterprise' && in_array('enterprise', $roles)){
				//$term = Term::load($term->tid);
				$allocated_storage_space = $term->field_storage_limit->value;
				$allocated_storage_space_up = $allocated_storage_space.'.00 GB';
				$available_space = formatedFileSize(($term->field_storage_limit->value * 1073741824) - $total_mv_storage, true);
				$available_space_up = strtoupper($available_space);
			} else if($term->field_drupal_role->value == 'administrator' && in_array('administrator', $roles)){
				//$term = Term::load($term->tid);
				$allocated_storage_space = $term->field_storage_limit->value;
				$allocated_storage_space_up = $allocated_storage_space.'.00 GB';
				$available_space = formatedFileSize(($term->field_storage_limit->value * 1073741824) - $total_mv_storage, true);
				$available_space_up = strtoupper($available_space);
			}
		}
		
		$audio_maxsize = $this->get_media_maxfilesize_setting('audio', 'field_media_audio_file');
		$image_maxsize = $this->get_media_maxfilesize_setting('image', 'field_media_image');
		$text_maxsize = $this->get_media_maxfilesize_setting('text', 'field_media_file');
		$video_maxsize = $this->get_media_maxfilesize_setting('video', 'field_media_video_file');
		
    foreach($nids as $node_id){
      $media_vault_id = $node_id;
      $media_form = 'Media Vault Form';
      $values = 'Media Vault data';
      $data = array('media_form' => $media_form, 'values' => $values);
			$render_data['theme_data']['#cache']['max-age'] = 0;
      $render_data['theme_data'] = array(
        '#theme' => 'media_vault_upload_template',
        '#media_vault_oploader_title' => $this->t('Media Vault Upload'),
        '#uid' => $uid,
        '#doubles' => $data,         
        '#attached' => [
          'library' =>  [
						'video_maker_tool/vmt.tagsinput',
            'media_vault_tool/mvt_plupload',
            'media_vault_tool/react.min',
            'media_vault_tool/react.dom.min',
            'media_vault_tool/axios',
            'media_vault_tool/mv_uploader_tool',
          ],
        ],
      );
      $render_data['theme_data']['#attached']['drupalSettings']['media']['mediaJS']['media_vault_id'] = $media_vault_id;     
      $render_data['theme_data']['#attached']['drupalSettings']['media_base_url_http'] = $base_url;
      $render_data['theme_data']['#attached']['drupalSettings']['media_base_url'] = $base_secure_url;
      $render_data['theme_data']['#attached']['drupalSettings']['media_archive'] = $media_archive;
      $render_data['theme_data']['#attached']['drupalSettings']['uid'] = $uid;
      $render_data['theme_data']['#attached']['drupalSettings']['file_owner'] = $file_owner;
      $render_data['theme_data']['#attached']['drupalSettings']['total_storage'] = $total_storage;
      $render_data['theme_data']['#attached']['drupalSettings']['allocated_storage_space'] = $allocated_storage_space_up;
      $render_data['theme_data']['#attached']['drupalSettings']['available_space'] = $available_space_up;
      $render_data['theme_data']['#attached']['drupalSettings']['audio_storage'] = $audio_storage;
      $render_data['theme_data']['#attached']['drupalSettings']['image_storage'] = $image_storage;
      $render_data['theme_data']['#attached']['drupalSettings']['text_storage'] = $text_storage;
      $render_data['theme_data']['#attached']['drupalSettings']['video_storage'] = $video_storage;
      $render_data['theme_data']['#attached']['drupalSettings']['audio_maxsize'] = $audio_maxsize;
      $render_data['theme_data']['#attached']['drupalSettings']['image_maxsize'] = $image_maxsize;
      $render_data['theme_data']['#attached']['drupalSettings']['text_maxsize'] = $text_maxsize;
      $render_data['theme_data']['#attached']['drupalSettings']['video_maxsize'] = $video_maxsize;
    }
    return $render_data;
	}
	/**
	 * Update field_favorite of media
	 */
  public function update_media_favorite(){
    if(isset($_POST['mid'])) {
      $mid = $_POST['mid'];
      $media = \Drupal::entityTypeManager()->getStorage('media')->load($mid);
      if($media->field_favorite->value == 0){
        $media->set('field_favorite', 1);
        $result = $media->save();
        $favo_text = 'favorite';
      } else {
        $media->set('field_favorite', 0);
        $result = $media->save();
        $favo_text = 'not favorite';
      } 
      $message = drupal_set_message('Media has been marked as '.$favo_text.'.', 'status');
      return $message;
    } 
  }
  
  /**
	 * Get all media by file type
	 * @return array
	 */
  public function getallMediaByfile(Media $media, $type){
    if($type == 'audio') {
      $medialist = \Drupal::database()->select('node_field_data', 'n');
      $medialist->leftJoin('node__field_vault_audio', 'a', "n.nid = a.entity_id");
      $medialist->condition('a.field_vault_audio_target_id', $media->mid->value, '=');
      $medialist->condition('a.bundle', 'media_kit', '=');
      $medialist->fields('n', ['nid','uid','title']);
      $result = $medialist->execute()->fetchAll();
    }  
    if($type == 'image') {   
      $medialist = \Drupal::database()->select('node_field_data', 'n');
      $medialist->leftJoin('node__field_vault_photo', 'p', "n.nid = p.entity_id");
      $medialist->condition('p.field_vault_photo_target_id', $media->mid->value, '=');
      $medialist->condition('p.bundle', 'media_kit', '=');
      $medialist->fields('n', ['nid','uid','title']);
      $result = $medialist->execute()->fetchAll();
    }
    if($type == 'text') {
      $medialist = \Drupal::database()->select('node_field_data', 'n');
      $medialist->leftJoin('node__field_vault_file', 't', "n.nid = t.entity_id");
      $medialist->condition('t.field_vault_file_target_id', $media->mid->value, '=');
      $medialist->condition('t.bundle', 'media_kit', '=');
      $medialist->fields('n', ['nid','uid','title']);
      $result = $medialist->execute()->fetchAll();
    }
    if($type == 'video') {
      $medialist = \Drupal::database()->select('node_field_data', 'n');
      $medialist->leftJoin('node__field_vault_video', 'v', "n.nid = v.entity_id");
      $medialist->condition('v.field_vault_video_target_id', $media->mid->value, '=');
      $medialist->condition('v.bundle', 'media_kit', '=');
      $medialist->fields('n', ['nid','uid','title']);
      $result = $medialist->execute()->fetchAll();
    }
    
    return $result;
  }
  
	/**
	 * Change title for media edit form
	 */
  public function mediaEditTitle(Media $media) {
    $favurl = \Drupal\Core\Url::fromUserInput('#');
    $id = $media->mid->value;
    if($media->field_favorite->value == 0){
      $class = 'favo-inactive';      
    } else {
      $class = 'favo-active';
    }
    $link_options = [
      'attributes' => [
        'class' => [
          $class,
          'favolink',
        ],
        'id' => $id,
      ],
    ];
    $favurl->setOptions($link_options);
    $favorite = \Drupal::l('', $favurl);
    return ['#markup' => 'Edit '. '"'.$media->label().'"  '.$favorite, '#allowed_tags' => \Drupal\Component\Utility\Xss::getHtmlTagList()];
  }
	
	/**
	 * Change title for media preset edit form
	 */
	public function mediaPresetEditTitle(AccountInterface $user, Media $media) {
    $favurl = \Drupal\Core\Url::fromUserInput('#');
    $id = $media->mid->value;
    if($media->field_favorite->value == 0){
      $class = 'favo-inactive';      
    } else {
      $class = 'favo-active';
    }
    $link_options = [
      'attributes' => [
        'class' => [
          $class,
          'favolink',
        ],
        'id' => $id,
      ],
    ];
    $favurl->setOptions($link_options);
    $favorite = \Drupal::l('', $favurl);
    return ['#markup' => 'Duplicate '. '"'.$media->label().'" with Preset'.$favorite, '#allowed_tags' => \Drupal\Component\Utility\Xss::getHtmlTagList()];
  }
  
	/**
	 * Get media sorting by user id
	 * @return Json Response
	 */
  public function getMediasortingByuid(AccountInterface $user, $type) {
    $uid= $user->get('uid')->value;
    $database = \Drupal::database();
    $query = $database->select('media_field_data', 'md');
		$query->join('media_vault_sorting', 'm', "md.mid = m.mid");
    $query->fields('md', ['mid', 'name']);
    $query->condition('md.uid', $uid, '=');
    $query->condition('md.bundle', $type, '=');
		$query->orderBy('m.sort_number', 'ASC');
    $result = $query->execute()->fetchAll();
 
    $response = $result;
    return new JsonResponse($response);
  }
  
	/**
	 * Get media kit by media id
	 * @return Json Response
	 */
  public function getMediaKitBymid($mid, $type) {
		$default_kit = default_media_kit();
    $database = \Drupal::database();
    if($type == 'audio') {
      $query = $database->select('node_field_data', 'n');
      $query->join('node__field_vault_audio', 'm', "n.nid = m.entity_id");
      $query->fields('n', ['uid', 'title']);
      $query->condition('m.entity_id', $default_kit, '!=');
      $query->condition('m.bundle', 'media_kit', '=');
      $query->condition('m.field_vault_audio_target_id', $mid, '=');
      $result = $query->execute()->fetchAll();
    }  
    if($type == 'image') {   
      $query = $database->select('node_field_data', 'n');
      $query->join('node__field_vault_photo', 'm', "n.nid = m.entity_id");
      $query->fields('n', ['uid', 'title']);
			$query->condition('m.entity_id', $default_kit, '!=');
      $query->condition('m.bundle', 'media_kit', '=');
      $query->condition('m.field_vault_photo_target_id', $mid, '=');
      $result = $query->execute()->fetchAll();
    }
    if($type == 'text') {
      $query = $database->select('node_field_data', 'n');
      $query->join('node__field_vault_file', 'm', "n.nid = m.entity_id");
      $query->fields('n', ['uid', 'title']);
			$query->condition('m.entity_id', $default_kit, '!=');
      $query->condition('m.bundle', 'media_kit', '=');
      $query->condition('m.field_vault_file_target_id', $mid, '=');
      $result = $query->execute()->fetchAll();
    }
    if($type == 'video') {
      $query = $database->select('node_field_data', 'n');
      $query->join('node__field_vault_video', 'm', "n.nid = m.entity_id");
      $query->fields('n', ['uid', 'title']);
			$query->condition('m.entity_id', $default_kit, '!=');
      $query->condition('m.bundle', 'media_kit', '=');
      $query->condition('m.field_vault_video_target_id', $mid, '=');
      $result = $query->execute()->fetchAll();
    }
    
    $response = $result;
    return new JsonResponse($response);
  }
	
	/**
	 * Get media field instance setttings value
	 * $bundle - Media type name
	 * $field_name - Field name for which settings needed
	 */
	public function get_media_maxfilesize_setting($bundle, $field_name){
		$setting_name = 'max_filesize';
		$entity = 'media';
		$bundle_fields = \Drupal::getContainer()->get('entity_field.manager')->getFieldDefinitions($entity, $bundle);
		$field_definition = $bundle_fields[$field_name];
		$max_filesize_setting = $field_definition->getSetting($setting_name);
		return $max_filesize_setting;
	}
  
	/**
	 * Media vault rows sorting
	 * @return Json Response
	 */
  public function media_vault_sortable() {
    if(isset($_POST['uid']) && isset($_POST['mid'])) {
      $uid = $_POST['uid'];
      $type = $_POST['type'];
		
      //delete records from "media_vault_sorting" table.
      \Drupal::database()->delete('media_vault_sorting')
          ->condition('uid', $uid, '=')
          ->condition('type', $type, '=')
          ->execute();
            
      // Insert the records to "media_vault_sorting" table.
      $order = 1;
      foreach($_POST['mid'] as $mid){
        $result = \Drupal::database()->insert('media_vault_sorting')
          ->fields([
            'uid',
            'mid',
            'type',
            'sort_number',
          ])
          ->values(array(
            $uid,
            $mid,
            $type,
            $order,
          ))
          ->execute();
        $order ++;	
      }
      $response = $result;
      return new JsonResponse($response);
    }
	}
	
	/**
   * Returns media original image in original image style
   *
   * @return array
   *   A simple renderable array.
   */
  public function getOriginalMediaImage($mid){
    $response = ['url' => ''];
		$original_style = \Drupal::entityTypeManager()->getStorage('image_style')->load('original_style');
    $media = Media::load($mid);
    if(is_object($media)) {
      if($media->hasField('field_media_image')) {
        //$response['url'] = file_create_url($media->field_media_image->entity->getFileUri());
        $response['url'] = $original_style->buildUrl($media->field_media_image->entity->getFileUri());
      }
      if($media->hasField('field_video_thumbnail')) {
        //$response['url'] = file_create_url($media->field_video_thumbnail->entity->getFileUri());
        $response['url'] = $original_style->buildUrl($media->field_video_thumbnail->entity->getFileUri());
      }
    }
    return new JsonResponse($response);
  }
	
	/**
	 * Get referenced node of Media vault
	 */
	public function get_media_vault_references($vault_id, $type){
		$results = '';
		if($type == 'image'){
			$type = 'photo';
		} else if($type == 'text'){
			$type = 'file';
		}
		
		$database = \Drupal::database();
		$query = $database->select('node__field_vault_'.$type, 'r');
		$query->leftJoin('node_field_data', 'n', "r.entity_id = n.nid");
		$query->condition('r.field_vault_'.$type.'_target_id', $vault_id, '=');
		$query->fields('r', ['entity_id']);
		$query->fields('n', ['title']);
		$results = $query->execute()->fetchAll();

    $response = $results;
    return new JsonResponse($response);
	}
	
	/**
	 * Delete media vault media and file and its references
	 */
	public function delete_media_vault_file() {
		if(isset($_POST['uid']) && isset($_POST['mid']) && isset($_POST['type']) && isset($_POST['reference_nids'])) {
			$uid = $_POST['uid'];
			$nids = $_POST['reference_nids'];
			$mid = $_POST['mid'];
			$type = $_POST['type'];
			foreach($nids as $nid){
				$node = Node::load($nid);
				if($type == 'audio'){
					$audio_files = $node->field_vault_audio;
					foreach($audio_files as $key => $af){
						if($af->target_id == $mid){
							// ... remove the relationship ...
							$node->get('field_vault_audio')->removeItem($key);						
						}
					}
					$node->save();
				}
				else if($type == 'image'){
					$photo_files = $node->field_vault_photo;
					foreach($photo_files as $key => $pf){
						if($pf->target_id == $mid){
							// ... remove the relationship ...
							$node->get('field_vault_photo')->removeItem($key);
						}
					}
					$node->save();
				}
				else if($type == 'file'){
					$text_files = $node->field_vault_file;
					foreach($text_files as $key => $tf){
						if($tf->target_id == $mid){
							// ... remove the relationship ...
							$node->get('field_vault_file')->removeItem($key);						
						}
					}
					$node->save();
				}
				else if($type == 'video'){
					$video_files = $node->field_vault_video;
					foreach($video_files as $key => $vf){
						if($vf->target_id == $mid){
							// ... remove the relationship ...
							$node->get('field_vault_video')->removeItem($key);						
						}
					}
					$node->save();
				}
			}
			$media = Media::load($mid);
			if($type == 'audio'){
				$fid = $media->field_media_audio_file->target_id;
			}
			else if($type == 'image'){
				$fid = $media->field_media_image->target_id;
    //print "<pre>";print_r($_POST);print "fid = $fid";exit;
			}
			else if($type == 'file'){
				$fid = $media->field_media_file->target_id;		
			}
			else if($type == 'video'){
				$fid = $media->field_media_video_file->target_id;	
			}
			if(!empty($fid)){
				$file = File::load($fid);			
			}
			$media->delete();			
			if(!empty($file)){
				$file->delete();
			}
			
			echo "done";
			exit;
		}
	}

}