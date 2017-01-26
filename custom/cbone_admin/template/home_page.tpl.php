<?php
	//print "<pre>";print_r($var_name);exit;
	$search_form = drupal_get_form('search_block_form');
	$search_form['search_block_form']['#attributes']['placeholder'] = t('What can we help you find?');
	$search_form['actions']['submit']['#value'] = t('Go');
	//print "<pre>";print_r($search_form);exit;
	//$output .= drupal_render($search_form);
	//Icons class
	$icon_class = 'icons7';
	if(isset($var_name['icons'])) {
		$icon_count = count($var_name['icons']) - 1;
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
	}
?>

<div style="text-align: center; background-image: url(&quot;<?php print $var_name['banner']; ?>&quot;); background-position:center top;" class="block block-views contextual-links-region cbone-dynamic-front-page">
	<div class="content">
		<div class="front-page-search-wrapper">
			<div class="front-page-cbone"><img alt="" src="/sites/default/files/cbone/images/CB-ONE-logo-white-100h.png" style="border-style:solid; border-width:0px; height:100px; width:324px" /></div>
			<?php if(!isset($var_name['items'])) { ?>
				<div class="front-page-search"><?php print drupal_render($search_form); ?></div>
			<?php } ?>
		</div>
		<div class="front-page-wrapper">
			<?php if(isset($var_name['items'])) { ?>
				<div class="front-page-icons-wrapper">
					<?php print theme_item_list($var_name['items']); ?>
				</div>
			<?php } else { ?>
				<div class="front-page-icons-wrapper">
					<ul class="front-page-icons<?php print ' '.$icon_class;?>">
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
				<div class="front-page-logo"><img src="<?php print $var_name['logo']; ?>" width="100"/></div>
				<div class="disclaimer-wrapper">
					<div class="front-page-hashtag">#<?php print $var_name['hashtag']; ?></div>
					<div class="front-page-disclaimer">&copy; <?php print date("Y"); ?> <?php print strip_tags($var_name['body']); ?></div>
				</div>
			<?php } ?>
		</div>
	</div>
</div>
