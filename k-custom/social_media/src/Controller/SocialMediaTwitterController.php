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
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Template\TwigEnvironment;
use Drupal\Core\Datetime\DrupalDateTime;
use Abraham\TwitterOAuth\TwitterOAuth;
/**
 * Defines SocialMediaTwitterController class.
 */
class SocialMediaTwitterController extends ControllerBase implements ContainerInjectionInterface {
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
    /**
     * Callback to add/remove likes pwe tweet.
     */
    public function twitter_tweet_favourites($action, $tweet_id) {
        if ($action == 'create' || $action == 'destroy') {
            //$current_uid = \Drupal::currentUser()->id();
            $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
            $TwitterHelper = new TwitterHelperFunction();
            $properties = ['token_access'];
            $response_token = \Drupal::service('social_media.social_media_controller')->getKabbodeNetworkStatusProperty(174, $current_uid, $properties);
            $connection = new TwitterOAuth($TwitterHelper->getTwitterApiKey(), $TwitterHelper->getTwitterSecretKey(), $response_token['token_access']->oauth_token, $response_token['token_access']->oauth_token_secret);
                $parameters = ['id' => $tweet_id];
                $response_from_twitter = $connection->post('favorites/' . $action, $parameters);
                if (isset($response_from_twitter->errors) || isset($response_from_twitter->error)) {
                    if($response_from_twitter->errors){
                       $output = array('error' => array('msg' => $response_from_twitter->errors['0']->message, 'code' => $response_from_twitter->errors['0']->code, 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                       echo json_encode($output);
                       exit;                
                    }
                    else if($response_from_twitter->error){
                      $output = array('error' => array('msg' => $response_from_twitter->error, 'code' => '', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                      echo json_encode($output);
                      exit;                
                    }
                } else {
                    if ($action == 'create') {
                        $output = array('response' => array('msg' => 'favourites added on tweet Id: ' . $tweet_id, 'code' => '200', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                    } else {
                        $output = array('response' => array('msg' => 'favourites removed from tweet Id: ' . $tweet_id, 'code' => '200', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                       
                    }
                }
           // }
        } else {
          $output = array('error' => array('msg' => 'in valid Action', 'code' => '0', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
          echo json_encode($output);
          exit;              
           
        }
        $json_response = json_encode($output);
        return new JsonResponse($json_response);
    }
    /**
     * Callback to retweet/unretweet/destroy the tweet.
     */
    public function twitter_retweet($action, $tweet_id) {
        if ($action == 'retweet' || $action == 'unretweet' || $action == 'destroy') {
            //$current_uid = \Drupal::currentUser()->id();
            $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
            $TwitterHelper = new TwitterHelperFunction();
            $properties = ['token_access'];
            $response_token = \Drupal::service('social_media.social_media_controller')->getKabbodeNetworkStatusProperty(174, $current_uid, $properties);
            $connection = new TwitterOAuth($TwitterHelper->getTwitterApiKey(), $TwitterHelper->getTwitterSecretKey(), $response_token['token_access']->oauth_token, $response_token['token_access']->oauth_token_secret);

                $parameters = ['id' => $tweet_id];
                $response_from_twitter = $connection->post('statuses/' . $action, $parameters);
                if (isset($response_from_twitter->errors) || isset($response_from_twitter->error)) {
                    if($response_from_twitter->errors){
                       $output = array('error' => array('msg' => $response_from_twitter->errors['0']->message, 'code' => $response_from_twitter->errors['0']->code, 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                       echo json_encode($output);
                       exit;                
                    }
                    else if($response_from_twitter->error){
                      $output = array('error' => array('msg' => $response_from_twitter->error, 'code' => '', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                      echo json_encode($output);
                      exit;                
                    }
                } else {
                    if ($action == 'retweet') {
                        $output = array('response' => array('msg' => 'You have retweeted successfully.', 'code' => '200', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                    } elseif ($action == 'unretweet') {
                        $output = array('response' => array('msg' => 'You have undo retweeted successfully. ', 'code' => '200', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                    } else {
                        $output = array('response' => array('msg' => 'You have deleted this tweet successfully.', 'code' => '200', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                    }

                }
           // }
        } else {
            $output = array('error' => array('msg' => 'in valid Action', 'code' => '0', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
            echo json_encode($output);
            exit; 
        }

        $json_response = json_encode($output);
        return new JsonResponse($json_response);
    }
    /**
     * Callback to retweet with comment.
     */
    public function twitter_retweet_with_comment() {
        $data = [];
        $attached_url = \Drupal::request()->get('attached');
        $comment = \Drupal::request()->get('comment');
        //$current_uid = \Drupal::currentUser()->id();
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $TwitterHelper = new TwitterHelperFunction();
        $properties = ['token_access'];
        $response_token = \Drupal::service('social_media.social_media_controller')->getKabbodeNetworkStatusProperty(174, $current_uid, $properties);
        $connection = new TwitterOAuth($TwitterHelper->getTwitterApiKey(), $TwitterHelper->getTwitterSecretKey(), $response_token['token_access']->oauth_token, $response_token['token_access']->oauth_token_secret);

            $parameters['status'] = $comment;
            $parameters['attachment_url'] = $attached_url;
            $parameters['tweet_mode'] = 'extended';
            $response_from_twitter = $connection->post('statuses/update', $parameters);
            if (isset($response_from_twitter->errors) || isset($response_from_twitter->errors) ) {
                if($response_from_twitter->errors){
                   $output = array('error' => array('msg' => $response_from_twitter->errors['0']->message, 'code' => $response_from_twitter->errors['0']->code, 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                   echo json_encode($output);
                   exit;                
                }
                else if($response_from_twitter->error){
                  $output = array('error' => array('msg' => $response_from_twitter->error, 'code' => '', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                  echo json_encode($output);
                  exit;                
                }
            } else {
                $response_from_twitter->full_text = \Drupal::service('social_media.social_media_controller')->json_tweet_text_to_HTML($response_from_twitter, $links = true, $users = true, $hashtags = true);
                if ($response_from_twitter->retweeted) {
                    // ksm($tweet->retweeted_status);
                    if (isset($response_from_twitter->retweeted_status) && is_object($response_from_twitter->retweeted_status)) {
                        $response_from_twitter->retweeted_status->full_text = \Drupal::service('social_media.social_media_controller')->json_tweet_text_to_HTML($response_from_twitter->retweeted_status, $links = true, $users = true, $hashtags = true);
                    }
                }
                $data['tweets'][0] = $response_from_twitter;
                if(isset($_GET['team'])){
                  $data['team_query']['gid'] = $_GET['team'];
                  $data['team_query']['muid'] = $_GET['muid'];
                }
            }
        $twigFilePath = drupal_get_path('module', 'social_media') . '/templates/twitter/twitter-tweet.html.twig';
        $template = $this->twig->loadTemplate($twigFilePath);
        $markup = $template->render(array('data' => $data));
        $output = array('response' => array('data' =>$markup ,'msg' => 'retweeted with comment', 'code' => '200', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
        $json_response = json_encode($output);
        return new JsonResponse($json_response);
    }
    /**
     * Callback to get latest tweet with pagination.
     */
    public function get_latest_tweet($max_id) {
        //$current_uid = \Drupal::currentUser()->id();
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $properties = ['token_access'];
        $response_token = \Drupal::service('social_media.social_media_controller')->getKabbodeNetworkStatusProperty(174, $current_uid, $properties);
        $TwitterHelper = new TwitterHelperFunction();
        $connection = new TwitterOAuth($TwitterHelper->getTwitterApiKey(), $TwitterHelper->getTwitterSecretKey(), $response_token['token_access']->oauth_token, $response_token['token_access']->oauth_token_secret);

            $parameters = ['count' => 10, 'include_rts' => 1, 'tweet_mode' => 'extended', 'max_id' => $max_id, 'exclude_replies' => 1];
            $get_tweet = $connection->get('statuses/user_timeline', $parameters);
              if (isset($get_tweet->errors) || isset($get_tweet->errors) ) {
                if($response_from_twitter->errors){
                   $output = array('error' => array('msg' => $get_tweet->errors['0']->message, 'code' => $get_tweet->errors['0']->code, 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                   echo json_encode($output);
                   exit;                
                }
                else if($get_tweet->error){
                  $output = array('error' => array('msg' => $get_tweet->error, 'code' => '', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                  echo json_encode($output);
                  exit;                
                }
            } else {
            //modified twitter text
            foreach ($get_tweet as $key => $tweet) {
                $tweet->full_text = \Drupal::service('social_media.social_media_controller')->json_tweet_text_to_HTML($tweet, $links = true, $users = true, $hashtags = true);
                if ($tweet->retweeted) {
                    // ksm($tweet->retweeted_status);
                    if (isset($tweet->retweeted_status) && is_object($tweet->retweeted_status)) {
                        $tweet->retweeted_status->full_text = \Drupal::service('social_media.social_media_controller')->json_tweet_text_to_HTML($tweet->retweeted_status, $links = true, $users = true, $hashtags = true);
                        //ksm($tweet->retweeted_status->full_text);
                    }
                }
            }
            }
            $last_trace_tweet = end($get_tweet)->id - 1;
            $data['tweets'] = $get_tweet;
            $data['user_profile'] = \Drupal::service('social_media.social_media_controller')->twitter_user_profile();
            if(isset($_GET['team'])){
              $data['team_query']['gid'] = $_GET['team'];
              $data['team_query']['muid'] = $_GET['muid'];
            }
            $response['last_tweet'] = strval($last_trace_tweet);
            $response['last_trace_tweet'] = strval($last_trace_tweet);
            $twigFilePath = drupal_get_path('module', 'social_media') . '/templates/twitter/twitter-tweet.html.twig';
            $template = $this->twig->loadTemplate($twigFilePath);
            $response['markup'] = $template->render(array('data' => $data));
         $output = array('response' => array('data' =>$response ,'msg' => 'load more tweet', 'code' => '200', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
         $json_response = json_encode($output); 
        return new JsonResponse($json_response);
    }
    /**
     * Callback to send tweet via dm.
     */
    public function send_tweet_via_DM() {
        $attached_url = \Drupal::request()->get('attached');
        $comment = \Drupal::request()->get('comment');
        $user_ids = \Drupal::request()->get('user_ids');
        //$current_uid = \Drupal::currentUser()->id();
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $TwitterHelper = new TwitterHelperFunction();
        $properties = ['token_access'];
        $response_token = \Drupal::service('social_media.social_media_controller')->getKabbodeNetworkStatusProperty(174, $current_uid, $properties);
        $connection = new TwitterOAuth($TwitterHelper->getTwitterApiKey(), $TwitterHelper->getTwitterSecretKey(), $response_token['token_access']->oauth_token, $response_token['token_access']->oauth_token_secret);
        $error = 0;
            foreach ($user_ids as $key) {
                $data = ['event' => ['type' => 'message_create', 'message_create' => ['target' => ['recipient_id' => $key], 'message_data' => ['text' => $attached_url]]]];
                $result = $connection->post('direct_messages/events/new', $data, true); // Note the true
                if (isset($result->errors) || isset($result->error) ) {
                if($result->errors){
                    $error = 1;                    
                    $response[$key]['message'] = 'Tweet can not be sent to this user ' . $key;
                }
                else if($result->error){
                  $output = array('error' => array('msg' => $get_tweet->error, 'code' => '', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                  echo json_encode($output);
                  exit;                
                }
                } else {
                    $response[$key]['code'] = 200;
                    $response[$key]['message'] = 'Tweet has been sent to user ' . $key;
                    
                    //\Drupal::logger('Social Media Twitter')->notice('<pre><code>' . print_r($response, TRUE) . '</code></pre>');
                }
            }
        $output['response'] = $response;
        $json_response = json_encode($output); 
        return new JsonResponse($json_response);
    }
    /**
     * Callback to search twitter user.
     */
    public function search_twitter_users($key) {
        //$current_uid = \Drupal::currentUser()->id();
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $properties = ['token_access'];
        $response = \Drupal::service('social_media.social_media_controller')->getKabbodeNetworkStatusProperty(174, $current_uid, $properties);
        $TwitterHelper = new TwitterHelperFunction();
        $connection = new TwitterOAuth($TwitterHelper->getTwitterApiKey(), $TwitterHelper->getTwitterSecretKey(), $response['token_access']->oauth_token, $response['token_access']->oauth_token_secret);

            $data = ['include_entities' => false, 'q' => $key];
            $result = $connection->get('users/search', $data, true); // Note the true
            $mode = \Drupal::request()->get('mode');
            $purpose = \Drupal::request()->get('purpose');
            if (isset($mode) && $purpose == 'user_mentions') {
                $output = $result;
                return new JsonResponse($output);
            } else {
                $twigFilePath = drupal_get_path('module', 'social_media') . '/templates/twitter/twitter-search-user.twig';
                $template = $this->twig->loadTemplate($twigFilePath);
                $markup = $template->render(array('result' => $result));
                $output = array('response' => array('data' =>$markup ,'msg' => 'search tweet user', 'code' => '200', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
            }
       // }
       //\Drupal::logger('Social Media Twitter')->notice('<pre><code>' . print_r($output, TRUE) . '</code></pre>');
        $json_response = json_encode($output); 
        return new JsonResponse($json_response);
    }
    /**
     * Callback to follow/unfollow users.
     */
    public function twitter_follow_unfollow_users($action, $target_user_id) {
        //$current_uid = \Drupal::currentUser()->id();
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $properties = ['token_access'];
        $response = \Drupal::service('social_media.social_media_controller')->getKabbodeNetworkStatusProperty(174, $current_uid, $properties);
        $TwitterHelper = new TwitterHelperFunction();
        $connection = new TwitterOAuth($TwitterHelper->getTwitterApiKey(), $TwitterHelper->getTwitterSecretKey(), $response['token_access']->oauth_token, $response['token_access']->oauth_token_secret);
        $data = ['user_id' => $target_user_id, 'follow' => true];
        $result = $connection->post('friendships/' . $action, $data); // Note the true
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
         
        } else {

            if ($action == "create") {
                 $output = array('response' => array('msg' => 'destroy', 'code' => '200', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
            } else {
                $output = array('response' => array('msg' => 'follow', 'code' => '200', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                
            }
            
          
        }
        $json_response = json_encode($output);
        return new JsonResponse($json_response);
    }
    /**
     * Callback to comments/replies against tweet.
     */
    public function twitter_comments_replies($tweet_id) {
        //$current_uid = \Drupal::currentUser()->id();
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $properties = ['token_access'];
        $response_token = \Drupal::service('social_media.social_media_controller')->getKabbodeNetworkStatusProperty(174, $current_uid, $properties);
        $TwitterHelper = new TwitterHelperFunction();
        $connection = new TwitterOAuth($TwitterHelper->getTwitterApiKey(), $TwitterHelper->getTwitterSecretKey(), $response_token['token_access']->oauth_token, $response_token['token_access']->oauth_token_secret);

            $comment = \Drupal::request()->get('comment');
            $parameters = ['status' => $comment, 'in_reply_to_status_id' => $tweet_id, 'auto_populate_reply_metadata' => 1];
            $response_server = $connection->post('statuses/update', $parameters);
            if (isset($response_server->errors) || isset($response_server->errors)) {
                 if($response_server->errors){
                   $output = array('error' => array('msg' => $response_server->errors['0']->message, 'code' => $response_server->errors['0']->code, 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                   echo json_encode($output);
                   exit;                
                }
                else if($response_server->error){
                  $output = array('error' => array('msg' => $response_server->error, 'code' => '', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                  echo json_encode($output);
                  exit;                
                }
               
            } else {
                $output = array('response' => array('msg' => 'Your comment has been added successfully.', 'code' => '200', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                
            }
       $json_response = json_encode($output);
        return new JsonResponse($json_response);
    }
    /**
     * Callback to update twitter profile.
     */
    public function twitter_update_profile() {
        $uid = \Drupal::request()->get('uid');
        //$current_uid = \Drupal::currentUser()->id();
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $properties = ['token_access'];
        $response_token = \Drupal::service('social_media.social_media_controller')->getKabbodeNetworkStatusProperty(174, $current_uid, $properties);
        $TwitterHelper = new TwitterHelperFunction();
        $connection = new TwitterOAuth($TwitterHelper->getTwitterApiKey(), $TwitterHelper->getTwitterSecretKey(), $response_token['token_access']->oauth_token, $response_token['token_access']->oauth_token_secret);
        $update = \Drupal::request()->get('update');
        if ($update == "false") {
            $output['code'] = 200;
            $output['message'] = "Cancel to update profile";
            $verify_account = $connection->get('account/verify_credentials');
            $output['content']['name'] = $verify_account->name;
            $output['content']['description'] = $verify_account->description;
            $output['content']['website'] = $verify_account->entities->url->urls['0']->expanded_url;
            $output['content']['location'] = $verify_account->location;
            return new JsonResponse($output);
        }
        $updateData = \Drupal::request()->get('UpdateData');
        //\Drupal::logger('Social Media Twitter')->error('<pre><code>' . print_r($updateData, TRUE) . '</code></pre>');
        foreach ($updateData as $fieldName => $fieldValue) {
            if (strpos(strtolower($fieldName), 'name') !== false) {
                $parameters['name'] = $fieldValue;
            }
            if (strpos(strtolower($fieldName), 'url') !== false) {
                $parameters['url'] = $fieldValue;
            }
            if (strpos(strtolower($fieldName), 'location') !== false) {
                $parameters['location'] = $fieldValue;
            }
            if (strpos(strtolower($fieldName), 'description') !== false || strpos(strtolower($fieldName), 'bio') !== false) {
                $parameters['description'] = $fieldValue;
            }
        }
        // $parameters = ['name'=>$name,'url'=>$website, 'location' => $location, 'description'=>$description];
        //\Drupal::logger('Social Media Twitter')->error('<pre><code>' . print_r($parameters, TRUE) . '</code></pre>');
        $get_response = $connection->post('account/update_profile', $parameters);
        // \Drupal::logger('Social Media Twitter')->error('<pre><code>' . print_r($get_response, TRUE) . '</code></pre>');
        if (isset($get_response->errors)) {
            $severity = 'error';
            $output['code'] = $get_response->errors[0]->code;
            $output['message'] = $get_response->errors[0]->message;
            $verify_account = $connection->get('account/verify_credentials');
            $output['content']['name'] = $verify_account->name;
            $output['content']['description'] = $verify_account->description;
            $output['content']['website'] = $verify_account->entities->url->urls['0']->expanded_url;
            $output['content']['location'] = $verify_account->location;
        } else {
            //  $severity = 'error';
            $output['code'] = 200;
            $output['message'] = 'Profile updated successfully.';
            $output['content']['name'] = $get_response->name;
            $output['content']['description'] = $get_response->description;
            $output['content']['website'] = $get_response->entities->url->urls['0']->expanded_url;
            $output['content']['location'] = $get_response->location;
        }
        return new JsonResponse($output);
    }
    /**
     * Callback to upload profile image/banner.
     */
    public function twitter_profile_image_upload() {
        $uid = \Drupal::request()->get('uid');
        //$current_uid = \Drupal::currentUser()->id();
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $properties = ['token_access'];
        $response_token = \Drupal::service('social_media.social_media_controller')->getKabbodeNetworkStatusProperty(174, $current_uid, $properties);
        $TwitterHelper = new TwitterHelperFunction();
        $connection = new TwitterOAuth($TwitterHelper->getTwitterApiKey(), $TwitterHelper->getTwitterSecretKey(), $response_token['token_access']->oauth_token, $response_token['token_access']->oauth_token_secret);
        $base64_string = \Drupal::request()->get('base64_string');
        $data = explode(',', $base64_string);
        $imageData = $data[1];
        $imageProfileType = \Drupal::request()->get('imageProfileType');
        if ($imageProfileType == 'update_profile_banner') {
            $type_profile = 'Profile Banner';
            $parameters = ['banner' => $imageData];
        } else {
            $type_profile = 'Profile Image';
            $parameters = ['image' => $imageData];
        }
        $get_response = $connection->post('account/' . $imageProfileType, $parameters);
       // \Drupal::logger('Social Media Twitter')->error(' image update <pre><code>' . print_r($get_response, TRUE) . '</code></pre>');
        if (isset($get_response->errors) || isset($get_response->error)) {
            if($get_response->errors){
                   $output = array('error' => array('msg' => $get_response->errors['0']->message, 'code' => $get_response->errors['0']->code, 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
                   echo json_encode($output);
                   exit;                
            }
            else if($get_response->error){
              $output = array('error' => array('msg' => $get_response->error, 'code' => '', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
              echo json_encode($output);
              exit;                
            }

        } else {
            $output = array('response' => array('msg' => $type_profile . ' updated successfully.', 'code' => '200', 'type' => 'Twitter Error Reported','custom_type' => 'Twitter Error Reported',));
        }
        $json_response = json_encode($output);
        return new JsonResponse($json_response);
    }
}
