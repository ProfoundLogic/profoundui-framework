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



/**
 * Validation Tip Class
 * @param {Element} el    Input or widget element associated with the tip.
 * @constructor
 */

pui.ValidationTip = function(el) {
  // Public
  this.container = null;
  
  // Private
  this._opacity = 0;
  var reverseFlag = false;
  var currentRequestNum = 0;
  var inputEl = el;
  var widgetEl = el;
  this._orientation = "right";
  var msg = "";
  this._typeClass = "";
  if (typeof widgetEl.pui.properties["error message css class"] == "string") this._typeClass = trim(widgetEl.pui.properties["error message css class"]);
  if (this._typeClass == "") this._typeClass = "pui-tip-error";
  var invalidClass = this._typeClass + "-invalid";
  
  this._div = null;
  this._contentDiv = null;
  this._closeButton = null;
  var me = this;
  
  
  if (widgetEl.pui.properties['error message attach'] == 'parent'){
    // The tool tip is setup to be in the same container as the widget so that it can scroll with it. #6451.
    this._attachParent = true;
    this.container = widgetEl.parentNode;
  }
  else {
    this._attachParent = false;
    this.container = pui.getParentWindow(widgetEl);
    if (this.container == null) {

      this.container = pui.runtimeContainer;

    }
  }
    
  if (inputEl.comboBoxWidget != null) {  
    inputEl = inputEl.comboBoxWidget.getBox();    
  }      
  if (inputEl.floatingPlaceholder != null) {  
    inputEl = inputEl.floatingPlaceholder.getBox();    
  }      

  addEvent(inputEl, "focus", showTipOnFocus);
  if (!(inputEl.tagName == "INPUT" && (inputEl.type == "text" || pui.isHTML5InputType(inputEl.type)))) {
    addEvent(inputEl, "click", showTipOnFocus);
  }
  addEvent(inputEl, "blur", hideTipOnBlur);
  if (inputEl.tagName == "SELECT") addEvent(inputEl, "change", hideTipOnChange);
  else addEvent(inputEl, "keydown", hideTipOnKeyDown);      
  
  inputEl.validationTip = this;    
  
  setOrientation();
  this._init();
  
  this.setMessage = function(val) {
  
    msg = val;
    me._contentDiv.innerHTML = '<div class="pui-tip-icon" />';
    me._contentDiv.appendChild(document.createTextNode(msg));

  };
  
  this.setPosition = function(left, top) {
    me._div.style.left = left + "px";
    me._div.style.top = top + "px";
  };
  
  this.positionByElement = function() {
    var msgOffset = 3;
    var msgHeight = me._div.offsetHeight;
    var msgWidth = me._div.offsetWidth;
    var targetHeight = widgetEl.offsetHeight;
    var targetWidth = widgetEl.offsetWidth;
    
    var old = me._orientation;
    setOrientation(); // This can change 
    if (old != me._orientation) {
    
      me._init();
      me.setMessage(msg);
    
    }
    
    var top, left;
    if (me._orientation == "left" || me._orientation == "right") {
    
      top = widgetEl.offsetTop - ((msgHeight - targetHeight) / 2);
      if (me._orientation == "left") {
      
        left = widgetEl.offsetLeft - msgWidth - msgOffset;
      
      }
      else {
      
        left = widgetEl.offsetLeft + targetWidth + msgOffset;
      
      }
      
    }
    else { // top || bottom

      left = widgetEl.offsetLeft + ((targetWidth - msgWidth) / 2);
      if (me._orientation == "top") {

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
      me._init();
      me.setMessage(msg);
      top = 0;
      left = -7;      
    
    }
    else {
    
      if (this._attachParent){
        if (left < 0) left = 0;
        if (top < 0) top = 0;
      }
      else if (prt.getAttribute("container") == "true") {
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
  };
  
  this.show = function(hideDelay, onTimer) {
    
    this.doneShowing = false;
  
    if (onTimer == true) {
    
      setTimeout(function() {
        me.show(hideDelay, false);
      }, 0);
    
      return;
    
    }
  
    if (me._div.style.display == "none") {      
      me._div.style.display = "block";
      me._div.style.visibility = "";
      me._opacity = 0;
      reverseFlag = false;
      animate();
    }
    currentRequestNum += 1;
    if (currentRequestNum > 10000) currentRequestNum = 0;
    if (hideDelay != null) {
      hideRequest(currentRequestNum, hideDelay);
    }
    me.positionByElement();
      
  };

  function hideRequest(requestNum, delay) {
    setTimeout(function() {
      if (requestNum != currentRequestNum) return;
      me.hide();
    }, delay);
  }

  this.hide = function() {
    reverseFlag = true;
    animate();    
  };
  
  this.hideNow = function() {
    // hide without animation
    me._div.style.display = "none";
    me._div.style.visibility = "hidden";
    me._opacity = 0;
  };
  
  this.getInvalidClass = function() {
  
    return invalidClass;
  
  };
  
  function animate() {
    var interval = 100;
    var increment = 20;    
    var decrement = 30;    
    if (me._opacity >= 0 && me._opacity <= 100) {
      me._div.style.filter = "alpha(opacity=" + me._opacity + ")";
      me._div.style.opacity = me._opacity / 100;
    }
    if (reverseFlag) me._opacity -= decrement;
    else me._opacity += increment;
    if ((reverseFlag && me._opacity <= 0) || (!reverseFlag && me._opacity >= 100)) {
      if (reverseFlag) {
        me._div.style.display = "none";
        me._div.style.visibility = "hidden";
        me._opacity = 0;
      }
      else {
        me._div.style.filter = "alpha(opacity=100)";
        me._div.style.opacity = 1;
        me._opacity = 100;
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
    var key = event.keyCode;        
    if (key >= 9 && key <= 45) return;     // includes keys like arrow keys, ctrl, shift, etc.
    if (key >= 112 && key <= 145) return;  // includes f1-f12, num lock, scroll lock, etc.
    var target = getTarget(event);
    if (target == null) return;
    var tip = target.validationTip;
    if (tip == null) return;
    tip.hide();
    tip.doneShowing = true;
    pui.removeCssClass(target, tip.getInvalidClass());
  }

  function hideTipOnChange(event) {
    var target = getTarget(event);
    if (target == null) return;
    var tip = target.validationTip;
    if (tip == null) return;
    tip.hide();
    tip.doneShowing = true;
    pui.removeCssClass(target, tip.getInvalidClass());
  }  
  
  /**
   * @param {String|undefined} val
   */
  function setOrientation(val) {
  
    if (val != null){
      me._orientation = val;
    }
    else if (typeof(widgetEl.pui.properties["error message location"]) != "undefined") {
    
      me._orientation = widgetEl.pui.properties["error message location"];  
    
    }
    
    // Use "right" as the default if the value was not valid.
     if (me._orientation != "left" && me._orientation != "right" && 
         me._orientation != "top" && me._orientation != "bottom")  {
   
       me._orientation = 'right';
     }
     
  }
  
};
pui.ValidationTip.prototype = Object.create(pui.BaseClass.prototype);

/**
 * 
 */
pui.ValidationTip.prototype.destroy = function() {
  this._div.removeEventListener('mousedown', this);
  this._closeButton.removeEventListener('mousedown', this);
  this._closeButton.removeEventListener('mouseup', this);
  this._closeButton.removeEventListener('click', this);
  
  this._div.removeChild(this._closeButton);
  this._div.removeChild(this._contentDiv);
  this._div.parentNode.removeChild(this._div);
  this.deleteOwnProperties();
};

/**
 * 
 */
pui.ValidationTip.prototype._init = function() {
  var reinit = (this._div != null);

  if (reinit) {

    this._closeButton.removeEventListener('mousedown', this);
    this._closeButton.removeEventListener('mouseup', this);
    this._closeButton.removeEventListener('click', this);
    this._closeButton.parentNode.removeChild(this._closeButton);
    this._closeButton = null;

    this._contentDiv.parentNode.removeChild(this._contentDiv);
    this._contentDiv = null;

    this._div.removeEventListener('mousedown', this);
    this._div.parentNode.removeChild(this._div);
    this._div = null;

  }

  this._div = document.createElement("div");

  this._div.classList.add('pui-tip');
  if (this._orientation == 'top') this._div.classList.add('pui-tip-top');
  else if (this._orientation == 'bottom') this._div.classList.add('pui-tip-bottom');
  else if (this._orientation == 'left') this._div.classList.add('pui-tip-left');
  else this._div.classList.add('pui-tip-right');
  this._div.classList.add(this._typeClass);
  
  this._div.style.position = "absolute";
  this._contentDiv = document.createElement("div");
  this._contentDiv.className = "pui-tip-content";
  this._closeButton = document.createElement("div");
  this._closeButton.className = "pui-tip-close";

  this._closeButton.addEventListener('mousedown', this);
  this._closeButton.addEventListener('mouseup', this);
  this._closeButton.addEventListener('click', this);

  this._div.addEventListener('mousedown', this);

  if (!reinit) {
    this._div.style.display = "none";
    this._div.style.visibility = "hidden";
  }
  this._div.appendChild(this._contentDiv);
  this._div.appendChild(this._closeButton);
  this.container.appendChild(this._div);
};

/**
 * 
 * @param {Event} e
 * @returns {Boolean|undefined}
 */
pui.ValidationTip.prototype['handleEvent'] = function(e){
  switch(e.type){
    case 'mousedown':      
      if (e.target == this._closeButton){
        this._closeButton.className = 'pui-tip-close-click';
      }
      preventEvent(e);  //Prevent mousedown on the div or close button.
      return false;
      
    case 'mouseup':
      this._closeButton.className = 'pui-tip-close';
      break;
      
    case 'click':
      // The close button was clicked.
      this._div.style.display = 'none';
      this._div.style.visibility = 'hidden';
      this._opacity = 0;
      break;
      
    case 'scroll':
      // A container's overflowed element containing the widget was scrolled.
      
      break;
  }
};
