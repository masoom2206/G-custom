<?php
namespace Drupal\video_maker_tool\Controller;
use Drupal\Core\Controller\ControllerBase;
use Drupal\video_maker_tool\Controller\ClassSaveVideo;
use Drupal\video_maker_tool\Controller\ClassPreviewVideo;
use Drupal\video_maker_tool\Controller\ClassRenderVideo;
use Drupal\video_maker_tool\Controller\VideoDebugController;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\taxonomy\Entity\Term;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;
use Drupal\Core\Url;

class VideoActionController extends ControllerBase {
  /**
   * Save Video.
   *
   * @params request data
   * @return null
   */
  public function saveVideo(Request $request){
    if(isset($_GET['team'])){
      $uid = $_GET['uid'];
    }
    else {
      $uid = \Drupal::currentUser()->id();
    }
    $time = time();
    // media files in story board
    $mids = $request->request->get('mids');
    if(empty($mids)) {
      \Drupal::messenger()->addStatus(t('Please select at least one media to make video.'));
      return new RedirectResponse(\Drupal::url('videomaker.add'));
    }
    $videoID = (int)$request->request->get('video_id');
    if($videoID > 0){
      $accessVideo = $this->access_video($videoID);
      if(!$accessVideo){
        throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException();
      }
    }
    // save video data into database
    $objSaveVideo = new ClassSaveVideo($request);
    $video_id = $objSaveVideo->save();
    
    $op = $request->request->get('op');
    if($op !== 'preview'){
      \Drupal::messenger()->addStatus(t('Video settings saved successfully.'));
    }
    // perform other activities
    switch($op){      
      case 'preview':
        // save and preview video
        //$objPreviewVideo = new ClassPreviewVideo();
        //$objPreviewVideo->preview($video_id, 'create');
        //\Drupal::messenger()->addStatus(t('You video has been submitted for processing and encoding for preview. Please wait for sometime.'));
        if(isset($_GET['team'])){
          $gid = $_GET['team'];
          $muid = $_GET['uid'];
          return new RedirectResponse(Url::fromRoute('videomaker.edit', ['video_id' => $video_id, 'team' => $gid, 'uid' => $muid], ['fragment' => 'preview'])->toString());
        }else {
          return new RedirectResponse(\Drupal::url('videomaker.edit', ['video_id' => $video_id], ['absolute' => TRUE]) . '#preview', 301);
        }
      break;
      
      default:
    }
    
    if(isset($_GET['team'])){
      $gid = $_GET['team'];
      $muid = $_GET['uid'];
      return new RedirectResponse(Url::fromRoute('videomaker.edit', ['video_id' => $video_id, 'team' => $gid, 'uid' => $muid])->toString());
    }else {
      return new RedirectResponse(\Drupal::url('videomaker.edit', ['video_id' => $video_id], ['absolute' => TRUE]));
    }
  }
  
  
  /**
   * Render Video.
   *
   * @params request data
   * @return null
   */
  public function renderVideo(Request $request){
    if(isset($_GET['team'])){
      $uid = $_GET['uid'];
    }
    else {
      $uid = \Drupal::currentUser()->id();
    }
    $video_id   = $request->request->get('render_video_id');
    if($video_id){
      $accessVideo = $this->access_video($video_id);
      if(!$accessVideo){
        throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException();
      }
      //Clean the video processing
      $cleanupVideoProcess = new VideoDebugController();
      $cleanup = $cleanupVideoProcess->cleanupProcessing($video_id);
    }
    $video_name = $request->request->get('title');
    
    $render_data = []; 
    $render_data['archieve']    = $request->request->get('archieve');
    $render_data['tags']        = $request->request->get('tags');
    $render_data['media_kits']  = $request->request->get('media_kits');
    $render_data['description'] = $request->request->get('description');
    
    //echo '<pre>'; print_r($request->request);print_r($render_data); echo '</pre>'; die('here');
    
    // create video media and associate it to media vault and kits
    //This functionality has moved to finishTranscode() function in VideoService.php file
    //$objRenderVideo = new ClassRenderVideo();
    //$mid = $objRenderVideo->renderVideoProduct($video_id, $render_data);
    
    \Drupal::database()->update('vmt_videos')
    ->fields([
        'video_name'      => $video_name,
        'render_status'   => 'Pending',
        'render_data'     => json_encode($render_data),
        //'video_media_id'  => $mid,
        'render_date'     => date('Y-m-d H:i:s'),
    ])
    ->condition('video_id', $video_id, '=')
    ->execute();

    \Drupal::messenger()->addStatus(t('Your video has been submitted for processing and encoding. This may take a few minutes to a few hours. You will receive a notice when it is ready. You do not need to keep the Video Maker open while you wait.'));
    
    if(isset($_GET['team'])){
      $gid = $_GET['team'];
      $muid = $_GET['uid'];
      return new RedirectResponse(Url::fromRoute('videomaker.edit', ['video_id' => $video_id, 'team' => $gid, 'uid' => $muid])->toString());
    }else {
      return new RedirectResponse(\Drupal::url('videomaker.edit', ['video_id' => $video_id], ['absolute' => TRUE]));
    }
  }
  
  /**
   * Delete video.
   *
   * @params request data
   * @return null
   */
  public function editRenderVideo(){
    $objRenderVideo = new ClassRenderVideo();
    $video_id = \Drupal::request()->request->get('video_id');
    
    $data = $objRenderVideo->editRenderVideo($video_id);
    return new JsonResponse($data); 
  }
  
  /**
   * Delete video.
   *
   * @params request data
   * @return null
   */
  public function deleteVideo($video_id = 0){
    $account = \Drupal::currentUser();
    $uid = $account->id();
    
    // delete video 
    $flag = \Drupal::database()->delete('vmt_videos')->condition('video_id', $video_id)->condition('user_id', $uid)->execute();
    if($flag == 1) {
      \Drupal::database()->delete('vmt_media')->condition('video_id', $video_id)->execute();
      \Drupal::database()->delete('vmt_transition')->condition('video_id', $video_id)->execute();
      \Drupal::database()->delete('vmt_processing_stages')->condition('video_id', $video_id)->execute();
      \Drupal::database()->delete('vmt_cron_job')->condition('video_id', $video_id)->execute();
    }
    
    \Drupal::messenger()->addStatus(t('Video deleted successfully.'));
    return new RedirectResponse(\Drupal::url('videomaker.video.list', ['user' => $uid], ['absolute' => TRUE]));   
  }
  /**
  * custom video page access
  */
  public function access_video($video_id = 0) {
    $account = \Drupal::currentUser();
    if($video_id > 0){
      $query = \Drupal::database()->select('vmt_videos', 'v');
      $query->fields('v');
      $query->condition('v.video_id', $video_id, '=');
      $video = $query->execute()->fetchObject();
      if(empty($video)){
        return false;
      }
      else{
        $owner = $video->user_id;
        $cuid = $account->id();
        $roles = $account->getRoles();
        // user can access own product page
        if($cuid == $owner){
          return true;
        }
        else if(in_array('administrator', $roles)){
          return true;
        }
        else if(!in_array('administrator', $roles)){
          $gid = isset($_GET['team']) ? $_GET['team'] : '';
          $member = \Drupal::service('my_groups.team.service')->getMembersAccess($gid, $cuid, $owner, 'team-video_maker');
          if($member){
            return true;
          }
          return false;
        }
      }
    }
    else {
      return false;
    }
  }

}
