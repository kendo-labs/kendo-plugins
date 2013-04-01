define([
  'jquery',
  'underscore',
  'kendo',
  'backbone',
  '../../../../GoogleMaps/kendo.map',
  'text!mylibs/views/maps/templates/basic.html',
  'text!mylibs/views/maps/templates/binding.html',
  'text!mylibs/views/maps/templates/markers.html', 
], function($, _, kendo, Backbone, kendoMap, basic, binding, markers){
  
  var Basic = Backbone.View.extend({
    el: $("#container"),
    render: function() {
      
      this.$el.html(basic);
    
      $("#simple").kendoMap();

      // create a map centered over the US of A
      $("#usa").kendoMap({
        map: {
            options: {
               center: 'USA',
               zoom: 3
            }
          }
      });

      // customized map
      $("#customized").kendoMap({
        map: {
          options: {
            center: "The Grand Canyon",
            draggable: false,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.SATELLITE
          }
          }
      });
    }
  });

  var Binding = Backbone.View.extend({
    el: $("#container"),
    render: function() {
      this.$el.html(binding);

      var data = [{ latitude: 28.381642, longitude: -81.56376, name: "Disney World" },
            { latitude: 28.474907, longitude: -81.466316, name: "Universal Studios" },
            { latitude: 28.411785, longitude: -81.460018, name: "Sea World" }];
      
      $("#position").kendoMap({
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

      data = [{ address: "Disney World" }, { address: "Universal Studios" },
                      { address: "Sea World Florida" }];
      $("#position_geocode").kendoMap({
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
    }
  });

  var Markers = Backbone.View.extend({
    el: $("#container"),
    render: function() {
      this.$el.html(markers);

      var data = [{ lat: 28.381642, lng: -81.56376, name: "Disney World" },
                  { lat: 28.474907, lng: -81.466316, name: "Universal Studios" },
                  { lat: 28.411785, lng: -81.460018, name: "Sea World Florida" }];

      $("#animation").kendoMap({
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

      $("#infowindows").kendoMap({
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

      $("#fitbounds").kendoMap({
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
    }
  });

  return {
    Basic: Basic,
    Binding: Binding,
    Markers: Markers
  };

});