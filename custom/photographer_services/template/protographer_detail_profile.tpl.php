<?php 
drupal_add_css(drupal_get_path('module', 'photographer_services') . '/css/photographer.css'); 
// drupal_add_css(drupal_get_path('module', 'photographer_services') . '/css/pgwslideshow.min.css'); 
// drupal_add_js(drupal_get_path('module', 'photographer_services') . '/js/pgwslideshow.min.js'); 
// drupal_add_js(drupal_get_path('module', 'photographer_services') . '/js/pgwslideshow.min.js'); 


?>
<!--<section id="main" style="position: relative;"><header class = "photographer-banner-image"><?php //echo $data['field_image']; ?></header><footer style="position: absolute; width: 100%; top: 29px;"><ul class="icons"><li><h1 class = "photographer-name"><?php //echo $data['Name']['value']; ?></h1><span class = "photographer-profile-link"><a href="#">VIEW PORTFOLIO></a></span></li></ul></footer></section>
<div>
 <div></div>
 <div></div>
</div>
-->
<script src='https://code.jquery.com/jquery-latest.js'></script>
<script src='https://cdn.rawgit.com/Pagawa/PgwSlideshow/master/pgwslideshow.min.js'></script>
<link rel='stylesheet' href='https://cdn.rawgit.com/Pagawa/PgwSlideshow/master/pgwslideshow.min.css'>
<script>
$(document).ready(function() {
    $('.pgwSlideshow').pgwSlideshow({
      autoSlide: false,
	  displayList: false
    });
});
</script>
<div class="row" id="photographer-profile">
	<div class="col-md-3" id="row-photo">
	<img src="/sites/all/modules/custom/photographer_services/images/photography-lens.jpg" alt="photo" class="img-circle center-block"><br>
	<h2><?php echo $data[users_name]; ?></h2>
	<p>(formerly blu photography)</p><br>
	<h3>ABOUT</h3>
	<p><?php echo $data[field_about]; ?><p><br>

	<h3>SERVICES</h3>
	<?php
	$services_output = '';
	foreach($data[field_services_offered] as $services){
		$services_output .= '<dd>'.$services.'</dd>';
	}
	?>
	<dl>
	  <?php echo $services_output; ?>
	
	</dl>
	
	<h3>CONTACT</h3>
	<dl>
	  <dd><?php echo $data[field_phone_number][value]; ?></dd>
	  <dd><?php echo $data[field_email][email];?></dd>
	  <dd class="text-primary"><b>DomusPhotography.com</b></dd>
	</dl>
	<p class="imptxt">IMPORTANT: Photographers are independent contractors who are not affiliated with Coldwell Banker Residential Brokerage and therefore Coldwell Banker Residential Brokerage is not responsible for services, quality or pricing related to third party photography. Photographers are solely responsible for all customer service issues related
	to their services. Please contact the photographer directly for any issues regarding scheduling, photo uploads, scene selection, photo quality, etc. 
	</p>
  
  </div>
  <div class="col-md">
  <?php
	$slider_output = '';
	foreach($data[field_images] as $image){
		$slider_output .= '<li>'.$image.'</li>';
	}
	/*echo "Hello";
	print render($data[field_image]);
	print $data[field_images][0];
	print $data[field_images][1];
	echo "Hi";
	print"<pre>";
	print_r($data);
	print"</pre>";*/
	
  ?>
  <div class="slides">
    <ul class="pgwSlideshow">
        <?php echo $slider_output; ?>
    </ul>
</div>

<div class ="col-md-12 pricing-wrapper"><span><h1 id="pricing-main-heading">PRICING</h1></span></div>
<div class="col-md-12 pricing-wrapper">
	<div class="pricing-sub-wrapper">
		<div class ="photography-pricing col-md-6">
			<ul>
			  <h2 id ="photography-pricing-heading">Photography</h2>
				<li>Standard Photo Shoot – $225 75 HDR photos uploaded directly into CB | One</li>
				<li>Extended Photo Shoot – $325 100 HDR photos uploaded directly into CB | One $225</li>
				<li>Estate Photo Shoot – $425 150 HDR photos uploaded directly into CB | One $225</li>
			</ul>
		</div>
		<div class ="video-tour-pricing col-md-6">
			<ul>
			  <h2 id ="video-tour-pricing-heading">Full Video Tours</h2>
				<li>Standard Video Shoot – $400 2 minute YouTube-ready HDR video uploaded directly into CB | One</li>
				<li>Extended Video Shoot – $650 5 minute YouTube-ready HDR video uploaded directly into CB | One</li>
				<li>Estate Video Shoot – $875 10 minute YouTube-ready HDR video uploaded directly into CB | One Recommended for Previews® listings</li>
			</ul>
		</div>
	</div>
</div>
<div class ="col-md-12 schedule-banner">
  <div class = "col-md-12 schedule-banner-wrapper">
	<div class ="schedule-banner-text"><h1>SCHEDULE</h1></div>
  </div>
</div>
<div class ="col-md-12 instructions-wrapper">
<div class= "instructions-important"><div id="instructions">INSTRUCTIONS</div><p id="instructions-text">Order professional photography by selecting preferred date and time. Enter any notes and click the check icon to request an appointment. The appointment will be confirmed by the photographer. Pricing and terms of service are available from the photographer. </p>

<p id="important-text">IMPORTANT: Order professional photography by selecting preferred date and time. Enter any notes and click the check icon to request an appointment. The appointment will be confirmed by the photographer. Pricing and terms of service are available from the photographer. </p>
</div>
</div>
<div class="col-md-12"><div id="photograph_schedule_form"><?php print drupal_render( drupal_get_form('photograph_schedule_form', $data[field_email]) );?></div></div>
</div>
