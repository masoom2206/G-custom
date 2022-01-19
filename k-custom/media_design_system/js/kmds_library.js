//Pagination variable
var paginKey = 1;
var pageSize = 20;
(function ($, Drupal, drupalSettings) {
  var initialized;
  Drupal.behaviors.LibraryBehavior = {
    attach: function (context, settings) {
      if (!initialized) {
        initialized = true;
        var media_base_url = drupalSettings.media_base_url;
        var uid = drupalSettings.uid;
        var user_roles = drupalSettings.user_roles.split(',');
        var media_term = drupalSettings.media_term;
        var selectedtid = drupalSettings.tid;
        //var access_check_api = 'https://api.kaboodlemedia.com/api/v1/';
        var access_check_api = drupalSettings.access_check_api;
        var api_key = drupalSettings.api_key;
        var size1 = 'auto';
        var size2 = 'auto';

        // Product Library class  
        var AppProductsLibrary = React.createClass({
          getInitialState: function() {
            return { 
              p_type: [],
              p_library: [],
              p_templates: [],
              dataUID: '',
            }
          },
          componentWillMount: function() {
            var th = this;
            this.serverRequest = axios.get(media_base_url+'/termdata/'+selectedtid+'?_format=json')
              .then(function(response) {
                return response.data[0];
              })
              .then(function(data) {
                th.setState({p_type: data});
                var tid = data.tid;
                return axios.get(media_base_url+'/kmds/product-library/'+tid+'?_format=json');
              })
              .then(function(responsex) {
                th.setState({p_library: responsex.data});
              });
            let headers = {"Authorization": "bearercvc "+api_key};
            var media_url = access_check_api + "getfolder/" + uid;
            this.serverRequest = axios.get(media_url, { headers: headers })
              .then(function(response) {
                //console.log(response.data.data);
                th.setState({p_templates: response.data.data});
                th.setState({dataUID: response.data.uid});
              });
            document.addEventListener('load', th.handleSize.bind());
            var templateFilter = sessionStorage.getItem("templateFilter");
            var perfEntries = performance.getEntriesByType("navigation");
            if(templateFilter && perfEntries[0].type === "back_forward"){
              setTimeout(function() {
                //window.addEventListener('load', th.templateActiveInactive.bind(null, templateFilter));
                window.addEventListener('load', function(event) {
                  jQuery("#"+templateFilter+"-templates").trigger('click');
                  //renderListAfterBack(templateFilter);
                });
              }, 1000);
            }
          },
          componentWillUnmount: function() {
            this.serverRequest.abort();
          },
          templateActiveInactive: function(type) {
            sessionStorage.setItem("templateFilter", type);
            if(type == 'active'){
              jQuery('.inactive-list-temp').addClass("d-none");
              jQuery('.removal-list-temp').addClass("d-none");
              jQuery(".active-list-temp").each(function(n) {
                if (n < pageSize) {
                  jQuery(this).removeClass("d-none");
                }
              });
              jQuery('.inactive-temp').removeClass('d-block').addClass("d-none");
              jQuery('.removal-temp').removeClass('d-block').addClass("d-none");
              jQuery(".active-temp").each(function(n) {
                if (n < pageSize) {
                  jQuery(this).removeClass("d-none").addClass("d-block");
                }
              });
              getPagination("active-temp");
            }
            else if(type == 'inactive'){
              jQuery('.active-list-temp').addClass("d-none");
              jQuery('.removal-list-temp').addClass("d-none");
              jQuery(".inactive-list-temp").each(function(n) {
                if (n < pageSize) {
                  jQuery(this).removeClass("d-none");
                }
              });
              jQuery('.active-temp').removeClass('d-block').addClass("d-none");
              jQuery('.removal-temp').removeClass('d-block').addClass("d-none");
              jQuery(".inactive-temp").each(function(n) {
                if (n < pageSize) {
                  jQuery(this).removeClass("d-none").addClass("d-block");
                }
              });
              getPagination("inactive-temp");
            }
            else if(type == 'removal'){
              jQuery('.active-list-temp').addClass("d-none");
              jQuery('.inactive-list-temp').addClass("d-none");
              jQuery(".removal-list-temp").each(function(n) {
                if (n < pageSize) {
                  jQuery(this).removeClass("d-none");
                }
              });
              jQuery('.active-temp').removeClass('d-block').addClass("d-none");
              jQuery('.inactive-temp').removeClass('d-block').addClass("d-none");
              jQuery(".removal-temp").each(function(n) {
                if (n < pageSize) {
                  jQuery(this).removeClass("d-none").addClass("d-block");
                }
              });
              getPagination("removal-temp");
            }
            var page_type = jQuery("input[name='status']:checked").val();
            sortTemplateList(page_type, 'az');
            jQuery('.admin-temp-filter .admin-filter-active').removeClass('d-none').addClass("d-block");
            jQuery('.admin-temp-filter .admin-filter-inactive').removeClass('d-block').addClass("d-none");
          },
          templateListOrder: function(type) {
            var page_type = jQuery("input[name='status']:checked").val();
            if(type == 'az'){
              sessionStorage.setItem("templateListOrder", 'za');
              sortTemplateList(page_type, 'za');
            }
            else if(type == 'za'){
              sessionStorage.setItem("templateListOrder", 'az');
              sortTemplateList(page_type, 'az');
            }
          },
          templateAdinFilter: function(type) {
            if(jQuery.inArray('administrator', user_roles ) !== -1 || jQuery.inArray('advanced_content_creator', user_roles ) !== -1 || jQuery.inArray('enterprise', user_roles ) !== -1){
              var page_type = jQuery("input[name='status']:checked").val();
              if(type == 'active'){
                jQuery("#template-list-view-wrapper .item-group."+page_type+"-list-temp").each(function(n) {
                  var data_uid = parseInt(jQuery(this).attr("data-uid"));
                  if(data_uid == 1){
                    jQuery(this).addClass("d-none");
                  }
                });
                jQuery("#template-grid-view-wrapper .item-group."+page_type+"-temp").each(function(n) {
                  var data_uid = parseInt(jQuery(this).attr("data-uid"));
                  if(data_uid == 1){
                    jQuery(this).removeClass("d-block").addClass("d-none");
                  }
                });
                jQuery('.admin-temp-filter .admin-filter-active').removeClass('d-block').addClass("d-none");
                jQuery('.admin-temp-filter .admin-filter-inactive').removeClass('d-none').addClass("d-block");
              }
              else if(type == 'inactive'){
                jQuery("#template-list-view-wrapper .item-group."+page_type+"-list-temp").each(function(n) {
                  var data_uid = parseInt(jQuery(this).attr("data-uid"));
                  if(data_uid == 1){
                    jQuery(this).removeClass("d-none");
                  }
                });
                jQuery("#template-grid-view-wrapper .item-group."+page_type+"-temp").each(function(n) {
                  var data_uid = parseInt(jQuery(this).attr("data-uid"));
                  if(data_uid == 1){
                    jQuery(this).removeClass("d-none").addClass("d-block");
                  }
                });
                jQuery('.admin-temp-filter .admin-filter-active').removeClass('d-none').addClass("d-block");
                jQuery('.admin-temp-filter .admin-filter-inactive').removeClass('d-block').addClass("d-none");
              }
            }
          },
          searchTemplate: function() {
            var input, filter, list, b, l, i, txtValue, searchCount, tagsValue;
            var page_type = jQuery("input[name='status']:checked").val();
            input = document.getElementById("search-temp");
            filter = input.value.toUpperCase();
            list = document.getElementById("kmds-template-list");
            //list = document.getElementById("template-grid-view-wrapper");
            if(page_type == 'active'){
              l = list.getElementsByClassName('active-list-temp');
              b = list.getElementsByClassName('active-temp');
            }
            else if(page_type == 'inactive'){
              l = list.getElementsByClassName('inactive-list-temp');
              b = list.getElementsByClassName('inactive-temp');
            }
            else if(page_type == 'removal'){
              l = list.getElementsByClassName('removal-list-temp');
              b = list.getElementsByClassName('removal-temp');
            }
            searchCount = 0;
            for (i = 0; i < b.length; i++) {
              txtValue = b[i].getAttribute("data-temptitle");
              tagsValue = b[i].getAttribute("data-temptags");
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
              if(page_type == 'active'){
                if(jQuery('.list-style').hasClass('table-list-view')) {
                  getPagination("active-list-temp", searchCount);
                }
                else {
                  getPagination("active-temp", searchCount);
                }
              }
              else if(page_type == 'inactive'){
                if(jQuery('.list-style').hasClass('table-list-view')) {
                  getPagination("inactive-list-temp", searchCount);
                }
                else {
                  getPagination("inactive-temp", searchCount);
                }
              }
              else if(page_type == 'removal'){
                if(jQuery('.list-style').hasClass('table-list-view')) {
                  getPagination("removal-list-temp", searchCount);
                }
                else {
                  getPagination("removal-temp", searchCount);
                }
              }
            }
            for (i = 0; i < l.length; i++) {
              txtValue = l[i].getAttribute("data-temptitle");
              tagsValue = l[i].getAttribute("data-temptags");
              if (txtValue.toUpperCase().indexOf(filter) > -1 || tagsValue.toUpperCase().indexOf(filter) > -1) {
                l[i].classList.remove("d-none");
                l[i].classList.add("search-result");
                searchCount++;
              } else {
                l[i].classList.remove("d-flex");
                l[i].classList.remove("d-block");
                l[i].classList.remove("search-result");
                l[i].classList.add("d-none");
              }
            }
          },
          templateListStyle: function(type) {
            sessionStorage.setItem("templateListStyle", type);
            if(type == 'list'){
              jQuery('#template-list-view-wrapper').removeClass('d-none').addClass("d-block");
              jQuery('#template-grid-view-wrapper').removeClass('d-flex').addClass("d-none");
              jQuery('.list-style .list-view-inactive').removeClass('d-block').addClass("d-none");
              jQuery('.list-style .list-view-active').removeClass('d-none').addClass("d-block");
              jQuery('.grid-style .grid-view-active').removeClass('d-block').addClass("d-none");
              jQuery('.grid-style .grid-view-inactive').removeClass('d-none').addClass("d-bock");
              //jQuery('.list-order').addClass("disabled");
              jQuery('.list-style').addClass("table-list-view");
              //jQuery('.grid-view').removeClass('d-block').addClass("d-none");
              /*jQuery('.item-group').removeClass('grid-view').addClass("list-view flex-wrap");
              jQuery('.temp-content').addClass("flex-column");
              jQuery('.temp-action').addClass("flex-column");
              jQuery(".item-group img.static-image").each(function(n) {
                var img_width = jQuery(this).attr("width");
                var img_height = jQuery(this).attr("height");
                if(img_width != 'auto'){
                  jQuery(this).attr("width", 90);
                }
                else if(img_height != 'auto'){
                  jQuery(this).attr("height", 90);
                }
              });*/
            }
            else if(type == 'grid'){
              jQuery('#template-list-view-wrapper').removeClass('d-block').addClass("d-none");
              jQuery('#template-grid-view-wrapper').removeClass('d-none').addClass("d-flex");
              jQuery('.list-style .list-view-inactive').removeClass('d-none').addClass("d-block");
              jQuery('.list-style .list-view-active').removeClass('d-block').addClass("d-none");
              jQuery('.grid-style .grid-view-active').removeClass('d-none').addClass("d-block");
              jQuery('.grid-style .grid-view-inactive').removeClass('d-block').addClass("d-none");
              //jQuery('.list-order').removeClass('disabled');
              jQuery('.list-style').removeClass("table-list-view");
              //jQuery('.grid-view').removeClass('d-none').addClass("d-block");
              /*jQuery('.item-group').removeClass('list-view flex-wrap').addClass("grid-view");
              jQuery('.temp-content').removeClass("flex-column");
              jQuery('.temp-action').removeClass("flex-column");
              jQuery(".item-group img.static-image").each(function(n) {
                var img_width = jQuery(this).attr("width");
                var img_height = jQuery(this).attr("height");
                if(img_width != 'auto'){
                  jQuery(this).attr("width", 140);
                }
                else if(img_height != 'auto'){
                  jQuery(this).attr("height", 140);
                }
              });*/
            }
          },
          openStaticImage: function(src) {
            var wInnerHeight = window.innerHeight;
            var cheight = (window.innerHeight * 80/100);
            var cWidth = (window.innerWidth * 80/100);
            $('<div/>', {"class": "g-dialog-container kmds-static-image-modal d-block justify-content-center align-items-center visible"})
              .append($('<div/>', {"class": "g-dialog"})
                .append($('<div/>', {"class": "g-dialog-content"})
                  .append($('<div/>', {"class": "d-grid"})
                    .append($('<span/>', {"class": "d-block"})
                      .append($('<img class="temp-static-image" src="'+ src +'" />'))
                    )
                  )
                )
                .append($('<div/>', {"class": "g-dialog-footer"})
                  .append($('<a/>', {'class': 'close-modal', 'href': 'javascript:void(0);', text: 'X'}))
                )
              ).appendTo('#product-library');
            let img = new Image();
            img.onload = function() {
              if(img.width >= img.height){
                size1 = img.width;
                size2 = "auto";
                if(img.width > cWidth){
                  size1 = cWidth;
                  if(img.height > wInnerHeight){
                    size1 = wInnerHeight;
                  }
                }
              }
              else if(img.width < img.height){
                size1 = "auto";
                size2 = img.height;
                if(img.height > cheight){
                  size2 = cheight;
                }
              }
              jQuery("#product-library .temp-static-image").css("width", size1);
              jQuery("#product-library .temp-static-image").css("height", size2);
            }
            img.src = src;
          },
          getPageComponent: function(num, type) {
            var currentLi = jQuery(".current");
            var pageCount = Math.ceil(jQuery(".item-group."+type).length / pageSize);
            if(num == "Next"){
              var currentNum = parseInt(currentLi.attr("data-key"));
              num = currentNum + 1;
              if(num <= pageCount){
                currentLi.removeClass("current");
                jQuery('#page-'+num).addClass("current");
              }
              if(num >= pageCount){
                jQuery(".paginLi.next").removeClass("d-flex").addClass("d-none");
                jQuery(".paginLi.last").removeClass("d-flex").addClass("d-none");
              }
              jQuery(".paginLi.first").removeClass("d-none").addClass("d-flex");
              jQuery(".paginLi.prev").removeClass("d-none").addClass("d-flex");
            }
            else if(num == "Prev"){
              var currentNum = parseInt(currentLi.attr("data-key"));
              num = currentNum - 1;
              if(num >= 1){
                currentLi.removeClass("current");
                jQuery('#page-'+num).addClass("current");
              }
              jQuery(".paginLi.next").removeClass("d-none").addClass("d-flex");
              jQuery(".paginLi.last").removeClass("d-none").addClass("d-flex");
              if(num == 1){
                jQuery(".paginLi.first").removeClass("d-flex").addClass("d-none");
                jQuery(".paginLi.prev").removeClass("d-flex").addClass("d-none");
              }
            }
            else if(num == "First"){
              jQuery(".paginLi.first").removeClass("d-flex").addClass("d-none");
              jQuery(".paginLi.prev").removeClass("d-flex").addClass("d-none");
              jQuery(".paginLi.next").removeClass("d-none").addClass("d-flex");
              jQuery(".paginLi.last").removeClass("d-none").addClass("d-flex");
              jQuery("#pagin li a").removeClass("current");
              jQuery('#page-1').addClass("current");
              num = 1;
            }
            else if(num == "Last"){
              jQuery(".paginLi.next").removeClass("d-flex").addClass("d-none");
              jQuery(".paginLi.last").removeClass("d-flex").addClass("d-none");
              jQuery(".paginLi.first").removeClass("d-none").addClass("d-flex");
              jQuery(".paginLi.prev").removeClass("d-none").addClass("d-flex");
              var lastNum = parseInt(jQuery("#page-"+num).attr("data-key"));
              jQuery("#pagin li a").removeClass("current");
              jQuery('#page-'+lastNum).addClass("current");
              num = lastNum;
            }
            else {
              jQuery("#pagin li a").removeClass("current");
              jQuery('#page-'+num).addClass("current");
              if(num > 0){
                jQuery(".paginLi.first").removeClass("d-none").addClass("d-flex");
                jQuery(".paginLi.prev").removeClass("d-none").addClass("d-flex");
                jQuery(".paginLi.next").removeClass("d-none").addClass("d-flex");
                jQuery(".paginLi.last").removeClass("d-none").addClass("d-flex");
                if(num <= 1){
                  jQuery(".paginLi.first").removeClass("d-flex").addClass("d-none");
                  jQuery(".paginLi.prev").removeClass("d-flex").addClass("d-none");
                }
                if(num >= pageCount){
                  jQuery(".paginLi.next").removeClass("d-flex").addClass("d-none");
                  jQuery(".paginLi.last").removeClass("d-flex").addClass("d-none");
                }
              }
            }
            showPage(num, type);
          },
          handleSize: function(e) {
            var $this = jQuery(e.target);
            var src = $this.attr("src");
            var style = $this.attr("data-style");
            let img = new Image();
            img.src = src;
            if(style == 'grid') {
              var size1 = img.width >= img.height ? '140' : 'auto';
              var size2 = img.width < img.height ? '140' : 'auto';
            }
            else if(style == 'list'){
              var size1 = img.width >= img.height ? '48' : 'auto';
              var size2 = img.width < img.height ? '48' : 'auto';
            }
            $this.attr("width", size1);
            $this.attr("height", size2);
          },
					sortListColumn: function(e){
						var th = this;
						var t = e.target;
						var txt = jQuery(e.target).text();
            const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
            const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
              v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
              )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
						const table = t.closest('table');
						jQuery('#template-list-view-wrapper thead tr th').removeClass('bg-sort');
						jQuery('#template-list-view-wrapper thead tr th').removeClass('asc-icon');
						jQuery('#template-list-view-wrapper thead tr th').removeClass('desc-icon');
            if(t.asc){
              jQuery(t).removeClass("asc-icon");
              jQuery(t).addClass("desc-icon");
							jQuery(t).addClass("bg-sort");
            }else if(!t.asc){
              jQuery(t).removeClass("desc-icon");
              jQuery(t).addClass("asc-icon");
							jQuery(t).addClass("bg-sort");
            }else{
              jQuery(t).removeClass("desc-icon");
              jQuery(t).addClass("asc-icon");
							jQuery(t).addClass("bg-sort");
            }
            Array.from(table.querySelectorAll('tr.list-table-view'))
              .sort(comparer(Array.from(t.parentNode.children).indexOf(t), t.asc = !t.asc))
              .forEach(tr => table.appendChild(tr) );
            //adding class to sorted column
            jQuery('#template-list-view-wrapper td').removeClass('sorted');
            var ind = jQuery(t).index() + 1;
            jQuery('#library_list_view td:nth-child('+ind+')').addClass('sorted');
          },
          render: function() {
            // get hash value           
            var sourceURL = document.location.href;
            var hash = sourceURL.split("&hash=")[1];
            
            var type = this.state.p_type; 
            if(type.activeicon != 'null') {
              var ico = type.activeicon;
            } else {
              var ico = type.icon;
            }
            var default_static_image = type.icon;
            var hideAdminFilter = ' hide';
            if(jQuery.inArray('administrator', user_roles ) !== -1 || jQuery.inArray('advanced_content_creator', user_roles ) !== -1 || jQuery.inArray('enterprise', user_roles ) !== -1){
              hideAdminFilter = '';
            }
            var leftPanel = React.createElement("div", {className: 'col-3 left-side'}, React.createElement("div", {className: 'active-product-type', id: type.tid}, React.createElement("img", {src: ico, 'alt': type.name, 'title': type.name})),
            React.createElement("div", {className: 'text-white pl-4 mt-70'}, React.createElement("img", {src: '/themes/custom/kaboodlemedia/images/leftarrow.png', className: 'back-arrow'}, ''),
            React.createElement("u", null, React.createElement("a", {href: '/kmds/design/'+uid+'/'+media_term, className: 'text-white caps-on f-20 font-fjalla'}, 'Back To Product Groups'))) 
            );
            var searchPanel = React.createElement("div", {className: 'col-12 search-template-panel d-flex flex-row flex-wrap'},
              React.createElement("div", {className: 'search-form-icon flex-column'},
                React.createElement("img", {src: media_base_url+"/modules/custom/media_design_system/css/assets/img/search-676767-128px.png", className: 'search-icon', "width": "auto", "height": "15"}, '')
              ),
              React.createElement("div", {className: 'search-form flex-column'},
                React.createElement("input", {id: 'search-temp', placeholder: 'Search File', type: 'text', autoFocus: true, onKeyUp: this.searchTemplate.bind(null) }) //onKeyUp
              ),
              React.createElement("div", {className: 'grid-style flex-column'},
                React.createElement("img", {src: media_base_url+"/modules/custom/media_design_system/css/assets/img/gridviewactive.png", className: 'grid-view-active d-block', "width": "auto", "height": "32"}, ''),
                React.createElement("img", {src: media_base_url+"/modules/custom/media_design_system/css/assets/img/gridviewinactive.png", className: 'grid-view-inactive d-none', "width": "auto", "height": "32", onClick: this.templateListStyle.bind(null, 'grid')}, '')
              ),
              React.createElement("div", {className: 'list-style flex-column'},
                React.createElement("img", {src: media_base_url+"/modules/custom/media_design_system/css/assets/img/listviewactive.png", className: 'list-view-active d-none', "width": "auto", "height": "32"}, ''),
                React.createElement("img", {src: media_base_url+"/modules/custom/media_design_system/css/assets/img/listviewinactive.png", className: 'list-view-inactive d-block', "width": "auto", "height": "32", onClick: this.templateListStyle.bind(null, 'list')}, '')
              ),
              React.createElement("div", {className: 'list-order flex-column'},
                React.createElement("img", {src: media_base_url+"/modules/custom/media_design_system/css/assets/img/az-676767.png", className: 'az-list d-block', "width": "auto", "height": "32", onClick: this.templateListOrder.bind(null, 'az')}, ''),
                React.createElement("img", {src: media_base_url+"/modules/custom/media_design_system/css/assets/img/za-676767.png", className: 'za-list d-none', "width": "auto", "height": "32", onClick: this.templateListOrder.bind(null, 'za')}, '')
              ),
              React.createElement("div", {className: 'admin-temp-filter flex-column'+hideAdminFilter},
                React.createElement("img", {src: media_base_url+"/modules/custom/media_design_system/css/assets/img/logo-button-active.png", className: 'admin-filter-active d-block', "width": "auto", "height": "32", onClick: this.templateAdinFilter.bind(null, 'active')}, ''),
                React.createElement("img", {src: media_base_url+"/modules/custom/media_design_system/css/assets/img/logo-button-inactive.png", className: 'admin-filter-inactive d-none', "width": "auto", "height": "32", onClick: this.templateAdinFilter.bind(null, 'inactive')}, '')
              ),
              React.createElement("div", {className: 'list-active-inactive flex-column'},
                React.createElement("div", {className: 'list-active-template font-lato'},
                  React.createElement("input", {id: "active-templates", className: "template-status", type: "radio", name: "status", value: "active", ref: "status", defaultChecked: true, onClick: this.templateActiveInactive.bind(null, 'active')}),
                  React.createElement("label", {className: "radiob", htmlFor: "active-templates"},
                    React.createElement("span", {className: "radiob-span"})
                  ),
                  React.createElement("span", {className: "label-span"}, ' Active Templates')
                ),
                React.createElement("div", {className: 'list-inactive-template font-lato'},
                  React.createElement("input", {id: "inactive-templates", className: "template-status", type: "radio", name: "status", value: "inactive", ref: "status", onClick: this.templateActiveInactive.bind(null, 'inactive')}),
                  React.createElement("label", {className: "radiob", htmlFor: "inactive-templates"},
                    React.createElement("span", {className: "radiob-span"})
                  ),
                  React.createElement("span", {className: "label-span"}, ' Inactive Templates')
                )
              ),
              React.createElement("div", {className: 'list-removal flex-column'},
                React.createElement("div", {className: 'list-removal-template font-lato'},
                  React.createElement("input", {id: "removal-templates", className: "template-status", type: "radio", name: "status", value: "removal", ref: "status", onClick: this.templateActiveInactive.bind(null, 'removal')}),
                  React.createElement("label", {className: "radiob", htmlFor: "removal-templates"},
                    React.createElement("span", {className: "radiob-span"})
                  ),
                  React.createElement("span", {className: "label-span"}, ' Flagged for Removal')
                ),
              ),
            );
            /*if(selectedtid == 120){
              this.state.p_library.sort((a, b) => a.name.localeCompare(b.name));
              var paginKey = 1;
              var right_panel_items = this.state.p_library.map((rightitem, ikey) => {
               
                var icon = React.createElement("img", {src: rightitem.icon, className: 'product-lib-icon', 'alt': rightitem.name, 'title': rightitem.name});
                
                var favorite_inactive = 'inactive';
                if(rightitem.favorite == 1){
                  favorite_inactive = '';
                }
                var displayClass = (paginKey > pageSize) ? ' d-none' : ' d-flex';
                paginKey++;
                return React.createElement("div", {className: 'grid-view item-group p-3'+displayClass+' flex-column', 'data-key': ikey}, 
                  React.createElement("h5", {className: 'lib-title text-center'}, rightitem.name),
                  React.createElement("div", {className: 'd-flex'}, 
                    React.createElement("div", {className: 'item-left pr-3 pt-2'}, icon),
                    React.createElement("div", {className: 'item-right'}, rightitem.description),
                  )//,
                  //React.createElement('button', {type: 'button', className: 'icon-favo mt-auto '+favorite_inactive}, '')                
                );
              });
            } else {*/
              var paginKey = 1;
              this.state.p_templates.sort((a, b) => a.name.localeCompare(b.name));
              var right_panel_items = this.state.p_templates.map((rightitem, ikey) => {
                if(rightitem.type_tid == selectedtid){
                  var displayClass = ' d-none';
                  //if(paginKey < pageSize && rightitem.template_active == 1){
                  if(paginKey < pageSize){
                    if(rightitem.template_active == 1){
                      //var displayClass = (paginKey > pageSize) ? ' d-none' : ' d-flex';
                      if(rightitem.removal_active == null || rightitem.removal_active == 0){
                        displayClass = ' d-block';
                        paginKey = paginKey + 1;
                      }
                    }
                  }
                  //var static_image_src = (rightitem.static_image_url != null) ? rightitem.static_image_url : media_base_url+"/modules/custom/media_design_system/css/assets/img/desiner.png";
                  var static_image_src = (rightitem.static_image_url != null) ? rightitem.static_image_url : default_static_image;
                  //var template_active = (rightitem.template_active == null || rightitem.template_active == 0) ? " inactive-temp" : " active-temp";
                  var template_active = " active-temp";
                  if(rightitem.removal_active !== null && rightitem.removal_active == 1){
                    template_active = " removal-temp";
                  }
                  else if(rightitem.template_active == null || rightitem.template_active == 0){
                    template_active = " inactive-temp";
                  }
                  else if(rightitem.template_active !== null && rightitem.template_active == 1){
                    template_active = " active-temp";
                  }
                  //var template_tags = (rightitem.template_tags == null || rightitem.template_tags.length == 0) ? rightitem.name : rightitem.template_tags.join(", ");
                  var template_tags = rightitem.name;
                  if(rightitem.template_tags !== null){
                    if(jQuery.isArray(rightitem.template_tags) && rightitem.template_tags.length > 0){
                      template_tags = rightitem.template_tags.join(", ");
                    }
                    else {
                      template_tags = rightitem.template_tags;
                    }
                  }
                  var edit_icon = media_base_url+"/modules/custom/media_design_system/css/assets/img/pencil-512.png";
                  var magnify_icon = media_base_url+"/modules/custom/media_design_system/css/assets/img/expand-512-676767.png";
                  return React.createElement("div", {className: 'grid-view item-group'+displayClass+template_active+' flex-column', 'data-key': ikey, 'data-temptitle': rightitem.name, 'data-temptags': template_tags, 'data-uid': this.state.dataUID}, 

                    React.createElement("div", {className: 'temp-design'},
                      React.createElement("div", {className: 'template-static-image'},
                        React.createElement("a", {href: '/kmds/design/toolx?d='+rightitem._id, className: 'design-template-link'},
                          React.createElement("img", {src: static_image_src, className: 'lib-image text-center static-image', 'alt': rightitem.name, 'title': rightitem.name, 'width': size1, 'height': size2, 'data-style': 'grid', onLoad: this.handleSize.bind(this)})
                        )
                      )
                    ),
                    React.createElement("div", {className: 'temp-content p-3'}, 
                      React.createElement("a", {href: '/kmds/design/toolx?d='+rightitem._id, className: 'design-template-link'},
                        React.createElement("h5", {className: 'temp-title'}, rightitem.name)
                      ),
                      React.createElement("div", {className: 'temp-modified'},
                        React.createElement("div", {className: 'temp-created'}, 'Created '+convertDateFormat(rightitem.created_at)),
                        React.createElement("div", {className: 'temp-updated'}, 'Updated '+convertDateFormat(rightitem.modified)),
                      ),
                    ),
                    React.createElement("div", {className: 'temp-action d-flex'},
                      React.createElement("div", {className: 'temp-edit column flex-row'}, 
                        React.createElement("a", {href: '/kmds/design/toolx?d='+rightitem._id, className: 'design-template-link'},
                          React.createElement("img", {src: edit_icon, className: 'temp-edit-icon', 'alt': "Edit", 'title': "Edit", 'width': "auto", 'height': "20"})
                        )
                      ),
                      React.createElement("div", {className: 'temp-magnify column flex-row'}, 
                        React.createElement("a", {href: "javascript:void(0);", className: 'temp-magnify-link', onClick: this.openStaticImage.bind(null, static_image_src)},
                          React.createElement("img", {src: magnify_icon, className: 'temp-magnify-icon', 'alt': "View", 'title': "View", 'width': "auto", 'height': "20"})
                        )
                      ),
                    ),
                  );
                }
                var templateFilter = sessionStorage.getItem("templateFilter");
                var perfEntries = performance.getEntriesByType("navigation");
                if(templateFilter && perfEntries[0].type === "back_forward"){
                  renderListAfterBack(templateFilter);
                }
              });
            //}
            var paginLi = '';
            if(paginKey >= pageSize){
              var pageCount =  (paginKey / pageSize);
              var paginLiArray = ['First', 'Prev'];
              for(var i = 0 ; i<pageCount; i++){
                paginLiArray.push((i+1));
              }
              paginLiArray.push('Next');
              paginLiArray.push('Last');
              var paginLi = paginLiArray.map((num, nKey) => {
                var current = (nKey == 2) ? ' current' : '';
                var displayClass = (nKey > 4) ? ' d-none page-num' : ' d-flex page-num';
                //var displayClass = ' d-flex page-num';
                var numValue = nKey - 1;
                if(num == 'Prev'){
                  displayClass = ' d-none prev page-action';
                  numValue = 1;
                }
                else if(num == 'First'){
                  displayClass = ' d-none first page-action';
                  numValue = 1;
                }
                else if(num == 'Next'){
                  displayClass = ' d-flex next page-action';
                  numValue = 2;
                }
                else if(num == 'Last'){
                  displayClass = ' d-flex last page-action';
                  numValue = (paginLiArray.length-4);
                }
                return React.createElement("li", {className: 'paginLi'+displayClass},
                  React.createElement("a", {href: 'javascript:void(0)', className: 'paginLi-link'+current, 'data-key': numValue, id: 'page-'+num, onClick: this.getPageComponent.bind(null, num, 'active-temp')},
                    React.createElement("span", {className: 'paginLiNum'}, num),
                  )
                );
              });
            }
            
          //List view in table START
            var table_head = React.createElement('thead',{},
              React.createElement('tr', {className: 'item-group list-table-head'},
                React.createElement('th', null, ),
                React.createElement('th', {className: 'bg-sort asc-icon sortempty media-title', onClick: this.sortListColumn.bind(this), style:{'width':'50%'}}, 'Title'),
                React.createElement('th', {className: 'sortempty media-f-name', onClick: this.sortListColumn.bind(this), style:{'width':'20%'}}, 'Created'),
                React.createElement('th', {className: 'sortempty media-format', onClick: this.sortListColumn.bind(this), style:{'width':'20%'}}, 'Updated'),
                React.createElement('th', {className: 'media-action text-center media-fav'}, 'ACTIONS'),
              )
            );
            var paginKey = 1;
            this.state.p_templates.sort((a, b) => a.name.localeCompare(b.name));
            var items = this.state.p_templates.map((rightitem, ikey) => {
              if(rightitem.type_tid == selectedtid){
                var displayClass = ' d-none';
                if(paginKey < pageSize && rightitem.template_active == 1){
                  //var displayClass = (paginKey > pageSize) ? ' d-none' : ' d-flex';
                  if(rightitem.removal_active == null || rightitem.removal_active == 0){
                    displayClass = '';
                    paginKey = paginKey + 1;
                  }
                }
                var static_image_src = (rightitem.static_image_url != null) ? rightitem.static_image_url : default_static_image;
                var list_temp_active = " active-list-temp";
                if(rightitem.removal_active !== null && rightitem.removal_active == 1){
                  list_temp_active = " removal-list-temp"
                }
                else if(rightitem.template_active == null || rightitem.template_active == 0){
                  list_temp_active = " inactive-list-temp"
                }
                else if(rightitem.template_active !== null && rightitem.template_active == 1){
                  list_temp_active = " active-list-temp"
                }
                //var template_tags = (rightitem.template_tags == null || rightitem.template_tags.length == 0) ? rightitem.name : rightitem.template_tags.join(", ");
                var template_tags = rightitem.name;
                if(rightitem.template_tags !== null){
                  if(jQuery.isArray(rightitem.template_tags) && rightitem.template_tags.length > 0){
                    template_tags = rightitem.template_tags.join(", ");
                  }
                  else {
                    template_tags = rightitem.template_tags;
                  }
                }
                var edit_icon = media_base_url+"/modules/custom/media_design_system/css/assets/img/pencil-512.png";
                var magnify_icon = media_base_url+"/modules/custom/media_design_system/css/assets/img/expand-512-676767.png";
                return React.createElement("tr", {className: 'list-table-view item-group media-row'+list_temp_active+displayClass, 'data-key': ikey, 'data-temptitle': rightitem.name, 'data-temptags': template_tags, 'data-uid': this.state.dataUID}, 
                  React.createElement("td", {className: 'temp-design media-data text-center'},
                    React.createElement("div", {className: 'template-static-image'},
                      React.createElement("a", {href: '/kmds/design/toolx?d='+rightitem._id, className: 'design-template-link'},
                        React.createElement("img", {src: static_image_src, className: 'lib-title text-center static-image', 'alt': rightitem.name, 'title': rightitem.name, 'width': size1, 'height': size2, 'data-style': 'list', onLoad: this.handleSize.bind(this)})
                      )
                    )
                  ),
                  React.createElement("td", {className: 'temp-content media-data sorted'}, 
                    React.createElement("a", {href: '/kmds/design/toolx?d='+rightitem._id, className: 'design-template-link'},
                      React.createElement("h5", {className: 'temp-title'}, rightitem.name)
                    ),
                  ),
                  React.createElement("td", {className: 'temp-modified media-data text-center'},
                    React.createElement("div", {className: 'temp-created'}, convertDateFormat(rightitem.created_at)),
                  ),
                  React.createElement("td", {className: 'temp-modified media-data text-center'},
                    React.createElement("div", {className: 'temp-updated'}, convertDateFormat(rightitem.modified)),
                  ),
                  React.createElement("td", {className: 'temp-action media-data text-center'},
                    React.createElement('ul', {},
                      React.createElement('li', {},
                        React.createElement('a', {href: '/kmds/design/toolx?d='+rightitem._id, className: 'media-edit audio-round-button'}, ''),
                      ),
                      React.createElement('li', {},
                        React.createElement('a', {href: "javascript:void(0);", className: 'temp-magnify-link audio-round-button', onClick: this.openStaticImage.bind(null, static_image_src)}, ''),
                      ),
                    )
                  ),
                );
              }
            });

            var table_body = React.createElement('tbody', {id: 'lightgallery'}, items);
            var table_data = React.createElement('table',{id: 'library_list_view', className: 'media-table'}, table_head, table_body);
          //List view in table END
            var rightPanel = React.createElement("div", {className: 'col-9 d-flex flex-row flex-wrap', id: 'kmds-template-list'}, searchPanel,
              React.createElement("div", {id: 'template-grid-view-wrapper', className: 'col-12 d-flex flex-row flex-wrap temp-grid-view'},
                right_panel_items,
              ),
              React.createElement("div", {id: 'template-list-view-wrapper', className: 'col-12 temp-list-view text-center d-none'},
                React.createElement("div", {className: 'template-list-table-view text-center'}, table_data),
              ),
              React.createElement("div", {className: 'col-12  d-flex flex-row flex-wrap text-center'},
                React.createElement("ul", {className: 'paginatiion d-flex', id: "pagin"}, paginLi),
              ),
            );
            //var temp_list_table = React.createElement("div", {className: 'temp-list-table text-center'}, table_data);
            return ( React.createElement("div", {className: 'row'}, leftPanel, rightPanel));
          }
        });

        React.render(
          React.createElement(AppProductsLibrary, 'div',{className:'x2'}), document.querySelector("#product-library"));
      }
      $("#product-library").on('click','.g-dialog-footer',function () {
        jQuery("#product-library .g-dialog-container.visible").remove();
      });
      /*$(window).on('load', function(){
        sortTemplateList('active', 'az');
        console.log('componentDidMount 4');
      });*/
    }
  }
})(jQuery, Drupal, drupalSettings);
/**
 * Callback function slide()
 * to show hide the pagin number
 **/
