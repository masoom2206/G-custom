<?php
/**
 * Callback function listing_pdf_download()
 * to download the PDF file
 **/
function create_listing_pdf(){
	/*$p = PDF_new();

	/*  open new PDF file; insert a file name to create the PDF on disk */
	/*if (PDF_begin_document($p, "", "") == 0) {
		die("Error: " . PDF_get_errmsg($p));
	}

	PDF_set_info($p, "Creator", "hello.php");
	PDF_set_info($p, "Author", "Rainer Schaaf");
	PDF_set_info($p, "Title", "Hello world (PHP)!");

	PDF_begin_page_ext($p, 595, 842, "");

	$font = PDF_load_font($p, "Helvetica-Bold", "winansi", "");

	PDF_setfont($p, $font, 24.0);
	PDF_set_text_pos($p, 50, 700);
	PDF_show($p, "Hello world!");
	PDF_continue_text($p, "(says PHP)");
	PDF_end_page_ext($p, "");

	PDF_end_document($p, "");

	$buf = PDF_get_buffer($p);
	$len = strlen($buf);

	header("Content-type: application/pdf");
	header("Content-Length: $len");
	header("Content-Disposition: inline; filename=hello.pdf");
	print $buf;

	PDF_delete($p);*/
	

require_once('/var/www/html/sites/all/libraries/fpdf/fpdf.php');
require_once('/var/www/html/sites/all/libraries/fpdi/fpdi.php');

$pdf = new FPDI();

$pageCount = $pdf->setSourceFile("/var/www/html/sites/all/modules/custom/listing_marketing_system/pdf/cbclassic_brochure_1_backgrnd-nid-17467-template-background.pdf");
$tplIdx = $pdf->importPage(1);

$pdf->addPage();
$pdf->useTemplate($tplIdx, 10, 10, 90);
$pdf->useTemplate($tplIdx, 0, 0, 0, 0, true); 


$pdf->Output();	
}
