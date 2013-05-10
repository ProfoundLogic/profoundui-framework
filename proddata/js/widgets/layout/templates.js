//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2013 Profound Logic Software, Inc.
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



pui.layout.templates = {};


pui.layout.retrieveTemplate = function(templateName) {
  ajax({
    "url": "/profoundui/userdata/layouts/" + templateName + ".html",
    "method": "post",
    "handler": function(html) {
      pui.layout.templates[templateName] = html;
    }
  });
}

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
  itemDom.layout.stretch();
  designer.selection.add(item);
  designer.propWindow.refresh();
  preventEvent(e);
}

pui.layout.maximizeIcon = "<div condition=\"{ designValue: 'true', runtimeValue: 'false', proxyValue: 'false' }\" title=\"Maximize\" style=\"position: absolute; top: 2px; right: 2px; width: 16px; height: 16px; cursor: pointer; background-image: url(/profoundui/proddata/images/icons/maximize.png)\" onmousedown=\"pui.maximizeLayout(event)\" />";



//pui.layout.retrieveTemplate("table");

//pui.layout.retrieveTemplate("test");



pui.layout.templates["simple container"] = "<div style=\"position: relative; width: 100%; height: 100%; overflow: hidden;\"><div stretch=\"true\" container=\"true\" style=\"overflow: hidden; { designValue: 'border: 2px dashed #666666;' } { proxyValue: 'width: 97px; height: 97px;' } \"></div></div>";

pui.layout.templates["table"] = "<table style=\"empty-cells: show; overflow: hidden;\" width=\"100%\" height=\"100%\"><tr repeat=\"{ property: 'rows', help: 'Specifies the number of table rows for this layout.' }\"><td style=\"border: { designValue: '1', runtimeValue: 0 }px dashed #666666;\" repeat=\"{ property: 'columns', help: 'Specifies the number of table columns for this layout.' }\"><div stretch=\"true\" container=\"true\" style=\"position: relative; width: 100%; overflow: hidden;\"></div></td></tr></table>";
pui.layout.templates["table"] += pui.layout.maximizeIcon;

pui.layout.templates["mobile device"] = "<table cellpadding=\"0\" cellspacing=\"0\">";
pui.layout.templates["mobile device"] += "<tr condition=\"{ property: 'top bar', choices: ['true','false'], help: 'Determines whether the mobile layout should have a top bar.' }\"><td class=\"top-bar\"><div container=\"true\" class=\"top-bar\" style=\"position: relative; width: 100%; overflow: hidden;\"></div></td></tr>";
pui.layout.templates["mobile device"] += "<tr><td class=\"content-section\"><div class=\"content-section\" stretch=\"true\" container=\"true\"></div></td></tr>";
pui.layout.templates["mobile device"] += "<tr condition=\"{ property: 'bottom bar', choices: ['true','false'], help: 'Determines whether the mobile layout should have a bottom bar.' }\"><td class=\"bottom-bar\"><div container=\"true\" class=\"bottom-bar\" style=\"position: relative; width: 100%; overflow: hidden;\"></div></td></tr>";
pui.layout.templates["mobile device"] += "</table>";
pui.layout.templates["mobile device"] += pui.layout.maximizeIcon;

pui.layout.templates["css panel"] = pui.layout.template.cssPanelTemplate;

pui.layout.templates["accordion"] = pui.layout.template.accordionTemplate;




pui.layout.getTemplateList = function() {
  var templates = pui.layout.templates;
  var list = [];
  for (var x in templates) {
    list.push(x);
  }
  return list;
}


pui.layout.mergeProps = function(templateProps) {
  var props = [];
  var layoutProps = pui.layout.getPropertiesModel();
  for (var i = 0; i < layoutProps.length; i++) {
    if (layoutProps[i].templateProperties == true) {
      for (var j = 0; j < templateProps.length; j++) {
        props.push(templateProps[j]);
      }      
    }
    else {
      props.push(layoutProps[i]);
    }
  }
  return props;
}
