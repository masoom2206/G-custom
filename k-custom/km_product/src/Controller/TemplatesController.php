<?php
/**
* @file
* Contains \Drupal\km_product\Controller\TemplatesController.php
*
*/
namespace Drupal\km_product\Controller;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\NodeInterface;
use Drupal\user\Entity\User;
use Drupal\image\Entity\ImageStyle;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;
use Drupal\taxonomy\Entity\Term;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\s3fs\S3fsService;

class TemplatesController extends ControllerBase {
  /**
   * Returns product templates page.
   */
  public function __construct() {
    $this->config = \Drupal::config('media_design_system.kmdsapisettings')->get();
    $this->apiurl = $this->config['access_check_api'];
  }
  
  /**
   * Returns authorize code.
   * https://www.drupal.org/node/1862446
   * @return $auth_code
   *   for getting authorize code.
   */
  public function getAuthCode(){
    $user = \Drupal::currentUser();
    $uid  = $user->id(); 
    $username = $user->getAccountName();
    $email = $user->getEmail();
    
    // get authorize code     
    $endpoint = $this->apiurl.'user_access_check';
    $options = [
      'headers' => [
        'Content-Type' => 'application/x-www-form-urlencoded',
      ],
      'form_params' => [
        'user_id' => $uid,
        'username' => $username,
        'email' => $email,
      ],
			'verify' => FALSE,
    ];
    
    try {
      $response = \Drupal::httpClient()->request('POST', $endpoint, $options);
      $status = $response->getStatusCode();
      if($status == 200){
        $auth_code = json_decode($response->getBody()->getContents());
        return $auth_code; 
      }         
    }
    catch (RequestException $e) {
      watchdog_exception('km_product', $e);
    }
    
    return false;
  }
  
  /**
   * Returns product templates.
   * https://www.drupal.org/node/1862446
   * @return array
   *   A simple renderable array.
   */
	public function getTemplates($product_type_id, $uid = 0){
    // get authorize code
    $auth_code = $this->getAuthCode();
    if(!empty($auth_code)){
      // KMDS Templates
      $endpoint = $this->apiurl."getfolder/{$product_type_id}/{$uid}";
      $options = [
       'headers' => [
          'Authorization' => "bearer $auth_code",
        ],
				'verify' => FALSE,
      ];
      
      // get templates
      try {
        $response = \Drupal::httpClient()->request('GET', $endpoint, $options);
        $status = $response->getStatusCode();
        if($status == 200){
          $data = json_decode($response->getBody()->getContents());
          return $data; 
        }         
      }
      catch (RequestException $e) {
        watchdog_exception('km_product', $e);
      }
    }    

    return false;
	}
  /**
   * Returns product templates.
   * https://www.drupal.org/node/1862446
   * @return array
   *   A simple renderable array.
   */
	public function getUserTemplates($kaboodles_id, $product_type_id){
    // get authorize code
    $auth_code = $this->getAuthCode();
    if(!empty($auth_code)){
      //$endpoint = $this->apiurl."productgetfolder/{$product_type_id}/{$uid}";
      $endpoint = $this->apiurl."getkaboodles/{$kaboodles_id}/{$product_type_id}";
      $options = [
       'headers' => [
          'Authorization' => "bearer $auth_code",
        ],
				'verify' => FALSE,
      ];
      // get templates
      try {
        $response = \Drupal::httpClient()->request('GET', $endpoint, $options);
        $status = $response->getStatusCode();
        if($status == 200){
          $data = json_decode($response->getBody()->getContents());
          return $data; 
        }         
      }
      catch (RequestException $e) {
        watchdog_exception('km_product', $e);
      }
    }    

    return false;
	}
  
  /**
   * Returns all products of user.
   * https://www.drupal.org/node/1862446
   * @return array
   *   A simple renderable array.
   */
	public function getUserProducts($uid){
    // get authorize code
    $auth_code = $this->getAuthCode();
    if(!empty($auth_code)){
      $endpoint = $this->apiurl."productgetfolder/{$uid}";
      $options = [
       'headers' => [
          'Authorization' => "bearer $auth_code",
        ],
				'verify' => FALSE,
      ];
      // get templates
      try {
        $response = \Drupal::httpClient()->request('GET', $endpoint, $options);
        $status = $response->getStatusCode();
        if($status == 200){
          $data = json_decode($response->getBody()->getContents());
          return $data; 
        }         
      }
      catch (RequestException $e) {
        watchdog_exception('km_product_all', $e);
      }
    }    

    return false;
	}
  
