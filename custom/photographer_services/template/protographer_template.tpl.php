<?php drupal_add_css(drupal_get_path('module', 'listing_marketing_system') . '/css/photographer.css'); ?>
<section id="main" style="position: relative;"><header class = "photographer-banner-image"><?php echo $data['field_image']; ?></header><footer style="position: absolute; width: 100%; top: 29px;"><ul class="icons"><li><h1 class = "photographer-name"><?php echo $data['Name']['value']; ?></h1><span class = "photographer-profile-link"><a href="#">VIEW PORTFOLIO></a></span></li></ul></footer></section>