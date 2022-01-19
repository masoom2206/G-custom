<?php

namespace Drupal\media_vault_tool\Controller;

use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\DependencyInjection\Exception\InvalidArgumentException;
use Drupal\node\NodeInterface;
use Drupal\media\Entity\Media;
use Drupal\node\Entity\Node;
use Drupal\file\Entity\File;
use Drupal\file\Entity;
use Drupal\getid3\getid3_load;
use Drupal\getid3\getid3_analyze;
use Drupal\Core\Url;
use Drupal\imagemagick;

/**
 * Plupload upload handling route.
 */
class UploadController implements ContainerInjectionInterface {
  
  /**
   * The current request.
   *
   * @var \Symfony\Component\HttpFoundation\Request $request
   *   The HTTP request object.
   */
  protected $request;

  /**
   * Stores temporary folder URI.
   *
   * This is configurable via the configuration variable. It was added for HA
   * environments where temporary location may need to be a shared across all
   * servers.
   *
   * @var string
   */
  protected $temporaryUploadLocation;

  /**
   * Filename of a file that is being uploaded.
   *
   * @var string
   */
  protected $filename;

  /**
   * Originalname of a file that is being uploaded.
   *
   * @var string
   */
  private $originalName;
  /**
   * Constructs plupload upload controller route controller.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   Request object.
   */
  public function __construct(Request $request) {
    $this->request = $request;
    $this->temporaryUploadLocation = 'temporary://';
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static($container->get('request_stack')->getCurrentRequest());
  }

  /**
   * Handles Plupload uploads.
   */
  public function handleMediaUploads(NodeInterface $node, $m_type, $file_owner) {
    // @todo: Implement file_validate_size();
		$result = null;
    try {
      $this->prepareTemporaryUploadDestination();
      $result = $this->handleUpload($node, $m_type, $file_owner);
    }
    catch (UploadException $e) {
      return $e->getErrorResponse();
    }

    // Return JSON-RPC response.
    return new JsonResponse($result);
  }
    /**
   * Handles Plupload uploads public.
   */
  public function handleMediaUploadsPublic() {
    // @todo: Implement file_validate_size();
		$result = null;
    try {
      $this->prepareTemporaryUploadDestination();
      $result = $this->handleUploadPublic();
    }
    catch (UploadException $e) {
      return $e->getErrorResponse();
    }

    // Return JSON-RPC response.
    return new JsonResponse($result);
  }

  /**
   * Prepares temporary destination folder for uploaded files.
   *
   * @return bool
   *   TRUE if destination folder looks OK and FALSE otherwise.
   *
   * @throws \Drupal\plupload\UploadException
   */
  protected function prepareTemporaryUploadDestination() {
    $writable = file_prepare_directory($this->temporaryUploadLocation, FILE_CREATE_DIRECTORY);
    if (!$writable) {
      throw new UploadException(UploadException::DESTINATION_FOLDER_ERROR);
    }

    // Try to make sure this is private via htaccess.
    file_save_htaccess($this->temporaryUploadLocation, TRUE);
  }

  /**
   * Reads, checks and return filename of a file being uploaded.
   *
   * @throws \Drupal\plupload\UploadException
   */
  protected function getFilename() {
    if (empty($this->filename)) {
      try {
        // @todo this should probably bo OO.
        $this->filename = _plupload_fix_temporary_filename($this->request->request->get('name'));
      }
      catch (InvalidArgumentException $e) {
        throw new UploadException(UploadException::FILENAME_ERROR);
      }

      // Check the file name for security reasons; it must contain letters, numbers
      // and underscores followed by a (single) ".tmp" extension. Since this check
      // is more stringent than the one performed in plupload_element_value(), we
      // do not need to run the checks performed in that function here. This is
      // fortunate, because it would be difficult for us to get the correct list of
      // allowed extensions to pass in to file_munge_filename() from this point in
      // the code (outside the form API).
      if (!preg_match('/^\w+\.tmp$/', $this->filename)) {
        throw new UploadException(UploadException::FILENAME_ERROR);
      }
    }

    return $this->filename;
  }

  public function getClientOriginalName() {
    return $this->originalName;
  }
  
