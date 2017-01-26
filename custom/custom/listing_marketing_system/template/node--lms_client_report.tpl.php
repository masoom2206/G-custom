<?php
  global $base_url;
  $aget2 = 0;
  //print "<pre>";print_r($node);exit;
  $listing_nid = $node->field_lms_listing_reference[LANGUAGE_NONE]['0']['nid'];
  $nodedata = get_all_listing_attached_recoreds($listing_nid);
  $designnid = get_property_flyer_dnid($listing_nid);
  $yourtube = '';
  $yourtubelink = '';
  if (isset($nodedata['lms_video']) && !empty(($nodedata['lms_video']))) { 
    $video_entity = entity_load_single('node', $nodedata['lms_video']);
    if (isset( $video_entity->field_you_tube_url) && !empty( $video_entity->field_you_tube_url)) {
     $yourtube =  $video_entity->field_you_tube_url[LANGUAGE_NONE][0]['value'];
      $yourtubelink = l('video slideshow', $yourtube, array('external' => TRUE));
    } 
  } 
  if (isset($nodedata['lms_video']) && !empty($nodedata['lms_video'])) {
    $video_entity_posted_you = entity_load_single('node', $nodedata['lms_video']);
    if (isset($video_entity_posted_you->field_lms_embed_video) && !empty($video_entity_posted_you->field_lms_embed_video)) {
      $yourtube = $video_entity_posted_you->field_lms_embed_video[LANGUAGE_NONE][0]['value'];
      $yourtubelink = l('video slideshow', $yourtube, array('external' => TRUE));
    }
  }
  $listingpdf = list_pdf_postcard_data($listing_nid, $node->nid);
  $listing_node = node_load($listing_nid);
  $lms_photo_nid = db_select("field_data_field_lms_listing_reference", 'lr');
	$lms_photo_nid->fields('lr', array('entity_id'));
	$lms_photo_nid->condition('lr.entity_type', 'node', 'LIKE');
	$lms_photo_nid->condition('lr.bundle', 'lms_photos', 'LIKE');
	$lms_photo_nid->condition('lr.field_lms_listing_reference_nid', $listing_nid, '=');
	$photo_nid = $lms_photo_nid->execute()->fetchField();
	$photo_node = node_load($photo_nid);
	$items = field_get_items('node', $photo_node, 'field_lms_listing_photos');
	$listing_photos = field_collection_field_get_entity($items[0]);
	
  $client_name = isset($listing_node->field_client_first_name[LANGUAGE_NONE]['0']['value']) ? $listing_node->field_client_first_name[LANGUAGE_NONE]['0']['value'] : 'Seller';
  if(isset($listing_node->field_lms_sales_team[LANGUAGE_NONE]['0']['nid'])) {
    $nid = $node->field_lms_sales_team[LANGUAGE_NONE]['0']['nid'];
    $sales_team = node_load($nid);
    $profile_image = isset($sales_team->field_sales_team_photo[LANGUAGE_NONE]['0']['uri']) ? file_create_url($sales_team->field_sales_team_photo[LANGUAGE_NONE]['0']['uri']) : '/sites/all/modules/custom/listing_marketing_system/images/default-image.jpg';
    $profile_text = isset($sales_team->body[LANGUAGE_NONE]['0']['value']) ? substr($sales_team->body[LANGUAGE_NONE]['0']['value'], 0, 150) : '';
    $profile_name = $sales_team->title;
    $profile_image_img = '<img style=" height: 200px; width: auto;margin: 6px;" src="'.$profile_image.'" />';
  }
  else {
    $uid = $listing_node->uid;
    $agent_detail = user_load($uid);
    $profile_image = isset($agent_detail->picture->fid) ? file_create_url($agent_detail->picture->uri) : '/sites/all/modules/custom/listing_marketing_system/images/default-image.jpg';
    $field_job_title = isset($agent_detail->field_job_title[LANGUAGE_NONE]['0']['value']) ? $agent_detail->field_job_title[LANGUAGE_NONE]['0']['value'] : '';
    $profile_name = isset($agent_detail->field_firstname[LANGUAGE_NONE]['0']['value']) ? $agent_detail->field_firstname[LANGUAGE_NONE]['0']['value'].' ' : $agent_detail->name;
    $profile_name .= ' ' . isset($agent_detail->field_lastname[LANGUAGE_NONE]['0']['value']) ? $agent_detail->field_lastname[LANGUAGE_NONE]['0']['value'] : '';
    if (isset($agent_detail->field_preferred_name) && !empty($agent_detail->field_preferred_name)) {
      $profile_name = $agent_detail->field_preferred_name[LANGUAGE_NONE][0]['value'];
    }
    if (!empty($field_job_title)) {
      $profile_name = $profile_name . ', <span>' . $field_job_title . '</span>';
    }
    $phone = isset($agent_detail->field_phone_direct[LANGUAGE_NONE]['0']['value']) ? $agent_detail->field_phone_direct[LANGUAGE_NONE]['0']['value'] : '';
    $mobile = isset($agent_detail->field_phone_mobile[LANGUAGE_NONE]['0']['value']) ? $agent_detail->field_phone_mobile[LANGUAGE_NONE]['0']['value'] : '';
    $person_email = isset($agent_detail->field_person_email[LANGUAGE_NONE]['0']['value']) ? $agent_detail->field_person_email[LANGUAGE_NONE]['0']['value'] : '';
    $web_site = isset($agent_detail->field_agent_web_site[LANGUAGE_NONE]['0']['value']) ? $agent_detail->field_agent_web_site[LANGUAGE_NONE]['0']['value'] : '';
    $state_license = isset($agent_detail->field_state_license[LANGUAGE_NONE]['0']['value']) ? $agent_detail->field_state_license[LANGUAGE_NONE]['0']['value'] : '';
    $profile_image_img = '<img style=" height: 200px; width: auto;margin: 6px;" src="'.$profile_image.'" />';
    if (isset($listing_node->field_lms_other_agent)) {
      $uid1 = $listing_node->field_lms_other_agent[LANGUAGE_NONE]['0']['uid'];
      $agent_detail1 = user_load($uid1);

      $profile_image1 = isset($agent_detail1->picture->fid) ? file_create_url($agent_detail1->picture->uri) : '/sites/all/modules/custom/listing_marketing_system/images/default-image.jpg';
      $field_job_title1 = isset($agent_detail1->field_job_title[LANGUAGE_NONE]['0']['value']) ? $agent_detail1->field_job_title[LANGUAGE_NONE]['0']['value'] : '';    
      $profile_name1 = isset($agent_detail1->field_firstname[LANGUAGE_NONE]['0']['value']) ? $agent_detail1->field_firstname[LANGUAGE_NONE]['0']['value'].' ' : $agent_detail1->name;
      $profile_name1 .= isset($agent_detail1->field_lastname[LANGUAGE_NONE]['0']['value']) ? $agent_detail1->field_lastname[LANGUAGE_NONE]['0']['value'] : '';
      if (isset($agent_detail1->field_preferred_name) && !empty($agent_detail1->field_preferred_name)) {
        $profile_name1 = $agent_detail1->field_preferred_name[LANGUAGE_NONE][0]['value'];
      }
      if (!empty($field_job_title1)) {
        $profile_name1 = $profile_name1 . ', <span>' . $field_job_title1 . '</span>';
      }
      $phone1 = (isset($agent_detail1->field_phone_direct[LANGUAGE_NONE]['0']['value']) && !empty($agent_detail1->field_phone_direct[LANGUAGE_NONE]['0']['value'])) ? ' | '.$agent_detail1->field_phone_direct[LANGUAGE_NONE]['0']['value'] : '';
      $mobile1 = isset($agent_detail1->field_phone_mobile[LANGUAGE_NONE]['0']['value']) ? ' | '.$agent_detail1->field_phone_mobile[LANGUAGE_NONE]['0']['value'] : '';
      $person_email1 = isset($agent_detail1->field_person_email[LANGUAGE_NONE]['0']['value']) ? ' | '.$agent_detail1->field_person_email[LANGUAGE_NONE]['0']['value'] : '';
      $web_site1 = isset($agent_detail1->field_agent_web_site[LANGUAGE_NONE]['0']['value']) ? ' | '.$agent_detail1->field_agent_web_site[LANGUAGE_NONE]['0']['value'] : '';
      $state_license1 = isset($agent_detail1->field_state_license[LANGUAGE_NONE]['0']['value']) ? ' | '.$agent_detail1->field_state_license[LANGUAGE_NONE]['0']['value'] : '';
    }
    if(!empty($profile_name1)) {
      $aget2 = 1;
      $profile_name = '<div>' . $profile_name . '</div><div>' . $profile_name1 . '</div>';
      $phone = $phone . $phone1;
      $mobile = $mobile . $mobile1;
      $person_email = $person_email . $person_email1;
      $web_site = $web_site . $web_site1;
      $state_license = $state_license . $state_license1;
      $profile_image_img = '<img style=" height: 200px; width: auto;margin: 6px;" src="'.$profile_image.'" /><img style=" height: 200px; width: auto;margin: 6px;" src="'.$profile_image1.'" />';
    }
    
  }
  $header_image = ($listing_photos) ? image_style_url('1920x805', $listing_photos->field_lms_listing_photo['und']['0']['uri']) :  $base_url.'/sites/all/modules/custom/listing_marketing_system/images/tes.png';
