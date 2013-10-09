using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Kendo.Mvc.UI
{
    public class ButtonHtmlBuilder : HtmlBuilderBase
    {
        private readonly Button button;

        public ButtonHtmlBuilder(Button component)
        {
            this.button = component;
        }

        protected override IHtmlNode BuildCore()
        {
            return CreateButton();
        }

        public IHtmlNode CreateButton()
        {
            var content = new HtmlElement("button")
                .Attribute("id", button.Id);

            var text = button.GetValue<string>(button.Text);
            if (!string.IsNullOrEmpty(text))
            {
                content.Text(text);
            }
            return content;
        }
    }
}
