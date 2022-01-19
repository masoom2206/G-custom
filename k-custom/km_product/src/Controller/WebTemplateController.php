<?php
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
use Drupal\km_product\Controller\TemplatesController;
use Drupal\s3fs\S3fsService;
use Drupal\paragraphs\Entity\Paragraph;


class WebTemplateController extends ControllerBase {
  /**
   * Returns product template settings page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function editTemplate(NodeInterface $node, $producttype, $template_id) {
    global $base_secure_url;
    // user info
    $uid = \Drupal::currentUser()->id();
    $user = User::load($uid);
		$user_name = $user->get('name')->value;
		$user_email = $user->get('mail')->value;
    $user_roles = $user->getRoles();
		$professional_user = 0;
    if(in_array('content_creator', $user_roles) && !in_array('advanced_content_creator', $user_roles) && !in_array('administrator', $user_roles)){
      $professional_user = 1;
    }
    $productName = $producttype->getName();
    if($professional_user == 1 && ($productName == 'Email Newsletter' || $productName == 'Reusable Content Block' || $productName == 'Web Page')){
      throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException();
    }
    // template query
    $query = \Drupal::database()->select('web_product_templates', 'wpt');
    $query->fields('wpt'); 
    $query->condition('wpt.id', $template_id, '=');
    $query->condition('wpt.template_status', 1, '=');
    $template = $query->execute()->fetchObject();
    
    // user can access active, admin and own templates
    if(empty($template)){
      throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException();
    }else{
      if(($template->template_type == 2) && ($template->user_id <> $uid)) {
        throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException();
      }
    }
    
    // Professional and other users can only change the image and text.
    $edit_properties = 0;
    // Administrator, Expert (advanced_content_creator) and Designers: Get the full user-level editing features
    // Added Professional(content_creator) role condition at 06-10-2021
    if (in_array('administrator', $user_roles) || in_array('advanced_content_creator', $user_roles) || in_array('designer', $user_roles) || in_array('content_creator', $user_roles)) {
      $edit_properties = 1;
    }
    
    // check KMDS or User template
    $kmds = \Drupal::request()->query->get('kmds');
    $kmds = empty($kmds) ? 'no' : $kmds;
    $clone = \Drupal::request()->query->get('clone');
    $clone = empty($clone) ? 'no' : $clone;
    
    // node id
    $nid = $node->id();
    // left navigation
    $data = \Drupal::service('km_product.templates')->getLeftNavigation($node);
    // product type
    $product_type = preg_replace('/[^a-z0-9-]/i', '', $producttype->getName());
    $product = [
      'id'=> $producttype->id(),
      'name' => $producttype->getName(),
    ];
    
    // web product template html
    $template->template_html = \Drupal::service('km_product.templates')->getProductHTML($user, $template->template_base_html, $template->template_variables);
    
    // create new file in case of clone / file deleted
    if($clone == 'yes'){
      $template->mid = 0;
    }else{
      if($template->media_id > 0){
        $media = Media::load($template->media_id);
        $template->mid = empty($media) ? 0 : $template->media_id; 
      }else{
        $template->mid = 0;
      }
    }

    if($template->template_type == 2) {
      // web product
      $pquery = \Drupal::database()->select('web_product_templates', 'wpt');
      $pquery->fields('wpt', ['id', 'name']); 
      $pquery->condition('wpt.id', $template->parent_id, '=');
      $ptemplate = $pquery->execute()->fetchObject();
      
      $template->design_name = $ptemplate->name;
      $template->design_id = $ptemplate->id;
      
      $template->product_name = $template->name;
      $template->product_id = $template->id;
    }else{
      // web template
      $template->design_name = $template->name;
      $template->design_id = $template->id;
      
      $template->product_name = '';
      $template->product_id = '';
    }
    
    $properties['name'] = 'Reusable Content Block';
    $rcb_terms = \Drupal::entityManager()->getStorage('taxonomy_term')->loadByProperties($properties);
    $rcb_term = reset($rcb_terms);
    $rcb_tid = !empty($rcb_term) ? $rcb_term->id() : 0;
    $ckeform = \Drupal::formBuilder()->getForm('Drupal\media_web_system\Form\WebTextEditorForm');
    $render_data['theme_data'] = [
      '#theme'                  => 'web-template-edit',
      '#node'                   => $data['node'],
      '#user'                   => $data['user'],
      '#product'                => $product,
      '#nav'                    => $data['nav'],
      '#ckeform'                => $ckeform,
      '#data'                   => [
          'edit_properties' => $edit_properties,
          'template' => $template,
          'kmds' => $kmds,
          'clone' => $clone,
        ],
      '#attached'               => [
        'library' =>  [
          'video_maker_tool/vmt.tagsinput',
          'media_design_system/bootstrap_cdn',
          'km_product/web.product',
          'km_product/km_product_image_editor',
        ],
        'drupalSettings' => [
          'media_base_url' => $base_secure_url, 
          'uid' => $uid,
          'kaboodle_nid' => $nid,
          'edit_properties' => $edit_properties,
          'producttype_id' => $producttype->getName(),
          'rcb_tid' => $rcb_tid,
        ],
      ],
    ];
    
    return $render_data;  
	}
  
  /**
   * Returns product template settings page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function saveTemplate(Request $request) {
    $uid  = \Drupal::currentUser()->id();
    $time = time();
    $action       = $request->request->get('action');
    $template_id  = $request->request->get('template_id');
    $name         = $request->request->get('template_name');
    $node_id      = $request->request->get('node_id');
    $product_id   = $request->request->get('product_id');
    $kmds         = $request->request->get('kmds');
    $clone        = $request->request->get('clone');
    $template     = $request->request->get('template');
    $tokens       = $request->request->get('tokens');
    
    // template
    $query = \Drupal::database()->select('web_product_templates', 'wpt');
    $query->fields('wpt'); 
    $query->condition('wpt.id', $template_id, '=');
    $data = $query->execute()->fetchObject();
    
    // template or product name 
    $name = empty($name) ? $data->name : $name;
    $parent_id  = empty($template_id) ? 0 : $template_id;
    $node_id    = empty($node_id) ? 0 : $node_id;
    $media_id   = empty($data->media_id) ? 0 : $data->media_id; 
    // replace base64 image data into image file at S3 bucket
    //$tokens = \Drupal::service('km_product.templates')->updateTemplateVariables($tokens, $data->product_id);
    
    $fields = [];
    $fields['name']         = $name;
    $fields['description']  = $data->description;
    $fields['template_base_html'] = $template;
    $fields['template_variables'] = $tokens;
    $fields['tags'] = '';
    $fields['modified'] = $time;

    if(($kmds == 'yes') || ($clone == 'yes')) {
      $fields['parent_id']            = $parent_id;
      $fields['media_id']             = 0;
      $fields['product_id']           = $product_id;
      $fields['node_id']              = $node_id;
      $fields['user_id']              = $uid;
      $fields['template_group']       = $data->template_group;
      $fields['preview_image']        = $data->preview_image;
      $fields['template_file_name']   = $data->template_file_name;
      $fields['template_type']    = 2;
      $fields['template_status']  = 1;
      $fields['created']  = $time;
      
      $template_id = \Drupal::database()->insert('web_product_templates')
      ->fields($fields)
      ->execute();
    }else{
      $fields['media_id'] = $media_id;
      \Drupal::database()->update('web_product_templates')
      ->fields($fields)
      ->condition('id', $template_id)
      ->execute();
    }

    $output = ['status' => 200, 'template_id' => $template_id, 'msg' => 'Saved successfully.'];
    return new JsonResponse($output);
  }
  
  /**
   * Callback function saveRenderWebProduct()
   * to create new media.
   **/
  public function saveRenderWebProduct(){
    $uid = \Drupal::currentUser()->id();
    $media_data = \Drupal::request()->get('media_data');
    $render_id    = $media_data['render_id'];
    $template_id  = $media_data['template_id'];
    $mkits        = $media_data['mkits'];
    $remove_mkits = isset($media_data['remove_mkits']) ? $media_data['remove_mkits'] : [];
    
    $tags = [];
    $tags_data = isset($media_data['tags']) ? $media_data['tags'] : [];
		if (is_array($tags_data) ){
			foreach($tags_data as $term_text){
        $tags[] = getTagsByTermId(trim($term_text), $uid);
			}
		}
    
    $bit_depth = true;
    $bundle = 'text';
    if($render_id == 0){
      //create new media
      $media_new = Media::create([
        'bundle' => $bundle, 
        'name' => $media_data['title'],
        'field_description_plain_text' => ['value' => $media_data['description'], ],
        'field_copyright_number' => ['value' => '', ],
        'field_favorite' => ['value' => '', ],
        'field_archived' => ['value' => $media_data['archieve'], ],
        'field_media_source_type' => ['value' => 'generated', ],
        'field_format' => ['value' => '.txt', ],
       ]);
      $media_new->uid = $uid;
    }else{
      $media_new = Media::load($render_id); 
    }
    
    $media_new->set('name',$media_data['title']);
    $media_new->set('field_archived', $media_data['archieve']);
    $media_new->set('field_description_plain_text', $media_data['description']);
    // create text file for web product
    $fileObject = $this->saveWebProduct($template_id);
    if($fileObject) {
      $media_data['file_path'] = $fileObject->getFileUri();
      $media_new->field_media_file->target_id = $fileObject->id();
      $media_new->field_media_file->display = true;
      $media_new->set('field_file_size', getFormatedFileSize($fileObject->get('filesize')->getValue() [0]['value']));
    }

    $media_new->set('field_keywords', $tags);       
    // save media
    $media_new->save();
    $mid = $media_new->id();
    $media_data['mid'] = $mid;
    
    // update web product templates with media
    \Drupal::database()->update('web_product_templates')
      ->fields(['media_id' => $mid, 'modified' => time()])
      ->condition('id', $template_id)
      ->execute();

    //get media_voult_id and append new media item.
    $media_vault_id = \Drupal::database()->select('node_field_data', 'n')->fields('n', ['nid'])->condition('n.uid', $uid, '=')->condition('n.type', 'media_vault', '=')->execute()->fetchField();
    $media_data['media_vault_id'] = $media_vault_id;
    $voult = Node::load($media_vault_id);
    $items = $voult->get('field_vault_file')->getValue();
    $vmids = [];
    foreach($items as $key =>$value){
      $vmids[] = $value['target_id'];
    }
    if(!in_array($mid, $vmids)){
      $voult->get('field_vault_file')->appendItem(['target_id' => $mid]);
      $voult->save();
    }
    
    
    // remove media file from media kits
    if (is_array($remove_mkits) ){
      foreach($remove_mkits as $kit){
        $remove_media_kit = \Drupal::database()->select('node_field_data', 'n')->fields('n', ['nid'])->condition('n.uid', $media_new->getOwnerId() , '=')->condition('n.nid', $kit,'=')->condition('n.type', 'media_kit', '=')->execute()->fetchAssoc();
        if($remove_media_kit){
          $node_kit = Node::load($kit);
          $items = $node_kit->get('field_vault_file')->getValue();
          foreach($items as $key =>$value){
            if($value['target_id'] == $mid){
              $node_kit->get('field_vault_file')->removeItem($key);
            }
          }
          $node_kit->save();
        }
      }
    }
    
    // add media file to the selected media kits
    foreach($mkits as $kit){
      $media_kit = \Drupal::database()->select('node_field_data', 'n')->fields('n', ['nid'])->condition('n.uid', $uid, '=')->condition('n.nid', $kit, '=')->condition('n.type', 'media_kit', '=')->execute()->fetchAssoc();
      if($media_kit) {
        $node_kit = Node::load($kit);
        $items = $node_kit->get('field_vault_file')->getValue();
        $kmids = [];
        foreach($items as $key =>$value){
          $kmids[] = $value['target_id'];
        }
        
        if(!in_array($mid, $kmids)){
          $node_kit->get('field_vault_file')->appendItem(['target_id' => $mid]);
          $node_kit->save();
        }
      }
    }
    
		return new JsonResponse($media_data);
  }
  
