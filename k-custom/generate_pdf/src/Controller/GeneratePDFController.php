<?php
namespace Drupal\generate_pdf\Controller;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\File\FileSystem;
use TCPDF;

/**
 * Class GeneratePDFController.
 */
class GeneratePDFController extends ControllerBase {
  /**
   * Generatepdf.
   *
   * @return string
   *   Return Hello string.
   */
  public function generatepdf($desing_id) {
    pdftools($desing_id, 0);   
    return [
      '#type' => 'markup',
      '#markup' => $this->t('Implement method: generatepdf with parameter(s):'. $desing_id),
    ];
  }
  public function generateimage($desing_id) {
    pdftools($desing_id, 1); 
    return [
      '#type' => 'markup',
      '#markup' => $this->t('Implement method: generatepdf with parameter(s):'. $desing_id),
    ];
  }
  
  public function generateproductimage($product_id) {
        pdfproducttools($product_id, 1);
        return [
          '#type' => 'markup',
          '#markup' => $this->t('Implement method: generatepdf with parameter(s):'. $product_id),
        ];
  }
  
  public function generateproductpdf($product_id) {
        pdfproducttools($product_id, 0);
        return [
          '#type' => 'markup',
          '#markup' => $this->t('Implement method: generatepdf with parameter(s):'. $product_id),
        ];
  }
}
/**
 * Callback function pdf_image()
 * convert pdf to images
 **/
function pdf_image($pdf_file, $width_px, $height_px, $page_count, $pdf_url, $fabricDPI) {
  \Drupal::logger('pdf_file_image_data')->notice($width_px.'--'.$height_px.'--'.$page_count.'--'.$pdf_url.'--'.$fabricDPI);
  //print "page_count = $page_count<br/>";
  global $base_url;
  $time_stamp = time();
  $image_urls = array();
  //For the real path
  $absolute_path = \Drupal::service('file_system')->realpath('temporary://pdf/');
  file_prepare_directory($absolute_path,  FILE_CREATE_DIRECTORY);
  $resize = $width_px.'x'.$height_px;
  $page_format = isset($_REQUEST['page_format']) ? $_REQUEST['page_format'] : 'png';
  if($page_count > 1 || $page_format == 'pdf'){
    //print "page_count = $page_count<br/>";
    //$image_file_name = $absolute_path.'/pdfimage-%04d.png';
    if($page_format == 'pdf'){
      $image_file_name = $absolute_path.'/pdfimage.png';
    }
    else {
      $image_file_name = $absolute_path.'/pdfimage.'.$page_format;
    }
    $cmd = "rm -r $image_file_name 2>&1";
    exec($cmd,$op);
    //Success Command
    //$cmd = "magick -size $resize -density 300 $pdf_file -flatten -quality 100 $image_file_name 2>&1";
    //$cmd = "magick -size $resize -density 300 -colorspace sRGB $pdf_file -flatten -quality 100 -alpha off -append $image_file_name 2>&1";
    if($page_format == 'pdf'){
      $cmd =  "gs -sDEVICE=png16m -o $image_file_name -dJPEG=95 -r100x100 $pdf_file";
    }
    else {
      //$cmd = "convert -units PixelsPerInch -density 300 -background white -colorspace sRGB -alpha remove $pdf_file -append -resample $fabricDPI $image_file_name 2>&1";
      $cmd = "convert -resize $resize -units PixelsPerInch -density $fabricDPI -background white -colorspace sRGB -alpha remove $pdf_file -append  $image_file_name 2>&1";
      // convert -resize 1080x1080 -units PixelsPerInch -density 72 -background white -colorspace sRGB -alpha remove 5ff58c410483f35e591f4c84.pdf -append  test1.png
    }
    exec($cmd,$op);
    //\Drupal::logger('pdf_file_image_data')->notice($cmd);
    //print "<pre>";print_r($op);
    $image_data = file_get_contents($image_file_name);
    $file_path = 's3://listing-concierge/'.date('m').'/'.date('y').'/pdf-image/';
    if(!empty($image_data) && file_prepare_directory($file_path,  FILE_CREATE_DIRECTORY)){
      if($page_format == 'pdf'){
        $file_path .= 'pdf-thumb'.$time_stamp.'.png';
      }
      else {
        $file_path .= 'render'.$time_stamp.'.'.$page_format;
      }
      file_put_contents($file_path, $image_data);
      $cmd = "rm -r $pdf_file 2>&1";
      exec($cmd,$op);
      $cmd = "rm -r $image_file_name 2>&1";
      exec($cmd,$op);
      $image_url = file_create_url($file_path);
      $image_url_exp = explode("?", $image_url);
      $url = $image_url_exp[0];
      $image_urls['image_url'] = $url;
      if($page_format == 'pdf'){
        $image_urls['pdf_url'] = $pdf_url;
      }
    }
  }
  else {
    $image_file_name = $absolute_path.'/pdfimage.'.$page_format;
    //Success Command
    //$cmd = "magick -units PixelsPerInch -size $resize -density 300 $pdf_file -flatten -quality 100 -resample $fabricDPI $image_file_name 2>&1";
    $cmd = "convert -size $resize -units PixelsPerInch -density $fabricDPI -background white -colorspace sRGB -alpha remove $pdf_file -append  $image_file_name 2>&1";
    exec($cmd,$op);
    //print "<pre>";print_r($op);
    $image_data = file_get_contents($image_file_name);
    $file_path = 's3://listing-concierge/'.date('m').'/'.date('y').'/pdf-image/';
    if(!empty($image_data) && file_prepare_directory($file_path,  FILE_CREATE_DIRECTORY)){
      $file_path .= 'preview'.$time_stamp.'.'.$page_format;
      file_put_contents($file_path, $image_data);
      $cmd = "rm -r $pdf_file 2>&1";
      exec($cmd,$op);
      $cmd = "rm -r $image_file_name 2>&1";
      exec($cmd,$op);
      $image_url = file_create_url($file_path);
      $image_url_exp = explode("?", $image_url);
      $url = $image_url_exp[0];
      $image_urls['image_url'] = $url;
    }
  }
  //print "<pre>";print_r($image_urls);
  print json_encode( $image_urls );die();
}

