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
/**
 * Defines KaboodlesController class.
 */
class KaboodlesNotificationsController extends ControllerBase
{
  
    /**
    * Display the specific notification of NodeInterface $node on my-kaboodles page markup.
    *
    * @return array
    */
    public function specific_notification(NodeInterface $node, User $user) {
      $element = 9004;
      $kaboodle_title = $node->get('title')->value;
			$uid = \Drupal::currentUser()->id();
      return [
        '#theme' => 'my_kaboodles_notifications',
        '#kaboodle_title'   => $kaboodle_title,
        '#uid'   => $uid,
        '#node'   => $node,
        '#pager' => [
					'#type' => 'pager',
					'#element' => $element,
        ],
      ];
    }
		
		/**
    * Display the all notifications of User $user.
    *
    * @return array
    */
    public function all_notifications(User $user) {
      $element = 9004;
      $kaboodle_title = 'Notifications';
			$notifications = $this->user_notifications($user->id());
			$header = [
				'select' => ['data' => ''],
				'date' => ['data' => t('Date'), 'class' => 'sortempty', 'onclick' => 'sortColumn(this, "date")'],
				'feature' => ['data' => t('Feature'), 'class' => 'sortempty', 'onclick' => 'sortColumn(this, "text")'],
				'message' => ['data' => t('Message'), 'class' => 'sortempty', 'onclick' => 'sortColumn(this, "text")'],
				'email' => ['data' => t('Email Sent'), 'class' => 'sortempty', 'onclick' => 'sortColumn(this, "text")'],
				'actions' => ['data' => t('Actions'), 'class' => 'text-center text-uppercase', 'colspan' => 2],
			];
			if(empty($notifications)){
				$output['data'][] = [['data' => t('You currently have no notifications.'), 'class' => 'text-center empty-col', 'colspan' => 6]]; 
			} else {	
				foreach($notifications as $n){
					//Select checkbox					
					$select_n = new FormattableMarkup('<label class="checkbox-container"><input type="checkbox" class="box-check" name="notification-opt-@notification_id" id="n-@notification_id" value="@notification_id"/><span class="checkmark"></span></label>',['@notification_id' => $n->notification_id]);
					//email
					$send_email = ($n->email == 1) ? 'Yes' : 'No';
					//view
					$viewurl = \Drupal\Core\Url::fromUserInput('#');
					$view_link_options = [
					'attributes' => [
              'class' => [
								'view-notification'
							],
							'data-toggle' => 'modal',
							'data-target' => '#notification-modal',								
							'aria-label' => $n->full_message,									
							'onclick' => 'viewNotificationMessage(this)',					
						],
					];
					$viewurl->setOptions($view_link_options);
					$view = \Drupal::l('', $viewurl);
					//delete link
					$deleteurl = \Drupal\Core\Url::fromUserInput('#');
					$delete_link_options = [
					'attributes' => [
							'class' => [
								'media-delete',
							],
							'id' => 'notification-delete',
							'data-toggle' => 'modal',
							'data-target' => '#notification-modal',
							'uid' => $user->id(),
							'not_id' => $n->notification_id,										
							'onclick' => 'deleteNotificationMessage(this)',			
						],
					];
					$deleteurl->setOptions($delete_link_options);
					$delete = \Drupal::l('', $deleteurl);
					$output['data'][] = [['data' => $select_n, 'class' => 'text-center', 'width' => '3%'], date('m/d/Y g:i a', $n->created), $n->feature_name, $n->short_message, ['data' =>$send_email, 'class' => 'text-center'],['data' =>$view, 'width' => '4%'],['data' =>$delete, 'width' => '4%'] ];
				}
			}
			$table = [
				'#type' => 'table',
				'#header' => $header,
				'#rows' => $output['data'],
			];
      return [
        '#theme' => 'all_notifications',
        '#kaboodle_title'   => $kaboodle_title,
        '#uid'   => $user->Id(),
        '#user'   => $user,
        '#table'   => $table,
        '#pager' => [
					'#type' => 'pager',
					'#element' => $element,
        ],
				'#attached' => [
          'library' =>  [
            'my_kaboodles/kaboodle_js',
            'notification_system/notification_system',
          ],
        ],
      ];
    }
		
		/**
		 * Get all notifications of current user
		 */
		public function user_notifications($uid){
			$notifications = \Drupal::database()->select('notifications', 'n');
      $notifications->leftJoin('users_field_data', 'u', "u.uid = n.uid");
      $notifications->condition('u.status', 1, '=');
      $notifications->condition('u.uid', $uid, '=');
      $notifications->fields('n', ['notification_id','uid','feature_name','full_message','short_message','email','created']);
      $notifications->orderBy('created', 'DESC');
      $result = $notifications->execute()->fetchAll();
			
			return $result;
		}
    
    /**
		 * Delete notifications
		 */
		public function delete_notification($user_id, $not_id, $on_boarding,$not_list){ 
      if(isset($user_id) && isset($not_id) && $user_id != 0 && $not_id !=0){
        $query = \Drupal::database()->delete('notifications');
        $query->condition('notification_id', $not_id, '=');
        $query->execute();
        
        if($on_boarding == 'false'){
          $redirectpath = '/tools/notifications/'.$user_id;
        }
        if($on_boarding == 'true'){
          $redirectpath = '/tools/my-account/'.$user_id;
        }  
        
        $msg = 'Notification has been deleted successfully.';
        \Drupal::messenger()->addStatus(t($msg));
        return new RedirectResponse($redirectpath);
        //\Drupal::messenger()->addStatus(t($msg));
        //drupal_set_message(t($msg));
      }
      if($not_list != ''){
       $not_list_array =  json_decode($not_list);
       if(!empty($not_list_array)){
         foreach($not_list_array as $not_id){
           $query = \Drupal::database()->delete('notifications');
           $query->condition('notification_id', $not_id, '=');
           $query->execute();
         }
        if($on_boarding == 'false'){
          $redirectpath = '/tools/notifications/'.$user_id;
        }
        $msg = 'Notification has been deleted successfully.';
        \Drupal::messenger()->addStatus(t($msg));
        return new RedirectResponse($redirectpath);
		   } 
      }
    }
}
