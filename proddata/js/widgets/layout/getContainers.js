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
 
}




pui.layout.template.getContainerPositions = function(designer) {
  var positions = [];
  var layouts = designer.layouts;
  layouts.sort(function(layout1, layout2) {
    if (pui.designer.isDescendant(layout1.dom, layout2.dom, designer.container)) return 1;
    if (pui.designer.isDescendant(layout2.dom, layout1.dom, designer.container)) return -1;
    return 0;
  });
  for (var i = 0; i < layouts.length; i++) {
    var layout = layouts[i];
    var div = layout.dom;
    var divTop = div.offsetTop;
    var divLeft = div.offsetLeft;
    var containers = pui.layout.template.getContainers(div);
    for (var j = 0; j < containers.length; j++) {
      var container = containers[j];
      
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
      positions.push({
        layout: layout,
        container: container,
        top: top,
        left: left,
        bottom: bottom,
        right: right,
        height: height,
        width: width
      });
    }
  }
  designer.layoutContainerPositions = positions;
  return positions;
}





pui.layout.getContainerOffset = function(containerDom) {
  var x = 0;
  var y = 0;
  var elem = containerDom;
  while (elem != null && (elem.layout == null || elem.parentNode.getAttribute("container") == "true")) {
    x += elem.offsetLeft;
    y += elem.offsetTop;
    elem = elem.offsetParent;
  }
  if (elem != null) {
    x += elem.offsetLeft;
    y += elem.offsetTop;
  }
  return {
    x: x,
    y: y
  }
}

