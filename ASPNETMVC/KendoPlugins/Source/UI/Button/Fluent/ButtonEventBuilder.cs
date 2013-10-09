using Kendo.Mvc.UI.Fluent;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Kendo.Mvc.UI.Fluent
{
    public class ButtonEventBuilder : EventBuilder
    {
        public ButtonEventBuilder(IDictionary<string, object> events)
            : base(events)
        {
        }

        public ButtonEventBuilder Click(string handler)
        {
            Handler("click", handler);

            return this;
        }
    }
}
