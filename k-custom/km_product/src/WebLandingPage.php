<?php 
namespace Drupal\km_product;

class WebLandingPage {
  public function __construct($data){
    $this->node = $data['node'];
    $this->user = $data['user']; 
    $this->product = $data['product']; 
    $this->nav = $data['nav'];
  }
  
  public function getWebLandingPage($view_style) {
    $uid = $this->user['uid'];
    $default_kit = default_media_kit_by_user($uid);
    $render_data['theme_data'] = [
      '#theme'                  => 'web-landing-page',
      '#node'                   => $this->node,
      '#user'                   => $this->user,
      '#product'                => $this->product,
      '#nav'                    => $this->nav,
      '#default_kit'            => $default_kit,
      '#data'                   => [],
      '#attached'               => ['library' =>  ['km_product/product_style']]
    ];
    
    return $render_data;
  }
}