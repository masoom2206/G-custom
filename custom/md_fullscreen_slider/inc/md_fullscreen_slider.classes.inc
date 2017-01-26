<?php
/**
 * @author: MegaDrupal
 * @file: md_fullscreen_slider.classes.inc
 */

/**
 * Recast stdClass object to custom object
 */
function _fullscreen_slider_recast($className, stdClass &$object) {
  if (!class_exists($className)) {
    throw new InvalidArgumentException(sprintf('Inexistant class %s.', $className));
  }

  $new = new $className();

  foreach ($object as $property => &$value) {
    $new->$property = & $value;
    unset($object->$property);
  }
  unset($value);
  $object = (unset) $object;

  return $new;
}

/**
 * Class MDFullScreenSlider
 *
 * Object for each record of md_fullscreen_sliders table
 */
class MDFullScreenSlider {
  public $id;
  public $uid;
  public $title;
  public $machine_name;
  public $description;
  public $extended_item;
  public $settings;

  /**
   * get list fields in database
   */
  public function get_fields() {
    return array("uid", "title", "machine_name", "description", "extended_item", "settings");
  }

  /**
   * initialize data for MDFullScreenSlider object
   */
  public function initialize() {
    if (is_string($this->settings)) {
      $this->settings = unserialize($this->settings);
    }
    $this->settings = array_merge(MDFullScreenSlider::get_default_settings(), $this->settings);
  }

  /**
   * Save data slider to database
   */
  public function save() {
    // Prepare data
    $fields = array();
    foreach ($this->get_fields() as $field)
      $fields[$field] = $this->{$field};

    // Convert settings to string before save to database
    if (is_array($fields["settings"]))
      $fields["settings"] = serialize($fields["settings"]);

    // Insert new record if $id <= 0
    if ($this->id && $this->id > 0)
      $response = db_update("md_fullscreen_sliders")
        ->fields($fields)
        ->condition("id", $this->id)
        ->execute();
    else {
      $response = db_insert("md_fullscreen_sliders")
        ->fields($fields)
        ->execute();
      if ($response > 0)
        $this->id = $response;
    }

    return (bool) $response;
  }

  /**
   * get all sliders on your site
   */
  public static function get_all() {
    $result = db_select("md_fullscreen_sliders", "mfs")
      ->fields("mfs")
      ->execute()
      ->fetchAll(PDO::FETCH_CLASS, "MDFullScreenSlider");

    // Check result of query
    if (count($result) == 0)
      return FALSE;

    // Initialize data of MDFullScreenSlider object
    foreach ($result as &$slider) {
      if ($slider instanceof stdClass)
        $slider = _fullscreen_slider_recast("MDFullScreenSlider", $slider);

      $slider->initialize();
    }

    return $result;
  }

  /**
   * get slider by id
   */
  public static function get($id) {
    $result = db_select("md_fullscreen_sliders", "mfs")
      ->fields("mfs")
      ->condition("id", $id)
      ->execute()
      ->fetchAll(PDO::FETCH_CLASS, "MDFullScreenSlider");

    // Check result of query
    if (count($result) != 1)
      return FALSE;

    // Initialize data of MDFullScreenSlider object
    foreach ($result as &$slider) {
      if ($slider instanceof stdClass)
        $slider = _fullscreen_slider_recast("MDFullScreenSlider", $slider);

      $slider->initialize();
    }

    return array_shift($result);
  }

  /**
   * get slider by machine_name
   */
  public static function get_by_machine_name($machine_name) {
    $result = db_select("md_fullscreen_sliders", "mfs")
      ->fields("mfs")
      ->condition("machine_name", $machine_name)
      ->execute()
      ->fetchAll(PDO::FETCH_CLASS, "MDFullScreenSlider");

    // Check result of query
    if (count($result) != 1)
      return FALSE;

    // Initialize data of MDFullScreenSlider object
    foreach ($result as &$slider) {
      if ($slider instanceof stdClass)
        $slider = _fullscreen_slider_recast("MDFullScreenSlider", $slider);

      $slider->initialize();
    }

    return array_shift($result);
  }

  /**
   * get slider by uid
   */
  public static function get_by_uid($uid) {
    $result = db_select("md_fullscreen_sliders", "mfs")
      ->fields("mfs")
      ->condition("uid", $uid)
      ->execute()
      ->fetchAll(PDO::FETCH_CLASS, "MDFullScreenSlider");

    // Check result of query
    if (count($result) == 0)
      return FALSE;

    // Initialize data of MDFullScreenSlider object
    foreach ($result as &$slider) {
      if ($slider instanceof stdClass)
        $slider = _fullscreen_slider_recast("MDFullScreenSlider", $slider);

      $slider->initialize();
    }

    return $result;
  }

