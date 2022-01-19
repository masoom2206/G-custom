<?php  
/**
 * @file
 * Contains \Drupal\social_media\Plugin\QueueWorker\PublishPostQueue.
 */

namespace Drupal\social_media\Plugin\QueueWorker;

use Drupal\Core\Queue\QueueWorkerBase;
use Drupal\social_media\Controller\SocialMediaController;

/**
 * Processes tasks to post on social media.
 *
 * @QueueWorker(
 *   id = "publish_post_queue",
 *   title = @Translation("SocialMedia: Queue worker"),
 *   cron = {"time" = 600}
 * )
 */
class PublishPostQueue extends QueueWorkerBase {

  /**
   * {@inheritdoc}
   */
  public function processItem($item) {
	 // \Drupal::logger('Social media Queue')->warning('<pre><code>' . print_r($item, TRUE) . '</code></pre>');
      $post_id = $item->post_id;
	  $query = \Drupal::database()->select('social_media', 'sm');
			    $query->innerJoin('social_media_posts', 'smp', 'sm.id = smp.sid');
	  $result = $query->fields('sm', array('id','social_media_name','text', 'page_id', 'scheduled_timestamp', 'uid'))
					   ->fields('smp', array('mid'))
                       ->condition('sm.id', $post_id, '=')
					   ->execute()->fetchAll();
           
			if(!count($result)){	
              $result   = \Drupal::database()->select('social_media', 'post_no_mid')
				   ->fields('post_no_mid', ['id','social_media_name','text','page_id', 'scheduled_timestamp', 'uid'])
				   ->condition('id', $post_id, '=')
				   ->execute()
				   ->fetchAll();	
		        }   
		      foreach($result as $row_object){ 
				
                       if($row_object->social_media_name == 'Facebook'){
                               $post['mids'][] = (int)$row_object->mid; 
                               if((int)$row_object->mid == 0){
								    $post['mids'] = [];
							   }  	
                               else{
								   $post['mids'][] = (int)$row_object->mid;
							   }							   
				               $post['message']    = $row_object->text;
                               $post['scheduled_publish_time']    = $row_object->scheduled_timestamp; 
				               $page_id   = (int)$row_object->page_id;
                               $uid = $row_object->uid; 
							   $social_media_name = $row_object->social_media_name;
                        }
				  
                                   
			      }
				  if($social_media_name == 'Facebook' ){
					   if(is_numeric($page_id) && is_numeric($uid) ){
						   $response = \Drupal::service('social_media.social_media_controller')->facebook_post_publish($page_id, $post, $uid);
						   if($response ==1 ){
							   // here we need to update published status
							   	\Drupal::database()->update('social_media')
									   ->fields(['is_published' => 1 ])
									   ->condition('uid', $uid, '=')
									   ->condition('id', $post_id, '=')
									   ->execute();
							   
							   $response_message = 'Post Id: '.$post_id.'scheduled on facebook, Page ID: '.$page_id ;

							   \Drupal::logger('Social media Queue')->warning('<pre><code>' . print_r($response_message, TRUE) . '</code></pre>');
						   }
						   elseif($response =='inValidPage'){
							   $response_message = 'Facebook page ID '.$page_id. 'does not exist';
							   \Drupal::logger('Social media Queue')->error('<pre><code>' . print_r($response_message, TRUE) . '</code></pre>');
						   }
						   else {
							   
						   }
					  
							
						   
					   }
					   else{
							$response_message = 'undefined Facebook page ID '.$page_id;
							 \Drupal::logger('Social media Queue')->error('<pre><code>' . print_r($response_message, TRUE) . '</code></pre>');
					   }
				  }     
   
   }

}
