<?php
/**
 * @author: MegaDrupal
 * @file: md_fullscreen_slider.utils.inc
 *
 * Contains all utility functions for md_fullscreen_slider module
 */


/**
 * Callback generate css for slider
 */
function _fullscreen_generate_slider_css($slider, $slides) {
  $output = "";
  $wrap_class = ".mdf-fullscreen-{$slider->id}-wrap";

  // Generate css for items
  foreach ($slides as $i => $slide) {
    if (is_object($slide))
      $slide = get_object_vars($slide);

    foreach ($slide["items"] as $j => $item) {
      $item_css = _fullscreen_generate_item_css($item);
      if ($item_css !== FALSE)
        if (!empty($item["link"])) {
          $output .= "{$wrap_class} .fullscreen-layer-{$slider->id}-{$i}-{$j} {z-index: {$item["zindex"]};}";
          $output .= "{$wrap_class} .fullscreen-layer-{$slider->id}-{$i}-{$j} a " . $item_css;

          // Generate css for hover item link
          if (!empty($item["link"])) {
            $item_link_css = _fullscreen_generate_item_link_css($item);
            if ($item_link_css !== FALSE)
              if ($item["type"] == "text")
                $output .= "{$wrap_class} .fullscreen-layer-{$slider->id}-{$i}-{$j} a:hover " . $item_link_css;
              else
                $output .= "{$wrap_class} .fullscreen-layer-{$slider->id}-{$i}-{$j} a:hover img " . $item_link_css;
          }
        }
        else
          $output .= "{$wrap_class} .fullscreen-layer-{$slider->id}-{$i}-{$j} " . $item_css;
    }
  }

  // Add css for thumbnail and use only for generate html module
  if ($slider->settings["thumbnail_navigation"]) {
    $output .= "{$wrap_class}  .mdf-thumb-items a {width: {$slider->settings["thumbnail_width"]}px !important; height: {$slider->settings["thumbnail_height"]}px !important;}";
    $output .= "{$wrap_class}  .mdf-bullet img {width: {$slider->settings["thumbnail_width"]}px !important; height: {$slider->settings["thumbnail_height"]}px !important;}";

    if ($slider->settings["thumbnail_position"] != 1) {
      // Thumbnail opacity
      $active_opacity = $slider->settings["thumbnail_active_opacity"] / 100;
      $inactive_opacity = $slider->settings["thumbnail_inactive_opacity"] / 100;
      $output .= "{$wrap_class} .mdf-thumb-items a {opacity:{$inactive_opacity};filter:alpha(opacity={$slider->settings["thumbnail_inactive_opacity"]});}"; // In active opacity
      $output .= "{$wrap_class} .mdf-thumb-items a.mdf-current, .mdf-thumb-items a:hover {opacity:{$active_opacity};filter:alpha(opacity={$slider->settings["thumbnail_active_opacity"]});}"; // Active opacity

      switch ($slider->settings["thumbnail_position"]) {
        case 2:
        case 3:
          $output .= "{$wrap_class} .mdf-thumb-container {width: {$slider->settings["thumbnail_container_width"]}}";
        break;

        case 4:
        case 5:
          $output .= "{$wrap_class} .mdf-thumb-container {height: {$slider->settings["thumbnail_container_width"]}}";

          $width = $slider->settings["thumbnail_width"]+20;
          $output .= "{$wrap_class} .mdf-thumb {width: {$width}px;}";
        break;
      }
    }

  }

  // Add slider custom css
  if (!empty($slider->settings["custom_css"]))
    $output .= $slider->settings["custom_css"];

  return $output;
}


/**
 * Callback generate css for slide's item
 */
