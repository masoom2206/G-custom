<?php
/**
* @file
* Contains \Drupal\km_product\Controller\ProductController.php
*
*/
namespace Drupal\video_maker_tool\Controller;
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
use Drupal\taxonomy\Entity\Term;
use Drupal\media\Entity\Media;

class MKSController extends ControllerBase {  
  /**
   * Returns media preset
   *
   * @return array
   *   A simple renderable array.
   * https://www.jqueryscript.net/form/Tags-Input-Autocomplete.html
   */
  public function getMKS($user){
    global $base_secure_url;
    $uid = $user->id();
    
    $options = [];
    $options['uid'] = $uid;
    $options['element_id'] = 'mk-vmt-one';
    $options['mk_select'] = 1;
    $options['search'] = 1;
    $options['tabs']['photo'] = ['cols' => ['multi_asset_chk' => 1, 'photo' => 1, 'title' => 1, 'tags' => 1, 'dimension' => 1], 'active' => 1, 'gallery' => 0, 'tick' => 1];
    $options['tabs']['audio'] = ['cols' => ['multi_asset_chk' => 1, 'audio' => 1, 'title' => 1, 'tags'=> 1, 'duration' => 1], 'active' => 0];
    $options['tabs']['video'] = ['cols' => ['multi_asset_chk' => 1, 'video' => 1, 'title' => 1, 'tags' => 1, 'duration' => 1], 'active' => 0, 'play' => 1];
    $options['tabs']['text'] = ['cols' => ['multi_asset_chk' => 1, 'text' => 1, 'title' => 1, 'tags' => 1, 'format' => 1], 'active' => 0];
    $variables['media_kit_one'] = \Drupal::service('media.kit.selector')->getMediaKit($options);
    //$variables['media_kit_one'] = '';
    
    $options = [];
    $options['uid'] = $uid;
    $options['element_id'] = 'mk-vmt-two';
    $options['mk_select'] = 1;
    $options['search'] = 1;
    $options['tabs']['photo'] = ['cols' => ['multi_asset_chk' => 1, 'photo' => 1, 'title' => 1, 'tags' => 1, 'dimension' => 1], 'active' => 0, 'gallery' => 1, 'tick' => 1];
    $options['tabs']['audio'] = ['cols' => ['multi_asset_chk' => 1, 'audio' => 1, 'title' => 1, 'tags'=> 1, 'duration' => 1], 'active' => 1];
    $options['tabs']['video'] = ['cols' => ['multi_asset_chk' => 1, 'video' => 1, 'title' => 1, 'tags' => 1, 'duration' => 1], 'active' => 0, 'play' => 1];
    $options['tabs']['text'] = ['cols' => ['multi_asset_chk' => 1, 'text' => 1, 'title' => 1, 'tags' => 1, 'format' => 1], 'active' => 0];
    $variables['media_kit_two'] = \Drupal::service('media.kit.selector')->getMediaKitSelector($options);
    //$variables['media_kit_two'] = '';
    
    $options = [];
    $options['uid'] = $uid;
    $options['element_id'] = 'mk-vmt-three';
    $options['mk_select'] = 1;
    $options['search'] = 1;
    $options['tabs']['photo'] = ['cols' => ['multi_asset_chk' => 0, 'photo' => 1, 'title' => 1, 'tags' => 1, 'dimension' => 1], 'active' => 0, 'gallery' => 0, 'tick' => 1];
    $options['tabs']['audio'] = ['cols' => ['multi_asset_chk' => 0, 'audio' => 1, 'title' => 1, 'tags'=> 1, 'duration' => 1], 'active' => 0];
    $options['tabs']['video'] = ['cols' => ['multi_asset_chk' => 0, 'video' => 1, 'title' => 1, 'tags' => 1, 'duration' => 1], 'active' => 1, 'play' => 1];
    $options['tabs']['text'] = ['cols' => ['multi_asset_chk' => 0, 'text' => 1, 'title' => 1, 'tags' => 1, 'format' => 1], 'active' => 0];
    $variables['media_kit_three'] = \Drupal::service('media.kit.selector')->getMediaKitMKS($options);
    //$variables['media_kit_three'] = '';
    
    $libraries[] = 'media_vault_tool/react.min';
		$libraries[] = 'media_vault_tool/react.dom.min';
		$libraries[] = 'media_vault_tool/axios';
		$libraries[] = 'media_vault_tool/km_global';
    $libraries[] = 'media_kit_selector/media.kit.global';
    
    // render data into template
    $render_data['theme_data'] = [
    '#theme'                  => 'media-kit-service',
    '#variables'              => $variables,
    '#attached'               => [
      'library' => $libraries, 
      'drupalSettings' => [
          'media_base_url' => $base_secure_url, 
          'user_id' => $uid,
        ],
      ],
    ];
    return $render_data;  
  }
}
