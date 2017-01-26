<?php
/**
 * @author: MegaDrupal
 * @file: edit_form.tpl.php
 *
 * Contains template for edit slider form
 */
?>
<div class="mdf-wrap">
<div id="mdf-tabs" data-timelinewidth="7000">
  <div class="mdf-tabs-tool">
    <ul class="mdf-tabs-head clearfix">
      <?php if ($slides !== FALSE && is_array($slides)): ?>
        <?php foreach ($slides as $slide): ?>
          <li class="tab-item">
            <a class="tab-link" href="#tabs-<?php print $slide->position; ?>">
              <span class="tab-text">Slide <?php print $slide->position; ?></span>
            </a>
            <a class="panel-settings-link" href="#"></a>
          </li>
        <?php endforeach; ?>
      <?php else: ?>
        <li class="tab-item">
          <a class="tab-link" href="#tabs-1">
            <span class="tab-text">Slide 1</span>
          </a>
          <a class="panel-settings-link" href="#"></a>
        </li>
      <?php endif; ?>
    </ul>
    <a id="add_tab" class="mdf-button" href="#"><i class="addtab-icon"></i></a>

    <div class="mdf-tool-group">
      <a href="#" id="mdf-slide-preview" class="mdf-button" title="Preview"><i class="mdt-icon preview-icon"></i></a>
      <a href="#" id="mdf-slide-save" class="mdf-button" title="Save"><i class="mdt-icon save-icon"></i></a>
      <a href="#" id="mdf-slide-exit" class="mdf-button" title="Exit"><i class="mdt-icon exit-icon"></i></a>
    </div>
    <div class="mdf-setting" id="mdf-setting-dlg" style="display: none;">
      <div class="mdf-setting-aside">
        <input class="setting-slideid" type="hidden"/>

        <div class="row row-clone">
          <a href="#" class="btn-choose"><span class="mdf-button panel-clone"><i class="icon-clone"></i></span>Clone
            slide</a>
        </div>
        <div class="row row-image">
          <div class="mds-head">
            <a href="#" class="btn-choose"><span class="mdf-button slide-choose-image-link"><i
                  class="icon-image"></i></span>Choose slide image</a>
          </div>
          <div class="row-inner">
            <div class="img-current img-preview">
              <input class="setting-bgfid" type="hidden"/>
              <img src="images/image.png" alt="image">
              <a class="del-img" href="#"></a>
            </div>
          </div>
        </div>
        <div class="row row-background-color">
          <input type="hidden" value="" autocomplete="off"/>
          <label class="lb-color">Backgroud color</label>
        </div>
        <div class="row row-thumbnail">
          <div class="mds-head">
            <input type="checkbox" name="custom_thumbnail" id="tst-thumbnail">
            <label for="tst-thumbnail" class="lb-tick">Custom thumbnail</label>
          </div>
          <div class="row-inner">
            <div class="mds-head">
              <a href="#" class="btn-choose"><span class="mdf-button slide-choose-thumbnail-link"><i
                    class="icon-image"></i></span>Choose thumbnail</a>
            </div>
            <div class="row-inner">
              <div class="img-current img-preview">
                <input class="setting-thumbfid" type="hidden"/>
                <img src="images/image.png" alt="image">
                <a class="del-thumb"></a>
              </div>
            </div>
          </div>
        </div>
        <div class="row row-transition">
          <div class="mds-head">
            <input type="checkbox" name="custom_transition" id="tst-transition">
            <label for="tst-transition" class="lb-tick">Custom transition time</label>
          </div>
          <div class="row-inner">
            <input class="trans-time input-50" type="text">
            <label class="lb-milli">milliseconds</label>
          </div>
        </div>
        <div class="row row-remove">
          <a href="#" class="btn-choose"><span class="mdf-button"><i class="icon-remove"></i></span>Remove</a>
        </div>
      </div>
      <!-- /.mdf-setting-aside -->
      <div class="mdf-setting-transition">
        <h3>Transitions <a href="#" class="random-transition">[choose random]</a></h3>

        <p>You can select multiple value, slide will take random effect form what you selected</p>

        <div id="navbar-content-transitions" class="transition-inner">
          <div id="navbar-content" class="navbar-content navbar-content-tr">
            <ul class="megaslider-3columns clearfix">
              <?php $transitions = MDFullScreenOption::$slide_transitions; ?>
              <?php for ($i = 0; $i < 8; $i++): ?>
                <?php if (isset($transitions[$i * 10])): ?>
                  <ul>
                    <?php for ($j = 0; $j <= 9; $j++): ?>
                      <?php if (isset($transitions[$i * 10 + $j])): ?>
                        <li>
                          <input id="transition-<?php print $i * 10 + $j; ?>"
                                 value="<?php print $transitions[$i * 10 + $j]; ?>" type="checkbox">
                          <label for="transition-<?php print $i * 10 + $j; ?>">Transition
                            #<?php print $i * 10 + $j + 1; ?></label>
                        </li>
                      <?php endif; ?>
                    <?php endfor; ?>
                  </ul>
                <?php endif; ?>
              <?php endfor; ?>
            </ul>
          </div>
        </div>
        <div id="mdf-transition-preview" class="transition-preview" style="display: none;">
          <div class="mdf-slide-wrap">
            <div class="mdf-slide-items" id="mdf-full-screen-slider-preview">
              <div class="mdf-slide-item" data-timeout="2000">
                <div class="mdf-mainimg"><img
                    src="<?php print file_create_url(drupal_get_path("module", "md_fullscreen_slider") . "/js/admin/images/1.jpg"); ?>"
                    style="top:0; left:0;"/></div>
                <div class="mdf-objects">

                </div>
              </div>
              <div class="mdf-slide-item" data-timeout="2000" style="display: none;">
                <div class="mdf-mainimg"><img
                    src="<?php print file_create_url(drupal_get_path("module", "md_fullscreen_slider") . "/js/admin/images/2.jpg"); ?>"
                    style="top:0; left:0;"/></div>
                <div class="mdf-objects">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- /.mdf-setting-transition -->
      <div class="mdf-setting-footer">
        <a class="btn-footer button-apply" href="#">Apply</a>
        <a class="btn-footer button-close" href="#">Close</a>
      </div>
      <!-- /.mdf-setting-footer -->
    </div>
    <!-- /.mdf-setting -->
  </div>
  <!-- /.mdf-tabs-tool -->
  <?php if ($slides !== FALSE && is_array($slides)): ?>
    <?php foreach ($slides as $slide): ?>
      <div id="tabs-<?php print $slide->position; ?>" class="tabs-panel"
           data-timelinewidth="<?php print $slide->settings["timelinewidth"]; ?>">
        <div class="mdf-slidewrap mdf-fullwidth">
          <div class="mdf-slide-image"><img src="<?php print $slide->settings["bgImage"]; ?>" alt=""></div>
          <div class="mdf-objects" style="width: 1220px; height: 660px">
            <?php foreach ($slide->items as $item): ?>
              <?php print theme("admin_fullscreen_slider_item", array("item" => $item)); ?>
            <?php endforeach; ?>
          </div>
        </div>
        <input type="hidden" autocomplete="off" value='<?php print drupal_json_encode($slide->settings); ?>'
               class="tab-setting">
      </div><!-- /#tabs-<?php print $slide->position;?> -->
    <?php endforeach; ?>
  <?php else: ?>
    <div id="tabs-1" class="tabs-panel">
      <div class="mdf-slidewrap mdf-fullwidth">
        <div class="mdf-slide-image"><img
            src="<?php print(base_path() . drupal_get_path("module", "md_fullscreen_slider")); ?>/js/admin/images/default_bg.png"
            alt=""></div>
        <div class="mdf-objects" style="width: 1220px; height: 660px"></div>
      </div>
      <input type="hidden" autocomplete="off"
             value='{"slideId":"-1","bgFid":"-1","bgImage":"<?php print(base_path() . drupal_get_path("module", "md_fullscreen_slider")); ?>/js/admin/images/default_bg.png","bgColor":"","customThumb":false,"thumb":"","thumbFid":"-1" ,"customTransitionTime":false,"transitionTime":"<?php print $slider->settings["transition_time"]; ?>","transitions":[]}'
             class="tab-setting">
    </div><!-- /#tabs-1 -->
  <?php endif; ?>
