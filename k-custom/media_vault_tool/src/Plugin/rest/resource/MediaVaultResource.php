<?php

namespace Drupal\media_vault_tool\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;

/**
 * Provides a MediaVault Resource
 *
 * @RestResource(
 *   id = "media_vault_resource",
 *   label = @Translation("Media Vault Resource"),
 *   uri_paths = {
 *     "canonical" = "/media_vault_api/media_node_data"
 *   }
 * )
 */
class MediaVaultResource extends ResourceBase {

  /**
   * Responds to entity GET requests.
   * @return \Drupal\rest\ResourceResponse
   */
  public function get() {
    $response = ['message' => 'Uplaod process'];
    return new ResourceResponse($response);
  }
}
