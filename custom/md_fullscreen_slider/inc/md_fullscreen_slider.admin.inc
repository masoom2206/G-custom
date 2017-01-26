<?php
/**
 * @author: MegaDrupal
 * @file: md_fullscreen_slider.admin.inc
 */

/**
 * callback for root path of FullScreen Slider module
 */
function md_fullscreen_slider_overview() {
  $header = array(t('Title'), array('data' => t('Operations'), 'colspan' => '3'));
  $rows = array();

  // Get all FullScreenSliders on your site
  $sliders = MDFullScreenSlider::get_all();
  if ($sliders !== FALSE) {
    foreach ($sliders as $slider) {
      $row = array(check_plain($slider->title) . '<div class="despcription">' . filter_xss_admin($slider->description) . '</div>');
      $row[] = array("data" => l(t("Edit"), "admin/structure/fullscreen-slider/{$slider->id}/edit"));
      $row[] = array("data" => l(t('Configure'), "admin/structure/fullscreen-slider/{$slider->id}/configure"));
      if (user_access("administer full-screen-slider"))
        $row[] = array("data" => l(t("Clone"), "admin/structure/fullscreen-slider/clone/{$slider->id}"));
      $rows[] = $row;
    }
  }

  return theme("table", array("header" => $header, "rows" => $rows));
}

/**
 * Callback to create configure form for FullScreen Slider
 */
