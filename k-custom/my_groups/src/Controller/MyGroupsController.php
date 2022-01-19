<?php
 
/**
* @file
* Contains \Drupal\my_groups\Controller\MyGroupsController.php
*
*/
namespace Drupal\my_groups\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\NodeInterface;
use Drupal\Core\Controller\ControllerBase;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Drupal\media\Entity\Media;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\Core\Render\Markup;
use Drupal\Component\Utility\Tags;
use Drupal\Component\Utility\Unicode;

class MyGroupsController extends ControllerBase {
  /**
   * The current request.
   *
   * @var \Symfony\Component\HttpFoundation\Request $request
   *   The HTTP request object.
   */
  protected $request;
  
  /**
   * Returns a media vault detail page.
   *
   * @return array
   *   A simple renderable array.
   */
	public function listing_teams($user){
    $cuser = \Drupal::currentUser();
    $cuid = $cuser->id();
    $roles = $cuser->getRoles();
    // UID from URL
    $guid = $user->get('uid')->value;
    $current_path = \Drupal::service('path.current')->getPath();
		$args = explode('/',$current_path);
		$uid_from_url = '';

		if(is_numeric($args[2])){
			$uid_from_url = $args[2];
		}

		$header = [
      'team_id' => ['data' => t('Team ID'), 'class' => 'sortempty', 'id' =>'team-id', 'width' => '10%', 'onclick' => 'sortColumn(this, "number")'],
      'team_name' => ['data' => t('Team Name'), 'class' => 'sortempty asc-icon bg-sort', 'id' => 'team-name', 'width' => '25%', 'onclick' => 'sortColumn(this, "text")'],
      'owner' => ['data' => t('Owner'), 'class' => 'sortempty', 'id' => 'team-owner', 'width' => '20%', 'onclick' => 'sortColumn(this, "text")'],
      'members' => ['data' => t('Members'), 'width' => '15%'],
      'sharedkits' => ['data' => t('Shared Media Kits'), 'id' => 'kits-name', 'class' => 'sortempty', 'onclick' => 'sortColumn(this, "number")'],
      'actions' => ['data' => t('ACTIONS'), 'class' => 'text-center', 'width' => '14%'],
    ];
    
    $query = \Drupal::database()->select('groups_field_data', 'g');
    $query->fields('g', ['id', 'label', 'uid', 'created', 'changed']);
    $query->addExpression("IF(tm.id IS NULL, 0, 1)", 'membership');
    $query->addExpression("IF(tms.status IS NULL, 0, tms.status)", 'membership_status');
    $query->addExpression("CONCAT_WS(' ', ufn.field_first_name_value, uln.field_last_name_value)", 'full_name');
		$query->orderBy('g.label', 'ASC');
    // teams owned and invited by others 
    $teams_query = db_select('groups_field_data', 't');
    $teams_query->join('group_content_field_data', 'm', 't.id = m.gid');
    $teams_query->fields('t', ['id']);
    $teams_query->condition('t.type', 'team', '=');
    $teams_query->condition('m.type', 'team-group_membership', '=');
    $teams_query->condition('m.entity_id', $guid, '=');
    $teams_query->groupBy('t.id');
    if(in_array('administrator', $roles)){
      if($guid <> $cuid){
        $query->join($teams_query, 'tm', 'g.id = tm.id');
      }else{
        $query->leftJoin($teams_query, 'tm', 'g.id = tm.id');
      }
    }else{
      $query->join($teams_query, 'tm', 'g.id = tm.id');
    }
    $query->leftJoin('team_membership_status', 'tms', "tms.team_id = g.id AND tms.member_id = $guid");
    $query->leftJoin('user__field_first_name', 'ufn', 'ufn.entity_id = g.uid');
    $query->leftJoin('user__field_last_name', 'uln', 'uln.entity_id = g.uid');
    $orCondition = $query->orConditionGroup();
    $orCondition->condition('tms.status', [0,1,4], 'IN');
    $orCondition->isNull('tms.status');
    $query->condition($orCondition);
    // Limit the rows to 20 for each page.
    $pager = $query->extend('Drupal\Core\Database\Query\PagerSelectExtender')->limit(10);
    $teams = $pager->execute();
		
    
    //echo $query->__toString(); 
    // edit icon
    $edit_img_tag = '<img src="'. base_path() . drupal_get_path('module', 'my_groups') . '/images/edit-icon.png" width="20"/>';
    $rendered_edit_icon = render($edit_img_tag);
    $edit_icon = Markup::create($rendered_edit_icon);
    
    // delete icon
    $delete_img_tag = '<img src="'. base_path() . drupal_get_path('module', 'my_groups') . '/images/trash.png" width="20"/>';
    $rendered_delete_icon = render($delete_img_tag);
    $delete_icon = Markup::create($rendered_delete_icon);
    
    // members icon
    $members_img_tag = '<img src="'. base_path() . drupal_get_path('module', 'my_groups') . '/images/members.png" width="20"/>';
    $rendered_members_icon = render($members_img_tag);
    $members_icon = Markup::create($rendered_members_icon);

		
    foreach ($teams as $team) {
			$shared_kit_names = '';
			$shared_kit_ids = '';
			$shared_kit_counts = '';
			$mk_arr = [];
			$mk_id_arr = [];
			$mk_indicator_class = '';
			
			//get all team members of team owner, display shared media kits team owner
			if($team->uid == $cuid){
				$shared_kits = $this->get_shared_media_kits($team->id, null);
			} else {
				//display shared medai kits of members
				$shared_kits = $this->get_shared_media_kits($team->id, $uid_from_url);
			}
			if(!empty($shared_kits)){
				foreach($shared_kits as $kitid){
					$mkit = Node::load($kitid->field_shared_media_kit_target_id);
					if(!empty($mkit)){
						$mkit_title = $mkit->getTitle();
						$mk_id_arr[] = $kitid->field_shared_media_kit_target_id;
						if($team->uid == $cuid){
							$member_name = user_real_name($kitid->field_media_kit_owner_target_id);
							$mk_arr[] = $mkit_title . ' ('.$member_name.')';						
						} else {
							$mk_arr[] = $mkit_title;
						}
						if($kitid->entity_id == $team->id){
							$mk_indicator_class = 'mk-indicator';
						}
					}
				}
			}
			if(!empty($mk_id_arr)){				
				$shared_kit_ids = implode("-", $mk_id_arr);
			}
			if(!empty($mk_arr)){
				$shared_kit_counts = count($mk_arr);
				$array_size = sizeof($mk_arr);
				for($x = 0; $x < $array_size; $x++) {
					for($y = 0; $y < $array_size; $y++) {
						if(strcasecmp($mk_arr[$x],$mk_arr[$y])<0) {
							$hold = $mk_arr[$x];
							$mk_arr[$x] = $mk_arr[$y];
							$mk_arr[$y] = $hold;
						}
					}
				}
				$shared_kit_names = implode(", ", $mk_arr);
			}
			//team owner name
			$team_owner_name = '';
			$referenced_team_owner_uid = getTeamOwner($team->id);
			if(!empty($referenced_team_owner_uid)){
				$team_owner_name = user_real_name($referenced_team_owner_uid);
			}	
			
      if(($team->membership == 1) && ($team->uid <> $cuid)){
        if($team->membership_status == 0 || $team->membership_status == 4){
          // accept
          $accept = Link::fromTextAndUrl('Accept', Url::fromRoute('team.accept', ['teamid' => $team->id], ['attributes' => ['class' => ['btn', 'btn-primary', 'text-uppercase', 'font-fjalla', 'dialog'], 'msg'=> "Are you sure you want to accept the invitation to the team: $team->label?"]]))->toString();
          // decline
          $decline = Link::fromTextAndUrl('Decline', Url::fromRoute('team.decline', ['teamid' => $team->id], ['attributes' => ['class' => ['btn', 'btn-primary', 'text-uppercase', 'font-fjalla', 'dialog'], 'msg'=> "Are you sure you want to decline the team: $team->label?"]]))->toString();
          // invited by
          $invited_by = 'You have an invitation to join this team from ' . $team->full_name;
          // leave
          $leave = '';
          $shared_kit = '';
					$share_btn = '';
        }else{
          // Member Teams 
					$gid = $team->id;
          $accept = '';
          $decline = '';
          $invited_by = $this->membersCount($gid);
          // leave
          $leave = Link::fromTextAndUrl('Leave', Url::fromRoute('team.leave', ['teamid' => $team->id], ['attributes' => ['class' => ['btn', 'btn-primary', 'text-uppercase', 'font-fjalla', 'dialog'], 'msg' => "Are you sure you want to leave the team: $team->label?"]]))->toString();		
          $shared_kit = $shared_kit_counts;
					//share
					$shareurl = \Drupal\Core\Url::fromUserInput('#');
					$share_link_options = [
						'attributes' => [
							'class' => [
								'mk-share', 
								'btn', 
								'btn-primary', 
								'text-uppercase', 
								'font-fjalla',
							],
							'id' => 'mk-share-' . $team->id,
							'data-toggle' => 'modal',
							'data-target' => '#on-boarding',
							'uid' => $cuid,					
							'team' => $team->id,					
							'user' => $uid_from_url,					
							'team_name' => $team->label,					
							'shared_teams' => $shared_kit_ids,					
							'onclick' => 'currentUserKits(this)',					
						],
					];
					$shareurl->setOptions($share_link_options);
					$share = \Drupal::l('Share', $shareurl);
					
					$share_btn = $share;
        }
        // contact
        $contact = Link::fromTextAndUrl('Contact', Url::fromRoute('entity.user.contact_form', ['user' => $team->uid], ['attributes' => ['class' => ['contact', 'btn', 'btn-primary', 'text-uppercase', 'font-fjalla']]]))->toString();
        // actions
        $actions = t('@share_btn @accept @decline @contact @leave', array('@share_btn' => $share_btn, '@accept' => $accept, '@decline' => $decline, '@contact' => $contact, '@leave' => $leave));
        // Get Memeber Number in team
				//$invited_by_array = is_numeric($invited_by) ? ['data' => $invited_by, 'data-toggle' => 'tooltip', 'data-placement' => 'bottom', 'class' => $mk_indicator_class, 'title' => $shared_kit_names, 'data-member' => 'member-tooltip'] : ['data' => $invited_by];
				$total_shared_kits = (is_numeric($shared_kit) && !empty($shared_kit)) ? ['data' => $shared_kit_counts, 'data-toggle' => 'tooltip', 'data-placement' => 'bottom', 'class' => $mk_indicator_class, 'title' => $shared_kit_names, 'data-member' => 'member-tooltip'] : ['data' => $shared_kits];
        
        $rows[] = [
					'team_id' =>  ['data' => $team->id],
					'team_name' => ['data' => $team->label, 'class' => 'sorted'],
					'owner' => ['data' => $team_owner_name],
					'invitedby' => $invited_by,
					'sharedkits' => $total_shared_kits,
					'actions' => ['data' => $actions, 'class' => 'd-flex justify-content-center'],
        ];
      } else {
        // Own Teams 
        $members = Link::fromTextAndUrl($members_icon, Url::fromRoute('team.members', ['group' => $team->id]))->toString();
        $edit = Link::fromTextAndUrl($edit_icon, Url::fromRoute('entity.group.edit_form', ['group' => $team->id]))->toString();
        $delete = Link::fromTextAndUrl($delete_icon, Url::fromRoute('team.delete', ['group' => $team->id], ['attributes' => ['msg' => 'Are you sure you want to delete team: '.$team->label.'?', 'class' => ['dialog']]]))->toString();
        // actions
        $actions = t('@members &nbsp;&nbsp; @edit &nbsp;&nbsp; @delete', array('@members' => $members, '@edit' => $edit, '@delete' => $delete));
        // Get Memeber Number in team
        $gid = $team->id;
        $members_number = $this->membersCount($gid);
				$shared_kit = $shared_kit_counts;
				$total_shared_kits = (is_numeric($shared_kit) && !empty($shared_kit)) ? ['data' => $shared_kit, 'data-toggle' => 'tooltip', 'data-placement' => 'bottom', 'class' => 'mk-owner-indicator', 'title' => $shared_kit_names, 'data-member' => 'member-tooltip'] : ['data' => $shared_kit_counts];
        
        //End Get Member Number in team
        $rows[] = ['id' => 'owner-row', 
					'data' => [
						'team_id' =>  ['data' => $team->id],
						'team_name' => ['data' => $team->label, 'class' => 'sorted'],
						'owner' => ['data' => $team_owner_name],
						'member' => ['data' => $members_number],
						'sharedkits' => $total_shared_kits,
						'actions' => ['data' => $actions, 'class' => 'd-flex justify-content-center'],
					],
        ];
      }
    }

    // The table description.
    $build = array();
    // Generate the table.
    $build['config_table'] = array(
      '#theme' => 'table',
      '#header' => $header,
      '#rows' => $rows,
      '#attributes' => array('id'=>array('groups-teams'), 'class' => array('teams'), 'border' => 0),
      '#attached' => ['library' => ['my_groups/team']],
      '#empty' => 'You currently have no teams.',
    );
    
    // Finally add the pager
    $build['pager'] = array(
      '#type' => 'pager'
    );
 
    return $build;
	}
  
  
  /**
   * Returns a media vault detail page.
   *
   * @return array
   *   A simple renderable array.
   */
	public function listing_members($group){
    $user = \Drupal::currentUser();
    $gid = $group->id();
		/* $allmembers = $this->getAllTeamMembersInfo($gid);
		$team_members = getConfirmedTeamMembers($gid);
			echo'<pre>';
			print_r($allmembers);
			print_r($team_members);
			exit; */
    // header
    $header = [['data' => t('First Name'), 'field' => 'field_first_name_value', 'class' =>'sortempty', 'id' =>'member-name', 'width' => '10%'], ['data' => t('Last Name'), 'field' => 'field_last_name_value', 'width' => '10%', 'class' => 'sortempty asc-icon bg-sort', 'onclick' => 'sortColumn(this, "text")'], ['data' => 'Roles'], ['data' => 'Status', 'width' => '12%','sort' => 'asc'], ['data' => 'Updated', 'width' => '15%'], ['data' => t('ACTIONS'), 'width' => '15%']];
    
    $query = \Drupal::database()->select('group_content_field_data', 'g');
    $query->fields('g', ['id', 'uid', 'entity_id']);
    $query->fields('t', ['label']);
    $query->fields('ufn', ['field_first_name_value']);
    $query->fields('upfn', ['field_preferred_first_name_value']);
    $query->fields('uln', ['field_last_name_value']);
    $query->addExpression("IF(tms.changed IS NULL, g.changed, tms.changed)", 'changed');
    $query->addExpression("IF(tms.status IS NULL, 0, tms.status)", 'status');
    $query->addExpression("IF(tmr.roles IS NULL, '<none>', tmr.roles)", 'roles');
    $query->innerJoin('groups_field_data', 't', "t.id = g.gid");
    $query->leftJoin('team_membership_status', 'tms', "tms.team_id = g.gid AND tms.member_id = g.entity_id");
    $query->leftJoin('user__field_first_name', 'ufn', 'ufn.entity_id = g.entity_id');
    $query->leftJoin('user__field_preferred_first_name', 'upfn', 'upfn.entity_id = g.entity_id');
    $query->leftJoin('user__field_last_name', 'uln', 'uln.entity_id = g.entity_id');
    $query->orderBy('uln.field_last_name_value', 'ASC');
		
    $group_roles = db_select('group_content__group_roles', 'gr');
    $group_roles->fields('gr', ['entity_id']);
    $group_roles->addExpression("GROUP_CONCAT(REPLACE(group_roles_target_id, 'team-', '') ORDER BY group_roles_target_id ASC SEPARATOR ', ')", 'roles');
    $group_roles->condition('gr.bundle', 'team-group_membership', '=');
    $group_roles->groupBy('gr.entity_id');
    $query->leftJoin($group_roles, 'tmr', "tmr.entity_id = g.id");
    
    $query->condition('g.gid', $gid, '=');
    $query->condition('g.type', 'team-group_membership', '=');
    // The actual action of sorting the rows is here.
    $sort = $query->extend('Drupal\Core\Database\Query\TableSortExtender')
                        ->orderByHeader($header);
    // Limit the rows to 20 for each page.
    $pager = $sort->extend('Drupal\Core\Database\Query\PagerSelectExtender')
                        ->limit(10);
    $members = $pager->execute();
    
    //echo $query->__toString();
    
    $rows = [];
    // edit icon
    $edit_img_tag = '<img src="'. base_path() . drupal_get_path('module', 'my_groups') . '/images/edit-icon.png" width="20"/>';
    $rendered_edit_icon = render($edit_img_tag);
    $edit_icon = Markup::create($rendered_edit_icon);
    
    // delete icon
    $delete_img_tag = '<img src="'. base_path() . drupal_get_path('module', 'my_groups') . '/images/trash.png" width="20"/>';
    $rendered_delete_icon = render($delete_img_tag);
    $delete_icon = Markup::create($rendered_delete_icon);
    foreach ($members as $member) {
      $first_name = empty($member->field_preferred_first_name_value) ? $member->field_first_name_value : $member->field_preferred_first_name_value; 
      $delete_msg = 'Are you sure you want to remove '.$first_name.' '.$member->field_last_name_value.' from '.$member->label.'?';
      //echo '<pre>'; print_r($member); echo '</pre>';
      $edit = Link::fromTextAndUrl($edit_icon, Url::fromRoute('entity.group_content.edit_form', ['group' => $gid, 'group_content' => $member->id, 'destination' => "/team/$gid/members"]))->toString();
      
      //$delete = Link::fromTextAndUrl($delete_icon, Url::fromRoute('entity.group_content.delete_form', ['group' => $gid, 'group_content' => $member->id, 'destination' => "/team/$gid/members"], ['attributes' => ['class' => ['dialog'], 'msg'=> $delete_msg]]))->toString();
      $delete = Link::fromTextAndUrl($delete_icon, Url::fromRoute('teammember.delete', ['group' => $gid, 'user' => $member->entity_id], ['attributes' => ['class' => ['dialog'], 'msg'=> $delete_msg]]))->toString();

      // contact
      $contact = Link::fromTextAndUrl('Contact', Url::fromRoute('entity.user.contact_form', ['user' => $member->entity_id], ['attributes' => ['class' => ['btn', 'btn-primary', 'text-uppercase', 'font-fjalla']]]))->toString();
      
      // contact
      $reinvite = Link::fromTextAndUrl('Re-Invite', Url::fromRoute('team.reinvite', ['teamid' => $gid, 'memberid' => $member->entity_id], ['attributes' => ['class' => ['btn', 'btn-primary', 'text-uppercase', 'font-fjalla']]]))->toString();
      
      $changed_time = \Drupal::service('date.formatter')->format($member->changed, 'custom', 'm/d/Y - h:i a', $user->getTimeZone());
      
      // member status && actions
      if($member->uid == $member->entity_id){
        $member_status = 'Team owner';
        $actions = t('@edit', array('@edit' => $edit));
      }else{
        if($member->status == 1){
          $member_status = 'Member';
          $actions = t('@edit &nbsp;&nbsp; @delete', array('@edit' => $edit, '@delete' => $delete));
        }else if($member->status == 2){
          $member_status = 'Invitation declined';
          //$deletetxt = Link::fromTextAndUrl('Delete', Url::fromRoute('entity.group_content.delete_form', ['group' => $gid, 'group_content' => $member->id, 'destination' => "/team/$gid/members"], ['attributes' => ['class' => ['btn', 'btn-primary', 'text-uppercase', 'font-fjalla', 'dialog'], 'msg'=> $delete_msg]]))->toString();					
					$deletetxt = Link::fromTextAndUrl('Delete', Url::fromRoute('teammember.delete', ['group' => $gid, 'user' => $member->entity_id], ['attributes' => ['class' => ['btn', 'btn-primary', 'text-uppercase', 'font-fjalla', 'dialog'], 'msg'=> $delete_msg]]))->toString();
          $actions = t('@reinvite @contact @delete', array('@reinvite' => $reinvite, '@contact' => $contact, '@delete' => $deletetxt));
        }else if($member->status == 3){
          $member_status = 'Left Group';
          //$deletetxt = Link::fromTextAndUrl('Delete', Url::fromRoute('entity.group_content.delete_form', ['group' => $gid, 'group_content' => $member->id, 'destination' => "/team/$gid/members"], ['attributes' => ['class' => ['btn', 'btn-primary', 'text-uppercase', 'font-fjalla', 'dialog'], 'msg'=> $delete_msg]]))->toString();
          $deletetxt = Link::fromTextAndUrl('Delete', Url::fromRoute('teammember.delete', ['group' => $gid, 'user' => $member->entity_id], ['attributes' => ['class' => ['btn', 'btn-primary', 'text-uppercase', 'font-fjalla', 'dialog'], 'msg'=> $delete_msg]]))->toString();
					$actions = t('@reinvite @contact @delete', array('@reinvite' => $reinvite, '@contact' => $contact, '@delete' => $deletetxt));
        }else{
          $member_status = 'Invitation sent';
          $actions = t('@edit &nbsp;&nbsp; @delete', array('@edit' => $edit, '@delete' => $delete)); 
        }
      }
      
      $rows[] = [
        'fname' => $first_name,
        'lname' => ['data' => $member->field_last_name_value, 'class' => 'sorted'],
        'roles' => ucwords($member->roles),
        'status' => $member_status,
        'updated' => $changed_time,
        'actions' => array('data' => $actions, 'class' => 'table_wrap'),
      ];
    }
    
    

    // The table description.
    $build = array();
    // Generate the table.
    $build['config_table'] = array(
      '#theme' => 'table',
      '#header' => $header,
      '#rows' => $rows,
      '#attributes' => array('id'=>array('group-membership'), 'class' => array('team-membership'), 'border' => 0),
      '#attached' => ['library' => ['my_groups/team']],
      '#empty' => 'You currently have no teams.',
    );
 
    // Finally add the pager.
    $build['pager'] = array(
      '#type' => 'pager'
    );
 
    return $build;
  }
  
