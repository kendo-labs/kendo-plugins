define([
  'jquery',
  'underscore',
  'kendo',
  'backbone',
  'mylibs/views/maps/maps',
  'mylibs/views/home/home',
  'mylibs/views/youtube/youtube'
], function($, _, kendo, Backbone, maps, Home, YouTube){
  
	var Router = Backbone.Router.extend({
		routes: {
			'maps': 'maps',
      'maps/binding': 'maps.binding',
      'maps/markers': 'maps.markers',
			'youtube': 'youtube',

      // Default
      '*path': 'home'
		}
	});

  var pub = {};

  pub.init = function() {
    var router = new Router();
    
    router.on('route:home', function() {
      var View = new Home();
      View.render();
    });

    router.on('route:maps', function() {
      var View = new maps.Basic();
      View.render();
    });

    router.on('route:maps.binding', function() {
      var View = new maps.Binding();
      View.render();
    });

    router.on('route:maps.markers', function() {
      var View = new maps.Markers();
      View.render();
    });

    router.on('route:youtube', function() {
      var View = new YouTube();
      View.render();
    });

    Backbone.history.start();
  };

  return pub;

});