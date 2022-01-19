<?php

namespace Drupal\km_subscription_system\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\RedirectResponse;
/**
 * Class ValidateCodeController.
 */
class ValidateCodeController extends ControllerBase {

  /**
   * Validatecode.
   *
   * @return string
   *   Return Hello string.
   */
  public function validatecode() {
    \Drupal::service('page_cache_kill_switch')->trigger();
    $email = base64_decode($_GET['ees']);
    $time = $_GET['tes'];
    $code = $_GET['ccd'];
    $ids = \Drupal::entityQuery('user')
      ->condition('mail', $email)
      ->execute();
    if (empty($ids)) {
      $getrequesttime = \Drupal::time()->getRequestTime() - 86400;
      $query = \Drupal::database()->select('km_subscription_system', 'ks');
      $query->fields('ks');
      $query->condition('email', $email);
      $query->condition('created',  $getrequesttime, '>');
      $query->range(0, 1);
      $codestatus = $query->execute()->fetchAll();
      if($codestatus) {
        $datavalue = $codestatus[0];
        if(sha1($datavalue->randomcode) == $code) {
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
         // $_SESSION['km_subscription_system_user_id'] = $user->id();
          $id = $user->id();
          $customer = \Drupal::service('stripe_subscription_and_customer.stripe_api')->getCustomersID($id);
          $subscription = \Drupal::service('stripe_subscription_and_customer.stripe_api')->createSubscription($customer->id, $term_data[$datavalue->stype]['stripe_price'], $term_data[$datavalue->stype]['free_trial_days']);
          $data = \Drupal::service('stripe_subscription_and_customer.stripe_api')->updateSubscriptiondrupal($customer->id, $subscription->id, $id);
          $user = \Drupal::entityTypeManager()->getStorage('user')->load($id);
          $user->set('stripe_customer_id', $customer->id);
          $user->set('stripe_subscription_id', $subscription->id);
          $user->save();
          user_login_finalize($user);
          $response = new RedirectResponse('/');
          $response->send();
          return $response;
        }
        else {
          return [
            '#type' => 'markup',
            '#markup' => $this->t('We\'re sorry, this link has already been used or has expired.</br> If you believe you reached this message in error please contact <a href="mailto:support@kaboodlemedia.com" style="color:#023364;" target="_blank">support@kaboodlemedia.com</a>.')
          ];
        } 
      }
      $res = "false";
    }
    else {
		  return [
		    '#type' => 'markup',
		    '#markup' =>  $this->t('We\'re sorry, this link has already been used or has expired.</br> If you believe you reached this message in error please contact <a href="mailto:support@kaboodlemedia.com" style="color:#023364;" target="_blank">support@kaboodlemedia.com</a>.')
		  ];
    }
  }
}
