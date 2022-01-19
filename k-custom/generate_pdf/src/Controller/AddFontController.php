<?php

namespace Drupal\generate_pdf\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Class AddFontController.
 */
class AddFontController extends ControllerBase {

  /**
   * Addfont.
   *
   * @return string
   *   Return Hello string.
   */
  public function addfont() {
    return [
      '#type' => 'markup',
      '#markup' => $this->t('Implement method: addfont')
    ];
  }

}
