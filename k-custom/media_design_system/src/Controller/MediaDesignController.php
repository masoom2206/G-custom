<?php
 
/**
* @file
* Contains \Drupal\media_design_system\Controller\MediaDesignController.php
*
*/
 
namespace Drupal\media_design_system\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\Session\AccountInterface;
use Drupal\user\Entity\User;
use Drupal\taxonomy\TermInterface;
use Drupal\taxonomy\Entity\Term;
use Drupal\Core\Access\AccessResult;

class MediaDesignController extends ControllerBase {
  
  /**
   * Returns a KMDS product list page.
   *
   * @return array
   *   A simple renderable array.
   */
	public function products(int $use_in_kmds, AccountInterface $user, int $media_term){
    global $base_secure_url;
    $me = \Drupal::currentUser();
    $uid = \Drupal::currentUser()->id();
    $my_roles = $me->getRoles();
    $user_id = $user->get('uid')->value;
    if (!empty($user_id) && in_array('administrator', $my_roles)) {
      $uid = $user_id;
    }
    $media_term_name = 'N/A';
    if(!empty($media_term) && $media_term != 0){
      $media_term_detail = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($media_term);
      $media_term_name = $media_term_detail->getName();
    }
    $render_data = array();
    $render_data['theme_data'] = array(
      '#theme' => 'product_list_template',         
      '#attached' => [
        'library' =>  [
          'media_design_system/react.min',
          'media_design_system/react.dom.min',
          'media_design_system/axios',
          'media_design_system/kmds_design',
          'media_design_system/global',
        ],
      ],
    );
    $render_data['theme_data']['#attached']['drupalSettings']['media_base_url'] = $base_secure_url;
    $render_data['theme_data']['#attached']['drupalSettings']['use_in_kmds'] = $use_in_kmds;
    $render_data['theme_data']['#attached']['drupalSettings']['media_term'] = $media_term;
    $render_data['theme_data']['#attached']['drupalSettings']['media_term_name'] = $media_term_name;
    $render_data['theme_data']['#attached']['drupalSettings']['uid'] = $uid;
    return $render_data;
	}

  /**
   * Returns a KMDS product list page.
   *
   * @return array
   *   A simple renderable array.
   */
	public function groupProducts(int $use_in_kmds, AccountInterface $user, int $media_term){
    global $base_secure_url;
    $me = \Drupal::currentUser();
    $uid = \Drupal::currentUser()->id();
    $my_roles = $me->getRoles();
    $user_id = $user->get('uid')->value;
    if (!empty($user_id) && in_array('administrator', $my_roles)) {
      $uid = $user_id;
    }
    $media_term_name = 'N/A';
    if(!empty($media_term) && $media_term != 0){
      $media_term_detail = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($media_term);
      $media_term_name = $media_term_detail->getName();
    }
    $render_data = array();
    $render_data['theme_data'] = array(
      '#theme' => 'product_list_template',         
      '#attached' => [
        'library' =>  [
          'media_design_system/react.min',
          'media_design_system/react.dom.min',
          'media_design_system/axios',
          'media_design_system/kmds_design',
          'media_design_system/global',
        ],
      ],
    );
    $render_data['theme_data']['#attached']['drupalSettings']['media_base_url'] = $base_secure_url;
    $render_data['theme_data']['#attached']['drupalSettings']['use_in_kmds'] = $use_in_kmds;
    $render_data['theme_data']['#attached']['drupalSettings']['media_term'] = $media_term;
    $render_data['theme_data']['#attached']['drupalSettings']['media_term_name'] = $media_term_name;
    $render_data['theme_data']['#attached']['drupalSettings']['uid'] = $uid;
    return $render_data;
	}
  
