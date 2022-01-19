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
use Drupal\user\UserInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Component\Render\FormattableMarkup;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\Core\Render\Markup;
/**
 * Defines KaboodlesController class.
 */
class KaboodlesProductsController extends ControllerBase
{
  
   
		/**
    * Display the all product of User $user.
    *
    * @return array
    */
    public function all_product(User $user) {
      $element = 9004;
      $kaboodle_title = 'Notifications';
			//$notifications = $this->user_notifications($user->id());
      $user_templates = \Drupal::service('km_product.templates')->getUserProducts($user->id());
      //$notifications = array();
			$header = [
				'select' => ['data' => ''],
				'date' => ['data' => t('Date'), 'class' => 'sortempty', 'onclick' => 'sortColumn(this, "date")'],
				'title' => ['data' => t('Title'), 'class' => 'sortempty', 'onclick' => 'sortColumn(this, "text")'],
				'type' => ['data' => t('Type'), 'class' => 'sortempty', 'onclick' => 'sortColumn(this, "text")'],
				'kaboodle' => ['data' => t('Kaboodle'), 'class' => 'sortempty', 'onclick' => 'sortColumn(this, "text")'],
				'actions' => ['data' => t('Actions'), 'class' => 'text-center text-uppercase', 'colspan' => 2],
			];
      $time_zone = date_default_timezone_get();
      $i = 0;
      $j = 0;
			if(empty($user_templates)){
				//$output['data'][] = [['data' => t('You currently have no products.'), 'class' => 'text-center empty-col', 'colspan' => 6]]; 
			}
      else {        
				foreach($user_templates->data as $key=>$value){
          if(($value->kaboodles_id != '') and ($value->kaboodles_id != 0) and ($value->static_image_url != '')){
           // $i++;
					//Select checkbox					
					//$select_n = new FormattableMarkup('<label class="checkbox-container"><input type="checkbox" class="box-check" name="notification-opt-@notification_id" id="n-@notification_id" value="@notification_id"/><span class="checkmark"></span></label>',['@notification_id' => $n->notification_id]);
					//email
					//$send_email = ($n->email == 1) ? 'Yes' : 'No';
					//view
          $select_n = '';
          if($value->modified != ''){
            $date = new DrupalDateTime($value->modified, 'GMT');
            $date->setTimezone(new \DateTimeZone($time_zone));
            $date_ful = $date->format('m-d-Y g:i a'); 
           
          }
          $node_storage = \Drupal::entityTypeManager()->getStorage('node');
          $kaboodles_node = $node_storage->load($value->kaboodles_id);
          $kaboodles_title =  $kaboodles_node->get('title')->value;          
					$viewurl = \Drupal\Core\Url::fromUserInput('#');
					$view_link_options = [
					'attributes' => [
              'class' => [
								'view-notification'
							],
							'data-toggle' => 'modal',
							'data-target' => '#notification-modal',								
							'aria-label' => 'hello',									
							'onclick' => 'viewNotificationMessage(this)',					
						],
					];
					$viewurl->setOptions($view_link_options);
					$view = \Drupal::l('', $viewurl);
					$deleteurl = \Drupal\Core\Url::fromUserInput('#');
          $edit_img_tag = '<img src="'. base_path() . drupal_get_path('module', 'my_groups') . '/images/edit-icon.png" width="20"/>';
          $rendered_edit_icon = render($edit_img_tag);
          $edit_icon = Markup::create($rendered_edit_icon);
          $link = Link::fromTextAndUrl($edit_icon, Url::fromRoute('product.edittemplate', ['node' => $value->kaboodles_id,'producttype'=>$value->type_tid, 'template_id'=>$value->_id,'kmproduct'=>'yes']));
          if($value->type_tid != ''){
            $folder_name = \Drupal\taxonomy\Entity\Term::load($value->type_tid)->get('name')->value;;
          }else{
            $folder_name = '';
          } 
          
				$product_all[]	 = [['data' => $select_n, 'class' => 'text-center', 'width' => '3%'], 'date'=>$date_ful, 'title'=>$value->name, 'type'=>$folder_name, 'kaboodle'=>['data' =>$kaboodles_title, 'class' => 'text-left'],['data' =>$link, 'class' => 'text-center', 'width' => '4%'] ]; //$output['data'][]
          }
				}
			}
    $utquery = \Drupal::database()->select('web_product_templates', 'wpt');
    $utquery->leftJoin('web_templates_favorite', 'wtf', 'wtf.template_id = wpt.id AND wtf.node_id = wpt.node_id AND wtf.user_id = wpt.user_id');
    $utquery->fields('wpt', ['id', 'product_id', 'name', 'description', 'template_group', 'preview_image', 'tags', 'created', 'modified','node_id']);
    $utquery->addExpression("IF(wtf.is_favorite IS NULL, 0, wtf.is_favorite)", 'favorite');    
    $utquery->condition('wpt.user_id', $user->id(), '=');
    $utquery->condition('wpt.template_type', 2, '=');
    $user_webtemplate  = $utquery->execute()->fetchAll();
    if(!empty($user_webtemplate)){
      foreach($user_webtemplate as $web_key=>$web_value){
        if($web_value->product_id != ''){
          $folder_name = \Drupal\taxonomy\Entity\Term::load($web_value->product_id)->get('name')->value;;
        }else{
          $folder_name = '';
        } 
        $select_n = '';
      if($web_value->modified != ''){
        $dates = date('m/d/Y H:i:s', $web_value->modified);
        $date = new DrupalDateTime($dates, 'GMT');
        $date->setTimezone(new \DateTimeZone($time_zone));
        $date_ful = $date->format('m-d-Y g:i a'); 
        }
        //$kmproduct_link = Link::fromTextAndUrl($web_value->name, Url::fromRoute('product.edittemplate', ['node' => $web_value->node_id,'producttype'=>$web_value->product_id, 'template_id'=>$web_value->id,'kmproduct'=>'yes']));  ;  
       // $product_all[] = [$kmproduct_link, $folder_name,$date_ful]; 
       //
        $node_storage = \Drupal::entityTypeManager()->getStorage('node');
        $kaboodles_node = $node_storage->load($web_value->node_id);
        $kaboodles_title =  $kaboodles_node->get('title')->value;  
       $viewurl = \Drupal\Core\Url::fromUserInput('#');
					$view_link_options = [
					'attributes' => [
              'class' => [
								'view-notification'
							],
							'data-toggle' => 'modal',
							'data-target' => '#notification-modal',								
							'aria-label' => 'hello',									
							'onclick' => 'viewNotificationMessage(this)',					
						],
					];
					$viewurl->setOptions($view_link_options);
					$view = \Drupal::l('', $viewurl);
					$deleteurl = \Drupal\Core\Url::fromUserInput('#');
          $edit_img_tag = '<img src="'. base_path() . drupal_get_path('module', 'my_groups') . '/images/edit-icon.png" width="20"/>';
          $rendered_edit_icon = render($edit_img_tag);
          $edit_icon = Markup::create($rendered_edit_icon);
          $link = Link::fromTextAndUrl($edit_icon, Url::fromRoute('product.edittemplate', ['node' => $web_value->node_id,'producttype'=>$web_value->product_id, 'template_id'=>$web_value->id,'kmproduct'=>'yes']));
       //
      $product_all[]	 = [['data' => $select_n, 'class' => 'text-center', 'width' => '3%'], 'date'=>$date_ful, 'title'=>$web_value->name, 'type'=>$folder_name, 'kaboodle'=>['data' =>$kaboodles_title, 'class' => 'text-left'],['data' =>$link, 'class' => 'text-center', 'width' => '4%'] ];
      }
    }
    usort($product_all, function($a, $b) {
    return $b['date'] <=> $a['date'];
     });
    foreach($product_all  as $p_all_key => $p_all_value){
      $i++;
      $j++;
      $output['data'][] = [$p_all_value[0],$p_all_value['date'], $p_all_value['title'],$p_all_value['type'],$p_all_value['kaboodle'],$p_all_value[1]];
    }
     if($j == 0){
       	$output['data'][] = [['data' => t('You currently have no products.'), 'class' => 'text-center empty-col', 'colspan' => 6]];
     }
      $per_page = 40;
      $current_page = pager_default_initialize($i, $per_page);
      $chunks = array_chunk($output['data'], $per_page, TRUE);
			$table = [
				'#type' => 'table',
				'#header' => $header,
				'#rows' => $chunks[$current_page],
			];
       $elements['table'] = array(
        '#theme' => 'table',
        '#header' => $header,
         '#rows' => $chunks[$current_page],
       );

       $elements['pager'] = array(
        '#theme' => 'pager',
        '#element' => $i,
       );
       
       // The table description.
    $build = array();
    // Generate the table.
    $build['config_table'] = array(
      '#theme' => 'table',
      '#header' => $header,
      '#rows' => $chunks[$current_page],
      '#attributes' => array('id'=>array('groups-teams'), 'class' => array('teams'), 'border' => 0),
      '#attached' => ['library' => ['my_groups/team']],
    );
    
    // Finally add the pager
    $build['pager'] = array(
      '#type' => 'pager'
    );
     /* return [
        '#theme' => 'all_products',
        '#kaboodle_title'   => $kaboodle_title,
        '#uid'   => $user->Id(),
        '#user'   => $user,
        '#table'   => $elements,
        '#pager' => [
					'#type' => 'pager',
					'#element' => $i,
        ],
				'#attached' => [
          'library' =>  [
            'my_kaboodles/kaboodle_js',
            'notification_system/notification_system',
          ],
        ],
      ];
      */
      return $build;
    }
    
}
