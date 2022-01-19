<?php

namespace Drupal\autocomplete_advanced\Controller;

use Drupal\Component\Utility\Crypt;
use Drupal\Component\Utility\Tags;
use Drupal\Core\Site\Settings;
use Drupal\system\Controller\EntityAutocompleteController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Drupal\taxonomy\Entity\Term;
use Drupal\node\Entity\Node;
use Drupal\media\Entity\Media;

/**
 * Defines a route controller for entity autocomplete form elements.
 */
class AutocompleteAdvancedController extends EntityAutocompleteController {

  /**
   * {@inheritdoc}
   */
  public function handleAutocomplete(Request $request, $target_type, $selection_handler, $selection_settings_key) {
    $matches = [];
    // Get the typed string from the URL, if it exists.
    $input = trim($request->query->get('q'));
    if (!empty($input)) {
      $typed_string = Tags::explode($input);
      $typed_string = array_pop($typed_string);
    } else {
            // Select without entering something.
      $typed_string = '';
    }

      // Selection settings are passed in as a hashed key of a serialized array
      // stored in the key/value store.
      $selection_settings = $this->keyValue->get($selection_settings_key, FALSE);
      if ($selection_settings !== FALSE) {
        $selection_settings_hash = Crypt::hmacBase64(serialize($selection_settings) . $target_type . $selection_handler, Settings::getHashSalt());
        if ($selection_settings_hash !== $selection_settings_key) {
          // Disallow access when the selection settings hash does not match the
          // passed-in key.
          throw new AccessDeniedHttpException('Invalid selection settings key.');
        }
      }
      else {
        // Disallow access when the selection settings key is not found in the
        // key/value store.
        throw new AccessDeniedHttpException();
      }

      $matches = $this->matcher->getMatches($target_type, $selection_handler, $selection_settings, $typed_string);

      $items = [];
      foreach ($matches as $item) {
        $items[$item['value']] = $item['label'];
      }

      $matches = $items;
      //print_r($matches);

    return new JsonResponse($matches);
  }
  
  /**
   * deleteTaxonomy()
   */
  public function deleteTaxonomy($vid, $term){
    $tids = \Drupal::entityQuery('taxonomy_term')
      ->condition('vid', $vid)
      ->condition('name', "%$term%", 'like')
      ->execute();
    
    foreach($tids as $tid){
      if ($term = \Drupal\taxonomy\Entity\Term::load($tid)) {
        // delete the term itself
        try{
          $term->delete();
        }catch(Exception $e){
          
        }
      }
    }
    
    /*
    $controller = \Drupal::entityTypeManager()->getStorage('taxonomy_term');
    $entities = $controller->loadMultiple($tids);
    echo '<pre>'; print_r($entities); echo '</pre>'; die('here');
    $controller->delete($entities);
    */
    
    echo '<pre>'; print_r($tids); echo '</pre>'; die('here');
  }
	
	/**
   * get all default terms of field_keyword field and 
	 * load them on field instance with entity Id.
	 * $type = node type or media
	 * $entity_id = nid or mid
   */
	public function getTagsTerms($type, $entity_id){
		$entities = [];
		if($entity_id && is_numeric($entity_id) && !empty($type)){
			if($type == 'kaboodle' || $type == 'metadata_preset'){
				$node = Node::load($entity_id);
			} else if($type == 'media'){
				$media = Media::load($entity_id);				
			}
			if(is_object($node) && !empty($node)){
				$keywords = $node->field_keywords;
				$styles = $node->field_style;
			} else if(is_object($media) && !empty($media)){
				$keywords = $media->field_keywords;
				$styles = $media->field_style;
			}
			if(!empty($keywords)){
				foreach($keywords as $key => $keyword){
					$term = Term::load($keyword->target_id);
					$name = $term->getName();
					$entities[] = ['name' => $name, 'new_name' => $name . ' ('.$term->Id().')'];		
				}
			}
			if(!empty($styles)){
				foreach($styles as $key => $style){
					$style_term = Term::load($style->target_id);
					$style_name = $style_term->getName();
					$entities[] = ['name' => $style_name, 'new_name' => $style_name . ' ('.$style_term->Id().')'];		
				}
			}
		}
		return new JsonResponse($entities);
	} 
}
