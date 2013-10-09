(function ($, kendo) {
    var Button = kendo.ui.Widget.extend({
        init: function (element, options) {
            /// <summary>
            /// Initialize the widget.
            /// </summary>

            var that = this;

            kendo.ui.Widget.fn.init.call(that, element, options);

            that.element.addClass("k-button");

            if (typeof that.options.click !== "undefined") {
                that.element.on("click", that.options.click);
            }
        },

        options: {
            name: "Button"
        }
    });

    kendo.ui.plugin(Button);
})(window.kendo.jQuery, window.kendo);