  /**
   * get slider by uid
   */
  public static function get_by_extended_item($item_id) {
    $result = db_select("md_fullscreen_sliders", "mfs")
      ->fields("mfs")
      ->condition("extended_item", $item_id)
      ->execute()
      ->fetchAll(PDO::FETCH_CLASS, "MDFullScreenSlider");

    // Check result of query
    if (count($result) == 0)
      return FALSE;

    // Initialize data of MDFullScreenSlider object
    foreach ($result as &$slider) {
      if ($slider instanceof stdClass)
        $slider = _fullscreen_slider_recast("MDFullScreenSlider", $slider);

      $slider->initialize();
    }

    return $result;
  }

  /**
   * Delete slider from database
   */
  public static function delete($id) {
    // Delete all slides of this slider
    MDFullScreenSlide::delete_by_slider($id);

    // Delete slider in database
    return db_delete("md_fullscreen_sliders")
      ->condition("id", $id)
      ->execute();
  }

  /**
   * get default settings for each slide
   */
  public static function get_default_settings($key = NULL) {
    static $default = array(
      "slide_width" => "100%",
      "slide_height" => "100%",
      "auto_start" => 1,
      "pause_hover" => 0,
      "enable_touch" => 1,
      "key_navigation" => 1,
      "loop" => 1,
      "show_loading_bar" => 0,
      "loading_bar_position" => "bottom",
      "enable_preloaded" => 1,
      "transition_time" => 800,
      "show_next_prev" => 1,
      "hover_next_prev" => 1,
      "navigation_button" => 1,
      "navigation_position" => "bottom",
      "hover_navigation" => 0,
      "thumbnail_navigation" => 0,
      "thumbnail_width" => 100,
      "thumbnail_height" => 60,
      "thumbnail_position" => "1",
      "thumbnail_container_width" => "80%",
      "thumbnail_active_opacity" => 100,
      "thumbnail_inactive_opacity" => 80,
      "skin" => "skin1",
      "background_color" => "#000000",
      "custom_css" => "",
      "callback_init" => "function(){}",
      "callback_bfTransition" => "function(){}",
      "callback_afTransition" => "function(){}",
      "use_google_font" => 0,
      "google_font" => "",
      "use_typekit" => 0,
      "typekit_id" => "",
      "dont_include_font" => 0,
      "generate_css_file" => 0,
    );

    // Get specify setting
    if ($key && isset($default[$key])) {
      return $default[$key];
    }

    // Return all default settings
    return $default;
  }
}

/**
 * Class MDFullScreenSlide
 *
 * Object for each record of md_fullscreen_slides table
 */
class MDFullScreenSlide {
  public $id;
  public $sid;
  public $position;
  public $settings;
  public $items;

  /**
   * get list fields in database
   */
  public function get_fields() {
    return array("sid", "position", "settings", "items");
  }

  /**
   * Initialize properties
   */
  public function initialize() {
    if (is_string($this->settings))
      $this->settings = unserialize($this->settings);

    if (is_string($this->items))
      $this->items = unserialize($this->items);

    // Load thumbnail and background image
    $this->settings["bgImage"] = file_create_url(drupal_get_path("module", "md_fullscreen_slider") . "/js/admin/images/default_bg.png");
    $this->settings["thumb"] = $this->settings["bgImage"];
    if ($this->settings["bgFid"] > 0) {
      $background = file_load($this->settings["bgFid"]);
      if ($background) {
        $this->settings["bgImage"] = file_create_url($background->uri);
        $this->settings["thumb"] = image_style_url("thumbnail_full_slider_{$this->sid}", $background->uri);
      }
    }

    if ($this->settings["thumbFid"] > 0) {
      $thumb = file_load($this->settings["thumbFid"]);
      if ($thumb)
        $this->settings["thumb"] = image_style_url("thumbnail_full_slider_{$this->sid}", $thumb->uri);
    }
  }

  /**
   * Save slide to database
   */
  public function save() {
    // Prepare data of slide before save to database
    $fields = array();
    foreach ($this->get_fields() as $field)
      $fields[$field] = $this->{$field};

    if (is_array($fields["settings"]))
      $fields["settings"] = serialize($fields["settings"]);

    if (is_array($fields["items"]))
      $fields["items"] = serialize($fields["items"]);


    // Create new record if is new slide
    if ($this->id && $this->id > 0)
      $response = db_update("md_fullscreen_slides")
        ->fields($fields)
        ->condition("id", $this->id)
        ->execute();
    else {
      $response = db_insert("md_fullscreen_slides")
        ->fields($fields)
        ->execute();

      if ($response)
        $this->id = $response;
    }

    return (bool) $response;
  }

