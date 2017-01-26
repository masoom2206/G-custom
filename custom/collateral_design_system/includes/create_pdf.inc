<?php
/**
 * Callback function property_ads_ajax_page()
 **/
function property_ads_ajax_page(){
	global $base_url;
	$tcpdf_file_path = libraries_get_path('tcpdf').'/tcpdf.php';
	$tcpdf_include_file_path = libraries_get_path('tcpdf').'/examples/tcpdf_include.php';
	require_once($tcpdf_file_path);
	require_once($tcpdf_include_file_path);
	
	class MYPDF extends TCPDF {
		  public function Header() {
			$this->setJPEGQuality(90);
			$this->Image('logo.png', 120, 10, 75, 0, 'PNG', 'http://www.finalwebsites.com');
	 
		}
		public function Footer() {
		/* 	$this->SetY(-15);
			$this->SetFont(PDF_FONT_NAME_MAIN, 'I', 8);
			$this->Cell(0, 10, 'finalwebsites.com - PHP Script Resource, PHP classes and code for web developer', 0, false, 'C'); */
		}
		public function CreateTextBox($textval, $x = 0, $y=0, $width = 0, $height = 10, $fontsize = 10, $fontstyle = '', $align = 'L') {
			$this->SetXY($x+20, $y); // 20 = margin left
			$this->SetFont(PDF_FONT_NAME_MAIN, $fontstyle, $fontsize);
			$this->Cell($width, $height, $textval, 0, false, $align);
		}   
	}
	

	$mydata = $_POST['mydata'];
	if(isset($mydata)){ 
		//$pdf = new TCPDF($orientation='P', $unit='in', $format=array(6, 7), true, 'UTF-8', false);
		$width_in =  $_POST['width'] /96; 
		$height_in = $_POST['height'] /96; 
		$orientation='P'; // For portrait
		$unit='in';
		$format=array($width_in,$height_in );
		
		
		$pdf = new TCPDF('', $unit, $format, true, 'UTF-8', false);
		
		/* NOTE:
		 * *********************************************************
		 * You can load external XHTML using :
		 *
		 * $html = file_get_contents('/path/to/your/file.html');
		 *
		 * External CSS files will be automatically loaded.
		 * Sometimes you need to fix the path of the external CSS.
		 * *********************************************************
		 */
		// define some HTML content with style
		$html = '';
		
		$pdf->SetCreator(PDF_CREATOR);
		$pdf->SetLeftMargin(false);
		$pdf->SetRightMargin(false);
		$pdf->SetHeaderMargin(false);
		$pdf->SetFooterMargin(false);
		#$pdf->setPrintFooter(false);
		$pdf->setPrintHeader(false);
		
		$pdf_data_obj = array();
		foreach($mydata as $key=>$pdf_data){
			if(!empty($pdf_data)){
				$pdf_data_obj[] = $pdf_data;
			}
		}
		$count = count($pdf_data_obj);
		
		//$pdf->AddPage();
		for($i=0; $i<$count; $i++) {
			$pdf->AddPage();
			$obj = json_decode($pdf_data_obj[$i]);
			$json_data = $obj->objects;
			// set bacground image
			$background_image_path = $obj->backgroundImage->src;
			$pdf->Image($background_image_path, 0, 0, $width_in, $height_in, 'JPG', '', '', true, 200, '', false, false, 0, false, false, true);
			foreach ($json_data as $object) {			
				$pdf->StartTransform();
				//$left = ($object->left)*0.010416667;
				$top =  ($object->top) / 96;
				$width =($object->width)/ 96;
				$height = ($object->height)/ 96;
		
				//Calculate left for Text
				$get_weight = $object->width /2;
				$get_left = $object->left;
				$left = $get_left - $get_weight;
				$left = $left / 96;
				

				switch ($object->type) {
					case 'text':
						$align = $object->textAlign;
						$style = $object->fontStyle;
						$newColor = $object->fill;
						$color = Hex2RGB($newColor);
						$pdf->setXY($left, $top);
						$pdf->Rotate(360-$object->angle);
						$pdf->SetFont($object->fontFamily, $style, $object->fontSize*$object->scaleY / 96);
						$pdf->SetTextColor($color[0], $color[1], $color[2]);
						$height = ($object->height * $object->scaleY) / 96;
						if($object->fill->type == 'linear'){
							$color1 = $object->fill->colorStops[0]->color;
							$color2 = $object->fill->colorStops[1]->color;
							$coords = $object->fill->coords;
							$pdf->LinearGradient(20, 45, 80, 80, $color1, $color2, $coords);
						}
						if(isset($object->shadow->offsetX)){
							$pdf->setTextShadow(array('enabled'=>true, 'depth_w'=>$object->shadow->offsetX, 'depth_h'=>$object->shadow->offsetY, 'color'=>$object->shadow->color, 'opacity'=>0.3, 'blend_mode'=>'Normal'));
						}
						$pdf->MultiCell(0, $height, $object->text, 0, $align, false, 1, '', '', true, 0, false, true, 0, 'T', false);
					break;
					case 'image':
						$left = ($object->left) / 96;
						$pdf->setXY($left, $top);
						$pdf->Rotate(360-$object->angle);
						$width = $object->width * $object->scaleX;
						$width = $width / 96;
						$height = $object->height * $object->scaleY;
						$height = $height / 96;
						$pdf->Image($object->src, $left, $top, $width , $height, '', '', '', false, 300, '', false, false, 0);
					break;
					case 'textbox':
						$align = 'C';
						$style = $object->fontStyle;
						$newColor = $object->fill;
						$color = Hex2RGB($newColor);
						$pdf->setXY($left, $top);
						$pdf->Rotate(360-$object->angle);
						$pdf->SetFont($object->fontFamily, $style, $object->fontSize*$object->scaleY);
						$pdf->SetTextColor($color[0], $color[1], $color[2]);
						//$width = $object->width;
						//$height = $object->height;
						if($object->fill->type == 'linear'){
							$color1 = $object->fill->colorStops[0]->color;
							$color2 = $object->fill->colorStops[1]->color;
							$coords = $object->fill->coords;
							$pdf->LinearGradient(20, 45, 80, 80, $color1, $color2, $coords);
						}
						if(isset($object->shadow->offsetX)){
							$pdf->setTextShadow(array('enabled'=>true, 'depth_w'=>$object->shadow->offsetX, 'depth_h'=>$object->shadow->offsetY, 'color'=>$object->shadow->color, 'opacity'=>0.3, 'blend_mode'=>'Normal'));
						}
						$pdf->MultiCell($width, $height, $object->text, 0, $align, false, 1, '', '', true, 0, false, true, 0, 'T', false);
					break;
					default:
					break;
				}
				$pdf->StopTransform();
			}
		
			$pdf->endPage();
		}
		
		$pdf->Close();
		$time_stamp = time();
		$pdf->Output('/home/devcbone/public_html/sites/all/modules/custom/collateral_design_system/files/preview'.$time_stamp.'.pdf', 'F');
		$redirect_path = 'property-preview-ads/'.$time_stamp;
		print $time_stamp;
	}else{
		 echo "Error";
	}
}