  /**
  * Checks access for this controller.
  */
  public function access() {
    $route = \Drupal::routeMatch()->getRouteName();
    $cuser = \Drupal::currentUser();
		$cuid = $cuser->id();
		$roles = $cuser->getRoles();
    if($route == 'team.listing'){
			// current path
			$current_path = \Drupal::service('path.current')->getPath();
			$args = explode('/', $current_path);
			$guid = empty($args[2]) ? 0 : $args[2]; 
			$own_teams = getOwnTeams($cuid);
			if(!in_array('administrator', $roles) && ($cuid <> $guid)){
				// Return 403 Access Denied page.  
				return AccessResult::forbidden();
			}
		}
    if((in_array('content_creator', $roles) || in_array('advanced_content_creator', $roles) || in_array('designer', $roles) || in_array('enterprise', $roles))){
		  return AccessResult::allowed();
    }	
  }
	
	/**
	* Checks member access for this controller.
	*/
	public function member_access() {
		// current user
		$cuser = \Drupal::currentUser();
		$cuid = $cuser->id();
		$roles = $cuser->getRoles();
		// current path
		$current_path = \Drupal::service('path.current')->getPath();
		$args = explode('/', $current_path);
		$gid = empty($args[2]) ? 0 : $args[2]; 
		$team_owner = getTeamOwner($gid);
		$team_members = getConfirmedTeamMembers($gid);
		$access = false;
		foreach($team_members as $member){
			if($cuid == $member->entity_id){// allow if confirmed member
				$access = true;
			} else {
				$access = false;
			} 
		}
		if($cuid == $team_owner){//allow if team owner
			$access = true;
		}
		else if(in_array('administrator', $roles)){
			$access = true;
		}
		
		if($access == true){
			return AccessResult::allowed();			
		}	else {
			return AccessResult::forbidden();
		}		
  }
	
