(function ($, Drupal, drupalSettings) {
  var initialized;
  Drupal.behaviors.webproduct = {
    attach: function (context, settings) {
      //load media kit images
      var uid = drupalSettings.uid;
      var kaboodle_nid = drupalSettings.kaboodle_nid;
      var media_base_url = drupalSettings.media_base_url;
      var edit_properties = drupalSettings.edit_properties;
      
      jQuery('body').on('click','div.g-dialog-footer a.btn-cancel',function(e){
        jQuery('div#web-product-render').removeClass('d-block').addClass('d-none');
      });
      
      //select - element
      jQuery('div#web-product-template').on('click','.open-ckeditor',function(e){
        e.stopPropagation();
        // select element
        jQuery('div#web-product-template .shape').removeClass('selected-shape');
        jQuery('div#web-product-template .open-ckeditor').removeClass('selected-element');
        jQuery('div#web-product-template .shape').removeClass('selected-article-shape');
        jQuery(this).addClass('selected-element');
        // show top nav bar tool 
        jQuery('div#my-kaboodle-web-product-edit div.toolbar-button').addClass('d-none');
        jQuery('div.sidebar-container.media-kit-images').addClass('disabled');
        // text, image or button object
        var obj_type = jQuery(this).attr('data-obj-type');
        if((obj_type == 'text') && (edit_properties == 1)) {
          // font color
          var color = jQuery(this).css('color');
          jQuery('input#kmds-color-fill').val(color);
          jQuery('input#kmds-color-fill').css('background-color', color);
          // font family
          var ffamily = jQuery(this).css('font-family').split(',')[0].replaceAll('"', '');
          jQuery('select#txt-font-family').val(ffamily);
          // font style
          var fweight = jQuery(this).css('font-weight');
          var fstyle = jQuery(this).css('font-style');
          if(fstyle == 'italic'){
            fstyle = fweight+'#I';
          }else{
            fstyle = fweight+'#N';
          }
          jQuery('select#txt-font-style').val(fstyle);
          // font size
          var fsize = jQuery(this).css('font-size').replace('px', '');
          jQuery('input#txt-font-size').val(fsize);
          // show toolbar
          jQuery('div.textbox-tool').removeClass('d-none');
          //jQuery('div#wp-object-action-button').removeClass('d-none');
        }else if(obj_type == 'image') {
          jQuery('div.sidebar-container.media-kit-images').removeClass('disabled');
          jQuery('div.image-tool').removeClass('d-none');
          //jQuery('div#wp-object-action-button').removeClass('d-none');
        }else if(obj_type == 'button') {
          // do something if required
        }else{
          // do something if required
        }
      });
      
      //select container div for shape tool
      if(edit_properties == 1) {
        jQuery('div#web-product-template').on('click', '.shape',function(e){
          var shape_id = jQuery(this).attr('id');
          if(!shape_id){
            return;
          }
          jQuery('div#web-product-template .open-ckeditor').removeClass('selected-element');
          jQuery('div#web-product-template .shape').removeClass('selected-shape');
          jQuery('div#web-product-template .shape').removeClass('selected-article-shape');
          var color = jQuery(this).css('background-color');
          jQuery('input#kmds-shape-fill').val(color);
          jQuery('input#kmds-shape-fill').css('background-color', color);

          // border
          //var borderstyle = jQuery(this).css('border-style');
          var borderstyle = document.getElementById(shape_id).style.borderStyle;
          //var bordercolor = jQuery(this).css('border-color');
          var bordercolor = document.getElementById(shape_id).style.borderColor;
          jQuery('input#kmds-shape-border').css('background-color', bordercolor);
          jQuery('input#kmds-shape-border').val(bordercolor);
          //var borderwidth = jQuery(this).css('border-width').replace('px', '');
          var borderwidth = document.getElementById(shape_id).style.borderWidth.replace('px', '');
          if(parseInt(borderwidth) > 0){
            jQuery('input#shape-border-stroke-num').val(borderwidth);
          }else{
            jQuery('input#shape-border-stroke-num').val('');
          }
          // highlight shape area
          jQuery(this).addClass('selected-shape');
          //Shape area for html article product
          if(jQuery(".rcb-container").length && shape_id !== 'rcb-headline'){
            if(shape_id == 'shape-headline'){
              jQuery(".rcb-header-olivia").addClass('selected-article-shape');
            }
            else if(!jQuery(".newsletter-container").length && !jQuery(".web-page-container").length) {
              jQuery(".rcb-image.shape, .rcb-image-caption.shape, .rcb-story-olivia.shape, .rcb-youtubr-embed.shape").addClass('selected-article-shape');
            }
          }
          // show top nav bar tool 
          jQuery('div.toolbar-button').addClass('d-none');
          jQuery('div.shape-tool').removeClass('d-none');
          //jQuery('div#wp-object-action-button').removeClass('d-none');
        });
      }
      
      //Displayed modal window before return and cancel button click if changes has not saved.
      jQuery("a.return-cancel-edit-wp-template").click(function(e){
        e.preventDefault();
        var save_temp = jQuery("#save_km_template").val();
        if(save_temp == 1){
          redirect_href_url = jQuery(this).attr("href");
          kmModalWindow("Any unsaved changes may be lost.");
          jQuery(".g-dialog-footer .btn-primary").addClass("user-redirect");
        } else {
          var href_url = jQuery(this).attr("href");
          window.location.href = href_url;
        }
      }); 
    }
  }
})(jQuery, Drupal, drupalSettings);

