<?php
 
/**
* @file
* Contains \Drupal\onboarding\Controller\OnBoardingController.php
*
*/
 
namespace Drupal\onboarding\Controller;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Response;
use Drupal\file\Entity\File;
use Drupal\taxonomy\Entity\Term;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Drupal\Core\Access\AccessResult;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\Database\Query\Condition;
use Drupal\node\NodeInterface;
use Drupal\Core\Render\Markup;
use Drupal\s3fs\S3fsService;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\Core\Link;
use Drupal\Core\Url;

class OnBoardingController extends ControllerBase {
  /**
   * Returns a Onboarding Dashboard page.
   *
   * @return array
   *   A simple renderable array.
   *   for my-account page.
   */
	public function Onboarding_dashboard(User $user){
    global $base_secure_url;
    //$uid = \Drupal::currentUser()->id();
		//$user = User::load($uid);
		$uid = $user->get('uid')->value;
    $realname = user_real_name($uid);	
    $roles = $user->getRoles();
		$video_manager = false;
		$make_money = false;
		$template_designer = false;
    $notification = true;
    $professional_user = 0;
		if(in_array('administrator', $roles) || in_array('enterprise', $roles) || in_array('virtual_assistant', $roles) || in_array('va_manager', $roles)){
			$video_manager = false;
			$make_money = false;
			$template_designer = false;
		} else if(in_array('advanced_content_creator', $roles)){ //expert
			//expert can see template designer button as active
			$video_manager = true;
			$make_money = true;
			$template_designer = false; 
		} else if(in_array('designer', $roles)){
			//Designer can see [Video Manager, Tempate Designer, and Make Money] button as active
			$video_manager = true;
			$make_money = true;
			$template_designer = true; 
		}
		if(in_array('content_creator', $roles) && !in_array('advanced_content_creator', $roles)){
      $professional_user = 1;
    }
    
		$kitid = default_media_kit();
		//$status = $this->get_item_status($uid);
		
		//$completed_items = count(array_keys($status, "Completed"));
		//$percent = ($completed_items/8)*100;
		//$percent = $percent.'%';
    $config = \Drupal::config('s3fs.settings')->get();
    $s3 = s3fsService::getAmazonS3Client($config);
    $key = 'images/buttons';
    $imagespath = $s3->getObjectUrl($config['bucket'], $key);
		//$imagespath = 'https://s3.us-west-2.amazonaws.com/kaboodlemedia.com/images/buttons';
		$vault_rows = [];
		$notification_rows = [];
		$kit_rows = [];
		$kaboodle_rows = [];
		$preset_rows = [];
		$activity_rows = [];
		$vault_header = [
      'type' => t('Type'),
      'files' => t('Files'),
      'uploaded' => t('Uploaded'),
      'generated' => t('Generated'),
      'shared' => t('Shared'),
      'latest' => t('Latest'),
      'used' => t('Storage Used'),
    ];
		$notification_header = [
      'date' => ['data' => t('Date'), 'class' => 'sortempty', 'onclick' => 'sortColumn(this, "date")'],
      'subject' => ['data' => t('Subject'), 'class' => 'sortempty', 'onclick' => 'sortColumn(this, "text")'],
      'actions' => ['data' => t('Actions'), 'class' => 'text-center', 'colspan' => 2],
    ];

		$kit_header = [
      'name' => ['data' => t('Name'), 'class' => 'sortempty asc-icon bg-sort', 'onclick' => 'sortColumn(this, "text")'],
      'created' => ['data' => t('Created'), 'class' => 'sortempty', 'onclick' => 'sortColumn(this, "date")'],
      'updated' => ['data' => t('Updated'), 'class' => 'sortempty', 'onclick' => 'sortColumn(this, "date")'],
      'audio' => t('Audio'),
      'images' => t('Images'),
      'text' => t('Docs'),
      'video' => t('Videos'),
    ];		
		$kaboodle_header = [
      'title' => ['data' => t('Title'), 'class' => 'sortempty', 'onclick' => 'sortColumn(this, "text")'],
      'created' => ['data' => t('Created'), 'class' => 'sortempty', 'onclick' => 'sortColumn(this, "date")'],
      'actions' => ['data' => t('Actions'), 'colspan' => 2],
    ];
		
		$preset_header = [
      'name' => ['data' => t('Name'), 'class' => 'sortempty asc-icon bg-sort', 'onclick' => 'sortColumn(this, "text")'],
      'created' => ['data' => t('Created'), 'class' => 'sortempty', 'onclick' => 'sortColumn(this, "date")'],
      'updated' => ['data' => t('Updated'), 'class' => 'sortempty', 'onclick' => 'sortColumn(this, "date")'],
      'type' => ['data' => t('Type'), 'class' => 'sortempty', 'onclick' => 'sortColumn(this, "text")'],
      'actions' => ['data' => t('Actions'), 'class' => 'text-center', 'colspan' => 2],
    ];
		$activity_header = [
      'title' => ['data' => t('Title'), 'class' => 'sortempty asc-icon bg-sort', 'onclick' => 'sortColumn(this, "text")'],
      'type' => ['data' => t('Type'), 'class' => 'sortempty', 'onclick' => 'sortColumn(this, "text")'],
      'date' => ['data' => t('Date'), 'class' => 'sortempty', 'onclick' => 'sortColumn(this, "date")'],     
    ];
		//all files count
		$mv_audio_files = $this->get_media_files_count('audio', $uid, '');
		$mv_image_files = $this->get_media_files_count('image', $uid, '');
		$mv_text_files = $this->get_media_files_count('text', $uid, '');
		$mv_video_files = $this->get_media_files_count('video', $uid, '');
		
		//Uploaded files count
		$mv_audio_files_uploaded = $this->get_media_files_count('audio', $uid, 'uploaded');
		$mv_image_files_uploaded = $this->get_media_files_count('image', $uid, 'uploaded');
		$mv_text_files_uploaded = $this->get_media_files_count('text', $uid, 'uploaded');
		$mv_video_files_uploaded = $this->get_media_files_count('video', $uid, 'uploaded');
		
		//Generated files count
		$mv_audio_files_generated = $this->get_media_files_count('audio', $uid, 'generated');
		$mv_image_files_generated = $this->get_media_files_count('image', $uid, 'generated');
		$mv_text_files_generated = $this->get_media_files_count('text', $uid, 'generated');
		$mv_video_files_generated = $this->get_media_files_count('video', $uid, 'generated');
		
		//Shared files count
		$mv_audio_files_shared = $this->get_media_files_count('audio', $uid, 'shared');
		$mv_image_files_shared = $this->get_media_files_count('image', $uid, 'shared');
		$mv_text_files_shared = $this->get_media_files_count('text', $uid, 'shared');
		$mv_video_files_shared = $this->get_media_files_count('video', $uid, 'shared');
		
		//Latest media
		$mv_audio_latest_created_date = $this->latest_media('audio', $uid);
		$mv_image_latest_created_date = $this->latest_media('image', $uid);
		$mv_text_latest_created_date = $this->latest_media('text', $uid);
		$mv_video_latest_created_date = $this->latest_media('video', $uid);
		
		//all files storage
		$mv_audio_fids = $this->get_all_fids('audio', $uid);
		$mv_image_fids = $this->get_all_fids('image', $uid);
		$mv_text_fids = $this->get_all_fids('text', $uid);
		$mv_video_fids = $this->get_all_fids('video', $uid);
		
		$total_text_storage = $total_image_storage = $total_audio_storage = $total_video_storage = '';
		
		foreach($mv_audio_fids as $af){
			$afile = File::load($af->field_media_audio_file_target_id);
			if($afile){
				$total_audio_storage += intval($afile->get('filesize')->getValue()[0]['value']);
			}
		}foreach($mv_image_fids as $pf){
			$pfile = File::load($pf->field_media_image_target_id);
			if($pfile){
				$total_image_storage += intval($pfile->get('filesize')->getValue()[0]['value']);
			}
		}foreach($mv_text_fids as $tf){
			$tfile = File::load($tf->field_media_file_target_id);
			if($tfile){
				$total_text_storage += intval($tfile->get('filesize')->getValue()[0]['value']);
			}
		}foreach($mv_video_fids as $vf){
			$vfile = File::load($vf->field_media_video_file_target_id);
			if($vfile){
				$total_video_storage += intval($vfile->get('filesize')->getValue()[0]['value']);
			}
		}
		$audio_storage = ($total_audio_storage == '') ? '-' : formatedFileSize($total_audio_storage, true);
		$image_storage = ($total_image_storage == '') ? '-' : formatedFileSize($total_image_storage, true);
		$text_storage = ($total_text_storage == '') ? '-' : formatedFileSize($total_text_storage, true);
		$video_storage = ($total_video_storage == '') ? '-' : formatedFileSize($total_video_storage, true);

		//Total count
		$total_mv_files = $mv_audio_files + $mv_image_files + $mv_text_files + $mv_video_files;
		$total_mv_uploaded = $mv_audio_files_uploaded + $mv_image_files_uploaded + $mv_text_files_uploaded + $mv_video_files_uploaded;
		$total_mv_generated = $mv_audio_files_generated + $mv_image_files_generated + $mv_text_files_generated + $mv_video_files_generated;
		$total_mv_shared = $mv_audio_files_shared + $mv_image_files_shared + $mv_text_files_shared + $mv_video_files_shared;
		$total_mv_storage = intval($total_audio_storage) + intval($total_image_storage) + intval($total_text_storage) + intval($total_video_storage);
		
		$total_storage1 = formatedFileSize($total_mv_storage, true);
		$total_storage2 = formatedFileSize($total_mv_storage, false);
		$allocated_storage_space = $available_space = '';
		
		$vid = 'role_features';
		$terms =\Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree($vid);
		foreach ($terms as $term) {
			$term = Term::load($term->tid);
			if($term->field_drupal_role->value == 'content_creator' && in_array('content_creator', $roles)){
				$allocated_storage_space = $term->field_storage_limit->value;
				$allocated_storage_space = $allocated_storage_space.'.00 GB';
				$available_space = formatedFileSize(($term->field_storage_limit->value * 1073741824) - $total_mv_storage, true);  //1 GB = 1073741824
			} else if($term->field_drupal_role->value == 'advanced_content_creator' && in_array('advanced_content_creator', $roles)){
				//$term = Term::load($term->tid);
				$allocated_storage_space = $term->field_storage_limit->value;
				$allocated_storage_space = $allocated_storage_space.'.00 GB';
				$available_space = formatedFileSize(($term->field_storage_limit->value * 1073741824) - $total_mv_storage, true);
			} else if($term->field_drupal_role->value == 'designer' && in_array('designer', $roles)){
				//$term = Term::load($term->tid);
				$allocated_storage_space = $term->field_storage_limit->value;
				$allocated_storage_space = $allocated_storage_space.'.00 GB';
				$available_space = formatedFileSize(($term->field_storage_limit->value * 1073741824) - $total_mv_storage, true);
			} else if($term->field_drupal_role->value == 'enterprise' && in_array('enterprise', $roles)){
				//$term = Term::load($term->tid);
				$allocated_storage_space = $term->field_storage_limit->value;
				$allocated_storage_space = $allocated_storage_space.'.00 GB';
				$available_space = formatedFileSize(($term->field_storage_limit->value * 1073741824) - $total_mv_storage, true);
			} else if($term->field_drupal_role->value == 'administrator' && in_array('administrator', $roles)){
				//$term = Term::load($term->tid);
				$allocated_storage_space = $term->field_storage_limit->value;
				$allocated_storage_space = $allocated_storage_space.'.00 GB';
				$available_space = formatedFileSize(($term->field_storage_limit->value * 1073741824) - $total_mv_storage, true);
			}
		}
    $allocated_storage_space_per_user = $user->field_storage_space->value.' GB'; 
    $available_space_per_user = formatedFileSize(($user->field_storage_space->value* 1073741824) - $total_mv_storage, true);
		$mv_output['data'] = [
			['Audio', $mv_audio_files, $mv_audio_files_uploaded, $mv_audio_files_generated, $mv_audio_files_shared, $mv_audio_latest_created_date, $audio_storage],
			['Images', $mv_image_files, $mv_image_files_uploaded, $mv_image_files_generated, $mv_image_files_shared, $mv_image_latest_created_date, $image_storage],
			['Docs', $mv_text_files, $mv_text_files_uploaded, $mv_text_files_generated, $mv_text_files_shared, $mv_text_latest_created_date, $text_storage],
			['Videos', $mv_video_files, $mv_video_files_uploaded, $mv_video_files_generated, $mv_video_files_shared, $mv_video_latest_created_date, $video_storage],			
			['Total', $total_mv_files, $total_mv_uploaded, $total_mv_generated, $total_mv_shared, '', $total_storage2],
			[['data' => 'Status: You have used '.strtoupper($total_storage1).' of '.$allocated_storage_space_per_user.'. You have '.strtoupper($available_space_per_user).' available.',
        'colspan' => 7]],
		];
    $user_notifications = $this->user_notifications($uid);
		if(empty($user_notifications)){
		$n_output['data'][] = [['data' => t('You currently have no notifications'), 'class' => 'text-center empty-col', 'colspan' => 3]];
    }else{
			foreach($user_notifications as $n){ 
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
        $n_output['data'][] = [date('m-d-Y g:i a', $n->created),$n->short_message, $view, $delete]; 
      }
      
    }
		
		$mks = $this->onboarding_user_media_kits($uid);
		$mk_output['data'] = []; 
		foreach($mks as $mk){
			$mk_node = Node::load($mk->nid);
			//media kit link
			$mk_url = \Drupal\Core\Url::fromRoute('media_vault_tool.media_kit', ['user' => $uid, 'node' => $mk->nid]);
      if($mk->title == 'All Media Assets'){
        $default_link_options = [
          'attributes' => [
              'class' => [
                'default-media-rows',
              ],					
            ],
          ];
        $mk_url->setOptions($default_link_options);  
      }
			$mk_link = \Drupal::l(ucfirst($mk->title), $mk_url);
			$mk_audio_count = count($mk_node->field_vault_audio);
			$mk_photo_count = count($mk_node->field_vault_photo);
			$mk_text_count = count($mk_node->field_vault_file);
			$mk_video_count = count($mk_node->field_vault_video);			
			$mk_output['data'][] = [['data' => $mk_link,'class' => 'sorted'], ['data' => date('m-d-Y g:i a', $mk->created), 'datetime' => $mk->created], ['data' => date('m-d-Y g:i a', $mk->changed), 'datetime' => $mk->changed], $mk_audio_count, $mk_photo_count, $mk_text_count, $mk_video_count];
		}
		
		$kaboodles = $this->onboarding_user_kaboodles($uid);
		if(empty($kaboodles)){
		  $kb_output['data'][] = [['data' => t('You currently have no Kaboodles'), 'class' => 'text-center empty-col', 'colspan' => 3]]; 
		} else {	
			foreach($kaboodles as $kb){
				//kaboodle dashborad link
				$dashurl = \Drupal\Core\Url::fromRoute('my_kaboodles.kaboodle_dashboard_page', array('node' => $kb->nid));
				$dashbord_link = \Drupal::l(ucfirst($kb->title), $dashurl);
				
				//Edit link
				$editurl = \Drupal\Core\Url::fromRoute('media_vault_tool.kaboodle.edit', array('node' => $kb->nid));
				$edit_link_options = [
				'attributes' => [
						'class' => [
							'media-edit',
						],					
					],
				];
				$editurl->setOptions($edit_link_options);
				$edit = \Drupal::l('', $editurl);
				
				//delete link
				$deleteurl = \Drupal\Core\Url::fromUserInput('#');
				$delete_link_options = [
				'attributes' => [
						'class' => [
							'media-delete',
						],
						'id' => 'media-delete',
						'data-toggle' => 'modal',
						'data-target' => '#functional-modal',
						'uid' => $uid,
						'nid' => $kb->nid,										
						'onclick' => 'deleteKaboodleMessage(this)',					
					],
				];
				$deleteurl->setOptions($delete_link_options);
				$delete = \Drupal::l('', $deleteurl);
				$kb_output['data'][] = [$dashbord_link, date('m-d-Y g:i a', $kb->created), $edit, $delete];
			}
		}
		
		//preset output
		$presets = $this->onboarding_user_presets($uid);
		$preset_output['data'] = []; 
		$node_type = '';
		foreach($presets as $pr){
			//Preset link
			if($pr->type == 'Branding'){
				$node_type = 'branding_preset';
				//title link
				$preseturl = \Drupal\Core\Url::fromRoute('media_vault_tool.branding_preset.edit', array('node' => $pr->nid));
				if($pr->default_branding == 1){
					$preset_link_options = [
						'attributes' => [
							'id' => 'default-branding',
							'default' => $pr->default_branding,				
							//'onload' => 'defaultoTop(this)',					
						],
					];
					$preseturl->setOptions($preset_link_options);
				}
				$preset_link = \Drupal::l(ucfirst($pr->title), $preseturl);
				
				//Edit link
				$editurl = \Drupal\Core\Url::fromRoute('media_vault_tool.branding_preset.edit', array('node' => $pr->nid));
				$edit_link_options = [
				'attributes' => [
						'class' => [
							'media-edit-presets',
						],					
					],
				];
				$editurl->setOptions($edit_link_options);
				$edit = \Drupal::l('', $editurl);
			} else {
				$node_type = 'metadata_preset';
				//title link
				$preseturl = \Drupal\Core\Url::fromRoute('media_vault_tool.metadata_preset.edit', array('node' => $pr->nid));
				$preset_link = \Drupal::l(ucfirst($pr->title), $preseturl);					
				
				//Edit link
				$editurl = \Drupal\Core\Url::fromRoute('media_vault_tool.metadata_preset.edit', array('node' => $pr->nid));
				$edit_link_options = [
				'attributes' => [
						'class' => [
							'media-edit-presets',
						],					
					],
				];
				$editurl->setOptions($edit_link_options);
				$edit = \Drupal::l('', $editurl);					
			}
				
			//delete link
			$deleteurl = \Drupal\Core\Url::fromUserInput('#');
			$delete_link_options = [
				'attributes' => [
					'class' => [
						'media-delete',
					],
					'id' => 'media-delete',
					'data-toggle' => 'modal',
					'data-target' => '#functional-modal',
					'uid' => $uid,
					'nid' => $pr->nid,
					'type' => $pr->type,
					'onclick' => 'deletePresetMessage(this)',					
				],
			];
			$deleteurl->setOptions($delete_link_options);
			$delete = \Drupal::l('', $deleteurl);
			$preset_output['data'][] = [['data' => $preset_link, 'class' => 'sorted'], date('m-d-Y g:i a', $pr->created), date('m-d-Y g:i a', $pr->changed), $pr->type, ['data' => $edit]];
		}
		
		//activity output
		$activity_output['data'][] = [['data' => 'Coming soon...', 'colspan' => 3]]; 
    
    $user_templates = \Drupal::service('km_product.templates')->getUserProducts($uid);
    $time_zone = date_default_timezone_get();
    $i = 0;
    $j = 0;
    foreach($user_templates->data as $key=>$value){ 
    if(isset($value->kaboodles_id) && ($value->kaboodles_id != '') && ($value->kaboodles_id != 0)){ 
        if($value->modified != ''){
          $date = new DrupalDateTime($value->modified, 'GMT');
          $date->setTimezone(new \DateTimeZone($time_zone));
          $date_ful = $date->format('m-d-Y g:i a'); 
        }
        if($value->type_tid != ''){
          $km_product_type = \Drupal\taxonomy\Entity\Term::load($value->type_tid);
          $folder_name = empty($km_product_type) ? '' : $km_product_type->get('name')->value;
        }else{
          $folder_name = '';
        } 
        $kmproduct_link = Link::fromTextAndUrl($value->name, Url::fromRoute('product.edittemplate', ['node' => $value->kaboodles_id,'producttype'=>$value->type_tid, 'template_id'=>$value->_id,'kmproduct'=>'yes']));            
        //$product_output['data'][] = [$kmproduct_link,$folder_name, $date_ful]; 
        $product_all[] = [$kmproduct_link,$folder_name, 'date'=>$date_ful];
      }
    }
    $utquery = \Drupal::database()->select('web_product_templates', 'wpt');
    $utquery->leftJoin('web_templates_favorite', 'wtf', 'wtf.template_id = wpt.id AND wtf.node_id = wpt.node_id AND wtf.user_id = wpt.user_id');
    $utquery->fields('wpt', ['id', 'product_id', 'name', 'description', 'template_group', 'preview_image', 'tags', 'created', 'modified','node_id']);
    $utquery->addExpression("IF(wtf.is_favorite IS NULL, 0, wtf.is_favorite)", 'favorite');    
    $utquery->condition('wpt.user_id', $uid, '=');
    $utquery->condition('wpt.template_type', 2, '=');
    $user_webtemplate  = $utquery->execute()->fetchAll();
    if(!empty($user_webtemplate)){
      foreach($user_webtemplate as $web_key=>$web_value){
        if($web_value->product_id != ''){
          $km_product = \Drupal\taxonomy\Entity\Term::load($web_value->product_id);
          $folder_name = empty($km_product) ? '' : $km_product->get('name')->value;
        }else{
          $folder_name = '';
        }
        if($web_value->modified != ''){
          $dates = date('m/d/Y H:i:s', $web_value->modified);
          $date = new DrupalDateTime($dates, 'GMT');
          $date->setTimezone(new \DateTimeZone($time_zone));
          $date_ful = $date->format('m-d-Y g:i a'); 
        }
        $kmproduct_link = Link::fromTextAndUrl($web_value->name, Url::fromRoute('product.edittemplate', ['node' => $web_value->node_id,'producttype'=>$web_value->product_id, 'template_id'=>$web_value->id,'kmproduct'=>'yes']));  ;  
        $product_all[] = [$kmproduct_link, $folder_name,'date'=>$date_ful]; 
      }
    }
    usort($product_all, function($a, $b) {
    return $b['date'] <=> $a['date'];
     });
    foreach($product_all as $p_all_key => $p_all_value){
      $j++;
      
       $i++;
      if($i > 15){
        break;
      }
      
      $product_output['data'][] = [$p_all_value[0],$p_all_value[1], $p_all_value['date']];
    }
    if($j == 0){
		  $product_output['data'][] =  [['data' => 'You currently have no products. To create brochures, email flyers, social media posts, playlists, online galleries, and more, click the "My Kaboodles button above."', 'class' => 'text-center empty-col', 'colspan' => 3]]; 
      $product_empty = 'true';
    }
    else{
    $product_empty = 'false';
    }
    
		$vault_rows = $mv_output['data'];
		$notification_rows = $n_output['data'];
		$kit_rows = $mk_output['data'];
		$kaboodle_rows = $kb_output['data'];
		$preset_rows = $preset_output['data'];
		$activity_rows = $activity_output['data'];
    $product_rows = $product_output['data'];
		
		$media_vault_table = [
			'#type' => 'table',
			'#header' => $vault_header,
			'#rows' => $vault_rows,
		];
		$notification_table = [
			'#type' => 'table',
			'#header' => $notification_header,
			'#rows' => $notification_rows,
		];
		
		$media_kit_table = [
			'#type' => 'table',
			'#header' => $kit_header,
			'#rows' => $kit_rows,
		];
		$kaboodles_table = [
			'#type' => 'table',
			'#header' => $kaboodle_header,
			'#rows' => $kaboodle_rows,
		];
		$preset_table = [
			'#type' => 'table',
			'#header' => $preset_header,
			'#rows' => $preset_rows,
		];
		$activity_table = [
			'#type' => 'table',
			'#header' => $activity_header,
			'#rows' => $activity_rows,
		];
    $product_table = [
			'#type' => 'table',
			'#header' => $activity_header,
			'#rows' => $product_rows,
		];
    // Get knowledge Base Icon info
    // Get knowledge Base Icon for media vault
    $host =  \Drupal::request()->getSchemeAndHttpHost();
    $media_vault_kbi_value = knowledge_base_i_pattern('Media Vault');
    $media_vault_alias = \Drupal::service('path.alias_manager')->getAliasByPath('/node/'.$media_vault_kbi_value[2]);
    $media_vault_kbi = Markup::create('<div class="info-ico kowledge-base-ico" aria-label ="'.$media_vault_kbi_value[1].'"  aria-title ="'.$media_vault_kbi_value[0].'" aria-nid ="'.$host.$media_vault_alias.'"></div>');
		//Get knowledge Base Icon for Recent Notifications
    $notifications_kbi_value = knowledge_base_i_pattern('Notifications');
    $notifications_alias = \Drupal::service('path.alias_manager')->getAliasByPath('/node/'.$notifications_kbi_value[2]);
    $notifications_kbi = Markup::create('<div class="info-ico kowledge-base-ico" aria-label ="'.$notifications_kbi_value[1].'"  aria-title ="'.$notifications_kbi_value[0].'" aria-nid ="'.$host.$notifications_alias.'"></div>');
    //Get knowledge Base Icon for Recent Media Kits
    $media_kits_kbi_value = knowledge_base_i_pattern('Media Kits Manager');
    $media_kits_alias = \Drupal::service('path.alias_manager')->getAliasByPath('/node/'.$media_kits_kbi_value[2]);
    $media_kits_kbi = Markup::create('<div class="info-ico kowledge-base-ico" aria-label ="'.$media_kits_kbi_value[1].'"  aria-title ="'.$media_kits_kbi_value[0].'" aria-nid ="'.$host.$media_kits_alias.'"></div>');
    //Get knowledge Base Icon for Recent Kaboodles
    $kaboodles_kbi_value = knowledge_base_i_pattern('My Kaboodles');
    $kaboodles_alias = \Drupal::service('path.alias_manager')->getAliasByPath('/node/'.$kaboodles_kbi_value[2]);
    $kaboodles_kbi = Markup::create('<div class="info-ico kowledge-base-ico" aria-label ="'.$kaboodles_kbi_value[1].'"  aria-title ="'.$kaboodles_kbi_value[0].'" aria-nid ="'.$host.$kaboodles_alias.'"></div>');
    //Get knowledge Base Icon for Recent My Presets
    $my_presets_kbi_value = knowledge_base_i_pattern('My Presets');
    $my_presets_alias = \Drupal::service('path.alias_manager')->getAliasByPath('/node/'.$my_presets_kbi_value[2]);
    $my_presets_kbi = Markup::create('<div class="info-ico kowledge-base-ico" aria-label ="'.$my_presets_kbi_value[1].'"  aria-title ="'.$my_presets_kbi_value[0].'" aria-nid ="'.$host.$my_presets_alias.'"></div>');
    //Get knowledge Base Icon for Recent Sales Activity
    $sales_activity_kbi_value = knowledge_base_i_pattern('Sales Activity');
    $sales_activity_alias = \Drupal::service('path.alias_manager')->getAliasByPath('/node/'.$sales_activity_kbi_value[2]);
    $sales_activity_kbi = Markup::create('<div class="info-ico kowledge-base-ico" aria-label ="'.$sales_activity_kbi_value[1].'"  aria-title ="'.$sales_activity_kbi_value[0].'" aria-nid ="'.$host.$sales_activity_alias.'"></div>');
    //Get knowledge Base Icon for Kaboodle Products
    $kaboodle_products_kbi_value = knowledge_base_i_pattern('Kaboodle Products');
    $kaboodle_products_alias = \Drupal::service('path.alias_manager')->getAliasByPath('/node/'.$kaboodle_products_kbi_value[2]);
    $kaboodle_products_kbi = Markup::create('<div class="info-ico kowledge-base-ico" aria-label ="'.$kaboodle_products_kbi_value[1].'"  aria-title ="'.$kaboodle_products_kbi_value[0].'" aria-nid ="'.$host.$kaboodle_products_alias.'"></div>');
    
    $data = [
			'video_manager' => $video_manager,
			'make_money' => $make_money,
      'notification' =>$notification,
			'template_designer' => $template_designer,
			'realname' => $realname,
			'uid' => $uid,
			'roles' => $roles,
			'kitid' => $kitid,
			'media_vault_table' => $media_vault_table,
			'notification_table' => $notification_table,
			'media_kit_table' => $media_kit_table,
			'kaboodles_table' => $kaboodles_table,
			'preset_table' => $preset_table,
			'activity_table' => $activity_table,
			'imagepath' => $imagespath,
      'media_vault_kbi' => $media_vault_kbi,
      'notifications_kbi' => $notifications_kbi,
      'media_kits_kbi' => $media_kits_kbi,
      'kaboodles_kbi' => $kaboodles_kbi,
      'my_presets_kbi' => $my_presets_kbi,
      'sales_activity_kbi' => $sales_activity_kbi,
      'kaboodle_products_kbi' => $kaboodle_products_kbi,
      'product_table' => $product_table,
      'product_empty' => $product_empty,
      'professional_user' => $professional_user,
		];
		$render_data['theme_data'] = array(
        '#theme' => 'onboarding',
        '#data' => $data,
        '#attached' => [
          'library' =>  [
            'onboarding/onboarding.main',
          ],
          'drupalSettings' =>  [
            'uid' => $uid,
          ],
        ],
      );

    return $render_data;
	}
	
