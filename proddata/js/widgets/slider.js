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
 * Slider Class
 * @constructor
 */

pui.Slider = function() {

  this.div = null;
  this.orientation = "horizontal";
  this.value = 2;
  this.minValue = 0;
  this.maxValue = 10;
  this.incrementValue = 1;
  this.design = false;
  this.readOnly = false;
  this.disabled = false;

  var me = this;
  var bar;
  var handle;
  var hiddenField;
 
  var ipad = ((pui["is_touch"] && !pui["is_mouse_capable"]) || pui.iPadEmulation);
  
  this.init = function() {
    // create bar
    bar = document.createElement("div");
    bar.className = "bar";

    // create hidden field for post value in genie
    if (!me.design && context == "genie") {
      hiddenField = createNamedElement("input", me.div.name);
      hiddenField.type = "hidden";      
      document.forms["main"].appendChild(hiddenField);
    }
    
    // create handle
    handle = document.createElement("div");
    handle.className = "handle";

    me.div.onselectstart = function(e) { return false; };
    bar.onselectstart = function(e) { return false; };
    handle.onselectstart = function(e) { return false; };

    function mousedown(event) {
      if (me.readOnly) return;
      if (me.disabled) return;
      var vertical = (me.orientation == "vertical");
      var touchEvent = false;
      if (event != null && event.touches != null) {
        if (event.touches.length != 1) return;
        touchEvent = true;
      }      
      var cursorStartX = getMouseX(event);
      var cursorStartY = getMouseY(event);
      var handleStartX = parseInt(handle.offsetLeft);
      var handleStartY = parseInt(handle.offsetTop);
  
      function mousemove(event) {
        var y = getMouseY(event) - cursorStartY;
        var x = getMouseX(event) - cursorStartX;

        var valueRange = me.maxValue - me.minValue;

        var pixelRange = 0;
        if (vertical) pixelRange = bar.clientHeight;
        else pixelRange = bar.clientWidth;

        var pixelStart;
        if (vertical) pixelStart = bar.offsetTop;
        else pixelStart = bar.offsetLeft;

        var pixelAdjust;
        if (vertical) pixelAdjust = handle.clientHeight / 2;
        else pixelAdjust = handle.clientWidth / 2;
        
        var pos;
        if (vertical) pos = handleStartY + y;
        else pos = handleStartX + x;
        
        var pct = (pos - pixelStart + pixelAdjust) / pixelRange;
        var value = valueRange * pct + me.minValue;
        if (value < me.minValue) value = me.minValue;
        if (value > me.maxValue) value = me.maxValue;
        
        // round to nearest increment
        value = me.roundByIncrement(value);
        
        if (value != me.value) {        
          me.setValue(value);
          me.div.modified = true;
          pui.updateReactState(me.div);
          if (context == "genie" && me.div.fieldInfo != null && me.div.fieldInfo["idx"] != null) {
            pui.response[me.div.fieldInfo["idx"]] = me.div;
          }
          if (!me.design && typeof me.div.onchange == "function") {
            me.div.onchange(event);
          }
        }        
        
        if (touchEvent) event.preventDefault();
      }
        
      function mouseup() {
        if (touchEvent) {
          removeEvent(document, "touchmove", mousemove);
          removeEvent(document, "touchend", mouseup);
        }
        else {
          removeEvent(document, "mousemove", mousemove);
          removeEvent(document, "mouseup", mouseup);
        }
      }
        
      if (touchEvent) {
        addEvent(document, "touchmove", mousemove);
        addEvent(document, "touchend",   mouseup);
      }
      else {
        addEvent(document, "mousemove", mousemove);
        addEvent(document, "mouseup",   mouseup);
      }
      
      preventEvent(event);
      return false;
    }
    addEvent(handle, "mousedown", mousedown);
    addEvent(handle, "touchstart", mousedown);
    
    // add to div container and draw
    me.div.appendChild(bar);
    me.div.appendChild(handle);    
    me.draw();
    
    pui.widgetsToCleanup.push(me);  //Causes destroy to be called when record format or screen changes.
  };
    
  this.roundByIncrement = function(value, roundDown) {
    var halfAdjust = me.incrementValue / 2;
    if (roundDown == true) halfAdjust = 0;
    var newValue = parseInt((value + me.minValue + halfAdjust) / me.incrementValue) * me.incrementValue - me.minValue;
    newValue = Math.round(newValue * 1000000) / 1000000;
    return newValue;
  };
  
  this.draw = function() {
    pui.addCssClass(me.div, "slider");
    if (ipad && !me.design) {
      pui.addCssClass(me.div, "touch");
    }
    pui.removeCssClass(me.div, me.orientation == "vertical" ? "horizontal" : "vertical");
    pui.addCssClass(me.div, me.orientation);
    
    me.setValue(me.value);
  };
  
  this.validateValues = function() {
    if (isNaN(me.incrementValue)) me.incrementValue = 1;
    if (me.incrementValue <= 0) me.incrementValue = 1;
    if (isNaN(me.minValue)) me.minValue = 0;
    if (isNaN(me.maxValue)) me.maxValue = 10;
    if (isNaN(me.value)) me.value = 0;
    if (me.value < me.minValue) me.value = me.minValue;
    if (me.value > me.maxValue) me.value = me.maxValue;
    me.value = me.roundByIncrement(me.value);
    me.div.value = me.value;
    if (!me.design && context == "genie") hiddenField.value = me.value;    
  };
  
  this.setValue = function(value) {
    value = Number(value);
    if (isNaN(value)) value = me.minValue;
    if (value < me.minValue) value = me.minValue;
    if (value > me.maxValue) value = me.roundByIncrement(me.maxValue, true);    
  
    var valueRange = me.maxValue - me.minValue;
    var vertical = (me.orientation == "vertical");
    var pixelRange = 0;
    var pixelAdjust = 0;
    
    if (vertical) pixelRange = bar.clientHeight;
    else pixelRange = bar.clientWidth;
    
    if (vertical) pixelAdjust = handle.clientHeight / 2;
    else pixelAdjust = handle.clientWidth / 2;
    
    var pixelOffset = 10;    
    var pixels = parseInt(pixelRange / valueRange * (value - me.minValue) - pixelAdjust) + pixelOffset;
    if (isNaN(pixels)) pixels = 0; // in case of division by zero
    
    if (vertical){
      handle.style.top = pixels + "px";
      handle.style.left = ""; //Use stylesheet value.
    }
    else {
      handle.style.left = pixels + "px";
      handle.style.top = "";
    }
    
    me.value = value;
    me.div.value = value;
    if (!me.design && context == "genie") hiddenField.value = me.value;    
  };
  
  /**
   * Remove global window event that otherwise stays registered. Called by pui.cleanup().
   * @returns {undefined}
   */
  this.destroy = function(){
    if ( me == null) return;
    me.div = null;
    bar = null;
    handle = null;
    hiddenField = null;
    me = null;
  };
  
};








