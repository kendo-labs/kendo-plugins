 
  // wrap the widget in a closure. Not necessary in doc ready, but a good practice
  (function ($) {

    // shorten references to variables. this is better for uglification 
    var kendo = window.kendo,
    ui = kendo.ui,
    Widget = ui.Widget;

    // declare the custom input widget by extenting the very base kendo widget
    var CustomInput = Widget.extend({
      
        // define the init function which is called by the base widget
        init: function(element, options) {

            // cache a reference to this
            var that = this;
          
            // make the base call to initialize this widget
            Widget.fn.init.call(this, element, options);

            // actually create the UI elements. this is a private method
            // that is below
            that._create();
        },

        // the options object contains anything that will be passed in when the widget
        // is actually used
        options: {

            name: "CustomInput",
            labelText: "Please Input Your Name...",
            inputText: "",
            checked: false,
            placeholder: "Enter Name",
            toggleColor: "#9BF49D"

        },

        // this function creates each of the UI elements and appends them to the element
        // that was selected out of the DOM for this widget
        _create: function() {

            // cache a reference to this
            var that = this;
          
            // set the initial toggled state
            that.toggle = true;

            // setup the label
            var template = kendo.template(that._templates.label);
            that.label = $(template(that.options));

            // setup the textbox
            template = kendo.template(that._templates.textbox);
            that.textbox = $(template(that.options));
           
            // setup the textbox change event. wrap it in a closure so that
            // "this" will be equal to the widget and not the HTML element that
            // the change function passes.
            that.textbox.change(function(e) { 
              that._inputChange(); 
            });

            // setup the checkbox
            template = kendo.template(that._templates.checkbox);
            that.checkbox = $(template(that.options));

            // setup the checkbox change event. wrap it in a closure to preserve
            // the context of "this".
            that.checkbox.change(function(e) { 
              that._checkChange(); 
            });

            // append all elements to the DOM
            that.element.append(that.textbox)
                        .append(that.label)
                        .append(that.checkbox);

        },

        // the event that fires when the textbox changes
        _inputChange: function() {
            var that = this;
            that.label.text(that.textbox.val());
        },

        // the event that fires when the checkbox changes
        _checkChange: function() {
          var that = this;
          
          // check the toggle value
          if (that.toggle) {
            // change the background color to the specified one on the
            // options object
            that.element.css("background", that.options.toggleColor);
          }
          else {
            // toggle it back to white
            that.element.css("background", "#fff");
          }
          // flip the toggle
          that.toggle = !that.toggle;
        },
  
        // the templates for each of the UI elements that comprise the widget
        _templates: {
            textbox: "<input class='k-textbox' placeholder='#: placeholder #' type='text' >",
            label: "<span style='display: inline-block; width: 200px; margin-left: 20px;'>#: labelText # </span>",
            checkbox: "<input type='checkbox' # if (data.checked) { # checked='checked' # } #>"
        }

    });
    
    // add the widget to the ui namespace so it's available
    ui.plugin(CustomInput);
    
    // create a new widget which extends the first custom widget
    var CustomInputDisable = CustomInput.extend({
      
      // every widget has an init function
      init: function (element, options) {
      
          // cache this
          var that = this;
          
          // initialize the widget by calling init on the extended class
          CustomInput.fn.init.call(that, element, options);
      
      },
      
      // handle the _checkChange event.  This is overriding the base event.
      _checkChange: function() {
        
         // cache the value of this
         var that = this;
        
        // disable the textbox first
        if (!that.textbox.is(":disabled")) {
            that.textbox.attr("disabled", "disabled");
        } else {
          that.textbox.removeAttr("disabled");
        }
        
        // this calls the base method from the CustomInput widget.  If you didn't want
        // to call this, you would omit this line.  then the textbox would be disabled, but
        // the background color would not change.
        CustomInput.prototype._checkChange.call(this); // call the base method
      },
      // all options are inherited from the CustomInput widget. This just sets a new name
      // for this widget
      options: {
        name: "CustomInputDisable"
      }
    });
    
    // add this new widget to the UI namespace.
    ui.plugin(CustomInputDisable);
    
  })(jQuery);