	/**
	 * Custom access callback for my account page
	 */
	public function onboarding_access(){
		$uid = \Drupal::currentUser()->id();
		$account = User::load($uid);
    $roles = $account->getRoles();
    if(in_array('administrator', $roles) || in_array('va_manager', $roles)){
      return AccessResult::allowed();
    }
    else if ($account->id() == $uid) {
      return AccessResult::allowed();
    }
    else{
      return AccessResult::forbidden();
    }
  }
	
	/**
	 * switchToMyaccount
	 */
	public function goto_myaccount() {
		$uid = \Drupal::currentUser()->id();
		$path = '/tools/my-account/'.$uid;
		$response = new RedirectResponse($path);
		$response->send();
		return;
	}
	
	/**
  * Returns a page title.
  */
  public function getTitle($node) {
    return  $node->getTitle();
  }
	
	/**
  * To download PDF guide.
  */
	public function download_pdf_guide($node){
		$pdf_field = $node->get('field_media')->get(0);
		if ($pdf_field) {
			$uri = $pdf_field->entity->get('field_media_file')->entity->uri->value;
			$pdf_url = file_create_url($uri);
		}
		$file_name = 'guide.pdf';
    header('Content-disposition: attachment; filename="'.$file_name.'"');
    header("Content-Type: application/octet-stream");
    readfile($pdf_url);
    exit;
	}
  