function md_fullscreen_slider_configure_form($form, &$form_state, $sid = "") {
  // Load slider for case re-configure existed slider
  $slider = FALSE;
  $settings = MDFullScreenSlider::get_default_settings();

  if ($sid) {
    $slider = MDFullScreenSlider::get($sid);
  }

  if ($slider !== FALSE) {
    $settings = array_merge($settings, $slider->settings);
    $form_state["update_slider"] = $slider;
  }

  // Add js file needed
  drupal_add_library("system", "ui.slider");
  drupal_add_css(drupal_get_path("module", "md_fullscreen_slider") . "/js/spectrum/spectrum.css");
  drupal_add_js(drupal_get_path("module", "md_fullscreen_slider") . "/js/spectrum/spectrum.js");
  drupal_add_js(drupal_get_path("module", "md_fullscreen_slider") . "/js/admin/mdf-fullscreen-slider.configure.js");

  // Add media browser js
  include_once drupal_get_path("module", "media") . "/wysiwyg_plugins/media.inc";
  media_include_browser_js();

  $form["title"] = array(
    "#type" => "textfield",
    "#title" => t("FullScreen Slider title"),
    "#description" => t("The title is not shown on public site, just for administrator to identify this slider."),
    "#default_value" => ($slider !== FALSE) ? $slider->title : "",
    "#required" => TRUE,
  );
  $form["machine_name"] = array(
    "#type" => "machine_name",
    "#title" => t("Machine name"),
    "#default_value" => ($slider !== FALSE) ? $slider->machine_name : "",
    "#maxlength" => MENU_MAX_MENU_NAME_LENGTH_UI,
    "#description" => t("A unique name to identify for the menu. It must only contain lowercase letters, numbers and hyphens."),
    "#machine_name" => array(
      "exists" => "_fullscreen_check_machine_name",
      "source" => array("title"),
      "label" => t("Machine name"),
      "replace_pattern" => "[^a-z0-9-]+",
      "replace" => "-",
    ),
    "#disabled" => ($slider !== FALSE && $slider->machine_name != "" && strpos($slider->machine_name, "clone-") === FALSE && strpos($slider->machine_name, "import-") === FALSE),
  );
  $form["description"] = array(
    "#type" => "textarea",
    "#title" => t("Slider description"),
    "#resizable" => FALSE,
    "#default_value" => ($slider !== FALSE) ? $slider->description : "",
  );

  $form["basic_settings"] = array(
    "#type" => "fieldset",
    "#title" => t("Basic Settings"),
    "#collapsible" => TRUE,
  );
  $form["basic_settings"]["slide_width"] = array(
    "#type" => "textfield",
    "#title" => t("Slide width"),
    "#default_value" => $settings["slide_width"],
  );
  $form["basic_settings"]["slide_height"] = array(
    "#type" => "textfield",
    "#title" => t("Slide height"),
    "#default_value" => $settings["slide_height"],
  );

  $form["slide_show"] = array(
    "#type" => "fieldset",
    "#title" => t("SlideShow"),
    "#collapsible" => TRUE,
  );
  $form["slide_show"]["auto_start"] = array(
    "#type" => "checkbox",
    "#title" => t("Automatically start"),
    "#default_value" => $settings["auto_start"]
  );
  $form["slide_show"]["pause_hover"] = array(
    "#type" => "checkbox",
    "#title" => t("Pause on hover"),
    "#default_value" => $settings["pause_hover"]
  );
  $form["slide_show"]["enable_touch"] = array(
    "#type" => "checkbox",
    "#title" => t("Enable touch swipe for touch device"),
    "#default_value" => $settings["enable_touch"]
  );
  $form["slide_show"]["key_navigation"] = array(
    "#type" => "checkbox",
    "#title" => t("Keyboard navigation"),
    "#default_value" => $settings["key_navigation"]
  );
  $form["slide_show"]["loop"] = array(
    "#type" => "checkbox",
    "#title" => t("Loop"),
    "#default_value" => $settings["loop"]
  );
  $form["slide_show"]["show_loading_bar"] = array(
    "#type" => "checkbox",
    "#title" => t("Show loading bar"),
    "#default_value" => $settings["show_loading_bar"]
  );
  $form["slide_show"]["loading_bar_position"] = array(
    "#type" => "select",
    "#title" => t("Loading bar position"),
    "#options" => array(
      "top" => t("Top"),
      "bottom" => t("Bottom"),
    ),
    "#default_value" => $settings["loading_bar_position"],
  );
  if (variable_get("show_preload", FALSE)) {
    $form["slide_show"]["enable_preloaded"] = array(
      "#type" => "checkbox",
      "#title" => t("Enable slide preload"),
      "#default_value" => $settings["enable_preloaded"]
    );
  }
  $form["slide_show"]["transition_time"] = array(
    "#type" => "textfield",
    "#title" => t("Slide's transition time"),
    "#field_suffix" => t("milliseconds"),
    "#default_value" => $settings["transition_time"],
  );

  $form["navigation"] = array(
    "#type" => "fieldset",
    "#title" => t("Navigation"),
    "#collapsible" => TRUE,
  );
  $form["navigation"]["show_next_prev"] = array(
    "#type" => "checkbox",
    "#title" => t("Show next/prev button"),
    "#default_value" => $settings["show_next_prev"],
  );
  $form["navigation"]["hover_next_prev"] = array(
    "#type" => "checkbox",
    "#title" => t("Next/Prev button on hover"),
    "#default_value" => $settings["hover_next_prev"],
  );
  $form["navigation"]["navigation_button"] = array(
    "#type" => "checkbox",
    "#title" => t("Navigation button"),
    "#default_value" => $settings["navigation_button"],
  );
  $form["navigation"]["navigation_position"] = array(
    "#type" => "select",
    "#title" => t("Navigation position"),
    "#options" => array(
      "1" => t("Bottom Left"),
      "2" => t("Bottom Center"),
      "3" => t("Bottom Right"),
      "4" => t("Top Left"),
      "5" => t("Top Center"),
      "6" => t("Top Right"),
    ),
    "#default_value" => $settings["navigation_position"],
  );
  $form["navigation"]["hover_navigation"] = array(
    "#type" => "checkbox",
    "#title" => t("Navigation buttons on hover"),
    "#default_value" => $settings["hover_navigation"],
  );
  $form["navigation"]["thumbnail_navigation"] = array(
    "#type" => "checkbox",
    "#title" => t("Thumbnail navigation"),
    "#default_value" => $settings["thumbnail_navigation"],
  );
  $form["navigation"]["thumbnail_width"] = array(
    "#type" => "textfield",
    "#title" => t("Thumbnail width"),
    "#default_value" => $settings["thumbnail_width"],
  );
  $form["navigation"]["thumbnail_height"] = array(
    "#type" => "textfield",
    "#title" => t("Thumbnail height"),
    "#default_value" => $settings["thumbnail_height"],
  );
  $form["navigation"]["thumbnail_position"] = array(
    "#type" => "select",
    "#title" => t("Thumbnail position"),
    "#options" => array(
      "1" => t("In Navigation Button"),
      "2" => t("Top"),
      "3" => t("Bottom"),
      "4" => t("Left"),
      "5" => t("Right"),
    ),
    "#default_value" => $settings["thumbnail_position"],
  );
  $form["navigation"]["thumbnail_container_width"] = array(
    "#type" => "textfield",
    "#title" => t("Thumbnail container width"),
    "#default_value" => $settings["thumbnail_container_width"],
  );
  $form["navigation"]["thumbnail_active_opacity"] = array(
    "#type" => "hidden",
    "#prefix" => "<div class='form-item form-item-thumbnail-active-opacity'><label>" . t("Thumbnail active opacity") . " (<span id='active-opacity-value'></span>)</label><div id='thumbnail-active-opacity-slider'></div>",
    "#suffix" => "</div>",
    "#default_value" => $settings["thumbnail_active_opacity"],
  );
  $form["navigation"]["thumbnail_inactive_opacity"] = array(
    "#type" => "hidden",
    "#prefix" => "<div class='form-item form-item-thumbnail-inactive-opacity'><label>" . t("Thumbnail inactive opacity") . " (<span id='inactive-opacity-value'></span>)</label><div id='thumbnail-inactive-opacity-slider'></div>",
    "#suffix" => "</div>",
    "#default_value" => $settings["thumbnail_inactive_opacity"],
  );

  $form["appearance"] = array(
    "#type" => "fieldset",
    "#title" => t("Appearance"),
    "#collapsible" => TRUE,
  );
  $form["appearance"]["skin"] = array(
    "#type" => "select",
    "#title" => t("Skin"),
    "#options" => array(
      "skin1" => t("Skin 1"),
      "skin2" => t("Skin 2"),
    ),
    "#default_value" => $settings["skin"],
  );
  $form["appearance"]["background_color"] = array(
    "#type" => "textfield",
    "#title" => t("Background Color"),
    "#default_value" => $settings["background_color"],
  );

  $form["custom"] = array(
    "#type" => "fieldset",
    "#title" => t("Custom CSS"),
    "#collapsible" => TRUE,
    "#collapsed" => TRUE,
  );
  $form["custom"]["custom_csss"] = array(
    "#type" => "textarea",
    "#resizable" => FALSE,
    "#default_value" => $settings["custom_css"],
  );
  $form["event_callback"] = array(
    "#type" => "fieldset",
    "#title" => t("Events Callback"),
    "#collapsible" => TRUE,
    "#collapsed" => TRUE,
  );
  $form["event_callback"]["callback_init"] = array(
    "#type" => "textarea",
    "#title" => t("Init event"),
    "#resizable" => FALSE,
    "#default_value" => $settings["callback_init"],
  );
  $form["event_callback"]["callback_bfTransition"] = array(
    "#type" => "textarea",
    "#title" => t("Before Start Slide Transition event"),
    "#resizable" => FALSE,
    "#default_value" => $settings["callback_bfTransition"],
  );
  $form["event_callback"]["callback_afTransition"] = array(
    "#type" => "textarea",
    "#title" => t("Before End Slide Transition event"),
    "#resizable" => FALSE,
    "#default_value" => $settings["callback_afTransition"],
  );

  $form["font_settings"] = array(
    "#type" => "fieldset",
    "#title" => t("Font Settings"),
    "#collapsible" => TRUE,
  );
  $form["font_settings"]["use_google_font"] = array(
    "#type" => "checkbox",
    "#title" => t("Google font"),
    "#default_value" => $settings["use_google_font"],
  );
  $form["font_settings"]["google_font"] = array(
    "#type" => "textfield",
    "#title" => t("@import code"),
    "#default_value" => $settings["google_font"],
  );
  $form["font_settings"]["use_typekit"] = array(
    "#type" => "checkbox",
    "#title" => t("Typekit"),
    "#default_value" => $settings["use_typekit"],
  );
  $form["font_settings"]["typekit_id"] = array(
    "#type" => "textfield",
    "#title" => t("Typekit ID"),
    "#default_value" => $settings["typekit_id"],
  );

  $form["others_settings"] = array(
    "#type" => "fieldset",
    "#title" => t("Others"),
    "#collapsible" => TRUE,
  );
  $form["others_settings"]["dont_include_font"] = array(
    "#type" => "checkbox",
    "#title" => t("Do not include font"),
    "#default_value" => $settings["dont_include_font"],
  );
  $form["others_settings"]["generate_css_file"] = array(
    "#type" => "checkbox",
    "#title" => t("Generate css file"),
    "#default_value" => $settings["generate_css_file"],
  );

  if ($slider === FALSE) {
    $form["create"] = array(
      "#type" => "submit",
      "#value" => t("Create")
    );
  }
  else {
    $form["save"] = array(
      "#type" => "submit",
      "#value" => t("Save")
    );
    $form["save_edit"] = array(
      "#type" => "submit",
      "#value" => t("Save & Edit")
    );
    if (user_access("administer full-screen-slider"))
      $form["delete"] = array(
        "#type" => "submit",
        "#value" => t("Delete")
      );
  }

  return $form;
}

