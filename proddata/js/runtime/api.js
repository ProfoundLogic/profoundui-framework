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

// sets the host cursor location
// pass in row and column based on green-screen coordinates or an id of an element.
// example: setCursor("D_24_1"); pressKey('F1');   // the id's column part can be 1 off, based on "adjust columns" setting.
function setCursor(row, col) {

  if (arguments.length == 1) {
  
    var id = row;
    var obj = getObj(id);
    if (obj) {
    
      if (context == "genie") {
      
        if (obj.fieldInfo) {
        
          pui.response["crow"] = obj.fieldInfo.row;
          pui.response["ccol"] = obj.fieldInfo.col;
          
        }
        
      }
      else {
      
        if (obj.cursorRow && obj.cursorColumn) {
        
          pui.returnCursor(null, obj);
        
        }
      
      }
      
    }
  
  }

  if (arguments.length == 2) {
  
    if (context == "genie") {
    
      pui.response["crow"] = row;
      pui.response["ccol"] = col;
      
    }
    else {
    
      pui.cursorValues.row = row;
      pui.cursorValues.column = col;
    
    }
    
  }
 
}


// hide an element by id or object reference
// example: hideElement('D_1_29')
function hideElement(obj) {
  if (typeof(obj) == "string") obj = getObj(obj);
  if (obj!=null) obj.style.visibility = 'hidden';
}

// hide many elements by id
// parms: id1, id2, id3, id4, etc.
// example: hideElements('D_1_29', 'D_3_1', 'I_7_11')
function hideElements() {
  for( var i = 0; i < hideElements.arguments.length; i++ ) {
    hideElement(hideElements.arguments[i]);
  }
}

// remove an element by id or object reference
// example: removeElement('D_1_29')
function removeElement(obj) {
  if(typeof(obj) == "string") obj = getObj(obj);
  if (obj!=null) obj.parentNode.removeChild(obj);
}

// remove many elements by id
// parms: id1, id2, id3, id4, etc.
// example: removeElements('D_1_29', 'D_3_1', 'I_7_11')
function removeElements() {
  for( var i = 0; i < removeElements.arguments.length; i++ ) {
    removeElement(removeElements.arguments[i]);
  }
}

// get element value by id
// example: var cpu = getElementValue('D_3_1');
function getElementValue(id) {
  var elem;
  var elemValue;

  if (id != null && typeof id == "object") elem = id;  
  else elem = document.getElementById(id);
  if (elem == null) return '';
  elemValue = '';
  if (elem.tagName.toLowerCase() == 'div') {
    var child = elem.firstChild;
    if (child != null && child.tagName != null && child.tagName == "A") {
      elemValue = child.innerHTML;
    }
    else {
      elemValue = elem.innerHTML;
    }
  }
  if (elem.tagName == "INPUT" && elem.type == "checkbox") {
    if (elem.checked && elem.checkedValue != null) return elem.checkedValue;
    if (!elem.checked && elem.uncheckedValue != null) return elem.uncheckedValue;
    return elem.checked;  // "checked value" and/or "unchecked value" not present, so just return true or false
  }
  if (elem.tagName == "INPUT" || elem.tagName == "TEXTAREA") {
    elemValue = elem.value;
  }
  if (elem.tagName == "SELECT") {
    var idx = elem.selectedIndex;
    if (idx >= 0) {
      elemValue = elem.options[idx].value;
    }
    else if (elem.pui && elem.pui.properties && elem.pui.properties["value"]) {
      elemValue = elem.pui.properties["value"];
    }
    else {
      elemValue = elem.value;
    }
  }
  if (elem.comboBoxWidget != null) elemValue = elem.comboBoxWidget.getValue();
  if (elem.slider != null) elemValue = String(elem.value);
  if (elem.onOffSwitch != null) {
    elemValue = "";
    if (elem.onOffSwitch.isOn && elem.onOffSwitch.onValue != null) {
      elemValue = elem.onOffSwitch.onValue;
    }
    else if (!elem.onOffSwitch.isOn && elem.onOffSwitch.offValue != null) {
      elemValue = elem.onOffSwitch.offValue;
    }        
  }

  elemValue = elemValue.replace(/&nbsp;/g,' ');
  // Safari and Opera use the non-breaking space character A0 (160) -- we'll replace this with a standard space
  while (elemValue.indexOf(String.fromCharCode(160)) != -1) {
    elemValue = elemValue.replace(String.fromCharCode(160), " ");
  } 

  if (elemValue == elem.emptyText) elemValue = "";

  return elemValue;
}


// shortcut for getElementValue, trimmed
function get(id) {
  return trim(getElementValue(id));
}

// shortcut for document.getElementById()
function getObj(id) {
  return document.getElementById(id);
}


// post data to a new window
// params: url, parm1, value1, parm2, value2, parm3, value3, etc.
function postToNewWindow(url) {
  if (!url) {
    pui.alert("postToNewWindow Error: URL not specified.");
  }
  var form = document.forms["postToForm"];
  if (form == null) {
    form = document.createElement("form");
    document.body.appendChild(form);
  }
  form.innerHTML = "";
  form.action = url;
  form.method = "post";
  form.target = "_blank";
  for (var i = 1; i < arguments.length; i+=2) {
    var parm = arguments[i];
    var val = "";
    if (i+1 < arguments.length) val = arguments[i+1];
    var hiddenField = createNamedElement("input", parm);
    hiddenField.type = "hidden";
    hiddenField.value = val;
    form.appendChild(hiddenField);
  }
  form.submit();
}


//Make a call to postToNewWindow and pass a target param.
// post data to a url
// params: url, parm1, value1, parm2, value2, parm3, value3, etc.
function postTo(url) {
  if (!url) {
    pui.alert("postTo Error: URL not specified.");
  }
  var form = document.forms["postToForm"];
  if (form == null) {
    form = document.createElement("form");
    document.body.appendChild(form);
  }
  form.innerHTML = "";
  form.action = url;
  form.method = "post";
  form.target = "";
  for (var i = 1; i < arguments.length; i+=2) {
    var parm = arguments[i];
    var val = "";
    if (i+1 < arguments.length) val = arguments[i+1];
    var hiddenField = createNamedElement("input", parm);
    hiddenField.type = "hidden";
    hiddenField.value = val;
    form.appendChild(hiddenField);
  }
  form.submit();
}



// assign a value to a field
// parms: element id, new value
// example: changeElementValue('I_6_52', "GENUSER");
function changeElementValue(id, val) {
  var elem;
  if (typeof id == "object") {
    elem = id;
  }
  else {
    elem = document.getElementById(id);
  }
  if (elem == null) return;
  if (elem.tagName == "DIV") {
    if (elem.slider != null) {
      elem.slider.setValue(val);
    }
    else if (elem.comboBoxWidget != null) {
      elem.comboBoxWidget.setValue(val);
    }
    else if (elem.button && elem.button.textDiv) {
      elem.button.textDiv.innerHTML = val;
    }
    else {
      elem.innerHTML = val;
    }
  }
  else if (elem.tagName == "INPUT" || elem.tagName == "SELECT" || elem.tagName == "TEXTAREA") {
    if (elem.tagName == "INPUT" && elem.type == "checkbox") {
      if (typeof val == "boolean") {
        elem.checked = val;
      }
      else if (elem.checkedValue != null && val == elem.checkedValue) {
        elem.checked = true;
      }
      else {
        elem.checked = false;
      }
    }
    else {
      if (context == "genie" && val != elem.value){
        pui.genie.markFieldAndRelatedDirty(elem);   //Issue 5671. Ensure the field is marked dirty so that the mandatory entry check passes.
      }
      elem.value = val;
    }
  }
  
  if (context == "dspf" || (pui.usingGenieHandler && elem.fieldInfo == null)) {
    elem.modified = true;
    pui.updateReactState(elem);
    var tip = elem.validationTip;
    if (elem.id != null && elem.id.indexOf(".") == -1 && elem.cursorRecord != null) {
      // not a subfile field being modified
      pui.ctlRecModified[elem.cursorRecord] = true;
    }
    if (tip != null) {
      tip.hide();
      tip.doneShowing = true;
      pui.removeCssClass(elem, tip.getInvalidClass());
    }
  }
  if (context == "genie" && elem.fieldInfo != null && elem.fieldInfo["idx"] != null) {
    pui.response[elem.fieldInfo["idx"]] = elem;
  }
  pui.checkEmptyText(elem);
  if (elem.pui && elem.pui.properties) {  
    elem.pui.properties["value"] = val;
  }  
}

// assign a new css class to an element
// parms: element id, class name
// example: changeElementClass('D_6_11', "BigText");
function changeElementClass(id, customClass) {
  var elem = document.getElementById(id);
  if (elem == null) return '';
  elem.className = customClass;
}

// create a new element of any type
// parms: row, col, 
//        optional element type like "div", "input", "button", "img", "dspf", (if not passed "div" assumed, "dspf" means ajax),
//        optional content (innerHTML for div / value for input field / src for image), 
//        optional element id
// example: var elemObj = newElement(3, 10);
// example: var elemObj = newElement(3, 10, "div" ,"Press Enter to Continue.");
// example: var elemObj = newElement(3, 10, "input");
// example: var elemObj = newElement(3, 10, "img", "../images/logo.gif");
// example: var elemObj = newElement("img");
function newElement(row, col, elemType, content, id) {
  if (typeof(row) == "string") {
    // row/column not specified, shift parameters over
    id = elemType;
    content = col;
    elemType = row;
    col = 0;
    row = 0;
  }
  var elemTypeToCreate;
  if (elemType==null) elemType = "div";
  elemType = elemType.toLowerCase();
  elemTypeToCreate = elemType;
  if (elemType == "dspf") elemTypeToCreate = "div";
  if (elemType == "button") elemTypeToCreate = "input";
  var newElem = document.createElement(elemTypeToCreate);
  newElem.style.position = "absolute";
  newElem.style.top = (row * pui.multY + yAdjust) + "px";
  newElem.style.left = (col * pui.multX) + "px";
  if (content!=null) {
    switch(elemType) {
      case "div": 
        newElem.innerHTML = content;
        break;
      case "dspf":
        var req = new pui.Ajax(content);
        req["async"] = false;
        req.send();
        if (req.ok()) {
          newElem.innerHTML = req.getResponseText();
        }
        break;
      case "input": 
        newElem.value = content;
        break;
      case "button": 
        newElem.type = "button";
        newElem.value = content;  
        newElem.className = "button";
        if (!pui["is_quirksmode"]) {
          // default width needed for IE
          newElem.style.width = "55px"; 
        } 
        break;
      case "img": 
        newElem.src = content;
        break;
    }
  }
  if (id!=null) {
    newElem.id = id;
  }
  if (elemType == "input") {
    document.forms["main"].appendChild(newElem);
		addEvent(newElem, "keydown", defaultField);    
  }
  else {
    if (context == "genie") document.getElementById(appContainerId).appendChild(newElem);
    if (context == "dspf") pui.runtimeContainer.appendChild(newElem);
  }
  return newElem;
}


