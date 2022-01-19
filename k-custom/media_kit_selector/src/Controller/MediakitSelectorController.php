<?php
namespace Drupal\media_kit_selector\Controller;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Link;
use Drupal\Core\Url;

class MediakitSelectorController extends ControllerBase {
  // constructor
  function __construct() {
    $uid = \Drupal::currentUser()->id();
    $this->options['uid'] = $uid;
    $this->options['element_id'] = 'media-kit-selector';
    $this->options['mk_select'] = 1;
    $this->options['search'] = 1;
    $this->options['tabs']['photo'] = ['cols' => ['multi_asset_chk' => 1, 'photo' => 1, 'title' => 1, 'tags' => 1, 'dimension' => 1], 'active' => 1, 'gallery' => 1, 'tick' => 1];
    $this->options['tabs']['audio'] = ['cols' => ['multi_asset_chk' => 1, 'audio' => 1, 'title' => 1, 'tags'=> 1, 'duration' => 1], 'active' => 0];
    $this->options['tabs']['video'] = ['cols' => ['multi_asset_chk' => 1, 'video' => 1, 'title' => 1, 'tags' => 1, 'duration' => 1], 'active' => 0, 'play' => 1];
    $this->options['tabs']['text'] = ['cols' => ['multi_asset_chk' => 1, 'text' => 1, 'title' => 1, 'tags' => 1, 'format' => 1], 'active' => 0];
  }
  
  /**
   * Returns product templates page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function getMediaKitSelector($options = []){
    global $base_secure_url;
    //$uid = \Drupal::currentUser()->id();
    
    if(empty($options)) {
      $options = $this->options;
    }
    $uid = $options['uid'];
    //echo '<pre>'; print_r($options); echo '</pre>';

    // default media kit
    $default_media_kit_id = $this->getDefaultMediaKit($uid);
    // default media vault
    $media_vault_id = $this->getDefaultMediaVault($uid);
    //echo '<pre>'; print_r($media_vault_id); echo '</pre>';
    
    // libraries
    $libraries[] = 'media_kit_selector/media.kit.selector';
    //$libraries[] = '';
    
    // variables
    $variables['uid'] = $uid;
    $variables['media_vault_id'] = $media_vault_id;
    $variables['default_media_kit_id'] = $default_media_kit_id;
    $variables['options'] = $options; 
    
    $render_data['theme_data'] = [
    '#theme'                  => 'media-kit-selector',
    '#variables'              => $variables,
    '#attached'               => [
      'library' => $libraries, 
      'drupalSettings' => [
          'base_url' => $base_secure_url,
          'media_vault_id' => $media_vault_id,
          'default_media_kit_id' => $default_media_kit_id,
          'mksoptions' => $options,
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
	public function getMediaKit($options = []){
    global $base_secure_url;
    //$uid = \Drupal::currentUser()->id();
    
    if(empty($options)) {
      $options = $this->options;
    }
    $uid = $options['uid'];
    //echo '<pre>'; print_r($options); echo '</pre>';

    // default media kit
    $default_media_kit_id = $this->getDefaultMediaKit($uid);
    // default media vault
    $media_vault_id = $this->getDefaultMediaVault($uid);
    //echo '<pre>'; print_r($media_vault_id); echo '</pre>';
    
    // libraries
    $libraries[] = 'media_kit_selector/media.kit';
    //$libraries[] = '';
    
    // variables
    $variables['uid'] = $uid;
    $variables['media_vault_id'] = $media_vault_id;
    $variables['default_media_kit_id'] = $default_media_kit_id;
    $variables['options'] = $options; 
    
    $render_data['theme_data'] = [
    '#theme'                  => 'media-kit-selector',
    '#variables'              => $variables,
    '#attached'               => [
      'library' => $libraries, 
      'drupalSettings' => [
          'base_url' => $base_secure_url, 
          'media_vault_id' => $media_vault_id,
          'default_media_kit_id' => $default_media_kit_id,
          'options' => $options,
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
	public function getMediaKitMKS($options = []){
    global $base_secure_url;
    //$uid = \Drupal::currentUser()->id();
    
    if(empty($options)) {
      $options = $this->options;
    }
    $uid = $options['uid'];

    // default media kit
    $default_media_kit_id = $this->getDefaultMediaKit($uid);
    // default media vault
    $media_vault_id = $this->getDefaultMediaVault($uid);
    //echo '<pre>'; print_r($media_vault_id); echo '</pre>';
    
    // libraries
    $libraries[] = 'media_kit_selector/media.mks';
    //$libraries[] = '';
    
    // variables
    $variables['uid'] = $uid;
    $variables['media_vault_id'] = $media_vault_id;
    $variables['default_media_kit_id'] = $default_media_kit_id;
    $variables['options'] = $options; 
    
    $render_data['theme_data'] = [
    '#theme'                  => 'media-kit-selector',
    '#variables'              => $variables,
    '#attached'               => [
      'library' => $libraries, 
      'drupalSettings' => [
          'base_url' => $base_secure_url,
          'media_vault_id' => $media_vault_id,
          'default_media_kit_id' => $default_media_kit_id,
          'mkssettings' => $options,
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
	public function getReact(){
    global $base_secure_url;
    $uid = \Drupal::currentUser()->id();
    $options = $this->options;
    
    //echo '<pre>'; print_r($options); echo '</pre>';

    // default media kit
    $default_media_kit_id = $this->getDefaultMediaKit($uid);
    // default media vault
    $media_vault_id = $this->getDefaultMediaVault($uid);
    //echo '<pre>'; print_r($media_vault_id); echo '</pre>';
    
    // libraries
    $libraries[] = 'media_vault_tool/react.min';
		$libraries[] = 'media_vault_tool/react.dom.min';
		$libraries[] = 'media_vault_tool/axios';
    $libraries[] = 'media_kit_selector/media.kit.reactab';
    //$libraries[] = '';
    
    // variables
    $variables['uid'] = $uid;
    $variables['media_vault_id'] = $media_vault_id;
    $variables['default_media_kit_id'] = $default_media_kit_id;
    $variables['options'] = $options; 
    
    $render_data['theme_data'] = [
    '#theme'                  => 'react',
    '#variables'              => $variables,
    '#attached'               => [
      'library' => $libraries, 
      'drupalSettings' => [
          'base_url' => $base_secure_url, 
          'user_id' => $uid,
          'media_vault_id' => $media_vault_id,
          'default_media_kit_id' => $default_media_kit_id,
          'options' => $options,
        ],
      ],
    ];
    
    return $render_data;
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

