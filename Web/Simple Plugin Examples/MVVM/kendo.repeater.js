// SIMPLEST POSSIBLE MVVM DATABOUND WIDGET
(function() {
    var DATABINDING = "dataBinding",
        DATABOUND = "dataBound",
        CHANGE = "change"    
    
    var Repeater = kendo.ui.Widget.extend({
    
        init: function(element, options) {
            var that = this;
        
            kendo.ui.Widget.fn.init.call(that, element, options);
    
            that.template = kendo.template(that.options.template || "<p><strong>#= data #</strong></p>")
    
            that._dataSource();
            
        },
    
        // events are used by other widgets / developers - API for other purposes
        // these events support MVVM bound items in the template. for loose coupling with MVVM.
        events: [
            // call before mutating DOM.
            // mvvm will traverse DOM, unbind any bound elements or widgets
            DATABINDING,
            // call after mutating DOM
            // traverses DOM and binds ALL THE THINGS
            DATABOUND
        ],
        
        
        // mvvm expects an array of dom elements that represent each item of the datasource.
        // should be the outermost element
        items: function() {
            return this.element.children();
        },
        
        
        // for supporting changing o the datasource via MVVM
        setDataSource: function(dataSource) {
            
            this.options.dataSource = dataSource;
            
            this._dataSource();
            
        },
        
        _dataSource: function() {
            
            var that = this;
            
            // returns the datasource OR creates one if using array or configuration object
            that.dataSource = kendo.data.DataSource.create(that.options.dataSource);
    
            if ( that.dataSource && that._refreshHandler ) {
                that.dataSource.unbind(CHANGE, that._refreshHandler);
            }
            else {
                that._refreshHandler = $.proxy(that.refresh, that);
            }
        
            // bind to the change event to refresh the widget
            that.dataSource.bind( CHANGE, that._refreshHandler );
    
            if (that.options.autoBind) {    
                that.dataSource.fetch();
            }
        },
    
        options: {
            name: "Repeater",
            autoBind: true,
            template: ""
        },
    
        refresh: function() {
            var that = this;
        
            var view = that.dataSource.view();
        
            var html = kendo.render(that.template, view);
        
            that.trigger(DATABINDING);
        
            that.element.html(html);
            
            that.trigger(DATABOUND);
        }
    
    })

    kendo.ui.plugin(Repeater);

})();

