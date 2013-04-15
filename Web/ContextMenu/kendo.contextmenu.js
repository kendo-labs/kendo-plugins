/// <version>2013.04.14</version>
/// <summary>Works with the Kendo UI 2013 Q1 and jQuery 1.9.1</summary>

(function (kendo, $) {
    var ExtContextMenu = kendo.ui.Menu.extend({
        _itemTemplate: kendo.template("<li># if (iconCss.length > 0) { #<span class=' #=iconCss # k-icon'></span># } # #= text #</li>"),

        init: function (element, options) {
            var that = this;

            $(element).appendTo("body").hide();

            options = $.extend(options,
                {
                    orientation: "vertical"
                });

            // If the list of items has been passed in...
            if (options.items) {
                $.each(options.items, function (idx, item) {
                    var html = "";
                    if (item.separator) {
                        html = "<li class='k-ext-menu-separator'><hr/><li>";
                    } else {
                        item = $.extend({ iconCss: "" }, item);
                        html = that._itemTemplate(item);
                    }
                    $(element).append(html);
                });
            }

            // Call the base class init.
            kendo.ui.Menu.fn.init.call(that, element, options);

            // If there are any separators, then remove the k-link class.
            $(that.element).find("li.k-ext-menu-separator span").removeClass("k-link");

            // When the user right-clicks on any of the targets, then display the context menu.
            $(document).on("contextmenu", options.targets, function (e) {
                e.preventDefault();
                that.trigger("beforeopen", e);
                that._currentTarget = e.currentTarget;
                that.show(e.pageX, e.pageY);
                return false;
            });

            if (that.options.beforeOpen) {
                that.bind("beforeopen", that.options.beforeOpen);
            }

            that.bind("select", that._select);

            $(that.element).css({ "width": that.options.width, "position": "absolute" }).addClass("k-block").addClass("k-ext-contextmenu");

            // If the user is not clicking on the context menu, then hide the menu.
            $(document).click(function (e) {
                // Ignore clicks on the contextmenu.
                if ($(e.target).closest(".k-ext-contextmenu").length == 0) {
                    // If visible, then close the contextmenu.
                    if ($(that.element).hasClass("k-custom-visible")) {
                        that.hide();
                    }
                }
            });
        },

        show: function (left, top) {
            var that = this;

            // Position the context menu.
            $(that.element).css({
                "top": top,
                "left": left
            });
            // Display the context menu.
            $(that.element).slideToggle('fast', function () {
                $(that.element).addClass("k-custom-visible");
            });
        },

        hide: function () {
            var that = this;

            $(that.element).slideToggle('fast', function () {
                $(that.element).removeClass("k-custom-visible");
            });
        },

        _select: function (e) {
            if (this.options.itemSelect != undefined) {
                e.target = this._currentTarget;
                this.options.itemSelect.apply(this, [e]);
            }
            this.hide();
        },

        options: {
            name: "ExtContextMenu",
            width: "100px"
        }
    });
    kendo.ui.plugin(ExtContextMenu);
})(window.kendo, window.kendo.jQuery);
