<?php
 
/**
* @file
* Contains \Drupal\media_vault_tool\Controller\MediaKitController.php
*
*/
 
namespace Drupal\media_vault_tool\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\NodeInterface;
use Drupal\node\NodeTypeInterface;
use Drupal\Core\Controller\ControllerBase;
use Drupal\node\Entity\Node;
use Drupal\file\Entity\File;
use Drupal\user\Entity\User;
use Drupal\media\Entity\Media;
use Drupal\Core\Url;
use Drupal\Core\Access\AccessResult;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

class MediaKitController extends ControllerBase {
	/**
   * The current request.
   *
   * @var \Symfony\Component\HttpFoundation\Request $request
   *   The HTTP request object.
   */
  protected $request;
	
  /**
   * Returns a media kit page.
   *
   * @return array
   *   A simple renderable array.
   */
	public function render_media_kit_page(AccountInterface $user, NodeInterface $node){
    global $base_secure_url;
    global $base_url;
		$kit_owner = '';
		$kit_id_from_url = '';
		$user_first_custom_kit_id = '';
		$user_first_custom_kit_title = '';
		$current_path = \Drupal::service('path.current')->getPath();
		$args = explode('/',$current_path);

		if(is_numeric($args[4])){
			$kit_owner = $args[4];
			$kit_id_from_url = $args[5];
		}
    $me = \Drupal::currentUser();
    $my_roles = $me->getRoles();
    $user_roles = implode(',', $my_roles);
    $uid = $user->get('uid')->value;
		$nid = $node->id();
    $database = \Drupal::database();
    //fetch default media kit of a user
		$default_kit = default_media_kit_by_user($uid);
		$dkit = \Drupal::service('entity_type.manager')->getStorage('node')->load($default_kit); 
		$default_kit_title = '';
		$default_kit_owner = '';
		if($dkit){
			$default_kit_title = $dkit->getTitle();
			$default_kit_owner = $dkit->getOwnerId();
		}
		
		//get custom media kit count
		/* $query = \Drupal::database()->select('node_field_data', 'n');
		$query->fields('n', ['nid', 'title']);
		$query->condition('n.uid', $uid, '=');
		$query->condition('n.nid', $default_kit, '<>');
		$query->condition('n.type', 'media_kit', '=');
		$user_custom_mkits = $query->execute()->fetchAll(); */
		$user_custom_mkits = custom_media_kit_of_user($uid, $default_kit);
		$user_custom_mkit_count = count($user_custom_mkits);
		if($user_custom_mkit_count == 1){
			$user_first_custom_kit_id = $user_custom_mkits[0]->nid;
			$user_first_custom_kit_title = $user_custom_mkits[0]->title;
		}
		
    //fetch media vault of a user
		//$media_vault_id = default_media_vault_by_user($uid);
    $media_vault_id = $database->select('node_field_data', 'n')
    ->fields('n', ['nid'])
    ->condition('n.uid', $uid, '=')
    ->condition('n.type', 'media_vault', '=')
    ->execute()
    ->fetchField();
		   
		// fetch random media kit nid of a user
    $r_media_kit = $database->select('node_field_data', 'n')
    ->fields('n', ['nid', 'title', 'uid'])
    ->condition('n.uid', $uid, '=')
    ->condition('n.nid', $nid, '=')
    ->condition('n.type', 'media_kit', '=')
    ->execute()
    ->fetchAssoc();
		
    
    $render_data['theme_data'] = array(
			'#theme' => 'media_kit_template',
			'#data' => $r_media_kit,
			'#kit_owner' => $kit_owner,
			'#default_kit' => $default_kit,
			'#default_kit_title' => $default_kit_title,
			'#default_kit_owner' => $default_kit_owner,
			'#attached' => [
				'library' =>  [
					'media_vault_tool/media_kit',
					'media_vault_tool/react.min',
					'media_vault_tool/react.dom.min',
					'media_vault_tool/axios',
					'media_vault_tool/media.vault',
				],
			],
		);
    $render_data['theme_data']['#attached']['drupalSettings']['media_vault_id'] = $media_vault_id;  
    $render_data['theme_data']['#attached']['drupalSettings']['media_base_url'] = $base_secure_url;
    $render_data['theme_data']['#attached']['drupalSettings']['media_base_url_http'] = $base_url;
    $render_data['theme_data']['#attached']['drupalSettings']['media_kit_title'] = $r_media_kit['title'];
    $render_data['theme_data']['#attached']['drupalSettings']['media_kit_id'] = $r_media_kit['nid'];
    $render_data['theme_data']['#attached']['drupalSettings']['media_kit_uid'] = $r_media_kit['uid'];
    $render_data['theme_data']['#attached']['drupalSettings']['default_media_kit_id'] = $default_kit;
    $render_data['theme_data']['#attached']['drupalSettings']['path_userid'] = $uid;
    $render_data['theme_data']['#attached']['drupalSettings']['kit_owner'] = $kit_owner;
    $render_data['theme_data']['#attached']['drupalSettings']['user_roles'] = $user_roles;
    $render_data['theme_data']['#attached']['drupalSettings']['user_custom_mkit_count'] = $user_custom_mkit_count;
    $render_data['theme_data']['#attached']['drupalSettings']['kit_id_from_url'] = $kit_id_from_url;
    $render_data['theme_data']['#attached']['drupalSettings']['user_first_custom_kit_id'] = $user_first_custom_kit_id;
    $render_data['theme_data']['#attached']['drupalSettings']['user_first_custom_kit_title'] = $user_first_custom_kit_title;
    return $render_data;
	}
  
