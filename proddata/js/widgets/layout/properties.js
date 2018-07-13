//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2018 Profound Logic Software, Inc.
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
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  In the COPYING and COPYING.LESSER files included with the Profound UI Runtime.
//  If not, see <http://www.gnu.org/licenses/>.

function helpTextLayoutProperties(defVal, descVal, descAdd, noteVal) {
  var codeOpen = "<code style='color: blue; letter-spacing: 0px; font-weight: bold;'>";
  var codeClose = "</code>";
  var falseSpan = "<span title='The default value of the property is false.'>false</span>";
  var trueSpan = "<span title='The default value of the property is false.'>true</span>";
  var blankSpan = "<span title='The default value of the property is unset or not defined.'>[blank]</span>";
  var cssSpan = "[<span title='The default value is the value defined in the CSS &#010;(theme/developer CSS classes defined in a CSS&#010;file or \"style\" DOM attribute) for the element.'>CSS value</span>]";
  var browserSpan = "[<span title='The default is determined by the browser for the element.'>browser setting</span>]";
  var widgetSpan = "[<span title='The default value of this property is determined by the selected widget.'>selected widget</span>]";
  var themeSpan = "[<span title='The default value of this property is based on the selected widget and its theme/template/purpose.'>selected widget</span>]";
  var idSpan = "[<span title='The default ID is based on the name of the selected &#010;widget with no spaces and the first letter of each word capitalized.'>WidgetName</span>][<span title='A whole number value starting from 1 determined by how many of the same widget have previously been added to the Design grid.'>number</span>]";
  var positionSpan = "[<span title='The default values are determined by where the &#010;widget is dropped/placed on the Designer grid.'>user drop point</span>]";
  var bindSpan = "<span title='This property requires being bound and a value passed by an RPG program.'>[bound value]</span>";
  var otherText = " The 'Other...' option can be selected to write in a custom value.";
  var pixelText = "Specify in pixels. <br><br>Example: " + codeOpen + "12px" + codeClose;

  var optionsOpen = "<hr><span style='font-weight:bold;'>Valid options</span>: <br><ul class='listing'><li>";
  // var optionsClose = "</li></ul>";

  // ------------------
  // Default Value:
  var helpString = "<hr><b title='The default value(s) of this property.'>Default Value:</b> ";
  // <c>value</c>
  var posDefVals = ["css", "blank", "false", "true", "placeholder", "browser", "theme", "skin", "id", "bind", "widget", "position"];
  helpString += codeOpen;
  if (posDefVals.includes(defVal)) {
    if (defVal === "true") {
      helpString += trueSpan;
    } else if (defVal === "blank") {
      helpString += blankSpan;
    } else if (defVal === "css") {
      helpString += cssSpan;
    } else if (defVal === "false") {
      helpString += falseSpan;
    } else if (defVal === "placeholder") {
      helpString += placeholderSpan;
    } else if (defVal === "browser") {
      helpString += browserSpan;
    } else if (defVal === "theme") {
      helpString += themeSpan;
    } else if (defVal === "skin") {
      helpString += skinSpan;
    } else if (defVal === "id") {
      helpString += idSpan;
    } else if (defVal === "bind") {
      helpString += bindSpan;
    } else if (defVal === "widget") {
      helpString += widgetSpan;
    } else if (defVal === "position") {
      helpString += positionSpan;
    }
  } else {
    helpString += defVal;
  }
  helpString += codeClose;
  // ------------------
  // Description:
  helpString += "<hr><b title='A general description of the widget's properties.'>Description: </b>";
  // Description text...
  helpString += descVal;

  // Other...
  if (descAdd.includes("other")) {
    helpString += otherText;
  }
  // Color Examples:
  if (descAdd.includes("color")) {
    helpString += colorOptions;
  }
  // Background Color Examples:
  if (descAdd.includes("background color")) {
    helpString += bgColorOptions;
  }
  // Font Family Examples:
  if (descAdd.includes("font")) {
    helpString += fontOptions;
  }
  // Font Family Examples:
  if (descAdd.includes("overflow")) {
    helpString += overflowOptions;
  }
  // Font Family Examples:
  if (descAdd.includes("pixel")) {
    helpString += pixelText;
  }
  // Note: Text...
  if (descAdd.includes("note")) {
    helpString += "<br><br><b style='color: red;'>Note: </b>" + noteVal;
  }
  // ------------------
  helpString += "<hr><br>";

  return helpString;
}

