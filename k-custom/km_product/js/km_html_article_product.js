var user_action = drupalSettings.user_action;
var user_professional_access = drupalSettings.user_professional_access;
var uid = drupalSettings.uid;
console.log(uid);
var kaboodle_nid = drupalSettings.kaboodle_nid;
var media_base_url = drupalSettings.media_base_url;
var producttype_id = drupalSettings.producttype_id;
var rcb_tid = drupalSettings.rcb_tid;

(function ($, Drupal, drupalSettings) {
  var initialized;
  Drupal.behaviors.km_html_article_product = {
    attach: function (context, settings) {
      //load media kit images
      jQuery(window).on('load', function(){
        if(jQuery('body div.left-panel .km-html-articles').hasClass("empty")){
          jQuery('body div.left-panel .km-html-articles').removeClass("empty");
          var html_articles_url = media_base_url+'/user/html_articles/'+ uid +'?_format=json';
          var apply_class = ' apply-article'
          var no_data_text = 'Click here to add HTML Article';
          var no_data_link = '/tools/html-article/add/';
          if(producttype_id == 'Email Newsletter' || producttype_id == 'Web Page'){
            html_articles_url = media_base_url+'/user/render_html_articles/'+ uid +'?_format=json';
            apply_class = ' apply-render-article'
            no_data_text = "Click here to add<br>Reusable Content Blocks";
            no_data_link = '/km/product/'+kaboodle_nid+'/'+rcb_tid+'/template/select?view=grid';
          }
          var $elem = jQuery('body div.left-panel .km-html-articles');
          jQuery.getJSON( html_articles_url, function( result ) {
						if(result.length){
							jQuery.each(result, function(key, val) {
                var fave = (val.favorite == 1) ? ' fave-article' : '';
                $elem.append(
                  jQuery("<div/>", {"class": "user-html-article"+fave, "id": "article-"+val.nid, "data-value": val.nid, "data-articletitle": val.title, "data-articletags": val.tags}).append(
                    jQuery("<div/>", {"class": "html-article1"}).append(
                      jQuery("<div/>", {"class": "html-article-title", text: val.title}),
                      jQuery("<div/>", {"class": "html-article-count", text: val.images+' images, '+val.video+' video'})
                    ),
                    jQuery("<div/>", {"class": "html-article2"}).append(
                      jQuery("<button/>", {"class": "btn btn-primary font-fjalla"+apply_class, "data-value": val.nid, text: 'Apply'}),
                    ),
                  )
                );
							});
						} else {
							$elem.append(
								jQuery("<div/>", {"class": "user-html-article d-flex justify-content-center align-items-center"}).append(
									jQuery('<a/>', {'class': 'no-text-decoration', 'href': no_data_link}).html(no_data_text),
								)
							);
						}
            jQuery(".km-html-articles .progress-overlay").remove();
          });
        }
        if(jQuery(".rcb-blocks .addedBlock").length){
          jQuery(".rcb-blocks .addedBlock").each(function(k, v) {
            if(!jQuery(this).find('.deleteAddedBlock').length){
              jQuery(".rcb-blocks .addedBlock").prepend('<img class="deleteAddedBlock" src="/modules/custom/km_product/images/trash.png" height="30">');
            }
          });
        }
        //Load playlists and online gallery user product for "WEB PAGE" product.
        if(jQuery('body div.left-panel .km-playlists').hasClass("empty")){
          jQuery('body div.left-panel .km-playlists').removeClass("empty");
          var playlists_url = media_base_url+'/user/km_playlists/'+ uid +'?_format=json';
          var $playlist_elem = jQuery('body div.left-panel .km-playlists');
          jQuery.getJSON( playlists_url, function( result ) {
						if(result.length){
							jQuery.each(result, function(key, val) {
                var fave = (val.favorite == 1) ? ' fave-article' : '';
                $playlist_elem.append(
                  jQuery("<div/>", {"class": "user-playlist"+fave, "id": "playlist-"+val.nid, "data-value": val.nid, "data-articletitle": val.title, "data-articletags": val.tags}).append(
                    jQuery("<div/>", {"class": "user-playlist1"}).append(
                      jQuery("<div/>", {"class": "playlist-title", text: val.title}),
                      jQuery("<div/>", {"class": "playlist-count", text: val.playlist+' tracks'})
                    ),
                    jQuery("<div/>", {"class": "user-playlist2"}).append(
                      jQuery("<button/>", {"class": "btn btn-primary font-fjalla apply-render-article playlist", "data-value": val.nid, text: 'Apply'}),
                    ),
                  )
                );
							});
						} else {
							$playlist_elem.append(
								jQuery("<div/>", {"class": "user-playlist d-flex justify-content-center align-items-center"}).append(
									jQuery('<a/>', {'class': 'no-text-decoration', 'href': '/km/product/'+kaboodle_nid+'/'+rcb_tid+'/template/select?view=grid'}).html('Click here to add Playlist'),
								)
							);
						}
            jQuery(".km-playlists .progress-overlay").remove();
          });
        }
        if(jQuery('body div.left-panel .km-online-gallery').hasClass("empty")){
          jQuery('body div.left-panel .km-online-gallery').removeClass("empty");
          var online_gallery_url = media_base_url+'/user/km_online_gallery/'+ uid +'?_format=json';
          var $online_gallery_elem = jQuery('body div.left-panel .km-online-gallery');
          jQuery.getJSON( online_gallery_url, function( result ) {
						if(result.length){
							jQuery.each(result, function(key, val) {
                var fave = (val.favorite == 1) ? ' fave-article' : '';
                $online_gallery_elem.append(
                  jQuery("<div/>", {"class": "user-online-gallery"+fave, "id": "onlinegallery-"+val.nid, "data-value": val.nid, "data-articletitle": val.title, "data-articletags": val.tags}).append(
                    jQuery("<div/>", {"class": "user-online-gallery1"}).append(
                      jQuery("<div/>", {"class": "online-gallery-title", text: val.title}),
                      jQuery("<div/>", {"class": "online-gallery-count", text: val.images+' images'})
                    ),
                    jQuery("<div/>", {"class": "user-online-gallery2"}).append(
                      jQuery("<button/>", {"class": "btn btn-primary font-fjalla apply-render-article online-gallery", "data-value": val.nid, text: 'Apply'}),
                    ),
                  )
                );
							});
						} else {
							$online_gallery_elem.append(
								jQuery("<div/>", {"class": "user-online-gallery d-flex justify-content-center align-items-center"}).append(
									jQuery('<a/>', {'class': 'no-text-decoration', 'href': '/km/product/'+kaboodle_nid+'/'+rcb_tid+'/template/select?view=grid'}).html('Click here to add Online Gallery'),
								)
							);
						}
            jQuery(".km-online-gallery .progress-overlay").remove();
          });
        }
      });
    }
  }
})(jQuery, Drupal, drupalSettings);
jQuery(document).ready(function(){
  //Search Favorite functionality
  jQuery('#filter-by-favo-article').click(function(){
    if(jQuery(this).hasClass('inactive')){
      jQuery(this).addClass('active');
      jQuery(this).removeClass('inactive');
    }
    else {
      jQuery(this).removeClass('active');
      jQuery(this).addClass('inactive');
    }
  });
  jQuery('#filter-by-member-favo-article').click(function(){
    if(jQuery(this).hasClass('inactive')){
      jQuery(this).addClass('active');
      jQuery(this).removeClass('inactive');
    }
    else {
      jQuery(this).removeClass('active');
      jQuery(this).addClass('inactive');
    }
  });
  //Search clear functionality
  jQuery('#filter-article').on('keypress', function(event){
    jQuery('.clear-text').removeClass('d-none');
  }).keyup(function(){
    var filter = jQuery('#filter-article').val();
    if(filter !== '') {
      jQuery('.clear-text').removeClass('d-none');
    }
    else {
      jQuery('.clear-text').addClass('d-none');
      searchHtmlArticle();
    }
    if(event.keyCode == 13){
      searchHtmlArticle();
    }
  });
  jQuery('#filter-member-article').on('keypress', function(event){
    jQuery('.clear-member-text').removeClass('d-none');
  }).keyup(function(){
    var filter = jQuery('#filter-member-article').val();
    if(filter !== '') {
      jQuery('.clear-member-text').removeClass('d-none');
    }
    else {
      jQuery('.clear-member-text').addClass('d-none');
      searchHtmlMemberArticle();
    }
    if(event.keyCode == 13){
      searchHtmlMemberArticle();
    }
  });
  jQuery('.clear-text').click(function(){
    jQuery(this).addClass('d-none');
    jQuery('#filter-article').val('');
    searchHtmlArticle();
  });
  jQuery('.clear-member-text').click(function(){
    jQuery(this).addClass('d-none');
    jQuery('#filter-member-article').val('');
    searchHtmlMemberArticle();
  });
  //Apply HTML article in template
  jQuery("#left-sidebar").on('click', '.apply-article', function(e) {
    jQuery("body").append(
      jQuery("<div/>", {"class": "g-dialog-container d-flex justify-content-center align-items-center visible"}).append(
        jQuery("<div/>", {"class": "progress-overlay"}).append(
          jQuery("<div/>", {"class": "spinner-border"})
        )
      )
    );
    jQuery('.g-dialog-container').css('color', '#e75e00');
    var nid = jQuery(this).attr('data-value');
    var html_articles_url = media_base_url+'/user/html_article_node/'+ nid +'?_format=json';
    jQuery.getJSON( html_articles_url, function( result ) {
      if(result){
        jQuery("#headline").html(result.title);
        jQuery("#description").html(result.story);
        jQuery("#rcb-youtube-embed").html(result.youtube);
        if(result.paragraph_items.length){
          jQuery.each(result.paragraph_items, function(key, val) {
            var num = parseInt(key + 1);console.log(num);
            jQuery("#rcb-image_"+num+' img').attr('src', val.imageMedia);
            jQuery("#rcb-image_"+num+' img').attr('imgfid', val.mediaId);
            jQuery("#rcb-image_"+num+' img').attr('imgcrop', 0);
            jQuery("#rcb-image-caption_"+num+' .rcb-caption-std').html(val.imageMediaName);
          });
        }
        jQuery(".g-dialog-container").remove();
      }
    });
  });
  //Slide UP the media-kit and html-article list
  jQuery("#html-article-slide-top").click(function(){
    jQuery(".sidebar-container.km-html-articles").slideToggle({
      direction: "up"
    }, 1000);
    if(jQuery("#html-article-slide-top .image-list-caret").hasClass('fa-caret-up')){
      jQuery("#html-article-slide-top .image-list-caret").removeClass('fa-caret-up').addClass('fa-caret-down');
    }
    else {
      jQuery("#html-article-slide-top .image-list-caret").removeClass('fa-caret-down').addClass('fa-caret-up');
    }
  });
  jQuery("#html-article-media-kit-slide-top").click(function(){
    jQuery(".sidebar-container.media-kit-images").slideToggle({
      direction: "up"
    }, 1000);
    if(jQuery("#html-article-media-kit-slide-top .image-list-caret").hasClass('fa-caret-up')){
      jQuery("#html-article-media-kit-slide-top .image-list-caret").removeClass('fa-caret-up').addClass('fa-caret-down');
    }
    else {
      jQuery("#html-article-media-kit-slide-top .image-list-caret").removeClass('fa-caret-down').addClass('fa-caret-up');
    }
  });
  jQuery("#km-playlists-slide-top").click(function(){
    jQuery(".sidebar-container.km-playlists").slideToggle({
      direction: "up"
    }, 1000);
    if(jQuery("#km-playlists-slide-top .image-list-caret").hasClass('fa-caret-up')){
      jQuery("#km-playlists-slide-top .image-list-caret").removeClass('fa-caret-up').addClass('fa-caret-down');
    }
    else {
      jQuery("#km-playlists-slide-top .image-list-caret").removeClass('fa-caret-down').addClass('fa-caret-up');
    }
  });
  jQuery("#km-online-gallery-slide-top").click(function(){
    jQuery(".sidebar-container.km-online-gallery").slideToggle({
      direction: "up"
    }, 1000);
    if(jQuery("#km-online-gallery-slide-top .image-list-caret").hasClass('fa-caret-up')){
      jQuery("#km-online-gallery-slide-top .image-list-caret").removeClass('fa-caret-up').addClass('fa-caret-down');
    }
    else {
      jQuery("#km-online-gallery-slide-top .image-list-caret").removeClass('fa-caret-down').addClass('fa-caret-up');
    }
  });
  //Add reusable content block
  jQuery("#left-sidebar").on('click', '.apply-render-article', function(e) {
    jQuery("body").append(
      jQuery("<div/>", {"class": "g-dialog-container d-flex justify-content-center align-items-center visible"}).append(
        jQuery("<div/>", {"class": "progress-overlay"}).append(
          jQuery("<div/>", {"class": "spinner-border"})
        )
      )
    );
    jQuery('.g-dialog-container').css('color', '#e75e00');
    var id = jQuery(this).attr('data-value');
    var playlist = false;
    if(jQuery(this).hasClass('playlist')){
      playlist = true;
    }
    var onlineGallery = false;
    if(jQuery(this).hasClass('online-gallery')){
      onlineGallery = true;
    }
    var rcbContent = false;
    if(jQuery(this).hasClass('apply-render-article')){
      rcbContent = true;
    }
    var html_articles_url = media_base_url+'/user/html_article_render/'+id;
    jQuery.getJSON( html_articles_url, function( result ) {
      if(result){
        jQuery(".rcb-blocks").removeClass('shape');
        var currentTime = jQuery.now();
        jQuery(".rcb-blocks-html").remove();
        jQuery(".rcb-blocks").append('<div class="addedBlock addedBlock-'+currentTime+'" article-nid="'+id+'"><img class="deleteAddedBlock" src="/modules/custom/km_product/images/trash.png" height="30">'+result.article+'</div>');
        jQuery('.addedBlock-'+currentTime+' .rcb-container').find('.token').removeClass('token');
        jQuery(".addedBlock-"+currentTime+" [id]").each(function(k, v) {
          var idc = jQuery(v).attr("id");
          jQuery('.addedBlock-'+currentTime).find('#'+idc).attr("id", idc+'-'+currentTime);
        });
        //replace all same ids
        if(playlist){
          var addedBlock = jQuery('.addedBlock-'+currentTime).html();
          var updatedAddedBlock = replaceAll(addedBlock, "\'web-product-template\'", "\'web-product-template-"+currentTime+"\'");
          updatedAddedBlock = replaceAll(updatedAddedBlock, "\"playlist-body\"", "\"playlist-body-"+currentTime+"\"");
          updatedAddedBlock = replaceAll(updatedAddedBlock, "\"playing-song-title\"", "\"playing-song-title-"+currentTime+"\"");
          updatedAddedBlock = replaceAll(updatedAddedBlock, "\"playlist-audio\"", "\"playlist-audio-"+currentTime+"\"");
          updatedAddedBlock = replaceAll(updatedAddedBlock, "white-space\: nowrap\;", "");
          updatedAddedBlock = replaceAll(updatedAddedBlock, "white-space\:nowrap\;", "");
          jQuery('.addedBlock-'+currentTime).html(updatedAddedBlock);
          jQuery(".addedBlock-"+currentTime+" .playlis-title").each(function() {
            var playlisTitle = jQuery(this).text();
            playlisTitle = replaceAll(playlisTitle, "_", "-");
            jQuery(this).text(playlisTitle);
          });
        }
        else if(onlineGallery){
          var addedBlock = jQuery('.addedBlock-'+currentTime).html();
          var updatedAddedBlock = replaceAll(addedBlock, "\'km-gall-1\'", "\'km-gall-1-"+currentTime+"\'");
          updatedAddedBlock = replaceAll(updatedAddedBlock, "\"km-gallery-pagination-wrapper\"", "\"km-gallery-pagination-wrapper-"+currentTime+"\"");
          updatedAddedBlock = replaceAll(updatedAddedBlock, "\'km-gallery-pagination-wrapper\'", "\'km-gallery-pagination-wrapper-"+currentTime+"\'");
          updatedAddedBlock = replaceAll(updatedAddedBlock, "\'\#km-gallery-pagination-wrapper\'", "\'\#km-gallery-pagination-wrapper-"+currentTime+"\'");
          updatedAddedBlock = replaceAll(updatedAddedBlock, "km-gallery-page", "km-gallery-page-"+currentTime);
          updatedAddedBlock = replaceAll(updatedAddedBlock, "\'km-gall-\'\+select_page_id", "\'km-gall-\'\+select_page_id\+\"-"+currentTime+"\"");
          updatedAddedBlock = replaceAll(updatedAddedBlock, "selectPage", "selectPage"+currentTime);
          updatedAddedBlock = replaceAll(updatedAddedBlock, "const observer", "const observer"+currentTime);
          updatedAddedBlock = replaceAll(updatedAddedBlock, "observer\.observe", "observer"+currentTime+"\.observe");
          updatedAddedBlock = replaceAll(updatedAddedBlock, "white-space\: nowrap\;", "");
          updatedAddedBlock = replaceAll(updatedAddedBlock, "white-space\:nowrap\;", "");
          jQuery('.addedBlock-'+currentTime).html(updatedAddedBlock);
        }
        else {
          //remove white-space css for all product template.
          var addedBlock = jQuery('.addedBlock-'+currentTime).html();
          var updatedAddedBlock = replaceAll(addedBlock, "white-space\: nowrap\;", "");
          updatedAddedBlock = replaceAll(updatedAddedBlock, "white-space\:nowrap\;", "");
          jQuery('.addedBlock-'+currentTime).html(updatedAddedBlock);
          if(rcbContent){
            jQuery('.addedBlock-'+currentTime).append("<style>@media only screen and (min-device-width: 320px) and (max-device-width: 750px) {.addedBlock-"+currentTime+" .rcb-image > div {width: 100% !important;}}</style>");
          }
        }
        jQuery('.addedBlock-'+currentTime+' .rcb-header-content').css('line-height', '');
        jQuery('.addedBlock-'+currentTime+' table.web-playlist-template').attr('width', "100%");
        jQuery(".g-dialog-container").remove();
      }
    });
  });
  jQuery("#web-product-template").on('click', '.deleteAddedBlock', function(e) {
    jQuery(this).parent().remove();
    if(!jQuery('.rcb-blocks .addedBlock').length && !jQuery('.rcb-blocks .rcb-blocks-html').length){
      if(producttype_id == 'Web Page'){
        jQuery(".rcb-blocks").append('<div class="rcb-blocks-html" style="padding: 70px; font-family: Verdana; font-size: 16px; line-height: normal; color: #404c3c; font-weight: 400;">Place RCB, Playlist, and/or<br>Online Gallery content here.</div>');
      }
      else {
        jQuery(".rcb-blocks").append('<div class="rcb-blocks-html" style="padding: 70px; font-family: Verdana; font-size: 16px; line-height: normal; color: #606448; font-weight: 400;">Add Reusable Content Blocks here.</div>');
      }
      jQuery(".rcb-blocks").addClass('shape');
    }
  });
  //Display memebr team after click on tab.
  //jQuery('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  jQuery('a[data-toggle=tab]').click(function(){
    if(jQuery('.member-content').length){
      var uri = window.location.href.toString();
      if (uri.indexOf("?") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
      }
      jQuery('.member-content').addClass('d-none');
      jQuery('.member-teams').removeClass('d-none');
    }
  });
});