/**
 * callback to check machine name of slider
 */
function _fullscreen_check_machine_name($machine_name) {
  $slider = MDFullScreenSlider::get_by_machine_name($machine_name);
  if ($slider !== FALSE)
    return TRUE;

  return FALSE;
}

/**
 * Callback process for configure form
 */
function md_fullscreen_slider_configure_form_submit($form, &$form_state) {
  global $user;

  // Set page title
  drupal_set_title(t("Configure FullScreen Slider"));

  // Get default settings
  $settings = MDFullScreenSlider::get_default_settings();
  foreach ($settings as $name => &$setting)
    if (isset($form_state["values"][$name]))
      $setting = $form_state["values"][$name];

  // Check form configure is new or update existed slider
  if (isset($form_state["update_slider"])) {
    // Update existed slider
    $slider = $form_state["update_slider"];
    $slider->title = $form_state["values"]["title"];
    $slider->description = $form_state["values"]["description"];
    $slider->settings = $settings;

    // Save data to database
    $response = $slider->save();
  }
  else {
    // create new slider
    $slider = new MDFullScreenSlider();
    $slider->uid = $user->uid;
    $slider->title = $form_state["values"]["title"];
    $slider->machine_name = $form_state["values"]["machine_name"];
    $slider->description = $form_state["values"]["description"];
    $slider->settings = $settings;

    // Save data to database
    $response = $slider->save();
  }

  // Create image style for thumbnail
  if ($response && $settings["thumbnail_navigation"])
    fullscreen_update_image_style("thumbnail_full_slider_{$slider->id}_{$settings["thumbnail_width"]}x{$settings["thumbnail_height"]}", $settings["thumbnail_width"], $settings["thumbnail_height"]);

  // Generate settings css
  if ($response) {
    $slides = MDFullScreenSlide::get_by_sid($slider->id);
    if ($slides === FALSE)
      $slides = array();
    $slider_css = _fullscreen_generate_slider_css($slider, $slides);
    variable_set("fullscreen_slider_{$slider->id}_css", $slider_css);
    if ($slider->settings["generate_css_file"])
      file_unmanaged_save_data($slider_css, "public://mdf-fullscreen-slider-{$slider->id}-setting.css", FILE_EXISTS_REPLACE);
  }

  // Create message for action
  switch ($form_state["values"]["op"]) {
    case t("Create"):
      if ($response) {
        drupal_set_message(t("The '{$form_state["values"]["machine_name"]}' FullScreenSlider has been created successful."));
        $form_state["redirect"] = "admin/structure/fullscreen-slider/{$slider->id}/edit";
      }
      else
        drupal_set_message(t("The '{$form_state["value"]["machine_name"]}' FullScreenSlider has been created unsuccessful."), "error");
      break;

    case t("Save"):
      if ($response)
        drupal_set_message(t("The '{$form_state["values"]["machine_name"]}' FullScreenSlider has been updated successful."));
      else
        drupal_set_message(t("The '{$form_state["values"]["machine_name"]}' FullScreenSlider has not been updated."), "warning");

      $form_state["redirect"] = "admin/structure/fullscreen-slider";
      break;

    case t("Save & Edit"):
      if ($response)
        drupal_set_message(t("The '{$form_state["values"]["machine_name"]}' FullScreenSlider has been updated successful."));
      else
        drupal_set_message(t("The '{$form_state["values"]["machine_name"]}' FullScreenSlider has not been updated."), "warning");

      $form_state["redirect"] = "admin/structure/fullscreen-slider/{$slider->id}/edit";
      $_GET["destination"] = NULL;
      break;

    case t("Delete"):
      $form_state["redirect"] = "admin/structure/fullscreen-slider/{$slider->id}/delete";
      $_GET["destination"] = NULL;
      break;
  }
}

