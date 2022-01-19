<?php
namespace Drupal\my_groups\Plugin\rest\resource;

use Drupal\rest\ModifiedResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * Provides a resource to get view modes by entity and bundle.
 *
 * @RestResource(
 *   id = "private_file",
 *   label = @Translation("Private File"),
 *   uri_paths = {
 *     "canonical" = "/rest/api/file/{fid}"
 *   }
 * )
 */
class FileResource extends ResourceBase {
  /**
   * Responds to GET requests.
   *
   * @return \Drupal\rest\ResourceResponse
   *   The HTTP response object.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   *   Throws exception expected.
   */
  public function get($fid = NULL) {
    // You must to implement the logic of your REST Resource here.
    // Use current user after pass authentication to validate access.
    /*
    if (!(\Drupal::currentUser())->hasPermission('access content')) {
      throw new AccessDeniedHttpException();
    }*/
    
    $data = file_load($fid);
    $response = new ResourceResponse($data);
    // In order to generate fresh result every time (without clearing 
    // the cache), you need to invalidate the cache.
    $response->addCacheableDependency($data);
    return $response;
  }
}