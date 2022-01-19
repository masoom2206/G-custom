var AppMediaOptions = React.createClass({
  getInitialState: function() {           
    return {
      mediakits: [],
    }
  },
  componentWillMount: function() {
    console.log(this.props.options.element_id);
    var th = this;
    this.serverRequest = 
      axios.get(this.props.base_url+'/user/media_kits/'+this.props.user_id)
        .then(function(result) {    
          th.setState({mediakits: result.data});
        });
  },
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  render: function() {
    var options = this.state.mediakits.map((item, key) => {
      return React.createElement('option', {value: item.nid}, item.title)
    });
   
    return ( 
      React.createElement("select", {name: 'mka', id: 'mka', className: 'w-100 rounded', onChange: this.ChooseMediaKit.bind(),}, options)
    );
  },
  ChooseMediaKit: function(e) {
    var mediakit_id = e.target.value;     
  }
});
