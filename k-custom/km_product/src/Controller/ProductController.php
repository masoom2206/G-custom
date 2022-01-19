<?php
 
/**
* @file
* Contains \Drupal\km_product\Controller\ProductController.php
*
*/
namespace Drupal\km_product\Controller;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;
use Drupal\image\Entity\ImageStyle;
use Drupal\node\NodeInterface;
use Drupal\taxonomy\Entity\Term;      
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\media_vault_tool\Controller\MediaDetailController;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Routing\Access\AccessInterface;

class ProductController extends ControllerBase {
  /**
   * Returns product templates page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function getTemplates(NodeInterface $node, $producttype){
    $account = \Drupal::currentUser();
    $uid = \Drupal::currentUser()->id();
    // grid as default and list view 
    $view_style = \Drupal::request()->query->get('view');
    $view_style = empty($view_style) ? 'grid' : $view_style;
    // left navigation
    $data = \Drupal::service('km_product.templates')->getLeftNavigation($node);
    // product type
    $product = ['id'=> $producttype->id(), 'name' => $producttype->getName()];
    $data['product'] = $product;
    $data['uid'] = $uid;
    $roles = $account->getRoles();
		$professional_user = 0;
    if(in_array('content_creator', $roles) && !in_array('advanced_content_creator', $roles) && !in_array('administrator', $roles)){
      $professional_user = 1;
    }

    $product_type = strtolower(preg_replace('/[^a-z0-9-]/i', '', $producttype->getName()));
    
    switch($product_type){
      case 'brochure':
      case 'flyer':
      case 'photobook':
      case 'postcardgreetingcard':
      case 'socialmediabanner':
      case 'socialmediapostimage':
      case 'videoslides':
        $product = new \Drupal\km_product\Product($data);
        return $product->getProduct($view_style);
      break;
      
      case 'brochure':
        $brochure = new \Drupal\km_product\Brochure($data);
        return $brochure->getBrochure($view_style);
      break;
      
      case 'emailflyer':
        $emailflyer = new \Drupal\km_product\EmailFlyer($data);
        return $emailflyer->getEmailFlyer($view_style);
      break;
      
      case 'flyer':
        $flyer = new \Drupal\km_product\Flyer($data);
        return $flyer->getFlyer($view_style);
      break;
      
      case 'mobilewebapp':
        $mobilewebapp = new \Drupal\km_product\MobileWebApp($data);
        return $mobilewebapp->getMobileWebApp($view_style);
      break;
      
      case 'onlinegallery':
        $onlinegallery = new \Drupal\km_product\OnlineGallery($data);
        return $onlinegallery->getOnlineGallery($view_style);
      break;
      
      case 'photobook':
        $photobook = new \Drupal\km_product\PhotoBook($data);
        return $photobook->getPhotoBook($view_style);
      break;
      
      case 'playlist':
        $playlist = new \Drupal\km_product\Playlist($data);
        return $playlist->getPlaylist($view_style);
      break;
       
      case 'postcardgreetingcard':
        $postcardgreetingcard = new \Drupal\km_product\PostCardGreetingCard($data);
        return $postcardgreetingcard->getPostCardGreetingCard($view_style);
      break;
      
      case 'socialmediabanner':
        $socialmediabanner = new \Drupal\km_product\SocialMediaBanner($data);
        return $socialmediabanner->getSocialMediaBanner($view_style);
      break;
      
      case 'socialmediapostimage':
        $socialmediaimage = new \Drupal\km_product\SocialMediaImage($data);
        return $socialmediaimage->getSocialMediaImage($view_style);
      break;
      
      case 'video':
        $video = new \Drupal\km_product\Video($data);
        return $video->getVideo($view_style);
      break;
      
      case 'weblandingpage':
        $weblandingpage = new \Drupal\km_product\WebLandingPage($data);
        return $weblandingpage->getWebLandingPage($view_style);
      break;
      
      case 'htmlarticle':
        $article = new \Drupal\km_product\Article($data);
        return $article->getArticle($view_style);
      break;
      
      case 'emailnewsletter':
        if($professional_user == 1){
          throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException();
          //return AccessResult::forbidden();
        }
        else {
          $newsletter = new \Drupal\km_product\Newsletter($data);
          return $newsletter->getNewsletter($view_style);
        }
      break;    
      case 'reusablecontentblock':
        if($professional_user == 1){
          throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException();
          //return AccessResult::forbidden();
        }
        else {
          $newsletter = new \Drupal\km_product\ReusableContentBlock($data);
          return $newsletter->getReusableContentBlock($view_style);
        }
      break;    
      case 'webpage':
        if($professional_user == 1){
          throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException();
          //return AccessResult::forbidden();
        }
        else {
          $webpage = new \Drupal\km_product\WebPage($data);
          return $webpage->getWebPage($view_style);
        }
      break;    

      default:
        $otherproduct = new \Drupal\km_product\OtherProduct($data);
        return $otherproduct->getOtherProduct($view_style);
    } 
	}
  
  /**
   * Drupal save favorite template
   **/
  public function saveFavorite(Request $request) {
    $uid      = \Drupal::currentUser()->id();
    $nid      = $request->request->get('nid');
    $tid      = $request->request->get('tid');
    $favorite = $request->request->get('favorite');
    $kmds     = $request->request->get('kmds');
    if(is_numeric($tid)){
      // web product
      \Drupal::database()->merge('web_templates_favorite')
        ->keys(['node_id' => $nid, 'template_id' => $tid])
        ->fields([
          'user_id' => $uid,
          'is_favorite' => $favorite,
          'modified' => date('Y-m-d H:i:s'),
        ])
        ->execute();
    }else{
      // product having canvas
      if($kmds == 1){
      \Drupal::database()->merge('templates_favorite')
        ->keys(['node_id' => $nid, 'template_id' => $tid])
        ->fields([
          'user_id' => $uid,
          'is_favorite' => $favorite,
          'modified' => date('Y-m-d H:i:s'),
        ])
        ->execute();
        // modify time in MongoDB table 
        $response_code = \Drupal::service('km_product.templates')->updateTemplate($tid, ['modified' => date('Y-m-d H:i:s')]);
      }else{
        // modify favorite and time in MongoDB table 
        $response_code = \Drupal::service('km_product.templates')->updateProductTemplate($tid, ['favorite' => $favorite, 'modified' => date('Y-m-d H:i:s')]);
      }
    }
    
    $output = ['status' => $response_code, 'msg' => 'Saved successfully.'];
    return new JsonResponse($output);
  }
  