function pdftools($desing_id, $post) {  
  $data = \Drupal::service('generate_pdf.default')->generatePDF($desing_id);
  $chr_map = array(
  // Windows codepage 1252
  "\xC2\x82" => "'", // U+0082⇒U+201A single low-9 quotation mark
  "\xC2\x84" => '"', // U+0084⇒U+201E double low-9 quotation mark
  "\xC2\x8B" => "'", // U+008B⇒U+2039 single left-pointing angle quotation mark
  "\xC2\x91" => "'", // U+0091⇒U+2018 left single quotation mark
  "\xC2\x92" => "'", // U+0092⇒U+2019 right single quotation mark
  "\xC2\x93" => '"', // U+0093⇒U+201C left double quotation mark
  "\xC2\x94" => '"', // U+0094⇒U+201D right double quotation mark
  "\xC2\x9B" => "'", // U+009B⇒U+203A single right-pointing angle quotation mark

  // Regular Unicode     // U+0022 quotation mark (")
                      // U+0027 apostrophe     (')
  "\xC2\xAB"     => '"', // U+00AB left-pointing double angle quotation mark
  "\xC2\xBB"     => '"', // U+00BB right-pointing double angle quotation mark
  "\xE2\x80\x98" => "'", // U+2018 left single quotation mark
  "\xE2\x80\x99" => "'", // U+2019 right single quotation mark
  "\xE2\x80\x9A" => "'", // U+201A single low-9 quotation mark
  "\xE2\x80\x9B" => "'", // U+201B single high-reversed-9 quotation mark
  "\xE2\x80\x9C" => '"', // U+201C left double quotation mark
  "\xE2\x80\x9D" => '"', // U+201D right double quotation mark
  "\xE2\x80\x9E" => '"', // U+201E double low-9 quotation mark
  "\xE2\x80\x9F" => '"', // U+201F double high-reversed-9 quotation mark
  "\xE2\x80\xB9" => "'", // U+2039 single left-pointing angle quotation mark
  "\xE2\x80\xBA" => "'", // U+203A single right-pointing angle quotation mark
  );
  $chr = array_keys($chr_map); // but: for efficiency you should
  $rpl = array_values($chr_map); // pre-calculate these two arrays
  //$mydata = json_decode($data);
  //print_r($mydata); exit;
  $mydata = json_decode($data->design);
  $mydata = $mydata->objects;
  $page_settings_data = $data->des->original;
  $page_bleed = $page_settings_data->page_bleed;
  $trim_marks = $page_settings_data->trim_marks;
  //$dpi = isset($page_settings_data->fabricDPI) ? $page_settings_data->fabricDPI : 72;
  $dpi = 72;
  $fabricDPI = isset($page_settings_data->fabricDPI) ? $page_settings_data->fabricDPI : 72;
  
  //echo $page_bleed; die('here');
  
  if($post == 1){
    $dpi = 72;
  }
  $pages = [];
  $width_in = 600/$dpi;
  $height_in = 600/$dpi;
  $width_px = 600;
  $height_px = 600;
  $page_count = 0;
  function cmp($a, $b)
  {
    return strcmp($a["order"], $b["order"]);
  }

  usort($mydata, "cmp");
  $pageorder = [];
  foreach($mydata as $key => $value) {
    if($value->type == 'page') {
      $pageorder[$value->id]['page'] = $value;
      $width_in = $value->width/$dpi;
      $height_in = $value->height/$dpi;
      $width_px = $value->width;
      $height_px = $value->height;
      $page_count++;
    }
    else if ($value->type != 'line') {
      $pageorder[$value->page]['data'][] = $value;
    }
  }
  foreach($pageorder as $key => $value) {
    if(isset($value['page']) && $value['page']->type == 'page') {
     $pages[$value['page']->order] = $value;
    }
  }
  ksort($pages);
  if(isset($_REQUEST['pdf_image'])){
    $post = 1;
    $pdf_image = $_REQUEST['pdf_image'];
  }
  if (isset($pages)){
  $orientation='P'; // For portrait
  $unit='in';
  $format = array($width_in,$height_in );
  $pdf = new TCPDF('', $unit, $format, true, 'UTF-8', false);
  // define some HTML content with style
  $html = '';
  $pdf->SetCreator(PDF_CREATOR);
  $pdf->SetMargins(0, 0, 0, true);
  $pdf->SetLeftMargin(0);
  $pdf->SetRightMargin(0);
  $pdf->SetHeaderMargin(0);
  $pdf->SetFooterMargin(0);
  $pdf->setPrintFooter(false);
  $pdf->setPrintHeader(false);
  // set auto page breaks false
  $pdf->SetAutoPageBreak(false, 0);
  /*$pdf_data_obj = array();
  foreach($mydata as $key=>$pdf_data){
    if(!empty($pdf_data)){
  $pdf_data_obj[] = $pdf_data;
    }
  }*/
  $count = count($pages);
  //print "Count Page = $count";exit;
  //if($desing_id == '6081994484d9ac6a8042f813'){print "<pre>";print_r($pages);exit;}
  //$count = count($pages);

  $pageno = 1;
  foreach($pages as $key => $value) {
    $page = $value['page'];
    if(isset($value['data']) && !empty($value['data'])) {
    $width_in = ($page->width/$dpi);
    $height_in = ($page->height/$dpi);
    $resolution = array($width_in, $height_in);
    $orientation = ($height_in>$width_in) ? 'P' : 'L';
    /*// set page format (read source code documentation for further information)
    $page_format = array(
        'MediaBox' => array ('llx' => 0, 'lly' => 0, 'urx' => 210, 'ury' => 297),
        'CropBox' => array ('llx' => 0, 'lly' => 0, 'urx' => 210, 'ury' => 297),
        'BleedBox' => array ('llx' => 5, 'lly' => 5, 'urx' => 205, 'ury' => 292),
        'TrimBox' => array ('llx' => 10, 'lly' => 10, 'urx' => 200, 'ury' => 287),
        'ArtBox' => array ('llx' => 15, 'lly' => 15, 'urx' => 195, 'ury' => 282),
        'Dur' => 3,
        'trans' => array(
            'D' => 1.5,
            'S' => 'Split',
            'Dm' => 'V',
            'M' => 'O'
         ),
        'Rotate' => 90,
        'PZ' => 1,
    );*/
    $page_format = array(
      'MediaBox' => array ('llx' => 0, 'lly' => 0, 'urx' => $width_in, 'ury' => $height_in),
      'CropBox' => array ('llx' => 0, 'lly' => 0, 'urx' => $width_in, 'ury' => $height_in),
      'BleedBox' => array ('llx' => (5/72), 'lly' => (5/72), 'urx' => $width_in-(5/72), 'ury' => $height_in-(5/72)),
      'TrimBox' => array ('llx' => (10/72), 'lly' => (10/72), 'urx' => $width_in-(10/72), 'ury' => $height_in-(10/72)),
      'ArtBox' => array ('llx' => (15/72), 'lly' => (15/72), 'urx' => $width_in-(15/72), 'ury' => $height_in-(15/72)),
      $width_in, 
      $height_in
    );
    
    
    
    $pdf->AddPage($orientation, $page_format);
    $pdf->setPage($pageno, true);
    $change_top = (($page->top) / $dpi);
    if (isset($page->originY) && $page->originY == 'center') {
      $change_top = $change_top - ($height_in/2);
    }
    $change_left = (($page->left) / $dpi);
    if (isset($page->originX) && $page->originX == 'center') {
      $change_left = $change_left - ($width_in/2);
    }
    //$cnv_obj = str_replace('\u2019', '\'', $pdf_data_obj[$i]);
    //$obj = json_decode($cnv_obj);
    $json_data = $value['data'];
    //echo '<pre>'; print_r($json_data); echo '</pre>'; exit;
    //set bacground image
    if (isset($page->backgroundImage->src)){
       $background_image_path = $page->backgroundImage->src;
       $pdf->Image($background_image_path, 0, 0, $width_in, $height_in, 'JPG', '', '', true, 200, '', false, false, 0, false, false, true);
    }
    elseif(isset($page->backgroundColor) && !empty($page->backgroundColor)) {
      $bg = Hex2RGB($page->backgroundColor);
      $pdf->Rect(0, 0, $width_in, $height_in, 'F', "",  $bg);
    }
    else {
      $bg = Hex2RGB('#FFFFFF');
      $pdf->Rect(0, 0, $width_in, $height_in, 'F', "",  $bg);
    }
    foreach ($json_data as $key => $object) {
      $pdf->StartTransform();
      $left = (($object->left) / $dpi )- $change_left;
      $top = (($object->top) / $dpi) - $change_top;
      if ($left < 0 ){$left *= -1;}
      if ($top < 0 ){$top *= -1;}
      $width = ($object->width * $object->scaleX) / $dpi;
      $height = ($object->height * $object->scaleY) / $dpi;
      $object->opacity = 1;
      switch ($object->type) {
        case 'textbox':
         // print_r($object); exit;
          if($object->originY == "center") {
            $top = $top - ($height/2);
          }
          if( $object->originX == "center") {
            $left = $left - ($width/2);
          }
          $align = $object->textAlign ? substr(ucwords($object->textAlign),0,1): '';
          $style = ''; //$object->fontStyle ? $object->fontStyle : '';
          $newColor = Hex2RGB($object->fill);
          $fontFamily = $object->fontFamily;
          if(strpos($fontFamily, 'bold') || strpos($fontFamily, 'Bold')) {
            //$fontFamily = preg_replace("/s+/", '', $fontFamily);
            $fontFamily = preg_replace("/ /", '', $fontFamily);
            $fontFamily = preg_replace('/bold/', '', $fontFamily);
            $fontFamily = preg_replace('/Bold/', '', $fontFamily);
            //$fontFamily = preg_replace("/s$/", '', $fontFamily);
            $fontFamily = $fontFamily.'b';
          }
          if(strpos($fontFamily, 'italic') || strpos($fontFamily, 'Italic')) {
            //$fontFamily = preg_replace("/s+/", '', $fontFamily);
            $fontFamily = preg_replace("/ /", '', $fontFamily);
            $fontFamily = preg_replace('/italic/', '', $fontFamily);
            $fontFamily = preg_replace('/Italic/', '', $fontFamily);
            $fontFamily = $fontFamily.'i';
          }
          if((strpos($fontFamily, 'sans') || strpos($fontFamily, 'Sans'))) {
            $fontFamily = preg_replace("/sans/", '/san/', $fontFamily);
          }
          $fontFamily = preg_replace("/ /", '', $fontFamily);
          $textbox_value = '';            
          $str_lines = explode(PHP_EOL, $object->text);
          $lines = count($str_lines); 
          foreach($str_lines as $l => $line_txt){
            //add bold italic and underline tag.
            $objectStyles = $object->styles->{$l};
            if(!empty($objectStyles)) {
              $obj_styles = array();
              foreach($objectStyles as $key => $value) {
                if(isset($value->textDecoration)) {
                  if(isset($value->underline) && $value->underline == 1) {
                    $obj_styles[$key] = 'underline';
                  }
                   if(isset($value->linethrough) && $value->linethrough == 1) {
                    $obj_styles[$key] = 'linethrough';
                  }
                }
              }
              
              if(!empty($obj_styles)){
                $line_txt = str_replace($chr, $rpl, html_entity_decode($line_txt, ENT_QUOTES, "UTF-8"));
                $str_arr = str_split($line_txt);
                foreach($str_arr as $key3 => $value3) {
                  if(isset($obj_styles[$key3])){
                    if($obj_styles[$key3] == 'linethrough'){
                      $str_arr[$key3] = '<del>'.$value3.'</del>';
                    }
                   if($obj_styles[$key3] == 'underline'){
                      $str_arr[$key3] = '<u>'.$value3.'</u>';
                    }
                  }
                }
                
                $line_txt = implode("", $str_arr);
               /* $line_txt = str_replace("</i></b><b><i>","", $line_txt);
                $line_txt = str_replace("</i></b> <b><i>","", $line_txt);
                $line_txt = str_replace("</u></i></b><b><i><u>","", $line_txt);
                $line_txt = str_replace("</u></i></b> <b><i><u>","", $line_txt);
                $line_txt = str_replace("</u></b><b><u>","", $line_txt);
                $line_txt = str_replace("</u></b> <b><u>","", $line_txt);
                $line_txt = str_replace("</u></i><i><u>","", $line_txt);
                $line_txt = str_replace("</u></i> <i><u>","", $line_txt);
                $line_txt = str_replace("</b><b>","", $line_txt);
                $line_txt = str_replace("</b> <b>","", $line_txt);
                $line_txt = str_replace("</i><i>","", $line_txt);
                $line_txt = str_replace("</i> <i>","", $line_txt);
                $line_txt = str_replace("</u><u>","", $line_txt);
                $line_txt = str_replace("</u> <u>","", $line_txt);*/
                $pos = strpos($line_txt, "<b>");
                if(($font_family == 'robotolight' || $font_family == 'robotocondensed') && $pos !== false){
                  $font_family = 'roboto';
                  $font_weight = '';
                  $style = '';
                }
              }
            }
            $line_txt = str_replace("'s", "&rsquo;s", $line_txt);
            // collect all the text line by line
            $textbox_value .= $line_txt;
            if(($l+1) < $lines)
              $textbox_value .= '<br>';
            }
            $link_url = isset($object->associatedUrl) ? $object->associatedUrl: '';
            if($link_url){
              $textbox_value = '<a href="'.$link_url.'">'.$textbox_value.'</a>';
            }
            $newColor = $object->fill;
            $color = Hex2RGB($newColor);
            $pdf->setXY($left, $top);
            $pdf->Rotate(360-$object->angle);
            $pdf->SetCellPadding(0);
            $objspacing = $object->charSpacing;
            $font_decoration = '';
            if (isset($object->underline) && $object->underline == 1) {
              $font_decoration .= 'U';
            } 
            if (isset($object->overline) && $object->overline == 1) {
              $font_decoration .= 'O';
            } 
            if (isset($object->linethrough) && $object->linethrough == 1) {
              $font_decoration .= 'D';
            }
            
            if( $objspacing != 0 ){
              //$spacing = $object->charSpacing/$dpi;
              //$pdf->setFontStretching(110);
            }
            $spacing = $object->charSpacing/10000;
            //$spacing = $object->charSpacing/1000;
            //$spacing = $object->charSpacing/$dpi;
            $pdf->setFontSpacing($spacing);
            //$pdf->setCellHeightRatio(1.2$dpi648);
            if($object->lineHeight){
              $pdf->setCellHeightRatio($object->lineHeight * 1.1178);
            }
            else {
              $pdf->setCellHeightRatio(1);
            }
            $get_fontsize = ($object->fontSize*$object->scaleY/ $dpi)*72; //convert to 'pt'
            //save copy $pdf->SetFont($fontFamily, $font_weight.$style.$font_decoration,$get_fontsize, '', true);
            $pdf->SetFont($fontFamily, $font_decoration, $get_fontsize, '', false);
            $pdf->SetTextColor($color[0], $color[1], $color[2]);
            if(isset($object->fill->type)){
              if($object->fill->type == 'linear'){
                $color1 = $object->fill->colorStops[0]->color;
                $color2 = $object->fill->colorStops[1]->color;
                $coords = $object->fill->coords;
                $pdf->LinearGradient(20, 45, 80, 80, $color1, $color2, $coords);
              }
            }
            if(isset($object->shadow->offsetX)){
              $pdf->setTextShadow(array('enabled'=>true, 'depth_w'=>$object->shadow->offsetX, 'depth_h'=>$object->shadow->offsetY, 'color'=>$object->shadow->color, 'opacity'=>0.3, 'blend_mode'=>'Normal'));
            }
            //set Transform
            $opacity = isset($object->dynamic_opacity_range) ? $object->dynamic_opacity_range : $object->opacity;
            $pdf->SetAlpha($opacity);
            $pdf->MultiCell($width, $height, $textbox_value, 0, $align, false, 1, '', '', true, 0, True, true, 0, 'T', false);
            $pdf->setXY($left, $top);
            //Restore Transform
            $pdf->SetAlpha();
          break;
          case 'image':
             if (!empty($object->src)) {
              if (isset($object->angle) && $object->angle != 0) {
                $left = (($object->tl->x) / $dpi )- $change_left;
                $top = (($object->tl->y) / $dpi) - $change_top;
                if ($left < 0 ){$left *= -1;}
                if ($top < 0 ){$top *= -1;}
              } else {
                if($object->originY == "center") {
                  $top = $top - ($height/2);
                }
                if( $object->originX == "center") {
                  $left = $left - ($width/2);
                }
              }
              $pdf->setXY($left, $top);
              $pdf->Rotate(360-$object->angle);
              $pdf->StartTransform();
              if ($object->flipX) {
                $pdf->MirrorV();
              }
              if($object->flipY) {
                $pdf->MirrorH();
              }
              $link_url = isset($object->associatedUrl) ? $object->associatedUrl: '';
              //set Transform
              //$object_dynamic_image_opacity_range = isset($object->dynamic_image_opacity_range) ? $object->dynamic_image_opacity_range : 1;
              $opacity = isset($object->dynamic_image_opacity_range) ? $object->dynamic_image_opacity_range : $object->opacity;
              $pdf->SetAlpha($opacity);
              $pdf->setJPEGQuality(100);
							$pdf->setImageScale(1.53);
              $nodeerify = preg_match('/data:([^;]*);base64,(.*)/', $object->src, $match);
              if($nodeerify){
                $dataPieces = explode(',',$object->src);
                $encodedImg = $dataPieces[1];
                $imgdata = base64_decode($encodedImg);
                $pdf->Image('@'.$imgdata, '', '', $width , $height, '',$link_url, '', false, 300, '', false, false, 0);            //Restore Transform
              }
              else {
                $image_url = $object->src;
                $parts = parse_url($image_url);
                if (isset($parts['query'])) {
                  parse_str($parts['query'], $queryimage);
                  if (isset($queryimage['filname_path'])) {
                    $image_url = $queryimage['filname_path'];
                  }
                }
                $image_url = str_replace('__low','', $image_url);
                $pdf->Image($image_url, $left, $top, $width , $height, '',$link_url, '', false, 300, '', false, false, 0);
              }
              //$pdf->Image('@'.$imgdata, '', '', $width , $height, '',$link_url, '', false, 300, '', false, false, 0);            //Restore Transform
              ////$pdf->setXY($left, $top);
              //$pdf->Rotate(360-$object->angle);
              //Restore Transform
              $pdf->SetAlpha();
              $pdf->StopTransform();
            }
            break;
            case 'path-group':
              $left_grp = ($object->left+ $object->scaleX/2) /$dpi;
              $top_grp =  ($object->top + $object->scaleY/2) /$dpi;
              //$left_grp = ( ($object->left + $object->strokeMiterLimit + $object->strokeWidth) - ($width/2) )/$dpi;
              if($left_grp < 0 ){$left_grp *= -1;}
              if($top_grp < 0 ){$top_grp *= -1;}
              $pdf->setXY($left_grp, $top_grp);
              $pdf->Rotate(360-$object->angle);
              $link_url = isset($object->associatedUrl) ? $object->associatedUrl: '';
              //set Transform
              $opacity = isset($object->dynamic_opacity_range) ? $object->dynamic_opacity_range : $object->opacity;
              $pdf->SetAlpha($opacity);
              if(isset($object->svgassociatedUrl)){
                $dir_uri = file_stream_wrapper_get_instance_by_uri('modules://');
                $real_path = $dir_uri->realpath();
                $real_path_explode = explode('/sites', $real_path);
                $file_path = $real_path_explode[0]."".$object->svgassociatedUrl;
                $svg_content = file_get_contents($file_path);  
                $find_string   = '<svg';
                $position = strpos($svg_content, $find_string);
                $svg_file_new = substr($svg_content, $position);
                $svgString = str_replace('<svg', '<svg preserveAspectRatio="none"', $svg_file_new);
                $pdf->ImageSVG('@' . $svgString, $left_grp, $top, $width , $height, '',$link_url, '', false, 300, '', false, false, 0);
              }
              else{
                $pdf->ImageSVG($object->paths, $left_grp, $top, $width , $height, '',$link_url, '', false, 300, '', false, false, 0);
              }
              //Restore Transform
              $pdf->SetAlpha();
            break;
            case 'Rectshape':
              //$left = (($object->left) / $dpi )- $change_left;
             // $top = (($object->top) / $dpi) - $change_top;
             // $width = ($object->width * $object->scaleX) / $dpi;
             // $height = ($object->height * $object->scaleY) / $dpi;
              //print_r($object); exit;
              if($object->originY == "center") {
                $top = $top - ($height/2);
              }
              if( $object->originX == "center") {
                $left = $left - ($width/2);
              }
              $pdf->setXY($left, $top);
              $pdf->Rotate(360 - $object->angle);
              $color = Hex2RGB($object->fill);
              $scolor = Hex2RGB($object->stroke);
              $df = 'F';
              if (isset($object->strokeWidth) && $object->strokeWidth > 0 ) {
                $df = 'DF';
                $pdf->SetLineStyle(array('width' => ($object->strokeWidth/$dpi), 'cap' => $object->strokeLineCap, 'join' => $object->strokeLineJoin, 'dash' =>  $object->strokeDashOffset, 'color' => $scolor));
              }
              $opacity = isset($object->dynamic_opacity_range) ? $object->dynamic_opacity_range : $object->opacity;
              $pdf->SetAlpha($opacity);
              if ($object->rx == 0) {
                $pdf->Rect($left, $top, $width, $height, $df, '', $color);
              }
              else {
              //  $pdf->RoundedRect(0.5, 0.5,  $width, $height, 3.50, '1111', 'DF');
                $pdf->StartTransform();
                //$pdf->Rotate(360 - $object->angle);
                //$pdf->RoundedRect($left, $top, $width, $height, $object->rx/$dpi, 1111, 'DF', '', $color);
                $dynamic_corner = $object->dynamic_corner;
                if($dynamic_corner == 100) {
                  //$pdf->RoundedRect($left, $top, $width, $height, 100/$dpi, '1111', $df, '', $color);
                  $pdf->RoundedRectXY($left, $top, $width, $height, $width/2, $height/2, '1111', $df, '', $color);
                } else {
                  $pdf->RoundedRect($left, $top, $width, $height, $dynamic_corner/$dpi, '1111', $df, '', $color);
                }
                $pdf->StopTransform();
              }
              $pdf->SetAlpha();
            break;
            case 'Lineshape':
              //print_r($object);
              $left = (($object->left) / $dpi )- $change_left;
              $top = (($object->top) / $dpi) - $change_top;
              $width = ($object->width * $object->scaleX) / $dpi;
              $height = ($object->height * $object->scaleY) / $dpi;
              $x1 = (((int)$object->x1)/$dpi);
              $x2 = (((int)$object->x2)/$dpi);
              $y1 = (((int)$object->y1)/$dpi);
              $y2 = (((int)$object->y2)/$dpi);
              $color = Hex2RGB($object->stroke);
              $style = array('width' => ($object->strokeWidth/$dpi), 'cap' => $object->strokeLineCap, 'join' => $object->strokeLineJoin, 'dash' => 0, 'phase' => 10, 'color' => $color);
              $pdf->setXY($left, $top);
              $pdf->Rotate(360 - $object->angle);
              $pdf->StartTransform();
              if ($object->flipX) {
                $pdf->MirrorV();
              }
              if($object->flipY) {
                $pdf->MirrorH();
              }
              $opacity = isset($object->dynamic_opacity_range) ? $object->dynamic_opacity_range : $object->opacity;
              $pdf->SetAlpha($opacity);
              $pdf->Line(($left + $x1), ($top + $y1), ($left + $x2 ), ($top + $y2), $style);
              $pdf->SetAlpha();
              $pdf->StopTransform();
              // print ($left - ($object->x1/$dpi)).'--'. $top.'--'. ($left - ($object->x2/$dpi)).'--'. $top;
              // print '---------------------';
              // print '========='.$x1.'========='.$x2;
              // print '=====================';
            break;
            case 'circle':
              //print_r($object); exit;
             // $left = (($object->left) / $dpi ) - $change_left;
             // $top = (($object->top) / $dpi) - $change_top;
              $width = (($object->width * $object->scaleX) / $dpi) + ($object->strokeWidth/$dpi) - ($object->strokeMiterLimit/$dpi);
              $height = (($object->height * $object->scaleY) / $dpi);
              $color = Hex2RGB($object->fill);
              $scolor = Hex2RGB($object->stroke);
              $style_bollino = array();
              $df = 'F';
              if (isset($object->strokeWidth) && $object->strokeWidth > 0 ) {
               $df = 'DF';
               $style_bollino = array(20, 'butt', 'miter', 0, 0, $scolor);
               $pdf->SetLineStyle(array('width' => ($object->strokeWidth/$dpi), 'cap' => $object->strokeLineCap, 'join' => $object->strokeLineJoin, 'dash' => $object->strokeDashOffset, 'color' => $scolor));
              }
              if($object->scaleX == $object->scaleY) {
                if($object->originY == "center") {
                  $top = $top - ($height/2);
                }
                if( $object->originX == "center") {
                  $left = $left - ($width/2);
                }
               $opacity = isset($object->dynamic_opacity_range) ? $object->dynamic_opacity_range : $object->opacity;
               $pdf->SetAlpha($opacity);
               $pdf->Circle(($left + (($object->radius/$dpi)* $object->scaleX)), ($top + (($object->radius/$dpi)* $object->scaleX)), ($object->radius/$dpi * $object->scaleX), $object->startAngle, 360, $df, $style_bollino, $color);
               $pdf->SetAlpha();
              }
              else {
                //$rdata = rotatedTopLeft($left, $top, (($object->radius/$dpi) * $object->scaleX), (($object->radius/$dpi) * $object->scaleY), (360 - $object->angle));
                $pdf->StartTransform();
                //$pdf->Rotate();
                //if ($object->angle != 0 || $object->angle != 360) {
                  //$pdf->Ellipse( $rdata['rx'], $rdata['ry'], (($object->radius/$dpi) * $object->scaleX), (($object->radius/$dpi) * $object->scaleY), $object->angle, $object->startAngle, 360, 'DF',  $style_bollino, $color, '', (360 - $object->angle), $object->startAngle, $object->endAngle);
                //}
                //else {
                //print_r($rdata);exit;
                //$pdf->Ellipse(175,103,30,15,45);
                //$pdf->Ellipse($left,$top,(($object->radius/$dpi) * $object->scaleX),(($object->radius/$dpi) * $object->scaleY), (360 - $object->angle));
                 //print '--=';
                 //print  $Cx = $left - ((($object->radius/$dpi)* $object->scaleX)  * cos((360 - $object->angle) * pi() / 180));
                //print '---=';
                //print  $Cy = $top + ((($object->radius/$dpi)* $object->scaleY) * sin((360 - $object->angle) * pi() / 180));
               //exit;
               //// $pdf->setXY($left, $top);
                //$pdf->Rotate(360 - $object->angle);
                $opacity = isset($object->dynamic_opacity_range) ? $object->dynamic_opacity_range : $object->opacity;
                $pdf->SetAlpha($opacity);
               // $pdf->Ellipse(($left + ($object->radius/192)), ($top + ($object->radius/192)),(($object->radius/$dpi) * $object->scaleX),(($object->radius/$dpi) * $object->scaleY));
                //$pdf->Circle(($left + ($object->radius/$dpi)), ($top + ($object->radius/$dpi)), ($object->radius/$dpi), $object->startAngle, 360, 'DF', $style_bollino, $color);
                if($object->originY == "center") {
                  $top = $top - ($height/2);
                }
                if( $object->originX == "center") {
                  $left = $left - ($width/2);
                }
                $pdf->Ellipse(($left + (($object->radius/$dpi)* $object->scaleX)), ($top + (($object->radius/$dpi) * $object->scaleY)), (($object->radius/$dpi) * $object->scaleX), (($object->radius/$dpi) * $object->scaleY), (360 - $object->angle), $object->startAngle, 360, $df,  $style_bollino, $color); 
                //, '', $object->angle, $object->startAngle, $object->endAngle);
                $pdf->SetAlpha();
                $pdf->StopTransform();
                //$pdf->Ellipse($left, $top, 15/$dpi,7.50/$dpi, 45/$dpi, 270, 360, 'F', $style6, array(220, 200, 200));
                //$pdf->Ellipse(($left + (($object->radius/$dpi)* $object->scaleX)),  (($top +($object->strokeWidth/$dpi)) + (($object->radius/$dpi) * $object->scaleY)), (($object->radius/$dpi) * $object->scaleX), (($object->radius/$dpi) * $object->scaleY), (360 - $object->angle), 0, 360, '', array(), $color, 8);
                //}
                //$pdf->Ellipse($left, $top, (($object->radius/$dpi) * $object->scaleX), (($object->radius/$dpi) * $object->scaleY), 0, $object->startAngle, 360, 'DF',  $style_bollino, $color, '', $object->angle, $object->startAngle, $object->endAngle);
                //$pdf->StopTransform();
              }
              //print_r($object); exit;
            break;
            /*case 'Lineshape':
              $left = (($object->left) / $dpi )- $change_left;
              $top = (($object->top) / $dpi) - $change_top;
              $width = ($object->width * $object->scaleX) / $dpi;
              $height = ($object->height * $object->scaleY) / $dpi;
              //print_r($object); exit;

              $color = Hex2RGB($object->fill);
              $pdf->Rect($left, $top, $width, $height, 'DF', '', $color);
            break;
            case 'triangle':
              $left = (($object->left) / $dpi )- $change_left;
              $top = (($object->top) / $dpi) - $change_top;
              $width = ($object->width * $object->scaleX) / $dpi;
              $height = ($object->height * $object->scaleY) / $dpi;
              //print_r($object); exit;

              $color = Hex2RGB($object->fill);
              $pdf->Rect($left, $top, $width, $height, 'DF', '', $color);
            break;*/
          default:
          break;
          }
          $pdf->StopTransform();
        }
          if($page_bleed == 1){
            $pdf->cropMark(0.320, 0.320, 0.57, 0.57, 'A');//left top
            $pdf->cropMark(($width_in-0.35), 0.320, 0.57, 0.57, 'b');//right top
            $pdf->cropMark(0.320,($height_in-0.35), 0.57, 0.57, 'c');//left bottom
            $pdf->cropMark(($width_in-0.35),($height_in-0.35), 0.57, 0.57, 'D');// right bottom
          }
          $pdf->endPage();
          $pageno++;
        }
      }
      //exit;
      $pdf->Close();
      //die('here');
      //exit;
      $time_stamp = time();
      $absolute_path = \Drupal::service('file_system')->realpath('temporary://pdf');
      file_prepare_directory($absolute_path,  FILE_CREATE_DIRECTORY);
      $local_path = $absolute_path.'/'.$desing_id.'.pdf';
      $pdf->Output($local_path, 'F');
      if($post == 1){
        $file_name = $desing_id.'.pdf';
        //print "page_count = $page_count<br/>";
        $images = pdf_image($local_path, $width_px, $height_px, $page_count, '', $fabricDPI);
        //print_r($images);
        //print '<br/>**url**<br/>';
        // foreach ($images as $key => $url) {
          // $img = basename($url).'.png'; 
          // print $url;
          // Function to write image into file 
         // header('Content-Type: ' . mime_content_type($url));
         // header('Content-Length: ' . filesize($url));
         // header("Content-Transfer-Encoding: Binary"); 
         // header("Content-disposition: attachment; filename=\"" . basename($url) . "\"");
         // readfile($url);
          //
        // }
       // die('this');
      }
      else {
        //$pdf->Output($local_path, 'F');
        $pdf_data = file_get_contents($local_path);
        $file_path = 's3://listing-concierge/'.date('m').'/'.date('y').'/pdf/';
        if(!empty($pdf_data) && file_prepare_directory($file_path,  FILE_CREATE_DIRECTORY)){
          if($post){
            $file_path .= 'preview'.$time_stamp.'.pdf';
          }
          else {
            $file_path .= 'preview'.$design_id.$time_stamp.'.pdf';
          }
          file_put_contents($file_path, $pdf_data);
          //$cmd = "rm -r $local_path 2>&1";
          //exec($cmd,$op);
        }
        if($post){
          print $time_stamp;
        }
        else {
          $file_name = 'preview'.$nid.$design_id.$time_stamp.'.pdf';
          //$url = $base_url.'/sites/all/modules/custom/collateral_design_system/files/preview'.$file_name;
          $url = $file_path.$file_name;
          $url = file_create_url($file_path);
          if(isset($_REQUEST['page_format'])){
            $url_exp = explode("?", $url);
            //$image_urls = array('image_url' => $url_exp[0]);
            //print json_encode( $image_urls );die();
            $images = pdf_image($local_path, $width_px, $height_px, $page_count, $url_exp[0], $fabricDPI);
          }
          else {
            header('Content-disposition: attachment; filename="'.$file_name.'"');
            header("Content-Type: application/octet-stream");
            readfile($url);
          }
        }
      }
    

  } //end of code to create pdf using tcpdf
}


