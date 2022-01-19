/**
 * @file
 * Attaches behaviors for the affiliate_program module.
 *
 */
(function ($, Drupal) {
  var initialized;
  Drupal.behaviors.affiliate_program = {
    attach: function (context, settings) {
      if (!initialized) {
        initialized = true;
        // Ok button functionality
        var base_url = drupalSettings.base_secure_url;
        var uid = drupalSettings.uid;
        var admin_approved = drupalSettings.admin_approved;
        jQuery(document).on('click','#onClickAffiliateModal',function (e) {
          if(admin_approved){
            location.reload();
          }
          else {
            window.location.href = base_url+'/tools/my-account/'+uid;
          }
          console.log(base_url+'/tools/my-account/'+uid);
        });
        jQuery('.copy-link-code2 a').click(function (e) {
          e.preventDefault();
          var affiliate_link = jQuery(this).attr('affiliate-link');
          var affiliate_banner = jQuery(this).attr('affiliate-banner');
          var copy_text = '<a href="'+affiliate_link+'" target="_blank"><img src="'+affiliate_banner+'" border="0"></a>';
          var $temp = jQuery("<input>");
          jQuery("body").append($temp);
          $temp.val(copy_text).select();
          document.execCommand("copy");
          $temp.remove();
          //jQuery('.copy-link-code2 a').tooltip("disable");
          jQuery(this).tooltip({ items: '.copy-link-code2 a', content: "Link code copied."});
          jQuery(this).tooltip("open");
          setTimeout(function () {    
            jQuery('.copy-link-code2 a').tooltip("disable");
          }, 3000);
          // console.log(copy_text);
        });
        jQuery('.copy-link-code1 a').click(function (e) {
          e.preventDefault();
          var affiliate_link = jQuery(this).attr('affiliate-link');
          var affiliate_banner = jQuery(this).attr('affiliate-banner');
          var copy_text = '<a href="'+affiliate_link+'" target="_blank"><img src="'+affiliate_banner+'" border="0"></a>';
          var $temp = jQuery("<input>");
          jQuery("body").append($temp);
          $temp.val(copy_text).select();
          document.execCommand("copy");
          $temp.remove();
          //jQuery('.copy-link-code1 a').tooltip("disable");
          jQuery(this).tooltip({ items: '.copy-link-code1 a', content: "Link code copied."});
          jQuery(this).tooltip("open");
          setTimeout(function () {    
            jQuery('.copy-link-code1 a').tooltip("disable");
          }, 3000);
          // console.log(copy_text);
        });
        jQuery('.affiliate-link-copy a').click(function (e) {
          e.preventDefault();
          var affiliate_link = jQuery(this).attr('affiliate-link');
          var $temp = jQuery("<input>");
          jQuery("body").append($temp);
          $temp.val(affiliate_link).select();
          document.execCommand("copy");
          $temp.remove();
          //jQuery('.copy-link-code1 a').tooltip("disable");
          jQuery(this).tooltip({ items: '.affiliate-link-copy a', content: "Link copied."});
          jQuery(this).tooltip("open");
          setTimeout(function () {    
            jQuery('.affiliate-link-copy a').tooltip("disable");
          }, 3000);
          // console.log(affiliate_link);
        });
      }
    }
  };
})(jQuery, Drupal);