	/**
	 * Get all media kits of current user
	 */
  public function get_user_media_kits(AccountInterface $user){
    $uid = $user->get('uid')->value;
    
    $database = \Drupal::database();
    $query = $database->select('node_field_data', 'n');
		$query->leftJoin('media_kit_sorting', 'm', "n.nid = m.nid");
    $query->fields('n', ['nid', 'title']);
    $query->condition('n.uid', $uid, '=');
    $query->condition('n.type', 'media_kit', '=');
		$query->orderBy('m.sort_number', 'ASC');
    $result = $query->execute()->fetchAll();
    $response = $result;
    return new JsonResponse($response);
  }
	/**
	 * Get all media kits of current user
	 */
  public function get_user_article_media_kits(AccountInterface $user){
    $results = [];
    $uid = $user->get('uid')->value;
    
    $database = \Drupal::database();
    $query = $database->select('node_field_data', 'n');
		$query->leftJoin('media_kit_sorting', 'm', "n.nid = m.nid");
    $query->fields('n', ['nid', 'title']);
    $query->condition('n.uid', $uid, '=');
    $query->condition('n.type', 'media_kit', '=');
		$query->orderBy('m.sort_number', 'ASC');
    $result = $query->execute()->fetchAll();
    foreach($result as $kit){
      $node = Node::load($kit->nid);
      if($node){
        if(empty($node->field_vault_audio->getValue())){
          $audio_status = 'empty';
        }else{
          $audio_status = 'notempty';
        }
        if(empty($node->field_vault_photo->getValue())){
          $photo_status = 'empty';
        }else{
          $photo_status = 'notempty';
        }
        $results[] = ['nid' => $kit->nid, 'title' => $node->getTitle(), 'owner' => true, 'member_name' => '','audio_status' => $audio_status,'photo_status'=>$photo_status];
      }
    }
    return $results;
  }
  
	/**
	 * Custom media access callback
	 */
  public function media_access(AccountInterface $account, $user){
    $roles = $account->getRoles();
    $member = false;
    if(in_array('administrator', $roles) || in_array('va_manager', $roles)){
      return AccessResult::allowed();
    }
    else if ($account->id() == $user && (in_array('content_creator', $roles) || in_array('advanced_content_creator', $roles) || in_array('designer', $roles) || in_array('enterprise', $roles))) {
      return AccessResult::allowed();
    }
    else if(isset($_GET['team'])){
      $gid = $_GET['team'];
      $member = \Drupal::service('my_groups.team.service')->getMembersAccess($gid, $account->id(), $user, 'team-social_media');
      if($member){
        return AccessResult::allowed();
      }
      return AccessResult::forbidden();
    }
    else{
      return AccessResult::forbidden();
    }
  }
	/**
	 * Custom media access callback
	 */
  public function media_access_role(){
    $account = \Drupal::currentUser();
    $roles = $account->getRoles();
    if(in_array('administrator', $roles) || in_array('va_manager', $roles)){
      return AccessResult::allowed();
    }
    else if ((in_array('content_creator', $roles) || in_array('advanced_content_creator', $roles) || in_array('designer', $roles) || in_array('enterprise', $roles))) {
      return AccessResult::allowed();
    }
    else{
      return AccessResult::forbidden();
    }
  }
	/**
	 * Custom access specifier for /tools/media/kit/uid/nid page
	 */
	public function media_kit_access(AccountInterface $account, $user, NodeInterface $node){
    $roles = $account->getRoles();
		$node_owner = $node->getOwnerId();
    if(in_array('administrator', $roles) || in_array('va_manager', $roles)){
			if($account->id() !== $user && $user == $node_owner){
				return AccessResult::allowed();
			} else if($account->id() == $user && $user == $node_owner ){
				return AccessResult::allowed();
			} else {
				return AccessResult::forbidden();
			}			
    }
    else if ($account->id() == $user && $account->id() == $node_owner && (in_array('content_creator', $roles) || in_array('advanced_content_creator', $roles) || in_array('designer', $roles) || in_array('enterprise', $roles))) {
      return AccessResult::allowed();
    }
    else{
      return AccessResult::forbidden();
    }
  }
	
