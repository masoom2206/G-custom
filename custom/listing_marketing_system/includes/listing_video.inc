<?php
/**
 * Callback function cbone_listing_video()
 * to displayed the listing document
 * @return $output
 **/
function cbone_listing_video($nid){		
	global $user, $base_url;
	$output = '';
	$photos = array();
	$x = 0;
	$listing_node = node_load($nid);

	$marketing_concierge = 0;
	$order_id = db_select("field_data_field_lms_listing_reference", 'lr');
	$order_id->fields('lr', array('entity_id'));
	$order_id->condition('lr.entity_type', 'commerce_order', 'LIKE');
	$order_id->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$result = $order_id->execute()->fetchField();
	if($result != NULL){
		$order = commerce_order_load($result);
		$line_item = commerce_line_item_load($order->commerce_line_items['und']['0']['line_item_id']);
		$product = commerce_product_load($line_item->commerce_product['und']['0']['product_id']);
		if($product->sku != 'LMS-04') {
			$marketing_concierge = 1;
			cbone_auto_generated_mc_slide_image($nid);
		}
		else {
			cbone_auto_generated_slide_image($nid);
		}
	}
	else{
		cbone_auto_generated_slide_image($nid);
	}
	//Listing Address
	$address = array();
	if(isset($listing_node->field_lms_listing_address['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_listing_address['und']['0']['value'];
	}
	if(isset($listing_node->field_lms_address_unit['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_address_unit['und']['0']['value'];
	}
	if(isset($listing_node->field_lms_listing_city['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_listing_city['und']['0']['value'];
	}
	if(isset($listing_node->field_lms_listing_state['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_listing_state['und']['0']['value'];
	}
	if(isset($listing_node->field_lms_listing_zip['und']['0']['value'])) {
		$address[] = $listing_node->field_lms_listing_zip['und']['0']['value'];
	}
	$listing_address = implode(', ', $address);
		
	//Listing Photos
	$photos = array();
	$x = 0;
	$lms_photo_nid = db_select("field_data_field_lms_listing_reference", 'lr');
	$lms_photo_nid->fields('lr', array('entity_id'));
	$lms_photo_nid->condition('lr.entity_type', 'node', 'LIKE');
	$lms_photo_nid->condition('lr.bundle', 'lms_photos', 'LIKE');
	$lms_photo_nid->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$photo_nid = $lms_photo_nid->execute()->fetchField();
	$photo_node = node_load($photo_nid);
	$lms_video_nid = db_select("field_data_field_lms_listing_reference", 'lr');
	$lms_video_nid->fields('lr', array('entity_id'));
	$lms_video_nid->condition('lr.entity_type', 'node', 'LIKE');
	$lms_video_nid->condition('lr.bundle', 'lms_video', 'LIKE');
	$lms_video_nid->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$video_nid = $lms_video_nid->execute()->fetchField();
	$video_node = node_load($video_nid);
	//youtube video upload status
	$status='YouTube video has been not completed or posted for this listing.';
	if( !empty($video_node->field_you_tube_url) ){
		$url = parse_str( parse_url( $video_node->field_you_tube_url['und'][0]['value'], PHP_URL_QUERY ), $vars);
		$video_id= $vars['v'];
		$status =l("https://www.youtube.com/watch?v=$video_id", "https://www.youtube.com/watch?v=$video_id");
		
		include_once DRUPAL_ROOT . '/includes/locale.inc';
		$token = variable_get('youtube_uploader_token', array());
		$key=json_encode($token);
		
		$app_name = variable_get('youtube_uploader_app_name');
		$client_id = variable_get('youtube_uploader_client_id');
		$client_secret = variable_get('youtube_uploader_client_secret');
		
		module_load_include('php', 'listing_marketing_system', 'Google/autoload');
		module_load_include('php', 'listing_marketing_system', 'Google/Client');
		module_load_include('php', 'listing_marketing_system', 'Google/Service/YouTube');
		
		// Try to load the library and check if that worked.
		$client = new Google_Client();
		$client->setApplicationName($app_name);
		$client->setClientId($client_id);
		$client->setClientSecret($client_secret);
		$client->setAccessType('offline');
		$client->setAccessToken($key);
	   
		$youtube = new Google_Service_YouTube($client);
		$listResponse = $youtube->videos->listVideos("processingDetails", array('id'=>$video_id));
		if(!empty($listResponse['items'][0]['processingDetails']['processingStatus']) ){
				if($listResponse['items'][0]['processingDetails']['processingStatus'] == 'processing'){
					$status ='Your video has been uploaded to YouTube. It may take a few minutes before it is ready. Return to this screen later or refresh it in a few minutes.';
				}
				else if($listResponse['items'][0]['processingDetails']['processingStatus'] == 'succeeded'){
					$status =l("https://www.youtube.com/watch?v=$video_id", "https://www.youtube.com/watch?v=$video_id");
				}
		}
		else{
				unset($video_node->field_post_to_you_tube['und']);
				unset($video_node->field_you_tube_url['und']);
				node_save($video_node);
				$status ='Video was not uploaded properly. Try again.';
		}
	}

	$items = field_get_items('node', $photo_node, 'field_lms_listing_photos');
	$item_count = count($items);

	//$filename_first = 'public://lms/'.$listing_node->nid.'/video/slide-first.jpg';
	//$slide_first = file_create_url($filename_first);
	$slide_first = $base_url.'/sites/default/files/lms/'.$listing_node->nid.'/video/slide-first.jpg';
	
	foreach ($items as $delta => $item) {
		$listing_photos = field_collection_field_get_entity($item);
		$photos[$x]['item_id'] = $item['value'];     //$listing_photos->item_id;
		$photos[$x]['delta'] = $delta;
		$photos[$x]['revision_id'] = $item['revision_id'];   //$listing_photos->revision_id;
		
		$image = array(
			'style_name' => 'my_listing_160x110',
			'path' => $listing_photos->field_lms_listing_photo['und']['0']['uri'],
			'title' => $listing_photos->field_lms_listing_photo['und']['0']['filename']
		);
		$photos[$x]['photo'] = theme('image_style', $image);
		$photos[$x]['fid'] = $listing_photos->field_lms_listing_photo['und']['0']['fid'];
		$photos[$x]['photo_url'] = file_create_url($listing_photos->field_lms_listing_photo['und']['0']['uri']);
		$photos[$x]['photo_name'] = $listing_photos->field_lms_listing_photo['und']['0']['filename'];
		$x++;
	}
	$slide_second = $base_url.'/sites/default/files/lms/'.$listing_node->nid.'/video/slide-second.jpg';
	//$filename_second = 'public://lms/'.$listing_node->nid.'/video/slide-second.jpg';
	//$slide_second = file_create_url($filename_second);
	
	$video_data = '';
	if(isset($video_node->field_lms_listing_video['und']['0']['fid'])) {
		$video_data = $video_node->field_lms_listing_video['und']['0']['fid'];
	}
	
	$variables = array(
		'listing_address' => $listing_address,
		'photos' => $photos,
		'listing_nid' => $nid,
		'listing_uid' => $listing_node->uid,
		'slide_first' => $slide_first,
		'slide_second' => $slide_second,
		'video_data' => $video_data,
		'marketing_concierge' => $marketing_concierge,
		'video_nid'=> $video_nid,
		'status'=> $status,
	);
	$output = theme('listing_video', array('var_name' => $variables));
	return $output;
}

/**
 * Callback function cbone_listing_video_create()
 * to create slide video by listing photos
 * @return TRUE
 **/
function cbone_listing_video_create_test(){
	$vrealpath = drupal_realpath("public://lms/video");
	 
	 $cmd="/usr/local/bin/ffmpeg -i $vrealpath/new_intro_outro/previewsOutroWithSound.m4v -s 1280x720 -c:v libx264 -r 25 -pix_fmt yuvj420p -strict -2 -an $vrealpath/new_intro_outro/without_sound_preview_outro.mp4 2>&1";
	 exec($cmd,$op);
	 
	 $cmd="/usr/local/bin/ffmpeg -i $vrealpath/new_intro_outro/previewsOutroWithSound.m4v -vn -acodec copy $vrealpath/new_intro_outro/temp/outro/out.m4a 2>&1";
	 //exec($cmd,$op);
	 
	 $cmd="/usr/local/bin/ffmpeg -i $vrealpath/new_intro_outro/previewsOutroWithSound.m4v -vf fps=25 $vrealpath/new_intro_outro/temp/outro/images/img%04d.jpg 2>&1";
	 //exec($cmd,$op);
	 
	$cmd="/usr/local/bin/ffmpeg -i $vrealpath/new_intro_outro/temp/outro/images/img%04d.jpg -i $vrealpath/new_intro_outro/temp/out.m4a -s 1280x720 -c:v libx264 -r 25 -pix_fmt yuv420p -c:a copy -shortest $vrealpath/new_intro_outro/temp/outro/out1.mp4 2>&1";
	 	
	$fids = array('first', '00000.jpg', '00001.jpg', '00002.jpg', 'last');
	$x = 1;
	$filesname = ''; 
	foreach($fids as $fid){
		if($fid == 'first') {
			$name_first = 'slide-first.jpg';
			$filepath = 'public://lms/test/'.$name_first;
		}
		elseif($fid == 'last') {
			$name_second = 'slide-second.jpg';
			$filepath = 'public://lms/test/'.$name_second;
		}
		else {
			$filepath = 'public://lms/test/'.$fid;
		}
		
		$temp_folder = 'public://lms/test/temp/';
		file_prepare_directory($temp_folder, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);
		//Get the file
		$content = file_get_contents($filepath);
		//Store in the filesystem.
		$num_padded = sprintf("%05d", $x);
		$filename = $temp_folder.$num_padded.'.jpg';
		$imagerealpath = drupal_realpath($filename);
		$fp = fopen($imagerealpath, "w");
		fwrite($fp, $content);
		fclose($fp);
		
		//print $realpath;
		$cmd = "/usr/local/bin/ffmpeg -resize 1280x720 -vf \"format=yuv420p[v]\" $imagerealpath 2>&1";
		exec($cmd,$op);
		
		$temp_folders = 'public://lms/test/';
		$realpaths = drupal_realpath($temp_folders);
		
		$morph_temp_folder = "public://lms/test/temp/m_$num_padded/";
		file_prepare_directory($morph_temp_folder, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);
					
		if($fid == 'first' || $fid == 'last') {
			$cmd = "convert $imagerealpath -delay 2 -morph 2 $realpaths/temp/m_$num_padded/%04d.jpg 2>&1";
			exec($cmd,$op); 
		
			$cmd = "/usr/local/bin/ffmpeg -r 1/5 -i $realpaths/temp/m_$num_padded/%04d.jpg -s 1280x720 -c:v libx264 -r 25 -pix_fmt yuvj420p -q:v 1 $realpaths/temp/m_$num_padded/slide_$num_padded.mp4 2>&1";
			exec($cmd,$op);
			
			$cmd = "/usr/local/bin/ffmpeg -i $realpaths/temp/m_$num_padded/slide_$num_padded.mp4 -y -vf \"fade=in:0:3:d=1:alpha=1\" $realpaths/temp/m_$num_padded/slide_fade_in_$num_padded.mp4 2>&1";
			exec($cmd,$op);
			
			$cmd = "/usr/local/bin/ffmpeg -i $realpaths/temp/m_$num_padded/slide_fade_in_$num_padded.mp4 -y -vf \"fade=out:122:3:d=1:alpha=1\" $realpaths/temp/$num_padded.mp4 2>&1";
			exec($cmd,$op);
			
		}
		else {
			if($x % 2 === 0 ){
				
				$cmd = "/usr/local/bin/ffmpeg -i $imagerealpath -vf \"scale=hd720,zoompan=z='min(zoom+0.0015,1.5)':d=125:x='iw/2-((iw/zoom)*2)':y='ih/2-((ih/zoom)*2)'\" -c:v libx264 -pix_fmt yuvj420p $realpaths/temp/m_$num_padded/slide_$num_padded.mp4 2>&1";
				exec($cmd,$op);
				
				$cmd = "/usr/local/bin/ffmpeg -i $realpaths/temp/m_$num_padded/slide_$num_padded.mp4 -y -vf \"fade=in:0:3:d=1:alpha=1\" $realpaths/temp/m_$num_padded/slide_fade_in_$num_padded.mp4 2>&1";
				exec($cmd,$op);
				
				$cmd = "/usr/local/bin/ffmpeg -i $realpaths/temp/m_$num_padded/slide_fade_in_$num_padded.mp4 -y -vf \"fade=out:122:3:d=1:alpha=1\" $realpaths/temp/$num_padded.mp4 2>&1";
				exec($cmd,$op);
			}
			else{
				
				$cmd = "convert $imagerealpath -delay 2 -morph 2 $realpaths/temp/m_$num_padded/%04d.jpg 2>&1";
				exec($cmd,$op);
				
				$cmd = "/usr/local/bin/ffmpeg -r 1/5 -i $realpaths/temp/m_$num_padded/%04d.jpg -s 1280x720 -c:v libx264 -r 25 -pix_fmt yuvj420p -q:v 1 $realpaths/temp/m_$num_padded/slide_$num_padded.mp4 2>&1";
				exec($cmd,$op);
			
				$cmd = "/usr/local/bin/ffmpeg -i $realpaths/temp/m_$num_padded/slide_$num_padded.mp4 -y -vf \"fade=in:0:3:d=1:alpha=1\" $realpaths/temp/m_$num_padded/slide_fade_in_$num_padded.mp4 2>&1";
				exec($cmd,$op);
				
				$cmd = "/usr/local/bin/ffmpeg -i $realpaths/temp/m_$num_padded/slide_fade_in_$num_padded.mp4 -y -vf \"fade=out:122:3:d=1:alpha=1\" $realpaths/temp/$num_padded.mp4 2>&1";
				exec($cmd,$op);
			}
		}
		$video_path = "$realpaths/temp/$num_padded.mp4";		
		$filesname .= "file '".$video_path."'"."\r\n";
		$x++;
	}
	
	$temp_folder = 'public://lms/test';
	$realpath = drupal_realpath($temp_folder);
	
	//Writes "joinVideos.txt"
	$joinVideosnameTXT="$realpath/temp/joinVideosname.txt";			
	$joinVideos=fopen($joinVideosnameTXT,"w+");
	fwrite($joinVideos, $filesname);	
	fclose($joinVideos);
	
	$video3 = "$realpath/temp/final.mp4";
	if(file_exists($video3)){
		unlink($video3);//remove previous $videoFinal
	}
	
	$cmd="/usr/local/bin/ffmpeg -f concat -safe 0 -i $joinVideosnameTXT -strict -2 -c copy $video3 2>&1";	
	exec($cmd,$op);
	
	ob_start();
   
    passthru("/usr/local/bin/ffmpeg -i ".$video3." 2>&1");
    $duration = ob_get_contents();
	ob_end_clean();
      
    $search='/Duration: (.*?)[.]/';
    $duration=preg_match($search, $duration, $matches, PREG_OFFSET_CAPTURE);
    $duration = $matches[1][0];

    list($hours, $mins, $secs) = split('[:]', $duration);
      
    //echo "Hours: ".$hours." Minutes: ".$mins." Seconds: ".$secs;
	echo $time_sec = ($hours*3600)+($mins*60)+$secs;
   // echo $duration=$mins.':'.$secs;
	
	$mp3_video = "$realpath/temp/mp3_video_final.mp4";
	$mp3_audio = "$realpath/temp/mp3_audio.mp3";
	$mp3_silence = "$realpath/temp/mp3_silence.mp3";
	$mp3_final = "$realpath/temp/mp3_final.mp3";
	
	 $length = ($x-1)*5;
	 $audio_fade = $length - 2;
	//$mp3_url = $_POST['mp3'];
	$file = file_load(1384);
	$mp3_path = drupal_realpath($file->uri);
	
	
	
	$cmd = "/usr/local/bin/ffmpeg -ss 0 -i $mp3_path -t $time_sec $mp3_audio 2>&1";
	exec($cmd,$op);
	
	$cmd = "/usr/local/bin/ffmpeg -f lavfi -i aevalsrc=0:0::duration=2 -ab 320k $mp3_silence 2>&1";
	exec($cmd,$op);	
	
	$cmd = "/usr/local/bin/ffmpeg -i concat:\"$mp3_audio|$mp3_silence\" -codec copy $mp3_final 2>&1";
	exec($cmd,$op);
	
	$cmd = "/usr/local/bin/ffmpeg -i $video3 -i $mp3_final -c:v copy -c:a aac -strict -2 $mp3_video 2>&1";
	exec($cmd,$op);	
	
	$cmd = "/usr/local/bin/ffmpeg -i $video3 -i $mp3_path -c:v copy -c:a aac -strict -2 -af 'afade=t=out:st=$audio_fade:d=2' -t $time_sec $realpath/cbone_listing_raw.mp4 2>&1";
	exec($cmd,$op);	
			
	$cmd = "/usr/local/bin/ffmpeg -i $realpath/CB_intro.mp4 -s 1280x720 -c:v libx264 -r 25 -pix_fmt yuvj420p -strict -2 -an $realpath/intro_video.mp4 2>&1";
	//exec($cmd,$op);

	$cmd = "/usr/local/bin/ffmpeg -i $realpath/CB_outro.mp4 -s 1280x720 -c:v libx264 -r 25 -pix_fmt yuvj420p -strict -2 -an $realpath/outro_video.mp4 2>&1";
	//exec($cmd,$op);	
		
	$joinVideosTXT="$realpath/temp/joinVideos.txt";			
	$joinVideos=fopen($joinVideosTXT,"w+");
	
	$vrealpath = drupal_realpath("public://lms/video");
	$final_video1="$realpath/with_sound_preview_intro.mp4";
	$final_video3="$realpath/outro.mp4";
	
	$final_video2="$realpath/cbone_listing_raw.mp4"; 			
			
	$strVideo="file '".$final_video1."'"."\r\n";			
	$strVideo3="file '".$final_video2."'"."\r\n";
	$strVideo2="file '".$final_video3."'"."\r\n";
	
	fwrite($joinVideos, $strVideo);	
	fwrite($joinVideos, $strVideo3);
	fwrite($joinVideos, $strVideo2);							
	fclose($joinVideos);	
	
	$videoFinal="$realpath/temp/cbone_listing.mp4";
	if(file_exists($videoFinal)){
		unlink($videoFinal);//remove previous $videoFinal
	}
	
	$cmd="/usr/local/bin/ffmpeg -f concat -safe 0 -i $joinVideosTXT -q:v 2 -c copy $videoFinal 2>&1";	
	exec($cmd,$op);
		
	echo '<pre>';print_r($op);

}

/**
 * Callback function cbone_listing_video_create()
 * to create slide video by listing photos
 * @return TRUE
 **/
function cbone_listing_video_create(){
	global $user;
	$fids = $_POST['fids'];
	$nid =  $_POST['nid'];
	$design = cbone_web_listing_design($nid);
	if($design == 'mc_design') {
		$video = cbone_listing_video_create_marketing_order($_POST['fids'], $_POST['nid'], $_POST['mp3'], $_POST['zoom']);
	}
	else{
		$video = cbone_listing_video_create_marketing_order($_POST['fids'], $_POST['nid'], '', 0);
		//$video = cbone_listing_video_create_non_marketing_order($_POST['fids'], $_POST['nid']);
	}
	print $video;
}

/**
 * Callback function cbone_listing_video_create()
 * to create slide video by listing photos
 * @return TRUE
 **/
function cbone_listing_video_create_marketing_order($fids, $nid, $mp3, $zoom){
	
	if(count($fids) > 2) {
		$listing_node = node_load($nid);
		$files = array();
		$x = 1;	
		$y = 1;	
		$z = 1;	
		$filesname = '';
		foreach($fids as $fid) {
			if($fid == 'first') {
				$name_first = 'slide-first.jpg';
				$filepath = 'public://lms/'.$listing_node->nid.'/video/'.$name_first;
			}
			elseif($fid == 'last') {
				$name_second = 'slide-second.jpg';
				$filepath = 'public://lms/'.$listing_node->nid.'/video/'.$name_second;
			}
			else {
				$file = file_load($fid);
				$filepath = $file->uri;
				$files[] = file_create_url($filepath);
			}
			
			$image_temp_folder = 'public://lms/'.$listing_node->nid.'/video/temp/';
			file_prepare_directory($image_temp_folder, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);
			//Get the file
			$content = file_get_contents($filepath);
			//Store in the filesystem.
			$num_padded = sprintf("%05d", $x);
			$filename = $image_temp_folder.$num_padded.'.jpg';
			$image_realpath = drupal_realpath($filename);
			$fp = fopen($image_realpath, "w");
			fwrite($fp, $content);
			fclose($fp);
			
			$cmd = "/usr/local/bin/ffmpeg -resize 1280x720 -vf \"format=yuv420p[v]\" $image_realpath 2>&1";
			exec($cmd,$op);
			
			$temp_folders = 'public://lms/'.$listing_node->nid.'/video/';
			$realpaths = drupal_realpath($temp_folders);
			
			$morph_temp_folder = "public://lms/$listing_node->nid/video/temp/m_$num_padded/";
			file_prepare_directory($morph_temp_folder, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);
				
			if($fid == 'first' || $fid == 'last') {
				$cmd = "convert $image_realpath -delay 2 -morph 2 $realpaths/temp/m_$num_padded/%04d.jpg 2>&1";
				exec($cmd,$op);
			
				$cmd = "/usr/local/bin/ffmpeg -r 1/5 -i $realpaths/temp/m_$num_padded/%04d.jpg -s 1280x720 -c:v libx264 -r 25 -pix_fmt yuvj420p -q:v 1 $realpaths/temp/m_$num_padded/slide_$num_padded.mp4 2>&1";
				exec($cmd,$op);
				
				$cmd = "/usr/local/bin/ffmpeg -i $realpaths/temp/m_$num_padded/slide_$num_padded.mp4 -y -vf \"fade=in:0:3:d=1:alpha=1\" $realpaths/temp/m_$num_padded/slide_fade_in_$num_padded.mp4 2>&1";
				exec($cmd,$op);
				
				$cmd = "/usr/local/bin/ffmpeg -i $realpaths/temp/m_$num_padded/slide_fade_in_$num_padded.mp4 -y -vf \"fade=out:122:3:d=1:alpha=1\" $realpaths/temp/$num_padded.mp4 2>&1";
				exec($cmd,$op);
			
			}
			else{				
				if( $zoom == 1 ){
					if($y % 2 === 0 ){						
						$cmd = "/usr/local/bin/ffmpeg -i $image_realpath -vf \"scale=hd720,zoompan=z='if(lte(zoom,1.0),1.5,max(1.001,zoom-0.0025))':d=125\" -s 1280x720 -c:v libx264 -pix_fmt yuvj420p $realpaths/temp/m_$num_padded/slide_$num_padded.mp4 2>&1";
						exec($cmd,$op);
					}
					else{
						$cmd = "/usr/local/bin/ffmpeg -i $image_realpath -s 1280x720 -vf \"scale=hd720,zoompan=z='min(zoom+0.0025,1.5)':d=125\" -s 1280x720 -c:v libx264 -pix_fmt yuvj420p $realpaths/temp/m_$num_padded/slide_$num_padded.mp4 2>&1";
						exec($cmd,$op);
					}
					$cmd = "/usr/local/bin/ffmpeg -i $realpaths/temp/m_$num_padded/slide_$num_padded.mp4 -y -vf \"fade=in:0:3:d=1:alpha=1\" $realpaths/temp/m_$num_padded/slide_fade_in_$num_padded.mp4 2>&1";
					exec($cmd,$op);
				
					$cmd = "/usr/local/bin/ffmpeg -i $realpaths/temp/m_$num_padded/slide_fade_in_$num_padded.mp4 -y -vf \"fade=out:122:3:d=1:alpha=1\" $realpaths/temp/$num_padded.mp4 2>&1";
					exec($cmd,$op);
				
					$y++;
				}
				else{
					$cmd = "convert $image_realpath -delay 2 -morph 2 $realpaths/temp/m_$num_padded/%04d.jpg 2>&1";
					exec($cmd,$op);
			
					$cmd = "/usr/local/bin/ffmpeg -r 1/5 -i $realpaths/temp/m_$num_padded/%04d.jpg -s 1280x720 -c:v libx264 -r 25 -pix_fmt yuvj420p -q:v 1 $realpaths/temp/m_$num_padded/slide_$num_padded.mp4 2>&1";
					exec($cmd,$op);
					
					$cmd = "/usr/local/bin/ffmpeg -i $realpaths/temp/m_$num_padded/slide_$num_padded.mp4 -y -vf \"fade=in:0:3:d=1:alpha=1\" $realpaths/temp/m_$num_padded/slide_fade_in_$num_padded.mp4 2>&1";
					exec($cmd,$op);
					
					$cmd = "/usr/local/bin/ffmpeg -i $realpaths/temp/m_$num_padded/slide_fade_in_$num_padded.mp4 -y -vf \"fade=out:122:3:d=1:alpha=1\" $realpaths/temp/$num_padded.mp4 2>&1";
					exec($cmd,$op);
				}
			}			
			$video_path = "$realpaths/temp/$num_padded.mp4";		
			$filesname .= "file '".$video_path."'"."\r\n";
			$x++;
			$z++;
		}
		
		
		$temp_folder = 'public://lms/'.$listing_node->nid.'/video/';
		$realpath = drupal_realpath($temp_folder);

		//Writes "joinVideos.txt"
		$joinVideosnameTXT="$realpath/temp/joinVideosname.txt";			
		$joinVideosname=fopen($joinVideosnameTXT,"w+");
		fwrite($joinVideosname, $filesname);	
		fclose($joinVideosname);
		
		$cmd = "rm -r $realpath/temp/final.mp4 2>&1";
		exec($cmd, $op);
		
		$video3 = "$realpath/temp/final.mp4";
		
		$cmd="/usr/local/bin/ffmpeg -f concat -safe 0 -i $joinVideosnameTXT -strict -2 -c copy $video3 2>&1";	
		exec($cmd,$op);
		
		//Get duration of video in secs
		ob_start();
		passthru("/usr/local/bin/ffmpeg -i ".$video3." 2>&1");
		$duration = ob_get_contents();
		ob_end_clean();
		  
		$search='/Duration: (.*?)[.]/';
		$duration=preg_match($search, $duration, $matches, PREG_OFFSET_CAPTURE);
		$duration = $matches[1][0];

		//list($hours, $mins, $secs) = split('[:]', $duration);
		$hms = explode(':', $duration);
		$hours = $hms[0];
		$mins = $hms[1];
		$secs = $hms[2];
		//echo "Hours: ".$hours." Minutes: ".$mins." Seconds: ".$secs;
		$time_sec = (($hours*3600)+($mins*60)+$secs) + 2;
	   // echo $duration=$mins.':'.$secs;
   
		$joinVideosTXT="$realpath/temp/joinVideos.txt";			
		$joinVideos=fopen($joinVideosTXT,"w+");
		
		$vrealpath = drupal_realpath("public://lms/video");
		
		if($mp3 != '') {
			$length = (($x-1)*5)+2;
			//$audio_fade = $length - 2;
			$audio_fade = $time_sec - 2;
			$mp3_url = $mp3;
			$file = file_load($mp3_url);
			$mp3_path = drupal_realpath($file->uri);
			
			$cmd = "rm -r $realpath/cbone_listing_raw.mp4 2>&1";
			exec($cmd,$op);
			
			$cmd = "/usr/local/bin/ffmpeg -i $video3 -i $mp3_path -af 'afade=t=out:st=$audio_fade:d=2' -t $time_sec -c:v copy -c:a aac -strict -2 $realpath/cbone_listing_raw.mp4 2>&1";
			exec($cmd,$op);				
			
			$final_video2="$realpath/cbone_listing_raw.mp4";
			
			if( isset($listing_node->field_lms_presentation['und'][0]['value']) ){
				$final_video1="$vrealpath/new_intro_outro/preview_intro.mp4";
				$final_video3="$vrealpath/new_intro_outro/preview_outro.mp4";
			}
			else{
				$final_video1="$vrealpath/new_intro_outro/intro.mp4";
				$final_video3="$vrealpath/new_intro_outro/outro.mp4";
			}
			
		}
		else {
			
			$final_video2="$video3";
			if( isset($listing_node->field_lms_presentation['und'][0]['value']) ){
				$final_video1="$vrealpath/new_intro_outro/preview_intro_video.mp4";
				$final_video3="$vrealpath/new_intro_outro/preview_outro_video.mp4";
			}
			else{
				$final_video1="$vrealpath/new_intro_outro/intro_video.mp4";
				$final_video3="$vrealpath/new_intro_outro/outro_video.mp4";
			}
			
		}
						
		$strVideo="file '".$final_video1."'"."\r\n";			
		$strVideo3="file '".$final_video2."'"."\r\n";
		$strVideo2="file '".$final_video3."'"."\r\n";
		
		fwrite($joinVideos, $strVideo);	
		fwrite($joinVideos, $strVideo3);
		fwrite($joinVideos, $strVideo2);							
		fclose($joinVideos);	
		
		
		$cmd = "rm -r $realpath/cbone_listing.mp4 2>&1";
		exec($cmd, $op);
		
		$videoFinal="$realpath/cbone_listing.mp4";
				
		$cmd="/usr/local/bin/ffmpeg -f concat -safe 0 -i $joinVideosTXT -qscale 2 -c copy $videoFinal 2>&1";	
		exec($cmd,$op);
		$cmd = "rm -R $realpath/temp 2>&1";
		exec($cmd,$op);
		
		$filename = $temp_folder.'/cbone_listing.mp4';
		$file = (object)array(
			'uid' => $listing_node->uid,
			'filename' => 'cbone_listing.mp4',
			'uri' => $filename,
			'filemime' => file_get_mimetype($filename),
			'status' => 1,
			'display' => 1,
		);
		//$s3_path = 's3://lms/agent-'.$uid.'/pdf-thumb/'.$name;
		$lms_video_nid = db_select("field_data_field_lms_listing_reference", 'lr');
		$lms_video_nid->fields('lr', array('entity_id'));
		$lms_video_nid->condition('lr.entity_type', 'node', 'LIKE');
		$lms_video_nid->condition('lr.bundle', 'lms_video', 'LIKE');
		$lms_video_nid->condition('lr.field_lms_listing_reference_nid', $nid, '=');
		$video_nid = $lms_video_nid->execute()->fetchField();
		$listing_video = node_load($video_nid);
		//$listing_video = node_load(19591);
		if ($file = file_move($file, $filename, $replace = FILE_EXISTS_RENAME)) {
			$listing_video->field_lms_listing_video['und']['0'] = (array)$file;
			unset($listing_video->field_post_to_you_tube['und']);
			unset($listing_video->field_you_tube_url['und']);
			//$listing_video->save( TRUE );
		}
		node_save($listing_video);
		
		$cmd = "rm -r $realpath/cbone_listing.mp4 2>&1";
		exec($cmd, $op);
		
		$cmd = "rm -r $realpath 2>&1";
		exec($cmd, $op);
		print "done";
	}
	else {
		print "not done";
	}

}

/**
 * Callback function cbone_listing_video_create()
 * to create slide video by listing photos
 * @return TRUE
 **/
function cbone_listing_video_create_non_marketing_order($fids, $nid){
	global $user;
	if(count($fids) > 2) {
		$listing_node = node_load($nid);
		$files = array();
		$x = 0;		
		foreach($fids as $fid) {
			if($fid == 'first') {
				$name_first = 'slide-first.jpg';
				$filepath = 'public://lms/'.$listing_node->nid.'/video/'.$name_first;
			}
			elseif($fid == 'last') {
				$name_second = 'slide-second.jpg';
				$filepath = 'public://lms/'.$listing_node->nid.'/video/'.$name_second;
			}
			else {
				$file = file_load($fid);
				$filepath = $file->uri;
			}
			$files[] = file_create_url($filepath);
			
			$temp_folder = 'public://lms/'.$listing_node->nid.'/video/temp/';
			file_prepare_directory($temp_folder, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);
			//Get the file
			for($i = 0; $i < 5; $i++) {
				$content = file_get_contents($filepath);
				//Store in the filesystem.
				$num_padded = sprintf("%05d", $x);
				$filename = $temp_folder.$num_padded.'.jpg';
				$realpath = drupal_realpath($filename);
				$fp = fopen($realpath, "w");
				fwrite($fp, $content);
				fclose($fp);
				$x++;
			}
		}
		//Writes "joinVideos.txt"
		$vrealpath = drupal_realpath("public://lms/video");
		$joinVideosTXT="$vrealpath/joinVideos.txt";			
		$joinVideos=fopen($joinVideosTXT,"w+");
		
		$length = $x;
		$audio_fade = $x - 2;
		$temp_folder = 'public://lms/'.$listing_node->nid.'/video/';
		$realpath = drupal_realpath($temp_folder);
		//print $realpath;
		$cmd = "mogrify -resize 800x800 -vf \"format=yuv420p[v]\" $realpath/temp/*.jpg 2>&1";
		exec($cmd,$op);
		$cmd = "convert $realpath/temp/*.jpg -delay 10 -morph 10 $realpath/temp/%05d.jpg 2>&1";
		exec($cmd,$op);
		
		$cmd = "rm $realpath/cbone_listing_raw.mp4 2>&1";
		exec($cmd,$op);	
		
		/*NEW And Working*/
		$cmd = "/usr/local/bin/ffmpeg -framerate 11 -start_number 0 -i $realpath/temp/%05d.jpg -s 800x600 $realpath/cbone_listing_raw.mp4 2>&1";
		exec($cmd,$op);

		//print "<pre>";print_r($op);exit;
		print "done";
		$final_video="$vrealpath/intro_example.mp4";
		$final_video2="$vrealpath/outro_example.mp4";
				
		$video3="$realpath/cbone_listing_raw.mp4"; 			
				
		$strVideo="file '".$final_video."'"."\r\n";			
		$strVideo3="file '".$video3."'"."\r\n";
		$strVideo2="file '".$final_video2."'"."\r\n";
		
		fwrite($joinVideos, $strVideo);	
		fwrite($joinVideos, $strVideo3);
		fwrite($joinVideos, $strVideo2);							
		fclose($joinVideos);		
		$videoFinal="$realpath/cbone_listing.mp4";
		if(file_exists($videoFinal)){
			unlink($videoFinal);//remove previous $videoFinal
		}
		
		$cmd="/usr/local/bin/ffmpeg -f concat -i $joinVideosTXT -c copy $videoFinal 2>&1";	
		exec($cmd,$op);
		
		$cmd = "rm -R $realpath/temp 2>&1";
		exec($cmd,$op);
		
		$filename = $temp_folder.'/cbone_listing.mp4';
		$file = (object)array(
			'uid' => $listing_node->uid,
			'filename' => 'cbone_listing.mp4',
			'uri' => $filename,
			'filemime' => file_get_mimetype($filename),
			'status' => 1,
			'display' => 1,
		);
		//$s3_path = 's3://lms/agent-'.$uid.'/pdf-thumb/'.$name;
		$lms_video_nid = db_select("field_data_field_lms_listing_reference", 'lr');
		$lms_video_nid->fields('lr', array('entity_id'));
		$lms_video_nid->condition('lr.entity_type', 'node', 'LIKE');
		$lms_video_nid->condition('lr.bundle', 'lms_video', 'LIKE');
		$lms_video_nid->condition('lr.field_lms_listing_reference_nid', $nid, '=');
		$video_nid = $lms_video_nid->execute()->fetchField();
		$listing_video = node_load($video_nid);
		//$listing_video = node_load(19591);
		if ($file = file_move($file, $filename, $replace = FILE_EXISTS_RENAME)) {
			$listing_video->field_lms_listing_video['und']['0'] = (array)$file;
			
			if( !empty($listing_video->field_you_tube_url) ){
				$url = parse_str( parse_url( $listing_video->field_you_tube_url['und'][0]['value'], PHP_URL_QUERY ), $vars);
				$video_id= $vars['v'];
				include_once DRUPAL_ROOT . '/includes/locale.inc';
				$token = variable_get('youtube_uploader_token', array());
				
				$app_name = variable_get('youtube_uploader_app_name');
				$client_id = variable_get('youtube_uploader_client_id');
				$client_secret = variable_get('youtube_uploader_client_secret');
			}
			unset($listing_video->field_post_to_you_tube['und']);
			unset($listing_video->field_you_tube_url['und']);
			//$listing_video->save( TRUE );
		}
		node_save($listing_video);
		$cmd = "rm $realpath/cbone_listing_raw.mp4 2>&1";
		exec($cmd, $op);
		
		$cmd = "rm $realpath 2>&1";
		exec($cmd, $op);	
	}
	else {
		print "not done";
	}
}

/**
 * Callback function listing_video_download()
 * to download the video file
 **/
function listing_video_download($fid){
	$video_file = file_load($fid);
	//$url = file_create_url('public://lms/'.$listing_node->nid.'/video/cbone_listing.mp4');
	$url = file_create_url($video_file->uri);
	header("Content-Type: application/octet-stream");
	header("Content-Transfer-Encoding: Binary");
	header("Content-disposition: attachment; filename=\"cbone_listing.mp4\""); 
	print readfile($url);
}

/**
 * Callback function to create form to upload video on youtube()
 * to download the video file
 **/
function yoututbe_video_upload($form, &$form_state, $data) { 
	$fid=$data['fid'];
	$nid=$data['nid'];
	$video_nid= $data['video_nid'];
	$video_node = node_load($video_nid);
	$form=array();
	$form['video_fid'] = array(
		'#type' => 'hidden',
		'#title' => t(''),
		'#value' => $fid,
	);
	$form['nid'] = array(
		'#type' => 'hidden',
		'#title' => t(''),
		'#value'=>$nid,
	);
	$form['video_nid'] = array(
		'#type' => 'hidden',
		'#title' => t(''),
		'#value'=>$video_nid,
	);
	if(isset($video_node->field_you_tube_url['und'][0]['value']) && !empty($fid) ){
		$form['submit'] = array(
			'#type' => 'submit',
			'#value' => t("POST TO YOUTUBE CHANNEL"),
			'#prefix'=> '<div class="video_upload">',
			'#suffix'=> '</div>',
			'#attributes'=>array('disabled'=>'disabled'),
		);
	}
	else{
		$form['submit'] = array(
			'#type' => 'submit',
			'#value' => t("POST TO YOUTUBE CHANNEL"),
			'#prefix'=> '<div class="video_upload">',
			'#suffix'=> '</div>',
		);
	}
	return $form;
}
/**
 * Submit Callback function to create form to upload video on youtube()
 * to download the video file
 **/
function yoututbe_video_upload_submit($form, &$form_state) { 
	// Youtube App Parameter
	include_once DRUPAL_ROOT . '/includes/locale.inc';
	$token = variable_get('youtube_uploader_token', array());
	
	$app_name = variable_get('youtube_uploader_app_name');
	$client_id = variable_get('youtube_uploader_client_id');
	$client_secret = variable_get('youtube_uploader_client_secret');
	$privacy_settings = variable_get('youtube_uploader_publishing_options');
	$category = variable_get('youtube_uploader_category');
	$tags = variable_get('youtube_uploader_tags');
	$final_tags = explode(",", $tags);
	
	$nid = $form_state['values']['nid'];
	$node = node_load($nid);
	$video_nid = $form_state['values']['video_nid'];
	//$video_node = node_load($video_nid);
	$video = $form_state['values']['video_fid'];
	$video_data	= file_load($video);
	
	$videoPath = $video_data->uri;
	$videoTitle = $node->title;
	$videoDescription = "Coldwell Banker Western Region videos";
	$videoCategory = "22";
	$videoTags = $final_tags;
 
	// Display the authorization link.
	if (empty($token['refresh_token']) && variable_get('youtube_uploader_app_name', '') != '') {
		// Test the connection to google.
		$ytapi = new youtubeUploaderYtapi();
		$res = $ytapi->getAuthUrl();
		return  drupal_set_message(t('You need to allow your application by following !link_auth', array('!link_auth' => l(t('this link'), $res))), 'warning', FALSE);
	}
	elseif (!empty($token['refresh_token'])) {
		$key=json_encode($token);
		module_load_include('php', 'listing_marketing_system', 'Google/autoload');
		module_load_include('php', 'listing_marketing_system', 'Google/Client');
		module_load_include('php', 'listing_marketing_system', 'Google/Service/YouTube');
		
		$google_config = new Google_Config();
		$google_config->setClassConfig('Google_IO_Curl', 'options',
		  array(
			CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
			CURLOPT_VERBOSE => TRUE,
		  )
		);

		// Try to load the library and check if that worked.
		$client = new Google_Client($google_config);
		$client->setApplicationName($app_name);
		$client->setClientId($client_id);
		$client->setClientSecret($client_secret);
		$client->setAccessType('offline');
		$client->setAccessToken($key);
	   
		$youtube = new Google_Service_YouTube($client);
		// Create a snipet with title, description, tags and category id
		$snippet = new Google_Service_YouTube_VideoSnippet();
		$snippet->setTitle($videoTitle);
		$snippet->setDescription($videoDescription);
		$snippet->setCategoryId($videoCategory);
		$snippet->setTags($videoTags);

		// Create a video status with privacy status. Options are "public", "private" and "unlisted".
		$status = new Google_Service_YouTube_VideoStatus();
		$status->privacyStatus= $privacy_settings;

		// Create a YouTube video with snippet and status
		$video = new Google_Service_YouTube_Video();
		$video->setSnippet($snippet);
		$video->setStatus($status);

		// Size of each chunk of data in bytes. Setting it higher leads faster upload (less chunks,
		// for reliable connections). Setting it lower leads better recovery (fine-grained chunks)
		$chunkSizeBytes = 20 * 1024 * 1024;

		// Setting the defer flag to true tells the client to return a request which can be called
		// with ->execute(); instead of making the API call immediately.
		$client->setDefer(true);

		// Create a request for the API's videos.insert method to create and upload the video.
	   $insertRequest= $youtube->videos->insert("status,snippet", $video);

		// Create a MediaFileUpload object for resumable uploads.
		$media = new Google_Http_MediaFileUpload(
			$client,
			$insertRequest,
			'video/*',
			null,
			true,
			$chunkSizeBytes
		);
		$media->setFileSize(filesize($videoPath));


		// Read the media file and upload it chunk by chunk.
		$status = false;
		$handle = fopen($videoPath, "rb");
		//$handle = fopen($videoPath, "rb");
		while (!$status && !feof($handle)) {
				$chunk = fread($handle, $chunkSizeBytes);
				$status = $media->nextChunk($chunk);
		}
		fclose($handle);
		if ($status->status['uploadStatus'] == 'uploaded') {
			$videoId = $status->id;
			
			$video_node = node_load($video_nid);
			$video_node->field_post_to_you_tube['und']['0']['value'] = 1;
			$video_node->field_you_tube_url['und']['0']['value'] = "https://www.youtube.com/watch?v=$videoId";
			node_save($video_node);//update node after uploading video on youtube
			drupal_set_message('Video Uploaded on Youtube and in Progress');		
		}
		else{
			drupal_set_message('Video not Uploaded on Youtube');
		}
	}
}
/**
 * Callback function to create form to embed youtube video on
 * to download the video file
 **/
function yoututbe_video_embed($form, &$form_state, $nid) { 
	$video_node = node_load($nid);
	$video_url= isset($video_node->field_lms_embed_video['und']['0']['uri']) ? file_create_url($video_node->field_lms_embed_video['und']['0']['uri']).'': '';
	$form=array();
	$form['video_nid'] = array(
		'#type' => 'hidden',
		'#title' => t(''),
		'#value'=>$nid,
	);
	if( !empty($video_url) ){
		$form['youtube_value'] = array(
			'#type' => 'textfield',
			'#title' => t(''),
			'#description' => t('Enter the YouTube URL: https://www.youtube.com/watch/?v=i1DRDGMV1OE'),
			'#value' => $video_url,
		);
		
			$form['delete'] = array(
			'#type' => 'submit',
			'#value' => t("DELETE"),
			'#prefix'=> '<div class="video_upload">',
			'#suffix'=> '</div>',
		);
	}
	else{
		$form['youtube_value'] = array(
			'#type' => 'textfield',
			'#title' => t(''),
			'#description' => t('Enter the YouTube URL: https://www.youtube.com/watch/?v=i1DRDGMV1OE'),
		);
	
		$form['save'] = array(
			'#type' => 'submit',
			'#value' => t("SAVE"),
			'#prefix'=> '<div class="video_upload">',
			'#suffix'=> '</div>',
		);
	}
	return $form;
}

/**
 * Callback function to create form to embed youtube video on
 * to download the video file
 **/
function yoututbe_video_embed_submit($form, &$form_state) {
	$video_node = node_load($form_state['values']['video_nid']);
	$video_url = $form_state['values']['youtube_value'];	
	$video_path = "https://www.youtube.com/watch?v=-DYSucV1_9w&list=PLtaXuX0nEZk9MKY_ClWcPkGtOEGyLTyCO";
	if($form_state['input']['op'] == 'SAVE'){
	
		module_load_include('inc', 'media_youtube', 'includes/MediaInternetYouTubeHandler.inc');
		$obj = new MediaInternetYouTubeHandler($video_url);
		$file = $obj->getFileObject();
		$file->display = 1;
		file_save($file);
		$video_node->field_lms_embed_video['und'][0] = (array) $file;
		node_save($video_node);
		drupal_set_message('Youtube Video is embeded on the listing.');
	}
	else if($form_state['input']['op'] == 'DELETE'){
		$video_file = file_load($video_node->field_lms_embed_video['und'][0]['fid']);
		if(is_object($video_file)){
			unset($video_node->field_lms_embed_video['und'][0]);
			file_delete($video_file);
		}
		node_save($video_node);
		drupal_set_message('Youtube Video has been removed from the listing.');
	}
}
/**
 * Callback function cbone_auto_generated_mc_slide_image()
 * to create listing slide image for video 
 * //slide-image
 **/
function cbone_auto_generated_mc_slide_image($nid){
	//Listing detail
	$listing_node = node_load($nid);
	$headline = isset($listing_node->field_lms_listing_headline['und']['0']['value']) ? $listing_node->field_lms_listing_headline['und']['0']['value'] .' ': '';
	//Listing Address
	if(isset($listing_node->field_lms_hide_listing_address['und']['0']['value']) && $listing_node->field_lms_hide_listing_address['und']['0']['value'] == 1) {		
		$listing_address = t('Address Available Upon Request');
		$listing_address2 = '';
	}
	else {
		$address = array();
		$address2 = array();
		$listing_address2 = '';
		if(isset($listing_node->field_lms_listing_address['und']['0']['value'])) {
			$address[] = $listing_node->field_lms_listing_address['und']['0']['value'];
		}
		if(isset($listing_node->field_lms_address_unit['und']['0']['value'])) {
			$address[] = $listing_node->field_lms_address_unit['und']['0']['value'];
		}
		if(isset($listing_node->field_lms_listing_city['und']['0']['value'])) {
			$address2[] = $listing_node->field_lms_listing_city['und']['0']['value'];
		}
		if(isset($listing_node->field_lms_listing_state['und']['0']['value'])) {
			$state = $listing_node->field_lms_listing_state['und']['0']['value'];
		}
		if(isset($listing_node->field_lms_listing_zip['und']['0']['value'])) {
			$zip = $listing_node->field_lms_listing_zip['und']['0']['value'];
		}
		$address2[] = $state.' '.$zip;
		$listing_address = implode(', ', array_filter($address));
		$listing_address2 = implode(', ', array_filter($address2));
	}
	
	$user_name = $email = $phone = $website = $license = '';
	//Listing user
	$user_detail = user_load(isset($listing_node->field_lms_agent_uid['und']['0']['uid']) ? $listing_node->field_lms_agent_uid['und']['0']['uid'] : $listing_node->uid);
	
	if(isset($user_detail->field_preferred_name['und']['0']['value'])){
		$user_name = 'PRESENTED BY '.strtoupper($user_detail->field_preferred_name['und']['0']['value']);
	}
		$email = $user_detail->mail;
	if(isset($user_detail->field_phone_direct['und']['0']['value'])){
		$phone = $user_detail->field_phone_direct['und']['0']['value'];
	}
	if(isset($user_detail->field_agent_web_site['und']['0']['value'])){
		$website = $user_detail->field_agent_web_site['und']['0']['value'];
	}
	if(isset($user_detail->field_state_license['und']['0']['value'])){
		$license = $user_detail->field_state_license['und']['0']['value'];
		$state_license_exp = explode('=', $license);
		$license = 'CalBRE #'.$state_license_exp[1];
	}
	//Listing sales team info
	if(!empty($listing_node->field_lms_sales_team) && isset($listing_node->field_lms_sales_team['und']['0']['nid']) ) {
		$sales_team_node = node_load($listing_node->field_lms_sales_team['und']['0']['nid']);
		if(isset($sales_team_node->field_sales_team_photo['und']['0']['fid'])){
			$pfid= $sales_team_node->field_sales_team_photo['und']['0']['fid'];
			$p_file = file_load($pfid);
			$p_uri = $p_file->uri;
		}
		$c_uri = '';
		$user_name = 'PRESENTED BY '.strtoupper($sales_team_node->title);
		if(isset($sales_team_node->field_team_email['und']['0']['value'])){
			$email = $sales_team_node->field_team_email['und']['0']['value'];
		}
		if(isset($sales_team_node->field_team_website['und']['0']['url'])){
			$website = $sales_team_node->field_team_website['und']['0']['url'];
		}
		$contact = array($phone, $email);
		$contact_string = implode(' | ', array_filter($contact));
		
		$contact2 = array($website, $license);
		$contact_string2 = implode(' | ', array_filter($contact2));
		$contact_string3 = '';
		$contact_string4 = '';
	}
	//Listing co agent info
	else if(isset($listing_node->field_lms_other_agent['und']['0']['uid']) ){
		$co_agent_user_name = $co_agent_email = $co_agent_phone = $co_agent_website = $co_agent_license = '';
		$co_agent = user_load($listing_node->field_lms_other_agent['und']['0']['uid']);
		
		$p_uri = !empty($co_agent->picture->uri) ? $co_agent->picture->uri : variable_get('user_picture_default');
		$c_uri = !empty($user_detail->picture->uri) ? $user_detail->picture->uri : variable_get('user_picture_default');
		
		if(isset($co_agent->field_preferred_name['und']['0']['value'])){
			$user_name = $user_name.' & '.strtoupper($co_agent->field_preferred_name['und']['0']['value']);
		}
		
		$co_agent_email = $co_agent->mail;
		if(isset($co_agent->field_phone_direct['und']['0']['value'])){
			$co_agent_phone = $co_agent->field_phone_direct['und']['0']['value'];
		}
		if(isset($co_agent->field_agent_web_site['und']['0']['value'])){
			$co_agent_website = $co_agent->field_agent_web_site['und']['0']['value'];
		}
		if(isset($co_agent->field_state_license['und']['0']['value'])){
			$co_agent_license = $co_agent->field_state_license['und']['0']['value'];
			$state_license_exp = explode('=', $license);
			if( isset($state_license_exp[1]) ){
				$co_agent_license = 'CalBRE #'.$state_license_exp[1];
			}
			else{
				$co_agent_license = 'CalBRE #'.$state_license_exp[0];
			}
		}
		$contact = array($phone, $email);
		$contact_string = implode(' | ', array_filter($contact));
		
		$contact2 = array($co_agent_phone, $co_agent_email);
		$contact_string2 = implode(' | ', array_filter($contact2));
		
		$contact3 = array($website, $co_agent_website);
		$contact_string3 = implode(' | ', array_filter($contact3));
		
		$contact4 = array($license, $co_agent_license);
		$contact_string4 = implode(' | ', array_filter($contact4));
	}
	else{
		$p_uri = !empty($user_detail->picture->uri) ? $user_detail->picture->uri : variable_get('user_picture_default');	
		$c_uri = '';
		$contact = array($phone, $email);
		$contact_string = implode(' | ', array_filter($contact));

		$contact2 = array($website, $license);
		$contact_string2 = implode(' | ', array_filter($contact2));
		$contact_string3 = '';
		$contact_string4 = '';
	}
			
	$date = array(
		strtoupper($headline),
		strtoupper($listing_address),
		strtoupper($listing_address2),
		$user_name,
		$contact_string,
		$contact_string2,
		$contact_string3,
		$contact_string4,
	);
	
	//Listing Photo
	$x = 0;
	$lms_photo_nid = db_select("field_data_field_lms_listing_reference", 'lr');
	$lms_photo_nid->fields('lr', array('entity_id'));
	$lms_photo_nid->condition('lr.entity_type', 'node', 'LIKE');
	$lms_photo_nid->condition('lr.bundle', 'lms_photos', 'LIKE');
	$lms_photo_nid->condition('lr.field_lms_listing_reference_nid', $nid, '=');
	$photo_nid = $lms_photo_nid->execute()->fetchField();
	$photo_node = node_load($photo_nid);

	$items = field_get_items('node', $photo_node, 'field_lms_listing_photos');
	
	$listing_image='';
	foreach ($items as $delta => $item) {
		$listing_photos = field_collection_field_get_entity($item);
		$listing_image = $listing_photos->field_lms_listing_photo['und']['0']['uri'];
		$image = array(
			'style_name' => 'my_listing_160x110',
			'path' => $listing_photos->field_lms_listing_photo['und']['0']['uri'],
			'title' => $listing_photos->field_lms_listing_photo['und']['0']['filename']
		);
		$x++;
	}
	
	//Image Generate code
	//Header ("Content-type: image/jpeg");
	$module_path = drupal_get_path('module', 'listing_marketing_system');
	$module_path = drupal_realpath($module_path);
	
	$temp_folder = 'public://lms/'.$listing_node->nid.'/video/';
	file_prepare_directory($temp_folder, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);
	//define files created temporary
	$p_agent = drupal_realpath($temp_folder.'agent-pri.png');
	$co_agent = drupal_realpath($temp_folder.'agent-co.png');
	$final_image = drupal_realpath($temp_folder.'main.jpg');
	$pre_final_image = drupal_realpath($temp_folder.'pre.jpg');
	
	$image_url = image_style_url('video_slide_style', $listing_image);
	$pri_image_contents = file_get_contents($image_url);
	$pri_image = imagecreatefromstring($pri_image_contents);
	
	//$pri_image = imageCreateFromJPEG("$image_url");
	$overlay = imageCreateFromJPEG("$module_path/images/overlay-first-last-slide.jpg");
	
	//Add default overlay  
	$white = imagecolorallocate($overlay, 184, 204, 223);
	imagecopymerge($pri_image, $overlay, 0, 170, 0, 0, 1280, 415, 75);
	imagejpeg($pri_image, $final_image, 100);
	// add primary agent image	
	$imagefile = drupal_realpath($p_uri);
	if(file_exists($imagefile) && $p_uri != '' ){
		$p_style_uri = image_style_url('video_slide_agent_image', $p_uri);	 
		$content = file_get_contents($p_style_uri);
		$filename = $temp_folder.'agent_style.png';
		$agent_realpath = drupal_realpath($filename);
		$fp = fopen($agent_realpath, "w");
		fwrite($fp, $content);
		fclose($fp);
	
		$size = getimagesize($agent_realpath);
		$background = new Imagick();
		$background->newImage($size[0], $size[1], new ImagickPixel('white'));
		$image = new Imagick($agent_realpath);
		$image->setImageFormat("png");
		$image->roundCorners(50,50);
		$image->compositeImage($background, imagick::COMPOSITE_DSTATOP, 0, 0);
		$image->writeImage($p_agent);
		$cmd = "convert $p_agent -transparent white $p_agent";
		exec($cmd, $op);
		
		$cmd = "convert $final_image $p_agent -geometry +360+310 -composite $final_image 2>&1";
		exec($cmd, $op);
	}
	// add co-agent image
	$co_imagefile = drupal_realpath($c_uri);
	if(file_exists($co_imagefile) && $c_uri != '' ){
		$c_style_uri = image_style_url('video_slide_agent_image', $c_uri);	 
		$content = file_get_contents($c_style_uri);
		$co_agent_filename = $temp_folder.'co_agent_style.png';
		$co_agent_realpath = drupal_realpath($co_agent_filename);
		$fp = fopen($co_agent_realpath, "w");
		fwrite($fp, $content);
		fclose($fp);
		
		$co_size = getimagesize($co_agent_realpath);
		$co_background = new Imagick();
		$co_background->newImage($size[0], $size[1], new ImagickPixel('white'));
		$co_image = new Imagick($co_agent_realpath);
		$co_image->setImageFormat("png");
		$co_image->roundCorners(50,50);
		$co_image->compositeImage($background, imagick::COMPOSITE_DSTATOP, 0, 0);
		$co_image->writeImage($co_agent);
		$cmd = "convert $co_agent -transparent white $co_agent";
		exec($cmd, $op);
		
		$cmd = "convert $final_image $co_agent -geometry +240+310 -composite $final_image 2>&1";
		exec($cmd, $op);
	}
	//get font family to apply on
	$raleway_regular = "$module_path/font/raleway/Raleway-Regular.ttf";
	$raleway_medium = "$module_path/font/raleway/Raleway-Medium.ttf";
	// Add listing title
	$text_image = new Imagick($final_image);
	$draw = new ImagickDraw;
	$draw->setFont($raleway_medium);
	$draw->setFontSize(30);
	$draw->setFillColor('#666');
	$draw->setTextAlignment(Imagick::ALIGN_CENTER);
	$draw->annotation(640, 220, $date[0]);
	// Add listing address
	$draw->setFont($raleway_regular);
	$draw->setFontSize(24);
	$draw->setFillColor('#7E7E7E');
	$draw->setTextAlignment(Imagick::ALIGN_CENTER);
	$draw->annotation(640, 270, $date[1]);
	// Add listing address 2
	$draw->setFont($raleway_regular);
	$draw->setFontSize(24);
	$draw->setFillColor('#7E7E7E');
	$draw->setTextAlignment(Imagick::ALIGN_CENTER);
	$draw->annotation(640, 300, $date[2]);
	// Add agent title
	$draw->setFont($raleway_medium);
	$draw->setFontSize(20);
	$draw->setFillColor('#7E7E7E');
	$draw->setTextAlignment(Imagick::ALIGN_LEFT);
	$draw->annotation(480, 350, $date[3]);
	// Add agent info
	$draw->setFont($raleway_medium);
	$draw->setFontSize(20);
	$draw->setFillColor('#7E7E7E');
	$draw->setTextAlignment(Imagick::ALIGN_LEFT);
	$draw->annotation(480, 380, $date[4]);
	// Add agent info
	$draw->setFont($raleway_medium);
	$draw->setFontSize(20);
	$draw->setFillColor('#7E7E7E');
	$draw->setTextAlignment(Imagick::ALIGN_LEFT);
	$draw->annotation(480, 410, $date[5]);
	// Add agent info
	$draw->setFont($raleway_medium);
	$draw->setFontSize(20);
	$draw->setFillColor('#7E7E7E');
	$draw->setTextAlignment(Imagick::ALIGN_LEFT);
	$draw->annotation(480, 440, $date[6]);
	// Add agent info
	$draw->setFont($raleway_medium);
	$draw->setFontSize(20);
	$draw->setFillColor('#7E7E7E');
	$draw->setTextAlignment(Imagick::ALIGN_LEFT);
	$draw->annotation(480, 470, $date[7]);
	//create image of text
	$text_image->drawImage($draw); 
	$text_image->writeImage($pre_final_image);
	
	//Add default logo to above created image
	$image = imageCreateFromJPEG("$pre_final_image");
	$logo_path = "$module_path/images/cbrb-logo-video.jpg";
	$data = file_get_contents($logo_path);
	$logo_filename = $temp_folder.'logo.jpg';
	$logo_realpath = drupal_realpath($logo_filename);
	$fp = fopen($logo_realpath, "w");
	fwrite($fp, $data);
	fclose($fp);
	$logo_image = image_style_url('video_slide_logo_image', $logo_filename);
	$main_logo = file_get_contents($logo_image);
	$logo = imagecreatefromstring($main_logo);
	$logo_image_width = imagesx($logo);  
	$logo_image_height = imagesy($logo);
	imagecopymerge($image, $logo, 560, 520, 0, 0, $logo_image_width, $logo_image_height, 100);
	
	//Create video temp folder
	$filepath = 'public://lms/'.$listing_node->nid.'/video/';
	file_prepare_directory($filepath, FILE_CREATE_DIRECTORY || FILE_MODIFY_PERMISSIONS);
	$name_first = 'slide-first.jpg';
	$name_second = 'slide-second.jpg';
	$filename_first = $filepath.$name_first;
	$filename_second = $filepath.$name_second;
	$write_source_first = drupal_realpath($filename_first);
	$write_source_second = drupal_realpath($filename_second);
	imagejpeg($image, $write_source_first, 100);
	imagejpeg($image, $write_source_second, 100);
	// Return output.
	ImageDestroy($image);
	return TRUE;
}
//get_youtube_content
function get_youtube_content($url) 
{
    if(!function_exists('curl_init'))
    { 
        die('CURL is not installed!');
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $output = curl_exec($ch);
    $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ($http_status == '403') ? false : $output;
}
/**
 * Callback function to create form to embed youtube video on
 * to download the video file
 **/
function yoututbe_video_delete($form, &$form_state, $nid) { 
	$form=array();
	$form['video_nid'] = array(
		'#type' => 'hidden',
		'#title' => t(''),
		'#value'=>$nid,
	);
	$form['submit'] = array(
		'#type' => 'submit',
		'#value' => t("DELETE"),
		'#prefix'=> '<div class="video_upload">',
		'#suffix'=> '</div>',
	);
	return $form;
}

/**
 * Callback function to create form to embed youtube video on
 * to download the video file
 **/
function yoututbe_video_delete_submit($form, &$form_state) {
	$video_node = node_load($form_state['values']['video_nid']);
	$video_file = file_load($video_node->field_lms_listing_video['und'][0]['fid']);
	if(is_object($video_file)){
		unset($video_node->field_lms_listing_video['und'][0]);
		file_delete($video_file);
	}
	unset($video_node->field_post_to_you_tube['und']);
	unset($video_node->field_you_tube_url['und']);
	node_save($video_node);
	drupal_set_message('Video has been removed. Kindly create a new video and upload to YouTube.');
}