/**
 * Callback function searchHtmlArticle()
 **/
function searchHtmlArticle(){
  if(jQuery("#km-html-articles-list").css("display") == "none"){
    jQuery("#km-html-articles-list").css("display", "block");
    if(jQuery("#html-article-slide-top .image-list-caret").hasClass('fa-caret-up')){
      jQuery("#html-article-slide-top .image-list-caret").removeClass('fa-caret-up').addClass('fa-caret-down');
    }
    else {
      jQuery("#html-article-slide-top .image-list-caret").removeClass('fa-caret-down').addClass('fa-caret-up');
    }
  }
  var input, filter, list, b, l, i, txtValue, searchCount, tagsValue;
  var favo = (jQuery("#filter-by-favo-article").hasClass('active')) ? 1 : 0;
  input = document.getElementById("filter-article");
  filter = input.value.toUpperCase();
  list = document.getElementById("km-html-articles-list");
  if(favo == 1){
    b = list.getElementsByClassName('fave-article');
  }
  else {
    b = list.getElementsByClassName('user-html-article');
  }
  searchCount = 0;
  jQuery('#km-html-articles-list .user-html-article').removeClass('d-block');
  jQuery('#km-html-articles-list .user-html-article').addClass('d-none');
  for (i = 0; i < b.length; i++) {
    if(filter.trim() == ''){
      b[i].classList.remove("d-none");
      b[i].classList.add("d-block");
      b[i].classList.remove("search-result");
    }
    else {
      txtValue = b[i].getAttribute("data-articletitle");
      tagsValue = b[i].getAttribute("data-articletags");
      if (txtValue.toUpperCase().indexOf(filter) > -1 || tagsValue.toUpperCase().indexOf(filter) > -1) {
        b[i].classList.remove("d-none");
        b[i].classList.add("d-block");
        b[i].classList.add("search-result");
        searchCount++;
      } else {
        b[i].classList.remove("d-flex");
        b[i].classList.remove("d-block");
        b[i].classList.remove("search-result");
        b[i].classList.add("d-none");
      }
    }
  }
  //If "Web Page" Product edit page
  if(producttype_id == 'Web Page'){
    if(jQuery("#km-playlists-list").css("display") == "none"){
      jQuery("#km-playlists-list").css("display", "block");
      if(jQuery("#km-playlists-slide-top .image-list-caret").hasClass('fa-caret-up')){
        jQuery("#km-playlists-slide-top .image-list-caret").removeClass('fa-caret-up').addClass('fa-caret-down');
      }
      else {
        jQuery("#km-playlists-slide-top .image-list-caret").removeClass('fa-caret-down').addClass('fa-caret-up');
      }
    }
    if(jQuery("#km-online-gallery-list").css("display") == "none"){
      jQuery("#km-online-gallery-list").css("display", "block");
      if(jQuery("#km-online-gallery-slide-top .image-list-caret").hasClass('fa-caret-up')){
        jQuery("#km-online-gallery-slide-top .image-list-caret").removeClass('fa-caret-up').addClass('fa-caret-down');
      }
      else {
        jQuery("#km-online-gallery-slide-top .image-list-caret").removeClass('fa-caret-down').addClass('fa-caret-up');
      }
    }
    list = document.getElementById("km-playlists-list");
    if(favo == 1){
      b = list.getElementsByClassName('fave-article');
    }
    else {
      b = list.getElementsByClassName('user-playlist');
    }
    searchCount = 0;
    jQuery('.user-playlist').removeClass('d-block');
    jQuery('.user-playlist').addClass('d-none');
    for (i = 0; i < b.length; i++) {
      if(filter.trim() == ''){
        b[i].classList.remove("d-none");
        b[i].classList.add("d-block");
        b[i].classList.remove("search-result");
      }
      else {
        txtValue = b[i].getAttribute("data-articletitle");
        tagsValue = b[i].getAttribute("data-articletags");
        if (txtValue.toUpperCase().indexOf(filter) > -1 || tagsValue.toUpperCase().indexOf(filter) > -1) {
          b[i].classList.remove("d-none");
          b[i].classList.add("d-block");
          b[i].classList.add("search-result");
          searchCount++;
        } else {
          b[i].classList.remove("d-flex");
          b[i].classList.remove("d-block");
          b[i].classList.remove("search-result");
          b[i].classList.add("d-none");
        }
      }
    }
    list = document.getElementById("km-online-gallery-list");
    if(favo == 1){
      b = list.getElementsByClassName('fave-article');
    }
    else {
      b = list.getElementsByClassName('user-online-gallery');
    }
    searchCount = 0;
    jQuery('.user-online-gallery').removeClass('d-block');
    jQuery('.user-online-gallery').addClass('d-none');
    for (i = 0; i < b.length; i++) {
      if(filter.trim() == ''){
        b[i].classList.remove("d-none");
        b[i].classList.add("d-block");
        b[i].classList.remove("search-result");
      }
      else {
        txtValue = b[i].getAttribute("data-articletitle");
        tagsValue = b[i].getAttribute("data-articletags");
        if (txtValue.toUpperCase().indexOf(filter) > -1 || tagsValue.toUpperCase().indexOf(filter) > -1) {
          b[i].classList.remove("d-none");
          b[i].classList.add("d-block");
          b[i].classList.add("search-result");
          searchCount++;
        } else {
          b[i].classList.remove("d-flex");
          b[i].classList.remove("d-block");
          b[i].classList.remove("search-result");
          b[i].classList.add("d-none");
        }
      }
    }
  }
}
/**
 * Callback function searchHtmlMemberArticle()
 **/
