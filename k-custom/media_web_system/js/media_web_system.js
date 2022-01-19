var media_base_url = drupalSettings.media_base_url;
var product_group_url = media_base_url+"/kmds/product-group?_format=json";
var imgWidth = imgHeight = '';
var product_type_ids = drupalSettings.product_type_id;
console.log('product_id'+product_type_ids);
(function($, Drupal) {
  var initialized;
  Drupal.behaviors.web_system = {
    attach: function(context, settings) {
      if (!initialized) {
        initialized = true;
        
        var buttons = {} ;             
        buttons['Cancel'] = function() {
          jQuery(this).dialog( "close" );
        }
        buttons['Apply'] = function() {
          jQuery(this).dialog( "close" );
          //jQuery(this).attr('class', 'ck-save');
          var value = CKEDITOR.instances['edit-ckeditor-value'].getData();
          //console.log(value);
          jQuery('.edit-mode').html(value);
          jQuery('.edit-mode').removeClass('edit-mode');
        }
        
        jQuery('#texteditor-dialog').dialog({
          autoOpen: false,
          width: 500,
          modal: true,
          resizable: false,
          buttons: buttons,
          create: function() {
            jQuery(this).closest(".ui-dialog").find(".ui-button:last-child").addClass("btn btn-primary");
            jQuery(this).closest(".ui-dialog").find(".ui-button:last-child").css('padding', '0 .75rem');
            jQuery(this).closest(".ui-dialog").find(".ui-button:first-child").addClass("btn btn-cancel");
            jQuery('.cke_editor_edit-ckeditor-value .cke_bottom').css('display', 'none');
            jQuery('.filter-wrapper').css('display', 'none');  
            jQuery('.ui-dialog-titlebar').addClass('d-none');
          }
        });
        
        //image cropit dialog
        var cropit_buttons = {} ;             
        cropit_buttons['Cancel'] = function() {
          jQuery('#cropit-dialog').html('');
          jQuery(this).dialog( "close" );
        }
        cropit_buttons['Apply'] = function() {          
          jQuery(this).dialog( "close" );          
        }
        
        jQuery('#cropit-dialog').dialog({
          autoOpen: false,
          width: 500,
          modal: true,
          resizable: true,
          buttons: cropit_buttons,
          create: function() {
            jQuery(this).closest(".ui-dialog").find(".ui-button:last-child").addClass("btn btn-primary export");
            jQuery(this).closest(".ui-dialog").find(".ui-button:last-child").css('padding', '0 .75rem');
            jQuery(this).closest(".ui-dialog").find(".ui-button:first-child").addClass("btn btn-cancel"); 
            jQuery('.ui-dialog-titlebar').addClass('d-none');
          }
        });
        
        var ew = new elemAttr('image-width', 'width');
        ew.keyAction();
        var eh = new elemAttr('image-height', 'height');
        eh.keyAction();
        
        // save HTML template data
        jQuery('button#save').click(function(){
          saveHTMLTemplate('edit');
        });
        
        jQuery('span#save_caption').click(function(){
          saveHTMLTemplate('edit');
        }); 
        
        // save HTML template data
        jQuery('span#save_as_caption').click(function(){
          saveHTMLTemplate('add');
        });
      }
    }
  };
  //add css for html article templates.
  jQuery(".rcb-container").parent().css({'width':'600px', 'margin':'auto'});
})(jQuery, Drupal);