  /**
   * callback function saveWebProduct()
   * to save the new text file for web product
   */
  public function saveWebProduct($template_id){
    $uid = \Drupal::currentUser()->id();
    $user = User::load($uid);
    $directory = "public://{$uid}";
    $filename = time().'.txt';
    $destination = $directory .'/'. $filename;
    \Drupal::service('file_system')->prepareDirectory($directory, \Drupal\Core\File\FileSystemInterface::CREATE_DIRECTORY);
    
    // template
    $query = \Drupal::database()->select('web_product_templates', 'wpt');
    $query->fields('wpt'); 
    $query->condition('wpt.id', $template_id, '=');
    $template = $query->execute()->fetchObject();
    $product_name = \Drupal\taxonomy\Entity\Term::load($template->product_id)->get('name')->value;
    $product_group = $template->template_group;
	
    if($product_name == "Online Gallery" || $product_name == "Playlist"){
      $returnData = $this->updateProductHtml($product_name , $product_group, $template->template_base_html, $template->template_variables);
      //\Drupal::logger('template variable jsin')->warning('<pre><code>' . print_r($returnData, TRUE) . '</code></pre>');
      $file_content = '';
      $file_content .= \Drupal::service('km_product.templates')->getProductHTML($user, $returnData['updated_html'], json_encode($returnData['template_variable']));
      $file_content .= '';
    }
    else if($product_name == "Reusable Content Block" ){
      $returnData = $this->updateProductHtml($product_name , $product_group, $template->template_base_html, $template->template_variables);
      $file_content = \Drupal::service('km_product.templates')->getProductHTML($user, $returnData['updated_html'], json_encode($returnData['template_variable']));
      //\Drupal::logger('template html article')->warning('<pre><code>' . print_r($file_content, TRUE) . '</code></pre>');
    }
    else{
	    $file_content = '<!DOCTYPE html><html><body>';
      $file_content .= \Drupal::service('km_product.templates')->getProductHTML($user, $template->template_base_html, $template->template_variables);
      $file_content .= '</body></html>';	
    }
    if($file_content){
      $classes = array('shape', 'token', 'open-ckeditor', 'main-container', 'main-container');
      $dom = new \DOMDocument;
      $dom->loadHTML(utf8_decode($file_content));
      $xpath = new \DOMXPath($dom);
      //$res = $xpath->query('//@class|//@id');
      $res = $xpath->query('//@class');
      foreach($res as $attr){
        $value = explode(' ', $attr->value);
        foreach($value as &$set){
          if(trim($set) !== '' && in_array(trim($set), $classes)){
            $set = 'km-'.trim($set);
          }
        }
        unset($set);
        $attr->value = implode(' ', $value);
      }
      $file_content = $dom->saveHTML($dom->documentElement);
    }
    try {
      $file = file_save_data($file_content, $destination, FILE_EXISTS_RENAME);
      return $file;
    }
    catch(Exception $e) {
      //echo 'Message: ' . $e->getMessage();
    }
    return false;
  }
   /**
   * callback function updateProductHtml()
   * 
   */
  
