<?php
namespace Drupal\video_maker_tool\Controller;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Drupal\field\Entity\FieldConfig;
use Drupal\Core\Render\Markup;
use Drupal\Component\Render\FormattableMarkup;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\taxonomy\Entity\Term;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;

class VideoMakerController extends ControllerBase {
  var $video_transition_duration = [0.25, 0.50, 0.75, 1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 2.75, 3.00, 3.25, 3.50, 3.75, 4.00, 4.25, 4.50, 4.75, 5.00, 5.25, 5.50, 5.75, 6.00];
  
  /**
   * Returns product templates page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function addVideo(){
    global $base_secure_url;
    $team_query = '';
    $team_name = '';
    if(isset($_GET['team'])){
      $uid = $_GET['uid'];
      $gid = $_GET['team'];
      $team_name = "Team: ";
      $team_name .= \Drupal::service('my_groups.team.service')->getTeamName($gid, $uid);
      $team_query = ["gid" => $gid, "muid" => $uid];
      $account = user_load($uid);
      $roles = $account->getRoles();
    }
    else {
      $account = \Drupal::currentUser();
      $uid = $account->id();
      $roles = $account->getRoles();
    }

    $variables = [];
    $variables['uid'] = $uid;
    $variables['media_preset'] = $this->getMediaPreset();
    $variables['mks'] = $this->getMKS($uid);

    $userProfessional = 0;
    $mediaCount = 0;
    if(in_array('content_creator', $roles)) {
      $userProfessional = 1;
    }
    //Check user role as admin
    $useradmin = 0;
    if(in_array('administrator', $roles)) {
      $useradmin = 1;
    }
    // transition tab
    $variables['transitions'] = $this->getVideoTransitions();
    $variables['transition_duration'] = $this->video_transition_duration;
    $variables['userProfessional'] = $userProfessional;
    $variables['useradmin'] = $useradmin;
    $variables['mediaCount'] = $mediaCount;
    $variables['team_query'] = $team_query;
    $variables['team_name'] = $team_name;
    
    // libraries
    $libraries[] = 'media_vault_tool/react.min';
		$libraries[] = 'media_vault_tool/react.dom.min';
		$libraries[] = 'media_vault_tool/axios';
		$libraries[] = 'media_vault_tool/km_global';
    $libraries[] = 'media_kit_selector/media.kit.global';
		$libraries[] = 'video_maker_tool/vmt';
		$libraries[] = 'video_maker_tool/vmt.cropit';
		$libraries[] = 'video_maker_tool/vmt.tagsinput';
    
    $render_data['theme_data'] = [
    '#theme'                  => 'video-maker-tool-add',
    '#variables'              => $variables,
    '#attached'               => [
      'library' => $libraries, 
      'drupalSettings' => [
          'media_base_url' => $base_secure_url, 
          'user_id' => $uid,
          'video_id' => 0,
          'media_preset_id' => 0,
          'userProfessional' => $userProfessional,
          'mediaCount' => $mediaCount,
        ],
      ],
    ];

    return $render_data;    
	}
  
  
  /**
   * Returns product templates page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function editVideo($video_id = 0){
    global $base_secure_url;
    $team_query = '';
    $team_name = '';
    if(isset($_GET['team'])){
      $uid = $_GET['uid'];
      $gid = $_GET['team'];
      $team_name = "Team: ";
      $team_name .= \Drupal::service('my_groups.team.service')->getTeamName($gid, $uid);
      $team_query = ["gid" => $gid, "muid" => $uid];
      $account = user_load($uid);
      $roles = $account->getRoles();
    }
    else {
      $account = \Drupal::currentUser();
      $uid = $account->id();
      $roles = $account->getRoles();
    }
    $userProfessional = 0;
    $mediaCount = 0;
    if(in_array('content_creator', $roles)) {
      $userProfessional = 1;
    }
    //Check user role as admin
    $useradmin = 0;
    if(in_array('administrator', $roles)) {
      $useradmin = 1;
    }
    $clone = 0;
    if(isset($_GET['clone']) && $_GET['clone'] == 'yes'){
      $clone = 1;
    }
    $variables = [];
    
    $query = \Drupal::database()->select('vmt_videos', 'v');
    $query->fields('v');
    $query->condition('v.video_id', $video_id, '=');
    $video = $query->execute()->fetchObject();
    if(empty($video)){
      throw new \Symfony\Component\HttpKernel\Exception\NotFoundHttpException();
    }
    
    //if(in_array($video->render_status, ['Pending', 'Ready']) && $clone == 0){
    if(in_array($video->render_status, ['Pending']) && $clone == 0){
      \Drupal::messenger()->addStatus(t('This video can\'t be editable.'));
      return new RedirectResponse(\Drupal::url('videomaker.video.list', ['user' => $uid], ['absolute' => TRUE]));
    }
    
    $variables['video'] = $video;
    $variables['uid'] = $uid;
    $variables['media_preset'] = $this->getMediaPreset();
    $variables['mks'] = $this->getMKS($uid);
    $variables['clone'] = $clone;
	
    // default image
    $field_info = FieldConfig::loadByName('media', 'video', 'field_video_thumbnail');
    $image_uuid = $field_info->getSetting('default_image')['uuid'];
    $default_image = \Drupal::service('entity.repository')->loadEntityByUuid('file', $image_uuid)->getFileUri();
    
    // story board
    $story_board = [];
    $selected_media = ['id' => 0, 'mid' => 0, 'rid' => 0, 'type' => 'image'];
    $mquery = \Drupal::database()->select('vmt_media', 'm');
    $mquery->fields('m');
    $mquery->condition('m.video_id', $video_id, '=');
    $mquery->orderBy('m.ordering', 'ASC');
    $story_board_medias = $mquery->execute();
    
    $story_board_media_count = 0;
    foreach($story_board_medias as $story_board_media) {
      $media = Media::load($story_board_media->mid);
      if(is_object($media)) {
        $thumb_style = \Drupal::entityTypeManager()->getStorage('image_style')->load('media_thumbnail');
        // image
        if($media->hasField('field_media_image') && !empty($media->field_media_image->entity)) {
          $src = $thumb_style->buildUrl($media->field_media_image->entity->getFileUri());
          $orig_src = file_create_url($media->field_media_image->entity->getFileUri());
        }
        // video thumbnail
        if($media->hasField('field_media_video_file')) {
          if(empty($media->field_video_thumbnail->entity)){
            $src = $thumb_style->buildUrl($default_image); 
            $orig_src = file_create_url($default_image);
          }else{
            $src = $thumb_style->buildUrl($media->field_video_thumbnail->entity->getFileUri());
            $orig_src = file_create_url($media->field_video_thumbnail->entity->getFileUri());
          }
        }
        
        // story board
        $story_board[] =  [
                            'id'  => $story_board_media->id, 
                            'mid' => $story_board_media->mid, 
                            'rid' => $story_board_media->rid, 
                            'src' => $src, 
                            'orig_src' => $orig_src, 
                            'duration' => $story_board_media->duration,
                            'selected' => $story_board_media->selected,
                            'clip_zoom' => $story_board_media->clip_zoom,
                          ];
        
        // selected media
        if(($story_board_media_count == 0) || ($story_board_media->selected == 1)) {
          $selected_media['id']   = $story_board_media->id;
          $selected_media['mid']  = $story_board_media->mid;
          $selected_media['rid']  = $story_board_media->rid;
          $selected_media['duration']  = $story_board_media->duration;
          $selected_media['type'] = $story_board_media->type;
        }
        
        $story_board_media_count++;
      }
    }

    
    $mediaCount = count($story_board);
    $variables['story_board'] = $story_board;
    $variables['selected_media'] = $selected_media;
    // transition tab
    $variables['transitions'] = $this->getVideoTransitions();
    $variables['transition_duration'] = $this->video_transition_duration;
    $variables['mediaCount'] = $mediaCount;
    $variables['useradmin'] = $useradmin;
    $variables['team_query'] = $team_query;
    $variables['team_name'] = $team_name;
    $variables['userProfessional'] = $userProfessional;
    
    // libraries
    $libraries[] = 'media_vault_tool/react.min';
		$libraries[] = 'media_vault_tool/react.dom.min';
		$libraries[] = 'media_vault_tool/axios';
		$libraries[] = 'media_vault_tool/km_global';
    $libraries[] = 'media_kit_selector/media.kit.global';
		$libraries[] = 'video_maker_tool/vmt';
		$libraries[] = 'video_maker_tool/vmt.cropit';
		$libraries[] = 'video_maker_tool/vmt.tagsinput';
    
    $render_data['theme_data'] = [
    '#theme'                  => 'video-maker-tool-edit',
    '#variables'              => $variables,
    '#attached'               => [
      'library' => $libraries, 
      'drupalSettings' => [
          'media_base_url' => $base_secure_url, 
          'user_id' => $uid,
          'video_id' => $video_id,
          'media_preset_id' => $video->media_preset_id,
          'soundtrack_data' => $video->sound_track,
          'mediaCount' => $mediaCount,
          'userProfessional' => $userProfessional,
          'team_query' => $team_query,
        ],
      ],
    ];

    return $render_data;    
	}
  
  /**
   * Returns product templates page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function manageVideo($user, Request $request){
    global $base_secure_url;
    $account = \Drupal::currentUser();
    $current_user_id = $account->id();
    $roles = $account->getRoles();
    
    //user as argument 
    $user_id = $user->get('uid')->value;
    /*
    // show all videos to administrator
    if(!in_array('administrator', $roles) && ($current_user_id <> $user_id)) {
      throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException();
    }
    */
    