  /**
   * Returns product template detail.
   * https://www.drupal.org/node/1862446
   * @return array
   *   A simple renderable array.
   */
	public function getTemplateDetail($template_id){
    // get authorize code
    $id = $template_id;
    $auth_code = $this->getAuthCode();
    if(!empty($auth_code)){
      if(isset($_GET['kmproduct'])){
        $endpoint = $this->apiurl."product/{$template_id}";
        $options = [
         'headers' => [
            'Authorization' => "bearer $auth_code",
          ],
          'verify' => FALSE,
        ];
        $response = \Drupal::httpClient()->request('GET', $endpoint, $options);
        $status = $response->getStatusCode();
        if($status == 200){
          $data = json_decode($response->getBody()->getContents());
          $id = $data->parent;
        }
      }
      $endpoint = $this->apiurl."design/{$id}";
      $options = [
       'headers' => [
          'Authorization' => "bearer $auth_code",
        ],
				'verify' => FALSE,
      ];
      
      // get templates
      try {
        $response = \Drupal::httpClient()->request('GET', $endpoint, $options);
        $status = $response->getStatusCode();
        if($status == 200){
          $data = json_decode($response->getBody()->getContents());
          return $data;
        }
      }
      catch (RequestException $e) {
        watchdog_exception('km_product', $e);
      }
    }    

    return false;
	}
  
  /**
   * Returns product template detail.
   * https://www.drupal.org/node/1862446
   * @return array
   *   A simple renderable array.
   */
	public function getProductTemplateDetail($template_id){
    // get authorize code
    $auth_code = $this->getAuthCode();
    if(!empty($auth_code)){
      $endpoint = $this->apiurl."product/{$template_id}";
      $options = [
       'headers' => [
          'Authorization' => "bearer $auth_code",
        ],
				'verify' => FALSE,
      ];
      
      // get templates
      try {
        $response = \Drupal::httpClient()->request('GET', $endpoint, $options);
        $status = $response->getStatusCode();
        if($status == 200){
          $data = json_decode($response->getBody()->getContents());
          return $data; 
        }         
      }
      catch (RequestException $e) {
        watchdog_exception('km_product', $e);
      }
    }    

    return false;
	}
  
  /**
   * Returns product template detail.
   * https://www.drupal.org/node/1862446
   * @return array
   *   A simple renderable array.
   */
	public function getTemplateJson($template_id){
    // get authorize code
    $auth_code = $this->getAuthCode();
    if(!empty($auth_code)){
      $endpoint = $this->apiurl."designjson/{$template_id}";
      $options = [
       'headers' => [
          'Authorization' => "bearer $auth_code",
        ],
				'verify' => FALSE,
      ];
      
      // get templates
      try {
        $response = \Drupal::httpClient()->request('GET', $endpoint, $options);
        $status = $response->getStatusCode();
        if($status == 200){
          $data = json_decode($response->getBody()->getContents());
          return $data; 
        }         
      }
      catch (RequestException $e) {
        watchdog_exception('km_product', $e);
      }
    }    

    return false;
	}
  
  /**
   * Returns product template detail.
   * https://www.drupal.org/node/1862446
   * @return array
   *   A simple renderable array.
   */
	public function updateProductTemplate($template_id, $params){
    // get authorize code
    $auth_code = $this->getAuthCode();
    if(!empty($auth_code)){     
      $endpoint = $this->apiurl."product/".$template_id;     
      $options = [
        'verify' => false,
        'form_params' => $params,
        'headers' => [
          'Authorization' => "bearer $auth_code",
          "Content-Type"  => "application/x-www-form-urlencoded",
        ],
      ];
      
      // get templates
      try {
        $response = \Drupal::httpClient()->request('PUT', $endpoint, $options);
        return $response->getStatusCode();         
      }
      catch (RequestException $e) {
        watchdog_exception('km_product', $e);
      }
    }    

    return false;
	}
  