  /**
  * Get current user.
  */
  public function getUser() {
    $uid = \Drupal::currentUser()->id();
    return ['user' => $uid];
  }
	
	/**
  * Send invitation to member
  */
  public function InviteTeam($teamid, $uid) {
    $time = time();
    $team_owner_uid = getTeamOwner($teamid);
    $owner = user_real_name($team_owner_uid);
    $team_name = getTeam($teamid);
    // accept invitation
    $connection = \Drupal::database();
    $connection->merge('team_membership_status')
      ->insertFields([
        'team_id' => $teamid,
        'member_id' => $uid,
        'status' => 4,
        'created' => $time,
        'changed' => $time,
      ])
      ->updateFields([
        'status' => 4,
        'changed' => $time,
      ])
      ->key(['team_id' => $teamid, 'member_id' => $uid])
      ->execute();
		$real_text = [$team_name, $owner];
		$notification =\Drupal::service('notification_system.notification_controller')->addNotification('Team Invitation', $real_text, $uid);
			
    $member_name = user_real_name($uid);
		\Drupal::messenger()->addStatus(t("$member_name has been invited."));   
    // set message and redirect
    return new RedirectResponse(\Drupal::url('team.members', ['group' => $teamid], ['absolute' => TRUE])); 
  }
  
  /**
  * Get current user.
  */
  public function acceptTeam($teamid) {
    $uid = \Drupal::currentUser()->id();
		$invitee_name = user_real_name($uid);
		$team_name = getTeam($teamid);
		$team_owner_uid = getTeamOwner($teamid);
    $time = time();
    
    // accept invitation
    $connection = \Drupal::database();
    $connection->merge('team_membership_status')
      ->insertFields([
        'team_id' => $teamid,
        'member_id' => $uid,
        'status' => 1,
        'created' => $time,
        'changed' => $time,
      ])
      ->updateFields([
        'status' => 1,
        'changed' => $time,
      ])
      ->key(['team_id' => $teamid, 'member_id' => $uid])
      ->execute();
		$real_text = [$team_name, '', $invitee_name];
		$notification =\Drupal::service('notification_system.notification_controller')->addNotification('Team Invitation Accepted', $real_text, $team_owner_uid);
      
    // set message and redirect
    \Drupal::messenger()->addStatus(t('Invitation accepted.'));
    return new RedirectResponse(\Drupal::url('team.listing', ['user' => $uid], ['absolute' => TRUE])); 
  }
  
