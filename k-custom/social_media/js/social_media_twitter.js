/**
 
 * @file
 * Attaches behaviors for the social_media module.
 *
 */
(function ($, Drupal) {
  var initialized;
  Drupal.behaviors.social_media_twitter = {
    attach: function (context, settings) {
      if (!initialized) {
        initialized = true;
        var path_userid = drupalSettings.path_userid;
        var knowledge_base_article = drupalSettings.knowledge_base_article;
        //console.log(knowledge_base_article);
        var settings_field = drupalSettings.settings_field;
        jQuery("[contenteditable]").focusout(function () {
          var element = jQuery(this);
          if (!element.text().trim().length) {
            element.empty();
          }
        });

        function social_media_page_modal(isOk, isCancel, isKnowledgebase, title, html_content) {
          var def = $.Deferred();
          var buttons = {};
          var modal_instance = '#Smp-general-modal';
          if (isCancel) {
            modal_instance = '#Smp-general-modal2';  
            buttons['cancel'] = function () {
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
          buttons['Ok'] = function () {
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
              open: function (event, ui) {
                jQuery(modal_instance).dialog('option', 'title', title);
                jQuery(modal_instance).html(html_content);
              }
            });
          return def.promise();
        }

        // -------------------------------------------------------- Settings Tab ----------------------------------------------------
        //--------------------------------------------------- update profile image and banner---------------------------
        jQuery('#nav-settings .image-editor-wrapper').on('click', '#save-profile-image-Twitter', function (event) {
          jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
          if (jQuery(this).parents('.editor-class').attr('id').indexOf("banner") >= 0) {
            var imageProfileType = 'update_profile_banner';
          } else {
            var imageProfileType = 'update_profile_image';
          }

          var imageData = jQuery(this).parents('.editor-class').find('.image-editor').cropit('export', {
            type: 'image/jpeg',
            fillBg: '#000',
            quality: 1.0,
            originalSize: true,
          });

          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          jQuery.ajax({
            url: '/twitter_profile_image_upload'+querystring,
            data: {
              "uid": path_userid,
              "base64_string": imageData,
              "imageProfileType": imageProfileType,
            },
            type: "POST",
            success: function (data) {
              if (typeof JSON.parse(data) == 'object') {
                var parse_data = JSON.parse(data);
                if (parse_data.error) {
                  var html_content = parse_data.error.msg;
                  social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function () {
                    jQuery('#overlay').remove();
                  });
                } else if (parse_data.response) {
                  console.log('asasas');
                  social_media_page_modal(1, 0, 1, '', parse_data.response.msg).done(function () {
                    jQuery('#overlay').remove();
                  });
                }
              }

            },
            error: function (textStatus, errorThrown) {
              social_media_page_modal(1, 0, 1, '', textStatus.responseText).done(function () {
                jQuery('#overlay').remove();
              });
            }
          });
        });
        //----------------------------------------------------update profile--------------------------------------------
        jQuery('#nav-settings .social-media-text-profile').on('click', '.twitter-text-form .social-media-save-profile', function (event) {
          event.preventDefault();
          jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
          var $this = jQuery(this);
          var updateData = {};
          jQuery.each(settings_field, function (index, value) {
            if ((value.type == 'text') && (value.enabled == '1')) {
              var fieldClass = '.' + index.toLowerCase().replace(" ", "-") + '-field';
              //console.log(fieldClass);
              updateData[index.toLowerCase()] = jQuery(fieldClass + ' textarea').val();
              console.log(jQuery('+fieldClass+ textarea'));
            }
          });
          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          //console.log(updateData);
          jQuery.ajax({
            url: '/twitter_update_profile'+querystring,
            data: {
              "uid": path_userid,
              "update": "true",
              "UpdateData": updateData,
            },
            type: "POST",
            success: function (data) {
              if (data.code == '200') {
                $this.parents('.twitter-text-form').find(".name-field textarea").val(data.content.name);
                $this.parents('.twitter-text-form').find(".name-field textarea").trigger("keyup");
                $this.parents('.twitter-text-form').find(".bio-field textarea").val(data.content.description);
                $this.parents('.twitter-text-form').find(".bio-field textarea").trigger("keyup");
                $this.parents('.twitter-text-form').find(".location-field textarea").val(data.content.location);
                $this.parents('.twitter-text-form').find(".location-field textarea").trigger("keyup");
                $this.parents('.twitter-text-form').find(".website-field textarea").val(data.content.website);
                $this.parents('.twitter-text-form').find(".website-field textarea").trigger("keyup");
              } else {
                //alert(data.message);
              }
              social_media_page_modal(1, 0, 1, '', data.message).done(function () {
                jQuery('#overlay').remove();
              }).fail(function () {
                console.log('cancel');
              });

            },
            error: function (textStatus, errorThrown) {
              alert(textStatus.responseText);
              jQuery('#overlay').remove();
            }
          });
        });
        jQuery('#nav-settings .social-media-text-profile').on('click', '.social-media-cancel-profile', function (event) {
          event.preventDefault();
          var $this = jQuery(this);
          social_media_page_modal(1, 1, 0, '', 'Are you sure to cancel?').done(function () {
            jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
            var querystring = '';
            if(drupalSettings.team_query){
              var team_query = drupalSettings.team_query;
              querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
            }
            // cancel profile update, get older profile
            jQuery.ajax({
              url: '/twitter_update_profile'+querystring,
              data: {
                "uid": path_userid,
                "update": "false"
              },
              type: "POST",
              success: function (data) {
                $this.parents('.twitter-text-form').find(".name-field textarea").val(data.content.name);
                $this.parents('.twitter-text-form').find(".name-field textarea").trigger("keyup");
                $this.parents('.twitter-text-form').find(".bio-field textarea").val(data.content.description);
                $this.parents('.twitter-text-form').find(".bio-field textarea").trigger("keyup");
                $this.parents('.twitter-text-form').find(".location-field textarea").val(data.content.location);
                $this.parents('.twitter-text-form').find(".location-field textarea").trigger("keyup");
                $this.parents('.twitter-text-form').find(".website-field textarea").val(data.content.website);
                $this.parents('.twitter-text-form').find(".website-field textarea").trigger("keyup");

                jQuery('#overlay').remove();
              },
              error: function (textStatus, errorThrown) {
                alert(textStatus.responseText);
                jQuery('#overlay').remove();
              }
            });
          }).fail(function () {
            console.log('cancel');
          });

        });
        //-------------------------------------------------------------tweets likes-------------------------------------
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '.post-content-area .twitter-engaged .tweets-likes a', function (event) {
          event.preventDefault();
          var $this = jQuery(this);
          jQuery(this).append('<img class="loader-gif" src="/modules/custom/social_media/images/loading.gif">');

          jQuery.ajax({
            url: jQuery(this).attr('href'),
            data: {
              "uid": path_userid,
            },
            type: "POST",
            success: function (data) {
              if (typeof JSON.parse(data) == 'object') {
                var parse_data = JSON.parse(data);
                if (parse_data.error) {
                  var html_content = 'Twitter reported the following error:<br>' + parse_data.error.msg;
                  social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function () {
                    jQuery("img.loader-gif").remove();
                  });
                } else if (parse_data.response) {
                  var url = $this.attr('href');
                  var split_url = url.split("/");
                  if (split_url[2] == 'create') {
                    var new_url = '/' + split_url[1] + '/destroy/' + split_url[3];
                    $this.attr('href', new_url);
                    $this.parents('.tweets-likes').removeClass('liked');
                    $this.parents('.tweets-likes').find('img').attr('src', '/modules/custom/social_media/images/FacebookIcons/Facebook-liked-128px.png');
                  } else {
                    var new_url = '/' + split_url[1] + '/create/' + split_url[3];
                    $this.attr('href', new_url);
                    $this.parents('.tweets-likes').addClass('liked');
                    $this.parents('.tweets-likes').find('img').attr('src', '/modules/custom/social_media/images/twitter/twitter-like-black.png');
                  }
                  jQuery("img.loader-gif").remove();
                }
              }
            },
            error: function (textStatus, errorThrown) {
              social_media_page_modal(1, 0, 1, '', textStatus.responseText).done(function () {
                jQuery("img.loader-gif").remove();
              });
            }
          });
        });
        //------------------------------------------------------load more tweet.................................................................
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '.ajax-loadnext-post a', function (event) {
          event.preventDefault();
          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          let $this = jQuery(this);
          var url = $this.attr('href');
          jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
          jQuery.ajax({
            url: url,
            data: {},
            type: "POST",
            success: function (data) {
              if (typeof JSON.parse(data) == 'object') {
                var parse_data = JSON.parse(data);
                if (parse_data.error) {
                  var html_content = parse_data.error.msg;
                  social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function () {
                    jQuery('#overlay').remove();
                  });
                } else if (parse_data.response) {
                  if (parse_data.response.data.last_trace_tweet != -1) {
                    jQuery('.post-content-area').last().after(parse_data.response.data.markup);
                    var update_url = '/twitter/get_latest_tweet/' + parse_data.response.data.last_tweet+querystring;
                    $this.attr('href', update_url);
                  } else {
                    $this.remove();
                  }
                  jQuery('#overlay').remove();
                }
              }

            },
            error: function (textStatus, errorThrown) {
              social_media_page_modal(1, 0, 1, '', textStatus.responseText).done(function () {
                jQuery('#overlay').remove();
              });

            }
          });
        });
        //.....................................................delete tweets....................................................................
        jQuery('#nav-engagement .engagement-inner-contents').on('mouseenter', '.post-content-area .post-operation-block', function () {
          jQuery(this).find('.post-operation-content').css('display', 'block');
        });
        jQuery('#nav-engagement .engagement-inner-contents').on('mouseleave', '.post-content-area .post-operation-block', function () {
          jQuery(this).find('.post-operation-content').css('display', 'none');
        });
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '.post-content-area .post-operation-content ul li a.delete-tweet', function (event) {
          event.preventDefault();
          let $this = jQuery(this);
          var html_content = 'Are you sure you want to permanently delete this tweet from Twitter?';
          social_media_page_modal(1, 1, 0, 'Delete Tweet', html_content).done(function () {
            let url = $this.attr('href');
            jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
            jQuery.ajax({
              url: url,
              data: {
                "mode": 'ajax',
              },
              type: "POST",
              success: function (data) {
                if (typeof JSON.parse(data) == 'object') {
                  var parse_data = JSON.parse(data);
                  if (parse_data.error) {
                    var html_content = 'Twitter reported the following error:<br>' + parse_data.error.msg;
                    social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function () {
                      jQuery('#overlay').remove();
                    });
                  } else if (parse_data.response) {
                    $this.parents('.post-content-area').remove();
                    jQuery('#overlay').remove();
                  }
                }
              },
              error: function (textStatus, errorThrown) {
                social_media_page_modal(1, 0, 1, '', textStatus.responseText).done(function () {
                  jQuery('#overlay').remove();
                });
              }
            });
          }).fail(function () {
            console.log('cancel');
          });

        });
        //-----------------------------------------------------------change button text follow/unfollow------------------------------------------------------
        jQuery(".twitter-specific-modal").on("mouseover", "a.un-follow-button", function () {
          //stuff to do on mouseover
          jQuery(this).text('UnFollow');
        });
        jQuery(".twitter-specific-modal").on("mouseout", "a.un-follow-button", function () {
          //stuff to do on mouseout
          jQuery(this).text('following');
        });
        //-----------------------------------------------------------------follow/unfollow-----------------------------------------------------------
        jQuery(".twitter-specific-modal").on("click", "a.follow-unfollow", function (event) {
          event.preventDefault();
          var $this = jQuery(this);
          jQuery.ajax({
            url: jQuery(this).attr("href"),
            data: {},
            type: "POST",
            success: function (data) {
              if (typeof JSON.parse(data) == 'object') {
                var parse_data = JSON.parse(data);
                if (parse_data.error) {
                  $this.parents('#modal-twitter-user-follower-fllowing-list').find('.twitter-tweet-header .btn-cancel').trigger('click');
                  var html_content = 'Twitter reported the following error:<br>' + parse_data.error.msg;
                  social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function () {});
                } else if (parse_data.response) {
                  if (parse_data.response.msg == 'destroy') {
                    $this.text('following');
                    //$this.attr("href").replace("create", "destroy");
                    $this.attr("href", $this.attr("href").replace("create", "destroy"));
                    $this.addClass("un-follow-button");
                    $this.removeClass("follow-button");
                  } else {
                    $this.text('follow');
                    // $this.attr("href","//fff");
                    $this.attr("href", $this.attr("href").replace("destroy", "create"));
                    $this.removeClass('un-follow-button');
                    $this.addClass('follow-button');
                  }
                }
              }

            },
            error: function (textStatus, errorThrown) {
              $this.parents('#modal-twitter-user-follower-fllowing-list').find('.twitter-tweet-header .btn-cancel').trigger('click');
              social_media_page_modal(1, 0, 1, '', textStatus.responseText).done(function () {});
            }
          });
        });
        jQuery(".profile-block-wraper").on("click", ".twitter-followers-list", function (event) {
          jQuery('.twitter-user-follower-fllowing-list #nav-myfollowers-tab').trigger('click');
        });
        jQuery(".profile-block-wraper").on("click", ".twitter-following-list", function (event) {
          jQuery('.twitter-user-follower-fllowing-list #nav-myfollowing-tab').trigger('click');
        });
        jQuery(document).on('keyup', '.send-tweet-footer textarea', function (e) {
          var el = this;
          setTimeout(function () {
            el.style.cssText = 'height:auto; padding:5px';
            // for box-sizing other than "content-box" use:
            // el.style.cssText = '-moz-box-sizing:content-box';
            el.style.cssText = 'height:' + el.scrollHeight + 'px';
          }, 0);
        });
        //--------------------------------------------------textarea comment field (tweet with comment) auto expand.............................
        function autosize_comment_box() {
          var el = this;
          setTimeout(function () {
            el.style.cssText = 'height:auto; padding:0';
            // for box-sizing other than "content-box" use:
            // el.style.cssText = '-moz-box-sizing:content-box';
            el.style.cssText = 'height:' + el.scrollHeight + 'px';
          }, 0);
        }
        //-------------------------------------send tweet via DM remove users----------------------------------------------------------------
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '.post-content-area .twitter-engaged .send-tweet-via-dm-modal .selected-twitter-users ul li', function (event) {
          if (jQuery(this).siblings().length == 0) {
            jQuery(this).parents('.send-tweet-via-dm-modal').find('.send-tweet-footer .send-tweet-via-dm').addClass("disabled");
            jQuery(this).parents('.send-tweet-via-dm-modal').find('.send-tweet-footer textarea').attr("disabled", "true");
          } else {
            jQuery(this).parents('.send-tweet-via-dm-modal').find('.send-tweet-footer .send-tweet-via-dm').removeClass("disabled");
            jQuery(this).parents('.send-tweet-via-dm-modal').find('.send-tweet-footer textarea').removeAttr("disabled");
          }
          jQuery(this).remove();
        });
        //--------------------------------------------------chose from search users ----------------------------------------------------------------
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '.post-content-area .twitter-engaged .send-tweet-via-dm-modal .search-twitter-users ul li', function (event) {
          jQuery(this).parents('.send-tweet-via-dm-modal').find('.send-tweet-footer .send-tweet-via-dm').removeClass("disabled");
          jQuery(this).parents('.send-tweet-via-dm-modal').find('.send-tweet-footer textarea').removeAttr("disabled");
          var user_pic = jQuery(this).parents('.send-tweet-via-dm-modal').find('.search-twitter-users ul li .wrap-items img').attr('src');
          var user_screen_name = jQuery(this).find('.wrap-items .screen-name strong').text();
          // var user_name = jQuery(this).parents('.send-tweet-via-dm-modal').find('.search-twitter-users ul li .user-name').text();
          var user_id = jQuery(this).find('.wrap-items .user-id').text();
          var custom_html = '<li><div><img src="' + user_pic + '" class="rounded-circle" alt="pic" width="25" height="25"><span class="user-screen-nanme">' + user_screen_name + '</span><span class="remove-user">X</span><div class="user-id d-none">' + user_id + '</div></div></li>';
          jQuery(this).parents('.send-tweet-via-dm-modal').find('.selected-twitter-users ul').append(custom_html);
          jQuery(this).parents('.search-twitter-users').find('ul').remove();
        });
        //------------------------------------------------search tweet users.........................................................
        jQuery('#nav-engagement .engagement-inner-contents').on('keyup', '.twitter-engaged .send-tweet-via-dm-modal .search-user', function (e) {
          var $this = jQuery(this);
          var search_key = jQuery.trim(jQuery(this).val());
          if (search_key.length == 0) {
            search_key = 'itsdonenever';
          }
          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          jQuery.ajax({
            url: '/twitter_search_user/' + search_key+querystring,
            data: {},
            type: "POST",
            success: function (data) {
              if (typeof JSON.parse(data) == 'object') {
                var parse_data = JSON.parse(data);
                if (parse_data.error) {
                  var html_content = 'Twitter reported the following error:<br>' + parse_data.error.msg;
                  social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function () {
                    jQuery('#overlay').remove();
                  });
                } else if (parse_data.response) {
                  // console.log(parse_data.response);
                  jQuery('#overlay').remove();
                  $this.parents('.send-tweet-via-dm-modal').find('.search-twitter-users').html(parse_data.response.data);
                }
              }
            },
            error: function (textStatus, errorThrown) {
              social_media_page_modal(1, 0, 1, '', textStatus.responseText).done(function () {
                jQuery('#overlay').remove();
              });
            }
          });
        });
        //------------------------------------send tweet via DM----------------------------------------------------------------------------
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '.post-content-area .twitter-engaged .send-tweet-via-dm', function (event) {
          //jQuery(this).parents('.send-tweet-via-dm-modal').css("display", 'none');
          var user_ids = jQuery(this).parents('.send-tweet-via-dm-modal').find('.selected-twitter-users ul li .user-id').map(function () {
            return jQuery(this).text()
          }).get();
          var tweet_url_to_send = jQuery(this).parents('.send-tweet-via-dm-modal').find('.attchmentUrl').val();
          var comment = jQuery(this).parents('.send-tweet-via-dm-modal').find('.send-tweet-footer textarea').val();
          var querystring = '';
          if(drupalSettings.team_query){
            var team_query = drupalSettings.team_query;
            querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
          }
          jQuery.ajax({
            url: '/twitter/send_tweet_via_DM'+querystring,
            data: {
              'attached': tweet_url_to_send,
              'user_ids': user_ids,
              'comment': comment
            },
            type: "POST",
            success: function (data) {
              if (typeof JSON.parse(data) == 'object') {
                var parse_data = JSON.parse(data);
                console.log(parse_data);

                if (parse_data.error) {
                 var html_content = 'Twitter reported the following error:<br>' + parse_data.error.msg;
                  social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function () {
                    jQuery('#overlay').remove();
                  });
                } else if (parse_data.response) {
                  console.log(parse_data.response);
                  var output = '';
                  jQuery.each(parse_data.response, function (index, value) {
                    output += '<li>' + value.message + '</li>';
                  });
                  social_media_page_modal(1, 0, 0, '', output).done(function () {
                    jQuery('#overlay').remove();
                  });

                }
              }

            },
            error: function (textStatus, errorThrown) {
              social_media_page_modal(1, 0, 1, '', textStatus.responseText).done(function () {
                jQuery('#overlay').remove();
              });
            }
          });
        });

        //------------------------------------------------- add function to user_mentions support --------------------------------------------
        jQuery('#nav-newpost textarea,#nav-myposts textarea ').atwho({
          searchKey: "screen_name",
          displayTpl: "<li style=,clear:both;width:300px;height:80px'><img style='width:20px;height:20px' src='${profile_image_url_https}' class='rounded-circle border-images float-left' alt='pic'><div><div class='screen-name'><strong>${name}</strong> </div> <div class='user-name>@${screen_name}</div> </div></li>",
          insertTpl: "@${screen_name}",
          at: "@",
          limit: 3,
          callbacks: {
            remoteFilter: function (query, callback, param) {
              if (query.length > 0) {
                var querystring = '';
                if(drupalSettings.team_query){
                  var team_query = drupalSettings.team_query;
                  querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
                }
                jQuery.ajax({
                  url: '/twitter_search_user/' + query+querystring,
                  data: {
                    'mode': 'ajax',
                    'purpose': 'user_mentions'
                  },
                  type: "POST",
                  success: function (data) {
                    callback(data)
                  }
                });
              }
            }
          }
        });
        //---------------------------------------------comments against tweet----------------------------------------------------------
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '.post-content-area .send-tweet-footer a.send-tweet-via-comments', function (event) {
          event.preventDefault();
          let $this = jQuery(this);
          let url = $this.attr("href");
          let comment = $this.parents(".twitter-comments-replies").find(".custom-tweet-box").text();
          console.log('Mas comment'+comment);
          jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
          jQuery.ajax({
            url: url,
            data: {
              "comment": comment,
            },
            type: "POST",
            success: function (data) {
              if (typeof JSON.parse(data) == 'object') {
                var parse_data = JSON.parse(data);
                if (parse_data.error) {
                  var html_content = 'Twitter reported the following error:<br>' + parse_data.error.msg;
                  social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function () {
                    jQuery('#overlay').remove();
                  });
                } else if (parse_data.response) {
                  var html_content = parse_data.response.msg;
                  social_media_page_modal(1, 0, 1, '', html_content).done(function () {
                    jQuery('#overlay').remove();
                  });
                }
              }
            },
            error: function (textStatus, errorThrown) {
              social_media_page_modal(1, 0, 1, '', textStatus.responseText).done(function () {
                jQuery('#overlay').remove();
              });
            }

          });
        });
        jQuery('#nav-engagement .engagement-inner-contents').on('focus', '.twitter-comments-replies [contenteditable]', function () {
          const $this = jQuery(this);
          $this.data('before', $this.html());
        }).on('blur keyup paste input', '[contenteditable]', function () {
          const $this = jQuery(this);
          if ($this.data('before') !== $this.html()) {
            $this.data('before', $this.html());
            $this.trigger('change');
            if (jQuery.trim($this.text()).length > 0) {
              $this.parents('.twitter-comments-replies').find('.send-tweet-via-comments').removeClass('disabled');
              console.log('g');
            } else {
              $this.parents('.twitter-comments-replies').find('.send-tweet-via-comments').addClass('disabled');
            }
          }
        });

        //-------------------------------------------------retweets/unretweet/retweet-with-comment----------------------------------------------------------------------

        jQuery('#nav-engagement .engagement-inner-contents').on('mouseenter', '.post-content-area .twitter-engaged .tweets-retweets .tweets-retweets-wrapped', function () {
          jQuery(this).parents('.tweets-retweets').find('.tweet-retweet-modal1').removeClass('d-none');
        });
        jQuery('#nav-engagement .engagement-inner-contents').on('mouseleave', '.post-content-area .twitter-engaged .tweets-retweets .tweets-retweets-wrapped', function () {
          jQuery(this).parents('.tweets-retweets').find('.tweet-retweet-modal1').addClass('d-none');
        });
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '.post-content-area .twitter-engaged .tweets-retweets .tweet-retweet-modal1 a', function (event) {
          event.preventDefault();
          var $this = jQuery(this);
          console.log($this.text());
          //alert();
          if ($this.text() == 'Retweet with comment') {
            var textarea1 = document.querySelector('textarea.comment-field');
            textarea1.addEventListener('keydown', autosize_comment_box);
            var url = $this.attr('href');
            var urlQueryString = url.split("?");
            url = urlQueryString[0];
            var split_url = url.split("/");
            jQuery('#km-dialog-' + split_url[3]).removeClass('d-none');
            jQuery('#km-dialog-' + split_url[3]).dialog({
              autoOpen: true,
              width: 400,
              modal: true,
              resizable: false,
              buttons: {
                "Close": function () {
                  jQuery(this).dialog("close");
                },
                "ReTweet": function () {
                  //alert('write code here to send on twitter');
                  var attachment_url = jQuery.trim(jQuery(this).find('.attchmentUrl').val());
                  var comment = jQuery.trim(jQuery(this).find('textarea').val());
                  var comment_character_count = comment.length;
                  if (comment_character_count == 0) {
                    alert('comment should not be blank!');
                    return;
                  }
                  var querystring = '';
                  if(drupalSettings.team_query){
                    var team_query = drupalSettings.team_query;
                    querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
                  }
                  jQuery.ajax({
                    url: '/twitter-retweet-with-comment'+querystring,
                    data: {
                      "uid": path_userid,
                      "attached": attachment_url,
                      "comment": comment
                    },
                    type: "POST",
                    success: function (data) {
                      if (typeof JSON.parse(data) == 'object') {
                        var parse_data = JSON.parse(data);
                        if (parse_data.error) {
                          var html_content = 'Twitter reported the following error:<br>' + parse_data.error.msg;
                          social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function () {
                            jQuery("img.loader-gif").remove();
                          });
                        } else if (parse_data.response) {
                          jQuery("img.loader-gif").remove();
                          jQuery('.post-content-area').first().before(parse_data.response.data);
                          jQuery('.ui-dialog-content').dialog('close');
                        }
                      }
                    },
                    error: function (textStatus, errorThrown) {
                      social_media_page_modal(1, 0, 1, '', textStatus.responseText).done(function () {
                        Query("img.loader-gif").remove();
                      });
                    }

                  });
                }
              },
              create: function () {
                jQuery(this).closest(".ui-dialog").find(".ui-button").first().addClass("btn btn-default");
                jQuery(this).closest(".ui-dialog").find(".ui-button").last().addClass("btn btn-primary custom-tweet-button");
              }
            });
          } else {
            jQuery(this).append('<img class="loader-gif" src="/modules/custom/social_media/images/loading.gif">');
            jQuery.ajax({
              url: jQuery(this).attr('href'),
              data: {
                "uid": path_userid,
              },
              type: "POST",
              success: function (data) {
                if (typeof JSON.parse(data) == 'object') {
                  var parse_data = JSON.parse(data);
                  if (parse_data.error) {
                    var html_content = 'Twitter reported the following error:<br>' + parse_data.error.msg;
                    social_media_page_modal(1, 0, 1, parse_data.error.type, html_content).done(function () {
                      jQuery("img.loader-gif").remove();
                    });
                  } else if (parse_data.response) {
                    var html_content = parse_data.response.msg;
                    //console.log(data); 
                    social_media_page_modal(1, 0, 1, '', html_content).done(function () {
                      $this.parents('.table.tweet-retweet-modal1').addClass('d-none');
                      jQuery("img.loader-gif").remove();
                    });
                  }
                }
              },
              error: function (textStatus, errorThrown) {
                social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function () {
                  Query("img.loader-gif").remove();
                });
              }
            });
          }
        });
      }
    }
  };
})(jQuery, Drupal);