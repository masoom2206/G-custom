/*------------------------------------------------------------------------
 # MegaSlide - Sep 17, 2013
# ------------------------------------------------------------------------
# Designed & Handcrafted by MegaDrupal
# Websites:  http://www.megadrupal.com -  Email: info@megadrupal.com
# Author: BaoNV
------------------------------------------------------------------------*/

(function($) {
    window.MegaSlider = {
        version : 1.0,
        name	: 'Md Mega Slider',
        author	: 'Megadrupal.com'
    }
    MegaSlider.Main = function(){
       this.panel = new MegaSlider.Panel();
    }
    MegaSlider.Main.prototype = {
        constructor : MegaSlider.Main,
        init : function(){
            this.panel.init();
        }
    }
    $(document).ready(function () {
        var main = new MegaSlider.Main();
        main.init();
    });
})(jQuery);
