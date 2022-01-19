<?php

namespace Drupal\aetl;

/**
 * Aetl service interface.
 */
interface AetlServiceInterface {

  /**
   * Validate the Aetl config.
   *
   * @param $config
   *   Array of configuration settings from which to configure the client.
   *
   * @return array
   *   Empty array if configuration is valid, errors array otherwise.
   */
  function validate(array $config);

  /**
   * Sets up the ElasticTranscoderClient object.
   *
   * @param $config
   *   Array of configuration settings from which to configure the client.
   *
   * @return \Aws\ElasticTranscoder\ElasticTranscoderClient
   *   The fully-configured ElasticTranscoderClient object.
   *
   * @throws \Drupal\aetl\AetlException
   */
  function getAmazonETClient(array $config);

  /**
   * Sets up the ElasticTranscoderClient object.
   *
   * @param $config
   *   Array of configuration settings from which to configure the client.
   *
   * @return \Aws\S3\S3Client
   *   The fully-configured ElasticTranscoderClient object.
   *
   * @throws \Drupal\aetl\Aetls3Exception
   */
  function getAmazonETS3Client(array $config);
  /**
   * Sets up the ElasticTranscoderClient object.
   *
   * @param $config
   *   Array of configuration settings from which to configure the client.
   *
   * @return \Aws\ElasticTranscoder\ElasticTranscoderClient
   *   The fully-configured ElasticTranscoderClient object.
   *
   * @throws \Drupal\aetl\Aetls3Exception
   */
  function trancodeCreateJob(array $data);
  
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
  function createPipeline(array $data);
  
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
  function updatePipeline(array $data);

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
  function deletePipeline(array $data);
}