//open media kit image gallery
function saveHTMLTemplate() {
  var template_name = jQuery("input#user-template-name").val();
  if(template_name === '' || typeof template_name === 'undefined'){
    kmModalWindow("Please enter a name for this product.");
    jQuery(".g-dialog-footer .btn-cancel").addClass("d-none");
    jQuery(".g-dialog-header").text("Product name is required");
  }
  else {
    jQuery("button#saveHTMLTemplate").addClass('disabled');
    var html_template = jQuery("div#web-product-template").html();
    jQuery("div#web-product-template-code-tokens").html(html_template);
    
    var token_object = {};
    jQuery("div#web-product-template-code-tokens .token").each(function(k, v) {
      var token_id = jQuery(this).attr('id');
      var token_value = jQuery(this).html();
      var token = '[token:'+token_id+']';
      jQuery(this).html(token);
      
      token_object[token_id] = token_value;
    });
    // then to get the JSON string
    var tokens = JSON.stringify(token_object);
    jQuery("div#web-product-template-code-tokens div.addedBlock img.deleteAddedBlock").remove();
    jQuery("div#web-product-template-code-tokens div.token").removeClass('selected-element');
    jQuery("div#web-product-template-code-tokens div.shape").removeClass('selected-shape');
    jQuery('div#web-product-template-code-tokens div.shape').removeClass('selected-article-shape');
    var html_template_tokens = jQuery("div#web-product-template-code-tokens").html();
    var template_id = jQuery("input#template_id").val();
    var node_id = jQuery("input#node_id").val();
    var product_id = jQuery("input#product_id").val();
    var kmds = jQuery("input#kmds").val();
    var clone = jQuery("input#clone").val();
    
    jQuery.ajax({
      url: '/km/product/webtemplate/save',
      type: 'POST',
      data: {action: 'save', template_id: template_id, template_name: template_name, node_id: node_id, product_id: product_id, kmds: kmds, clone: clone, template: html_template_tokens, tokens: tokens},
      dataType: 'json',
      beforeSend: function() {
        jQuery("body").append(
          jQuery("<div/>", {"class": "g-dialog-container d-flex justify-content-center align-items-center visible"}).append(
            jQuery("<div/>", {"class": "progress-overlay"}).append(
              jQuery("<div/>", {"class": "spinner-border"})
            )
          )
        );
        jQuery('.g-dialog-container').css('color', '#e75e00');
      },
      success: function(response) {
        //console.log(response);
        jQuery("button#saveHTMLTemplate").removeClass('disabled');
        jQuery("div#web-product-template-code-tokens").empty();
        jQuery(".g-dialog-container").remove();
        window.location.href = '/km/product/'+node_id+'/'+product_id+'/template/settings/'+response.template_id+'?kmproduct=yes';
      },
    });
  }
  //console.log(tokens);
  //console.log(html_template_tokens);
}

