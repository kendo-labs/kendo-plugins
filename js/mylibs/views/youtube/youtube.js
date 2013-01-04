define([
  'jquery',
  'underscore',
  'kendo',
  'backbone',
  'text!mylibs/views/youtube/templates/youtube.html',
  'text!mylibs/views/youtube/templates/listview.html',
  'text!mylibs/views/youtube/templates/window.html',
  '../../../../YouTube/kendo.youtube'
], function($, _, kendo, Backbone, youtube, listview, popup){
  
  var YouTube = Backbone.View.extend({
    el: $("#container"),
    render: function() {
      this.$el.html(youtube);

      $("#youtube_simple").kendoYouTube();

      $("#youtube_template").kendoYouTube({
        template: listview
      });

      // create the popup window for the result
      var win = $("<div></div>").kendoWindow({
          visible: false,
          modal: true,
          deactivate: function(e) {
              $(this.element).html("");
          }
      }).data("kendoWindow");

      // get the template for the popup
      popupTemplate = kendo.template(popup);

      // attach an event listener to every youtube thumb which will open the popup
      $("#youtube_template").on("click", ".k-youtube-popup", function(e) {

          var id = $(e.currentTarget).data("id");
          var title = $(e.currentTarget).data("title");

          win.content(popupTemplate(id));
          win.title(title);
          win.center();
          win.open();

          e.preventDefault();
      });
    }
  });   

  return YouTube;

});