  /**
  * Delete team.
  */
  public function deleteTeam($group) {
    $uid = \Drupal::currentUser()->id();
    $team_id = $group->id();
    // delete data from custom table: team_membership_status 
    $query = \Drupal::service('database')->delete('team_membership_status');
    $query->condition('team_id', $team_id);
    $query->execute();
    
    // delete group
    $group->delete();
    
    // set message and redirect
    \Drupal::messenger()->addStatus(t('Team deleted successfully.'));
    return new RedirectResponse(\Drupal::url('team.listing', ['user' => $uid], ['absolute' => TRUE]));
  }
  
  /**
  * Delete team member.
  */
  public function deleteTeamMember($group, $user) {
    // delete data from custom table: team_membership_status 
    $query = \Drupal::service('database')->delete('team_membership_status');
    $query->condition('team_id', $group->id());
    $query->condition('member_id', $user->id());
    $query->execute();
    
    // delete team member
    $group->removeMember($user);
    
    // set message and redirect
    \Drupal::messenger()->addStatus(t('The team member has been deleted.'));
    return new RedirectResponse(\Drupal::url('team.members', ['group' => $group->id()], ['absolute' => TRUE]));
  }
  
  /**
  * Get current user.
  */
  public function reinviteTeam($teamid, $memberid) {
    $time = time();
		$member_name = getUserName($memberid);
    // re-invitation
    $connection = \Drupal::database();
    $connection->update('team_membership_status')
      ->fields([
        'status' => 0,
        'changed' => $time,
      ])
      ->condition('team_id', $teamid, '=')
      ->condition('member_id', $memberid, '=')
      ->execute();
      
    // set message and redirect
    \Drupal::messenger()->addStatus(t("$member_name has been re-invited."));
    return new RedirectResponse(\Drupal::url('team.members', ['group' => $teamid], ['absolute' => TRUE])); 
  }
  
