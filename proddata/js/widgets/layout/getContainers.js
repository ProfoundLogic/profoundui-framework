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



pui.layout.template.getContainers = function(dom) {
  var containers = [];
 
  function traverseNodes(el, isTopLevel) {
    if (el == null) return;
    if (!isTopLevel && el.layout != null) return;  // have reached an embedded layout, quit
    if (el.getAttribute != null) {
      if (el.getAttribute("container") == "true") {
        containers.push(el);
        el.containerNumber = containers.length;
      }
    } 
    var childNodes = el.childNodes;
    if (childNodes == null || childNodes.length == null) return;
    for (var i = 0; i < childNodes.length; i++) {
      traverseNodes(childNodes[i], false);
    }
  }

  traverseNodes(dom, true);
  
  return containers;
 
};

pui.layout.getContainerOffset = function(containerDom) {
  var x = 0;
  var y = 0;
  var elem = containerDom;
  while (elem != null && (elem.layout == null || elem.parentNode.getAttribute("container") == "true")) {
    x += elem.offsetLeft + elem.clientLeft - elem.scrollLeft;
    y += elem.offsetTop + elem.clientTop - elem.scrollTop;
    if (elem == containerDom.parentNode) {
      var comp = pui.getComputedStyle(elem);
      if (comp) {
        if (comp["padding-left"]) x -= parseInt(comp["padding-left"], 10);
        else if (comp["paddingLeft"]) x -= parseInt(comp["paddingLeft"], 10);
        if (comp["padding-top"]) y -= parseInt(comp["padding-top"], 10);
        else if (comp["paddingTop"]) y -= parseInt(comp["paddingTop"], 10);
      }
    }
    elem = elem.offsetParent;
  }
  if (elem != null) {
    x += elem.offsetLeft + elem.clientLeft - elem.scrollLeft;
    y += elem.offsetTop + elem.clientTop - elem.scrollTop;
    if (elem == containerDom.parentNode) {
      var comp = pui.getComputedStyle(elem);
      if (comp) {
        if (comp["padding-left"]) x -= parseInt(comp["padding-left"], 10);
        else if (comp["paddingLeft"]) x -= parseInt(comp["paddingLeft"], 10);
        if (comp["padding-top"]) y -= parseInt(comp["padding-top"], 10);
        else if (comp["paddingTop"]) y -= parseInt(comp["paddingTop"], 10);
      }
    }    
  }
  return {
    x: x,
    y: y
  };
};

