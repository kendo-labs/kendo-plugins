window.APP = window.APP || {};

APP.maps = (function ($) {
	
	var views = {},
		pub = {};

	pub.index = function(container) {

		// create the view
		views.index = views.index || new kendo.View(container);
		$.get("templates/maps/index.html", function(html) {
			var dom = views.index.render(html);

			dom.find("#simple").kendoMap();

			// create a map centered over the US of A
			dom.find("#usa").kendoMap({
				map: {
			      options: {
			         center: 'USA',
			         zoom: 3
			      }
			   	}
			});

			// customized map
			dom.find("#customized").kendoMap({
				map: {
					options: {
						center: "The Grand Canyon",
						draggable: false,
						disableDefaultUI: true,
						mapTypeId: google.maps.MapTypeId.SATELLITE
					}
			   	}
			});
		});
	};

	pub.binding = function(container) {

		views.binding = views.binding || new kendo.View(container);
		$.get("templates/maps/binding.html", function(html) {
			var dom = views.binding.render(html);

			var data = [{ latitude: 28.381642, longitude: -81.56376, name: "Disney World" },
			 			{ latitude: 28.474907, longitude: -81.466316, name: "Universal Studios" },
			 			{ latitude: 28.411785, longitude: -81.460018, name: "Sea World" }];
			dom.find("#position").kendoMap({
			   dataSource: data,
			   latField: "latitude",
			   lngField: "longitude",
			   map: {
			   	options: {
			   		center: {
			   			lat: 28.434783,
			   			lng: -81.518497
			   		},
			   		zoom: 10
			   	}
			   }
			});

			var data = [{ address: "Disney World" }, { address: "Universal Studios" },
                     	{ address: "Sea World Florida" }];
	         dom.find("#position_geocode").kendoMap({
	            dataSource: data,
	            map: {
	               options: {
	                  center: "Lake Sheen",
	                  zoom: 10
	               }
	            },
	            marker: {
	            	template: "<span>#: address #</span>"
	            }
	         });

		});
	};

   	pub.markers = function(container) {

      views.markers = views.markers || new kendo.View(container);
      $.get("templates/maps/markers.html", function(data) {
      	var dom = views.markers.render(data);

	    var data = [{ lat: 28.381642, lng: -81.56376, name: "Disney World" },
	                { lat: 28.474907, lng: -81.466316, name: "Universal Studios" },
	                { lat: 28.411785, lng: -81.460018, name: "Sea World Florida" }];

		dom.find("#animation").kendoMap({
		dataSource: data,
		  map: {
		    options: {
		            center: {
		                lat: 28.434783,
		                lng: -81.518497
		            },
		            zoom: 10
		          }
		      },
		    marker: {
				options: {
					animation: google.maps.Animation.DROP,
					draggable: true
				}
		    }
		 });

		dom.find("#infowindows").kendoMap({
			dataSource: data,
				map: {
					options: {
	             		center: {
	               			lat: 28.434783,
	                		lng: -81.518497
	             		},
	            		zoom: 10
	           		}
	        	},
	        marker: {
	           template: "<span>#: name #</span>"
	        }
	    });

		var example = dom.find("#fitbounds").kendoMap({
			dataSource: data,
			map: {
				options: {
            		zoom: 10
           		}
        	},
        	fitBounds: true,
	        marker: {
	           template: "<span>#: name #</span>"
	        }
	    }).data("kendoMap");



      });
   	};

	return pub;

}(jQuery));