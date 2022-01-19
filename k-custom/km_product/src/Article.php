<?php 
namespace Drupal\km_product;

class Article {
  public function __construct($data){
    $this->node = $data['node'];
    $this->user = $data['user']; 
    $this->product = $data['product']; 
    $this->nav = $data['nav'];
  }
  
  public function getArticle($view_style) {
    $uid = $this->user['uid'];
    $default_kit = default_media_kit_by_user($uid);
    
    // products 
    $query = \Drupal::database()->select('node_field_data', 'article');
    $query->fields('article', ['nid', 'title']);
    $query->condition('article.type', 'html_article', '=');
    $query->orderBy('article.changed', 'DESC');
    $articles = $query->execute()->fetchAll();
    
    $render_data['theme_data'] = [
      '#theme'                  => 'article',
      '#node'                   => $this->node,
      '#user'                   => $this->user,
      '#product'                => $this->product,
      '#nav'                    => $this->nav,
      '#default_kit'            => $default_kit,
      '#data'                   => ['articles' => $articles],
      '#attached'               => ['library' =>  ['km_product/product_style']]
    ];
    
    return $render_data;
  }
}