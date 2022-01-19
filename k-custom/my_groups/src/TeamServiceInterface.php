<?php

namespace Drupal\my_groups;

/**
 * Video service interface.
 */
interface TeamServiceInterface {

  /**
   * Validate the video config.
   *
   * @param $config
   *   Array of configuration settings from which to configure the client.
   *
   * @return array
   *   Empty array if configuration is valid, errors array otherwise.
   */
  function validate(array $config);

  
}