  /**
   * Format to hh:mm:ss
   */
  public function format_duration($duration){

    // The base case is A:BB
    if(strlen($duration) == 4){
        return "00:0" . $duration;
    }
    // If AA:BB
    else if(strlen($duration) == 5){
        return "00:" . $duration;
    }   // If A:BB:CC
    else if(strlen($duration) == 7){
        return "0" . $duration;
    }
  }
  /**
   * Convert bytes to kilobytes.
   */
  public function getFormatedFileSize($filesize) {
    $units = array('KB','MB','GB','TB','PB','EB','ZB','YB');
    $bytes = $filesize;
    if($bytes <= 0){
      $bytes = number_format($bytes, 2, '.', '') . " bytes";
    }else{
      $bytes = number_format($bytes / 1024, 2, '.', '');
      for($i = 0; $i < count($units); $i++){
        if (number_format($bytes, 2, '.', '') >= 1024) {
          $bytes = number_format($bytes / 1024, 2, '.', '');
        }
        else {
          $bytes = number_format($bytes, 2, '.', '');
          break;
        }
      }
      $bytes = $bytes .' '. $units[$i];
    }
    return $bytes;
  }
  /**
   * Handles multipart uploads public.
   *
   * @throws \Drupal\plupload\UploadException
   */ 
  protected function handleUploadPublic(){
	    /* @var $multipart_file \Symfony\Component\HttpFoundation\File\UploadedFile */
		$is_multipart = strpos($this->request->headers->get('Content-Type'), 'multipart') !== FALSE;
		// If this is a multipart upload there needs to be a file on the server.
		if ($is_multipart) {
		  //$multipart_file = $this->request->files->get('file');
				
		  $multipart_file = $this->request->files->get('file', array());
				//print_r($multipart_file);
		  // TODO: Not sure if this is the best check now.
		  // Originally it was:
		  if(is_array($multipart_file)){
					if (empty($multipart_file['tmp_name']) || !is_uploaded_file($multipart_file['tmp_name'])) {
						throw new UploadException(UploadException::MOVE_ERROR);
					}
				} else {
					if (!$multipart_file->getPathname() || !is_uploaded_file($multipart_file->getPathname())) {
						throw new UploadException(UploadException::MOVE_ERROR);
					}
				}
		}

		// Open temp file.
		if (!($out = fopen($this->temporaryUploadLocation . $this->getFilename(), $this->request->request->get('chunk', 0) ? 'ab' : 'wb'))) {
		  throw new UploadException(UploadException::OUTPUT_ERROR);
		}

		// Read binary input stream.
		$input_uri = $is_multipart ? $multipart_file->getRealPath() : 'php://input';
		if (!($in = fopen($input_uri, 'rb'))) {
		  throw new UploadException(UploadException::INPUT_ERROR);
		}

		// Append input stream to temp file.
		while ($buff = fread($in, 4096)) {
		  fwrite($out, $buff);
		}

		// Be nice and keep everything nice and clean.
		fclose($in);
		fclose($out);
		$destin = 'public://converter/';
		\Drupal::service('file_system')->prepareDirectory($destin, \Drupal\Core\File\FileSystemInterface::CREATE_DIRECTORY);
		$name = $this->request->files->get('file')->getClientOriginalName();
			$ext_str = explode('.', $name);
			$ext_format = end($ext_str);
			if($ext_format == 'tif' || $ext_format == 'tiff'){
				//echo $ext_format;
				$end_key = end(array_keys($ext_str, end($ext_str)));
				$ext_str[$end_key] = 'png';
				$name = implode(".",$ext_str);
			}
		$destination = $destin.$name; 
        $file_content = file_get_contents($multipart_file->getPathname());
        $file = file_save_data($file_content, $destination, FILE_EXISTS_RENAME);
        $file_path = $file->getFileUri();
        list($width, $height) = getimagesize($file_path); 
        		
        $response = ['fid' => $file->id(), 'fileSize'=> $this->getFormatedFileSize($file->get('filesize')->getValue()[0]['value']), 'extension'=> $ext_format, 'dimension'=> $width .'x'. $height.'px'  ,'file_name' => $name, 'url' => file_create_url($file->getFileUri())];
        
		// Return JSON-RPC response.
       return $response;		
  }
   
