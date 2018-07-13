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

function helpTextAccordionProperties(defVal, descVal, descAdd, noteVal) {
  var codeOpen = "<code style='color: blue; letter-spacing: 0px; font-weight: bold;'>";
  var codeClose = "</code>";
  var falseSpan = "<span title='The default value of the property is false.'>false</span>";
  var trueSpan = "<span title='The default value of the property is false.'>true</span>";
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
  // Note: Text...
  if (descAdd.includes("note")) {
    helpString += "<br><br><b style='color: red;'>Note: </b>" + noteVal;
  }
  // ------------------
  helpString += "<hr><br>";

  return helpString;
}

pui.layout.template.accordionTemplate = function (parms) {

  var properties = parms.properties;
  var designMode = parms.designMode;
  var proxyMode = parms.proxyMode;
  var returnProps = parms.returnProps;
  var existingDom = parms.dom;

  if (returnProps) {
    return pui.layout.mergeProps([{
        name: "section names",
        type: "list",
        help: helpTextAccordionProperties("placeholder","Specifies a comma separate list of section names for the accordion.", [], ""),
        translate: true
      },
      {
        name: "active section",
        format: "number",
        help: helpTextAccordionProperties("0","This property specifies the initial active section on an Accordion Layout. Each section within an Accordion is identified by a sequential index, starting with 0 for the first section, 1 for the second section, and so on.", [], "")
      },
      {
        name: "header theme",
        choices: ["A - Black", "B - Blue", "C - Gray", "D - Light Gray", "E - Yellow", "F - Green", "G - Red", "Other..."],
        help: helpTextAccordionProperties("","Specifies the jQuery Mobile theme to use for the accordion headers.  The theme is associated with a set of cascading style sheet rules.", ["other", "note"], "When you enter a custom value, a CSS class is add to the header the panel in the form of <code style='color:blue;'>ui-btn-up-YourCustomValue</code>, where YourCustomValue is the exact text that was entered, including special characters, such as ' ', '-', and '_', and regardless of their validity in a CSS class name. This will allow you to customize the styling of the header using that CSS class name.")
      },
      {
        name: "body theme",
        choices: ["A - Black", "B - Blue", "C - Gray", "D - Light Gray", "E - Yellow", "F - Green", "G - Red", "Other..."],
        help: helpTextAccordionProperties("","Specifies the jQuery Mobile theme to use for the content body of the accordion.  The theme is associated with a set of cascading style sheet rules.", ["other", "note"], "When you enter a custom value, a CSS class is add to the body of the panel in the form of <code style='color:blue;'>ui-btn-up-YourCustomValue</code>, where YourCustomValue is the exact text that was entered, including special characters, such as ' ', '-', and '_', and regardless of their validity in a CSS class name. This will allow you to customize the styling of the body using that CSS class name.")
      },
      {
        name: "small sections",
        choices: ["true", "false"],
        help: helpTextAccordionProperties("false","This property uses CSS to provide a smaller, more compact version of the header sections.", [], "")
      },
      {
        name: "allow collapse",
        choices: ["true", "false"],
        help: helpTextAccordionProperties("true","Determines if the accordion can be fully collapsed.", [], "")
      },
      {
        name: "straight edge",
        choices: ["all", "left", "right", "top", "bottom"],
        help: helpTextAccordionProperties("blank","Determines which parts of the element will have a straight edge instead of rounded corners.", [], "")
      },
      pui.layout.adoptNamedProperty("color"),
      pui.layout.adoptNamedProperty("font family"),
      pui.layout.adoptNamedProperty("font size"),
      pui.layout.adoptNamedProperty("font style"),
      pui.layout.adoptNamedProperty("font weight"),
      pui.layout.adoptNamedProperty("text align"),
      pui.layout.adoptNamedProperty("text decoration"),
      pui.layout.adoptNamedProperty("text transform"),
      {
        name: "onsectionclick",
        type: "js",
        help: helpTextAccordionProperties("","Initiates a client-side script when an accordion section is expanded.  The section index is passed to the event as a parameter named \"section\".  If the client-side script evaluates to false, the section will not be expanded.", [], "")
      }
    ]);
  }

  var dom;
  if (existingDom != null) {
    dom = existingDom.cloneNode(false);
  } else {
    dom = document.createElement("div");
  }
  dom.innerHTML = "";
  var accordion = new pui.Accordion();
  if (proxyMode) accordion.forProxy = true;
  accordion.container = dom;
  accordion.designMode = designMode;
  accordion.init();
  dom.accordion = accordion;
  dom.sizeMe = function () {
    dom.accordion.resize();
  };

  var sectionNames = properties["section names"];
  accordion.setSectionNames(sectionNames);
  var headerTheme = properties["header theme"];
  if (headerTheme != null) accordion.setHeaderSwatch(headerTheme);
  var bodyTheme = properties["body theme"];
  if (bodyTheme != null) accordion.setBodySwatch(bodyTheme);
  accordion.setStraightEdge(properties["straight edge"]);
  var mini = properties["small sections"];
  mini = (mini === "true" || mini === true);
  accordion.setMini(mini);
  accordion.setAllStyles(properties);
  var height = properties["height"];
  if (height == null) height = "300px";
  accordion.setHeight(height);
  if (!designMode) {
    var activeSection = properties["active section"];
    if (activeSection != null) {
      activeSection = Number(activeSection);
      if (!isNaN(activeSection) && activeSection != 0) {
        accordion.expandSection(activeSection);
      }
    }
  }

  if (proxyMode) {
    dom.style.position = "relative";
  }

  return dom;

};