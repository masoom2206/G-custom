jQuery(document).ready(function() {
  jQuery("body" ).on( "click", "label.checkbox-container input[type=checkbox]", function() {
    var chkid = jQuery(this).attr('id');
    var tableid = jQuery(this).closest('table').attr('id');
    if(jQuery(this).prop("checked")) {
      jQuery('table#' +tableid+ ' tr input#'+chkid).prop("checked", true);
    }else{
      jQuery('table#' +tableid+ ' tr input#'+chkid).prop("checked", false);
    }
  });
});

// Media Filename
var AppFileName = React.createClass({
  getInitialState: function() {
    return {
      value: '-',
    }
  },
  componentWillMount: function() {
    var th = this;
    //console.log('X: '+th.props.base_url);
    this.serverRequest = 
      axios.get(th.props.base_url+'/rest/api/file/'+this.props.fid+'?_format=json')
        .then(function(result) { 
          th.setState({value: result.data.filename[0].value});
        })
  },
  componentWillReceiveProps: function(nextProps) {
    if(this.props.fid != nextProps.fid){
      var th = this;
      //console.log('Y: '+th.props.base_url);
      this.serverRequest = 
        axios.get(th.props.base_url+'/rest/api/file/'+nextProps.fid+'?_format=json')
          .then(function(result) { 
            th.setState({value: result.data.filename[0].value});
          })
    }    
  },
  render: function() {
    return React.createElement('span', {}, this.state.value)
  },
});

// File size
var AppFileSize = React.createClass({
  getInitialState: function() {
    return {
      value: '-',
    }
  },
  componentWillMount: function() {
    var th = this;
    this.serverRequest = 
      axios.get(th.props.base_url+'/rest/api/file/'+this.props.fid+'?_format=json')
        .then(function(result) { 
          th.setState({value: result.data.filesize[0].value});
        })
  },
  componentWillReceiveProps: function(nextProps) {
    if(this.props.fid != nextProps.fid){
      var th = this;
      this.serverRequest = 
        axios.get(th.props.base_url+'/rest/api/file/'+nextProps.fid+'?_format=json')
          .then(function(result) { 
            th.setState({value: result.data.filesize[0].value});
          })
    }      
  },
  render: function() {
    // Convert bytes to kilobytes.
    var units = ['KB','MB','GB','TB','PB','EB','ZB','YB'];
    var bytes = this.state.value;
    if(bytes <= 0){
      bytes = bytes + " bytes";
     }else{
      bytes = bytes / 1024;
      for(i= 0; i< units.length; i++){
        if (bytes.toFixed(2) >= 1024) {
          bytes = bytes / 1024;
        }
        else {
          bytes = bytes.toFixed(2);
          break;
        }
      }
      bytes = bytes +' '+ units[i];
     }
    return React.createElement('span', {className: ''}, bytes)
  },
});

//File extension component
var AppExtention = React.createClass({
  getInitialState: function() {
    return {
      fileExtension: '',
    }
  },
  componentWillMount: function() {
    var th = this;
    this.serverRequest = 
      axios.get(th.props.base_url+'/rest/api/file/'+this.props.fid+'?_format=json')
        .then(function(result) { 
          th.setState({fileExtension: result.data.filename[0].value});
        })
  },
  componentWillReceiveProps: function(nextProps) {
    if(this.props.fid != nextProps.fid){
      var th = this;
      this.serverRequest = 
        axios.get(th.props.base_url+'/rest/api/file/'+nextProps.fid+'?_format=json')
          .then(function(result) { 
            th.setState({fileExtension: result.data.filename[0].value});
          })
    }      
  },
  render: function() {
    var extName = (this.state.fileExtension).split('.').pop();
    if(Boolean(this.props.get_type_col)){
      if(extName == 'jpg' || extName == 'jpeg'){
        extName = 'JPEG file';
      }else if(extName == 'png'){
        extName = 'PNG image';
      }else if(extName == 'NEF'){
        extName = 'Camera Raw Image';
      }else if(extName == 'svg'){
        extName = 'SVG Image';
      }else if(extName == 'gif'){
        extName = 'GIF image';
      }else if(extName == 'pdf'){
        extName = 'Adobe File';
      }else if(extName == 'docx'){
        extName = 'Microsoft Word document';
      }else if(extName == 'txt'){
        extName = 'Plain Text file';
      }else if(extName == 'rtf'){
        extName = 'Rich Text Format document';
      }else if(extName == 'wpd'){
        extName = 'WordPerfect document';
      }else if(extName == 'pages'){
        extName = 'Pages document';
      }
    } 
    return React.createElement('span', {}, extName)
  },
});

