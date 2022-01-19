<?php

namespace Drupal\affiliate_program\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Ajax\OpenModalDialogCommand;
use Drupal\Core\Ajax\AjaxResponse;
use Drupal\Core\Ajax\HtmlCommand;
use Drupal\Core\Language\LanguageInterface;
use Drupal\Core\Mail\MailManagerInterface;

/**
 * Class AffiliateApplicationForm.
 */
class AffiliateApplicationForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'affiliate_application_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    global $base_secure_url;
    $current_user = \Drupal::currentUser();
    $cuid = $current_user->Id();
    $uid = $current_user->Id();
    if(isset($_GET['uid']) && $cuid == 1){
      $uid = $_GET['uid'];
    }
    $user =  \Drupal\user\Entity\User::load($uid);
    $email = $user->get('mail')->value;
    $user_name = $user->get('field_preferred_first_name')->value;;
    $affiliate_key = md5($uid);
    $conn = \Drupal::database();
    $record = array();
    $query = $conn->select('affiliate_program', 'ap')
      ->condition('uid', $uid)
      ->condition('affiliate_key', $affiliate_key)
      ->fields('ap');
    $record = $query->execute()->fetchAssoc();
    //print "<pre>";print_r($record);exit;
    $form['#prefix'] = '<div id="affiliate-application-form-wrapper">';
    
    if($uid == $cuid && $record['admin_approved'] == 1 && $cuid !== 1){
      $form['company_info'] = [
       '#markup' => '<div class="col-sm-12 affiliate-company-info"><h1>Affiliate Information</h1></div>'
      ];
      $form['account_info'] = [
        '#markup' => '<div class="account-info approved"><div class="label">Account Info</div><div class="user-id">ID: '.$uid.'</div><div class="email-label">Email: '.$email.'</div></div>'
      ];
      $form['affiliate_key'] = [
        '#markup' => '<div class="account-info approved"><div class="label">Your Affiliate Key</div><div class="com_name"><b>'.$record['affiliate_key'].'</b></div></div>'
      ];
      $affiliate_link = $base_secure_url.'/affiliate/join?afkey='.$record['affiliate_key'];
      $affiliate_banner1 = "https://s3.us-west-2.amazonaws.com/kaboodlemedia.com/s3fs_public/site-images/2022/kaboodle-media-join-now-20percent-400-long.png";
      $affiliate_banner2 = "https://s3.us-west-2.amazonaws.com/kaboodlemedia.com/s3fs_public/site-images/2022/kaboodle-media-join-now-20percent-100h-flat.png";
      $form['affiliate_link'] = [
        '#markup' => '<div class="affiliate-link-details"><div class="account-info approved"><div class="label">Your Affiliate link</div><div class="affiliate-link">'.$affiliate_link.'</div><div class="affiliate-link-copy"><a href="#" class="btn btn-primary text-uppercase font-fjalla mr-4" affiliate-link="'.$affiliate_link.'" style="padding: 6px 29px;">Copy Link</a></div></div><div class="account-info approved"><div class="label">Your Affiliate link code with banners</div><div class="affiliate-banner1"><img src="'.$affiliate_banner1.'" border="0"/></div><div class="copy-link-code1"><a href="#" class="btn btn-primary text-uppercase font-fjalla mr-4" affiliate-link="'.$affiliate_link.'" affiliate-banner="'.$affiliate_banner1.'">Copy Link Code</a></div></div><div class="account-info approved"><div class="label">&nbsp;</div><div class="affiliate-banner2"><img src="'.$affiliate_banner2.'" border="0"/></div><div class="copy-link-code2"><a href="#" class="btn btn-primary text-uppercase font-fjalla mr-4" affiliate-link="'.$affiliate_link.'" affiliate-banner="'.$affiliate_banner2.'">Copy Link Code</a></div></div></div>'
      ];
      $form['com_name'] = [
        '#markup' => '<div class="account-info approved"><div class="label">Affiliate Company Name</div><div class="com_name">'.$record['com_name'].'</div></div>'
      ];
      $form['com_domain'] = [
        '#markup' => '<div class="account-info approved"><div class="label">Company Website</div><div class="com_name">'.$record['com_domain'].'</div></div>'
      ];
      $form['country'] = [
        '#markup' => '<div class="account-info approved"><div class="label">Country</div><div class="us-country">United State <span>(US companies and organizations only)</span></div></div>'
      ];
      $form['address_1'] = [
        '#markup' => '<div class="account-info approved"><div class="label">Street Address 1</div><div class="us-country">'.$record['address_1'].'</div></div>'
      ];
      $form['address_2'] = [
        '#markup' => '<div class="account-info approved"><div class="label">Street Address 2</div><div class="us-country">'.$record['address_2'].'</div></div>'
      ];
      $form['address_city'] = [
        '#markup' => '<div class="account-info approved"><div class="label">City, State, Zip</div><div class="us-country">'.$record['address_city'].', '.$record['address_state'].', '.$record['address_zip'].'</div></div>'
      ];
      $form['phone_number'] = [
        '#markup' => '<div class="account-info approved"><div class="label">Phone Number</div><div class="us-country">'.$record['phone_number'].'</div></div>'
      ];
      $form['currency'] = [
       '#markup' => '<div class="account-info approved"><div class="label">Currency</div><div class="us-currency">US Dollar</div></div>'
      ];
      $form['emp_count'] = [
        '#markup' => '<div class="account-info approved"><div class="label">Current number of employees or members</div><div class="us-country">'.$record['emp_count'].'</div></div>'
      ];
      $form['paypal_email'] = [
        '#markup' => '<div class="account-info approved"><div class="label">Your PayPal Email Address.<br/>This is where we will send your payments.</div><div class="paypal-email">'.$record['paypal_email'].'</div></div>'
      ];
      $form['comp_non_profit'] = [
        '#type' => 'checkbox',
        '#title' => $this->t('We are non-profit 501-c3 organization'),
        '#default_value' => isset($record['comp_non_profit']) ? $record['comp_non_profit'] : 0,
        '#attributes'=>[
          'disabled' => 'disabled',
        ],
        '#prefix' => '<div class="affiliate-term-check">',
      ];
      $form['abusive_content'] = [
        '#type' => 'checkbox',
        '#title' => $this->t('<span class="form-required">My site does not contain abusive content</span>'),
        '#attributes'=>[
          'disabled' => 'disabled',
        ],
        '#default_value' => 1,
      ];
      $form['affiliate_term'] = [
        '#type' => 'checkbox',
        '#title' => $this->t('<span class="form-required">I have read and agree with the <a href="/policy/affiliate-tos" target="_blank">Affiliate Program Terms & Conditions</a></span>'),
        '#attributes'=>[
          'disabled' => 'disabled',
        ],
        '#default_value' => 1,
        '#suffix' => '</div>',
      ];
      $form['#suffix'] = '</div>';
      $form['#attached']['library'][] = 'affiliate_program/affiliate.application';
      $form['#attached']['library'][] = 'core/drupal.dialog.ajax';// Attach the library for pop-up dialogs/modals.
      $form['#attached']['drupalSettings'] = ['base_secure_url' => $base_secure_url, 'uid' => $uid, 'affiliate_key' => $affiliate_key, 'admin_approved' => 1];
      return $form;
    }
    
    $form['company_info'] = [
     '#markup' => '<div class="col-sm-12 affiliate-company-info"><h1>Company Information</h1></div>'
    ];
    $form['uid'] = [
      '#type' => 'hidden',
      '#value' => $uid,
    ];
    $form['user_name'] = [
      '#type' => 'hidden',
      '#value' => $user_name,
    ];
    if($uid == $cuid){
      $form['affiliate_key'] = [
        '#type' => 'hidden',
        '#value' => $affiliate_key,
      ];
    }
    $form['account_info'] = [
     '#markup' => '<div class="account-info"><div class="label">Account Info</div><div class="user-id">ID: '.$uid.'</div><div class="email-label">Email: '.$email.'</div></div>'
    ];
    $form['com_name'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Affiliate Company Name'),
      '#required' => true,
      '#attributes'=>[
        'placeholder' => $this->t('Affiliate Company Name'),
      ],
      '#default_value' => isset($record['com_name']) ? $record['com_name'] : '',
    ];
    $com_domain1 = 'https://';
    $com_domain2 = '';
    if(isset($record['com_domain'])){
      $com_domain = explode("://", $record['com_domain']);
      $com_domain1 = $com_domain[0].'://';
      $com_domain2 = $com_domain[1];
    }
    $form['com_domain1'] = [
      '#type' => 'select',
      '#title' => $this->t('Company Website'),
      '#required' => true,
      '#options' => [
        'http://' => t('http://'),
        'https://' => t('https://'),
      ],
      '#default_value' => $com_domain1,
      '#prefix' => '<div class="affiliate-com-domain">',
    ];
    $form['com_domain2'] = [
      '#type' => 'textfield',
      '#required' => true,
      '#attributes'=>[
        'placeholder' => $this->t('www.yourdomain.com'),
      ],
      '#default_value' => $com_domain2,
      '#suffix' => '</div>',
    ];
    $form['country'] = [
     '#markup' => '<div class="account-info"><div class="label">Country</div><div class="us-country">United State <span>(US companies and organizations only)</span></div></div>'
    ];
    $form['address_1'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Street Address 1'),
      '#required' => true,
      '#attributes'=>[
        'placeholder' => $this->t('Street Address 1'),
      ],
      '#default_value' => isset($record['address_1']) ? $record['address_1'] : '',
    ];
    $form['address_2'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Street Address 2'),
      '#attributes'=>[
        'placeholder' => $this->t('Street Address 2'),
      ],
      '#default_value' => isset($record['address_2']) ? $record['address_2'] : '',
    ];
    $form['address_city'] = [
      '#type' => 'textfield',
      '#title' => $this->t('City, State, Zip'),
      '#required' => true,
      '#attributes'=>[
        'placeholder' => $this->t('City'),
      ],
      '#prefix' => '<div class="affiliate-address-city">',
      '#default_value' => isset($record['address_city']) ? $record['address_city'] : '',
    ];
    $options = $this->get_state_list();
    $form['address_state'] = [
      '#type' => 'select',
      '#options' => $options,
      /*'#options' => [
        'alabama' => t('Alabama'),
        'XXX' => t('XXX'),
        'YYY' => t('YYY'),
      ],*/
      '#default_value' => isset($record['address_state']) ? $record['address_state'] : '',
    ];
    $form['address_zip'] = [
      '#type' => 'textfield',
      '#attributes' => array(
        ' type' => 'number', // insert space before attribute name :)
        'placeholder' => $this->t('Zip'),
      ),
      '#required' => true,
      '#element_validate' => array('element_validate_integer_positive'),
      '#size' => 5,
      '#maxlength' => 5,
      '#minlength' => 5,
      '#suffix' => '</div>',
      '#default_value' => isset($record['address_zip']) ? $record['address_zip'] : '',
    ];
    $form['phone_number'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Phone Number'),
      '#attributes' => array(
        ' type' => 'number', // insert space before attribute name :)
        'placeholder' => $this->t('+1'),
      ),
      '#required' => true,
      '#maxlength' => 12,
      '#default_value' => isset($record['phone_number']) ? $record['phone_number'] : '',
    ];
    $form['currency'] = [
     '#markup' => '<div class="account-info"><div class="label">Currency</div><div class="us-currency">US Dollar</div></div>'
    ];
    $form['emp_count'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Current number of employees or members'),
      '#attributes' => array(
        ' type' => 'number', // insert space before attribute name :)
      ),
      '#required' => true,
      '#maxlength' => 9,
      '#default_value' => isset($record['emp_count']) ? $record['emp_count'] : '',
    ];
    $form['paypal_email'] = [
      '#type' => 'email',
      '#title' => $this->t('<span class="form-required">Your PayPal Email Address.</span><br/>This is where we will send your payments.'),
      '#attributes' => array(
        'placeholder' => $this->t('Your PayPal Email Address'),
      ),
      '#required' => true,
      '#default_value' => isset($record['paypal_email']) ? $record['paypal_email'] : '',
    ];
    $form['comp_non_profit'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('We are non-profit 501-c3 organization'),
      '#default_value' => isset($record['comp_non_profit']) ? $record['comp_non_profit'] : 0,
      '#prefix' => '<div class="affiliate-term-check">',
    ];
    $form['abusive_content'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('<span class="form-required">My site does not contain abusive content</span>'),
      '#default_value' => isset($record['abusive_content']) ? $record['abusive_content'] : 0,
      '#required' => true,
    ];
    $form['affiliate_term'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('<span class="form-required">I have read and agree with the <a href="/policy/affiliate-tos" target="_blank">Affiliate Program Terms & Conditions</a></span>'),
      '#required' => true,
      '#default_value' => isset($record['affiliate_term']) ? $record['affiliate_term'] : 0,
      '#suffix' => '</div>',
    ];
    $form['required_sign'] = [
     '#markup' => '<div class="account-info"><div class="us-country"><span class="form-required"></span>= Required</div></div>'
    ];
    if(($uid !== $cuid) && ($uid > 1 && $cuid == 1)){
      $form['admin_approved'] = [
        '#type' => 'checkbox',
        '#title' => $this->t('Approved'),
        '#default_value' => isset($record['admin_approved']) ? $record['admin_approved'] : 0,
        '#prefix' => '<div class="affiliate-term-check">',
      ];
      $form['affiliate_key'] = [
        '#type' => 'textfield',
        '#required' => true,
        '#attributes'=>[
          'placeholder' => $this->t('Affiliate key'),
          'disabled' => 'disabled',
        ],
        '#default_value' => isset($record['affiliate_key']) ? $record['affiliate_key'] : $affiliate_key,
        '#suffix' => '</div>',
      ];
    }
    //if($uid !== 1 && (isset($record['admin_approved']) && $record['admin_approved'] == 0))
    $form['buttons']['submit'] = [
      '#type' => 'submit',
      '#value' => t('Submit'),
      '#prefix' => '<div class="hr"></div><div class="save-affiliate-application">',
      '#suffix' => '</div>',
      '#ajax' => array(
        'callback' => '::_modal_form_affiliate_ajax_submit',
        'event' => 'click'
      ),
    ];
    $form['#suffix'] = '</div>';
    $form['#attached']['library'][] = 'affiliate_program/affiliate.application';
    $form['#attached']['library'][] = 'core/drupal.dialog.ajax';// Attach the library for pop-up dialogs/modals.
    $form['#attached']['drupalSettings'] = ['base_secure_url' => $base_secure_url, 'uid' => $uid, 'affiliate_key' => $affiliate_key, 'admin_approved' => 0];
    if(($uid !== $cuid) && ($uid > 1 && $cuid == 1)){
      $form['#attached']['drupalSettings']['admin_approved'] = 1;
    }
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
    $values = $form_state->getValues();
    $fields = [
      'uid'   =>  $values['uid'],
      'affiliate_key'   =>  $values['affiliate_key'],
      'com_name'   =>  $values['com_name'],
      'com_domain'   =>  $values['com_domain1'].$values['com_domain2'],
      'address_1'   =>  $values['address_1'],
      'address_2'   =>  $values['address_2'],
      'address_city'   =>  $values['address_city'],
      'address_state'   =>  $values['address_state'],
      'address_zip'   =>  $values['address_zip'],
      'phone_number'   =>  $values['phone_number'],
      'paypal_email'   =>  $values['paypal_email'],
      'emp_count'   =>  $values['emp_count'],
      'comp_non_profit'   =>  $values['comp_non_profit'],
      'abusive_content'   =>  $values['abusive_content'],
      'affiliate_term'   =>  $values['affiliate_term'],
      'professional_members'   =>  0,
      'expert_members'   =>  0,
      'created' => time(),
      'updated' => time(),
      'admin_approved' => isset($values['admin_approved']) ? $values['admin_approved'] : 0,
    ];
    //print "<pre>";print_r($fields);exit;
    $query = \Drupal::database();
    $query->merge('affiliate_program')
      ->keys(['uid' => $values['uid'], 'affiliate_key' => $values['affiliate_key']])
      ->fields($fields)
      ->execute();
    if(isset($values['admin_approved'])){
      $user_detail =  \Drupal\user\Entity\User::load($values['uid']);
      $user_roles = $user_detail->getRoles();
      if(!in_array('administrator', $user_roles)){
        if($values['admin_approved'] == 1){
          $user_detail->addRole('affiliate');
        }
        else {
          $user_detail->removeRole('affiliate');
        }
        $user_detail->save();
      }
    }
    else {
      $mail = $this->notifyToSupport($values['user_name'], $values['uid']);
    }
    //drupal_set_message(t('Affiliate application has been saved successfully. Your affiliate key is : "'.$values['affiliate_key'].'"'), 'status');
  }
  function _modal_form_affiliate_ajax_submit(array $form, FormStateInterface &$form_state) {
    $response = new AjaxResponse();
    if ($form_state->getErrors()) {
      unset($form['#prefix']);
      unset($form['#suffix']);
      $form['status_messages'] = [
      '#type' => 'status_messages',
      '#weight' => -10,];
      $response->addCommand(new HtmlCommand('#affiliate-application-form-wrapper', $form));
    }
    else {
      $content = 'Your application has been successfully submitted. We will review it and contact you soon. Thank you for your submission.';
      if(isset($_GET['uid'])){
        $content = 'Application has been successfully updated.';
      }
      $title = 'AFFILIATE APPLICATION';
      $response = new AjaxResponse();
      $options = [
        'dialogClass' => 'affiliate-application-dialog',
        'width' => '500px',
        'buttons' => [
          'button1' => [
            'text' => $this->t('Ok'),
            'class' => 'btn-primary ok-button',
            'id' => 'onClickAffiliateModal',
            'onclick' => "jQuery('.ui-icon-closethick').click();",
          ],
        ],
      ];
      $response->addCommand(new OpenModalDialogCommand($title, $content, $options));
    }
    return $response;
  }
  function _modal_form_affiliate_ajax_close(){
    print 'Masoom';exit;
  }
  /**
   * Callback get_state_list
   * to render the additional order options
   */
  public function get_state_list() {
    return  $option = array(
      'AL' => t('Alabama'),
      'AK' => t('Alaska'),
      'AZ' => t('Arizona'),
      'AR' => t('Arkansas'),
      'CA' => t('California'),
      'CO' => t('Colorado'),
      'CT' => t('Connecticut'),
      'DE' => t('Delaware'),
      'DC' => t('District of Columbia'),
      'FL' => t('Florida'),
      'GA' => t('Georgia'),
      'HI' => t('Hawaii'),
      'ID' => t('Idaho'),
      'IL' => t('Illinois'),
      'IN' => t('Indiana'),
      'IA' => t('Iowa'),
      'KS' => t('Kansas'),
      'KY' => t('Kentucky'),
      'LA' => t('Louisiana'),
      'ME' => t('Maine'),
      'MD' => t('Maryland'),
      'MA' => t('Massachusetts'),
      'MI' => t('Michigan'),
      'MN' => t('Minnesota'),
      'MS' => t('Mississippi'),
      'MO' => t('Missouri'),
      'MT' => t('Montana'),
      'NE' => t('Nebraska'),
      'NV' => t('Nevada'),
      'NH' => t('New Hampshire'),
      'NJ' => t('New Jersey'),
      'NM' => t('New Mexico'),
      'NY' => t('New York'),
      'NC' => t('North Carolina'),
      'ND' => t('North Dakota'),
      'OH' => t('Ohio'),
      'OK' => t('Oklahoma'),
      'OR' => t('Oregon'),
      'PA' => t('Pennsylvania'),
      'RI' => t('Rhode Island'),
      'SC' => t('South Carolina'),
      'SD' => t('South Dakota'),
      'TN' => t('Tennessee'),
      'TX' => t('Texas'),
      'UT' => t('Utah'),
      'VT' => t('Vermont'),
      'VA' => t('Virginia'),
      'WA' => t('Washington'),
      'WV' => t('West Virginia'),
      'WI' => t('Wisconsin'),
      'WY' => t('Wyoming'),
    );
  }
    /**
   * Notify user about the new subscription.
   *
   * @param \Drupal\affiliate_program\ $module
   */
  public function notifyToSupport($user_name, $uid) {
    global $base_secure_url;
    $link_url = $base_secure_url.'/affiliate/application?uid='.$uid;
    $mailManager = \Drupal::service('plugin.manager.mail');
    try {
      // Send the email.
      $to = 'support@kaboodlemedia.com';
      $langcode = LanguageInterface::LANGCODE_SITE_DEFAULT;
      $message = "A new Affiliate Application has been submitted by ".$user_name.", uid-".$uid.". <a href=\"".$link_url."\">View it here</a>.";
      $params = [
        'subject' => "New Affiliate Application",
        'message' => $message,
      ];
      // Set a unique key for this mail.
      $key = 'new_affiliate_application';
      $send = true;
      //$mailManager = new MailManagerInterface();
      //$message = $mailManager->mail('affiliate_program', $key, $to, $langcode, $params);
      $result = $mailManager->mail('affiliate_program', $key, $to, $langcode, $params, NULL, $send);
      if ($result['result']) {
        \Drupal::logger('affiliate_program')->notice('Successfully sent email to @recipient about "@user_name".',
          array(
            '@recipient' => $to,
            '@user_name' => $user_name,
          ));
      }
      else {
        \Drupal::logger('mail-log')->error('There was a problem sending your email notification to @recipient about "@user_name".',
          array(
            '@recipient' => $to,
            '@user_name' => $user_name,
          ));
      }
    }
    catch (\Exception $e) {
      watchdog_exception('affiliate_program', $e);
    }
  }
}
