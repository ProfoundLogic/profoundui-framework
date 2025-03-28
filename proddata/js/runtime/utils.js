/* eslint-disable no-unused-vars */
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

// Note: several functions defined here are exposed as APIs, e.g., via runtime/5250/exports.js, etc.

function getTarget(e) {
  if (e.touches != null && e.touches.length == 1) { // detect touch screen device like iPad
    return e.touches[0].target;
  }
  var targ = e.target;
  if (targ.nodeType == 3) {
    // defeat Safari bug
    targ = targ.parentNode;
  }
  return targ;
}

/**
 * Prevent the event's default behavior from happening, including in listeners in the bubbling and capturing phases.
 * @param {Event} event
 */
function preventEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}

/**
 * Assign to any event listeners that simply prevent an action. For example: tr.onmousedown = pui.preventEvent;
 * @param {Event} event
 * @returns {Boolean}
 */
pui.preventEvent = function(event) {
  preventEvent(event);
  return false;
};

/**
 * Same as "preventEvent" now that IE is no longer supported.
 * @param {Event} e
 */
function disableAction(e) {
  e.preventDefault();
  e.stopPropagation();
}

function preventDoubleSubmit() {
  if (pui["isServerBusy"]()) return false;

  hide_calendar();

  // Execute onsubmit function
  if (designScreens[0] && screenPropertiesObj[designScreens[0].screenId] != null && screenPropertiesObj[designScreens[0].screenId].screen != null) {
    var onsubmitProp = screenPropertiesObj[designScreens[0].screenId].screen["onsubmit"];
    if (onsubmitProp != null && onsubmitProp != "") {
      try {
        var onsubmitReturnVal = eval(onsubmitProp);
        if (onsubmitReturnVal == false) return false;
      }
      catch (err) {
        pui.scriptError(err, "Onsubmit Error:\n");
        return false;
      }
    }
  }

  pui["haltFrames"]();
  pui.submitLog(pui.genie.formSubmitted = true);
  var cursorPos = getCursorPosition(lastActiveElement);
  if (lastActiveElement != null && lastActiveElement.tagName == "INPUT" && lastActiveElement.maxLength != null && lastActiveElement.maxLength > 0 && cursorPos == lastActiveElement.maxLength) {
    // cursor beyond last character
    cursorPos -= 1; // set to last character
  }
  document.getElementById("cursorPos").value = cursorPos;
  return true;
}

/***************************************************************
*  This section of code handles only allowing a set number of  *
*  keys to be pressed.  For example only allowing numbers for  *
*  a numeric field.  This also includes additional keys. These *
*  are keys that must function as normal such as \, Control, *
*  and etc.                                                    *
***************************************************************/

/**
 * @param {Object} e
 */
function numericOnly(e) {
  var target = e.target;
  if (target.autoComp != null) return;
  var allowedUnicodes = [8, 9, 13, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 91, 93, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 112, 123, 144, 145, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123];
  allowKeys(allowedUnicodes, e);
}
function numericDecimalOnly(e) {
  var target = e.target;
  if (target.autoComp != null) return;
  var allowedUnicodes = [8, 9, 13, 16, 17, 18, 19, 20, 27, 32, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 91, 93, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 112, 123, 144, 145, 188, 190, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 189, 109];
  allowKeys(allowedUnicodes, e);
}
function numericSignOnly(e) {
  var target = e.target;
  if (target.autoComp != null) return;
  var allowedUnicodes = [8, 9, 13, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 91, 93, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 109, 112, 123, 144, 145, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 189, pui["field exit key"], pui["field exit minus key"]];
  allowKeys(allowedUnicodes, e);
}
function alphabeticOnly(e) {
  var target = e.target;
  if (target.autoComp != null) return;
  // As per 5250 manual, allow a-z, A-Z, comma, dot, hyphen, and space.
  var allowedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,.- ";
  var allowedUnicodes = [];
  for (var i = 0; i < allowedChars.length; i++) {
    allowedUnicodes.push(allowedChars.charCodeAt(i));
  }
  allowedUnicodes.push(8, 9, 13, 16, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 110);
  allowKeys(allowedUnicodes, e);
}
function inhibitKeyboard(e) {
  if (typeof e.keyCode != "undefined") { // onkeydown
    if (e.ctrlKey == true && e.keyCode == 86) {
      preventEvent(e);
      return false;
    }
    var allowed = allowKeys([13, 112, 123, 144, 145, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123], e);
    if (!allowed) {
      if (!pui.isFieldExit(e) && !e.shiftKey && !e.altKey && !e.ctrlKey && e.key.length == 1) {
        pui.alert(pui["getLanguageText"]("runtimeMsg", "keyboard input inhibited"));
      }
      return false;
    }
  }
  else { // oncontextmenu
    preventEvent(e);
    return false;
  }
}

function defaultField(e) {
  var allowedUnicodes = new Array(256);

  for (var i = 0; i <= 255; i++) {
    allowedUnicodes[i] = i;
  }

  allowKeys(allowedUnicodes, e);
}

function getCursorPosition(obj) {
  var cur;
  if (typeof obj == "string") obj = getObj(obj);
  if (obj == null) return -1;
  if (obj.tagName != "INPUT" || !pui.isTextbox(obj)) return -1;
  if (document.selection != null) {
    if (obj == null) obj = document.activeElement;
    cur = document.selection.createRange();
  }
  var pos = 0;
  if (obj != null && cur != null && obj.createTextRange != null) { // IE
    try {
      var tr = obj.createTextRange();
      if (tr) {
        while (cur.compareEndPoints("StartToStart", tr) > 0) {
          tr.moveStart("character", 1);
          pos++;
        }
        return pos;
      }
    }
    catch (e) {
      return -1;
    }
  }
  else if (obj != null) { // Firefox
    try {
      if (obj.selectionStart != null) return obj.selectionStart;
    }
    catch (err) { };
  }
  return -1;
}

/**
 * If in Visual Designer or in Genie with Design Mode on, then returns true; else false. Note: this must
 * be called after pui.dspfDesign(), after pui.loadDependencyFiles to correctly detect Visual Designer.
 * @returns {Boolean}
 */
function inDesignMode() {
  if (pui.ide && pui.ide.designerId) return true;
  if (toolbar == null) return false;
  if (toolbar.designer == null) return false;
  return true;
}

// Checks Ajax response for errors, and adds any messages to the
// global "errors" object.
// Returns either standard response object or false to indicate error with the response.
function checkAjaxResponse(ajaxRequest, operation) {
  // Check for HTTP-layer error.
  var errorId;
  var error = "";
  var error2 = "";
  var responseObj;
  var isXML = false;
  if (ajaxRequest.getStatus() != 200) {
    errorId = "HTTP " + ajaxRequest.getStatus();
    error = ajaxRequest.getStatusText() + ".";
  }
  // Check for application-layer error.
  // Assume success if there is an XML response (charting).
  else {
    isXML = (ajaxRequest.getResponseText().indexOf("<?xml") != -1);
    if (isXML == false) {
      try {
        responseObj = eval("(" + ajaxRequest.getResponseText() + ")");
        if (responseObj.success != true) {
          errorId = responseObj.errorId;
          error = responseObj.errorText;
          error2 = responseObj.errorText2;
        }
      }
      catch (e) {
        errorId = "CPF9897";
        error = "The server response is missing or invalid.";
      }
    }
  }
  if (errorId != null) {
    errors.push({
      operation: operation,
      id: errorId,
      text: error,
      text2: error2
    });
    return false;
  }
  else {
    if (isXML == true) return ajaxRequest.getResponseText();
    else return responseObj.response;
  }
}

/**
 * Build and position a label element to the right of another element, and associate the label with the element.
 * Called in runtime when rendering checkboxes and radio buttons. Also called in design time.
 * @param {Object} dom
 * @param {String} labelText
 * @param {Object|undefined} label    Only passed by DesignItem.js drawIcon when in design mode.
 */
pui.buildLabel = function(dom, labelText, label) {
  var designMode = true;
  if (label == null) {
    designMode = false;
    label = document.createElement("div");
    label.style.position = "absolute";
    label.style.borderStyle = "none";
    label.style.backgroundColor = "transparent";
  }

  label.innerHTML = '<label title="' + dom.title + '" for="' + dom.id + '">' + labelText + "</label>";
  label.className = "label-for";
  var cls = trim(dom.className.split(" ")[0]);
  if (cls != "") {
    pui.addCssClass(label, "label-for-" + cls);
  }

  // get z-index from the original element
  if (dom.currentStyle) {
    label.style.zIndex = dom.currentStyle.zIndex;
  }
  else if (window.getComputedStyle) {
    label.style.zIndex = document.defaultView.getComputedStyle(dom, null).getPropertyValue("z-index");
  }
  else {
    label.style.zIndex = 20; // default z-index for input fields
  }

  // Set the Y position of the label to the input's Y position.
  if (dom.style.top != "") label.style.top = dom.style.top;
  else if (dom.style.bottom != "") label.style.bottom = dom.style.bottom;

  label.style.zIndex = dom.style.zIndex;
  label.style.visibility = dom.style.visibility;
  label.style.filter = dom.style.filter;
  label.style.opacity = dom.style.opacity;
  label.style.color = dom.style.color;
  label.style.fontFamily = dom.style.fontFamily;
  label.style.fontSize = dom.style.fontSize;
  label.style.fontStyle = dom.style.fontStyle;
  label.style.fontWeight = dom.style.fontWeight;
  label.style.backgroundColor = dom.style.backgroundColor;

  if (!designMode) {
    if (dom.style.cursor) {
      label.style.cursor = dom.style.cursor;
    }
    else {
      label.style.cursor = "pointer";
    }
    label.isLabel = true;
    if (dom.labelObj != null) dom.parentNode.removeChild(dom.labelObj);
    dom.labelObj = label;
    dom.extraDomEls = [];
    dom.extraDomEls.push(label);

    if (dom.parentNode != null) {
      // If a grid column was removed, then parentNode could be null. #4855.
      dom.parentNode.appendChild(label);
    } // If parentNode is null, then the element was added to the grid's runtimeChildren but not used. That's ok.
  }

  // Determine the X position. (Happens after appending child so that label width can be used for "right".)
  var width = dom.offsetWidth;
  if (width < 20) width = 20;

  var styledim;
  if (dom.style.left != "") {
    if (dom.style.left.indexOf("calc") != -1) {
      // Add the input's width to a CSS calc function's parameters.
      setCalcString("left", " + " + width);
    }
    else {
      styledim = pui.getStyleDim(dom.style.left);
      if (styledim[1] == "px") {
        label.style.left = (styledim[0] + width) + "px"; // The units were in px; simply add.
      }
      else {
        // For any other units, let CSS calculate position. Calc avoids the need to use the sizeMe function when inside containers that can resize. #5692.
        label.style.left = "calc(" + dom.style.left + " + " + width + "px)";
      }
    }
  }
  else if (dom.style.right != "") {
    label.style.left = ""; // Since the DOM.style.left is blank, the label's left must be cleared. #5479
    var brect = label.getBoundingClientRect();
    var labelWidth = brect.width;
    if (labelWidth < 10) labelWidth = 10;

    if (dom.style.right.indexOf("calc") != -1) {
      setCalcString("right", " - " + labelWidth); // Add the input's width to a CSS calc function's parameters.
    }
    else {
      styledim = pui.getStyleDim(dom.style.right);
      if (styledim[1] == "px") {
        label.style.right = (styledim[0] - labelWidth) + "px"; // The units were in px; simply subtract.
      }
      else {
        label.style.right = "calc(" + dom.style.right + " - " + labelWidth + "px)"; // Let CSS calculate the position.
      }
    }
  }

  if (dom.style.top == "" && dom.style.bottom != "") {
    label.style.top = ""; // Since the DOM.style.top is blank, the label's top must be cleared.
  }

  function setCalcString(styleProp, appendPxStr) {
    var calcString = trim(dom.style[styleProp]);
    var lastParenth = calcString.lastIndexOf(")");
    if (lastParenth != -1) {
      calcString = calcString.substr(0, lastParenth);
      calcString += appendPxStr + "px)";
      label.style[styleProp] = calcString;
    }
  }
};

// Returns the PC-side timestamp in milliseconds since 1970/01/01 as a string.
function getTimeStamp() {
  return String(new Date().getTime());
}

// Polyfills for older browsers.

if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, "find", {
    value: function(predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== "function") {
        throw TypeError("predicate must be a function");
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    },
    "configurable": true // Needed to prevent error due to FusionCharts trying to re-define the property.
  });
}

// Polyfill from From MDN Array.prototype.findIndex doc page. Array properties should not be enumerable, or else iterating over
// the array  will include the shim method; issue #6535.
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, "findIndex", {
    value: function(predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== "function") {
        throw new TypeError("predicate must be a function");
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    },
    "configurable": true, // Note: this must be quoted so the obfuscated does not change it, and so fusion-charts.js does not have issues. 6535.
    "writable": true
  });
}

if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, "includes", {
    value: function(searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      // 1. Let O be ? ToObject(this value).
      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || (typeof x === "number" && typeof y === "number" && isNaN(x) && isNaN(y));
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        // c. Increase k by 1.
        k++;
      }

      // 8. Return false
      return false;
    },
    "configurable": true // Needed to prevent error due to FusionCharts trying to re-define the property.
  });
}

if (location.origin === undefined) {
  pui.temp_origin = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
  try {
    Object.defineProperty(
      location,
      "origin",
      {
        value: pui.temp_origin,
        "enumerable": true
      }
    );
  }
  catch (error) {
    location.origin = pui.temp_origin;
  }
  delete pui.temp_origin;
}

if (!Object.entries) {
  Object.entries = function(obj) {
    var ownProps = Object.keys(obj);
    var i = ownProps.length;
    var resArray = new Array(i); // preallocate the Array
    while (i--) {
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    }

    return resArray;
  };
}

if (!String.prototype.includes) {
  Object.defineProperty(String.prototype, "includes", {
    value: function(search, start) {
      "use strict";

      if (search instanceof RegExp) {
        throw TypeError("first argument must not be a RegExp");
      }
      if (start === undefined) {
        start = 0;
      }
      return this.indexOf(search, start) !== -1;
    }
  });
}

if (!String.prototype.startsWith) {
  Object.defineProperty(String.prototype, "startsWith", {
    value: function(search, rawPos) {
      var pos = rawPos > 0 ? rawPos | 0 : 0;
      return this.substring(pos, pos + search.length) === search;
    }
  });
}

pui.getPropConfig = function(namedModel, propertyName) {
  var config = namedModel[propertyName];
  if (config == null) {
    var parts = propertyName.split(" ");
    var idx = Number(parts[parts.length - 1]);
    if (!isNaN(idx) && idx > 0) {
      parts.pop();
      var configName = parts.join(" ");
      var modelConfig = namedModel[configName];
      if (modelConfig != null) {
        config = {};
        for (var prop in modelConfig) {
          var value = modelConfig[prop];
          if (prop == "name") {
            config["name"] = propertyName;
          }
          else if (typeof value == "object" && value.length != null) { // array
            config[prop] = [];
            for (var i = 0; i < value.length; i++) {
              config[prop].push(value[i]);
            }
          }
          else {
            config[prop] = modelConfig[prop];
          }
        }
      }
    }
  }
  return config;
};

// Returns index of element in array, if found, or -1 if not.
pui.arrayIndexOf = function(array, element) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == element) return i;
  }
  return -1;
};

// Calls a function for each array element.
pui.arrayForEach = function(array, func) {
  for (var i = 0; i < array.length; i++) {
    func(array[i]);
  }
};

pui.safeParseInt = function(stringValue, nanValue) {
  if (nanValue == null) nanValue = 0;
  var number = parseInt(stringValue, 10);
  if (isNaN(number)) number = nanValue;
  return number;
};

/*  usage:
      addEvent(obj, 'keypress', function(e) {
        pui.keyFilter(e, regEx);
      });
*/
pui.keyFilter = (function() {
  var specialKeys = {
    9: "Tab",
    13: "Enter",
    16: "Shift",
    17: "Ctrl",
    18: "Alt",
    19: "Pause",
    20: "Caps Lock",
    27: "Esc",
    33: "Page Up",
    34: "Page Down",
    35: "End",
    36: "Home",
    37: "Left",
    38: "Up",
    39: "Right",
    40: "Down",
    45: "Insert",
    // Safari
    3: "Enter",
    63234: "Left",
    63235: "Right",
    63232: "Up",
    63233: "Down",
    63276: "Page Up",
    63277: "Page Down",
    63272: "Delete",
    63273: "Home",
    63275: "End"
  };
  return function(e, re) {
    var chr = e.key || String.fromCharCode(e.charCode || e.keyCode);
    if (e.ctrlKey ||
        (chr && chr.length > 1) ||
        (!chr && !e.key && specialKeys[e.keyCode])) {
      return;
    }

    if (!re.test(chr)) {
      preventEvent(e);
    }
  };
})();

function allowKeys(allowedUnicodes, e) {
  // Allow user-defined key mappings in Genie.

  if (context == "genie" && pui.genie.getMappedKeyName(e) != "") {
    return true;
  }

  if (context == "dspf") return allowKeysSimple(allowedUnicodes, e);

  var obj;
  var key;
  var len;
  var pos;
  var success;
  var shiftKey;

  key = e.keyCode;
  obj = e.target;

  var isTextbox = pui.isTextbox(obj);

  if (pui.genie.formSubmitted) {
    if (pui.genie.config.enableKeyAhead) {
      if (e.modifiers) shiftKey = e.modifiers && Event.SHIFT_MASK;
      if (!e.modifiers) shiftKey = e.shiftKey;
      if (shiftKey) keyAhead.record("shift" + key);
      else keyAhead.record(key);
    }
    preventEvent(e);
    return false;
  }

  lastActiveElement = obj;

  if (key == 9) { // tab key
    if (e.modifiers) shiftKey = e.modifiers && Event.SHIFT_MASK;
    if (!e.modifiers) shiftKey = e.shiftKey;
    if (shiftKey) {
      success = goPrev(obj, 0, true);
      if (success) {
        preventEvent(e);
        return false;
      }
    }
    else {
      success = goNext(obj, true);
      if (success) {
        preventEvent(e);
        return false;
      }
    }
  }
  // if (key == 8) {     // backspace key

  // Let's not do this anymore...

  // if (isTextbox) {
  //  pos = getCursorPosition(obj);
  //  if (pos == 0) {
  //    goPrev(obj);
  //    disableAction(e);
  //    return false;
  //  }
  // }
  // else {
  //  if (obj.tagName != "TEXTAREA") goPrev(obj);
  //  disableAction(e);
  //  return false;
  // }
  // }
  else if (key == 35 && isTextbox) { // end key
    if (obj.value != rtrim(obj.value)) {
      obj.value = rtrim(obj.value);
    }
  }
  else if (key == 37) { // left key
    if (isTextbox) {
      pos = getCursorPosition(obj);
      if (pos == 0) {
        goPrev(obj);
        preventEvent(e);
        return false;
      }
    }
    else {
      if (obj.tagName != "TEXTAREA") {
        goPrev(obj);
        preventEvent(e);
        return false;
      }
    }
  }
  else if (key == 38 && obj.tagName != "SELECT" && obj.tagName != "TEXTAREA") { // up key
    // Do not process up key if the field is an auto complete field and the
    // result pane is open.
    if (obj.autoComp == null || obj.autoComp.isOpen() == false) {
      if (!pui.genie.config.browserAutoComplete) {
        goUp(obj);
        preventEvent(e);
        return false;
      }
    }
  }
  else if (key == 39) { // right key
    if (isTextbox) {
      maxLength = Number(obj.getAttribute("maxLength"));
      pos = getCursorPosition(obj);
      len = obj.value.length;
      if (pos >= len) {
        goNext(obj);
        preventEvent(e);
        return false;
      }
    }
    else {
      if (obj.tagName != "TEXTAREA") {
        goNext(obj);
        preventEvent(e);
        return false;
      }
    }
  }
  else if (key == 40 && obj.tagName != "SELECT" && obj.tagName != "TEXTAREA") { // down key
    // Do not process up key if the field is an auto complete field and the
    // result pane is open.
    if (obj.autoComp == null || obj.autoComp.isOpen() == false) {
      if (!pui.genie.config.browserAutoComplete) {
        goDown(obj);
        preventEvent(e);
        return false;
      }
    }
  }
  else if (key == 45 && pui["is_ie"] && isTextbox && context == "genie" && e.shiftKey != true && e.ctrlKey != true) { // insert key
    // When a Genie field is full of whitespace and a user types Insert, then IE won't let them type because the field
    // is full because gotFocusField() in 5250/utils.js filled it. Trim after the caret to allow typing. Issue 4592.
    var selectEnd = obj.selectionEnd;
    var curval = obj.value.substring(0, selectEnd);
    curval += rtrim(obj.value.substring(selectEnd));
    obj.value = curval;
    obj.setSelectionRange(selectEnd, selectEnd); // setting value changed cursor position, so reset it.
  }
  if (isTextbox && pui.isFieldExit(e)) {
    pui.storeCursorPosition(obj);
    if (key == pui["field exit minus key"] && fieldExit(obj, true)) {
      preventEvent(e);
      return false;
    }
    // Retrieves the num attribute from the field and checks if it is a numeric field/Alphanumeric field.
    var numSpec = obj.getAttribute("num");
    // If the field is a numeric field, then the field exit is triggered on the field exit key. If the field is an alphanumeric field check if the disable field exit on alphanumeric is set to false.
    if (key == pui["field exit minus key"] && fieldExit(obj, true) && !pui["disable field exit on alphanumeric"]) {
      // Proceed with the field exit.
      preventEvent(e);
      return false;
    }
    // if the field is alphanumeric and the disable field exit on alphanumeric is set to true, then the field exit is disabled. and assign the "minus" character to the field.
    else if (pui["disable field exit on alphanumeric"] && (numSpec == null || numSpec == "000" || numSpec == "010")) {
      return false;
    }
    // everything else, proceed with the field exit.
    fieldExit(obj);
    preventEvent(e);
    return false;
  }

  if (e.ctrlKey == true && (key == 67 || key == 86)) { // allow ctrl-c and ctrl-v for copy/paste
    return true;
  }

  for (var i = 0; i < allowedUnicodes.length; i++) {
    if (allowedUnicodes[i] == key) {
      if (e.modifiers && Event.SHIFT_MASK) {
        // case exits
      }
      else {
        return true;
      }
    }
  }
  preventEvent(e);
  return false;
}

function fieldExit(obj, minus) {
  if (obj.readOnly == true) return false;
  var blankFill;
  var zeroFill;
  var rightAdjust = false;
  var maxLength;
  var signedNumeric = obj.getAttribute("signedNumeric");
  var numAttr = obj.getAttribute("num");
  var isNum = (numAttr === "011" || numAttr === "101" || numAttr === "111");
  var needsOnchange = false;
  if (minus && (signedNumeric == null || signedNumeric != "Y") && !isNum) return false;
  var pos = obj.cursorPosition;
  if (pui["is_touch"] && !pui["is_mouse_capable"]) {
    pos = getCursorPosition(obj);
  }
  if (pos == null) return false;
  if (pos < 0) return false;
  if (pos >= 0) {
    needsOnchange = (obj.value !== obj.value.substr(0, pos));
    obj.value = obj.value.substr(0, pos);
    blankFill = obj.getAttribute("blankFill");
    if ((signedNumeric != null && signedNumeric == "Y") || isNum) blankFill = "Y";
    if (blankFill != null && blankFill == "Y") {
      rightAdjust = true;
      fill = "                                                                                ";
    }
    zeroFill = obj.getAttribute("zeroFill");
    if (zeroFill != null && zeroFill == "Y") {
      rightAdjust = true;
      fill = "00000000000000000000000000000000000000000000000000000000000000000000000000000000";
    }
    maxLength = obj.getAttribute("maxLength");
    if (rightAdjust && maxLength != null) {
      var newValue = fill + ltrim(obj.value);
      newValue = newValue.substr(newValue.length - maxLength);
      if ((signedNumeric != null && signedNumeric == "Y") || (minus && isNum)) {
        if (newValue.substr(newValue.length - 1) != "-") {
          if (minus) {
            newValue += "-";
          }
          else {
            newValue += " ";
          }
          newValue = newValue.substr(1);
        }
      }
      obj.value = newValue;
    }
  }
  if (needsOnchange && typeof obj.onchange === "function") {
    obj.onchange();
  }

  // inserted to enable CHECK(ER) functionality...
  if (obj.getAttribute("autoenter") === "Y") {
    pressKey("enter");
  }
  else {
    goNext(obj);
  }

  return true;
}

pui.beforeUnload = function(event) {
  if ((pui["is_touch"] && !pui["is_mouse_capable"]) || pui.iPadEmulation) return;
  if (pui.observer != null) return;

  if (pui.confirmOnClose && !pui.skipConfirm) {
    if (context == "genie" && pui.isSignOnScreen()) return;
    var par = window;
    while (par != null && par != par.parent) {
      par = par.parent;
      if (pui.checkForAtrium(par)) return;
      try {
        if (typeof par["pui"] != "undefined") return;
      }
      catch (e) {
      }
    }
    if (pui.genie != null || !pui.designer.Designer || (context == "dspf" && pui.designer.Designer && typeof pui.ide.isDirty === "function" && pui.ide.isDirty())) {
      var theCloseMessage;
      if (pui.codeBased) theCloseMessage = pui.closeMessage;
      else theCloseMessage = pui["getLanguageText"]("runtimeMsg", "closeMessage");
      if (context == "genie" && pui.genie.config.closeMessage != null && pui.genie.config.closeMessage != "") {
        theCloseMessage = pui.genie.config.closeMessage;
      }
      event.returnValue = theCloseMessage;
      return theCloseMessage;
    }
  }
};

