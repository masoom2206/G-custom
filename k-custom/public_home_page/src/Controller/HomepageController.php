<?php

namespace Drupal\public_home_page\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Url;
use Drupal\media\Entity\Media;


/**
 * Class HomepageController.
 */
class HomepageController extends ControllerBase {

  /**
   * Homepage.
   *
   * @return string
   *   Return Hello string.
   */
  public function homepage() {
    \Drupal::service('page_cache_kill_switch')->trigger();
    $query = \Drupal::entityQuery('node')
      ->condition('status', 1) //published or not
      ->condition('type', 'home_page_public') //content type
      ->sort('changed' , 'DESC')
      ->pager(1); //specify results to return
    $nids = $query->execute();
    $values = array_values( $nids);
    $nid =  $values[0];
    $node = \Drupal::entityTypeManager()->getStorage('node')->load($nid);
    $field_button_path = $node->get('field_button_path')->value;
    $field_home_action_disclaimer = $node->get('field_home_action_disclaimer')->value;
    $field_home_action_headline = $node->get('field_home_action_headline')->value;
    $field_home_action_text = $node->get('field_home_action_text')->value;
    $field_home_button_label = $node->get('field_home_button_label')->value;
    $field_home_headline = $node->get('field_home_headline')->value;
    $field_home_page_slide = $node->get('field_home_page_slide')->value;
    $field_show_media_as = $node->get('field_show_media_as')->value;
    $field_home_page_slide =  $node->get('field_home_page_slide')->getString();
    $field_show_media_as =  $node->get('field_show_media_as')->value;
    if ($field_show_media_as == 'random') {
      $key = array_rand($node->get('field_home_page_slide')->getValue(), 1);
      $mid = $node->get('field_home_page_slide')->getValue()[$key]['target_id'];
      $media = Media::load($mid);
      if ($media->bundle() == 'site_images' ) {
        $target_id = $media->field_media_image_2->target_id;
        $file = \Drupal\file\Entity\File::load($target_id);
        $home_image = \Drupal\image\Entity\ImageStyle::load('home_image')->buildUrl($file->getFileUri());
        $slider = '<img src="'.$home_image.'" style="width:100%;"/>';
      } else {
        $video_url = $media->field_media_video_embed_field->value;
        $slider = '<iframe width="100%" height="100%" src="'.$video_url.'"></iframe>';
      }
    } else {
      $slider = '<div id="slide-home" class="owl-carousel owl-theme">';
      foreach ($node->get('field_home_page_slide')->getValue() as $key => $values) {
        $media = Media::load($values['target_id']);
        if ($media->bundle() == 'site_images' ) {
          $target_id = $media->field_media_image_2->target_id;
          $file = \Drupal\file\Entity\File::load($target_id);
          $home_image = \Drupal\image\Entity\ImageStyle::load('home_image')->buildUrl($file->getFileUri());
          $slider .= '<div class="item"><img src="'.$home_image.'" alt="" style="width:100%;" /></div>';
        }
        else {
          $video_url = $media->field_media_video_embed_field->value;
          $slider .= '<div class="item-video"><a class="owl-video" href="'.$video_url.'"></a></div>';
        }
      }
      $slider .= '</div>';
    }
    return [
      // Your theme hook name.
      '#theme' => 'public_home_page',      
      // Your variables.
      '#field_button_path' => $field_button_path,
      '#field_home_action_disclaimer' => $field_home_action_disclaimer,
      '#field_home_action_headline' => $field_home_action_headline,
      '#field_home_action_text' => $field_home_action_text,
      '#field_home_button_label' => $field_home_button_label,
      '#field_home_headline' => $field_home_headline,
      '#field_home_page_slide' => $slider,
      '#field_show_media_as' => $field_show_media_as,
      '#attached' => [
        'library' => [
          'public_home_page/public_home_page'
        ]
      ]
    ];
  }

}
