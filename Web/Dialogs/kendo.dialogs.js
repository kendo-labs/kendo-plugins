(function (kendo, $) {
    var Dialog = kendo.ui.Window.extend({
        /// <signature>
        ///   <summary>
        ///   Window widget with buttons fixed and centered along the bottom.  The content is contained in a scrollable div.
        ///   </summary>
        ///   <author>John DeVight</author>
        /// </signature>

        _buttonTemplate: kendo.template('<div class="k-ext-dialog-buttons" style="position:absolute; bottom:10px; text-align:center; width:#= parseInt(width) - 14 #px;"><div style="display:inline-block"># $.each (buttons, function (idx, button) { # <button class="k-button" style="margin-right:5px; width:100px;">#= button.name #</button> # }) # </div></div>'),
        _contentTemplate: kendo.template('<div class="k-ext-dialog-content" style="height:#= parseInt(height) - 55 #px;; width:#= parseInt(width) - 14 #px;overflow:auto;">'),

        init: function (element, options) {
            /// <signature>
            ///   <summary>
            ///   Initialize the dialog.
            ///   </summary>
            /// </signature>

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
            /// <signature>
            ///   <summary>
            ///   Adjust the width and height for the buttons and content within the Window.
            ///   </summary>
            /// </signature>

            var that = this;
            var $dialog = $(that.element);
            var width = $dialog.width();
            var height = $dialog.height();
            $dialog.parent().find(".k-ext-dialog-buttons").width(width);
            $dialog.parent().find(".k-ext-dialog-content").width(width).height(height - 39);
        },

        options: {
            name: "Dialog"
        }
    });
    kendo.ui.plugin(Dialog);



    kendo.ui.AlertDialog = {
        /// <signature>
        ///   <summary>
        ///   Show / Hide an Alert Dialog.
        ///   </summary>
        ///   <author>John DeVight</author>
        /// </signature>

        show: function (options) {
            /// <signature>
            ///   <summary>
            ///   Show the Alert Dialog.
            ///   </summary>
            /// </signature>

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
                dialog = $("#extAlertDialog").kendoDialog(options).data("kendoDialog");
                $("#extAlertDialog").parent().find("div.k-window-titlebar div.k-window-actions").empty();

                // Display and center the alert dialog.
                dialog.center().open();
            });
        },

        hide: function () {
            /// <signature>
            ///   <summary>
            ///   Hide the Alert Dialog.
            ///   </summary>
            /// </signature>

            $("#extAlertDialog").data("kendoDialog").close();
        }
    };

})(window.kendo, window.kendo.jQuery);