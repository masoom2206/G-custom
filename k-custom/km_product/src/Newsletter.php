<?php 
namespace Drupal\km_product;
use Drupal\media\Entity\Media;
use Drupal\s3fs\S3fsService;

class Newsletter {
  public function __construct($data){
    $this->node = $data['node'];
    $this->user = $data['user']; 
    $this->product = $data['product']; 
    $this->nav = $data['nav'];
  }
  
  public function getNewsletter($view_style) {
    $uid = \Drupal::currentUser()->id();
    $nid = $this->node['nid'];
    $pid = $this->product['id'];
		$account = \Drupal::currentUser();
    $roles = $account->getRoles();
    $professionalUser = 0;
    if(in_array('content_creator', $roles) && !in_array('advanced_content_creator', $roles)){
      $professionalUser = 1;
    }
    // templates
    $tquery = \Drupal::database()->select('web_product_templates', 'wpt');
    $tquery->leftJoin('web_templates_favorite', 'wtf', "wtf.template_id = wpt.id AND wtf.node_id = $nid AND wtf.user_id = $uid"); 
    $tquery->fields('wpt', ['id', 'product_id', 'name', 'description', 'template_group', 'preview_image', 'tags', 'created', 'modified']);
    $tquery->addExpression("IF(wtf.is_favorite IS NULL, 0, wtf.is_favorite)", 'favorite');
    $tquery->condition('wpt.product_id', $pid, '=');
    $tquery->condition('wpt.template_type', 1, '=');
    $tquery->condition('wpt.template_status', 1, '=');
    $tquery->orderBy('wpt.name', 'ASC');
    $templates = $tquery->execute()->fetchAll();
    
    // products 
    $utquery = \Drupal::database()->select('web_product_templates', 'wpt');
    $utquery->leftJoin('web_templates_favorite', 'wtf', "wtf.template_id = wpt.id AND wtf.node_id = $nid AND wtf.user_id = $uid");
    $utquery->fields('wpt', ['id', 'product_id', 'media_id', 'name', 'description', 'template_group', 'preview_image', 'tags', 'created', 'modified']);
    $utquery->addExpression("IF(wtf.is_favorite IS NULL, 0, wtf.is_favorite)", 'favorite');    
    $utquery->condition('wpt.user_id', $uid, '=');
    $utquery->condition('wpt.product_id', $pid, '=');
    $utquery->condition('wpt.node_id', $nid, '=');
    $utquery->condition('wpt.template_type', 2, '=');
    $utquery->condition('wpt.template_status', 1, '=');
    $utquery->orderBy('wpt.modified', 'DESC');
    $user_templates = $utquery->execute()->fetchAll();
    foreach($user_templates as $key=>$value){
      if(isset($value->media_id)){
        if($value->media_id != 0){
          $media = Media::load($value->media_id);
          if(isset($media->field_media_image) && !empty($media->field_media_image->entity)){
            $download_uri = $media->field_media_image->entity->getFileUri();
            $download_url = file_create_url($download_uri);
            $user_templates[$key]->km_render= $download_url;
          }
          else if(isset($media->field_media_file) && !empty($media->field_media_file->entity)){
            $download_uri = $media->field_media_file->entity->getFileUri();
            $download_url = file_create_url($download_uri);

            $config = \Drupal::config('s3fs.settings')->get();
            $s3fs = \Drupal::service('s3fs');
            $s3 = $s3fs->getAmazonS3Client($config);
            //$s3 = s3fsService::getAmazonS3Client($config);
            $urls = $media->field_media_file->entity->getFileUri();
            $half_url = explode('//',$urls);
            $output_file = $media->field_media_file->entity->getFilename();
            $s3key = 's3fs_private/'.$half_url[1];
            $command = $s3->getCommand('GetObject', array(
             'Bucket' => $config['bucket'],
             'Key'    => $s3key,  
             'ResponseContentDisposition' => 'attachment; filename="'.$output_file.'"'
            ));
            $response = $s3->createPresignedRequest($command, '+40 minutes');
            $presignedUrl = (string)$response->getUri();
            

            $user_templates[$key]->km_render1 = $download_url;
            $user_templates[$key]->km_render = $presignedUrl;
          }
        }else {
          $user_templates[$key]->km_render = 0;
        }
      }
      else {
        $user_templates[$key]->km_render = 0;
      }
    }

    $default_kit = default_media_kit_by_user($uid);
    $render_data['theme_data'] = [
      '#theme'                  => 'newsletter',
      '#node'                   => $this->node,
      '#user'                   => $this->user,
      '#product'                => $this->product,
      '#nav'                    => $this->nav,
      '#default_kit'            => $default_kit,
      '#templates'              => $templates,
      '#user_templates'         => $user_templates,
      '#view_style'             => $view_style,
      '#professional_user'      => $professionalUser,
      '#data'                   => [],
      '#attached'               => ['library' =>  ['km_product/product_style']]
    ];
    $render_data['theme_data']['#attached']['drupalSettings']['uid'] = $uid;
    
    return $render_data;
  }
}