  /**
   * Returns a KMDS design tool to create new design.
   *
   * @return array
   *   A simple renderable array.
   */
	public function createDesign(){
    global $base_secure_url;
    $uid = \Drupal::currentUser()->id();
		$user = User::load($uid);
		$name = $user->get('name')->value;
		$email = $user->get('mail')->value;
		$roles = $user->getRoles();
		$adminRole = (in_array('administrator', $roles)) ? 'administrator' : '';
		if (!$user->user_picture->isEmpty()) {
      $avatar = file_create_url($user->user_picture->entity->getFileUri());
    }else{
      $avatar = 'https://s3.us-west-2.amazonaws.com/kaboodlemedia.com/s3fs_public/styles/thumbnail/public/default_images/default_person_picture.jpg';    
    }
    $render_data = array();
    $render_data['theme_data'] = array(
      '#theme' => 'kmds_design_tool_template',         
      '#attached' => [
        'library' =>  [
          'media_design_system/kmds_design_tool',
          'media_design_system/bootstrap_cdn',
          'media_design_system/konva'
        ],
      ],
    );
    $render_data['theme_data']['#attached']['drupalSettings']['media_base_url'] = $base_secure_url;
    $render_data['theme_data']['#attached']['drupalSettings']['uid'] = $uid;
    $render_data['theme_data']['#attached']['drupalSettings']['name'] = $name;
    $render_data['theme_data']['#attached']['drupalSettings']['email'] = $email;
    $render_data['theme_data']['#attached']['drupalSettings']['adminRole'] = $adminRole;
    $render_data['theme_data']['#attached']['drupalSettings']['avatar'] = $avatar;
    
    return $render_data;
	}
	/*
   * Callback function ()
   * to return user at design toolx page.
   */
	public function redirectToDesignx($design_id){
		$redirectpath = '/kmds/design/toolx?d='.$design_id;
		return new RedirectResponse($redirectpath);
  }
  /**
   * Returns a KMDS design tool to create new design.
   *
   * @return array
   *   A simple renderable array.
   */
	public function createDesignx(){
    global $base_secure_url;
    $uid = \Drupal::currentUser()->id();
		$user = User::load($uid);
		$name = $user->get('name')->value;
		$email = $user->get('mail')->value;
		$roles = $user->getRoles();
		$config = \Drupal::config('media_design_system.kmdsapisettings')->get();
		$access_check_api = $config['access_check_api'];
		//$api_key = $this->kmdsAccessToken();
		$api_key = \Drupal::service('km_product.templates')->getAuthCode();
		$adminRole = (in_array('administrator', $roles)) ? 'administrator' : '';
		if (!$user->user_picture->isEmpty()) {
      $avatar = file_create_url($user->user_picture->entity->getFileUri());
    }else{
      $avatar = 'https://s3.us-west-2.amazonaws.com/kaboodlemedia.com/s3fs_public/styles/thumbnail/public/default_images/default_person_picture.jpg';    
    }
    // default media kit
    $default_media_kit_id = $this->getDefaultMediaKit($uid);
    // default media vault
    $media_vault_id = $this->getDefaultMediaVault($uid);
    $render_data = array();
    $render_data['theme_data'] = array(
      '#theme' => 'kmds_design_tool_templatex',         
      '#attached' => [
        'library' =>  [
          'media_design_system/fabric',
          'media_design_system/bootstrap_cdn',
          'media_design_system/colorPicker',
          'media_design_system/kmds_design_toolx',
         // 'media_design_system/kmds_ruler'
        ],
      ],
    );
    $render_data['theme_data']['#attached']['drupalSettings']['media_base_url'] = $base_secure_url;
    $render_data['theme_data']['#attached']['drupalSettings']['access_check_api'] = $access_check_api;
    $render_data['theme_data']['#attached']['drupalSettings']['api_key'] = $api_key;
    $render_data['theme_data']['#attached']['drupalSettings']['uid'] = $uid;
    $render_data['theme_data']['#attached']['drupalSettings']['name'] = $name;
    $render_data['theme_data']['#attached']['drupalSettings']['email'] = $email;
		$render_data['theme_data']['#attached']['drupalSettings']['adminRole'] = $adminRole;
    $render_data['theme_data']['#attached']['drupalSettings']['avatar'] = $avatar;
    $render_data['theme_data']['#attached']['drupalSettings']['media_vault_id'] = $media_vault_id;
    $render_data['theme_data']['#attached']['drupalSettings']['default_media_kit_id'] = $default_media_kit_id;

    return $render_data;
	}
  /**
   * Returns a KMDS product library page.
   *
   * @return array
   *   A simple renderable array.
   */
	public function productLibrary(AccountInterface $user, int $media_term, TermInterface $taxonomy_term){
    global $base_secure_url;
    $me = \Drupal::currentUser();
    $uid = \Drupal::currentUser()->id();
    $my_roles = $me->getRoles();
    $user_roles = implode(',', $my_roles);
    $user_id = $user->get('uid')->value;
		$config = \Drupal::config('media_design_system.kmdsapisettings')->get();
		$access_check_api = $config['access_check_api'];
		//$api_key = $this->kmdsAccessToken();
		$api_key = \Drupal::service('km_product.templates')->getAuthCode();
    if (!empty($user_id) && in_array('administrator', $my_roles)) {
      $uid = $user_id;
    }
    $term = \Drupal::routeMatch()->getParameter('taxonomy_term');   
    $render_data = array();    
    $render_data['theme_data'] = array(
      '#theme' => 'product_library_template',
      '#attached' => [
        'library' =>  [
          'media_design_system/react.min',
          'media_design_system/react.dom.min',
          'media_design_system/axios',
          'media_design_system/kmds_library',
          'media_design_system/global',
        ],
      ],
    );
    $render_data['theme_data']['#attached']['drupalSettings']['media_base_url'] = $base_secure_url;
    $render_data['theme_data']['#attached']['drupalSettings']['access_check_api'] = $access_check_api;
    $render_data['theme_data']['#attached']['drupalSettings']['api_key'] = $api_key;
    $render_data['theme_data']['#attached']['drupalSettings']['uid'] = $uid;
    $render_data['theme_data']['#attached']['drupalSettings']['user_roles'] = $user_roles;
    $render_data['theme_data']['#attached']['drupalSettings']['media_term'] = $media_term;
    $render_data['theme_data']['#attached']['drupalSettings']['tid'] = $term->get('tid')->value;
    return $render_data;
	}
  
