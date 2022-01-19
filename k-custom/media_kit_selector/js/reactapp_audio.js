var AppAudio = React.createClass({
  getInitialState: function() {
     return {
      audios: [],
    }
  },
  componentWillMount: function() {
    var km_base_url = this.props.base_url;
    var media_kit_url = km_base_url+"/node/"+this.props.mkid+"?_format=json";
    var th = this;
    this.serverRequest = 
      axios.get(media_kit_url)
        .then(function(result) {    
            return result.data.field_vault_audio;
        })
        .then(function(response) {
           return Promise.all(response.map( (record, index) => {
             return axios.get(km_base_url+'/media/'+record.target_id+'/edit?_format=json');
           }))
        })
        .then(function(responsex) {
          th.setState({audios: responsex});
        });            
  },
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  render: function() {
    jQuery('div.mks-spinner').hide();
    jQuery('#tab-content-'+this.props.options.element_id).find('div.tab-pane.active table.media-table').show();
    if(this.state.audios.length == 0){
      items = React.createElement('tr', {className: 'no-media-data text-center'},
        React.createElement('td', {className: 'media-data text-center', colSpan: "5"},
          React.createElement('div', {className: 'empty-media-data-message'},
            React.createElement('span', {className: 'message'}, 'You currently have no audio assets.'),
          )
        ),
      );
    }else{
      var items = this.state.audios.map((item, key) => {
        //Media title
        let file_name = '-';
        /*
        file_name = React.createElement(AppFileName, {base_url: this.props.base_url, fid: item.data.field_media_audio_file[0].target_id});
        */
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
        
        //Audio Time
        if((item.data.field_duration).length > 0){
          var audio_time = item.data.field_duration[0].value;
        } else {
          var audio_time = '-'; 
        }   
        
        
        var file_obj_url = '';
        if(item.data.field_media_audio_file.length && item.data.field_media_audio_file[0].target_id != ''){
          file_obj_url = item.data.field_media_audio_file[0].original_url;
        }
        
        var td_chk = (this.props.options.tabs.audio.cols.multi_asset_chk == 1) ? React.createElement('td', {className: 'audio-data'},
            React.createElement('label', {className: 'checkbox-container'},
              React.createElement('input',{type: 'checkbox', id: 'audio-kit-check-'+key, className: 'box-check', 'data-mid': item.data.mid[0].value, 'value': item.data.mid[0].value}),
              React.createElement('span', {className: 'checkmark'}),
            )
          ) : null; 
        var td_audio = (this.props.options.tabs.audio.cols.audio == 1) ? React.createElement('td', {className: 'audio-data audio-src'},
            React.createElement('div', {id: key+'-audio-'+item.data.mid[0].value, className: 'audio-box'},
              React.createElement("audio", {id: 'audio-kit-'+this.props.options.element_id+'-'+key, controls:"controls", style:{width: '0px', height: '0px', visibility:'hidden'}}, 
                React.createElement('source', {src:file_obj_url},'')
              ),
              React.createElement('button', {type: 'button', className: 'audio-play-button', onClick: this.playAudio.bind(null, this, 'audio-kit-'+this.props.options.element_id+'-'+key, 'volCol-kit-'+this.props.options.element_id+'-'+key)},''),
              React.createElement('div', {className:'vol-box'},
                React.createElement('div', {className:'vol-box-inner'},
                  React.createElement('input', {type: 'range', id:'volCol-kit-'+this.props.options.element_id+'-'+key, className: 'volume-control', min: 0, max: 1, step: 0.1, value: this.state.value, onChange: this.kbVolControl.bind(null, this, 'audio-kit-'+this.props.options.element_id+'-'+key, 'volCol-kit-'+this.props.options.element_id+'-'+key)}),
                  React.createElement('i', {className:'fa fa-volume-up', onClick: this.kbmute.bind(null, this, 'audio-kit-'+this.props.options.element_id+'-'+key, 'volCol-kit-'+this.props.options.element_id+'-'+key)},'')
                )
              )
            ),
          ) : null;
          
        var td_title = (this.props.options.tabs.audio.cols.title == 1) ? React.createElement('td', {className: 'audio-data media-file-name'}, file_name) : null; 
        var td_tags = (this.props.options.tabs.audio.cols.tags == 1) ? React.createElement('td', {className: 'audio-data media-tags'}, media_tags) : null;
        var td_duration = (this.props.options.tabs.audio.cols.duration == 1) ? React.createElement('td', {className: 'audio-data duration'}, audio_time) : null;
        
        return React.createElement('tr', {className:'audio-row'},
          td_chk,
          td_audio,
          td_title,
          td_tags,
          td_duration,
        )
      });
    }
    
    var th_chk = (this.props.options.tabs.audio.cols.multi_asset_chk == 1) ? React.createElement('th', {className: 'mchk'},null, ) : null; 
    var th_audio = (this.props.options.tabs.audio.cols.audio == 1) ? React.createElement('th', {className: 'masset'}, null, ) : null; 
    var th_title = (this.props.options.tabs.audio.cols.title == 1) ? React.createElement('th', {className: 'sortempty media-title mtitle', onClick: this.sortColumn.bind(this)}, 'Title') : null; 
    var th_tags = (this.props.options.tabs.audio.cols.tags == 1) ? React.createElement('th', {className: 'sortempty media-title media-tag', onClick: this.sortColumn.bind(this)}, 'Tags') : null;
    var th_duration = (this.props.options.tabs.audio.cols.duration == 1) ? React.createElement('th', {className: 'sortempty media-title mfdd', onClick: this.sortColumn.bind(this)}, 'Duration') : null;
    var table_head = React.createElement('thead',{},
      React.createElement('tr', null,
        th_chk,
        th_audio,
        th_title,
        th_tags,
        th_duration,
      )
    );
   
    var table_body = React.createElement('tbody', null, items);
    var table_footer = React.createElement('tfoot', {id: 'duplicate-body'});
    var table_data = React.createElement('table', {className: 'media-table', id: 'table-audio-'+this.props.options.element_id}, table_head, table_body, table_footer);
    
    var updatediv = React.createElement('div', {className: 'd-none', id: 'audio-'+this.props.options.element_id+'-refresh', onClick: this.UpdateMethod.bind()}, 'refresh');
    
    return (
      React.createElement("div", {}, table_data, updatediv)
    )
  },
  UpdateMethod: function() {
    var th = this;
    jQuery('table#table-audio-'+th.props.options.element_id+' tfoot').empty();
    jQuery('table#table-audio-'+th.props.options.element_id+' tbody').removeClass('d-none');
    jQuery('table#table-audio-'+th.props.options.element_id+' tbody tr').show();
    jQuery('table#table-audio-'+th.props.options.element_id+' thead tr th').removeClass('bg-sort');
    jQuery('table#table-audio-'+th.props.options.element_id+' tbody tr td').removeClass('sorted');
    //Force a render with a simulated state change
    media_kit_id = jQuery('#mediakitid-'+this.props.options.element_id).val();
    media_kit_url = th.props.base_url+"/node/"+media_kit_id+"?_format=json";

    this.serverRequest = 
      axios.get(media_kit_url)
        .then(function(result) {    
            return result.data.field_vault_audio;
        })
        .then(function(response) {
           return Promise.all(response.map( (record, index) => {
             return axios.get(th.props.base_url+'/media/'+record.target_id+'/edit?_format=json');
           }))
        })
        .then(function(responsex) {
          th.setState({audios: responsex});
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
    Array.from(table.querySelectorAll('tr.audio-row'))
      .sort(comparer(Array.from(t.parentNode.children).indexOf(t), t.asc = !t.asc))
      .forEach(tr => table.appendChild(tr) );
    */

    //adding class to sorted column
    jQuery('#'+tableid+' td').removeClass('sorted');
    var ind = jQuery(t).index() + 1;
    jQuery('#'+tableid+' td:nth-child('+ind+')').addClass('sorted');
  },
  playAudio: function(appInstance, id, idcontrol) {
    //Pause all audio
    var kbAudio = document.getElementById(id);
    var audios = document.getElementsByTagName('audio');
    var sound = document.getElementById(idcontrol);
    kbAudio.volume = 1;
    jQuery(sound).css('background-image',
      '-webkit-gradient(linear, left top, right top, '
      + 'color-stop(' + kbAudio.volume + ', #fe5819), '
      + 'color-stop(' + kbAudio.volume + ', #ccc)'
      + ')'
    );
    appInstance.setState({value: 1})
    for(var i = 0, len = audios.length; i < len;i++){
      if(audios[i] != kbAudio){
        audios[i].pause();
        jQuery(audios[i]).parent().removeClass('playing');
        jQuery(audios[i]).parent().addClass('pause');
      }else if (kbAudio.duration > 0 && !kbAudio.paused) {
        kbAudio.pause();
       jQuery(audios[i]).parent().removeClass('playing');
       jQuery(audios[i]).parent().addClass('pause');
      }else if( kbAudio.duration > 0 && kbAudio.paused ) {
        kbAudio.play();
        jQuery(audios[i]).parent().removeClass('pause');
        jQuery(audios[i]).parent().addClass('playing');
      }
    }
  },
  kbVolControl: function(appInstance, idaudio, idcontrol) {
    var sound = document.getElementById(idcontrol);
    document.getElementById(idaudio).volume = sound.value;
    //console.log('vc:'+sound.value);
    appInstance.setState({value: sound.value})
    jQuery(sound).css('background-image',
      '-webkit-gradient(linear, left top, right top, '
      + 'color-stop(' + sound.value + ', #fe5819), '
      + 'color-stop(' + sound.value + ', #ccc)'
      + ')'
    );
  },
  kbmute: function(appInstance, idaudio, idcontrol){
    var mutedVol = 0;
    var kbAudio = document.getElementById(idaudio);
    var sound = document.getElementById(idcontrol);
    kbAudio.muted = !kbAudio.muted;
    if(!kbAudio.muted){
      appInstance.setState({value: kbAudio.volume});
      jQuery(sound).css('background-image',
        '-webkit-gradient(linear, left top, right top, '
        + 'color-stop(' + kbAudio.volume + ', #fe5819), '
        + 'color-stop(' + kbAudio.volume + ', #ccc)'
        + ')'
      );
    }else{
      appInstance.setState({value: mutedVol});
      jQuery(sound).css('background-image',
        '-webkit-gradient(linear, left top, right top, '
        + 'color-stop('+ mutedVol +', #fe5819), '
        + 'color-stop('+ mutedVol +', #ccc)'
        + ')'
      );
    }
  }
});