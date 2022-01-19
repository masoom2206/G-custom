<?php
namespace Drupal\video_maker_tool;
use Drupal\Core\Site\Settings;
use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\Core\DependencyInjection\ServiceProviderBase;
use Symfony\Component\DependencyInjection\Reference;

/**
 * The stream wrapper class.
 *
 * In the docs for this class, anywhere you see "<scheme>", it can mean either
 * "s3" or "public", depending on which stream is currently being serviced.
 */
class VideoServiceProvider extends ServiceProviderBase {

  /**
   * Modifies existing service definitions.
   *
   * @param ContainerBuilder $container
   *   The ContainerBuilder whose service definitions can be altered.
   */
  public function alter(ContainerBuilder $container) {
    
  }

  /**
   * Register dynamic service definitions.
   *
   * @param ContainerBuilder $container
   *   The ContainerBuilder whose service definitions can be checked.
   */
  public function register(ContainerBuilder $container) {
    
  }

}
