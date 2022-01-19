<?php
/**
 * @file
 * Contains \Drupal\pfdp\Controller\PfdpController.php
 *
 */
namespace Drupal\pfdp\Controller;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Component\Utility\Unicode;
use Drupal\pfdp\Entity\DirectoryEntity;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Defines PfdpController class.
 */
class PfdpController extends ControllerBase {
 /**
  * Callback function get_pfdp_config()
  **/
  public function get_pfdp_config(){
    $logger = \Drupal::logger('pfdp');
    $settings = \Drupal::config('pfdp.settings');
    $user = \Drupal::currentUser();
    $directories = DirectoryEntity::loadMultiple();
    $uri = '/system/files/user-files/2019-11/63/master/audio/19-mister-sandman_4-2_0.mp3';
    
    die('get pfdp config');
    
    // Extract the path from $uri, removing the protocol prefix and the file name.
    $uri_path = explode('/', $uri);
    array_shift($uri_path);
    array_shift($uri_path);
    array_pop($uri_path);
    // Add a leading slash to $uri_path.
    $uri_path = '/' . implode('/', $uri_path);
    // Find the directory which best matches $uri_path.
    $best_matching_length = 0;
    $best_matching_directory = NULL;
    foreach ($directories as $directory) {
      // Search for the best matching substring.
      $directory_path = $directory->path;
      $directory_path_length = Unicode::strlen($directory_path);
      if (stripos($uri_path, $directory_path) !== false) {
        if ($best_matching_length < Unicode::strlen($directory_path)) {
          $best_matching_length = Unicode::strlen($directory_path);
          $best_matching_directory = $directory;
        }
      }
    }
    
    echo '<pre>'; print_r($best_matching_directory->roles); echo '</pre>';
    $user_roles = $user->getRoles();
    echo '<pre>'; print_r($user_roles); echo '</pre>';
    
    foreach ($user->getRoles() as $rid) {
      if (in_array($rid, $best_matching_directory->roles)) {
        if ($settings->get('debug_mode')) {
          $logger->info('User123 %user granted permission (%roles) to download uri "%uri".', ['%user' => pfdp_get_user_log_details($user), '%roles' => pfdp_get_roles($rid, $best_matching_directory->roles), '%uri' => $uri]);
        }
        //return pfdp_get_download_headers($uri);
      }
    }
    
    die('get config');
  }
  
  /**
  * Callback function get_file()
  **/
  public function get_file($fid = NULL){
    $data = file_load($fid);
    //echo '<pre>'; print_r($data); echo '</pre>';
    $response = [];
    $response['fid'] = $data->get('fid')->value;
    $response['uuid'] = $data->get('uuid')->value;
    $response['uid'] = $data->get('uid')->value;
    $response['filename'] = $data->get('filename')->value;
    $response['uri'] = $data->get('uri')->value;
    $response['filemime'] = $data->get('filemime')->value;
    $response['filesize'] = $data->get('filesize')->value;
    $response['status'] = $data->get('status')->value;
    $response['created'] = $data->get('created')->value;
    $response['changed'] = $data->get('changed')->value;
    $response['origname'] = $data->get('origname')->value;
    
    return new JsonResponse($response);
  }
}
