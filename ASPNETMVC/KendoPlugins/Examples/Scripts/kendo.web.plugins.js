/// <version>2013.07.25</version>
/// <summary>All the Kendo UI Web Plugins for Kendo UI 2013 Q1 and jQuery 1.9.1</summary>

/*
* Framework Extention Functions
*/

(function ($, kendo) {
    kendo.arrays = {
        /// <summary>
        /// Extend the kendo namespace with additional functions.
        /// </summary>
        /// <author>John DeVight</author>

        find: function (array, criteria) {
            /// <summary>Find a JSON Object in an array.</summary>
            /// <param name="array" type="Array">Array of JSON objects.</param>
            /// <param name="criteria" type="Object">
            ///   Criteria to find the JSON Object.
            ///   - attr: the name of the JSON attribute to search on.
            ///   - value: the value of to find.
            /// </param>
            /// <returns type="JSON Object or null if not found" />
            /// <author>John DeVight</author>

            var result = null;
            $.each(array, function (idx, item) {
                if (item[criteria.attr] != undefined) {
                    if (item[criteria.attr].toString() == criteria.value) {
                        result = item;
                        return false;
                    }
                }
            });
            return result;
        },

        findAll: function (array, criteria) {
            /// <summary>Find a JSON Object in an array.</summary>
            /// <param name="array" type="Array">Array of JSON objects.</param>
            /// <param name="criteria" type="Object">
            ///   Criteria to find the JSON Objects.
            ///   - attr: the name of the JSON attribute to search on.
            ///   - value: the value of to find.
            /// </param>
            /// <returns type="JSON Objects or null if not found" />
            /// <author>John DeVight</author>

            var results = [];
            $.each(array, function (idx, item) {
                if (item[criteria.attr] != undefined) {
                    if (item[criteria.attr].toString() == criteria.value) {
                        results.push(item);
                    }
                }
            });
            return results.length == 0 ? null : results;
        }
    };
})(window.kendo.jQuery, window.kendo);



/*
* ExtBorderLayout
*/

