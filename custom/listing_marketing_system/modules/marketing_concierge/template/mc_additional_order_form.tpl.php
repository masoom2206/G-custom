<?php
	$order = commerce_cart_order_load($user->uid);
	$order_id = $order->order_id;
	foreach ( $order->commerce_line_items['und'] as $key => $value) {
	  $line_item_id = $value['line_item_id'];
	  $line_item = commerce_line_item_load($line_item_id);
	  $product_id = $line_item->commerce_product['und']['0']['product_id'];
	  $product = commerce_product_load($product_id);
	   //print "<pre>";print_r($product);exit;
	  $product_id_array = array(1,2,3,7);
	  if(in_array($product_id, $product_id_array)) {
	    $unit_cost_element = str_replace(" ", "_", strtolower($product->title));
	    $title = $product->title;
	    $product_price = $product->commerce_price['und']['0']['amount'];
	  }  
	}
	/*$wrapper = entity_metadata_wrapper('commerce_order', $order);
	$total = $wrapper->commerce_order_total->amount->value();
	$currency_code = $wrapper->commerce_order_total->currency_code->value();
	$package_total = $total / 100;
	$package_total = number_format($package_total, 2);*/	
	$package_total = $product_price / 100;
	$package_total = number_format($package_total, 2);
	$serialize_value = variable_get('mc_order_unit_cost', '0');
	$unit_cost = unserialize($serialize_value);
	$just_non_mail_listed = '--';
	$just_non_mail_sold = '--';
	$additional_items_cost_query =  db_select('mc_package_addon_configuration', 'a')
	  ->fields('a')
	  ->condition('product_name', $title ,'like')
	  ->execute()
	  ->fetchAll();
	 foreach($additional_items_cost_query as $addkey => $addvalue) {
	   $unit_cost[$unit_cost_element][$addvalue->product_addon_sku] = $addvalue->addon_unit_price;
	 }
	$just_listed = isset($order->field_just_listed_postcard['und']['0']['value']) ? number_format($order->field_just_listed_postcard['und']['0']['value'] * $unit_cost[$unit_cost_element]['just_listed'], 2) : '--';
	$just_non_mail_listed = isset($order->field_additional_ono_mailed_just['und']['0']['value']) ? number_format($order->field_additional_ono_mailed_just['und']['0']['value'] * $unit_cost[$unit_cost_element]['addl-just-listed-postcards-non-mailed'], 2) : '--';
	$just_sold = isset($order->field_just_sold_postcard['und']['0']['value']) ? number_format($order->field_just_sold_postcard['und']['0']['value'] * $unit_cost[$unit_cost_element]['just_sold'], 2) : '--';
	$just_non_mail_sold = isset($order->field_additional_non_mailed_just['und']['0']['value']) ? number_format($order->field_additional_non_mailed_just['und']['0']['value'] * $unit_cost[$unit_cost_element]['addl-just-sold-postcards-non-mailed'], 2) : '--';
	$just_pro = isset($order->field_just_pro_brochure['und']['0']['value']) ? number_format($order->field_just_pro_brochure['und']['0']['value'] * $unit_cost[$unit_cost_element]['pro_brochures'], 2) : '--';
	$form_state['step'] = isset($form_state['step']) ? $form_state['step'] : 1;
?>
<?php print render($form['step_two_markup_1']); ?>
<?php print render($form['buttons']['back']); ?>
<?php print render($form['step_two_markup_2']); ?>
<?php print render($form['step_one_markup']); ?>
<div class="mc-form-direct-mail">
	<div class="mc-form-direct-mail-one">
	 <?php print render($form['direct_mail_upload_markup']); ?>
		<?php print render($form['direct_mail_postcards']); ?>
		<?php print render($form['direct_mail_upload']); ?>
	</div>
	<div class="mc-form-direct-mail-two">
		<?php
			//$default_help_text = variable_get('mc_direct_mail_help', '');
			//print $default_help_text
		?>
	</div>
