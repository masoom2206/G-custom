<?php
namespace Drupal\my_groups\Plugin;
use Drupal\Core\Menu\MenuLinkBase;
/**
 * Listens to the dynamic route events.
 */
class Menu extends MenuLinkBase {
  public function getTitle() {
    return t('Teams');
  }
  public function getDescription() {
    return t('Find and manage teams, team types and team settings.');
  }
  public function updateLink(array $new_definition_values, $persist) {}
  
  public function getRouteParameters() {
    $uid = \Drupal::currentUser()->id();
    return [
      'user' => $uid,
    ];
  }
}