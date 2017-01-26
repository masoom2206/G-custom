<?php
	//print "<pre>";print_r($var_name);exit;
?>
<div class="block block-views contextual-links-region cbone-detail-page">
	<div class="content">
		<div class="detail-page-title" style="text-align: center; background-image: url(&quot;<?php print $var_name['banner']; ?>&quot;); background-position:center top;">
			<h3><?php print $var_name['title']; ?></h3>
		</div>
		<div class="detail-page-wrapper">
			<div class="detail-page-breadcrumbs"><?php print $var_name['breadcrumb']; ?></div>
			<div class="detail-page-body"><?php print $var_name['body']; ?></div>
		</div>
		<div class="views-field views-field-nothing">
			<span class="field-content">
				<div class="fav-completed-white">
					<?php print flag_create_link('details_page_completed', $var_name['nid']); ?>
				</div>
			</span>
		</div>
	</div>
</div>
