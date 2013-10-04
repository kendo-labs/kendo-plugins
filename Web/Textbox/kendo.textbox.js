/// <version>2013.10.04</version>
/// <summary>Works with the Kendo UI 2013 Q1 and jQuery 1.9.1</summary>

(function ($, kendo) {
    var ExtTextBox = kendo.ui.Widget.extend({
        init: function (element, options) {
            var that = this;
            var $input = $(element);

            kendo.ui.Widget.fn.init.call(that, element, options);

            $input.before(kendo.format('<div class="k-input k-textbox k-ext-textbox {0}" {1}></div>',
                that.options.textboxClass,
                that.options.width
                    ? kendo.format("style='width:{0};'", that.options.width)
                    : ""));
            var $div = $input.prev();
            $div.append($input);

            if (that.options.wrapper && that.options.wrapper.cssClass) {
                $div.addClass(that.options.wrapper.cssClass);
            }

            if (that.options.text) {
                $input.val(that.options.text);
            }

            if (that.options.placeholder) {
                $input.before(kendo.format("<span {0}>{1}</span>",
                    that.options.placeholder.cssClass
                        ? kendo.format("class='{0}'", that.options.placeholder.cssClass)
                        : "",
                    $input.val().length === 0
                        ? that.options.placeholder.text
                        : ""));

                $input.on("blur", function () {
                    if (that.options.placeholder.text) {
                        var $input = $(this);

                        if ($input.val().length === 0) {
                            $input.prev("span").text(that.options.placeholder.text);
                        } else {
                            $input.prev("span").text("");
                        }
                    }
                }).on("focus", function () {
                    if (that.options.placeholder.text) {
                        $(this).prev("span").text("");
                    }
                });
            }
        },

        options: {
            name: "ExtTextBox"
        }
    });
    kendo.ui.plugin(ExtTextBox);
})(jQuery, window.kendo);