function _fullscreen_generate_item_css($item) {
  $styles = array();

  // Set display block for link item
  if(!empty($item["link"]))
    $styles[] = "display: block;";

  // Generate css for color and background
  if (!empty($item["color"]))
    $styles[] = "color: {$item["color"]};";

  if (!empty($item["backgroundColor"]))
    $styles[] = "background-color: {$item["backgroundColor"]};";


  // Generate style for border
  if ($item["border"] == 1) {
    if (!empty($item["borderLeft"]) && $item["borderLeft"] != "none")
      $styles[] = "border-left: {$item["borderLeft"]};";

    if (!empty($item["borderTop"]) && $item["borderTop"] != "none")
      $styles[] = "border-top: {$item["borderTop"]};";

    if (!empty($item["borderRight"]) && $item["borderRight"] != "none")
      $styles[] = "border-right: {$item["borderRight"]};";

    if (!empty($item["borderBottom"]) && $item["borderBottom"] != "none")
      $styles[] = "border-bottom: {$item["borderBottom"]};";


    // Generate for border radius
    if (!empty($item["borderTopLeftRadius"]) && $item["borderTopLeftRadius"] > 0) {
      $styles[] = "border-top-left-radius: {$item["borderTopLeftRadius"]}px;
        -moz-border-top-left-radius: {$item["borderTopLeftRadius"]}px;
        -webkit-border-top-left-radius: {$item["borderTopLeftRadius"]}px;";
    }

    if (!empty($item["borderTopRightRadius"]) && $item["borderTopRightRadius"] > 0) {
      $styles[] = "border-top-right-radius: {$item["borderTopRightRadius"]}px;
        -moz-border-top-right-radius: {$item["borderTopRightRadius"]}px;
        -webkit-border-top-right-radius: {$item["borderTopRightRadius"]}px;";
    }

    if (!empty($item["borderBottomLeftRadius"]) && $item["borderBottomLeftRadius"] > 0) {
      $styles[] = "border-bottom-left-radius: {$item["borderBottomLeftRadius"]}px;
        -moz-border-bottom-left-radius: {$item["borderBottomLeftRadius"]}px;
        -webkit-border-bottom-left-radius: {$item["borderBottomLeftRadius"]}px;";
    }

    if (!empty($item["borderBottomRightRadius"]) && $item["borderBottomRightRadius"] > 0) {
      $styles[] = "border-bottom-right-radius: {$item["borderBottomRightRadius"]}px;
        -moz-border-bottom-right-radius: {$item["borderBottomRightRadius"]}px;
        -webkit-border-bottom-right-radius: {$item["borderBottomRightRadius"]}px;";
    }
  }

  // Generate css for padding
  if ($item["padding"] == 1) {
    if (!empty($item["paddingLeft"]) && $item["paddingLeft"] > 0)
      $styles[] = "padding-left: {$item["paddingLeft"]}px;";

    if (!empty($item["paddingTop"]) && $item["paddingTop"] > 0)
      $styles[] = "padding-top: {$item["paddingTop"]}px;";

    if (!empty($item["paddingRight"]) && $item["paddingRight"] > 0)
      $styles[] = "padding-right: {$item["paddingRight"]}px;";

    if (!empty($item["paddingBottom"]) && $item["paddingBottom"] > 0)
      $styles[] = "padding-bottom: {$item["paddingBottom"]}px;";
  }

  // Generate shadow css
  if ($item["shadow"] == 1) {
    $horizontal = (int) ($item["shadowOffset"] * cos(M_PI * (($item["shadowAngle"] - 90) / 180)));
    $vertical = (int) ($item["shadowOffset"] * sin(M_PI * (($item["shadowAngle"] - 90) / 180)));

    $styles[] = "box-shadow: {$horizontal}px {$vertical}px {$item["shadowBlur"]}px {$item["shadowColor"]};
        -webkit-box-shadow: {$horizontal}px {$vertical}px {$item["shadowBlur"]}px {$item["shadowColor"]};
        -moz-box-shadow: {$horizontal}px {$vertical}px {$item["shadowBlur"]}px {$item["shadowColor"]};";
  }

  // Generate css for text
  if ($item["type"] == "text") {
    if (!empty($item["fontSize"]) && $item["fontSize"] > 0){
      $font_size = $item["fontSize"]/12;
      $styles[] = "font-size: {$font_size}em;";
    }

    if (!empty($item["fontFamily"]))
      $styles[] = "font-family: '{$item["fontFamily"]}';";

    if (!empty($item["fontWeight"])) {
      if (strpos($item["fontWeight"], "italic") !== FALSE) {
        $font_weight = substr($item["fontWeight"], 0, strpos($item["fontWeight"], "italic"));
        $styles[] = "font-weight: {$font_weight};";
        $styles[] = "font-style: italic;";
      }
    }

    if (!empty($item["lineHeight"]) && $item["lineHeight"] > 0)
      $styles[] = "line-height: {$item["lineHeight"]}px;";

    if (!empty($item["textDecoration"]))
      $styles[] = "text-decoration: {$item["textDecoration"]};";

    if (!empty($item["textTransform"]))
      $styles[] = "text-transform: {$item["textTransform"]};";

    if (!empty($item["textAlign"]))
      $styles[] = "text-align: {$item["textAlign"]};";

  }

  // Generate opacity css
  if (!empty($item["opacity"]) && $item["opacity"] >= 0) {
    $opacity = $item["opacity"] * 100;
    $styles[] = "opacity: {$item["opacity"]};
        -ms-filter:\"progid:DXImageTransform.Microsoft.Alpha(Opacity={$opacity})\";
        filter: alpha(opacity={$opacity});";
  }

  // Generate z-index for layer without link
  if (empty($item["link"]))
    $styles[] = "z-index: {$item["zindex"]};";

  // Generate custom css
  if (!empty($item["customCss"]))
    $styles[] = $item["customCss"];

  if (!empty($styles))
    return "{" . implode("\n", $styles) . "\n}\n";

  return FALSE;
}

