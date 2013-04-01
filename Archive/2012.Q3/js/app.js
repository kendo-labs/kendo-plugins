define([
  'jquery',
  'underscore',
  'kendo',
  'backbone',
  'bootstrap',
  'mylibs/router/router',
  'mylibs/views/header/header'
], function($, _, kendo, Backbone, bootstrap, router, Header){
  
  var pub = {};

  pub.init = function() {
    
    router.init();  
  
    var header = new Header();
    header.render();
  };

  return pub;

});