pui["unload"] = function() {
  // For Genie: if pui["hardshutdownOnClose"] is true, then send flag hardshutdown=1 so that the Genie CTL job
  // program PUI0002110 will issue ENDJOB *IMMED to end the Genie APP job, to free up the device to be used
  // on next sign on.
  var hardshutdownOnClose = false;
  if (pui.genie !== null && pui["hardshutdownOnClose"]) {
    hardshutdownOnClose = true;
  }

  if ((pui.shutdownOnClose || hardshutdownOnClose) && pui.observer == null) {
    pui["halted"] = true;
    window["puihalted"] = true;
    if (!pui["keep frames"]) pui.killFrames();
    var url;
    if (pui.genie == null) url = getProgramURL("PUI0001200.pgm");
    else url = getProgramURL("PUI0002110.pgm");
    if (pui.psid != null && pui.psid != "") url += "/" + pui.psid;
    if (pui["overrideSubmitUrl"] != null && typeof pui["overrideSubmitUrl"] == "function") {
      try {
        url = pui["overrideSubmitUrl"](url);
      }
      catch (e) {
      }
    }
    // Redmine #4624
    // Use Blob to set Content-Type: application/x-www-form-urlencoded
    // Otherwise, Profound.js controller is unable to parse the POST.
    if (navigator != null && typeof navigator["sendBeacon"] == "function" && typeof window["Blob"] == "function") {
      if (hardshutdownOnClose) {
        var shutdownFlag = "hardshutdown=1";
      }
      else {
        shutdownFlag = "shutdown=1";
      }
      var data = shutdownFlag + (pui["isCloud"] ? "&workspace_id=" + pui.cloud.ws.id : "");
      var blob = new Blob([data], { type: "application/x-www-form-urlencoded" });
      navigator["sendBeacon"](pui.addRequestId(url), blob);
    }
    else {
      var ajaxParams;
      if (hardshutdownOnClose) {
        ajaxParams = {
          "hardshutdown": "1"
        };
      }
      else {
        ajaxParams = {
          "shutdown": "1"
        };
      }
      if (pui["isCloud"]) {
        ajaxParams["workspace_id"] = pui.cloud.ws.id;
      }
      ajax({
        url: pui.addRequestId(url),
        method: "post",
        "suppressAlert": true,
        params: ajaxParams
      });
    }
    pui.shutdownOnClose = false;
  }
};

pui.assignUnloadEvents = function() {
  if (window.addEventListener) {
    window.addEventListener("beforeunload", pui.beforeUnload, false);
    if (!pui.designer.Designer || pui.genie != null) {
      window.addEventListener("unload", pui["unload"], false);
    }
  }
  else if (window.attachEvent) {
    window.attachEvent("onbeforeunload", pui.beforeUnload);
    if (!pui.designer.Designer || pui.genie != null) {
      window.attachEvent("onunload", pui["unload"]);
    }
  }
};

pui.downloadAsAttachment = function(contentType, fileName, data) {
  var form = document.createElement("form");
  form.action = getProgramURL("PUI0009106.pgm");
  if (pui["pjsServer"]) form.action = "/profoundui/PUI0009106.pgm"; // Don't use getProgramURL() when served from PJS server
  form.action += "?contentType=" + contentType + "&fileName=" + fileName;
  if (pui["isCloud"]) {
    form.action += "&workspace_id=" + pui.cloud.ws.id;
  }
  form.method = "post";
  var hiddenField = createNamedElement("input", "data");
  hiddenField.type = "hidden";
  hiddenField.value = data;
  form.appendChild(hiddenField);
  document.body.appendChild(form);
  pui.skipConfirm = true;
  form.submit();
  setTimeout(function() {
    form.parentNode.removeChild(form);
    pui.skipConfirm = false;
  }, 0);
};

pui.addCssClass = function(dom, clsName) {
  var cls = dom.className;
  if (cls == null) cls = "";
  var clsArray = cls.split(" ");
  var newClsArray = [];
  for (var i = 0; i < clsArray.length; i++) {
    if (clsArray[i] == clsName) return;
    if (clsArray[i] != "") newClsArray.push(clsArray[i]);
  }
  newClsArray.push(clsName);
  dom.className = newClsArray.join(" ");
};

/**
 * Change an element's .className by removing a specified class.
 * @param {type} dom      Element to affect.
 * @param {type} clsName  Name of class to remove from className.
 * @returns {undefined}
 */
pui.removeCssClass = function(dom, clsName) {
  dom.className = pui.removeFromStringList(dom.className, clsName);
};

/**
 * Remove a string from a delimiter-separated string of entries. e.g. css class name.
 *
 * @param {String} separatedListStr   Space-separated list or other type of list string.
 * @param {String} remString          The entry to remove.
 * @param {Null|String} separator     (optional) The delimiter character. Default is space.
 * @returns {String}                  Returns the list sans remString or empty string.
 */
pui.removeFromStringList = function(separatedListStr, remString, separator) {
  if (separatedListStr == null) return "";
  if (separatedListStr == "") return "";
  if (separator == null || separator == "") separator = " ";
  var clsArray = separatedListStr.split(separator);
  var newClsArray = [];
  for (var i = 0; i < clsArray.length; i++) {
    if (clsArray[i] != "" && clsArray[i] != remString) newClsArray.push(clsArray[i]);
  }
  return newClsArray.join(" ");
};

pui.setEmptyText = function(dom, emptyText) {
  if (dom.readOnly || dom.disabled) return;
  if (emptyText == null || emptyText == null) return;
  var box = dom;
  if (box.comboBoxWidget != null) box = box.comboBoxWidget.getBox();
  if (box.floatingPlaceholder != null) box = box.floatingPlaceholder.getBox();
  box.emptyText = emptyText;
  pui.checkEmptyText(box);
  addEvent(box, "focus", function(e) {
    var target = getTarget(e);
    if (target.value == target.emptyText) {
      target.value = "";
      pui.removeCssClass(target, "empty-text");
    }
  });
  addEvent(box, "blur", function(e) {
    var target = getTarget(e);
    pui.checkEmptyText(target);
  });
};

pui.checkEmptyText = function(dom) {
  if (dom.readOnly || dom.disabled) return;
  if (dom.emptyText == null || dom.emptyText == null) return;
  if (dom.value == "") {
    dom.value = dom.emptyText;
  }
  if (dom.value == dom.emptyText) {
    pui.addCssClass(dom, "empty-text");
  }
  else {
    pui.removeCssClass(dom, "empty-text");
  }
};

pui.attachOnUserActivity = function() {
  if (pui.onUserActivityAttached) return;
  try {
    var atriumSettings = Atrium["getSettings"]();
  }
  catch (error) {
  }
  var atriumTimeout = (atriumSettings && atriumSettings["ACTIMEOUT"] === "1");
  if (!atriumTimeout && pui["onuseractivity"] == null && pui["client side timeout"] != true) return;
  function onUserActivity() {
    if (atriumTimeout) Atrium["resetInactivityTimeout"]();
    else if (pui["client side timeout"] == true) pui.timeoutMonitor.timer.reset();
    if (pui["onuseractivity"] != null) pui["onuseractivity"]();
  }
  addEvent(document.body, "keydown", onUserActivity);
  addEvent(document.body, "mousemove", onUserActivity);
  addEvent(document.body, "click", onUserActivity);
  addEvent(document.body, "touchstart", onUserActivity);
  addEvent(document.body, "touchmove", onUserActivity);
  pui.onUserActivityAttached = true;
};

// Keeps the server job from timing out
pui.autoKeepAlive = {};
pui.autoKeepAlive.lastServerAccess = new Date().getTime();
pui.autoKeepAlive.started = false;
pui.autoKeepAlive.timeout = 600; // in seconds
pui.autoKeepAlive.intervalId = null;

pui.autoKeepAlive.setup = function() { // called when screen is rendered
  if (pui.autoKeepAlive.started) {
    pui.autoKeepAlive.reset();
    return;
  }
  var interval = pui["keep alive interval"];
  try {
    var atriumSettings = Atrium["getSettings"]();
  }
  catch (error) {
  }
  if (atriumSettings && atriumSettings["ACTIMEOUT"] === "1") {
    // Session timeout controlled by Atrium, keep session alive.
    interval = pui.timeout - 10;
  }
  if (interval == null) return;
  pui.autoKeepAlive.timeout = interval;
  pui.autoKeepAlive.start();
};

pui.autoKeepAlive.start = function() {
  if (pui.autoKeepAlive.started) return;
  var milliseconds = pui.autoKeepAlive.timeout * 1000;
  // checking should be more frequent than timeout
  milliseconds = milliseconds / 4;
  if (milliseconds > 3000) milliseconds = 3000; // at least every 3 seconds
  pui.autoKeepAlive.intervalId = setInterval(pui.autoKeepAlive.check, milliseconds);
  pui.autoKeepAlive.reset();
  pui.autoKeepAlive.started = true;
};

pui.autoKeepAlive.stop = function() {
  if (!pui.autoKeepAlive.started) return;
  clearInterval(pui.autoKeepAlive.intervalId);
  pui.autoKeepAlive.started = false;
};

pui.autoKeepAlive.reset = function() {
  pui.autoKeepAlive.lastServerAccess = new Date().getTime();
};

pui.autoKeepAlive.check = function() {
  var elapsedTime = (new Date().getTime()) - pui.autoKeepAlive.lastServerAccess; // elapsed time since last server access
  if (elapsedTime >= pui.autoKeepAlive.timeout * 1000) {
    pui["keepAlive"]();
    pui.autoKeepAlive.reset();
  }
};

pui.isRightClick = function(e) {
  if (e.which != null) {
    if (e.which > 1) {
      return true;
    }
  }
  if (e.button != null) {
    if (e.button > 1) {
      return true;
    }
  }
  return false;
};

/**
 * Returns the left and top offset of the object relative to the page origin.
 * @param {Object} obj
 * @param {Boolean|undefined} handleZoom      Pass true when handling mouse events on the design canvas or items inside of it
 * @returns {Array.<Number>}    [ left, top ].
 */
pui.getOffset = function(obj, handleZoom) {
  var curleft = 0;
  var curtop = 0;
  var countdown = -1; // When it reaches zero, compensate that element's scroll for zoom.

  // Elements inside the scaled designer canvas need adjustments.
  handleZoom = handleZoom === true && context == "dspf" && toolbar != null && toolbar.designer != null && toolbar.designer.container != null &&
    // Avoid calculating for zoom when element is not related to the canvas; e.g. Responsive Editor.
    toolbar.designer.container.parentNode != null && toolbar.designer.container.parentNode.parentNode != null &&
    toolbar.designer.container.parentNode.parentNode.contains(obj);

  // Get offsets from obj and each offsetParent until there are no more parents.
  while (obj != null) {
    var subtractScroll = true;

    var tmpleft = obj.offsetLeft;
    var tmptop = obj.offsetTop;

    if (handleZoom) {
      // obj is the mobile-device-looking div, which is the parent of the canvas.
      if (obj.isCanvasOutline) {
        // Include the zoom-adjusted offsets and borders but not the scroll left/top.
        tmpleft = Math.round((obj.offsetLeft + obj.clientLeft) * toolbar.zoomDecimal);
        tmptop = Math.round((obj.offsetTop + obj.clientTop) * toolbar.zoomDecimal);
        countdown = 1; // two parents up from this should adjust for zoom.
        subtractScroll = false;
      }
      // obj has scrollbars affected by zoom. this is "dspfDesignerN_" when there's no mobile div,
      else if (countdown == 0) {
        tmpleft -= Math.round(obj.scrollLeft * toolbar.zoomDecimal);
        tmptop -= Math.round(obj.scrollTop * toolbar.zoomDecimal);
        subtractScroll = false;
        handleZoom = false;
      }
      else {
        countdown--;
        // Include the offset and the border width, subtract scroll, adjusted for zoom.
        tmpleft = Math.round((obj.offsetLeft + obj.clientLeft - obj.scrollLeft) * toolbar.zoomDecimal);
        tmptop = Math.round((obj.offsetTop + obj.clientTop - obj.scrollTop) * toolbar.zoomDecimal);
        subtractScroll = false;
        // obj is the canvas. One parent up from this should adjust for zoom. (unless isCanvasOutline is reached first).
        if (obj == toolbar.designer.container) countdown = 0;
      }
    }

    curleft += tmpleft;
    curtop += tmptop;

    // Compensate for content scroll position, but not for the body tag.
    // body.scrollTop/Left in Chrome, Safari, and Opera is the window scroll
    // top/left. Offset shouldn't change when the page scrolls.
    if (obj.tagName !== "BODY" && subtractScroll) {
      curleft -= obj.scrollLeft;
      curtop -= obj.scrollTop;
    }

    // Include the style transform in the offset.
    if (obj.className == "scroller") {
      var transform = obj.style["transform"];
      if (transform == null) transform = obj.style["webkitTransform"];
      if (transform != null && typeof transform == "string" && transform.substr(0, 10) == "translate(") {
        transform = transform.substr(10);
        transform = transform.split(")")[0];
        var transformParts = transform.split(",");
        var transformLeft = transformParts[0];
        var transformTop = transformParts[1];
        if (transformLeft != null && transformTop != null) {
          transformLeft = parseInt(trim(transformLeft));
          transformTop = parseInt(trim(transformTop));
          if (!isNaN(transformLeft) && !isNaN(transformTop)) {
            curleft += transformLeft;
            curtop += transformTop;
          }
        }
      }
    }
    // Note: when handling zoom using offsetParent would skip elements that need to be detected.
    // Omit TD nodes to avoid double counting offsets; e.g. elements inside table or mobile scroller layouts.
    // offsetParent is the next non-static element, but div.puiresp are static and can have scroll. Don't skip their scroll. #6005.
    if (obj.parentNode && obj.parentNode.tagName != "TD" &&
    (handleZoom || (obj.parentNode.className == "puiresp" && (obj.parentNode.scrollTop > 0 || obj.parentNode.scrollLeft > 0)))) {
      obj = obj.parentNode;
    }
    else obj = obj.offsetParent;
  }
  return [curleft, curtop];
};

/**
 * Provides common methods for child classes.
 * @constructor
 * @returns {pui.BaseClass}
 */
pui.BaseClass = function() {};

/**
 * Utility for deleting class members. This should be called from a child's prototype.destroy method by: "this.deleteOwnProperties();".
 * It may also be called like this: pui.BaseClass.prototype.deleteOwnProperties.call(someObject);
 */
pui.BaseClass.prototype.deleteOwnProperties = function() {
  if (this != null && this != window && this != document) {
    var propnames = Object.getOwnPropertyNames(this);
    for (var i = 0, n = propnames.length; i < n; i++) {
      try {
        delete this[propnames[i]]; // Removes any properties that were assigned like: "this.foo = bar";.
      }
      catch (exc) {
        console.log(exc);
      }
    }
  }
};

/**
 * Returns false. Can be used as a listener to 'selectstart' to disable selection, etc.
 * @returns {Boolean}
 */
pui.BaseClass.prototype.returnFalse = function() {
  return false;
};
//
// end of BaseClass
//

/**
 * Multi-Part Class
 * @constructor
 */

pui.MultiPart = function() {
  // Public methods.
  this.addParts = function(partsArray) {
    if (typeof (partsArray.length) == "undefined") {
      partsArray = new Array(partsArray);
    }
    var part;
    for (var i = 0; i < partsArray.length; i++) {
      part = {};
      for (var j in partsArray[i]) {
        part[j.toUpperCase()] = partsArray[i][j];
      }
      parts.push(part);
    }
  };

  this.send = function(url, callback) {
    var newline = "\r\n";
    var partsString = "";
    var part;
    var contentType;
    var boundary = getBoundary();

    // Step one: Turn parts objects UTF-8 encoded part string.
    for (var i = 0; i < parts.length; i++) {
      part = parts[i];
      if (typeof (part["NAME"]) != "string" || typeof (part["VALUE"]) != "string") {
        continue;
      }
      partsString += "--" + boundary + newline;
      partsString += "Content-Disposition: form-data; name=\"" + part["NAME"] + "\"";
      if (typeof (part["FILENAME"]) == "string") {
        contentType = "application/octet-stream";
        if (typeof (part["CONTENTTYPE"]) == "string") {
          contentType = part["CONTENTTYPE"];
        }
        partsString += "; filename=\"" + part["FILENAME"] + "\"" + newline;
        partsString += "Content-Type: " + contentType;
      }
      if (part["TRANSFERENCODING"] != null) {
        partsString += newline + "Content-Transfer-Encoding: " + part["TRANSFERENCODING"];
      }
      partsString += newline + newline;
      partsString += part["VALUE"];
      partsString += newline;
    }
    partsString += "--" + boundary + "--";

    // Step two: Send.
    var req = new pui.Ajax(url);
    req["suppressAlert"] = true;
    req["async"] = true;
    req["method"] = "POST";
    req["sendAsBinary"] = false;
    req.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
    req["postData"] = partsString;
    req["onready"] = callback;
    req.send();
  };

  // Private fields.

  var parts = [];

  // Private methods.

  function getBoundary() {
    // Generate unique boundary sequence which does not
    // appear in any part values.
    var quit = false;
    var stub = "ProfoundUIMIMEBoundary";
    var boundary;
    var value;
    var found;
    while (!quit) {
      boundary = stub + Math.ceil(1000000000 * Math.random());
      found = false;
      for (var i = 0; i < parts.length; i++) {
        value = parts[i]["VALUE"];
        if (value.indexOf(boundary) != -1) {
          found = true;
          break;
        }
      }
      if (!found) {
        quit = true;
      }
    }

    return boundary;
  }
};

pui.storeEventCursorPosition = function(e) {
  var obj = getTarget(e);
  pui.storeCursorPosition(obj);
};

pui.storeCursorPosition = function(obj) {
  obj.cursorPosition = getCursorPosition(obj);
};

/**
 * Parse a comma-separated string of field names and return them in a list.
 *
 * @param {String} propVal
 * @param {Boolean} stopAtFrom  When true, if " FROM " is detected outside a string
 *                              or parentheses, return fieldnames found before it.
 * @returns {Array}   Empty array if no fields parsed.
 */
pui.getFieldList = function(propVal, stopAtFrom) {
  var fields = [];
  var fromstr = " from ";
  var frompos = 0;
  var character = "";
  var field = "";
  var parenLevel = 0;
  var inQuote = false;
  for (var i = 0; i < propVal.length; i++) {
    if (stopAtFrom === true && frompos == 6) {
      // Remove " from " from the last field name, and stop looking.
      field = field.substr(0, field.length - 6);
      break;
    }

    character = propVal.charAt(i);
    if (!inQuote) {
      if (character == "(") {
        parenLevel += 1;
        frompos = 0;
      }
      else if (character == ")") {
        parenLevel -= 1;
        frompos = 0;
      }
      else if (character == "'") {
        inQuote = true;
        frompos = 0;
      }
      else if (parenLevel == 0) {
        // If this character matches another character in " from ", then increase position.
        if (character.toLowerCase() == fromstr.charAt(frompos)) {
          frompos++;
        }
        else {
          frompos = 0;
        } // " from " didn't match, so reset position.
      }

      if (parenLevel < 1) parenLevel = 0;
    }
    else {
      if (character == "'") inQuote = false;
    }
    if (character == "," && parenLevel == 0 && !inQuote) {
      fields.push(trim(field));
      field = "";
      frompos = 0;
    }
    else {
      field += character;
    }
  }
  fields.push(trim(field));

  return fields;
};

pui.sqlProps = {

  "remote system name": null,
  "database file": null,
  "database fields": null,
  "selection criteria": null,
  "order by": null,
  "custom sql": null,
  "name field": null,
  "value field": null,
  "summary option": null,
  "choices database file": null,
  "choice options field": null,
  "choice values field": null,
  "choices selection criteria": null,
  "parameter value": null,
  "choices parameter value": null,
  "case sensitive": null,
  "blob table": null,
  "blob column": null,
  "blob selection criteria": null

};

pui.isSQLProp = function(prop) {
  return (typeof (pui.sqlProps[prop]) != "undefined");
};

pui.getSQLVarName = function(dom) {
  var varName = context + ".";

  var id = dom.id;
  if (dom.parentNode != null && dom.parentNode.floatingPlaceholder != null) {
    id = dom.parentNode.id;
  }

  if (context == "genie" && dom.parentNode != pui.runtimeContainer) {
    // Strip window index, as the server
    // processing is not aware of the resulting id at
    // .scn file processing time.
    var pos = id.lastIndexOf("_W");
    if (pos != -1) {
      id = id.substr(0, id.lastIndexOf("_W") + 2);
    }
  }

  var inGrid = (typeof (dom.parentNode.parentNode.grid) != "undefined");
  if (!inGrid || dom.hasBoundSQLProps) {
    varName += id;
  }
  else {
    var len = id.lastIndexOf(".") + 1;
    varName += id.substr(0, len) + "*";
  }

  return varName;
};

/**
 * Generate SQL parameters in the form of a URL-encoded string based on supplied properties.   Test cases: see #5221.
 * Pre-Conditions: Parameter names are mutually exclusive; e.g. "parameter value" isn't used when "choices parameter value" is.
 * @param {Object} properties   Input. Key-value pairs of property names and values for the widget.
 * @param {Object|Null} obj     Output. Not null for image widget; gets p1: val2, p2: val2, etc.
 * @param {FormData|undefined} formData  Output. When not undefined, this gets appended to. (for Grid XLSX data-grid export.)
 * @returns {String}
 */
pui.getSQLParams = function(properties, obj, formData) {
  var isTextbox = (properties["field type"] == "textbox");
  var idx = 1;
  var propVal = "";
  var paramString = ""; // The returned URL string.
  var paramStringAnd = ""; // URL parameter separator. Becomes "&" after first parameter is set.
  var pnameregex = /^(choices |blob )?(parameter value)( \d+)?/;
  var suffix = "";

  // Determine which property name is given and what the maximum parameter number is. There may be gaps between numbers.
  var maxidx = 1;
  var propname;
  for (var p in properties) {
    var matches = pnameregex.exec(p);
    if (matches) {
      if (propname == null) {
        propname = (matches[1] ? matches[1] : "") + matches[2];
      }
      if (matches[3] != null) {
        maxidx = Math.max(maxidx, parseInt(matches[3], 10));
      }
    }
  }
  if (propname == null) return datetimestring();

  // Get each non-empty parameter in numerical order.
  do {
    propVal = evalPropertyValue(properties[propname + suffix]);

    if (propVal != "") {
      var paramNum = idx;

      if (isTextbox) {
        paramNum += 1;
      }

      var tmpval = encodeURIComponent(propVal);
      paramString += paramStringAnd + "p" + paramNum + "=" + tmpval;

      if (formData != null) formData.append("p" + paramNum, tmpval);

      if (obj != null) {
        obj["p" + paramNum] = propVal;
      }

      paramStringAnd = "&";
    }

    idx++;

    suffix = " " + idx;
  } while (idx <= maxidx);

  return datetimestring();

  function datetimestring() {
    var dateFmt = pui.getSQLDateFmt();
    var timeFmt = pui.getSQLTimeFmt();

    var tmpval = encodeURIComponent(dateFmt.fmt);
    paramString += paramStringAnd + "datfmt=" + encodeURIComponent(tmpval);
    if (formData != null) formData.append("datfmt", tmpval);

    tmpval = encodeURIComponent(dateFmt.sep);
    paramString += "&datsep=" + tmpval;
    if (formData != null) formData.append("datsep", tmpval);

    tmpval = encodeURIComponent(timeFmt.fmt);
    paramString += "&timfmt=" + tmpval;
    if (formData != null) formData.append("timfmt", tmpval);

    tmpval = encodeURIComponent(timeFmt.sep);
    paramString += "&timsep=" + tmpval;
    if (formData != null) formData.append("timsep", tmpval);

    return paramString;
  }
};

pui.isPercent = function(value) {
  if (value == null) return false;
  if (typeof value != "string") return false;
  if (value == "") return false;
  if (value.substr(value.length - 1, 1) == "%") return true;
  return false;
};

pui.isNumericString = function(value) {
  if (value == null) return false;
  if (typeof value != "string") return false;
  var num = Number(value);
  if (isNaN(num)) return false;
  if (String(num) === value) return true;
  return false;
};

// Returns checks for position/dimension style given as a number and
// assigns px unit, if so.

pui.getPosDimString = function(styleName, value) {
  if (styleName == "top" || styleName == "left" || styleName == "height" || styleName == "width") {
    if (pui.isNumericString(value)) {
      return value + "px";
    }
  }

  return value;
};

/**
 * Extract the style number and units from a style string. Return an array with the numeric portion as element 0 and the units as
 * element 1. For non-numerics the unit element is an empty string.   Absolute lengths: cm, mm, in, px, pt, pc.
 * Relative lengths: em, ex, ch, rem, vw, vh, vmin, vmax, %. (vmin, vmax don't work in IE.).
 * Top|Left|Bottom|Right|Width|Height property values: auto (default), length unit (px, cm, ...), initial, inherit.
 * @param {String} styleVal
 * @returns {Array}
 */