    // search keyword
    $keyword = '';
    $favorite = null;
    $search = $request->request->get('search');
    if(empty($search)){
      $keyword = $request->query->get('keyword');
      $favorite = $request->query->get('favorite');
    }else{
      if(strtolower($search) == 'apply'){
        $keyword = $request->request->get('keyword');
        $favo = $request->request->get('heart');
        if($favo == 'on'){
         $fav = 1;	
        }else{
         $fav = 0;	
        }
        // redirect to add the keyword in query string
        if(isset($_GET['team'])){
          $gid = $_GET['team'];
          $muid = $_GET['uid'];
          return new RedirectResponse(Url::fromRoute('videomaker.video.list', ['user' => $user_id, 'keyword' => $keyword, 'favorite'=> $fav, 'team' => $gid, 'uid' => $muid], ['fragment' => 'nav-shared'])->toString());
        }else {
          return new RedirectResponse(\Drupal::url('videomaker.video.list', ['user' => $user_id, 'keyword' => $keyword, 'favorite'=> $fav], ['absolute' => TRUE])); 
        }
      }
    }
    
    $database = \Drupal::database();
    $query = $database->select('vmt_videos', 'v');
    $query->leftJoin('media__field_favorite', 'f', "f.entity_id = v.video_media_id AND f.bundle = 'video'");
    //$query->leftJoin('media__field_thumbnail_selections', 'ts', "ts.entity_id = v.video_media_id AND f.bundle = 'video' AND ts.delta=0");
    $query->leftJoin('media__field_video_thumbnail', 'ts', "ts.entity_id = v.video_media_id AND f.bundle = 'video' AND ts.delta=0");
    //$query->leftJoin('file_managed', 'fm', "fm.fid= ts.field_thumbnail_selections_target_id");
    $query->leftJoin('file_managed', 'fm', "fm.fid= ts.field_video_thumbnail_target_id");
    $query->fields('v');
    $query->fields('fm', ['uri']);
    $query->addExpression("IF(f.field_favorite_value IS NULL, 0, f.field_favorite_value)", 'favorite');
    $query->condition('v.user_id', $user_id, '=');
    if(!empty($keyword)){
      $orGroup = $query->orConditionGroup()
        ->condition('v.video_name', "%" . $database->escapeLike($keyword) . "%", 'LIKE')
        ->condition('v.render_data', "%" . $database->escapeLike($keyword) . "%", 'LIKE');
      // add the group to the query.
      $query->condition($orGroup);
    }
    
