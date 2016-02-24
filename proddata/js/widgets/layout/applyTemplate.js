//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2016 Profound Logic Software, Inc.
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
  var processHTML = pui.layout.template.processHTML;
  var processDOM = pui.layout.template.processDOM;
  
  var containers = getContainers(dom);
  var newDom = processHTML(parms);
  processDOM(newDom);
  var newContainers = getContainers(newDom);
  var stretchList = [];
  
  // find last container that has any widgets
  for (var x = containers.length - 1; x >= 0; x -= 1) {
    if (containers[x].firstChild != null) break;
  }
  x += 1;
  
  if (x > newContainers.length) {
    return {
      success: false,
      msg: "The property cannot be applied because it removes a layout section that contains other widgets.  \n\nYou must remove the contained widgets first."
    }
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

  // replace with new dom
  dom.innerHTML = "";
  var child = newDom.firstChild;
  while (child != null) {
    dom.appendChild(newDom.removeChild(child));
    child = newDom.firstChild;
  }
  if (newDom.panel != null) {
    dom.panel = newDom.panel;
    dom.sizeMe = function() {
      dom.panel.resize();
    }
    dom.panel.container = dom;
  }
  if (newDom.accordion != null) {
    dom.accordion = newDom.accordion;
    dom.sizeMe = function() {
      dom.accordion.resize();
    }
    dom.accordion.container = dom;
  }
  
  return { 
    success: true,
    stretchList: stretchList,
    containers: newContainers
  };
}


pui.layout.template.getProxy = function(defaults) {
  var proxy = pui.layout.template.processHTML({
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
}

