<?php

namespace Drupal\generate_pdf;

/**
 * Class GeneratePdfService.
 */
class GeneratePdfService implements GeneratePdfServiceInterface {

  /**
   * Constructs a new GeneratePdfService object.
   */
  public function __construct() {
   $this->config = \Drupal::config('media_design_system.kmdsapisettings')->get();
   $this->apiurl = $this->config['access_check_api'];
  }
  
  public function generatePDF($desing_id) {
     // get authorize code
    $auth_code = $this->getAuthCode();
    if(!empty($auth_code)){
      // KMDS Templates
      $endpoint = $this->apiurl."designjson/{$desing_id}";
      $options = [
       'headers' => [
          'Authorization' => "bearer $auth_code",
        ],
        'verify' => FALSE,
      ];
      
      // get templates
      try {
        $response = \Drupal::httpClient()->request('GET', $endpoint, $options);
        $status = $response->getStatusCode();
        if($status == 200){
          $data = json_decode($response->getBody()->getContents());
          return $data; 
        }         
      }
      catch (RequestException $e) {
        watchdog_exception('km_pdf', $e);
      }
    }
  }
  
  
  public function generateproductPDF($product_id) {
     // get authorize code
    $auth_code = $this->getAuthCode();
    if(!empty($auth_code)){
      // KMDS Templates
      $endpoint = $this->apiurl."productjson/{$product_id}";
      $options = [
       'headers' => [
          'Authorization' => "bearer $auth_code",
        ],
        'verify' => FALSE,
      ];
      
      // get templates
      try {
        $response = \Drupal::httpClient()->request('GET', $endpoint, $options);
        $status = $response->getStatusCode();
        if($status == 200){
          $data = json_decode($response->getBody()->getContents());
          return $data; 
        }         
      }
      catch (RequestException $e) {
        watchdog_exception('km_pdf', $e);
      }
    }
  }
  
    /**
   * Returns authorize code.
   * https://www.drupal.org/node/1862446
   * @return $auth_code
   *   for getting authorize code.
   */
  public function getAuthCode(){
    $user = \Drupal::currentUser();
    $uid  = $user->id(); 
    $username = $user->getAccountName();
    $email = $user->getEmail();
    
    // get authorize code     
    $endpoint = $this->apiurl.'user_access_check';
    $options = [
     'headers' => [
        'Content-Type' => 'application/x-www-form-urlencoded',
      ],
      'form_params' => [
        'user_id' => $uid,
        'username' => $username,
        'email' => $email,
      ],
      'verify' => FALSE,
    ];
    
    try {
      $response = \Drupal::httpClient()->request('POST', $endpoint, $options);
      $status = $response->getStatusCode();
      if($status == 200){
        $auth_code = json_decode($response->getBody()->getContents());
        return $auth_code; 
      }         
    }
    catch (RequestException $e) {
      watchdog_exception('km_product', $e);
    }
    return false;
  }
}