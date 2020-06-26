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
  


function getTarget(e) {
  var targ;
  if (!e) e = window.event;
  if (e.touches != null && e.touches.length == 1) {  // detect touch screen device like iPad
    return e.touches[0].target;
  }
  if (e.target) targ = e.target;
  else if (e.srcElement) targ = e.srcElement;
  if (targ.nodeType == 3) // defeat Safari bug
    targ = targ.parentNode;
  return targ;
}

function preventEvent(event) {
  if (!event) event = window.event;
  if (window.event) {
    window.event.cancelBubble = true;
    window.event.returnValue = false;
  }
  if (event.preventDefault) {
    event.cancelBubble = true;
    event.preventDefault();
  }
}


// IE cannot reliably get elements by name when the element is created/modified with javascript
// The following types of statements do not work reliably in IE6 or IE7: 
//   document.forms[formName].elements[elemName]
//   document.getElementsByName(elemName)
// This is a known IE bug. The following is a workaround:
function getElementByName_iefix(elemName) {
  var form = document.forms["main"];
  var n = form.length;
  for(var i = 0; i < n; i++ ) {
    var obj = form.elements[i];
    if (obj.name == elemName) {
      return obj;
    }
  }
  return null;
}


function disableAction(e){
  if(pui["is_old_ie"] && pui["ie_mode"] >= 5){
    e.cancelBubble = true;
    e.returnValue = false;
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
  }
  else{
    e.preventDefault();
    e.stopPropagation();
  }
}

function preventDoubleSubmit(){

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
      catch(err) {
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
    cursorPos -= 1;  // set to last character
  }
  document.getElementById('cursorPos').value = cursorPos;
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
function numericOnly(e){
  if(!e) e = window.event;
  var target = e.srcElement || e.target;
  if (target.autoComp != null) return;
  var allowedUnicodes = new Array(8,9,13,16,17,18,19,20,27,33,34,35,36,37,38,39,40,45,46,48,49,50,51,52,53,54,55,56,57,91,93,96,97,98,99,100,101,102,103,104,105,112,123,144,145,112,113,114,115,116,117,118,119,120,121,122,123);
  allowKeys(allowedUnicodes, e);
}
function numericDecimalOnly(e){
  if(!e) e = window.event;
  var target = e.srcElement || e.target;
  if (target.autoComp != null) return;  
  var allowedUnicodes = new Array(8,9,13,16,17,18,19,20,27,32,33,34,35,36,37,38,39,40,45,46,48,49,50,51,52,53,54,55,56,57,91,93,96,97,98,99,100,101,102,103,104,105,110,112,123,144,145,188,190,112,113,114,115,116,117,118,119,120,121,122,123,189,109);
  allowKeys(allowedUnicodes, e);
}
function numericSignOnly(e){
  if(!e) e = window.event;
  var target = e.srcElement || e.target;
  if (target.autoComp != null) return;  
  var allowedUnicodes = new Array(8,9,13,16,17,18,19,20,27,33,34,35,36,37,38,39,40,45,46,48,49,50,51,52,53,54,55,56,57,91,93,96,97,98,99,100,101,102,103,104,105,109,112,123,144,145,112,113,114,115,116,117,118,119,120,121,122,123,189,pui["field exit key"]);
  allowKeys(allowedUnicodes, e);
}
function alphabeticOnly(e) {
  if(!e) e = window.event;
  var target = e.srcElement || e.target;
  if (target.autoComp != null) return;
  // As per 5250 manual, allow a-z, A-Z, comma, dot, hyphen, and space.  
  var allowedChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,.- ";
  var allowedUnicodes = new Array();
  for (var i = 0; i < allowedChars.length; i++) {
    allowedUnicodes.push(allowedChars.charCodeAt(i));
  }
  allowedUnicodes.push(8, 9, 13, 16, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 110);
  allowKeys(allowedUnicodes, e);
}
function inhibitKeyboard(e) {
  e = e || window.event;
  if (typeof e.keyCode != "undefined") { // onkeydown
    if (e.ctrlKey == true && e.keyCode == 86) {
      disableAction(e);
      return false;
    }
    var allowed = allowKeys([13,112,123,144,145,112,113,114,115,116,117,118,119,120,121,122,123], e);
    if (!allowed) {
      if (!pui.isFieldExit(e) && !e.shiftKey && !e.altKey && !e.ctrlKey && e.key.length == 1)
        pui.alert(pui["getLanguageText"]("runtimeMsg", "keyboard input inhibited"));
      return false;
    }
  }
  else { // oncontextmenu
    disableAction(e);
    return false;
  }
}

function defaultField(e){
  var allowedUnicodes = new Array(256);
  
  
  for(var i = 0; i <= 255; i++) {
    allowedUnicodes[i] = i; 
  } 
  
  if(!e) e = window.event;
  allowKeys(allowedUnicodes, e); 
}


function getCursorPosition(obj) { 
  var cur;
  if (typeof obj == "string") obj = getObj(obj);
  if (obj == null) return -1;
  if (obj.tagName != "INPUT" || !pui.isTextbox(obj)) return -1;
  if (document.selection!=null) {
    if (obj==null) obj = document.activeElement; 
    cur = document.selection.createRange(); 
  }
  var pos = 0; 
  if (obj!=null && cur!=null && obj.createTextRange!=null) {  // IE
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
    catch(e) {
      return -1;
    }
  } 
  else if (obj!=null) {  // Firefox
     try {
       if (obj.selectionStart!=null) return obj.selectionStart;
     }
     catch(err) { };
  }
  return -1; 
} 

/**
 * If in Visual Designer or in Genie with Design Mode on, then returns true; else false. Note: this must
 * be called after pui.dspfDesign(), after pui.loadDependencyFiles to correctly detect Visual Designer.
 * @returns {Boolean}
 */
function inDesignMode() {
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
  var error   = "";
  var error2  = "";
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
          error   = responseObj.errorText;
          error2  = responseObj.errorText2;
        }
      }
      catch(e) {
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
  if (label == null){
    designMode = false;
    var label = document.createElement("div");
    label.style.position = "absolute";
    label.style.borderStyle = "none";
    label.style.backgroundColor = "transparent";
  }
  
  label.innerHTML = '<label for="' + dom.id + '">' + labelText + '</label>';
  label.className = 'label-for';
  var cls = trim(dom.className.split(" ")[0]);
  if (cls != "")
    pui.addCssClass(label, 'label-for-' + cls);
  
  // get z-index from the original element
  if (dom.currentStyle) {
    label.style.zIndex = dom.currentStyle.zIndex;
  }
  else if (window.getComputedStyle) {
    label.style.zIndex = document.defaultView.getComputedStyle(dom, null).getPropertyValue("z-index");
  }
  else {
    label.style.zIndex = 20;  // default z-index for input fields
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

  if (!designMode){
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
    
    if (dom.parentNode != null)     //If a grid column was removed, then parentNode could be null. #4855.
      dom.parentNode.appendChild(label);  //If parentNode is null, then the element was added to the grid's runtimeChildren but not used. That's ok.
  }
  
  // Determine the X position. (Happens after appending child so that label width can be used for "right".)
  var width = dom.offsetWidth;
  if (width < 20) width = 20;
  
  if (dom.style.left != ""){
    if (dom.style.left.indexOf('calc') != -1) {
      // Add the input's width to a CSS calc function's parameters.
      setCalcString('left', ' + ' + width);
    }
    else {
      var styledim = pui.getStyleDim(dom.style.left);
      if (styledim[1] == 'px'){
        label.style.left = (styledim[0] + width) + 'px';    //The units were in px; simply add.
      }
      else {
        // For any other units, let CSS calculate position. Calc avoids the need to use the positionMe function when inside containers that can resize. #5692.
        label.style.left = 'calc('+dom.style.left +' + ' + width + 'px)';
      }
    }
  }
  else if (dom.style.right != ""){
    var brect = label.getBoundingClientRect();
    var labelWidth = brect.width;
    if (labelWidth < 10) labelWidth = 10;
    
    if (dom.style.right.indexOf('calc') != -1) {
      setCalcString('right', ' - ' + labelWidth);  //Add the input's width to a CSS calc function's parameters.
    }
    else {
      var styledim = pui.getStyleDim(dom.style.right);
      if (styledim[1] == 'px'){
        label.style.right = (styledim[0] - labelWidth) + 'px';   //The units were in px; simply subtract.
      }
      else {
        label.style.right = 'calc('+dom.style.right +' - '+ labelWidth + 'px)';   //Let CSS calculate the position.
      }
    }
  }
  
  function setCalcString(styleProp, appendPxStr){
    var calcString = trim(dom.style[styleProp]);
    var lastParenth = calcString.lastIndexOf(')');
    if (lastParenth != -1) {
      calcString = calcString.substr(0,lastParenth);
      calcString += appendPxStr + 'px)';
      label.style[styleProp] = calcString;
    }
  }
};

// Returns the PC-side timestamp in milliseconds since 1970/01/01 as a string.
function getTimeStamp() {

  return String(new Date().getTime());

}

// Array polyfills for Internet Explorer 8
// This will enable IE 8 to use array methods that it couldnt before.
if (!Array.prototype.forEach) {
  Array.prototype.forEach= function(action, that /*opt*/) {
      for (var i= 0, n= this.length; i<n; i++)
          if (i in this)
              action.call(that, this[i], i, this);
  };
}
if (!Array.prototype.map) {
  Array.prototype.map= function(mapper, that /*opt*/) {
      var other= new Array(this.length);
      for (var i= 0, n= this.length; i<n; i++)
          if (i in this)
              other[i]= mapper.call(that, this[i], i, this);
      return other;
  };
}
if (!Array.prototype.filter) {
  Array.prototype.filter= function(filter, that /*opt*/) {
      var other= [], v;
      for (var i=0, n= this.length; i<n; i++)
          if (i in this && filter.call(that, v= this[i], i, this))
              other.push(v);
      return other;
  };
}
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function( callback /*, initialValue*/ ) {
    'use strict';
    if ( null === this || 'undefined' === typeof this ) {
      throw new TypeError(
         'Array.prototype.reduce called on null or undefined' );
    }
    if ( 'function' !== typeof callback ) {
      throw new TypeError( callback + ' is not a function' );
    }
    var t = Object( this ), len = t.length >>> 0, k = 0, value;
    if ( arguments.length >= 2 ) {
      value = arguments[1];
    } else {
      while ( k < len && ! k in t ) k++; 
      if ( k >= len )
        throw new TypeError('Reduce of empty array with no initial value');
      value = t[ k++ ];
    }
    for ( ; k < len ; k++ ) {
      if ( k in t ) {
         value = callback( value, t[k], k, t );
      }
    }
    return value;
  };
}

if (!Array["from"]) {
  Array["from"] = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method 
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}

// Polyfill for Array.indexOf. Needed for IE8.
// Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf#Polyfill
if (!Array.prototype.indexOf)  Array.prototype.indexOf = (function(Object, max, min){
  "use strict";
  return function indexOf(member, fromIndex) {
    if(this===null||this===undefined)throw TypeError("Array.prototype.indexOf called on null or undefined");
    
    var that = Object(this), Len = that.length >>> 0, i = min(fromIndex | 0, Len);
    if (i < 0) i = max(0, Len+i); else if (i >= Len) return -1;
    
    if(member===void 0){ for(; i !== Len; ++i) if(that[i]===void 0 && i in that) return i; // undefined
    }else if(member !== member){   for(; i !== Len; ++i) if(that[i] !== that[i]) return i; // NaN
    }else                           for(; i !== Len; ++i) if(that[i] === member) return i; // all else

    return -1; // if the value was not found, then return -1
  };
})(Object, Math.max, Math.min);