</div>
<?php if(isset($form['listed_postcards'])) { ?>
<div class="mc-form-additional">
	<div class="form-additional-heading cpas">Add additional postcards and flyers</div>
	<div class="additional">
		<div class="additional-label">Additional mailed Just Listed Postcards</div>
		<?php print render($form['listed_postcards']); ?>
		<div class="additional-total"><span>&nbsp;&nbsp;X&nbsp;&nbsp;<span class="rate"><?php print $unit_cost[$unit_cost_element]['just_listed']; ?></span>&nbsp;&nbsp;=&nbsp;&nbsp;</span><span class="listed-total"><?php print ($just_listed == '--') ? '--' : '$'.$just_listed; //print $just_listed; ?></span></div>
	</div>
	<div class="additional">
		<div class="additional-label">Additional non-mailed Just Listed Postcards (plus $6 added shipping)</div>
		<?php print render($form['listed_non_postcards']); ?>
		<div class="additional-total"><span>&nbsp;&nbsp;X&nbsp;&nbsp;<span class="rate"><?php print $unit_cost[$unit_cost_element]['addl-just-listed-postcards-non-mailed']; ?></span>&nbsp;&nbsp;=&nbsp;&nbsp;</span><span class="listed-total"><?php print ($just_non_mail_listed == '--') ? '--' : '$'.$just_non_mail_listed; //print $just_listed; ?></span></div>
	</div>
	<div class="additional">
		<div class="additional-label">Additional mail Just Sold Postcards</div>
		<?php print render($form['sold_postcards']); ?>
		<div class="additional-total"><span>&nbsp;&nbsp;X&nbsp;&nbsp;<span class="rate"><?php print $unit_cost[$unit_cost_element]['just_sold']; ?></span>&nbsp;&nbsp;=&nbsp;&nbsp;</span><span class="listed-total"><?php print ($just_sold == '--') ? '--' : '$'.$just_sold; //print $just_sold; ?></span></div>
	</div>
		<div class="additional">
		<div class="additional-label">Additional non-mailed Just Sold Postcards (plus $6 added shipping)</div>
		<?php print render($form['sold_non_postcards']); ?>
		<div class="additional-total"><span>&nbsp;&nbsp;X&nbsp;&nbsp;<span class="rate"><?php print $unit_cost[$unit_cost_element]['addl-just-sold-postcards-non-mailed']; ?></span>&nbsp;&nbsp;=&nbsp;&nbsp;</span><span class="listed-total"><?php print ($just_non_mail_sold == '--') ? '--' : '$'.$just_non_mail_sold; //print $just_sold; ?></span></div>
	</div>
	<div class="additional">
		<div class="additional-label">Additional Pro Brochures<span class="star">*</span></div>
		<?php print render($form['pro_brochures']); ?>
		<div class="additional-total"><span>&nbsp;&nbsp;X&nbsp;&nbsp;<span class="rate"><?php print $unit_cost[$unit_cost_element]['pro_brochures']; ?></span>&nbsp;&nbsp;=&nbsp;&nbsp;</span><span class="listed-total"><?php print ($just_pro == '--') ? '--' : '$'.$just_pro; //print $just_pro; ?></span></div>
	</div>
</div>
<div>
<div class="additional-label">SELECT PAPER PREFERENCE AND TEMPLATE (OPTIONAL)</div>
  <?php print render($form['paper_preference']); ?>
  <?php print render($form['brochure_size']); ?>
</div>
<?php } ?>

<div class="mc-form-direct-mail">
	<div class="mc-form-direct-mail-one">
		<?php 
	      print render($form['direct_mail_postcards_9']);
	      print render($form['direct_mail_upload_9']);
	      print render($form['direct_mail_postcards_qty_9']);
	      print render($form['direct_mail_postcards_10']);
	      print render($form['direct_mail_upload_10']);
	      print render($form['direct_mail_postcards_qty_10']);
    ?>
	</div>
	<div class="mc-form-direct-mail-two">
		<?php
			$default_help_text = variable_get('mc_direct_mail_help', '');
		//	print $default_help_text;
		?>
	</div>
<div class="mc-form-subtotal">
	<div class="subtotal">
		<div class="subtotal-heading cpas">Subtotal</div>
		<table>
			<tr class="package platinum-package">
				<td class="title"><?php print $title; ?> Package</td>
				<td class="amount">$<?php print $package_total; ?></td>
			</tr>
			<tr class="package listed-postcards">
				<td class="title">Additional Just Listed Postcards</td>
				<td class="amount"><?php print ($just_listed == '--') ? '--' : '$'.$just_listed; ?></td>
			</tr>
			<tr class="package listed-non-mail-postcards">
				<td class="title">Additional non-mailed Just Listed Postcards</td>
				<td class="amount"><?php print ($just_non_mail_listed == '--') ? '--' : '$'.$just_non_mail_listed; ?></td>
			</tr>
			<tr class="package sold-postcards">
				<td class="title">Additional Just Sold Postcards</td>
				<td class="amount"><?php print ($just_sold == '--') ? '--' : '$'.$just_sold; ?></td>
			</tr>
			<tr class="package sold-non-mail-postcards">
				<td class="title">Additional non-mailed Just Sold Postcards</td>
				<td class="amount"><?php print ($just_non_mail_sold == '--') ? '--' : '$'.$just_non_mail_sold; ?></td>
			</tr>
			<tr class="package pro-brochures">
				<td class="title">Additional Pro Brochures</td>
				<td class="amount"><?php print ($just_pro == '--') ? '--' : '$'.$just_pro; ?></td>
			</tr>
			<!--<tr class="subtotal-border"><td>&nbsp;</td></tr>-->
			<tr class="package subtotal-total">
				<td class="title cpas">Subtotal</td>
				<td class="amount">$<?php 
					$just_listed = ($just_listed == '--') ? 00 : $just_listed;
					$just_sold = ($just_sold == '--') ? 00 : $just_sold;
					$just_pro = ($just_pro == '--') ? 00 : $just_pro;
					$total = $package_total + $just_listed + $just_sold + $just_pro;
					print number_format($total, 2);
				?></td>
			</tr>
		</table>
	</div>
</div>	
</div>
<div class="mc-form-submit">
<?php print render($form['buttons']['forward']); ?>
<?php print render($form['buttons']['submit']); ?>
</div>
<div class="pro-brochures-condition"><span class="star">*</span>Sales Tax and shipping will be added for this item at check out</div>
<div style="display:none;">
	<?php print drupal_render_children($form); ?>
</div>
