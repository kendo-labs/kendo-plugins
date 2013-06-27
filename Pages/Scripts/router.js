KendouiPlugins.Pages.Router = function (kendo, $) {
    var _router = new kendo.Router();

    var _routes = [
        { route: "/GettingStarted", root: "Pages/GettingStarted", title: "Getting Started" },
        { route: "/ContextMenu", root: "Web/ContextMenu", title: "ContextMenu" },
        { route: "/Dialogs", root: "Web/Dialogs", title: "Standard Message Dialogs" },
        { route: "/DropDownGrid", root: "Web/DropDownGrid", title: "DropDownGrid" },
        { route: "/DropDownTreeView", root: "Web/DropDownTreeView", title: "DropDownTreeView" },
        { route: "/Grid", root: "Web/Grid", title: "Grid" }
    ];

    addRoute = function (args) {
        _router.route(kendo.format("{0}", args.route), function (plugin) {
            $(kendo.format("#navigationTreeView li.k-item[data-hash='{0}'] span", args.route)).addClass("k-state-selected");

            // Load the overview for the plugin.
            $(".overview-tab").load(kendo.format("{0}/overview.html", args.root), function (response, status, xhr) {
                var $tab = $($("#contentTabStrip ul.k-tabstrip-items li.k-item")[0]);
                if (status == "error") {
                    $tab.addClass("hidden-tab");
                } else {
                    $tab.removeClass("hidden-tab");
                }

                // Load the examples for the plugin.
                $(".examples-tab").load(kendo.format("{0}/examples.html", args.root), function (response, status, xhr) {
                    var $tab = $($("#contentTabStrip ul.k-tabstrip-items li.k-item")[1]);
                    if (status == "error") {
                        $tab.addClass("hidden-tab");
                    } else {
                        $tab.removeClass("hidden-tab");
                    }

                    // Load the documentation for the plugin.
                    $(".documentation-tab").load(kendo.format("{0}/documentation.html", args.root), function (response, status, xhr) {
                        var $tab = $($("#contentTabStrip ul.k-tabstrip-items li.k-item")[2]);
                        if (status == "error") {
                            $tab.addClass("hidden-tab");
                        } else {
                            $tab.removeClass("hidden-tab");
                        }

                        // Show / Hide content tabstrip.
                        if ($("#contentTabStrip .hidden-tab").length == 3) {
                            $("#contentHeading").hide();
                            $("#contentTabStrip").hide();
                        } else {
                            $("#contentHeading").show().text(kendo.format("{0}", args.title));
                            $("#contentTabStrip").show();

                            setTimeout(function () {
                                $("#contentTabStrip").data("kendoTabStrip").select(0);
                            });

                            if (navigator.appVersion.indexOf("MSIE 8.0") == -1) {
                                Rainbow.color();
                            }
                        }
                    });
                });
            });
        });
    };

    $.each(_routes, function (idx, route) {
        addRoute(route);
    });

    var start = function (route) {
        _router.start();
        _router.navigate(route);
    };

    var start = function () {
        _router.start();
    };

    return {
        start: start
    };
}(window.kendo, jQuery);

jQuery(function () {
    KendouiPlugins.Pages.Router.start();
});