	/**
	 * Custom media kit route access callback
	 */
	public function media_kit_route_access(\Drupal\node\NodeInterface $node){
    if ($node->bundle() == 'media_kit') {
      return AccessResult::allowed();
    }
    else{
      return AccessResult::forbidden();
			//return new NotFoundHttpException();
    }
  }
	
	/**
	 * Custom media preset route access callback
	 */
	public function metadata_preset_route_access(NodeTypeInterface $node_type){
    if ($node_type->id() == 'metadata_preset') {
      return AccessResult::allowed();
    }
    else{
      return AccessResult::forbidden();
			//return new NotFoundHttpException();
    }
  }
	
	/**
	 * Implements Media kit clone functionality
	 */
	public function clone_media_kit(Request $request, User $user, NodeInterface $node){
    $uid = $user->get('uid')->value;
    $nid = $node->id();
		$title = $request->query->get('title');
		//$entity = \Drupal::service('entity_type.manager')->getStorage('node')->load($nid); 
		// Use dependency injection instead if in class context.
		$duplicate = $node->createDuplicate();
		//$duplicate->setTitle('Clone of '.$node->get('title')->value);
		$duplicate->setTitle($title);
		$duplicate->save();
		$redirectpath = '/tools/media/kit/'.$uid.'/'.$duplicate->id();
		drupal_set_message(t('Your media kit has been successfully cloned.'));
		return new RedirectResponse($redirectpath);
	}
	
	/**
	 * Delete media kit node and its referenced media
	 */
	public function delete_media_kit_node() {
		if(isset($_POST['uid']) && isset($_POST['nid'])) {
			$uid = $_POST['uid'];
			$nid = $_POST['nid'];
			$node = Node::load($nid);
			
			$node->delete();
			
			echo "done";
			exit;
		}
	}

	/**
	 * Delete kaboodle node
	 */
	public function delete_kaboodle_node(User $user, NodeInterface $node) {
		$uid = $user->get('uid')->value;
    $nid = $node->id();
		$title = $node->title;
		$node->field_archived = 1;
		$node->save();
		
		$redirectpath = '/tools/my-account/'.$uid;
		$msg = 'Kaboodle "'.ucfirst($title).'" has been archived successfully.';
		return new RedirectResponse($redirectpath);
		drupal_set_message(t($msg));
	}
	
	/**
	 * Remove reference from kaboodle node
	 */
	public function remove_kaboodle_reference() {
		if(isset($_POST['k_nid'])) {
			$k_nid = $_POST['k_nid'];
			$node = Node::load($k_nid);
			$default_kit = default_media_kit();
			$node->field_media_kit_ref->target_id = $default_kit;
			$node->save();
			echo "done";
			exit;
		}
	}
	
	/**
	 * Get referenced node of Media kit
	 */
	public function get_media_kit_references($kit_id){
		$database = \Drupal::database();
    $query = $database->select('node__field_media_kit_ref', 'r');
		$query->leftJoin('node_field_data', 'n', "r.entity_id = n.nid");
    $query->condition('r.field_media_kit_ref_target_id', $kit_id, '=');
    $query->fields('r', ['entity_id']);
    $query->fields('n', ['title']);
    $result = $query->execute()->fetchAll();
 
    $response = $result;
    return new JsonResponse($response);
	}
	
