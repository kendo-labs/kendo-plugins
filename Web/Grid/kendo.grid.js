/// <version>2013.06.27</version>
/// <summary>Works with the Kendo UI 2013 Q1 and jQuery 1.9.1</summary>

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
