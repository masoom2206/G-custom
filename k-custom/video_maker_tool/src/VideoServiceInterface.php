<?php

namespace Drupal\video_maker_tool;

/**
 * Video service interface.
 */
interface VideoServiceInterface {

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
