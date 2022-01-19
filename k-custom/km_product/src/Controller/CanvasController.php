<?php
 
/**
* @file
* Contains \Drupal\km_product\Controller\CanvasController.php
*
*/
namespace Drupal\km_product\Controller;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
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
use Drupal\km_product\Controller\WebTemplateController;

class CanvasController extends ControllerBase {
  /**
   * Returns product template settings page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function editTemplate(NodeInterface $node, $producttype, $template_id){
    global $base_secure_url;
    $uid = \Drupal::currentUser()->id();
    // check web product
    $pg_query = db_select('taxonomy_term_field_data', 'td');
    $pg_query->join('taxonomy_term__field_product_group', 'pg', 'pg.field_product_group_target_id = td.tid');
    $pg_query->fields('td', ['tid', 'name']);
    $pg_query->condition('td.vid', 'product_group', '=');
    $pg_query->condition('td.name', array('web','email'), 'IN');
    //$pg_query->condition('td.name', 'web', '=');
    $pg_query->condition('pg.entity_id', $producttype->id(), '=');
    $pg_result = $pg_query->execute()->fetchObject();
    
    if(empty($pg_result)){
      // canvas product
      $user_detail = User::load($uid);
      $user_name = $user_detail->get('name')->value;
      $user_email = $user_detail->get('mail')->value;
      $user_roles = $user_detail->getRoles();
      $user_action = 0;
      //Expert, Enterprise, and Admin roles = a lock/unlock icon appears
      if (in_array('administrator', $user_roles) || in_array('advanced_content_creator', $user_roles) || in_array('enterprise', $user_roles) || in_array('content_creator', $user_roles)) {
        $user_action = 1;
      }
      $user_professional_access = 0;
      // if (in_array('content_creator', $user_roles)) {
        // $user_professional_access = 1;
      // }
      $nid = $node->id();
      $config = \Drupal::config('media_design_system.kmdsapisettings')->get();
      $access_check_api = $config['access_check_api'];
      $product_type = preg_replace('/[^a-z0-9-]/i', '', $producttype->getName());
      // left navigation
      $data = \Drupal::service('km_product.templates')->getLeftNavigation($node);
      $template_detail = \Drupal::service('km_product.templates')->getTemplateDetail($template_id);
      //echo '<pre>'; print_r($template_detail); echo '</pre>'; die('here');
      $pro_id = isset($_GET['kmproduct']) ? $template_id : "";
      // product type
      $product = [
        'id'=> $producttype->id(),
        'name' => $producttype->getName(),
        'template_id' => $template_id,
        'temp_id' => ($template_detail->_id) ? $template_detail->_id : $template_id,
        'temp_name' => ($template_detail->_name) ? $template_detail->_name : '',
        'pro_id' => $pro_id,
      ];
      $auth_controler = new TemplatesController();
      $auth_code = $auth_controler->getAuthCode();
      
      // assigned media kit  
      $media_kit_query = db_select('node__field_media_kit_ref', 'mk');
      $media_kit_query->join('node_field_data', 'n', 'n.nid = mk.field_media_kit_ref_target_id');
      $media_kit_query->fields('n', ['nid', 'uid', 'title']);
      $media_kit_query->condition('n.type', 'media_kit', '=');
      $media_kit_query->condition('mk.entity_id', $nid, '=');
      $media_kit_result = $media_kit_query->execute();
      $assigned_media_kit = $media_kit_result->fetchObject();
      $assigned_media_kit_link = '';
      if(!empty($assigned_media_kit)) {
        $assigned_media_kit_link = Link::fromTextAndUrl($assigned_media_kit->title, Url::fromRoute('media_vault_tool.media_kit', ['user' => $assigned_media_kit->uid, 'node' => $assigned_media_kit->nid]))->toString();
      }
      
      $render_data['theme_data'] = [
        '#theme'                  => 'template-settings',
        '#node'                   => $data['node'],
        '#user'                   => $data['user'],
        '#product'                => $product,
        '#nav'                    => $data['nav'],
        '#data'                   => [
          'assigned_media_kit_link' => $assigned_media_kit_link,
          'user_action' => $user_action,
          'user_professional_access' => $user_professional_access
        ],
        '#attached'               => [
          'library' =>  [
            'video_maker_tool/vmt.tagsinput',
            'media_design_system/bootstrap_cdn',
            'media_design_system/fabric',
            'km_product/km_product_style',
            'km_product/km_product_image_editor',
          ],
        ],
      ];
      $render_data['theme_data']['#attached']['drupalSettings']['template_id'] = $template_id;
      $render_data['theme_data']['#attached']['drupalSettings']['access_check_api'] = $access_check_api;
      $render_data['theme_data']['#attached']['drupalSettings']['media_base_url'] = $base_secure_url;
      $render_data['theme_data']['#attached']['drupalSettings']['uid'] = $uid;
      $render_data['theme_data']['#attached']['drupalSettings']['user_action'] = $user_action;
      $render_data['theme_data']['#attached']['drupalSettings']['user_professional_access'] = $user_professional_access;
      $render_data['theme_data']['#attached']['drupalSettings']['user_name'] = $user_name;
      $render_data['theme_data']['#attached']['drupalSettings']['user_email'] = $user_email;
      $render_data['theme_data']['#attached']['drupalSettings']['auth_code'] = $auth_code;
      $render_data['theme_data']['#attached']['drupalSettings']['kaboodle_nid'] = $nid;
      $render_data['theme_data']['#attached']['drupalSettings']['user_roles'] = $user_roles;
      
      return $render_data;
    }else{
      // web product
      $wpobj = new WebTemplateController();
      return $wpobj->editTemplate($node, $producttype, $template_id);
    }
	}
}