	/**
  * To mark item completed.
  */
	public function mark_item_completed(){
		//get your POST parameter
    $nid = \Drupal::request()->get('nid');
    $uid = \Drupal::request()->get('uid');
		
		if(!empty($nid) && !empty($uid)) {
			\Drupal::database()->merge('item_tracking')
				->key([
					'uid' => $uid,
					'nid' => $nid,
				])
				->fields([
					'status' => 1,
				])
				->execute();	
		}
    
    $status = $this->get_item_status($uid);
		$completed_items = count(array_keys($status, "Completed"));
    if($completed_items == 8){
      $url = "/tools/my-kaboodles/$uid";
    }
    else{
      $url = "/tools/my-account/$uid";
    }
		
		return new Response($url);
	}
	
	/**
   * Fetch each item status.
   */
	public static function get_item_status($uid){
    $query = \Drupal::database()->select('node_field_data', 'n');
		$query->join('node__field_category', 'c', "n.nid = c.entity_id");
		$query->leftJoin('item_tracking', 'i', "n.nid = i.nid AND i.uid = $uid");
    $query->fields('n', ['nid']);
		$query->addExpression("IF(i.status = 1, 'Completed', 'In progress')", 'status');
    $query->condition('n.type', 'knowlege_base_article', '=');
    $query->condition('c.field_category_target_id', 204, '=');
    $result = $query->execute()->fetchAllKeyed();

    return $result;
	}
	
