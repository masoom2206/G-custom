<?php
namespace Drupal\audio_asset_editor\Controller;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Drupal\file\Entity\File;
use Drupal\media\Entity\Media;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Core\Link;
use Drupal\Core\Url;

class AudioAssetEditorController extends ControllerBase {
  /**
   * Returns audio templates page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function getAudioAssetEditor(Media $media){
        global $base_secure_url;
        $account = \Drupal::currentUser();
        $uid = $account->id();
        if (is_object($media)) {
            if ($media->hasField('field_audio_image')) {
                $targetid = $media->field_media_image->target_id;
                $file = File::load($targetid);
                $media_data['mid_url'] = file_create_url($file->getFileUri());
            }
           
        }

         $response = \Drupal::service('social_media.social_media_controller')->getMediaPreset();
         $media_preset = json_decode($response->getContent()); 
         $data['media_preset'] = $media_preset;         
         $data['content'] = 'image editor content';
        $libraries[] = 'audio_asset_editor/audio_asset.editor';
        $render_data['theme_data'] = [
        '#theme'                  => 'audio_asset_editor',
        '#data'                   => $data,
        '#attached'               => [
          'library' => $libraries, 
          'drupalSettings' => [
              'media_base_url' => $base_secure_url, 
              'user_id' => $uid,
             // 'media_data' => $media_data,
            ],
          ],
        ];
        

        return $render_data;    
        }
}

