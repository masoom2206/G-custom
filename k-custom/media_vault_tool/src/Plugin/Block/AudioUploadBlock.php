<?php
/**
 * @file
 * Contains \Drupal\media_vault_tool\Plugin\Block\AudioUploadBlock.
 */
namespace Drupal\media_vault_tool\Plugin\Block;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormInterface;
/**
 * Provides a 'Audio upload form' block.
 *
 * @Block(
 *   id = "audio_upload_block",
 *   admin_label = @Translation("Audio Upload block"),
 *   category = @Translation("Custom audio upload block")
 * )
 */
class AudioUploadBlock extends BlockBase {
  /**
   * {@inheritdoc}
   */
  public function build() {
    $form = \Drupal::formBuilder()->getForm('Drupal\media_vault_tool\Form\AudioUploadForm');
    return $form;
   }
}