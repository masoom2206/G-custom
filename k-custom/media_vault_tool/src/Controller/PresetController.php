<?php
 
/**
* @file
* Contains \Drupal\media_vault_tool\Controller\PresetController.php
*
*/
 
namespace Drupal\media_vault_tool\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\node\NodeInterface;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;
use Drupal\file\Entity;
use Drupal\node\Entity\Node;
use Drupal\getid3\getid3_load;
use Drupal\getid3\getid3_analyze;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\Url;
use Drupal\Core\Access\AccessResult;

class PresetController extends ControllerBase {

  /**
   * Provides the node submission form.
   *
   * @param \Drupal\node\NodeInterface $node
   *   The node type entity for the node.   
	 * @param \Drupal\media\Entity\Media $media
   *   The media type entity for the media.
   *
   */
  public function mediaDupe(NodeInterface $node, \Drupal\media\MediaInterface $media, $m_type) {	
		$uid = \Drupal::currentUser()->id();
		$response = '';
		$mid = $media->mid->value;
		//$m_type = $media->bundle->value;
		if($m_type == 'image'){
			$fid = $media->field_media_image->target_id;
			$file = File::load($fid);
			$file_path = $file->getFileUri();
			list($width, $height) = getimagesize($file_path); 
			$id3file = NULL;
			$id3_lib_availability = getid3_load();
			if($id3_lib_availability == FALSE){
				drupal_set_message(t("The getid3() module cannot find the getID3 library used to read and write ID3 tags. The site administrator will need to verify that it is installed and then update the <a href='!admin-settings-audio-getid3'>settings</a>.", array('!admin-settings-audio-getid3' => Url::fromRoute('getid3.config'))), 'error', FALSE);
				return $id3file;
			}
			$id3file = getid3_analyze($file_path);
			$pathinfo = pathinfo($id3file['filenamepath']);
			$extName = $pathinfo['extension']; 
			
      if($id3file['video']['dataformat'] == 'png') {
        if(isset($id3file['png']['IHDR']['raw']['bit_depth'])){
          $bit_depth = $id3file['png']['IHDR']['raw']['bit_depth'] . '-bit';
        }
      }
      if($id3file['video']['dataformat'] == 'jpg' || $id3file['video']['dataformat'] == 'jpeg') {
        $bit_depth = isset($id3file['video']['bits_per_sample']) ? $id3file['video']['bits_per_sample'] . '-bit' : '';
      }

      $media_image = Media::create([
        'bundle' => 'image',
        'name' => $media->name->value,
        'field_media_image' => [
          'target_id' => $file->id(),
          'display' => true,
        ],
        'field_file_size' => [
          'value' => $this->getFormatedFileSize($file->get('filesize')->getValue()[0]['value']),
        ],
        'field_format' => [
          'value' => '.'.$extName,
        ],
        'field_pixel_dimentions' => [
          'value' => $width . ' px x ' . $height . ' px',
        ],
        'field_bit_depth' => [
          'value' => $bit_depth,
        ],
				'field_label' => [
          'target_id' => $media->field_label->target_id,
        ],
				'field_rating' => [
          'target_id' => $media->field_rating->target_id,
        ],
				'field_description_plain_text' => [
          'value' => $media->field_description_plain_text->value,
        ],
      ]);
			
			foreach($media->field_keywords as $tag){
				$media_image->field_keywords[] = ['target_id' => $tag->target_id];
			}
			
      $media_image->save();
			
      $node->get('field_vault_photo')->appendItem([
        'target_id' => $media_image->id(),
      ]);
      $node->save();
			
			/* $preset = '';
			if(!empty($media->field_presets->target_id)){
				$term = Term::load($media->field_presets->target_id);
				$preset = ucfirst($media->name->value) . '-' . ucfirst($term->getName());
			} */
			
			// insert record in media_preset table
			$result = \Drupal::database()->insert('media_preset')
				->fields([
					'preset_mid',
					'cloned_mid',
					'preset',
					'bundle',
					'entity_id',
				])
				->values(array(
					$media_image->id(),
					$mid,
					'',
					$m_type,
					$node->Id(),
				))
				->execute();
				
			$redirectpath = '/media/'.$media_image->id().'/duplicate/preset';
			return new RedirectResponse($redirectpath);
    } else {
			$redirectpath = '/tools/media/vault/'.$uid;
			return new RedirectResponse($redirectpath);;
			drupal_set_message(t('Something wrong in duplicating media.'));
		}
  }
	
	/**
   * The _title_callback for the node.add route.
   *
   * @param \Drupal\node\NodeInterface $node
   *   The current node.
   *
   * @return string
   *   The page title.
   */
  public function dupeAddPageTitle(Media $media) {
    return $this->t('Duplicate @media with Preset', ['@media' => $media->name->value]);
  }
	
	/**
   * Convert bytes to kilobytes.
   */
  public function getFormatedFileSize($filesize) {
    $units = array('KB','MB','GB','TB','PB','EB','ZB','YB');
    $bytes = $filesize;
    if($bytes <= 0){
      $bytes = number_format($bytes, 2, '.', '') . " bytes";
    }else{
      $bytes = number_format($bytes / 1024, 2, '.', '');
      for($i = 0; $i < count($units); $i++){
        if (number_format($bytes, 2, '.', '') >= 1024) {
          $bytes = number_format($bytes / 1024, 2, '.', '');
        }
        else {
          $bytes = number_format($bytes, 2, '.', '');
          break;
        }
      }
      $bytes = $bytes .' '. $units[$i];
    }
    return $bytes;
  }
	
	/**
	 * Media Preset custom access
	 */
	public function media_preset_access(Media $media){
		$data = \Drupal::database()->select('media_preset', 'p');
    $data->condition('p.preset_mid', $media->Id(), '=');
		$data->fields('p', ['preset_mid']);
    $result = $data->execute()->fetchField();
		
    if($result){
      return AccessResult::allowed();
    }
    else {
      return AccessResult::forbidden();
    }
	}
	
}