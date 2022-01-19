var AppMediaSearch = React.createClass({
  render: function() {
    //console.log(this.props.options.element_id);
    return ( 
      React.createElement('div', {
        className: 'search-by-title-tags d-flex mt-2',
        style: {
          'position': 'relative'
        }
      }, React.createElement('i', {
        className: 'fas fa-search seach-icon',
      }), React.createElement('input', {
        type: 'text',
        id: 'filter-'+this.props.options.element_id,
        className: 'filter media-filter',
        placeholder: '',
        type: 'text',
        autoFocus: true
      }), React.createElement('button', {
        id: 'filter-btn-'+this.props.options.element_id,
        type: 'button',
        className: 'btn btn-primary filter-btn text-uppercase align-baseline font-fjalla',
        onClick: this.FilterBy.bind()
      }, 'Apply'),)
    );
  },
  FilterBy: function(e) {
    var th = this;
    //console.log('FilterBy: '+this.props.options.element_id);
    var tab_content_id = '#tab-content-'+this.props.options.element_id;
    //console.log(tab_content_id);
    var tableid = jQuery(tab_content_id).find('div.tab-pane.active table.media-table').attr('id');
    //console.log(tableid);
    
    if(jQuery('table#'+tableid+' tbody').hasClass('d-none')){
      var rows = jQuery('table#'+tableid+' tfoot tr');
    }else{
      var rows = jQuery('table#'+tableid+' tbody tr');
    }
    rowsArr = th.sortByTitle(rows);
    for (var i = 0; i < rowsArr.length; i++) {
      if(jQuery('table#'+tableid+' tbody').hasClass('d-none')){
        jQuery('table#'+tableid+' tfoot').append(rowsArr[i]);
      }else{
        jQuery('table#'+tableid+' tbody').append(rowsArr[i]);
      }
    }
  },
  sortByTitle: function(rows) {
    var filterText = jQuery('#filter-'+this.props.options.element_id).val().toLowerCase();
    //console.log('filterText: '+filterText);
    rows.filter(function(a, b) {
      if(filterText.length !== ''){
        var title = jQuery(this).find('td.media-file-name').text().toLowerCase();
        //console.log('Title: '+title);
        //console.log('X: '+title.indexOf(filterText));
        if(title.indexOf(filterText) > -1){
          jQuery(this).show();
        }else{
          jQuery(this).hide();
        }
      } else {
        jQuery(this).show();
      }
      return rows;
    });
    return rows;
  }
});
