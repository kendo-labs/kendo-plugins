KendouiPlugins.Pages.App = function (kendo, $) {
    var _height = 0;
    var _treeView = null;
    var _tabStrip = null;

    init = function () {
		$("#mainLayout").kendoSplitter({
		    orientation: "vertical",
		    panes: [
                { size: 40, resizable: false },
                { resizable: false }
		    ]
		});

		$("#mainPane").kendoSplitter({
		    panes: [
                { size: 200 }
		    ]
		});

		_treeView = $("#navigationTreeView").kendoTreeView({
		    select: function (e) {
		        var $node = $(e.node);
		        var hash = $node.attr("data-hash");
		        if (hash != undefined) {
		            window.location.hash = hash;
		        }
		    }
		}).data("kendoTreeView");
		_treeView.expand(".k-item");
		_treeView.element.show();

		_tabStrip = $("#contentTabStrip").kendoTabStrip({
		    activate: function() {
		        $(document).trigger(KendouiPlugins.Pages.Router.url());

		        setTimeout(function () {
		            KendouiPlugins.Pages.App.resize(true);
		        });
		    }
		}).data("kendoTabStrip");
		_tabStrip.select(0);

		resize();
    };

    resize = function (force) {
        setTimeout(function () {
            var height = $(document).height();

            if (height != _height || force) {
                _height = height;

                $("#mainLayout").height(_height - 10);
                $("#mainLayout").data("kendoSplitter").trigger("resize");

                $("#contentTabStrip .k-content").css({
                    height: _height - 92
                });
            }

            if (typeof force === "undefined") {
                resize();
            }
        });
    };

    return {
        init: init,
        resize: resize
    };
}(window.kendo, jQuery);

jQuery(function () {
    KendouiPlugins.Pages.App.init();
});