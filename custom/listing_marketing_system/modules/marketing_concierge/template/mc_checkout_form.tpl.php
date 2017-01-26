<?php
	global $user;
	$cart_contents = $form['cart_contents']['cart_contents_view']['#markup'];
	$cart_contents = str_replace('Additional Pro Brochures', 'Additional Pro Brochures<span class="star">*</span>', $cart_contents);
	$cart_contents = str_replace('$0.00', '--', $cart_contents);
	$order = commerce_cart_order_load($user->uid);
	$line_item_id = $order->commerce_line_items['und']['0']['line_item_id'];
	$line_item = commerce_line_item_load($line_item_id);
	$product_id = $line_item->commerce_product['und']['0']['product_id'];
	$product = commerce_product_load($product_id);
	$unit_cost_element = str_replace(" ", "_", strtolower($product->title));
	$banner = file_create_url($product->field_mc_product_banner['und']['0']['uri']);
	//Add place holder and Update the button labels
	$form['customer_profile_billing']['commerce_customer_address']['und']['0']['name_block']['name_line']['#attributes'] = array('placeholder' => t('Name as it appears on card'));
	//$form['customer_profile_billing']['commerce_customer_address']['und']['0']['name_block']['first_name']['#attributes'] = array('placeholder' => t('First name'));
	//$form['customer_profile_billing']['commerce_customer_address']['und']['0']['name_block']['last_name']['#attributes'] = array('placeholder' => t('First name'));
	$form['customer_profile_billing']['field_billing_area_code']['und']['0']['value']['#attributes'] = array('placeholder' => t('Area Code'));
	$form['customer_profile_billing']['field_billing_phone']['und']['0']['value']['#attributes'] = array('placeholder' => t('Phone'));
	$form['customer_profile_billing']['field_billing_email']['und']['0']['value']['#attributes'] = array('placeholder' => t('Email'));
	$form['customer_profile_billing']['commerce_customer_address']['und']['0']['organisation_block']['organisation_name']['#attributes'] = array('placeholder' => t('Company Name (Optional)'));
	$form['customer_profile_billing']['commerce_customer_address']['und']['0']['street_block']['thoroughfare']['#attributes'] = array('placeholder' => t('Address'));
	$form['customer_profile_billing']['commerce_customer_address']['und']['0']['street_block']['premise']['#attributes'] = array('placeholder' => t('Apt. Suite. Bldg. (Optional)'));
	$form['customer_profile_billing']['commerce_customer_address']['und']['0']['locality_block']['locality']['#attributes'] = array('placeholder' => t('City'));

	$form['customer_profile_billing']['commerce_customer_address']['und']['0']['locality_block']['postal_code']['#attributes'] = array('placeholder' => t('Zip'));
	
	//Order subtotal and Order total amount
	$wrapper = entity_metadata_wrapper('commerce_order', $order);
	$total = $wrapper->commerce_order_total->amount->value();
	$currency_code = $wrapper->commerce_order_total->currency_code->value();
	$package_total = $total / 100;
	$package_total = number_format($package_total, 2);
?>
<div class="marketing-concierge-checkout">
	<?php print render($form['error_message']); ?>
	<div class="header-image">
		<img style="width: 100%;" src="<?php print $banner; ?>"/>
	</div>
	<!--<div class="header-image">
		<div class="marketing-concierge-title">
			<h1><img src="/sites/all/modules/custom/listing_marketing_system/images/bell-icon-blue.png"> Marketing Concierge</h1>
		</div>
	</div>-->
	<div class="mc-checkout-body">
		<div class="mc-order-thanks-message">Thank you for your order. Please complete the information below and hit "Continue."</div>
		<div class="mc-checkout-payment-head">Billing Info (req)</div>
		<div class="mc-checkout-part-one">
			<div class="mc-billing-contact">
				<?php print render($form['customer_profile_billing']['customer_profile_billing_messages']); ?>
				<div class="billing-contact">Billing Contact</div>
				<?php print render($form['customer_profile_billing']['commerce_customer_address']['und']['0']['name_block']); ?>
				<?php print render($form['customer_profile_billing']['field_billing_area_code']); ?>
				<?php print render($form['customer_profile_billing']['field_billing_phone']); ?>
				<?php print render($form['customer_profile_billing']['field_billing_email']); ?>
				
			</div>
			<div class="mc-billing-address">
				<div class="billing-contact">Billing Address</div>
				<?php print render($form['customer_profile_billing']['commerce_customer_address']['und']['0']['organisation_block']); ?>
				<?php print render($form['customer_profile_billing']['commerce_customer_address']['und']['0']['street_block']); ?>
				<?php print render($form['customer_profile_billing']['commerce_customer_address']['und']['0']['locality_block']); ?>
				<?php print render($form['customer_profile_billing']['commerce_customer_address']['und']['0']['country']); ?>
			</div>
		</div>
		<div class="mc-checkout-part-two">
			<div class="mc-Order-details">
				<div class="Order-details">Order Details</div>
				<?php print $cart_contents; //render($form['cart_contents']); ?>
			</div>
			<div class="mc-promo-code">
				<div class="promo-code">
					<?php print render($form['commerce_coupon']); ?>
					<div class="order-total-price">
						<div class="order-total-title subtotal">Order Subtotal</div>
						<div class="order-total-amount">$<?php print $package_total; ?></div>
						<div class="line-border"></div>
						<div class="order-total-title total">Order Total</div>
						<div class="order-total-amount total">$<?php print $package_total; ?></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="mc-form-submit">
	<div class="additional-order-submit">
		<?php print render($form['buttons']['continue']); ?>
	</div>
	<div class="mc-form-message"><span class="star">*</span>Sales tax and shipping, if any, will be added on the next screen.</div>
</div>
<div style="display:none;">
	<?php print drupal_render_children($form); ?>
</div>
