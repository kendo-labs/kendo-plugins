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



(function ($, kendo) {
    var ActionLink = kendo.ui.Widget.extend({
        init: function (element, options) {
            /// <summary>
            /// Initialize the widget.
            /// </summary>

            var that = this;

            kendo.ui.Widget.fn.init.call(that, element, options);

            that.element.addClass(options.style === "button" ? "k-button" : "k-link");

            if (options.controller && options.action) {
                that.element.attr("href", kendo.format("/{0}/{1}", options.controller, options.action));
            }
        },

        options: {
            name: "ActionLink"
        }
    });

    kendo.ui.plugin(ActionLink);
})(window.kendo.jQuery, window.kendo);