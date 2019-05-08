//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2018 Profound Logic Software, Inc.
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
 * On Off Switch Class
 * @constructor
 */

pui.OnOffSwitch = function() {
  this.container = null;
  this.disabled = false;
  this.readOnly = false;
  this.isOn = true;
  this.wideHandle = true;
  this.designMode = false;
  
  var me = this;
  var offLabel = document.createElement("label");
  var offSpan = document.createElement("span");
  var onLabel = document.createElement("label");
  var onSpan = document.createElement("span");
  var handleLeftDiv = document.createElement("div");
  var handleRightDiv = document.createElement("div");
  var handleCenterDiv = document.createElement("div");
  var draggingHandle = false;
  
  function getOnPoint() {
    var totalWidth = me.container.offsetWidth;
    if (totalWidth == 0) {
      totalWidth = parseInt(me.container.style.width);
      if (isNaN(totalWidth)) totalWidth = 0;
      totalWidth += 2;
    }
    if (me.wideHandle) onPoint = parseInt((totalWidth + 3) / 2);
    else onPoint = totalWidth - 6;
    return onPoint;
  }
  
  this.init = function() {
    offLabel.className = "off-label";
    offLabel.style.background = "url('" + pui.normalizeURL("/profoundui/proddata/images/onoff/off.png") + "') no-repeat right 0";
    offSpan.innerHTML = "OFF";
    offLabel.appendChild(offSpan);
    onLabel.className = "on-label";
    onLabel.style.background = "url('" + pui.normalizeURL("/profoundui/proddata/images/onoff/on.png") + "') no-repeat";
    onSpan.innerHTML = "ON";
    onLabel.appendChild(onSpan);
    handleLeftDiv.className = "onoff-handle-left";
    handleLeftDiv.style.background = "url('" + pui.normalizeURL("/profoundui/proddata/images/onoff/handle_left.png") + "') no-repeat";
    handleRightDiv.className = "onoff-handle-right";
    handleRightDiv.style.background = "url('" + pui.normalizeURL("/profoundui/proddata/images/onoff/handle_right.png") + "') no-repeat right 0";
    handleCenterDiv.className = "onoff-handle-center";
    handleCenterDiv.style.background = "url('" + pui.normalizeURL("/profoundui/proddata/images/onoff/handle_center.png") + "')";
    handleRightDiv.appendChild(handleCenterDiv);
    handleLeftDiv.appendChild(handleRightDiv);
    pui.addCssClass(me.container, "onoff-switch");
    me.container.appendChild(offLabel);
    me.container.appendChild(onLabel);
    me.container.appendChild(handleLeftDiv);
    me.container.onclick = function(event) {
      if (me.readOnly) return;
      if (me.disabled) return;
      if (me.designMode) return;
      if (draggingHandle) return;
      me.toggle(true);
      me.setModified(event);
    }

    function dragStart(event) {
      if (me.readOnly) return;
      if (me.disabled) return;
      if (me.designMode) return;
      var onPoint = getOnPoint();
      var touchEvent = false;
      if (event != null && event.touches != null) {
        if (event.touches.length != 1) return;
        touchEvent = true;
      }      
      var cursorStartX = getMouseX(event);
      var handleStartX = parseInt(handleLeftDiv.style.left);  
      function dragMove(event) {
        draggingHandle = true;
        var pos = handleStartX + getMouseX(event) - cursorStartX;
        if (pos < 0) pos = 0;
        if (pos > onPoint) pos = onPoint;
        me.positionHandle(pos);
        if (touchEvent) event.preventDefault();
      }
      function dragEnd(event) {
        if (touchEvent) {
          removeEvent(document, "touchmove", dragMove);
          removeEvent(document, "touchend", dragEnd);
        }
        else {
          removeEvent(document, "mousemove", dragMove);
          removeEvent(document, "mouseup", dragEnd);
        }
        var handleEndX = parseInt(handleLeftDiv.style.left);
        var diff = Math.abs(handleStartX - handleEndX);
        var totalWidth = me.container.offsetWidth;
        if (totalWidth == 0) {
          totalWidth = parseInt(me.container.style.width);
          if (isNaN(totalWidth)) totalWidth = 0;
          totalWidth += 2;
        }
        var halfPoint = totalWidth / 2;
        if (me.wideHandle) halfPoint = halfPoint / 2 - 4;
        if (draggingHandle) {
          if (diff <= 5 || diff >= halfPoint) {
            me.toggle(true);
            me.setModified(event);
          }
          else {
            me.refresh(true);
          }
          setTimeout(function() { draggingHandle = false }, 0);
        }
      } 
      if (touchEvent) {
        addEvent(document, "touchmove", dragMove);
        addEvent(document, "touchend",   dragEnd);
      }
      else {
        addEvent(document, "mousemove", dragMove);
        addEvent(document, "mouseup",   dragEnd);
      }
      preventEvent(event);
      return false;
    }
    addEvent(me.container, "mousedown", dragStart);
    addEvent(me.container, "touchstart", dragStart);

    me.size();
  }
 
  this.size = function() {
    var totalWidth = me.container.offsetWidth;
    if (totalWidth == 0) {
      totalWidth = parseInt(me.container.style.width);
      if (isNaN(totalWidth)) totalWidth = 0;
      totalWidth += 2;
    }
    offLabelWidth = totalWidth - 5;
    if (offLabelWidth < 0) offLabelWidth = 0;
    offLabel.style.width = offLabelWidth + "px";
    me.setWideHandle(me.wideHandle);
  }
  
  this.setWideHandle = function(isWide) {
    if (isWide) {
      var totalWidth = me.container.offsetWidth;
      if (totalWidth == 0) {
        totalWidth = parseInt(me.container.style.width);
        if (isNaN(totalWidth)) totalWidth = 0;
        totalWidth += 2;
      }
      var handleWidth = parseInt((totalWidth - 14) / 2);
      if (handleWidth < 0) handleWidth = 0;
      handleLeftDiv.style.width = handleWidth + "px";
    }
    else {
      handleLeftDiv.style.width = "";
    }
    me.wideHandle = isWide;
    me.refresh();
  }
  
  this.positionHandle = function(x, animate) {

    var transitionProperties = ['transition', 'MozTransition', 'WebkitTransition', 'msTransition', 'OTransition'];
    var anim = " 0.3s ease";
    for (var i= 0; i < transitionProperties.length; i++) {
      var tProp = transitionProperties[i];
      if (animate) {
        var anim = " 0.2s ease";
        onLabel.style[tProp] = "width" + anim;
        onSpan.style[tProp] = "margin-left" + anim;
        offSpan.style[tProp] = "margin-right" + anim;
        handleLeftDiv.style[tProp] = "left" + anim;
      }
      else {
        onLabel.style[tProp] = "";
        onSpan.style[tProp] = "";
        offSpan.style[tProp] = "";
        handleLeftDiv.style[tProp] = "";
      }
    }
  
    var onPoint = getOnPoint();    
    onLabel.style.width = (x + 4) + "px";
    onSpan.style.marginLeft = (x - onPoint) + "px";
    offSpan.style.marginRight = (-x) + "px";
    handleLeftDiv.style.left = x + "px";
  }
  
  this.setOn = function(animate) {
    var onPoint = getOnPoint(); 
    me.positionHandle(onPoint, animate);
    me.isOn = true;
  }
  
  this.setOff = function(animate) {
    me.positionHandle(0, animate);
    me.isOn = false;
  }

  this.set = function(value, animate) {
    if (value) me.setOn(animate);
    else me.setOff(animate);
  }
  
  this.toggle = function(animate) {
    me.set(!me.isOn, animate);
  }
  
  this.refresh = function(animate) {
    me.set(me.isOn, animate);
  }

  this.changeOnText = function(text) {
    onSpan.innerHTML = text;
  }

  this.changeOffText = function(text) {
    offSpan.innerHTML = text;
  }
  
  this.disable = function() {
    me.disabled = true;
    pui.addCssClass(me.container, "onoff-switch-disabled");
  }
  
  this.enable = function() {
    me.disabled = false;
    pui.removeCssClass(me.container, "onoff-switch-disabled");
  }
  
  this.setFontProperty = function(propName, value) {
    var words = propName.split(" ");
    var styleName = propName;
    if (words.length == 2) {
      styleName = words[0] + words[1].substr(0,1).toUpperCase() + words[1].substr(1);
    }
    onSpan.style[styleName] = value;
    offSpan.style[styleName] = value;
  }
  
  this.setMouseCursor = function(value) {
    me.container.style.cursor = value;
    onLabel.style.cursor = value;
    offLabel.style.cursor = value;
    handleLeftDiv.style.cursor = value;
  }

  this.setModified = function(event) {
    me.container.modified = true;
    pui.updateReactState(me.container);
    if (context == "genie" && me.container.fieldInfo != null && me.container.fieldInfo["idx"] != null) {
      pui.response[me.container.fieldInfo["idx"]] = me.container;
    }
    if (!me.designMode && typeof me.container.onchange == "function") {
      me.container.onchange(event);
    }
  }
}









