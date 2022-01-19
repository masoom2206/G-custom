<?php

/**
 * @file
 * Contains \Drupal\my_kaboodles\Controller\KaboodlesController.php
 *
 */

namespace Drupal\my_kaboodles\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;
use Drupal\image\Entity\ImageStyle;
use Drupal\node\NodeInterface;
use Drupal\taxonomy\Entity\Term;      
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\paragraphs\Entity\Paragraph;
use Drupal\my_groups\Controller\MyGroupsController;
use Drupal\Core\Access\AccessResult;
use Drupal\s3fs\S3fsService;

/**
 * Defines KaboodlesController class.
 */
class KaboodlesDashboardController extends ControllerBase {
  
  /**
  * Display the my-kaboodles page markup.
  *
  * @return array
  */
  public function content(NodeInterface $node) {
    $user_detail = array();
    $nid = $node->id();
    $uid = $node->getOwnerId();
    $kaboodle_owner = $uid;
    $kaboodle_title = $node->get('title')->value;
    //$pps_status_value = $node->get('field_pps_status')->target_id;
    $user_detail['uid'] = $uid;
    $account = user_load($uid);
    $me = \Drupal::currentUser();
    $roles = $me->getRoles();
    $professionalUser = 0;
    if(in_array('content_creator', $roles) && !in_array('advanced_content_creator', $roles)){
      $professionalUser = 1;
    }
    
    // product icon
    $config = \Drupal::config('s3fs.settings')->get();
    $s3 = \Drupal::service('s3fs')->getAmazonS3Client($config);
    $key = 'images/icon/pps';
    $product_status_icon = $s3->getObjectUrl($config['bucket'], $key).'/arrow-alt-square-right.png';
    
    //Group/team functionality
    /* $t = new MyGroupsController();
    $members = $t->getAllTeamMembersInfo($node->field_team->target_id);
    $all_members = [];
    foreach ($members as $member) {
      if($member->uid == $member->entity_id){
        $owner = $member->uid;
      }
      $all_members[] = $member->entity_id;
    } */
    $kaboodle_owner_view = false;
    $kaboodle_member_view = true;
    if(\Drupal::currentUser()->id() == $kaboodle_owner){
      $kaboodle_owner_view = true;
      $kaboodle_member_view = false;
    }
    /* if(in_array(\Drupal::currentUser()->id(), $all_members)){
      $kaboodle_member_view = true;
    } */
    //get referenced team name on kaboodle node
    $referenced_team_id = $node->field_team->target_id;
    $referenced_team_name = $referenced_team_owner_uid = $referenced_team_owner_name = '';
    if(!empty($referenced_team_id)){
      $referenced_team_name = getTeam($referenced_team_id);
      $referenced_team_owner_uid = getTeamOwner($referenced_team_id);
      if(!empty($referenced_team_owner_uid)){
        $referenced_team_owner_name = user_real_name($referenced_team_owner_uid);
      }	
    }
    $team = [];
    $team = ['referenced_team_id' => $referenced_team_id, 'referenced_team_name' => ucfirst($referenced_team_name), 'referenced_team_owner_uid' => $referenced_team_owner_uid, 'referenced_team_owner_name' => $referenced_team_owner_name, 'kaboodle_owner_view' => $kaboodle_owner_view, 'kaboodle_member_view' => $kaboodle_member_view];
    
    //Dashboard links START
    $dashboard_links = array();
    $dashboard_links[0]['title'] = $this->t('My Kaboodles');
    $dashboard_links[0]['link'] = '/tools/my-kaboodles/'.$uid;
    //$dashboard_links[1]['title'] = $this->t('Media Vault');
    //$dashboard_links[1]['link'] = '/tools/media/vault/'.$uid;
    $dashboard_links[2]['title'] = $this->t('Video Maker');
    $dashboard_links[2]['link'] = '/tools/video/'.$uid;
    $dashboard_links2 = array();
    $dashboard_links2[0]['title'] = $this->t('Notifications');
    $dashboard_links2[0]['link'] = '/tools/notifications/'.$uid;

    if($kaboodle_owner_view == true){
      $dashboard_links2[1]['title'] = $this->t('Settings');
      $dashboard_links2[1]['link'] = '/tools/kaboodle/'.$nid;
      /* $default_media_kit = \Drupal::database()->select('node_field_data', 'n')
        ->fields('n', ['nid'])
        ->condition('n.uid', $uid, '=')
        ->condition('n.type', 'media_kit', '=')
            ->range(0, 1)
        ->execute()
        ->fetchField();
      $dashboard_links2[2]['title'] = $this->t('Media Kit');
      $dashboard_links2[2 ]['link'] = '/tools/media/kit/'.$uid.'/'.$default_media_kit; */
    }

    //Dashboard links END
    $first_name = $account->get('field_first_name')->value;
    $last_name = $account->get('field_last_name')->value;
    $user_detail['user_name'] = $first_name.' '. $last_name;
    $style = ImageStyle::load('image_110x100');
    if (!$account->user_picture->isEmpty()) {
      $avatar = $style->buildUrl($account->user_picture->entity->getFileUri());
    }else{ 
      $field_info = \Drupal\field\Entity\FieldConfig::loadByName('user', 'user', 'user_picture');
      $image_uuid = $field_info->getSetting('default_image')['uuid'];
      $default_image = \Drupal::service('entity.repository')->loadEntityByUuid('file', $image_uuid)->getFileUri();
      $avatar = $style->buildUrl($default_image);
    }
    
    $user_detail['profile_url'] = $avatar;
    $product_details = \Drupal::service('km_product.templates')->getProductTypes($uid, $nid, $product_status_icon);
    return [
      '#theme'                  => 'my_kaboodles_dashboard',
      '#user_detail'            => $user_detail,
      '#nid'                    => $nid,
      '#product_details'        => $product_details,
      '#dashboard_links'        => $dashboard_links,
      '#dashboard_links2'       => $dashboard_links2,
      '#kaboodle_title'         => $kaboodle_title,
      '#kaboodle_title_cap'     => strtoupper($kaboodle_title),
      '#product_status_icon'    => $product_status_icon,
      '#team'                   => $team,
      '#professional_user'      => $professionalUser,
      '#attached' => [
        'library' =>  [
          'my_kaboodles/my_kaboodle_js',
        ],
        'drupalSettings' =>  [
          'uid' => $uid,
        ],
      ],
    ];
  }		
		
