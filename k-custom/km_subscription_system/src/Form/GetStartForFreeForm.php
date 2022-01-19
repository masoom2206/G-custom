<?php

namespace Drupal\km_subscription_system\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\user\PrivateTempStoreFactory;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\CloseModalDialogCommand;
use Drupal\Core\Ajax\RedirectCommand;
/**
 * Class GetStartForFreeForm.
 */
class GetStartForFreeForm extends FormBase {

  protected $step = 1;
  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'get_start_for_free_form';
  }
  /**
   * @var \Drupal\user\PrivateTempStore
   */
  protected $store;
  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
	  $form['#attached']['library'][] = 'km_subscription_system/multistep_form';
    $sid = 0;
    $sid = \Drupal::request()->query->get('sid');
    $email = \Drupal::request()->query->get('email');
    // Add a wrapper div that will be used by the Form API to update the form using AJAX
    $form['#prefix'] = '<div id="ajax_form_multistep_form"><div id="result-message result_message message"></div>';
    $form['#suffix'] = '</div>';
    $site_config = \Drupal::config('system.site');
    $server_name = strtolower($site_config->get('site_server_name'));
    $role_exclude = '';
    if($server_name == 'dev'){
		    $role_exclude = 871;
	    } elseif($server_name == 'staging'){
	    	$role_exclude = 601;		
	    } else {
		    $role_exclude = 601;
	    }
    if ($this->step == 1) {
      $vid = 'role_features';
      $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid);
      foreach ($terms as $term) {
        $term_obj = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($term->tid);
        $term_id = $term_obj->id();
        if($term_id != $role_exclude){
          $term_Name = $term_obj->getName();
          if($term_Name !== 'Reinstate At Professional Level' && $term_Name !== 'Reinstate At Expert Level'){
            $term_data_new[$term_id] = '<span><span></span></span>'.$term_Name;
          }
        }  
      }
      $form['message-step'] = [
        '#markup' => '<div class="step"><a href="/verify/email" class="use-ajax" data-dialog-type="modal" data-dialog-options="\'{"width":500, "heigh":600}\'" >' . $this->t('Click here if you have a sign-up verification code.') . '</a></div>',
        '#weight' => '0',
      ];
     /* [
          '0' =>  $this->t('<span><span></span></span>Marketer'),
          '1' => $this->t('<span><span></span></span>Pro Marketer')
        ],*/
      $form['free_standard_account'] = [
        '#type' => 'radios',
        '#options' => $term_data_new,
        '#weight' => '0',
        '#default_value' => $sid,
        '#required' => TRUE,
        '#attributes' => array(
          'class' => 'free-standard',
        )
      ];
      $form['first_name'] = [
        '#type' => 'textfield',
        '#title' => $this->t('First Name'),
        '#maxlength' => 64,
        '#size' => 64,
        '#weight' => '0',
        '#required' => TRUE,
      ];
      $form['last_name'] = [
        '#type' => 'textfield',
        '#title' => $this->t('Last Name'),
        '#maxlength' => 64,
        '#size' => 64,
        '#weight' => '0',
        '#required' => TRUE,
      ];
      $form['email_address'] = [
        '#type' => 'email',
        '#title' => $this->t('Email address'),
        '#attributes' => ['id' => ['email']],
        '#weight' => '0',
        '#default_value' => $email,
        '#required' => TRUE,
      ];
      $form['password'] = [
        '#type' => 'password',
        '#title' => $this->t('Password'),
        '#attributes' => ['class' => ['mgnB10'], 'id' => ['password']],
        '#maxlength' => 64,
        '#size' => 64,
        '#weight' => '0',
        '#required' => TRUE,
      ];
      $form['repeat_password'] = [
        '#type' => 'password',
        '#title' => $this->t('Repeat Password'),
        '#maxlength' => 64,
        '#size' => 64,
        '#weight' => '0',
        '#required' => TRUE,
      ];
      $form['captcha'] = [
        '#type' => 'captcha',
        '#title' => $this->t('Captcha'),
        '#attributes' => ['data-callback' => ['correctCaptcha'], 'callback' => ['correctCaptcha']],
        '#weight' => '0',
      ];
       $form['notice'] = [
        '#markup' => '<p class="notice d-none"  id="user-notice">' . $this->t('We will send you a notification 3-7 days prior to the end of your free trial period with instructions to upgrade to full account status. Until then, enjoy Kaboodle Media at no charge!') . '</p>',
      ];
    }
    if ($this->step == 2) {
	    $form['#title'] = t('New Title');
      $form['message-step'] = [
        '#markup' => '<div class="step">' . $this->t('An email has been sent to your address with a verification code.') . '</div>',
      ];
	    $form['email_address'] = [
		    '#type' => 'hidden',
		    '#value' => $this->store['email_address'], 
	    ];
	    $form['verification_code'] = [
        '#type' => 'textfield',
        '#title' => $this->t('Enter verification code'),
        '#required' => TRUE,
      ];
	    $form['agree'] = [
        '#markup' => '<p class="agree">' . $this->t(' By continuing, you acknowledge your agreement with the Kaboodle Media <a href="@terms" target="_blank" style="color:#023364;" >Terms and Conditions</a> and <a href="@policy" target="_blank" style="color:#023364;">Privacy Policy</a>. Our policies are provided by links at the bottom of every page.', array('@terms' => '/policy/tos', '@policy' => '/policy/privacy')) . '</p>',
      ];
    }
	  if ($this->step == 3) {
      $form['message-step'] = [
        '#markup' => '<div class="step"></div>',
      ];
      $form['message-title'] = [
        '#markup' => '<div class="finish">' . $this->t('Thank you for joining Kaboodle Media. We can\'t wait to see how you take advantage of everything offered here! Please click "Finish" to complete your registration and get started.').'</div>',
      ];
	  }
    $form['br'] = [
      '#markup' => '<div class="br"></div>',
    ];
	  if ($this->step == 1) {
      $form['buttons']['forward'] = array(
        '#type' => 'submit',
        '#value' => t('submit'),
        '#prefix' => '<div class="step1-button">',
        '#suffix' => '</div>',
        '#attributes' => ['class' => ['subbutton']],
        '#ajax' => array(
          // We pass in the wrapper we created at the start of the form
          'wrapper' => 'ajax_form_multistep_form',
          // We pass a callback function we will use later to render the form for the user
          'callback' => '::ajax_form_multistep_form_ajax_callback',
          'event' => 'click',
        ),
      );
	    $form['buttons']['cancel'] = array(
        '#type' => 'submit',
        '#value' => t('cancel'),
        '#prefix' => '<div class="step1-button">',
        '#suffix' => '</div>',
        '#limit_validation_errors' => array(),
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
      $form['buttons']['forward'] = array(
        '#type' => 'submit',
        '#value' => t('VERIFY'),
	      '#prefix' => '<div class="step1-button">',
        '#suffix' => '</div>',
        '#attributes' => ['class' => ['subbutton']],
        '#ajax' => array(
          // We pass in the wrapper we created at the start of the form
          'wrapper' => 'ajax_form_multistep_form',
          // We pass a callback function we will use later to render the form for the user
          'callback' => '::ajax_form_multistep_form_ajax_callback',
          'event' => 'click',
        ),
      );
      $form['buttons']['cancel'] = array(
        '#type' => 'submit',
        '#value' => t('cancel'),
        '#prefix' => '<div class="step1-button">',
        '#suffix' => '</div>',
        '#limit_validation_errors' => array(),
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
	  if ($this->step == 3) {
      $form['buttons']['final'] = array(
        '#type' => 'submit',
        '#value' => t('FINISH'),
		    '#prefix' => '<div class="step1-button">',
        '#suffix' => '</div>',
        '#limit_validation_errors' => array(),
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
    
    $site_config = \Drupal::config('system.site');
	  $server_name = strtolower($site_config->get('site_server_name'));
   // $variables['#attached']['drupalSettings']['mymodule']['color_body'] = $color_body;
   $form['#attached']['drupalSettings']['km_subscription_system']['server_name'] = $server_name;
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    $dataform = $form_state->getTriggeringElement();
    if ($dataform['#parents'][0] != 'cancel') {
      if ($form_state->getValue('email_address')) {
        $ids = \Drupal::entityQuery('user')
        ->condition('mail', $form_state->getValue('email_address'))
        ->execute();
        if (!empty($ids)) {
           $form_state->setErrorByName('email_address', $this->t('Email Address is already registered.'));
        }
        if ($form_state->getValue('verification_code')) {
          $query = \Drupal::database()->select('km_subscription_system', 'ks');
          $query->fields('ks');
          $query->condition('email', $form_state->getValue('email_address'));
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
            $query->condition('email', $form_state->getValue('email_address'));
            $query->condition('randomcode',$form_state->getValue('verification_code'));
            $query->condition('created',  $getrequesttime, '>');
            $query->range(0, 1);
            $codestatust = $query->execute()->fetchAll();
            if (count($codestatust) <= 0) {
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


    if ($this->step == 1) {
      $config = $this->config('km_subscription_system.mailsetting');
      $values = $form_state->getValues();
      $email = $values['email_address'];
	    $this->store['email_address'] = $email;
      // Save data or send email here.
	    $connection = \Drupal::database();
      //$code =  substr(sha1(time()), 0, 8);
      $random_string = sha1(time());
      $random_string_numer = preg_replace("/[^0-9]/", "", $random_string );
      $code =  substr($random_string_numer, 0, 6);
	    $time = \Drupal::time()->getRequestTime();
	    $result = $connection->merge('km_subscription_system')
	      ->key('email', $email)
	      ->fields([
			  'fname' =>  $values['first_name'],
			  'lname' => $values['last_name'],
			  'email' => $values['email_address'],
			  'username' => $values['first_name'].$values['last_name'].rand(),
			  'password' => $values['password'],
			  'randomcode' => $code,
			  'stype' => $values['free_standard_account'],
			  'status' => 1,
			  'created' => $time,
		  ])
		  ->execute();
		  $mailManager = \Drupal::service('plugin.manager.mail');
		  $module = 'km_subscription_system';
      $langcode = \Drupal::currentUser()->getPreferredLangcode();
      $from = \Drupal::config('system.site')->get('mail');
		  $key = 'verification';
		  $to = $form_state->getValue('email_address');
	    $host = \Drupal::request()->getSchemeAndHttpHost();
		  $verificationpagelink = '<a href="'.$host.'/api/verify/email?ees='.base64_encode($to).'&tes='.sha1($time).'&ccd='.sha1($code).'">'.$host.'/api/verify/email?ees='.base64_encode($to).'&tes='.sha1($time).'&ccd='.sha1($code).'</a>';
		  $body = $config->get('mail_body');
      $firstname = $form_state->getValue('first_name');
      $body = str_replace("[user:field_first_name]", $firstname, $body);
      $body = str_replace("[verification-code]", '<b>'.$code.'</b>', $body);
      $body = str_replace("[verification-page-link]", $verificationpagelink, $body);
      $mail_logo = 'https://s3.us-west-2.amazonaws.com/kaboodlemedia.com/s3fs_public/kaboodle-media-horizontal-web.png';
      $params['message']['headers'] = array(
			'content-type' => 'text/html',
			'MIME-Version' => '1.0',
			'reply-to' => $from,
			'from' => 'KaboodleMedia <'.$from.'>'
		  );
      $params['subject'] = $config->get('subject');
      $theme_body['theme_data'] = array(
			'#theme' => 'registraion_mail_template',
			'#mail_body' => $body,
			'#mail_logo' => $mail_logo,
      '#mail_year' => date("Y"),
		  );
		  $mail_body = drupal_render($theme_body);
      $params['message'] = $mail_body;
		  $send = true;
		  $result = $mailManager->mail($module, $key, $to, $langcode, $params, NULL, $send);
		  if ($result['result'] !== true) {
		    drupal_set_message(t('There was a problem sending your message and it was not sent.'), 'error');
		  }
      $this->step++;
	    $form_state->setRebuild();
    }
    if($this->step == 2) {
      $vid = 'role_features';
      $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid);
      $config = $this->config('stripe_api.settings');
      $mode = $config->get('mode');
      foreach ($terms as $term) {
        $term_obj = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->load($term->tid);
        if($mode == 'live') {
          $pricing_id = $term_obj->get('field_stripe_pricing_id_monthly_')->value;
        } else {
          $pricing_id = $term_obj->get('field_stripe_test_pricing_id_mon')->value;
        }
        $term_data[$term->tid] = [
          'storage_limit' => $term_obj->get('field_storage_limit')->value,
          'bandwidth' => $term_obj->get('field_bandwidth')->value,
          'role' => $term_obj->get('field_drupal_role')->value,
          'free_trial_days' => $term_obj->get('field_free_trial_days')->value,
          'stripe_price' => $pricing_id,
        ];
      }
      $language = \Drupal::languageManager()->getCurrentLanguage()->getId();
      $codestatus = '';
      $email =  $this->store['email_address'];
      $value = $form_state->getValues();
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
        $id = $user->id();
        $customer = \Drupal::service('stripe_subscription_and_customer.stripe_api')->getCustomersID($id);
        $subscription = \Drupal::service('stripe_subscription_and_customer.stripe_api')->createSubscription($customer->id, $term_data[$datavalue->stype]['stripe_price'], $term_data[$datavalue->stype]['free_trial_days']);
        $data = \Drupal::service('stripe_subscription_and_customer.stripe_api')->updateSubscriptiondrupal($customer->id, $subscription->id, $id);
        $user = \Drupal::entityTypeManager()->getStorage('user')->load($id);
        $user->set('stripe_customer_id', $customer->id);
        $user->set('stripe_subscription_id', $subscription->id);
        $user->save();
        $this->step++;
        $form_state->setRebuild();
      }
    }
  }
   
  public function ajax_form_multistep_form_ajax_callback(array &$form, FormStateInterface $form_state) {
    return $form;
  }

  public function ajax_form_multistep_final_d_form_ajax_callback(array &$form, FormStateInterface $form_state) {
    if ($this->step == 3) {
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
/* 
function get_login_us($account) {
	user_login_finalize($account);
	return 1;
} */