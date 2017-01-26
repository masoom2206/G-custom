<script type="text/javascript">
  window.onload = function (){
	//var success = new PDFObject({ url: "/sites/default/files/lms/agent-7/sandbox-sample-data.pdf" }).embed();
	/*var success = new PDFObject({ url: "/sites/default/files/lms/agent-7/sandbox-sample-data.pdf" }).embed("pdf");*/
	var myPDF = new PDFObject({
	  url: "<?php print $var_name['url']; ?>",
	  id: "myPDF",
	  width: "100%",
	  height: "700px",
	  pdfOpenParams: {
		navpanes: 1,
		statusbar: 0,
		view: "FitH",
		pagemode: "thumbs"
	  }
	}).embed("cbone-pdf-view");
  };
</script>
<?php
	$token = (isset($_GET['token']) && $_GET['token'] != '') ? $_GET['token'] : '';
?>
<div class="download-pdf">
	<div id="pdf-download"><a href="/listing-pdf/download/<?php print $var_name['fid']; ?>?fid=<?php print $var_name['md_fid']; ?>&token=<?php print $token; ?>">Download</div>
    <div id="cbone-pdf-view"></div>
</div>