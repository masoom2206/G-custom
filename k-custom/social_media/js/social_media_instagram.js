/**
 
 * @file
 * Attaches behaviors for the social_media module.
 *
 */
(function($, Drupal) {
  var initialized;
  Drupal.behaviors.social_media_instagram = {
    attach: function(context, settings) {
      if (!initialized) {
        initialized = true;
        var path_userid = drupalSettings.path_userid;
        var knowledge_base_article = drupalSettings.knowledge_base_article;
        var settings_field = drupalSettings.settings_field;
        var isInstAccountExist = drupalSettings.isInstagramAccountExist;
        if (!isInstAccountExist) {
          var msg = 'Instagram reported the following error:<br> Your Instagram Account is not connected to Facebook Page. First connect your Instagram account to one of your Facebook Pages in order to continue.'
          social_media_page_modal(1, 0, 1, '', msg).done(function() {}).fail(function() {
            console.log('cancel');
          });
        }

        function social_media_page_modal(ok_link, isCancel, isKnowledgebase, title, html_content) {
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
        // load more comments for insta posts
        jQuery("body").on("click", ".instagram-single-post .more-comment, .instagram-single-post .more-replies", function(e) {
          var $this = jQuery(this);
          jQuery('<img class="loader-gif" src="/modules/custom/social_media/images/loading.gif">').insertBefore($this);
          if (jQuery(this).parents('.load-more-replies').length) {
            var options = 'loadReplies';
          } else {
            var options = 'loadComments';
          }
          var next_comments_url = jQuery(this).attr('data-next');
          jQuery.ajax({
            url: next_comments_url,
            type: "GET",
            success: function(data) {
              jQuery.ajax({
                url: "/InstaLoadMoreComments",
                data: {
                  "mode": 'ajax',
                  "data": data,
                  "option": options,
                },
                type: "POST",
                success: function(result) {
                  if (typeof JSON.parse(result) == 'object') {
                    var parse_data = JSON.parse(result);
                    if (parse_data.error) {
                      jQuery('#overlay').remove();
                      var html_content = 'Instagram reported the following error:<br>' + parse_data.error.msg ;
                      social_media_page_modal(1, 0, 1, 'Instagram Error Reported', html_content).done(function() {});
                    } else if (parse_data.response) {
                      if (options == 'loadComments') {
                        $this.parents('.displayed-comments').find('ul.comment-area li.comment-item').last().after(parse_data.response.data);
                      } else {
                        $this.parents('.comment-replies-section').find('ul.replies-section li').last().after(parse_data.response.data);
                      }
                      if (data.hasOwnProperty("paging")) {
                        $this.attr('data-next', data.paging.next);
                      } else {
                        $this.closest('.ajax-loadnext-comment').remove();
                      }
                      jQuery("img.loader-gif").remove();
                    }
                  }
                },
                error: function(textStatus, errorThrown) {
                  jQuery("img.loader-gif").remove();
                  social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
                }
              });
            },
            error: function(textStatus, errorThrown) {
              jQuery("img.loader-gif").remove();
              social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
            }
          });
        });
        // enable/disable comments 
        jQuery('body').on('mouseenter', '.insta-single-post-op', function() {
          jQuery(this).find('.insta-single-post-op-content').css('display', 'block');
        });
        jQuery('body').on('mouseleave', '.insta-single-post-op', function() {
          jQuery(this).find('.insta-single-post-op-content').css('display', 'none');
        });
        jQuery("body").on("click", ".instagram-single-post .insta-single-post-op-content li", function(e) {
          jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
          var $this = jQuery(this);
          var media_id = jQuery(this).find('span').attr('data-url');
          var action = jQuery(this).find('span').attr('data-action');
          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          jQuery.ajax({
            url: "/InstaIsEnabledComment/" + media_id+querystring,
            data: {
              "mode": 'ajax',
              "action": action,
            },
            type: "POST",
            success: function(data) {
              if (typeof JSON.parse(data) == 'object') {
                var parse_data = JSON.parse(data);
                if (parse_data.error) {
                  jQuery('#overlay').remove();
                  var html_content = 'Instagram reported the following error:<br>' + parse_data.error.msg ;
                  social_media_page_modal(1, 0, 1, 'Instagram Error Reported', html_content).done(function() {});
                } else if (parse_data.response) {
                  jQuery('#overlay').remove();
                  $this.parents('.instagram-single-post').remove();
                  jQuery('.path-tools #main-wrapper').append(parse_data.response.data);
                  initializeOwlCarousal();
                }
              }
            },
            error: function(textStatus, errorThrown) {
              jQuery('#overlay').remove();
              social_media_page_modal(1, 0,0, '', textStatus.responseText).done(function() {});
            }
          });
        });
        // delete replies/comments for instagram post
        jQuery("body").on("click", ".instagram-single-post .delete-comment", function(e) {
          var $this = jQuery(this);
          jQuery('<img class="loader-gif" src="/modules/custom/social_media/images/loading.gif">').insertBefore($this);
          var id = jQuery(this).attr('data-commentID');
          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          jQuery.ajax({
            url: "/InstaDeleteComments/" + id+querystring,
            data: {
              "mode": 'ajax',
            },
            type: "POST",
            success: function(data) {
              if (typeof JSON.parse(data) == 'object') {
                var parse_data = JSON.parse(data);
                if (parse_data.error) {
                  jQuery("img.loader-gif").remove();
                  var html_content = 'Instagram reported the following error:<br>' + parse_data.error.msg ;
                  social_media_page_modal(1, 0, 1, 'Instagram Error Reported', html_content).done(function() {});
                } else if (parse_data.response) {
                  $this.closest('li').remove();
                  jQuery("img.loader-gif").remove();
                }
              }
            },
            error: function(textStatus, errorThrown) {
              jQuery('#overlay').remove();
              social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
            }
          });
        });
        // show/hide replies against comments
        jQuery("body").on("click", ".instagram-single-post .hide-replies", function(e) {
          jQuery(this).parents('.comment-replies-section').find('.comment-replies-section-wrap').toggle('slow');
          jQuery(this).find('.caret-icon').toggleClass('fa-caret-up fa-caret-down');
        });
        // comment against post
        jQuery("#nav-engagement .engagement-inner-contents").on("input", ".insta-comment", function(e) {
          var text = jQuery(this).text();
          if (jQuery(this).text().length > 0) {
            jQuery(this).parents('.insta-comments').find('.post-comment').removeClass('disabled');
          } else {
            jQuery(this).parents('.insta-comments').find('.post-comment').addClass('disabled');
          }
        });
        jQuery("body").on("input", ".instagram-single-post .insta-comment", function(e) {
          var text = jQuery(this).text();
          if (jQuery(this).text().length > 0) {
            jQuery(this).parents('.insta-comments').find('.post-comment').removeClass('disabled');
          } else {
            jQuery(this).parents('.insta-comments').find('.post-comment').addClass('disabled');
          }
        });
        // insta publich comment on single post
        jQuery("body").on("click", ".instagram-single-post .post-comment", function(e) {
          var $this = jQuery(this);
          var insta_media_id = jQuery(this).parents('.insta-comments').attr('data-instamediaid');
          var message = jQuery(this).parents('.insta-comments').find('.insta-comment').text();
          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          jQuery('<img class="loader-gif" src="/modules/custom/social_media/images/loading.gif">').insertBefore($this);
          jQuery.ajax({
            url: "/InstaPublishComments/" + insta_media_id+querystring,
            data: {
              "message": message,
            },
            type: "POST",
            success: function(data) {
              if (typeof JSON.parse(data) == 'object') {
                var parse_data = JSON.parse(data);
                if (parse_data.error) {
                  jQuery("img.loader-gif").remove();
                  var html_content = 'Instagram reported the following error:<br>' + parse_data.error.msg ;
                  social_media_page_modal(1, 0, 1, 'Instagram Error Reported', html_content).done(function() {});
                } else if (parse_data.response) {
                  $this.parents('.insta-comments').find('.insta-comment').empty();
                  $this.addClass('disabled');
                  if ($this.parents('.instagram-single-post').find('.displayed-comments .comment-area').length) {
                    $this.parents('.instagram-single-post').find('.displayed-comments .comment-area').prepend(parse_data.response.data);
                    //scroll to newly added comment at the bottom
                    jQuery(".displayed-comments-wrap").scrollTop(0);
                    jQuery("img.loader-gif").remove();
                  }
                }
              }
            },
            error: function(textStatus, errorThrown) {
              jQuery("img.loader-gif").remove();
              social_media_page_modal(1, 0, 1, '', textStatus.responseText).done(function() {});
            }
          });
        });

        function placeCaretAtEnd(el) {
          el.focus();
          if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
          }
        }
        // insta reply against comments
        jQuery("body").on("click", ".displayed-comments .replies-against-comment", function(e) {
          var $this = jQuery(this);
          //var id = jQuery(this).attr('data-instaCommentId');
          var username = '@' + jQuery(this).attr('data-username');
          jQuery(this).parents('li.comment-item').find('.comment-replies-section .insta-comments-replies').removeClass('d-none');
          jQuery(this).parents('li.comment-item').find('.comment-replies-section .insta-comment-replies').text(username);
          placeCaretAtEnd(jQuery(this).parents('li.comment-item').find('.comment-replies-section .insta-comment-replies').get(0));
        });
        jQuery("body").on("click", ".comment-replies-section .post-comment-replies", function(e) {
          var $this = jQuery(this);
          var id = $this.parents('.insta-comments-replies').attr('data-instaCommentId');
          var username = $this.parents('.insta-comments-replies').attr('data-username');
          var message = jQuery(this).parents('.insta-comments-replies').find('.insta-comment-replies').text();
          jQuery('<img class="loader-gif" src="/modules/custom/social_media/images/loading.gif">').insertBefore($this);
          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          jQuery.ajax({
            url: "/InstaRepliesComment/" + id+querystring,
            data: {
              "message": message,
              "username": username,
            },
            type: "POST",
            success: function(data) {
              if (typeof JSON.parse(data) == 'object') {
                var parse_data = JSON.parse(data);
                if (parse_data.error) {
                  jQuery("img.loader-gif").remove();
                  var html_content = 'Instagram reported the following error:<br>' + parse_data.error.msg ;
                  social_media_page_modal(1, 0, 1, 'Instagram Error Reported', html_content).done(function() {});
                } else if (parse_data.response) {
                  $this.parents('.insta-comments-replies').addClass('d-none');
                  if ($this.parents('.comment-item').find('.replies-section').length) {
                    $this.parents('.comment-item').find('.replies-section').append(parse_data.response.data);
                  } else {
                    var prepare_replies = '<ul class="list-unstyled replies-section">' + parse_data.response.data + '</ul>';
                    $this.parents('.comment-item').find('.comment-replies-section .insta-comments-replies').before(prepare_replies);
                  }
                  jQuery("img.loader-gif").remove();
                }
              }
            },
            error: function(textStatus, errorThrown) {
              alert(textStatus.responseText);
              jQuery("img.loader-gif").remove();
            }
          });
        });
        // insta publish comment on engagement post
        jQuery("#nav-engagement .engagement-inner-contents").on("click", ".post-comment", function(e) {
          var $this = jQuery(this);
          var insta_media_id = jQuery(this).parents('.insta-comments').attr('data-instamediaid');
          var username = jQuery(this).parents('.insta-comments').attr('data-username');
          var message = jQuery(this).parents('.insta-comments').find('.insta-comment').text();;
          jQuery('<img class="loader-gif" src="/modules/custom/social_media/images/loading.gif">').insertBefore($this);
          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          jQuery.ajax({
            url: "/InstaPublishComments/" + insta_media_id+querystring,
            data: {
              "message": message,
            },
            type: "POST",
            success: function(data) {
              if (typeof JSON.parse(data) == 'object') {
                var parse_data = JSON.parse(data);
                if (parse_data.error) {
                  jQuery("img.loader-gif").remove();
                  var html_content = 'Instagram reported the following error:<br>' + parse_data.error.msg ;
                  social_media_page_modal(1, 0, 1, 'Instagram Error Reported', html_content).done(function() {});
                } else if (parse_data.response) {
                  $this.parents('.insta-comments').find('.insta-comment').empty();
                  $this.addClass('disabled');
                  var prepare_comment_html = "<li><b>" + username + " </b>" + message + "</li>";
                  if ($this.parents('.wrap-post-content-area').find('.insta-insight ul').length) {
                    $this.parents('.wrap-post-content-area').find('.insta-insight ul').append(prepare_comment_html);
                  } else {
                    var update_html = '<ul class="list-unstyled">' + prepare_comment_html + '</ul>';
                    $this.parents('.wrap-post-content-area').find('.insta-insight .comments-count').after(update_html);
                  }
                  jQuery("img.loader-gif").remove();
                }
              }
            },
            error: function(textStatus, errorThrown) {
              jQuery('#overlay').remove();
              social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
            }
          });
        });
        // view all comments modal
        jQuery("#nav-engagement .engagement-inner-contents").on("click", ".all-comments", function(e) {
          var $this = jQuery(this);
          jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
          var insta_media_id = jQuery(this).attr('data-instamediaid');
          console.log(insta_media_id);
          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          jQuery.ajax({
            url: "/InstaSinglePost/" + insta_media_id+querystring,
            data: {
              "mode": 'ajax',
            },
            type: "POST",
            success: function(data) {
              if (typeof JSON.parse(data) == 'object') {
                var parse_data = JSON.parse(data);
                if (parse_data.error) {
                  var html_content = 'Instagram reported the following error:<br>' + parse_data.error.msg ;
                  var title = 'Instagram Error Reported';
                  social_media_page_modal(1, 0, 1, 'Instagram Error Reported', html_content).done(function() {jQuery('#overlay').remove();});
                } else if (parse_data.response) {
                  jQuery('.path-tools #main-wrapper').append(parse_data.response.data);
                  initializeOwlCarousal();
                }
              }
            },
            error: function(textStatus, errorThrown) {
              jQuery('#overlay').remove();
              social_media_page_modal(1, 0,0, '', textStatus.responseText).done(function() {});
            }
          });
        });
        // close modal view comments
        jQuery("body").on("click", ".instagram-single-post .close-modal", function(e) {
          jQuery('#overlay').remove();
          jQuery(this).parents('.instagram-single-post').remove();
        });
        // instagram load more post
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '.load-more.ajax-loadnext-post a', function(event) {
          jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
          event.preventDefault();
          var $this = jQuery(this);
          var post_load_link = $this.attr('href');
          var instaAccountId = jQuery(this).parents('#nav-engagement').find('.current-insta-account').text();
          //console.log(instaAccountId);
          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          jQuery.ajax({
            url: post_load_link,
            type: "GET",
            success: function(data) {
              jQuery.ajax({
                url: "/InstaGetPost/" + instaAccountId+querystring,
                data: {
                  "mode": 'ajax',
                  "data": data,
                  "option": "loadPost",
                },
                type: "POST",
                success: function(result) {
                  if (typeof JSON.parse(result) == 'object') {
                    var parse_data = JSON.parse(result);
                    if (parse_data.error) {
                      var html_content = 'Instagram reported the following error:<br>' + parse_data.error.msg;
                      social_media_page_modal(1, 0, 1, 'Instagram Error Reported', html_content).done(function() {});
                    } else if (parse_data.response) {
                      jQuery('.post-content-area').last().after(parse_data.response.data);
                      initializeOwlCarousal();
                      if (typeof data.paging.next === 'undefined') {
                        $this.remove();
                      } else {
                        $this.attr('href', data.paging.next);
                      }
                      jQuery('#overlay').remove();
                    }
                  }
                },
                error: function(textStatus, errorThrown) {
                  jQuery('#overlay').remove();
                  social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
                }
              });
            },
            error: function(textStatus, errorThrown) {
              jQuery('#overlay').remove();
              social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
            }
          });
        });
        //-----------------owl-caroual if post has multi photo-----------------------
        initializeOwlCarousal();

        function initializeOwlCarousal() {
          jQuery("div[id^='multi-photo-carousal-']").owlCarousel({
            navigation: true, // Show next and prev buttons
            nav: true,
            items: 1,
            loop: true,
            margin: 10,
            //autoplay:true,
            //autoplayTimeout:2000,
            autoplayHoverPause: true,
            // slideSpeed : 2000,
            pagination: true,
            // paginationSpeed : 1900,
          });
        }
        //----------------------------change instagram account from mypost tab-------------------------------------------------------
        var current_insta_account = jQuery('.custom-my-post-headr select#account_id_mypost').val();
        jQuery('.custom-my-post-headr select#account_id_mypost').on('change', function(e) {
          e.preventDefault();
          var get_insta_account_id = jQuery(this).val();
          var get_insta_account_name = jQuery("select#account_id_mypost option:selected").text();
          var $this = jQuery(this);
          var message = 'You will be switched to <b>' + get_insta_account_name + '</b>. All the Tabs are specific to this Account. You can again switch to another Account from here.';
          social_media_page_modal(1, 1, 0, '', message).done(function() {
            var generate_page_url = window.location.href.split("?");
            window.location.replace(generate_page_url[0] + '?account_id=' + get_insta_account_id);
          }).fail(function() {
            $this.val(current_insta_account);
          });
        });
        /* jQuery('#nav-settings .social-media-text-profile').on('click', '.instagram-text-form .social-media-save-profile', function(event) {
           event.preventDefault();
           jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
           var $this = jQuery(this);
           var error = 0;
           var geterror = 0;
           var updateData = {};
           jQuery.each(settings_field, function(index, value) {
             if ((value.type == 'text') && (value.enabled == '1')) {
               var fieldClass = '.' + index.toLowerCase().replace(" ", "-") + '-field';
               if (jQuery(fieldClass).find('.textcount').hasClass('error')) {
                 var error = 1;
                 var message = index + ' Field has crossed the character limit. Please fix it and again submit. ';
               }
               updateData[index.toLowerCase()] = jQuery(fieldClass + ' textarea').val();
             }
             if ((value.type == 'auto_complete') && (value.enabled == '1')) {
               var fieldClass = '.' + index.toLowerCase().replace(" ", "-") + '-field';
               var items = [];
               jQuery(fieldClass).find('.selected-items li').each(function(e) {
                 items.push(jQuery(this).find('.item-id').text());
               });
               updateData[index.toLowerCase()] = items;
             }            
           });
           if (error == 1 || geterror == 1) {
             jQuery('#overlay').remove();
             return;
           }

           var appId = jQuery(this).parents('#nav-settings').find('.settings-tab-header .hidden-content .appname').text();

           if(geterror == 0){
             jQuery.ajax({
               url: '/instagram_Page_info_update/' + appId,
               data: {
                 "uid": path_userid,
                 "update": "true",
                 "updateData": updateData,
               },
               type: "POST",
               success: function(data) {
                 console.log('success data');
                 console.log(data);
                 if (data.success == true) {
                   var kaboodle_modal = '<div class="modal fade show" id="custom-modal" role="dialog" style="padding-right: 17px; display: block;">'
                   kaboodle_modal += '<div class="modal-dialog modal-dialog-centered" role="document">'
                   kaboodle_modal += '<div class="modal-content">'
                   kaboodle_modal += '<div class="modal-body">Your Page Info is updated successfully.</div>'
                   kaboodle_modal += '<div class="modal-footer delete-post-footer">'
                   kaboodle_modal += '<button class="btn btn-primary" data-dismiss="modal" >Okay</button>'
                   kaboodle_modal += '</div>'
                   kaboodle_modal += '</div>'
                   kaboodle_modal += '</div>'
                   kaboodle_modal += '</div>'
                   jQuery('#nav-settings-tab').prepend(kaboodle_modal);
                   event.stopPropagation();
                   jQuery(document).one('click', '#custom-modal .btn-primary', function(e) {
                     jQuery('#nav-settings-tab').find('#custom-modal').remove();
                     jQuery('#overlay').remove();
                   })
                 } else {

                   var kaboodle_modal = '<div class="modal fade show" id="custom-modal" role="dialog" style="padding-right: 17px; display: block;">'
                   kaboodle_modal += '<div class="modal-dialog modal-dialog-centered" role="document">'
                   kaboodle_modal += '<div class="modal-content">'
                   kaboodle_modal += '<div class="modal-body">Something unexpected happened. Please try later</div>'
                   kaboodle_modal += '<div class="modal-footer delete-post-footer">'
                   kaboodle_modal += '<button class="btn btn-primary" data-dismiss="modal" >Okay</button>'
                   kaboodle_modal += '</div>'
                   kaboodle_modal += '</div>'
                   kaboodle_modal += '</div>'
                   kaboodle_modal += '</div>'
                   jQuery('#nav-settings-tab').prepend(kaboodle_modal);
                   event.stopPropagation();
                   jQuery(document).one('click', '#custom-modal .btn-primary', function(e) {
                     jQuery('#nav-settings-tab').find('#custom-modal').remove();
                     jQuery('#overlay').remove();
                   })
                 }
               },
               error: function(data) {
                 console.log('error data');
               }
             });
           }

         });*/
      }
    }
  };
})(jQuery, Drupal);