  /**
   * Route title callback.
   *
   * @param \Drupal\taxonomy\TermInterface $taxonomy_term
   *   The taxonomy term.
   *
   * @return array
   *   The term label as a render array.
   */
  public function getTitle(TermInterface $taxonomy_term) {
    return ['#markup' => $taxonomy_term->getName() . ' Library', '#allowed_tags' => \Drupal\Component\Utility\Xss::getHtmlTagList()];
  }
  
  /*
   * Route product group callback.
   * return JSON response of product group vocabulary
  **/
  public function getAllProductgroups () {
    $data = \Drupal::database()->select('taxonomy_term_field_data', 't');
    $data->leftJoin('taxonomy_term__field_use_in_kmds', 'kmds', "t.tid = kmds.entity_id");
    $data->condition('t.vid', 'product_group', '=');
    $data->condition('kmds.field_use_in_kmds_value', 1, '=');
    $data->fields('t', ['tid','name']);
    $data->fields('kmds', ['field_use_in_kmds_value']);
    $active_terms = $data->execute()->fetchAll();

    $response = $active_terms;
    
    return new JsonResponse($response);
  }
  
  /*
   * Route product group callback.
   * return JSON response of product group vocabulary
  **/
  public function getTermdata ($tid) {
    $data = \Drupal::database()->select('taxonomy_term_field_data', 't');
    $data->leftJoin('taxonomy_term__field_icon', 'ic', "t.tid = ic.entity_id");
    $data->leftJoin('taxonomy_term__field_active_', 'ac', "t.tid = ac.entity_id");
    $data->condition('t.tid', $tid, '=');
    $data->fields('t', ['tid','name']);
    $data->fields('ic', ['field_icon_target_id']);
    $data->fields('ac', ['field_active__target_id']);
    $result = $data->execute()->fetchAll();
    foreach ($result as $term) {
      $fid = $term->field_icon_target_id;
      $active_icon_fid = $term->field_active__target_id;
      if(!empty($fid)) {
        $file = \Drupal\file\Entity\File::load($fid);
        $image_uri = $file->getFileUri();
        $style = \Drupal\image\Entity\ImageStyle::load('media_library');
        // Get URI.
        $uri = $style->buildUri($image_uri);
        // Get URL.
        $url = $style->buildUrl($image_uri);
      }
      $active_url = 'null';
      if(!empty($active_icon_fid)) {
        $activefile = \Drupal\file\Entity\File::load($active_icon_fid);
        $active_image_uri = $activefile->getFileUri();
        $active_style = \Drupal\image\Entity\ImageStyle::load('media_library');
        // Get URI.
        $active_uri = $active_style->buildUri($active_image_uri);
        // Get URL.
        $active_url = $active_style->buildUrl($active_image_uri);
      }   
      $fresult[] = [
        'tid' => $term->tid,
        'name' => $term->name,
        'icon' => $url,
        'activeicon' => $active_url,
      ];
    }

    $response = $fresult;
    
    return new JsonResponse($response);
  }

