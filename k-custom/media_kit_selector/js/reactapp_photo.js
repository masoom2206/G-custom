var AppPhoto = React.createClass({
  getInitialState: function() {
    return {
      photos: [],
    }
  },
  componentWillMount: function(){
    var km_base_url = this.props.base_url;
    var media_kit_url = km_base_url+"/node/"+this.props.mkid+"?_format=json";
    var th = this;
    this.serverRequest = 
      axios.get(media_kit_url)
        .then(function(result) {    
            return result.data.field_vault_photo;
        })
        .then(function(response) {
           return Promise.all(response.map( (record, index) => {
             return axios.get(km_base_url+'/media/'+record.target_id+'/edit?_format=json');
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
    jQuery('div.mks-spinner').hide();
    jQuery('#tab-content-'+this.props.options.element_id).find('div.tab-pane.active table.media-table').show();
    
    var counter = 0;
    if(this.state.photos.length == 0){
      items = React.createElement('tr', {className: 'no-media-data text-center'},
        React.createElement('td', {className: 'media-data text-center', colSpan: "5"},
          React.createElement('div', {className: 'empty-media-data-message'},
            React.createElement('span', {className: 'message'}, 'You currently have no photo assets.'),
          )
        ),
      );
    }else{
      var items = this.state.photos.map((item, key) => {
        counter += 1;
        //Media title
        let file_name = '-';
        /*
        file_name = React.createElement(AppFileName, {base_url: this.props.base_url, fid: item.data.field_media_image[0].target_id});
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
        
        //File size
        if ((item.data.field_pixel_dimentions).length > 0) {
          var photo_dimensions = item.data.field_pixel_dimentions[0].value;
        } else {
          var photo_dimensions = '-';  
        }
        
        var td_chk = (this.props.options.tabs.photo.cols.multi_asset_chk == 1) ? React.createElement('td', {className: 'media-data text-center'},
            React.createElement('label', {className: 'checkbox-container'},
              React.createElement('input',{type: 'checkbox', id: 'photo-kit-check-'+key, className: 'box-check', 'data-mid': item.data.mid[0].value, 'value': item.data.mid[0].value}),
              React.createElement('span', {className: 'checkmark'}),
            )
          ) : null;

         
        if(this.props.options.tabs.photo.gallery == 1) { 
          var gallery_or_checkmark = React.createElement('div', {className: 'overlay'},
            React.createElement('button', {type: 'button', className: 'preview-icon', onClick: this.ShowPhotomodal.bind()}, '')
          ); 
        }else{
          var gallery_or_checkmark = null;
          if(this.props.options.tabs.photo.tick == 1){
          var gallery_or_checkmark = React.createElement('div', {
              className: 'overlay'
            }, React.createElement('label', {
              className: 'checkbox-container'
            }, React.createElement('input', {
              type: 'checkbox',
              id: 'audio-kit-check-' + key,
              className: 'box-check',
              'data-mid': item.data.mid[0].value,
              'value': item.data.mid[0].value
            }), React.createElement('span', {
              className: 'checkmark'
            }), ));
          }
        }                
        var td_photo = (this.props.options.tabs.photo.cols.photo == 1) ? React.createElement('td', {className: 'media-data media-data-col-name', 'data-src': item.data.field_media_image[0].media_style_url},
            React.createElement("div", {id: key+'-photo-'+item.data.mid[0].value, className:"media-box"}, 
              React.createElement('img', {src:item.data.field_media_image[0].image_style}),
              gallery_or_checkmark
            )
          ) : null; 
        var td_title = (this.props.options.tabs.photo.cols.title == 1) ? React.createElement('td', {className: 'media-data media-file-name'}, file_name) : null; 
        var td_tags = (this.props.options.tabs.photo.cols.tags == 1) ? React.createElement('td', {className: 'media-data media-tags'}, media_tags) : null; 
        var td_dimensions = (this.props.options.tabs.photo.cols.dimension == 1) ? React.createElement('td', {className: 'media-data photo-dimensions'}, photo_dimensions) : null;

        return React.createElement('tr', {className:'media-row',  'data-exthumbimage': item.data.field_media_image[0].image_style, 'data-src': item.data.field_media_image[0].modal_style_url},
          td_chk,
          td_photo,
          td_title,
          td_tags,
          td_dimensions,
        )
      });
    }
    
    var th_chk = (this.props.options.tabs.photo.cols.multi_asset_chk == 1) ? React.createElement('th', {className: 'mchk'}, null, ) : null; 
    var th_photo = (this.props.options.tabs.photo.cols.photo == 1) ? React.createElement('th', {className: 'masset'}, null,) : null; 
    var th_title = (this.props.options.tabs.photo.cols.title == 1) ? React.createElement('th', {className: 'sortempty media-title mtitle', onClick: this.sortColumn.bind(this)}, 'Title') : null; 
    var th_tags = (this.props.options.tabs.photo.cols.tags == 1) ? React.createElement('th', {className: 'sortempty media-title media-tag', onClick: this.sortColumn.bind(this)}, 'Tags') : null; 
    var th_dimensions = (this.props.options.tabs.photo.cols.dimension == 1) ? React.createElement('th', {className: 'sortempty media-title mfdd', onClick: this.sortColumn.bind(this)}, 'Dimensions') : null;
    var table_head = React.createElement('thead',{},
      React.createElement('tr', null,
        th_chk,
        th_photo,
        th_title,
        th_tags,
        th_dimensions,
      )
    );
    var table_body = React.createElement('tbody', {id: 'mk-photo-gallery-'+this.props.options.element_id}, items);
    var table_footer = React.createElement('tfoot', {id: 'duplicate-body'});
    var table_data = React.createElement('table', {className: 'media-table', id: 'table-photo-'+this.props.options.element_id}, table_head, table_body, table_footer);
    
    var updatediv = React.createElement('div', {className: 'd-none', id: 'photo-'+this.props.options.element_id+'-refresh', onClick: this.UpdateMethod.bind()}, 'refresh');

    return (
     React.createElement("div", {}, table_data, updatediv)
    );
  },
  UpdateMethod: function() {
    var th = this;
    jQuery('table#table-photo-'+th.props.options.element_id+' tfoot').empty();
    jQuery('table#table-photo-'+th.props.options.element_id+' tbody').removeClass('d-none');
    jQuery('table#table-photo-'+th.props.options.element_id+' tbody tr').show();
    jQuery('table#table-photo-'+th.props.options.element_id+' thead tr th').removeClass('bg-sort');
    jQuery('table#table-photo-'+th.props.options.element_id+' tbody tr td').removeClass('sorted');
    
    //Force a render with a simulated state change
    media_kit_id = jQuery('#mediakitid-'+this.props.options.element_id).val();
    media_kit_url = th.props.base_url+"/node/"+media_kit_id+"?_format=json";
    
    this.serverRequest = 
      axios.get(media_kit_url)
        .then(function(result) {    
            return result.data.field_vault_photo;
        })
        .then(function(response) {
           return Promise.all(response.map( (record, index) => {
             return axios.get(th.props.base_url+'/media/'+record.target_id+'/edit?_format=json');
           }))
        })
        .then(function(responsex) {
          th.setState({photos: responsex});
        });
  },
  sortColumn: function(e) {
    var th = this;
    var t = e.target;
    var txt = jQuery(e.target).text();
    const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
    const comparer = (idx, asc) => (a, b) => ((v1, v2) => v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2))(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
    const table = t.closest('table');
    // get table id
    var tableid = jQuery(t.closest('table')).attr('id');
    jQuery('#' + tableid + ' thead tr th').removeClass('bg-sort');
    jQuery('#' + tableid + ' thead tr th').removeClass('asc-icon');
    jQuery('#' + tableid + ' thead tr th').removeClass('desc-icon');
    
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
    
    if (t.asc) {
      jQuery(t).removeClass("asc-icon");
      jQuery(t).addClass("desc-icon");
      jQuery(t).addClass("bg-sort");
    } else if (!t.asc) {
      jQuery(t).removeClass("desc-icon");
      jQuery(t).addClass("asc-icon");
      jQuery(t).addClass("bg-sort");
    } else {
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
    if (txt == 'Dimensions') {
      Array.from(picRowsFrom).sort(function sort(a, b) {
        var data = jQuery(a).children('td.photo-dimensions').text();
        var datab = jQuery(b).children('td.photo-dimensions').text();
        data = data.split(' px x ');
        datab = datab.split(' px x ');
        var num = parseInt(data[0]);
        var numb = parseInt(datab[0]);
        if (t.asc) {
          if (num > numb) return 1;
          if (num < numb) return -1;
          return 0;
        } else if (!t.asc) {
          if (num < numb) return 1;
          if (num > numb) return -1;
          return 0;
        } else {
          if (num < numb) return 1;
          if (num > numb) return -1;
          return 0;
        }
      }).forEach(tr => table.childNodes[2].appendChild(tr));
    }  
    
    //adding class to sorted column
    jQuery('#'+tableid+' td').removeClass('sorted');
    var ind = jQuery(t).index() + 1;
    jQuery('#'+tableid+' td:nth-child('+ind+')').addClass('sorted');
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
  ShowPhotomodal: function(e){
    var $gallery = jQuery('#mk-photo-gallery-'+this.props.options.element_id).lightGallery({
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