  /**
   * Returns product template detail.
   * https://www.drupal.org/node/1862446
   * @return array
   *   A simple renderable array.
   */
	public function updateTemplate($template_id, $params){
    // get authorize code
    $auth_code = $this->getAuthCode();
    if(!empty($auth_code)){
      $endpoint = $this->apiurl."design/".$template_id;          
      $options = [
       'verify' => false,
       'form_params' => $params,
       'headers' => [
          'Authorization' => "bearer $auth_code",
          "Content-Type"  => "application/x-www-form-urlencoded",
        ],
      ];
      
      // get templates
      try {
        $response = \Drupal::httpClient()->request('PUT', $endpoint, $options);
        return $response->getStatusCode();         
      }
      catch (RequestException $e) {
        watchdog_exception('km_product', $e);
      }
    }    

    return false;
	}
  
  
  /**
   * Returns social media links.
   * @return array
   *   A simple renderable array.
   */
	public function getSocialMediaLinks($uid = NULL){
    $uid = empty($uid) ? \Drupal::currentUser()->id() : $uid;
    
    $query = \Drupal::database()->select('user__field_social_media_link', 'usn');
    $query->innerJoin('paragraph__field_social_network', 'psn', 'psn.entity_id = usn.field_social_media_link_target_id'); 
    $query->innerJoin('paragraph__field_link_url', 'url', 'url.entity_id = psn.entity_id AND url.bundle = psn.bundle');
    $query->innerJoin('taxonomy_term_field_data', 'tsn', "tsn.tid = psn.field_social_network_target_id");
    $query->innerJoin('taxonomy_term__field_icon', 'icon', "icon.entity_id = psn.field_social_network_target_id");
    $query->innerJoin('file_managed', 'file', "file.fid = icon.field_icon_target_id");
    $query->fields('tsn', ['tid', 'name']);
    $query->fields('url', ['field_link_url_value']);
    $query->fields('file', ['uri']);
    $query->condition('usn.entity_id', $uid, '=');
    $query->condition('psn.bundle', 'social_media_link', '=');
    $social_media_links = $query->execute()->fetchAll();
    
    foreach($social_media_links as $k => $social_media_link){
      $social_media_links[$k]->url = file_create_url($social_media_link->uri);
    }
    
    return $social_media_links;
	}
  
  
  /**
   * Returns social media links.
   * @return array
   *   A simple renderable array.
   */
	public function getPersonalInfo($user) {
    $data = [];
    // personal info
    $paddress = $user->field_address->getValue();
    //echo '<pre>'; print_r($paddress); echo '</pre>';
    $organization = '';
    $address = [];
    if(!empty($paddress)){
      $organization = $paddress[0]['organization'];
      if(!empty($paddress[0]['address_line1'])){
        $address[]  = $paddress[0]['address_line1'];
      }
      if(!empty($paddress[0]['locality'])){
        $address[]  = $paddress[0]['locality'];
      }
      if(!empty($paddress[0]['administrative_area'])){
        $address[]  = $paddress[0]['administrative_area'];
      }
      /*
      if(!empty($paddress[0]['country_code'])){
        $address[]  = $paddress[0]['country_code'];
      }*/
      if(!empty($paddress[0]['postal_code'])){
        $address[]  = $paddress[0]['postal_code'];
      }
    }
    // name or business
    $preferred_name = $user->get('field_preferred_first_name')->value;
    $first_name = $user->get('field_first_name')->value;
    $last_name = $user->get('field_last_name')->value;
    $data['name'] = empty($preferred_name) ? $first_name. ' ' .$last_name : $preferred_name. ' ' .$last_name;
    //$data['name_or_business'] = empty($organization) ? $user->get('field_first_name')->value. ' ' .$user->get('field_last_name')->value : $organization;
    $data['name_or_business'] = empty($organization) ? 'N/A' : $organization;
    // address
    if(!empty($address)){
      $data['address'] = implode(', ', $address);
    }
    // email
    if(!empty($user->get('mail')->value)){
      $data['email'] = 'Email: <a href="mailto:'.$user->get('mail')->value.'">'.$user->get('mail')->value.'</a>'; 
    }
    // website
    if(!empty($user->get('field_website')->value)){
      $website = $user->get('field_website')->value;
      if(!preg_match('#^http(s)?://#', $website)) {
        $data['website'] = '<a href="http://'.$website.'">'.$website.'</a>';
      }else{
        $data['website'] = '<a href="'.$website.'">'.$website.'</a>';
      }
    }
 
    //echo '<pre>'; print_r($data); echo '</pre>';
    // personal info
    $personal_info = implode('<br>', $data);
    
    return $personal_info; 
	}
  
