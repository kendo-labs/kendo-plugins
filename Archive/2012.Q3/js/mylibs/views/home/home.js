define([
  'jquery',
  'underscore',
  'kendo',
  'backbone',
  'text!mylibs/views/home/templates/home.html'
], function($, _, kendo, Backbone, home){

  var Home = Backbone.View.extend({
    el: $("#container"),
    render: function() {
      this.$el.html(home);
    }
  });

  return Home;

});