pui.widgets.add({
  name: "slider",
  defaults: {
    "width": "150px",
    "height": "20px"
  },

  propertySetters: {
  
    "field type": function(parms) {
      if (parms.dom.slider == null) {
        parms.dom.slider = new pui.Slider();
      }
      parms.dom.slider.div = parms.dom;
      parms.dom.slider.design = parms.design;
      parms.dom.slider.value = parms.evalProperty("value");       
      parms.dom.slider.init();
    },
    
    "value": function(parms) {
      if (parms.dom.slider != null) {
        parms.dom.slider.setValue(parms.value);
      }
    },
    
    "orientation": function(parms) {
      if (parms.dom.slider != null) {
        parms.dom.slider.orientation = parms.value;
        parms.dom.slider.draw();
      }
    },
    
    "min value": function(parms) {
      if (!parms.design && parms.dom.slider != null) {
        parms.dom.slider.minValue = Number(parms.value);
        parms.dom.slider.maxValue = Number(parms.evalProperty("max value"));
        parms.dom.slider.value = Number(parms.evalProperty("value"));
        parms.dom.slider.validateValues();
        parms.dom.slider.draw();
      }
    },

    "max value": function(parms) {
      if (!parms.design && parms.dom.slider != null) {
        parms.dom.slider.maxValue = Number(parms.value);
        parms.dom.slider.minValue = Number(parms.evalProperty("min value"));
        parms.dom.slider.value = Number(parms.evalProperty("value"));
        parms.dom.slider.validateValues();
        parms.dom.slider.draw();
      }
    },

    "increment value": function(parms) {
      if (!parms.design && parms.dom.slider != null) {
        parms.dom.slider.incrementValue = Number(parms.value);
        parms.dom.slider.value = Number(parms.evalProperty("value"));
        parms.dom.slider.validateValues();
        parms.dom.slider.draw();
      }
    },
    
    "read only": function(parms) {      
      if (parms.dom.slider != null && !parms.design) {
        if (parms.value == true || parms.value == "true") {
          parms.dom.slider.readOnly = true;
        }
        else {
          parms.dom.slider.readOnly = false;
        }
      }
    },
    
    "disabled": function(parms) {      
      if (parms.dom.slider != null && !parms.design) {
        if (parms.value == true || parms.value == "true") {
          parms.dom.slider.disabled = true;
        }
        else {
          parms.dom.slider.disabled = false;
        }
      }
    },
    
    "width": function(parms) {
      parms.dom.style.width = parms.value;
      if (parms.dom.slider != null) {
        parms.dom.slider.draw();
      }
    },

    "height": function(parms) {
      parms.dom.style.height = parms.value;
      if (parms.dom.slider != null) {
        parms.dom.slider.draw();
      }
    }
    
  }
  
});