    if(!is_null($favorite)){
      if($favorite == 1){
        $query->condition('f.field_favorite_value', 1, '=');
      }else if($favorite == 0){
        /*
        $orFavGroup = $query->orConditionGroup()
          ->condition('f.field_favorite_value', 0, '=')
          ->isNull('f.field_favorite_value');
        // add the group to the query.
        $query->condition($orFavGroup);
        */
      } else {
        
      }
    }
    
    // sorting 
    $query->orderBy('v.updated', 'desc');
    // pagination
    $pager_query = $query->extend('Drupal\Core\Database\Query\PagerSelectExtender')->limit(20);
    $videos = $pager_query->execute()->fetchAll();
    $media_data = [];
    foreach($videos as $key=>$video){
      $media = Media::load($video->video_media_id);
      if (is_object($media)){
        if ($media->hasField('field_media_video_file')){
          $targetid = $media->field_media_video_file->target_id;
          if($targetid){
            $file = File::load($targetid);
            $media_data['original_fid'] = $targetid;
            $media_data['mid_url'] = file_create_url($file->getFileUri());
            if($media->field_duration->value != ''){
              $media_data['duration'] = $media->field_duration->value; 
            }
            else{
              $media_data['duration'] = 30;
            }
          }
        }
      }
      $videos[$key]->media_data = $media_data;
    }
    
