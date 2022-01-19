/**
 * @file
 * Attaches behaviors for the social_media module.
 *
 */
(function($, Drupal) {
  var initialized;
  Drupal.behaviors.social_media = {
    attach: function(context, settings) {
      if (!initialized) {
        initialized = true;
        var path_userid = drupalSettings.path_userid;
        var media_base_url = drupalSettings.media_base_url;
        var default_media_kit_id = drupalSettings.default_media_kit_id;
        var media_kit_url = media_base_url + "/node/" + default_media_kit_id + "?_format=json";
        var calendarData = drupalSettings.calendarData;
        var events = calendarData['events'];
        var userName = calendarData['UserName'];
        var social_media_name10 = drupalSettings.social_media_name10;
        var knowledge_base_article = drupalSettings.knowledge_base_article;
        var settings_field = drupalSettings.settings_field;
        // create standard modal dynamic
        function social_media_page_modal(ok_link, isCancel,isKnowledgebase, title, html_content) {
          var def = $.Deferred();
          var buttons = {};
          var modal_instance = '#Smp-general-modal';
          if (isCancel) {
               modal_instance = '#Smp-general-modal2'; 
            buttons['cancel'] = function() {
              jQuery(this).dialog("close");
              def.reject();
            };
          }
          if (isKnowledgebase) {
            buttons['search knowledge base'] = function () {
              //var knowledge_base_article = '/knowledgebase/social-media/twitter';
              window.open(knowledge_base_article.value, '_blank');
            };
          }          
          buttons['Ok'] = function() {
              jQuery(this).dialog("close");
              def.resolve();
            },
            jQuery(modal_instance).dialog({
              autoOpen: true,
              width: 500,
              // height: 200,
              modal: true,
              resizable: false,
              buttons: buttons,
              open: function(event, ui) {
                jQuery(modal_instance).dialog('option', 'title', title);
                jQuery(modal_instance).html(html_content);
              }
            });
          return def.promise();
        }
        jQuery('#manual_check_mypost').trigger('click');
        jQuery('#manual_check_newpost').trigger('click');
		var existCondition = setInterval(function() {
		 if (jQuery('#filter-btn-newpost').length) {
			 var message = "0 images added to post and 0 videos added to post.";
		     jQuery('#nav-newpost').find('.media-kit-search #filter-btn-newpost').after('<div class="asset-counter-message">'+message+'</div>');
			 clearInterval(existCondition);
		 }
		}, 100);
		
        // -----------------------------------------------------------Start Search post------------------------------------------------------------------	
        jQuery('.custom-my-post-headr #search-post').keypress(function(event) {
          var keycode = (event.keyCode ? event.keyCode : event.which);
          if (keycode == '13') {
            var search_text = jQuery(this).val();
            if (search_text) {
              var page_id = getUrlParameter('page_id');
              var generate_search_url = window.location.href.split("?");
              if (page_id !== undefined) {
                window.location.replace(generate_search_url[0] + '?key=' + search_text + '&&page_id=' + page_id);
              } else {
                window.location.replace(generate_search_url[0] + '?key=' + search_text);
              }
            } else {
              alert('Please enter some keyword!!');
            }
          }
        });
        var getUrlParameter = function getUrlParameter(sParam) {
          var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
          for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
              return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
          }
        };
        //-------------------------------------------------------------end search post-------------------------------------------------------------------
        //--------------------------------------------------------------reset my post tab----------------------------------------------------------------
        jQuery("body").on('click', '#nav-myposts-tab', function(e) {
          jQuery('.custom-my-post-headr .search-box').parent().removeClass('invisible');
        });
        jQuery("body").on('click', '#nav-newpost-tab, #nav-calendar-tab, #nav-engagement-tab, #nav-ads-tab, #nav-reports-tab, #nav-settings-tab', function(e) {
          jQuery('.custom-my-post-headr .search-box').parent().addClass('invisible');
        });

        function network_info_modal(moreinfo_link, continue_link, active_connection, title, html_content) {
          jQuery('#network-info-modal').dialog({
            autoOpen: true,
            width: 500,
            // height: 200,
            modal: true,
            resizable: false,
            buttons: {
              'More Info': function() {
                // window.location = moreinfo_link; 
                window.open(moreinfo_link, '_blank');
              },
              Cancel: function() {
                jQuery(this).dialog("close");
              },
              Continue: function() {
                if (active_connection) {
                  window.location = continue_link;
                } else {
                  jQuery(continue_link).find('.available-network').trigger('click');
                }
                jQuery(this).dialog("close");
              }

            },
            open: function(event, ui) {
              jQuery('#network-info-modal').dialog('option', 'title', title);
              jQuery("#network-info-modal").html(html_content);
              jQuery('span.ui-dialog-title').append('<div class="sub-title">Allows These Remote Features</div>');
              // jQuery('.ui-dialog-buttonpane.ui-widget-content').append('<button type="button" class="more-info-buttons"><a class="more-info-button" href= moreinfo_link target="_blank">MORE INFO</a></button>');                          
            }
          });
        }
        jQuery('#social-media-wrapper .connections-list').on('click', '.network-info', function(e) {
          var $this = jQuery(this);
          jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
          var network_id = jQuery(this).parents('.social-items').attr('data-networkid');
          var network_title = jQuery(this).parents('.social-items').attr('data-networkName');
          jQuery.ajax({
            url: "/getAvailableFeatures/" + network_id,
            data: {
              "uid": path_userid,
            },
            type: "GET",
            success: function(data) {
              // var server_response = JSON.parse(data);
              jQuery("#overlay").remove()
              var html_content = '<ul class="list-unstyled text-left pl-5">';
              jQuery.each(data['dataValue'], function(key, value) {
                if (value.enabled) {
                  var list_class = 'available';
                } else {
                  var list_class = 'not-available';
                }
                html_content += '<li class="items-list d-flex align-items-center ' + list_class + ' ">' + value.name + '</li>';

              });
              html_content += '</ul>'
              if (data.knowledge_base_url == null) {
                var moreinfo_link = media_base_url;
              } else {
                var moreinfo_link = media_base_url + '/' + data.knowledge_base_url.value;
              }
              if ($this.parents('#available-connections').length) {
                var current_class = $this.parents('.border-secondary').attr("class").split(/\s+/);
                var i;
                var parent_class;
                for (i = 0; i < current_class.length; ++i) {
                  if (current_class[i].indexOf("custom") >= 0) {
                    parent_class = '.' + current_class[i];
                  }
                }
                var continue_link = parent_class;
                var active_connection = 0;
              } else {
                var continue_link = media_base_url + '/tools/social/media/' + path_userid + '/' + network_id;
                var active_connection = 1;
              }
              network_info_modal(moreinfo_link, continue_link, active_connection, network_title, html_content);
            }
          });
        });
        //-----------------------------------------------------------start character count for post-------------------------------------------------------------
        jQuery("#nav-newpost textarea").keyup(function() {
          var count_character = jQuery.trim(jQuery(this).val()).length;
		  if(social_media_name10 == 'Twitter'){
			var max_character = 280;  
		  }
		  else{
			 var max_character = 2000;   
		  }
          if (count_character >= max_character) {
            alert("You reached your Character Limit");
          } else {
            jQuery('#nav-newpost .textcount').text(max_character - count_character);
            if (count_character > 0) {
              jQuery('#nav-newpost').find('.social-media-config-btn').removeClass('disabled');
            } else {
              mids = jQuery('#nav-newpost table.media-table tbody tr input[type=checkbox]:checked').map(function() {
                return jQuery(this).data('mid')
              }).get();
              if (mids.length > 0) {
                jQuery('#nav-newpost').find('.social-media-config-btn').removeClass('disabled');
              } else {
                jQuery('#nav-newpost').find('.social-media-config-btn').addClass('disabled');
              }
            }
          }
        });
        jQuery("#nav-myposts textarea").keyup(function() {
          var count_character = jQuery.trim(jQuery(this).val()).length;
		  if(social_media_name10 == 'Twitter'){
			var max_character = 280;  
		  }
		  else{
			 var max_character = 2000;   
		  }
          if (count_character >= max_character) {
            alert("You reached your Character Limit");
          } else {
            jQuery('#nav-myposts .textcount').text(max_character - count_character);
            if (count_character > 0) {
              jQuery('#nav-myposts').find('.social-media-config-btn').removeClass('disabled');
            } else {
              mids = jQuery('#nav-myposts table.media-table tbody tr input[type=checkbox]:checked').map(function() {
                return jQuery(this).data('mid')
              }).get();
              if (mids.length > 0) {
                jQuery('#nav-myposts').find('.social-media-config-btn').removeClass('disabled');
              } else {
                jQuery('#nav-myposts').find('.social-media-config-btn').addClass('disabled');
              }
            }
          }
        });
        jQuery('#nav-newpost .tab-content .tb-tab-content ').on('click', '.box-check', function(e) {
          mids = jQuery('#nav-newpost table.media-table tbody tr input[type=checkbox]:checked').map(function() {
            return jQuery(this).data('mid')
          }).get();
          if (mids.length > 0) {
            jQuery('#nav-newpost').find('.social-media-config-btn').removeClass('disabled');
          } else {
            var count_character = jQuery.trim(jQuery('#nav-newpost textarea').val()).length;
            if (count_character > 0) {
              jQuery('#nav-newpost').find('.social-media-config-btn').removeClass('disabled');
            } else {
              jQuery('#nav-newpost').find('.social-media-config-btn').addClass('disabled');
            }
          }
        });
        jQuery('#nav-myposts .tab-content .tb-tab-content ').on('click', '.box-check', function(e) {
          mids = jQuery('#nav-myposts table.media-table tbody tr input[type=checkbox]:checked').map(function() {
            return jQuery(this).data('mid')
          }).get();
          if (mids.length > 0) {
            jQuery('#nav-myposts').find('.social-media-config-btn').removeClass('disabled');
          } else {
            var count_character = jQuery.trim(jQuery('#nav-myposts textarea').val()).length;
            if (count_character > 0) {
              jQuery('#nav-myposts').find('.social-media-config-btn').removeClass('disabled');
            } else {
              jQuery('#nav-myposts').find('.social-media-config-btn').addClass('disabled');
            }
          }
        });
        //-----------------------------------------------start move Active Connection to Available Connection ------------------------------------------
        jQuery('#active-connections .network-setting').on('click', '.active-network', function() {
          var $this = jQuery(this);
          var title = '';
          var network_name = jQuery(this).attr('data-networkName');
          var html_content = 'Are you sure you wish to disconnect from ' + network_name + '? You will need to reconnect again the next time you wish to integrate ' + network_name + ' into your Kaboodle Media account.';
          social_media_page_modal(1, 1,0, title, html_content).done(function() {
            jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
            var tid = $this.attr('data-networkId');
            var status = 0;
            var querystring = '';
            if(drupalSettings.team_query){
              var team_query = drupalSettings.team_query;
              querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
            }
            jQuery.ajax({
              url: "/save-social-network-settings"+querystring,
              data: {
                "uid": path_userid,
                "tid": parseInt(tid),
                "status": status,
              },
              type: "POST",
              success: function(xhr, status) {
                if (status == 'success') {
                  jQuery('#overlay').remove();
                  var current_class = $this.parents('.border-secondary').attr("class").split(/\s+/);
                  var i;
                  var find_class;
                  for (i = 0; i < current_class.length; ++i) {
                    if (current_class[i].indexOf("custom") >= 0) {
                      find_class = '.' + current_class[i];
                    }
                  }
                  $this.parents('.border-secondary').hide();
                  jQuery("#available-connections .connections-list").find(find_class).show();
                  let total_hidden = 0;
                  jQuery('#active-connections .connections-list .border-secondary').each(function() {
                    if (jQuery(this).css('display') == 'none') {
                      total_hidden++;
                    }
                  });
                  console.log(total_hidden);
                  if (total_hidden == 9) {
                    jQuery("#active-connections .no-connection").removeClass('d-none');
                  }
                }
              }
            });
          }).fail(function() {
            console.log('cancel');
          });
        });
        //-----------------------------------------------------------start social media registration-------------------------------------------
        jQuery('#available-connections .border-secondary').on('click', 'div.access-token', function() {
          jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
          jQuery(".custom-remove").addClass('d-none');
          var social_media_id = jQuery(this).parents('.border-secondary').find('.network-setting .get-term-id').text();
          var $this = jQuery(this);
          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          jQuery.ajax({
            url: "/social_media_login_link/" + social_media_id+querystring,
            data: {
              "uid": path_userid,
            },
            type: "GET",
            success: function(data) {
              jQuery('#overlay').remove();
              jQuery('.right-content-area').find('.social-media-access').remove();
              jQuery('.right-content-area').prepend(data.html);
              jQuery('.social-media-access button#access-button').insertAfter(jQuery("p:contains([INSERT_CONNECTION_BUTTON])"));
              jQuery("p:contains([INSERT_CONNECTION_BUTTON])").css('display', 'none');
              jQuery("html, body").animate({
                scrollTop: 0
              }, "slow");
            },
            error: function(textStatus, errorThrown) {
              jQuery('#overlay').remove();
              social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
            }
          });
        });
        //-----------------------------------------------------------end social media rgistration ---------------------------------------------	
        // ---------------------------------------------------------------start delete post-----------------------------------------------------------
        jQuery('.listing-post').on('click', '.enable.delete-post a#delete-post', function(e) {
          e.preventDefault();
          var $this = jQuery(this);
          var post_id = jQuery(this).attr('data-sid');
          var network_name = jQuery(this).attr('data-networkName');
          var modalType = jQuery(this).attr('data-modalType');
          if (modalType == 'Draft') {
            var html_content = 'Are you sure you want to delete this post? It has not been sent to ' + network_name + '. This action may not be undone.';
          } else {
            var html_content = 'Deleting this post will also remove it from the scheduler. As a result it will not be sent to ' + network_name + '. This action may not be undone.';
          }
          var title = 'Delete Post';
          //var html_content = 'Deleting this post will also remove it from the scheduler. As a result it will not be sent to ' +network_name+ '. This action may not be undone.';
          social_media_page_modal(1, 1, 0, title, html_content).done(function() {
            var response = createDeletePost(post_id, $this);
          }).fail(function() {
            console.log('cancel');
          });
        });
        jQuery('#nav-calendar').on('click', '.cal-post-operation ul .enable.delete-post a#delete-post', function(e) {
          var post_id = jQuery(this).attr('data-sid');
          var $this = jQuery(this);
          var network_name = jQuery(this).attr('data-networkName');
          var modalType = jQuery(this).attr('data-modalType');
          if (modalType == 'Draft') {
            var html_content = 'Are you sure you want to delete this post? It has not been sent to ' + network_name + '. This action may not be undone.';
          } else {
            var html_content = 'Deleting this post will also remove it from the scheduler. As a result it will not be sent to ' + network_name + '. This action may not be undone.';
          }
          var title = 'Delete Post';
          social_media_page_modal(1, 1, 0, title, html_content).done(function() {
            var response = createDeletePost(post_id, $this);
            if (response == 'Deleted') {
              jQuery(this).parents(".post-items").remove();
            }
          }).fail(function() {
            console.log('cancel');
          });
        });

        function createDeletePost(post_id, referer) {
          jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          jQuery.ajax({
            url: "/delete-social-media-post/" + post_id+querystring,
            data: {
              "uid": path_userid,
            },
            type: "POST",
            success: function(data) {
              let server_response = JSON.parse(data);
              //console.log(server_response.result);
              if (server_response.result == 'Deleted') {
                referer.parents('.listing-post-wrap').remove();
                referer.parents('.post-items').remove();
              } else {
                alert('There is some error Please try later');
              }
              jQuery('#overlay').remove();
              return server_response.result;
            },
            error: function(textStatus, errorThrown) {
              jQuery('#overlay').remove();
              social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
            }
          });
        }
        // -----------------------------------------------------------------end delete post-------------------------------------------------------------
        // ------------------------------------------------------------------edit post---------------------------------------------------------
        jQuery('.listing-post').on('click', '.custom-postskaboodle-operation ul li.enable.edit-post a#edit-post', function(e) {
          e.preventDefault();
          if (jQuery('.instruction-region').hasClass('d-none')) {} else {
            jQuery('.instruction-region').addClass("d-none");
            jQuery('.post-edit-region').removeClass("d-none");
          }
          jQuery(this).parents('.listing-post-wrap').addClass('active-post');
          jQuery(".custom-postskaboodle-operation ul li.enable.edit-post a#edit-post").not(this).parents('.listing-post-wrap').removeClass('active-post');
          var post_id = jQuery(this).attr('data-sid');
          createEditPost(post_id);
        });
        jQuery('#nav-calendar').on('click', '.cal-post-operation ul li.enable.edit-post a#edit-post', function(e) {
          e.preventDefault();
          jQuery('#nav-myposts-tab').trigger('click');
          var post_id = jQuery(this).attr('data-sid');
          //var post_id = 185;
          createEditPost(post_id);
        });

        function createEditPost(post_id) {
          jQuery('.mypost #post_id').val(post_id);
          jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
          if (jQuery('.instruction-region').hasClass('d-none')) {} else {
            jQuery('.instruction-region').addClass("d-none");
            jQuery('.post-edit-region').removeClass("d-none");
          }
          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          jQuery.ajax({
            url: "/get_social_media_post_by_postID"+querystring,
            data: {
              "uid": path_userid,
              "sid": post_id,
            },
            type: "POST",
            success: function(data) {
              var update_post = JSON.parse(data);
              jQuery('#nav-myposts textarea').val(update_post['post_name']);
              jQuery('#nav-myposts #media-kit-options-mypost select').val(parseInt(update_post['media_kit_id']));
              jQuery('#mediakitid-mypost').val(parseInt(update_post['media_kit_id']));
              jQuery('#nav-myposts select#page_id').val(parseInt(update_post['page_id']));
              jQuery('#nav-myposts').find('.social-media-config-btn').removeClass('disabled');
              if (update_post['schedule_type'] == 'manual_check') {
                jQuery('#manual_check_mypost').trigger('click');
              }
              if (update_post['status'] == 'Draft') {
                if (update_post['scheduled_bubble'] == 0) {
                  jQuery('#nav-myposts .switch').removeClass('disable');
                  jQuery('#auto-schedule-mypost').prop('checked', true);
                  jQuery('.slider-toggle input#auto-schedule-mypost').trigger('click');
                } else {
                  jQuery('#nav-myposts .switch').removeClass('disable');
                  jQuery('#auto-schedule-mypost').prop('checked', false);
                  jQuery('.slider-toggle input#auto-schedule-mypost').trigger('click');
                }
              } else {
                jQuery('#nav-myposts .switch').removeClass('disable');
                jQuery('#auto-schedule-mypost').prop('checked', false);
                jQuery('.slider-toggle input#auto-schedule-mypost').trigger('click');
              }
              jQuery('#datetimepicker-mypost').val(update_post['date_formate']);
              jQuery('.mypost-shedule-form #datetimepicker-mypost').datetimepicker("destroy");
              var date_picker_instance = jQuery('.mypost-shedule-form #datetimepicker-mypost').datetimepicker({
                //format:'F d, Y H:i a',
                formatTime: 'g:i a',
                step: 15,
                minDate: 0,
                todayButton: false,
                defaultSelect: false,
                yearStart: (new Date).getFullYear(),
                inline: true,
                changeMonth: true,
                changeYear: true,
                onChangeDateTime: function(current_time, $input) {
                  if (new Date(current_time) <= new Date()) {
                    jQuery(this).val('');
                    alert('Scheduled time should be greater than the current time.');
                  }
                },
                onSelect: function(dateText) {
                  jQuery(this).change();
                }
              }).on('change', function() {
                jQuery('.mypost-shedule-form #auto-schedule-submit').removeClass('disabled');
                /*  if (jQuery('.mypost-shedule-form #manual_check_mypost').is(':checked')) {
                    jQuery('.mypost-shedule-form #auto-schedule-submit').removeClass('disabled');
                  } else {
                    jQuery('.mypost-shedule-form #auto-schedule-submit').addClass('disabled');
                  } */
              });
              jQuery.doit = function() {
                var dfd = jQuery.Deferred();
                jQuery('#nav-myposts #media-kit-options-mypost').trigger('change');
                jQuery("#photo-mypost-refresh").trigger('click');
                jQuery("#video-mypost-refresh").trigger('click');
                setTimeout(function() {
                  dfd.resolve();
                }, 10000);
                return dfd;
              }
              jQuery.doit().then(function() {
                jQuery(".wrap-mypost textarea").trigger("keyup");
                jQuery('#nav-myposts table.media-table tbody tr input[type=checkbox]').each(function() {
                  if (jQuery.inArray(jQuery(this).data('mid'), update_post['mids']) !== -1) {
                    jQuery(this).prop('checked', true);
                  } else {
                    jQuery(this).prop('checked', false);
                  }
                });
		  var mids = new Array();
          var selected_photo = 0;
          var selected_video = 0;
         
          mids = jQuery('#nav-myposts table.media-table tbody tr input[type=checkbox]:checked').map(function() {
            //count images,videos that are selected
            if (jQuery(this).parents("[id^=nav-photo-kit-]").length) {
              selected_photo++;
            }
            if (jQuery(this).parents("[id^=nav-video-kit-]").length) {
              selected_video++;
            }
            return jQuery(this).data('mid')
          }).get();
         // console.log(selected_photo);
          // console.log(selected_video);
          var message = '';
          if(selected_photo == 1){
            message += selected_photo + ' image added to post ' ;
          }
          else{
            message += selected_photo + ' images added to post ' ;
          }
          if(selected_video == 1){
            message += 'and ' + selected_video + ' video added to post. ' ;
          }
          else{
            message += 'and ' + selected_video + ' videos added to post. ' ;
          }
           jQuery('#nav-myposts').find('.media-kit-search .asset-counter-message').remove();
           jQuery('#nav-myposts').find('.media-kit-search #filter-btn-mypost').after('<div class="asset-counter-message">'+message+'</div>');
				
                jQuery('#overlay').remove();
                jQuery("html, body").animate({
                  scrollTop: 0
                }, "slow");
              });
            }
          });
        }
        // console.log('edit post fine');
        //-------------------------------------------------------------start clone post---------------------------------------------------------=
        jQuery('.listing-post').on('click', '.custom-postskaboodle-operation ul li.enable.clone-post a#clone-post', function(e) {
          e.preventDefault();
          var post_id = jQuery(this).attr('data-sid');
          createClonePost(post_id);
        });
        jQuery('#nav-calendar').on('click', '.cal-post-operation ul li.enable.clone-post a#clone-post', function(e) {
          e.preventDefault();
          var post_id = jQuery(this).attr('data-sid');
          createClonePost(post_id);
        });

        function createClonePost(post_id) {
          jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
          // console.log('clonefunction');
          jQuery('#nav-newpost-tab').trigger('click');
          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          jQuery.ajax({
            url: "/get_social_media_post_by_postID"+querystring,
            data: {
              "uid": path_userid,
              "sid": post_id,
            },
            type: "POST",
            success: function(data) {
              var update_post = JSON.parse(data);
              jQuery('#nav-newpost textarea').val(update_post['post_name']);
              jQuery("#nav-newpost textarea").trigger("keyup");
              jQuery('#nav-newpost #media-kit-options-newpost select').val(parseInt(update_post['media_kit_id']));
              jQuery('#mediakitid-newpost').val(parseInt(update_post['media_kit_id']));
              jQuery('#nav-newpost select#page_id').val(parseInt(update_post['page_id']));
              jQuery.doit = function() {
                var dfd = jQuery.Deferred();
                jQuery('#nav-newpost #media-kit-options-newpost select').trigger('click');
                jQuery("#photo-newpost-refresh").trigger('click');
                jQuery("#video-newpost-refresh").trigger('click');
                setTimeout(function() {
                  dfd.resolve();
                }, 10000);
                return dfd;
              }
              jQuery.doit().then(function() {
                jQuery('#nav-newpost table.media-table tbody tr input[type=checkbox]').each(function() {
                  if (jQuery.inArray(jQuery(this).data('mid'), update_post['mids']) !== -1) {
                    jQuery(this).prop('checked', true);
                  } else {
                    jQuery(this).prop('checked', false);
                  }
                });
				  var $this = jQuery(this);
          var mids = new Array();
          var selected_photo = 0;
          var selected_video = 0;
         
          mids = jQuery('#nav-newpost table.media-table tbody tr input[type=checkbox]:checked').map(function() {
            //count images,videos that are selected
            if (jQuery(this).parents("[id^=nav-photo-kit-]").length) {
              selected_photo++;
            }
            if (jQuery(this).parents("[id^=nav-video-kit-]").length) {
              selected_video++;
            }
            return jQuery(this).data('mid')
          }).get();
         // console.log(selected_photo);
          // console.log(selected_video);
          var message = '';
          if(selected_photo == 1){
            message += selected_photo + ' image added to post ' ;
          }
          else{
            message += selected_photo + ' images added to post ' ;
          }
          if(selected_video == 1){
            message += 'and ' + selected_video + ' video added to post. ' ;
          }
          else{
            message += 'and ' + selected_video + ' videos added to post. ' ;
          }
           jQuery('#nav-newpost').find('.media-kit-search .asset-counter-message').remove();
           jQuery('#nav-newpost').find('.media-kit-search #filter-btn-newpost').after('<div class="asset-counter-message">'+message+'</div>');
 
                jQuery('#overlay').remove();
                jQuery("html, body").animate({
                  scrollTop: 0
                }, "slow");
              });
            },
            error: function(textStatus, errorThrown) {
              jQuery('#overlay').remove();
              social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
            }
          });
        }
        //---------------------------------------------------------------------------ON/Off toggle button-------------------------------------------------------------------
        jQuery('.slider-toggle input#auto-schedule-newpost').on('change', function() {
          if (jQuery(this).is(":checked")) {
            jQuery(this).parents('.slider-toggle').find('span').text('On');
            jQuery(this).parents('.slider-toggle').find('span').addClass('btnon');
            jQuery("#nav-newpost #post-now").text('SCHEDULE');
            jQuery("#nav-newpost .schedule-instruction").text('This post is scheduled. Click the gear to reschedule this post.');
          } else {
            jQuery(this).parents('.slider-toggle').find('span').text('Off');
            jQuery(this).parents('.slider-toggle').find('span').removeClass('btnon');
            jQuery("#nav-newpost #post-now").text('POST NOW');
            jQuery("#nav-newpost .schedule-instruction").text('This post is not scheduled. Click “POST NOW” or the gear to schedule your post later.');
          }
        });
        jQuery('.slider-toggle input#auto-schedule-mypost').on('change', function() {
          if (jQuery(this).is(":checked")) {
            jQuery(this).parents('.slider-toggle').find('span').text('On');
            jQuery(this).parents('.slider-toggle').find('span').addClass('btnon');
            jQuery("#nav-myposts #post-now").text('SCHEDULE');
            410
            jQuery("#nav-myposts .schedule-instruction").text('This post is scheduled. Click the gear to reschedule this post.');
          } else {
            jQuery(this).parents('.slider-toggle').find('span').text('Off');
            //jQuery(this).parents('.slider-toggle').find('span').addClass('btnoff'); 
            jQuery(this).parents('.slider-toggle').find('span').removeClass('btnon');
            jQuery("#nav-myposts #post-now").text('POST NOW');
            jQuery("#nav-myposts .schedule-instruction").text('This post is not scheduled. Click “POST NOW” or the gear to schedule your post later.');
          }
        });
        /*datetimepicker*/
        jQuery('.newpost-shedule-form #datetimepicker-newpost').datetimepicker({
          //format:'F d, Y H:i A',
          formatTime: 'g:i a',
          step: 15,
          minDate: 0,
          minTime: 0,
          todayButton: false,
          defaultSelect: false,
          yearStart: (new Date).getFullYear(),
          inline: true,
          onChangeDateTime: function(current_time, $input) {
            if (new Date(current_time) <= new Date()) {
              jQuery(this).val('');
              alert('Scheduled time should be greater than the current time.');
            } else {
              jQuery('#datetimepicker-newpost').datetimepicker({
                'minTime': '00:00'
              });
            }
          },
          onSelect: function(dateText) {
            jQuery(this).change();
          }
        }).on('change', function() {
          jQuery('.newpost-shedule-form #auto-schedule-submit').removeClass('disabled');
          /*  if (jQuery('.newpost-shedule-form #manual_check_newpost').is(':checked')) {
              jQuery('.newpost-shedule-form #auto-schedule-submit').removeClass('disabled');
            } else {
              jQuery('.newpost-shedule-form #auto-schedule-submit').addClass('disabled');
            } */
        });
        /*timepicker*/
        jQuery('#schedule_time').datetimepicker({
          format: 'H:i a',
          datepicker: false,
          step: 15,
          inline: true,
          onSelect: function(Text) {
            jQuery(this).change();
          }
        }).on('change', function() {
          jQuery('.newpost-shedule-form #auto-schedule-submit').removeClass('disabled');
          if (jQuery(this).parents('.newpost-shedule-form').length) {
            /* if (jQuery('.newpost-shedule-form #auto_check').is(':checked')) {
               jQuery('.newpost-shedule-form #auto-schedule-submit').removeClass('disabled');
             } else {
               jQuery('.newpost-shedule-form #auto-schedule-submit').addClass('disabled');
             }*/
          }
          if (jQuery(this).parents('.mypost-shedule-form').length) {
            jQuery('.mypost-shedule-form #auto-schedule-submit').addClass('disabled');
            /* if (jQuery('.mypost-shedule-form #auto_check').is(':checked')) {
               jQuery('.mypost-shedule-form #auto-schedule-submit').removeClass('disabled');
             } else {
               jQuery('.mypost-shedule-form #auto-schedule-submit').addClass('disabled');
             } */
          }
        });
        //Every Weekday selector
        jQuery('body').on('click', '.setweekly', function() {
          jQuery('.setweekly').removeClass('xdsoft_current');
          jQuery(this).addClass('xdsoft_current');
        });
        //-------------------------------------------------SCHEDULE SETTINGS submit button----------------------------------------------------------------------------
        jQuery('body .newpost-shedule-form').on('click', '#auto-schedule-submit', function() {
          jQuery('#manual_check_newpost').trigger('click');
          var valid = true;
          var error_msg = '';
          var radio = jQuery(".newpost-shedule-form input[name='settings']:checked").attr("id");
          if (radio == 'manual_check_newpost') {
            var datetimepicker = jQuery(".newpost-shedule-form #datetimepicker-newpost").val();
            var schedule_type = 'manual_check';
            if (!datetimepicker) {
              error_msg = "Choose date/time !";
              valid = false;
            }
          } else {
            error_msg = "Choose any one option !";
            valid = false;
          }
          jQuery("#auto-Schedule-modal-newpost .modal-body").find('.alert').remove();
          if (valid) {
            jQuery('#auto-Schedule-modal-newpost button').removeClass('disabled');
            var ufid = jQuery('.newpost-shedule-form').data('ufid');
            jQuery.ajax({
              url: "/save-schedule-settings",
              data: {
                "uid": path_userid,
                "ufid": ufid,
                "schedule_type": schedule_type,
                "manual_datetime": datetimepicker,
                "media_kit_id": jQuery('#media-kit-options-newpost select').find(":selected").val(),
                "social_media_name": jQuery('#nav-newpost .socialmedia-title span').text(),
                "page_id": parseInt(jQuery('#nav-newpost select#page_id').val()),
                "text": jQuery('#nav-newpost textarea').val(),
                "status": 'Draft',
                "action": 'schedule',
              },
              type: "POST",
              success: function(data) {
                jQuery("#auto-Schedule-modal-newpost .modal-body").prepend('<div class="alert alert-success">Settings saved successfully.</div>');
                jQuery('#nav-newpost button').prop('disabled', false);
                jQuery('#nav-newpost #gear .switch').removeClass('disable');
                jQuery('#nav-newpost #gear .btnenbl').removeClass('btnoff');
                jQuery('#auto-Schedule-modal-newpost').modal('hide');
              },
              error: function(textStatus, errorThrown) {
                jQuery('#overlay').remove();
                social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
              }
            });
          } else {
            jQuery("#auto-Schedule-modal-newpost .modal-body").prepend('<div class="alert alert-danger" role="alert">' + error_msg + '</div>');
          }
        });
        //update schedule settings
        jQuery('body .mypost-shedule-form').on('click', '#auto-schedule-submit', function() {
          jQuery('#manual_check_mypost').trigger('click');
          var valid = true;
          var error_msg = '';
          var radio = jQuery(".mypost-shedule-form input[name='settings']:checked").attr("id");
          if (radio == 'manual_check_mypost') {
            var datetimepicker = jQuery(".mypost-shedule-form #datetimepicker-mypost").val();
            //	console.log(datetimepicker);
            var schedule_type = 'manual_check';
            if (!datetimepicker) {
              error_msg = "Choose date/time !";
              valid = false;
            }
          } else {
            error_msg = "Choose any one option !";
            valid = false;
          }
          jQuery("#auto-Schedule-modal-mypost .modal-body").find('.alert').remove();
          var post_id = jQuery('.mypost #post_id').val();
          if (valid) {
            jQuery('#auto-Schedule-modal-mypost button').removeClass('disabled');
            var ufid = jQuery('.mypost-shedule-form').data('ufid');
            var querystring = '';
            if(drupalSettings.team_query){
              var team_query = drupalSettings.team_query;
              querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
            }
            jQuery.ajax({
              url: "/update-social-media-post"+querystring,
              data: {
                "page_id": parseInt(jQuery('#nav-myposts select#page_id').val()),
                "uid": path_userid,
                "ufid": ufid,
                "sid": parseInt(post_id),
                "schedule_type": schedule_type,
                "manual_datetime": datetimepicker,
                "media_kit_id": jQuery('#media-kit-options-mypost select').find(":selected").val(),
                "social_media_name": jQuery('#nav-myposts .socialmedia-title span').text(),
                "text": jQuery('#nav-myposts textarea').val(),
                "status": 'Draft',
                "action": 'schedule',
              },
              type: "POST",
              success: function(data) {
                jQuery("#auto-Schedule-modal-mypost .modal-body").prepend('<div class="alert alert-success">Settings updated successfully.</div>');
                jQuery('#nav-myposts button').prop('disabled', false);
                jQuery('#nav-myposts #gear .switch').removeClass('disable');
                jQuery('#nav-myposts #gear .btnenbl').removeClass('btnoff');
                jQuery('#auto-Schedule-modal-mypost').modal('hide');
              },
              error: function(textStatus, errorThrown) {
                jQuery('#overlay').remove();
                social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
              }
            });
          } else {
            jQuery("#auto-Schedule-modal-mypost .modal-body").prepend('<div class="alert alert-danger" role="alert">' + error_msg + '</div>');
          }
        });
		jQuery('#nav-newpost #tab-content-newpost ').on('click', '.box-check', function(e) {
          var $this = jQuery(this);
          var mids = new Array();
          var selected_photo = 0;
          var selected_video = 0;
         
          mids = jQuery('#nav-newpost table.media-table tbody tr input[type=checkbox]:checked').map(function() {
            //count images,videos that are selected
            if (jQuery(this).parents("[id^=nav-photo-kit-]").length) {
              selected_photo++;
            }
            if (jQuery(this).parents("[id^=nav-video-kit-]").length) {
              selected_video++;
            }
            return jQuery(this).data('mid')
          }).get();
         // console.log(selected_photo);
          // console.log(selected_video);
          var message = '';
          if(selected_photo == 1){
            message += selected_photo + ' image added to post ' ;
          }
          else{
            message += selected_photo + ' images added to post ' ;
          }
          if(selected_video == 1){
            message += 'and ' + selected_video + ' video added to post. ' ;
          }
          else{
            message += 'and ' + selected_video + ' videos added to post. ' ;
          }
           jQuery(this).parents('#nav-newpost').find('.media-kit-search .asset-counter-message').remove();
           jQuery(this).parents('#nav-newpost').find('.media-kit-search #filter-btn-newpost').after('<div class="asset-counter-message">'+message+'</div>');
          // console.log(message);
        });
	    jQuery('#nav-myposts #tab-content-mypost ').on('click', '.box-check', function(e) {
          var $this = jQuery(this);
          var mids = new Array();
          var selected_photo = 0;
          var selected_video = 0;
         
          mids = jQuery('#nav-myposts table.media-table tbody tr input[type=checkbox]:checked').map(function() {
            //count images,videos that are selected
            if (jQuery(this).parents("[id^=nav-photo-kit-]").length) {
              selected_photo++;
            }
            if (jQuery(this).parents("[id^=nav-video-kit-]").length) {
              selected_video++;
            }
            return jQuery(this).data('mid')
          }).get();
         // console.log(selected_photo);
          // console.log(selected_video);
          var message = '';
          if(selected_photo == 1){
            message += selected_photo + ' image added to post ' ;
          }
          else{
            message += selected_photo + ' images added to post ' ;
          }
          if(selected_video == 1){
            message += 'and ' + selected_video + ' video added to post. ' ;
          }
          else{
            message += 'and ' + selected_video + ' videos added to post. ' ;
          }
           jQuery(this).parents('#nav-myposts').find('.media-kit-search .asset-counter-message').remove();
           jQuery(this).parents('#nav-myposts').find('.media-kit-search #filter-btn-mypost').after('<div class="asset-counter-message">'+message+'</div>');
          // console.log(message);
        });
        //---------------------------------------------------------submit post form---------------------------------------------------------------------       
        jQuery('body #nav-newpost').on('click', 'button.social-media-config-btn', function(e) {
          jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
          var social_media_name = jQuery('#nav-newpost .socialmedia-title span').text();
          var mids = new Array();
          var selected_photo = 0;
          var selected_video = 0;
          // var selected_remote = 0;
          var error = 0;
          mids = jQuery('#nav-newpost table.media-table tbody tr input[type=checkbox]:checked').map(function() {
            //count images,videos that are selected
            if (jQuery(this).parents("[id^=nav-photo-kit-]").length) {
              selected_photo++;
            }
            if (jQuery(this).parents("[id^=nav-video-kit-]").length) {
              selected_video++;
            }
            return jQuery(this).data('mid')
          }).get();
          if (social_media_name == 'Facebook') {
            var page_or_account = parseInt(jQuery('#nav-newpost select#page_id').val());
            if ((selected_photo >= 1 && (selected_video > 0)) || selected_video > 1) {
              error = 1;
              var error_message = 'You may not mix asset types in a single post such as photos and videos. You may post 1 or more photos, or 1 video to this post.';
            } else if (selected_photo == 0 && selected_video == 0 && jQuery('#nav-newpost textarea').val() == '') {
              error = 1;
              var error_message = " Please fill text field or chose media kit. Blank post can't be submitted";
            }
          }
          if (social_media_name == 'Twitter') {
            if (selected_photo > 4 || (selected_photo > 0 && selected_video > 0)) {
              error = 1;
              var error_message = 'You may tweet either photos upto 4 or 1 video ';
            } else if (selected_video > 1) {
              error = 1;
              var error_message = 'You may tweet either photos upto 4 or 1 video';
            }
          }
          if (social_media_name == 'Instagram') {
            var page_or_account = jQuery('#nav-newpost select#account_id').val();
            if ((selected_photo > 1 || selected_video > 1) || (selected_photo == 1 && selected_video == 1)) {
              error = 1;
              var error_message = 'You may post either 1 photo or 1 video ';
            } else if (selected_photo == 0 && selected_video == 0) {
              error = 1;
              var error_message = 'Please select either 1 photo or 1 video ';
            }
          }
          if (error == 1) {
            var title = '';
            var html_content = error_message;
            social_media_page_modal(1, 0, 0, title, html_content).done(function() {
              jQuery('#overlay').remove();
            }).fail(function() {
              console.log('cancel');
            });
            return;
          }
          // check schedule button on/off
          if (jQuery('#auto-schedule-newpost').is(":checked")) {
            var scheduled_bubble = 1;
          } else {
            var scheduled_bubble = 0;
          }
          //get status of post from test
          var current_status_test = jQuery(this).text();
          if (current_status_test == 'SCHEDULE') {
            var current_status = 'Scheduled';
          } else if (current_status_test == 'SAVE AS DRAFT') {
            var current_status = 'Draft';
          } else {
            var current_status = 'Post';
          }
          var ufid = jQuery('.wrap-newpost').data('ufid');
          jQuery.ajax({
            url: "/save-schedule-settings",
            data: {
              "uid": path_userid,
              "mid": mids,
              "ufid": ufid,
              "media_kit_id": jQuery('#media-kit-options-newpost select').find(":selected").val(),
              "social_media_name": jQuery('#nav-newpost .socialmedia-title span').text(),
              "page_id": page_or_account,
              "text": jQuery('#nav-newpost textarea').val(),
              "status": current_status,
              "scheduled_bubble": scheduled_bubble,
              "action": 'save',
            },
            type: "POST",
            success: function(data) {
              var parse_data = JSON.parse(data);
              if (typeof parse_data == 'object') {
                if (parse_data.error) {
                  jQuery('#overlay').remove();
                  var title = '';
                  var html_content = parse_data.error.msg;
                  if (social_media_name10 == 'Facebook') {
                   var title = 'Facebook Error Reported'; 
                   var html_content = 'Facebook reported the following error:<br>' + parse_data.error.msg;                   
                  }else if(social_media_name10 == 'Instagram'){
                    var title = 'Instagram Error Reported'; 
                    var html_content = 'Instagram reported the following error:<br>' + parse_data.error.msg;                    
                  }
                  else if(social_media_name10 == 'Twitter'){
                    var title = 'Twitter Error Reported';  
                    var html_content = 'Twitter reported the following error:<br>' + parse_data.error.msg;
                  }
                  social_media_page_modal(1, 0, 1, title, html_content).done(function() {});
                } else {
                  jQuery('#overlay').remove();
                  window.location.reload();
                }
              }
            },
            error: function(textStatus, errorThrown) {
              jQuery('#overlay').remove();
              social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
            }
          });
        });
        jQuery('body #nav-myposts').on('click', 'button.social-media-config-btn', function(e) {
          jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
          var social_media_name = 'Facebook';
          var mids = new Array();
          var selected_photo = 0;
          var selected_video = 0;
          var selected_remote = 0;
          var error = 0;
          mids = jQuery('#nav-myposts table.media-table tbody tr input[type=checkbox]:checked').map(function() {
            if (jQuery(this).parents("[id^=nav-photo-kit-]").length) {
              selected_photo++;
            }
            if (jQuery(this).parents("[id^=nav-video-kit-]").length) {
              selected_video++;
            }
            return jQuery(this).data('mid')
          }).get();
          if (social_media_name10 == 'Facebook') {
            var page_or_account = parseInt(jQuery('#nav-myposts select#page_id').val());
            if ((selected_photo >= 1 && (selected_video > 0)) || selected_video > 1) {
              error = 1;
              var error_message = 'You may not mix asset types in a single post such as photos and videos. You may post 1 or more photos, or 1 video to this post.';
            } else if (selected_photo == 0 && selected_video == 0 && jQuery('#nav-myposts textarea').val() == '') {
              error = 1;
              var error_message = "Please fill text field or chose media kit. Blank post can't be submitted";
            }
          }
          if (social_media_name10 == 'Twitter') {
            if (selected_photo > 4 || (selected_photo > 0 && selected_video > 0)) {
              error = 1;
              var error_message = 'You may tweet either photos upto 4 or 1 video ';
            } else if (selected_video > 1) {
              error = 1;
              var error_message = 'You may tweet either photos upto 4 or 1 video';
            }
          }
          if (social_media_name10 == 'Instagram') {
            var page_or_account = jQuery('#nav-myposts select#account_id').val();
            if ((selected_photo > 1 || selected_video > 1) || (selected_photo == 1 && selected_video == 1)) {
              error = 1;
              var error_message = 'You may post either 1 photo or 1 video ';
            } else if (selected_photo == 0 && selected_video == 0) {
              error = 1;
              var error_message = 'Please select either 1 photo or 1 video ';
            }
          }
          if (error == 1) {
            var title = '';
            var html_content = error_message;
            social_media_page_modal(1, 0, 0, title, html_content).done(function() {
              jQuery('#overlay').remove();
            }).fail(function() {
              console.log('cancel');
            });
            return;
          }
          if (jQuery('#auto-schedule-mypost').is(":checked")) {
            var scheduled_bubble = 1;
          } else {
            var scheduled_bubble = 0;
          }
          //get status of post from test
          var current_status_test = jQuery(this).text();
          // console.log(current_status_test);
          if (current_status_test == 'SCHEDULE') {
            var current_status = 'Scheduled';
          } else if (current_status_test == 'SAVE AS DRAFT') {
            var current_status = 'Draft';
          } else {
            var current_status = 'Post';
          }
          var ufid = jQuery('.wrap-mypost').data('ufid');
          //var post_id = jQuery('.listing-post-wrap.active-post').find('.current-post-id-to-delete').text();
          var post_id = jQuery('.mypost #post_id').val();
          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          jQuery.ajax({
            url: "/update-social-media-post"+querystring,
            data: {
              "uid": path_userid,
              "mid": mids,
              "ufid": ufid,
              "sid": parseInt(post_id),
              "page_id": page_or_account,
              "media_kit_id": jQuery('#media-kit-options-mypost select').find(":selected").val(),
              "text": jQuery('#nav-myposts textarea').val(),
              "status": current_status,
              "scheduled_bubble": scheduled_bubble,
              "action": 'save',
            },
            type: "POST",
            success: function(data) {
              var parse_data = JSON.parse(data);
              if (typeof parse_data == 'object') {
                if (parse_data.error) {
                  jQuery('#overlay').remove();
                  var title = '';
                  var html_content = parse_data.error.msg;
                  if (social_media_name10 == 'Facebook') {
                   var title = 'Facebook Error Reported'; 
                   var html_content = 'Facebook reported the following error:<br>' + parse_data.error.msg;                   
                  }else if(social_media_name10 == 'Instagram'){
                    var title = 'Instagram Error Reported'; 
                    var html_content = 'Instagram reported the following error:<br>' + parse_data.error.msg;                    
                  }
                  else if(social_media_name10 == 'Twitter'){
                    var title = 'Twitter Error Reported';  
                    var html_content = 'Twitter reported the following error:<br>' + parse_data.error.msg;
                  }
                  
                  social_media_page_modal(1, 0, 1, title, html_content).done(function() {});
                } else if (parse_data["result"] == 0) {
                  jQuery('#overlay').remove();
                  var html_content = "You have not scheduled this post. Please shedule this post first."
                  social_media_page_modal(1, 0, 0, '', html_content).done(function() {});
                } else {
                  jQuery('#overlay').remove();
                  window.location.reload();
                }
              }
            },
            error: function(textStatus, errorThrown) {
              jQuery('#overlay').remove();
              social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
            }
          });
        });
        //--------------------------------------------------------------------EDIT SOCIAL MEDIA FORM---------------------------------------------------------
        //............................................settings tab .........................................................
        //............................................custom auto comlete field(select item).............................................
        jQuery('body').on('click', '.custom-auto-complete .item-lists ul li', function(e) {
          var item_id = jQuery(this).find('.item-id').text();
          var item_name = jQuery(this).find('.item-name').text();
          var prepare_item = '<li>';
          prepare_item += '<span class="item-id d-none">' + item_id + '</span>';
          prepare_item += '<span class="item-name">' + item_name + '</span>';
          prepare_item += '<span style="padding-left:5px;cursor:pointer;" class="item-cancel">X</span>';
          prepare_item += '</li>';
          jQuery(this).parents('.custom-auto-complete').find('.selected-items ul').append(prepare_item);
          jQuery(this).parent('ul').find('li').remove();
        });
        //..........................................custom auto comlete field(remove selected items)............................
        jQuery('body').on('click', '.custom-auto-complete .selected-items li .item-cancel', function(e) {
          jQuery(this).parent('li').remove();
        });
        jQuery('body').on('keyup', '.custom-auto-complete input', function(e) {
          $this = jQuery(this);
          // var keyword = jQuery(this).val();
          var keyword = jQuery.trim(jQuery(this).val());
          if (keyword == '') {
            keyword = 'itsdonenever';
          }
          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          jQuery.ajax({
            url: '/FBPageCatagoriesAvail/' + keyword+querystring,
            data: {
              "mode": 'ajax',
            },
            type: "GET",
            success: function(data) {
              var prepare_item = '';
              jQuery.each(data, function(index, item) {
                prepare_item += '<li>';
                prepare_item += '<span class="item-id d-none">' + item.id + '</span>';
                prepare_item += '<span class="item-name">' + item.name + '</span>';
                prepare_item += '</li>';
              });
              // console.log(prepare_item);
              $this.parents('.custom-auto-complete').find('.item-lists ul').html(prepare_item);
            },
            error: function(textStatus, errorThrown) {
              jQuery('#overlay').remove();
              social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
            }
          });
        });
        jQuery('#nav-settings').on('focus', '.custom-fields textarea', function(e) {
          jQuery(this).parents('.custom-fields').find('.text-area-desc').show();
        });
        jQuery('#nav-settings').on('focusout', '.custom-fields textarea', function(e) {
          jQuery(this).parents('.custom-fields').find('.text-area-desc').hide();
        });
        jQuery(".profile-text-form textarea").keyup(function() {
          var el = this;
          setTimeout(function() {
            el.style.cssText = 'height:auto; padding:5px';
            el.style.cssText = 'height:' + el.scrollHeight + 'px';
          }, 0);
          var count_character = jQuery.trim(jQuery(this).val()).length;
          var get_char_limit = jQuery.trim(jQuery(this).parents(".custom-fields").find(".textcount-limit").text());
          //console.log(get_char_limit);
          if (count_character > get_char_limit) {
            jQuery(this).parents(".custom-fields").find(".textcount").text(count_character);
            jQuery(this).parents(".custom-fields").find(".textcount").css('color', '#fe5b03');
            jQuery(this).parents(".custom-fields").find(".textcount").addClass('error');
          } else {
            jQuery(this).parents(".custom-fields").find(".textcount").text(count_character);
            jQuery(this).parents(".custom-fields").find(".textcount").css('color', '#44609c');
            jQuery(this).parents(".custom-fields").find(".textcount").removeClass('error');
          }
        });
        jQuery('#nav-settings #photo-kit-content-section-profile ').on('click', '.box-check', function(e) {
          var $this = jQuery(this);
          var mid = '';
          jQuery('#nav-settings #photo-kit-content-section-profile input[type=checkbox]:checked').each(function() {
            jQuery(this).not($this).prop('checked', false);
            mid = $this.val();
          })
          //console.log(mid);
          if (mid !== '') {
            jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
            jQuery.ajax({
              url: '/getMediaUrl/' + mid,
              data: {
                "mode": 'ajax',
                "image_preset_tid": jQuery('.image-editor-nav-layout').find("a.active").attr("data-pId"),
              },
              type: "GET",
              success: function(data) {
                // jQuery('.image-editor').cropit('destroy');
                var TabContentId = jQuery('.image-editor-nav-layout').find("a.active").attr("href");
                var $imageCropper = jQuery('#' + jQuery(TabContentId).find('.image-editor').attr("id"));
                jQuery($imageCropper).cropit('destroy');
                var get_dimensions = $this.parents('tr.media-row').find('.photo-dimensions').text();
                var split_dimension = get_dimensions.split(" x ");
                var img_width = parseInt(split_dimension['0']);
                var img_height = parseInt(split_dimension['1']);
                var mediaKitId = $this.parents('#photo-kit-content-section-profile').find('#media-kit-options-profile select').val();
                if ((img_width < parseInt(data.media_preset.width)) || (img_height < parseInt(data.media_preset.height))) {
                  //alert("The selected image is smaller than the [preset name] requirement. While it is okay to use, you may wish to select a larger image from your Media Kit because scaling-up this image will create a blurry result.");
                  var message = "The selected image is smaller than the <b>" + data.media_preset.preset_name + "</b> requirement. While it is okay to use, you may wish to select a larger image from your Media Kit because scaling-up this image will create a blurry result.";
                  social_media_page_modal(1, 0, 0, '', message).done(function() {
                    $imageCropper.find('.wrap-button button').data("mid", mid);
                    $imageCropper.find('.wrap-button button').data("mediakit", mediaKitId);
                    ReplaceResizeImage($imageCropper, data.url_mid, data.media_preset.height, data.media_preset.width, 0, function(result) {
                      $imageCropper.find('.wrap-button button').removeClass('disabled');
                      $imageCropper.parents('.editor-class').find('.newpost-button .btn-primary').removeClass('disabled');
                      jQuery('#overlay').remove();
                    });
                  }).fail(function() {
                    console.log('cancel');
                  });
                } else {
                  $imageCropper.find('.wrap-button button').data("mid", mid);
                  $imageCropper.find('.wrap-button button').data("mediakit", mediaKitId);
                  ReplaceResizeImage($imageCropper, data.url_mid, data.media_preset.height, data.media_preset.width, 0, function(result) {
                    $imageCropper.find('.wrap-button button').removeClass('disabled');
                    $imageCropper.parents('.editor-class').find('.newpost-button .btn-primary').removeClass('disabled');
                    jQuery('#overlay').remove();
                  });
                }
              }
            });
          }
        });
        // cancel image cropped, reload original image
        /*       jQuery('.cancel-export').click(function(e) {
                 $this = jQuery(this);
                 jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
                           //jQuery(document).one('click', '#custom-modal .btn-primary', function(e) {
                 var preset_tid = $this.data('preset');
                 var mid = $this.data('mid');
                 var mediaKitId = $this.data('mediakit');
                 jQuery.ajax({
                   url: '/getMediaUrl/' + mid,
                   data: {
                     "mode": 'ajax',
                     "image_preset_tid": preset_tid,
                   },
                   type: "GET",
                   success: function(data) {
                     var $imageCropper = jQuery('#' + $this.parents('.image-editor').attr('id'));
                     jQuery($imageCropper).cropit('destroy');
                     ReplaceResizeImage($imageCropper, data.url_mid, data.media_preset.height, data.media_preset.width, 0, function(result) {
                       jQuery('#overlay').remove();
                     });
                   }
                 });
                 // jQuery('#nav-settings').find('#custom-modal').remove();
                 //}); 
               });

               jQuery('.ant-clock-rotate').click(function() {
                 jQuery(this).parents('.image-editor').cropit('rotateCCW');
               });
               jQuery('.clock-rotate').click(function() {
                 jQuery(this).parents('.image-editor').cropit('rotateCW');
               });
               
               */
        jQuery.each(settings_field, function(index, value) {
          if ((value.type == 'Image') && (value.enabled == '1')) {
            var mid = 'default';
            jQuery.ajax({
              url: '/getMediaUrl/' + mid,
              data: {
                "mode": 'ajax',
                "image_preset_tid": value.media_preset,
              },
              type: "GET",
              success: function(data) {
                var imagecroper_id = index.toLowerCase() + '-' + value.media_preset + '-image-editor';
                var $imageCropper = jQuery('.' + imagecroper_id.replace(" ", "-"));
                ReplaceResizeImage($imageCropper, value.value, data.media_preset.height, data.media_preset.width, 0, function(result) {});
              },
              error: function(textStatus, errorThrown) {
                jQuery('#overlay').remove();
                social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
              }
            });
          }
        });
        //callback to resize image respected to image editor dimensions
        function resizeImage(image_src, resize, fn) {
          var fileReader = new FileReader();
          if (image_src == '' || typeof image_src == 'undefined') {
            // 	var dataurl = 'https://image.shutterstock.com/image-photo/waterfall-deep-forest-huay-mae-600w-351772952.jpg'; 
            fn('blank');
          } else {
            var dataurl = image_src;
            var request = new XMLHttpRequest();
            request.open('GET', dataurl, true);
            request.responseType = 'blob';
            request.onload = function() {
              fileReader.readAsDataURL(request.response);
            };
            request.send();
            fileReader.onload = function(event) {
              var img = new Image();
              img.onload = function() {
                // console.log('image onload');
                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");
                canvas.width = parseFloat((img.width * resize) / 100);
                canvas.height = parseFloat((img.height * resize) / 100);
                context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
                fn(canvas.toDataURL());
              }
              img.src = event.target.result;
            };
          }
        }
        //callback to genrate Image Editor Tool
        function ReplaceResizeImage($imageCropper, image_src, media_preset_height, media_preset_width, is_popup, callback) {
          //'destroy not working as expected, below line is added.  this will remove already included image'
          $imageCropper.find('.cropit-preview-image-container').remove();
          var finished_size = parseFloat(media_preset_width) + 'w x ' + parseFloat(media_preset_height) + 'h';
          $imageCropper.find('.right-header .size').text(finished_size);
          if (is_popup) {
            $imageCropper.addClass('popup-class');
          }
          var originalHeight = parseFloat(media_preset_height);
          var originalWidth = parseFloat(media_preset_width);
          // if media preset height and weight is greater than 250px, we customize image editor dimensions as real dimensions cant be shown.
          // on the page. Image dimensions are also scaled based on image editor to maintain aspect ratio.
          if (originalHeight > 250 && originalWidth > 250) {
            if (originalWidth > originalHeight) {
              var previewScale = (originalHeight / 250);
              var resize = parseFloat((250 * 100) / originalHeight);
            } else {
              var previewScale = (originalWidth / 250);
              var resize = parseFloat((250 * 100) / originalWidth);
            }
            var previewHeight = originalHeight / previewScale;
            var previewWidth = originalWidth / previewScale;
          } else {
            var previewHeight = originalHeight;
            var previewWidth = originalWidth;
            resize = 100;
            previewScale = 1;
          }
          resizeImage(image_src, resize, function(resizeDataURL) {
            $imageCropper.cropit({
              allowDragNDrop: false,
              imageBackground: false,
              imageState: {
                src: resizeDataURL,
                //src: 'your_image_path/to_be_crop_image.jpg',
              },
              //freeMove: 'true',
              minZoom: 'fill',
              maxZoom: 4,
              smallImage: 'allow',
              width: previewWidth,
              height: previewHeight,
              exportZoom: previewScale,
              onImageLoading: function() {
                console.log('image is loading...');
              },
              onImageLoaded: function() {
                console.log('image is loaded callback');
                var img_width = $imageCropper.cropit('imageSize').width;
                var img_height = $imageCropper.cropit('imageSize').height;
                callback($imageCropper);
              },
            });
          });
        }
        //............................................user profile pic selector -----------------------------------
        //....................................calendar setting change start week.........................................................................
        jQuery('#nav-calendar').on('click', '#calendar-settings', function(e) {
          e.preventDefault();
          jQuery('.week-start-on').toggleClass('hidden');
          jQuery('.week-start-on input').each(function() {
            jQuery(this).click(function() {
              jQuery('#calendar').fullCalendar('option', 'firstDay', jQuery(this).val());
              if (jQuery('#calendar-settings').parents('.calendar-nav-layout').find('a.active').text() == 'TODAY') {
                jQuery('#calendar').find('.fc-today').closest('.fc-week').css('border', 'none');
                jQuery('#calendar').find('.fc-week .fc-today .fc-day-number').css('border', '2px solid #023364');
              } else if (jQuery('#calendar-settings').parents('.calendar-nav-layout').find('a.active').text() == 'THIS WEEK') {
                jQuery('#calendar').find('.fc-today').closest('.fc-week').css('border', '2px solid #023364');
                jQuery('#calendar').find('.fc-week .fc-today .fc-day-number').css('border', 'none');
              } else {
                jQuery('#calendar').find('.fc-today').closest('.fc-week').css('border', 'none');
                jQuery('#calendar').find('.fc-week .fc-today .fc-day-number').css('border', 'none');
              }
            });
          });
        });
        jQuery('body').on('click', '#nav-calendar', function(e) {
          if (jQuery(e.target).closest("#calendar-settings").length > 0 || jQuery(e.target).closest(".week-start-on").length > 0) {} else {
            if (!jQuery(this).find('.week-start-on.hidden').length) {
              jQuery('.week-start-on').addClass('hidden');
            }
          }
        });
        jQuery('#nav-calendar').on('click', '#post-today', function(e) {
          e.preventDefault();
          // if(!jQuery(this).parents('#nav-calendar').find('#tab-post-today').hasClass('activate')){
          var $this = jQuery(this);
          jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
          var appId = jQuery(this).parents('#nav-calendar').find('.calendar-header-first-half .hidden-content .appname').text();
          if (appId == 166) {
            var pageId = jQuery(this).parents('#nav-calendar').find('.calendar-header-first-half .hidden-content .page-id').text();
          } else if (appId == 168) {
            var pageId = jQuery(this).parents('#nav-calendar').find('.calendar-header-first-half .hidden-content .insta-account-id').text();
          } else {
            var pageId = 'NULL';
          }
          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          var url = '/get-social-media-post-by-date/' + appId + '/today/' + pageId+querystring;
          jQuery.ajax({
            url: url,
            data: {
              //"mode":'ajax',
              //"op":op,
              "pageID": pageId
            },
            type: "GET",
            success: function(data) {
              // if calendar was forworded/backworded then again set current date/month and set border to current date.
              jQuery('#calendar').fullCalendar('today');
              jQuery('#calendar').find('.fc-week .fc-today .fc-day-number').css('border', '2px solid #023364');
              jQuery('#calendar').find('.fc-today').closest('.fc-week').css('border', 'none');
              $this.parents('#nav-calendar').find('#tab-post-today').html(data.html);
              $this.parents('#nav-calendar').find('#tab-post-today').addClass('activate');
              jQuery('.fc-day-number').each(function() {
                jQuery(this).removeClass('selected-day');
              });
              localStorage.setItem("lastselectionday", '');
              jQuery("#overlay").remove();
            },
            error: function(textStatus, errorThrown) {
              jQuery('#overlay').remove();
              social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
            }
          });
          //  }
        });
        jQuery('#nav-calendar').on('click', '#post-this-week', function(e) {
          e.preventDefault();
          //if(!jQuery(this).parents('#nav-calendar').find('#tab-post-this-week').hasClass('activate')){
          var $this = jQuery(this);
          jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
          var appId = jQuery(this).parents('#nav-calendar').find('.calendar-header-first-half .hidden-content .appname').text();
          if (appId == 166) {
            var pageId = jQuery(this).parents('#nav-calendar').find('.calendar-header-first-half .hidden-content .page-id').text();
          } else if (appId == 168) {
            var pageId = jQuery(this).parents('#nav-calendar').find('.calendar-header-first-half .hidden-content .insta-account-id').text();
          } else {
            var pageId = 'NULL';
          }
          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          var url = '/get-social-media-post-by-date/' + appId + '/thisWeek/' + pageId+querystring;
          console.log(url);
          jQuery.ajax({
            url: url,
            data: {
              "pageID": pageId
            },
            type: "GET",
            success: function(data) {
              // if calendar was forworded/backworded then again set current date/month and remove border from current date.  
              jQuery('#calendar').fullCalendar('today');
              jQuery('#calendar').find('.fc-week .fc-today .fc-day-number').css('border', 'none');
              jQuery('#calendar').find('.fc-today').closest('.fc-week').css('border', '2px solid #023364');
              $this.parents('#nav-calendar').find('#tab-post-this-week').html(data.html);
              $this.parents('#nav-calendar').find('#tab-post-this-week').addClass('activate');
              jQuery('.fc-day-number').each(function() {
                jQuery(this).removeClass('selected-day');
              });
              localStorage.setItem("lastselectionday", '');
              jQuery("#overlay").remove();
            },
            error: function(textStatus, errorThrown) {
              jQuery('#overlay').remove();
              social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
            }
          });
          // }
        });
        jQuery('#nav-calendar').on('click', '#post-this-month', function(e) {
          e.preventDefault();
          //  if(!jQuery(this).parents('#nav-calendar').find('#tab-post-this-month').hasClass('activate')){
          var $this = jQuery(this);
          jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
          var appId = jQuery(this).parents('#nav-calendar').find('.calendar-header-first-half .hidden-content .appname').text();
          if (appId == 166) {
            var pageId = jQuery(this).parents('#nav-calendar').find('.calendar-header-first-half .hidden-content .page-id').text();
          } else if (appId == 168) {
            var pageId = jQuery(this).parents('#nav-calendar').find('.calendar-header-first-half .hidden-content .insta-account-id').text();
          } else {
            var pageId = 'NULL';
          }
          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          var url = '/get-social-media-post-by-date/' + appId + '/thisMonth/' + pageId+querystring;
          jQuery.ajax({
            url: url,
            data: {
              "pageID": pageId
            },
            type: "GET",
            success: function(data) {
              // if calendar was forworded/backworded then again set current date/month and remove border from current date.  
              jQuery('#calendar').fullCalendar('today');
              jQuery('#calendar').find('.fc-week .fc-today .fc-day-number').css('border', 'none');
              jQuery('#calendar').find('.fc-today').closest('.fc-week').css('border', 'none');
              $this.parents('#nav-calendar').find('#tab-post-this-month').html(data.html);
              $this.parents('#nav-calendar').find('#tab-post-this-month').addClass('activate')
              jQuery('.fc-day-number').each(function() {
                jQuery(this).removeClass('selected-day');
              });
              localStorage.setItem("lastselectionday", '');
              jQuery("#overlay").remove();
            },
            error: function(textStatus, errorThrown) {
              jQuery('#overlay').remove();
              social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
            }
          });
          //  }
        });
        //--------------------------------------------------------initialize full Calendar----------------------------------------------------------------
        if (jQuery("div").is("#nav-calendar")) {
          localStorage.setItem("lastselectionday", '');
          jQuery('#calendar').fullCalendar({
            height: 'auto',
            header: {
              left: 'prev',
              center: 'title',
              right: 'next,startWeek'
            },
            columnHeaderText: function(mom) {
              if (mom.days() === 5) {
                return 'FR'
              } else if (mom.days() === 4) {
                return 'TH';
              } else if (mom.days() === 3) {
                return 'WE';
              } else if (mom.days() === 2) {
                return 'TU';
              } else if (mom.days() === 1) {
                return 'MO';
              } else if (mom.days() === 0) {
                return 'SU';
              } else {
                return 'SA';
              }
            },
            eventAfterAllRender: function() {
              var events_date = [];
              jQuery('#calendar').fullCalendar('clientEvents', function(event) {
                var start = moment(event.start).format("YYYY-MM-DD");
                events_date.push(start);
              });
              $('.fc-day-number').each(function() {
                if (jQuery.inArray($(this).parent().attr("data-date"), events_date) !== -1) {
                  if ($(this).parent().attr("data-date") == localStorage.getItem("lastselectionday")) {
                    $(this).addClass('selected-day');
                  }
                  //console.log(localStorage.getItem("lastselectionday"));
                  $(this).append('<br><span class="is-event"></span>');
                  $(this).parent().css('cursor', 'pointer');
                } else {
                  $(this).append('<br><span class="no-event invisible">*</span>');
                }
              });
              if (jQuery('#calendar-settings').parents('.calendar-nav-layout').find('a.active').text() == 'TODAY') {
                jQuery('#calendar').find('.fc-today').closest('.fc-week').css('border', 'none');
                jQuery('#calendar').find('.fc-week .fc-today .fc-day-number').css('border', '2px solid #023364');
              } else if (jQuery('#calendar-settings').parents('.calendar-nav-layout').find('a.active').text() == 'THIS WEEK') {
                jQuery('#calendar').find('.fc-today').closest('.fc-week').css('border', '2px solid #023364');
                jQuery('#calendar').find('.fc-week .fc-today .fc-day-number').css('border', 'none');
              } else {
                jQuery('#calendar').find('.fc-today').closest('.fc-week').css('border', 'none');
                jQuery('#calendar').find('.fc-week .fc-today .fc-day-number').css('border', 'none');
              }
            },
            firstDay: 0,
            defaultView: 'month',
            timezone: 'UTC',
            events: events,
            //selectable: true,
            dayClick: function(date, allDay, jsEvent, view) {
              if (allDay) {
                // Clicked on the entire day
                var $this = $(this);
                $('.fc-day-top').each(function(i, obj) {
                  if ($(this).attr('data-date') == $this.attr('data-date')) {
                    if ($(this).find('.is-event').length) {
                      jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
                      var $_this = $(this);
                      var appId = jQuery.trim(jQuery(this).parents('#nav-calendar').find('.calendar-header-first-half .hidden-content .appname').text());
                      // console.log(appId);
                      if (appId == 166) {
                        var pageId = jQuery.trim(jQuery(this).parents('#nav-calendar').find('.calendar-header-first-half .hidden-content .page-id').text());
                      } else if (appId == 168) {
                        var pageId = jQuery(this).parents('#nav-calendar').find('.calendar-header-first-half .hidden-content .insta-account-id').text();
                      } else {
                        var pageId = 'NULL';
                      }
                      var querystring = '';
                      if(drupalSettings.team_query){
                        var team_query = drupalSettings.team_query;
                        querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
                      }
                     var url = '/get-social-media-post-by-date/' + appId + '/dayWise/' + pageId+querystring;
                      jQuery.ajax({
                        url: url,
                        data: {
                          //"mode":'ajax',
                          "pageID": pageId,
                          "date": $this.attr('data-date')
                        },
                        type: "GET",
                        success: function(data) {
                          $_this.parents('.calendar-tab-wrapper').find('#tab-post-day').html(data.html);
                          $_this.parents('#nav-calendar').find('#post-day').trigger('click');
                          $_this.find('.fc-day-number').addClass('selected-day');
                          $('.fc-day-top').not($_this).find('.fc-day-number').removeClass('selected-day');
                          localStorage.setItem("lastselectionday", $this.attr('data-date'));
                          //console.log($this.attr('data-date'));
                          jQuery("#overlay").remove();
                        },
                        error: function(textStatus, errorThrown) {
                          jQuery('#overlay').remove();
                          social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
                        }
                      });
                    } else {
                      console.log('this is not clickable');
                    }
                  }
                });
              }
            }
          });
        }
      }
    }
  };
})(jQuery, Drupal);
jQuery(document).ready(function(){
  //Display memebr team after click on tab.
  //jQuery('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  jQuery('a[data-toggle=tab]').click(function(e){
    var target = $(e.target).attr("href")
    if(jQuery('.member-content').length && target == '#nav-shared'){
      var uri = window.location.href.toString();
      if (uri.indexOf("?") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
      }
      jQuery('.member-content').addClass('d-none');
      jQuery('.member-teams').removeClass('d-none');
    }
  });
});