  /**
  * Get current user.
  */
  public function declineTeam($teamid) {
    $uid = \Drupal::currentUser()->id();
    $time = time();
    $invitee_name = user_real_name($uid);
		$team_name = getTeam($teamid);
		$team_owner_uid = getTeamOwner($teamid);
    // remove member from team
    /*
    if($member = \Drupal\user\Entity\User::load($uid)) {
      if($group = \Drupal\group\Entity\Group::load($teamid)) {
        $group->removeMember($member);
      }
    }
    */
    
    // accept invitation
    $connection = \Drupal::database();
    $connection->merge('team_membership_status')
      ->insertFields([
        'team_id' => $teamid,
        'member_id' => $uid,
        'status' => 2,
        'created' => $time,
        'changed' => $time,
      ])
      ->updateFields([
        'status' => 2,
        'changed' => $time,
      ])
      ->key(['team_id' => $teamid, 'member_id' => $uid])
      ->execute();
		$real_text = [$team_name, '', $invitee_name];
		$notification =\Drupal::service('notification_system.notification_controller')->addNotification('Team Invitation Declined', $real_text, $team_owner_uid);
      
    // set message and redirect
    \Drupal::messenger()->addStatus(t('Declined successfully.'));
    return new RedirectResponse(\Drupal::url('team.listing', ['user' => $uid], ['absolute' => TRUE]));
  }
  
  
  /**
  * Get current user.
  */
  public function leaveTeam($teamid) {
    $uid = \Drupal::currentUser()->id();
    $time = time();  
    // accept invitation
    $connection = \Drupal::database();
    $connection->merge('team_membership_status')
      ->insertFields([
        'team_id' => $teamid,
        'member_id' => $uid,
        'status' => 3,
        'created' => $time,
        'changed' => $time,
      ])
      ->updateFields([
        'status' => 3,
        'changed' => $time,
      ])
      ->key(['team_id' => $teamid, 'member_id' => $uid])
      ->execute();
      
    // set message and redirect
    \Drupal::messenger()->addStatus(t('Left successfully.'));
    return new RedirectResponse(\Drupal::url('team.listing', ['user' => $uid], ['absolute' => TRUE]));
  }  
  
