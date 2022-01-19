<?php

namespace Drupal\social_media\Form;

use Drupal\Core\Form\ConfigFormBase;  
use Drupal\Core\Form\FormStateInterface;  

/**
 *  Defines a form that configure Social Media API Settings.
 */
class ApiSettingsForm extends ConfigFormBase {
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'api_settings_form';
  }
  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'social_media.api_settings',
    ];
  }
  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = \Drupal::config('social_media.api_settings')->get();
    
    //facebook
    $form['facebook'] = [
      '#type' => 'details',
      '#title' => $this->t('Facebook API Credentials'),
      '#open' => TRUE,
    ];
    $form['facebook']['facebook_app_id'] = [
      '#type' => 'textfield',
      '#title' => $this->t('App ID'),
      '#default_value' => $config['facebook_app_id'],
      '#required' => TRUE
    ];
    $form['facebook']['facebook_app_secret'] = [
      '#type' => 'textfield',
      '#title' => $this->t('App Secret'),
      '#default_value' => $config['facebook_app_secret'],
      '#required' => TRUE
    ];
	
	 //instagram
    $form['instagram'] = [
      '#type' => 'details',
      '#title' => $this->t('Instagram API Credentials'),
      '#open' => TRUE,
    ];
    $form['instagram']['instagram_app_id'] = [
      '#type' => 'textfield',
      '#title' => $this->t('App ID'),
      '#default_value' => isset($config['instagram_app_id']) ? $config['instagram_app_id'] : "Null",
      '#required' => TRUE
    ];
    $form['instagram']['instagram_app_secret'] = [
      '#type' => 'textfield',
      '#title' => $this->t('App Secret'),
      '#default_value' => isset($config['instagram_app_secret']) ? $config['instagram_app_secret'] : "Null",
      '#required' => TRUE
    ];
	
		 //twitter
    $form['twitter'] = [
      '#type' => 'details',
      '#title' => $this->t('twitter API Credentials'),
      '#open' => TRUE,
    ];
    $form['twitter']['twitter_app_id'] = [
      '#type' => 'textfield',
      '#title' => $this->t('App ID'),
      '#default_value' => isset($config['twitter_app_id']) ? $config['twitter_app_id'] : "Null",
      '#required' => TRUE
    ];
    $form['twitter']['twitter_app_secret'] = [
      '#type' => 'textfield',
      '#title' => $this->t('App Secret'),
      '#default_value' => isset($config['twitter_app_secret']) ? $config['twitter_app_secret'] : "Null",
      '#required' => TRUE
    ];
    
    //YouTube
    $form['youtube'] = [
      '#type' => 'details',
      '#title' => $this->t('YouTube API Credentials'),
      '#open' => TRUE,
    ];
    $form['youtube']['youtube_app_id'] = [
      '#type' => 'textfield',
      '#title' => $this->t('App ID'),
      '#default_value' => $config['youtube_app_id'],
      '#required' => TRUE
    ];
    
    return parent::buildForm($form, $form_state);
  }
  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $values = $form_state->getValues();
    $this->config('social_media.api_settings')
      ->set('facebook_app_id', $values['facebook_app_id'])
      ->set('facebook_app_secret', $values['facebook_app_secret'])
	  ->set('instagram_app_id', $values['instagram_app_id'])
      ->set('instagram_app_secret', $values['instagram_app_secret'])
	  ->set('twitter_app_id', $values['twitter_app_id'])
      ->set('twitter_app_secret', $values['twitter_app_secret'])
      ->set('youtube_app_id', $values['youtube_app_id'])
      ->save();

    parent::submitForm($form, $form_state);
  }
}