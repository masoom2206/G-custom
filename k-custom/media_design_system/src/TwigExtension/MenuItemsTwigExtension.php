<?php

namespace Drupal\media_design_system\TwigExtension;

use Drupal\media_design_system\MenuItems;

/**
 * Class MenuItemsTwigExtension.
 *
 * @package Drupal\media_design_system
 */
class MenuItemsTwigExtension extends \Twig_Extension {

  /**
   * MenuItems definition.
   *
   * @var MenuItems
   */
  protected $menuItems;

  /**
   * MenuItemsTwigExtension constructor.
   *
   * @param MenuItems $menuItems
   *   The MenuItems service.
   */
  public function __construct(MenuItems $menuItems) {
    $this->menuItems = $menuItems;
  }

  /**
   * {@inheritdoc}
   */
  public function getFunctions() {
    return [
      new \Twig_SimpleFunction('media_design_system',
      function ($menuId = NULL) {
        return $this->menuItems->getMenuTree($menuId);
      },
        ['is_safe' => ['html']]
      ),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getName() {
    return 'media_design_system';
  }

}
