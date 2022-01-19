jQuery(document).ready(function() {
  // jQuery UI Dialog    
  jQuery("div#status-dialog").dialog({
    autoOpen: false,
    width: 500,
    modal: true,
    resizable: false,
  });
  
jQuery('.table thead tr th a').contents().unwrap();
	
	/* jQuery('#groups-teams .mk-share').click(function(e) {
		var cuid = jQuery(this).attr('uid');
		var team = jQuery(this).attr('team');
		var uid_from_url = jQuery(this).attr('user');
		var team_name = jQuery(this).attr('team_name');
    currentUserKits(cuid, team, uid_from_url);
  }); */
  
  jQuery('table#groups-teams td a.dialog, table#group-membership td a.dialog').click(function(e){
    e.preventDefault();
    var href = jQuery(this).attr('href');
    var msg = jQuery(this).attr('msg');
    jQuery('#status-d-content').html(msg);
    jQuery("div#status-dialog").dialog( "option", "buttons", {  
      "Cancel": function() { jQuery(this).dialog("close"); },
      "Ok": function() { window.location.href = href; },
    });
    jQuery("div#status-dialog").dialog('open');
  });
  
  jQuery('body.path-my-account li.nav-link > a.btn').click(function(e){
    var uid = 0;
    var administrator = 0;
    var participate_in_teams = 0;
    var personal_contact_form = 0;
    jQuery.ajax({
      url: "/team/participate",
      async: false,
      dataType: 'json',
      success:function(response){
        uid = response.uid;
        administrator = response.administrator;
        participate_in_teams = response.participate_in_teams;
        personal_contact_form = response.personal_contact_form;
      }
    });
    
    if(participate_in_teams == 0 || personal_contact_form == 0){
      e.preventDefault();
      jQuery('#status-d-content').html('The "Participate in Teams" and "Personal contact form" checkboxes on your Profile must be selected in order to add a Team.');
      jQuery("div#status-dialog").dialog( "option", "buttons", {
        "Ok": function() { jQuery(this).dialog("close"); },
        "My Account": function() {
          if(administrator == 1){
            window.location.href = '/tools/profile/'+uid+'?destination=/admin/people';
          }else{
            window.location.href = '/my-account';
          }
        }, 
      });
      jQuery("div#status-dialog").dialog('open');
    }
  });
});

