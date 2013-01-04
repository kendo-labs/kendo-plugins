// Uses AMD or browser globals to create a jQuery plugin.

// It does not try to register in a CommonJS environment since
// jQuery is not likely to run in those environments.
// See jqueryPluginCommonJs.js for that version.

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'kendo'], factory);
    } else {
        // Browser globals
        factory(window.jQuery, window.kendo);
    }
}(function ($, kendo) {
    
    // shorten references to variables. this is better for uglification 
    var ui = kendo.ui,
    Widget = ui.Widget,
    CHANGE = "change",
    markers = [],
    infoWindows = [];

    var Map = Widget.extend({

        init: function(element, options) {
            
            var that = this;

            // before we initialize the widget, figure out if the 
            // google maps script has been included.
            if (!window.google) {
                kendo.logToConsole("It doesn't appear that you have Google Maps library loaded.");
            }
            else {
                // base call to widget initialization
                Widget.fn.init.call(this, element, options);

                // compile the marker template if applicable
                if (that.options.marker.template)
                    that.template = kendo.template(that.options.marker.template);

                // create the default maps options
                that._mapOptions = {
                    zoom: 8,
                    center: new google.maps.LatLng("36.166667","-86.783333"),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                // map creation is a deferred for geocoding
                that._createMap().then(function() {
                    that._dataSource();
                });
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
            addressField: "address",
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
                fitBounds = false;

            // make sure the necessary google objects exist
            that.bounds = new google.maps.LatLngBounds();

            // iterate through the results set and drop markers
            // this isn't the fastest way to loop, but it's the cleanest
            $.each(view, function(index, item) {

                // if this is the last item, we want to fit the bounds if applicable
                if ( index === view.length - 1 && that.options.fitBounds ) {
                    fitBounds = true;
                }

                // check the address field, if it's populated, try and 
                // geocode it
                // TODO: Function in a loop? Is there a better way?
                if (item[that.options.addressField]) {
                    that.geocode(item[that.options.addressField]).then(function(results) {
                        that.dropMarker(results[0].geometry.location, item, fitBounds);
                    });
                }
                else {
                    // create a new latlng object
                    var latlng = new google.maps.LatLng(item[that.options.latField], item[that.options.lngField]);
                    that.dropMarker(latlng, item, fitBounds);
                }
            });
        },

        _createMap: function() {

            var that = this,
                options = that.options.map.options,
                dfr = $.Deferred();

            $.extend(that._mapOptions, options);

            if (options.center) {
                // its possible that we passed a string as a center point for the map
                // which means we should try and geocode it
                if ($.type(options.center) !== "string") {
                    // create the map. if an array of elements are passed, only the first
                    // will be used.
                    that._mapOptions.center = new google.maps.LatLng(options.center.lat, options.center.lng);
                    that.map = new google.maps.Map(that.element[0], that._mapOptions);
                    dfr.resolve();
                }
                else {
                    that.geocode(options.center).then(function(results) {
                        that._mapOptions.center = results[0].geometry.location;
                        that.map = new google.maps.Map(that.element[0], that._mapOptions);
                        dfr.resolve();
                    });
                }
            }
            else {
                that.map = new google.maps.Map(that.element[0], that._mapOptions);
                dfr.resolve();
            }
        
            return dfr.promise();        
        },

        geocode: function(address) {
            var that = this,
            dfr = $.Deferred();
                
            that._geocoder = that._geocoder || new google.maps.Geocoder();

            that._geocoder.geocode({ 'address': address }, dfr.resolve);

            return dfr.promise();
        },

        dropMarker: function(latlng, data, fitBounds) {
            var that = this;

            // create the required marker options
            that._markerOptions = { map: that.map, position: latlng };

            // extend the options onto the required options
            $.extend(that._markerOptions, that.options.marker.options);

            // create the marker
            var marker = new google.maps.Marker(that._markerOptions);  

            // add the marker to a list of markers
            markers.push(marker);

            if (data && that.template) {
                that._infoWindow(marker, data);         
            }

            // extend the map bounds to include this marker
            that.bounds.extend(latlng);

            if (fitBounds) {    
                // recenter the map on the bounds
                that.map.fitBounds(that.bounds);
                // zoom if necessary. google maps
                // doesn't do this by default with fitBounds
                // because they are both async ops
                that._zoom();
            }
        },

        _zoom: function() {

            var that = this;

            if (that._mapOptions.zoom) {
                var listener = google.maps.event.addListener(that.map, "idle",  function() { 
                    that.map.setZoom(that._mapOptions.zoom); 
                    google.maps.event.removeListener(listener); 
                });
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

}));