/**
 * callback to create edit form for slider
 */
function md_fullscreen_slider_edit_form($form, &$form_state, $sid = "") {
  $path = drupal_get_path("module", "md_fullscreen_slider");

  // Get slider
  $slider = MDFullScreenSlider::get($sid);
  if ($slider === FALSE) {
    drupal_set_title(t("Edit FullScreen Slider"));
    $message = t("Page not found");
    $form["message"] = array(
      "#markup" => "<h3 class='message-error'>{$message}</h3>",
    );

    return $form;
  }

  // Set page title
  drupal_set_title(t("Edit FullScreen Slider"));

  // Add media browser js
  include_once drupal_get_path("module", "media") . "/wysiwyg_plugins/media.inc";
  media_include_browser_js();

  // Add js
  drupal_add_library("system", "ui.tabs");
  drupal_add_library("system", "ui.sortable");
  drupal_add_library("system", "ui.slider");
  drupal_add_js("{$path}/js/spectrum/spectrum.js");
  drupal_add_js("{$path}/js/admin/mdf-slider.edit.js", array("weight" => 2));
  drupal_add_js("{$path}/js/admin/jquery.hoverIntent.js", array("weight" => 2));
  drupal_add_js("{$path}/js/admin/plugin-panel-border.js", array("weight" => 3));
  drupal_add_js("{$path}/js/jquery.knob.js", array("weight" => 3));
  drupal_add_js("{$path}/js/jquery.tinyscrollbar.min.js", array("weight" => 3));
  drupal_add_js("{$path}/js/admin/mdf-slider-lib.js", array("weight" => 3));
  drupal_add_js("{$path}/js/admin/mdf-slider-panel.js", array("weight" => 3));
  drupal_add_js("{$path}/js/admin/mdf-slider-toolbar.js", array("weight" => 3));
  drupal_add_js("{$path}/js/admin/mdf-slider-timeline.js", array("weight" => 3));

  // Add font and css files for admin form
  $element = array(
    "#tag" => "link",
    "#attributes" => array(
      "href" => "http://fonts.googleapis.com/css?family=Open+Sans",
      "rel" => "stylesheet",
      "type" => "text/css",
    ),
  );
  drupal_add_html_head($element, "google_open_sans");
  drupal_add_css("{$path}/js/admin/css/fullscreen-edit.css");
  drupal_add_css("{$path}/js/spectrum/spectrum.css");

  // Add css and js file for preview slider
  drupal_add_css("{$path}/js/front/css/mdf-fullscreen-slider.css");
  drupal_add_css("{$path}/js/front/css/animate.css");
  drupal_add_css("{$path}/js/front/css/animations.css");
  drupal_add_css("{$path}/js/front/css/component.css");
  drupal_add_css("{$path}/js/front/css/jqvideobox.css");

  drupal_add_js("{$path}/js/front/jquery.touchwipe.js");
  drupal_add_js("{$path}/js/front/jquery.easing.js");
  drupal_add_js("{$path}/js/front/modernizr.custom.js");
  drupal_add_js("{$path}/js/front/flowtype.js");
  drupal_add_js("{$path}/js/front/mdf-fullscreen-slider.js");
  drupal_add_js("{$path}/js/front/fullscreen-loader.js");
  drupal_add_js("{$path}/js/front/mdf-css3-transitions.js");
  drupal_add_js("{$path}/js/front/jquery.queryloader2.js");

  // Save id of slider
  $form["sid"] = array(
    "#type" => "hidden",
    "#default_value" => $sid,
  );

  $form["edit-html"] = array(
    "#markup" => theme("fullscreen_slider_edit", array("slider" => $slider)),
  );
  $form["save-data"] = array(
    "#type" => "textarea",
    "#default_value" => "",
    "#resizable" => FALSE,
  );
  $form["save"] = array(
    "#type" => "submit",
    "#default_value" => t("Save"),
  );
  return $form;
}

