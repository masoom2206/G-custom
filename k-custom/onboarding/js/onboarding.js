/**
 * @file
 * Attaches behaviors for the onboarding module.
 *
 */
(function ($, Drupal) {
  var initialized;
  Drupal.behaviors.dashboardBehavior = {
    attach: function (context, settings) {
      if (!initialized) {
				initialized = true;
				
				//hover on account dashboard buttons
				jQuery("#onboarding-grids .onboarding-item > a").mouseenter(function(){
					jQuery(this).children('.img-fluid.blue').addClass('d-none');
					jQuery(this).children('.img-fluid.hover').removeClass('d-none');
				}).mouseleave(function() {
					jQuery(this).children('.img-fluid.hover').addClass('d-none');
					jQuery(this).children('.img-fluid.blue').removeClass('d-none');
				});
				
				jQuery("#mark-completed").click(function(){
					jQuery(this).attr('disabled', 'disabled');
					jQuery(this).after('<div class="ajax-progress ajax-progress-throbber"><div class="throbber">&nbsp;</div></div>');
					var nid = jQuery(this).data("nid");
					var uid = jQuery(this).data("uid");
					jQuery.ajax({
						url: "/dashboard/mark-completed",
						data:{"uid":uid, "nid":nid},
						type: "POST",
						success:function(data){
              window.location.href = data;
						}
					});
				});
				
				function defaultoTop(){
					if(jQuery('#preset-table table tr').length){
						//var def = jQuery(e);
						var def = jQuery('#default-branding').parent().parent('tr');
						//var tr = jQuery("#preset-table table").find("tr:gt(1)");
						jQuery(def).prependTo('#preset-table table tbody');
					}
				}
				defaultoTop();
      }
    }
  };

})(jQuery, Drupal);
var uid = drupalSettings.uid;
jQuery(document).ready(function(){
  //Open modal window for professional user to upgrade profile
  jQuery(".professional-user-modal").click(function(e){
    e.preventDefault();
    kmModalWindow("This feature is available to Expert level users. You may upgrade now and use it for free until your next monthly billing date.");
    jQuery(".g-dialog-header").text("UPGRADE TODAY TO ACCESS THIS FEATURE");
    jQuery(".g-dialog-footer .btn-primary").addClass("upgrade-user");
    jQuery(".g-dialog-footer .btn-primary").text("Upgrade");
  });
  jQuery("#page").on('click','.close-modal',function (e) {
    if(jQuery(this).hasClass('upgrade-user')){
      jQuery(".g-dialog-container").remove();
      var redirect = '/tools/profile/'+uid+'/billing'
      window.location.replace(redirect);
    }
    else{
      jQuery(".g-dialog-container").remove();
    }
  });
});

/* jQuery(document).ready(function(){
	if(jQuery('#preset-table table tr').length){
		//var def = jQuery(e);
		var def = jQuery('#default-branding').parent().parent('tr');
		//var tr = jQuery("#preset-table table").find("tr:gt(1)");
		jQuery(def).prependTo('#preset-table table tbody');
	}
}); */

