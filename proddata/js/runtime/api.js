//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2015 Profound Logic Software, Inc.
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
        
          pui.cursorValues.row = obj.cursorRow;
          pui.cursorValues.column = obj.cursorColumn;
        
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
  if (typeof(obj) == "string") var obj = getObj(obj);
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
  if (elem.tagName == "INPUT" || elem.tagName == "SELECT" || elem.tagName == "TEXTAREA") {
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
      elem.value = val;
    }
  }
  if (context == "dspf") {
    elem.modified = true;
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

}

pui.getMouseY = function(event) {

  return pui.getMouseXY(event).y;

}

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

}

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
	
}



pui["downloadJSON"] = function() {
  if (pui["savedJSON"] == null) {
    pui.alert("JSON is not available.");
    return;
  }
  pui.downloadAsAttachment("text/plain", "json.txt", pui["savedJSON"]);  
}




pui["keepAlive"] = function() {
  var url;
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

  if (context == "genie") pui.genie.formSubmitted = true;
  if (context == "dspf") pui.screenIsReady = false;
  pui.showWaitAnimation();

  ajax({
    "url": url,
    "method": "post",
    "params": {
      "keepalive": "1"
    },
    "sendAsBinary": false,
    "suppressAlert": true,
    "handler": function() {
      pui.hideWaitAnimation(true);
      if (context == "genie") pui.genie.formSubmitted = false;
      if (context == "dspf") {
        pui.screenIsReady = true;
        for (var i = 0; i < pui.gridsDisplayed.length; i++) {  
          var grid = pui.gridsDisplayed[i];
          grid.unMask();
        }
      }
    },
    "onfail": function(req) {
      if (pui["onoffline"] == null) pui.alert(pui.getNoConnectionMessage(req));
      pui.hideWaitAnimation(true);
      if (context == "genie") pui.genie.formSubmitted = false;
      if (context == "dspf") {
        pui.screenIsReady = true;
        for (var i = 0; i < pui.gridsDisplayed.length; i++) {  
          var grid = pui.gridsDisplayed[i];
          grid.unMask();
        }
      }
      if (pui["onoffline"] != null) pui["onoffline"]();
    }      
  });

  return true;
}



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
  
  if (winW == null && screen != null) winW = screen.width;
  if (winH == null && screen != null) winH = screen.height;
  
  if (winW == null) winW = 800;
  if (winH == null) winH = 600;

  return {
    "width": winW,
    "height": winH
  }

}


pui["openURL"] = function(url) {
  window.open(url);
}






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

}




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

}


pui["getActiveElement"] = function() {
  if (context == "genie") {
    return lastActiveElement;
  }
  else {
    return pui.activeElement;
  }
}


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
}




pui.getComputedStyle = function(obj) {
  var rtnStyle=null;
  if (window.getComputedStyle) {
    rtnStyle = window.getComputedStyle(obj);
  } 
  else if (obj.currentStyle) {
    rtnStyle = obj.currentStyle;
  }
  return rtnStyle;
}



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
  
  var formData = new FormData();
  formData.append("dir", dir);
  formData.append("overwrite", (overwrite) ? "1" : "0");
  formData.append("flimit", flimit);
  formData.append("slimit", slimit); 
  formData.append("altname", altname);
  
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
        error = "Server response missing or invalid."
          
      }
      if (rsp) {
        
        success = rsp["success"];
        if (!success) {
          
          if (rsp["key"]) {
            
            error = pui.getLanguageText("runtimeMsg", "upload " + rsp["key"]); 
            
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
    
  }
  
  xhr.send(formData);  
  
}





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
}

pui["setCookie"] = function(name, value, expires, path, domain, secure) {
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
		( ( secure ) ? ";secure" : "" );
}

pui["deleteCookie"] = function(name, path, domain) {
	if ( pui["getCookie"](name) ) document.cookie = name + "=" +
			( ( path ) ? ";path=" + path : "") +
			( ( domain ) ? ";domain=" + domain : "" ) +
			";expires=Thu, 01-Jan-1970 00:00:01 GMT";
}




pui["refresh"] = function(parms) {
  if (parms == null) parms = {};
  var url = parms["url"];
  var skin = parms["skin"];
  pui["setCookie"]("puiRefreshId", pui.psid, null, "/");
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
}

pui["downloadURL"] = function (params) {

  var inline = (params["inline"] === true);
  if (params["id"] == null) return;  
  
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
}

pui["download"] = function (params) {

  var url = pui["downloadURL"](params);
  var inline = (params["inline"] === true);
  
  if (inline) {
     pui["openURL"](url);
  }
  else {
     pui["link"](url);
  }
  
}

pui["focusOnContainer"] = function() {

    setTimeout(function() {

      // we no longer focus on container
      // this causes the browser to position the scrollbar to the container div when a header is added to start.html
      // we focus on a dummy box instead

      if (pui.dummyBox == null) {

        pui.dummyBox = document.createElement("input");
        if (pui.touchDevice) {  // we use a button instead of a textbox for mobile devices to prevent the keyboard from inadvertantly popping up
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

}




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
}

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
}

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
}

pui["loadJS"] = function(parms) {
  if (parms == null) return null;
  var path;
  var callback;
  var test;
  if (typeof parms == "string") {
    path = parms;
  }
  if (typeof parms == "object") {
    path = parms["path"];
    callback = parms["callback"];
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
  }
  script.onload = function() {
    if (test != null && typeof test == "function" && test() != true) return;
    if (!done && callback != null) callback();
    done = true;
  };
  script.src = pui.normalizeURL(path);
  head.appendChild(script);
  return true;
}



pui["endOfSession"] = function(message) {
  pui.confirmOnClose = false;
  pui.shutdownOnClose = false;
  if (window["puiMobileClient"] != null && window["puiMobileClient"]["showConnections"] != null) {
    window["puiMobileClient"]["showConnections"]();
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
      pui.alert(message, function() { navigator["app"]["exitApp"]() });
    }      
    return;
  }
}



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
  else {
    alert(msg);
  }
}


pui["get"] = function(id) {
  return get(id);
}

pui["set"] = function(id, val) {
  changeElementValue(id, val);
}

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

}