// Cancels an event and prevents it from bubbling up
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
  if(event.stopPropagation){
    event.stopPropagation();
  }
}





// sets the active tab on a tab panel
// this function can be executed before the tab panel is created by the designer, 
// in which case the setTab action is automatically delayed until the tab panel is there
// example: setTab("TabPanel", 1);
var setTabActions = {};
function setTab(tabPanelId, tab) {
  var tabPanel = getObj(tabPanelId);
  if (tabPanel == null || tabPanel.setTab == null) {
    setTabActions[tabPanelId] = tab;
  }
  else {
    tabPanel.setTab(tab);
  }
}


// trims leading spaces from a string
// example: s = ltrim(s);
function ltrim(str){
  while(str.charAt(0)==" "){
    str = str.replace(str.charAt(0),"");
  }
  return str;
}

// trims trailing spaces from a string
// example: s = rtrim(s);
function rtrim(str){
  while(str.charAt((str.length -1))==" "){
    str = str.substring(0,str.length-1);
  }
  return str;
}

// trims a string
// example: s = trim(s);
function trim(str)
{
   return str.replace(/^\s*|\s*$/g,"");
}

// attaches a pop-up calendar to any input field
// parms: input field id, date format
// example: attachCalendar('I_5_20');
function attachCalendar(id, format) {
  var obj = document.getElementById(id);
  if (obj != null) cal(obj, format);
}

pui["detachCalendar"] = function(domObj) {
  if (typeof(domObj) == "string") domObj = getObj(domObj);
  if (domObj != null) pui.removeCal(domObj);
};

// Creates a named DOM element. Necessary because IE has a non-standard way of doing this.
function createNamedElement(type, name) {

  var element;
  
  try {
    // For IE
    element = document.createElement('<' + type + ' name="' + name + '">');
  }
  catch(e) {
    // For others
    element      = document.createElement(type);
    element.name = name;
  }
  return element;
}   






function getInnerText(domObj) {

  // Handle id or object.
  if (typeof(domObj) == "string") domObj = getObj(domObj);
  if (domObj == null) return "";

  var text = domObj.textContent;
  if (text == null) { 
    text = domObj.innerText;
    if (text == null) return "";
  }
  // Firefox, Safari, and Opera translate &nbsp; into the non-breaking space character A0 (160) -- we'll replace this with a standard space
  while (text.indexOf(String.fromCharCode(160)) != -1) {
    text = text.replace(String.fromCharCode(160), " ");
  } 
  return text;
}

function getProgramURL(program, psid, useAuth) {

  var auth = false;
  var loc = location.href;
  loc = loc.split("?")[0];
  var parts = loc.split("/");
  if (parts.length > 2 && 
      parts[parts.length - 2].toLowerCase() == "auth") {    // && parts[parts.length - 3].toLowerCase() == "profoundui") {
    auth = true;
  }

  var url = "/profoundui/";
  if (auth == true || useAuth == true) url += "auth/";
  url += program;   
  if (psid != null && psid == true) url += "/" + PSID;
  if (pui["serverURL"] != null) url = pui["serverURL"] + url;
  return url;

}

pui["getProgramURL"] = getProgramURL;

// Sets a DOM property on an element -- catches exceptions.
function setDOMAttribute(dom, attribute, value) {

  var obj;
  if (typeof(dom) == "string") obj = document.getElementById(dom);
  else obj = dom;
  if (obj == null) return;
  
  try {
    obj[attribute] = value;
    return;
  }
  catch(e) {
    return;
  }

}

function getActualStyle(dom, propertyName) {

    var cssName = propertyName.replace(/ /g, "-");
    var jsName = "";
    var capitalize = false;
    for (var i = 0; i < propertyName.length; i++) {
      var ch = propertyName.substr(i,1);
      if (capitalize) {
        ch = ch.toUpperCase();
        capitalize = false;
      }
      if (ch == " ") {
        capitalize = true;
      }
      else {
        jsName += ch;
      }
    }
    var value = "";
    if (dom.currentStyle) {
      value = dom.currentStyle[jsName];
    }
    else if (window.getComputedStyle) {
      value = document.defaultView.getComputedStyle(dom, null).getPropertyValue(cssName);  
    }
    if (propertyName.indexOf("color") >= 0) {
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
    }
    return value;
}



function addEvent(obj, eventName, func) {
	
	if (obj.addEventListener) {
		obj.addEventListener(eventName, func, false);
	}
	else if (obj.attachEvent) {
		obj.attachEvent("on" + eventName, func);
	}
	
}

function removeEvent(obj, eventName, func) {
	
	if (obj.removeEventListener) {
		obj.removeEventListener(eventName, func, false);
	}
	else if (obj.detachEvent) {
		obj.detachEvent("on" + eventName, func);
	}
	
}


// DEPRECATED -- use pui.getMouseX() and pui.getMouseY() instead.

function getMouseX(event) {
  if (event != null && event.touches != null && event.touches.length == 1) {  // test for touch screen device like iPad
    return event.touches[0].pageX;
  }
  var x = 0;
  if (window.event != null) {
    if (window.event.clientX != null) x += window.event.clientX;
    if (document.documentElement != null && document.documentElement.scrollLeft != null) x += document.documentElement.scrollLeft;
    if (document.body != null && document.body.scrollLeft != null) x += document.body.scrollLeft;
  }
  else {
    if (event != null) {
      if (event.clientX != null) x += event.clientX;
      if (event.scrollX != null) x += event.scrollX;
    }
  }
  return x;
}

function getMouseY(event) {
  if (event != null && event.touches != null && event.touches.length == 1) {  // test for touch screen device like iPad
    return event.touches[0].pageY;
  }
  var y = 0;
  if (window.event != null) {
    if (window.event.clientY != null) y += window.event.clientY;
    if (document.documentElement != null && document.documentElement.scrollTop != null) y += document.documentElement.scrollTop;
    if (document.body != null && document.body.scrollTop != null) y += document.body.scrollTop;
  }
  else {
    if (event != null) {
      if (event.clientY != null) y += event.clientY;
      if (event.scrollY != null) y += event.scrollY;
    }
  }
  return y;
}

pui.getMouseX = function(event) {

  return pui.getMouseXY(event).x;

};

pui.getMouseY = function(event) {

  return pui.getMouseXY(event).y;

};

pui.getMouseXY = function(event) {

  event = event || window.event;

  var xy = {x: 0, y: 0};

  if (event != null && event.touches != null && event.touches.length == 1) {  // test for touch screen device like iPad
  
    xy.x = event.touches[0].pageX;
    xy.y = event.touches[0].pageY;
  
  }
  else if (event != null) {
  
    if (event.pageX) xy.x = event.pageX;
    else if (event.clientX) xy.x = event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    
    if (event.pageY) xy.y = event.pageY;
    else if (event.clientY) xy.y = event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);  
  
  }
  
  return xy;

};

function showErrors() {

	if (errors.length == 0) {
		alert("No errors have been reported.");
		return;
	}
	
	var error;
	var message;
	for (var i = 0; i < errors.length; i++) {
		error = errors[i];
		message = "Operation: " + error.operation + 
				  "\nId: " + error.id + 
				  "\n\nMessage: " + error.text + 
				  "\n" + error.text2;
		alert(message);
	}
	
}



function currentDate(editCode, YYYY) {

  if (editCode == null || editCode == "Y") {
    slashes = true;
  }

  if (inDesignMode()) {
    var dt;
    if (slashes) dt = "DD/DD/DD";
    else dt = "DDDDDD";
    if (YYYY) dt += "DD";
    return dt;
  }
  else{
    var sysTime;
    var returnValue = "";
    if (pui && pui.appJob) {
      if (pui.appJob.sysTime == 0) return "";
      sysTime = new Date(pui.appJob.sysTime * 1000);
      var dateFormat = pui.appJob.dateFormat;
      if (YYYY) {
        if (dateFormat == "*MDY") dateFormat = "*USA";      
        if (dateFormat == "*DMY") dateFormat = "*EUR";      
        if (dateFormat == "*YMD") dateFormat = "*ISO";      
      }
      var keyword = pui.formatting.keywords.DATFMT[dateFormat];
      var dispFormat = keyword.pattern.replace(/\B/g, pui.appJob.dateSeparator);
      returnValue = sysTime.format(dispFormat, 'en_US');
    }
    else {
      sysTime = new Date();
      var subtractYear = 2000;
      if (YYYY) subtractYear = 0;
      returnValue = ((parseInt(sysTime.getMonth(), 10) + 1) < 10 ? '0' : '') + (parseInt(sysTime.getMonth(), 10) + 1) + '/' +
        (parseInt(sysTime.getDate(), 10) < 10 ? '0' : '') + sysTime.getDate() + '/' +
        ((parseInt(sysTime.getFullYear(), 10) - subtractYear) < 10 ? '0' : '') + (parseInt(sysTime.getFullYear(), 10) - subtractYear);
    }
    if (editCode != null && editCode != "Y") {
      var separator = "/";
      if (pui != null && pui.appJob != null && pui.appJob.dateSeparator != null) separator = pui.appJob.dateSeparator;
      returnValue = returnValue.replace(separator, "");
      returnValue = returnValue.replace(separator, "");
      if (returnValue.substr(0,1) == "0") returnValue = " " + returnValue.substr(1);
    }
    return returnValue;
  }
}

