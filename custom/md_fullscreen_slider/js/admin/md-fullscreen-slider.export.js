/**
 * FileName: md-fullscreen-slider.export.js
 * Author: MegaDrupal
 */
(function($) {
    Drupal.behaviors.fullscreen_export = {
        attach: function(context, settings) {
            $("#edit-export-btn", context).click(function() {
                var sliders = [];
                $("#edit-sliders input[class=form-checkbox]:checked", context).each(function() {
                    sliders.push($(this).val());
                });
                $(this).attr("href", settings.basePath + "?q=/admin/structure/fullscreen-slider/export/&sliders=" + sliders.join());
            });
        }
    }
})(jQuery);