pui.getStyleDim = function(styleVal) {
  var unit = ""; var val = "";
  if (typeof styleVal == "string") {
    var re = /^([0-9.,-]+)(cm|mm|in|px|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|%)$/i;
    var matches = re.exec(styleVal);
    if (matches != null) {
      var num = Number(matches[1]);
      if (isNaN(num)) num = 0;
      val = num;
      unit = matches[2];
    }
    else val = styleVal; // The style is non-numeric or the unit is unsupported.
  }
  return [val, unit];
};

pui.getWindowScrollTop = function() { // gets window scroll top position
  var scrOfY = 0;
  if (typeof (window.pageYOffset) == "number") {
    // Netscape compliant
    scrOfY = window.pageYOffset;
  }
  else if (document.body && document.body.scrollTop) {
    // DOM compliant
    scrOfY = document.body.scrollTop;
  }
  else if (document.documentElement && document.documentElement.scrollTop) {
    // IE6 standards compliant mode
    scrOfY = document.documentElement.scrollTop;
  }
  return scrOfY;
};

pui.getNoConnectionMessage = function(req) {
  var msg = pui["getLanguageText"]("runtimeMsg", "no connection message");

  if (pui["no connection status"] == true) {
    msg += "\n" + req.getStatusMessage();
  }

  if (pui["isCloud"]) {
    var details = req.getResponseText();
    if (details) {
      msg += "\n\nError details:\n" + details;
    }
  }

  return msg;
};

pui.getSQLDateFmt = function() {
  var fmt = null;
  var sep = null;

  if (typeof (pui["sql date format"]) == "string") {
    fmt = pui.SQLDateFmts[pui["sql date format"].toUpperCase()];
  }

  if (fmt == null) {
    fmt = pui.SQLDateFmts["*ISO"];
  }

  if (typeof (pui["sql date separator"]) == "string") {
    sep = pui.SQLDateSeps[pui["sql date separator"].toUpperCase()];
  }

  if (sep == null) {
    sep = pui.SQLDateSeps["/"];
  }

  return {

    fmt: fmt,
    sep: sep

  };
};

pui.getSQLTimeFmt = function() {
  var fmt = null;
  var sep = null;

  if (typeof (pui["sql time format"]) == "string") {
    fmt = pui.SQLTimeFmts[pui["sql time format"].toUpperCase()];
  }

  if (fmt == null) {
    fmt = pui.SQLTimeFmts["*ISO"];
  }

  if (typeof (pui["sql time separator"]) == "string") {
    sep = pui.SQLTimeSeps[pui["sql time separator"].toUpperCase()];
  }

  if (sep == null) {
    sep = pui.SQLTimeSeps[":"];
  }

  return {

    fmt: fmt,
    sep: sep

  };
};

pui.getDomain = function() {
  var parts = location.href.split("://");
  var prepend = "";
  var domain = "";
  if (parts.length > 1) {
    prepend = parts[0] + "://";
    parts.splice(0, 1);
    domain = parts.join("://");
  }
  else {
    domain = location.href;
  }
  domain = prepend + domain.split("/")[0];
  return domain;
};

pui.getLink = function(path) {
  var head = document.getElementsByTagName("head")[0];
  if (head == null) return null;
  var domain = pui.getDomain();
  var links = head.getElementsByTagName("link");
  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    if (link.href == path) return link;
    if (link.href == domain + path) return link;
  }
  return null;
};

pui.getScript = function(path) {
  var head = document.getElementsByTagName("head")[0];
  if (head == null) return null;
  var domain = pui.getDomain();
  var scripts = head.getElementsByTagName("script");
  for (var i = 0; i < scripts.length; i++) {
    var script = scripts[i];
    if (script.src == path) return script;
    if (script.src == domain + path) return script;
  }
  return null;
};

// syntax allowed:
//   - string (comma separated): 'A,B,C'
//   - string (json formatted): '["A","B","C"]'
//   - javascript array
pui.parseCommaSeparatedList = function(list) {
  if (typeof list != "string") {
    if (list instanceof Array) return list;
    else return [];
  }
  if (list == "") return [];
  var listArray;
  if (list.substr(0, 1) == "[" && list.substr(list.length - 1, 1) == "]") {
    try {
      definedPhrases = ["Image", "String", "Object", "Array", "Number", "Boolean", "Date", "Function", "RegExp", "Error"];
      phrase = list.substring(1, list.length - 1);
      if (definedPhrases.includes(phrase)) listArray = new Array(list);
      else listArray = eval(list);
    }
    catch (e) {
    }
  }
  if (listArray == null) listArray = list.split(",");
  return listArray;
};

pui.isHTML5InputType = function(type) {
  switch (type) {
    // provided as a choice in the "input type" property
    case "number":
    case "date":
    case "datetime":
    case "time":
    case "email":
    case "url":
    case "month":
    case "tel":
    // not provided as a choice in the "input type" property, but could be valid HTML5 input types
    case "color":
    case "datetime-local":
    // case "range":
    case "search":
    case "week":
      return true;
    default:
      return false;
  }
};

pui.isTextbox = function(obj) {
  if (obj.tagName == "INPUT") {
    if (obj.type == null || obj.type == "" || obj.type == "text" || pui.isHTML5InputType(obj.type) || obj.type == "password") {
      return true;
    }
  }

  return false;
};

pui.isFieldExit = function(e) {
  var key = e.keyCode;
  var fe = pui["field exit key"];
  var fe2 = pui["field exit minus key"];

  if ((key == fe || key == fe2) &&
      (!e.shiftKey || fe == 16) &&
      (!e.ctrlKey || fe == 17)) {
    return true;
  }
  else {
    return false;
  }
};

pui.hasParent = function(node) {
  var prt = node.parentNode;
  return (prt != null && (!pui["is_old_ie"] || prt.nodeName != "#document-fragment"));
};

pui.appendAuth = function(url) {
  // When using PJSCALL to call a PJS module from Genie, we have Genie app job info in pui.appJob
  // and AUTH info in PUISSNP. In that case, we DO want to send AUTH even though pui.nodejs is "true".
  if (!inDesignMode() &&
       (!pui.nodejs || pui.pjs_session_id || (pui["appJob"]["auth"])) &&
       typeof url == "string" && url.search("AUTH=") == -1) {
    if (url.search(/\?/) == -1) url += "?";
    else url += "&";
    var auth = pui.pjs_session_id ? pui.pjs_session_id : pui["appJob"]["auth"];
    url += "AUTH=" + encodeURIComponent(auth);
  }
  return url;
};

