
function getTarget(e) {
	var targ;
	if (!e) var e = window.event;
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
  for(i = 0; i < n; i++ ) {
    var obj = form.elements[i];
    if (obj.name == elemName) {
      return obj;
    }
  }
  return null;
}


function disableAction(e){
  if(is_ie5up){
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

  if (pui.genie.formSubmitted) return false;
  
  // Execute onsubmit function
  if (designScreens[0] && screenPropertiesObj[designScreens[0].screenId] != null && screenPropertiesObj[designScreens[0].screenId].screen != null) {
    var onsubmitProp = screenPropertiesObj[designScreens[0].screenId].screen["onsubmit"];
    if (onsubmitProp != null && onsubmitProp != "") {
      try {
        var onsubmitReturnVal = eval(onsubmitProp);
        if (onsubmitReturnVal == false) return false;
      }
      catch(err) {
        pui.alert("Onsubmit Error:\n" + err.message);
        return false;
      }
    }
  }
  
  pui.genie.formSubmitted = true;
  var cursorPos = getCursorPosition(lastActiveElement);
  if (lastActiveElement != null && lastActiveElement.tagName == "INPUT" && lastActiveElement.maxLength != null && lastActiveElement.maxLength > 0 && cursorPos == lastActiveElement.maxLength) {
    // cursor beyond last character
    cursorPos -= 1;  // set to last character
  }
  document.getElementById('cursorPos').value = cursorPos;
  if (!pui.genie.config.useAjax) return true;
  var form = document.forms['main'];
  
  var hiddenField = createNamedElement("input", "ajax");
  hiddenField.type = "hidden";
  hiddenField.value = "Y";
  form.appendChild(hiddenField);
  ajaxSubmit(form, function(response) {
    newScreenHTML = response;
    prevScreenHTML = document.getElementById(appContainerId).innerHTML;
    document.getElementById(appContainerId).innerHTML = newScreenHTML;
    var scripts = document.getElementById(appContainerId).getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var script = scripts[i].innerHTML;
      eval(script);
    }
    genie(); 
  });
  return false;
}



/***************************************************************
*  This section of code handles only allowing a set number of  *
*  keys to be pressed.  For example only allowing numbers for  *
*  a numeric field.  This also includes additional keys. These *
*  are keys that must function as normal such as \, Control, *
*  and etc.                                                    *
***************************************************************/
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
  var allowedUnicodes = new Array(8,9,13,16,17,18,19,20,27,33,34,35,36,37,38,39,40,45,46,48,49,50,51,52,53,54,55,56,57,91,93,96,97,98,99,100,101,102,103,104,105,109,110,112,123,144,145,188,190,112,113,114,115,116,117,118,119,120,121,122,123,189,109,pui["field exit key"]);
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