?>
<div id="node-<?php print $node->nid.' '.$listing_nid;  ?>" class="<?php print $classes; ?>">
  <div class="lms-client-report-node">
    <div class="lms-client-report-header" style='position: relative;'><img src="<?php print $header_image; ?>"><div class="overlay"><img src="<?php print $base_url; ?>/sites/all/modules/custom/listing_marketing_system/images/cbrb-logo-320-187.jpg"><h1>PROPERTY MARKETING UPDATE</h1></div></div>
    <div class="lms-client-report-body">
      <div>Dear <?php print $node->field_client_salutation[LANGUAGE_NONE]['0']['value']; ?>,</div>
      <div class="report_intro_copy"><?php print $node->field_client_report_intro_copy[LANGUAGE_NONE]['0']['value']; ?></div>
      <div class="completed-item">
        <ul>
        <?php
          $clientreportitem = '';
          foreach($node->field_client_report_items[LANGUAGE_NONE] as $items) {
            $clientreportitem .= '<li>' . $items['value'].'</li>';
          }
          if (isset($nodedata['commerce_order']) && !empty($nodedata['commerce_order'])) {
            foreach($node->field_completed_item2[LANGUAGE_NONE] as $items) {
              $clientreportitem .= '<li>' . $items['value'].'</li>';
            }  
          }
          $clientreportitem = str_replace("ColdwellBankerHomes.com", "<a href='//www.ColdwellBankerHomes.com' target='_blank'>ColdwellBankerHomes.com</a>", $clientreportitem);
          $clientreportitem = str_replace("ColdwellBanker.com", "<a href='//www.ColdwellBanker.com' target='_blank'>ColdwellBanker.com</a>", $clientreportitem);
          $clientreportitem = str_replace("CBPLuxury.com", "<a href='//www.CBPLuxury.com' target='_blank'>CBPLuxury.com</a>", $clientreportitem);
          $clientreportitem = str_replace("video slideshow", $yourtubelink, $clientreportitem);
          if (isset($listingpdf) && !empty($listingpdf)) {
            foreach ($listingpdf as $key => $value) {
               if($key == 'probrochure') {
                 $clientreportitem = str_replace("high-end, professional property", $value, $clientreportitem);
               }
               if($key == 'postcard') {
                 $clientreportitem = str_replace("Just Listed postcard", $value, $clientreportitem);
               }
               if ($listing_node->status == 1) {
                 $clientreportitem = str_replace('property website', l('property website', 'http://www.homecb.com/node/'.$listing_node->nid), $clientreportitem);
               }
            }
          }
          if (isset($designnid) && !empty($designnid) ) {
            $clientreportitem = str_replace('property flyer', l('property flyer', 'download_pdf/'.$listing_node->nid.'/'.$designnid), $clientreportitem);
          }
          echo $clientreportitem;                  
        ?>
        <?php
          $lidata = '';
          if(isset($node->field_client_report_addl_items[LANGUAGE_NONE]['0']['value'])) {
            foreach($node->field_client_report_addl_items[LANGUAGE_NONE] as $items) {
              $lidata .= '<li>'.$items['value'].'</li>';
            }
          }
          echo $lidata;
          if (isset($node->field_additional_completed_items) && !empty($node->field_additional_completed_items)) {
            $string = $node->field_additional_completed_items[LANGUAGE_NONE][0]['value'];
            $string = strip_tags($string, '<a>');
            $bits = explode("\n", $string);
            $num = 1;
            foreach($bits as $bit) {                
               // if ( $num & 1 )  {
                  $newstring .= "<li>" . $bit . "</li>";
               // }
               // $num++;
              }
            echo $newstring;
          }
        ?>
        </ul>
      </div>
      <!--<div class="report_conclusion">Additionally, once per week I will be sending you a report from our HomeBase inSight platform which will show you all of the views your property is generating on our partner websites, including ColdwellBankerHomes.com, ColdwellBanker.com, Realtor.com, Zillow, Trulia and more.</div>-->
      <div class="report_conclusion"><?php print $node->field_client_report_conclusion[LANGUAGE_NONE]['0']['value']; ?></div>
      <div class="report-footer">
        <!--<div class="sincerely">Sincerely,</div>-->
        <div class="sender-info">
          <div class="sender-image"><?php print $profile_image_img; ?></div>
          <div class="sender-detail">
            <div class="name"><?php print $profile_name; ?></div>
            <div class="stattictext">Coldwell Banker</div>
            <div class="phone"><?php print $phone; ?></div>
            <div class="mobile"><?php print $mobile; ?></div>
            <div class="email"><?php print $person_email; ?></div>
            <div class="website"><?php print $web_site; ?></div>
            <div class="extra"><?php print str_replace('CA=', 'CalBRE #', $state_license); ?></div>
          </div>
        </div>
        <div class="disclaimer-text">©<?php echo date("Y"); ?> Coldwell Banker Real Estate LLC. All Rights Reserved. Coldwell Banker® is a registered trademark licensed to Coldwell Banker Real Estate LLC. An Equal Opportunity Company. Equal Housing Opportunity. Each Coldwell Banker Residential Brokerage Office is Owned by a Subsidiary of NRT LLC. Real Estate Agents affiliated with Coldwell Banker Residential Brokerage are Independent Contractor Sales Associates and are not employees of Coldwell Banker Real Estate LLC, Coldwell Banker Residential Brokerage or NRT LLC. CalBRE License #01908304.</div>
      </div>
    </div>
  </div>
</div>