var slide = function(startPage, type, searchCount = null){
  var incremSlide = parseInt(startPage + 3);
  var pageCount =  jQuery(".item-group."+type).length / pageSize;
  if(searchCount != null){
    pageCount =  jQuery(".item-group."+type+".search-result").length / pageSize;
  }
  pageCount = Math.ceil(pageCount);
  incremSlide = (incremSlide > pageCount) ? parseInt(pageCount+1) : incremSlide;
  //console.log("pageCount = "+pageCount);
  var totalSlidepPage = Math.floor(pageCount / incremSlide);
  jQuery("#pagin li.page-num").removeClass("d-flex").addClass("d-none");
  if(pageCount <= 3){
    startPage = 1;
    incremSlide = parseInt(pageCount+1);
  }
  else if(startPage > parseInt(pageCount-2)){
    startPage = parseInt(pageCount-2);
  }
  for(t=startPage; t<incremSlide; t++){
    //console.log("t = "+t);
    jQuery("#pagin li").eq(t+1).removeClass("d-none").addClass("d-flex");
  }

}
/**
 * Callback function showPage()
 * to show the page items
 **/
var showPage = function(page, type, searchCount = null) {
  //console.log("page = "+page);
  if(searchCount != null){
    var pageCount =  jQuery(".item-group."+type+".search-result").length / pageSize;
    if(page >= 1 && page <= Math.ceil(pageCount)) {
      jQuery(".item-group."+type+".search-result").removeClass("d-block").addClass("d-none");
      jQuery(".item-group."+type+".search-result").each(function(n) {
        if (n >= pageSize * (page - 1) && n < pageSize * page) {
          jQuery(this).removeClass("d-none").addClass("d-block");
        }
      });
      slide(page, type, searchCount)
    }
  }
  else {
    var pageCount =  jQuery(".item-group."+type).length / pageSize;
    if(page >= 1 && page <= Math.ceil(pageCount)) {
      jQuery(".item-group."+type).removeClass("d-block").addClass("d-none");
      jQuery(".item-group."+type).each(function(n) {
        if (n >= pageSize * (page - 1) && n < pageSize * page) {
          jQuery(this).removeClass("d-none").addClass("d-block");
        }
      });
      slide(page, type)
    }
  }
}
/**
 * Callback function closeStaticImage()
 * to show the close Static Image
 * modal window
 **/