</div>
<!-- /#mdf-tabs -->
<div id="mdf-toolbar" class="mdf-toolbar">
<div class="viewport">
<div class="overview">
<div class="box-toolbar add-new-object">
  <h3>
    Add new object
    <i class="show"></i>
    <i class="hide"></i>
  </h3>

  <div class="box-content">
    <a class="mdf-button btn-text" href="#"><i class="mdt-text"></i></a>
    <a class="mdf-button btn-image" href="#"><i class="mdt-image"></i></a>
    <a class="mdf-button btn-video" href="#"><i class="mdt-video"></i></a>
  </div>
</div>
<!-- /.add-new-object -->
<div class="box-toolbar object-image box-item box-image">
  <h3>Selected object: Image
    <i class="show"></i>
    <i class="hide"></i>
  </h3>

  <div class="box-content clearfix">
    <div class="row">
      <a id="mdf-edit-image" class="mdf-button" href="#"><i class="mdt-edit"></i></a>
    </div>
    <div class="row alt-image">
      <label>Name:</label>
      <input class="mdt-alt-image input-150" type="text" value="">
    </div>
  </div>
</div>
<!-- /.object-image -->
<div class="box-toolbar object-image box-item box-text">
  <h3>Selected object: Text
    <i class="show"></i>
    <i class="hide"></i>
  </h3>

  <div class="box-content">
    <textarea class="mdt-texttitle input-180" name="title"></textarea>
  </div>
