(function ($) {

    // shorten references to variables. this is better for uglification 
    var kendo = window.kendo,
    ui = kendo.ui,
    Widget = ui.Widget,
    CHANGE = "change",
    geocoder = new google.maps.Geocoder(),
    map;

    var Map = Widget.extend({

        init: function(element, options) {
            
            var that = this;

            // before we initialize the widget, figure out if the 
            // google maps script has been included.
            if (!window.google.maps) {
                kendo.logToConsole("It doesn't appear that you have Google Maps library loaded.");
            }
            else {
                // base call to widget initialization
                Widget.fn.init.call(this, element, options);

                // compile the marker template if applicable
                if (that.options.marker.template)
                    that.template = kendo.template(that.options.marker.template);

                that._createMap();

                that._dataSource();
            }
        },

        options: {    
             // the name is what it will appear as off the kendo namespace(i.e. kendo.ui.YouTube). 
             // The jQuery plugin would be jQuery.fn.kendoYouTube.
             name: "Map",
            // other options go here
            autoBind: true,
            latField: "lat",
            lngField: "lng",
            titleField: "title",
            fitBounds: false,
            map: {
                options: {}
            },
            marker: {
                options: {},
                template: null
            }
        },

        refresh: function() {

            var that = this,
                view = that.dataSource.view(),
                bounds = bounds || new google.maps.LatLngBounds();

            // iterate through the results set and drop markers
            var length = view.length;
            for (var i = 0; i < length; i++) {
                // create the lat lng object
                var latlng = new google.maps.LatLng(view[i][that.options.latField], view[i][that.options.lngField]);

                // extend the map bounds to include this marker
                bounds.extend(latlng);

                // drop a marker
                that.dropMarker(latlng, view[i]);
            }

            // recenter the map on the bounds
            if (that.options.fitBounds) {
                that.map.fitBounds(bounds);
            }
        
        },

        _createMap: function() {

            var that = this,
                options = that.options.map.options

            // some options are needed by default
            options.zoom = options.zoom || 8;
            options.center = options.center || new google.maps.LatLng("36.166667","-86.783333");
            options.mapTypeId = options.mapTypeId || google.maps.MapTypeId.ROADMAP;

            // create the map. if an array of elements are passed, only the first
            // will be used.
            that.map = new google.maps.Map(that.element[0], options);

        },

        _geocode: function(address, callback) {
            geocode.geocode({ 'address': address },
                function(results, status) {
                    callback();
                }
            );
        },

        dropMarker: function(latlng, data) {
            var that = this,
                markerSettings = that.options.marker;

            // add a few things onto the options object
            markerSettings.options.map = that.map;
            markerSettings.options.position = latlng;

            var marker = new google.maps.Marker(markerSettings.options);  

            if (that.template) {
                that._infoWindow(marker, data);         
            }
        },

        _infoWindow: function(marker, data) {
            var that = this,
                html = kendo.render(that.template, [ data ]);

            var infoWindow = new google.maps.InfoWindow({
                content: html
            });

            google.maps.event.addListener(marker, "click", function() {
                infoWindow.open(that.map, marker);
            });
        },

        _dataSource: function() {

            var that = this;

            // returns the datasource OR creates one if using array or configuration object
            that.dataSource = kendo.data.DataSource.create(that.options.dataSource);

            // bind to the change event to refresh the widget
            that.dataSource.bind(CHANGE, function() {
                that.refresh();
            });

            if (that.options.autoBind) {    
                that.dataSource.fetch();
            }
        }

    });

    ui.plugin(Map);

})(jQuery);