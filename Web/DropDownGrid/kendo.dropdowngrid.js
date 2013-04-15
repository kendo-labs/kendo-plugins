/// <version>2013.04.14</version>
/// <summary>Works with the Kendo UI 2013 Q1 and jQuery 1.9.1</summary>

(function (kendo, $) {
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
})(window.kendo, window.kendo.jQuery);
