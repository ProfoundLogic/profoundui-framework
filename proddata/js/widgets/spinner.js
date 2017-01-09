//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2017 Profound Logic Software, Inc.
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
 * Spinner Class
 * @constructor
 */

pui.Spinner = function(dom, minValue, maxValue, increment, runtimeMode) {

  // Private Properties / Constructor
  var me = this;
  var up = document.createElement("img");
  var down = document.createElement("img");
  
  if (minValue != null && minValue != "") {
    minValue = Number(minValue);
    if (isNaN(minValue)) minValue = null;
  }
  else {
    minValue = null;
  }
  if (maxValue != null && maxValue != "") {
    maxValue = Number(maxValue);
    if (isNaN(maxValue)) maxValue = null;
  }
  else {
    maxValue = null;
  }
  if (increment != null) {
    increment = Number(increment);
    if (isNaN(increment)) increment = 1;
    if (increment == 0) increment = 1;
  }
  else {
    increment = 1;
  }

  up.style.position = "absolute";
  up.className = "input";  // to pick up the default zIndex value
  up.style.borderStyle = "none";
  up.style.backgroundColor = "transparent";
  up.src = pui.normalizeURL("/profoundui/proddata/images/up.gif");
  up.style.cursor = "pointer";
  up.onclick = function() {
    me.spin(increment);
  }
  if (pui["is_old_ie"]) {
    // in IE, a double-click does not send two onclick events
    up.ondblclick = function() {
      me.spin(increment);
    }
  }
    
  down.style.position = "absolute";
  down.className = "input";  // to pick up the default zIndex value
  down.style.borderStyle = "none";
  down.style.backgroundColor = "transparent";
  down.src = pui.normalizeURL("/profoundui/proddata/images/down.gif");
  down.style.cursor = "pointer";
  down.onclick = function() {
    me.spin(-increment);
  }
  if (pui["is_old_ie"]) {
    // in IE, a double-click does not send two onclick events
    down.ondblclick = function() {
      me.spin(-increment);
    }
  }
  
  if (dom.pui==null || dom.pui.properties==null || dom.pui.properties["visibility"]==null || dom.pui.properties["visibility"]=="") {
    if ( context=="genie" && dom.fieldInfo!=null && dom.fieldInfo["attr"]!=null ) {
      var attr = dom.fieldInfo["attr"];
      if (attr == "27" || attr == "2F" || attr == "37" || attr == "3F") {
        me.hide();      
      }
    }
  }
  
  if (runtimeMode) {
    dom.style.paddingRight = "16px";
    dom.style.boxSizing = "border-box";
    dom.style.MozBoxSizing = "border-box";
    dom.style.WebkitBoxSizing = "border-box";
    // IE can report 'MSIE 7.0' in user agent when running later versions 
    // in compatability view, regardless of the document mode.
    // The document mode value is set consistently based on document mode, although
    // it does not exist in IE7.
    var ie7 = (pui["is_old_ie"] && pui["ie_mode"] == 7 && (typeof(document.documentMode == 7) == "undefined" || document.documentMode == 7));
    if (ie7) {
      var width = dom.offsetWidth;
      width = width - 36;
      if (width < 16) width = 16;
      dom.style.width = width + "px";
    }
  }

  dom.extraDomEls = [up, down];

  if (dom.parentNode != null) {
    dom.parentNode.appendChild(up);
    dom.parentNode.appendChild(down);
  }

  // Public Properties
  
  // Public Methods
  this.positionSpinnButtons = function() {
    var left;
    left = dom.style.left;
    if (left != null && typeof left == "string" && left.length >= 3 && left.substr(left.length - 2, 2) == "px") left = parseInt(left);
    else left = dom.offsetLeft;
    if (isNaN(left)) left = 0;
    var top;
    top = dom.style.top;
    if (top != null && typeof top == "string" && top.length >= 3 && top.substr(top.length - 2, 2) == "px") top = parseInt(top);
    else top = dom.offsetTop;
    if (isNaN(top)) top = 0;
    up.style.left = left +  dom.offsetWidth - 15 + "px";
    top += parseInt((dom.offsetHeight - 18) / 2);
    if (pui["is_quirksmode"]) top -= 1;
    up.style.top = top + "px";
    up.style.zIndex = dom.style.zIndex;
    up.style.visibility = dom.style.visibility;

    left = dom.style.left;
    if (left != null && typeof left == "string" && left.length >= 3 && left.substr(left.length - 2, 2) == "px") left = parseInt(left);
    else left = dom.offsetLeft;
    if (isNaN(left)) left = 0;
    top = dom.style.top;
    if (top != null && typeof top == "string" && top.length >= 3 && top.substr(top.length - 2, 2) == "px") top = parseInt(top);
    else top = dom.offsetTop;
    if (isNaN(top)) top = 0;
    down.style.left = left + dom.offsetWidth - 15 + "px";
    top += 9;
    top += parseInt((dom.offsetHeight - 18) / 2);
    if (dom.offsetHeight % 2 == 1) {
      if (dom.offsetHeight < 18) top -= 1;
      else top += 1;
    }
    down.style.top = top + "px";
    down.style.zIndex = dom.style.zIndex;
    down.style.visibility = dom.style.visibility;
  }
  
  me.positionSpinnButtons();  // run this in the constructor
  
  this.hide = function() {
    up.style.visibility = "hidden";
    down.style.visibility = "hidden";
  }
  
  this.show = function() {
    up.style.visibility = "";
    down.style.visibility = "";
  }

  this.spin = function(byValue) {
    if (dom.disabled) return;
    if (dom.readOnly) return;
    var num = Number(dom.value);
    if (isNaN(num)) num = 0;
    num += byValue;
    num = Math.round(num * 10000) / 10000;
    if (minValue != null && num < minValue) num = minValue;
    if (maxValue != null && num > maxValue) num = maxValue;
    var maxLen = Number(dom.getAttribute("maxLength"));
    if (maxLen != null && !isNaN(maxLen) && maxLen > 0) {
      if (maxLen == 1 && num < 0) num = 0;
      if (String(num).length > maxLen) return;
    }

    var onspin = dom["onspin"];
    if (onspin != null) {
      var newValue = onspin(dom.value, byValue, dom);
      if (typeof newValue == "string" || typeof newValue == "number"){
        num = newValue;
      }
    }

    dom.value = num;
    dom.modified = true;
    if (context == "genie" && dom.fieldInfo != null && dom.fieldInfo["idx"] != null) {
      pui.response[dom.fieldInfo["idx"]] = dom;
    }

    pui.checkEmptyText(dom);    
  }

}



