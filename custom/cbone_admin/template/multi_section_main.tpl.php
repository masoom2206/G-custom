<?php
	//print "<pre>";print_r($var_name);exit;
	$link = strtolower(str_replace(" ", "-", $var_name['title']));
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
<div class="section-basics-title cbone-multi-section" style="background-image:url(<?php print $var_name['banner']; ?>); background-position:center top;">
	<div class="sub-section-title">
		<h3><?php print $var_name['title']; ?></h3>
	</div>
	<div class="content basics-background">
		<div class="views-field views-field-nothing">
			<span class="field-content"><a name="<?php print $link; ?>"></a></span>
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
	</div>
</div>
