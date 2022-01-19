jQuery(document).ready(function(){
  // search saved templates by title, description and tags
  jQuery("input#saved-template-search").on("keyup", function() {
    var value = jQuery(this).val().toLowerCase();
    jQuery("table#product_list_view tr.saved-list-template").filter(function() {
      jQuery(this).toggle(jQuery(this).text().toLowerCase().indexOf(value) > -1)
    });
    jQuery("div.product-container div.saved-grid-template").filter(function() {
      jQuery(this).toggle(jQuery(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
  
  // search kmds templates by title, description and tags
  jQuery("input#kmds-template-search").on("keyup", function() {
    var value = jQuery(this).val().toLowerCase();
    jQuery("table#product_list_view tr.kmds-list-template").filter(function() {
      jQuery(this).toggle(jQuery(this).text().toLowerCase().indexOf(value) > -1)
    });
    jQuery("div.product-container div.kmds-grid-template").filter(function() {
      jQuery(this).toggle(jQuery(this).text().toLowerCase().indexOf(value) > -1)
    });
  }); 
  
  // filter by admin and user templates
  /*jQuery("img.admin-template").click(function() {
    var classname = jQuery(this).attr("item-class");
    if(jQuery(this).hasClass('inactive')){
      jQuery(this).attr('src', '/modules/custom/km_product/images/logo-button-active.png');
      jQuery(this).removeClass('inactive');
      jQuery(this).addClass('active');
      templateAdinFilter('active', classname, 'uid');
    }else{
      jQuery(this).attr('src', '/modules/custom/km_product/images/logo-button-inactive.png');
      jQuery(this).removeClass('active');
      jQuery(this).addClass('inactive');
      templateAdinFilter('inactive', classname, 'uid');
    }
  });*/
  
  // save as favorite
  jQuery("span.favorite-template > img.favorite").click(function() {
    var nid = jQuery(this).attr('nid'); 
    var tid = jQuery(this).attr('tid'); 
    var view = jQuery(this).attr('view'); 
    var kmds = jQuery(this).attr('kmds'); 
    var favorite = 0;
    if(jQuery(this).hasClass('inactive')){
      jQuery(this).attr('src', '/modules/custom/km_product/images/heart-active-icon.svg');
      jQuery(this).removeClass('inactive');
      jQuery(this).addClass('active');
      if(view == 'grid'){
        jQuery(this).closest('div.product-grid').attr('data-favorite', 1);
      }else{
        jQuery(this).closest('tr').attr('data-favorite', 1);
      }
      favorite = 1;
    }else{
      jQuery(this).attr('src', '/modules/custom/km_product/images/heart-inactive-icon.svg');
      jQuery(this).removeClass('active');
      jQuery(this).addClass('inactive');
      if(view == 'grid'){
        jQuery(this).closest('div.product-grid').attr('data-favorite', 0);
      }else{
        jQuery(this).closest('tr').attr('data-favorite', 0);
      }
      favorite = 0;
    }
    
    jQuery.ajax({
      url: '/km/product/template/favorite',
      type: 'POST',
      data: {nid: nid, tid: tid, favorite: favorite, kmds: kmds},
      dataType: 'json', 
      success:function(data) {}
    });
  });
  
  // filter by favorite
  jQuery("span.filter-favorite > img.favorite").click(function() {
    var classname = jQuery(this).attr("item-class");
    if(jQuery(this).hasClass('inactive')){
      jQuery(this).attr('src', '/modules/custom/km_product/images/heart-active-icon.svg');
      jQuery(this).removeClass('inactive');
      jQuery(this).addClass('active');
      templateAdinFilter('active', classname, 'favorite');
    }else{
      jQuery(this).attr('src', '/modules/custom/km_product/images/heart-inactive-icon.svg');
      jQuery(this).removeClass('active');
      jQuery(this).addClass('inactive');
      templateAdinFilter('inactive', classname, 'favorite');
    }
  });
  
  // sort by title and time
  jQuery("img.az-sort").click(function() {
    var classname = jQuery(this).attr("item-class");
    var timeobj = jQuery(this).parent().siblings('.time-sort').find('img');
    if(jQuery(this).hasClass('az-inactive')){
      // activate title sort
      jQuery(this).attr('src', '/modules/custom/km_product/images/az-active.png');
      jQuery(this).removeClass('az-inactive');
      jQuery(this).addClass('az-active');
      sortTemplateList(classname, 'title');
      // deactivate time sort
      timeobj.attr('src', '/modules/custom/km_product/images/timesort-inactive.png');
      timeobj.removeClass('time-active');
      timeobj.addClass('time-inactive');
    }else{
      // deactivate title sort
      jQuery(this).attr('src', '/modules/custom/km_product/images/az-inactive.png');
      jQuery(this).removeClass('az-active');
      jQuery(this).addClass('az-inactive');
      // activate time sort
      timeobj.attr('src', '/modules/custom/km_product/images/timesort-active.png');
      timeobj.removeClass('time-inactive');
      timeobj.addClass('time-active');
      sortTemplateList(classname, 'time');
    }
  });
  
  // sort by title and time
  jQuery("img.time-sort").click(function() {
    var classname = jQuery(this).attr("item-class");
    var titleobj = jQuery(this).parent().siblings('.az-sort').find('img');
    if(jQuery(this).hasClass('time-inactive')){
      // activate time sort
      jQuery(this).attr('src', '/modules/custom/km_product/images/timesort-active.png');
      jQuery(this).removeClass('time-inactive');
      jQuery(this).addClass('time-active');
      sortTemplateList(classname, 'time');
      // deactivate title sort
      titleobj.attr('src', '/modules/custom/km_product/images/az-inactive.png');
      titleobj.removeClass('az-active');
      titleobj.addClass('az-inactive');
    }else{
      // deactivate time sort
      jQuery(this).attr('src', '/modules/custom/km_product/images/timesort-inactive.png');
      jQuery(this).removeClass('time-active');
      jQuery(this).addClass('time-inactive');
      // activate title sort
      titleobj.attr('src', '/modules/custom/km_product/images/az-active.png');
      titleobj.removeClass('az-inactive');
      titleobj.addClass('az-active');
      sortTemplateList(classname, 'title');
    }
  });
  
  jQuery("span.delete-template a").click(function(event) {
    event.preventDefault();
    var view = jQuery(this).attr('view');
    var design_id = jQuery(this).attr('id');
    var url = jQuery(this).attr('href');
    if(view == 'grid'){
      var itemObj = jQuery(this).closest('div.product-grid');
    }else{
      var itemObj = jQuery(this).closest('tr');
    }
    var title = itemObj.attr('data-title');
    
    jQuery('#status-d-content').html("Are you sure you want to delete \""+title+"\"? This cannot be undone.");
    jQuery("div#status-dialog").dialog( "option", "buttons", {  
      "Cancel": function() { 
        jQuery(this).dialog("close"); 
      },
      "Ok": function() {
        jQuery.ajax({
          url: url,
          type: 'GET',
          dataType: 'json', 
          success:function(data) {}
        });
        
        // remove grid or tr
        itemObj.fadeOut("slow", function() {
          jQuery(this).remove();
        });
        jQuery(this).dialog("close"); 
      },
    });
    jQuery("div#status-dialog").dialog('open');
  });
});

// sorting 
var sortTemplateList = function(classname, sortby) {
  var switching = true;
  while (switching) {
    switching = false;
    var b = document.getElementsByClassName(classname);
    //console.log(b.length);
    for (i = 0; i < (b.length - 1); i++) {
      var shouldSwitch = false;
      if(sortby == 'time'){
        var x = b[i].getAttribute("data-time").toLowerCase();
        var y = b[i+1].getAttribute("data-time").toLowerCase();
        // descending by time
        if (x < y) {
          shouldSwitch = true;
          break;
        }
      }else{
        var x = b[i].getAttribute("data-title").toLowerCase();
        var y = b[i+1].getAttribute("data-title").toLowerCase();
        // ascending by time
        if (x > y) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;       
    }
  }
}

// searching 
var templateAdinFilter = function(status, classname, type) {
  if(type == 'uid'){
    if(status == 'active'){
      jQuery('div.product-container .'+classname).each(function(n) {
        var uid = parseInt(jQuery(this).attr("data-uid"));
        if(uid == 1){
          jQuery(this).addClass("d-none");
        }
      });
    } else {
      jQuery('div.product-container .'+classname).each(function(n) {
        var uid = parseInt(jQuery(this).attr("data-uid"));
        if(uid == 1){
          jQuery(this).removeClass("d-none");
        }
      });
    }
  }else if(type == 'favorite'){
    if(status == 'active'){
      jQuery('div.product-container .'+classname).each(function(n) {
        var favorite = parseInt(jQuery(this).attr("data-favorite"));
        if(favorite == 0){
          jQuery(this).addClass("d-none");
        }
      });
    } else {
      jQuery('div.product-container .'+classname).each(function(n) {
        var favorite = parseInt(jQuery(this).attr("data-favorite"));
        if(favorite == 0){
          jQuery(this).removeClass("d-none");
        }
      });
    }
  }else{
    
  }
}

function previewProductImage(src){
  var cheight = (window.innerHeight * 80/100);
  var cWidth = (window.innerWidth * 80/100);
  jQuery('<div/>', {"class": "g-dialog-container kmds-static-image-modal d-block justify-content-center align-items-center visible"})
    .append(jQuery('<div/>', {"class": "g-dialog"})
      .append(jQuery('<div/>', {"class": "g-dialog-content"})
        .append(jQuery('<div/>', {"class": "d-grid"})
          .append(jQuery('<span/>', {"class": "d-block"})
            .append(jQuery('<img class="temp-static-image" src="'+ src +'" />'))
          )
        )
      )
      .append(jQuery('<div/>', {"class": "g-dialog-footer"})
        .append(jQuery('<a/>', {'class': 'close-modal', 'href': 'javascript:void(0);', text: 'X'}))
      )
    ).appendTo('div#kmds-product-container');
    
  let img = new Image();
  img.onload = function() {
    var img_width, img_height; 
    if(img.width >= img.height){
      img_width = img.width;
      img_height = "auto";
      // fit within screen
      if(img.width > cWidth){
        img_width = cWidth;
      }
      if(img.height > cheight){
        img_width = "auto";
        img_height = cheight;
      }
    }
    else if(img.width < img.height){
      img_width = "auto";
      img_height = img.height;
      if(img.height > cheight){
        img_height = cheight;
      }
    }
    jQuery("div#kmds-product-container .temp-static-image").css("width", img_width);
    jQuery("div#kmds-product-container .temp-static-image").css("height", img_height);
  }
  img.src = src;
}

jQuery("div#kmds-product-container").on('click','.g-dialog-footer',function () {
  jQuery("div#kmds-product-container .g-dialog-container.visible").remove();
});


