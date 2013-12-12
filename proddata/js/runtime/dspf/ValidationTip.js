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
  var inputEl = el;
  var widgetEl = el;
  var orientation = "right";
  var msg = "";
  
  var div;
  var contentDiv;
  var closeButton;
  var me = this;

  this.container = pui.getParentWindow(widgetEl);
  if (this.container == null) {
  
    this.container = pui.runtimeContainer;
  
  }

  if (inputEl.comboBoxWidget != null) {
  
    inputEl = inputEl.comboBoxWidget.getBox();
    
  }      

  addEvent(inputEl, "focus", showTipOnFocus);
  if (!(inputEl.tagName == "INPUT" && (inputEl.type == "text" || pui.isHTML5InputType(inputEl.type)))) {
    addEvent(inputEl, "click", showTipOnFocus);
  }
  addEvent(inputEl, "blur", hideTipOnBlur)
  if (inputEl.tagName == "SELECT") addEvent(inputEl, "change", hideTipOnChange);
  else addEvent(inputEl, "keydown", hideTipOnKeyDown);      
  
  inputEl.validationTip = this;    
  
  setOrientation();
  init();
  
  this.setMessage = function(val) {
  
    msg = val;
    var flt = (0 == 1 && orientation == "left") ? "right" : "none";
    contentDiv.innerHTML = '<img src="' + pui.normalizeURL("/profoundui/proddata/images/icons/exclamation.png") + '" style="float: ' + flt + '; width: 16px; height: 16px; vertical-align: text-bottom" /> ';
    contentDiv.appendChild(document.createTextNode(msg));        

  }
  
  this.setPosition = function(left, top) {
    div.style.left = left + "px";
    div.style.top = top + "px";
  }
  
  this.positionByElement = function() {
    var msgOffset = 3;
    var msgHeight = div.offsetHeight;
    var msgWidth = div.offsetWidth;
    var targetHeight = widgetEl.offsetHeight;
    var targetWidth = widgetEl.offsetWidth;
    
    var old = orientation;
    setOrientation(); // This can change 
    if (old != orientation) {
    
      init();
      me.setMessage(msg);
    
    }
    
    var top, left;
    if (orientation == "left" || orientation == "right") {
    
      top = widgetEl.offsetTop - ((msgHeight - targetHeight) / 2);
      if (orientation == "left") {
      
        left = widgetEl.offsetLeft - msgWidth - msgOffset;
      
      }
      else {
      
        left = widgetEl.offsetLeft + targetWidth + msgOffset;
      
      }
      
    }
    else { // top || bottom
    
      left = widgetEl.offsetLeft + ((targetWidth - msgWidth) / 2);
      if (orientation == "top") {
      
        top = widgetEl.offsetTop - msgHeight - msgOffset;
      
      }
      else { // bottom
      
        top = widgetEl.offsetTop + targetHeight + msgOffset;
      
      }
    
    }

    var prt = widgetEl.parentNode;
    if (prt == null || (pui["is_old_ie"] && prt.nodeName == "#document-fragment")) {
    
      // This is the case when grid widget scrolled out of view.
      // Show at top left.
      
      // Switch orientation to right and shift to cut off arrow.
      setOrientation("right");
      init();
      me.setMessage(msg);
      top = 0;
      left = -7;      
    
    }
    else {
    
      if (prt.getAttribute("container") == "true") {
        var offset = pui.layout.getContainerOffset(prt);
        top = top + offset.y;
        left = left + offset.x;
      } 

      // handle subfile elements
      var cellElement = prt;
      if (cellElement != me.container && cellElement.getAttribute("container") != "true") {
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
    if (widgetEl.style.visibility == "hidden") {
      var parentTab = widgetEl.parentTab;
      var parentTabPanelId = widgetEl.parentTabPanel;
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
    me.positionByElement();
      
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
  
  function setOrientation(val) {
  
    if (val != null) {
    
      orientation = val;
    
    }
    else if (typeof(widgetEl.pui.properties["error message location"]) != "undefined") {
    
      orientation = widgetEl.pui.properties["error message location"];  
    
    }
  
    if (orientation != "left" && orientation != "right" && 
        orientation != "top" && orientation != "bottom")  { 
        
      orientation = "right";
      
    }
  
  }
  
  function init() {
  
    var imgPos;
    var img = "/profoundui/proddata/images/";
    var padding;
    var contentPadding;
    var borderStyle;
    var borderWidth;
    var contentPadding = "5px 25px 5px 5px";
    if (orientation == "top") { 
    
      imgPos = "bottom";
      img += "validation-arrow-bottom.gif";
      padding = "0px 0px 7px 0px";
      borderStyle = "solid solid none solid";
      borderWidth = "2px 2px medium 2px";      
      
    }
    else if (orientation == "bottom") {
    
      imgPos = "top";
      img += "validation-arrow-top.gif";
      padding = "7px 0px 0px 0px";
      borderStyle = "none solid solid solid";
      borderWidth = "medium 2px 2px 2px";      
      
    }
    else if (orientation == "left") { 
    
      imgPos = "right";
      img += "validation-arrow-right.gif";
      padding = "0px 7px 0px 0px";
      contentPadding = "5px 5px 5px 25px";
      borderStyle = "solid none solid solid";
      borderWidth = "2px medium 2px 2px";      
      
    }
    else { // right
    
      imgPos = "left";
      img += "validation-arrow.gif";
      padding = "0px 0px 0px 7px";
      borderStyle = "solid solid solid none";
      borderWidth = "2px 2px 2px medium";
    
    }
    
    var reinit = (div != null);
    
    if (reinit) {
    
      closeButton.onmousedown = null
      closeButton.onmouseup = null
      closeButton.onclick = null
      closeButton.parentNode.removeChild(closeButton);
      closeButton = null
      
      contentDiv.parentNode.removeChild(contentDiv);
      contentDiv = null;
      
      div.onmousedown = null;
      div.parentNode.removeChild(div);
      div = null;
    
    }    
    
    div = document.createElement("div");
    div.style.position = "absolute";
    div.style.background = "transparent url(" + pui.normalizeURL(img) + ") no-repeat scroll " + imgPos + " center";
    div.style.padding = padding;
    div.style.opacity = 0.95;
    div.style.filter = "alpha(opacity=95)";
    div.style.zIndex = 999;
    div.style.cursor = "pointer";
    contentDiv = document.createElement("div");
    contentDiv.style.background = "#F3E6E6 none repeat scroll 0 0";
    contentDiv.style.borderColor = "#924949";
    contentDiv.style.borderStyle = borderStyle;
    contentDiv.style.borderWidth = borderWidth;
    contentDiv.style.maxWidth = "250px";
    contentDiv.style.minWidth = "150px";
    contentDiv.style.padding = contentPadding;   
    contentDiv.style.color = "#666666";
    contentDiv.style.fontFamily = "Verdana,Arial";
    contentDiv.style.fontSize = "11px";
    contentDiv.style.whiteSpace = "normal";
    closeButton = document.createElement("img");
    closeButton.style.position = "absolute";
    if (orientation == "bottom") {
    
      closeButton.style.top = "8px";
    
    }
    else {
    
      closeButton.style.top = "4px";
      
    }
    if (orientation == "left") {
    
      closeButton.style.left = "5px";  
    
    }
    else {
      
      closeButton.style.right = "5px";
      
    }
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
      
      if (pui["is_old_ie"]) {
        var prt = widgetEl.parentNode;
        // In IE the blur event fires first, and we cannot cancel it.. so we must put the cursor back in the box
        if (inputEl != null && prt != null && prt.nodeName != "#document-fragment") {
          if (inputEl.tagName == "INPUT" || inputEl.tagName == "SELECT" || inputEl.tagName == "TEXTAREA") {
            if (inputEl.disabled != true) {
              pui.ignoreFocus = true;
              inputEl.focus();
              if (inputEl.createTextRange != null) {
                // for IE, this makes the cursor to appear - workaround for IE8 bug where the cursor just doesn't show
                inputEl.select();
                var tr = inputEl.createTextRange();
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
    if (!reinit) {
      div.style.display = "none";
      div.style.visibility = "hidden";
    }
    div.appendChild(contentDiv);
    div.appendChild(closeButton);
    me.container.appendChild(div);
  }    
  
}
