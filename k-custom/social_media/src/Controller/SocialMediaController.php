<?php
/**
 * @file
 * Contains \Drupal\social_media\Controller\SocialMediaController.php
 *
 */
namespace Drupal\social_media\Controller;
use Drupal\social_media\Controller;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Response;
use Drupal\s3fs\S3fsService;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;
use Drupal\node\Entity\Node;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Component\Serialization\Json;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Template\TwigEnvironment;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\getid3\getid3_load;
use Drupal\getid3\getid3_analyze;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Abraham\TwitterOAuth\TwitterOAuth;
use Drupal\Core\Render\Markup;
use Drupal\Core\Link;
use Drupal\Core\Url;
/**
 * Defines SocialMediaController class.
 */
class SocialMediaController extends ControllerBase implements ContainerInjectionInterface {
    /**
     * @var Drupal\Core\Template\TwigEnvironment
     */
    protected $twig;
    public function __construct(TwigEnvironment $twig) {
        $this->twig = $twig;
    }
    public static function create(ContainerInterface $container) {
        return new static ($container->get('twig'));
    }
    public function get_media_tags() {
        $term = \Drupal::request()->get('search');
        //fetch default media kit of a user
        $tags = \Drupal::database()->select('taxonomy_term_field_data', 't')->fields('t', ['tid', 'name'])->condition('t.vid', 'keywords', '=')->condition('t.name', "$term%", 'like')->execute();
        $response = [];
        while ($row = $tags->fetchObject()) {
            $response[] = ['value' => $row->tid, 'text' => $row->name];
        }
        echo json_encode($response);
        exit;
    }
    /**
     * Download media to Public Folder,In order to access the media through Facebook Graph Api.
     */
    public function downloadMIDToPublicFolder($mid_target_id) {
        $destdir = \Drupal::service('stream_wrapper_manager')->getViaUri('temporary://')->getUri();
        $file = File::load($mid_target_id);
        $file_name = $file->getFilename();
        $file_path = $destdir . '/' . $file_name;
        if ($file = file_copy($file, $file_path, FILE_EXISTS_REPLACE)) {
            $url = drupal_realpath($file_path);
            $config = \Drupal::config('s3fs.settings')->get();
            $s3 = s3fsService::getAmazonS3Client($config);
            $key = 's3fs-public/social_media/' . $file_name;
            $result = $s3->putObject(['Bucket' => $config['bucket'], 'Key' => $key, 'SourceFile' => $url, 'ACL' => 'public-read', ]);
            unlink($url);
            return $s3->getObjectUrl($config['bucket'], $key);
        } else {
            die("Could not copy " . $file_path . " in " . $destdir);
        }
    }
    /**
     * Download media to Public Folder,In order to access the image/ base64 through Facebook Graph Api.
     */
    public function saveImagePublicFolder($imageBase64) {
        $data = explode(',', $imageBase64);
        $imageData = $data[1];
        $generate_recommended_file_name_data = 'temporary://temp_file.jpg';
        $generate_recommended_file_name = \Drupal::service('file_system')->realpath($generate_recommended_file_name_data);
        $bin = base64_decode($imageData);
        // Load GD resource from binary data
        $im = imageCreateFromString($bin);
        if (!$im) {
            die('Base64 value is not a valid image');
        }
        // Specify the location where you want to save the image
        $img_file = \Drupal::service('file_system')->realpath('temporary://' . rand() . '.png');
        imagepng($im, $img_file, 0);
        $cmd = "convert $img_file $generate_recommended_file_name";
        exec($cmd, $op);
        sleep(5);
        $fileContent = file_get_contents($generate_recommended_file_name);
        $directory = "public://";
        $destination = $directory . 'temp_file.jpg';
        \Drupal::service('file_system')->prepareDirectory($directory, \Drupal\Core\File\FileSystemInterface::CREATE_DIRECTORY);
        try {
            $file = file_save_data($fileContent, $destination, FILE_EXISTS_RENAME);
            $destdir = \Drupal::service('stream_wrapper_manager')->getViaUri('temporary://')->getUri();
            $file_name = $file->getFilename();
            $file_path = $destdir . '/' . $file_name;
            if ($file = file_copy($file, $file_path, FILE_EXISTS_REPLACE)) {
                $url = drupal_realpath($file_path);
                $config = \Drupal::config('s3fs.settings')->get();
                $s3 = s3fsService::getAmazonS3Client($config);
                $key = 's3fs-public/social_media/' . $file_name;
                $result = $s3->putObject(['Bucket' => $config['bucket'], 'Key' => $key, 'SourceFile' => $url, 'ACL' => 'public-read', ]);
                unlink($url);
                return $s3->getObjectUrl($config['bucket'], $key);
            } else {
                die("Could not copy " . $file_path . " in " . $destdir);
            }
        }
        catch(Exception $e) {
            echo 'Message: ' . $e->getMessage();
        }
    }
    /**
     * Publish the tweet on twitter through twitter Graph Api.
     */
    public function twitter_tweet_publish(array $post_data, $uid) {
        $current_uid = $uid;
        $properties = ['token_access', 'id', 'status'];
        $network_properties = $this->getKabbodeNetworkStatusProperty(174, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        $TwitterHelper = new TwitterHelperFunction();
        $connection = new TwitterOAuth($TwitterHelper->getTwitterAPIKey(), $TwitterHelper->getTwitterSecretKey(), $access_token->oauth_token, $access_token->oauth_token_secret);
        $parameters['status'] = $post_data['message'];
        $mids = $post_data['mids'];
        // $public_url_videos = [];
        // $public_url_image  = [];
        
        foreach ($mids as $mid) {
            $media = Media::load($mid);
            if (is_object($media)) {
                if ($media->hasField('field_media_video_file')) {
                    $targetid = $media->field_media_video_file->target_id;
                    $public_url_videos = $this->downloadMIDToPublicFolder($targetid);
                    $videoUrl = $public_url_videos;
                    $ch = curl_init($videoUrl);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_HEADER, true);
                    curl_setopt($ch, CURLOPT_NOBODY, true);
                    curl_exec($ch);
                    $sizeBytes = curl_getinfo($ch, CURLINFO_CONTENT_LENGTH_DOWNLOAD);
                    curl_close($ch);
                    $connection->setTimeouts(10, 30);
                    $media1 = $connection->upload('media/upload', ['media' => $videoUrl, 'total_bytes' => $sizeBytes, 'media_type' => 'video/mp4','media_category' =>'tweet_video'], true);
                    if (isset($media1->errors) || isset($media1->error)) {
                        if($media1->errors){
                           $output = array('error' => array('msg' => $media1->errors['0']->message, 'code' => $media1->errors['0']->code, 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                           echo json_encode($output);
                           exit;                
                        }
                        else if($media1->error){
                          $output = array('error' => array('msg' => $media1->error, 'code' => '', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                          echo json_encode($output);
                          exit;                
                        }
                   }
                  else{ 
                    $count = 0;
                    do{
                    $statusResponse = $connection->mediaStatus($media1->media_id_string);
                    if ($statusResponse->processing_info->state == 'failed'){
                        $output = array('error' => array('msg' => $statusResponse->processing_info->error->message, 'code' => $statusResponse->processing_info->error->code, 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                         echo json_encode($output);
                          exit; 
                    }
                    else if ($statusResponse->processing_info->state != 'succeeded')
                     { sleep(5); }
                    $count++;
                    }
                    while ($statusResponse->processing_info->state != 'succeeded' && $count < 10);
                   }
                    if ( $media1 && isset($media1->media_id_string)) {
                        $parameters = ['status' =>$post_data['message'], 'media_ids' => $media1->media_id_string, ];
                        $result = $connection->post('statuses/update', $parameters);
                        if ($connection->getLastHttpCode() == 200) {
                          return $result->id;
                        }
                        else{
                            if (isset($result->errors) || isset($result->error)) {
                                if($result->errors){
                                   $output = array('error' => array('msg' => $result->errors['0']->message, 'code' => $result->errors['0']->code, 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                                   echo json_encode($output);
                                   exit;                
                                }
                                else if($result->error){
                                  $output = array('error' => array('msg' => $result->error, 'code' => '', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                                  echo json_encode($output);
                                  exit;                
                                }
                            }                    
                        }   
                    }

                } elseif ($media->hasField('field_media_image')) {
                    $targetid = $media->field_media_image->target_id;
                    $public_url_image = $this->downloadMIDToPublicFolder($targetid);
                    $media1 = $connection->upload('media/upload', ['media' => $public_url_image]);
                    $media_file[] = $media1->media_id_string;
                }
            }
        }
        if (isset($media_file)) {
            $parameters = ['media_ids' => implode(',', $media_file) ];
        }
        $parameters['status'] = $post_data['message'];
        $result = $connection->post('statuses/update', $parameters);
        //\Drupal::logger('twitter Api')->warning('<pre><code>' . print_r($result, TRUE) . '</code></pre>');
        if (isset($result->errors) || isset($result->error)) {
            if($result->errors){
               $output = array('error' => array('msg' => $result->errors['0']->message, 'code' => $result->errors['0']->code, 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
               echo json_encode($output);
               exit;                
            }
            else if($result->error){
              $output = array('error' => array('msg' => $result->error, 'code' => '', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
              echo json_encode($output);
              exit;                
            }
          }  
          else{
           return $result->id;
          }
    }
    /**
     * Publish the media on Instagram through Instagram Graph Api.
     */
    public function instagram_publish_media($instagram_account_id, array $post_data, $uid) {
        $current_uid = $uid;
        $facebookHelper = new FacebookHelperFunction();
        $fb = $facebookHelper->getFBObject();
        $properties = ['token_access', 'id', 'status'];
        $network_properties = $this->getKabbodeNetworkStatusProperty(168, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        // we need to validate token
        $validToken = $facebookHelper->getFBTokenProperty($access_token, 'is_valid');
        if ($validToken) {
            $access_token_val = $access_token->getValue();
            $linkData['caption'] = $post_data['message'];
            $mids = $post_data['mids'];
            foreach ($mids as $mid) {
                $media = Media::load($mid);
                if (is_object($media)) {
                    if ($media->hasField('field_media_video_file')) {
                        $targetid = $media->field_media_video_file->target_id;
                        $linkData['video_url'] = $this->downloadMIDToPublicFolder($targetid);
                        $linkData['media_type'] = 'VIDEO';
                    } elseif ($media->hasField('field_media_image')) {
                        $targetid = $media->field_media_image->target_id;
                        $linkData['image_url'] = $this->downloadMIDToPublicFolder($targetid);
                    }
                }
            }
            //\Drupal::logger('instagram Graph Api')->warning('<pre><code>' . print_r($linkData, TRUE) . '</code></pre>');
            // create media container
            try {
                $response = $fb->post('/' . $instagram_account_id . '/media', $linkData, $access_token_val);
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
            $api_response = $response->getDecodedBody();
            sleep(20);
            // verify if media is successfully uploaded to instagram
            $isMediaUploaded = $this->isMedaiUploadedToInstagram($access_token_val, $api_response['id']);
            \Drupal::logger('instagram Graph Api')->warning('<pre><code> media upload' . print_r($isMediaUploaded, TRUE) . '</code></pre>');
            if ($isMediaUploaded) {
                $data['creation_id'] = $api_response['id'];
                try {
                    $response = $fb->post('/' . $instagram_account_id . '/media_publish', $data, $access_token_val);
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
                $response = $response->getDecodedBody();
                return $response;
            } else {
                 $output = array('error' => array('msg' => 'Unsupported Media, Please upload another media.', 'code' => 999, 'type' => 'Facebook SDK Exception',));
                 echo json_encode($output);
                exit;
            }
        }
    }
    public function isMedaiUploadedToInstagram($access_token_val, $media_id) {
        // \Drupal::logger('instagram Graph Api')->warning('<pre><code> validate' . print_r($media_id, TRUE) . '</code></pre>');
        $facebookHelper = new FacebookHelperFunction();
        $fb = $facebookHelper->getFBObject();
        try{
         $response = $fb->get('/' . $media_id . '?fields=status_code', $access_token_val);
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
        $api_response = $response->getDecodedBody();
         \Drupal::logger('instagram Graph Api')->warning('<pre><code> ' . print_r($api_response['status_code'], TRUE) . '</code></pre>');
        if ($api_response['status_code'] == 'FINISHED') {
            return 1;
        } elseif ($api_response['status_code'] == 'IN_PROGRESS') {
            sleep(30);
            if ($this->isMedaiUploadedToInstagram($access_token_val, $media_id) == 1) {
                return 1;
            }
        } else {
            return 0;
        }
    }
    /**
     * Publish the posts on Facebook through facebook Graph Api.
     */
    public function facebook_post_publish($fb_page_id, array $post_data, $uid) {
        //$current_uid = \Drupal::currentUser()->id();
        $current_uid = $uid;
        $facebookHelper = new FacebookHelperFunction();
        $fb = $facebookHelper->getFBObject();
        $properties = ['token_access', 'id', 'status'];
        $network_properties = $this->getKabbodeNetworkStatusProperty(166, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        // we need to validate token
        $validToken = $facebookHelper->getFBTokenProperty($access_token, 'is_valid');
        if ($validToken) {
            $access_token_val = $access_token->getValue();
            //check if page exists
            /* $allFbPages = $facebookHelper->getAllFacebookPages($access_token);
            if (!array_key_exists($fb_page_id, $allFbPages)) {
                return 'inValidPage';
            } */
            //get page access tken with user access token
            $page_access_token = $facebookHelper->getFBPageAccessToken($fb_page_id, $access_token_val);
            $linkData['message'] = $post_data['message'];
            $mids = $post_data['mids'];
            //if schedule_publish_time is greater than 0, its going to schedule in future
            if ($post_data['scheduled_publish_time'] > 0) {
                $linkData['scheduled_publish_time'] = $post_data['scheduled_publish_time'];
                $linkData['published'] = false;
            }
            $public_url_videos = [];
            $public_url_image = [];
            foreach ($mids as $mid) {
                $media = Media::load($mid);
                if (is_object($media)) {
                    if ($media->hasField('field_media_oembed_video')) {
                        $remote_link = $media->field_media_oembed_video->value;
                        $linkData['link'] = $remote_link;
                    } elseif ($media->hasField('field_media_video_file')) {
                        $targetid = $media->field_media_video_file->target_id;
                        $public_url_videos = $this->downloadMIDToPublicFolder($targetid);
                        $uploaded_id = $facebookHelper->fbUploadVideos($fb_page_id, $page_access_token, $public_url_videos, $linkData);
                        return $uploaded_id;
                    } elseif ($media->hasField('field_media_image')) {
                        $targetid = $media->field_media_image->target_id;
                        $public_url_image = $this->downloadMIDToPublicFolder($targetid);
                        $uploaded_id = $facebookHelper->fbUploadPhotos($fb_page_id, $page_access_token, $public_url_image);
                        //\Drupal::logger('facebook upload phot0 id')->warning('<pre><code>' . print_r($uploaded_id, TRUE) . '</code></pre>');
                        $linkData['attached_media'][] = '{"media_fbid":"' . $uploaded_id . '"}';
                    }
                }
            }
            // single photo post is not scheduling, so just make it double
            if (count($linkData['attached_media']) == 1 && $post_data['scheduled_publish_time'] > 0) {
                array_push($linkData['attached_media'], $linkData['attached_media'][0]);
            }
            //Post/schedule post to Facebook
            try {
                $response = $fb->post('/' . $fb_page_id . '/feed', $linkData, $page_access_token);
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
            $fb_response = $response->getDecodedBody();
        }
        return $fb_response;
    }
    /**
     * Generate Social Media Login Link to get Access Token of Users and save Access Token to Database.
     */
    public function social_media_login_link($social_media_id) {
        global $base_secure_url;
        // replace http with https, if base_url has http instead of https as site has been redirected from http to https. In this case base_url always returning http
        //$base_url = preg_replace("/^http:/i", "https:", $base_secure_url);
        $uid = \Drupal::request()->get('uid');
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        //$current_uid = \Drupal::currentUser()->id();
        $social_media_login_links = [];
        // Login URL for Facebook
        if ($social_media_id == 166) {
            $facebookHelper = new FacebookHelperFunction();
            $fb = $facebookHelper->getFBObject();
            $handler = $fb->getRedirectLoginHelper();
            $redirectedTo = $base_secure_url . "/social_media_login_link/166";
          //  $permissions = ['email', 'user_friends', 'user_gender', 'user_hometown', 'user_likes', 'user_location', 'user_birthday', 'user_age_range', 'user_photos', 'user_videos', 'user_posts', 'manage_pages', 'publish_pages', 'publish_video', 'publish_to_groups', 'groups_access_member_info', 'ads_management', 'ads_read', 'pages_manage_cta', 'read_insights', 'attribution_read', 'pages_manage_instant_articles', 'business_management', 'catalog_management', 'leads_retrieval', 'pages_show_list'];
			//$permissions = ['manage_pages','publish_pages'];
			//manages_pages and publish_pages deprecated
			$permissions = ['pages_manage_posts','pages_manage_engagement','pages_manage_metadata', 'pages_read_engagement', 'pages_show_list', 'pages_read_user_content', 'ads_management'];

            $social_media_login_links['link'] = $handler->getLoginUrl($redirectedTo, $permissions);
		   //$social_media_login_links['link'] = $handler->getReAuthenticationUrl($redirectedTo, $permissions);
		  
            try {
                $access_token = $handler->getAccessToken();
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
            if (!$access_token) {
                //redirect source to getting start page,if any error
                if (isset($_GET['error']) && $_GET['error'] == 'access_denied') {
                  if(isset($_GET['team'])){
                    $gid = $_GET['team'];
                    $muid = $_GET['muid'];
                    $current_uid = \Drupal::currentUser()->id();
                    return new RedirectResponse(Url::fromRoute('social_media.getstart_page', ['user' => $current_uid, 'team' => $gid, 'muid' => $muid], ['fragment' => 'nav-shared'])->toString());
                  }else {
                    $path = $base_secure_url . '/tools/social/media/' . $current_uid;
                    $response = new RedirectResponse($path);
                    $response->send();
                  }
                }
            } else {
                $oAuth2Client = $fb->getOAuth2Client();
                //if token is not long lived, convert it to long lived token
                if (!$access_token->isLonglived()) {
                    $access_token = $oAuth2Client->getLongLivedAccessToken($access_token);
                }
                // validate token
                $validToken = $facebookHelper->getFBTokenProperty($access_token, 'is_valid');
                if ($validToken) {
                    $object_access_token_string = base64_encode(serialize($access_token));
                    $properties = ['status' => 1, 'token_access' => $object_access_token_string];
                    if(isset($_SESSION['team'])){
                      $res = $this->setkaboodleNetworkStatusProperty(166, $_SESSION['team']['muid'], $properties);
                    }
                    else {
                      $res = $this->setkaboodleNetworkStatusProperty(166, $current_uid, $properties);
                    }
                    if ($res) {
                      if(isset($_SESSION['team'])){
                        $gid = $_SESSION['team']['gid'];
                        $muid = $_SESSION['team']['muid'];
                        $current_uid = \Drupal::currentUser()->id();
                        return new RedirectResponse(Url::fromRoute('social_media.main_page', ['user' => $current_uid, 'appName' => 166, 'team' => $gid, 'muid' => $muid], ['fragment' => 'nav-shared'])->toString());
                      }else {
                        $path = $base_secure_url . '/tools/social/media/' . $current_uid;
                        $response = new RedirectResponse($path);
                        $response->send();
                      }
                    }
                } else {
                    //\Drupal::logger('facebook')->warning('Invalid Facebook Access Token');
                    
                }
            }
        }
        //Login URL for Instagram
        /*if ($social_media_id == 168) {
            $instaHelper = new InstagramHelperFunction();
            $insta_object = $instaHelper->getInstaObject();
            $social_media_login_links['link'] = $insta_object->getLoginUrl();
            if (isset($_GET['code'])) {
                $outhToken = $insta_object->getOAuthToken($_GET['code']);
                //get long lived access token
                $longlived_token = $instaHelper->_convert_long_access_token($outhToken->access_token);
                $insta_object->setAccessToken($longlived_token);
                $get_long_lived_token = $insta_object->getUserMedia();
                // if everything fine save token in db
                $object_access_token_string = base64_encode(serialize($longlived_token));
                $properties = ['status' => 1, 'token_access' => $object_access_token_string];
                $res = $this->setkaboodleNetworkStatusProperty(168, $current_uid, $properties);
                if ($res) {
                    $path = $base_secure_url . '/tools/social/media/' . $current_uid;
                    $response = new RedirectResponse($path);
                    $response->send();
                }
            }
        }*/
        // Login URL for Instagram using Facebook
        if ($social_media_id == 168) {
            $facebookHelper = new FacebookHelperFunction();
            $fb = $facebookHelper->getFBObject();
            $handler = $fb->getRedirectLoginHelper();
            if(isset($_GET['team'])){
              $gid = $_GET['team'];
              $muid = $_GET['muid'];
              $redirectedTo = $base_secure_url . "/social_media_login_link/168?team=$gid&muid=$muid#nav-shared";
            }
            else {
              $redirectedTo = $base_secure_url . "/social_media_login_link/168";
            }
            $permissions = ['instagram_basic', 'pages_show_list', 'instagram_content_publish', 'instagram_manage_comments'];
            $social_media_login_links['link'] = $handler->getLoginUrl($redirectedTo, $permissions);
            try {
                $access_token = $handler->getAccessToken();
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
            if (!$access_token) {
                //redirect source to getting start page,if any error
                if (isset($_GET['error']) && $_GET['error'] == 'access_denied') {
                  if(isset($_GET['team'])){
                    $gid = $_GET['team'];
                    $muid = $_GET['muid'];
                    $current_uid = \Drupal::currentUser()->id();
                    return new RedirectResponse(Url::fromRoute('social_media.getstart_page', ['user' => $current_uid, 'team' => $gid, 'muid' => $muid], ['fragment' => 'nav-shared'])->toString());
                  }else {
                    $path = $base_secure_url . '/tools/social/media/' . $current_uid;
                    $response = new RedirectResponse($path);
                    $response->send();
                  }
                }
            } else {
                $oAuth2Client = $fb->getOAuth2Client();
                //if token is not long lived, convert it to long lived token
                if (!$access_token->isLonglived()) {
                    $access_token = $oAuth2Client->getLongLivedAccessToken($access_token);
                }
                // validate token
                $validToken = $facebookHelper->getFBTokenProperty($access_token, 'is_valid');
                if ($validToken) {
                    $object_access_token_string = base64_encode(serialize($access_token));
                    $properties = ['status' => 1, 'token_access' => $object_access_token_string];
                    if(isset($_SESSION['team'])){
                      $res = $this->setkaboodleNetworkStatusProperty(168, $_SESSION['team']['muid'], $properties);
                    }
                    else {
                      $res = $this->setkaboodleNetworkStatusProperty(168, $current_uid, $properties);
                    }
                    if ($res) {
                      if(isset($_SESSION['team'])){
                        $gid = $_SESSION['team']['gid'];
                        $muid = $_SESSION['team']['muid'];
                        $current_uid = \Drupal::currentUser()->id();
                        return new RedirectResponse(Url::fromRoute('social_media.main_page', ['user' => $current_uid, 'appName' => 168, 'team' => $gid, 'muid' => $muid], ['fragment' => 'nav-shared'])->toString());
                      }else {
                        $path = $base_secure_url . '/tools/social/media/' . $current_uid;
                        $response = new RedirectResponse($path);
                        $response->send();
                      }
                    }
                } else {
                    //\Drupal::logger('facebook')->warning('Invalid Facebook Access Token');
                    
                }
            }
        }
        //Login URL for Twitter
        if ($social_media_id == 174) {
            if (isset($_REQUEST['denied'])) {
              if(isset($_GET['team'])){
                $gid = $_GET['team'];
                $muid = $_GET['muid'];
                $current_uid = \Drupal::currentUser()->id();
                return new RedirectResponse(Url::fromRoute('social_media.getstart_page', ['user' => $current_uid, 'team' => $gid, 'muid' => $muid], ['fragment' => 'nav-shared'])->toString());
              }else {
                $path = $base_secure_url . '/tools/social/media/' . $current_uid;
                $response = new RedirectResponse($path);
                $response->send();
              }
            }
            if (isset($_REQUEST['oauth_token'])) {
                $request_token = [];
                $request_token['oauth_token'] = $_SESSION['oauth_token'];
                $request_token['oauth_token_secret'] = $_SESSION['oauth_token_secret'];
                $TwitterHelper = new TwitterHelperFunction();
                $connection = new TwitterOAuth($TwitterHelper->getTwitterAPIKey(), $TwitterHelper->getTwitterSecretKey(), $request_token['oauth_token'], $request_token['oauth_token_secret']);
                $access_token = $connection->oauth("oauth/access_token", ["oauth_verifier" => $_REQUEST['oauth_verifier']]);
                $object_access_token_string = base64_encode(serialize((object)$access_token));
                $properties = ['status' => 1, 'token_access' => $object_access_token_string];
                if(isset($_SESSION['team'])){
                  $res = $this->setkaboodleNetworkStatusProperty(174, $_SESSION['team']['muid'], $properties);
                }
                else {
                  $res = $this->setkaboodleNetworkStatusProperty(174, $current_uid, $properties);
                }
                if ($res) {
                  if(isset($_SESSION['team'])){
                    $gid = $_SESSION['team']['gid'];
                    $muid = $_SESSION['team']['muid'];
                    $current_uid = \Drupal::currentUser()->id();
                    return new RedirectResponse(Url::fromRoute('social_media.main_page', ['user' => $current_uid, 'appName' => 174, 'team' => $gid, 'muid' => $muid], ['fragment' => 'nav-shared'])->toString());
                  }else {
                    $path = $base_secure_url . '/tools/social/media/' . $current_uid;
                    $response = new RedirectResponse($path);
                    $response->send();
                  }
                }
            } else {
                if(isset($_GET['team'])){
                  $gid = $_GET['team'];
                  $muid = $_GET['muid'];
                  $redirectedTo = $base_secure_url . "/social_media_login_link/174?team=$gid&muid=$muid#nav-shared";
                }
                else {
                  $redirectedTo = $base_secure_url . "/social_media_login_link/174";
                }
                define('OAUTH_CALLBACK', getenv($redirectedTo));
                $TwitterHelper = new TwitterHelperFunction();
                $connection = new TwitterOAuth($TwitterHelper->getTwitterApiKey(), $TwitterHelper->getTwitterSecretKey());
                $request_token = $connection->oauth('oauth/request_token', array('oauth_callback' => $redirectedTo));
                $_SESSION['oauth_token'] = $request_token['oauth_token'];
                $_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];
                $social_media_login_links['link'] = $connection->url('oauth/authorize', array('oauth_token' => $request_token['oauth_token']));
            }
        }
        $terms_obj = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($social_media_id);
        $social_media_login = [];
        if ($terms_obj->field_connection_text->value) {
            $social_media_login['html'] = $terms_obj->field_connection_text->value;
        }
        if (isset($terms_obj->field_icon) && isset($terms_obj->field_icon->target_id)) {
            $network_icon_target = $terms_obj->field_icon->target_id;
            $file = \Drupal::entityTypeManager()->getStorage('file')->load($network_icon_target);
            $social_media_login['icon'] = file_create_url($file->getFileUri());
        }
        $social_media_login['name'] = $terms_obj->name->value;
        $social_media_login['link'] = $social_media_login_links['link'];
        $twigFilePath = drupal_get_path('module', 'social_media') . '/templates/social_media_login.html.twig';
        $template = $this->twig->loadTemplate($twigFilePath);
        $markup = $template->render(array('social_media_login' => $social_media_login));
        $social_media_login_links['html'] = $markup;
        return new JsonResponse($social_media_login_links);
        //  $json_response = json_encode($social_media_login_links);
        // return new JsonResponse($json_response);
        
    }
    /**
     * Function to save data into "social_media_connection_status" table.
     */
    public function setkaboodleNetworkStatusProperty($social_item_id, $uid, array $properties) {
        $terms_obj = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($social_item_id);
        if (isset($terms_obj->field_icon) && isset($terms_obj->field_icon->target_id) && $terms_obj->getVocabularyId() == 'social_media_networks') {
            $results = \Drupal::database()->merge('social_media_connection_status')->key(['uid' => $uid, 'termID' => $social_item_id])->fields($properties)->execute();
            return 1;
        } else {
            $message = 'Error with ' . $social_item_id . 'term.  Icon should be there';
            return 0;
        }
    }
    /**
     * Function to get data from "social_media_connection_status" table.
     */
    public function getKabbodeNetworkStatusProperty($social_item_id, $uid, array $properties) {
        /*
        properties names:  id (primary key), status (boolean), token_access (blob), termID , uid
        social_item_id: 166 (facebook), 168 (instagram)
        uid: unique user id.
        */
        $network_status = [];
        $social_network_status = \Drupal::database()->select('social_media_connection_status', 'sn')->fields('sn', $properties)->condition('sn.uid', $uid, '=')->condition('sn.termID', $social_item_id, '=')->execute()->fetchAll();
        if ($social_network_status) {
            foreach ($social_network_status as $row_data) {
                if (in_array("id", $properties)) {
                    if ($row_data->id) {
                        $network_status['id'] = $row_data->id;
                    }
                }
                if (in_array("status", $properties)) {
                    if ($row_data->status) {
                        $network_status['status'] = $row_data->status;
                    }
                }
                if (in_array("token_access", $properties)) {
                    if ($row_data->token_access) {
                        $access_token = unserialize(base64_decode($row_data->token_access));
                        if (is_object($access_token)) {
                            $network_status['token_access'] = $access_token;
                        } else {
                            $network_status['token_access'] = '';
                            $output = array('error' => array('msg' => 'Your token is either expired on disconnected from the App. Please connect to Kaboodle Media ', 'code' => 999, 'type' => 'Kaboodle Media',));
                            echo json_encode($output);
                            exit;
                        }
                    }
                }
            }
        }
        return $network_status;
    }
    
    /**
     * Callback to get Facebook comments/replies per Post, Fetched from Facebook.com. This callback returns Five most recents comments/replies.
     */
    public function getFBComments($fb_page_id, $fb_object_id, $page_access_token) {
        $facebookHelper = new FacebookHelperFunction();
        $fb = $facebookHelper->getFBObject();
        // get comments
        $response = $fb->get('/' . $fb_object_id . '/comments?fields=admin_creator,comment_count,like_count,user_likes,message,from,created_time&limit=5&filter=toplevel&summary=1&order=reverse_chronological', $page_access_token);
        $result_comments = $response->getDecodedBody();
        if ($result_comments) {
            foreach ($result_comments['data'] as $comment_key => $comment_value) {
                // append user picture to comment
                $profile_pic = $facebookHelper->getFBUserOrPagePicture($comment_value['from']['id'], $page_access_token);
                $result_comments['data'][$comment_key]['from']['profile_pic'] = $profile_pic;
                $result_comments['data'][$comment_key]['created_ago'] = $this->time_elapsed_string($comment_value['created_time'], false);
                $result_comments['data'][$comment_key]['created_time'] = $comment_value['created_time'];
                $response = $fb->get('/' . $comment_value['id'] . '/comments?fields=admin_creator,comment_count,like_count,user_likes,message,from,created_time&limit=3&filter=toplevel&summary=1&order=reverse_chronological', $page_access_token);
                $result_replies = $response->getDecodedBody();
                foreach ($result_replies['data'] as $replies_key => $replies_value) {
                    // append user picture to replies
                    $profile_pic = $facebookHelper->getFBUserOrPagePicture($replies_value['from']['id'], $page_access_token);
                    $result_replies['data'][$replies_key]['from']['profile_pic'] = $profile_pic;
                    $result_replies['data'][$replies_key]['created_ago'] = $this->time_elapsed_string($comment_value['created_time'], false);
                    $result_replies['data'][$replies_key]['created_time'] = $comment_value['created_time'];
                }
                $result_comments['data'][$comment_key]['replies'] = $result_replies;
            }
        }
        return $result_comments;
    }
    /**
     * Callback to get all facebook pages available on user's Facebook Account.
     */
    public function getFbPages($appId) {
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $facebookHelper = new FacebookHelperFunction();
        $properties = ['token_access', 'id', 'status'];
        $network_properties = $this->getKabbodeNetworkStatusProperty($appId, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        $fb_pages = $facebookHelper->getAllFacebookPages($access_token);
        return $fb_pages;
    }
	/**
     * Callback to get ad Accounts on user's Facebook Account.
     */
    public function getFbAdAccounts($appId) {
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $facebookHelper = new FacebookHelperFunction();
        $properties = ['token_access', 'id', 'status'];
        $network_properties = $this->getKabbodeNetworkStatusProperty($appId, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        $ad_accounts = $facebookHelper->getFacebookAdAccounts($access_token);
        return $ad_accounts ;
    }
    /**
     * Callback to get Instagram business accounts linked with facebook pages.
     */
    public function getInstagramAccounts() {
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $facebookHelper = new FacebookHelperFunction();
        $properties = ['token_access', 'id', 'status'];
        $network_properties = $this->getKabbodeNetworkStatusProperty(168, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        $insta_accounts = $facebookHelper->getAllInstagramAccounts($access_token);
        return $insta_accounts;
    }
    /**
     * Callback to get all facebook pages categories available .
     */
    public function FBPageCatagoriesAvail($keyword) {
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $facebookHelper = new FacebookHelperFunction();
        $properties = ['token_access', 'id', 'status'];
        $network_properties = $this->getKabbodeNetworkStatusProperty(166, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        $validToken = $facebookHelper->getFBTokenProperty($access_token, 'is_valid');
        if ($validToken) {
            $output = $facebookHelper->fetchFBPageCat($access_token->getValue());
            $fbpageCat = [];
            foreach ($output['data'] as $key => $value) {
                if (array_key_exists('fb_page_categories', $value)) {
                    foreach ($value['fb_page_categories'] as $index => $categories) {
                        if (strpos(strtolower($categories['name']), $keyword) === 0) {
                            $prepare_list['id'] = $categories['id'];
                            $prepare_list['name'] = $categories['name'];
                            $fbpageCat[] = $prepare_list;
                        }
                    }
                }
            }
            $json_response = $fbpageCat;
            return new JsonResponse($json_response);
        }
    }
    /**
     * Callback to get all facebook pages categories available .
     */
    public function getFacebookPageInfo($page_id) {
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $facebookHelper = new FacebookHelperFunction();
        $properties = ['token_access', 'id', 'status'];
        $network_properties = $this->getKabbodeNetworkStatusProperty(166, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        $validToken = $facebookHelper->getFBTokenProperty($access_token, 'is_valid');
        if ($validToken) {
            $access_token_val = $access_token->getValue();
            //get page access tken with user access token
            $page_access_token = $facebookHelper->getFBPageAccessToken($page_id, $access_token_val);
            $output = $facebookHelper->getFBPageInfo($page_id, $page_access_token);
            return $output;
        }
    }
    /**
     * Callback to update facebook pages info .
     */
    public function updateFacebookPageInfo($page_id, array $parameter) {
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $facebookHelper = new FacebookHelperFunction();
        $properties = ['token_access', 'id', 'status'];
        $network_properties = $this->getKabbodeNetworkStatusProperty(166, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        $validToken = $facebookHelper->getFBTokenProperty($access_token, 'is_valid');
        if ($validToken) {
            $access_token_val = $access_token->getValue();
            //get page access tken with user access token
            $page_access_token = $facebookHelper->getFBPageAccessToken($page_id, $access_token_val);
            $output = $facebookHelper->updateFBPageInfo($page_id, $page_access_token, $parameter);
            return $output;
        }
    }
    /**
     * Callback to update facebook pages image,profile and cover .
     */
    public function updateFacebookPageImage($page_id, array $parameter) {
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $facebookHelper = new FacebookHelperFunction();
        $properties = ['token_access', 'id', 'status'];
        $network_properties = $this->getKabbodeNetworkStatusProperty(166, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        $validToken = $facebookHelper->getFBTokenProperty($access_token, 'is_valid');
        if ($validToken) {
            $access_token_val = $access_token->getValue();
            //get page access tken with user access token
            $page_access_token = $facebookHelper->getFBPageAccessToken($page_id, $access_token_val);
            // convert base64 to id
            $public_url_image = $this->saveImagePublicFolder($parameter['imageBase64']);
            $uploaded_id = $facebookHelper->fbUploadPhotos($page_id, $page_access_token, $public_url_image);
            // \Drupal::logger('facebook')->warning('Invalid Facebook Access Token');
            if ($parameter['type'] == 'profile') {
                $update_parameter['photo_id'] = $uploaded_id;
                $update_parameter['type'] = 'profile';
            } else {
                $update_parameter['photo_id'] = $uploaded_id;
                $update_parameter['type'] = 'cover';
            }
            $output = $facebookHelper->updateFBPageImage($page_id, $page_access_token, $update_parameter);
           // \Drupal::logger('facebook publish posts cont output')->warning('<pre><code>' . print_r($output, TRUE) . '</code></pre>');
            return $output;
        }
    }
    /**
     * callback to publish comments against post
     */
    public function publishInstagramComments($instagram_media_id) {
        $data['message'] = \Drupal::request()->get('message');
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $facebookHelper = new FacebookHelperFunction();
        $fb = $facebookHelper->getFBObject();
        $properties = ['token_access', 'id', 'status'];
        $network_properties = $this->getKabbodeNetworkStatusProperty(168, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        // we need to validate token
        $validToken = $facebookHelper->getFBTokenProperty($access_token, 'is_valid');
        if ($validToken) {
            $access_token_val = $access_token->getValue();
            // check if comments is enabled.
           // $result = $this->isCommentEnabled($instagram_media_id, $access_token_val);
           // if ($result['is_comment_enabled']) {
                try {
                    // Returns a `FacebookFacebookResponse` object
                    $response = $fb->post('/' . $instagram_media_id . '/comments', $data, $access_token_val);
                }
                catch(\Facebook\Exceptions\FacebookResponseException $e) {
                    $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Facebook SDK Exception', 'custom_type' => 'Facebook Error Reported',));
                    echo json_encode($output);
                    exit;
                }
                catch(\Facebook\Exceptions\FacebookSDKException $e) {
                    $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Facebook SDK Exception', 'custom_type' => 'Facebook Error Reported',));
                    echo json_encode($output);
                    exit;
                }
                $response = $response->getDecodedBody();
                if ($response) {
                    // Returns a `FacebookFacebookResponse` object
                    $response2 = $fb->get('/' . $response['id'] . '?fields=username,text,timestamp', $access_token_val);
                }
                $response2 = $response2->getDecodedBody();
                $data['single_insta_post']['comments']['data']['0'] = $response2;
                $twigFilePath = drupal_get_path('module', 'social_media') . '/templates/instagram/instagram-comments.html.twig';
                $template = $this->twig->loadTemplate($twigFilePath);
                $markup = $template->render(array('data' => $data));
                //\Drupal::logger('social media insta')->warning('<pre><code>' . print_r($markup, TRUE) . '</code></pre>');
                $output = array('response' => array('data' => $markup));
                $json_response = json_encode($output);
                return new JsonResponse($json_response);
               
        }
    }
    // callback to check if commenting is enabled for insta post
    public function isCommentEnabled($instagram_media_id, $token) {
        $facebookHelper = new FacebookHelperFunction();
        $fb = $facebookHelper->getFBObject();
        try{
         $response = $fb->get('/' . $instagram_media_id . '?fields=is_comment_enabled', $token);
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
        $response = $response->getDecodedBody();
        return $response;
    }
    // insta replies against comment
    public function instaRepliesComment($id) {
        $message = \Drupal::request()->get('message');
        $username = \Drupal::request()->get('username');
        $linkData = [];
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $facebookHelper = new FacebookHelperFunction();
        $fb = $facebookHelper->getFBObject();
        $properties = ['token_access', 'id', 'status'];
        $network_properties = $this->getKabbodeNetworkStatusProperty(168, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        // we need to validate token
        $validToken = $facebookHelper->getFBTokenProperty($access_token, 'is_valid');
        if ($validToken) {
            $linkData['message'] = $message;
            $access_token_val = $access_token->getValue();
            try {
                // Returns a `FacebookFacebookResponse` object
                $response = $fb->post('/' . $id . '/replies', $linkData, $access_token_val);
            }
            catch(\Facebook\Exceptions\FacebookResponseException $e) {
                $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Graph SDK Exception','custom_type' => 'Facebook Error Reported',));
                echo json_encode($output);
                exit;
            }
            catch(\Facebook\Exceptions\FacebookSDKException $e) {
                $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Facebook SDK Exception', 'custom_type' => 'Facebook Error Reported',));
                echo json_encode($output);
                exit;
            }
            $response = $response->getDecodedBody();
            $comment_value['replies']['data']['0']['id'] = $response['id'];
            $comment_value['replies']['data']['0']['text'] = $message;
            $comment_value['replies']['data']['0']['username'] = $username;
            $twigFilePath = drupal_get_path('module', 'social_media') . '/templates/instagram/instagram-replies.html.twig';
            $template = $this->twig->loadTemplate($twigFilePath);
            $markup = $template->render(array('comment_value' => $comment_value));
            $output = array('response' => array('data' => $markup));
            $json_response = json_encode($output);
            return new JsonResponse($json_response);            
           
        }
    }
    /**
     * callback to get single Instagram Post
     */
    public function getSingleInstagramPost($instagram_media_id) {
        // \Drupal::logger('social media insta')->warning('<pre><code>' . print_r($instagram_media_id, TRUE) . '</code></pre>');
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $facebookHelper = new FacebookHelperFunction();
        $fb = $facebookHelper->getFBObject();
        $properties = ['token_access', 'id', 'status'];
        $network_properties = $this->getKabbodeNetworkStatusProperty(168, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        // we need to validate token
        $validToken = $facebookHelper->getFBTokenProperty($access_token, 'is_valid');
        if ($validToken) {
            $access_token_val = $access_token->getValue();
            try {
                // Returns a `FacebookFacebookResponse` object
                $response = $fb->get('/' . $instagram_media_id . '?fields=caption,id,is_comment_enabled,like_count,media_type,media_url,username,children{media_type,media_url,timestamp},comments_count,comments.limit(10){text,like_count,timestamp,user,hidden,username,replies.limit(2){text,username,like_count,timestamp}}', $access_token_val);
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
            $response = $response->getDecodedBody();
            $data['single_insta_post'] = $response;
           // \Drupal::logger('social media insta')->warning('<pre><code>' . print_r($data, TRUE) . '</code></pre>');
            $twigFilePath = drupal_get_path('module', 'social_media') . '/templates/instagram/instagram-single-post.html.twig';
            $template = $this->twig->loadTemplate($twigFilePath);
            $markup = $template->render(array('data' => $data));
            $output = array('response' => array('data' => $markup));
            $json_response = json_encode($output);
            return new JsonResponse($json_response);
        }
    }
    /**
     * callback to load more comments for insta post
     */
    public function instaLoadMoreComments() {
        $mode = \Drupal::request()->get('mode');
        if (isset($mode)) {
            $getData = \Drupal::request()->get('data');
            $option = \Drupal::request()->get('option');
            if ($option == 'loadComments') {
                $data['single_insta_post']['comments'] = $getData;
                \Drupal::logger('social media insta load more comments')->warning('<pre><code>' . print_r($getData, TRUE) . '</code></pre>');
                $twigFilePath = drupal_get_path('module', 'social_media') . '/templates/instagram/instagram-comments.html.twig';
                $template = $this->twig->loadTemplate($twigFilePath);
                $markup = $template->render(array('data' => $data));

            } else {
                $comment_value['replies'] = $getData;
                // \Drupal::logger('social media insta')->warning('<pre><code>' . print_r($comment_value , TRUE) . '</code></pre>');
                $twigFilePath = drupal_get_path('module', 'social_media') . '/templates/instagram/instagram-replies.html.twig';
                $template = $this->twig->loadTemplate($twigFilePath);
                $markup = $template->render(array('comment_value' => $comment_value));
            }
             $output = array('response' => array('data' => $markup));
             $json_response = json_encode($output);
            return new Response($json_response);
        }
    }
    // instagram enable/disable comments
    public function instaIsEnabledComment($id) {
        $action = \Drupal::request()->get('action');
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $facebookHelper = new FacebookHelperFunction();
        $fb = $facebookHelper->getFBObject();
        $properties = ['token_access', 'id', 'status'];
        $network_properties = $this->getKabbodeNetworkStatusProperty(168, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        // we need to validate token
        $validToken = $facebookHelper->getFBTokenProperty($access_token, 'is_valid');
        if ($validToken) {
            $access_token_val = $access_token->getValue();
            try {
                // Returns a `FacebookFacebookResponse` object
                $response = $fb->post('/' . $id, array('comment_enabled' => $action), $access_token_val);
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
            $response = $response->getDecodedBody();
            if ($response) {
                $output = $this->getSingleInstagramPost($id);
                return $output;
            }
            return new JsonResponse($response);
        }
    }
    // instagram delete comments/replies
    public function instaDeleteComments($id) {
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $facebookHelper = new FacebookHelperFunction();
        $fb = $facebookHelper->getFBObject();
        $properties = ['token_access', 'id', 'status'];
        $network_properties = $this->getKabbodeNetworkStatusProperty(168, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        // we need to validate token
        $validToken = $facebookHelper->getFBTokenProperty($access_token, 'is_valid');
        if ($validToken) {
            $access_token_val = $access_token->getValue();
            try {
                // Returns a `FacebookFacebookResponse` object
                $response = $fb->delete('/' . $id, array(), $access_token_val);
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
            $response = $response->getDecodedBody();
            $output = array('response' => array('data' => $response));
            $json_response = json_encode($output);
            return new JsonResponse($json_response);
            
        }
    }
    /**
     * callback to get Instagram Post
     */
    public function getInstagramPosts($instagram_accout_id) {
        $mode = \Drupal::request()->get('mode');
        // \Drupal::logger('social media insta')->warning('<pre><code>' . print_r($mode , TRUE) . '</code></pre>');
        if (isset($mode)) {
            // \Drupal::logger('social media insta')->warning('<pre><code>' . print_r('$markup', TRUE) . '</code></pre>');
            $getData = \Drupal::request()->get('data');
            $option = \Drupal::request()->get('option');
            $data['insta_posts'] = $getData;
            $twigFilePath = drupal_get_path('module', 'social_media') . '/templates/instagram/instagram-post.html.twig';
            $template = $this->twig->loadTemplate($twigFilePath);
            $markup = $template->render(array('data' => $data));
            $output = array('response' => array('data' => $markup));
            $json_response = json_encode($output);
            return new JsonResponse($json_response);            
        } else {
            $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
            $facebookHelper = new FacebookHelperFunction();
            $fb = $facebookHelper->getFBObject();
            $properties = ['token_access', 'id', 'status'];
            $network_properties = $this->getKabbodeNetworkStatusProperty(168, $current_uid, $properties);
            $access_token = $network_properties['token_access'];
            // we need to validate token
            $validToken = $facebookHelper->getFBTokenProperty($access_token, 'is_valid');
            if ($validToken) {
                $access_token_val = $access_token->getValue();
                try {
                    // Returns a `FacebookFacebookResponse` object
                    $response = $fb->get('/' . $instagram_accout_id . '/media?fields=caption,comments_count,ig_id,media_type,like_count,media_url,username,timestamp,children{media_type,media_url,timestamp},is_comment_enabled,comments.limit(3){like_count,text,username,timestamp,replies.limit(2){timestamp,text,like_count,username}}&limit=2', $access_token_val);
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
                $insta_posts = $response->getDecodedBody();
                return $insta_posts;
            }
        }
    }
    /**
     * Callback to get Facebook posts per page wise from User's facebook Account. This function returns five most recent posts. This function is also dual
     *  have nature, if hit the url /FbGetPost/{fb_page_id} will be treated otherwise work like a normal function.
     */
    public function getFacebookPost($fb_page_id) {
        /*
        generic function to get posts from facebook
        $mode:'ajax' - indicate request is comminf from JS
        $mode:'' - indicate it will work like a function
        $option: 'page_change' - indicates, get post on page change , requested from js
        $option: 'loadpost' load more posts requested from js and loaded posts fetched by facebook
        */
		$user = \Drupal::currentUser();
        $mode = \Drupal::request()->get('mode');
        if (isset($mode)) {
            $getData = \Drupal::request()->get('data');
            $option = \Drupal::request()->get('option');
        }
        $user = \Drupal::currentUser();
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $facebookHelper = new FacebookHelperFunction();
        $fb = $facebookHelper->getFBObject();
        $properties = ['token_access', 'id', 'status'];
        $network_properties = $this->getKabbodeNetworkStatusProperty(166, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        // we need to validate token
        $validToken = $facebookHelper->getFBTokenProperty($access_token, 'is_valid');
        if ($validToken) {
            $access_token_val = $access_token->getValue();
            //get page access tken with user access token
            $page_access_token = $facebookHelper->getFBPageAccessToken($fb_page_id, $access_token_val);
            //fetch fb posts
            if ($mode == 'ajax' && $option == 'loadPost') {
                $fb_posts = $getData;
            } else {
                try {
                    $response = $fb->get('/' . $fb_page_id . '/feed?fields=message,admin_creator,from,to,attachments,created_time,shares&limit=5', $page_access_token);
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
                $graphNode = $response->getGraphEdge();
                $fb_posts = $response->getDecodedBody();
            }
            $fb_complete_post_data = [];
            $fb_post_modified = [];
            $fb_complete_post_data['page_id'] = $fb_page_id;
            //append page profile picture
            $profile_pic = $facebookHelper->getFBUserOrPagePicture($fb_page_id, $page_access_token);
            $fb_complete_post_data['profile_pic'] = $profile_pic;
            // next posts if available
            if (array_key_exists('next', $fb_posts['paging'])) {
                $fb_complete_post_data['next'] = $fb_posts['paging']['next'];
            }
            foreach ($fb_posts['data'] as $key => $val) {
                $fb_post_modified[$key]['fb_postid'] = $val['id'];
                //get total post likes
                $result_like = $facebookHelper->getFBTotalObjectLiked($val['id'], $page_access_token);
                $fb_post_modified[$key]['like'] = $result_like;
                //get facebook comments/relies
                $result_comments = $this->getFBComments($fb_page_id, $val['id'], $page_access_token);
                $fb_post_modified[$key]['comments'] = $result_comments;
                //\Drupal::logger('social media insta1')->warning('<pre><code>' . print_r($val['created_time'], TRUE) . '</code></pre>');
                //$fb_post_modified[$key]['created_date'] = date_format(date_create($val['created_time']), "F d");
				$date = new DrupalDateTime(date('Y-m-d H:i:s', date_create($val['created_time'])->getTimestamp()), new \DateTimeZone($user->getTimeZone()));
                $date->setTimezone(new \DateTimeZone($user->getTimeZone()));
				$fb_post_modified[$key]['created_date'] = $date->format('F d');
				$fb_post_modified[$key]['created_time'] = $date->format('g:i A');
               // $fb_post_modified[$key]['created_time'] = date_format(date_create($val['created_time']), "g:i A");
                if (array_key_exists('message', $val)) {
					
                    $url = '@(http(s)?)?(://)?(([a-zA-Z])([-\w]+\.)+([^\s\.]+[^\s]*)+[^,.\s])@';
                    $string = preg_replace($url, '<a href="http$2://$4" target="_blank" title="$0">$0</a>', $val['message']);
                    $fb_post_modified[$key]['message'] = $string;
                } else {
                    $fb_post_modified[$key]['message'] = '';
                }
                if (array_key_exists('admin_creator', $val)) {
                    $fb_post_modified[$key]['admin_creator'] = $val['admin_creator'];
                } else {
                    $fb_post_modified[$key]['admin_creator'] = '';
                }
                if (array_key_exists('from', $val)) {
                    foreach ($val['from'] as $fromkey => $fromval) {
                        if ($fromkey == 'id') {
                            //append post user's profile picture to post as other user also can create post on age
                            $profile_pic = $facebookHelper->getFBUserOrPagePicture($fromval, $page_access_token);
                            $fb_post_modified[$key]['from']['profile_pic'] = $profile_pic;
                        }
                        $fb_post_modified[$key]['from'][$fromkey] = $fromval;
                    }
                }
                if (array_key_exists('shares', $val)) {
                    $fb_post_modified[$key]['shares'] = $val['shares'];
                }
                if (array_key_exists('attachments', $val)) {
                    $fb_post_modified[$key]['attachments'] = $val['attachments'];
                } else {
                    $fb_post_modified[$key]['attachments'] = '';
                }
            }
            $fb_complete_post_data['fb_post_modified'] = $fb_post_modified;
            if ($mode == 'ajax' && $option == 'loadPost') {
                $data['fb_posts'] = $fb_complete_post_data;
                $twigFilePath = drupal_get_path('module', 'social_media') . '/templates/facebook/facebook-post.html.twig';
                $template = $this->twig->loadTemplate($twigFilePath);
                $markup = $template->render(array('data' => $data));
                $output = array('response' => array('data' => $markup));
                $json_response = json_encode($output);
                return new JsonResponse($json_response);
            } else {
                return $fb_complete_post_data;
            }
        } else {
            //\Drupal::logger('facebook')->warning('inValid User Access Token');
            
        }
    }
    /**
     * callback to fetch latest tweets from twitter.com as per user.
     */
    public function getTwitterTweets() {
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $properties = ['token_access'];
        $response = $this->getKabbodeNetworkStatusProperty(174, $current_uid, $properties);
        $TwitterHelper = new TwitterHelperFunction();
        $connection = new TwitterOAuth($TwitterHelper->getTwitterApiKey(), $TwitterHelper->getTwitterSecretKey(), $response['token_access']->oauth_token, $response['token_access']->oauth_token_secret);
        $parameters = ['count' => 10, 'include_rts' => 1, 'tweet_mode' => 'extended', 'exclude_replies' => 1];
        $get_tweet = $connection->get('statuses/user_timeline', $parameters);
        //modified twitter text
        foreach ($get_tweet as $key => $tweet) {
            $tweet->full_text = $this->json_tweet_text_to_HTML($tweet, $links = true, $users = true, $hashtags = true);
            if ($tweet->retweeted) {
                if (isset($tweet->retweeted_status) && is_object($tweet->retweeted_status)) {
                    $tweet->retweeted_status->full_text = $this->json_tweet_text_to_HTML($tweet->retweeted_status, $links = true, $users = true, $hashtags = true);
                }
            }
        }
        $last_trace_tweet = end($get_tweet)->id - 1;
        
        $get_tweet['last_trace_tweet'] = strval($last_trace_tweet);
        return $get_tweet;
    }
    /**
     * Callback to get user profile.
     */
    public function twitter_user_profile() {
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $TwitterHelper = new TwitterHelperFunction();
        $properties = ['token_access'];
        $response_token = \Drupal::service('social_media.social_media_controller')->getKabbodeNetworkStatusProperty(174, $current_uid, $properties);
        $connection = new TwitterOAuth($TwitterHelper->getTwitterApiKey(), $TwitterHelper->getTwitterSecretKey(), $response_token['token_access']->oauth_token, $response_token['token_access']->oauth_token_secret);
        $verify_account = $connection->get('account/verify_credentials');
        return $verify_account;
    }
    /**
     * Callback to get user's following/folowers
     */
    public function twitter_get_users($type, $twitter_user_id, $twitter_screen_name) {
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $properties = ['token_access'];
        $response = \Drupal::service('social_media.social_media_controller')->getKabbodeNetworkStatusProperty(174, $current_uid, $properties);
        $TwitterHelper = new TwitterHelperFunction();
        $connection = new TwitterOAuth($TwitterHelper->getTwitterApiKey(), $TwitterHelper->getTwitterSecretKey(), $response['token_access']->oauth_token, $response['token_access']->oauth_token_secret);
        $data = ['user_id' => $twitter_user_id, 'screen_name' => $twitter_screen_name, 'skip_status' => 1, 'count' => 10];
        $result = $connection->get($type . '/list', $data);
        return $result;
    }
    /**
     * callback to add like or remove like to/from facebook object such as posts/comments/replies.
     */
    public function setFbObjectLike($fb_page_id, $fb_object_id) {
        $mode = \Drupal::request()->get('mode');
        if (isset($mode) && $mode == 'ajax') {
            $op = \Drupal::request()->get('op');
        } else {
            $op = 1;
        }
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $properties = ['token_access'];
        $network_properties = $this->getKabbodeNetworkStatusProperty(166, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        $facebookHelper = new FacebookHelperFunction();
        $output = $facebookHelper->facebookObjectLike($access_token, $fb_page_id, $fb_object_id, $op);
        $json_response = json_encode($output);
        return new JsonResponse($json_response);
    }
    /**
     * callback to update facebook page profile/cover .
     */
    public function fbPageImageUpdate($fbPageId) {
        $parameter = [];
        $response = [];
        $base64_string = \Drupal::request()->get('base64_string');
        $parameter['imageBase64'] = $base64_string;
        $imageProfileType = \Drupal::request()->get('imageProfileType');
        if ($imageProfileType == 'update_profile_banner') {
            $parameter['type'] = 'cover';
            $response['message'] = 'Facebook Cover Photo has been updated successfully.';
        } else {
            $parameter['type'] = 'profile';
            $response['message'] = 'Facebook Profile Photo has been updated successfully.';
        }
        //$parameter = ['imageBase64'=>'', 'type'=>'cover'];
        $response1 = $this->updateFacebookPageImage($fbPageId, $parameter);
        return new JsonResponse($response);
    }
    /**
     * callback to update facebook page info .
     */
    public function fbPageInfoUpdate($fbPageId) {
        $update = \Drupal::request()->get('update');
        if ($update == 'false') {
            // don't need to update
            $response = $this->getFacebookPageInfo($fbPageId);
            $output = array('response' => array('data' => $response, 'msg' => 'Facebook Page Info not updated.'));
            $json_response = json_encode($output);
            return new JsonResponse($json_response);
        } else {
            // need to update
            $updateData = \Drupal::request()->get('updateData');
            $modifiedUpdateData = [];
            foreach ($updateData as $field_name => $fieldValue) {

                if (strpos(strtolower($field_name), 'about') !== false && isset($fieldValue)) {
                    $modifiedUpdateData['about'] = isset($fieldValue) ? $fieldValue : '';
                }
                if (strpos(strtolower($field_name), 'phone') !== false && isset($fieldValue)) {
                    $modifiedUpdateData['phone'] = isset($fieldValue) ? $fieldValue : '';
                }
                if (strpos(strtolower($field_name), 'website') !== false && isset($fieldValue)) {
                    $modifiedUpdateData['website'] = isset($fieldValue) ? $fieldValue : '';
                }
                if (strpos(strtolower($field_name), 'description') !== false && isset($fieldValue)) {
                    $modifiedUpdateData['description'] = isset($fieldValue) ? $fieldValue : '';
                }
                if (strpos(strtolower($field_name), 'emails') !== false && isset($fieldValue)) {
                    if (isset($fieldValue)  && $fieldValue != '') {
                        $split_emails = explode(",", $fieldValue);
                        $modifiedUpdateData['emails'] = array_filter($split_emails);
                    }
					else{
					 $modifiedUpdateData['emails'] = [];	
					}
                }
				if(strpos(strtolower($field_name), 'categories') !== false){
					$modifiedUpdateData['category_list'] = $fieldValue;
				}
            }
			
            $response = $this->updateFacebookPageInfo($fbPageId, $modifiedUpdateData);
             $output = array('response' => array('data' => $response, 'msg' => 'Facebook Page Info has been updated.'));
             $json_response = json_encode($output);
            return new JsonResponse($json_response);
        }
    }
    /**
     * callback to publish , delete or edit comments/replies against Facebook Object such as comments .
     */
    public function FbPublishComments($fb_page_id, $fb_object_id) {
        $mode = \Drupal::request()->get('mode');
        if (isset($mode) && $mode == 'ajax') {
            $op = \Drupal::request()->get('op');
            if ($op == 'publish') {
                $message = \Drupal::request()->get('message');
                $requests['message'] = $message;
            } elseif ($op == 'Remove') {
            } else {
                //edit comment
                $op = 'Edit';
                $message = \Drupal::request()->get('message');
                $requests['message'] = $message;
            }
        }
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $properties = ['token_access'];
        $network_properties = $this->getKabbodeNetworkStatusProperty(166, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        $facebookHelper = new FacebookHelperFunction();
        $output = $facebookHelper->facebookCommentOperations($access_token, $fb_page_id, $fb_object_id, $requests, $op);
        $json_response = json_encode($output);
        return new JsonResponse($json_response);
    }
    /**
     * Function to perform operations such as edit/delete on Facebook Posts. For now only delete operation implemented.
     */
    public function fbPostOperation($fb_page_id, $fb_post_id, $op) {
        $mode = \Drupal::request()->get('mode');
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $properties = ['token_access'];
        $network_properties = $this->getKabbodeNetworkStatusProperty(166, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        // we need to validate token
        $facebookHelper = new FacebookHelperFunction();
        $validToken = $facebookHelper->getFBTokenProperty($access_token, 'is_valid');
        if ($validToken) {
            $access_token_val = $access_token->getValue();
            //get page access tken with user access token
            $page_access_token = $facebookHelper->getFBPageAccessToken($fb_page_id, $access_token_val);
            $fb = $facebookHelper->getFBObject();
            if ($op == 'delete') {
                try {
                    // Returns a `FacebookFacebookResponse` object
                    $response = $fb->delete('/' . $fb_post_id, array(), $page_access_token);
                }
                catch(\Facebook\Exceptions\FacebookResponseException $e) {
                    $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Graph SDK Exception', 'custom_type' => 'Facebook Error Reported',));
                    echo json_encode($output);
                    exit;
                    // return new JsonResponse($e->getMessage());
                    
                }
                catch(\Facebook\Exceptions\FacebookSDKException $e) {
                    $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Facebook SDK Exception', 'custom_type' => 'Facebook Error Reported',));
                    echo json_encode($output);
                    exit;
                }
                $graphNode = $response->getDecodedBody();
                $output['response'] = 1;
            }
        } else {
            //\Drupal::logger('facebook')->warning('inValid User Access Token');
            $output['response'] = 'inValid User Access Token';
        }
        $json_response = json_encode($output);
        return new JsonResponse($json_response);
    }
    /**
     * Callback to Load more comment/replies against each posts from user's facebook Account.
     */
    public function FBCommentsRepliesLoadMore() {
        $getData = \Drupal::request()->get('data');
        $option = \Drupal::request()->get('option');
        $page_id = \Drupal::request()->get('page_id');
        $getData['page_id'] = $page_id;
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $facebookHelper = new FacebookHelperFunction();
        $fb = $facebookHelper->getFBObject();
        $properties = ['token_access', 'id', 'status'];
        $network_properties = $this->getKabbodeNetworkStatusProperty(166, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        // we need to validate token
        $validToken = $facebookHelper->getFBTokenProperty($access_token, 'is_valid');
        if ($validToken) {
            $access_token_val = $access_token->getValue();
            //get page access tken with user access token
            $page_access_token = $facebookHelper->getFBPageAccessToken($page_id, $access_token_val);
        }
        // append user picture
        foreach ($getData['data'] as $key => $value) {
            $profile_pic = $facebookHelper->getFBUserOrPagePicture($value['from']['id'], $page_access_token);
            $getData['data'][$key]['from']['profile_pic'] = $profile_pic;
            $getData['data'][$key]['created_ago'] = $this->time_elapsed_string($value['created_time'], false);
            $getData['data'][$key]['created_time'] = $value['created_time'];
            if ($option == 'loadComments') {
                $response = $fb->get('/' . $value['id'] . '/comments?fields=admin_creator,comment_count,like_count,user_likes,message,from,created_time&limit=3&filter=toplevel&summary=1&order=reverse_chronological', $page_access_token);
                $result_replies = $response->getDecodedBody();
                foreach ($result_replies['data'] as $replies_key => $replies_value) {
                    $profile_pic = $facebookHelper->getFBUserOrPagePicture($replies_value['from']['id'], $page_access_token);
                    $result_replies['data'][$replies_key]['from']['profile_pic'] = $profile_pic;
                    $result_replies['data'][$replies_key]['created_ago'] = $this->time_elapsed_string($replies_value['created_time'], false);
                    $result_replies['data'][$replies_key]['created_time'] = $replies_value['created_time'];
                }
                $getData['data'][$key]['replies'] = $result_replies;
            }
        }
        if ($option == 'loadReplies') {
            $twigFilePath = drupal_get_path('module', 'social_media') . '/templates/facebook/facebook-replies.html.twig';
            $template = $this->twig->loadTemplate($twigFilePath);
            $markup = $template->render(array('value_comments' => $getData));
        } else {
            $twigFilePath = drupal_get_path('module', 'social_media') . '/templates/facebook/facebook-comments.html.twig';
            $template = $this->twig->loadTemplate($twigFilePath);
            $markup = $template->render(array('value_comment_data' => $getData));
        }
        $output = array('response' => array('data' => $markup));
        $json_response = json_encode($output);
        return new JsonResponse($json_response);
        
    }
    /**
     * Getting Start Social Media Page.
     */
    public function get_start_page($user) {
        global $base_secure_url;
        $uid = $user->get('uid')->value;
        $current_uid = \Drupal::currentUser()->id();
        /*if ($uid != $current_uid) {
          throw new AccessDeniedHttpException();
        }*/
        //start get social media items PER USER
        $vid = 'social_media_networks';
        $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid);
        $social_network = [];
        foreach ($terms as $term) {
            $term_id = $term->tid;
            $terms_obj = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($term_id);
            if (isset($terms_obj->field_icon) && isset($terms_obj->field_icon->target_id)) {
                $network_statu = $terms_obj->field_status->value;
                $network_icon_target = $terms_obj->field_icon->target_id;
                $file = \Drupal::entityTypeManager()->getStorage('file')->load($network_icon_target);
                // $social_icon_path    = $file->url();
                $social_icon_path = file_create_url($file->getFileUri());
                $network_status_unfiltered = $this->get_network_status($terms_obj->tid->value, $uid);
                if (array_key_exists('status', $network_status_unfiltered) && $network_status_unfiltered['status'] == 1) {
                    if (array_key_exists('token_validated', $network_status_unfiltered) && $network_status_unfiltered['token_validated'] == 1) {
                        //acive and validated network, filter network status array
                        $network_status['status'] = 1;
                    } else {
                        //active but not validated network
                        $network_status['status'] = 0;
                    }
                } else {
                    //neither active nor validated
                    $network_status['status'] = 0;
                }
                $social_network[] = ['name' => $terms_obj->name->value, 'tid' => $terms_obj->tid->value, 'network_icon' => $social_icon_path, 'network_status' => $network_status];
            }
        }
        $data['network_srttings'] = $social_network;
        $data['uid'] = $uid;
        
        // testing table template as rendered array
        $header = [
          'team_id' => ['data' => t('Team ID'), 'class' => 'sortempty', 'id' =>'team-id', 'width' => '10%', 'onclick' => 'sortColumn(this, "number")'],
          'team_name' => ['data' => t('Team Name'), 'class' => 'sortempty asc-icon bg-sort', 'id' => 'team-name', 'onclick' => 'sortColumn(this, "text")'],
          'owner' => ['data' => t('Owner'), 'class' => 'sortempty', 'id' => 'team-owner', 'width' => '20%', 'onclick' => 'sortColumn(this, "text")'],
          'members' => ['data' => t('Members'), 'width' => '15%'],
          'actions' => ['data' => t('Actions'), 'id' => 'team-owner-action', 'width' => '15%', 'class' => 'sortempty'],
        ];
        
        $query = \Drupal::database()->select('group_content_field_data', 'gm');
        $query->fields('team', ['id', 'label', 'uid']);
        $query->fields('ufn', ['field_first_name_value']);
        $query->fields('upfn', ['field_preferred_first_name_value']);
        $query->fields('uln', ['field_last_name_value']);
        $query->innerJoin('group_content__group_roles', 'gmr', "gmr.entity_id = gm.id AND gmr.bundle = gm.type");
        $query->innerJoin('groups_field_data', 'team', "team.id = gm.gid");
        $query->innerJoin('team_membership_status', 'tm', "tm.team_id = gm.gid AND tm.member_id = gm.entity_id AND tm.status = 1");
        $query->leftJoin('user__field_first_name', 'ufn', 'ufn.entity_id =team.uid');
        $query->leftJoin('user__field_preferred_first_name', 'upfn', 'upfn.entity_id = team.uid');
        $query->leftJoin('user__field_last_name', 'uln', 'uln.entity_id = team.uid');
        $query->condition('team.type', 'team', '=');
        $query->condition('gm.entity_id', $current_uid, '=');
        $query->condition('team.uid', $current_uid, '<>');
        $query->condition('gmr.group_roles_target_id', 'team-social_media', '=');
        $query->orderBy('team.label', 'ASC');
        $sort = $query->extend('Drupal\Core\Database\Query\TableSortExtender')->orderByHeader($header);
        // Limit the rows to 20 for each page.
        $pager = $sort->extend('Drupal\Core\Database\Query\PagerSelectExtender')->limit(25);
        $teams = $pager->execute();
        
        $edit_img_tag = '<img src="'. base_path() . drupal_get_path('module', 'my_groups') . '/images/edit-icon.png" width="20"/>';
        $rendered_edit_icon = render($edit_img_tag);
        $edit_icon = Markup::create($rendered_edit_icon);

        $rows = [];
        foreach ($teams as $team) {
          // team owner name
          if(empty($team->field_preferred_first_name_value)){
            $fname = $team->field_first_name_value;
          }else{
            $fname = $team->field_preferred_first_name_value;
          }
          $lname = $team->field_last_name_value;
          $owner = $fname.' '.$lname;
          // number of team members
          $members = \Drupal::service('my_groups.team.service')->getNumMembers($team->id);
          
          $url = Url::fromRoute('social_media.getstart_page', ['user' => $current_uid]);
          $args = ['team' => $team->id, 'muid' => $team->uid];
          $url->setOptions(array('query' => $args, 'fragment' => 'nav-shared'));
          $edit = Link::fromTextAndUrl($edit_icon, $url)->toString();
          //$edit = Link::fromTextAndUrl($edit_icon, Url::fromRoute('social_media.getstart_page', ['user' => $team->uid]))->toString();
          $actions = t('@edit', array('@edit' => $edit));

          $rows[] = [
                'team_id' =>  ['data' => $team->id],
                'team_name' => ['data' => $team->label, 'class' => 'sorted'],
                'owner' => ['data' => $owner],
                'members' => $members,
                'actions' => $actions,
              ];
        }
        // The table description.
        $build_teams = array();
        // Generate the table.
        $build_teams['config_table'] = array(
          '#theme' => 'table',
          '#header' => $header,
          '#rows' => $rows,
          '#attributes' => array('id'=>array('groups-teams'), 'class' => array('teams'), 'border' => 0),
          '#attached' => ['library' => ['my_groups/team']],
          '#empty' => 'You currently have no teams.',
        );
        $data['build_teams'] = $build_teams;
        //Member data
        $team_name = '';
        $team_query = '';
        $member_network_settings = '';
        if(isset($_GET['team'])){
          $gid = $_GET['team'];
          $muid = $_GET['muid'];
          $team_query = ["gid" => $gid, "muid" => $muid];
          $team_name = "Team: ";
          $team_name .= \Drupal::service('my_groups.team.service')->getTeamName($gid, $muid);
          $_SESSION['team']['gid'] = $gid;
          $_SESSION['team']['muid'] = $muid;
          $member_network_settings = $this->get_start_member_page($muid);
        }
        else {
          unset($_SESSION['team']);
        }
        $data['team_name'] = $team_name;
        $data['team_query'] = $team_query;
        $data['member_network_settings'] = $member_network_settings;
        
        //end get social media items PER USER
        $render_data[] = array('#theme' => 'social_media', '#data' => $data, '#attached' => ['library' => ['social_media/social_media _get_start', ], 'drupalSettings' => ['media_base_url' => $base_secure_url, 'path_userid' => $uid, 'team_query' => $team_query, ], ],);
        return $render_data;
    }
    /**
     * Getting Start Social Media Page.
     */
    public function get_start_member_page($uid) {
      global $base_secure_url;
      //start get social media items PER USER
      $vid = 'social_media_networks';
      $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid);
      $social_network = [];
      foreach ($terms as $term) {
        $term_id = $term->tid;
        $terms_obj = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($term_id);
        if (isset($terms_obj->field_icon) && isset($terms_obj->field_icon->target_id)) {
          $network_statu = $terms_obj->field_status->value;
          $network_icon_target = $terms_obj->field_icon->target_id;
          $file = \Drupal::entityTypeManager()->getStorage('file')->load($network_icon_target);
          // $social_icon_path    = $file->url();
          $social_icon_path = file_create_url($file->getFileUri());
          $network_status_unfiltered = $this->get_network_status($terms_obj->tid->value, $uid);
          if (array_key_exists('status', $network_status_unfiltered) && $network_status_unfiltered['status'] == 1) {
            if (array_key_exists('token_validated', $network_status_unfiltered) && $network_status_unfiltered['token_validated'] == 1) {
              //acive and validated network, filter network status array
              $network_status['status'] = 1;
            }
            else {
              //active but not validated network
              $network_status['status'] = 0;
            }
          }
          else {
            //neither active nor validated
            $network_status['status'] = 0;
          }
          $social_network[] = ['name' => $terms_obj->name->value, 'tid' => $terms_obj->tid->value, 'network_icon' => $social_icon_path, 'network_status' => $network_status];
        }
      }
      //$data['member_network_settings'] = $social_network;
      //$data['uid'] = $uid;
      return $social_network;
    }
    /**
     * Social Media main Page.
     */
    public function main_page($user, $appName) {
      $_SESSION['social_media_page_load'] = 1;
        global $base_secure_url;
        if(isset($_GET['team'])){
          $uid = $_GET['muid'];
        }
        else{
          $uid = $user->get('uid')->value;
        }
        $current_uid = \Drupal::currentUser()->id();
        $appName = $appName->get('tid')->value;
        //validate user, if user registered social media account then main page will accessible otherwise redirect to get start page
        $network_status_unfiltered = $this->get_network_status($appName, $uid);
        if (array_key_exists('status', $network_status_unfiltered) && $network_status_unfiltered['status'] == 1) {
            if (array_key_exists('token_validated', $network_status_unfiltered) && $network_status_unfiltered['token_validated'] == 1) {
                //acive and validated network, dont need to redirect getting start page
                $redirectToGettingStart = false;
            } else {
                //active but not validated network, need to redirect getting start page
                $redirectToGettingStart = true;
            }
        } else {
            //neither active nor validated, need to redirect getting start page
            $redirectToGettingStart = true;
        }
        if ($redirectToGettingStart == true) {
          if(isset($_GET['team'])){
            $gid = $_GET['team'];
            $muid = $_GET['muid'];
            return new RedirectResponse(Url::fromRoute('social_media.getstart_page', ['user' => $current_uid, 'team' => $gid, 'muid' => $muid], ['fragment' => 'nav-shared'])->toString());
          }else {
            $path = $base_secure_url . '/tools/social/media/' . $uid;
            $response = new RedirectResponse($path);
            $response->send();
          }
        }
        $ufID = 'uid-' . $uid . 'sid-' . $appName . '-' . time();
        $data['ufID'] = $ufID;
        //$data['uid'] = $uid;
        $data['uid'] = isset($_GET['team']) ? $current_uid : $uid;
        $account = \Drupal\user\Entity\User::load($uid); // pass your uid
        $name = $account->getUsername();
        $calendarData['UserName'] = $name;
        // Search post key
        if (isset($_GET['key'])) {
            $key = $_GET['key'];
        } else {
            $key = '';
        }
        //start get social media items for current user
        $social_network = [];
        $vid = 'social_media_networks';
        $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid);
        foreach ($terms as $term) {
            $term_id = $term->tid;
            $terms_obj = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($term_id);
            if (isset($terms_obj->field_icon) && isset($terms_obj->field_icon->target_id)) {
                $network_status = $terms_obj->field_status->value;
                $network_icon_target = $terms_obj->field_icon->target_id;
                $file = \Drupal::entityTypeManager()->getStorage('file')->load($network_icon_target);
                //$social_icon_path    = $file->url();
                $social_icon_path = file_create_url($file->getFileUri());
                $isURL = 0;
                // if current page is facebook
                if ($appName == $terms_obj->tid->value && $appName == '166') {
                    $isURL = 1;
                    $render_data['#attached']['drupalSettings']['knowledge_base_article'] = $terms_obj->get('field_knowledge_base_path')->getValue() [0];
                    $posts = [];
                    //my post tabs posts, if current social media page
                    $data['facebook_kaboodle']['fb_pages'] = $this->getFbPages($appName);
                    if (isset($_GET['page_id'])) {
                        $page_id = $_GET['page_id'];
                    } else {
                        //first page will be selected, if default page
                        if (count($data['facebook_kaboodle']['fb_pages']) > 0 && !isset($data['facebook_kaboodle']['fb_pages']['error'])) {
                            foreach ($data['facebook_kaboodle']['fb_pages'] as $fb_page_id => $fb_page_name) {
                                $page_id = $fb_page_id;
                                break;
                            }
                        }
                        else if(isset($data['facebook_kaboodle']['fb_pages']['error'])) {
                          $data['error'] = $data['facebook_kaboodle']['fb_pages']['error'];
                        }
                    }
                    if ($page_id) {
                        $isFacebookPageExist = 1;
                        $data['availabe_feature'] = $this->getAvailableFeatureModified($terms_obj);
                        $data['facebook_kaboodle']['selected_fb_page'] = $page_id;
                        if ($data['availabe_feature']['myPost']) {
                            $data['posts'] = $this->get_social_media_posts_default($user, $appName, $key, $page_id);
                            // media kit selector for edit post
                            $data['media_kit_two'] = $this->getMKSService($uid, 'mypost');
                        }
                        if ($data['availabe_feature']['newPost']) {
                            // media kit selector for new post
                            $data['media_kit_one'] = $this->getMKSService($uid, 'newpost');
                        }
                        if ($data['availabe_feature']['calendar']) {
                            $data['calendar_list'] = $this->get_social_media_post_by_date($appName, 'today', $page_id);
                            $calendarData['events'] = $this->getCalendarEvents($uid, $appName, $page_id);
                        }
                        if ($data['availabe_feature']['engagement']) {
                            $data['fb_posts'] = $this->getFacebookPost($page_id);
                        }
                        if ($data['availabe_feature']['ads']) {
                            $data['fb_adAccounts'] = $this->getFbAdAccounts($appName);
                        }
						
                        if ($data['availabe_feature']['settings']) {
                            $data['settings_field'] = $this->getFieldsSocialMedia($appName, $page_id);
                            // \Drupal::logger('facebook')->error('<pre><code>' . print_r($data['settings_field'], TRUE) . '</code></pre>');
                            //media kit selector for setting tab
                            $data['media_kit_three'] = $this->getMKSService($uid, 'profile');
                        }
                    } else {
                        $data['facebook_kaboodle']['selected_fb_page'] = '';
                        $data['fb_posts'] = '';
                        $data['posts'] = '';
                        $data['calendar_list'] = '';
                        $calendarData['events'] = '';
                        $isFacebookPageExist = 0;
                    }
                    $render_data['#attached']['drupalSettings']['social_media_global'] = $data['facebook_kaboodle']['fb_pages'];
                    $render_data['#attached']['drupalSettings']['social_media_name10'] = 'Facebook';
                    $render_data['#attached']['drupalSettings']['isFacebookPageExist'] = $isFacebookPageExist;
                    $libraries[] = 'social_media/social_media_facebook';
                }
                //if current page is Instagram
                if ($appName == $terms_obj->tid->value && $appName == '168') {
                    $isURL = 1;
                    $data['knowledge_base_article'] = $terms_obj->get('field_knowledge_base_path')->getValue() [0];
                    $render_data['#attached']['drupalSettings']['knowledge_base_article'] = $terms_obj->get('field_knowledge_base_path')->getValue() [0];
                    $data['instaAccounts'] = $this->getInstagramAccounts();
                    if (isset($_GET['account_id'])) {
                        $account_id = $_GET['account_id'];
                    } else {
                        //first account will be selected, as default account
                        if (count($data['instaAccounts']) > 0 && !isset($data['instaAccounts']['error'])) {
                            foreach ($data['instaAccounts'] as $account_id => $account_details) {
                                $account_id = $account_id;
                                break;
                            }
                        }
                        else if(isset($data['instaAccounts']['error'])) {
                          $data['error'] = $data['instaAccounts']['error'];
                        }
                    }
                    if ($account_id) {
                        $isInstagramAccountExist = 1;
                        $data['instagram_kaboodle']['selected_account'] = $account_id;
                        $data['availabe_feature'] = $this->getAvailableFeatureModified($terms_obj);
                        // \Drupal::logger('facebook')->error('<pre><code>' . print_r($data['availabe_feature'], TRUE) . '</code></pre>');
                        if ($data['availabe_feature']['myPost']) {
                            $data['posts'] = $this->get_social_media_posts_default($user, $appName, $key, $account_id);
                            // media kit selector for edit post
                            $data['media_kit_two'] = $this->getMKSService($uid, 'mypost');
                        }
                        if ($data['availabe_feature']['newPost']) {
                            // media kit selector for new post
                            $data['media_kit_one'] = $this->getMKSService($uid, 'newpost');
                        }
                        if ($data['availabe_feature']['calendar']) {
                            $calendarData['events'] = $this->getCalendarEvents($uid, $appName, $account_id);
                            $data['calendar_list'] = $this->get_social_media_post_by_date($appName, 'today', $account_id);
                        }
                        if ($data['availabe_feature']['engagement']) {
                            $data['insta_posts'] = $this->getInstagramPosts($account_id);
                        }
                        if ($data['availabe_feature']['settings']) {
                            $data['settings_field'] = $this->getFieldsSocialMedia($appName, $account_id);
                            //media kit selector for setting tab
                            $data['media_kit_three'] = $this->getMKSService($uid, 'profile');
                        }
                        // $data['settings_field'] = $this->getFieldsSocialMedia($appName, $account_id);
                        // \Drupal::logger('facebook')->error('<pre><code>' . print_r($data['settings_field'], TRUE) . '</code></pre>');
                        
                    } else {
                        $data['instagram_kaboodle']['selected_account'] = '';
                        $data['insta_posts'] = '';
                        $data['posts'] = '';
                        $data['calendar_list'] = '';
                        $calendarData['events'] = '';
                        $isInstagramAccountExist = 0;
                    }
                    // check instagram account exist associated with any Facebook Page
                    $render_data['#attached']['drupalSettings']['isInstagramAccountExist'] = $isInstagramAccountExist;
                    $render_data['#attached']['drupalSettings']['social_media_name10'] = 'Instagram';
                    $libraries[] = 'social_media/owl_carousal';
                    $libraries[] = 'social_media/social_media_instagram';
                }
                //if current page is Twitter
                if ($appName == $terms_obj->tid->value && $appName == '174') {
                    $isURL = 1;
                    $render_data['#attached']['drupalSettings']['knowledge_base_article'] = $terms_obj->get('field_knowledge_base_path')->getValue() [0];
                    $data['user_profile'] = $this->twitter_user_profile();
                    $data['availabe_feature'] = $this->getAvailableFeatureModified($terms_obj);
                    if ($data['availabe_feature']['myPost']) {
                        $data['posts'] = $this->get_social_media_posts_default($user, $appName, $key);
                        // media kit selector for edit post
                        $data['media_kit_two'] = $this->getMKSService($uid, 'mypost');
                    }
                    if ($data['availabe_feature']['newPost']) {
                        // media kit selector for new post
                        $data['media_kit_one'] = $this->getMKSService($uid, 'newpost');
                    }
                    if ($data['availabe_feature']['calendar']) {
                        $data['calendar_list'] = $this->get_social_media_post_by_date($appName, 'today', 'NULL');
                        $calendarData['events'] = $this->getCalendarEvents($uid, $appName);
                    }
                    if ($data['availabe_feature']['engagement']) {
                        $data['tweets'] = $this->getTwitterTweets();
                        // \Drupal::logger('Twitter')->error('<pre><code>' . print_r($data['tweets'], TRUE) . '</code></pre>');
                        $data['followers_list'] = $this->twitter_get_users('followers', $data['user_profile']->id, $data['user_profile']->screen_name);
                        $data['friends_list'] = $this->twitter_get_users('friends', $data['user_profile']->id, $data['user_profile']->screen_name);
                    }
                    if ($data['availabe_feature']['settings']) {
                        $data['settings_field'] = $this->getFieldsSocialMedia($appName);
                        //media kit selector for setting tab
                        $data['media_kit_three'] = $this->getMKSService($uid, 'profile');
                    }
                    
                    $render_data['#attached']['drupalSettings']['social_media_name10'] = 'Twitter';
                    $libraries[] = 'social_media/social_media_twitter';
                    $libraries[] = 'social_media/social_media_atWho';
                }
                $network_status = [];
                $network_status_unfiltered = $this->get_network_status($terms_obj->tid->value, $uid);
                if (array_key_exists('status', $network_status_unfiltered) && $network_status_unfiltered['status'] == 1) {
                    if (array_key_exists('token_validated', $network_status_unfiltered) && $network_status_unfiltered['token_validated'] == 1) {
                        //acive and validated network, filter network status array
                        $network_status['status'] = 1;
                    } else {
                        //active but not validated network
                        $network_status['status'] = 0;
                    }
                } else {
                    //neither active nor validated
                    $network_status['status'] = 0;
                }
                $social_network[] = ['name' => $terms_obj->name->value, 'tid' => $terms_obj->tid->value, 'network_icon' => $social_icon_path, 'network_status' => $network_status, 'isURL' => $isURL];
            }
        }
        
        //$data['network_srttings'] = $social_network;
        if(isset($_GET['team'])){
          $network_settings = $this->get_start_member_page($current_uid);
          $data['network_srttings'] = $network_settings;
          $data['member_network_settings'] = $social_network;
        }
        else {
          $data['network_srttings'] = $social_network;
        }
        //start fetch default media kit of a user
        $query = \Drupal::database()->select('node_field_data', 'n');
        $query->leftJoin('media_kit_sorting', 'm', "n.nid = m.nid");
        $query->fields('n', ['nid']);
        $query->condition('n.uid', $uid, '=');
        $query->condition('n.type', 'media_kit', '=');
        $query->orderBy('m.sort_number', 'ASC');
        $default_media_kit = $query->execute()->fetchAssoc();

        // testing table template as rendered array
        $header = [
          'team_id' => ['data' => t('Team ID'), 'class' => 'sortempty', 'id' =>'team-id', 'width' => '10%', 'onclick' => 'sortColumn(this, "number")'],
          'team_name' => ['data' => t('Team Name'), 'class' => 'sortempty asc-icon bg-sort', 'id' => 'team-name', 'onclick' => 'sortColumn(this, "text")'],
          'owner' => ['data' => t('Owner'), 'class' => 'sortempty', 'id' => 'team-owner', 'width' => '20%', 'onclick' => 'sortColumn(this, "text")'],
          'members' => ['data' => t('Members'), 'width' => '15%'],
          'actions' => ['data' => t('Actions'), 'id' => 'team-owner-action', 'width' => '15%', 'class' => 'sortempty'],
        ];
        
        $query = \Drupal::database()->select('group_content_field_data', 'gm');
        $query->fields('team', ['id', 'label', 'uid']);
        $query->fields('ufn', ['field_first_name_value']);
        $query->fields('upfn', ['field_preferred_first_name_value']);
        $query->fields('uln', ['field_last_name_value']);
        $query->innerJoin('group_content__group_roles', 'gmr', "gmr.entity_id = gm.id AND gmr.bundle = gm.type");
        $query->innerJoin('groups_field_data', 'team', "team.id = gm.gid");
        $query->innerJoin('team_membership_status', 'tm', "tm.team_id = gm.gid AND tm.member_id = gm.entity_id AND tm.status = 1");
        $query->leftJoin('user__field_first_name', 'ufn', 'ufn.entity_id =team.uid');
        $query->leftJoin('user__field_preferred_first_name', 'upfn', 'upfn.entity_id = team.uid');
        $query->leftJoin('user__field_last_name', 'uln', 'uln.entity_id = team.uid');
        $query->condition('team.type', 'team', '=');
        $query->condition('gm.entity_id', $current_uid, '=');
        $query->condition('team.uid', $current_uid, '<>');
        $query->condition('gmr.group_roles_target_id', 'team-social_media', '=');
        $query->orderBy('team.label', 'ASC');
        $sort = $query->extend('Drupal\Core\Database\Query\TableSortExtender')->orderByHeader($header);
        // Limit the rows to 20 for each page.
        $pager = $sort->extend('Drupal\Core\Database\Query\PagerSelectExtender')->limit(25);
        $teams = $pager->execute();
        
        $edit_img_tag = '<img src="'. base_path() . drupal_get_path('module', 'my_groups') . '/images/edit-icon.png" width="20"/>';
        $rendered_edit_icon = render($edit_img_tag);
        $edit_icon = Markup::create($rendered_edit_icon);

        $rows = [];
        foreach ($teams as $team) {
          // team owner name
          if(empty($team->field_preferred_first_name_value)){
            $fname = $team->field_first_name_value;
          }else{
            $fname = $team->field_preferred_first_name_value;
          }
          $lname = $team->field_last_name_value;
          $owner = $fname.' '.$lname;
          // number of team members
          $members = \Drupal::service('my_groups.team.service')->getNumMembers($team->id);
          
          $url = Url::fromRoute('social_media.getstart_page', ['user' => $current_uid]);
          $args = ['team' => $team->id, 'muid' => $team->uid];
          $url->setOptions(array('query' => $args, 'fragment' => 'nav-shared'));
          $edit = Link::fromTextAndUrl($edit_icon, $url)->toString();
          //$edit = Link::fromTextAndUrl($edit_icon, Url::fromRoute('social_media.getstart_page', ['user' => $team->uid]))->toString();
          $actions = t('@edit', array('@edit' => $edit));

          $rows[] = [
                'team_id' =>  ['data' => $team->id],
                'team_name' => ['data' => $team->label, 'class' => 'sorted'],
                'owner' => ['data' => $owner],
                'members' => $members,
                'actions' => $actions,
              ];
        }
        // The table description.
        $build_teams = array();
        // Generate the table.
        $build_teams['config_table'] = array(
          '#theme' => 'table',
          '#header' => $header,
          '#rows' => $rows,
          '#attributes' => array('id'=>array('groups-teams'), 'class' => array('teams'), 'border' => 0),
          '#attached' => ['library' => ['my_groups/team']],
          '#empty' => 'You currently have no teams.',
        );
        $data['build_teams'] = $build_teams;
        //Member data
        $team_name = '';
        $team_query = '';
        //$member_network_settings = '';
        if(isset($_GET['team'])){
          $gid = $_GET['team'];
          $muid = $_GET['muid'];
          $team_query = ["gid" => $gid, "muid" => $muid];
          $team_name = "Team: ";
          $team_name .= \Drupal::service('my_groups.team.service')->getTeamName($gid, $muid);
          $_SESSION['team']['gid'] = $gid;
          $_SESSION['team']['muid'] = $muid;
          //$member_network_settings = $this->get_start_member_page($muid);
        }
        else {
          unset($_SESSION['team']);
        }
        $data['team_name'] = $team_name;
        $data['team_query'] = $team_query;
        //$data['member_network_settings'] = $member_network_settings;
        //print "<pre>";print_r($data);exit;

        $libraries[] = 'social_media/social_media_jquery_custom';
        $libraries[] = 'social_media/fullCalender';
        $libraries[] = 'social_media/social_media_image_editor';
        $libraries[] = 'social_media/social_media.main';
        $libraries[] = 'media_vault_tool/react.min';
        $libraries[] = 'media_vault_tool/react.dom.min';
        $libraries[] = 'media_vault_tool/axios';
        $libraries[] = 'media_kit_selector/media.kit.global';
		
        $libraries[] = 'social_media/datetimepicker';
        $render_data[] = array('#theme' => 'social_media', '#data' => $data, '#pager' => ['#type' => 'pager'], '#attached' => ['library' => $libraries, 'drupalSettings' => ['media_base_url' => $base_secure_url, 'path_userid' => $uid, 'default_media_kit_id' => $default_media_kit['nid'], 'calendarData' => $calendarData, 'settings_field' => $data['settings_field'], 'team_query' => $team_query, ], ],);
        return $render_data;
    }
    /**
     * function to get MKS Service.
     */
    public function getMKSService($uid, $type) {
        $options = [];
        $options['uid'] = $uid;
        $options['element_id'] = $type;
        $options['mk_select'] = 1;
        $options['search'] = 1;
        if ($type == 'profile') {
            $options['tabs']['photo'] = ['cols' => ['multi_asset_chk' => 0, 'photo' => 1, 'title' => 1, 'tags' => 1, 'dimension' => 1], 'active' => 1, 'gallery' => 0, 'tick' => 1];
            $options['tabs']['video'] = [];
            $options['tabs']['audio'] = [];
            $options['tabs']['text'] = [];
            return \Drupal::service('media.kit.selector')->getMediaKitMKS($options);
        } elseif ($type == 'newpost') {
            $options['tabs']['photo'] = ['cols' => ['multi_asset_chk' => 1, 'photo' => 1, 'title' => 1, 'tags' => 1, 'dimension' => 1], 'active' => 1, 'gallery' => 1];
            $options['tabs']['video'] = ['cols' => ['multi_asset_chk' => 1, 'video' => 1, 'title' => 1, 'tags' => 1, 'duration' => 1], 'active' => 0, 'play' => 1];
            $options['tabs']['audio'] = [];
            $options['tabs']['text'] = [];
            return \Drupal::service('media.kit.selector')->getMediaKit($options);
        } elseif ($type == 'mypost') {
            $options['tabs']['photo'] = ['cols' => ['multi_asset_chk' => 1, 'photo' => 1, 'title' => 1, 'tags' => 1, 'dimension' => 1], 'active' => 1, 'gallery' => 1];
            $options['tabs']['video'] = ['cols' => ['multi_asset_chk' => 1, 'video' => 1, 'title' => 1, 'tags' => 1, 'duration' => 1], 'active' => 0, 'play' => 1];
            $options['tabs']['audio'] = [];
            $options['tabs']['text'] = [];
            return \Drupal::service('media.kit.selector')->getMediaKitSelector($options);
        }
    }
    /**
     * function to get posts from Database to show on calendar.
     */
    public function getCalendarEvents($uid, $appName, $facebook_page_id = '') {
        $user = \Drupal::currentUser();
        if ($appName) {
            $terms_obj = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($appName);
            $socialname = $terms_obj->getName();
            $events = array();
            $query = \Drupal::database()->select('social_media', 'sm');
            if ($facebook_page_id) {
                $result = $query->fields('sm', array('id', 'scheduled_timestamp'))->condition('sm.uid', $uid, '=')->condition('sm.social_media_name', $socialname, '=')->condition('sm.page_id', $facebook_page_id, '=')->orderBy('created', 'DESC')->execute()->fetchAll();
            } else {
                $result = $query->fields('sm', array('id', 'scheduled_timestamp'))->condition('sm.uid', $uid, '=')->condition('sm.social_media_name', $socialname, '=')->orderBy('created', 'DESC')->execute()->fetchAll();
            }
            if (!empty($result)) {
                foreach ($result as $row_object) {
                    $date = new DrupalDateTime(date('Y-m-d H:i:s', $row_object->scheduled_timestamp), new \DateTimeZone('utc'));
                    $date->setTimezone(new \DateTimeZone($user->getTimeZone()));
                    $manual_datetime = strtotime($date->format('Y-m-d H:i:s'));
                    //$manual_datetime = $scheduled_data->manual_datetime;
                    $published_date = date('Y-m-d H:i:s', $manual_datetime);
                    $Onlytime = explode(" ", $published_date);
                    $formatedTime = date("g:i a", strtotime($Onlytime[1]));
                    $unformatedTime = date('Y-m-d H:00', $manual_datetime);
                    $events[] = array('start' => $unformatedTime);
                }
            }
        }
        return $events;
    }
    /**
     * To save schedule settings modal.
     */
    public function save_schedule_settings() {
        //get your POST parameter
        $action = \Drupal::request()->get('action');
        $media_kit_id = \Drupal::request()->get('media_kit_id');
        $social_media_name = \Drupal::request()->get('social_media_name');
        $text = \Drupal::request()->get('text');
        $uid = \Drupal::request()->get('uid');
        $status = \Drupal::request()->get('status');
        $page_id = \Drupal::request()->get('page_id');
        $ufid = \Drupal::request()->get('ufid');
        $user = \Drupal::currentUser();
        // default un-published
        $is_published = 0;
        if ($action == 'schedule') {
            // save schedule form
            $schedule_type = \Drupal::request()->get('schedule_type');
            $manual_datetime = \Drupal::request()->get('manual_datetime');
            //convert manual_datetime to utc timestamp
            if ($manual_datetime) {
                $date = new DrupalDateTime($manual_datetime, new \DateTimeZone($user->getTimeZone()));
                $date->setTimezone(new \DateTimeZone('utc'));
                $manual_datetime = strtotime($date->format('Y-m-d H:i:s'));
            }
            $result = \Drupal::database()->merge('social_media')->key(['uid' => $uid, 'ufid' => $ufid, 'social_media_name' => $social_media_name, ])->fields(['page_id' => $page_id, 'media_kit_id' => $media_kit_id, 'status' => $status, 'is_published' => $is_published, 'text' => $text, 'schedule_type' => $schedule_type, 'scheduled_timestamp' => $manual_datetime, 'created' => time(), ])->execute();
            $output['result'] = 'done';
        } else {
            //save main form
            $scheduled_bubble = \Drupal::request()->get('scheduled_bubble');
            $mids = $_POST['mid'];
            $sm_post_id = NULL;
            $post_data = [];
            $post_data['message'] = $text;
            $post_data['mids'] = $mids;
            $sm = \Drupal::database()->select('social_media', 'sm')->fields('sm', ['id', 'scheduled_timestamp'])->condition('sm.uid', $uid, '=')->condition('sm.ufid', $ufid, '=')->condition('sm.social_media_name', $social_media_name, '=')->execute()->fetchObject();
            if (!empty($sm)) {
                // scheduling found so post,draft and schedule operation would take place here.
                // if status is posted immediatelly published_date
                if ($status == 'Post') {
                    $user = \Drupal::currentUser();
                    $date = new DrupalDateTime('now', new \DateTimeZone($user->getTimeZone()));
                    $date->setTimezone(new \DateTimeZone('utc'));
                    $manual_datetime = strtotime($date->format('Y-m-d H:i:s'));
                    if ($social_media_name == 'Facebook') {
                        $post_data['scheduled_publish_time'] = 0;
                        $response = $this->facebook_post_publish($page_id, $post_data, $uid);
                        if (array_key_exists("id", $response)) {
                            $is_published = 1;
                            $sm_post_id = $response['id'];
                        }
                    }
                    if ($social_media_name == 'Twitter') {
                        $response = $this->twitter_tweet_publish($post_data, $uid);
                        if ($response) {
                            $is_published = 1;
                            $sm_post_id = $response;
                        } else {
                            $response_message = "error";
                            \Drupal::logger('Social media twitter')->error('<pre><code>' . print_r($response_message, true) . '</code></pre>');
                        }
                    }
                    if ($social_media_name == 'Instagram') {
                        $response = $this->instagram_publish_media($page_id, $post_data, $uid);
                        if (array_key_exists("id", $response)) {
                            $is_published = 1;
                            $sm_post_id = $response['id'];
                        }
                    }
                    \Drupal::database()->update('social_media')->fields(['page_id' => $page_id, 'text' => $text, 'status' => $status, 'media_kit_id' => $media_kit_id, 'is_published' => $is_published, 'mids' => implode(',', $mids), 'sm_post_id' => $sm_post_id, 'scheduled_timestamp' => $manual_datetime, 'scheduled_bubble' => $scheduled_bubble])->condition('uid', $uid, '=')->condition('ufID', $ufid, '=')->condition('social_media_name', $social_media_name, '=')->execute();
                } elseif ($status == 'Scheduled') {
                    if ($social_media_name == 'Facebook') {
                        $date = new DrupalDateTime(date('d-m-Y h:i A', $sm->scheduled_timestamp), new \DateTimeZone('utc'));
                        $date->setTimezone(new \DateTimeZone($user->getTimeZone()));
                        $user_timestamp = strtotime($date->format('Y-m-d H:i:s'));
                        $post_data['scheduled_publish_time'] = $user_timestamp;
                        $response = $this->facebook_post_publish($page_id, $post_data, $uid);
                        if (array_key_exists("id", $response)) {
                            $sm_post_id = $response['id'];
                        }
                    }
                    \Drupal::database()->update('social_media')->fields(['page_id' => $page_id, 'text' => $text, 'status' => $status, 'media_kit_id' => $media_kit_id, 'is_published' => $is_published, 'mids' => implode(',', $mids), 'sm_post_id' => $sm_post_id, 'scheduled_bubble' => $scheduled_bubble])->condition('uid', $uid, '=')->condition('ufID', $ufid, '=')->condition('social_media_name', $social_media_name, '=')->execute();
                } else {
                    \Drupal::database()->update('social_media')->fields(['page_id' => $page_id, 'text' => $text, 'status' => $status, 'media_kit_id' => $media_kit_id, 'is_published' => $is_published, 'mids' => implode(',', $mids), 'sm_post_id' => $sm_post_id, 'scheduled_bubble' => $scheduled_bubble])->condition('uid', $uid, '=')->condition('ufID', $ufid, '=')->condition('social_media_name', $social_media_name, '=')->execute();
                }
                $output['result'] = 'done';
            } else {
                // no settings for scheduling , so draft and post operation would take place in this block
                if ($status == 'Post') {
                    if ($social_media_name == 'Facebook') {
                        $post_data['scheduled_publish_time'] = 0;
                        $response = $this->facebook_post_publish($page_id, $post_data, $uid);
                        if (array_key_exists("id", $response)) {
                            $is_published = 1;
                            $sm_post_id = $response['id'];
                        }
                    }
                    if ($social_media_name == 'Twitter') {
                        $response = $this->twitter_tweet_publish($post_data, $uid);
                        if ($response) {
                            $is_published = 1;
                            $sm_post_id = $response;
                        } else {
                            $response_message = "error";
                            \Drupal::logger('Social media twitter')->error('<pre><code>' . print_r($response_message, true) . '</code></pre>');
                        }
                    }
                    if ($social_media_name == 'Instagram') {
                        $response = $this->instagram_publish_media($page_id, $post_data, $uid);
                        if (array_key_exists("id", $response)) {
                            $is_published = 1;
                            $sm_post_id = $response['id'];
                        }
                    }
                }
                // schedule data
                $user = \Drupal::currentUser();
                $date = new DrupalDateTime('now', new \DateTimeZone($user->getTimeZone()));
                $date->setTimezone(new \DateTimeZone('utc'));
                $manual_datetime = strtotime($date->format('Y-m-d H:i:s'));
                $result = \Drupal::database()->merge('social_media')->key(['uid' => $uid, 'ufid' => $ufid, 'social_media_name' => $social_media_name, 'scheduled_bubble' => $scheduled_bubble])->fields(['page_id' => $page_id, 'media_kit_id' => $media_kit_id, 'status' => $status, 'is_published' => $is_published, 'text' => $text, 'schedule_type' => 'manual_check', 'scheduled_timestamp' => $manual_datetime, 'created' => time(), 'mids' => implode(',', $mids), 'sm_post_id' => $sm_post_id])->execute();
                $output['result'] = 'done';
            }
        }
        $json_response = json_encode($output);
        return new JsonResponse($json_response);
    }
    /**
     * function to save social network status(active/available), Access token .
     */
    public function save_social_network_settings() {
      //$current_uid = \Drupal::request()->get('uid');
      $user = \Drupal::currentUser();
      //$current_uid = $user->id();
      $current_uid = isset($_GET['team']) ? $_GET['muid'] : $user->id();
      $social_items_id = \Drupal::request()->get('tid');
      $status = \Drupal::request()->get('status');

      $access_token_data = [];
      $properties = ['status' => $status, 'token_access' => json_encode($access_token_data) ];
      $res = $this->setkaboodleNetworkStatusProperty($social_items_id, $current_uid, $properties);
      if ($res) {
          $result = 'success';
      } else {
          $result = 'fail';
      }
      if( ($social_items_id == 166) || ($social_items_id == 168) ){
        $this->deAuthorizeFacebookAccessToken($social_items_id, $current_uid);
      } 

      return new Response($result);
    }
	/**
     * deauthorize facebook Access token
     */
	public function deAuthorizeFacebookAccessToken($social_item_id, $uid){
			$properties = ['token_access'];
			$network_properties = $this->getKabbodeNetworkStatusProperty($social_item_id, $uid, $properties);
			$facebookHelper = new FacebookHelperFunction();
            $fb = $facebookHelper->getFBObject();
			$tkn = $network_properties['token_access'];  
			// validate token, if not validated simply emove token fron DB else remove from fb
			 $oAuth2Client = $fb->getOAuth2Client($tkn);
            $tokenMetadataObject = $oAuth2Client->debugToken();
            $validToken =$tokenMetadataObject->getProperty('is_valid');
            if(!$validToken ){
				return true;
			}
			
			$fb_permissions_list = ['pages_manage_posts','pages_manage_engagement','pages_manage_metadata', 'pages_read_engagement', 'pages_read_user_content']; 
			$insta_permissions_list = ['instagram_basic', 'instagram_content_publish', 'instagram_manage_comments'];
			$insta_fb_common_permissions_list = ['pages_show_list', 'public_profile'];
			$permissionToRemove = [];

            $response = $fb->get('me/permissions', $tkn);
			$graphNode = $response->getDecodedBody();
			$is_flag = 0;
			if($social_item_id == 166){
				$current_permission_list = $fb_permissions_list;
			}
			elseif($social_item_id == 168){
				$current_permission_list = $insta_permissions_list;
			}
			
			foreach($graphNode['data'] as $index=>$perm){
			 if($perm['status'] == 'granted'){
				if(in_array($perm['permission'], $current_permission_list)){
				  // prepare single permission list to remove here
				  $permissionToRemove[] = $perm['permission'];  
				   //$is_flag = 1;
				  // $response2 = $fb->delete('me/permissions/'.$perm['permission'], array(), $tkn);
				}
				elseif(in_array($perm['permission'], $insta_fb_common_permissions_list)){
					
				}
				else{
					$is_flag = 1;
				}
			 }
			}
            
			if($is_flag == 0){
			//remove complete permission
			 $response3 = $fb->delete('me/permissions', array(), $tkn);
			} 
             else{
				 foreach($permissionToRemove as $key=>$val){
					 $response2 = $fb->delete('me/permissions/'.$val, array(), $tkn); 
				 }
			 }
		 
	 } 
	
    /**
     * fetched network status(active/available) for each social media .
     */
    public function get_network_status($social_item_id, $uid) {
        $network_status = [];
        $social_network_status = \Drupal::database()->select('social_media_connection_status', 'sn')->fields('sn', ['status', 'token_access', 'termID'])->condition('sn.uid', $uid, '=')->condition('sn.termID', $social_item_id, '=')->execute()->fetchAll();
        if ($social_network_status) {
            foreach ($social_network_status as $row_data) {
                $network_status['status'] = $row_data->status;
                if ($row_data->token_access) {
                    $access_token = unserialize(base64_decode($row_data->token_access));
                    if (is_object($access_token)) {
                        //facebook
                        if ($row_data->termID == '166') {
                            // $facebookHelper = new FacebookHelperFunction();
                            // $validToken = $facebookHelper->getFBTokenProperty($access_token, 'is_valid');
                            // if ($validToken) {
                            $network_status['token_validated'] = 1;
                            // }
                            
                        }
                        if ($row_data->termID == '168') {
                            //instagram
                            $network_status['token_validated'] = 1;
                        }
                        if ($row_data->termID == '174') {
                            //twitter
                            $network_status['token_validated'] = 1;
                        }
                    }
                }
            }
        }
        return $network_status;
    }
    /**
     *  get term id from term name
     */
    public function get_term_id_by_term_name($vid, $term_name) {
        $term = taxonomy_term_load_multiple_by_name($term_name, $vid);
        if (!empty($term)) {
            if (count($term) == 1) {
                $s_id = key($term);
            } else {
                $s_id = 'null';
            }
        } else {
            $s_id = key($term);
        }
        return $s_id;
    }
    public function get_social_media_posts($user, $network_id, $key, $page_id) {
        $json_response = json_encode($this->get_social_media_posts_default($user, $key, $page_id), JSON_UNESCAPED_SLASHES);
        return new JsonResponse($json_response);
    }
    /**
     * fetched social media post from Database..
     */
    public function get_social_media_posts_default($user, $network_id, $key, $Page_id = '') {
        // don't confuse with page_id, for fb is will act like a page but for insta it will act as account
        if(isset($_GET['team'])){
          $uid = $_GET['muid'];
          $user = \Drupal\user\Entity\User::load($uid);
        }
        else {
          $uid = $user->get('uid')->value;
          $user = \Drupal::currentUser();
        }
        $term = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($network_id);
        if ($term) {
            $social_media_name = $term->label();
        }
        $events = array();
        $query = \Drupal::database()->select('social_media', 'sm');
        if ($network_id == '166' || $network_id == '168') {
            $result = $query->fields('sm', array('id', 'status', 'social_media_name', 'data', 'text', 'is_published', 'scheduled_timestamp', 'mids'))->condition('sm.uid', $uid, '=')->condition('sm.social_media_name', $social_media_name, '=')->condition('sm.page_id', $Page_id, '=')->condition('sm.text', '%' . db_like($key) . '%', 'like')->orderBy('created', 'DESC')->extend('Drupal\Core\Database\Query\PagerSelectExtender')->limit(25)->execute()->fetchAll();
        } else {
            $result = $query->fields('sm', array('id', 'status', 'social_media_name', 'data', 'text', 'is_published', 'scheduled_timestamp', 'mids'))->condition('sm.uid', $uid, '=')->condition('sm.social_media_name', $social_media_name, '=')->condition('sm.text', '%' . db_like($key) . '%', 'like')->orderBy('created', 'DESC')->extend('Drupal\Core\Database\Query\PagerSelectExtender')->limit(25)->execute()->fetchAll();
        }
        if (!empty($result)) {
            foreach ($result as $row_object) {
                $postId = $row_object->id;
                $published = $row_object->is_published;
                $socialMediaName = $row_object->social_media_name;
                $postName = $row_object->text;
                $status = $row_object->status;
                $date = new DrupalDateTime(date('Y-m-d H:i:s', $row_object->scheduled_timestamp), new \DateTimeZone('utc'));
                $date->setTimezone(new \DateTimeZone($user->getTimeZone()));
                $manual_datetime = strtotime($date->format('Y-m-d H:i:s'));
                $date = new DrupalDateTime('now', new \DateTimeZone($user->getTimeZone()));
                $current_datetime = strtotime($date->format('Y-m-d H:i:s'));
                if ($socialMediaName == 'Facebook' && $status == 'Scheduled' && $published == 0 && $current_datetime > $manual_datetime) {
                    //\Drupal::logger('Social media test')->error('<pre><code>' . print_r('publshed block', true) . '</code></pre>');
                    $published = 1;
                    \Drupal::database()->update('social_media')->fields(['is_published' => $published])->condition('uid', $uid, '=')->condition('id', $postId, '=')->execute();
                }
                // get thumbnail from mids
                $thumbnail_data = $this->getPostsThumbnails(explode(',', $row_object->mids));
                $events[] = array("sid" => $postId, "title" => $postName, "socialMediaName" => $social_media_name, "timestamp" => $manual_datetime, "status" => $status, "is_published" => $published, "defaultthubnail" => $thumbnail_data['url_mid'], "thumnail_type" => $thumbnail_data['thumnail_type']);
            }
        }
        return $events;
        //return new JsonResponse($events);
        
    }
    public function getPostsThumbnails(array $mids) {
        $thumbnail_data = [];
        if (!empty($mids)) {
            $image = [];
            $audio = [];
            $video = [];
            $text = [];
            foreach ($mids as $mid) {
                $media = Media::load((int)$mid);
                if (is_object($media)) {
                    if ($media->hasField('field_media_video_file')) {
                        $targetid = $media->field_media_video_file->target_id;
                        $video[] = $targetid;
                    } elseif ($media->hasField('field_media_image')) {
                        $targetid = $media->field_media_image->target_id;
                        $image[] = $targetid;
                    } elseif ($media->hasField('field_media_file')) {
                        $targetid = $media->field_media_file->target_id;
                        $text[] = $targetid;
                    } elseif ($media->hasField('field_media_audio_file')) {
                        $targetid = $media->field_media_audio_file->target_id;
                        $audio[] = $targetid;
                    }
                }
            }
            if (count($image)) {
                $file = File::load($image[0]);
                $style = \Drupal::entityTypeManager()->getStorage('image_style')->load('90x90_media_vault_photo');
                $url_mid = $style->buildUrl($file->getFileUri());
                //$url_mid     = file_create_url($file->getFileUri());
                $thumnail_type = 'image';
            } elseif (count($video)) {
                $file = File::load($video[0]);
                $url_mid = file_create_url($file->getFileUri());
                $thumnail_type = 'video';
            } elseif (count($audio)) {
                $file = File::load($audio[0]);
                $url_mid = file_create_url($file->getFileUri());
                $thumnail_type = 'audio';
            } elseif (count($text)) {
                $file = File::load($text[0]);
                $url_mid = file_create_url($file->getFileUri());
                $thumnail_type = 'text';
            } else {
                $url_mid = '';
                $thumnail_type = '';
            }
        } else {
            $url_mid = "none";
            $thumnail_type = 'none';
        }
        $thumbnail_data['url_mid'] = $url_mid;
        $thumbnail_data['thumnail_type'] = $thumnail_type;
        return $thumbnail_data;
    }
    /**
     * Delete Social media post from Database.
     */
    public function delete_social_media_posts($sid) {
        $response = array();
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        if ($current_uid) {
            $sm = \Drupal::database()->select('social_media', 'sm')->fields('sm', ['page_id', 'sm_post_id', 'social_media_name'])->condition('sm.uid', $current_uid, '=')->condition('sm.id', $sid, '=')->execute()->fetchObject();
            if (!empty($sm) && isset($sm->sm_post_id) && $sm->social_media_name == 'Facebook') {
                $this->fbPostOperation($sm->page_id, $sm->sm_post_id, 'delete');
            }
            $query = \Drupal::database()->delete('social_media')->condition('uid', $current_uid, '=')->condition('id', $sid, '=')->execute();
            if ($query > 0) {
                $response['result'] = 'Deleted';
            } else {
                $response['result'] = 'invalid post';
            }
        } else {
            $response['result'] = 'Unauthorized user';
        }
        $json_response = json_encode($response);
        return new JsonResponse($json_response);
    }
    /**
     * Fetched social media post from database by ID .
     */
    public function get_social_media_post_by_postID() {
        $user = \Drupal::currentUser();
        //$current_uid = $user->id();
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : $user->id();
        $uid = \Drupal::request()->get('uid');
        $sid = \Drupal::request()->get('sid');
        $update_post = [];
        if ($current_uid == $uid) {
            $query = \Drupal::database()->select('social_media', 'sm');
            $result = $query->fields('sm', ['social_media_name', 'status', 'text', 'media_kit_id', 'schedule_type', 'scheduled_timestamp', 'page_id', 'mids', 'scheduled_bubble'])->condition('sm.uid', $uid, '=')->condition('sm.id', $sid, '=')->execute()->fetchObject();
            if ($result) {
                $update_post['mids'] = array_map('intval', explode(',', $result->mids));
                //$update_post['mids'] = [627,629];
                $update_post['post_name'] = $result->text;
                $update_post['media_kit_id'] = $result->media_kit_id;
                $update_post['status'] = $result->status;
                $update_post['page_id'] = $result->page_id;
                $update_post['schedule_type'] = $result->schedule_type;
                $date = new DrupalDateTime(date('Y-m-d H:i', $result->scheduled_timestamp), new \DateTimeZone('utc'));
                $date->setTimezone(new \DateTimeZone($user->getTimeZone()));
                $manual_datetime = strtotime($date->format('Y/m/d H:i:s'));
                $update_post['manual_datetime'] = $manual_datetime;
                $update_post['date_formate'] = $date->format('Y/m/d H:i');
                $update_post['scheduled_bubble'] = $result->scheduled_bubble;
            }
        }
        $json_response = json_encode($update_post);
        return new JsonResponse($json_response);
    }
    /**
     * Update/edit social media post and update into Database.
     */
    public function update_social_media_post() {
        $user = \Drupal::currentUser();
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $uid = \Drupal::request()->get('uid');
        $response = [];
        if ($current_uid == $uid) {
            $sid = \Drupal::request()->get('sid');
            $action = \Drupal::request()->get('action');
            $media_kit_id = \Drupal::request()->get('media_kit_id');
            $text = \Drupal::request()->get('text');
            $status = \Drupal::request()->get('status');
            $ufid = \Drupal::request()->get('ufid');
            $page_id = \Drupal::request()->get('page_id');
            if ($action == 'schedule') {
                $schedule_type = \Drupal::request()->get('schedule_type');
                if ($schedule_type == 'manual_check') {
                    $manual_datetime = \Drupal::request()->get('manual_datetime');
                    //convert manual_datetime to utc timestamp
                    if ($manual_datetime) {
                        $user = \Drupal::currentUser();
                        $date = new DrupalDateTime($manual_datetime, new \DateTimeZone($user->getTimeZone()));
                        $date->setTimezone(new \DateTimeZone('utc'));
                        $manual_datetime = strtotime($date->format('Y-m-d H:i:s'));
                    }
                }
                $result = \Drupal::database()->update('social_media')->fields(['text' => $text, 'page_id' => $page_id, 'schedule_type' => $schedule_type, 'scheduled_timestamp' => $manual_datetime])->condition('uid', $uid, '=')->condition('id', $sid, '=')->execute();
                $response['result'] = 1;
            } else {
                $scheduled_bubble = \Drupal::request()->get('scheduled_bubble');
                $sm_post_id = NULL;
                $mids = $_POST['mid'];
                $post_data = [];
                $post_data['message'] = $text;
                $post_data['mids'] = $mids;
                $sm = \Drupal::database()->select('social_media', 'sm')->fields('sm', ['id', 'page_id', 'social_media_name', 'schedule_type', 'scheduled_timestamp', 'status', 'sm_post_id'])->condition('sm.uid', $uid, '=')->condition('id', $sid, '=')->execute()->fetchObject();
                if (!empty($sm)) {
                    $social_media_name = $sm->social_media_name;
                    $schedule_type = $sm->schedule_type;
                    $manual_datetime = $sm->scheduled_timestamp;
                    //posts published immediatelly
                    $is_published = 0;
                    if ($status == 'Post') {
                        $user = \Drupal::currentUser();
                        $date = new DrupalDateTime('now', new \DateTimeZone($user->getTimeZone()));
                        $date->setTimezone(new \DateTimeZone('utc'));
                        $manual_datetime = strtotime($date->format('Y-m-d H:i:s'));
                        if ($social_media_name == 'Facebook') {
                            if ($sm->status == 'Scheduled' && isset($sm->sm_post_id)) {
                                $this->fbPostOperation($sm->page_id, $sm->sm_post_id, 'delete');
                            }
                            $post_data['scheduled_publish_time'] = 0;
                            $response = $this->facebook_post_publish($page_id, $post_data, $uid);
                            if (array_key_exists("id", $response)) {
                                $is_published = 1;
                                $sm_post_id = $response['id'];
                            }
                        }
                        if ($social_media_name == 'Twitter') {
                            $response = $this->twitter_tweet_publish($post_data, $uid);
                            if ($response) {
                                $is_published = 1;
                                $sm_post_id = $response;
                            } else {
                                $response_message = "error";
                                \Drupal::logger('Social media twitter')->error('<pre><code>' . print_r($response_message, true) . '</code></pre>');
                            }
                        }
                        if ($social_media_name == 'Instagram') {
                            $response = $this->instagram_publish_media($page_id, $post_data, $uid);
                            if (array_key_exists("id", $response)) {
                                $is_published = 1;
                                $sm_post_id = $response['id'];
                            }
                        }
                        \Drupal::database()->update('social_media')->fields(['text' => $text, 'status' => $status, 'media_kit_id' => $media_kit_id, 'page_id' => $page_id, 'is_published' => $is_published, 'mids' => implode(',', $mids), 'sm_post_id' => $sm_post_id, 'scheduled_timestamp' => $manual_datetime, 'scheduled_bubble' => $scheduled_bubble])->condition('uid', $uid, '=')->condition('id', $sid, '=')->execute();
                    } elseif ($status == 'Scheduled') {
                        if ($social_media_name == 'Facebook') {
                            //if post was already sheduled i.e re-sceduled, delete old post and create new post Facebook server.
                            if ($sm->status == 'Scheduled' && isset($sm->sm_post_id)) {
                                $this->fbPostOperation($sm->page_id, $sm->sm_post_id, 'delete');
                            }
                            $date = new DrupalDateTime(date('d-m-Y h:i A', $sm->scheduled_timestamp), new \DateTimeZone('utc'));
                            $date->setTimezone(new \DateTimeZone($user->getTimeZone()));
                            $user_timestamp = strtotime($date->format('Y-m-d H:i:s'));
                            $post_data['scheduled_publish_time'] = $user_timestamp;
                            $response = $this->facebook_post_publish($page_id, $post_data, $uid);
                            if (array_key_exists("id", $response)) {
                                $sm_post_id = $response['id'];
                            }
                        }
                        \Drupal::database()->update('social_media')->fields(['text' => $text, 'status' => $status, 'media_kit_id' => $media_kit_id, 'page_id' => $page_id, 'is_published' => $is_published, 'mids' => implode(',', $mids), 'sm_post_id' => $sm_post_id, 'scheduled_bubble' => $scheduled_bubble])->condition('uid', $uid, '=')->condition('id', $sid, '=')->execute();
                    } else {
                        if ($social_media_name == 'Facebook') {
                            if ($sm->status == 'Scheduled') {
                                $this->fbPostOperation($sm->page_id, $sm->sm_post_id, 'delete');
                            }
                        }
                        \Drupal::database()->update('social_media')->fields(['text' => $text, 'status' => $status, 'media_kit_id' => $media_kit_id, 'page_id' => $page_id, 'is_published' => $is_published, 'mids' => implode(',', $mids), 'sm_post_id' => $sm_post_id, 'scheduled_bubble' => $scheduled_bubble])->condition('uid', $uid, '=')->condition('id', $sid, '=')->execute();
                    }
                    $response['result'] = 1;
                }
            }
        } else {
            $response['result'] = "unauthorized user";
        }
        $json_response = json_encode($response);
        return new JsonResponse($json_response);
    }
    /**
     * function to get post by date, this week, this month.
     */
    public function get_social_media_post_by_date($network_id, $type, $page) {
        $user = \Drupal::currentUser();
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $terms_obj = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load((int)$network_id);
        if (isset($terms_obj->field_icon) && isset($terms_obj->field_icon->target_id)) {
            $social_media_name = $terms_obj->label();
            $network_icon_target = $terms_obj->field_icon->target_id;
            $file = \Drupal::entityTypeManager()->getStorage('file')->load($network_icon_target);
            $social_icon_path = file_create_url($file->getFileUri());
        }
        $social_media_name = $terms_obj->label();
        // get range of timestamp
        if ($type == 'today') {
            $date_start_user = new DrupalDateTime('today', new \DateTimeZone($user->getTimeZone()));
            $date_start_user->setTimezone(new \DateTimeZone('utc'));
            $start = strtotime($date_start_user->format('Y-m-d H:i:s'));
            $date_end_user = new DrupalDateTime('today + 24 hour', new \DateTimeZone($user->getTimeZone()));
            $date_end_user->setTimezone(new \DateTimeZone('utc'));
            $end = strtotime($date_end_user->format('Y-m-d H:i:s')) - 1;
        } elseif ($type == 'thisWeek') {
            $date_monday = new DrupalDateTime('monday', new \DateTimeZone($user->getTimeZone()));
            $date_monday->setTimezone(new \DateTimeZone('utc'));
            $monday_timestamp = strtotime($date_monday->format('Y-m-d H:i:s'));
            $date_today = new DrupalDateTime('today', new \DateTimeZone($user->getTimeZone()));
            $date_today->setTimezone(new \DateTimeZone('utc'));
            $today_timestamp = strtotime($date_today->format('Y-m-d H:i:s'));
            //check if today is monday
            if ($today_timestamp == $monday_timestamp) {
                $start = $monday_timestamp;
                $date_end_user = new DrupalDateTime('next monday', new \DateTimeZone($user->getTimeZone()));
                $date_end_user->setTimezone(new \DateTimeZone('utc'));
                $end = strtotime($date_end_user->format('Y-m-d H:i:s'));
            } else {
                $date_start_user = new DrupalDateTime('previous monday', new \DateTimeZone($user->getTimeZone()));
                $date_start_user->setTimezone(new \DateTimeZone('utc'));
                $start = strtotime($date_start_user->format('Y-m-d H:i:s'));
                $end = $monday_timestamp;
            }
        } elseif ($type == "thisMonth") {
            $date_start_user = new DrupalDateTime(date('Y-m-01 00:00:00'), new \DateTimeZone($user->getTimeZone()));
            $date_start_user->setTimezone(new \DateTimeZone('utc'));
            $start = strtotime($date_start_user->format('Y-m-d H:i:s'));
            $date_end_user = new DrupalDateTime('last day of this month', new \DateTimeZone($user->getTimeZone()));
            $date_end_user->setTimezone(new \DateTimeZone('utc'));
            $end = strtotime($date_end_user->format('Y-m-d H:i:s'));
        } else {
            $getdate = \Drupal::request()->get('date');
            $date_start_user = new DrupalDateTime($getdate, new \DateTimeZone($user->getTimeZone()));
            $date_start_user->setTimezone(new \DateTimeZone('utc'));
            $start = strtotime($date_start_user->format('Y-m-d H:i:s'));
            $date_end_user = new DrupalDateTime($getdate . '+ 24 hour', new \DateTimeZone($user->getTimeZone()));
            $date_end_user->setTimezone(new \DateTimeZone('utc'));
            $end = strtotime($date_end_user->format('Y-m-d H:i:s')) - 1;
        }
        $events = array();
        $query = \Drupal::database()->select('social_media', 'sm');
        if ((int)$network_id == 166 || (int)$network_id == 168) {
            // $Page_id = \Drupal::request()->get('pageID');
            $result = $query->fields('sm', array('id', 'status', 'social_media_name', 'text', 'is_published', 'scheduled_timestamp', 'mids'))->condition('sm.uid', $current_uid, '=')->condition('sm.social_media_name', $social_media_name, '=')->condition('sm.page_id', (int)$page, '=')->condition('sm.scheduled_timestamp', array($start, $end), 'BETWEEN')->orderBy('scheduled_timestamp', 'ASC')->execute()->fetchAll();
        } else {
            $result = $query->fields('sm', array('id', 'status', 'social_media_name', 'text', 'is_published', 'scheduled_timestamp', 'mids'))->condition('sm.uid', $current_uid, '=')->condition('sm.social_media_name', $social_media_name, '=')->condition('sm.scheduled_timestamp', array($start, $end), 'BETWEEN')->orderBy('scheduled_timestamp', 'ASC')->execute()->fetchAll();
        }
        if (!empty($result)) {
            foreach ($result as $row_object) {
                $postId = $row_object->id;
                $published = $row_object->is_published;
                $socialMediaName = $row_object->social_media_name;
                $postName = $row_object->text;
                $status = $row_object->status;
                $date = new DrupalDateTime(date('Y-m-d H:i:s', $row_object->scheduled_timestamp), new \DateTimeZone('utc'));
                $date->setTimezone(new \DateTimeZone($user->getTimeZone()));
                $manual_datetime = strtotime($date->format('Y-m-d H:i:s'));
                $date_index = $date->format('l, M d, Y');
                $date_format = $date->format('F d: h:ia');
                $date = new DrupalDateTime('now', new \DateTimeZone($user->getTimeZone()));
                $current_datetime = strtotime($date->format('Y-m-d H:i:s A'));
                if ($socialMediaName == 'Facebook' && $status == 'Scheduled' && $published == 0 && $current_datetime > $manual_datetime) {
                    $published = 1;
                    \Drupal::database()->update('social_media')->fields(['is_published' => $published])->condition('uid', $uid, '=')->condition('id', $postId, '=')->execute();
                }
                // get thumbnail from mids
                $thumbnail_data = $this->getPostsThumbnails(explode(',', $row_object->mids));
                // get social icon
                $social_icon = $social_icon_path;
                $events[$date_index][] = array("sid" => $postId, "title" => $postName, "socialMediaName" => $social_media_name, "social_icon" => $social_icon, "date_format" => $date_format, "timestamp" => $manual_datetime, "status" => $status, "is_published" => $published, "defaultthubnail" => $thumbnail_data['url_mid'], "thumnail_type" => $thumbnail_data['thumnail_type']);
            }
        }
        //return $events;
        // \Drupal::logger('Social media twitter')->error('<pre><code>' . print_r($events, TRUE) . '</code></pre>');
        if ($type == 'today') {
            return $events;
        } else {
            $data['calendar_list'] = $events;
            $twigFilePath = drupal_get_path('module', 'social_media') . '/templates/calendar-post-list.html.twig';
            $template = $this->twig->loadTemplate($twigFilePath);
            $markup = $template->render(array('data' => $data));
            $output['html'] = $markup;
            return new JsonResponse($output);
        }
    }
    /**
     * function to get social media Settings Tab,which fields value have to update .
     */
    public function getFieldsSocialMedia($social_media_id, $page_id = 'n/a') {
        //twitter
        if ($social_media_id == '174') {
            $response = $this->twitter_user_profile();
        }
        //facebook
        else if ($social_media_id == '166') {
            $response = $this->getFacebookPageInfo($page_id);
        } else {
        }
        $terms_obj = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($social_media_id);
        $fields = [];
        foreach ($terms_obj->get('field_fields_settings')->getValue() as $pid) {
            $p = \Drupal\paragraphs\Entity\Paragraph::load($pid['target_id']);
            $fields[$p->field_name->value]['enabled'] = $p->field_enable->value;
            $fields[$p->field_name->value]['type'] = $p->field_field_type->value;
            $fields[$p->field_name->value]['specifications'] = $p->field_field_specification->value;
            if ($p->field_field_type->value == 'Image') {
                $fields[$p->field_name->value]['media_preset'] = $p->field_media_preset_ref->target_id;
            } else if ($p->field_field_type->value == 'text') {
                $fields[$p->field_name->value]['char_limit'] = $p->field_limit_char->value;
            } else {
                $fields[$p->field_name->value]['char_limit'] = $p->field_limit_char->value;
            }
            //insert field value
            if ($social_media_id == '174') {
                if (strpos(strtolower($p->field_name->value), 'name') !== false) {
                    $fields[$p->field_name->value]['value'] = isset($response->name) ? $response->name : ' ';
                }
                if (strpos(strtolower($p->field_name->value), 'location') !== false) {
                    $fields[$p->field_name->value]['value'] = isset($response->location) ? $response->location : ' ';
                }
                if (strpos(strtolower($p->field_name->value), 'description') !== false || strpos(strtolower($p->field_name->value), 'bio') !== false) {
                    $fields[$p->field_name->value]['value'] = isset($response->description) ? $response->description : ' ';
                }
                if (strpos(strtolower($p->field_name->value), 'url') !== false) {
                    $fields[$p->field_name->value]['value'] = isset($response->entities->url->urls[0]->expanded_url) ? $response->entities->url->urls[0]->expanded_url : ' ';
                }
                if (strpos(strtolower($p->field_name->value), 'profile') !== false) {
                    $fields[$p->field_name->value]['value'] = isset($response->profile_image_url_https) ? $response->profile_image_url_https : ' ';
                }
                if (strpos(strtolower($p->field_name->value), 'banner') !== false) {
                    $fields[$p->field_name->value]['value'] = isset($response->profile_banner_url) ? $response->profile_banner_url : ' ';
                }
            }
            if ($social_media_id == '166') {
                // \Drupal::logger('facebook')->error('<pre><code>' . print_r($page_id, TRUE) . '</code></pre>');
                if (strpos(strtolower($p->field_name->value), 'about') !== false) {
                    $fields[$p->field_name->value]['value'] = isset($response['about']) ? $response['about'] : ' ';
                }
                if (strpos(strtolower($p->field_name->value), 'phone') !== false) {
                    $fields[$p->field_name->value]['value'] = isset($response['phone']) ? $response['phone'] : ' ';
                }
                if (strpos(strtolower($p->field_name->value), 'website') !== false) {
                    $fields[$p->field_name->value]['value'] = isset($response['website']) ? $response['website'] : ' ';
                }
                if (strpos(strtolower($p->field_name->value), 'description') !== false) {
                    $fields[$p->field_name->value]['value'] = isset($response['description']) ? $response['description'] : ' ';
                }
                if (strpos(strtolower($p->field_name->value), 'emails') !== false) {
                    $emailsAsString = ' ';
                    if (isset($response['emails'])) {
                        foreach ($response['emails'] as $key => $val) {
                            $emailsAsString.= $val . ',';
                        }
                    }
                    $fields[$p->field_name->value]['value'] = $emailsAsString;
                }
                if (strpos(strtolower($p->field_name->value), 'categories') !== false) {
                    $fields[$p->field_name->value]['value'] = $response['category_list'];
                }
                if (strpos(strtolower($p->field_name->value), 'banner') !== false || strpos(strtolower($p->field_name->value), 'cover') !== false) {
                    $fields[$p->field_name->value]['value'] = $response['cover']['source'];
                }
                if (strpos(strtolower($p->field_name->value), 'profile') !== false || strpos(strtolower($p->field_name->value), 'picture') !== false) {
                    $fields[$p->field_name->value]['value'] = $response['picture']['data']['url'];
                }
            }
        }
        //\Drupal::logger('facebook')->error('<pre><code>' . print_r($fields, true) . '</code></pre>');
        return $fields;
    }
    /**
     * function to get available feature (modified clean code).
     */
    public function getAvailableFeatureModified($social_nedia_obj) {
        //\Drupal::logger('facebook')->error('<pre><code>' . print_r(\Drupal::service('social_media.social_media_controller')->getAvailableFeatures($social_nedia_obj)->getContent(), true) . '</code></pre>');
        $decoded = Json::decode(\Drupal::service('social_media.social_media_controller')->getAvailableFeatures($social_nedia_obj)->getContent());
        $available_features = [];
        $active_tab = 0;
        foreach ($decoded['dataValue'] as $nid => $nvalue) {
            if (strpos(strtolower($nvalue['name']), 'edit') !== false) {
                $available_features['myPost'] = $nvalue['enabled'];
                if ($nvalue['enabled']) {
                    if (!$active_tab) {
                        $active_tab = 1;
                        $available_features['activeTab'] = 'myPost';
                    }
                }
            } elseif (strpos(strtolower($nvalue['name']), 'create') !== false) {
                $available_features['newPost'] = $nvalue['enabled'];
                if ($nvalue['enabled']) {
                    if (!$active_tab) {
                        $active_tab = 1;
                        $available_features['activeTab'] = 'newPost';
                    }
                }
            } elseif (strpos(strtolower($nvalue['name']), 'calendar') !== false) {
                $available_features['calendar'] = $nvalue['enabled'];
                if ($nvalue['enabled']) {
                    if (!$active_tab) {
                        $active_tab = 1;
                        $available_features['activeTab'] = 'calendar';
                    }
                }
            } elseif (strpos(strtolower($nvalue['name']), 'engagement') !== false) {
                $available_features['engagement'] = $nvalue['enabled'];
                if ($nvalue['enabled']) {
                    if (!$active_tab) {
                        $active_tab = 1;
                        $available_features['activeTab'] = 'engagement';
                    }
                }
            } elseif (strpos(strtolower($nvalue['name']), 'ads') !== false) {
                $available_features['ads'] = $nvalue['enabled'];
                if ($nvalue['enabled']) {
                    if (!$active_tab) {
                        $active_tab = 1;
                        $available_features['activeTab'] = 'ads';
                    }
                }
            } elseif (strpos(strtolower($nvalue['name']), 'reports') !== false) {
                $available_features['reports'] = $nvalue['enabled'];
                if ($nvalue['enabled']) {
                    if (!$active_tab) {
                        $active_tab = 1;
                        $available_features['activeTab'] = 'reports';
                    }
                }
            } elseif (strpos(strtolower($nvalue['name']), 'settings') !== false) {
                $available_features['settings'] = $nvalue['enabled'];
                if ($nvalue['enabled']) {
                    if (!$active_tab) {
                        $active_tab = 1;
                        $available_features['activeTab'] = 'settings';
                    }
                }
            }
        }
        return $available_features;
    }
    /**
     * function to get available feature.
     */
    public function getAvailableFeatures($social_nedia_id) {
        $social_tabs_name = [];
        $social_tabs_data = [];
        $terms_obj = $social_nedia_id;
        //$terms_obj = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($social_nedia_id);
        if ($terms_obj->vid->target_id == "social_media_networks") {
            $enabled_tabs = $terms_obj->get('field_social_network_tabs')->getValue();
            $social_tabs_name['knowledge_base_url'] = $terms_obj->get('field_knowledge_base_path')->getValue() [0];
            $social_tabs = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree('social_media_manager_tabs');
            foreach ($social_tabs as $tab) {
                $social_tabs_data[$tab->tid]['name'] = $tab->name;
                if ($this->whatever($enabled_tabs, 'target_id', $tab->tid)) {
                    $social_tabs_data[$tab->tid]['enabled'] = 1;
                } else {
                    $social_tabs_data[$tab->tid]['enabled'] = 0;
                }
            }
            $social_tabs_name['dataValue'] = $social_tabs_data;
        } else {
            $social_tabs_name[] = "You are trying to access unauthorised terms";
        }
        return new JsonResponse($social_tabs_name);
    }
    /**
     * function to get media url from mid.
     */
    public function getMediaUrl($mid) {
        $image_preset_tid = \Drupal::request()->get('image_preset_tid');
        $output = [];
        $media = Media::load($mid);
        if (is_object($media)) {
            if ($media->hasField('field_media_image')) {
                $targetid = $media->field_media_image->target_id;
                $file = File::load($targetid);
                $output['url_mid'] = file_create_url($file->getFileUri());
                $output['media_preset'] = $this->getMediaPresetProperties($image_preset_tid);
            }
        } else {
            // if media id ="default"
            $output['media_preset'] = $this->getMediaPresetProperties($image_preset_tid);
        }
        return new JsonResponse($output);
    }
    /**
     * function to get media preset from Vocabulary.
     */
    public function getMediaPreset($type) {
        $mediaPreset = [];
        $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree('image_preset');
        foreach ($terms as $term_obj) {
            $terms_obj_full = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($term_obj->tid);
            $asstes =  $terms_obj_full->get('field_asset_editors')->getValue();
          if($this->whatever($asstes, 'value', strtolower($type))){
             $presetData['tid'] = $term_obj->tid;
             $presetData['name'] = $term_obj->name;
             $mediaPreset[] = $presetData;
             //ksm($mediaPreset);
          }

        }
        return new JsonResponse($mediaPreset);
    }
    public function whatever($array, $key, $val) {
        foreach ($array as $item) if (isset($item[$key]) && $item[$key] == $val) return true;
        return false;
    }
    public function getMediaPresetProperties($tid) {
        $terms_obj = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($tid);
        $properties['preset_name'] = $terms_obj->name->value;
        $properties['image_format'] = $terms_obj->field_image_format->value;
        $properties['video_limit'] = $terms_obj->field_video_time_limit->value;

        $field_unit_of_measurement = $terms_obj->field_unit_of_measurement->value;
        if ($field_unit_of_measurement == "pixels") {
            //dimensions are already in Pixels
            $properties['height'] = $terms_obj->field_y_height->value;
            $properties['width'] = $terms_obj->field_x_width->value;
        } else if ($field_unit_of_measurement == "inches") {
            // need to convert dimensions into Pixels
            $properties['height'] = ($terms_obj->field_y_height->value) * 96;
            $properties['width'] = ($terms_obj->field_x_width->value) * 96;
        } else if ($field_unit_of_measurement == "centimeters") {
            // need to convert dimensions into Pixels
            $properties['height'] = ($terms_obj->field_y_height->value) * 37.795275591;
            $properties['width'] = ($terms_obj->field_x_width->value) * 37.795275591;
        } else if ($field_unit_of_measurement == "millimeter") {
            // need to convert dimensions into Pixels
            $properties['height'] = ($terms_obj->field_y_height->value) * 3.7795275591;
            $properties['width'] = ($terms_obj->field_x_width->value) * 3.77952755911;
        } else if ($field_unit_of_measurement == "picas") {
            // need to convert dimensions into Pixels
            $properties['height'] = ($terms_obj->field_y_height->value) * 16;
            $properties['width'] = ($terms_obj->field_x_width->value) * 16;
        } else if ($field_unit_of_measurement == "points") {
            // need to convert dimensions into Pixels
            $properties['height'] = ($terms_obj->field_y_height->value) * 1.3333333333333333;
            $properties['width'] = ($terms_obj->field_x_width->value) * 1.3333333333333333;
        } else {
            // need to convert dimensions into Pixels
            // considered pixel as default
            $properties['height'] = ($terms_obj->field_y_height->value);
            $properties['width'] = ($terms_obj->field_x_width->value);
        }
        return $properties;
    }
    /**
     * function to convert time as ago such as two months ago, two months, two week ago.
     */
    public function time_elapsed_string($datetime, $full = false) {
        $now = date_create();
        $ago = date_create($datetime);
        $date_differ = date_diff($now, $ago);
        $date_differ->w = floor($date_differ->d / 7);
        $date_differ->d-= $date_differ->w * 7;
        $string = array('y' => 'y', 'm' => 'm', 'w' => 'w', 'd' => 'd', 'h' => 'h', 'i' => 'm', 's' => 's',);
        foreach ($string as $k => & $v) {
            if ($date_differ->$k) {
                $v = $date_differ->$k . ' ' . $v;
            } else {
                unset($string[$k]);
            }
        }
        if (!$full) $string = array_slice($string, 0, 1);
        return $string ? implode(', ', $string) . '' : 'just now';
    }
    public function test_exception() {
        $facebookHelper = new FacebookHelperFunction();
        $fb = $facebookHelper->getFBObject();
        $fb_page_id = 113360320346378;
        try {
            $response = $fb->get('/' . $fb_page_id . '/feed?fields=message&limit=5', $page_access_token);
        }
        catch(\Facebook\Exceptions\FacebookResponseException $e) {
            $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'custom_type' => 'Facebook Error Reported',));
            return new JsonResponse($output);
            exit;
        }
        catch(\Facebook\Exceptions\FacebookSDKException $e) {
            $output = array('error' => array('msg' => $e->getMessage(), 'code' => $e->getCode(), 'type' => 'Facebook SDK Exception', 'custom_type' => 'Facebook Error Reported',));
            return new JsonResponse($output);
            exit;
        }
        $output = ['new'];
        return new JsonResponse($output);
    }
    /**
     * function to chnage tweet text.
     */
    public function json_tweet_text_to_HTML($tweet, $links = true, $users = true, $hashtags = true) {
        $return = $tweet->full_text;
        $entities = array();
        if ($links && is_array($tweet->entities->urls)) {
            foreach ($tweet->entities->urls as $e) {
                $temp["start"] = $e->indices[0];
                $temp["end"] = $e->indices[1];
                $temp["replacement"] = "<a class='tweet-url' href='" . $e->expanded_url . "' target='_blank'>" . $e->display_url . "</a>";
                $entities[] = $temp;
            }
        }
        if ($users && is_array($tweet->entities->user_mentions)) {
            foreach ($tweet->entities->user_mentions as $e) {
                $temp["start"] = $e->indices[0];
                $temp["end"] = $e->indices[1];
                $temp["replacement"] = "<a href='https://twitter.com/" . $e->screen_name . "' target='_blank'>@" . $e->screen_name . "</a>";
                //$temp["replacement"] = " ";
                $entities[] = $temp;
            }
        }
        if ($hashtags && is_array($tweet->entities->hashtags)) {
            foreach ($tweet->entities->hashtags as $e) {
                $temp["start"] = $e->indices[0];
                $temp["end"] = $e->indices[1];
                $temp["replacement"] = "<a href='https://twitter.com/hashtag/" . $e->text . "?src=hash' target='_blank'>#" . $e->text . "</a>";
                $entities[] = $temp;
            }
        }
        usort($entities, function ($a, $b) {
            return ($b["start"] - $a["start"]);
        });
        foreach ($entities as $item) {
            $return = substr_replace($return, $item["replacement"], $item["start"], $item["end"] - $item["start"]);
        }
        return ($return);
    }
}
