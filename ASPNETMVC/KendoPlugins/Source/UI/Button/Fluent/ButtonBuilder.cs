using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Kendo.Mvc.UI.Fluent
{
    public class ButtonBuilder : WidgetBuilderBase<Button, ButtonBuilder>, IHideObjectMembers
    {
        public ButtonBuilder(Button component)
            : base(component)
        {
        }

        public ButtonBuilder Text(string text)
        {
            this.Component.Text = text;
            return this;
        }

        public ButtonBuilder Events(Action<ButtonEventBuilder> clientEventsAction)
        {

            clientEventsAction(new ButtonEventBuilder(Component.Events));

            return this;
        }
    }
}
