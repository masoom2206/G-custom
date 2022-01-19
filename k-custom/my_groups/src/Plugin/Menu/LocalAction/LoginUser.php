<?php

namespace Drupal\my_groups\Plugin\Menu\LocalAction;

use Drupal\Core\Menu\LocalActionDefault;
use Drupal\Core\Routing\RedirectDestinationInterface;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Routing\RouteProviderInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Session\AccountInterface;

/**
 * Modifies the local action to add a destination.
 * 
 * Will either append the already present destination parameter or use the
 * current route's path as the destination parameter.
 * 
 * @todo Follow up on https://www.drupal.org/node/2762131.
 */
class LoginUser extends LocalActionDefault {
  /**
   * The current user.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $currentUser;


  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, RouteProviderInterface $route_provider, AccountInterface $current_user) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $route_provider);

    $this->currentUser = $current_user;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('router.route_provider'),
      $container->get('current_user')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getCacheContexts() {
    return parent::getCacheContexts() + ['user'];
  }

  /**
   * {@inheritdoc}
   */
  public function getRouteParameters(RouteMatchInterface $route_match) {
    // If the user is not Anonymous.
    if (!$this->currentUser->isAnonymous()) {
      // Getting the uid.
      $uid = $this->currentUser->id();
      // Adding the link.
      return ['user' => $uid];
    }
    return [];
  }
}
