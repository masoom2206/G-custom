  var fileName = folder = '';
  var design_id = getUrlDesignID();

/******** Start save modal *********/
	function FnDefaultModal(bodyhtml){
		$('.g-dialog-container .g-dialog').addClass('p-0 w-400');
		$('.g-dialog-container .g-dialog-content').addClass('p-5 text-center gray-border font-Lato');
		$('.g-dialog-container .g-dialog-header').addClass('p-27');
		$('.g-dialog-container .g-dialog-footer').addClass('p-2');
		$('.g-dialog-container .g-dialog-header').removeClass('d-none text-right');
		$('.g-dialog-container .g-dialog-footer').removeClass('pt-20');
		$('.g-dialog-container .g-dialog-content').html(bodyhtml);
		//$('.g-dialog-container .g-dialog-footer').html($('<button/>', {'onclick': 'FnDismisFolderModal()', 'class': 'btn btn-primary font-Lato fs-13', text: 'Ok'}));
		$('.g-dialog-container .g-dialog-footer').html($('<button/>', {'onclick': 'FnDismisFolderModal()', 'class': 'btn btn-primary fs-13', text: 'Ok'}));
	}
	  
  function FnNewFolderModal(){
		$('<div/>', {"class": "g-dialog-container d-flex justify-content-center align-items-center visible"})
			.append($('<div/>', {"class": "g-dialog"})
				.append($('<div/>', {'class': "g-dialog-header p-27 d-none", 'html': ''}))
				.append($('<div/>', {"class": "g-dialog-content"}).append($('<div/>', {"class": "d-grid"}).append($('<span/>', {"class": "d-block", text: 'Please name your folder'})).append($('<input/>', {"id": "foldername", "class": "mt-10 w-100 foldername", "type": 'text'}))))
				.append($('<div/>', {"class": "g-dialog-footer pt-20 text-right"}).append($('<button/>', {'class': 'btn btn-primary font-Lato fs-15 text-capitalize', text: 'Create', 'onclick': 'FnNewFolder()' })).append($('<button/>', {'class': 'btn btn-gray bg-gray font-Lato fs-15', 'onclick': 'FnDismisFolderModal()', text: 'Cancel'}))
				)
			).appendTo('body');
	}
  
  function formatDate(dateVal) {
    var newDate = new Date(dateVal);

    var sMonth = padValue(newDate.getMonth() + 1);
    var sDay = padValue(newDate.getDate());
    var sYear = newDate.getFullYear();
    var sHour = newDate.getHours();
    var sMinute = padValue(newDate.getMinutes());
    var sAMPM = "AM";

    var iHourCheck = parseInt(sHour);

    if (iHourCheck > 12) {
        sAMPM = "PM";
        sHour = iHourCheck - 12;
    }
    else if (iHourCheck === 0) {
        sHour = "12";
    }

    sHour = padValue(sHour);

    return sMonth + "/" + sDay + "/" + sYear + ", " + sHour + ":" + sMinute + " " + sAMPM;
  }

  function padValue(value) {
    return (value < 10) ? "0" + value : value;
  }
	
	function FnOverlay(){
		$('.mbright .tab-content').addClass('d-none');
		if($('.mbright .progress-overlay').length === 0){
			$('<div/>', {'class': 'progress-overlay'}).append($('<div/>', {'class': 'spinner-border'})).appendTo('.mbright');
		}

		setTimeout(function() {
			$('.mbright .tab-content').removeClass('d-none');
			$('.progress-overlay').remove();
		}, 1000);
	}
	
	function toggleActionPill(){
		//alert(123);
    $('ul#actionpill').toggle('d-block');     
  }
  
	function showHide(elem){
    if($('.temp-caret').hasClass('fa-caret-down')){
      $('.temp-caret').removeClass('fa-caret-down');
      $('.temp-caret').addClass('fa-caret-right');
    } else {
      $('.temp-caret').removeClass('fa-caret-right');
      $('.temp-caret').addClass('fa-caret-down');
    }
		$(elem).toggle('d-none');
	}
	
	function FnGetTemplates(sorting_id){
    design_id = getUrlDesignID();

    var existingfolder = [];
    var settings = {
      "url": access_check_api + "getfolder/" + uid,
      "method": "GET",
      "timeout": 0,
      "headers": {
        "Authorization": "bearercvc "+access_api_key,
      },
    }; 

    $.ajax(settings).done(function (response) {
      var designData = response.data;
      var groups = {};
      for (var i = 0; i < designData.length; i++) {
				//console.log('producTypeId : '+ producTypeId);
				//console.log('type_tid : '+ designData[i].type_tid);
				//console.log('folder - '+ folder);
				//if(producTypeId !== '' && producTypeId === designData[i].type_tid){
					var groupName = designData[i].folder_name;
					if (!groups[groupName]) {
						groups[groupName] = [];
					}
					if(designData[i].name != "" && designData[i].name != null){
						groups[groupName].push({designId: designData[i]._id, name: designData[i].name, img: designData[i].url_t, modified: designData[i].modified});
					}
				//}
      }
      var myArray = [];
      for (groupName in groups) {
        myArray.push({group: groupName, items: groups[groupName]});
      }    

      $.each( myArray, function( ikey, iival ) {
				//console.log('folder - '+ folder);
        var gName = iival.group;
				//console.log(gName);
        /* if(gName === folder){
          var activenav = 'active show';
        } else {
          var activenav = '';
        } */
        if($.inArray(gName, existingfolder) === -1) existingfolder.push(gName); //get unique values				
        gName = gName.split(' ').map(function (s, i) {
          return i && s.length ? s.toLowerCase() : s.toLowerCase();
        }).join('-');
        
        if(sorting_id == 'sorting-asc'){
          iival.items.sort((a, b) => a.name.localeCompare(b.name));									
        } else {
          iival.items.sort((a, b) => b.name.localeCompare(a.name));
        }
        var p_item = iival.items.map((nitem, nkey) => {
          var fdate = formatDate(nitem.modified);
          return $('<div/>', {
            "class": 'template-grid',			
            "data-design": nitem.designId,	
						//"onclick": 'newDesignFromTemplate(this)',
          }).append(
            $('<img/>', {"class": "temp-img w-100 h-150", "src": nitem.img})
          ).append(
            $('<div/>', {"class": "temp-name font-Lato-bold fs-14 text-center mt-2 mb-2", "html": nitem.name})
          ).append(
            $('<div/>', {"class": "font-Lato fs-13 mt-2", "html": "Updated "+fdate})
          );
        });
        if($('.icobg.fa-th').hasClass('icobg-active')){
          var tile_class = 'flex-row';
        } else {
          var tile_class = 'flex-column';
        }

        $('<div/>', {
          "class": 'tab-pane fade display-flex '+ tile_class +' flex-wrap',
          "id": "v-pills-"+gName,
          "role": "tabpanel",
          "data-group": gName,
          "aria-labelledby": "v-pills-"+gName+"-tab",
          "html": p_item,
        }).appendTo('.mbright .tab-content');
        
        
        var t = $('.mbleft .nav-link.primaryfolder.active.show').attr('href');
        t = t.split('#')[1];
        $('#'+t).addClass('active show');
      });
    });      
	}
	
	function fStructure(pclass, fn, fsname, caret, actionpill){
		$('<div/>', {
			"class": "nfolder c-default position-relative nav-link "+pclass, 
				"id": "v-pills-"+fn+"-tab",
				"data-toggle": "pill",
				"role": "tab",
				"data-tab-title": fsname,
				"aria-controls": "v-pills-"+fn,
				"aria-selected": true,
				"href": "#v-pills-"+fn,
			})
			.append(caret)
			.append($('<i/>', {
				"class": "fas fa-folder foldermid",
        "onclick": "FnOverlay()",
			}))
			.append(
				$('<div/>', {
					"class": 'temp-folder font-Lato-bold',
					"html": fsname,
          "onclick": "FnOverlay()",
				}),
			)
      .append(actionpill).appendTo('.mbleft .defaultfolder');
	}
	
  function FnFolderStructure(fsname, group, designId){
		var fn = fsname;
		
		fn = fn.split(' ').map(function (s, i) {
			return i && s.length ? s.toLowerCase() : s.toLowerCase();
		}).join('-');
		
    if(group === 'primaryfolder'){  
      var caret = $('<i/>', {
        "class": "fa fa-caret-down temp-caret",
        "onclick": "showHide('.mbleft .subfolder')",
      });
      var pclass = 'active show primaryfolder';
      var actionpill = '';
    } else {
      var caret = '';
      var pclass = 'subfolder ml-15';
      var actionpill = $('<i/>', {
          "class": 'action-pill fs-13 fas fa-ellipsis-v',
          "onclick": 'toggleActionPill()',
        }).append(
          $('<ul/>', {
            "class": "g-menu g-menu-bottom", 
            "id": "actionpill",
          }).append($('<li/>', {
            "class": "g-menu-item c-pointer font-Lato fs-13", 
            text: "Rename",
            "onclick": '', 
          })).append($('<li/>', {
            "class": "g-menu-item c-pointer font-Lato fs-13", 
            text: "Delete",
            "onclick": '', 
          }))
        );
    }
    
		fStructure(pclass, fn, fsname, caret, actionpill);			
	}
	
  function FnNewFolder(){
		if($('#foldername').val() === '') return;
		var name = $('#foldername').val();
		var fn = name;
		fn = fn.split(' ').map(function (s, i) {
			return i && s.length ? s.toLowerCase() : s.toLowerCase();
		}).join('-');
		var caret = '', pclass = 'subfolder ml-15';
    var actionpill = '';
		fStructure(pclass, fn, name, caret, actionpill);
		
		if($('#v-pills-'+fn+'-tab').length === 1 ){		
			$('.mbleft .nav-link.active').removeClass('active show');
			$('#v-pills-'+fn+'-tab').addClass('active show');
			$('#'+fn).addClass('active show');
		}
				
		$('.mbright .tab-content .tab-pane.active').removeClass('active show');	
		$('<div/>', {
			"class": 'tab-pane fade show active',
			"id": "v-pills-"+fn,
			"role": "tabpanel",
			"data-group": fn,
			"aria-labelledby": "v-pills-"+fn+"-tab"
		}).appendTo('.mbright .tab-content');
			
		$('.g-dialog-container.visible').remove();
	}
	
	function getProductName(producTypeId){
		 console.log(producTypeId);
		if(producTypeId !== ''){
			var product_item_url = media_base_url+'/termdata/'+producTypeId+'?_format=json';
      console.log(product_item_url);
			$.getJSON( product_item_url, function( dataitems ) {
				const promise1 = new Promise(function(resolve, reject) {
					resolve(dataitems);
				}).then(function(data) {
					 console.log(data);
					return folder = data[0].name;					
				})
			})
		}
		
	}
	
	function FnDefaultFolders(){
		var designDataArr = [];
		var existingfolder = [];
		var $output = [];
    design_id = getUrlDesignID();
		console.log('design_id'+design_id);
	  //getProductName(producTypeId);
		//console.log(folder);
    if(producTypeName !== '' && design_id === ''){
			FnFolderStructure(folder, 'primaryfolder', '');
		}
    var settings = {
			"url": access_check_api + "getfolder/" + uid,
			"method": "GET",
			"timeout": 0,
			"headers": {
				"Authorization": "bearercvc "+access_api_key,
			},
		}; 
     console.log('settings2');
       console.log(settings);
		$.ajax(settings).done(function (response) {
      var designData = response.data;
      console.log('designData');
       console.log(designData);
      for (var i = 0; i < designData.length; i++) {    
				getProductName(designData[i].type_tid);
				/* if(designData[i].folder_name != producTypeName && designData[i].template_group === 'subfolder'){ 
					if(designData[i].template_tid === producTypeName){ //check if subfolder of parentfolder is selected product then show the subfolders else not show
						if($.inArray(designData[i].folder_name, existingfolder.folder) === -1) existingfolder.push({designID: designData[i]._id, group: designData[i].template_group, folder: designData[i].folder_name});
					}
				} else  */
				if(design_id !== '' && design_id === designData[i]._id ){ 
					//console.log(folder);
					designDataArr.push({designID: designData[i]._id, group: designData[i].template_group, folder: folder});	
									
        }
      }   
      if(design_id !== '' ){
        //designDataArr.reverse();
        //console.log(designDataArr);
        $.each( designDataArr, function( dkey, dval ) {  
					FnFolderStructure(dval.folder, dval.group, dval.designID);    				
        })
      } /* else {
        existingfolder.reverse();
        console.log(existingfolder);
        $.each( existingfolder, function( ikey, iival ) {               
          FnFolderStructure(iival.folder, iival.group, iival.designID);        
        })
      } */
    })
    //if(producTypeName === ''){return;}
		
	}
	
  function FnGridview(){
		$('.fa-list-alt.icobg-active').removeClass('icobg-active');
		$('.fa-th').addClass('icobg-active');
    $('.tab-pane.fade').removeClass('flex-column'); 
    $('.tab-pane.fade').addClass('flex-row'); 
  }
	
	function FnListview(){
		$('.fa-th.icobg-active').removeClass('icobg-active');
		$('.fa-list-alt').addClass('icobg-active');
    $('.tab-pane.fade').removeClass('flex-row'); 
    $('.tab-pane.fade').addClass('flex-column'); 
  }
	
	function FnFileSorting(e){
		FnOverlay();
		$('.mbright .tab-content').html('');
		if($(e).hasClass('fa-sort-alpha-down')){
			$('.sorting').removeClass('fa-sort-alpha-down');
			$('.sorting').addClass('fa-sort-alpha-up'); 
			$('.sorting').attr('id', 'sorting-desc'); 
		}else {
			$('.sorting').removeClass('fa-sort-alpha-up');
			$('.sorting').addClass('fa-sort-alpha-down'); 
			$('.sorting').attr('id', 'sorting-asc'); 
		}
		FnGetTemplates(e.id);
  }
  
  function FnExpandModal(){
		if($('.save-template-container .modal-dialog').hasClass('w-100 h-100 ml-3')){
			$('.save-template-container .modal-dialog').removeClass('w-100 h-100 ml-3');
		} else {
			$('.save-template-container .modal-dialog').addClass('w-100 h-100 ml-3');
		}
	}
	
	function FilterBy(){
		var rows = $('.mbright .tab-content .tab-pane.active.show .template-grid');
		var rowsArr = $('.mbright .tab-content .tab-pane.active.show .template-grid').toArray();
		rowsArr = sortByTitle(rows);
		for (var i = 0; i < rowsArr.length; i++) {
			$('.mbright .tab-content .tab-pane.active.show').append(rowsArr[i]);
		}		
	}
	
	function sortByTitle(rows) {
		var filterText = $('#search-file').val().toLowerCase();
		if($('#search-file').val().length >= 2 || jQuery('#search-file').val().length == 0){
			rows.filter(function(a, b) {
				$(this).toggle($(this).children('.temp-name').text().toLowerCase().indexOf(filterText) > -1); 
				return rows;
			});
		}
		
		return rows;
	}
	
  function FnDismisModal(){
    $('#savemodal').modal('hide');
  }

  function DismisModal(id = ''){
    $('#'+id).modal('hide');
  }

  function FnDismisFolderModal(){
    $(".g-dialog-container.visible").remove();
  }
  
  function saveTemplateModalBox() {   
    var $elem = $('body div.save-template-container');
    $elem.append(
      $('<div/>', {'class': 'modal fade align-items-center', 'id': 'savemodal'}).append(
        $('<div/>', {'class': 'modal-dialog'}).append(
          $('<div/>', {'class': 'modal-content'}).append(
            $('<div/>', {'class': 'modal-header justify-content-end p0-5'})// color-e8e8e87a
          ).append(
            $('<div/>', {'class': 'modal-body m-0 p-0'})
          ).append(
          $('<div/>', {'class': 'modal-footer justify-content-center'})
          )
        )
      )
    );  
  }

  function saveAsTemplateModalBox() {   
    var $elem = $('body div.save-template-container');
    $elem.append(
      $('<div/>', {'class': 'modal fade align-items-center', 'id': 'saveasmodal'}).append(
        $('<div/>', {'class': 'modal-dialog nmodal-dialog'}).append(
          $('<div/>', {'class': 'modal-content'}).append(
            $('<div/>', {'class': 'modal-header justify-content-center'})// color-e8e8e87a
          ).append(
            $('<div/>', {'class': 'modal-body m-0 p-0'})
          ).append(
          $('<div/>', {'class': 'modal-footer justify-content-end'})
          )
        )
      )
    );
  }

  function saveAsTemplateModalBox() {   
    var $elem = $('body div.save-template-container');
    $elem.append(
      $('<div/>', {'class': 'modal fade align-items-center', 'id': 'saveasmodal'}).append(
        $('<div/>', {'class': 'modal-dialog nmodal-dialog'}).append(
          $('<div/>', {'class': 'modal-content'}).append(
            $('<div/>', {'class': 'modal-header justify-content-center'})// color-e8e8e87a
          ).append(
            $('<div/>', {'class': 'modal-body m-0 p-0'})
          ).append(
          $('<div/>', {'class': 'modal-footer justify-content-end'})
          )
        )
      )
    );
  }

  function saveAsConfirmationTemplateModalBox() {   
    var $elem = $('body div.save-template-container');
    $elem.append(
      $('<div/>', {'class': 'modal fade align-items-center', 'id': 'saveasconfirmationmodal'}).append(
        $('<div/>', {'class': 'modal-dialog nmodal-dialog'}).append(
          $('<div/>', {'class': 'modal-content'}).append(
            $('<div/>', {'class': 'modal-header justify-content-center'})
          ).append(
            $('<div/>', {'class': 'modal-body m-0 p-0'})
          ).append(
          $('<div/>', {'class': 'modal-footer bg-white justify-content-end'})
          )
        )
      )
    );
  }
	
	function saveTemplateContent(){
    var $hright = $("<div></div>").addClass("section login user").append(
			$('<img class="avatar" src="'+ avatar +'" alt='+ name +' title='+ name +'/>')			
		).append(
      $('<span/>', {
        "class": 'uemail font-Lato',
        "html": email,
      }),
    ).append(
      $('<i/>', {
        "class": "fa fa-expand faico pl-2 c-pointer",
        "onclick": "FnExpandModal()",
      }),
    ).append(
      $('<i/>', {
        "class": "fas fa-window-close fs-18 faico c-pointer",
        "onclick": "FnDismisModal()",
      }),
    );
    $('.save-template-container .modal-header').html($hright);
		
		if($('.mbtop').length === 0){
			var $mbtop = $('<div/>', {'class': 'mbtop d-flex position-relative pl-177'})
			/* .append($('<i/>', {
				"class": "fas fa-folder foldermtop",
			}))
      .append(
        $('<button/>', {'id': 'new-folder', 'onclick': "FnNewFolderModal()", 'class': 'btn text-uppercase w-200 btn-gray bg-gray fs-12 font-Lato', text: 'New Folder'}),
      ) */.append(
				$('<i/>', {
					"class": "fa fa-search fs-13 mt-8 h-100",
				}),
			).append(
				$('<span/>', {
					"class": "pipeline opacity-6 ml-2 mr-2",
				}),
			).append(
        $('<div/>'), {'class': 'd-flex flex-grow'})
				.append(
          $('<input/>', {'type': 'text', 'class': 'w-100 font-Lato fs-13 m-0 border-0', 'name': 'searchFile', 'id': 'search-file', 'placeholder': 'Search File', 'oninput': 'FilterBy()'})
        )
			.append(
				$('<i/>', {
					"class": "fas fa-th p-6 icobg bg-gray ml-3 icobg-active c-pointer",
					"onclick": "FnGridview()"
				}),
			).append(
				$('<i/>', {
					"class": "fas fa-list-alt icobg bg-gray p-6 ml-1 c-pointer",
					"onclick": "FnListview()"
				}),
			).append(
				$('<i/>', {
					"class": "fas fa-sort-alpha-down icobg bg-gray sorting p-6 ml-4 mr-3 c-pointer",
					"onclick": "FnFileSorting(this)"
				}),
			).insertAfter('.save-template-container .modal-header');
		}

		var $mbleft = $('<div/>', {
			"class": "mbleft w-200 wmin-200",
		}).append($('<div/>', {
			"class": "defaultfolder d-flex flex-column position-relative nav nav-pills",
			"id": "v-pills-tab",
			"role": "tablist",
			"aria-orientation": "vertical",})
		);
		
		var $mbspacer = $("<div></div>").addClass("mbspacer color-e8e8e87a pr-12");
		
		var $mbright = $("<div></div>").addClass("mbright d-flex w-100 p-12 overflow-auto").append($('<div/>', {"class": "tab-content w-100", "id": "v-pills-tabContent"}));
		
		var $mmiddle = $('<div/>', {'class': 'mbmid bg-white h-350 d-flex'})
      .append(
        $mbleft,
        $mbspacer,
        $mbright
      );
		$('.save-template-container .modal-body').html($mmiddle);
        
    FnDefaultFolders();
    FnGetTemplates('sorting-asc');
    
    var $mfooter = $('<ul/>', {'class': 'd-flex'})
      .append(
        $('<li/>').append(
					$('<label/>', {'text': 'Title', 'class': 'font-Lato fs-13'}),
					$('<span/>', {'text': '*', 'class': 'c-red mr-2'}),
          $('<input/>', {'type': 'text', 'class': 'dcreate-elem w-200 fs-13', 'name': 'templatename', 'id': 'template-name', 'value': ''})
        )
      )
      .append(
        $('<li/>').append(
          $('<button/>', {'id': 'cancel-name', 'onclick': "FnDismisModal()", 'class': 'btn btn-gray bg-gray font-Lato fs-15', text: 'Cancel'}),
          $('<button/>', {'id': 'save-template', 'onclick': 'kmdsToolSettingSave()', 'class': 'btn btn-primary font-Lato fs-15 text-capitalize', text: 'Save'})
        )
      );
		$('.save-template-container .modal-footer').html($mfooter);

	}

  function openSaveTemplateModal(){
    if($('.save-template-container').length === 0){
      $('body').append($('<div />', {'class': 'save-template-container'}));		
    }
    if($('#savemodal').length === 0){
      var modalb = new saveTemplateModalBox();
      $('.save-template-container').append(modalb);
    }
    saveTemplateContent();
    $('#savemodal').modal('show');
  }

  function saveAsTemplateContent(){
    var $hright = $("<div></div>").addClass("section login user").append(
			// $('<img class="avatar" src="'+ avatar +'" alt='+ name +' title='+ name +'/>')			
			$('<div class="modal-title"> Save Template As </div>')			
		);
    $('.save-template-container .modal-header').html($hright);		
    
    var $nmiddle = $('<div/>', {'class': 'p-3 text-center'})
      .append(
					$('<label/>', {'text': 'Name', 'class': 'font-Lato p-12'}),
					// $('<span/>', {'text': '*', 'class': 'c-red mr-2'}),
          $('<input/>', {'type': 'text', 'class': 'dcreate-elem w-350 fs-13', 'name': 'templatename', 'id': 'template-name', 'value': ''})
      
      ).append(		
			$('<div class="saveas-error" style="display: none;font-size: 14px;color:#880000;font-family: Lato, sans-serif;">The name field is required.</div>')			
		);
		
		var $mmiddle = $('<div/>', {'class': 'mbmid bg-white d-flex'})
		.append(
        $nmiddle
      );
		
		$('.save-template-container .modal-body').html($mmiddle);
     
    var $mfooter = $('<ul/>', {'class': 'd-flex'})
      .append(
          $('<li/>').append(
	          $('<button/>', {'id': 'cancel-name', 'onclick': "DismisModal('saveasmodal')", 'class': 'btn btn-cancel mr-2', text: 'Cancel'}),
	          $('<button/>', {'id': 'saveas-template', 'onclick': 'kmdsToolSettingSaveAs()', 'class': 'btn btn-primary', text: 'Save'})
	          //$('<button/>', {'id': 'cancel-name', 'onclick': "DismisModal('saveasmodal')", 'class': 'btn btn-gray bg-gray font-Lato fs-15', text: 'Cancel'}),
	          //$('<button/>', {'id': 'saveas-template', 'onclick': 'kmdsToolSettingSaveAs()', 'class': 'btn btn-primary font-Lato fs-15 text-capitalize', text: 'Save'})
        	)
      );
		$('.save-template-container .modal-footer').html($mfooter);
	}

  function openSaveAsTemplateModal(){
    if($('.save-template-container').length === 0){
      $('body').append($('<div />', {'class': 'save-template-container'}));		
    }
    if($('#saveasmodal').length === 0){
      var modalb = new saveAsTemplateModalBox();
      $('.save-template-container').append(modalb);
    }
    saveAsTemplateContent();
    $('#saveasmodal').modal('show');
  }

  function saveAsConfirmationTemplateContent(){
    var $hright = $("<div></div>").addClass("section login user").append(
      // $('<img class="avatar" src="'+ avatar +'" alt='+ name +' title='+ name +'/>')      
      $('<div class="modal-title"> SAVE TEMPLATE AS </div>')      
    );
    $('.save-template-container .modal-header').html($hright);    
    
    var $nmiddle = $('<div/>', {'class': 'p-3'})
      .append(   
      $('<div class="confirmation-body modal-message-area"><span>A new template has been saved as Inactive. To make it active:</span><ul><li>Complete any desired edits</li><li>Create a Preview image</li><li>Check the box: Make Template Active</li><li>Save</li></ul></div>'));
    
    var $mmiddle = $('<div/>', {'class': 'mbmid bg-white d-flex'})
    .append(
        $nmiddle
      );
    
    $('.save-template-container .modal-body').html($mmiddle);
     
    var $mfooter = $('<ul/>', {'class': 'd-flex'})
      .append(
          $('<li/>').append(
            $('<button/>', {'id': 'cancel-name', 'onclick': "DismisModal('saveasconfirmationmodal')", 'class': 'btn btn-primary', text: 'CLOSE'}),
          )
      );
    $('.save-template-container .modal-footer').html($mfooter);
  }

  function openSaveAsConfirmationTemplateModal(){
    if($('.save-con-template-container').length === 0){
      $('body').append($('<div />', {'class': 'save-con-template-container'}));   
    }
    if($('#saveasconfirmationmodal').length === 0){
      var modalb = new saveAsConfirmationTemplateModalBox();
      $('.save-con-template-container').append(modalb);
    }
    saveAsConfirmationTemplateContent();
    $('#saveasconfirmationmodal').modal('show');
  }


	
	function newDesignFromTemplate(e){
		var tempid = $(e).attr('data-design');
		//console.log(tempid);
		//create new template tab
		$('#header .tabs .tab.g-active').removeClass('g-active');
		$("<div></div>").addClass("tab g-active").append($("<span></span>").addClass("title c-pointer").attr('design', tempid).attr('producTypeId', producTypeId).attr('onclick', 'FntemplateSwitch(this)').append('Untitled*')).append($("<span/>", {'class': 'close c-pointer', 'designid': tempid, 'onclick': 'FntemplateClose(this)', 'html': '✕'})).appendTo('#header .tabs');
		var Docurl = window.location.href;
		var t = checkDesign();
		if(t === true){
			Docurl = Docurl.split('?')[0];
			window.history.pushState("object or string", 'title', Docurl );
		}
		document.title = 'Untitled | KaboodleMedia';
		getDesignData(tempid);
		FnDismisModal();
	}

	function kmdsToolTemplateDelete(design_id_d) {
    //for deleting the template
    var settings = {
      "url":access_check_api + "design/5ea927f83324995a357e61ec",
      "method": "DELETE",
      "timeout": 0,
      "headers": {
        "Authorization": "bearer " + API_KEY,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      "data": "5ea927f83324995a357e61ec"
    };
    $.ajax(settings).done(function (response) {
      //console.log(response);
      //alert('deleted');
    });
  }
  /********** Save Modal closed *************/
