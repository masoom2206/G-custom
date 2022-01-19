<?php
/** 
* Controller file for Aetl Drupal 8 module. 
* Place this file in src/Controller folder inside the Aetl module folder
**/

namespace Drupal\aetl\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\Component\Utility\Xss;
use Drupal\Core\Entity\Element\EntityAutocomplete;

/**
 * Defines a route controller for watches autocomplete form elements.
 */
class TranscoderAutocompleteController extends ControllerBase {
  /**
   * Handler for autocomplete request.
   */
  public function handleAutocomplete(Request $request) {
    $results = [];
    $bucket = 'kmet';
    //$results['pid'] =  $request->attributes->get('pid');
    $input = $request->query->get('q');
    $config = \Drupal::config('aetl.settings')->get();
    $messenger = \Drupal::messenger();
    if ($errors = \Drupal::service('aetl')->validate($config)) {
      foreach ($errors as $error) {
        $messenger->addMessage((string)$error, $messenger::TYPE_ERROR);
      }
      $messenger->addMessage('Unable to validate your aetl configuration settings. Please configure aetl File System from the admin/config/media/aetl page and try again.', $messenger::TYPE_ERROR);
      return;
    }
    $transcoder_client = \Drupal::service('aetl')->getAmazonETClient($config);
    $result = $transcoder_client->readPipeline(array(
      // Id is required
      'Id' => $request->attributes->get('pid'),
    ))->toArray();
    $bucket = isset($result['Pipeline']['InputBucket']) ? $result['Pipeline']['InputBucket'] : 'test';
    $s3Client = \Drupal::service('aetl')->getAmazonETS3Client($config);
    $response = $s3Client->listObjects(array('Bucket' => $bucket, 'MaxKeys' => 1000, 'Prefix' => $input,  'Delimiter' => '/'));
    $files = $response->getPath('Contents');
    if (count($files) > 0) {
      foreach ($files as $file) {
          $filename = $file['Key'];
          //$results[$file['Key']] = $file['ObjectURL'];
          //if (!endsWith($filename, '/')) {
            $results[] = [
              'value' => $file['Key'],
              'label' => $file['Key'],
            ];
          //}
      }
    }
    // Get the typed string from the URL, if it exists.
    if (!$input) {
      return new JsonResponse($results);
    }
    $input = Xss::filter($input);
    /*$query = $this->nodeStroage->getQuery()
      ->condition('type', 'article')
      ->condition('title', $input, 'CONTAINS')
      ->groupBy('nid')
      ->sort('created', 'DESC')
      ->range(0, 10);
    $ids = $query->execute();
    $nodes = $ids ? $this->nodeStroage->loadMultiple($ids) : [];
    foreach ($nodes as $node) {
      switch ($node->isPublished()) {
        case TRUE:
          $availability = '✅';
          break;
        case FALSE:
        default:
          $availability = '🚫';
          break;
      }
      $label = [
        $node->getTitle(),
        '<small>(' . $node->id() . ')</small>',
        $availability,
      ];
      $results[] = [
        'value' => EntityAutocomplete::getEntityLabels([$node]),
        'label' => implode(' ', $label),
      ];
    }*/
    return new JsonResponse($results);
  }
}