function saveHTMLTemplate(action) {
  var template_id = jQuery("input#template_id").val();
  var template_name = jQuery("input#template_name").val();
  var html_template = jQuery("div#web-product-template").html();
  jQuery("div#web-product-template-code-tokens").html(html_template);
  
  var token_object = {};
  jQuery("div#web-product-template-code-tokens .token").each(function(k, v) {
    var token_id = jQuery(this).attr('id');
    var token = '[token:'+token_id+']';
    if(jQuery(this).prop("tagName") == 'IMG'){
      var token_value = jQuery(this).attr('src');
      jQuery(this).attr('src', token);
    }
    else {
      var token_value = jQuery(this).html();
      jQuery(this).html(token);
    }
    
    token_object[token_id] = token_value;
  });
  // then to get the JSON string
  var tokens = JSON.stringify(token_object);
  var html_template_tokens = jQuery("div#web-product-template-code-tokens").html();

  jQuery.ajax({
    type: "POST",
    url: '/kmds/design/web/product/save',
    data: {action: action, template_id: template_id, template_name: template_name, template: html_template_tokens, tokens: tokens},
    dataType: 'json',
    beforeSend: function() {
      loaderModal();
      jQuery('.g-dialog-container').css('color', '#e75e00');
      jQuery('.g-dialog-container').html('<div class="progress-overlay"><div class="fs-26 font-Lato">Saving...</div><br><div class="spinner-border"></div></div>');
    },
    success: function(response){
      jQuery(".g-dialog-container").remove();
      if(action == 'add') {
        window.location.href = '/kmds/design/web/'+response.template_id;
      }
      //console.log(response);
    },
  });
}


/**
 * set Attribute
 */
function elemAttr(id, style){
  this.id = id;
  this.styleattribute = style;
}
elemAttr.prototype.keyAction = function(ev){
  jQuery('#'+this.id).keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    var widthType = jQuery('#image-width-text-style').val();
    var heightType = jQuery('#image-height-text-style').val();
    if(keycode == 13 && this.id == 'image-width'){
      if (!jQuery.isNumeric(jQuery('#image-width').val())) {
        return;
      }
      imgWidth = parseInt(jQuery('#image-width').val());
      console.log('imgWidth 2 - '+imgWidth);
      jQuery('.selected-object img').width(''+imgWidth+widthType+'');
    }
    if(keycode == 13 && this.id == 'image-height'){
      if (!jQuery.isNumeric(jQuery('#image-height').val())) {
        return;
      }
      imgHeight = parseInt(jQuery('#image-height').val());
      console.log('imgHeight 2 - '+imgHeight);
      jQuery('.selected-object img').height(''+imgHeight+heightType+'');
    }
  });
}

//CKEDITOR
function customCkeditor(editor) {
  var block_id = jQuery(editor).attr('id');
  var obj_type = jQuery(editor).attr('data-obj-type');
  jQuery('#'+block_id).addClass('edit-mode');
  var str = jQuery(editor).find('p').html();
  //Enable Disable right Properties panel
  RightPropertiesPanel(obj_type);
  jQuery('#texteditor-dialog').dialog("open");
  CKEDITOR.instances['edit-ckeditor-value'].setData(str); 
  return false;              
}

//CKEDITOR
function openCkeditor(editor) {
  var block_id = jQuery(editor).attr('id');
  var obj_type = jQuery(editor).attr('data-obj-type');
  jQuery('#'+block_id).addClass('edit-mode');
  var str = jQuery(editor).html();
  //Enable Disable right Properties panel
  RightPropertiesPanel(obj_type);
  jQuery('#texteditor-dialog').dialog("open");
  CKEDITOR.instances['edit-ckeditor-value'].setData(str); 
  return false;              
}

