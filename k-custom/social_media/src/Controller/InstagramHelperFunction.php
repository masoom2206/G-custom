<?php
namespace Drupal\social_media\Controller;

Class InstagramHelperFunction {
	
	const GRAPH_URL = 'https://graph.instagram.com';
	const API_URL = 'https://api.instagram.com';
	//private $instaClientObject;
	private $long_lived_access_tooken;
	
	public function getInstaObject(){
		global $base_url;
		$config = \Drupal::config('social_media.api_settings')->get();
		$instagram = new \Andreyco\Instagram\Client(array(
		  'apiKey' => $config['instagram_app_id'],
		  'apiSecret' => $config['instagram_app_secret'],
		  'apiCallback' => $base_url.'/social_media_login_link/168',
		 
		 ));
		 $this->$instaClientObject = $instagram ;
		 return $instagram;
			 
		
	}
	/*public function customSetAccessToken($accessToken){
		 $this->$instaClientObject->setAccessToken($accessToken);
		
	}
	
	public function customGetAccessToken(){
		
		
	} */
	
	public function _convert_long_access_token($access_token){
		$params = ['grant_type' => 'ig_exchange_token', 'client_secret' => 'db9a2ea7029f5cf270ae325b7f8964cd', 'access_token'=>$access_token ];
		 if (isset($params) && is_array($params)) {
            $paramString = '&' . http_build_query($params);
        } else {
            $paramString = null;
        }
		//\Drupal::logger('outhToken')->error('<pre><code>' . print_r($paramString, TRUE) . '</code></pre>');
		$graph_host = self::GRAPH_URL.'/access_token'.$paramString; 
		
		$apiCall =  self::GRAPH_URL.'/access_token?grant_type=ig_exchange_token&client_secret='.db9a2ea7029f5cf270ae325b7f8964cd.'&access_token='.$access_token;
		\Drupal::logger('outhToken')->error('<pre><code>' . print_r($apiCall, TRUE) . '</code></pre>');
		 // we want JSON..
        $headerData = array('Accept: application/json');
		
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $apiCall);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headerData);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		
        $jsonData = curl_exec($ch);
        
        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if(403 === $httpcode) {
            $error = json_decode($jsonData, true);
            //throw new CurlException('_makeCall() - ' . $error['error_type'] . ' error: ' . $error['error_message']);
        }

        if (false === $jsonData) {
            //throw new CurlException('_makeCall() - cURL error: ' . curl_error($ch));
        }
        curl_close($ch);
        \Drupal::logger('outhToken')->error('<pre><code>' . print_r($jsonData, TRUE) . '</code></pre>');
        return json_decode($jsonData);
		
		
		//$this->long_lived_access_tooken = 
		
	}
	public function _custom_make_call($function , $params = null, $method = 'GET'){
		
		 if (isset($params) && is_array($params)) {
            $paramString = '&' . http_build_query($params);
        } else {
            $paramString = null;
        }
		
	if($method == 'POST'){	
	 $apiHost = self::API_URL;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $apiHost);
        curl_setopt($ch, CURLOPT_POST, count($apiData));
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($apiData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept: application/json'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $jsonData = curl_exec($ch);
        if (false === $jsonData) {
            throw new CurlException('_makeOAuthCall() - cURL error: ' . curl_error($ch));
        }
        curl_close($ch);

        return json_decode($jsonData);
		
	  }
	}

	public function getIGTokenProperty(object $accessToken, $field_name) {
        $insta = $this->getInstaObject();
        $oAuth2Client = $insta->getOAuth2Client();
        $tokenMetadataObject = $oAuth2Client->debugToken($accessToken);
        \Drupal::logger('tokenMetadataObject')->warning('<pre><code>valid' . print_r($tokenMetadataObject, TRUE) . '</code></pre>');
        return $tokenMetadataObject->getProperty($field_name);
    }

    public function getIGPageInfo($id, $pageAccessToken) {
        $insta = $this->getInstaObject();
        try {
            $response = $insta->get('/' . $id . '?fields=website', $pageAccessToken);
        }
        catch (Exception $e) {
		    echo 'Caught exception: ',  $e->getMessage(), "\n";
		}
        $graphNode = $response->getDecodedBody();
        \Drupal::logger('graphNode info')->warning('<pre><code>valid' . print_r($graphNode, TRUE) . '</code></pre>');
        return $graphNode;
    }
    public function updateIGPageInfo($id, $pageAccessToken, array $fields) {
        $insta = $this->getInstaObject();
        try {
            $response = $insta->post('/' . $id, $fields, $pageAccessToken);
        }
        catch (Exception $e) {
		    echo 'Caught exception: ',  $e->getMessage(), "\n";
		}
        $graphNode = $response->getDecodedBody();
        \Drupal::logger('graphNode update')->warning('<pre><code>valid' . print_r($graphNode, TRUE) . '</code></pre>');
        return $graphNode;
    }
  
}
