define([
  'jquery',
  'underscore',
  'kendo',
  'backbone',
  'text!mylibs/views/header/templates/menu.html'
], function($, _, kendo, Backbone, menu){
  
  var Header = Backbone.View.extend({
    el: "#header",
    render: function() {
      this.$el.append(menu);
    }
  });

  return Header;

});