function RightPropertiesPanel(obj_type) { 
  if(obj_type == 'text') {    
    jQuery('.settings-tab .properties-panel').hide();
    jQuery('.settings-tab .right-label').removeClass('fa-caret-down');
    jQuery('.settings-tab .right-label').addClass('fa-caret-right');
    
    jQuery('.blocks-tab .properties-panel').hide();    
    jQuery('.blocks-tab .right-label').removeClass('fa-caret-down');
    jQuery('.blocks-tab .right-label').addClass('fa-caret-right');
    
    jQuery('.grids-tab .properties-panel').hide();
    jQuery('.grids-tab .right-label').removeClass('fa-caret-down');
    jQuery('.grids-tab .right-label').addClass('fa-caret-right');
    
    jQuery('.images-tab .properties-panel').hide();
    jQuery('.images-tab .right-label').removeClass('fa-caret-down');
    jQuery('.images-tab .right-label').addClass('fa-caret-right');
    
    jQuery('.fonts-tab .properties-panel').show();
    jQuery('.fonts-tab .right-label').removeClass('fa-caret-right');
    jQuery('.fonts-tab .right-label').addClass('fa-caret-down');
    
  } else if(obj_type == 'image') {
    jQuery('.settings-tab .properties-panel').hide();
    jQuery('.settings-tab .right-label').removeClass('fa-caret-down');
    jQuery('.settings-tab .right-label').addClass('fa-caret-right');
    
    jQuery('.fonts-tab .properties-panel').hide();
    jQuery('.fonts-tab .right-label').removeClass('fa-caret-down');
    jQuery('.fonts-tab .right-label').addClass('fa-caret-right');
    
    jQuery('.blocks-tab .properties-panel').hide();    
    jQuery('.blocks-tab .right-label').removeClass('fa-caret-down');
    jQuery('.blocks-tab .right-label').addClass('fa-caret-right');
    
    jQuery('.grids-tab .properties-panel').hide();
    jQuery('.grids-tab .right-label').removeClass('fa-caret-down');
    jQuery('.grids-tab .right-label').addClass('fa-caret-right');
    
    jQuery('.images-tab .properties-panel').show();
    jQuery('.images-tab .right-label').removeClass('fa-caret-right');
    jQuery('.images-tab .right-label').addClass('fa-caret-down');
    
  } else if(obj_type == 'shape') {
    jQuery('.settings-tab .properties-panel').hide();
    jQuery('.settings-tab .right-label').removeClass('fa-caret-down');
    jQuery('.settings-tab .right-label').addClass('fa-caret-right');
    
    jQuery('.fonts-tab .properties-panel').hide();
    jQuery('.fonts-tab .right-label').removeClass('fa-caret-down');
    jQuery('.fonts-tab .right-label').addClass('fa-caret-right');
    
    jQuery('.images-tab .properties-panel').hide();
    jQuery('.images-tab .right-label').removeClass('fa-caret-down');
    jQuery('.images-tab .right-label').addClass('fa-caret-right');
    
    jQuery('.grids-tab .properties-panel').hide();
    jQuery('.grids-tab .right-label').removeClass('fa-caret-down');
    jQuery('.grids-tab .right-label').addClass('fa-caret-right');
    
    jQuery('.blocks-tab .properties-panel').show();    
    jQuery('.blocks-tab .right-label').removeClass('fa-caret-right');
    jQuery('.blocks-tab .right-label').addClass('fa-caret-down');
  }
}

/**
 * return Modal Body elements
 */
function tooltipfn() {
  jQuery('[data-toggle="tooltip"]').tooltip({placement : 'bottom'});
  if(jQuery("[role=log].ui-helper-hidden-accessible").length){
    jQuery("[role=log].ui-helper-hidden-accessible").remove();
  }	
}

//right sidebar properties
jQuery('#right-sidebar .text-properties-panel .alignments button').each(function() {
  jQuery(this).on('click touch', function(e){
    //e.preventDefault();
    //e.stopPropagation();
    if(jQuery(this).hasClass('align')){
      jQuery('#right-sidebar .text-properties-panel .alignments button.align').removeClass('g-active');
    }else if(jQuery(this).hasClass('valign')){
      jQuery('#right-sidebar .text-properties-panel .alignments button.valign').removeClass('g-active');  
    }
    jQuery(this).toggleClass('g-active');
  })
});

jQuery('#right-sidebar .text-properties-panel button.sizing-width').each(function(){
  jQuery(this).on('click touch', function(e){
    //e.preventDefault();
    //e.stopPropagation();
    jQuery('#right-sidebar .text-properties-panel button.sizing-width').removeClass('g-active');
    jQuery(this).toggleClass('g-active');
  })
});
jQuery('#right-sidebar .text-properties-panel button.sizing-height').each(function(){
  jQuery(this).on('click touch', function(e){
    //e.preventDefault();
  //	e.stopPropagation();
    jQuery('#right-sidebar .text-properties-panel button.sizing-height').removeClass('g-active');
    jQuery(this).toggleClass('g-active');
  })
});
jQuery('#right-sidebar .text-properties-panel .decoration button').each(function(){
  jQuery(this).on('click touch', function(e){
    jQuery(this).toggleClass('g-active');
    //FnFontStyle();				
  })
});

