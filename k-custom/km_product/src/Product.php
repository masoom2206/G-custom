<?php 
namespace Drupal\km_product;
use Drupal\user\Entity\User;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\media\Entity;
use Drupal\media\Entity\Media;
use Drupal\s3fs\S3fsService;
use Drupal\file\Entity\File;

class Product {
  public function __construct($data){
    $this->node = $data['node'];
    $this->user = $data['user']; 
    $this->product = $data['product']; 
    $this->nav = $data['nav'];
  }
  
  /**
   * Returns product page
   * @return array
   *   A simple renderable array.
   */
  public function getProduct($view_style) {
    $nid = $this->node['nid'];
    $uid = $this->user['uid'];
		$account = \Drupal::currentUser();
    $roles = $account->getRoles();
    $professionalUser = 0;
    if(in_array('content_creator', $roles) && !in_array('advanced_content_creator', $roles)){
      $professionalUser = 1;
    }
    $default_kit = default_media_kit_by_user($uid);
    $product = $this->product;
    //$user = \Drupal::currentUser();
    //$uid  = $user->id();
    // saved user templates 
    $user_templates = changeTagsTemplates(\Drupal::service('km_product.templates')->getUserTemplates($nid, $product['id']));       
    // KMDS templates
    $templates = changeTagsFavoriteTemplates(\Drupal::service('km_product.templates')->getTemplates($product['id']), $nid);
    $time_zone = date_default_timezone_get();
    //echo '<pre>'; print_r($templates); echo '</pre>';
    foreach($user_templates->data as $key=>$value){
      if($value->modified != ''){
        $date = new DrupalDateTime($value->modified, 'GMT');
        $date->setTimezone(new \DateTimeZone($time_zone));
        $date_ful = $date->format('m/d/y h:i A'); 
        $value->modified = $date_ful;
      }
      if(isset($value->km_render)){
        if($value->km_render != 0){
          $media = Media::load($value->km_render);
          if($media){
            if(isset($media->field_media_image) && !empty($media->field_media_image->entity)){
              $download_uri = $media->field_media_image->entity->getFileUri();
              $download_url = file_create_url($download_uri);
              $user_templates->data[$key]->km_render = $download_url;
            }
            else if(isset($media->field_media_file) && !empty($media->field_media_file->entity)){
              $download_uri = $media->field_media_file->entity->getFileUri();
              $download_url = file_create_url($download_uri);
              $user_templates->data[$key]->km_render = $download_url;
            }
          }
          else {
            $user_templates->data[$key]->km_render = 0;
          }
        }
      }
      else {
        $user_templates->data[$key]->km_render = 0;
      }
    }
    //print "<pre>";print_r($user_templates);exit;
    $date_ful = 'test';
    /*
    
    $datetime = new DateTime('2021-04-03 18:24:06');
    $la_time = new DateTimeZone($time_zone);
    $datetime->setTimezone($la_time);
    $date_ful = $datetime->format('d-m-y H:i:s A');
    */
    $render_data['theme_data'] = [
      '#theme'                  => 'product',
      '#node'                   => $this->node,
      '#user'                   => $this->user,
      '#product'                => $this->product,
      '#nav'                    => $this->nav,
      '#templates'              => $templates,
      '#user_templates'         => $user_templates,
      '#view_style'             => $view_style,
      '#time_zone'              => $date_ful,
      '#default_kit'            => $default_kit,
      '#professional_user'      => $professionalUser,
      '#data'                   => [],
      '#attached'               => ['library' =>  ['km_product/product_style']]
    ];
    $render_data['theme_data']['#attached']['drupalSettings']['uid'] = $uid;
    
    return $render_data; 
  }
  
  
}
