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



/**
 * Validation Tip Class
 * @constructor
 */

pui.ValidationTip = function(el) {
  this.container = document.body;
  var opacity = 0;
  var reverseFlag = false;
  var currentRequestNum = 0;
  var activeBox = el;
  
  var div;
  var contentDiv;
  var me = this;

  function animate() {
    var interval = 100;
    var increment = 20;    
    var decrement = 30;    
    if (opacity >= 0 && opacity <= 100) {
      div.style.filter = "alpha(opacity=" + opacity + ")";
      div.style.opacity = opacity / 100;
    }
    if (reverseFlag) opacity -= decrement;
    else opacity += increment;
    if ((reverseFlag && opacity <= 0) || (!reverseFlag && opacity >= 100)) {
      if (reverseFlag) {
        div.style.display = "none";
        div.style.visibility = "hidden";
        opacity = 0;
      }
      else {
        div.style.filter = "alpha(opacity=100)";
        div.style.opacity = 1;
        opacity = 100;
      }
    }
    else {
      setTimeout(animate, interval);
    }
  }

  this.init = function() {
    div = document.createElement("div");
    div.style.position = "absolute";
    div.style.background = "transparent url(" + pui.normalizeURL("/profoundui/proddata/images/validation-arrow.gif") + ") no-repeat scroll left center";
    div.style.padding = "0px";
    div.style.paddingLeft = "7px";
    div.style.opacity = 0.95;
    div.style.filter = "alpha(opacity=95)";
    div.style.zIndex = 999;
    div.style.cursor = "pointer";
    contentDiv = document.createElement("div");
    contentDiv.style.background = "#F3E6E6 none repeat scroll 0 0";
    contentDiv.style.borderColor = "#924949";
    contentDiv.style.borderStyle = "solid solid solid none";
    contentDiv.style.borderWidth = "2px 2px 2px medium";
    contentDiv.style.maxWidth = "250px";
    contentDiv.style.minWidth = "150px";
    contentDiv.style.padding = "5px";    
    contentDiv.style.paddingRight = "25px";    
    contentDiv.style.color = "#666666";
    contentDiv.style.fontFamily = "Verdana,Arial";
    contentDiv.style.fontSize = "11px";
    contentDiv.style.whiteSpace = "normal";
    closeButton = document.createElement("img");
    closeButton.style.position = "absolute";
    closeButton.style.top = "4px";
    closeButton.style.right = "5px";
    closeButton.src = pui.normalizeURL("/profoundui/proddata/images/buttons/close/x5.png");
    closeButton.onmousedown = function(e) {
      closeButton.src = pui.normalizeURL("/profoundui/proddata/images/buttons/close/x5_click.png");
      preventEvent(e);
      return false;
    }
    closeButton.onmouseup = function() {
      closeButton.src = pui.normalizeURL("/profoundui/proddata/images/buttons/close/x5.png");
    }
    closeButton.onclick = function() {
      div.style.display = "none";
      div.style.visibility = "hidden";
      opacity = 0;
      
      if (is_ie) {
        // In IE the blur event fires first, and we cannot cancel it.. so we must put the cursor back in the box
        if (activeBox != null) {
          if (activeBox.tagName == "INPUT" || activeBox.tagName == "SELECT" || activeBox.tagName == "TEXTAREA") {
            if (activeBox.disabled != true) {
              pui.ignoreFocus = true;
              activeBox.focus();
              if (activeBox.createTextRange != null) {
                // for IE, this makes the cursor to appear - workaround for IE8 bug where the cursor just doesn't show
                activeBox.select();
                var tr = activeBox.createTextRange();
                if (tr != null && tr.collapse !=  null && tr.select != null) {
                  tr.collapse();
                  tr.select();
                }
              }
              setTimeout(function() {
                pui.ignoreFocus = false;
              }, 0);
            }
          }
        }
      }

    }
    div.onmousedown = function(e) {
      preventEvent(e);
      return false;
    }
    div.style.display = "none";
    div.style.visibility = "hidden";
    div.appendChild(contentDiv);
    div.appendChild(closeButton);
    me.container.appendChild(div);
  }
  
  this.setMessage = function(msg) {
    contentDiv.innerHTML = '<img src="' + pui.normalizeURL("/profoundui/proddata/images/icons/exclamation.png") + '" style="width: 16px; height: 16px; vertical-align: text-bottom" /> ';
    contentDiv.appendChild(document.createTextNode(msg));
  }
  
  this.setPosition = function(left, top) {
    div.style.left = left + "px";
    div.style.top = top + "px";
  }
  
  this.positionByElement = function() {
    var msgOffset = 3;
    var msgHeight = div.offsetHeight;
    var targetHeight = activeBox.offsetHeight;
    var targetWidth = activeBox.offsetWidth;
    var top = activeBox.offsetTop - ((msgHeight - targetHeight) / 2);
    var left = activeBox.offsetLeft + targetWidth + msgOffset;

    if (activeBox.parentNode.getAttribute("container") == "true") {
      var offset = pui.layout.getContainerOffset(activeBox.parentNode);
      top = top + offset.y;
      left = left + offset.x;
    }
    
    // handle subfile elements
    var cellElement = activeBox.parentNode;
    if (cellElement != me.container && cellElement.getAttribute("container") != "true") {
      if (cellElement == null) {
        // element must have been scrolled off of view in the subfile, show validation tip at top-left corner of screen
        top = 0;
        left = -7;
      }
      else {
        left += cellElement.offsetLeft;
        top += cellElement.offsetTop;
        var gridElement = cellElement.parentNode;
        if (gridElement != me.container) {
          left += gridElement.offsetLeft;
          top += gridElement.offsetTop;
          if (gridElement.parentNode.getAttribute("container") == "true") {
            var offset = pui.layout.getContainerOffset(gridElement.parentNode);
            top = top + offset.y;
            left = left + offset.x;
          }
        }
      }
    }

    // make appropriate tab visible if dealing with tab panels
    if (activeBox.style.visibility == "hidden") {
      var parentTab = activeBox.parentTab;
      var parentTabPanelId = activeBox.parentTabPanel;
      if (parentTab != null && parentTabPanelId) {
        var parentTabPanelDom = getObj(parentTabPanelId);
        if (parentTabPanelDom != null) {
          var parentTabPanel = parentTabPanelDom.tabPanel;
          if (parentTabPanel != null) {
            if (parentTabPanel.selectedTab != parentTab) {
              parentTabPanel.selectedTab = parentTab;
              parentTabPanel.draw();
            }
          }
        }
      }
    }
    
    me.setPosition(left, parseInt(top));    
  }
  
  this.show = function(hideDelay) {
    if (div.style.display == "none") {
      div.style.display = "block";
      div.style.visibility = "";
      opacity = 0;
      reverseFlag = false;
      animate();
    }
    currentRequestNum += 1;
    if (currentRequestNum > 10000) currentRequestNum = 0;
    if (hideDelay != null) {
      hideRequest(currentRequestNum, hideDelay);
    }
    this.positionByElement();
  }

  function hideRequest(requestNum, delay) {
    setTimeout(function() {
      if (requestNum != currentRequestNum) return;
      me.hide();
    }, delay);
  }

  this.hide = function() {
    reverseFlag = true;
    animate();    
  }
  
  this.hideNow = function() {
    // hide without animation
    div.style.display = "none";
    div.style.visibility = "hidden";
    opacity = 0;    
  }
  
  this.destroy = function() {
    div.removeChild(contentDiv);
    div.parentNode.removeChild(div);
    contentDiv = null;
    div = null;
    me.container = null;
    me = null;
  }
  
}