//show hide right sidebar panel
jQuery('.toolbar-title').click(function(){
  jQuery(this).next('.toolbar-body').toggle();
  if(jQuery(this).next('.toolbar-body').css('display') == 'none') {
    jQuery(this).find('.right-label').removeClass('fa-caret-down');
    jQuery(this).find('.right-label').addClass('fa-caret-right');
  }
  else {
    jQuery(this).find('.right-label').addClass('fa-caret-down');
    jQuery(this).find('.right-label').removeClass('fa-caret-right');
  }
});

var $cr = jQuery('#dynamic-image-corner-range');
// Initialize
$cr.rangeslider({
  polyfill: false,
  onSlide: function(position, value) {
    jQuery('#corner-input').val(value);
    //jQuery('#image-opacity-range').val(value);
  },
  onSlideEnd: function(position, value) {
    // Update the rating value once the slide is done
    jQuery('#corner-input').val(value);
    //jQuery('#image-opacity-range').val(value);
  }
});

var $or = jQuery('#dynamic-image-opacity-range');
// Initialize
$or.rangeslider({
  polyfill: false,
  onSlide: function(position, value) {
    //jQuery('#corner-input').val(value);
    jQuery('#image-opacity-range').val(value);
  },
  onSlideEnd: function(position, value) {
    // Update the rating value once the slide is done
   // jQuery('#corner-input').val(value);
    jQuery('#image-opacity-range').val(value);
  }
});

//selected - object
jQuery('#left-container').on('click','.open-ckeditor',function(e){
  jQuery('#left-container .open-ckeditor').removeClass('selected-object');    
  jQuery(this).addClass('selected-object');
  var obj_type = jQuery(this).attr('data-obj-type');
  var block_id = jQuery(this).attr('id');
  RightPropertiesPanel(obj_type);
  if(obj_type == 'image'){
    if(jQuery('div#web-product-template img.selected-object').length){
      imgWidth = parseInt(jQuery('img.selected-object').width());
      imgHeight = parseInt(jQuery('img.selected-object').height());
    }
    else {
      imgWidth = parseInt(jQuery('.selected-object img').width());
      imgHeight = parseInt(jQuery('.selected-object img').height());
    }
    jQuery('#image-width').val(imgWidth);
    jQuery('#image-height').val(imgHeight);
    var imgRenderWidth = imgWidth;
    var imgRenderHeight = imgHeight;
    if(block_id !== 'logo'){
      if(imgRenderWidth == imgRenderHeight){
        imgRenderWidth = 1080;
        imgRenderHeight = 1080;
      }
      else if(imgRenderWidth > imgRenderHeight){
        var scale = 1920 / imgRenderWidth;
        imgRenderWidth = imgRenderWidth*scale;
        imgRenderHeight = imgRenderHeight*scale;
      }
      else if(imgRenderWidth < imgRenderHeight){
        var scale = 1080 / imgRenderHeight;
        imgRenderWidth = imgRenderWidth*scale;
        imgRenderHeight = imgRenderHeight*scale;
      }
    }
    jQuery('#image-render-width').val(imgRenderWidth);
    jQuery('#image-render-height').val(imgRenderHeight);
    jQuery('.selected-object').attr("render-width", imgRenderWidth);
    jQuery('.selected-object').attr("render-height", imgRenderHeight);
  }
});

jQuery("#image-width").on('focusout', function(){
  var w = jQuery('#image-width').val();
  var widthType = jQuery('#image-width-text-style').val();
  imgWidth = parseInt(w);
  jQuery('.selected-object img').width(''+imgWidth+widthType+'');
});
	
jQuery("#image-height").on('focusout', function(){
  var h = jQuery('#image-height').val();
  var heightType = jQuery('#image-height-text-style').val();
  imgHeight = parseInt(h);
  console.log('imgHeight - '+imgHeight);
  jQuery('.selected-object img').height(''+imgHeight+heightType+'');
});
  
