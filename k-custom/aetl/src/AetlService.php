<?php

namespace Drupal\aetl;

use Aws\Credentials\CredentialProvider;
use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;
use Aws\ElasticTranscoder\ElasticTranscoderClient;
use Aws\Exception\AwsException;
use Drupal\Core\Cache\Cache;
use Drupal\Core\Config\ConfigFactory;
use Drupal\Core\Database\Connection;
use Drupal\Core\Database\SchemaObjectExistsException;
use Drupal\Core\Messenger\MessengerTrait;
use Drupal\Core\Site\Settings;
use Drupal\Core\StringTranslation\StringTranslationTrait;
//use Drupal\aetl\StreamWrapper\AetlStream;

/**
 * Defines a AetlService service.
 */
class AetlService implements AetlServiceInterface {

  use MessengerTrait;
  use StringTranslationTrait;
  const API_VERSION = '2006-03-01';
  /**
   * The database connection.
   *
   * @var \Drupal\Core\Database\Connection
   */
  protected $connection;

  /**
   * The config factory object.
   *
   * @var \Drupal\Core\Config\ConfigFactory
   */
  protected $configFactory;

  /**
   * Constructs an AetlService object.
   *
   * @param \Drupal\Core\Database\Connection $connection
   *   The new database connection object.
   * @param \Drupal\Core\Config\ConfigFactory $config_factory
   *   The config factory object.
   */
  public function __construct(Connection $connection, ConfigFactory $config_factory) {
    $this->connection = $connection;
    $this->configFactory = $config_factory;
  }

