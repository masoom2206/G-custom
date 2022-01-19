function playvideo(src, duration){
  jQuery("div#vmt-video-player").empty();
  React.render(
    React.createElement(AppClipVideoPlayer, {src: src, seekslider_value: 0, curtimetext: '0:00', durtimetext: duration}), document.querySelector("div#vmt-video-player")
  );
  jQuery('div#vmt-video-player div.video-modal').modal('show');
}

// Video Player Modal
let AppClipVideoPlayer = React.createClass({
  getInitialState: function() {
    return {
      video: [],
      videoplayer: false,
      playnow_status: true,
      playnow_class: 'fa fa-pause',
      volume_level: 1,
      seekslider_value: 0,
      curtimetext: '0:00',
      durtimetext: '0:00',
    }
  },
  componentDidMount: function() {
    jQuery(this.getDOMNode()).modal('show');
    jQuery(this.getDOMNode()).on('shown.bs.modal', function () {
      jQuery('.modal-video-playing')[0].play();
    });
    jQuery('.modal-video-playing').on("timeupdate", this.updateSeekTime.bind());
    jQuery('.modal-video-playing').on("ended", this.videoCompleted.bind());
    document.addEventListener('click', this.handleClickOutside, true);
  },
  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
  },
  render: function() {
    return (
      React.createElement('div', {id: 'modal', className: 'modal fade video-modal'},
        React.createElement('div', {className: 'modal-dialog'},
          React.createElement('div', {className: 'modal-content'},
            React.createElement('button', {type: 'Button', className: 'close video-close', 'data-dismiss': 'modal',onClick: this.videoModalClose.bind()},
              React.createElement('i', {className:"fa fa-times"},'')
            ),
            React.createElement('div', {className: 'spinner-border'}, ''),
            React.createElement("video", {className: 'modal-video-playing'}, 
              React.createElement('source', {src: this.props.src},'')
            ),
            React.createElement('div', {className:'control-box'},
              React.createElement('div', {className: 'upper-box col-xl-12 col-md-12'},
                React.createElement('div', {className: 'row'}, 
                  React.createElement('div', {className: 'col-md-4'}, 
                    React.createElement('i', {className: 'fa fa-volume-down'},''),
                    React.createElement('input', {type: 'Range', className: 'video-volume-control',min: 0, max: 1, step: 0.1, onChange: this.controlVolume.bind()},''),
                    React.createElement('i', {className: 'fa fa-volume-up'},'')
                  ),
                  React.createElement('div', {className: 'col-md-4 text-center'},
                    //React.createElement('i', {className: 'fa fa-backward'},''),
                    React.createElement('i', {className: this.state.playnow_class, onClick: this.videoPlayPause.bind()}, ''),
                    //React.createElement('i', {className: 'fa fa-forward'},'')
                  ),
                  React.createElement('div', {className: 'col-md-3'}, '')
                )
              ),
              React.createElement('div', {className: 'lower-box'},
                React.createElement('span', {id: 'start'}, this.props.curtimetext),
                React.createElement('input', {type: 'Range', className: 'time-control',min:'0', max:'100', value: this.props.seekslider_value, step:'1', onChange: this.videoSeek.bind()},''),
                React.createElement('span', {id: 'end'}, this.props.durtimetext)
              )
            )
          )
        )
      )
    )
  },
  videoPlayPause: function(){
    if(this.state.playnow_status){
      jQuery('.modal-video-playing')[0].pause();
      this.setState({playnow_status: false});
      this.setState({playnow_class :'fa fa-play'});
    }else{
      jQuery('.modal-video-playing')[0].play();
      this.setState({playnow_status: true});
      this.setState({playnow_class :'fa fa-pause'});
    }
  },
  videoModalClose: function(){
	 jQuery("div#vmt-video-player").empty(); 
	 jQuery('.modal-backdrop').hide();
  },
  controlVolume: function() {
    var sound = document.getElementsByClassName("video-volume-control");
    jQuery('.modal-video-playing')[0].volume = sound[0].value;
    this.setState({volume_level: sound[0].value})
    jQuery(sound).css('background-image',
      '-webkit-gradient(linear, left top, right top, '
      + 'color-stop(' + sound[0].value + ', #4f6ab7), '
      + 'color-stop(' + sound[0].value + ', #ccc)'
      + ')'
    );
  },
  videoSeek: function(){
    var vid = jQuery('.modal-video-playing')[0];
    var seekslider = document.getElementsByClassName("time-control");
    var seekto = vid.duration * (seekslider[0].value / 100);
    vid.currentTime = seekto;
    this.setState({seekslider_value: seekslider[0].value});
	console.log('vdo seek');
  },
  updateSeekTime: function(){
   // if(this.state.videoplayer){
      var vid = jQuery('.modal-video-playing')[0];
      var nt = vid.currentTime * (100 / vid.duration);
      this.setState({seekslider_value: +nt});
      var curmins = Math.floor(vid.currentTime / 60);
      var cursecs = Math.floor(vid.currentTime - curmins * 60);
      var durmins = Math.floor(vid.duration / 60);
      var dursecs = Math.floor(vid.duration - durmins * 60);
      if(cursecs < 10){ cursecs = "0"+cursecs; }
      if(dursecs < 10){ dursecs = "0"+dursecs; }
      if(curmins < 10){ curmins = "0"+curmins; }
      if(durmins < 10){ durmins = "0"+durmins; }
      var start = curmins+":"+cursecs;
      var end = durmins+":"+dursecs;
      this.setState({curtimetext: start});
      this.setState({durtimetext: end});
	  console.log('jjj');
  // }
	
  },
  videoCompleted: function(){
    this.setState({playnow_status: false});
    this.setState({playnow_class :'fa fa-play'});
  },
  handleClickOutside: function(e){
    if(e.target.id == 'modal'){
      jQuery("div#vmt-video-player").empty(); 
      jQuery('.modal-backdrop').hide();
      console.log('hideModal');
    }
  },
  propTypes:{
    handleHideVideoPlayer: React.PropTypes.func.isRequired,
  }
});