(function ($, kendo) {
    var ExtLayoutTitleBar = function (splitter, pane, options) {
        /// <summary>
        /// Create a "titlebar" to be used specifically with a pane within the ExtLayoutSplitter.
        /// </summary>
        /// <author>John DeVight</author>

        this._splitter = splitter;
        this._pane = pane;
        this._options = options;
        this._options.title = this._options.title || "";
        this._options.expandedSize = options.size;
        this._template = kendo.template('<div class="k-window-titlebar k-header k-ext-layout-header"><span class="k-window-title k-ext-layout-title">#= title #</span> #if (arrowsCss.length > 0) { # <div class="k-window-actions"><a href="\\#" class="k-window-action k-link k-ext-toggle k-ext-expanded"><span class="k-icon #= arrowsCss #">Collapse</span></a></div></div> # } #');
        this._callback = null;
        this.element = null;

        this._vertTitle = "";
        this.vertTitleName();
    };

    ExtLayoutTitleBar.prototype = {
        init: function () {
            /// <summary>
            /// Initialize and display a title for a splitter pane.
            /// </summary>

            var that = this;
            var $pane = $(that._pane);

            // Based on the region, determine the initial image to display for
            // the toggle button.
            that._options.arrowsCss = that._options.collapsible
                ? that._options.region == "north"
                    ? "k-ext-arrows-up"
                    : that._options.region == "south"
                        ? "k-ext-arrows-down"
                        : that._options.region == "east"
                            ? "k-ext-arrows-right"
                            : "k-ext-arrows-left"
                : "";
            if (that._options.collapsed) {
                that._options.arrowsCss = that._options.arrowsCss == "k-ext-arrows-up"
                    ? "k-ext-arrows-down"
                    : that._options.arrowsCss == "k-ext-arrows-down"
                        ? "k-ext-arrows-up"
                        : that._options.arrowsCss == "k-ext-arrows-right"
                            ? "k-ext-arrows-left"
                            : that._options.arrowsCss == "k-ext-arrows-left"
                                ? "k-ext-arrows-right"
                                : "";
            }

            // Add the title bar to the pane.
            $pane.prepend(that._template(that._options));

            that.element = $pane.children("div.k-window-titlebar");

            // When the user clicks on the "toggle" button, expand / collapse
            // the pane.
            that.element.find(".k-ext-toggle").on("click", function () {
                var $toggle = $(this);
                var action = $toggle.hasClass("k-ext-expanded")
                    ? "collapse"
                    : "expand";
                that._splitter.toggle(that._pane, action == "expand");

                that.toggle(action, $toggle);
            });
        },

        toggle: function (action, $toggle) {
            /// <summary>
            /// Change the display of the titlebar.
            /// </summary>

            var that = this;
            var $pane = $(that._pane);

            if (!$toggle) {
                $toggle = that.element.find(".k-ext-toggle");
            }

            that._options.collapsed = action == "collapse";

            that.update();

            var $icon = $toggle.children(".k-icon");

            if (that._splitter.orientation == "horizontal") {
                if ($icon.hasClass("k-ext-arrows-left")) {
                    $icon.removeClass("k-ext-arrows-left").addClass("k-ext-arrows-right");
                } else {
                    $icon.removeClass("k-ext-arrows-right").addClass("k-ext-arrows-left");
                }
            } else {
                if ($icon.hasClass("k-ext-arrows-up")) {
                    $icon.removeClass("k-ext-arrows-up").addClass("k-ext-arrows-down");
                } else {
                    $icon.removeClass("k-ext-arrows-down").addClass("k-ext-arrows-up");
                }
            }
        },

        vertTitleName: function (title) {
            title = title || this._options.title;

            for (var idx = 0; idx < this._options.title.length; idx++) {
                this._vertTitle += this._options.title[idx] + "<br/>";
            }
        },

        update: function () {
            var that = this;

            var $pane = $(that._pane);
            var $titlebar = that.element;
            var $toggle = $titlebar.find(".k-ext-toggle");

            var $splitbar;
            var $otherPane;
            var position;

            if ($pane.next().hasClass("k-splitbar")) {
                $splitbar = $pane.next();
                $otherPane = $splitbar.next();
            } else {
                $splitbar = $pane.prev();
                $otherPane = $splitbar.prev();
            }

            if (that._options.collapsed) {
                // Resize the pane so that it is 25px wide/high.
                if (that._splitter.orientation == "horizontal") {
                    if ($pane.width() < 32) {
                        $pane.css("width", "32px");
                        if (that._options.region == "west") {
                            $splitbar.css("left", "32px");
                            $otherPane.css("left", "39px").width($otherPane.width() - 39);
                        } else {
                            $pane.css("left", parseInt($pane.css("left")) - 34);
                            $splitbar.css("left", parseInt($splitbar.css("left")) - 34);
                            $otherPane.css("right", "39px").width($otherPane.width() - 39);
                        }
                        // Hide the horizontal title.
                        $titlebar.children("span.k-ext-layout-title").css("display", "none");

                        // Resize the titlebar to extend the entire height of the pane.
                        $titlebar.css("height", $splitbar.height());

                        // If the vertical title is not displayed, then display it.
                        if ($titlebar.find("div.k-ext-vertical-layout-title").length == 0) {
                            $titlebar.append(kendo.format("<div style='position: absolute; top: 40px;' class='k-window-title k-ext-layout-title k-ext-vertical-layout-title'>{0}</div>", that._vertTitle));
                        }
                    }
                } else {
                    if ($pane.height() < 32) {
                        $pane.css("height", "32px");
                        if (that._options.region == "north") {
                            $splitbar.css("top", "32px");
                            $otherPane.css("top", "39px").height($otherPane.height() - 32);
                        } else {
                            $pane.css("top", parseInt($pane.css("top")) - 34);
                            $splitbar.css("top", parseInt($splitbar.css("top")) - 34);
                            $otherPane.css("bottom", "39px").height($otherPane.height() - 32);
                        }
                    }
                }
                $toggle.removeClass("k-ext-expanded").addClass("k-ext-collapsed");
            } else {
                // Show the horizontal titlebar, and if this is a horizontal splitter, then
                // hide the verticle title.
                $titlebar.height(18);
                $toggle.removeClass("k-ext-collapsed").addClass("k-ext-expanded");
                $toggle.closest(".k-window-titlebar").children(".k-window-title").css("display", "");
                $titlebar.find(".k-ext-vertical-layout-title").remove();
            }
        }
    };

    var ExtLayoutSplitter = kendo.ui.Splitter.extend({
        /// <summary>
        /// Create a splitter to be used specifically with the ExtBorderLayout.
        /// </summary>
        /// <author>John DeVight</author>

        _height: null,

        init: function (element, options) {
            /// <summary>
            /// Initialize the splitter.
            /// </summary>

            var that = this;

            kendo.ui.Splitter.fn.init.call(that, element, options);

            that.element.data("kendoSplitter", that);
            $.each(that._panes(), function (idx, pane) {
                var paneOptions = $(pane).data("pane");

                if (paneOptions.collapsible || paneOptions.showTitlebar) {
                    var extLayoutTitleBar = new ExtLayoutTitleBar(that, pane, paneOptions);
                    extLayoutTitleBar.init();
                    $(pane).data("titlebar", extLayoutTitleBar);
                }
            });

            // setTimeout(function () { that.resize(); }, 100);

            setInterval(function () { that.updateCollapsedPanes(); }, 50);
        },

        _triggerAction: function () {
            /// <summary>
            /// Override the default behavior when the user clicks on the expand / collapse
            /// icon in the splitterbar and call the ExtLayoutTitle.toggle function.
            /// </summary>

            this.toggle(arguments[1], arguments[0] == "expand");
            arguments[1].data("titlebar").toggle(arguments[0]);
        },

        updateCollapsedPanes: function (e) {
            /// <summary>
            /// Loop through all the panes.  If the pane has a titlebar and is collapsed, then resize 
            //  the pane to 25px to display the titlebar.
            /// </summary>

            var that = this;

            var panes = that._panes();

            $.each(panes, function (idx, pane) {
                var title = $(pane).data("titlebar");
                if (title && (e == undefined || title.element[0] != e.target)) {
                    if (title._options.collapsed) {
                        title.update();
                    }
                }
            });
        },

        resize: function () {
            /// <summary>
            /// Resize the splitter to fit within the parent.
            /// </summary>

            var that = this;
            var $parent = that.element.parent();
            var height = $parent.height();

            if (that._height != height) {
                that._height = height;

                // Get any margins or padding applied to the body and the border for the splitter.
                var mt = parseInt($parent.css("margin-top"));
                var mb = parseInt($parent.css("margin-bottom"))
                var pt = parseInt($parent.css("padding-top"))
                var pb = parseInt($parent.css("padding-bottom"))
                var btw = parseInt(that.element.css("border-top-width"))
                var bbw = parseInt(that.element.css("border-bottom-width"));
                var offset = (isNaN(mt) ? 0 : mt) + (isNaN(mb) ? 0 : mb) + (isNaN(pt) ? 0 : pt) +
                    (isNaN(pb) ? 0 : pb) + (isNaN(btw) ? 0 : btw) + (isNaN(bbw) ? 0 : bbw);
                that.element.height(that._height - offset).resize();

                if (that.options.orientation == "vertical") {
                    var panes = that.element.children("div.k-pane, div.k-splitbar");
                    $.each(panes, function (idx, pane) {
                        $(pane).css("width", "100%");
                    });
                }
            }
        },

        options: {
            name: "ExtLayoutSplitter"
        }
    });
    kendo.ui.plugin(ExtLayoutSplitter);

    var ExtBorderLayout = kendo.ui.Widget.extend({
        /// <summary>
        /// Create a border layout.
        /// </summary>
        /// <author>John DeVight</author>

        _outerSplitter: null,
        _innerSplitter: null,

        init: function (element, options) {
            /// <summary>
            /// Initialize the border layout using splitters.
            /// </summary>

            var that = this;

            kendo.ui.Widget.fn.init.call(that, element, options);

            var horizontalPanes = [];
            var verticalPanes = [];

            // No regions, no layout.
            if (!options.items) {
                throw "The items array must be defined";
            }

            // Get the regions passed in.
            var north = kendo.arrays.find(options.items, { attr: "region", value: "north" });
            var south = kendo.arrays.find(options.items, { attr: "region", value: "south" });
            var east = kendo.arrays.find(options.items, { attr: "region", value: "east" });
            var west = kendo.arrays.find(options.items, { attr: "region", value: "west" });
            var center = kendo.arrays.find(options.items, { attr: "region", value: "center" });

            /* Validate the regions. */

            if (center == null) {
                throw "A center item must be defined";
            }

            if (north == null && south == null && east == null && west == null) {
                throw "A region of north, south, east or west must be defined";
            }

            var $layout = $(element);

            /* Move the regions into the correct position and add them to the appropriate arrays. */

            // If there are north or south regions defined, then add them to the vertical array.
            if (north != null || south != null) {
                if (north != null) verticalPanes.push(north);

                // If east and west are not defined then add the center region to the vertical array.
                if (east == null && west == null) {
                    verticalPanes.push(center);
                    // If east and west are not defined, then create a center region for the "inner" splitter.
                } else {
                    var innerSplitterId = kendo.format("{0}_innerSplitterContents", element.id);
                    $layout.append($(kendo.format("<div id='{0}'/>", innerSplitterId)).attr("class", "k-ext-inner-splitter-contents"));
                    verticalPanes.push({
                        content: kendo.format("#{0}", innerSplitterId)
                    });
                }

                if (south != null) verticalPanes.push(south);
            }

            // If there are east or west regions defined, then add them to the horizontal array and add the center
            // region to the horizontal array.
            if (west != null) horizontalPanes.push(west);
            if (east != null || west != null) horizontalPanes.push(center);
            if (east != null) horizontalPanes.push(east);

            // Create a div for the outer splitter.
            var $outerDiv = $(kendo.format("<div id='{0}_outerSplitter'/>", element.id));
            $layout.append($outerDiv);

            // If there are east or west regions...
            if (verticalPanes.length > 0) {
                // Add the north and south regions to the outer splitter.
                $.each(verticalPanes, function (idx, pane) {
                    $outerDiv.append($(pane.content));
                });
                // Get the div that was created for the innter splitter and add the
                // east, center and west regions.
                var $innerDiv = $(kendo.format("#{0}_innerSplitterContents", element.id));
                $.each(horizontalPanes, function (idx, pane) {
                    $innerDiv.append($(pane.content));
                });

                // Initialize the outer splitter.
                that._outerSplitter = $outerDiv.kendoExtLayoutSplitter({ orientation: "vertical", panes: verticalPanes }).data("kendoExtLayoutSplitter");

                // Initialize the inner splitter.
                that._innerSplitter = $innerDiv.kendoExtLayoutSplitter({ panes: horizontalPanes }).data("kendoExtLayoutSplitter");
                // There are no east and west regions.
            } else {
                // Add the north, center and south regions to the outer splitter.
                $.each(horizontalPanes, function (idx, pane) {
                    $outerDiv.append($(pane.content));
                });

                // Initialize the outer splitter.
                that._outerSplitter = $outerDiv.kendoExtLayoutSplitter({ panes: horizontalPanes }).data("kendoExtLayoutSplitter");
            }

            if (that._outerSplitter != null) {
                setTimeout(function () { that.resize(); }, 100);
            }
        },

        resize: function () {
            /// <summary>
            /// Resize the border layout to fit within the parent.
            /// </summary>

            var that = this;
            var $parent = that.element.parent();
            var height = parseInt(that.options.height);
            if (isNaN(height)) {
                if ($parent[0] == document.body) {
                    height = $(window).height();
                } else {
                    height = $parent.height();
                }
            }
            // Resize if the height has changed.
            if (that._height != height) {
                that._height = height;

                // Get any margins or padding applied to the body and the border for the splitter.
                var mt = parseInt($parent.css("margin-top"));
                var mb = parseInt($parent.css("margin-bottom"))
                var pt = parseInt($parent.css("padding-top"))
                var pb = parseInt($parent.css("padding-bottom"))
                var btw = parseInt(that.element.css("border-top-width"))
                var bbw = parseInt(that.element.css("border-bottom-width"));
                var offset = (isNaN(mt) ? 0 : mt) + (isNaN(mb) ? 0 : mb) + (isNaN(pt) ? 0 : pt) +
                    (isNaN(pb) ? 0 : pb) + (isNaN(btw) ? 0 : btw) + (isNaN(bbw) ? 0 : bbw);
                that.element.height(that._height - offset).resize();

                // Resize the layout splitters.
                that._outerSplitter.resize();
                if (that._innerSplitter != null) {
                    that._innerSplitter.resize();
                }
            }

            if (that.options.height == "fill") {
                setTimeout(function () { that.resize(); }, 100);
            }
        },

        setTitle: function (region, title) {
            var paneOptions = kendo.arrays.find(this.options.items, { attr: "region", value: region });

            if (paneOptions != null) {
                var $pane = $(paneOptions.content);
                var titlebar = $pane.data("titlebar");
                titlebar.vertTitleName(title);
                $pane.find(".k-ext-layout-title").text(title);
            }
        },

        options: {
            name: "ExtBorderLayout",
            height: "fill"
        }
    });
    kendo.ui.plugin(ExtBorderLayout);
})(window.kendo.jQuery, window.kendo);