</div>
<!-- /.object-text -->
<div class="box-toolbar object-image box-item box-video">
  <h3>Selected object: Video
    <i class="show"></i>
    <i class="hide"></i>
  </h3>

  <div class="box-content clearfix">
    <div class="row">
      <a id="mdf-edit-video" class="mdf-button" href="#"><i class="mdt-edit"></i></a>
    </div>
  </div>
</div>
<!-- /.object-image -->
<div class="box-toolbar align-space box-item box-align">
  <h3>Align & Space
    <i class="show"></i>
    <i class="hide"></i>
  </h3>

  <div class="box-content">
    <section class="box-section align">
      <a href="#" class="mdt-align-left mdt-btn-align" title="Align left edge"></a>
      <a href="#" class="mdt-align-center mdt-btn-align" title="Align horizontal center"></a>
      <a href="#" class="mdt-align-right mdt-btn-align" title="Align right edge"></a>
      <a href="#" class="mdt-align-top mdt-btn-align" title="Align top edge"></a>
      <a href="#" class="mdt-align-vcenter mdt-btn-align" title="Align vertical center"></a>
      <a href="#" class="mdt-align-bottom mdt-btn-align" title="Align bottom edge"></a>
    </section>
    <section class="box-section space last">
      <label>Space</label>
      <a href="#" class="mdt-spacev mdt-btn-space" title="Space evenly vertically"></a>
      <a href="#" class="mdt-spaceh mdt-btn-space" title="Space evenly horizontally"></a>
      <input class="mdt-spacei input-35" type="text" value=""><label> px</label>
    </section>
  </div>
</div>
<!-- /.align-space -->
<div class="box-toolbar size-position box-item box-text box-image box-video">
  <h3>Size & Position
    <i class="show"></i>
    <i class="hide"></i>
  </h3>

  <div class="box-content">
    <div class="row">
      <label class="lb-width">Width:</label><input class="mdt-width input-50 mdt-input" type="text" value=""
                                                   name="width">
      <label class="lb-left">X:</label><input class="mdt-left input-50 mdt-input" type="text" value="" name="left">
    </div>
    <div class="row">
      <label class="lb-height">Height:</label><input class="mdt-height input-50 mdt-input" type="text" value=""
                                                     name="height">
      <label class="lb-top">Y:</label><input class="mdt-top input-50 mdt-input" type="text" value="" name="top">
    </div>
    <a class="mdt-proportions" href="#" title="proportions"></a>
  </div>
