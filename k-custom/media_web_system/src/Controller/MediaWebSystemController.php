<?php
namespace Drupal\media_web_system\Controller;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Render\Markup;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\taxonomy\Entity\Term;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;

class MediaWebSystemController extends ControllerBase {  
  /**
   * Returns product templates page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function webProductTemplate($tid){
    global $base_secure_url;
        
    $account = \Drupal::currentUser();
    $uid = $account->id();
    
    $query = \Drupal::database()->select('web_product_templates', 'wpt');
    $query->fields('wpt'); 
    $query->condition('wpt.id', $tid, '=');
    $template = $query->execute()->fetchObject();
    
    $product_id = $template->product_id;
    if($template->parent_id == 0) {
      // for developer template, get content from file
      $template_url = "{$base_secure_url}/wptemplates/{$template->template_file_name}";    
      $template->template_html = file_get_contents($template_url);
    }else{
      // for other template, get content from database
      if(!empty($template->template_variables)){
        $template_variables = json_decode($template->template_variables);        
        if(!empty($template_variables)){
          $tokens = [];
          $token_values = [];
          foreach($template_variables as $token => $value) {
            $tokens[] = "/\[token:{$token}\]/is";
            $token_values[] = $value;
            /*
            switch($token) {
              case 'personal_info':
                $token_values[] = $personal_info;
              break;
              
              case 'social_icons':
                $token_values[] = $social_media_links;
              break;
              
              default:
                $token_values[] = $value;
            }
            */
          }
          $template->template_html = preg_replace($tokens, $token_values, $template->template_base_html);
        }
      }
    }

    $variables = [];
    $variables['template'] = $template;
    
    $form = \Drupal::formBuilder()->getForm('Drupal\media_web_system\Form\WebTextEditorForm');
    // libraries
    $libraries[] = 'media_design_system/colorPicker';
    $libraries[] = 'media_web_system/kmdswebtool';
    $libraries[] = 'media_web_system/mediawebsystem';	
    $libraries[] = 'media_design_system/bootstrap_cdn';
    $libraries[] = 'media_web_system/ui_dialoge';
    
    $render_data['theme_data'] = [
    '#theme'                  => 'web-product-template',
    '#variables'              => $variables,
    '#form'                   => $form,
    '#attached'               => [
      'library' => $libraries, 
      'drupalSettings' => [
          'media_base_url' => $base_secure_url, 
          'user_id' => $uid,
          'product_type_id' => $product_id,
        ],
      ],
    ];
    
    return $render_data;    
	}
    
  
  /**
   * Returns product templates page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function saveProductTemplate(Request $request){
    $time = time();
    $uid          = \Drupal::currentUser()->id();
    $action       = $request->request->get('action');
    $template_id  = $request->request->get('template_id');
    $name         = $request->request->get('template_name');
    $template     = $request->request->get('template');
    $tokens       = $request->request->get('tokens');
    
    // template
    $query = \Drupal::database()->select('web_product_templates', 'wpt');
    $query->fields('wpt'); 
    $query->condition('wpt.id', $template_id, '=');
    $data = $query->execute()->fetchObject();
    
    // template or product name 
    $name = empty($name) ? $data->name : $name;
    $parent_id  = empty($data->parent_id) ? 0 : $data->parent_id;
    $node_id    = empty($data->node_id) ? 0 : $data->node_id;
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
    
    if($action == 'add') {
      $fields['parent_id']            = $parent_id;
      $fields['node_id']              = $node_id;
      $fields['media_id']             = $media_id;
      $fields['user_id']              = $uid;
      $fields['product_id']           = $data->product_id;
      $fields['template_group']       = $data->template_group;
      $fields['preview_image']        = $data->preview_image;
      $fields['template_file_name']   = $data->template_file_name;
      $fields['template_type']    = 1;
      $fields['template_status']  = 1;
      $fields['created']  = $time;
      
      $template_id = \Drupal::database()->insert('web_product_templates')
      ->fields($fields)
      ->execute();
    }else{
      \Drupal::database()->update('web_product_templates')
      ->fields($fields)
      ->condition('id', $template_id)
      ->execute();
    }
    
    $output = ['status' => 'success', 'template_id' => $template_id, 'msg' => 'Saved successfully.'];
    return new JsonResponse($output);
  }
  
  /**
   * Returns product templates page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function webProduct(){
    global $base_url;
    $account = \Drupal::currentUser();
    $uid = $account->id();
    $variables = [];
    $form = \Drupal::formBuilder()->getForm('Drupal\media_web_system\Form\WebTextEditorForm');
    // libraries
    $libraries[] = 'media_design_system/colorPicker';
    $libraries[] = 'media_web_system/kmdswebtool';
    $libraries[] = 'media_web_system/mediawebsystem';	
    $libraries[] = 'media_design_system/bootstrap_cdn';
    $libraries[] = 'media_web_system/ui_dialoge';
    
    
    $host =  \Drupal::request()->getSchemeAndHttpHost();
    $knowledge_value = n_knowledge_base_i_pattern('Email Flyers');
    $knowledge_alias = \Drupal::service('path.alias_manager')->getAliasByPath('/node/'.$knowledge_value[2]);
    
    
    $info_ico = Markup::create("<div class='info-ico kowledge-base-ico' aria-label ='".$knowledge_value[1]."'  aria-title ='".$knowledge_value[0]."' aria-nid ='".$host.$knowledge_alias."'></div>");
    
    $variables['info_ico']= $info_ico;

    $render_data['theme_data'] = [
    '#theme'                  => 'web-product',
    '#variables'              => $variables,
    '#form'                    => $form,
    '#attached'               => [
      'library' => $libraries, 
      'drupalSettings' => [
          'media_base_url' => $base_url, 
          'user_id' => $uid,
        ],
      ],
    ];
    
    return $render_data;    
	}

  /**
   * Returns product templates page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function webProductTemplates($user, $mtid, $ptid){
    global $base_url;
    $uid = $user->id();  
    // templates    
    $query = \Drupal::database()->select('web_product_templates', 'wpt');
    $query->leftJoin('web_templates_favorite', 'wtf', 'wtf.template_id = wpt.id AND wtf.node_id = wpt.node_id AND wtf.user_id = wpt.user_id'); 
    $query->fields('wpt', ['id', 'product_id', 'name', 'description', 'template_group', 'preview_image', 'tags', 'created', 'modified']);
    $query->addExpression("IF(wtf.is_favorite IS NULL, 0, wtf.is_favorite)", 'favorite');
    $query->condition('wpt.product_id', $ptid, '=');
    $query->condition('wpt.template_type', 1, '=');
    $query->condition('wpt.template_status', 1, '=');
    $query->orderBy('wpt.name', 'ASC');
    $templates = $query->execute()->fetchAll();
    
    $variables = [];
    $variables['templates'] = $templates;
    $variables['mtid'] = $mtid;
    $variables['uid'] = $uid;
    
    $response = \Drupal::service('media_design_system.termdataApi')->getTermdata($ptid);
    $termdata = json_decode($response->getContent());
    $variables['termdata'] = $termdata[0];
    // libraries
    $libraries[] = 'media_web_system/kmdswebtool';
    $libraries[] = 'media_web_system/mediawebsystem';	
    $libraries[] = 'media_design_system/bootstrap_cdn';

    $render_data['theme_data'] = [
    '#theme'                  => 'web-product-templates',
    '#variables'              => $variables,
    '#attached'               => [
      'library' => $libraries, 
      'drupalSettings' => [
          'media_base_url' => $base_url,
          'user_id' => $uid,
        ],
      ],
    ];
    
    return $render_data;    
	}
}