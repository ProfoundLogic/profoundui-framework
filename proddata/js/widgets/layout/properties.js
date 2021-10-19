//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2020 Profound Logic Software, Inc.
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

/**
 * Returns a new array of layout properties with the template properties inserted in the Template Settings category.
 * @param {Array.<Object>} templateProperties
 * @returns {Array.<Object>}
 */
pui.layout.getPropertiesModel = function (templateProperties) {
  var model = [
    { name: "Identification", category: true },
    { name: "id", maxLength: 75, attribute: "id", helpDefault: "id", help: "Sets the ID of the layout element.", bind: false, canBeRemoved: false },
    { name: "field type", displayName: "widget type", choices: ["layout"], blankChoice: false, helpDefault: "widget", help: "Determines the type of control that is used to render the element.", bind: false, canBeRemoved: false },

    { name: "Template Settings", category: true, context: "dspf" },
    { name: "template", choices: pui.layout.getTemplateList, blankChoice: false, helpDefault: "widget", help: "Specifies the name of the template used to render the layout.", bind: false, canBeRemoved: false }
  ];
  
  Array.prototype.push.apply(model, templateProperties); //Add all template properties.
  
  var partdeux = [
    { name: "Position", category: true },
    { name: "left", format: "px", helpDefault: "position", help: "Represents the x-coordinate of the current layout." },
    { name: "top", format: "px", helpDefault: "position", help: "Represents the y-coordinate of the current layout." },
    { name: "right", format: "px", helpDefault: "blank", help: "Position of the layout from the right of the screen or another layout container." },
    { name: "bottom", format: "px", helpDefault: "blank", help: "Position of the layout from the bottom of the screen or another layout container." },
    { name: "center horizontally", choices: ["true", "false"], type: "boolean", helpDefault: "false", help: "Centers the layout horizontally within its parent container.", hideFormatting: true, validDataTypes: ["indicator", "expression"] },
    { name: "center vertically", choices: ["true", "false"], type: "boolean", helpDefault: "false", help: "Centers the layout vertically within its parent container.", hideFormatting: true, validDataTypes: ["indicator", "expression"] },
    { name: "height", format: "px", helpDefault: "widget", help: "Height of the layout.", bind: false, canBeRemoved: false },
    { name: "width", format: "px", helpDefault: "widget", help: "Width of the layout.", bind: false, canBeRemoved: false },
    { name: "min height", format: "px", helpDefault: "css", help: "Minimum height of the layout." },
    { name: "min width", format: "px", helpDefault: "css", help: "Minimum width of the layout." },
    { name: "max height", format: "px", helpDefault: "css", help: "Maximum height of the layout." },
    { name: "max width", format: "px", helpDefault: "css", help: "Maximum width of the layout." },
    { name: "z index", format: "number", helpDefault: "css", help: "The stacking order of the current element, expressed as an integer value. The element with the higher z index will overlay lesser elements." },
    { name: "locked in place", choices: ["true", "false"], helpDefault: "false", help: "If set to true, the element cannot be moved or sized.", bind: false },

    { name: "Tabs", category: true },
    { name: "parent tab panel", helpDefault: "blank", help: "This property specifies the id of the Tab Panel to which this element belongs. The property is set automatically when you drag and drop the element onto a Tab Panel.", bind: false },
    { name: "parent tab", helpDefault: "blank", help: "This property specifies the tab index of the specific tab to which this element belongs. Each tab within a Tab Panel is identified by a sequential index, starting with 0 for the first tab, 1 for the second tab, and so on. The property is set automatically when you drag and drop the element onto a Tab Panel.", bind: false },
    { name: "parent field set", helpDefault: "blank", help: "This property specifies the id of the Field Set Panel to which this element belongs. The property is set automatically when you drag and drop the element onto a Field Set Panel.", bind: false },

    { name: "Misc", category: true },
    { name: "css class", type: "cssClass", multOccur: true, attribute: "class", helpDefault: "theme", help: "Defines a custom cascading style sheet class to assign to the element. To specify multiple classes, right-click the property and select Add Another CSS Class." },
    { name: "tool tip", type: "long", helpDefault: "blank", help: "Defines the text to appear in a tool tip when the user hovers the mouse over this element.", translate: true },
    { name: "user defined data", multOccur: true, helpDefault: "blank", help: "Specifies user-defined general purpose data associated with the widget. To provide multiple user defined data values, right-click the property and select Add Another User Defined Value." },
    { name: "visibility", format: "visible / hidden", choices: ["hidden", "visible"], helpDefault: "css", help: "Determines whether the element is visible or hidden." },
    { name: "inline style", type: "long", attribute: "style", helpDefault: "blank", help: "This property lets you define CSS properties that will be applied to the widget. These properties are applied inline, and therefore take precedence over those defined in a CSS class. Multiple properties may be provided, separated by a semi-colon. You can learn more about CSS properties"
    + " at the following link: http://www.w3schools.com/cssref/. If you define CSS properties that are defined by other widget properties, the widget properties overrule the CSS inline properties. These CSS properties are ignored and should be set using the widget properties: \"position\", \"visibility\", \"display\", \"left\", \"right\", \"top\", \"bottom\", \"width\", \"height\", \"overflow\"" },

    { name: "Events", category: true },
    { name: "onclick", wf: true, type: "js", helpDefault: "blank", help: "Initiates a client-side script when the element is clicked." },
    { name: "ondblclick", wf: true, type: "js", helpDefault: "blank", help: "Initiates a client-side script when the element is double-clicked." },
    { name: "onmousedown", type: "js", helpDefault: "blank", help: "Initiates a client-side script when the mouse is pressed down on this element." },
    { name: "onmousemove", type: "js", helpDefault: "blank", help: "Initiates a client-side script when the mouse is moving within this element." },
    { name: "onmouseout", type: "js", helpDefault: "blank", help: "Initiates a client-side script when the mouse is moved off this element." },
    { name: "onmouseover", type: "js", helpDefault: "blank", help: "Initiates a client-side script when the mouse is moved over this element." },
    { name: "onmouseup", type: "js", helpDefault: "blank", help: "Initiates a client-side script when the mouse button is released off this element." }
  ];
  
  Array.prototype.push.apply(model, partdeux);  //Add all from part2 into model.

  return model;
};

