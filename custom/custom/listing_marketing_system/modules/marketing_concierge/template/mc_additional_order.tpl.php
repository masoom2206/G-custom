<?php
	//print "<pre>"; print_r($var_name); print '</pre>';
	module_load_include('inc', 'marketing_concierge', 'includes/mc-order');
	$form = drupal_get_form('marketing_concierge_additional_order_form', $var_name);
	$mc_order_form = drupal_render($form);
?>
<div class="marketing-concierge-order">
	<div class="header-image">
		<img style="width: 100%;" src="<?php print $var_name['banner']; ?>"/>
	</div>
	<div class="mc-order-body">
		<div class="mc-additional-order-form">
			<div class="mc-order-form"><?php print $mc_order_form; ?></div>
		</div>
	</div>
</div>
