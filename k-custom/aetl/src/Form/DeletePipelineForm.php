<?php

namespace Drupal\aetl\Form;

use Drupal\Core\Form;
use Drupal\Core\Form\FormBase;
use Drupal\core\Form\FormStateInterface;
use Drupal\Core\Form\ConfirmFormBase;
use Drupal\Core\Render\Element;
use Drupal\Core\Url;
use Drupal\Core\Link;
use Drupal\core\Site\Settings;
use Drupal\core\StreamWrapper\PublicStream;
use Symfony\Component\HttpFoundation\Request;
use Aws\Exception\AwsException;

class DeletePipelineForm extends ConfirmFormBase {
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'delete_pipeline_form';
  }
  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'aetl.settings',
    ];
  }
  public $pid;

  public function getQuestion() { 
    return t('Do you want to delete %pid Pipeline?', array('%pid' => $this->pid));
  }

  public function getCancelUrl() {
    return new Url('aetl.pipelineslist');
  }

  public function getDescription() {
    return t('Only do this if you are sure!');
  }
  /**
   * {@inheritdoc}
   */
  public function getConfirmText() {
    return t('Delete it!');
  }
  /**
   * {@inheritdoc}
   */
  public function getCancelText() {
    return t('Cancel');
  }
  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormstateInterface $form_state, $pid = NULL) {
    $config = \Drupal::config('aetl.settings')->get();
    $messenger = \Drupal::messenger();
    if ($errors = \Drupal::service('aetl')->validate($config)) {
      foreach ($errors as $error) {
        $messenger->addMessage((string)$error, $messenger::TYPE_ERROR);
      }
      $messenger->addMessage('Unable to validate your aetl configuration settings. Please configure aetl File System from the admin/config/media/aetl page and try again.', $messenger::TYPE_ERROR);
      return;
    } 
    $this->id = $pid;
    return parent::buildForm($form, $form_state);
  }
  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    parent::validateForm($form, $form_state);
  }
  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $data['Id'] = $this->id;
    $transcoder_client = \Drupal::service('aetl')->deletePipeline($data);
    drupal_set_message("Pipeline" . $this->id . " succesfully deleted.");
    $form_state->setRedirect('aetl.pipelineslist');
  }
}