  /**
   * Callback function my_kaboodles_shared_content()
   * for shared kaboodles
   **/
  public function kaboodle_pps($icon = false, $name = false){
    $vocabulary_name = 'product_processing_status';
    $query = \Drupal::entityQuery('taxonomy_term');
    $query->condition('vid', $vocabulary_name);
    $query->sort('weight');
    $tids = $query->execute();
    $terms = Term::loadMultiple($tids);
    $pps = [];
    foreach ($terms as $term) {
      //Active Icon
      $term_id = $term->id();
      if($icon){
        $Icon = $term->get('field_icon')->getValue();
        $IconFile = File::load($Icon[0]['target_id']);
        $IconFileUrl = file_create_url($IconFile->getFileUri());
        $pps[$term_id] = [
          'tid' => $term_id,
          'name' => $term->getName(),
          'IconFileUrl' => $IconFileUrl,
        ];
      } else if ($name){
        $pps[$term->getName()] = [
          'tid' => $term_id,
          'name' => $term->getName(),
        ];
      } else {
        $pps[] = [
          'tid' => $term_id,
          'name' => $term->getName(),
        ];
      }
    }
    return $pps;
  }
  
  /**
   * Callback function subscription_pricing()
   * to displayed subscription pricing page
   **/
  public function subscription_pricing() {
    $messages = \Drupal::messenger()->deleteAll();
    $uid = \Drupal::currentUser()->id();
     // get user role
    $cuser = \Drupal::currentUser();
    $roles = $cuser->getRoles();
    $display = '';
    if($roles[0] == 'anonymous'){
      $display = 'all';
    }
    if($roles[0] == 'authenticated' && in_array("content_creator", $roles) ){
       $display = 'Professional';
    }
    if($roles[0] == 'authenticated' && in_array("advanced_content_creator", $roles) ){
       $display = 'Expert';
    }
    $items = array();
    $items2 = array();
    //get terms from feature_list
    $vocabulary_name2 = 'feature_list';
    $vocabulary = \Drupal::entityTypeManager()->getStorage('taxonomy_vocabulary')->load($vocabulary_name2);
    $feature_list_name = $vocabulary->label();
    $feature_list_description = $vocabulary->getDescription();
    $query2 = \Drupal::entityQuery('taxonomy_term');
    $query2->condition('vid', $vocabulary_name2);
    $query2->sort('weight');
    $tids2 = $query2->execute();
    $terms2 = Term::loadMultiple($tids2);
    $site_config = \Drupal::config('system.site');
    $server_name = strtolower($site_config->get('site_server_name'));
    if($server_name == 'dev'){
      $block_professional = \Drupal\block_content\Entity\BlockContent::load(28);
      $block_professional_text  = strip_tags($block_professional->body->value);
      $block_expert = \Drupal\block_content\Entity\BlockContent::load(29);
      $block_expert_text  = strip_tags($block_expert->body->value);
    } else if($server_name == 'staging'){
      $block_professional = \Drupal\block_content\Entity\BlockContent::load(22);
      $block_professional_text  = strip_tags($block_professional->body->value);
      $block_expert = \Drupal\block_content\Entity\BlockContent::load(21);
      $block_expert_text  = strip_tags($block_expert->body->value);
    } else {
      $block_professional = \Drupal\block_content\Entity\BlockContent::load(24);
      $block_professional_text  = strip_tags($block_professional->body->value);
      $block_expert = \Drupal\block_content\Entity\BlockContent::load(23);
      $block_expert_text  = strip_tags($block_expert->body->value);
    }       
    foreach ($terms2 as $term2) {
      $term_id2 = $term2->id();
      $term_Name2 = $term2->getName();
      $role_availability = $term2->get('field_role_availability')->getValue();
      $status = $term2->get('field_status')->getValue()[0]['value'];
      $availability = array();
      foreach($role_availability as $data){
        $paragraph = Paragraph::load($data['target_id']);
        $role_feature = $paragraph->field_role_feature->value;
        $available = $paragraph->field_available->value;
        $limitation = $paragraph->field_limitation->value;
        $limitation_perpage = $paragraph->field_show_on_plans_page->value;
        $check_mark = 0;
        if(empty($limitation)){
          if($available == 1){
            $limitation = 'check-mark.png';
            $check_mark = 1;
          }
          else {
            $limitation = 'x-mark.png';
            $check_mark = 1;
          }
        }
        $availability[$role_feature]['available'] = $available;
        $availability[$role_feature]['limitation'] = $limitation;
        $availability[$role_feature]['limitation2'] = $paragraph->field_limitation->value;
        $availability[$role_feature]['role_feature'] = (isset($roled_feature)) ? $roled_feature : '';
        $availability[$role_feature]['check_mark'] = $check_mark;
        $availability[$role_feature]['check_mark_plan_page'] = $limitation_perpage;
      }
      
      $items2[$term_id2] = array(
        'tid' => $term_id2,
        'name' => $term_Name2,
        'role_availability' => $availability,
        'status' => $status,
      );
    }
    $Professional_feature_list = array();
    $expert_feature_list = array();
    $role_exclude = '';
    if($server_name == 'dev'){
      $role_exclude = 871;
    } elseif($server_name == 'staging'){
      $role_exclude = 601;		
    } else {
      $role_exclude = 601;
    }
    foreach($items2 as $teams2){
      if ($teams2['role_availability']['content_creator']['check_mark_plan_page'] ==  1){
        $Professional_feature_list[$teams2['name']] = $teams2['role_availability']['content_creator']['limitation2'];
      }
      if ($teams2['role_availability']['advanced_content_creator']['check_mark_plan_page'] == 1){
        
        $expert_feature_list[$teams2['name']] = $teams2['role_availability']['advanced_content_creator']['limitation2'];
      }
    }
    // get role feture
    $vocabulary_name = 'role_features';
    $query = \Drupal::entityQuery('taxonomy_term');
    $query->condition('vid', $vocabulary_name);
    $query->sort('weight');
    $tids = $query->execute();
    $terms = Term::loadMultiple($tids);
    foreach ($terms as $term) {
      $term_id = $term->id();
      $reinstatement = $term->get('field_subscription_reinstatement')->getValue();
      $reinstatementValue = isset($reinstatement[0][value]) ? $reinstatement[0][value] : 0;
      if($term_id != $role_exclude && !$reinstatementValue) {
        $term_Name = $term->getName();
        $feature_list = $term->get('field_feature_list')->getValue();
        $description = $term->get('description')->getValue();
        $subscription_rate = $term->get('field_monthly_subscription_rate')->getValue();
        $link_url = $term->get('field_sign_up_url')->getValue();
        $link_label = $term->get('field_sign_up_button_label')->getValue();
        $link_sub_label = $term->get('field_sign_up_button_sub_label')->getValue();
        /*if($term_Name == 'Marketer'){
          $link_url = '/get_start_for_free?sid=0'; //$term->get('field_sign_up_url')->getValue();
          $link_label = 'START FREE TRIAL';
        }
        else if($term_Name == 'Pro Marketer') {
          $link_url = '/get_start_for_free?sid=1'; //$term->get('field_sign_up_url')->getValue();
          $link_label = 'START FREE TRIAL';
        }
        else if($term_Name == 'Enterprise') {
          $link_url = 'javascript:void(0);';
          $link_label = "INQUIRE";
        }*/
        $items[$term_id] = array(
          'tid' => $term_id,
          'name' => $term_Name,
          'feature_list' => $feature_list,
          'description' => isset($description['0']['value']) ? strip_tags($description['0']['value']) : '',
          'subscription_rate' => isset($subscription_rate['0']['value']) ? $subscription_rate['0']['value'] : 0,
          'link_url' => isset($link_url['0']['value']) ? $link_url['0']['value'] : '',
          'link_label' => isset($link_label['0']['value']) ? $link_label['0']['value'] : '',
          'link_sub_label' => isset($link_sub_label['0']['value']) ? $link_sub_label['0']['value'] : '',
          'Professional_feature_list' => $Professional_feature_list,
          'expert_feature_list' => $expert_feature_list,
        );
      }
    }
    return [
      '#theme' => 'subscription_pricing_template',
      '#title'   => $this->t("Select the plan that's right for you"),
      '#uid'   => $uid,
      '#items'   => $items,
      '#items2'   => $items2,
      '#feature_list_name'   => $feature_list_name,
      '#feature_list_description'   => $feature_list_description,
      '#block_professional_text' => $block_professional_text,
      '#block_expert_text' => $block_expert_text,
      '#display' => $display,
    ];
  }
  /**
  * Checks access for kaboodle dashboard page.
  */
  public function kaboodle_dashboard_access() {
    // current user
    $cuser = \Drupal::currentUser();
    $cuid = $cuser->id();
    $roles = $cuser->getRoles();
    // current path
    /* $current_path = \Drupal::service('path.current')->getPath();
    $args = explode('/', $current_path);
    $kaboodle_nid = empty($args[4]) ? 0 : $args[4]; */
    $node = \Drupal::routeMatch()->getParameter('node');
    if($node){
      $kaboodle_owner = $node->getOwnerId();
      $tt = new MyGroupsController();
      $members = $tt->getAllTeamMembersInfo($node->field_team->target_id);
      $all_members = [];
      foreach ($members as $member) {
        if($member->uid <> $member->entity_id && $member->status == 1){
          $all_members[] = $member->entity_id;
        }
      }
      if((in_array($cuid, $all_members) && (in_array('content_creator', $roles) || in_array('advanced_content_creator', $roles) || in_array('designer', $roles) || in_array('enterprise', $roles))) || ($cuid == $kaboodle_owner && (in_array('content_creator', $roles) || in_array('advanced_content_creator', $roles) || in_array('designer', $roles) || in_array('enterprise', $roles))) || in_array('administrator', $roles) ){
        return AccessResult::allowed();
      } else {
        return AccessResult::forbidden();
      }
    }
    // Return 403 Access Denied page.  
    return AccessResult::forbidden();
  }
  /**
   * Update PPS status on kaboodle dashboard page
   */	
  public function update_pps(){
    if(isset($_POST['nid']) && isset($_POST['pps_value'])) {
      $nid = $_POST['nid'];
      $pps_value = $_POST['pps_value'];
      $node = Node::load($nid);
      $node->field_pps_status->target_id = $pps_value;
      $node->save();
      echo "done";
      exit;
    } else {
      echo "failed";
      exit;
    }
  }
  /**
  * Callback function reactivate_subscription_pricing()
  * to displayed reactivate subscription pricing list
  **/
  public function reactivate_subscription_pricing(){
    $messages = \Drupal::messenger()->deleteAll();
    $uid = \Drupal::currentUser()->id();
     // get user role
    $cuser = \Drupal::currentUser();
    $full_name = 'User';
    if($uid > 0){
      $user = \Drupal\user\Entity\User::load(\Drupal::currentUser()->id());
      $preferred_name = $user->get('field_preferred_first_name')->value;
      $first_name = $user->get('field_first_name')->value;
      $last_name = $user->get('field_last_name')->value;
      $full_name = empty($preferred_name) ? $first_name. ' ' .$last_name : $preferred_name. ' ' .$last_name;
    }
    $roles = $cuser->getRoles();
    $display = '';
    if($roles[0] == 'anonymous' || $roles[0] == 'authenticated'){
      $display = 'all';
    }
    if($roles[0] == 'authenticated' && in_array("content_creator", $roles) ){
       $display = 'Professional';
    }
    if($roles[0] == 'authenticated' && in_array("advanced_content_creator", $roles) ){
       $display = 'Expert';
    }
    $items = array();
    $items2 = array();
    //get terms from feature_list
    $vocabulary_name2 = 'feature_list';
    $vocabulary = \Drupal::entityTypeManager()->getStorage('taxonomy_vocabulary')->load($vocabulary_name2);
    $feature_list_name = $vocabulary->label();
    $feature_list_description = $vocabulary->getDescription();
    $query2 = \Drupal::entityQuery('taxonomy_term');
    $query2->condition('vid', $vocabulary_name2);
    $query2->sort('weight');
    $tids2 = $query2->execute();
    $terms2 = Term::loadMultiple($tids2);
    $site_config = \Drupal::config('system.site');
    $server_name = strtolower($site_config->get('site_server_name'));
    if($server_name == 'dev'){
      $block_professional = \Drupal\block_content\Entity\BlockContent::load(28);
      $block_professional_text  = strip_tags($block_professional->body->value);
      $block_expert = \Drupal\block_content\Entity\BlockContent::load(29);
      $block_expert_text  = strip_tags($block_expert->body->value);
    } else if($server_name == 'staging'){
      $block_professional = \Drupal\block_content\Entity\BlockContent::load(22);
      $block_professional_text  = strip_tags($block_professional->body->value);
      $block_expert = \Drupal\block_content\Entity\BlockContent::load(21);
      $block_expert_text  = strip_tags($block_expert->body->value);
    } else {
      $block_professional = \Drupal\block_content\Entity\BlockContent::load(24);
      $block_professional_text  = strip_tags($block_professional->body->value);
      $block_expert = \Drupal\block_content\Entity\BlockContent::load(23);
      $block_expert_text  = strip_tags($block_expert->body->value);
    }       
    foreach ($terms2 as $term2) {
      $term_id2 = $term2->id();
      $term_Name2 = $term2->getName();
      $role_availability = $term2->get('field_role_availability')->getValue();
      $status = $term2->get('field_status')->getValue()[0]['value'];
      $availability = array();
      foreach($role_availability as $data){
        $paragraph = Paragraph::load($data['target_id']);
        $role_feature = $paragraph->field_role_feature->value;
        $available = $paragraph->field_available->value;
        $limitation = $paragraph->field_limitation->value;
        $limitation_perpage = $paragraph->field_show_on_plans_page->value;
        $check_mark = 0;
        if(empty($limitation)){
          if($available == 1){
            $limitation = 'check-mark.png';
            $check_mark = 1;
          }
          else {
            $limitation = 'x-mark.png';
            $check_mark = 1;
          }
        }
        $availability[$role_feature]['available'] = $available;
        $availability[$role_feature]['limitation'] = $limitation;
        $availability[$role_feature]['limitation2'] = $paragraph->field_limitation->value;
        $availability[$role_feature]['role_feature'] = (isset($roled_feature)) ? $roled_feature : '';
        $availability[$role_feature]['check_mark'] = $check_mark;
        $availability[$role_feature]['check_mark_plan_page'] = $limitation_perpage;
      }
      
      $items2[$term_id2] = array(
        'tid' => $term_id2,
        'name' => $term_Name2,
        'role_availability' => $availability,
        'status' => $status,
      );
    }
    $Professional_feature_list = array();
    $expert_feature_list = array();
    $role_exclude = '';
    if($server_name == 'dev'){
      $role_exclude = 871;
    } elseif($server_name == 'staging'){
      $role_exclude = 601;		
    } else {
      $role_exclude = 601;
    }
    foreach($items2 as $teams2){
      if ($teams2['role_availability']['content_creator']['check_mark_plan_page'] ==  1){
        $Professional_feature_list[$teams2['name']] = $teams2['role_availability']['content_creator']['limitation2'];
      }
      if ($teams2['role_availability']['advanced_content_creator']['check_mark_plan_page'] == 1){
        
        $expert_feature_list[$teams2['name']] = $teams2['role_availability']['advanced_content_creator']['limitation2'];
      }
    }
    // get role feture
    $vocabulary_name = 'role_features';
    $query = \Drupal::entityQuery('taxonomy_term');
    $query->condition('vid', $vocabulary_name);
    $query->sort('weight');
    $tids = $query->execute();
    $terms = Term::loadMultiple($tids);
    foreach ($terms as $term) {
      $term_id = $term->id();
      $reinstatement = $term->get('field_subscription_reinstatement')->getValue();
      $reinstatementValue = isset($reinstatement[0][value]) ? $reinstatement[0][value] : 0;
      if($term_id != $role_exclude && ($reinstatementValue)) {
        $term_Name = $term->getName();
        $feature_list = $term->get('field_feature_list')->getValue();
        $description = $term->get('description')->getValue();
        $subscription_rate = $term->get('field_monthly_subscription_rate')->getValue();
        $link_url = $term->get('field_sign_up_url')->getValue();
        $link_label = $term->get('field_sign_up_button_label')->getValue();
        $link_sub_label = $term->get('field_sign_up_button_sub_label')->getValue();
        /*if($term_Name == 'Marketer'){
          $link_url = '/get_start_for_free?sid=0'; //$term->get('field_sign_up_url')->getValue();
          $link_label = 'START FREE TRIAL';
        }
        else if($term_Name == 'Pro Marketer') {
          $link_url = '/get_start_for_free?sid=1'; //$term->get('field_sign_up_url')->getValue();
          $link_label = 'START FREE TRIAL';
        }
        else if($term_Name == 'Enterprise') {
          $link_url = 'javascript:void(0);';
          $link_label = "INQUIRE";
        }*/
        $items[$term_id] = array(
          'tid' => $term_id,
          'name' => $term_Name,
          'feature_list' => $feature_list,
          'description' => isset($description['0']['value']) ? strip_tags($description['0']['value']) : '',
          'subscription_rate' => isset($subscription_rate['0']['value']) ? $subscription_rate['0']['value'] : 0,
          'link_url' => isset($link_url['0']['value']) ? $link_url['0']['value'] : '',
          'link_label' => isset($link_label['0']['value']) ? $link_label['0']['value'] : '',
          'link_sub_label' => isset($link_sub_label['0']['value']) ? $link_sub_label['0']['value'] : '',
          'Professional_feature_list' => $Professional_feature_list,
          'expert_feature_list' => $expert_feature_list,
        );
      }
    }
    return [
      '#theme' => 'reactivate_subscription_pricing_template',
      '#title'   => $this->t("Select the plan that's right for you"),
      '#uid'   => $uid,
      '#full_name'   => $full_name,
      '#items'   => $items,
      '#items2'   => $items2,
      '#feature_list_name'   => $feature_list_name,
      '#feature_list_description'   => $feature_list_description,
      '#block_professional_text' => $block_professional_text,
      '#block_expert_text' => $block_expert_text,
      '#display' => $display,
      '#attached' => [
        'library' =>  [
          'my_kaboodles/my_kaboodle_js',
        ],
      ],
    ];
  }
  /**
  * Checks access for reactivate page.
  */
  public function reactivatePageAccess() {
    // current user
    $cuser = \Drupal::currentUser();
    $roles = $cuser->getRoles();
    if(in_array('administrator', $roles) || in_array('canceled', $roles)){
      return AccessResult::allowed();
    } else {
      return AccessResult::forbidden();
    }
  }
}
