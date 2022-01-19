<?php
namespace Drupal\social_media\Controller;
Class TwitterHelperFunction {
    private $twitterApiKey;
    private $twitterSecretKey;
    private $userAccessToken;
    private $userAccessSecretToken;
    public function __construct() {
        $config = \Drupal::config('social_media.api_settings')->get();
        $this->twitterApiKey = $config['twitter_app_id'];
        $this->twitterSecretKey = $config['twitter_app_secret'];
    }
    public function getTwitterApiKey() {
        return $this->twitterApiKey;
    }
    public function getTwitterSecretKey() {
        return $this->twitterSecretKey;
    }
}