  //get user raw data
  public function getParticipateTeam() {
    $user = \Drupal::currentUser();
    $uid = $user->id();
    $roles = $user->getRoles();
    $results['uid'] = $uid;
    if (in_array('administrator', $roles)) {
      $results['administrator'] = 1;
    }else{
      $results['administrator'] = 0;
    }
    
    $results['participate_in_teams'] = 0;
    $results['personal_contact_form'] = 0;
    $query = \Drupal::database()->select('users_field_data', 'u');
    $query->leftJoin('users_data', 'ud', "ud.uid = u.uid AND ud.module = 'contact' AND ud.serialized = 0");
    $query->leftJoin('user__field_teams_option', 'to', 'to.entity_id = u.uid');
    
    
    $query->fields('to', ['field_teams_option_value']);
    $query->fields('ud', ['value']);
    $query->condition('u.uid', $uid, '=');
    $result = $query->execute()->fetchObject();
    if(!empty($result)){
      $results['participate_in_teams'] = is_null($result->field_teams_option_value) ? 0 : $result->field_teams_option_value;
      $results['personal_contact_form'] = is_null($result->value) ? 0 : $result->value;
    }
    
    return new JsonResponse($results);
  }
  
	/**
	* get member count
	*/
	public function membersCount($gid){
		$query = \Drupal::database()->select('group_content_field_data', 'g');
		$query->fields('g', ['id', 'uid', 'entity_id']);
		$query->fields('t', ['label']);
		$query->fields('ufn', ['field_first_name_value']);
		$query->fields('upfn', ['field_preferred_first_name_value']);
		$query->fields('uln', ['field_last_name_value']);
		$query->addExpression("IF(tms.changed IS NULL, g.changed, tms.changed)", 'changed');
		$query->addExpression("IF(tms.status IS NULL, 0, tms.status)", 'status');
		$query->addExpression("IF(tmr.roles IS NULL, '<none>', tmr.roles)", 'roles');
		$query->innerJoin('groups_field_data', 't', "t.id = g.gid");
		$query->leftJoin('team_membership_status', 'tms', "tms.team_id = g.gid AND tms.member_id = g.entity_id");
		$query->leftJoin('user__field_first_name', 'ufn', 'ufn.entity_id = g.entity_id');
		$query->leftJoin('user__field_preferred_first_name', 'upfn', 'upfn.entity_id = g.entity_id');
		$query->leftJoin('user__field_last_name', 'uln', 'uln.entity_id = g.entity_id');
		$query->condition('g.gid', $gid, '=');
		$query->condition('g.type', 'team-group_membership', '=');
		$members_number = $query->countQuery()->execute()->fetchField();
		return $members_number;
	}
	
