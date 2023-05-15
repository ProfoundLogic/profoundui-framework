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
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Lesser General Public License for more details.
//
//  You should have received a copy of the GNU Lesser General Public License
//  In the COPYING and COPYING.LESSER files included with the Profound UI Runtime.
//  If not, see <http://www.gnu.org/licenses/>.

pui.layout["templates"] = {};

/**
 * Enqueue fetching of a custom layout template from an IFS file or URL. A user's script would cause this function to be called.
 * This must be called before pui.render runs; e.g. by a script loaded automatically in userdata/custom/js/.
 * @param {String} templateName   URL or name of the template. Name is expected to be part of an IFS file name. See issues 3548, 5999.
 */
pui["retrieveCustomLayoutTemplate"] = function(templateName) {
  if (typeof templateName === "string" && templateName.length > 0) {
    pui.customLayoutTemplateQueue = pui.customLayoutTemplateQueue || [];

    var url = templateName;
    if (templateName.substr(0, 1) != "/" &&
      templateName.substr(0, 5).toLowerCase() != "http:" &&
      templateName.substr(0, 6).toLowerCase() != "https:") {
      url = "/profoundui/userdata/layouts/" + templateName + ".html";
    }

    pui.customLayoutTemplateQueue.push({
      templateName: templateName,
      url: pui.normalizeURL(url)
    });
  }
};

pui["maximizeLayout"] = function(e) {
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
  itemDom.layout.resize();
  designer.selection.add(item);
  designer.propWindow.refresh();
  preventEvent(e);
};

/**
 * Call a template builder function, call a constructor, or process some text to build a layout. applyTemplate calls this.
 * @param {Object} parms
 * @returns {Element}   Returns the DOM element containing the layout.
 */
pui.layout.template.load = function(parms) {
  // All templates do this: get a new wrapper div.
  var dom;
  var existingDom = parms.dom;
  if (existingDom != null) {
    dom = existingDom.cloneNode(false);
  }
  else {
    dom = document.createElement("div");
  }
  dom.innerHTML = "";

  var template = pui.layout["templates"][parms.template];
  switch (parms.template) {
    case "css panel":
      dom = pui.layout.template.cssPanelTemplate(parms, dom);
      break;

    // Constructors for these templates do everything, obviating an extra template loader file.
    case "accordion":
      new pui.Accordion(parms, dom);
      break;

    case "tab panel":
      new pui.TabLayout(parms, dom);
      break;
    case "responsive layout":
      var constr = parms.designMode ? pui.designer.responsive.ResponsiveLayout : pui.ResponsiveLayout;
      new constr(parms, dom);
      break;
    case "fieldset":
      new pui.FieldsetLayout(parms, dom);
      break;

    default:
      // custom function provided instead of HTML. (Customer templates could reach this; also
      // simple container, table, and mobile device reach here.)
      if (typeof template == "function") dom = template(parms);
      // The template is probably contained in an HTML string and needs to be processed.
      else dom = pui.layout.template.processHTML(parms, dom);
      break;
  }
  return dom;
};

pui.layout.maximizeIcon = "<div condition=\"{ designValue: 'true', runtimeValue: 'false', proxyValue: 'false' }\" title=\"Maximize\" style=\"position: absolute; top: 2px; right: 2px; width: 16px; height: 16px; cursor: pointer; background-image: url(/profoundui/proddata/images/icons/maximize.png)\" onmousedown=\"pui.maximizeLayout(event)\" />";

pui.layout["templates"]["simple container"] = "<div style=\"position: relative; width: 100%; height: 100%; overflow: hidden; overflow-x: { property: 'overflow x', helpDefault: 'hidden', help: 'Determines whether a horizontal scrollbar should be displayed.', " +
  "choices: ['visible', 'hidden', 'scroll', 'auto'] }; overflow-y: { property: 'overflow y', helpDefault: 'hidden', help: 'Determines whether a vertical scrollbar should be displayed.', " +
  "choices: ['visible', 'hidden', 'scroll', 'auto'] };\"><div stretch=\"true\" container=\"true\" style=\"overflow: hidden; { designValue: 'border: 2px dashed #666666;' } { proxyValue: 'width: 97px; height: 97px;' } \"></div></div>";

pui.layout["templates"]["table"] = "<table style=\"empty-cells: show; overflow: hidden;\" width=\"100%\" height=\"100%\"><tr repeat=\"{ property: 'rows', helpDefault: '2', help: 'Specifies the number of table rows for this layout.' }\"><td style=\"border: { designValue: '1', runtimeValue: 0 }px dashed #666666;\" " +
    "repeat=\"{ property: 'columns', helpDefault: '2', help: 'Specifies the number of table columns for this layout.' }\"><div stretch=\"true\" container=\"true\" style=\"position: relative; width: 100%; overflow: hidden;\"></div></td></tr></table>";
pui.layout["templates"]["table"] += pui.layout.maximizeIcon;

pui.layout["templates"]["mobile device"] = "<table cellpadding=\"0\" cellspacing=\"0\">";
pui.layout["templates"]["mobile device"] += "<tr condition=\"{ property: 'top bar', choices: ['true','false'], helpDefault: 'true', help: 'Determines whether the mobile layout should have a top bar.' }\"><td class=\"top-bar\"><div container=\"true\" class=\"top-bar\" style=\"position: relative; width: 100%; overflow: hidden;\"></div></td></tr>";
pui.layout["templates"]["mobile device"] += "<tr><td class=\"content-section\"><div class=\"content-section\" stretch=\"true\" container=\"true\"></div></td></tr>";
pui.layout["templates"]["mobile device"] += "<tr condition=\"{ property: 'bottom bar', choices: ['true','false'], helpDefault: 'true', help: 'Determines whether the mobile layout should have a bottom bar.' }\"><td class=\"bottom-bar\"><div container=\"true\" class=\"bottom-bar\" style=\"position: relative; width: 100%; overflow: hidden;\"></div></td></tr>";
pui.layout["templates"]["mobile device"] += "</table>";
pui.layout["templates"]["mobile device"] += pui.layout.maximizeIcon;

// Having these placeholders makes getTemplateList include these templates.
pui.layout["templates"]["css panel"] = true;
pui.layout["templates"]["accordion"] = true;
pui.layout["templates"]["responsive layout"] = true;
pui.layout["templates"]["tab panel"] = true;
pui.layout["templates"]["fieldset"] = true;

/**
 * Returns an array of template name strings. Referenced in pui.layout.getPropertiesModel, getTemplateList should be called any time
 * the PropertiesWindow shows choices for the "templates" property in a layout.
 * @returns {Array}
 */
pui.layout.getTemplateList = function() {
  var templates = pui.layout["templates"];
  var list = [];
  for (var x in templates) {
    list.push(x);
  }
  return list;
};
