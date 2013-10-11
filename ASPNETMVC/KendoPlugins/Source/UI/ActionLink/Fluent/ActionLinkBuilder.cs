using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Kendo.Mvc.UI.Fluent
{
    public class ActionLinkBuilder : WidgetBuilderBase<ActionLink, ActionLinkBuilder>, IHideObjectMembers
    {
        public ActionLinkBuilder(ActionLink component)
            : base(component)
        {
        }

        public ActionLinkBuilder Style(ActionLinkStyle style)
        {
            this.Component.Style = style;
            return this;
        }

        public ActionLinkBuilder Controller(string controller)
        {
            this.Component.Controller = controller;
            return this;
        }

        public ActionLinkBuilder Action(string action)
        {
            this.Component.Action = action;
            return this;
        }

        public ActionLinkBuilder Text(string text)
        {
            this.Component.Text = text;
            return this;
        }
    }
}
