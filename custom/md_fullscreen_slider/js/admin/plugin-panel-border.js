/**
 * Created with magedrupal.com.
 * User: baonv
 * Date: 5/6/13
 * Time: 10:12 AM
 */
(function($) {
    $.fn.mdPanelBorder = function(options) {
        var defaults = {
            changeAllBorder	: function(borderString) {  },
            changeLeftBorder : function(borderString) {  },
            changeTopBorder	: function(borderString) {  },
            changeRightBorder : function(borderString) {  },
            changeBottomBorder : function(borderString) {  }
        };
        options = $.extend({}, defaults, options);
        var $panel = $(this);

        $("input.border-color", $panel).spectrum({
            clickoutFiresChange: true,
            preferredFormat: "hex6",
            move: function(color) {
                $(this).val(color.toHexString()).trigger("change");
            }
        });
        $(".border-position a.bp-border", $panel).click(function() {
            if(!$(this).hasClass("selected")) {
                $(".border-position a.selected", $panel).removeClass("selected");
                $(this).addClass("selected");
                updateBorderInput($(this).attr("attr-border"));
            }
            return false;
        });
        $("input[name=border-width], select[name=border-style], input[name=border-color]", $panel).change(function() {
            var borderWidth =  parseInt($("input[name=border-width]", $panel).val()),
                borderStyle = $("select[name=border-style]", $panel).val(),
                borderColor = $("input[name=border-color]", $panel).val(),
                borderString = "none",
                borderActive = (borderWidth > 0 && borderStyle != ""),
                $active = $(".border-position a.selected", $panel);
            if(borderActive && borderColor != "")
                borderString = borderWidth + "px " + borderStyle + " " + borderColor;
            if($active.size() > 0) {
                if($active.hasClass("bp-all")) {
                    $(".border-position a.bp-border", $panel).attr("attr-border", borderString).toggleClass("active", borderActive);
                    options.changeAllBorder.call(this, borderString);
                } else {
                    $active.attr("attr-border", borderString).toggleClass("active", borderActive);
                    if($active.hasClass("bp-left"))
                        options.changeLeftBorder.call(this, borderString);
                    else if($active.hasClass("bp-top"))
                        options.changeTopBorder.call(this, borderString);
                    else if($active.hasClass("bp-right"))
                        options.changeRightBorder.call(this, borderString);
                    else
                        options.changeBottomBorder.call(this, borderString);
                }
            }
        });


        function updateBorderInput(border) {
            var borderArray = border.split(" ");
            if(borderArray.length == 3) {
                $("input[name=border-width]", $panel).val(borderArray[0].slice(0, -2));
                $("select[name=border-style]", $panel).val(borderArray[1]);
                $("input[name=border-color]", $panel).spectrum("set", borderArray[2]);
            } else {
                $("input[name=border-width]", $panel).val("");
                $("select[name=border-style]", $panel).val("");
                $("input[name=border-color]", $panel).spectrum("set","");
            }
        }

    }
})(jQuery);
