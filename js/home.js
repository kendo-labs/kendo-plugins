window.APP = window.APP || {};

APP.home = (function ($) {
	
	var views = {}, 
		pub = {};

	pub.index = function(container, templateUrl) {

		views.index = views.index || new kendo.View(container);

		$.get(templateUrl, function(html) {
			var dom = views.index.render(html);
		});

	};

	return pub;

}(jQuery));