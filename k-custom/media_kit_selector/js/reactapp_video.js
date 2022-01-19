var AppVideo = React.createClass({
  getInitialState: function() {
    return {
      video: [],
      showModal: false,
      singlecheckVideo: false,
      fileType: '',
      fileURL: '',
      mid: '',
      base_url: this.props.base_url,
      videoplayer: false,
      nextVideoTrack: 0,
      totalCount: 0,
      playnowclass : 'fa fa-pause col-md-6',
      playnow_status: true,
      volume_level: 1,
      seekslider_value: 0,
      curtimetext: '0:00',
      durtimetext: '0:00',
    }
  },
  componentWillMount: function() {
    var km_base_url = this.props.base_url;
    var media_kit_url = km_base_url+"/node/"+this.props.mkid+"?_format=json";
    var th = this;
    this.serverRequest = 
      axios.get(media_kit_url)
        .then(function(result) {    
            return result.data.field_vault_video;
        })
        .then(function(response) {
          return Promise.all(response.map( (record, index) => {
            return axios.get(km_base_url + record.url +'?_format=json');
          }))
        })
        .then(function(responsex) {
          th.setState({video: responsex});
        });
  },
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  
  render: function() {
    jQuery('div.mks-spinner').hide();
    jQuery('#tab-content-'+this.props.options.element_id).find('div.tab-pane.active table.media-table').show();
    
    const rowLen = this.state.video.length;
    if (this.state.videoplayer) {
      var videoPlayerElement = React.createElement(AppVideoPlayer, {
                                  handleHideVideoPlayer: this.handleHideVideoPlayer,
                                  playNowVideo: this.playNowVideo,
                                  fileURL: this.state.fileURL,
                                  VVolControl: this.VVolControl,
                                  playnowclass: this.state.playnowclass,
                                  playnowNext: this.playnowNext,
                                  playnowPrev: this.playnowPrev,
                                  vidSeek: this.vidSeek,
                                  seektimeupdate: this.seektimeupdate,
                                  volume_level: this.state.volume_level,
                                  seekslider_value: this.state.seekslider_value,
                                  curtimetext: this.state.curtimetext,
                                  durtimetext: this.state.durtimetext,
                                  videoCompleted: this.videoCompleted});
    }
    
    if(rowLen == 0){
      items = React.createElement('tr', {className: 'no-media-data text-center'},
        React.createElement('td', {className: 'media-data text-center', colSpan: "5"},
          React.createElement('div', {className: 'empty-media-data-message'},
            React.createElement('span', {className: 'message'}, 'You currently have no video assets.'),
          )
        ),
      );
    }else{
      var items = this.state.video.map((item, key) => {
          var file_obj_original_url = '';
          var file_obj_url = '';
          var file_obj_target_id = '';
          var file_obj_image_style = '';
          
          // console.log(item.data.field_media_video_file);
          if(item.data.field_media_video_file.length){
            file_obj_image_style = item.data.field_media_video_file[0].image_style;
            file_obj_original_url = item.data.field_media_video_file[0].original_url;
            file_obj_url = item.data.field_media_video_file[0].url;
            file_obj_target_id = item.data.field_media_video_file[0].target_id;
          }
          
          //Media title
          let file_name = '-';
          /*if(item.data.field_media_video_file.length && item.data.field_media_video_file[0].target_id != ''){
            file_name = React.createElement(AppFileName, {base_url: this.props.base_url, fid: item.data.field_media_video_file[0].target_id});
          }*/
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
          
          //Video time
          if((item.data.field_duration).length > 0){
            var video_time = item.data.field_duration[0].value;
          } else {
            var video_time = '-'; 
          } 
          
          // Video thumbnail
          if(item.data.field_media_video_file.length && item.data.field_media_video_file[0].is_thumbnail){
            var video_thumb = React.createElement('img', {src:file_obj_image_style}, '');
          } else {
            var video_thumb = React.createElement("video", {id: 'video-'+key}, React.createElement('source', {src:file_obj_original_url},''));
          }
          
          if(this.props.options.tabs.video.cols.multi_asset_chk == 1){
            var td_chk = React.createElement('td', {className: 'media-data text-center'},
              React.createElement('label', {className: 'checkbox-container'},
                React.createElement('input',{type: 'checkbox', id: 'video-kit-check-'+key, className: 'box-check', 'data-mid': item.data.mid[0].value, 'value': item.data.mid[0].value}),
                React.createElement('span', {className: 'checkmark'}),
              )
            );
          }else{
            var td_chk = null; 
          }
          if(this.props.options.tabs.video.play == 1){
            var video_play = React.createElement('div', {className: 'overlay'},
                  React.createElement('button', {type: 'button', className: 'video-play round-button', onClick: this.ShowVideoPlayer.bind(null, file_obj_original_url, +key, +rowLen), style:{'display':'none'}}, ''),
                );
          } else {
            var video_play = null;
          }
          
          if(this.props.options.tabs.video.cols.video == 1){
            var td_video = React.createElement('td', {className: 'media-data media-data-col-name', 'data-src': item.data.field_media_video_file[0].media_style_url},
              React.createElement("div", {id: key+'-video-'+item.data.mid[0].value, className:"media-box"}, 
                video_thumb,
                video_play
              )
            );
          }else{
            var td_video = null;
          }
          
          if(this.props.options.tabs.video.cols.title == 1){
            var td_title = React.createElement('td', {className: 'media-data media-file-name'}, file_name);
          }else{
            var td_title = null;
          }
          
          if(this.props.options.tabs.video.cols.tags == 1){
            var td_tags = React.createElement('td', {className: 'media-data media-tags'}, media_tags);
          }else{
            var td_tags = null;
          }
          
          if(this.props.options.tabs.video.cols.duration == 1){
            var td_duration = React.createElement('td', {className: 'media-data duration'}, video_time);
          }else{
            var td_duration = null;
          }

          return React.createElement('tr', {className:'media-row'},
            td_chk,
            td_video,
            td_title,
            td_tags,
            td_duration,
          )
      });
    }
    
    var th_chk = (this.props.options.tabs.video.cols.multi_asset_chk == 1) ? React.createElement('th', {className: 'mchk'},null, ) : null; 
    var th_video = (this.props.options.tabs.video.cols.video == 1) ? React.createElement('th', {className: 'masset'}, null, ) : null; 
    var th_title = (this.props.options.tabs.video.cols.title == 1) ? React.createElement('th', {className: 'sortempty media-title mtitle', onClick: this.sortColumn.bind(this)}, 'Title') : null; 
    var th_tags = (this.props.options.tabs.video.cols.tags == 1) ? React.createElement('th', {className: 'sortempty media-title media-tag', onClick: this.sortColumn.bind(this)}, 'Tags') : null; 
    var th_duration = (this.props.options.tabs.video.cols.duration == 1) ? React.createElement('th', {className: 'sortempty media-title mfdd', onClick: this.sortColumn.bind(this)}, 'Duration') : null; 
    var table_head = React.createElement('thead',{},
      React.createElement('tr', null, 
        th_chk,
        th_video,
        th_title,
        th_tags,
        th_duration,
      )
    );
    
    var table_body = React.createElement('tbody', null, items);
    var table_footer = React.createElement('tfoot', {id: 'duplicate-body'});
    var table_data = React.createElement('table',{className: 'media-table', id: 'table-video-'+this.props.options.element_id}, table_head, table_body, table_footer);
    
    var updatediv = React.createElement('div', {className: 'd-none', id: 'video-'+this.props.options.element_id+'-refresh', onClick: this.UpdateMethod.bind()}, 'refresh');
    
    return ( 
      React.createElement("div", {}, table_data, updatediv, videoPlayerElement)
    );
  },
  UpdateMethod: function() {
    var th = this;
    jQuery('table#table-video-'+th.props.options.element_id+' tfoot').empty();
    jQuery('table#table-video-'+th.props.options.element_id+' tbody').removeClass('d-none');
    jQuery('table#table-video-'+th.props.options.element_id+' tbody tr').show();
    jQuery('table#table-video-'+th.props.options.element_id+' thead tr th').removeClass('bg-sort');
    jQuery('table#table-video-'+th.props.options.element_id+' tbody tr td').removeClass('sorted');
    //Force a render with a simulated state change
    media_kit_id = jQuery('#mediakitid-'+this.props.options.element_id).val();
    media_kit_url = th.props.base_url+"/node/"+media_kit_id+"?_format=json";
    
    this.serverRequest = 
      axios.get(media_kit_url)
        .then(function(result) {    
            return result.data.field_vault_video;
        })
        .then(function(response) {
           return Promise.all(response.map( (record, index) => {
             return axios.get(th.props.base_url+record.url +'?_format=json');
           }))
        })
        .then(function(responsex) {
          th.setState({video: responsex});
        });
  },
  retnum: function(number){
    var num = number.replace(/[^0-9]/g, '');
    var filesizename = number.replace(/[^a-zA-Z]+/g, '').toUpperCase();

    num = parseInt(num, 10);

    switch (filesizename) {
        case "KB":
            num = num * 1024;
            break;
        case "MB":
            num = num * Math.pow(1024, 2);
            break;
        case "GB":
            num = num * Math.pow(1024, 3);
            break;
        case "TB":
            num = num * Math.pow(1024, 4);
            break;
    }

    return num;
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
  },
  ShowVideoPlayer: function(fileURL, trackID, rowLen){
    this.setState({videoplayer: true});
    this.setState({fileURL: fileURL});
    this.setState({nextVideoTrack: trackID});
    this.setState({totalCount: rowLen});
  },
  handleHideVideoPlayer: function(){
    this.setState({videoplayer: false});
    this.setState({nextVideoTrack: 0});
    this.setState({totalCount: 0});
    this.setState({curtimetext: '0:00'});
    this.setState({durtimetext: '0:00'});
  },
  playNowVideo: function(){
    if(this.state.playnow_status){
      jQuery('.modal-video-playing')[0].pause();
      this.setState({playnow_status: false});
      this.setState({playnowclass :'fa fa-play col-md-6'});
    }else{
      jQuery('.modal-video-playing')[0].play();
      this.setState({playnow_status: true});
      this.setState({playnowclass :'fa fa-pause col-md-6'});
    }
  },
  VVolControl: function() {
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
  playnowNext: function(){
    var nextid = this.state.nextVideoTrack;
    var totalCount = this.state.totalCount;
    var nexturl = '';
    nextid++;
    if(totalCount <= nextid){
      totalCount--;
      nexturl = jQuery('#video-'+totalCount+' source').attr('src');
      this.setState({nextVideoTrack: +totalCount});
    }else{
      nexturl = jQuery('#video-'+nextid+' source').attr('src');
      this.setState({nextVideoTrack: +nextid});
    }
    jQuery('.modal-video-playing')[0].src = nexturl;
    jQuery('.modal-video-playing')[0].play();
    this.setState({playnow_status: true});
    this.setState({playnowclass :'fa fa-pause col-md-6'});
  },
  playnowPrev: function(){
    var previd = this.state.nextVideoTrack;
    var prevurl = '';
    previd--;
    if(previd < 0){
      prevurl = jQuery('#video-0 source').attr('src');
      this.setState({nextVideoTrack: 0});
    }else{
      prevurl = jQuery('#video-'+previd+' source').attr('src');
      this.setState({nextVideoTrack: +previd});
    }
    jQuery('.modal-video-playing')[0].src = prevurl;
    jQuery('.modal-video-playing')[0].play();
    this.setState({playnow_status: true});
    this.setState({playnowclass :'fa fa-pause col-md-6'});
  },
  vidSeek: function(){
    var vid = jQuery('.modal-video-playing')[0];
    var seekslider = document.getElementsByClassName("time-control");
    var seekto = vid.duration * (seekslider[0].value / 100);
    vid.currentTime = seekto;
    this.setState({seekslider_value: seekslider[0].value});
  },
  seektimeupdate: function(){
    if(this.state.videoplayer){
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
    }
  },
  videoCompleted: function(){
    this.setState({playnow_status: false});
    this.setState({playnowclass :'fa fa-play col-md-6'});
  }       
});
//code