/**
 * Callback to generate css for item link
 */
function _fullscreen_generate_item_link_css($item) {
  $styles = array();

  // Generate link hover css
  if (!empty($item["linkColor"]))
    $styles[] = "color: {$item["linkColor"]} !important;";

  if (!empty($item["linkBackgroundColor"]))
    $styles[] = "background-color: {$item["linkBackgroundColor"]} !important;";

  if (!empty($item["linkBorderColor"]))
    $styles[] = "border-color: {$item["linkBorderColor"]};";

  if (empty($styles))
    return FALSE;

  return "{\n" . implode("\n", $styles) . "\n}\n";
}

/**
 * Callback to generate js control for slider
 */
function _fullscreen_generate_control_slider_js($slider, $is_preview = FALSE) {
  // Prepare slide width & height
  $wrap_width = (!empty($slider->settings["slide_width"]))? $slider->settings["slide_width"] : "100%";
  $wrap_height = (!empty($slider->settings["slide_height"]))? $slider->settings["slide_height"] : "100%";
  if ($is_preview) {
    $wrap_height = "80%";
    $wrap_width = "90%";
  }

  $options = array(
    "transitionsSpeed" => $slider->settings["transition_time"],
    "wrapHeight" => $wrap_height,
    "wrapWidth" => $wrap_width,
    "autoPlay"=>(bool)$slider->settings["auto_start"],
    "loop"=> (bool)$slider->settings["loop"],
    "enablePreLoad" => (bool)$slider->settings["enable_preloaded"],
    "pauseOnHover" => (bool)$slider->settings["pause_hover"],
    "showBullet" => (bool)$slider->settings["navigation_button"],
    "posBullet" => $slider->settings["navigation_position"],
    "hoverBullet" => (bool)$slider->settings["hover_navigation"],
    "showThumb" => (bool)$slider->settings["thumbnail_navigation"],
    "posThumb" => $slider->settings["thumbnail_position"],
    "thumbWidth" => (!empty($slider->settings["thumbnail_width"]))? $slider->settings["thumbnail_width"] : 100,
    "thumbHeight" => (!empty($slider->settings["thumbnail_height"]))? $slider->settings["thumbnail_height"] : 60,
    "css3BackgroundColor" => $slider->settings["background_color"],
    "showLoading" => (bool)$slider->settings["show_loading_bar"],
    "loadingPosition" => $slider->settings["loading_bar_position"],
    "enableNextPrev" => (bool)$slider->settings["show_next_prev"],
    "hoverNextPrev" => (bool)$slider->settings["hover_next_prev"],
    "enableKeyNavigation" => (bool)$slider->settings["key_navigation"],
    "enableDrag" => (bool)$slider->settings["enable_touch"],
  );

  if (($slider->settings["enable_preloaded"] && variable_get("show_preload", FALSE)) || $is_preview) {
    if ($is_preview)
      $loader_content = "jQuery(\"#mdf-fullscreen-{$slider->id}\").fullScreenLoader(full_screen_{$slider->id});";
    else
      $loader_content = "$(\"#mdf-fullscreen-{$slider->id}\").fullScreenLoader(full_screen_{$slider->id});";
    $options["enablePreLoad"] = TRUE;
  }
  else {
    $options["enablePreLoad"] = FALSE;
    $loader_content = "";
  }
  $options_content = drupal_json_encode($options);
  $options_callback = array(
    "onInit" => (!empty($slider->settings["callback_init"]))? $slider->settings["callback_init"] : "function() {}",
    "onEndTransition" => (!empty($slider->settings["callback_bfTransition"]))? $slider->settings["callback_bfTransition"] : "function() {}",
    "onStartTransition" => (!empty($slider->settings["callback_afTransition"]))? $slider->settings["callback_afTransition"] : "function() {}",
  );

  if (!$is_preview)
    return "(function($){
        Drupal.behaviors.full_screen_slider_{$slider->id} = {
          attach: function(context, setting) { {
            var full_screen_{$slider->id}_options = {$options_content};
                full_screen_{$slider->id}_options.onInit = {$options_callback["onInit"]};
                full_screen_{$slider->id}_options.onEndTransition = {$options_callback["onEndTransition"]};
                full_screen_{$slider->id}_options.onStartTransition = {$options_callback["onStartTransition"]};
            var full_screen_{$slider->id} = $(\"#mdf-fullscreen-{$slider->id}\").mdFullScreenSlider(full_screen_{$slider->id}_options);
                {$loader_content}
          }
        }
      }
      })(jQuery);";
  else
    return "var full_screen_{$slider}_options = {$options_content};
                full_screen_{$slider->id}_options.onInit = {$options_callback["onInit"]};
                full_screen_{$slider->id}_options.onEndTransition = {$options_callback["onEndTransition"]};
                full_screen_{$slider->id}_options.onStartTransition = {$options_callback["onStartTransition"]};
            var full_screen_{$slider->id} = $(\"#mdf-fullscreen-{$slider->id}\").mdFullScreenSlider(full_screen_{$slider->id}_options);
            {$loader_content}
    ";
}

