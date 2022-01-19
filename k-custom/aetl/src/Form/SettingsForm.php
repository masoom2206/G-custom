<?php

namespace Drupal\aetl\Form;

use \Drupal\Core\Form;
use \Drupal\Core\Form\ConfigFormBase;
use \Drupal\core\Form\FormStateInterface;
use \Drupal\Core\Url;
use \Drupal\Core\Link;
use \Drupal\core\Site\Settings;
use \Drupal\core\StreamWrapper\PublicStream;
use \Symfony\Component\HttpFoundation\Request;

/**
 *  Defines a form that configure Amazon Elastic Transcoder and AWS Lambda Settings.
 */
class SettingsForm extends ConfigFormBase {
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'aetl_admin_setting_form';
  }
  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'aetl.settings',
    ];
  }

  public function buildForm(array $form, FormStateInterface $form_state, Request $request = NULL ) {
    $config = $this->config('aetl.settings');
    // I'd like to be able to pull this information directly from the SDK, but
    // I couldn't find a good way to get the human-readable region names.
    $region_map = [
      'us-east-1' => $this->t('US East - Northern Virginia (us-east-1)'),
      'us-east-2' => $this->t('US East - Ohio (us-east-2)'),
      'us-west-1' => $this->t('US West - Northern California  (us-west-1)'),
      'us-west-2' => $this->t('US West - Oregon (us-west-2)'),
      'us-gov-west-1' => $this->t('USA GovCloud Standard (us-gov-west-1)'),
      'eu-west-1' => $this->t('EU - Ireland  (eu-west-1)'),
      'eu-west-2' => $this->t('EU - London (eu-west-2)'),
      'eu-west-3' => $this->t('EU - Paris (eu-west-3)'),
      'eu-central-1' => $this->t('EU - Frankfurt (eu-central-1)'),
      'ap-south-1' => $this->t('Asia Pacific - Mumbai'),
      'ap-southeast-1' => $this->t('Asia Pacific - Singapore (ap-southeast-1)'),
      'ap-southeast-2' => $this->t('Asia Pacific - Sydney (ap-southeast-2)'),
      'ap-northeast-1' => $this->t('Asia Pacific - Tokyo (ap-northeast-1)'),
      'ap-northeast-2' => $this->t('Asia Pacific - Seoul (ap-northeast-2)'),
      'ap-northeast-3' => $this->t('Asia Pacific - Osaka-Local (ap-northeast-3)'),
      'sa-east-1' => $this->t('South America - Sao Paulo (sa-east-1)'),
      'cn-north-1' => $this->t('China - Beijing (cn-north-1)'),
      'cn-northwest-1' => $this->t('China - Ningxia (cn-northwest-1)'),
      'ca-central-1' => $this->t('Canada - Central (ca-central-1)'),
    ];
    $form['credentials'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Amazon Web Services Credentials'),
      '#description' => $this->t(
        "To configure your Amazon Web Services credentials, enter the values in the appropriate fields below. To set access and secret key you must use \$settings['aetl.access_key'] and \$settings['aetl.secret_key'] in your site's settings.php file."
      ),
      '#collapsible' => True,
      '#collapsed' => $config->get('aetl_use_instance_profile'),
    ];
    $form['credentials']['aetl_use_instance_profile'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Use EC2 Instance Profile Credentials'),
      '#description' => $this->t(
        'If your Drupal site is running on an Amazon EC2 server, you may use the Instance Profile Credentials from that server rather than setting your AWS credentials directly.'
      ),
      '#default_value' => $config->get('aetl_use_instance_profile'),
    ];
    $form['credentials']['aetl_access_key'] = [
      '#type' => 'textfield',
      '#title' => $this->t(
        'Amazon Web Services Access Key'
      ),
      '#description' => $this->t(
        "<b>Important:</b> this configuration to \$settings['aetl.aetl_access_key'] in your site's settings.php file."
      ),
      '#default_value' => $config->get('aetl_access_key'),
      '#disabled' => TRUE,
      '#states' => [
        'visible' => [
          ':input[id=edit-aetl-use-instace-profile]' => ['checked' => FALSE],
        ]
      ]
    ];
    $form['credentials']['aetl_secret_key'] = [
      '#type' => 'textfield',
      '#title' => $this->t(
        'Amazon Web Services Secret Key'
      ),
      '#description' => $this->t(
        "<b>Important:</b> this configuration to \$settings['aetl.aetl_secret_key'] in your site's settings.php file."
      ),
      '#default_value' => $config->get('aetl_secret_key'),
      '#disabled' => TRUE,
      '#states' => [
        'visible' => [
          ':input[id=edit-aetl-use-instace-profile]' => ['checked' => FALSE],
        ]
      ]
    ];
    $form['credentials']['aetl_credentials_file'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Custom Credentials File Location'),
      '#default_value' => $config->get('aetl_credentials_file'),
      '#description' => $this->t('The custom profile or ini file location. This will use the ini provider instead.'),
      '#states' => [
        'visible' => [
          ':input[id=edit-use-instance-profile]' => ['checked' => TRUE],
        ],
      ],
    ];
    $form['aetl_in_bucket'] = [
      '#type' => 'textfield',
      '#title' => $this->t('S3 Input Bucket Name'),
      '#default_value' => $config->get('aetl_in_bucket'),
      '#description' => $this->t("If you don't set this field, you must set bucket name in your settings.php \$config['s3fs.settings']['aetl_in_bucket']."),
    ];
    $form['aetl_out_bucket'] = [
      '#type' => 'textfield',
      '#title' => $this->t('S3 Output Bucket Name'),
      '#default_value' => $config->get('aetl_out_bucket'),
      '#description' => $this->t("If you don't set this field, you must set bucket name in your settings.php \$config['s3fs.settings']['aetl_out_bucket']."),
    ];
    $form['aetl_region'] = [
      '#type' => 'select',
      '#options' => $region_map,
      '#title' => $this->t('S3 Region'),
      '#default_value' => $config->get('aetl_region'),
      '#description' => $this->t(
        'The region in which your bucket resides. Be careful to specify this accurately,
      as you are likely to see strange or broken behavior if the region is set wrong.<br>
      Use of the USA GovCloud region requires @SPECIAL_PERMISSION.<br>
      Use of the China - Beijing region requires a @CHINESE_AWS_ACCT.',
        [
          '@CHINESE_AWS_ACCT' => Link::fromTextAndUrl($this->t('亚马逊 AWS account'), Url::fromUri('http://www.amazonaws.cn'))
            ->toString(),
          '@SPECIAL_PERMISSION' => Link::fromTextAndUrl($this->t('special permission'), Url::fromUri('http://aws.amazon.com/govcloud-us/'))
            ->toString(),
        ]
      ),
    ];
    return parent::buildForm($form, $form_state); 
  }
  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $values = $form_state->getValues();
    $this->config('aetl.settings')
      ->set('aetl_use_instance_profile', $values['aetl_use_instance_profile'])
      ->set('aetl_credentials_file', $values['aetl_credentials_file'])
      ->set('aetl_in_bucket', $values['aetl_in_bucket'])
      ->set('aetl_out_bucket', $values['aetl_out_bucket'])
      ->set('aetl_region', $values['aetl_region'])
      ->save();

    parent::submitForm($form, $form_state);
  }
}