// Polyfill to avoid crashing Visual Designer in IE8, which doesn't do Object.create.
//(Lets people using IE8 still run Visual Designer even though they cannot use Responsive Layout.) Needed by TabLayout.
// Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create 
if(typeof Object.create!=="function"){ Object.create=function(proto,propertiesObject){
  if(typeof proto!=='object'&&typeof proto!=='function'){ throw new TypeError(
  'Object prototype may only be an Object: '+proto); }else if(proto===null){
  throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");}
  if(typeof propertiesObject!='undefined'){ throw new Error(
  "This browser's implementation of Object.create is a shim and doesn't support a second argument.");}
  function F(){} F.prototype=proto;return new F();};
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
          else if (typeof value == "object" && value.length != null) {  // array
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
pui.arrayIndexOf = function (array, element) {

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
        e = e || window.event;
        pui.keyFilter(e, regEx);
      });
*/
pui.keyFilter = (function() {

  var specialKeys = {
    9: 'Tab',
    13: 'Enter',
    16: 'Shift',
    17: 'Ctrl',
    18: 'Alt',
    19: 'Pause',
    20: 'Caps Lock',
    27: 'Esc',
    33: 'Page Up',
    34: 'Page Down',
    35: 'End',
    36: 'Home',
    37: 'Left',
    38: 'Up',
    39: 'Right',
    40: 'Down',
    45: 'Insert',
    //Safari
    3: 'Enter',
    63234: 'Left',
    63235: 'Right',
    63232: 'Up',
    63233: 'Down',
    63276: 'Page Up',
    63277: 'Page Down',
    63272: 'Delete',
    63273: 'Home',
    63275: 'End'
  };
  
  var specialKeysGecko = {
    8: 'Backspace',
    9: 'Tab',
    13: 'Enter',
    27: 'Esc',
    33: 'Page Up',
    34: 'Page Down',
    35: 'End',
    36: 'Home',
    37: 'Left',
    38: 'Up',
    39: 'Right',
    40: 'Down',
    46: 'Delete'
  };
  
  var isGecko = !/webkit/.test(navigator.userAgent.toLowerCase()) &&
                /gecko/.test(navigator.userAgent.toLowerCase());
  if (pui["is_ie"]) {

    // IE11 now incl. 'gecko' in the user agent string, which throws off 
    // this code.
    isGecko = false;
  
  }
  
  return function(e, re) {
  
    var chr = String.fromCharCode(e.charCode || e.keyCode);
    
    if(e.ctrlKey ||
      (isGecko && specialKeysGecko[e.keyCode]) ||
      (!isGecko && specialKeys[e.keyCode] && !chr)){
        return;
    }
    
    if(!re.test(chr)){
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
  var n = 0;
  var len;
  var pos;
  var success;
  var shiftKey;

  //key=(typeof event!='undefined')?window.event.keyCode:e.keyCode;
  key = e.keyCode;
  obj = e.target || e.srcElement; // IE doesn't use .target
  
  var isTextbox = pui.isTextbox(obj);
  
  if (pui.genie.formSubmitted) {
    if (pui.genie.config.enableKeyAhead) {
      if (e.modifiers) shiftKey = e.modifiers && Event.SHIFT_MASK;
      if (!e.modifiers) shiftKey = e.shiftKey;
      if (shiftKey) keyAhead.record("shift" + key);
      else keyAhead.record(key);
    }
    disableAction(e);
    return false;
  }
  
  lastActiveElement = obj;
  
  if (key == 9) {      // tab key
    if (e.modifiers) shiftKey = e.modifiers && Event.SHIFT_MASK;
    if (!e.modifiers) shiftKey = e.shiftKey;
    if (shiftKey) {
      success = goPrev(obj, 0, true);
      if (success) {
        disableAction(e);
        return false;
      }    
    }
    else {
      success = goNext(obj, true);
      if (success) {
        disableAction(e);
        return false;
      }
    }
  }
  //if (key == 8) {     // backspace key
  
    // Let's not do this anymore...
  
    //if (isTextbox) {
    //  pos = getCursorPosition(obj);
    //  if (pos == 0) {
    //    goPrev(obj);
    //    disableAction(e);
    //    return false;              
    //  }
    //}
    //else {
    //  if (obj.tagName != "TEXTAREA") goPrev(obj);
    //  disableAction(e);
    //  return false;
    //}
  //} 
  else if (key == 35 && isTextbox) {     // end key
    if (obj.value != rtrim(obj.value)) {
      obj.value = rtrim(obj.value);
    }  
  }
  else if (key == 37) {     // left key
    if (isTextbox) {
      pos = getCursorPosition(obj);
      if (pos == 0) {
        goPrev(obj);
        disableAction(e);
        return false;        
      }
    }
    else {
      if (obj.tagName != "TEXTAREA") {
        goPrev(obj);
        disableAction(e);
        return false;        
      }
    }
  }
  else if (key == 38 && obj.tagName != "SELECT" && obj.tagName != "TEXTAREA") {     // up key
    
    // Do not process up key if the field is an auto complete field and the 
    // result pane is open.
    if (obj.autoComp == null || obj.autoComp.isOpen() == false) {
      if (!pui.genie.config.browserAutoComplete) {
        goUp(obj);
        disableAction(e);
        return false;
      }
    }
  }
  else if (key == 39) {     // right key
    if (isTextbox) {
      maxLength = Number(obj.getAttribute('maxLength'));    
      pos = getCursorPosition(obj);
      len = obj.value.length;
      if (pos >= len) {
        goNext(obj);
        disableAction(e);
        return false;        
      }
    }
    else {
      if (obj.tagName != "TEXTAREA") {
        goNext(obj);
        disableAction(e);
        return false;        
      }
    }
  }
  else if (key == 40 && obj.tagName != "SELECT" && obj.tagName != "TEXTAREA") {     // down key
    
    // Do not process up key if the field is an auto complete field and the 
    // result pane is open.    
    if (obj.autoComp == null || obj.autoComp.isOpen() == false) {    
      if (!pui.genie.config.browserAutoComplete) {
        goDown(obj);
        disableAction(e);
        return false;
      }
    }
    
  }
  else if (key == 45 && pui["is_ie"] && isTextbox && context == "genie" && e.shiftKey != true && e.ctrlKey != true){   // insert key
    // When a Genie field is full of whitespace and a user types Insert, then IE won't let them type because the field
    // is full because gotFocusField() in 5250/utils.js filled it. Trim after the caret to allow typing. Issue 4592.
    var selectEnd = obj.selectionEnd;
    var curval = obj.value.substring(0, selectEnd);
    curval += rtrim(obj.value.substring(selectEnd));
    obj.value = curval;
    obj.setSelectionRange(selectEnd, selectEnd); //setting value changed cursor position, so reset it.
  }
  if (isTextbox && pui.isFieldExit(e)) {    
    pui.storeCursorPosition(obj);
    fieldExit(obj);
    disableAction(e);
    return false;    
  }
  if (key == 109 && isTextbox) {    // numpad minus sign
    pui.storeCursorPosition(obj);
    if (fieldExit(obj, true)) {
      disableAction(e);
      return false;
    }
  }
  
  if (e.ctrlKey == true && (key == 67 || key == 86)) {  // allow ctrl-c and ctrl-v for copy/paste
    return true;
  }
      
  for( var i=0; i < allowedUnicodes.length; i++ ){
    if( allowedUnicodes[i] == key ){
      if(e.modifiers && Event.SHIFT_MASK){
        //case exits
      }
      else{
        return true;
      }
    }
  }
  disableAction(e);
  return false;
}

function fieldExit(obj, minus) {
  if (obj.readOnly == true) return false;
  var blankFill;
  var zeroFill;
  var rightAdjust = false;
  var maxLength;
  var signedNumeric = obj.getAttribute('signedNumeric');
  var needsOnchange = false;
  if (minus && (signedNumeric==null || signedNumeric!='Y')) return false;
  var pos = obj.cursorPosition;
  if (pui["is_touch"] && !pui["is_mouse_capable"]) {
     pos = getCursorPosition(obj);
  }
  if (pos == null) return false;
  if (pos < 0) return false;
  if (pos >= 0) {
  needsOnchange = (obj.value !== obj.value.substr(0, pos)); 
    obj.value = obj.value.substr(0, pos);
    blankFill = obj.getAttribute('blankFill');
    if (signedNumeric!=null && signedNumeric=='Y') blankFill = "Y";
    if (blankFill!=null && blankFill=='Y') {
      rightAdjust = true;
      fill = '                                                                                ';
    }    
    zeroFill = obj.getAttribute('zeroFill');
    if (zeroFill!=null && zeroFill=='Y') {
      rightAdjust = true;
      fill = '00000000000000000000000000000000000000000000000000000000000000000000000000000000';
    }    
    maxLength = obj.getAttribute('maxLength');    
    if (rightAdjust && maxLength!=null) {
      var newValue = fill + ltrim(obj.value);
      newValue = newValue.substr(newValue.length - maxLength);
      if (signedNumeric!=null && signedNumeric=='Y') {
        if (newValue.substr(newValue.length - 1) != '-') {
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
  if (needsOnchange && typeof obj.onchange === 'function') {
    obj.onchange();
  }
  goNext(obj);
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
      catch(e) {
      }
    } 
    if (pui.genie != null || !pui.designer.Designer || (context == "dspf" && pui.designer.Designer && typeof pui.ide.isDirty === 'function' && pui.ide.isDirty())) {
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
  if (pui.shutdownOnClose && pui.observer == null) {
    pui["halted"] = true;
    window["puihalted"] = true;
    pui.killFrames();
    var url;
    if (pui.genie == null) url = getProgramURL("PUI0001200.pgm");
    else url = getProgramURL("PUI0002110.pgm");
    if (pui.psid != null && pui.psid != "") url += "/" + pui.psid;
  if (pui["overrideSubmitUrl"] != null && typeof pui["overrideSubmitUrl"] == "function") {
    try {
      url = pui["overrideSubmitUrl"](url);
    }
    catch(e) {
    }
  }  
    // Redmine #4624
    // Use Blob to set Content-Type: application/x-www-form-urlencoded
    // Otherwise, Profound.js controller is unable to parse the POST.
    if (navigator != null && typeof navigator["sendBeacon"] == "function" && typeof window["Blob"] == "function") {
      var data = "shutdown=1" + (pui["isCloud"] ? "&workspace_id=" + pui.cloud.ws.id : "");
      var blob = new Blob([data], { type: "application/x-www-form-urlencoded" });
      navigator["sendBeacon"](url, blob);
    }
    else {
      var ajaxParams = {
        "shutdown": "1"
      };
      if (pui["isCloud"]) {
        ajaxParams["workspace_id"] = pui.cloud.ws.id;
      }
      ajax({
        url: url,
        method: "post",
        suppressAlert: true,
        params: ajaxParams
      });
    }
    pui.shutdownOnClose = false;
  }
};

pui.assignUnloadEvents = function() {
  if (window.addEventListener) {
    window.addEventListener("beforeunload", pui.beforeUnload, false);
    if (!pui.designer.Designer || pui.genie != null)
      window.addEventListener("unload", pui["unload"], false);        
  }	
  else if (window.attachEvent) {
    window.attachEvent("onbeforeunload", pui.beforeUnload);
    if (!pui.designer.Designer || pui.genie != null)
      window.attachEvent("onunload", pui["unload"]);
  }  
};


pui.downloadAsAttachment = function(contentType, fileName, data) {

  var form = document.createElement("form");
  form.action = getProgramURL("PUI0009106.pgm") + "?contentType=" + contentType + "&fileName=" + fileName;
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
  return;
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
pui.removeFromStringList = function(separatedListStr, remString, separator){
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
  if (emptyText ==  null || emptyText == null) return;
  var box = dom;
  if (box.comboBoxWidget != null) box = box.comboBoxWidget.getBox();
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
  if (dom.emptyText ==  null || dom.emptyText == null) return;
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
  if (pui["onuseractivity"] == null && pui["client side timeout"] != true) return;
  function onUserActivity() {
    if (pui["client side timeout"] == true) pui.timeoutMonitor.timer.reset();
    if (pui["onuseractivity"] != null) pui["onuseractivity"]();
  }
  addEvent(document.body, "keydown", onUserActivity);
  addEvent(document.body, "mousemove",onUserActivity);
  addEvent(document.body, "click",onUserActivity);
  addEvent(document.body, "touchstart",onUserActivity);
  addEvent(document.body, "touchmove",onUserActivity);
  pui.onUserActivityAttached = true;
};


// Keeps the server job from timing out
pui.autoKeepAlive = {};
pui.autoKeepAlive.lastServerAccess = new Date().getTime();
pui.autoKeepAlive.started = false;
pui.autoKeepAlive.timeout = 600;  // in seconds
pui.autoKeepAlive.intervalId = null;

pui.autoKeepAlive.setup = function() {  // called when screen is rendered
  if (pui.autoKeepAlive.started) {
    pui.autoKeepAlive.reset();
    return;
  }
  if (pui["keep alive interval"] == null) return;
  pui.autoKeepAlive.timeout = pui["keep alive interval"];
  pui.autoKeepAlive.start();
};

pui.autoKeepAlive.start = function() {
  if (pui.autoKeepAlive.started) return;
  var milliseconds = pui.autoKeepAlive.timeout * 1000;
  // checking should be more frequent than timeout
  milliseconds = milliseconds / 4;
  if (milliseconds > 3000) milliseconds = 3000;  // at least every 3 seconds
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
  var elapsedTime = (new Date().getTime()) - pui.autoKeepAlive.lastServerAccess;  // elapsed time since last server access
  if (elapsedTime >= pui.autoKeepAlive.timeout * 1000) {
    pui["keepAlive"]();
    pui.autoKeepAlive.reset();
  }
};


pui.isRightClick = function(e) {
  if (!e) e = window.event;
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
  var countdown = -1;   // When it reaches zero, compensate that element's scroll for zoom.

  // Elements inside the scaled designer canvas need adjustments.
  handleZoom = handleZoom === true && context == "dspf" && toolbar != null && toolbar.designer != null && toolbar.designer.container != null
    // Avoid calculating for zoom when element is not related to the canvas; e.g. Responsive Editor.
    && toolbar.designer.container.parentNode != null && toolbar.designer.container.parentNode.parentNode != null
    && toolbar.designer.container.parentNode.parentNode.contains(obj);
  
  // Get offsets from obj and each offsetParent until there are no more parents.
  while(obj != null ){
    var subtractScroll = true;

    var tmpleft = obj.offsetLeft;
    var tmptop = obj.offsetTop;

    if (handleZoom){
      // obj is the mobile-device-looking div, which is the parent of the canvas.
      if (obj.isCanvasOutline){
        // Include the zoom-adjusted offsets and borders but not the scroll left/top.
        tmpleft = Math.round((obj.offsetLeft + obj.clientLeft) * toolbar.zoomDecimal);
        tmptop = Math.round((obj.offsetTop + obj.clientTop) * toolbar.zoomDecimal);
        countdown = 1; //two parents up from this should adjust for zoom.
        subtractScroll = false;
      }
      // obj has scrollbars affected by zoom. this is "dspfDesignerN_" when there's no mobile div, 
      else if (countdown == 0){
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
        //obj is the canvas. One parent up from this should adjust for zoom. (unless isCanvasOutline is reached first).
        if (obj == toolbar.designer.container) countdown = 0;
      }
    }

    curleft += tmpleft;
    curtop += tmptop;

    // Compensate for content scroll position, but not for the body tag.
    // body.scrollTop/Left in Chrome, Safari, and Opera is the window scroll 
    // top/left. Offset shouldn't change when the page scrolls.
    if( obj.tagName !== "BODY" && subtractScroll) {
      curleft -= obj.scrollLeft;
      curtop -= obj.scrollTop;
    }

    // Include the style transform in the offset.
    if (obj.className == "scroller") {
      var transform = obj.style["transform"];
      if (transform == null) transform = obj.style["webkitTransform"];
      if (transform != null && typeof transform == "string" && transform.substr(0,10) == "translate(") {
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
    if (obj.parentNode && obj.parentNode.tagName != 'TD'
    && (handleZoom || (obj.parentNode.className == 'puiresp' && (obj.parentNode.scrollTop > 0 || obj.parentNode.scrollLeft > 0)))){
      obj = obj.parentNode;
    }
    else obj = obj.offsetParent;
  }
  return [curleft,curtop];
};


/**
 * Multi-Part Class
 * @constructor
 */

pui.MultiPart = function() {

  // Public methods.
  this.addParts = function(partsArray) {

    if (typeof(partsArray.length) == "undefined") {
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
      if (typeof(part["NAME"]) != "string" || typeof(part["VALUE"]) != "string") {
        continue;
      }
      partsString += "--" + boundary + newline;
      partsString += "Content-Disposition: form-data; name=\"" + part["NAME"] + "\"";
      if (typeof(part["FILENAME"]) == "string") {
        contentType = "application/octet-stream";
        if (typeof(part["CONTENTTYPE"]) == "string") {
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
  
  var me = this;
  var parts = new Array();  
  
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

pui.storeCursorPosition = function( obj ) {
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

  var fields = new Array();
  var fromstr = " from ";
  var frompos = 0;
  var character = "";
  var field = "";
  var parenLevel = 0;
  var inQuote = false;
  for (var i = 0; i < propVal.length; i++) {
    
    if( stopAtFrom === true && frompos == 6){
      // Remove " from " from the last field name, and stop looking.
      field = field.substr(0, field.length - 6);
      break;
    }
    
    character =  propVal.charAt(i);
    if (!inQuote) {
      if (character == "("){
        parenLevel += 1;
        frompos = 0;
      }
      else if (character == ")"){
        parenLevel -= 1;
        frompos = 0;
      }
      else if (character == "'"){
        inQuote = true;
        frompos = 0;
      }
      else if ( parenLevel == 0 ){
        // If this character matches another character in " from ", then increase position.
        if( character.toLowerCase() == fromstr.charAt(frompos) )
          frompos++;
        else
          frompos = 0; //" from " didn't match, so reset position.
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
            
  "remote system name" : null,
  "database file" : null,
  "database fields" : null,
  "selection criteria" : null,
  "order by" : null,
  "custom sql" : null,
  "name field" : null,
  "value field" : null,
  "summary option" : null,
  "choices database file" : null,
  "choice options field" : null,
  "choice values field" : null,
  "choices selection criteria" : null,
  "parameter value": null,
  "choices parameter value": null,
  "case sensitive": null
            
};

pui.isSQLProp = function(prop) {

  return (typeof(pui.sqlProps[prop]) != "undefined");  

};

pui.getSQLVarName = function(dom) {

  var varName = context + ".";

  var id = dom.id;
  
  if (context == "genie" && dom.parentNode != pui.runtimeContainer) {
  
    // Strip window index, as the server 
    // processing is not aware of the resulting id at 
    // .scn file processing time.
    var pos = id.lastIndexOf("_W");
    if (pos != -1) {
    
      id = id.substr(0, id.lastIndexOf("_W") + 2);
    
    }
  
  }

  var inGrid = (typeof(dom.parentNode.parentNode.grid) != "undefined");
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
  var paramString = "";       //The returned URL string.
  var paramStringAnd = "";    //URL parameter separator. Becomes "&" after first parameter is set.
  var pnameregex = /^(choices |blob )?(parameter value)( \d+)?/;
  var suffix = "";
  
  // Determine which property name is given and what the maximum parameter number is. There may be gaps between numbers.
  var maxidx = 1;
  var propname;
  for (var p in properties){
    var matches = pnameregex.exec(p);
    if (matches){
      if (propname == null){
        propname = (matches[1] ? matches[1] : "") + matches[2];
      }
      if (matches[3] != null){
        maxidx = Math.max(maxidx, parseInt(matches[3],10));
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
  
  function datetimestring(){
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
pui.getStyleDim = function(styleVal){
  var unit = "", val = "";
  if (typeof styleVal == "string"){
    var re = /^([0-9.,-]+)(cm|mm|in|px|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|%)$/i;
    var matches = re.exec(styleVal);
    if (matches != null){
      var num = Number(matches[1]);
      if (isNaN(num)) num = 0;
      val = num;
      unit = matches[2];
    }
    else val = styleVal;  //The style is non-numeric or the unit is unsupported.
  }
  return [val, unit];
};

pui.getWindowScrollTop = function() {  // gets window scroll top position
  var scrOfY = 0;
  if ( typeof( window.pageYOffset ) == 'number' ) {
    //Netscape compliant
    scrOfY = window.pageYOffset;
  } else if ( document.body && document.body.scrollTop ) {
    //DOM compliant
    scrOfY = document.body.scrollTop;
  } else if ( document.documentElement && document.documentElement.scrollTop ) {
    //IE6 standards compliant mode
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
  
  if (typeof(pui["sql date format"]) == "string") {
  
    fmt = pui.SQLDateFmts[pui["sql date format"].toUpperCase()];
  
  }  
  
  if (fmt == null) {
  
    fmt = pui.SQLDateFmts["*ISO"];
  
  }
  
  if (typeof(pui["sql date separator"]) == "string") {
  
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
  
  if (typeof(pui["sql time format"]) == "string") {
  
    fmt = pui.SQLTimeFmts[pui["sql time format"].toUpperCase()];
  
  }  
  
  if (fmt == null) {
  
    fmt = pui.SQLTimeFmts["*ISO"];
  
  }
  
  if (typeof(pui["sql time separator"]) == "string") {
  
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
  var parts = location.href.split('://');
  var prepend = "";
  var domain = "";
  if (parts.length > 1) {
    prepend = parts[0] + '://';
    parts.splice(0, 1);
    domain = parts.join('://');
  }
  else {
    domain = location.href;
  }
  domain = prepend + domain.split('/')[0];
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
      listArray = eval(list);
    }
    catch(e) {
    }
  }
  if (listArray == null) listArray = list.split(",");
  return listArray;
};


pui.isHTML5InputType = function(type) {
  switch(type) {
    // provided as a choice in the "input type" property
    case "number":
    case "date":
    case "datetime":
    case "time":
    case "email":
    case "url":
    case "month":
    case "tel":
    case "url":
    // not provided as a choice in the "input type" property, but could be valid HTML5 input types
    case "color":
    case "datetime-local":
    //case "range":
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

  e = e || window.event;
  var key = e.keyCode;
  var fe = pui["field exit key"];
  
  if ((key == fe) && 
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
   if (!inDesignMode() && !pui.nodejs && typeof url == "string" && url.search("AUTH=") == -1) {
     if (url.search(/\?/) == -1) url += '?';
     else url += '&';
    url += "AUTH=" + encodeURIComponent(pui["appJob"]["auth"]);
   }
   return url;
};



pui.validateEmail = function(email) { 
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

pui.isBound = function(propVal) {
  return (propVal != null && typeof propVal == "object" && typeof propVal["fieldName"] == "string");
};

pui.isTranslated = function(propVal) {
  return (propVal != null && typeof propVal == "object"
    && typeof propVal["translations"] == "object"
    && propVal["translations"] != null
    && typeof propVal["translations"].length == "number");
};

pui.isRoutine = function(propVal) {
  return (propVal != null && typeof propVal == "object" && typeof propVal["routine"] == "string");
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

pui.xmlEscape = function(str) {

  str = "" + str;
  str = str.replace(/&/g, "&amp;");
  str = str.replace(/</g, "&lt;");
  str = str.replace(/>/g, "&gt;");
  str = str.replace(/"/g, "&quot;");   // " - fake comment to fix syntax highlighting
  str = str.replace(/\u001a/g, "&#x25a1;");    // the "substitute" character breaks XLSX files. replace with unicode square. Issue #6149. 
  return str;  

};


// Used to fix Redmine 692 - iFrame close error issue when not in the same domain - Firefox and Chrome 
// Function is used in this utils.js, genie.js and render.js

pui.checkForAtrium = function(parentWindow) {
  var hasAtrium = false;
  
  try {
    hasAtrium = (typeof(parentWindow["Atrium"]) != "undefined" && typeof(parentWindow["Atrium"]["api"]) != "undefined");
  }
  catch(e) {
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
    if (parentWindow.location["host"] != null) accessible = true; //Throws exception if parent has different origin.
  }
  catch(exc){}
  return accessible;
};

pui.isLocalStorage = function() {

try {
if (localStorage != null && typeof(window.localStorage) != "undefined")
    return true;
  
  else
    return false;
  }
  
catch(e){
  return false;
  }
};



pui.normalizeColor = function(value) {
  if (value.substr(0,1) == "#") value = value.toUpperCase();
  if (value.substr(0,4) == "rgb(" && value.substr(value.length-1, 1) == ")") {
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
  if(node === undefined || !node) return;
  if (node.tagName == "SPAN" && node.className == "pui-highlight") return;

  if(node.hasChildNodes()) {
    for(var i=0; i < node.childNodes.length; i++) {
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
  while(spans.length && (span = spans[0])) {
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
  var onMouseDown = function () {
    hadMouseOver = false;
  };
  var onMouseMove = function () {
    if (hadMouseOver) {
      // if iOS or Android dont set the mouse_capable flag #4460
      if (pui["is_android"] || pui["is_ios"]) {
        removeEvent(docElement, 'mousedown', onMouseDown);
        removeEvent(docElement, 'mousemove', onMouseMove);
        return;
      }
      pui["is_mouse_capable"] = true;
      if (pui.isLocalStorage()) {
        localStorage.setItem("pui-is-mouse-capable", "true");
      }
      removeEvent(docElement, 'mousedown', onMouseDown);
      removeEvent(docElement, 'mousemove', onMouseMove);
    }
    hadMouseOver = true;
  };

  var hadMouseOver = false;
  addEvent(docElement, 'mousedown', onMouseDown);
  addEvent(docElement, 'mousemove', onMouseMove);
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
      catch(e) { /* ignore */ }
      
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
    if( iframe != null ){
    
      var puiObj = null;
      try {
        puiObj = iframe.contentWindow["pui"];
        iframe.contentWindow["puihalted"] = true;
      }
      catch(e) { /* ignore */ }

      if (puiObj != null && typeof puiObj === "object") {
        puiObj["halted"] = true;
        if (typeof puiObj["haltFrames"] === "function") {
          puiObj["haltFrames"]();
        }
      }

      // Since haltFrames can be called in the middle of a session, avoid breaking the
      // back button behavior by removing the element before clearing "src". Issue 2503.
      if( iframe.parentNode != null )
        iframe.parentNode.removeChild(iframe);

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
pui["breakMessagesInit"] = function(){
  // Do nothing if local storage isn't supported or break-messages not enabled.
  if( inDesignMode() || pui["brkmsg enable"] !== true ) return;
  if( !pui.isLocalStorage() || typeof(JSON) !== "object") return;
  // Do nothing if there is no user or user is QTMHHTP1. (user may not be set for PJS session.)
  if(typeof(pui.appJob) !== "object" || pui.appJob["user"] == null || pui.appJob["user"].length <= 0
  || pui.appJob["user"] === "QTMHHTP1" ) return;
  
  // Ensure that polling interval is valid.
  pui["brkmsg poll interval"] = Number(pui["brkmsg poll interval"]);
  if( isNaN(pui["brkmsg poll interval"]))
    pui["brkmsg poll interval"] = 30;
  // Fastest interval allowed is 1 second.
  else if( pui["brkmsg poll interval"] < 1 )
    pui["brkmsg poll interval"] = 1;
  
  // Ensure that max-error-count exists.
  pui["brkmsg max errors"] = Number(pui["brkmsg max errors"]);
  if( isNaN(pui["brkmsg max errors"]))
    pui["brkmsg max errors"] = 3;
  
  // Maximum messages to show at once. 
  pui["brkmsg max messages"] = Number(pui["brkmsg max messages"]);
  if( isNaN(pui["brkmsg max messages"]))
    pui["brkmsg max messages"] = 10;
  
  // User polling timeout in seconds. UserId will be cleared from localStorage
  // if no polling happened for that user recently.
  pui["brkmsg user timeout"] = Number(pui["brkmsg user timeout"]);
  if( isNaN(pui["brkmsg user timeout"]))
    pui["brkmsg user timeout"] = 300;
  // Prevent unpredictable behavior when timeout happens too quickly.
  else if( pui["brkmsg user timeout"] <= pui["brkmsg poll interval"] )
    pui["brkmsg user timeout"] = pui["brkmsg poll interval"] + 10;
  
  // Current error count.
  pui.breakMessageErrors = 0;

  // Become the active poller if necessary.
  pui.breakMessagesPollCheck();

  // If we are a new session and old messages exist, then get ready to show them.
  var msgs;
  try{ msgs = JSON.parse(localStorage.getItem("brkmsgMessages_"+pui.appJob["user"])); }
  // If the messages couldn't parse, just clear them.
  catch(exc){ localStorage.setItem("brkmsgMessages_"+pui.appJob["user"], "[]"); }

  // Setup the non-Atrium container and event listener.
  if( window.parent == window || !pui.checkForAtrium(window.parent) ){
    // Create a UI container.
    var container = document.createElement("div");
    container.id = "pui-break-messages";
    container.style.zIndex = pui.windowZIndex++;
    pui.runtimeContainer.appendChild(container);

    if( pui.isLocalStorage()){
      // Avoid duplicate event handlers by removing before adding.
      removeEvent(window, "storage", pui.breakMessagesOnStorage);
      // Listen on our window for messages from storage.
      addEvent(window, "storage", pui.breakMessagesOnStorage);
      // Show pending messages.
      if(msgs) pui.breakMessagesShow(msgs);
    }
  } 
  // Setup the Atrium event handler.
  else{
    // Attach a single handler to the Atrium window for all child windows.
    removeEvent(window.parent, "storage", window.parent["Atrium"]["api"]["breakMessagesOnStorage"]);
    addEvent(window.parent, "storage", window.parent["Atrium"]["api"]["breakMessagesOnStorage"]);
    // Show pending messages.
    if(msgs) window.parent["Atrium"]["api"]["breakMessagesShow"](msgs,pui.appJob["user"]);
  }

  pui.breakMessagesStartPoll();  
};//end breakMessagesInit.

/**
 * Check if this session's job should assume the active polling role. If too
 * much time has passed since the last poll, take over as active poller and
 * return true. Otherwise, don't take over and return false.
 * Returns false if the session isn't active.
 * 
 * @returns {Boolean}
 */
pui.breakMessagesPollCheck = function(){
  if( !pui || !pui.appJob || pui.appJob["auth"].length <= 0
  || pui.appJob["user"].length <= 0 ) return false;

  //
  // See if we should take over as active poller.
  //
  var activePoller = localStorage.getItem("brkmsgActivePoller_"+pui.appJob["user"]);
  var lastPoll = Number(localStorage.getItem("brkmsgLastPoll_"+pui.appJob["user"]));
  if( isNaN(lastPoll) ) lastPoll = 0;
  
  // Calculate how many milliseconds since the last poll; calculate how many 
  // seconds is too many: the polling interval + 10 seconds.
  // Assume the other process is gone after that long.
  var now = Date.now();
  var difference_ms = now - lastPoll;
  var compareto_ms = pui["brkmsg poll interval"]*1000 + 10000;
  
  // If there was no activePoller or the last recorded one was too long ago,
  // then take over as active poller.
  if( activePoller === null
  || (difference_ms >= compareto_ms && activePoller !== pui.appJob["auth"])){
    activePoller = pui.appJob["auth"];
    localStorage.setItem("brkmsgActivePoller_"+pui.appJob["user"], activePoller);
    localStorage.setItem("brkmsgLastPoll_"+pui.appJob["user"], now );
  }
  
  //
  // Get the list of all userIds in local storage. See if we should remove any.
  //
  var userIds;
  var listChanged = false;
  try{
    userIds = JSON.parse(localStorage.getItem("brkmsgUserIds"));
  }
  catch(exc){ listChanged = true;}
  if( userIds == null || typeof(userIds.pop) !== "function") {
    userIds = [];
    listChanged = true;
  }
  
  // Make sure current user is in array.
  var activeList = [];
  if( pui.arrayIndexOf(userIds, pui.appJob["user"]) < 0 ){
    activeList.push(pui.appJob["user"]);
    listChanged = true;
  }
  
  // Look at all users from storage and see if they have been inactive too long.
  for(var i=0; i < userIds.length; i++){
    if( userIds[i] !== pui.appJob["user"]){
      lastPoll = Number(localStorage.getItem("brkmsgLastPoll_"+userIds[i]));
      if(isNaN(lastPoll)) lastPoll = 0;

      // Users keys should be cleared.
      if( Date.now() - lastPoll >= pui["brkmsg user timeout"]*1000 ){
        localStorage.removeItem("brkmsgLastPoll_"+userIds[i]);
        localStorage.removeItem("brkmsgActivePoller_"+userIds[i]);
        localStorage.removeItem("brkmsgMessages_"+userIds[i]);
        listChanged = true;
      }
      // User is still active, keep them.
      else activeList.push(userIds[i]);
    }
  }
  if(listChanged) localStorage.setItem("brkmsgUserIds", JSON.stringify(activeList));
  
  activeList = null;
  userIds = null;
  
  return activePoller === pui.appJob["auth"];
};

/**
 * Start a new Interval function to poll for break messages. 
 * 
 * @returns {undefined}
 */
pui.breakMessagesStartPoll = function(){
  if( inDesignMode() || pui["brkmsg enable"] !== true ) return;

  // Stop a previous Interval if it existed.
  if( typeof(pui.breakMessagePoller) === "number")
    clearInterval(pui.breakMessagePoller);

  // Start a new poller.
  pui.breakMessagePoller = setInterval(function(){
    // If the user logged off or brkmsg became disabled, then stop the poller.
    if(typeof(pui.appJob) !== "object" || pui.appJob["user"].length <= 0
    || pui.appJob["user"] === "QTMHHTP1" || pui["brkmsg enable"] !== true){
      pui.breakMessagesStopPoll();
      return;
    }
    
    // See if we should assume the role as active poller or we are active poller.
    if( pui.breakMessagesPollCheck() ){
      // We are the poller, so poll the server. Otherwise, do nothing.
      ajaxJSON({
        "url": getProgramURL("PUI0009116.PGM"),
        "method": "post",
        "async": true,
        "suppressAlert": true, /*Popup alerts every interval would be very annoying.*/
        "params": { "AUTH": pui.appJob["auth"] },
        /* Handler for errors, such as 404. */
        "onfail": function(){
          pui.breakMessageErrors++;
          // If too many errors were encountered polling, then stop polling.
          if( pui.breakMessageErrors >= pui["brkmsg max errors"] ) {
            pui.breakMessagesStopPoll();
            console.log("Stopped break-message polling; too many errors.");
          }
        },
        /* Handler for successful response. parms is a JSON object.*/
        "handler": function(parms){
          // There was an error.
          if( parms == null || typeof(parms) !== "object" || parms["error"] ){
            pui.breakMessageErrors++;
            // If too many errors were encountered polling, then stop polling.
            // Errors here are usually from session time out.
            if( pui.breakMessageErrors >= pui["brkmsg max errors"] ) {
              pui.breakMessagesStopPoll();
            }
          }
          // There was at least one new message.
          else if( parms["success"] && parms["messages"] != null
          && typeof(parms["messages"].pop) === "function"
          && parms["messages"].length > 0 ) {
          
            var brkMessages;
            // Try adding the new messages to any stored ones.
            try{
              // Get existing messages.
              brkMessages = JSON.parse(localStorage.getItem("brkmsgMessages_"+pui.appJob["user"]));
            }
            // Existing messages failed to parse. Ignore.
            catch(exc){ console.log(exc); }

            // If the existing messages aren't an array, discard them.
            if( brkMessages == null || typeof(brkMessages.pop) !== "function"){
              brkMessages = [];
            }
            // Add new messages to end of array, and store the modified array.
            brkMessages = brkMessages.concat(parms["messages"]);
            
            // Make sure the new array isn't too large.
            if( pui["brkmsg max messages"] > 0 && brkMessages.length > pui["brkmsg max messages"] ) {
              // Get the last elements from the array.
              brkMessages = brkMessages.slice(brkMessages.length - pui["brkmsg max messages"], brkMessages.length);
            }
            
            // Send the message to Atrium.
            if( window != window.parent && pui.checkForAtrium(window.parent)){
              //Send to Atrium if Ext.msgbox is being shown. Avoid triggering a custom function twice; a storage event will trigger breakMessagesShow.
              if (typeof window.parent["Atrium"]["brkmsg handler"] !== "function")
                window.parent["Atrium"]["api"]["breakMessagesShow"](brkMessages,pui.appJob["user"]);
            }
            else {
              // Non-Atrium: show the message
              pui.breakMessagesShow(brkMessages );
            }
            // Store the message, sending it to any other tabs.
            localStorage.setItem("brkmsgMessages_"+pui.appJob["user"], JSON.stringify(brkMessages));
          }
          // Else no error and success==false: there were no messages.
        }
      });

      localStorage.setItem("brkmsgLastPoll_"+pui.appJob["user"], Date.now() );
    }//done with active poll.
    
    // Fallback for IE8, which supports storage but not storage events:
    // redraw the messages from local storage in case another tab cleared or
    // caught any.
    if( pui.isLocalStorage() && typeof(window.addEventListener) === "undefined"
    && typeof(JSON) === "object" ){
      try{
        var brkMessages = JSON.parse(localStorage.getItem("brkmsgMessages_"+pui.appJob["user"]));
        if( window != window.parent && pui.checkForAtrium(window.parent)){
          window.parent["Atrium"]["api"]["breakMessagesShow"](brkMessages,pui.appJob["user"]);
        }
        else {
          // Non-Atrium: show the message
          pui.breakMessagesShow(brkMessages );
        }
      }
      catch(exc){ console.log(exc); }
    }
  }, pui["brkmsg poll interval"] * 1000 );
};

/**
 * Stop the polling interval and detach break-message storage event listeners.
 * 
 * @returns {undefined}
 */
pui.breakMessagesStopPoll = function(){
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
pui.breakMessageDismiss = function(event){
  if(typeof(pui.appJob) !== "object" || pui.appJob["user"].length <= 0
  || pui.appJob["user"] === "QTMHHTP1"){
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
  try{
    brkMessages = JSON.parse(localStorage.getItem("brkmsgMessages_"+pui.appJob["user"]));
    if(brkMessages !== null && typeof(brkMessages.splice) === "function") {
      // Remove the clicked message from the array.
      if (!msgIdx && msgIdx != 0) msgIdx = brkMessages.length - 1;
      brkMessages.splice(msgIdx,1);
    }
    else
      brkMessages = [];
  }
  catch(exc){
    console.log(exc);
    brkMessages = [];
  }
  // Update the store, and signal any other tabs to redraw
  localStorage.setItem("brkmsgMessages_"+pui.appJob["user"], JSON.stringify(brkMessages));
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
  if (typeof pui["brkmsg handler"] == "function") return pui["brkmsg handler"](messages); //Let the end-pgmr-defined function handle the messages.
  pui.breakMessageShowing = false;
  if(messages == null || typeof(messages.pop) !== "function") return;
  
  var bkmsgcont = document.getElementById("pui-break-messages");
  if(!bkmsgcont) return;

  // Clear existing messages from the page. The messages argument contains the
  // same messages as the store, so make sure what is visible agrees with
  // what other tabs show.
  bkmsgcont.innerHTML = "";
  
  if( messages.length == 0) {
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
  for(var i=0; i < messages.length; i++ ){
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
    if( typeof(pui["breakMessageFormat"]) === "function"){
      var stringwrap = {"title":"","body":""};
      pui["breakMessageFormat"](curmsg, stringwrap);
      msgtitle.innerHTML = stringwrap.title;
      msgbody.innerHTML = stringwrap.body;
    }
    else {
      try{
        msgtitle.innerHTML = curmsg["date"]+" "+curmsg["time"] + "<br>"
          + curmsg["jobNum"] +"/"+ curmsg["jobUserName"] +"/"+ curmsg["jobName"];
        msgbody.innerHTML = curmsg["to"] +":<br>"+ curmsg["msg"];
      }
      catch(exc){ console.log(exc); }
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
pui.breakMessagesOnStorage = function(e){
  if(typeof(pui.appJob) !== "object" || pui.appJob["user"].length <= 0
  || pui.appJob["user"] === "QTMHHTP1"  ){
    return false;
  }
  
  // Only handle changes to break messages for current user.
  if(e.key !== "brkmsgMessages_"+pui.appJob["user"]) return false;
  try{
    var messages = JSON.parse(e.newValue);
    pui.breakMessagesShow( messages );
  }
  catch(exc){ console.log(exc); }
  return false;
};

pui.submitLog = function(submittingFlag) {
  
  if (!pui["submit log"])
    return;
  
  console.log("=".repeat(80));
  console.log(new Date().toString() + ": submit flag = " + submittingFlag);
  console.log("-".repeat(80));
  try {
    
    throw new Error();
    
  }
  catch(e) {
    
    var lines = e.stack.split("\n");
    if (lines[0].indexOf("Error") == 0)
      lines.shift();
    lines.shift();
    for (var i = 0; i < lines.length; i++)
      if (lines[i] != "")
        console.log(lines[i].replace(/^\s*at\s/, ""));
    
  }
  
};

if (typeof String.prototype.repeat != "function")
  String.prototype.repeat = function(n) {
    
    var val = "";
    for (var i = 0; i < n; i++)
      val += this;
    return val;
    
  };

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
pui.addItemDependenciesTo = function(item, dependencies, formatData, designer ){
  if( item != null ){
    var fieldtype = item["field type"] || item["field_type"]; //Genie uses "field_type"; RDF uses "field type".
    if( fieldtype != null ){
      // In pre-render time, parms items don't have widget names, which
      // is the key under which pui.widgets stores dependencies.
      // So try to resolve the widget name from "field type" and template if necessary.
      if( fieldtype == "layout" && item["template"] == "css panel" ) fieldtype = "css panel"; //special case.

      if( pui.widgets[fieldtype] != null && pui.widgets[fieldtype]["dependencies"] != null 
      && pui.widgets[fieldtype]["dependencies"].length > 0 ){
        // List of dependencies that the Visual Designer will ignore and not fetch.
        var designerIgnoredDependencies = ['/fusionchartsxt/js/pui-fusioncharts.js'];
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
        var re = /^(https?:\/\/[^\/]+)\//i;
        var matches = document.URL.match(re);
        if( matches != null && matches.length == 2) origin = matches[1];
        
        // Add each dependency to a list.
        for( var dp=0; dp < widdep.length; dp++ ){
          var dependUri = widdep[dp];
          var useDependency = false;
          if (typeof widdep[dp] == "object" && widdep[dp] != null && typeof widdep[dp]["condition"] == "function"){
            //The dependency is conditional, so load only when it passes a test.
            if (widdep[dp]["condition"](item, formatData, designer)){
              dependUri = widdep[dp]["script"];
              useDependency = true;
            }
          }else if(typeof widdep[dp] == "string"){
            useDependency = true;  //Always use dependency when it is a string.
          }
          if(useDependency){
            // Make both the relative URI and the full URL for comparison.
            var uri = pui.normalizeURL(dependUri);
            var url = pui.normalizeURL( origin + uri);

            // Avoid adding the same script multiple times by checking if it already exists.
            var scriptExists = false;  
            for(var sc=0; sc < scripts.length; sc++){
              if( scripts[sc].type.toLowerCase() == "text/javascript" && (scripts[sc].src == url || scripts[sc].src == uri)) {
                scriptExists = true;
                break;
              }
            }

            // Avoiding adding the same stylesheet multiple times by checking if it already exists
            if (links && !scriptExists) {
              for (var l=0; l<links.length; l++) {
                if (links[l].type.toLowerCase() == "text/css" && (links[l].href == url || links[l].href == uri)) {
                  scriptExists = true;
                  break;
                }
              }
            }

            // If the file wasn't already loaded in <head>, and if the
            // dependency wasn't already added to the list, add it to the list.          
            if( !scriptExists && pui.arrayIndexOf(dependencies, uri) < 0 ){
              dependencies.push(uri);
            }
          } //done if useDep.
        }//done linking each dependency.
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
pui.loadDependencyFiles = function(parm, callback ){
  
  // List to be populated with unique URI strings.
  var dependencies = [];
  
  if( parm != null ){
    // When called by genie() in 5250/genie.js, parm should be an entry from the global screenPropertiesObj.
    // When called by designer, parm is just an object with an "items" array and "designMode":true.
    if( parm["items"] != null && parm["items"].length > 0){
      for(var itm=0; itm < parm["items"].length; itm++){
        
        // If the "dependencies" property exists, add to a list.
        pui.addItemDependenciesTo( parm["items"][itm], dependencies, null, parm["designer"]);
      }
    }
    // When called for pui.render, parm should contain layers and formats for the RDF/genie screen.
    else if(parm["layers"] != null && parm["layers"].length > 0){
      // Look in each layer.
      for(var lay=0; lay < parm["layers"].length; lay++){
        var layer = parm["layers"][lay];
        if( layer != null && layer["formats"] != null && layer["formats"].length > 0){
          // Look in each format
          for(var fmt=0; fmt < layer["formats"].length; fmt++){
            var format = layer["formats"][fmt];
            if( format != null && format["metaData"] != null && format["metaData"]["items"] != null && format["metaData"]["items"].length > 0){
              // Look at each item.
              for(var itm=0; itm < format["metaData"]["items"].length; itm++){
                
                // If the "dependencies" property exists, add to a list.
                pui.addItemDependenciesTo( format["metaData"]["items"][itm], dependencies, format["data"], false);
              }//end look at each item.
            }
          }//end look in each format.
        }
      }//end look in each layer.
    }
  }
  
  pui.dependencies = dependencies; //Store the URLs globally to be accessed by callbacks.
  
  myonload();
  
  // Recursive method to load a css/js file and callback itself onsuccess or onerror. Overall, files
  // are loaded synchronously, one at a time, in FIFO order set in the "dependencies" property.
  function myonload(){

    if (pui.dependencies.length <= 0){
      // Stop recursion. All dependencies are loaded or timed out (or there were none).
      pui.dependencies = null;
      checkTemplates();
      return;
    }

    var url = pui.dependencies.shift(); //Remove first from queue.

    if( url != null && url.length > 0 ){      
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

    }else{
      myonload();   //If the string was empty, then look for the next dependency.
    }
  } //end myonload() recursive function.
  
  function filerefOnError(evt){
    if (evt != null && evt.target != null) console.log("Failed to load widget dependency file ", evt.target.src || evt.target.href );
    myonload();
  }
  
  // See if any custom layout templates need to load. They must be ready before pui.render or before Designer loads. Issues 3548, 5999.
  function checkTemplates(){    
    if (pui.customLayoutTemplateQueue instanceof Array && pui.customLayoutTemplateQueue.length > 0){
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
      callback();   //Execute and finish. (The callback is either pui.render or genie()/success() in 5250/genie.js.)
    }
  }
  
  function templateFail(req){
    // Note: processHTML will fall back to "simple container", because this template didn't exist.
    console.log("Failed to load custom layout template:", req.templateName);
    checkTemplates();
  }
  
  function templateSuccess(req){
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
pui.loadMobileExtensionFiles = function (isMobile, callback) {
  if (isMobile) {
    // Get list of files to load
    ajaxJSON({
      "url": getProgramURL("PUI0009120.pgm?r=" + Date.now()),
      "method": "GET",
      "suppressAlert": true,
      "handler": function (response) {
        if (response && response["status"] === 'success') {
          loadFiles(response["data"]["files"]);
        } else {
          callback();
        }
      },
      "onfail": function () {
        callback();
      }
    });
  } else {
    callback();
  }

  // Load JS and CSS files. The last completion handler to get called will call the callback.
  function loadFiles(files) {
    if (files.length === 0) {
      callback();
    }

    files.forEach(function (file) {
      var loaded = false;
      var basename = file.split("?")[0];

      if (basename.substr(-3).toLowerCase() == '.js') {
        loaded = pui["loadJS"]({
          "path": file,
          "callback": loadFilesCompletion,
          "onerror": function () {
            console.log("Failed to load " + file);
            loadFilesCompletion();
          }
        });

      } else if (basename.substr(-4).toLowerCase() == '.css') {
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
pui.round = function(number, precision){
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
  
  if (html.indexOf("<%") < 0) return html;  // no ejs to process
  
  if (typeof window["ejs"] !== "object" || typeof window["ejs"]["render"] !== "function") {
    console.error("EJS templating library not loaded.");
    return html;
  }
  
  // First, format the data properly for ejs
  if (pui.ejsData == null) {
    var data = {};
    var flags = {};
    var layers = pui["layers"];
    if (layers == null) layers = [];
    var lastLayer = layers[layers.length - 1];
    if (lastLayer == null) lastLayer = { formats: [] };
    var formats = lastLayer.formats;
    for (var i = 0; i < formats.length; i++) {
      var format = formats[i];      
      for (var name in format.data) {
        var value = format.data[name];
        if (name.substr(0,3).toUpperCase() === "*IN") {
          var ind = name.substr(3);
          if (!isNaN(Number(ind))) ind = Number(ind);
          flags[ind] = value;
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
              if (fieldName.substr(0,3).toUpperCase() === "*IN") {
                var ind = fieldName.substr(3);
                if (!isNaN(Number(ind))) ind = Number(ind);
                flags[ind] = recordArray[k];
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
    var useflags = false;
    for( var key in flags){ //Object.keys(flags).length > 0 would be nicer, but IE8 doesn't support Object.keys.
      useflags = true;
      break;
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
    dom.innerHTML = "";
    pui["loadJS"]({
      "path": pui.normalizeURL("/ejs/ejs.min.js"),
      "callback": function() {
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
    dom.innerHTML = pui.ejs(html);
  }
};

/**
 * Create a XLSX workbook object that can contain a worksheet and images.
 * @constructor
 * @returns {undefined}
 */
pui.xlsx_workbook = function(){
  var fileName = "sheet";
  var worksheet;
  var drawing;
  var hyperlinks;   // An array of { text:"", target:"", row:"", col:""}.
  // Let the relationship id, rId#, be +2 over the array index. E.g. hyperlink[0] is "rId2".
  
  var setPgBarStatus;           //The grid's paging bar's setTempStatus function.
  var restorePgBar;             //The grid's paging bar's draw function.
  
  this.setFileName = function(fname){
    fileName = fname;
  };
  
  /**
   * Set this workbook to contain a XLSX Worksheet.
   * @param {pui.xlsx_worksheet} wks
   * @returns {undefined}
   */
  this.setWorksheet = function(wks){
    worksheet = wks;
  };
  
  /**
   * Set this workbook to contain an XLSX Drawing.
   * @param {pui.xlsx_drawing} drwng
   * @returns {undefined}
   */
  this.setDrawing = function(drwng){
    drawing = drwng;
  };
  
  /**
   * Allows hyperlink targets (the URLs) to be generated as "relationships" in the workbook.
   * @param {Array} hlinks    Array of objects with .row, .col, and .target properties.
   * @returns {undefined}
   */
  this.setHyperlinks = function(hlinks){
    hyperlinks = hlinks;
  };
  
  /**
   * Set callbacks to functions in the PagingBar to show download progress.
   * @param {Function} setDLProg
   * @param {Function} draw
   * @returns {undefined}
   */
  this.setCallbacks = function(setDLProg, draw){
    setPgBarStatus = setDLProg;
    restorePgBar = draw;
  };
  
  /**
   * Create a xlsx file from the worksheet and cause a Save As dialog to appear in the browser asynchronously.
   * Loads the necessary JavaScript libraries if they are not loaded already.
   * @returns {undefined}
   */
  this.download = function(){
    // If necessary, load the required JSZip library and FileSaver "polyfill".
    var path = "/jszip/jszip.min.js";
    if (typeof JSZip == "function")
      loadSaveAsJS();
    else
      pui["loadJS"]({
        "path": path,
        "callback": loadSaveAsJS,
        "onerror": function(){
          console.log("Failed to load "+path);
        }
      });
  };
  
  function loadSaveAsJS(){
    var path = "/jszip/FileSaver.min.js";
    // If the script is already loaded, continue. Note: loadJS doesn't callback when a script is loaded,
    // and saveAs is never setup in IE8,IE9. Checking pui.getScript() lets export work more than once.
    if (typeof saveAs == "function" || pui.getScript(pui.normalizeURL(path)) != null )
      librariesLoaded();
    else
      pui["loadJS"]({
        "path": path,
        "callback": librariesLoaded,
        "onerror": function(){
          console.log("Failed to load "+path);
        }
      });
  }
  
  function librariesLoaded(){
    if (drawing){
      drawing.loadImages( fullyloaded, setPgBarStatus );
    }else{
      fullyloaded();
    }
  }
  
  // JSZip and the FileSaver are loaded, so build the Excel workbook.
  function fullyloaded(){    
    if (typeof setPgBarStatus == 'function') setPgBarStatus(pui["getLanguageText"]("runtimeMsg", "compressing"));

    // Boilerplate XML for any workbook. Some files that Excel normally includes are omitted: apparently 
    // docProps/core.xml, docprops/app.xml, x1/styles.xml, x1/theme/theme1.xml are not essential.

    //[Content_Types].xml
    var content_types = pui.xmlstart
    +'<Types xmlns="'+pui.xlsx_domain+'/package/2006/content-types">'
    +  '<Default Extension="rels" ContentType="'+pui.mime_openxml+'-package.relationships+xml"/>'
    +  '<Default Extension="xml" ContentType="application/xml"/>';
    if (drawing){
      var extraExtensions = drawing.getExtensions();
      for (var ext in extraExtensions ){
        content_types += '<Default Extension="'+ext+'" ContentType="'+extraExtensions[ext]+'"/>';
      }
    }
    content_types +=
       '<Override PartName="/xl/workbook.xml" ContentType="'+pui.mime_xlsx_base+'.sheet.main+xml"/>'
    +  '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="'+pui.mime_xlsx_base+'.worksheet+xml"/>'
    +  '<Override PartName="/xl/styles.xml" ContentType="'+pui.mime_xlsx_base+'.styles+xml"/>'
    +  '<Override PartName="/xl/sharedStrings.xml" ContentType="'+pui.mime_xlsx_base+'.sharedStrings+xml"/>';
    if (drawing != null){
      content_types += '<Override PartName="/xl/drawings/drawing1.xml" ContentType="'+pui.mime_openxml+'-officedocument.drawing+xml"/>';
    }
    content_types += '</Types>';

    //_rels/.rels
    var rels = pui.xmlstart
    +'<Relationships xmlns="'+pui.xlsx_xmlns_package_rels+'">'
    +  '<Relationship Id="rId1" Type="'+pui.xlsx_xmlns_officedoc_rels+'/officeDocument" Target="xl/workbook.xml"/>'
    +'</Relationships>';

    //xl/workbook.xml
    var workbook = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
    +'<workbook xmlns="'+pui.xlsx_xmlns_spreadsheet+'" xmlns:r="'+pui.xlsx_xmlns_officedoc_rels+'">'
    //Try the following 2 lines for iOS compatibility.
//    +'<workbook xmlns="'+pui.xlsx_xmlns_spreadsheet+'" xmlns:r="'+pui.xlsx_xmlns_officedoc_rels+'"'
//    +' xmlns:mc="'+pui.xlsx_domain+'/markup-compatibility/2006" mc:Ignorable="x15 xr2" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main" xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2">'
    +  '<sheets>'
    +    '<sheet name="Sheet1" sheetId="1" r:id="rId1"/>'
    +  '</sheets>'
    +'</workbook>';

    //xl/_rels/workbook.xml.rels
    var workbookrels = pui.xmlstart
    +'<Relationships xmlns="'+pui.xlsx_xmlns_package_rels+'">'
    +  '<Relationship Id="rId3" Type="'+pui.xlsx_xmlns_officedoc_rels+'/styles" Target="styles.xml"/>'
    +  '<Relationship Id="rId1" Type="'+pui.xlsx_xmlns_officedoc_rels+'/worksheet" Target="worksheets/sheet1.xml"/>'
    +  '<Relationship Id="rId4" Type="'+pui.xlsx_xmlns_officedoc_rels+'/sharedStrings" Target="sharedStrings.xml"/>'
    +'</Relationships>';

    //x1/styles.xml - at least one of each font, fill, and border is required.
    var styles = pui.xmlstart 
    +'<styleSheet xmlns="'+pui.xlsx_xmlns_spreadsheet+'">'
    +  '<fonts count="2">'
    +    '<font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font>'
    // Color theme requires theme1.xml with zero-based index to <clrScheme> referencing a <sysClr> or <srgbClr> value.
    +    '<font><u/><sz val="11"/><color rgb="0563C1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font>'
    +  '</fonts>'
    +  '<fills count="1"><fill><patternFill patternType="none"/></fill></fills>'
    +  '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
    // CellStyleFormats (Formatting Records) - at least one must exist; these are referenced as xfId="0" in cellXfs and cellStyles <xf> tags.
    +  '<cellStyleXfs count="2">'
    +    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>'  //normal font.
    +    '<xf numFmtId="0" fontId="1" fillId="0" borderId="0"/>'  //blue font for hyperlinks
    +'</cellStyleXfs>' 
    // Cell Formats - formatting applied to cells. 0-based index. Cells (<c>) refer to these in their "s" attribute.
    // numFmtIds 0-49 are not defined explicitly:
    // https://msdn.microsoft.com/en-us/library/office/documentformat.openxml.spreadsheet.numberingformat.aspx
    // To define formats not built into Excel, <numFmts><numFmt /></numFmts> must be specified for each.
    // For now, handle 2-decimal formating; everything else gets general formatting.
    +  '<cellXfs count="4">'
    +    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'   // general, no formatting.
    +    '<xf numFmtId="2" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>' //number with 2 decimal places.
    +    '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="1"/>'   // blue for hyperlink
    +    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1">'   // general, no formatting, align wrap.
    +      '<alignment wrapText="1"/>'
    +    '</xf>'
    +  '</cellXfs>'
    +  '<dxfs count="0"/>'
    +'</styleSheet>';
  
    var sheetrels;
    // Hyperlinks and drawings need sheet relationships.
    if (drawing || hyperlinks){
      sheetrels = pui.xmlstart + '<Relationships xmlns="'+pui.xlsx_xmlns_package_rels+'">';
      
      if (drawing){
        sheetrels += '<Relationship Id="rId1" Type="'+pui.xlsx_xmlns_officedoc_rels+'/drawing" Target="../drawings/drawing1.xml"/>';
      }
      if (hyperlinks != null && hyperlinks.length > 0){
        for (var i=0; i < hyperlinks.length; i++){
          sheetrels += '<Relationship Id="rId'+(i+2)+'" Type="'+pui.xlsx_xmlns_officedoc_rels+'/hyperlink" Target="'+hyperlinks[i].target+'" TargetMode="External"/>';
        }
      }
      
      sheetrels += '</Relationships>';
    }
  
    var zip = new JSZip();

    zip["file"]("[Content_Types].xml", content_types);
    zip["file"]("_rels/.rels", rels);
    zip["file"]("xl/workbook.xml", workbook);
    zip["file"]("xl/styles.xml", styles);
    zip["file"]("xl/sharedStrings.xml", worksheet.getSharedStringsXML() );
    zip["file"]("xl/_rels/workbook.xml.rels", workbookrels);
    zip["file"]("xl/worksheets/sheet1.xml", worksheet.getSheetXML() );
    if (drawing || hyperlinks){
      zip["file"]("xl/worksheets/_rels/sheet1.xml.rels", sheetrels);
      if (drawing){
        zip["file"]("xl/drawings/drawing1.xml", drawing.getDrawingXML());
        zip["file"]("xl/drawings/_rels/drawing1.xml.rels", drawing.getDrawingRelsXML());
        var images = drawing.getImages();
        for (var i=0; i < images.length; i++){
          if (images[i].image)        //If image failed to download, don't try to add 404/500 response as image.
            zip["file"]( "xl/media/"+images[i].name, images[i].image, { "binary": true } );
        }
      }
    }

    var resolved, zipconfig;
    function cleanup(){
      if (typeof restorePgBar == 'function') restorePgBar();
    }
    if ( typeof Blob != "function" ){
      // IE8,IE9 can't prompt to SaveAs, so they need PUI0009106 to help get it.
      zipconfig = {"type": "base64", "compression": "DEFLATE"};
      resolved = function (bstr){
        cleanup();
        pui.downloadAsAttachment(pui.mime_xlsx_base+".sheet", fileName + ".xlsx", bstr);
      };
    }
    else{
      // Firefox, Chrome, IE10,IE11, and Edge can prompt to save from a blob.
      zipconfig = {"type": "blob", "compression": "DEFLATE", "mimeType": pui.mime_xlsx_base+".sheet"};
      resolved = function (blob){
        cleanup();
        saveAs(blob, fileName + ".xlsx");
      };
    }
    
    var promise = zip["generateAsync"](zipconfig);
    promise["then"](resolved, cleanup);
  } //end fullyloaded().
};

/**
 * Worksheet object for creating XML strings for MS Excel 2007+ workbooks.
 * @constructor
 * @param {Number} numcols
 * @returns {undefined}
 */
pui.xlsx_worksheet = function(numcols){
  
  var me = this;
  
  var numColumns = numcols;
  var rows = null;
  var sst = {}; //Shared strings table. mapping of strings to values used in dataset.
  var sst_count = 0;
  var defaultRowHeightpx = 20;
  var colWidths = [];
  
  var curCol = 0; //Needed for this.addCell.
  
  var useDrawing = false; //When true, one drawing reference is included in the sheet xml.
  
  var hyperlinks;
  
  // Map from column index to the excel column names: 0=A, ..., 25=Z, 26=AA, etc.
  // Needed for the <dimension> tag and in each <row> tag.
  var map = [];
  
  this.formats = [];
  for (var i=0; i < numColumns; i++){
    me.formats[i] = {"dataType":"char"}; //Default all to char so unhandled types are set as literal text.
  }

  var charcounts = [];  //max number of characters in each column; to calculate <col width="">.
  var fontMaxDigitWidth = 7; //max pixel width of 11pt font.
  makemap();
  
  /**
   * Add a new row for cells to go. Grid should add cells and rows in a sequential order.
   * @returns {undefined}
   */
  this.newRow = function(){
    if (rows == null) rows = [];
    rows.push([]);
    curCol = 0;
  };
  
  /**
   * Returns the current row of the sheet. If no rows have been added, returns -1.
   * @returns {Number}
   */
  this.getCurRow = function(){
    if (rows == null) return -1;
    return rows.length - 1;
  };
  
  /**
   * 
   * @param {Number} ht   Height in pixels.
   * @returns {undefined}
   */
  this.setDefaultRowHeight = function(ht){
    defaultRowHeightpx = ht;
  };
  
  /**
   * 
   * @param {Object|Array} arr  An array with Numeric pixel values for each column in the grid.
   * @returns {undefined}
   */
  this.setColumnWidths = function(arr){
    colWidths = arr;
  };
  
  /**
   * Set a column's format internally. The format determines XLSX style and whether a column's
   * cells need to be in the Shared Strings Table. All are stored as strings except:
   *   "zoned", "packed", and "floating", which are stored as literal value.
   * @param {Number} col      The zero-based column index.
   * @param {Object} format   References bound value object from grid's me.runtimeChildren. Includes properties:
   *   dataType (date,char,zoned,time,timestamp,graphic,...); decPos (undefined,2,...); maxLength; etc.
   * @returns {undefined}
   */
  this.setColumnFormat = function(col, format){
    if (format["dataType"] != null){
      if (format["dataType"].length == 1){
        //If DB-driven grid calls setColumnFormat, then type names are in IBM format. 
        var datatype = "char";
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
        me.formats[col]["dataType"] = datatype;
      }else{
        me.formats[col]["dataType"] = format["dataType"];
      }
    }
    if (format["decPos"] != null) me.formats[col]["decPos"] = format["decPos"];
  };
  
  /**
   * Append a cell to the current row. Used in Load-all grids.
   * @param {String} value
   * @param {Null|String} format
   * @returns {Number}      Returns the column number of the cell that was added.
   */
  this.addCell = function(value, format){
    var retval = curCol;
    me.setCell(curCol, value, format);
    curCol++;
    return retval;
  };
  
  this.useDrawing = function(){
    useDrawing = true;
  };
  
  /**
   * Allows hyperlink "relationships" to be associated with cells in the grid.
   * @param {Array} hlinks    Array of objects with .row, .col, and .target properties.
   * @returns {undefined}
   */
  this.setHyperlinks = function(hlinks){
    hyperlinks = hlinks;
  };

  /**
   * Set a cell value on the last row added to the sheet.
   * @param {Number} col          The zero-based column index.
   * @param {String} value        The numeric value for the sheet, or string value for shared-strings table.
   * @param {Null|String} format  When not null, overrides the default column format.
   * @returns {undefined}
   */
  this.setCell = function(col, value, format){
    // If this is on the first row, get the column style information from each cell.
    if (rows.length == 1){
      charcounts[col] = value.length;
    }else{
      // For other rows, track the max character length of data in each column.
      charcounts[col] = Math.max(charcounts[col], value.length );
    }
    
    var fmt = me.formats[col]["dataType"];   // Default format is set per column.
    if (format != null) fmt = format;     // Cell overrides default column format.
    
    var storedVal;
    switch (fmt){
      case "floating":
      case "packed":
      case "zoned":
        storedVal = {value: value};
        break;
      // Non-integer or floating points must go into the shared strings table.
      case "char":
      case "varchar":
      case "graphic":
      // String is a data type for node designer and viewdesigner added on 2/5/19, 5f706f3.
      case "string":
      // Store time/date types as strings. In the future we could translate their values to native Excel data.
      case "date":
      case "timestamp":
      case "time":
      // The XLSX is invalid if strings get into value tags, so default all else to strings in case data type isn't defined yet.
      default:
        storedVal = sst[value];   //Reference the object from the shared strings table.
        if (storedVal == null){
          storedVal = {};
          storedVal.value = sst_count++;  //store the unique shared string and its ID, then increment the ID.
          storedVal.hasNL = /[\n\r]/.test(value);    //Determines when to add wrap alignment.
          sst[value] = storedVal;
        }
        break;
    }

    // If the cell overrides the default column format, then store as object.
    if (format != null && format != me.formats[col]["dataType"]){
      storedVal.format = format;
    }
    
    rows[rows.length - 1][col] = storedVal;
  };
  
  /**
   * Return an XML document string containing the Excel shared strings table.
   * @returns {String}
   */
  this.getSharedStringsXML = function(){
    // Order the shared strings by the index id. Assume there are no gaps in indices.
    var sst_inorder = [];
    for( var str in sst ){
      var obj = sst[str];
      var idx = obj.value;
      sst_inorder[idx] = str;
    }

    var xml = pui.xmlstart + '<sst xmlns="'+pui.xlsx_xmlns_spreadsheet+'" count="'
      + String(sst_inorder.length + 1) + '"  uniqueCount="' + String(sst_inorder.length) + '">';
    for (var i=0; i < sst_inorder.length; i++){
      xml += '<si><t>' + pui.xmlEscape(sst_inorder[i]) + '</t></si>';
    }
    xml += '</sst>';
    return xml;
  };
  
  /**
   * Return an XML document string containing the spreadsheet data.
   * @returns {String}
   */
  this.getSheetXML = function(){
    var xml = pui.xmlstart + '<worksheet xmlns="'+pui.xlsx_xmlns_spreadsheet+'"'+' xmlns:r="'+pui.xlsx_xmlns_officedoc_rels+'">'
    +'<dimension ref="A1:'+ map[numColumns - 1] + (rows == null ? 1 : rows.length) + '"/>'
    // Set the row height. Excel default is 15 point, which is 20 pixels. 0.75 * pixels = points.
    +'<sheetFormatPr defaultRowHeight="'+(defaultRowHeightpx * 0.75)+'" customHeight="1" />'
    +'<cols>' ;
    
    // Build a map [row][col] to whether a cell has a hyperlink so we later can set the style.
    var useHyperlinkStyle = {};
    if (hyperlinks != null && hyperlinks.length > 0){
      for (var i=0; i < hyperlinks.length; i++ ){
        var hlinkrow = hyperlinks[i].row;
        var hlinkcol = hyperlinks[i].col;
        if (useHyperlinkStyle[hlinkrow] == null){
          useHyperlinkStyle[hlinkrow] = {};
        }
        useHyperlinkStyle[hlinkrow][hlinkcol] = true; 
      }
    }
    
    // Configure each column with widths, and with styles for new cells.
    for (var col=0; col < numColumns; col++){
      // First, try to use the pixel width from the grid. XL col width = (pixels - 5) / 7; based on observation.
      // If widths are missing, then use the character count.
      // Calculate column width based on number of characters. Formula comes from:
      // https://msdn.microsoft.com/en-us/library/office/documentformat.openxml.spreadsheet.column.aspx
      var width = 0;
      if (colWidths[col] != null )
        width = pui.round( (colWidths[col] - 5)/7, 2);
      else if (charcounts[col] != null && ! isNaN(parseInt(charcounts[col],10)) )
        width = Math.floor((charcounts[col] * fontMaxDigitWidth + 5)/fontMaxDigitWidth * 256) / 256 + 5;
      
      if (width < 0) width = 0;    //Widths cannot be < 0 or > 255. Else width is set to 255--way too large. #5372.
      else if (width > 255) width = 255;
      
      //If the data has 2 decimal positions, use the format our style XML says is for 2 decimal positions.
      var style = me.formats[col]["decPos"] == "2" ? 's="1"' : '';
      
      xml += '<col min="'+(col+1)+'" max="'+(col+1)+'" width="'+width+'" '+style+ ' customWidth="1"/>';
    }
    xml += '</cols><sheetData>';
    
    // Output each row with either numeric data or reference to shared-strings table.
    if (rows != null) {
      for (var row=0; row < rows.length; row++){
        var r = String(row+1);
        xml += '<row r="'+r+'">';
        
        for (var col=0; col < numColumns; col++){
          xml += '<c r="' + map[col] + r + '"';
          
          var fmt = me.formats[col]["dataType"]; //Default each cell in a column to the column format.
          
          // Some cells (e.g. headers, forced dates) override default format; extract format.
          if (rows[row][col].format != null){
            fmt = rows[row][col].format;
          }
          
          switch (fmt){
            case "floating":
            case "packed":
            case "zoned":
              if(me.formats[col]["decPos"] == "2"){
                xml += ' s="1"'; //Use the 2nd cell format (defined in <cellXfs>).
              }
              break;
            case "char":
            case "varchar":
            case "graphic":
            case "string":
            // TODO: date/time values could be converted to native excel formats if all variations are handled.
            case "date":
            case "timestamp":
            case "time":
            default:
              xml += ' t="s"';
              if (useHyperlinkStyle[row] != null && useHyperlinkStyle[row][col] === true ){
                xml += ' s="2"'; //Use the 3rd cell format defined in <cellXfs>.
              }
              else if (rows[row][col].hasNL){
                xml += ' s="3"'; //If there is a newline then use the wrapText alignment style.
              }
              break;
          }

          var val = rows[row][col].value;
          if (val == null) val = '';
          xml += '><v>' + val + '</v></c>';
        }
        
        xml += '</row>';
      }
    }
    xml += '</sheetData>'; 
    if (useDrawing){
      xml += '<drawing r:id="rId1"/>';
    }
    
    // Hyperlinks reference cells; e.g. A2. Their texts are in the shared strings table.
    if (hyperlinks != null && hyperlinks.length > 0){
      xml += '<hyperlinks>';
      for (var i=0; i < hyperlinks.length; i++ ){
        var r = hyperlinks[i].row + 1;
        xml += '<hyperlink ref="'+ map[hyperlinks[i].col] + r +'" r:id="rId'+(i+2)+'" />';
      }
      xml += '</hyperlinks>';
    }
    xml += '</worksheet>';
    
    return xml;
  };

  /**
   * Fill the map of column indexes to excel-style column names for as many columns as needed.
   * @returns {undefined}
   */
  function makemap(){
    var mapctr = 0;

    var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var d3 = "";
    var d2 = "";

    // Loop over the digits to create the map for as many columns that are used.
    // The left-most digit is blank until the 2nd and 3rd pass ZZ.
    for(var i=-1; i < 26 && mapctr < numcols; i++){

      var d2start = -1; //Let the k loop run once with no 2nd digit; then 2nd digits are included.
      if (i >= 0) d2start = 0;  //passed ZZ: 2nd digit should start at "A" instead of "".

      // Loop for the middle digit, which is blank until the 3rd digit passes Z the first time.
      for(var j=d2start; j < 26 && mapctr < numcols; j++){

        for(var k=0; k < 26 && mapctr < numcols; k++){
          map[mapctr] = d3 + d2 + digits[k];
          mapctr++;
        }
        d2 = digits[(j + 1) % 26 ];    //get the next digit; wraps around to 0 if next is 26.
      }
      d3 = digits[i + 1]; //note: the last time this runs, it will return undefined; but no matter.
    }
  }
  
};

/**
 * Object for creating XML strings for MS Excel 2007+ picture references.
 * @constructor
 * @returns {undefined}
 */
pui.xlsx_drawing = function(){
  
  var nameCtr = 1;     //Counter of image names.
  var extensions = {}; //File extensions needed for the different types of images.
  var rels = [];       //List of relationships; e.g. rId1 is ../media/image1.png, etc.
  var anchors = [];    //List of row/columns and relationship IDs.
  
  /**
   * Add URI and dimensions of an image to the drawing. 
   * @param {Number} row
   * @param {Number} column
   * @param {String} imageURI   This should already be right-trimmed.
   * @param {Object} dimens     Dimensions: top, left, width, height numeric values in pixels.
   *                            These should never be null or undefined.
   * @returns {undefined}
   */
  this.addImage = function(row, column, imageURI, dimens){
    var matches = imageURI.match(/\.(jpe?g|gif|png|tiff?)(\?.*)?(#.*)?$/i); //URL may end in query or fragment; e.g. ?r=12345#something
    if (matches == null){
      console.log("Unsupported image type in URI:",imageURI);
      return;
    }
    var ext = matches[1].toLowerCase();   //Upper-case content-types will break the spreadsheet. #5356.
    if (ext == "jpeg") ext = "jpg";
    else if (ext == "tif") ext = "tiff";  //Excel expects image/tiff as content-type.
    
    //Look for the URL in a list of existing URLs.
    var rel = -1;
    for (var i=0; i < rels.length; i++){
      if (rels[i].uri == imageURI ){
        rel = i;
        break;
      }
    }
    if (rel < 0 ){   //There isn't a relationship for the URI; add it.
      //Generate a new image name: Use the image name counter for base name.
      var newName = "image"+nameCtr + "." + ext;
      nameCtr++;
      
      //Choose the appropriate content-type: png: image/png; etc. Add to a collection.
      extensions[ext] = "image/"+ext;
      
      rels.push({ name: newName, uri: imageURI });    //Store the relationship. 
      rel = rels.length - 1;
    }
    //Store the picture position, rId, and dimensions.
    anchors.push({row: row, col: column, rel: rel,
      top: dimens.top, left: dimens.top, width: dimens.width, height: dimens.height
    });
  };
  
  // returns XML text for drawing1.xml
  this.getDrawingXML = function(){
    var xml = pui.xmlstart
    + '<xdr:wsDr xmlns:xdr="'+pui.xlsx_domain+'/drawingml/2006/spreadsheetDrawing" xmlns:a="'+pui.xlsx_domain+'/drawingml/2006/main">';
    for (var i=0; i < anchors.length; i++){
      xml +=
      '<xdr:twoCellAnchor editAs="oneCell">'
      + '<xdr:from>'
      +   '<xdr:col>'+anchors[i].col+'</xdr:col>'
      // Offsets are in English Metric Units (EMU): 914400 EMU per inch. At 96 pixels per inch, a pixel is 9525 EMUs.
      // https://msdn.microsoft.com/en-us/library/ff531172(v=office.12).aspx
      +   '<xdr:colOff>'+ Math.round(anchors[i].left * 9525) +'</xdr:colOff>'
      +   '<xdr:row>'+anchors[i].row+'</xdr:row>'
      +   '<xdr:rowOff>'+ Math.round(anchors[i].top * 9525) +'</xdr:rowOff>'
      + '</xdr:from>'
      + '<xdr:to>'
      +   '<xdr:col>'+anchors[i].col+'</xdr:col>'
      +   '<xdr:colOff>'+ Math.round((anchors[i].width + anchors[i].left)*9525) +'</xdr:colOff>'
      +   '<xdr:row>'+anchors[i].row+'</xdr:row>'
      +   '<xdr:rowOff>'+ Math.round((anchors[i].height + anchors[i].top)*9525) +'</xdr:rowOff>'
      + '</xdr:to>'
      + '<xdr:pic>'
      + '<xdr:nvPicPr>'
      +   '<xdr:cNvPr id="'+(i+1)+'" name="Picture '+(i+1)+'"/>'
      +   '<xdr:cNvPicPr>'
      +     '<a:picLocks noChangeAspect="1" noChangeArrowheads="1"/>'
      +   '</xdr:cNvPicPr>'
      + '</xdr:nvPicPr>'
      +   '<xdr:blipFill>'
      +     '<a:blip xmlns:r="'+pui.xlsx_xmlns_officedoc_rels+'" r:embed="rId'+(anchors[i].rel + 1)+'">'
      +     '</a:blip>'
      +     '<a:srcRect/>'
      +     '<a:stretch>'
      +       '<a:fillRect/>'
      +     '</a:stretch>'
      +   '</xdr:blipFill>'
      +   '<xdr:spPr bwMode="auto">'
      +     '<a:xfrm>'    //Note: Excel adds some "a" tags to xfrm. Omitting them seems fine.
      +     '</a:xfrm>'
      +     '<a:prstGeom prst="rect">'
      +       '<a:avLst/>'
      +     '</a:prstGeom>'
      +     '<a:noFill/>'
      +   '</xdr:spPr>'
      + '</xdr:pic>'
      + '<xdr:clientData/>'
      + '</xdr:twoCellAnchor>';
    }
    xml += '</xdr:wsDr>';
    return xml;
  };
  
  /**
   * Returns XML text for drawing1.xml.rels
   * @returns {String}
   */
  this.getDrawingRelsXML = function(){
    var xml = pui.xmlstart
    + '<Relationships xmlns="'+pui.xlsx_xmlns_package_rels+'">';
    for (var i=0; i < rels.length; i++){
      xml += '<Relationship Id="rId'+(i+1)+'" Type="'+pui.xlsx_xmlns_officedoc_rels + '/image" Target="../media/'+ rels[i].name +'"/>';
    }
    xml += '</Relationships>';
    return xml;
  };
  
  /**
   * Download the images into this drawing object, then execute a callback.
   * @param {Function} cbFinished       Runs when all images are loaded into blobs.
   * @param {Function} cbSetTempStatus  Sets the PagingBar's temporary status text.
   * @returns {undefined}
   */
  this.loadImages = function(cbFinished, cbSetTempStatus){
    if (rels.length < 1){   //It's possible image URLs didn't parse, but don't stop the download. #5342.
      cbFinished();
      return;
    }
    
    var dlcount = 0;
    
    //Handler for XHR.onload. Waits until all XHRs are finished, moves the images to rel[i].image, then calls callback.
    function checkDone(){
      dlcount++;
      cbSetTempStatus( pui["getLanguageText"]("runtimeMsg", "downloading x", [ Math.round(100 * (dlcount / rels.length))+"%" ]) );
      if (dlcount < rels.length) return;  //Wait until all xhr's are finished.
      
      //All are finished, so extract the images.
      for (var i=0; i < rels.length; i++){
        if (rels[i].xhr.status == 200 ) rels[i].image = rels[i].xhr.response;
        rels[i].xhr = null;
        try{  delete rels[i].xhr;  }catch(exc){}
      }
      cbFinished();
    }
    
    //Make XHRs for each image, and download all asynchronously.
    for (var i=0; i < rels.length; i++){
      rels[i].xhr = new XMLHttpRequest();
      rels[i].xhr.open("GET", rels[i].uri, true );
      rels[i].xhr["responseType"] = "blob";
      rels[i].xhr.onload = checkDone;
      rels[i].xhr.send();
    }
  };
  
  /**
   * Return an array of objects: {name: imageName, image: blob }
   * The images should have already been loaded with loadImages.
   * @returns {Array}
   */
  this.getImages = function(){
    return rels;
  };
  
  /**
   * Return a collection of file extensions for all images in the drawing.
   * @returns {Object}
   */
  this.getExtensions = function(){
    return extensions;
  };
};

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
pui.getFieldDescriptions = function(parm, cb){
  var library=parm["library"] || "", 
      file=parm["file"] || "", 
      customSql=parm["customSql"] || "";
    if (context == "genie") url = getProgramURL("PUI0009101.PGM");
    if (context == "dspf") url = getProgramURL("PUI0009101.PGM", null, true);  // use auth
    var request = new pui.Ajax(url);
    request["async"] = true;
    request["method"] = "post";
    request["postData"] = "file=" + encodeURIComponent(file);
    request["postData"] += "&library=" + encodeURIComponent(library);
    request["postData"] += "&customSql=" + encodeURIComponent(customSql);
    if (pui["isCloud"]) request["postData"] += "&workspace_id=" + pui.cloud.ws.id;
    
    if (context == "genie") request["postData"] += "&AUTH=" + GENIE_AUTH;
    request["postData"] += "&context=" + context;
    request["suppressAlert"] = true;
  var theCallback = function() {
    cb(request);
  };
    request["onready"] = theCallback;
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
   catch(err) {
     pui.scriptError(err, "OndbLoad Error:\n");
     return false;
   }

   return true;
};

pui.scriptError = function(error, prefix) {
  
  if (pui["alert script errors"] === false) {
    
    if (window.console && window.console.error) {
     
      if (error.stack) { // Stack is not available on IE < 10
        
        // FireFox does not include the error message in the first entry.
        var message = error.stack.split("\n");
        if (message[0] != error.toString())
          message.splice(0, 0, error.toString());
        message = message.join("\n");
        
        if (prefix != null)
          message = prefix + message;
        console.error(message);
      
      }
      else {

        var message = error.toString();
        if (prefix != null)
          message = prefix + message;
        console.error(message);
       
      }
      
    }
    
  }
  else {
    
    var message = error.message;
    if (prefix != null)
      message = prefix + message;
    pui.alert(message);
    
  }
  
};

pui.preFetchFontFiles = function() {
  // The preload font api is still not supported in every browser
  // One way to prefetch the icons is to make hidden divs that that
  // use the CSS classes so that the browser will automattically fetch
  // the icon files. 
  var iconFileList = [
    'pui-material-icons',
    'pui-fa-icons',
    'blueprint-defaults',
    'office-copy-defaults'
  ];
  iconFileList.forEach(function(iconClass) {
    var div = document.createElement('div');
    div.innerText = 'face';
    div.className = iconClass;
    div.style.visibility = 'hidden';
    div.style.left = '-1000px';
    div.style.position = 'absolute';
    document.body.appendChild(div);
  });
};

pui.fetchMonacoIntelliSenseLibraries = function () {
  if (pui["useAceEditor"] || pui["is_ie"] || pui["ie_mode"] <= 11) return;
  ['profoundjs.d.ts', 'profoundui.d.ts'].forEach(function(file) {
    var url = '/profoundui/proddata/typings/' + file;
    var request = new pui.Ajax(url);
    request["async"] = true;
    request["headers"] = { "Content-Type": "text/plain" };
    request["overrideMimeType"] = 'text/plain';
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
 * A generic method to attach mousedown on an element, and mouseup and mousemove listeners are also attached.
 * @param {Object} params
 *   attachto:  element(s) to attach the mousedown. May be element or array of elements. Listener attaches to all.
 *   mousedown: Implementation specific function; Is provided a reference object with .cursorStartX and .cursorStartY.
 *   mousemove: Implementation specific function; Is provided a reference object with .x and .y.
 *   downcb:    optional Function. callback for mousedown.
 *   movecb:    optional Function. callback for mousemove.
 *   upcb:      optional Function. callback for mouseup.
 *   opacity:   optional Number (integer). Default no change. When set, change the percent opacity of the opEl element to this value
 *                from mousedown until mouseup.
 *   opel:      optional Object. Element whose opacity is set on mousedown and cleared on mouseup.
 * @returns {undefined}
 */
pui.listenMouse = function(params){
  var ref = {};
  
  if (params.attachto instanceof Array){
    for (var i=0; i < params.attachto.length; i++){
      params.attachto[i].addEventListener('mousedown', mousedown);
    }
  }
  else if(params.attachto != null){
    params.attachto.addEventListener('mousedown', mousedown);
  }
  
  function mousedown(e){
    preventEvent(e); //prevent selection start.
    var xy = pui.getMouseXY(e);
    ref.cursorStartX = xy.x;
    ref.cursorStartY = xy.y;
    params.mousedown(ref);
    
    if (typeof params.opacity === 'number'){
      params.opel.style.filter = 'alpha(opacity='+params.opacity+')';   //IE
      params.opel.style.opacity = '0.'+params.opacity;
    }
    
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
    
    if (typeof params.downcb === 'function') params.downcb(ref);
  }

  function mousemove(e){
    var xy = pui.getMouseXY(e);
    ref.x = xy.x;
    ref.y = xy.y;
    params.mousemove(ref);
    
    if (typeof params.movecb === 'function') params.movecb(ref);
  }

  function mouseup(){
    removeEvent(document, 'mousemove', mousemove);
    removeEvent(document, 'mouseup', mouseup);
    if (typeof params.upcb === 'function') params.upcb(ref);
    if (typeof params.opacity === 'number'){
      params.opel.style.filter = '';
      params.opel.style.opacity = '';
    }
    ref = {};
  }
};

/**
 * Attach a mousedown listener on an element allowing an element to be moved by dragging the mouse.
 * Assume the listener is destroyed when the element is. Element can be fully or partially prevented from going off screen/container.
 * @param {Object} params  Properties:
 *   attachto:  element(s) to attach the mousedown. May be element or array of elements. Listener attaches to all.
 *   move:      element to move by setting its .style.top and .style.left. 
 *              Or element to resize by setting its .style.height and/or .style.width.
 *   boundat:   optional. defaults to 'border'. 'click' makes panel stop at bounds where mouse was clicked.
 *   lbound:    optional. default to 0. Left bound.
 *   tbound:    optional. default to 0. Top bound.
 *   rbound:    optional. default to no bounds. Right bound.
 *   bbound:    optional. default to no bounds. Bottom bound.
 *   downcb:    optional Function. callback for mousedown.
 *   movecb:    optional Function. callback for mousemove.
 *   upcb:      optional Function. callback for mouseup.
 *   opacity:   optional Number (integer). Default no change. When set, change the percent opacity of the moved element to this 
 *                from mousedown until mouseup.
 */
pui.makeMovable = function(params){
  if (typeof params.lbound !== 'number') params.lbound = 0;
  if (typeof params.tbound !== 'number') params.tbound = 0;
  var mousemoveF = params.boundat === 'click' ? moveBoundAtClick : moveBoundAtBorder;
  
  pui.listenMouse({attachto: params.attachto, downcb: params.downcb, movecb: params.movecb, upcb: params.upcb,
    opacity: params.opacity, opel: params.move, mousedown: mdown, mousemove: mousemoveF });
  
  function mdown(ref){
    ref.startX = params.move.offsetLeft;
    ref.startY = params.move.offsetTop;
  }
  
  // Move the element, but prevent the part where the mouse was clicked from going past the bounds; e.g. Panel gets dragged partially off screen.
  function moveBoundAtClick(ref){
    if (ref.x < params.lbound) ref.x = params.lbound;
    if (ref.y < params.tbound) ref.y = params.tbound;
    if (typeof params.rbound === 'number' && ref.x > params.rbound) ref.x = params.rbound;
    if (typeof params.bbound === 'number' && ref.y > params.bbound) ref.y = params.bbound;
    
    params.move.style.left = (ref.startX - ref.cursorStartX + ref.x) + 'px';
    params.move.style.top = (ref.startY - ref.cursorStartY + ref.y) + 'px';
  }
  // Move the element, but prevent its left and top from going past the bounds--off screen or out of container.
  function moveBoundAtBorder(ref){
    var newx = ref.startX + ref.x - ref.cursorStartX;
    var newy = ref.startY + ref.y - ref.cursorStartY;
    if (newx < params.lbound) newx = params.lbound;
    if (newy < params.tbound) newy = params.tbound;
    if (typeof params.rbound === 'number' && newx > params.rbound) newx = params.rbound;
    if (typeof params.bbound === 'number' & newy > params.bbound) newy = params.bbound;
    
    params.move.style.left = newx + 'px';
    params.move.style.top = newy + 'px';
  }
};

/**
 * Allow an element to be resized.
 * @param {Object} params
 *   attachto:  element to attach the mousedown. Assume the attachto element is on the border of the resizeEl and moves when resizeEl changes.
 *   resizeEl:  element to resize by setting its .style.height and/or .style.width.
 *   resize:    1=width (default), 2=height, 3=both.
 *   minw:      optional. default to 0. Minimum width.
 *   maxw:      optional. default to no bounds. Maximum width.
 *   minh:      optional. default to 0. Minimum height.
 *   maxh:      optional. default to no bounds. Maximum height.
 *   downcb:    optional Function. callback for mousedown.
 *   movecb:    optional Function. callback for mousemove.
 *   upcb:      optional Function. callback for mouseup.
 */
pui.makeResizable = function(params){
  if (typeof params.minw != 'number' || params.minw < 0) params.minw = 0;
  if (typeof params.minh != 'number' || params.minh < 0) params.minh = 0;
  if (typeof params.resize != 'number' || params.resize < 1 || params.resize > 3) params.resize = 1;
  var doWidth = (params.resize & 1) == 1;  //true for 1 or 3.
  var doHeight = (params.resize & 2) == 2; //true for 2 or 3.
  
  pui.listenMouse({attachto: params.attachto, mousedown: mdown, mousemove: mmove,
    downcb: params.downcb, movecb: params.movecb, upcb: params.upcb  });
  
  function mdown(ref){
    ref.startX = params.resizeEl.offsetWidth;
    ref.startY = params.resizeEl.offsetHeight;
  }
  function mmove(ref){
    if (doWidth){
      var width = ref.startX + ref.x - ref.cursorStartX;
      if (width < params.minw) width = params.minw;
      if (typeof params.maxw === 'number' && width > params.maxw) width = params.maxw;
      params.resizeEl.style.width = width + 'px';
      ref.width = width;
    }
    if (doHeight){
      var height = ref.startY + ref.y - ref.cursorStartY;
      if (height < params.minh) height = params.minh;
      if (typeof params.maxh === 'number' && height > params.maxh) height = params.maxh;
      params.resizeEl.style.height = height + 'px';
      ref.height = height;
    }
  }
};

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
  if (context == "dspf") {
    if (!pui.screenIsReady) return;
    var target = getTarget(e);
    
    // Don't set modified when target is ready only
    if (target.pui && target.pui.properties["read only"] === "true")
      return;

    target.modified = true;
    if (target.parentNode != null && target.parentNode.comboBoxWidget != null) {
      target = target.parentNode;
      target.modified = true;
    }
    pui.modified = true;
    if (target.id != null && target.id.indexOf(".") == -1 && formatName) {
      // not a subfile field being modified
      pui.ctlRecModified[formatName] = true;
    }

    if ((window["React"] || window["Vue"]) && target.pui.data && target.pui.dataProp) {
      setTimeout(function() {  // allow the change to take affect before caputring the value
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
    var target = getTarget(e);
    if (target == null) return;
    var fieldInfo = target.fieldInfo;
    if (fieldInfo == null) return;
    var idx = fieldInfo["idx"];
    if (idx == null) return;
    idx = String(idx);
    if (target.guiIndex != null) idx = "s" + idx + "." + target.guiIndex;
    pui.response[idx] = target;

    // Allow SNGCHCFLD radio buttons to be unchecked if allowRadioClear is set true.
    if (target.type == "radio" && pui["genie"]["allowRadioClear"] && target.className.indexOf("selection-field-single") >= 0){
      if (e.type == "click"){
        // Delay handling until after "change" so we can know the field just changed. Not all browsers
        // fire click before change, so the timeout also makes this approach cross-browser safe.
        setTimeout(function(){
          if (pui["ie_mode"] == 8 && target.checked != target.puiinitial ) target.justChanged = true;
          if (target.checked && !target.justChanged ) target.checked = false;
          target.justChanged = false;
        },0);
      }
      else if (e.type == "change"){
        target.justChanged = true;
      }
    } //done special handling of SNGCHCFLD.
  }
};

pui.dupKey = function(event) {
  event = event || window.event;
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
    value = value.substr(0, pos );
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
pui.ensureRegExFrom = function(stringOrObj, forceGlobal){
  var regex = stringOrObj;
  if (typeof stringOrObj === "string" && stringOrObj.length > 0){
    var flags = forceGlobal ? "ig" : "i";
    regex = new RegExp(stringOrObj, flags);
  }
  
  if ( typeof regex === "object" && regex instanceof RegExp ){
    if (forceGlobal && !regex.global){
      regex = new RegExp(regex.source, "ig");  //Pattern must be global.
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
pui.replaceProblemCaseChars = function(str, toLower){
  if (str == null) return str;
  return toLower ? str.replace(/\u1E9E/g, "\u00DF") : str.replace(/\u00DF/g, "\u1E9E");
};

/**
 * Listener for input events on a couple of Genie input elements.
 * Ensure typed or pasted ß characters become the upper-case version to avoid becomming "SS". Issue 5369. See also 5785 for test cases.
 * @param {Object} e
 */
pui.onProblemInput = function(e){
  if (e.target.value.match(/\u00DF/)){
    // Only adjust the value if the target matches ß. Avoid IE11 in Win7-8 focus jumping bug. Issue 5785.
    var cursorOrigPosition = e.target.selectionStart;
    e.target.value = pui.replaceProblemCaseChars(e.target.value, false);
    if (pui["is_ie"]){
      // position the cursor to the original cursor position. Needed for Windows 7-8. Issue 5785.
      e.target.setSelectionRange( cursorOrigPosition, cursorOrigPosition );
    }
  }
};

/*
 * Return a number representing units of change for a mouse wheel's Y value, returning the same number for different browser implementations of wheel.
 * @param {Object} event
 * @returns {Number}
 */
pui.normalizeWheelDelta = function(event){
  var delta = 0;
  if (pui['is_firefox']) {
    // In Firefox, deltaY is multiple of 3, negative = wheel pushed forward/up, positive = wheel pulled back/down. deltaMode: 1
    delta = event.deltaY / 3;
  }
  else if (pui['is_ie']){
    if (event.wheelDelta){
      delta = event.wheelDelta / -120;   //The event is a deprecated MouseWheel instead of the recommened standard, WheelEvent. Sign is reversed.
    }
    else {
      // IE10-11, deltaY is multiple of 144.3000030517578, same sign as Firefox.   deltaMode: 0.
      // Edge, deltaY is multiple of 144.4499969482422, same sign as Firefox. deltaMode: 0. also has "wheelDeltaY": 120.
      delta = event.deltaY / 144;  
    }
  }
  else if (pui['is_chrome']) {
    if (event.wheelDelta) {   //Edge started being considered Chrome, but its wheelDelta value exists for WheelEvents, and the number is different than Chrome. 1/23/2020.
      delta = event.wheelDelta / -120;
    }
    else {
      // Chrome, deltaY is multiple of 100, same sign as Firefox.    deltaMode: 0.
      delta = event.deltaY / 100;
    }
  }
  else if (pui['is_safari']){
    // Safari, deltaY is multiple of 4.000244140625, same sign as Firefox. deltaMode: 0. also has "wheelDeltaY": 12.
    delta = event.deltaY / 4;
  }
  else if (typeof event.deltaY == 'number' && (event.deltaY > 0 || event.deltaY < 0)){
    if (event.wheelDelta) {   //Browser is Opera.
      delta = event.wheelDelta / 120;
    }
    else {
      delta = event.deltaY / event.deltaY; //Handle other, let value be either +1 or -1. Assume sign is same as other browsers.
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
pui.formatBytes = function(bytes, precision){
  var units = ["B", "KB", "MB", "GB", "TB"];
  bytes = Math.max(bytes, 0);
  var pow = Math.floor((bytes ? Math.log(bytes) : 0) / Math.log(1024));
  pow = Math.min(pow, units.length - 1);
  bytes = bytes / Math.pow(1024, pow);
  precision = (typeof(precision) == "number" ? precision : 0);

  return (Math.round(bytes * Math.pow(10, precision)) / Math.pow(10, precision)) + " " + units[pow];
};

/**
 * For events on HTML table cells, get the parent row. If the event is not on the cell (e.g. on an input in the cell), returns null.
 * @param {Object|Event} event
 * @returns {Object|Null}
 */
pui.getTRtargetRow = function(event){
  // Note: we must use getTarget to handle #text nodes. Otherwise drag_leave leaves classes set when dragging quickly.
  var target = getTarget(event); 
  if (target.tagName == "TD") target = target.parentNode;
  if (target.tagName != "TR") return null;
  return target;
};

/**
 * Utility for deleting class members. This should be called by pui.deleteOwnProperties.apply(this) or .call(this) 
 * within a prototype.destroy method.
 */
pui.deleteOwnProperties = function(){
  if (this != window){
    var propnames = Object.getOwnPropertyNames(this);
    for (var i=0, n=propnames.length; i < n; i++){
      try {
        delete this[propnames[i]];  //Removes any properties that were assigned like: "this.foo = bar";.
      }
      catch(exc) {
        console.log(exc);
      }
    }
  }
};

////////////
//////////// Todo: put this in a separate file, joins.js
////////////

/* 
 * Copyright (c) 2020 Profound Logic Software, Inc.
 * Proprietary code--not open source.
 */

pui.joins = {};

/**
 * An object to contain all JoinableTable objects and provide methods for creating the SVG and info elements.
 * @param {Object} params 
 * @constructor
 */
pui.joins.JoinArea = function(params){

  // Public
  /**
   * @type Array.<pui.joins.JoinableTable>
   */
  this.joinableTables = [];
  
  // DOM elements.
  this.infobox = null;
  this.domEl = null;
  this.svg = null;
  
  // Tree used to manage which joins are valid. Expect code that calls init() to construct this.
  this.filetree = null;
  
  // Right and bottom bounds (if defined) for dragging JoinTables inside the DOM element.
  this.moveRbound = params.moveRbound ? params.moveRbound : 2000;
  this.moveBbound = params.moveBbound ? params.moveBbound : 1000;
  
  // For primary keys, this text goes to the right of column names. 9911 is Chiron, which looks like a key.
  this.primaryKeyMarker = params.primaryKeyMarker ? params.primaryKeyMarker : ' &#9911;';
  
  this.movetimeout = null;    //Slow SVG expanding should not happen each time mousemove fires.
  
  this.joineditor = null; //A dialog for modifying the join type or removing the join.
  
  this.joinStrokeColor = "rgb(135,135,135)"; //Value for the stroke and fill attributes of join lines.
  this.joinLinkColor = "rgb(0,0,255)";       //Value for fill attribute of join line middle shape.
  
  /*
   * Helpful for working around drag/drop data transfer quirks. Note: dataTransfer only works with strings, so this will be a TR.
   * @type Element
   */
  this.joinSourceTR = null;
};

/**
 * Set the internal DOM element, create and add web elements to the DOM element. Construct FileTree and JoinEditor.
 * Expect this to be loaded after the document.body has loaded.
 * @param {Object|Element} domEl 
 * @param {FileTree|undefined} filetreeConst      A FileTree constructor. defaults to pui.joins.FileTree.
 * @param {JoinEditor|undefined} joineditorConst  A JoinEditor constructor. defaults to pui.joins.JoinEditor.
 */
pui.joins.JoinArea.prototype.init = function(domEl, filetreeConst, joineditorConst){
  this.domEl = domEl;

  this.svg = document.createElementNS(pui.SVGNS, "svg");
  this.svg.setAttribute("width","100%");
  this.svg.setAttribute("height","100%");
  this.svg.setAttribute("class","join");
  domEl.appendChild(this.svg);
  
  if (filetreeConst == null) filetreeConst = pui.joins.FileTree;
  this.filetree = new filetreeConst(this);
  
  if (joineditorConst == null) joineditorConst = pui.joins.JoinEditor;
  this.joineditor = new joineditorConst(this);
  this.joineditor.init();
};

/**
 * Add a JoinableTable to this JoinArea list, add it to the DOM, and render it.
 * @param {JoinableTable} jt
 */
pui.joins.JoinArea.prototype.addAndRenderTable = function(jt){
  jt.joinArea = this;
  this.joinableTables.push(jt);
  if (!this.filetree.hasRoot()) this.filetree.setRoot(jt);  //The first table added becomes FileTree root.
  jt.render();
  this.domEl.appendChild(jt.table);
};

/**
 * Destroy and remove all JoinableTables.
 */
pui.joins.JoinArea.prototype.clearTables = function(){
  while (this.joinableTables.length > 0) {
    if (this.joinableTables[0]){
      this.joinableTables[0].destroy();
    }
    this.joinableTables.shift();
  }
};

/**
 * Show an infobox inside the JoinArea element.
 * @param {String} text
 */
pui.joins.JoinArea.prototype.showInfobox = function(text){
  if (!this.infobox){
    this.infobox = document.createElement('p');
    this.infobox.className = 'joininfobox';
    this.domEl.appendChild(this.infobox);
  }
  this.infobox.innerHTML = text;
  this.infobox.style.visibility = 'visible';
};

pui.joins.JoinArea.prototype.hideInfobox = function(){
  if (this.infobox) this.infobox.style.visibility = 'hidden';
};

/**
 * Make the SVG section larger when tables are moved beyond the parent area. Called directly in JumpStart after "Retrieve Fields"
 * adds tables and when tables are moved via mouse as a callback bound to a JoinArea object. 
 * @param {undefined|pui.joins.JoinArea} joinArea  When called from a timeout, the parameter is a JoinArea object; "this" won't be set.
 */
pui.joins.JoinArea.prototype.expandSvg = function(joinArea){
  if (joinArea == null) joinArea = this;    //When called directly on a JoinArea object, "this" is the JoinArea object.
  // Find the lowest table and expand the SVG so that all elements are visible.
  var height = 200, width = 400;
  for (var i=0, n=joinArea.joinableTables.length; i < n; i++){
    var bot = joinArea.joinableTables[i].getBottom();
    var right = joinArea.joinableTables[i].getRight();
    height = Math.max(height, bot);
    width = Math.max(width, right);
  }
  height = Math.min(height, joinArea.moveBbound);  //avoid being too large in case drag loses control.
  width = Math.min(width, joinArea.moveRbound);
  joinArea.svg.setAttribute("height", height  + "px");
  joinArea.svg.setAttribute("width", width  + "px");
};

/**
 * Clear existing timeout and set the SVG section to expand in the future.
 * @param {Number} milliseconds
 */
pui.joins.JoinArea.prototype.queueExpand = function(milliseconds){
  clearTimeout(this.movetimeout);
  // Note: use parameter instead of bind on expandSvg, because bind allocates a new function every time it is called, which is often in mousemove.
  this.movetimeout = setTimeout(this.expandSvg, milliseconds, this);
};

/**
 * Detect if a join can be made, fetch the join parameters, and create a join.
 * @param {Object} target_tr            The row being dropped onto.
 * @param {Object} origin_tr            The row dragged from.
 * @param {String|undefined} joinType   INNER, LEFT, RIGHT.
 */
pui.joins.JoinArea.prototype.joinLinkRows = function(target_tr, origin_tr, joinType){
  var targetFileId = target_tr.joinableTable.id;
  var sourceFileId = origin_tr.joinableTable.id;
  if (this.filetree.contains(targetFileId) && this.filetree.contains(sourceFileId)){
    // Both tables are connected in the tree to main already. Allow adding conditions
    // to an existing join; don't allow joining two child nodes (that would create a graph cycle).
    var join = this.filetree.getJoinBetweenNodes(target_tr.joinableTable, origin_tr.joinableTable);
    if (join != null){
      // A join was found for the tables. Determine which TR is the parent and
      // which is the child. Then check if this condition already exists.
      var parentTR, childTR;
      if (targetFileId == join.parentTable.id){    //1st argument is the parent table.
        if (sourceFileId == join.childTable.id){  //2nd argument is child.
          parentTR = target_tr;
          childTR = origin_tr;
        }
      }
      else if (sourceFileId == join.parentTable.id){  //2nd argument is the parent table.
        if (targetFileId == join.childTable.id){  //1st argument is the child
          parentTR = origin_tr;
          childTR = target_tr; 
        }
      }
      
      if (parentTR != null && childTR != null){
        var exists = join.conditionExists(parentTR.fieldId, childTR.fieldId);
        if (exists === false){
          // A join between the two fields doesn't already exist, so add it.
          join.addCondition(parentTR, childTR);
        }
      }
      else {
        console.log("Failed to determine parent-child relationship.");
      }
    }
  }
  else if(this.filetree.contains(targetFileId)){
    // Add the drag origin as a child of the drag target, creating a new join.
    this._addLink(target_tr, origin_tr, joinType);
  }
  else if(this.filetree.contains(sourceFileId)){
    // Add the drag target as a child of the drag origin, creating a new join.
    this._addLink(origin_tr, target_tr, joinType);
  }
};

/**
 * Link the child file to the parent file.
 * @param {Object} parent_tr
 * @param {Object} child_tr
 * @param {String|Undefined} joinType
 */
pui.joins.JoinArea.prototype._addLink = function(parent_tr, child_tr, joinType){
  var parentId = parent_tr.joinableTable.id;

  if (this.filetree.contains(parentId)){
    var parent = this.filetree.getNode(parentId);
    if (!parent){
      console.log("Tree failed to find parent file:",parentId);
    }
    else {
      var join = new pui.joins.Join(this, parent_tr, child_tr, joinType);
      join.drawConnectors();

      this.filetree.addNode(child_tr.joinableTable);  //Add to quick list.
    }
  }
};

/**
 * Find and return a JoinableTable in the JoinArea given an id.
 * @param {String} id
 * @returns {JoinableTable|undefined}
 */
pui.joins.JoinArea.prototype.getTable = function(id){
  for (var i=0, n=this.joinableTables.length; i < n; i++){
    if (this.joinableTables[i].id == id) return this.joinableTables[i];
  }
};

/**
 * Given a tree of JSON objects representing saved Join data, load the tree into JoinableTables and create joins.
 * @param {Object} root
 * @param {Function|undefined} tableFoundCb    Called for each file/table found in the tree. Passed a joinableTable and a node.
 * @param {Function|undefined} joinLinkedCb    Called after a join is made on two fields.
 */
pui.joins.JoinArea.prototype.loadJoins = function(root, tableFoundCb, joinLinkedCb){
  // Breadth-first traversal of the join node tree.
  var i, v, w, cond;
  var queue = [ root ];
  root.visited = true;

  while (queue.length > 0){
    v = queue.shift();
    var myvarname = v["varname"];

    // Position the join tables as they were when saved.
    var joinableTable = appgen.joinArea.getTable(myvarname);
    if (joinableTable){
      if (v["xy"] instanceof Array) joinableTable.setLeftTop(v["xy"]);
      if (typeof tableFoundCb == 'function') tableFoundCb(joinableTable, v);
      var myrows = joinableTable.tableBody.rows;
      if (v["joinP"] != null){
        var parentVarname = v.parent["varname"];
        joinableTable = appgen.joinArea.getTable(parentVarname);
        if (joinableTable){
          var parentrows = joinableTable.tableBody.rows;
          
          // Look at each condition. Find the rows in the child and parent tables matching those.
          for (i=0, cond; (cond = v["joinP"]["conditions"][i]); i++){
            var currow, parentrow, myrow, j;
            for (j=0; (currow = parentrows[j]); j++){
              if (cond["parentField"] == currow.fieldId){
                parentrow = currow;
                break;
              }
            }
            for (j=0; (currow = myrows[j]); j++){
              if (cond["childField"] == currow.fieldId){
                myrow = currow;
                break;
              }
            }

            if (parentrow != null && currow != null){
              this.joinLinkRows(parentrow, myrow, v["joinP"]["type"]);
              if (typeof joinLinkedCb == 'function') joinLinkedCb();
            }
            else {
              console.log('Failed to find tables matching the join fields:', cond["parentField"], cond["childField"]);
            }
          }
        }
      }
    }

    if (v.childNodes != null){
      for (i=0; (w = v.childNodes[i]); i++){
        if (w.visited !== true){
          w.visited = true;
          w.parent = v;
          queue.push(w);
        }
      }
    }
  }
};

/**
 * Clear/destroy all tables and remove DOM elements from this.domEl, and delete properties.
 */
pui.joins.JoinArea.prototype.destroy = function(){
  if (this.filetree) this.filetree.reset();
  this.clearTables();
  if (this.domEl) {
    if (this.infobox) this.domEl.removeChild(this.infobox);
    if (this.svg) this.domEl.removeChild(this.svg);
  }
  pui.deleteOwnProperties.call(this);
};

/**
 * Create an HTML table showing fields from the first DB file/table. Allow drag-drop between tables to create joins.
 * @param {Object} params   Contains information about one file as well as join table parameters.
 * @constructor
 */
pui.joins.JoinableTable = function(params){
  // Private:
  this._width = params.width;
  this._left = params.left;
  this._top = params.top;
  this._captionText = params.tableCaption;   //The text for the table caption.
  
  // Public:
  this.id = params.id;    //A unique ID differentiating this table from others.
  if (this.id == null) this.id = Math.random().toString(36).substring(2, 15); //generate pseudo-random string.
  
  this.parentJoin = null;
  /*
   * @type Array.<Join>
   */
  this.childJoins = [];

  // Display name appears in the JoinEditor.
  if (params.displayName){
    this.displayName = params.displayName;
  }
  else if (params.tableCaption){
    this.displayName = params.tableCaption;
  }
  else {
    this.displayName = params.id;
  }
  
  /*
   * List of fields inside the DB table. At a minimum, each object must have a "field" and a "key" property.
   * @type Array.<Object>
   */
  this.fields = JSON.parse(JSON.stringify(params['fields']));
  /*
   * This gets set by pui.joins.JoinableTable.prototype.addAndRenderTable().
   * @type JoinArea
   */
  this.joinArea = null;
  
  this.table = null;
  this.tableHeadRow = null;
  this.tableBody = null;
  this.caption = null;
};

// If a join exists to the given table, then return the join; else return null.
pui.joins.JoinableTable.prototype.getParentJoinTo = function(table){
  if (this.parentJoin != null && this.parentJoin.parentTable === table) {
    return this.parentJoin;
  }
  return null;
};

/**
 * Remove this JoinableTable's table element from the DOM and clear all properties in this JoinableTable object.
 */
pui.joins.JoinableTable.prototype.destroy = function(){
  if (this.table && this.table.parentNode) this.table.parentNode.removeChild(this.table);
  pui.deleteOwnProperties.call(this);
};



/**
 * Create the HTML interface for the Joinable Table and add it to the container DOM element.
 */
pui.joins.JoinableTable.prototype.render = function(){
  // Create a new table for this file.
  this.table = document.createElement("table");
  this.table.style.width = this._width + "px";
  this.table.style.left = this._left + "px";
  this.table.style.top = this._top + "px";
  
  this.table.className = "joinable";
  
  this.caption = this.table.createCaption();
  this.caption.innerHTML = this._captionText;
  
  var thead = this.table.createTHead();
  this.tableHeadRow = thead.insertRow(0);
  
  var el = this.tableHeadRow.insertCell(0);
  el.innerHTML = "Field";
  
  this.tableBody = document.createElement("tbody");
  this.table.appendChild(this.tableBody);
  
  for (var i=0; i < this.fields.length; i++) {
    var tr = this.tableBody.insertRow(this.tableBody.rows.length);
    
    // These allow the field and table to be identified in drag/drop events.
    tr.fieldId = this.fields[i]["field"];
    tr.joinableTable = this;
    
    var keyNumber = this.fields[i]["key"];
    el = tr.insertCell(0);
    el.innerHTML = this.fields[i]["field"] + (keyNumber != null ? this.joinArea.primaryKeyMarker : "");
    
    // Setup events for the Join interface.
    tr.draggable = true;
    tr.ondragstart = this._ondragstart;
    tr.ondragend = this._ondragend;
    tr.ondrop = this._ondrop;
    tr.ondragover = this._ondragover;
    tr.ondragleave = this._ondragleave;
  }
  
  // Allow the table to be moved by dragging the mouse.
  pui.makeMovable({attachto: this.caption, move: this.table, rbound: this.joinArea.moveRbound, bbound: this.joinArea.moveBbound, movecb: this._moveCb.bind(this) });
};

/**
 * For each join connector in a JoinableTable, call drawConnectors. Note: when _moveCb is assigned as "movecb" to the pui.makeMovable 
 * argument, "this" would refer to the "params" object unless bind were used. In pui.joins.JoinableTable.prototype.render bind is used, so this is a JoinableTable.
 */
pui.joins.JoinableTable.prototype._moveCb = function(){
  // These get to be drawn on each movement event.
  for (var i=0; i < this.childJoins.length; i++){
    this.childJoins[i].drawConnectors();
  }
  if (this.parentJoin != null) this.parentJoin.drawConnectors();
  
  // Expanding is visibly slow, so do nothing until movement has stopped for 10ms. (10 works well in all browsers, including IE10.)
  this.joinArea.queueExpand(10);
};

/**
 * Returns an array with the table offset left and top coordinates, respectively.
 * @returns {Array.<Number>}
 */
pui.joins.JoinableTable.prototype.getXY = function(){
  return [this.table.offsetLeft, this.table.offsetTop];
};
/**
 * Set the table style left and top with the array of styles.
 * @param {Array.<String>} lefttop
 */
pui.joins.JoinableTable.prototype.setLeftTop = function(lefttop){
  this.table.style.left = lefttop[0];
  this.table.style.top = lefttop[1];
};

pui.joins.JoinableTable.prototype.getCaptionHeight = function(){
  return this.caption.offsetHeight;
};
pui.joins.JoinableTable.prototype.getBottom = function(){
  return this.table.offsetHeight + this.table.offsetTop;
};
pui.joins.JoinableTable.prototype.getRight = function(){
  return this.table.offsetWidth + this.table.offsetLeft;
};


/**
 * Handle a join table's row being dropped on another row.
 * Detect if join information exists in the dropped element and target.
 * @param {Event} event    The event target is the element where the mouse was released.
 * @returns {undefined|Boolean}
 */
pui.joins.JoinableTable.prototype._ondrop = function(event){
  designUtils.preventEvent(event); //Prevent page from redirecting as link.
  var target_tr = pui.getTRtargetRow(event);
  if (!target_tr || ! target_tr.joinableTable) return;
  
  pui.removeCssClass(target_tr,"drop_valid"); //clear the dragover visual feedback.

  try {
    event.dataTransfer.getData("text/plain"); //result is ignored; not all browsers implement it the same.
  }
  catch(ignore){}
  
  var ja = target_tr.joinableTable.joinArea;
  var origin_tr = ja.joinSourceTR;

  if (!origin_tr) return false; //Happens when source is a draggable element not from the JoinArea.

  var origfileId = origin_tr.joinableTable.id;
  if (origfileId == null || origfileId == target_tr.joinableTable.id) return false; //Don't allow dropping on same table.

  ja.joinLinkRows(target_tr, origin_tr);
};


/**
 * Show that the element can accept a drop.
 * Note: dragover must be used rather than dragenter because of the event timing.
 * Otherwise, the css classes would be removed as soon as they were set.
 * @param {Object|Event} event
 */
pui.joins.JoinableTable.prototype._ondragover = function(event){
  var target = pui.getTRtargetRow(event);
  if (!target || ! target.joinableTable || target.joinableTable.joinArea.joinSourceTR == null) return; //Only drop from JoinableTables.
  var ja = target.joinableTable.joinArea;
  var origJTable = ja.joinSourceTR.joinableTable;
  if (origJTable == null) return;      //The origin node should have a joinableTable.
  var targJTable = target.joinableTable;
  if (targJTable == origJTable) return; //Don't allow dropping on same table as drag origin.
  
  var containsOrig = ja.filetree.contains(origJTable.id);
  var containsTarg = ja.filetree.contains(targJTable.id);
  if (!containsOrig && !containsTarg){
    // Don't allow joining two orphan tables together.
    ja.showInfobox(pui["getLanguageText"]("runtimeMsg", "join x y to main file", [origJTable.id, targJTable.id]));
    return;
  }
  else if (containsOrig && containsTarg){
    var join = ja.filetree.getJoinBetweenNodes(targJTable, origJTable);
    // Don't allow joining two connected nodes together; it would create a graph cycle.
    if (join == null){
      ja.showInfobox(pui["getLanguageText"]("runtimeMsg","one path main to child"));
      return;
    }
  }
  ja.hideInfobox();

  designUtils.preventEvent(event);       //Let browser know that drop is allowed.
  pui.addCssClass(target,"drop_valid");  //Show visual feedback for drop.
  event.dataTransfer.dropEffect = "link";
};

/**
 * The dragged row has left over a row. Clear the visual feedback of valid join.
 * @param {Object|Event} event
 */
pui.joins.JoinableTable.prototype._ondragleave = function(event){
  designUtils.preventEvent(event);
  var target = pui.getTRtargetRow(event);
  if (target) pui.removeCssClass(target,"drop_valid");
};

/**
 * First event to fire when a drag is started.
 * @param {Object|Event} event  The target is the element from which drag started.
 */
pui.joins.JoinableTable.prototype._ondragstart = function(event){
  if (event.stopPropagation) event.stopPropagation();
  else{
    event.cancelBubble = true;
    event.returnValue = false;
  }
  var target = pui.getTRtargetRow(event);
  if (target) {
    // Set joinSourceTR so we can retrieve the drag source easily. Note: dataTransfer expects strings, IE dislikes setData, 
    // and dragover can't get the id from dataTransfer in Chrome.
    target.joinableTable.joinArea.joinSourceTR = target;
    pui.addCssClass(target,"drag_origin");

    try {
      // Firefox requires setData before other drag events will fire.
      event.dataTransfer.setData("text/plain", 'source:' + target.joinableTable.id);  //Dummy data to force events to fire.
    } 
    // IE10,11 won't setData or dataTransfer.list.add, but other DnD events still fire.
    catch(ignore){}
  }
};


/**
 * Last event to fire when drag sequence of events finishes. Clean up.
 * @param {Event} event    The target is the element from which the drag started.
 */
pui.joins.JoinableTable.prototype._ondragend = function(event){
  var target = pui.getTRtargetRow(event);
  if (target) {
    pui.removeCssClass(target,"drag_origin");   //Clear the visual feedback.
    var ja = target.joinableTable.joinArea;
    ja.joinSourceTR = null;   //Make sure the join rows don't react to other, non-join drag/drops.
    ja.hideInfobox();  //Hide the info box in case it appeared during drag.
  }
};





/**
 * Join Editor Class
 * This is a popup window to remove or modify the join type.
 * @param {JoinArea} joinArea 
 * @returns {JoinEditor}
 * @constructor
 */
pui.joins.JoinEditor = function(joinArea) {
  /*
   * @type JoinArea
   */
  this.joinArea = joinArea;
  /**
   * @type JoinLine
   */
  this.joinLine = null;
  
  this.boundShow = this.show.bind(this);    //JoinLine shapes' onclick functions point to boundShow.
  this._boundHide = this._hide.bind(this);
  
  this._radios = [];
};

pui.joins.JoinEditor.prototype.init = function() {
  // Private class properties
  this._div = document.createElement("div");
  this._div.id = "joinEditor";
  this._div.isJoinEditor = true; //Tells this.hideCheck when to hide this editor.
  this._div.style.zIndex = designUtils.zListEditor;
  this._div.style.visibility = "hidden";
  this._div.style.display = "none";
  
  this._headerTitle = document.createElement("span");
    
  var dialogHeader = document.createElement("div");
  var closeButtonDiv = document.createElement("div");
  var closeButtonImgDiv = document.createElement("div");
  var dialogBody = document.createElement("div");
  
  var buttonWrap = document.createElement("div");
  buttonWrap.className = "btnwrap";
  var modifyButton = document.createElement("input");
  var removeButton = document.createElement("input");
  var cancelButton = document.createElement("input");
  
  dialogHeader.className = "dialog-header";
  dialogHeader.appendChild(this._headerTitle);
  dialogBody.className = "dialog-body";
  
  closeButtonDiv.className = "close-btn";
  closeButtonDiv.onclick = this._boundHide;
  closeButtonDiv.appendChild(closeButtonImgDiv);
  dialogHeader.appendChild(closeButtonDiv);
 
  modifyButton.type = "button";
  modifyButton.value = pui["getLanguageText"]("runtimeText","modify");
  modifyButton.onclick = this._modify.bind(this);
  buttonWrap.appendChild(modifyButton);
  
  removeButton.type = "button";
  removeButton.value = pui["getLanguageText"]("runtimeText","remove");
  removeButton.onclick = this._remove.bind(this);
  buttonWrap.appendChild(removeButton);
  
  cancelButton.type = "button";
  cancelButton.value = pui["getLanguageText"]("runtimeText","cancel");
  cancelButton.onclick = this._boundHide;
  buttonWrap.appendChild(cancelButton);

  var radVals = ['INNER','LEFT','RIGHT'];
  for (var i=0; i < 3; i++){
    var rad = {
      el: document.createElement("input"),
      label: document.createElement("label")
    };
    rad.el.type = "radio";
    rad.el.name = "rdojointype";
    rad.el.id = "rdojointype" + (i + 1);
    rad.el.value = radVals[i];
    rad.el.checked = false;
    
    rad.label.setAttribute("for", rad.el.id);
    if (i == 0){
      rad.el.checked = true;
      rad.label.appendChild(document.createTextNode(pui["getLanguageText"]("runtimeText","inner join label")));
    }
    
    var p = document.createElement("p");
    p.appendChild(rad.el);
    p.appendChild(rad.label);
    dialogBody.appendChild(p);
    
    this._radios.push(rad);
  }
  
  dialogBody.appendChild(buttonWrap);
  this._div.appendChild(dialogHeader);
  this._div.appendChild(dialogBody);
  this.joinArea.domEl.appendChild(this._div);
  
  // Allow the join editor window to be moved via mouse.  
  pui.makeMovable({attachto: dialogHeader, move: this._div, opacity:85});
};

// Handle clicking the Modify button. "this" should be bound to this JoinEditor.
pui.joins.JoinEditor.prototype._modify = function(){
  var jointype = 'INNER';
  for (var i=0, n=this._radios.length; i < n; i++){
    if (this._radios[i].el.checked){
      jointype = this._radios[i].el.value;
      break;
    }
  }
  this.joinLine.join.setType(jointype);
  this._modified();
  this._hide();
};

// Handle clicking "Remove" join condition button. "this" should be bound to this JoinEditor.
pui.joins.JoinEditor.prototype._remove = function(){
  var join = this.joinLine.join;
  join.removeCondition(this.joinLine);
  
  // If the condition is the last one, then remove the join.
  if (join.lines.length < 1){
    // Removes the younger file from jointree; also destroys the Join.
    var removeQ = this.joinArea.filetree.remove(join.childTable.id);
    this._lastConditionRemoved(removeQ);
  }
  this._removed();
  this._hide();
};

// Placeholders. Child class methods can override.
pui.joins.JoinEditor.prototype._modified = function(){};
pui.joins.JoinEditor.prototype._removed = function(){};
pui.joins.JoinEditor.prototype._lastConditionRemoved = function(removeQ){};

/**
 * Set the window title and radio label texts based on the joinLine object and shows the window.
 * Pre-Conditions: "this" should be bound on a JoinEditor.
 * @param {Event} e  
 */
pui.joins.JoinEditor.prototype.show = function(e){
  preventEvent(e); //Prevent dialog from disappearing as soon as it appears.
  
  this.joinLine = e.target.joinLine;

  var parfile = this.joinLine.join.parentTable.displayName;
  var childfile = this.joinLine.join.childTable.displayName;

  this._headerTitle.innerHTML = pui["getLanguageText"]("runtimeText", "join props x to y", [parfile, this.joinLine.parentField, childfile, this.joinLine.childField]);
  
  this._radios[1].label.innerHTML = pui["getLanguageText"]("runtimeText", "join label x y", [parfile, childfile]);
  this._radios[2].label.innerHTML = pui["getLanguageText"]("runtimeText", "join label x y", [childfile, parfile]);

  // If the type is INNER, the first radio button gets checked and the others unchecked; LEFT -> second checked; RIGHT -> third checked.
  for (var i=0, n=this._radios.length; i < n; i++){
    var rad = this._radios[i].el;
    rad.checked = (rad.value == this.joinLine.join.type);
  }
  
  // Show the dialog's top/left over the mouse click and slightly up and left.
  var editorWidth = 395, editorHeight = 222;
  var offsets = pui.getOffset(this.joinArea.domEl);
  var bodyscrollx = document.documentElement ? document.documentElement.scrollLeft : document.body.scrollLeft;
  var bodyscrolly = document.documentElement ? document.documentElement.scrollTop : document.body.scrollTop;
  var left = e.clientX - offsets[0] - editorWidth * 0.25 + bodyscrollx;
  var top = e.clientY - offsets[1] - editorHeight * 0.50 + bodyscrolly;
  if (left < 10) left = 10;
  if (top < 10) top = 10;
  
  this._div.style.left = left + "px";
  this._div.style.top = top + "px";
  this._div.style.visibility = "visible";
  this._div.style.display = "";

  this._boundHideCheck = this._hideCheck.bind(this);  //Let the hideCheck function's "this" point to this JoinEditor object.
  document.body.addEventListener("click", this._boundHideCheck);
};

/**
 * Handle clicking on the Hide button. "this" must be bound to the JoinEditor.
 */
pui.joins.JoinEditor.prototype._hide = function() {
  this._div.style.visibility = "hidden";
  this._div.style.display = "none";
  this.joinLine = null;
  document.body.removeEventListener("click", this._boundHideCheck);
};

/**
 * Decide if a click was somewhere in the body outside the JoinEditor. Hide the editor if the click wasn't in it.
 * Pre-Conditions: "this" should be bound to a JoinEditor object.
 * @param {Event} e
 */
pui.joins.JoinEditor.prototype._hideCheck = function(e) {
  var elem = e.target;
  while (elem != null) {
    if (elem.isJoinEditor) return;
    elem = elem.parentNode;
  }
  this._hide();
};

/**
 * Contains join information between two files. Joins fall into a tree hierarchy with
 * the main file as root. Joins are created by dragging a row from one table onto a
 * row in another table in the Join Selection section.
 * @constructor
 * @param {Object} joinArea
 * @param {Object} pparentEl  The TR DOM element in the parent table.
 * @param {Object} pchildEl   The TR DOM element in the child table.
 * @param {String|undefined} joinType   INNER, LEFT, RIGHT.
 */
pui.joins.Join = function(joinArea, pparentEl, pchildEl, joinType){
  // The type determines which shape to show in the JoinLine and in generating SQL.
  this.type = joinType == null ? "INNER" : joinType;

  this.joinArea = joinArea;
  
  // Note: The IDs of parent/child tagbles uniquely identify the join. No two joins should exist with
  // the same parent-child combination. Example values: "file", "extrafile0", etc.
  this.parentTable = pparentEl.joinableTable;
  this.childTable = pchildEl.joinableTable;
  /*
   * Join Conditions (encapsulated by JoinLines).
   * @type Array.<JoinLine>
   */
  this.lines = [];
  
  // Let the tables find this join so the connectors can move with it.
  this.parentTable.childJoins.push(this);
  this.childTable.parentJoin = this;
  
  this.addCondition(pparentEl, pchildEl);
};

/**
 * Add fields as a new join condition, and draw a JoinLine. Assume whatever calls this knows which should be parent and which should be child.
 * @param {Object} pparentEl  Parent TR DOM element.
 * @param {Object} pchildEl   Child TR DOM element.
 */
pui.joins.Join.prototype.addCondition = function(pparentEl, pchildEl){
  if (pparentEl.joinableTable == this.parentTable
  && pchildEl.joinableTable == this.childTable ){
    var line = new pui.joins.JoinLine(pparentEl, pchildEl, this);
    this.lines.push(line);
    this.drawConnector(this.lines.length - 1);
  }
};

/**
 * Remove the JoinLine from the list of conditions.
 * @param {JoinLine} cond
 */
pui.joins.Join.prototype.removeCondition = function(cond){
  var i=0;
  while (i < this.lines.length){
    if (this.lines[i] == cond){
      cond.destroy();
      this.lines.splice(i, 1);
      break;
    }else{
      i++;
    }
  }
};

/**
 * Based on the TR and TABLE element positions, calculate positions for the join
 * connector. Draw it if its nodes don't exist already; else set the endpoints.
 * @param {Number} index   Index in this.lines of a joinline to modify.
 */
pui.joins.Join.prototype.drawConnector = function(index){
  var parXY = this.parentTable.getXY();
  var childXY = this.childTable.getXY();
  var x1 = this.lines[index].parentEl.offsetLeft + parXY[0];
  var x2 = this.lines[index].childEl.offsetLeft + childXY[0];

  if (x1 <= x2){ //fromEl is left of toEl: start line on right edge instead of left.
    x1 += this.lines[index].parentEl.offsetWidth;
  }else{
    x2 += this.lines[index].childEl.offsetWidth; //target is left of origin: end line on right edge.
  }

  var y1 = this.lines[index].parentEl.offsetTop + parXY[1];
  if (pui["is_firefox"]) y1 += this.parentTable.getCaptionHeight(); //The caption changes the row offset now.

  var orig_height = this.lines[index].parentEl.offsetHeight;
  y1 += Math.floor(orig_height / 2);

  var y2 = this.lines[index].childEl.offsetTop + childXY[1];
  if (pui["is_firefox"]) y2 += this.childTable.getCaptionHeight();

  var targ_height = this.lines[index].childEl.offsetHeight;
  y2 += Math.floor(targ_height / 2);

  this.lines[index].setPoints(x1, y1, x2, y2);
};

/**
 * Re-draw each join line. Called when tables are being moved.
 */
pui.joins.Join.prototype.drawConnectors = function(){
  for (var i=0; i < this.lines.length; i++){
    this.drawConnector(i);
  }
};

/**
 * Removes all DOM elements associated with this Join, removes this join from the parent and child tables, deletes own properties.
 */
pui.joins.Join.prototype.destroy = function(){
  if (this.lines != null){
    for (var i=0; i < this.lines.length; i++){
      this.lines[i].destroy();
    }
  }

  // Remove this join from the parent table's list of children.
  if (this.parentTable && this.parentTable.childJoins && this.parentTable.childJoins.length > 0){
    var idx = this.parentTable.childJoins.indexOf(this);
    if (idx >= 0) this.parentTable.childJoins.splice(idx, 1);
  }
  
  if (this.childTable) this.childTable.parentJoin = null;
  pui.deleteOwnProperties.call(this);
};

pui.joins.Join.prototype.setType = function(ptype){
  this.type = ptype;
  for(var i=0; i < this.lines.length; i++){
    this.lines[i].draw();
  }
};

/**
 * Return true if the join condition exists on the tables already. Else return false. Assume something already verified that both 
 * arguments are part of the join, the 1st argument is in the parent table, and the 2nd argument is in the child.
 * @param {String} parentField
 * @param {String} childField
 * @returns {Boolean}
 */
pui.joins.Join.prototype.conditionExists = function(parentField, childField){
  // Look for the IDs of the fields in each join condition.
  for (var i=0; i < this.lines.length; i++){
    var line = this.lines[i];
    if (line.parentField == parentField && line.childField == childField) return true;
  }
  return false;
};

/**
 * A join condition between two tables, including the graphical representation.
 * @param {Object} pparentEl TR element of the parent table.
 * @param {Object} pchildEl TR element of the child table.
 * @param {Join} join  Which Join references this line in its this.lines array.
 * @constructor
 */
pui.joins.JoinLine = function(pparentEl, pchildEl, join){
  
  this.parentEl = pparentEl;
  this.childEl = pchildEl;
  
  // The database field names for this join condition. Needed by FileTree.
  this.parentField = pparentEl.fieldId;
  this.childField = pchildEl.fieldId;
  
  /*
   * @type Join
   */
  this.join = join; //Needed for click events: which join condition owns this line.
                    //Allows removing after clicking on joinline. Also provides "type" for rendering.
  /*
   * @type Number;
   */
  this.x1 = this.y1 = this.x2 = this.y2 = 0;
  
  // Create the SVG elements that show the link.

  this.connector = document.createElementNS(pui.SVGNS, "polyline");
  this.connector.joinLine = this;
  this.connector.setAttribute("stroke", this.join.joinArea.joinStrokeColor); //Note: stroke must be attribute for IE, not style.
  this.connector.setAttribute("stroke-width", "2");
  this.connector.setAttribute("fill", "none");
  this.connector.onclick = this.join.joinArea.joineditor.boundShow;
  this.connector.setAttribute("class","joinlink");
  this.join.joinArea.svg.appendChild(this.connector);

  this.startShape = this._createCircle();
  this.join.joinArea.svg.appendChild(this.startShape);

  this.endShape = this._createCircle();
  this.join.joinArea.svg.appendChild(this.endShape);

  this.midShape = document.createElementNS(pui.SVGNS, "polygon");
  this.midShape.joinLine = this;
  this.midShape.setAttribute("fill", this.join.joinArea.joinLinkColor);
  this.midShape.setAttribute("stroke", this.join.joinArea.joinStrokeColor);
  this.midShape.setAttribute("stroke-width", 1);
  this.midShape.onclick = this.join.joinArea.joineditor.boundShow;
  this.midShape.setAttribute("class","joinlink");
  this.join.joinArea.svg.appendChild(this.midShape);
};

pui.joins.JoinLine.prototype._createCircle = function(){
  var circ = document.createElementNS(pui.SVGNS, "circle");
  circ.joinLine = this;
  circ.setAttribute("r", 5); //radius.
  circ.setAttribute("fill", this.join.joinArea.joinStrokeColor);
  circ.onclick = this.join.joinArea.joineditor.boundShow;
  circ.setAttribute("class","joinlink");
  return circ;
};

// move both the end and start points and refactor shapes.
pui.joins.JoinLine.prototype.setPoints = function(px1, py1, px2, py2){
  this.x1 = px1;
  this.y1 = py1;
  this.x2 = px2;
  this.y2 = py2;
  this.draw();
};

pui.joins.JoinLine.prototype.setEnd = function(px2, py2){
  this.x2 = px2;
  this.y2 = py2;
  this.draw();
};

/**
 * Set the x and y positions for all shapes in this line, including angles of shapes that indicate join-type.
 */
pui.joins.JoinLine.prototype.draw = function (){

  this.startShape.setAttribute("cx", this.x1);  //Set centers of both circles.
  this.startShape.setAttribute("cy", this.y1);
  this.endShape.setAttribute("cx", this.x2);
  this.endShape.setAttribute("cy", this.y2);

  // Set the points on the poly-line.
  var stickout = 15;
  var points = this.x1+","+this.y1+" "; //1st point, on parent table.
  if ( this.x1 <= this.x2 ){
    points += this.x1 + stickout +","+this.y1+" "; //2nd point, sticking out from parent.
    points += this.x2 - stickout +","+this.y2+" "; //3rd point, sticking out from child.
  }else{
    points += this.x1 - stickout +","+this.y1+" ";
    points += this.x2 + stickout +","+this.y2+" ";
  }
  points += this.x2+","+this.y2;  //4th point, on child table.
  this.connector.setAttribute("points", points);

  // Set the points on the middle shape polygon.
  var midx = Math.round((this.x1 + this.x2) / 2);
  var midy = Math.round((this.y1 + this.y2) / 2);
  var size = 6;
  if (this.join.type == "LEFT"){
    // Right-pointing triangle. (more rows on left than right).
    points = (midx - size)+","+(midy - size)+" "
            +(midx + 3*size)+","+(midy)+" "
            +(midx - size)+","+(midy + size);
  }
  else if(this.join.type == "RIGHT"){
    //Left-pointing triangle. (more rows on right than left).
    points = (midx - 3*size)+","+(midy)+" "
            +(midx + size)+","+(midy - size)+" "
            +(midx + size)+","+(midy + size);      
  }
  else{
    //Square.
    points = (midx - size)+","+(midy - size)+" "
            +(midx + size)+","+(midy - size)+" "
            +(midx + size)+","+(midy + size)+" "
            +(midx - size)+","+(midy + size);
  }
  this.midShape.setAttribute("points", points);

  // Calculate the angle made between the two points and x-axis--for rotating the middle shape.
  var y = Math.abs(this.y1 - this.y2);
  var hypotenuse = Math.sqrt( Math.pow(this.x1 - this.x2,2) + Math.pow(y,2));
  var theta = Math.asin( y / hypotenuse ) * 180 / Math.PI;
  var angle = 0;
  if      (this.x1 < this.x2 && this.y1 <= this.y2) angle = theta;       //  0 <= angle <  90; Q1.
  else if (this.x1 >= this.x2 && this.y1 < this.y2) angle = 180 - theta; // 90 <= angle < 180; Q2.
  else if (this.x1 > this.x2 && this.y1 >= this.y2) angle = 180 + theta; //180 <= angle < 270; Q3.
  else if (this.x1 <= this.x2 && this.y1 > this.y2) angle = 360 - theta; //270 <= angle < 360; Q4.
  // Rotate the shape so it's clear which table is LEFT/RIGHT regardless of position.
  this.midShape.setAttribute("transform","rotate("+Math.round(angle)+" "+midx+" "+midy+")");
};

// remove the shapes from the SVG, remove all objects from .
pui.joins.JoinLine.prototype.destroy = function(){
  this.join.joinArea.svg.removeChild(this.startShape);
  this.join.joinArea.svg.removeChild(this.midShape);
  this.join.joinArea.svg.removeChild(this.endShape);
  this.join.joinArea.svg.removeChild(this.connector);
  pui.deleteOwnProperties.call(this);
};

/**
 * Object to contain the hierarchy of joined files, to help construct the SQL statements, and to decide when a new join may be allowed.
 * Object is created or emptied after all Retrieve Fields AJAX responses arrive.
 * 
 * Each tree node is a JoinableTable, and the main file is the root node. A child node can only have one parent, but a parent 
 * may have many children; e.g. a node may be a child of the root or a grandchild, but not both. A file cannot exist
 * as multiple nodes in the tree.
 * 
 * Join objects are stored in each child node's join property; i.e. join info in root node is null, but join info in a leaf node is
 * not null. Join.parent corresponds to the node's parent, whereas join.child corresponds to the node itself.
 * 
 * @constructor
 */ 
pui.joins.FileTree = function(){
  this._quicklist = {}; //Quick lookup list by file IDs.
  
  this._tree = null;  // JoinableTable that has parentJoin null and may have childJoins.
};

pui.joins.FileTree.prototype.hasRoot = function(){
  return this._tree != null;
};

pui.joins.FileTree.prototype.setRoot = function(table){
  this._tree = table;
  if (table != null) this._quicklist[table.id] = table;
};

pui.joins.FileTree.prototype.addNode = function(node){
  this._quicklist[node.id] = node;
};

pui.joins.FileTree.prototype.contains = function(id){
  return this._quicklist[id] != null;
};  

/**
 * Reset the internal tree and namelist, and destroy all Join objects. Called after Retrieve Fields clicked more than once.
 * Note: this must be called before JoinArea.clearTables, or else Join objects get orphaned.
 * @returns {Array.<String>} Collection of IDs of files that were removed.
 */
pui.joins.FileTree.prototype.reset = function(){
  var removeQ = [];
  this._removeSubTree(this._tree, removeQ);
  this._tree = null;
  this._quicklist = {};
  return removeQ;
};

/**
 * Remove the join (and dependent joins) of a node identified by the argument ID.
 * @param {String} id
 * returns {Array.<String>} Collection of IDs of files that were removed.
 */
pui.joins.FileTree.prototype.remove = function(id){
  var removeQ = [];
  // Never remove the root node (_tree.id), only look for nodes in the tree.
  if (id != this._tree.id && this.contains(id)) {
    var child = this.getNode(id);
    if (child){
      this._removeSubTree(child, removeQ);
    }
    else {
      console.log("Tree failed to find node Id to remove:", id);
    }
  }
  return removeQ;
};

/**
 * Recursive function to find all child nodes of the argument, remove them from the internal tree, delete them from the namelist,
 * remove their fields from field selection, and destroy their Join objects.
 * @param {Object|Null} node
 * @param {Array.<String>} removeQ  Output. List of file IDs that were found and removed.
 */
pui.joins.FileTree.prototype._removeSubTree = function(node, removeQ){
  if (node && node.childJoins){
    while (node.childJoins.length > 0)  //DFS recursively find leaf nodes.
      this._removeSubTree(node.childJoins[0].childTable, removeQ);

    // Remove this node from the internal tree, namelist, and destroy the Join object.
    var removeId = node.id;
    if (node.parentJoin != null){     //Root join is null; never remove root.
      node.parentJoin.destroy();
      node.parentJoin = null;

      removeQ.push(removeId);
      delete this._quicklist[removeId];
    }
  }
};

/**
 * Return the internal tree node identified by the ID.
 * @param {String} id   File Id.
 * @returns {Object}
 */
pui.joins.FileTree.prototype.getNode = function(id){
  return this._quicklist[id];
};

/**
 * Given two nodes, return a join that exists between them. Initially, it is unknown which argument, if either, is the parent.
 * @param {JoinableTable} node1
 * @param {JoinableTable} node2
 * @returns {Null|Object}
 */
pui.joins.FileTree.prototype.getJoinBetweenNodes = function(node1, node2){
  if (node1 && node2){    //A join can exist only if both nodes exist.

    // If node1's parent is node2, then return node1's join object.
    var join1 = node1.getParentJoinTo(node2);
    if (join1 != null) return join1;
    // If node2's parent is node1, then return node2's join object.
    var join2 = node2.getParentJoinTo(node1);
    if (join2 != null) return join2;
  }
  return null;
};

/**
 * Called by _preorderDFS when a node is found. Sets properties on the filetree so it can be exported. (Overridden by child class.)
 * @param {String} id       Input. The unique identifier for a file.
 * @param {Object} struct   Output. The struct gets modified.
 */
pui.joins.FileTree.prototype._setObjectWithId = function(id, struct){
  struct["id"] = id;
};

/**
 * Returns an object representing the tree in a serializable structure.
 * @returns {Object}
 */
pui.joins.FileTree.prototype.getTree = function(){
  var struct = {};
  this._setObjectWithId(this._tree.id, struct); //Populate struct with necessary fields.
  if (this._tree.childJoins.length > 0){
    struct.childNodes = [];
  }
  
  this._structPointer = struct;
  this._preorderDFS(this._tree);
  
  return struct;
};

// Abstract methods for child classes to implement.
// Placeholder. Child class overrides; e.g. generate "FROM file1 AS f1".
pui.joins.FileTree.prototype._fromclause = function(tableId){};
// Placeholder. Child class overrides; e.g. generate "JOIN file2 AS f2"
pui.joins.FileTree.prototype._joinclause = function(tableId, joinType){};
// Placeholder. Child class overrides; e.g. generate " ON f2.col1 = f1.col1"
pui.joins.FileTree.prototype._joinonclause = function(parentTableId, childTableId, parentFieldId, childFieldId){};
// Placeholder. Child class overrides; e.g. generate " AND f2.col2 = f1.col2"
pui.joins.FileTree.prototype._joinonandclause = function(parentTableId, childTableId, parentFieldId, childFieldId){};

/**
 * Pre-Order depth-first-search of the tree starting at the given node. Write to struct, calls abstract methods.
 * @param {JoinableTable} node
 */
pui.joins.FileTree.prototype._preorderDFS = function(node){
  this._structPointer["xy"] = node.getXY();

  if (node.parentJoin == null){
    this._fromclause(this._tree.id);  //Assume the node is root
  }
  else {
    // join is the join to the given node's parent.
    var joinToParent = node.parentJoin;
    
    this._joinclause(node.id, joinToParent.type);

    this._setObjectWithId(node.id, this._structPointer);
    this._structPointer["joinP"] = {
      "type": joinToParent.type
    };
    if (joinToParent.lines.length > 0){
      this._structPointer["joinP"]["conditions"] = [];
      for (var i=0; i < joinToParent.lines.length; i++){
        this._structPointer["joinP"]["conditions"][i] = {
          "childField": joinToParent.lines[i].childField,
          "parentField": joinToParent.lines[i].parentField
        };
      }
    }
    if (node.childJoins.length > 0){
      this._structPointer.childNodes = [];
    }

    var line = joinToParent.lines[0];
    this._joinonclause(joinToParent.parentTable.id, node.id, line.parentField, line.childField);
    for (var i=1; i < joinToParent.lines.length; i++){
      line = joinToParent.lines[i];
      this._joinonandclause(joinToParent.parentTable.id, node.id, line.parentField, line.childField);
    }
  }

  for (var i=0; i < node.childJoins.length; i++){
    var callstackNode = this._structPointer;
    this._structPointer.childNodes[i] = {};
    this._structPointer = this._structPointer.childNodes[i];
    this._preorderDFS( node.childJoins[i].childTable );
    this._structPointer = callstackNode;
  }
};

/**
 * Return true if a file's fields may be null as a result of the join type. Limitation: if a parent-child join is RIGHT and the
 * grandparent-parent is INNER, then the grandparent's fields could also be null. Assume the user won't create that scenario--or 
 * that they can figure out how to COALESCE it.
 * @param {String} fileId
 * @returns {Boolean}
 */
pui.joins.FileTree.prototype.fileFieldsCanNull = function(fileId){
  var node = this.getNode(fileId);
  if (node != null){
    if (node.parentJoin != null){  //Join is not root. look for left join.
      // join is the 2nd table in a LEFT join; its fields could be null.
      if (node.parentJoin.type == "LEFT") return true;
    }
    // Look at each child join for a RIGHT join.
    for (var i=0; i < node.childJoins.length; i++){
      // join is 1st table in a RIGHT join; its fields could be null.
      if (node.childJoins[i].type == "RIGHT") return true;
    }
  }
  return false;
};
