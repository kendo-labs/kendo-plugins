using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Kendo.Mvc.UI.Fluent
{
    public class TextboxPlaceholderBuilder : JsonObject
    {
        private string _text;

        public TextboxPlaceholderBuilder Text(string text)
        {
            _text = text;
            return this;
        }

        protected override void Serialize(IDictionary<string, object> json)
        {
            json["text"] = this._text;
        }
    }
}
