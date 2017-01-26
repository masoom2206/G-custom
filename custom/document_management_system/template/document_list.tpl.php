<?php
//print "<pre>";print_r($var_name);exit;
	$tid = arg(2);
	$term = taxonomy_get_parents($tid);
	if(!empty($term)) {
		$parent = array_shift($term)->name;
		$taxonomy = taxonomy_term_load($tid);
		$breadcrumb = '<div class="marketing-breadcrumb">'.$parent.' > '.$taxonomy->name.'</div>';
		$output = '<div class="marketing-detail-header">'.$breadcrumb.'<div class="marketing-term-description">'.$taxonomy->description.'</div></div>';
		print $output;
	}
?>
<ul class="view-marketing-terms">
	<?php
		if(!empty($var_name['result'])) {
			$x = 0;
			foreach($var_name['result'] as $data) {
	?>
			<li>
				<?php if($data['target'] == 1){ ?>
					<a href="<?php print $data['link_url']; ?>" target="_blank">
				<?php } else { ?>
					<a href="<?php print $data['link_url']; ?>">
				<?php } ?>
				<div class="document-thumbnail-detail">
					<div class="document-thumbnail"><img src="<?php print $data['preview_image']; ?>"/></div>
					<div class="document-title"><?php print $data['title']; ?></div>
				</div>
				</a>
			</li>
	<?php
			$x++;
			}
		}
		else {
	?>
		<div>No documents available !</div>
	<?php
		}
	?>
</ul>