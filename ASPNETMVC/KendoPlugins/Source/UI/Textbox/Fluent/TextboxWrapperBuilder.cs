using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Kendo.Mvc.UI.Fluent
{
    public class TextboxWrapperBuilder : JsonObject
    {
        private string _cssClass;

        public TextboxWrapperBuilder CssClass(string cssClass)
        {
            _cssClass = cssClass;
            return this;
        }

        protected override void Serialize(IDictionary<string, object> json)
        {
            json["cssClass"] = this._cssClass;
        }
    }
}