/**
 * callback to handle submit slider edit form
 */
function md_fullscreen_slider_edit_form_submit($form, &$form_state) {
  $data = drupal_json_decode($form_state["values"]["save-data"]);
  $slides_data = $data["slide_data"];

  if (is_array($slides_data)) {
    $slides = array();
    foreach ($slides_data as $pos => $slide_data) {
      $slide_id = $slide_data["itemsetting"]["slideId"];
      unset($slide_data["itemsetting"]["slideId"]);
      unset($slide_data["itemsetting"]["bgImage"]);
      unset($slide_data["itemsetting"]["thumb"]);

      if ($slide_id != -1) {
        $slide = MDFullScreenSlide::get($slide_id);
      }
      else {
        $slide = new MDFullScreenSlide();
        $slide->sid = $form_state["values"]["sid"];
      }

      // Assign new data for slide
      $slide->position = $pos + 1;
      $slide->settings = array_merge(MDFullScreenSlide::get_default_settings(), $slide_data["itemsetting"]);
      $slide->items = $slide_data["boxitems"];

      // Save slide to database
      $slide->save();
      $slides[] = $slide;
    }

    // Generate slider css
    $slider = MDFullScreenSlider::get($form_state["values"]["sid"]);
    $slider_css = _fullscreen_generate_slider_css($slider, $slides);
    variable_set("fullscreen_slider_{$slider->id}_css", $slider_css);
    if ($slider->settings["generate_css_file"])
      file_unmanaged_save_data($slider_css, "public://mdf-fullscreen-slider-{$slider->id}-setting.css", FILE_EXISTS_REPLACE);
  }
}

/**
 * Callback to generate form set id for FullScreen JS item
 */