/*
* ExtContextMenu
*/

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
            hideOnMouseLeave: true,
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

            // If the context menu should hide when the mouse moves away...
            if (options.hideOnMouseLeave) {
                // When the mouse moves away from the context menu, then hide the context menu.
                $(that.element).on('mouseleave', function () {
                    that.cancelHide = false;
                    delay = options.delay || that.options.delay;
                    setTimeout(function () { that.hide() }, delay);
                });

                // If the mouse moves away and then back over the context menu before the context
                // menu is hidden, then do not hide the context menu.
                $(that.element).on('mouseenter', function () {
                    that.cancelHide = true;
                });
            }

            // If a beforeOpen function is provided, call the beforeOpen function before then
            // context menu is opened.
            if (that.options.beforeOpen) {
                that.bind("beforeopen", that.options.beforeOpen);
            }

            // When a context menu item is selected, call the _select function.
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
                            xPos = window.innerWidth - eleWidth - 1;
                        }
                        if ((eleHeight + yPos) > window.innerHeight) {
                            yPos = window.innerHeight - eleHeight - 1;
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
                    });
                } else if (that.options.animation.open.effects == "slide") {
                    $(that.element).slideToggle('fast', function () {
                    });
                }
            }

        },

        hide: function () {
            /// <summary>
            /// Hide the context menu unless the cancelHide flag is set to true.
            /// <summary>

            var that = this;

            if ($(that.element).is(":visible") && !that.cancelHide) {
                that._forceHide();
            }
        },

        _forceHide: function () {
            /// <summary>
            /// Hide the context menu.
            /// <summary>

            var that = this;

            if (!that.hiding && $(that.element).is(":visible")) {
                that.hiding = true;

                // Hide the context menu.
                if (that.options.animation.close.effects == "fade") {
                    $(that.element).fadeOut(function () {
                        that.hiding = false;
                    });
                } else if (that.options.animation.close.effects == "slide") {
                    $(that.element).slideToggle('fast', function () {
                        that.hiding = false;
                    });
                }
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

            if (that.options.closeOnClick == true) {
                that._forceHide();
            } else {
                that.hide();
            }
        }
    });
    kendo.ui.plugin(ExtContextMenu);
})(window.kendo.jQuery, window.kendo);



/*
* ExtDialog
*/