function pdf_image_download($files) {
  foreach ($files as $key => $url) {
    $img = basename($url).'.png';  
    // Function to write image into file 
    header('Content-Type: ' . mime_content_type($url));
		header('Content-Length: ' . filesize($url));
		header("Content-Transfer-Encoding: Binary"); 
		header("Content-disposition: attachment; filename=\"" . basename($url) . "\"");
		readfile($url);
		//die();
  }
}
function Hex2RGB($color){
  $color = str_replace('#', '', $color);
  if (strlen($color) != 6){ return array(0,0,0); }
  $rgb = array();
  for ($x=0;$x<3;$x++){
    $rgb[$x] = hexdec(substr($color,(2*$x),2));
  }
  return $rgb;
}


function rotatedTopLeft($x,$y,$width,$height,$rotationAngle){
  $cx=$x+$width/2;
  $cy=$y+$height/2;
  // calc the angle of the unrotated TL corner vs the center point
  $dx=$x-$cx;
  $dy=$y-$cy;
  $originalTopLeftAngle = atan2($dy,$dx);

    // Add the unrotatedTL + rotationAngle to get total rotation
    $rotatedTopLeftAngle = $originalTopLeftAngle + $rotationAngle;
    // calc the radius of the rectangle (==diagonalLength/2)
    $radius = sqrt($width * $width + $height * $height)/2;
    $result = [];
    // calc the rotated top & left corner
    $result['rx'] = $cx + $radius * cos($rotatedTopLeftAngle);

    $result['ry'] = $cy + $radius * sin($rotatedTopLeftAngle);
    // return the results
    return $result;
}