	/**
	 * Owner's media kits and shared medai kits functionality
   * Task#6103	 
	 * return JsonResponse
	 */
  public function get_combined_shared_media_kits(\Drupal\user\UserInterface $user, NodeInterface $node){
		//$account = \Drupal::currentUser();
		//$roles = $account->getRoles();
		$node_owner = $node->getOwnerId();    
		$referenced_team_id = $node->field_team->target_id;    
    $member_uid = $user->get('uid')->value;
		//$shared_kits = '';
		//$response = '';
    $shared_kits = $this->get_kaboodle_referenced_media_kits($node_owner, $node->id());
    $shared_kits = array_string_sorting($shared_kits);
		
		//$confirmed_teams = getConfirmedTeamsNotOwner($node_owner);
		$team_m_shared_kits = [];
		if($referenced_team_id){
			$team_shared_kits =\Drupal::service('my_groups.team.shared_kits')->get_shared_media_kits_by_team($referenced_team_id);
			if(!empty($team_shared_kits)){
				foreach($team_shared_kits as $tk){
					$team_m_shared_kits[] = $tk;
				}
			}					
		}
		$team_m_shared_kits = array_string_sorting($team_m_shared_kits);
		
		$all_shared_kits = [];
		if(!empty($team_m_shared_kits)){
		  $all_shared_kits = array_merge($shared_kits, $team_m_shared_kits);
		}else { 
			$all_shared_kits = $shared_kits;
		}

    return new JsonResponse($all_shared_kits);
  }
	/**
	 * Owner's media kits and shared medai kits functionality
   * Task#6103	 
	 * return JsonResponse
	 */
  public function get_user_article_shared_media_kits(\Drupal\user\UserInterface $user, NodeInterface $node){
		//$account = \Drupal::currentUser();
		//$roles = $account->getRoles();
		$node_owner = $node->getOwnerId();    
		$referenced_team_id = $node->field_team->target_id;    
    $member_uid = $user->get('uid')->value;
    $shared_kits = $this->get_user_article_media_kits($user);
    $shared_kits = array_string_sorting($shared_kits);
		
		//$confirmed_teams = getConfirmedTeamsNotOwner($node_owner);
		$team_m_shared_kits = [];
		if($referenced_team_id){
			$team_shared_kits =\Drupal::service('my_groups.team.shared_kits')->get_shared_media_kits_by_team($referenced_team_id);
			if(!empty($team_shared_kits)){
				foreach($team_shared_kits as $tk){
					$team_m_shared_kits[] = $tk;
				}
			}					
		}
		$team_m_shared_kits = array_string_sorting($team_m_shared_kits);
		
		$all_shared_kits = [];
		if(!empty($team_m_shared_kits)){
		  $all_shared_kits = array_merge($shared_kits, $team_m_shared_kits);
		}else { 
			$all_shared_kits = $shared_kits;
		}

    return new JsonResponse($all_shared_kits);
  }
	
	/**
	 * Get referenced media kits of kaboodle node by current user
	 */
  public function get_kaboodle_referenced_media_kits($uid, $nid){
		$results = [];
    $media_kits = \Drupal::database()->select('node_field_data', 'n');
		$media_kits->leftJoin('node__field_media_kit_ref', 'k', "k.entity_id = n.nid");
		$media_kits->condition('n.uid', $uid, '=');
		$media_kits->condition('n.nid', $nid, '=');
		$media_kits->condition('n.type', 'kaboodle', '=');
		$media_kits->fields('k', ['field_media_kit_ref_target_id']);
		$referenced_kits = $media_kits->execute()->fetchAll();
		foreach($referenced_kits as $kit){
		  $node = Node::load($kit->field_media_kit_ref_target_id);
			if($node){
        if(empty($node->field_vault_audio->getValue())){
          $audio_status = 'empty';
        }else{
          $audio_status = 'notempty';
        }
        if(empty($node->field_vault_photo->getValue())){
          $photo_status = 'empty';
        }else{
          $photo_status = 'notempty';
        }
				$results[] = ['nid' => $kit->field_media_kit_ref_target_id, 'title' => $node->getTitle(), 'owner' => true, 'member_name' => '','audio_status' => $audio_status,'photo_status'=>$photo_status];
			}
		}
		return $results;
	}
}