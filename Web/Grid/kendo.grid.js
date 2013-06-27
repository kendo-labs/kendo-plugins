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
            }
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
        }
    });
    kendo.ui.plugin(ExtGrid);
})(window.kendo.jQuery, window.kendo);
