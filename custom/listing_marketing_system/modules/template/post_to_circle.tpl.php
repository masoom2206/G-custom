<?php
global $user, $base_url;
module_load_include('inc', 'listing_marketing_system', 'includes/listing_share');
$path=drupal_get_destination();
$circle_path='circle/create';
$url =url($base_url.'/circle/create', array('query' => drupal_get_destination()));

$query=db_select('node', 'n')
	->fields('n', array('nid'))
	->condition('n.type', 'circle', '=')
	->condition('n.uid', $user->uid, '=');
$result=$query->execute()->fetchAll();
if(empty($result) ){
	drupal_set_message(t('You currently do not have any Circles that you are authorized to post to. Please use the this form to create a new Circle. After you create the Circle you will be redirected to create your post.'));
	drupal_goto($url);
}

?>
<div class="manage-listing-back">	<a href="/manage-listing/<?php print $var_name['listing_nid']?>">		<img src="/sites/all/modules/custom/listing_marketing_system/images/back-curved-arrow.png">	</a></div>
<div class="manage-listing-photos">
	<div class="listing-photos-header">
		<div class="photos-title">Listing Add To Circle</div>
		<div class="photos-address document-address"><?php print $var_name['listing_address']; ?> <a href="/manage-listing/<?php print $var_name['listing_nid']?>">[return to Listing Tools]</a> <a href="/my-listings">[return to Active Listings]</a></div>		
	</div>
	<div class="listing-pdf">
	<?php
		$node_load = node_load($var_name['listing_nid']);
		$output='<div class="share_wrapper">';
		module_load_include('inc', 'node', 'node.pages');
		$form = node_add('circle_post');
		unset($form['additional_settings']);
		$output.=drupal_render($form);
		$output.='</div>';
		print $output;
	?>	
	</div>
</div>
