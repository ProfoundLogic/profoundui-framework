//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2017 Profound Logic Software, Inc.
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



function buildOutputField(parms, value, labelForId) {
  if (!parms.design) {
    var originalValue = getInnerText(parms.oldDom);
    if (originalValue != null && originalValue != "" && parms.dom.originalValue == null) {
      parms.dom.originalValue = originalValue;
    }       
  }
  parms.dom.innerHTML = "";
  var text = value;
  text = text.replace(/ /g, "\u00a0");

  // If the "label for" property was set, create a <label> tag
  if (labelForId) {
	  labelElem = document.createElement("label");
	  labelElem.htmlFor = labelForId;
	  textNode = document.createTextNode(text);
	  labelElem.appendChild(textNode);
	  parms.dom.appendChild(labelElem);
  } else {
	  parms.dom.appendChild(document.createTextNode(text));  
  }
  
  if (context == "dspf" && parms.design) {
    var overflowX = parms.properties["overflow x"];
    if (overflowX == null) overflowX = "";
    var overflowY = parms.properties["overflow y"];
    if (overflowY == null) overflowY = "";
    if (parms.propertyName == "value" && pui.isBound(parms.newValue) ||
        parms.propertyName != "value" && pui.isBound(parms.properties.value)) {      
      if (overflowX == "") parms.dom.style.overflowX = "hidden";
      if (overflowY == "") parms.dom.style.overflowY = "hidden";
    }
    else {
      parms.dom.style.overflowX = overflowX;
    }
  }
}



pui.widgets.add({
  name: "output field",
  newValue: "New Output Field",
  inlineEdit: true,

  propertySetters: {
  
    "field type": function(parms) {
      buildOutputField(parms, parms.evalProperty("value"), parms.evalProperty("label for"));      
    },
    
    "value": function(parms) {
      if (parms.design || parms.properties["value"] != "script: value") {
        buildOutputField(parms, parms.value, parms.evalProperty("label for"));
      }
    },
    
    "overflow x": function(parms) {
      if (context == "dspf" && parms.design && pui.isBound(parms.properties.value) && (parms.value == "" || parms.value == null)) {
        parms.properties["overflow x"] = "";
        parms.dom.style.overflowX = "hidden";
        return false;
      }
    }
        
  }
  
});


