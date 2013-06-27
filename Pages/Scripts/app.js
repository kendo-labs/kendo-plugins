KendouiPlugins.Pages.App = function (kendo, $) {
    init = function () {
        $("#mainLayout").kendoExtBorderLayout({
            items: [
            {
                title: "Header",
                region: "north",
                content: "#headerPane",
                showTitlebar: false,
                resizable: false,
                size: "50px"
            }, {
                title: "Navigation",
                region: "west",
                content: "#navigationPane",
                collapsible: true,
                size: "275px"
            }, {
                title: "Source Code",
                region: "east",
                content: "#sourceCodePane",
                collapsible: true,
                size: "450px"
            }, {
                region: "center",
                content: "#contentPane"
            }]
        });

        $("#navigationTreeView").kendoTreeView({
            select: function (e) {
                var $node = $(e.node);
                var hash = $node.attr("data-hash");
                if (hash != undefined) {
                    window.location.hash = hash;
                }
            }
        }).data("kendoTreeView").expand(".k-item");

        $("#contentTabStrip").kendoTabStrip().data("kendoTabStrip").select(0);

        $(".pane-content").show();
    };

    return {
        init: init
    };
}(window.kendo, jQuery);

jQuery(function () {
    KendouiPlugins.Pages.App.init();
});