pui.validateEmail = function(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

pui.isBound = function(propVal) {
  return (propVal != null && typeof propVal == "object" && typeof propVal["fieldName"] == "string");
};

pui.isTranslated = function(propVal) {
  return (propVal != null && typeof propVal == "object" &&
    typeof propVal["translations"] == "object" &&
    propVal["translations"] != null &&
    typeof propVal["translations"].length == "number");
};

pui.isRoutine = function(propVal) {
  return (propVal != null && typeof propVal == "object" && typeof propVal["routine"] == "string");
};

pui.isJoin = function(propVal) {
  return (propVal != null && typeof propVal == "object" && propVal["join"] == true);
};

pui.taphold = function(target, handler, threshold) {
  // Some notes:
  //   1) We do not check pui["is_touch"] here because some Windows-based
  //      touch devices will return 'false' for that.  Instead, we add the
  //      event listeners for touchstart/end with a try/catch.
  //   2) threshold is set to 475ms because at 500ms some browsers will
  //      bring up their own context menus, we want to take control
  //      before that happens. (If a customer finds 475 to be too short,
  //      we should consider making this a configurable option so that
  //      anyone can tune it to their own liking.) -SK

  if (!target || !target.addEventListener) return;
  if (typeof handler != "function") return;
  if (typeof threshold != "number") threshold = 475;

  var timeoutId;

  function start(e) {
    timeoutId = setTimeout(function() {
      timeoutId = null;
      handler(e);
    }, threshold);
  }

  function stop(e) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  try {
    target.addEventListener("touchstart", start, false);
    target.addEventListener("touchend", stop, false);
  }
  catch (e) {
    /* ignore error */
  }
};

// Used to fix IE8 printing issue, see here:
// http://stackoverflow.com/questions/3591464/print-page-shows-unchanged-checkbox-in-ie-with-doctype
// --DR.
pui.fixCheckPrint = function(el) {
  if (el.checked) {
    el.setAttribute("checked", "checked");
  }
  else {
    el.removeAttribute("checked");
  }
};

/**
 * Encode special characters in a string so the string can be used in an XML document as an EntityValue or AttValue (attribute).
 * https://www.w3.org/TR/xml/#NT-AttValue
 * @param {String} str
 * @returns {String}
 */
pui.xmlEscape = function(str) {
  str = "" + str;
  str = str.replace(/&/g, "&amp;");
  str = str.replace(/</g, "&lt;");
  str = str.replace(/>/g, "&gt;");
  str = str.replace(/"/g, "&quot;"); // " - fake comment to fix syntax highlighting
  str = str.replace(/\u001a/g, "&#x25a1;"); // the "substitute" character breaks XLSX files. replace with unicode square. Issue #6149.
  str = str.replace(/\u000c/g, "&#x25a1;"); // form feed
  return str;
};

// Used to fix Redmine 692 - iFrame close error issue when not in the same domain - Firefox and Chrome
// Function is used in this utils.js, genie.js and render.js

pui.checkForAtrium = function(parentWindow) {
  var hasAtrium = false;

  try {
    hasAtrium = (typeof (parentWindow["Atrium"]) != "undefined" && typeof (parentWindow["Atrium"]["api"]) != "undefined");
  }
  catch (e) {
  }

  return hasAtrium;
};

/**
 * Return true if the parent window can be accessed via script. False indicates cross-origin exception. Fix for issue 5165.
 * @param {Object} parentWindow
 * @returns {Boolean}
 */
pui.windowAccessible = function(parentWindow) {
  var accessible = false;
  try {
    if (parentWindow.location["host"] != null) accessible = true; // Throws exception if parent has different origin.
  }
  catch (exc) {}
  return accessible;
};

pui.isLocalStorage = function() {
  try {
    if (localStorage != null && typeof (window.localStorage) != "undefined") {
      return true;
    }

    else {
      return false;
    }
  }

  catch (e) {
    return false;
  }
};

pui.isSessionStorage = function() {
  try {
    if (sessionStorage != null && typeof (window.sessionStorage) != "undefined") {
      return true;
    }

    else {
      return false;
    }
  }

  catch (e) {
    return false;
  }
};

pui.normalizeColor = function(value) {
  if (value.substr(0, 1) == "#") value = value.toUpperCase();
  if (value.substr(0, 4) == "rgb(" && value.substr(value.length - 1, 1) == ")") {
    value = value.substr(4, value.length - 5);
    value = value.replace(/ /g, "");
    var hexCodes = value.split(",");
    value = "#";
    for (var i = 0; i < hexCodes.length; i++) {
      var hex = Number(hexCodes[i]).toString(16).toUpperCase();
      if (hex.length == 1) hex = "0" + hex;
      value += hex;
    }
  }
  return value;
};

pui.logException = function(e, prefix) {
  var msg;
  if (e.stack) {
    msg = e.toString();
    var parts = e.stack.split("\n");
    if (parts.length >= 1) {
      if (msg.indexOf(trim(parts[0])) != 0 || parts.length < 2) {
        msg += " " + trim(parts[0]);
      }
      else {
        msg += " " + trim(parts[1]);
      }
    }
  }
  else {
    if (typeof prefix == "string") msg = prefix;
    msg += " " + e.toString();
  }

  console.log(msg);
};

// This fixes:
// http://redmine/issues/791

pui.posFix = function(elem) {
  if (pui["is_chrome"] && pui.isTextbox(elem)) {
    // Yes, that's really all there is to it!
    var temp = elem.value;
    elem.value = "";
    elem.value = temp;
  }
};

pui.highlightText = function(node, text) {
  if (node === undefined || !node) return;
  if (node.tagName == "SPAN" && node.className == "pui-highlight") return;

  if (node.hasChildNodes()) {
    for (var i = 0; i < node.childNodes.length; i++) {
      pui.highlightText(node.childNodes[i], text);
    }
  }
  if (node.nodeType == 3) { // NODE_TEXT
    var content = node.nodeValue;
    if (content != null && typeof content == "string") {
      var contentLower = content.toLowerCase();
      while (contentLower.indexOf(String.fromCharCode(160)) != -1) {
        contentLower = contentLower.replace(String.fromCharCode(160), " ");
      }
      var textLower = text.toLowerCase();
      var idx = contentLower.indexOf(textLower);
      if (idx >= 0) {
        var foundText = content.substr(idx, text.length);
        var hiSpan = document.createElement("span");
        hiSpan.appendChild(document.createTextNode(foundText));
        hiSpan.className = "pui-highlight";

        var after = node.splitText(idx);
        after.nodeValue = after.nodeValue.substring(text.length);
        node.parentNode.insertBefore(hiSpan, after);
      }
    }
  }
};

pui.dehighlightText = function(div) {
  var spans = div.getElementsByTagName("span");
  var span;
  while (spans.length && (span = spans[0])) {
    var parent = span.parentNode;
    parent.replaceChild(span.firstChild, span);
    parent.normalize();
  }
};

pui.startMouseCapableMonitoring = function() {
  if (pui["is_mouse_capable"]) {
    return;
  }

  if (pui.isLocalStorage() && localStorage["pui-is-mouse-capable"] == "true") {
    // if iOS or Android dont set the mouse_capable flag #4460
    if (pui["is_android"] || pui["is_ios"]) return;
    pui["is_mouse_capable"] = true;
    return;
  }

  var docElement = document.documentElement;
  if (docElement == null) return;

  // Look for 2 consecutive 'mousemove' events without an intervening
  // 'mousedown'; this excludes touch screen tap events
  var onMouseDown = function() {
    hadMouseOver = false;
  };
  var onMouseMove = function() {
    if (hadMouseOver) {
      // if iOS or Android dont set the mouse_capable flag #4460
      if (pui["is_android"] || pui["is_ios"]) {
        removeEvent(docElement, "mousedown", onMouseDown);
        removeEvent(docElement, "mousemove", onMouseMove);
        return;
      }
      pui["is_mouse_capable"] = true;
      if (pui.isLocalStorage()) {
        localStorage.setItem("pui-is-mouse-capable", "true");
      }
      removeEvent(docElement, "mousedown", onMouseDown);
      removeEvent(docElement, "mousemove", onMouseMove);
    }
    hadMouseOver = true;
  };

  var hadMouseOver = false;
  addEvent(docElement, "mousedown", onMouseDown);
  addEvent(docElement, "mousemove", onMouseMove);
};

pui.killFrames = function() {
  // For Redmine #2287, Chrome doesn't seem to fire the "unload"
  // event for iframes when a Chrome tab is closed.
  if (pui["is_chrome"]) {
    var iframes = document.getElementsByTagName("iframe");
    for (var i = 0; i < iframes.length; i++) {
      var iframe = iframes[i];

      var puiObj = null;
      try {
        puiObj = iframe.contentWindow["pui"];
        iframe.contentWindow["puihalted"] = true;
      }
      catch (e) { /* ignore */ }

      if (puiObj != null && typeof puiObj["unload"] === "function") {
        puiObj["halted"] = true;
        puiObj["unload"]();
      }
      else {
        iframe.src = "";
      }
    }
  }
};

pui["haltFrames"] = function() {
  var iframes = document.getElementsByTagName("iframe");
  for (var i = 0; i < iframes.length; i++) {
    var iframe = iframes[i];
    if (iframe != null) {
      var puiObj = null;
      try {
        puiObj = iframe.contentWindow["pui"];
        iframe.contentWindow["puihalted"] = true;
      }
      catch (e) { /* ignore */ }

      if (puiObj != null && typeof puiObj === "object") {
        puiObj["halted"] = true;
        if (typeof puiObj["haltFrames"] === "function") {
          puiObj["haltFrames"]();
        }
      }

      // Since haltFrames can be called in the middle of a session, avoid breaking the
      // back button behavior by removing the element before clearing "src". Issue 2503.
      if (iframe.parentNode != null) {
        iframe.parentNode.removeChild(iframe);
      }

      // Prevent the browser from trying to continue loading the document.
      iframe.src = "";
    }
  }
};

/**
 * Initialize the break-message settings, storage, and event handlers. Start
 * polling. Called by init() in runtime/5250/init.js or render() in
 * runtime/dspf/render.js.
 *
 * Requires a browser that supports localStorage and JSON.
 *
 * Note: un-obfuscated so that you can stop by setting pui["brkmsg enable"]=false,
 * and resume by calling pui.breakMessagesInit() from the console or
 * user script.
 *
 * @returns {undefined}
 */
pui["breakMessagesInit"] = function() {
  // Do nothing if local storage isn't supported or break-messages not enabled.
  if (inDesignMode() || pui["brkmsg enable"] !== true) return;
  if (!pui.isLocalStorage() || typeof (JSON) !== "object") return;
  // Do nothing if there is no user or user is QTMHHTP1. (user may not be set for PJS session.)
  if (typeof (pui.appJob) !== "object" || pui.appJob["user"] == null || pui.appJob["user"].length <= 0 ||
  pui.appJob["user"] === "QTMHHTP1") return;

  // Ensure that polling interval is valid.
  pui["brkmsg poll interval"] = Number(pui["brkmsg poll interval"]);
  if (isNaN(pui["brkmsg poll interval"])) {
    pui["brkmsg poll interval"] = 30;
  }
  // Fastest interval allowed is 1 second.
  else if (pui["brkmsg poll interval"] < 1) {
    pui["brkmsg poll interval"] = 1;
  }

  // Ensure that max-error-count exists.
  pui["brkmsg max errors"] = Number(pui["brkmsg max errors"]);
  if (isNaN(pui["brkmsg max errors"])) {
    pui["brkmsg max errors"] = 3;
  }

  // Maximum messages to show at once.
  pui["brkmsg max messages"] = Number(pui["brkmsg max messages"]);
  if (isNaN(pui["brkmsg max messages"])) {
    pui["brkmsg max messages"] = 10;
  }

  // User polling timeout in seconds. UserId will be cleared from localStorage
  // if no polling happened for that user recently.
  pui["brkmsg user timeout"] = Number(pui["brkmsg user timeout"]);
  if (isNaN(pui["brkmsg user timeout"])) {
    pui["brkmsg user timeout"] = 300;
  }
  // Prevent unpredictable behavior when timeout happens too quickly.
  else if (pui["brkmsg user timeout"] <= pui["brkmsg poll interval"]) {
    pui["brkmsg user timeout"] = pui["brkmsg poll interval"] + 10;
  }

  // Current error count.
  pui.breakMessageErrors = 0;

  // Become the active poller if necessary.
  pui.breakMessagesPollCheck();

  // If we are a new session and old messages exist, then get ready to show them.
  var msgs;
  try {
    msgs = JSON.parse(localStorage.getItem("brkmsgMessages_" + pui.appJob["user"]));
  }
  // If the messages couldn't parse, just clear them.
  catch (exc) {
    localStorage.setItem("brkmsgMessages_" + pui.appJob["user"], "[]");
  }

  // Setup the non-Atrium container and event listener.
  if (window.parent == window || !pui.checkForAtrium(window.parent)) {
    // Create a UI container.
    var container = document.createElement("div");
    container.id = "pui-break-messages";
    container.style.zIndex = pui.windowZIndex++;
    pui.runtimeContainer.appendChild(container);

    if (pui.isLocalStorage()) {
      // Avoid duplicate event handlers by removing before adding.
      removeEvent(window, "storage", pui.breakMessagesOnStorage);
      // Listen on our window for messages from storage.
      addEvent(window, "storage", pui.breakMessagesOnStorage);
      // Show pending messages.
      if (msgs) pui.breakMessagesShow(msgs);
    }
  }
  // Setup the Atrium event handler.
  else {
    // Attach a single handler to the Atrium window for all child windows.
    removeEvent(window.parent, "storage", window.parent["Atrium"]["api"]["breakMessagesOnStorage"]);
    addEvent(window.parent, "storage", window.parent["Atrium"]["api"]["breakMessagesOnStorage"]);
    // Show pending messages.
    if (msgs) window.parent["Atrium"]["api"]["breakMessagesShow"](msgs, pui.appJob["user"]);
  }

  pui.breakMessagesStartPoll();
};// end breakMessagesInit.

/**
 * Check if this session's job should assume the active polling role. If too
 * much time has passed since the last poll, take over as active poller and
 * return true. Otherwise, don't take over and return false.
 * Returns false if the session isn't active.
 *
 * @returns {Boolean}
 */
pui.breakMessagesPollCheck = function() {
  if (!pui || !pui.appJob || pui.appJob["auth"].length <= 0 ||
  pui.appJob["user"].length <= 0) return false;

  //
  // See if we should take over as active poller.
  //
  var activePoller = localStorage.getItem("brkmsgActivePoller_" + pui.appJob["user"]);
  var lastPoll = Number(localStorage.getItem("brkmsgLastPoll_" + pui.appJob["user"]));
  if (isNaN(lastPoll)) lastPoll = 0;

  // Calculate how many milliseconds since the last poll; calculate how many
  // seconds is too many: the polling interval + 10 seconds.
  // Assume the other process is gone after that long.
  var now = Date.now();
  var difference_ms = now - lastPoll;
  var compareto_ms = pui["brkmsg poll interval"] * 1000 + 10000;

  // If there was no activePoller or the last recorded one was too long ago,
  // then take over as active poller.
  if (activePoller === null ||
  (difference_ms >= compareto_ms && activePoller !== pui.appJob["auth"])) {
    activePoller = pui.appJob["auth"];
    localStorage.setItem("brkmsgActivePoller_" + pui.appJob["user"], activePoller);
    localStorage.setItem("brkmsgLastPoll_" + pui.appJob["user"], now);
  }

  //
  // Get the list of all userIds in local storage. See if we should remove any.
  //
  var userIds;
  var listChanged = false;
  try {
    userIds = JSON.parse(localStorage.getItem("brkmsgUserIds"));
  }
  catch (exc) {
    listChanged = true;
  }
  if (userIds == null || typeof (userIds.pop) !== "function") {
    userIds = [];
    listChanged = true;
  }

  // Make sure current user is in array.
  var activeList = [];
  if (pui.arrayIndexOf(userIds, pui.appJob["user"]) < 0) {
    activeList.push(pui.appJob["user"]);
    listChanged = true;
  }

  // Look at all users from storage and see if they have been inactive too long.
  for (var i = 0; i < userIds.length; i++) {
    if (userIds[i] !== pui.appJob["user"]) {
      lastPoll = Number(localStorage.getItem("brkmsgLastPoll_" + userIds[i]));
      if (isNaN(lastPoll)) lastPoll = 0;

      // Users keys should be cleared.
      if (Date.now() - lastPoll >= pui["brkmsg user timeout"] * 1000) {
        localStorage.removeItem("brkmsgLastPoll_" + userIds[i]);
        localStorage.removeItem("brkmsgActivePoller_" + userIds[i]);
        localStorage.removeItem("brkmsgMessages_" + userIds[i]);
        listChanged = true;
      }
      // User is still active, keep them.
      else activeList.push(userIds[i]);
    }
  }
  if (listChanged) localStorage.setItem("brkmsgUserIds", JSON.stringify(activeList));

  activeList = null;
  userIds = null;

  return activePoller === pui.appJob["auth"];
};

/**
 * Start a new Interval function to poll for break messages.
 *
 * @returns {undefined}
 */
pui.breakMessagesStartPoll = function() {
  if (inDesignMode() || pui["brkmsg enable"] !== true) return;

  // Stop a previous Interval if it existed.
  if (typeof (pui.breakMessagePoller) === "number") {
    clearInterval(pui.breakMessagePoller);
  }

  // Start a new poller.
  pui.breakMessagePoller = setInterval(function() {
    // If the user logged off or brkmsg became disabled, then stop the poller.
    if (typeof (pui.appJob) !== "object" || pui.appJob["user"].length <= 0 ||
    pui.appJob["user"] === "QTMHHTP1" || pui["brkmsg enable"] !== true) {
      pui.breakMessagesStopPoll();
      return;
    }

    // See if we should assume the role as active poller or we are active poller.
    if (pui.breakMessagesPollCheck()) {
      // We are the poller, so poll the server. Otherwise, do nothing.
      ajaxJSON({
        "url": getProgramURL("PUI0009116.PGM"),
        "method": "post",
        "async": true,
        "suppressAlert": true, /* Popup alerts every interval would be very annoying. */
        "params": { "AUTH": pui.appJob["auth"] },
        /* Handler for errors, such as 404. */
        "onfail": function() {
          pui.breakMessageErrors++;
          // If too many errors were encountered polling, then stop polling.
          if (pui.breakMessageErrors >= pui["brkmsg max errors"]) {
            pui.breakMessagesStopPoll();
            console.log("Stopped break-message polling; too many errors.");
          }
        },
        /* Handler for successful response. parms is a JSON object. */
        "handler": function(parms) {
          // There was an error.
          if (parms == null || typeof (parms) !== "object" || parms["error"]) {
            pui.breakMessageErrors++;
            // If too many errors were encountered polling, then stop polling.
            // Errors here are usually from session time out.
            if (pui.breakMessageErrors >= pui["brkmsg max errors"]) {
              pui.breakMessagesStopPoll();
            }
          }
          // There was at least one new message.
          else if (parms["success"] && parms["messages"] != null &&
          typeof (parms["messages"].pop) === "function" &&
          parms["messages"].length > 0) {
            var brkMessages;
            // Try adding the new messages to any stored ones.
            try {
              // Get existing messages.
              brkMessages = JSON.parse(localStorage.getItem("brkmsgMessages_" + pui.appJob["user"]));
            }
            // Existing messages failed to parse. Ignore.
            catch (exc) {
              console.log(exc);
            }

            // If the existing messages aren't an array, discard them.
            if (brkMessages == null || typeof (brkMessages.pop) !== "function") {
              brkMessages = [];
            }
            // Add new messages to end of array, and store the modified array.
            brkMessages = brkMessages.concat(parms["messages"]);

            // Make sure the new array isn't too large.
            if (pui["brkmsg max messages"] > 0 && brkMessages.length > pui["brkmsg max messages"]) {
              // Get the last elements from the array.
              brkMessages = brkMessages.slice(brkMessages.length - pui["brkmsg max messages"], brkMessages.length);
            }

            // Send the message to Atrium.
            if (window != window.parent && pui.checkForAtrium(window.parent)) {
              // Send to Atrium if Ext.msgbox is being shown. Avoid triggering a custom function twice; a storage event will trigger breakMessagesShow.
              if (typeof window.parent["Atrium"]["brkmsg handler"] !== "function") {
                window.parent["Atrium"]["api"]["breakMessagesShow"](brkMessages, pui.appJob["user"]);
              }
            }
            else {
              // Non-Atrium: show the message
              pui.breakMessagesShow(brkMessages);
            }
            // Store the message, sending it to any other tabs.
            localStorage.setItem("brkmsgMessages_" + pui.appJob["user"], JSON.stringify(brkMessages));
          }
          // Else no error and success==false: there were no messages.
        }
      });

      localStorage.setItem("brkmsgLastPoll_" + pui.appJob["user"], Date.now());
    }// done with active poll.

    // Fallback for IE8, which supports storage but not storage events:
    // redraw the messages from local storage in case another tab cleared or
    // caught any.
    if (pui.isLocalStorage() && typeof (window.addEventListener) === "undefined" &&
    typeof (JSON) === "object") {
      try {
        var brkMessages = JSON.parse(localStorage.getItem("brkmsgMessages_" + pui.appJob["user"]));
        if (window != window.parent && pui.checkForAtrium(window.parent)) {
          window.parent["Atrium"]["api"]["breakMessagesShow"](brkMessages, pui.appJob["user"]);
        }
        else {
          // Non-Atrium: show the message
          pui.breakMessagesShow(brkMessages);
        }
      }
      catch (exc) {
        console.log(exc);
      }
    }
  }, pui["brkmsg poll interval"] * 1000);
};

/**
 * Stop the polling interval and detach break-message storage event listeners.
 *
 * @returns {undefined}
 */
pui.breakMessagesStopPoll = function() {
  clearInterval(pui.breakMessagePoller);
  removeEvent(window, "storage", pui.breakMessagesOnStorage);
};

/**
 * Dismiss a break message and remove it from local storage. The message will
 * also disappear from other tabs.
 * This function is the onclick handler for the message Close icon.
 *
 * @param {Event|Object} event
 * @returns {undefined}
 */
pui.breakMessageDismiss = function(event) {
  if (typeof (pui.appJob) !== "object" || pui.appJob["user"].length <= 0 ||
  pui.appJob["user"] === "QTMHHTP1") {
    return;
  }
  // So that when the close button is highlighted
  // it will only dismiss if the user presses the enter key
  preventEvent(event);
  if (event.keyCode && event.keyCode != 13) return;

  var target = getTarget(event);
  var msgIdx = target["msgIdx"];

  var brkMessages;
  // Try removing just the clicked element from the messages.
  try {
    brkMessages = JSON.parse(localStorage.getItem("brkmsgMessages_" + pui.appJob["user"]));
    if (brkMessages !== null && typeof (brkMessages.splice) === "function") {
      // Remove the clicked message from the array.
      if (!msgIdx && msgIdx != 0) msgIdx = brkMessages.length - 1;
      brkMessages.splice(msgIdx, 1);
    }
    else {
      brkMessages = [];
    }
  }
  catch (exc) {
    console.log(exc);
    brkMessages = [];
  }
  // Update the store, and signal any other tabs to redraw
  localStorage.setItem("brkmsgMessages_" + pui.appJob["user"], JSON.stringify(brkMessages));
  // Redraw the messages with new indices.
  pui.breakMessagesShow(brkMessages);
  brkMessages = null;
};

/**
 * Put a div on the screen for each specified message. This can be called
 * by the AJAX handler or the onStorage handler when new messages arrive.
 *
 * @param {Array|Object} messages   An array of objects that must have these
 *   members: date, time, msg, jobName, jobUserName, jobNum, jobCurProfName.
 *
 * @returns {undefined}
 */
pui.breakMessagesShow = function(messages) {
  if (typeof pui["brkmsg handler"] == "function") return pui["brkmsg handler"](messages); // Let the end-pgmr-defined function handle the messages.
  pui.breakMessageShowing = false;
  if (messages == null || typeof (messages.pop) !== "function") return;

  var bkmsgcont = document.getElementById("pui-break-messages");
  if (!bkmsgcont) return;

  // Clear existing messages from the page. The messages argument contains the
  // same messages as the store, so make sure what is visible agrees with
  // what other tabs show.
  bkmsgcont.innerHTML = "";

  if (messages.length == 0) {
    pui["unmaskScreen"]();
    return;
  }

  pui["maskScreen"]();
  pui.breakMessageShowing = true;
  // Keep pushing the container to the top.
  pui.windowZIndex += 2;
  bkmsgcont.style.zIndex = pui.windowZIndex;

  var top = 10;
  var left = 10;

  // Show each message in a set of DIVs.
  for (var i = 0; i < messages.length; i++) {
    var curmsg = messages[i];
    curmsg["to"] = pui.appJob["user"];

    var msgwrap = document.createElement("div");
    msgwrap.style.top = top + "px";
    msgwrap.style.left = left + "px";
    msgwrap.className = "msg-wrap";

    var msgtitlewrap = document.createElement("div");
    msgtitlewrap.className = "msg-titlewrap";
    msgwrap.appendChild(msgtitlewrap);

    var msgtitle = document.createElement("div");
    msgtitle.className = "title";
    msgtitlewrap.appendChild(msgtitle);

    var closeImg = document.createElement("button");
    closeImg.className = "closeImg";
    closeImg["msgIdx"] = i; // Needed for array splice upon click.
    msgtitlewrap.appendChild(closeImg);

    addEvent(closeImg, "click", pui.breakMessageDismiss);
    addEvent(closeImg, "keydown", pui.breakMessageDismiss);

    var msgbody = document.createElement("div");
    msgbody.className = "msg-body";

    // Use the user-defined formatter if it exists.
    if (typeof (pui["breakMessageFormat"]) === "function") {
      var stringwrap = { "title": "", "body": "" };
      pui["breakMessageFormat"](curmsg, stringwrap);
      msgtitle.innerHTML = stringwrap.title;
      msgbody.innerHTML = stringwrap.body;
    }
    else {
      try {
        msgtitle.innerHTML = curmsg["date"] + " " + curmsg["time"] + "<br>" +
          curmsg["jobNum"] + "/" + curmsg["jobUserName"] + "/" + curmsg["jobName"];
        msgbody.innerHTML = curmsg["to"] + ":<br>" + curmsg["msg"];
      }
      catch (exc) {
        console.log(exc);
      }
    }

    msgwrap.appendChild(msgbody);
    bkmsgcont.appendChild(msgwrap);
    msgbody = null;
    msgwrap = null;
    msgtitle = null;
    curmsg = null;

    top += 1;
    left += 10;
  }
  // done showing each message.
  closeImg.focus();
  bkmsgcont = null;
};

/**
 * Handle page onstorage events: clear any existing messages, and re-draw any
 * that still exist in the local storage object. The event may fire when
 * the active poller stored a new message or when the user dismissed a visible
 * message.
 *
 * @param {type} e
 * @returns {Boolean}
 */
pui.breakMessagesOnStorage = function(e) {
  if (typeof (pui.appJob) !== "object" || pui.appJob["user"].length <= 0 ||
  pui.appJob["user"] === "QTMHHTP1") {
    return false;
  }

  // Only handle changes to break messages for current user.
  if (e.key !== "brkmsgMessages_" + pui.appJob["user"]) return false;
  try {
    var messages = JSON.parse(e.newValue);
    pui.breakMessagesShow(messages);
  }
  catch (exc) {
    console.log(exc);
  }
  return false;
};

pui.submitLog = function(submittingFlag) {
  if (!pui["submit log"]) {
    return;
  }

  console.log("=".repeat(80));
  console.log(new Date().toString() + ": submit flag = " + submittingFlag);
  console.log("-".repeat(80));
  try {
    throw new Error();
  }
  catch (e) {
    var lines = e.stack.split("\n");
    if (lines[0].indexOf("Error") == 0) {
      lines.shift();
    }
    lines.shift();
    for (var i = 0; i < lines.length; i++) {
      if (lines[i] != "") {
        console.log(lines[i].replace(/^\s*at\s/, ""));
      }
    }
  }
};

if (typeof String.prototype.repeat != "function") {
  String.prototype.repeat = function(n) {
    var val = "";
    for (var i = 0; i < n; i++) {
      val += this;
    }
    return val;
  };
}

/**
 * Do a polling wait for some condition to happen. Execute a callback when finished.
 * @param {Number} interval   Time in milliseconds to poll, using setInterval.
 * @param {Number} max        Maximum time to wait in milliseconds.
 * @param {Function} check    Callback to return true when condition is met, false when not.
 * @param {Function} proceed  Callback to execute when condition is met or max time has passed.
 *                            Accepts one parameter: true when condition is met, false when max time expired.
 * @returns {undefined}
 */
pui.wait = function(interval, max, check, proceed) {
  var elapsed = 0;
  var handle = setInterval(
    function() {
      elapsed += interval;
      if (check() === true) {
        clearInterval(handle);
        proceed(true);
      }
      else if (elapsed >= max) {
        clearInterval(handle);
        proceed(false);
      }
    },
    interval
  );
};

/**
 * If the specified item has a file dependency, then add the file's URL string to a list.
 * @param {Object} item                 Input. Item/widget properties.
 * @param {Object|Array} dependencies   Output. List of URL strings
 * @param {Object|Null} formatData      Input. The "data" property of the current RDF format. This is needed
 *                                      if a conditional dependency needs to test a bound field's value.
 *                                      This is null for Genie and Designer.
 * @param {Boolean} designer            True if page is Designer. False for Genie, RDF. Needed for some
 *                                      conditional dependencies.
 * @returns {undefined}
 */
pui.addItemDependenciesTo = function(item, dependencies, formatData, designer) {
  if (item != null) {
    var fieldtype = item["field type"] || item["field_type"]; // Genie uses "field_type"; RDF uses "field type".
    if (fieldtype != null) {
      // In pre-render time, parms items don't have widget names, which
      // is the key under which pui.widgets stores dependencies.
      // So try to resolve the widget name from "field type" and template if necessary.
      if (fieldtype == "layout" && item["template"] == "css panel") fieldtype = "css panel"; // special case.

      if (pui.widgets[fieldtype] != null && pui.widgets[fieldtype]["dependencies"] != null &&
      pui.widgets[fieldtype]["dependencies"].length > 0) {
        // List of dependencies that the Visual Designer will ignore and not fetch.
        var designerIgnoredDependencies = ["/fusionchartsxt/js/pui-fusioncharts.js"];
        // Used to avoid loading redundant dependencies.
        var scripts = document.getElementsByTagName("script");
        var links = document.getElementsByTagName("link");

        var widdep = pui.widgets[fieldtype]["dependencies"];
        if (inDesignMode() && widdep.length > 0) {
          widdep = widdep.filter(function(file) {
            if (designerIgnoredDependencies.indexOf(file) !== -1) {
              return false;
            }
            return true;
          });
        }
        // Get the protocol, domain, and port for comparison because some script.src include those.
        var origin = "";
        var re = /^(https?:\/\/[^/]+)\//i;
        var matches = document.URL.match(re);
        if (matches != null && matches.length == 2) origin = matches[1];

        // Add each dependency to a list.
        for (var dp = 0; dp < widdep.length; dp++) {
          var dependUri = widdep[dp];
          var useDependency = false;
          if (typeof widdep[dp] == "object" && widdep[dp] != null && typeof widdep[dp]["condition"] == "function") {
            // The dependency is conditional, so load only when it passes a test.
            if (widdep[dp]["condition"](item, formatData, designer)) {
              dependUri = widdep[dp]["script"];
              useDependency = true;
            }
          }
          else if (typeof widdep[dp] == "string") {
            useDependency = true; // Always use dependency when it is a string.
          }
          if (useDependency) {
            // Make both the relative URI and the full URL for comparison.
            var uri = pui.normalizeURL(dependUri);
            var url = pui.normalizeURL(origin + uri);

            // Avoid adding the same script multiple times by checking if it already exists.
            var scriptExists = false;
            for (var sc = 0; sc < scripts.length; sc++) {
              if (scripts[sc].type.toLowerCase() == "text/javascript" && (scripts[sc].src == url || scripts[sc].src == uri)) {
                scriptExists = true;
                break;
              }
            }

            // Avoiding adding the same stylesheet multiple times by checking if it already exists
            if (links && !scriptExists) {
              for (var l = 0; l < links.length; l++) {
                if (links[l].type.toLowerCase() == "text/css" && (links[l].href == url || links[l].href == uri)) {
                  scriptExists = true;
                  break;
                }
              }
            }

            // If the file wasn't already loaded in <head>, and if the
            // dependency wasn't already added to the list, add it to the list.
            if (!scriptExists && pui.arrayIndexOf(dependencies, uri) < 0) {
              dependencies.push(uri);
            }
          } // done if useDep.
        }// done linking each dependency.
      }
    }
  }
};

/**
 * Look for any widgets that have dependencies; look for enqueued custom layout templates to fetch. Then execute the callback.
 *
 * When dependencies exist, add script/link tags to the document.head for each dependency. Execute
 * the callback after finished loading all. This should be called once before DSPF render-time,
 * or once before loading Genie items during rendering.
 *
 * @param {Object} parm        Contains list of items or rendering parameters with items buried inside. For
 *    Genie/RDF, this would be the JSON response from the CGI program. With Designer, it has a list of widgets.
 * @param {Function} callback  Function to execute on success or failure to load files.
 */
pui.loadDependencyFiles = function(parm, callback) {
  var itm;
  // List to be populated with unique URI strings.
  var dependencies = [];

  if (parm != null) {
    // When called by genie() in 5250/genie.js, parm should be an entry from the global screenPropertiesObj.
    // When called by designer, parm is just an object with an "items" array and "designMode":true.
    if (parm["items"] != null && parm["items"].length > 0) {
      for (itm = 0; itm < parm["items"].length; itm++) {
        // If the "dependencies" property exists, add to a list.
        pui.addItemDependenciesTo(parm["items"][itm], dependencies, null, parm["designer"]);
      }
    }
    // When called for pui.render, parm should contain layers and formats for the RDF/genie screen.
    else if (parm["layers"] != null && parm["layers"].length > 0) {
      // Look in each layer.
      for (var lay = 0; lay < parm["layers"].length; lay++) {
        var layer = parm["layers"][lay];
        if (layer != null && layer["formats"] != null && layer["formats"].length > 0) {
          // Look in each format
          for (var fmt = 0; fmt < layer["formats"].length; fmt++) {
            var format = layer["formats"][fmt];
            if (format != null && format["metaData"] != null && format["metaData"]["items"] != null && format["metaData"]["items"].length > 0) {
              // Look at each item.
              for (itm = 0; itm < format["metaData"]["items"].length; itm++) {
                // If the "dependencies" property exists, add to a list.
                pui.addItemDependenciesTo(format["metaData"]["items"][itm], dependencies, format["data"], false);
              }// end look at each item.
            }
          }// end look in each format.
        }
      }// end look in each layer.
    }
  }

  pui.dependencies = dependencies; // Store the URLs globally to be accessed by callbacks.

  myonload();

  // Recursive method to load a css/js file and callback itself onsuccess or onerror. Overall, files
  // are loaded synchronously, one at a time, in FIFO order set in the "dependencies" property.
  function myonload() {
    if (pui.dependencies.length <= 0) {
      // Stop recursion. All dependencies are loaded or timed out (or there were none).
      pui.dependencies = null;
      checkTemplates();
      return;
    }

    var url = pui.dependencies.shift(); // Remove first from queue.

    if (url != null && url.length > 0) {
      var head = document.getElementsByTagName("head")[0];

      var fileref;
      var extn = url.substr(-4, 4).toLowerCase();
      if (extn === ".css") {
        fileref = document.createElement("link");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("rel", "stylesheet");
      }
      else {
        fileref = document.createElement("script");
        fileref.setAttribute("type", "text/javascript");
      }

      fileref.onload = myonload;
      fileref.onerror = filerefOnError;

      // It's go time! (Assume the url is already normalized...)
      if (extn === ".css") {
        fileref.setAttribute("href", url);
      }
      else {
        fileref.setAttribute("src", url);
      }
      head.appendChild(fileref);
    }
    else {
      myonload(); // If the string was empty, then look for the next dependency.
    }
  } // end myonload() recursive function.

  function filerefOnError(evt) {
    if (evt != null && evt.target != null) console.log("Failed to load widget dependency file ", evt.target.src || evt.target.href);
    myonload();
  }

  // See if any custom layout templates need to load. They must be ready before pui.render or before Designer loads. Issues 3548, 5999.
  function checkTemplates() {
    if (pui.customLayoutTemplateQueue instanceof Array && pui.customLayoutTemplateQueue.length > 0) {
      var tplt = pui.customLayoutTemplateQueue.shift();
      var req = new pui.Ajax({
        "url": tplt.url,
        "method": "get",
        "suppressAlert": true,
        "async": true,
        "onsuccess": templateSuccess,
        "onfail": templateFail
      });
      req.templateName = tplt.templateName;
      req.send();
    }
    else {
      if (pui.customLayoutTemplateQueue !== undefined) delete pui.customLayoutTemplateQueue;
      callback(); // Execute and finish. (The callback is either pui.render or genie()/success() in 5250/genie.js.)
    }
  }

  function templateFail(req) {
    // Note: processHTML will fall back to "simple container", because this template didn't exist.
    console.log("Failed to load custom layout template:", req.templateName);
    checkTemplates();
  }

  function templateSuccess(req) {
    pui.layout["templates"][req.templateName] = req.getResponseText();
    checkTemplates();
  }
};

/**
 * For mobile apps, load any JS and CSS files in userdata/extension/mobile.
 * When loading is complete, the callback function is called.
 * @param {Boolean} isMobile
 * @param {Function} callback
 */
pui.loadMobileExtensionFiles = function(isMobile, callback) {
  if (isMobile) {
    // Get list of files to load
    ajaxJSON({
      "url": getProgramURL("PUI0009120.pgm?r=" + Date.now()),
      "method": "GET",
      "suppressAlert": true,
      "sendAsBinary": false,
      "handler": function(response) {
        if (response && response["status"] === "success") {
          loadFiles(response["data"]["files"]);
        }
        else {
          callback();
        }
      },
      "onfail": function() {
        callback();
      }
    });
  }
  else {
    callback();
  }

  // Load JS and CSS files. The last completion handler to get called will call the callback.
  function loadFiles(files) {
    if (files.length === 0) {
      callback();
    }

    files.forEach(function(file) {
      var loaded = false;
      var basename = file.split("?")[0];

      if (basename.substr(-3).toLowerCase() == ".js") {
        loaded = pui["loadJS"]({
          "path": file,
          "callback": loadFilesCompletion,
          "onerror": function() {
            console.log("Failed to load " + file);
            loadFilesCompletion();
          }
        });
      }
      else if (basename.substr(-4).toLowerCase() == ".css") {
        pui["loadCSS"](file);
      }

      if (!loaded || loaded == false) {
        setTimeout(loadFilesCompletion, 0);
      }

      // Call callback when last file has been loaded
      function loadFilesCompletion() {
        var i = files.indexOf(file);

        if (i >= 0) {
          files.splice(i, 1);
        }
        if (files.length == 0) {
          callback();
        }
      }
    });
  }
};

/**
 * Round to a specified number of decimals.
 * Source:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
 *
 * @param {Number} number
 * @param {Number} precision
 * @returns {Number}
 */
pui.round = function(number, precision) {
  var factor = Math.pow(10, precision);
  var tempNumber = number * factor;
  var roundedTempNumber = Math.round(tempNumber);
  return roundedTempNumber / factor;
};

/**
 * Look for EJS tags in a string of HTML. If EJS is present, then supply data from
 * the record format or screen and use the EJS renderer to process the HTML.
 * @param {String} html
 * @returns {String}
 */
pui.ejs = function(html) {
  var ind;
  if (html.indexOf("<%") < 0) return html; // no ejs to process

  if (typeof window["ejs"] !== "object" || typeof window["ejs"]["render"] !== "function") {
    console.error("EJS templating library not loaded.");
    return html;
  }

  // First, format the data properly for ejs
  if (pui.ejsData == null) {
    var data = {};
    var flags = {};
    var useflags = false;
    var layers = pui["layers"];
    if (layers == null) layers = [];
    var lastLayer = layers[layers.length - 1];
    if (lastLayer == null) lastLayer = { formats: [] };
    var formats = lastLayer.formats;
    for (var i = 0; i < formats.length; i++) {
      var format = formats[i];
      for (var name in format.data) {
        var value = format.data[name];
        if (name.substring(0, 3).toUpperCase() === "*IN") {
          ind = name.substr(3);
          if (!isNaN(Number(ind))) ind = Number(ind);
          flags[ind] = value;
          useflags = true;
        }
        else {
          // make availalbe in lower, upper case, and original case
          data[name.toLowerCase()] = value;
          data[name.toUpperCase()] = value;
          data[name] = value;
        }
      }
      if (format.subfiles) {
        for (var subfile in format.subfiles) {
          var subfileData = format.subfiles[subfile].data;
          var fields = format.subfiles[subfile]["field names"];
          var list = [];
          for (var j = 0; j < subfileData.length; j++) {
            var recordArray = subfileData[j];
            var record = {};
            for (var k = 0; k < fields.length; k++) {
              var fieldName = fields[k];
              if (fieldName.substring(0, 3).toUpperCase() === "*IN") {
                ind = fieldName.substr(3);
                if (!isNaN(Number(ind))) ind = Number(ind);
                flags[ind] = recordArray[k];
                useflags = true;
              }
              else {
                // make availalbe lower, upper, and original case
                record[fieldName.toLowerCase()] = recordArray[k];
                record[fieldName.toUpperCase()] = recordArray[k];
                record[fieldName] = recordArray[k];
              }
            }
            list.push(record);
          }
          // make availalbe lower, upper, and original case
          data[subfile.toLowerCase()] = list;
          data[subfile.toUpperCase()] = list;
          data[subfile] = list;
        }
      }
    }

    if (useflags) data.flags = flags;
    pui.ejsData = data;
  }

  try {
    html = window["ejs"]["render"](html, pui.ejsData);
  }
  catch (err) {
    console.error(err);
  }

  return html;
};

/**
 * Start loading the EJS library then check for EJS content. If the library is loaded,
 * then check for EJS content. This is used by the ajax_container.
 *
 * @param {Object} dom
 * @param {String} html
 * @returns {undefined}
 */
pui.setHtmlWithEjs = function(dom, html) {
  if (pui.ejsLoading) {
    setTimeout(function() {
      pui.setHtmlWithEjs(dom, html);
    }, 100);
    return;
  }
  if (!pui.ejsLoaded) {
    pui.ejsLoading = true;
    pui.clearChildNodes(dom);
    pui["loadJS"]({
      "path": pui.normalizeURL("/ejs/ejs.min.js"),
      "callback": function() {
        pui.clearChildNodes(dom);
        dom.innerHTML = pui.ejs(html);
        pui.ejsLoaded = true;
        pui.ejsLoading = false;
      },
      "onerror": function() {
        pui.ejsLoading = false;
      }
    });
  }
  else {
    pui.clearChildNodes(dom);
    dom.innerHTML = pui.ejs(html);
  }
};

//
// Classes for exporting XLSX documents.
//

/**
 * Parent class for XLSX exporting classes, containing read-only properties the child classes inherit.
 * Child classes can call deleteOwnProperties because of pui.BaseClass.
 * @type Object
 */
pui.xlsx = Object.create(pui.BaseClass.prototype, {
  XMLSTART: { value: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' },
  XMLNS_BASE: { value: "http://schemas.openxmlformats.org" },
  MIME_OPENXML: { value: "application/vnd.openxmlformats" } // MIME or Content-Types used to create Excel 2007+ spreadsheets and for the download XHR.
});
// These read-only properties depend on the initially defined ones.
Object.defineProperties(pui.xlsx, {
  MIME_XLSX_BASE: { value: pui.xlsx.MIME_OPENXML + "-officedocument.spreadsheetml" },
  XMLNS_SPREADSHEET: { value: pui.xlsx.XMLNS_BASE + "/spreadsheetml/2006/main" },
  XMLNS_PACKAGE_RELS: { value: pui.xlsx.XMLNS_BASE + "/package/2006/relationships" },
  XMLNS_OFFICEDOC_RELS: { value: pui.xlsx.XMLNS_BASE + "/officeDocument/2006/relationships" }
});

/**
 * A class that creates an XLSX workbook, which must contain a worksheet and can contain images and hyperlinks.
 * @constructor
 * @param {pui.xlsx_worksheet} worksheet
 */
pui.xlsx_workbook = function(worksheet) {
  /**
   * For now the workbook supports a single worksheet.
   * @type pui.xlsx_worksheet
   */
  this.worksheet = worksheet;
  this.worksheet.workbook = this; // Worksheets need access to some workbook methods.

  /**
   * @type pui.xlsx_drawing
   */
  this.drawing = null; // xlsx_drawing or undefined

  // An object that implements setDownloadStatus and fireDownloadCleanup; e.g. the grid's paging bar.
  this.feedbackObj = null;

  this.sst = {}; // Shared strings table. mapping of strings to values used in dataset.
  this.sst_count = 0;

  /**
   * Cell Formats - formatting applied to cells. 0-based index. Cells (<c>) refer to these in their "s" attribute.
   * The two formats here are used for all of our exported XLSX workbooks. "numFmtId" points to this.NUM_FMTS.
   * @type Array.<String>  "<cellXfs>".
   */
  this.cellFormats = [
    // s=0: general, no formatting.
    { numfmtid: 0, fontid: 0, fillid: 0, borderid: 0, xfid: 0 },
    // s=1: number with 2 decimal places. numFmtId 2 is defined implicitly.
    { numfmtid: 2, fontid: 0, fillid: 0, borderid: 0, xfid: 0, applynumberformat: 1 }
  ];
  this.cellFormat2DecPos = 1; // Format for s="1", numFmtId="2", defined above.

  // Blue colored font--needed when hyperlinks are used in a worksheet.
  this.cellFormatHyperlink = { numfmtid: 0, fontid: 1, fillid: 0, borderid: 0, xfid: 1 };
  this.cellFormatHyperlinkId = -1;

  // General, no formatting, align wrap--needed for cells that have newlines.
  this.cellFormatWrap = { numfmtid: 0, fontid: 0, fillid: 0, borderid: 0, xfid: 0, applyalignment: 1, alignment: { wraptext: 1 } };
  this.cellFormatWrapId = -1;

  /**
   * Number formats - may be used in cell formats. "<numFmts>". numFmtIds 0-49 are defined implicitly:
   * https://msdn.microsoft.com/en-us/library/office/documentformat.openxml.spreadsheet.numberingformat.aspx
   * Other formats must be defined explicitly in the XML. A cell format must also be defined for each numFmt.
   * @type Object    The key is the Profound UI string; the value is an object with properties: id, cellFormatId, format.
   */
  this.numFmts = {};
  this.numFmtsCount = 0;
};
pui.xlsx_workbook.prototype = Object.create(pui.xlsx);

/**
 * Add a string to the workbook's shared strings table and return the object, or just return the already defined object.
 * @param {String} value          Assume value is a non-empty string.
 * @param {Boolean} useHyperlink
 * @returns {Object}
 */
pui.xlsx_workbook.prototype.useSharedString = function(value, useHyperlink) {
  var storedVal = this.sst[value]; // Reference the object from the shared strings table.
  if (storedVal == null) {
    storedVal = this.sst[value] = {
      value: this.sst_count++, // store the unique shared string and its ID, then increment the ID.
      isString: true
    };

    if (useHyperlink) {
      // The cell has a hyperlink, so use that style.
      storedVal.cellFormatId = this.useFormatHyperlink();
    }
    else if (/[\n\r]/.test(value)) {
      // The cell has wrapping characters, so add a style for that.
      storedVal.cellFormatId = this.useFormatWrap();
    }
  }
  return storedVal;
};

/**
 * Define a cell format that uses a blue font for hyperlinks and return the format, or just return the already defined cell format id.
 * @returns {Number}  Cell format ID.
 */
pui.xlsx_workbook.prototype.useFormatHyperlink = function() {
  if (this.cellFormatHyperlinkId < 0) this.cellFormatHyperlinkId = this.cellFormats.push(this.cellFormatHyperlink) - 1;
  return this.cellFormatHyperlinkId;
};

/**
 * Define a cell format that wraps cell text at NL|CR and return the format, or just return the already defined cell format id.
 * @returns {Number}  Cell format ID.
 */
pui.xlsx_workbook.prototype.useFormatWrap = function() {
  if (this.cellFormatWrapId < 0) this.cellFormatWrapId = this.cellFormats.push(this.cellFormatWrap) - 1;
  return this.cellFormatWrapId;
};

/**
 * Return a cellFormatId associated with a format string. If a number format associated with the format string does not exist,
 * then create a number format and return a cellFormatId referencing it. Cells reference cellFormats directly. Cell formats
 * reference Number Formats.
 * @param {String} formatStr    A format used by Profound UI; e.g. "Y-m-d". See https://docs.profoundlogic.com/x/A4Bw
 * @param {String} locale       Needed for certain formats, e.g. he_IL.
 * @returns {Number}
 */
pui.xlsx_workbook.prototype.getCellFormatId = function(formatStr, locale) {
  var cellFormatId;
  if (typeof formatStr !== "string") formatStr = "";
  if (typeof locale !== "string") locale = "";

  var numfmt = this.numFmts[locale + formatStr];
  if (numfmt != null) {
    // A cell format and number format already exist for the format string;
    cellFormatId = numfmt.cellFormatId;
  }
  else {
    // The format does not match any cell or number formats defined so far; so create a cell format and, if necessary, a number format.

    // Does the format correspond to any formats that are built-in to the XLSX specs?
    // https://msdn.microsoft.com/en-us/library/office/documentformat.openxml.spreadsheet.numberingformat.aspx
    var numFmtId = -1;
    switch (formatStr) {
      case "m-d-y": numFmtId = 14; break; // mm-dd-yy
      case "j-M-y": numFmtId = 15; break; // d-mmm-yy
      case "j-M": numFmtId = 16; break; // d-mmm
      case "M-y": numFmtId = 17; break; // mmm-yy
      case "g:i A": numFmtId = 18; break; // h:mm AM/PM.   Note: when am|pm exist in the format, the cell displays in 12-hour form.
      case "g:i:s A": numFmtId = 19; break; // h:mm:ss AM/PM
      case "g:i:s": numFmtId = 19; break; // h:mm:ss  Assume adding am|pm is a better match here than showing the 24-hour format.
      case "G:i": numFmtId = 20; break; // h:mm
      case "G:i:s": numFmtId = 21; break; // h:mm:ss
      case "m/d/y G:i": numFmtId = 22; break; // m/d/yy h:mm
      case "i:s": numFmtId = 45; break; // mm:ss
      case "isu": numFmtId = 47; break; // mmss.0
    }

    if (numFmtId >= 0) {
      // The number format is implicitly defined in the document specs; add a cell format to reference it.
      cellFormatId = this.defineCellFormat(numFmtId);
    }
    else {
      // The number format must be explicitly defined, and a cell format must be added for it.
      var xlformat = "";

      // Some locales use their own version of format like "l F j Y". Other locales can be implemented like this, as needed.
      if (locale === "he_IL") xlformat += "[$-101040D]";

      switch (formatStr) {
        // "R" means just the hour. i.e. *HMS, *JIS time formats, not the full RFC2822 date.
        case "R:i:s": xlformat = "hh:mm:ss"; break;

        // "R" means just the hour. i.e. *ISO, *EUR time formats.
        case "R.i.s": xlformat = "hh\\.mm\\.ss"; break;

        // There is no equivalent for "g" or "h" without am|pm, so output am|pm.
        case "g:i:s": xlformat = "h:mm:ss am/pm"; break;
        case "h:i:s": xlformat = "hh:mm:ss am/pm"; break;

        // Full Date/Time; RFC 2822. Note: there is no time-zone format code for XLSX, so omit UTC offset.
        case "R": xlformat = "ddd\\,\\ dd\\ mmm\\ yyyy\\ hh:mm:ss"; break;

        // Work around our standard timestamp pattern to avoid adding milliseconds twice. Microseconds smaller than a millisecond
        // are not shown. Also, Excel shows the date oddly if "." is used instead of ":".
        case "Y-m-d-H.i.s.uu": xlformat = "yyyy\\-mm\\-dd\\-hh\\.mm\\.ss.0"; break;

        default:
          // Translate each Profound UI formatting character code into the Excel code. Modify when necessary.
          // https://support.microsoft.com/en-us/office/number-format-codes-5026bbd6-04bc-48cd-bf33-80f18b4eae68
          for (var i = 0, n = formatStr.length; i < n; i++) {
            var fchar = formatStr.charAt(i);
            switch (fchar) {
              // Day
              case "d": xlformat += "dd"; break; // 2-digit day of month
              case "D": xlformat += "ddd"; break; // Short day of week name
              case "j": xlformat += "d"; break; // day of month without leading zero.
              case "l": xlformat += "dddd"; break; // Full day of week name.
              case "S": xlformat += "\\S"; break; // suffix for day of month; e.g. st, nd, rd, th; unsupported.
              case "z": xlformat += "\\z"; break; // day of the year starting from 0.

              // Month
              case "F": xlformat += "mmmm"; break; // Full month name.
              case "m": xlformat += "mm"; break; // 2-digit month number.
              case "M": xlformat += "mmm"; break; // Short month name.
              case "n": xlformat += "m"; break; // month number without leading zero.

              // Year
              case "Y": xlformat += "yyyy"; break;
              case "y": xlformat += "yy"; break;

              // Time
              case "g": xlformat += "h"; break; // 12-hour format without leading zeros; time will display as 24-hour unless am|pm is in the format.
              case "h": xlformat += "hh"; break; // 12-hour format with leading zeros; time will display as 24-hour unless am|pm is in the format.
              case "G": xlformat += "h"; break; // 24-hour without leading zeros.
              case "H": xlformat += "hh"; break; // 24-hour with leading zeros.

              case "i": xlformat += "mm"; break; // minutes with leading zeros (if preceded by colon)
              case "s": xlformat += "ss"; break; // seconds with leading zeros (if preceded by colon)
              case "u": xlformat += ".0"; break; // microseconds.

              // Note: if am|pm are included in the format, then the hours are 12-hour form; otherwise, hours are 24-hour form.
              case "a": xlformat += "am/pm"; break;
              case "A": xlformat += "AM/PM"; break;

              case '"': xlformat += "&quot;"; break;

              // Separator characters that Excel expects should include backslashes.
              case " ": xlformat += "\\ "; break;
              case "-": xlformat += "\\-"; break;
              case ".": xlformat += "\\."; break;
              case ",": xlformat += "\\,"; break;

              // Characters to output unchanged.
              case "/": xlformat += "/"; break;
              case ":": xlformat += ":"; break;

              // Other characters will be part of the string. Precede with a slash.
              default: xlformat += "\\" + fchar; break;
            }
          }
          break;
      }

      numFmtId = 164 + this.numFmtsCount; // Excel seems to reserve number format IDs up to 164.
      this.numFmtsCount++;

      cellFormatId = this.defineCellFormat(numFmtId);
      numfmt = {
        id: numFmtId,
        cellFormatId: cellFormatId,
        code: xlformat
      };
      this.numFmts[locale + formatStr] = numfmt;
    }
  }

  return cellFormatId;
};

/**
 * Define a cell format that uses the number format id; add that format to the list of cell formats.
 * @param {Number} numFmtId
 * @returns {Number}  Returns the cell format ID that uses the number format ID.
 */
pui.xlsx_workbook.prototype.defineCellFormat = function(numFmtId) {
  var cellFmt = { numfmtid: numFmtId, fontid: 0, fillid: 0, borderid: 0, xfid: 0, applynumberformat: 1 };
  return this.cellFormats.push(cellFmt) - 1;
};

/**
 * Create a xlsx file from the worksheet and cause a Save As dialog to appear in the browser asynchronously.
 * Loads the necessary JavaScript libraries if they are not loaded already.
 * Pre-conditions: setWorksheet must have been called.
 * @param {String} fileName
 */
pui.xlsx_workbook.prototype.download = function(fileName) {
  this.fileName = fileName || "sheet";

  // If necessary, load the required JSZip library and FileSaver "polyfill".
  var path = "/jszip/jszip.min.js";
  if (typeof JSZip == "function") {
    this._loadSaveAsJS();
  }
  else {
    var cleanup = this._cleanup.bind(this);
    pui["loadJS"]({
      "path": path,
      "callback": this._loadSaveAsJS.bind(this),
      "onerror": function() {
        console.log("Failed to load " + path);
        cleanup();
      }
    });
  }
};

pui.xlsx_workbook.prototype._loadSaveAsJS = function() {
  var path = "/jszip/FileSaver.min.js";
  // If the script is already loaded, continue. Note: loadJS doesn't callback when a script is loaded,
  // and saveAs is never setup in IE8,IE9. Checking pui.getScript() lets export work more than once.
  if (typeof saveAs == "function" || pui.getScript(pui.normalizeURL(path)) != null) {
    this._librariesLoaded();
  }
  else {
    var cleanup = this._cleanup.bind(this);
    pui["loadJS"]({
      "path": path,
      "callback": this._librariesLoaded.bind(this),
      "onerror": function() {
        console.log("Failed to load " + path);
        cleanup();
      }
    });
  }
};

pui.xlsx_workbook.prototype._librariesLoaded = function() {
  if (this.drawing) {
    this.drawing.loadImages(this._build.bind(this), this.feedbackObj);
  }
  else {
    this._build();
  }
};

/**
 * JSZip and the FileSaver are loaded, so build the Excel workbook. Also, call a method to prompt to save it.
 */
pui.xlsx_workbook.prototype._build = function() {
  var i, n;
  if (this.feedbackObj && typeof this.feedbackObj.setDownloadStatus == "function") {
    this.feedbackObj.setDownloadStatus(pui["getLanguageText"]("runtimeMsg", "compressing"));
  }

  // Boilerplate XML for any workbook. Some files that Excel normally includes are omitted: apparently
  // docProps/core.xml, docprops/app.xml, x1/styles.xml, x1/theme/theme1.xml are not essential.

  // [Content_Types].xml
  var content_types = pui.xlsx.XMLSTART +
  '<Types xmlns="' + pui.xlsx.XMLNS_BASE + '/package/2006/content-types">' +
  '<Default Extension="rels" ContentType="' + pui.xlsx.MIME_OPENXML + '-package.relationships+xml"/>' +
  '<Default Extension="xml" ContentType="application/xml"/>';
  if (this.drawing) {
    var extraExtensions = this.drawing.extensions;
    for (var ext in extraExtensions) {
      content_types += '<Default Extension="' + ext + '" ContentType="' + extraExtensions[ext] + '"/>';
    }
  }
  content_types +=
     '<Override PartName="/xl/workbook.xml" ContentType="' + this.MIME_XLSX_BASE + '.sheet.main+xml"/>' +
  '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="' + this.MIME_XLSX_BASE + '.worksheet+xml"/>' +
  '<Override PartName="/xl/styles.xml" ContentType="' + this.MIME_XLSX_BASE + '.styles+xml"/>' +
  '<Override PartName="/xl/sharedStrings.xml" ContentType="' + this.MIME_XLSX_BASE + '.sharedStrings+xml"/>';
  if (this.drawing != null) {
    content_types += '<Override PartName="/xl/drawings/drawing1.xml" ContentType="' + this.MIME_OPENXML + '-officedocument.drawing+xml"/>';
  }
  content_types += "</Types>";

  // _rels/.rels
  var rels = this.XMLSTART +
  '<Relationships xmlns="' + this.XMLNS_PACKAGE_RELS + '">' +
  '<Relationship Id="rId1" Type="' + this.XMLNS_OFFICEDOC_RELS + '/officeDocument" Target="xl/workbook.xml"/>' +
  "</Relationships>";

  // xl/workbook.xml
  var workbook = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
  '<workbook xmlns="' + this.XMLNS_SPREADSHEET + '" xmlns:r="' + this.XMLNS_OFFICEDOC_RELS + '">' +
  "<sheets>" +
  '<sheet name="Sheet1" sheetId="1" r:id="rId1"/>' +
  "</sheets>" +
  "</workbook>";

  // xl/_rels/workbook.xml.rels
  var workbookrels = this.XMLSTART +
  '<Relationships xmlns="' + this.XMLNS_PACKAGE_RELS + '">' +
  '<Relationship Id="rId3" Type="' + this.XMLNS_OFFICEDOC_RELS + '/styles" Target="styles.xml"/>' +
  '<Relationship Id="rId1" Type="' + this.XMLNS_OFFICEDOC_RELS + '/worksheet" Target="worksheets/sheet1.xml"/>' +
  '<Relationship Id="rId4" Type="' + this.XMLNS_OFFICEDOC_RELS + '/sharedStrings" Target="sharedStrings.xml"/>' +
  "</Relationships>";

  // x1/styles.xml - at least one of each font, fill, and border is required.
  var styles = this.XMLSTART + '<styleSheet xmlns="' + this.XMLNS_SPREADSHEET + '">';

  // Add Number formats for all date, time, and timestamp formats used.
  if (this.numFmtsCount > 0) {
    styles += '<numFmts count="' + this.numFmtsCount + '">';
    for (var key in this.numFmts) {
      var numFmt = this.numFmts[key];
      if (numFmt.id > 0) styles += '<numFmt numFmtId="' + numFmt.id + '" formatCode="' + numFmt.code + '"/>';
    }
    styles += "</numFmts>";
  }

  styles += '<fonts count="2">' +
  '<font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font>' +
  // Color theme requires theme1.xml with zero-based index to <clrScheme> referencing a <sysClr> or <srgbClr> value.
  '<font><u/><sz val="11"/><color rgb="0563C1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font>' +
  "</fonts>" +
  '<fills count="1"><fill><patternFill patternType="none"/></fill></fills>' +
  '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
  // CellStyleFormats (Formatting Records) - at least one must exist; these are referenced as xfId="0" in cellXfs and cellStyles <xf> tags.
  '<cellStyleXfs count="2">' +
  '<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>' + // normal font.
  '<xf numFmtId="0" fontId="1" fillId="0" borderId="0"/>' + // blue font for hyperlinks
  "</cellStyleXfs>";

  //
  // Cell Formats - formatting applied to cells.
  //
  styles += '<cellXfs count="' + this.cellFormats.length + '">';

  for (i = 0, n = this.cellFormats.length; i < n; i++) {
    var cellfmt = this.cellFormats[i];

    styles += "<xf";
    var attr = cellfmt.numfmtid || 0;
    styles += ' numFmtId="' + attr + '"';

    attr = cellfmt.fontid || 0;
    styles += ' fontId="' + attr + '"';

    attr = cellfmt.fillid || 0;
    styles += ' fillId="' + attr + '"';

    attr = cellfmt.borderid || 0;
    styles += ' borderId="' + attr + '"';

    attr = cellfmt.xfid || 0;
    styles += ' xfId="' + attr + '"';

    if (cellfmt.applynumberformat) styles += ' applyNumberFormat="' + cellfmt.applynumberformat + '"';
    if (cellfmt.applyalignment) styles += ' applyAlignment="' + cellfmt.applyalignment + '"';

    if (cellfmt.alignment && cellfmt.alignment.wraptext) styles += '><alignment wrapText="' + cellfmt.alignment.wraptext + '"/></xf>';
    else styles += "/>";
  }
  styles += "</cellXfs>" +
  '<dxfs count="0"/>' +
  "</styleSheet>";

  var zip = new JSZip();

  zip["file"]("[Content_Types].xml", content_types);
  zip["file"]("_rels/.rels", rels);
  zip["file"]("xl/workbook.xml", workbook);
  zip["file"]("xl/styles.xml", styles);
  zip["file"]("xl/sharedStrings.xml", this.getSharedStringsXML());
  zip["file"]("xl/_rels/workbook.xml.rels", workbookrels);
  zip["file"]("xl/worksheets/sheet1.xml", this.worksheet.getSheetXML());

  var relationships = this.worksheet.rels;
  if (this.drawing) {
    relationships.push({ type: "drawing", target: "../drawings/drawing1.xml" });

    zip["file"]("xl/drawings/drawing1.xml", this.drawing.getDrawingXML());
    zip["file"]("xl/drawings/_rels/drawing1.xml.rels", this.drawing.getDrawingRelsXML());
    var images = this.drawing.rels;
    for (i = 0; i < images.length; i++) {
      if (images[i].image) {
        // If image failed to download, don't try to add 404/500 response as image.
        zip["file"]("xl/media/" + images[i].name, images[i].image, { "binary": true });
      }
    }
  }

  if (relationships.length > 0) {
    // Hyperlinks and drawings need sheet relationships.
    var sheetrels = this.XMLSTART + '<Relationships xmlns="' + this.XMLNS_PACKAGE_RELS + '">';

    for (i = 0, n = relationships.length; i < n; i++) {
      var rel = relationships[i];
      var targetmode = "";
      if (rel.type === "hyperlink") targetmode = ' TargetMode="External"';

      sheetrels += '<Relationship Id="rId' + (i + 1) + '" Type="' + this.XMLNS_OFFICEDOC_RELS + "/" + rel.type + '" Target="' +
        pui.xmlEscape(rel.target) + '"' + targetmode + "/>";
    }

    sheetrels += "</Relationships>";

    zip["file"]("xl/worksheets/_rels/sheet1.xml.rels", sheetrels);
  }

  // Firefox, Chrome, IE10,IE11, and Edge can prompt to save from a blob.
  var zipconfig = { "type": "blob", "compression": "DEFLATE", "mimeType": this.MIME_XLSX_BASE + ".sheet" };
  var promise = zip["generateAsync"](zipconfig);
  promise["then"](this._zipResolved.bind(this), this._cleanup.bind(this));
};

pui.xlsx_workbook.prototype._cleanup = function() {
  if (this.feedbackObj && typeof this.feedbackObj.fireDownloadCleanup == "function") this.feedbackObj.fireDownloadCleanup();
  this.worksheet.deleteOwnProperties();
  if (this.drawing) this.drawing.deleteOwnProperties();
  this.deleteOwnProperties();
};

pui.xlsx_workbook.prototype._zipResolved = function(blob) {
  saveAs(blob, this.fileName + ".xlsx");
  this._cleanup();
};

/**
 * Return an XML document string containing the Excel shared strings table.
 * @returns {String}
 */
pui.xlsx_workbook.prototype.getSharedStringsXML = function() {
  // Order the shared strings by the index id. Assume there are no gaps in indices.
  var sst_inorder = [];
  for (var str in this.sst) {
    var obj = this.sst[str];
    var idx = obj.value;
    sst_inorder[idx] = str;
  }

  var xml = this.XMLSTART + '<sst xmlns="' + this.XMLNS_SPREADSHEET + '" count="' +
    String(sst_inorder.length + 1) + '"  uniqueCount="' + String(sst_inorder.length) + '">';
  for (var i = 0, n = sst_inorder.length; i < n; i++) {
    xml += "<si><t>" + pui.xmlEscape(sst_inorder[i]) + "</t></si>";
  }
  xml += "</sst>";
  return xml;
};

/**
 * Convert an ECMAScript Date to a Microsoft OADate, the number of days since Dec 30th, 1899 12am (midnight). Treat all dates as local.
 * Note: dates between Jan 1 1900 and March 1 1900 return a number incorrect by 1 day, due to an XL design problem. Do not use this for those dates.
 * Source: https://stackoverflow.com/questions/15549823/oadate-to-milliseconds-timestamp-in-javascript
 * License: Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).
 * Bibliography:
 *   https://docs.microsoft.com/en-us/dotnet/api/system.datetime.tooadate?&view=net-6.0#System_DateTime_ToOADate
 *   https://docs.microsoft.com/en-us/office/troubleshoot/excel/wrongly-assumes-1900-is-leap-year
 *   https://docs.microsoft.com/en-us/office/troubleshoot/excel/1900-and-1904-date-system
 * @param {Date} date    Date to convert
 * @returns {Number}
 */
pui.xlsx_workbook.prototype.dateToOADate = function(date) {
  var temp = new Date(date);
  temp.setHours(0, 0, 0, 0); // Set temp to start of day and get whole days between dates,
  var temp2 = new Date(1899, 11, 30); // December 30th 1899 00:00:00 (midnight).
  var days = Math.round((temp - temp2) / 8.64e7);
  // Get decimal part of day, OADate always assumes 24 hours in day
  var partDay = (Math.abs((date - temp) % 8.64e7) / 8.64e7).toFixed(10);
  return Number(days + partDay.substr(1));
};

//
// end of xlsx_workbook class.
//

//
// xlsx_worksheet class.
//

/**
 * Worksheet object for creating XML strings for MS Excel 2007+ workbooks.
 * @constructor
 * @param {Number} numcols
 * @returns {pui.xlsx_worksheet}
 */
pui.xlsx_worksheet = function(numcols) {
  this.numColumns = numcols;
  this.rows = [];
  this.lastRowNum = -1; // The index of the last row in rows; -1 when no rows are added.

  /**
   * @type Number    Height in pixels. Set by Grid.
   */
  this.defaultRowHeightpx = 20;
  this.colWidths = [];

  this.useDrawing = false; // When true, one drawing reference is included in the sheet xml.

  this.formats = []; // column formats.

  this.charcounts = []; // max number of characters in each column; to calculate <col width="">.
  this.fontMaxDigitWidth = 7; // max pixel width of 11pt font.

  /**
   * Relationships for hyperlink targets or drawings. Generated as "Relationship" tags in the sheet xml.rels file.
   * Let the relationship id, "rId#", be the array index + 1.
   * @type Array.<Object>    Array of objects with properties: type (link|drawing), target, targetmode ("External" for links).
   */
  this.rels = [];

  /**
   * References hyperlink "relationships" with cells in the worksheet. Generated as "hyperlink" tags in the sheet XML.
   * @type Array.<Object>  List of objects with properties: row, col, relId--the relationship object containing the link target.
   */
  this.hyperlink_refs = [];

  //
  // Store default time/date/timestamp separators and formats and the locale default in case cell formats are unknown.
  //
  var datfmt = pui.getSQLDateFmt();
  this.datsep = null;
  switch (datfmt.sep) {
    case 1: this.datsep = "/"; break;
    case 2: this.datsep = "-"; break;
    case 3: this.datsep = "."; break;
    case 4: this.datsep = ","; break;
    case 5: this.datsep = " "; break;
    case 7: this.datsep = pui.appJob && pui.appJob.dateSeparator ? pui.appJob.dateSeparator : null; break; //* JOB
  }

  // Default format strings per type: date, time, timestamp. Keys correspond to field formatting keys.
  this.defaultFmtStr = {
    "dateFormat": "Y-m-d",
    "timeFormat": "H.i.s"
  };

  // Get date format string. Default is *ISO. Separator is fixed, as with USA, EUR, and JIS. "this.tsformatStr" needs "this.datsep".
  switch (datfmt.fmt) {
    case 1: this.defaultFmtStr["dateFormat"] = "Y-m-d"; this.datsep = "-"; break; //* ISO
    case 2: this.defaultFmtStr["dateFormat"] = "m/d/Y"; this.datsep = "/"; break; //* USA
    case 3: this.defaultFmtStr["dateFormat"] = "d.m.Y"; this.datsep = "."; break; //* EUR
    case 4: this.defaultFmtStr["dateFormat"] = "Y-m-d"; this.datsep = "-"; break; //* JIS
    case 5: if (typeof this.datsep === "string") this.defaultFmtStr["dateFormat"] = "m" + this.datsep + "d" + this.datsep + "y"; break; //* MDY
    case 6: if (typeof this.datsep === "string") this.defaultFmtStr["dateFormat"] = "d" + this.datsep + "m" + this.datsep + "y"; break; //* DMY
    case 7: if (typeof this.datsep === "string") this.defaultFmtStr["dateFormat"] = "y" + this.datsep + "m" + this.datsep + "d"; break; //* YMD
    case 8: if (typeof this.datsep === "string") this.defaultFmtStr["dateFormat"] = "y" + this.datsep + "z"; break; //* JUL
  }

  var timfmt = pui.getSQLTimeFmt();
  var timesep = null;
  switch (timfmt.sep) {
    case 3: timesep = "."; break;
    case 4: timesep = ","; break;
    case 5: timesep = " "; break;
    case 6: timesep = ":"; break;
    case 7: timesep = pui.appJob && pui.appJob.timeSeparator ? pui.appJob.timeSeparator : null; break; //* JOB
  }

  // Get time format string. Default is *ISO. Separator is fixed, as with USA, EUR, and JIS.
  switch (timfmt.fmt) {
    case 1: this.defaultFmtStr["timeFormat"] = "H.i.s"; break; //* ISO
    case 2: this.defaultFmtStr["timeFormat"] = "h:m A"; break; //* USA
    case 3: this.defaultFmtStr["timeFormat"] = "h.m.s"; break; //* EUR
    case 4: this.defaultFmtStr["timeFormat"] = "h:m:s"; break; //* JIS
    case 9: if (typeof timesep === "string") this.defaultFmtStr["timeFormat"] = "h" + timesep + "m" + timesep + "s"; break; //* HMS
  }

  this.defaultFmtStr["timeStampFormat"] = this.defaultFmtStr["dateFormat"] + this.datsep + this.defaultFmtStr["timeFormat"] + ".uu";

  this.locale = pui["locale"] && pui.locales[pui["locale"]] ? pui.locales[pui["locale"]] : "en_US";

  // Needed for storing numbers. Assume appJob decimalFormat is the same as the CGI helper job's decimal format.
  this.decimalSepComma = pui.appJob != null && (pui.appJob["decimalFormat"] == "I" || pui.appJob["decimalFormat"] == "J");
};
pui.xlsx_worksheet.prototype = Object.create(pui.xlsx);

/**
 * Add a new row for cells to go. Grid should add cells and rows in a sequential order.
 */
pui.xlsx_worksheet.prototype.newRow = function() {
  this.lastRowNum = this.rows.push([]) - 1;
};

/**
 * @param {Array.<Number>} arr  An array with Numeric pixel values for each column in the grid.
 */
pui.xlsx_worksheet.prototype.setColumnWidths = function(arr) {
  this.colWidths = arr;
};

/**
 * Set a column's format internally. The format determines XLSX style and whether a column's cells need to be in the Shared Strings
 * Table. All are stored as strings except:
 *   "zoned", "packed", and "floating" are stored as literal value.
 *   "date", "time", and "timestamp" are stored as floating point numbers.
 * @param {Object} format   References bound value object from grid's me.runtimeChildren. Includes properties:
 *   dataType (date,char,zoned,time,timestamp,graphic,...); decPos (undefined,2,...); locale; dateFormat, etc.
 * @param {Number} col      The zero-based column index.
 */
pui.xlsx_worksheet.prototype.setColumnFormat = function(format, col) {
  if (typeof this.formats[col] !== "object" || this.formats[col] === null) this.formats[col] = { "dataType": "char" };

  this.numColumns = Math.max(this.numColumns, col);

  var datatype = "char";
  if (typeof format["dataType"] === "string") {
    if (format["dataType"].length == 1) {
      // If DB-driven grid calls setColumnFormat, then type names are in IBM format.
      switch (format["dataType"]) {
        case "L": datatype = "date"; break;
        case "T": datatype = "time"; break;
        case "Z": datatype = "timestamp"; break;
        case "G": datatype = "graphic"; break;
        case "F": datatype = "floating"; break;
        case "P": datatype = "packed"; break;
        case "B": // binary
        case "I": // integer
        case "S": // zoned decimal
        case "U": // unsigned
        case "Y": // keyboard shift of numeric only - zoned
          datatype = "zoned"; break;
      }
      this.formats[col]["dataType"] = datatype;
    }
    else {
      datatype = format["dataType"];
      this.formats[col]["dataType"] = datatype;
    }
  }

  //
  // Copy other formatting properties needed for some data types.
  //

  if (typeof format["decPos"] === "string") {
    this.formats[col]["decPos"] = format["decPos"];

    // If the data has 2 decimal positions, use the format our style XML says is for 2 decimal positions.
    if (format["decPos"] === "2") this.formats[col].cellFormatId = this.workbook.cellFormat2DecPos;
  }

  // Assume: if the format has dateFormat then it can be formatted as a date; timeFormat formats as time; timeStampFormat formats as TS.
  // Note: "dataType" and "formatting" may be different, as in #3972 screen dump having zoned columns formatted as Dates.
  var formatKey = false;
  if (typeof format["dateFormat"] === "string" && format["dateFormat"].length > 0) formatKey = "dateFormat";
  else if (typeof format["timeFormat"] === "string" && format["timeFormat"].length > 0) formatKey = "timeFormat";
  else if (typeof format["timeStampFormat"] === "string" && format["timeStampFormat"].length > 0) formatKey = "timeStampFormat";

  if (typeof formatKey === "string") {
    if (typeof format["locale"] === "string") this.formats[col]["locale"] = format["locale"];
    else this.formats[col]["locale"] = this.locale;

    // The column has a date, time, or timestamp type; set the format string, id, and locale on the column.
    var formatStr = format[formatKey];
    if (typeof formatStr !== "string") formatStr = this.defaultFmtStr[formatKey];
    this.formats[col][formatKey] = formatStr;
    this.formats[col].cellFormatId = this.workbook.getCellFormatId(formatStr, this.formats[col]["locale"]);
  }

  if (typeof format["formatting"] === "string") this.formats[col]["formatting"] = format["formatting"];
};

/**
 * Set a cell value on the last row added to the sheet. Decide what cellFormat it should use.
 * Pre-Conditions: numbers do not have thousands separators. (As of Jan 2022 the grid does not include 1000s separators.)
 * @param {String|Number} value  Value to occupy a cell, may become a URL or converted to a number, date, or shared string value.
 *                               Note: test case for when (typeof value === 'number') is in #4085.
 * @param {Number} col           The zero-based column index of the worksheet.
 * @param {undefined|Null|String} hyperlink  A hyperlink string when defined.
 * @param {undefined|Boolean} tryConvert     When true, values should try converting to date, time, timestamp, or
 *   numerics. This should only be true when the column formats are unknown, as in a Custom SQL or Data URL Grids.
 */
pui.xlsx_worksheet.prototype.setCell = function(value, col, hyperlink, tryConvert) {
  if ((typeof value !== "string" && typeof value !== "number") || (typeof value === "string" && value.length === 0)) {
    // When values are not non-empty strings nor numbers, then leave the cell empty.
    this.rows[this.lastRowNum][col] = { value: null };
    return;
  }

  // Define the cell's format from either the column format or a new char format.
  var colFormatObj = this.formats[col];
  if (colFormatObj == null) this.formats[col] = colFormatObj = { "dataType": "char" };

  this.numColumns = Math.max(this.numColumns, col);
  this.updateCharCount(value, col);

  // Determine how to store the cell value. Cells must only contain numbers, including floating point, scientific notation, period
  // decimal points, and negative signs. Other characters require the value to be stored as a string.
  //
  // Try parsing date, time, and timestamp values first according to their formats.
  if (typeof colFormatObj["dateFormat"] === "string" && colFormatObj["dateFormat"].length > 0) {
    if (this.tryTimestamp(value, col, "dateFormat")) return;
    // The value did not parse as a date or as a date that XL supports. e.g. pre 1900-01-01 or decimal formatted as date.
    // Try storing as number in case the field was a number formatted as a date. #3972.
    if (this.tryFloatingPoint(value, col)) return;
    if (this.tryFixedPoint(value, col)) return;
  }
  else if (typeof colFormatObj["timeFormat"] === "string" && colFormatObj["timeFormat"].length > 0) {
    if (this.tryTime(value, col, "timeFormat")) return;
  }
  else if (typeof colFormatObj["timeStampFormat"] === "string" && colFormatObj["timeStampFormat"].length > 0) {
    if (this.tryTimestamp(value, col, "timeStampFormat")) return;
    if (this.tryFloatingPoint(value, col)) return;
    if (this.tryFixedPoint(value, col)) return;
  }

  // Try parsing values according to data types. Note: DBD grids can have data-types and not date|time|timeStamp Formats.
  switch (colFormatObj["dataType"]) {
    case "floating":
      if (this.tryFloatingPoint(value, col)) return;
      break;
    case "packed":
    case "zoned":
      if (this.tryFixedPoint(value, col)) return;
      break;
    case "date":
      if (this.tryTimestamp(value, col, "dateFormat")) return;
      if (this.tryFloatingPoint(value, col)) return;
      if (this.tryFixedPoint(value, col)) return;
      break;
    case "timestamp":
      if (this.tryTimestamp(value, col, "timeStampFormat")) return;
      if (this.tryFloatingPoint(value, col)) return;
      if (this.tryFixedPoint(value, col)) return;
      break;
    case "time":
      if (this.tryTime(value, col, "timeFormat")) return;
      break;
  }

  // Handle when a number or date cell formatting is set that did not not match dataType. e.g. char formatted as number or date.
  switch (colFormatObj["formatting"]) {
    case "Date":
    case "Time Stamp":
    case "Number":
      if (this.tryFixedPoint(value, col)) return;
      if (this.tryFloatingPoint(value, col)) return;
      break;
  }

  if (tryConvert) {
    // Try to detect the type of data based on patterns; when possible store it as a numeric value instead of a string.
    if (this.tryTimestamp(value, col, "timeStampFormat")) return;
    if (this.tryTimestamp(value, col, "dateFormat")) return;
    if (this.tryTime(value, col, "timeFormat")) return;
    if (this.tryFloatingPoint(value, col)) return;
    if (this.tryFixedPoint(value, col)) return;
  }

  if (typeof hyperlink === "string" && hyperlink.length > 0) this.addHyperlink(hyperlink, col);
  else hyperlink = false;

  // Anything not already handled belongs in the shared strings table (SST); the doc would be invalid if cell tags contained non-numeric data. #3972.
  this.rows[this.lastRowNum][col] = this.workbook.useSharedString(value, hyperlink !== false);
};

/**
 * If the value is a fixed decimal (zoned/packed), parse it as a number and store it.
 * @param {String|Number} value
 * @param {Number} col
 * @returns {Boolean}     Returns true if the assignment succeeded; false if the value was not used.
 */
pui.xlsx_worksheet.prototype.tryFixedPoint = function(value, col) {
  if (typeof value === "string") {
    if (this.decimalSepComma && /^[-+]?[0-9]*,?[0-9]+$/.test(value)) {
      // XLSX stores numbers with "." decimal separator (and no thousands separators). Decimal separator becomes ".".
      value = Number(value.replace(",", "."));
    }
    else if (/^[-+]?[0-9]*\.?[0-9]+$/.test(value)) {
      // The number is a valid floating point, decimal, exponent, or hex value. Try to parse the number, and store it. Do not store
      // values that are not numbers; characters in the <c><v> tag must represent valid numbers.
      value = Number(value);
    }
  }

  if (typeof value === "number" && !isNaN(value)) {
    var cellfmtid = this.formats[col]["decPos"] === "2" ? this.workbook.cellFormat2DecPos : 0;
    this.rows[this.lastRowNum][col] = { value: value, cellFormatId: cellfmtid };
    return true;
  }

  return false;
};

/**
 * If the value is a floating point or exponent notation, parse it as a number and store it.
 * @param {String|Number} value
 * @param {Number} col
 * @returns {Boolean}     Returns true if the assignment succeeded; false if the value was not used.
 */
pui.xlsx_worksheet.prototype.tryFloatingPoint = function(value, col) {
  if (typeof value === "string") {
    if (this.decimalSepComma && /^[-+]?[0-9]*,?[0-9]+([eE][-+]?[0-9]+)?$/.test(value)) {
      value = Number(value.replace(",", "."));
    }
    else if (/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(value)) {
      value = Number(value);
    }
  }

  if (typeof value === "number" && !isNaN(value)) {
    this.rows[this.lastRowNum][col] = { value: value, cellFormatId: 0 };
    return true;
  }

  return false;
};

/**
 * Get the locale and format string for column (or use defaults), and parse a date.
 * @param {String|Number} value
 * @param {Number} col
 * @param {String} formatKey
 * @returns {Array}           Returns Date in index 0 (if string was valid); the format string is in index 1; locale in index 2.
 */
pui.xlsx_worksheet.prototype.parseDateVal = function(value, col, formatKey) {
  if (typeof value !== "string") value = String(value);

  var locale = this.formats[col]["locale"];
  if (typeof locale !== "string") locale = this.locale;

  var formatStr = this.formats[col][formatKey];
  if (typeof formatStr !== "string") formatStr = this.defaultFmtStr[formatKey];

  var dateobj = pui.formatting.Date.parse(value, formatStr, locale);

  return [dateobj, formatStr, locale];
};

/**
 * Attempt to parse, convert, and assign to the cell in the last row a numeric value representing a timestamp (or date) that XL can
 * serialize numerically.
 * @param {String} value
 * @param {Number} col
 * @param {String} formatKey
 * @returns {Boolean}         Returns true if the assignment succeeded; false if the value was not used.
 */
pui.xlsx_worksheet.prototype.tryTimestamp = function(value, col, formatKey) {
  var parsed = this.parseDateVal(value, col, formatKey);
  // Excel has no formatter for "z", and our Y-z parser fails for days 32 through 366; just leave these as strings so they display consistently.
  if (parsed[1] === "Y-z") return false;

  if (parsed[0] instanceof Date) {
    var dateobj = parsed[0];
    var year = dateobj.getFullYear();
    var month = dateobj.getMonth();
    var day = dateobj.getDate();
    if (year === 1 && month === 0 && day === 1) {
      // If the cell contains 0001-01-01... then leave the cell empty. Note: load-all grids pass blanks instead of 0001-01-01 to
      // setCell. DBD, Custom SQL, and Data URL grids do pass them as values.
      this.rows[this.lastRowNum][col] = { value: null };
      return true;
    }

    if (year < 1900 || (year === 1900 && month < 2)) {
      // Store any dates before March 1 1900 as strings to avoid a leap year bug in XL and because dates before Jan 1 1900 are
      // serialized as strings. (Returning true saves other parsers from trying to convert the value.)
      this.rows[this.lastRowNum][col] = this.workbook.useSharedString(value);
      return true;
    }

    var num = this.workbook.dateToOADate(dateobj);
    if (!isNaN(num) && num >= 2) {
      // The date is on or after Jan 1, 1900 (2 days after Dec 30 1899 00:00:00) and can be formatted as a date.
      this.rows[this.lastRowNum][col] = {
        value: num,
        cellFormatId: this.workbook.getCellFormatId(parsed[1], parsed[2]) // Creates or re-uses existing cell and number formats.
      };
      return true;
    }
  }
  return false;
};

/**
 * Attempt to parse, convert, and assign a numeric value representing a valid XLSX time to a cell in the last row.
 * @param {String} value
 * @param {Number} col
 * @param {String} formatKey
 * @returns {Boolean}         Returns true if the assignment succeeded; false if the value was not used.
 */
pui.xlsx_worksheet.prototype.tryTime = function(value, col, formatKey) {
  var parsed = this.parseDateVal(value, col, formatKey);
  if (parsed[0] instanceof Date) {
    var hours = parsed[0].getHours();
    var mins = parsed[0].getMinutes();
    var secs = parsed[0].getSeconds();
    var ms = parsed[0].getMilliseconds();

    this.rows[this.lastRowNum][col] = {
      value: hours / 24 + mins / 1440 + secs / 86400 + ms / 86400000, // Note: times in xlsx are 0 to .99999; e.g. 0.5 for 12:00 pm.
      cellFormatId: this.workbook.getCellFormatId(parsed[1]) // Creates or re-uses existing cell and number formats.
    };
    return true;
  }
  return false;
};

/**
 * Add a reference of the hyperlink target to the cell in the last row. If the hyperlink target is not already defined, then it gets defined.
 * @param {String} hyperlinkTarget
 * @param {Number} col
 */
pui.xlsx_worksheet.prototype.addHyperlink = function(hyperlinkTarget, col) {
  var relId = -1;
  // Reuse the link target if it already exists.
  for (var i = 0, n = this.rels.length; i < n; i++) {
    var rel = this.rels[i];
    if (rel.type === "hyperlink" && rel.target === hyperlinkTarget) {
      relId = i;
      break;
    }
  }

  if (relId < 0) relId = this.rels.push({ type: "hyperlink", target: hyperlinkTarget }) - 1;

  // Add the reference. Assume "addHyperlink" is only called once per cell.
  this.hyperlink_refs.push({ row: this.lastRowNum, col: col, relId: relId });
};

/**
 * Check the character count in new value, and increase the count if necessary. Counts are needed when deciding column widths.
 * Note: setting counts in setCell avoids looping over every cell in every column when saving the XML.
 * @param {String|Number} value
 * @param {Number} col
 */
pui.xlsx_worksheet.prototype.updateCharCount = function(value, col) {
  var len = 0;
  if (typeof value === "string") len = value.length;

  if (this.rows.length == 1 || this.charcounts[col] == null) {
    // The first row: get the column style information from each cell.
    this.charcounts[col] = len;
  }
  else {
    // For other rows, track the max character length of data in each column.
    this.charcounts[col] = Math.max(this.charcounts[col], len);

    // Allow enough room for 10-char dates, e.g., yyyy-mm-dd.
    if (this.formats[col]["dataType"] === "date") this.charcounts[col] = Math.max(this.charcounts[col], 10);
  }
};

/**
 * Return an XML document string containing the spreadsheet data.
 * @returns {String}
 */
pui.xlsx_worksheet.prototype.getSheetXML = function() {
  var row, col, n;
  this.makemap();

  var xml = this.XMLSTART + '<worksheet xmlns="' + this.XMLNS_SPREADSHEET + '"' + ' xmlns:r="' + this.XMLNS_OFFICEDOC_RELS + '">' +
  '<dimension ref="A1:' + this.map[this.numColumns - 1] + this.rows.length + '"/>' +
  // Set the row height. Excel default is 15 point, which is 20 pixels. 0.75 * pixels = points.
  '<sheetFormatPr defaultRowHeight="' + (this.defaultRowHeightpx * 0.75) + '" customHeight="1" />' +
  "<cols>";

  // Configure each column with widths, and with styles for new cells.
  for (col = 0, n = this.numColumns; col < n; col++) {
    // First, try to use the pixel width from the grid. XL col width = (pixels - 5) / 7; based on observation.
    // If widths are missing, then use the character count.
    // Calculate column width based on number of characters. Formula comes from:
    // https://msdn.microsoft.com/en-us/library/office/documentformat.openxml.spreadsheet.column.aspx
    var width = 0;
    if (typeof this.colWidths[col] === "number") {
      width = pui.round((this.colWidths[col] - 5) / 7, 2);
    }
    else if (this.charcounts[col] != null && !isNaN(parseInt(this.charcounts[col], 10))) {
      width = Math.floor((this.charcounts[col] * this.fontMaxDigitWidth + 5) / this.fontMaxDigitWidth * 256) / 256 + 5;
    }

    if (width < 0) width = 0; // Widths cannot be < 0 or > 255. Else width is set to 255--way too large. #5372.
    else if (width > 255) width = 255;

    // Set a style for cells the user may add in the column in the future.
    var style = "";
    if (this.formats[col] != null && this.formats[col].cellFormatId) style = ' style="' + this.formats[col].cellFormatId + '"';

    xml += '<col min="' + (col + 1) + '" max="' + (col + 1) + '" width="' + width + '" ' + style + ' customWidth="1"/>';
  }
  xml += "</cols><sheetData>";

  // Set the height of the header row to be different than the normal row height, if necessary. In points: points = 0.75 * pixel_value.
  var rowHeightStr = "";
  if (typeof this.headerRowHeightpx === "number" && this.headerRowHeightpx > 0) {
    rowHeightStr = ' ht="' + Math.round(this.headerRowHeightpx * 0.75) + '" customHeight="1"';
  }

  // Output each row with either numeric data or reference to shared-strings table.
  for (row = 0, n = this.rows.length; row < n; row++) {
    var r = String(row + 1);
    xml += '<row r="' + r + '"' + rowHeightStr + ">";
    var rowObj = this.rows[row];
    if (rowObj != null) {
      // Look in each column in the row for cells to output.
      for (col = 0; col < this.numColumns; col++) {
        var cell = rowObj[col];
        // The cell should always have a value of type, number. If not, just omit it, leaving a blank cell. #6192. Also, empty character cells are omitted.
        if (cell != null && typeof cell.value === "number") {
          xml += '<c r="' + this.map[col] + r + '"';

          // Cell formats must be recorded with each cell tag to take effect.
          if (typeof cell.cellFormatId === "number") xml += ' s="' + cell.cellFormatId + '"';

          // String cell values correspond to an entries in the workbook's shared strings table (SST).
          if (cell.isString) xml += ' t="s"';

          xml += "><v>" + cell.value + "</v></c>";
        }
      }
    }
    xml += "</row>";

    // 7601 to fix issue where row heights not correct when header row height is specified
    rowHeightStr = "";
    if (typeof this.headerRowHeightpx === "number" && this.headerRowHeightpx > 0) {
      rowHeightStr = ' ht="' + Math.round(this.defaultRowHeightpx * 0.75) + '" customHeight="1"';
    }
  }

  xml += "</sheetData>";
  if (this.useDrawing) {
    xml += '<drawing r:id="rId1"/>';
  }

  // Hyperlinks reference cells; e.g. A2. Their texts are in the shared strings table.
  var hyperlink_refs = this.hyperlink_refs;
  if (hyperlink_refs.length > 0) {
    xml += "<hyperlinks>";
    n = hyperlink_refs.length;
    for (var i = 0; i < n; i++) {
      row = hyperlink_refs[i].row + 1;
      var relId = hyperlink_refs[i].relId + 1;
      xml += '<hyperlink ref="' + this.map[hyperlink_refs[i].col] + row + '" r:id="rId' + relId + '" />';
    }
    xml += "</hyperlinks>";
  }
  xml += "</worksheet>";

  return xml;
};

/**
 * Fill the map of column indexes to excel-style column names for as many columns as needed.
 */
pui.xlsx_worksheet.prototype.makemap = function() {
  // Map from column index to the excel column names: 0=A, ..., 25=Z, 26=AA, etc.
  // Needed for the <dimension> tag and in each <row> tag.
  this.map = [];

  var mapctr = 0;

  var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var d3 = "";
  var d2 = "";

  // Loop over the digits to create the map for as many columns that are used.
  // The left-most digit is blank until the 2nd and 3rd pass ZZ.
  var numcols = this.numColumns;
  for (var i = -1; i < 26 && mapctr < numcols; i++) {
    var d2start = -1; // Let the k loop run once with no 2nd digit; then 2nd digits are included.
    if (i >= 0) d2start = 0; // passed ZZ: 2nd digit should start at "A" instead of "".

    // Loop for the middle digit, which is blank until the 3rd digit passes Z the first time.
    for (var j = d2start; j < 26 && mapctr < numcols; j++) {
      for (var k = 0; k < 26 && mapctr < numcols; k++) {
        this.map[mapctr] = d3 + d2 + digits[k];
        mapctr++;
      }
      d2 = digits[(j + 1) % 26]; // get the next digit; wraps around to 0 if next is 26.
    }
    d3 = digits[i + 1]; // note: the last time this runs, it will return undefined; but no matter.
  }
};

//
// end of xlsx_worksheet class.
//

/**
 * Object for creating XML strings for MS Excel 2007+ picture references.
 * @constructor
 * @returns {pui.xlsx_drawing}
 */
pui.xlsx_drawing = function() {
  // A collection of file extensions for all image types needed in the drawing.
  this.extensions = {};

  // List of relationships; e.g. rId1 is ../media/image1.png, etc.
  // An array of objects: {name: imageName, image: blob }
  // Before being used outside this class, the images should have already been loaded with loadImages.
  this.rels = [];

  // Private properties.

  // Counter of image names.
  this.nameCtr = 1;

  // List of row/columns and relationship IDs.
  this.anchors = [];
};
pui.xlsx_drawing.prototype = Object.create(pui.xlsx);

/**
 * Add URI and dimensions of an image to the drawing.
 * @param {Number} row
 * @param {Number} column
 * @param {String} imageURI   This should already be right-trimmed.
 * @param {Object} dimens     Dimensions: top, left, width, height numeric values in pixels.
 *                            These should never be null or undefined.
 */
pui.xlsx_drawing.prototype.addImage = function(row, column, imageURI, dimens) {
  var matches = imageURI.match(/\.(jpe?g|gif|png|tiff?)(\?.*)?(#.*)?$/i); // URL may end in query or fragment; e.g. ?r=12345#something
  if (matches == null) {
    console.log("Unsupported image type in URI:", imageURI);
    return;
  }
  var ext = matches[1].toLowerCase(); // Upper-case content-types will break the spreadsheet. #5356.
  if (ext == "jpeg") ext = "jpg";
  else if (ext == "tif") ext = "tiff"; // Excel expects image/tiff as content-type.

  // Look for the URL in a list of existing URLs.
  var rel = -1;
  for (var i = 0; i < this.rels.length; i++) {
    if (this.rels[i].uri == imageURI) {
      rel = i;
      break;
    }
  }
  if (rel < 0) { // There isn't a relationship for the URI; add it.
    // Generate a new image name: Use the image name counter for base name.
    var newName = "image" + this.nameCtr + "." + ext;
    this.nameCtr++;

    // Choose the appropriate content-type: png: image/png; etc. Add to a collection.
    this.extensions[ext] = "image/" + ext;

    this.rels.push({ name: newName, uri: imageURI }); // Store the relationship.
    rel = this.rels.length - 1;
  }
  // Store the picture position, rId, and dimensions.
  this.anchors.push({
    row: row,
    col: column,
    rel: rel,
    top: dimens.top,
    left: dimens.top,
    width: dimens.width,
    height: dimens.height
  });
};

/**
 * returns XML text for drawing1.xml
 * @returns {String}
 */
pui.xlsx_drawing.prototype.getDrawingXML = function() {
  var anchors = this.anchors;
  var xml = this.XMLSTART +
  '<xdr:wsDr xmlns:xdr="' + this.XMLNS_BASE + '/drawingml/2006/spreadsheetDrawing" xmlns:a="' + this.XMLNS_BASE + '/drawingml/2006/main">';
  for (var i = 0; i < anchors.length; i++) {
    xml +=
    '<xdr:twoCellAnchor editAs="oneCell">' +
    "<xdr:from>" +
    "<xdr:col>" + anchors[i].col + "</xdr:col>" +
    // Offsets are in English Metric Units (EMU): 914400 EMU per inch. At 96 pixels per inch, a pixel is 9525 EMUs.
    // https://msdn.microsoft.com/en-us/library/ff531172(v=office.12).aspx
    "<xdr:colOff>" + Math.round(anchors[i].left * 9525) + "</xdr:colOff>" +
    "<xdr:row>" + anchors[i].row + "</xdr:row>" +
    "<xdr:rowOff>" + Math.round(anchors[i].top * 9525) + "</xdr:rowOff>" +
    "</xdr:from>" +
    "<xdr:to>" +
    "<xdr:col>" + anchors[i].col + "</xdr:col>" +
    "<xdr:colOff>" + Math.round((anchors[i].width + anchors[i].left) * 9525) + "</xdr:colOff>" +
    "<xdr:row>" + anchors[i].row + "</xdr:row>" +
    "<xdr:rowOff>" + Math.round((anchors[i].height + anchors[i].top) * 9525) + "</xdr:rowOff>" +
    "</xdr:to>" +
    "<xdr:pic>" +
    "<xdr:nvPicPr>" +
    '<xdr:cNvPr id="' + (i + 1) + '" name="Picture ' + (i + 1) + '"/>' +
    "<xdr:cNvPicPr>" +
    '<a:picLocks noChangeAspect="1" noChangeArrowheads="1"/>' +
    "</xdr:cNvPicPr>" +
    "</xdr:nvPicPr>" +
    "<xdr:blipFill>" +
    '<a:blip xmlns:r="' + this.XMLNS_OFFICEDOC_RELS + '" r:embed="rId' + (anchors[i].rel + 1) + '">' +
    "</a:blip>" +
    "<a:srcRect/>" +
    "<a:stretch>" +
    "<a:fillRect/>" +
    "</a:stretch>" +
    "</xdr:blipFill>" +
    '<xdr:spPr bwMode="auto">' +
    "<a:xfrm>" + // Note: Excel adds some "a" tags to xfrm. Omitting them seems fine.
    "</a:xfrm>" +
    '<a:prstGeom prst="rect">' +
    "<a:avLst/>" +
    "</a:prstGeom>" +
    "<a:noFill/>" +
    "</xdr:spPr>" +
    "</xdr:pic>" +
    "<xdr:clientData/>" +
    "</xdr:twoCellAnchor>";
  }
  xml += "</xdr:wsDr>";
  return xml;
};

/**
 * Returns XML text for drawing1.xml.rels
 * @returns {String}
 */
pui.xlsx_drawing.prototype.getDrawingRelsXML = function() {
  var xml = this.XMLSTART +
  '<Relationships xmlns="' + this.XMLNS_PACKAGE_RELS + '">';
  for (var i = 0; i < this.rels.length; i++) {
    xml += '<Relationship Id="rId' + (i + 1) + '" Type="' + this.XMLNS_OFFICEDOC_RELS + '/image" Target="../media/' + this.rels[i].name + '"/>';
  }
  xml += "</Relationships>";
  return xml;
};

/**
 * Download the images into this drawing object, then execute a callback.
 * @param {Function} cbFinished       Runs when all images are loaded into blobs.
 * @param {Object} feedbackObj        An object with the setDownloadStatus function.
 */
pui.xlsx_drawing.prototype.loadImages = function(cbFinished, feedbackObj) {
  if (this.rels.length < 1) { // It's possible image URLs didn't parse, but don't stop the download. #5342.
    cbFinished();
    return;
  }

  this.dlcount = 0;
  this.feedbackObj = feedbackObj;
  var checkDone = this._checkDone.bind(this);
  this.cbFinished = cbFinished;

  // Make XHRs for each image, downloading all asynchronously.
  for (var i = 0; i < this.rels.length; i++) {
    this.rels[i].xhr = new XMLHttpRequest();
    this.rels[i].xhr.open("GET", this.rels[i].uri, true);
    this.rels[i].xhr["responseType"] = "blob";
    this.rels[i].xhr.onload = checkDone;
    this.rels[i].xhr.send();
  }
};

/**
 * Handler for XMLHTTPRequest.onload. Waits until all requests are finished, moves the images to rel[i].image, then calls callback.
 */
pui.xlsx_drawing.prototype._checkDone = function() {
  this.dlcount++;
  if (this.feedbackObj && typeof this.feedbackObj.setDownloadStatus == "function") {
    this.feedbackObj.setDownloadStatus(pui["getLanguageText"]("runtimeMsg", "downloading x", [Math.round(100 * (this.dlcount / this.rels.length)) + "%"]));
  }
  if (this.dlcount < this.rels.length) return; // Wait until all xhr's are finished.

  // All are finished, so extract the images.
  for (var i = 0; i < this.rels.length; i++) {
    if (this.rels[i].xhr.status == 200) this.rels[i].image = this.rels[i].xhr.response;
    this.rels[i].xhr = null;
    try {
      delete this.rels[i].xhr;
    }
    catch (exc) {}
  }
  this.cbFinished();
};

//
// end of xlsx_drawing class.
//

/**
 * Returns the column descriptions for a database file or SQL statement.
 * @param {Object} parm   object with "file" optionally "library", or "customSQL"
 * @param {Function} cb - gets called with the {request} object
 *
 *  **** IMPORTANT NOTE ******************************************
 *   The fields array returned for database file is different than
 *   the fields array returned for custom SQL statements.
 *  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *  Database File:
 *  Always returned: "field", "longName", "text", "type", "use", "canNull", "length"
 *  Conditionally: "decPos", "key", "generatedBy", "ccsid"
 *
 *  Custom SQL:
 *  Always returned: "DB2_COLUMN_NAME", "DB2_SYSTEM_COLUMN_NAME", "DB2_LABEL", "SQLTYPE",
 *                   "DATETIME_INTERVAL_CODE", "LENGTH", "PRECISION", "SCALE", "DB2_CCSID",
 *                   "DB2_COLUMN_GENERATED", "DB2_COLUMN_GENERATION_TYPE", "NULLABLE"
 *
 */
pui.getFieldDescriptions = function(parm, cb) {
  var url;
  var library = parm["library"] || "";
  var file = parm["file"] || "";
  var customSql = parm["customSql"] || "";
  var connection = parm["connection"] || "";
  if (context == "genie") url = getProgramURL("PUI0009101.PGM");
  if (context == "dspf") url = getProgramURL("PUI0009101.PGM", null, true); // use auth
  var request = new pui.Ajax(url);
  request["async"] = true;
  request["method"] = "post";
  request["postData"] = "file=" + encodeURIComponent(file);
  request["postData"] += "&library=" + encodeURIComponent(library);
  request["postData"] += "&customSql=" + encodeURIComponent(customSql);
  request["postData"] += "&connection=" + encodeURIComponent(connection);
  if (pui["isCloud"]) request["postData"] += "&workspace_id=" + pui.cloud.ws.id;

  if (pui.pjs_session_id) request["postData"] += "&AUTH=" + pui.pjs_session_id;
  else if (context == "genie") request["postData"] += "&AUTH=" + pui.appJob.auth;
  request["postData"] += "&context=" + context;
  request["suppressAlert"] = true;
  request["onready"] = cb;
  request.send();
};

/**
 *
 * Code to execute the "ondbload" event when data is loaded into a database-driven widget:
 *
 *    @param {String}  func - event code to run
 *    @param {boolean} success - boolean true/false whether load succeeded
 *    @param {Object}  widget - id of widget to pass to event
 *
 * @return {boolean} true if the event was executed successful, false otherwise
 *
 */
pui.executeDatabaseLoadEvent = function(func, success, widget) {
  // create a "de-obfuscated" copy of the global errors array.

  var myError = null;
  if (errors.length > 0) {
    var lastError = errors.length - 1;
    myError = {
      "operation": errors[lastError].operation,
      "id": errors[lastError].id,
      "text": errors[lastError].text,
      "text2": errors[lastError].text2
    };
  }

  // Run the event

  try {
    pui["temporary_property"] = myError;
    eval("var response = { success: arguments[1], id: arguments[2], error: pui.temporary_property };");
    var customFunction = eval(func);
    if (typeof customFunction == "function") {
      customFunction();
    }
  }
  catch (err) {
    pui.scriptError(err, "OndbLoad Error:\n");
    return false;
  }

  return true;
};

pui.scriptError = function(error, prefix) {
  var message;
  if (pui["alert script errors"] === false) {
    if (window.console && window.console.error) {
      if (error.stack) { // Stack is not available on IE < 10
        // FireFox does not include the error message in the first entry.
        message = error.stack.split("\n");
        if (message[0] != error.toString()) {
          message.splice(0, 0, error.toString());
        }
        message = message.join("\n");

        if (prefix != null) {
          message = prefix + message;
        }
        console.error(message);
      }
      else {
        message = error.toString();
        if (prefix != null) {
          message = prefix + message;
        }
        console.error(message);
      }
    }
  }
  else {
    message = error.message;
    if (prefix != null) {
      message = prefix + message;
    }
    pui.alert(message);
  }
};

pui.preFetchFontFiles = function() {
  // The preload font api is still not supported in every browser
  // One way to prefetch the icons is to make hidden divs that that
  // use the CSS classes so that the browser will automattically fetch
  // the icon files.
  var iconFileList = [
    "pui-material-icons",
    "pui-fa-icons",
    "blueprint-defaults",
    "office-copy-defaults"
  ];
  iconFileList.forEach(function(iconClass) {
    var div = document.createElement("div");
    div.innerText = "face";
    div.className = iconClass;
    div.style.visibility = "hidden";
    div.style.left = "-1000px";
    div.style.position = "absolute";
    document.body.appendChild(div);
  });
};

pui.fetchMonacoIntelliSenseLibraries = function() {
  if (pui["useAceEditor"] || pui["is_ie"] || pui["ie_mode"] <= 11) return;
  ["profoundjs.d.ts", "profoundui.d.ts"].forEach(function(file) {
    var url = "/profoundui/proddata/typings/" + file;
    var request = new pui.Ajax(url);
    request["async"] = true;
    request["headers"] = { "Content-Type": "text/plain" };
    request["overrideMimeType"] = "text/plain";
    request["suppressAlert"] = true;
    request["onsuccess"] = function(req) {
      var lib = req["getResponseText"]();
      if (lib) {
        // monaco/ace may not be loaded in the first check, so check again.
        if (!window["monaco"] || pui["useAceEditor"]) return;
        window["monaco"]["languages"]["typescript"]["javascriptDefaults"]["addExtraLib"](lib, file);
        window["monaco"]["languages"]["typescript"]["typescriptDefaults"]["addExtraLib"](lib, file);
      }
    };
    request["onfail"] = function(req) {
      console.error(req["getStatusMessage"]());
    };
    request.send();
  });
};

pui.getDefaultIconSets = function() {
  return [{
    "type": "material",
    "title": "Material Icons",
    "classList": {
      "": "pui-material-icons"
    }
  },
  {
    "type": "fontAwesome",
    "title": "Font Awesome Icons",
    "classList": {
      "brands": "pui-fa-brands-icons fa-",
      "solid": "pui-fa-solid-icons fa-",
      "regular": "pui-fa-regular-icons fa-"
    }
  }, {
    "type": "jQueryIcons",
    "title": "jQuery Mobile Icons",
    "classList": {
      "": "ui-icon ui-icon-"
    }
  }
  ];
};

pui.randomTextBoxName = function() {
  return Math.random().toString(36).replace(/[^a-z]+/g, "");
};

/**
 * A class that attaches a mousedown listener to an element. mouseup and mousemove get attached by mousedown. Used for moving and resizing.
 * Child classes inherit from this class and implement this.mousedown and this.mousemove.
 * @param {Object} params
 * @constructor
 */
pui.MouseListener = function(params) {
  this.x = this.y = this.cursorStartX = this.cursorStartY = 0; // All zero. These can be used in callbacks.

  this.downcb = params.downcb; // optional Function. callback for mousedown.
  this.movecb = params.movecb; // optional Function. callback for mousemove.
  this.upcb = params.upcb; // optional Function. callback for mouseup.

  // attachto: element(s) to attach the mousedown. May be element or array of elements. Listener attaches to all.
  var attachto = params.attachto;
  if (attachto instanceof Array) {
    for (var i = 0; i < attachto.length; i++) {
      var attObj = attachto[i];
      attObj.addEventListener("touchstart", this);
      attObj.addEventListener("mousedown", this);
    }
  }
  else if (typeof attachto === "object" && attachto !== null) {
    attachto.addEventListener("touchstart", this);
    attachto.addEventListener("mousedown", this);
  }
};
pui.MouseListener.prototype = new pui.BaseClass(); // Inherit deleteOwnProperties

pui.MouseListener.prototype["handleEvent"] = function(e) {
  switch (e.type) {
    case "touchstart":
    case "mousedown":
      this._start(e);
      break;

    case "touchmove":
    case "mousemove":
      this._mousemove(e);
      break;

    case "touchend":
      // this._touchend(e);
      // break;
    case "mouseup":
      this._stop(e);
      break;
  }
};

pui.MouseListener.prototype.mousedown = function() {}; // Child classes can implement this.
/**
 * Store the mouse pointer's starting position, register other listeners, call callbacks.
 * @param {MouseEvent} e
 */
pui.MouseListener.prototype._start = function(e) {
  preventEvent(e); // prevent selection start.
  var xy = pui.getMouseXY(e);
  this.cursorStartX = xy.x;
  this.cursorStartY = xy.y;
  this.mousedown();

  document.addEventListener("touchmove", this);
  document.addEventListener("mousemove", this);

  document.addEventListener("touchend", this);
  document.addEventListener("mouseup", this);

  if (typeof this.downcb === "function") this.downcb(this);
};

pui.MouseListener.prototype.mousemove = function() {}; // Child classes can implement this.
/**
 * Store the mouse pointer's current position and call callbacks.
 * @param {MouseEvent} e
 */
pui.MouseListener.prototype._mousemove = function(e) {
  var xy = pui.getMouseXY(e);
  this.x = xy.x;
  this.y = xy.y;
  this.mousemove();

  if (typeof this.movecb === "function") this.movecb(this);
};

pui.MouseListener.prototype.mouseup = function() {}; // Child classes can implement this.
/**
 * Remove event listeners for mousemove and mouseup, call callback.
 */
pui.MouseListener.prototype._stop = function() {
  document.removeEventListener("touchmove", this);
  document.removeEventListener("mousemove", this);

  document.removeEventListener("touchend", this);
  document.removeEventListener("mouseup", this);

  if (typeof this.upcb === "function") this.upcb(this);
  this.mouseup();
};
// end MouseListener class.

/**
 * Enables moving an Element. This class makes the screen or container border out of bounds for mouse movements handled.
 * Opacity of the Element, if specified, is set on mousedown and cleared on mouseup.
 * Inherits from pui.MouseListener.
 * @param {Object} params
 * @param {Object|undefined} bounds  If defined, can specify left, top, right, and bottom boundaries. (Input|Ouput)
 *   Any missing or invalid properties are set. As a referenced object, bounds can be changed after constructing the MoveListener.
 * @constructor
 * @returns {pui.MoveListener}
 */
pui.MoveListener = function(params, bounds) {
  pui.MouseListener.call(this, params); // Assigns downcb, movecb, upcb; adds mousedown listener.
  this.moveEl = params.move; // Element to move by setting its .style.top and .style.left. Or Element to resize by setting its .style.height and/or .style.width.
  this.opacity = params.opacity; // optional Number (integer). Default no change. When set, change the percent opacity of the opEl
  // element to this value from mousedown until mouseup.
  if (typeof bounds == "object" && bounds !== null) {
    if (typeof bounds.left !== "number") bounds.left = 0;
    if (typeof bounds.top !== "number") bounds.top = 0;
    if (typeof bounds.right !== "number") bounds.right = Infinity; // defaults to no bounds.
    if (typeof bounds.bottom !== "number") bounds.bottom = Infinity; // defaults to no bounds.
    this._bounds = bounds;
  }
  else {
    this._bounds = { left: 0, top: 0, right: Infinity, bottom: Infinity };
  }
};
pui.MoveListener.prototype = Object.create(pui.MouseListener.prototype);

/**
 * Implements mousedown for MouseListener. Stores the starting positions of the Element being moved.
 */
pui.MoveListener.prototype.mousedown = function() {
  this.startX = this.moveEl.offsetLeft;
  this.startY = this.moveEl.offsetTop;

  if (typeof this.opacity === "number") {
    this.moveEl.style.opacity = "0." + this.opacity;
  }
};

/**
 * Move the element, but prevent its left and top from going past the bounds--off screen or out of container.
 * Implements mousemove for MouseListener.
 */
pui.MoveListener.prototype.mousemove = function() {
  var newx = this.startX + this.x - this.cursorStartX;
  var newy = this.startY + this.y - this.cursorStartY;
  if (newx < this._bounds.left) newx = this._bounds.left;
  if (newy < this._bounds.top) newy = this._bounds.top;
  // Prevent the right border of the element from going out of bounds, not just the element's top-left corner.
  if (newx > this._bounds.right - this.moveEl.offsetWidth) newx = this._bounds.right - this.moveEl.offsetWidth;
  if (newy > this._bounds.bottom - this.moveEl.offsetHeight) newy = this._bounds.bottom - this.moveEl.offsetHeight;

  this.moveEl.style.left = newx + "px";
  this.moveEl.style.top = newy + "px";
};

pui.MoveListener.prototype.mouseup = function() {
  if (typeof this.opacity === "number") {
    this.moveEl.style.opacity = "";
  }
};
// end MoveListener class.

/**
 * Enables moving an Element. This class overrides mousemove on MouseListener so elements can drag partially off-screen.
 * Inherits from pui.MoveListener.
 * @param {Object} params
 * @param {Object|undefined} bounds
 * @constructor
 * @returns {pui.MoveListenerBoundAtClick}
 */
pui.MoveListenerBoundAtClick = function(params, bounds) {
  pui.MoveListener.call(this, params, bounds);
};
pui.MoveListenerBoundAtClick.prototype = Object.create(pui.MoveListener.prototype);

// Move the element, but prevent the part where the mouse was clicked from going past the bounds; e.g. Panel gets dragged partially off screen.
pui.MoveListenerBoundAtClick.prototype.mousemove = function() {
  if (this.x < this._bounds.left) this.x = this._bounds.left;
  if (this.y < this._bounds.top) this.y = this._bounds.top;
  if (this.x > this._bounds.right) this.x = this._bounds.right;
  if (this.y > this._bounds.bottom) this.y = this._bounds.bottom;

  this.moveEl.style.left = (this.startX - this.cursorStartX + this.x) + "px";
  this.moveEl.style.top = (this.startY - this.cursorStartY + this.y) + "px";
};
// end MoveListenerBoundAtClick class.

/**
 * Allow an element to be resized with the mouse. Inherits from pui.MouseListener.
 * @param {Object} params   required properties apart from those required from pui.MouseListener: resize,
 * @constructor
 * @returns {pui.MouseResizable}
 */
pui.MouseResizable = function(params) {
  pui.MouseListener.call(this, params); // Assigns downcb, movecb, upcb; adds mousedown listener.
  this.minw = (typeof params.minw == "number" && params.minw > 0) ? params.minw : 0; // optional. default to 0. Minimum width.
  this.minh = (typeof params.minh == "number" && params.minh > 0) ? params.minh : 0; // optional. default to 0. Minimum height.
  this.maxw = params.maxw; // optional. default to no bounds. Maximum width.
  this.maxh = params.maxh; // optional. default to no bounds. Maximum height.

  // Required: either resizeEl, or resizeHeightEl, or _resizeWidthEl.
  // Allowing two different objects for with and height allows two elements to be adjusted on resize.
  if (typeof params.resizeEl === "object" && params.resizeEl !== null) {
    this._resizeHeightEl = params.resizeEl;
    this._resizeWidthEl = params.resizeEl;
  }
  if (typeof params.resizeHeightEl === "object" && params.resizeHeightEl !== null) {
    this._resizeHeightEl = params.resizeHeightEl;
  }
  if (typeof params.resizeWidthEl === "object" && params.resizeWidthEl !== null) {
    this._resizeWidthEl = params.resizeWidthEl;
  }

  // Private
  var resize = (typeof params.resize == "number" && params.resize >= 1 && params.resize <= 3) ? params.resize : 1; // 1=width (default), 2=height, 3=both.
  this._doWidth = (resize & 1) == 1; // true for 1 or 3.
  this._doHeight = (resize & 2) == 2; // true for 2 or 3.
};
pui.MouseResizable.prototype = Object.create(pui.MouseListener.prototype);

/**
 * Implements mousedown for MouseListener. Set the starting X and Y on the resize element's offset width and height.
 */
pui.MouseResizable.prototype.mousedown = function() {
  this.startX = this._resizeWidthEl.offsetWidth;
  this.startY = this._resizeHeightEl.offsetHeight;
};

/**
 * Implements mousemove for MouseListener. Change the width and or height of the resizable element.
 */
pui.MouseResizable.prototype.mousemove = function() {
  if (this._doWidth) {
    var width = this.startX + this.x - this.cursorStartX;
    if (width < this.minw) width = this.minw;
    if (typeof this.maxw === "number" && width > this.maxw) width = this.maxw;
    this._resizeWidthEl.style.width = width + "px";
    this.width = width; // Can be used in movecb.
  }
  if (this._doHeight) {
    var height = this.startY + this.y - this.cursorStartY;
    if (height < this.minh) height = this.minh;
    if (typeof this.maxh === "number" && height > this.maxh) height = this.maxh;
    this._resizeHeightEl.style.height = height + "px";
    this.height = height; // Can be used in movecb.
  }
};
// end of MouseResizable class.

// Update React or Vue state
pui.updateReactState = function(dom) {
  if ((window["React"] || window["Vue"]) && dom != null && dom.pui && dom.pui.data && dom.pui.dataProp) {
    var els = {};
    els[dom.pui.dataProp] = [dom];
    var response = pui.buildResponse(els);
    dom.pui.data[dom.pui.dataProp] = response[dom.pui.dataProp];
  }
};

pui.setModified = function(e, formatName) {
  var target;
  if (context == "dspf") {
    if (!pui.screenIsReady) return;
    target = getTarget(e);

    // Don't set modified when target is ready only
    if (target.pui && target.pui.properties["read only"] === "true") {
      return;
    }

    target.modified = true;
    if (target.parentNode != null && (target.parentNode.comboBoxWidget != null || target.parentNode.floatingPlaceholder != null)) {
      target = target.parentNode;
      target.modified = true;
    }
    pui.modified = true;
    if (target.id != null && target.id.indexOf(".") == -1 && formatName) {
      // not a subfile field being modified
      pui.ctlRecModified[formatName] = true;
    }

    if ((window["React"] || window["Vue"]) && target.pui.data && target.pui.dataProp) {
      setTimeout(function() { // allow the change to take affect before caputring the value
        pui.updateReactState(target);
      }, 0);
    }
  }
  else {
    // This check is here because the 'onchange' event on entry fields fires in Chrome
    // when the pui.runtimeContainer contents are cleared.
    // That causes input from prior screen to get put into response object!
    // -- DR
    if (!pui.genie.rendered) return;
    target = getTarget(e);
    if (target == null) return;
    var fieldInfo = target.fieldInfo;
    if (fieldInfo == null) return;
    var idx = fieldInfo["idx"];
    if (idx == null) return;
    idx = String(idx);
    if (target.guiIndex != null) idx = "s" + idx + "." + target.guiIndex;
    pui.response[idx] = target;

    // Allow SNGCHCFLD radio buttons to be unchecked if allowRadioClear is set true.
    if (target.type == "radio" && pui["genie"]["allowRadioClear"] && target.className.indexOf("selection-field-single") >= 0) {
      if (e.type == "click") {
        // Delay handling until after "change" so we can know the field just changed. Not all browsers
        // fire click before change, so the timeout also makes this approach cross-browser safe.
        setTimeout(function() {
          if (pui["ie_mode"] == 8 && target.checked != target.puiinitial) target.justChanged = true;
          if (target.checked && !target.justChanged) target.checked = false;
          target.justChanged = false;
        }, 0);
      }
      else if (e.type == "change") {
        target.justChanged = true;
      }
    } // done special handling of SNGCHCFLD.
  }
};

pui.dupKey = function(event) {
  var key = event.keyCode;
  if (key == pui["dup"]["keyCode"]) {
    if (pui["dup"]["shift"] && !event.shiftKey) return;
    if (pui["dup"]["ctrl"] && !event.ctrlKey) return;
    if (pui["dup"]["alt"] && !event.altKey) return;
    var target = getTarget(event);
    var value = target.value;
    var maxLen = target.maxLength;
    if (maxLen == null) maxLen = 0;
    maxLen = Number(maxLen);
    if (isNaN(maxLen)) maxLen = 0;
    var pos = getCursorPosition(target);
    if (pos < 0) pos = 0;
    value = value.substr(0, pos);
    while (value.length < pos) {
      value += " ";
    }
    while (value.length < maxLen) {
      value += pui["dup"]["char"];
    }
    target.value = value;
    pui.setModified(event);
    pui.gotoNextElementAndPossiblySelect(target);
    preventEvent(event);
    return false;
  }
};

pui.isDup = function(parm) {
  var value = "";
  if (typeof parm == "string") value = parm;
  if (typeof parm == "object") value = parm.value;
  if (value == null) value = "";
  if (typeof value != "string") value = String(value);
  return (value.indexOf(pui["dup"]["char"]) != -1);
};

/**
 * Ensure that a config option is a regular expression and global, if necessary. Patterns can be string or RegExp. #5078.
 * @param {String|RegExp} stringOrObj   From a configuration option for regular expressions; e.g. pui["special key pattern"].
 * @param {Boolean|undefined} forceGlobal  If true, then the pattern is forced to use global match.
 * @returns {RegExp|Boolean}  Returns false if argument was not a regular expression.
 */
pui.ensureRegExFrom = function(stringOrObj, forceGlobal) {
  var regex = stringOrObj;
  if (typeof stringOrObj === "string" && stringOrObj.length > 0) {
    var flags = forceGlobal ? "ig" : "i";
    regex = new RegExp(stringOrObj, flags);
  }

  if (typeof regex === "object" && regex instanceof RegExp) {
    if (forceGlobal && !regex.global) {
      regex = new RegExp(regex.source, "ig"); // Pattern must be global.
    }
  }
  else {
    regex = false;
  }
  return regex;
};

/**
 * Replace characters that cause problems being made upper-case and lower-case. When toLower is true, replace all upper-case eszett ẞ
 * (U+7838, \u1E9E) in a string with lower-case eszett ß (U+223, \u00DF). Do the reverse when toLower is false. Issue 5369.
 * @param {String|Null} str
 * @param {Boolean} toLower   When true, the function is preparing screen input for the response. When false, server output is prepared for display.
 * @returns {String}
 */
pui.replaceProblemCaseChars = function(str, toLower) {
  if (str == null) return str;
  return toLower ? str.replace(/\u1E9E/g, "\u00DF") : str.replace(/\u00DF/g, "\u1E9E");
};

/**
 * Uppercase a string EXCEPT the lowercase ß eszett character. EBCDIC processing on server (e.g. PUI0001113)
 * does NOT support the uppercase ẞ eszett character. See issue 6715.
 * @param {String|Null} str
 * @returns {String}
 */
pui.upperCaseExceptEszett = function(str) {
  if (str == null) return str;
  var parts = str.split("ß");
  if (parts.length <= 1) {
    return str.toUpperCase();
  }
  for (var i = 0; i < parts.length; i++) {
    parts[i] = parts[i].toUpperCase();
  }
  return parts.join("ß");
};

/**
 * Listener for input events on a couple of Genie input elements.
 * Ensure typed or pasted ß characters become the upper-case version to avoid becomming "SS". Issue 5369. See also 5785 for test cases.
 * @param {Object} e
 */
pui.onProblemInput = function(e) {
  if (e.target.value.match(/\u00DF/)) {
    // Only adjust the value if the target matches ß. Avoid IE11 in Win7-8 focus jumping bug. Issue 5785.
    var cursorOrigPosition = e.target.selectionStart;
    e.target.value = pui.replaceProblemCaseChars(e.target.value, false);
    if (pui["is_ie"]) {
      // position the cursor to the original cursor position. Needed for Windows 7-8. Issue 5785.
      e.target.setSelectionRange(cursorOrigPosition, cursorOrigPosition);
    }
  }
};

/*
 * Return a number representing units of change for a mouse wheel's Y value, returning the same number for different browser implementations of wheel.
 * @param {Object} event
 * @returns {Number}
 */
pui.normalizeWheelDelta = function(event) {
  var delta = 0;
  if (pui["is_firefox"]) {
    // In Firefox, deltaY is negative = wheel pushed forward/up, positive = wheel pulled back/down. Different versions use different
    // deltaMode values; deltaY is different depending on the mode. (v88 uses different modes depending on debugging or console logging.)
    if (event.deltaMode == 0) {
      delta = Math.round(event.deltaY / 48); // Sometimes the deltaY is 48, sometimes it is 51, so we must round.
    }
    else if (event.deltaMode == 1) {
      delta = event.deltaY / 3; // Firefox version 87 and older use deltaMode 1 where I have seen. v88 also sometimes uses deltaMode 1. #6802.
    }
  }
  else if (pui["is_ie"]) {
    if (event.wheelDelta) {
      delta = event.wheelDelta / -120; // The event is a deprecated MouseWheel instead of the recommened standard, WheelEvent. Sign is reversed.
    }
    else {
      // IE10-11, deltaY is multiple of 144.3000030517578, same sign as Firefox.   deltaMode: 0.
      // Edge, deltaY is multiple of 144.4499969482422, same sign as Firefox. deltaMode: 0. also has "wheelDeltaY": 120.
      delta = event.deltaY / 144;
    }
  }
  else if (pui["is_edge"] && event.wheelDelta) {
    delta = event.wheelDelta / -120; // Chromium Edge is different than Chrome or pre-Chromium Edge. #6182.
  }
  else if (pui["is_chrome"]) {
    // Chrome, deltaY is multiple of 100, same sign as Firefox.    deltaMode: 0.
    delta = event.deltaY / 100;
  }
  else if (pui["is_safari"]) {
    // Safari, deltaY is multiple of 4.000244140625, same sign as Firefox. deltaMode: 0. also has "wheelDeltaY": 12.
    delta = event.deltaY / 4;
  }
  else if (typeof event.deltaY == "number" && (event.deltaY > 0 || event.deltaY < 0)) {
    if (event.wheelDelta) { // Browser is Opera.
      delta = event.wheelDelta / 120;
    }
    else {
      delta = event.deltaY / event.deltaY; // Handle other, let value be either +1 or -1. Assume sign is same as other browsers.
    }
  }
  return delta;
};

/**
 * Format the byte size using the most relevant units.
 * @param {Number} bytes
 * @param {Number|String} precision
 * @returns {String}
 */
pui.formatBytes = function(bytes, precision) {
  var units = ["B", "KB", "MB", "GB", "TB"];
  bytes = Math.max(bytes, 0);
  var pow = Math.floor((bytes ? Math.log(bytes) : 0) / Math.log(1024));
  pow = Math.min(pow, units.length - 1);
  bytes = bytes / Math.pow(1024, pow);
  precision = (typeof (precision) == "number" ? precision : 0);

  return (Math.round(bytes * Math.pow(10, precision)) / Math.pow(10, precision)) + " " + units[pow];
};

/**
 * For events on HTML table cells, get the parent row. If the event is not on the cell (e.g. on an input in the cell), returns null.
 * Pre-Requisite: the event listener should be attached to a TR element.
 * @param {Object|Event} event
 * @returns {Object|Null}
 */
pui.getTRtargetRow = function(event) {
  // Note: we must use getTarget to handle #text nodes. Otherwise drag_leave leaves classes set when dragging quickly.
  var target = getTarget(event);
  if (target.tagName == "TD") target = target.parentNode;
  if (target.tagName != "TR") return null;
  return target;
};

pui["getDatabaseConnections"] = function() {
  if (pui["isCloud"] && inDesignMode()) {
    var connections = Array.isArray(pui.cloud.ws["settings"]["databaseConnections"]) ? pui.cloud.ws["settings"]["databaseConnections"].slice() : [];
    var workspaceConnection = { "name": "workspace", "driver": "mysql" };
    var defaultFound = false;
    for (var i = 0; i < connections.length; i++) {
      if (connections[i]["default"] === true) {
        defaultFound = true;
        break;
      }
    }
    if (!defaultFound) {
      workspaceConnection["default"] = true;
    }
    connections.splice(0, 0, workspaceConnection);
    return connections;
  }
  else {
    return pui["databaseConnections"];
  }
};

pui.getDatabaseConnection = function(name) {
  var connections = pui["getDatabaseConnections"]();
  if (!connections) {
    return;
  }
  if (typeof name === "string") {
    name = trim(name);
  }
  for (var i = 0; i < connections.length; i++) {
    var connection = connections[i];
    if ((!name && connection["default"] === true) || connection["name"] === name) {
      return connection;
    }
  }
};

pui["getVersionComparer"] = function() {
  var getVersionParts = function(version) {
    version = version || "0.0.0";

    if (version && typeof version !== "string") {
      version = version.toString();
    }

    return version.split(".");
  };
  var makeMatching = function(version1, version2) {
    var ver1 = getVersionParts(version1);
    var ver2 = getVersionParts(version2);

    // Now compare lengths of each part, and left zero pad the shorter segments
    for (var i = 0; i < ver1.length; i++) {
      if (ver2.length - 1 < i) break;

      var len1 = ver1[i].length;
      var len2 = ver2[i].length;
      if (len1 > len2) {
        ver2[i] = "0".repeat(len1 - len2) + ver2[i];
      }
      if (len2 > len1) {
        ver1[i] = "0".repeat(len2 - len1) + ver1[i];
      }
    }

    return [
      ver1.join("."),
      ver2.join(".")
    ];
  };

  return {
    "isLessThan": function(version1, version2) {
      // Create version strings with the same size segments
      var versions = makeMatching(version1, version2);

      return versions[0] < versions[1];
    }
  };
};

pui["newUUID"] = function() {
  var d = new Date().getTime();

  if (window["performance"] && typeof window["performance"]["now"] === "function") {
    d += window["performance"]["now"]();
  }

  var value = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });

  return value;
};

/**
 * Tell each child of the container that its parent container resized. (Used by pui.resize, pui.ide.doBodyResize, and Layout)
 * Tells layouts (and their child elements by recursion) that they should size. Layout elements can only be inside the runtime
 * container, canvas, or other layouts; calling .stretch() recursively stretches other layouts; thus, resizeChildrenOf affects all
 * layouts via recursive Depth-First tree traversal.
 * @param {Element} container             A Designer canvas or the runtimeContainer.
 * @param {undefined|Boolean} inLayout    When true, container belongs to a layout.
 */
pui.resizeChildrenOf = function(container, inLayout) {
  if (container == null) return;
  var childNodes = container.childNodes;
  var child; var m = childNodes.length;
  for (var j = 0; j < m && (child = childNodes[j]); j++) {
    var layout = child.layout;
    if (layout != null) {
      if (layout.assignHeightOnResize == true) layout.assignHeights(true); // A top-most layout in cordova+iOS with 100% height needs extra work.

      layout.resize(); // Tell the layout to update any of its own dimension-dependant styles, then recursively stretch, size children, etc.
    }
    // Non-layout widgets may need to be sized because they have percent-based dimensions or because they just became visible.
    else if (typeof child.sizeMe == "function") {
      // Always size some things regardless of dimension units. Date fields, charts ...
      var alwaysSizeMe = (child.alwaysSizeMe === true || (inLayout && child.grid != null));

      if (alwaysSizeMe || pui.isPercent(child.style.width) || pui.isPercent(child.style.height)) child.sizeMe();
    }
  }
};

/**
 * Causes session timeout and displays timeout screen.
 * Used by pui["client side timeout"] and Atrium session timeout management.
 */
pui["doSessionTimeout"] = function() {
  hide_calendar();
  function showMessage(container) {
    document.body.style.backgroundColor = "#ffffff";
    document.body.style.backgroundImage = "none";
    pui.clearChildNodes(container);
    container.innerHTML = '<div style="font-family: Trebuchet MS; width: 95%; text-align: center; font-size: 200%;"><br/>' +
                              pui["getLanguageText"]("runtimeMsg", "session timed out") + "</div>";
  }
  showMessage(pui.runtimeContainer);
  pui.showWaitAnimation();
  var url = getProgramURL("PUI0001200.pgm"); // handler
  if (pui.genie != null) {
    url = getProgramURL("PUI0002110.pgm"); // 5250 session controller
  }
  if (pui.psid != null && pui.psid != "") url += "/" + pui.psid;
  var ajaxParams = {
    "timeout": "1"
  };
  if (pui["isCloud"]) {
    ajaxParams["workspace_id"] = pui.cloud.ws.id;
  }
  ajaxJSON({
    "url": pui.addRequestId(url),
    "method": "post",
    "sendAsBinary": false,
    "suppressAlert": true,
    "params": ajaxParams,
    "handler": function(response) {
      if (pui.genie != null) {
        // When used outside of Genie, the 'onload' processing in the
        // time out screen will handle these flags.
        pui.confirmOnClose = false;
        pui.shutdownOnClose = false;
        showMessage(document.body);
      }
      else {
        // render time out screen from PUISCREENS
        response.container = pui.runtimeContainer;
        pui.handler = function() { };
        pui.render(response);
      }
      if (pui["ontimeout"] != null && typeof pui["ontimeout"] == "function") {
        pui["ontimeout"]();
      }
      if (pui.genie != null && pui.genie["close atrium tab on timeout"] == true) {
        if (window.parent != window && pui.checkForAtrium(window.parent)) {
          window["Atrium"]["closeTab"]();
        }
      }
    },
    "onfail": function(req) {
      showMessage(document.body);
    }
  });
};

/**
 * Get a storage key from screen rendering parameters.
 * @param {Object} screenParms  Argument passed to pui.renderFormat.
 * @param {String} prefix       e.g. "pui-lyt-", "pui-grid-", ...
 * @returns {String}
 */
pui.getStorageKey = function(screenParms, prefix) {
  var storageKey = "";

  if (typeof pui["view"] != "undefined") {
    storageKey = prefix + pui["view"];
  }
  else if (screenParms != null && typeof screenParms["file"] == "string" && typeof screenParms["library"] == "string") {
    storageKey = prefix + screenParms["library"] + "-" + screenParms["file"] + "-" + screenParms["name"];
  }

  return storageKey;
};

/**
 * Capture server's response into test recording
 * @param {Object} parms  5250 or Rich Display parms
 */
pui.record = function(parms) {
  pui.recording["responses"].push(JSON.parse(JSON.stringify(parms)));
};

/**
 * Create recording replay user interface with arrows for advancing screens
 */
pui.createReplayUI = function() {
  function advance(increment) {
    var stepNumber = pui.replayStep + increment;
    if (!pui.replay["payloads"][stepNumber - 1]) return false;
    var container = pui.replay.container;
    var parms = pui.replay["payloads"][stepNumber - 1]["response"];
    parms = JSON.parse(JSON.stringify(parms));
    parms.container = container;
    pui.replayStep = stepNumber;
    step.innerHTML = "Step " + stepNumber;
    if (parms["5250"]) {
      context = "genie";
      pui.render5250(parms);
    }
    else {
      context = "dspf";
      pui.render(parms);
    }
  }

  var prev = document.createElement("span");
  prev.classList.add("pui-material-icons");
  prev.innerHTML = "keyboard_arrow_left";
  prev.onclick = function() {
    advance(-1);
  };

  var step = document.createElement("span");
  step.classList.add("pui-replay-step");
  step.innerHTML = "Step " + pui.replayStep;

  var next = document.createElement("span");
  next.classList.add("pui-material-icons");
  next.innerHTML = "keyboard_arrow_right";
  next.onclick = function() {
    advance(+1);
  };

  var replayDiv = document.createElement("div");
  replayDiv.classList.add("pui-replay");
  replayDiv.appendChild(prev);
  replayDiv.appendChild(step);
  replayDiv.appendChild(next);
  document.body.appendChild(replayDiv);
};

/**
 * Adds unique identifier to a request URL.
 * @param {String} url
 */
pui.addRequestId = function(url) {
  if (url.indexOf("?") === -1) {
    url += "?";
  }
  else {
    url += "&";
  }
  url += "pui-rid=" + pui["newUUID"]();
  return url;
};

/**
 ******************************************************************************
 * A wrapper class for handling connections to a WebSocket server and adding/removing socket events.
 * @constructor
 * @param {String} uri
 * @returns {pui.WebSocketClient}
 */
pui.WebSocketClient = function(uri) {
  this.uri = uri;
};

/**
 * Connect or reconnect to a socket and register listeners.
 */
pui.WebSocketClient.prototype.connect = function() {
  if (this.socket == null || this.socket.readyState === this.socket["CLOSED"] || this.socket.readyState === this.socket["CLOSING"]) {
    this.socket = new WebSocket(this.uri);
  }
  // else: nothing else needs to be done for OPEN or CONNECTING.

  this.socket.addEventListener("message", this);
  this.socket.addEventListener("error", this);
  this.socket.addEventListener("close", this);
  this.socket.addEventListener("open", this);
};

/**
 * Close the socket and cleanup.
 */
pui.WebSocketClient.prototype.disconnect = function() {
  if (this.socket) {
    if (this.socket.readyState === this.socket["OPEN"] || this.socket.readyState === this.socket["CONNECTING"]) this.socket.close();
    this.onCloseOrDisconnect();
  }
};

/**
 * Cleanup events and socket upon socket closing or disconnect.
 */
pui.WebSocketClient.prototype.onCloseOrDisconnect = function() {
  if (this.socket) {
    this.socket.removeEventListener("message", this);
    this.socket.removeEventListener("error", this);
    this.socket.removeEventListener("close", this);
    this.socket.removeEventListener("open", this);
    delete this.socket;
  }
};

/**
 * Handle close events. Child classes may override this.
 * @param {Event} event
 */
pui.WebSocketClient.prototype["handleEvent"] = function(event) {
  switch (event.type) {
    case "close":
      this.onCloseOrDisconnect();
  }
};

/**
 * Remove properties from a node itself, clear commonly added "on" event listeners, remove any attributes.
 * @param {Element} node
 */
pui.clearNode = function(node) {
  // Clear event properties that are commonly set (and are not "own"--are up the prototype chain).
  if (typeof node.onchange === "function") node.onchange = null;
  if (typeof node.onclick === "function") node.onclick = null;

  // Remove style, class, and other attributes to reduce memory leaks if the HTMLElement still remains.
  var attributes = node["attributes"];
  if (typeof attributes === "object" && attributes !== null) {
    while (attributes.length > 0) {
      var attr = attributes[0];
      attributes["removeNamedItem"](attr["name"]);
    }
  }

  // Remove any own, enumerable properties in case PUI added functions or references that prevent garbage collection.
  pui.BaseClass.prototype.deleteOwnProperties.apply(node);
};

/**
 * DFS function to remove all children of an element, but leave the element itself alone.
 * Use pui.clearChildNodes(dom) instead of dom.innerHTML = "" to avoid memory leaks of event listeners. (PJS-1110)
 * @param {Element} el
 */
pui.clearChildNodes = function(el) {
  if (el == null) return;

  var node = el.firstChild;
  while (typeof node === "object" && node !== null && node !== el) {
    if (typeof node.destroy === "function") {
      // Allow a destroy function to cleanup all nodes of a widget.
      try {
        node.destroy();
        node.destroy = null; // Avoid infinite loop in case destroy does not remove itself.
      }
      catch (err) {
        console.log(err);
      }
    }
    // Otherwise, clear the children here.
    else if (node.firstChild != null) {
      // The node has at least one child, so go to the first child.
      node = node.firstChild;
    }
    else {
      // There are no children of this node, so remove it.
      var parent = node.parentNode;
      parent.removeChild(node);

      pui.clearNode(node);

      // If there are more siblings, go to the next sibling. Otherwise, go to the parent.
      node = parent.firstChild != null ? parent.firstChild : parent;
    }
  }
};

/**
 * Track listeners added by code outside of a widget's file; e.g. renderFormat adds things not defined in each widget.
 * "this" may be an Element or a class instance.
 * Note: the name is quoted because Closure Compiler can otherwise assign the wrong function to nodes.
 * @param {String} name
 * @param {Function} f
 */
pui.trackEvent = function(name, f) {
  var el = this;
  if (typeof el === "object" && el !== null) {
    if (!Array.isArray(el.puievtlist)) el.puievtlist = [];
    el.puievtlist.push({ name: name, f: f });
  }
  el = null;
};

/**
 * Look for a "puievtlist" property, and detach all event listeners listed in it to reduce memory leaking.
 * Assume this is called by a .destroy() function.
 * @param {Object} obj  An Element or a class instance; should match what was "this" in pui.trackEvent.
 */
pui.removeEvents = function(obj) {
  if (Array.isArray(obj.puievtlist)) {
    while (obj.puievtlist.length > 0) {
      var el = obj.puievtlist.pop();
      if (typeof el === "object" && el !== null) {
        obj.removeEventListener(el.name, el.f);
        delete el.name;
        delete el.f;
      }
    }
    delete obj.puievtlist;
  }
};

/**
 * Re-usable function in simple widgets that assumes the "field type" field setter has assigned:
 * dom.puiTrackEvent = pui.trackEvent;
 * dom.destroy = pui.basicDestroy;
 * This allows event listeners assigned in render.js to be removed to allow garbage collection.
 * Pre-condition: "this" is the dom element, because the function is assigned to that element.
 */
pui.basicDestroy = function() {
  try {
    var el = this;
    if (typeof el === "object" && el !== null) {
      pui.removeEvents(el);
      pui.clearChildNodes(el);
      pui.clearNode(el);
    }
    el = null;
  }
  catch (err) {
    console.log(err);
  }
};