function currentTime() {

  if (inDesignMode()) {
    return "TT:TT:TT";
  }
  else{
    var sysTime;
  
    if(pui && pui.appJob){
      if (pui.appJob.sysTime == 0) return "";
      sysTime = new Date(pui.appJob.sysTime * 1000);
      var keyword = pui.formatting.keywords.TIMFMT['*HMS'];
      var dispFormat = keyword.pattern.replace(/\B/g, pui.appJob.timeSeparator);
      return sysTime.format(dispFormat, 'en_US');
    }
    else{
      sysTime = new Date();
      return (sysTime.getHours() < 10 ? '0' : '') + sysTime.getHours() + ':' +
        (sysTime.getMinutes() < 10 ? '0' : '') + sysTime.getMinutes() + ':' +
        (sysTime.getSeconds() < 10 ? '0' : '') + sysTime.getSeconds();
    }
  }
  
}

function currentUser() {
  if (inDesignMode()) {
    return "UUUUUUUUUU";
  }
  else {
    if (pui.appJob == null || pui.appJob["user"] == null) return "";
    else return pui.appJob["user"];
  }
}

function currentFormatNames() {
  return pui.currentFormatNames;
}

function getQueryStringParms() {
	var parms = {};
	var queryString = "";
  queryString = location.search.substring(1, location.search.length);    
		
	if (queryString.length == 0) return parms;
	queryString = queryString.replace(/\+/g, ' ');
	var args = queryString.split('&'); 
	for (var i = 0; i < args.length; i++) {
		var pair = args[i].split('=');
		var name = decodeURIComponent(pair[0]);		
		var value = "";
		if (pair.length==2) {
      value = decodeURIComponent(pair[1]);
    }		
		parms[name] = value;
	}
	return parms;
}



// Shorthand Alias for applyDesignProperty() in properties.js
// Check before attempting this. Otherwise, files that don't include "properties.js" cannot 
// include this file.
if (typeof(applyDesignProperty) != "undefined") {
  window.applyProperty = applyDesignProperty;
}

// Unicode UTF-8 Encode/Decode

pui.UTF8 = {

  encode: function(str) {
  	  	
    var utftext = "";
    		
    for (var n = 0; n < str.length; n++) {
        var c = str.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        } 
      } 
      
      return utftext;
    	
  },
  
  decode: function(utftext) {
  	
    var str = "";
    var i = 0;
    var c = c1 = c2 = 0;
    
    while (i < utftext.length) {			
      c = utftext.charCodeAt(i);
      if (c < 128) {
        str += String.fromCharCode(c);
        i++;
      }
      else if((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i+1);
        str += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      }
      else {
        c2 = utftext.charCodeAt(i+1);
        c3 = utftext.charCodeAt(i+2);
        str += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      } 
    }
    	
    return str;
    	
  }	
  
};

pui.Base64 = {

	alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	
	encode: function(input) {
	
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = pui.UTF8.encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
			this.alphabet.charAt(enc1) + this.alphabet.charAt(enc2) +
			this.alphabet.charAt(enc3) + this.alphabet.charAt(enc4);
		}
		return output;
							
	},
	
	decode: function(input) {
	
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = this.alphabet.indexOf(input.charAt(i++));
			enc2 = this.alphabet.indexOf(input.charAt(i++));
			enc3 = this.alphabet.indexOf(input.charAt(i++));
			enc4 = this.alphabet.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		} 
		output = pui.UTF8.decode(output);
		return output;	
			
	}
	
};



pui["downloadJSON"] = function() {
  if (pui["savedJSON"] == null) {
    pui.alert("JSON is not available.");
    return;
  }
  var json = pui["savedJSON"];
  if (typeof JSON === "object" && typeof JSON.parse === "function" && typeof JSON.stringify === "function") {
    try {  // just in case something goes wrong or browser doesn't support
      json = JSON.stringify(JSON.parse(pui["savedJSON"]), null, "  ");  // make it pretty
    }
    catch(err) { }
  }
  pui.downloadAsAttachment("text/plain", "json.txt", json);  
};




pui["keepAlive"] = function() {
  var url;
  
  if (context == "genie" && pui.genie.formSubmitted == true)
    return;
  
  if (context == "dspf") {
    if (pui.genie == null) url = getProgramURL("PUI0001200.pgm");
    else url = getProgramURL("PUI0002110.pgm");
  }
  else if (context == "genie") {
    url = DOCUMENT_URI;
  }
  else {
    return false;
  }
  if (pui.psid != null && pui.psid != "") url += "/" + pui.psid;
  if (pui["overrideSubmitUrl"] != null && typeof pui["overrideSubmitUrl"] == "function") {
    try {
      url = pui["overrideSubmitUrl"](url);
    }
    catch(e) {
    }
  }  

  if (context == "genie") pui.submitLog(pui.genie.formSubmitted = true);
  if (context == "dspf") pui.screenIsReady = false;
  pui.showWaitAnimation();

  var params = {
    "keepalive": "1"
  };
  if (pui["isCloud"]) params["workspace_id"] = pui.cloud.ws.id;
  
  ajax({
    "url": url,
    "method": "post",
    "params": params,
    "sendAsBinary": false,
    "suppressAlert": true,
    "handler": function() {
      pui.hideWaitAnimation();
      if (context == "genie") pui.submitLog(pui.genie.formSubmitted = false);
      if (context == "dspf") pui.screenIsReady = true;
      for (var i = 0; i < pui.gridsDisplayed.length; i++) {  
        var grid = pui.gridsDisplayed[i];
        grid["unMask"]();
      }
    },
    "onfail": function(req) {
      if (pui["onoffline"] == null && !pui["suppress comm errors"]) pui.alert(pui.getNoConnectionMessage(req));
      pui.hideWaitAnimation();
      if (context == "genie") pui.submitLog(pui.genie.formSubmitted = false);
      if (context == "dspf") pui.screenIsReady = true;
      for (var i = 0; i < pui.gridsDisplayed.length; i++) {  
        var grid = pui.gridsDisplayed[i];
        grid["unMask"]();
      }
      if (pui["onoffline"] != null) pui["onoffline"]();
    }      
  });

  return true;
};



pui["getWindowSize"] = function() {

  var winW;
  var winH;
  if (document.body && document.body.offsetWidth) {
    winW = document.body.offsetWidth;
    winH = document.body.offsetHeight;
  }
  if (document.compatMode=='CSS1Compat' &&
      document.documentElement &&
      document.documentElement.offsetWidth ) {
    winW = document.documentElement.offsetWidth;
    winH = document.documentElement.offsetHeight;
  }
  if (window.innerWidth && window.innerHeight) {
    winW = window.innerWidth;
    winH = window.innerHeight;
  }
  
  if (window.visualViewport && window.visualViewport.width && window.visualViewport.height) {
    winW = window.visualViewport.width;
    winH = window.visualViewport.height;
  }

  if (document.documentElement &&
      document.documentElement.clientWidth ) {
    winW = document.documentElement.clientWidth;
    winH = document.documentElement.clientHeight;
  }
  
  if (winW == null && screen != null) winW = screen.width;
  if (winH == null && screen != null) winH = screen.height;
  
  if (winW == null) winW = 800;
  if (winH == null) winH = 600;

  return {
    "width": winW,
    "height": winH
  };

};


pui["openURL"] = function(url) {
  window.open(url);
};






pui.normalizeURL = function(url, mobileClientOnly) {

  if (url == null || typeof url != "string") return "";

  if (mobileClientOnly == true && window["puiMobileClient"] == null) {
    return url;
  }
  
  if (url.substr(0, 5).toLowerCase() == "http:" || url.substr(0, 6).toLowerCase() == "https:") {
    return url;
  }

  if (pui["serverURL"] != null) {
    return pui["serverURL"] + url;
  }
  else if (window["cordova"] && url.substr(0, 1) == "/") {
    return url.substr(1);
  }
  else {
    return url;
  }

};