  /**
   * Drupal delete template
   **/
  public function deleteTemplate($template_id = null) {
    $uid = \Drupal::currentUser()->id();
    if(is_numeric($template_id)) {
      // remove data from favorite table
      \Drupal::database()->delete('web_templates_favorite')
        ->condition('template_id', $template_id)
        ->condition('user_id', $uid)
        ->execute();
      // remove data from templates table
      \Drupal::database()->delete('web_product_templates')
        ->condition('id', $template_id)
        ->condition('user_id', $uid)
        ->execute();
    }else{
      $response_code = \Drupal::service('km_product.templates')->updateProductTemplate($template_id, ['status' => 0]);
    }
    $output = ['status' => $response_code, 'msg' => 'Saved successfully.'];
    return new JsonResponse($output); 
  }
  
  /**
   * Drupal Services
   **/
  public function getKMDSTemplates($producttype) {
    $product_type_id = $producttype->id();
    $response = \Drupal::service('km_product.templates')->getTemplates($product_type_id);
    echo '<pre>'; print_r($response); echo '</pre>';
  }
  
  /**
   * Drupal Services
   **/
  public function getTemplateRawDetail($template_id = null) {
    $kmds = \Drupal::request()->query->get('kmds');
    $template_detail = [];
    if(!is_null($template_id)) {
      if($kmds == 1){
        $template_detail = \Drupal::service('km_product.templates')->getTemplateDetail($template_id);
      }else{
        $template_detail = \Drupal::service('km_product.templates')->getProductTemplateDetail($template_id);
      }
    }
    
    echo '<pre>'; print_r($template_detail); echo '</pre>';
    die('here');
  }
  /**
   * Callback function customMediaRender()
   * to create new media.
   **/
  public function customMediaRender(){
    $uid = \Drupal::currentUser()->id();
    //$image_url = \Drupal::request()->get('image_url');
    $getMediaData = \Drupal::request()->get('media_data');
    $get_media_data = json_decode($getMediaData, true);
    // print "<pre>1";print_r($get_media_data).'<br/>';
    $media_kits = $get_media_data['mkits'];
    $tagsTextArray = isset($get_media_data['tags']) ? $get_media_data['tags'] : '';
    $preset_type = $get_media_data['preset_type'];
    $remove_media_kits = isset($get_media_data['remove_mkits']) ? $get_media_data['remove_mkits'] : '';
		//Tags added/remove to/from media kit
		$get_tags = [];
		if (is_array($tagsTextArray) ){
			foreach($tagsTextArray as $termText){
			 $get_tags[] =  $this->getTagsTermId(trim($termText), $uid);
			}
		}
    if($preset_type == 'pdf'){
      $fileObject = $this->customMediaSave($get_media_data['pdf_url']);
      $fileThumbObject = $this->customMediaSave($get_media_data['image_url']);
    }
    else {
      $fileObject = $this->customMediaSave($get_media_data['image_url']);
    }
    //print "<pre>2";print_r($fileObject).'<br/>';
    if ($fileObject) {
      $file_path = $fileObject->getFileUri();
      $id3file = NULL;
      $id3_lib_availability = getid3_load();
      if ($id3_lib_availability == false) {
        drupal_set_message(t("The getid3() module cannot find the getID3 library used to read and write ID3 tags. The site administrator will need to verify that it is installed and then update the <a href='!admin-settings-audio-getid3'>settings</a>.", array('!admin-settings-audio-getid3' => Url::fromRoute('getid3.config'))), 'error', false);
        return $id3file;
      }
      if($preset_type == 'pdf'){
        $bit_depth = true;
        $bundle = 'text';
      }
      else {
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
        $bundle = 'image';
      }
      //print "bit_depth = $bit_depth<br/>";
      if($bit_depth){
        if($get_media_data['km_render'] == 0){
          //create new media
          $media_new = Media::create([
            'bundle' => $bundle, 
            'name' => $get_media_data['title'],
            'field_description_plain_text' => ['value' => $get_media_data['description'], ],
            'field_copyright_number' => ['value' => '', ],
            'field_favorite' => ['value' => '', ],
            'field_archived' => ['value' => $get_media_data['archieve'], ],
            'field_media_source_type' => ['value' => 'generated', ],
            'field_format' => ['value' => '.' . $preset_type, ],
           ]);
          $media_new->uid = $uid;
        }
        else {
          $media_new = Media::load($get_media_data['km_render']);
          $media_new->set('name',$get_media_data['title']);
          $media_new->set('field_archived', $get_media_data['archieve']);
          $media_new->set('field_description_plain_text', $get_media_data['description']);
          foreach ($media_new->get('field_keywords')->getValue() as $term_id){   
            if($term_id['target_id']){
              //$get_tags[] = \Drupal\taxonomy\Entity\Term::load($term_id['target_id'])->label();
              $get_tags[] = $term_id['target_id'];
            }					 
          }
        }
        if ($fileObject) {
          if($preset_type == 'pdf'){
            $media_new->field_media_file->target_id = $fileObject->id();
            $media_new->field_media_file->display = true;
            $media_new->set('field_file_size', $this->getFormatedFileSize($fileObject->get('filesize')->getValue() [0]['value']));
            if($fileThumbObject){
              $media_new->field_document_thumbnail->target_id = $fileThumbObject->id();
            }
            $get_media_data['pdf_file_id'] = $fileObject->id();
            $get_media_data['pdf_thum_id'] = $fileThumbObject->id();
          }
          else {
            $media_new->field_media_image->target_id = $fileObject->id();
            $media_new->set('field_bit_depth', $bit_depth);
            $media_new->set('field_pixel_dimentions', $get_media_data['preset_dimension']); 
            $media_new->set('field_file_size', $this->getFormatedFileSize($fileObject->get('filesize')->getValue() [0]['value'])); 
            $media_new->set('field_made_from_preset', (int)$get_media_data['preset']);
            $get_media_data['pdf_file_id'] = $fileObject->id();
          }
        }
        $get_media_data['field_keywords'] = $get_tags;
        $media_new->set('field_keywords', $get_tags);       
        $media_new->save();
        // not sure, why title field is not updated when file update. again saving title.
        if($get_media_data['km_render'] != 0){
          $media_new->set('name',$get_media_data['title']);
          $result = $media_new->save();
        }
        $mid = $media_new->id();
        $get_media_data['mid'] = $mid;
        //print "mid = $mid<br/>";
        // if new media is created then it should be firstly added into media vault.
        //get media_voult_id and append new media item.
        $database = \Drupal::database();
        $media_vault_id = $database->select('node_field_data', 'n')->fields('n', ['nid'])->condition('n.uid', $uid, '=')->condition('n.type', 'media_vault', '=')->execute()->fetchField();
        //print "media_vault_id = $media_vault_id<br/>";
        $get_media_data['media_vault_id'] = $media_vault_id;
        $voult = Node::load($media_vault_id);
        if($preset_type == 'pdf'){
          $voult->get('field_vault_file')->appendItem(['target_id' => $mid, ]);
          $message = 'Your product has been successfully saved and rendered. The PDF has been added to your Media Vault and selected Media Kits.';
        }
        else {
          $voult->get('field_vault_photo')->appendItem(['target_id' => $mid, ]);
          $message = 'Your product has been successfully saved and rendered. The image has been added to your Media Vault and selected Media Kits.';
        }
        $voult->save();
        
        // default media kit
        // add media to media kit 
        if (is_array($remove_media_kits) ){
          foreach($remove_media_kits as $kit){
            $r_media_kit = \Drupal::database()->select('node_field_data', 'n')->fields('n', ['nid'])->condition('n.uid', $media_new->getOwnerId() , '=')->condition('n.nid', $kit,'=')
                          ->condition('n.type', 'media_kit', '=')->execute()->fetchAssoc();
            if ($r_media_kit) {
              $r_kit = Node::load($kit);
              if($preset_type == 'pdf'){
                $items = $r_kit->get('field_vault_file')->getValue();
                foreach($items as $key =>$value){
                  if($value['target_id'] == $mid){
                    $r_kit->get('field_vault_file')->removeItem($key);
                    $r_kit->save();
                  }
                }
              }
              else {
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
        }
        foreach($media_kits as $kit){
          $r_media_kit = \Drupal::database()->select('node_field_data', 'n')->fields('n', ['nid'])->condition('n.uid', $uid, '=')->condition('n.nid', $kit, '=')->condition('n.type', 'media_kit', '=')->execute()->fetchAssoc();
          if ($r_media_kit) {
            $r_kit = Node::load($kit);
            if($preset_type == 'pdf'){
              if(!$this->whatever($r_kit->get('field_vault_file')->getValue(), 'target_id', $mid)){
                $r_kit->get('field_vault_file')->appendItem(['target_id' => $mid, ]);
                $r_kit->save();
              }
            }
            else {
              if(!$this->whatever($r_kit->get('field_vault_photo')->getValue(), 'target_id', $mid)){
                $r_kit->get('field_vault_photo')->appendItem(['target_id' => $mid, ]);
                $r_kit->save();
              }
            }
          }
        }
      }
    }
		$message = drupal_set_message($message, 'status');
		return new JsonResponse($get_media_data);
  }
  /**
   * callback function customMediaSave()
   * to save the new media image
   */
  public function customMediaSave($image_url){
    //print "customMediaSave >> image_url = $image_url<br/>";
    $time_stamp = time();
		$fileContent = file_get_contents($image_url);
    $fileParts = pathinfo($image_url);
    //print "<pre>";print_r($fileParts);
    //$filename = $fileParts['basename'];
    $filename = $time_stamp.'.'.$fileParts['extension'];
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
		}
    else {
			return 0;
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
    }
    else {
      $bytes = number_format($bytes / 1024, 2, '.', '');
      for ($i = 0;$i < count($units);$i++) {
        if (number_format($bytes, 2, '.', '') >= 1024) {
          $bytes = number_format($bytes / 1024, 2, '.', '');
        }
        else {
          $bytes = number_format($bytes, 2, '.', '');
          break;
        }
      }
      $bytes = $bytes . ' ' . $units[$i];
    }
    return $bytes;
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
  /**
   * Callback function getDefaultMediaKit()
   * to get user default media kit
   **/
  public function getDefaultMediaKit($uid){
    $query = \Drupal::database()->select('node_field_data', 'n');
    $query->leftJoin('media_kit_sorting', 'm', "n.nid = m.nid");
    $query->fields('n', ['nid']);
    $query->condition('n.uid', $uid, '=');
    $query->condition('n.type', 'media_kit', '=');
    $query->orderBy('m.sort_number', 'ASC');
    $default_media_kit = $query->execute()->fetchAssoc();
    if(empty($default_media_kit)){
      return 0;
    }else{
      return $default_media_kit['nid'];
    }
  }
  /**
   * Callback function kmMediaKitList()
   * to get the user media kit list.
   **/
  public function kmMediaKitList(){
    $km_render = (int)$_REQUEST['km_render'];
    $type = $_REQUEST['type'];
    $uid = \Drupal::currentUser()->id();
    $data = array();
    if($km_render !== 0){
      $media = Media::load($km_render);
      $media_data = [];
      $media_data['name'] = $media->name->value;
      $media_data['achived'] = $media->field_archived->value;
      $media_data['copyright'] = $media->field_copyright_number->value;
      $media_data['favorite'] = $media->field_favorite->value;
      $media_data['description'] = $media->field_description_plain_text->value;
      $tags_name = '';
      foreach ($media->get('field_keywords')->getValue() as $term_id){   
        if($term_id['target_id']){
          $tags_name .= \Drupal\taxonomy\Entity\Term::load($term_id['target_id'])->label() . ', ';
        }					 
      }
      $media_data['tags'] = $tags_name;
		  //current used in mkit
			$md = new MediaDetailController();
			if($type == 'pdf'){
        $mediaList = $md->getallMediaByfile($media, 'text');
      }
      else {
        $mediaList = $md->getallMediaByfile($media, 'image');
      }
			$media_data['used_mkit'] = $mediaList;
      $data['media_data'] = $media_data;
      // get default media kit
      $data['default_kit'] = $this->getDefaultMediaKit($uid);
      // get media kits
      $query_media_kit = \Drupal::database()->select('node_field_data', 'n')
          ->fields('n', ['nid', 'title'])
          ->condition('n.uid', $media->getOwnerId(), '=')->condition('n.type', 'media_kit', '=');
      $nids_media_kit = $query_media_kit->execute()
          ->fetchAll();
      $data['media_kit'] = $nids_media_kit;
    }
    else {
      // get default media kit
      $data['default_kit'] = $this->getDefaultMediaKit($uid);
      // get media kits
      $query_media_kit = \Drupal::database()->select('node_field_data', 'n')
          ->fields('n', ['nid', 'title'])
          ->condition('n.uid', $uid, '=')->condition('n.type', 'media_kit', '=');
      $nids_media_kit = $query_media_kit->execute()
          ->fetchAll();
      $data['media_kit'] = $nids_media_kit;
    }
		return new JsonResponse($data);
  }
}