	/**
   * Fetch media count
   */
	public function get_media_files_count($type, $uid, $source){
		if(!empty($source)){
			$medialist = \Drupal::database()->select('media_field_data', 'm');
			$medialist->leftJoin('media__field_media_source_type', 'st', "m.mid = st.entity_id");
			$medialist->condition('m.uid', $uid, '=');
			$medialist->condition('m.bundle', $type, '=');
      if($source == 'uploaded'){
        $medialist->condition('st.field_media_source_type_value', array('Upload Modified', 'uploaded'), 'IN');
      } else {
        $medialist->condition('st.field_media_source_type_value', $source, '=');
      }
			$medialist->fields('m', ['mid']);
			$result = $medialist->execute()->fetchAll();
		} else {
			$medialist = \Drupal::database()->select('media_field_data', 'm');
			$medialist->condition('m.uid', $uid, '=');
			$medialist->condition('m.bundle', $type, '=');
			$medialist->fields('m', ['mid']);
			$result = $medialist->execute()->fetchAll();
		}
    $response = count($result);
    return $response;

	}
	
	/**
   * Fetch media files
   */
	public function get_all_fids($type, $uid){
		$ft = '';
		if($type == 'image'){
			$ft = $type;
		} else if($type == 'audio'){
			$ft = 'audio_file';
		} else if($type == 'text'){
			$ft = 'file';
		} else if($type == 'video'){
			$ft = 'video_file';
		}
		$filelist = \Drupal::database()->select('media_field_data', 'm');
		$filelist->leftJoin('media__field_media_'.$ft, 'a', "m.mid = a.entity_id");
		$filelist->condition('m.uid', $uid, '=');
		$filelist->condition('m.bundle', $type, '=');
		$filelist->condition('a.bundle', $type, '=');
		$filelist->fields('a', ['field_media_'.$ft.'_target_id']);
		$result = $filelist->execute()->fetchAll();
    
		return $result;
	}
	
