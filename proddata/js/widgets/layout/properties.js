//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2015 Profound Logic Software, Inc.
//
//  This file is part of the Profound UI Runtime
//
//  The Profound UI Runtime is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Lesser General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  The Profound UI Runtime is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  In the COPYING and COPYING.LESSER files included with the Profound UI Runtime.
//  If not, see <http://www.gnu.org/licenses/>.



pui.layout.getPropertiesModel = function() {
  var model = [
    { name: "Identification", category: true },
    { name: "id", maxLength: 75, attribute: "id", help: "Sets the ID of the layout element.", bind: false, canBeRemoved: false },
    { name: "field type", choices: ["layout"], blankChoice: false, help: "Determines the type of control that is used to render the element.", bind: false, canBeRemoved: false },
    
    { name: "Template Settings", category: true, context: "dspf" },
    { name: "template", choices: pui.layout.getTemplateList(), blankChoice: false, help: "Specifies the name of the template used to render the layout.", bind: false, canBeRemoved: false },
    { templateProperties: true },
    
    { name: "Position", category: true },
    { name: "left", format: "px", help: "Represents the x-coordinate of the current layout." },
    { name: "top", format: "px", help: "Represents the y-coordinate of the current layout." },
    { name: "right", format: "px", help: "Position of the layout from the right of the screen or another layout container." },
    { name: "bottom", format: "px", help: "Position of the layout from the bottom of the screen or another layout container." },
    { name: "center horizontally", choices: ["true", "false"], type: "boolean", help: "Centers the layout horizontally within its parent container.", hideFormatting: true, validDataTypes: ["indicator", "expression"] },
    { name: "center vertically", choices: ["true", "false"], type: "boolean", help: "Centers the layout vertically within its parent container.", hideFormatting: true, validDataTypes: ["indicator", "expression"] },
    { name: "height", fromat: "px", help: "Height of the layout.", bind: false, canBeRemoved: false },
    { name: "width", format: "px", help: "Width of the layout.", bind: false, canBeRemoved: false },
    { name: "min height", format: "px", help: "Minimum height of the layout." },
    { name: "min width", format: "px", help: "Minimum width of the layout." },
    { name: "max height", format: "px", help: "Maximum height of the layout." },
    { name: "max width", format: "px", help: "Maximum width of the layout." },
    { name: "z index", format: "number", help: "The stacking order of the current element, expressed as an integer value. The element with the higher z index will overlay lesser elements." },
    { name: "locked in place", choices: ["true", "false"], help: "If set to true, the element cannot be moved or sized.", bind: false },

    { name: "Tabs", category: true },
    { name: "parent tab panel", help: "This property specifies the id of the Tab Panel to which this element belongs.  The property is set automatically when you drag and drop the element onto a Tab Panel.", bind: false },
    { name: "parent tab", help: "This property specifies the tab index of the specific tab to which this element belongs.  Each tab within a Tab Panel is identified by a sequential index, starting with 0 for the first tab, 1 for the second tab, and so on.  The property is set automatically when you drag and drop the element onto a Tab Panel.", bind: false },
    { name: "parent field set", help: "This property specifies the id of the Field Set Panel to which this element belongs.  The property is set automatically when you drag and drop the element onto a Field Set Panel.", bind: false },

    { name: "Misc", category: true },    
    { name: "css class", multOccur: true, attribute: "class", help: "Defines a custom cascading style sheet class to assign to the element. To specify multiple classes, right-click the property and select Add Another CSS Class." },
    { name: "tool tip", type: "long", help: "Defines the text to appear in a tool tip when the user hovers the mouse over this element.", translate: true },
    { name: "visibility", format: "visible / hidden", choices: ["hidden", "visible"], help: "Determines whether the element is visible or hidden." },
    { name: "inline style", type: "long", attribute: "style", help: "This property lets you define CSS properties that will be applied to the widget.  These properties are applied inline, and therefore take precedence over those defined in a CSS class. Multiple properties may be provided, separated by a semi-colon.  You can learn more about CSS properties at the following link: http://www.w3schools.com/cssref/. If you define CSS properties that are defined by other widget properties, the widget properties overrule the CSS inline properties. These CSS properties are ignored and should be set using the widget properties: \"position\", \"visibility\", \"display\", \"left\", \"right\", \"top\", \"bottom\", \"width\", \"height\", \"overflow\"" },

    { name: "Events", category: true },
    { name: "onclick", type: "js", help: "Initiates a client-side script when the element is clicked." },
    { name: "ondblclick", type: "js", help: "Initiates a client-side script when the element is double-clicked." },
    { name: "onmousedown", type: "js", help: "Initiates a client-side script when the mouse is pressed down on this element." },
    { name: "onmousemove", type: "js", help: "Initiates a client-side script when the mouse is moving within this element." },
    { name: "onmouseout", type: "js", help: "Initiates a client-side script when the mouse is moved off this element." },
    { name: "onmouseover", type: "js", help: "Initiates a client-side script when the mouse is moved over this element." },
    { name: "onmouseup", type: "js", help: "Initiates a client-side script when the mouse button is released off this element." }
  ];
  
  return model;
};



pui.layout.getProperties = function(template) {
  return pui.layout.template.processHTML({
    template: template,
    returnProps: true
  });
};