</div>
<!-- /.size-position -->
<div class="box-toolbar animation box-item box-text box-image box-video">
  <h3>Animation
    <i class="show"></i>
    <i class="hide"></i>
  </h3>

  <div class="box-content">
    <div class="row">
      <label>Start:</label>

      <div class="style-select input-140 ">
        <select class="mdt-select mdt-startani mdt-input" name="startani">
          <?php foreach (MDFullScreenOption::$start_animations as $op => $animation): ?>
            <option value="<?php print $op; ?>"><?php print $animation; ?></option>
          <?php endforeach; ?>
        </select>
      </div>
    </div>
    <div class="row">
      <label>Duration (millisecond):</label>
      <input class="mdt-startani-time input-50 mdt-input" type="text" value="" name="startaniTime">
    </div>
    <div class="row">
      <label>Stop:</label>

      <div class="style-select input-140">
        <select class="mdt-select mdt-stopani mdt-input" name="stopani">
          <?php foreach (MDFullScreenOption::$stop_animations as $op => $animation): ?>
            <option value="<?php print $op; ?>"><?php print $animation; ?></option>
          <?php endforeach; ?>
        </select>
      </div>
    </div>
    <div class="row">
      <label>Duration (millisecond):</label>
      <input class="mdt-stopani-time input-50 mdt-input" type="text" value="" name="stopaniTime">
    </div>
  </div>
