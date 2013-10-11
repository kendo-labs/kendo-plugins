using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Kendo.Mvc.UI
{
    public class ActionLinkHtmlBuilder : HtmlBuilderBase
    {
        private readonly ActionLink actionLink;

        public ActionLinkHtmlBuilder(ActionLink component)
        {
            this.actionLink = component;
        }

        protected override IHtmlNode BuildCore()
        {
            return CreateActionLink();
        }

        public IHtmlNode CreateActionLink()
        {
            var content = new HtmlElement("a")
                .Attribute("id", actionLink.Id);

            var text = actionLink.GetValue<string>(actionLink.Text);
            if (!string.IsNullOrEmpty(text))
            {
                content.Text(text);
            }
            return content;
        }
    }
}