function fullscreen_js_id_form($form, &$form_state) {
  $form["item_id"] = array(
    "#type" => "textfield",
    "#title" => t("Item ID"),
    "#description" => t("ID of FullScreen JS item on Envato System"),
    "#default_value" => variable_get("fullscreen_item_id", ""),
    "#required" => TRUE,
  );
  $form["save"] = array(
    "#type" => "submit",
    "#value" => t("Save configuration"),
  );

  return $form;
}

/**
 * Handle submit form set id of FullScreen JS item
 */
function fullscreen_js_id_form_submit($form, &$form_state) {
  variable_set("fullscreen_item_id", $form_state["values"]["item_id"]);
  drupal_set_message(t("The configuration has been updated successful"));
}

/**
 * Callback to generate preview for slider
 */
function md_fullscreen_slider_preview() {
  $output = "";

  if (isset($_POST["sid"]) && isset($_POST["data"]) && !empty($_POST["data"])) {
    // Load slider
    $slider = MDFullScreenSlider::get($_POST["sid"]);
    $slides = array();

    if ($slider) {
      $slides_data = drupal_json_decode($_POST["data"]);
      foreach ($slides_data as $pos => $slide_data) {
        unset($slide_data["itemsetting"]["slideId"]);

        // Assign new data for slide
        $slide = new MDFullScreenSlide();

        $slide->sid = $slider->id;
        $slide->position = $pos + 1;
        $slide->settings = array_merge(MDFullScreenSlide::get_default_settings(), $slide_data["itemsetting"]);
        $slide->items = $slide_data["boxitems"];
        $slide->initialize();

        // Save slide to database
        $slides[] = $slide;
      }

      // Generate css classes
      $output .= "<style type=\"text/css\" media=\"all\"><!--/*--><![CDATA[/*><!--*/";
      $output .= _fullscreen_generate_slider_css($slider, $slides);
      $output .= "/*]]>*/--></style>";

      // Generate html
      $output .= theme("fullscreen_slider", array("slider" => $slider, "slides" => $slides));

      // Generate js control
      $output .= "<script type=\"text/javascript\"><!--//--><![CDATA[//><!--\n";
      $output .= _fullscreen_generate_control_slider_js($slider, TRUE);
      $output .= "\n//--><!]]></script>";
    }
  }

  echo $output;
  exit;
}

/**
 * Callback to create delete fullScreen Slider form
 */
function md_fullscreen_slider_delete($form, &$form_state, $sid) {
  // Load slider
  $slider = MDFullScreenSlider::get($sid);
  if (!$slider) {
    $form["error-message"] = array(
      "#markup" => "<h3 class=\"full-screen-error\">This slider does not existed</h3>",
    );
    return $form;
  }

  // Create form content
  drupal_set_title(t("Are you sure want to delete '{$slider->title}' FullScreen Slider?"));
  $form["delete"] = array(
    "#type" => "submit",
    "#value" => t("Delete")
  );
  $form["cancel"] = array(
    "#markup" => l(t("Cancel"), "admin/structure/fullscreen-slider/{$slider->id}/configure")
  );

  // Save slider id to form
  $form_state["delete_slider"] = $slider;

  return $form;
}

/**
 * Callback to handle submit delete slider form
 */
function md_fullscreen_slider_delete_submit($form, &$form_state) {
  // Implements delete slider in database
  $response = MDFullScreenSlider::delete($form_state["delete_slider"]->id);

  if ($response) {
    drupal_set_message(t("FullScreen Slider '{$form_state["delete_slider"]->title}' has been deleted successful."));
    $form_state["redirect"] = "admin/structure/fullscreen-slider";
  }
  else {
    drupal_set_message(t("FullScreen Slider '{$form_state["delete_slider"]->title}' has not been deleted."), "error");
    $form_state["redirect"] = "admin/structure/fullscreen-slider/{$form_state["delete_slider"]->id}/configure";
  }
}

/**
 * Callback to create image_style for images
 */
function fullscreen_update_image_style($image_style_name, $width, $height, $allow_scaleup = FALSE) {
  # Load image_style if it existed
  $style = image_style_load($image_style_name);
  if (empty($style))
    $style = image_style_save(array("name" => $image_style_name));
  else {
    # Remove all effect in this image style
    $current_effects = $style["effects"];
    foreach ($current_effects as $effect)
      image_effect_delete($effect);
  }

  # Create effect for image_style
  $new_effect = array(
    "name" => "image_scale_and_crop",
    "data" => array(
      "width" => $width,
      "height" => $height,
      "scaleup" => $allow_scaleup,
    ),
    "isid" => $style["isid"],
  );

  # Save effect for image_styles
  image_effect_save($new_effect);
}

/**
 * Callback to implement clone a fullScreen Slider
 */
