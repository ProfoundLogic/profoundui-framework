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
  
  var timeout = null;
  
  var ipad = ((pui["is_touch"] && !pui["is_mouse_capable"]) || pui.iPadEmulation);
  
  this.init = function() {
    // create bar
    bar = document.createElement("div");
    bar.style.backgroundColor = "#D7D7D7";
    bar.style.position = "absolute";
    bar.style.fontSize = "0px";
    bar.style.border = "1px solid #898989";
    
    // create hidden field for post value in genie
    if (!me.design && context == "genie") {
      hiddenField = createNamedElement("input", me.div.name);
      hiddenField.type = "hidden";      
      document.forms["main"].appendChild(hiddenField);
    }
    
    // create handle
    handle = document.createElement("div");
    handle.style.border = "1px solid #94c9ff";
    handle.style.backgroundColor = "#d7f0ff";
    handle.style.position = "absolute";
    handle.style.fontSize = "0px";
    if (ipad && !me.design) {
      handle.style.MozBorderRadius = "15px";
      handle.style.borderRadius = "15px";
      handle.style.WebkitBorderRadius = "15px";
    }
    else {
      handle.style.MozBorderRadius = "5px";
      handle.style.borderRadius = "5px";
      handle.style.WebkitBorderRadius = "5px";
    }
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
      var handleStartX = parseInt(handle.style.left);
      var handleStartY = parseInt(handle.style.top);
  
      function mousemove(event) {
        var y = getMouseY(event) - cursorStartY;
        var x = getMouseX(event) - cursorStartX;

        var valueRange = me.maxValue - me.minValue;

        var pixelRange = 0;
        if (vertical) pixelRange = bar.clientHeight;
        else pixelRange = bar.clientWidth;

        var pixelStart = 0;
        if (vertical) pixelStart = bar.offsetTop;
        else pixelStart = bar.offsetLeft;

        var pixelAdjust = 0;
        if (vertical) pixelAdjust = parseInt(handle.style.height) / 2;
        else pixelAdjust = parseInt(handle.style.width) / 2;

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
    
    // When the Slider is percent width, the sizes don't always match after resizing
    // (including zoom). Draw upon resize fixes that. 
    addEvent(window, "resize", resize);

    // add to div container and draw
    me.div.appendChild(bar);
    me.div.appendChild(handle);    
    me.draw();
    
    pui.widgetsToCleanup.push(me);  //Causes destroy to be called when record format or screen changes.
  };
  
  // Redraw the slider 100ms after user stops adjusting size or zoom.
  function resize(){
    clearTimeout(timeout);
    timeout = setTimeout(me.draw, 100);
  }
  
  this.roundByIncrement = function(value, roundDown) {
    var halfAdjust = me.incrementValue / 2;
    if (roundDown == true) halfAdjust = 0;
    var newValue = parseInt((value + me.minValue + halfAdjust) / me.incrementValue) * me.incrementValue - me.minValue;
    newValue = Math.round(newValue * 1000000) / 1000000;
    return newValue;
  };
  
  this.draw = function() {
    // draw bar
    if (me.orientation == "vertical") {
      bar.style.left = "6px";
      bar.style.top = "10px";
      bar.style.width = "5px";
      bar.style.borderRight = "1px solid #B7B7B7";
      
      if (pui.isPercent(me.div.style.height)){
        // Size bar proportionally with window and zoom. Leave 14px to bottom (at 100% zoom).
        var height = pui.round((1 - (bar.offsetTop + 14)/me.div.clientHeight)*100, 1);
        if (isNaN(height) || height < 0) height = 0;  //Avoid IE8 error.
        bar.style.height = height + "%";
      }else{
        var height = parseInt(me.div.style.height, 10);
        if (isNaN(height)) height = me.div.clientHeight;
        height -= 24;
        if (height < 0) height = 0;   //Avoid IE8 error.
        bar.style.height = height + "px";
      } 
    }
    else {
      bar.style.left = "10px";
      bar.style.top = "6px";
      bar.style.height = "5px";
      bar.style.borderBottom = "1px solid #B7B7B7";
      
      if (pui.isPercent(me.div.style.width)){
        // Size bar proportionally with window and zoom. Leave 14px to right (at 100% zoom).
        var width = pui.round((1 - (bar.offsetLeft + 14)/me.div.clientWidth)*100, 1);
        if (isNaN(width) || width < 0) width = 0;  //Avoid IE8 error.
        bar.style.width = width + "%";
      }else{
        var width = parseInt(me.div.style.width,10);
        if (isNaN(width)) width = me.div.clientWidth;
        width -= 24;  //Leave 14px to right (10px to left).
        if( width < 0 ) width = 0; //Avoid IE8 error.
        bar.style.width = width + "px";
      }
    }

    // draw handle
    if (me.orientation == "vertical") {
      if (ipad && !me.design) {
        handle.style.height = "32px";
        handle.style.width = "37px";
        handle.style.left = "-11px";
      }
      else {
        handle.style.height = "10px";
        handle.style.width = "15px";
        handle.style.left = "1px";
      }
    }
    else {
      if (ipad && !me.design) {
        handle.style.height = "37px";
        handle.style.width = "32px";      
        handle.style.top = "-11px";
      }
      else {
        handle.style.height = "15px";
        handle.style.width = "10px";      
        handle.style.top = "1px";
      }
    }
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
    
    if (vertical) pixelAdjust = parseInt(handle.style.height) / 2;
    else pixelAdjust = parseInt(handle.style.width) / 2;
    
    var pixelOffset = 10;    
    var pixels = parseInt(pixelRange / valueRange * (value - me.minValue) - pixelAdjust) + pixelOffset;
    if (isNaN(pixels)) pixels = 0; // in case of division by zero
    
    if (vertical) handle.style.top = pixels + "px";
    else handle.style.left = pixels + "px";
    
    me.value = value;
    me.div.value = value;
    if (!me.design && context == "genie") hiddenField.value = me.value;    
  };
  
  /**
   * Remove global window event that otherwise stays registered. Called by pui.cleanup().
   * @returns {undefined}
   */
  this.destroy = function(){
    removeEvent(window, "resize", resize);
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
        parms.dom.slider.maxValue = Number(parms.evalProperty("min value"));
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




