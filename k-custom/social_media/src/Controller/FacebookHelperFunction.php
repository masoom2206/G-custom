<?php
namespace Drupal\social_media\Controller;
Class FacebookHelperFunction {
    public function getFBObject() {
        $config = \Drupal::config('social_media.api_settings')->get();
        $fb = new \Facebook\Facebook(['app_id' => $config['facebook_app_id'], 'app_secret' => $config['facebook_app_secret'], 'default_graph_version' => 'v10.0', ]);
        return $fb;
    }
    public function getFBTokenProperty(object $accessToken, $field_name) {
        //to reduce Api call , we have commented code for validation the token
        /*$fb = $this->getFBObject();
        $oAuth2Client = $fb->getOAuth2Client();
        $tokenMetadataObject = $oAuth2Client->debugToken($accessToken);
        return $tokenMetadataObject->getProperty($field_name);*/
        return 1;
    }
    public function fbUploadVideos($fb_page_id, $pageAccessToken, $media_id_url, array $link_data) {
        //$page_access_token = $this->getFBPageAccessToken($fb_page_id , $access_token_val);
        $fb = $this->getFBObject();
        $data = ['title' => $link_data['message'], 'description' => $link_data['message'], 'source' => $fb->videoToUpload($media_id_url),
        //'published' => false,
        ];
        if (array_key_exists('scheduled_publish_time', $link_data)) {
            $data['scheduled_publish_time'] = $link_data['scheduled_publish_time'];
            $data['published'] = false;
        }
        try {
            $response = $fb->post('/' . $fb_page_id . '/videos', $data, $pageAccessToken);
        }
        catch(\Facebook\Exceptions\FacebookResponseException $e) {
            $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Graph SDK Exception', 'custom_type' => 'Facebook Error Reported',));
            echo json_encode($output);
            exit;
        }
        catch(\Facebook\Exceptions\FacebookSDKException $e) {
            $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Facebook SDK Exception', 'custom_type' => 'Facebook Error Reported',));
            echo json_encode($output);
            exit;
        }
        $graphNode = $response->getDecodedBody();
        // \Drupal::logger('facebook publish posts')->warning('<pre><code> video' . print_r($graphNode['id'], TRUE) . '</code></pre>');
        return $graphNode;
    }
    public function fbUploadPhotos($fb_page_id, $pageAccessToken, $media_id_url) {
        $fb = $this->getFBObject();
        //$page_access_token = $this->getFBPageAccessToken($fb_page_id , $access_token_val);
        $Data = ['url' => $media_id_url, 'published' => 'false', 'caption' => 'this is the captions', ];
        try {
            $response = $fb->post('/' . $fb_page_id . '/photos', $Data, $pageAccessToken);
        }
        catch(\Facebook\Exceptions\FacebookResponseException $e) {
            $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Graph SDK Exception', 'custom_type' => 'Facebook Error Reported',));
            echo json_encode($output);
            exit;
        }
        catch(\Facebook\Exceptions\FacebookSDKException $e) {
            $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Facebook SDK Exception', 'custom_type' => 'Facebook Error Reported',));
            echo json_encode($output);
            exit;
        }
        $graphNode = $response->getDecodedBody();
        //\Drupal::logger('facebook upload phot0')->warning('<pre><code>' . print_r($graphNode, TRUE) . '</code></pre>');
        return $graphNode['id'];
    }
    public function getFBPageAccessToken($page_id, $validated_user_access_token) {
        //$facebookHelper = new FacebookHelperFunction();
        $fb = $this->getFBObject();
        try{
        $response = $fb->get($page_id . '?fields=access_token', $validated_user_access_token);
        }
        catch(\Facebook\Exceptions\FacebookResponseException $e) {
            $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Graph SDK Exception', 'custom_type' => 'Facebook Error Reported',));
            echo json_encode($output);
            exit;
        }
        catch(\Facebook\Exceptions\FacebookSDKException $e) {
            $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Facebook SDK Exception', 'custom_type' => 'Facebook Error Reported',));
            echo json_encode($output);
            exit;
        }
        $result = $response->getDecodedBody();
        return $result['access_token'];
    }
    public function fetchFBPageCat($validated_user_access_token) {
        $fb = $this->getFBObject();
        $response = $fb->get('/fb_page_categories', $validated_user_access_token);
        return $response->getDecodedBody();
    }
    public function getFBTotalObjectLiked($object_id, $pageAccessToken) {
        /*
        $object_id will be post_id or comment_id
        */
        //$facebookHelper = new FacebookHelperFunction();
        $fb = $this->getFBObject();
        $response = $fb->get('/' . $object_id . '?fields=likes.summary(true)', $pageAccessToken);
        $result_like = $response->getDecodedBody();
        return $result_like;
    }
    public function getFBUserOrPagePicture($id, $pageAccessToken) {
        /*
        id could be page_id or user_id
        Access public picture, So able to access
        
        */
        //$facebookHelper = new FacebookHelperFunction();
        $fb = $this->getFBObject();
        $response = $fb->get('/' . $id . '/picture?redirect=0&height=200&width=200&type=normal', $pageAccessToken);
        $profile_pic = $response->getDecodedBody();
        return $profile_pic;
    }
    public function getFBPageInfo($id, $pageAccessToken) {
        $fb = $this->getFBObject();
        try {
            // Returns a `FacebookFacebookResponse` object
            $response = $fb->get('/' . $id . '?fields=about,phone,emails,website,description,category_list,cover,picture', $pageAccessToken);
        }
        catch(\Facebook\Exceptions\FacebookResponseException $e) {
            $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Graph SDK Exception', 'custom_type' => 'Facebook Error Reported',));
            echo json_encode($output);
            exit;
        }
        catch(\Facebook\Exceptions\FacebookSDKException $e) {
            $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Facebook SDK Exception', 'custom_type' => 'Facebook Error Reported',));
            echo json_encode($output);
            exit;
        }
        $graphNode = $response->getDecodedBody();
        return $graphNode;
    }
    public function updateFBPageInfo($id, $pageAccessToken, array $fields) {
        $fb = $this->getFBObject();
        try {
            // Returns a `FacebookFacebookResponse` object
            $response = $fb->post('/' . $id, $fields, $pageAccessToken);
        }
        catch(\Facebook\Exceptions\FacebookResponseException $e) {
            $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Graph SDK Exception', 'custom_type' => 'Facebook Error Reported',));
            echo json_encode($output);
            exit;
        }
        catch(\Facebook\Exceptions\FacebookSDKException $e) {
            $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Facebook SDK Exception', 'custom_type' => 'Facebook Error Reported',));
            echo json_encode($output);
            exit;
        }
        $graphNode = $response->getDecodedBody();
        return $graphNode;
    }
    public function updateFBPageImage($id, $pageAccessToken, $update_parameter) {
       /* \Drupal::logger('facebook publish posts')->warning('<pre><code>' . print_r($id, TRUE) . '</code></pre>');
        \Drupal::logger('facebook publish posts')->warning('<pre><code>' . print_r($pageAccessToken, TRUE) . '</code></pre>');
        \Drupal::logger('facebook publish posts')->warning('<pre><code>' . print_r($update_parameter, TRUE) . '</code></pre>'); */
        $fb = $this->getFBObject();
        try {
            // Returns a `FacebookFacebookResponse` object
            if ($update_parameter['type'] == 'profile') {
                $data['photo'] = $update_parameter['photo_id'];
                $response = $fb->post('/' . $id . '/picture', $data, $pageAccessToken);
            } else {
                $data['cover'] = $update_parameter['photo_id'];
                $response = $fb->post('/' . $id, $data, $pageAccessToken);
            }
        }
        catch(\Facebook\Exceptions\FacebookResponseException $e) {
            $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Graph SDK Exception', 'custom_type' => 'Facebook Error Reported',));
            echo json_encode($output);
            exit;
        }
        catch(\Facebook\Exceptions\FacebookSDKException $e) {
            $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Facebook SDK Exception', 'custom_type' => 'Facebook Error Reported',));
            echo json_encode($output);
            exit;
        }
        $graphNode = $response->getDecodedBody();
       // \Drupal::logger('facebook publish posts graphNode')->warning('<pre><code>' . print_r($graphNode, TRUE) . '</code></pre>');
        return $graphNode;
    }
	// get ad account 
	public function getFacebookAdAccounts($userAccessToken) {
        $fb = $this->getFBObject();
        $validToken = $this->getFBTokenProperty($userAccessToken, 'is_valid');
        if ($validToken) {
            $access_token_val = $userAccessToken->getValue();
            try {
                // Returns a `FacebookFacebookResponse` object
                $response = $fb->get('/me/adaccounts?fields=account_status,name,account_id', $access_token_val);
            }
            catch(\Facebook\Exceptions\FacebookResponseException $e) {
                $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Graph SDK Exception', 'custom_type' => 'Facebook Error Reported',));
                echo json_encode($output);
                exit;
            }
            catch(\Facebook\Exceptions\FacebookSDKException $e) {
                $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Facebook SDK Exception', 'custom_type' => 'Facebook Error Reported',));
                echo json_encode($output);
                exit;
            }
			$graphNode = $response->getDecodedBody();
               // \Drupal::logger('facebook  ad Api')->warning('<pre><code> pages' . print_r($graphNode, TRUE) . '</code></pre>');
				return $graphNode;
		}	
	}	
    public function getAllFacebookPages($userAccessToken) {
        $fb = $this->getFBObject();
        $validToken = $this->getFBTokenProperty($userAccessToken, 'is_valid');
        if ($validToken) {
            $access_token_val = $userAccessToken->getValue();
            try {
                // Returns a `FacebookFacebookResponse` object
                $response = $fb->get('/me/accounts', $access_token_val);
            }
            catch(\Facebook\Exceptions\FacebookResponseException $e) {
                $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Graph SDK Exception', 'custom_type' => 'Facebook Error Reported',));
                if(isset($_SESSION['social_media_page_load'])){
                  unset($_SESSION['social_media_page_load']);
                  return $output;
                }
                else {
                  echo json_encode($output);
                  exit;
                }
            }
            catch(\Facebook\Exceptions\FacebookSDKException $e) {
                $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Facebook SDK Exception', 'custom_type' => 'Facebook Error Reported',));
                if(isset($_SESSION['social_media_page_load'])){
                  unset($_SESSION['social_media_page_load']);
                  return $output;
                }
                else {
                  echo json_encode($output);
                  exit;
                }
            }
            $fb_pages = [];
            if ($response) {
                $graphNode = $response->getDecodedBody();
                //\Drupal::logger('facebook Api')->warning('<pre><code> pages' . print_r($response, TRUE) . '</code></pre>');
                foreach ($graphNode['data'] as $key => $value) {
                    $fb_pages[$value['id']] = $value['name'];
                }
                return array_reverse($fb_pages, true);
            } else {
                return $fb_pages;
            }
        }
    }
    public function getAllInstagramAccounts($userAccessToken) {
        $fb = $this->getFBObject();
        $instaAccounts = [];
        $fb_pages = $this->getAllFacebookPages($userAccessToken);
        if (!empty($fb_pages)) {
            if(isset($fb_pages['error'])){
              return $fb_pages;
            }
            foreach ($fb_pages as $page_id => $page_name) {
                try {
                    // Returns a `FacebookFacebookResponse` object
                    $response = $fb->get($page_id . '?fields=instagram_business_account', $userAccessToken);
                }
                catch(\Facebook\Exceptions\FacebookResponseException $e) {
                    $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Graph SDK Exception', 'custom_type' => 'Facebook Error Reported',));
                    if(isset($_SESSION['social_media_page_load'])){
                      unset($_SESSION['social_media_page_load']);
                      return $output;
                    }
                    else {
                      echo json_encode($output);
                      exit;
                    }
                }
                catch(\Facebook\Exceptions\FacebookSDKException $e) {
                    $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Facebook SDK Exception', 'custom_type' => 'Facebook Error Reported',));
                    if(isset($_SESSION['social_media_page_load'])){
                      unset($_SESSION['social_media_page_load']);
                      return $output;
                    }
                    else {
                      echo json_encode($output);
                      exit;
                    }
                }
                if ($response) {
                    $graphNode = $response->getDecodedBody();
                    if (array_key_exists('instagram_business_account', $graphNode)) {
                        $response2 = $fb->get($graphNode['instagram_business_account']['id'] . '?fields=username,name', $userAccessToken);
                        $instaAccountData = $response2->getDecodedBody();
                        $instaAccounts[$graphNode['instagram_business_account']['id']] = $response2->getDecodedBody();
                        $instaAccounts[$graphNode['instagram_business_account']['id']]['page_name'] = $page_name;
                    }
                   // \Drupal::logger('Social Media Insta new')->error('<pre><code>' . print_r($instaAccounts, TRUE) . '</code></pre>');
                }
            }
        }
        return $instaAccounts;
    }
    public function facebookObjectLike($userAccessToken, $fb_page_id, $fb_object_id, $op) {
        //$op is boolean liked/disliked
        $validToken = $this->getFBTokenProperty($userAccessToken, 'is_valid');
        if ($validToken) {
            $access_token_val = $userAccessToken->getValue();
            //get page access tken with user access token
            $page_access_token = $this->getFBPageAccessToken($fb_page_id, $access_token_val);
            // \Drupal::logger('facebook_new')->warning('<pre><code>' . print_r($page_access_token, TRUE) . '</code></pre>');
            $fb = $this->getFBObject();
            try {
                // Returns a `FacebookFacebookResponse` object
                if ($op == 0) {
                    $response = $fb->delete('/' . $fb_object_id . '/likes', array(), $page_access_token);
                } else {
                    $response = $fb->post('/' . $fb_object_id . '/likes', array(), $page_access_token);
                }
            }
            catch(\Facebook\Exceptions\FacebookResponseException $e) {
                $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Graph SDK Exception', 'custom_type' => 'Facebook Error Reported',));
                echo json_encode($output);
                exit;
            }
            catch(\Facebook\Exceptions\FacebookSDKException $e) {
                $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Facebook SDK Exception', 'custom_type' => 'Facebook Error Reported',));
                echo json_encode($output);
                exit;
            }
            $graphNode = $response->getDecodedBody();
            $output['response'] = 1;
            return $output;
        } else {
            \Drupal::logger('facebook')->warning('inValid User Access Token');
            $output['response'] = 'inValid User Access Token';
        }
        return $output;
    }
    public function facebookCommentOperations($userAccessToken, $fb_page_id, $fb_object_id, $requests, $op) {
        // we need to validate token
        $validToken = $this->getFBTokenProperty($userAccessToken, 'is_valid');
        // \Drupal::logger('facebook_new')->warning('<pre><code>valid' . print_r($validToken, TRUE) . '</code></pre>');
        if ($validToken) {
            $access_token_val = $userAccessToken->getValue();
            //get page access tken with user access token
            $page_access_token = $this->getFBPageAccessToken($fb_page_id, $access_token_val);
            // \Drupal::logger('facebook_new')->warning('<pre><code> page access' . print_r($page_access_token, TRUE) . ' page access</code></pre>');
            $fb = $this->getFBObject();
            try {
                // Returns a `FacebookFacebookResponse` object
                if ($op == 'Remove') {
                    //delete coments
                    $response = $fb->delete('/' . $fb_object_id, array(), $page_access_token);
                } elseif ($op == 'publish') {
                    //publish comment
                    $response = $fb->post('/' . $fb_object_id . '/comments', $requests, $page_access_token);
                } else {
                    //edit comment
                    $response = $fb->post('/' . $fb_object_id, $requests, $page_access_token);
                }
            }
            catch(\Facebook\Exceptions\FacebookResponseException $e) {
                $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Graph SDK Exception', 'custom_type' => 'Facebook Error Reported',));
                echo json_encode($output);
                exit;
            }
            catch(\Facebook\Exceptions\FacebookSDKException $e) {
                $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Facebook SDK Exception', 'custom_type' => 'Facebook Error Reported',));
                echo json_encode($output);
                exit;
            }
            $graphNode = $response->getDecodedBody();
            $output['response'] = $graphNode;
        } else {
            //  \Drupal::logger('facebook')->warning('inValid User Access Token');
            $output['response'] = 'inValid User Access Token';
        }
        return $output;
    }
}