function defaultField(e){
  var allowedUnicodes = new Array(256)
  
  
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
  if (obj.tagName != "INPUT" || (obj.type != null && obj.type != "" && obj.type != "text" && obj.type != "number" && obj.type != "password")) return -1;
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


function buildLabel(dom, labelText) {
  var label = document.createElement("div");
  label.style.position = "absolute";
  label.style.borderStyle = "none";
  label.style.backgroundColor = "transparent";
  label.innerHTML = '<label for="' + dom.id + '">' + labelText + '</label>';
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
  var left = parseInt(dom.style.left);
  if (isNaN(left)) left = 0;
  var top = parseInt(dom.style.top);
  if (isNaN(top)) top = 0;
  var width = dom.offsetWidth;
  if (width < 20) width = 20;
  label.style.left = left + width + "px";
  label.style.top = top + "px";
  label.style.zIndex = dom.style.zIndex;
  label.style.visibility = dom.style.visibility;
  label.style.color = dom.style.color;
  label.style.fontFamily = dom.style.fontFamily;
  label.style.fontSize = dom.style.fontSize;
  label.style.fontStyle = dom.style.fontStyle;
  label.style.fontWeight = dom.style.fontWeight;
  label.style.backgroundColor = dom.style.backgroundColor;
  //if (context == "dspf") label.style.paddingTop = "1px";
  if (dom.style.cursor) {
    label.style.cursor = dom.style.cursor;
  }
  else {
    label.style.cursor = "pointer";
  }
  label.isLabel = true;
  dom.labelObj = label;
  dom.extraDomEls = [];
  dom.extraDomEls.push(label);
  dom.parentNode.appendChild(label);  
}

// Returns the PC-side timestamp in milliseconds since 1970/01/01 as a string.
function getTimeStamp() {

  return String(new Date().getTime());

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
}


// Returns index of element in array, if found, or -1 if not.
pui.arrayIndexOf = function (array, element) {

  for (var i = 0; i < array.length; i++) {
    if (array[i] == element) return i;
  }
  return -1;

}

// Calls a function for each array element.
pui.arrayForEach = function(array, func) {

  for (var i = 0; i < array.length; i++) {
    func(array[i]);
  }
  
}

pui.alert = function(msg) {
  //if (Ext != null && Ext.MessageBox != null && Ext.MessageBox.alert != null) {
  //  Ext.MessageBox.alert("?", msg);
  //}
  //else {
    alert(msg);
  //}
}

pui.safeParseInt = function(stringValue, nanValue) {
  if (nanValue == null) nanValue = 0;
  var number = parseInt(stringValue, 10);
  if (isNaN(number)) number = nanValue;
  return number;
}

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

  if (context == "dspf") return allowKeysSimple(allowedUnicodes, e);

  var obj;
  var key;
  var n = 0;
  var len;
  var pos;
  var success;
  var shiftKey;
  var isTextbox = false;

  //key=(typeof event!='undefined')?window.event.keyCode:e.keyCode;
  key = e.keyCode;
  obj = e.target || e.srcElement; // IE doesn't use .target
  
  if (obj.tagName == "INPUT") {
    if (obj.type == null || obj.type == "" || obj.type == "text" || obj.type == "number" || obj.type == "password") {
      isTextbox = true;
    }
  }

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
  if (key == 8) {     // backspace key
  
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
  } 
  if (key == 35 && isTextbox) {     // end key
    if (obj.value != rtrim(obj.value)) {
      obj.value = rtrim(obj.value);
    }  
  }
  if (key == 37) {     // left key
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
  if (key == 38 && obj.tagName != "SELECT" && obj.tagName != "TEXTAREA") {     // up key
  	
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
  if (key == 39) {     // right key
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
  if (key == 40 && obj.tagName != "SELECT" && obj.tagName != "TEXTAREA") {     // down key
  	
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
  if (key == pui["field exit key"] && isTextbox && !e.shiftKey) {    // numpad plus sign
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
  if (minus && (signedNumeric==null || signedNumeric!='Y')) return false;
  var pos = obj.cursorPosition;
  if (pui.touchDevice) {
     pos = getCursorPosition(obj);
  }
  if (pos == null) return false;
  if (pos < 0) return false;
  if (pos >= 0) {
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
  goNext(obj);
  return true;
}







pui.beforeUnload = function(event) {
  if (pui.touchDevice || pui.iPadEmulation) return;
  
  if (pui.confirmOnClose && !pui.skipConfirm) {
    if (context == "genie" && pui.isSignOnScreen()) return;
    if (window.parent != window && typeof(window.parent["Atrium"]) != "undefined") return;
    if (context == "genie" || !inDesignMode() || recordFormats.isDirty()) {
      if (context == "genie" && pui.genie.config.closeMessage != null && pui.genie.config.closeMessage != "") {
        pui.closeMessage = pui.genie.config.closeMessage;
      }
      event.returnValue = pui.closeMessage;
      return pui.closeMessage;
    }
  }
}

pui["unload"] = function() {
  if (pui.shutdownOnClose) {
    var url;
    if (pui.genie == null) url = getProgramURL("PUI0001200.pgm");
    else url = getProgramURL("PUI0002110.pgm");
    if (pui.psid != null && pui.psid != "") url += "/" + pui.psid;
    ajax({
      url: url,
      method: "post",
      suppressAlert: true,
      params: {
        "shutdown": "1"
      }
    });
    pui.shutdownOnClose = false;
  }
}

pui.assignUnloadEvents = function() {
  if (window.attachEvent) {
    window.attachEvent("onbeforeunload", pui.beforeUnload);
    window.attachEvent("onunload", pui["unload"]);
  }
  else if (window.addEventListener) {
    window.addEventListener("beforeunload", pui.beforeUnload, false);
    window.addEventListener("unload", pui["unload"], false);        
  }
}


pui.downloadAsAttachment = function(contentType, fileName, data) {

  var form = document.createElement("form");
  form.action = getProgramURL("PUI0009106.pgm") + "?contentType=" + contentType + "&fileName=" + fileName;
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

}


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
}

pui.removeCssClass = function(dom, clsName) {
  var cls = dom.className;
  if (cls == null) return;
  if (cls == "") return;
  var clsArray = cls.split(" ");
  var newClsArray = [];
  for (var i = 0; i < clsArray.length; i++) {
    if (clsArray[i] != "" && clsArray[i] != clsName) newClsArray.push(clsArray[i]);
  }
  dom.className = newClsArray.join(" ");
}


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
}

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
}

pui.attachOnUserActivity = function() {
  if (pui.onUserActivityAttached) return;  
  if (pui["onuseractivity"] == null) return;
  function onUserActivity() {
    if (pui["onuseractivity"] != null) pui["onuseractivity"]();
  }
  addEvent(document.body, "keydown", onUserActivity);
  addEvent(document.body, "mousemove",onUserActivity);
  pui.onUserActivityAttached = true;
}


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
}

pui.autoKeepAlive.start = function() {
  if (pui.autoKeepAlive.started) return;
  var milliseconds = pui.autoKeepAlive.timeout * 1000;
  // checking should be more frequent than timeout
  milliseconds = milliseconds / 4;
  if (milliseconds > 3000) milliseconds = 3000;  // at least every 3 seconds
  pui.autoKeepAlive.intervalId = setInterval(pui.autoKeepAlive.check, milliseconds);
  pui.autoKeepAlive.reset();
  pui.autoKeepAlive.started = true;
}

pui.autoKeepAlive.stop = function() {
  if (!pui.autoKeepAlive.started) return;
  clearInterval(pui.autoKeepAlive.intervalId);
  pui.autoKeepAlive.started = false;
}

pui.autoKeepAlive.reset = function() {
  pui.autoKeepAlive.lastServerAccess = new Date().getTime();
}

pui.autoKeepAlive.check = function() {
  var elapsedTime = (new Date().getTime()) - pui.autoKeepAlive.lastServerAccess;  // elapsed time since last server access
  if (elapsedTime >= pui.autoKeepAlive.timeout * 1000) {
    pui["keepAlive"]();
    pui.autoKeepAlive.reset();
  }
}


pui.isRightClick = function(e) {
	if (!e) var e = window.event;
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
}


pui.getOffset = function(obj) {
  var curleft = curtop = 0;
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
  }
  return [curleft,curtop];
}


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
    
  }
  
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

  }
  
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

}

