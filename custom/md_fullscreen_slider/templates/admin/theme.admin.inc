<?php
/**
 * @author: MegaDrupal
 * @file: theme.admin.inc
 */

/**
 * implements hook_preprocess_theme for slide's edit form
 */
function md_fullscreen_slider_preprocess_fullscreen_slider_edit(&$vars) {
  $slider = $vars["slider"];
  $slides = MDFullScreenSlide::get_by_sid($slider->id);
  if ($slides !== FALSE) {
    foreach ($slides as &$slide) {
      $slide->settings["slideId"] = $slide->id;

      // Load setting for background image
      $image = file_load($slide->settings["bgFid"]);
      if ($image)
        $slide->settings["bgImage"] = file_create_url($image->uri);
      else
        $slide->settings["bgImage"] = base_path() . drupal_get_path("module", "md_fullscreen_slider") . "/js/admin/images/default_bg.png";

      // Load setting for thumbnail
      $thumbnail = file_load($slide->settings["thumbFid"]);
      if ($thumbnail)
        $slide->settings["thumb"] = file_create_url($thumbnail->uri);
      else
        $slide->settings["thumb"] = "";
    }
  }

  // Load font settings
  if ($slider->settings["use_google_font"] && !empty($slider->settings["google_font"])) {
    $element = array(
      "#tag" => "link",
      "#attributes" => array(
        "href" => $slider->settings["google_font"],
        "rel" => "stylesheet",
        "type" => "text/css",
      ),
    );
    drupal_add_html_head($element, "google_fonts_setting");
    $vars["google_fonts"] = _fullscreen_get_google_web_font($slider->settings["google_font"]);
  }

  if ($slider->settings["use_typekit"] && !empty($slider->settings["typekit_id"])) {
    drupal_add_js("http://use.typekit.net/{$slider->settings["typekit_id"]}.js", "external");
    drupal_add_js("try{Typekit.load();}catch(e){}", "inline");
    $vars["typekit_fonts"] = _fullscreen_get_typekit_font($slider->settings["typekit_id"]);
  }

  $vars["slides"] = $slides;
}

/**
 * implements hook_preprocess_theme for fullscreen_slider_item
 */
function md_fullscreen_slider_preprocess_admin_fullscreen_slider_item(&$vars) {
  $item = &$vars["item"];

  // Convert title of text with htmlentities
  $item["title"] = htmlentities($item["title"], ENT_QUOTES, "UTF-8");

  // Prepare item data
  foreach ($item as $property => $value) {
    $property = camel2dashed($property);
    $data[] = "data-{$property}=\"{$value}\"";
  }
  $vars["data"] = implode(" ", $data);

  // Load file url for image item
  if ($item["type"] == "image" && !empty($item["fileid"])) {
    $image = file_load($item["fileid"]);
    if ($image)
      $item["thumb"] = file_create_url($image->uri);
  }

  // Load file url for video item with change image thumb
  if ($item["type"] == "video" && !empty($item["thumbid"])) {
    $image = file_load($item["thumbid"]);
    if ($image)
      $item["thumb"] = file_create_url($image->uri);
  }
}

/**
 * Callback to prepare data name of item
 */
function camel2dashed($string) {
  return strtolower(preg_replace('/([a-zA-Z])(?=[A-Z])/', '$1-', $string));
}
