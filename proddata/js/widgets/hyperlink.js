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



pui["encode hyperlink spaces"] = null;

pui.buildHyperlink = function(dom, value, designMode, href, target) {
  dom.innerHTML = "";
  var a = document.createElement("a");
  var noHref = false;
  if (designMode == true || href == null)  { 
    href = "javascript:void(0)";
    noHref = true;
  }
  a.href = href;
  if (!designMode && target != null) a.target = target;
  var text = value;
  if ( (context == "genie" && pui["encode hyperlink spaces"] != false) ||
       (pui["encode hyperlink spaces"] == true) ) {
    text = text.replace(/ /g, "\u00a0");
  }
  if (dom.style.color != null) a.style.color = dom.style.color;
  if (dom.style.textDecoration != null) a.style.textDecoration = dom.style.textDecoration;
  a.appendChild(document.createTextNode(text));
  if (pui["is_old_ie"] && noHref && (context == "dspf" || context == "genie")) {
    addEvent(a, "click", function(e) {
      if (e.preventDefault) e.preventDefault(); 
      e.returnValue = false;
      return false;      
    });
  }
  dom.appendChild(a);
}


pui.widgets.add({
  name: "hyperlink",
  newValue: "Click Here",
  inlineEdit: true,
  defaults: {
    color: "#0066CC"
  },
  
  propertySetters: {
  
    "field type": function(parms) {
      
      pui.buildHyperlink(parms.dom, parms.evalProperty("value"), parms.design, parms.properties["hyperlink reference"], parms.properties["target"]);
      if (parms.design) {
        designUtils.addEvent(parms.dom, "mouseover", function() {
          setTimeout(parms.designItem.designer.selection.positionSizies, 0);
        });
        designUtils.addEvent(parms.dom, "mouseout", function() {
          setTimeout(parms.designItem.designer.selection.positionSizies, 0);
        });
      }
    },
    
    "value": function(parms) {
      pui.buildHyperlink(parms.dom, parms.value, parms.design, parms.properties["hyperlink reference"], parms.properties["target"]);
    }
    
  }
  
});




