<?php

namespace Drupal\km_subscription_system\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\RedirectCommand;

/**
 * Class ContentcreatorForm.
 */
class ContentcreatorForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'contentcreator_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['first_name'] = [
      '#type' => 'textfield',
      '#title' => $this->t('First Name'),
      '#maxlength' => 64,
      '#size' => 64,
      '#weight' => '0',
    ];
    $form['last_name'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Last Name'),
      '#maxlength' => 64,
      '#size' => 64,
      '#weight' => '1',
    ];
    $form['email_address'] = [
      '#type' => 'email',
      '#title' => $this->t('Email address'),
      '#weight' => '2',
    ];
    $form['username'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Username'),
      '#maxlength' => 64,
      '#size' => 64,
      '#weight' => '3',
    ];
    $form['password'] = [
      '#type' => 'password',
      '#title' => $this->t('Password'),
      '#maxlength' => 128,
      '#size' => 64,
      '#weight' => '4',
    ];
    $form['captcha'] = [
      '#type' => 'captcha',
      '#title' => $this->t('captcha'),
      '#weight' => '5',
    ];
    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Create new account'),
      '#ajax' => [
        'callback' => '::promptCallback',
        'wrapper' => 'box-container',
      ],
      '#weight' => '6',
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    foreach ($form_state->getValues() as $key => $value) {
      // @TODO: Validate fields.
    }
    parent::validateForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Display result.
    foreach ($form_state->getValues() as $key => $value) {
      \Drupal::messenger()->addMessage($key . ': ' . ($key === 'text_format'?$value['value']:$value));
    }
  }
  /**
   * Callback for save input data.
   *
   * @return array
   *   Renderable array
   */
  public function promptCallback(array &$form, FormStateInterface $form_state) {
    // In most cases, it is recommended that you put this logic in form
    // generation rather than the callback. Submit driven forms are an
    // exception, because you may not want to return the form at all.
    $connection = \Drupal::database();
    $code =  substr(sha1(time()), 0, 8);
    $result = $connection->merge('km_subscription_system')
      ->key('email', $form_state->getValue('email_address'))
      ->fields([
        'fname' =>  $form_state->getValue('first_name'),
        'lname' => $form_state->getValue('last_name'),
        'email' => $form_state->getValue('email_address'),
        'username' => $form_state->getValue('username'),
        'password' => $form_state->getValue('password'),
        'randomcode' => $code,
        'stype' => 1,
        'status' => 0,
        'created' => \Drupal::time()->getRequestTime(),
      ])
      ->execute();
    $mailManager = \Drupal::service('plugin.manager.mail');
    $module = 'km_subscription_system';
    $key = 'verification';
    $to = $form_state->getValue('email_address');
    $params['message'] = 'Hi '. $form_state->getValue('first_name') .',
We just need to verify your email address before you can access website.
Your verification code is : '. $code  .'
Thanks!
The KM team';
    $langcode = \Drupal::currentUser()->getPreferredLangcode();
    $send = true;
    $result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
    if ($result['result'] !== true) {
      drupal_set_message(t('There was a problem sending your message and it was not sent.'), 'error');
    }
    else {
      drupal_set_message(t('Verification code has been sent on your email address.'));
    }
    $response = new AjaxResponse();
    $url = '/verify/email?d=' . base64_encode($form_state->getValue('email_address'));
    $response->addCommand(new RedirectCommand($url));
    return $response;
  }
}
