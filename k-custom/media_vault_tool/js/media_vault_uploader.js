(function ($, Drupal, drupalSettings) {
  var initialized;
  Drupal.behaviors.MediaBehavior = {
    attach: function (context, settings) {
      if (!initialized) {
        initialized = true;
        var media_vault_id = drupalSettings.media.mediaJS.media_vault_id;
        var media_base_url = drupalSettings.media_base_url;
        var media_base_url_http = drupalSettings.media_base_url_http;
        var media_archive = drupalSettings.media_archive;
        var uid = drupalSettings.uid;
        var file_owner = drupalSettings.file_owner;       
        var total_storage = drupalSettings.total_storage;
        var allocated_storage_space = drupalSettings.allocated_storage_space;
        var available_space = drupalSettings.available_space;
        var audio_storage = drupalSettings.audio_storage;
        var image_storage = drupalSettings.image_storage;
        var text_storage = drupalSettings.text_storage;
        var video_storage = drupalSettings.video_storage;        
        var audio_maxsize = drupalSettings.audio_maxsize;        
        var image_maxsize = drupalSettings.image_maxsize;        
        var text_maxsize = drupalSettings.text_maxsize;        
        var video_maxsize = drupalSettings.video_maxsize;        
        var url = media_base_url+"/node/"+media_vault_id+"?_format=json"; 
				var focusFlag = true;
				
				//Confirmation Modal 
        let Modal = React.createClass({
          componentDidMount: function() {
              jQuery(this.getDOMNode()).modal('show');
              jQuery(this.getDOMNode()).on('hidden.bs.modal', this.props.handleHideModal);
          },
          render: function() {
            var btnCancel = '';
            var title_msg = '';
            var button_text = 'OK';
            if(this.props.fileTifsmatch){
							var btnCancel = React.createElement('button', {type: 'button', className: 'btn btn-default', onClick:this.props.handleCancle},'Cancel');
              title_msg = '';
              button_text = 'OK';
            }
            return (
                React.createElement('div', {id: 'modal', className: 'modal fade'},
                  React.createElement('div', {className: 'modal-dialog'},
                    React.createElement('div', {className: 'modal-content'},
                      React.createElement('div', {className: 'modal-header'},
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
	
        //Custom file uploader component
        var FileUploader = React.createClass({
          getInitialState: function() {
            return {
              dragmsg: '',
              delete_modal_msg: '',
              filesizeError: false,
              filemismatch: false,
              fileTifsmatch: false,
              filemismatch_modal_status: false,
              file_conversion_modal_status: false,
              removeUnsupportedFiles: false,
              proceedWithConversion: false,
              filetoconvert: '',
              DS_modal_msg: '',
              base_url: media_base_url,
              arc_status: media_archive,
              uploaded_files: '',
              uploaded_files_size: '',
              uploaderstate: '',
              queuedFiles: [],
              up: '',
            }
          },
          componentDidMount: function(){
            var th = this;						
            // Apply plupload
            var total_file_size = 0;
            var err_fType = '';
            var ft = th.props.fileType;
            var ex = th.props.extensions;	
						var tabname = ft;
						var u_files = [];
						if(ft == 'image'){
							tabname = 'photo';
						}					
            var uploader = new plupload.Uploader({
              runtimes : 'html5,flash,silverlight,html4',
              browse_button : 'pickfiles_'+th.props.fileType, // you can pass an id...
              drop_element : 'media-upload-list_'+th.props.fileType,
              url : '/mvt-handle-uploads/'+th.props.fileType+'/'+media_vault_id+'/'+file_owner,
              unique_names : true,
              dragdrop: true,
              flash_swf_url : '../js/Moxie.swf',
              silverlight_xap_url : '../js/Moxie.xap',
              
              filters : {
                mime_types: [
                  {title : "Media files", extensions : ex}
                ]
              },
              // PreInit events, bound before any internal events
              preinit : {
                Init: function(up, info) {
                  //console.log(up);
                  //console.log(info);
                },

								UploadFile: function(up, file) {
									//console.log(file);									
                  // You can override settings before the file is uploaded
                  // up.setOption('url', 'upload.php?id=' + file.id);
                  //up.setOption('multipart_params', {param1 : body});
                }
              },
              init: {
                PostInit: function() {
									document.getElementById('uploadfiles_'+ft).onclick = function() {
                    if (!jQuery(this).hasClass('plupload_disabled')) {
											var file_name = '';
											var file_extension = '';
											th.state.queuedFiles.map((file, key) => {
												//console.log(file);
												file_name = file.name;
												file_extension = file_name.substring(file_name.lastIndexOf(".") + 1, file_name.length);
												if(file.type == 'image/tiff' && (file_extension == 'tif' || file_extension == 'tiff')){
													th.setState({fileTifsmatch: true});
													th.ShowFileConversionModal(file, uploader);									
												}
											});
                    }
										if(th.state.fileTifsmatch == false){
											uploader.start();
										} else {
											return false;
										}
                  };
                  if (!uploader.files.length) {
                    jQuery('#uploadfiles_'+ft).addClass('plupload_disabled');
                    jQuery('#uploadfiles_'+ft).attr('disabled', 'disabled');
                    jQuery('#mv-done-'+ft).addClass('disabled');
                    jQuery('#mv-cancle-'+ft).removeClass('disabled');
                  }
                },
                Refresh: function(up) {
                  // Called when the position or dimensions of the picker change
                  //console.log(up);              
                },
                QueueChanged: function(up) {
                  jQuery('#media-upload-list_'+ft).addClass('queued');
                  document.getElementsByClassName('media_total_file_size_'+ft)[0].innerHTML = plupload.formatSize(uploader.total.size).toUpperCase();
                  jQuery('#media-container-'+ft+' span.plupload_upload_status').html(plupload.sprintf(('%d files queued'), uploader.total.queued));
                },                               
                StateChanged: function(up) {
                  //uploader.disableBrowse(true);
                },
                FilesAdded: function(up, files) {
                  //console.log(uploader.files);
                  if (uploader.files.length) {
                    jQuery('#uploadfiles_'+ft).removeClass('plupload_disabled');
										jQuery('#uploadfiles_'+ft).removeAttr('disabled');
										th.setState({queuedFiles: files});
                  }
                  plupload.each(files, function(file) {
										var formatedsize = plupload.formatSize(file.size).toUpperCase();
                    document.getElementById('media-upload-list_'+ft).innerHTML += '<li id="' + file.id + '" class=""><div class="plupload_file_name"><span>' + file.name + '</span></div><div class="plupload_file_action"><button type="button"></button></div><div class="plupload_file_status text-center">0%</div><div class="plupload_file_size text-center">' + formatedsize + '</div><div class="plupload_clearer">&nbsp;</div></li>';
                    th.handleStatus(file); 
                    //console.log(file);
                  });
                  jQuery('#media-upload-list_'+ft+' li.plupload_delete').each(function(i){
                    jQuery(this).children('.plupload_file_action').children('button').click(function(e){
                      e.preventDefault(); 
                      var current_file_id = jQuery(this).parent('.plupload_file_action').parent('.plupload_delete').attr('id');
                      jQuery('#'+current_file_id).remove();                   
                      for( var i = 0; i < uploader.files.length; i++){ 
                        if ( uploader.files[i].id === current_file_id) {
                          uploader.removeFile(uploader.files[i]);
                        }
                      }                      
                    });
                  }); 
                  if (uploader.total.queued !== 0) {
                    jQuery('#media-container-'+ft+' span.plupload_upload_status').css('display', 'block');
                  }
                },
                FilesRemoved: function(up, files) {
                  // Called when files are removed from queue 
                  if (uploader.total.queued === 0) {
                    jQuery('#media-container-'+ft+' span.plupload_upload_status').css('display', 'none');
                  }                    
                  var scrollTop = jQuery('#media-upload-list_'+ft).scrollTop();
                  jQuery('#media-upload-list_'+ft).scrollTop(scrollTop);
                  jQuery('#media-container-'+ft+' span.plupload_upload_status').html(plupload.sprintf(('%d files queued'), uploader.total.queued));
                },
                UploadProgress: function(up, file) {
                  th.handleStatus(file);
                  document.getElementById(file.id).getElementsByClassName('plupload_file_status')[0].innerHTML = file.percent+'%';
                  //upload progress
                  jQuery('.total_status_'+ft).html(uploader.total.percent + '%');
                  jQuery('#media-container-'+ft+' div.plupload_progress').css('display', 'block');
                  jQuery('#media-container-'+ft+' div.plupload_progress_bar').css('width', uploader.total.percent + '%');
                  jQuery('#media-container-'+ft+' span.plupload_upload_status').css('display', 'block');
                  jQuery('#media-container-'+ft+' span.plupload_upload_status').html(plupload.sprintf(('Uploaded %d/%d files'), uploader.total.uploaded, uploader.files.length));
                },
                FileUploaded: function(up, file, info) {
                  // Called when file has finished uploading
									var json_data = info.response;
									var obj = JSON.parse(json_data);
									u_files.push(obj);
                  th.handleStatus(file);									
                },
                UploadComplete: function(up, files) {	
                  // Called when all files are either uploaded or failed
									th.setState({uploaded_files: u_files});	
									var formatedsize = plupload.formatSize(uploader.total.size).toUpperCase();
									th.setState({uploaded_files_size: formatedsize});
									setTimeout(function() {
										jQuery('#media-upload-list_'+ft+' li').remove();
										jQuery('#media-upload-list_'+ft).removeClass('queued');
										document.getElementById('media-upload-list_'+ft).innerHTML += '<li class="media_droptext"><span><span style="font-size:14px;">'+th.props.upload_msg+'</span><br>'+th.props.supported_formats+'<br>'+th.props.maximum_size+'</span></li>';
										jQuery('.media_filelist_footer .plupload_upload_status').html('');
										jQuery('.media_filelist_footer .media_total_file_size_'+ft).html('0 B');
										jQuery('.media_filelist_footer .total_status_'+ft).html('0%');
										jQuery('#media-container-'+ft+' div.plupload_progress').css('display', 'none');
										jQuery('#media-container-'+ft+' div.plupload_progress_bar').css('width', '0%');
										jQuery('#uploadfiles_'+ft).addClass('plupload_disabled');
										jQuery('#uploadfiles_'+ft).attr('disabled', 'disabled');								
                    jQuery('#mv-done-'+ft).removeClass('disabled');
                    jQuery('#mv-cancle-'+ft).addClass('disabled');
									}, 2000);	
                  //window.location.reload();
                },
                Error: function(up, err) {
                  var file = err.file, message;
                  if (file) {
                    message = err.message;
                    if (err.details) {
                      message += " (" + err.details + ")";
                    }
                    if (err.code == plupload.FILE_SIZE_ERROR) {
                      th.setState({filemismatch: true});
                      th.setState({filesizeError: true});
                      th.ShowFilesmismatchModal(file.name);
                    }
                    if (err.code == plupload.FILE_EXTENSION_ERROR) { 
                      th.setState({filemismatch: true});
											if(file.type !== ''){
												var type = (file.type).split('/');
												if (type) {
													var extype = type[0];
												}
												if(extype == 'image') {
													err_fType = 'Photo';
												}
												if (extype == 'audio') {
													err_fType = 'Audio';
												}
												if (extype == 'application') {
													err_fType = 'Text';
												}
												if (extype == 'video') {
													err_fType = 'Video';
												}
											} else {
												var fname = file.name;
												var extype = fname.substring(fname.lastIndexOf(".") + 1, fname.length);
												//console.log(extype);
												if(extype == 'heic' || extype == 'heif'){
													err_fType = 'Photo';
												}
											}
											th.setState({filemismatch: true});
                      th.ShowFilesmismatchModal(err_fType);
                    }
                    file.hint = message;
                    jQuery('#media-upload-list_'+ft+' #'+file.id).attr('class', 'plupload_failed').find('a').css('display', 'block').attr('title', message);
                  }

                  if (err.code === plupload.INIT_ERROR) {
                    setTimeout(function() {
                      uploader.destroy();
                      uploader = null;
                    }, 1);
                  }                 
                }
              }
            }); 
						uploader.refresh();
						uploader.init();
						//uploader.destroy();
          },
					handleStatus: function(file) {
            var ft = this.props.fileType;
            var actionClass;
            if (file.status == plupload.DONE) {
              actionClass = 'plupload_done';
            }
            if (file.status == plupload.FAILED) {
              actionClass = 'plupload_failed';
            }
            if (file.status == plupload.QUEUED) {
              actionClass = 'plupload_delete';
            }
            if (file.status == plupload.UPLOADING) {
              actionClass = 'plupload_uploading';
            }
            var icon = jQuery('#media-upload-list_'+ft+' #'+file.id).attr('class', actionClass).find('a').css('display', 'block');
            if (file.hint) {
              icon.attr('title', file.hint);
            }
          },
					ShowFilesmismatchModal: function(err_fType){
            //var msg = React.createElement("div", {className: 'text-center', style: {'padding': '1rem 0'}}, 'The selected file type "'+err_fType+'" may not be uploaded to this tab.');
            var msg = React.createElement("div", {className: 'text-center', style: {'padding': '1rem 0'}}, 'Please note the "Acceptable file types" listed in the upload box. Only files of these types can be uploaded.');
            if(this.state.filesizeError){
              var msg = React.createElement("div", {className: 'text-center', style: {'padding': '1rem 0'}}, "Size of the file - ", React.createElement("b", null, err_fType), " is too large.");
            }
            this.setState({filemismatch_modal_status: true});
            this.setState({DS_modal_msg: msg});
          },                                        
          fcloseModal : function(){
            jQuery('#modal').modal('hide');
            this.setState({filemismatch_modal_status: false});
            this.setState({DS_modal_msg: ''});
            this.setState({filemismatch: false});
            this.setState({filesizeError: false});
          },	
          ShowFileConversionModal: function(file, uploader){
            var msg = React.createElement("div", {className: 'text-center', style: {'padding': '1rem 0'}}, 'Please note that any TIFF images will be converted to PNG format for maximum compatibility.');
            this.setState({file_conversion_modal_status: true});
            this.setState({filetoconvert: file});
            this.setState({up: uploader});
            this.setState({DS_modal_msg: msg});
          }, 
					fcloseConversionModal : function(){
						var th = this;
						var ft = th.props.fileType;
            th.setState({removeUnsupportedFiles: true});
						var file = th.state.filetoconvert;
						var up = th.state.up;
						jQuery('#media-upload-list_'+ft+' li#'+file.id+' .plupload_file_action > button').trigger('click');
						th.state.queuedFiles;
						const index = th.state.queuedFiles.indexOf(file);
						if (index > -1) {
							th.state.queuedFiles.splice(index, 1);
						}
						//console.log(th.state.queuedFiles);
						up.refresh();
						//console.log('length - '+up.files.length);
						if(up.files.length == 0){
							setTimeout(function() {
								jQuery('#media-upload-list_'+ft).removeClass('queued');
								//document.getElementById('media-upload-list_'+ft).innerHTML += '<li class="media_droptext"><span><span style="font-size:14px;">'+th.props.upload_msg+'</span><br>'+th.props.supported_formats+'<br>'+th.props.maximum_size+'</span></li>';
								jQuery('.media_filelist_footer .plupload_upload_status').html('');
								jQuery('.media_filelist_footer .media_total_file_size_'+ft).html('0 B');
								jQuery('.media_filelist_footer .total_status_'+ft).html('0%');
								jQuery('#media-container-'+ft+' div.plupload_progress').css('display', 'none');
								jQuery('#media-container-'+ft+' div.plupload_progress_bar').css('width', '0%');
								jQuery('#uploadfiles_'+ft).addClass('plupload_disabled');
								jQuery('#uploadfiles_'+ft).attr('disabled', 'disabled');								
								jQuery('#mv-done-'+ft).removeClass('disabled');
								jQuery('#mv-cancle-'+ft).addClass('disabled');
							}, 500);
						}
            jQuery('#modal').modal('hide');
            th.setState({file_conversion_modal_status: false});
            th.setState({DS_modal_msg: ''});
            th.setState({fileTifsmatch: false});
						th.setState({removeUnsupportedFiles: false});											
          },
					processConversion : function(){
            this.setState({proceedWithConversion: true});
						var file = this.state.filetoconvert;						
						var up = this.state.up;
						//console.log(up);
						up.start();
						jQuery('#modal').modal('hide');
            //this.setState({removeUnsupportedFiles: true});
            this.setState({file_conversion_modal_status: false});
            this.setState({DS_modal_msg: ''});
            this.setState({fileTifsmatch: false});
          },					
          render: function() {
						var uploaded_files = this.state.uploaded_files;
						var uploaded_files_size = this.state.uploaded_files_size;
						var ft = this.props.fileType;
						var status_items_top = '';
						var status_items_bottom = [];
						var storage = audio_storage;
						var tabname = ft;
						if(ft == 'image'){
							tabname = 'photo';
							storage = image_storage;
						} else if(ft == 'text'){
							storage = text_storage;						
						} else if(ft == 'video'){
							storage = video_storage;						
						}									
						var storage_text = total_storage+' used of '+allocated_storage_space+' | '+available_space+' available';
						var status_list = React.createElement('div', {className: 'media_statuslist', style: {'font-size': '14px'}}, 'Your uploaded files will be confirmed here. You may make title changes and add tags, if desired, before clicking "Done."');
						if(uploaded_files.length > 0){
							if(uploaded_files.length == 1){
								var f = 'file';
							} else {
								var f = 'files';
							}
							status_items_top = React.createElement('div', {className: 'd-flex justify-content-between pb-4'}, React.createElement('div', null, "You have successfully uploaded: "),
								React.createElement('div', null, '  '+uploaded_files.length+ ' '+f+' | '+uploaded_files_size),
								React.createElement('div', null, 'Instructions: Change titles and enter tags as desired.'),
							);
							var i;
							for (i = 0; i < uploaded_files.length; i++) {
								//uploaded_files[i].id
								focusFlag = true;
								status_items_bottom.push(React.createElement(AppStatusRows, {fid: uploaded_files[i].fid, media_id: uploaded_files[i].media_id, media_name: uploaded_files[i].media_name, file_name: uploaded_files[i].file_name, fileType: ft, tabname: tabname}));
							}
							
							status_list = React.createElement('div', {className: 'media_statuslist'}, status_items_top, status_items_bottom);
						}
						var status_box = React.createElement('div', {className: 'status-box mb-20'}, 
							React.createElement('div', {className:'status-heading d-flex justify-content-between'},	
								React.createElement('div', null, "Media Vault Status"), 
								React.createElement('div', {id: 'space-status'}, storage_text),
							),
							status_list,
						);
            if (this.state.filemismatch_modal_status) {
              var filemismatchModalElement = React.createElement(Modal, {handleArchive: this.fcloseModal, fileType: ft, filemismatch: this.state.filemismatch, base_url:this.state.base_url, delete_modal_msg: this.state.DS_modal_msg, arc_status: this.state.arc_status});
            }
						if (this.state.file_conversion_modal_status) {
              var fileconversionModalElement = React.createElement(Modal, {handleCancle: this.fcloseConversionModal, handleArchive: this.processConversion, fileType: ft, fileTifsmatch: this.state.fileTifsmatch, base_url:this.state.base_url, delete_modal_msg: this.state.DS_modal_msg, arc_status: this.state.arc_status});
            }

            return React.createElement('div', {className: 'w-100 d-flex justify-content-between'}, React.createElement('div', {id:'media-uploader-box-'+tabname, className: 'w-33'}, 
							React.createElement('div', {className:'media-box-wrapper'},
								React.createElement('div', {id: 'media-container-'+ft, className: 'media-container'},
									React.createElement('div', {className: 'media-header'},
										React.createElement('div', {className: 'file_name'}, 'Filename'),
										React.createElement('div', {className: 'file_action'}, null),
										React.createElement('div', {className: 'file_status text-center'},
											React.createElement('span', null, 'Status')
											),
										React.createElement('div', {className: 'file_size text-center'},
											React.createElement('span', null, 'Size')
										),
										React.createElement('div', {className:'plupload_clearer'})
									),
									React.createElement('ul', {id:'media-upload-list_'+this.props.fileType, className: 'media_filelist'},
										React.createElement('li', {className: 'media_droptext'}, this.props.dragmsg)
									),
									React.createElement('div', {className: 'media_filelist_footer'}, 
										React.createElement('div', {className: 'file_name'},
											React.createElement('div', {className: 'file_add_buttons'},
												React.createElement('a', {id:'pickfiles_'+this.props.fileType, className:'button_add_file'}, 'Add files')
											),
											React.createElement('span', {className: 'plupload_upload_status'})
										),
										React.createElement('div', {className: 'file_action'}, null),
										React.createElement('div', {className: 'file_status text-center'}, React.createElement('span', {className: 'total_status_'+this.props.fileType}, '0%')
										),
										React.createElement('div', {className: 'file_size text-center'},
											React.createElement('span', {className: 'media_total_file_size_'+this.props.fileType}, '0 B')
										),
										React.createElement('div', {className: 'plupload_progress'},
											React.createElement('div', {className: 'plupload_progress_container'}, React.createElement('div', {className: 'plupload_progress_bar'}, null)
											)
										),
										React.createElement('div', {className:'plupload_clearer'})
									)
								),								
								React.createElement('button', {type: 'submit', id:'uploadfiles_'+this.props.fileType, className:'upload-save-button btn btn-primary'}, 'Upload'),
								React.createElement('a', {href: '/tools/media/vault/'+uid+'#nav-'+tabname, id:'mv-cancle-'+this.props.fileType, className:'upload-cancle-button ml-3 btn btn-cancel'}, 'Cancel'),
								filemismatchModalElement,
								fileconversionModalElement,
								//updatediv,
								),
							),
							React.createElement('div', {id:'media-'+tabname+'-status-box', className: 'media-vault-status w-65'}, 
								status_box,
								React.createElement('a', {href: '/tools/media/vault/'+uid+'#nav-'+tabname, id:'mv-done-'+this.props.fileType, className:'upload-save-button btn btn-primary float-right'}, 'Done'),
							),
						);
          }          
        });

				//Audio Detail
        var AppAudio = React.createClass({
          getInitialState: function() {
            return {
							fileType: '',
            }
          },
          render: function() {  
						var audiomsg = React.createElement("span", null, "Drag audio files here to upload.", React.createElement("br", null, "Acceptable file types: aiff, mp3, wav"), React.createElement("span", null, 'Maximum file size: '+audio_maxsize));
						var upload_msg = "Drag audio files here to upload.";
						var supported_formats = "Acceptable file types: aiff, mp3, wav";
						var maximum_size = 'Maximum file size: '+audio_maxsize;
            return ( React.createElement(FileUploader,{dragmsg: audiomsg, upload_msg: upload_msg, supported_formats: supported_formats, maximum_size: maximum_size, fileType:'audio', extensions : 'aiff,mp3,wav'}) );
          }        
        });

        React.render(
          React.createElement(AppAudio, {source: url}), document.querySelector("#media-top-box-audio")); 
					
				//Photo Detail
        var AppPhoto = React.createClass({
          getInitialState: function() {
            return {
							fileType: '',
            }
          },
          render: function() {  
						var photomsg = React.createElement("span", null, "Drag photos here to upload.", React.createElement("br", null, "Acceptable file types: jpg, jpeg, png, tif, tiff"), React.createElement("span", null, 'Maximum file size: '+image_maxsize));
						var upload_msg = "Drag photos here to upload.";
						var supported_formats = "Acceptable file types: jpg, jpeg, png, tif, tiff";
						var maximum_size = 'Maximum file size: '+image_maxsize;
            return ( React.createElement(FileUploader,{dragmsg: photomsg, upload_msg: upload_msg, supported_formats: supported_formats, maximum_size: maximum_size, fileType:'image', extensions : 'jpg,jpeg,png,tif,tiff'}) );
          }        
        });

        React.render(
          React.createElement(AppPhoto, {source: url}), document.querySelector("#media-top-box-photo")); 
					
				//Text Detail
        var AppText = React.createClass({
          getInitialState: function() {
            return {
							fileType: '',
            }
          },
          render: function() {  
						var textmsg = React.createElement("span", null, "Drag text-based files here to upload.", React.createElement("br", null, "Acceptable file types: doc, docx, epub, html, pdf, rtf, txt"), React.createElement("span", null, 'Maximum file size: '+text_maxsize));
						var upload_msg = "Drag text-based files here to upload.";
						var supported_formats = "Acceptable file types: doc, docx, epub, html, pdf, rtf, txt";
						var maximum_size = 'Maximum file size: '+text_maxsize;
            return ( React.createElement(FileUploader,{dragmsg: textmsg, upload_msg: upload_msg, supported_formats: supported_formats, maximum_size: maximum_size, fileType:'text', extensions : 'doc,docx,epub,html,pdf,rtf,txt'}) );
          }        
        });
				
				React.render(
          React.createElement(AppText, {source: url}), document.querySelector("#media-top-box-text")); 			
					
				//Video Detail
        var AppVideo = React.createClass({
          getInitialState: function() {
            return {
							fileType: '',
            }
          },
          render: function() {  
						var videomsg =React.createElement("span", null, "Drag video files here to upload.", React.createElement("br", null, "Acceptable file types: avi, mov, mp4"), React.createElement("span", null, 'Maximum file size: '+video_maxsize));
						var upload_msg = "Drag video files here to upload.";
						var supported_formats = "Acceptable file types: avi, mov, mp4";
						var maximum_size = 'Maximum file size: '+video_maxsize;
            return ( React.createElement(FileUploader,{dragmsg: videomsg, fileType:'video', upload_msg: upload_msg, supported_formats: supported_formats, maximum_size: maximum_size, extensions : 'avi,mov,mp4'}) );
          }        
        });
				
				React.render(
          React.createElement(AppVideo, {source: url}), document.querySelector("#media-top-box-video"));
				
				//status box rows
        var AppStatusRows = React.createClass({
          getInitialState: function() {
            return {
              file_name: '-',
              media_id: '',
              media_name: '',
              tagsArr: '',
              spinner_status: false,
              updateFlag: false,
            }
          },
          componentWillMount: function() {
            var th = this;
						this.state.media_id = this.props.media_id;
						var title = this.props.media_name;
						title = title.substr(0, title.lastIndexOf("."));
						this.state.media_name = title;
						this.state.file_name = this.props.file_name;
						window.addEventListener('load', th.tagsInput.bind());
          },
          render: function() {
						//console.log('this.state.media_name - '+this.state.media_name);
						var spinner_process = '';
						if(this.state.spinner_status){
              var spinner_process = React.createElement('div', {className:'status-progress-overlay'}, React.createElement('div', {className:'spinner-border'}, null));
            }
						return React.createElement('div', null, React.createElement('div', {className: 'd-flex status-rows'}, 
							React.createElement('div', {className: 'media-title status-items status-item-1'}, this.state.file_name),
							React.createElement('input',{type: 'text', className: 'pl-1 media-title status-item status-item-2 status-input', type: 'text', 'data-mid': this.props.media_id, value: this.state.media_name, autoFocus: true, style: {'margin-right': '15px'}, onChange: this.changeFileName.bind(this.value), onFocus: this.focusFileName.bind(this.value), onBlur: this.saveFileName.bind(this.value)}),
							React.createElement('input',{type: 'text', onFocus: this.tagsInput.bind(this), onload: this.tagsInput.bind(this), onLoad: this.tagsInput.bind(this), className: 'pl-1 media-tags status-item status-item-3 status-input', placeholder: 'Add a tag', 'data-mid': this.props.media_id, type: 'text', autoFocus: true})),	
							spinner_process,						
						);	
          },
					changeFileName: function(e){
						var t = this;
						var val = e.target.value;
						this.setState({ media_name: val });					
						this.setState({ updateFlag: true });
					},
					focusFileName: function(e){
console.log('focusFlag - '+focusFlag);						
						if(focusFlag){
							var t = this;
							var val = e.target.value;
							if(val !== '' && !this.state.updateFlag){
								var mid = jQuery(e.target).attr("data-mid");
								//this.setState({ media_name: val });
								var tabName = t.props.tabname;
								setTimeout(function() {
									axios.get(Drupal.url('rest/session/token'))
									.then(function (data) {
										var csrfToken = data.data;
										let headers = {'Content-Type': 'application/hal+json','Cache-Control': 'no-cache', 'X-CSRF-Token':csrfToken,};
										var media_url_hal_json = media_base_url+'/media/'+mid+'/edit?_format=hal_json';
										var type_url = media_base_url_http + '/rest/type/media/'+t.props.fileType;
										var media_name_update_json = {
											"_links": {
												"type": {"href": type_url }
											},
											"name": [
												{
													"value": val
												}
											]
										};
										axios.patch(media_url_hal_json, media_name_update_json, { headers: headers })
										.then(function(result) {
											if(result.status == 200){
												console.log('Name updated!');
												focusFlag = false;
												//t.setState({spinner_status: false});
												//jQuery('#media-'+tabName+'-status-box').find('.progress-overlay').remove();
											}else{
												alert('Error');
											}
										});
									});
								}, 20); // 2 seconds
							} else {
								//alert('Please enter filename.');
								t.focus();
							}
						}
					},
					saveFileName: function(e){
						var t = this;
						if(t.state.updateFlag){
							var val = e.target.value;
							if(val !== ''){
								var mid = jQuery(e.target).attr("data-mid");
								//this.setState({ media_name: val });
								var tabName = t.props.tabname;
								setTimeout(function() {
									if(t.state.updateFlag){
										t.setState({spinner_status: true});
									}
									axios.get(Drupal.url('rest/session/token'))
									.then(function (data) {
										var csrfToken = data.data;
										let headers = {'Content-Type': 'application/hal+json','Cache-Control': 'no-cache', 'X-CSRF-Token':csrfToken,};
										var media_url_hal_json = media_base_url+'/media/'+mid+'/edit?_format=hal_json';
										var type_url = media_base_url_http + '/rest/type/media/'+t.props.fileType;
										var media_name_update_json = {
											"_links": {
												"type": {"href": type_url }
											},
											"name": [
												{
													"value": val
												}
											]
										};
										axios.patch(media_url_hal_json, media_name_update_json, { headers: headers })
										.then(function(result) {
											if(result.status == 200){
												t.setState({spinner_status: false});
												jQuery('#media-'+tabName+'-status-box').find('.progress-overlay').remove();
											}else{
												alert('Error');
											}
										});
									});
								}, 100); // 2 seconds
							} else {
								//alert('Please enter filename.');
								t.focus();
							}
						}
					},
					tagsInput: function(e){
						var t = this;
						var tabName = t.props.tabname;
						if(e.target.value !== ''){
							jQuery(e.target).attr('placeholder','');
						} else {
							jQuery(e.target).attr('placeholder','Add a tag');
						}
						jQuery('input.media-tags').tagsInput({
							minChars: 2,
							allowDuplicates: false,
							'autocomplete': {
							source: '/tools/video/tags/'+uid
							},
							onAddTag: function(fld, tag){
								if(jQuery('#'+fld.id+'_tagsinput span.tag').length){
									jQuery('#'+fld.id+'_tagsinput input.tag-input').attr('placeholder', '');
								} else {
									jQuery('#'+fld.id+'_tagsinput input.tag-input').attr('placeholder', 'Add a tag');
                }
								var mid = jQuery('#'+fld.id).attr('data-mid');
								//console.log(tag);
								if(tag !== ''){
									t.setState({spinner_status: true});
									jQuery.ajax({
										url: "/tools/video/create/tags",
										data:{"uid":uid, term_name: tag, mid: mid},
										type: "POST",
										success:function(data){
											//console.log(data);
											if(data == 'done'){
												t.setState({spinner_status: false});
												jQuery('#media-'+tabName+'-status-box').find('.progress-overlay').remove();
												//console.log(data);
											}
											/* else if(data == 'failed'){
												alert('Tag processing failed!');
											} */
										}
									});
								}
							},
							onRemoveTag: function(fld, tag){
								if(jQuery('#'+fld.id+'_tagsinput span.tag').length){
									jQuery('#'+fld.id+'_tagsinput input.tag-input').attr('placeholder', '');
								} else {
									jQuery('#'+fld.id+'_tagsinput input.tag-input').attr('placeholder', 'Add a tag');
                }
								var mid = jQuery('#'+fld.id).attr('data-mid');
								//console.log(tag);
								if(tag !== ''){
									//console.log(mid);
									t.setState({spinner_status: true});
									jQuery.ajax({
										url: "/tools/video/remove/tags",
										data:{"uid":uid, term_name: tag, mid: mid},
										type: "POST",
										success:function(data){
											//console.log(data);
											if(data == 'done'){
												t.setState({spinner_status: false});
												jQuery('#media-'+tabName+'-status-box').find('.progress-overlay').remove();
												//console.log(data);
											}
											/* else if(data == 'failed'){
												alert('Tag does not exists!');
											} */
										}
									});
								}
							},
						});
					}
        });
				
        
        //media vault link with active tab on window load			
        var currentURL = window.location.href; 
        var activeTabarr = currentURL.split('#');
        if(activeTabarr[1]){
          window.location.hash = activeTabarr[1];          
        }
        //archive/media vault link with active tab on tab switch
        jQuery(".nav .nav-item").on("shown.bs.tab", function(e) {					
          var hashid = jQuery(e.target).attr("href").substr(1);
          window.location.hash = hashid;	
					if(window.pageYOffset > 0){
						window.scrollTo(0, 0);
					} else {
						window.scrollTo(0, 0);
					}
        });
				
				window.onload = function() { 
					if(window.pageYOffset > 0){
						window.scrollTo(0, 0);
					} else {
						window.scrollTo(0, 0);
					}
				}

      }
    }
  }
})(jQuery, Drupal, drupalSettings);