  /*
   * Route product group callback.
   * return JSON response of product group vocabulary
  **/
  public function getTokenData() {
    $data = \Drupal::database()->select('taxonomy_term_field_data', 't');
    if($_GET['vid'] == 'kmds_token'){
      $data->leftJoin('taxonomy_term__field_machine_field', 'mf', "t.tid = mf.entity_id");
      $data->leftJoin('taxonomy_term__field_token', 'ft', "t.tid = ft.entity_id");
    }
    else if($_GET['vid'] == 'branding_css'){
      $data->leftJoin('taxonomy_term__field_style_type', 'st', "t.tid = st.entity_id");
      $data->condition('st.field_style_type_value', array('font-family', 'color', 'background-color', 'border'), 'IN');
    }
    $data->condition('t.vid', $_GET['vid'], '=');
    if(isset($_GET['product_group_tid']) && isset($_GET['image_preset_selector']) && $_GET['vid'] == 'image_preset'){
      $data->leftJoin('taxonomy_term__field_y_height', 'fh', "t.tid = fh.entity_id");
      $data->leftJoin('taxonomy_term__field_x_width', 'fw', "t.tid = fw.entity_id");
      $data->leftJoin('taxonomy_term__field_unit_of_measurement', 'um', "t.tid = um.entity_id");
      $data->fields('fh', ['field_y_height_value']);
      $data->fields('fw', ['field_x_width_value']);
      $data->fields('um', ['field_unit_of_measurement_value']);
      $data->leftJoin('taxonomy_term__field_product_group', 'pg', "t.tid = pg.entity_id");
      $data->condition('pg.field_product_group_target_id', $_GET['product_group_tid'], '=');
    }
    else if(isset($_GET['presetVal']) && isset($_GET['image_preset_selector']) && $_GET['vid'] == 'image_preset'){
      $data->leftJoin('taxonomy_term__field_image_format', 'if', "t.tid = if.entity_id");
      $data->leftJoin('taxonomy_term__field_color_space', 'cs', "t.tid = cs.entity_id");
      $data->leftJoin('taxonomy_term__field_dpi_ppi', 'dpi', "t.tid = dpi.entity_id");
      $data->leftJoin('taxonomy_term__field_unit_of_measurement', 'um', "t.tid = um.entity_id");
      $data->condition('t.tid', $_GET['presetVal'], '=');
      $data->fields('if', ['field_image_format_value']);
      $data->fields('cs', ['field_color_space_value']);
      $data->fields('dpi', ['field_dpi_ppi_value']);
      $data->fields('um', ['field_unit_of_measurement_value']);
    }
    else if(isset($_GET['preset_tid']) && $_GET['vid'] == 'image_preset'){
      $data->leftJoin('taxonomy_term__field_y_height', 'fh', "t.tid = fh.entity_id");
      $data->leftJoin('taxonomy_term__field_x_width', 'fw', "t.tid = fw.entity_id");
      $data->leftJoin('taxonomy_term__field_unit_of_measurement', 'um', "t.tid = um.entity_id");
      $data->fields('fh', ['field_y_height_value']);
      $data->fields('fw', ['field_x_width_value']);
      $data->fields('um', ['field_unit_of_measurement_value']);
      $data->leftJoin('taxonomy_term__field_pages', 'page', "t.tid = page.entity_id");
      $data->leftJoin('taxonomy_term__field_layout_front', 'lf', "t.tid = lf.entity_id");
      $data->leftJoin('taxonomy_term__field_layout_back', 'lb', "t.tid = lb.entity_id");
      $data->condition('t.tid', $_GET['preset_tid'], '=');
      $data->fields('page', ['field_pages_value']);
      $data->fields('lf', ['field_layout_front_target_id']);
      $data->fields('lb', ['field_layout_back_target_id']);
    }
    else if(isset($_GET['product_group_tid']) && isset($_GET['sub_image_preset']) && $_GET['vid'] == 'image_preset'){
      $data->leftJoin('taxonomy_term__field_y_height', 'fh', "t.tid = fh.entity_id");
      $data->leftJoin('taxonomy_term__field_x_width', 'fw', "t.tid = fw.entity_id");
      $data->leftJoin('taxonomy_term__field_unit_of_measurement', 'um', "t.tid = um.entity_id");
      $data->fields('fh', ['field_y_height_value']);
      $data->fields('fw', ['field_x_width_value']);
      $data->fields('um', ['field_unit_of_measurement_value']);
      $data->leftJoin('taxonomy_term__field_product_group', 'pg', "t.tid = pg.entity_id");
      //$data->leftJoin('taxonomy_term__field_pages', 'page', "t.tid = page.entity_id");
      //$data->leftJoin('taxonomy_term__field_layout_front', 'lf', "t.tid = lf.entity_id");
      //$data->leftJoin('taxonomy_term__field_layout_back', 'lb', "t.tid = lb.entity_id");
      $data->condition('pg.field_product_group_target_id', $_GET['product_group_tid'], '=');
      $data->leftJoin('taxonomy_term__field_product_sub_group', 'psg', "t.tid = psg.entity_id");
      $data->condition('psg.field_product_sub_group_target_id', $_GET['sub_image_preset'], '=');
      //$data->condition('t.tid', $_GET['preset_tid'], '=');
      //$data->fields('page', ['field_pages_value']);
      //$data->fields('lf', ['field_layout_front_target_id']);
      //$data->fields('lb', ['field_layout_back_target_id']);
    }
    else if(isset($_GET['image_preset_selector']) && $_GET['vid'] == 'image_preset'){
      $data->leftJoin('taxonomy_term__field_y_height', 'fh', "t.tid = fh.entity_id");
      $data->leftJoin('taxonomy_term__field_x_width', 'fw', "t.tid = fw.entity_id");
      $data->leftJoin('taxonomy_term__field_unit_of_measurement', 'um', "t.tid = um.entity_id");
      $data->fields('fh', ['field_y_height_value']);
      $data->fields('fw', ['field_x_width_value']);
      $data->fields('um', ['field_unit_of_measurement_value']);
    }
    else if(isset($_GET['product_group_tid']) && $_GET['vid'] == 'image_preset'){
      $data->leftJoin('taxonomy_term__field_product_group', 'pg', "t.tid = pg.entity_id");
      $data->condition('pg.field_product_group_target_id', $_GET['product_group_tid'], '=');
    }
    if(isset($_GET['token_tid'])){
      $data->condition('t.tid', $_GET['token_tid'], '=');
    }
    else if(isset($_GET['token'])){
      $data->condition('ft.field_token_value', $_GET['token'], 'LIKE');
    }
    else if(isset($_GET['machine_field'])){
      $data->condition('mf.field_machine_field_value', $_GET['machine_field'], 'LIKE');
    }
    $data->fields('t', ['tid','name']);
    if($_GET['vid'] == 'kmds_token'){
      $data->fields('mf', ['field_machine_field_value']);
      $data->fields('ft', ['field_token_value']);
    }
    else if($_GET['vid'] == 'branding_css'){
      $data->fields('st', ['field_style_type_value']);
    }
    $result = $data->execute()->fetchAll();
    foreach ($result as $term) {
      if($_GET['vid'] == 'kmds_token'){
        $fresult[] = [
          'tid' => $term->tid,
          'name' => $term->name,
          'machine_field' => $term->field_machine_field_value,
          'token' => $term->field_token_value,
        ];
      }
      else if($_GET['vid'] == 'branding_css'){
        if($term->field_style_type_value == 'font-family'){
          $fresult[]['fontfamily'] = [
            'tid' => $term->tid,
            'name' => $term->name,
          ];
        }
        else if($term->field_style_type_value == 'color'){
          $fresult[]['fontcolor'] = [
            'tid' => $term->tid,
            'name' => $term->name,
          ];
        }
        else if($term->field_style_type_value == 'background-color'){
          $fresult[]['backgroundcolor'] = [
            'tid' => $term->tid,
            'name' => $term->name,
          ];
        }
        else if($term->field_style_type_value == 'border'){
          $fresult[]['bordercolor'] = [
            'tid' => $term->tid,
            'name' => $term->name,
          ];
        }
      }
      else if(isset($_GET['presetVal']) && isset($_GET['image_preset_selector']) && $_GET['vid'] == 'image_preset'){
        $fresult[] = [
          'tid' => $term->tid,
          'name' => $term->name,
          'format' => $term->field_image_format_value,
          'color_space' => $term->field_color_space_value,
          'dpi' => $term->field_dpi_ppi_value,
          'unit' => $term->field_unit_of_measurement_value,
        ];
      }
      else if(isset($_GET['preset_tid']) && $_GET['vid'] == 'image_preset'){
        $f_fid = $term->field_layout_front_target_id;
        $layout_front = '';
        if(!empty($f_fid)) {
          $f_file = \Drupal\file\Entity\File::load($f_fid);
          $f_image_uri = $f_file->getFileUri();
          $layout_front = file_create_url($f_image_uri);
        }
        $b_fid = $term->field_layout_back_target_id;
        $layout_back = '';
        if(!empty($b_fid)) {
          $b_file = \Drupal\file\Entity\File::load($b_fid);
          $b_image_uri = $b_file->getFileUri();
          $layout_back = file_create_url($b_image_uri);
        }
        $fresult[] = [
          'tid' => $term->tid,
          'name' => $term->name,
          'width' => $term->field_x_width_value,
          'height' => $term->field_y_height_value,
          'unit' => $term->field_unit_of_measurement_value,
          'page_no' => $term->field_pages_value,
          'layout_front' => $layout_front,
          'layout_back' => $layout_back,
        ];
      }
      else if((isset($_GET['sub_image_preset']) || isset($_GET['image_preset_selector'])) && $_GET['vid'] == 'image_preset'){
        $fresult[] = [
          'tid' => $term->tid,
          'name' => $term->name,
          'width' => $term->field_x_width_value,
          'height' => $term->field_y_height_value,
          'unit' => $term->field_unit_of_measurement_value,
        ];
      }
      else {
        $fresult[] = [
          'tid' => $term->tid,
          'name' => $term->name,
        ];
      }
    }
    $response = $fresult;
    return new JsonResponse($response);
  }
  /*
   * Route product group callback.
   * callback function to create token terms
  **/
  public function createtokendata() {
    $vid = $_POST['vid']; // Vocabulary machine name
    $template_tags = $_POST['template_tags']; // List of tags terms
    foreach ($template_tags as $term_value) {
      if ($terms = taxonomy_term_load_multiple_by_name($term_value, $vid)) {
        $term = reset($terms);
      }
      else {
        $term = Term::create([
          'name' => $term_value,
          'vid' => $vid,
        ]);
        $term->save();
      }
    }
    return $term->id();
  }
  