(function ($, kendo) {
    var ExtDialog = kendo.ui.Window.extend({
        /// <summary>
        /// Window widget with buttons fixed and centered along the bottom.  The content is contained in a scrollable div.
        /// </summary>
        /// <author>John DeVight</author>

        _buttonTemplate: kendo.template('<div class="k-ext-dialog-buttons" style="position:absolute; bottom:10px; text-align:center; width:#= parseInt(width) - 14 #px;"><div style="display:inline-block"># $.each (buttons, function (idx, button) { # <button class="k-button" style="margin-right:5px; width:100px;">#= button.name #</button> # }) # </div></div>'),
        _contentTemplate: kendo.template('<div class="k-ext-dialog-content" style="height:#= parseInt(height) - 55 #px;; width:#= parseInt(width) - 14 #px;overflow:auto;">'),

        init: function (element, options) {
            /// <summary>
            /// Initialize the dialog.
            /// </summary>

            var that = this;

            options.visible = options.visible || false;

            kendo.ui.Window.fn.init.call(that, element, options);
            $(element).data("kendoWindow", that);

            // Place the content in a scollable div.
            var html = $(element).html();
            $(element).html(that._contentTemplate(options));
            $(element).find("div.k-ext-dialog-content").append(html);

            // Create a div for the buttons.
            $(element).after(that._buttonTemplate(options));

            // Create the buttons.
            $.each(options.buttons, function (idx, button) {
                if (button.click) {
                    $($(element).parent().find(".k-ext-dialog-buttons .k-button")[idx]).on("click", { handler: button.click }, function (e) {
                        e.data.handler({ button: this, dialog: that });
                    });
                }
            });

            // When the window resizes, position the content and button divs.
            that.bind("resize", function (e) {
                that.resizeDialog();
            });
        },

        resizeDialog: function () {
            /// <summary>
            /// Adjust the width and height for the buttons and content within the Window.
            /// </summary>

            var that = this;
            var $dialog = $(that.element);
            var width = $dialog.width();
            var height = $dialog.height();
            $dialog.parent().find(".k-ext-dialog-buttons").width(width);
            $dialog.parent().find(".k-ext-dialog-content").width(width).height(height - 39);
        },

        options: {
            name: "ExtDialog"
        }
    });
    kendo.ui.plugin(ExtDialog);



    /*
     *
     * AlertDialog
     *
     */

    kendo.ui.ExtAlertDialog = {
        /// <summary>
        /// Show / Hide an Alert Dialog.
        /// </summary>
        /// <author>John DeVight</author>

        show: function (options) {
            /// <summary>
            /// Show the Alert Dialog.
            /// </summary>

            return new $.Deferred(function (deferred) {
                var dialog = null;

                // If an alert dialog already exists, remove it.
                if ($("#extAlertDialog").length > 0) {
                    $("#extAlertDialog").parent().remove();
                }

                options = $.extend({
                    width: "300px",
                    height: "100px",
                    buttons: [{
                        name: "OK",
                        click: function (e) {
                            dialog.close();
                            deferred.resolve({ button: "OK" });
                        }
                    }],
                    modal: true,
                    visible: false,
                    message: "",
                    icon: "k-ext-information"
                }, options);

                // Add a div to the html document for the alert dialog.
                $(document.body).append(kendo.format("<div id='extAlertDialog' style='position:relative;'><div style='position:absolute;left:10px;top:10px;' class='{0}'></div><div style='display:inline-block;margin-left:45px;'>{1}</div></div>", options.icon, options.message));

                // Create the alert dialog.
                dialog = $("#extAlertDialog").kendoExtDialog(options).data("kendoExtDialog");
                $("#extAlertDialog").parent().find("div.k-window-titlebar div.k-window-actions").empty();

                // Display and center the alert dialog.
                dialog.center().open();
            });
        },

        hide: function () {
            /// <summary>
            /// Hide the Alert Dialog.
            /// </summary>

            $("#extAlertDialog").data("kendoExtDialog").close();
        }
    };



    /*
     *
     * OkCancelDialog
     *
     */

    kendo.ui.ExtOkCancelDialog = {
        show: function (options) {
            return new $.Deferred(function (deferred) {
                if ($("#extOkCancelDialog").length > 0) {
                    $("#extOkCancelDialog").parent().remove();
                }

                options = $.extend({
                    width: "300px",
                    height: "100px",
                    buttons: [{
                        name: "OK",
                        click: function (e) {
                            $("#extOkCancelDialog").data("kendoExtDialog").close();
                            deferred.resolve({ button: "OK" });
                        }
                    }, {
                        name: "Cancel",
                        click: function (e) {
                            $("#extOkCancelDialog").data("kendoExtDialog").close();
                            deferred.resolve({ button: "Cancel" });
                        }
                    }],
                    modal: true,
                    visible: false,
                    message: "",
                    icon: "k-ext-information"
                }, options);

                $(document.body).append(kendo.format("<div id='extOkCancelDialog' style='position:relative;'><div style='position:absolute;left:10px;top:10px;' class='{0}'></div><div style='display:inline-block;margin-left:45px;'>{1}</div></div>", options.icon, options.message));
                $("#extOkCancelDialog").kendoExtDialog(options);
                $("#extOkCancelDialog").parent().find("div.k-window-titlebar div.k-window-actions").empty();
                $("#extOkCancelDialog").data("kendoExtDialog").center().open();
            });
        }
    };



    /*
     *
     * YesNoDialog
     *
     */

    kendo.ui.ExtYesNoDialog = {
        show: function (options) {
            return new $.Deferred(function (deferred) {
                if ($("#extYesNoDialog").length > 0) {
                    $("#extYesNoDialog").parent().remove();
                }

                options = $.extend({
                    width: "300px",
                    height: "100px",
                    buttons: [{
                        name: "Yes",
                        click: function (e) {
                            $("#extYesNoDialog").data("kendoExtDialog").close();
                            deferred.resolve({ button: "Yes" });
                        }
                    }, {
                        name: "No",
                        click: function (e) {
                            $("#extYesNoDialog").data("kendoExtDialog").close();
                            deferred.resolve({ button: "No" });
                        }
                    }],
                    modal: true,
                    visible: false,
                    message: "",
                    icon: "k-ext-information"
                }, options);

                $(document.body).append(kendo.format("<div id='extYesNoDialog' style='position:relative;'><div style='position:absolute;left:10px;top:10px;' class='{0}'></div><div style='display:inline-block;margin-left:45px;'>{1}</div></div>", options.icon, options.message));
                $("#extYesNoDialog").kendoExtDialog(options);
                $("#extYesNoDialog").parent().find("div.k-window-titlebar div.k-window-actions").empty();
                $("#extYesNoDialog").data("kendoExtDialog").center().open();
            });
        },

        hide: function () {
            $("#extYesNoDialog").data("kendoExtDialog").close();
        }
    };



    /*
     *
     * InputDialog
     *
     */

    kendo.ui.ExtInputDialog = {
        show: function (options) {
            return new $.Deferred(function (deferred) {
                var dialog = null;

                if ($("#extInputDialog").length > 0) {
                    $("#extInputDialog").parent().remove();
                }

                options = $.extend({
                    width: "300px",
                    height: "100px",
                    buttons: [{
                        name: "OK",
                        click: function (e) {
                            var $inputText = $("#extInputDialog .k-ext-input-dialog-input");
                            if (dialog.options.required && $inputText.val().length == 0) {
                                $inputText.addClass(dialog.options.requiredCss);
                            } else {
                                dialog.close();
                                deferred.resolve({ button: "OK", input: $inputText.val() });
                            }
                        }
                    }, {
                        name: "Cancel",
                        click: function (e) {
                            dialog.close();
                            deferred.resolve({ button: "Cancel" });
                        }
                    }],
                    modal: true,
                    visible: false,
                    message: "",
                    required: false,
                    requiredCss: "k-ext-required"
                }, options);

                $(document.body).append(kendo.format("<div id='extInputDialog' style='position:relative;'><div style='display:block;margin-left:10px;right-margin:10px;'>{0}</div><div style='display:block;margin-left:10px;margin-right:15px;'><input type='text' class='k-ext-input-dialog-input' style='width:100%;'</input></div></div>", options.message));
                dialog = $("#extInputDialog").kendoExtDialog(options).data("kendoExtDialog");
                $("#extInputDialog").parent().find("div.k-window-titlebar div.k-window-actions").empty();
                dialog.center().open();
            });
        },

        hide: function () {
            $("#extInputDialog").data("kendoExtDialog").close();
        }
    };



    /*
     *
     * WaitDialog
     *
     */

    kendo.ui.ExtWaitDialog = {
        show: function (options) {
            return new $.Deferred(function (deferred) {
                if ($("#extWaitDialog").length > 0) {
                    $("#extWaitDialog").parent().remove();
                }

                options = $.extend({
                    width: "300px",
                    height: "100px",
                    modal: true,
                    visible: false,
                    message: ""
                }, options);

                $(document.body).append(kendo.format("<div id='extWaitDialog' style='position:relative;'><div style='position:absolute;left:10px;top:10px;' class='k-ext-wait'></div><div style='display:inline-block;margin-left:45px;'>{0}</div></div>", options.message));
                $("#extWaitDialog").kendoWindow(options);
                $("#extWaitDialog").parent().find("div.k-window-titlebar div.k-window-actions").empty();
                $("#extWaitDialog").data("kendoWindow").center().open();

                return deferred.resolve();
            });
        },

        hide: function () {
            $("#extWaitDialog").data("kendoWindow").close();
        }
    };
})(window.kendo.jQuery, window.kendo);



