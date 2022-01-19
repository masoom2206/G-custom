(function ($, Drupal, drupalSettings) {
  var initialized;
  Drupal.behaviors.DesignBehavior = {
    attach: function (context, settings) {
      if (!initialized) {
        initialized = true;
        var media_base_url = drupalSettings.media_base_url;
        var use_in_kmds = drupalSettings.use_in_kmds;
        var media_term = drupalSettings.media_term;
        var media_term_name = drupalSettings.media_term_name;
        var uid = drupalSettings.uid;

        var product_group_url = media_base_url+"/kmds/product-group?_format=json";
        
        var AppCleanURL = React.createClass({
          getInitialState: function() {
            return {
              CleanURL: '',
            }
          },
          componentWillMount: function() {
            var th = this;
            document.addEventListener('load', th.cleanParam.bind());
          },
          cleanParam: function(key){
            var th = this;
            var sourceURL = this.props.sourceURL;
            var rtn = sourceURL.split("=")[0],
            param,
            params_arr = [],
            params_arr_tt = [],
            queryString = (sourceURL.indexOf("=") !== -1) ? sourceURL.split("=")[1] : "";
            if (queryString[1] !== "") {
              params_arr = queryString.split(" ");
              for (var i = params_arr.length - 1; i >= 0; i -= 1) {
                 var tt = params_arr.join("-");
              }                
              rtn = rtn + "=" + tt;
            }
            //th.setState({CleanURL: rtn});
            th.setState({CleanURL: sourceURL});
            return rtn;
          },
          render: function() {
            return React.createElement("a", {className: 'product-a', id: this.props.tid, href: this.state.CleanURL, onLoad: this.cleanParam.bind('type')}, React.createElement("img", {src: this.props.icon, className: 'product-icon', 'alt': this.props.name, 'title': this.props.name}));
            //return React.createElement("a", {className: 'product-a', id: this.props.tid, href: this.state.CleanURL+'&hash=#'+this.props.group+'-content', onLoad: this.cleanParam.bind('type')}, React.createElement("img", {src: this.props.icon, className: 'product-icon', 'alt': this.props.name, 'title': this.props.name}));
          },
        });
        
        var AppProducts = React.createClass({
          getInitialState: function() {
            return {
              p_groups: [],  
              p_types: [],
            }
          },
          componentWillMount: function() {
            var th = this;            
            this.serverRequest = axios.get(product_group_url)
              .then(function(response) {
                return response.data;
              })
              .then(function(data) {
                th.setState({p_groups: data});
                return Promise.all(data.map( (record, index) => {  
                  var tid = record.tid;
                  return axios.get(media_base_url+'/kmds/product-type/'+tid+'?_format=json');
                }))
              })
              .then(function(responsex) {
                th.setState({p_types: responsex});
              });
            document.addEventListener('load', th.navUpdate.bind());    
          },
          componentWillUnmount: function() {
            this.serverRequest.abort();
          },          
          navUpdate: function(e){
            e.preventDefault();
            var k = jQuery(e.target).closest('.tab-pane').attr('data-key');
            if(k == 0){
              var eid = jQuery(e.target).closest('.tab-pane').attr('id');
              var id = (eid).split('-');
              var tabid = id[0];
              if(window.location.hash == 'undefined' || window.location.hash == ''|| window.location.hash == '#222-content') {
                jQuery(e.target).closest('.tab-pane').addClass('show active');
              } else {
                jQuery('#product-groups-tabs a[href="' + window.location.hash + '"]').tab('show');
              }
            }
            if(media_term != 0) {
              jQuery('#product-groups-tabs a[href="#' + media_term + '-content"]').tab('show');
            }
            /*jQuery("#product-groups-tabs a").click(function(){
              e.preventDefault();
              jQuery(".design-tool-link").removeClass('hide');
              var pro_id = jQuery(this).attr('id');
              var pro_id_exp = pro_id.split("-");
              jQuery(".design-tool-link").attr('href', '/kmds/design/toolx?template='+pro_id_exp[0]);
            });*/
          },
          productTypeList: function(e){
            var tid = jQuery(e.target).attr('data-tid');
            var productTypeName = jQuery(e.target).text();
            //jQuery('.design-product-type-name').text(productTypeName+" Product Type");
            //jQuery('.design-product-type-name').removeClass('hide');
            //window.location.href = '/kmds/design/group/'+uid+'/'+tid;
            //console.log("tid = "+tid);
          },
          render: function() {
            //set state in alphabetically
            this.state.p_groups.sort((a, b) => a.name.localeCompare(b.name));
            var left_panel_items = this.state.p_groups.map((leftitem, lkey) => {
              
              /*if(lkey == 0) {
                var active_class = 'active';
                var aria_selected = true;
              } else {
                var active_class = '';
                var aria_selected = false;
              }*/
              //Updated by SMH, task 5778
              var active_class = '';
              var aria_selected = false;
              
              //return React.createElement("a", {className: 'nav-link text-white caps-on f-24 kmds-lato '+active_class, id: leftitem.tid+'-tab', 'data-toggle': 'pill', href:'#'+leftitem.tid+'-content', 'role': 'tab', 'aria-controls': leftitem.tid+'-content', 'aria-selected': aria_selected, 'data-tid': leftitem.tid, onClick: this.productTypeList.bind(this)}, leftitem.name);
              return React.createElement("a", {className: 'nav-link text-white caps-on f-24 kmds-lato '+active_class, id: leftitem.tid+'-tab' , href:'/kmds/design/group/'+uid+'/'+leftitem.tid, 'data-tid': leftitem.tid, onClick: this.productTypeList.bind(this)}, leftitem.name);
            });
            
            var right_panel_items = this.state.p_types.map((rightitem, ikey) => {
              var myArray = rightitem.data;
              var groups = {};
              for (var i = 0; i < myArray.length; i++) {
                var groupName = myArray[i].group;
                if (!groups[groupName]) {
                  groups[groupName] = [];
                }
                groups[groupName].push({name: myArray[i].name, tid: myArray[i].tid, icon: myArray[i].icon});
              }
              myArray = [];
              for (groupName in groups) {
                myArray.push({group: groupName, items: groups[groupName]});
              }
              
              return myArray.map((childitem, index) => { 
                childitem.items.sort((a, b) => a.name.localeCompare(b.name));
                var icon = childitem.items.map((nitem, nkey) => {
                  // canvas product type template
                  var product_type_source_url = '/kmds/design/'+uid+'/'+childitem.group+'/'+nitem.tid;
                  // web product type template
                  if(childitem.group == 225 || childitem.group == 222) {
                    product_type_source_url = '/kmds/design/web/'+uid+'/'+childitem.group+'/'+nitem.tid;
                  }
                  var productTypeIcon = React.createElement(AppCleanURL, {tid: nitem.tid, name: nitem.name, icon: nitem.icon, group: childitem.group, sourceURL: product_type_source_url});
                  
                  return productTypeIcon;
                });
                var hide_product = ' hide';
                if(media_term == childitem.group){
                  hide_product = '';
                }
                return React.createElement("div", {className: 'products-list'+hide_product, 'data-key': ikey, id: childitem.group, onLoad: this.navUpdate.bind(this)}, icon);
                //return React.createElement("div", {className: 'tab-pane fade', 'data-key': ikey, id: childitem.group+'-content', 'role': 'tabpanel', 'aria-labelledby': childitem.group+'-tab', onLoad: this.navUpdate.bind(this)}, icon);
              });
            });
            //Added By SMH task 5778
            var hide_element = '';
            if(media_term == 0) {
              var media_message = React.createElement("div", {className: 'kmds-design-message'}, 'Please select a product group to begin.');
              var right_empty_items = React.createElement("div", {className: 'tab-pane fade active show', 'data-key': 0, id: '0-content', 'role': 'tabpanel', 'aria-labelledby': '0-tab'}, media_message);
              right_panel_items.unshift(right_empty_items);
              hide_element = 'hide';
            }
            
            // canvas product template
            var new_template_href = '/kmds/design/toolx?template='+media_term;
            // web product template
            if(media_term == 225){
              new_template_href = '/kmds/design/web?template='+media_term;
            }
            
            var create_new_temp = React.createElement("div", {className: 'text-white pl-3 kmds-new-temp-link'}, React.createElement("a", {href: new_template_href, className: 'design-tool-link text-white caps-on font-fjalla '+hide_element+' '}, 'Create New Template'));
            right_panel_items.unshift(create_new_temp);
            var product_type_name = React.createElement("div", {className: 'kmds-product-title'}, React.createElement("h2", {className: 'design-product-type-name caps-on font-fjalla '+hide_element+' '}, media_term_name+' Product Type'));
            right_panel_items.unshift(product_type_name);
            // task 5778 END
            var leftPanel = React.createElement("div", {className: 'col-3 left-side'},
              React.createElement("h2", {className: 'lato-light caps-on f-24 text-white'}, 'Product Group'),            
              React.createElement("div", {className: 'nav flex-column nav-pills', id: "product-groups-tabs", 'role': 'tablist', 'aria-orientation': 'vertical'}, left_panel_items),
              //New button to redirect at design page
              //React.createElement("div", {className: 'text-white pl-3 mt-38'}, React.createElement("a", {href: '/kmds/design/toolx?template='+media_term, className: 'design-tool-link text-white caps-on font-fjalla '+hide_element+' '}, 'Create New Template'));
            );
            var rightPanel = React.createElement("div", {className: 'col-9'}, React.createElement("div", {className: 'tab-content', id: "product-types-tabContent"}, right_panel_items ));
                          
            return ( React.createElement("div", {className: 'row h-100'}, leftPanel, rightPanel));
          }
        });
        
        React.render(
          React.createElement(AppProducts, 'div',{className:'x2'}), document.querySelector("#products-container"));                  
                                  
      }
    }
  }
})(jQuery, Drupal, drupalSettings);