// use css3 to animate an element or container
pui["animate"] = function(parms) {
  var elem = parms["element"];
  if (typeof elem == "string") elem = getObj(elem);
  if (elem == null) return;
  var properties;
  var effect = parms["effect"];
  if (effect == "fly in left" || effect == "fly in right" || effect == "fly out left" || effect == "fly out right") properties = "left";
  else if (effect == "fly in up" || effect == "fly in down" || effect == "fly out up" || effect == "fly out down") properties = "top";
  else if (effect == "fade in" || effect == "fade out") properties = "opacity";
  else {
    properties = parms["properties"];
    if (properties == null) {
      properties = parms["property"];
      if (properties == null) return;
    }
  }
  if (typeof properties == "string") properties = [ properties ];
  var duration = parms["duration"];
  if (duration == null) duration = "500ms";
  if (duration.substr(duration.length - 1, 1) != "s") duration += "s";
  var ms = parseInt(duration) * 1000;
  if (duration.length > 2 && duration.substr(duration.length - 2, 2) == "ms") {
    ms = parseInt(duration);
  }
  var type = parms["type"];
  if (type == null) type = "ease";
  var from = parms["from"];
  var to = parms["to"];
  switch (effect) {
    case "fly in right":
      from = -elem.offsetWidth;
      from += "px";
      to = "0px";
      break;
    case "fly in left":
      from = elem.offsetWidth;
      from += "px";
      to = "0px";
      break;
    case "fly out left":
      to = -elem.offsetWidth;
      to += "px";
      from = "0px";
      break;
    case "fly out right":
      to = elem.offsetWidth;
      to += "px";
      from = "0px";
      break;
    case "fly out down":
      to = elem.offsetHeight;
      to += "px";
      from = "0px";
      break;
    case "fly out up":
      to = -elem.offsetHeight;
      to += "px";
      from = "0px";
      break;
    case "fly in up":
      from = elem.offsetHeight;
      from += "px";
      to = "0px";
      break;
    case "fly in down":
      from = -elem.offsetHeight;
      from += "px";
      to = "0px";
      break;
    case "fade in":
      from = "0";    
      to = "100";
      break;
    case "fade out":
      from = "100";    
      to = "0";
      break;
  }
  if (to == null) return;
  var value = "";
  for (var i = 0; i < properties.length; i++) {
    var property = properties[i];
    if (value != "") value += ", ";
    value += property + " " + duration + " " + type;
  }
  var transitionProperties = ['transition', 'MozTransition', 'WebkitTransition', 'msTransition', 'OTransition'];

  if (from != null) {
    if (typeof from == "string" || typeof from == "number") from = [ from ];
    for (var i = 0; i < properties.length; i++) {
      var property = properties[i];
      elem.style[property] = from[i];
    }
  }
  
  setTimeout(function() {
    for (var i= 0; i < transitionProperties.length; i++) {
      var tProp = transitionProperties[i];
      elem.style[tProp] = value;
    }
  
    setTimeout(function() {
      if (typeof to == "string" || typeof to == "number") to = [ to ];
      for (var i = 0; i < properties.length; i++) {
        var property = properties[i];
        elem.style[property] = to[i];
      }
      setTimeout(function() {
        for (var i= 0; i < transitionProperties.length; i++) {
          var tProp = transitionProperties[i];
          elem.style[tProp] = "";
        }
        if (parms["oncomplete"] != null) parms["oncomplete"]();
      }, ms);
    }, 1);
  }, 1);

};


pui["getActiveElement"] = function() {
  if (context == "genie") {
    return lastActiveElement;
  }
  else {
    return pui.activeElement;
  }
};


// API to allow scripts to send field exit.
pui["fieldExit"] = function(minus) {
	
	 var obj = pui["getActiveElement"]();
	 if (obj==null) return;
	 
	 var fldminus = false;
	 if (minus!=null) fldminus=true;
	 
   if (context == "genie") {
      fieldExit( obj, fldminus );		
   } 
   else {
      pui.doFieldExit( obj );
   }
	
};

pui["gotoNextElement"] = function(currentElement) {
  gotoElement(currentElement, true);
};

pui["gotoPreviousElement"] = function(currentElement) {
  gotoElement(currentElement, false);
};

function gotoElement(currentElement, forward) {
  var increment = forward ? 1 : -1;         // go forward (next) or backward (previous)
  var inputElements = document.querySelectorAll("INPUT,SELECT,TEXTAREA");
  var nbrElm = inputElements.length;
  if (nbrElm < 2)                           // nowhere to go
    return;
    
  var currentIndex = Array.prototype.indexOf.call(inputElements, currentElement);
  var nextIndex = currentIndex + increment;
  var nextElement;
  while (true) {
    if (nextIndex === currentIndex)         // no other focusable element; stay where you are
      break;
    if (nextIndex === nbrElm) {             // end of list; loop around to start
      nextIndex = 0;
      continue;
    }
    if (nextIndex === -1) {                 // start of list; loop around to end
      nextIndex = (nbrElm - 1);
      continue;
    }
    nextElement = inputElements[nextIndex];

    var nextObjBox = nextElement;
    if (nextElement != null && nextElement.comboBoxWidget != null) 
      nextObjBox = nextElement.comboBoxWidget.getBox();

    if (nextObjBox.readOnly || nextObjBox.disabled || nextObjBox.style.visibility === "hidden" || 
        nextObjBox.tabIndex === "-1" || !nextObjBox.clientHeight || !nextObjBox.clientWidth ) {
      nextIndex = nextIndex + increment;
      continue;                 // skip these elements
    }

    try {
      nextObjBox.focus();
      // If the element we are trying to force focus doesn't get focus -- then it has 
      // something else causing this field to not allow it to be focused; go to next element
      if (document.activeElement != nextObjBox) {
        nextIndex = nextIndex + increment;
        continue;
      }
      setTimeout(function() {
        pui.returnCursor(null, nextObjBox);
      }, 0);
    }
    catch(e) {}
    break;
  }   // endwhile looping thru the elments until finding correct one to focus on
}

pui["showCalendar"] = function(id) {
  var obj = id;
  if (typeof id == "string") obj = getObj(id);
  if (obj == null) return;
  if (typeof obj != "object") return;
  var calimg = obj.calimg;
  if (calimg == null) return;
  if (calimg.click != null && typeof calimg.click == "function") {
    calimg.click();
  }
  else if (calimg.onclick != null && typeof calimg.onclick == "function") {
    setTimeout(function() { calimg.onclick(); }, 250 );
  }
};




pui.getComputedStyle = function(obj) {
  var rtnStyle=null;
  if (window.getComputedStyle) {
    rtnStyle = window.getComputedStyle(obj);
  } 
  else if (obj.currentStyle) {
    rtnStyle = obj.currentStyle;
  }
  return rtnStyle;
};


/**
 * Upload one or more files via XMLHTTPRequest and calls an optional callback.
 * @param {Object} params
 * @param {Function} callback
 * @returns {XMLHTTPRequest} The XHR handling the upload.
 */
