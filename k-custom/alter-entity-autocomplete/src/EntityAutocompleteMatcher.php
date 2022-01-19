<?php
namespace Drupal\alter_entity_autocomplete;

use Drupal\Component\Utility\Html;
use Drupal\Component\Utility\Tags;

class EntityAutocompleteMatcher extends \Drupal\Core\Entity\EntityAutocompleteMatcher {
  /**
   * Gets matched labels based on a given search string.
   */
  public function getMatches($target_type, $selection_handler, $selection_settings, $string = '') {
    $matches = [];
		$uid = \Drupal::currentUser()->id();
    if (isset($string)) {
      if($selection_handler == 'team_members'){
				$gid = $selection_settings['team_id'];
				//$members = getAllTeamMembers($gid);
        // SQL query to fetch members
        $query = \Drupal::database()->select('users_field_data', 'u');
        $query->join('user__field_teams_option', 'ut', 'ut.entity_id = u.uid');
        $query->leftJoin('user__field_first_name', 'fn', 'fn.entity_id = u.uid');
        $query->leftJoin('user__field_last_name', 'ln', 'ln.entity_id = u.uid');
        $query->leftJoin('user__field_preferred_first_name', 'pfn', 'pfn.entity_id = u.uid');
        $query->leftJoin('user__field_address', 'adrs', 'adrs.entity_id = u.uid');
        // roles
        $user_roles = db_select('user__roles', 'r')
          ->fields('r',array('entity_id'))
          ->condition('r.roles_target_id', ['content_creator', 'advanced_content_creator', 'designer'], 'IN')
          ->where('r.entity_id = u.uid');
					
				$teams = db_select('group_content_field_data', 'g');				
				$teams->join('team_membership_status', 'tms', "tms.team_id = g.gid AND tms.member_id = g.entity_id");
				$teams->condition('g.type', 'team-group_membership', '=');
				$teams->condition('g.gid', $gid, '=');
				//1 is confirmed member, 2 is declined membership, 3 is left group, 0 is re-invite member, 4 is invitation sent
				//$teams->condition('tms.status', [0,1,2,3,4], 'IN');		
				$teams->condition('tms.status', [0,1,2,3,4], 'IN');		
				$teams->fields('g', ['entity_id', 'uid']);
				$teams->where('g.entity_id = u.uid');
					
        $query->exists($user_roles);
        $query->notExists($teams);
        $query->fields('u', ['uid', 'name']);
        $query->addExpression("IF(pfn.field_preferred_first_name_value IS NULL, CONCAT_WS(' ', fn.field_first_name_value, ln.field_last_name_value), CONCAT_WS(' ', pfn.field_preferred_first_name_value, ln.field_last_name_value))", 'full_name');
        $query->fields('adrs', ['field_address_country_code', 'field_address_administrative_area', 'field_address_locality', 'field_address_postal_code']);
        // AND conditions
        $query->condition('ut.field_teams_option_value', 1, '=');
				$query->condition('u.uid', $uid, '<>');
				$query->condition('u.status', 1, '=');
        // OR conditions
        $orGroup = $query->orConditionGroup()
            ->where("CONCAT_WS(' ', fn.field_first_name_value, ln.field_last_name_value) LIKE '%". $query->escapeLike($string). "%'")
            ->condition('fn.field_first_name_value', "%" . $query->escapeLike($string) . "%", 'LIKE')
            ->condition('ln.field_last_name_value', "%" . $query->escapeLike($string) . "%", 'LIKE');
        $query->condition($orGroup);
        $query->orderBy('fn.field_first_name_value', 'ASC');
        $query->orderBy('ln.field_last_name_value', 'ASC');
        $query->range(0, 10);
        $result = $query->execute();
        
        //$query_string = $query->__toString();

        // arguments passed.
        while($row = $result->fetchObject()) {
          $label = $row->full_name;
          // city & state
          $address = [];
          if(!empty($row->field_address_locality)){
            $address[] = $row->field_address_locality;
          }
          if(!empty($row->field_address_administrative_area)){
            $address[] = $row->field_address_administrative_area;
          }
          if(!empty($address)){
            $label .= ' (' . implode(', ', $address) . ')';
          }

          $key = $label . ' (' . $row->uid . ')';
          //$key = $label;
          $key = preg_replace('/\s\s+/', ' ', str_replace("\n", '', trim(Html::decodeEntities(strip_tags($key)))));
          // Names containing commas or quotes must be wrapped in quotes.
          //$key = Tags::encode($key);
          // Collect matches
          $matches[] = ['value' => $key, 'label' => $label];
        }
      }else{
        // default auto-complete
        $options = [
          'target_type'      => $target_type,
          'handler'          => $selection_handler,
          'handler_settings' => $selection_settings,
        ];
        // handler to get reference entities 
        $handler = $this->selectionManager->getInstance($options);
        // Get an array of matching entities.
        $match_operator = !empty($selection_settings['match_operator']) ? $selection_settings['match_operator'] : 'CONTAINS';
        $entity_labels = $handler->getReferenceableEntities($string, $match_operator, 10);
        // Loop through the entities and convert them into autocomplete output.
        foreach ($entity_labels as $values) {
          foreach ($values as $entity_id => $label) {
            $key = $label . ' (' . $entity_id . ')';
            // Strip things like starting/trailing white spaces, line breaks and tags.
            $key = preg_replace('/\s\s+/', ' ', str_replace("\n", '', trim(Html::decodeEntities(strip_tags($key)))));
            // Names containing commas or quotes must be wrapped in quotes.
            $key = Tags::encode($key);
            // Collect matches 
            $matches[] = ['value' => $key, 'label' => $label];
          }
        }
      }
    } 
    return $matches;
  }
}