function sortColumn(e, type){
	var f_sl = 1;
	var t = e;
	var tid = 'table';
	const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
	const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
		v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
		)(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
		var index = jQuery(t).index();
	jQuery('.table thead tr th').removeClass('bg-sort');
	jQuery('.table thead tr th').removeClass('asc-icon');
	jQuery('.table thead tr th').removeClass('desc-icon');
	if(t.asc){
		jQuery(t).removeClass("asc-icon");
		jQuery(t).addClass("desc-icon");
		jQuery(t).addClass("bg-sort");
		sortTable(tid, 'DESC', type, index);
	}else if(!t.asc){
		jQuery(t).removeClass("desc-icon");
		jQuery(t).addClass("asc-icon");
		jQuery(t).addClass("bg-sort");
		sortTable(tid, 'ASC', type, index);
	}else{
		/* jQuery(t).removeClass("desc-icon");
		jQuery(t).addClass("asc-icon");
		jQuery(t).addClass("bg-sort"); */
		jQuery(t).removeClass("asc-icon");
		jQuery(t).addClass("desc-icon");
		jQuery(t).addClass("bg-sort");
		sortTable(tid, 'ASC', type, index);
	}
	Array.from(jQuery(t).closest('table tbody tr'))
		.sort(comparer(Array.from(jQuery(t).parent().children()).indexOf(t), t.asc = !t.asc))
		.forEach(tr => jQuery(t).closest('table').append(tr) );

	//adding class to sorted column
	jQuery('.table td').removeClass('sorted');
	var ind = jQuery(t).index() + 1;
	jQuery('.table td:nth-child('+ind+')').addClass('sorted');
}
function sortTable(tid, order, type, index) {
	 
	//Get and set order
	//Use -data to store wheater it will be sorted ascending or descending
	//var order = $('#'+tid+' .table thead tr>th:eq(' + column + ')').data('order');
	//order = order === 'ASC' ? 'DESC' : 'ASC';
	jQuery('.'+tid+' thead tr > th').data('order', order);
	 
	//Sort the table
	jQuery('.'+tid+' tbody tr').sort(function(a, b) {
	//                                 ^  ^
	//                                 |  | 
	//        The 2 parameters needed to be compared. 
	//        Since you are sorting rows, a and b are <tr>                                 

		//Find the <td> using the column number and get the text value.
		//Now, the a and b are the text of the <td>
		a = jQuery(a).find('td').eq(index).text();
		b = jQuery(b).find('td').eq(index).text();
	 // c = jQuery(this).getElementsByTagName("TD")[index];
		switch (type) {
			case 'text':
				//Proper way to compare text in js is using localeCompare
				//If order is ascending you can - a.localeCompare(b)
				//If order is descending you can - b.localeCompare(a);
				return order === 'ASC' ? a.localeCompare(b) : b.localeCompare(a);
				break;
			case 'number':
				//a = jQuery(a).find('td').eq(index).text();
				//b = jQuery(b).find('td').eq(index).text();
				//You can use deduct to compare if number.
				//If order is ascending you can -> a - b. 
				//Which means if a is bigger. It will return a positive number. b will be positioned first
				//If b is bigger, it will return a negative number. a will be positioned first
				return order === 'ASC' ? a - b : b - a;
				break;
			case 'date':
				/*var dateFormat = function(dt) {
					[m, d, y] = dt.split('-');
					return [y, m - 1, d];
				}*/
				 a = a.split('-');
				 b = b.split('-');
				 year =  a[2].split(" ");
				 time1 = year[2];
				 total_time1 = year[1].split(":");
				 hour1 = total_time1[0];
				 minutes1 = total_time1[1];
				 if(time1 == 'pm'){
					 hour1 = 12+parseInt(hour1);
				}
				 year2 = b[2].split(" ");
				 time2 = year2[2];
				 total_time2 = year2[1].split(":");
				 hour2 = total_time2[0];
				 minutes2 = total_time2[1];
				 if(time2 == 'pm'){
					 hour2 = 12+parseInt(hour2);
				}
				 a = new Date(year[0], a[0], a[1], hour1, minutes1);
				 b = new Date(year2[0], b[0], b[1], hour2, minutes2);
				//You can use getTime() to convert the date object into numbers. 
				//getTime() method returns the number of milliseconds between midnight of January 1, 1970
				//So since a and b are numbers now, you can use the same process if the type is number. Just deduct the values.
				return order === 'ASC' ? a - b : b - a;
				break;
		}

	}).appendTo('.table tbody');
}