	/**
	 * Get Latest created Media datetime
	 */
	public function latest_media($type, $uid) {
    $database = \Drupal::database();
    $query = $database->select('media_field_data', 'md');
    $query->condition('md.uid', $uid, '=');
    $query->condition('md.bundle', $type, '=');
		$query->orderBy('md.created', 'DESC');
    $query->fields('md', ['created']);
    $result = $query->execute()->fetchField();
    if($result){
	    $formatedDate = date('m-d-Y g:i a', $result);
    }
    else{
      $formatedDate = '';
    }    
		
    return $formatedDate;
  }
	
	/**
	 * Get all media kit nodes of the user
	 * return $result
	 */
	public function onboarding_user_media_kits($uid){
    $database = \Drupal::database();
    $query = $database->select('node_field_data', 'n');
    $query->condition('n.uid', $uid, '=');
    $query->condition('n.type', 'media_kit', '=');
    $query->fields('n', ['nid', 'uid', 'title', 'created', 'changed']);
		$query->orderBy('n.title', 'ASC');
    $result = $query->execute()->fetchAll();

    return $result;
  }
	
	/**
	 * Get all kaboodle nodes of the user
	 * return $result
	 */
	public function onboarding_user_kaboodles($uid){
    $database = \Drupal::database();
    $query = $database->select('node_field_data', 'n');
		$query->leftJoin('node__field_archived', 'a', "n.nid = a.entity_id");
    $query->condition('n.uid', $uid, '=');
    $query->condition('a.field_archived_value', 0, '=');
    $query->condition('n.type', 'kaboodle', '=');
    $query->fields('n', ['nid', 'title', 'created']);
    $result = $query->execute()->fetchAll();

    return $result;
  }
	