function md_fullscreen_slider_clone($id) {
  // Load slider to clone
  $slider = MDFullScreenSlider::get($id);

  if ($slider !== FALSE) {
    $org_title = $slider->title;
    // Create new slider
    $slider->id = NULL;
    $slider->title = "Clone of {$slider->title}";
    $slider->machine_name = "clone-{$slider->machine_name}-" . time();
    if (!$slider->save())
      return;

    // Create image style for thumbnail
    if ($slider->settings["thumbnail_navigation"])
      fullscreen_update_image_style("thumbnail_full_slider_{$slider->id}_{$slider->settings["thumbnail_width"]}x{$slider->settings["thumbnail_height"]}", $slider->settings["thumbnail_width"], $slider->settings["thumbnail_height"]);

    // Create new slides for slider
    $slides = MDFullScreenSlide::get_by_sid($id);
    foreach ($slides as $slide) {
      $slide->id = NULL;
      $slide->sid = $slider->id;
      $slide->save();
    }

    // Generate css for slider by settings
    $slider_css = _fullscreen_generate_slider_css($slider, $slides);
    variable_set("fullscreen_slider_{$slider->id}_css", $slider_css);
    if ($slider->settings["generate_css_file"])
      file_unmanaged_save_data($slider_css, "public://mdf-fullscreen-slider-{$slider->id}-setting.css", FILE_EXISTS_REPLACE);

    drupal_set_message(t("Clone FullScreen Slider: '{$org_title}' is clone successful."));
  }

  drupal_goto("admin/structure/fullscreen-slider");
}

/**
 * Callback to create export data
 */
function md_fullscreen_slider_export() {
  if (isset($_GET["sliders"]) && !empty($_GET["sliders"])) {
    $zip = new Zip();
    $sliders = explode(",", $_GET["sliders"]);
    $images = array();
    foreach ($sliders as $index => $slider) {
      $slider = MDFullScreenSlider::get($slider);
      if ($slider === FALSE)
        continue;

      // Process data for slides
      $slides = MDFullScreenSlide::get_by_sid($slider->id);
      foreach($slides as &$slide) {
        // Unset bgImage, thumb
        unset($slide->settings["bgImage"]);
        unset($slide->settings["thumb"]);

        // Get background & thumbnail slide image
        if ($slide->settings["bgFid"] > 0) {
          $image = file_load($slide->settings["bgFid"]);
          $slide->settings["bgFid"] = $image->filename;
          $images[$image->fid] = $image;
        }

        if ($slide->settings["thumbFid"] > 0) {
          $image = file_load($slide->settings["thumbFid"]);
          $slide->settings["thumbFid"] = $image->filename;
          $images[$image->fid] = $image;
        }

        // Process images and video items
        foreach ($slide->items as &$item) {
          switch ($item["type"]) {
            case "video":
              if ($item["thumbid"] > 0) {
                $image = file_load($item["thumbid"]);
                $item["thumbid"] = $image->filename;
                $images[$image->fid] = $image;
              }
              break;
            case "image":
              if ($item["fileid"] > 0) {
                $image = file_load($item["fileid"]);
                $item["fileid"] = $image->filename;
                $images[$image->fid] = $image;
              }
              break;
          }
        }
      }

      // Add file slider data to zip
      $slider_data = serialize(array("slider" => $slider, "slides" => $slides));
      $zip->addFile($slider_data, "fullscreen_slider_{$index}.txt");
    }

    // Add images to zip file
    $zip->addDirectory("images");
    foreach ($images as $image)
      $zip->addFile(file_get_contents($image->uri), "images/{$image->filename}");

    // Return export data file
    $zip->sendZip("full_screen_slider_export.zip");
  }
  else
    drupal_goto("admin/structure/fullscreen-slider/export");
}

/**
 * callback to create export & import form
 */
function md_fullscreen_slider_export_import_form($form, &$form_state) {
  $form = array();

  // Generate form to export fullScreen Slider
  $sliders = MDFullScreenSlider::get_all();
  $options = array();
  if ($sliders !== FALSE)
    foreach ($sliders as $slider)
      $options[$slider->id] = $slider->title;

  $form["export"] = array(
    "#type" => "fieldset",
    "#collapsile" => FALSE,
    "#title" => t("Export FullScreen Slider"),
  );
  $form["export"]["sliders"] = array(
    "#type" => "checkboxes",
    "#title" => t("Choose FullScreen Sliders to export"),
    "#options" => $options,
  );
  $form["export"]["export_btn"] = array(
    "#markup" => "<a id='edit-export-btn' class='form-submit' href='#'>" . t("Export") . "</a>",
  );

  // Import form
  $form["import"] = array(
    "#type" => "fieldset",
    "#collapsile" => FALSE,
    "#title" => t("Import FullScreen Slider"),
  );
  $form["import"]["file_import"] = array(
    "#title" => t("Data file"),
    "#type" => "file",
    "#description" => t("The export data file."),
    "#name" => "files[]",
  );
  $form["import"]["buttons"]["submit"] = array(
    "#type" => "submit",
    "#value" => t("Import"),
  );
  drupal_add_js(drupal_get_path("module", "md_fullscreen_slider") . "/js/admin/md-fullscreen-slider.export.js");

  return $form;
}

