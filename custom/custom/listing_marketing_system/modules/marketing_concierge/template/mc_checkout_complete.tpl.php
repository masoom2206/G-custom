<?php
	$order_id = arg(1);
	$message = mc_commerce_complete_data($order_id);
?>
<div class="marketing-concierge-checkout complete">
	<?php print $message; ?>
</div>