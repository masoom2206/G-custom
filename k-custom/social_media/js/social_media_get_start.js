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
        // create standard modal dynamic
        function social_media_page_modal(ok_link, isCancel, isKnowledgebase, title, html_content){
            var def = $.Deferred();
            var buttons = {} ; 
            var modal_instance = '#Smp-general-modal';            
            if(isCancel) {
                modal_instance = '#Smp-general-modal2'; 
                buttons['cancel'] = function() {jQuery( this ).dialog( "close" );def.reject();};
            }
            if (isKnowledgebase) {
            buttons['search knowledge base'] = function () {
              //var knowledge_base_article = '/knowledgebase/social-media/twitter';
             // window.open(knowledge_base_article.value, '_blank');
            };
          }
            buttons['Ok'] = function() {jQuery( this ).dialog( "close" );def.resolve();},
              jQuery(modal_instance).dialog({
                autoOpen: true,
                width: 500,
               // height: 200,
                modal: true,
                resizable: false,
                buttons:buttons,
                open: function( event, ui ) {
                    jQuery(modal_instance).dialog('option', 'title', title);
                    jQuery(modal_instance).html(html_content);
                } 
            });
              return def.promise();
          }
        //--------------------------------------- start move Active Connection to Available Connection --------------------------------------------
        
        jQuery('#active-connections .network-setting').on('click', '.active-network', function() {
          var $this = jQuery(this);
          var title = '';
          var network_name = jQuery(this).attr('data-networkName');
          var html_content = 'Are you sure you wish to disconnect from ' +network_name+ '? You will need to reconnect again the next time you wish to integrate ' +network_name+ ' into your Kaboodle Media account.';
          social_media_page_modal(1, 1, 0, title, html_content).done(function() {
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
        
         function network_info_modal(moreinfo_link, continue_link, active_connection, title, html_content){
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
                            jQuery( this ).dialog( "close" );				
                        },
                        Continue: function() {
                           console.log(continue_link); 
                           if(active_connection){
                            window.location = continue_link;
                           } 
                           else{
                              jQuery(continue_link).find('.available-network').trigger('click'); 
                           } 
                           jQuery( this ).dialog( "close" );                           
                        }
                    },
                    open: function( event, ui ) {
                        jQuery('#network-info-modal').dialog('option', 'title', title);
                        jQuery("#network-info-modal").html(html_content);
                       // jQuery(this).find("span.ui-dialog-title").text('My New Title');
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
                           jQuery.each(data['dataValue'], function( key, value ) {
                               if(value.enabled){
                                   var list_class = 'available';
                               }
                               else{
                                  var list_class = 'not-available';   
                               }
                               html_content += '<li class="items-list d-flex align-items-center '+list_class+' ">'+value.name+'</li>';
                             } 
                            );   
                           html_content += '</ul>'
                          
                           if(data.knowledge_base_url == null){
                               var moreinfo_link = media_base_url;     
                           }
                           else{
                                var moreinfo_link = media_base_url+ '/' + data.knowledge_base_url.value;    
                           }
                           if($this.parents('#available-connections').length){
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
                           }
                           else{
                             var continue_link =  media_base_url + '/tools/social/media/'+ path_userid + '/' + network_id;
                              var active_connection = 1;                              
                           }
                                                
                          network_info_modal(moreinfo_link , continue_link, active_connection, network_title, html_content);  
                        }
                     });  
                  

                  
              });
             
        
        
        
        //--------------------------------------------- end move Active Connection to Available Connection ..................................
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
              jQuery('.social-media-access button#access-button').insertAfter( jQuery("p:contains([INSERT_CONNECTION_BUTTON])"));
              //jQuery("p:contains([INSERT CONNECTION BUTTON])").after(jQuery('.social-media-access button#access-button')[0].outerHTML);
              jQuery("p:contains([INSERT_CONNECTION_BUTTON])").css('display', 'none');
              jQuery("html, body").animate({
                scrollTop: 0
              }, "slow");
            },
            error: function (textStatus, errorThrown) {
             alert(textStatus.responseText);
             jQuery('#overlay').remove();
            }
          });
        });
        //-----------------------------------------------------------end social media rgistration ---------------------------------------------	
      }
    }
  };
})(jQuery, Drupal);
jQuery(document).ready(function(){
  //Display memebr team after click on tab.
  //jQuery('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  jQuery('a[data-toggle=tab]').click(function(){
    if(jQuery('.member-content').length){
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