  /**
   * Handles multipart uploads.
   *
   * @throws \Drupal\plupload\UploadException
   */
  protected function handleUpload($node, $m_type, $file_owner) {
    /* @var $multipart_file \Symfony\Component\HttpFoundation\File\UploadedFile */
    $is_multipart = strpos($this->request->headers->get('Content-Type'), 'multipart') !== FALSE;
    // If this is a multipart upload there needs to be a file on the server.
    if ($is_multipart) {
      //$multipart_file = $this->request->files->get('file');
			
      $multipart_file = $this->request->files->get('file', array());
			//print_r($multipart_file);
      // TODO: Not sure if this is the best check now.
      // Originally it was:
      if(is_array($multipart_file)){
				if (empty($multipart_file['tmp_name']) || !is_uploaded_file($multipart_file['tmp_name'])) {
					throw new UploadException(UploadException::MOVE_ERROR);
				}
			} else {
				if (!$multipart_file->getPathname() || !is_uploaded_file($multipart_file->getPathname())) {
					throw new UploadException(UploadException::MOVE_ERROR);
				}
			}
    }

    // Open temp file.
    if (!($out = fopen($this->temporaryUploadLocation . $this->getFilename(), $this->request->request->get('chunk', 0) ? 'ab' : 'wb'))) {
      throw new UploadException(UploadException::OUTPUT_ERROR);
    }

    // Read binary input stream.
    $input_uri = $is_multipart ? $multipart_file->getRealPath() : 'php://input';
    if (!($in = fopen($input_uri, 'rb'))) {
      throw new UploadException(UploadException::INPUT_ERROR);
    }

    // Append input stream to temp file.
    while ($buff = fread($in, 4096)) {
      fwrite($out, $buff);
    }

    // Be nice and keep everything nice and clean.
    fclose($in);
    fclose($out);
    $destin = 'public://';
    $name = $this->request->files->get('file')->getClientOriginalName();
		$ext_str = explode('.', $name);
		$ext_format = end($ext_str);
		if($ext_format == 'tif' || $ext_format == 'tiff'){
			//echo $ext_format;
			$end_key = end(array_keys($ext_str, end($ext_str)));
			$ext_str[$end_key] = 'png';
			$name = implode(".",$ext_str);
		}
    $destination = $destin.$name;
		/* switch ($ext_format) {
			case 'tif':
				echo $ext_format;
				//$tif_to_png = Image::make('full/path/to/image.tiff')->encode('png')->save('path/to/saved/image.png');
				$command = "convert ".$name." ".$destin;
				exec($command);
				echo $command;
				break;
				
			case 'tiff':
				echo $ext_format;
				echo'<br>';
				$tif_to_png = new Imagick($name);
				$tif_to_png->setImageFormat('png');
				echo $tif_to_png; *
				$command = "convert ".$name." ".$destin;
				exec($command);
				echo $command;
				
				break;
					
			case 'heic':
				echo $ext_format;
				echo'<br>';
				$tif_to_png = new Imagick($name);
				$tif_to_png->setImageFormat('png');
				echo $tif_to_png;
				break;
					
			case 'heif':
				echo $ext_format;
				echo'<br>';
				$tif_to_png = new Imagick($name);
				$tif_to_png->setImageFormat('png');
				echo $tif_to_png;
				break; 
		}*/
		//exit;
    $file_content = file_get_contents($multipart_file->getPathname());
    $file = file_save_data($file_content, $destination, FILE_EXISTS_RENAME);
    $file_path = $file->getFileUri();
    //$wrapper = \Drupal::service('stream_wrapper_manager')->getViaUri($file_path);
    //$file_s3_path = $wrapper->getExternalUrl();

    // Initialize getID3 tag-writing module. NOTE: Their wanky dependency setup
    // requires that this file must be included AFTER an instance of the getID3
    // class has been instantiated.
    $id3file = NULL;
    $id3_lib_availability = getid3_load();
    if($id3_lib_availability == FALSE){
      drupal_set_message(t("The getid3() module cannot find the getID3 library used to read and write ID3 tags. The site administrator will need to verify that it is installed and then update the <a href='!admin-settings-audio-getid3'>settings</a>.", array('!admin-settings-audio-getid3' => Url::fromRoute('getid3.config'))), 'error', FALSE);
      return $id3file;
    }
    $id3file = getid3_analyze($file_path);
    $pathinfo = pathinfo($id3file['filenamepath']);
    $str = $pathinfo['extension'];  
		$str = explode('.', $str);
		$extName = end($str);
		
		//get default Media kit node id
		$media_kit = \Drupal::database()->select('node__field_default_media_kit', 'k');
		$media_kit->condition('k.entity_id', $node->id(), '=');
		$media_kit->condition('k.bundle', 'media_vault', '=');
		$media_kit->fields('k', ['field_default_media_kit_target_id']);
		$default_kit = $media_kit->execute()->fetchField();
		$media_id = $media_name = '';
		$kit = Node::load($default_kit);

    if($m_type == 'audio'){
      $sample_rate_tid = '';
      if(isset($id3file['audio']['sample_rate']) && $id3file['audio']['sample_rate'] == 44100 ){
        $sample_rate_tid = 65;
      }if(isset($id3file['audio']['sample_rate']) && $id3file['audio']['sample_rate'] == 48000 ){
        $sample_rate_tid = 66;
      }if(isset($id3file['audio']['sample_rate']) && $id3file['audio']['sample_rate'] == 32000 ){
        $sample_rate_tid = 67;
      }if(isset($id3file['audio']['sample_rate']) && $id3file['audio']['sample_rate'] == 22050 ){
        $sample_rate_tid = 72;
      }if(isset($id3file['audio']['sample_rate']) && $id3file['audio']['sample_rate'] == 11025 ){
        $sample_rate_tid = 74;
      }if(isset($id3file['audio']['sample_rate']) && $id3file['audio']['sample_rate'] == 8000 ){
        $sample_rate_tid = 75;
      }if(isset($id3file['audio']['sample_rate']) && $id3file['audio']['sample_rate'] == 16000 ){
        $sample_rate_tid = 73;
      }if(isset($id3file['audio']['sample_rate']) && $id3file['audio']['sample_rate'] == 80000){
        $sample_rate_tid = 231;
      }if(isset($id3file['audio']['sample_rate']) && $id3file['audio']['sample_rate'] == 88200){
        $sample_rate_tid = 68;
      }if(isset($id3file['audio']['sample_rate']) && $id3file['audio']['sample_rate'] == 96000 ){
        $sample_rate_tid = 69;
      }if(isset($id3file['audio']['sample_rate']) && $id3file['audio']['sample_rate'] == 176400){
        $sample_rate_tid = 70;
      }if(isset($id3file['audio']['sample_rate']) && $id3file['audio']['sample_rate'] == 192000 ){
        $sample_rate_tid = 71;
      }if(isset($id3file['audio']['sample_rate']) && $id3file['audio']['sample_rate'] == 352800 ){
        $sample_rate_tid = 229;
      }if(isset($id3file['audio']['sample_rate']) && $id3file['audio']['sample_rate'] == 384000 ){
        $sample_rate_tid = 230;
      }
      $media_file = Media::create([
        'bundle' => 'audio',
        'name' => $name,
        'field_media_audio_file' => [
          'target_id' => $file->id(),
          'display' => true,
        ],
				'field_media_source_type' => [
          'value' => 'uploaded',
        ],
        'field_file_size' => [
          'value' => $this->getFormatedFileSize($file->get('filesize')->getValue()[0]['value']),
        ],
        'field_format' => [
          'value' => '.'.$extName,
        ],
        'field_duration' => [
          'value' => isset($id3file['playtime_string']) ? $this->format_duration($id3file['playtime_string']) : '',
        ],
        'field_sample_rate' => [
          'target_id' => $sample_rate_tid,
        ],
        'field_bit_rate' => [
          'value' => isset($id3file['audio']['bitrate']) ? round($id3file['audio']['bitrate'] / 1000).' kbps' : '',
        ],
        'field_bit_depth' => [
          'value' => isset($id3file['audio']['bits_per_sample']) ? $id3file['audio']['bits_per_sample'] . '-bit' : '',
        ],
      ]);
			$media_file->uid = $file_owner;
      $media_file->save();
      $node->get('field_vault_audio')->appendItem([
        'target_id' => $media_file->id(),
      ]);
      $node->save();
			$kit->get('field_vault_audio')->appendItem([
        'target_id' => $media_file->id(),
      ]);
			$kit->uid = $file_owner;
      $kit->save();
			$media_id = $media_file->id();
			$media_name = $name;
			//print_r($media_file);
    }else if($m_type == 'image'){      
      list($width, $height) = getimagesize($file_path); 
      //1 pixel (X) = 0.0104166667 in
      //1 in = 96 pixel (X)
      //Example: convert 15 pixel (X) to in:
      //15 pixel (X) = 15 × 0.0104166667 in = 0.15625 in
      
      // for DPI
      // Horizontal dpi formula = width in pixel * width in inch
      // Vertical dpi formula = height in pixel * height in inch
      
      // for PPI 
      //diagonal = √[(width)2 + (height)2]
      //PPI = diagonal in pixels / diagonal in inches
      /* $diagonal = sqrt(pow($width, 2) + pow($height, 2));
      $diagonal_inch = $diagonal * 0.0104166667;
      $ppi = $diagonal / $diagonal_inch; */
      
      if($id3file['video']['dataformat'] == 'png') {
        if(isset($id3file['png']['IHDR']['raw']['bit_depth'])){
          $bit_depth = $id3file['png']['IHDR']['raw']['bit_depth'] . '-bit';
        }
      }
      if($id3file['video']['dataformat'] == 'jpg' || $id3file['video']['dataformat'] == 'jpeg') {
        $bit_depth = isset($id3file['video']['bits_per_sample']) ? $id3file['video']['bits_per_sample'] . '-bit' : '';
      }
      $media_image = Media::create([
        'bundle' => 'image',
        'name' => $name,
        'field_media_image' => [
          'target_id' => $file->id(),
          'display' => true,
        ],
				'field_media_source_type' => [
          'value' => 'uploaded',
        ],
        'field_file_size' => [
          'value' => $this->getFormatedFileSize($file->get('filesize')->getValue()[0]['value']),
        ],
        'field_format' => [
          'value' => '.'.$extName,
        ],
        'field_pixel_dimentions' => [
          'value' => $width . ' px x ' . $height . ' px',
        ],
        'field_bit_depth' => [
          'value' => $bit_depth,
        ],
      ]);
			$media_image->uid = $file_owner;
      $media_image->save();
      $node->get('field_vault_photo')->appendItem([
        'target_id' => $media_image->id(),
      ]);
      $node->save();
			$kit->get('field_vault_photo')->appendItem([
        'target_id' => $media_image->id(),
      ]);
			$kit->uid = $file_owner;
      $kit->save();
			$media_id = $media_image->id();
			$media_name = $name;
    }else if($m_type == 'text'){
      $media_file = Media::create([
        'bundle' => 'text',
        'name' => $name,
        'field_media_file' => [
          'target_id' => $file->id(),
          'display' => true,
        ],
				'field_media_source_type' => [
          'value' => 'uploaded',
        ],
        'field_file_size' => [
          'value' => $this->getFormatedFileSize($file->get('filesize')->getValue()[0]['value']),
        ],
        'field_format' => [
          'value' => '.'.$extName,
        ]
      ]);
			$media_file->uid = $file_owner;
      $media_file->save();
      $node->get('field_vault_file')->appendItem([
        'target_id' => $media_file->id(),
      ]);
      $node->save();
			$kit->get('field_vault_file')->appendItem([
        'target_id' => $media_file->id(),
      ]);
			$kit->uid = $file_owner;
      $kit->save();
			$media_id = $media_file->id();
			$media_name = $name;
    }else if($m_type == 'video'){
      $vw_dimention = isset($id3file['video']['resolution_x']) ? $id3file['video']['resolution_x'] . ' px ' : '';
      $vh_dimention = isset($id3file['video']['resolution_y']) ? $id3file['video']['resolution_y'] . 'x px' : '';
      $audio_format = '';
      $field_codec = '';
      if(isset($id3file['audio']['codec'])){
        $audio_format = explode(' ', $id3file['audio']['codec']);
      }
      if(isset($id3file['video']['fourcc_lookup'])){
        $field_codec = explode('/', $id3file['video']['fourcc_lookup']);
      }
      $media_file = Media::create([
        'bundle' => 'video',
        'name' => $name,
        'field_media_video_file' => [
          'target_id' => $file->id(),
          'display' => true,
        ],
				'field_media_source_type' => [
          'value' => 'uploaded',
        ],
        'field_file_size' => [
          'value' => $this->getFormatedFileSize($file->get('filesize')->getValue()[0]['value']),
        ],
        'field_format' => [
          'value' => '.'.$extName,
        ],
        'field_pixel_dimentions' => [
          'value' => $vw_dimention . $vh_dimention,
        ],
        'field_duration' => [
          'value' => isset($id3file['playtime_string']) ? $this->format_duration($id3file['playtime_string']) : '',
        ],
        'field_frames_per_second' => [
          'value' => isset($id3file['video']['frame_rate']) ? $id3file['video']['frame_rate'] : '',
        ],
        'field_audio_format' => [
          'value' => isset($audio_format) ? $audio_format[2] : '',
        ],
        'field_codec' => [
          'value' => isset($field_codec) ? $field_codec[0] : '',
        ],
      ]);
			$media_file->uid = $file_owner;
      $media_file->save();
      $node->get('field_vault_video')->appendItem([
        'target_id' => $media_file->id(),
      ]);
      $node->save();
			$kit->get('field_vault_video')->appendItem([
        'target_id' => $media_file->id(),
      ]);
			$kit->uid = $file_owner;
      $kit->save();
			$media_id = $media_file->id();
			$media_name = $name;
    }
    if ($is_multipart) {
      drupal_unlink($multipart_file->getRealPath());
    }
		$response = ['fid' => $file->id(), 'file_name' => $name, 'media_id' => $media_id, 'media_name' => $media_name];

		// Return JSON-RPC response.
    return $response;
  }
  
}