var closeStaticImage = function(){
  jQuery("#product-library .g-dialog-container.visible").remove();
}
/**
 * Callback function getPageComponent()
 * to show the pagination
 **/
var getPageComponent = function(num, type, searchCount = null) {
  var currentLi = jQuery(".current");
  var pageCount = Math.ceil(jQuery(".item-group."+type).length / pageSize);
  if(searchCount != null){
    pageCount = Math.ceil(jQuery(".item-group."+type+".search-result").length / pageSize);
  }
  if(num == "Next"){
    var currentNum = parseInt(currentLi.attr("data-key"));
    num = currentNum + 1;
    if(num <= pageCount){
      currentLi.removeClass("current");
      jQuery('#page-'+num).addClass("current");
    }
    if(num >= pageCount){
      jQuery(".paginLi.next").removeClass("d-flex").addClass("d-none");
      jQuery(".paginLi.last").removeClass("d-flex").addClass("d-none");
    }
    jQuery(".paginLi.first").removeClass("d-none").addClass("d-flex");
    jQuery(".paginLi.prev").removeClass("d-none").addClass("d-flex");
  }
  else if(num == "Prev"){
    var currentNum = parseInt(currentLi.attr("data-key"));
    num = currentNum - 1;
    if(num >= 1){
      currentLi.removeClass("current");
      jQuery('#page-'+num).addClass("current");
    }
    jQuery(".paginLi.next").removeClass("d-none").addClass("d-flex");
    jQuery(".paginLi.last").removeClass("d-none").addClass("d-flex");
    if(num == 1){
      jQuery(".paginLi.first").removeClass("d-flex").addClass("d-none");
      jQuery(".paginLi.prev").removeClass("d-flex").addClass("d-none");
    }
  }
  else if(num == "First"){
    jQuery(".paginLi.first").removeClass("d-flex").addClass("d-none");
    jQuery(".paginLi.prev").removeClass("d-flex").addClass("d-none");
    jQuery(".paginLi.next").removeClass("d-none").addClass("d-flex");
    jQuery(".paginLi.last").removeClass("d-none").addClass("d-flex");
    jQuery("#pagin li a").removeClass("current");
    jQuery('#page-1').addClass("current");
    num = 1;
  }
  else if(num == "Last"){
    jQuery(".paginLi.next").removeClass("d-flex").addClass("d-none");
    jQuery(".paginLi.last").removeClass("d-flex").addClass("d-none");
    jQuery(".paginLi.first").removeClass("d-none").addClass("d-flex");
    jQuery(".paginLi.prev").removeClass("d-none").addClass("d-flex");
    var lastNum = parseInt(jQuery("#page-"+num).attr("data-key"));
    jQuery("#pagin li a").removeClass("current");
    jQuery('#page-'+lastNum).addClass("current");
    num = lastNum;
  }
  else {
    jQuery("#pagin li a").removeClass("current");
    jQuery('#page-'+num).addClass("current");
    if(num > 0){
      jQuery(".paginLi.first").removeClass("d-none").addClass("d-flex");
      jQuery(".paginLi.prev").removeClass("d-none").addClass("d-flex");
      jQuery(".paginLi.next").removeClass("d-none").addClass("d-flex");
      jQuery(".paginLi.last").removeClass("d-none").addClass("d-flex");
      if(num <= 1){
        jQuery(".paginLi.first").removeClass("d-flex").addClass("d-none");
        jQuery(".paginLi.prev").removeClass("d-flex").addClass("d-none");
      }
      if(num >= pageCount){
        jQuery(".paginLi.next").removeClass("d-flex").addClass("d-none");
        jQuery(".paginLi.last").removeClass("d-flex").addClass("d-none");
      }
    }
  }
  showPage(num, type, searchCount);
}
/**
 * Callback function getPagination()
 * to add the pagination
 **/