function searchHtmlMemberArticle(){
  var input, filter, list, b, l, i, txtValue, searchCount, tagsValue;
  var favo = (jQuery("#filter-by-member-favo-article").hasClass('active')) ? 1 : 0;
  input = document.getElementById("filter-member-article");
  filter = input.value.toUpperCase();
  list = document.getElementById("km-html-member-articles-list");
  if(favo == 1){
    b = list.getElementsByClassName('fave-article');
  }
  else {
    b = list.getElementsByClassName('user-html-article');
  }
  searchCount = 0;
  jQuery('#km-html-member-articles-list .user-html-article').removeClass('d-block');
  jQuery('#km-html-member-articles-list .user-html-article').addClass('d-none');
  for (i = 0; i < b.length; i++) {
    if(filter.trim() == ''){
      b[i].classList.remove("d-none");
      b[i].classList.add("d-block");
      b[i].classList.remove("search-result");
    }
    else {
      txtValue = b[i].getAttribute("data-articletitle");
      tagsValue = b[i].getAttribute("data-articletags");
      if (txtValue.toUpperCase().indexOf(filter) > -1 || tagsValue.toUpperCase().indexOf(filter) > -1) {
        b[i].classList.remove("d-none");
        b[i].classList.add("d-block");
        b[i].classList.add("search-result");
        searchCount++;
      } else {
        b[i].classList.remove("d-flex");
        b[i].classList.remove("d-block");
        b[i].classList.remove("search-result");
        b[i].classList.add("d-none");
      }
    }
  }
}
/**
 * Callback function replaceAll()
 * To replace the data in given string.
 **/
function replaceAll(str, find, replace) {
  var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return str.replace(new RegExp(escapedFind, 'g'), replace);
}
