/*------------------------------------------------------------------------
 # MD Slider - March 18, 2013
 # ------------------------------------------------------------------------
 # Websites:  http://www.megadrupal.com -  Email: info@megadrupal.com
 --------------------------------------------------------------------------*/

(function ($) {
    effectsIn = [
        'bounceIn',
        'bounceInDown',
        'bounceInUp',
        'bounceInLeft',
        'bounceInRight',
        'fadeIn',
        'fadeInUp',
        'fadeInDown',
        'fadeInLeft',
        'fadeInRight',
        'fadeInUpBig',
        'fadeInDownBig',
        'fadeInLeftBig',
        'fadeInRightBig',
        'flipInX',
        'flipInY',
        'foolishIn',
        'lightSpeedIn',
        'rollIn',
        'rotateIn',
        'rotateInDownLeft',
        'rotateInDownRight',
        'rotateInUpLeft',
        'rotateInUpRight',
        'twisterInDown',
        'twisterInUp',
        'swap',
        'swashIn',
        'tinRightIn',
        'tinLeftIn', 
        'tinUpIn',
        'tinDownIn'
    ];
    effectsOut = [
        'bombRightOut',
        'bombLeftOut',
        'bounceOut',
        'bounceOutDown',
        'bounceOutUp',
        'bounceOutLeft',
        'bounceOutRight',
        'fadeOut',
        'fadeOutUp',
        'fadeOutDown',
        'fadeOutLeft',
        'fadeOutRight',
        'fadeOutUpBig',
        'fadeOutDownBig',
        'fadeOutLeftBig',
        'fadeOutRightBig',
        'flipOutX',
        'flipOutY',
        'foolishOut',
        'hinge',
        'holeOut',
        'lightSpeedOut',
        'puffOut',
        'rollOut',
        'rotateOut',
        'rotateOutDownLeft',
        'rotateOutDownRight',
        'rotateOutUpLeft',
        'rotateOutUpRight',
        'rotateDown',
        'rotateUp',
        'rotateLeft',
        'rotateRight',
        'swashOut',
        'tinRightOut',
        'tinLeftOut',
        'tinUpOut',
        'tinDownOut',
        'vanishOut'
    ];
    var e_in_length = effectsIn.length;
    var e_out_length = effectsOut.length;
    var MdFullScreenSlider = function($elm, options) {
        var defaults = {
            transitions: "slideInRight", // name of transition effect (fade, scrollLeft, scrollRight, scrollHorz, scrollUp, scrollDown, scrollVert)
            transitionsSpeed: 800, // speed of the transition (millisecond)
            wrapHeight: "100%",
            wrapWidth: "100%",
            width: 1220, // effect zone width
            height: 660, // effect zone height
            thumbWidth: 100, // Thumbnail width
            thumbHeight: 60, // Thumbnail height
            slideShowDelay: 6000, // Default life time of slide
            autoPlay: true, // Auto play slide when start
            loop: false, // Play slides circle continue
            enablePreLoad: false, // Use pre-load when start slide
            pauseOnHover: true, // pause slide when mouse on hover
            showBullet: true, // Show bullet navigation
            posBullet: 2, // Bullet position, from 1 to 6, default is 2
            hoverBullet: true, // Show bullet when hover on slide
            showThumb: true, // Show thumbnail, if showBullet = true and showThumb = true, thumbnail will be shown when you hover bullet navigation
            posThumb: 1, // Thumbnail position, from 1 to 5, default is 1 (1: in navigation button, 2: top, 3: bottom, 4: left, 5: right)
			css3BackgroundColor: '#000',
            showLoading: true, // Show/hide loading bar
            loadingPosition: 'bottom', // choose your loading bar position (top, bottom)
            enableNextPrev: true, // show/hide next, previous arrows
            hoverNextPrev: true, // show/hide next, previous arrows when mouse hover
            enableKeyNavigation: true, // next, previous slide when arrow keys press
            enableDrag: true, // Enable mouse drag
            touchSensitive: 50,
            stripCols: 20,
            stripRows: 10,
            onInit: function() {},	//this callback is invoked when slider pre-load
            onEndTransition: function() {},	//this callback is invoked when the transition effect ends
            onStartTransition: function() {}	//this callback is invoked when the transition effect starts
        };
        var self = this;
        this.options = $.extend(defaults, options);
        this.slider = $elm;
        this.slider.addClass("loading-image");
        this.slider.wrap('<div class="mdf-slide-wrap"><div class="mdf-item-wrap"></div></div>');
        this.hoverDiv = this.slider.parent().parent();
        var slideClass = this.slider.attr("id") + "-wrap";
        if (self.options.showBullet && self.options.posBullet)
            slideClass += ' mdf-slide-bullet-' + self.options.posBullet;
        if (self.options.showThumb && self.options.posThumb)
            slideClass += ' mdf-slide-thumb-' + self.options.posThumb;

        this.wrap = this.hoverDiv.parent();
		this.wrap.addClass(slideClass);
        this.setWrapSize();
        this.slideWidth = this.wrap.width();
        this.slideHeight = this.wrap.height();
        this.slideItems = {};
        this.hasTouch = this.documentHasTouch();
        if(this.hasTouch)
            this.wrap.addClass("mdf-touchdevice");

        this.slideItems = {};
        this.numSlide = 0;
        this.slider.find('.mdf-slide-item').each(function (index) {
            self.slideItems[index] = $(this);
            self.numSlide++;
            $(this).find(".mdf-object").each(function() {
                var top =  $(this).data("y") ? $(this).data("y") : 0,
                    left = $(this).data("x") ? $(this).data("x") : 0,
                    width = $(this).data("width") ? $(this).data("width") : 0,
                    height = $(this).data("height") ? $(this).data("height") : 0;
                if(width > 0) {
                    $(this).width((width / self.options.width * 100) + "%");
                }
                if(height > 0) {
                    $(this).height((height / self.options.height * 100) + "%");
                }
                var css = {
                    top:(top / self.options.height * 100) + "%",
                    left:(left / self.options.width * 100) + "%"
                };
                $(this).css(css);
            });
            if(index > 0)
                $(this).hide();
        });

        this.oIndex = null;
        this.activeIndex = -1;
        this.lock = true;
        this.supportCss3 = (window.Modernizr.csstransitions && window.Modernizr.csstransforms3d);
        this.transitions = $.fn.mdFullScreenSlider.transitions;
        this.css3Transitions = $.fn.mdFullScreenSlider.css3Transitions;
        this.initControl();
        this.initDrag();
        if(self.options.autoPlay) {
            this.play = true;
        }
        $('.mdf-object', this.slider).hide();
        if($(".mdf-video", this.wrap).size() > 0) {
            var videoCtrl = $('<div class="mdf-video-control" style="display: none"></div>');
            this.wrap.append(videoCtrl);
            $(".mdf-video", this.wrap).click(function() {
                var video_ele = $("<iframe></iframe>");
                video_ele.attr('allowFullScreen' , '').attr('frameborder' , '0').css({width:"100%", height: "100%", background: "black"});
                video_ele.attr("src", $(this).attr("href"));
                var closeButton = $('<a href="#" class="mdf-close-video" title="Close video"></a>');
                closeButton.click(function() {
                    videoCtrl.html("").hide();
                    self.play = true;
                    return false;
                });
                videoCtrl.html("").append(video_ele).append(closeButton).show();
                self.play = false;
                return false;
            });
        }
        $(window).resize(function() {
            self.resizeWindow();
        });
        if (!self.options.enablePreLoad) {
            self.preloadCompete();
        }
		this.focusWindow();
    };
    MdFullScreenSlider.prototype = {
        constructor: MdFullScreenSlider,
        initControl: function() {
            var self = this;
            // Loading bar
            if(this.options.autoPlay && this.options.showLoading) {
                var loadingDiv = $('<div class="loading-bar-hoz loading-bar-' + this.options.loadingPosition + '"><div class="br-timer-glow" style="left: -100px;"></div><div class="br-timer-bar" style="width:0px"></div></div>');
                this.hoverDiv.append(loadingDiv);
                this.loadingBar = $(".br-timer-bar", loadingDiv);
                this.timerGlow  = $(".br-timer-glow", loadingDiv);
            }
            if(this.options.autoPlay && this.options.pauseOnHover) {
                this.hoverDiv.hover(function() {
                    self.pause = true;
                }, function() {
                    self.pause = false;
                });
            }
            // Next, preview arrow
            if (this.options.enableNextPrev) {
                this.arrowButton = $('<div class="mdf-arrow"><div class="mdf-arrow-left"><span></span></div><div class="mdf-arrow-right"><span></span></div></div>');
                this.hoverDiv.append(this.arrowButton);
                $('.mdf-arrow-right', this.arrowButton).bind('click', function () {
                    self.slideNext();
                });
                $('.mdf-arrow-left', this.arrowButton).bind('click', function () {
                    self.slidePrev();
                });
            }
            // Next, Previous with key
            if (this.options.enableKeyNavigation) {
                $(window).keyup(function(event) {
                    var key = event.keyCode || event.which;
                    if (key == 37 || key == 38)
                        self.slidePrev();
                    else if(key == 39 || key == 40)
                        self.slideNext();
                });
            }
            if (this.options.showBullet != false) {
                this.buttons = $('<div class="mdf-bullets" style="opacity:0"></div>');
                this.hoverDiv.append(this.buttons);
                for (var i = 0; i < this.numSlide; i++) {
                    this.buttons.append('<div class="mdf-bullet"  rel="' + i + '"><a></a></div>');
                };
                if (this.options.showThumb && this.options.posThumb == 1) {
                    var thumbW = self.options.thumbWidth,
                        thumbH = self.options.thumbHeight;
                    for (var i = 0; i < this.numSlide; i++) {
                        var thumbSrc = this.slideItems[i].data("thumb");
                        if(thumbSrc) {
                            var top = -(9 + thumbH);
                            if (self.options.posBullet == 4 || self.options.posBullet == 5 || self.posBullet == 6)
                                top = 21;
                            var thumb = $('<img />').attr("src", thumbSrc).css({top: top + "px", left: -(thumbW/2 - 2) + "px", opacity: 0});
                            $('div.mdf-bullet:eq(' + i + ')', this.buttons).append(thumb).append('<div class="mdf-thumb-arrow" style="opacity: 0"></div>');
                        }
                    }
                    $('div.mdf-bullet', this.buttons).hover(function () {
                        $(this).addClass('md_hover');
                        var img = $("img", this);
                        if(img.length) {
                            img.show().animate({'opacity':1},200);
                            $('.mdf-thumb-arrow', this).show().animate({'opacity':1}, 200);
                        }
                    }, function () {
                        $(this).removeClass('md_hover');
                        $('img', this).animate({'opacity':0}, 200,function(){
                            $(this).hide();
                        });
                        $('.mdf-thumb-arrow',this).animate({'opacity':0},200,function(){
                            $(this).hide();
                        });
                    });
                }
                $('div.mdf-bullet', self.wrap).click(function () {
                    if ($(this).hasClass('mdf-current')) {
                        return false;
                    };
                    var index = $(this).attr('rel');
                    self.slide(index);
                });
            }
            if (self.options.showThumb && this.options.posThumb != 1) {
                var thumbDiv = $('<div class="mdf-thumb"><div class="mdf-thumb-container"><div class="mdf-thumb-items"></div></div></div>').appendTo(self.hoverDiv);
                self.slideThumb =  $(".mdf-thumb-items", thumbDiv);
                for (var i = 0; i < this.numSlide; i++) {
                    var thumbSrc = self.slideItems[i].data("thumb");
                    if(thumbSrc) {
                        var link = $('<a class="mdf-thumb-item" />').attr("rel", i).append($('<img />').attr("src", thumbSrc));
                        self.slideThumb.append(link);
                    }
                }
                $("a", self.slideThumb).click(function() {
                    if ($(this).hasClass('mdf-current')) {
                        return false;
                    };
                    var index = $(this).attr('rel');
                    self.slide(index);
                });
            }
        },
        initDrag: function() {
            var self = this,
                touchstart = false,
                isScrolling = false,
                mouseleft = 0;
            if(this.hasTouch) {
                this.slider.bind('touchstart', function(event) {
                    if(touchstart) return false;
                    event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                    touchstart = true;
                    isScrolling = undefined;
                    self.mouseY = event.pageY;
                    self.mouseX = event.pageX;
                });
                this.slider.bind('touchmove', function (event) {
                    event = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                    if (touchstart) {
                        var pageX = (event.pageX || event.clientX);
                        var pageY = (event.pageY || event.clientY);

                        if ( typeof isScrolling == 'undefined') {
                            isScrolling = !!( isScrolling || Math.abs(pageY - self.mouseY) > Math.abs( pageX - self.mouseX ) )
                        }
                        if (isScrolling ) {
                            touchstart = false;
                            return
                        } else {
                            mouseleft = pageX - self.mouseX;
                            return false;
                        }
                    };
                    return ;
                });
                this.slider.bind('touchend', function() {
                    if(touchstart) {
                        touchstart = false;
                        if(mouseleft > self.options.touchSensitive) {
                            self.slidePrev();
                            mouseleft = 0;
                            return false;
                        } else if(mouseleft < - self.options.touchSensitive) {
                            self.slideNext();
                            mouseleft = 0;
                            return false;
                        }
                    }
                });
            } else {
                if (this.options.hoverNextPrev) {
                    this.hoverDiv.hover(function() {
                        if (self.arrowButton) {
                            $(".mdf-arrow-left", self.arrowButton).stop(true, true).animate({left: '10px', opacity:1}, 200);
                            $(".mdf-arrow-right", self.arrowButton).stop(true, true).animate({right: '10px', opacity:1}, 200);
                        }
                    }, function() {
                        if (self.arrowButton) {
                            $(".mdf-arrow-left", self.arrowButton).stop(true, true).animate({left: '-40px', opacity:0}, 200);
                            $(".mdf-arrow-right", self.arrowButton).stop(true, true).animate({right: '-40px', opacity:0}, 200);
                        }
                    });
                }
                else {
                    $(".mdf-arrow-left", self.arrowButton).stop(true, true).animate({left: '10px', opacity:1}, 200);
                    $(".mdf-arrow-right", self.arrowButton).stop(true, true).animate({right: '10px', opacity:1}, 200);
                }

                if (this.options.showBullet) {
                    if (this.options.hoverBullet) {
                        this.hoverDiv.hover(
                            function() {
                                if (self.buttons)
                                    self.buttons.animate({opacity: 1}, 200);
                            },
                            function(){
                                if (self.buttons)
                                    self.buttons.animate({opacity: 0}, 200);
                            }
                        );
                    }
                    else {
                        self.buttons.animate({opacity: 1}, 200);
                    }
                }
                this.wrap.trigger("hover");
            }

            if (this.options.enableDrag) {
                this.slider.mousedown(function (event) {
                    if (!touchstart) {
                        touchstart = true;
                        isScrolling = undefined;
                        self.mouseY = event.pageY;
                        self.mouseX = event.pageX;
                    }
                    return false;
                });
                this.slider.mousemove(function (event) {
                    if (touchstart) {
                        var pageX = (event.pageX || event.clientX);
                        var pageY = (event.pageY || event.clientY);

                        if ( typeof isScrolling == 'undefined') {
                            isScrolling = !!( isScrolling || Math.abs(pageY - self.mouseY) > Math.abs( pageX - self.mouseX ) )
                        }
                        if (isScrolling ) {
                            touchstart = false;
                            return
                        } else {
                            mouseleft = pageX - self.mouseX;
                            return false;
                        }
                    };
                    return ;
                });
                this.slider.mouseup(function () {
                    if(touchstart) {
                        touchstart = false;
                        if(mouseleft > self.options.touchSensitive) {
                            self.slidePrev();
                        } else if(mouseleft < - self.options.touchSensitive) {
                            self.slideNext();
                        }
                        mouseleft = 0;
                        return false;
                    }
                });
                this.slider.mouseleave(function () {
                    self.slider.mouseup();
                });
            }
        },
        documentHasTouch: function() {
            return ('ontouchstart' in window || 'createTouch' in document);
        },
        slideReady: function() {
            this.slider.removeClass("loading-image");
            this.resizeWindow();
            this.slide(0);
            if(!this.timer)
                this.setTimer();
        },
        setTimer: function() {
            var self = this;
            this.timer = setInterval(function() {self.next()}, 40);
        },
        clearTimer: function() {
            if(!this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
        next: function() {
            if(this.lock) return;
            if(this.play && !this.pause) {
                this.step += 40;
                if(this.step > this.slideShowDelay) {
                    this.slideNext();
                } else if(this.loadingBar) {
                    var width = this.step * this.slideWidth / this.slideShowDelay;
                    this.loadingBar.width(width);
                    this.timerGlow.css({left: width - 100 + 'px'});
                }
            }
        },
        slide: function(index) {
            var self = this,
                transitionSpeed = this.slideItems[index].data("transition_time") ? this.slideItems[index].data("transition_time") : self.options.transitionsSpeed;
            this.step = 0;
            this.slideShowDelay = this.slideItems[index].data("timeout") ? this.slideItems[index].data("timeout") : this.options.slideShowDelay;
            if(this.loadingBar) {
                var width = this.step * this.slideWidth / this.slideShowDelay;
                this.loadingBar.width(width);
                this.timerGlow.css({left: width - 100 + 'px'});
            }
            this.oIndex = this.activeIndex;
            this.activeIndex = index;
            this.options.onStartTransition.call(self);
            if (this.slideItems[this.oIndex]) {
                this.removeTheCaptions(this.slideItems[this.oIndex]);
                //Custom transition as defined by "data-transition" attribute
                var fx = this.slideItems[this.activeIndex].data('transition'), trans;
                if (!fx) {
                    fx = this.options.transitions;
                } 
				
				if (fx.toLowerCase() == 'random') {
                    trans = this.transitions;
                    fx = trans[Math.floor(Math.random() * (trans.length + 1))];
                } else if (fx.indexOf(',') != -1) {
                    trans = fx.split(',');
                    fx = trans[Math.floor(Math.random() * (trans.length))];
                }
                if(!this.supportCss3 && (jQuery.inArray(fx, this.css3Transitions) > -1)) {
                    fx = 'fade';
                }
                if (fx == undefined) fx = 'fade';
                fx = $.trim(fx);
                var fxs = fx.split('-'), condition = (fxs[1] != undefined) ? fxs[1] : null;
                fx = fxs[0];
                this.lock = true;
                if($.fn.mdFullScreenSlider.fxTransitions[fx] != undefined) {
                    $.fn.mdFullScreenSlider.fxTransitions[fx](self, condition, transitionSpeed);
                } else {
                    $.fn.mdFullScreenSlider.fxTransitions['fade'](self, transitionSpeed);
                }
            } else {
                this.slideItems[this.activeIndex].fadeIn();
                this.animateTheCaptions(this.slideItems[index]);
                this.lock = false;
            }
            if(self.buttons) {
                $('div.mdf-bullet.mdf-current', self.buttons).removeClass('mdf-current');
                $('div.mdf-bullet:eq(' + self.activeIndex + ')', self.buttons).addClass('mdf-current');
            }
            if(self.slideThumb) {
                $('a.mdf-current', self.slideThumb).removeClass('mdf-current');
                $('a:eq(' + self.activeIndex + ')', self.slideThumb).addClass('mdf-current');
            }
        },
        slideNext: function() {
            if(this.lock) return;
            var index = this.activeIndex;
            index++;
            if(index >= this.numSlide && this.options.loop) {
                index = 0;
                this.slide(index);
            } else if(index < this.numSlide) {

                this.slide(index);
            }
        },
        slidePrev: function() {
            if(this.lock) return;
            var index = this.activeIndex;
            index--;
            if(index < 0 && this.options.loop) {
                index = this.numSlide - 1;
                this.slide(index);
            } else if(index >= 0) {
                this.slide(index);
            }
        },
        endMoveCaption: function(caption) {
            clearTimeout(caption.data('timer-start'));
            if (!this.supportCss3) {
                caption.fadeOut();
            } else {
                caption.removeClass(effectsIn.join(' '));
                var easeout = caption.data("easeout");
                if(easeout) {
                    if(easeout == "random")
                        easeout = effectsOut[Math.floor(Math.random() * e_out_length)];
					if(caption.data("out-time") != undefined) {
						var outTime = caption.data("out-time"),
							transitionProp = {
								'animation-duration': outTime + 'ms',
								'-webkit-animation-duration': outTime + 'ms',
								'-moz-animation-duration': outTime + 'ms',
								'-ms-animation-duration': outTime + 'ms'
							};
						caption.css(transitionProp);
					}
                    caption.addClass(easeout);

                } else {
                    caption.hide();
                }
            }
        },
        removeTheCaptions: function(oItem) {
            oItem.find(".mdf-object").each(function() {
                var caption = $(this);
                caption.stop(true, true).hide();
                clearTimeout(caption.data('timer-start'));
                clearTimeout(caption.data('timer-stop'));
            });
        },
        animateTheCaptions: function(nextItem) {
            var self = this;
            $(".mdf-object", nextItem).each(function () {
                var caption = $(this);
                if(caption.data("easeout"))
                    caption.removeClass(effectsOut.join(' '));
                var easein = caption.data("easein") ? caption.data("easein") : "";
                if(easein == "random")
                    easein = effectsIn[Math.floor(Math.random() * e_in_length)];

                caption.removeClass(effectsIn.join(' '));
                caption.hide();
                if(caption.data("start") != undefined) {
                    caption.data('timer-start', setTimeout(function() {
                        if (easein == "" || !self.supportCss3) {
                            caption.fadeIn();
                        } else {
							if(caption.data("in-time") != undefined) {
								var intime = caption.data("in-time"),
									transitionProp = {
										'animation-duration': intime + 'ms',
										'-webkit-animation-duration': intime + 'ms',
										'-moz-animation-duration': intime + 'ms',
										'-ms-animation-duration': intime + 'ms'
									};
								caption.css(transitionProp);
							}
                            caption.show().addClass(easein);
                        }

                    }, caption.data("start")));
                } else {
                    caption.show().addClass(easein);
                }

                if(caption.data("stop") != undefined) {
                    caption.data('timer-stop', setTimeout(function() {
                        self.endMoveCaption(caption);
                    }, caption.data('stop')));
                }
            });
        },
        //When Animation finishes
        transitionEnd: function() {
            this.options.onEndTransition.call(this);
            $('.mdf-strips-container', this.slider).remove();
            this.slideItems[this.oIndex].hide();
            this.slideItems[this.activeIndex].show();
            this.lock = false;
            this.animateTheCaptions(this.slideItems[this.activeIndex]);
        },
        // Add strips
        addTwoStrips: function(bgColor) {
            var strip,
                images = [$(".mdf-mainimg img", this.slideItems[this.oIndex]), $(".mdf-mainimg img", this.slideItems[this.activeIndex])];
            var stripsContainer = $('<div class="mdf-strips-container"></div>').css("background-color", bgColor);
            for (var i = 0; i < 2; i++) {
                strip = $('<div class="mdslider-strip"></div>').css({
                    width: this.slideWidth,
                    height: this.slideHeight
                }).append(images[i].clone());
                stripsContainer.append(strip);
            }
            this.slider.append(stripsContainer);
        },
        // Add strips
        addSlits: function(fx) {
            var $stripsContainer = $('<div class="mdf-strips-container ' + fx + '"></div>'),
                $image = $(".mdf-mainimg img", this.slideItems[this.oIndex]),
                $div1 = $('<div class="mdf-slider-slit"/>').append($image.clone()),
                position = $image.position(),
                $div2 = $('<div class="mdf-slider-slit"/>').append($image.clone().css("top", position.top - (this.slideHeight/2) + "px"));
            if(fx == "slit-vertical-down" || fx == "slit-vertical-up")
                $div2 = $('<div class="mdf-slider-slit"/>').append($image.clone().css("left", position.left - (this.slideWidth/2) + "px"));

            $stripsContainer.append($div1).append($div2);
            this.slider.append($stripsContainer);
        },
        addTiles: function(x, y, index) {
            var tile;
            var stripsContainer = $('<div class="mdf-strips-container"></div>');
            var tileWidth = this.slideWidth / x,
                tileHeight = this.slideHeight / y,
                $image = $(".mdf-mainimg img", this.slideItems[index]);
            for(var i = 0; i < y; i++) {
                for(var j = 0; j < x; j++) {
                    var top = (tileHeight * i) + 'px',
                        left = (tileWidth * j) + 'px';
                    tile = $('<div class="mdslider-tile"/>').css({
                        width: tileWidth,
                        height: tileHeight,
                        top: top,
                        left: left
                    }).append($image.clone().css({
                            marginLeft: "-" + left,
                            marginTop: "-" + top
                        }));
                    stripsContainer.append(tile);
                }
            }
            this.slider.append(stripsContainer);
        },
        addTwoTiles: function(x, y) {
            var tileold, tilenew;
            var stripsContainer = $('<div class="mdf-strips-container"></div>');
            var tileWidth = this.slideWidth / x,
                tileHeight = this.slideHeight / y,
                $oimage = $(".mdf-mainimg img", this.slideItems[this.oIndex]),
                $nimage = $(".mdf-mainimg img", this.slideItems[this.activeIndex]);
            for(var i = 0; i < y; i++) {
                for(var j = 0; j < x; j++) {
                    var top = (tileHeight * i) + 'px',
                        left = (tileWidth * j) + 'px';
                    tileold = $('<div class="mdslider-tile-old"/>').css({
                        width: tileWidth,
                        height: tileHeight
                    }).append($oimage.clone().css({
                            marginLeft: "-" + left,
                            marginTop: "-" + top
                        }));
                    tilenew = $('<div class="mdslider-tile-new"/>').css({
                        width: tileWidth,
                        height: tileHeight
                    }).append($nimage.clone().css({
                            marginLeft: "-" + left,
                            marginTop: "-" + top
                        }));
                    stripsContainer.append($('<div class="mdslider-tile"/>').css({
                        width: tileWidth,
                        height: tileHeight,
                        top: top,
                        left: left
                    }).append(tileold, tilenew));
                }
            }
            this.slider.append(stripsContainer);
        },
        setWrapSize: function() {
            if(this.options.wrapHeight.indexOf('-') == 0) {
                this.wrap.height($(window).height() + parseInt(this.options.wrapHeight));
            } else if (this.options.wrapHeight.indexOf('%') >= 0) {
                this.wrap.height(parseInt(this.options.wrapHeight) * $(window).height() / 100);
            } else {
                this.wrap.height(this.options.wrapHeight);
            }
            if(this.options.wrapWidth.indexOf('-') == 0) {
                this.wrap.width($(window).width() + parseInt(this.options.wrapWidth));
            } else if (this.options.wrapWidth.indexOf('%') >= 0) {
                this.wrap.width(parseInt(this.options.wrapWidth) * $(window).width() / 100);
            } else {
                this.wrap.width(this.options.wrapWidth);
            }
        },
        resizeWindow: function() {
            this.setWrapSize();
            this.slideWidth = this.wrap.width();
            this.slideHeight = this.wrap.height();
            var width = this.options.width, height = this.options.height, top = "auto", left = "auto";
            if(height > 0 && this.slideHeight > 0) {
                if (((width / height) > (this.slideWidth / this.slideHeight))) {
                    height = height * this.slideWidth / width;
                    width = this.slideWidth;
                    top = (this.slideHeight - height) / 2;
                } else {
                    width = this.slideHeight * width / height;
                    height = this.slideHeight;
                    left = (this.slideWidth - width) / 2;
                }
            }
            $(".mdf-objects", this.slider).css({width: width, height: height, left: left, top: top});
            this.resizeBackgroundImage();
			this.resizeFontSize(width);
            this.resizePadding();
        },
        resizeBackgroundImage: function() {
            var self = this,
                hoverDivH = self.hoverDiv.height();
            $(".mdf-slide-item", this.slider).each(function() {
                var $background = $(".mdf-mainimg img", this);
                if($background.data("defW") && $background.data("defH")) {
                    var width = $background.data("defW"),
                        height = $background.data("defH");
                    self.changeImagePosition($background, width, height);

                }
            });

            if (self.options.posThumb == 4 || self.options.posThumb == 5) {
                var thumbH = self.options.thumbHeight;
                $(".mdf-thumb-container", self.hoverDiv).css("margin-top", (hoverDivH-thumbH)/2);
            }
            if (self.options.showBullet && self.options.showThumb && self.options.posThumb == 1) {
                $('div.mdf-bullet', this.buttons).hover(function () {
                    var img = $("img", this);
                    if(img.length) {
                        var hoverDiv = self.hoverDiv.offset(),
                            hover = $(this).offset(),
                            thumbW = self.options.thumbWidth,
                            left = hover.left - hoverDiv.left,
                            right = hoverDiv.left + self.hoverDiv.width() - hover.left - $(this).width();

                        if (left < thumbW/2-2)
                            img.css({left: -(left - 2) +"px"});
                        else if (right < thumbW/2-2)
                            img.css({position: "absolute", right: -(right-2) +"px", left: "auto"});
                    }
                });
            }
        },
        preloadCompete: function() {
            this.options.onInit.call(this);
            var self = this;
            $(".mdf-slide-item .mdf-mainimg img", this.slider).each(function() {
                var $image = $(this);
                if(!$image.data('defW')) {
					$image.load(function() {
						var dimensions = self.getImgSize($image.attr("src"));
						self.changeImagePosition($image, dimensions.width, dimensions.height);
						$image.data({
							'defW': dimensions.width,
							'defH': dimensions.height
						});
					});
                    if(this.complete) $image.load();
                }
            });
            this.slideReady();
        },
        changeImagePosition: function($background, width, height) {
            var panelWidth = $(".mdf-slide-item:visible", this.slider).width(),
                panelHeight = $(".mdf-slide-item:visible", this.slider).height();

            if(height > 0 && panelHeight > 0) {
                if (((width / height) > (panelWidth / panelHeight))) {
                    var left = panelWidth - (panelHeight / height) * width;
                    $background.css({width: "auto", height: panelHeight + "px"});
                    if(left > 0) {
                        $background.css({left: (left/2) + "px", top: 0 });
                    } else {
                        $background.css({left: 0, top: 0 });
                    }
                } else {
                    var top = panelHeight - (panelWidth / width) * height;
                    $background.css({width: panelWidth + "px", height: "auto"});
                    if(top < 0) {
                        $background.css({top: (top/2) + "px", left: 0 });
                    } else {
                        $background.css({left: 0, top: 0 });
                    }
                }
            }
        },
		resizeFontSize: function(width) {
   			var fontDiff = (this.supportCss3) ? 1 : 6,
                ratio = 100*width / this.options.width - fontDiff;

            $(".mdf-objects", this.slider).css({'font-size': ratio + '%'});
			$(".mdf-objects", this.slider).css({'line-height': ratio + '%'});
        },
        resizePadding: function() {
            var self = this;
            if (this.wrap.width() < this.options.width) {
                $(".mdf-objects > div", this.slider).each(function() {
                    var objectRatio = self.wrap.width() / self.options.width,
                        $_object = $(this),
                        objectPadding = {};
                    if ($_object.data('padding-top')) objectPadding['padding-top'] = $_object.data('padding-top') * objectRatio;
                    if ($_object.data('padding-right')) objectPadding['padding-right'] = $_object.data('padding-right') * objectRatio;
                    if ($_object.data('padding-bottom')) objectPadding['padding-bottom'] = $_object.data('padding-bottom') * objectRatio;
                    if ($_object.data('padding-left')) objectPadding['padding-left'] = $_object.data('padding-left') * objectRatio;
                    if ($_object.find('a').length) {
                        $_object.find('a').css(objectPadding);
                    } else {
                        $_object.css(objectPadding);
                    }
                })
            } else {
                $(".mdf-objects > div", this.slider).each(function() {
                    var $_object = $(this),
                        objectPadding = {};
                    if ($_object.data('padding-top')) objectPadding['padding-top'] = $_object.data('padding-top');
                    if ($_object.data('padding-right')) objectPadding['padding-right'] = $_object.data('padding-right');
                    if ($_object.data('padding-bottom')) objectPadding['padding-bottom'] = $_object.data('padding-bottom');
                    if ($_object.data('padding-left')) objectPadding['padding-left'] = $_object.data('padding-left');
                    if ($_object.find('a').length) {
                        $_object.find('a').css(objectPadding);
                    } else {
                        $_object.css(objectPadding);
                    }
                })
            }
        },
        getImgSize: function(imgSrc) {
            var newImg = new Image();
            newImg.src = imgSrc;
            return {height: newImg.height, width: newImg.width};
        },
		focusWindow: function() {
			var self = this, blurtime;
			$(window).blur(function(){
				blurtime = (new Date()).getTime();
			});
			$(window).focus(function(){
				if(blurtime) {
					var duration = (new Date()).getTime() - blurtime;
					if(duration > self.slideShowDelay - self.step) {
						self.step = self.slideShowDelay - 400;
					} else {
						self.step += duration;
					}
					blurtime = false;
				}
			});
		}
    };

    $.fn.mdFullScreenSlider = function(options) {
        return new MdFullScreenSlider($(this), options);
    };

    $.fn.mdFullScreenSlider.fxTransitions = {
        "fade": function(self, transitionSpeed) {
            self.addTiles(1, 1, self.activeIndex);
            var strip = $('.mdslider-tile', self.slider);
            strip.css({opacity: 0});
            strip.animate({
                opacity: 1
            }, transitionSpeed, function () {
                self.transitionEnd();
            });
        },
        'slit': function(self, condition, transitionSpeed) {
            var className = "";
            switch (condition) {
                case 'horizontalLeftTop':
                    className = 'slit-horizontal-left-top';
                    break;
                case 'horizontalTopRight':
                    className = 'slit-horizontal-top-right';
                    break;
                case 'horizontalBottomUp':
                    className = 'slit-horizontal-bottom-up';
                    break;
                case 'verticalDown':
                    className = 'slit-vertical-down';
                    break;
                case 'verticalUp':
                    className = 'slit-vertical-up';
                    break;
            }
            self.addSlits(className);
            $(".mdf-object", self.slideItems[self.activeIndex]).hide();
            self.slideItems[self.oIndex].hide();
            self.slideItems[self.activeIndex].show();
            var slice1 = $('.mdf-slider-slit', self.slider).first(),
                slice2 = $('.mdf-slider-slit', self.slider).last();
            var transitionProp = {
                'transition' : 'all ' + transitionSpeed + 'ms ease-in-out',
                '-webkit-transition' : 'all ' + transitionSpeed + 'ms ease-in-out',
                '-moz-transition' : 'all ' + transitionSpeed + 'ms ease-in-out',
                '-ms-transition' : 'all ' + transitionSpeed + 'ms ease-in-out'
            };
            $('.mdf-slider-slit', self.slider).css(transitionProp);
            setTimeout( function() {
                slice1.addClass("mdf-trans-elems-1");
                slice2.addClass("mdf-trans-elems-2");
            }, 50 );
            setTimeout(function() {
                self.options.onEndTransition.call(self);
                $('.mdf-strips-container', self.slider).remove();
                self.lock = false;
                self.animateTheCaptions(self.slideItems[self.activeIndex]);
            }, transitionSpeed);
        },
        'stripUp': function(self, condition, transitionSpeed) {
            self.addTiles(self.options.stripCols, 1, self.activeIndex);
            var strips = (condition == 'left') ? $('.mdslider-tile', self.slider) : $('.mdslider-tile', self.slider).reverse(),
                timeStep = transitionSpeed / self.options.stripCols / 2,
                speed = transitionSpeed / 2;
            strips.css({
                height: '1px',
                bottom: '0px',
                top: "auto"
            });
            strips.each(function (i) {
                var strip = $(this);
                setTimeout(function () {
                    strip.animate({
                        height: '100%',
                        opacity: '1.0'
                    }, speed, 'easeInOutQuart', function () {
                        if (i == self.options.stripCols - 1) self.transitionEnd();
                    });
                }, (i + 1) * timeStep);
            });
        },
        'stripDown': function(self, condition, transitionSpeed) {
            self.addTiles(self.options.stripCols, 1, self.activeIndex);
            var strips = (condition == 'left') ? $('.mdslider-tile', self.slider) : $('.mdslider-tile', self.slider).reverse(),
                timeStep = transitionSpeed / self.options.stripCols / 2,
                speed = transitionSpeed / 2;
            strips.css({
                height: '1px',
                top: '0px',
                bottom: "auto"
            });
            strips.each(function (i) {
                var strip = $(this);
                setTimeout(function () {
                    strip.animate({
                        height: '100%',
                        opacity: '1.0'
                    }, speed, 'easeInOutQuart', function () {
                        if (i == self.options.stripCols - 1) self.transitionEnd();
                    });
                }, (i + 1) * timeStep);
            });
        },
        'stripLeft': function(self, condition, transitionSpeed) {
            self.addTiles(1, self.options.stripRows, self.activeIndex);
            var strips = (condition == 'up') ? $('.mdslider-tile', self.slider) : $('.mdslider-tile', self.slider).reverse(),
                timeStep = transitionSpeed / self.options.stripRows / 2,
                speed = transitionSpeed / 2;
            strips.css({
                width: '1px',
                left: '0px',
                right: "auto"
            });
            strips.each(function (i) {
                var strip = $(this);
                setTimeout(function () {
                    strip.animate({
                        width: '100%',
                        opacity: '1.0'
                    }, speed, 'easeInOutQuart', function () {
                        if (i == self.options.stripRows - 1) self.transitionEnd();
                    });
                }, (i + 1) * timeStep);
            });
        },
        'stripRight':  function(self, condition, transitionSpeed) {
            self.addTiles(1, self.options.stripRows, self.activeIndex);
            var strips = (condition == 'up') ? $('.mdslider-tile', self.slider) : $('.mdslider-tile', self.slider).reverse(),
                timeStep = transitionSpeed / self.options.stripRows / 2,
                speed = transitionSpeed / 2;
            strips.css({
                width: '1px',
                left: 'auto',
                right: "1px"
            });
            strips.each(function (i) {
                var strip = $(this);
                setTimeout(function () {
                    strip.animate({
                        width: '100%',
                        opacity: '1.0'
                    }, speed, 'easeInOutQuart', function () {
                        if (i == self.options.stripRows - 1) self.transitionEnd();
                    });
                }, (i + 1) * timeStep);
            });
        },
        'stripRightLeft': function(self, condition, transitionSpeed) {
            self.addTiles(1, self.options.stripRows, self.oIndex);
            self.slideItems[self.oIndex].hide();
            self.slideItems[self.activeIndex].show();
            var strips = (condition == 'down') ? $('.mdslider-tile', self.slider) : $('.mdslider-tile', self.slider).reverse(),
                timeStep = transitionSpeed / self.options.stripRows / 2,
                speed = transitionSpeed / 2;
            strips.filter(":odd").css({
                width: '100%',
                right: '0px',
                left: "auto",
                opacity: 1
            }).end().filter(':even').css({
                width: '100%',
                right: 'auto',
                left: "0px",
                opacity: 1
            });
            strips.each(function (i) {
                var strip = $(this);
                var css = (i%2 == 0) ? {left: '-50%',opacity: '0'} : {right: '-50%', opacity: '0'};
                setTimeout(function () {
                    strip.animate(css, speed, 'easeOutQuint', function () {
                        if (i == self.options.stripRows - 1) {
                            self.options.onEndTransition.call(self);
                            $('.mdf-strips-container', self.slider).remove();
                            self.lock = false;
                            self.animateTheCaptions(self.slideItems[self.activeIndex]);
                        }
                    });
                }, (i + 1) * timeStep);
            });
        },
        'stripUpDown': function(self, condition, transitionSpeed) {
            self.addTiles(self.options.stripCols, 1, self.oIndex);
            self.slideItems[self.oIndex].hide();
            self.slideItems[self.activeIndex].show();
            var strips = (condition == 'right') ? $('.mdslider-tile', self.slider) : $('.mdslider-tile', self.slider).reverse(),
                timeStep = transitionSpeed / self.options.stripCols / 2,
                speed = transitionSpeed / 2;
            strips.filter(':odd').css({
                height: '100%',
                bottom: '0px',
                top: "auto",
                opacity: 1
            }).end().filter(':even').css({
                    height: '100%',
                    bottom: 'auto',
                    top: "0px",
                    opacity: 1
                });
            strips.each(function (i) {
                var strip = $(this);
                var css = (i%2 == 0) ? {top: '-50%',opacity: 0} : {bottom: '-50%', opacity: 0};
                setTimeout(function () {
                    strip.animate(css, speed, 'easeOutQuint', function () {
                        if (i == self.options.stripCols - 1) {
                            self.options.onEndTransition.call(self);
                            $('.mdf-strips-container', self.slider).remove();
                            self.lock = false;
                            self.animateTheCaptions(self.slideItems[self.activeIndex]);
                        }
                    });
                }, (i + 1) * timeStep);
            });
        },
        'curtainX': function(self, condition, transitionSpeed) {
            self.addTiles(self.options.stripCols, 1, self.activeIndex);
            var strips = (condition == 'left') ? $('.mdslider-tile', self.slider) : $('.mdslider-tile', self.slider).reverse(),
                width = self.slideWidth / self.options.stripCols,
                timeStep = transitionSpeed / self.options.stripCols / 2,
				speed = transitionSpeed / 2;
            strips.each(function (i) {
                var strip = $(this);
                strip.css({right: width * i, left: "auto", width: 0, opacity: 0});
                setTimeout(function () {
                    strip.animate({
                        width: width,
                        opacity: '1.0'
                    }, speed, function () {
                        if (i == self.options.stripCols - 1) self.transitionEnd();
                    });
                }, timeStep * (i + 1));
            });
        },
        'curtainY': function(self, condition, transitionSpeed) {
            self.addTiles(1, self.options.stripRows, self.activeIndex);
            var strips = (condition == 'top') ? $('.mdslider-tile', self.slider) : $('.mdslider-tile', self.slider).reverse(),
                height = self.slideHeight / self.options.stripRows,
                timeStep = transitionSpeed / self.options.stripRows / 2;
            strips.each(function (i) {
                var strip = $(this);
                strip.css({height: 0, opacity: 0});
                setTimeout(function () {
                    strip.animate({
                        height: height,
                        opacity: '1.0'
                    }, transitionSpeed / 2, function () {
                        if (i == self.options.stripRows - 1) self.transitionEnd();
                    });
                }, timeStep * (i + 1));
            });
        },
        'slideInRight': function(self, transitionSpeed) {
            var i = 0;
            self.addTwoStrips();
            var strips = $('.mdslider-strip', self.slider);
            strips.each(function() {
                var strip = $(this);
                var left = i * self.slideWidth;
                strip.css({left: left});
                strip.animate({
                    left: left - self.slideWidth
                }, transitionSpeed, function () {
                    self.transitionEnd();
                });
                i++;
            });
        },
        'slideInLeft': function(self, transitionSpeed) {
            var i = 0;
            self.addTwoStrips();
            var strips = $('.mdslider-strip', self.slider);
            strips.each(function() {
                var strip = $(this);
                var left = -i * self.slideWidth;
                strip.css({
                    left: left
                });
                strip.animate({
                    left: self.slideWidth + left
                }, transitionSpeed, function () {
                    self.transitionEnd();
                });
                i++;
            });
        },
        'slideInUp': function(self, transitionSpeed) {
            var i = 0;
            self.addTwoStrips();
            var strips = $('.mdslider-strip', self.slider);
            strips.each(function() {
                var strip = $(this);
                var top = i * self.slideHeight;
                strip.css({
                    top: top
                });
                strip.animate({
                    top: top - self.slideHeight
                }, transitionSpeed, function () {
                    self.transitionEnd();
                });
                i++;
            });
        },
        'slideInDown': function(self, transitionSpeed) {
            var i = 0;
            self.addTwoStrips();
            var strips = $('.mdslider-strip', self.slider);
            strips.each(function() {
                var strip = $(this);
                var top = -i * self.slideHeight;
                strip.css({
                    top: top
                });
                strip.animate({
                    top: self.slideHeight + top
                }, transitionSpeed, function () {
                    self.transitionEnd();
                });
                i++;
            });
        }
    };
    $.fn.mdFullScreenSlider.transitions = [
        'fade',
        'slit-horizontalLeftTop',
        'slit-horizontalTopRight',
        'slit-horizontalBottomUp',
        'slit-verticalDown',
        'slit-verticalUp',
        'stripUp-left',
        'stripUp-right',
        'stripDown-left',
        'stripDown-right',
        'stripLeft-up',
        'stripLeft-down',
        'stripRight-up',
        'stripRight-down',
        'stripRightLeft-up',
        'stripRightLeft-down',
        'stripUpDown-left',
        'stripUpDown-right',
        'curtainX-left',
        'curtainX-right',
        'curtainY-up',
        'curtainY-down',
        'slideInRight',
        'slideInLeft',
        'slideInUp',
        'slideInDown'
    ];
    $.fn.mdFullScreenSlider.css3Transitions = [
        'slit-horizontalLeftTop',
        'slit-horizontalTopRight',
        'slit-horizontalBottomUp',
        'slit-verticalDown',
        'slit-verticalUp'
    ];
    $.fn.reverse = [].reverse;
})(jQuery);