  /**
   * {@inheritdoc}
   */
  public function validate(array $config) {
    $errors = [];
    if (!class_exists('Aws\ElasticTranscoder\ElasticTranscoderClient')) {
      $errors[] = $this->t('Cannot load Aws\ElasticTranscoder\ElasticTranscoderClient class. Please ensure that the aws sdk php library is installed correctly.');
    }
    elseif (!$config['aetl_use_instance_profile'] && (!Settings::get('aetl.aetl_access_key') || !Settings::get('aetl.aetl_secret_key'))) {
      $errors[] = $this->t("Your AWS credentials have not been properly configured.
        Please set them on the AWS setting File System admin/config/media/aetl page or
        set \$settings['aetl.aetl_access_key'] and \$settings['aetl.aetl_secret_key'] in settings.php.");
    }
    if (empty($config['aetl_in_bucket'])) {
      $errors[] = $this->t('Your AmazonS3 Input bucket name is not configured.');
    }
    if (empty($config['aetl_out_bucket'])) {
      $errors[] = $this->t('Your AmazonS3 Output bucket name is not configured.');
    }
    try {
      $s3 = $this->getAmazonETClient($config);
    }
    catch (AwsException $e) {
      $errors[] = $e->getMessage();
    }

    // Test the connection to S3, bucket name and WRITE|READ ACL permissions.
    /*try {
      // These actions will trigger descriptive exceptions if the credentials,
      // bucket name, or region are invalid/mismatched.
      $date = date('dmy-Hi');
      $key = "aetl-tests-results/write-test-{$date}.txt";
      if (!empty($config['root_folder'])) {
        $key = "{$config['root_folder']}/$key";
      }
      $s3->putObject(['Body' => 'Example file uploaded successfully.', 'Bucket' => $config['bucket'], 'Key' => $key]);
      if ($object = $s3->getObject(['Bucket' => $config['bucket'], 'Key' => $key])) {
        $s3->deleteObject(['Bucket' => $config['bucket'], 'Key' => $key]);
      }
    }
    catch (AwsException $e) {
      $errors[] = $this->t('An unexpected error occurred. @message', ['@message' => $e->getMessage()]);
    }*/

    return $errors;
  }

  /**
   * {@inheritdoc}
   *
   * Sets up the ElasticTranscoderClient object.
   * For performance reasons, only one ElasticTranscoderClient object will ever be created
   * within a single request.
   *
   * @param array $config
   *   Array of configuration settings from which to configure the client.
   *
   * @return \Aws\ElasticTranscoder\ElasticTranscoderClient
   *   The fully-configured ElasticTranscoderClient object.
   *
   * @throws \Drupal\aetl\AetlException
   *   The Aetl Exception.
   */
  public function getAmazonETClient(array $config) {
    $et = &drupal_static(__METHOD__ . '_ElasticTranscoderClient');
    $static_config = &drupal_static(__METHOD__ . '_static_config');

    // If the client hasn't been set up yet, or the config given to this call is
    // different from the previous call, (re)build the client.
    if (!isset($et) || $static_config != $config) {
      $client_config = [];
      // If we have configured credentials locally use them, otherwise let the SDK
      // find them per API docs.
      // https://docs.aws.amazon.com/aws-sdk-php/v3/guide/guide/configuration.html#id3
      if (!empty($config['aetl_use_instance_profile'])) {
        // If defined path use that otherwise SDK will check home directory.
        if (!empty($config['aetl_credentials_file'])) {
          $provider = CredentialProvider::ini(NULL, $config['aetl_credentials_file']);
        }
        else {
          // Assume an instance profile provider if no path.
          $provider = CredentialProvider::instanceProfile();
        }
        // Cache the results in a memoize function to avoid loading and parsing
        // the ini file on every API operation.
        $provider = CredentialProvider::memoize($provider);
        $client_config['credentials'] = $provider;
      }
      else {
        $access_key = Settings::get('aetl.aetl_access_key', '');
        // @todo Remove $config['access_key'] and $config['secret_key'] in 8.x-3.0-beta1
        if (!$access_key && !empty($config['aetl_access_key'])) {
          $access_key = $config['aetl_access_key'];
        }
        $secret_key = Settings::get('aetl.aetl_secret_key', '');
        // @todo Remove $config['access_key'] and $config['secret_key'] in 8.x-3.0-beta1
        if (!$secret_key && !empty($config['aetl_secret_key'])) {
          $secret_key = $config['aetl_secret_key'];
        }
        $client_config['credentials'] = [
          'key' => $access_key,
          'secret' => $secret_key,
        ];
      }
      if (!empty($config['aetl_region'])) {
        $client_config['region'] = $config['aetl_region'];
        // Signature v4 is only required in the Beijing and Frankfurt regions.
        // Also, setting it will throw an exception if a region hasn't been set.
        $client_config['signature'] = 'v4';
      }
      $client_config['version'] = '2012-09-25';
      // Create the Aws\ElasticTranscoder\ElasticTranscoderClient object.
      $et = new ElasticTranscoderClient($client_config);
      $static_config = $config;
    }
    return $et;
  }


   /**
   * {@inheritdoc}
   *
   * Sets up the S3Client object.
   * For performance reasons, only one S3Client object will ever be created
   * within a single request.
   *
   * @param array $config
   *   Array of configuration settings from which to configure the client.
   *
   * @return \Aws\S3\S3Client
   *   The fully-configured S3Client object.
   *
   * @throws \Drupal\s3fs\S3fsException
   *   The S3fs Exception.
   */
  public function getAmazonETS3Client(array $config) {
    $s3 = &drupal_static(__METHOD__ . '_ElasticTranscoderClient');
    $static_config = &drupal_static(__METHOD__ . '_static_config');

    // If the client hasn't been set up yet, or the config given to this call is
    // different from the previous call, (re)build the client.
    if (!isset($s3) || $static_config != $config) {
      $client_config = [];
      // If we have configured credentials locally use them, otherwise let the SDK
      // find them per API docs.
      // https://docs.aws.amazon.com/aws-sdk-php/v3/guide/guide/configuration.html#id3
      if (!empty($config['aetl_use_instance_profile'])) {
        // If defined path use that otherwise SDK will check home directory.
        if (!empty($config['aetl_credentials_file'])) {
          $provider = CredentialProvider::ini(NULL, $config['aetl_credentials_file']);
        }
        else {
          // Assume an instance profile provider if no path.
          $provider = CredentialProvider::instanceProfile();
        }
        // Cache the results in a memoize function to avoid loading and parsing
        // the ini file on every API operation.
        $provider = CredentialProvider::memoize($provider);
        $client_config['credentials'] = $provider;
      }
      else {
        $access_key = Settings::get('aetl.aetl_access_key', '');
        // @todo Remove $config['access_key'] and $config['secret_key'] in 8.x-3.0-beta1
        if (!$access_key && !empty($config['aetl_access_key'])) {
          $access_key = $config['aetl_access_key'];
        }
        $secret_key = Settings::get('aetl.aetl_secret_key', '');
        // @todo Remove $config['access_key'] and $config['secret_key'] in 8.x-3.0-beta1
        if (!$secret_key && !empty($config['aetl_secret_key'])) {
          $secret_key = $config['aetl_secret_key'];
        }
        $client_config['credentials'] = [
          'key' => $access_key,
          'secret' => $secret_key,
        ];
      }
      if (!empty($config['aetl_region'])) {
        $client_config['region'] = $config['aetl_region'];
        // Signature v4 is only required in the Beijing and Frankfurt regions.
        // Also, setting it will throw an exception if a region hasn't been set.
        $client_config['signature'] = 'v4';
      }
      if (!empty($config['use_customhost']) && !empty($config['hostname'])) {
        $client_config['endpoint'] = ($config['use_https'] ? 'https://' : 'http://') . $config['hostname'];
      }
      $client_config['version'] = '2006-03-01';
      // Create the Aws\S3\S3Client object.
      $s3 = new S3Client($client_config);
      $static_config = $config;
    }
    return $s3;
  }
 /**
   * {@inheritdoc}
   *
   * Refreshes the metadata cache.
   *
   * Iterates over the full list of objects in the aetl_root_folder within S3
   * bucket (or the entire bucket, if no root folder has been set), caching
   * their metadata in the database.
   *
   * It then caches the ancestor folders for those files, since folders are not
   * normally stored as actual objects in S3.
   *
   * @param array $config
   *   An aetl configuration array.
   */
  public function trancodeCreateJob(array $data) {
    $config = \Drupal::config('aetl.settings')->get();
    $messenger = \Drupal::messenger();
    if ($errors = \Drupal::service('aetl')->validate($config)) {
      foreach ($errors as $error) {
        $messenger->addMessage((string)$error, $messenger::TYPE_ERROR);
      }
      $messenger->addMessage('Unable to validate your aetl configuration settings. Please configure aetl File System from the admin/config/media/aetl page and try again.', $messenger::TYPE_ERROR);
      return;
    }
    $et = &drupal_static(__METHOD__ . '_ElasticTranscoderClient');
    $static_config = &drupal_static(__METHOD__ . '_static_config');

    // If the client hasn't been set up yet, or the config given to this call is
    // different from the previous call, (re)build the client.
    if (!isset($et) || $static_config != $config) {
      $client_config = [];
      // If we have configured credentials locally use them, otherwise let the SDK
      // find them per API docs.
      // https://docs.aws.amazon.com/aws-sdk-php/v3/guide/guide/configuration.html#id3
      if (!empty($config['aetl_use_instance_profile'])) {
        // If defined path use that otherwise SDK will check home directory.
        if (!empty($config['aetl_credentials_file'])) {
          $provider = CredentialProvider::ini(NULL, $config['aetl_credentials_file']);
        }
        else {
          // Assume an instance profile provider if no path.
          $provider = CredentialProvider::instanceProfile();
        }
        // Cache the results in a memoize function to avoid loading and parsing
        // the ini file on every API operation.
        $provider = CredentialProvider::memoize($provider);
        $client_config['credentials'] = $provider;
      }
      else {
        $access_key = Settings::get('aetl.aetl_access_key', '');
        // @todo Remove $config['access_key'] and $config['secret_key'] in 8.x-3.0-beta1
        if (!$access_key && !empty($config['aetl_access_key'])) {
          $access_key = $config['aetl_access_key'];
        }
        $secret_key = Settings::get('aetl.aetl_secret_key', '');
        // @todo Remove $config['access_key'] and $config['secret_key'] in 8.x-3.0-beta1
        if (!$secret_key && !empty($config['aetl_secret_key'])) {
          $secret_key = $config['aetl_secret_key'];
        }
        $client_config['credentials'] = [
          'key' => $access_key,
          'secret' => $secret_key,
        ];
      }
      if (!empty($config['aetl_region'])) {
        $client_config['region'] = $config['aetl_region'];
        // Signature v4 is only required in the Beijing and Frankfurt regions.
        // Also, setting it will throw an exception if a region hasn't been set.
        $client_config['signature'] = 'v4';
      }
      $client_config['version'] = '2012-09-25';
      // Create the Aws\ElasticTranscoder\ElasticTranscoderClient object.
      $et = new ElasticTranscoderClient($client_config);
      $static_config = $config;
    }
    // Create the job.
    try {
      $outputs = [];
      $jobs = (array)$data['output_details'];
      foreach ($jobs as $key => $job) {
        $a = $job['key'];
        $b = $job['preset'];
        $c = $job['ThumbnailPattern'];
        $outputs[] = [
          'Key' => $a,
          'PresetId' => $b,
          'ThumbnailPattern' => $c
        ];
      }
      $create_job_result = $et->createJob([
          'PipelineId' => $data['pipelineid'],
          'Input' => ['Key' => $data['inputdetails']],
          'Outputs' => $outputs,
          'OutputKeyPrefix' => $data['outputkeyprefix']
      ]);
      //var_dump($create_job_result["Job"]);
      return $create_job_result;
    } catch (AwsException $e) {
      // output error message if fails
      echo $e->getMessage() . "\n";
    }
  }
  /**
   * {@inheritdoc}
   *
   * Refreshes the metadata cache.
   *
   * Iterates over the full list of objects in the aetl_root_folder within S3
   * bucket (or the entire bucket, if no root folder has been set), caching
   * their metadata in the database.
   *
   * It then caches the ancestor folders for those files, since folders are not
   * normally stored as actual objects in S3.
   *
   * @param array $data
   *   An aetl configuration array.
   */
  public function createPipeline(array $data) {
    $config = \Drupal::config('aetl.settings')->get();
    $transcoder_client = \Drupal::service('aetl')->getAmazonETClient($config);
    try {
      $result = $transcoder_client->createPipeline($data)->toArray();
    } catch (AwsException $e) {
      // output error message if fails
      echo $e->getMessage() . "\n";
    }
  }

  /**
   * {@inheritdoc}
   *
   * Refreshes the metadata cache.
   *
   * Iterates over the full list of objects in the aetl_root_folder within S3
   * bucket (or the entire bucket, if no root folder has been set), caching
   * their metadata in the database.
   *
   * It then caches the ancestor folders for those files, since folders are not
   * normally stored as actual objects in S3.
   *
   * @param array $data
   *   An aetl configuration array.
   */
  public function updatePipeline(array $data) {
    $config = \Drupal::config('aetl.settings')->get();
    $transcoder_client = \Drupal::service('aetl')->getAmazonETClient($config);
    try {
      $result = $transcoder_client->updatePipeline($data)->toArray();
    } catch (AwsException $e) {
      // output error message if fails
      echo $e->getMessage() . "\n";
    }
  }

  /**
   * {@inheritdoc}
   *
   * Refreshes the metadata cache.
   *
   * Iterates over the full list of objects in the aetl_root_folder within S3
   * bucket (or the entire bucket, if no root folder has been set), caching
   * their metadata in the database.
   *
   * It then caches the ancestor folders for those files, since folders are not
   * normally stored as actual objects in S3.
   *
   * @param array $data
   *   An aetl configuration array.
   */
  public function deletePipeline(array $data) {
    $config = \Drupal::config('aetl.settings')->get();
    $transcoder_client = \Drupal::service('aetl')->getAmazonETClient($config);
    try {
      $result = $transcoder_client->deletePipeline($data)->toArray();
    } catch (AwsException $e) {
      // output error message if fails
      echo $e->getMessage() . "\n";
    }
  }
}
