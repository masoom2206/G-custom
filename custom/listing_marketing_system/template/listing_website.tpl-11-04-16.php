<?php
//print "<pre>";print_r($var_name);exit;
$pencil_edit = '/'.drupal_get_path('module', 'listing_marketing_system') . '/images/pencil-edit.png';
//$urlAlias = drupal_lookup_path('alias',"node/".$var_name['listing_nid']);
$urlAlias = $var_name['urlAlias'];
//print file_create_url('public://mp3/alittlemoonlightserenade.mp3');exit;
global $user;
$agent = array("Agent", "Agent - beta test");
$agent_roles_result = array_intersect($agent, $user->roles);

//Query to get pdf brouchers, display document values
	$query=db_select('cbone_website_settings', 'cws')
		->fields('cws')
		->condition('nid', $var_name['listing_nid'], '=');
	$result= $query->execute()->fetchAll();
	if(!empty($result)){
		foreach($result as $value){
			$display_document= $value->display_documents;
			$pdf_brochure= $value->pdf_brochure;
			$background_music= $value->background_music;
			$mcpdf= $value->print_and_go;
		}
		
	}
	else{
		$display_document= 0;
		$pdf_brochure= 0;
		$background_music= 0;
		$mcpdf = '';
	}
?>
<div class="manage-listing-back">	<a href="/manage-listing/<?php print $var_name['listing_nid']?>">		<img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png">	</a></div>
<div class="manage-listing-photos">
	<div class="listing-photos-header">
		<div class="photos-title">Listing Website</div>
		<div class="photos-address"><?php print $var_name['listing_address']; ?> <a href="/manage-listing/<?php print $var_name['listing_nid']?>">[return to Listing Tools]</a> <a href="/my-listings">[return to Active Listings]</a></div>		
	</div>
	<div class="listing-website-body">
		<div class="listing-single-property"><span>Single Property Website URLs</span> 
		<?php if($var_name['active']){ ?>
			<input type="checkbox" id="web_page_active" checked="checked"/> Active
		<?php } else { ?>
			<input type="checkbox" id="web_page_active" /> Active
		<?php } ?>
		</div>		
		<dl>
			<dt>Branded Marketing</dt>
			<dd><a href="http://www.homecb.com/<?php print $urlAlias; ?>" target="_blank" class="web-listing-link">http://homecb.com/<span class="webpageurl"><?php print $urlAlias; ?></span></a> <span class="edit-web-page-url"><img src="<?php print $pencil_edit; ?>"></span><span class="action-webpage-url"><input type="text" id="web_page_url" value="<?php print $urlAlias; ?>"/><span class="update-web-page-url">Update</span></span></dd>
			<dt>MLS Branded URL</dt>
			<dd><a href="http://www.homecb.com/branded/<?php print $urlAlias; ?>" target="_blank" class="web-listing-link">http://homecb.com/branded/<span class="webpageurl"><?php print $urlAlias; ?></span></a></dd>
			<dt>MLS unbranded URL</dt>
			<dd><a href="http://www.homecb.com/unbranded/<?php print $urlAlias; ?>" target="_blank" class="web-listing-link">http://homecb.com/unbranded/<span class="webpageurl"><?php print $urlAlias; ?></span></a></dd>
		</dl>
		<div class="listing-website-settings-title"><span>Settings</span></div>
		<ul class="listing-website-settings">
			<li>
				<?php if($pdf_brochure != 0){ ?>
					<input type="checkbox" class="pdf_brochure" id="pdf_brochure" name="<?php print $var_name['listing_nid']?>" checked="checked"/> Do not display downloadable PDF brochure
				<?php } else { ?>
					<input type="checkbox" class="pdf_brochure" id="pdf_brochure" name="<?php print $var_name['listing_nid']?>"/> Do not display downloadable PDF brochure
				<?php } ?>
			</li>
			<li>
				<?php if($display_document != 0 ){ ?>
					<input type="checkbox" id="display_documents" checked="checked"/> Do not display documents or disclosures
				<?php } else { ?>
					<input type="checkbox" id="display_documents" /> Do not display documents or disclosures
				<?php } ?>
			</li>
			<li>
				<?php if($background_music != 0 ){ ?>
					<input type="checkbox" id="background_music" checked="checked"/> Play background music
				<?php } else { ?>
					<input type="checkbox" id="background_music" /> Play background music
				<?php } ?>
			</li>
			<ul id="listing-musics">
			<?php
				$vocabulary = taxonomy_vocabulary_machine_name_load('music');
				$terms = entity_load('taxonomy_term', FALSE, array('vid' => $vocabulary->vid));
				foreach($terms as $id => $term){
					$tid = $term->tid;
					$name = $term->name;
					$fid = $term->field_mp3_file['und']['0']['fid'];
					$mp3_url = file_create_url($term->field_mp3_file['und']['0']['uri']);
			?>
				<li class="mp3" tid="<?php print $tid; ?>" fid="<?php print $fid; ?>">
					<input type="radio" name="mp3" value="<?php print $fid; ?>"/> 
					<a href="#" url="<?php print $mp3_url; ?>" class="play">
						<img src="/sites/all/modules/custom/listing_marketing_system/images/speaker-icon-sm.png">
						<?php print $name; ?>
						<span class="playing">Playing</span>
					</a>
				</li>
			<?php
				}
			?>
			</ul>
		</ul>
		<div class="listing-website-settings"><span>Web Page Design</span></div>
			<ul class="web-page-design">
				<?php
					$vid = taxonomy_vocabulary_machine_name_load('property_web_page_design')->vid;
					$terms = taxonomy_get_tree($vid);
					foreach($terms as $term) {
						$term_detail = taxonomy_term_load($term->tid);
						$thumbnail = file_create_url($term_detail->field_thumbnail['und']['0']['uri']);
						$checked = '';
						if($term_detail->name == 'Standard Web Page Design'){
							$checked = 'checked="checked"';
							/*if(!empty($agent_roles_result)) {
								continue;
							}*/
						}
						else if($var_name['product'] == '') {
							$checked = 'disabled="disabled"';
						}
					?>
						<li>
							<div class="design-thumb"><img src="<?php print $thumbnail; ?>"/></div>
							<div class="design-name"><input type="checkbox" name="design[]" class="design-checkbox" id="<?php print $term_detail->tid; ?>" <?php print $checked;?>/><?php print $term_detail->name; ?></div>
						</li>
					<?php
					}
					//print "<pre>";print_r($term);exit;
				?>
			</ul>
		<div class="update-listing-website-settings"><a href="#" id="update-listing-website-settings" listing-nid="<?php print $var_name['listing_nid']?>">Update Web Page Settings</a></div>
	</div>
</div>