pui.widgets.add({
  name: "spinner",
  tag: "input",
  pickIcon1: pui.normalizeURL("/profoundui/proddata/images/up.gif"),
  pickIcon2: pui.normalizeURL("/profoundui/proddata/images/down.gif"),
  defaults: {
    "css class": "input"
  },

  propertySetters: {
  
    "field type": function(parms) {
      parms.dom.value = parms.evalProperty("value");
      if (!parms.design) {
        setTimeout( function() { 
          parms.dom.spinner = new pui.Spinner(parms.dom, parms.evalProperty("min value"), parms.evalProperty("max value"), parms.evalProperty("increment value"), !parms.design);
          parms.dom.sizeMe = function() {
            parms.dom.spinner.positionSpinnButtons();
          }
        }, 1);
      }
      else {
        parms.dom.sizeMe = function() {
          var itm = parms.designItem;
          itm.drawIcon();
          itm.mirrorDown();
        }
      }
      if (parms.design) parms.dom.readOnly = true;
    },
    
    "value": function(parms) {
      parms.dom.value = parms.value;
    },
    
    "visibility": function(parms) {
      
      // Oddly, 'spinner' is attached on a time delay, see above. Better make sure it's there -- DR.
      if (!parms.design && parms.dom.spinner) {
      
        if (parms.value == "hidden") {
        
          parms.dom.spinner.hide();
        
        }
        else {
        
          parms.dom.spinner.show();  
        
        }
      
      }
      
    }

  }
  
});