function upgradeMessage(e){
	//var info_url = jQuery(e).parent().find('.moreinfo').text(); //disabled Task#6107
	var info_url = '/plans';
	var msg = jQuery(e).parent().find('.thumb-msg').html();
	jQuery('#functional-modal .modal-header .modal-title').text('');
	jQuery('#functional-modal .modal-footer #upgrade-btn').addClass('d-none');
	jQuery('#functional-modal .modal-footer #info-btn').addClass('d-none');
	jQuery('#functional-modal .modal-footer #comparison-btn').removeClass('d-none');
	jQuery('#functional-modal .modal-footer #confirm-btn').addClass('d-none');
	jQuery('#functional-modal .modal-footer #btn-cancel').removeClass('btn-cancel');
	jQuery('#functional-modal .modal-footer #btn-cancel').addClass('btn-primary');
	jQuery('#functional-modal .modal-footer #btn-cancel').text('Close');
	jQuery('#functional-modal .modal-body').html(msg);
	jQuery('#functional-modal .modal-footer .more-info').attr('href', info_url);
}
function deleteKaboodleMessage(e){
	var uid = jQuery(e).attr('uid');
	var nid = jQuery(e).attr('nid');
	var msg = 'Are you sure you want to archive this Kaboodle?';
	jQuery('#functional-modal .modal-header .modal-title').text('');
	jQuery('#functional-modal .modal-footer #upgrade-btn').addClass('d-none');
	jQuery('#functional-modal .modal-footer #info-btn').addClass('d-none');
	jQuery('#functional-modal .modal-footer #comparison-btn').addClass('d-none');
	jQuery('#functional-modal .modal-footer #confirm-btn').removeClass('d-none');
	jQuery('#functional-modal .modal-footer #btn-cancel').removeClass('btn-primary');
	jQuery('#functional-modal .modal-footer #btn-cancel').addClass('btn-cancel');
	jQuery('#functional-modal .modal-footer #btn-cancel').text('Cancel');
	jQuery('#functional-modal .modal-footer #confirm-btn').attr('href', '/kaboodle/archive/'+uid+'/'+nid);
	
	jQuery('#functional-modal .modal-body').html(msg);
}
function deletePresetMessage(e){
	var uid = jQuery(e).attr('uid');
	var nid = jQuery(e).attr('nid');
	var type = jQuery(e).attr('type');
	var msg = 'Are you sure you want to delete this '+type+' preset? This action may not be undone.';
	jQuery('#functional-modal .modal-header .modal-title').text('');
	jQuery('#functional-modal .modal-footer #upgrade-btn').addClass('d-none');
	jQuery('#functional-modal .modal-footer #info-btn').addClass('d-none');
	jQuery('#functional-modal .modal-footer #comparison-btn').addClass('d-none');
	jQuery('#functional-modal .modal-footer #confirm-btn').removeClass('d-none');
	jQuery('#functional-modal .modal-footer #btn-cancel').removeClass('btn-primary');
	jQuery('#functional-modal .modal-footer #btn-cancel').addClass('btn-cancel');
	jQuery('#functional-modal .modal-footer #btn-cancel').text('Cancel');
	jQuery('#functional-modal .modal-footer #confirm-btn').attr('href', '/preset/delete/'+uid+'/'+nid);
	
	jQuery('#functional-modal .modal-body').html(msg);
}
function newPreset(e){
	//var type = jQuery(e).attr('type');
	var msg = '<div id="preset-choice" class="radioascheckbox"><ul><li class="d-flex"><input type="radio" onchange="presetSelection(this)" name="preset-opt" id="branding-option" class="radioascheckbox mt-1 mr-2" value="branding_preset"/><label for="branding-option"><span>&nbsp;</span>Branding preset</label></li><li class="d-flex"><input type="radio" onchange="presetSelection(this)" name="preset-opt" id="metadata-option" class="radioascheckbox mt-1 mr-2" value="metadata_preset"/><label  for="metadata-option"><span>&nbsp;</span>Metadata preset</label></li></ul></div>';
	jQuery('#functional-modal .modal-header .modal-title').text('Create Preset');
	jQuery('#functional-modal .modal-header').addClass('d-flex justify-content-center');
	jQuery('#functional-modal .modal-footer #upgrade-btn').addClass('d-none');
	jQuery('#functional-modal .modal-footer #info-btn').addClass('d-none');
	jQuery('#functional-modal .modal-footer #comparison-btn').addClass('d-none');
	jQuery('#functional-modal .modal-footer #confirm-btn').removeClass('d-none');
	jQuery('#functional-modal .modal-footer #confirm-btn').text('Create');
	jQuery('#functional-modal .modal-footer #btn-cancel').removeClass('btn-primary');
	jQuery('#functional-modal .modal-footer #btn-cancel').addClass('btn-cancel');
	jQuery('#functional-modal .modal-footer #btn-cancel').text('Cancel');
	jQuery('#functional-modal .modal-footer #confirm-btn').addClass('disabled');
	
	jQuery('#functional-modal .modal-body').html(msg);
}
var currentValue = 0;
function presetSelection(e){
	currentValue = e.value;
	jQuery('#functional-modal .modal-footer #confirm-btn').attr('href', '/tools/'+currentValue+'/add');
	jQuery('#functional-modal .modal-footer #confirm-btn').removeClass('disabled');
}
function deleteNotificationMessage(e){
	var uid = jQuery(e).attr('uid');
	var not_id = jQuery(e).attr('not_id');
	var msg = 'Are you sure you wish to delete this notification? This cannot be undone.';
	jQuery('#notification-modal .modal-header .modal-title').text('');
	jQuery('#notification-modal .modal-footer #confirm-btn').removeClass('d-none');
	jQuery('#notification-modal .modal-footer #btn-cancel').removeClass('btn-primary');
	jQuery('#notification-modal .modal-footer #btn-cancel').addClass('btn-cancel');
	jQuery('#notification-modal .modal-footer #btn-cancel').text('Cancel');
	jQuery('#notification-modal .modal-footer #confirm-btn').attr('href', '/notification/delete/'+uid+'/'+not_id+'/true');
	
	jQuery('#notification-modal .modal-body').html(msg);
}

