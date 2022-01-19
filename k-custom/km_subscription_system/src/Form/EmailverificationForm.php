<?php

namespace Drupal\km_subscription_system\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\CloseModalDialogCommand;
use Drupal\Core\Ajax\RedirectCommand;

/**
 * Class EmailverificationForm.
 */
class EmailverificationForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'emailverification_form';
  }

  protected $step = 1;
  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $email = \Drupal::request()->query->get('d');
    $email = base64_decode($email);
	$form['#prefix'] = '<div id="ajax_form_multistep_form"><div id="result-message result_message message"></div>';
    $form['#suffix'] = '</div>';
	if ($this->step == 1) {
		$form['email_id'] = [
		  '#type' => 'email',
		  '#title' => $this->t('Email'),
		  '#weight' => -10,
		   '#required' => TRUE,
		  '#default_value' => $email
		];
		$form['verification_code'] = [
		  '#type' => 'textfield',
		  '#title' => $this->t('Verification Code'),
		  '#maxlength' => 32,
		  '#size' => 64,
		  '#weight' => -9,
		  '#required' => TRUE,
		];
		$form['caotcha'] = [
		  '#type' => 'captcha',
		  '#title' => $this->t('Caotcha'),
		  '#weight' => -8,
		];
    $form['br'] = [
      '#markup' => '<div class="br"></div>',
      '#weight' => -7,
    ];
		$form['submit'] = [
		  '#type' => 'submit',
		  '#value' => $this->t('Submit'),
      '#prefix' => '<div class="step1-button">',
      '#suffix' => '</div>',
		  '#weight' => 98,
      '#attributes' => ['class' => ['subbutton']],
		  '#ajax' => array(
			  // We pass in the wrapper we created at the start of the form
			  'wrapper' => 'ajax_form_multistep_form',
			  // We pass a callback function we will use later to render the form for the user
			  'callback' => '::ajax_emailverification',
			  'event' => 'click',
			),
		];
    $form['cancel'] = array(
      '#type' => 'submit',
      '#value' => $this->t('cancel'),
      '#prefix' => '<div class="step1-button">',
      '#suffix' => '</div>',
      '#limit_validation_errors' => array(),
      '#weight' => 99,
      '#attributes' => ['class' => ['calbutton']],
      '#ajax' => array(
        // We pass in the wrapper we created at the start of the form
        'wrapper' => 'ajax_form_multistep_form',
        // We pass a callback function we will use later to render the form for the user
        'callback' => '::ajax_form_multistep_form_ajax_cancel',
        'event' => 'click',
      ),
    );
  }
	if ($this->step == 2) {
	  $form['message-step'] = [
        '#markup' => '<div class="step"></div>',
      ];
      $form['message-title'] = [
        '#markup' => '<div class="finish">' . $this->t('Thank you for joining Kaboodle Media. We can\'t wait to see how you take advantage of everything offered here! Please click "Finish" to complete your registration and get started.').'</div>',
      ];
      $form['buttons']['final'] = array(
        '#type' => 'submit',
        '#limit_validation_errors' => array(),
        '#value' => t('Finsih'),
		    '#prefix' => '<div class="step1-button">',
        '#suffix' => '</div>',
        '#attributes' => ['class' => ['subbutton']],
        '#ajax' => array(
          // We pass in the wrapper we created at the start of the form
          'wrapper' => 'ajax_form_multistep_form',
          // We pass a callback function we will use later to render the form for the user
          'callback' => '::ajax_form_multistep_final_d_form_ajax_callback',
          'event' => 'click',
        ),
      );
    }
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $dataform = $form_state->getTriggeringElement();
    if ($dataform['#parents'][0] != 'cancel') {
      if ($form_state->getValue('email_id')) {
        $ids = \Drupal::entityQuery('user')
          ->condition('mail', $form_state->getValue('email_id'))
          ->execute();
        if (!empty($ids)) {
           $form_state->setErrorByName('email_id', $this->t('Email Address is already registered.'));
        }
        if ($form_state->getValue('verification_code')) {
          $query = \Drupal::database()->select('km_subscription_system', 'ks');
          $query->fields('ks');
          $query->condition('email', $form_state->getValue('email_id'));
          $query->condition('randomcode',$form_state->getValue('verification_code'));
          $query->range(0, 1);
          $codestatus = $query->execute()->fetchAll();
          if (count($codestatus) <= 0) {
             $form_state->setErrorByName('verification_code', $this->t('You verification code is not valid.'));
          }
          else {
            $getrequesttime = \Drupal::time()->getRequestTime() - 86400;
            $query = \Drupal::database()->select('km_subscription_system', 'ks');
            $query->fields('ks');
            $query->condition('email', $form_state->getValue('email_id'));
            $query->condition('randomcode',$form_state->getValue('verification_code'));
            $query->condition('created',  $getrequesttime, '>');
            $query->range(0, 1);
            $codestatust = $query->execute()->fetchAll();
            if (count($codestatust) <=  0) {
               $form_state->setErrorByName('verification_code', $this->t('You verification code has been expired.'));
            }
          }
        }
      }
      parent::validateForm($form, $form_state);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
    $codestatus = '';
    $value = $form_state->getValues();
    $email =  $value['email_id'];
    $verification_code = isset($value['verification_code']) ? $value['verification_code'] : '';
    $getrequesttime = \Drupal::time()->getRequestTime() - 86400;
    $query = \Drupal::database()->select('km_subscription_system', 'ks');
	  $query->fields('ks');
	  $query->condition('email', $email);
	  $query->condition('randomcode', $verification_code);
    $query->condition('created',  $getrequesttime, '>');
	  $query->range(0, 1);
	  $codestatus = $query->execute()->fetchAll();
	  //$form_state->setRedirect('');
    if (!empty($codestatus)) {
      $vid = 'role_features';
      $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid);
      foreach ($terms as $term) {
        $term_obj = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($term->tid);
        $term_data[$term->tid] = [
          'storage_limit' => $term_obj->get('field_storage_limit')->value,
          'bandwidth' => $term_obj->get('field_bandwidth')->value,
          'role' => $term_obj->get('field_drupal_role')->value,
        ];
      }
      $datavalue = $codestatus[0];
      $user = \Drupal\user\Entity\User::create();
      $user->setPassword($datavalue->password);
      $user->enforceIsNew();
      $user->setEmail($datavalue->email);
      $user->setUsername($datavalue->fname.$datavalue->lname.rand());//This username must be unique and accept only a-Z,0-9, - _ @ .
      $user->set("init", $datavalue->email);
      $user->set("langcode", $language);
      $user->set("preferred_langcode", $language);
      $user->set("preferred_admin_langcode", $language);
      $user->set('field_last_name', $datavalue->lname);
      $user->set('field_first_name', $datavalue->fname);
      $user->set('field_preferred_first_name', $datavalue->fname);
      /*if ($datavalue->stype == 1) {
        $user->addRole('advanced_content_creator');
        $term_name = 'Pro Content Creator';
      }    
      else {
        $user->addRole('content_creator');
        $term_name = 'Content Creator';
      }*/
      $user->addRole($term_data[$datavalue->stype]['role']);
      $user->set('field_bandwidth_allotment', $term_data[$datavalue->stype]['bandwidth']);
      $user->set('field_storage_space', $term_data[$datavalue->stype]['storage_limit']);
      $user->activate();
      //Save user account
      $user->save();
      // Save the data:
      $_SESSION['km_subscription_system']['user'] = $user;
      $this->step++;
      $form_state->setRebuild();
	  }
  }
  
  
  public function ajax_emailverification(array &$form, FormStateInterface $form_state) {
    return $form;
  }
  
  public function ajax_form_multistep_final_d_form_ajax_callback(array &$form, FormStateInterface $form_state) {
    if ($this->step == 2) {
	    $response = new AjaxResponse();
		  $response->addCommand(new CloseModalDialogCommand());
		  $response->addCommand(new RedirectCommand('/km_subscription_system/userautologin'));
		  return $response;	 
	  }
  }

  public function ajax_form_multistep_form_ajax_cancel(array &$form, FormStateInterface $form_state) {
    $messages = \Drupal::messenger()->deleteAll();
    $response = new AjaxResponse();
    $response->addCommand(new CloseModalDialogCommand());
    return $response;	 
  }
}