  public function updateProductHtml($product_name , $product_group, $html_content, $template_variable){
	 $returnData = [];
	 $data_variables = json_decode($template_variable, true);
	 if($product_name == "Online Gallery"){
		//if( strtolower($product_group) == "olivia" ){
			// need to update token img
		  	$dom = new \DOMDocument;
			$dom->encoding = 'utf-8';		 
            $dom->loadHTML(utf8_decode($html_content));
            $divs = $dom->getElementsByTagName('div');
            $index = 1;
			foreach($divs as $key=>$div){  
			  if ($div->hasAttribute('id')){
				if(preg_match( '/^km-shape-gallery-image.*/', $div->getAttribute('id'))){
					$file_fid = (int)$div->getAttribute('data-fid');
					//\Drupal::logger('file_fid')->warning('<pre><code>' . print_r($file_fid, TRUE) . '</code></pre>');
					$public_url = $this->saveFilesAsPublic($file_fid, 'online_gallery');
					 $div->setAttribute('data-thumb',$public_url['thumb_url']);
					 $div->setAttribute('data-src', $public_url['original_url']);
					 $div2 = $div->getElementsByTagName('div');
					   foreach($div2 as $key2=>$childdiv){
						 if(preg_match( '/^km-gallery-image.*/', $childdiv->getAttribute('id'))){
							 $data_variables[$childdiv->getAttribute('id')] = '<img src="'.$public_url['gallery_url'].'" alt="gallery">';
						 }
					   }
				   }

				   $index ++;
			  }
			}
      $returnData['template_variable'] =  $data_variables;
         
         $returnData['updated_html'] =  $dom->saveHTML($dom->documentElement);
		 return $returnData; 
		//} 
	 } 
	 elseif($product_name == "Playlist"){
		// $public_url = $this->saveFilesAsPublic($file_fid, 'plalist');
    $dom = new \DOMDocument;
       $dom->encoding = 'utf-8';        
            $dom->loadHTML(utf8_decode($html_content));
            $spans = $dom->getElementsByTagName('span');
            $index = 1;
            foreach($spans as $key=>$span){
              if ($span->hasAttribute('id')){
                            if(preg_match( '/^kmmedia-playlis-url.*/', $span->getAttribute('id'))){
                $file_fid = $span->getAttribute('data-fid');
                            $public_url = $this->saveFilesAsPublic($file_fid, 'playlist');
                            $span->nodeValue = $public_url['original_url'];
                          }
                        }
                        }
               $returnData['template_variable'] =  $data_variables;
               $returnData['updated_html'] =  $dom->saveHTML($dom->documentElement);
               return $returnData;
	 }
    elseif($product_name == "Reusable Content Block"){
      $dom = new \DOMDocument;
			$dom->encoding = 'utf-8';		 
      //$dom->loadHTML(utf8_decode($html_content));
      $dom->loadHTML(utf8_decode($html_content), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
      $imgs = $dom->getElementsByTagName('img');
      $index = 1;
			foreach($imgs as $key=>$img){
        if ($img->hasAttribute('data-obj-type')){
          $imgcrop = (int)$img->getAttribute('imgcrop');
          if($imgcrop == 0){
            $img_mid = (int)$img->getAttribute('imgfid');
            $media = \Drupal::entityTypeManager()->getStorage('media')->load($img_mid);
            if (is_object($media)) {
              if ($media->hasField('field_media_image')) {
                $file_fid = $media->field_media_image->target_id;
                $public_url = $this->saveFilesAsPublic($file_fid, 'reusable_content');
                $img->setAttribute('src',$public_url['rcb_style_image']);
                //$img->setAttribute('src',$public_url['original_url']);
              }
            }
          }
        }
      }
      $returnData['template_variable'] =  $data_variables;
      $returnData['updated_html'] =  $dom->saveHTML($dom->documentElement);
      return $returnData;
    }
  }
  /**
   * callback function saveFilesAsPublic()
   * to save the file as Public
   */
  public function saveFilesAsPublic($fid, $folder){
	  $returtData = [];
	  //$destdir = \Drupal::service('stream_wrapper_manager')->getViaUri('public://')->getUri();
	  $uid = \Drupal::currentUser()->id();
	  $destdir= "public://{$folder}/{$uid}";
	  \Drupal::service('file_system')->prepareDirectory($destdir, \Drupal\Core\File\FileSystemInterface::CREATE_DIRECTORY);
    $file = File::load($fid);
    if($file){
      $file_name = $file->getFilename();
      $file_path = $destdir . '/' . $file_name;
      if ($file = file_copy($file, $file_path, FILE_EXISTS_RENAME)) {
        if($file->type->getValue()[0]['target_id'] == "image"){
          $thumb_style = \Drupal::entityTypeManager()->getStorage('image_style')->load('90x90_media_vault_photo');
          $returtData['thumb_url'] = $thumb_style->buildUrl($file->getFileUri());
          $gallery_style = \Drupal::entityTypeManager()->getStorage('image_style')->load('online_gallery');
          $returtData['gallery_url'] = $gallery_style->buildUrl($file->getFileUri());
          //$original_style = \Drupal::entityTypeManager()->getStorage('image_style')->load('original_style');
          $returtData['original_url'] = file_create_url($file->getFileUri());
          if($folder == 'reusable_content'){
            $rcb_style = \Drupal::entityTypeManager()->getStorage('image_style')->load('rcb_image');
            $returtData['rcb_style_image'] = $rcb_style->buildUrl($file->getFileUri());
          }
        }
        elseif($file->type->getValue()[0]['target_id'] == "audio"){
          $returtData['original_url'] = file_create_url($file->getFileUri());
        }
      } else {
        die("Could not copy " . $file_path . " in " . $destdir);
      }
    }
		return $returtData;
  } 
   
  /**
   * callback function previewTemplate()
   * to save the new text file for web product
   */
  public function previewTemplate($tid){
    $uid = \Drupal::currentUser()->id();
    $user = User::load($uid);
    // template
    $query = \Drupal::database()->select('web_product_templates', 'wpt');
    $query->fields('wpt'); 
    $query->condition('wpt.id', $tid, '=');
    $template = $query->execute()->fetchObject();
    
    $template_html = \Drupal::service('km_product.templates')->getProductHTML($user, $template->template_base_html, $template->template_variables);
    
    $output = ['status' => 200, 'id' => $template->id, 'node_id' => $template->node_id, 'product_id' => $template->product_id, 'media_id' => $template->media_id, 'template_type' => $template->template_type, 'template_html' => $template_html, 'msg' => 'Preview successful!'];
    return new JsonResponse($output);
  }
  
  /**
   * Callback function editRenderWebProduct()
   * to get the user media kit list.
   **/
  public function editRenderWebProduct(){
    $uid = \Drupal::currentUser()->id();
    $render_id = \Drupal::request()->request->get('render_id');
    
    $data = array();
    // get default media kit
    $data['default_kit'] = \Drupal::service('km_product.templates')->getDefaultMediaKit($uid);
    // get media kits
    $query_media_kit = \Drupal::database()->select('node_field_data', 'n')
        ->fields('n', ['nid', 'title'])
        ->condition('n.uid', $uid, '=')->condition('n.type', 'media_kit', '=');
    $nids_media_kit = $query_media_kit->execute()
        ->fetchAll();
    $data['media_kit'] = $nids_media_kit;
    
    if($render_id > 0){
      $media = Media::load($render_id);
      if($media){
        $media_data = [];
        $media_data['name'] = $media->name->value;
        $media_data['achived'] = $media->field_archived->value;
        $media_data['copyright'] = $media->field_copyright_number->value;
        $media_data['favorite'] = $media->field_favorite->value;
        $media_data['description'] = $media->field_description_plain_text->value;
        $tags_name = '';
        if(!empty($media->field_keywords)){
          foreach ($media->get('field_keywords')->getValue() as $term_id){   
            if($term_id['target_id']){
              $tags_name .= \Drupal\taxonomy\Entity\Term::load($term_id['target_id'])->label() . ', ';
            }					 
          }
        }
        $media_data['tags'] = $tags_name;                
        //current used in mkit
        $mediaList = \Drupal::service('km_product.templates')->getallMediaByfile($media->mid->value, 'text');
        $media_data['used_mkit'] = $mediaList;
        $data['media_data'] = $media_data;
      }
    }
    
		return new JsonResponse($data);
  }
	/**
	 * Owner's HTML Articl list
	 * return JsonResponse
	 */
  public function get_user_html_articles(\Drupal\user\UserInterface $user){
    $uid = $user->get('uid')->value;
    $all_html_articles = array();
    $query = \Drupal::database()->select('node_field_data', 'article');
    $query->fields('article', ['nid', 'title']);
    $query->condition('article.type', 'html_article', '=');
    $query->condition('article.uid', $uid, '=');
    $query->orderBy('article.title', 'ASC');
    $result = $query->execute()->fetchAll();
    foreach($result as $key=>$node_data){
      $all_html_articles[$key]['nid'] = $node_data->nid;
      $all_html_articles[$key]['title'] = $node_data->title;
      $article = Node::load($node_data->nid);
      $paragraph = $article->field_html_article_images_ref->getValue();
      $all_html_articles[$key]['images'] = count($paragraph);
      $youtube = $article->field_youtube_embed->getValue();
      $all_html_articles[$key]['video'] = empty($youtube) ? 0 : 1;
      $favorite = $article->field_article_favorite->getValue();
      $all_html_articles[$key]['favorite'] = $favorite['0']['value'];
      $tags_name = '';
      if(!empty($media->field_keywords)){
        foreach ($article->get('field_keywords')->getValue() as $term_id){   
          if($term_id['target_id']){
            $tags_name .= \Drupal\taxonomy\Entity\Term::load($term_id['target_id'])->label() . ', ';
          }
        }
      }
      $all_html_articles[$key]['tags'] = $tags_name;
    }
    return new JsonResponse($all_html_articles);
  }
	/**
	 * Owner's Render HTML Articl list
	 * return JsonResponse
	 */
  public function get_user_render_html_articles(\Drupal\user\UserInterface $user){
    $uid = $user->get('uid')->value;
    $properties['name'] = 'Reusable Content Block';
    $terms = \Drupal::entityManager()->getStorage('taxonomy_term')->loadByProperties($properties);
    $term = reset($terms);
    $pid = !empty($term) ? $term->id() : 0;
    $all_html_articles = array();
    $utquery = \Drupal::database()->select('web_product_templates', 'wpt');
    $utquery->leftJoin('web_templates_favorite', 'wtf', "wtf.template_id = wpt.id AND wtf.user_id = $uid");
    $utquery->fields('wpt', ['id', 'product_id', 'media_id', 'name', 'description', 'template_group', 'preview_image', 'tags', 'created', 'modified', 'template_variables']);
    $utquery->addExpression("IF(wtf.is_favorite IS NULL, 0, wtf.is_favorite)", 'favorite');    
    $utquery->condition('wpt.user_id', $uid, '=');
    $utquery->condition('wpt.product_id', $pid, '=');
    //$utquery->condition('wpt.node_id', $nid, '=');
    $utquery->condition('wpt.template_type', 2, '=');
    $utquery->condition('wpt.template_status', 1, '=');
    $utquery->orderBy('wpt.modified', 'DESC');
    $user_templates = $utquery->execute()->fetchAll();
    foreach($user_templates as $key=>$value){
      $all_html_articles[$key]['nid'] = $value->id;
      $all_html_articles[$key]['title'] = $value->name;
      $counter_images = preg_match_all('/article-image-(\d+)/', $value->template_variables, $counter);
      $all_html_articles[$key]['images'] = $counter_images;
      $counter_video = preg_match_all('/rcb-youtube-embed/', $value->template_variables, $counter);
      $all_html_articles[$key]['video'] = $counter_video;
      $all_html_articles[$key]['favorite'] = $value->favorite;
      $tags_name = [];
      if(isset($value->media_id)){
        if($value->media_id != 0){
          $media = Media::load($value->media_id);
          if(!empty($media->field_keywords)){
            foreach ($media->get('field_keywords')->getValue() as $term_id){   
              if($term_id['target_id']){
                $tags_name[$term_id['target_id']] = \Drupal\taxonomy\Entity\Term::load($term_id['target_id'])->label() . ', ';
              }
            }
          }
        }
      }
      $all_html_articles[$key]['tags'] = implode(', ', $tags_name);
    }
    return new JsonResponse($all_html_articles);
  }
	/**
	 * Owner's HTML Articl list
	 * return JsonResponse
	 */
  public function get_user_html_article_node(NodeInterface $node){
    //Get added paragraph items
    $html_articles = array();
    $paragraph_items = array();
    $html_articles['nid'] = $node->get('nid')->value;
    $html_articles['title'] = $node->get('title')->value;
    $youtube = $node->field_youtube_embed->getValue();
    //print "<pre>";print_r($youtube);
    $html_articles['youtube'] = isset($youtube['0']['value']) ? $youtube['0']['value'] : "&nbsp;";
    $favorite = $node->field_article_favorite->getValue();
    $html_articles['favorite'] = isset($favorite['0']['value']) ? $favorite['0']['value'] : '';
    $story = $node->field_story->getValue();
    //print_r($story);
    $html_articles['story'] = isset($story['0']['value']) ? $story['0']['value'] : "&nbsp;";

    $paragraph = $node->field_html_article_images_ref->getValue();
    // Loop through the result set.
    foreach ( $paragraph as $key=>$element ) {
      $p = Paragraph::load( $element['target_id'] );
      $imageMedia = $p->field_html_article_image_ref->getValue();
      $mediaId = $imageMedia[0]['target_id'];
      $media = Media::load($mediaId);
      $uri = $media->field_media_image->entity->getFileUri();
      //$mediaImage = file_create_url($uri);
      //$rcb_style = \Drupal::entityTypeManager()->getStorage('image_style')->load('online_gallery');
      $rcb_style = \Drupal::entityTypeManager()->getStorage('image_style')->load('rcb_image');
      $mediaImage = $rcb_style->buildUrl($uri);
      $paragraph_items[$key]['imageMedia'] = $mediaImage;
      $paragraph_items[$key]['mediaId'] = $mediaId;
      $imageCaption = $p->field_image_caption->getValue();
      //$paragraph_items[$key]['imageMediaName'] = isset($imageCaption[0]['value']) ? $imageCaption[0]['value'] : $media->getName();
      $paragraph_items[$key]['imageMediaName'] = isset($imageCaption[0]['value']) ? $imageCaption[0]['value'] : "&nbsp;";
    }
    $html_articles['paragraph_items'] = $paragraph_items;
    //print_r($html_articles);exit;
    return new JsonResponse($html_articles);
  }
	/**
	 * Owner's HTML Article render
	 * return HTML
	 */
  public function get_user_html_article_render($template_id){
    $uid = \Drupal::currentUser()->id();
    $user = User::load($uid);
    // template
    $query = \Drupal::database()->select('web_product_templates', 'wpt');
    $query->fields('wpt'); 
    $query->condition('wpt.id', $template_id, '=');
    $template = $query->execute()->fetchObject();
    $product_name = \Drupal\taxonomy\Entity\Term::load($template->product_id)->get('name')->value;
    $product_group = $template->template_group;
    $returnData = $this->updateProductHtml($product_name , $product_group, $template->template_base_html, $template->template_variables);
    $file_content['article'] = \Drupal::service('km_product.templates')->getProductHTML($user, $returnData['updated_html'], json_encode($returnData['template_variable']));
    return new JsonResponse($file_content);
  }
	/**
	 * Owner's playlists list
	 * return JsonResponse
	 */
  public function get_user_km_playlists(\Drupal\user\UserInterface $user){
    $uid = $user->get('uid')->value;
    $properties['name'] = 'Playlist';
    $terms = \Drupal::entityManager()->getStorage('taxonomy_term')->loadByProperties($properties);
    $term = reset($terms);
    $pid = !empty($term) ? $term->id() : 0;
    $all_playlists = array();
    $utquery = \Drupal::database()->select('web_product_templates', 'wpt');
    $utquery->leftJoin('web_templates_favorite', 'wtf', "wtf.template_id = wpt.id AND wtf.user_id = $uid");
    $utquery->fields('wpt', ['id', 'product_id', 'media_id', 'name', 'description', 'template_group', 'preview_image', 'tags', 'created', 'modified', 'template_variables']);
    $utquery->addExpression("IF(wtf.is_favorite IS NULL, 0, wtf.is_favorite)", 'favorite');    
    $utquery->condition('wpt.user_id', $uid, '=');
    $utquery->condition('wpt.product_id', $pid, '=');
    $utquery->condition('wpt.template_type', 2, '=');
    $utquery->condition('wpt.template_status', 1, '=');
    $utquery->orderBy('wpt.modified', 'DESC');
    $user_templates = $utquery->execute()->fetchAll();
    foreach($user_templates as $key=>$value){
      $all_playlists[$key]['nid'] = $value->id;
      $all_playlists[$key]['title'] = $value->name;
      $counter_images = preg_match_all('/kmmedia-playlis-title(\d+)/', $value->template_variables, $counter);
      $all_playlists[$key]['playlist'] = $counter_images;
      $all_playlists[$key]['favorite'] = $value->favorite;
      $tags_name = [];
      if(isset($value->media_id)){
        if($value->media_id != 0){
          $media = Media::load($value->media_id);
          if(!empty($media->field_keywords)){
            foreach ($media->get('field_keywords')->getValue() as $term_id){   
              if($term_id['target_id']){
                $tags_name[$term_id['target_id']] = \Drupal\taxonomy\Entity\Term::load($term_id['target_id'])->label() . ', ';
              }
            }
          }
        }
      }
      $all_playlists[$key]['tags'] = implode(', ', $tags_name);
    }
    return new JsonResponse($all_playlists);
  }
	/**
	 * Owner's Online Gallery list
	 * return JsonResponse
	 */
  public function get_user_km_online_gallery(\Drupal\user\UserInterface $user){
    $uid = $user->get('uid')->value;
    $properties['name'] = 'Online Gallery';
    $terms = \Drupal::entityManager()->getStorage('taxonomy_term')->loadByProperties($properties);
    $term = reset($terms);
    $pid = !empty($term) ? $term->id() : 0;
    $all_online_gallery = array();
    $utquery = \Drupal::database()->select('web_product_templates', 'wpt');
    $utquery->leftJoin('web_templates_favorite', 'wtf', "wtf.template_id = wpt.id AND wtf.user_id = $uid");
    $utquery->fields('wpt', ['id', 'product_id', 'media_id', 'name', 'description', 'template_group', 'preview_image', 'tags', 'created', 'modified', 'template_variables']);
    $utquery->addExpression("IF(wtf.is_favorite IS NULL, 0, wtf.is_favorite)", 'favorite');    
    $utquery->condition('wpt.user_id', $uid, '=');
    $utquery->condition('wpt.product_id', $pid, '=');
    $utquery->condition('wpt.template_type', 2, '=');
    $utquery->condition('wpt.template_status', 1, '=');
    $utquery->orderBy('wpt.modified', 'DESC');
    $user_templates = $utquery->execute()->fetchAll();
    foreach($user_templates as $key=>$value){
      $all_online_gallery[$key]['nid'] = $value->id;
      $all_online_gallery[$key]['title'] = $value->name;
      $counter_images = preg_match_all('/km-gallery-image(\d+)/', $value->template_variables, $counter);
      $all_online_gallery[$key]['images'] = $counter_images;
      $all_online_gallery[$key]['favorite'] = $value->favorite;
      $tags_name = [];
      if(isset($value->media_id)){
        if($value->media_id != 0){
          $media = Media::load($value->media_id);
          if(!empty($media->field_keywords)){
            foreach ($media->get('field_keywords')->getValue() as $term_id){   
              if($term_id['target_id']){
                $tags_name[$term_id['target_id']] = \Drupal\taxonomy\Entity\Term::load($term_id['target_id'])->label() . ', ';
              }
            }
          }
        }
      }
      $all_online_gallery[$key]['tags'] = implode(', ', $tags_name);
    }
    return new JsonResponse($all_online_gallery);
  }
}