function viewNotificationMessage(e){
	var msg = jQuery(e).attr('aria-label');
	jQuery('#notification-modal .modal-header .modal-title').text('');
	jQuery('#notification-modal .modal-footer #confirm-btn').addClass('d-none');
	jQuery('#notification-modal .modal-footer #btn-cancel').removeClass('btn-cancel');
	jQuery('#notification-modal .modal-footer #btn-cancel').addClass('btn-primary');
	jQuery('#notification-modal .modal-footer #btn-cancel').text('Close');
	jQuery('#notification-modal .modal-body').html(msg);
}
function sortColumn(e, type){
	var f_sl = 1;
	var t = e;
	var tid = jQuery(t).closest('table').parent().parent().attr('id');
  var sortColumn = parseInt(arguments[0]);
	const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
	const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
		v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
		)(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
    var index = jQuery(t).index();
	jQuery('#'+tid+' thead tr th').removeClass('bg-sort');
	jQuery('#'+tid+' thead tr th').removeClass('asc-icon');
	jQuery('#'+tid+'e thead tr th').removeClass('desc-icon');
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
		jQuery(t).removeClass("desc-icon");
		jQuery(t).addClass("asc-icon");
		jQuery(t).addClass("bg-sort");
		sortTable(tid, 'ASC', type,index);
	}
	Array.from(jQuery(t).closest('table tbody tr'))
		.sort(comparer(Array.from(jQuery(t).parent().children()).indexOf(t), t.asc = !t.asc))
		.forEach(tr => jQuery(t).closest('table').append(tr) );

	//adding class to sorted column
	jQuery('#'+tid+' td').removeClass('sorted');
	var ind = jQuery(t).index() + 1;
	jQuery('#'+tid+' td:nth-child('+ind+')').addClass('sorted');
	if(tid == 'preset-table'){
		var def = jQuery('#default-branding').parent().parent('tr');
		jQuery(def).prependTo('#preset-table table tbody');	
	}
	/*f_sl *= -1;
  var n = jQuery(e).prevAll().length;
  sortTable(tid, f_sl,n); */
}
function sortTable(tid, order, type, index) {
   
  //Get and set order
  //Use -data to store wheater it will be sorted ascending or descending
  //var order = $('#'+tid+' .table thead tr>th:eq(' + column + ')').data('order');
  //order = order === 'ASC' ? 'DESC' : 'ASC';
  jQuery('#'+tid+' .table thead tr > th').data('order', order);
   
  //Sort the table
  jQuery('#'+tid+' .table tbody tr').sort(function(a, b) {
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
				a = jQuery(a).find('td').attr('datetime');
				b = jQuery(b).find('td').attr('datetime');
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

  }).appendTo('#'+tid+' .table tbody');
}
/**
 * Callback function kmModalWindow()
 * to display KM modal window
 **/
function kmModalWindow($message){
  jQuery('<div/>', {"class": "g-dialog-container d-block justify-content-center align-items-center visible"})
    .append(jQuery('<div/>', {"class": "g-dialog p-0"})
      .append(jQuery('<div/>', {"class": "g-dialog-header p-27"}))
      .append(jQuery('<div/>', {"class": "g-dialog-content gray-border-top-bottom"})
        .append(jQuery('<div/>', {"class": "d-grid"})
          .append(jQuery('<span/>', {"class": "d-block p-15", "html": $message}))
        )
      )
      .append(jQuery('<div/>', {"class": "g-dialog-footer text-right p-2"})
        .append(jQuery('<a/>', {'class': 'close-modal btn btn-cancel mr-2', 'href': 'javascript:void(0);', text: 'Cancel'}))
        .append(jQuery('<a/>', {'class': 'close-modal btn btn-primary font-fjalla', 'href': 'javascript:void(0);', text: 'Ok'}))
      )
    ).appendTo('#page');
}