jQuery("#image-width-text-style").on('change', function(){
  var widthType = jQuery(this).val();   
  var w = jQuery('#image-width').val();
  imgWidth = parseInt(w);
  if(widthType == '%'){
    jQuery('#image-height').attr('disabled','disabled');
    jQuery('#image-height-text-style').attr('disabled','disabled');
  }else{
    jQuery('#image-height').removeAttr('disabled','disabled');
    jQuery('#image-height-text-style').removeAttr('disabled','disabled');
  }
  jQuery('.selected-object img').width(''+imgWidth+widthType+'');
});

jQuery("#image-height-text-style").on('change', function(){
  var heightType = jQuery(this).val();   
  var h = jQuery('#image-height').val();  
  imgHeight = parseInt(h);  
  if(heightType == '%'){
    jQuery('#image-width').attr('disabled','disabled');
    jQuery('#image-width-text-style').attr('disabled','disabled');
  }else{
    jQuery('#image-width').removeAttr('disabled','disabled');
    jQuery('#image-width-text-style').removeAttr('disabled','disabled'); 
  }
  jQuery('.selected-object img').height(''+imgHeight+heightType+'');
});

jQuery("#dynamic-image-opacity-range").on('change', function(){
  var opacity = jQuery(this).val();
  opacity = opacity/100;    
  jQuery('.selected-object img').css("opacity", opacity);
});
  
jQuery("#dynamic-image-corner-range").on('change', function(){
  var corner = jQuery(this).val();   
  jQuery('.selected-object img').css("border-radius", corner+'%');
});
  
//keypress
jQuery('.corner-opacity-input').on('keyup', function(e){
  var inputval = jQuery(this).val();
  var inputid = jQuery(this).attr('id');
  console.log(inputval);
  console.log(inputid);
  console.log(e.keyCode);
  if(inputval != ''){
    if(inputval >= 0 && inputval <= 100){
      jQuery(this).removeClass('border-danger');
      jQuery(this).removeClass('text-danger');
      if(inputid == 'corner-input'){
        jQuery('.selected-object img').css("border-radius", inputval+'%');
        jQuery('#dynamic-image-corner-range').val(inputval).rangeslider('update', true);
      }else{
        var ninputval = inputval/100;
        jQuery('.selected-object img').css("opacity", ninputval);
        jQuery('#dynamic-image-opacity-range').val(inputval).rangeslider('update', true);
      }
    }else{
      jQuery(this).addClass('border-danger');
      jQuery(this).addClass('text-danger');
    }
  }
});

// font size dropdown callback function
function textSizeList(object) {
  console.log(object);
  //document.getElementById("myDropdown").classList.toggle("textsizeshow");
  jQuery(object).siblings("#myDropdown").toggle("textsizeshow");
}

//set font size in text box if click on font size dropdown
jQuery(document).on('click', '.option-item', function() {
  var fsize = jQuery(this).attr('datavalue');
  jQuery('#text-font-size').val(fsize);
  jQuery('#text-font-size').trigger("change");
  var nfsize = parseInt(fsize);
  jQuery('#left-container div.selected-object').css('font-size',nfsize);
});

jQuery(document).on('change','.fontsizeinput',function () {
  var fsize = jQuery(this).val();
  var nfsize = parseInt(fsize);
  jQuery('#left-container div.selected-object').css('font-size',nfsize);
});

jQuery(document).on('change','.font-family',function () {
  var family = jQuery(this).val();
  jQuery('#left-container div.selected-object').css('font-family',family);
});

//set text alignment in text box if click on alignment buttons
jQuery(document).on('click', '.align', function() {
  jQuery('.align.g-active').removeClass('g-active');
  jQuery(this).addClass('g-active');
  var align = jQuery(this).val();
  jQuery('#left-container div.selected-object').css('text-align', align);
});

function textFontStyle(object) {
  var fstyle = object.options[object.selectedIndex].value;
  jQuery('#left-container div.selected-object').css('font-weight', fstyle);
}