pui.layout.getPropertiesModel = function () {
  var model = [{
      name: "Identification",
      category: true
    },
    {
      name: "id",
      maxLength: 75,
      attribute: "id",
      help: helpTextLayoutProperties("id", "Sets the ID of the layout element.",[]),
      bind: false,
      canBeRemoved: false
    },
    {
      name: "field type",
      displayName: "widget type",
      choices: ["layout"],
      blankChoice: false,
      help: helpTextLayoutProperties("widget", "Determines the type of control that is used to render the element.",[]),
      bind: false,
      canBeRemoved: false
    },

    {
      name: "Template Settings",
      category: true,
      context: "dspf"
    },
    {
      name: "template",
      choices: pui.layout.getTemplateList(),
      blankChoice: false,
      help: helpTextLayoutProperties("widget", "Specifies the name of the template used to render the layout.",[]),
      bind: false,
      canBeRemoved: false
    },
    {
      templateProperties: true
    },

    {
      name: "Position",
      category: true
    },
    {
      name: "left",
      format: "px",
      help: helpTextLayoutProperties("position", "Represents the x-coordinate of the current layout.",[])
    },
    {
      name: "top",
      format: "px",
      help: helpTextLayoutProperties("position", "Represents the y-coordinate of the current layout.",[])
    },
    {
      name: "right",
      format: "px",
      help: helpTextLayoutProperties("blank", "Position of the layout from the right of the screen or another layout container.",[])
    },
    {
      name: "bottom",
      format: "px",
      help: helpTextLayoutProperties("blank", "Position of the layout from the bottom of the screen or another layout container.",[])
    },
    {
      name: "center horizontally",
      choices: ["true", "false"],
      type: "boolean",
      help: helpTextLayoutProperties("false", "Centers the layout horizontally within its parent container.",[]),
      hideFormatting: true,
      validDataTypes: ["indicator", "expression"]
    },
    {
      name: "center vertically",
      choices: ["true", "false"],
      type: "boolean",
      help: helpTextLayoutProperties("false", "Centers the layout vertically within its parent container.",[]),
      hideFormatting: true,
      validDataTypes: ["indicator", "expression"]
    },
    {
      name: "height",
      fromat: "px",
      help: helpTextLayoutProperties("widget", "Height of the layout.",[]),
      bind: false,
      canBeRemoved: false
    },
    {
      name: "width",
      format: "px",
      help: helpTextLayoutProperties("widget", "Width of the layout.",[]),
      bind: false,
      canBeRemoved: false
    },
    {
      name: "min height",
      format: "px",
      help: helpTextLayoutProperties("css", "Minimum height of the layout.",[])
    },
    {
      name: "min width",
      format: "px",
      help: helpTextLayoutProperties("css", "Minimum width of the layout.",[])
    },
    {
      name: "max height",
      format: "px",
      help: helpTextLayoutProperties("css", "Maximum height of the layout.",[])
    },
    {
      name: "max width",
      format: "px",
      help: helpTextLayoutProperties("css", "Maximum width of the layout.",[])
    },
    {
      name: "z index",
      format: "number",
      help: helpTextLayoutProperties("css", "The stacking order of the current element, expressed as an integer value. The element with the higher z index will overlay lesser elements.",[])
    },
    {
      name: "locked in place",
      choices: ["true", "false"],
      help: helpTextLayoutProperties("false", "If set to true, the element cannot be moved or sized.",[]),
      bind: false
    },

    {
      name: "Tabs",
      category: true
    },
    {
      name: "parent tab panel",
      help: helpTextLayoutProperties("blank", "This property specifies the id of the Tab Panel to which this element belongs. The property is set automatically when you drag and drop the element onto a Tab Panel.",[]),
      bind: false
    },
    {
      name: "parent tab",
      help: helpTextLayoutProperties("blank", "This property specifies the tab index of the specific tab to which this element belongs. Each tab within a Tab Panel is identified by a sequential index, starting with 0 for the first tab, 1 for the second tab, and so on. The property is set automatically when you drag and drop the element onto a Tab Panel.",[]),
      bind: false
    },
    {
      name: "parent field set",
      help: helpTextLayoutProperties("blank", "This property specifies the id of the Field Set Panel to which this element belongs. The property is set automatically when you drag and drop the element onto a Field Set Panel.",[]),
      bind: false
    },

    {
      name: "Misc",
      category: true
    },
    {
      name: "css class",
      type: "cssClass",
      multOccur: true,
      attribute: "class",
      help: helpTextLayoutProperties("theme", "Defines a custom cascading style sheet class to assign to the element. To specify multiple classes, right-click the property and select Add Another CSS Class.",[])
    },
    {
      name: "tool tip",
      type: "long",
      help: helpTextLayoutProperties("blank", "Defines the text to appear in a tool tip when the user hovers the mouse over this element.",[]),
      translate: true
    },
    {
      name: "user defined data",
      multOccur: true,
      help: helpTextLayoutProperties("blank", "Specifies user-defined general purpose data associated with the widget. To provide multiple user defined data values, right-click the property and select Add Another User Defined Value.",[])
    },
    {
      name: "visibility",
      format: "visible / hidden",
      choices: ["hidden", "visible"],
      help: helpTextLayoutProperties("css", "Determines whether the element is visible or hidden.",[])
    },
    {
      name: "inline style",
      type: "long",
      attribute: "style",
      help: helpTextLayoutProperties("blank", "This property lets you define CSS properties that will be applied to the widget. These properties are applied inline, and therefore take precedence over those defined in a CSS class. Multiple properties may be provided, separated by a semi-colon. You can learn more about CSS properties at the following link: http://www.w3schools.com/cssref/. If you define CSS properties that are defined by other widget properties, the widget properties overrule the CSS inline properties. These CSS properties are ignored and should be set using the widget properties: \"position\", \"visibility\", \"display\", \"left\", \"right\", \"top\", \"bottom\", \"width\", \"height\", \"overflow\"",[])
    },

    {
      name: "Events",
      category: true
    },
    {
      name: "onclick",
      type: "js",
      help: helpTextLayoutProperties("blank", "Initiates a client-side script when the element is clicked.",[])
    },
    {
      name: "ondblclick",
      type: "js",
      help: helpTextLayoutProperties("blank", "Initiates a client-side script when the element is double-clicked.",[])
    },
    {
      name: "onmousedown",
      type: "js",
      help: helpTextLayoutProperties("blank", "Initiates a client-side script when the mouse is pressed down on this element.",[])
    },
    {
      name: "onmousemove",
      type: "js",
      help: helpTextLayoutProperties("blank", "Initiates a client-side script when the mouse is moving within this element.",[])
    },
    {
      name: "onmouseout",
      type: "js",
      help: helpTextLayoutProperties("blank", "Initiates a client-side script when the mouse is moved off this element.",[])
    },
    {
      name: "onmouseover",
      type: "js",
      help: helpTextLayoutProperties("blank", "Initiates a client-side script when the mouse is moved over this element.",[])
    },
    {
      name: "onmouseup",
      type: "js",
      help: helpTextLayoutProperties("blank", "Initiates a client-side script when the mouse button is released off this element.",[])
    }
  ];

  return model;
};



pui.layout.getProperties = function (template) {
  return pui.layout.template.processHTML({
    template: template,
    returnProps: true
  });
};