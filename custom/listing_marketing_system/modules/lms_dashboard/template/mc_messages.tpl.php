<?php
	//print "<pre>";print_r($var_name);exit;
	$message_body = '';
	$subject = '--';
	$date = '--';
	$read = '';
	$pdf_page_link = '';
	$delete_id = '';
	$list = '<ul id="mc-message-list">';
	foreach($var_name['results'] as $key => $result){
		$listing_node = node_load($result->lnid);
		if(!empty($listing_node)) {
			if($message_body == ''){
				$date = date("m-d-Y", $result->created);
				$subject = $result->notification_title;
				$message_body = $result->notification_message;
				$delete_id = $result->id;
				
				if($result->pdf_type == 'Pro Brochure') {
					$pdf_page_link = '/listing-brochures/'.$listing_node->nid;
				}
				else if($result->pdf_type == 'Post Card') {
					$pdf_page_link = '/postcard/'.$listing_node->nid;
				}
				else {
					$pdf_page_link = '/manage-listing/'.$listing_node->nid;
				}
			}
			if($key == 0){
				$active = 'active';
			}
			else {
				$active = '';
			}
			if($result->read_status == 1){
				$read = ' read';
			}
			else if($result->read_status == 0) {
				$read = ' unread';
			}
			//Listing Address
			$address = array();
			if(isset($listing_node->field_lms_listing_address['und']['0']['value'])) {
				$address[] = $listing_node->field_lms_listing_address['und']['0']['value'];
			}
			if(isset($listing_node->field_lms_address_unit['und']['0']['value'])) {
				$address[] = $listing_node->field_lms_address_unit['und']['0']['value'];
			}
			$listing_title = implode(', ', $address);
			$pdf_type = '';
			if($result->pdf_type == 'Pro Brochure') {
				$listing_title = l($listing_title, 'listing-brochures/'.$listing_node->nid);
				$pdf_type = 'Pro Brochure';
			}
			else if($result->pdf_type == 'Post Card') {
				$listing_title = l($listing_title, 'postcard/'.$listing_node->nid);
				$pdf_type = 'Postcard';
			}
			else {
				$listing_title = l($listing_title, 'manage-listing/'.$listing_node->nid);
			}
			$agent_uid = isset($listing_node->field_lms_agent_uid['und']['0']['uid']) ? $listing_node->field_lms_agent_uid['und']['0']['uid'] : $listing_node->uid;
			$agent_detail = user_load($agent_uid);
			$agent_name = isset($agent_detail->field_preferred_name['und']['0']['value']) ? $agent_detail->field_preferred_name['und']['0']['value'] : '';
			//Product Logo
			$order_id = get_listing_order_id($result->lnid);
			if($order_id) {
				$order = commerce_order_load($order_id);
				$line_item_id = $order->commerce_line_items['und']['0']['line_item_id'];
				$line_item = commerce_line_item_load($line_item_id);
				$product_id = $line_item->commerce_product['und']['0']['product_id'];
				$product = commerce_product_load($product_id);
				if($product->title == 'Premier') {
					$product_icon = '<span class="product_icon"><img src="/sites/all/modules/custom/listing_marketing_system/images/mc-premier.png" height="50" width="50"></span>';
				}
				else if($product->title == 'Platinum') {
					$product_icon = '<span class="product_icon"><img src="/sites/all/modules/custom/listing_marketing_system/images/mc-platinum.png" height="50" width="50"></span>';
				}
				else if($product->title == 'Platinum Plus') {
					$product_icon = '<span class="product_icon"><img src="/sites/all/modules/custom/listing_marketing_system/images/mc-platinum-plus.png" height="50" width="50"></span>';
				}
			}
			$list .= '<li id="message-'.$result->id.'">
				<div class="message-list '.$active.'" message-id="'.$result->id.'">
					<div class="order-image">'.$product_icon.'</div>
					<div class="order-detail'.$read.'">
						<div class="detail">
							<div class="listing-title">'.$listing_title.'</div>
							<div class="notification-title">'.$result->notification_title.'</div>
							<div class="agent-name">'.$agent_name.'</div>
						</div>
						<div class="caret-icon">';
							if($active == 'active') {
								$list .= '<span>'.$pdf_type.'</span><img src="/sites/all/modules/custom/listing_marketing_system/modules/lms_dashboard/images/caret-right-green.jpg" />';
							} else {
								$list .= '<span>'.$pdf_type.'</span><img src="/sites/all/modules/custom/listing_marketing_system/modules/lms_dashboard/images/caret-right-white.jpg" />';
							}
			$list .= '</div></div></div></li>';
		}
	}
	$list .= '</ul>';

?>
<?php
	if($var_name['sort'] != '') {
		print $list;
	}
	else {
?>
<div class="dashboard-messages">
	<div class="office_id" style="display: none;"><?php print $var_name['office_id']; ?></div>
	<div class="dashboard-message-list">
		<h3 class="block-title">Order Notification</h3>
		<?php print drupal_render($var_name['form']); ?>
		<?php print $list; ?>
	</div>
	<div class="dashboard-message-body">
		<h3 class="block-title">Message</h3>
		<div class="dashboard-message">
			<div class="message-date">
				<div class="msg-date">Date: <?php print $date; ?></div>
				<?php if($delete_id != ''){ ?>
					<div class="delete-message">
						<a href="#" id="delete-mc-notification-message" delete_id="<?php print $delete_id; ?>">Delete Message<i class="fa fa-times" aria-hidden="true"></i></a>					
					</div>
				<?php } ?>
			</div>
			<div class="message-date">
				<div class="message-subject">Subject: <?php print $subject; ?></div>
				<?php if($pdf_page_link != ''){ ?>
					<div class="edit-message">
						<a href="<?php print $pdf_page_link; ?>"><img src="/sites/all/modules/custom/listing_marketing_system/images/pencil-edit.png" /></a>
					</div>
				<?php } ?>
			</div>
			<div class="message-body">Message Body:<br/><?php print $message_body; ?></div>
		</div>
	</div>
</div>
<div class="confirmBox-group">
	<div id="confirmBox">
		<div class="message"></div>
		<div class="buttons">
			<span class="yes">
				<span class="long">Delete</span>
			</span>
			<span class="no">
				<span class="long">Cancel</span>
			</span>
		</div>
	</div>
</div>
<?php } ?>