/*
* ExtDropDownGrid
*/

(function ($, kendo) {
    var ExtDropDownGrid = kendo.ui.Widget.extend({
        /// <summary>
        /// Combine the DropDownList and TreeView widgets to create a DropDownTreeView widget.
        /// </summary>
        /// <author>John DeVight</author>

        _uid: null,
        _grid: null,
        _dropdown: null,

        init: function (element, options) {
            /// <summary>
            /// Initialize the widget.
            /// </summary>

            var that = this;

            kendo.ui.Widget.fn.init.call(that, element, options);

            // Generate a unique id.
            that._uid = new Date().getTime();

            // Append the html to the "root" element for the DropDownList and TreeView widgets.
            $(element).append(kendo.format("<div id='extGrid{0}' class='k-ext-grid' style='{1};z-index:1;'/>",
                that._uid, options.gridWidth
                    ? kendo.format("width:{0}", options.gridWidth)
                    : ""));
            $(element).append(kendo.format("<input id='extDropDown{0}' class='k-ext-dropdown'/>", that._uid));

            // Create the Grid.
            that._grid = $(kendo.format("#extGrid{0}", that._uid)).kendoGrid(options.grid).data("kendoGrid");
            that._grid.bind("change", function (e) {
                setTimeout(function () {
                    var tr = $(that._grid.element).find("tr.k-state-selected");

                    if (tr.length > 0 && tr.hasClass("k-grid-edit-row") === false) {
                        // Get the selected row.
                        var item = that._grid.dataItem(tr);
                        // Display the text for the selected row in the dropdownlist.
                        $dropdownRootElem.find("span.k-input").text(item[that.options.dataTextField]);

                        $(that._grid.element).slideToggle('fast', function () {
                            $(that._grid.element).removeClass("k-custom-visible");
                        });

                        that.trigger("change", e);
                    }
                });
            });

            // Create the DropDownList.
            that._dropdown = $(kendo.format("#extDropDown{0}", that._uid)).kendoDropDownList({
                dataSource: [{ text: "", value: "" }],
                dataTextField: "text",
                dataValueField: "value",
                open: function (e) {
                    //to prevent the dropdown from opening or closing.
                    e.preventDefault();
                    // If the grid is not visible, then make it visible.
                    if (!$(that._grid.element).hasClass("k-custom-visible")) {
                        // Position the grid so that it is below the dropdown.
                        $(that._grid.element).css({
                            "top": $dropdownRootElem.position().top + $dropdownRootElem.height(),
                            "left": $dropdownRootElem.position().left
                        });
                        // Display the grid.
                        $(that._grid.element).slideToggle('fast', function () {
                            that._dropdown.close();
                            $(that._grid.element).addClass("k-custom-visible");
                        });
                    }
                }
            }).data("kendoDropDownList");

            // If a width has been provided, then set the new width.
            if (options.dropDownWidth) {
                that._dropdown._focused.width(options.dropDownWidth);
            }

            var $dropdownRootElem = $(that._dropdown.element).closest("span.k-dropdown");

            $(that._grid.element).hide().css({
                "border": "1px solid grey",
                "position": "absolute"
            });

            $(document).click(function (e) {
                // Ignore clicks on the grid.
                if ($(e.target).closest(kendo.format("#extGrid{0}", that._uid)).length == 0 &&
                    ($(e.target).closest("form.k-filter-menu").length == 0) &&  /* Filter form */
                    ($(e.target).hasClass("k-link") && $(e.target).data("page") > 0) == false /* Pager */) {
                    // If visible, then close the grid.
                    if ($(that._grid.element).hasClass("k-custom-visible")) {
                        $(that._grid.element).slideToggle('fast', function () {
                            $(that._grid.element).removeClass("k-custom-visible");
                        });
                    }
                }
            });
        },

        dropDownList: function () {
            /// <summary>
            /// Return a reference to the DropDownList widget.
            /// </summary>

            return this._dropdown;
        },

        grid: function () {
            /// <summary>
            /// Return a reference to the Grid widget.
            /// </summary>

            return this._grid;
        },

        options: {
            name: "ExtDropDownGrid"
        }
    });
    kendo.ui.plugin(ExtDropDownGrid);
})(window.kendo.jQuery, window.kendo);



/*
* ExtDropDownTreeView
*/