  /*
   * Route product type callback.
   * @return JSON response
   *   The term fields as a serialized JSON.
   */
  public function getAllProductTypesOfGroup ($parent_term_id) {
    $data = \Drupal::database()->select('taxonomy_term_field_data', 't');
    $data->leftJoin('taxonomy_term__field_icon', 'ic', "t.tid = ic.entity_id");
    $data->leftJoin('taxonomy_term__field_active_', 'ica', "t.tid = ica.entity_id");
    $data->leftJoin('taxonomy_term__field_product_group', 'pg', "t.tid = pg.entity_id");
    $data->condition('pg.field_product_group_target_id', $parent_term_id, '=');
    $data->condition('t.vid', 'product_type', '=');
    $data->condition('ic.bundle', 'product_type', '=');
    $data->condition('ica.bundle', 'product_type', '=');
    $data->fields('t', ['tid','name']);
    $data->fields('ic', ['field_icon_target_id']);
    $data->fields('ica', ['field_active__target_id']);
    $data->fields('pg', ['field_product_group_target_id']);
    $result = $data->execute()->fetchAll();

    $url = '';
    $fresult = [];
    foreach ($result as $term) {
      $fid = $term->field_icon_target_id;
      if(!empty($fid)) {
        $file = \Drupal\file\Entity\File::load($fid);
        $image_uri = $file->getFileUri();
        $style = \Drupal\image\Entity\ImageStyle::load('media_library');
        // Get URI.
        $uri = $style->buildUri($image_uri);
        // Get URL.
        $url = $style->buildUrl($image_uri);
      }
      $a_fid = $term->field_active__target_id;
      if(!empty($a_fid)) {
        $a_file = \Drupal\file\Entity\File::load($a_fid);
        $a_image_uri = $a_file->getFileUri();
        $style = \Drupal\image\Entity\ImageStyle::load('media_library');
        // Get URI.
        $a_uri = $style->buildUri($a_image_uri);
        // Get URL.
        $a_url = $style->buildUrl($a_image_uri);
      }
      $fresult[] = [
        'tid' => $term->tid,
        'name' => $term->name,
        'group' => $term->field_product_group_target_id,
        'icon' => $url,
        'a_icon' => $a_url,
      ];
    }
    $response = $fresult;
    
    return new JsonResponse($response); 
  }
  