// font size dropdown callback function
function btntextSizeList() {
  document.getElementById("btn-size-dropdown").classList.toggle("textsizeshow");
}
/**
 * Callback function productCanvasPageImage()
 * to convert canvas page objects to Image
 **/
function renderWebProduct(product_name){
  var modal_title = 'Render '+product_name;
  var dimensions  = 'Responsive';
  var type = 'TXT (HTML)';
  if(jQuery('div#web-product-render').hasClass('d-none')){
    jQuery('div#web-product-render').removeClass('d-none').addClass('d-block');
  }else{
    var render_form = jQuery('<div/>', {"class": "wrap-km-render-block"})
    .append(
      jQuery('<div/>', {"class": "km-render-group title-field"}).append(
        jQuery('<label/>', {"class": "title-original", text: "Title"}).append(
          jQuery('<span/>', {"class": "required", text: "*"})
        ),
        jQuery('<input/>', {'type': 'text', "class": "form-control title-original", "id": "title-original"}),
      ),
      jQuery('<div/>', {"class": "km-render-group dimensions-field"}).append(
        jQuery('<label/>', {"class": "km-render-Dimensions", 'html': "Dimensions:&nbsp;"}).append(
        jQuery('<span/>', {"class": "og-dim", text: dimensions}))
      ),
      jQuery('<div/>', {"class": "km-render-group type-field"}).append(
        jQuery('<label/>', {"class": "km-render-type", 'html': "Type:&nbsp;"}).append(
        jQuery('<span/>', {"class": "og-dim", text: type}))
      ),
      jQuery('<div/>', {"class": "km-render-group archieve-field"}).append(
        jQuery('<div/>', {"class": "checkbox"}).append(
          jQuery('<label/>', {"class": "checkbox-container"}).append(
            jQuery('<input/>', {'type': 'checkbox', "class": "box-check", "id":"km-render-archieve", "value":"0", "checked": false}),
            jQuery('<label/>', {"class":"checkb", "for": "km-render-archieve"}),
            jQuery('<span/>', {"class": "custom-label ml-2", text: "Archived"}),
          )
        )
      ),
      jQuery('<div/>', {"class": "km-render-group tags-field"}).append(
        jQuery('<span/>', {"class": "d-none tags"}),
        jQuery('<label/>', {"class": "tags", text: "Tags"}),
        jQuery('<input/>', {'type': 'text', "class": "form-control tags", "id": "km-render-tags"}),
      ),
      jQuery('<div/>', {"class": "km-render-group description-field"}).append(
        jQuery('<label/>', {"class": "description", text: "Description"}),
        jQuery('<textarea/>', {"class": "form-control description", "aria-label": "With textarea", text:""}),
      ),
      jQuery('<div/>', {"class": "form-group media-kit-field"}).append(
        jQuery('<label/>', {"class": "media-kit", text:"Assigned Media Kits"}),
        jQuery('<div/>', {"class": "wrapped-all-checkboxes"}),
      ),
    );
    // open modal form
    kmModalWindow(render_form);
    jQuery('.g-dialog-container').removeClass('align-items-center').attr('id', 'web-product-render');
    jQuery('.g-dialog-container').addClass('km-render-form-block');
    jQuery('.g-dialog-container .g-dialog-header').text(modal_title);
    jQuery('.g-dialog-container .close-modal.btn-cancel').removeClass('close-modal');
    jQuery('.g-dialog-container .close-modal.btn-primary').text('Render');
    jQuery('.g-dialog-container .close-modal.btn-primary').addClass('wp-render');
    
    //Add functionality for tags field
    setTimeout(function(){ 
      jQuery('input#km-render-tags').tagsInput({
        minChars: 2,
        unique: true,
        'autocomplete': {
          source: '/getTags/' + uid,
        },
        onAddTag: function(fld, tag) {
          if (jQuery('.tagsinput span.tag').length) {
            jQuery('.tagsinput input.tag-input').attr('placeholder', '');
          } else {
            jQuery('.tagsinput input.tag-input').attr('placeholder', 'Add a tag');
          }
        },
        onRemoveTag: function(fld, tag) {
          if (jQuery('.tagsinput span.tag').length) {
            jQuery('.tagsinput input.tag-input').attr('placeholder', '');
          } else {
            jQuery('.tagsinput input.tag-input').attr('placeholder', 'Add a tag');
          }
        },
      });
    }, 500);
  
  
    // Add user media kit list in "Assigned Media Kits" section
    var kmMediaURL = '/web/product/render/edit';
    var render_id = parseInt(jQuery("#render_id").val());
    jQuery.post(kmMediaURL, {"media_kit": "media_kit", "render_id": render_id}, function(response) {
      if(response){
        // media kits
        var checked = 0;
        jQuery.each(response.media_kit, function(key, val){
          if(response.media_data){
            checked = 0;
            jQuery.each(response.media_data.used_mkit, function(mkitkey, mkitval){
              if(mkitval.nid == val.nid){
                checked = 1;
              }
            });
          }
          if(val.title == 'All Media Assets'){
            jQuery('<label/>', {"class": "checkbox-container"}).append(
              jQuery('<input/>', {'type': 'checkbox', "class": "box-check", "id":"km-media-"+val.nid, "value":val.nid, "checked": true, "disabled":true}),
              jQuery('<label/>', {"class":"checkb", "for": "km-media-"+val.nid}),
              jQuery('<span/>', {"class": "custom-label ml-2", text: val.title}),
            ).appendTo('.wrapped-all-checkboxes');
          }
          else if(checked == 1){
            jQuery('<label/>', {"class": "checkbox-container"}).append(
              jQuery('<input/>', {'type': 'checkbox', "class": "box-check", "id":"km-media-"+val.nid, "value":val.nid, "checked": true, "disabled":false}),
              jQuery('<label/>', {"class":"checkb", "for": "km-media-"+val.nid}),
              jQuery('<span/>', {"class": "custom-label ml-2", text: val.title}),
            ).appendTo('.wrapped-all-checkboxes');
          }
          else {
            jQuery('<label/>', {"class": "checkbox-container"}).append(
              jQuery('<input/>', {'type': 'checkbox', "class": "box-check", "id":"km-media-"+val.nid, "value":val.nid, "checked": false, "disabled":false}),
              jQuery('<label/>', {"class":"checkb", "for": "km-media-"+val.nid}),
              jQuery('<span/>', {"class": "custom-label ml-2", text: val.title}),
            ).appendTo('.wrapped-all-checkboxes');
          }
        });
      
        if(response.media_data){
          // media title 
          jQuery(".wrap-km-render-block #title-original").val(response.media_data.name);
          // media description
          jQuery(".wrap-km-render-block .description-field .description").val(response.media_data.description);
          // archived 
          if(response.media_data.achived == 1){
            jQuery(".wrap-km-render-block #km-render-archieve").prop( "checked", true );
          }
          // show tags
          setTimeout(function(){ 
            jQuery('input#km-render-tags').importTags(response.media_data.tags);
            //console.log('not importing tags next time');
          }, 500);
        }
      }
    });
  }
}