	/**
		* get all member informations
		*/
	public function getAllTeamMembersInfo($gid){
		$query = \Drupal::database()->select('group_content_field_data', 'g');
		$query->fields('g', ['id', 'uid', 'entity_id']);
		$query->fields('t', ['label']);
		$query->fields('ufn', ['field_first_name_value']);
		$query->fields('upfn', ['field_preferred_first_name_value']);
		$query->fields('uln', ['field_last_name_value']);
		$query->addExpression("IF(tms.changed IS NULL, g.changed, tms.changed)", 'changed');
		$query->addExpression("IF(tms.status IS NULL, 0, tms.status)", 'status');
		$query->addExpression("IF(tmr.roles IS NULL, '<none>', tmr.roles)", 'roles');
		$query->innerJoin('groups_field_data', 't', "t.id = g.gid");
		$query->leftJoin('team_membership_status', 'tms', "tms.team_id = g.gid AND tms.member_id = g.entity_id");
		$query->leftJoin('user__field_first_name', 'ufn', 'ufn.entity_id = g.entity_id');
		$query->leftJoin('user__field_preferred_first_name', 'upfn', 'upfn.entity_id = g.entity_id');
		$query->leftJoin('user__field_last_name', 'uln', 'uln.entity_id = g.entity_id');
		
		$group_roles = db_select('group_content__group_roles', 'gr');
		$group_roles->fields('gr', ['entity_id']);
		$group_roles->addExpression("GROUP_CONCAT(REPLACE(group_roles_target_id, 'team-', '') ORDER BY group_roles_target_id ASC SEPARATOR ', ')", 'roles');
		$group_roles->condition('gr.bundle', 'team-group_membership', '=');
		$group_roles->groupBy('gr.entity_id');
		
		$query->leftJoin($group_roles, 'tmr', "tmr.entity_id = g.id");
		$query->condition('g.gid', $gid, '=');
		$query->condition('g.type', 'team-group_membership', '=');
		$members = $query->execute()->fetchAll();
		return $members;
	}
	