</div>
<!-- /.animation -->
<div class="box-toolbar adjustments box-item box-text box-image box-video">
  <h3>Adjustments
    <i class="show"></i>
    <i class="hide"></i>
  </h3>

  <div class="box-content">
    <section class="box-section adj-color">
      <div class="row">
        <input type="hidden" class="mdt-color mdt-input" name="color" value="" autocomplete="off"/>
        <label class="lb-color">Color</label>
      </div>
      <div class="row">
        <input type="hidden" class="mdt-background-color mdt-input" name="backgroundColor" value="" autocomplete="off"/>
        <label class="lb-color">Background Color</label>
      </div>
    </section>
    <!-- /.adj-color -->
    <section class="box-section opacity">
      <label for="mdt-opacity" class="lb-opacity">Transparent</label>

      <div id="mdt-opacity-slider" class="mdt-control"><input id="mdt-opacity" type="hidden" class="opacity mdt-input"
                                                              name="opacity" value="" autocomplete="off"/></div>
    </section>
    <!-- /.opacity -->
    <section class="box-section padding">
      <div class="padding-header">
        <input id="checkbox-padding" type="checkbox">
        <label for="checkbox-padding" class="section-label lb-tick">Padding (px)</label>
      </div>
      <div id="padding-content">
        <div class="row">
          <label class="lb-top">Top </label><input class="mdt-padding mdt-p-top input-35 mdt-input" type="text"
                                                   name="paddingTop">
          <label class="lb-bottom">Bottom </label><input class="mdt-padding mdt-p-bottom input-35 mdt-input" type="text"
                                                         name="paddingBottom">
        </div>
        <div class="row">
          <label class="lb-right">Right </label><input class=" mdt-padding mdt-p-right input-35 mdt-input" type="text"
                                                       name="paddingRight">
          <label class="lb-left">Left </label><input class=" mdt-padding mdt-p-left input-35 mdt-input" type="text"
                                                     name="paddingLeft">
        </div>
      </div>
    </section>
    <!-- /.padding -->
    <section class="box-section border">
      <div class="border-header">
        <input id="checkbox-border" type="checkbox">
        <label for="checkbox-border" class="section-label lb-tick">Border</label>
      </div>
      <div class="row" id="border-content">
        <div class="col">
          <div id="border-position" class="border-position">
            <a title="All borders" class="bp-border bp-all" href="#"><span></span></a>
            <a title="Top borders" class="bp-border bp-top" href="#"><span></span></a>
            <a title="Right borders" class="bp-border bp-right" href="#"><span></span></a>
            <a title="Bottom borders" class="bp-border bp-bottom" href="#"><span></span></a>
            <a title="Left borders" class="bp-border bp-left" href="#"><span></span></a>
          </div>
          <!-- /.border-position -->
        </div>
        <div class="col">
          <div id="border-style-wrap" class="border-style-wrap">
            <div class="row">
              <input type="text" name="border-width" class="mdt-border-width input-60">
              <label>px</label>
            </div>
            <div class="row">
              <div class="style-select input-60">
                <select class="mdt-select mdt-border-style" name="border-style">
                  <option value="">none</option>
                  <option value="solid">solid</option>
                  <option value="dashed">dashed</option>
                  <option value="dotted">dotted</option>
                  <option value="double">double</option>
                </select>
              </div>
              <input class="border-color" name="border-color" value="" autocomplete="off"/>
            </div>
          </div>
          <!-- /.border-style-wrap -->
        </div>
        <div class="border-radius">
          <label class="section-label">Border radius</label>
          <div class="row">
            <label class="lb-tl">TL</label>
            <input type="text" name="borderTopLeftRadius" class="mdt-border-radius mdt-br-topleft input-35 mdt-input" value="">
            <label class="lb-tr">TR</label>
            <input type="text" name="borderTopRightRadius" class="mdt-border-radius mdt-br-topright input-35 mdt-input" value="">
          </div>
          <div class="row">
            <label class="lb-bl">BL</label>
            <input type="text" name="borderBottomLeftRadius" class="mdt-border-radius mdt-br-bottomleft input-35 mdt-input" value="">
            <label class="lb-br">BR</label>
            <input type="text" name="borderBottomRightRadius" class="mdt-border-radius mdt-br-bottomright input-35 mdt-input" value="">
          </div>
        </div>
        <!-- /.border-radius -->
      </div>
    </section>
    <!-- /.border -->
    <section class="box-section drop-shadow last">
      <div class="ds-header">
        <input id="checkbox-drop-shadow" type="checkbox">
        <label for="checkbox-drop-shadow" class="section-label lb-tick">Drop shadow</label>
      </div>
      <div id="shadow-content">
        <div class="row">
          <label class="lb-angle">Angle</label>
          <input class="shadow-angle mdt-input" data-fgColor="#A7A7A7" data-bgColor="#131416" data-linecap="round"
                 data-width="65" data-height="65" data-cursor="true" data-thickness=".3" name="shadowAngle" value="13"
                 data-min="0" data-max="360"/>
        </div>
        <div class="row">
          <label class="lb-offset">Offset</label>

          <div id="mdt-shadow-offset" class="mdt-control">
            <input type="hidden" class="shadow-offset  mdt-input" name="shadowOffset" value="" autocomplete="off"/>
          </div>
        </div>
        <div class="row">
          <label class="lb-blur">Blur</label>

          <div id="mdt-shadow-blur" class="mdt-control">
            <input type="hidden" class="shadow-blur mdt-input" name="shadowBlur" value="" autocomplete="off"/>
          </div>
        </div>
        <div class="row">
          <input class="shadow-color mdt-input" name="shadowColor" value="" autocomplete="off"/>
          <label class="lb-color">Color</label>
        </div>
      </div>
    </section>
    <!-- /.drop-shadow -->
  </div>