(function ($, kendo) {
    var ExtDropDownTreeView = kendo.ui.Widget.extend({
        /// <summary>
        /// Combine the DropDownList and TreeView widgets to create a DropDownTreeView widget.
        /// </summary>
        /// <author>John DeVight</author>

        _uid: null,
        _treeview: null,
        _dropdown: null,

        init: function (element, options) {
            /// <summary>
            /// Initialize the widget.
            /// </summary>

            var that = this;

            kendo.ui.Widget.fn.init.call(that, element, options);

            // Generate a unique id.
            that._uid = new Date().getTime();

            // Append the html to the "root" element for the DropDownList and TreeView widgets.
            $(element).append(kendo.format("<input id='extDropDown{0}' class='k-ext-dropdown'/>", that._uid));
            $(element).append(kendo.format("<div id='extTreeView{0}' class='k-ext-treeview' style='z-index:1;'/>", that._uid));

            // Create the dropdown.
            that._dropdown = $(kendo.format("#extDropDown{0}", that._uid)).kendoDropDownList({
                dataSource: [{ text: "", value: "" }],
                dataTextField: "text",
                dataValueField: "value",
                open: function (e) {
                    //to prevent the dropdown from opening or closing. A bug was found when clicking on the dropdown to 
                    //"close" it. The default dropdown was visible after the treeview had closed.
                    e.preventDefault();
                    // If the treeview is not visible, then make it visible.
                    if (!$treeviewRootElem.hasClass("k-custom-visible")) {
                        // Position the treeview so that it is below the dropdown.
                        $treeviewRootElem.css({
                            "top": $dropdownRootElem.position().top + $dropdownRootElem.height(),
                            "left": $dropdownRootElem.position().left
                        });
                        // Display the treeview.
                        $treeviewRootElem.slideToggle('fast', function () {
                            that._dropdown.close();
                            $treeviewRootElem.addClass("k-custom-visible");
                        });
                    }
                }
            }).data("kendoDropDownList");

            // If a width has been provided, then set the new width.
            if (options.dropDownWidth) {
                that._dropdown._inputWrapper.width(options.dropDownWidth);
            }

            var $dropdownRootElem = $(that._dropdown.element).closest("span.k-dropdown");

            // Create the treeview.
            that._treeview = $(kendo.format("#extTreeView{0}", that._uid)).kendoTreeView(options.treeview).data("kendoTreeView");
            that._treeview.bind("select", function (e) {
                // When a node is selected, display the text for the node in the dropdown and hide the treeview.
                $dropdownRootElem.find("span.k-input").text($(e.node).children("div").text());
                $treeviewRootElem.slideToggle('fast', function () {
                    $treeviewRootElem.removeClass("k-custom-visible");
                    that.trigger("select", e);
                });
            });

            var $treeviewRootElem = $(that._treeview.element).closest("div.k-treeview");

            // Hide the treeview.
            $treeviewRootElem
                .width($dropdownRootElem.width())
                .css({
                    "border": "1px solid grey",
                    "display": "none",
                    "position": "absolute",
                    "background-color": that._dropdown.list.css("background-color")
                });

            $(document).click(function (e) {
                // Ignore clicks on the treetriew.
                if ($(e.target).closest("div.k-treeview").length == 0) {
                    // If visible, then close the treeview.
                    if ($treeviewRootElem.hasClass("k-custom-visible")) {
                        $treeviewRootElem.slideToggle('fast', function () {
                            $treeviewRootElem.removeClass("k-custom-visible");
                        });
                    }
                }
            });
        },

        dropDownList: function () {
            /// <summary>
            /// Return a reference to the DropDownList widget.
            /// </summary>

            return this._dropdown;
        },

        treeview: function () {
            /// <summary>
            /// Return a reference to the TreeView widget.
            /// </summary>

            return this._treeview;
        },

        options: {
            name: "ExtDropDownTreeView"
        }
    });
    kendo.ui.plugin(ExtDropDownTreeView);
})(window.kendo.jQuery, window.kendo);



/*
* ExtGrid
*/

(function ($, kendo) {
    var ExtGrid = kendo.ui.Grid.extend({
        /// <summary>
        /// Add additional functionality to the Grid.
        /// </summary>
        /// <author>John DeVight</author>

        options: {
            name: "ExtGrid",
            messages: {
                filterempty: "No records to display.",
                dataempty: "No records to display."
            },
            showToolBarColumnMenu: false,
            showFilterBar: false    // requires the options.filterable be set to true
        },

        init: function (element, options) {
            /// <summary>
            /// Initialize the widget.
            /// </summary>

            var that = this;

            var dataBound = function (e) {
                /// <summary>
                /// When the data that is bound to the grid is empty, then display a message.
                /// </summary>

                var $gridContent = $(element).find(".k-grid-content");

                // If a message is being displayed, remove it.
                $gridContent.find(".ext-grid-empty-msg").remove();

                if (that._data.length == 0) {
                    // Determine whether the reason for the empty grid is because a filter was applied.
                    var msg = (that.dataSource._filter != undefined && that.dataSource._filter.filters.length > 0)
                        ? that.options.messages.filterempty
                        : that.options.messages.dataempty;

                    // Display the message.
                    $gridContent.prepend(kendo.format("<div class='ext-grid-empty-msg'>{0}</div>", msg));
                }

                // If the filter bar is displayed, then display the filter.
                if (that.options.showFilterBar) {
                    that.displayFilter();
                }
            };

            // If the options contains dataBound event handler, then call the dataBound function above
            // first, then call the dataBound event handler from the options passed in.
            if (options.dataBound) {
                var userDataBound = options.dataBound;

                options.dataBound = function () {
                    dataBound.apply(that, arguments);
                    userDataBound.apply(that, arguments);
                }
            } else {
                options.dataBound = function () {
                    dataBound.apply(that, arguments);
                }
            }

            // Call the base class init.
            kendo.ui.Grid.fn.init.call(that, element, options);

            // The Kendo library has some hard coded references to kendoGrid, so the following
            // needs to be added to make this work.
            $(element).data("kendoGrid", that);

            // If the filter bar should be displayed, then create the filter bar.
            if (that.options.showFilterBar) {
                if ($(element).find("div.k-ext-grid-filterbar").length == 0) {
                    $(element).append("<div class='k-header k-ext-grid-filterbar'>" +
                                        "<span class='k-ext-grid-filtertext'></span>" +
                                        "<button class='k-button k-ext-grid-filterbutton' style='display:none;'>Clear Filter</button>" +
                                      "</div>");
                    $(element).on("click", "div.k-ext-grid-filterbar button.k-ext-grid-filterbutton", { grid: that }, that.clearFilter);
                }
            }

            // If the column menu should be displayed in the toolbar.
            if (that.options.showToolBarColumnMenu) {
                // Create the column menu items.
                $menu = $("<ul></ul>");
                $.each(that.columns, function (idx, column) {
                    if ($.trim(column.title).length > 0) {
                        $menu.append(kendo.format("<li><input  type='checkbox' data-index='{0}' data-field='{1}' {2}>{3}</li>",
                            idx, column.field, column.hidden ? "" : "checked", column.title));
                    }
                });

                // Create a "Columns" menu for the toolbar.
                that.wrapper.find("div.k-grid-toolbar").append("<ul class='k-ext-grid-columnmenu' style='float:right;'><li>Columns</li></ul>");
                that.wrapper.find("div.k-grid-toolbar ul.k-ext-grid-columnmenu li").append($menu);
                that.wrapper.find("div.k-grid-toolbar ul.k-ext-grid-columnmenu").kendoMenu({
                    closeOnClick: false,
                    select: function (e) {
                        // Get the selected column.
                        var $item = $(e.item), $input, index, columns = that.columns, field;
                        $input = $item.find(":checkbox");
                        if ($input.attr("disabled")) {
                            return;
                        }

                        // Get the name of the field.
                        field = $input.attr(kendo.attr("field"));

                        // Get the index of the field in the grid's columns.
                        $.each(columns, function (idx, column) {
                            if (column.field == field || column.title == field) {
                                index = idx;
                                return false;
                            }
                        });

                        // If checked, then show the column; otherwise hide the column.
                        if ($input.is(":checked")) {
                            that.showColumn(index);
                        } else {
                            that.hideColumn(index);
                        }
                    }
                });
            }
        },

        _setContentHeight: function () {
            /// <summary>
            /// Override the _setContentHeight to adjust the height of the grid to include the 
            /// filter bar if the showFilterBar option has been set to true.
            /// </summary>

            kendo.ui.Grid.fn._setContentHeight.call(this);

            if (this.options.showFilterBar) {
                this.content.css("height", parseFloat(this.content.css("height")) - 32)
            }
        },

        displayFilter: function () {
            /// <summary>
            /// Display the filter in the filter bar.
            /// </summary>

            var that = this;

            var convertOperator = function (field, operator) {
                /// <summary>
                /// Convert the operator into a string that can be used when
                /// displaying the filter in the filter bar.
                /// </summary>

                var result = "";
                var model = that.dataSource.reader.model;
                var type = "string";

                if (model && model.fields && model.fields[field]) {
                    type = model.fields[field].type;
                }

                // Get the string from the dropdownlist of operators in the filter menu.
                result = window.kendo.ui.FilterMenu.fn.options.operators[type][operator];

                return result.toLowerCase();
            };

            // If there is a filter on the datasource, then display it, otherwise display
            // "No Filter".
            if (typeof that.dataSource._filter !== "undefined") {
                var text = "";

                // Build the filter text.
                for (var fdx = 0; fdx < that.dataSource._filter.filters.length; fdx++) {
                    var found = false;
                    var filter = that.dataSource._filter.filters[fdx];
                    for (var cdx = 0; cdx < that.columns.length && found == false; cdx++) {
                        if (filter.field === that.columns[cdx].field) {
                            text += kendo.format("{0}{1} {2} {3}",
                                text.length == 0 ? "" : " and ",
                                that.columns[cdx].title,
                                convertOperator(that.columns[cdx].field, filter.operator),
                                filter.value);
                            found = true;
                        }
                    }
                }

                that.element.find("div.k-ext-grid-filterbar span.k-ext-grid-filtertext").text(kendo.format("Filter: {0}", text));
                that.element.find("div.k-ext-grid-filterbar button.k-ext-grid-filterbutton").fadeIn();
            } else {
                that.element.find("div.k-ext-grid-filterbar span.k-ext-grid-filtertext").text("No Filter");
                that.element.find("div.k-ext-grid-filterbar button.k-ext-grid-filterbutton").fadeOut();
            }
        },

        clearFilter: function (e) {
            /// <summary>
            /// Clear the filter in the filter bar.
            /// </summary>

            e.data.grid.dataSource.filter({});
        }
    });
    kendo.ui.plugin(ExtGrid);
})(window.kendo.jQuery, window.kendo);