/**
 * Callback to validate import form
 */
function md_fullscreen_slider_export_import_form_validate($form, &$form_state) {
  // Check file name
  if (isset($_FILES["files"]["name"][0]) && !empty($_FILES["files"]["name"][0])) {
    $file = file_save_upload(0, array("file_validate_extensions" => array("zip")));
    if ($file) {
      if ($file = file_move($file, "public://"))
        $form_state["values"]["file_import"] = $file;
      else
        form_set_error("file_import", t("Import slider is failed!"));
    }
  }
  else
    form_set_error("file_import", t("No file was uploaded."));
}

/**
 * Callback to handle submit import form
 */
function md_fullscreen_slider_export_import_form_submit($form, &$form_state) {
  $images = array();
  $sliders = array();

  // Get import data
  $import_file = drupal_realpath($form_state["values"]["file_import"]->uri);
  $zip = zip_open($import_file);
  while (($entry = zip_read($zip))) {
    $entry_name = zip_entry_name($entry);
    if ($entry_name == "images/")
      continue;

    // Process import images
    if (strpos($entry_name, "images/") !== FALSE) {
      $image_name = explode("/", $entry_name);
      $image_name = $image_name[1];

      // Get image content
      zip_entry_open($zip, $entry);
      $entry_content = zip_entry_read($entry, zip_entry_filesize($entry));
      $image = file_save_data($entry_content, "public://{$image_name}", FILE_EXISTS_RENAME);
      if ($image !== FALSE)
        $images[$image_name] = $image;
      zip_entry_close($entry);
    }
    elseif (strpos($entry_name, "fullscreen_slider_") !== FALSE) {
      // Get slider data
      zip_entry_open($zip, $entry);
      $sliders[] = zip_entry_read($entry, zip_entry_filesize($entry));
      zip_entry_close($entry);
    }
  }
  zip_close($zip);

  // Import sliders to database
  foreach ($sliders as $slider_data) {
    // Get slider data
    $slider_data = unserialize($slider_data);
    $slider = $slider_data["slider"];
    $slides = $slider_data["slides"];

    // Save slider to database
    $slider->id = NULL;
    if (_fullscreen_check_machine_name($slider->machine_name))
      $slider->machine_name = "import-{$slider->machine_name}-".time();
    if (!$slider->save()) {
      drupal_set_message(t("FullScreen Slider: Import unsuccessful!"), "error");
      return;
    }

    // Save slides to database
    foreach ($slides as $slide) {
      $slide->id = NULL;
      $slide->sid = $slider->id;

      // Get background and thumbnail settings after import
      if ($slide->settings["bgFid"] != -1 && isset($images[$slide->settings["bgFid"]]))
        $slide->settings["bgFid"] = $images[$slide->settings["bgFid"]]->fid;
      else
        $slide->settings["bgFid"] = -1;

      if ($slide->settings["thumbFid"] != -1 && isset($images[$slide->settings["thumbFid"]]))
        $slide->settings["thumbFid"] = $images[$slide->settings["thumbFid"]]->fid;
      else
        $slide->settings["thumbFid"] = -1;

      // Get file id of image and video item
      foreach ($slide->items as &$item) {
        switch ($item["type"]) {
          case "video":
            if ($item["thumbid"] && isset($images[$item["thumbid"]]))
              $item["thumbid"] = $images[$item["thumbid"]]->fid;
            break;

          case "image":
            if ($item["fileid"] && isset($images[$item["fileid"]]))
              $item["fileid"] = $images[$item["fileid"]]->fid;
            break;
        }
      }

      $slide->save();
    }
  }

  drupal_set_message(t("FullScreen Slider: Import successful!"));
}

/**
 * Callback to delete slide from database
 */
function md_fullscreen_slider_delete_slide() {
  $response = array("status" => 0);
  if (isset($_POST["slide_id"]))
    if (MDFullScreenSlide::delete($_POST["slide_id"]))
      $response["status"] = 1;

  drupal_json_output($response);
  exit;
}