</div>
<!-- /.adjustments -->
<div class="box-toolbar character box-item box-text">
  <h3>Character
    <i class="show"></i>
    <i class="hide"></i>
  </h3>

  <div class="box-content">
    <div class="row">
      <div class="style-select input-180">
        <select class="mdt-select mdt-font-family" name="fontFamily">
          <optgroup label="System Font">
            <option value="Arial" data-fontweight="400,700,400italic,700italic">Arial</option>
            <option value="Verdana" data-fontweight="400,700,400italic,700italic">Verdana</option>
            <option value='"Trebuchet MS"' data-fontweight="400,700,400italic,700italic">Trebuchet MS</option>
            <option value="Georgia" data-fontweight="400,700,400italic,700italic">Georgia</option>
            <option value='"Times New Roman"' data-fontweight="400,700,400italic,700italic">Times New Roman</option>
            <option value="Tahoma" data-fontweight="400,700,400italic,700italic">Tahoma</option>
          </optgroup>
          <optgroup label="Google Font">
            <?php if (isset($google_fonts) && is_array($google_fonts)): ?>
              <?php foreach ($google_fonts as $font): ?>
                <option value="<?php print $font["css"]; ?>"
                        data-fontweight="<?php print $font["weight"]; ?>"><?php print $font["name"]; ?></option>
              <?php endforeach; ?>
            <?php endif; ?>
          </optgroup>
          <?php if (isset($typekit_fonts) && is_array($typekit_fonts)): ?>
            <optgroup label="TypeKit Font">
              <?php foreach ($typekit_fonts as $font): ?>
                <option value='<?php print $font["css"]; ?>'
                        data-fontweight="<?php print $font["weight"]; ?>"><?php print $font["name"]; ?></option>
              <?php endforeach; ?>
            </optgroup>
          <?php endif; ?>
        </select>
      </div>
    </div>
    <div class="row">
      <div class="style-select input-180">
        <select class="mdt-select mdt-font-weight mdt-input" name="fontWeight">
          <option value="">Semi Bold</option>
        </select>
      </div>
    </div>
    <div class="row clearfix">
      <div class="col">
        <label>Font size (px)</label>
        <input class="mdt-fontsize input-87 mdt-input" name="fontSize" type="text">
      </div>
      <div class="col">
        <label>Line height (px)</label>
        <input class="mdt-lineheight input-87 mdt-input" name="lineHeight" type="text">
      </div>
    </div>
    <div class="row">
      <a class="mdf-button button-style mdt-font-underline" title="Underline" normal="none" active="underline"
         name="textDecoration" href="#"><span></span></a>
      <a class="mdf-button button-style mdt-font-allcaps" title="Caplock" name="textTransform" normal="none"
         active="uppercase" href="#"><span></span></a>
    </div>
    <div class="row">
      <a class="mdf-button button-align mdt-left-alignment" title="Left aligment" value="left"
         href="#"><span></span></a>
      <a class="mdf-button button-align mdt-center-alignment" title="Center alignment" value="center"
         href="#"><span></span></a>
      <a class="mdf-button button-align mdt-right-alignment" title="Right alignment" value="right"
         href="#"><span></span></a>
      <a class="mdf-button button-align mdt-justified-alignment" title="Justified alignment" value="justified" href="#"><span></span></a>
    </div>
  </div>
</div><!-- /.character -->
<div class="box-toolbar object-link box-item box-text box-image">
  <h3>Object Link
    <i class="show"></i>
    <i class="hide"></i>
  </h3>

  <div class="box-content">
    <div class="row">
      <label class="lb-link">Link:</label>
      <input class="mdt-link-value input-140 mdt-input" name="link" type="text">
    </div>
    <label class="lb-linkhover">Link hover</label>

    <div class="row clearfix">
      <div class="col">
        <input class="mdt-link-color mdt-input" name="linkColor" value="" autocomplete="off"/>
        <label class="lb-color">Color</label>
      </div>
      <div class="col">
        <input class="mdt-link-brcolor mdt-input" name="linkBorderColor" value="" autocomplete="off"/>
        <label class="lb-color">Border color</label>
      </div>
    </div>
    <div class="row">
      <input class="mdt-link-bgcolor mdt-input" name="linkBackgroundColor" value="" autocomplete="off"/>
      <label class="lb-color">Background color</label>
    </div>
    <div class="row">
      <label class="lb-color">Link target</label>
      <div class="style-select input-180">
        <select class="mdt-select mdt-link-target mdt-input" name="linkTarget">
          <option value="">Self</option>
          <option value="_blank">Blank</option>
        </select>
      </div>
    </div>
    <div class="row">
      <label class="lb-color">Custom link class</label>
      <input class="mdt-link-custom-class mdt-input" name="linkCustomClass" value="" autocomplete="off" type="text"/>
    </div>
  </div>
