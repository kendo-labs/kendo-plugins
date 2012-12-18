window.APP = window.APP || {};

APP.template = (function ($) {
	
	var pub = {};

	pub.load = function (url) {
		var that = this,
        dfr = $.Deferred();
         
        $.get("templates/" + url, dfr.resolve);

	    return dfr.promise();
	}

	return pub;

}(jQuery))