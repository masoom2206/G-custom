/**
 * Created with magedrupal.com.
 * User: baonv
 * Date: 8/19/13
 * Time: 4:21 PM
 */
(function ($) {
    var animEndEventNames = {
        'WebkitAnimation' : 'webkitAnimationEnd',
        'OAnimation' : 'oAnimationEnd',
        'msAnimation' : 'MSAnimationEnd',
        'animation' : 'animationend'
        },
        animEndEventName = animEndEventNames[window.Modernizr.prefixed('animation')];
    /*
     */
    function getInOutClass(animation) {
        var outClass, inClass, delay = 0;
        switch(animation) {
            case 'moveRightLeftEasing':
                outClass = 'pt-page-moveToLeftEasing pt-page-ontop';
                inClass = 'pt-page-moveFromRight';
                break;
            case 'moveLeftTopEasing':
                outClass = 'pt-page-moveToRightEasing pt-page-ontop';
                inClass = 'pt-page-moveFromLeft';
                break;
            case 'moveBottomTopEasing':
                outClass = 'pt-page-moveToTopEasing pt-page-ontop';
                inClass = 'pt-page-moveFromBottom';
                break;
            case 'moveFromTopMoveToBottomEasing':
                outClass = 'pt-page-moveToBottomEasing pt-page-ontop';
                inClass = 'pt-page-moveFromTop';
                break;
            case 'moveRightScaleDown':
                outClass = 'pt-page-scaleDown';
                inClass = 'pt-page-moveFromRight pt-page-ontop';
                break;
            case 'moveLeftScaleDown':
                outClass = 'pt-page-scaleDown';
                inClass = 'pt-page-moveFromLeft pt-page-ontop';
                break;
            case 'moveBottomScaleDown':
                outClass = 'pt-page-scaleDown';
                inClass = 'pt-page-moveFromBottom pt-page-ontop';
                break;
            case 'moveTopScaleDown':
                outClass = 'pt-page-scaleDown';
                inClass = 'pt-page-moveFromTop pt-page-ontop';
                break;
            case 'scaleUpDownScaleDown':
                outClass = 'pt-page-scaleDown';
                inClass = 'pt-page-scaleUpDown pt-page-delay300';
				delay = 300;
                break;
            case 'scaleUpScaleDownUp':
                outClass = 'pt-page-scaleDownUp';
                inClass = 'pt-page-scaleUp pt-page-delay300';
				delay = 300;
                break;
            case 'scaleUpMoveToLeft':
                outClass = 'pt-page-moveToLeft pt-page-ontop';
                inClass = 'pt-page-scaleUp';
                break;
            case 'scaleUpMoveToRight':
                outClass = 'pt-page-moveToRight pt-page-ontop';
                inClass = 'pt-page-scaleUp';
                break;
            case 'scaleUpMoveToTop':
                outClass = 'pt-page-moveToTop pt-page-ontop';
                inClass = 'pt-page-scaleUp';
                break;
            case 'scaleUpMoveToBottom':
                outClass = 'pt-page-moveToBottom pt-page-ontop';
                inClass = 'pt-page-scaleUp';
                break;
            case 'scaleUpCenterScaleDownCenter':
                outClass = 'pt-page-scaleDownCenter';
                inClass = 'pt-page-scaleUpCenter pt-page-delay400';
				delay = 400;
                break;
            case 'moveFromRightRotateRightSideFirst':
                outClass = 'pt-page-rotateRightSideFirst';
                inClass = 'pt-page-moveFromRight pt-page-delay200 pt-page-ontop';
                break;
            case 'moveFromLeftRotateLeftSideFirst':
                outClass = 'pt-page-rotateLeftSideFirst';
                inClass = 'pt-page-moveFromLeft pt-page-delay200 pt-page-ontop';
                break;
            case 'moveFromTopRotateTopSideFirst':
                outClass = 'pt-page-rotateTopSideFirst';
                inClass = 'pt-page-moveFromTop pt-page-delay200 pt-page-ontop';
                break;
            case 'moveFromBottomRotateBottomSideFirst':
                outClass = 'pt-page-rotateBottomSideFirst';
                inClass = 'pt-page-moveFromBottom pt-page-delay200 pt-page-ontop';
                break;
            case 'flipInLeftFlipOutRight':
                outClass = 'pt-page-flipOutRight';
                inClass = 'pt-page-flipInLeft pt-page-delay500';
				delay = 500;
                break;
            case 'flipInRightFlipOutLeft':
                outClass = 'pt-page-flipOutLeft';
                inClass = 'pt-page-flipInRight pt-page-delay500';
				delay = 500;
                break;
            case 'flipInBottomFlipOutTop':
                outClass = 'pt-page-flipOutTop';
                inClass = 'pt-page-flipInBottom pt-page-delay500';
				delay = 500;
                break;
            case 'flipInTopFlipOutBottom':
                outClass = 'pt-page-flipOutBottom';
                inClass = 'pt-page-flipInTop pt-page-delay500';
				delay = 500;
                break;
            case 'scaleUpRotateFall':
                outClass = 'pt-page-rotateFall pt-page-ontop';
                inClass = 'pt-page-scaleUp';
                break;
            case 'rotateInNewspaperRotateOutNewspaper':
                outClass = 'pt-page-rotateOutNewspaper';
                inClass = 'pt-page-rotateInNewspaper pt-page-delay500';
				delay = 500;
                break;
            case 'moveFromRightRotatePushLeft':
                outClass = 'pt-page-rotatePushLeft';
                inClass = 'pt-page-moveFromRight';
                break;
            case 'moveFromLeftRotatePushRight':
                outClass = 'pt-page-rotatePushRight';
                inClass = 'pt-page-moveFromLeft';
                break;
            case 'moveFromBottomRotatePushTop':
                outClass = 'pt-page-rotatePushTop';
                inClass = 'pt-page-moveFromBottom';
                break;
            case 'moveFromTopRotatePushBottom':
                outClass = 'pt-page-rotatePushBottom';
                inClass = 'pt-page-moveFromTop';
                break;
            case 'rotatePullRightRotatePushLeft':
                outClass = 'pt-page-rotatePushLeft';
                inClass = 'pt-page-rotatePullRight pt-page-delay180';
				delay = 180;
                break;
            case 'rotatePullLeftRotatePushRight':
                outClass = 'pt-page-rotatePushRight';
                inClass = 'pt-page-rotatePullLeft pt-page-delay180';
				delay = 180;
                break;
            case 'rotatePullBottomRotatePushTop':
                outClass = 'pt-page-rotatePushTop';
                inClass = 'pt-page-rotatePullBottom pt-page-delay180';
				delay = 180;
                break;
            case 'rotatePullTopRotatePushBottom':
                outClass = 'pt-page-rotatePushBottom';
                inClass = 'pt-page-rotatePullTop pt-page-delay180';
				delay = 180;
                break;
            case 'moveFromRightFadeRotateFoldLeft':
                outClass = 'pt-page-rotateFoldLeft';
                inClass = 'pt-page-moveFromRightFade';
                break;
            case 'moveFromLeftFadeRotateFoldRight':
                outClass = 'pt-page-rotateFoldRight';
                inClass = 'pt-page-moveFromLeftFade';
                break;
            case 'moveFromBottomFadeRotateFoldTop':
                outClass = 'pt-page-rotateFoldTop';
                inClass = 'pt-page-moveFromBottomFade';
                break;
            case 'moveFromTopFadeRotateFoldBottom':
                outClass = 'pt-page-rotateFoldBottom';
                inClass = 'pt-page-moveFromTopFade';
                break;
            case 'rotateUnfoldLeftMoveToRightFade':
                outClass = 'pt-page-moveToRightFade';
                inClass = 'pt-page-rotateUnfoldLeft';
                break;
            case 'rotateUnfoldRightMoveToLeftFade':
                outClass = 'pt-page-moveToLeftFade';
                inClass = 'pt-page-rotateUnfoldRight';
                break;
            case 'rotateUnfoldTopMoveToBottomFade':
                outClass = 'pt-page-moveToBottomFade';
                inClass = 'pt-page-rotateUnfoldTop';
                break;
            case 'rotateUnfoldBottomMoveToTopFade':
                outClass = 'pt-page-moveToTopFade';
                inClass = 'pt-page-rotateUnfoldBottom';
                break;
            case 'rotateRoomLeftInRotateRoomLeftOut':
                outClass = 'pt-page-rotateRoomLeftOut pt-page-ontop';
                inClass = 'pt-page-rotateRoomLeftIn';
                break;
            case 'rotateRoomRightInRotateRoomRightOut':
                outClass = 'pt-page-rotateRoomRightOut pt-page-ontop';
                inClass = 'pt-page-rotateRoomRightIn';
                break;
            case 'rotateRoomTopInRotateRoomTopOut':
                outClass = 'pt-page-rotateRoomTopOut pt-page-ontop';
                inClass = 'pt-page-rotateRoomTopIn';
                break;
            case 'rotateRoomBottomInRotateRoomBottomOut':
                outClass = 'pt-page-rotateRoomBottomOut pt-page-ontop';
                inClass = 'pt-page-rotateRoomBottomIn';
                break;
            case 'rotateCubeLeftInRotateCubeLeftOut':
                outClass = 'pt-page-rotateCubeLeftOut pt-page-ontop';
                inClass = 'pt-page-rotateCubeLeftIn';
                break;
            case 'rotateCubeRightInRotateCubeRightOut':
                outClass = 'pt-page-rotateCubeRightOut pt-page-ontop';
                inClass = 'pt-page-rotateCubeRightIn';
                break;
            case 'rotateCubeTopInRotateCubeTopOut':
                outClass = 'pt-page-rotateCubeTopOut pt-page-ontop';
                inClass = 'pt-page-rotateCubeTopIn';
                break;
            case 'rotateCubeBottomInRotateCubeBottomOut':
                outClass = 'pt-page-rotateCubeBottomOut pt-page-ontop';
                inClass = 'pt-page-rotateCubeBottomIn';
                break;
            case 'rotateCarouselLeftInRotateCarouselLeftOut':
                outClass = 'pt-page-rotateCarouselLeftOut pt-page-ontop';
                inClass = 'pt-page-rotateCarouselLeftIn';
                break;
            case 'rotateCarouselRightInRotateCarouselRightOut':
                outClass = 'pt-page-rotateCarouselRightOut pt-page-ontop';
                inClass = 'pt-page-rotateCarouselRightIn';
                break;
            case 'rotateCarouselTopInRotateCarouselTopOut':
                outClass = 'pt-page-rotateCarouselTopOut pt-page-ontop';
                inClass = 'pt-page-rotateCarouselTopIn';
                break;
            case 'rotateCarouselBottomInRotateCarouselBottomOut':
                outClass = 'pt-page-rotateCarouselBottomOut pt-page-ontop';
                inClass = 'pt-page-rotateCarouselBottomIn';
                break;
            case 'rotateSidesInRotateSidesOut':
                outClass = 'pt-page-rotateSidesOut';
                inClass = 'pt-page-rotateSidesIn pt-page-delay200';
				delay = 200;
                break;
            case 'rotateSlideInRotateSlideOut':
                outClass = 'pt-page-rotateSlideOut';
                inClass = 'pt-page-rotateSlideIn';
                break;
        }
        return [inClass, outClass, delay];
    }
    $.fn.mdFullScreenSlider.fxTransitions['css3'] = function(self, condition, transitionSpeed) {
        self.addTwoStrips(self.options.css3BackgroundColor);
        var inOutClass = getInOutClass(condition), inClass = inOutClass[0], outClass = inOutClass[1], delay = inOutClass[2],
		css = {
			'-moz-animation-duration': (transitionSpeed - delay) + "ms",
			'-webkit-animation-duration': (transitionSpeed - delay) + "ms",
			'-ms-animation-duration': (transitionSpeed - delay) + "ms",
			'animation-duration': (transitionSpeed - delay) + "ms"
		};
		var $pages = $('.mdslider-strip', self.slider).css(css),
			$currPage = $pages.first(),
            $nextPage = $pages.last(),
            endCurrPage = false,
            endNextPage = false;
        $currPage.addClass(outClass).bind(animEndEventName, function() {
            $currPage.unbind(animEndEventName);
            endCurrPage = true;
            if(endNextPage) {
                self.transitionEnd();
            }
        });
        $nextPage.addClass(inClass).bind(animEndEventName, function() {
            $nextPage.unbind(animEndEventName);
            endNextPage = true;
            if(endCurrPage) {
                self.transitionEnd();
            }
        });
    };
    $.fn.mdFullScreenSlider.transitions = $.fn.mdFullScreenSlider.transitions.concat([
        'css3-moveRightLeftEasing',
        'css3-moveLeftTopEasing',
        'css3-moveBottomTopEasing',
        'css3-moveFromTopMoveToBottomEasing',
        'css3-moveRightScaleDown',
        'css3-moveLeftScaleDown',
        'css3-moveBottomScaleDown',
        'css3-moveTopScaleDown',
        'css3-scaleUpDownScaleDown',
        'css3-scaleUpScaleDownUp',
        'css3-scaleUpMoveToLeft',
        'css3-scaleUpMoveToRight',
        'css3-scaleUpMoveToTop',
        'css3-scaleUpMoveToBottom',
        'css3-scaleUpCenterScaleDownCenter',
        'css3-moveFromRightRotateRightSideFirst',
        'css3-moveFromLeftRotateLeftSideFirst',
        'css3-moveFromTopRotateTopSideFirst',
        'css3-moveFromBottomRotateBottomSideFirst',
        'css3-flipInLeftFlipOutRight',
        'css3-flipInRightFlipOutLeft',
        'css3-flipInBottomFlipOutTop',
        'css3-flipInTopFlipOutBottom',
        'css3-scaleUpRotateFall',
        'css3-rotateInNewspaperRotateOutNewspaper',
        'css3-moveFromRightRotatePushLeft',
        'css3-moveFromLeftRotatePushRight',
        'css3-moveFromBottomRotatePushTop',
        'css3-moveFromTopRotatePushBottom',
        'css3-rotatePullRightRotatePushLeft',
        'css3-rotatePullLeftRotatePushRight',
        'css3-rotatePullBottomRotatePushTop',
        'css3-rotatePullTopRotatePushBottom',
        'css3-moveFromRightFadeRotateFoldLeft',
        'css3-moveFromLeftFadeRotateFoldRight',
        'css3-moveFromBottomFadeRotateFoldTop',
        'css3-moveFromTopFadeRotateFoldBottom',
        'css3-rotateUnfoldLeftMoveToRightFade',
        'css3-rotateUnfoldRightMoveToLeftFade',
        'css3-rotateUnfoldTopMoveToBottomFade',
        'css3-rotateUnfoldBottomMoveToTopFade',
        'css3-rotateRoomLeftInRotateRoomLeftOut',
        'css3-rotateRoomRightInRotateRoomRightOut',
        'css3-rotateRoomTopInRotateRoomTopOut',
        'css3-rotateRoomBottomInRotateRoomBottomOut',
        'css3-rotateCubeLeftInRotateCubeLeftOut',
        'css3-rotateCubeRightInRotateCubeRightOut',
        'css3-rotateCubeTopInRotateCubeTopOut',
        'css3-rotateCubeBottomInRotateCubeBottomOut',
        'css3-rotateCarouselLeftInRotateCarouselLeftOut',
        'css3-rotateCarouselRightInRotateCarouselRightOut',
        'css3-rotateCarouselTopInRotateCarouselTopOut',
        'css3-rotateCarouselBottomInRotateCarouselBottomOut',
        'css3-rotateSidesInRotateSidesOut',
        'css3-rotateSlideInRotateSlideOut'
    ]);
    $.fn.mdFullScreenSlider.css3Transitions = $.fn.mdFullScreenSlider.css3Transitions.concat([
        'css3-moveRightLeftEasing',
        'css3-moveLeftTopEasing',
        'css3-moveBottomTopEasing',
        'css3-moveFromTopMoveToBottomEasing',
        'css3-moveRightScaleDown',
        'css3-moveLeftScaleDown',
        'css3-moveBottomScaleDown',
        'css3-moveTopScaleDown',
        'css3-scaleUpDownScaleDown',
        'css3-scaleUpScaleDownUp',
        'css3-scaleUpMoveToLeft',
        'css3-scaleUpMoveToRight',
        'css3-scaleUpMoveToTop',
        'css3-scaleUpMoveToBottom',
        'css3-scaleUpCenterScaleDownCenter',
        'css3-moveFromRightRotateRightSideFirst',
        'css3-moveFromLeftRotateLeftSideFirst',
        'css3-moveFromTopRotateTopSideFirst',
        'css3-moveFromBottomRotateBottomSideFirst',
        'css3-flipInLeftFlipOutRight',
        'css3-flipInRightFlipOutLeft',
        'css3-flipInBottomFlipOutTop',
        'css3-flipInTopFlipOutBottom',
        'css3-scaleUpRotateFall',
        'css3-rotateInNewspaperRotateOutNewspaper',
        'css3-moveFromRightRotatePushLeft',
        'css3-moveFromLeftRotatePushRight',
        'css3-moveFromBottomRotatePushTop',
        'css3-moveFromTopRotatePushBottom',
        'css3-rotatePullRightRotatePushLeft',
        'css3-rotatePullLeftRotatePushRight',
        'css3-rotatePullBottomRotatePushTop',
        'css3-rotatePullTopRotatePushBottom',
        'css3-moveFromRightFadeRotateFoldLeft',
        'css3-moveFromLeftFadeRotateFoldRight',
        'css3-moveFromBottomFadeRotateFoldTop',
        'css3-moveFromTopFadeRotateFoldBottom',
        'css3-rotateUnfoldLeftMoveToRightFade',
        'css3-rotateUnfoldRightMoveToLeftFade',
        'css3-rotateUnfoldTopMoveToBottomFade',
        'css3-rotateUnfoldBottomMoveToTopFade',
        'css3-rotateRoomLeftInRotateRoomLeftOut',
        'css3-rotateRoomRightInRotateRoomRightOut',
        'css3-rotateRoomTopInRotateRoomTopOut',
        'css3-rotateRoomBottomInRotateRoomBottomOut',
        'css3-rotateCubeLeftInRotateCubeLeftOut',
        'css3-rotateCubeRightInRotateCubeRightOut',
        'css3-rotateCubeTopInRotateCubeTopOut',
        'css3-rotateCubeBottomInRotateCubeBottomOut',
        'css3-rotateCarouselLeftInRotateCarouselLeftOut',
        'css3-rotateCarouselRightInRotateCarouselRightOut',
        'css3-rotateCarouselTopInRotateCarouselTopOut',
        'css3-rotateCarouselBottomInRotateCarouselBottomOut',
        'css3-rotateSidesInRotateSidesOut',
        'css3-rotateSlideInRotateSlideOut'
    ]);
})(jQuery);
