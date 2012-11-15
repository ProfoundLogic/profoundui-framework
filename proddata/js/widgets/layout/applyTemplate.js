
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
  proxy.style.border = "1px dotted #15428B";
  if (defaults["width"] != null) proxy.style.width = defaults["width"];
  if (defaults["height"] != null) proxy.style.height = defaults["height"];
  if (defaults["css class"] != null) proxy.className = defaults["css class"];
  return proxy;
}

