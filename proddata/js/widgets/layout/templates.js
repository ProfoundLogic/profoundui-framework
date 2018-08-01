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

function helpTextTemplatesProperties(defVal, descVal, descAdd, noteVal) {
  var codeOpen = "<code>";
  var codeClose = "</code>";
  var falseSpan = "<span>false</span>";
  var trueSpan = "<span>true</span>";
  var blankSpan = "<span>[blank]</span>";
  var cssSpan = "[<span>CSS value</span>]";
  var placeholderSpan = "[<span>placeholder text</span>]";
  var browserSpan = "[<span>browser setting</span>]";
  var widgetSpan = "[<span>selected widget</span>]";
  var themeSpan = "[<span>selected widget</span>]";
  var skinSpan = "[<span>selected skin</span>]";
  var idSpan = "[<span>WidgetName</span>][<span>number</span>]";
  var positionSpan = "[<span>user drop point</span>]";
  var bindSpan = "<span>[bound value]</span>";
  var otherText = " The &apos;Other...&apos; option can be selected to write in a custom value.";
  var pixelText = "Specify in pixels. <br><br>Example: " + codeOpen + "12px" + codeClose;

  // var listStyleTag = "<style>ul.listing {display: block; list-style-type: disc; padding-left: 10px; margin-left: 15px;}</style>";
  // var optionsOpen = "<hr><span style='font-weight:bold;'>Valid options</span>: <br><ul class='listing'><li>";
  // var optionsClose = "</li></ul>";

  // ------------------
  // Default Value:
  var helpString = "<hr><b>Default Value:</b> ";
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
  helpString += "<hr><b>Description: </b>";
  // Description text...
  helpString += descVal;

  // Other...
  if (descAdd.indexOf("other") != -1) {
    helpString += otherText;
  }
  // Note: Text...
  if (descAdd.indexOf("note") != -1) {
    helpString += "<br><br><b>Note: </b>" + noteVal;
  }
  // ------------------
  helpString += "<hr><br>";

  return helpString;
}

pui.layout["templates"] = {};

/**
 * Retrieve a custom layout template from an IFS file or URL. A user's script would cause this to run.
 * @param {String} templateName   Name of the template, also part of the IFS file name.
 * @returns {undefined}
 */
pui.layout.retrieveTemplate = function (templateName) {

  var url = templateName;

  if (templateName.substr(0, 1) != "/" &&
    templateName.substr(0, 5).toLowerCase() != "http:" &&
    templateName.substr(0, 6).toLowerCase() != "https:") {
    url = "/profoundui/userdata/layouts/" + templateName + ".html";
  }

  //Synchronously fetch the template HTML so that it's ready before pui.render. Issue 3548. Note: this makes a deprecated
  //warning appear in the console. An alternative is to adapt the "dependencies" feature to load the template before pui.render.
  var req = new pui.Ajax({
    "url": pui.normalizeURL(url),
    "method": "post",
    "suppressAlert": true
  });
  req["async"] = false;
  req.send();
  if (req.ok()) {
    pui.layout["templates"][templateName] = req.getResponseText();
  } else {
    //Note: processHTML will fall back to "simple container", because this template didn't exist.
    console.log("Failed to load custom layout template:", templateName);
  }
};

pui["retrieveCustomLayoutTemplate"] = function (templateName) {
  pui.layout.retrieveTemplate(templateName);
};

pui["maximizeLayout"] = function (e) {
  var itemDom = getTarget(e).parentNode;
  var designer = toolbar.designer;
  var item = designer.getDesignItemByDomObj(itemDom);
  designer.undo.start("Maximize Layout");
  designer.undo.add(item, "left");
  designer.undo.add(item, "top");
  designer.undo.add(item, "width");
  designer.undo.add(item, "height");
  itemDom.style.left = "0px";
  item.properties["left"] = "0px";
  item.propertiesChanged["left"] = true;
  itemDom.style.top = "0px";
  item.properties["top"] = "0px";
  item.propertiesChanged["top"] = true;
  itemDom.style.width = "100%";
  item.properties["width"] = "100%";
  item.propertiesChanged["width"] = true;
  itemDom.style.height = "100%";
  item.properties["height"] = "100%";
  item.propertiesChanged["height"] = true;
  designer.changedScreens[designer.currentScreen.screenId] = true;
  designer.makeDirty();
  designer.selection.clear();
  itemDom.layout.stretch();
  designer.selection.add(item);
  designer.propWindow.refresh();
  preventEvent(e);
};

pui.layout.maximizeIcon = "<div condition=\"{ designValue: 'true', runtimeValue: 'false', proxyValue: 'false' }\" title=\"Maximize\" style=\"position: absolute; top: 2px; right: 2px; width: 16px; height: 16px; cursor: pointer; background-image: url(/profoundui/proddata/images/icons/maximize.png)\" onmousedown=\"pui.maximizeLayout(event)\" />";

//pui.layout.retrieveTemplate("table");

//pui.layout.retrieveTemplate("test");

pui.layout["templates"]["simple container"] = "<div style=\"position: relative; width: 100%; height: 100%; overflow: hidden; overflow-x: { property: 'overflow x', help: '" + helpTextTemplatesProperties("hidden","Determines whether a horizontal scrollbar should be displayed.", [], "") + "', choices: ['visible', 'hidden', 'scroll', 'auto'] }; overflow-y: { property: 'overflow y', help: '" + helpTextTemplatesProperties("hidden","Determines whether a vertical scrollbar should be displayed.", [], "") + "', choices: ['visible', 'hidden', 'scroll', 'auto'] };\"><div stretch=\"true\" container=\"true\" style=\"overflow: hidden; { designValue: 'border: 2px dashed #666666;' } { proxyValue: 'width: 97px; height: 97px;' } \"></div></div>";