/**
 * Adopt everything from standard widget properties, excluding the "controls" list, allowing a layout to use the same text, bindings, etc.
 * Note: if a layout uses this function and "controls" was set on the property, then DataFields.js::getPostData() and Designer.js::getJSON()
 * need exceptions for the property and template.
 * @param {Array.<Object>} list       Output. List of property configs to add to.
 * @param {Array.<String>} propNames
 */
pui.layout.adoptNamedProperties = function (list, propNames) {
  if (pui.layout.adoptedProperty === null || typeof pui.layout.adoptedProperty != "object") {
    pui.layout.adoptedProperty = {};
  }

  for (var i=0, n=propNames.length; i < n; i++) {
    var propName = propNames[i];
    if (pui.layout.adoptedProperty[propName] == null) {
      // Create another cached copy of the global property for use by templates.
      pui.layout.adoptedProperty[propName] = {
        name: propName
      };
      var nmodel = getPropertiesNamedModel();
      if (nmodel[propName] != null && typeof nmodel[propName] == "object") {
        try {
          // Add references to the global property in the new object.
          for (var key in nmodel[propName]) {
            pui.layout.adoptedProperty[propName][key] = nmodel[propName][key];
          }
          delete pui.layout.adoptedProperty[propName]["controls"];
          //This may be added after property definitions are setup and has cyclic references and isn't needed.
          delete pui.layout.adoptedProperty[propName].selection;
        }
        catch (exc) {
          console.log("error adopting property:", exc.message);
        }
      }
    }
    list.push( pui.layout.adoptedProperty[propName] );
  }
};

