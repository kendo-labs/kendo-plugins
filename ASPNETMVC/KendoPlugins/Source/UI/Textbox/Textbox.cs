using Kendo.Mvc.Infrastructure;
using Kendo.Mvc.UI.Fluent;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using System.Web.UI;

namespace Kendo.Mvc.UI
{
    public class Textbox : WidgetBase
    {
        public Textbox(ViewContext viewContext, IJavaScriptInitializer initializer, IUrlGenerator urlGenerator)
            : base(viewContext, initializer)
        {
            UrlGenerator = urlGenerator;
        }

        internal IUrlGenerator UrlGenerator
        {
            get;
            private set;
        }

        public TextboxPlaceholderBuilder Placeholder
        {
            get;
            set;
        }

        public override void WriteInitializationScript(TextWriter writer)
        {
            var options = new Dictionary<string, object>(Events);

            options["placeholder"] = this.Placeholder.ToJson();
            writer.Write(Initializer.Initialize(Selector, "ExtTextBox", options));

            base.WriteInitializationScript(writer);
        }

        protected override void WriteHtml(HtmlTextWriter writer)
        {
            new TextboxHtmlBuilder(this)
                .Build()
                .WriteTo(writer);

            base.WriteHtml(writer);
        }
    }
}