  /*
   * Route product library callback.
   * @return JSON response
   *   The term fields as a serialized JSON.
   */
  public function getAllProductLibrariesOfType ($product_type) {
    $data = \Drupal::database()->select('taxonomy_term_field_data', 't');
    $data->leftJoin('taxonomy_term__field_icon', 'ic', "t.tid = ic.entity_id");
    $data->leftJoin('taxonomy_term__field_product_type', 'pt', "t.tid = pt.entity_id");
    $data->leftJoin('taxonomy_term__field_favorite', 'ff', "t.tid = ff.entity_id");
    $data->condition('pt.field_product_type_target_id', $product_type, '=');
    $data->condition('t.vid', 'product_library', '=');
    $data->condition('ic.bundle', 'product_library', '=');
    $data->condition('ff.bundle', 'product_library', '=');
    $data->fields('t', ['tid','name','description__value','description__format']);
    $data->fields('ic', ['field_icon_target_id']);
    $data->fields('pt', ['field_product_type_target_id']);
    $data->fields('ff', ['field_favorite_value']);
    $result = $data->execute()->fetchAll();

    $url = '';
    $fresult = [];
    foreach ($result as $term) {
      $fid = $term->field_icon_target_id;
      if(!empty($fid)) {
        $file = \Drupal\file\Entity\File::load($fid);
        $image_uri = $file->getFileUri();
        $style = \Drupal\image\Entity\ImageStyle::load('media_library');
        // Get URI.
        $uri = $style->buildUri($image_uri);
        // Get URL.
        $url = $style->buildUrl($image_uri);
      }
      $plain_desc = preg_match_all("|<[^>]+>(.*)</[^>]+>|U",$term->description__value, $out, PREG_SET_ORDER);
      $description = $out[0][1];
      $fresult[] = [
        'tid' => $term->tid,
        'name' => $term->name,
        'description' => $description,
        'group' => $term->field_product_type_target_id,
        'icon' => $url,
        'favorite' => $term->field_favorite_value,
      ];
    }
    $response = $fresult;
    
    return new JsonResponse($response); 
  }
	