pui.widgets.add({
  name: "on off switch",
  defaults: {
    "width": "100px",
    "height": "27px"
  },

  propertySetters: {
  
    "field type": function(parms) {
      if (parms.dom.onOffSwitch == null) {
        parms.dom.onOffSwitch = new pui.OnOffSwitch();
      }
      parms.dom.style.border = "0px none";
      parms.dom.onOffSwitch.container = parms.dom;
      parms.dom.onOffSwitch.designMode = parms.design;
      parms.dom.onOffSwitch.init();
      parms.dom.onOffSwitch.set(parms.evalProperty("value") == parms.evalProperty("on value"));
      if (parms.design) {
        
        parms.dom.onOffSwitch.setMouseCursor("default");
        var nmodel = getPropertiesNamedModel();
        var propConfig;
        if (parms.properties["on text"]) {
          
          propConfig = nmodel["on text"];
          applyPropertyToField(
            propConfig,
            parms.properties,
            parms.designItem.dom,
            parms.properties["on text"], 
            true, 
            parms.designItem
          );
        
        }
        if (parms.properties["off text"]) {
          
          propConfig = nmodel["off text"];
          applyPropertyToField(
            propConfig,
            parms.properties,
            parms.designItem.dom,
            parms.properties["off text"], 
            true, 
            parms.designItem
          );
        
        }
        
      }
      else {
        parms.dom.onOffSwitch.onValue = parms.evalProperty("on value");
        parms.dom.onOffSwitch.offValue = parms.evalProperty("off value");
      }
      parms.dom.sizeMe = function() {
        parms.dom.onOffSwitch.size();
      }
    },
    
    "value": function(parms) {
      if (parms.dom.onOffSwitch != null) {
        parms.dom.onOffSwitch.set(parms.value == parms.evalProperty("on value"));
      }
    },

    "on value": function(parms) {
      if (parms.dom.onOffSwitch != null) {
        parms.dom.onOffSwitch.set(parms.evalProperty("value") == parms.value);
      }
    },
    
    "read only": function(parms) {      
      if (parms.dom.onOffSwitch != null) {
        parms.dom.onOffSwitch.readOnly = (parms.value == true || parms.value == "true");
      }
    },
    
    "disabled": function(parms) {      
      if (parms.dom.onOffSwitch != null) {
        if (parms.value == true || parms.value == "true") parms.dom.onOffSwitch.disable();
        else parms.dom.onOffSwitch.enable();
      }
    },

    "wide handle": function(parms) {      
      if (parms.dom.onOffSwitch != null) {
        parms.dom.onOffSwitch.setWideHandle(parms.value !== false && parms.value !== "false");
      }
    },
    
    "on text": function(parms) {      
      if (parms.dom.onOffSwitch != null) {
        parms.dom.onOffSwitch.changeOnText(parms.value);
      }
    },
    
    "off text": function(parms) {      
      if (parms.dom.onOffSwitch != null) {
        parms.dom.onOffSwitch.changeOffText(parms.value);
      }
    },    

    "width": function(parms) {
      if (parms.dom.onOffSwitch != null) {
        parms.dom.style.width = parms.value;
        parms.dom.onOffSwitch.size();
      }
    },

    "height": function(parms) {
      if (parms.dom.onOffSwitch != null) {
        parms.dom.style.height = parms.value;
        parms.dom.onOffSwitch.size();
      }
    }
   
  },
  
  globalAfterSetter: function(parms) {
    if (parms.propertyName.substr(0,9) == "css class" && parms.dom.onOffSwitch != null) {
      pui.addCssClass(parms.dom, "onoff-switch");
    }
    switch(parms.propertyName) {
      case "color":
      case "font family":
      case "font size":
      case "font style":
      case "font variant":
      case "font weight":
      case "letter spacing":
      case "text align":
      case "text decoration":
      case "text transform":
      case "word spacing":
        if (parms.dom.onOffSwitch != null) {
          parms.dom.onOffSwitch.setFontProperty(parms.propertyName, parms.value);
        }
        break;
    }
    
  }

});