var getPagination = function(page_type, searchCount = null) {
  var paginKey = jQuery("."+page_type).length;
  if(searchCount != null){
    paginKey = searchCount;
  }
  if(paginKey >= pageSize){
    if(searchCount != null){
      jQuery("."+page_type+".search-result").each(function(n) {
        if (n < pageSize) {
          if(jQuery('.list-style').hasClass('table-list-view')) {
            jQuery(this).removeClass("d-none");
          }
          else {
            jQuery(this).removeClass("d-none").addClass("d-block");
          }
        }
        else {
          if(jQuery('.list-style').hasClass('table-list-view')) {
            jQuery(this).addClass("d-none");
          }
          else {
            jQuery(this).removeClass("d-block").addClass("d-none");
          }
        }
      });
    }
    var pageCount =  (paginKey / pageSize);
    var paginLiArray = ['First', 'Prev'];
    for(var i = 0 ; i<pageCount; i++){
      paginLiArray.push((i+1));
    }
    paginLiArray.push('Next');
    paginLiArray.push('Last');
    var output = "";
    var paginLi = paginLiArray.map((num, nKey) => {
      var current = (nKey == 2) ? ' current' : '';
      var displayClass = (nKey > 4) ? ' d-none page-num' : ' d-flex page-num';
      //var displayClass = ' d-flex page-num';
      var numValue = nKey - 1;
      if(num == 'Prev'){
        displayClass = ' d-none prev page-action';
        numValue = 1;
      }
      else if(num == 'First'){
        displayClass = ' d-none first page-action';
        numValue = 1;
      }
      else if(num == 'Next'){
        displayClass = ' d-flex next page-action';
        numValue = 2;
      }
      else if(num == 'Last'){
        displayClass = ' d-flex last page-action';
        numValue = (paginLiArray.length-4);
      }
      if(jQuery.isNumeric(num)){
        output += '<li class="paginLi'+displayClass+'"><a href="javascript:void(0)" class="paginLi-link'+current+'" data-key="'+numValue+'" id="page-'+num+'" onClick="getPageComponent('+num+', \''+page_type+'\', '+searchCount+')"><span class="paginLiNum">'+num+'</span></a></li>';
      }
      else {
        output += '<li class="paginLi'+displayClass+'"><a href="javascript:void(0)" class="paginLi-link'+current+'" data-key="'+numValue+'" id="page-'+num+'" onClick="getPageComponent(\''+num+'\', \''+page_type+'\', '+searchCount+')"><span class="paginLiNum">'+num+'</span></a></li>';
      }
    });
  }
  jQuery(".paginatiion").empty();
  jQuery(".paginatiion").append(output);
}
/**
 * Callback function sortTemplateList()
 * to add the pagination
 **/
