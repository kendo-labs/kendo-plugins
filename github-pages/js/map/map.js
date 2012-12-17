window.APP = window.APP || {};

APP.maps = (function ($) {
	
	var pub = {};

	pub.index = function(container) {

		// load in the template
		APP.template.load("maps/index.html").then(function(html) {

			var dom = $(html);

			// for now just append this stuff to the DOM
			container.empty();
			container.append(dom);
			

			// maps code!
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
		});

	};

	pub.binding = function(container) {

		APP.template.load("maps/binding.html").then(function(html) {

			var dom = $(html);

			container.empty();
			container.append(dom);

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
                     { address: "Sea World" }];
         dom.find("#position_geocode").kendoMap({
            dataSource: data,
            map: {
               options: {
                  center: "Lake Sheen",
                  zoom: 10
               }
            }
         });

		});

	};

   pub.markers = function(container) {

      APP.template.load("maps/markers.html").then(function(data) {
         var dom = $(data);

         var data = [{ lat: 28.381642, lng: -81.56376, name: "Disney World" },
                  { lat: 28.474907, lng: -81.466316, name: "Universal Studios" },
                  { lat: 28.411785, lng: -81.460018, name: "Sea World" }];

         dom.find("#marker_templates").kendoMap({
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
         })

         container.empty();
         container.append(dom);
      });

   };

	return pub;

}(jQuery));