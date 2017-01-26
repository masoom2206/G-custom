<?php
	//print "<pre>";print_r($var_name);exit;
	$link = strtolower(str_replace(" ", "-", $var_name['title']));
	if($var_name['parallax']) {
		//$vars['classes_array'][] = 'dexp-parallax';
		$library = libraries_get_libraries();
		if (isset($library['stellar'])) {
			$path = $library['stellar'];
			drupal_add_js($path . '/jquery.stellar.min.js');
			drupal_add_js(drupal_get_path('module', 'dexp_animation') . '/js/iscroll.js');
			drupal_add_js(drupal_get_path('module', 'dexp_animation') . '/js/dexp_animation_parallax.js');
		}
		//$vars['attributes_array']['data-stellar-background-ratio'] = '0.5';
		//$vars['content_attributes_array']['class'][] = 'container';
	}
	$icon_count = count($var_name['icons']);
	$icon_class = 'icons7';
	if($icon_count <= 7){
		$icon_class = 'icons7';
	}
	else if($icon_count == 8){
		$icon_class = 'icons4';
	}
	else if($icon_count > 8 && $icon_count <= 10){
		$icon_class = 'icons5';
	}
	else if($icon_count > 10){
		$mod = $icon_count % 5;
		if($mod == 0){
			$icon_class = 'icons5';
		}
		else if ($mod == 1 || $mod == 2){
			$icon_class = 'icons6';
		}
		else if ($mod == 3 || $mod == 4){
			$icon_class = 'icons7';
		}
	}
?>
<?php if($var_name['parallax']) {?>
	<div style="text-align: center; background-image: url(&quot;<?php print $var_name['banner']; ?>&quot;); background-position: 50% 48.375px;" data-stellar-background-ratio="0.5" class="block block-views dexp-parallax cbone-multi-section">
<?php } else {?>
	<div style="text-align: center; background-image: url(&quot;<?php print $var_name['banner']; ?>&quot;); background-position:center top;" class="block block-views contextual-links-region cbone-multi-section">
<?php } ?>
	<div class="content">
		<div class="sub-section-header">
			<p><a id="<?php print $link; ?>"></a></p>
		</div>
		<div class="sub-section-title">
			<h3><?php print $var_name['title']; ?></h3>
		</div>
		<div class="sub-section-wrapper">
			<div class="sub-section-body"><?php print $var_name['body']; ?></div>
			<div class="sub-section-icons-wrapper">
				<ul class="sub-section-icons<?php print ' '.$icon_class;?>">
				<?php if(!empty($var_name['icons'])){
				foreach($var_name['icons'] as $icons) { ?>
					<li>
						<a href="<?php print $icons['link']; ?>">
							<div class="section-icon">
								<div class="icon"><img width="36" height="36" src="<?php print $icons['icon']; ?>" alt="" typeof="foaf:Image"/></div>
								<div class="section-icon-title-gray"><?php print $icons['title']; ?></div>
							</div>
						</a>						
					</li>
				<?php } } ?>
				</ul>
			</div>
		</div>
		<div class="views-field views-field-nothing">
			<span class="field-content">
				<div class="fav-completed-white">
					<?php if($var_name['favorites']) {?>
						<?php print flag_create_link('bookmarks', $var_name['nid']); ?>
					<?php } ?>
					<?php if($var_name['percent_completed']) {?>
						<?php print $var_name['fav_completed']; ?>
					<?php } ?>
				</div>
			</span>
		</div>
	</div>
</div>
