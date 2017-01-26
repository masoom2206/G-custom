<?php
//print "<pre>";print_r($var_name);exit;
global $base_url;
$image = '';
if(isset($var_name['message']['header_image']) && $var_name['message']['header_image'] != 0){
	$header_image = file_load($var_name['message']['header_image']);
	$header_image_url = file_create_url($header_image->uri);
	$image = '<img src="'.$header_image_url.'" style="width: 100%;" />';
}
$message_body = isset($var_name['message']['body']) ? mc_notifications_token_replace($var_name['message']['body'], $var_name['lnid']) : '';
?>

<div class="notification-message">
	<div class="header-image"><?php print $image; ?></div>
	<div class="message-body">
		<div class="mail-message" Style="width: 80%; margin-left: auto; margin-right: auto; margin-top: 7%;">
			<?php print $message_body; ?>
			<?php if(arg(0) != 'checkout' && $var_name['message']['id'] == 1) {?>
				<div style="margin-top: 20px; margin-bottom: 20px;"><a href="<?php print $base_url; ?>/manage-listing/<?php print $var_name['lnid']; ?>" style="padding: 10px 35px; background: #4cc4e7; color: #fff;">Manage Listing</a></div>
			<?php } ?>
		</div>
	</div>
</div>