<?php
	$order = $form['#entity'];
	$wrapper = entity_metadata_wrapper('commerce_order', $order);
	foreach ($order->commerce_line_items['und'] as $key => $value) {
	  $line_item_id = $value['line_item_id'];
	  $line_item = commerce_line_item_load($line_item_id);
	  $product_id = $line_item->commerce_product['und']['0']['product_id'];
	  $product_id_array = array(1,2,3,7);
	  if ( in_array($product_id, $product_id_array) ) {
	    $product = commerce_product_load($product_id);
	    $banner = file_create_url($product->field_mc_product_banner['und']['0']['uri']);
	    $logo = file_create_url($product->field_mc_image['und']['0']['uri']);
	    $title = $product->title;
	  }
	}
	$listing_nid = $order->field_lms_listing_reference['und'][0]['nid'];
	$order_number = $order->order_id.'-'.$listing_nid;
	$listing_node = node_load($listing_nid);
	//Listing Address
	if(isset($listing_node->field_lms_hide_listing_address['und']['0']['value']) && $listing_node->field_lms_hide_listing_address['und']['0']['value'] == 1) {		
		$listing_address = t('Address Available Upon Request');
	}
	else {
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
		$listing_address = implode(', ', $address);
	}
	$billing_address = $wrapper->commerce_customer_billing->commerce_customer_address->value();
	$profile_id = $order->commerce_customer_billing['und']['0']['profile_id'];
	$customer_profile = commerce_customer_profile_load($profile_id);
	$billing_state = $customer_profile->commerce_customer_address['und']['0']['administrative_area'];
	$billing_zip = $customer_profile->commerce_customer_address['und']['0']['postal_code'];
	$full_name = $customer_profile->commerce_customer_address['und']['0']['name_line'];
	$address1 = $customer_profile->commerce_customer_address['und']['0']['thoroughfare'];
	$address2 = $customer_profile->commerce_customer_address['und']['0']['premise'];
	$city = $customer_profile->commerce_customer_address['und']['0']['locality'];
	$organisation = $customer_profile->commerce_customer_address['und']['0']['organisation_name'];
	$billing_phone = $customer_profile->field_billing_phone['und']['0']['value'];
	$billing_email = $customer_profile->field_billing_email['und']['0']['value'];
	$area_code = $customer_profile->field_billing_area_code['und']['0']['value'];
	$mc_shipping = mc_shipping_information($order->uid);
?>
<div class="marketing-concierge-checkout">
	<div class="header-image">
		<img style="width: 100%;" src="<?php print $banner; ?>"/>
	</div>
	<!--<div class="header-image">
		<div class="marketing-concierge-title">
			<h1><img src="/sites/all/modules/custom/listing_marketing_system/images/bell-icon-blue.png"> Marketing Concierge</h1>
		</div>
	</div>-->
	<div class="mc-checkout-review-body">
		<div class="mc-review-title">Order Summary</div>
		<div class="mc-review-description">IMPORTANT: Your order has not yet been submitted. Please check the information below, check the box that you have read and accepted the terms and conditions, then click the "Submit Order" button.</div>
		<div class="mc-review-order-no">Order #<?php print $order_number; ?></div>
		<div class="mc-review-property-address">Property Address: <?php print $listing_address; ?></div>
		<div class="mc-checkout-part-two mc-review-order-shipping">
			<?php if($product->sku == 'LMS-04') { ?>
				<div class="mc-review-order cbone-mc-free">
			<?php } else {?>
				<div class="mc-review-order">
			<?php } ?>
				<div class="title">Your Order</div>
				<?php  print $variables['form']['checkout_review']['review']['#data']['cart_contents']['data']; ?>
			 </div>
			<?php if($product->sku != 'LMS-04') { ?>
			<div class="mc-review-shipping">
				<div class="title">Shipping Information</div>
				<ul>
					<li><div class="inner-title">Office:</div><div class="amount"><?php print $mc_shipping['office_name']; ?></div></li>
					<li><div class="inner-title">Address:</div><div class="amount"><?php print $mc_shipping['address']; ?></div></li>
					<li><div class="inner-title">City:</div><div class="amount"><?php print $mc_shipping['city']; ?></div></li>
					<li><div class="inner-title">Zip:</div><div class="amount"><?php print $mc_shipping['zip']; ?></div></li>
					<li><div class="inner-title">Phone:</div><div class="amount"><?php print $mc_shipping['phone']; ?></div></li>
				</ul>
			</div>
			<?php } ?>
		</div>
		<div class="mc-review-billing">
			<div class="title">Include a Note to your Marketing Coordinator</div>
			<div class="billing-section">
				<?php print render($form['commerce_checkout_field_group__group_mc_note']['field_mc_order_note_to_mc']); ?>
			</div>
		</div>
		<?php if($product->sku != 'LMS-04') { ?>
		<div class="mc-review-billing">
			<div class="title">Billing Information</div>
			<div class="billing-section">
				<div class="part-one">
					<ul>
						<li>Name: <?php print $full_name; ?></li>
						<li>Organization: <?php print $organisation; ?></li>
						<li>Address: <?php print $address1.', '.$address2; ?></li>
						<li class="city-state-zip">
							<div class="city">City: <?php print $city; ?></div>
							<div class="state">State: <?php print $billing_state; ?></div>
							<div class="zip">Zip: <?php print $billing_zip; ?></div>
						</li>
						<li>Phone: <?php print $area_code.'-'.$billing_phone; ?></li>
						<li>Email: <?php print $billing_email; ?></li>
					</ul>
				</div>
				<div class="part-two">
					<div class="payment-method">Credit Card</div>
					<?php print render($form['commerce_payment']); ?>
				</div>
			</div>
		</div>
		<?php } ?>
		<div class="terms-conditions">
			<div class="terms-data">
				<div class="terms-heading">Terms and Conditions:</div>
				<?php
					$default_condition = variable_get('mc_order_term_condition', '0');
					print $default_condition;
				?>
			</div>
			<?php print render($form['terms_conditions']); ?>
		</div>
		<div class="mc-form-submit">
			<?php print render($form['buttons']['continue']); ?>
			<?php print render($form['buttons']['cancel']); ?>
			<?php //print render($form['buttons']['back']); ?>
		</div>
	</div>
</div>
<div style="display:none;">
	<?php print drupal_render_children($form); ?>
</div>

