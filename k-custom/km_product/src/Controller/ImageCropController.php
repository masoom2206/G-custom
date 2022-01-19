<?php
 
/**
* @file
* Contains \Drupal\km_product\Controller\ImageCropController.php
*
*/
namespace Drupal\km_product\Controller;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Session\AccountInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Drupal\media\Entity\Media;
use Drupal\file\Entity\File;
use Drupal\image\Entity\ImageStyle;
use Drupal\node\NodeInterface;
use Drupal\taxonomy\Entity\Term;      
use Drupal\Core\Link;
use Drupal\Core\Url;
use Drupal\Core\File\FileSystem;

class ImageCropController extends ControllerBase {
  /**
   * Returns crop image.
   *
   * @return image url
   *   A crop image url.
   *   form kaboodle template.
   */
	public function cropTemplateImage(){
    $account = \Drupal::currentUser();
    $uid = $account->id();
    $imageAttribute = \Drupal::request()->get('image_attribute');
    $image_attribute = json_decode($imageAttribute, true);
    //if(isset($image_attribute['imgsrcCrop'])){
    if($image_attribute['imgMid'] == 2701){
      $cropImageURL = $this->kmBase64CropImage($image_attribute);
    }
    else {
      $cropImageURL = $this->kmCropImage($image_attribute);
    }
    if($cropImageURL){
      $image_attribute['cropImage'] = $cropImageURL;
      //$image_attribute['cropImage'] = $cropImageURL['high'];
      //$image_attribute['cropImageLow'] = $cropImageURL['low'];
    }
		return new JsonResponse($image_attribute);
	}
  /**
   * Callback function kmCropImage()
   * to crop/resize newimage from old image
   */
  public function kmCropImage(array $imageProperties){
    $account = \Drupal::currentUser();
    $uid = $account->id();
    $exportZoom = $imageProperties["exportZoom"];
    $currentZoom = $imageProperties["currentZoom"];
    $scale = ($imageProperties['currentZoom']*100).'%';
    $rotate = $imageProperties['rotation'];
    $path = explode("?", $imageProperties['imageUrl']);
    $path_parts = pathinfo($path[0]);
    $time_stamp = time();
    $filename = $time_stamp.$path_parts['basename'];
    $mime_type = $path_parts['extension'];
    $imgMid = $imageProperties['imgMid'];
    $fabricDPI = (int)$imageProperties['fabricDPI'];
    $fabricDPI = ($fabricDPI == 0) ? 72 : $fabricDPI;
    $generate_recommended_file_name_data = 'temporary://' . $filename;
    $generate_recommended_file_name = \Drupal::service('file_system')->realpath($generate_recommended_file_name_data);
    $filname_path_lower = drupal_realpath(drupal_tempnam('temporary://', 'low_crop_'));
    $selectedImageSize = $imageProperties['selectedImageSize'];
    $ArConstraint = isset($imageProperties['ArConstraint']) ? $imageProperties['ArConstraint'] : 'scale-crop';
    $res = 72 / $fabricDPI;
    $b = explode(" x ", $selectedImageSize);
    if(count($b) != 2){
      $b = explode("x", $selectedImageSize);
    }
    $dimensions = (int)$b[0].'x'.(int)$b[1];
    $width_container = (int)$b[0];
    $height_container = (int)$b[1];
    $width_res = round($width_container/$res);
    $height_res = round($height_container/$res);
    //get original file realpath. that will be modified
    $img_file = '';
    if(empty($imgMid)){
      $image_data = file_get_contents($path[0]);
      $file_path = 'temporary://km-media/';
      if(!empty($image_data) && file_prepare_directory($file_path,  FILE_CREATE_DIRECTORY)){
        $file_path .= $filename;
        file_put_contents($file_path, $image_data);
        $img_file = drupal_realpath($file_path);
      }
    }
    else {
      $media = Media::load($imgMid);
      if (is_object($media)) {
        if ($media->hasField('field_media_image')) {
          $uri = $media->field_media_image->entity->getFileUri();
          $targetid = $media->field_media_image->target_id;
          $file = File::load($targetid);
          $filename = $time_stamp.$file->getFilename();
          $mime_type = pathinfo($filename, PATHINFO_EXTENSION);
          $generate_recommended_file_name_data = 'temporary://' . $filename;
          $generate_recommended_file_name = \Drupal::service('file_system')->realpath($generate_recommended_file_name_data);
          $file_path =  drupal_tempnam('temporary://', 'media_'); 
          if (file_copy($file, $file_path, FILE_EXISTS_REPLACE)) {
            $img_file = drupal_realpath($file_path);
          }
        }
      }
    }
    if($img_file){
      $data = getimagesize($img_file);
      $_actual_image_width  = $data[0];
      $_actual_image_height = $data[1];
      //$dimensions = (int)$data[0].'x'.(int)$data[1];
      //$dimensions = $_actual_image_width.'x'.$_actual_image_height;
      if ($width_container > ($height_container * 2)) {
        $change_w = $_actual_image_width;
      }
      else {
        $new_width_ratio = ($_actual_image_height / $height_container) * $width_container;
        $change_w = $new_width_ratio;
        if ($new_width_ratio > $_actual_image_width) {
          $change_w = $_actual_image_width;
        }
      }
      $dimensionsDPI = '';
      if($_actual_image_width < $width_res || $_actual_image_height < $height_res){
        if($_actual_image_width < $width_res){
          $resize_factor = $_actual_image_width / $width_res;
          $resize_width = $_actual_image_width / $resize_factor;
          $resize_height = $_actual_image_height / $resize_factor;
        }
        else if($_actual_image_height < $height_res){
          $resize_factor = $_actual_image_height / $height_res;
          $resize_width = $_actual_image_width / $resize_factor;
          $resize_height = $_actual_image_height / $resize_factor;
        }
        $width_res = (int)$resize_width;
        $height_res = (int)$resize_height;
        $dimensionsDPI = (int)$resize_width.'x'.(int)$resize_height;
      }
      else {
        $dimensionsDPI = (int)$width_res.'x'.(int)$height_res;
      }
      $xs = (((($width_container/96) *300)*300)/$change_w)*$currentZoom;
      $xx = $xs.'x';
      $bgColor = "#fff";
      $ArConstraint = isset($imageProperties['ArConstraint']) ? $imageProperties['ArConstraint'] : 'scale-crop';
        if ($ArConstraint == 'width') {
          $dimensions_new = $width_container.'x';
          $cmd = "convert -resize $dimensions_new $img_file  -quality 92 -strip -units PixelsPerInch -depth 8 +repage $generate_recommended_file_name";
        } elseif($ArConstraint == 'height') {
          $dimensions_new = 'x'.$height_container;
          $cmd = "convert -resize $dimensions_new $img_file -quality 92 -strip -units PixelsPerInch -depth 8 +repage $generate_recommended_file_name";
        } else {
          if ($imageProperties["offset"]["x"] <= 0 && $imageProperties["offset"]["y"] <= 0 ) {
            //if offset is nagative, then it means larger image need to shrink. Copped operation need to perform
            $offset_x_cropped = abs($imageProperties["offset"]["x"]*$exportZoom);
            $offset_y_cropped = abs($imageProperties["offset"]["y"]*$exportZoom);
            //$cropped = $dimensions.'+'.$offset_x_cropped.'+'.$offset_y_cropped;
            $cropped = $dimensions.'+'.$offset_x_cropped.'+'.$offset_y_cropped;

            
            //$fabricDensity = $fabricDPI.'x'.$fabricDPI;
            if($mime_type == 'jpg' || $mime_type == 'jpeg'){
              //$cmd = "convert -size $dimensions -colorspace RGB $img_file -scale $scale -crop $cropped -units 'PixelsPerInch' -density $fabricDPI $generate_recommended_file_name 2>&1";
              $cmd = "convert -colorspace RGB $img_file -scale $scale -crop $cropped +repage -quality 92 -strip -units PixelsPerInch -density $fabricDPI $generate_recommended_file_name 2>&1";// -sharpen 0x.7
              //$cmd = "convert -size $dimensions xc:$bgColor \( $img_file -rotate $rotate -scale $scale -crop $cropped +repage \) -quality 92 -strip -density $fabricDPI -units PixelsPerInch -geometry +0+0 -composite $generate_recommended_file_name 2>&1";// -sharpen 0x.7
              //$cmd = "convert -size $dimensions xc:$bgColor \( $img_file -rotate $rotate -scale $scale -crop $cropped +repage \) -quality 92 -strip -density $fabricDensity -units PixelsPerInch -geometry +0+0 -composite $generate_recommended_file_name";// -sharpen 0x.7
            }
            else {
              //$cmd = "convert -size $dimensions -colorspace RGB $img_file -scale $scale -crop $cropped -colorspace sRGB -set units 'PixelsPerInch' -density $fabricDPI $generate_recommended_file_name 2>&1";
              $cmd = "convert -size $dimensions xc:$bgColor \( $img_file -rotate $rotate -scale $scale -crop $cropped +repage \) -strip -density $fabricDPI -units PixelsPerInch -geometry +0+0 -composite $generate_recommended_file_name"; 
            }
          }
          else {
            //. If one offset is negative another is Possitive or both positive 
            $geometry = sprintf("%+f",$imageProperties["offset"]["x"]*$exportZoom).sprintf("%+f",$imageProperties["offset"]["y"]*$exportZoom);
            if($mime_type == 'jpg' || $mime_type == 'jpeg'){
              $cmd = "convert -size $dimensions xc:$bgColor  \( $img_file -rotate $rotate -scale $scale +repage \) -quality 92 -strip -units PixelsPerInch -density $fabricDPI -geometry $geometry -composite $generate_recommended_file_name";
            }
            else {
              $cmd = "convert -size $dimensions xc:$bgColor  \( $img_file -rotate $rotate -scale $scale +repage \) -strip -units PixelsPerInch -geometry $geometry -composite $generate_recommended_file_name";
            }
          }
        } 
      /*$offset_x_cropped = abs($imageProperties["offset"]["x"]*$exportZoom);
      $offset_y_cropped = abs($imageProperties["offset"]["y"]*$exportZoom);
      $cropped = $dimensions.'+'.$offset_x_cropped.'+'.$offset_y_cropped;
      //Working >> $cmd = "convert -units PixelsPerInch -size $dimensions $img_file -rotate $rotate -scale $scale -crop $cropped +repage -resample $fabricDPI $generate_recommended_file_name 2>&1";
      $cmd = "convert -size $dimensions $img_file -rotate $rotate -scale $scale -crop $cropped +repage -strip -units PixelsPerInch -density $fabricDPI $generate_recommended_file_name 2>&1";*/
      $executed_commond = exec($cmd, $op);
      \Drupal::logger('km_product')->notice('ImageMagick Command: CMD = @cmd and width_container = @width_container and height_container = @height_container and currentZoom = @currentZoom and exportZoom = @exportZoom and image_width = @_actual_image_width and image_height = @_actual_image_height',
        array(
          '@cmd' => $cmd,
          '@width_container' => $width_container,
          '@height_container' => $height_container,
          '@currentZoom' => $currentZoom,
          '@exportZoom' => $exportZoom,
          '@_actual_image_width' => $_actual_image_width,
          '@_actual_image_height' => $_actual_image_height,
          '@b' => $b[0],
        ));
      //print "<pre>op**";print_r($op);
      sleep(5);
      if ($ArConstraint == 'width') {
        $dimensionsx = $width_container.'x';
      } elseif($ArConstraint == 'height') {
        $dimensionsx = 'x'.$height_container;
      } else {
        if($fabricDPI !== 72 && $dimensionsDPI != ''){
          //$res = 72 / $fabricDPI;
          //$dimensionsDPI = (int)($width_container/$res).'x'.(int)($height_container/$res);
          $generate_fabricDPI = $generate_recommended_file_name;
          $crops = $dimensionsDPI.'+0+0';
          //$xx = $fabricDPI.'x'.$fabricDPI;
          if($width_res > $height_res){
            $xx = $width_res.'x'.$width_res;
          }
          else {
            $xx = $height_res.'x'.$height_res;
          }
          //$cmdDPI = "convert -colorspace RGB $generate_fabricDPI -resize $dimensionsDPI -depth 8 -type palette +repage -quality 92 -strip -units 'PixelsPerInch' -density $fabricDPI $generate_recommended_file_name";
          if($mime_type == 'png'){
            $cmdDPI = "convert -colorspace RGB  $generate_fabricDPI -gravity Center -crop $crops +repage -colorspace sRGB -set units 'PixelsPerInch' -density $fabricDPI -resample $xx $generate_recommended_file_name";
          }else{
            $cmdDPI = "convert -colorspace RGB $generate_fabricDPI -gravity Center -crop $crops +repage -units 'PixelsPerInch' -density $fabricDPI -resample $xx $generate_recommended_file_name";
          }

          $executed_commond = exec($cmdDPI, $op);
          \Drupal::logger('km_product')->notice('ImageMagickDPI Command: @cmd',
            array(
              '@cmd' => $cmdDPI,
            ));
          sleep(5);
        }
        /*$dimensionsx = $width_container.'x'.$height_container;
        $resample = $fabricDPI.'x'.$fabricDPI;
        $generate_recommended_file_name_old = $generate_recommended_file_name;
        $cmdx = "convert $generate_recommended_file_name_old -resample $resample $generate_recommended_file_name";
        $executed_commond = exec($cmdx, $op);
        \Drupal::logger('km_product')->notice('ImageMagick Command: @cmd',
          array(
            '@cmd' => $cmdx,
          ));
        sleep(5);*/
      }
      $fileContent = file_get_contents($generate_recommended_file_name);
      //Save low quality image.
      //$low_image = $this->compress_image($generate_recommended_file_name, $filname_path_lower, $quality = 75);
      //$lowImageContent = file_get_contents($low_image);
      //remove temporary file
      unlink($generate_recommended_file_name);
      if ($fileContent){
        $new_file = 'public://files/'.$uid.'/kmds/images/template_crop_image/' . $filename;
        file_put_contents($new_file, $fileContent);
        $source_original = file_create_url($new_file);
        //$source_original['high'] = file_create_url($new_file);
        /*if ($lowImageContent){
          $filenameExp = explode(".", $filename);
          $filenameLow = $filenameExp[0].'__low.'.$filenameExp[1];
          $new_file_low = 'public://files/'.$uid.'/kmds/images/template_crop_image/' . $filenameLow;
          file_put_contents($new_file_low, $lowImageContent);
          $source_original['low'] = file_create_url($new_file_low);
        }*/
        return $source_original;
      }
      else {
        return 0;
      }
    }
  }
  /**
   * Callback function compress_image()
   * to generate low quality image
   **/
  public function compress_image($source_url, $destination_url, $quality = 75) {
    try {
      $info = getimagesize($source_url);
      if ($info['mime'] == 'image/jpeg')
        $image = @imagecreatefromjpeg($source_url);
      elseif ($info['mime'] == 'image/gif')
        $image = @imagecreatefromgif($source_url);
      elseif ($info['mime'] == 'image/png')
        $image = @imagecreatefrompng($source_url);
      imagejpeg($image, $destination_url, 50);
    }
    catch (ErrorException $ex){
    // Do Nothing
    }
    return $destination_url;
  }
  /**
   * Callback function kmBase64CropImage()
   * to crop/resize newimage from base64 Image
   */
  public function kmBase64CropImage(array $imageProperties){
    global $base_url;
    $curr_date = '';
    $datasrc = $imageProperties['imgsrcCrop'];
    $nodeerify = preg_match('/data:([^;]*);base64,(.*)/', $datasrc, $match);
    if ($nodeerify) {
      $path = explode("?", $imageProperties['imageUrl']);
      $path_parts = pathinfo($path[0]);
      $time_stamp = time();
      $filename = $time_stamp.$path_parts['basename'];
      $data_raw = explode(',', $datasrc);
      $new_file = 'public://imgclean/' . $filename;
      if(isset($imageProperties['selectedImageSize'])){
        $base64_data = base64_decode($data_raw[1]);
        file_put_contents($new_file, $base64_data);
        //image DPI to 300
        $selectedImageSize = $imageProperties['selectedImageSize'];
        $b = explode(" x ", $selectedImageSize);
        if(count($b) != 2){
          $b = explode("x", $selectedImageSize);
        }
        $width_container = (int)$b[0];
        $height_container = (int)$b[1];

        $source_original      = file_create_url($new_file);
        $data                 = getimagesize($source_original);
        $_actual_image_width  = $data[0];
        $_actual_image_height = $data[1];
        $source_temp          = drupal_tempnam('temporary://', 'imagemagick_');
        unlink($source_temp);
        $source_temp .= '.' . pathinfo($source_original, PATHINFO_EXTENSION);
        $source_original = system_retrieve_file($source_original, $source_temp);
        $source          = drupal_realpath($source_original);
        $filname_path         = drupal_realpath(drupal_tempnam('temporary://', 'crop_imagemagick_'));
        if ($width_container > ($height_container * 2)) {
          //croping with aspect to width
          $new_height_ratio = ($_actual_image_width / $width_container) * $height_container;

          $crops            = $_actual_image_width . 'x' . $new_height_ratio . '+0+0';
          $change_w = $_actual_image_width;
        }
        else {
          //croping with aspect to height
          $new_width_ratio = ($_actual_image_height / $height_container) * $width_container;

          $crops           = $new_width_ratio . 'x' . $_actual_image_height . '+0+0';
          $change_w = $new_width_ratio;
          if ($new_width_ratio > $_actual_image_width) {
            //croping with aspect to width
            $new_height_ratio = ($_actual_image_width / $width_container) * $height_container;
            $crops            = $_actual_image_width . 'x' . $new_height_ratio . '+0+0';
            $change_w = $_actual_image_width;
          }
        }
        $xs = ((($width_container/72) *300)*300)/$change_w;
        $xx = $xs.'x';
        $cmd = "convert -colorspace RGB $source -gravity Center -crop $crops -units 'PixelsPerInch' -density 300 -resample $xx $filname_path";
        exec($cmd, $op);
        \Drupal::logger('km_product')->notice('ImageMagickDPI Command: @cmd',
          array(
            '@cmd' => $cmd,
          ));
        sleep(5);
        $fileContent = file_get_contents($filname_path);
        if ($fileContent){
          $new_file = 'public://files/'.$uid.'/kmds/images/template_crop_image/' . $filename;
          file_put_contents($new_file, $fileContent);
          $source_original = file_create_url($new_file);
          return $source_original;
        }
        else {
          return 0;
        }
        unlink($source);
        unlink($filname_path);
      }
    }
    else {
      return $datasrc;
    }
  }
}
