<?php
/**
 * @file
 * Contains \Drupal\social_media\Controller\SocialMediaInstagramController.php
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

use Andreyco\Instagram\Exception\AuthException;
use Andreyco\Instagram\Exception\CurlException;
use Andreyco\Instagram\Exception\InvalidParameterException;
use Andreyco\Instagram\Exception\PaginationException;
/**
 * Defines SocialMediaInstagramController class.
 */
class SocialMediaInstagramController extends ControllerBase implements ContainerInjectionInterface {
    /**
     * @var Drupal\Core\Template\TwigEnvironment
     */
    protected $twig;
    public function __construct(TwigEnvironment $twig) {
        $this->twig = $twig;
    }

    /**
     * callback to update instagram page info .
     */
    public function instagramPageInfoUpdate($stPageId) {
        $update = \Drupal::request()->get('update');
        if ($update == 'false') {
            // don't need to update
            $response = $this->getInstagramPageInfo($fbPageId);
            return new JsonResponse($response);
        } else {
            // need to update
            $updateData = \Drupal::request()->get('updateData');
            $modifiedUpdateData = [];
            foreach ($updateData as $field_name => $fieldValue) {
                
                if (strpos(strtolower($field_name), 'phone') !== false && isset($fieldValue)) {
                    $modifiedUpdateData['phone'] = isset($fieldValue) ? $fieldValue : ' ';
                }
                
            }
            $response = $this->updateInstagramPageInfo($igPageId, $modifiedUpdateData);
            return new JsonResponse($response);
        }
        \Drupal::logger('instagram save')->error('<pre><code>' . print_r($update, TRUE) . '</code></pre>');
    }

    /**
     * Callback to get all instagram pages categories available .
     */
    public function getInstagramPageInfo($page_id) {
        //$current_uid = \Drupal::currentUser()->id();
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $instagramHelper = new InstagramHelperFunction();
        $properties = ['token_access', 'id', 'status'];
        $network_properties = $this->getKabbodeNetworkStatusProperty(168, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        $validToken = $instagramHelper->getIGTokenProperty($access_token, 'is_valid');
        if ($validToken) {
            $access_token_val = $access_token->getValue();
            //get page access tken with user access token
            $page_access_token = $instagramHelper->getIGPageAccessToken($page_id, $access_token_val);
            $output = $instagramHelper->getIGPageInfo($page_id, $page_access_token);
            return $output;
        }
        
    }

    /**
     * Callback to get all instagram pages categories available .
     */
    public function updateInstagramPageInfo($page_id) {
        //$current_uid = \Drupal::currentUser()->id();
        $current_uid = isset($_GET['team']) ? $_GET['muid'] : \Drupal::currentUser()->id();
        $instagramHelper = new InstagramHelperFunction();
        $properties = ['token_access', 'id', 'status'];
        $network_properties = $this->getKabbodeNetworkStatusProperty(168, $current_uid, $properties);
        $access_token = $network_properties['token_access'];
        $validToken = $instagramHelper->getIGTokenProperty($access_token, 'is_valid');
        if ($validToken) {
            $access_token_val = $access_token->getValue();
            //get page access tken with user access token
            $page_access_token = $instagramHelper->getIGPageAccessToken($page_id, $access_token_val);
            $output = $instagramHelper->updateIGPageInfo($page_id, $page_access_token, $parameter);
            return $output;
        }
        
    }
    
}
