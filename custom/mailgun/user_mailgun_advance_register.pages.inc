<?php
/**
 * Validation callback for user subscription form.
 */
function user_mailgun_advance_register_form($form, &$form_state) {
  global $user;
  $account = $form_state['build_info']['args'][0];
  $mgClient = mailgun_get_client();
  # Issue the call to the client.
  $result = $mgClient->get("lists/pages", array(
    'limit' => 50
  ));
  $options = array(
     '0' => 'Un-Subscribe',
     '1' => 'Subscribe for all mail(normal delivery)',
  );
  $form['sub_pre'] = array(
    '#markup' => t('Join mailing list to receive or participate in its discussion via email.')
  );  
  if (isset($result->http_response_body)) {
    $items = $result->http_response_body->items;
    if (isset($items)) {
      foreach ($items as $key => $value) {
        $listAddress = $value->address;
        $memberAddress = $account->mail;
        $statu = NULL;
        try {
          $resultw = $mgClient->get("lists/$listAddress/members/$memberAddress");
          if (isset($resultw->http_response_body)) {
            if (isset($resultw->http_response_body->member)){
              $statu = $resultw->http_response_body->member->subscribed;
              $mod =  $resultw->http_response_body->member->vars->moderate;
              
              # Issue the call to the client.
              if (isset($resultw->http_response_body->member->subscribed) && empty($resultw->http_response_body->member->subscribed)) {
                $statu = 0;
              }
            }
          }            
        } catch (Exception $e) {
          
        }
        $form['mailing_'.$value->address] = array(
          '#type' => 'radios',
          '#title' => t($value->address),
          '#options' => $options,
          '#default_value' => $statu,
        );
        if (in_array('Administrator', $user->roles) || in_array('Siteadmin', $user->roles)) {
          $form['moderate_'.$value->address] = array(
            '#type' => 'checkbox',
            '#title' => t('Moderate'),
            '#default_value' => $mod,
          );
        }
      }
    } 
  }
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => 'Submit',
  );
  return $form;
}

function user_mailgun_advance_register_form_submit($form, $form_state) {
  global $user;
  $account = $form_state['build_info']['args'][0];
  $mgClient = mailgun_get_client();
  # Issue the call to the client.
  $result = $mgClient->get("lists/pages", array(
    'limit' => 50
  ));
  if (isset($result->http_response_body)) {
    $items = $result->http_response_body->items;
    if (isset($items)) {
      foreach ($items as $key => $value) {
        $status = NULL;
        $add = str_replace('.', '_', $value->address);
        $status = $form_state['input']['mailing_'.$add];
        $moderate = 0;
        if (isset($form_state['input']['moderate_'.$add])) {
          $moderate = $form_state['input']['moderate_'.$add];
        }
        if (isset($status)) {
          $listAddress = $value->address;
          $mail  = $account->mail;
          $name = (isset($account->realname)) ? $account->realname : $account->name;
          $subuscription = $status;
          $statu = NULL;
          try {
            $mgClient = mailgun_get_client();
            $resultw = $mgClient->get("lists/$listAddress/members/$mail");
            if (isset($resultw->http_response_body)) {
              if (isset($resultw->http_response_body->member)){
                $statu = $resultw->http_response_body->member->subscribed;
                # Issue the call to the client.
               // print_r($resultw->http_response_body->member); exit;
                if (isset($resultw->http_response_body->member) && empty($resultw->http_response_body->member->subscribed)) {
                  $statu = 0;
                }
              }
            }
          } catch (Exception $e) {
          }
          if (isset($statu)) {
            $mgClient = mailgun_get_client();
            $var = array('moderate' => (int)$moderate);
            if (in_array('Administrator', $user->roles) || in_array('Siteadmin', $user->roles)) {
              $results = $mgClient->put("lists/$listAddress/members/$mail", array(
                'subscribed' => $status,
                'name'       => $name,
                'vars'        => drupal_json_encode($var)
              ));
              if ((int)$moderate == 1 ) {
                moderate_subscription_set($mail, $value->address);
              }
            }
            else {
              $results = $mgClient->put("lists/$listAddress/members/$mail", array(
                'subscribed' => $status,
                'name'       => $name,
              ));
            }
          }
          else {
            $mgClient = mailgun_get_client();
            $var = array('moderate' => (int)$moderate);
            if (in_array('Administrator', $user->roles) || in_array('Siteadmin', $user->roles)) {
              $resulta = $mgClient->post("lists/$listAddress/members", array(
                'address'     => $mail,
                'name'        => $name,
                'description' => '',
                'subscribed'  => $subuscription,
                'vars'        => drupal_json_encode($var)
              ));
              if ((int)$moderate == 1 ) {
                moderate_subscription_set($mail, $value->address);
              }
            }
            else {
              $resulta = $mgClient->post("lists/$listAddress/members", array(
                'address'     => $mail,
                'name'        => $name,
                'description' => '',
                'subscribed'  => $subuscription,
              ));            
            }
          }
        }
      }
    } 
  }
  drupal_set_message('Your subscription has been updated.');
}

function moderate_subscription_set($mail, $submail) {
  global $base_url;
  $mgClient = mailgun_get_client();
  $result = $mgClient->post("routes", array(
    'priority'    => 0,
    'expression'  => '(match_header("form", ".*<'.$mail.'>") and match_header("to", "'.$submail.'"))',
    'action'      => array('store(notify="'.$base_url.'/callback")', 'stop()'),
    'description' => 'Sample route'
  ));
}

function moderate_subscription_del($mail, $submail) {
  global $base_url;
  $result = $mgClient->delete("routes", array(
    'id'    => 0,
  ));
}
