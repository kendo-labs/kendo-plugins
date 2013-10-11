using Kendo.Mvc.Infrastructure;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using System.Web.UI;

namespace Kendo.Mvc.UI
{
    public enum ActionLinkStyle
    {
        Link,
        Button
    }

    public class ActionLink : WidgetBase
    {
        public ActionLink(ViewContext viewContext, IJavaScriptInitializer initializer, IUrlGenerator urlGenerator)
            : base(viewContext, initializer)
        {
            UrlGenerator = urlGenerator;
            this.Style = ActionLinkStyle.Link;
        }

        internal IUrlGenerator UrlGenerator
        {
            get;
            private set;
        }

        internal ActionLinkStyle Style { get; set; }
        internal string Controller { get; set; }
        internal string Action { get; set; }
        internal string Text { get; set; }

        public override void WriteInitializationScript(TextWriter writer)
        {
            var options = new Dictionary<string, object>();

            options["style"] = this.Style == ActionLinkStyle.Button ? "button" : "link";

            options["controller"] = this.Controller != null ? this.Controller : ViewContext.RouteData.Values["controller"];

            if (this.Action != null)
            {
                options["action"] = this.Action;
            }
            writer.Write(Initializer.Initialize(Selector, "ActionLink", options));

            base.WriteInitializationScript(writer);
        }

        protected override void WriteHtml(HtmlTextWriter writer)
        {
            new ActionLinkHtmlBuilder(this)
                .Build()
                .WriteTo(writer);

            base.WriteHtml(writer);
        }
    }
}
