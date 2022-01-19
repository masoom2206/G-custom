/**
 
 * @file
 * Attaches behaviors for the social_media module.
 *
 */
(function ($, Drupal) {
  var initialized;
  Drupal.behaviors.social_media_instagram = {
    attach: function (context, settings) {
      if (!initialized) {
		initialized = true;
        var path_userid = drupalSettings.path_userid;
		 var calendarData = drupalSettings.calendarData;
       // console.log(calendarData);
        var events = calendarData['events'];
		console.log(events);
        var userName = calendarData['UserName'];
		
		
		 //console.log('initialize calendaea');		
	      
    //--------------------------------------------------------initialize full Calendar----------------------------------------------------------------
        if ( jQuery("div").is("#nav-calendar") ) {
          jQuery('#calendar').fullCalendar({
            customButtons: {
            customUser:{
                text: userName,
                },
            startWeek: {
              text: ' ',
              click: function() {
                  jQuery('.week-start-on').toggleClass('hidden');
                  jQuery('.week-start-on input').each(function(){
                   jQuery(this).click(function(){
                    //calendar.setOption('firstDay', parseInt(jQuery(this).val()));
                    jQuery('#calendar').fullCalendar('option', 'firstDay', jQuery(this).val());
                   });
               });
                
              }
            }
       },
        header: {
            left: 'customUser',
            right: 'today,title,prev,next,startWeek'
        },
        firstDay: 0,
        columnHeaderHtml: function(mom) {
                var count_post = 0;
                var date = '2020-03-12';
                $('#calendar').fullCalendar('clientEvents', function(event) {
                    var start = moment(event.start).format("YYYY-MM-DD");
                    if(mom.format() == start)
                    {
                      count_post++;
                    }                    
                });
				if(count_post == 0){
				  var background_color_style = 'background-color:transparent';
				}else{
				  var background_color_style = 'background-color:#fff';
				}      
                if (mom.days() === 5) {
                  return '<div class="custom-day-formate"><span class="day">Friday</span><span class="count-post"><div style='+background_color_style+'>'+count_post+'</div></span></div><div class="custom-Day">'+mom.date()+'</div>';
                }
                else if(mom.days() === 4){
                 return '<div class="custom-day-formate"><span class="day">Thursday</span><span class="count-post"><div style='+background_color_style+'>'+count_post+'</div></span></div><div class="custom-Day">'+mom.date()+'</div>';
                }
                else if(mom.days() === 3){
                return '<div class="custom-day-formate"><span class="day">Wednesday</span><span class="count-post"><div style='+background_color_style+'>'+count_post+'</div></span></div><div class="custom-Day">'+mom.date()+'</div>';
                }
                else if(mom.days() === 2){
                return '<div class="custom-day-formate"><span class="day">Tuesday</span><span class="count-post"><div style='+background_color_style+'>'+count_post+'</div></span></div><div class="custom-Day">'+mom.date()+'</div>';
               }
               else if(mom.days() === 1){
                return '<div class="custom-day-formate"><span class="day">Monday</span><span class="count-post"><div style='+background_color_style+'>'+count_post+'</div></span></div><div class="custom-Day">'+mom.date()+'</div>';
              } 
              else if(mom.days() === 0){
                return '<div class="custom-day-formate"><span class="day">Sunday</span><span class="count-post"><div style='+background_color_style+'>'+count_post+'</div></span></div><div class="custom-Day">'+mom.date()+'</div>';
             }      

            else {
                return '<div class="custom-day-formate"><span class="day">Saturday</span><span class="count-post"><div style='+background_color_style+'>'+count_post+'</div></span></div><div class="custom-Day">'+mom.date()+'</div>';
            }
        },

      
        defaultView: 'agendaWeek',
        navLinks: false, // can click day/week names to navigate views
        allDaySlot:false,
        timezone:'UTC',
        events: events,
      
        eventRender: function(event, element) {
			console.log(event);
			element.find(".fc-title").remove();
			var currenttime = element.find(".fc-time").data('full').split(":");
			var am_pm = currenttime[1].split(" ");
			element.addClass('class-'+ currenttime[0] +am_pm[1]);
			if(event.is_published == 0){
				//active post 
				var current_class = "active-post";
				if(jQuery('.calendar-modals').find(modal_name).length == 0){
			   var custom_modal = '<div class="modal fade" id="delete-post-modal-cal-'+event.post_id+'" role="dialog" aria-hidden="true">'
					 custom_modal += '<div class="modal-dialog" role="document">'
					 custom_modal += '<div class="modal-content">'
					 custom_modal += '<div class="modal-body">Deleting this post will also remove it from the scheduler. As a result it will not be sent to '+event.socialMediaName + '. This action may not be undone.</div>'
					 custom_modal += '<div class="modal-footer">'
					 custom_modal += '<button type="button" class="btn btn-cancel" data-dismiss="modal">Cancel</button>'
					 custom_modal += '<div class="d-none current-post-id-to-delete">'+event.post_id +'</div>'
					 custom_modal += '<a href="" class="btn btn-primary confirm-delete">Okay</a>'
					 custom_modal += '</div></div></div></div>';
					 jQuery('#nav-calendar .calendar-modals').append(custom_modal);
			}
			}
			else{
				//in-active post
				var current_class = "in-active-post";
			}
			var edit_class = "fa remove-fa-edit "+current_class;
			var clone_class = "fa fa-plus-square ";
			var delete_class = "fa fa-trash "+current_class;
				
				
			var defaultClass= 'class-'+ currenttime[0] +am_pm[1];
			var socialMediaIcon =  event.socialMediaName.toLowerCase()+'.png';
			var modal_name = "#delete-post-modal-cal-"+event.post_id;
			
			var custom_event = '<div class="wrap '+defaultClass+'">'
			    custom_event +=  '<div class="fc-content-new '+defaultClass+'">'
				custom_event += '<img alt="icon" src="/modules/custom/social_media/images/'+socialMediaIcon+'" width="15px">'
				custom_event += '<span class="fc-title">'+event.socialMediaName + '</span><br>'
				custom_event += '<span class="fc-time-new" data-start="' + event.formatedTime + '" data-full="' + event.formatedTime + '">'+event.formatedTime+' - '+event.title+'</span>'
				custom_event += '</div>'
				custom_event += '<div class="updatepost '+defaultClass+'" style="display:none">'
				custom_event += '<div class="post-id" style = "display:none">'+event.post_id +'</div>'
				custom_event += '<div class="wrap-post-operation d-flex">'
				custom_event += '<div class="update-items update-edit"><a class="'+edit_class+'"></a></div>'
				custom_event += '<div class="update-items update-clone"><a class="'+clone_class+'"></a></div>'
				custom_event += '<div class="update-items update-delete">'
				custom_event += '<button class="'+current_class+'" id="delete-post" data-toggle="modal" data-target="'+modal_name+'" style="display:inline;border:none;background: transparent;"><a class="'+delete_class+'"></a></button>'
				custom_event += '</div>'
				custom_event += '</div>'
				custom_event += '</div>'
				custom_event += '<div class="updatepost-original '+defaultClass+'" style="display:none">'
				custom_event += '<div class="post-id" style = "display:none">'+event.post_id +'</div>'
				custom_event += '<div class="wrap-post-operation d-flex">'
				custom_event += '<div class="update-items update-edit"><a class="'+edit_class+'"></a></div>'
				custom_event += '<div class="update-items update-clone"><a class="'+clone_class+'"></a></div>'
				custom_event += '<div class="update-items update-delete">'
				custom_event += '<button class="'+current_class+'" id="delete-post" data-toggle="modal" data-target="'+modal_name+'" style="display: inline;border: none;background: transparent;"><a class="'+delete_class+'"></a></button>'
				custom_event += '</div>'
				custom_event += '</div>'
				custom_event += '</div>'
				custom_event += '</div>';
				var a = '<div>'+event.title+'</div>';
			
			element.find(".fc-content").append(custom_event);
			
			
			
			
        },
        eventClick: function(calEvent, jsEvent, view) {
		    $(this).find('.wrap .fc-content-new').click(function(){
				$('.fc-event-container').children().css('border-left', '3px solid gray');
				$('.fc-event-container').children().removeClass('active-class');
				var classList = jQuery(this).attr('class').split(/\s+/);
					classList.forEach(function(item) {
					  if(item.indexOf('class') != -1){
						  lastclass = item;
					  }
					}); 
			    $(this).parents(".fc-event-container").children('.'+lastclass).each(function() {
				
			       $(this).css('border-left', '3px solid #fe5b03');
				   $(this).addClass('active-class');
				   /*$('.fc-event-container').children().not(this).css('border-left', '3px solid gray');*/
			    });
				 
			    $(this).parents(".fc-event-container").children('.'+lastclass).last().find(".updatepost").html($(this).parents(".wrap").find('.updatepost-original').html());
			    $(this).css('border', '2px solid #fe5b03');
			    $("a.fc-event .fc-content-new ").not(this).css('border', 'none');
		    });
       
			jQuery('#nav-calendar .calendar-modals .confirm-delete').click(function(event){
				event.preventDefault();
				var post_id = jQuery(this).prev().text();
			    createDeletePost(post_id, calendar);
			});
			$(this).find('.updatepost a.fa-plus-square').click(function(event){
			 event.preventDefault();
			 
			 var post_id = $(this).parents('.updatepost').find('.post-id').text();
		     createClonePost(post_id);
			
			 ///alert('Do you want to clone this post');
		   });
			$(this).find('.updatepost .remove-fa-edit.active-post').click(function(event){
			  event.preventDefault();
			  var post_id = $(this).parents('.updatepost').find('.post-id').text();
			  jQuery('#nav-myposts-tab').trigger('click');
			  createEditPost(post_id);
			});
     
        },
        eventAfterAllRender: function() {
			jQuery("td .fc-content-col").each(function(){
			  jQuery(this).find(".fc-event-container a.custom-event").each(function(){
				   var classList = jQuery(this).attr('class').split(/\s+/);
				   classList.forEach(function(item) {
					  if(item.indexOf('class') != -1){
						  lastclass = item;
					}
					});
				   jQuery(this).parents(".fc-event-container").children('.'+lastclass).last().find(".updatepost").css('display','block');
				   jQuery(this).parents(".fc-event-container").children('.'+lastclass).last().addClass('last-node-post');

			  });

		   }); 
            // define static values
            var defaultItemHeight = 55;
            var defaultEventItemHeight = 45;
            // find all rows and define a function to select one row with an specific time
            var rows = [];
            $('div.fc-slats > table > tbody > tr[data-time]').each(function() {
                rows.push($(this));
            });
            var rowIndex = 0;
            var getRowElement = function(time) {
                while (rowIndex < rows.length && moment(rows[rowIndex].attr('data-time'), ['HH:mm:ss']) <= time) {
                    rowIndex++;
                }
                var selectedIndex = rowIndex - 1;
                return selectedIndex >= 0 ? rows[selectedIndex] : null;
            };

            // reorder events items position and increment row height when is necessary
            $('div.fc-content-col > div.fc-event-container').each(function() { // for-each week column
                var accumulator = 0;
                var previousRowElement = null;

                $(this).find('> a.fc-time-grid-event.fc-v-event.fc-event.fc-start.fc-end').each(function() { // for-each event on week column
                    // select the current event time and its row
                    var currentEventTime = moment($(this).find('> div.fc-content > div.fc-time').attr('data-full'), ['h:mm A']);
                    var currentEventRowElement = getRowElement(currentEventTime);

         
                    // the current row has to more than one item
                    if (currentEventRowElement === previousRowElement) {
						
                        accumulator++;

                        // move down the event (with margin-top prop. IT HAS TO BE THAT PROPERTY TO AVOID CONFLICTS WITH FullCalendar BEHAVIOR)
                        $(this).css('margin-top', '+=' + (accumulator * defaultEventItemHeight).toString() + 'px');

                        // increse the heigth of current row if it overcome its current max-items
                        var maxItemsOnRow = currentEventRowElement.attr('data-max-items') || 1;
						
						
                        if (accumulator >= maxItemsOnRow) {
                            currentEventRowElement.attr('data-max-items', accumulator + 1);
                            currentEventRowElement.css('height', '+=' + defaultItemHeight.toString() + 'px');
                        }
                    } 
					
					else if(previousRowElement == null  ){
						currentEventRowElement.attr('data-max-items',1);
					    rowIndex = 0;
                        accumulator = 0;
					}
					
					else {
                        // reset count

                        rowIndex = 0;
                        accumulator = 0;
                        //currentEventRowElement.css('height', '65px');
                        
                    }
                      

                    // set default styles for event item and update previosRow
                    $(this).css('left', '0');
                    $(this).css('right', '7px');
                    $(this).css('height', defaultEventItemHeight.toString() + 'px');
                    $(this).css('margin-right', '0');
                    previousRowElement = currentEventRowElement;
                });
            });
			
			jQuery(".fc-slats tbody tr").each(function(){

				if(jQuery(this).data('max-items') > 1){
				  var current_row_height = jQuery(this).css('height').split('px');
				  jQuery(this).css('height',parseInt(current_row_height[0])+24+'px');
				}
				else if(jQuery(this).data('max-items') == 1){
				  var current_row_height = jQuery(this).css('height').split('px');
				  jQuery(this).css('height',parseInt(current_row_height[0])+30+'px');
				}
			});

            // this is used for re-paint the calendar
            $('#calendar').fullCalendar('option', 'aspectRatio', $('#calendar').fullCalendar('option', 'aspectRatio'));
        }
            
    });
	jQuery("body").on('click', '#nav-calendar-tab', function(e) {
		      setTimeout(function(){
				  //jQuery(".week-start-on-wrap input:radio:first").prop("checked", true).trigger("click");

				  jQuery(window).trigger('resize') }, 500);
    });
                 
    }
         // console.log('calendar fine');
    //--------------------------------------------------------------End initialize full Calendar------------------------------------------------------------ 
        
    
		
		
		
		
	  }
       
    }
    
    
  };

  

})(jQuery, Drupal);


