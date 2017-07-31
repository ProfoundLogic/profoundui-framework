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

/**
 * Return a list of each layout with screen positions. The list is ordered so that higher-level layouts 
 * (those inside other layouts) are first in the list. A child layout should always appear in the list 
 * before a parent layout, because checkLayouts() in Resizer.js expects that order.
 * 
 * @param {Object} designer     The Visual Designer object; e.g. window.toolbar.designer.
 * @returns {Array}
 */
pui.layout.template.getContainerPositions = function(designer) {
  var positions = [];
  var layouts = designer.layouts;
  
  //Get the level of each layout into a map: temporary array to hold objects with position and sort-value.
  //Use a map to improve sort performance: array.sort may call the comparison functions often. Screens 
  //with many layouts may slow down each time the user clicks an item. 
  //Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  var mapped = designer.layouts.map(function(el, i){
    return { index: i, value: el.getLayoutLevel() };
  });
  
  //Sort the list. Parent layouts should always be later in the list than child layouts. See issue 3662.
  mapped.sort(function(layout1, layout2) {
    if (layout1.value > layout2.value) return -1;  //the first has a higher level, so move it toward the beginning.
    if (layout1.value < layout2.value) return 1;   //the first has a lower level, so move it toward the end.
    return 0;   //the levels were the same, so leave them in the same positions in the list (relative to each other).
  });
  
  //Get the sorted list of layouts.
  var layouts = mapped.map(function(el){
    return designer.layouts[ el.index ];
  });
  
  for (var i = 0; i < layouts.length; i++) {
    var layout = layouts[i];
    var div = layout.dom;
    var containers = pui.layout.template.getContainers(div);
    for (var j = 0; j < containers.length; j++) {
      var container = containers[j];
      positions.push( pui.layout.getPosObjFromLayoutCont(layout, container) );
    }
  }
  designer.layoutContainerPositions = positions;
  return positions;
};

/**
 * Given a layout and a container DOM node, get a positionObject. 
 * Needed by pui.layout.template.getContainerPositions and in vdesigner.js, onNodeEnter.
 * @param {Object} layout
 * @param {Object} container  
 * @returns {Object}          A wrapper for a layout & container, with positions offset for the canvas.
 */
pui.layout.getPosObjFromLayoutCont = function(layout, container){
      
  var offset = pui.layout.getContainerOffset(container);
  var left = offset.x;
  var top = offset.y;

  var height = container.offsetHeight;
  var width = container.offsetWidth;
  var bottom = top + height;
  var right = left + width;
  height = height - 2;
  if (height < 1) height = 1;
  width = width - 2;
  if (width < 1) width = 1;
  return {
    layout: layout,
    container: container,
    top: top,
    left: left,
    bottom: bottom,
    right: right,
    height: height,
    width: width
  };
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

