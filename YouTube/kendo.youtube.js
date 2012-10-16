(function($) {
	
	// shorten references to variables. this is better for uglification
	var kendo = window.kendo,
		ui = kendo.ui,
		Widget = ui.Widget

	var YouTube = Widget.extend({
		
		// composited widgets
		autoComplete: {},
		listView: {},
		pager: {},
		
		// method called when a new kendoYouTube widget is created
		init: function(element, options) {
			var that = this, 
					   id, 
					   _autoComplete,
					   _listView,
					   _pager, 
					   plugin,
					   options;

		    // base call to initialize widget
            Widget.fn.init.call(that, element, options);

			options = that.options;
		
			// append the element that will be the auto complete
		 	_autoComplete = $("<input style='width: 100%; font-size: 1.5em;' />");
			that.element.append(_autoComplete);
			
			// append the element that will be the pager
			_pager = $("<div class='k-pager-wrap' style='display: none'><div class='k-pager'></div></div>");
			that.element.append(_pager);
			
			// append the element that will be the list view
			_listView = $("<div></div>");
			that.element.append(_listView);
			
			// the google suggest datasource
			that.suggest = new kendo.data.DataSource({
				transport: {
					read: {
						url: "http://clients1.google.com/complete/search",
						dataType: "jsonp",
					},
					parameterMap: that._suggestParameterMap
				},	
				schema: {
					parse: that._suggestParse
				},
				serverFiltering: true
			});
			
			// create the auto complete
			autoComplete = _autoComplete.kendoAutoComplete({
				dataSource: that.suggest,
				placeholder: options.placeholder,
				suggest: true,
				minLength: 3,
				dataTextField: "value",
				template: "<span>#= data.value #</span>",
				change: that._search
			}).data("kendoAutoComplete");
		
			// youtube datasource
			that.youtube = new kendo.data.DataSource({
			    transport: {
			      read: {
			        url: "http://gdata.youtube.com/feeds/api/videos?max-results=10&v=2&alt=jsonc",
			        dataType: "jsonp"
			      },
			      parameterMap: that._ytParameterMap
			    },
			    schema: {
					data: "data",
					parse: that._ytParse,
					total: that._ytTotal
			    },
				pageSize: 10,
				serverPaging: true
			});
		
			// results listview
 			listView = _listView.kendoListView({
				autoBind: false,
				dataSource: that.youtube,
				template: options.template
			}).data("kendoListView"); 
		
			// remove the border from the listview
			_listView.css("border-width", "0");
			
			// pager widget
			pager = _pager.kendoPager({
				dataSource: that.youtube
			}).data("kendoPager");
		},
		
		// options that are avaiable to the user when initializing the widget
		options: {
			name: "YouTube",
			template: "<div style='padding: 10px;'>" +
					     "<div style='float: left;'>" +
						  "<a href='${player.default}' target='_blank'>" +
		 						    "<img height='90' width='120' src='${thumbnail.sqDefault}' alt='thumbnail' />" +
							  "</a>" +
						 "</div>" +
					    "<div style='margin-left: 130px; height: 90px;'>" +
					      "<h4 style='margin: 2px'>" +
					        "<a href='${player.default}' target='_blank'>${title}</a>" +
					      "</h4>" +
					      "<div style='font-size: .8em'>" +
						    "<p>${description}</p>" + 
						  "</div>" +
						"</div>" +
					   "</div>",
			placeholder: "Search YouTube"
		},
		
		// parse the return JSON from YouTube before the dataSource processes it
		_ytParse: function(data) {
			var result = { count: data.data.totalItems, data: [] };
			result.data = $.map(data.data.items, function(item) {
				item.description = item.description || "";
				item.description = item.description.length > 100 ? (item.description.substring(0,100) + "...") : item.description
				return item;
			});
			return result;
		},

		// map parameters on the requests
		_ytParameterMap: function(data) {
			return {
			  // the q is set to the current value of the autoComplete
	          q: autoComplete.value(),
	          // the start index dictates paging
			  "start-index": data.skip === 0 ? 1 : data.skip
	        }
		},

		// get the total number of records off of the response for the pager
		_ytTotal: function(data) {
			data.count = data.count || 0;
			if (data.count > 0) {
				pager.element.show();
				return data.count;
			}
			else {
				// if there are no records, hide the pager and listview
				pager.element.hide();
				listView.element.hide();
			}
		},

		// parse the google suggest results before the dataSource gets them
	    _suggestParse: function(data) {
			return $.map(data[1], function(item) {
				return { value: item[0] }
			});
		},

		// map parameters for the google suggest request
		_suggestParameterMap: function(){
			return {
				// the q value is the autocomplete current value
				q: autoComplete.value(),
				// get suggest results for youtube only
				client: "youtube",
				nolabels: 't'
			}
		},

		_search: function(e) {
			if (this.value().length > 0) {
				// read the remote source
				listView.dataSource.read();
				// show the pager and listview if they are hidden
				pager.element.show();
				listView.element.show();
			}
			else {
				listView.element.hide();
				pager.element.hide();
			}
		}
	});
	
	ui.plugin(YouTube);
	
})(jQuery);


