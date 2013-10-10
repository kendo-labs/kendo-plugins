using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Kendo.Mvc.UI.Fluent
{
    public class TextboxBuilder : WidgetBuilderBase<Textbox, TextboxBuilder>, IHideObjectMembers
    {
        public TextboxBuilder(Textbox component)
            : base(component)
        {
        }

        public TextboxBuilder Placeholder(Action<TextboxPlaceholderBuilder> configurator)
        {
            TextboxPlaceholderBuilder builder = new TextboxPlaceholderBuilder();
            (Component as Textbox).Placeholder = builder;
            configurator(builder);
            return this;
        }

        public TextboxBuilder Wrapper(Action<TextboxWrapperBuilder> configurator)
        {
            TextboxWrapperBuilder builder = new TextboxWrapperBuilder();
            (Component as Textbox).Wrapper = builder;
            configurator(builder);
            return this;
        }
    }
}