// Audio time/size
var AudioTime = React.createClass({
  getInitialState: function() {
    return {
      audio_time: '',
    }
  },
  componentWillMount: function() {
    var th = this;
    var audio_time = '-';
    let a = new Audio(this.props.audioURL);
    a.addEventListener('loadedmetadata', (e) => {
      this.setState({audio_time: (e.target.duration).toFixed(2)});
    });
  },
  componentWillReceiveProps: function(nextProps) {
    if(this.props.audioURL != nextProps.audioURL){
      var th = this;
      var audio_time = '-';
      let a = new Audio(nextProps.audioURL);
      a.addEventListener('loadedmetadata', (e) => {
        this.setState({audio_time: (e.target.duration).toFixed(2)});
      });
    }
  },
  render: function() {
    return React.createElement('span', {className: ''}, this.state.audio_time)
  },
});

// Sample rate and Rating value component
var AppTags = React.createClass({
  getInitialState: function() {
    return {
      taxoValue: '',
    }
  },
  componentWillMount: function() {
    var th = this;
    this.serverRequest = 
      axios.get(th.props.base_url+'/'+this.props.srate+'?_format=json')
        .then(function(result) { 
          th.setState({
            taxoValue: result.data.name[0].value
          });
        })
  },
  componentWillUnmount: function() {
    //this.serverRequest.abort();
  },
  render: function() {
    return React.createElement('span', {className: ''}, this.state.taxoValue)
  },
});

// Video Player Modal
let AppVideoPlayer = React.createClass({
  componentDidMount: function() {
      jQuery(this.getDOMNode()).modal('show');
      jQuery(this.getDOMNode()).on('shown.bs.modal', function () {
        jQuery('.modal-video-playing')[0].play();
      });
      jQuery('.modal-video-playing').on("timeupdate", this.props.seektimeupdate);
      jQuery('.modal-video-playing').on("ended", this.props.videoCompleted);
      jQuery(this.getDOMNode()).on('hidden.bs.modal', this.props.handleHideVideoPlayer);
  },
  render: function() {
    return (
      React.createElement('div', {id: 'modal', className: 'modal fade video-modal'},
        React.createElement('div', {className: 'modal-dialog'},
          React.createElement('div', {className: 'modal-content'},
            React.createElement('button', {type: 'Button', className: 'close video-close', 'data-dismiss': 'modal'},
              React.createElement('i', {className:"fa fa-times"},'')
            ),
            React.createElement('div', {className: 'spinner-border'}, ''),
            React.createElement("video", {className: 'modal-video-playing'}, 
              React.createElement('source', {src:this.props.fileURL},'')
            ),
            React.createElement('div', {className:'control-box'},
              React.createElement('div', {className: 'upper-box col-xl-12 col-md-12'},
                React.createElement('div', {className: 'row'}, 
                  React.createElement('div', {className: 'col-md-4'}, 
                    React.createElement('i', {className: 'fa fa-volume-down'},''),
                    React.createElement('input', {type: 'Range', className: 'video-volume-control', value: this.props.volume_level, min: 0, max: 1, step: 0.1, onChange: this.props.VVolControl},''),
                    React.createElement('i', {className: 'fa fa-volume-up'},'')
                  ),
                  React.createElement('div', {className: 'col-md-4 text-center'},
                    React.createElement('i', {className: 'fa fa-backward', onClick: this.props.playnowPrev},''),
                    React.createElement('i', {className: this.props.playnowclass, onClick: this.props.playNowVideo},''),
                    React.createElement('i', {className: 'fa fa-forward', onClick: this.props.playnowNext},'')
                  ),
                  React.createElement('div', {className: 'col-md-3'}, '')
                )
              ),
              React.createElement('div', {className: 'lower-box'},
                React.createElement('span', {id: 'start'}, this.props.curtimetext),
                React.createElement('input', {type: 'Range', className: 'time-control',min:'0', max:'100', value: this.props.seekslider_value, step:'1', onChange: this.props.vidSeek},''),
                React.createElement('span', {id: 'end'}, this.props.durtimetext)
              )
            )
          )
        )
      )
    )
  },
  propTypes:{
    handleHideVideoPlayer: React.PropTypes.func.isRequired,
  }
});