    $team_name = '';
    $team_query = '';
    $member_video = '';
    if(isset($_GET['team'])){
      $gid = $_GET['team'];
      $muid = $_GET['uid'];
      $team_query = ["gid" => $gid, "muid" => $muid];
      $team_name = "Team: ";
      $team_name .= \Drupal::service('my_groups.team.service')->getTeamName($gid, $muid);
      $_SESSION['team']['gid'] = $gid;
      $_SESSION['team']['uid'] = $muid;
      $member_video = $this->manageMemberVideo($muid, $request);
    }
    else {
      unset($_SESSION['team']);
    }
    // testing table template as rendered array
    $header = [
    'team_id' => ['data' => t('Team ID'), 'class' => 'sortempty', 'id' =>'team-id', 'width' => '10%', 'onclick' => 'sortColumn(this, "number")'],
    'team_name' => ['data' => t('Team Name'), 'class' => 'sortempty asc-icon bg-sort', 'id' => 'team-name', 'onclick' => 'sortColumn(this, "text")'],
    'owner' => ['data' => t('Owner'), 'class' => 'sortempty', 'id' => 'team-owner', 'width' => '20%', 'onclick' => 'sortColumn(this, "text")'],
    'members' => ['data' => t('Members'), 'width' => '15%'],
    'actions' => ['data' => t('Actions'), 'id' => 'team-owner-action', 'width' => '15%', 'class' => 'sortempty'],
    ];
    
    $query = \Drupal::database()->select('group_content_field_data', 'gm');
    $query->fields('team', ['id', 'label', 'uid']);
    $query->fields('ufn', ['field_first_name_value']);
    $query->fields('upfn', ['field_preferred_first_name_value']);
    $query->fields('uln', ['field_last_name_value']);
    $query->innerJoin('group_content__group_roles', 'gmr', "gmr.entity_id = gm.id AND gmr.bundle = gm.type");
    $query->innerJoin('groups_field_data', 'team', "team.id = gm.gid");
    $query->innerJoin('team_membership_status', 'tm', "tm.team_id = gm.gid AND tm.member_id = gm.entity_id AND tm.status = 1");
    $query->leftJoin('user__field_first_name', 'ufn', 'ufn.entity_id =team.uid');
    $query->leftJoin('user__field_preferred_first_name', 'upfn', 'upfn.entity_id = team.uid');
    $query->leftJoin('user__field_last_name', 'uln', 'uln.entity_id = team.uid');
    $query->condition('team.type', 'team', '=');
    $query->condition('gm.entity_id', $current_user_id, '=');
    $query->condition('team.uid', $current_user_id, '<>');
    $query->condition('gmr.group_roles_target_id', 'team-video_maker', '=');
    $query->orderBy('team.label', 'ASC');
    $sort = $query->extend('Drupal\Core\Database\Query\TableSortExtender')->orderByHeader($header);
    // Limit the rows to 20 for each page.
    $pager = $sort->extend('Drupal\Core\Database\Query\PagerSelectExtender')->limit(25);
    $teams = $pager->execute();
    
    $edit_img_tag = '<img src="'. base_path() . drupal_get_path('module', 'my_groups') . '/images/edit-icon.png" width="20"/>';
    $rendered_edit_icon = render($edit_img_tag);
    $edit_icon = Markup::create($rendered_edit_icon);
    
    $rows = [];
    foreach ($teams as $team) {
      // team owner name
      if(empty($team->field_preferred_first_name_value)){
        $fname = $team->field_first_name_value;
      }else{
        $fname = $team->field_preferred_first_name_value;
      }
      $lname = $team->field_last_name_value;
      $owner = $fname.' '.$lname;
      // number of team members
      $members = \Drupal::service('my_groups.team.service')->getNumMembers($team->id);
      
      $url = Url::fromRoute('videomaker.video.list', ['user' => $current_user_id]);
      $args = ['team' => $team->id, 'uid' => $team->uid];
      $url->setOptions(array('query' => $args, 'fragment' => 'nav-shared'));
      $edit = Link::fromTextAndUrl($edit_icon, $url)->toString();
      //$edit = Link::fromTextAndUrl($edit_icon, Url::fromRoute('videomaker.video.list', ['user' => $team->uid]).'?team='.$team->id)->toString();
      $actions = t('@edit', array('@edit' => $edit));

      $rows[] = [
            'team_id' =>  ['data' => $team->id],
            'team_name' => ['data' => $team->label, 'class' => 'sorted'],
            'owner' => ['data' => $owner],
            'members' => $members,
            'actions' => $actions,
          ];   
    }
 
