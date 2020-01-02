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

