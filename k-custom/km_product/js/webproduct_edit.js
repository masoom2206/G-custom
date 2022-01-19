var media_base_url = drupalSettings.media_base_url;
jQuery( document ).ready(function() {
  window.onload = function() {
    //load all fonts
    wpFontsLoad();
  }
  
  // sortable
  jQuery("div#wp-template-box").sortable();
  

  // Your Button Label 
  var dbuttons = [
    {
      text: "Cancel",
      "class": 'btn btn-cancel font-fjalla',
      click: function() {
        jQuery(this).dialog( "close" );
      }
    },
    {
      text: "Apply",
      "class": 'btn btn-primary font-fjalla',
      click: function() {
        // button text
        var btntxt = jQuery('input#btn-txt').val();
        jQuery('button#your-button-label a').html(btntxt);
        // button link
        var url = jQuery('input#url').val();
        jQuery('button#your-button-label a').attr('href', url);
        // button border
        var bg = jQuery('input#btn-color-border').css('background-color'); 
        var bw = jQuery('input#btn-border-stroke-num').val();
        jQuery('button#your-button-label').css('border', bw+'px solid '+bg);

        /*
        var font = jQuery('select#btn-font-family').val();
        jQuery('button#your-button-label').css('font-family', font);
        var fsize = jQuery('input#btn-text-font-size').val();
        jQuery('button#your-button-label').css('font-size', fsize+'px');
        var fstyle = jQuery('select#btn-fstyle').val().split('#');
        var fw = fstyle[0];
        var fs = fstyle[1];
        jQuery('button#your-button-label').css('font-weight', fw);
        if(fs == 'I'){
          jQuery('button#your-button-label').css('font-style', 'italic');
        }else{
          jQuery('button#your-button-label').css('font-style', '');
        }
        */
        
        jQuery(this).dialog( "close" );
      }
    }
  ];
  
  jQuery('#button-dialog').dialog({
    dialogClass: 'btn-editor',
    autoOpen: false,
    width: 500,
    modal: true,
    resizable: false,
    buttons: dbuttons,
    create: function() {
      //console.log('create');
      if(jQuery('button#your-button-label').length == 1) {
        var btntxt = jQuery('button#your-button-label a').html();
        var url = jQuery('button#your-button-label a').attr('href');
        var font = jQuery('button#your-button-label').css('font-family');
        var fstyle = jQuery('button#your-button-label').css('font-weight');
        var fsize = jQuery('button#your-button-label').css('font-size');
        
        var bgcolor = jQuery('button#your-button-label').css('background-color');
        jQuery('input#btn-color-fill').val(bgcolor);
        jQuery('input#btn-color-fill').css('background-color', bgcolor);
        
        var color = jQuery('button#your-button-label a').css('color');
        jQuery('input#btn-color-txt').val(color);
        jQuery('input#btn-color-txt').css('background-color', color);
        
        //var bcolor = jQuery('button#your-button-label').css('border-color');
        var bcolor = document.getElementById('your-button-label').style.borderColor;
        jQuery('input#btn-color-border').val(bcolor);
        jQuery('input#btn-color-border').css('background-color', bcolor);
        
        //var bwidth = jQuery('button#your-button-label').css('border-width').replace('px', '');
        var bwidth = document.getElementById('your-button-label').style.borderWidth.replace('px', '');
        if(parseInt(bwidth) > 0){
          jQuery('input#btn-border-stroke-num').val(bwidth);
        }else{
          jQuery('input#btn-border-stroke-num').val('');
        }
        
        jQuery('input#btn-txt').val(btntxt);
        if(url != '#'){
          jQuery('input#url').val(url); 
        }
        //jQuery('select#btn-font-family').val(font);
        //jQuery('select#btn-fstyle').val(fstyle);
        //jQuery('input#btn-text-font-size').val(fsize);
      }
    },
    open: function() {
      jQuery('div.btn-editor div.ui-dialog-titlebar').removeClass('d-none');
      jQuery('div.btn-editor div.ui-dialog-buttonset button').removeClass('ui-button ui-corner-all ui-widget button');
      jQuery('div.cp-app').addClass('d-none');
    }
  });

  
  // CKE editor  
  var buttons = [
    {
      text: "Cancel",
      "class": 'btn btn-cancel font-fjalla',
      click: function() {
        jQuery('.edit-mode').removeClass('edit-mode');
        jQuery(this).dialog( "close" );
      }
    },
    {
      text: "Apply",
      "class": 'btn btn-primary font-fjalla',
      click: function() {
        var value = CKEDITOR.instances['edit-ckeditor-value'].getData();
        var eid = jQuery('.edit-mode').attr('id');
        jQuery('.edit-mode').html(value);        
        if(eid == 'headline'){
          jQuery('.edit-mode p').contents().unwrap();
        }else if(eid == 'client-name'){
          jQuery('.edit-mode p').contents().unwrap();
        }else if(eid == 'mk-name'){
          jQuery('.edit-mode p').contents().unwrap();
        } else if(jQuery('.edit-mode').hasClass('rcb-caption-std')){
          jQuery('.edit-mode p').contents().unwrap();
        }
        jQuery('.edit-mode').removeClass('edit-mode');
        jQuery(this).dialog( "close" );
      }
    }
  ];
  
     
  /*var buttons = {} ;             
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
  }*/
    
  // CKEDITOR dialog box 
  jQuery('#texteditor-dialog').dialog({
    dialogClass: 'text-editor',
    autoOpen: false,
    width: 500,
    modal: true,
    resizable: false,
    buttons: buttons,
    create: function() {
      jQuery('div.text-editor div.ui-dialog-buttonset button').removeClass('ui-button ui-corner-all ui-widget button');
      jQuery('.cke_editor_edit-ckeditor-value .cke_bottom').css('display', 'none');
      jQuery('div#edit-ckeditor-format').css('display', 'none');
      jQuery('div.ui-dialog-titlebar').addClass('d-none');
    }
  });
  
  // element text color    
  jQuery('body').on('click','input.wpjscolor', function(e){
    jQuery('div.cp-app').removeClass('d-none');
    jQuery('div.cp-app').show();
    var colorid = jQuery(this).attr('id');
    jQuery('input#color-picker').val(colorid);
  });
  
  // render color picker
  // https://github.com/PitPik/colorPicker
  jQuery('input.wpjscolor').colorPicker({
    color: '#000000', // initial color (#RGB, RGB, #RRGGBB, RRGGBB, rgb(r, g, b), ...)
    customBG: '#000000',
    readOnly: true,
    //delayOffset: 8, // pixels offset when shifting mouse up/down inside input fields before it starts acting as slider
    CSSPrefix: 'cp-', // the standard prefix for (almost) all class declarations (HTML, CSS)
    size: 3, // one of the 4 sizes: 0 = XXS, 1 = XS, 2 = S, 3 = L (large); resize to see what happens...
    allMixDetails: true, // see Colors...
    noAlpha: true, // disable alpha input (all sliders are gone and current alpha therefore locked)
    init: function(elm, colors) {
      
    },
    margin: {left: 0, top: 0},
    actionCallback: function(elm, action) { // callback on any action within colorPicker (buttons, sliders, ...)
      var color_fldid = jQuery('input#color-picker').val();
      var bg = jQuery('input#'+color_fldid).css('background-color');
      jQuery('input#'+color_fldid).val(bg);
      
      switch(color_fldid) {
        // text color
        case 'kmds-color-fill':
          jQuery('.selected-element').css('color', bg);
          jQuery('.selected-element p').css('color', bg);
        break;
        // background color
        case 'kmds-shape-fill':
          jQuery('.selected-shape').css('background-color', bg);
          if(jQuery(".rcb-container").length) {
            jQuery('.selected-article-shape').css('background-color', bg);
          }
        break;
        // border color
        case 'kmds-shape-border':
          var bs = jQuery('input#shape-border-stroke-num').val();
          jQuery('.selected-shape').css('border', bs+'px solid '+bg);
          if(jQuery(".rcb-container").length) {
            jQuery('.selected-article-shape').css('border', bs+'px solid '+bg);
          }
        break;
        
        // button text color
        case 'btn-color-txt':
          jQuery('button#your-button-label a').css('color', bg);
        break;
        // button background color
        case 'btn-color-fill':
          jQuery('button#your-button-label').css('background-color', bg);
        break;
        // button border color
        case 'btn-color-border':
          var bs = jQuery('input#btn-border-stroke-num').val();
          jQuery('button#your-button-label').css('border', bs+'px solid '+bg);
        break;
        
        default:
          jQuery('.selected-element').css('color', bg);
          jQuery('.selected-element p').css('color', bg);
      }
      
      //console.log(action);
      if(action == 'saveAsBackground' || action == 'resetColor') {
        jQuery('div.cp-app').hide('fast');
        //jQuery("#colorSelector").blur();
      }
    },
  });

  //alignment - left
  jQuery('div.kaboodles-container').on('click touch','button#align-left', function(e){
    jQuery('.selected-element').css('text-align', 'left');    
  });
  //alignment - center
  jQuery('div.kaboodles-container').on('click touch','button#align-center', function(e){
    jQuery('.selected-element').css('text-align', 'center');    
  });
  //alignment - right
  jQuery('div.kaboodles-container').on('click touch','button#align-right', function(e){
    jQuery('.selected-element').css('text-align', 'right');    
  });
  //alignment - justify
  jQuery('div.kaboodles-container').on('click touch','button#align-justify', function(e){
    jQuery('.selected-element').css('text-align', 'justify');    
  });
  
  //set font size in text box if click on font size dropdown
  jQuery('div.tools-header').on('click touch', 'div.option-item', function() {
    var fsize = jQuery(this).attr('datavalue');
    jQuery('input#txt-font-size').val(fsize);
    jQuery('input#txt-font-size').trigger("change");
  });
  
  //set font size in text box if click on font size dropdown
  jQuery('div#button-dialog').on('click touch', 'div#btn-size-dropdown div.option-item', function() {
    var fsize = jQuery(this).attr('datavalue');
    //jQuery('input#btn-text-font-size').val(fsize);
    //jQuery('input#btn-text-font-size').trigger("change");
  });
  
  //set font size on selected element
  jQuery('div.tools-header').on('change', 'input#txt-font-size', function() {
    var fsize = jQuery(this).val();
    jQuery('.selected-element').css('font-size', fsize+'px');
    jQuery('.selected-element p').css('font-size', fsize+'px');
  });
  
  //set font weight on selected element
  jQuery('div.tools-header').on('change', 'select#txt-font-style', function() {
    var fstyle = jQuery(this).val().split('#');
    var fw = fstyle[0];
    var fs = fstyle[1];
    jQuery('.selected-element').css('font-weight', fw);
    jQuery('.selected-element p').css('font-weight', fw);
    if(fs == 'I'){
      jQuery('.selected-element').css('font-style', 'italic');
      jQuery('.selected-element p').css('font-style', 'italic');
    }else{
      jQuery('.selected-element').css('font-style', '');
      jQuery('.selected-element p').css('font-style', '');
    }
  });
  
  //set font size on selected element
  jQuery('div.tools-header').on('change', 'select#txt-font-family', function() {
    var ffamily = jQuery(this).val();
    /*
    if(jQuery('.open-ckeditor').has('p')){
      jQuery('.selected-element p').css('font-family', ffamily);
    }else{
      jQuery('.selected-element').css('font-family', ffamily);
    }
    */
    jQuery('.selected-element').css('font-family', ffamily);
    jQuery('.selected-element p').css('font-family', ffamily);
  });

  //set border width
  jQuery('div.tools-header').on('keyup', 'input#shape-border-stroke-num',function(e){
    var bwidth = jQuery(this).val();
    if(parseInt(bwidth) > 0){
      jQuery('div#web-product-template div.selected-shape').css('border-width', bwidth+'px');
      if(jQuery(".rcb-container").length) {
        jQuery('.selected-article-shape').css('border-width', bwidth+'px');
      }
    }else{
      jQuery('div#web-product-template div.selected-shape').css('border', '');
      if(jQuery(".rcb-container").length) {
        jQuery('.selected-article-shape').css('border', '');
      }
    }
  });

  //set button border width
  jQuery('body').on('keyup', 'input#btn-border-stroke-num',function(e){
    var bwidth = jQuery(this).val();
    if(parseInt(bwidth) > 0){
      jQuery('button#your-button-label').css('border-width', bwidth+'px');
    }else{
      jQuery('div#web-product-template div.selected-shape').css('border', '');
      if(jQuery(".rcb-container").length) {
        jQuery('.selected-article-shape').css('border', '');
      }
    }
  });

  //CKEDITOR
  jQuery('div#web-product-template').on('dblclick', '.open-ckeditor',function(e){
    e.stopPropagation();
    var block_id = jQuery(this).attr('id');
    var obj_type = jQuery(this).attr('data-obj-type');
    if(obj_type == 'text') {
      var str = jQuery(this).html();
      jQuery('#'+block_id).addClass('edit-mode');
      //Enable Disable right Properties panel
      jQuery('#texteditor-dialog').dialog("open");
      CKEDITOR.instances['edit-ckeditor-value'].setData(str); 
      return false;
    }else if(obj_type == 'image') {
      openImageEditor(block_id);
    }else if(obj_type == 'button') {
      // open dialog box for button form
      jQuery('div#button-dialog').dialog("open");
    }else{
      
    }
  });
  
  // open image editor
  jQuery('div#my-kaboodle-web-product-edit').on('click', 'img#kmwpImageCrop',function(e){
    var block_id = jQuery('div#web-product-template .selected-element').attr('id');
    openImageEditor(block_id);
  });
  
  // lock object
  jQuery("div#wp-object-action-button div#btn-lock-unlock span.lock").click(function(e){
    jQuery("span.wp-object-action.lock").addClass('d-none');
    jQuery("span.wp-object-action.unlock").removeClass('d-none');
  });
  
  // unlock object
  jQuery("div#wp-toolbar div#btn-lock-unlock span.unlock").click(function(e){
    jQuery("span.wp-object-action.unlock").addClass('d-none');
    jQuery("span.wp-object-action.lock").removeClass('d-none');
  });
  
  // clone object
  jQuery("div#wp-object-action-button div#btn-clone-object").click(function(e){
    var shape = jQuery("div#web-product-template div.selected-shape").length;
    if(shape >0){
      var selected_shape_id = jQuery(".selected-shape").attr('id');
      var rand_num = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
      var new_element_id = selected_shape_id+'-'+rand_num;
      // create duplicate element and append it to parent element
      jQuery(".selected-shape").clone().removeClass('selected-shape').addClass('clone').attr('id', new_element_id).insertAfter('#'+selected_shape_id);
      jQuery("div.shape").sortable();
    }else{
      var selected_element_id = jQuery(".selected-element").attr('id');
      var rand_num = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
      var new_element_id = selected_element_id+'-'+rand_num;
      // create duplicate element and append it to parent element
      jQuery(".selected-element").clone().removeClass('selected-element').addClass('clone').attr('id', new_element_id).insertAfter('#'+selected_element_id);
      jQuery("div.clone").draggable();
      jQuery("div.shape").droppable();
    }
    
  });
  
  // forward object 
  jQuery("div#wp-object-action-button div#btn-bring-forward").click(function(e){});
  // backward object
  jQuery("div#wp-object-action-button div#btn-send-backward").click(function(e){});
  // delete object
  jQuery("div#wp-object-action-button div#btn-delete-object").click(function(e){    
    jQuery("div#web-product-template div.clone.selected-element").remove();
  });
  
  //Open Delete HTML Article Modal window
  jQuery('.delete-article').click(function(e){
    e.preventDefault();
    jQuery('.delete-article').removeClass("active");
    kmModalWindow("Are you sure you want to delete this article?");
    jQuery(".g-dialog-header").text("DELETE THIS ARTICLE?");
    jQuery(this).addClass("active");
    jQuery(".g-dialog-footer .btn-primary").addClass("del-article");
  });
});

