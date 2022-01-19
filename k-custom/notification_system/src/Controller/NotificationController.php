<?php
 
/**
* @file
* Contains \Drupal\notification_system\Controller\NotificationController.php
*/
namespace Drupal\notification_system\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\user\Entity\User;
use Drupal\taxonomy\Entity\Term;
use Drupal\user\UserInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;

class NotificationController extends ControllerBase {
	
	/**
	 * Custom callback function for initiating notification mail on certain events
	 * here $key is feature name associated with Notification Settings terms
	 */
	public function mail_format($key, $to, $first_name, $body){	
		$send_mail = \Drupal::service('plugin.manager.mail');
		$module = 'notification_system';
		$langcode = \Drupal::currentUser()->getPreferredLangcode();
		$from = 'support@kaboodlemedia.com';
		$params['message']['headers'] = array(
			'content-type' => 'text/html',
			'MIME-Version' => '1.0',
			'reply-to' => $from,
			'from' => 'KaboodleMedia <'.$from.'>'
		);
		$params['subject'] = "Kaboodle Media - $key notification";
		$send = true;
		$mail_logo = 'https://s3.us-west-2.amazonaws.com/kaboodlemedia.com/s3fs_public/kaboodle-media-horizontal-web.png';
		
		$theme_body['theme_data'] = array(
			'#theme' => 'notification_mail_template',
			'#mail_body' => $body,
			'#first_name' => $first_name,
			'#mail_logo' => $mail_logo,
      '#mail_year' => date("Y"),
		);
		$mail_body = drupal_render($theme_body);
		$params['message'] = $mail_body;
		
		$result = $send_mail->mail($module, $key, $to, $langcode, $params, NULL, $send);
		if ($result['result'] !== true) {
			drupal_set_message(t('There was a problem sending your message and it was not sent.'), 'error');
		}
	}
 
	/**
   * {@inheritdoc}
	 * $notification_type = Notification settings term name
	 * Array $real_text
	 * $notify_uid = user id for which notification generated
   */
  public function addContent($notification_type, $real_text, $notify_uid) {
		//$uid = \Drupal::currentUser()->id();
		$user = User::load($notify_uid);
		$pfname = $user->get('field_preferred_first_name')->value;	
		$fname = $user->get('field_first_name')->value;
		$first_name = empty($pfname) ? $fname : $pfname;
		$email = $user->getEmail();
		$term = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadByProperties(['name' => $notification_type, 'vid' => 'notifications']);
		$term = reset($term);
		$term_id = $term->id();
		$feature_name = $term->field_notification_feature->value;
    $email_subject = '';
    $notification_email_subject =  $term->field_email_subject->value;
    if($notification_email_subject == ''){
      $email_subject = 'Kaboodle Media - '.$feature_name.' notification'; ;
    }else{
      //$email_subject = $notification_email_subject;
      //replace subject of email with tocken
      $email_subject = $this->custom_token_replace($notification_email_subject, $real_text, $notification_type);
    }
		$send_email = $term->field_send_email->value;
		$full = $this->custom_token_replace($term->field_notification_full_message->value, $real_text, $notification_type);
		$short = $this->custom_token_replace($term->field_notification_short_message->value, $real_text, $notification_type);
		
    //add notification content
		$result = \Drupal::database()->insert('notifications')
          ->fields([
            'uid',
            'entity_id',
            'feature_name',
            'full_message',
            'short_message',
            'email',
            'created',
            'changed',
          ])
          ->values([
						$notify_uid,
						$term_id,
						$feature_name,
						$full,
						strip_tags($short),
						$send_email,
						time(),
						time(),
					])
          ->execute();

		$mail_flag = ($send_email == 1) ? true : false;
		if($mail_flag){
			$this->mail_format($email_subject, $email, $first_name, $full);
		}
  }
	
	/**
   * {@inheritdoc}
   */
  public function addNotification($notification_type, $real_text, $notify_uid, $email = null) {
	if($notify_uid > 0){
	  $this->addContent($notification_type, $real_text, $notify_uid);	
	}  
	else{
	  $this->addContentAnonymous($notification_type, $real_text, $email);	
	}
  }
   public function addContentAnonymous($notification_type, $real_text, $notify_email) {
		$first_name = '';
		$email = $notify_email;
		$term = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadByProperties(['name' => $notification_type, 'vid' => 'notifications']);
		$term = reset($term);
		$term_id = $term->id();
		$feature_name = $term->field_notification_feature->value;
    $email_subject = '';
    $notification_email_subject =  $term->field_email_subject->value;
    if($notification_email_subject == ''){
      $email_subject = 'Kaboodle Media - '.$feature_name.' notification'; ;
    }else{
      //$email_subject = $notification_email_subject;
      //replace subject of email with tocken
      $email_subject = $this->custom_token_replace($notification_email_subject, $real_text);
    }
		$send_email = $term->field_send_email->value;
		$full = $this->custom_token_replace($term->field_notification_full_message->value, $real_text);
		$short = $this->custom_token_replace($term->field_notification_short_message->value, $real_text);
		$mail_flag = ($send_email == 1) ? true : false;
		if($mail_flag){
			$this->mail_format($email_subject, $email, $first_name, $full);
		}
  }

  /**
   * {@inheritdoc}
   */
 /*  public function removeNotification(UserInterface $account) {
    if ($member = $this->getNotification($account)) {
      $member->getGroupContent()->delete();
    }
  } */

  /**
   * {@inheritdoc}
   */
  /* public function getNotification(AccountInterface $account) {
    return $this->membershipLoader()->load($this, $account);
  } */
	
	/**
	 * Callback function custom_token_replace()
   * to replaced the custom token with real text
   * @return $message
   **/
	public function custom_token_replace($message, $data, $type) {
    if(in_array($type, ['Video Ready', 'Video Processing Failed'])) {
      $tokens = [];
      $token_values = [];
      foreach($data as $token => $value) {
        $tokens[] = '/\{\$'.$token.'\}/is';
        $token_values[] = $value;
      }
      $message = preg_replace($tokens, $token_values, $message);
    }else{
      $tokens = array(
        '/\{\$team_name\}/is',
        '/\{\$team_owner_name\}/is',
        '/\{\$invitee_name\}/is',
        '/\{\$media_kit_owner\}/is',
        '/\{\$kaboodle_name\}/is',
        '/\{\$kaboodle_owner\}/is',
        '/\{\$user_first_name\}/is',
        '/\{\$media_vault_storage_allocation\}/is',
        '/\{\$media_vault_storage_used\}/is',
        '/\{\$customer_first_name\}/is',
        '/\{\$next_billing_date\}/is',
        '/\{\$uid\}/is',
        '/\{\$uuid\}/is',
        '/\{\$trial_end_date\}/is',
        '/\{\$video_name\}/is',
      );
      $message = preg_replace($tokens, $data, $message);
    }
    
		return $message;
	}
}
