(function (kendo, $) {
    var DropDownTreeView = kendo.ui.Widget.extend({
        /// <signature>
        ///   <summary>
        ///   Combine the DropDownList and TreeView widgets to create a DropDownTreeView widget.
        ///   </summary>
        ///   <author>John DeVight</author>
        /// </signature>

        _uid: null,
        _treeview: null,
        _dropdown: null,

        init: function (element, options) {
            /// <signature>
            ///   <summary>
            ///   Initialize the widget.
            ///   </summary>
            /// </signature>

            var that = this;

            kendo.ui.Widget.fn.init.call(that, element, options);

            // Generate a unique id.
            that._uid = new Date().getTime();

            // Append the html to the "root" element for the DropDownList and TreeView widgets.
            $(element).append(kendo.format("<input id='extDropDown{0}' class='k-ext-dropdown'/>", that._uid));
            $(element).append(kendo.format("<div id='extTreeView{0}' class='k-ext-treeview' style='z-index:1;'/>", that._uid));

            // Create the DropDownList.
            that._dropdown = $(kendo.format("#extDropDown{0}", that._uid)).kendoDropDownList({
                dataSource: [{ text: "", value: "" }],
                dataTextField: "text",
                dataValueField: "value",
                open: function (e) {
                    // If the TreeView is not visible, then make it visible.
                    if (!$treeviewRootElem.hasClass("k-custom-visible")) {
                        // Position the TreeView so that it is below the dropdown.
                        $treeviewRootElem.css({
                            "top": $dropdownRootElem.position().top + $dropdownRootElem.height(),
                            "left": $dropdownRootElem.position().left
                        });
                        // Display the TreeView.
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

            // Create the TreeView.
            that._treeview = $(kendo.format("#extTreeView{0}", that._uid)).kendoTreeView(options.treeview).data("kendoTreeView");
            that._treeview.bind("select", function (e) {
                // When a node is selected, display the text for the node in the DropDownList and hide the TreeView.
                $dropdownRootElem.find("span.k-input").text($(e.node).children("div").text());
                $treeviewRootElem.slideToggle('fast', function () {
                    $treeviewRootElem.removeClass("k-custom-visible");
                    that.trigger("select", e);
                });
            });

            var $treeviewRootElem = $(that._treeview.element).closest("div.k-treeview");

            // Hide the TreeView.
            $treeviewRootElem
                .width($dropdownRootElem.width())
                .css({
                    "border": "1px solid grey",
                    "display": "none",
                    "position": "absolute",
                    "background-color": that._dropdown.list.css("background-color")
                });

            $(document).click(function (e) {
                // Ignore clicks on the TreeView.
                if ($(e.target).closest("div.k-treeview").length == 0) {
                    // If visible, then close the TreeView.
                    if ($treeviewRootElem.hasClass("k-custom-visible")) {
                        $treeviewRootElem.slideToggle('fast', function () {
                            $treeviewRootElem.removeClass("k-custom-visible");
                        });
                    }
                }
            });
        },

        dropDownList: function () {
            /// <signature>
            ///   <summary>
            ///   Return a reference to the DropDownList widget.
            ///   </summary>
            /// </signature>

            return this._dropdown;
        },

        treeview: function () {
            /// <signature>
            ///   <summary>
            ///   Return a reference to the TreeView widget.
            ///   </summary>
            /// </signature>

            return this._treeview;
        },

        options: {
            name: "DropDownTreeView"
        }
    });
    kendo.ui.plugin(DropDownTreeView);

})(window.kendo, window.kendo.jQuery);