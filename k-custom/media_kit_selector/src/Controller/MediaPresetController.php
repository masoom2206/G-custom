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

class MediaPresetController extends ControllerBase {  
  /**
   * Returns media preset
   *
   * @return array
   *   A simple renderable array.
   */
  public function getMediaPresetProperties($preset_id, $data = 'json'){
    $properties = [];
    if($preset_id > 0) {
      $terms_obj =\Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($preset_id);
      $properties['preset_name']      = $terms_obj->name->value;
      $properties['transcoder_specs'] = $terms_obj->field_transcoder_specs->value;
      
      // unit of measurement
      $field_unit_of_measurement = $terms_obj->field_unit_of_measurement->value;

      if($field_unit_of_measurement == "pixels" ){
        //dimensions are already in Pixels
        $properties['height']     = $terms_obj->field_y_height->value;
        $properties['width']      = $terms_obj->field_x_width->value;
      }
      else if($field_unit_of_measurement == "inches"){
        // need to convert dimensions into Pixels
        $properties['height']     = ($terms_obj->field_y_height->value)*96;
        $properties['width']      = ($terms_obj->field_x_width->value)*96;
      }
      else if($field_unit_of_measurement == "centimeters"){
        // need to convert dimensions into Pixels
        $properties['height']     = ($terms_obj->field_y_height->value)*37.795275591;
        $properties['width']      = ($terms_obj->field_x_width->value)*37.795275591;
      }
      else if($field_unit_of_measurement == "millimeter"){
        // need to convert dimensions into Pixels
        $properties['height']     = ($terms_obj->field_y_height->value)*3.7795275591;
        $properties['width']      = ($terms_obj->field_x_width->value)*3.77952755911;
      }
      else if($field_unit_of_measurement == "picas"){
        // need to convert dimensions into Pixels
        $properties['height']     = ($terms_obj->field_y_height->value)*16;
        $properties['width']      = ($terms_obj->field_x_width->value)*16;
      }
      else if($field_unit_of_measurement == "points"){
        // need to convert dimensions into Pixels
        $properties['height']     = ($terms_obj->field_y_height->value)*1.3333333333333333;
        $properties['width']      = ($terms_obj->field_x_width->value)*1.3333333333333333;
      }
      else{
        // need to convert dimensions into Pixels
        // considered pixel as default
        $properties['height']     = ($terms_obj->field_y_height->value);
        $properties['width']      = ($terms_obj->field_x_width->value);
      }
    }
    
    if($data == 'json') {
      return new JsonResponse($properties);
    }else{
      return $properties;
    }
    
  }
}
