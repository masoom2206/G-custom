<?php
/**
 * @file
 * Contains \Drupal\media_web_system\Form\WebTextEditorForm.
 */

namespace Drupal\media_web_system\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\CloseModalDialogCommand;
use Drupal\Core\Ajax\RedirectCommand;

class WebTextEditorForm extends FormBase {
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'web_text_editor_form';
  }
  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['template_id'] = array(
      '#type' => 'hidden',
      '#value' => '',
    );
    
    $form['CKEditor'] = array(
      '#type' => 'text_format',
      '#format' => 'basic_html',
      '#base_type' => 'textarea',
      '#default_value' => '',
      '#rows' => '5',
      '#weight' => '0',
      '#maxlength' => 200,
      '#maxlength_js' => TRUE,
      '#maxlength_js_truncate_html' => TRUE,
      '#maxlength_js_enforce' => TRUE,
      //'#attributes' => array('original-text' => array('')),
      '#prefix' => '<div class="margin-bottom-10">',
      '#suffix' => '</div>',  
    );

   /*  $form['ckOptionSubmit'] = array(
      '#type' => 'submit',
      '#value' => t('Apply'),
      '#prefix' => '<div class="ckeditor-options-button"><button id="edit-cancel" data-dismiss="modal" type="button" class="btn btn-cancel">Cancel</button>',
      '#suffix' => '</div>',
      '#attributes' => array('class' => array('btn btn-primary mr-1')),
    );
    
    $form['#attached']['library'][] = 'core/jquery.form';
    $form['#attached']['library'][] = 'core/drupal.ajax';   */ 
  
    return $form;
  }
  
  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    /* $response = new AjaxResponse();
    $response->addCommand(new CloseModalDialogCommand());
    $form_state->setResponse($response); */
  }
}