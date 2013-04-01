// Filename: main.js

// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
  shim: {
    'kendo': {
      deps: ['jquery'],
      exports: 'kendo'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'bootstrap': {
      deps: ['jquery']
    }
  },
  paths: {
    jquery: 'http://code.jquery.com/jquery-1.8.2.min',
    underscore: 'libs/underscore/underscore-min',
    kendo: 'http://cdn.kendostatic.com/2012.3.1114/js/kendo.all.min',
    backbone: 'libs/backbone/backbone-min',
    bootstrap: 'libs/bootstrap/bootstrap.min'
  }
});

require([
  'app'
], function(app){
  
  app.init();

});