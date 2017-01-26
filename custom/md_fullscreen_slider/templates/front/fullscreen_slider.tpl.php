<?php
/**
 * @author: MegaDrupal
 * @file: fullscreen_slider.tpl.php
 */
?>
<div class="mdf-slide-items" id="mdf-fullscreen-<?php print $slider->id; ?>" <?php print $data;?>>
  <?php foreach ($slides as $slide): ?>
    <div class="mdf-slide-item" data-timeout="<?php print $slide["settings"]["timelinewidth"]; ?>"
       data-transition="<?php print $slide["settings"]["transitions"]; ?>"
       data-thumb="<?php print $slide["settings"]["thumb"]; ?>"
       <?php if ($slide["settings"]["customTransitionTime"] && !empty($slide["settings"]["transitionTime"])) print " data-transition_time=\"{$slide["settings"]["transitionTime"]}\"";?>>
      <div class="mdf-mainimg">
        <img src="<?php print $slide["settings"]["bgImage"]; ?>"/>
      </div>
      <div class="mdf-objects">
        <?php foreach ($slide["items"] as $item) {
          print theme("fullscreen_slide_item", array("item" => $item, "generate" => FALSE));
        }
        ?>
      </div>
    </div>
  <?php endforeach; ?>
</div>