<?php
/**
 * @author: MegaDrupal
 * @file: slide_item.tpl.php
 *
 * Generate html for item on slide
 */
?>
<div class="slider-item item-<?php print $item["type"];?>" <?php print $data; ?>>
  <?php if ($item["type"] == "text"): ?>
    <div><?php print $item["title"]; ?></div>
  <?php elseif ($item["type"] == "image" || $item["type"] == "video"): ?>
    <img width="100%" height="100%" src="<?php print $item["thumb"]; ?>"/>
  <?php endif; ?>
  <span class="sl-tl"></span><span class="sl-tr"></span>
  <span class="sl-bl"></span>
  <span class="sl-br"></span><span class="sl-top"></span>
  <span class="sl-right"></span>
  <span class="sl-bottom"></span>
  <span class="sl-left"></span>
  <?php if ($item["type"] == "video"):?>
  <span class="sl-video-play"></span>
  <?php endif;?>
</div>