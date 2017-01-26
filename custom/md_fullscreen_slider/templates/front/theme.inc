<?php
/**
 * @author: MegaDrupal
 * @file: theme.inc
 *
 * contains hook prepare data for theme
 */

/**
 * implements hook_preprocess for fullscreen_slider theme
 */
function md_fullscreen_slider_preprocess_fullscreen_slider(&$vars) {
  $slider = &$vars["slider"];
  $slides = &$vars["slides"];

  foreach ($slides as $i => &$slide) {
    if (is_object($slide))
      $slide = get_object_vars($slide);

    $slide["settings"]["transitions"] = implode(",", $slide["settings"]["transitions"]);
    if (empty($slide["settings"]["transitions"]))
      $slide["settings"]["transitions"] = "fade";

    // Prepare css class name for layer
    foreach ($slide["items"] as $j => &$item)
      $item["generate_class"] = "fullscreen-layer-{$slider->id}-{$i}-{$j}";
  }

  // Preprocess slider data
  $data = array();
  if ($slider->settings["thumbnail_navigation"]) {
    $data[] = "data-thumbWidth=\"{$slider->settings["thumbnail_width"]}\"";
    $data[] = "data-thumbHeight=\"{$slider->settings["thumbnail_height"]}\"";
  }
  $vars["data"] = implode($data, " ");
}

/**
 * implements hook_preprocess for fullscreen_slide_item theme
 */
function md_fullscreen_slider_preprocess_fullscreen_slide_item(&$vars) {
  $item = &$vars["item"];
  $classes = &$vars["classes_array"];

  // Prepare classes item
  $classes[] = "mdf-object";
  if (isset($item["customClass"]) && !empty($item["customClass"])) {
    $customClasses = explode(",", $item["customClass"]);
    foreach ($customClasses as $class) {
      trim($class);
      $classes[] = $class;
    }
  }

  // Generate data attribute
  $data = array(
    "data-x=\"{$item["left"]}\"",
    "data-y=\"{$item["top"]}\"",
    "data-width=\"{$item["width"]}\"",
    "data-height=\"{$item["height"]}\"",
    "data-start=\"{$item["starttime"]}\"",
    "data-stop=\"{$item["stoptime"]}\"",
    "data-easein=\"{$item["startani"]}\"",
    "data-easeout=\"{$item["stopani"]}\"",
  );
  if ($item["startaniTime"] > 0)
    $data[] = "data-in-time=\"{$item["startaniTime"]}\"";

  if ($item["stopaniTime"] > 0)
    $data[] = "data-out-time=\"{$item["stopaniTime"]}\"";

  $vars["data"] = implode(" ", $data);

  // Process image url for image item
  if (isset($item["fileid"]) && $item["fileid"] > 0) {
    $image = file_load($item["fileid"]);
    if ($image) {
      $item["thumb"] = file_create_url($image->uri);
      if (!$vars["generate"])
        $item["thumb"] = file_create_url($image->uri);
      else {
        $path_elements = explode("/", file_create_url($image->uri));
        $item["thumb"] = "images/" . end($path_elements);
      }
    }
  }

  if ($item["type"] == "video" && $item["thumbid"]) {
    $image = file_load($item["thumbid"]);
    if ($image) {
      if (!$vars["generate"])
        $item["thumb"] = file_create_url($image->uri);
      else {
        $path_elements = explode("/", file_create_url($image->uri));
        $item["thumb"] = "images/" . end($path_elements);
      }
    }
  }

  // Process url for video
  if ($item["type"] == "video" && intval($item["fileid"]))
    $item["video_url"] = "http://player.vimeo.com/video/{$item["fileid"]}";
  else
    $item["video_url"] = "http://www.youtube.com/embed/{$item["fileid"]}";

  // Process for text and image with link property
  if ($item["type"] == "text" || $item["type"] == "image")
    if (!empty($item["link"]) && strpos($item["link"], "http") !== FALSE)
      $item["link"] = url($item["link"], array("absolute" => TRUE));
}