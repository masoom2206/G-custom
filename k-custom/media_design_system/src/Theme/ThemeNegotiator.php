<?php

namespace Drupal\media_design_system\Theme;

use Drupal\Core\Theme\ThemeNegotiatorInterface;
use Drupal\Core\Routing\RouteMatchInterface;

class ThemeNegotiator implements ThemeNegotiatorInterface {
  /**
   * {@inheritdoc}
   */
  public function applies(RouteMatchInterface $route_match) {
    // Use this theme on a certain route.
    // return $route_match->getRouteName() == 'example_route_name';

    // Or use this for more than one route:
    $possible_routes = array(
        'media_design_system.kmds.design.create',
        'media_design_system.kmds.design.createx',
        'mediawebsystem.product',
        'mediawebsystem.product.template',
    );

    return (in_array($route_match->getRouteName(), $possible_routes));
  }

  /**
   * {@inheritdoc}
   */
  public function determineActiveTheme(RouteMatchInterface $route_match) {
    // Here you return the actual theme name.
    return 'designertool';
  }

}
