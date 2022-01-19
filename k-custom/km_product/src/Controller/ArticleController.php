<?php
namespace Drupal\km_product\Controller;
use Drupal\Core\Controller\ControllerBase;
use Drupal\km_product\Controller\TemplatesController;
use Drupal\Core\Session\AccountInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;
use Drupal\image\Entity\ImageStyle;
use Drupal\node\NodeInterface;
use Drupal\taxonomy\Entity\Term;      
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\s3fs\S3fsService;
use Drupal\Core\Render\Markup;
use Drupal\paragraphs\Entity\Paragraph;
use Drupal\media_vault_tool\Controller\MediaDetailController;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Routing\Access\AccessInterface;

class ArticleController extends ControllerBase {
  /**
   * Returns product template settings page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function addArticle() {
    global $base_secure_url;
    $team_name = '';
    if(isset($_GET['team'])){
      $uid = $_GET['uid'];
      $gid = $_GET['team'];
      $team_name = "Team: ";
      $team_name .= \Drupal::service('my_groups.team.service')->getTeamName($gid, $uid);
    }
    else {
      $uid = \Drupal::currentUser()->id();
    }
    
    $article_node = \Drupal\node\Entity\Node::create(['type' => 'html_article']);
    $article_form = \Drupal::service('entity.form_builder')->getForm($article_node);
    $render_data['theme_data'] = [
      '#theme'                  => 'article-form',
      '#article_form'           => $article_form,
      '#data'                   => ['uid' => $uid, 'team_name' => $team_name],
      '#attached'               => [
        'library' =>  [
          'km_product/web.product',
          'km_product/html.article',
        ],
        'drupalSettings' => [
          'media_base_url' => $base_secure_url, 
          'uid' => $uid,
        ],
      ],
    ];
    
    return $render_data;  
	}
  
  /**
   * Returns product template settings page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function editArticle($article) {
    global $base_secure_url;
    $team_name = '';
    if(isset($_GET['team'])){
      $uid = $_GET['uid'];
      $gid = $_GET['team'];
      $team_name = "Team: ";
      $team_name .= \Drupal::service('my_groups.team.service')->getTeamName($gid, $uid);
    }
    else {
      $uid = \Drupal::currentUser()->id();
    }
    
    //$article_node = \Drupal\node\Entity\Node::create(['type' => 'html_article']);
    $article_form = \Drupal::service('entity.form_builder')->getForm($article);
    //Get added paragraph items
    $paragraph_items = array();
    $paragraph = $article->field_html_article_images_ref->getValue();
    // Loop through the result set.
    //$paras = $article->field_html_article_images_ref->referencedEntities();
    if($paragraph){
      foreach ( $paragraph as $key=>$element ) {
        $p = Paragraph::load( $element['target_id'] );
        $imageMedia = $p->field_html_article_image_ref->getValue();
        $mediaId = $imageMedia[0]['target_id'];
        $media = Media::load($mediaId);
        if (is_object($media)) {
          if ($media->hasField('field_media_image')) {
            $uri = $media->field_media_image->entity->getFileUri();
            $thumbnails_style = \Drupal::entityTypeManager()->getStorage('image_style')->load('35x35_thumbnail');
            $mediaImage = $thumbnails_style->buildUrl($uri);
            $paragraph_items[$key]['imageMedia'] = $mediaImage;
            $paragraph_items[$key]['mediaId'] = $mediaId;
            $imageCaption = $p->field_image_caption->getValue();
            $paragraph_items[$key]['imageCaption'] = isset($imageCaption[0]['value']) ? $imageCaption[0]['value'] : '';
            $paragraph_items[$key]['imageMediaName'] = isset($imageCaption[0]['value']) ? $imageCaption[0]['value'] : $media->getName();
          }
        }
      }
    }
    $render_data['theme_data'] = [
      '#theme'                  => 'article-form',
      '#article_form'           => $article_form,
      '#paragraph_items'        => $paragraph_items,
      '#data'                   => ['uid' => $uid, 'team_name' => $team_name],
      '#attached'               => [
        'library' =>  [
          'km_product/web.product',
          'km_product/html.article',
        ],
        'drupalSettings' => [
          'media_base_url' => $base_secure_url, 
          'uid' => $uid,
        ],
      ],
    ];
    
    return $render_data;  
	}
  
  /**
   * Returns product template settings page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function listArticle(AccountInterface $user) {
    global $base_secure_url;
    $current_user_id = \Drupal::currentUser()->id();
    $uid = $user->id();
    // products 
    $query = \Drupal::database()->select('node_field_data', 'article');
    $query->fields('article', ['nid', 'title']);
    $query->condition('article.type', 'html_article', '=');
    $query->condition('article.uid', $uid, '=');
    $query->orderBy('article.changed', 'DESC');
    $pager = $query->extend('Drupal\Core\Database\Query\PagerSelectExtender')->limit(10);
    $articles = $pager->execute();
    //echo '<pre>'; print_r($articles); echo '</pre>';
    
    // edit icon
    $edit_img_tag = '<img src="'. base_path() . drupal_get_path('module', 'km_product') . '/images/edit-icon.png" width="20"/>';
    $rendered_edit_icon = render($edit_img_tag);
    $edit_icon = Markup::create($rendered_edit_icon);
    
    // favorite icon
    // $favorite_img_tag = '<img src="'. base_path() . drupal_get_path('module', 'km_product') . '/images/heart-inactive-icon.svg" width="20"/>';
    // $rendered_favorite_icon = render($favorite_img_tag);
    // $favorite_icon = Markup::create($rendered_favorite_icon);
    
    // delete icon
    $delete_img_tag = '<img src="'. base_path() . drupal_get_path('module', 'km_product') . '/images/trash.png" width="20"/>';
    $rendered_delete_icon = render($delete_img_tag);
    $delete_icon = Markup::create($rendered_delete_icon);
    
    $header = [
      'headline' => ['data' => t('Headline'), 'class' => 'sortempty', 'width' => '20%'],
      'keywords' => ['data' => t('Keywords'), 'class' => 'sortempty', 'width' => '30%'],
      'images' => ['data' => t('Images'), 'class' => 'sortempty'],
      'actions' => ['data' => t('ACTIONS'), 'class' => 'text-center', 'width' => '10%'],
    ];
     
    $rows = [];
    foreach($articles as $article){
      $article_data = Node::load($article->nid);

      // favorite icon
      $article_favorite = $article_data->field_article_favorite->getValue();
      if($article_favorite['0']['value'] == 1){
        $favorite_img_tag = '<img src="'. base_path() . drupal_get_path('module', 'km_product') . '/images/heart-active-icon.svg" width="20"/>';
      }
      else {
        $favorite_img_tag = '<img src="'. base_path() . drupal_get_path('module', 'km_product') . '/images/heart-inactive-icon.svg" width="20"/>';
      }
      $rendered_favorite_icon = render($favorite_img_tag);
      $favorite_icon = Markup::create($rendered_favorite_icon);

      $edit = Link::fromTextAndUrl($edit_icon, Url::fromRoute('product.article.edit', ['article' => $article->nid]))->toString();
      $favorite = Link::fromTextAndUrl($favorite_icon, Url::fromRoute('product.article.favorite', ['article' => $article->nid]))->toString();
      //$delete = Link::fromTextAndUrl($delete_icon, Url::fromRoute('product.article.delete', ['article' => $article->nid], ['attributes' => ['msg' => 'Are you sure you want to delete the article?', 'class' => ['dialog']]]))->toString();
      $delete = Link::fromTextAndUrl($delete_icon, Url::fromUri('internal:#javascript:void(0)', ['attributes' => ['article' => $article->nid, 'class' => ['delete-article']]]))->toString();
      $actions = t('@edit &nbsp;&nbsp; @favorite &nbsp;&nbsp; @delete', array('@edit' => $edit, '@favorite' => $favorite, '@delete' => $delete));
      $tags = [];
      foreach ($article_data->get('field_keywords')->getValue() as $term_id){
        if($term_id['target_id']){
          $tags[$term_id['target_id']] = \Drupal\taxonomy\Entity\Term::load($term_id['target_id'])->label();
        }
      }
      $tags_name = (count($tags) > 0) ? implode(', ', $tags) : 'None';
      $paragraph = $article_data->field_html_article_images_ref->getValue();
      $kaboodles = [];
      if($paragraph){
        foreach ( $paragraph as $key=>$element ) {
          $p = Paragraph::load( $element['target_id'] );
          $imageMedia = $p->field_html_article_image_ref->getValue();
          $mediaId = $imageMedia[0]['target_id'];
          $media = \Drupal::entityTypeManager()->getStorage('media')->load($mediaId);
          if(is_object($media)){
            $kaboodles[$mediaId] = ucwords($media->getName());
          }
          /*$md = new MediaDetailController();
          //List media on "Currently Used in These Media Kits:"
          $mediaList = $md->getallMediaByfile($media, 'image');
          if(!empty($mediaList)) {
            foreach($mediaList as $list) {
              $kaboodles[$list->nid] = '<li><a href="/tools/media/kit/'.$list->uid.'/'.$list->nid.'">'.$list->title.'</a></li>';
            }
          }*/
        }
      }
      else {
        $kaboodles[] = 'None';
      }
      //$media_kits = '<ul class="m-0">'.implode('', $kaboodles).'</ul>';
      //$images = (count($kaboodles) == 1) ? $kaboodles[0] : implode(',<br/>', $kaboodles);
      $images = implode('<br/>', $kaboodles);
      $favorite_class = ($article_favorite['0']['value'] == 1) ? ' fave-article' : '';
      $rows[] = [
        'data' => [
					'headline'    => ['data' => $article->title],
					'keywords'    => ['data' => $tags_name],
					'images'      => ['data' => array('#markup' => $images)],
					'actions'     => ['data' => $actions, 'class' => 'text-center'],
        ],
        'class' => 'user-html-article'.$favorite_class,
        'data-articletitle' => $article->title,
        'data-articletags' => $tags_name,
      ];
    }
    
    $build = array();
    // Generate the table.
    $build['config_table'] = array(
      '#theme' => 'table',
      '#header' => $header,
      '#rows' => $rows,
      '#attributes' => array('id' => 'km-html-articles-list', 'border' => 0),
      '#empty' => 'You currently have no HTML Articles.',
    );
    // Finally add the pager
    $build['pager'] = array(
      '#type' => 'pager',
      '#element' => 0,
    );
    
    $team_name = '';
    $team_query = '';
    $member_article = '';
    if(isset($_GET['team'])){
      $gid = $_GET['team'];
      $muid = $_GET['uid'];
      $team_query = ["gid" => $gid, "muid" => $muid];
      $team_name = "Team: ";
      $team_name .= \Drupal::service('my_groups.team.service')->getTeamName($gid, $muid);
      $_SESSION['team']['gid'] = $gid;
      $_SESSION['team']['uid'] = $muid;
      $member_article = $this->listMemberArticle($muid);
    }
    else {
      unset($_SESSION['team']);
    }
    // testing table template as rendered array
    $header_new = [
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
    $query->condition('gmr.group_roles_target_id', 'team-html_articles', '=');
    $query->orderBy('team.label', 'ASC');
    $sort = $query->extend('Drupal\Core\Database\Query\TableSortExtender')->orderByHeader($header);
    // Limit the rows to 20 for each page.
    $pager = $sort->extend('Drupal\Core\Database\Query\PagerSelectExtender')->limit(25);
    $teams = $pager->execute();
    
    $rows_new = [];
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
      
      $url = Url::fromRoute('product.article.list', ['user' => $uid]);
      $args = ['team' => $team->id, 'uid' => $team->uid];
      $url->setOptions(array('query' => $args, 'fragment' => 'nav-shared'));
      //$url->setOptions(array('attributes' => array('class' => array('member-team'), 'team' => $team->id, 'uid' => $team->uid)));
      $edit = Link::fromTextAndUrl($edit_icon, $url)->toString();
      //$edit = Link::fromTextAndUrl($edit_icon, Url::fromRoute('product.article.list', ['user' => $team->uid]))->toString();
      $actions = t('@edit', array('@edit' => $edit));
    
      $rows_new[] = [
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
      '#header' => $header_new,
      '#rows' => $rows_new,
      '#attributes' => array('id'=>array('groups-teams'), 'class' => array('teams'), 'border' => 0),
      '#attached' => ['library' => ['my_groups/team']],
      '#empty' => 'You currently have no teams.',
    );
    
    $render_data['theme_data'] = [
      '#theme'                  => 'article',
      '#data'                   => ['articles' => $articles, 'build' => $build, 'build_teams' => $build_teams, 'team_name' => $team_name, 'team_query' => $team_query, 'member_article' => $member_article],
      '#attached'               => [
        'library' =>  [
          'km_product/web.product',
        ],
        'drupalSettings' => [
          'media_base_url' => $base_secure_url, 
          'uid' => $uid,
        ],
      ],
    ];
    
    return $render_data;  
	}
  /**
   * Returns product template settings page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function listMemberArticle($uid) {
    $gid = $_GET['team'];
    $muid = $_GET['uid'];
    global $base_secure_url;
    // products 
    $mquery = \Drupal::database()->select('node_field_data', 'article');
    $mquery->fields('article', ['nid', 'title']);
    $mquery->condition('article.type', 'html_article', '=');
    $mquery->condition('article.uid', $uid, '=');
    $mquery->orderBy('article.changed', 'DESC');
    $mpager = $mquery->extend('Drupal\Core\Database\Query\PagerSelectExtender')->limit(10);
    $articles = $mpager->execute();
    // edit icon
    $edit_img_tag = '<img src="'. base_path() . drupal_get_path('module', 'km_product') . '/images/edit-icon.png" width="20"/>';
    $rendered_edit_icon = render($edit_img_tag);
    $edit_icon = Markup::create($rendered_edit_icon);
    // delete icon
    $delete_img_tag = '<img src="'. base_path() . drupal_get_path('module', 'km_product') . '/images/trash.png" width="20"/>';
    $rendered_delete_icon = render($delete_img_tag);
    $delete_icon = Markup::create($rendered_delete_icon);
    $header = [
      'headline' => ['data' => t('Headline'), 'class' => 'sortempty', 'width' => '20%'],
      'keywords' => ['data' => t('Keywords'), 'class' => 'sortempty', 'width' => '30%'],
      'images' => ['data' => t('Images'), 'class' => 'sortempty'],
      'actions' => ['data' => t('ACTIONS'), 'class' => 'text-center', 'width' => '10%'],
    ];
    $rows = [];
    foreach($articles as $article){
      $article_data = Node::load($article->nid);
      // favorite icon
      $article_favorite = $article_data->field_article_favorite->getValue();
      if($article_favorite['0']['value'] == 1){
        $favorite_img_tag = '<img src="'. base_path() . drupal_get_path('module', 'km_product') . '/images/heart-active-icon.svg" width="20"/>';
      }
      else {
        $favorite_img_tag = '<img src="'. base_path() . drupal_get_path('module', 'km_product') . '/images/heart-inactive-icon.svg" width="20"/>';
      }
      $rendered_favorite_icon = render($favorite_img_tag);
      $favorite_icon = Markup::create($rendered_favorite_icon);
      $url = Url::fromRoute('product.article.edit', ['article' => $article->nid]);
      $args = ['team' => $gid, 'uid' => $muid];
      $url->setOptions(array('query' => $args));
      $edit = Link::fromTextAndUrl($edit_icon, $url)->toString();
      //$edit = Link::fromTextAndUrl($edit_icon, Url::fromRoute('product.article.edit', ['article' => $article->nid]))->toString();
      $favorite = Link::fromTextAndUrl($favorite_icon, Url::fromRoute('product.article.favorite', ['article' => $article->nid]))->toString();
      $delete = Link::fromTextAndUrl($delete_icon, Url::fromUri('internal:#javascript:void(0)', ['attributes' => ['article' => $article->nid, 'class' => ['delete-article']]]))->toString();
      $actions = t('@edit &nbsp;&nbsp; @favorite &nbsp;&nbsp; @delete', array('@edit' => $edit, '@favorite' => $favorite, '@delete' => $delete));
      $tags = [];
      foreach ($article_data->get('field_keywords')->getValue() as $term_id){
        if($term_id['target_id']){
          $tags[$term_id['target_id']] = \Drupal\taxonomy\Entity\Term::load($term_id['target_id'])->label();
        }
      }
      $tags_name = (count($tags) > 0) ? implode(', ', $tags) : 'None';
      $paragraph = $article_data->field_html_article_images_ref->getValue();
      $kaboodles = [];
      if($paragraph){
        foreach ( $paragraph as $key=>$element ) {
          $p = Paragraph::load( $element['target_id'] );
          $imageMedia = $p->field_html_article_image_ref->getValue();
          $mediaId = $imageMedia[0]['target_id'];
          $media = \Drupal::entityTypeManager()->getStorage('media')->load($mediaId);
          if(is_object($media)){
            $kaboodles[$mediaId] = ucwords($media->getName());
          }
        }
      }
      else {
        $kaboodles[] = 'None';
      }
      $images = implode('<br/>', $kaboodles);
      $favorite_class = ($article_favorite['0']['value'] == 1) ? ' fave-article' : '';
      $rows[] = [
        'data' => [
					'headline'    => ['data' => $article->title],
					'keywords'    => ['data' => $tags_name],
					'images'      => ['data' => array('#markup' => $images)],
					'actions'     => ['data' => $actions, 'class' => 'text-center'],
        ],
        'class' => 'user-html-article'.$favorite_class,
        'data-articletitle' => $article->title,
        'data-articletags' => $tags_name,
      ];
    }
    $build = array();
    // Generate the table.
    $build['config_table'] = array(
      '#theme' => 'table',
      '#header' => $header,
      '#rows' => $rows,
      '#attributes' => array('id' => 'km-html-member-articles-list', 'border' => 0),
      '#empty' => 'You currently have no HTML Articles.',
    );
    // Finally add the pager
    $build['pager'] = array(
      '#type' => 'pager',
      '#element' => 1,
    );
    return $build;
  }
  
  /**
   * Returns product template settings page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function deleteArticle($article) {
    $uid = \Drupal::currentUser()->id();
    $article->delete();
    // set message and redirect
    \Drupal::messenger()->addStatus(t('The article has been deleted successfully.'));
    return new RedirectResponse(\Drupal::url('product.article.list', ['user' => $uid], ['absolute' => TRUE]));
	}
  
  
  /**
   * Returns product template settings page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function favoriteArticle($article) {
    $uid = \Drupal::currentUser()->id();
    $article_favorite = $article->field_article_favorite->getValue();
    if($article_favorite['0']['value'] == 1){
      $article->set('field_article_favorite', 0);
    }
    else {
      $article->set('field_article_favorite', 1);
    }
    $article->save();
    // set message and redirect
    \Drupal::messenger()->addStatus(t('The article has been updated successfully.'));
    return new RedirectResponse(\Drupal::url('product.article.list', ['user' => $uid], ['absolute' => TRUE]));
	}
  
  
  /**
	 * Get referenced media kits of kaboodle node by current user
	 */
  public function get_media_kits($uid){
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
	/**
	 * A custom access check 
	 *
	 * @param \Drupal\Core\Session\AccountInterface $user
   * Run access checks for this account.
	 * @return \Drupal\Core\Access\AccessResultInterface
   * The access result.
   * /tools/html-article/[uid]
	 */
	public function htmlArticleAccess(AccountInterface $user) { 
		$account = \Drupal::currentUser();
    $roles = $account->getRoles();
    $member = false;
		if(in_array('administrator', $roles)){
			return AccessResult::allowed();
		}
    else if(isset($_GET['team'])){
      $gid = $_GET['team'];
      $muid = $_GET['uid'];
      $member = \Drupal::service('my_groups.team.service')->getMembersAccess($gid, $account->id(), $muid, 'team-html_articles');
      if($member){
        return AccessResult::allowed();
      }
			return AccessResult::forbidden();
    }
    else if(in_array('content_creator', $roles) && !in_array('advanced_content_creator', $roles)){
			return AccessResult::forbidden();
    }
    else if(!empty($account->id()) && $user->id() == $account->id()){
			return AccessResult::allowed();
    }
		else {
			return AccessResult::forbidden();
		}
  }
	/**
	 * A custom access check 
	 */
	public function htmlArticleNodeAccess(NodeInterface $article) {
		$account = \Drupal::currentUser();
    $roles = $account->getRoles();
    $ownerId = $article->getOwnerId();
		if(in_array('administrator', $roles)){
			return AccessResult::allowed();
		}
    else if(in_array('content_creator', $roles) && !in_array('advanced_content_creator', $roles)){
			return AccessResult::forbidden();
    }
    else if(!empty($account->id()) && $ownerId == $account->id()){
			return AccessResult::allowed();
    }
    else if(isset($_SESSION['team'])){
      $gid = $_SESSION['team']['gid'];
      $uid = $_SESSION['team']['uid'];
      $member = \Drupal::service('my_groups.team.service')->getMembersAccess($gid, $account->id(), $uid, 'team-html_articles');
      if($member){
        return AccessResult::allowed();
      }
			return AccessResult::forbidden();
    }
		else {
			return AccessResult::forbidden();
		}
  }
}