function pdfproducttools($product_id, $post) {
  $data = \Drupal::service('generate_pdf.default')->generateproductPDF($product_id);
  //$data = \Drupal::service('generate_pdf.default')->generateproductPDF('60df7bdddcdd6f357c02bbf6');
  $chr_map = array(
  // Windows codepage 1252
  "\xC2\x82" => "'", // U+0082⇒U+201A single low-9 quotation mark
  "\xC2\x84" => '"', // U+0084⇒U+201E double low-9 quotation mark
  "\xC2\x8B" => "'", // U+008B⇒U+2039 single left-pointing angle quotation mark
  "\xC2\x91" => "'", // U+0091⇒U+2018 left single quotation mark
  "\xC2\x92" => "'", // U+0092⇒U+2019 right single quotation mark
  "\xC2\x93" => '"', // U+0093⇒U+201C left double quotation mark
  "\xC2\x94" => '"', // U+0094⇒U+201D right double quotation mark
  "\xC2\x9B" => "'", // U+009B⇒U+203A single right-pointing angle quotation mark

  // Regular Unicode     // U+0022 quotation mark (")
                      // U+0027 apostrophe     (')
  "\xC2\xAB"     => '"', // U+00AB left-pointing double angle quotation mark
  "\xC2\xBB"     => '"', // U+00BB right-pointing double angle quotation mark
  "\xE2\x80\x98" => "'", // U+2018 left single quotation mark
  "\xE2\x80\x99" => "'", // U+2019 right single quotation mark
  "\xE2\x80\x9A" => "'", // U+201A single low-9 quotation mark
  "\xE2\x80\x9B" => "'", // U+201B single high-reversed-9 quotation mark
  "\xE2\x80\x9C" => '"', // U+201C left double quotation mark
  "\xE2\x80\x9D" => '"', // U+201D right double quotation mark
  "\xE2\x80\x9E" => '"', // U+201E double low-9 quotation mark
  "\xE2\x80\x9F" => '"', // U+201F double high-reversed-9 quotation mark
  "\xE2\x80\xB9" => "'", // U+2039 single left-pointing angle quotation mark
  "\xE2\x80\xBA" => "'", // U+203A single right-pointing angle quotation mark
  );
  $chr = array_keys($chr_map); // but: for efficiency you should
  $rpl = array_values($chr_map); // pre-calculate these two arrays
  //$mydata = json_decode($data);
  //print_r($mydata); exit;
  $mydata = json_decode($data->product);
  $mydata = $mydata->objects;
  $page_settings_data = $data->des->original;
  if(isset($_REQUEST['masoom'])){print "<pre>";print_r($page_settings_data);exit;}
  $page_bleed = $page_settings_data->page_bleed;
  $trim_marks = $page_settings_data->trim_marks;
  $km_bleed = $page_settings_data->km_bleed;
  $km_cmyk = $page_settings_data->km_cmyk;
  //$dpi = isset($page_settings_data->fabricDPI) ? $page_settings_data->fabricDPI : 72;
  $dpi = 72;
  $fabricDPI = isset($page_settings_data->fabricDPI) ? $page_settings_data->fabricDPI : 72;
  
  //$page_bleed = 1;
  if($post == 1){
    $dpi = 72;
  }
  
  $pages = [];
  $width_in = 600/$dpi;
  $height_in = 600/$dpi;
  $width_px = 600;
  $height_px = 600;
  $page_count = 0;
  /*function cmp($a, $b)
  {
    return strcmp($a["order"], $b["order"]);
  }

  usort($mydata, "cmp");*/
  $pageorder = [];
  foreach($mydata as $key => $value) {
    if($value->type == 'page') {
      if($km_bleed == 1){
        $value->width = ($value->width+((28/96)*72));
        $value->height = ($value->height+((28/96)*72));
        $page_width_in = $value->width/$dpi;
        $page_height_in = $value->height/$dpi;
      }
      $pageorder[$value->id]['page'] = $value;
      $width_in   = $value->width/$dpi;
      $height_in  = $value->height/$dpi;
      $width_px   = $value->width;
      $height_px  = $value->height;
      $page_count++;
    }
    else if ($value->type != 'line') {
      if(!empty($value->layerIndexing)) {
        $pageorder[$value->page]['data'][$value->layerIndexing] = $value;
      }
      else {
        $pageorder[$value->page]['data'][] = $value;
      }
    }
  }
  
  // pages
  foreach($pageorder as $key => $value) {
    if(isset($value['page']) && $value['page']->type == 'page') {
     $pages[$value['page']->order] = $value;
    }
    //ksort($pages[$value['page']->order]['data']);
  }
  ksort($pages);
  if(isset($_REQUEST['pdf_image'])){
    $post = 1;
    $pdf_image = $_REQUEST['pdf_image'];
  }
  if (isset($pages)){
    if(isset($_REQUEST['masoom3'])){print "<pre>";print_r($pages);exit;}
  $orientation='P'; // For portrait
  $unit='in';
  if($km_bleed == 1){
    $format_width_in = $width_in + (28/96);
    $format_height_in = $height_in + (28/96);
  }
  else {
    $format_width_in = $width_in;
    $format_height_in = $height_in;
  }
    
    if(isset($_REQUEST['masoom4'])){print "width_in = $format_width_in and height_in = $format_height_in";exit;}
  $format = array($format_width_in,$format_height_in );
  $pdf = new TCPDF('', $unit, $format, true, 'UTF-8', false);
  // define some HTML content with style
  $html = '';
  $pdf->SetCreator(PDF_CREATOR);
  $pdf->SetMargins(0, 0, 0, true);
  $pdf->SetLeftMargin(0);
  $pdf->SetRightMargin(0);
  $pdf->SetHeaderMargin(0);
  $pdf->SetFooterMargin(0);
  $pdf->setPrintFooter(false);
  $pdf->setPrintHeader(false);
  // set auto page breaks false
  $pdf->SetAutoPageBreak(false, 0);
  /*$pdf_data_obj = array();
  foreach($mydata as $key=>$pdf_data){
    if(!empty($pdf_data)){
  $pdf_data_obj[] = $pdf_data;
    }
  }*/
  $count = count($pages);
  //print "Count Page = $count";exit;
  //print "<pre>";print_r($mydata);exit;
  //$count = count($pages);
  
  $pageno = 1;
  foreach($pages as $key => $value) {
    $page = $value['page'];
    if(isset($value['data']) && !empty($value['data'])) {
    if($km_bleed == 1){
      $bg_pos = (14/96);
      $width_in = ($page->width/$dpi) + (28/96);
      $height_in = ($page->height/$dpi) + (28/96);
      $bg_width_in = ($page->width/$dpi);
      $bg_height_in = ($page->height/$dpi);
    }
    else {
      $bg_pos = 0;
      $width_in = ($page->width/$dpi);
      $height_in = ($page->height/$dpi);
      $width_in2 = ($page->width/$dpi);
      $height_in2 = ($page->height/$dpi);
    }
    if(isset($_REQUEST['masoom2'])){print "width_in = $width_in and height_in = $height_in";exit;}
    $resolution = array($width_in, $height_in);
    $orientation = ($height_in>$width_in) ? 'P' : 'L';
    
    $page_format = array(
      'MediaBox' => array ('llx' => 0, 'lly' => 0, 'urx' => $width_in, 'ury' => $height_in),
      'CropBox' => array ('llx' => 0, 'lly' => 0, 'urx' => $width_in, 'ury' => $height_in),
      'BleedBox' => array ('llx' => (5/72), 'lly' => (5/72), 'urx' => $width_in-(5/72), 'ury' => $height_in-(5/72)),
      'TrimBox' => array ('llx' => (10/72), 'lly' => (10/72), 'urx' => $width_in-(10/72), 'ury' => $height_in-(10/72)),
      'ArtBox' => array ('llx' => (15/72), 'lly' => (15/72), 'urx' => $width_in-(15/72), 'ury' => $height_in-(15/72)),
      $width_in, 
      $height_in
    );
    

    //$pdf->AddPage($orientation, $page_format);
    $pdf->AddPage();
    $pdf->setPage($pageno, true);
    $change_top = (($page->top) / $dpi);
    if (isset($page->originY) && $page->originY == 'center') {
      $change_top = $change_top - ($height_in/2);
    }
    $change_left = (($page->left) / $dpi);
    if (isset($page->originX) && $page->originX == 'center') {
      $change_left = $change_left - ($width_in/2);
    }
    //$cnv_obj = str_replace('\u2019', '\'', $pdf_data_obj[$i]);
    //$obj = json_decode($cnv_obj);
    $json_data = $value['data'];
    //echo '<pre>'; print_r($json_data); echo '</pre>'; exit;
    //set bacground image
    if (isset($page->backgroundImage->src)){
       $background_image_path = $page->backgroundImage->src;
       $pdf->Image($background_image_path, $bg_pos, $bg_pos, $bg_width_in, $bg_height_in, 'JPG', '', '', true, 200, '', false, false, 0, false, false, true);
    }
    elseif(isset($page->backgroundColor) && !empty($page->backgroundColor)) {
      $bg = Hex2RGB($page->backgroundColor);
      $pdf->Rect($bg_pos, $bg_pos, $bg_width_in, $bg_height_in, 'F', "",  $bg);
    }
    else {
      $bg = Hex2RGB('#FFFFFF');
      $pdf->Rect($bg_pos, $bg_pos, $bg_width_in, $bg_height_in, 'F', "",  $bg);
    }
    foreach ($json_data as $key => $object) {
      $pdf->StartTransform();
      $left = (($object->left) / $dpi ) - $change_left;
      $top = (($object->top) / $dpi) - $change_top;
      //if ($left < 0 ){$left *= -1;}
      //if ($top < 0 ){$top *= -1;}
      $width = ($object->width * $object->scaleX) / $dpi;
      $height = ($object->height * $object->scaleY) / $dpi;
      $object->opacity = 1;
      switch ($object->type) {
        case 'textbox':
          if($object->originY == "center") {
            $top = $top - ($height/2);
          }
          if( $object->originX == "center") {
            $left = $left - ($width/2);
          }
          $align = $object->textAlign ? substr(ucwords($object->textAlign),0,1): '';
          $style = ''; //$object->fontStyle ? $object->fontStyle : '';
          $newColor = Hex2RGB($object->fill);
          $fontFamily = $object->fontFamily;
          if(strpos($fontFamily, 'bold') || strpos($fontFamily, 'Bold')) {
            //$fontFamily = preg_replace("/s+/", '', $fontFamily);
            $fontFamily = preg_replace("/ /", '', $fontFamily);
            $fontFamily = preg_replace('/bold/', '', $fontFamily);
            $fontFamily = preg_replace('/Bold/', '', $fontFamily);
            //$fontFamily = preg_replace("/s$/", '', $fontFamily);
            $fontFamily = $fontFamily.'b';
          }
          if(strpos($fontFamily, 'italic') || strpos($fontFamily, 'Italic')) {
            //$fontFamily = preg_replace("/s+/", '', $fontFamily);
            $fontFamily = preg_replace("/ /", '', $fontFamily);
            $fontFamily = preg_replace('/italic/', '', $fontFamily);
            $fontFamily = preg_replace('/Italic/', '', $fontFamily);
            $fontFamily = $fontFamily.'i';
          }
          if((strpos($fontFamily, 'sans') || strpos($fontFamily, 'Sans'))) {
            $fontFamily = preg_replace("/sans/", '/san/', $fontFamily);
          }
          $fontFamily = preg_replace("/ /", '', $fontFamily);
          $textbox_value = '';            
          $str_lines = explode(PHP_EOL, $object->text);
          $lines = count($str_lines); 
          foreach($str_lines as $l => $line_txt){
            //add bold italic and underline tag.
            $objectStyles = $object->styles->{$l};
            if(!empty($objectStyles)) {
              $obj_styles = array();
              foreach($objectStyles as $key => $value) {
                if(isset($value->textDecoration)) {
                  if(isset($value->underline) && $value->underline == 1) {
                    $obj_styles[$key] = 'underline';
                  }
                   if(isset($value->linethrough) && $value->linethrough == 1) {
                    $obj_styles[$key] = 'linethrough';
                  }
                }
              }
              
              if(!empty($obj_styles)){
                $line_txt = str_replace($chr, $rpl, html_entity_decode($line_txt, ENT_QUOTES, "UTF-8"));
                $str_arr = str_split($line_txt);
                foreach($str_arr as $key3 => $value3) {
                  if(isset($obj_styles[$key3])){
                    if($obj_styles[$key3] == 'linethrough'){
                      $str_arr[$key3] = '<del>'.$value3.'</del>';
                    }
                   if($obj_styles[$key3] == 'underline'){
                      $str_arr[$key3] = '<u>'.$value3.'</u>';
                    }
                  }
                }
                
                $line_txt = implode("", $str_arr);
               /* $line_txt = str_replace("</i></b><b><i>","", $line_txt);
                $line_txt = str_replace("</i></b> <b><i>","", $line_txt);
                $line_txt = str_replace("</u></i></b><b><i><u>","", $line_txt);
                $line_txt = str_replace("</u></i></b> <b><i><u>","", $line_txt);
                $line_txt = str_replace("</u></b><b><u>","", $line_txt);
                $line_txt = str_replace("</u></b> <b><u>","", $line_txt);
                $line_txt = str_replace("</u></i><i><u>","", $line_txt);
                $line_txt = str_replace("</u></i> <i><u>","", $line_txt);
                $line_txt = str_replace("</b><b>","", $line_txt);
                $line_txt = str_replace("</b> <b>","", $line_txt);
                $line_txt = str_replace("</i><i>","", $line_txt);
                $line_txt = str_replace("</i> <i>","", $line_txt);
                $line_txt = str_replace("</u><u>","", $line_txt);
                $line_txt = str_replace("</u> <u>","", $line_txt);*/
                $pos = strpos($line_txt, "<b>");
                if(($font_family == 'robotolight' || $font_family == 'robotocondensed') && $pos !== false){
                  $font_family = 'roboto';
                  $font_weight = '';
                  $style = '';
                }
              }
            }
            $line_txt = str_replace("'s", "&rsquo;s", $line_txt);
            // collect all the text line by line
            $textbox_value .= $line_txt;
            if(($l+1) < $lines)
              $textbox_value .= '<br>';
            }
            $link_url = isset($object->associatedUrl) ? $object->associatedUrl: '';
            if($link_url){
              $textbox_value = '<a href="'.$link_url.'">'.$textbox_value.'</a>';
            }
            $newColor = $object->fill;
            $color = Hex2RGB($newColor);
            $pdf->setXY($left, $top);
            $pdf->Rotate(360-$object->angle);
            $pdf->SetCellPadding(0);
            $objspacing = $object->charSpacing;
            $font_decoration = '';
            if (isset($object->underline) && $object->underline == 1) {
              $font_decoration .= 'U';
            } 
            if (isset($object->overline) && $object->overline == 1) {
              $font_decoration .= 'O';
            } 
            if (isset($object->linethrough) && $object->linethrough == 1) {
              $font_decoration .= 'D';
            }
            
            if( $objspacing != 0 ){
              //$spacing = $object->charSpacing/$dpi;
              //$pdf->setFontStretching(110);
            }
            $spacing = $object->charSpacing/10000;
            $pdf->setFontSpacing($spacing);
            //$pdf->setCellHeightRatio(1.2$dpi648);
            ////$pdf->setCellHeightRatio($object->lineHeight * 1.1178);
            if($object->lineHeight){
              $pdf->setCellHeightRatio($object->lineHeight * 1.1178);
            }
            else {
              $pdf->setCellHeightRatio(1);
            }
            $get_fontsize = ($object->fontSize*$object->scaleY/ $dpi)*72; //convert to 'pt'
            //save copy $pdf->SetFont($fontFamily, $font_weight.$style.$font_decoration,$get_fontsize, '', true);
            $pdf->SetFont($fontFamily, $font_decoration, $get_fontsize, '', false);
            $pdf->SetTextColor($color[0], $color[1], $color[2]);
            if(isset($object->fill->type)){
              if($object->fill->type == 'linear'){
                $color1 = $object->fill->colorStops[0]->color;
                $color2 = $object->fill->colorStops[1]->color;
                $coords = $object->fill->coords;
                $pdf->LinearGradient(20, 45, 80, 80, $color1, $color2, $coords);
              }
            }
            if(isset($object->shadow->offsetX)){
              $pdf->setTextShadow(array('enabled'=>true, 'depth_w'=>$object->shadow->offsetX, 'depth_h'=>$object->shadow->offsetY, 'color'=>$object->shadow->color, 'opacity'=>0.3, 'blend_mode'=>'Normal'));
            }
            //set Transform
            $opacity = isset($object->dynamic_opacity_range) ? $object->dynamic_opacity_range : $object->opacity;
            $pdf->SetAlpha($opacity);
            $pdf->MultiCell($width, $height, $textbox_value, 0, $align, false, 1, '', '', true, 0, True, true, 0, 'T', false);
            $pdf->setXY($left, $top);
            //Restore Transform
            $pdf->SetAlpha();
          break;
          case 'image':
             if (!empty($object->src)) {
              if (isset($object->angle) && $object->angle != 0) {
                $left = (($object->tl->x) / $dpi )- $change_left;
                $top = (($object->tl->y) / $dpi) - $change_top;
                if ($left < 0 ){$left *= -1;}
                if ($top < 0 ){$top *= -1;}
              } else {
                if($object->originY == "center") {
                  $top = $top - ($height/2);
                }
                if( $object->originX == "center") {
                  $left = $left - ($width/2);
                }
              }
              $pdf->setXY($left, $top);
              $pdf->Rotate(360-$object->angle);
              $pdf->StartTransform();
              if ($object->flipX) {
                $pdf->MirrorV();
              }
              if($object->flipY) {
                $pdf->MirrorH();
              }
              $link_url = isset($object->associatedUrl) ? $object->associatedUrl: '';
              //set Transform
              $opacity = isset($object->dynamic_image_opacity_range) ? $object->dynamic_image_opacity_range : $object->opacity;
              $pdf->SetAlpha($opacity);
              $pdf->setJPEGQuality(100);
							$pdf->setImageScale(1.53);
              // $pdf->SetAlpha($object_dynamic_image_opacity_range);
              $nodeerify = preg_match('/data:([^;]*);base64,(.*)/', $object->src, $match);
              if($nodeerify){
                $dataPieces = explode(',',$object->src);
                $encodedImg = $dataPieces[1];
                $imgdata = base64_decode($encodedImg);
                $pdf->Image('@'.$imgdata, '', '', $width , $height, '',$link_url, '', false, 300, '', false, false, 0);            //Restore Transform
              }
              else {
                $image_url = $object->src;
                $parts = parse_url($image_url);
                if (isset($parts['query'])) {
                  parse_str($parts['query'], $queryimage);
                  if (isset($queryimage['filname_path'])) {
                    $image_url = $queryimage['filname_path'];
                  }
                }
                $image_url = str_replace('__low','', $image_url);
                $pdf->Image($image_url, $left, $top, $width , $height, '',$link_url, '', false, 300, '', false, false, 0);
              }
              //$pdf->Image('@'.$imgdata, '', '', $width , $height, '',$link_url, '', false, 300, '', false, false, 0);            //Restore Transform
              ////$pdf->setXY($left, $top);
              //$pdf->Rotate(360-$object->angle);
              //Restore Transform
              $pdf->SetAlpha();
              $pdf->StopTransform();
            }
            break;
            case 'path-group':
              $left_grp = ($object->left+ $object->scaleX/2) /$dpi;
              $top_grp =  ($object->top + $object->scaleY/2) /$dpi;
              //$left_grp = ( ($object->left + $object->strokeMiterLimit + $object->strokeWidth) - ($width/2) )/$dpi;
              if($left_grp < 0 ){$left_grp *= -1;}
              if($top_grp < 0 ){$top_grp *= -1;}
              $pdf->setXY($left_grp, $top_grp);
              $pdf->Rotate(360-$object->angle);
              $link_url = isset($object->associatedUrl) ? $object->associatedUrl: '';
              //set Transform
              $opacity = isset($object->dynamic_opacity_range) ? $object->dynamic_opacity_range : $object->opacity;
              $pdf->SetAlpha($opacity);
             // $pdf->SetAlpha($object->dynamic_opacity_range);
              if(isset($object->svgassociatedUrl)){
                $dir_uri = file_stream_wrapper_get_instance_by_uri('modules://');
                $real_path = $dir_uri->realpath();
                $real_path_explode = explode('/sites', $real_path);
                $file_path = $real_path_explode[0]."".$object->svgassociatedUrl;
                $svg_content = file_get_contents($file_path);  
                $find_string   = '<svg';
                $position = strpos($svg_content, $find_string);
                $svg_file_new = substr($svg_content, $position);
                $svgString = str_replace('<svg', '<svg preserveAspectRatio="none"', $svg_file_new);
                $pdf->ImageSVG('@' . $svgString, $left_grp, $top, $width , $height, '',$link_url, '', false, 300, '', false, false, 0);
              }
              else{
                $pdf->ImageSVG($object->paths, $left_grp, $top, $width , $height, '',$link_url, '', false, 300, '', false, false, 0);
              }
              //Restore Transform
              $pdf->SetAlpha();
            break;
            case 'Rectshape':
              //$left = (($object->left) / $dpi )- $change_left;
             // $top = (($object->top) / $dpi) - $change_top;
             // $width = ($object->width * $object->scaleX) / $dpi;
             // $height = ($object->height * $object->scaleY) / $dpi;
              //print_r($object); exit;
              if($object->originY == "center") {
                $top = $top - ($height/2);
              }
              if( $object->originX == "center") {
                $left = $left - ($width/2);
              }
              $pdf->setXY($left, $top);
              $pdf->Rotate(360 - $object->angle);
              $color = Hex2RGB($object->fill);
              $scolor = Hex2RGB($object->stroke);
              $df = 'F';
              if (isset($object->strokeWidth) && $object->strokeWidth > 0 ) {
                $df = 'DF';
                $pdf->SetLineStyle(array('width' => ($object->strokeWidth/$dpi), 'cap' => $object->strokeLineCap, 'join' => $object->strokeLineJoin, 'dash' =>  $object->strokeDashOffset, 'color' => $scolor));
              }
              $opacity = isset($object->dynamic_opacity_range) ? $object->dynamic_opacity_range : $object->opacity;
              $pdf->SetAlpha($opacity);
              //$pdf->SetAlpha($object->dynamic_opacity_range);
              
              //echo $left.' | '.$top. ' | '. $width. ' |'. $height; die();
              if ($object->rx == 0) {
                $pdf->Rect($left, $top, $width, $height, $df, '', $color);
                //$pdf->Rect(0, $top, $width, $height, $df, '', $color);
              }
              else {
              //  $pdf->RoundedRect(0.5, 0.5,  $width, $height, 3.50, '1111', 'DF');
                $pdf->StartTransform();
                //$pdf->Rotate(360 - $object->angle);
                //$pdf->RoundedRect($left, $top, $width, $height, $object->rx/$dpi, 1111, 'DF', '', $color);
                $dynamic_corner = $object->dynamic_corner;
                if($dynamic_corner == 100) {
                  //$pdf->RoundedRect($left, $top, $width, $height, 100/$dpi, '1111', $df, '', $color);
                  $pdf->RoundedRectXY($left, $top, $width, $height, $width/2, $height/2, '1111', $df, '', $color);
                } else {
                  $pdf->RoundedRect($left, $top, $width, $height, $dynamic_corner/$dpi, '1111', $df, '', $color);
                }
                $pdf->StopTransform();
              }
              $pdf->SetAlpha();
            break;
            case 'Lineshape':
              //print_r($object);
              $left = (($object->left) / $dpi )- $change_left;
              $top = (($object->top) / $dpi) - $change_top;
              $width = ($object->width * $object->scaleX) / $dpi;
              $height = ($object->height * $object->scaleY) / $dpi;
              $x1 = (((int)$object->x1)/$dpi);
              $x2 = (((int)$object->x2)/$dpi);
              $y1 = (((int)$object->y1)/$dpi);
              $y2 = (((int)$object->y2)/$dpi);
              $color = Hex2RGB($object->stroke);
              $style = array('width' => ($object->strokeWidth/$dpi), 'cap' => $object->strokeLineCap, 'join' => $object->strokeLineJoin, 'dash' => 0, 'phase' => 10, 'color' => $color);
              $pdf->setXY($left, $top);
              $pdf->Rotate(360 - $object->angle);
              $pdf->StartTransform();
              if ($object->flipX) {
                $pdf->MirrorV();
              }
              if($object->flipY) {
                $pdf->MirrorH();
              }
              $opacity = isset($object->dynamic_opacity_range) ? $object->dynamic_opacity_range : $object->opacity;
              $pdf->SetAlpha($opacity);
             //$pdf->SetAlpha($object->dynamic_opacity_range);
              $pdf->Line(($left + $x1), ($top + $y1), ($left + $x2 ), ($top + $y2), $style);
              $pdf->SetAlpha();
              $pdf->StopTransform();
              // print ($left - ($object->x1/$dpi)).'--'. $top.'--'. ($left - ($object->x2/$dpi)).'--'. $top;
              // print '---------------------';
              // print '========='.$x1.'========='.$x2;
              // print '=====================';
            break;
            case 'circle':
              //print_r($object); exit;
             // $left = (($object->left) / $dpi ) - $change_left;
             // $top = (($object->top) / $dpi) - $change_top;
              $width = (($object->width * $object->scaleX) / $dpi) + ($object->strokeWidth/$dpi) - ($object->strokeMiterLimit/$dpi);
              $height = (($object->height * $object->scaleY) / $dpi);
              $color = Hex2RGB($object->fill);
              $scolor = Hex2RGB($object->stroke);
              $style_bollino = array();
              $df = 'F';
              if (isset($object->strokeWidth) && $object->strokeWidth > 0 ) {
               $df = 'DF';
               $style_bollino = array(20, 'butt', 'miter', 0, 0, $scolor);
               $pdf->SetLineStyle(array('width' => ($object->strokeWidth/$dpi), 'cap' => $object->strokeLineCap, 'join' => $object->strokeLineJoin, 'dash' => $object->strokeDashOffset, 'color' => $scolor));
              }
              if($object->scaleX == $object->scaleY) {
                if($object->originY == "center") {
                  $top = $top - ($height/2);
                }
                if( $object->originX == "center") {
                  $left = $left - ($width/2);
                }
               $opacity = isset($object->dynamic_opacity_range) ? $object->dynamic_opacity_range : $object->opacity;
               $pdf->SetAlpha($opacity);
               //$pdf->SetAlpha($object->dynamic_opacity_range);
               $pdf->Circle(($left + (($object->radius/$dpi)* $object->scaleX)), ($top + (($object->radius/$dpi)* $object->scaleX)), ($object->radius/$dpi * $object->scaleX), $object->startAngle, 360, $df, $style_bollino, $color);
               $pdf->SetAlpha();
              }
              else {
                //$rdata = rotatedTopLeft($left, $top, (($object->radius/$dpi) * $object->scaleX), (($object->radius/$dpi) * $object->scaleY), (360 - $object->angle));
                $pdf->StartTransform();
                //$pdf->Rotate();
                //if ($object->angle != 0 || $object->angle != 360) {
                  //$pdf->Ellipse( $rdata['rx'], $rdata['ry'], (($object->radius/$dpi) * $object->scaleX), (($object->radius/$dpi) * $object->scaleY), $object->angle, $object->startAngle, 360, 'DF',  $style_bollino, $color, '', (360 - $object->angle), $object->startAngle, $object->endAngle);
                //}
                //else {
                //print_r($rdata);exit;
                //$pdf->Ellipse(175,103,30,15,45);
                //$pdf->Ellipse($left,$top,(($object->radius/$dpi) * $object->scaleX),(($object->radius/$dpi) * $object->scaleY), (360 - $object->angle));
                 //print '--=';
                 //print  $Cx = $left - ((($object->radius/$dpi)* $object->scaleX)  * cos((360 - $object->angle) * pi() / 180));
                //print '---=';
                //print  $Cy = $top + ((($object->radius/$dpi)* $object->scaleY) * sin((360 - $object->angle) * pi() / 180));
               //exit;
               //// $pdf->setXY($left, $top);
                //$pdf->Rotate(360 - $object->angle);
                $opacity = isset($object->dynamic_opacity_range) ? $object->dynamic_opacity_range : $object->opacity;
                $pdf->SetAlpha($opacity);
                //$pdf->SetAlpha($object->dynamic_opacity_range);
               // $pdf->Ellipse(($left + ($object->radius/192)), ($top + ($object->radius/192)),(($object->radius/$dpi) * $object->scaleX),(($object->radius/$dpi) * $object->scaleY));
                //$pdf->Circle(($left + ($object->radius/$dpi)), ($top + ($object->radius/$dpi)), ($object->radius/$dpi), $object->startAngle, 360, 'DF', $style_bollino, $color);
                if($object->originY == "center") {
                  $top = $top - ($height/2);
                }
                if( $object->originX == "center") {
                  $left = $left - ($width/2);
                }
                $pdf->Ellipse(($left + (($object->radius/$dpi)* $object->scaleX)), ($top + (($object->radius/$dpi) * $object->scaleY)), (($object->radius/$dpi) * $object->scaleX), (($object->radius/$dpi) * $object->scaleY), (360 - $object->angle), $object->startAngle, 360, $df,  $style_bollino, $color); 
                //, '', $object->angle, $object->startAngle, $object->endAngle);
                $pdf->SetAlpha();
                $pdf->StopTransform();
                //$pdf->Ellipse($left, $top, 15/$dpi,7.50/$dpi, 45/$dpi, 270, 360, 'F', $style6, array(220, 200, 200));
                //$pdf->Ellipse(($left + (($object->radius/$dpi)* $object->scaleX)),  (($top +($object->strokeWidth/$dpi)) + (($object->radius/$dpi) * $object->scaleY)), (($object->radius/$dpi) * $object->scaleX), (($object->radius/$dpi) * $object->scaleY), (360 - $object->angle), 0, 360, '', array(), $color, 8);
                //}
                //$pdf->Ellipse($left, $top, (($object->radius/$dpi) * $object->scaleX), (($object->radius/$dpi) * $object->scaleY), 0, $object->startAngle, 360, 'DF',  $style_bollino, $color, '', $object->angle, $object->startAngle, $object->endAngle);
                //$pdf->StopTransform();
              }
              //print_r($object); exit;
            break;
            /*case 'Lineshape':
              $left = (($object->left) / $dpi )- $change_left;
              $top = (($object->top) / $dpi) - $change_top;
              $width = ($object->width * $object->scaleX) / $dpi;
              $height = ($object->height * $object->scaleY) / $dpi;
              //print_r($object); exit;

              $color = Hex2RGB($object->fill);
              $pdf->Rect($left, $top, $width, $height, 'DF', '', $color);
            break;
            case 'triangle':
              $left = (($object->left) / $dpi )- $change_left;
              $top = (($object->top) / $dpi) - $change_top;
              $width = ($object->width * $object->scaleX) / $dpi;
              $height = ($object->height * $object->scaleY) / $dpi;
              //print_r($object); exit;

              $color = Hex2RGB($object->fill);
              $pdf->Rect($left, $top, $width, $height, 'DF', '', $color);
            break;*/
          default:
          break;
          }
          $pdf->StopTransform();
        }
        
        
        if($_REQUEST['debug']){
          echo 'hello';
          echo '<pre>'; print_r($debug); echo '</pre>';
           echo '<pre>'; print_r($mydata); echo '</pre>';
          die();
        }
        
        
        if($km_bleed == 1){
          //Add border line aroung page area
          /*$pdf->SetLineStyle( array( 'width' => (1/96), 'color' => array(0,0,255)));
          $position = (28/96);
          $pdf->Line(($position-(0.5/96)), $position, ($page_width_in+(0.5/96)), $position);
          $pdf->Line($page_width_in, $position, $page_width_in, $page_height_in);
          $pdf->Line(($position-(0.5/96)), $page_height_in, $page_width_in+(0.5/96), $page_height_in);
          $pdf->Line($position, $position, $position, $page_height_in);*/
          //Crop Marks
          $var_c1 = (28/96);
          $var_c2 = (28/96);
          $bleed_line = 0.65;
          $pdf->cropMark($var_c1, $var_c1, $bleed_line, $bleed_line, 'A');//left top
          $pdf->cropMark(($format_width_in-$var_c2), $var_c1, $bleed_line, $bleed_line, 'b');//right top
          $pdf->cropMark($var_c1,($format_height_in-$var_c2), $bleed_line, $bleed_line, 'c');//left bottom
          $pdf->cropMark(($format_width_in-$var_c2),($format_height_in-$var_c2), $bleed_line, $bleed_line, 'D');// right bottom
        }
        $pdf->endPage();
        $pageno++;
      }  
    }
    
    //exit;
    $pdf->Close();
    //die('here');
    //exit;
    $time_stamp = time();
    $absolute_path = \Drupal::service('file_system')->realpath('temporary://pdf');
    file_prepare_directory($absolute_path,  FILE_CREATE_DIRECTORY);
    $local_path = $absolute_path.'/'.$desing_id.'.pdf';
    $pdf->Output($local_path, 'F');
    if($post == 1){
      $file_name = $desing_id.'.pdf';
      //print "page_count = $page_count<br/>";
      $images = pdf_image($local_path, $width_px, $height_px, $page_count, '', $fabricDPI);
      //print_r($images);
      //print '<br/>**url**<br/>';
      // foreach ($images as $key => $url) {
        // $img = basename($url).'.png'; 
        // print $url;
        // Function to write image into file 
       // header('Content-Type: ' . mime_content_type($url));
       // header('Content-Length: ' . filesize($url));
       // header("Content-Transfer-Encoding: Binary"); 
       // header("Content-disposition: attachment; filename=\"" . basename($url) . "\"");
       // readfile($url);
        //
      // }
     // die('this');
    }
    else {
      //$pdf->Output($local_path, 'F');
      $pdf_data = file_get_contents($local_path);
      $file_path = 's3://listing-concierge/'.date('m').'/'.date('y').'/pdf/';
      if(!empty($pdf_data) && file_prepare_directory($file_path,  FILE_CREATE_DIRECTORY)){
        if($post){
          $file_path .= 'preview'.$time_stamp.'.pdf';
        }
        else {
          $file_path .= 'preview'.$design_id.$time_stamp.'.pdf';
        }
        file_put_contents($file_path, $pdf_data);
        //$cmd = "rm -r $local_path 2>&1";
        //exec($cmd,$op);
      }
      if($post){
        print $time_stamp;
      }
      else {
        $file_name = 'preview'.$nid.$design_id.$time_stamp.'.pdf';
        //$url = $base_url.'/sites/all/modules/custom/collateral_design_system/files/preview'.$file_name;
        $url = $file_path.$file_name;
        $url = file_create_url($file_path);
        if(isset($_REQUEST['page_format'])){
          $url_exp = explode("?", $url);
          //$image_urls = array('image_url' => $url_exp[0]);
          //print json_encode( $image_urls );die();
          $images = pdf_image($local_path, $width_px, $height_px, $page_count, $url_exp[0], $fabricDPI);
        }
        else {
          header('Content-disposition: attachment; filename="'.$file_name.'"');
          header("Content-Type: application/octet-stream");
          readfile($url);
        }
      }
    }
  } //end of code to create pdf using tcpdf
}