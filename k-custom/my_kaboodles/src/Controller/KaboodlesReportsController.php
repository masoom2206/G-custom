<?php

/**
 * @file
 * Contains \Drupal\my_kaboodles\Controller\KaboodlesController.php
 *
 */

namespace Drupal\my_kaboodles\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\Entity\Node;

use Drupal\user\Entity\User;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;
use Drupal\image\Entity\ImageStyle;
use Drupal\node\NodeInterface;

/**
 * Defines KaboodlesController class.
 */
class KaboodlesReportsController extends ControllerBase
{
  
    /**
    * Display the my-kaboodles page markup.
    *
    * @return array
    */
    public function content(NodeInterface $node) {
      $kaboodle_title = $node->get('title')->value;
      $element = 9004;
      return [
        '#theme' => 'my_kaboodles_reports',
        '#node'   => $node,
        '#kaboodle_title'   => $kaboodle_title,
        '#pager' => [
            '#type' => 'pager',
            '#element' => $element,
        ],
      ];
    }
}
