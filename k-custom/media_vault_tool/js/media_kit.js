(function ($, Drupal, drupalSettings) {
  var initialized;
  Drupal.behaviors.MediaBehavior = {
    attach: function (context, settings) {
      if (!initialized) {
        initialized = true;
        var media_vault_id = drupalSettings.media_vault_id;
        var media_base_url = drupalSettings.media_base_url;
        var media_base_url_http = drupalSettings.media_base_url_http;
        var media_kit_id = drupalSettings.media_kit_id;
        var default_media_kit_id = drupalSettings.default_media_kit_id;
        var media_kit_title = drupalSettings.media_kit_title;
        var media_kit_uid = drupalSettings.media_kit_uid;
        var path_userid = drupalSettings.path_userid;
        var kit_owner = drupalSettings.kit_owner;
        var kit_id_from_url = drupalSettings.kit_id_from_url;
        var user_first_custom_kit_id = drupalSettings.user_first_custom_kit_id;
        var user_first_custom_kit_title = drupalSettings.user_first_custom_kit_title;
				var user_custom_mkit_count = drupalSettings.user_custom_mkit_count;
        var user_roles = drupalSettings.user_roles.split(',');
        var url = media_base_url+"/node/"+media_vault_id+"?_format=json";
				//var first_kit_create_flag = false;
				if(user_custom_mkit_count == 1 && kit_id_from_url == default_media_kit_id){
					var media_kit_url = media_base_url+'/node/'+user_first_custom_kit_id+'?_format=json';
					jQuery('#mediakitid').val(user_first_custom_kit_id);
					jQuery('#mediakitTitle').val(user_first_custom_kit_title);
					jQuery("#media_kit_title").text(user_first_custom_kit_title);
					setTimeout(function() {
						history.pushState('', '', user_first_custom_kit_id);
					}, 10);
				} else {
					var media_kit_url = media_base_url+'/node/'+media_kit_id+'?_format=json';	
					jQuery('#mediakitid').val(media_kit_id);
					jQuery('#mediakitTitle').val(media_kit_title);
					jQuery("#media_kit_title").text(media_kit_title);
				}
				var u = window.location.href;
				var f = u.split('#');
        var disable_check = true;
        if(jQuery.inArray('administrator', user_roles ) !== -1 || (media_kit_uid == path_userid)){
          disable_check = default_media_kit_id == media_kit_id ? true : false;
        }
        var default_checked = false;
        jQuery('body').append('<div id="overlay"><div class="km-loader"></div></div>');
        //Media kit Delete Modal 
        let DeleteKitModal = React.createClass({
          componentDidMount: function() {
              jQuery(this.getDOMNode()).modal('show');
              jQuery(this.getDOMNode()).on('hidden.bs.modal', this.props.handleHideModal);
          },
          render: function() {
						var msg = '';
						var modal_hide = this.closeModal.bind();
						var processBtn = this.props.processBtn;
						var kitguide = this.props.kitguide;
						//console.log(kitguide);
						var entity_title = this.props.KitTitle;
						if((this.props.reference_list).length > 0){
							var h_title = 'Delete: Media Kit';
							var list = this.props.reference_list.map((item, key) => {
								return React.createElement('li', {},
											React.createElement('a', {href:'/tools/kaboodle/'+item.entity_id, className: 'text-capitalize'}, item.title),
										);
							});
							var msg = React.createElement('div', {className: 'node-delete-refs'}, 
								React.createElement('div', null, '"'+entity_title+'" is currently in use by the following content:', 
									React.createElement('ul', {className: 'kit-refs'}, list),				
								), React.createElement('div', null, 'We recommend you first update those features with another Media Kit. If you click "DELETE" we will remove the "'+entity_title+'" from the listed features and delete the Media Kit.')
							);
						} else if(kitguide == true){
							var modal_hide = this.closeGuideModal.bind();
							var h_title = '';
							var msg = React.createElement('div', {className: 'kit-guide'}, 
								React.createElement('div', null, "Welcome to the Media Kits Manager.  While the Media Vault contains ALL of your assets, Media Kits are subsets.  If you maintain a large number of assets, it can be unwieldy to have to scroll through all of them when working on a particular post (or project, or print piece).  Here you can create Media Kits so that you're only working with the relevant assets.", 
									React.createElement('br', null, null),
									React.createElement('br', null, null),
									React.createElement('div', null, 'A few examples of Media Kit uses:'),
									React.createElement('ul', {className: 'kit-refs'}, 
										React.createElement('li', null, 'Images from a recent photo shoot'),
										React.createElement('li', null, 'Images specifically for use in FaceBook posts'),
										React.createElement('li', null, 'Marketing text files for a specific client'),
									),				
								), 
							);
						} else {
							var h_title = 'Delete: Media Kit';
							var msg = 'Are you sure you want to delete the "'+entity_title+'" Media Kit? This action is permanent.';
						}
            //var btnCancel = React.createElement('button', {type: 'button', className: 'btn btn-default', onClick:this.closeModal.bind()},'Cancel');
            return (
                React.createElement('div', {id: 'delete-kit-modal', className: 'modal fade'}, 
                  React.createElement('div', {className: 'modal-dialog'},
                    React.createElement('div', {className: 'modal-content'},
                      React.createElement('div', {className: 'modal-header justify-content-center'},
                        React.createElement('h4', {className: 'modal-title f-24'}, h_title)
                      ),
                      React.createElement('div', {className: 'modal-body'}, msg),
                      React.createElement('div', {className: 'modal-footer'},
                        //btnCancel,
                        React.createElement('button', {type: 'button', className: 'l-spacing btn text-uppercase font-fjalla color-blue', onClick: modal_hide}, 'Cancel'),
                        React.createElement('button', {type: 'button', className: 'btn btn-primary', onClick: this.props.handleDelete}, processBtn)
                      )
                    )
                  )
                )
            );
          },
          closeModal : function(){
            jQuery('#delete-kit-modal').modal('hide');						
          },
					closeGuideModal : function(){
            var href = jQuery('#media_vault_title').attr('href');
						window.location.href = href;					
          },
          propTypes:{
            handleHideModal: React.PropTypes.func.isRequired
          }
        });
        
        //VideoPlayer Modal
        let VideoPlayer = React.createClass({
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
                      React.createElement('i', {className:"fa fa-times"})
                    ),
                    React.createElement('div', {className: 'spinner-border'}),
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
            );
          },
          propTypes:{
            handleHideVideoPlayer: React.PropTypes.func.isRequired,
          }
        });
        
        //Media Filename
        var AppFileName = React.createClass({
          getInitialState: function() {
            return {
              value: '-',
            }
          },
          componentWillMount: function() {
            var th = this;
            this.serverRequest = 
              axios.get(media_base_url+'/rest/api/file/'+this.props.fid+'?_format=json')
                .then(function(result) { 
                  th.setState({value: result.data.filename[0].value});
                })
          },
          componentWillReceiveProps: function(nextProps) {
            if(this.props.fid != nextProps.fid){
              var th = this;
              this.serverRequest = 
                axios.get(media_base_url+'/rest/api/file/'+nextProps.fid+'?_format=json')
                  .then(function(result) { 
                    th.setState({value: result.data.filename[0].value});
                  })
            }    
          },
          render: function() {
            return React.createElement('span', {}, this.state.value);
          },
        });
        
        //File extention component
        var AppExtention = React.createClass({
          getInitialState: function() {
            return {
              fileExtension: '',
            }
          },
          componentWillMount: function() {
            var th = this;
						if(this.props.fid != ''){
							this.serverRequest = 
								axios.get(media_base_url+'/rest/api/file/'+this.props.fid+'?_format=json')
									.then(function(result) { 
										if(result.data.filename.length > 0 && result.data.filename[0].value !== ''){
											th.setState({fileExtension: result.data.filename[0].value});
										}
									})
						}
          },
          componentWillReceiveProps: function(nextProps) {
            if(this.props.fid != nextProps.fid){
              var th = this;
              this.serverRequest = 
                axios.get(media_base_url+'/rest/api/file/'+nextProps.fid+'?_format=json')
                  .then(function(result) { 
                    th.setState({fileExtension: result.data.filename[0].value});
                  })
            }      
          },
          render: function() {
						if(this.props.fid != ''){
							var extName = (this.state.fileExtension).split('.').pop();
						} else if(this.props.ext != ''){
							var extName = (this.props.ext).split('.').pop();
						} else {							
							var extName = '-';
						}
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
            return React.createElement('span', {}, extName);
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
            return React.createElement('span', {className: ''}, this.state.audio_time);
          },
        });
        
        //File size
        var AppFileSize = React.createClass({
          getInitialState: function() {
            return {
              value: '-',
            }
          },
          componentWillMount: function() {
            var th = this;
            this.serverRequest = 
              axios.get(media_base_url+'/rest/api/file/'+this.props.fid+'?_format=json')
                .then(function(result) { 
                  th.setState({value: result.data.filesize[0].value});
                })
          },
          componentWillReceiveProps: function(nextProps) {
            if(this.props.fid != nextProps.fid){
              var th = this;
              this.serverRequest = 
                axios.get(media_base_url+'/rest/api/file/'+nextProps.fid+'?_format=json')
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
            return React.createElement('span', {className: ''}, bytes);
          },
        });
        
        //Text Reader Modal
        let textReader = React.createClass({
          componentDidMount: function() {
              jQuery(this.getDOMNode()).modal('show');
              jQuery(this.getDOMNode()).on('hidden.bs.modal', this.props.hideTextReaderModal);
          },
          render: function() {
            return (
                React.createElement('div', {id: 'modal', className: 'modal fade text-reader'},
                  React.createElement('div', {className: 'modal-dialog'},
                    React.createElement('div', {className: 'modal-content'},
                      React.createElement('div', {className: 'modal-body'},
                        React.createElement('iframe', {className: 'text', src: 'https://docs.google.com/gview?url='+this.props.textFileURL+'&embedded=true', width: '100%', height: '500px'})
                      )
                    )
                  )
                )
              );
          },
          propTypes:{
            hideTextReaderModal: React.PropTypes.func.isRequired
          }
        });
        
        //Audio data secion
        var AppAudio = React.createClass({
          getInitialState: function() {
             return {
              audios: [],
            }
          },
          componentWillMount: function() {
            var th = this;
            this.serverRequest = 
              axios.get(url)
                .then(function(result) {    
                    return result.data.field_vault_audio;
                })
                .then(function(response) {
                   return Promise.all(response.map( (record, index) => {
                     return axios.get(media_base_url+'/media/'+record.target_id+'/edit?_format=json');
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
						/* if(jQuery("#status-dialog #status-d-content").length && jQuery.trim(jQuery("#status-dialog #status-d-content").text()) !== ''){
							var msg = jQuery("#status-d-content").text();
							console.log("success");
							jQuery("#status-modal .modal-body").html(msg);
							jQuery('#status-modal').modal('show');
						} */
						this.state.audios.sort((a, b) => a.data.name[0].value.localeCompare(b.data.name[0].value));
            var items = this.state.audios.map((item, key) => {
              //condition to not list archived data
              if(item.data.field_archived[0].value == false){
                //File type
                let app_extention = '-';
								if(item.data.field_media_audio_file.length && item.data.field_media_audio_file[0].target_id != ''){
									var ext = (item.data.field_format.length > 0) ? item.data.field_format[0].value : '';
									var fid = (item.data.field_media_audio_file.length > 0) ? item.data.field_media_audio_file[0].target_id : '';
								  app_extention = React.createElement(AppExtention, {ext:ext, fid:fid, get_type_col: false});
								}
                
                //Audio Time
								if((item.data.field_duration).length > 0){
									var audio_time = item.data.field_duration[0].value;
								} else {
									var audio_time = '-';//React.createElement(AudioTime, {audioURL: item.data.field_media_audio_file[0].url}); 
								}
                
                //File size
								var file_size = '-';
								if((item.data.field_file_size).length > 0 && item.data.field_media_audio_file.length && item.data.field_media_audio_file[0].target_id != ''){
									file_size = item.data.field_file_size[0].value;
								} else {
									if((item.data.field_media_audio_file).length > 0 && item.data.field_media_audio_file.length && item.data.field_media_audio_file[0].target_id != ''){
										file_size = React.createElement(AppFileSize, {fid: item.data.field_media_audio_file[0].target_id});
									}
								}
								
								let file_url = '';
								if(item.data.field_media_audio_file.length && item.data.field_media_audio_file[0].original_url != ''){
									file_url = item.data.field_media_audio_file[0].original_url;
								}
                
                return React.createElement('tr', {className:'media-row audio-row'},
                  React.createElement('td', {className: 'audio-data', style:{'padding-top': '0px'}},
                    React.createElement('label', {className: 'checkbox-container'},
                      React.createElement('input',{type: 'checkbox', id: 'audio-check-'+key, className: 'box-check box-vault-check-audio check-selected-vault', 'data-mid': item.data.mid[0].value, 'disabled': disable_check, defaultChecked: default_checked}),
                      React.createElement('span', {className: 'checkmark'})
                    )
                  ),
                  React.createElement('td', {className: 'audio-data d-flex justify-content-center align-items-center'},
                    React.createElement('div', {className: 'audio-box'},
                      React.createElement("audio", {id: 'audio-'+key, controls:"controls", style:{width: '0px', height: '0px', visibility:'hidden', 'display':'none'}}, 
                        React.createElement('source', {src:file_url},'')
                      ),
                      React.createElement('button', {type: 'button', className: 'audio-play-button', onClick: this.playAudio.bind(null, this, 'audio-'+key, 'volCol-'+key)},''),
                      React.createElement('div', {className:'vol-box'},
                        React.createElement('div', {className:'vol-box-inner'},
                          React.createElement('input', {type: 'range', id:'volCol-'+key, className: 'volume-control', min: 0, max: 1, step: 0.1, value: this.state.value, onChange: this.kbVolControl.bind(null, this, 'audio-'+key, 'volCol-'+key)}),
                          React.createElement('i', {className:'fa fa-volume-up', onClick: this.kbmute.bind(null, this, 'audio-'+key, 'volCol-'+key)},'')
                        )
                      )
                    )
                  ),
									React.createElement('td', {className: 'sorted audio-data media-file-name'}, item.data.name[0].value),
                  React.createElement('td', {className: 'audio-data'}, app_extention),
                  React.createElement('td', {className: 'audio-data'}, audio_time),
                  React.createElement('td', {className: 'audio-data'}, file_size)
                );
              }
            });
            
            var table_head = React.createElement('thead',{},
              React.createElement('tr', null,
                React.createElement('th', null, 
									React.createElement('label', {className: 'checkbox-container'},
                    React.createElement('input',{type: 'checkbox', id: 'add-all-audio', className: 'box-check check-all check-all-audio', 'disabled': disable_check, defaultChecked: default_checked}),
                    React.createElement('span', {className: 'checkmark', style: {'margin-left':'-4px', 'margin-top': '-4px'}})
                  )
                ),
                React.createElement('th', null),
                React.createElement('th', {className: 'bg-sort sortempty asc-icon media-title', onClick: this.sortColumn.bind(this), style:{'width':'30%'}}, 'Title'),
                React.createElement('th', null, 'Format'),
                React.createElement('th', null, 'Duration'),
                React.createElement('th', null, 'Size')
              )
            );
            
            var table_body = React.createElement('tbody', null, items);
            
            return (
              //React.createElement('h3', null, 'Hello1')
              React.createElement('table',{className: 'media-table'},table_head,table_body)
            );
          },
					sortColumn: function(e){
						var th = this;
						var t = e.target;
            const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
            const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
              v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
              )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
						const table = t.closest('table');
						var tableid = jQuery(t.closest('table').parentNode).attr('id');
						jQuery('#'+tableid+' thead tr th').removeClass('bg-sort');
						jQuery('#'+tableid+' thead tr th').removeClass('asc-icon');
						jQuery('#'+tableid+' thead tr th').removeClass('desc-icon');
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
            Array.from(table.querySelectorAll('tr.media-row'))
              .sort(comparer(Array.from(t.parentNode.children).indexOf(t), t.asc = !t.asc))
              .forEach(tr => table.appendChild(tr) );
	
            //adding class to sorted column
            jQuery('#'+tableid+' td').removeClass('sorted');
            var table_id = jQuery(t.closest('table').parentNode).attr('id');
            var ind = jQuery(t).index() + 1;
            jQuery('#'+table_id+' td:nth-child('+ind+')').addClass('sorted');
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
        React.render(
          React.createElement(AppAudio, {}), document.querySelector("#audio-content-section")
        );
        
        //Photo data secion
        var AppPhoto = React.createClass({
          getInitialState: function() {
            return {
              photos: [],
            }
          },
          componentWillMount: function(){
            var th = this;
            this.serverRequest = 
              axios.get(url)
                .then(function(result) {    
                    return result.data.field_vault_photo;
                })
                .then(function(response) {
                   return Promise.all(response.map( (record, index) => {
                     return axios.get(media_base_url+'/media/'+record.target_id+'/edit?_format=json');
                   }))
                })
                .then(function(responsex) {
                  th.setState({photos: responsex});
                });   
          },
          componentWillUnmount: function() {
            this.serverRequest.abort();
          },
          render: function() {
            var counter = 0;
						this.state.photos.sort((a, b) => a.data.name[0].value.localeCompare(b.data.name[0].value));
            var items = this.state.photos.map((item, key) => {
              if(item.data.field_archived[0].value == false){
                counter += 1;
                //File name
								let file_name = '-';
								if((item.data.name).length > 0){
									file_name = item.data.name[0].value;
								} else {
									if(item.data.field_media_image.length && item.data.field_media_image[0].target_id != ''){
										file_name = React.createElement(AppFileName, {fid: item.data.field_media_image[0].target_id});
									}
								}
                
                //File type
								let app_extention = '-';
								if(item.data.field_media_image.length && item.data.field_media_image[0].target_id != ''){
									var ext = (item.data.field_format.length > 0) ? item.data.field_format[0].value : '';
									var fid = (item.data.field_media_image.length > 0) ? item.data.field_media_image[0].target_id : '';
								  app_extention = React.createElement(AppExtention, {ext:ext, fid:fid, get_type_col: false});
								}
                
                //File size
								var file_size = '-';
								if((item.data.field_file_size).length > 0 && item.data.field_media_image.length && item.data.field_media_image[0].target_id != ''){
									file_size = item.data.field_file_size[0].value;
								} else {
									if((item.data.field_media_image).length > 0 && item.data.field_media_image[0].target_id != ''){
										file_size = React.createElement(AppFileSize, {fid: item.data.field_media_image[0].target_id});
									}
								}
								
								let file_url = '';
								let image_style = '';
								if(item.data.field_media_image.length && item.data.field_media_image[0].target_id != ''){
									file_url = item.data.field_media_image[0].original_url;
									image_style = item.data.field_media_image[0].image_style;
								}

                return React.createElement('tr', {className:'media-row',  'data-exthumbimage': item.data.field_media_image[0].image_style, 'data-src': item.data.field_media_image[0].modal_style_url},
                  React.createElement('td', {className: 'media-data text-center'},
                    React.createElement('label', {className: 'checkbox-container'},
                      React.createElement('input',{type: 'checkbox', id: 'audio-check-'+key, className: 'box-check box-vault-check-photo check-selected-vault', 'data-mid': item.data.mid[0].value, 'disabled': disable_check, defaultChecked: default_checked}),
                      React.createElement('span', {className: 'checkmark'})
                    )
                  ),
                  React.createElement('td', {className: 'media-data media-data-col-name'},
                    React.createElement("div", {id: key, className:"media-box"}, 
                      React.createElement('img', {src:image_style}),
                      React.createElement('div', {className: 'overlay'},
                        React.createElement('button', {type: 'button', className: 'preview-icon', onClick: this.ShowPhotomodal.bind(null)}, '')
                      )
                    )
                  ),
                  React.createElement('td', {className: 'sorted media-data media-file-name'}, file_name),
                  React.createElement('td', {className: 'media-data'}, app_extention),
                  React.createElement('td', {className: 'media-data'}, file_size)
                );
              }  
            });
            
            var table_head = React.createElement('thead',{},
              React.createElement('tr', null,
                React.createElement('th', null, 
									React.createElement('label', {className: 'checkbox-container'},
                    React.createElement('input',{type: 'checkbox', id: 'add-all-photo', className: 'box-check check-all check-all-photo', 'disabled': disable_check, defaultChecked: default_checked}),
                    React.createElement('span', {className: 'checkmark', style: {'margin-left':'-4px', 'margin-top': '-4px'}})
                  )
                ),
								React.createElement('th', null),
                React.createElement('th', {className: 'bg-sort sortempty asc-icon media-title', onClick: this.sortColumn.bind(this), style:{'width':'30%'}}, 'Title'),
                React.createElement('th', null, 'Format'),
                React.createElement('th', null, 'Size')
              )
            );
            var table_body = React.createElement('tbody', {id: 'media_photo_gallery'}, items);
            return (
              React.createElement('table',{className: 'media-table'},table_head,table_body)
            );
          },
					sortColumn: function(e){
						var th = this;
						var t = e.target;
            const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
            const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
              v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
              )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
						const table = t.closest('table');
						var tableid = jQuery(t.closest('table').parentNode).attr('id');
						jQuery('#'+tableid+' thead tr th').removeClass('bg-sort');
						jQuery('#'+tableid+' thead tr th').removeClass('asc-icon');
						jQuery('#'+tableid+' thead tr th').removeClass('desc-icon');
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
            Array.from(table.querySelectorAll('tr.media-row'))
              .sort(comparer(Array.from(t.parentNode.children).indexOf(t), t.asc = !t.asc))
              .forEach(tr => table.appendChild(tr) );
	
            //adding class to sorted column
            jQuery('#'+tableid+' td').removeClass('sorted');
            var table_id = jQuery(t.closest('table').parentNode).attr('id');
            var ind = jQuery(t).index() + 1;
            jQuery('#'+table_id+' td:nth-child('+ind+')').addClass('sorted');
          },
          ShowPhotomodal: function(e){
            var $gallery = jQuery('#media_photo_gallery').lightGallery({
              width: '880px',
              height: '720px',
              addClass: 'fixed-size',
              counter: false,
              download: false,
              enableSwipe: false,
              enableDrag: false,
              download: false,
              share: false,
              autoplay: false,
              thumbMargin : 17,
              autoplayControls: false,
              fullScreen: false,
              zoom: false,
              actualSize: false,
              toogleThumb: false,
              thumbWidth: 94,
              thumbContHeight: 118,
              exThumbImage: 'data-exthumbimage',
            });
						jQuery(e.target).trigger('click');
            $gallery.on('onCloseAfter.lg',function(event, index, fromTouch, fromThumb){
              try{$gallery.data('lightGallery').destroy(true);}catch(ex){};
            });
          }
        });
        React.render(
          React.createElement(AppPhoto, {}), document.querySelector("#photo-content-section")
        );
        
        //Text data secion
        var AppText = React.createClass({
          getInitialState: function() {
            return {
              texts: [],
              showTextModal: false,
              textFileURL: '',
              mid: '',
            }
          },
          componentWillMount: function() {
            var th = this;
            this.serverRequest = 
              axios.get(url)
                .then(function(result) {    
                    return result.data.field_vault_file;
                })
                .then(function(response) {
                   return Promise.all(response.map( (record, index) => {
                     return axios.get(media_base_url+'/media/'+record.target_id+'/edit?_format=json');
                   }))
                })
                .then(function(responsex) {
                  th.setState({texts: responsex});
                });
          },
          componentWillUnmount: function() {
            this.serverRequest.abort();
          },   
          render: function() {
            if (this.state.showTextModal) {
              var textReaderElement = React.createElement(textReader, {hideTextReaderModal: this.hideTextReaderModal, textFileURL: this.state.textFileURL});
            }
						this.state.texts.sort((a, b) => a.data.name[0].value.localeCompare(b.data.name[0].value));
            var items = this.state.texts.map((item, key) => {
              if(item.data.field_archived[0].value == false){
                //File name
								let file_name = '-';
								if((item.data.name).length > 0){
									file_name = item.data.name[0].value;
								} else {
									if(item.data.field_media_file.length && item.data.field_media_file[0].target_id != ''){
										file_name = React.createElement(AppFileName, {fid: item.data.field_media_file[0].target_id});
									}
								}
                
								//File type
								let app_extention = '-';
								if(item.data.field_media_file.length && item.data.field_media_file[0].target_id != ''){
									var ext = (item.data.field_format.length > 0) ? item.data.field_format[0].value : '';
									var fid = (item.data.field_media_file.length > 0) ? item.data.field_media_file[0].target_id : '';
								  app_extention = React.createElement(AppExtention, {ext:ext, fid:fid, get_type_col: true});
								}
                
								//File size
								var file_size = '-';
								if((item.data.field_file_size).length > 0 && item.data.field_media_file.length && item.data.field_media_file[0].target_id != ''){
									file_size = item.data.field_file_size[0].value;
								} else {
									if((item.data.field_media_file).length > 0 && item.data.field_media_file[0].target_id != ''){
										file_size = React.createElement(AppFileSize, {fid: item.data.field_media_file[0].target_id});
									}
								}
								
								let file_url = '';
								let target_id = '';
								if(item.data.field_media_file.length && item.data.field_media_file[0].target_id != ''){
									file_url = item.data.field_media_file[0].original_url;
									target_id = item.data.field_media_file[0].target_id;
								}

                return React.createElement('tr', {className:'media-row'},
                  React.createElement('td', {className: 'media-data text-center'},
                    React.createElement('label', {className: 'checkbox-container'},
                      React.createElement('input',{type: 'checkbox', id: 'audio-check-'+key, className: 'box-check box-vault-check-text check-selected-vault', 'data-fid': target_id, 'data-mid': item.data.mid[0].value, 'disabled': disable_check, defaultChecked: default_checked}),
                      React.createElement('span', {className: 'checkmark'})
                    )
                  ),
                  React.createElement('td', {className: 'media-data media-data-col-name'},
                    React.createElement("div", {id: key, className:"media-box text-box"}, 
                      React.createElement('button', {type: 'button', className: 'text-read-button', onClick: this.showTextModal.bind(null, file_url)},'')
                    )
                  ),
                  React.createElement('td', {className: 'sorted media-data media-file-name'}, file_name),
                  React.createElement('td', {className: 'media-data'}, app_extention),
                  React.createElement('td', {className: 'media-data'}, file_size)
                );
              }  
            });
            var table_head = React.createElement('thead',{},
              React.createElement('tr', null,
                React.createElement('th', null, 
									React.createElement('label', {className: 'checkbox-container'},
                    React.createElement('input',{type: 'checkbox', id: 'add-all-text', className: 'box-check check-all check-all-text', 'disabled': disable_check, defaultChecked: default_checked}),
                    React.createElement('span', {className: 'checkmark', style: {'margin-left':'-4px', 'margin-top': '-4px'}})
                  )
                ),
								React.createElement('th', null),
                React.createElement('th', {className: 'bg-sort sortempty asc-icon media-title', onClick: this.sortColumn.bind(this), style:{'width':'30%'}}, 'Title'),
                React.createElement('th', null, 'Format'),
                React.createElement('th', null, 'Size')
              )
            );
            var table_body = React.createElement('tbody', null, items);
            return ( 
              React.createElement('table',{className: 'media-table'},table_head,table_body, textReaderElement)
            );
          },
					sortColumn: function(e){
						var th = this;
						var t = e.target;
            const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
            const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
              v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
              )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
						const table = t.closest('table');
						var tableid = jQuery(t.closest('table').parentNode).attr('id');
						jQuery('#'+tableid+' thead tr th').removeClass('bg-sort');
						jQuery('#'+tableid+' thead tr th').removeClass('asc-icon');
						jQuery('#'+tableid+' thead tr th').removeClass('desc-icon');
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
            Array.from(table.querySelectorAll('tr.media-row'))
              .sort(comparer(Array.from(t.parentNode.children).indexOf(t), t.asc = !t.asc))
              .forEach(tr => table.appendChild(tr) );
	
            //adding class to sorted column
            jQuery('#'+tableid+' td').removeClass('sorted');
            var table_id = jQuery(t.closest('table').parentNode).attr('id');
            var ind = jQuery(t).index() + 1;
            jQuery('#'+table_id+' td:nth-child('+ind+')').addClass('sorted');
          },
          showTextModal: function(fileURL){
            this.setState({showTextModal: true});
            this.setState({textFileURL: fileURL });
          },
          hideTextReaderModal: function(){
            this.setState({showTextModal: false});
            this.setState({textFileURL: '' });
          }
        });
        React.render(
          React.createElement(AppText, {}), document.querySelector("#text-content-section")
        );

        //Video data secion
         var AppVideo = React.createClass({
          getInitialState: function() {
            return {
              video: [],
              showModal: false,
              singlecheckVideo: false,
              fileType: '',
              fileURL: '',
              mid: '',
              base_url: media_base_url,
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
            var th = this;
            this.serverRequest = 
              axios.get(url)
                .then(function(result) {    
                    return result.data.field_vault_video;
                })
                .then(function(response) {
                   return Promise.all(response.map( (record, index) => {
                     return axios.get(media_base_url+record.url +'?_format=json');
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
            if (this.state.videoplayer) {
              var videoPlayerElement = React.createElement(VideoPlayer, {
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
            const rowLen = this.state.video.length;
						this.state.video.sort((a, b) => a.data.name[0].value.localeCompare(b.data.name[0].value));
            var items = this.state.video.map((item, key) => {
              if(item.data.field_archived[0].value == false){
                //File name
								let file_name = '-';
								if((item.data.name).length > 0){
									file_name = item.data.name[0].value;
								} else {
									if(item.data.field_media_video_file.length && item.data.field_media_video_file[0].target_id != ''){
										file_name = React.createElement(AppFileName, {fid: item.data.field_media_video_file[0].target_id});
									}
								}
                
                //File type
								let app_extention = '-';
								if(item.data.field_media_video_file.length && item.data.field_media_video_file[0].target_id != ''){
									var ext = (item.data.field_format.length > 0) ? item.data.field_format[0].value : '';
									var fid = (item.data.field_media_video_file.length > 0) ? item.data.field_media_video_file[0].target_id : '';
								  app_extention = React.createElement(AppExtention, {ext:ext, fid:fid, get_type_col: false});
								}
                
                //File size
								var file_size = '-';
								if((item.data.field_file_size).length > 0 && item.data.field_media_video_file.length && item.data.field_media_video_file[0].target_id != ''){
									file_size = item.data.field_file_size[0].value;
								} else {
									if((item.data.field_media_video_file).length > 0 && item.data.field_media_video_file[0].target_id != ''){
										file_size = React.createElement(AppFileSize, {fid: item.data.field_media_video_file[0].target_id});
									}
								}
								
								var file_obj_original_url = '';
								var file_obj_url = '';
								var file_obj_target_id = '';
								var file_obj_image_style = '';
								if(item.data.field_media_video_file.length && item.data.field_media_video_file[0].target_id != ''){
									file_obj_image_style = item.data.field_media_video_file[0].image_style;
									file_obj_original_url = item.data.field_media_video_file[0].original_url;
									file_obj_url = item.data.field_media_video_file[0].url;
									file_obj_target_id = item.data.field_media_video_file[0].target_id;
								}
								
								if(item.data.field_media_video_file.length && item.data.field_media_video_file[0].is_thumbnail){
                  //var video_thumb = React.createElement("video", {id: 'video-'+key}, 
                  //React.createElement('source', {src:file_obj_original_url, className: 'd-none'},''));
                  var video_thumb = React.createElement('img', {src:file_obj_image_style},'');
                } else {
                  var video_thumb = React.createElement("video", {id: 'video-'+key}, React.createElement('source', {src:file_obj_original_url},''));
                }

                return React.createElement('tr', {className:'media-row'},
                  React.createElement('td', {className: 'media-data text-center'},
                    React.createElement('label', {className: 'checkbox-container'},
                      React.createElement('input',{type: 'checkbox', id: 'audio-check-'+key, className: 'box-check box-vault-check-video check-selected-vault', 'data-mid': item.data.mid[0].value, 'disabled': disable_check, defaultChecked: default_checked}),
                      React.createElement('span', {className: 'checkmark'})
                    )
                  ),
                  React.createElement('td', {className: 'media-data media-data-col-name'},
                    React.createElement("div", {id: key, className:"media-box"}, 
                      video_thumb,
                      React.createElement('div', {className: 'overlay'},
                        React.createElement('button', {type: 'button', className: 'video-play round-button', onClick: this.ShowVideoPlayer.bind(null, file_obj_original_url, +key, +rowLen), style:{'display':'none'}}, '')
                      )
                    )
                  ),
                  React.createElement('td', {className: 'sorted media-data media-file-name'}, file_name),
                  React.createElement('td', {className: 'media-data'}, app_extention),
                  React.createElement('td', {className: 'media-data'}, file_size)
                );
              }  
            });
            var table_head = React.createElement('thead',{},
              React.createElement('tr', null,
                React.createElement('th', null, 
									React.createElement('label', {className: 'checkbox-container'},
                    React.createElement('input',{type: 'checkbox', id: 'add-all-video', className: 'box-check check-all check-all-video', 'disabled': disable_check, defaultChecked: default_checked}),
                    React.createElement('span', {className: 'checkmark', style: {'margin-left':'-4px', 'margin-top': '-4px'}})
                  )
                ),
								React.createElement('th', null),
                React.createElement('th', {className: 'bg-sort sortempty asc-icon media-title', onClick: this.sortColumn.bind(this), style:{'width':'30%'}}, 'Title'),
                React.createElement('th', null, 'Format'),
                React.createElement('th', null, 'Size')
              )
            );
            var table_body = React.createElement('tbody', null, items);
            return ( 
              React.createElement('table',{className: 'media-table'},table_head,table_body, videoPlayerElement)
            );
          },
					sortColumn: function(e){
						var th = this;
						var t = e.target;
            const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
            const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
              v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
              )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
						const table = t.closest('table');
						var tableid = jQuery(t.closest('table').parentNode).attr('id');
						jQuery('#'+tableid+' thead tr th').removeClass('bg-sort');
						jQuery('#'+tableid+' thead tr th').removeClass('asc-icon');
						jQuery('#'+tableid+' thead tr th').removeClass('desc-icon');
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
            Array.from(table.querySelectorAll('tr.media-row'))
              .sort(comparer(Array.from(t.parentNode.children).indexOf(t), t.asc = !t.asc))
              .forEach(tr => table.appendChild(tr) );
	
            //adding class to sorted column
            jQuery('#'+tableid+' td').removeClass('sorted');
            var table_id = jQuery(t.closest('table').parentNode).attr('id');
            var ind = jQuery(t).index() + 1;
            jQuery('#'+table_id+' td:nth-child('+ind+')').addClass('sorted');
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
        React.render(
          React.createElement(AppVideo, {}), document.querySelector("#video-content-section")
        );
        
        //Media Kits table secion
        var AppMediaKits = React.createClass({
          getInitialState: function() {
            return {
              mediakits: [],
              spinner_status: false,
              showModal: false,
              kitguide: false,
              mediaUpdateModal: false,
              KitTitle: '',
              Kitid: '',
              Kitrow_id: '',
              reference_list: [],
              refId: '',
              refTitle: '',
							counter: 0,
            }
          },
          componentWillMount: function() {
            var th = this;
            this.serverRequest = 
              axios.get(media_base_url+'/user/media_kits/'+kit_owner)
                .then(function(result) {    
                    return result.data;
                })
                .then(function(response) {
                   return Promise.all(response.map( (record, index) => {
                     return axios.get(media_base_url+'/node/'+record.nid+'?_format=json');
                   }))
                })
                .then(function(responsex) {
                  th.setState({mediakits: responsex});
									if(responsex.length == 1){
										th.setState({kitguide: true});
										th.setState({showModal: true});
									}
                });
          },
          componentWillUnmount: function() {
            this.serverRequest.abort();
          },
          render: function() {
            jQuery('#media-kit-modal').modal('hide');
						this.state.counter ++;
						if(this.state.counter == 2){
							jQuery('#crt-kit-btn').removeAttr('disabled');
              jQuery('#overlay').remove();
						}
            
            if(this.state.spinner_status){
              var spinner_process = React.createElement('div', {className:'progress-overlay'}, React.createElement('div', {className:'spinner-border'}));
            }
            
            if(this.state.showModal){
							if(this.state.kitguide) {
								var modalElement = React.createElement(DeleteKitModal, {handleHideModal: this.handleHideGuideModal, handleDelete: this.handleCreatekit, KitTitle: '', reference_list: [], processBtn: 'Create', kitguide: true});
							} else {
								var modalElement = React.createElement(DeleteKitModal, {handleHideModal: this.handleHideModal, handleDelete: this.handleDeletekit, KitTitle: this.state.KitTitle, reference_list: this.state.reference_list, processBtn: 'Delete', kitguide: false});
							}
						}
						
						/* if(mediaUpdateflag) {
              var updateMediaModalElement = React.createElement(updatedMediaModal, {});
            } */
            if(jQuery.inArray('administrator', user_roles ) !== -1 || (media_kit_uid == path_userid)){
              disable_check = default_media_kit_id == media_kit_id ? true : false;
            }
						if(disable_check){
							jQuery('.media-table .checkbox-container input[type=checkbox]').attr('disabled', 'disabled');
						} else {
							jQuery('.media-table .checkbox-container input[type=checkbox]').removeAttr('disabled');
						}
						
            this.state.mediakits.sort((a, b) => a.data.title[0].value.localeCompare(b.data.title[0].value));
            var items = this.state.mediakits.map((item, key) => {
							if(jQuery.inArray('administrator', user_roles ) == -1 && (default_media_kit_id == item.data.nid[0].value)){
								var media_edit_pensil = 'media-edit-inactive';
							} else {
								var media_edit_pensil = 'media-edit';
							}
							
              var active_mediakit = '';
							var tabname = jQuery("#vault-tabContent .tab-pane.active").attr('id');

              if(key == 0){
                var active_mediakit = 'bg-light';
              }
              //for favorite
              var favorite_inactive = 'inactive';
              if(Boolean(item.data.field_favorite[0].value)){
                favorite_inactive = '';
              }
              //for delete
							var actions = '';
							var kit_title = '';
              var trash_inactive = '';
              var heart_disabled = '';
              if(default_media_kit_id == item.data.nid[0].value && jQuery.inArray('administrator', user_roles ) == -1){
                heart_disabled = 'heart-disabled';
							}
              if(item.data.field_vault_audio.length == 0 && item.data.field_vault_photo.length == 0 && item.data.field_vault_file.length == 0 && item.data.field_vault_video.length == 0){
                trash_inactive = '';
              }
							var first_custom_kit_class = '';
							if(user_custom_mkit_count == 1 && default_media_kit_id !== item.data.nid[0].value){
								var first_custom_kit_class = 'first-custom-kit';
							}
              //deletion of the Default Media Kit should NOT be allowed 
              if(default_media_kit_id == item.data.nid[0].value){
                trash_inactive = 'inactive';
								var actions = '';
                var def_media_row = ' default-media-row';
								var kit_title = React.createElement('td', {className: 'sorted media-data'+first_custom_kit_class}, item.data.title[0].value);
							} else {
                var def_media_row = '';
								var kit_title = React.createElement('td', {className: 'sorted pointer media-data '+first_custom_kit_class, onClick: this.SwitchMediaKit.bind(null, item.data.nid[0].value)}, item.data.title[0].value);
								var actions = React.createElement('ul', {className: 'kit-actions'},
                      React.createElement('li', {},
                        React.createElement('a', {href:'/tools/media/kit/'+item.data.uid[0].target_id+'/'+item.data.nid[0].value+'/settings#'+tabname, className: 'round-button '+media_edit_pensil}, ''),
                      ),
											React.createElement('li', {},
                        //React.createElement('a', {href:'/tools/media/kit/'+item.data.uid[0].target_id+'/'+item.data.nid[0].value+'/clone', className: 'media-preset audio-round-button'}, '')
                        React.createElement('button', {onClick: this.handleCloneKit.bind(null, item.data.uid[0].target_id, item.data.nid[0].value, item.data.title[0].value), className: 'media-preset pointer audio-round-button'}, '')
                      ),
                      React.createElement('li', {},
                        React.createElement('button', {type: 'button', className: 'media-favo round-button '+heart_disabled+' '+favorite_inactive, onClick: this.handleFavorite.bind(null, item.data.nid[0].value, item.data.field_favorite[0].value, key)}, '')
                      ),
                      React.createElement('li', {},
                        React.createElement('button', {type: 'button', className: 'trash round-button '+trash_inactive, onClick: this.DeleteKit.bind(null, item.data.nid[0].value, key, item.data.title[0].value)})
                      )
										);
              }
							/* if(user_custom_mkit_count == 1 && kit_id_from_url == default_media_kit_id){
								console.log('ppppp');
								jQuery('#mkit-list-table td.media-data.first-custom-kit').trigger('click');
								//window.location.href = '/tools/media/kit/'+kit_owner+'/'+user_first_custom_kit_id;
							} */
							
              return React.createElement('tr', {id:"kit-"+item.data.nid[0].value, className:'media-row '+active_mediakit+def_media_row, 'data-kid': item.data.nid[0].value},
                /* React.createElement('td', {className: 'media-data text-center'},
                  React.createElement('span', {className: 'move-icon'}),
                ), */
                kit_title,
                React.createElement('td', {className: 'media-data'}, '-'),
                React.createElement('td', {className: 'audio-col media-data'}, item.data.field_vault_audio.length),
                React.createElement('td', {className: 'photo-col media-data'}, item.data.field_vault_photo.length),
                React.createElement('td', {className: 'text-col media-data'}, item.data.field_vault_file.length),
                React.createElement('td', {className: 'video-col media-data'}, item.data.field_vault_video.length),
                React.createElement('td', {className: 'media-data'}, actions),
              );
            });

            var table_head = React.createElement('thead',{},
            React.createElement('tr', null,
                React.createElement('th', {className: 'bg-sort asc-icon sortempty', onClick: this.sortColumn.bind(this)}, 'Name'),
                React.createElement('th', {className: 'sortempty', onClick: this.sortColumn.bind(this)}, 'Kaboodles' ),
                React.createElement('th', null, 'Audio' ),
                React.createElement('th', null, 'Images'),
                React.createElement('th', null, 'Docs'),
                React.createElement('th', null, 'Videos'),
                React.createElement('th', {className: "text-center"}, 'ACTIONS')
              )
            );
            var table_body = React.createElement('tbody', null, items);
            
            var updatediv = React.createElement('div', {className: 'd-none', id: 'media-kit-refresh', onClick: this.UpdateMethod.bind()}, 'refresh');
            var table_data = React.createElement('table',{id: 'mkit-list-table', className: 'media-table'},table_head,table_body);
            return ( 
              //React.createElement('table',{className: 'media-table'},table_head,table_body)
              React.createElement("div", {}, table_data, updatediv, spinner_process, modalElement) 
            );
          },
					sortColumn: function(e){
						var th = this;
						var t = e.target;
            const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
            const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
              v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
              )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
						const table = t.closest('table');
						//var tableid = jQuery(t.closest('table').parentNode).attr('id');
						jQuery('#media-kits-data thead tr th').removeClass('bg-sort');
						jQuery('#media-kits-data thead tr th').removeClass('asc-icon');
						jQuery('#media-kits-data thead tr th').removeClass('desc-icon');
						//jQuery('#media-kits-data td').removeClass('sorted');
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
            Array.from(table.querySelectorAll('tr.media-row'))
              .sort(comparer(Array.from(t.parentNode.children).indexOf(t), t.asc = !t.asc))
              .forEach(tr => table.appendChild(tr) );
	
            //adding class to sorted column
            jQuery('#media-kits-data td').removeClass('sorted');
            //var table_id = jQuery(t.closest('table').parentNode).attr('id');
            var ind = jQuery(t).index() + 1;
            jQuery('#media-kits-data td:nth-child('+ind+')').addClass('sorted');
          },
          UpdateMethod: function() {
           //Force a render with a simulated state change
           var th = this;
            this.serverRequest = 
              axios.get(media_base_url+'/user/media_kits/'+kit_owner)
                .then(function(result) {    
                    return result.data;
                })
                .then(function(response) {
                   return Promise.all(response.map( (record, index) => {
                     return axios.get(media_base_url+"/node/"+record.nid+"?_format=json");
                   }))
                })
                .then(function(responsex) {
                  th.setState({mediakits: responsex});
                });
          },
          SwitchMediaKit: function(mediakit_id) {
						kit_id_from_url = mediakit_id;
            jQuery('#media-kit-modal').modal('show');
            //highlight selected kit
						setTimeout(function() {
							jQuery("#media-kits-data .media-row").removeClass('bg-light');
							jQuery("#media-kits-data #kit-"+mediakit_id).addClass('bg-light');
							jQuery('#mediakitid').val(mediakit_id);
							//refresh all tabs and change title under right side kit
							var title = jQuery("#media-kits-data #kit-"+mediakit_id+" td:first-child").text();
							jQuery('#mediakitTitle').val(title);
							jQuery("#media_kit_title").text(title);
							jQuery("#audio-kit-refresh").trigger('click');
							jQuery("#photo-kit-refresh").trigger('click');
							jQuery("#text-kit-refresh").trigger('click');
							jQuery("#video-kit-refresh").trigger('click');
							jQuery('input[type="checkbox"]').prop('checked', false);
							jQuery('#add-selected').attr('disabled', 'disabled');
							jQuery('#remove-selected').attr('disabled', 'disabled');
							//if(mediakit_id == default_media_kit_id){
							if(jQuery.inArray('administrator', user_roles ) !== -1 || (media_kit_uid == path_userid)){
								disable_check = default_media_kit_id == media_kit_id ? true : false;
							}
							if(disable_check){
								jQuery('table.media-table .checkbox-container input[type=checkbox]').attr('disabled', 'disabled');							
							} else {
								jQuery('table.media-table .checkbox-container input[type=checkbox]').removeAttr('disabled');
							}
							jQuery('#media-kit-modal').modal('hide');
							jQuery('.kit-box.col-md-5 .tb-title').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 nav').removeClass('d-none');
							jQuery('#kit-tabContent table').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content').removeClass('kit-box-message');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').removeClass('d-flex');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').addClass('d-none');
						}, 1000);
						setTimeout(function() {
							history.pushState('', '', mediakit_id);
						}, 1200);
          },
          handleCloneKit: function(kit_owner, kit_id, kit_title){
						console.log('kit_name = '+kit_name);
						jQuery('#create-media-kit-modal').modal('show');
						jQuery('#create-media-kit-modal .modal-footer .btn.btn-primary').remove();				
						jQuery('#create-media-kit-modal #new-kit-name').val('Clone of '+kit_title);
						var new_val = jQuery('#create-media-kit-modal #new-kit-name').val();
						/* if(new_val == ''){
							var new_val = 'Clone of '+title;
						} */
						jQuery('#create-media-kit-modal .modal-footer').append('<a href="/tools/media/kit/'+kit_owner+'/'+kit_id+'/clone?title='+new_val+'" class="btn btn-primary">CREATE</a>');
					},
          handleFavorite: function(media_id, field_favorite_value, row_id){
            this.setState({spinner_status: true});
            var t =this;
            var favorite_row = Number(row_id);
            axios.get(Drupal.url('rest/session/token'))
            .then(function (data) {
              var csrfToken = data.data;
              let headers = {'Content-Type': 'application/hal+json','Cache-Control': 'no-cache', 'X-CSRF-Token':csrfToken,};
              var media_url_json = media_base_url+'/node/'+media_id+'?_format=hal_json';
              var type_url = media_base_url_http + '/rest/type/node/media_kit';
              var json_favorite = {
                "_links": {
                  "type": {"href": type_url }
                },
                "field_favorite": [
                  {
                    "value": Boolean(!field_favorite_value)
                  }
                ]
              };
              axios.patch(media_url_json, json_favorite, { headers: headers })
              .then(function(result) {
                if(result.status == 200){
                  let new_list = t.state.mediakits;
                  new_list[favorite_row].data.field_favorite[0].value = Boolean(!field_favorite_value);
                  t.setState({mediakits: new_list});
                  t.setState({spinner_status: false});
                }else{
                  alert('Error');
                }
              });
            });
          },
          DeleteKit : function(kit_id, row_id, kit_title){
						var th = this;
            th.setState({KitTitle: kit_title});
            th.setState({Kitid: kit_id});
            th.setState({Kitrow_id: row_id});
						jQuery.ajax({
							url: '/media_kit/references/'+kit_id,
							data:{'kit_id':kit_id},
							type: "GET",
							success:function(data){
								if(data.length){
									th.setState({reference_list: data});
								}
							}
						});
            th.setState({showModal: true});
          },
          handleHideModal: function(){
            this.setState({KitTitle: ''}); 
            this.setState({Kitid: ''}); 
            this.setState({Kitrow_id: ''});
            this.setState({reference_list: []});
            this.setState({showModal: false});
            this.setState({kitguide: false});
          },
					handleHideGuideModal: function(){
            this.setState({KitTitle: ''}); 
            this.setState({Kitid: ''}); 
            this.setState({Kitrow_id: ''});
            this.setState({reference_list: []});
            this.setState({showModal: false});
            this.setState({kitguide: false});
						//var href = jQuery('#media_vault_title').attr('href');
						//window.location.href = href;		 
          },
          handleCreatekit: function(){ 
						this.setState({KitTitle: ''}); 
            this.setState({Kitid: ''}); 
            this.setState({Kitrow_id: ''});
            this.setState({reference_list: []});
            this.setState({showModal: false});
            this.setState({kitguide: false});
						jQuery('#delete-kit-modal').modal('hide');
						//jQuery('#crt-kit-btn').trigger('click');
						jQuery('#create-media-kit-modal').modal('show');
					},
          handleDeletekit: function(){ 
            jQuery('#media-kit-modal').modal('show');
            jQuery('#delete-kit-modal').modal('hide');
            var selected_media_kit_id = jQuery('#mediakitid').val();
            var t = this;
            var Kitid = t.state.Kitid;
            var KitTitle = t.state.KitTitle;
            var ref_list = t.state.reference_list;
						//console.log('refId - '+refId);
						if(ref_list.length > 0){
							//remove reference first
							jQuery.each( ref_list, function( key, value ) {
								jQuery.ajax({
									url: "/kaboodle/remove/reference",
									data:{"k_nid":value.entity_id, "uid":kit_owner, "nid":Kitid},
									type: "POST",
									success:function(data){
										//now delete the media kit node
										jQuery.ajax({
											url: "/media_kit/delete",
											data:{"uid":kit_owner, "nid":Kitid},
											type: "POST",
											success:function(data){
												window.location = media_base_url+'/tools/media/kit/'+kit_owner+'/'+default_media_kit_id;
												//window.location.reload();
											}
										});
										//console.log(data);
										//window.location = media_base_url+'/tools/media/kit/'+path_userid+'/'+default_media_kit_id;
									}
								});
							});
							
						} else {
							jQuery.ajax({
								url: "/media_kit/delete",
								data:{"uid":kit_owner, "nid":Kitid},
								type: "POST",
								success:function(data){
									window.location = media_base_url+'/tools/media/kit/'+kit_owner+'/'+default_media_kit_id;
									//window.location.reload();
								}
							});
						}						
          }
        });
        React.render(
          React.createElement(AppMediaKits, {}), document.querySelector("#media-kits-data")
        );
        
        //Audio kit data secion
        var AppAudiokit = React.createClass({
          getInitialState: function() {
             return {
              audios: [],
            }
          },
          componentWillMount: function() {
            var th = this;
            this.serverRequest = 
              axios.get(media_kit_url)
                .then(function(result) {    
                    return result.data.field_vault_audio;
                })
                .then(function(response) {
                   return Promise.all(response.map( (record, index) => {
                     return axios.get(media_base_url+'/media/'+record.target_id+'/edit?_format=json');
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
						console.log('user_custom_mkit_count = '+user_custom_mkit_count);
						//if(media_kit_id == default_media_kit_id){
            if(jQuery.inArray('administrator', user_roles ) !== -1 || (media_kit_uid == path_userid)){
              disable_check = default_media_kit_id == media_kit_id ? true : false;
            }
						if(disable_check){
							jQuery('.media-table .checkbox-container input[type=checkbox]').attr('disabled', 'disabled');
						} else {
							jQuery('.media-table .checkbox-container input[type=checkbox]').removeAttr('disabled');
						}
						this.state.audios.sort((a, b) => a.data.name[0].value.localeCompare(b.data.name[0].value));
            var items = this.state.audios.map((item, key) => {
              
              //File type
							let app_extention = '-';
							if(item.data.field_media_audio_file.length && item.data.field_media_audio_file[0].target_id != ''){
								var ext = (item.data.field_format.length > 0) ? item.data.field_format[0].value : '';
								var fid = (item.data.field_media_audio_file.length > 0) ? item.data.field_media_audio_file[0].target_id : '';
								app_extention = React.createElement(AppExtention, {ext:ext, fid:fid, get_type_col: false});
							}
              
              //Audio Time
              if((item.data.field_duration).length > 0){
								var audio_time = item.data.field_duration[0].value;
							} else {
								var audio_time = '-';//React.createElement(AudioTime, {audioURL: item.data.field_media_audio_file[0].url}); 
							}
              
              //File size
              var file_size = '-';
							if((item.data.field_file_size).length > 0 && item.data.field_media_audio_file.length && item.data.field_media_audio_file[0].target_id != ''){
								file_size = item.data.field_file_size[0].value;
							} else {
								if((item.data.field_media_audio_file).length > 0 && item.data.field_media_audio_file[0].target_id != ''){
									file_size = React.createElement(AppFileSize, {fid: item.data.field_media_audio_file[0].target_id});
								}
							}
							
							let file_url = '';
							if(item.data.field_media_audio_file.length && item.data.field_media_audio_file[0].original_url != ''){
								file_url = item.data.field_media_audio_file[0].original_url;
							}
              let file_mid = '';
              if(item.data.mid[0].value != ''){
                file_mid = item.data.mid[0].value;
              }
							console.log('filemid',file_mid);
              return React.createElement('tr', {className:'media-row audio-row'},
                React.createElement('td', {className: 'audio-data', style:{'padding-top': '0px'}},
                  React.createElement('label', {className: 'checkbox-container'},
                    React.createElement('input',{type: 'checkbox', id: 'audio-kit-check-'+key, className: 'box-check box-kit-check-audio check-selected-kit', 'data-mid': item.data.mid[0].value, 'value': item.data.mid[0].value, 'disabled': disable_check, defaultChecked: default_checked}),
                    React.createElement('span', {className: 'checkmark'})
                  )
                ),
                React.createElement('td', {className: 'audio-data d-flex justify-content-center align-items-center'},
                  React.createElement('div', {className: 'audio-box'},
                    React.createElement("audio", {id: 'audio-kit-'+key, controls:"controls", style:{width: '0px', height: '0px', visibility:'hidden', 'display':'none'}}, 
                      React.createElement('source', {src:file_url},'')
                    ),
                    React.createElement('button', {type: 'button', className: 'audio-play-button', onClick: this.playAudio.bind(null, this, 'audio-kit-'+key, 'volCol-'+key)},''),
                    React.createElement('div', {className:'vol-box'},
                      React.createElement('div', {className:'vol-box-inner'},
                        React.createElement('input', {type: 'range', id:'volCol-kit-'+key, className: 'volume-control', min: 0, max: 1, step: 0.1, value: this.state.value, onChange: this.kbVolControl.bind(null, this, 'audio-kit-'+key, 'volCol-'+key)}),
                        React.createElement('i', {className:'fa fa-volume-up', onClick: this.kbmute.bind(null, this, 'audio-kit-'+key, 'volCol-kit-'+key)},'')
                      )
                    )
                  )
                ),
								React.createElement('td', {className: 'sorted audio-data media-file-name'}, item.data.name[0].value),
                React.createElement('td', {className: 'audio-data'}, app_extention),
                React.createElement('td', {className: 'audio-data'}, audio_time),
                React.createElement('td', {className: 'audio-data'}, file_size),
               React.createElement('td', {className: 'media-data'}, React.createElement('button', {type: 'button', className: 'share-link round-button ','data-toggle':'tooltip', 'data-placement': 'right','title': 'Share', onMouseOver: this.tooltipfn.bind(this), onClick: this.ShowmodalConfAud.bind(null, this,file_mid,file_size )}))
              );
            });
            
            var table_head = React.createElement('thead',{},
              React.createElement('tr', null,
                React.createElement('th', null, 
									React.createElement('label', {className: 'checkbox-container'},
                    React.createElement('input',{type: 'checkbox', id: 'remove-all-audio', className: 'box-check check-all check-all-audio-kit', 'disabled': disable_check, defaultChecked: default_checked}),
                    React.createElement('span', {className: 'checkmark', style: {'margin-left':'-4px', 'margin-top': '-4px'}})
                  )
                ),
                React.createElement('th', null),
                React.createElement('th', {className: 'bg-sort sortempty asc-icon media-title', onClick: this.sortColumn.bind(this), style:{'width':'30%'}}, 'Title'),
                React.createElement('th', null, 'Format'),
                React.createElement('th', null, 'Duration'),
                React.createElement('th', null, 'Size'),
                React.createElement('th', null, 'Actions')
              )
            );
            
            var table_body = React.createElement('tbody', null, items);
            
            var updatediv = React.createElement('div', {className: 'd-none', id: 'audio-kit-refresh', onClick: this.UpdateMethod.bind()}, 'refresh');
						var empty_table_data = React.createElement('div',{className: 'empty-kit-message d-flex align-items-center justify-content-center height-417'}, 'Choose a Media Kit below to load it here.');
            if(user_custom_mkit_count == 1 && kit_id_from_url == default_media_kit_id){
							console.log(1);
							jQuery('.kit-box.col-md-5 .tb-title').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 nav').removeClass('d-none');
							jQuery('#kit-tabContent table').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content').removeClass('kit-box-message');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').removeClass('d-flex');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').addClass('d-none');
							//jQuery('#mkit-list-table td.media-data.first-custom-kit').trigger('click');
						} else if(user_custom_mkit_count > 1 && kit_id_from_url == default_media_kit_id){
							console.log(11);
							jQuery('.kit-box.col-md-5 .tb-title').addClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 nav').addClass('d-none');
							jQuery('#kit-tabContent table').addClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content').addClass('kit-box-message');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').addClass('d-flex');
						} else if(user_custom_mkit_count > 0 && kit_id_from_url !== default_media_kit_id){
							console.log(111);
							jQuery('.kit-box.col-md-5 .tb-title').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 nav').removeClass('d-none');
							jQuery('#kit-tabContent table').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content').removeClass('kit-box-message');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').removeClass('d-flex');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').addClass('d-none');
            } else if(user_custom_mkit_count == 0){
							console.log(1111);
							jQuery('.kit-box.col-md-5 .tb-title').addClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 nav').addClass('d-none');
							jQuery('#kit-tabContent table').addClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content').addClass('kit-box-message');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').addClass('d-flex');
						}
						var table_data = React.createElement('table',{className: 'media-table d-none'}, table_head, table_body);
            return (
              //React.createElement('h3', null, 'Hello1')
              //React.createElement('table',{className: 'media-table'},table_head,table_body)
              React.createElement("div", {}, table_data, empty_table_data, updatediv)
            );
          },
					sortColumn: function(e){
						var th = this;
						var t = e.target;
            const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
            const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
              v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
              )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
						const table = t.closest('table');
						var tableid = jQuery(t.closest('table').parentNode).attr('id');
						jQuery('#'+tableid+' thead tr th').removeClass('bg-sort');
						jQuery('#'+tableid+' thead tr th').removeClass('asc-icon');
						jQuery('#'+tableid+' thead tr th').removeClass('desc-icon');
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
            Array.from(table.querySelectorAll('tr.media-row'))
              .sort(comparer(Array.from(t.parentNode.children).indexOf(t), t.asc = !t.asc))
              .forEach(tr => table.appendChild(tr) );
	
            //adding class to sorted column
            jQuery('#'+tableid+' td').removeClass('sorted');
            var table_id = jQuery(t.closest('table').parentNode).attr('id');
            var ind = jQuery(t).index() + 1;
            jQuery('#'+table_id+' td:nth-child('+ind+')').addClass('sorted');
          },
          UpdateMethod: function() {
            //Force a render with a simulated state change
            media_kit_id = jQuery('#mediakitid').val();
            media_kit_url = media_base_url+'/node/'+media_kit_id+'?_format=json';
            var th = this;
            this.serverRequest = 
              axios.get(media_kit_url)
                .then(function(result) {    
                    return result.data.field_vault_audio;
                })
                .then(function(response) {
                   return Promise.all(response.map( (record, index) => {
                     return axios.get(media_base_url+'/media/'+record.target_id+'/edit?_format=json');
                   }))
                })
                .then(function(responsex) {
                  th.setState({audios: responsex});
                });
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
          },
          ShowmodalConfAud: function(finename,filesize){
             console.log('second popup audio');
             console.log('second popup audio2',finename);
             console.log('second popup audio2',filesize);
             //get url
             var type = 'audio';
             get_update_url(filesize,type)
             //end get url
            
             
            //end test pop up
          
          },
          tooltipfn: function(event){
						jQuery('[data-toggle="tooltip"]').tooltip({placement : 'right'});
					},
          handleHideModal: function(){
            this.setState({showModal: false});
					  this.setState({mediaDeleteModal: false});
            this.setState({mid: ''});
            this.setState({row_id: ''});
            this.setState({delete_modal_msg: ''});
          },
          DeleteKitnew : function(){
						var th = this;
            console.log('i am here');
            th.setState({KitTitle: 'this is test'});
            th.setState({Kitid: 'test'});
            th.setState({Kitrow_id: 'test'});
            th.setState({showModal: true});
                 //Media kit Delete Modal 
        let DeleteKitModal = React.createClass({
          componentDidMount: function() {
              jQuery(this.getDOMNode()).modal('show');
              jQuery(this.getDOMNode()).on('hidden.bs.modal', this.props.handleHideModal);
          },
          render: function() {
						var msg = '';
						var modal_hide = this.closeModal.bind();
						var processBtn = this.props.processBtn;
						var kitguide = this.props.kitguide;
						//console.log(kitguide);
						var entity_title = this.props.KitTitle;
						if((this.props.reference_list).length > 0){
							var h_title = 'Delete: Media Kit';
							var list = this.props.reference_list.map((item, key) => {
								return React.createElement('li', {},
											React.createElement('a', {href:'/tools/kaboodle/'+item.entity_id, className: 'text-capitalize'}, item.title),
										);
							});
							var msg = React.createElement('div', {className: 'node-delete-refs'}, 
								React.createElement('div', null, '"'+entity_title+'" is currently in use by the following content:', 
									React.createElement('ul', {className: 'kit-refs'}, list),				
								), React.createElement('div', null, 'We recommend you first update those features with another Media Kit. If you click "DELETE" we will remove the "'+entity_title+'" from the listed features and delete the Media Kit.')
							);
						} else if(kitguide == true){
							var modal_hide = this.closeGuideModal.bind();
							var h_title = '';
							var msg = React.createElement('div', {className: 'kit-guide'}, 
								React.createElement('div', null, "Welcome to the Media Kits Manager.  While the Media Vault contains ALL of your assets, Media Kits are subsets.  If you maintain a large number of assets, it can be unwieldy to have to scroll through all of them when working on a particular post (or project, or print piece).  Here you can create Media Kits so that you're only working with the relevant assets.", 
									React.createElement('br', null, null),
									React.createElement('br', null, null),
									React.createElement('div', null, 'A few examples of Media Kit uses:'),
									React.createElement('ul', {className: 'kit-refs'}, 
										React.createElement('li', null, 'Images from a recent photo shoot'),
										React.createElement('li', null, 'Images specifically for use in FaceBook posts'),
										React.createElement('li', null, 'Marketing text files for a specific client'),
									),				
								), 
							);
						} else {
							var h_title = 'Delete: Media Kit';
							var msg = 'Are you sure you want to delete the "'+entity_title+'" Media Kit? This action is permanent.';
						}
            //var btnCancel = React.createElement('button', {type: 'button', className: 'btn btn-default', onClick:this.closeModal.bind()},'Cancel');
            return (
                React.createElement('div', {id: 'delete-kit-modal', className: 'modal fade'}, 
                  React.createElement('div', {className: 'modal-dialog'},
                    React.createElement('div', {className: 'modal-content'},
                      React.createElement('div', {className: 'modal-header justify-content-center'},
                        React.createElement('h4', {className: 'modal-title f-24'}, h_title)
                      ),
                      React.createElement('div', {className: 'modal-body'}, msg),
                      React.createElement('div', {className: 'modal-footer'},
                        //btnCancel,
                        React.createElement('button', {type: 'button', className: 'l-spacing btn text-uppercase font-fjalla color-blue', onClick: modal_hide}, 'Cancel'),
                        React.createElement('button', {type: 'button', className: 'btn btn-primary', onClick: this.props.handleDelete}, processBtn)
                      )
                    )
                  )
                )
            );
          },
          closeModal : function(){
            jQuery('#delete-kit-modal').modal('hide');						
          },
					closeGuideModal : function(){
            var href = jQuery('#media_vault_title').attr('href');
						window.location.href = href;					
          },
          propTypes:{
            handleHideModal: React.PropTypes.func.isRequired
          }
        });
                 console.log('i am here2');
								var modalElement = React.createElement(DeleteKitModal, {handleHideModal: this.handleHideGuideModal, handleDelete: this.handleCreatekit, KitTitle: '', reference_list: [], processBtn: 'Create', kitguide: true});
          }
        });  
        React.render(
          
          React.createElement(AppAudiokit, {}), document.querySelector("#audio-kit-content-section")
        );
        
        //Photo Kit data secion
        var AppPhotokit = React.createClass({
          getInitialState: function() {
            return {
              photos: [],
            }
          },
          componentWillMount: function(){
            var th = this;
            this.serverRequest = 
              axios.get(media_kit_url)
                .then(function(result) {    
                    return result.data.field_vault_photo;
                })
                .then(function(response) {
                   return Promise.all(response.map( (record, index) => {
                     return axios.get(media_base_url+'/media/'+record.target_id+'/edit?_format=json');
                   }))
                })
                .then(function(responsex) {
                  th.setState({photos: responsex});
                });   
          },
          componentWillUnmount: function() {
            this.serverRequest.abort();
          },
          render: function() {
            var counter = 0;
						this.state.photos.sort((a, b) => a.data.name[0].value.localeCompare(b.data.name[0].value));
            var items = this.state.photos.map((item, key) => {
                counter += 1;
                //File name
                let file_name = '-';
								if((item.data.name).length > 0){
									file_name = item.data.name[0].value;
								} else {
									if(item.data.field_media_image.length && item.data.field_media_image[0].target_id != ''){
										file_name = React.createElement(AppFileName, {fid: item.data.field_media_image[0].target_id});
									}
								}
                
                //File type
								let app_extention = '-';
								if(item.data.field_media_image.length && item.data.field_media_image[0].target_id != ''){
									var ext = (item.data.field_format.length > 0) ? item.data.field_format[0].value : '';
									var fid = (item.data.field_media_image.length > 0) ? item.data.field_media_image[0].target_id : '';
									app_extention = React.createElement(AppExtention, {ext:ext, fid:fid, get_type_col: false});
								}
                
                //File size
                var file_size = '-';
								if((item.data.field_file_size).length > 0 && item.data.field_media_image.length && item.data.field_media_image[0].target_id != ''){
									file_size = item.data.field_file_size[0].value;
								} else {
									if((item.data.field_media_image).length > 0 && item.data.field_media_image[0].target_id != ''){
										file_size = React.createElement(AppFileSize, {fid: item.data.field_media_image[0].target_id});
									}
								}
								
								let file_url = '';
								let image_style = '';
								if(item.data.field_media_image.length && item.data.field_media_image[0].target_id != ''){
									file_url = item.data.field_media_image[0].url;
									image_style = item.data.field_media_image[0].image_style;
								}
                let file_mid = '';
              if(item.data.mid[0].value != ''){
                file_mid = item.data.mid[0].value;
              }
                return React.createElement('tr', {className:'media-row',  'data-exthumbimage': image_style, 'data-src': file_url},
                  React.createElement('td', {className: 'media-data text-center'},
                    React.createElement('label', {className: 'checkbox-container'},
                      React.createElement('input',{type: 'checkbox', id: 'audio-kit-check-'+key, className: 'box-check box-kit-check-photo check-selected-kit', 'data-mid': item.data.mid[0].value, 'value': item.data.mid[0].value, 'disabled': disable_check, defaultChecked: default_checked}),
                      React.createElement('span', {className: 'checkmark'})
                    )
                  ),
                  React.createElement('td', {className: 'media-data media-data-col-name'},
                    React.createElement("div", {id: key, className:"media-box"}, 
                      React.createElement('img', {src:image_style}),
                      React.createElement('div', {className: 'overlay'},
                        React.createElement('button', {type: 'button', className: 'preview-icon', onClick: this.ShowPhotomodal.bind()}, '')
                      )
                    )
                  ),
                  React.createElement('td', {className: 'sorted media-data media-file-name'}, file_name),
                  React.createElement('td', {className: 'media-data'}, app_extention),
                  React.createElement('td', {className: 'media-data'}, file_size),
                  React.createElement('td', {className: 'media-data'}, React.createElement('button', {type: 'button', className: 'share-link round-button','data-toggle':'tooltip', 'data-placement': 'right','title': 'Share',onMouseOver: this.tooltipfn.bind(this),onClick: this.ShowmodalConfPhoto.bind(null, this,file_mid,file_size)}))
                );
            });
            
            var table_head = React.createElement('thead',{},
              React.createElement('tr', null,
                React.createElement('th', null, 
									React.createElement('label', {className: 'checkbox-container'},
                    React.createElement('input',{type: 'checkbox', id: 'remove-all-photo', className: 'box-check check-all check-all-photo-kit', 'disabled': disable_check, defaultChecked: default_checked}),
                    React.createElement('span', {className: 'checkmark', style: {'margin-left':'-4px', 'margin-top': '-4px'}})
                  )
                ),
								React.createElement('th', null),
                React.createElement('th', {className: 'bg-sort sortempty asc-icon media-title', onClick: this.sortColumn.bind(this), style:{'width':'30%'}}, 'Title'),
                React.createElement('th', null, 'Format'),
                React.createElement('th', null, 'Size'),
                React.createElement('th', null, 'Actions')
              )
            );
            var table_body = React.createElement('tbody', {id: 'media_kit_photo_gallery'}, items);
            
            var updatediv = React.createElement('div', {className: 'd-none', id: 'photo-kit-refresh', onClick: this.UpdateMethod.bind()}, 'refresh');
            var empty_table_data = React.createElement('div',{className: 'empty-kit-message d-flex align-items-center justify-content-center height-417'}, 'Choose a Media Kit below to load it here.');
            /* if(user_custom_mkit_count == 1){
							jQuery('.kit-box.col-md-5 .tb-title').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 nav').removeClass('d-none');
							jQuery('#kit-tabContent table').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content').removeClass('kit-box-message');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').removeClass('d-flex');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').addClass('d-none');
						} else if(user_custom_mkit_count > 1 && kit_id_from_url == default_media_kit_id){
							jQuery('.kit-box.col-md-5 .tb-title').addClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 nav').addClass('d-none');
							jQuery('#kit-tabContent table').addClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content').addClass('kit-box-message');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').addClass('d-flex');
						} else if(user_custom_mkit_count > 0 && kit_id_from_url !== default_media_kit_id){
							jQuery('.kit-box.col-md-5 .tb-title').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 nav').removeClass('d-none');
							jQuery('#kit-tabContent table').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content').removeClass('kit-box-message');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').removeClass('d-flex');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').addClass('d-none');
            } else if(user_custom_mkit_count == 0){
							jQuery('.kit-box.col-md-5 .tb-title').addClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 nav').addClass('d-none');
							jQuery('#kit-tabContent table').addClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content').addClass('kit-box-message');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').addClass('d-flex');
						} */
						var table_data = React.createElement('table',{className: 'media-table d-none'}, table_head, table_body);
            return (
             // React.createElement('table',{className: 'media-table'},table_head,table_body)
             React.createElement("div", {}, table_data, empty_table_data, updatediv)
            );
          },
					sortColumn: function(e){
						var th = this;
						var t = e.target;
            const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
            const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
              v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
              )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
						const table = t.closest('table');
						var tableid = jQuery(t.closest('table').parentNode).attr('id');
						jQuery('#'+tableid+' thead tr th').removeClass('bg-sort');
						jQuery('#'+tableid+' thead tr th').removeClass('asc-icon');
						jQuery('#'+tableid+' thead tr th').removeClass('desc-icon');
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
            Array.from(table.querySelectorAll('tr.media-row'))
              .sort(comparer(Array.from(t.parentNode.children).indexOf(t), t.asc = !t.asc))
              .forEach(tr => table.appendChild(tr) );
	
            //adding class to sorted column
            jQuery('#'+tableid+' td').removeClass('sorted');
            var table_id = jQuery(t.closest('table').parentNode).attr('id');
            var ind = jQuery(t).index() + 1;
            jQuery('#'+table_id+' td:nth-child('+ind+')').addClass('sorted');
          },
          UpdateMethod: function() {
            //Force a render with a simulated state change
            media_kit_id = jQuery('#mediakitid').val();
            media_kit_url = media_base_url+'/node/'+media_kit_id+'?_format=json';
            var th = this;
            this.serverRequest = 
              axios.get(media_kit_url)
                .then(function(result) {    
                    return result.data.field_vault_photo;
                })
                .then(function(response) {
                   return Promise.all(response.map( (record, index) => {
                     return axios.get(media_base_url+'/media/'+record.target_id+'/edit?_format=json');
                   }))
                })
                .then(function(responsex) {
                  th.setState({photos: responsex});
                });
          },
          ShowmodalConfPhoto: function(finename,filesize){
             console.log('second popup photo');
             console.log('second popup audio2',finename);
             console.log('second popup audio2',filesize);
             //get url
             var type = 'image';
             get_update_url(filesize,type)
             //end get url
            
             
            //end test pop up
          
          },
          tooltipfn: function(event){
						jQuery('[data-toggle="tooltip"]').tooltip({placement : 'right'});
					},
          ShowPhotomodal: function(e){
            var $gallery = jQuery('#media_kit_photo_gallery').lightGallery({
              width: '880px',
              height: '720px',
              addClass: 'fixed-size',
              counter: false,
              download: false,
              enableSwipe: false,
              enableDrag: false,
              download: false,
              share: false,
              autoplay: false,
              thumbMargin : 17,
              autoplayControls: false,
              fullScreen: false,
              zoom: false,
              actualSize: false,
              toogleThumb: false,
              thumbWidth: 94,
              thumbContHeight: 118,
              exThumbImage: 'data-exthumbimage',
            });
						jQuery(e.target).trigger('click');
            $gallery.on('onCloseAfter.lg',function(event, index, fromTouch, fromThumb){
              try{$gallery.data('lightGallery').destroy(true);}catch(ex){};
            });
          }
        });
        React.render(
          React.createElement(AppPhotokit, {}), document.querySelector("#photo-kit-content-section")
        );
        
         //Text data secion
        var AppTextKit = React.createClass({
          getInitialState: function() {
            return {
              texts: [],
              showTextModal: false,
              textFileURL: '',
              mid: '',
            }
          },
          componentWillMount: function() {
            var th = this;
            this.serverRequest = 
              axios.get(media_kit_url)
                .then(function(result) {    
                    return result.data.field_vault_file;
                })
                .then(function(response) {
                   return Promise.all(response.map( (record, index) => {
                     return axios.get(media_base_url+'/media/'+record.target_id+'/edit?_format=json');
                   }))
                })
                .then(function(responsex) {
                  th.setState({texts: responsex});
                });
          },
          componentWillUnmount: function() {
            this.serverRequest.abort();
          },   
          render: function() {
            if (this.state.showTextModal) {
              var textReaderElement = React.createElement(textReader, {hideTextReaderModal: this.hideTextReaderModal, textFileURL: this.state.textFileURL});
            }
						this.state.texts.sort((a, b) => a.data.name[0].value.localeCompare(b.data.name[0].value));
            var items = this.state.texts.map((item, key) => {
                //File name
                let file_name = '-';
								if((item.data.name).length > 0){
									file_name = item.data.name[0].value;
								} else {
									if(item.data.field_media_file.length && item.data.field_media_file[0].target_id != ''){
										file_name = React.createElement(AppFileName, {fid: item.data.field_media_file[0].target_id});
									}
								}
								
                //File type
                let app_extention = '-';
								if(item.data.field_media_file.length && item.data.field_media_file[0].target_id != ''){
									var ext = (item.data.field_format.length > 0) ? item.data.field_format[0].value : '';
									var fid = (item.data.field_media_file.length > 0) ? item.data.field_media_file[0].target_id : '';
									app_extention = React.createElement(AppExtention, {ext:ext, fid:fid, get_type_col: true});
								}
								
                //File size
                var file_size = '-';
								if((item.data.field_file_size).length > 0 && item.data.field_media_file.length && item.data.field_media_file[0].target_id != ''){
									file_size = item.data.field_file_size[0].value;
								} else {
									if((item.data.field_media_file).length > 0 && item.data.field_media_file[0].target_id != ''){
										file_size = React.createElement(AppFileSize, {fid: item.data.field_media_file[0].target_id});
									}
								}
								
								let file_url = '';
								let target_id = '';
								if(item.data.field_media_file.length && item.data.field_media_file[0].target_id != ''){
									file_url = item.data.field_media_file[0].url;
									target_id = item.data.field_media_file[0].target_id;
								}
                 let file_mid = '';
              if(item.data.mid[0].value != ''){
                file_mid = item.data.mid[0].value;
              }
                return React.createElement('tr', {className:'media-row'},
                  React.createElement('td', {className: 'media-data text-center'},
                    React.createElement('label', {className: 'checkbox-container'},
                      React.createElement('input',{type: 'checkbox', id: 'audio-kit-check-'+key, className: 'box-check box-kit-check-text check-selected-kit', 'data-fid': target_id, 'data-mid': item.data.mid[0].value, 'value': item.data.mid[0].value, 'disabled': disable_check, defaultChecked: default_checked}),
                      React.createElement('span', {className: 'checkmark'})
                    )
                  ),
                  React.createElement('td', {className: 'media-data media-data-col-name'},
                    React.createElement("div", {id: key, className:"media-box text-box"}, 
                      React.createElement('button', {type: 'button', className: 'text-read-button', onClick: this.showTextModal.bind(null,file_url)},'')
                    )
                  ),
                  React.createElement('td', {className: 'sorted media-data media-file-name'}, file_name),
                  React.createElement('td', {className: 'media-data'}, app_extention),
                  React.createElement('td', {className: 'media-data'}, file_size),
                  React.createElement('td', {className: 'media-data'}, React.createElement('button', {type: 'button', className: 'share-link round-button','data-toggle':'tooltip', 'data-placement': 'right','title': 'Share',onMouseOver: this.tooltipfn.bind(this), onClick: this.ShowmodalConfDoc.bind(null, this,file_mid,file_size)}))
                );
            });
            var table_head = React.createElement('thead',{},
              React.createElement('tr', null,
                React.createElement('th', null, 
									React.createElement('label', {className: 'checkbox-container'},
                    React.createElement('input',{type: 'checkbox', id: 'remove-all-text', className: 'box-check check-all check-all-text-kit', 'disabled': disable_check, defaultChecked: default_checked}),
                    React.createElement('span', {className: 'checkmark', style: {'margin-left':'-4px', 'margin-top': '-4px'}})
                  )
                ),
								React.createElement('th', null),
                React.createElement('th', {className: 'bg-sort sortempty asc-icon media-title', onClick: this.sortColumn.bind(this), style:{'width':'30%'}}, 'Title'),
                React.createElement('th', null, 'Format'),
                React.createElement('th', null, 'Size'),
                React.createElement('th', null, 'Actions')
              )
            );
            var table_body = React.createElement('tbody', null, items);
            
            var updatediv = React.createElement('div', {className: 'd-none', id: 'text-kit-refresh', onClick: this.UpdateMethod.bind()}, 'refresh');
            var empty_table_data = React.createElement('div',{className: 'empty-kit-message d-flex align-items-center justify-content-center height-417'}, 'Choose a Media Kit below to load it here.');
            /* if(user_custom_mkit_count == 1){
							jQuery('.kit-box.col-md-5 .tb-title').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 nav').removeClass('d-none');
							jQuery('#kit-tabContent table').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content').removeClass('kit-box-message');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').removeClass('d-flex');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').addClass('d-none');
						} else if(user_custom_mkit_count > 1 && kit_id_from_url == default_media_kit_id){
							jQuery('.kit-box.col-md-5 .tb-title').addClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 nav').addClass('d-none');
							jQuery('#kit-tabContent table').addClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content').addClass('kit-box-message');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').addClass('d-flex');
						} else if(user_custom_mkit_count > 0 && kit_id_from_url !== default_media_kit_id){
							jQuery('.kit-box.col-md-5 .tb-title').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 nav').removeClass('d-none');
							jQuery('#kit-tabContent table').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content').removeClass('kit-box-message');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').removeClass('d-flex');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').addClass('d-none');
            } else if(user_custom_mkit_count == 0){
							jQuery('.kit-box.col-md-5 .tb-title').addClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 nav').addClass('d-none');
							jQuery('#kit-tabContent table').addClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content').addClass('kit-box-message');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').addClass('d-flex');
						} */
						var table_data = React.createElement('table',{className: 'media-table d-none'}, table_head, table_body);
            return ( 
             // React.createElement('table',{className: 'media-table'},table_head,table_body, textReaderElement)
             React.createElement("div", {}, table_data, empty_table_data, updatediv, textReaderElement)
            );
          },
					sortColumn: function(e){
						var th = this;
						var t = e.target;
            const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
            const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
              v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
              )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
						const table = t.closest('table');
						var tableid = jQuery(t.closest('table').parentNode).attr('id');
						jQuery('#'+tableid+' thead tr th').removeClass('bg-sort');
						jQuery('#'+tableid+' thead tr th').removeClass('asc-icon');
						jQuery('#'+tableid+' thead tr th').removeClass('desc-icon');
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
            Array.from(table.querySelectorAll('tr.media-row'))
              .sort(comparer(Array.from(t.parentNode.children).indexOf(t), t.asc = !t.asc))
              .forEach(tr => table.appendChild(tr) );
	
            //adding class to sorted column
            jQuery('#'+tableid+' td').removeClass('sorted');
            var table_id = jQuery(t.closest('table').parentNode).attr('id');
            var ind = jQuery(t).index() + 1;
            jQuery('#'+table_id+' td:nth-child('+ind+')').addClass('sorted');
          },
          UpdateMethod: function() {
            media_kit_id = jQuery('#mediakitid').val();
            media_kit_url = media_base_url+'/node/'+media_kit_id+'?_format=json';
            var th = this;
            this.serverRequest = 
              axios.get(media_kit_url)
                .then(function(result) {    
                    return result.data.field_vault_file;
                })
                .then(function(response) {
                   return Promise.all(response.map( (record, index) => {
                     return axios.get(media_base_url+'/media/'+record.target_id+'/edit?_format=json');
                   }))
                })
                .then(function(responsex) {
                  th.setState({texts: responsex});
                });
          },
          ShowmodalConfDoc: function(finename,filesize){
             console.log('second popup doc');
             console.log('second popup audio2',finename);
             console.log('second popup audio2',filesize);
             //get url
             var type = 'doc';
             get_update_url(filesize,type);
          },
          tooltipfn: function(event){
						jQuery('[data-toggle="tooltip"]').tooltip({placement : 'right'});
					},
          showTextModal: function(fileURL){
            this.setState({showTextModal: true});
            this.setState({textFileURL: fileURL });
          },
          hideTextReaderModal: function(){
            this.setState({showTextModal: false});
            this.setState({textFileURL: '' });
          }
        });
        React.render(
          React.createElement(AppTextKit, {}), document.querySelector("#text-kit-content-section")
        );
        
        //Video data secion
         var AppVideoKit = React.createClass({
          getInitialState: function() {
            return {
              video: [],
              showModal: false,
              singlecheckVideo: false,
              fileType: '',
              fileURL: '',
              mid: '',
              base_url: media_base_url,
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
            var th = this;
            this.serverRequest = 
              axios.get(media_kit_url)
                .then(function(result) {    
                    return result.data.field_vault_video;
                })
                .then(function(response) {
                   return Promise.all(response.map( (record, index) => {
                     return axios.get(media_base_url+record.url +'?_format=json');
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
            if (this.state.videoplayer) {
              var videoPlayerElement = React.createElement(VideoPlayer, {
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
            const rowLen = this.state.video.length;
						this.state.video.sort((a, b) => a.data.name[0].value.localeCompare(b.data.name[0].value));
            var items = this.state.video.map((item, key) => {
                //File name
                let file_name = '-';
								if((item.data.name).length > 0){
									file_name = item.data.name[0].value;
								} else {
									if(item.data.field_media_video_file.length && item.data.field_media_video_file[0].target_id != ''){
										file_name = React.createElement(AppFileName, {fid: item.data.field_media_video_file[0].target_id});
									}
								}
                
                //File type
                let app_extention = '-';
								if(item.data.field_media_video_file.length && item.data.field_media_video_file[0].target_id != ''){
									var ext = (item.data.field_format.length > 0) ? item.data.field_format[0].value : '';
									var fid = (item.data.field_media_video_file.length > 0) ? item.data.field_media_video_file[0].target_id : '';
									app_extention = React.createElement(AppExtention, {ext:ext, fid:fid, get_type_col: true});
								}
                
                //File size
                var file_size = '-';
								if((item.data.field_file_size).length > 0 && item.data.field_media_video_file.length && item.data.field_media_video_file[0].target_id != ''){
									file_size = item.data.field_file_size[0].value;
								} else {
									if((item.data.field_media_video_file).length > 0 && item.data.field_media_video_file[0].target_id != ''){
										file_size = React.createElement(AppFileSize, {fid: item.data.field_media_video_file[0].target_id});
									}
								}
								
								var file_obj_original_url = '';
								var file_obj_url = '';
								var file_obj_target_id = '';
								var file_obj_image_style = '';
								if(item.data.field_media_video_file.length){
									file_obj_image_style = item.data.field_media_video_file[0].image_style;
									file_obj_original_url = item.data.field_media_video_file[0].original_url;
									file_obj_url = item.data.field_media_video_file[0].url;
									file_obj_target_id = item.data.field_media_video_file[0].target_id;
								}
								 let file_mid = '';
              if(item.data.mid[0].value != ''){
                file_mid = item.data.mid[0].value;
              }
								if(item.data.field_media_video_file.length && item.data.field_media_video_file[0].is_thumbnail){
                  //var video_thumb = React.createElement("video", {id: 'video-'+key}, 
                  //React.createElement('source', {src:file_obj_original_url, className: 'd-none'},''));
                  var video_thumb = React.createElement('img', {src:file_obj_image_style},'');
                } else {
                  var video_thumb = React.createElement("video", {id: 'video-'+key}, React.createElement('source', {src:file_obj_original_url},''));
                }

                return React.createElement('tr', {className:'media-row'},
                  React.createElement('td', {className: 'media-data text-center'},
                    React.createElement('label', {className: 'checkbox-container'},
                      React.createElement('input',{type: 'checkbox', id: 'audio-kit-check-'+key, className: 'box-check box-kit-check-video check-selected-kit', 'data-mid': item.data.mid[0].value, 'value': item.data.mid[0].value, 'disabled': disable_check, defaultChecked: default_checked}),
                      React.createElement('span', {className: 'checkmark'})
                    )
                  ),
                  React.createElement('td', {className: 'media-data media-data-col-name'},
                    React.createElement("div", {id: key, className:"media-box"}, 
                      video_thumb,
                      React.createElement('div', {className: 'overlay'},
                        React.createElement('button', {type: 'button', className: 'video-play round-button', onClick: this.ShowVideoPlayer.bind(null, file_obj_original_url, +key, +rowLen), style:{'display':'none'}}, '')
                      )
                    )
                  ),
                  React.createElement('td', {className: 'sorted media-data media-file-name'}, file_name),
                  React.createElement('td', {className: 'media-data'}, app_extention),
                  React.createElement('td', {className: 'media-data'}, file_size),
                  React.createElement('td', {className: 'media-data'}, React.createElement('button', {type: 'button', className: 'share-link round-button','data-toggle':'tooltip', 'data-placement': 'right','title': 'Share',onMouseOver: this.tooltipfn.bind(this),onClick: this.ShowmodalConfVideo.bind(null, this,file_mid,file_size)}))
                );
            });
            var table_head = React.createElement('thead',{},
              React.createElement('tr', null,
                React.createElement('th', null, 
									React.createElement('label', {className: 'checkbox-container'},
                    React.createElement('input',{type: 'checkbox', id: 'remove-all-video', className: 'box-check check-all check-all-video-kit', 'disabled': disable_check, defaultChecked: default_checked}),
                    React.createElement('span', {className: 'checkmark', style: {'margin-left':'-4px', 'margin-top': '-4px'}})
                  )
                ),
								React.createElement('th', null),
                React.createElement('th', {className: 'bg-sort sortempty asc-icon media-title', onClick: this.sortColumn.bind(this), style:{'width':'30%'}}, 'Title'),
                React.createElement('th', null, 'Format'),
                React.createElement('th', null, 'Size'),
                React.createElement('th', null, 'Actions')
              )
            );
            var table_body = React.createElement('tbody', null, items);
            
            var updatediv = React.createElement('div', {className: 'd-none', id: 'video-kit-refresh', onClick: this.UpdateMethod.bind()}, 'refresh');
            var empty_table_data = React.createElement('div',{className: 'empty-kit-message d-flex align-items-center justify-content-center height-417'}, 'Choose a Media Kit below to load it here.');
            /* if(user_custom_mkit_count == 1){
							jQuery('.kit-box.col-md-5 .tb-title').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 nav').removeClass('d-none');
							jQuery('#kit-tabContent table').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content').removeClass('kit-box-message');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').removeClass('d-flex');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').addClass('d-none');
						} else if(user_custom_mkit_count > 1 && kit_id_from_url == default_media_kit_id){
							jQuery('.kit-box.col-md-5 .tb-title').addClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 nav').addClass('d-none');
							jQuery('#kit-tabContent table').addClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content').addClass('kit-box-message');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').addClass('d-flex');
						} else if(user_custom_mkit_count > 0 && kit_id_from_url !== default_media_kit_id){
							jQuery('.kit-box.col-md-5 .tb-title').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 nav').removeClass('d-none');
							jQuery('#kit-tabContent table').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content').removeClass('kit-box-message');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').removeClass('d-flex');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').addClass('d-none');
            } else if(user_custom_mkit_count == 0){
							jQuery('.kit-box.col-md-5 .tb-title').addClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 nav').addClass('d-none');
							jQuery('#kit-tabContent table').addClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content').addClass('kit-box-message');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').removeClass('d-none');
							jQuery('.kit-box.col-md-5 .col-md-12 .tb-tab-content .empty-kit-message').addClass('d-flex');
						} */
						var table_data = React.createElement('table',{className: 'media-table d-none'}, table_head, table_body);
            return ( 
              //React.createElement('table',{className: 'media-table'},table_head,table_body, videoPlayerElement, spinner_process)
              React.createElement("div", {}, table_data, empty_table_data, updatediv, videoPlayerElement)

            );
          },
					sortColumn: function(e){
						var th = this;
						var t = e.target;
            const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
            const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
              v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
              )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
						const table = t.closest('table');
						var tableid = jQuery(t.closest('table').parentNode).attr('id');
						jQuery('#'+tableid+' thead tr th').removeClass('bg-sort');
						jQuery('#'+tableid+' thead tr th').removeClass('asc-icon');
						jQuery('#'+tableid+' thead tr th').removeClass('desc-icon');
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
            Array.from(table.querySelectorAll('tr.media-row'))
              .sort(comparer(Array.from(t.parentNode.children).indexOf(t), t.asc = !t.asc))
              .forEach(tr => table.appendChild(tr) );
	
            //adding class to sorted column
            jQuery('#'+tableid+' td').removeClass('sorted');
            var table_id = jQuery(t.closest('table').parentNode).attr('id');
            var ind = jQuery(t).index() + 1;
            jQuery('#'+table_id+' td:nth-child('+ind+')').addClass('sorted');
          },
          UpdateMethod: function() {
            //Force a render with a simulated state change
            media_kit_id = jQuery('#mediakitid').val();
            media_kit_url = media_base_url+'/node/'+media_kit_id+'?_format=json';
            var th = this;
            this.serverRequest = 
              axios.get(media_kit_url)
                .then(function(result) {    
                    return result.data.field_vault_video;
                })
                .then(function(response) {
                   return Promise.all(response.map( (record, index) => {
                     return axios.get(media_base_url+record.url +'?_format=json');
                   }))
                })
                .then(function(responsex) {
                  th.setState({video: responsex});
                });
          },
          ShowmodalConfVideo: function(finename,filesize){
             console.log('second popup video');
             //get url
             var type = 'video';
             get_update_url(filesize,type);
          
          },
          tooltipfn: function(event){
						jQuery('[data-toggle="tooltip"]').tooltip({placement : 'right'});
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
        React.render(
          React.createElement(AppVideoKit, {}), document.querySelector("#video-kit-content-section")
        );
        
        //add or remove media vault files to media kit
				jQuery(document).on('click','.box-check',function () {
					
					var selected_tab = jQuery('#vault-tabContent .tab-pane.active').attr('id');
          selected_tab = selected_tab.split("-");
          var tabname = selected_tab[1];
					
					if(jQuery(this).hasClass('check-all')){
						var x = jQuery(this).attr('id');
						x = x.split("-");
						var operation = x[0];
						if(operation == 'add'){
							var checkboxes = document.getElementsByClassName('box-vault-check-'+tabname);
							if(jQuery('.check-all-'+tabname).prop('checked') == true){
								for (var i = 0; i < checkboxes.length; i++) {
									checkboxes[i].checked = true;
									jQuery('#add-selected').removeAttr('disabled');
								}
							} else {
								for (var i = 0; i < checkboxes.length; i++) {
									checkboxes[i].checked = false;
									jQuery('#add-selected').attr('disabled', 'disabled');
								}
							}
						} else if(operation == 'remove'){
							var checkboxes = document.getElementsByClassName('box-kit-check-'+tabname);
							if(jQuery('.check-all-'+tabname+'-kit').prop('checked') == true){
								for (var i = 0; i < checkboxes.length; i++) {
									checkboxes[i].checked = true;
									jQuery('#remove-selected').removeAttr('disabled');
								}
							} else {
								for (var i = 0; i < checkboxes.length; i++) {
									checkboxes[i].checked = false;
									jQuery('#remove-selected').attr('disabled', 'disabled');
								}
							}
						}			
					}	else if(jQuery(this).hasClass('check-selected-vault')){
						if(jQuery(this).prop('checked') == true){
							jQuery('#add-selected').removeAttr('disabled');
						} else {
							if(!(jQuery('#'+tabname+'-content-section input[type="checkbox"]:checked').length)){
								jQuery('#add-selected').attr('disabled', 'disabled');
							}
						}
					}	else if(jQuery(this).hasClass('check-selected-kit')){
						if(jQuery(this).prop('checked') == true){
							jQuery('#remove-selected').removeAttr('disabled');
						} else {
							if(!(jQuery('#'+tabname+'-kit-content-section input[type="checkbox"]:checked').length)){
								jQuery('#remove-selected').attr('disabled', 'disabled');
							}
						}
					}				
				});
				
        jQuery('#transfer-box button').click(function() {
          //jQuery('#transfer-box button').attr('disabled', 'disabled');
          var selected_data = [];
          var final_data = [];
          var jsondata = [];
          var data_string = "";
          
          //get button type
          var btn_type = jQuery(this).attr('id');
          
          //get selected media vault tab name
          var selected_tab = jQuery('#vault-tabContent .tab-pane.active').attr('id');
          selected_tab = selected_tab.split("-");
          var tabname = selected_tab[1];

          //media kit id
          var media_kit_id = jQuery('#mediakitid').val();
          
          //choose media files as per button action
          if(btn_type == 'add-selected'){
          
            //get selected data from left box - media vault
            selected_data = jQuery('#'+tabname+'-content-section input[type="checkbox"]:checked').map(function() {
              return jQuery(this).data('mid')
            }).get();
            
             //get existing data from right box - media kit
            var existing_data = jQuery('#'+tabname+'-kit-content-section input[type="checkbox"]').map(function() {
              return jQuery(this).data('mid')
            }).get();
            
            //merge both array
            var merge_data = existing_data.concat(selected_data); 
            //remove duplicate data
            final_data = [...new Set(merge_data)];

            //stop further execution for blank data
            if(selected_data.length == 0 ){
              //jQuery('#transfer-box button').removeAttr('disabled');
              return false;
            }
          }
          else if(btn_type == "remove-selected"){
            //get not selected data from right box - media kit
            final_data = jQuery('#'+tabname+'-kit-content-section input[type="checkbox"]:not(.check-all):not(:checked)').map(function() {
              return this.value;
            }).get();
            
            //get selected data from right box - media kit
            selected_data = jQuery('#'+tabname+'-kit-content-section input[type="checkbox"]:checked').map(function() {
              return this.value;
            }).get();
            
            //stop further execution for blank data
            if(selected_data.length == 0 ){
              //jQuery('#transfer-box button').removeAttr('disabled');
							//jQuery('#remove-selected').removeAttr('disabled');
              return false;
            }
          }

          if(final_data.length != 0 ){
            jQuery.each( final_data, function( key, value ) {
              //alert( key + ": " + value );
               data_string += '{"target_id":'+value+'},';
            });
            
            //remove last comma
            data_string = data_string.slice(0, -1);
            data_string = '['+data_string+']';
            
            //convert string to JSON data
            jsondata = JSON.parse(data_string);
          }
            
          axios.get(Drupal.url('rest/session/token'))
            .then(function (data) {
              var csrfToken = data.data;
              let headers = {'Content-Type': 'application/hal+json','Cache-Control': 'no-cache', 'X-CSRF-Token':csrfToken,};
              var media_url_json = media_base_url+'/node/'+media_kit_id+'?_format=hal_json';
              var type_url = media_base_url_http + '/rest/type/node/media_kit';
              /* var media_field = {
                "_links": {
                  "type": {"href": type_url }
                },
                "field_vault_audio": jsondata
              }; */
              
              var media_field = {
                "_links": {
                  "type": {"href": type_url }
                }
              };
              
              //create dynamic key for media field type
              if(tabname == "text"){
                var tabkey = "field_vault_file";
              }
              else{
                tabkey = "field_vault_"+tabname;
              }
              //create dynamic key value pair for media kit field  
              media_field[tabkey] = jsondata;
              //push dynamic key value pair to media_field array
              var myArray = [];
              myArray.push(media_field);
               
              axios.patch(media_url_json, myArray[0], { headers: headers })
              .then(function(resultdata) {
                if(resultdata.status == 200){
                  //refresh data
                  jQuery("#media-kits-data .media-row.bg-light ."+tabname+"-col").text(final_data.length);
                  var audio_len = jQuery("#media-kits-data .media-row.bg-light .audio-col").text();
                  var photo_len = jQuery("#media-kits-data .media-row.bg-light .photo-col").text();
                  var text_len = jQuery("#media-kits-data .media-row.bg-light .text-col").text();
                  var video_len = jQuery("#media-kits-data .media-row.bg-light .video-col").text();
                  var trash_inactive = 'inactive';
                  if(audio_len == 0 && photo_len == 0 && text_len == 0 && video_len == 0){
                    trash_inactive = '';
                  }
                  //deletion of the Default Media Kit should NOT be allowed 
                  if(default_media_kit_id == media_kit_id){
                    trash_inactive = 'inactive';
                  }
                  jQuery("#media-kits-data .media-row.bg-light .trash.round-button").removeClass('inactive');    
                  jQuery("#media-kits-data .media-row.bg-light .trash.round-button").addClass(trash_inactive);
									//jQuery(".check-all-"+tabname).trigger('click');
									var addelem = document.getElementById('add-all-'+tabname);
									var removeelem = document.getElementById('remove-all-'+tabname);
									var chekedLen = jQuery('#'+tabname+'-content-section input[type="checkbox"]:checked').length;
									var chekedLen2 = jQuery('#'+tabname+'-kit-content-section input[type="checkbox"]:checked').length;
									if(chekedLen){
										var checkboxes = document.getElementsByClassName('box-vault-check-'+tabname);
										for (var i = 0; i < checkboxes.length; i++) {
											checkboxes[i].checked = false;
										}								
									}
									if(chekedLen2){
										var checkboxes2 = document.getElementsByClassName('box-kit-check-'+tabname);
										for (var i = 0; i < checkboxes2.length; i++) {
											checkboxes2[i].checked = false;
										}								
									}
									if(addelem.checked){
										addelem.checked = false;
									}
									if(removeelem.checked){
										removeelem.checked = false;
									}
                  jQuery("#"+tabname+"-kit-refresh").trigger('click');
									jQuery('#transfer-box button').attr('disabled', 'disabled');
                }else{
                  alert('Error');
                }
              });
            });
           
        });
				
        //when hide create-media-kit-modal then reset it
        jQuery('#create-media-kit-modal').on('hidden.bs.modal', function (e) {
					jQuery('#new-kit-name').val('');
					jQuery('#create-media-kit-modal .modal-footer .btn.btn-primary').remove();
					jQuery('#create-media-kit-modal .modal-footer').append('<button type="button" id="create-fresh-kit" class="btn btn-primary">Create</button>');						
				});
				
        //dual-tabbing feature to ensure consistent tabs under media types
        jQuery('#transfer-box a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
          var res = e.target.id.split("-");
          var tabname = res[1];
          jQuery('#nav-'+tabname+'-tab').tab('show');
          jQuery('#nav-'+tabname+'-kit-tab').tab('show');
          //var kitnodeURL = jQuery('#media_kit_title').attr('href');
					//jQuery("#media_vault_title").attr("href", "/tools/media/vault/"+kit_owner+"#nav-"+tabname);
					//var media_kit_id = jQuery('#mediakitid').val();
					//var media_kit_t = jQuery('#mediakitTitle').val();
					//jQuery("#media_kit_title").attr("href", "/tools/media/kit/"+media_kit_uid+"/"+media_kit_id+"/settings#"+tabname);
        });
        
        //Create new media kit
        jQuery('#create-media-kit-modal #create-fresh-kit').on('click', function(){
          var title = jQuery("#new-kit-name").val().trim();	
          if(title) {
             //jQuery('#crt-kit-btn').attr('disabled', 'disabled'); 
             jQuery('#media-kit-modal').modal('show');
             jQuery('#create-media-kit-modal').modal('hide');
             jQuery('#new-kit-name').val('');
             
             axios.get(Drupal.url('rest/session/token'))
            .then(function (data) {
              var csrfToken = data.data;
              let headers = {'Content-Type': 'application/hal+json','Cache-Control': 'no-cache', 'X-CSRF-Token':csrfToken,};
              
              var type_url = media_base_url_http + '/rest/type/node/media_kit';
							if(jQuery.inArray('administrator', user_roles ) !== -1){
								var mydata = {
									"_links": {
											"type": {"href": type_url }
										},
									"type":[{"target_id":"media_kit"}],
									"title":[{"value":title}],
									"uid":[{"target_id":kit_owner}],
									"field_user_ref":[{"target_id":kit_owner}]
								};
							} else {
								var mydata = {
									"_links": {
											"type": {"href": type_url }
										},
									"type":[{"target_id":"media_kit"}],
									"title":[{"value":title}],
									"field_user_ref":[{"target_id":kit_owner}]
								};
							}
              axios.post(media_base_url+'/node?_format=json', mydata, { headers: headers })
                .then(function(resultdata) {
                  if(resultdata.status == 201){
										var newnodeid = resultdata.data.nid[0].value
                    //refresh data
										//first_kit_create_flag = true;
                    jQuery("#media-kit-refresh").trigger('click');
										jQuery('#mediakitid').val(newnodeid);
										jQuery("#audio-kit-refresh").trigger('click');
										//window.location.reload();	
										/* setTimeout(function() {
											jQuery("#kit-"+newnodeid+" > td").trigger('click');
										}, 1700); */
										window.location.href = '/tools/media/kit/'+kit_owner+'/'+newnodeid;
										//media_kits_sortable(path_userid, newnodeid);
                  }else{
                    jQuery('#media-kit-modal').modal('hide');
                    //jQuery('#crt-kit-btn').removeAttr('disabled');
                    alert('Error');
                  }
                });
              });
          }else{
            jQuery("#new-kit-name").focus();
          }
        });
				
				
				
        //media kits sorting
        /* jQuery("#media-kits-data table tbody").sortable({
          handle: ".move-icon",
          update: function( e, ui ) {
						media_kits_sortable(path_userid);
          }
        }); */
        
      } 
      function get_update_url(filesize,type){
  jQuery('body').append('<div id="overlay"><div class="km-loader"></div></div>');
             var media_kit_url = media_base_url+'/savefile/'+ filesize+'/'+type;
             jQuery.getJSON( media_kit_url, function( result ) {
              var media_kit_urls =  result.dwnloadurl;
               var buttons = [
             {
                text: 'close',
                "class": 'btn btn-cancel font-fjalla',
                click: function() { 
                    jQuery( ".mkit" ).remove();
                    jQuery(this).dialog("close");
                }
            },
            {
                text: 'copy',
                "class": 'btn btn-cancel font-fjalla',
                click: function() {
                    var r = document.createRange();
                    r.selectNode(document.getElementById("m-url-title"));
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(r);
                    document.execCommand('copy');
                    window.getSelection().removeAllRanges();
                    jQuery( ".mkit" ).remove();
                    jQuery('.ui-dialog-buttonpane').append('<div class="mkit" style="padding:15px; color:#006600;">Link copied</div>');
                }
            },
        ];
        jQuery('#overlay').remove();
            var modal_instance = '#mod-media-gallery-conf';
        jQuery(modal_instance).dialog({
            autoOpen: true,
            width: 500,
            // height: 200,
            modal: true,
            resizable: false,
            buttons: buttons,
            open: function(event, ui) {
                jQuery(modal_instance).dialog('option', 'title', 'FILE SHARING LINK');
                jQuery(modal_instance).html("<div id='m-url-title'>"+media_kit_urls+"</div>");
				//console.log('hi');
				//console.log(html_content);
				
            }
        });
              }).done(function() { 
              
              });
     } 
   
    }
  }
})(jQuery, Drupal, drupalSettings);

//update media kits order
/* function media_kits_sortable(userid, nid = ""){
	var neworder = new Array();
	neworder = jQuery('#media-kits-data table tbody tr').map(function() {
		return jQuery(this).data('kid')
	}).get();
	
	if(nid){
		neworder.push(nid);
	}

	jQuery.ajax({
		url: "/media_kits/sortable",
		data:{"uid":userid, "nid":neworder},
		type: "POST",
		success:function(data){
			/* if(data == 'done'){
				console.log(data);
			} *
		}
	});
} */