	/*
   * Route kmds tool access callback.
   * allowed to Administrator or owner
   */
	public function kmds_tool_access(AccountInterface $account){
		$roles = $account->getRoles();
		$uid = \Drupal::currentUser()->id();
    if(in_array('administrator', $roles)){
      return AccessResult::allowed();
    }
    else if ($account->id() == $uid) {
      return AccessResult::allowed();
    }
    else{
      return AccessResult::forbidden();
    }
	}
	
	/**
	 * Get Access Token for KMDS tool
	 *
	public function kmdsAccessToken(){
		$config = \Drupal::config('media_design_system.kmdsapisettings')->get();
		$access_check_api = $config['access_check_api'];
		$access_url = $access_check_api."user_access_check";
		$uid = \Drupal::currentUser()->id();
		$user = User::load($uid);
		$name = $user->get('name')->value;
		$email = $user->get('mail')->value;
		$fields = "user_id=".$uid."&username=".urlencode($name)."&email=".urlencode($email);
    
    $cc = curl_init();
    curl_setopt($cc, CURLOPT_URL, $access_url);
    curl_setopt($cc, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($cc, CURLOPT_HTTPHEADER, array(
      'Content-Type: application/x-www-form-urlencoded',
    ));
    curl_setopt($cc, CURLOPT_POST, 3);
    curl_setopt($cc, CURLOPT_POSTFIELDS, $fields);

    $auth_code = curl_exec($cc);
    curl_close($cc);
    
    return json_decode($auth_code);
	}
	
	/*
   * Route export template json data callback.
   * @return JSON response
   *
	public function exportTemplateJson($design_id){
		$config = \Drupal::config('media_design_system.kmdsapisettings')->get();
		$access_check_api = $config['access_check_api'];
		$kmds_service = $access_check_api."designjson/".$design_id;
		$token = $this->kmdsAccessToken();

		if($token){
			$curl = curl_init();
			curl_setopt($curl, CURLOPT_URL, $kmds_service);
			curl_setopt($curl, CURLOPT_HTTPHEADER, array(
				"Authorization: bearer $token",
			));
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
			$result = curl_exec($curl);
			curl_close($curl);
			
			return new Response($result);
		} 
		else {
			return new Response('Error in access token!');
		}
	}*/
	