/**
 * Callback to get google font
 */
function _fullscreen_get_google_web_font($fonts) {
  $array_fonts = array();

  // Analyse font url to get font detail
  preg_match('/([^\?]+)(\?family=)?([^&\']+)/i', $fonts, $matches);
  $google_fonts = explode("|", $matches[3]);

  foreach ($google_fonts as $font) {
    $f_detail = explode(":", $font);
    $f_name = str_replace("+", " ", $f_detail[0]);
    $f_weight = "";
    if (isset($f_detail[1]))
      $f_weight = $f_detail[1];

    $array_fonts[] = array("name" => $f_name, "weight" => $f_weight, "css" => $f_name);
  }

  return $array_fonts;
}

/**
 * Callback to get font from type-kit font
 */
function _fullscreen_get_typekit_font($tid = "") {
  $array_font = array();

  // Get type kit info
  $url = "http://typekit.com/api/v1/json/kits/{$tid}/published";
  $fonts = json_decode(file_get_contents($url), TRUE);
  if (isset($fonts["kit"]["families"]) && is_array($fonts["kit"]["families"])) {
    foreach ($fonts["kit"]["families"] as $font) {
      $f_name = $font["name"];
      $f_variations = $font["variations"];
      $f_weight = array();
      foreach ($f_variations as $variation)
        $f_weight[] = _fullscreen_type_kit_to_google_font($variation);

      $f_weight = implode(",", $f_weight);
      $array_font[] = array("name" => $f_name, "css" => $font["css_stack"], "weight" => $f_weight);
    }
  }

  return $array_font;
}

/**
 * Convert type kit variation to google font
 */
function _fullscreen_type_kit_to_google_font($variation) {
  // Get font style and font weight character
  $style = substr($variation, 0, 1);
  $weight = substr($variation, -1);

  // Get style
  if ($style == "i")
    $style = "italic";
  else
    $style = "";

  // Get font weight
  switch ($weight) {
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
      $weight = "{$weight}00";
      break;
    case "8":
      $weight = "900";
      break;
    case "9":
      $weight = "1000";
      break;

    default:
      $weight = "";
  }

  return "{$weight}{$style}";
}

/**
 * Check jquery version for use slide pre-loader
 */
function _use_slide_preload($version) {
  $version_elements = explode(".", $version);
  if (intval($version_elements[1]) >= 7 && intval($version_elements[0] == 1))
    return TRUE;
  return FALSE;
}

/**
 * Callback to load custom css file for FullScreen Slider
 */
function fullscreen_slider_load_css_file($id) {
  // Add default css file
  drupal_add_css(drupal_get_path("module", "md_fullscreen_slider") . "/js/front/css/mdf-fullscreen-slider.css");

  $active_theme = variable_get("theme_default");
  $file_path = drupal_get_path("theme", $active_theme) . "/css/mdf-fullscreenslider-style-{$id}.css";
  if (!file_exists($file_path)) {
    $file_path = drupal_get_path("theme", $active_theme) . "/css/mdf-fullscreenslider-style.css";
    if (!file_exists($file_path)) {
      $file_path = "sites/all/libraries/megadrupal/fullscreen_slider/mdf-fullscreenslider-style-{$id}.css";
      if (!file_exists($file_path)) {
        $file_path = "sites/all/libraries/megadrupal/fullscreen_slider/mdf-fullscreenslider-style.css";
        if (!file_exists($file_path))
          $file_path = "";
      }
    }
  }
  if ($file_path)
    drupal_add_css($file_path);
}