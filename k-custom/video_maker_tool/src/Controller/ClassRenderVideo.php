<?php 
namespace Drupal\video_maker_tool\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\node\Entity\Node;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;

class ClassRenderVideo {
  /**
   * Callback function editRenderVideo()
   * to get the user media kit list.
   **/
  public function editRenderVideo($video_id){
    if(isset($_REQUEST['team'])){
      $uid = $_REQUEST['uid'];
    }
    else {
      $uid = \Drupal::currentUser()->id();
    }
    $video_id = \Drupal::request()->request->get('video_id');
    
    $data = array();
    // get default media kit
    $data['default_kit'] = \Drupal::service('km_product.templates')->getDefaultMediaKit($uid);
    
    // get media kits
    $query_media_kit = \Drupal::database()->select('node_field_data', 'n')
        ->fields('n', ['nid', 'title'])
        ->condition('n.uid', $uid, '=')->condition('n.type', 'media_kit', '=');
    $nids_media_kit = $query_media_kit->execute()
        ->fetchAll();
    $data['media_kit'] = $nids_media_kit;
    
    if($video_id > 0){
      $query = \Drupal::database()->select('vmt_videos', 'v');
      $query->fields('v', ['video_name', 'media_preset_id', 'render_data']);
      $query->condition('v.video_id', $video_id, '=');
      $video = $query->execute()->fetchObject();
      
      $render_data = json_decode($video->render_data);
      $render_data->title = $video->video_name;
      $data['render_data'] = $render_data;
      // video preset dimension 
      $data['preset'] = \Drupal::service('media.preset')->getMediaPresetProperties($video->media_preset_id, 'array'); 
    }
    
		return $data;
  }
  
  
  /**
   * Callback function renderVideoProduct()
   * to create new media.
   **/
  public function renderVideoProduct($video_id, $data){
    $debug = [];
    $archived     = empty($data['archieve']) ? 0 : 1;
    $description  = $data['description'];
    $media_kits   = $data['media_kits'];
    $tags_data    = $data['tags'];
    
    $query = \Drupal::database()->select('vmt_videos', 'v');
    $query->fields('v', ['video_id', 'video_name', 'user_id', 'media_preset_id', 'video_media_id']);
    $query->condition('v.video_id', $video_id, '=');
    $video = $query->execute()->fetchObject();
    $uid = $video->user_id;
    $media_title  = $video->video_name;

    $tags = [];
		if (is_array($tags_data) ){
			foreach($tags_data as $term_text){
        $tags[] = getTagsByTermId(trim($term_text), $uid);
			}
		}
    
    if($video->video_media_id == 0){
      //create new media
      $media_new = Media::create([
        'bundle' => 'video', 
        'name' => $media_title,
        'field_description_plain_text' => ['value' => $description, ],
        'field_copyright_number' => ['value' => '', ],
        'field_favorite' => ['value' => '', ],
        'field_archived' => ['value' => $archived, ],
        'field_media_source_type' => ['value' => 'generated', ],
        'field_format' => ['value' => '.mp4', ],
       ]);
      $media_new->uid = $uid;
    }else{
      $media_new = Media::load($video->video_media_id); 
    }
    
    $media_new->set('name', $media_title);
    $media_new->set('field_archived', $archived);
    $media_new->set('field_description_plain_text', $description);
    $media_new->field_made_from_preset->target_id = $video->media_preset_id;
    // check the "Render pending" check box when adding a video to the processing / rendering queue
    $media_new->set('field_render_status', 'Pending');
    $media_new->set('field_keywords', $tags);
    
    // save media
    $media_new->save();
    $mid = $media_new->id();
    $debug['mid'] = $mid;
    
    // update video with media
    \Drupal::database()->update('vmt_videos')
      ->fields(['video_media_id' => $mid])
      ->condition('video_id', $video_id)
      ->execute();

    // associate media with media vault
    $media_vault_id = \Drupal::database()->select('node_field_data', 'n')->fields('n', ['nid'])->condition('n.uid', $uid, '=')->condition('n.type', 'media_vault', '=')->orderBy('n.nid', 'desc')->range(0, 1)->execute()->fetchField();
    // media_voult_id to append new media item
    $debug['media_vault_id'] = $media_vault_id;
    if(!empty($media_vault_id)) {
      $voult = Node::load($media_vault_id);
      $items = $voult->get('field_vault_video')->getValue();
      $vmids = [];
      foreach($items as $key =>$value){
        $vmids[] = $value['target_id'];
      }
      // check if already appended or not
      if(!in_array($mid, $vmids)){
        $voult->get('field_vault_video')->appendItem(['target_id' => $mid]);
        $voult->save();
      }
    }   
   
    // associate media with media kits
    $all_media_kits = \Drupal::database()->select('node_field_data', 'n')->fields('n', ['nid'])->condition('n.uid', $media_new->getOwnerId() , '=')->condition('n.type', 'media_kit', '=')->execute()->fetchAll();
    // remove media file from the media kits
    foreach($all_media_kits as $kit){
      $node_kit = Node::load($kit->nid);
      $items = $node_kit->get('field_vault_video')->getValue();
      foreach($items as $key =>$value){
        if($value['target_id'] == $mid){
          $debug['mkit_rmid'][$kit->nid][] = $key;
          $node_kit->get('field_vault_video')->removeItem($key);
          $node_kit->save();
        }
      } 
    }

    // add media file to the selected media kits
    if(is_array($media_kits)) {
      foreach($media_kits as $kit){
        $node_kit = Node::load($kit);
        $items = $node_kit->get('field_vault_video')->getValue();
        $kmids = [];
        foreach($items as $key =>$value){
          $kmids[] = $value['target_id'];
        }
        
        if(!in_array($mid, $kmids)){
          $debug['mkit_rmid'][$kit][] = $mid; 
          $node_kit->get('field_vault_video')->appendItem(['target_id' => $mid]);
          $node_kit->save();
        }
      }
    }
    
    /*
    echo '<pre>'; print_r($video); echo '</pre>';    
    echo '<pre>'; print_r($debug); echo '</pre>';
    die();
    */

		return $mid;
  }
}