/**
 * Callback function openImageEditor()
 * to Drag the image editor in product edit page.
 **/
function openImageEditor(block_id) {
  var arconstraint = (block_id == 'logo') ? 'height' : 'scale-crop';
  jQuery('input#arconstraint').val(arconstraint);
  // selected image object
  var obj = jQuery('#'+block_id+' img');
  //if(jQuery(".rcb-container .rcb-image").length && !jQuery(".rcb-blocks .rcb-container .rcb-image").length){
  if(jQuery('div#web-product-template img.selected-element').length){
    obj = jQuery('#'+block_id);
  }
  var target_id = obj.attr('imgfid');
  var objsrc    =  obj.attr('src');  
  var objWidth  = jQuery('#'+block_id).width();
  var modalWidth = objWidth;
  var objHeight = jQuery('#'+block_id).height();
  var modalHeight = objHeight;
  if(objWidth == objHeight){
    objWidth = 1080;
    objHeight = 1080;
  }
  else if(objWidth > objHeight){
    var scale = 1920 / objWidth;
    objWidth = objWidth*scale;
    objHeight = objHeight*scale;
  }
  else if(objWidth < objHeight){
    var scale = 1080 / objHeight;
    objWidth = objWidth*scale;
    objHeight = objHeight*scale;
  }
  console.log("WebPage => objWidth = "+objWidth+", objHeight = "+objHeight);
  if(jQuery(".kmwp-image-crop-modal").length == 0){
    jQuery('<div/>', {"class": "g-dialog-container kmwp-image-crop-modal d-block justify-content-center align-items-center visible", "id":"km-image-editor"})
      .append(jQuery('<div/>', {"class": "km-image-editor"})
        .append(jQuery("<div/>", {"class": "slider-wrapper"})
          .append(jQuery("<div/>", {"class": "slider-section"})
            .append(jQuery("<span/>", {"class": "icon icon-image small-image icon18x24"}))
            .append(jQuery("<input/>", {"class": "cropit-image-zoom-input", "id": "km-image-crop-range", "role": "input-range", "type": "range", "min": "0", "max": "1", "step": "0.01", "value": "0"}))
            .append(jQuery("<span/>", {"class": "icon icon-image large-image icon36x24"}))
            .append(jQuery("<button/>", {"class": "btn invisible blurring-msg", "onmouseover": "tooltipfn(this)", "data-km-toggle": "tooltip", "data-view": "fitpage", "data-placement": "bottom", "data-title": "Some blurring may occur", "data-html": "true", "title": "Some blurring may occur"})
              .append(jQuery("<i/>", {"class": "fas fa-exclamation-triangle"}))
            )
          )
          .append(jQuery("<span/>", {"id": "drag-km-image-editor"})
            .append(jQuery("<i/>", {"class": "fa fa-arrows-alt"}))
          )
        )
        .append(jQuery("<div>", {"class": "cropit-preview"})
          .append(jQuery("<div>", {"class": "spinner-border"}))
        )
      )
      .append(jQuery('<div/>', {"class": "dialog-action text-right p-2"})
        .append(jQuery('<ul/>', {'class': 'crop-modal-instruction', })
          .append(jQuery('<span/>', {'class': 'crop-instruction-title', text: "Instructions:"}))
          .append(jQuery('<li/>', {'class': 'crop-instruction-list', text: "Use the slider at the top to scale the image."}))
          .append(jQuery('<li/>', {'class': 'crop-instruction-list', text: "Click over the image and drag to change the crop."}))
          .append(jQuery('<li/>', {'class': 'crop-instruction-list', text: "Select a new image from the Media Kits."}))
        )
        .append(jQuery('<a/>', {'class': 'close-modal btn btn-cancel mr-2', 'href': 'javascript:void(0);', text: 'Cancel'}))
        .append(jQuery('<a/>', {'class': 'close-modal wp-apply-image-crop btn btn-primary font-fjalla disabled', 'href': 'javascript:void(0);', text: 'Apply'}))
      ).appendTo('#web-product-template');
      
    var modal_width = parseInt(modalWidth)+125;
    modal_width =  (modal_width < 750) ? 750 : modal_width;
    
    var modal_height = parseInt(modalHeight)+125;
    modal_height =  (modal_height < 600) ? 600 : modal_height;
    jQuery(".kmwp-image-crop-modal").css({ "width": modal_width+"px", "height": modal_height+"px"});
    // drag image editor
    dragImageEditor(document.getElementById("km-image-editor"));
    jQuery(".cropit-preview img")
    .mousedown(function() {
      jQuery(".cropit-preview").addClass("dragging")
    })
    .mouseup(function() {
      jQuery(".cropit-preview").removeClass("dragging")
    });
  }
  
  // set image dimensions
  var image_dimensions = parseInt(objWidth) + ' x ' + parseInt(objHeight);
  jQuery('input#image-dimensions').val(image_dimensions);
  // call cropit  
  $imageCropper = jQuery('.km-image-editor');
  if(target_id > 0){
    var media_image_url = media_base_url+'/media/'+target_id+'/edit?_format=json';
    jQuery.getJSON( media_image_url, function( image_url ) {
      objsrc = image_url.field_media_image[0].original_url;
      ReplaceResizeImage($imageCropper, objsrc, objWidth, objHeight, 0, function(result) {
        //console.log(result);
      });
    });
  }else{
    ReplaceResizeImage($imageCropper, objsrc, objWidth, objHeight, 0, function(result) {
      //console.log(result);
    });
  }
}
