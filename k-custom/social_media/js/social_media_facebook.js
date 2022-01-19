/**
 
 * @file
 * Attaches behaviors for the social_media module.
 *
 */
(function($, Drupal) {
  var initialized;
  Drupal.behaviors.social_media_facebook = {
    attach: function(context, settings) {
      if (!initialized) {
        initialized = true;
        var path_userid = drupalSettings.path_userid;
        var settings_field = drupalSettings.settings_field;
        var knowledge_base_article = drupalSettings.knowledge_base_article;
        var isFacebookPageExist = drupalSettings.isFacebookPageExist;
        if (!isFacebookPageExist) {
          var msg = 'We could not find a Facebook Page for this account. Facebook requires you have at least one Facebook Page and business account (free).';
          social_media_page_modal(1, 0, 1, '', msg).done(function() {}).fail(function() {
            console.log('cancel');
          });
        }

        function social_media_page_modal(ok_link, isCancel,  isKnowledgebase, title, html_content) {
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
        jQuery(document).on('keyup', '.custom-comment-edit textarea, .custom-comment-reply-box textarea, .custom-comment-box textarea ', function(e) {
          var el = this;
          setTimeout(function() {
            el.style.cssText = 'height:auto; padding:5px';
            el.style.cssText = 'height:' + el.scrollHeight + 'px';
          }, 0);
        });
        jQuery('#nav-settings .image-editor-wrapper').on('click', '#save-profile-image-Facebook', function(event) {
          //console.log('save banner');  
          event.preventDefault();
          jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
          var $this = jQuery(this);
          if (jQuery(this).parents('.editor-class').attr('id').indexOf("banner") >= 0) {
            var imageProfileType = 'update_profile_banner';
          } else {
            var imageProfileType = 'update_profile_image';
          }
          var imageData = jQuery(this).parents('.editor-class').find('.image-editor').cropit('export', {
            //type: 'image/jpeg',
            fillBg: '#000',
            quality: 1.0,
            originalSize: true,
          });
          var appId = jQuery(this).parents('#nav-settings').find('.settings-tab-header .hidden-content .appname').text();
          if (appId == 166) {
            var pageId = jQuery(this).parents('#nav-settings').find('.settings-tab-header .hidden-content .page-id').text();
          }
          jQuery.ajax({
            url: '/FB_Page_image_update/' + pageId,
            data: {
              "uid": path_userid,
              "base64_string": imageData,
              "imageProfileType": imageProfileType,
            },
            type: "POST",
            success: function(data) {
              social_media_page_modal(1, 0, 0, '', data.message).done(function() {
                jQuery('#overlay').remove();
              }).fail(function() {
                console.log('cancel');
                // the pressed Cancel
              });
            },
            error: function(data) {
              var msg = 'Facebook Profile Picture updated successfully.'
              social_media_page_modal(1, 0, 0, '', msg).done(function() {
                jQuery('#overlay').remove();
              }).fail(function() {
                console.log('cancel');
                // the pressed Cancel
              });
            }
          });
        });
        jQuery('#nav-settings .social-media-text-profile').on('click', '.facebook-text-form .social-media-save-profile', function(event) {
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
              updateData[index.toLowerCase()] = jQuery(fieldClass + ' textarea').val().trim();
            }
            if ((value.type == 'auto_complete') && (value.enabled == '1')) {
              var fieldClass = '.' + index.toLowerCase().replace(" ", "-") + '-field';
              var items = [];
              jQuery(fieldClass).find('.selected-items li').each(function(e) {
                items.push(jQuery(this).find('.item-id').text());
              });
			  // disable category to update
             // updateData[index.toLowerCase()] = items;
            }
            if (index.toLowerCase() == 'website url') {
              var websiteerror = 0;
              if (!jQuery(fieldClass + ' textarea').val().trim()) {
                /*geterror = 1;
                websiteerror = 1;
                jQuery(fieldClass).after("<span class='website-null-error text-danger'>This field can't be null.</span>");  */
                // setTimeout(function(){$('.website-null-error').remove();}, 3000);
              } else if (jQuery(fieldClass + ' textarea').val().length > value.char_limit) {
                geterror = 1;
                websiteerror = 1;
                jQuery(fieldClass).after("<span class='website-null-error text-danger'>This field character limit not more then ." + value.char_limit + "</span>");
                // setTimeout(function(){$('.website-null-error').remove();}, 3000);
              } else if (!validUrlCheck(jQuery(fieldClass + ' textarea').val())) {
                geterror = 1;
                websiteerror = 1;
                jQuery(fieldClass).after("<span class='website-null-error text-danger'>Please enter valid website URL.</span>");
                // setTimeout(function(){$('.website-null-error').remove();}, 3000);
              }
              if (websiteerror) {
                setTimeout(function() {
                  $('.website-null-error').remove();
                }, 3000);
              }
            }
            if (index.toLowerCase() == 'phone') {
             /*  if (!validPhoneCheck(jQuery(fieldClass + ' textarea').val())) {
                geterror = 1;
                jQuery(fieldClass).after("<span class='phone-error text-danger'>Please enter valid phone number.</span>");
                setTimeout(function() {
                  $('.phone-error').remove();
                }, 3000);
              } */
            }
            if (index.toLowerCase() == 'emails') {
              emailerror = 0;
              var emails = jQuery(fieldClass + ' textarea').val().trim();
              if (!emails) {
                geterror = 1;
                emailerror = 1;
                jQuery(fieldClass).after("<span class='email-null-error text-danger'>Please enter valid email.</span>");
              } 
              if (emails) {
                var emailArr = emails.split(',');
                jQuery.each(emailArr, function(emailindex, emailvalue) {
                  if (!checkValidEmail(emailvalue) && emailvalue != '') {
                    geterror = 1;
                    emailerror = 1;
                    jQuery(fieldClass).after("<span class='email-null-error text-danger'>Please enter valid email.</span>");
                    setTimeout(function() {
                      $('.email-null-error').remove();
                    }, 3000);
                  }
                });
              }
              if (emailerror) {
                setTimeout(function() {
                  $('.email-null-error').remove();
                }, 3000);
              }
            }
          });
          if (error == 1 || geterror == 1) {
            jQuery('#overlay').remove();
            return;
          }
          var appId = jQuery(this).parents('#nav-settings').find('.settings-tab-header .hidden-content .appname').text();
          if (appId == 166) {
            var pageId = jQuery(this).parents('#nav-settings').find('.settings-tab-header .hidden-content .page-id').text();
			console.log(updateData);
          }
          if (geterror == 0) {
            jQuery.ajax({
              url: '/FB_Page_info_update/' + pageId,
              data: {
                "uid": path_userid,
                "update": "true",
                "updateData": updateData,
              },
              type: "POST",
              success: function(data) {
                if (typeof JSON.parse(data) == 'object') {
                  var parse_data = JSON.parse(data);
                  if (parse_data.error) {
                    var html_content = 'Facebook reported the following error:<br>' + parse_data.error.msg ;
                    social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function() {
                      jQuery('#overlay').remove();
                    });
                  } else if (parse_data.response) {
                    var html_content = parse_data.response.msg;
                    social_media_page_modal(1, 0, 0, '', html_content).done(function() {
                      jQuery('#overlay').remove();
                    });
                  }
                }
              },
              error: function(textStatus, errorThrown) {
                jQuery('#overlay').remove();
                social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
              }
            });
          }
        });
        jQuery('#nav-settings .social-media-text-profile').on('click', '.social-media-cancel-profile', function(event) {
          event.preventDefault();
          var $this = jQuery(this);
          var html_content = 'Are you sure you want to cancel?';
          social_media_page_modal(1, 1, 0, '', html_content).done(function() {
            jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
            var appId = $this.parents('#nav-settings').find('.settings-tab-header .hidden-content .appname').text();
            if (appId == 166) {
              var pageId = $this.parents('#nav-settings').find('.settings-tab-header .hidden-content .page-id').text();
            }
            jQuery.ajax({
              url: '/FB_Page_info_update/' + pageId,
              data: {
                "uid": path_userid,
                "update": "false",
              },
              type: "POST",
              success: function(data) {
                if (typeof JSON.parse(data) == 'object') {
                  var parse_data = JSON.parse(data);
                  if (parse_data.error) {
                    var html_content = 'Facebook reported the following error:<br>' + parse_data.error.msg ;
                    social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function() {
                      jQuery('#overlay').remove();
                    });
                  } else if (parse_data.response) {
                    jQuery.each(settings_field, function(index, value) {
                      if ((value.type == 'text') && (value.enabled == '1')) {
                        var fieldClass = '.' + index.toLowerCase().replace(" ", "-") + '-field';
                        if (index.toLowerCase().indexOf("about") >= 0) {
                          $this.parents('.facebook-text-form').find(fieldClass + ' textarea').val(parse_data.response.data.about);
                        }
                        if (index.toLowerCase().indexOf("phone") >= 0) {
                          $this.parents('.facebook-text-form').find(fieldClass + ' textarea').val(parse_data.response.data.phone);
                        }
                        if (index.toLowerCase().indexOf("website") >= 0) {
                          $this.parents('.facebook-text-form').find(fieldClass + ' textarea').val(parse_data.response.data.website);
                        }
                        if (index.toLowerCase().indexOf("description") >= 0) {
                          $this.parents('.facebook-text-form').find(fieldClass + ' textarea').val(parse_data.response.data.description);
                        }
                        if (index.toLowerCase().indexOf("emails") >= 0) {
                          var emailasString = '';
                          jQuery.each(parse_data.response.data.emails, function(emailIndex, email) {
                            emailasString += email + ',';
                          });
                          $this.parents('.facebook-text-form').find(fieldClass + ' textarea').val(emailasString);
                        }
                        $this.parents('.facebook-text-form').find(fieldClass + ' textarea').trigger("keyup");
                      }
                      if ((value.type == 'auto_complete') && (value.enabled == '1')) {
                        var fieldClass = '.' + index.toLowerCase().replace(" ", "-") + '-field';
                        if (index.toLowerCase().indexOf("categories") >= 0) {
                          //prepare items
                          var prepare_item = '';
                          jQuery.each(parse_data.response.data.category_list, function(categoriesIndex, category) {
                            prepare_item += '<li>';
                            prepare_item += '<span class="item-id d-none">' + category.id + '</span>';
                            prepare_item += '<span class="item-name">' + category.name + '</span>';
                            prepare_item += '<span style="padding-left:5px;cursor:pointer;" class="item-cancel">X</span>';
                            prepare_item += '</li>';
                          });
                          $this.parents('.facebook-text-form').find(fieldClass + ' .selected-items ul').html(prepare_item);
                        }
                      }
                    });
                    jQuery('#overlay').remove();
                  }
                }
              },
              error: function(textStatus, errorThrown) {
                jQuery('#overlay').remove();
                social_media_page_modal(1, 0, 1, '', textStatus.responseText).done(function() {});
              }
            });
          }).fail(function() {
            console.log('cancel');
            // the pressed Cancel
          });
        });
        
        //----------------change facebook page on my post Tab...................................
        var current_facebook_page = jQuery('.custom-my-post-headr select#page_id_mypost').val();
        jQuery('.custom-my-post-headr select#page_id_mypost').on('change', function(e) {
          e.preventDefault();
          var get_facebook_page_id = jQuery(this).val();
          var get_facebook_page_name = jQuery("select#page_id_mypost option:selected").text();
          var $this = jQuery(this);
          var message = 'You will be switched to <b>' + get_facebook_page_name + '</b>. All the Tabs are specific to this Page. You can again swich to another page from here.';
          social_media_page_modal(1, 1, 0, '', message).done(function() {
            var querystring = '';
            if(drupalSettings.team_query){
              var team_query = drupalSettings.team_query;
              querystring = '&team='+team_query.gid+'&muid='+team_query.muid+'#nav-shared';
            }
            var generate_page_url = window.location.href.split("?");
            window.location.replace(generate_page_url[0] + '?page_id=' + parseInt(get_facebook_page_id)+querystring);
          }).fail(function() {
            $this.val(current_facebook_page);
          });
        });
        //-------------Add Likes or Remove Likes Per Post -------------
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '#nav-list-view .post-content-area .wrap-post-actions .likes-custom a', function(event) {
          event.preventDefault();
          // idntify operation is add like or remove like
          jQuery(this).append('<img class="loader-gif" src="/modules/custom/social_media/images/loading.gif">');
          let $this = jQuery(this);
          let op;
          if (jQuery(this).parents('.wrap-post-actions').find('.user-liked span.like-text').hasClass('user-liked-all')) {
            op = 0;
          } else {
            op = 1;
          }
          jQuery.ajax({
            url: jQuery(this).attr('href'),
            data: {
              "mode": 'ajax',
              "op": op,
            },
            type: "GET",
            success: function(data) {
              if (typeof JSON.parse(data) == 'object') {
                var parse_data = JSON.parse(data);
                if (parse_data.error) {
                  var html_content = 'Facebook reported the following error:<br>' + parse_data.error.msg ;
                  social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function() {
                    jQuery("img.loader-gif").remove();
                  });
                } else if (parse_data.response) {
                  let like_text = $this.parents('.wrap-post-actions').find('.user-liked span.like-text span.like-counter ').text();
                  if (op == 0) {
                    //it means rqust is sent to remove like
                    $this.parents('.wrap-post-actions').find('.user-liked span.like-text').removeClass('user-liked-all');
                    if ($this.parents('.wrap-post-actions').find('.user-liked span.like-text span.like-counter').text() == '') {
                      $this.parents('.wrap-post-actions').find('.user-liked span.like-text span.like-counter').text('0');
                      $this.parents('.wrap-post-actions').find('.user-liked span.like-text span.first-part').text(' ');
                    } else {
                      $this.parents('.wrap-post-actions').find('.user-liked span.like-text span.first-part').text(' ');
                      $this.parents('.wrap-post-actions').find('.user-liked span.like-text span.third-part').text(' ');
                      $this.parents('.wrap-post-actions').find('.user-liked span.like-text span.like-counter').show();
                    }
                    $this.find('img.action-icon').attr('src', '/modules/custom/social_media/images/FacebookIcons/Thumb-Icon-32363b.png');
                  } else {
                    //it means rqust is sent to add like
                    $this.parents('.wrap-post-actions').find('.user-liked span.like-text').addClass('user-liked-all');
                    if ($this.parents('.wrap-post-actions').find('.user-liked span.like-text span.like-counter').text() == 0) {
                      $this.parents('.wrap-post-actions').find('.user-liked span.like-text span.first-part').text('You');
                      $this.parents('.wrap-post-actions').find('.user-liked span.like-text span.third-part').text(' ');
                      $this.parents('.wrap-post-actions').find('.user-liked span.like-text span.like-counter').hide();
                    } else {
                      $this.parents('.wrap-post-actions').find('.user-liked span.like-text span.first-part').text('You and ');
                      $this.parents('.wrap-post-actions').find('.user-liked span.like-text span.third-part').text('other');
                    }
                    $this.find('img.action-icon').attr('src', '/modules/custom/social_media/images/FacebookIcons/Facebook-liked-128px.png');
                  }
                  jQuery("img.loader-gif").remove();
                }
              }
            },
            error: function(textStatus, errorThrown) {
              jQuery('#overlay').remove();
              social_media_page_modal(1, 0, 1, '', textStatus.responseText).done(function() {});
            }
          });
        });
        // ---------------------------------------------------------- publish comments Operation--------------------------------------
        jQuery("#nav-engagement .engagement-inner-contents").on("keypress", "#nav-list-view .comment-area .custom-comment-box textarea", function(e) {
          var $this = jQuery(this);
          var code = (e.keyCode ? e.keyCode : e.which);
          //alert(code);
          if (code == 13) {
            let message = jQuery.trim(jQuery(this).val());
            if (message != '') {
              jQuery('<img class="loader-gif" src="/modules/custom/social_media/images/loading.gif">').insertBefore($this);
              let comment_link = jQuery(this).parents('.comment-boxes').find('a.post-comment-link').attr('href');
              let user_profile_pic = jQuery(this).parents('.comment-boxes').find('img').attr('src');
              let page_id = jQuery(this).parents('.post-content-area').find('.post-header .page-id ').text();
              jQuery.ajax({
                url: comment_link,
                data: {
                  "mode": 'ajax',
                  "op": 'publish',
                  "message": message,
                },
                type: "GET",
                success: function(data) {
                  if (typeof JSON.parse(data) == 'object') {
                    var parse_data = JSON.parse(data);
                    if (parse_data.error) {
                      var html_content = 'Facebook reported the following error:<br>' + parse_data.error.msg ;
                      social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function() {
                        jQuery("img.loader-gif").remove();
                      });
                    } else if (parse_data.response) {
                      //unset comment fields
                      $this.val('');
                      $this.trigger('keyup');
                      // let server_response = JSON.parse(data);
                      let object_id = parse_data.response.id;
                      var querystring = '';
                      if(drupalSettings.team_query){
                        var team_query = drupalSettings.team_query;
                        querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
                      }
                      var comment_items = '<div class="comment-items">'
                      comment_items += '<div class="comment-items-wrap">'
                      comment_items += '<div class="comment-item comment-look">'
                      comment_items += '<div class="comment-content d-flex">'
                      comment_items += '<img src="' + user_profile_pic + '" class="rounded-circle" alt="user-pic" width="25" height="25">'
                      comment_items += '<label class=" messagecoments bg-f2f2f2"><b>Test business </b><span class="main-message">' + message + '</span></label>'
                      comment_items += '<span class="comment-operation-block float-right" style="height:0">'
                      comment_items += '<i class="fas fa-ellipsis-h"></i>'
                      comment_items += '<div class="comment-operation-content" style="display: none;">'
                      comment_items += '<div class="comment-operation-wrapeer p-2">'
                      comment_items += '<ul class="list-unstyled mb-0">'
                      comment_items += '<li><a href="/Fb_comments/' + page_id + "/" + object_id + querystring + '">Remove</a></li>'
                      comment_items += '<li><a href="/Fb_comments/' + page_id + "/" + object_id + querystring + '">Edit </a></li>'
                      comment_items += '</ul>'
                      comment_items += '</div>'
                      comment_items += '</div>'
                      comment_items += '</span>'
                      comment_items += '</div>'
                      comment_items += '<div class="comment-action">'
                      comment_items += '<a class="comment-likes" href="/FB_post_like/' + page_id + "/" + object_id + querystring + '">Like</a>'
                      comment_items += '<a class="comment-replies" href="/Fb_comments/' + page_id + "/" + object_id + querystring + '">Reply</a>'
                      comment_items += '</div>'
                      comment_items += '</div>'
                      comment_items += '</div>'
                      comment_items += '</div>';
                      $this.parents('.wrap-post-actions').find('.displayed-comments').append(comment_items);
                      jQuery("img.loader-gif").remove();
                    }
                    jQuery("img.loader-gif").remove();
                  }
                },
                error: function(request, status, error) {
                  social_media_page_modal(1, 0, 0, '', request.responseText).done(function() {});
                },
              });
            }
          }
        });
        //-------------------------------commengt area hide show --------------------
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '#nav-list-view .post-content-area .user-reactions span.user-comments-share a', function(event) {
          event.preventDefault();
          jQuery(this).parents('.post-content-area').find('.comment-area').toggleClass('d-none');
        });
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '#nav-list-view .post-content-area .user-actions span.comment-custom', function(event) {
          event.preventDefault();
          if (jQuery(this).parents('.post-content-area').find('.comment-area').hasClass("d-none")) {
            jQuery(this).parents('.post-content-area').find('.comment-area').removeClass('d-none');
          }
          jQuery(this).parents('.post-content-area').find('.custom-comment-box textarea').focus();
        });
        //--------------------------------------------------------comment Operations....................................................
        jQuery('#nav-engagement .engagement-inner-contents').on('mouseenter', '#nav-list-view .post-content-area .comment-operation-block', function() {
          jQuery(this).find('.comment-operation-content').fadeIn();
        });
        jQuery('#nav-engagement .engagement-inner-contents').on('mouseleave', '#nav-list-view .post-content-area .comment-operation-block', function() {
          jQuery(this).find('.comment-operation-content').fadeOut();
        });
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '#nav-list-view .post-content-area .displayed-comments span.cancel-edit-comment', function(event) {
          event.preventDefault();
          jQuery(this).parents('.comment-item').find('.comment-action').show();
          jQuery(this).parents('.comment-item').find('label.messagecoments').show();
          jQuery(this).parents('.comment-item').find('.comment-operation-block').show();
          jQuery(this).parents('.comment-item').find('.custom-comment-edit').remove();
        });
        //  ..................................................... edit comment/remove ...................................
        jQuery("#nav-engagement .engagement-inner-contents").on("keypress", "#nav-list-view .comment-area .custom-comment-edit textarea", function(e) {
          var $this = jQuery(this);
          var code = (e.keyCode ? e.keyCode : e.which);
          if (code == 13) {
            let message = jQuery.trim(jQuery(this).val());
            if (message != '') {
              jQuery('<img class="loader-gif" src="/modules/custom/social_media/images/loading.gif">').insertBefore($this);
              let comment_link = jQuery(this).parents('.comment-item').find('a.comment-edit-link').attr('href');
              jQuery.ajax({
                url: comment_link,
                data: {
                  "mode": 'ajax',
                  "op": 'Edit',
                  "message": message,
                },
                type: "GET",
                success: function(data) {
                  if (typeof JSON.parse(data) == 'object') {
                    var parse_data = JSON.parse(data);
                    if (parse_data.error) {
                      var html_content = 'Facebook reported the following error:<br>' + parse_data.error.msg ;
                      social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function() {});
                    } else if (parse_data.response) {
                      $this.val('');
                      $this.trigger('keyup');
                      if (parse_data.response.success == true) {
                        $this.parents('.comment-item').find('.comment-action').show();
                        $this.parents('.comment-item').find('.comment-operation-block').show();
                        $this.parents('.comment-item').find('label.messagecoments').show();
                        $this.parents('.comment-item').find('label.messagecoments span.main-message').text(message);
                        $this.parents('.comment-item').find('.custom-comment-edit').remove();
                      }
                    }
                    jQuery('.loader-gif').remove();
                  }
                },
                error: function(textStatus, errorThrown) {
                  jQuery('#overlay').remove();
                  social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
                }
              });
            }
          }
        });
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '#nav-list-view .post-content-area .displayed-comments ul.list-unstyled li a', function(event) {
          event.preventDefault();
          var $this = jQuery(this);
          var $op = jQuery.trim($this.text());
          var comment_link = $this.attr('href');
          if ($op == 'Edit') {
            let comment_text = jQuery.trim(jQuery(this).parents('.comment-item').find('label.messagecoments span.main-message').html().split("<span>")[0]);
            let edit_comment_box = '<div class="custom-comment-edit w-100" style="padding-left:2px">'
            edit_comment_box += '<a class="comment-edit-link d-none" href="' + comment_link + '"></a>'
            edit_comment_box += '<textarea class="edit-comment w-100 bg-f2f2f2" style="border-radius:20px" id="comment-box" rows="1">' + comment_text + '</textarea>'
            edit_comment_box += '<span class="cancel-edit-comment"> <a>Cancel</a> </span></div>';
            jQuery(this).parents('.comment-item').find('.comment-action').hide();
            jQuery(this).parents('.comment-item').find('label.messagecoments').hide();
            jQuery(this).parents('.comment-item').find('.comment-operation-block').hide();
            jQuery(this).parents('.comment-item').find('.comment-content img').after(edit_comment_box);
            jQuery(this).parents('.comment-item').find('textarea.edit-comment').focus();
            jQuery(this).parents('.comment-item').find('textarea.edit-comment').trigger('keyup');
            return;
          }
          jQuery(this).parents('.comment-items').append('<img class="loader-gif" src="/modules/custom/social_media/images/loading.gif">');
          let message = 'edited commets';
          jQuery.ajax({
            url: comment_link,
            data: {
              "mode": 'ajax',
              "op": $op,
              "message": message
            },
            type: "GET",
            success: function(data) {
              if (typeof JSON.parse(data) == 'object') {
                var parse_data = JSON.parse(data);
                if (parse_data.error) {
                  var html_content = 'Facebook reported the following error:<br>' + parse_data.error.msg ;
                  social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function() {
                    jQuery('.loader-gif').remove();
                  });
                } else if (parse_data.response) {
                  if ($op == 'Remove') {
                    if (parse_data.response.success == true) {
                      if ($this.parents('.comment-item').hasClass('comment-replies-look')) {
                        $this.parents('.comment-replies-look').remove();
                      } else {
                        $this.parents('.comment-items').remove();
                      }
                    }
                  }
                }
                jQuery('.loader-gif').remove();
              }
            },
            error: function(textStatus, errorThrown) {
              jQuery('#overlay').remove();
              social_media_page_modal(1, 0, 1, '', textStatus.responseText).done(function() {});
            }
          });
        });
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '#nav-list-view .post-content-area .displayed-comments a.comment-replies', function(event) {
          event.preventDefault();
          let currnet_comment_url = jQuery(this).attr('href');
          let user_profile_pic = jQuery(this).parents('.comment-area').find('.comment-boxes img').attr('src');
          //console.log(user_profile_pic);
          if (jQuery(this).parents('.comment-items').find('.comment-boxes-replies').length == 0) {
            let replies_input = '<div class="comment-boxes-replies pl-2 pt-3 d-flex">'
            replies_input += '<img src="' + user_profile_pic + '" class="rounded-circle" alt="pic" width="20" height="20">'
            replies_input += '<div class="custom-comment-reply-box w-100" style="padding-left:2px">'
            replies_input += '<a class="comment-replies-link d-none" href="' + currnet_comment_url + '"></a>'
            replies_input += '<textarea class="w-100 bg-f2f2f2" style="border-radius:20px" id="comment-box" rows="1" placeholder="Reply.."></textarea>'
            replies_input += '</div>'
            replies_input += '</div>';
            jQuery(this).parents('.comment-items').find('.comment-items-wrap').append(replies_input);
          } else {
            jQuery(this).parents('.comment-items').find('a.comment-replies-link').attr('href', currnet_comment_url);
          }
          jQuery(this).parents('.comment-items').find('textarea').focus();
          jQuery(this).parents('.comment-items').find('textarea').trigger('keyup');
        });
        //------------------------------------------------------ replies to comment -----------------------------------------------
        jQuery("#nav-engagement .engagement-inner-contents").on("keypress", "#nav-list-view .comment-area .custom-comment-reply-box textarea", function(e) {
          var $this = jQuery(this);
          var code = (e.keyCode ? e.keyCode : e.which);
          //alert(code);
          if (code == 13) {
            let message = jQuery.trim(jQuery(this).val());
            if (message != '') {
              jQuery('<img class="loader-gif" src="/modules/custom/social_media/images/loading.gif">').insertBefore($this);
              let comment_link = jQuery(this).parents('.comment-boxes-replies').find('a.comment-replies-link').attr('href');
              let user_profile_pic = jQuery(this).parents('.post-content-area').find('.current_user_profile').text();
              let page_id = jQuery(this).parents('.post-content-area').find('.post-header .page-id ').text();
              jQuery.ajax({
                url: comment_link,
                data: {
                  "mode": 'ajax',
                  "op": 'publish',
                  "message": message,
                },
                type: "GET",
                success: function(data) {
                  if (typeof JSON.parse(data) == 'object') {
                    var parse_data = JSON.parse(data);
                    if (parse_data.error) {
                      jQuery('#overlay').remove();
                      var html_content = 'Facebook reported the following error:<br>' + parse_data.error.msg ;
                      social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function() {});
                    } else if (parse_data.response) {
                      $this.val('');
                      $this.trigger('keyup');
                      let object_id = parse_data.response.id;
                      var querystring = '';
                      if(drupalSettings.team_query){
                        var team_query = drupalSettings.team_query;
                        querystring = '?team='+team_query.gid+'&muid='+team_query.muid;
                      }
                      var comment_items = '<div class="comment-item comment-replies-look">'
                      comment_items += '<div class="comment-content d-flex">'
                      comment_items += '<img src="' + user_profile_pic + '" class="rounded-circle" alt="user-pic" width="25" height="25">'
                      comment_items += '<label class=" messagecoments bg-f2f2f2"><b>Test business </b><span class="main-message">' + message + '</span></label>'
                      comment_items += '<span class="comment-operation-block float-right">'
                      comment_items += '<i class="fas fa-ellipsis-h"></i>'
                      comment_items += '<div class="comment-operation-content" style="display: none;">'
                      comment_items += '<div class="comment-operation-wrapeer p-2">'
                      comment_items += '<ul class="list-unstyled mb-0">'
                      comment_items += '<li><a href="/Fb_comments/' + page_id + "/" + object_id + querystring + '">Remove</a></li>'
                      comment_items += '<li><a href="/Fb_comments/' + page_id + "/" + object_id + querystring + '">Edit </a></li>'
                      comment_items += '</ul>'
                      comment_items += '</div>'
                      comment_items += '</div>'
                      comment_items += '</span>'
                      comment_items += '</div>'
                      comment_items += '<div class="comment-action">'
                      comment_items += '<a class="comment-likes" href="/FB_post_like/' + page_id + "/" + object_id + querystring + '">Like</a>'
                      comment_items += '<a class="comment-replies" href="/Fb_comments/' + page_id + "/" + object_id + querystring + '"> Reply</a>'
                      comment_items += '</div>'
                      comment_items += '</div>';
                      $this.parents('.comment-items').find('.comment-items-wrap .comment-item').last().after(comment_items);
                      //alert('comment added');
                    }
                    jQuery("img.loader-gif").remove();
                  }
                },
                error: function(request, status, error) {
                  social_media_page_modal(1, 0, 0, '', request.responseText).done(function() {});
                },
              });
            }
          }
        });
        // ----------------------------------------------------lOAD MORE REPLIES --------------------------------------------------------
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '#nav-list-view .post-content-area .displayed-comments .load-more.comment-replies-block a', function(event) {
          jQuery('<img class="loader-gif" src="/modules/custom/social_media/images/loading.gif">').insertBefore($this);
          event.preventDefault();
          var $this = jQuery(this);
          var prev_link = $this.attr('href');
          var page_id = jQuery(this).parents('#nav-engagement').find('select#page_id').val();
          jQuery.ajax({
            url: prev_link,
            type: "GET",
            success: function(data) {
              jQuery.ajax({
                url: "/FBCommentsRepliesLoadMore",
                data: {
                  "mode": 'ajax',
                  "data": data,
                  "option": "loadReplies",
                  "page_id": page_id,
                },
                type: "POST",
                success: function(result) {
                  if (typeof JSON.parse(result) == 'object') {
                    var parse_data = JSON.parse(result);
                    if (parse_data.error) {
                      jQuery("img.loader-gif").remove();
                      var html_content = 'Facebook reported the following error:<br>' + parse_data.error.msg ;
                      social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function() {});
                    } else if (parse_data.response) {
                      $this.parents('.comment-items').find('.comment-items-wrap .comment-replies-look').last().after(newhtml);
                      //console.log(data.paging.next);
                      if (data.paging.next == undefined || data.paging.next == null) {
                        $this.remove();
                      } else {
                        $this.attr('href', data.paging.next);
                      }
                      jQuery("img.loader-gif").remove();
                    }
                    jQuery("img.loader-gif").remove();
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
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '#nav-list-view .post-content-area .comment-area .load-more.comments-block a', function(event) {
          jQuery('<img class="loader-gif" src="/modules/custom/social_media/images/loading.gif">').insertBefore($this);
          event.preventDefault();
          var $this = jQuery(this);
          var prev_link = $this.attr('href');
          var page_id = jQuery(this).parents('#nav-engagement').find('select#page_id').val();
          jQuery.ajax({
            url: prev_link,
            type: "GET",
            success: function(data) {
              jQuery.ajax({
                url: "/FBCommentsRepliesLoadMore",
                data: {
                  "mode": 'ajax',
                  "data": data,
                  "option": "loadComments",
                  "page_id": page_id,
                },
                type: "POST",
                success: function(result) {
                  if (typeof JSON.parse(result) == 'object') {
                    var parse_data = JSON.parse(result);
                    if (parse_data.error) {
                      jQuery("img.loader-gif").remove();
                      var html_content = 'Facebook reported the following error:<br>' + parse_data.error.msg ;
                      social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function() {});
                    } else if (parse_data.response) {
                      $this.parents('.comment-area').find('.displayed-comments .comment-items').last().after(parse_data.response.data);
                      if (data.paging.next == undefined || data.paging.next == null) {
                        $this.remove();
                      } else {
                        $this.attr('href', data.paging.next);
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
        //...................................................... comments/replies like and remove like  ....................................
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '#nav-list-view .post-content-area .displayed-comments a.comment-likes', function(event) {
          event.preventDefault();
          jQuery(this).append('<img class="loader-gif" src="/modules/custom/social_media/images/loading.gif">');
          let $this = jQuery(this);
          let op;
          if (jQuery(this).hasClass('liked')) {
            // remove like		
            op = 0;
          } else {
            // add like	
            op = 1;
          }
          jQuery.ajax({
            url: jQuery(this).attr('href'),
            data: {
              "mode": 'ajax',
              "op": op,
            },
            type: "GET",
            success: function(data) {
              if (typeof JSON.parse(data) == 'object') {
                var parse_data = JSON.parse(data);
                if (parse_data.error) {
                  var html_content = 'Facebook reported the following error:<br>' + parse_data.error.msg ;
                  social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function() {});
                } else if (parse_data.response) {
                  let comment_count = parseInt(jQuery.trim($this.parents('.comment-item').find('sub .liked-comment-count').text()));
                  if (op == 0) {
                    //it means rqust is sent to remove like
                    if (comment_count > 1) {
                      let current_no_of_comments = comment_count - 1;
                      jQuery.trim($this.parents('.comment-item').find('sub .liked-comment-count').text(current_no_of_comments));
                    } else {
                      $this.parents('.comment-item').find('sub').remove();
                    }
                    $this.removeClass('liked');
                  } else {
                    //it means rqust is sent to remove like
                    let current_no_of_comments = comment_count + 1;
                    if (comment_count > 0) {
                      jQuery.trim($this.parents('.comment-item').find('sub .liked-comment-count').text(current_no_of_comments));
                    } else {
                      let like_text = '<sub class="float-right pt-3"><div class="like-message">'
                      like_text += '<span class="liked-image">'
                      like_text += '<img class="action-icon" src="/modules/custom/social_media/images/FacebookIcons/Facebook-liked-128px.png" alt="icon">'
                      like_text += '</span>'
                      like_text += '<span class="liked-comment-count">1</span>'
                      like_text += '</div></sub>'
                      $this.parents('.comment-item').find('label.messagecoments').append(like_text);
                    }
                    $this.addClass('liked');
                  }
                }
                jQuery("img.loader-gif").remove();
              }
            },
            error: function(textStatus, errorThrown) {
              jQuery("img.loader-gif").remove();
              social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
            }
          })
        })
        //....................................... Facebook View More message .........................................................
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '#nav-list-view .post-content-area .message-block .view-more-less', function(event) {
          event.preventDefault();
          jQuery(this).parents('.message-block').find('.post-text-next').toggleClass('d-none');
          if (jQuery(this).parents('.message-block').find('.post-text-next').hasClass('d-none')) {
            jQuery(this).text('View More');
          } else {
            jQuery(this).text('View Less');
          }
        });
        //----------------------------------------------------------- Fb post operation ----------------------------------------------------
        /*jQuery("#nav-engagement .post-content-area .post-header .post-operation-block").hover(function(){
           jQuery(this).find('.post-operation-content').fadeToggle();
        }); */
        jQuery('#nav-engagement .engagement-inner-contents').on('mouseenter', '#nav-list-view .post-content-area .post-header .post-operation-block', function() {
          jQuery(this).find('.post-operation-content').fadeIn();
        });
        jQuery('#nav-engagement .engagement-inner-contents').on('mouseleave', '#nav-list-view .post-content-area .post-header .post-operation-block', function() {
          jQuery(this).find('.post-operation-content').fadeOut();
        });
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '#nav-list-view .post-content-area .post-operation-content ul li a.delete-post', function(event) {
          event.preventDefault();
          let $this = jQuery(this);
          let url = $this.attr('href');
          var deleted = jQuery(this).attr('data-deleted');
          if (deleted == 1) {
            var html_content = 'Are you sure you want to permanently delete this post from Facebook?';
            social_media_page_modal(1, 1, 0, 'Delete Post', html_content).done(function() {
              //console.log(url);
              jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
              jQuery.ajax({
                url: url,
                data: {
                  "mode": 'ajax',
                },
                type: "POST",
                success: function(data) {
                  if (typeof JSON.parse(data) == 'object') {
                    var parse_data = JSON.parse(data);
                    if (parse_data.error) {
                      var html_content = 'Facebook reported the following error:<br>' + parse_data.error.msg ;
                      social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function() {
                        jQuery('#overlay').remove();
                      });
                    } else if (parse_data.response) {
                      $this.parents('.post-content-area').remove();
                      jQuery('#overlay').remove();
                    }
                    jQuery('#overlay').remove();
                  }
                },
                error: function(textStatus, errorThrown) {
                  jQuery('#overlay').remove();
                  social_media_page_modal(1, 0, 0, '', textStatus.responseText).done(function() {});
                }
              });
            }).fail(function() {
              jQuery('#overlay').remove();
            });
          } else {
            var html_content = 'This post can not deleted as this is not created by Application.';
            social_media_page_modal(1, 0, 0, 'Delete Post', html_content).done(function() {});
          }
        });
        //------------------------------------------------------------Load more faebookPost ......................................................
        jQuery('#nav-engagement .engagement-inner-contents').on('click', '#nav-list-view .load-more.ajax-loadnext-post a', function(event) {
          jQuery('.path-tools #main-wrapper').append('<div id="overlay"><div class="km-loader"></div></div>');
          jQuery('<img class="loader-gif" src="/modules/custom/social_media/images/loading.gif">').insertBefore($this);
          event.preventDefault();
          var $this = jQuery(this);
          var post_load_link = $this.attr('href');
          var page_id = jQuery(this).parents('#nav-engagement').find('select#page_id').val();
          jQuery.ajax({
            url: post_load_link,
            type: "GET",
            success: function(data) {
              //console.log(data);
              jQuery.ajax({
                url: "/FbGetPost/" + parseInt(page_id),
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
                      jQuery('#overlay').remove();
                      var html_content = 'Facebook reported the following error:<br>' + parse_data.error.msg ;
                      social_media_page_modal(1, 0, 1, parse_data.error.custom_type, html_content).done(function() {});
                    } else if (parse_data.response) {
                      //console.log(newhtml);
                      jQuery('.post-content-area').last().after(parse_data.response.data);
                      jQuery('#overlay').remove();
                      $this.remove();
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
        // auto play videos on Scroll of engagement tab
        function checkScroll() {
          if (jQuery('#nav-engagement-tab').hasClass("active")) {
            var videos = jQuery("video.video-play-on-scroll").map(function() {
              return this;
            }).get();
            var fraction = .9999; // Play the player is visible.
            for (var i = 0; i < videos.length; i++) {
              var video = videos[i];
              var x = video.offsetLeft,
                y = video.offsetTop,
                w = video.offsetWidth,
                h = video.offsetHeight,
                r = x + w, //right
                b = y + h, //bottom
                visibleX, visibleY, visible;
              visibleX = Math.max(0, Math.min(w, window.pageXOffset + window.innerWidth - x, r - window.pageXOffset));
              visibleY = Math.max(0, Math.min(h, window.pageYOffset + window.innerHeight - y, b - window.pageYOffset));
              visible = visibleX * visibleY / (w * h);
              if (visible > fraction) {
                video.play();
              } else {
                video.pause();
              }
            }
          }
        }
        window.addEventListener('scroll', checkScroll, false);
        window.addEventListener('resize', checkScroll, false);
        jQuery('#social-media-wrapper').on('click', '.nav-tabs .nav-item', function(event) {
          event.preventDefault();
          var videos = jQuery("video.video-play-on-scroll").map(function() {
            return this;
          }).get();
          for (var i = 0; i < videos.length; i++) {
            videos[i].pause();
          }
        });
      }
    }
  };
})(jQuery, Drupal);

function validUrlCheck(string) {
  var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return (res !== null)
};

function validPhoneCheck(str) {
  var patt1 = new RegExp(/^\+?1?\s*?\(?\d{3}(?:\)|[-|\s])?\s*?\d{3}[-|\s]?\d{4}$/);
  var patt = new RegExp(/^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm);
  return patt.test(str);
}

function checkValidEmail1(emailAddress) {
  var sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
  var sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
  var sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
  var sQuotedPair = '\\x5c[\\x00-\\x7f]';
  var sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d';
  var sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22';
  var sDomain_ref = sAtom;
  var sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')';
  var sWord = '(' + sAtom + '|' + sQuotedString + ')';
  var sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*';
  var sLocalPart = sWord + '(\\x2e' + sWord + ')*';
  var sAddrSpec = sLocalPart + '\\x40' + sDomain; // complete RFC822 email address spec
  var sValidEmail = '^' + sAddrSpec + '$'; // as whole string
  var reValidEmail = new RegExp(sValidEmail);
  return reValidEmail.test(emailAddress);
}

function checkValidEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}