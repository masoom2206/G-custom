<?php 
namespace Drupal\km_product;

class PostCardGreetingCard {
  public function __construct($data){
    $this->node = $data['node'];
    $this->user = $data['user']; 
    $this->product = $data['product']; 
    $this->nav = $data['nav'];
  }
  
  public function getPostCardGreetingCard($view_style) {
    $nid = $this->node['nid'];
    $user = \Drupal::currentUser();
    $uid  = $user->id();
    $default_kit = default_media_kit_by_user($uid);
    $product = $this->product;
    // saved user templates
    $user_templates = changeTagsTemplates(\Drupal::service('km_product.templates')->getUserTemplates($product['id'], $uid));    
    // KMDS templates
    $templates = changeTagsFavoriteTemplates(\Drupal::service('km_product.templates')->getTemplates($product['id']), $nid);
    //echo '<pre>'; print_r($user_templates); echo '</pre>';
    $render_data['theme_data'] = [
      '#theme'                  => 'postcard-greetingcard',
      '#node'                   => $this->node,
      '#user'                   => $this->user,
      '#product'                => $this->product,
      '#nav'                    => $this->nav,
      '#templates'              => $templates,
      '#user_templates'         => $user_templates,
      '#view_style'              =>$view_style,
      '#default_kit'             => $default_kit,
      '#data'                   => [],
      '#attached'               => ['library' =>  ['km_product/product_style']]
    ];
    
    return $render_data;
  }
}