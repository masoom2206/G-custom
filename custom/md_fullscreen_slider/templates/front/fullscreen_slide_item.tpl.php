<?php
/**
 * @author: MegaDrupal
 * @file: fullscreen_slide_item.tpl.php
 */
?>
<div class="<?php print $classes; ?>" <?php print $data; ?>>
  <div class="<?php print $item["generate_class"];?>">
    <?php if ($item["type"] == "text"): ?>
      <?php if (!empty($item["link"])): ?>
        <a href="<?php print $item["link"];?>"<?php if (!empty($item["linkCustomClass"])) print " class='{$item["linkCustomClass"]}'";?><?php if (!empty($item["linkTarget"])) print " target='{$item["linkTarget"]}'";?>>
          <?php print $item["title"]; ?>
        </a>
      <?php else: ?>
        <?php print $item["title"]; ?>
      <?php endif; ?>
    <?php elseif ($item["type"] == "image"): ?>
      <?php if (!empty($item["link"])): ?>
        <a href="<?php print $item["link"]; ?>"<?php if (!empty($item["linkCustomClass"])) print " class='{$item["linkCustomClass"]}'";?><?php if (!empty($item["linkTarget"])) print " target='{$item["linkTarget"]}'";?>>
          <img src="<?php print $item["thumb"]; ?>" alt="<?php print htmlentities($item["title"], ENT_QUOTES, "UTF-8"); ?>"/>
        </a>
      <?php else: ?>
        <img src="<?php print $item["thumb"]; ?>" alt="<?php print htmlentities($item["title"], ENT_QUOTES, "UTF-8"); ?>"/>
      <?php endif; ?>
    <?php
    elseif ($item["type"] == "video"): ?>
      <a title="<?php print htmlentities($item["title"], ENT_QUOTES, "UTF-8"); ?>" class="mdf-video" href="<?php print $item["video_url"]; ?>" videoid="<?php print $item["fileid"]; ?>">
        <img src="<?php print $item["thumb"]; ?>" alt="<?php print $item["title"]; ?>"/>
        <span class="mdf-playbtn"><img src="<?php print base_path().drupal_get_path("module", "md_fullscreen_slider")."/js/front/images/play.png";?>" alt="" /></span>
      </a>
    <?php endif; ?>
  </div>
</div>