pui["upload"] = function(params, callback) {
  
  var dir = params["dir"];
  var overwrite = (params["overwrite"] === true);

  // The following values are passed by file upload widget 
  // for validation purposes. This is for convenience only, the values
  // can be spoofed. The exit program provides final validation. 
  
  // If these values are not passed by the caller (i.e. called by user, rather than widget), 
  // then take values from passed data and let exit program validate.
  
  var slimit;
  if (typeof(params["slimit"]) == "number") {
    
    slimit = params["slimit"];
    
  }
  
  var flimit;
  if (typeof(params["flimit"]) == "number") {
    
    flimit = params["flimit"];
    
  }
  
  var altname = "";
  if (typeof(params["altname"]) == "string") {
    
    altname = params["altname"];
    
  }
    
  var allowedTypes;
  if (typeof(params["allowedTypes"]) && params["allowedTypes"] instanceof Array) {
    
    allowedTypes = params["allowedTypes"];
    
  }
  
  // Get any missing values from data. 
  if (flimit == null) {
    
    flimit = params["files"].length;
    
  }
      
  if (slimit == null || allowedTypes == null) {
    
    var largest;
    var types = [];
    for (var i = 0; i < params["files"].length; i++) {
      
      var obj = params["files"][i];
      var type = (typeof(obj["type"]) != "undefined" && obj["type"] != "") ? obj["type"] : "application/octet-stream";
      if (pui.arrayIndexOf(types, type) == -1) {
        
        types.push(type);
        
      }
      
      var size;
      if (obj["data"] && obj["data"] instanceof ArrayBuffer) {
        
        size = obj["data"]["byteLength"];
        
        
      }
      else {
        
        size = obj.size;  
        
      }
      size = Math.ceil(size / 1048576); // Size rounded up to nearest MB.
      
      if (largest == null || size > largest) {
        
        largest = size;
        
      }    
      
    }
    
    if (slimit == null) {
      
      slimit = largest;
      
    }
    
    if (allowedTypes == null) {
      
      allowedTypes = types;
      
    }
  
  }
  
  var url = getProgramURL("PUI0009109.PGM");
  url += "?AUTH=" + encodeURIComponent(pui["appJob"]["auth"]);
  url += "&mode=ajax";
  url += "&r=" + Math.floor(Math.random() * 1000000000);
  if (pui["isCloud"]) {
    url += "&workspace_id=" + pui.cloud.ws.id;
  }
  
  var formData = new FormData();
  formData.append("dir", dir);
  formData.append("overwrite", (overwrite) ? "1" : "0");
  formData.append("flimit", flimit);
  formData.append("slimit", slimit); 
  formData.append("altname", altname);
  if (typeof params["generateNames"] == 'string'){
    formData.append("generateNames", params["generateNames"]);
  }
  
  for (var i = 0; i < allowedTypes.length; i++) {
    
    formData.append("type", allowedTypes[i]);
    
  }
  
  for (var i = 0; i < params["files"].length; i++) {
    
    var obj = params["files"][i];
    
    if (obj["data"] && obj["data"] instanceof ArrayBuffer) {
    
      var blob;  
      try {
        
        blob = new Blob([obj["data"]]);
        
      }
      catch(err) {
        
        var blobTheBuilder = new window["WebKitBlobBuilder"]();
        blobTheBuilder.append(obj["data"]);
        blob = blobTheBuilder["getBlob"]();
        
      }
      
      formData.append("file", blob);
      
    }
    else {
      
      formData.append("file", obj);
      
    }
    
    // Necessary as browsers do not handle form part naming for BLOBs very well. 
    formData.append("filename", obj["name"]);
    
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  
  xhr.onreadystatechange = function() {
  
    if (xhr.readyState != 4) {
      
      return;
      
    }
    
    var success = true;
    var error;
    if (xhr.status == 200) {
      
      var rsp;
      try {
        
        rsp = eval("(" + xhr.responseText + ")");
        
      }
      catch(e) {
        
        success = false;
        error = "Server response missing or invalid.";
          
      }
      if (rsp) {
        
        success = rsp["success"];
        if (!success) {
          
          if (rsp["key"]) {
            
            error = pui["getLanguageText"]("runtimeMsg", "upload " + rsp["key"]); 
            
            if (rsp["key"] == "file limit") {
              
              error = error.replace("&1", flimit); 
              
            }
            if (rsp["key"] == "size limit") {
              
              error = error.replace("&1", slimit); 
              
            }            

          }
          else {
            
            error = rsp["error"];
            
          }
          
        }
        
      }
      
    }
    else {
      
      success = false;
      error = xhr.status + " - " + xhr.statusText + ".";
      
    }
    
    if (typeof(callback) == "function") {
      
      callback(success, error);  
      
    }  
    
  };
  
  if (typeof params["onabort"] == "function") xhr["onabort"] = params["onabort"];
  if (typeof params["onprogress"] == "function" && "upload" in xhr) xhr["upload"]["onprogress"] = params["onprogress"];  //Fired periodically while uploading.
  if (typeof params["onload"] == "function") xhr["onload"] = params["onload"];    //Fires when finished.
  
  xhr.send(formData);  
  return xhr;
};





pui["getCookie"] = function(check_name) {
  // first we'll split this cookie up into name/value pairs
  // note: document.cookie only returns name=value, not the other components of the cookie
  var a_all_cookies = document.cookie.split(';');
  var a_temp_cookie = '';
  var cookie_name = '';
  var cookie_value = '';
  var b_cookie_found = false;
  var i = '';
  
  for (i = 0; i < a_all_cookies.length; i++) {
  	// now we'll split apart each name=value pair
  	a_temp_cookie = a_all_cookies[i].split('=');
  	
  	// and trim left/right whitespace while we're at it
  	cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
  
  	// if the extracted name matches passed check_name
  	if (cookie_name == check_name)	{
  		b_cookie_found = true;
  		// we need to handle case where cookie has no value but exists (no = sign, that is):
  		if ( a_temp_cookie.length > 1 )	{
  			cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
  		}
  		// note that in cases where cookie is initialized but no value, null is returned
  		return cookie_value;
  		break;
  	}
  	a_temp_cookie = null;
  	cookie_name = '';
  }
  if (!b_cookie_found) {
  	return null;
  }
};

/**
 * Set a document cookie.  https://docs.profoundlogic.com/x/KoCS 
 * @param {String} name           Name of the cookie.
 * @param {String} value          Value to place in the cookie.
 * @param {Number|Null} expires   Number of days cookie will expire in.
 * @param {String|Null} path      Path on server cookie is available to.
 * @param {String|Null} domain    Domain name cookie is available to.
 * @param {Boolean|Null} secure   When true cookie will only be sent over HTTPS connection.
 * @param {String|Null} sameSite  None, Strict, Lax. See https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
 */
pui["setCookie"] = function(name, value, expires, path, domain, secure, sameSite) {
	// set time, it's in milliseconds
	var today = new Date();
	today.setTime(today.getTime());

	// if the expires variable is set, make the correct expires time, the
	// current script below will set it for x number of days, to make it
	// for hours, delete * 24, for minutes, delete * 60 * 24
	if (expires) {
		expires = expires * 1000 * 60 * 60 * 24;
	}
	var expires_date = new Date( today.getTime() + (expires) );

	document.cookie = name + "=" +escape( value ) +
		( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) + 
		( ( path ) ? ";path=" + path : "" ) + 
		( ( domain ) ? ";domain=" + domain : "" ) +
          ( ( secure ) ? ";secure" : "" ) +
          (sameSite ? ";SameSite=" +sameSite : "")
        ;
};

// https://docs.profoundlogic.com/x/KICS 
pui["deleteCookie"] = function(name, path, domain, secure, sameSite) {
	if ( pui["getCookie"](name) ) document.cookie = name + "=" +
			( ( path ) ? ";path=" + path : "") +
			( ( domain ) ? ";domain=" + domain : "" ) +
          ";expires=Thu, 01-Jan-1970 00:00:01 GMT"+
          (secure ? ";Secure" : "") +
          (sameSite ? ";SameSite="+sameSite : "");
};




pui["refresh"] = function(parms) {
  if (parms == null) parms = {};
  var url = parms["url"];
  var skin = parms["skin"];
  pui["setCookie"]("puiRefreshId", pui.psid, null, "/", null, null, "Strict");
  pui.skipConfirm = true;
  pui.shutdownOnClose = false;
  pui.confirmOnClose = false;
  if (skin != null) {
    var skinParm = "skin=" + encodeURIComponent(skin);
    url = window.location.href;
    var parts = url.split("?");
    var page = parts[0];
    var queryString = parts[1];
    if (queryString == null) queryString = "";
    qparms = queryString.split("&");
    var appliedSkin = false;
    for (var i = 0; i < qparms.length; i++) {
      if (qparms[i].length >= 5 && qparms[i].substr(0, 5).toLowerCase() == "skin=") {
        qparms[i] = skinParm;
        appliedSkin = true;
      }
    }
    if (!appliedSkin) {
      if (qparms.length == 1 && qparms[0] == "") qparms[0] = skinParm;
      else qparms.push(skinParm);
    }
    queryString = qparms.join("&");
    url = page + "?" + queryString;
  }
  if (url != null) window.location.href = url;
  else window.location.reload();
};

pui["downloadURL"] = function (params) {

  if ( pui==null 
      || pui["appJob"]==null 
      || pui["appJob"]["auth"]==null
      || pui["appJob"]["auth"]=="" ) {
    if (pui["is_ie"]) {
      return "";
    }
    else {
      return "data:text/html," +
      "<!DOCTYPE html><html><body>" +
      "<p>To download, please connect to a Profound UI session.</p>" +
      "</body></html>";
    }
  }
  
  var inline = (params["inline"] === true);
  if (params["id"] == null) return "";  
  
  var url = getProgramURL("PUI0009110.PGM");
  url += "?id=" + encodeURIComponent(params["id"]);
  
  if (params["contentType"] != null) {
    url += "&type=" + encodeURIComponent(params["contentType"]);
  }
  
  if (inline) {
    url += "&inline=1";
  }
  
  url += "&usehttprc=0";
  url += "&AUTH=" + encodeURIComponent(pui["appJob"]["auth"]);
  url += "&r=" + Math.floor(Math.random() * 1000000000);

  return url;
};

pui["download"] = function (params) {

  var url = pui["downloadURL"](params);
  var inline = (params["inline"] === true);
  
  if ( pui==null 
      || pui["appJob"]==null 
      || pui["appJob"]["auth"]==null
      || pui["appJob"]["auth"]=="" ) {
    inline = true;    
  }
  
  if (inline) {
     pui["openURL"](url);
  }
  else {
     pui["link"](url);
  }
  
};

pui["focusOnContainer"] = function() {

    // Check for noderun embed box and prevent bouncing to the top of the parent page
    if (window.parent != window && pui.windowAccessible(window.parent) && window.parent.noderun) {
      return;
    }

    setTimeout(function() {

      // we no longer focus on container
      // this causes the browser to position the scrollbar to the container div when a header is added to start.html
      // we focus on a dummy box instead

      if (pui.dummyBox == null) {

        pui.dummyBox = document.createElement("input");
        if (pui["is_touch"]) {  // we use a button instead of a textbox for mobile devices to prevent the keyboard from inadvertantly popping up
          pui.dummyBox.type = "button";
        }
        else {
          pui.dummyBox.type = "text";
        }
        pui.dummyBox.readOnly = true;
        pui.dummyBox.style.position = "absolute";  
        pui.dummyBox.style.left = "-999px";
        pui.dummyBox.style.top = "-999px";
        pui.dummyBox.style.width = "10px";
        pui.dummyBox.style.borderStyle = "none";
        pui.dummyBox.style.backgroundColor = "transparent";
        pui.runtimeContainer.appendChild(pui.dummyBox);

      }

      pui.ignoreBlurs = true;
      
      pui.dummyBox.focus();
      
      setTimeout(function() {
        pui.ignoreBlurs = false;
      }, 0);
      
    }, 1);

};




pui["addCSS"] = function(css) {
  var head = document.getElementsByTagName("head")[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (pui["is_old_ie"]) {
    style.styleSheet.cssText = css;
  }
  else {
    style.innerHTML = css;
  }
  head.appendChild(style);
};

pui["loadCSS"] = function(path) {
  if (pui.getLink(path) != null) return false;
  var head = document.getElementsByTagName("head")[0];
  var css = document.createElement("link");
  css.setAttribute("rel", "stylesheet");
  css.setAttribute("type", "text/css");
  css.setAttribute("media", "screen");
  css.setAttribute("href", pui.normalizeURL(path));
  head.appendChild(css);
  return true;
};

pui["removeCSS"] = function(path) {
  var head = document.getElementsByTagName("head")[0];
  var link = pui.getLink(path);
  if (link == null) {
    var styles = head.getElementsByTagName("style");
    for (var i = 0; i < styles.length; i++) {
      var style = styles[i];
      if ( (style.innerHTML == path) || 
           (style.styleSheet != null && style.styleSheet.cssText == path) ) {  // In IE, this will not much unless CSS is formatted exactly how IE would format it
        head.removeChild(style);
        return true;
      }
    }
    return false;
  }
  else {
    head.removeChild(link);
    return true;
  }
};

pui["loadJS"] = function(parms) {
  if (parms == null) return null;
  var path;
  var callback;
  var onerror;
  var test;
  if (typeof parms == "string") {
    path = parms;
  }
  if (typeof parms == "object") {
    path = parms["path"];
    callback = parms["callback"];
    onerror = parms["onerror"];
    test = parms["test"];
    if (test != null && typeof test == "function" && test() == true) return false;  // already loaded
  }
  if (path == null) return null;
  if (pui.getScript(pui.normalizeURL(path)) != null) return false;
  var head = document.getElementsByTagName("head")[0];
  var done = false;   
  var script = document.createElement("script");
  script.type= "text/javascript";
  script.onreadystatechange= function () {
    if (script.readyState == "complete" || script.readyState == "loaded") {
      if (test != null && typeof test == "function" && test() != true) return;
      if (!done && callback != null) callback();
      done = true;
    }
  };
  script.onload = function() {
    if (test != null && typeof test == "function" && test() != true) return;
    if (!done && callback != null) callback();
    done = true;
  };
  if (onerror) script["onerror"] = onerror;
  script.src = pui.normalizeURL(path);
  head.appendChild(script);
  return true;
};



pui["endOfSession"] = function(message) {
  pui.confirmOnClose = false;
  pui.shutdownOnClose = false;
  if (window["puiMobileClient"] != null) {
    window.location.href = "index.html";
    if (message != null) pui.alert(message);
    return;
  }
  var parms = getQueryStringParms();
  var gobackto = parms["gobackto"];
  if (gobackto != null) {
    document.body.innerHTML = "";
    if (message != null) pui.alert(message);
    location.href = gobackto;
  }
  if (navigator["app"] != null && navigator["app"]["exitApp"] != null) {
    document.body.innerHTML = "";
    if (message != null) {
      pui.alert(message, function() { navigator["app"]["exitApp"](); });
    }
    else{
      navigator["app"]["exitApp"]();
    }      
    return;
  }
};


/**
 * Given a URL string, returns a new URL string with a new "cache buster" query string
 * parameter added or existing one updated to a new value. If the `method` parameter is
 * passed in but doesn't equal "get", then the url is returned unchanged as the request
 * wouldn't be cached anyway.
 * @param {string} url
 * @param {string} [method] - http method (optional) - For convenience; if not `get` then url is returned unchanged
 * @returns {string} New url
 * 
 * ```
 *  Example:
 *   Input:  "http://www.example.com/page?name=Fred&age=21"
 *   Output: "http://www.example.com/page?name=Fred&age=21&r=1574721438278"
 * ```
 */
pui["addUrlCacheBuster"] = function (url, method) {
  var cb = Date.now();

  if (typeof method === "string" && method.toLowerCase() !== "get") {
    return url;
  }

  // Replace old cache buster query string with new one, if one exists
  if (/[&?]r=[^&]+/.test(url)) {
    url = url.replace(/([&?]r=)[^&]+/, function (match, p1) {
      return p1 + cb;
    });
  // Otherwise add new cache buster onto URL
  } else {
    var separator = (url.indexOf('?') == -1) ? '?' : '&';
    url = url + separator + "r=" + cb;
  }

  return url;
};


pui.alert = function(msg, alertCallback, title, buttonName) {
  if (window["navigator"] != null && window["navigator"]["notification"] != null && window["navigator"]["notification"].alert != null) {
    if (alertCallback == null && title == null && buttonName == null && window["puiMobileClient"] != null && window["puiMobileClient"].alert != null) {
      window["puiMobileClient"].alert(msg);
    }
    else {
      if (alertCallback == null) alertCallback = function() {};
      if (title == null) title = "Profound UI";
      if (buttonName == null) buttonName = "OK";
      window["navigator"]["notification"].alert(msg, alertCallback, title, buttonName);
    }
  }  
  else if (pui.isPreview && window.parent && window.parent != window && pui.windowAccessible(window.parent) && window.parent.noderun) {  // noderun embed preview
    console.log("Suppressed alert: " + msg);
  }  
  else {
    alert(msg);
  }
};


pui["applyProperty"] = function(domObj, propertyName, propertyValue) {
  return window["applyProperty"](domObj, propertyName, propertyValue);
};

pui["get"] = function(id) {
  return get(id);
};

pui["set"] = function(id, val) {
  changeElementValue(id, val);
};

pui["getActiveContainer"] = function() {

  if (context == "genie") {

    var idx = 1;
    var topWin = document.getElementById("window" + idx);
    while (topWin) {
    
      var temp = document.getElementById("window" + (++idx));
      if (temp) {
      
        topWin = temp;
        
      }
      else {
      
        break;
      
      }
    
    }
    
    if (topWin) { 
    
      return topWin;
      
    }

  }
  else if (context == "dspf" && pui.lastWindow) {
  
    return pui.lastWindow;
  
  }
  
  return pui.runtimeContainer;

};

pui["getDisplayType"] = function() {
  
  if (pui.usingGenieHandler)
    return "5250-handler";
  else
    return (context == "dspf") ? "rdf" : "5250";
  
};

function runPCCommand(arg) {
  
  var listenerMode = 1;    //The PC command implementation. Use the Listener by default.
  
  // Support legacy options, "use pc listener" and "pc listener mode".
  if (pui["use pc listener"]) listenerMode = 1;
  if (window["HTTPS"]!=null && window["HTTPS"]=="ON" && listenerMode == 1) listenerMode = 2;
  if (pui["pc listener mode"]) listenerMode = parseInt(pui["pc listener mode"]);

  // Parse value from config file. "pc command mode" overrides "use pc listener" and "pc listener mode";
  if (typeof pui["pc command mode"] == "string"){
    switch(pui["pc command mode"]){
      case "applet":
        listenerMode = 0;
        break;
      case "listener":
        listenerMode = 1;
        break;
      case "listener_m2":
        listenerMode = 2;
        break;
      case "launcher":
        listenerMode = 3;
        break;
      default:
        listenerMode = 1;
        console.log("Unsupported pc command mode:",pui["pc command mode"]);
    }
  }
  
  // Load Java Applet if needed.
  
  if (listenerMode == 0) {
    var applet = document.getElementById("PCCommandApplet");
    if (!applet) {
      pui.appletCommandData = arg;
      loadPCCommandApplet("runCommandCb");
      return;  
    }
  }
  
  var commandList = [];
  var nextCommand = 0;
  
  // for backward compatibility, the argument to this function
  //   can be one of the following:
  //      string = just contains the command to run
  //      object = an object containing { "command": the-command, "wait": true/false }
  //      array  = array of objects (as 'object' above) to run multiple commands
  
  if (typeof arg == "string") {
    commandList = [ { "command": arg, "wait": false } ];
  }
  else {
    commandList = arg;
  }

  function doRunPCCommand() {
    
    if (nextCommand >= commandList.length) return;
    var command = commandList[nextCommand]["command"];
    var wait = commandList[nextCommand]["wait"];
    nextCommand += 1;

    if (typeof(pui["onPCCommand"]) == "function") {
      try {
        var userHandlerRc = pui["onPCCommand"](command, wait);  
        if (userHandlerRc == null || userHandlerRc == true ) {
          setTimeout(function() { doRunPCCommand(); }, 0);
          return;
        }
      }
      catch (e) {
        showFailureMessage(command);
      }
    }

    if (listenerMode == 1 || listenerMode == 2) {   //Use PC Listener (ajax or image version).
      
      var waitArg = (wait) ? "1" : "0";
      var port = (typeof pui["pc listener port"] == "number") ? pui["pc listener port"] : 80;
      var url = "http://localhost:" + port + "/?cmd=" + encodeURIComponent(command) + "&wait=" + waitArg;
      
      if ( listenerMode == 2 ) {   //The image version.
        url += "&type=image&rnd=" + String(Math.random()) + String(new Date().getTime());
        var cmdImg = new Image();
        cmdImg.onload = function() {
          doRunPCCommand();
        };
        cmdImg.onerror = function(){
          // Show error messages in Firefox, Chrome, Edge.
          console.log("PC Command Listener m2 failure.");
          showFailureMsg(command);
        };
        cmdImg.src = url;
      }
      else {
        var req = new pui.Ajax(url);
        req.method = "GET";
        req.async = (wait) ? false : true;
        req["suppressAlert"] = true;
        req["onfail"] = function(req) {
          if (req.getStatus() != 200) {
            console.log("PC Command Listener comm. failure: " + req.getStatusMessage());
            showFailureMsg(command);
          }
        };
        req["onsuccess"] = function() {
          doRunPCCommand();
        };
        req.send();
      }
      return;
    }
    
    if (listenerMode == 3) {     //Use the PC Command Launcher: custom protocol handler.
      
      // Encrypt the command via a CGI program so that the protocol handler will trust it.
      ajaxJSON({
        "url": getProgramURL("PUI0009117.pgm"),
        "method": "post",
        "params": {
          "cmd": command,
          "auth": pui["appJob"]["auth"]
        },
        "async": true,
        "handler": function(response, err){
          // Load a custom protocol URL in a hidden iframe to trigger the PC command launcher.
          // Note: no onload or onerror events fire for custom protocol iframes. Also,
          // you can't use XMLHttpRequest to load custom protocols; you must use iframes.
          if (response != null ) {
            if (response["cmd"]){
              var url = "puilaunch:" + encodeURIComponent(response["cmd"]);

              var iframe = document.createElement("iframe");
              iframe.style.display = "none";
              iframe.src = url;
              document.body.appendChild(iframe);

              // This delay is necessary, because in some browsers (Chrome), the iframe isn't loaded without the delay.
              // A long enough delay is necessary; otherwise, the command is unreliable #4597.
              // 0ms is too short. A longer delay keeps the node in memory longer but shouldn't hurt anything.
              setTimeout(function(){
                // The iframe could be orphaned from the DOM if the screen changed before it was removed.
                if (iframe != null && iframe.parentNode != null){
                  document.body.removeChild(iframe); //Remove the iframe; it's no longer needed.
                }
                iframe = null;
                doRunPCCommand();
              }, 5000);
            }
            else if (response["error"]){
              console.log("PC Command signing error:",response["error"]);
            }
          }else{
            console.log("Empty response from PC command signing program.");
          }
        } //end handler().
      });
      
      return;
    }
    
    // When running multiple commands with the Java applet
    //  join them together into a single string.
    //
    // NOTE: This does not work quite right because the parenthesis
    //       can change the meaning of some commands.  But, since
    //       the applet does not have a way to tell us when it's
    //       finished running a command, we use this as a workaround 
    //       -SK
    
    if (nextCommand==0 && commandList.length>0) {
      var arr = [];
      for (var i=0; i<commandList.length; i++) {
        arr.push("(" + commandList[i].command + ")");
      }
      command = arr.join(" && ");
    }
    
    try {
      applet["runCommand"](command);
    }
    catch(e) {
      var msg = "Unable to execute \"" + command + "\".\n\n";
      if (e != null) {
        msg += e.name + ":\n\n" + e.message + ".";
      }
      alert(msg);
    }  
    
  }

  doRunPCCommand();
  
  function showFailureMsg(command){
    console.log("Command: " + command);
    var msg = pui["getLanguageText"]("runtimeMsg", "pccommand error");
    if (pui["alert pccommand errors"] !== false) alert(msg);
    else console.log(msg);
    console.log("Visit https://docs.profoundlogic.com/x/aQFK for more information on supporting STRPCCMD.");
  }
}

window["runCommandCb"] = function() {

  runPCCommand(pui.appletCommandData);
  pui.appletCommandData = null;  

};

pui["runPCCommand"] = runPCCommand;




// press a key for the user
// example: pressKey('Enter');                // press enter
// example: pressKey('Option1');              // selects option 1
// example: pressKey('F5');                   // press F5
// example: pressKey('F5', 'F6', 'F7');       // press F5, then F6, then F7
function pressKey(keyDesc, onTimeoutDelay) {
  if (onTimeoutDelay != null && typeof onTimeoutDelay != "string" && onTimeoutDelay == true) {
    setTimeout(function() {
      pressKey(keyDesc);
    }, 0);
    return;
  }
  
  if (context == "dspf") {
    // Create button on the fly, so that the aid key is sent
    var keyButton = newElement("button");
    keyButton.id = "puiKeyButton";
    keyButton.style.display = "none";
    applyProperty("puiKeyButton", "shortcut key", keyDesc);
    pui.click("puiKeyButton");
    return;
  }
  
  if (arguments.length > 1) {
    var steps = [];
    for (var i = 0; i < arguments.length; i++) {
      steps[i] = "pressKey('" + arguments[i] + "')";
    }
    multiStepAction(steps);
    return;
  }
  if (keyDesc.substr(0,6) == 'option') {
    var option = keyDesc.substr(6);
    selectOption(option);
  }
  else {
    var keyname = getKeyNameFromDesc(keyDesc);
    if (keyname != '') {
      pressKeyUsingHexName(keyname);
    }
  }
}
// allow variations in spelling/case since this is a commonly used function
function presskey(key) { pressKey(key); } 
function Presskey(key) { pressKey(key); } 
function PressKey(key) { pressKey(key); } 
function pressKEY(key) { pressKey(key); } 
function PRESSKEY(key) { pressKey(key); } 


pui["isServerBusy"] = function() {
  if( typeof context == "undefined") return false; //change password page uses api.js but doesn't set context.
	if ( (context == "dspf" && pui.screenIsReady === false) || 
	     (context == "genie" && pui.genie.formSubmitted === true) ) return true;

	var frames = document.getElementsByTagName("iframe");
	for (var i = 0; i < frames.length; i++) {
		var frameWin = frames[i].contentWindow;
		if (frameWin == null) continue;
		var framePui = null;
		// must use try/catch to prevent cross-domain access denied errors
		try {
		  framePui = frameWin.pui;
		}
		catch(e) {
		}
		if (framePui == null) continue;
		if (typeof framePui !== "object") continue;
		if (typeof framePui["isServerBusy"] !== "function") continue;
		if (framePui["isServerBusy"]()) return true;
	}

	return false;
};


pui["showLastError"] = function() {

  if (errors.length == 0) {
    alert("No errors have been reported.");
    return;
  }

  var last = errors.length - 1;
  var error;
  var message;
  
  message = "Operation: " + errors[last].operation + 
                 "\nId: " + errors[last].id + 
          "\n\nMessage: " + errors[last].text + 
                     "\n" + errors[last].text2;
  
  alert(message);
  
};


// pui.editCode( number, editCode, [length, [decPos]], [curSym], [options] );
//
//    number = JS number to format
//  editCode = edit code (user defined codes not allowed)
//    length = (optional) total number of digits in output. default = size of input
//    decPos = (optional) number of decimal places in output, default = 0
//    curSym = (optional) currency symbol. default = none
//   options = (optional) object containing additional options
//     .dateEdit = *ymd for year/month/day
//     .dateEditSeparator = date separator to use
//     .decimalEdit = string with 0 for leading zero, plus decimal format
//                    for example, "0," for leading zero and commas.
//                                 "." for no leading zero and periods, etc.
//
//  Examples:
//     var foo = -0.123;
//     pui.editCode(foo, "K");         output = " .123-"
//     pui.editCode(foo, "K", 10, 5);  output = "     .12300-"

pui["editCode"] = function(numeric, code) {

  var parmLen = null;
  var parmDec = 0;
  var curSym = null;
  var controlOptions = { };

  // If the args after the edit code are numeric 
  // they will be the length and decimal places
  
  var nextArg = 2;
  if (typeof arguments[nextArg] === "number") {
    
    parmLen = arguments[nextArg];
    nextArg ++;

    if (typeof arguments[nextArg] === "number") {
      parmDec = arguments[nextArg];
      nextArg ++;
    }
  }
  
  // if the next parameter is a string, it is the
  // optional currency symbol
  
  if (typeof arguments[nextArg] === "string") {
    curSym = arguments[nextArg];
    nextArg ++;
  }
  
  // if the next parameter is an object, it is
  // the control options (replacing RPG's H-spec)
  
  if (typeof arguments[nextArg] === "object") {
    controlOptions = arguments[nextArg];
    nextArg ++;
  }

  var astFill = false;
  if (curSym === "*astfill") {
    astFill = true;
    curSym = null;
  }

  
  function formatAsDate(num, len) {
    var patterns = [
      "",            // 0
      "",            // 1
      "",            // 2
      "nn/n",        // 3
      "nn/nn",       // 4
      "nn/nn/n",     // 5
      "nn/nn/nn",    // 6
      "nnn/nn/nn",   // 7
      "nn/nn/nnnn",  // 8
      "nnn/nn/nnnn"  // 9
    ];
    if (controlOptions["dateEdit"] === "*ymd") {
      patterns[8] = "nnnn/nn/nn";
      patterns[9] = "nnnnn/nn/nn";
    }
    var pattern = patterns[dataLength];
    num = String(num);
    num = num.replace(".", "");
    num = num.replace(",", "");
    num = num.replace("-", "");
    num = "0000000000" + num;
    num = num.substr(num.length - len);
    var separator = "/";
    if (controlOptions["dateEditSeparator"] != null) separator = controlOptions["dateEditSeparator"];
    var useZeros = false;
    var idx = 0;
    var returnValue = "";
    for (var i = 0; i < pattern.length; i++) {
      var ch = pattern.substr(i, 1);
      var ch2 = pattern.substr(i + 1, 1);
      if (ch === "/" || ch2 === "/") useZeros = true;
      if (ch === "/") {
        ch = separator;
      }
      else {
        ch = num.substr(idx, 1);
        idx += 1;
        if (ch === "0") {
          if (!useZeros) ch = " ";
        }
        else {
          useZeros = true;
        }
      }
      returnValue += ch;
    }
    return returnValue;
  }
  
  function leftPad(str, len, chr) {
    str += '';
    while(str.length < len){
      str = chr + str;
    }
    return str;
  }

  function rightPad(str, len, chr) {
    str += '';
    while(str.length < len){
      str += chr;
    }
    return str;
  }
  
  function fill() {
    var fillLen = dataLength;
    fillLen += (decLength && !noDecimal ? 1 : 0);
    if (numSep) fillLen += parseInt((dataLength - decLength - 1) / 3);
    if (negNum === "999.00CR") fillLen += 2;
    if (negNum === "999.00-") fillLen += 1;
    if (negNum === "-999.00") fillLen += 1;
    if (typeof curSym === "string") fillLen += curSym.length;
    strValue = leftPad(strValue, fillLen, fillChar);
  }

  var zeroFill = false;
  var negNum = null;
  var numSep = false;
  var zeroBalance = false;
  var noDecimal = false;

  var decimalFormat = " ";
  if (pui.appJob && typeof pui.appJob["decimalFormat"] === "string") decimalFormat = pui.appJob["decimalFormat"];
  
  var commaDecimal = (decimalFormat === "I" || decimalFormat === "J");  
  var leadingZeros = (decimalFormat === "J");
  
  if (controlOptions["decimalEdit"] != null) {
    commaDecimal = (controlOptions["decimalEdit"] === "," || controlOptions["decimalEdit"] === "0,");
    leadingZeros = (controlOptions["decimalEdit"] === "0." || controlOptions["decimalEdit"] === "0,");
  }

  if (code >= "1" && code <= "4") negNum = "999.00";
  if (code >= "A" && code <= "D") negNum = "999.00CR";
  if (code >= "J" && code <= "M") negNum = "999.00-";
  if (code >= "N" && code <= "Q") negNum = "-999.00";
  
  if (code == "1" || code == "A" || code == "J" || code == "N" || 
      code == "2" || code == "B" || code == "K" || code == "O") numSep = true;

  if (code == "1" || code == "A" || code == "J" || code == "N" || 
      code == "3" || code == "C" || code == "L" || code == "P") {
    zeroBalance = true;
  }
  else {
    zeroBalance = false;
  }
  
  if (code == "Z") {
    negNum = "999.00";
  }
  if (code === "X" || code === "Z") {
    noDecimal = true;
  }
  if (code === "X") {
    zeroFill = true;
  }
  
  if (code >= "5" && code <= "9") {
    pui.alert("User-defined edit code not supported: " + code + ".");
  }
  if (!(code >= "1" && code <= "9" || 
        code >= "A" && code <= "D" || 
        code >= "J" && code <= "Q" || 
        code >= "X" && code <= "Z")) {
    pui.alert("Invalid edit code: " + code + ".");
  }

  var strValue = (numeric || 0) + '';
  var numValue = parseFloat(strValue, 10) || 0;
  
  var strInt;      
  //scrap everything from decimal point on
  strInt = strValue.replace(/\..*/, '');
  if (strInt === "-0") strInt = "-";
  if ((strInt == "" || strInt == "-") && leadingZeros) {
    strInt = "0";
  }
  
  var strDec;
  //scrap everything up to and including decimal point      
  var strValueWithDecimalPoint = strValue;
  if (strValueWithDecimalPoint.indexOf(".") == -1) strValueWithDecimalPoint += ".";
  strDec = strValueWithDecimalPoint.replace(/.*\./, ''); 

  var dataLength = strInt.length;  // default length
  var minDefaultLength = 3;
  if (dataLength < minDefaultLength) dataLength = minDefaultLength;
  var decLength = strDec.length;  // default decimal positions
  
  if (typeof parmLen === "number") dataLength = parmLen;
  if (typeof parmDec === "number") decLength = parmDec;
  
  if (code == "Y") {
    if (dataLength < 3 || dataLength > 9) {
      pui.alert("Length not valid for edit code Y.");
    }
    return formatAsDate(numValue, dataLength);
  }
  
  var decimalChar = ".";
  if (commaDecimal) decimalChar = ",";
  if (noDecimal) decimalChar = "";
  
  if (decLength > 0){
    strDec = rightPad(strDec, decLength, '0');
    if (strInt === "0" && !leadingZeros) strInt = "";
    strValue = strInt + decimalChar + strDec;
  }
  
  var fillChar = " ";
  if (zeroFill) fillChar = "0";
  if (astFill) fillChar = "*";
  
  if (numSep) {
    var regex = /(\d+)(\d{3})/;
    while(regex.test(strInt)){
      strInt = strInt.replace(regex, '$1' + (commaDecimal ? '.' : ',') + '$2');
    }
    strValue = strInt + (decLength > 0 ? decimalChar + strDec : '');
    var commaCount = dataLength - decLength - 1;
    commaCount = (commaCount >= 0 ? commaCount : 0);
  }
  
  //format negative numbers
  var isNegative = numValue < 0;
  strValue = strValue.replace(/-/g, '');
  if (negNum === '(999.00)') {
    if (isNegative) {
      strValue = '(' + strValue + ')';
    }
  }
  else if (negNum === '999.00-') {
    if (isNegative) {
      strValue += '-';
    }
    else {
      strValue += ' ';
    }
  }
  else if (negNum === '999.00CR') {
    if (isNegative) {
      strValue += 'CR';
    }
    else {
      strValue += "  ";
    }
  }
  else if (negNum === '-999.00') {
    if (isNegative) {
      strValue = '-' + strValue;
    }
  }

  if (curSym) {
    if (curSym == "EUR") {
      strValue = strValue + " EUR";
    }
    else if (curSym == "$") {
    if (strValue.substr(0,1) == "-") {
        strValue = "-" + curSym + strValue.substr(1);
      }
      else {
        strValue = curSym + strValue;
      }
    }
    else {
      strValue = curSym + strValue;
    }
  }

  if (!zeroBalance) {
    if (numValue === 0) {
      strValue = '';
    }
  }
  
  fill();
  
  return strValue;
};



// pui.editWord( number, editWord, [options])
//
//    number = JS number to format
//  editWord = edit word in standard IBM format
//   options = (optional) object containing additional options
//     .currencySymbol = symbol to use, $ is default. Must match
//                        the character used in the edit word
//     .decimalFormat = blank, I or J. Controls whether commas
//                        or periods are used as the decimal
//                        separator. Must match the character
//                        used in the edit word.  Default is
//                        to use the setting from the application
//                        job, or blank (period) if running 
//                        outside of a session.


pui["editWord"] = function(value, edtwrd, parmOpts) {

  value = String(value);
  var controlOptions = {};

  if (typeof parmOpts === "object") {
    controlOptions = parmOpts;
  }
  
  // get currency symbol
  var curSym = "$";
  if (controlOptions["currencySymbol"] != null) curSym = controlOptions["currencySymbol"];
  
  // get zero suppression position
  var zeroSuppressPos = edtwrd.indexOf("0") + 1;  
  var zeroSuppressPos2 = edtwrd.indexOf("*") + 1;
  if (zeroSuppressPos == 0 || (zeroSuppressPos2 != 0 && zeroSuppressPos2 < zeroSuppressPos)) {
    zeroSuppressPos = zeroSuppressPos2;
  }  
  
  // look for farthest right character that can be replaced by a digit
  // to determine where the body part of the edit word ends
  var bodyEndPos = -1;
  for (var i = edtwrd.length - 1; i >= 0; i = i - 1) {
    if (i + 1 == zeroSuppressPos || edtwrd.substr(i, 1) == " ") {
      bodyEndPos = i;
      break;
    }
  }
  
  // get body, status, and expansion parts of the edit word
  var editBody = edtwrd.substr(0, bodyEndPos + 1);
  var editStatus = "";
  var editExpansion = "";
  var done = false;
  var encounteredSign = false;
  var hasSign = (edtwrd.substr(bodyEndPos + 1).indexOf("-") >= 0 || edtwrd.substr(bodyEndPos + 1).indexOf("CR") >= 0);
  for (var i = bodyEndPos + 1; i < edtwrd.length; i++) {
    var ch = edtwrd.substr(i, 1);
    if (edtwrd.substr(i, 2) == "CR") {
      encounteredSign = true;
      i++;
      continue;
    }
    if (ch == "-") {
      encounteredSign = true;
      continue;
    }
    if (ch == "&") {
      continue;
    }
    if (ch == "*" && !encounteredSign) {
      continue;
    }
    if (ch.toUpperCase() >= "A" && ch.toUpperCase() <= "Z" && hasSign && !encounteredSign) {
      edtwrd = edtwrd.substr(0,i) + " " + edtwrd.substr(i + 1);
      continue;
    }
    editStatus = edtwrd.substring(bodyEndPos + 1, i);
    editExpansion = edtwrd.substr(i);
    done = true;
    break;
  }
  if (!done) {
    editStatus = edtwrd.substr(bodyEndPos + 1);
  }

  // Figure out which character is used for a decimal place in
  // the edit word.
  var decimalChar = ".";
  var decimalFormat = " ";
  if (pui.appJob && typeof pui.appJob["decimalFormat"] === "string") decimalFormat = pui.appJob["decimalFormat"];
  if (typeof controlOptions["decimalFormat"] === "string") decimalFormat = controlOptions["decimalFormat"];
  if (decimalFormat==="I" || decimalFormat==="J") decimalChar = ",";

  // Count how many spaces come after the decimal place in the edit word pattern
  // we need to pad to this position to make the decimals line up
  
  var editDecPos = 0;
  var editDecPortion = editBody.split(decimalChar);
  if (editDecPortion.length > 1) {
    var editDecBlanks = editDecPortion[1].replace(/[^ ]/g, "");
    editDecPos = editDecBlanks.length;
  }
  
  // format value as a string of digits
  
  var charValue;
  if (isNaN(Number(value))) {
    charValue = "0";
  }
  else {
    charValue = String(value);
  }
  
  charValue = charValue.replace("-", "");  // remove negative sign
  var numParts = charValue.split(".");     // since this came from a JS number, will never be comma
  var intPortion = numParts[0];
  var decPortion = "";
  var decPos = null;
  if (numParts.length > 1) decPortion = numParts[1];
  if (decPos == null || isNaN(decPos)) {
    decPos = editDecPos;
  }
  while (decPortion.length > decPos) {
    decPortion = decPortion.substr(0, decPortion.length - 1);
  }
  while (decPos > decPortion.length) {
    decPortion += "0";
  }
  charValue = intPortion + decPortion;
  while (charValue.substr(0,1) == "0") {
    charValue = charValue.substr(1);
  }

  // format body part of edit word  
  var newValue = "";
  var beforeSignificantDigits = false;
  var asteriskProtection = false;
  var floatingCurSym = false;
  var zeroSuppress = false;
  if (zeroSuppressPos == 0) zeroSuppress = true;
  function getDigit() {
    if (charValue.length > 0) {
      var ch = charValue.substr(charValue.length - 1, 1);
      charValue = charValue.substr(0, charValue.length - 1);
      if (ch == "0" && charValue.length == 0 && zeroSuppress) {
        if (asteriskProtection) ch = "*";
        else ch = " ";
      }
    }
    else {
      ch = "0";
      if (zeroSuppress) ch = " ";
      if (asteriskProtection) ch = "*";
    }
    return ch;
  }
  for (var i = editBody.length - 1; i >= 0; i = i - 1) {
    var ch = editBody.substr(i, 1);
    var newCh = ch;
    if (ch == " ") {
      newCh = getDigit();
    }
    else if (ch == "&") {
      newCh = " ";
    }
    else if (ch == "0" && i + 1 == zeroSuppressPos) {
      newCh = getDigit();
    }
    else if (ch == "*") {
      asteriskProtection = true;
      newCh = getDigit();      
    }
    else if (ch == curSym) {
      if (i + 2 == zeroSuppressPos) {
        // floating currency symbol
        newCh = getDigit();
        floatingCurSym = true;
      }
    }
    else if (ch == "." || ch == ",") {
      if (beforeSignificantDigits) {
        newCh = " ";
        if (asteriskProtection) newCh = "*";
      }
    }
    else {
      if (beforeSignificantDigits) {
        newCh = " ";
        if (asteriskProtection) newCh = "*";
      }
    }
    
    newValue = newCh + newValue;
    
    if (i <= zeroSuppressPos) zeroSuppress = true;
    if (zeroSuppress && charValue.length == 0) {
      beforeSignificantDigits = true;
    }
  }
  
  // format status part of edit word
  editStatus = editStatus.replace(/&/g, " ");
  editStatus = editStatus.replace(/\*/g, " ");
  if (value >= 0) {
    editStatus = editStatus.replace("CR", "  ");
    editStatus = editStatus.replace("-", " ");
  }

  // combine body, status, expansion results, and add floating currency symbol if applicable
  newValue = newValue + editStatus + editExpansion;
  var len = newValue.length - 1;
  newValue = ltrim(newValue);
  if (asteriskProtection && newValue.substr(0,1) != "*") newValue = "*" + newValue;
  if (floatingCurSym) newValue = curSym + newValue;
  
  var sub = 0;
  if (newValue[newValue.length-1] === '-') {
    sub = 1;
  }
  
  while (newValue.length <= len) {
    newValue = " " + newValue;
  }
  
  return newValue;

};
