<?php

namespace Drupal\aetl\Form;

use \Drupal\Core\Form;
use \Drupal\Core\Form\FormBase;
//use Drupal\Core\Form\ConfigFormBase;
use \Drupal\core\Form\FormStateInterface;
use \Drupal\Core\Url;
use \Drupal\Core\Link;
use \Drupal\core\Site\Settings;
use \Drupal\core\StreamWrapper\PublicStream;
use \Symfony\Component\HttpFoundation\Request;
use Aws\Exception\AwsException;

class AddPresetForm extends FormBase {
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'add_preset_form';
  }
  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'preset.settings',
    ];
  }
  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormstateInterface $form_state) {
    $config = $this->config('preset.settings');
    $aetl_config = \Drupal::config('aetl.settings')->get();
    $messenger = \Drupal::messenger();
    if ($errors = \Drupal::service('aetl')->validate($aetl_config)) {
      foreach ($errors as $error) {
        $messenger->addMessage((string)$error, $messenger::TYPE_ERROR);
      }
      $messenger->addMessage('Unable to validate your aetl configuration settings. Please configure aetl File System from the admin/config/media/aetl page and try again.', $messenger::TYPE_ERROR);
      return;
    }
    $container = [];
    $container = ['' => 'Select One...', 'mp4' => 'mp4', 'fmp4' => 'fmp4', 'ts' => 'ts', 'webm' => 'webm', 'mp3' => 'mp3', 'ogg' => 'ogg', 'oga' => 'oga', 'flac' => 'flac', 'mpg' => 'mpg', 'flv' => 'flv', 'gif' => 'gif', 'mxf' => 'mxf', 'wav' => 'wav', 'mp2' => 'mp2'];
    $transcoder_client = \Drupal::service('aetl')->getAmazonETClient($aetl_config);
    $presetslist = [];
    $presetslist[''] = $this->t('Select One...');
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
    $video_codec = ['' => 'Select One...', 'H.264' => 'H.264', 'vp8' => 'vp8', 'vp9' => 'vp9', 'mpeg2' => 'mpeg2', 'gif' => 'gif'];
    $video_profile = [ '' => 'Select One...', 'baseline' => 'baseline', 'main' => 'main', 'high' => 'high' ];
    $video_level = ['' => 'Select One...', '1' => '1', '1b' => '1b', '1.1' => '1.1', '1.2' => '1.2', '1.3' => '1.3', '2' => '2', '2.1' => '2.1', '2.2' => '2.2', '3' => '3', '3.1' => '3.1', '3.2' => '3.2', '4' => '4', '4.1' => '4.1'];
    $video_mnorf = ['' => 'Select One...', '0' => '0', '1' => '1', '2' => '2', '3' => '3', '4' => '4', '5' => '5', '6' => '6', '7' => '7', '8' => '8', '9' => '9', '10' => '10', '11' => '11', '12' => '12', '13' => '13', '14' => '14', '15' => '15', '16' => '16'];
    $video_interlaced_mode = ['' => 'Select One...', 'Progressive' => 'Progressive', 'TopFirst' => 'TopFirst', 'BottomFirst' => 'BottomFirst', 'Auto' => 'Auto'];
    $video_cscm = ['' => 'Select One...', 'None' => 'None', 'Bt709ToBt601' => 'Bt709ToBt601', 'Bt601ToBt709' => 'Bt601ToBt709', 'Auto' => 'Auto'];
    $audio_codec = ['' => 'Select One...', 'AAC' => 'AAC', 'vorbis' => 'vorbis', 'mp3' => 'mp3', 'mp2' => 'mp2', 'pcm' => 'pcm', 'flac' => 'flac'];
    $loop_count = ["" => "Select One...", "Infinite" => "Infinite", "0" => "0", "1" => "1", "2" => "2", "3" => "3", "4" => "4", "5" => "5", "6" => "6", "7" => "7", "8" => "8", "9" => "9", "10" => "10", "11" => "11", "12" => "12", "13" => "13", "14" => "14", "15" => "15", "16" => "16", "17" => "17", "18" => "18", "19" => "19", "20" => "20", "21" => "21", "22" => "22", "23" => "23", "24" => "24", "25" => "25", "26" => "26", "27" => "27", "28" => "28", "29" => "29", "30" => "30", "31" => "31", "32" => "32", "33" => "33", "34" => "34", "35" => "35", "36" => "36", "37" => "37", "38" => "38", "39" => "39", "40" => "40", "41" => "41", "42" => "42", "43" => "43", "44" => "44", "45" => "45", "46" => "46", "47" => "47", "48" => "48", "49" => "49", "50" => "50", "51" => "51", "52" => "52", "53" => "53", "54" => "54", "55" => "55", "56" => "56", "57" => "57", "58" => "58", "59" => "59", "60" => "60", "61" => "61", "62" => "62", "63" => "63", "64" => "64", "65" => "65", "66" => "66", "67" => "67", "68" => "68", "69" => "69", "70" => "70", "71" => "71", "72" => "72", "73" => "73", "74" => "74", "75" => "75", "76" => "76", "77" => "77", "78" => "78", "79" => "79", "80" => "80", "81" => "81", "82" => "82", "83" => "83", "84" => "84", "85" => "85", "86" => "86", "87" => "87", "88" => "88", "89" => "89", "90" => "90", "91" => "91", "92" => "92", "93" => "93", "94" => "94", "95" => "95", "96" => "96", "97" => "97", "98" => "98", "99" => "99", "100" => "100"];
    $audio_profile = ['' => 'Select One...', 'auto' => 'auto', 'AAC-LC' => 'AAC-LC', 'HE-AAC' => 'HE-AAC', 'HE-AACv2' => 'HE-AACv2'];
    $bit_depth = ['' => 'auto', '8' => '8', '16' => '16', '24' => '24', '32' => '32'];
    $frame_rate = ['' => 'Select One...', 'auto' => 'auto', '10' => '10', '15' => '15', '23.97' => '23.97', '24' => '24', '25' => '25', '29.97' => '29.97', '30' => '30', '50' => '50', '60' => '60'];
    $sizing_policy = ['' => 'Select One...', 'Fit' => 'Fit', 'Fill' => 'Fill', 'Stretch' => 'Stretch', 'Keep' => 'Keep', 'ShrinkToFit' => 'ShrinkToFit', 'ShrinkToFill' => 'ShrinkToFill'];
    $padding_policy = ['' => 'Select One...', 'Pad' => 'Pad', 'NoPad' => 'NoPad'];
    $aspect_ratio = ['' => 'Select One...', 'auto' => 'auto', '1:1' => '1:1', '4:3' => '4:3', '3:2' => '3:2', '16:9' => '16:9'];
    $sample_rate = ['auto' => 'auto', 'auto' => 'auto', '22050' => '22050', '32000' => '32000', '44100' => '44100', '48000' => '48000', '96000' => '96000', '192000' => '192000'];
    $channels = ['auto' => 'auto', '0' => '0', '1' => '1', '2' => '2'];

    $form['transcoding_preset'] = array(
      '#type' => 'details',
      '#title' => $this->t('Create a New Transcoding Preset'),
      '#description' => $this->t('A preset is a template that contains the settings that you want the Elastic Transcoder to apply during the transcoding process, for example, the codec and the resolution that you want in the transcoded file. When you create a job, you specify which preset you want to use.'),
      '#open' => TRUE, // Controls the HTML5 'open' attribute. Defaults to FALSE.
    );
    $form['transcoding_preset']['start_with_preset'] = [
      '#type' => 'select',
      '#title' => $this->t('Start With Preset'),
      '#options' => $presetslist,
      '#attributes' => [
        'name' => 'field_select_preset',
      ],
      '#ajax' => [
        'callback' => '::preset_set_callback',
        'event' => 'change',
      ]
    ];
    $form['transcoding_preset']['name'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Name'),
      '#required' => TRUE,
      '#description' => $this->t('(Optional) The name of the preset. We recommend that the name be unique within the AWS account, but uniqueness is not enforced. Maximum: 40 characters.')
    ];
    $form['transcoding_preset']['description'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Description'),
      '#description' => $this->t('(Optional) A description of the preset. Maximum: 255 characters.')
    ];
    $form['transcoding_preset']['container'] = [
      '#type' => 'select',
      '#title' => $this->t('Container'),
      '#description' => $this->t('Use mp4 for H.264 content.
      Use fmp4 for Smooth Streaming or MPEG-DASH content.
      Use ts for HLS content.
      Use webm for vp8/vp9 downloaded content.
      Use mp3 for mp3 audio.
      Use ogg for vorbis audio.
      Use oga for flac audio.
      Use flac for flac audio.
      Use mpg for mpeg2 content.
      Use flv for Flash content.
      Use gif for Animated Gif videos.
      Use mxf for XDCAM content.
      Use wav for pcm audio.'),
      '#options' => $container,
      '#attributes' => [
        'name' => 'field_select_container',
      ]
    ];
    $form['available_settings_fieldset'] = [
      '#type' => 'details',
      '#title' => $this->t('Available Settings'),
      '#open' => TRUE,
    ];
    $form['available_settings_fieldset']['available_settings_video'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Video'),
      '#attributes' => ['class'=>['check_group']],
    ];
    $form['available_settings_fieldset']['available_settings_audio'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Audio'),
      '#attributes' => ['class'=>['check_group']],
    ];
    $form['available_settings_fieldset']['available_settings_thumbnails'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Thumbnails'),
      '#attributes' => ['class'=>['check_group']],
    ];
    $form['video_fieldset'] = [
      '#type' => 'details',
      '#title' => $this->t('Video'),
      '#open' => TRUE,
      '#states' => [
        //show this textfield only if the radio 'other' is selected above
        'visible' => [
          [':input[name="field_select_container"]' => ['value' => 'mp4']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'fmp4']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'td']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'webm']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'mpg']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'flv']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'gif']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'mxf']],
        ],
      ],
    ];
    $form['video_fieldset']['video_codec'] = [
      '#type' => 'select',
      '#title' => $this->t('Codec'),
      '#options' => $video_codec,
      '#attributes' => [
        'name' => 'field_video_codec',
      ]
    ];
    $form['video_fieldset']['video_profile'] = [
      '#type' => 'select',
      '#title' => $this->t('Profile'),
      '#states' => [
        'visible' => [
          [':input[name="field_video_codec"]' => ['value' => 'H.264']],
          'or',
          [':input[name="field_video_codec"]' => ['value' => 'vp8']],
          'or',
          [':input[name="field_video_codec"]' => ['value' => 'mpeg2']],
        ],
      ],
      '#options' => $video_profile,
    ];
    $form['video_fieldset']['video_level'] = [
      '#type' => 'select',
      '#title' => $this->t('Level'),
      '#options' => $video_level,
      '#states' => [
        'visible' => [
          [':input[name="field_video_codec"]' => ['value' => 'H.264']],
          'or',
          [':input[name="field_video_codec"]' => ['value' => 'mpeg2']],
        ],
      ],
    ];
    $form['video_fieldset']['video_mnorf'] = [
      '#type' => 'select',
      '#title' => $this->t('Maximum Number of Reference Frames'),
      '#options' => $video_mnorf,
      '#states' => [
        'visible' => [
          [':input[name="field_video_codec"]' => ['value' => 'H.264']],
          'or',
          [':input[name="field_video_codec"]' => ['value' => 'mpeg2']],
        ],
      ],
    ];
    $form['video_fieldset']['max_bit_rate'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Max Bit Rate'),
      '#states' => [
        'visible' => [
          [':input[name="field_video_codec"]' => ['value' => 'H.264']],
          'or',
          [':input[name="field_video_codec"]' => ['value' => 'vp8']],
          'or',
          [':input[name="field_video_codec"]' => ['value' => 'vp9']],
          'or',
          [':input[name="field_video_codec"]' => ['value' => 'mpeg2']],
        ],
      ],
    ];
    $form['video_fieldset']['buffer_size'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Buffer Size'),
      '#states' => [
        'visible' => [
          [':input[name="field_video_codec"]' => ['value' => 'H.264']],
          'or',
          [':input[name="field_video_codec"]' => ['value' => 'vp8']],
          'or',
          [':input[name="field_video_codec"]' => ['value' => 'vp9']],
          'or',
          [':input[name="field_video_codec"]' => ['value' => 'mpeg2']],
        ],
      ],
    ];
    $form['video_fieldset']['video_interlaced_mode'] = [
      '#type' => 'select',
      '#title' => $this->t('Interlaced Mode'),
      '#options' => $video_interlaced_mode,
      '#states' => [
        'visible' => [
          [':input[name="field_video_codec"]' => ['value' => 'H.264']],
          'or',
          [':input[name="field_video_codec"]' => ['value' => 'mpeg2']],
        ],
      ],
    ];
    $form['video_fieldset']['video_cscm'] = [
      '#type' => 'select',
      '#title' => $this->t('Color Space Conversion Mode'),
      '#options' => $video_cscm,
      '#states' => [
        'visible' => [
          [':input[name="field_video_codec"]' => ['value' => 'H.264']],
          'or',
          [':input[name="field_video_codec"]' => ['value' => 'mpeg2']],
        ],
      ],
    ];
    $form['video_fieldset']['number_of_frames'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Maximum Number of Frames Between Keyframes'),
      '#states' => [
        'visible' => [
          [':input[name="field_video_codec"]' => ['value' => 'H.264']],
          'or',
          [':input[name="field_video_codec"]' => ['value' => 'vp8']],
          'or',
          [':input[name="field_video_codec"]' => ['value' => 'vp9']],
          'or',
          [':input[name="field_video_codec"]' => ['value' => 'mpeg2']],
        ],
      ],
    ];
    $form['video_fieldset']['fixedGOP'] = [
      '#type' => 'radios',
      '#title' => $this->t('Fixed Number of Frames Between Keyframes'),
      '#options' => ['on' => 'Yes', 'off' => 'No'],
      '#states' => [
        'visible' => [
          [':input[name="field_video_codec"]' => ['value' => 'H.264']],
          'or',
          [':input[name="field_video_codec"]' => ['value' => 'vp8']],
          'or',
          [':input[name="field_video_codec"]' => ['value' => 'vp9']],
          'or',
          [':input[name="field_video_codec"]' => ['value' => 'mpeg2']],
        ],
      ],
    ];
    $form['video_fieldset']['loop_count'] = [
      '#type' => 'select',
      '#title' => $this->t('Loop Count'),
      '#options' => $loop_count,
      '#states' => [
        'visible' => [
          [':input[name="field_video_codec"]' => ['value' => 'gif']],
        ],
      ],
    ];
    $form['video_fieldset']['bit_rate'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Bit Rate'),
    ]; 
    $form['video_fieldset']['frame_rate'] = [
      '#type' => 'select',
      '#title' => $this->t('Frame Rate'),
      '#options' => $frame_rate,
    ];
    $form['video_fieldset']['max_frame_rate'] = [
      '#type' => 'select',
      '#title' => $this->t('Video Max Frame Rate'),
      '#options' => $frame_rate,
    ];
    $form['video_fieldset']['max_width'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Max Width'),
    ];
    $form['video_fieldset']['max_height'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Max Height'),
    ];
    $form['video_fieldset']['sizing_policy'] = [
      '#type' => 'select',
      '#title' => $this->t('Sizing Policy'),
      '#options' => $sizing_policy,
    ];
    $form['video_fieldset']['padding_policy'] = [
      '#type' => 'select',
      '#title' => $this->t('Padding Policy'),
      '#options' => $padding_policy,
    ];
    $form['video_fieldset']['aspect_ratio'] = [
      '#type' => 'select',
      '#title' => $this->t('Display Aspect Ratio'),
      '#options' => $aspect_ratio,
    ];
    $form['audio_fieldset'] = [
      '#type' => 'details',
      '#title' => $this->t('Audio'),
      '#open' => TRUE,
      '#states' => [
        //show this textfield only if the radio 'other' is selected above
        'visible' => [
          [':input[name="field_select_container"]' => ['value' => 'mp3']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'ogg']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'oga']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'flac']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'wav']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'mp2']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'mp4']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'fmp4']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'td']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'webm']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'mpg']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'flv']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'mxf']],
        ],
      ],
    ];
    $form['audio_fieldset']['audio_codec'] = [
      '#type' => 'select',
      '#title' => $this->t('Codec'),
      '#options' => $audio_codec,
    ];
    $form['audio_fieldset']['audio_profile'] = [
      '#type' => 'select',
      '#title' => $this->t('Profile'),
      '#options' => $audio_profile,
    ];
    $form['audio_fieldset']['bit_depth'] = [
      '#type' => 'select',
      '#title' => $this->t('Bit Depth'),
      '#options' => $bit_depth,
    ];
    $form['audio_fieldset']['sample_rate'] = [
      '#type' => 'select',
      '#title' => $this->t('Sample Rate'),
      '#options' => $sample_rate,
    ];
    $form['audio_fieldset']['audio_bit_rate'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Bit Rate'),
    ]; 
    $form['audio_fieldset']['channels'] = [
      '#type' => 'select',  
      '#title' => $this->t('Channels'),
      '#options' => $channels,
    ];
    $form['thumbnails_fieldset'] = [
      '#type' => 'details',
      '#title' => $this->t('Thumbnails'),
      '#open' => TRUE,
      '#states' => [
        //show this textfield only if the radio 'other' is selected above
        'visible' => [
          [':input[name="field_select_container"]' => ['value' => 'mp4']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'fmp4']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'td']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'webm']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'mpg']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'flv']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'gif']],
          'or',
          [':input[name="field_select_container"]' => ['value' => 'mxf']],
        ],
      ],
    ];
    $form['thumbnails_fieldset']['format'] = [
      '#type' => 'select',
      '#title' => $this->t('Format'),
      '#options' => ['' => 'Select One', 'jpg' => 'jpg', 'png' => 'png'],
    ];
    $form['thumbnails_fieldset']['interval'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Interval'),
    ];
    $form['thumbnails_fieldset']['thumbnails_max_width'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Max Width'),
      '#default_value' => $config->get('thumbnails_max_width'),
    ];
    $form['thumbnails_fieldset']['thumbnails_max_height'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Max Height'),
    ];
    $form['thumbnails_fieldset']['thumbnails_sizing_policy'] = [
      '#type' => 'select',
      '#title' => $this->t('Sizing Policy'),
      '#options' => $sizing_policy,
    ];
    $form['thumbnails_fieldset']['thumbnails_padding_policy'] = [
      '#type' => 'select',
      '#title' => $this->t('Padding Policy'),
      '#options' => $padding_policy,
    ];
    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Create Preset'),
    ];
    return $form;
    //return parent::buildForm($form, $form_state);
  }
  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    //if (strlen($form_state->getValue('job_name')) < 10) {
      //$form_state->setErrorByName('job_name', $this->t('Job name is too short.'));
    //}
  }
   /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $form_values = $form_state->getValue(array());
    $aetl_config = \Drupal::config('aetl.settings')->get();
    $transcoder_client = \Drupal::service('aetl')->getAmazonETClient($aetl_config);
    try {
      $result = $transcoder_client->createPreset([
        // Name is required
        'Name' => $form_values['name'],
        'Description' => $form_values['description'],
        // Container is required
        'Container' => $form_values['container'],
        'Video' => [
          'Codec' => $form_values['video_codec'],
          'CodecOptions' => [
              // Associative array of custom 'CodecOption' key names
              'Profile' => $form_values['video_profile'],
              'Level' => $form_values['video_level'],
              'MaxReferenceFrames' => $form_values['video_mnorf'],
              'MaxBitRate' => $form_values['max_bit_rate'],
              'BufferSize' => $form_values['buffer_size'],
              'InterlacedMode' => $form_values['video_interlaced_mode'],
              'ColorSpaceConversionMode' => $form_values['video_cscm'],
               // ... repeated
          ],
          'KeyframesMaxDist' => $form_values['number_of_frames'],
          'FixedGOP' => $form_values['fixedGOP'],
          'BitRate' => $form_values['bit_rate'],
          'FrameRate' => $form_values['frame_rate'],
          'MaxFrameRate' => $form_values['max_frame_rate'],
          'Resolution' => $form_values['video_level'],
          'AspectRatio' => $form_values['aspect_ratio'],
          'MaxWidth' => $form_values['max_width'],
          'MaxHeight' => $form_values['max_height'],
          'DisplayAspectRatio' => $form_values['aspect_ratio'],
          'SizingPolicy' => $form_values['sizing_policy'],
          'PaddingPolicy' => $form_values['padding_policy'],
        ],
        'Audio' => [
          'Codec' => $form_values['audio_codec'],
          'SampleRate' => $form_values['sample_rate'],
          'BitRate' => $form_values['audio_bit_rate'],
          'Channels' => $form_values['channels'],
          'AudioPackingMode' => $form_values['channels'],
          'CodecOptions' => [
              'Profile' => $form_values['audio_profile'],
              'BitDepth' => $form_values['bit_depth'],
              'BitOrder' => 'LittleEndian',
              'Signed' => 'Signed',
          ],
        ],
      ]);
    } catch (AwsException $e) {
      // output error message if fails
      echo $e->getMessage() . "\n";
    }
  }

  public function preset_set_callback(array &$form, FormStateInterface $form_state) {
    return $form;
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
}