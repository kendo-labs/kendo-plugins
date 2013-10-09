using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Kendo.Mvc.UI
{
    public class TextboxHtmlBuilder : HtmlBuilderBase
    {
        private readonly Textbox textbox;

        public TextboxHtmlBuilder(Textbox component)
        {
            this.textbox = component;
        }

        protected override IHtmlNode BuildCore()
        {
            return CreateTextbox();
        }

        public IHtmlNode CreateTextbox()
        {
            var content = new HtmlElement("input")
                .Attribute("id", textbox.Id);

            return content;
        }
    }
}
