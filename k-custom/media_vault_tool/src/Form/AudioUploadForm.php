<?php
/**
 * @file
 * Contains \Drupal\media_vault_tool\Form\AudioUploadForm.
 */

namespace Drupal\media_vault_tool\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

class AudioUploadForm extends FormBase {
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'audio_upload_form';
  }
  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $extensions = array('aac aiff flac mp3 lcm ogg pcm wav jpg');
    $title = t('Upload Audio');
    $form['kb_audio'] = array(
      '#type' => 'plupload',
      '#title' => $title,
      '#description' => t('Drag audio here to upload.'),
      '#autoupload' => FALSE,
      '#autosubmit' => FALSE,
      '#upload_validators' => array(
        'file_validate_extensions' => $extensions,
      ),
    );
    
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => 'UPLOAD & SAVE',
    ];
  
    return $form;
  }
  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
     if (null !== $form_state->getValue('kb_audio')) {
       $values = $form_state->getValues();
       $destin = 'public://';
       foreach ($form_state->getValue('kb_audio') as $uploaded_file) {
         $source = $uploaded_file['tmppath'];
         $name =  $uploaded_file['name'];
         $destination = $destin.$name;
         $file_content = file_get_contents($source);
         $file = file_save_data($file_content, $destination, FILE_EXISTS_RENAME);
       }
     }
  }
}