/*
* ExtTextBox
*/

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



/*
* Map
*/

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'kendo'], factory);
    } else {
        // Browser globals
        factory(window.jQuery, window.kendo);
    }
}(function ($, kendo) {

    // shorten references to variables. this is better for uglification 
    var ui = kendo.ui,
    Widget = ui.Widget,
    CHANGE = "change",
    markers = [],
    infoWindows = [];

    var Map = Widget.extend({

        init: function (element, options) {

            var that = this;

            // before we initialize the widget, figure out if the 
            // google maps script has been included.
            if (!window.google) {
                kendo.logToConsole("It doesn't appear that you have Google Maps library loaded.");
            }
            else {
                // base call to widget initialization
                Widget.fn.init.call(this, element, options);

                // compile the marker template if applicable
                if (that.options.marker.template)
                    that.template = kendo.template(that.options.marker.template);

                // create the default maps options
                that._mapOptions = {
                    zoom: 8,
                    center: new google.maps.LatLng("36.166667", "-86.783333"),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                // map creation is a deferred for geocoding
                that._createMap().then(function () {
                    that._dataSource();
                });
            }
        },

        options: {
            // the name is what it will appear as off the kendo namespace(i.e. kendo.ui.YouTube). 
            // The jQuery plugin would be jQuery.fn.kendoYouTube.
            name: "Map",
            // other options go here
            autoBind: true,
            latField: "lat",
            lngField: "lng",
            addressField: "address",
            titleField: "title",
            fitBounds: false,
            map: {
                options: {}
            },
            marker: {
                options: {},
                template: null
            }
        },

        refresh: function () {

            var that = this,
                view = that.dataSource.view(),
                fitBounds = false;

            // make sure the necessary google objects exist
            that.bounds = new google.maps.LatLngBounds();

            // iterate through the results set and drop markers
            // this isn't the fastest way to loop, but it's the cleanest
            $.each(view, function (index, item) {

                // if this is the last item, we want to fit the bounds if applicable
                if (index === view.length - 1 && that.options.fitBounds) {
                    fitBounds = true;
                }

                // check the address field, if it's populated, try and 
                // geocode it
                // TODO: Function in a loop? Is there a better way?
                if (item[that.options.addressField]) {
                    that.geocode(item[that.options.addressField]).then(function (results) {
                        that.dropMarker(results[0].geometry.location, item, fitBounds);
                    });
                }
                else {
                    // create a new latlng object
                    var latlng = new google.maps.LatLng(item[that.options.latField], item[that.options.lngField]);
                    that.dropMarker(latlng, item, fitBounds);
                }
            });
        },

        _createMap: function () {

            var that = this,
                options = that.options.map.options,
                dfr = $.Deferred();

            $.extend(that._mapOptions, options);

            if (options.center) {
                // its possible that we passed a string as a center point for the map
                // which means we should try and geocode it
                if ($.type(options.center) !== "string") {
                    // create the map. if an array of elements are passed, only the first
                    // will be used.
                    that._mapOptions.center = new google.maps.LatLng(options.center.lat, options.center.lng);
                    that.map = new google.maps.Map(that.element[0], that._mapOptions);
                    dfr.resolve();
                }
                else {
                    that.geocode(options.center).then(function (results) {
                        that._mapOptions.center = results[0].geometry.location;
                        that.map = new google.maps.Map(that.element[0], that._mapOptions);
                        dfr.resolve();
                    });
                }
            }
            else {
                that.map = new google.maps.Map(that.element[0], that._mapOptions);
                dfr.resolve();
            }

            return dfr.promise();
        },

        geocode: function (address) {
            var that = this,
            dfr = $.Deferred();

            that._geocoder = that._geocoder || new google.maps.Geocoder();

            that._geocoder.geocode({ 'address': address }, dfr.resolve);

            return dfr.promise();
        },

        dropMarker: function (latlng, data, fitBounds) {
            var that = this;

            // create the required marker options
            that._markerOptions = { map: that.map, position: latlng };

            // extend the options onto the required options
            $.extend(that._markerOptions, that.options.marker.options);

            // create the marker
            var marker = new google.maps.Marker(that._markerOptions);

            // add the marker to a list of markers
            markers.push(marker);

            if (data && that.template) {
                that._infoWindow(marker, data);
            }

            // extend the map bounds to include this marker
            that.bounds.extend(latlng);

            if (fitBounds) {
                // recenter the map on the bounds
                that.map.fitBounds(that.bounds);
                // zoom if necessary. google maps
                // doesn't do this by default with fitBounds
                // because they are both async ops
                that._zoom();
            }
        },

        _zoom: function () {

            var that = this;

            if (that._mapOptions.zoom) {
                var listener = google.maps.event.addListener(that.map, "idle", function () {
                    that.map.setZoom(that._mapOptions.zoom);
                    google.maps.event.removeListener(listener);
                });
            }

        },

        _infoWindow: function (marker, data) {
            var that = this,
                html = kendo.render(that.template, [data]);

            var infoWindow = new google.maps.InfoWindow({
                content: html
            });

            google.maps.event.addListener(marker, "click", function () {
                infoWindow.open(that.map, marker);
            });
        },

        _dataSource: function () {

            var that = this;

            // returns the datasource OR creates one if using array or configuration object
            that.dataSource = kendo.data.DataSource.create(that.options.dataSource);

            // bind to the change event to refresh the widget
            that.dataSource.bind(CHANGE, function () {
                that.refresh();
            });

            if (that.options.autoBind) {
                that.dataSource.fetch();
            }
        }

    });

    ui.plugin(Map);

}));