/* Get all current user kits */
function currentUserKits(e){
	var cuid = jQuery(e).attr('uid');
	var team = jQuery(e).attr('team');
	var uid_from_url = jQuery(e).attr('user');
	var shared_teams = jQuery(e).attr('shared_teams');
	shared_teams = shared_teams.split('-');
	var team_name = jQuery(e).attr('team_name');
	var i_checked = '';
	jQuery('#on-boarding .modal-header .modal-title').text('Share Media Kit(S)');
	jQuery('#on-boarding .modal-header span').text('Team Name: '+team_name);
	jQuery('#on-boarding .modal-header').addClass('d-flex flex-column align-items-center');
	jQuery('#on-boarding .modal-body').html('<div id="user-kits" class="radioascheckbox"><ul style="    height: 165px;overflow-y: auto;"></ul></div>');
	$elem = jQuery('#on-boarding .modal-body #user-kits ul');
	jQuery.getJSON( '/user/media_kits/'+cuid, function( result ) {
		result.sort((a, b) => a.title.localeCompare(b.title));
		jQuery.each(result, function(key, val) {
			var i_checked = check_shared_kits(shared_teams, val.nid);
			if(i_checked){
				$elem.append(
					jQuery("<li/>", {"class": "d-flex align-items-center"}).append(
						jQuery("<input/>", {/* 'onchange': 'kit_selection()',  */'checked': 'checked', 'type': 'checkbox', 'id': val.nid+'-opt', 'class': 'radioascheckbox mr-2', 'value': val.nid}),
						jQuery("<label/>", {'class': 'margin-0', 'for': val.nid+'-opt', text: val.title}),
					)
				);
			} else {
				$elem.append(
					jQuery("<li/>", {"class": "d-flex align-items-center"}).append(
						jQuery("<input/>", {/* 'onchange': 'kit_selection()',  */'type': 'checkbox', 'id': val.nid+'-opt', 'class': 'radioascheckbox mr-2', 'value': val.nid}),
						jQuery("<label/>", {'class': 'margin-0', 'for': val.nid+'-opt', text: val.title}),
					)
				);
			}
		});
	});
	jQuery('#on-boarding .modal-footer').html('<button data-dismiss="modal" type="button" class="btn btn-cancel">Cancel</button><button onclick="shareSelectedKits()" data-team='+team+' data-uid= '+uid_from_url+' id="share-btn" class="btn btn-primary">Share</button>');
	/* if(jQuery('#user-kits input:checked').length){
	} else {
		jQuery('#on-boarding .modal-footer').html('<button data-dismiss="modal" type="button" class="btn btn-cancel">Cancel</button><button onclick="shareSelectedKits()" data-team='+team+' data-uid= '+uid_from_url+' id="share-btn" class="btn btn-primary disabled">Share</button>');
	} */
}

function check_shared_kits(shared_teams_arr, kitid){
	var i_checked = false;
	for(var i = 0, len = shared_teams_arr.length; i < len;i++){
		if(shared_teams_arr[i] == kitid){
			i_checked = true;
		}
	}
	return i_checked;
}

/* Enable share button upon checking kits */
function kit_selection(){
		
	//Create an Array.
	var selected = new Array();
	var user_kits = document.getElementById("user-kits");
	var chks = user_kits.getElementsByTagName("INPUT");
	for (var i = 0; i < chks.length; i++) {
		if (chks[i].checked) {
			selected.push(chks[i].value);
		}
	}

	if (selected.length > 0) {
		//console.log(selected);
		jQuery('#on-boarding .modal-footer #share-btn').removeClass('disabled');
	} else {
		//console.log(selected);
		jQuery('#on-boarding .modal-footer #share-btn').addClass('disabled');	
	}
}

/* Share button functionality */
function shareSelectedKits(){
	//Create an Array.
	var team_id = jQuery('#share-btn').attr('data-team');
	var user_id = jQuery('#share-btn').attr('data-uid');
	var un_checked_len = jQuery('#user-kits input:not(:checked)');
	//console.log(team_id);
	//console.log(user_id);
	if(team_id !== '' && user_id !== ''){
		var selected = new Array();
		var unselected = new Array();
		var user_kits = document.getElementById("user-kits");
		var chks = user_kits.getElementsByTagName("INPUT");
		for (var i = 0; i < chks.length; i++) {
			if (chks[i].checked) {
				selected.push(chks[i].value);
			}
		}
		if(un_checked_len.length){
			for (var i = 0; i < un_checked_len.length; i++) {
				unselected.push(un_checked_len[i].value);
			}
		}
		//console.log(unselected);

		if (selected.length > 0 || unselected.length > 0) {
			jQuery.ajax({
				url: '/team/share/media_kits',
				data:{"team_id": team_id, "user_id": user_id, "selected": selected, "unselected": unselected},
				type: "POST",
				success:function(data){
					console.log(data);
					if(data == 'done'){
						window.location.reload();
					}
				}
			});
		}
	}
}


