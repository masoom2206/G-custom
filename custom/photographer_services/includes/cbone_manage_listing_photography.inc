<?php

function cbone_manage_listing_photography($new) {
  $regoin = node_load($new);
  $use = user_load($regoin->uid);
  $next = $use->field_region['und'];
  $term_list = array();
  foreach ($next as $key => $tid) {
    $term_list[] = taxonomy_term_load($tid['tid'])->name;
  }
  $i = 0;
  foreach($term_list as $key => $value) {
    if ($i == 0 ) {
      $tt = $value;
    } else {
      $tt .= ','.$value;
    }
    $i++;
  }
  $tt = str_replace('&', '&amp;', $tt); 
  $data = drupal_http_build_query(array('terms' => $tt));
  $url = 'http://services.cbone.me/agent-details/user-details-access.json?'.$data;
  $result = drupal_http_request($url);
  $content = $result->data;
  $json = json_decode($content, true);
  $return = '';
  foreach ($json as $key => $value) {
    $return .= theme('protographer_template', array('data' => $value));
  }
  return theme('protographer_template_base', array('data' => array('profile' => $return)));
}

function cbone_manage_listing_photography_profile($lnid, $uid) {
  $regoin = node_load($lnid);
  $use = user_load($regoin->uid);
  $next = $use->field_region['und'];
  $term_list = array();
  foreach ($next as $key => $tid) {
    $term_list[] = taxonomy_term_load($tid['tid'])->name;
  }
  $i = 0;
  foreach($term_list as $key => $value) {
    if ($i == 0 ) {
      $tt = $value;
    } else {
      $tt .= ','.$value;
    }
    $i++;
  }
  $tt = str_replace('&', '&amp;', $tt); 
  $data = drupal_http_build_query(array('terms' => $tt, 'uid' => $uid));
  $url = 'http://services.cbone.me/agent-details/user-details-access-profile.json?'.$data;
  $result = drupal_http_request($url);
  $content = $result->data;
  $json = json_decode($content, true);
  $return = '';
  foreach ($json as $key => $value) {
    $return .= theme('protographer_detail_profile_template', array('data' => $value));
  }
  return $return;
}