/*
* YouTube
*/

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'kendo'], factory);
    } else {
        // Browser globals
        factory(window.jQuery, window.kendo);
    }
}(function ($, kendo) {

    // shorten references to variables. this is better for uglification
    var ui = kendo.ui,
      Widget = ui.Widget;

    var YouTube = Widget.extend({

        // method called when a new kendoYouTube widget is created
        init: function (element, options) {
            var that = this,
                id,
                _autoComplete,
                _listView,
                _pager,
                plugin;

            // base call to initialize widget
            Widget.fn.init.call(that, element, options);

            // append the element that will be the auto complete
            _autoComplete = $("<input style='width: 100%; font-size: 1.5em;' />");
            that.element.append(_autoComplete);

            // append the element that will be the pager
            _pager = $("<div class='k-pager-wrap' style='display: none'><div class='k-pager'></div></div>");
            that.element.append(_pager);

            // append the element that will be the list view
            _listView = $("<div></div>");
            that.element.append(_listView);

            // the google suggest datasource
            that.suggest = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "http://clients1.google.com/complete/search",
                        dataType: "jsonp"
                    },
                    parameterMap: function () {
                        return that._suggestParameterMap.call(that);
                    }
                },
                schema: {
                    parse: function (data) {
                        return that._suggestParse.call(that, data);
                    }
                },
                serverFiltering: true
            });

            // create the auto complete
            that.autoComplete = _autoComplete.kendoAutoComplete({
                dataSource: that.suggest,
                placeholder: that.options.placeholder,
                suggest: true,
                minLength: 3,
                dataTextField: "value",
                template: "<span>#= data.value #</span>",
                change: function (e) {
                    that._search(that, e);
                }
            }).data("kendoAutoComplete");

            // youtube datasource
            that.youtube = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "http://gdata.youtube.com/feeds/api/videos?max-results=10&v=2&alt=jsonc",
                        dataType: "jsonp"
                    },
                    parameterMap: function (options) {
                        return that._ytParameterMap.call(that, options);
                    }
                },
                schema: {
                    data: "data",
                    parse: function (data) {
                        return that._ytParse.call(that, data);
                    },
                    total: function (data) {
                        return that._ytTotal.call(that, data);
                    }
                },
                pageSize: 10,
                serverPaging: true
            });

            // results listview
            that.listView = _listView.kendoListView({
                autoBind: false,
                dataSource: that.youtube,
                template: that.options.template
            }).data("kendoListView");

            // remove the border from the listview
            _listView.css("border-width", "0");

            // pager widget
            that.pager = _pager.kendoPager({
                dataSource: that.youtube
            }).data("kendoPager");
        },

        // options that are avaiable to the user when initializing the widget
        options: {
            name: "YouTube",
            template: "<div style='padding: 10px;'>" +
                     "<div style='float: left;'>" +
                    "<a href='${player.default}' target='_blank'>" +
                          "<img height='90' width='120' src='${thumbnail.sqDefault}' alt='thumbnail' />" +
                      "</a>" +
                   "</div>" +
                    "<div style='margin-left: 130px; height: 90px;'>" +
                      "<h4 style='margin: 2px'>" +
                        "<a href='${player.default}' target='_blank'>${title}</a>" +
                      "</h4>" +
                      "<div style='font-size: .8em'>" +
                      "<p>${description}</p>" +
                    "</div>" +
                  "</div>" +
                   "</div>",
            placeholder: "Search YouTube"
        },

        // parse the return JSON from YouTube before the dataSource processes it
        _ytParse: function (data) {
            var result = { count: data.data.totalItems, data: [] };
            result.data = $.map(data.data.items, function (item) {
                item.description = item.description || "";
                item.description = item.description.length > 100 ? (item.description.substring(0, 100) + "...") : item.description;
                return item;
            });
            return result;
        },

        // map parameters on the requests
        _ytParameterMap: function (data) {

            var that = this;

            return {
                // the q is set to the current value of the autoComplete
                q: that.autoComplete.value(),
                // the start index dictates paging
                "start-index": data.skip === 0 ? 1 : data.skip
            };
        },

        // get the total number of records off of the response for the pager
        _ytTotal: function (data) {

            var that = this;

            data.count = data.count || 0;
            if (data.count > 0) {
                that.pager.element.show();
                return data.count;
            }
            else {
                // if there are no records, hide the pager and listview
                that.pager.element.hide();
                that.listView.element.hide();
            }
        },

        // parse the google suggest results before the dataSource gets them
        _suggestParse: function (data) {
            return $.map(data[1], function (item) {
                return { value: item[0] };
            });
        },

        // map parameters for the google suggest request
        _suggestParameterMap: function () {

            var that = this;

            return {
                // the q value is the autocomplete current value
                q: that.autoComplete.value(),
                // get suggest results for youtube only
                client: "youtube",
                nolabels: 't'
            };
        },

        _search: function (e) {

            var that = this;

            if (that.autoComplete.value().length > 0) {
                // read the remote source
                that.listView.dataSource.read();
                // show the pager and listview if they are hidden
                that.pager.element.show();
                that.listView.element.show();
            }
            else {
                that.listView.element.hide();
                that.pager.element.hide();
            }
        }
    });

    ui.plugin(YouTube);

}));
