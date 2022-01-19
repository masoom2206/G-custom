var AppText = React.createClass({
  getInitialState: function() {
    return {
      texts: [],
      showModal: false,
      singlecheckText: false,
      showTextModal: false,
      fileType: '',
      mid: '',
      textFileURL: '',
      base_url: '',
      row_id: '',
      delete_modal_msg: '',
      spinner_status: false,
    }
  },
  componentWillMount: function() {
    var th = this;      
    this.serverRequest = 
      axios.get(this.props.source)
        .then(function(result) {    
            return result.data.field_vault_file;
        })
        .then(function(response) {
          return Promise.all(response.map( (record, index) => {
            return axios.get(th.props.base_url+'/media/'+record.target_id+'/edit?_format=json');
          }))
        })
        .then(function(responsex) {
          th.setState({texts: responsex});
        });
  },
  componentDidMount: function(){
  },
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  UpdateMethod: function() {
    var th = this;
    jQuery('table#table-text-'+th.props.options.element_id+' tfoot').empty();
    jQuery('table#table-text-'+th.props.options.element_id+' tbody').removeClass('d-none');
    jQuery('table#table-text-'+th.props.options.element_id+' tbody tr').show();
    jQuery('table#table-text-'+th.props.options.element_id+' thead tr th').removeClass('bg-sort');
    jQuery('table#table-text-'+th.props.options.element_id+' tbody tr td').removeClass('sorted');
    //Force a render with a simulated state change
    this.serverRequest = 
      axios.get(this.props.source)
        .then(function(result) { 
          return result.data.field_vault_file;                   
        })
        .then(function(response) {
           return Promise.all(response.map( (record, index) => {
             return axios.get(th.props.base_url+'/media/'+record.target_id+'/edit?_format=json');
           }))
        })
        .then(function(responsex) {
          th.setState({texts: responsex}); 
          th.setState({spinner_status: false});
          jQuery('#media_text_list_wrapper').find('.progress-overlay').remove();                    
        });            
  },
  render: function() {
    jQuery('div.mks-spinner').hide();
    jQuery('#tab-content-'+this.props.options.element_id).find('div.tab-pane.active table.media-table').show();
    
    var counter = 0;
    if(this.state.texts.length == 0){
      items = React.createElement('tr', {className: 'no-media-data text-center'},
        React.createElement('td', {className: 'media-data text-center', colSpan: "5"},
          React.createElement('div', {className: 'empty-media-data-message'},
            React.createElement('span', {className: 'message'}, 'You currently have no text assets.'),
          )
        ),
      );
    }else{
      items = this.state.texts.map((item, key) => {
        counter += 1;
        //Media title
        let file_name = '';
        if((item.data.name).length > 0){
          file_name = item.data.name[0].value;
        }
        
        //Tags
        var keywords_values = ['-'];
        var tags = [];
        var media_tags = '';
        if(item.data.field_keywords.length){
          var keywords = item.data.field_keywords.map((kitem, kkey) => {
            keywords_values[kkey] = React.createElement(AppTags, {base_url:this.state.base_url, srate: kitem.url});
            tags.push(kitem.name);
            media_tags = '#' + tags.toString().replaceAll(',', ' #');
          });
        }
        
        // File object
        var file_obj_url = '';
        var file_obj_target_id = '';
        if(item.data.field_media_file.length && item.data.field_media_file[0].target_id != ''){
          file_obj_url = item.data.field_media_file[0].original_url;
          file_obj_target_id = item.data.field_media_file[0].target_id;
        }

        //File ext type
        let file_type = '-';
        if(item.data.field_media_file.length && item.data.field_media_file[0].target_id != ''){
          var fext = (item.data.field_format.length > 0) ? item.data.field_format[0].value : '';
          var fid = (item.data.field_media_file.length > 0) ? item.data.field_media_file[0].target_id : '';
          file_type = React.createElement(AppExtention, {base_url:this.state.base_url, ext:fext, fid:fid, get_type_col: true});
        }
        
        if(this.props.options.tabs.text.cols.multi_asset_chk == 1){
          var td_chk = React.createElement('td', {className: 'media-data text-center'},
              React.createElement('label', {className: 'checkbox-container'},
                React.createElement('input',{type: 'checkbox', id: 'text-check-'+key, className: 'box-check', 'data-fid': file_obj_target_id, 'data-mid': item.data.mid[0].value, defaultChecked: false}),
                React.createElement('span', {className: 'checkmark'}),
              )
            );
        }else{
          var td_chk = null;
        }
        if(this.props.options.tabs.text.cols.text == 1){
          var td_text = React.createElement('td', {className: 'media-data media-data-col-name'},
              React.createElement("div", {id: key, className:"media-box text-box"}, 
                React.createElement('button', {type: 'button', className: 'text-read-button'}, ''),
              )
            );
        }else{
          var td_text = null;
        }
        
        if(this.props.options.tabs.text.cols.title == 1){
          var td_title = React.createElement('td', {className: 'media-data media-file-name'}, file_name);
        }else{
          var td_title = null;
        }
        
        if(this.props.options.tabs.text.cols.tags == 1){
          var td_tags = React.createElement('td', {className: 'media-data text-center media-tags'}, media_tags);
        }else{
          var td_tags = null; 
        }
        
        if(this.props.options.tabs.text.cols.format == 1){
          var td_format = React.createElement('td', {className: 'media-data text-center media-format'}, file_type);
        }else{
          var td_format = null;
        }
        
        return React.createElement('tr', {className:'media-row'},
          td_chk,
          td_text,
          td_title,
          td_tags,
          td_format,
        )
      });
    }
    
    var th_chk = (this.props.options.tabs.text.cols.multi_asset_chk == 1) ? React.createElement('th', {className: 'mchk'},null,) : null;
    var th_text = (this.props.options.tabs.text.cols.text == 1) ? React.createElement('th', {className: 'masset'}, null,) : null;
    var th_title = (this.props.options.tabs.text.cols.title == 1) ? React.createElement('th', {className: 'sortempty media-title mtitle', onClick: this.sortColumn.bind(this)}, 'Title') : null;
    var th_tags = (this.props.options.tabs.text.cols.tags == 1) ? React.createElement('th', {className: 'sortempty media-tag', onClick: this.sortColumn.bind(this)}, 'Tags') : null;
    var th_format = (this.props.options.tabs.text.cols.format == 1) ? React.createElement('th', {className: 'sortempty media-format mfdd', onClick: this.sortColumn.bind(this)}, 'Format') : null;
    
    var table_head = React.createElement('thead',{},
      React.createElement('tr', null,
        th_chk,
        th_text,
        th_title,
        th_tags,
        th_format, 
      )
    );
    
    var table_body = React.createElement('tbody', {id: 'media_kit_text'}, items);
    var table_footer = React.createElement('tfoot', {id: 'duplicate-body'});
    var table_data = React.createElement('table', {className: 'media-table', id: 'table-text-'+this.props.options.element_id}, table_head, table_body, table_footer);
   
    var updatediv = React.createElement('div', {className: 'd-none', id: 'text-'+this.props.options.element_id+'-refresh', onClick: this.UpdateMethod.bind()}, 'refresh');

    return (
     React.createElement("div", {}, table_data, updatediv)
    );
  },
  sortColumn: function(e){
    var th = this;
    var t = e.target;
    var txt = jQuery(e.target).text();
    const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
    const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
      v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
      )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
    const table = t.closest('table');
    var tableid = jQuery(t.closest('table')).attr('id');
    jQuery('#'+tableid+' thead tr th').removeClass('bg-sort');
    jQuery('#'+tableid+' thead tr th').removeClass('asc-icon');
    jQuery('#'+tableid+' thead tr th').removeClass('desc-icon');
    
    // copy data to tfoot
    if(!jQuery('#' + tableid + ' tbody').hasClass('d-none')) {
      table.childNodes[2].innerHTML = table.childNodes[1].innerHTML;
      jQuery('table#' +tableid+ ' tbody tr input.box-check').each(function() {
        if(jQuery(this).prop('checked')){
          var chkid = jQuery(this).attr('id'); 
          jQuery('table#' +tableid+ ' tfoot tr input#'+chkid).prop("checked", true);
        }
      });
      table.childNodes[1].classList.add('d-none');
    }
    
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
    
    var picRowsFrom = table.querySelectorAll('table#' + tableid + ' tfoot tr.media-row');
    Array.from(picRowsFrom).sort(comparer(Array.from(t.parentNode.children).indexOf(t), t.asc = !t.asc)).forEach(tr => table.childNodes[2].appendChild(tr));
    /*
    Array.from(table.querySelectorAll('tr.media-row'))
      .sort(comparer(Array.from(t.parentNode.children).indexOf(t), t.asc = !t.asc))
      .forEach(tr => table.appendChild(tr) );
    */
      
    //adding class to sorted column
    jQuery('#'+tableid+' td').removeClass('sorted');
    var ind = jQuery(t).index() + 1;
    jQuery('#'+tableid+' td:nth-child('+ind+')').addClass('sorted');
  } 
});
 