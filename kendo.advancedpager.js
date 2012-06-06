/*
* Ivelum 2012
* Alexander Skogorev
* Adds 'First' and 'Last' buttons to the pager
*/

(function($, undefined) {
    var kendo = window.kendo,
        ui = kendo.ui,
        Pager = ui.Pager;

    function button(template, idx, text, numeric) {
        return template( {
            idx: idx,
            text: text,
            ns: kendo.ns,
            numeric: numeric
        });
    }

    var AdvancedPager = Pager.extend( {        
        refresh: function() {
			var that = this,                
                end,
                start = 1,                
                reminder,
                page = that.page(),
                totalPages = that.totalPages(),
                linkTemplate = that.linkTemplate,
                buttonCount = that.options.buttonCount;
			
			Pager.fn.refresh.call(that);			
						
			if (page > buttonCount) {
                reminder = (page % buttonCount);
                start = (reminder === 0) ? (page - buttonCount) + 1 : (page - reminder) + 1;
            }
			
			end = Math.min((start + buttonCount) - 1, totalPages);
			
			if(start > 1) {
				that.list.prepend(button(linkTemplate, 1, "First", false));
            }

			if(end < totalPages) {
				that.list.append(button(linkTemplate, totalPages, "Last", false));
            }
        }
    });

    ui.plugin(AdvancedPager);
})(jQuery);