pui.layout["templates"]["table"] = "<table style=\"empty-cells: show; overflow: hidden;\" width=\"100%\" height=\"100%\"><tr repeat=\"{ property: 'rows', help: '" + helpTextTemplatesProperties("2","Specifies the number of table rows for this layout.", [], "") + "' }\"><td style=\"border: { designValue: '1', runtimeValue: 0 }px dashed #666666;\" repeat=\"{ property: 'columns', help: '" + helpTextTemplatesProperties("2","Specifies the number of table columns for this layout.", [], "") + "' }\"><div stretch=\"true\" container=\"true\" style=\"position: relative; width: 100%; overflow: hidden;\"></div></td></tr></table>";
pui.layout["templates"]["table"] += pui.layout.maximizeIcon;

pui.layout["templates"]["mobile device"] = "<table cellpadding=\"0\" cellspacing=\"0\">";
pui.layout["templates"]["mobile device"] += "<tr condition=\"{ property: 'top bar', choices: ['true','false'], help: '" + helpTextTemplatesProperties("true","Determines whether the mobile layout should have a top bar.", [], "") + "' }\"><td class=\"top-bar\"><div container=\"true\" class=\"top-bar\" style=\"position: relative; width: 100%; overflow: hidden;\"></div></td></tr>";
pui.layout["templates"]["mobile device"] += "<tr><td class=\"content-section\"><div class=\"content-section\" stretch=\"true\" container=\"true\"></div></td></tr>";
pui.layout["templates"]["mobile device"] += "<tr condition=\"{ property: 'bottom bar', choices: ['true','false'], help: '" + helpTextTemplatesProperties("true","Determines whether the mobile layout should have a bottom bar.", [], "") + "' }\"><td class=\"bottom-bar\"><div container=\"true\" class=\"bottom-bar\" style=\"position: relative; width: 100%; overflow: hidden;\"></div></td></tr>";
pui.layout["templates"]["mobile device"] += "</table>";
pui.layout["templates"]["mobile device"] += pui.layout.maximizeIcon;

pui.layout["templates"]["css panel"] = pui.layout.template.cssPanelTemplate;

pui.layout["templates"]["accordion"] = pui.layout.template.accordionTemplate;

pui.layout["templates"]["fieldset"] = "<fieldset style=\"width:100%; height:100%; position:relative;" +
  " border-style:{property:'border style', choices:['none', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset'], defaultValue:'solid', help:'" + helpTextTemplatesProperties("solid","The style of the element&apos;s border.", [], "") + "'};" +
  " border-width:{property:'border width', choices:['1px','2px','3px','Other...'], defaultValue:'1px', help:'" + helpTextTemplatesProperties("1px","The width of the element&apos;s border.", [], "") + "'};" +
  " border-color:{property:'border color', type:'color', defaultValue:'black', help:'" + helpTextTemplatesProperties("black","The color of the element&apos;s border.", [], "") + "'};"
  //Note: legend align has been deprecated in HTML5. The equivalent in CSS requires a bunch of style rules that aren't easily done in a plain HTML template.
  //In the future, this template may need to be implemented in JavaScript.
  +
  '"><legend align="{property: \'legend align\', choices:[\'left\',\'right\',\'center\'], help:\'' + helpTextTemplatesProperties("left","The width of the element&apos;s border.", [], "") + '\'}">' +
  '{property: "legend", help:\'' + helpTextTemplatesProperties("Field Set","Text to display in the field set&apos;s legend.", [], "") + '\'}</legend>' +
  '<div container="true" style="width:100%; height:100%; position:absolute; overflow:hidden;"></div>' +
  '</fieldset>';

pui.layout["templates"]["responsive layout"] = pui.layout.template.responsiveLayoutTemplate;
pui.layout["templates"]["tab panel"] = pui.layout.template.tabTemplate;

/**
 * Returns an array of template name strings. pui.layout.getPropertiesModel calls this,
 * allowing Designer to show the list of templates in the "template" property.
 * @returns {Array}
 */
pui.layout.getTemplateList = function () {
  var templates = pui.layout["templates"];
  var list = [];
  for (var x in templates) {
    list.push(x);
  }
  return list;
};


pui.layout.mergeProps = function (templateProps) {
  var props = [];
  var layoutProps = pui.layout.getPropertiesModel();
  for (var i = 0; i < layoutProps.length; i++) {
    if (layoutProps[i].templateProperties == true) {
      for (var j = 0; j < templateProps.length; j++) {
        props.push(templateProps[j]);
      }
    } else {
      props.push(layoutProps[i]);
    }
  }
  return props;
};

/**
 * Adopt everything from a standard widget property, excluding the "controls" list, allowing a layout to use the same text, bindings, etc.
 * Note: if a layout uses this function and "controls" was set on the property, then DataFields.js::getPostData() and Designer.js::getJSON()
 * need exceptions for the property and template.
 * @param {String} propName
 * @returns {Object}
 */
pui.layout.adoptNamedProperty = function (propName) {
  if (pui.layout.adoptedProperty === null || typeof pui.layout.adoptedProperty != "object") {
    pui.layout.adoptedProperty = {};
  }

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
      } catch (exc) {
        console.log("error adopting property:", exc.message);
      }
    }
  }
  return pui.layout.adoptedProperty[propName];
};