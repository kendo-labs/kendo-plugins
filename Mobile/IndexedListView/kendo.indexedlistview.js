(function ($, kendo) {
    "use strict";

    var base = kendo.mobile.ui.ListView;
    var IndexedListView = base.extend({
        init: function(element, options) {
            var self = this;
			this._scrollWrapper = undefined;
			this._prevIndex = undefined;
			this._indexList = $('<ul class="km-listview-index"></ul>');
			this._indexCard = $('<div class="km-listview-index-card"></div>');

            base.fn.init.call(this, element, options);
            $(element).addClass("km-indexedlistview");

            if (this._scroller()) {
                kendo.onResize(function() {
                    this._sizeIndexList(self.headers.length);
                });
            }

            this._scrollWrapper = $(element).closest(".km-scroll-wrapper");
            this._scrollWrapper.prepend(this._indexList);
            $("body").prepend(this._indexCard);

           
            this.userEvents = new kendo.UserEvents(this._indexList, {
                stopPropagation: true,
                press: function (e) { self._onIndexDragStart(); self._onIndexDragMove(e); },
                tap: $.proxy(this._onIndexDragEnd, this),
                start: function () { self.userEvents.capture(); self._onIndexDragStart(); },
                move: $.proxy(this._onIndexDragMove, this),
                end: $.proxy(this._onIndexDragEnd, this)
            });
        },

        options: $.extend(base.options, {
            name: "IndexedListView"
        }),

        refresh: function (e) {
            base.fn.refresh.call(this, e);

            if (this.dataSource.group()[0]) {
                this._indexList.empty();
                this._sizeIndexList(this.dataSource.view().length);
                this._createIndexList(this.dataSource.view());
            }
        },

		_indexSelected: function (x, y) {
			try {
				var targetElement = $(document.elementFromPoint(x, y));
				var targetIndex = parseInt(targetElement.data("index"));
				if(this._prevIndex !== targetIndex) {
					this._prevIndex = targetIndex;
					this._scrollToIndex(targetIndex);
					window.x = targetElement;
					this._showIndexCard(targetElement.offset().top - (targetElement.height() / 2), targetElement.text());
				}
			} catch (ex) {
				this._onIndexDragEnd();
			}
		},

		_scrollToIndex: function (targetIndex) {
			var targetTop = this.headers[this.headers.length - targetIndex - 1].offset;
			this._scroller().scrollTo(0, targetTop * -1);
		},

		_showIndexCard: function (y, text) {
			this._indexCard.text(text);
			this._indexCard.css("top", (y - (this._indexCard.height() / 2)) + "px");
			this._indexCard.css("left", (Math.floor((this._scrollWrapper.width() * .7) - (this._indexCard.width() / 2))) + "px");
			this._indexCard.show();
		},

		_onIndexDragMove: function (e) {
			this._indexSelected(e.touch.x.location, e.touch.y.location);
		},

		_onIndexDragStart: function () {
			this._prevIndex = undefined;
			this._indexList.addClass("km-ontouch");
		},

		_onIndexDragEnd: function () {
			this._indexCard.hide();
			this._prevIndex = undefined;
			this._indexList.removeClass("km-ontouch");
		},

		_createIndexList: function (items) {
			var self = this;
			$.each(items, function (index, item) {
				var newElement = $('<li data-index="' + index + '">' + item.value + '</li>');
				self._indexList.append(newElement);
			});
		},

		_sizeIndexList: function (itemCount) {
			var lineHeight = Math.floor((this._scrollWrapper.height() - 20) / itemCount);
			this._indexList.css("line-height", lineHeight + "px");
			this._indexList.css("font-size", (lineHeight - 1) + "px");
		}
    });

    kendo.mobile.ui.plugin(IndexedListView);
})(window.jQuery, window.kendo);