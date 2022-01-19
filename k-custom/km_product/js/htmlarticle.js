jQuery(document).ready(function(){
  
  //load midia kit listing in left section
  var uid = drupalSettings.uid;	
  var media_kit_url = media_base_url+'/user/media_kits/'+ uid +'?_format=json';
  var $elem = jQuery('body .article-media-kit-images');
  jQuery.getJSON( media_kit_url, function( result ) {
    jQuery.each(result, function(key, val) {
      $elem.append(
       jQuery("<div/>", {"class": "wp-media-kit-image empty", "id": "mediakit-"+val.nid, "data-value": val.nid}).append(
          jQuery("<span/>", {"class": "media-kit-image-title", text: val.title}),
          jQuery("<span/>", {"class": "fas fa-caret-right image-list-caret"}),
        )
      );
      console.log('mdt');
      jQuery(".article-media-kit-images .progress-overlay").remove();
    });
  }).done(function() { 
    jQuery(".article-media-kit-images").removeClass("empty");
  });
  
  // default image section in image selection of right section.
  var sectionid = jQuery('#inner-container .item-list').length;
  //if(jQuery("#field-html-article-images-ref-values tbody tr").length){
  if(jQuery("#html-article-paragraph-items .paragraph-item").length){
    sectionid = jQuery("#html-article-paragraph-items .paragraph-item").length;
    //sectionid = jQuery("#field-html-article-images-ref-values tbody tr").length;
    //jQuery("#field_html_article_image-media-library-wrapper").addClass('d-none');
  }
  if(sectionid == 0){
    var ImgSection = "<div id='imagepreviewtext' class='no-preview-image-text text-align-center' style='padding: 2%;'><p>Click the \"ADD IMAGE\" button to include <br>an image from your Media Kits in this article.</p> <p>Articles may include up to 4 images each.</p> </div>";
    
    var defaultImgSection ='<div id="outer-container"><div class="ui-widget-content" id="inner-container">'+ImgSection+'</div><div class="ui-widget-content large-view-info hidden"><label class="p-1">Click thumbnail for larger view</label></div></div>';
    
    jQuery('div.rightsection .field--name-field-keywords').before(
      "<div id='imagesection-container'><label>Image Selections</label>"+defaultImgSection+"</div>"
    );
    jQuery('#kmwpImageCrop').removeClass('disabled');
  }
  else if(sectionid >= 1 && sectionid <= 4){
    var defaultImgSection ='<div id="outer-container"><div class="ui-widget-content" id="inner-container"></div><div class="ui-widget-content large-view-info hidden"><label class="p-1">Click thumbnail for larger view</label></div></div>';
    
    jQuery('div.rightsection .field--name-field-keywords').before(
      "<div id='imagesection-container'><label>Image Selections</label>"+defaultImgSection+"</div>"
    );
    var listItems = jQuery("#html-article-paragraph-items .paragraph-item");
    //var listItems = jQuery("#field-html-article-images-ref-values tbody tr");
    listItems.each(function(idx, li) {
      //var dataSrc = jQuery(li).find("article img").attr('src');
      var dataSrc = jQuery(li).find(".savedImageMedia").val();
      //var dataCaption = jQuery(li).find('.fieldset-wrapper .js-text-full').val();
      var dataCaption = jQuery(li).find('.savedImageCaption').val();
      if(!dataCaption.length){
        var imageMediaName = jQuery(li).find('.imageMediaName').val();
        var dataTitleLimit = (imageMediaName.length > 25) ? imageMediaName.substring(0,25)+'...' : imageMediaName;
      }
      else {
        var dataTitleLimit = (dataCaption.length > 25) ? dataCaption.substring(0,25)+'...' : dataCaption;
      }
      //var dataFid = jQuery(li).find('.js-media-library-item input[type="hidden"]').val();
      var dataFid = jQuery(li).find('.savedMediaId').val();
      
      var ImgSection = '<div class="item-list item" id="item-'+idx+'"><div class="row new"><div class="col-md-11 image-row"><div class="col-md-1 p-2 drag-icon"><i class="fa fa-arrows-alt"></i></div><div class="col-md-1 item-image p-2"><img src="'+dataSrc+'" class="image" width="35" height="35"><input class="imageurl" type="hidden" name="custom_imagesection['+idx+'][imageurl]" value="'+dataSrc+'"><input class="oriimageurl" type="hidden" name="custom_imagesection['+idx+'][oriimageurl]" value="'+dataSrc+'"><input class="imagemedia" type="hidden" name="custom_imagesection['+idx+'][imagemedia]" value="'+dataFid+'"><input class="imageext" type="hidden" name="custom_imagesection['+idx+'][imageext]" ></div><div class="col-md-8 item-name p-2"><label class="name">'+dataTitleLimit+'</label> <div><label>Caption:&nbsp;</label><input class="imageCaption" type="text" name="custom_imagesection['+idx+'][caption]" value="'+dataCaption+'" /></div></div><div class="col-md-2 item-extension p-2"><label class="extension caps-on"></label></div></div><div class="col-md-1 p-3 item-remove"><i class="fa fa-trash-alt" item-list="item-'+idx+'"></i></div></div></div>';
      jQuery('div#inner-container').append(ImgSection);
    });
    if(sectionid < 4){
      jQuery('#kmwpImageCrop').removeClass('disabled');
    }
  }
  else{
    jQuery('#kmwpImageCrop').addClass('disabled');
  }
  
  //add image section in image selection of right section, and enable media kits in left section.
  jQuery('div#my-kaboodle-web-product-edit').on('click', '#kmwpImageCrop',function(e){
    e.preventDefault();
    jQuery(".article-media-kit-images").removeClass('disabled');
    if(!jQuery("#inner-container .item-list .row").hasClass('empty')){
      jQuery('.item-list .row').removeClass('selected');
      var sectionid = jQuery('#inner-container .item-list').length;
      if(sectionid < 4){
        console.log('sectionid ' +sectionid);
        if(sectionid == 3){
          jQuery('#kmwpImageCrop').addClass('disabled');
        }
        var ImgSection = '<div class="item-list hidden" id="item-'+sectionid+'"><div class="row selected empty"><div class="col-md-11 image-row"><div class="col-md-1 p-2 drag-icon"><i class="fa fa-arrows-alt"></i></div><div class="col-md-1 item-image p-2"><img src="#" class="image"><input class="imageurl" type="hidden" name="custom_imagesection['+sectionid+'][imageurl]" ><input class="oriimageurl" type="hidden" name="custom_imagesection['+sectionid+'][oriimageurl]" ><input class="imagemedia" type="hidden" name="custom_imagesection['+sectionid+'][imagemedia]" ><input class="imageext" type="hidden" name="custom_imagesection['+sectionid+'][imageext]" ></div><div class="col-md-8 item-name p-2"><label class="name"></label> <div><label>Caption:&nbsp;</label><input class="imageCaption" type="text" name="custom_imagesection['+sectionid+'][caption]" ></div></div><div class="col-md-2 item-extension p-2"><label class="extension caps-on"></label></div></div><div class="col-md-1 p-3 item-remove"><i class="fa fa-trash-alt" item-list="item-'+sectionid+'"></i></div></div></div>';
        jQuery('div#inner-container').append(ImgSection);
      }
    }
  });
  
  
  
  //get data of media keit listing item
  jQuery(document).on('click','.wp-media-kit-image',function (e) {
    e.preventDefault();
    /*jQuery('#webregionblock1').click();*/
    /*if(jQuery(".wp-media-kit-image").parent().hasClass('disabled')){
      return;
    }
    else*/
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
                    jQuery("<div/>", {"class": "media-data d-flex "+kit_class, "image-title": image_name,"data-extension":image_url.field_media_image[0].thumbnail_extension,"data-thumbnail35": image_url.field_media_image[0].thumbnail_35_style_url, "data-src": image_url.field_media_image[0].original_url, "onmouseover": "tooltipfn(this)", "data-toggle": "tooltip", "data-title": image_name, "data-fid": target_id}).append(
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
          
          
          }).done(function() { 
            jQuery(".mediakit-images .progress-overlay").remove();
          });
        }
        else {
          $this.find('.mediakit-images').removeClass("d-none");
          $this.find('.mediakit-images').addClass("d-block");
        }
      }
    }
  });
  
  //add image in right section of image selection form the media kits list of left section
  jQuery(".article-media-kit-images").on('click','.wp-media-kit-image .media-data',function (e) {
    e.preventDefault();
    jQuery(".wp-media-kit-image .media-data").removeClass("active-gray");
    jQuery(this).addClass("active-gray");
    var dataTitle = jQuery(this).attr('data-title');
    var dataExtension = jQuery(this).attr('data-extension');
    var dataThumbnail = jQuery(this).attr('data-thumbnail35');
    var dataSrc = jQuery(this).attr('data-src');
    var dataFid = jQuery(this).attr('data-fid');
    var dataTitleLimit = jQuery(this).attr('data-title');
    //Add ellipses in name title
    dataTitleLimit = (dataTitleLimit.length > 25) ? dataTitleLimit.substring(0,25)+'...' : dataTitleLimit;
    jQuery('.item-list .selected').addClass('new');
    jQuery('.item-list .selected').removeClass('empty');
    jQuery('.item-list .selected .item-image .image').attr('src',dataThumbnail);
    jQuery('.item-list .selected .item-image .imageurl').val(dataThumbnail);
    jQuery('.item-list .selected .item-image .oriimageurl').val(dataSrc);
    jQuery('.item-list .selected .item-image .imagemedia').val(dataFid);
    jQuery('.item-list .selected .item-image .imageext').val(dataExtension);
    jQuery('.item-list .selected .item-name .name').text(dataTitleLimit);
    //jQuery('.item-list .selected .item-name .imageCaption').val(dataTitle);
    jQuery('.item-list .selected .item-extension .extension').text(dataExtension);
    
    jQuery('.item-list .selected .item-image').attr('data-src',dataSrc);
    jQuery('.item-list .selected .item-image').attr('data-sub-html',dataTitle);
    
    jQuery('.item-list .selected').parent().attr('data-src',dataSrc);
    jQuery('.item-list .selected').parent().attr('data-sub-html',dataTitle);
    
    jQuery('.item-list .selected').parent().addClass('item');
    
    if(jQuery('.item-list .selected').parent().hasClass('hidden')){
      jQuery('.item-list .selected').parent().removeClass('hidden');
    }
    
    if(jQuery("#inner-container div").hasClass('no-preview-image-text')){
      jQuery('.no-preview-image-text').remove();
      
    }
    
    if(jQuery("#outer-container div.large-view-info").hasClass('hidden')){
      jQuery('#outer-container div.large-view-info').removeClass('hidden');
    }
    
    //light gallery enable in image selection.
    if(jQuery("#inner-container div").hasClass('item-list')){
      var gallery = document.getElementById('inner-container');
      var galleryBox = window.lgData[gallery.getAttribute("lg-uid")];
      if(galleryBox){
        galleryBox.destroy(true);
      }
 
      lightGallery(document.getElementById('inner-container'), {
        download: false,
        share: false,
        width:'75%',
        addClass:'km-html-article',
      backgroundColor: '#000',
      selector: '.item-image'
      });
    }
    
    
    var sectionid = jQuery('#inner-container .item-list').length;
    if(sectionid == 4){      
      jQuery('#kmwpImageCrop').addClass('disabled');      
    }
  });
  
  
  
  //detault checked and disabled "All Media Assets" of media kits listing checkbox
  if(jQuery("#edit-field-media-kit-ref-wrapper div").hasClass('js-form-item-field-media-kit-ref-28')){
    jQuery('.js-form-item-field-media-kit-ref-28').addClass("disabled");
    jQuery('.js-form-item-field-media-kit-ref-28 input.form-check-input').prop('checked',true);    
  }
  
  //lightbox enable in image selection.
  if(jQuery("#inner-container div").hasClass('item-list')){
    lightGallery(document.getElementById('inner-container'), {
      download: false,
      share: false,
      width:'75%',
      addClass:'km-html-article',
      backgroundColor: '#000',
      selector: '.item-image'
    });
  }
  
  //remove item from image selection.
  jQuery(".rightsection").on('click','.item-remove .fa-trash-alt',function (e) {
    e.preventDefault();
    //jQuery(this).parent().parent().parent().remove();
    var item_list = jQuery(this).attr('item-list');
    jQuery('#'+item_list).remove();
    var sectionid = jQuery('#inner-container .item-list').length;
    //remove item from image selection
    if(sectionid < 4){      
      jQuery('#kmwpImageCrop').removeClass('disabled');      
    }
    if(sectionid == 1 || (sectionid == 2 && jQuery('.item-list').hasClass('hidden'))){ //
      jQuery('#outer-container div.large-view-info').addClass('hidden');
    }
    else if(sectionid == 0){
      var ImgSection = "<div id='imagepreviewtext' class='no-preview-image-text text-align-center' style='padding: 2%;'><p>Click the \"ADD IMAGE\" button to include <br>an image from your Media Kits in this article.</p> <p>Articles may include up to 4 images each.</p> </div>";
      jQuery('#outer-container #inner-container').append(ImgSection);
      jQuery(".article-media-kit-images").addClass('disabled');
    }
    console.log("sectionid : "+sectionid);
    //lightbox destroy and reassign.
    var gallery = document.getElementById('inner-container');
    var galleryBox = window.lgData[gallery.getAttribute("lg-uid")];
    if(galleryBox){
      galleryBox.destroy(true);
    }
    lightGallery(gallery, {
      download: false,
      share: false,
      width:'75%',
      addClass:'km-html-article',
      backgroundColor: '#000',
      selector: '.item .item-image'
    });
  });
  
  
  
});

//dragable move item in image selection.
jQuery(function() {
  jQuery("#inner-container").sortable();
  jQuery("#inner-container").disableSelection();
});