var colors = jQuery('input.jsscolor').colorPicker({
  customBG: '#222',
  readOnly: true,
  //delayOffset: 8, // pixels offset when shifting mouse up/down inside input fields before it starts acting as slider
  CSSPrefix: 'cp-', // the standard prefix for (almost) all class declarations (HTML, CSS)
  size: 3, // one of the 4 sizes: 0 = XXS, 1 = XS, 2 = S, 3 = L (large); resize to see what happens...
  allMixDetails: true, // see Colors...
  noAlpha: true, // disable alpha input (all sliders are gone and current alpha therefore locked)
  init: function(elm, colors) {
  },
  margin: {left: -450, top: -200},
  actionCallback: function(elm, action) { // callback on any action within colorPicker (buttons, sliders, ...)
    var bg = jQuery('input.jsscolor').css('background-color');
    jQuery('.selected-object').css('color', bg);
    if (action == 'saveAsBackground' || action == 'resetColor') {
      jQuery('.cp-app').hide('fast');
      jQuery("#colorSelector").blur();
    }
  },
});

jQuery(".media-kit-image-list").click(function(){
  if(jQuery('body div.left-panel .media-kit-images').hasClass("empty")){
    jQuery('body div.left-panel .media-kit-images').removeClass("empty");
    var uid = 1;//drupalSettings.uid;	
    var media_kit_url = media_base_url+'/user/media_kits/'+ uid +'?_format=json';
    var $elem = jQuery('body div.left-panel .media-kit-images');
    jQuery.getJSON( media_kit_url, function( result ) {
      jQuery.each(result, function(key, val) {
        $elem.append(
         jQuery("<div/>", {"class": "wp-media-kit-image empty", "id": "mediakit-"+val.nid, "data-value": val.nid}).append(
            jQuery("<span/>", {"class": "media-kit-image-title", text: val.title}),
            jQuery("<span/>", {"class": "fas fa-caret-right image-list-caret"}),
          )
        );
        console.log('mdt');
        jQuery(".media-kit-images .progress-overlay").remove();
      });
    });
  }
  else {
    jQuery('.media-kit-images .wp-media-kit-image').removeClass("active");
    jQuery('.media-kit-images .image-list-caret').removeClass("fa-caret-down").addClass("fa-caret-right");
    jQuery('.media-kit-images .mediakit-images').removeClass("d-block").addClass("d-none");
  }
});

