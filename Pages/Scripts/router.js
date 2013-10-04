KendouiPlugins.Pages.Router = function (kendo, $) {
    var currentRoute = "/";
    var _router = new kendo.Router({
        change: function(e) {
            currentRoute = e.url;
        }
    });

    var _routes = [
        { route: "/GettingStarted", root: "Pages/GettingStarted", title: "Getting Started" },
        { route: "/ContextMenu", root: "Web/ContextMenu", title: "ContextMenu" },
        { route: "/Dialogs", root: "Web/Dialogs", title: "Standard Message Dialogs" },
        { route: "/DropDownGrid", root: "Web/DropDownGrid", title: "DropDownGrid" },
        { route: "/DropDownTreeView", root: "Web/DropDownTreeView", title: "DropDownTreeView" },
        { route: "/Grid", root: "Web/Grid", title: "Grid" },
        { route: "/Textbox", root: "Web/Textbox", title: "Textbox" },
        { route: "/GoogleMaps", root: "Web/GoogleMaps", title: "Google Maps" }
    ];

    addRoute = function (args) {
        _router.route(kendo.format("{0}", args.route), function (plugin) {
            $(kendo.format("#navigationTreeView li.k-item[data-hash='{0}'] span", args.route)).addClass("k-state-selected");

            var completed = {
                overview: false,
                examples: false,
                documentation: false
            };

            var loadCompleted = function () {
                if (completed.overview === true &&
                    completed.examples === true &&
                    completed.documentation === true) {

                    if (navigator.appVersion.indexOf("MSIE 8.0") == -1) {
                        Rainbow.color();
                    }

                    setTimeout(function () {
                        $("#contentTabStrip").data("kendoTabStrip").select(0);
                        KendouiPlugins.Pages.App.resize(true);
                    }, 100);
                }
            };

            // Load the overview for the plugin.
            $(".overview-tab").load(kendo.format("{0}/overview.html?_={1}", args.root, new Date().getTime()), function (response, status, xhr) {
                if (status == "error") {
                    $(".overview-tab").empty();
                    $("#contentTabStrip").hide();
                } else {
                    $("#contentTabStrip").show();
                }
                completed.overview = true;
                loadCompleted();
            });

            // Load the examples for the plugin.
            $(".examples-tab").load(kendo.format("{0}/examples.html?_={1}", args.root, new Date().getTime()), function (response, status, xhr) {
                if (status == "error") {
                    $(".examples-tab").empty();
                    $($("#contentTabStrip li")[1]).hide();
                } else {
                    $($("#contentTabStrip li")[1]).show();
                }
                completed.examples = true;
                loadCompleted();
            });

            // Load the documentation for the plugin.
            $(".documentation-tab").load(kendo.format("{0}/documentation.html?_={1}", args.root, new Date().getTime()), function (response, status, xhr) {
                if (status == "error") {
                    $(".documentation-tab").empty();
                    $($("#contentTabStrip li")[2]).hide();
                } else {
                    $($("#contentTabStrip li")[2]).show();
                }
                completed.documentation = true;
                loadCompleted();
            });
        });
    };

    $.each(_routes, function (idx, route) {
        addRoute(route);
    });

    var start = function () {
        _router.start();

        if (window.location.hash.length === 0) {
            window.location.href = kendo.format("#{0}", _routes[0].route);
        }
    };

    var url = function () {
        return currentRoute;
    }

    return {
        start: start,
        url: url
    };

}(window.kendo, jQuery);

jQuery(function () {
    KendouiPlugins.Pages.Router.start();
});