    // The table description.
    $build_teams = array();
    // Generate the table.
    $build_teams['config_table'] = array(
      '#theme' => 'table',
      '#header' => $header,
      '#rows' => $rows,
      '#attributes' => array('id'=>array('groups-teams'), 'class' => array('teams'), 'border' => 0),
      '#attached' => ['library' => ['my_groups/team']],
      '#empty' => 'You currently have no teams.',
    );
    $variables = [];
    $variables['keyword'] = $keyword;
    $variables['favorite'] = $favorite;
    $variables['user_id'] = $user_id;
    $variables['videos']  = $videos;
    $libraries[] = 'media_vault_tool/react.min';
    $libraries[] = 'media_vault_tool/react.dom.min';
    $libraries[] = 'media_vault_tool/axios';
    $libraries[] = 'video_maker_tool/vmt.listing';
    // Finally add the pager
    //$variables['pagination'] = ['pager' => ['#type' => 'pager']];
    $variables['pagination']['one'] = ['pager' => ['#type' => 'pager', '#element' => 0]];
    $variables['pagination']['two'] = ['pager' => ['#type' => 'pager', '#element' => 1]];
    $variables['build_teams'] = $build_teams;
    $variables['team_name'] = $team_name;
    $variables['team_query'] = $team_query;
    $variables['member_video'] = $member_video;
    
    $build = array();
    $build['theme_data'] = [
    '#theme'                  => 'video-listing',
    '#variables'              => $variables,
    '#attached'               => [
      'library' => $libraries, 
      ],
    ];
    