jQuery(document).on('click','.wp-media-kit-image',function (e) {
  jQuery('#webregionblock1').click();
  if(jQuery(e.target).hasClass('media-kit-image-title') || jQuery(e.target).hasClass('image-list-caret')){
    jQuery(".media-kit-images .progress-overlay").remove();
    var $this = jQuery(this);
    if($this.hasClass("active")){
      $this.removeClass("active");
      $this.find('.image-list-caret').removeClass("fa-caret-down").addClass("fa-caret-right");
      $this.find('.mediakit-images').removeClass("d-block").addClass("d-none");
    }
    else {
      jQuery(".wp-media-kit-image").removeClass("active");
      $this.addClass("active");
      jQuery(".wp-media-kit-image").find('.image-list-caret').removeClass("fa-caret-down").addClass("fa-caret-right");
      $this.find('.image-list-caret').removeClass("fa-caret-right").addClass("fa-caret-down");
      jQuery('body div.left-panel .mediakit-images').removeClass("d-block").addClass("d-none");
      if($this.hasClass("empty")){
        var nid = $this.attr("data-value");
        $this.removeClass("empty");
        $this.append(
          jQuery("<div/>", {"class": "mediakit-images d-block clicked", "id": "mk-photo-gallery-"+nid}).append(
            jQuery("<div/>", {"class": "progress-overlay"}).append(
              jQuery("<div/>", {"class": "spinner-border"})
            )
          )
        );
        var $elem = $this.find('.mediakit-images');
        var kit_class = jQuery(".wp-media-kit-image.active").find(".media-kit-image-title").text();
        kit_class = kit_class.toLowerCase().replace(/ /g,"-");
        var media_kit_url = media_base_url+'/node/'+ nid +'?_format=json';
        jQuery.getJSON( media_kit_url, function( result ) {
        if(product_type_ids != 199){
          jQuery.each(result.field_vault_photo, function(key, val) {
            var target_id = val.target_id;
            var media_image_url = media_base_url+'/media/'+target_id+'/edit?_format=json';
            jQuery.getJSON( media_image_url, function( image_url ) {
              var image_name = image_url.name[0].value;
              image_name = image_name.replace("/var/tmp/", "");
              //var index = image_name.lastIndexOf("/") + 1;
              //var filename = image_name.substr(index);
              //var ext = image_name.substring(image_name.lastIndexOf('.'));
              //image_name = image_name.split(ext)[0];
              $elem.append(
                  jQuery("<div/>", {"class": "media-data d-flex "+kit_class, "image-title": image_name, "data-src": image_url.field_media_image[0].original_url, "onmouseover": "tooltipfn(this)", "data-toggle": "tooltip", "data-title": image_name, "data-fid": target_id}).append(
                    jQuery("<div>", {"class": "kit-image"}).append(
                      jQuery("<img/>", {"src": image_url.field_media_image[0].image_import_url}),
                      jQuery("<div/>", {"class": "overlay"}).append(
                        jQuery("<button/>", {"class": "preview-icon", "data-value-nid": nid, "image-url": image_url.field_media_image[0].original_url})
                      )
                    ),
                    jQuery("<div/>", {"class": "kit-name", text: image_name})
                  )
              );
              sortMediaKitImagesList(kit_class);
            });
          });
       }
       else{
           jQuery.each(result.field_vault_audio, function(key, val) {
            var target_id = val.target_id;
            var media_image_url = media_base_url+'/media/'+target_id+'/edit?_format=json';
            jQuery.getJSON( media_image_url, function( image_url ) {
              var image_name = image_url.name[0].value;
              image_name = image_name.replace("/var/tmp/", "");
              var img_url= '';
              if(image_url.field_audio_image.length == 1){
               img_url = image_url.field_audio_image[0].original_url;
              }
              else{
                img_url = "/modules/custom/km_product/images/default-playlist-image.png";
              } 
             /* if(typeof(image_url.field_audio_image[0].original_url) != "undefined" && image_url.field_audio_image[0].original_url !== null){
                
              }
              */
              //var index = image_name.lastIndexOf("/") + 1;
              //var filename = image_name.substr(index);
              //var ext = image_name.substring(image_name.lastIndexOf('.'));
              //image_name = image_name.split(ext)[0];
              $elem.append(
                  jQuery("<div/>", {"class": "media-data d-flex "+kit_class, "image-title": image_name, "data-src": img_url, "onmouseover": "tooltipfn(this)", "data-toggle": "tooltip", "data-title": image_name, "data-fid": target_id}).append(
                    jQuery("<div>", {"class": "kit-image"}).append(
                      jQuery("<img/>", {"src": img_url,"class": "au-image"}),
                      jQuery("<div/>", {"class": "overlay"}).append(
                        jQuery("<button/>", {"class": "preview-icon", "data-value-nid": nid, "image-url": img_url})
                      )
                    ),
                    jQuery("<div/>", {"class": "kit-name", text: image_name})
                  )
              );
              sortMediaKitImagesList(kit_class);
            });
          });
       }
        }).done(function() { 
          jQuery(".media-kit-images .progress-overlay").remove();
        });
      }
      else {
        $this.find('.mediakit-images').removeClass("d-none");
        $this.find('.mediakit-images').addClass("d-block");
      }
    }
  }
});

/**
 * Callback function sortMediaKitImagesList()
 * to sort the media kit image list in assets tab
 * at toolx page
 **/
