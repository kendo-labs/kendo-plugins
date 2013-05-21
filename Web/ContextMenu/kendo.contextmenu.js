/// <version>2013.04.14</version>
/// <summary>Works with the Kendo UI 2013 Q1 and jQuery 1.9.1</summary>

(function (kendo, $) {
    var ExtContextMenu = kendo.ui.Menu.extend({
        _itemTemplate: kendo.template("<li># if (iconCss.length > 0) { #<span class=' #=iconCss # k-icon'></span># } # #= text #</li>"),
        _itemTemplateInnerContent: kendo.template("# if (iconCss.length > 0) { #<span class=' #=iconCss # k-icon'></span># } # #= text #"), 

        hiding: false,
        shown: false,
        cancelHide: false,

        options:  {
                orientation: "vertical",
                name: "ExtContextMenu",
                width: "100px",
                enableScreenDetection: true,
                delay: 1000,
                event: 'contextmenu',
                offsetY: 0,
                offsetX: 0,
            },

        init: function (element, options) {
            var that = this;

            $(element).appendTo("body").hide();
            
            // If the list of items has been passed in...
            if (options.dataSource) {
                $.each(options.dataSource, function (idx, item) {

                    if (item.separator) {
                        item.cssClass = "k-ext-menu-separator";
                        item.text = "";
                        item.content = "";
                    }

                    //var html = "";
                    //if (item.separator) {
                    //    html = "<li class='k-ext-menu-separator'><li>";
                    //} else {
                    //    item = $.extend({ iconCss: "" }, item);
                    //    html = that._itemTemplate(item);
                    //}
                    //$(element).append(html);
                });
            }

            // Call the base class init.
            kendo.ui.Menu.fn.init.call(that, element, options);

            // If there are any separators, then remove the k-link class.
            $(that.element).find("li.k-ext-menu-separator span").removeClass("k-link");

            if(options.targets){

                // When the user right-clicks on any of the targets, then display the context menu.
                $(document).on("contextmenu", options.targets, function (e) {
                    e.preventDefault();
                    that.trigger("beforeopen", e);
                    that._currentTarget = e.currentTarget;
                    that.show(e.pageX, e.pageY);
                    return false;
                });
            }

            $(that.element).on('mouseleave', function () {

                that.cancelHide = false;
                delay = options.delay || that.options.delay;
                setTimeout(function () { that.hide() }, delay);
            });
            $(that.element).on('mouseenter', function () {

                that.cancelHide = true;
            });

            if (that.options.beforeOpen) {
                that.bind("beforeopen", that.options.beforeOpen);
            }

            that.bind("select", that._select);

            $(that.element).css({ "width": that.options.width, "position": "absolute" }).addClass("k-block").addClass("k-ext-contextmenu");

            // If the user is not clicking on the context menu, then hide the menu.
             $(document).on("click", function (e) {
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

            if (!this.hiding) {

                //determine if off screen
                var eleHeight = $(that.element).height();
                var eleWidth = $(that.element).width();
                var xPos = left + that.options.offsetX;
                var yPos = top + that.options.offsetY;

                if (that.options.enableScreenDetection) {
                    if (
                        (eleWidth + xPos) > window.innerWidth ||
                        (eleHeight + yPos) > window.innerHeight
                        ) {
                        //off screen detected, need to ignore off set settings and mouse position and position to fix the menu
                        if ((eleWidth + xPos) > window.innerWidth) {
                            xPos = window.innerWidth - eleWidth - 3;
                        }
                        if ((eleHeight + yPos) > window.innerHeight) {
                            yPos = window.innerHeight - eleHeight - 3;
                        }
                    }

                }

                // Position the context menu.
                $(that.element).css({
                    "top": yPos,
                    "left": xPos
                });
                // Display the context menu.
                $(that.element).slideToggle('fast', function () {
                    that.shown = true;
                    $(that.element).addClass("k-custom-visible");
                });
            }
            
        },

        hide: function () {
            var that = this;

            if (that.shown && !that.cancelHide) {
                that.hiding = true;

                $(that.element).slideToggle('fast', function () {
                    that.hiding = false;
                    that.shown = false;
                    $(that.element).removeClass("k-custom-visible");
                });
            }
            
        },

        _select: function (e) {
            if (this.options.itemSelect != undefined) {
                e.target = this._currentTarget;
                this.options.itemSelect.apply(this, [e]);
            }
            this.hide();
        },
    });
    kendo.ui.plugin(ExtContextMenu);
})(window.kendo, window.kendo.jQuery);
