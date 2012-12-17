(function ($) {
	
	return kendo.Router = kendo.Class.extend({

		init: function(options) {

			var that = this;

			that.options = options;

		},

		start: function() {

			var that = this;

			kendo.history.bind("change", function() { that._change.call(that); });

			kendo.history.start(that.options);

			that._change();

		},

		get: function(path, handler) {
			
			var that = this;

			that._routes.add(path, handler);
		},

		_routes: {
			data: [],
			add: function(path, handler) {

				var that = this;

				that.remove(path);

				that.data.push({ name: path,  event: handler });

			},
			get: function(path) {
				
				var that = this;

				var results = $.grep(that.data, function (item) {
					return item.name === path;
				});

				if (results[0]) {
					return results[0];
				}
			},
			remove: function(path) {

				var that = this;

				that.data = $.map(that.data, function(item) {
					if (item.name !== path) {
						return item;
					}
				});
			} 
		},

		_change: function() {

			var that = this,
				path = kendo.history.current;

			// attempt to find the route
			var route = that._routes.get(path);

			if (route) {
				route.event();
			}

		}

	});

}(jQuery));