  /**
   * Returns social media links.
   * @return array
   *   A simple renderable array.
   */
	public function updateTemplateVariables($template_variables, $product_id) {
    $uid = \Drupal::currentUser()->id();
    $dom = new \DOMDocument;
    $template_variables = json_decode($template_variables);
    foreach($template_variables as $token => $value) {
      if(preg_match( '@src="([^"]+)"@' , $value, $match )) {
        $imgsrc = array_pop($match);
        if (preg_match('/data:([^;]*);base64,(.*)/i', $imgsrc, $matches)) {
          $mime_type = explode(';', $imgsrc)[0];
          $extension = explode('/', $mime_type)[1];
          $dom->loadHTML($value, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
          foreach ($dom->getElementsByTagName('img') as $img) {
            $datasrc = $img->getAttribute('src');
            // new file path at S3 bucket
            $filename = 'wpimg-' . $product_id . '-' . rand(100, 999) . '-' . time() . '.' . $extension;
            $new_file = "public://user-files/{$uid}/web/images/{$filename}";
            // convert base64 image data into image file at S3 bucket
            $data_raw = explode(',', $datasrc);
            if(isset($data_raw[1])) {
              $base64_data = base64_decode($data_raw[1]);
              file_put_contents($new_file, $base64_data);
              $output_file = file_create_url($new_file);
              $img->setAttribute('src', $output_file);
              $template_variables->$token = $dom->saveHTML();
            }
          }
        }
      }
    }
    
    $template_variables = json_encode($template_variables);
    return $template_variables;
  }
  
  
  /**
   * Returns social media links.
   * @return array
   *   A simple renderable array.
   */
	public function getProductHTML($user, $template_base_html, $template_variables) {
    global $base_secure_url;
    $template_html = '';
    // user's social network links
    $sm_links = $this->getSocialMediaLinks();
    $social_media_links = '';
    foreach($sm_links as $sm_link){
      $social_media_links .= '<a href="'.$sm_link->field_link_url_value.'" style="padding:5px;"><img src="'.$sm_link->url.'" style="height:32px;"></a>'; 
    }
    // user's personal info
    $personal_info = $this->getPersonalInfo($user); 
    
    
    if(!empty($template_variables)){
      $template_variables = json_decode($template_variables);
      //print "<pre>";print_r($template_variables);
      if(!empty($template_variables)) {
        $tokens = [];
        $token_values = [];
        foreach($template_variables as $token => $value) {
          $tokens[] = "/\[token:{$token}\]/is";
          
          switch($token) {
            case 'personal_info':
              $token_values[] = $personal_info;
            break;
            
            case 'social_icons':
              $token_values[] = $social_media_links;
            break;
            
            default:
              // set complete site URL to image
              if(stripos($value, 'kaboodlemedia.com') === false){
                $value = str_ireplace('/wptemplates/images/', $base_secure_url.'/wptemplates/images/', $value);  
              }
              $token_values[] = $value;
          }
        }
        $template_html = trim(preg_replace($tokens, $token_values, $template_base_html));
        /*
        // set crossOrigin true
        $dom = new \DOMDocument;
        $dom->loadHTML($template_html, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        foreach ($dom->getElementsByTagName('img') as $img) {
          //$img->setAttribute('crossOrigin', true);
        }
        $template_html = $dom->saveHTML();
        */
      }
    }
    
    return $template_html;
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
	 * Get all media by file type
	 * @return array
	 */
  public function getallMediaByfile($mid, $type){
    if($type == 'audio') {
      $medialist = \Drupal::database()->select('node_field_data', 'n');
      $medialist->leftJoin('node__field_vault_audio', 'a', "n.nid = a.entity_id");
      $medialist->condition('a.field_vault_audio_target_id', $mid, '=');
      $medialist->condition('a.bundle', 'media_kit', '=');
      $medialist->fields('n', ['nid','uid','title']);
      $result = $medialist->execute()->fetchAll();
    }  
    if($type == 'image') {   
      $medialist = \Drupal::database()->select('node_field_data', 'n');
      $medialist->leftJoin('node__field_vault_photo', 'p', "n.nid = p.entity_id");
      $medialist->condition('p.field_vault_photo_target_id', $mid, '=');
      $medialist->condition('p.bundle', 'media_kit', '=');
      $medialist->fields('n', ['nid','uid','title']);
      $result = $medialist->execute()->fetchAll();
    }
    if($type == 'text') {
      $medialist = \Drupal::database()->select('node_field_data', 'n');
      $medialist->leftJoin('node__field_vault_file', 't', "n.nid = t.entity_id");
      $medialist->condition('t.field_vault_file_target_id', $mid, '=');
      $medialist->condition('t.bundle', 'media_kit', '=');
      $medialist->fields('n', ['nid','uid','title']);
      $result = $medialist->execute()->fetchAll();
    }
    if($type == 'video') {
      $medialist = \Drupal::database()->select('node_field_data', 'n');
      $medialist->leftJoin('node__field_vault_video', 'v', "n.nid = v.entity_id");
      $medialist->condition('v.field_vault_video_target_id', $mid, '=');
      $medialist->condition('v.bundle', 'media_kit', '=');
      $medialist->fields('n', ['nid','uid','title']);
      $result = $medialist->execute()->fetchAll();
    }
    
    return $result;
  }
  
  
  /*
   * @file
   * Kaboodle product template navigation
  */
  public function getLeftNavigation(NodeInterface $node) {
    $account = \Drupal::currentUser();
    $roles = $account->getRoles();
    $nid = $node->id();
    // product icons
    $config = \Drupal::config('s3fs.settings')->get();
    $s3 = \Drupal::service('s3fs')->getAmazonS3Client($config);
    $key = 'images/icon/pps';
    $product_status_icon = $s3->getObjectUrl($config['bucket'], $key).'/arrow-alt-square-right.png';
    
    $data = [];
    $data['node'] = ['nid' => $nid, 'title' => $node->get('title')->value];

    // user detail
    $uid = $node->getOwnerId();
    $kaboodle_owner_view = false;
    $kaboodle_member_view = true;
    if(\Drupal::currentUser()->id() == $uid){
      $kaboodle_owner_view = true;
      $kaboodle_member_view = false;
    }
    $user_data = user_load($uid);
    $user = [];
    $user['uid'] = $uid;
    $user['name'] = $user_data->get('field_first_name')->value.' '.$user_data->get('field_last_name')->value;
    $user['kaboodle_owner_view'] = $kaboodle_owner_view;
    $style = ImageStyle::load('image_110x100');
    if (!$user_data->user_picture->isEmpty()) {
      $avatar = $style->buildUrl($user_data->user_picture->entity->getFileUri());
    }else{  
      $field_info = \Drupal\field\Entity\FieldConfig::loadByName('user', 'user', 'user_picture');
      $image_uuid = $field_info->getSetting('default_image')['uuid'];
      $default_image = \Drupal::service('entity.repository')->loadEntityByUuid('file', $image_uuid)->getFileUri();
      $avatar = $style->buildUrl($default_image);
    }
    // Get URL
    $user['profile_url'] = $avatar;
    $professionalUser = 0;
    if(in_array('content_creator', $roles) && !in_array('advanced_content_creator', $roles)){
      $professionalUser = 1;
    }
    $user['professional_user'] = $professionalUser;
    $data['user'] = $user;
    // links 
    $links = [];
    $links[0]['title']  = t('My Kaboodles');
    $links[0]['link']   = '/tools/my-kaboodles/'.$uid;
    $links[3]['title'] = t('Video Maker');
    $links[3]['link'] = '/tools/video/'.$uid;
    
    $links2 = [];
    $links2[0]['title'] = t('Notifications');
    $links2[0]['link'] = '/tools/notifications/'.$uid;
    if($kaboodle_owner_view == true){
      $links2[1]['title'] = t('Settings');
      $links2[1]['link'] = '/tools/kaboodle/'.$nid;
    }
    
    $data['nav']['product_status_icon'] = $product_status_icon;
    $data['nav']['links'] = $links;
    $data['nav']['links2'] = $links2;
    $data['nav']['products'] = $this->getProductTypes($uid, $nid, $product_status_icon);
 
    return $data;
  }
  
  /**
   * Callback function getProductTypes()
   * for kaboodle pps
   **/
  public function getProductTypes($uid, $nid, $product_status_icon){
    // product type
    $vocabulary_name = 'product_type';
    $query = \Drupal::entityQuery('taxonomy_term');
    $query->condition('vid', $vocabulary_name);
    $query->sort('weight');
    $tids = $query->execute();    
    $terms = Term::loadMultiple($tids);
    
    $products = [];
    $pps = $this->getKaboodlePPS();
    $x = 137;
    foreach ($terms as $term) {
      if($term->get('field_status')->getValue()[0]['value'] == 1){
      //Active Cell
      $ActiveCell = $term->get('field_tile_cell_active')->getValue();
      $ActiveCellFile = File::load($ActiveCell[0]['target_id']);
      $ActiveCellFileUrl = file_create_url($ActiveCellFile->getFileUri());
      //get Override Path value
      $path_override  = $term->get('field_override_path')->getValue();
      // You need to use the target_id to access to the value.
      $ProductGroup = $term->get('field_product_group')->target_id;
      $status = $term->get('field_status')->value;
      $ProductGroupTerm = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($ProductGroup);
      $ProductGroupTermName = $ProductGroupTerm->getName();
      // modify URL if required
      $product_name = strtolower(preg_replace('/[^a-z0-9-]/i', '', $term->getName()));
      switch($product_name){
        case 'htmlarticle':
          $product_url = Url::fromRoute('product.article.list', ['user' => $uid])->toString();
        break;    

        default:
          $product_url = Url::fromRoute('product.template', ['node' => $nid, 'producttype' => $term->id(), 'view' => 'grid'])->toString();
      }
      
      if($x > 140){$x = 137;}
      $products[] = array(
        'tid' => $term->id(),
        'name' => $term->getName(),
        'url' => $product_url,
        'ActiveCellFileUrl' => $ActiveCellFileUrl,
        'ProductGroupTermName' => $ProductGroupTermName,
        'description' => $term->getDescription(),
        'status' => $status,
        'service_id' => $uid.'.'.$nid.'.'.'xx',
        'product_status_icon' => $product_status_icon,
        'path_override'  => $term->get('field_override_path')->getValue(),
        'pps_status' => $pps[$x]['name'],
        'pps_status_icon' => $pps[$x]['IconFileUrl'],
      );
      $x++;
      }
    }
    return $products;
  }
  
  /**
   * Callback function getKaboodlePPS()
   * for kaboodle pps
   **/
  public function getKaboodlePPS(){
    $vocabulary_name = 'product_processing_status';
    $query = \Drupal::entityQuery('taxonomy_term');
    $query->condition('vid', $vocabulary_name);
    $query->sort('weight');
    $tids = $query->execute();
    $terms = Term::loadMultiple($tids);
    $pps = array();
    foreach ($terms as $term) {
      //Active Icon
      $Icon = $term->get('field_icon')->getValue();
      $IconFile = File::load($Icon[0]['target_id']);
      $IconFileUrl = file_create_url($IconFile->getFileUri());
      $term_id = $term->id();
      $pps[$term_id] = array(
        'tid' => $term_id,
        'name' => $term->getName(),
        'IconFileUrl' => $IconFileUrl,
      );
    }
    return $pps;
  }

}