var sortTemplateList = function(page_type, order) {
  if(order == 'az'){
    jQuery('.list-order .az-list').removeClass('d-none').addClass("d-block");
    jQuery('.list-order .za-list').removeClass('d-block').addClass("d-none");
  }
  else if(order == 'za'){
    jQuery('.list-order .az-list').removeClass('d-block').addClass("d-none");
    jQuery('.list-order .za-list').removeClass('d-none').addClass("d-block");
  }
  console.log("page_type = "+page_type);
  console.log("order = "+order);
  var list, i, switching, b, shouldSwitch;
  list = document.getElementById("kmds-template-list");
  switching = true;
  while (switching) {
    switching = false;
    if(page_type == 'active'){
      b = list.getElementsByClassName('active-temp');
    }
    else if(page_type == 'inactive'){
      b = list.getElementsByClassName('inactive-temp');
    }
    else if(page_type == 'removal'){
      b = list.getElementsByClassName('removal-temp');
    }
    for (i = 0; i < (b.length - 1); i++) {
      shouldSwitch = false;
      if(order == 'az'){
        if (b[i].getAttribute("data-temptitle").toLowerCase() > b[i + 1].getAttribute("data-temptitle").toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
      else if(order == 'za'){
        if (b[i].getAttribute("data-temptitle").toLowerCase() < b[i + 1].getAttribute("data-temptitle").toLowerCase()) {
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
  sortTemplateTableList(page_type, order);
}
/**
 * Callback function sortTemplateTableList()
 * to add the pagination
 **/
var sortTemplateTableList = function(page_type, order) {
  var tables, rows, switching, i, x, y, shouldSwitch;
  tables = document.getElementById("library_list_view");
  switching = true;
  while (switching) {
    switching = false;
    rows = tables.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByClassName("temp-title")[0];
      y = rows[i + 1].getElementsByClassName("temp-title")[0];
      if(order == 'az'){
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
      else if(order == 'za'){
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}
/**
 * Callback function convertDateFormat()
 * to add the pagination
 **/
var convertDateFormat = function(date_data) {
  var todayDate = new Date(date_data);
  var format = "AM";
  var hour = todayDate.getHours();
  var min = todayDate.getMinutes();
  if(hour > 11){format = "PM";}
  if (hour > 12) { hour = hour - 12; }
  if (hour == 0) { hour = 12; }  
  if (min < 10){min = "0" + min;}
  var final_date = todayDate.getMonth()+1 + "/" + todayDate.getDate() + "/" +  todayDate.getFullYear().toString().substr(-2)+" "+hour+":"+min+" "+format;
  return final_date;
}
/**
 * Callback function renderListAfterBack()
 * to render temp list after back button
 **/
var renderListAfterBack = function(type) {
  if(type == 'active'){
    jQuery('.inactive-list-temp').addClass("d-none");
    jQuery('.removal-list-temp').addClass("d-none");
    jQuery(".active-list-temp").each(function(n) {
      if (n < pageSize) {
        jQuery(this).removeClass("d-none");
      }
    });
    jQuery('.inactive-temp').removeClass('d-block').addClass("d-none");
    jQuery('.removal-temp').removeClass('d-block').addClass("d-none");
    jQuery(".active-temp").each(function(n) {
      if (n < pageSize) {
        jQuery(this).removeClass("d-none").addClass("d-block");
      }
    });
    getPagination("active-temp");
  }
  else if(type == 'inactive'){
    jQuery('.active-list-temp').addClass("d-none");
    jQuery('.removal-list-temp').addClass("d-none");
    jQuery(".inactive-list-temp").each(function(n) {
      if (n < pageSize) {
        jQuery(this).removeClass("d-none");
      }
    });
    jQuery('.active-temp').removeClass('d-block').addClass("d-none");
    jQuery('.removal-temp').removeClass('d-block').addClass("d-none");
    jQuery(".inactive-temp").each(function(n) {
      if (n < pageSize) {
        jQuery(this).removeClass("d-none").addClass("d-block");
      }
    });
    getPagination("inactive-temp");
  }
  else if(type == 'removal'){
    jQuery('.active-list-temp').addClass("d-none");
    jQuery('.inactive-list-temp').addClass("d-none");
    jQuery(".removal-list-temp").each(function(n) {
      if (n < pageSize) {
        jQuery(this).removeClass("d-none");
      }
    });
    jQuery('.active-temp').removeClass('d-block').addClass("d-none");
    jQuery('.inactive-temp').removeClass('d-block').addClass("d-none");
    jQuery(".removal-temp").each(function(n) {
      if (n < pageSize) {
        jQuery(this).removeClass("d-none").addClass("d-block");
      }
    });
    getPagination("removal-temp");
  }
  var templateListOrder = sessionStorage.getItem("templateListOrder");
  sortTemplateList(type, templateListOrder);
  jQuery('.admin-temp-filter .admin-filter-active').removeClass('d-none').addClass("d-block");
  jQuery('.admin-temp-filter .admin-filter-inactive').removeClass('d-block').addClass("d-none");
  //list style
  var templateListStyle = sessionStorage.getItem("templateListStyle");
  if(templateListStyle == 'list'){
    jQuery('#template-list-view-wrapper').removeClass('d-none').addClass("d-block");
    jQuery('#template-grid-view-wrapper').removeClass('d-flex').addClass("d-none");
    jQuery('.list-style .list-view-inactive').removeClass('d-block').addClass("d-none");
    jQuery('.list-style .list-view-active').removeClass('d-none').addClass("d-block");
    jQuery('.grid-style .grid-view-active').removeClass('d-block').addClass("d-none");
    jQuery('.grid-style .grid-view-inactive').removeClass('d-none').addClass("d-bock");
    jQuery('.list-style').addClass("table-list-view");
  }
  else if(templateListStyle == 'grid'){
    jQuery('#template-list-view-wrapper').removeClass('d-block').addClass("d-none");
    jQuery('#template-grid-view-wrapper').removeClass('d-none').addClass("d-flex");
    jQuery('.list-style .list-view-inactive').removeClass('d-none').addClass("d-block");
    jQuery('.list-style .list-view-active').removeClass('d-block').addClass("d-none");
    jQuery('.grid-style .grid-view-active').removeClass('d-none').addClass("d-block");
    jQuery('.grid-style .grid-view-inactive').removeClass('d-block').addClass("d-none");
    jQuery('.list-style').removeClass("table-list-view");
  }
}