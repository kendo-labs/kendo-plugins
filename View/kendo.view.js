(function ($) {

	kendo.xhr = function(path) {
		var that = this,
		dfr = $.Deferred();

		$.get(path, dfr.resolve);

		return dfr.promise();
	};

	return kendo.View = kendo.Class.extend({

		init: function(container, template) {

			var that = this;

			that.container = container instanceof jQuery ? container : $(container);
		},

		render: function(template, data) {
			var that = this;

			that.container.empty();
			
			that.template = that.template || kendo.template(template || "<div></div>");

			return that.container.html(that.template(data || {}));
		}
	});

}(jQuery));