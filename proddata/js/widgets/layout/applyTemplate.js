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
  var processHTML = pui.layout.template.processHTML;
  var processDOM = pui.layout.template.processDOM;
  
  var containers = getContainers(dom);
  var newDom = processHTML(parms);  //A temporary element that isn't attached to the DOM. Is used to build layouts.
  processDOM(newDom);
  var newContainers = getContainers(newDom);
  var stretchList = [];
  
  // find last container that has any widgets
  for (var x = containers.length - 1; x >= 0; x -= 1) {
    if (containers[x].firstChild != null) break;
  }
  x += 1;
  
  // Make sure changing the layout doesn't lose any widgets. If the function returns here, then the DOM and layout 
  // object created in processHTML are discarded.
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
  // "sizeMe" is a special method that Designer and other code looks for in DOM elements sometimes.
  // Make sure each layout object's .container property references the correct DOM element.
  
  if (dom.layout != null){
    dom.layout.notifyvisibleOnce = dom.layout.stretch;  //Make sure layout and its children get size setup once it becomes visible. #4711.
  }
  
  if (newDom.panel != null) {
    dom.panel = newDom.panel;
    dom.sizeMe = dom.panel.resize;
    dom.panel.container = dom;
  }
  
  if (newDom.accordion != null) {
    dom.accordion = newDom.accordion;
    dom.sizeMe = dom.accordion.resize;
    dom.accordion.container = dom;
    dom.layout.getActiveContainerNumbers = newDom.accordion.getActiveContainerNumbers; //Needed by lazy-load.
  }
  
  if (newDom.responsivelayout != null){
    dom.responsivelayout = newDom.responsivelayout;
    dom.sizeMe = dom.responsivelayout.resize;
    dom.sentToBackground = dom.responsivelayout.sentToBackground;
    dom.resizeOnCanvasResize = dom.responsivelayout.resizeOnCanvasResize;
    dom.responsivelayout.container = dom;
  }
  
  if (newDom.tabLayout != null){
    var selectedTab;
    if (dom.tabLayout != null){
      selectedTab = dom.tabLayout.selectedTab;
    }
    dom.tabLayout = newDom.tabLayout;
    dom.sizeMe = dom.tabLayout.resize;
    dom.tabLayout.container = dom;
    dom.layout.getActiveContainerNumbers = newDom.tabLayout.getActiveContainerNumbers; //Needed by lazy-load.
    dom.layout.notifyvisibleOnce = newDom.tabLayout.resize;  //Needed for scroll buttons when child is in hidden tab/section. Also for #4711.
    
    // Preserve the active tab when a template property is changed; e.g. tab names.
    if (selectedTab != null && !isNaN(selectedTab) && selectedTab >= 0  
    && selectedTab < dom.tabLayout.tabs.length && selectedTab != dom.tabLayout.selectedTab){
      dom.tabLayout.selectedTab = selectedTab;
      dom.tabLayout.selectedTabChanged();
    }
    
    dom.tabLayout.containerInDom(); //Finish drawing things that require elements being in DOM.
    
    dom.sendTabResponse = newDom.sendTabResponse;
    dom.sendActiveTab = newDom.sendActiveTab;
    dom.responseAID = newDom.responseAID;
    
    if (!parms.designMode){
      // Setup APIs.
      dom.setTab = dom.tabLayout.setTab;
      dom.getTab = dom.tabLayout.getTab;
      dom.refresh = dom.tabLayout.refresh;
      dom["hideTab"] = dom.tabLayout.hideTab;
      dom["showTab"] = dom.tabLayout.showTab;
    }
  }
  
  return { 
    success: true,
    stretchList: stretchList,
    containers: newContainers
  };
};


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
};

