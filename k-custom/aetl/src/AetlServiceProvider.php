<?php

namespace Drupal\aetl;

use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\Core\DependencyInjection\ServiceProviderBase;
use Drupal\Core\Site\Settings;
use Symfony\Component\DependencyInjection\Reference;

/**
 * The stream wrapper class.
 *
 * In the docs for this class, anywhere you see "<scheme>", it can mean either
 * "s3" or "public", depending on which stream is currently being serviced.
 */
class AetlServiceProvider extends ServiceProviderBase {

  /**
   * Modifies existing service definitions.
   *
   * @param ContainerBuilder $container
   *   The ContainerBuilder whose service definitions can be altered.
   */
  public function alter(ContainerBuilder $container) {
    /*if (Settings::get('aetl.use_s3_for_public')) {
      // Replace the public stream wrapper with AetlStream.
      $container->getDefinition('stream_wrapper.public')
        ->setClass('Drupal\aetl\StreamWrapper\PublicAetlStream');

      // Fix CSS static urls
      $container->getDefinition('asset.css.optimizer')
        ->setClass('Drupal\aetl\Asset\AetlCssOptimizer');
    }

    if (Settings::get('aetl.use_s3_for_private') && $container->hasDefinition('stream_wrapper.private')) {
      // Replace the private stream wrapper with AetlStream.
      $container->getDefinition('stream_wrapper.private')
        ->setClass('Drupal\aetl\StreamWrapper\PrivateAetlStream');
    }*/
  }

  /**
   * Register dynamic service definitions.
   *
   * @param ContainerBuilder $container
   *   The ContainerBuilder whose service definitions can be checked.
   */
  public function register(ContainerBuilder $container) {
    /*if ($container->hasDefinition('advagg.optimizer.css') && Settings::get('aetl.use_s3_for_public')) {
      $container
        ->register('aetl.advagg.css_subscriber', 'Drupal\aetl\EventSubscriber\AetlAdvAggSubscriber')
        ->addTag('event_subscriber')
        ->setArguments([new Reference('asset.css.optimizer')]);
    }*/
  }

}
