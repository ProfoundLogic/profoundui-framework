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
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  In the COPYING and COPYING.LESSER files included with the Profound UI Runtime.
//  If not, see <http://www.gnu.org/licenses/>.

pui.layout.template.helpTextPanelProperties = function (defVal, descVal, descAdd, noteVal) {
  var codeOpen = "<code style='color: blue; letter-spacing: 0px; font-weight: bold;'>";
  var codeClose = "</code>";
  var falseSpan = "<span title='The default value of the property is false.'>false</span>";
  var trueSpan = "<span title='The default value of the property is true.'>true</span>";
  var blankSpan = "<span title='The default value of the property is unset or not defined.'>[blank]</span>";
  var cssSpan = "[<span title='The default value is the value defined in the CSS &#010;(theme/developer CSS classes defined in a CSS&#010;file or \"style\" DOM attribute) for the element.'>CSS value</span>]";
  var placeholderSpan = "[<span title='The default value of the property is placeholder &#010;text, such as \"Lorem Ipsum...\" or \"HTML Content\".'>placeholder text</span>]";
  var browserSpan = "[<span title='The default is determined by the browser for the element.'>browser setting</span>]";
  var widgetSpan = "[<span title='The default value of this property is determined by the selected widget.'>selected widget</span>]";
  var themeSpan = "[<span title='The default value of this property is based on the selected widget and its theme/template/purpose.'>selected widget</span>]";
  var skinSpan = "[<span title='The default value of this property is determined by &#010;the selected skin and it's defaults, CSS, and/or JavaScript customizations.'>selected skin</span>]";
  var idSpan = "[<span title='The default ID is based on the name of the selected &#010;widget with no spaces and the first letter of each word capitalized.'>WidgetName</span>][<span title='A whole number value starting from 1 determined by how many of the same widget have previously been added to the Design grid.'>number</span>]";
  var positionSpan = "[<span title='The default values are determined by where the &#010;widget is dropped/placed on the Designer grid.'>user drop point</span>]";
  var bindSpan = "<span title='This property requires being bound and a value passed by an RPG program.'>[bound value]</span>";
  var otherText = " The 'Other...' option can be selected to write in a custom value.";
  var pixelText = "Specify in pixels. <br><br>Example: " + codeOpen + "12px" + codeClose;

  // var listStyleTag = "<style>ul.listing {display: block; list-style-type: disc; padding-left: 10px; margin-left: 15px;}</style>";
  // var optionsOpen = "<hr><span style='font-weight:bold;'>Valid options</span>: <br><ul class='listing'><li>";
  // var optionsClose = "</li></ul>";
  
  // ------------------
  // Default Value:
  var helpString = "<hr><b title='The default value(s) of this property.'>Default Value:</b> ";
  // <c>value</c>
  var posDefVals = ["css", "blank", "false", "true", "placeholder", "browser", "theme", "skin", "id", "bind", "widget", "position"];
  helpString += codeOpen;
  if (posDefVals.indexOf(defVal) != -1) {
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
  if (descAdd.indexOf("other") != -1) {
    helpString += otherText;
  }
  // Font Family Examples:
  if (descAdd.indexOf("pixel") != -1) {
    helpString += pixelText;
  }
  // Note: Text...
  if (descAdd.indexOf("note") != -1) {
    helpString += "<br><br><b style='color: red;'>Note: </b>" + noteVal;
  }
  // ------------------
  helpString += "<hr><br>";

  return helpString;
}

pui.layout.template.cssPanelTemplate = function (parms) {

  var properties = parms.properties;
  var designMode = parms.designMode;
  var proxyMode = parms.proxyMode;
  var returnProps = parms.returnProps;
  var existingDom = parms.dom;

  if (returnProps) {
    return pui.layout.mergeProps([{
        name: "has header",
        choices: ["true", "false"],
        help: pui.layout.template.helpTextPanelProperties("theme","Determines whether the panel has a header.",[],"")
      },
      {
        name: "header height",
        format: "number",
        help: pui.layout.template.helpTextPanelProperties("theme","Specifies the height of the panel header.",[],"")
      },
      {
        name: "header text",
        help: pui.layout.template.helpTextPanelProperties("placeholder","Specifies the text that will appear in the panel header.",[],""),
        translate: true
      },
      {
        name: "header theme",
        choices: ["A - Black", "B - Blue", "C - Gray", "D - Light Gray", "E - Yellow", "F - Green", "G - Red", "Other..."],
        help: pui.layout.template.helpTextPanelProperties("theme","Specifies the jQuery Mobile theme to use for the panel header. The theme is associated with a set of cascading style sheet rules.", ["other","note"], "When you enter a custom value, a CSS class is add to the body of the panel in the form of <code style='color:blue;'>ui-btn-up-YourCustomValue</code>, where YourCustomValue is the exact text that was entered, including special characters, such as ' ', '-', and '_', and regardless of their validity in a CSS class name. This will allow you to customize the styling of the header using that CSS class name.")
      },
      {
        name: "body theme",
        choices: ["A - Black", "B - Blue", "C - Gray", "D - Light Gray", "E - Yellow", "F - Green", "G - Red", "Other..."],
        help: pui.layout.template.helpTextPanelProperties("theme","Specifies the jQuery Mobile theme to use for the panel body. The theme is associated with a set of cascading style sheet rules.", ["other", "note"], "When you enter a custom value, a CSS class is add to the body of the panel in the form of <code style='color:blue;'>ui-btn-up-YourCustomValue</code>, where YourCustomValue is the exact text that was entered, including special characters, such as ' ', '-', and '_', and regardless of their validity in a CSS class name. This will allow you to customize the styling of the body using that CSS class name.")
      },
      {
        name: "straight edge",
        choices: ["all", "left", "right", "top", "bottom"],
        help: pui.layout.template.helpTextPanelProperties("theme","Determines which parts of the element will have a straight edge instead of rounded corners.",[],"")
      },
      pui.layout.adoptNamedProperty("color"),
      pui.layout.adoptNamedProperty("font family"),
      pui.layout.adoptNamedProperty("font size"),
      pui.layout.adoptNamedProperty("font style"),
      pui.layout.adoptNamedProperty("font weight"),
      pui.layout.adoptNamedProperty("text align"),
      pui.layout.adoptNamedProperty("text decoration"),
      pui.layout.adoptNamedProperty("text transform")
    ]);
  }

  var dom;
  if (existingDom != null) {
    dom = existingDom.cloneNode(false);
  } else {
    dom = document.createElement("div");
  }
  dom.innerHTML = "";
  var panel = new pui.CSSPanel();
  panel.forLayout = true;
  panel.container = dom;
  panel.init();
  dom.panel = panel;
  dom.sizeMe = function () {
    dom.panel.resize();
  };
  var headerText = properties["header text"];
  if (headerText != null) panel.setText(headerText);
  var headerTheme = properties["header theme"];
  if (headerTheme != null) panel.setHeaderSwatch(headerTheme);
  var bodyTheme = properties["body theme"];
  if (bodyTheme != null) panel.setBodySwatch(bodyTheme);
  panel.setStraightEdge(properties["straight edge"]);
  var hasHeader = properties["has header"];
  hasHeader = (hasHeader !== "false" && hasHeader !== false);
  panel.setHasHeader(hasHeader);
  var headerHeight = properties["header height"];
  if (headerHeight != null) panel.setHeaderHeight(headerHeight);
  panel.setAllStyles(properties);
  var height = properties["height"];
  if (height == null) height = "300px";
  panel.setHeight(height);

  if (proxyMode) {
    dom.style.position = "relative";
  }

  return dom;

};