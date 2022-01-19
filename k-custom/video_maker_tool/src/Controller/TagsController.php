<?php
/**
* @file
* Contains \Drupal\video_maker_tool\Controller\TagsController.php
*
*/
namespace Drupal\video_maker_tool\Controller;
use Drupal\Core\Controller\ControllerBase;
use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\taxonomy\Entity\Term;
use Drupal\media\Entity\Media;

class TagsController extends ControllerBase {
  /**
   * Returns current user private terms
   * @return json response
   * $tags
   */
  public function getPrivateTags(Request $request, User $user){
		$uid = $user->id();
    $term = trim($request->query->get('term'));   
    $query = \Drupal::database()->select('taxonomy_term_field_data', 'td');
		$query->join('user_term', 'ut', 'td.tid = ut.tid');
		$query->leftJoin('users_field_data', 'u', 'ut.uid = u.uid');
    $query->fields('td', ['tid', 'name']);
    $query->condition('ut.uid', $uid, '=');
    $query->condition('td.vid', 'keywords', '=');
    $query->condition('td.name', "%$term%", 'like');
    $query->orderBy('td.name', 'ASC');
    $keywords = $query->execute()->fetchAll();
     
    $tags = [];
    foreach($keywords as $tag){
      //$tags[] = $tag->name.'('.$tag->tid.')';  
      $tags[] = $tag->name;  
    }
    
    return new JsonResponse($tags);
  }
	
  /**
   * Create new private term if not exists for current user and reference it with media 
   * @return json response
   * $term
   */
  public function createPrivateTags(){
		if(isset($_POST['uid']) && isset($_POST['term_name']) && isset($_POST['mid'])) {
			$mid = $_POST['mid'];
			$uid = $_POST['uid'];
			$term_name = trim($_POST['term_name']); 
			$newterm = '';
			$tid = 0;
			
			$query = \Drupal::database()->select('taxonomy_term_field_data', 'td');
			$query->join('user_term', 'ut', 'td.tid = ut.tid');
			$query->leftJoin('users_field_data', 'u', 'ut.uid = u.uid');
			$query->fields('td', ['tid', 'name']);
			$query->condition('ut.uid', $uid, '=');
			$query->condition('td.vid', 'keywords', '=');
			$query->condition('td.name', $term_name, '=');
			$query->orderBy('td.name', 'ASC');
			$keywords = $query->execute()->fetchAll();
			
			foreach($keywords as $tag){
				if($term_name == $tag->name){
					$tid = $tag->tid;
				} else {
					$tid = 0;
				}
			}
			
			if($tid == 0){
				$term = Term::create([
          'name' => $term_name,
          'vid' => 'keywords',
        ]);
				$term->uid = $uid;
        $term->save();
				$newterm = $term->id();				
			} else {
				$newterm = $tid;
			}
			
			//reference tid with media
			if($newterm != '' && $newterm != 0){
				$media = Media::load($mid);
				$media->field_keywords[] = ['target_id' => $newterm];
				$media->save();
			}
			echo('done');
			exit;
			
		} else {
			echo('failed');
			exit;
		}

  }
  /**
   * Remove existing private term if already exists with media 
   * @return json response
   * $term
   */
  public function removePrivateTags(){
		if(isset($_POST['uid']) && isset($_POST['term_name']) && isset($_POST['mid'])) {
			$mid = $_POST['mid'];
			$uid = $_POST['uid'];
			$term_name = trim($_POST['term_name']); 
			$removeterm = '';
			$tid = 0;
			
			$query = \Drupal::database()->select('taxonomy_term_field_data', 'td');
			$query->join('user_term', 'ut', 'td.tid = ut.tid');
			$query->leftJoin('users_field_data', 'u', 'ut.uid = u.uid');
			$query->fields('td', ['tid', 'name']);
			$query->condition('ut.uid', $uid, '=');
			$query->condition('td.vid', 'keywords', '=');
			$query->condition('td.name', $term_name, '=');
			$query->orderBy('td.name', 'ASC');
			$keywords = $query->execute()->fetchAll();
			
			foreach($keywords as $tag){
				if($term_name == $tag->name){
					$tid = $tag->tid;
				}
			}
			
			if($tid != 0){
				$removeterm = $tid;
				$media = Media::load($mid);
				$keywords = $media->get('field_keywords')->getValue();
				$updatedTerms = [];
				foreach($keywords as $keyword) {
					if ($keyword['target_id'] != $removeterm)
						$updatedTerms[] = ['target_id' => $keyword['target_id']];      
				}
				$media->field_keywords = $updatedTerms;
				$media->save();
				
				echo('done');
				exit;
				
			} else {
				echo('failed');
				exit;
			}
		} else {
			echo('failed');
			exit;
		}

  }
  
  
}

