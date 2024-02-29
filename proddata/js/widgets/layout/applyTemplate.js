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

pui.layout.template.applyTemplate = function(parms) {
  var dom = parms.dom;

  var getContainers = pui.layout.template.getContainers;
  var processDOM = pui.layout.template.processDOM;

  var containers = getContainers(dom);

  // find last container that has any widgets
  for (var x = containers.length - 1; x >= 0; x -= 1) {
    if (containers[x].firstChild != null) break;
  }
  x += 1;

  parms.lastContWithWidget = x; // PUI-213: when template changes make sure items can move into the new template.

  var newDom = pui.layout.template.load(parms); // A temporary element that is not attached to the DOM. The element is used to build layouts.
  processDOM(newDom);
  var newContainers = getContainers(newDom);
  var stretchList = [];

  // TODO: instead of moving from the old container to the new container you could do this:
  // 1. given parameters request that the template be able to accommodate whatever widgets are in the layout.
  //    Each JavaScript-based template would have functions to check if a change can be accommodated.
  //    a. return if the changes cannot accommodate the widgets.
  //    b. if the template is HTML based, then use the old approach by attempting to load the template and then checking containers.
  // 2. For JS templates just use the old dom element; no need to clone, move widgets, move nodes, or re-attach properties.
  // Then you could simplify some of the template code; e.g. maybe get rid of pui.layout.Template.prototype.linkToDom.

  // Make sure changing the layout doesn't lose any widgets. If the function returns here, then the DOM and layout
  // objects created in template.load are discarded.
  if (x > newContainers.length) {
    return {
      success: false,
      msg: "The property cannot be applied because it removes a layout section that contains other widgets.  \n\nYou must remove the contained widgets first."
    };
  }

  // move widgets from old container to the new container
  for (var i = 0; i < x; i++) {
    var container = containers[i];
    var newContainer = newContainers[i];
    var child = container.firstChild;
    while (child != null) {
      container.removeChild(child);
      newContainer.appendChild(child);
      child = container.firstChild;
    }
  }

  // get stretch list
  for (var i = 0; i < newContainers.length; i++) {
    var newContainer = newContainers[i];
    if (newContainer.getAttribute("stretch") == "true") {
      stretchList.push(newContainer);
    }
  }

  // Clear the child nodes from the element in the DOM, and move nodes from the temporary element into the DOM element.
  dom.innerHTML = "";
  var child = newDom.firstChild;
  while (child != null) {
    dom.appendChild(newDom.removeChild(child));
    child = newDom.firstChild;
  }

  // To the element in the DOM, attach references to classes and special layout properties.
  // Make sure each layout object's .container property references the correct DOM element.

  if (newDom.panel != null) {
    dom.panel = newDom.panel;
    // Various places in Designer call sizeMe when the layout needs to be sized.
    dom.sizeMe = dom.panel.resize;
    dom.panel.container = dom;
  }

  if (newDom.layoutT != null) {
    newDom.layoutT.linkToDom(dom); // This handles everything necessary for whatever type of class is in layoutT: TabLayout, Responsive, etc.
  }

  return {
    success: true,
    stretchList: stretchList,
    containers: newContainers
  };
};

pui.layout.template.getProxy = function(defaults) {
  var proxy = pui.layout.template.load({
    template: defaults["template"],
    properties: defaults,
    designMode: true,
    proxyMode: true
  });
  pui.layout.template.processDOM(proxy);
  if (defaults["width"] != null) proxy.style.width = defaults["width"];
  if (defaults["height"] != null) proxy.style.height = defaults["height"];
  if (defaults["css class"] != null) proxy.className = defaults["css class"];
  return proxy;
};
