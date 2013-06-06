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
  this.container = null;
  var opacity = 0;
  var reverseFlag = false;
  var currentRequestNum = 0;
  var domEl = el;
  var positionEl = domEl;
  
  var div;
  var contentDiv;
  var me = this;

  addEvent(domEl, "focus", showTipOnFocus);
  if (!(domEl.tagName == "INPUT" && (domEl.type == "text" || pui.isHTML5InputType(domEl.type)))) {
    addEvent(domEl, "click", showTipOnFocus);
  }
  addEvent(domEl, "blur", hideTipOnBlur)
  if (domEl.tagName == "SELECT") addEvent(domEl, "change", hideTipOnChange);
  else addEvent(domEl, "keydown", hideTipOnKeyDown);      
  
  if (domEl.parentNode != null && domEl.parentNode.comboBoxWidget != null) {
  
    positionEl = domEl.parentNode;
    
  }    
  
  this.container = pui.runtimeContainer;
  if (positionEl.parentNode.isPUIWindow == true) {
  
    this.container = positionEl.parentNode;
    
  }
  else {
  
    var gridDiv = positionEl.parentNode.parentNode;
    if (gridDiv != null && gridDiv.grid != null && gridDiv.parentNode.isPUIWindow == true) {
      this.container = gridDiv.parentNode;
    }
    
  }
  
  domEl.validationTip = this;    
  
  init();
  
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
    var targetHeight = positionEl.offsetHeight;
    var targetWidth = positionEl.offsetWidth;
    var top = positionEl.offsetTop - ((msgHeight - targetHeight) / 2);
    var left = positionEl.offsetLeft + targetWidth + msgOffset;

    if (positionEl.parentNode.getAttribute("container") == "true") {
      var offset = pui.layout.getContainerOffset(positionEl.parentNode);
      top = top + offset.y;
      left = left + offset.x;
    }
    
    // handle subfile elements
    var cellElement = positionEl.parentNode;
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
    if (positionEl.style.visibility == "hidden") {
      var parentTab = positionEl.parentTab;
      var parentTabPanelId = positionEl.parentTabPanel;
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
  
  this.show = function(hideDelay, onTimer) {
  
    this.doneShowing = false;
  
    if (onTimer == true) {
    
      setTimeout(function() {
        me.show(hideDelay, false);
      }, 0);
    
      return;
    
    }
  
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
  
  function showTipOnFocus(e) {
    if (pui.ignoreFocus) return;
    var target = getTarget(e);
    if (target == null) return;
    var tip = target.validationTip;
    if (tip == null) return;
    if (tip.doneShowing == true) return;
    tip.show();
  }
  
  function hideTipOnBlur(e) {
    if (pui.ignoreBlurs) return;
    var target = getTarget(e);
    if (target == null) return;
    var tip = target.validationTip;
    if (tip == null) return;
    tip.hide();
  }
  
  function hideTipOnKeyDown(event) {
    event = event || window.event;
    var key = event.keyCode;        
    if (key >= 9 && key <= 45) return;     // includes keys like arrow keys, ctrl, shift, etc.
    if (key >= 112 && key <= 145) return;  // includes f1-f12, num lock, scroll lock, etc.
    var target = getTarget(event);
    if (target == null) return;
    var tip = target.validationTip;
    if (tip == null) return;
    tip.hide();
    tip.doneShowing = true;
    pui.removeCssClass(target, "invalid");
  }

  function hideTipOnChange(event) {
    event = event || window.event;
    var target = getTarget(event);
    if (target == null) return;
    var tip = target.validationTip;
    if (tip == null) return;
    tip.hide();
    tip.doneShowing = true;
    pui.removeCssClass(target, "invalid");
  }  
  
  function init() {
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
        if (positionEl != null) {
          if (positionEl.tagName == "INPUT" || positionEl.tagName == "SELECT" || positionEl.tagName == "TEXTAREA") {
            if (positionEl.disabled != true) {
              pui.ignoreFocus = true;
              positionEl.focus();
              if (positionEl.createTextRange != null) {
                // for IE, this makes the cursor to appear - workaround for IE8 bug where the cursor just doesn't show
                positionEl.select();
                var tr = positionEl.createTextRange();
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
  
}