pui.storeEventCursorPosition = function(e) {
   var obj = getTarget(e);
   pui.storeCursorPosition(obj);
}

pui.storeCursorPosition = function( obj ) {
   obj.cursorPosition = getCursorPosition(obj);
}

pui.getFieldList = function(propVal) {

  var fields = new Array();
  var insideParen = false;
  var character = "";
  var field = "";
  var parenLevel = 0;
  var inQuote = false;
  for (var i = 0; i < propVal.length; i++) {
  	character =  propVal.charAt(i);
  	if (!inQuote) {
    	if (character == "(") parenLevel += 1;
    	else if (character == ")") parenLevel -= 1;
    	if (parenLevel < 1) parenLevel = 0;
    	if (character == "'") inQuote = true;
  	}
  	else {
  		if (character == "'") inQuote = false;
  	}
  	if (character == "," && parenLevel == 0 && !inQuote) {
  	  fields.push(trim(field));
  	  field = "";
    }
    else {
  	  field += character;
    }
  }
  fields.push(trim(field));
  
  return fields;

}

pui.sqlProps = {
            
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
  "choices selection criteria" : null
            
};

pui.isSQLProp = function(prop) {

  return (typeof(pui.sqlProps[prop]) != "undefined");  

}

pui.getSQLVarName = function(dom) {

  var varName = context + ".";

  var inGrid = (typeof(dom.parentNode.parentNode.grid) != "undefined");
  if (!inGrid || dom.hasBoundSQLProps) {
  
    varName += dom.id;
  
  }
  else {
  
    var len = dom.id.lastIndexOf(".") + 1;
    varName += dom.id.substr(0, len) + "*";
  
  }
  
  return varName;

}

pui.getSQLParams = function(properties, obj) {

  var isTextbox = (properties["field type"] == "textbox");
  var idx = 1;
  var propVal = "";
  var paramString = "";
  
  do {

    var try1 = "choices parameter value";
    var try2 = "parameter value";
    
    if (idx > 1) {
    
      try1 += " " + idx;
      try2 += " " + idx;
    
    }
    
    propVal = evalPropertyValue(properties[try1]);
    if (propVal == "") {
    
      propVal = evalPropertyValue(properties[try2]);
    
    }
    
    if (propVal != "") {
    
      var paramNum = idx;
      
      if (isTextbox) {
      
        paramNum += 1;
      
      }    
    
      if (paramString != "") {
      
        paramString += "&";
      
      } 
      
      paramString += "p" + paramNum + "=" + encodeURIComponent(propVal); 
      
      if (obj != null) {
      
        obj["p" + paramNum] = propVal;
      
      }
    
    }
  
    idx++;
  
  } while (propVal != "");
  
  return paramString;

}



pui.isPercent = function(value) {
  if (value == null) return false;
  if (typeof value != "string") return false;
  if (value == "") return false;
  if (value.substr(value.length - 1, 1) == "%") return true;
  return false;
}
