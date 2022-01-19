<?php

namespace Drupal\stripe_subscription_and_customer\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\EventDispatcher\Event;
use Drupal\Core\Language\LanguageInterface;
use Drupal\Core\Logger\LoggerChannelFactory;
use Drupal\Core\Mail\MailManagerInterface;
use Drupal\stripe_subscription_and_customer\Event\SubscriptionEvent;
use Drupal\stripe_subscription_and_customer\Event\SubscriptionEvents;
use Drupal\stripe_subscription_and_customer\Event\InvoiceEvent;
use Drupal\stripe_subscription_and_customer\Event\InvoiceEvents;
use Drupal\taxonomy\Entity\Term;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\user\Entity\User;


/**
 * Class StripeWebhookSubscriptionSubscriber.
 */
class StripeWebhookSubscriptionSubscriber implements EventSubscriberInterface {

  /**
   * Stripe Webhooks logging channel.
   *
   * @var \Drupal\Core\Logger\LoggerChannelFactory
   */
  protected $logger;

  /**
   * The mail manager service.
   *
   * @var \Drupal\Core\Mail\MailManagerInterface
   */
  protected $mailManager;
  /**
   * Constructs a new StripeWebhookSubscriptionSubscriber object.
   */
  public function __construct(LoggerChannelFactory $logger_channel, MailManagerInterface $mail_manager) {
    $this->logger = $logger_channel->get('stripe_webhooks_example');
    $this->mailManager = $mail_manager;
  }
  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    // $events['notifyNewSubscription'] = ['notifyNewSubscription'];
    $events[SubscriptionEvents::CUSTOMER_SUBSCRIPTION_CREATED][] = ['notifyNewSubscription'];
    $events[SubscriptionEvents::CUSTOMER_SUBSCRIPTION_UPDATED][] = ['notifyUpdateSubscription'];
    $events[SubscriptionEvents::CUSTOMER_SUBSCRIPTION_TRIAL_WILL_END][] = ['notifyTrailwillendSubscription'];
    $events[InvoiceEvents::INVOICE_PAYMENT_FAILED][] = ['payment_failed'];
    $events[InvoiceEvents::INVOICE_PAYMENT_SUCCEEDED][] = ['payment_succeeded'];
    $events[InvoiceEvents::INVOICE_UPCOMING][] = ['payment_upcoming'];
    $events[KernelEvents::REQUEST][] = ['checkForUserSubscription'];
    return $events;
  }

  /**
   * This method is called when the notifyNewSubscription is dispatched.
   *
   * @param \Symfony\Component\EventDispatcher\Event $event
   *   The dispatched event.
   */
  /*public function notifyNewSubscription(Event $event) {
    \Drupal::messenger()->addMessage('Event notifyNewSubscription thrown by Subscriber in module stripe_subscription_and_customer.', 'status', TRUE);
  }*/
  /**
   * Notify user about the new subscription.
   *
   * @param \Drupal\stripe_subscription_and_customer\Event\SubscriptionEvent $event
   */
  public function notifyNewSubscription(SubscriptionEvent $event) {
    try {
      // Get the Stripe event.
      $subscription = $event->getSubscription();
      // Get the customer data.
      $customer = $event->getCustomer();
      $config = \Drupal::config('stripe_subscription_and_customer.adminconfiguration');
      $mail_tid = $config->get('mail_tid');
      // Send the email.
      $to = $customer->email;
      $term = Term::load($mail_tid);
      $s = $term->get('field_email_subject')->getValue();
      $m = $term->get('field_notification_full_message')->getValue();
      $langcode = LanguageInterface::LANGCODE_SITE_DEFAULT;
      $trail_end_raw = $subscription->__get('data')['object']['trial_end'];
     // $customer_first_name = explode(" ",$customer->name)[0];
      $customer_user_id = $customer->metadata->user_uid;
      $customer_first_name = user_real_first_name($customer_user_id);
      $trail_end = date('n/j/Y', $trail_end_raw);
      $message = $m[0]['value'];
      $message = str_replace('{$trial_end_date}', $trail_end, $message);
      $message = str_replace('{$customer_first_name}', $customer_first_name, $message);
      $params = [
        'subject' => $s[0]['value'],
        'message' => $message,
      ];

      // Set a unique key for this mail.
      $key = 'stripe_subscription_and_customer_subscription_event';

      $message = $this->mailManager->mail('stripe_subscription_and_customer', $key, $to, $langcode, $params);
      if ($message['result']) {
        $this->logger->notice('Successfully sent email to %recipient.', ['%recipient' => $to]);
      }
    }
    catch (\Exception $e) {
      watchdog_exception('stripe_subscription_and_customer', $e);
    }
  }

  /**
   * Notify user about the update subscription.
   *
   * @param \Drupal\stripe_subscription_and_customer\Event\SubscriptionEvent $event
   */
  public function notifyUpdateSubscription(SubscriptionEvent $event) {
    /*try {
      // Get the Stripe event.
      $subscription = $event->getSubscription();
      // Get the customer data.
      $customer = $event->getCustomer();
      $config = \Drupal::config('stripe_subscription_and_customer.adminconfiguration');
      $mail_tid_update = $config->get('mail_tid_update');
      if(isset($mail_tid_update)) {
        // Send the email.
        $to = $customer->email;
        $term = Term::load($mail_tid_update);
        $s = $term->get('field_email_subject')->getValue();
        $m = $term->get('field_notification_full_message')->getValue();
        $langcode = LanguageInterface::LANGCODE_SITE_DEFAULT;
        $trail_end_raw = $subscription->__get('data')['object']['trial_end'];
       // $customer_first_name = explode(" ",$customer->name)[0];
        $customer_user_id = $customer->metadata->user_uid;
        $customer_first_name = user_real_first_name($customer_user_id);
        $trail_end = date('n/j/Y', $trail_end_raw);
        $message = $m[0]['value'];
        $message = str_replace('{$trial_end_date}', $trail_end, $message);
        $message = str_replace('{$customer_first_name}', $customer_first_name, $message);
        $params = [
          'subject' => $s[0]['value'],
          'message' => $message,
        ];

        // Set a unique key for this mail.
        $key = 'stripe_subscription_and_customer_subscription_event';

        $message = $this->mailManager->mail('stripe_subscription_and_customer', $key, $to, $langcode, $params);
        if ($message['result']) {
          $this->logger->notice('Successfully sent email to %recipient.', ['%recipient' => $to]);
        }
      }
    }
    catch (\Exception $e) {
      watchdog_exception('stripe_subscription_and_customer', $e);
    }*/
  }
    /**
   * Notify user about the Trail subscription will end.
   *
   * @param \Drupal\stripe_subscription_and_customer\Event\SubscriptionEvent $event
   */
  public function notifyTrailwillendSubscription(SubscriptionEvent $event) {
    try {
      // Get the Stripe event.
      //this is trail period data
      $subscription = $event->getSubscription();
      // Get the customer data.
      $customer = $event->getCustomer();
      $config = \Drupal::config('stripe_subscription_and_customer.adminconfiguration');
      $mail_tid = $config->get('mail_tid_notify');
      if(isset($mail_tid)) {
        // Send the email.
        $to = $customer->email;
        $term = Term::load($mail_tid);
        $s = $term->get('field_email_subject')->getValue();
        $m = $term->get('field_notification_full_message')->getValue();
        $langcode = LanguageInterface::LANGCODE_SITE_DEFAULT;
        $trail_end_raw = $subscription->__get('data')['object']['trial_end'];
       // $customer_first_name = explode(" ",$customer->name)[0];
        $customer_user_id = $customer->metadata->user_uid;
        $customer_first_name = user_real_first_name($customer_user_id);
        $trail_end = date('n/j/Y', $trail_end_raw);
        $message = $m[0]['value'];
        $message = str_replace('{$trial_end_date}', $trail_end, $message);
        $message = str_replace('{$customer_first_name}', $customer_first_name, $message);
        $message = str_replace('{$uid}', $customer_user_id, $message);
        $params = [
          'subject' => $s[0]['value'],
          'message' => $message,
        ];

        // Set a unique key for this mail.
        $key = 'stripe_subscription_and_customer_subscription_event';

        $message = $this->mailManager->mail('stripe_subscription_and_customer', $key, $to, $langcode, $params);
        if ($message['result']) {
          $this->logger->notice('Successfully sent email to %recipient.', ['%recipient' => $to]);
        }
      }
    }
    catch (\Exception $e) {
      watchdog_exception('stripe_subscription_and_customer', $e);
    }
  }
  /**
  * Notify user about the payment failed.
  *
  * @param \Drupal\stripe_subscription_and_customer\Event\InvoiceEvent $event
  */
  function payment_failed(InvoiceEvent $event) {
    $config = \Drupal::config('stripe_subscription_and_customer.adminconfiguration');
    try {
      // Get the Stripe event.
      $invoice = $event->getInvoice();
      $next_payment_attempt =  $invoice->__get('data')['object']['next_payment_attempt'];
      $number =  $invoice->__get('data')['object']['number'];
      $paid =  $invoice->__get('data')['object']['paid'];
      $status =  $invoice->__get('data')['object']['status'];
      // Get the customer data.
      $customer = $event->getCustomer();
      // Send the email.
      $to = $customer->email;
      $customer_user_id = $customer->metadata->user_uid;
      $customer_first_name = user_real_first_name($customer_user_id);
      if ($next_payment_attempt != '') {
         // On payment fail and retry for payment.
        $mail_tid = $config->get('mail_tid_failed');
        $term = Term::load($mail_tid);
        $s = $term->get('field_email_subject')->getValue();
        $m = $term->get('field_notification_full_message')->getValue();
        $langcode = LanguageInterface::LANGCODE_SITE_DEFAULT;
        
        
        $message = $m[0]['value'];
        $message = str_replace('{$uid}', $customer_user_id, $message);
        $message = str_replace('{$customer_first_name}', $customer_first_name, $message);
        $params = [
          'subject' => $s[0]['value'],
          'message' => $message,
        ];
        // Set a unique key for this mail.
        $key = 'stripe_subscription_and_customer_subscription_event';
        $message = $this->mailManager->mail('stripe_subscription_and_customer', $key, $to, $langcode, $params);
        if ($message['result']) {
          $this->logger->notice('Successfully sent email to %recipient.', ['%recipient' => $to]);
        }
      } else {
        // On payment fail after final try
        $mail_tid = $config->get('mail_tid_failed_cancel');
        $term = Term::load($mail_tid);
        $s = $term->get('field_email_subject')->getValue();
        $m = $term->get('field_notification_full_message')->getValue();
        $langcode = LanguageInterface::LANGCODE_SITE_DEFAULT;
        
        //remove user roles and unset status.
        $user =  \Drupal\user\Entity\User::load($customer_user_id);
        $user->removeRole('enterprise');
        $user->removeRole('content_creator');
        $user->removeRole('advanced_content_creator');
        //Save user account
        $user->save();
        
        $message = $m[0]['value'];
        $message = str_replace('{$uid}', $customer_user_id, $message);
        $message = str_replace('{$customer_first_name}', $customer_first_name, $message);
        $params = [
          'subject' => $s[0]['value'],
          'message' => $message,
        ];
        // Set a unique key for this mail.
        $key = 'stripe_subscription_and_customer_subscription_event';
        $message = $this->mailManager->mail('stripe_subscription_and_customer', $key, $to, $langcode, $params);
        if ($message['result']) {
          $this->logger->notice('Successfully sent email to %recipient.', ['%recipient' => $to]);
        }
      }
      $this->logger->notice('Successfully sent email to %recipient', ['%recipient' => $to]);
    }
    catch (\Exception $e) {
      watchdog_exception('stripe_subscription_and_customer', $e);
    }
  }

  /**
  * Notify user about the payment succeeded.
  *
  * @param \Drupal\stripe_subscription_and_customer\Event\InvoiceEvent $event
  */
  function payment_succeeded(InvoiceEvent $event) {
    try {
      // Get the Stripe event.
      $invoice = $event->getInvoice();

      // Get the customer data.
      $customer = $event->getCustomer();
      $this->logger->notice('detail json for invoice %invoice and customer %customer', ['%customer' => $customer, '%invoice' => $invoice]);
    }
    catch (\Exception $e) {
      watchdog_exception('stripe_subscription_and_customer', $e);
    }
  }

  /**
  * Notify user about the payment upcoming.
  *
  * @param \Drupal\stripe_subscription_and_customer\Event\InvoiceEvent $event
  */
  function payment_upcoming(InvoiceEvent $event) {
    try {
      // Get the Stripe event.
      $invoice = $event->getInvoice();

      // Get the customer data.
      $customer = $event->getCustomer();
    }
    catch (\Exception $e) {
      watchdog_exception('stripe_subscription_and_customer', $e);
    }
  }
  public function checkForUserSubscription(GetResponseEvent $event){
    $uid = (int)\Drupal::currentUser()->id();
    $user_detail = User::load($uid);
    $user_roles = $user_detail->getRoles();
    $path = \Drupal::request()->getpathInfo();
    $arg  = explode('/',$path);
    //if(!in_array('administrator', $user_roles) && $arg[4] == 'billing'){
    if(!in_array('administrator', $user_roles)){
      $customer_id = $user_detail->get('stripe_customer_id')->value;
      if (isset($customer_id) && !empty($customer_id)) {
        $subscription_id = $user_detail->get('stripe_subscription_id')->value;
        if (isset($subscription_id) && !empty($subscription_id)) {
          $subscription = \Drupal::service('stripe_subscription_and_customer.stripe_api')->retrieveSubscription($subscription_id);
          $cancel_at = $subscription->cancel_at;
          if(!empty($cancel_at) && time() > $cancel_at) {
            $user_detail->addRole('canceled');
            foreach($user_roles as $role){
              if($role !== 'authenticated' && $role !== 'canceled'){
                $user_detail->removeRole($role);
              }
            }
            $user_detail->set('stripe_subscription_id', '');
            $user_detail->set('field_addition_data_subscription', '');
            $user_detail->save();
            //user_logout();
            if(!isset($_SESSION['subscription_cancel'])){
              $_SESSION['subscription_cancel'] = 1;
              $response = new RedirectResponse('/reactivate');
              $response->send();
              exit(0);
            }
          }
        }
        else { //if($arg[1] !== 'reactivate' && $arg[1] !== 'user') {
          //user_logout();
          if(!isset($_SESSION['subscription_cancel'])){
            $_SESSION['subscription_cancel'] = 1;
            $response = new RedirectResponse('/reactivate');
            $response->send();
            exit(0);
          }
        }
      }
    }
  }
}
