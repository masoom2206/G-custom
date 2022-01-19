var AppMediaOptions = React.createClass({
  getInitialState: function() {           
    return {
      mediakits: [],
    }
  },
  componentWillMount: function() {
    var th = this;
    this.serverRequest = 
      axios.get(this.props.base_url+'/user/media_kits/'+this.props.options.uid)
        .then(function(result) {    
          th.setState({mediakits: result.data});

        });
  },
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  render: function() {
    var options = this.state.mediakits.map((item, key) => {
      if(item.nid == this.props.mkid){
        return React.createElement('option', {value: item.nid, selected: 'selected'}, item.title)
      }else{
        return React.createElement('option', {value: item.nid}, item.title)
      }
    });
   
    return ( 
      React.createElement("select", {className: 'mk-options w-100 rounded', onChange: this.ChooseMediaKit.bind(),}, options)
    );
  },
  ChooseMediaKit: function(e) {
    var mediakit_id = e.target.value;     
    jQuery('#mediakitid-'+this.props.options.element_id).val(mediakit_id);
    // show loader
    jQuery('#tab-content-'+this.props.options.element_id).find('div.tab-pane.active table.media-table').hide();
    jQuery('div#tab-content-'+this.props.options.element_id+' div.tab-pane.active div.mks-spinner').show();
    
    //refresh all tabs and change title under right side kit
    jQuery("#audio-"+this.props.options.element_id+"-refresh").trigger('click');
    jQuery("#photo-"+this.props.options.element_id+"-refresh").trigger('click');
    jQuery("#video-"+this.props.options.element_id+"-refresh").trigger('click');
    jQuery("#text-"+this.props.options.element_id+"-refresh").trigger('click');
    
    // checked off boxes 
    jQuery('table#table-audio-'+this.props.options.element_id+' tbody tr input[type=checkbox]').prop('checked', false);
    jQuery('table#table-photo-'+this.props.options.element_id+' tbody tr input[type=checkbox]').prop('checked', false);
    jQuery('table#table-video-'+this.props.options.element_id+' tbody tr input[type=checkbox]').prop('checked', false);
    jQuery('table#table-text-'+this.props.options.element_id+' tbody tr input[type=checkbox]').prop('checked', false);
    
    // show tab content
    jQuery('table#table-audio-'+this.props.options.element_id+' tbody tr').show();
    jQuery('table#table-photo-'+this.props.options.element_id+' tbody tr').show();
    jQuery('table#table-video-'+this.props.options.element_id+' tbody tr').show();
    jQuery('table#table-text-'+this.props.options.element_id+' tbody tr').show();
    
    /*
    jQuery('table#table-audio-'+this.props.options.element_id+' tbody tr input[type=checkbox]').each(function(){
      jQuery(this).prop('checked', false);
    });
    jQuery('table#table-photo-'+this.props.options.element_id+' tbody tr input[type=checkbox]').each(function(){
      jQuery(this).prop('checked', false);
    });
    jQuery('table#table-video-'+this.props.options.element_id+' tbody tr input[type=checkbox]').each(function(){
      jQuery(this).prop('checked', false);
    });
    jQuery('table#table-text-'+this.props.options.element_id+' tbody tr input[type=checkbox]').each(function(){
      jQuery(this).prop('checked', false);
    });
    */
  }
});
