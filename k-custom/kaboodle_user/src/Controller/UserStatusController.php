<?php

namespace Drupal\kaboodle_user\Controller;

use Drupal\user\Entity\User;
use Drupal\Core\Controller\ControllerBase;

/**
 * Interfaces with user nodes that have the lms_user_student role assigned to them.
 */
class UserStatusController extends ControllerBase {

  /**
   * Probvides functionality to get user status.
   * @param \Drupal\user\Entity\User $user
  */
  public function getUserStatus($user) {
		$query = \Drupal::entityQuery('node')->condition('uid', $user->id())->condition('type', 'media_vault');
		$nids = $query->execute();
		foreach($nids as $node_id){
			//getting video status
			$media_video = \Drupal::database()->select('node__field_vault_video', 'k');
			$media_video->condition('k.entity_id', $node_id, '=');
			$media_video->condition('k.bundle', 'media_vault', '=');
			$media_video->fields('k', ['field_vault_video_target_id']);
			$video_status = $media_video->execute()->fetchField();
			//getting audio status
			$media_audio = \Drupal::database()->select('node__field_vault_audio', 'k');
			$media_audio->condition('k.entity_id', $node_id, '=');
			$media_audio->condition('k.bundle', 'media_vault', '=');
			$media_audio->fields('k', ['field_vault_audio_target_id']);
			$audio_status = $media_audio->execute()->fetchField();
			//getting file status
			$media_file = \Drupal::database()->select('node__field_vault_file', 'k');
			$media_file->condition('k.entity_id', $node_id, '=');
			$media_file->condition('k.bundle', 'media_vault', '=');
			$media_file->fields('k', ['field_vault_file_target_id']);
			$file_status = $media_file->execute()->fetchField();
			//getting photo status
			$media_photo = \Drupal::database()->select('node__field_vault_photo', 'k');
			$media_photo->condition('k.entity_id', $node_id, '=');
			$media_photo->condition('k.bundle', 'media_vault', '=');
			$media_photo->fields('k', ['field_vault_photo_target_id']);
			$photo_status = $media_photo->execute()->fetchField();
		}
		//get onbording status
		$onborading_status = $user->field_onboarding_user_status->value;
		if((!$video_status and !$audio_status and !$file_status and !$photo_status) and ($onborading_status == NULL or $onborading_status == 0) ){
			return 'false';
		}
		else{
			return 'true'; 
		}     
	}
}
