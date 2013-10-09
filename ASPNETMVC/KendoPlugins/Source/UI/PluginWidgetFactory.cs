using Kendo.Mvc.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using System.Web.UI;

namespace Kendo.Mvc.UI.Fluent
{
    public static class PluginWidgetFactory
    {
        public static ButtonBuilder Button(this WidgetFactory widgetFactory)
        {
            return new ButtonBuilder(new Button(widgetFactory.HtmlHelper.ViewContext, widgetFactory.Initializer, widgetFactory.UrlGenerator));
        }
    }
}