  /**
   * get slide
   */
  public static function get($id) {
    $results = db_select("md_fullscreen_slides", "mfs")
      ->fields("mfs")
      ->condition("id", $id)
      ->execute()
      ->fetchAll(PDO::FETCH_CLASS, "MDFullScreenSlide");

    if (count($results) !== 1)
      return FALSE;

    // Initialize all slide object
    $slide = array_shift($results);
    if ($slide instanceof stdClass)
      $slide = _fullscreen_slider_recast("MDFullScreenSlide", $slide);

    $slide->initialize();

    return $slide;
  }

  /**
   * get slides of slider by id
   */
  public static function get_by_sid($sid) {
    $results = db_select("md_fullscreen_slides", "mfs")
      ->fields("mfs")
      ->condition("sid", $sid)
      ->orderBy("position")
      ->execute()
      ->fetchAll(PDO::FETCH_CLASS, "MDFullScreenSlide");

    if (count($results) == 0)
      return FALSE;

    // Initialize all slide object
    foreach ($results as &$slide) {
      if ($slide instanceof stdClass)
        $slide = _fullscreen_slider_recast("MDFullScreenSlide", $slide);

      $slide->initialize();
    }

    return $results;
  }

  /**
   * Delete slides of slider
   */
  public static function delete_by_slider($sid) {
    return db_delete("md_fullscreen_slides")
      ->condition("sid", $sid)
      ->execute();
  }

  /**
   * Delete slide by slide id
   */
  public static function delete($id) {
    return db_delete("md_fullscreen_slides")
      ->condition("id", $id)
      ->execute();
  }

  /**
   * get default settings for each slide
   */
  public static function get_default_settings($key = NULL) {
    static $default = array(
      "bgFid" => -1,
      "bgColor" => "",
      "customThumb" => FALSE,
      "thumbFid" => -1,
      "customTransitionTime" => FALSE,
      "transitionTime" => "",
      "timelinewidth" => 7000,
      "transitions" => array(),
    );

    // Get specify setting
    if ($key && isset($default[$key]))
      return $default[$key];

    // Return all default settings
    return $default;
  }
}

class MDFullScreenOption {
  public static $start_animations = array(
    "none" => "none",
    "random" => "random",
    "bounceIn" => "bounceIn",
    "bounceInDown" => "bounceInDown",
    "bounceInUp" => "bounceInUp",
    "bounceInLeft" => "bounceInLeft",
    "bounceInRight" => "bounceInRight",
    "fadeIn" => "fadeIn",
    "fadeInUp" => "fadeInUp",
    "fadeInDown" => "fadeInDown",
    "fadeInLeft" => "fadeInLeft",
    "fadeInRight" => "fadeInRight",
    "fadeInRight" => "fadeInRight",
    "fadeInUpBig" => "fadeInUpBig",
    "fadeInDownBig" => "fadeInDownBig",
    "fadeInLeftBig" => "fadeInLeftBig",
    "fadeInRightBig" => "fadeInRightBig",
    "flipInX" => "flipInX",
    "flipInY" => "flipInY",
    "foolishIn" => "foolishIn",
    "lightSpeedIn" => "lightSpeedIn",
    "rollIn" => "rollIn",
    "rotateIn" => "rotateIn",
    "rotateInDownLeft" => "rotateInDownLeft",
    "rotateInDownRight" => "rotateInDownRight",
    "rotateInUpLeft" => "rotateInUpLeft",
    "rotateInUpRight" => "rotateInUpRight",
    "twisterInDown" => "twisterInDown",
    "twisterInUp" => "twisterInUp",
    "swap" => "swap",
    "swashIn" => "swashIn",
    "tinRightIn" => "tinRightIn",
    "tinLeftIn" => "tinLeftIn",
    "tinUpIn" => "tinUpIn",
    "tinDownIn" => "tinDownIn",
  );

