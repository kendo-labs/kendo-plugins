/// <version>2013.05.24</version>
/// <summary>Works with the Kendo UI 2013 Q1 and jQuery 1.9.1</summary>

(function ($, kendo) {
    var ExtContextMenu = kendo.ui.Menu.extend({
        /// <summary>
        /// Context menu widget.
        /// <summary>
        /// <remarks>
        /// items will be deprecated in version: Kendo UI 2014 Q1.  Use dataSource instead.
        /// </remarks>

        // Remove in version Kendo UI 2014 Q1.
        _itemTemplate: kendo.template("<li># if (iconCss.length > 0) { #<span class=' #=iconCss # k-icon'></span># } # #= text #</li>"),

        hiding: false,
        shown: false,
        cancelHide: false,

        options: {
            orientation: "vertical",
            name: "ExtContextMenu",
            width: "100px",
            enableScreenDetection: true,
            delay: 1000,
            event: 'contextmenu',
            offsetY: 0,
            offsetX: 0,
            closeOnClick: true,
            animation: {
                close: {
                    effects: "slide"
                },
                open: {
                    effects: "slide"
                }
            }
        },

        init: function (element, options) {
            var that = this;

            $(element).appendTo("body").hide();

            // If the list of items has been passed in...
            if (options.dataSource) {
                // Handle any separators defined in the datasource.
                $.each(options.dataSource, function (idx, item) {
                    if (item.separator) {
                        item.cssClass = "k-ext-menu-separator";
                        item.text = "";
                        item.content = "";
                    }
                });
            } else if (options.items) {
                // Process the list of items passed in.
                $.each(options.items, function (idx, item) {
                    var html = "";
                    if (item.separator) {
                        item.cssClass = "k-ext-menu-separator";
                        item.text = "";
                        item.content = "";
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

            if (options.targets) {

                // When the user right-clicks on any of the targets, then display the context menu.
                $(document).on(that.options.event, options.targets, function (e) {
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
                    that.hide();
                }
            });
        },

        show: function (left, top) {
            /// <summary>
            /// Show the context menu.
            /// <summary>
            /// <param name="left" type="int">x coordinate to show the context menu</param>
            /// <param name="top" type="int">y coordinate to show the context menu</param>

            var that = this;

            if (!this.hiding) {

                //determine if off screen
                var xPos = left + that.options.offsetX;
                var yPos = top + that.options.offsetY;

                if (that.options.enableScreenDetection) {
                    var eleHeight = $(that.element).height();
                    var eleWidth = $(that.element).width();

                    if (
                        (eleWidth + xPos) > window.innerWidth ||
                        (eleHeight + yPos) > window.innerHeight
                        ) {
                        //off screen detected, need to ignore off set settings and mouse position and position to fix the menu
                        if ((eleWidth + xPos) > window.innerWidth) {
                            xPos = window.innerWidth - eleWidth - 5;
                        }
                        if ((eleHeight + yPos) > window.innerHeight) {
                            yPos = window.innerHeight - eleHeight - 5;
                        }
                    }
                }

                // Position the context menu.
                $(that.element).css({
                    "top": yPos,
                    "left": xPos
                });

                // Display the context menu.
                if (that.options.animation.open.effects == "fade") {
                    $(that.element).fadeIn(function () {
                        that.shown = true;
                        $(that.element).addClass("k-custom-visible");
                    });
                } else if (that.options.animation.open.effects == "slide") {
                    $(that.element).slideToggle('fast', function () {
                        that.shown = true;
                        $(that.element).addClass("k-custom-visible");
                    });
                }
            }

        },

        hide: function () {
            /// <summary>
            /// Hide the context menu.
            /// <summary>

            var that = this;

            if (that.shown && !that.cancelHide) {
                that.hiding = true;

                that._forceHide();
            }
        },

        _forceHide: function () {
            var that = this;

            that.hiding = true;

            // Hide the context menu.
            if (that.options.animation.close.effects == "fade") {
                $(that.element).fadeOut(function () {
                    that.hiding = false;
                    that.shown = false;
                    $(that.element).removeClass("k-custom-visible");
                });
            } else if (that.options.animation.close.effects == "slide") {
                $(that.element).slideToggle('fast', function () {
                    that.hiding = false;
                    that.shown = false;
                    $(that.element).removeClass("k-custom-visible");
                });
            }
        },

        _getSelectedDataItem: function (e) {
            /// <summary>
            /// Get the selected data item.
            /// <summary>
            /// <remarks>
            /// The following websites were referenced:
            /// - http://www.kendoui.com/forums/ui/menu/accessing-the-original-menu-item-object-during-select-event.aspx
            /// - http://jsfiddle.net/bundyo/MMRCf/4/light/
            /// </remarks>

            var that = this;

            var item = $(e.item),
                menuElement = item.closest(".k-menu"),
                dataItem = that.options.dataSource,
                index = item.parentsUntil(menuElement, ".k-item").map(function () {
                    return $(this).index();
                }).get().reverse();

            index.push(item.index());

            for (var i = -1, len = index.length; ++i < len;) {
                dataItem = dataItem[index[i]];
                dataItem = i < len - 1 ? dataItem.items : dataItem;
            }

            return dataItem;
        },

        _select: function (e) {
            /// <summary>
            /// A context menu item has been selected.
            /// <summary>

            var that = this;

            if (this.options.itemSelect != undefined) {

                e.target = that._currentTarget;
                e.dataItem = that.options.dataSource ? that._getSelectedDataItem(e) : undefined;

                that.options.itemSelect.apply(that, [e]);
            }
			
            if (that.options.closeOnClick == true)
            {
                that._forceHide();
            }
            this.hide();
        },
    });
    kendo.ui.plugin(ExtContextMenu);
})(jQuery, window.kendo);