	/**
	 * Post method for sharing/unsharing media kits by team 
	 */
	public function team_share_media_kit(){
		if(isset($_POST['team_id']) && isset($_POST['user_id'])) {
			$team_id = $_POST['team_id'];
			$selected = $_POST['selected'];
			$unselected = $_POST['unselected'];
			$user_id = $_POST['user_id'];
			$group = \Drupal\group\Entity\Group::load($team_id); 
			if($group) {
				$paragraph_entities = $group->get('field_member_media_kits');
				if(is_array($selected) && isset($selected)){
					foreach($selected as $kit_id){
						$node = Node::load($kit_id);
						$existing_p = $this->check_paragraph_existance($team_id, $kit_id);
						if(empty($existing_p)){
							$paragraph_new = \Drupal\paragraphs\Entity\Paragraph::create([
								'type' => 'shared_media_kit',
								'field_media_kit_owner' => ['target_id' => $user_id],
								'field_shared_media_kit' => ['target_id' => $kit_id],
							]);
							$paragraph_new->save();
							$paragraph_entities->appendItem([
								'target_id' => $paragraph_new->id(),
								'target_revision_id' =>$paragraph_new->getRevisionId(),
							]);
							$group->save();
							//generate notification for "Team Media Kit Shared"
							$media_kit_owner_uid = $node->getOwnerId();
							$media_kit_owner = user_real_name($media_kit_owner_uid);
							$team_name = getTeam($team_id);
							$real_text = [$team_name, '', '', $media_kit_owner];
							$all_members = getConfirmedTeamMembers($team_id);
							foreach($all_members as $member){
								$notification =\Drupal::service('notification_system.notification_controller')->addNotification('Team Media Kit Shared', $real_text, $member->entity_id);
							}
						}
					}					
				}
				if(is_array($unselected) && isset($unselected)){
					foreach($unselected as $un_kit_id){
						foreach($paragraph_entities as $key => $p_entity){
							$para = \Drupal\paragraphs\Entity\Paragraph::load($p_entity->target_id);
							if(is_object($para) && $para->field_shared_media_kit->target_id == $un_kit_id){
								$group->get('field_member_media_kits')->removeItem($key);
								$group->save();
								$para->delete();								
							}
						}
					}
				}
				
				echo "done";
				exit;
			}
			echo "failed";
			exit;
		}
		echo "failed";
		exit;
	}
	
	/**
	 * Check for paragraph existeance of media kits
	 */
	public function check_paragraph_existance($team_id, $kit_id){
		$database = \Drupal::database();
		$query = $database->select('group__field_member_media_kits', 'mk');
		$query->leftJoin('paragraph__field_shared_media_kit', 's', "mk.field_member_media_kits_target_id = s.entity_id");
		$query->condition('mk.entity_id', $team_id, '=');
		$query->condition('s.field_shared_media_kit_target_id', $kit_id, '=');
		//$query->fields('mk', ['entity_id']);
		//$query->fields('mk', ['field_member_media_kits_target_id']);
		//$query->fields('s', ['entity_id']);
		$query->fields('mk', ['field_member_media_kits_target_id']);
		$result = $query->execute()->fetchField();
		return $result;
	}
	
	/**
	 * Get all shared media kits by team
	 */
	public function get_shared_media_kits($team_id, $user_id = null){
		if($user_id == null){
			$database = \Drupal::database();
			$query = $database->select('group__field_member_media_kits', 'mk');
			$query->leftJoin('paragraph__field_shared_media_kit', 's', "mk.field_member_media_kits_target_id = s.entity_id");
			$query->leftJoin('paragraph__field_media_kit_owner', 'o', "mk.field_member_media_kits_target_id = o.entity_id");
			$query->condition('mk.entity_id', $team_id, '=');
			$query->fields('mk', ['entity_id']);
			$query->fields('o', ['field_media_kit_owner_target_id']);
			$query->fields('s', ['field_shared_media_kit_target_id']);
			$results = $query->execute()->fetchAll();
		} else {
			$database = \Drupal::database();
			$query = $database->select('group__field_member_media_kits', 'mk');
			$query->leftJoin('paragraph__field_shared_media_kit', 's', "mk.field_member_media_kits_target_id = s.entity_id");
			$query->leftJoin('paragraph__field_media_kit_owner', 'o', "mk.field_member_media_kits_target_id = o.entity_id");
			$query->condition('mk.entity_id', $team_id, '=');
			$query->condition('o.field_media_kit_owner_target_id', $user_id, '=');
			$query->fields('mk', ['entity_id']);
			$query->fields('s', ['field_shared_media_kit_target_id']);
			$results = $query->execute()->fetchAll();
		}
		
		return $results;
	}
	
	/**
	 * Get all shared media kits by team 
	 * @fields [nid, title]
	 */
	public function get_shared_media_kits_by_team($team_id){
		$results = [];
		$database = \Drupal::database();
		$query = $database->select('group__field_member_media_kits', 'mk');
		$query->leftJoin('paragraph__field_shared_media_kit', 's', "mk.field_member_media_kits_target_id = s.entity_id");
		$query->leftJoin('paragraph__field_media_kit_owner', 'o', "mk.field_member_media_kits_target_id = o.entity_id");
		$query->condition('mk.entity_id', $team_id, '=');
		$query->fields('s', ['field_shared_media_kit_target_id']);
		$query->fields('o', ['field_media_kit_owner_target_id']);
		$kits = $query->execute()->fetchAll();
		
		foreach($kits as $kit){
		  $node = Node::load($kit->field_shared_media_kit_target_id);
			if($node){
				$results[] = ['nid' => $kit->field_shared_media_kit_target_id, 'title' => $node->getTitle(), 'owner' => false, 'member_name' => getUserName($kit->field_media_kit_owner_target_id)];
			}
		}
		
		return $results;
	}
	
}