    return $build; 
	}
  /**
   * Returns product templates page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function manageMemberVideo($user_id, Request $request){
    global $base_secure_url;
    $team = $_GET['team'];
    $muid = $_GET['uid'];
    // search keyword
    $keyword = '';
    $favorite = null;
    $search = $request->request->get('search');
    if(empty($search)){
      $keyword = $request->query->get('keyword');
      $favorite = $request->query->get('favorite');
    }
    $database = \Drupal::database();
    $query = $database->select('vmt_videos', 'v');
    $query->leftJoin('media__field_favorite', 'f', "f.entity_id = v.video_media_id AND f.bundle = 'video'");
    $query->leftJoin('media__field_video_thumbnail', 'ts', "ts.entity_id = v.video_media_id AND f.bundle = 'video' AND ts.delta=0");
    $query->leftJoin('file_managed', 'fm', "fm.fid= ts.field_video_thumbnail_target_id");
    $query->fields('v');
    $query->fields('fm', ['uri']);
    $query->addExpression("IF(f.field_favorite_value IS NULL, 0, f.field_favorite_value)", 'favorite');
    $query->condition('v.user_id', $user_id, '=');
    if(!empty($keyword)){
      $orGroup = $query->orConditionGroup()
        ->condition('v.video_name', "%" . $database->escapeLike($keyword) . "%", 'LIKE')
        ->condition('v.render_data', "%" . $database->escapeLike($keyword) . "%", 'LIKE');
      // add the group to the query.
      $query->condition($orGroup);
    }
    if(!is_null($favorite)){
      if($favorite == 1){
        $query->condition('f.field_favorite_value', 1, '=');
      }
    }
    // sorting 
    $query->orderBy('v.updated', 'desc');
    // pagination
    $pager_query = $query->extend('Drupal\Core\Database\Query\PagerSelectExtender')->limit(20);
    $videos = $pager_query->execute()->fetchAll();
    $media_data = [];
    foreach($videos as $key=>$video){
      $media = Media::load($video->video_media_id);
      if (is_object($media)){
        if ($media->hasField('field_media_video_file')){
          $targetid = $media->field_media_video_file->target_id;
          if($targetid){
            $file = File::load($targetid);
            $media_data['original_fid'] = $targetid;
            $media_data['mid_url'] = file_create_url($file->getFileUri());
            if($media->field_duration->value != ''){
              $media_data['duration'] = $media->field_duration->value; 
            }
            else{
              $media_data['duration'] = 30;
            }
          }
        }
      }
      $videos[$key]->media_data = $media_data;
    }
    return $videos;
  }
  /**
   * get media info
   *
   * @return array
   *   media data.
   */
  public function mediaInfo(Media $media){
		$media_data = [];
		if (is_object($media)){
			if ($media->hasField('field_media_video_file')){
        $targetid = $media->field_media_video_file->target_id;
        if($targetid){
          $file = File::load($targetid);
          $media_data['original_fid'] = $targetid;
          $media_data['mid_url'] = file_create_url($file->getFileUri());
          if($media->field_duration->value != ''){
            $media_data['duration'] = $media->field_duration->value; 
          }
          else{
            $media_data['duration'] = 30;
          }
				}
      }
    }			
    return new JsonResponse($media_data);
	}
  
  
  /**
   * make media favorite
   *
   * @return array
   *   media data.
   */
  public function makeFavorite(Media $media, Request $request){
    $favorite = $request->request->get('favorite');
    $media->set('field_favorite', $favorite);
    $media->save();
    return new JsonResponse(['status' => 200, 'msg' => 'success']);
  }

  /**
   * Returns media preset
   *
   * @return array
   *   A simple renderable array.
   */
  public function getMediaPreset(){
    $query = \Drupal::database()->select('taxonomy_term_field_data', 'td');
    $query->innerJoin('taxonomy_term__field_asset_editors', 'fae', "td.vid = fae.bundle AND td.tid = fae.entity_id");
    $query->innerJoin('taxonomy_term__field_elastic_transcoder_preset', 'etp', 'td.vid = etp.bundle AND td.tid = etp.entity_id');
    $query->fields('td', ['tid', 'name']);
    $query->condition('td.vid', 'image_preset', '=');
    $query->condition('fae.field_asset_editors_value', 'video', '=');
    $query->orderBy('td.name', 'ASC');
    $media_preset = $query->execute()->fetchAll();
    return $media_preset; 
  }
  
  /**
   * Returns media preset properties
   *
   * @return array
   *   A simple renderable array.
   */
  public function getMediaPresetProperties($mediapresetid){
    $preset_id = $mediapresetid->id();
    $media_preset = \Drupal::service('media.preset')->getMediaPresetProperties($preset_id);
    return $media_preset; 
  }

  /**
   * Returns media preset properties
   *
   * @return array
   *   A simple renderable array.
   */
  public function getPresetMedia(){
    $preset_id  = \Drupal::request()->get('preset_id');
    $vid  = \Drupal::request()->get('vid');
    $mid  = \Drupal::request()->get('mid');
    $rid  = \Drupal::request()->get('rid');

    $response = [];
    $preset = \Drupal::service('media.preset')->getMediaPresetProperties($preset_id, 'array');
    $response['preset'] = $preset;
    
    // media clip default settings
    $asset = [
              'mid' => 0, 
              'rid' => $rid,
              'asset_name' => '', 
              'type' => 'media', 
              'url' => '', 
              'src' => '', 
              'thumb_url' => '', 
              'modal_url' => '', 
              'dimentions' => '',
              'start_time' => 0,
              'duration' => 5,
              'duration_clip' => 5,
              'zoom' => 0,
              'volume' => 100,
              'crop_params' => '',
              'transition_duration' => 1.0, 
              'transition_option' => 0,
              'is_first_clip_transition' => 1,
              'is_last_clip_transition' => 1,
              'is_opt_out_transition' => 0,
              'clip_zoom' => 'no-zoom',
            ];
              
    $media = Media::load($mid);
    if(is_object($media)) {
      $asset['mid'] = $media->id();
      $asset['asset_name'] = $media->getName(); 
      $thumb = \Drupal::entityTypeManager()->getStorage('image_style')->load('90x90_media_vault_photo');
      $modal = \Drupal::entityTypeManager()->getStorage('image_style')->load('image_modal');      
      if($media->hasField('field_media_image')) {
        $asset['type'] = 'image';
        $asset['url'] = file_create_url($media->field_media_image->entity->getFileUri());
        $asset['src'] = file_create_url($media->field_media_image->entity->getFileUri());
        $asset['thumb_url'] = $thumb->buildUrl($media->field_media_image->entity->getFileUri());
        $asset['modal_url'] = $modal->buildUrl($media->field_media_image->entity->getFileUri());
        $asset['dimentions'] = $media->field_pixel_dimentions->value;
      }
      if($media->hasField('field_media_video_file')) {
        $asset['type'] = 'video';
        $asset['url'] = file_create_url($media->field_media_video_file->entity->getFileUri());
        if(empty($media->field_video_thumbnail->entity)){
          // default image
          $field_info = FieldConfig::loadByName('media', 'video', 'field_video_thumbnail');
          $image_uuid = $field_info->getSetting('default_image')['uuid'];
          $default_image = \Drupal::service('entity.repository')->loadEntityByUuid('file', $image_uuid)->getFileUri();
          // to avoid Cross-Origin resource
          $asset['src'] = $modal->buildUrl($default_image);
          $asset['thumb_url'] = $thumb->buildUrl($default_image);
          $asset['modal_url'] = $modal->buildUrl($default_image);
        }else{
          $asset['src'] = file_create_url($media->field_video_thumbnail->entity->getFileUri());
          $asset['thumb_url'] = $thumb->buildUrl($media->field_video_thumbnail->entity->getFileUri());
          $asset['modal_url'] = $modal->buildUrl($media->field_video_thumbnail->entity->getFileUri());
        }
        $asset['duration_hms']  = $media->field_duration->value;
        $asset['start_time']    = 0;
        $asset['duration']      = $this->getSeconds($media->field_duration->value);
        $asset['duration_clip'] = $this->getSeconds($media->field_duration->value);
      }
      
      if($vid > 0){
        // clip tab
        $mquery = \Drupal::database()->select('vmt_media', 'm');
        $mquery->fields('m');
        $mquery->condition('m.video_id', $vid, '=');
        $mquery->condition('m.mid', $mid, '=');
        $mquery->condition('m.rid', $rid, '=');
        $media_clip = $mquery->execute()->fetchObject();
        if(!empty($media_clip)){
          if($media_clip->duration > 0) {
            $asset['start_time']    = $media_clip->start_time;
            $asset['duration_clip'] = $media_clip->duration;
          }
          if($media_clip->zoom > 0) {
            $asset['zoom'] = $media_clip->zoom; 
          }
          
          $asset['volume'] = $media_clip->volume; 
          $asset['clip_zoom'] = $media_clip->clip_zoom; 
          $crop_params_json = $media_clip->crop_params;
          $asset['crop_params'] = is_null(json_decode($crop_params_json)) ? FALSE : json_decode($crop_params_json, TRUE);
          $asset['rid'] = $media_clip->rid;
        }
          
        // transition tab
        $tquery = \Drupal::database()->select('vmt_transition', 't');
        $tquery->fields('t');
        $tquery->condition('t.video_id', $vid, '=');
        $tquery->condition('t.mid', $mid, '=');
        $tquery->condition('t.rid', $rid, '=');
        $transition = $tquery->execute()->fetchObject();
        if(!empty($transition)){
          $flc_Transition = $this->getFLTransitions($vid);
          $asset['transition_duration'] = $transition->transition_duration; 
          $asset['transition_option'] = $transition->transition_option;
          $asset['is_first_clip_transition']  = $flc_Transition['is_first_clip_transition'];
          $asset['is_last_clip_transition']   = $flc_Transition['is_last_clip_transition'];           
          $asset['is_opt_out_transition']     = $transition->is_opt_out_transition;           
        }
      }
    }
    $response['media'] = $asset;
    
    return new JsonResponse($response);
    exit;
  }
  
  
  /**
   * Returns media preset properties
   *
   * @return array
   *   A simple renderable array.
   */
  public function populateTransition(){
    $vid  = \Drupal::request()->get('vid');
    $mid  = \Drupal::request()->get('mid');
    $rid  = \Drupal::request()->get('rid');
    // default transition - Cross-fade  
    //$default_transition_id = $this->getDefaultTransitionId();
    
    $response = ['transition_duration' => 1.00, 'transition_option' => 0, 'is_first_clip_transition' => 1, 'is_last_clip_transition' => 1, 'is_opt_out_transition' => 0];
    if($vid > 0){
      $tquery = \Drupal::database()->select('vmt_transition', 't');
      $tquery->fields('t');
      $tquery->condition('t.video_id', $vid, '=');
      $tquery->condition('t.mid', $mid, '=');
      $tquery->condition('t.rid', $rid, '=');
      $transition = $tquery->execute()->fetchObject();
      if(!empty($transition)){
        $flc_Transition = $this->getFLTransitions($vid);
        $response['transition_duration']  = $transition->transition_duration; 
        $response['transition_option']    = $transition->transition_option;
        $response['is_first_clip_transition']  = $flc_Transition['is_first_clip_transition'];
        $response['is_last_clip_transition']   = $flc_Transition['is_last_clip_transition'];
        $response['is_opt_out_transition']     = $transition->is_opt_out_transition;        
      }
    }
    
    return new JsonResponse($response);
  }
  
  /**
   * Returns first and last clip transitions
   *
   * @return array
   *   A simple renderable array.
   */
  public function getFLTransitions($vid = 0){
    $vtquery = \Drupal::database()->select('vmt_transition', 'vt');
    $vtquery->fields('vt', ['is_first_clip_transition', 'is_last_clip_transition']);
    $vtquery->condition('video_id', $vid);
    $vtquery->condition($vtquery->orConditionGroup()->condition('is_first_clip', 1)->condition('is_last_clip', 1));
    $transitions = $vtquery->execute()->fetchAll();
    
    $response = ['is_first_clip_transition' => 0, 'is_last_clip_transition' => 0];
    foreach($transitions as $transition){
      if($transition->is_first_clip_transition == 1){
        $response['is_first_clip_transition'] = 1;
      }
      if($transition->is_last_clip_transition == 1){
        $response['is_last_clip_transition'] = 1;
      }
    }
    
    return $response;
  }
  
  /**
   * Returns video transitions
   *
   * @return array
   *   A simple renderable array.
   */
  public function getVideoTransitions($tid = 0){
    $vocabulary_name = 'video_transitions';
    $query = \Drupal::entityQuery('taxonomy_term');
    $query->condition('vid', $vocabulary_name);
    $query->sort('weight');
    $tids = $query->execute();
    $terms = Term::loadMultiple($tids);
    // image style for transition preview
    $style = \Drupal::entityTypeManager()->getStorage('image_style')->load('video_transition_thumb'); 
    foreach($terms as $term) {
      $transition_preview = '';
      if(!empty($term->field_transition_image->entity)){
        $transition_preview = $style->buildUrl($term->field_transition_image->entity->getFileUri());
      }
      
      $checked = ($tid == $term->id()) ? 1 : 0;
      $term_data[] = array(
        "id" => $term->id(),
        "name" => $term->getName(),
        "transition_preview" => $transition_preview,
        "checked" => $checked,
      );  
    }

    return $term_data;
  }
  
  /**
   * Returns video transitions
   *
   * @return array
   *   A simple renderable array.
   */
  public function getDefaultTransitionId($name = 'Cross-fade'){
    $query = \Drupal::database()->select('taxonomy_term_field_data', 't');
    $query->fields('t', ['tid']);
    $query->condition('t.vid', 'video_transitions', '=');
    $query->condition('t.name', $name, '=');
    $transition = $query->execute()->fetchObject();
    if(empty($transition)) {
      return 0;
    }else{
      return $transition->tid;
    }
  }
  
  /**
   * Returns media preset properties
   *
   * @return array
   *   A simple renderable array.
   */
  public function getSeconds($time){
    $parsed = date_parse($time);
    $seconds = $parsed['hour'] * 3600 + $parsed['minute'] * 60 + $parsed['second'];
    
    return $seconds; 
  }
  
  /**
   * Returns media kit selector
   *
   * @return array
   *   A simple renderable array.
   */
  public function getMKS($uid){
    $options['uid'] = $uid;
    $options['element_id'] = 'video-maker-tool';
    $options['mk_select'] = 1;
    $options['search'] = 1;
    $options['tabs']['photo'] = ['cols' => ['multi_asset_chk' => 0, 'photo' => 1, 'title' => 1, 'tags' => 1, 'dimension' => 1], 'active' => 0, 'gallery' => 0, 'tick' => 0];
    $options['tabs']['audio'] = ['cols' => ['multi_asset_chk' => 0, 'audio' => 1, 'title' => 1, 'tags'=> 1, 'duration' => 1], 'active' => 0];
    $options['tabs']['video'] = ['cols' => ['multi_asset_chk' => 0, 'video' => 1, 'title' => 1, 'tags' => 1, 'duration' => 1], 'active' => 1, 'play' => 0];
    $options['tabs']['text'] = [];
    
    $mks = \Drupal::service('media.kit.selector')->getMediaKit($options);
    return $mks;
  }
  
  /**
   * Transition and clip properties save
   */
  public function PropertieSave(){
    
    $typeTabSave  = \Drupal::request()->get('type_tab_save');
    
    $vid  = \Drupal::request()->get('vid');
    $mid  = \Drupal::request()->get('mid');
    $rid  = \Drupal::request()->get('rid');
    
    $duration  = \Drupal::request()->get('duration');
    
    $response['status'] = false;
    
    if($vid > 0){      
      if($typeTabSave == 'transition'){
        $transition  = \Drupal::request()->get('transition');        
        \Drupal::database()->update('vmt_transition')
        ->condition('video_id', $vid, '=')
        ->condition('mid', $mid, '=')
        ->condition('rid', $rid, '=')
        ->fields(['transition_duration' => $duration,'transition_option'=>$transition])
        ->execute();        
        $response['status'] = true;        
      }else if($typeTabSave == 'photo_clip'){
        $crop_params  = \Drupal::request()->get('zoom');        
        $clip_zoom  = \Drupal::request()->get('clip_zoom');
        \Drupal::database()->update('vmt_media')
        ->condition('video_id', $vid, '=')
        ->condition('mid', $mid, '=')
        ->condition('rid', $rid, '=')
        ->fields(['duration' => $duration,'crop_params'=>$crop_params,'clip_zoom'=>$clip_zoom])
        ->execute();        
        $response['status'] = true;        
      }else if($typeTabSave == 'video_clip'){
        $starttime  = \Drupal::request()->get('starttime');
        $zoom  = \Drupal::request()->get('zoom');
        $crop_params  = \Drupal::request()->get('zoomraw');
        $volume  = \Drupal::request()->get('volume');
        $zoomval = $zoom > 0?1:0;
        \Drupal::database()->update('vmt_media')
        ->condition('video_id', $vid, '=')
        ->condition('mid', $mid, '=')
        ->condition('rid', $rid, '=')
        ->fields(['duration' => $duration,'volume'=>$volume,'start_time'=>$starttime,'crop_params'=>$crop_params,'zoom'=>$zoomval])
        ->execute();        
        $response['status'] = true;        
      }      
    }    
    
    return new JsonResponse($response);
  }
}