function sortMediaKitImagesList(kit_class){
  var list, i, switching, b, shouldSwitch;
  list = document.getElementById("left-sidebar");
  switching = true;
  while (switching) {
    switching = false;
    b = list.getElementsByClassName(kit_class);
    for (i = 0; i < (b.length - 1); i++) {
      shouldSwitch = false;
      if (b[i].getAttribute("image-title").toLowerCase() > b[i + 1].getAttribute("image-title").toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;       
    }
  }
}

//Image cropper modal
function imageCropitTool(content) {  
  jQuery('#cropit-dialog').append(content);         
  jQuery('#cropit-dialog').dialog("open");         
}


jQuery('#left-sidebar .sidebar-option').each(function(e){
  jQuery(this).on('click', function(){
    jQuery('#left-sidebar .sidebar-option.active').each(function(e){
      jQuery(this).removeClass('active')
    })
    jQuery(this).addClass('active')
    if(jQuery(this).hasClass('sidebar-layers')){
      jQuery('.sidebar-container.sidebar-layers').css('display', 'flex')
      jQuery('.sidebar-container.sidebar-library').css('display', 'none')
      jQuery('.sidebar-container.sidebar-symbols').css('display', 'none')
    }if(jQuery(this).hasClass('sidebar-library')){
      jQuery('.sidebar-container.sidebar-library').css('display', 'flex')
      jQuery('.sidebar-container.sidebar-layers').css('display', 'none')
      jQuery('.sidebar-container.sidebar-symbols').css('display', 'none')
    }if(jQuery(this).hasClass('sidebar-symbols')){
      jQuery('.sidebar-container.sidebar-symbols').css('display', 'flex')
      jQuery('.sidebar-container.sidebar-library').css('display', 'none')
      jQuery('.sidebar-container.sidebar-layers').css('display', 'none')
    }
  })
});


//Close Image Modal Window
jQuery(document).on('click','.close-modal',function (e) {
  if(jQuery(this).hasClass('user-redirect')){
    if(redirect_href_url != ''){
      window.location.href = redirect_href_url;
    }
    jQuery(".g-dialog-container").remove();
  }
  else if(jQuery(this).hasClass('delete-object')){
    //deleteSelectedObject();
    jQuery(".g-dialog-container").remove();
  }
  else if(jQuery(this).hasClass('apply-image-crop')){
    var imgsrc = jQuery('.km-image-editor').cropit('export', {
                      type: 'image/jpeg',
                      quality: 1.0,
                      originalSize: true
                    });
    var obj = jQuery('#left-container .selected-object img');
    if(obj){
      if(obj.attr('src')){
        obj.attr('src',imgsrc);
      }
      jQuery(".g-dialog-container").remove();
    }     
  }
  else{
    jQuery(".g-dialog-container").remove();
  }
});

jQuery('.km-image-crop-modal').on('change','#image-width', function(e){
  var width = jQuery(this).val();
});

jQuery('.kowledge-base-ico').click(function(e) {
	var msg = jQuery(this).attr('aria-label');
  var title = jQuery(this).attr('aria-title');
  var nid = jQuery(this).attr('aria-nid');
   
	jQuery('#knowledge-base-modal').dialog({
    autoOpen: true,
    width: 500,
    //height: 200,
    modal: true,
    dialogClass: 'knowledge-base-modals',
    resizable: false,
    buttons: {
      Cancel: function() {
        jQuery( this ).dialog( "close" );				
      },
      'READ MORE': function() {
        window.location = nid;
      },
    },
    open: function( event, ui ) {
      jQuery('#knowledge-base-modal').dialog('option', 'title', title);
      jQuery("#knowledge-base-modal").html(msg);                       
    }   
  });
});

function loaderModal(){
  jQuery('<div/>', {"class": "g-dialog-container d-flex justify-content-center align-items-center visible"})
    .append(jQuery('<div/>', {"class": "g-dialog"})
    .append(jQuery('<div/>', {'class': "g-dialog-header p-27 d-none", 'html': ''}))
    .append(jQuery('<div/>', {"class": "g-dialog-content"}))
  ).appendTo('body');
}

function tooltipfn(){
  jQuery('[data-toggle="tooltip"]').tooltip({
    placement : 'bottom',
    trigger : 'hover'
  });
}
/**
 * Callback function toggleNavHeader()
 * to hide to top menu at kmds page
 **/
function toggleNavHeader(e){
	jQuery('#navbar-top').toggle(1000);
	jQuery(e).toggleClass('fa-rotate-180');
	if(jQuery(e).hasClass('fa-rotate-180')){
		jQuery('ul.g-menu.g-menu-bottom.fixed').css('top', '165px');
		jQuery('#sidebar-container').css('height', 'calc(100vh - 190px)');
	}
  else {
		jQuery('ul.g-menu.g-menu-bottom.fixed').css('top', '89px');
		jQuery('#sidebar-container').css('height', 'calc(100vh - 115px)');
	}
}
