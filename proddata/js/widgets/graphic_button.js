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



function buildGraphicButton(parms) {
  var dom = parms.dom;
  var value = parms.evalProperty("value");
  var imageSource = parms.evalProperty("image source");
  var vectorIcon = parms.evalProperty("icon");
  var iconPosition = parms.evalProperty("icon position");
  var cssClass = parms.evalProperty("css class");
  if (cssClass) cssClass = trim(cssClass);
  if (parms.properties["value"] == "script: value") {
    if (value == "") value = parms.dom.innerHTML;
    if (value.substr(0,5).toLowerCase() == "<img ") {
      var pos = value.indexOf(">");
      if (pos >= 0) {
        value = value.substr(pos + 1);
      }
      else {
        value = "";
      }
    }
  }
  var graphic = "";
  if (imageSource != null && imageSource != "" ) {
    graphic = '<img src="' + pui.normalizeURL(imageSource) + '" style="vertical-align:middle;padding-bottom:2px;" /> ';
  }
  var icon = "";
  if (vectorIcon && iconPosition) {
    vectorIcon = trim(vectorIcon);
    if (vectorIcon.substr(0,9) == 'material:') {
      vectorIcon = trim(vectorIcon.substr(9));
      icon = '<span class="pui-material-icons pui-material-icons-center ' + (cssClass? cssClass: '') +'">'+ vectorIcon + '</span>';
      if (value) value = '<span class="pui-material-icons-text ' + (cssClass? cssClass: '') + '">' + value + '</span>';
    } else if (vectorIcon.substr(0,12) == 'fontAwesome:') {
      vectorIcon = trim(vectorIcon.substr(12));
      icon = '<span class="pui-fa-icons pui-fa-icons-center fa-' + vectorIcon + ' ' + (cssClass? cssClass: '') +'"></span>';
      if (value) value = '<span class="pui-fa-icons-text ' + (cssClass? cssClass: '') + '">' + value + '</span>';
    }
  } else {
    icon = graphic;
  }
  dom.setAttribute("type", "button");
  if (iconPosition === 'right') dom.innerHTML = value + icon;
  else dom.innerHTML = icon + value;
}


pui.widgets.add({
  name: "graphic button",
  tag: "button",
  inputType: "button",
  newValue: "Accept",
  inlineEdit: true,
  defaults: {
    "width": !pui["is_quirksmode"] ? "100px" : null,
    "icon position": "left",
    "image source": "/profoundui/proddata/images/accept.png",
    "color": "#009933",
    "font weight": "bold"
  },

  propertySetters: {
  
    "field type": function(parms) {
      buildGraphicButton(parms);
    },
    
    "value": function(parms) {
      parms.properties["value"] = parms.value;
      buildGraphicButton(parms);
    },
    
    "image source": function(parms) {
      parms.properties["image source"] = parms.value;
      buildGraphicButton(parms);
    },
    "icon": function(parms) {
      parms.properties["icon"] = parms.value;
      buildGraphicButton(parms);
    },
    "icon position": function(parms) {
      parms.properties["icon position"] = parms.value;
      buildGraphicButton(parms);
    },
    "css class": function(parms) {
      parms.properties["css class"] = parms.value;
      buildGraphicButton(parms);
    }
    
  }
  
});



