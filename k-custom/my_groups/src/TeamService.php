<?php
namespace Drupal\my_groups;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Drupal\Core\File\FileSystemInterface;
use Drupal\taxonomy\Entity\Term;
use Drupal\Core\Url;


class TeamService implements TeamServiceInterface {
  /**
   * @construct
   *
   * @params null
   * @return null
   */
  public function __construct() {
    
  }
  
  /**
   * {@inheritdoc}
   */
  public function validate(array $config) {
    // do nothing
  }
  
  /**
   * get team members
   *
   * @params null
   * @return string
   */
  public function getNumMembers($gid){
		$query = \Drupal::database()->select('group_content_field_data', 'g');
		$query->fields('g', ['entity_id']);				
		$query->innerJoin('groups_field_data', 't', "t.id = g.gid");
    $query->innerJoin('team_membership_status', 'tm', "tm.team_id = g.gid AND tm.member_id = g.entity_id AND tm.status = 1");
		$query->condition('g.gid', $gid, '=');
		$query->condition('g.type', 'team-group_membership', '=');
    $members = $query->countQuery()->execute()->fetchField();
		return $members;
	}
  
  /**
   * get team members
   *
   * @params null
   * @return string
   */
  public function getMembers($gid){
		$query = \Drupal::database()->select('group_content_field_data', 'g');
		$query->fields('g', ['id', 'entity_id']);
		$query->fields('t', ['label']);
		$query->fields('ufn', ['field_first_name_value']);
		$query->fields('upfn', ['field_preferred_first_name_value']);
		$query->fields('uln', ['field_last_name_value']);
		$query->innerJoin('groups_field_data', 't', "t.id = g.gid");
		$query->leftJoin('team_membership_status', 'tms', "tms.team_id = g.gid AND tms.member_id = g.entity_id");
		$query->leftJoin('user__field_first_name', 'ufn', 'ufn.entity_id = g.entity_id');
		$query->leftJoin('user__field_preferred_first_name', 'upfn', 'upfn.entity_id = g.entity_id');
		$query->leftJoin('user__field_last_name', 'uln', 'uln.entity_id = g.entity_id');
		$query->condition('g.gid', $gid, '=');
		$query->condition('g.type', 'team-group_membership', '=');
		$members = $query->execute()->fetchAll();
		return $members;
	}
  /**
   * get team member access
   *
   * @params null
   * @return string
   */
  public function getMembersAccess($gid, $cuid, $uid, $role){
    // current user is team member, owner can access products
    $query = \Drupal::database()->select('group_content_field_data', 'gm');
    $query->fields('gm', ['gid', 'uid', 'entity_id']);
    $query->innerJoin('group_content__group_roles', 'gmr', "gmr.entity_id = gm.id AND gmr.bundle = gm.type");
    $query->condition('gm.type', 'team-group_membership', '=');
    $query->condition('gm.gid', $gid, '=');
    $query->condition('gm.entity_id', $cuid, '=');
    $query->condition('gm.uid', $uid, '=');
    $query->condition('gmr.group_roles_target_id', $role, '=');
    $member = $query->execute()->fetchObject();
    if(empty($member)){
      return false;
    }
    return true;
  }
  /**
   * get team name
   *
   * @params null
   * @return string
   */
  public function getTeamName($gid, $uid){
    // current user is team member, owner can access products
    $query = \Drupal::database()->select('groups_field_data', 'team');
    $query->fields('team', ['label']);
    $query->condition('team.id', $gid, '=');
    $query->condition('team.uid', $uid, '=');
    $team = $query->execute()->fetchField();
    return $team;
  }
}
