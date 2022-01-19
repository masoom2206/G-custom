/**
 * @file
 * Attaches behaviors for the social_media module.
 *
 */
(function($, Drupal) {
    var initialized;
    Drupal.behaviors.image_asset_editor2 = {
        attach: function(context, settings) {
            if (!initialized) {
                initialized = true;
                //var user_id = drupalSettings.user_id;
                //Confirmation Modal 

                jQuery(document).on('click', '#uploadfiles_image', function(e) {
                    e.preventDefault();
                });
			
                let Modal = React.createClass({
                    componentDidMount: function() {
                        jQuery(this.getDOMNode()).modal('show');
                        jQuery(this.getDOMNode()).on('hidden.bs.modal', this.props.handleHideModal);
                    },
                    render: function() {
                        var btnCancel = '';
                        var title_msg = '';
                        var button_text = 'OK';
                        if (this.props.fileTifsmatch) {
                            var btnCancel = React.createElement('button', {
                                type: 'button',
                                className: 'btn btn-default',
                                onClick: this.props.handleCancle
                            }, 'Cancel');
                            title_msg = '';
                            button_text = 'OK';
                        }
                        return (
                            React.createElement('div', {
                                    id: 'modal',
                                    className: 'modal fade'
                                },
                                React.createElement('div', {
                                        className: 'modal-dialog'
                                    },
                                    React.createElement('div', {
                                            className: 'modal-content'
                                        },
                                        React.createElement('div', {
                                                className: 'modal-header'
                                            },
                                            React.createElement('h4', {
                                                className: 'modal-title'
                                            }, title_msg)
                                        ),
                                        React.createElement('div', {
                                            className: 'modal-body'
                                        }, this.props.delete_modal_msg),
                                        React.createElement('div', {
                                                className: 'modal-footer'
                                            },
                                            btnCancel,
                                            React.createElement('button', {
                                                type: 'button',
                                                className: 'btn btn-primary',
                                                onClick: this.props.handleArchive
                                            }, button_text),
                                        ),
                                    )
                                )
                            )
                        )
                    },
                    closeModal: function() {
                        jQuery('#modal').modal('hide');
                    },
                    propTypes: {
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
                            /* base_url: media_base_url,
                             arc_status: media_archive, */
                            uploaded_files: '',
                            uploaded_files_size: '',
                            uploaderstate: '',
                            queuedFiles: [],
                            up: '',
                        }
                    },
                    componentDidMount: function() {
                        var th = this;
                        // Apply plupload
                        var total_file_size = 0;
                        var err_fType = '';
                        var ft = th.props.fileType;
                        var ex = th.props.extensions;
                        var tabname = ft;
                        var u_files = [];

                        var uploader = new plupload.Uploader({
                            runtimes: 'html5,flash,silverlight,html4',
                            multi_selection: false,
                            browse_button: 'pickfiles_' + th.props.fileType, // you can pass an id...
                            drop_element: 'media-upload-list_' + th.props.fileType,
                            url: '/mvt-handle-uploads-public/',
                            max_file_size: '100mb',
                            unique_names: true,
                            dragdrop: true,
                            flash_swf_url: '../js/Moxie.swf',
                            silverlight_xap_url: '../js/Moxie.xap',
                            filters: {
                                mime_types: [{
                                    title: "Media files",
                                    extensions: ex
                                }]
                            },
                            // PreInit events, bound before any internal events
                            preinit: {
                                Init: function(up, info) {
                                    //console.log(up);
                                    //console.log(info);
                                },

                                UploadFile: function(up, file) {
                                    //console.log(file);									
                                }
                            },
                            init: {
                                PostInit: function() {
                                    document.getElementById('uploadfiles_' + ft).onclick = function() {
                                        if (!jQuery(this).hasClass('plupload_disabled')) {
                                            var file_name = '';
                                            var file_extension = '';
                                            th.state.queuedFiles.map((file, key) => {
                                                //console.log(file);
                                                file_name = file.name;
                                                file_extension = file_name.substring(file_name.lastIndexOf(".") + 1, file_name.length);
                                                if (file.type == 'image/tiff' && (file_extension == 'tif' || file_extension == 'tiff')) {
                                                    th.setState({
                                                        fileTifsmatch: true
                                                    });
                                                    th.ShowFileConversionModal(file, uploader);
                                                }
                                            });
                                        }
                                        if (th.state.fileTifsmatch == false) {
                                            uploader.start();
                                        } else {
                                            return false;
                                        }
                                    };
                                    if (!uploader.files.length) {
                                        jQuery('#uploadfiles_' + ft).addClass('plupload_disabled');
                                        jQuery('#uploadfiles_' + ft).attr('disabled', 'disabled');
                                        jQuery('#mv-done-' + ft).addClass('disabled');
                                        jQuery('#mv-cancle-' + ft).removeClass('disabled');
                                    }
                                },
                                Refresh: function(up) {
                                    // Called when the position or dimensions of the picker change
                                    //console.log(up);              
                                },
                                QueueChanged: function(up) {
                                    jQuery('#media-upload-list_' + ft).addClass('queued');
                                    document.getElementsByClassName('media_total_file_size_' + ft)[0].innerHTML = plupload.formatSize(uploader.total.size).toUpperCase();
                                    jQuery('#media-container-' + ft + ' span.plupload_upload_status').html(plupload.sprintf(('%d files queued'), uploader.total.queued));
                                },
                                StateChanged: function(up) {
                                    //uploader.disableBrowse(true);
                                },
                                FilesAdded: function(up, files) {
                                    //console.log(uploader.files);
                                    if (uploader.files.length) {
                                        jQuery('#uploadfiles_' + ft).removeClass('plupload_disabled');
                                        jQuery('#uploadfiles_' + ft).removeAttr('disabled');
                                        th.setState({
                                            queuedFiles: files
                                        });
                                    }



                                    plupload.each(files, function(file) {
                                        var formatedsize = plupload.formatSize(file.size).toUpperCase();
                                        document.getElementById('media-upload-list_' + ft).innerHTML += '<li id="' + file.id + '" class=""><div class="plupload_file_name"><span>' + file.name + '</span></div><div class="plupload_file_action"><button type="button"></button></div><div class="plupload_file_status text-center">0%</div><div class="plupload_file_size text-center">' + formatedsize + '</div><div class="plupload_clearer">&nbsp;</div></li>';
                                        th.handleStatus(file);
                                        //console.log(file);
                                    });
                                    jQuery('#media-upload-list_' + ft + ' li.plupload_delete').each(function(i) {
                                        jQuery(this).children('.plupload_file_action').children('button').click(function(e) {
                                            e.preventDefault();
                                            var current_file_id = jQuery(this).parent('.plupload_file_action').parent('.plupload_delete').attr('id');
                                            jQuery('#' + current_file_id).remove();
                                            for (var i = 0; i < uploader.files.length; i++) {
                                                if (uploader.files[i].id === current_file_id) {
                                                    uploader.removeFile(uploader.files[i]);
                                                }
                                            }
                                        });
                                    });
                                    if (uploader.total.queued !== 0) {
                                        jQuery('#media-container-' + ft + ' span.plupload_upload_status').css('display', 'block');
                                    }
                                    if (uploader.total.queued == 1) {
                                        jQuery('.button_add_file').addClass('disabled');
                                        uploader.disableBrowse(true);
                                    }
                                },
                                FilesRemoved: function(up, files) {
                                    // Called when files are removed from queue 
                                    if (uploader.total.queued === 0) {
                                        jQuery('.button_add_file').removeClass('disabled');
                                        uploader.disableBrowse(false);
                                        jQuery('#media-container-' + ft + ' span.plupload_upload_status').css('display', 'none');
                                        jQuery('#media-upload-list_' + ft).removeClass('queued');
                                        jQuery('#uploadfiles_' + ft).addClass('plupload_disabled');
                                        jQuery('#uploadfiles_' + ft).attr('disabled', 'disabled');
                                    }
                                    var scrollTop = jQuery('#media-upload-list_' + ft).scrollTop();
                                    jQuery('#media-upload-list_' + ft).scrollTop(scrollTop);
                                    jQuery('#media-container-' + ft + ' span.plupload_upload_status').html(plupload.sprintf(('%d files queued'), uploader.total.queued));
                                },
                                UploadProgress: function(up, file) {
                                    th.handleStatus(file);
                                    document.getElementById(file.id).getElementsByClassName('plupload_file_status')[0].innerHTML = file.percent + '%';
                                    //upload progress
                                    jQuery('.total_status_' + ft).html(uploader.total.percent + '%');
                                    jQuery('#media-container-' + ft + ' div.plupload_progress').css('display', 'block');
                                    jQuery('#media-container-' + ft + ' div.plupload_progress_bar').css('width', uploader.total.percent + '%');
                                    jQuery('#media-container-' + ft + ' span.plupload_upload_status').css('display', 'block');
                                    //  jQuery('#media-container-'+ft+' span.plupload_upload_status').html(plupload.sprintf(('Uploaded %d/%d files'), uploader.total.uploaded, uploader.files.length));
                                    jQuery('#media-container-' + ft + ' span.plupload_upload_status').html(plupload.sprintf(('Uploaded %d/%d files'), 1, uploader.files.length));
                                },
                                FileUploaded: function(up, file, info) {
                                    // Called when file has finished uploading
                                    var json_data = info.response;
                                    var obj = JSON.parse(json_data);
                                    u_files.push(obj);
                                    th.handleStatus(file);
									jQuery('#main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
                                },
                                UploadComplete: function(up, files) {
                                    // Called when all files are either uploaded or failed
                                    th.setState({
                                        uploaded_files: u_files
                                    });
                                    var formatedsize = plupload.formatSize(uploader.total.size).toUpperCase();
                                    th.setState({
                                        uploaded_files_size: formatedsize
                                    });

                                    /*setTimeout(function() {
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
                                    				}, 2000); */

                                    //window.location.reload();
                                },
                                Error: function(up, err) {
                                    var file = err.file,
                                        message;
                                    if (file) {
                                        message = err.message;
                                        if (err.details) {
                                            message += " (" + err.details + ")";
                                        }
                                        if (err.code == plupload.FILE_SIZE_ERROR) {
                                            th.setState({
                                                filemismatch: true
                                            });
                                            th.setState({
                                                filesizeError: true
                                            });
                                            th.ShowFilesmismatchModal(file.name);
                                        }
                                        if (err.code == plupload.FILE_EXTENSION_ERROR) {
                                            th.setState({
                                                filemismatch: true
                                            });
                                            if (file.type !== '') {
                                                var type = (file.type).split('/');
                                                if (type) {
                                                    var extype = type[0];
                                                }
                                                if (extype == 'image') {
                                                    err_fType = 'Photo';
                                                }

                                            } else {
                                                var fname = file.name;
                                                var extype = fname.substring(fname.lastIndexOf(".") + 1, fname.length);
                                                //console.log(extype);
                                                if (extype == 'heic' || extype == 'heif') {
                                                    err_fType = 'Photo';
                                                }
                                            }
                                            th.setState({
                                                filemismatch: true
                                            });
                                            th.ShowFilesmismatchModal(err_fType);
                                        }
                                        file.hint = message;
                                        jQuery('#media-upload-list_' + ft + ' #' + file.id).attr('class', 'plupload_failed').find('a').css('display', 'block').attr('title', message);
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
                        var icon = jQuery('#media-upload-list_' + ft + ' #' + file.id).attr('class', actionClass).find('a').css('display', 'block');
                        if (file.hint) {
                            icon.attr('title', file.hint);
                        }
                    },
                    ShowFilesmismatchModal: function(err_fType) {
                        //var msg = React.createElement("div", {className: 'text-center', style: {'padding': '1rem 0'}}, 'The selected file type "'+err_fType+'" may not be uploaded to this tab.');
                        var msg = React.createElement("div", {
                            className: 'text-center',
                            style: {
                                'padding': '1rem 0'
                            }
                        }, 'Please note the "Acceptable file types" listed in the upload box. Only file of these types can be uploaded.');
                        if (this.state.filesizeError) {
                            var msg = React.createElement("div", {
                                className: 'text-center',
                                style: {
                                    'padding': '1rem 0'
                                }
                            }, "Size of the file - ", React.createElement("b", null, err_fType), " is too large.");
                        }
                        this.setState({
                            filemismatch_modal_status: true
                        });
                        this.setState({
                            DS_modal_msg: msg
                        });
                    },
                    fcloseModal: function() {
                        jQuery('#modal').modal('hide');
                        this.setState({
                            filemismatch_modal_status: false
                        });
                        this.setState({
                            DS_modal_msg: ''
                        });
                        this.setState({
                            filemismatch: false
                        });
                        this.setState({
                            filesizeError: false
                        });
                    },
                    ShowFileConversionModal: function(file, uploader) {
                        var msg = React.createElement("div", {
                            className: 'text-center',
                            style: {
                                'padding': '1rem 0'
                            }
                        }, 'Please note that any TIFF images will be converted to PNG format for maximum compatibility.');
                        this.setState({
                            file_conversion_modal_status: true
                        });
                        this.setState({
                            filetoconvert: file
                        });
                        this.setState({
                            up: uploader
                        });
                        this.setState({
                            DS_modal_msg: msg
                        });
                    },
                    fcloseConversionModal: function() {
                        var th = this;
                        var ft = th.props.fileType;
                        th.setState({
                            removeUnsupportedFiles: true
                        });
                        var file = th.state.filetoconvert;
                        var up = th.state.up;
                        jQuery('#media-upload-list_' + ft + ' li#' + file.id + ' .plupload_file_action > button').trigger('click');
                        th.state.queuedFiles;
                        const index = th.state.queuedFiles.indexOf(file);
                        if (index > -1) {
                            th.state.queuedFiles.splice(index, 1);
                        }
                        //console.log(th.state.queuedFiles);
                        up.refresh();
                        //console.log('length - '+up.files.length);
                        if (up.files.length == 0) {
                            setTimeout(function() {
                                jQuery('#media-upload-list_' + ft).removeClass('queued');
                                //document.getElementById('media-upload-list_'+ft).innerHTML += '<li class="media_droptext"><span><span style="font-size:14px;">'+th.props.upload_msg+'</span><br>'+th.props.supported_formats+'<br>'+th.props.maximum_size+'</span></li>';
                                jQuery('.media_filelist_footer .plupload_upload_status').html('');
                                jQuery('.media_filelist_footer .media_total_file_size_' + ft).html('0 B');
                                jQuery('.media_filelist_footer .total_status_' + ft).html('0%');
                                jQuery('#media-container-' + ft + ' div.plupload_progress').css('display', 'none');
                                jQuery('#media-container-' + ft + ' div.plupload_progress_bar').css('width', '0%');
                                jQuery('#uploadfiles_' + ft).addClass('plupload_disabled');
                                jQuery('#uploadfiles_' + ft).attr('disabled', 'disabled');
                            }, 500);
                        }
                        jQuery('#modal').modal('hide');
                        th.setState({
                            file_conversion_modal_status: false
                        });
                        th.setState({
                            DS_modal_msg: ''
                        });
                        th.setState({
                            fileTifsmatch: false
                        });
                        th.setState({
                            removeUnsupportedFiles: false
                        });
                    },
                    processConversion: function() {
                        this.setState({
                            proceedWithConversion: true
                        });
                        var file = this.state.filetoconvert;
                        var up = this.state.up;
                        //console.log(up);
                        up.start();
                        jQuery('#modal').modal('hide');
                        //this.setState({removeUnsupportedFiles: true});
                        this.setState({
                            file_conversion_modal_status: false
                        });
                        this.setState({
                            DS_modal_msg: ''
                        });
                        this.setState({
                            fileTifsmatch: false
                        });
                    },
                    render: function() {
                        var uploaded_files = this.state.uploaded_files;
                        //console.log(uploaded_files);alert('render');
                        var uploaded_files_size = this.state.uploaded_files_size;
                        var ft = this.props.fileType;
                        var status_items_top = '';
                        var status_items_bottom = [];
                        var tabname = ft;
                        if (uploaded_files.length > 0) {
   
							jQuery('.loaded-image').attr('data-fid', uploaded_files[0]['fid']);
                            jQuery('.loaded-image').attr('data-src', uploaded_files[0]['url']);
                            

							// image editor initialization
							$imageCropper = jQuery('.image-editor');
							var str = uploaded_files[0]['dimension'];
							var a = str.split('x');
                            
							 ReplaceResizeImage($imageCropper, uploaded_files[0]['url'], parseInt(a[1]), parseInt(a[0]), 0, function(result) {
								 jQuery('.right-header').removeClass('disabled');
                                 
								 var default_preset_value = jQuery("#mediaPreset option").filter(function() {
                                  return jQuery(this).text() === "Uploaded file";
                                 }).first().attr("value");
								jQuery('#mediaPreset').val(default_preset_value);
								jQuery('.original-dimensions-field span.og-dim').text(uploaded_files[0]['dimension']);
								jQuery('.original-dimensions-field span.file-sz').text('(' + uploaded_files[0]['fileSize'] + ')');
								jQuery('.preset-dim-field span.preset-dim').text(uploaded_files[0]['dimension']);
								jQuery('.preset-type-field span.preset-type').text(uploaded_files[0]['extension']);
								 jQuery('#overlay').remove();
							});
                        }
                        if (this.state.filemismatch_modal_status) {
                            var filemismatchModalElement = React.createElement(Modal, {
                                handleArchive: this.fcloseModal,
                                fileType: ft,
                                filemismatch: this.state.filemismatch,
                                delete_modal_msg: this.state.DS_modal_msg
                            });
                        }
                        if (this.state.file_conversion_modal_status) {
                            var fileconversionModalElement = React.createElement(Modal, {
                                handleCancle: this.fcloseConversionModal,
                                handleArchive: this.processConversion,
                                fileType: ft,
                                fileTifsmatch: this.state.fileTifsmatch,
                                base_url: this.state.base_url,
                                delete_modal_msg: this.state.DS_modal_msg
                            });
                        }
                        return React.createElement('div', {
                            className: 'w-100 d-flex justify-content-between'
                        }, React.createElement('div', {
                                id: 'media-uploader-box-' + tabname,
                                className: 'w-100'
                            },
                            React.createElement('div', {
                                    className: 'media-box-wrapper'
                                },
                                React.createElement('div', {
                                        id: 'media-container-' + ft,
                                        className: 'media-container'
                                    },
                                    React.createElement('div', {
                                            className: 'media-header'
                                        },
                                        React.createElement('div', {
                                            className: 'file_name'
                                        }, 'Filename'),
                                        React.createElement('div', {
                                            className: 'file_action'
                                        }, null),
                                        React.createElement('div', {
                                                className: 'file_status text-center'
                                            },
                                            React.createElement('span', null, 'Status')
                                        ),
                                        React.createElement('div', {
                                                className: 'file_size text-center'
                                            },
                                            React.createElement('span', null, 'Size')
                                        ),
                                        React.createElement('div', {
                                            className: 'plupload_clearer'
                                        })
                                    ),
                                    React.createElement('ul', {
                                            id: 'media-upload-list_' + this.props.fileType,
                                            className: 'media_filelist'
                                        },
                                        React.createElement('li', {
                                            className: 'media_droptext'
                                        }, this.props.dragmsg)
                                    ),
                                    React.createElement('div', {
                                            className: 'media_filelist_footer'
                                        },
                                        React.createElement('div', {
                                                className: 'file_name'
                                            },
                                            React.createElement('div', {
                                                    className: 'file_add_buttons'
                                                },
                                                React.createElement('a', {
                                                    id: 'pickfiles_' + this.props.fileType,
                                                    className: 'button_add_file'
                                                }, 'Add file')
                                            ),
                                            React.createElement('span', {
                                                className: 'plupload_upload_status'
                                            })
                                        ),
                                        React.createElement('div', {
                                            className: 'file_action'
                                        }, null),
                                        React.createElement('div', {
                                            className: 'file_status text-center'
                                        }, React.createElement('span', {
                                            className: 'total_status_' + this.props.fileType
                                        }, '0%')),
                                        React.createElement('div', {
                                                className: 'file_size text-center'
                                            },
                                            React.createElement('span', {
                                                className: 'media_total_file_size_' + this.props.fileType
                                            }, '0 B')
                                        ),
                                        React.createElement('div', {
                                                className: 'plupload_progress'
                                            },
                                            React.createElement('div', {
                                                className: 'plupload_progress_container'
                                            }, React.createElement('div', {
                                                className: 'plupload_progress_bar'
                                            }, null))
                                        ),
                                        React.createElement('div', {
                                            className: 'plupload_clearer'
                                        })
                                    )
                                ),
                                React.createElement('button', {
                                    type: 'submit',
                                    id: 'uploadfiles_' + this.props.fileType,
                                    className: 'upload-save-button btn btn-primary'
                                }, 'Upload'),
                                React.createElement('a', {
                                    href: '/image-converter',
                                    id: 'mv-cancle-' + this.props.fileType,
                                    className: 'upload-cancle-button ml-3 btn btn-cancel'
                                }, 'Cancel'),
                                filemismatchModalElement,
                                fileconversionModalElement,
                                //updatediv,
                            ),
                        ), );

                    }
                });

                //Photo Detail
                var AppPhoto = React.createClass({
                    getInitialState: function() {
                        return {
                            fileType: '',
                        }
                    },
                    render: function() {
                        var photomsg = React.createElement("span", null, "Drag photo here to upload.", React.createElement("br", null, "Acceptable file types: jpg, jpeg, png"), React.createElement("span", null, 'Maximum file size: 100MB'));
                        var upload_msg = "Drag photo here to upload.";
                        var supported_formats = "Acceptable file types: jpg, jpeg, png";
                        var maximum_size = 'Maximum file size: 100mb';
                        return (React.createElement(FileUploader, {
                            dragmsg: photomsg,
                            upload_msg: upload_msg,
                            supported_formats: supported_formats,
                            maximum_size: maximum_size,
                            fileType: 'image',
                            //extensions: 'jpg,jpeg,png,tif,tiff'
							extensions: 'jpg,jpeg,png'
                        }));
                    }
                });

                React.render(
                    React.createElement(AppPhoto, {
                        source: 'url'
                    }), document.querySelector("#upload-file-custom"));

            }
        }
    };
})(jQuery, Drupal);