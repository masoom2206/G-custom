/**
 * File: fullscreen-loader.js
 *
 * Contains code to execute preloader for fullscreen slider. And only run with jQuery from 1.7
 */
(function ($) {
    $.fn.fullScreenLoader = function (fullScreenSlider) {

        $(this).queryLoader2({
            barColor: "#6e6d73",
            backgroundColor: "#fff1b0",
            percentage: true,
            loadingBar: true,
            barHeight: 1,
            completeAnimation: "grow",
            minimumTime: 100,
            onComplete: function () {
                fullScreenSlider.preloadCompete();
            }
        });
    }
})(jQuery)