	/**
	 * Get all presets nodes of the user
	 * return $result
	 */
	public function onboarding_user_presets($uid){
		$default_branding = default_branding_preset($uid);
    $default_branding = empty($default_branding) ? 0 : $default_branding;

    $database = \Drupal::database();
    $query = $database->select('node_field_data', 'n');
    $query->condition('n.uid', $uid, '=');
    $query->condition('n.type', array('branding_preset', 'metadata_preset'), 'IN');
    $query->fields('n', ['nid', 'title', 'created', 'changed']);
		$query->addExpression("IF(n.type = 'branding_preset', 'Branding', 'Metadata')", 'type');
		$query->addExpression("IF(n.nid = $default_branding, 1, 0)", 'default_branding');
		$query->orderBy('n.title', 'ASC');
    $result = $query->execute()->fetchAll();

    return $result;
  }
	
	/**
	 * Delete Branding and metadata preset node
	 */
	public function delete_presets_node(User $user, NodeInterface $node){
		$uid = $user->get('uid')->value;
    $nid = $node->id();
		$title = $node->title;
		$type = $node->type;
		$type = explode("_", $type);
		$type = implode(" ", $type);
		//$node->field_archived = 1;
		$node->delete();
		
		$redirectpath = '/tools/my-account/'.$uid;
		$msg = ucfirst($type) . ' "'.ucfirst($title).'" has been deleted successfully.';
		return new RedirectResponse($redirectpath);
		drupal_set_message(t($msg));
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
      $notifications->range(0, 10);
      $result = $notifications->execute()->fetchAll();
			
			return $result;
		}
}