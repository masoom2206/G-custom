/*------------------------------------------------------------------------
# OrenMode
# ------------------------------------------------------------------------
# HTML5 by MegaDrupal
# Websites:  http://www.megadrupal.com -  Email: info@megadrupal.com
--------------------------------------------------------------------------*/
(function ($, Drupal, drupalSettings) {
  var initialized;
  Drupal.behaviors.HomepageBehavior = {
    attach: function (context, settings) {
      "use strict";

      jQuery(window).on('load', function(){
          SliderHome();
          //ResizeSliderHome();
      });


      /*==========  Slider Home ==========*/
      function SliderHome(){
          if(jQuery('#slide-home').length){
              jQuery('#slide-home').owlCarousel({
                    navigation : false, // Show next and prev buttons
                    items:1,
                    loop:true,
                    margin:10,
                    autoplay:true,
                    autoplayTimeout:5000,
                    autoplayHoverPause:true,
                    slideSpeed : 2000,
                    pagination : true,
                    paginationSpeed : 1900,
              });
              /*jQuery('#slide-home').owlCarousel({
                  autoPlay: 2000,
                  navigation: false,
                  pagination: true,
                  singleItem: true,
                  mouseDrag:false,
                  addClassActive:true,
                  loop: true,
                  item:1,
                  transitionStyle:'fade'
              });/*/
          }
      }
    }
  }
})(jQuery, Drupal, drupalSettings);