  public static $stop_animations = array(
    "none" => "none",
    "keep" => "Keep in slide",
    "random" => "random",
    "bombRightOut" => "bombRightOut",
    "bombLeftOut" => "bombLeftOut",
    "bounceOut" => "bounceOut",
    "bounceOutDown" => "bounceOutDown",
    "bounceOutUp" => "bounceOutUp",
    "bounceOutLeft" => "bounceOutLeft",
    "bounceOutRight" => "bounceOutRight",
    "fadeOut" => "fadeOut",
    "fadeOutUp" => "fadeOutUp",
    "fadeOutDown" => "fadeOutDown",
    "fadeOutLeft" => "fadeOutLeft",
    "fadeOutRight" => "fadeOutRight",
    "fadeOutRight" => "fadeOutRight",
    "fadeOutUpBig" => "fadeOutUpBig",
    "fadeOutDownBig" => "fadeOutDownBig",
    "fadeOutLeftBig" => "fadeOutLeftBig",
    "fadeOutRightBig" => "fadeOutRightBig",
    "flipOutX" => "flipOutX",
    "flipOutY" => "flipOutY",
    "foolishOut" => "foolishOut",
    "hinge" => "hinge",
    "holeOut" => "holeOut",
    "lightSpeedOut" => "lightSpeedOut",
    "puffOut" => "puffOut",
    "rollOut" => "rollOut",
    "rotateOut" => "rotateOut",
    "rotateOutDownLeft" => "rotateOutDownLeft",
    "rotateOutDownRight" => "rotateOutDownRight",
    "rotateOutUpLeft" => "rotateOutUpLeft",
    "rotateOutUpRight" => "rotateOutUpRight",
    "rotateDown" => "rotateDown",
    "rotateUp" => "rotateUp",
    "rotateLeft" => "rotateLeft",
    "rotateRight" => "rotateRight",
    "swashOut" => "swashOut",
    "tinRightOut" => "tinRightOut",
    "tinLeftOut" => "tinLeftOut",
    "tinUpOut" => "tinUpOut",
    "tinDownOut" => "tinDownOut",
    "vanishOut" => "vanishOut",
  );

  public static $slide_transitions = array(
    "fade",
    "slit-horizontalLeftTop",
    "slit-horizontalTopRight",
    "slit-horizontalBottomUp",
    "slit-verticalDown",
    "slit-verticalUp",
    "stripUp",
    "stripDown",
    "stripLeft",
    "stripRight",
    "stripRightLeft",
    "stripUpDown",
    "curtainX",
    "curtainY",
    "slideInRight",
    "slideInLeft",
    "slideInUp",
    "slideInDown",
    "css3-moveRightLeftEasing",
    "css3-moveLeftTopEasing",
    "css3-moveBottomTopEasing",
    "css3-moveFromTopMoveToBottomEasing",
    "css3-moveRightScaleDown",
    "css3-moveLeftScaleDown",
    "css3-moveBottomScaleDown",
    "css3-moveTopScaleDown",
    "css3-scaleUpDownScaleDown",
    "css3-scaleUpScaleDownUp",
    "css3-scaleUpMoveToLeft",
    "css3-scaleUpMoveToRight",
    "css3-scaleUpMoveToTop",
    "css3-scaleUpMoveToBottom",
    "css3-scaleUpCenterScaleDownCenter",
    "css3-moveFromRightRotateRightSideFirst",
    "css3-moveFromLeftRotateLeftSideFirst",
    "css3-moveFromTopRotateTopSideFirst",
    "css3-moveFromBottomRotateBottomSideFirst",
    "css3-flipInLeftFlipOutRight",
    "css3-flipInRightFlipOutLeft",
    "css3-flipInBottomFlipOutTop",
    "css3-flipInTopFlipOutBottom",
    "css3-scaleUpRotateFall",
    "css3-rotateInNewspaperRotateOutNewspaper",
    "css3-moveFromRightRotatePushLeft",
    "css3-moveFromLeftRotatePushRight",
    "css3-moveFromBottomRotatePushTop",
    "css3-moveFromTopRotatePushBottom",
    "css3-rotatePullRightRotatePushLeft",
    "css3-rotatePullLeftRotatePushRight",
    "css3-rotatePullBottomRotatePushTop",
    "css3-rotatePullTopRotatePushBottom",
    "css3-moveFromRightFadeRotateFoldLeft",
    "css3-moveFromLeftFadeRotateFoldRight",
    "css3-moveFromBottomFadeRotateFoldTop",
    "css3-moveFromTopFadeRotateFoldBottom",
    "css3-rotateUnfoldLeftMoveToRightFade",
    "css3-rotateUnfoldRightMoveToLeftFade",
    "css3-rotateUnfoldTopMoveToBottomFade",
    "css3-rotateUnfoldBottomMoveToTopFade",
    "css3-rotateRoomLeftInRotateRoomLeftOut",
    "css3-rotateRoomRightInRotateRoomRightOut",
    "css3-rotateRoomTopInRotateRoomTopOut",
    "css3-rotateRoomBottomInRotateRoomBottomOut",
    "css3-rotateCubeLeftInRotateCubeLeftOut",
    "css3-rotateCubeRightInRotateCubeRightOut",
    "css3-rotateCubeTopInRotateCubeTopOut",
    "css3-rotateCubeBottomInRotateCubeBottomOut",
    "css3-rotateCarouselLeftInRotateCarouselLeftOut",
    "css3-rotateCarouselRightInRotateCarouselRightOut",
    "css3-rotateCarouselTopInRotateCarouselTopOut",
    "css3-rotateCarouselBottomInRotateCarouselBottomOut",
    "css3-rotateSidesInRotateSidesOut",
    "css3-rotateSlideInRotateSlideOut",
  );
}