</div><!-- /.object-link -->
<div class="box-toolbar custom-classes box-item box-text box-image box-video">
  <h3>Custom Classes
    <i class="show"></i>
    <i class="hide"></i>
  </h3>

  <div class="box-content">
    <input class="mdt-customclass input-180 mdt-input" name="customClass" type="text">
  </div>
</div>
<!-- /.custom-classes -->
<div class="box-toolbar custom-css box-item box-text box-image box-video">
  <h3>Custom CSS
    <i class="show"></i>
    <i class="hide"></i>
  </h3>

  <div class="box-content">
    <textarea class="mdt-customcss input-180 mdt-input" name="customCss"></textarea>
  </div>
</div>
<!-- /.custom-css -->
</div>
</div>
<div class="scrollbar">
  <div class="track">
    <div class="thumb">
      <div class="end"></div>
    </div>
  </div>
</div>
</div>
<!-- /#mdf-toolbar -->
<div class="mdf-timeline" id="mdf-timeline">
  <div class="mdtl-layers">
    <div class="mdtl-head">
      <div class="mdtl-head-left">Timeline</div>
      <div class="mdtl-head-right">
        <div class="mdtl-ruler">
          <?php for ($i = 0; $i <= 20; $i++): ?>
            <div class="number"><span><?php print $i; ?></span></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          <?php endfor; ?>
        </div>
        <!-- /.mdtl-ruler -->
        <div id="slideshow-time">
          <div></div>
        </div>
      </div>
      <!-- /.mdtl-head-right -->
    </div>
    <!-- /.mdtl-head -->
    <div class="timeline-wrap">
      <div class="viewport">
        <div class="overview">
          <div class="timeline-items" id="timeline-items">

          </div>
        </div>
      </div>
      <div class="scrollbar">
        <div class="track">
          <div class="thumb">
            <div class="end"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- /.mdtl-layers -->
</div>
<!-- /.mdf-timeline -->
<div id="dlg-video" style="display:none;" title="Item setting">
  <div class="dlg-inner">
    <form id="form-slider-panelsetting">
      <fieldset class="ui-helper-reset">
        <div class="form-item">
          <label for="video-url">Video URL</label>
          <input type="text" name="video-url" id="video-url" class="form-text" autocomplete="false" value=""/>
          <button class="button button-large" id="video-search">Search</button>
        </div>
        <div class="form-item">
          <label for="video-id">Video Id</label>
          <input type="text" name="videoid" id="video-id" class="form-text" autocomplete="false" value=""/>
        </div>
        <div class="form-item">
          <label for="video-name">Video Name</label>
          <input type="text" name="videoname" id="video-name" class="form-text" autocomplete="false" value=""/>
        </div>
        <div class="form-item">
          <input type="hidden" name="video-thumb-id" id="video-thumb-id" autocomplete="false" value=""/>
          <img src="" id="video-thumb" width="100px" height="100px"/>
        </div>
        <button class="button" id="videothumb-pick">Choose another thumbnail</button>
      </fieldset>
    </form>
  </div>
</div>
<div id="tab-template" style="display: none;">
  <div class="mdf-slidewrap mdf-fullwidth">
    <div class="mdf-slide-image">
      <img
        src="<?php print(base_path() . drupal_get_path("module", "md_fullscreen_slider")); ?>/js/admin/images/default_bg.png"
        alt="">
    </div>
    <div class="mdf-objects" style="width: 1220px; height: 660px;"></div>
  </div>
  <input type="hidden" autocomplete="off"
         value='{"slideId":"-1","bgFid":"-1","bgImage":"<?php print(base_path() . drupal_get_path("module", "md_fullscreen_slider")); ?>/js/admin/images/default_bg.png","bgColor":"","customThumb":false,"thumb":"","thumbFid":"-1" ,"customTransitionTime":false,"transitionTime":"<?php print $slider->settings["transition_time"]; ?>","transitions":[]}'
         class="tab-setting">
</div>
<div id="fullscreen-slider-preview"></div>
<div id="exit-dialog" title="Exit" style="display: none;">
  <p>
    All changes will be lose if you do not save before exit.<br/>
    Are you sure?
  </p>
</div>
</div><!-- /.mdf-wrap -->