  /**
   * Callback function convertImageToURL().
   * To convert base64 image to image URL
   * and save in S3
   * @return JSON with Image URL
   */
	public function convertImageToURL(Request $request){
    $json_data = $request->request->get('json_data');
    $jsonData = json_decode($json_data);
    $design_id = $request->request->get('design_id');
    $uid = $request->request->get('uid');
    $uid = empty($uid) ? 0 : $uid;
    $json_type = $request->request->get('json_type');
    if($json_type == 'static_image'){
      $nodeerify = preg_match('/data:([^;]*);base64,(.*)/', $json_data, $match);
      if ($nodeerify) {
        $jsonData = array("src" => $this->convertImageToURLAtS3($json_data, $design_id, 0, 'static_image', array(), $uid));
      }
    }
    else if($json_type == 'convert_image'){
      foreach($jsonData->objects as $key=>$data){
        if($data->type == 'image'){
          $image_base64 = $data->src;
          $datasrc = $jsonData->objects[$key]->src;
          $nodeerify = preg_match('/data:([^;]*);base64,(.*)/', $datasrc, $match);
          if ($nodeerify) {
            $image_URL = $this->convertImageToURLAtS3($datasrc, $design_id, $key, 'image_type', $data, $uid);
            $jsonData->objects[$key]->src = $image_URL;
            $jsonData->objects[$key]->crossOrigin = 'anonymous';
          }
        }
      }
    }
    //return new JsonResponse(json_encode($jsonData));
    return new JsonResponse($jsonData);
	}
  /**
   * Callback function StaticImageUpload().
   * To upload static image at S3
   * @return JSON with S3 Image URL
   */
  public function StaticImageUpload(){
    $design_id = $_POST['new_filename'];
    $uid = $_POST['uid'];
    $uid = empty($uid) ? 0 : $uid;
    $exp = explode(".", $_FILES["file"]["name"])[1];
    $filename = $design_id.'.'.$exp;
    $new_file = 'public://files/'.$uid.'/kmds/images/static_image/' . $filename;
    $uploaded_image = file_get_contents($_FILES["file"]["tmp_name"]);
    file_put_contents($new_file, $uploaded_image);
    $source_original = array("src" => file_create_url($new_file));
    return new JsonResponse($source_original);
  }
  /**
   * This is the main scrubber function.
   */
  function convertImageToURLAtS3($datasrc, $design_id, $key3, $type, $image_container_object, $uid = NULL) {
    global $base_secure_url;
    $curr_date = time();
    $nodeerify = preg_match('/data:([^;]*);base64,(.*)/', $datasrc, $match);
    if ($nodeerify) {
      if($type == 'static_image'){
        $filename = $design_id . '.jpg';
        $new_file = 'public://files/'.$uid.'/kmds/images/static_image/' . $filename;
      }
      else {
        $filename = $design_id . '_' . $key3 . '_' . $curr_date . '_' .  $type . '.jpg';
        $new_file = 'public://files/'.$uid.'/kmds/images/template_crop_image/' . $filename;
      }
      //$new_uri = file_create_url($new_file);
      //$b64image = '';
      $data_raw = explode(',', $datasrc);
      //if(isset($image_container_object->width)){
      if(isset($data_raw[1])){
        $base64_data = base64_decode($data_raw[1]);
        file_put_contents($new_file, $base64_data);
        $source_original = file_create_url($new_file);
        return $source_original;
      }
    }
    else {
      return $datasrc;
    }
  }
  /**
   * Returns media kit image list
   *
   * @return array
   *   A simple renderable array.
   * https://www.jqueryscript.net/form/Tags-Input-Autocomplete.html
   */
  public function media_kit_images($user){
    global $base_secure_url;
    $uid = $user->id();
    $options = [];
    $options['uid'] = $uid;
    $options['element_id'] = 'mk-vmt-two';
    $options['mk_select'] = 1;
    $options['search'] = 1;
    $options['tabs']['photo'] = ['cols' => ['multi_asset_chk' => 1, 'photo' => 1, 'title' => 1, 'tags' => 1, 'dimension' => 1], 'active' => 0];
    $options['tabs']['audio'] = [];
    $options['tabs']['video'] = [];
    $options['tabs']['text'] = [];
    $variables['media_kit_two'] = \Drupal::service('media.kit.selector')->getMediaKitSelector($options);
    if(isset($_GET['masoom'])){print "<pre>";print_r($variables);exit;}
    $libraries[] = 'media_vault_tool/react.min';
		$libraries[] = 'media_vault_tool/react.dom.min';
		$libraries[] = 'media_vault_tool/axios';
		$libraries[] = 'media_vault_tool/km_global';
    $libraries[] = 'media_kit_selector/media.kit.global';
    $response = $variables;
    return new JsonResponse($response);
  }
  
  // get default media kit
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
  
  // get default media kit
  public function getDefaultMediaVault($uid){
    $query = \Drupal::entityQuery('node')->condition('uid', $uid)->condition('type', 'media_vault');
    $nids = $query->execute();
    $media_vault_id = 0;
    foreach($nids as $node_id){
      $media_vault_id = $node_id;
    }
    return $media_vault_id;
  }
}