// Define the properties that appear in Template Settings in Designer.
pui.layout.getProperties = function (template) {
  var templateProperties;
  var borderStyles = ["none", "dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset"];
  var borderWidths = ["thin", "medium", "thick", "0px", "1px", "2px", "3px", "4px", "5px", "Other..."];
  
  // Shared between tab panels and accordions.
  var lazyLoadProps = [
    { name: "lazy load", choices: ["true", "false"], helpDefault: "false",
      help: "When true, render contents of a tab or section after the user activates it instead of rendering everything immediately (which can be slower)."
    },
    { name: "onlazyload", type: "js", helpDefault: "blank",
      help: "Initiates a client-side script after a container is rendered lazily. (See lazy load property.)"
    }
  ];
  
  switch (template) {
    case 'css panel':
      templateProperties = [
        {
          name: "has header",
          choices: ["true", "false"],
          helpDefault: "theme", help: "Determines whether the panel has a header."
        },
        {
          name: "header height",
          format: "number",
          helpDefault: "theme", help: "Specifies the height of the panel header."
        },
        {
          name: "header text",
          helpDefault: "placeholder", help: "Specifies the text that will appear in the panel header.",
          translate: true
        },
        {
          name: "header theme",
          choices: ["A - Black", "B - Blue", "C - Gray", "D - Light Gray", "E - Yellow", "F - Green", "G - Red", "Other..."],
          helpDefault: "theme", help: "Specifies the jQuery Mobile theme to use for the panel header. The theme is associated with a set of cascading style sheet rules.",
          helpAdd: ["other"], helpNote: "When you enter a custom value, a CSS class is add to the body of the panel in the form of <code>ui-btn-up-YourCustomValue</code>, where YourCustomValue is the exact text that was entered, including special characters, such as ' ', '-', and '_', and regardless of their validity in a CSS class name. This will allow you to customize the styling of the header using that CSS class name."
        },
        {
          name: "body theme",
          choices: ["A - Black", "B - Blue", "C - Gray", "D - Light Gray", "E - Yellow", "F - Green", "G - Red", "Other..."],
          helpDefault: "theme", help: "Specifies the jQuery Mobile theme to use for the panel body. The theme is associated with a set of cascading style sheet rules.",
          helpAdd: ["other"], helpNote: "When you enter a custom value, a CSS class is add to the body of the panel in the form of <code>ui-btn-up-YourCustomValue</code>, where YourCustomValue is the exact text that was entered, including special characters, such as ' ', '-', and '_', and regardless of their validity in a CSS class name. This will allow you to customize the styling of the body using that CSS class name."
        },
        {
          name: "straight edge",
          choices: ["all", "left", "right", "top", "bottom"],
          helpDefault: "theme", help: "Determines which parts of the element will have a straight edge instead of rounded corners."
        }
      ];

      pui.layout.adoptNamedProperties(templateProperties, ["color", "font family", "font size", "font style", "font weight", "text align", "text decoration", "text transform"]);
      break;


    case 'accordion':
      templateProperties = [
        {
          name: "section names",
          type: "list",
          helpDefault: "placeholder", help: "Specifies a comma separate list of section names for the accordion.",
          translate: true
        },
        {
          name: "active section",
          format: "number",
          helpDefault: "0", help: "This property specifies the initial active section on an Accordion Layout. Each section within an Accordion is identified by a sequential index, starting with 0 for the first section, 1 for the second section, and so on. When this property is bound to a field, the currently-active section will be included in the response when the screen is submitted to the server-side program."
        },
        {
          name: "header theme",
          choices: ["A - Black", "B - Blue", "C - Gray", "D - Light Gray", "E - Yellow", "F - Green", "G - Red", "Other..."],
          helpDefault: "theme", help: "Specifies the jQuery Mobile theme to use for the accordion headers.  The theme is associated with a set of cascading style sheet rules.", 
          helpAdd: ["other"], helpNote: "When you enter a custom value, a CSS class is add to the header the panel in the form of <code>ui-btn-up-YourCustomValue</code>, where YourCustomValue is the exact text that was entered, including special characters, such as ' ', '-', and '_', and regardless of their validity in a CSS class name. This will allow you to customize the styling of the header using that CSS class name."
        },
        {
          name: "body theme",
          choices: ["A - Black", "B - Blue", "C - Gray", "D - Light Gray", "E - Yellow", "F - Green", "G - Red", "Other..."],
          helpDefault: "theme", help: "Specifies the jQuery Mobile theme to use for the content body of the accordion.  The theme is associated with a set of cascading style sheet rules.",
          helpAdd: ["other"], helpNote: "When you enter a custom value, a CSS class is add to the body of the panel in the form of <code>ui-btn-up-YourCustomValue</code>, where YourCustomValue is the exact text that was entered, including special characters, such as ' ', '-', and '_', and regardless of their validity in a CSS class name. This will allow you to customize the styling of the body using that CSS class name."
        },
        {
          name: "small sections",
          choices: ["true", "false"],
          helpDefault: "false", help: "This property uses CSS to provide a smaller, more compact version of the header sections."
        },
        {
          name: "allow collapse",
          choices: ["true", "false"],
          helpDefault: "true", help: "Determines if the accordion can be fully collapsed."
        },
        {
          name: "straight edge",
          choices: ["all", "left", "right", "top", "bottom"],
          helpDefault: "blank", help: "Determines which parts of the element will have a straight edge instead of rounded corners."
        }
      ];

      pui.layout.adoptNamedProperties(templateProperties, ["color", "font family", "font size", "font style", "font weight", "text align", "text decoration", "text transform"]);

      templateProperties.push({
        name: "onsectionclick",
        type: "js",
        wf: true,
        helpDefault: "blank", help: "Initiates a client-side script when an accordion section is expanded.  The section index is passed to the event as a parameter named \"section\".  If the client-side script evaluates to false, the section will not be expanded."
      });

      Array.prototype.push.apply(templateProperties, lazyLoadProps);  //Add all lazyLoadProps to templateProperties.
      break;


    case 'responsive layout':
      templateProperties = [
        { name: "layout items", helpDefault: "5", help: "The number of containers for this layout.", helpAdd: ["other"], choices: ['1', '2', '3', '4', '5', '6', 'Other...'] },
        { name: "style rules", type: "responsive", helpDefault: "blank", help: "String of CSS stylesheet rules, used to define positions and dimensions of containers. Leave empty when styles are expected to be defined in an external stylesheet. See <a target=\"_blank\" href=\"http://www.profoundlogic.com/docs/display/PUI/Responsive+Layout\">Responsive Layout</a> for more information." },
        { name: "use viewport", helpDefault: "true", help: "Determines how @media rules in &quot;style rules&quot; are interpreted. When &quot;use viewport&quot; is true, " +   "the page size determines which @media rules to apply. When false, the layout's height and width determine which @media rules to apply. <br><br>See " +   "<a href=\"http://www.profoundlogic.com/docs/display/PUI/Responsive+Layout\" target=\"_blank\">Responsive Layout</a> for more information.", choices: ["true", "false"] },
        { name: "container names", type: "list", helpDefault: "blank", help: "List of container names to aid in designing screens. Names appear only in Responsive Dialog preview and Designer canvas." }
      ];
      break;


    case 'tab panel':
      templateProperties = [];
      pui.layout.adoptNamedProperties(templateProperties, ["tab names", "active tab", "ontabclick", "tab response", "response AID", 
        "bypass validation", "color", "font family", "font size", "font style", "font weight",
        // Note: the layout doesn't use text-align, which is useless with tabs; tabs are only as wide as the text.
        "text decoration", "text transform"]);
      
      templateProperties.push({ name: "movable tabs", choices: ["true", "false"], type: "boolean", validDataTypes: ["indicator", "expression"],
        hideFormatting: true, helpDefault: "false", help: "Allows the user to rearrange tabs at runtime.", context: "dspf" });

      Array.prototype.push.apply(templateProperties, lazyLoadProps);  //Add all lazyLoadProps to templateProperties.
      break;
      
    case 'fieldset':
      templateProperties = [
        { name: "legend", help: "Text to display in the field set&apos;s legend.", helpDefault: "Field Set", "translate": true, bind: true, "showDesignValue": true },
        { name: "legend align", help: "The alignment of the legend text.", helpDefault: "left", choices: ['left','center','right'] },
        { name: "legend style", help: "Styling for the legend text.", type: 'long' },
        { name: "border style", choices: borderStyles, helpDefault: "css", help: "The style of the element&apos;s border." },
        { name: "border width", format: "px", choices: borderWidths, helpDefault: "css", help: "The thickness of the element&apos;s border.", helpAdd: ["other"] }
      ];
      pui.layout.adoptNamedProperties(templateProperties, ["border color" ]);
      break;


    default:
      // Other: user-defined templates or HTML-based ones that must be parsed.
      var returnPropsArg = {
        template: template,
        returnProps: true
      };
      
      // A custom template, including properties, could be defined by a function instead of being parsed in HTML. (Undocumented, but at least one customer uses it.) # 
      var tpl = pui.layout["templates"][template];
      if (typeof tpl == "function") return tpl(returnPropsArg);

      // The template is HTML text--either from one of our templates or from a user-defined one; properties must be parsed to be returned.
      return pui.layout.template.processHTML(returnPropsArg);
  }
  
  return pui.layout.getPropertiesModel(templateProperties);
};