
pui.layout.template.processDOM = function(dom) {
  var toRepeat = [];
  
  function processNodes(el) {
    if (el == null) return;
    if (el.getAttribute != null) {
      if (el.getAttribute("condition") == "false" && el.parentNode != null) {
        el.parentNode.removeChild(el);
        return;
      }
      var repeatNum = el.getAttribute("repeat");
      if (repeatNum != null) {
        el.removeAttribute("repeat");
        repeatNum = parseInt(repeatNum);
        if (!isNaN(repeatNum)) {
          if (repeatNum <= 0) {
            el.style.display = "none";
          }
          if (repeatNum > 1) {
            toRepeat.push({
              el: el,
              repeatNum: repeatNum
            });
          }
        }
      }
      if (el.getAttribute("container") == "true") {
        if (el.innerHTML == null) {  // this node cannot be a container
          el.removeAttribute("container");
        }
        else {
          el.innerHTML = "";  // a container cannot have any children
        }
      }
    } 
    var childNodes = el.childNodes;
    if (childNodes == null || childNodes.length == null) return;
    for (var i = 0; i < childNodes.length; i++) {
      processNodes(childNodes[i]);
    }
  }
  
  function repeatNodes() {
    var repeatObj;
    while ((repeatObj = toRepeat.pop()) != null) {
      var el = repeatObj.el;
      var n = repeatObj.repeatNum - 1;
      for (var i = 0; i < n; i++) {
        var newNode = el.cloneNode(true);
        el.parentNode.insertBefore(newNode, el);
      }
    }
  }
  
  processNodes(dom);
  repeatNodes();
 
}

