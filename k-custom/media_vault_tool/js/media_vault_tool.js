(function ($, Drupal, drupalSettings) {
  var initialized;
  Drupal.behaviors.MediaBehavior = {
    attach: function (context, settings) {
      if (!initialized) {
        initialized = true;
        var media_vault_id = drupalSettings.media.mediaJS.media_vault_id;
        var media_default_kit = drupalSettings.media.mediaJS.media_default_kit;
        var media_base_url = drupalSettings.media_base_url;
        var media_base_url_http = drupalSettings.media_base_url_http;
        var media_archive = drupalSettings.media_archive;
        var a = drupalSettings.a;
        var currentUID = parseInt(drupalSettings.user.uid);
        var file_owner = drupalSettings.file_owner;
        var default_vault = drupalSettings.default_vault;
        var user_custom_mkit_count = drupalSettings.user_custom_mkit_count;
        var nmk = drupalSettings.nmk;        
        var archive_text;
        var selectedRows_audio = [];
        var selectedRows_photo = [];
        var selectedRows_text = [];
        var selectedRows_video = [];
        var txtfilename = [];
        var audioLen = photoLen = textLen = videoLen = archive_audioLen = archive_photoLen = archive_textLen = archive_videoLen = '';
        var paging_len = 100;
  	    var url = media_base_url+"/node/"+media_vault_id+"?_format=json";
        var processRunning = false;
        var audio_blank_flag = audio_archive_blank_flag = false;				
        var photo_blank_flag = photo_archive_blank_flag = false;				
        var text_blank_flag = text_archive_blank_flag = false;				
        var video_blank_flag = video_archive_blank_flag = false;				
        var url = media_base_url+"/node/"+media_vault_id+"?_format=json";
        var processRunning = false;
		function getPresetName(url){
		 var result = null;
			 jQuery.ajax({
				url: url,
				type: 'get',
				async: false,
				success: function(data) {
					result = data.name[0].value;
				} 
			 });
			 return result;
		}
                

        //Confirmation Delete Modal 
        let Modal = React.createClass({
          componentDidMount: function() {
              jQuery(this.getDOMNode()).modal('show');
              jQuery(this.getDOMNode()).on('hidden.bs.modal', this.props.handleHideModal);
          },
          render: function() {
            var btnCancel = React.createElement('button', {type: 'button', className: 'btn btn-cancel', onClick:this.closeModal.bind()},'Cancel');
            var title_msg = 'Archive selected '+ this.props.fileType +'?';
            var button_text = 'Archive';
            if(this.props.arc_status == 1){
              title_msg = 'Restore selected '+ this.props.fileType +'?';
              button_text = 'Restore';
            }
						if(this.props.mediaDeleteModal == true){
              title_msg = 'Delete File';
              button_text = 'Delete';
            }
            return (
							React.createElement('div', {id: 'modal', className: 'modal fade'},
								React.createElement('div', {className: 'modal-dialog'},
									React.createElement('div', {className: 'modal-content'},
										React.createElement('div', {className: 'modal-header d-flex justify-content-center'},
											React.createElement('h4', {className: 'modal-title'}, title_msg)
										),
										React.createElement('div', {className: 'modal-body'},this.props.delete_modal_msg),
										React.createElement('div', {className: 'modal-footer'},
											btnCancel,
											React.createElement('button', {type: 'button', className: 'btn btn-primary', onClick: this.props.handleArchive},button_text),                        
										),
									)
								)
							)
						)
          },
          closeModal : function(){
            jQuery('#modal').modal('hide');
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
                      React.createElement('i', {className:"fa fa-times"},'')
                    ),
                    React.createElement('div', {className: 'km-loader'}, ''),
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
        
        //Caption form
        /* let captionForm = React.createElement('form',{id:'gallery-caption', style:{display:'none'}},
                React.createElement('label',{htmlFor:'caption-data', style:{display:'none'}}, 'Photo Description'),
                React.createElement('input', { id:'caption-data', placeholder: 'Add a caption to this photo', type: 'text', autoFocus: true,style:{display:'none'}}),
                React.createElement('button', {type: 'submit', className: 'btn btn-primary',style:{display:'none'}}, 'Save')   
              ); */
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
                      ),
                    )
                  )
                )
              )
          },
          propTypes:{
            hideTextReaderModal: React.PropTypes.func.isRequired
          }
        });
				
        // Sample rate and Rating value component
        var AppTaxo = React.createClass({
          getInitialState: function() {
            return {
              taxoValue: '',
            }
          },
          componentWillMount: function() {
            var th = this;
            this.serverRequest = 
              axios.get(this.props.base_url+'/'+this.props.srate+'?_format=json')
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
		
		// preset
        var PresetTaxo = React.createClass({
          getInitialState: function() {
            return {
              presetValue: '',
            }
          },
          componentWillMount: function() {
            var th = this;
			console.log(this.props.base_url+'/'+this.props.srate+'?_format=json');
            this.serverRequest = 
              axios.get(this.props.base_url+'/'+this.props.srate+'?_format=json')
                .then(function(result) { 
					console.log(result);  
					console.log('result');  
                  th.setState({
                    presetValue: result.data.name[0].value
                  });
                })
          },
          componentWillUnmount: function() {
            //this.serverRequest.abort();
          },
          render: function() {
			 console.log(this.state.presetValue); 
            return React.createElement('span', {className: ''}, this.state.presetValue)
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
								axios.get(this.props.base_url+'/rest/api/file/'+this.props.fid+'?_format=json')
									.then(function(result) { 
										if(result.data.filename.length > 0 && result.data.filename[0].value !== ''){
											th.setState({fileExtension: result.data.filename[0].value});
										}
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
                extName = 'pdf';
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
				
				//Delete media msg component
        var AppDeleteMediaMsg = React.createClass({
          getInitialState: function() {
            return {
              list: [],
            }
          },
          componentWillMount: function() {
            var th = this;
						this.serverRequest = 
						axios.get(this.props.base_url+'/media_vault/references/'+th.props.mid+'/'+th.props.fileType+'?_format=json')
							.then(function(result) {								
								th.setState({list: result.data});
							});
          },
          render: function() {					
						var	lis = this.state.list.map((item, key) => {
							if(item.entity_id == default_vault){
								var li_class = 'd-none';
							} else if(item.entity_id == media_default_kit){
								var li_class = 'd-none';
							} else {
								var li_class = '';
							}
							return React.createElement("li", {'data-entity': item.entity_id, className: li_class}, item.title);
						});
						if(this.state.list.length > 2){
							var msg = React.createElement("div", {id: 'delete-vault-content'}, 'Are you sure you want to delete "'+this.props.file_name+'" from your Media Vault? It will also be deleted from the following:', React.createElement("br", null, ""), React.createElement("ul", {className: 'mt-3'}, lis));
						} else {
							var msg = React.createElement("div", {id: 'delete-vault-content'}, 'Are you sure you want to delete "'+this.props.file_name+'" from your Media Vault?', React.createElement("br", null, ""), React.createElement("ul", {className: 'mt-3 d-none'}, lis));
						}
						
						return msg;											
          },
        });
        
        //get Media attached to media kit // media kit indicator
        var AppMediaKits = React.createClass({
          getInitialState: function() {
            return {
              mediaKits: '',
            }
          },
          componentWillMount: function() {
            var th = this;
            this.serverRequest =
              axios.get(this.props.base_url+'/media/mediakit/'+this.props.mid+'/'+this.props.fileType+'?_format=json')
              .then(function(response) {
                return response.data;
              })
              .then(function(data) {
                th.setState({mediaKits: data});
              });
            document.addEventListener('mouseover', th.tooltipfn.bind());     
          },
          componentWillUnmount: function() {
            //this.serverRequest.abort();
          },
          tooltipfn: function(event) {
            jQuery('[data-toggle="tooltip"]').tooltip({placement : 'right'});
          },
          render: function() {
            var elem = null;
            if(this.state.mediaKits.length > 0){
              var titlearr = [];
              var kit_uid = this.state.mediaKits[0].uid;
              var tooltip_elem = this.state.mediaKits.map((kitem, kkey) => {
                titlearr.push(kitem.title);
              });
              var tolltip_title = titlearr.join(", ");
              elem = React.createElement('a', {'data-toggle':'tooltip', 'data-placement': 'right', href:'/tools/media/kit/'+kit_uid+'/'+media_default_kit, 'title': tolltip_title, onmouseover: this.tooltipfn.bind(this)}, React.createElement('span', {className: 'mk-indicator'}))
            }
            return React.createElement('span', {}, elem)
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
              axios.get(this.props.base_url+'/rest/api/file/'+this.props.fid+'?_format=json')
                .then(function(result) { 
                  th.setState({value: result.data.filesize[0].value});
                })
          },
          componentWillUnmount: function() {
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
        
        //Select Download Section
        var SelectDownload = React.createClass({
        getInitialState: function() {
            return {
              checked_status: false,
              SD_modal_status: false,
              showModal: false,
              DS_modal_msg: '',
              delete_modal_msg: '',
              arc_status: media_archive,
              fileType: this.props.fileType,
              base_url: media_base_url,
              optionset: nmk,  
              /* sorting: [],     */
              selectedKit: "",
              //selectedItem: "",
              //sortKey: "",
            }
          },
          componentWillMount: function() {
            var t = this;
            /* var currstate = t.state.fileType;
            if(currstate == 'photo') {
              currstate = 'image';
            }
            this.serverRequest = axios.get(media_base_url+'/media/vault-sort/'+a+'/'+currstate+'?_format=json')
            .then(function(response) {
              return response.data;
            })
            .then(function(data) {
              t.setState({sorting: data});
            }); */
            document.addEventListener('onChange', t.filterkeypress.bind());
          },      
          refresh: function() {
            var th = this;
            var curState = th.state.fileType;                       
            var spinner = '<div class="progress-overlay"><div class="km-loader"></div></div>';                        
            switch (curState) {
              case 'audio':
                var rows = jQuery('table#audio_vault tbody tr');               
                if(jQuery('input[id="show-all-input-audio"]').is(":checked")) {
									jQuery('#filter-by-favo-audio').removeClass('active');
									jQuery('#filter-by-favo-audio').addClass('inactive');
                  jQuery('#filter-audio').val('');                        
                  jQuery('#media_audio_list_wrapper').append(spinner);
									processRunning = true;
                  jQuery('#filter-btn-audio').trigger('click');            
                  /* rows.each(function(event){
                    jQuery(this).find('span.move-icon').removeClass('d-none');
                  }); */
                  setTimeout(function() {
                    jQuery('#media_audio_list_wrapper').find('.progress-overlay').remove();
										processRunning = false;
                  }, 500);
                }/*  else {
                  rows.each(function(event){
                    jQuery(this).find('span.move-icon').removeClass('d-none');
                  });
                } */
              break;              
              case 'photo':
                var rows = jQuery('table#photo_vault tbody tr');
                if(jQuery('input[id="show-all-input-photo"]').is(":checked")) {
									jQuery('#filter-by-favo-photo').removeClass('active');
									jQuery('#filter-by-favo-photo').addClass('inactive');
                  jQuery('#filter-photo').val(''); 
                  jQuery('#media_photo_list_wrapper').append(spinner);
									processRunning = true;
                  jQuery('#filter-btn-photo').trigger('click');            
                  /* rows.each(function(event){
                    jQuery(this).find('span.move-icon').removeClass('d-none');
                  }); */
                  setTimeout(function() {
                    jQuery('#media_photo_list_wrapper').find('.progress-overlay').remove();
										processRunning = false;
                  }, 500);
                }/* else{
                  rows.each(function(event){
                    jQuery(this).find('span.move-icon').removeClass('d-none');
                  });
                } */
              break;              
              case 'text':
                var rows = jQuery('table#text_vault tbody tr');
                if(jQuery('input[id="show-all-input-text"]').is(":checked")) {
									jQuery('#filter-by-favo-text').removeClass('active');
									jQuery('#filter-by-favo-text').addClass('inactive');
                  jQuery('#filter-text').val(''); 
                  jQuery('#media_text_list_wrapper').append(spinner);
									processRunning = true;
                  jQuery('#filter-btn-text').trigger('click');            
                  /* rows.each(function(event){
                    jQuery(this).find('span.move-icon').removeClass('d-none');
                  }); */
                  setTimeout(function() {
                    jQuery('#media_text_list_wrapper').find('.progress-overlay').remove();
										processRunning = false;
                  }, 500);
                }/* else{
                  rows.each(function(event){
                    jQuery(this).find('span.move-icon').removeClass('d-none');
                  });
                } */
              break;              
              case 'video':
                var rows = jQuery('table#video_vault tbody tr');
                if(jQuery('input[id="show-all-input-video"]').is(":checked")) {
									jQuery('#filter-by-favo-video').removeClass('active');
									jQuery('#filter-by-favo-video').addClass('inactive');
                  jQuery('#filter-video').val(''); 
                  jQuery('#media_video_list_wrapper').append(spinner);
									processRunning = true;
                  jQuery('#filter-btn-video').trigger('click');            
                  /* rows.each(function(event){
                    jQuery(this).find('span.move-icon').removeClass('d-none');
                  }); */
                  setTimeout(function() {
                    jQuery('#media_video_list_wrapper').find('.progress-overlay').remove();
										processRunning = false;
                  }, 500);
                }/* else{
                  rows.each(function(event){
                    jQuery(this).find('span.move-icon').removeClass('d-none');
                  });
                } */
              break;              
              default:
              break;
            }
          },          
          render: function() {
            var options = React.createElement('select',{className: 'text-uppercase pl-1 pr-1', value: this.state.selectedKit, onChange: this.addToMediaKit.bind() },
              React.createElement('option', {value: '0', style: {'display':'none'}}, 'Add to media Kit'),
              this.state.optionset.map((optionitem, key) => {
                return React.createElement('option', {value: optionitem.nid}, optionitem.title )
              })
            );
            /*var additional_options = '';
            if(this.state.fileType == 'audio'){
              var additional_options = [React.createElement('option', {value: 6}, 'SORT BY DURATION (A-Z)' ),
                React.createElement('option', {value: 7}, 'SORT BY DURATION (Z-A)' )];
            }
            if(this.state.fileType == 'photo'){
              var additional_options =  [React.createElement('option', {value: 8}, 'SORT BY PIXEL DIMENSIONS (A-Z)' ),
              React.createElement('option', {value: 9}, 'SORT BY PIXEL DIMENSIONS (Z-A)' )];
            }
            if(this.state.fileType == 'text'){
              var additional_options = [React.createElement('option', {value: 10}, 'SORT BY PAGES (A-Z)' ),
              React.createElement('option', {value: 11}, 'SORT BY PAGES (Z-A)' )];
            }
            if(this.state.fileType == 'video'){
              var additional_options = [React.createElement('option', {value: 6}, 'SORT BY DURATION (A-Z)' ),
              React.createElement('option', {value: 7}, 'SORT BY DURATION (Z-A)' ),
              React.createElement('option', {value: 8}, 'SORT BY PIXEL DIMENSIONS (A-Z)' ),
              React.createElement('option', {value: 9}, 'SORT BY PIXEL DIMENSIONS (Z-A)' )];
            }
            var sortbyoptions = React.createElement('select',{className: 'text-uppercase sortby-pulldown pl-1 pr-1', value: this.state.selectedItem, onChange: this.sortedItem.bind() }, 
            React.createElement('option', {value: 0}, 'SORT BY TITLE (A-Z)' ),
            React.createElement('option', {value: 1}, 'SORT BY TITLE (Z-A)' ),
            React.createElement('option', {value: 2}, 'SORT BY FILE NAME (A-Z)' ),
            React.createElement('option', {value: 3}, 'SORT BY FILE NAME (Z-A)' ),
            React.createElement('option', {value: 4}, 'SORT BY FORMAT (A-Z)' ),
            React.createElement('option', {value: 5}, 'SORT BY FORMAT (Z-A)' ),
            additional_options,
            React.createElement('option', {value: 12}, 'SORT BY FILE SIZE (A-Z)' ),
            React.createElement('option', {value: 13}, 'SORT BY FILE SIZE (Z-A)' ),
            React.createElement('option', {value: 14}, 'SORT BY FAVORED FIRST' ),
            React.createElement('option', {value: 15}, 'SORT BY FAVORED LAST' ),
            );*/
            if (this.state.SD_modal_status) {
              var SelectDownloadModalElement = React.createElement(Modal, {handleHideModal: this.dismissDSModal, handleArchive: this.DeleteSelected, fileType: this.props.fileType, base_url: media_base_url, delete_modal_msg: this.state.DS_modal_msg, arc_status: this.state.arc_status});
            }
            if(this.state.arc_status) {
              var deleteRestore_element = React.createElement('li', {className: 'border-right-0'}, React.createElement('span', {className: 'delete-selected arc_1 pl-3', onClick: this.ShowSelectDownloadModal.bind()}, 'Restore Selected'));
              var addTokit = '';
            } else {
              var deleteRestore_element = React.createElement('li', null, React.createElement('span', {className: 'delete-selected delete-icon pl-3', onClick: this.ShowSelectDownloadModal.bind()}, 'Archive Selected'));
              var addTokit = React.createElement('li', {className:'add-to-kit'},
                options
              );
            }
            return React.createElement('div', null,
              React.createElement('div', {className:'select-box-element row justify-content-between pl-3 pr-3'},
                React.createElement('div', {className: 'justify-content-start'},
                  React.createElement('ul', {className: 'd-flex justify-content-center align-items-center'},
                    React.createElement('li', null,
                      React.createElement('label', {className: 'checkbox-container'},
                        React.createElement('span', {className: 'desc'},'Select All'),
                        React.createElement('input',{type: 'checkbox', id: 'audio-check-' +this.props.fileType, className: 'box-check', 'data-filetype': this.props.fileType, defaultChecked: false, onClick: this.SelectAll.bind()}),
                        React.createElement('span', {className: 'checkmark'}),
                      )
                    ),
                    /* React.createElement('li', null,
                      React.createElement('span', {className: 'download-selected media-download pl-3', fileType: this.props.fileType, onClick: this.DownloadSelected.bind()}, 'Download Selected')
                    ), */
                    //React.createElement('li', null,
                    deleteRestore_element,
                    //),
                    addTokit
                  )
                ),
                React.createElement('div', {className: 'justify-content-end'}, 
                  /*React.createElement('div', {className: 'justify-content-start mr-3'}, sortbyoptions ),*/
                  React.createElement('ul', {className: 'd-flex justify-content-center align-items-center'},
                    /* React.createElement('li', null,
                      React.createElement('label', {className: 'checkbox-container filterby', id: 'show-all-'+this.props.fileType},
                        React.createElement('span', {id: 'show-all-text'+this.props.fileType, className: 'desc text-uppercase ml-3 color-3b', style: {'padding-left': '6px'}}, 'Show All'),
                        React.createElement('input',{type: 'checkbox', id: 'show-all-input-'+this.props.fileType, className: 'box-check mr-1', 'data-filetype': this.props.fileType, defaultChecked: true, onClick: this.refresh.bind()}),
                        React.createElement('span', {className: 'checkmark'}),
                      )
                    ), */
                    React.createElement('li', {className: 'search-box border-right-0 d-flex'},
                      React.createElement('span',{className: 'search-ico'}),
											React.createElement('input',{type: 'text', id: 'filter-'+this.props.fileType, className: 'filter pl-1', 'data-filetype': this.props.fileType, placeholder: 'SEARCH BY TITLE OR TAG', type: 'text', autoFocus: true, onChange: this.filterkeypress.bind(this)}),
                      React.createElement('span',{className: 'clear-text d-none', onClick: this.clearSearchText.bind(this)}, 'x'),
                      React.createElement('button', {id: 'filter-by-favo-'+this.props.fileType, type: 'button', className: 'filter-favo media-favo-676767 round-button inactive', onClick: this.FilterByFavo.bind(this)}, ''),
											React.createElement('button', {id: 'filter-btn-'+this.props.fileType, type: 'submit', className: 'btn btn-primary filter-btn text-uppercase align-baseline font-fjalla', onClick: this.FilterBy.bind()}, 'Apply')
                    ),
                    React.createElement('li', {style: {'border-left': '1px solid #99a7b3'}},  
                      React.createElement('a', {className: 'text-decoration-none', href:media_base_url+"/tools/media/kit/"+a+"/"+media_default_kit}, 'Media Kits')
                    ),
                    React.createElement('li', {id: this.props.archiveswitchid, className: 'pr-0'},
                      React.createElement('a', {className: 'text-decoration-none', href:this.props.archive_switch}, this.props.archive_text)
                    )
                  )
                ),
              ),
            SelectDownloadModalElement
            )
          },
          clearSearchText: function(e) {
						var th = this;
						var curState = th.state.fileType;
						jQuery('#filter-'+curState).val('');
					},
          FilterByFavo: function(e) {
						var th = this;
						var curState = th.state.fileType;
						if(jQuery('#'+e.target.id).hasClass('inactive')){
							jQuery('#'+e.target.id).removeClass('inactive');
							jQuery('#'+e.target.id).addClass('active');
						} else {
							jQuery('#'+e.target.id).removeClass('active');
							jQuery('#'+e.target.id).addClass('inactive');
						}
					},
          FilterBy: function() {
            var th = this;
            var curState = th.state.fileType;
            var rows = jQuery('table#'+curState+'_vault tbody tr');
            var rowsArr = jQuery('table#'+curState+'_vault tbody tr').toArray();						
            rowsArr = th.sortByTitle(rows, curState);
            for (var i = 0; i < rowsArr.length; i++) {
              jQuery('table#'+curState+'_vault tbody').append(rowsArr[i]);
            }
          },
          sortByTitle: function(rows, curState/* , sortinglength */) {
             console.log('short_by_title');
						var t_tags = [];
            var filterText = jQuery('#filter-'+curState).val().toLowerCase();
						var favo = jQuery('#filter-by-favo-'+curState).hasClass('inactive');
            if(jQuery('#filter-'+curState).val().length >= 2 || jQuery('#filter-'+curState).val().length == 0){
							if((jQuery('#filter-'+curState).val().length >= 2 || !favo) && jQuery('#'+curState+'_vault tbody tr').length > paging_len){
                console.log('under_pg1');
								jQuery('#media_'+curState+'_list_wrapper .box').remove();
								var box = paginator({
									rows_per_page : paging_len,
									box_mode : "list",
									disable : true,
									get_rows: function () {
										return document.getElementById(curState+'_vault').getElementsByTagName("tr");
									},
								});
								box.className = "box";
								document.getElementById('media_'+curState+'_list_wrapper').appendChild(box);
							} else if(jQuery('#filter-'+curState).val().length == 0 && jQuery('#'+curState+'_vault tbody tr').length > paging_len){
								jQuery('#media_'+curState+'_list_wrapper .box').remove();
                console.log('under_pg2');
								var box = paginator({
									rows_per_page : paging_len,
									box_mode : "list",
									get_rows: function () {
										return document.getElementById(curState+'_vault').getElementsByTagName("tr");
									},
								});
								box.className = "box";
								document.getElementById('media_'+curState+'_list_wrapper').appendChild(box);
							}
              rows.filter(function(a, b) {
								var tag_mid = jQuery(this).attr('data-mid');
								var tags = jQuery(this).find('td.media-tags').text();
								if(!favo && filterText.length !== ''){
									var favo_media = jQuery(this).attr("data-favo");
									if(jQuery(this).attr("data-favo") == 'favorite'){
										if(jQuery(this).children('td.media-title').text().toLowerCase().indexOf(filterText) > -1){
											//console.log('1 else heart');//jQuery(this).toggle(jQuery(this).children('td.media-title').text().toLowerCase().indexOf(filterText) > -1);
											//if(jQuery(this).children('td.media-title').text().toLowerCase().indexOf(filterText) > -1){
												jQuery(this).show();
											//}
										}
										else if(jQuery(this).children('td.media-tags').text().toLowerCase().indexOf(filterText) > -1){
											//console.log('2 else heart');//jQuery(this).toggle(jQuery(this).children('td.media-tags').text().toLowerCase().indexOf(filterText) > -1);
											jQuery(this).show();
										} else {
											//console.log('3 else heart');
											//jQuery(this).show();
											jQuery(this).hide();
										}
									} else {
										jQuery(this).hide();
									}
								} else if(!favo && filterText == ''){
									var favo_media = jQuery(this).attr("data-favo");
									if(favo_media == 'not favorite') {
										jQuery(this).hide();
									} else {
										jQuery(this).show();
									}
								} else if(favo && filterText !== ''){
									if(jQuery(this).children('td.media-title').text().toLowerCase().indexOf(filterText) > -1){
											jQuery(this).toggle(jQuery(this).children('td.media-title').text().toLowerCase().indexOf(filterText) > -1);
									}	else if(jQuery(this).children('td.media-tags').text().toLowerCase().indexOf(filterText) > -1){
										jQuery(this).toggle(jQuery(this).children('td.media-tags').text().toLowerCase().indexOf(filterText) > -1);
									} else {
										jQuery(this).hide();
									}
								} else if(favo && filterText == ''){
									jQuery(this).show();
								}
                var textA = jQuery(this).children('td.media-title', a).text();
                var textB = jQuery(this).children('td.media-title', b).text();
								/* if(sortinglength == 0) {
									return textA.localeCompare(textB);  
								} else { */
									return rows;
								//} 								
              });
            }  else if(jQuery('#filter-'+curState).val().length == 1){
              console.log(jQuery('#filter-'+curState).val());
              alert('Please enter at least 2 characters.');
            }

            return rows;
          },
          filterkeypress: function(e) {
						var th = this;
						var curState = th.state.fileType;
            var ftext = e.target.value;
						if(ftext !== '') {
							jQuery('.clear-text').removeClass('d-none');
							/* var rows = jQuery('table#'+curState+'_vault tbody tr');					
							var rowsArr = jQuery('table#'+curState+'_vault tbody tr').toArray();
							rowsArr = th.sortByTitle(rows, curState);
							for (var i = 0; i < rowsArr.length; i++) {
								jQuery('table#'+curState+'_vault tbody').append(rowsArr[i]);
							} */
						}
						else {
							jQuery('.clear-text').addClass('d-none');
							/* var rows = jQuery('table#'+curState+'_vault tbody tr');					
							var rowsArr = jQuery('table#'+curState+'_vault tbody tr').toArray();
							for (var i = 0; i < rowsArr.length; i++) {
								jQuery('table#'+curState+'_vault tbody').append(rowsArr[i]);
							} */
						}
					},
					/* filterkeyUp: function(e) {
            var ftext = e.target.value;
						if(window.e){
							var key = window.e.keyCode;
						}
						else{
							var key = e.keyCode;
						}
						if(ftext.length > 0) {
							jQuery('.clear-text').removeClass('d-none');
						} else if(ftext.length == 0 && (e.key === "Backspace" || key == 46)){
							jQuery('.clear-text').addClass('d-none');
						}       
          }, */
          /*sortedItem: function(e) {
            var th = this;
            e.preventDefault();
            var curState = this.state.fileType;            
            var curVal = e.target.value;            
            this.setState({selectedItem: curVal}); 
            var rows = jQuery('table#'+curState+'_vault tbody tr').toArray();
            switch (curVal) {
              case '0':
                rows = th.sortByText(rows, '.media-title', true, curVal);
                break;
              case '1':
                rows = th.sortByText(rows, '.media-title', false, curVal);
                break;
              case '2':
                rows = th.sortByText(rows, '.media-f-name', true, curVal);
                break;
              case '3':
                rows = th.sortByText(rows, '.media-f-name', false, curVal);
                break;
              case '4':
                rows = th.sortByText(rows, '.media-format', true, curVal);
                break;
              case '5':
                rows = th.sortByText(rows, '.media-format', false, curVal);
                break;
              case '6':
                rows = th.sortByText(rows, '.media-duration', true, curVal);
                break;
              case '7':
                rows = th.sortByText(rows, '.media-duration', false, curVal);
                break;
              case '8':
                rows = th.sortByText(rows, '.media-dimension', true, curVal);
                break;
              case '9':
                rows = th.sortByText(rows, '.media-dimension', false, curVal);
                break;
              case '10':
                rows = th.sortByText(rows, '.media-pages', true, curVal);
                break;
              case '11':
                rows = th.sortByText(rows, '.media-pages', false, curVal);
                break;
              case '12':
                rows = th.sortByText(rows, '.media-f-size', true, curVal);
                break;
              case '13':
                rows = th.sortByText(rows, '.media-f-size', false, curVal);
                break;
              case '14':
                rows = th.sortByText(rows, '.media-fav', true, curVal);
                break;
              case '15':
                rows = th.sortByText(rows, '.media-fav', false, curVal);
                break;              
              default:
                console.error('Undefined sort field ' + curVal);
                break;
            }
            
            for (var i = 0; i < rows.length; i++) {
              jQuery('table#'+curState+'_vault tbody').append(rows[i]);
            }
          },
          sortByText: function(rows, selector, ascending, value) {
            var curState = this.state.fileType;
            rows.sort(function(a, b) {
              var textA = jQuery('td'+selector, a).text();
              var textB = jQuery('td'+selector, b).text();
              if(value == 14 || value == 15){
                textA = jQuery('td.media-title', a).text();
                textB = jQuery('td.media-title', b).text();
              }
              if (ascending) {                
                jQuery('.media-table th span').removeClass();
                jQuery('table#'+curState+'_vault td').removeClass('sorted');
                jQuery('table#'+curState+'_vault th'+selector+' span').addClass("desc-icon");
                jQuery('table#'+curState+'_vault td'+selector).addClass('sorted');
                return textA.localeCompare(textB);
              } else {
                jQuery('.media-table th span').removeClass();
                jQuery('table#'+curState+'_vault td').removeClass('sorted');
                jQuery('table#'+curState+'_vault th'+selector+' span').addClass("asc-icon");
                jQuery('table#'+curState+'_vault td'+selector).addClass('sorted');
                return textB.localeCompare(textA);
              }
            });

            return rows;
          }, */
          ShowSelectDownloadModal: function(){
            var msg =React.createElement("div", null, "This action will remove selected media file from your ", React.createElement("b", null, "Media Vault"), " and move it to your ", React.createElement("b", null, "Media Archive"), ". It will not be available for use while archived. You will be able to recover it later, if needed.");
            if(this.state.arc_status){
             msg = React.createElement('div', null, 'This action will restore selected file to your Media Vault and any previously selected uses.');
            }
            this.setState({SD_modal_status: true});
            this.setState({DS_modal_msg: msg});
          },                                        
          dismissDSModal: function(){
            this.setState({SD_modal_status: false});
            this.setState({DS_modal_msg: ''});
          },
          SelectAll: function(e){
            var mediatype = this.state.fileType;
            jQuery(this.props.box+' .checkbox-container input[type="checkbox"]').prop('checked',!this.state.checked_status);
            this.setState({checked_status: !this.state.checked_status});           
            if(!this.state.checked_status){
              jQuery('#'+this.state.fileType+'-select-box-element-wrapper').removeClass('options-disable'); 
              var clickedMedia = jQuery('#audio-check-'+this.state.fileType).attr("data-filetype");
              var checkedAll_audio = jQuery('#media_audio_list_wrapper .checkbox-container input[type="checkbox"]');
              var checkedAll_photo = jQuery('#media_photo_list_wrapper .checkbox-container input[type="checkbox"]');
              var checkedAll_text = jQuery('#media_text_list_wrapper .checkbox-container input[type="checkbox"]');
              var checkedAll_video = jQuery('#media_video_list_wrapper .checkbox-container input[type="checkbox"]');   
              var checkedList_audio = jQuery(checkedAll_audio).map(function() {
                    return this.attributes.getNamedItem("data-mid").value;
                  }).get();
              var checkedList_photo = jQuery(checkedAll_photo).map(function() {
                    return this.attributes.getNamedItem("data-mid").value;
                  }).get();
              var checkedList_text = jQuery(checkedAll_text).map(function() {
                    return this.attributes.getNamedItem("data-mid").value;
                  }).get();
              var checkedList_video = jQuery(checkedAll_video).map(function() {
                    return this.attributes.getNamedItem("data-mid").value;
                  }).get();
                  
              if(clickedMedia == 'audio' || this.props.singlecheckAudio == true) {
                if(checkedList_audio != '') {            
                  checkedList_audio.map((item, key) => {
                    selectedRows_audio.push(+item);              
                  });            
                }
                selectedRows_audio = selectedRows_audio.filter((val, id, array) => {
                  return array.indexOf(val) == id;  
                });
              } 
              if(clickedMedia == 'photo' || this.props.singlecheckPhoto == true) {
                if(checkedList_photo != '') {            
                  checkedList_photo.map((item, key) => {
                    selectedRows_photo.push(+item);              
                  });            
                }
                selectedRows_photo = selectedRows_photo.filter((val, id, array) => {
                  return array.indexOf(val) == id;  
                });
              }
              if(clickedMedia == 'text' || this.props.singlecheckText == true) {
                if(checkedList_text != '') {            
                  checkedList_text.map((item, key) => {
                    selectedRows_text.push(+item);              
                  });            
                }
                selectedRows_text = selectedRows_text.filter((val, id, array) => {
                  return array.indexOf(val) == id;  
                });               
              }
              if(clickedMedia == 'video' || this.props.singlecheckVideo == true) {
                if(checkedList_video != '') {            
                  checkedList_video.map((item, key) => {
                    selectedRows_video.push(+item);              
                  });            
                }
                selectedRows_video = selectedRows_video.filter((val, id, array) => {
                  return array.indexOf(val) == id;  
                });
              }                            
            }else{
              selectedRows_audio = [];
              selectedRows_photo = [];
              selectedRows_text = [];
              selectedRows_video = [];
              jQuery('#'+this.state.fileType+'-select-box-element-wrapper').addClass('options-disable');           
            }                        
          },
          DownloadSelected: function(){
            var t = this;  
            if(t.state.fileType == 'audio'){
              selectedRows_photo = [];
              selectedRows_text = [];
              selectedRows_video = []; 
              selectedRows_audio.map((item, key) => {
                axios.get(media_base_url+'/media/'+item+'/edit?_format=json')
                .then(function(result) {
                  if(result.status == 200){
                    var theAnchorAudio = jQuery('<a />').attr('href', result.data.field_media_audio_file[0].original_url).attr('download','').appendTo('body');  
                    theAnchorAudio[0].click();                   
                    theAnchorAudio.remove();
                    window.location.reload();
                  }else{
                    alert('Error');
                  }
                });
              });
              selectedRows_audio = [];
            }  
            if(t.state.fileType == 'photo'){
              selectedRows_audio = [];
              selectedRows_text = [];
              selectedRows_video = [];
              selectedRows_photo.map((item, key) => {
                axios.get(media_base_url+'/media/'+item+'/edit?_format=json')
                .then(function(result) {
                  if(result.status == 200){
                    var theAnchorPhoto = jQuery('<a />').attr('href', result.data.field_media_image[0].original_url).attr('download','').appendTo('body');
                    theAnchorPhoto[0].click();                   
                    theAnchorPhoto.remove();
                    window.location.reload();
                  }else{
                    alert('Error');
                  }
                });
              });
              selectedRows_photo = [];
            } 
            if(t.state.fileType == 'text'){
              selectedRows_audio = [];
              selectedRows_photo = [];
              selectedRows_video = []; 
              selectedRows_text.map((item, key) => {
                axios.get(media_base_url+'/media/'+item+'/edit?_format=json')
                .then(function(result) {
                  if(result.status == 200){                                      
                    var theAnchorText = jQuery('<a />').attr('href', result.data.field_media_file[0].original_url).attr('download','').attr('target', '_blank').appendTo('body');  
                    theAnchorText[0].click();                   
                    theAnchorText.remove();
                    setTimeout(location.reload.bind(location), 10000);
                  }else{
                    alert('Error');
                  }
                });
              });
              selectedRows_text = [];
            }
            if(t.state.fileType == 'video'){
              selectedRows_audio = [];
              selectedRows_photo = [];
              selectedRows_text = [];
              selectedRows_video.map((item, key) => {
                axios.get(media_base_url+'/media/'+item+'/edit?_format=json')
                .then(function(result) {
                  if(result.status == 200){
                    var theAnchorVideo = jQuery('<a />').attr('href', result.data.field_media_video_file[0].original_url).attr('download','').appendTo('body');  
                    theAnchorVideo[0].click();                   
                    theAnchorVideo.remove();
                    window.location.reload();
                  }else{
                    alert('Error');
                  }
                });
              });
              selectedRows_video = [];
            } 
          },
          DeleteSelected: function(){
            var t = this;
            axios.get(Drupal.url('rest/session/token'))
            .then(function (data) {
              var csrfToken = data.data;
              let headers = {'Content-Type': 'application/hal+json','Cache-Control': 'no-cache', 'X-CSRF-Token':csrfToken,};
              var media_type = t.state.fileType;
              if(t.state.fileType === 'photo'){
                media_type = 'image';
              }
              var type_url = media_base_url_http + '/rest/type/media/'+media_type+'';
              var hal_json_archive = {
                "_links": {
                  "type": {"href": type_url }
                },
                "field_archived": [
                  {
                    "value": Boolean(!media_archive)
                  }
                ]
              };
              switch (t.state.fileType) {
                case 'audio':
                  selectedRows_photo = [];
                  selectedRows_text = [];
                  selectedRows_video = []; 
                  return selectedRows_audio.map((item, key) => {
                    axios.patch(t.state.base_url+'/media/'+item+'/edit?_format=hal_json', hal_json_archive, { headers: headers })
                    .then(function(result) {
                      if(result.status == 200){
                        window.location.reload();
                      }else{
                        alert('Error');
                      }
                    });
                  });
                  selectedRows_audio = [];
                break;  
                case 'photo':
                  selectedRows_audio = [];
                  selectedRows_text = [];
                  selectedRows_video = [];
                  return selectedRows_photo.map((item, key) => {
                    axios.patch(t.state.base_url+'/media/'+item+'/edit?_format=hal_json', hal_json_archive, { headers: headers })
                    .then(function(result) {
                      if(result.status == 200){
                        window.location.reload();
                      }else{
                        alert('Error');
                      }
                    });
                  });
                  selectedRows_photo = [];
                break;  
                case 'text':
                  selectedRows_audio = [];
                  selectedRows_photo = [];
                  selectedRows_video = [];
                  return selectedRows_text.map((item, key) => {
                    axios.patch(t.state.base_url+'/media/'+item+'/edit?_format=hal_json', hal_json_archive, { headers: headers })
                    .then(function(result) {
                      if(result.status == 200){
                        window.location.reload();
                      }else{
                        alert('Error');
                      }
                    });
                  });
                  selectedRows_text = [];
                break;  
                case 'video':
                  selectedRows_audio = [];
                  selectedRows_photo = [];
                  selectedRows_text = [];
                  return selectedRows_video.map((item, key) => {
                    axios.patch(t.state.base_url+'/media/'+item+'/edit?_format=hal_json', hal_json_archive, { headers: headers })
                    .then(function(result) {
                      if(result.status == 200){
                        window.location.reload();
                      }else{
                        alert('Error');
                      }
                    });
                  });
                  selectedRows_video = [];
                break;  
                default:
                  selectedRows_audio = [];
                  selectedRows_photo = [];
                  selectedRows_text = [];
                  selectedRows_video = [];
              }
              jQuery('#modal').modal('hide');
              t.setState({showModal: false});
              t.setState({fileType: ''});
              t.setState({SD_modal_status: false});
              t.setState({DS_modal_msg: ''});
              t.setState({delete_modal_msg: ''});
            });
          },
          addToMediaKit: function(e){
            e.preventDefault();
            var th = this;
            var media_kit_id = e.target.value;             
            var mtype = th.state.fileType;
            var spinner = '<div class="progress-overlay"><div class="km-loader"></div></div>';
            jQuery('#media_'+mtype+'_list_wrapper').append(spinner);
						processRunning = true;
            var data_string = '';
            var selectedData = [];
            var existingData = [];
            var final_data = [];
            th.setState({selectedKit: media_kit_id});            
            jQuery('#'+mtype+'_vault tbody tr input:checkbox').each(function (event) {
              if (jQuery(this).is(':checked')) {
                selectedData.push(parseInt(jQuery(this).attr('data-mid')));           
              }
            });
            
            this.serverRequest = axios.get(media_base_url+'/node/'+media_kit_id+'?_format=json')
              .then(function(response) {
                if(mtype == 'audio'){
                  return response.data.field_vault_audio;
                }
                if(mtype == 'photo'){
                  return response.data.field_vault_photo;
                }
                if(mtype == 'text'){
                  return response.data.field_vault_file;
                }
                if(mtype == 'video'){
                  return response.data.field_vault_video;
                }
              })
              .then(function(data) {
                return Promise.all(data.map( (record, index) => {
                  return parseInt(record.target_id);
                }))
              })
              .then(function(responsex) {  
								console.log(responsex);
                existingData.push(responsex);
                var merge_data = existingData[0].concat(selectedData); 
								console.log(merge_data);
                
                //remove duplicate data
                final_data = [...new Set(merge_data)];
								console.log(final_data);
                
                if(final_data.length > 0) {
                  jQuery.each( final_data, function( key, value ) {
                    data_string += '{"target_id":'+value+'},';                 
                  }); 
                  
                  //remove last comma
                  data_string = data_string.slice(0, -1);
                  data_string = '['+data_string+']';
                  //console.log(data_string);
                  
                  //convert string to JSON data
                  jsondata = JSON.parse(data_string);
                  //console.log(jsondata);
                  
                  //update node audio field array as per sort order
                  axios.get(Drupal.url('rest/session/token'))
                  .then(function (data) {
                    var csrfToken = data.data;
                    let headers = {'Content-Type': 'application/hal+json','Cache-Control': 'no-cache', 'X-CSRF-Token':csrfToken,};
                    var node_url_json = media_base_url+"/node/"+media_kit_id+'?_format=hal_json';
                    var type_url = media_base_url_http+'/rest/type/node/media_kit';
                    var media_field = {
                      "_links": {
                        "type": {"href": type_url }
                      }
                    };                    
                    //create dynamic key for media field type
                    if(mtype == 'text'){
                      reference_field = "field_vault_file";
                    } else{
                      reference_field = "field_vault_"+mtype;
                    }
                    media_field[reference_field] = jsondata;
                    var myArray = [];
                    myArray.push(media_field);
                    axios.patch(node_url_json, myArray[0], { headers: headers })
                    .then(function(resultdata) {
                      window.location.reload();
                      /* jQuery('#'+mtype+'-refresh').trigger('click');
                      jQuery('#'+mtype+'_vault tbody tr input:checkbox').each(function (event) {
                        jQuery(this).prop("checked", false);
                      });
                      jQuery('.select-box-element select').prop('selectedIndex',0); */
                      /* setTimeout(function() {
                        jQuery("#"+mtype+"-refresh").trigger('click');
                      }, 1000); */
                    })
                  });  
                }
            });
          }
        });

        //**************************App components for media tabs.*****************************************//
        //Audio files        
        
        var AppAudio = React.createClass({
          getInitialState: function() {
            return {
              audios: [],
              value: [],                          
              showModal: false,
              singlecheckAudio: false,
              fileType: '',
              mid: '',
              base_url: media_base_url,
              marked_check: false,
              row_id: '',
              delete_modal_msg: '',
              arc_icon_class: 'arc_'+media_archive,
              arc_del_class: 'del_'+media_archive,
              arc_status: media_archive,
              spinner_status: false,
              mediaDeleteModal: false,
              wrapperID: '#media_audio_list_wrapper',
            }
          },
          componentDidMount: function() {
            var th = this;                                        
            this.serverRequest =
              axios.get(url)
                .then(function(result) {
                  return result.data.field_vault_audio;
                })
                .then(function(response) {
									audioLen = response.length;								
									th.setState({spinner_status: true});
                  return Promise.all(response.map( (record, index) => {    
                    return axios.get(media_base_url+'/media/'+record.target_id+'/edit?_format=json');
                  }))
                })
                .then(function(responsex) {                                 
                  th.setState({audios: responsex});
                });
						document.addEventListener('mouseover', th.tooltipfn.bind());
          },
          UpdateMethod: function() {
            //Force a render with a simulated state change
            var th = this;
              this.serverRequest = 
                axios.get(url)
                .then(function(result) { 
                  return result.data.field_vault_audio;                   
                })
                .then(function(response) {
									audioLen = response.length;																		
									//if(response.length > 0 ){
										th.setState({spinner_status: true});
										processRunning = true;
									//}
                  return Promise.all(response.map( (record, index) => {
                    return axios.get(media_base_url+'/media/'+record.target_id+'/edit?_format=json');
                  }))
                })
                .then(function(responsex) {
                  th.setState({audios: responsex}); 
                  th.setState({spinner_status: false});
                  jQuery('#media_audio_list_wrapper').find('.progress-overlay').remove();
				  processRunning = false;
                });             
          }, 
					tooltipfn: function(event){
						jQuery('[data-toggle="tooltip"]').tooltip({placement : 'right'});
					},
          render: function() {
						var audio_list = this.state.audios;
						var check_non_archive = [];
						var check_archive = [];
						if(audio_list.length){
							for(var i = 0, len = audio_list.length; i < len;i++){
								if(audio_list[i].data.field_archived.length && audio_list[i].data.field_archived[0].value === true){
									audio_archive_blank_flag = true;
									check_archive.push(audio_list[i].data.field_archived[0].value);
								} else {
									audio_blank_flag = true;
									check_non_archive.push(audio_list[i].data.field_archived[0].value);
								}
								if(check_archive.length == 0){
									audio_archive_blank_flag = true;									
								} else if(check_non_archive.length == 0){
									audio_blank_flag = true;					
								}
							}
						}
						
            var counter = 0;
            var archive_switch;
            var archiveswitchid;
            if(Boolean(media_archive)){
							var tooltip_arc_title = 'Restore';
              archive_text = 'Media Vault';
            }else{
							var tooltip_arc_title = 'Archive';
              archive_text = 'View Archive';
            }
            if (this.state.showModal) {
              var modalElement = React.createElement(Modal, {handleHideModal: this.handleHideModal, handleArchive: this.handleArchiveAudio, fileType: this.state.fileType, mid:this.state.mid, base_url: media_base_url, delete_modal_msg: this.state.delete_modal_msg, arc_status: this.state.arc_status, mediaDeleteModal: false});
							if(this.state.mediaDeleteModal) {
								var modalElement = React.createElement(Modal, {handleHideModal: this.handleHideModal, handleArchive: this.handleDeleteVault, fileType: this.state.fileType, mid:this.state.mid, base_url: media_base_url, delete_modal_msg: this.state.delete_modal_msg, arc_status: this.state.arc_status, mediaDeleteModal: this.state.mediaDeleteModal});
							}
            }
            if(this.state.spinner_status){
              var spinner_process = React.createElement('div', {className:'progress-overlay'}, React.createElement('div', {className:'km-loader'}, ''));
            }
						var items = '';
						this.state.audios.sort((a, b) => a.data.name[0].value.localeCompare(b.data.name[0].value));
						if((audioLen == 0 && audioLen !== '' && media_archive == 1) || (check_archive.length == 0 && media_archive == 1 && audio_archive_blank_flag == true)){
              items = React.createElement('tr', {className: 'no-media-data text-center'},
                React.createElement('td', {className: 'media-data text-center', colSpan: "9"},
                  React.createElement('div', {className: 'no-media-data-message'},
                    React.createElement('span', {className: 'message'}, 'You currently have no archived audio assets.'),
                  )
                ),
              );
							jQuery('#media_audio_list_wrapper').find('.progress-overlay').remove();
							archive_switch = '/tools/media/vault/'+a+window.location.hash;
							archiveswitchid = 'archiveswitch';
            }
						else if((audioLen == 0 && audioLen !== '' && media_archive == 0) || (check_non_archive.length == 0 && media_archive == 0 && audio_blank_flag == true)){
              items = React.createElement('tr', {className: 'no-media-data text-center'},
                React.createElement('td', {className: 'media-data text-center', colSpan: "9"},
                  React.createElement('div', {className: 'no-media-data-message'},
                    React.createElement('span', {className: 'message'}, 'You currently have no audio assets.'),
                  )
                ),
              );
							jQuery('#media_audio_list_wrapper').find('.progress-overlay').remove();
							if(check_archive.length){
								archive_switch = '/tools/media/archive/'+a+window.location.hash;
                archiveswitchid = 'archiveswitch';            
							}
            }
            else {
              items = this.state.audios.map((item, key) => {
                if(item.data.field_archived[0].value == Boolean(media_archive) && parseInt(item.data.uid[0].target_id) == currentUID){
                  counter += 1;
                  //for created Date
                  let current_datetime = new Date(item.data.created[0].value)
                  var h = current_datetime.getHours();
                  var meridian = 'AM';
                  if( h > 12){
                   h = h - 12 ;
                   meridian = 'PM';
                  }
                  var min = current_datetime.getMinutes();
                  if(min < 10){
                   min = '0'+min;
                  }
                  let formatted_date =  (current_datetime.getMonth() + 1) + "/" +current_datetime.getDate()+ "/" + current_datetime.getFullYear() +", "+ h + ":" + min+' '+meridian;
                  
                  //File type
									var app_extention = '-';
									if(item.data.field_media_audio_file.length && item.data.field_media_audio_file[0].target_id != ''){
										var ext = (item.data.field_format.length > 0) ? item.data.field_format[0].value : '';
										ext = ext.substring(ext.lastIndexOf(".") + 1, ext.length);
										app_extention = ext;
										//var fid = (item.data.field_media_audio_file.length > 0) ? item.data.field_media_audio_file[0].target_id : '';
                    //app_extention = React.createElement(AppExtention, {base_url: media_base_url, ext:ext, fid:fid, get_type_col: false});
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
                  } // else {
                    //if((item.data.field_media_audio_file).length > 0){
                   //   file_size = React.createElement(AppFileSize, {base_url: media_base_url, fid: item.data.field_media_audio_file[0].target_id});
                   // } 
                  //}
                  
                  //for Rating
                  var rateDate = '-';
                  var rateDateAlign = 'text-center';
                  if(item.data.field_rating.length){
                    rate = item.data.field_rating[0].url;
                    rateDate = React.createElement(AppTaxo, {base_url: media_base_url, srate: rate});
                    rateDateAlign = '';
                  }
                  //for Sample rating
                  var srateDate = '-';
                  var srateDateAlign = 'text-center';
                  if(item.data.field_sample_rate.length){
                    srate = item.data.field_sample_rate[0].url;
                    srateDate = React.createElement(AppTaxo, {base_url: media_base_url, srate: srate});
                    srateDateAlign = '';
                  }
                  //for keyword
                  var keywords_values = ['-'];
                  var keyword_center = 'text-center';
                  var tags = [];
                  var tagsArr = '';
                  if(item.data.field_keywords.length){
                    keyword_center = '';
                    var keywords = item.data.field_keywords.map((kitem, kkey) => {
                      keywords_values[kkey] = React.createElement(AppTaxo, {base_url: media_base_url, srate: kitem.url});
                      tags.push(kitem.name);
                      tagsArr = tags.toString();
                    });
                  }
                  //for favorite
                  var favorite_inactive = 'inactive';
                  var favo = 'not favorite';								
                  if(Boolean(item.data.field_favorite[0].value)){
                    favorite_inactive = 'active';
                    favo = 'favorite';
                  }
                  
                  let mkit_elem = React.createElement(AppMediaKits, {base_url: media_base_url, mid: item.data.mid[0].value, fileType: 'audio'});
                  
                  var file_obj_url = '';
                  if(item.data.field_media_audio_file.length && item.data.field_media_audio_file[0].target_id != ''){
                    file_obj_url = item.data.field_media_audio_file[0].original_url;
                  }
									
                  return React.createElement('tr', {'data-favo': favo, 'data-id': key, 'data-mtype': item.data.bundle[0].target_id, 'data-nid': media_vault_id, 'data-mid': item.data.mid[0].value, id: 'item-audio-'+key, className: 'media-row ui-state-default'},
                    React.createElement('td', {className: 'audio-data text-center'},
                      //React.createElement('span', {className: 'move-icon'}),
                      React.createElement('label', {className: 'checkbox-container'},
                        React.createElement('input',{type: 'checkbox', id: 'audio-check-'+key, className: 'box-check', 'data-mid': item.data.mid[0].value, defaultChecked: false, onChange: this.switch_operation_action.bind()}),
                        React.createElement('span', {className: 'checkmark'}),
                      )
                    ),
                    React.createElement('td', {className: 'audio-data d-flex justify-content-center align-items-center media-data-icon'},
                      React.createElement('div', {className: 'audio-box'},
                        React.createElement("audio", {id: 'audio-'+key, controls:"controls", style:{'width': '0px', 'height': '0px', 'visibility':'hidden', 'min-width':'0px!important', 'min-height':'0px!important', 'display':'none'}}, 
                          React.createElement('source', {src:file_obj_url},'')
                        ),
                        React.createElement('button', {type: 'button', className: 'audio-play-button', onClick: this.playAudio.bind(null, this, 'audio-'+key, 'volCol-'+key)},''),
                        React.createElement('div', {className:'vol-box'},
                          React.createElement('div', {className:'vol-box-inner'},
                            React.createElement('input', {type: 'range', id:'volCol-'+key, className: 'volume-control', min: 0, max: 1, step: 0.1, value: this.state.value, onChange: this.kbVolControl.bind(null, this, 'audio-'+key, 'volCol-'+key)}),
                            React.createElement('i', {className:'fa fa-volume-up', onClick: this.kbmute.bind(null, this, 'audio-'+key, 'volCol-'+key)},'')
                          )
                        )
                      ),
                    ),
                    React.createElement('td', {className: 'sorted audio-data media-title'}, item.data.name[0].value, mkit_elem),
                    React.createElement('td', {className: 'audio-data media-f-name'}, ''),
                    React.createElement('td', {className: 'audio-data text-center media-tags', style:{'display':'none'}}, tagsArr),
                    React.createElement('td', {className: 'audio-data text-center media-format'}, app_extention),
                    React.createElement('td', {className: 'audio-data text-center media-duration'}, audio_time),
                    React.createElement('td', {className: 'audio-data text-right media-f-size'}, file_size),
                    React.createElement('td', {className: 'audio-data media-fav'},
                      React.createElement('ul', {},
                        React.createElement('li', {},
                          React.createElement('a', {href:'/tools/media/'+item.data.mid[0].value, 'data-toggle':'tooltip', 'data-placement': 'right', 'title': 'Edit', onmouseover: this.tooltipfn.bind(this), className: this.state.arc_del_class+' audio-edit audio-round-button'}, ''),
                        ),
                        React.createElement('li', null,
                          React.createElement('button', {type: 'button', className: 'audio-favo audio-round-button '+favorite_inactive, 'data-toggle':'tooltip', 'data-placement': 'right', 'title': 'Favorite', onmouseover: this.tooltipfn.bind(this), onClick: this.handleFavoriteAudio.bind(null, item.data.mid[0].value, item.data.field_favorite[0].value, key)}, '')
                        ),
                        React.createElement('li', null,
                          React.createElement('a', {href:file_obj_url, download:'', className: 'audio-download audio-round-button', 'data-toggle':'tooltip', 'data-placement': 'right',  onmouseover: this.tooltipfn.bind(this), 'title': 'Download'}, ''), 
                        ),
                         React.createElement('li', null,
                          React.createElement('button', {type: 'button', className: 'share-link audio-round-button','data-toggle':'tooltip', 'data-placement': 'right','title': 'Share', onmouseover: this.tooltipfn.bind(this),onClick: this.ShowmodalConfAud.bind(null, this, item.data.mid[0].value,item.data.name[0].value)})
                         ),
                        React.createElement('li', null,
                          React.createElement('button', {type: 'button', className: this.state.arc_icon_class+' audio-round-button', 'data-toggle': 'tooltip', 'data-placement': 'right', 'title': tooltip_arc_title, onmouseover: this.tooltipfn.bind(this), onClick: this.Showmodal.bind(null, item.data.bundle[0].target_id, item.data.mid[0].value, key)}, '')
                        ),
												React.createElement('li', null,
                          React.createElement('button', {type: 'button', className: 'delete-media audio-round-button', 'data-toggle': 'tooltip', 'data-placement': 'right', 'title': 'Delete', onmouseover: this.tooltipfn.bind(this), onClick: this.DeleteVault.bind(null, item.data.bundle[0].target_id, item.data.mid[0].value, item.data.name[0].value)}, '')
                        ),
                      ),
                    ),
                  );									
                }else if(media_archive){
                  archive_switch = '/tools/media/vault/'+a+window.location.hash;
                  archiveswitchid = 'archiveswitch';
                }else{
                  archive_switch = '/tools/media/archive/'+a+window.location.hash;
                  archiveswitchid = 'archiveswitch';
                }
              });
							//jQuery('#media_audio_list_wrapper').find('.progress-overlay').remove();
            }

            var table_head = React.createElement('thead',{},
              React.createElement('tr', null,
                React.createElement('th', null, ),
                React.createElement('th', null, ),
                React.createElement('th', {className: 'bg-sort sortempty asc-icon media-title', onClick: this.sortColumn.bind(this), style:{'width':'30%'}}, 'Title'),
                React.createElement('th', {className: 'sortempty media-f-name', onClick: this.sortColumn.bind(this), style:{'width':'10%'}}, 'Preset'),
								React.createElement('th', {className: 'sortempty media-tags', style:{'display':'none'}}, 'Tags'),
                React.createElement('th', {className: 'sortempty media-format', onClick: this.sortColumn.bind(this)}, 'Format'),
                React.createElement('th', {className: 'sortempty media-duration', onClick: this.sortColumn.bind(this)}, 'Duration'),
                React.createElement('th', {className: 'sortempty media-f-size', onClick: this.sortColumn.bind(this)}, 'File Size'),
                React.createElement('th', {className: 'media-action text-center media-fav'}, 'ACTIONS'),
              ),
            );
            var table_data = React.createElement('table',{id: 'audio_vault', 'paging': true, className: 'media-table w-100 mt-0'},table_head, React.createElement('tbody', null, items));
            ReactDOM.render(
              React.createElement(SelectDownload, {box: '#media_audio_list_wrapper', fileType: 'audio', singlecheckAudio: this.state.singlecheckAudio, archiveswitchid: archiveswitchid, archive_switch, archive_switch: archive_switch, archive_text: archive_text, nmk: nmk}),document.querySelector("#audio-select-box-element-wrapper"));            
            var updatediv = React.createElement('div', {className: 'd-none', id: 'audio-refresh', onClick: this.UpdateMethod.bind()}, 'refresh');
 
            return ( React.createElement("div", {id: "media_audio_list_wrapper", className: 'row m-0 table-responsive'}, table_data, modalElement, spinner_process, updatediv) );
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
							
            if(txt == 'File Size'){
							Array.from(table.querySelectorAll('tr.media-row')).sort(function sort(a, b) {
								var data = jQuery(a).children('td.media-f-size').text();
								var datab = jQuery(b).children('td.media-f-size').text();
								var num = th.retnum(data);
								var numb = th.retnum(datab);
								if(t.asc){
									if (num < numb) return -1;
									if (num > numb) return 1;
									if (num == numb) return -1;
								} else if(!t.asc){
									if (num > numb) return -1;
									if (num < numb) return 1;
									if (num == numb) return -1;
								} else{
									if (num > numb) return -1;
									if (num < numb) return 1;
									if (num == numb) return -1;
								}
								
							}).forEach(tr => table.appendChild(tr) );
						}  
						
            //adding class to sorted column
            jQuery('#'+tableid+' td').removeClass('sorted');
            var table_id = jQuery(t.closest('table').parentNode).attr('id');
            var ind = jQuery(t).index() + 1;
            jQuery('#'+table_id+' td:nth-child('+ind+')').addClass('sorted');
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
          DeleteVault: function(fileType, mid, file_name){
						var th = this;
						let msg = React.createElement(AppDeleteMediaMsg, {base_url: media_base_url, mid: mid, fileType: fileType, file_name: file_name});
						th.setState({showModal: true});
						th.setState({mediaDeleteModal: true});
						th.setState({fileType: fileType});
						th.setState({mid: mid});
						th.setState({delete_modal_msg: msg});
					},
          handleDeleteVault: function(){
						var t = this;
						var type = t.state.fileType;
						if(type == 'text'){
							type = 'file';
						}
						var mid = t.state.mid;
						var reference_list = [];
						var lis = jQuery('#delete-vault-content li');
						lis.each(function(event){
							reference_list.push(jQuery(this).attr('data-entity'));
						});
						if(reference_list.length){
              var spinner = '<div class="progress-overlay delete-selected"><div class="km-loader"></div></div>';
              jQuery('#page').append(spinner);
							jQuery.ajax({
								url: '/media_vault/delete',
								data:{"mid": mid, "type": type, "reference_nids": reference_list, "uid": file_owner},
								type: "POST",
								success:function(data){
									if(data == 'done'){
										window.location.reload();
									}
								}
							});
						}
						t.setState({showModal: false});
						t.setState({mediaDeleteModal: false});
						t.setState({mid: ''});
						t.setState({delete_modal_msg: ''});
					},
          Showmodal: function(fileType, mid, row_id){
						var msg = React.createElement("div", null, "This action will remove this media file from your ", React.createElement("b", null, "Media Vault"), " and move it to your ", React.createElement("b", null, "Media Archive"), ". It will not be available for use while archived. You will be able to recover it later, if needed.");
						if(this.state.arc_status){
						  msg = React.createElement('div', null, 'This action will restore this file to your Media Vault and any previously selected uses.');
						}
            this.setState({showModal: true});
            this.setState({fileType: fileType});
            this.setState({mid: mid});
            this.setState({row_id: row_id});
            this.setState({delete_modal_msg: msg});
          },
          handleHideModal: function(){
            this.setState({showModal: false});
					  this.setState({mediaDeleteModal: false});
            this.setState({mid: ''});
            this.setState({row_id: ''});
            this.setState({delete_modal_msg: ''});
          },
          handleArchiveAudio: function(){
            var t = this;
            axios.get(Drupal.url('rest/session/token'))
            .then(function (data){
              var csrfToken = data.data;
              let headers = {'Content-Type': 'application/hal+json','Cache-Control': 'no-cache', 'X-CSRF-Token':csrfToken};
              var media_url_hal_json = t.state.base_url+'/media/'+t.state.mid+'/edit?_format=hal_json';
              var type_url = media_base_url_http + '/rest/type/media/audio';
              var audio_hal_json_archive = {
                "_links": {
                  "type": {"href": type_url }
                },
                "field_archived": [
                  {
                    "value": Boolean(!media_archive)
                  }
                ]
              };
              axios.patch(media_url_hal_json, audio_hal_json_archive, { headers: headers })
              .then(function(result) {
                if(result.status == 200){
                  t.setState({spinner_status: true});
									window.location.reload();
                  //jQuery("#audio-refresh").trigger('click');
                }else{
                  alert('Error');
                }
              });
              jQuery('#modal').modal('hide');
              t.setState({showModal: false});
              t.setState({mid: ''});
              t.setState({row_id: ''});
              t.setState({delete_modal_msg: ''});
            });
          },
          handleFavoriteAudio: function(mid, field_favorite_value, row_id){
            var t =this;
 					  t.setState({spinner_status: true});
            var favorite_row = Number(row_id);
            axios.get(Drupal.url('rest/session/token'))
            .then(function (data) {
              var csrfToken = data.data;
              let headers = {'Content-Type': 'application/hal+json','Cache-Control': 'no-cache', 'X-CSRF-Token':csrfToken,};
              var media_url_hal_json = t.state.base_url+'/media/'+mid+'/edit?_format=hal_json';
              var type_url = media_base_url_http + '/rest/type/media/audio';
              var audio_hal_json_favorite = {
                "_links": {
                  "type": {"href": type_url }
                },
                "field_favorite": [
                  {
                    "value": Boolean(!field_favorite_value)
                  }
                ]
              };
              axios.patch(media_url_hal_json, audio_hal_json_favorite, { headers: headers })
              .then(function(result) {
                if(result.status == 200){
                  let new_list = t.state.audios;
                  //new_list[favorite_row].data.field_favorite[0].value = Boolean(!field_favorite_value);
                  //t.setState({audios: new_list});
                  //t.setState({spinner_status: false});
									//jQuery('#media_audio_list_wrapper').find('.progress-overlay').remove();
									//processRunning = false;
									window.location.reload();
                }else{
                  alert('Error');
                }
              });
              t.setState({mid: ''});
            });
          },
          switch_operation_action: function(e){
           // this.setState({singlecheckAudio: true});
            console.log('second-1');
             // console.log('singlecheckAudio1 '+ singlecheckAudio); //comment due to undefined singlecheckAudio 
            if (e.target.checked) {
              selectedRows_audio.push(+e.target.attributes.getNamedItem("data-mid").value);
              console.log('checked');
            } else {
              let index = selectedRows_audio.indexOf(+e.target.attributes.getNamedItem("data-mid").value);
              selectedRows_audio.splice(index, 1);
              console.log('unchecked');
            }
            console.log('audio-list '+selectedRows_audio);
            var data = jQuery(this.state.wrapperID+' .checkbox-container input[type="checkbox"]:checked').map(function() {
                        return e.target.value;
                      }).get();
            console.log('audio-data '+data);
            if(data == ''){
              jQuery('#audio-select-box-element-wrapper').addClass('options-disable');
            }
            else {
              jQuery('#audio-select-box-element-wrapper').removeClass('options-disable');
            }
          }
        });
						
				function audioRender(){
					ReactDOM.render(
						React.createElement(AppAudio, 'div',{className:'x2'}), document.querySelector("#nav-master-audio-detail"));
				}
        
        //Photo Detail
        var AppPhoto = React.createClass({
          getInitialState: function() {
            return {
              photos: [],
              /* sorting: [], */
              photosData: [],
              photosStyle: [],
              showModal: false,
              singlecheckPhoto: false,
              refereshCom: false,
              fileType: '',
              mid: '',
              base_url: media_base_url,
              row_id: '',
              delete_modal_msg: '',
              arc_icon_class: 'arc_'+media_archive,
              arc_del_class: 'del_'+media_archive,
              arc_status: media_archive,
              spinner_status: false,
							mediaDeleteModal: false,
              wrapperID: '#media_photo_list_wrapper',
            }
          },
          componentDidMount: function(){
            var th = this;
            this.serverRequest = 
              axios.get(url)
                .then(function(result) {    
                    return result.data.field_vault_photo;
                })
                .then(function(response) {
										 //console.log(response);
									photoLen = response.length;
									//if(response.length > 0 ){
										th.setState({spinner_status: true});
									//}
                  return Promise.all(response.map( (record, index) => {
                    return axios.get(media_base_url+'/media/'+record.target_id+'/edit?_format=json');
									}))
                })
                .then(function(responsex) {
									th.setState({photos: responsex}); 
                });
						document.addEventListener('mouseover', th.tooltipfn.bind());
          },
          UpdateMethod: function() {
            //Force a render with a simulated state change
            var th = this;
              this.serverRequest = 
                axios.get(url)
                  .then(function(result) { 
                    return result.data.field_vault_photo;                   
                  })
                  .then(function(response) {
										photoLen = response.length;
										//if(response.length > 0 ){
											th.setState({spinner_status: true});
											processRunning = true;
										//}
                    return Promise.all(response.map( (record, index) => {
                      return axios.get(media_base_url+'/media/'+record.target_id+'/edit?_format=json');
                    }))
                  })
                  .then(function(responsex) {
                    th.setState({photos: responsex});                   
                    th.setState({spinner_status: false}); 
                    jQuery('#media_photo_list_wrapper').find('.progress-overlay').remove();
										processRunning = false;
                  });            
          },
					tooltipfn: function(event){
						jQuery('[data-toggle="tooltip"]').tooltip({placement : 'right'});
					},
          render: function() {
						var photo_list = this.state.photos;
						var check_non_archive = [];
						var check_archive = [];
						if(photo_list.length){
							for(var i = 0, len = photo_list.length; i < len;i++){
								if(photo_list[i].data.field_archived[0].value === true){
									photo_archive_blank_flag = true;
									check_archive.push(photo_list[i].data.field_archived[0].value);
								} else {
									photo_blank_flag = true;
									check_non_archive.push(photo_list[i].data.field_archived[0].value);
								}
								if(check_archive.length == 0){
									photo_archive_blank_flag = true;									
								} else if(check_non_archive.length == 0){
									photo_blank_flag = true;					
								}
							}
						}
						//let checker_ar = arr => arr.every(v => v === true);
						//let checker = arr => arr.every(v => v === false);
						
            var counter = 0;
            var archive_switch;
            var archiveswitchid;
            if(Boolean(media_archive)){
							var tooltip_arc_title = 'Restore';
              archive_text = 'Media Vault';
            }else{
							var tooltip_arc_title = 'Archive';
              archive_text = 'View Archive';
            }
            if (this.state.showModal) {
              var modalElement = React.createElement(Modal, {handleHideModal: this.handleHideModal, handleArchive: this.handleArchivePhoto, fileType: this.state.fileType, mid:this.state.mid, base_url: media_base_url, delete_modal_msg: this.state.delete_modal_msg, arc_status: this.state.arc_status, mediaDeleteModal: false});
							if(this.state.mediaDeleteModal) {
								var modalElement = React.createElement(Modal, {handleHideModal: this.handleHideModal, handleArchive: this.handleDeleteVault, fileType: this.state.fileType, mid:this.state.mid, base_url: media_base_url, delete_modal_msg: this.state.delete_modal_msg, arc_status: this.state.arc_status, mediaDeleteModal: this.state.mediaDeleteModal});
							}
            }
            if(this.state.spinner_status){
              var spinner_process = React.createElement('div', {className:'progress-overlay'}, React.createElement('div', {className:'km-loader'}, null));
            }
						var items = '';
            if((photoLen == 0 && photoLen !== '' && media_archive == 1) || (check_archive.length == 0 && media_archive == 1 && photo_archive_blank_flag == true)){
              console.log('first');
              var items = React.createElement('tr', {className: 'no-media-data text-center'},
                React.createElement('td', {className: 'media-data text-center', colSpan: "9"},
                  React.createElement('div', {className: 'no-media-data-message'},
                    React.createElement('span', {className: 'message'}, 'You currently have no archived photo assets.'),
                  )
                ),
              );
							jQuery('#media_photo_list_wrapper').find('.progress-overlay').remove();
							archive_switch = '/tools/media/vault/'+a+window.location.hash;
							archiveswitchid = 'archiveswitch';
            }
						else if((photoLen == 0 && photoLen !== '' && media_archive == 0) || ((check_non_archive.length == 0) && media_archive == 0 && photo_blank_flag == true)){
               console.log('second');
              var items = React.createElement('tr', {className: 'no-media-data text-center'},
                React.createElement('td', {className: 'media-data text-center', colSpan: "9"},
                  React.createElement('div', {className: 'no-media-data-message'},
                    React.createElement('span', {className: 'message'}, 'You currently have no photo assets.'),
                  )
                ),
              );
							jQuery('#media_photo_list_wrapper').find('.progress-overlay').remove();
							processRunning = false;
							if(check_archive.length){
								archive_switch = '/tools/media/archive/'+a+window.location.hash;
                archiveswitchid = 'archiveswitch';            
							}
            }
            else {	
            console.log('third');						
							this.state.photos.sort((a, b) => a.data.name[0].value.localeCompare(b.data.name[0].value));
							items = this.state.photos.map((item, key) => {								
								var paginate = false;
                console.log('key='+key);
                console.log('paging_len='+paging_len);
								if(key > paging_len){
									paginate = true;									
								}
                if(media_archive == 1){
                  paginate = false;
                }
								if(paginate){
                  console.log('paginate true');
									 if(jQuery('#media_photo_list_wrapper .box').length == 1){
										jQuery('#media_photo_list_wrapper .box').remove();
								 	}
									var box = paginator({
										//table: document.getElementById('photo_vault'),
										rows_per_page : paging_len,
										box_mode : "list",
										get_rows: function () {
											return document.getElementById("photo_vault").getElementsByTagName("tr");
										},
									});
									box.className = "box";
									document.getElementById('media_photo_list_wrapper').appendChild(box);									
								}						
                if(item.data.field_archived[0].value == Boolean(media_archive) && parseInt(item.data.uid[0].target_id) == currentUID){
                  console.log('archive');
                  counter += 1;
                  //for created Date
                  let current_datetime = new Date(item.data.created[0].value)
                  var h = current_datetime.getHours();
                  var meridian = 'AM';
                  if( h > 12){
                   h = h - 12 ;
                   meridian = 'PM';
                  }
                  var min = current_datetime.getMinutes();
                  if(min < 10){
                   min = '0'+min;
                  }
                  let formatted_date =  (current_datetime.getMonth() + 1) + "/" +current_datetime.getDate()+ "/" + current_datetime.getFullYear() +", "+ h + ":" + min+' '+meridian;
                  //for favorite
                  var favorite_inactive = 'inactive';
                  var favo = 'not favorite';
                  if(Boolean(item.data.field_favorite[0].value)){
                    favorite_inactive = 'active';
                    favo = 'favorite';
                  }
                  //for keyword
                  var keywords_values = ['-'];
                  var keyword_center = 'text-center';
                  var tags = [];
                  var tagsArr = '';
                  if(item.data.field_keywords.length){
                    keyword_center = '';
                    var keywords = item.data.field_keywords.map((kitem, kkey) => {
                      keywords_values[kkey] = React.createElement(AppTaxo, {base_url: media_base_url, srate: kitem.url});
                      tags.push(kitem.name);
                      tagsArr = tags.toString();
                    });
                  }
                  
                  var file_obj_url = '';
                  var file_obj_image_style = '';
                  if(item.data.field_media_image.length && item.data.field_media_image[0].target_id != ''){
                  //  file_obj_url = item.data.field_media_image[0].original_url;
                    file_obj_url = item.data.field_media_image[0].download_url;
                    file_obj_image_style = item.data.field_media_image[0].image_style;
                  }
                  
                  //File type
                  var app_extention = '-';
									if(item.data.field_media_image.length && item.data.field_media_image[0].target_id != ''){
                    var ext = (item.data.field_format.length > 0) ? item.data.field_format[0].value : '';
										ext = ext.substring(ext.lastIndexOf(".") + 1, ext.length);
										app_extention = ext;
										//var fid = (item.data.field_media_image.length > 0) ? item.data.field_media_image[0].target_id : '';
                    //app_extention = React.createElement(AppExtention, {base_url: media_base_url, ext:ext, fid:fid, get_type_col: false});
                  }
                  //File size
                  var file_size = '-';
                  if((item.data.field_file_size).length > 0 && item.data.field_media_image.length && item.data.field_media_image[0].target_id != ''){
                    file_size = item.data.field_file_size[0].value;
                  } /* else {
                    if(item.data.field_media_image.length && item.data.field_media_image[0].target_id != ''){
                      file_size = React.createElement(AppFileSize, {base_url: media_base_url, fid: item.data.field_media_image[0].target_id});
                    } 
                  }*/
				  // preset
                   var preset_name = '';
				   /*if((item.data.field_made_from_preset).length > 0){
					 var url_preset = media_base_url+'/'+item.data.field_made_from_preset[0].url+'?_format=json'	
                     preset_name = getPresetName(url_preset);
                  }
				    // source type
				   if((item.data.field_media_source_type).length > 0){
					    if(item.data.field_media_source_type[0].value == 'uploaded' || item.data.field_media_source_type[0].value == 'Upload Modified' ){
							preset_name = 'Uploaded file';
						}
				   } */
				   var preset_values = '';
				   if(item.data.field_made_from_preset.length){
                      preset_name = React.createElement(PresetTaxo, {base_url: media_base_url, srate: item.  data.field_made_from_preset[0].url});
					  console.log(preset_name);
                  }
				   // source type
				   if((item.data.field_media_source_type).length > 0){
					    if(item.data.field_media_source_type[0].value == 'uploaded' || item.data.field_media_source_type[0].value == 'Upload Modified' ){
							preset_name = 'Uploaded file';
						}
				   } 
				  //console.log('hello');
                  
                  //let p_dimentions = React.createElement(pdimention, {sourceURL: item.data.field_media_image[0].url});
                  //Photo Pixel dimension
                  if((item.data.field_pixel_dimentions).length > 0){
                    var p_dimension = item.data.field_pixel_dimentions[0].value;
                  } else {
                    var p_dimension = '-';//React.createElement(AudioTime, {audioURL: item.data.field_media_audio_file[0].url}); 
                  }
                  
                  let mkit_elem = React.createElement(AppMediaKits, {base_url: media_base_url, mid: item.data.mid[0].value, fileType: 'image'});
                  
                  return React.createElement('tr', {'data-favo': favo, 'data-id': key, 'data-mtype': item.data.bundle[0].target_id, 'data-nid': media_vault_id, 'data-mid': item.data.mid[0].value, id: 'item-photo-'+key,className:'media-row',  'data-exthumbimage': item.data.field_media_image[0].image_style, 'data-src': item.data.field_media_image[0].modal_style_url /* ,  'data-sub-html': '#gallery-caption' */ },
                    React.createElement('td', {className: 'media-data text-center'},
                      //React.createElement('span', {className: 'move-icon'}),
                      React.createElement('label', {className: 'checkbox-container'},
                        React.createElement('input',{type: 'checkbox', id: 'audio-check-'+key, className: 'box-check', 'data-mid': item.data.mid[0].value, defaultChecked: false, onChange: this.switch_operation_action.bind(this)}),
                        React.createElement('span', {className: 'checkmark'}),
                      )
                    ),
                    React.createElement('td', {className: 'media-data media-data-col-name'},
                      React.createElement("div", {id: key, className:"media-box"}, 
                        React.createElement('img', {id: 'myimg-'+key, src: item.data.field_media_image[0].image_style}, ''),
                        React.createElement('div', {className: 'overlay'},
                          React.createElement('button', {type: 'button', className: 'preview-icon', onClick: this.ShowPhotomodal.bind()}, '')
                        )
                      )
                    ),
                    React.createElement('td', {className: 'sorted media-data media-title'}, item.data.name[0].value, mkit_elem),
                    React.createElement('td', {className: 'media-data media-f-name'}, preset_name),
                    React.createElement('td', {className: 'audio-data text-center media-tags', style:{'display':'none'}}, tagsArr),
                    React.createElement('td', {className: 'media-data text-center media-format'}, app_extention),
                    React.createElement('td', {className: 'media-data text-center media-dimension'}, p_dimension),
                    React.createElement('td', {className: 'media-data text-right media-f-size'}, file_size),
                    React.createElement('td', {className: 'media-data media-fav text-center'},
                      React.createElement('ul', {},
                        React.createElement('li', {},
                          React.createElement('a', {href:'/tools/image-editor/'+item.data.mid[0].value+'?destination='+window.location.pathname+'#nav-photo', className: this.state.arc_del_class+' media-edit audio-round-button'}, ''),
                        ),
                        /* React.createElement('li', {},
                          React.createElement('a', {href:'/media/'+media_vault_id+'/'+item.data.mid[0].value+'/image/duplicate/preset', className: 'media-preset audio-round-button'}, ''),
                          //React.createElement('a', {href:'/media/'+item.data.mid[0].value+'/duplicate/preset', className: 'media-preset audio-round-button'}, ''),
                        ), */
                        React.createElement('li', {},
                          React.createElement('button', {type: 'button', className: 'media-favo round-button '+favorite_inactive, 'data-toggle':'tooltip', 'data-placement': 'right', 'title': 'Favorite', onmouseover: this.tooltipfn.bind(this), 'title': 'Favorite', onClick: this.handleFavoritePhoto.bind(null, item.data.mid[0].value, item.data.field_favorite[0].value, key)}, '')
                        ),
                        React.createElement('li', {},
                          React.createElement('a', {href:file_obj_url, download:'', className: 'media-download round-button', 'data-toggle':'tooltip', 'data-placement': 'right',  onmouseover: this.tooltipfn.bind(this), 'title': 'Download'}, ''), 
                        ),
                         React.createElement('li', null,
                          React.createElement('button', {type: 'button', className: 'share-link audio-round-button','data-toggle':'tooltip', 'data-placement': 'right','title': 'Share', onmouseover: this.tooltipfn.bind(this),onClick: this.ShowmodalConfPhoto.bind(null, this,item.data.mid[0].value,item.data.name[0].value)})
                         ),	
                        React.createElement('li', {},
                          React.createElement('button', {type: 'button', className: this.state.arc_icon_class+' audio-round-button', 'data-toggle': 'tooltip', 'data-placement': 'right', 'title': tooltip_arc_title, onmouseover: this.tooltipfn.bind(this), onClick: this.Showmodal.bind(null, item.data.bundle[0].target_id, item.data.mid[0].value, key)}, '')
                        ),
												React.createElement('li', null,
                          React.createElement('button', {type: 'button', className: 'delete-media audio-round-button', 'data-toggle': 'tooltip', 'data-placement': 'right', 'title': 'Delete', onmouseover: this.tooltipfn.bind(this), onClick: this.DeleteVault.bind(null, item.data.bundle[0].target_id, item.data.mid[0].value, item.data.name[0].value)}, '')
                        ),								
                      ),                      
                    ),
                  );
                }else if(media_archive){
                  archive_switch = '/tools/media/vault/'+a+window.location.hash;
                  archiveswitchid = 'archiveswitch';
                }else{
                  archive_switch = '/tools/media/archive/'+a+window.location.hash;
                  archiveswitchid = 'archiveswitch';
                }
								//jQuery('#media_photo_list_wrapper').find('.progress-overlay').remove();
              });
            }

            var table_head = React.createElement('thead',{},
              React.createElement('tr', null,
                React.createElement('th', null, ),
                React.createElement('th', null, ),
                React.createElement('th', {className: 'bg-sort asc-icon sortempty media-title', onClick: this.sortColumn.bind(this), style:{'width':'30%'}}, 'Title'),
                React.createElement('th', {className: 'sortempty media-f-name', onClick: this.sortColumn.bind(this), style:{'width':'10%'}}, 'Preset'),
                React.createElement('th', {className: 'sortempty media-tag', style:{'display':'none'}}, 'Tags'),
                React.createElement('th', {className: 'sortempty media-format', onClick: this.sortColumn.bind(this)}, 'Format'),
                React.createElement('th', {className: 'sortempty media-dimension', onClick: this.sortColumn.bind(this)}, 'Pixel Dimensions'),
                React.createElement('th', {className: 'sortempty media-f-size', onClick: this.sortColumn.bind(this)},  'File Size'),
                React.createElement('th', {className: 'media-action text-center media-fav'}, 'ACTIONS'),
              )
            );
            var table_body = React.createElement('tbody', {id: 'lightgallery'}, items);
            var table_data = React.createElement('table',{id: 'photo_vault', className: 'media-table w-100'},table_head, table_body);
            ReactDOM.render(
              React.createElement(SelectDownload, {box: '#media_photo_list_wrapper', fileType: 'photo', singlecheckPhoto: this.state.singlecheckPhoto, archiveswitchid: archiveswitchid, archive_switch: archive_switch, archive_text: archive_text, nmk: nmk}),document.querySelector("#photo-select-box-element-wrapper"));
            
            var updatediv = React.createElement('div', {className: 'd-none', id: 'photo-refresh', onClick: this.UpdateMethod.bind()}, 'refresh');
            
            return ( React.createElement("div", {id: 'media_photo_list_wrapper', className: 'row m-0 table-responsive'}, table_data, modalElement, /* captionForm, */ spinner_process, updatediv) );
          },
          ShowPhotomodal: function(e){
            var $lg = jQuery("[id^=lightgallery]");
            var gallery = $lg.lightGallery({
              width: '880px',
              height: '720px',
              addClass: 'fixed-size',
              counter: false,
              download: false,
              enableSwipe: false,
              enableDrag: false,
              share: false,
              autoplay: false,
              thumbMargin : 17,
              autoplayControls: false,
              fullScreen: false,
              zoom: false,
              actualSize: false,
              toogleThumb: false,
              thumbnail:true,           
              thumbWidth: 94,  
              thumbContHeight: 118,
              exThumbImage: 'data-exthumbimage',              
            });
            
            jQuery(e.target).trigger('click');

            gallery.on('onCloseAfter.lg',function(event, index, fromTouch, fromThumb){
              try{gallery.data('lightGallery').destroy(true);}catch(ex){};
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
					DeleteVault: function(fileType, mid, file_name){
						var th = this;
						let msg = React.createElement(AppDeleteMediaMsg, {base_url: media_base_url, mid: mid, fileType: fileType, file_name: file_name});
						th.setState({showModal: true});
						th.setState({mediaDeleteModal: true});
						th.setState({fileType: fileType});
						th.setState({mid: mid});
						th.setState({delete_modal_msg: msg});
					},
          handleDeleteVault: function(){
						var t = this;
						var type = t.state.fileType;
						if(type == 'text'){
							type = 'file';
						}
						var mid = t.state.mid;
						var reference_list = [];
						var lis = jQuery('#delete-vault-content li');
						lis.each(function(event){
							reference_list.push(jQuery(this).attr('data-entity'));
						});
						if(reference_list.length){
              var spinner = '<div class="progress-overlay delete-selected"><div class="km-loader"></div></div>';
              jQuery('#page').append(spinner);
							jQuery.ajax({
								url: '/media_vault/delete',
								data:{"mid": mid, "type": type, "reference_nids": reference_list, "uid": file_owner},
								type: "POST",
								success:function(data){
									if(data == 'done'){
										window.location.reload();
									}
								}
							});
						}
						t.setState({showModal: false});
						t.setState({mediaDeleteModal: false});
						t.setState({mid: ''});
						t.setState({delete_modal_msg: ''});
					},
          Showmodal: function(fileType, mid, row_id){
            var msg =React.createElement("div", null, "This action will remove this media file from your ", React.createElement("b", null, "Media Vault"), " and move it to your ", React.createElement("b", null, "Media Archive"), ". It will not be available for use while archived. You will be able to recover it later, if needed.");
            if(this.state.arc_status){
              msg = React.createElement('div', null, 'This action will restore this file to your Media Vault and any previously selected uses.');
            }
            this.setState({showModal: true});
            this.setState({fileType: fileType});
            this.setState({mid: mid});
            this.setState({row_id: row_id});
            this.setState({delete_modal_msg: msg});
          },
          handleHideModal: function(){
            this.setState({showModal: false});
					  this.setState({mediaDeleteModal: false});
            this.setState({mid: ''});
            this.setState({row_id: ''});
            this.setState({delete_modal_msg: ''});
          },
          forceUpdateHandler: function(){
            this.forceUpdate();
          },
          handleArchivePhoto: function(){
            var t = this;
            var delete_row = Number(this.state.row_id);
            axios.get(Drupal.url('rest/session/token'))
            .then(function (data) {
              var csrfToken = data.data;
              let headers = {'Content-Type': 'application/hal+json','Cache-Control': 'no-cache', 'X-CSRF-Token':csrfToken};
              var media_url_hal_json = t.state.base_url+'/media/'+t.state.mid+'/edit?_format=hal_json';
              var type_url = media_base_url_http + '/rest/type/media/image';
              var photo_hal_json_archive = {
                "_links": {
                  "type": {"href": type_url }
                },
                "field_archived": [
                  {
                    "value": Boolean(!media_archive)
                  }
                ]
              };
              axios.patch(media_url_hal_json, photo_hal_json_archive, { headers: headers })
              .then(function(result) {
                if(result.status == 200){
                  t.setState({spinner_status: true}); 
									window.location.reload();
                  //jQuery("#photo-refresh").trigger('click');
                }else{
                  alert('Error');
                }
              });
              jQuery('#modal').modal('hide');
              t.setState({showModal: false});
              t.setState({mid: ''});
              t.setState({row_id: ''});
              t.setState({delete_modal_msg: ''});
              //t.setState({ photos: this.state });
            });
          },
          handleFavoritePhoto: function(mid, field_favorite_value, row_id){
            this.setState({spinner_status: true});
            var t =this;
            var favorite_row = Number(row_id);
            axios.get(Drupal.url('rest/session/token'))
            .then(function (data) {
              var csrfToken = data.data;
              let headers = {'Content-Type': 'application/hal+json','Cache-Control': 'no-cache', 'X-CSRF-Token':csrfToken,};
              var media_url_hal_json = t.state.base_url+'/media/'+mid+'/edit?_format=hal_json';
              var type_url = media_base_url_http + '/rest/type/media/image';
              var image_hal_json_favorite = {
                "_links": {
                  "type": {"href": type_url }
                },
                "field_favorite": [
                  {
                    "value": Boolean(!field_favorite_value)
                  }
                ]
              };
              axios.patch(media_url_hal_json, image_hal_json_favorite, { headers: headers })
              .then(function(result) {
                if(result.status == 200){
                  //let new_list = t.state.photos;
                  //new_list[favorite_row].data.field_favorite[0].value = Boolean(!field_favorite_value);
                  //t.setState({photos: new_list});
                  //t.setState({spinner_status: false});
									window.location.reload();
                }else{
                  alert('Error');
                }
              });
              t.setState({mid: ''});
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
            
					  if(txt == 'File Size'){
							Array.from(table.querySelectorAll('tr.media-row')).sort(function(a, b) {
								var data = jQuery(a).children('td.media-f-size').text();
								var datab = jQuery(b).children('td.media-f-size').text();
								var num = th.retnum(data);
								var numb = th.retnum(datab);
								if(t.asc){
									if (num < numb) return -1;
									if (num > numb) return 1;
									if (num == numb) return -1;
								} else if(!t.asc){
									if (num > numb) return -1;
									if (num < numb) return 1;
									if (num == numb) return -1;
								} else{
									if (num > numb) return -1;
									if (num < numb) return 1;
									if (num == numb) return -1;
								}
								
							}).forEach(tr => table.appendChild(tr) );
						}
						
					  if(txt == 'Pixel Dimensions'){
							var pArray = [];
							Array.from(table.querySelectorAll('tr.media-row')).sort(function(a, b) {
								var data = jQuery(a).children('td.media-dimension').text();
								var datab = jQuery(b).children('td.media-dimension').text();
								data = data.split(' px x ');
								datab = datab.split(' px x ');

								var num = parseInt(data[0]);
								var numb = parseInt(datab[0]);
								if(t.asc){
									if (num > numb)
										return 1;
									if (num < numb)
										return -1;
									return 0;
								} else if(!t.asc){
									if (num < numb)
										return 1;
									if (num > numb)
										return -1;
									return 0;
								} else{
									if (num < numb)
										return 1;
									if (num > numb)
										return -1;
									return 0;
								}
							}).forEach(tr => table.appendChild(tr) );
						}
            //adding class to sorted column
            jQuery('#'+tableid+' td').removeClass('sorted');
            var table_id = jQuery(t.closest('table').parentNode).attr('id');
            var ind = jQuery(t).index() + 1;
            jQuery('#'+table_id+' td:nth-child('+ind+')').addClass('sorted');
          },
          switch_operation_action: function(e){
            console.log(e);
             console.log('third-1');
            console.log('selectedRows_photo1 '+selectedRows_photo);
            //this.setState({singlecheckPhoto: true});
            if (e.target.checked) {
              selectedRows_photo.push(+e.target.attributes.getNamedItem("data-mid").value);
               console.log('checked');
            } else {
              let index = selectedRows_photo.indexOf(+e.target.attributes.getNamedItem("data-mid").value);
              selectedRows_photo.splice(index, 1);
               console.log('unchecked');
            }
            console.log('selectedRows_photo '+selectedRows_photo);
            var data = jQuery(this.state.wrapperID+' .checkbox-container input[type="checkbox"]:checked').map(function() {
                        return e.target.value;
                      }).get();
            console.log('data '+data);          
            if(data == ''){
              jQuery('#photo-select-box-element-wrapper').addClass('options-disable');
            }
            else {
              jQuery('#photo-select-box-element-wrapper').removeClass('options-disable');
            }
          }
          });        
				
				function photoRender(){
					ReactDOM.render(
						React.createElement(AppPhoto, 'div',{className:'x2'}), document.querySelector("#nav-master-photo-detail"));					
				}
        
				
        //Text Detail
        var AppText = React.createClass({
          getInitialState: function() {
            return {
              texts: [],
              /* sorting: [], */
              showModal: false,
              singlecheckText: false,
              showTextModal: false,
              fileType: '',
              mid: '',
              textFileURL: '',
              base_url: media_base_url,
              row_id: '',
              delete_modal_msg: '',
              arc_icon_class: 'arc_'+media_archive,
              arc_del_class : 'del_'+media_archive,
              arc_status: media_archive,
              spinner_status: false,
							mediaDeleteModal: false,
              wrapperID: '#media_text_list_wrapper',
            }
          },
          componentDidMount: function() {
            var th = this;              
            this.serverRequest = 
              axios.get(this.props.source)
                .then(function(result) {    
                    return result.data.field_vault_file;
                })
                .then(function(response) {
									textLen = response.length;
									//if(response.length > 0 ){
										th.setState({spinner_status: true});
									//}
									//console.log(response);
                  return Promise.all(response.map( (record, index) => {
                    return axios.get(media_base_url+'/media/'+record.target_id+'/edit?_format=json');
                  }))
                })
                .then(function(responsex) {
                  th.setState({texts: responsex});
                });
						document.addEventListener('mouseover', th.tooltipfn.bind());
          },
          UpdateMethod: function() {
            //Force a render with a simulated state change
            var th = this;
              this.serverRequest = 
                axios.get(this.props.source)
                  .then(function(result) { 
                    return result.data.field_vault_file;                   
                  })
                  .then(function(response) {
										textLen = response.length;
										//if(response.length > 0 ){
											th.setState({spinner_status: true});
											processRunning = true;
										//}
                    return Promise.all(response.map( (record, index) => {
                      return axios.get(media_base_url+'/media/'+record.target_id+'/edit?_format=json');
                    }))
                  })
                  .then(function(responsex) {
                    th.setState({texts: responsex}); 
                    th.setState({spinner_status: false});
                    jQuery('#media_text_list_wrapper').find('.progress-overlay').remove(); 
										processRunning = false;
                  });            
          },
					tooltipfn: function(event){
						jQuery('[data-toggle="tooltip"]').tooltip({placement : 'right'});
					},
          render: function() {
						var text_list = this.state.texts;
						var check_non_archive = [];
						var check_archive = [];
						if(text_list.length){
							for(var i = 0, len = text_list.length; i < len;i++){
								if(text_list[i].data.field_archived[0].value === true){
									text_archive_blank_flag = true;
									check_archive.push(text_list[i].data.field_archived[0].value);
								} else {
									text_blank_flag = true;
									check_non_archive.push(text_list[i].data.field_archived[0].value);
								}
								if(check_archive.length == 0){
									text_archive_blank_flag = true;									
								} else if(check_non_archive.length == 0){
									text_blank_flag = true;					
								}
							}
						}

            var counter = 0;
            var archive_switch;
            var archiveswitchid;
            if(Boolean(media_archive)){
							var tooltip_arc_title = 'Restore';
              archive_text = 'Media Vault';
            }else{
							var tooltip_arc_title = 'Archive';
              archive_text = 'View Archive';
            }
            if (this.state.showTextModal) {
              var textReaderElement = React.createElement(textReader, {hideTextReaderModal: this.hideTextReaderModal, textFileURL: this.state.textFileURL});
            }
            if (this.state.showModal) {
              var modalElement = React.createElement(Modal, {handleHideModal: this.handleHideModal, handleArchive: this.handleArchiveText, fileType: this.state.fileType, mid:this.state.mid, base_url: media_base_url, delete_modal_msg: this.state.delete_modal_msg, arc_status: this.state.arc_status, mediaDeleteModal: false});
							if(this.state.mediaDeleteModal) {
								var modalElement = React.createElement(Modal, {handleHideModal: this.handleHideModal, handleArchive: this.handleDeleteVault, fileType: this.state.fileType, mid:this.state.mid, base_url: media_base_url, delete_modal_msg: this.state.delete_modal_msg, arc_status: this.state.arc_status, mediaDeleteModal: this.state.mediaDeleteModal});
							}
            }
            if(this.state.spinner_status){
              var spinner_process = React.createElement('div', {className:'progress-overlay'}, React.createElement('div', {className:'km-loader'}, null));
            }
            /* if(this.state.sorting.length == 0){
              this.state.texts.sort((a, b) => a.data.name[0].value.localeCompare(b.data.name[0].value));
            } */
						var items = '';
						if((textLen == 0 && textLen !== '' && media_archive == 1) || (check_archive.length == 0 && media_archive == 1 && text_archive_blank_flag == true)){
              var items = React.createElement('tr', {className: 'no-media-data text-center'},
                React.createElement('td', {className: 'media-data text-center', colSpan: "9"},
                  React.createElement('div', {className: 'no-media-data-message'},
                    React.createElement('span', {className: 'message'}, 'You currently have no archived text assets.'),
                  )
                ),
              );
							jQuery('#media_text_list_wrapper').find('.progress-overlay').remove();
							archive_switch = '/tools/media/vault/'+a+window.location.hash;
							archiveswitchid = 'archiveswitch';
            }
						else if((textLen == 0 && textLen !== '' && media_archive == 0) || ((check_non_archive.length == 0) && media_archive == 0 && text_blank_flag == true)){
              var items = React.createElement('tr', {className: 'no-media-data text-center'},
                React.createElement('td', {className: 'media-data text-center', colSpan: "9"},
                  React.createElement('div', {className: 'no-media-data-message'},
                    React.createElement('span', {className: 'message'}, 'You currently have no text assets.'),
                  )
                ),
              );
							jQuery('#media_text_list_wrapper').find('.progress-overlay').remove();
							processRunning = false;
							if(check_archive.length){
								archive_switch = '/tools/media/archive/'+a+window.location.hash;
                archiveswitchid = 'archiveswitch';            
							}
            }
            else {
							this.state.texts.sort((a, b) => a.data.name[0].value.localeCompare(b.data.name[0].value));
							items = this.state.texts.map((item, key) => {
								var paginate = false;
								if(key > paging_len){
									paginate = true;									
								}
								if(paginate){
									if(jQuery('#media_text_list_wrapper .box').length == 1){
										jQuery('#media_text_list_wrapper .box').remove();
									}
									var box = paginator({
										//table: document.getElementById('photo_vault'),
										rows_per_page : paging_len,
										box_mode : "list",
										get_rows: function () {
											return document.getElementById("text_vault").getElementsByTagName("tr");
										},
									});
									box.className = "box";
									document.getElementById('media_text_list_wrapper').appendChild(box);									
								}
                if(item.data.field_archived[0].value == Boolean(media_archive) && parseInt(item.data.uid[0].target_id) == currentUID){
                  counter += 1;
                  //for created Date
                  let current_datetime = new Date(item.data.created[0].value)
                  var h = current_datetime.getHours();
                  var meridian = 'AM';
                  if( h > 12){
                   h = h - 12 ;
                   meridian = 'PM';
                  }
                  var min = current_datetime.getMinutes();
                  if(min < 10){
                   min = '0'+min;
                  }
                  let formatted_date =  (current_datetime.getMonth() + 1) + "/" +current_datetime.getDate()+ "/" + current_datetime.getFullYear() +", "+ h + ":" + min+' '+meridian;
                  //for favorite
                  var favorite_inactive = 'inactive';
                  var favo = 'not favorite';
                  if(Boolean(item.data.field_favorite[0].value)){
                    favorite_inactive = 'active';
                    favo = 'favorite';
                  }
                  //for keyword
                  var keywords_values = ['-'];
                  var keyword_center = 'text-center';
                  var tags = [];
                  var tagsArr = '';
                  if(item.data.field_keywords.length){
                    keyword_center = '';
                    var keywords = item.data.field_keywords.map((kitem, kkey) => {
                      keywords_values[kkey] = React.createElement(AppTaxo, {base_url: media_base_url, srate: kitem.url});
                      tags.push(kitem.name);
                      tagsArr = tags.toString();
                    });
                  }
                  
                  var file_obj_url = '';
                  var file_obj_target_id = '';
                  console.log('length '+item.data.field_media_file.length);
                  console.log('Value :', item.data);
                  if(item.data.field_media_file.length && item.data.field_media_file[0].target_id != ''){
                    //file_obj_url = item.data.field_media_file[0].original_url;
                    file_obj_url = item.data.field_media_file[0].download_url;
                    file_obj_target_id = item.data.field_media_file[0].target_id;
                  }

                  //File ext type
                  let app_extention = '-';
									if(item.data.field_media_file.length && item.data.field_media_file[0].target_id != ''){
                    var ext = (item.data.field_format.length > 0) ? item.data.field_format[0].value : '';
										ext = ext.substring(ext.lastIndexOf(".") + 1, ext.length);
										app_extention = ext;
										//var fid = (item.data.field_media_file.length > 0) ? item.data.field_media_file[0].target_id : '';
                    //app_extention = React.createElement(AppExtention, {base_url: media_base_url, ext:ext, fid:fid, get_type_col: true});
                  }
                  
                  //File size
                  var file_size = '-';
                  if((item.data.field_file_size).length > 0 && item.data.field_media_file.length && item.data.field_media_file[0].target_id != ''){
                    file_size = item.data.field_file_size[0].value;
                  } /* else {
                    if(item.data.field_media_file.length && item.data.field_media_file[0].target_id != ''){
											var fid = (item.data.field_media_file.length > 0) ? item.data.field_media_file[0].target_id : '';
                      file_size = React.createElement(AppFileSize, {base_url: media_base_url, fid: fid});
                    } 
                  }   */
                  let mkit_elem = React.createElement(AppMediaKits, {base_url: media_base_url, mid: item.data.mid[0].value, fileType: 'text'});
                  
                  return React.createElement('tr', {'data-favo': favo, 'data-id': key, 'data-mtype': item.data.bundle[0].target_id, 'data-nid': media_vault_id, 'data-mid': item.data.mid[0].value, id: 'item-text-'+key,className:'media-row'},
                    React.createElement('td', {className: 'media-data text-center'},
                      //React.createElement('span', {className: 'move-icon'}),
                      React.createElement('label', {className: 'checkbox-container'},
                        React.createElement('input',{type: 'checkbox', id: 'audio-check-'+key, className: 'box-check', 'data-fid': file_obj_target_id, 'data-mid': item.data.mid[0].value, defaultChecked: false, onChange: this.switch_operation_action.bind()}),
                        React.createElement('span', {className: 'checkmark'}),
                      )
                    ),
                    React.createElement('td', {className: 'media-data media-data-col-name'},
                      React.createElement("div", {id: key, className:"media-box text-box"}, 
                        React.createElement('button', {type: 'button', className: 'text-read-button', onClick: this.showTextModal.bind(null, file_obj_url)}, ''),
                      )
                    ),
                    React.createElement('td', {className: 'sorted media-data media-title'}, item.data.name[0].value, mkit_elem),
                    React.createElement('td', {className: 'media-data media-f-name'}, ''),
                    React.createElement('td', {className: 'media-data text-center media-tags', style: {'display': 'none'}}, tagsArr),
                    React.createElement('td', {className: 'media-data text-center media-format'}, app_extention),
                    React.createElement('td', {className: 'media-data text-right media-f-size'}, file_size),
                    React.createElement('td', {className: 'media-data media-fav text-center'},
                      React.createElement('ul', {},
                        React.createElement('li', {},
                          React.createElement('a', {href:'/tools/media/'+item.data.mid[0].value, className: this.state.arc_del_class+' media-edit audio-round-button', 'data-toggle':'tooltip', 'data-placement': 'right',  onmouseover: this.tooltipfn.bind(this), 'title': 'Edit'}, ''),
                        ),
                        /* React.createElement('li', {},
                          React.createElement('a', {href:'/media/add/dupe', className: 'media-preset audio-round-button'}, ''),
                        ), */
                        React.createElement('li', {},
                          React.createElement('button', {type: 'button', className: 'media-favo round-button '+favorite_inactive, 'data-toggle':'tooltip', 'data-placement': 'right', 'title': 'Favorite', onmouseover: this.tooltipfn.bind(this), 'title': 'Favorite', onClick: this.handleFavoriteText.bind(null, item.data.mid[0].value, item.data.field_favorite[0].value, key)}, '')
                        ),
                        React.createElement('li', {},
                          React.createElement('a', {href:file_obj_url, download:'', className: 'media-download round-button', 'data-toggle':'tooltip', 'data-placement': 'right',  onmouseover: this.tooltipfn.bind(this), 'title': 'Download'}, ''), 
                        ),
                        React.createElement('li', null,
                          React.createElement('button', {type: 'button', className: 'share-link audio-round-button','data-toggle':'tooltip', 'data-placement': 'right','title': 'Share', onmouseover: this.tooltipfn.bind(this), onClick: this.ShowmodalConfDoc.bind(null, this,item.data.mid[0].value,item.data.name[0].value)})
                         ),
                        React.createElement('li', {},
                          React.createElement('button', {type: 'button', className: this.state.arc_icon_class+' audio-round-button', 'data-toggle': 'tooltip', 'data-placement': 'right', 'title': tooltip_arc_title, onmouseover: this.tooltipfn.bind(this), onClick: this.Showmodal.bind(null, item.data.bundle[0].target_id, item.data.mid[0].value, key)}, '')
                        ),
												React.createElement('li', null,
                          React.createElement('button', {type: 'button', className: 'delete-media audio-round-button', 'data-toggle': 'tooltip', 'data-placement': 'right', 'title': 'Delete', onmouseover: this.tooltipfn.bind(this), onClick: this.DeleteVault.bind(null, item.data.bundle[0].target_id, item.data.mid[0].value, item.data.name[0].value)}, '')
                        ),
                      )
                    ),
                  )
                }else if(media_archive){
                  archive_switch = '/tools/media/vault/'+a+window.location.hash;
                  archiveswitchid = 'archiveswitch'; 
                }else{
                  archive_switch = '/tools/media/archive/'+a+window.location.hash;
                  archiveswitchid = 'archiveswitch';  
                }
								//jQuery('#media_text_list_wrapper').find('.progress-overlay').remove();                    
              });
            }
            var table_head = React.createElement('thead',{},
              React.createElement('tr', null,
                React.createElement('th', null, ),
                React.createElement('th', null, ),
                React.createElement('th', {className: 'bg-sort asc-icon sortempty media-title', onClick: this.sortColumn.bind(this), style:{'width':'30%'}}, 'Title'),
                React.createElement('th', {className: 'sortempty media-f-name', onClick: this.sortColumn.bind(this), style:{'width':'10%'}}, 'Preset'),
								React.createElement('th', {className: 'sortempty media-tag', style:{'display':'none'}}, 'Tags'),
                React.createElement('th', {className: 'sortempty media-format', onClick: this.sortColumn.bind(this)}, 'Format'),
                React.createElement('th', {className: 'sortempty media-f-size', onClick: this.sortColumn.bind(this)}, 'File Size'),
                React.createElement('th', {className: 'media-action text-center media-fav'}, 'ACTIONS'),
              )
            );
            var table_body = React.createElement('tbody', null, items);
            var table_data = React.createElement('table',{id: 'text_vault', className: 'media-table w-100'},table_head, table_body);
            ReactDOM.render(
              React.createElement(SelectDownload, {box: '#media_text_list_wrapper', fileType: 'text', singlecheckText: this.state.singlecheckText, archiveswitchid: archiveswitchid, archive_switch: archive_switch, archive_text: archive_text, nmk: nmk}),document.querySelector("#text-select-box-element-wrapper"));
            
            var updatediv = React.createElement('div', {className: 'd-none', id: 'text-refresh', onClick: this.UpdateMethod.bind()}, 'refresh');
            return ( React.createElement("div", {id: 'media_text_list_wrapper', className: 'row m-0 table-responsive'}, table_data, modalElement, /* captionForm, */ spinner_process, textReaderElement, updatediv) );
          },
					DeleteVault: function(fileType, mid, file_name){
						var th = this;
						let msg = React.createElement(AppDeleteMediaMsg, {base_url: media_base_url, mid: mid, fileType: fileType, file_name: file_name});
						th.setState({showModal: true});
						th.setState({mediaDeleteModal: true});
						th.setState({fileType: fileType});
						th.setState({mid: mid});
						th.setState({delete_modal_msg: msg});
					},
          handleDeleteVault: function(){
						var t = this;
						var type = t.state.fileType;
						if(type == 'text'){
							type = 'file';
						}
						var mid = t.state.mid;
						var reference_list = [];
						var lis = jQuery('#delete-vault-content li');
						lis.each(function(event){
							reference_list.push(jQuery(this).attr('data-entity'));
						});
						if(reference_list.length){
              var spinner = '<div class="progress-overlay delete-selected"><div class="km-loader"></div></div>';
              jQuery('#page').append(spinner);
							jQuery.ajax({
								url: '/media_vault/delete',
								data:{"mid": mid, "type": type, "reference_nids": reference_list, "uid": file_owner},
								type: "POST",
								success:function(data){
									if(data == 'done'){
										window.location.reload();
									}
								}
							});
						}
						t.setState({showModal: false});
						t.setState({mediaDeleteModal: false});
						t.setState({mid: ''});
						t.setState({delete_modal_msg: ''});
					},
          ShowmodalConfDoc: function(finename,filesize){
             console.log('second popup doc');
             console.log('second popup audio2',finename);
             console.log('second popup audio2',filesize);
             //get url
             var type = 'doc';
             get_update_url(filesize,type);
          },
          Showmodal: function(fileType, mid, row_id){
            var msg =React.createElement("div", null, "This action will remove this media file from your ", React.createElement("b", null, "Media Vault"), " and move it to your ", React.createElement("b", null, "Media Archive"), ". It will not be available for use while archived. You will be able to recover it later, if needed.");
            if(this.state.arc_status){
             msg = React.createElement('div', null, 'This action will restore this file to your Media Vault and any previously selected uses.');
            }
            this.setState({showModal: true});
            this.setState({fileType: fileType});
            this.setState({mid: mid});
            this.setState({row_id: row_id});
            this.setState({delete_modal_msg: msg});
          },
          handleHideModal: function(){
            this.setState({showModal: false});
						this.setState({mediaDeleteModal: false});
            this.setState({mid: ''});
            this.setState({row_id: ''});
            this.setState({delete_modal_msg: ''});
          },
          handleArchiveText: function(){
            var t = this;
            var delete_row = Number(this.state.row_id);
            axios.get(Drupal.url('rest/session/token'))
            .then(function (data) {
              var csrfToken = data.data;
              let headers = {'Content-Type': 'application/hal+json','Cache-Control': 'no-cache', 'X-CSRF-Token':csrfToken};
              var media_url_hal_json = t.state.base_url+'/media/'+t.state.mid+'/edit?_format=hal_json';
              var type_url = media_base_url_http + '/rest/type/media/text';
              var media_hal_json_archive = {
                "_links": {
                  "type": {"href": type_url }
                },
                "field_archived": [
                  {
                    "value": Boolean(!media_archive)
                  }
                ]
              };
              axios.patch(media_url_hal_json, media_hal_json_archive, { headers: headers })
              .then(function(result) {
                if(result.status == 200){
                  t.setState({spinner_status: true}); 
									window.location.reload();
                  //jQuery("#text-refresh").trigger('click');
                }else{
                  alert('Error');
                }
              });
              jQuery('#modal').modal('hide');
              t.setState({showModal: false});
              t.setState({mid: ''});
              t.setState({row_id: ''});
              t.setState({delete_modal_msg: ''});
            });
          },
          handleFavoriteText: function(mid, field_favorite_value, row_id){
            this.setState({spinner_status: true});
            var t =this;
            var favorite_row = Number(row_id);
            axios.get(Drupal.url('rest/session/token'))
            .then(function (data) {
              var csrfToken = data.data;
              let headers = {'Content-Type': 'application/hal+json','Cache-Control': 'no-cache', 'X-CSRF-Token':csrfToken,};
              var media_url_hal_json = t.state.base_url+'/media/'+mid+'/edit?_format=hal_json';
              var type_url = media_base_url_http + '/rest/type/media/text';
              var image_hal_json_favorite = {
                "_links": {
                  "type": {"href": type_url }
                },
                "field_favorite": [
                  {
                    "value": Boolean(!field_favorite_value)
                  }
                ]
              };
              axios.patch(media_url_hal_json, image_hal_json_favorite, { headers: headers })
              .then(function(result) {
                if(result.status == 200){
                  //let new_list = t.state.texts;
                  //new_list[favorite_row].data.field_favorite[0].value = Boolean(!field_favorite_value);
                  //t.setState({texts: new_list});
                  //t.setState({spinner_status: false});
									window.location.reload();
                }else{
                  alert('Error');
                }
              });
              t.setState({mid: ''});
            });
          },
          showTextModal: function(fileURL){
            this.setState({showTextModal: true});
            this.setState({textFileURL: fileURL });
          },
          hideTextReaderModal: function(){
            this.setState({showTextModal: false});
            this.setState({textFileURL: '' });
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
             
						if(txt == 'File Size'){
							Array.from(table.querySelectorAll('tr.media-row')).sort(function sort(a, b) {
								var data = jQuery(a).children('td.media-f-size').text();
								var datab = jQuery(b).children('td.media-f-size').text();
								var num = th.retnum(data);
								var numb = th.retnum(datab);
								if(t.asc){
									if (num < numb) return -1;
									if (num > numb) return 1;
									if (num == numb) return -1;
								} else if(!t.asc){
									if (num > numb) return -1;
									if (num < numb) return 1;
									if (num == numb) return -1;
								} else{
									if (num > numb) return -1;
									if (num < numb) return 1;
									if (num == numb) return -1;
								}
								
							}).forEach(tr => table.appendChild(tr) );
						}
						 
            //adding class to sorted column
            jQuery('#'+tableid+' td').removeClass('sorted');
            var table_id = jQuery(t.closest('table').parentNode).attr('id');
            var ind = jQuery(t).index() + 1;
            jQuery('#'+table_id+' td:nth-child('+ind+')').addClass('sorted');
          },
          switch_operation_action: function(e){ //add e due undefined
           // this.setState({singlecheckText: true});
            if (e.target.checked) {
              console.log('first-1');
              selectedRows_text.push(+e.target.attributes.getNamedItem("data-mid").value);
            } else {
               console.log('first-2');
              let index = selectedRows_text.indexOf(+e.target.attributes.getNamedItem("data-mid").value);
              selectedRows_text.splice(index, 1);
            }
            var data = jQuery(this.state.wrapperID+' .checkbox-container input[type="checkbox"]:checked').map(function() {
                        return e.target.value;
                      }).get();
            if(data == ''){
              jQuery('#text-select-box-element-wrapper').addClass('options-disable');
              console.log('first-3');
            }
            else {
              console.log('first-5');
              jQuery('#text-select-box-element-wrapper').removeClass('options-disable');
            }
           } 
        });          
				
				function textRender(){
					ReactDOM.render(
						React.createElement(AppText, {source: url, pollInterval: 10000}), document.querySelector("#nav-master-text-detail"));
				}

        //Video Detail
        var AppVideo = React.createClass({
          getInitialState: function() {
            return {
              video: [],
              /* sorting: [], */
              cty: [],
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
              row_id: '',
              delete_modal_msg: '',
              arc_icon_class: 'arc_'+media_archive,
              arc_del_class: 'del_'+media_archive,
              arc_status: media_archive,
              spinner_status: false,
							mediaDeleteModal: false,
              wrapperID: '#media_video_list_wrapper',
            }
          },
          componentDidMount: function() {
            var th = this;
            this.serverRequest = 
              axios.get(this.props.source)
                .then(function(result) {    
                    return result.data.field_vault_video;
                })
                .then(function(vresponse) {
					//console.log(vresponse);
					//console.log(vresponse);
					videoLen = vresponse.length;
					/* if(vresponse.length > 0 ){
						var counter = 0;
						var archive_counter = 0;
						for(var i= 0; i< vresponse.length; i++){
							if(vresponse[i].is_archive == 0){
								counter += 1;
							} else if(vresponse[i].is_archive == 1){
								archive_counter += 1;												
							}
						}
						videoLen = counter;
						archive_videoLen = archive_counter;
						if((videoLen > 0 && !Boolean(media_archive)) || (archive_videoLen > 0 && Boolean(media_archive))){
							th.setState({spinner_status: true});
						}
						//th.setState({spinner_status: true});
					} else {
						videoLen = vresponse.length;
						archive_videoLen = vresponse.length;
					} */
					th.setState({spinner_status: true});
                    return Promise.all(vresponse.map( (vrecord, index) => {
                    return axios.get(media_base_url+'/media/'+vrecord.target_id+'/edit?_format=json');
                  }))
                })
                .then(function(vresponsex) {
                  th.setState({video: vresponsex});
				 //th.setState({spinner_status: false});
                });
				document.addEventListener('mouseover', th.tooltipfn.bind());
          },         
          UpdateMethod: function() {
            //Force a render with a simulated state change
			console.log('calling video uploadMethod');
            var th = this;
              this.serverRequest = 
                axios.get(this.props.source)
                  .then(function(result) { 
                    return result.data.field_vault_video;                   
                  })
                  .then(function(response) {
						videoLen = response.length;
						//if(response.length > 0 ){
							th.setState({spinner_status: true});
							processRunning = true;
						//}
                        return Promise.all(response.map( (record, index) => {
                        return axios.get(media_base_url+'/media/'+record.target_id+'/edit?_format=json');
                    }))
                  })
                  .then(function(responsex) {                 
                    th.setState({video: responsex});
                    th.setState({spinner_status: false});
                    jQuery('#media_video_list_wrapper').find('.progress-overlay').remove();
						processRunning = false;
                  });            
          },
          render: function() {
				var video_list = this.state.video;
				var check_non_archive = [];
				var check_archive = [];
				if(video_list.length){
					for(var i = 0, len = video_list.length; i < len;i++){
						if(video_list[i].data.field_archived[0].value === true){
							video_archive_blank_flag = true;
							check_archive.push(video_list[i].data.field_archived[0].value);
						} else {
							video_blank_flag = true;
							check_non_archive.push(video_list[i].data.field_archived[0].value);
						}
						if(check_archive.length == 0){
							video_archive_blank_flag = true;									
						} else if(check_non_archive.length == 0){
							video_blank_flag = true;					
						}
					}
				}
            var univ = [];
            var counter = 0;
            var archive_switch;
            var archiveswitchid;
            if(Boolean(media_archive)){
							var tooltip_arc_title = 'Restore';
              archive_text = 'Media Vault';
            }else{
							var tooltip_arc_title = 'Archive';
              archive_text = 'View Archive';
            }
            if (this.state.showModal) {
              var modalElement = React.createElement(Modal, {handleHideModal: this.handleHideModal, handleArchive: this.handleArchiveVideo, fileType: this.state.fileType, mid:this.state.mid, base_url: media_base_url, delete_modal_msg: this.state.delete_modal_msg, arc_status: this.state.arc_status, mediaDeleteModal: false});
							if(this.state.mediaDeleteModal) {
								var modalElement = React.createElement(Modal, {handleHideModal: this.handleHideModal, handleArchive: this.handleDeleteVault, fileType: this.state.fileType, mid:this.state.mid, base_url: media_base_url, delete_modal_msg: this.state.delete_modal_msg, arc_status: this.state.arc_status, mediaDeleteModal: this.state.mediaDeleteModal});
							}
            }
            if(this.state.spinner_status){
              var spinner_process = React.createElement('div', {className:'progress-overlay'}, React.createElement('div', {className:'km-loader'}, null));
            }
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
            /* if(this.state.sorting.length == 0){
              this.state.video.sort((a, b) => a.data.name[0].value.localeCompare(b.data.name[0].value));
            } */
						var items = '';
						if((videoLen == 0 && videoLen !== '' && media_archive == 1) || (check_archive.length == 0 && media_archive == 1 && video_archive_blank_flag == true)){
              var items = React.createElement('tr', {className: 'no-media-data text-center'},
                React.createElement('td', {className: 'media-data text-center', colSpan: "9"},
                  React.createElement('div', {className: 'no-media-data-message'},
                    React.createElement('span', {className: 'message'}, 'You currently have no archived video assets.'),
                  )
                ),
              );
							jQuery('#media_video_list_wrapper').find('.progress-overlay').remove();
							archive_switch = '/tools/media/vault/'+a+window.location.hash;
							archiveswitchid = 'archiveswitch';
            }
						else if((videoLen == 0 && videoLen !== '' && media_archive == 0) || ((check_non_archive.length == 0) && media_archive == 0 && video_blank_flag == true)){
              var items = React.createElement('tr', {className: 'no-media-data text-center'},
                React.createElement('td', {className: 'media-data text-center', colSpan: "9"},
                  React.createElement('div', {className: 'no-media-data-message'},
                    React.createElement('span', {className: 'message'}, 'You currently have no video assets.'),
                  )
                ),
              );
							jQuery('#media_video_list_wrapper').find('.progress-overlay').remove();
							processRunning = false;
							if(check_archive.length){
								archive_switch = '/tools/media/archive/'+a+window.location.hash;
                archiveswitchid = 'archiveswitch';            
							}
            }
            else {
							this.state.video.sort((a, b) => a.data.name[0].value.localeCompare(b.data.name[0].value));
							items = this.state.video.map((item, key) => {
								var paginate = false;									
								if(key > paging_len){
									paginate = true;									
								}
								if(paginate){
									if(jQuery('#media_video_list_wrapper .box').length == 1){
										jQuery('#media_video_list_wrapper .box').remove();
									}
									var box = paginator({
										//table: document.getElementById('photo_vault'),
										rows_per_page : paging_len,
										box_mode : "list",
										get_rows: function () {
											return document.getElementById("video_vault").getElementsByTagName("tr");
										},
									});
									box.className = "box";
									document.getElementById('media_video_list_wrapper').appendChild(box);									
								}
                if(item.data.field_archived[0].value == Boolean(media_archive) && parseInt(item.data.uid[0].target_id) == currentUID){
                  counter += 1;                 
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

                  //for favorite
                  var favorite_inactive = 'inactive';
                  var favo = 'not favorite';
                  if(Boolean(item.data.field_favorite[0].value)){
                    favorite_inactive = 'active';
                    favo = 'favorite';
                  }
                  //for keyword
                  var keywords_values = ['-'];
                  var keyword_center = 'text-center';
                  var tags = [];
                  var tagsArr = '';
                  if(item.data.field_keywords.length){
                    keyword_center = '';
					//console.log(item.data.field_keywords);
                    var keywords = item.data.field_keywords.map((kitem, kkey) => {
                      keywords_values[kkey] = React.createElement(AppTaxo, {base_url: media_base_url, srate: kitem.url});
                      tags.push(kitem.name);
                      tagsArr = tags.toString();
                    });
                  }
                  //let video_time = React.createElement(Videovm, {key: key});
                  //File type
									let app_extention = '-';
									if(item.data.field_media_video_file.length && item.data.field_media_video_file[0].target_id != ''){
                    var ext = (item.data.field_format.length > 0) ? item.data.field_format[0].value : '';
										ext = ext.substring(ext.lastIndexOf(".") + 1, ext.length);
										app_extention = ext;
										//var fid = (item.data.field_media_video_file.length > 0) ? item.data.field_media_video_file[0].target_id : '';
                    //app_extention = React.createElement(AppExtention, {base_url: media_base_url, ext:ext, fid:fid, get_type_col: false});
                  }
                  //File size
                  var file_size = '-';
                  if((item.data.field_file_size).length > 0 && item.data.field_media_video_file.length && item.data.field_media_video_file[0].target_id != ''){
                    file_size = item.data.field_file_size[0].value;
                  } /* else {
                    if(item.data.field_media_video_file.length && item.data.field_media_video_file[0].target_id != ''){
                      file_size = React.createElement(AppFileSize, {key: key, base_url: media_base_url, fid: item.data.field_media_video_file[0].target_id});
                    } 
                  }*/
				  // preset
                   var preset_name = '';
				 /*  if((item.data.field_made_from_preset).length > 0){
					   if(item.data.field_made_from_preset[0].url){
						 var url_preset = media_base_url+'/'+item.data.field_made_from_preset[0].url+'?_format=json'	
                         preset_name = getPresetName(url_preset); 
					   }
                  }
				  // source type
				   if((item.data.field_media_source_type).length > 0){
					   //console.log('source type not generaed');
					    if(item.data.field_media_source_type[0].value == 'uploaded' || item.data.field_media_source_type[0].value == 'Upload Modified' ){
							preset_name = 'Uploaded file';
						}
				   } */
				   	var preset_values = '';
				   if(item.data.field_made_from_preset.length){
                      preset_name = React.createElement(PresetTaxo, {base_url: media_base_url, srate: item.  data.field_made_from_preset[0].url});
					  console.log(preset_name);
                  }
				   // source type
				   if((item.data.field_media_source_type).length > 0){
					    if(item.data.field_media_source_type[0].value == 'uploaded' || item.data.field_media_source_type[0].value == 'Upload Modified' ){
							preset_name = 'Uploaded file';
						}
				   } 
                  //Video duration
                  if((item.data.field_duration).length > 0){
                    var video_time = item.data.field_duration[0].value;
                  } else {
                    var video_time = '-';//React.createElement(AudioTime, {audioURL: item.data.field_media_audio_file[0].url}); 
                  } 
                  if(item.data.field_media_video_file.length && item.data.field_media_video_file[0].is_thumbnail){
                    //var video_thumb = React.createElement("video", {id: 'video-'+key}, React.createElement('source', {src:file_obj_original_url, className: 'd-none'},''),
                    /*  if(item.data.field_video_thumbnail.length == 0){
                      console.log('noff thumb');
                     var video_thumb = React.createElement('img', {src:'/modules/custom/media_vault_tool/img/video.png'}, ''); 
                      }else{
                               var video_thumb = React.createElement('img', {src:file_obj_image_style}, '');
                    } */
                    var video_thumb = React.createElement('img', {src:file_obj_image_style}, '');
                  } else {
                    var video_thumb = React.createElement("video", {id: 'video-'+key}, React.createElement('source', {src:file_obj_original_url},''));
                  }
                  console.log('i am executing');
                  let mkit_elem = React.createElement(AppMediaKits, {base_url: media_base_url, mid: item.data.mid[0].value, fileType: 'video'});
                  //render pending
                  var render_status = 'Pending';
                  if((item.data.field_render_status).length > 0) {
                    var render_status = item.data.field_render_status[0].value;
                    if(render_status == 'Pending') {
                      var renderText    = "Pending render";
                      var disableClass  = 'custom-disable';
                      mkit_elem = renderText;						
                    }else if(render_status == 'Failed'){
                      var renderText    = "Render failed";
                      var disableClass  = "";
                    }else{
                      var renderText    = ""; 
                      var disableClass  = "";  
                    }
                  }
                  
                  return React.createElement('tr', {'data-favo': favo, 'data-id': key, 'data-mtype': item.data.bundle[0].target_id, 'data-nid': media_vault_id, 'data-mid': item.data.mid[0].value, id: 'item-video-'+key,className:'media-row '+ disableClass},
                    React.createElement('td', {className: 'media-data text-center'},
                      //React.createElement('span', {className: 'move-icon'}),
                      React.createElement('label', {className: 'checkbox-container'},
                        React.createElement('input',{type: 'checkbox', id: 'audio-check-'+key, className: 'box-check', 'data-mid': item.data.mid[0].value, defaultChecked: false, onChange: this.switch_operation_action.bind()}),
                        React.createElement('span', {className: 'checkmark'}),
                      )
                    ),
                    React.createElement('td', {className: 'media-data media-data-col-name'},
                      React.createElement("div", {id: key, className:"media-box"}, 
                        video_thumb,
                        React.createElement('div', {className: 'overlay'},
                          React.createElement('button', {type: 'button', className: 'video-play round-button', onClick: this.ShowVideoPlayer2.bind(null, file_obj_original_url, +key, +rowLen), style:{'display':'none'}}, ''),
						 // React.createElement('button', {type: 'button', className: 'video-play round-button', style:{'display':'none'}}, ''),
                        )
                      )
                    ),
                    React.createElement('td', {className: 'sorted media-data media-title'}, item.data.name[0].value, mkit_elem),
                    React.createElement('td', {className: 'media-data media-f-name'}, preset_name),
                    React.createElement('td', {className: 'media-data text-center media-tags', style: {'display': 'none'}}, tagsArr),
                    React.createElement('td', {className: 'media-data text-center media-format'}, app_extention),
                    React.createElement('td', {className: 'media-data text-center media-duration'}, video_time),
                    React.createElement('td', {className: 'media-data text-right media-f-size'}, file_size),
                    React.createElement('td', {className: 'media-data media-fav text-center'},
                      React.createElement('ul', {className: disableClass},
					   React.createElement('li', {},
                          React.createElement('a', {href:'/tools/video-editor/'+item.data.mid[0].value+'?destination='+window.location.pathname+'#nav-video', className: this.state.arc_del_class+' media-edit audio-round-button'}, ''),
                        ),
                      /*  React.createElement('li', {},
                          React.createElement('a', {href:'/tools/media/'+item.data.mid[0].value, className: 'media-edit audio-round-button', 'data-toggle':'tooltip', 'data-placement': 'right',  onmouseover: this.tooltipfn.bind(this), title: 'Edit'}, ''),
                        ), */
                        React.createElement('li', {},
                          React.createElement('button', {type: 'button', className: 'media-favo round-button '+favorite_inactive, 'data-toggle':'tooltip', 'data-placement': 'right', 'title': 'Favorite', onmouseover: this.tooltipfn.bind(this), title: 'Favorite', onClick: this.handleFavoriteVideo.bind(null, item.data.mid[0].value, item.data.field_favorite[0].value, key)}, '')
                        ),
                        React.createElement('li', {},
                          React.createElement('a', {href:file_obj_original_url, download:'', className: 'media-download round-button', 'data-toggle':'tooltip', 'data-placement': 'right',  onmouseover: this.tooltipfn.bind(this), title: 'Download'}, ''), 
                        ),
                         React.createElement('li', null,
                          React.createElement('button', {type: 'button', className: 'share-link audio-round-button','data-toggle':'tooltip', 'data-placement': 'right','title': 'Share', onmouseover: this.tooltipfn.bind(this), onClick: this.ShowmodalConfVideo.bind(null, this,item.data.mid[0].value,item.data.name[0].value)})
                         ),
                        React.createElement('li', {},
                          React.createElement('button', {type: 'button', className: this.state.arc_icon_class+' audio-round-button', 'data-toggle': 'tooltip', 'data-placement': 'right', 'title': tooltip_arc_title, onmouseover: this.tooltipfn.bind(this), onClick: this.Showmodal.bind(null, item.data.bundle[0].target_id, item.data.mid[0].value, key)}, '')
                        ),
												React.createElement('li', null,
                          React.createElement('button', {type: 'button', className: 'delete-media audio-round-button', 'data-toggle': 'tooltip', 'data-placement': 'right', 'title': 'Delete', onmouseover: this.tooltipfn.bind(this), onClick: this.DeleteVault.bind(null, item.data.bundle[0].target_id, item.data.mid[0].value, item.data.name[0].value)}, '')
                        ),
                      )
                    ),
                  )
                }else if(media_archive){
                  archive_switch = '/tools/media/vault/'+a+window.location.hash;
                  archiveswitchid = 'archiveswitch';
                }else{
                  archive_switch = '/tools/media/archive/'+a+window.location.hash;
                  archiveswitchid = 'archiveswitch';
                }
								//jQuery('#media_video_list_wrapper').find('.progress-overlay').remove();
              });
            }
            var table_head = React.createElement('thead',{},
              React.createElement('tr', null,
                React.createElement('th', null, ),
                React.createElement('th', null, ),
                React.createElement('th', {className: 'bg-sort asc-icon sortempty media-title', onClick: this.sortColumn.bind(this), style:{'width':'30%'}}, 'Title'),
                React.createElement('th', {className: 'sortempty media-f-name', onClick: this.sortColumn.bind(this), style:{'width':'10%'}}, 'Preset'),
                React.createElement('th', {className: 'sortempty media-tag', style:{'display':'none'}}, 'Tags'),
                React.createElement('th', {className: 'sortempty media-format', onClick: this.sortColumn.bind(this)}, 'Format'),
                React.createElement('th', {className: 'sortempty media-duration', onClick: this.sortColumn.bind(this)}, 'Duration'),
                React.createElement('th', {className: 'sortempty media-f-size', onClick: this.sortColumn.bind(this)}, 'File Size'),
                React.createElement('th', {className: 'media-action text-center media-fav'}, 'ACTIONS'),
              )
            );
            var table_body = React.createElement('tbody', null, items);
            var table_data = React.createElement('table',{id: 'video_vault', className: 'media-table w-100'},table_head, table_body);
            ReactDOM.render(
              React.createElement(SelectDownload, {box: '#media_video_list_wrapper', fileType: 'video', singlecheckVideo: this.state.singlecheckVideo, archiveswitchid: archiveswitchid, archive_switch: archive_switch, archive_text: archive_text, nmk: nmk}),document.querySelector("#video-select-box-element-wrapper"));
            var updatediv = React.createElement('div', {className: 'd-none', id: 'video-refresh', onClick: this.UpdateMethod.bind()}, 'refresh');
		//	var updatediv = React.createElement('div', {className: 'd-none', id: 'video-refresh'}, 'refresh');
            return ( React.createElement("div", {id: 'media_video_list_wrapper', className: 'row m-0 table-responsive'}, table_data, modalElement, videoPlayerElement, spinner_process, updatediv) );
          },
          tooltipfn: function(event){
						jQuery('[data-toggle="tooltip"]').tooltip({placement : 'right'});
					},
					DeleteVault: function(fileType, mid, file_name){
						var th = this;
						let msg = React.createElement(AppDeleteMediaMsg, {base_url: media_base_url, mid: mid, fileType: fileType, file_name: file_name});
						th.setState({showModal: true});
						th.setState({mediaDeleteModal: true});
						th.setState({fileType: fileType});
						th.setState({mid: mid});
						th.setState({delete_modal_msg: msg});
					},
          handleDeleteVault: function(){
						var t = this;
						var type = t.state.fileType;
						if(type == 'text'){
							type = 'file';
						}
						var mid = t.state.mid;
						var reference_list = [];
						var lis = jQuery('#delete-vault-content li');
						lis.each(function(event){
							reference_list.push(jQuery(this).attr('data-entity'));
						});
						if(reference_list.length){
              var spinner = '<div class="progress-overlay delete-selected"><div class="km-loader"></div></div>';
              jQuery('#page').append(spinner);
							jQuery.ajax({
								url: '/media_vault/delete',
								data:{"mid": mid, "type": type, "reference_nids": reference_list, "uid": file_owner},
								type: "POST",
								success:function(data){
									if(data == 'done'){
										window.location.reload();
									}
								}
							});
						}
						t.setState({showModal: false});
						t.setState({mediaDeleteModal: false});
						t.setState({mid: ''});
						t.setState({delete_modal_msg: ''});
					},
          Showmodal: function(fileType, mid, row_id){
            var msg =React.createElement("div", null, "This action will remove this media file from your ", React.createElement("b", null, "Media Vault"), " and move it to your ", React.createElement("b", null, "Media Archive"), ". It will not be available for use while archived. You will be able to recover it later, if needed.");
            if(this.state.arc_status){
             msg = React.createElement('div', null, 'This action will restore this file to your Media Vault and any previously selected uses.');
            }
            this.setState({showModal: true});
            this.setState({fileType: fileType});
            this.setState({mid: mid});
            this.setState({row_id: row_id});
            this.setState({delete_modal_msg: msg});
          },
          handleHideModal: function(){
            this.setState({showModal: false});
						this.setState({mediaDeleteModal: false});
            this.setState({mid: ''});
            this.setState({row_id: ''});
            this.setState({delete_modal_msg: ''});
          },
           ShowmodalConfVideo: function(finename,filesize){
             console.log('second popup video');
             //get url
             var type = 'video';
             get_update_url(filesize,type);
          
          },
          handleArchiveVideo: function(){
            var t = this;
            var delete_row = Number(this.state.row_id);
            axios.get(Drupal.url('rest/session/token'))
            .then(function (data) {
              var csrfToken = data.data;
              let headers = {'Content-Type': 'application/hal+json','Cache-Control': 'no-cache', 'X-CSRF-Token':csrfToken};
              var media_url_hal_json = t.state.base_url+'/media/'+t.state.mid+'/edit?_format=hal_json';
              var type_url = media_base_url_http + '/rest/type/media/video';
              var media_hal_json_archive = {
                "_links": {
                  "type": {"href": type_url }
                },
                "field_archived": [
                  {
                    "value": Boolean(!media_archive)
                  }
                ]
              };
              axios.patch(media_url_hal_json, media_hal_json_archive, { headers: headers })
              .then(function(result) {
                if(result.status == 200){
                  t.setState({spinner_status: true});
									window.location.reload();
                  //jQuery("#video-refresh").trigger('click');
                }else{
                  alert('Error');
                }
              });
              jQuery('#modal').modal('hide');
              t.setState({showModal: false});
              t.setState({mid: ''});
              t.setState({row_id: ''});
              t.setState({delete_modal_msg: ''});
            });
          },
          handleFavoriteVideo: function(mid, field_favorite_value, row_id){
            this.setState({spinner_status: true});
            var t =this;
            var favorite_row = Number(row_id);
            axios.get(Drupal.url('rest/session/token'))
            .then(function (data) {
              var csrfToken = data.data;
              let headers = {'Content-Type': 'application/hal+json','Cache-Control': 'no-cache', 'X-CSRF-Token':csrfToken,};
              var media_url_hal_json = t.state.base_url+'/media/'+mid+'/edit?_format=hal_json';
              var type_url = media_base_url_http + '/rest/type/media/video';
              var image_hal_json_favorite = {
                "_links": {
                  "type": {"href": type_url }
                },
                "field_favorite": [
                  {
                    "value": Boolean(!field_favorite_value)
                  }
                ]
              };
              axios.patch(media_url_hal_json, image_hal_json_favorite, { headers: headers })
              .then(function(result) {
                if(result.status == 200){
                  //let new_list = t.state.video;
                  //new_list[favorite_row].data.field_favorite[0].value = Boolean(!field_favorite_value);
                  //t.setState({video: new_list});
                  //t.setState({spinner_status: false});
					window.location.reload();
                }else{
                  alert('Error');
                }
              });
              t.setState({mid: ''});
            });
          },
          ShowVideoPlayer2: function(fileURL, trackID, rowLen){
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
            
						if(txt == 'File Size'){
							Array.from(table.querySelectorAll('tr.media-row')).sort(function sort(a, b) {
								var data = jQuery(a).children('td.media-f-size').text();
								var datab = jQuery(b).children('td.media-f-size').text();
								var num = th.retnum(data);
								var numb = th.retnum(datab);
								if(t.asc){
									if (num < numb) return -1;
									if (num > numb) return 1;
									if (num == numb) return -1;
								} else if(!t.asc){
									if (num > numb) return -1;
									if (num < numb) return 1;
									if (num == numb) return -1;
								} else{
									if (num > numb) return -1;
									if (num < numb) return 1;
									if (num == numb) return -1;
								}
								
							}).forEach(tr => table.appendChild(tr) );
						}
						
            //adding class to sorted column
            jQuery('#'+tableid+' td').removeClass('sorted');
            var table_id = jQuery(t.closest('table').parentNode).attr('id');
            var ind = jQuery(t).index() + 1;
            jQuery('#'+table_id+' td:nth-child('+ind+')').addClass('sorted');
          },
          switch_operation_action: function(e){
           // this.setState({singlecheckVideo: true});
            console.log('five-test');
            if (e.target.checked) {
              selectedRows_video.push(+e.target.attributes.getNamedItem("data-mid").value);
            } else {
              let index = selectedRows_video.indexOf(+e.target.attributes.getNamedItem("data-mid").value);
              selectedRows_video.splice(index, 1);
            }
            var data = jQuery(this.state.wrapperID+' .checkbox-container input[type="checkbox"]:checked').map(function() {
                        return e.target.value;
                      }).get();
            if(data == ''){
              jQuery('#video-select-box-element-wrapper').addClass('options-disable');
            }
            else {
              jQuery('#video-select-box-element-wrapper').removeClass('options-disable');
            }
           }        
        });
				
				function videoRender(){
					ReactDOM.render(
						React.createElement(AppVideo, {source: url, pollInterval: 10000}), document.querySelector("#nav-master-video-detail"));
				}
				
				function removeLoader(filetype){
					if(jQuery('#'+filetype+'_vault tbody tr').length && jQuery('#media_'+filetype+'_list_wrapper .progress-overlay').length && processRunning == false){
						jQuery('#media_'+filetype+'_list_wrapper').find('.progress-overlay').remove();
						if(window.pageYOffset > 0){
							window.scrollTo(0, 0);
						} else {
							window.scrollTo(0, 0);
						}
					}
					if(jQuery("[role=log].ui-helper-hidden-accessible").length){
						jQuery("[role=log].ui-helper-hidden-accessible").remove();
					}					
				}
				
				function paginateClick(){
					var filetype = window.location.hash;
					if(filetype == ''){
						filetype = 'audio';
					}
					if(filetype.indexOf('-') > 0){
					filetype = filetype.split('-')[1];
					}
					var paginate = false;
					removeLoader(filetype);

					//console.log('timer - '+new Date().toLocaleTimeString());
					if(jQuery('#media_'+filetype+'_list_wrapper .box').length == 1 && jQuery('#media_'+filetype+'_list_wrapper .box li').length == 3){
						paginate = true;
					}	
          if(media_archive == 1){
            paginate = false;
          }
					if(paginate){		
            console.log('onsettimeout');          
						jQuery('#media_'+filetype+'_list_wrapper .box').remove();
						var box = paginator({
							rows_per_page : paging_len,
							box_mode : "list",
							get_rows: function () {
								return document.getElementById(filetype+'_vault').getElementsByTagName("tr");
							},
						});
						box.className = "box";
						document.getElementById('media_'+filetype+'_list_wrapper').appendChild(box);	
						if(window.pageYOffset > 0){
							window.scrollTo(0, 0);
						} else {
							window.scrollTo(0, 0);
						}
					}
				}
				
				function defaultTabRender(){
					if(window.location.hash == '' || window.location.hash == '#nav-audio'){
						audioRender();							
					}
				}			
				
				//default tab render when page load if hashkey not set
				defaultTabRender();				

        //archive/media vault link with active tab on window load
        var currentURL = window.location.href; 
        var activeTabarr = currentURL.split('#');
				var p_click = 0;
				var a_click = 0;
				var t_click = 0;
				var v_click = 0;
        if(activeTabarr[1]){
          window.location.hash = activeTabarr[1];          
        }
        //archive/media vault link with active tab on tab switch
        jQuery(".nav .nav-item").on("shown.bs.tab", function(e) {
          console.log('apploding');
          var hashid = jQuery(e.target).attr("href").substr(1);
					//jQuery(".nav .nav-item.active").removeClass('active');
					//jQuery('.nav .nav-item[href='+hashid+']').addClass('active');
          window.location.hash = hashid;
					if(window.location.hash == '#nav-photo'){
						//render tab content only first time when switch in tab
						p_click = p_click + 1;
						if(p_click == 1){
							photoRender();
             // removeLoader('photo');
						}
					} else if(window.location.hash == '#nav-text'){
						t_click = t_click + 1;
						if(t_click == 1){
							textRender();
                            
						}
					} else if(window.location.hash == '#nav-video'){
						v_click = v_click + 1;
						if(v_click == 1){
							videoRender();
						}
					} else {
						a_click = a_click + 1;
						if(p_click == 1){
							audioRender();						
						}
					}
					//add switched tab id on upload link
					var upload_link = '/tools/media/vault/'+a+'/upload'+window.location.hash;
          jQuery('#uploader-link').attr('href', upload_link);
					
          jQuery('#archiveswitch a').each(function(){
            if(media_archive){
              var archive_switch = '/tools/media/vault/'+a+window.location.hash;
            }else{
              var archive_switch = '/tools/media/archive/'+a+window.location.hash;
            }                        
            jQuery(this).attr('href', archive_switch);
          });
					if(window.pageYOffset > 0){
						window.scrollTo(0, 0);
					} else {
						window.scrollTo(0, 0);
					}
        });

				window.onload = function() { 
					loadFlag = true;
					if(window.pageYOffset > 0){
						window.scrollTo(0, 0);
					} else {
						window.scrollTo(0, 0);
					}
				}
        setInterval(paginateClick, 3000);
				
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
