<?php
namespace Drupal\media_vault_tool\Normalizer;

use Drupal\serialization\Normalizer\ContentEntityNormalizer;
use Drupal\media\Entity;
use Drupal\media\Entity\Media;
use Drupal\taxonomy\Entity\Term;
use Drupal\file\Entity\File;
use Drupal\node\Entity\Node;
use Drupal\s3fs\S3fsService;

/**
 * Converts the media entity object structures to a normalized array.
 * The interface or class that this Normalizer supports.
 */
class MediaEntityNormalizer extends ContentEntityNormalizer {
  /**
   * @var \Drupal\media\Entity\Media $entity 
   */
  public function normalize($entity, $format = NULL, array $context = array()) {
    $current_uid = (int)\Drupal::currentUser()->id();
    $attributes = parent::normalize($entity, $format, $context);  
    $original_style = \Drupal::entityTypeManager()->getStorage('image_style')->load('original_style');  
    $style = \Drupal::entityTypeManager()->getStorage('image_style')->load('90x90_media_vault_photo');
    switch ($entity->getEntityTypeId()) {
      case 'media':
        $media_source = $entity->getSource();
        switch ($attributes['bundle'][0]['target_id']) {
          case 'audio':
            $media = Media::load($attributes['mid'][0]['value']);
            $mediaOwnerId = (int)$media->getOwnerId();
            $original_url = '';
            if(!empty($media->field_media_audio_file->entity)){
              $fid = isset($attributes['field_media_audio_file'][0]['target_id']) ? $attributes['field_media_audio_file'][0]['target_id'] : 0;
              if(!empty($fid)){
                $file = File::load($fid);
                if(!empty($file)){
                  $original_url = file_create_url($file->getFileUri());
                }
              }
              $attributes['field_media_audio_file'][0]['original_url'] = $original_url;
              $config = \Drupal::config('s3fs.settings')->get();
              $s3 = s3fsService::getAmazonS3Client($config);
              $urls = $media->field_media_audio_file->entity->getFileUri();
              $half_url = explode('//',$urls);
              $output_file = $media->field_media_audio_file->entity->getFilename();
              $key = 's3fs_private/'.$half_url[1];
              $audiopath = $s3->getObjectUrl($config['bucket'], $key);
              $attributes['field_media_audio_file'][0]['download_url'] = $audiopath;
              // get defuat path
               $key = 'images/buttons';
               $key2 = 'images/icons';
               $imagespath = $s3->getObjectUrl($config['bucket'], $key);
               $imagespath2 = $s3->getObjectUrl($config['bucket'], $key2);
               $attributes['field_media_audio_file'][0]['audio_url'] = $imagespath;
               $attributes['field_media_audio_file'][0]['default_url'] = $imagespath2;
            }
            if(!empty($media->field_audio_image->entity)){
              $afid = isset($attributes['field_audio_image'][0]['target_id']) ? $attributes['field_audio_image'][0]['target_id'] : 0;
              if(!empty($afid)){
                $afile = File::load($afid);
                if(!empty($afile)){
                  $aoriginal_url = file_create_url($afile->getFileUri());
                }
              }
              $attributes['field_audio_image'][0]['original_url'] = $aoriginal_url;
              
            }
            if(!empty($attributes['field_keywords'])){
              $keywords = $media->field_keywords;
              foreach($keywords as $key => $keyword){
                $term = Term::load($keyword->target_id);
                $name = $term->getName();
                $attributes['field_keywords'][$key]['name'] = $name;			
              }
            }
          break;
     
          case 'image':
            $media = Media::load($attributes['mid'][0]['value']);
            $mediaOwnerId = $media->getOwnerId();
            $original_url     = '';
            $style_url        = '';
            $modal_style_url  = '';
            $media_style_url  = '';
            $online_gallery_style_url = '';
            $thumbnail_35_style_url = '';
            $thumbnail_extension = '';
            if(!empty($media->field_media_image->entity)){
              $mimetype = $media->field_media_image->entity->getMimeType();
              //if(in_array($mimetype, array('image/jpg', 'image/jpeg', 'image/png', 'image/tiff', 'image/heic', 'image/heif', 'image/heic-sequence', 'image/heif-sequence'))){
                // thumbnail
                $style_url = $style->buildUrl($media->field_media_image->entity->getFileUri());
                // large image
                $modal_style = \Drupal::entityTypeManager()->getStorage('image_style')->load('image_modal');
                $modal_style_url = $modal_style->buildUrl($media->field_media_image->entity->getFileUri());
                $image_import_style = \Drupal::entityTypeManager()->getStorage('image_style')->load('25x25_media_kit');
                $image_import_url = $image_import_style->buildUrl($media->field_media_image->entity->getFileUri());
                // video maker tool
                $media_style = \Drupal::entityTypeManager()->getStorage('image_style')->load('media_thumbnail');
                $media_style_url = $media_style->buildUrl($media->field_media_image->entity->getFileUri());
                // online gallery
                $online_style = \Drupal::entityTypeManager()->getStorage('image_style')->load('online_gallery');
                $online_gallery_style_url = $online_style->buildUrl($media->field_media_image->entity->getFileUri());
                
                // 35x35_thumbnail
                $thumbnail_35 = \Drupal::entityTypeManager()->getStorage('image_style')->load('35x35_thumbnail');
                $thumbnail_35_style_url = $thumbnail_35->buildUrl($media->field_media_image->entity->getFileUri());
                
                //thumbnail extension
                $thumbnail_extension = pathinfo($media->field_media_image->entity->getFileUri(),PATHINFO_EXTENSION );
              //}
              /* else if(in_array($mimetype, array('image/tiff'))){
                $style_url = file_create_url($media->field_media_image->entity->getFileUri());
              } */
              //$original_url = file_create_url($media->field_media_image->entity->getFileUri());
              //comment it out for getting s3 url
              /*
              $config = \Drupal::config('s3fs.settings')->get();
              $s3 = s3fsService::getAmazonS3Client($config);
              $urls = $media->field_media_image->entity->getFileUri();
              $half_url = explode('//',$urls);
              $output_file = $media->field_media_image->entity->getFilename();
              $key = 's3fs_private/'.$half_url[1];
              $command = $s3->getCommand('GetObject', array(
               'Bucket' => $config['bucket'],
               'Key'    => $key,  
               'ResponseContentDisposition' => 'attachment; filename="'.$output_file.'"'
              ));

              $response = $s3->createPresignedRequest($command, '+4 minutes');
              $presignedUrl = (string)$response->getUri();
              $fileContent = file_get_contents($presignedUrl);
              if ($fileContent){
                $directory = "public://";
                $destination = $directory . $output_file;
               \Drupal::service('file_system')->prepareDirectory($directory, \Drupal\Core\File\FileSystemInterface::CREATE_DIRECTORY);
               $file_image = file_save_data($fileContent, $destination, FILE_EXISTS_RENAME);
              }
              
              $download_url = file_create_url($file_image->getFileUri());
              header('Content-Disposition: attachment; filename="'.basename($output_file).'"');
              readfile($download_url);
              */
              $download_uri = $media->field_media_image->entity->getFileUri();
              $download_url = file_create_url($download_uri);
              $original_url = $original_style->buildUrl($media->field_media_image->entity->getFileUri());
            }
            $attributes['field_media_image'][0]['download_url']     = $download_url;
            $attributes['field_media_image'][0]['original_url']     = $original_url;
            $attributes['field_media_image'][0]['image_style']      = $style_url;
            $attributes['field_media_image'][0]['modal_style_url']  = $modal_style_url;
            $attributes['field_media_image'][0]['image_import_url'] = $image_import_url;
            $attributes['field_media_image'][0]['media_style_url']  = $media_style_url;
            $attributes['field_media_image'][0]['online_gallery_style_url']  = $online_gallery_style_url;
            $attributes['field_media_image'][0]['thumbnail_35_style_url']  = $thumbnail_35_style_url;
            $attributes['field_media_image'][0]['thumbnail_extension']  = $thumbnail_extension;
            
            if(!empty($attributes['field_keywords'])){
              $keywords = $media->field_keywords;
              foreach($keywords as $key => $keyword){
                $term = Term::load($keyword->target_id);
                $name = $term->getName();
                $attributes['field_keywords'][$key]['name'] = $name;			
              }
            }
          break;
     
          case 'text':
            $media = Media::load($attributes['mid'][0]['value']);
            $mediaOwnerId = $media->getOwnerId();
            $original_url = '';
            if(!empty($media->field_media_file->entity) && isset($attributes['field_media_file'][0]['target_id'])){
              $fid = isset($attributes['field_media_file'][0]['target_id']) ? $attributes['field_media_file'][0]['target_id'] : 0;
              if(!empty($fid)){
                $file = File::load($fid);
                if(!empty($file)){
                  $original_url = file_create_url($file->getFileUri());
                }
              }
              
              
              $config = \Drupal::config('s3fs.settings')->get();
              $s3 = s3fsService::getAmazonS3Client($config);
              $urls = $media->field_media_file->entity->getFileUri();
              $half_url = explode('//',$urls);
              $output_file = $media->field_media_file->entity->getFilename();
              $key = 's3fs_private/'.$half_url[1];
              $command = $s3->getCommand('GetObject', array(
               'Bucket' => $config['bucket'],
               'Key'    => $key,  
               'ResponseContentDisposition' => 'attachment; filename="'.$output_file.'"'
              ));
              $response = $s3->createPresignedRequest($command, '+40 minutes');
              $presignedUrl = (string)$response->getUri();
              $attributes['field_media_file'][0]['original_url'] = $original_url;
              $attributes['field_media_file'][0]['download_url']  = $presignedUrl;
              // $download_uri = $media->field_media_file->entity->getFileUri();
             // $download_url = file_create_url($download_uri);
            //  $attributes['field_media_file'][0]['download_url']  = $download_url;
            }
            if(!empty($attributes['field_keywords'])){
              $keywords = $media->field_keywords;
              foreach($keywords as $key => $keyword){
                $term = Term::load($keyword->target_id);
                $name = $term->getName();
                $attributes['field_keywords'][$key]['name'] = $name;			
              }
            }
          break;
     
          case 'video':
						$fileUri = '';
            $media = Media::load($attributes['mid'][0]['value']);
            $mediaOwnerId = $media->getOwnerId();
            if(!empty($media->field_media_video_file->entity) && isset($attributes['field_media_video_file'][0]['target_id'])){
              $fid = isset($attributes['field_media_video_file'][0]['target_id']) ? $attributes['field_media_video_file'][0]['target_id'] : 0;
              if(!empty($fid)){
                $file = File::load($fid);
                if(!empty($file)){
                  $fileUri = file_create_url($file->getFileUri());
                }
              }
            }
            
            
            // video thumbnail
            $is_thumbnail = false;
            $style_url = $fileUri;
            $media_style_url = '';
            if(!empty($attributes['field_video_thumbnail'])){
              $is_thumbnail = true;
              $media = Media::load($attributes['mid'][0]['value']);
              if(!empty($media->field_video_thumbnail->entity)){
                $mimetype = $media->field_video_thumbnail->entity->getMimeType();
                if(in_array($mimetype, array('image/jpeg', 'image/png'))){
                  $style_url = $style->buildUrl($media->field_video_thumbnail->entity->getFileUri());
                  // video maker tool
                  $media_style = \Drupal::entityTypeManager()->getStorage('image_style')->load('media_thumbnail');
                  $media_style_url = $media_style->buildUrl($media->field_video_thumbnail->entity->getFileUri());
                }
              }
            } else {
              $is_thumbnail = true;
              $field_info = \Drupal\field\Entity\FieldConfig::loadByName('media', 'video', 'field_video_thumbnail');
              $image_uuid = $field_info->getSetting('default_image')['uuid'];
              $default_image = \Drupal::service('entity.repository')->loadEntityByUuid('file', $image_uuid)->getFileUri();
              $style_url = $style->buildUrl($default_image);
              // video maker tool
              $media_style = \Drupal::entityTypeManager()->getStorage('image_style')->load('media_thumbnail');
              $media_style_url = $media_style->buildUrl($default_image);
            }
            
            $attributes['field_media_video_file'][0]['is_thumbnail'] = $is_thumbnail;
            $attributes['field_media_video_file'][0]['original_url'] = $fileUri;
            $attributes['field_media_video_file'][0]['image_style'] = $style_url;
            $attributes['field_media_video_file'][0]['media_style_url'] = $media_style_url;
            if(!empty($attributes['field_keywords'])){
              $keywords = $media->field_keywords;
              foreach($keywords as $key => $keyword){
                $term = Term::load($keyword->target_id);
                $name = $term->getName();
                $attributes['field_keywords'][$key]['name'] = $name;			
              }
            }
          break;
        }
      break;
      /*case 'node':
        //if($attributes['type'][0]['target_id'] == 'media_vault' || $attributes['type'][0]['target_id'] == 'media_kit'){
        if($attributes['type'][0]['target_id'] == 'media_vault'){
          if(isset($attributes['field_vault_audio'][0]['target_id'])){
            $medias = array();
            foreach($attributes['field_vault_audio'] as $key=>$vault_audio){
              $media = Media::load($vault_audio['target_id']);
              $mediaOwnerId = (int)$media->getOwnerId();
              if($current_uid !== $mediaOwnerId){
                unset($attributes['field_vault_audio'][$key]);
              }
              if(in_array($vault_audio['target_id'], $medias)){
                unset($attributes['field_vault_audio'][$key]);
              }
              else {
                $medias[$vault_audio['target_id']] = $vault_audio['target_id'];
              }
            }
          }
          if(isset($attributes['field_vault_file'][0]['target_id'])){
            $medias = array();
            foreach($attributes['field_vault_file'] as $key=>$vault_file){
              $media = Media::load($vault_file['target_id']);
              $mediaOwnerId = (int)$media->getOwnerId();
              if($current_uid !== $mediaOwnerId){
                unset($attributes['field_vault_file'][$key]);
              }
              if(in_array($vault_file['target_id'], $medias)){
                unset($attributes['field_vault_file'][$key]);
              }
              else {
                $medias[$vault_file['target_id']] = $vault_file['target_id'];
              }
            }
          }
          if(isset($attributes['field_vault_photo'][0]['target_id'])){
            $medias = array();
            foreach($attributes['field_vault_photo'] as $key=>$vault_photo){
              $media = Media::load($vault_photo['target_id']);
              $mediaOwnerId = (int)$media->getOwnerId();
              if($current_uid !== $mediaOwnerId){
                unset($attributes['field_vault_photo'][$key]);
              }
              if(in_array($vault_photo['target_id'], $medias)){
                unset($attributes['field_vault_photo'][$key]);
              }
              else {
                $medias[$vault_photo['target_id']] = $vault_photo['target_id'];
              }
            }
          }
          if(isset($attributes['field_vault_video'][0]['target_id'])){
            $medias = array();
            foreach($attributes['field_vault_video'] as $key=>$vault_video){
              $media = Media::load($vault_video['target_id']);
              $mediaOwnerId = (int)$media->getOwnerId();
              if($current_uid !== $mediaOwnerId){
                unset($attributes['field_vault_video'][$key]);
              }
              if(in_array($vault_video['target_id'], $medias)){
                unset($attributes['field_vault_video'][$key]);
              }
              else {
                $medias[$vault_video['target_id']] = $vault_video['target_id'];
              }
            }
          }
        }
        // else if($attributes['type'][0]['target_id'] == 'media_kit'){
          // print "<pre>";print_r($attributes['field_vault_photo']);exit;
        // }
      break;*/
    }
    // Re-sort the array after our new additions
    ksort($attributes);
    
    // Return the $attributes with our new values
    return $attributes;
  }
}