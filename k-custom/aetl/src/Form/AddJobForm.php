<?php

namespace Drupal\aetl\Form;

use \Drupal\Core\Form;
use \Drupal\Core\Form\FormBase;
use \Drupal\core\Form\FormStateInterface;
use \Drupal\Core\Url;
use \Drupal\Core\Link;
use \Drupal\core\Site\Settings;
use \Drupal\core\StreamWrapper\PublicStream;
use \Symfony\Component\HttpFoundation\Request;
use Aws\Exception\AwsException;

class AddJobForm extends FormBase {
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'add_job_form';
  }
  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'aetl.settings',
    ];
  }
  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormstateInterface $form_state) {
    $config = \Drupal::config('aetl.settings')->get();
    $messenger = \Drupal::messenger();
    if ($errors = \Drupal::service('aetl')->validate($config)) {
      foreach ($errors as $error) {
        $messenger->addMessage((string)$error, $messenger::TYPE_ERROR);
      }
      $messenger->addMessage('Unable to validate your aetl configuration settings. Please configure aetl File System from the admin/config/media/aetl page and try again.', $messenger::TYPE_ERROR);
      return;
    }
    $transcoder_client = \Drupal::service('aetl')->getAmazonETClient($config);
    $pipelinelist = [];
    $pipelinelist[''] = $this->t('---Select One---');
    try {
      $result = $transcoder_client->listPipelines([])->toArray();
      foreach ($result['Pipelines'] as $pipeline) {
        if($pipeline['Status'] == 'Active') {
          $pipelinelist[$pipeline['Id']] = $this->t($pipeline['Name']);
        }
      }
    }
    catch (AwsException $e) {
      // output error message if fails
      echo $e->getMessage() . "\n";
    }
    $presetslist = [];
    try {
      $result = $transcoder_client->listPresets([])->toArray();
      foreach ($result['Presets'] as $presets) {
          $presetslist[$presets['Id']] = $this->t($presets['Name']);
      }
    }
    catch (AwsException $e) {
      // output error message if fails
      echo $e->getMessage() . "\n";
    }
    $form['pipelineid'] = [
      '#type' => 'select',
      '#title' => $this->t('Pipeline'),
      '#description' => $this->t('The pipeline that you want Elastic Transcoder to use for transcoding.'),
      '#options' => $pipelinelist,
      '#ajax' => [
        'callback' => '::pipeline_callback',
        'event' => 'change',
        'wrapper' => 'pipeline-wrapper'
      ],
    ];
    $form['jobs'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Job configuration'),
      '#disabled' => TRUE,
      '#prefix' => '<div id="pipeline-wrapper">',
      '#suffix' => '</div>',
    ];
    if ($pid = $form_state->getValue('pipelineid', false)) {
      $form['jobs'] = [
        '#type' => 'fieldset',
        '#title' => $this->t('Job configuration'),
        '#prefix' => '<div id="pipeline-wrapper">',
        '#suffix' => '</div>',
      ];
      $form['jobs']['outputkeyprefix'] = [
        '#type' => 'textfield',
        '#title' => $this->t('Output Key Prefix'),
        '#description' => $this->t('The value, if any, that you want Elastic Transcoder to prepend to the names of all files that this job creates, including output files, thumbnails, captions, and playlists. If you specify a value, it must contain a / somewhere after the first character, which simplifies Amazon S3 file management.'),
      ];
      $form['jobs']['inputdetails'] = [
        '#type' => 'textfield',
        '#autocomplete_route_name' => 'aetl.autocomplete',
        '#autocomplete_route_parameters' => array('field_name' => 'inputdetails', 'count' => 10, 'pid' => $pid),
        '#title' => $this->t('Input Details'),

      ];
      $form['jobs']['output_details'] = [
        '#type' => 'fieldset',
        '#tree' => TRUE,
        '#title' => t('Output Details'),
        '#prefix' => '<div id="output-details-wrapper">',
        '#suffix' => '</div>',
      ];
      // Gather the number of names in the form already.
      $num_names = $form_state->get('num_names');
      // We have to ensure that there is at least one name field.
      if ($num_names === NULL) {
        $name_field = $form_state->set('num_names', 1);
        $num_names = 1;
      }
      for ($i = 0; $i < $num_names; $i++) {
        $form['jobs']['output_details']['output-set'][$i] = [
          '#type' => 'fieldset',
          '#title' => 'Option ' . ($i + 1),
          '#tree' => TRUE,
        ];
        $form['jobs']['output_details']['output-set'][$i]['preset'] = [
          '#type' => 'select',
          '#title' => $this->t('Output Details Preset'),
          '#options' => $presetslist,
        ];
        $form['jobs']['output_details']['output-set'][$i]['key'] = [
          '#type' => 'textfield',
          '#title' => $this->t('Output Details Output Key'),
          '#description' => $this->t('The name of your output file. When not used as a pattern, such as for segmenting, you should include an appropriate extension such as .mp4, .ts, .webm, .ismv, .mp3, .ogg, .oga, .flac, .mpg, .gif, .flv, .mxf, .wav, or .mp2. You may also include a / in your name, for example "outputs/movie.mp4"')
        ];
      }
      $form['jobs']['output_details']['add_item'] = [
        '#type' => 'submit',
        '#value' => t('Add Another Item'),
        '#submit' => ['::output_details_add_item'],
        '#ajax' => [
          'callback' => '::output_details_ajax_callback',
          'wrapper' => 'output-details-wrapper',
        ],
      ];
      $form['jobs']['submit'] = [
        '#type' => 'submit',
        '#value' => $this->t('Submit'),
      ];
    }
    return $form;
  }
  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    if (strlen($form_state->getValue('job_name')) < 10) {
      //$form_state->setErrorByName('job_name', $this->t('Job name is too short.'));
    }
  }
   /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    //TODO create AWS Elastic Trancoder services
    drupal_set_message("New Job added succesfully.");

    $data = [];
    $data['pipelineid'] = $form_state->getValue('pipelineid');
    $data['outputkeyprefix'] = $form_state->getValue('outputkeyprefix');
    $data['inputdetails'] = $form_state->getValue('inputdetails');
    $output_data = $form_state->getValue('output_details');
    $data['output_details'] = $output_data['output-set'];
    $op = $form_state->getValue('op');
    if ($op == 'Submit') {
      $s3Client = \Drupal::service('aetl')->trancodeCreateJob($data);
    }
    $form_state->setRedirect('aetl.jobsslist');
  }
  /**
   * Ajax Callback for the form.
   *
   * @param array $form
   *   The form being passed in
   * @param array $form_state
   *   The form state
   * 
   * @return array
   *   The form element we are changing via ajax
   */
  public function output_details_ajax_callback(array &$form, FormStateInterface $form_state) {
    return $form['jobs']['output_details'];
  }
  /**
   * Functionality for our ajax callback.
   *
   * @param array $form
   *   The form being passed in
   * @param array $form_state
   *   The form state, passed by reference so we can modify
   */
  public function output_details_add_item(array &$form, FormStateInterface $form_state) {
    $num_names = $form_state->get('num_names');
    $form_state->set('num_names', ($num_names+1));
    $form_state->setRebuild();
  }
  /**
   * Functionality for our ajax callback.
   *
   * @param array $form
   *   The form being passed in
   * @param array $form_state
   *   The form state, passed by reference so we can modify
   */
  public function pipeline_callback(array &$form, FormStateInterface $form_state) {
    return $form['jobs'];
  }
}