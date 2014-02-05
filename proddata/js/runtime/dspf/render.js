//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2014 Profound Logic Software, Inc.
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


pui.runtimeContainer = null;
pui.renderCount = 0;
pui["refresh interval"] = null;
pui.responseElements = {};
pui.changeResponseElements = {};
pui.isBlankElements = {};
pui.dupElements = {};
pui.keyMap = {};
pui.rrnTracker = {};
pui.psid = null;
pui.screenIsReady = false;
pui.disableEnter = false;
pui.focusField = {};
pui.onsubmitProp = null;
pui.windowZIndex = 1000;
pui.lastWindow = null;
pui.lastWindowLeft = null;
pui.lastWindowTop = null;
pui.modified = false;
pui.ctlRecModified = {};
pui.ignoreBlurs = false;
pui.ignoreFocus = false;
pui.confirmOnClose = true;
pui.shutdownOnClose = true;
pui.skipConfirm = false;
pui.keyName = "";
pui.originalTitle = null;
pui.cursorFields = {};
pui.cursorValues = {};
pui.cursorRRNs = {};
pui.returnRRNs = {};
pui.topRRNs = {};
pui.sflModes = {};
pui.subfileChangedFields = {};
pui.dragDropFields = {};
pui.changedFields ={};
pui.windowTopField = null;
pui.windowLeftField = null;
pui.populateWindowTopLeft = true;
pui.validCommandKeyField = null;
pui.backButtonField = null;
pui.sendBackButtonResponse = false;
pui.setOffFields = [];
pui.autoArrange = {};
pui.autoArrange.keys = {};
pui.gridsDisplayed = [];
pui.layoutsDisplayed = [];
pui.bypassValidation = "false";
pui.ddBypassValidation = "false";
pui.lastFormatName = null;
pui.placeCursorOnSubfile = false;
pui.iPadEmulation = false;
pui.iPhoneEmulation = false;
pui.columnSortResponseGrid = null;
pui.fileUploadElements = [];
pui.activeElement = null;
pui.autoPageGrid = false;


// this is normally stored in a theme, but themes are not available at runtime
// so for now, this is just hardcoded
pui.standardRowHeight = 20;  
pui.standardColumnWidth = 8;
pui["leftOffset"] = 140;  
pui.topOffset = 0;  
pui.pagingBarHeight = 27;  
pui["vertical button spacing"] = 33;     // this accounts for the height of the button as well, used in non-window formats
pui["horizontal button spacing"] = 90;   // this accounts for the width of the button as well, used in window formats

pui["dup"] = {};
pui["dup"]["char"] = "\u25CF";  // this is a character that looks like a round circle
pui["dup"]["keyCode"] = 45;     // Insert (the default dup key is Shift-Insert)
pui["dup"]["shift"] = true;
pui["dup"]["ctrl"] = false;
pui["dup"]["alt"] = false;

pui["highlight on focus"] = false;

pui["window mask color"] = "#CCCCCC";
pui["window mask opacity"] = 50;

pui["loading animation"] = {};
pui["loading animation"]["path"] = pui.normalizeURL("/profoundui/proddata/images/loading.gif");
pui["loading animation"]["left"] = 10;
pui["loading animation"]["top"] = 10;
pui["loading animation"]["width"] = 16;
pui["loading animation"]["height"] = 16;

pui["auto tab"] = false;  // when the user reaches the end of the field, the cursor is automatically advanced to the next field
pui["enable arrow keys"] = false;
pui["horizontal auto arrange"] = false;
pui["buttons per row"] = 1;  //required when pui["horizontal auto arrange"] set to true

pui.fkeyValues = {
  "F1": 1,
  "F2": 2,
  "F3": 3,
  "F4": 4,
  "F5": 5,
  "F6": 6,
  "F7": 7,
  "F8": 8,
  "F9": 9,
  "F10": 10,
  "F11": 11,
  "F12": 12,
  "F13": 13,
  "F14": 14,
  "F15": 15,
  "F16": 16,
  "F17": 17,
  "F18": 18,
  "F19": 19,
  "F20": 20,
  "F21": 21,
  "F22": 22,
  "F23": 23,
  "F24": 24,  
  "Enter": 0
}

pui.aidKeyValues = {

  "F1": 0x31,
  "F2": 0x32,
  "F3": 0x33,
  "F4": 0x34,
  "F5": 0x35,
  "F6": 0x36,
  "F7": 0x37,
  "F8": 0x38,
  "F9": 0x39,
  "F10": 0x3A,
  "F11": 0x3B,
  "F12": 0x3C,
  "F13": 0xB1,
  "F14": 0xB2,
  "F15": 0xB3,
  "F16": 0xB4,
  "F17": 0xB5,
  "F18": 0xB6,
  "F19": 0xB7,
  "F20": 0xB8,
  "F21": 0xB9,
  "F22": 0xBA,
  "F23": 0xBB,
  "F24": 0xBC,  
  "Pause/Break": 0xBD,          // Clear Key
  "Enter": 0xF1,
  "Alt-F1": 0xF3,               // Help Key
  "PageUp": 0xF4,
  "PageDown": 0xF5,
  "Print": 0xF6,
  "RecordBackspace": 0xF8,      // Not implemented
  "AutoEnter": 0x3F             // Not implemented
  
}


pui.protectFormat = function(format) {
  var items = format["metaData"]["items"];
  for (var i = 0; i < items.length; i++) {
    var itm = items[i];
    var type = itm["field type"];
    if (type == "checkbox" || type == "combo box" || type == "date field" || type == "password field" || type == "radio button" || type == "select box" || type == "spinner" | type == "text area" || type == "textbox") {
      itm["read only"] = "true";
      var done = false;
      var suffix = 1;      
      var prop = "css class";
      if (itm[prop] == "PR" || itm[prop] == "PR-UL") done = true;
      while (itm[prop] != null) {
        suffix++;
        prop = "css class " + suffix;
        if (itm[prop] == "PR" || itm[prop] == "PR-UL") done = true;
      }
      if (!done) itm[prop] = "PR";
    }
  }
}


pui.doClearLine = function(clearLine, format, oRange, startingLine) {

  var clearFrom, clearTo;
  var rangeFrom, rangeTo;

  switch (clearLine) {
    case "*END":
      clearFrom = startingLine;
      clearTo = 27;
      break;
    case "*ALL":
      clearFrom = 1;
      clearTo = 27;
      break;
    case "*NO":
      clearFrom = 0;
      clearTo = 0;
      break;
    default:
      clearLine = parseInt(clearLine);
      if (isNaN(clearLine)) clearLine = 0;
      clearFrom = startingLine;
      clearTo = startingLine + clearLine - 1;
  }
  
  if (oRange == null) oRange = "";
  var rangeArr = oRange.split("-");
  if (rangeArr.length != 2) {
    rangeFrom = 0;
    rangeTo = 0;
  }
  else {
    rangeFrom = parseInt(rangeArr[0]);
    if (isNaN(rangeFrom)) rangeFrom = 0;
    rangeTo = parseInt(rangeArr[1]);
    if (isNaN(rangeTo)) rangeTo = 0;
  }

  var gridToHide = null;
  var items = format["metaData"]["items"];
  for (var i = 0; i < items.length; i++) {
    var itm = items[i];
    var row = itm["cursor row"];
    if (row != null && row != "") {
      row = parseInt(row);
      if (!isNaN(row) && row > 0) {
        if (row >= clearFrom && row <= clearTo) {
          itm["visibility"] = "hidden";
          if (itm["grid"] != null) {
            gridToHide = itm["grid"];
          }
        }
        if (row >= rangeFrom && row <= rangeTo && pui["clear overlapped lines"] != false) {
          itm["visibility"] = "hidden";
          if (itm["grid"] != null) {
            gridToHide = itm["grid"];
          }
        }
      }
    }
  }
  if (gridToHide != null) {
    for (var i = 0; i < items.length; i++) {
      var itm = items[i];
      if (itm["field type"] == "grid" && itm["id"] == gridToHide) {
        itm["visibility"] = "hidden";
      }
      if (itm["field type"] == "image" && itm["id"] == gridToHide + "_expander") {
        itm["visibility"] = "hidden";
      }
    }
  }
}


// check if two overlay ranges overlap
pui.rangeOverlap = function(range1, range2) {
  if (range1 == null) return false;
  if (range2 == null) return false;
  var arr1 = range1.split("-");
  var arr2 = range2.split("-");
  if (arr1.length != 2) return false;
  if (arr2.length != 2) return false;
  var from1 = parseInt(arr1[0]);
  var to1 = parseInt(arr1[1]);
  var from2 = parseInt(arr2[0]);
  var to2 = parseInt(arr2[1]);
  if (isNaN(from1)) return false;
  if (isNaN(to1)) return false;
  if (isNaN(from2)) return false;
  if (isNaN(to2)) return false;
  var mid1 = (from1 + to1) / 2;
  var mid2 = (from2 + to2) / 2;
  if (mid1 >= from2 && mid1 <= to2) return true;
  if (mid2 >= from1 && mid2 <= to1) return true;
  return false;
}


// determine if record formats below subfiles need to be pushed down and by how much
// also handle "clear line" property
pui.overlayAdjust = function(formats) {

  var oHigh = null;
  var oGrid = null;
  if (formats.length > 1) {
    for (var i = 0; i < formats.length; i++) {
      var format = formats[i];
      var protect = (pui.evalBoundProperty(format["metaData"]["screen"]["protect"], format["data"], format["ref"]) == "true");
      if (protect) {
        // protect all formats that come before this one
        for (j = 0; j < i; j++) {
          pui.protectFormat(formats[j]);
        }
      }
      var clearLine = format["metaData"]["screen"]["clear line"];
      if (clearLine != null && clearLine != "") {
        var oRange = format["metaData"]["screen"]["overlay range"];
        var startingLine = format["metaData"]["screen"]["starting line"];
        if (startingLine == null) {
          if (oRange != null) startingLine = oRange.split("-")[0];
          else startingLine = "1";
        }
        startingLine = parseInt(startingLine);
        if (isNaN(startingLine) || startingLine < 1) startingLine = 1;        
        var isInputCapableFormat = false;
        var items = format["metaData"]["items"];
        for (var x = 0; x < items.length; x++) {
          var itm = items[x];
          var type = itm["field type"];
          if (type == "checkbox" || type == "combo box" || type == "date field" || type == "password field" || type == "radio button" || type == "select box" || type == "spinner" | type == "text area" || type == "textbox") {
            isInputCapableFormat = true;
            break;
          }
        }
        for (j = 0; j < i; j++) {
          pui.doClearLine(clearLine, formats[j], oRange, startingLine);
          if (isInputCapableFormat) {
            if (pui.rangeOverlap(formats[j]["metaData"]["screen"]["overlay range"], oRange)) {
              pui.protectFormat(formats[j]);
            }
          }
        }      
      }
      if (format["subfiles"] != null) {
        var oRange = format["metaData"]["screen"]["overlay range"];
        if (oRange != null) {
          oRangeArr = oRange.split("-");
          if (oRangeArr.length == 2) {
            oHigh = Number(oRangeArr[1]);
            var items = format["metaData"]["items"];
            for (var j = 0; j < items.length; j++) {
              var itm = items[j];
              if (itm["field type"] == "grid") {
                oGrid = itm;
                break;
              }
            }
          }
        }
      }
    }
  }
  if (oHigh != null && !isNaN(oHigh) && oGrid != null) {
    for (var i = 0; i < formats.length; i++) {
      var format = formats[i];
      var oRange = format["metaData"]["screen"]["overlay range"];
      if (oRange != null) {
        oRangeArr = oRange.split("-");
        if (oRangeArr.length == 2) {
          var oLow = Number(oRangeArr[0]);
          if (!isNaN(oLow) && oLow > oHigh) {  // overlay range low of this format is higher than the overlow range high of the subfile control format
            var rows = Number(oGrid["number of rows"]);
            if (isNaN(rows) || rows <= 0) break;
            if (oGrid["has header"] == "true") rows = rows - 1;            
            var rowHeight = Number(oGrid["row height"]);
            if (isNaN(rowHeight) || rowHeight <= 0) break;
            var foldMultiple = oGrid["fold multiple"];
            if (foldMultiple == null) {
              foldMultiple = parseInt(rowHeight / pui.standardRowHeight);
            }
            foldMultiple = Number(foldMultiple);
            if (isNaN(foldMultiple) || foldMultiple < 1) foldMultiple = 1;
            rowHeight = parseInt(rowHeight / foldMultiple);
            var diff = rowHeight - pui.standardRowHeight;
            var pushDown = rows * diff;
            var p1 = oGrid["show paging controls"];
            var p2 = oGrid["show page number"];
            var p3 = oGrid["csv export"];
            var hasPagingBar = false;
            if (p1 != null && p1 != "" && p1 != "false") hasPagingBar = true;
            if (p2 != null && p2 != "" && p2 != "false") hasPagingBar = true;
            if (p3 != null && p3 != "" && p3 != "false") hasPagingBar = true;
            if (hasPagingBar) pushDown += pui.pagingBarHeight;
            if (pushDown <= 0) break;
            var items = format["metaData"]["items"];
            for (var j = 0; j < items.length; j++) {
              var itm = items[j];
              if (itm["grid"] != null) continue;
              var itmType = itm["field type"];
              if (itmType != "panel" && itmType != "css panel" && !pui.isBound(itm["top"]) && itm["css class"] != "stationary" && itm["css class 2"] != "stationary") {
                itm["top"] = (parseInt(itm["top"]) + pushDown) + "px";
              }
            }
          }
        }
      }      
    }
  }

}


pui.cleanup = function() {

  pui.dummyBox = null;

  if (pui.oldRenderParms != null && pui.isPreview != true) {
    for (var j = 0; j < pui.oldRenderParms["layers"].length; j++) {
      var layer = pui.oldRenderParms["layers"][j];
      for (var i = 0; i < layer.formats.length; i++) {
        var format = layer.formats[i];
        if (format.data) delete format.data;
        if (format.metaData) delete format.metaData;
        var subfiles = format.subfiles;
        if (subfiles != null) {
          for (var sflName in subfiles) {
            delete subfiles[sflName].data;
            delete subfiles[sflName];
          }
        }
      }
    }
    delete pui.oldRenderParms;
  }
  
  for (var i = 0; i < pui.gridsDisplayed.length; i++) {
    var grid = pui.gridsDisplayed[i];
    if (grid != null && typeof grid.destroy == "function") grid.destroy();
  }
  pui.gridsDisplayed = [];

  for (var i = 0; i < pui.layoutsDisplayed.length; i++) {
    var layout = pui.layoutsDisplayed[i];
    if (layout != null && typeof layout.destroy == "function") layout.destroy();
  }
  pui.layoutsDisplayed = [];
  
}


pui.resize = function(inEmulator) {
  var container = pui.runtimeContainer;
  if (container == null) return;
  for (var j = 0; j < container.childNodes.length; j++) {
    var child = container.childNodes[j];
    if (child.sizeMe != null && typeof child.sizeMe == "function") {
      if (pui["is_old_ie"] || pui.isPercent(child.style.width) || pui.isPercent(child.style.height)) {  // IE reports the width and height in pixels for certain types of elements, even if they were set using percentages
        child.sizeMe();
      }
    }
    if (inEmulator && child.layout != null) {
      child.layout.stretch();
    }
  } 
}


pui.popstate = function(e) {
  if (e == null) return;
  var state = e.state;
  if (state == null) return;
  var puipage = state.puipage;
  if (puipage == "previous") {
    if (pui.backButtonField != null) {
      pui.bypassValidation = "true";
      pui.sendBackButtonResponse = true;
      pui.respond();
    }    
  }
  history.forward();
}


pui.render = function(parms) {

  if (parms["version"] != null && pui["version"] != null && parms["version"] != pui["version"]) {
    var msg = "Profound UI server-side version (" + parms["version"] + ") doesn't match client-side JavaScript version (" + pui["version"] + ").";
    if (window.console && window.console.error) {
      console.error(msg);
    }
  }

  if (pui["is_old_ie"] && pui["ie_mode"] >= 9) {
    
    pui.addCssClass(pui.runtimeContainer, "pui-ie9plus");
    
  }
  else {
    
    pui.removeCssClass(pui.runtimeContainer, "pui-ie9plus");
    
  }  
  
  if (pui.genie && pui.genie.middleDiv == null) {
  
    pui.genie.middleDiv = document.getElementById("middle");
  
  }

  if (!pui.resizeEventAssigned) {
    addEvent(window, "resize", pui.resize);
    pui.resizeEventAssigned = true;
  }

  if (!pui.backButtonSetup && history.pushState != null && history.replaceState != null) {
    history.replaceState({ puipage: "previous" }, document.title);
    history.pushState({ puipage: "current" }, document.title);
    addEvent(window, "popstate", pui.popstate);
    pui.backButtonSetup = true;
  }

  pui.cleanup();

  pui.oldRenderParms = parms;

  

  // handle errors
  var success = parms.success;
  if (success == null) success = true;
  if (!success) {    
    document.body.innerHTML = "<h1>Unrecoverable Error</h1> <p>Unrecoverable error <strong>" + parms["exception"] + "</strong> occurred while handling an exception. The original exception id is <strong>" + parms["cause"] + "</strong>.</p> <p>Please contact the server administrator to determine the cause of the problem.";
    return;
  }
  
  if (parms["closeTab"] == true && window.parent != window && typeof(window.parent["Atrium"]) != "undefined") {
    window["Atrium"]["closeTab"]();
    return;
  }
  
  if (parms["noKey"] == true) {
    pui.skipConfirm = true;
    var url = "/profoundui/key";
    if (pui["serverURL"] != null) url = pui["serverURL"] + url;
    location.href = url;
    return;
  }

  if (pui.genie == null) {
      if (pui["refresh interval"] != null && pui["refresh interval"] > 0 && pui.renderCount >= pui["refresh interval"]) {
      pui["refresh"]();
      return;
    }
    pui.renderCount++;
  }

  if (parms.psid != null) pui.psid = parms.psid;
  if (parms.appJob != null) {
    pui["secLevel"] = parms["appJob"]["secLevel"];
    if (pui.appJob == null) pui.appJob = {};
    for (prop in parms.appJob) {
      pui.appJob[prop] = parms.appJob[prop];
    }
  }

  if (pui.iPadEmulation && !pui.iPhoneEmulation) {
    getObj("ipadKeyboard").style.display = "none";
  }

  pui.attachOnUserActivity();
  if (pui.handler == null) {
    if (pui["client side timeout"] == true) {
      pui.timeout = parms["timeout"];
      pui.timeoutMonitor.start();
    }
    else {
      pui.autoKeepAlive.setup();
    }
  }

  pui.rrnTracker = {};
  pui.modified = false;
  pui.ctlRecModified = {};
  pui.confirmOnClose = true;
  pui.shutdownOnClose = true;
  pui.keyName = "";
  pui.dragDropFields = {};
  pui.cursorRRNs = {};
  pui.returnRRNs = {};
  pui.topRRNs = {};
  pui.sflModes = {};
  pui.subfileChangedFields = {};
  pui.sqlcache = {};
  pui.bypassValidation = "false";
  pui.placeCursorOnSubfile = false;
  pui.activeElement = null;
  pui.sendBackButtonResponse = false;
  pui.autoPageGrid = false;
    
  var translateError = pui.translate(parms);
  if (translateError != null) {
    
    pui.alert(translateError);
    
  }
  
  var layers = parms["layers"];
    
  for (var i = 0; i < layers.length; i++) {
    pui.overlayAdjust(layers[i].formats);
  }
    
  // handle document title property
  if (layers.length > 0) {
    var layer = layers[layers.length - 1];
    if (layer.formats.length > 0) {
      var format = layer.formats[layer.formats.length - 1];
      if (pui.originalTitle == null) pui.originalTitle = document.title;
      var newTitle = pui.evalBoundProperty(format.metaData.screen["document title"], format.data, format.ref);
      if (newTitle != null && newTitle != "") {
        document.title = newTitle;
      }
      else {
        if (document.title != pui.originalTitle) document.title = pui.originalTitle;
      }
    }
  }

  for (var i = 0; i < layers.length; i++) {
    pui.responseElements = {};
    pui.changeResponseElements = {};
    pui.isBlankElements = {};
    pui.dupElements = {};
    pui.keyMap = {};
    pui.autoArrange = {};
    pui.autoArrange.keys = {};
    pui.disableEnter = false;
    pui.focusField = {};
    pui.changedFields = {};
    pui.windowTopField = null;
    pui.windowLeftField = null;
    pui.populateWindowTopLeft = true;
    pui.validCommandKeyField = null;
    pui.backButtonField = null;
    pui.setOffFields = [];
    pui.cursorFields.record = null;
    pui.cursorFields.field = null;
    pui.cursorFields.position = null;
    pui.cursorFields.row = null;
    pui.cursorFields.column = null;
    pui.cursorValues.record = null;
    pui.cursorValues.field = null;
    pui.cursorValues.position = null;
    pui.cursorValues.elementId = null;
    pui.cursorValues.row = null;
    pui.cursorValues.column = null;
    pui.cursorValues.setRow = null;
    pui.cursorValues.setColumn = null;
    pui.cursorValues.noFocus = null;
    pui.gridsDisplayed = [];
    pui.layoutsDisplayed = [];
    pui.fileUploadElements = [];

    var formats = layers[i].formats;
    if (i == 0) {
      pui.lastWindow = null;
      pui.lastWindowLeft = null;
      pui.lastWindowTop = null;
      parms.container.innerHTML = "";
    }
    else {
      pui.setupWindowDiv(parms, layers[i]);
      // check if the panel component needs to be retrieved from the reference window JSON
      // this will be needed if the reference window itself is not part of the formats being rendered
      // the dialog panel needs to be placed on the first format
      if (formats.length > 0) {
        var winRef = formats[0]["metaData"]["screen"]["window reference"];
        if (winRef != null && winRef != "" && layers[i]["metaData"] != null) {
          var refItems = layers[i]["metaData"]["items"];
          for (var j = 0; j < refItems.length; j++) {
            var panel = refItems[j];
            if (panel["id"] == winRef && (panel["field type"] == "panel" || panel["field type"] == "css panel")) {
              formats[0]["metaData"]["items"].push(panel);
              break;
            }
          }
        }
      }
    }

    pui.lastFormatName = null;
    
    var lastLayer = (i == layers.length - 1);
    for (var j = 0; j < formats.length; j++) {
      var format = formats[j];
      format.container = parms.container;
      if (lastLayer) {
        format.lastLayer = true;
        pui.externalFiles.load(format);
      }
      if (format["active"] == true) {
        format.lastFormat = true;
        pui.lastFormatName = format.name;
      }
      pui.renderFormat(format);
    }

    if (pui.lastFormatName == null) {
      if (formats.length > 0) {
        var n = formats.length - 1;
        formats[n].lastFormat = true;
        pui.lastFormatName = formats[n].name;
      }
      else {
        pui.lastFormatName = null;
      }
    }

    if (i > 0 && formats.length > 0 && pui.evalBoundProperty(formats[0].metaData.screen["center window"], formats[0].data, formats[0].ref) == "true") {
      pui.centerWindow();
    }
  }

  if (pui.focusField != null && pui.focusField.dom != null && (!pui.placeCursorOnSubfile || pui.cursorValues.setRow != null || pui.cursorValues.setColumn != null || pui.focusField.setFocusFlag == true) ) {
    var cell = pui.focusField.dom.parentNode;
    if (cell != null && cell.parentNode != null && cell.parentNode.grid != null && parseInt(pui.focusField.dom.style.top) > parseInt(cell.style.height)) {
      // focus field is in the hidden portion of an expandable subfile
      pui["focusOnContainer"]();
    }
    else {
      setTimeout(function() {
        if (pui.focusField.dom != null) {
          if (pui.focusField.dom.tagName == "DIV" || pui.focusField.dom.style.visibility == "hidden") {
            pui["focusOnContainer"]();
          }
          else if (pui.cursorValues.noFocus == true) {
            pui["focusOnContainer"]();
          }
          else {
            try {
              pui.focusField.dom.focus();
              if (pui["is_old_ie"] && pui.focusField.dom.tagName != "SELECT" && pui.focusField.dom.type != "checkbox" && pui.focusField.dom.type != "radio") {
                if (pui.focusField.dom.createTextRange != null) {
                  // for IE, this makes the cursor appear - workaround for IE8 bug where the cursor just doesn't show
                  pui.focusField.dom.select();
                  var tr = pui.focusField.dom.createTextRange();
                  if (tr != null && tr.collapse !=  null && tr.select != null) {
                    tr.collapse();
                    tr.select();
                  }
                }
                else {
                  pui["focusOnContainer"]();
                }
              }
              if (pui["highlight on focus"]) pui.focusField.dom.select();
            }
            catch (e) {
              pui["focusOnContainer"]();
            }
          }
        }
      }, 1);
    }
  }
  else if (!pui.placeCursorOnSubfile && (pui.cursorValues.setRow == null || pui.cursorValues.setColumn == null)) {
    pui["focusOnContainer"]();
  }

  //var errors =  ;
  //if (errors != null) {
  //  pui.showErrors(errors);
  //}

  pui.screenIsReady = true;

}

pui.renderFormat = function(parms) {
  // retrieve parameters
  var isDesignMode = parms.designMode;
  if (isDesignMode == null) isDesignMode = false;
  var screenProperties = parms.metaData.screen;
  var items = parms.metaData.items;
  var designer = parms.designer;
  var data = parms.data;
  var formatName = parms.name;
  var isWin = false;
  
  if (screenProperties != null) {
    if (pui.evalBoundProperty(screenProperties["show as window"], data, parms.ref) == "true") isWin = true;
    if (screenProperties["window reference"] != null && screenProperties["window reference"] != "") isWin = true;
  }
  
  if (!isDesignMode && parms.rowNum == null) {
    pui.keyMap[formatName] = {};
    var obj = parms.metaData.screen["return cursor record"];
    if (pui.isBound(obj)) pui.cursorFields.record = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["return cursor field"];
    if (pui.isBound(obj)) pui.cursorFields.field = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["return cursor position"];
    if (pui.isBound(obj)) pui.cursorFields.position = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["return cursor row"];
    if (pui.isBound(obj)) pui.cursorFields.row = (pui.handler == null ? formatName + "." : "") + obj["fieldName"].toUpperCase();
    obj = parms.metaData.screen["return cursor column"];    
    if (pui.isBound(obj)) pui.cursorFields.column = (pui.handler == null ? formatName + "." : "") + obj["fieldName"].toUpperCase();
    obj = parms.metaData.screen["changed"];
    if (pui.isBound(obj)) pui.changedFields[formatName] = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["window left"];
    if (pui.isBound(obj)) pui.windowLeftField = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["window top"];
    if (pui.isBound(obj)) pui.windowTopField = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["valid command key"];
    if (pui.isBound(obj)) pui.validCommandKeyField = (pui.handler == null ? formatName + "." : "") + obj["fieldName"].toUpperCase();
    obj = parms.metaData.screen["back button"];
    if (pui.isBound(obj)) pui.backButtonField = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["dd element id"];
    if (pui.isBound(obj)) pui.dragDropFields.ddElementId = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["dd record number"];
    if (pui.isBound(obj)) pui.dragDropFields.ddRecordNumber = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["target element id"];
    if (pui.isBound(obj)) pui.dragDropFields.targetElementId = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["target record number"];
    if (pui.isBound(obj)) pui.dragDropFields.targetRecordNumber = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(obj["fieldName"]);
    
    var idx = 1;
    obj = parms.metaData.screen["set off"];
    while (pui.isBound(obj)) {
      pui.setOffFields.push(formatName + "." + obj["fieldName"].toUpperCase());
      idx++;
      obj = parms.metaData.screen["set off " + idx];
    }
    
    pui.ddBypassValidation = pui.evalBoundProperty(screenProperties["bypass validation"], data, parms.ref);
    
    pui.cursorValues.setRow = pui.evalBoundProperty(screenProperties["set cursor row"], data, parms.ref);
    pui.cursorValues.setColumn = pui.evalBoundProperty(screenProperties["set cursor column"], data, parms.ref);
    pui.cursorValues.noFocus = pui.evalBoundProperty(screenProperties["no focus"], data, parms.ref);
    if (pui.cursorValues.noFocus == "true") pui.cursorValues.noFocus = true;
    if (pui.isBound(screenProperties["set cursor condition"])) {
      var setCursor = pui.evalBoundProperty(screenProperties["set cursor condition"], data, parms.ref);
      if (setCursor != true && setCursor != "true") {
        pui.cursorValues.setRow = null;
        pui.cursorValues.setColumn = null;
      }
    }
  }
  
  // set record format level properties
  if (isDesignMode) {
    designer.currentScreen.name = screenProperties["record format name"];
    if (designer.currentScreen.name == null || designer.currentScreen.name == "") {
      designer.currentScreen.name = "[Unnamed Screen]";
    }
    for (var propname in screenProperties) {
      var propValue = screenProperties[propname];
      designer.screenProperties[designer.currentScreen.screenId][propname] = propValue;
      designer.screenPropertiesChanged[designer.currentScreen.screenId][propname] = true;
      if (pui.isBound(propValue)) {
        designer.dataFields.addUsage({
          fieldName: propValue.fieldName,
          dataType: propValue.dataType,  
          dataLength: propValue.dataLength,  
          decPos: propValue.decPos,
          refField: propValue.refField,
          keywords: propValue.keywords,
          designItem: "Screen",
          property: propname,
          force: true,
          "longName": propValue["longName"]
        }, designer);
      }
    }    
  }
  
  if (!isDesignMode && parms.rowNum == null) {
    if (pui.evalBoundProperty(screenProperties["disable enter key"], data, parms.ref) == "true") {
      pui.disableEnter = true;
    }
  } 	
  
  // process items
  var namedModel = getPropertiesNamedModel();
  var tabPanels = [];
  var activeTabs = [];  
  var gridsToRender = [];
  for (var i = 0; i < items.length; i++) {

    if (parms["hideControlRecord"] == true && !isDesignMode && items[i]["field type"] != "grid" && items[i]["grid"] == null && items[i]["cursor row"] != null) {
      continue;
    }
    
    if (!isDesignMode && parms.rowNum != null && items[i]["field type"] == "output field" && items[i]["visibility"] == "hidden") {
      var top = parseInt(items[i]["top"]);
      var left = parseInt(items[i]["left"]);
      if (!isNaN(top) && top < 0 && !isNaN(left) && left < 0) {
        // don't render subfile hidden fields - this improves performance
        continue;
      }      
    }
    
    // don't allow invisible(auto arrange)/disabled function key buttons to be activated by a shortcut key
    // this is accomplished by removing the "shortcut key" property
    if (!isDesignMode && items[i]["auto arrange"] == "true") {
      var vis = items[i]["visibility"];
      if (vis == "hidden" || (pui.isBound(vis) && pui.evalBoundProperty(vis, data, parms.ref) == "hidden")) {
        if (items[i]["shortcut key"] != null) delete items[i]["shortcut key"];
      }      
    }
    if (!isDesignMode && items[i]["shortcut key"] != null) {
      var dis = items[i]["disabled"];
      if (dis == "true" || (pui.isBound(dis) && pui.evalBoundProperty(dis, data, parms.ref) == "true")) {
        delete items[i]["shortcut key"];
      }      
    }
  
    // create dom element for item
    var gridObj = null;
    var container = null;
    var gridId = items[i].grid;
    var layoutId = items[i]["layout"];
    if (gridId != null) {  // item belongs to a grid
      var gridDom = getObj(gridId);
      if (gridDom != null) {
        gridObj = gridDom.grid;
        var colNum = Number(items[i].column);
        if (isDesignMode) {        
          var rowNum = (gridObj.hasHeader ? 1 : 0);
          container = gridObj.cells[rowNum][colNum];
        }
        else {
          if (parms.rowNum != null) {
            container = gridObj.cells[parms.rowNum][colNum];
          }
          else {
            if (items[i].domEls != null) delete items[i].domEls;  // must not be present, may be there from cached mvc response object
            gridObj.runtimeChildren.push(items[i]);
            continue;
          }
        }
      }
    }
    else if (layoutId != null) {
      var layoutDom = getObj(layoutId);
      if (layoutDom != null && layoutDom.layout != null) {
        var containerNumber = Number(items[i]["container"]);
        container = layoutDom.layout.containers[containerNumber - 1];
      }
    }
    
    if (container == null) {
      if (isDesignMode) container = designer.container;
      else container = parms.container;
    }
    
    var dom;
    if (!isDesignMode && parms.subfileRow != null && items[i].domEls != null && items[i].domEls[parms.subfileRow-1] != null) {
    
      dom = items[i].domEls[parms.subfileRow-1];
      if (container != null) {
        container.appendChild(dom);
        if (dom.redisplay == true) {
          dom.style.display = "";
          dom.redisplay = false;
        }
        if (dom.calimg != null) {
          container.appendChild(dom.calimg);
          if (dom.calimg.redisplay) {
            dom.calimg.style.display = "";
            dom.calimg.redisplay = false;
          }
        }
        if (dom.extraDomEls != null) {
          for (var j = 0; j < dom.extraDomEls.length; j++) {
            container.appendChild(dom.extraDomEls[j]);
            if (dom.extraDomEls[j].redisplay == true) {
              dom.extraDomEls[j].style.display = "";
              dom.extraDomEls[j].redisplay = false;
            }
          }
        }
      }      
    }
    else {
    
      dom = document.createElement("div");
      dom.style.position = "absolute";
      var leftpx = items[i].left;
      var toppx = items[i].top;
      //if (leftpx == null) leftpx = "0px";
      //if (toppx == null) toppx = "0px";
      if (pui.isBound(leftpx)) leftpx = "0px";
      if (pui.isBound(toppx)) toppx = "0px";
      if (leftpx == "NaNpx") leftpx = "0px";
      if (toppx == "NaNpx") toppx = "0px";
      if (items[i].left != null) dom.style.left = leftpx;
       if (items[i].top != null) dom.style.top = toppx;
      if (!isDesignMode && items[i]["parent tab panel"] != null && items[i]["parent tab panel"] != "") {
        dom.style.visibility = "hidden";
      }

      if (container != null) {
        container.appendChild(dom);
      }
      
      // create design item object if in design mode
      var properties = {};
      var designItem = null;    
      if (isDesignMode) { 
        var designItem = designer.addItem(dom, true);
        designItem.properties = properties;
        designItem.properties.newitem = "true";
        designItem.propertiesChanged.newitem = true;
        var fieldType = items[i]["field type"];
        if (fieldType == "styled button" || fieldType == "panel" || fieldType == "css panel" || fieldType == "css button" || fieldType == "Layout") {
          designItem.dom.style.borderStyle = "none";
        }
      }
      
      // get properties      
      for (var prop in items[i]) {
        if (prop == "domEls") continue;
        var propValue = items[i][prop];
        var newValue;
        if (pui.isBound(propValue)) {
          if (isDesignMode) {
            designer.dataFields.addUsage({
              fieldName: propValue.fieldName,
              dataType: propValue.dataType,  
              dataLength: propValue.dataLength,  
              decPos: propValue.decPos,
              refField: propValue.refField,
              keywords: propValue.keywords,
              designItem: designItem,
              property: prop,
              force: true,
              "longName": propValue["longName"]
            }, designer);
            newValue = propValue;
          }
          else {
          
            if (pui.isSQLProp(prop)) dom.hasBoundSQLProps = true;
          
            newValue = pui.evalBoundProperty(propValue, data, parms.ref);
            
            if (prop == "value" || prop == "html") {
              // assign cursor record and field
              dom.cursorRecord = formatName;
              dom.cursorField = pui.fieldUpper(propValue.fieldName);
              // remove numeric formatting from auto-complete field where choice option is not the same as choice value
              if (items[i]["field type"] == "textbox") {
                var dbFile = pui.evalBoundProperty(items[i]["choices database file"], data, parms.ref);
                if (dbFile != null && dbFile != "") {
                  var optionFields = pui.evalBoundProperty(items[i]["choice options field"], data, parms.ref);
                  var optionField;
                  if (optionFields != null) optionField = pui.parseCommaSeparatedList(optionFields)[0];
                  var valueField = pui.evalBoundProperty(items[i]["choice values field"], data, parms.ref);
                  if (optionField != null && optionField != "" && valueField != null && valueField != "" && optionField != valueField) {
                    propValue["formatting"] = "Text";
                    propValue.keyFilter = null;
                    propValue.maxLength = null;
                  }
                }
              }
            }
            if (prop == "cursor record number") {
              pui.cursorRRNs[(pui.handler == null ? formatName + "." : "") + pui.fieldUpper(propValue.fieldName)] = dom;
            }
            if (prop == "subfile return rrn") {
              pui.returnRRNs[(pui.handler == null ? formatName + "." : "") + pui.fieldUpper(propValue.fieldName)] = dom;
            }
            if (prop == "return mode") {
              pui.sflModes[(pui.handler == null ? formatName + "." : "") + pui.fieldUpper(propValue.fieldName)] = dom;
            }
            if (prop == "column sort response") {
              dom.columnSortResponseField = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(propValue.fieldName);
            }
            if (prop == "subfile changed") {
              pui.subfileChangedFields[properties["record format name"]] = propValue.fieldName;
            }
          }
        }
        else {
          if (!isDesignMode && container != null && container.isPUIWindow) {
            if (container.signature == null) container.signature = "";
            if (prop == "id" || prop == "top" || prop == "left") {
              container.signature += propValue;
            }
          }
          newValue = propValue;
        }
        properties[prop] = newValue;
      }
  
      // retain information about tab panels and active tabs
      if (properties["field type"] == "tab panel") {
        var tabPanelId = properties["id"];
        tabPanels.push(tabPanelId);
        if (setTabActions[tabPanelId] != null) {
          activeTabs.push(setTabActions[tabPanelId]);
        }
        else {
          activeTabs.push(evalPropertyValue(properties["active tab"], "", dom));
        }
      }
            
      // apply all properties
      for (var propname in properties) {
        var propConfig;
        if (dom.propertiesNamedModel == null) propConfig = pui.getPropConfig(namedModel, propname);
        else propConfig = pui.getPropConfig(dom.propertiesNamedModel, propname);
        if (propConfig != null) {

          var propValue = properties[propname];
          
          if (!isDesignMode) {
            var formattingObj = items[i][propname];
            if (pui.isBound(formattingObj)) {
            
              formattingObj["revert"] = false;

              if (pui.touchDevice && propname == "value" && properties["field type"] == "textbox" && formattingObj["formatting"] == "Number") {
              
                // The following options put non-digit characters into the box. Such as spaces, separators, commas, etc.
                // Any non-digit characters cause a browser to render a "number" element empty.
                
                // It appears that the designer will always define all of these values for Number formatting. They will be
                // empty string, if not set. 
                
                // However, a user who is hand coding the screen may not define them? 
                
                if (formattingObj["numSep"] != "true" && 
                    formattingObj["numBlankFill"] != "true" && 
                    formattingObj["negNum"] != "(999.00)" && formattingObj["negNum"] != "999.00-" && formattingObj["negNum"] != "999.00 CR" &&  
                    (!formattingObj["edtWrd"] || formattingObj["edtWrd"] == "") &&
                    (!formattingObj["edtMsk"] || formattingObj["edtMsk"] == "") &&                  
                    (!formattingObj["curSym"] || formattingObj["curSym"] == "") && 
                    (!formattingObj["units"] || formattingObj["units"] == "")) {   
                                
                  dom.type = "number";
                  
                }
                
              }
            
              if (propname == "changed") {
                var fieldName = pui.fieldUpper(formattingObj.fieldName);
                var qualField = formatName + "." + fieldName;
                if (pui.handler != null) qualField = fieldName;
                if (parms.subfileRow != null) {
                  qualField += "." + (parms.subfileRow);
                }
                if (pui.changeResponseElements[qualField] == null) pui.changeResponseElements[qualField] = [];
                pui.changeResponseElements[qualField].push(dom);
              }

              if (propname == "is blank") {
                var fieldName = pui.fieldUpper(formattingObj.fieldName);
                var qualField = formatName + "." + fieldName;
                if (pui.handler != null) qualField = fieldName;
                if (parms.subfileRow != null) {
                  qualField += "." + (parms.subfileRow);
                }
                if (pui.isBlankElements[qualField] == null) pui.isBlankElements[qualField] = [];
                pui.isBlankElements[qualField].push(dom);
              }
              
              if (propname == "dup key response" && properties["allow dup key"] == "true") {
                var fieldName = formattingObj.fieldName.toUpperCase();
                var qualField = formatName + "." + fieldName;
                if (pui.handler != null) qualField = fieldName;
                if (parms.subfileRow != null) {
                  qualField += "." + (parms.subfileRow);
                }
                if (pui.dupElements[qualField] == null) pui.dupElements[qualField] = [];
                pui.dupElements[qualField].push(dom);
              }

              if ((propname == "response") ||
                  (propname == "chart response") ||  
                  (propname == "menu response") ||  
                  (propname == "upload response") ||  
                  (propname == "tab response") ||  
                  (propname == "active tab") ||  
                  (propname == "radio button group") ||  
                  (propname == "page down response" && dom.grid != null && dom.grid.pagingBar != null) ||  
                  (propname == "page up response" && dom.grid != null && dom.grid.pagingBar != null) ||  
                  (propname == "value" && ((dom.tagName == "INPUT" && dom.type != "button") || dom.tagName == "SELECT"  || dom.tagName == "TEXTAREA" || dom.comboBoxWidget != null || dom.slider != null || dom.signaturePad != null || dom.onOffSwitch != null))) {
                var fieldName = pui.fieldUpper(formattingObj.fieldName);
                var qualField = formatName + "." + fieldName;
                if (pui.handler != null) qualField = fieldName;
                if (parms.subfileRow != null) {
                  qualField += "." + (parms.subfileRow);
                }
                if (propname == "radio button group") {
                  var radioName = fieldName;
                  if (parms.subfileRow != null) {
                    radioName += "." + parms.subfileRow;
                  }
                  dom.name = radioName;
                  if (pui["is_old_ie"]) {
                    // IE has a bug: radio button names cannot be assigned dynamically (they stop working)
                    // So, the element has to be recreated
                    var newDom;
                    try {  // IE9 doesn't support this syntax any more;
                      newDom = document.createElement('<input name="' + radioName + '" type="radio">');
                    }
                    catch(e) {
                      newDom = document.createElement("input");
                      newDom.name = radioName;
                      newDom.type = "radio";
                    }
                    newDom.style.position = dom.style.position;
                    newDom.style.left = dom.style.left;
                    newDom.style.top = dom.style.top;
                    newDom.style.visibility = dom.style.visibility;
                    newDom.style.display = dom.style.display;
                    newDom.id = dom.id;
                    newDom.value = dom.value;
                    newDom.exraDomEls = dom.exraDomEls;
                    newDom.labelObj = dom.labelObj;
                    newDom.modified = dom.modified;
                    dom.parentNode.replaceChild(newDom, dom);
                    newDom.checked = dom.checked;
                    newDom.parentTabPanel = dom.parentTabPanel ;
                    newDom.parentTab = dom.parentTab;                    
                    newDom.onblur = dom.onblur;
                    newDom.onchange = dom.onchange;
                    newDom.onclick = dom.onclick;
                    newDom.ondblclick = dom.ondblclick;
                    newDom.onfocus = dom.onfocus;
                    newDom.onkeydown = dom.onkeydown;
                    newDom.onkeypress = dom.onkeypress;
                    newDom.onkeyup = dom.onkeyup;
                    newDom.onmousedown = dom.onmousedown;
                    newDom.onmousemove = dom.onmousemove;
                    newDom.onmouseout = dom.onmouseout;
                    newDom.onmouseover = dom.onmouseover;
                    newDom.onmouseup = dom.onmouseup;
                    dom = newDom;                    
                  }
                  dom["radioValue"] = properties["value"];
                }
                
                if (pui.responseElements[qualField] == null) pui.responseElements[qualField] = [];
                if (propname == "page down response") {
                  pui.responseElements[qualField].push(dom.grid.pagingBar.nextImg);
                  pui.responseElements[qualField].push(dom.grid.pagingBar.nextLink);
                }
                else if (propname == "page up response") {
                  pui.responseElements[qualField].push(dom.grid.pagingBar.prevImg);
                  pui.responseElements[qualField].push(dom.grid.pagingBar.prevLink);
                }
                else {
                  pui.responseElements[qualField].push(dom);
                }
                
                if (propname == "menu response") {
                  dom.responseValue = "";
                }
                if (propname == "upload response") {
                  dom.fileUpload.qualField = qualField;
                }
                if (propname == "chart response") {
                  dom.responseValue = "";
                }
                if (propname == "tab response") {
                  dom.sendTabResponse = true;
                }
                if (propname == "active tab") {
                  dom.sendActiveTab = true;
                }
                if (propname == "response") {
                  var shortcutKey = properties["shortcut key"];
                  if (shortcutKey != null && shortcutKey != "") {
                    if (pui.keyMap[formatName] == null) pui.keyMap[formatName] = {};
                    if (pui.keyMap[formatName][shortcutKey] == null) pui.keyMap[formatName][shortcutKey] = [];
                    pui.keyMap[formatName][shortcutKey].push(dom);
                    dom.shortcutKey = shortcutKey;
                  }
                  if (gridId == null) {
                    dom.responseValue = "0";
                  }
                  if (properties["onclick"] == null || properties["onclick"] == "") {
                    pui.attachResponse(dom);
                  }
                }
                if (propname == "page down response") {
                  if (pui.keyMap[formatName]["PageDown"] == null) pui.keyMap[formatName]["PageDown"] = [];
                  pui.keyMap[formatName]["PageDown"].push(dom.grid.pagingBar.nextLink);
                  pui.attachResponse(dom.grid.pagingBar.nextImg);
                  pui.attachResponse(dom.grid.pagingBar.nextLink);
                  dom.grid.pagingBar.nextImg.formattingInfo = formattingObj;
                  dom.grid.pagingBar.nextLink.formattingInfo = formattingObj;
                }
                if (propname == "page up response") {
                  if (pui.keyMap[formatName]["PageUp"] == null) pui.keyMap[formatName]["PageUp"] = [];
                  pui.keyMap[formatName]["PageUp"].push(dom.grid.pagingBar.prevLink);
                  pui.attachResponse(dom.grid.pagingBar.prevImg);
                  pui.attachResponse(dom.grid.pagingBar.prevLink);
                  dom.grid.pagingBar.prevImg.formattingInfo = formattingObj;
                  dom.grid.pagingBar.prevLink.formattingInfo = formattingObj;
                }
                dom.formattingInfo = formattingObj;
              }
            }
            
            if (propname == "selection field" && properties["field type"] == "grid") {
              if (pui.isBound(items[i]["selection field"])) {
                dom.grid.selectionField = items[i]["selection field"];
              }
            }
            
            if (propname == "shortcut key" && propValue != null && propValue != "" && !pui.isBound(items[i]["response"])) {
              if (pui.keyMap[formatName][propValue] == null) pui.keyMap[formatName][propValue] = [];
              pui.keyMap[formatName][propValue].push(dom);
              dom.shortcutKey = propValue;
              if (gridId == null) {
                dom.responseValue = "0";
              }
              if (properties["onclick"] == null || properties["onclick"] == "") {
                pui.attachResponse(dom);
              }
            }

            if (propname == "id" && parms.subfileRow != null) {
              propValue += "." + parms.subfileRow;
              properties[propname] = propValue;
            }
            if (propname == "set focus" && propValue == "true") {
              if (pui.focusField.dom == null || pui.focusField.setFocusFlag != true) {
                if (properties["visibility"] != "hidden") {
                  pui.focusField.dom = dom;
                  if (dom.comboBoxWidget != null) pui.focusField.dom = dom.comboBoxWidget.getBox();
                  pui.focusField.setFocusFlag = true;
                }              
              }              
            }            
            if (propname == "focus class" && !pui.isBound(propValue) && trim(propValue) != "") {
              dom.focusClass = trim(propValue);
              addEvent(dom, "focus", pui.applyFocusClass);
              addEvent(dom, "blur", pui.removeFocusClass);
            }
            if (propname == "required" && propValue == "true") {
              dom.puirequired = true;
            }
            if (propname == "mandatory entry" && propValue == "true") {
              dom.ME = true;
            }
            if (propname == "mandatory fill" && propValue == "true") {
              dom.MF = true;
            }
            if (propname == "valid values" && propValue != null && propValue != "") {
              dom.validValues = propValue;
            }
            if (propname == "allow blanks" && propValue == "true") {
              dom.allowBlanks = true;
            }
            if (propname == "auto advance" && propValue == "true") {
              var boxDom = dom;
              if (dom.comboBoxWidget != null) boxDom = dom.comboBoxWidget.getBox();
              boxDom.autoAdvance = true;
              addEvent(boxDom, "keyup", function(event) {
                event = event || window.event;
                var target = getTarget(event);
                // Do not auto-enter unless a printable character is typed in.
                var keyCode = event.keyCode;
                if (keyCode < 48 || (keyCode > 90 && keyCode < 96) || (keyCode > 111 && keyCode < 186)) {
                  if (keyCode != 32) return;
                }
                var box = target;
                if (box.comboBoxWidget != null) box = box.comboBoxWidget.getBox();
                if (box.value.length == box.maxLength && getCursorPosition(box) >= box.maxLength) {
                  pui.keyName = "Enter";
                  pui.click();
                }
              });              
            }
            if (propname == "allow dup key" && propValue == "true") {
              addEvent(dom, "keydown", function(event) {
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
                  setModified(event);
                  pui.goToNextElement(target);
                  preventEvent(event);
                  return false;
                }                
              });
            }
            if (propname == "allow field exit" && propValue == "true") {
              var boxDom = dom;
              if (dom.comboBoxWidget != null) boxDom = dom.comboBoxWidget.getBox();            
              if (pui.isBound(items[i]["value"]) && items[i]["value"]["rjZeroFill"] == "true") {
                dom.rjZeroFill = true;
                boxDom.rjZeroFill = true;
              }             
              addEvent(boxDom, "keydown", function(event) {
                event = event || window.event;                
                var key = event.keyCode;
                if (key == pui["field exit key"] && !event.shiftKey && (pui["field exit key"] == 17 || !event.ctrlKey)) {
                  var target = getTarget(event);
                  pui.storeCursorPosition(target);
                  if (pui.doFieldExit(target) == false) {
                    preventEvent(event);
                    return false;
                  
                  }
                }                
              });
            }
            if (propname == "validate name" && propValue == "true") {
              dom.validateName = true;
            }
            if (propname == "validate email" && propValue == "true") {
              dom.validateEmail = true;
            }
            if (propname == "set as modified" && propValue == "true") {
              dom.modified = true;
              pui.modified = true;
              if (parms.subfileRow == null) {
                // not a subfile field being modified
                pui.ctlRecModified[formatName] = true;
              }
            }
            if (propname.length >= 11 && propname.substr(0,11) == "blank value" && propValue != null && propValue != "") {
              if (dom.blankValues == null) dom.blankValues = [];
              dom.blankValues.push(propValue);
              var box = dom;
              if (dom.comboBoxWidget != null) box = dom.comboBoxWidget.getBox();
              if (box.tagName == "DIV") boxValue = getInnerText(box);
              else boxValue = box.value;
              if (boxValue == propValue) {
                // clear box
                if (box.tagName == "DIV") box.innerHTML = "";
                else box.value = "";
              }
            }
            if (propname == "comparison operator" && propValue != null && propValue != "") {
              dom.compOperator = propValue;
            }
            if (propname == "comparison value" && propValue != null && propValue != "") {
              dom.compValue = propValue;
            }
            if (propname == "range low" && propValue != null && propValue != "") {
              dom.rangeLow = propValue;
            }
            if (propname == "range high" && propValue != null && propValue != "") {
              dom.rangeHigh = propValue;
            }
            if (propname == "checked value") {
              dom.checkedValue = propValue;
            }
            if (propname == "unchecked value") {
              dom.uncheckedValue = propValue;
            }
            if (propname == "cursor row") {
              dom.cursorRow = propValue;
            }
            if (propname == "cursor column") {
              dom.cursorColumn = propValue;
            }
            if (propname == "bypass validation") {
              dom.bypassValidation = propValue;
            }
            if (propname == "auto arrange" && propValue == "true") {
              if (parms.lastFormat != true) {
                dom.style.display = "none";
                dom.style.visibility = "hidden";
                dom.removeAttribute("id");
              }
              else {
                if (properties["visibility"] != "hidden") {
                  var shortcutKey = properties["shortcut key"];
                  if (pui.autoArrange.keys[shortcutKey] == true) {
                    // repeat fkeys do not render
                    dom.style.display = "none";
                    dom.style.visibility = "hidden";
                  }
                  else {
                    pui.autoArrange.keys[shortcutKey] = true;
                    if (isWin|| pui["horizontal auto arrange"]) {
					  if (pui.autoArrange.top  == null) pui.autoArrange.top = parseInt(dom.style.top);
                      if (pui.autoArrange.left == null) {
                        pui.autoArrange.left = parseInt(dom.style.left);
                        pui.autoArrange.startLeft = parseInt(dom.style.left);
                      }
                      else {
						if (pui["horizontal auto arrange"]){
							// This will re-arrange the buttons to fill the first line before wrapping to the second line
							if(pui.autoArrange.buttonCount==null)
								pui.autoArrange.buttonCount = 0;
								
							if (pui.autoArrange.startTop == null)
								pui.autoArrange.startTop = parseInt(dom.style.top);

							pui.autoArrange.buttonCount++;
							
							//calculate left using modulus 
							pui.autoArrange.left = pui.autoArrange.startLeft + (pui.autoArrange.buttonCount % pui["buttons per row"]) * pui["horizontal button spacing"];
							
							//calculate top (the row) using division 
							pui.autoArrange.top = pui.autoArrange.startTop + Math.floor(pui.autoArrange.buttonCount / pui["buttons per row"])*pui["vertical button spacing"];
						
						}
						else{
							//this is a window. it will move buttons on each line to fill blanks but not wrap to the previous line
							if (pui.autoArrange.prevTop != null && Math.abs(parseInt(dom.style.top) - pui.autoArrange.prevTop) > 5) {
							pui.autoArrange.left = pui.autoArrange.startLeft;
							}
							else {
								pui.autoArrange.left += pui["horizontal button spacing"];
							}
						}
					 }
                      dom.style.left = pui.autoArrange.left + "px";
                      pui.autoArrange.prevTop = parseInt(dom.style.top);
					  if (pui["horizontal auto arrange"]) dom.style.top = pui.autoArrange.top + "px";
                    }
                    else {                
                      if (pui.autoArrange.top == null) pui.autoArrange.top = parseInt(dom.style.top);
                      else pui.autoArrange.top += pui["vertical button spacing"];
                      dom.style.top = pui.autoArrange.top + "px";
                    }
                  }
                }
              }
            }
            if (propname == "allow drag" && propValue == "true") {
              if ((properties["cursor"] == null || properties["cursor"] == "") && !pui.iPadEmulation) dom.style.cursor = "move";
              pui.attachDragDrop(dom, properties);
            }
          }
        
          if (!isDesignMode && propname == "visibility" && properties["parent tab panel"] != null && properties["parent tab panel"] != "") {
            propValue = "hidden";
          }
          
          if (propValue != null && propValue != "") {
            var propParm = properties;
            if (isDesignMode) propParm = designItem.properties;
            dom = applyPropertyToField(propConfig, propParm, dom, propValue, isDesignMode, designItem, null, parms.subfileRow);
          }

          if (!isDesignMode && propname == "visibility" && propValue == "visible" && parms.rowNum != null) {
            dom.style.visibility = "";  // ensures that the grid's visibility is not overridden
          }
          
        }
      }

      // assign auto tabbing events to input boxes
      if (pui["auto tab"] == true && properties["prevent auto tab"] != "true") {
        if (properties["field type"] == "combo box" || properties["field type"] == "date field" || properties["field type"] == "spinner" || properties["field type"] == "textbox" || properties["field type"] == "password field") {
          var boxDom = dom;
          if (dom.comboBoxWidget != null) boxDom = dom.comboBoxWidget.getBox();
          addEvent(boxDom, "keyup", function(event) {
            event = event || window.event;
            var target = getTarget(event);
            // Check for printable character being typed in
            var printableChar = true;
            var keyCode = event.keyCode;
            if (keyCode < 48 || (keyCode > 90 && keyCode < 96) || (keyCode > 111 && keyCode < 186)) {
              if (keyCode != 32) printableChar = false;
            }
            var box = target;
            if (box.comboBoxWidget != null) box = box.comboBoxWidget.getBox();
            if (printableChar && box.value.length == box.maxLength && getCursorPosition(box) >= box.maxLength) {
              pui.goToNextElement(target);
              preventEvent(event);
              return false;
            }
          });
        }
      }

      // assign arrow key navigation events to input boxes
      if (pui["enable arrow keys"] == true) {
        if (properties["field type"] == "combo box" || properties["field type"] == "date field" || properties["field type"] == "spinner" || properties["field type"] == "textbox" || properties["field type"] == "password field") {
          var boxDom = dom;
          if (dom.comboBoxWidget != null) boxDom = dom.comboBoxWidget.getBox();
          addEvent(boxDom, "keydown", function(event) {
            event = event || window.event;
            var target = getTarget(event);
            var keyCode = event.keyCode;
            var box = target;
            if (box.comboBoxWidget != null) box = box.comboBoxWidget.getBox();
            if (keyCode == 37) {  // left arrow key
              if (getCursorPosition(box) <= 0) {
                pui.goToClosestElement(target, "left");
                preventEvent(event);
                return false;
              }
            }
            if (keyCode == 38) {  // up arrow key
              pui.goToClosestElement(target, "up");
              preventEvent(event);
              return false;
            }
            if (keyCode == 39) {  // right arrow key
              if (getCursorPosition(box) >= box.value.length) {
                pui.goToClosestElement(target, "right");
                preventEvent(event);
                return false;
              }
            }
            if (keyCode == 40) {  // down arrow key
              pui.goToClosestElement(target, "down");
              preventEvent(event);
              return false;
            }
          });
        }
      }

      // check set cursor row / column
      if ( !isDesignMode && properties["visibility"] != "hidden" &&
           pui.cursorValues.setRow != null && pui.cursorValues.setRow != "" &&
           pui.cursorValues.setColumn != null && pui.cursorValues.setColumn != "" ) {
        crow = properties["cursor row"];
        if (dom.parentNode && dom.parentNode.parentNode && dom.parentNode.parentNode.grid) {
          var adj = parseInt(crow, 10);
          if (!isNaN(adj)) adj += dom.parentNode.row - 1;
          crow = "" + adj;         
        }
        if (pui.cursorValues.setRow == crow) {
          var cursorMatch = false;
          if (pui.cursorValues.setColumn == properties["cursor column"]) cursorMatch = true;
          if (!cursorMatch) {
            if (properties["field type"] == "textbox" || properties["field type"] == "date field" || properties["field type"] == "password field" || properties["field type"] == "combox box" || properties["field type"] == "spinner") {
              var fieldInfo = items[i]["value"];
              if (fieldInfo != null && pui.isBound(fieldInfo) && fieldInfo["dataLength"] != null) {
                var dataLength = Number(fieldInfo["dataLength"]);
                var cursorColumn = Number(properties["cursor column"]);
                var setColumn = Number(pui.cursorValues.setColumn);
                if (!isNaN(dataLength) && !isNaN(cursorColumn) && !isNaN(setColumn)) {
                  if (setColumn > cursorColumn && setColumn < cursorColumn + dataLength) {
                    cursorMatch = true;
                  }                
                }
              }
            }
          }
          if (cursorMatch) {
            //if (pui.focusField.dom == null || pui.focusField.setFocusFlag != true) {
              // "set cursor row" and "set cursor column" take precedence over other propertiess like "set focus"
              pui.focusField.dom = dom;
              if (dom.comboBoxWidget != null) pui.focusField.dom = dom.comboBoxWidget.getBox();
              pui.focusField.setFocusFlag = true;
            //}              
          }
        } 
      }
      
      // attach events that keep track of modified state / cursor, apply a key filter, set max length
      if (!isDesignMode) {
        function setModified(e) {
          if (!pui.screenIsReady) return;
          var target = getTarget(e);
          target.modified = true;
          if (target.parentNode != null && target.parentNode.comboBoxWidget != null) target.parentNode.modified = true;
          pui.modified = true;
          if (target.id != null && target.id.indexOf(".") == -1) {
            // not a subfile field being modified
            pui.ctlRecModified[formatName] = true;
          }
        }
        // textboxes and text areas    
        if ((dom.comboBoxWidget != null) || (dom.tagName == "TEXTAREA") || (dom.tagName == "INPUT" && (pui.isTextbox(dom) || dom.type == "file"))) {
          var boxDom = dom;
          if (dom.comboBoxWidget != null) boxDom = dom.comboBoxWidget.getBox();
          if (dom.formattingInfo != null && dom.formattingInfo.maxLength != null) {
            boxDom.maxLength = dom.formattingInfo.maxLength;
            if (dom.tagName == "TEXTAREA") {
              addEvent(dom, "keyup", function(e) {
                var target = getTarget(e);
                var maxLength = Number(target.maxLength);
                if (!isNaN(maxLength) && maxLength > 0 && target.value != null && target.value.length > maxLength) {
                  target.value = target.value.substr(0, maxLength);
                }
              });
              addEvent(dom, "paste", function(e) {
                var target = getTarget(e);
                setTimeout(function() {
                  var maxLength = Number(target.maxLength);
                  if (!isNaN(maxLength) && maxLength > 0 && target.value != null && target.value.length > maxLength) {
                    target.value = target.value.substr(0, maxLength);
                  }
                }, 0);
              });
              addEvent(dom, "keydown", function(event) {
                event = event || window.event;
                var key = event.keyCode;
                if ( (key >= 48 && key <= 57)    ||   // 0-9
                     (key >= 65 && key <= 90)    ||   // a-z
                     (key == 32)                 ||   // space
                     (key >= 106 && key <= 111)  ||   // * + - . /
                     (key >= 186 && key <= 192)  ||   // ; = , - . / `
                     (key >= 219 && key <= 222) ) {   // [ \ ] '
                  var target = getTarget(event);
                  var maxLength = Number(target.maxLength);
                  if (!isNaN(maxLength) && maxLength > 0 && target.value != null && target.value.length == maxLength) {
                    preventEvent(event);
                    return false;
                  }
                }

              });
            }
          }
          if (dom.cursorRecord != null || dom.cursorField != null || dom.cursorRow != null || dom.cursorColumn != null) {
            addEvent(boxDom, "focus", pui.returnCursor);
            addEvent(boxDom, "keyup", pui.returnCursor);
          }          
          addEvent(boxDom, "focus", pui.setActiveElement);
          addEvent(boxDom, "keydown", pui.setActiveElement);
          addEvent(boxDom, "change", setModified);
          addEvent(boxDom, "paste", setModified);
          
          boxDom.cursorPosition = 0;
          addEvent(boxDom, "mouseup", pui.storeEventCursorPosition);
          addEvent(boxDom, "mousedown", pui.storeEventCursorPosition);
          addEvent(boxDom, "keyup", pui.storeEventCursorPosition);
          
          addEvent(boxDom, "keydown", function(event) {
            event = event || window.event;
            var key = event.keyCode;
            if (key >= 9 && key <= 45 && key != 32) return;   // includes keys like arrow keys, ctrl, shift, etc.
            if (key >= 112 && key <= 145) return;             // includes f1-f12, num lock, scroll lock, etc.
            setModified(event);
          });
          if(dom.formattingInfo && dom.formattingInfo.keyFilter){
            //apply key filter
            (function() {
              var keyFilter = dom.formattingInfo.keyFilter;
              addEvent(boxDom, "keypress", function(e) {
                e = e || window.event;
                pui.keyFilter(e, keyFilter);
              });
            })();
          }
          if (dom.formattingInfo != null && dom.formattingInfo.edtMsk != null && dom.formattingInfo.edtMsk != "") {
            addEvent(boxDom, "keyup", function(e) {
              pui.applyEditMask(getTarget(e), e);
            });
            addEvent(boxDom, "keydown", function(event) {
              event = event || window.event;
              var key = event.keyCode;
              var target = getTarget(event); 
              var digit = null;
              
              // Allow default action to occur when delete, backspace, or space is typed 
              // and all text is selected.
              if (key == 46 || key == 8 || key == 32) {
              
                var sel = false;
                if (typeof(target.selectionStart) == "number") {
                
                  sel = (target.selectionStart == 0 && target.selectionEnd == target.value.length);
                
                }
                else if (typeof(document.selection) != "undefined") {
                
                  sel = (document.selection.createRange().text == target.value);
                
                }
                
                if (sel) {
                
                  target.value = "";
                  return;
                
                }
              
              }
              
              if (key >= 48 && key <= 57) digit = key - 48;
              if (key >= 96 && key <= 105) digit = key - 96;
              if (key == 46) digit = 0;
              if (key == 8) digit = 0;
              if (digit != null) {
                target = getTarget(event);
                var value = target.value;
                if (value == null) return;                
                var pos = getCursorPosition(target);                
                if (key == 8 && pos > 0) pos = pos - 1;
                target.value = value.substr(0, pos) + String(digit) + value.substr(pos + 1);
                if (key != 46 && key != 8) pos++;
                preventEvent(event);
                pui.applyEditMask(target, event, pos);
                if (pui["is_old_ie"]) {
                  try {
                    event.keyCode = 0;
                  }
                  catch(e) {}
                }
                return false;
              }
            });
            pui.applyEditMask(boxDom);
          }
        }
        // checkboxes / radio buttons / dropdowns
        if (dom.tagName == "SELECT") {
          addEvent(dom, "keydown", function(event) {
            event = event || window.event;
            var key = event.keyCode;
            if (key == 38 || key == 40) {  // up or down arrow
              setModified(event);
            }
          });
        }
        if ((dom.tagName == "SELECT") || (dom.tagName == "INPUT" && (dom.type == "checkbox" || dom.type == "radio"))) {
          if (dom.cursorRecord != null || dom.cursorField != null || dom.cursorRow != null || dom.cursorColumn != null) {
            addEvent(dom, "focus", pui.returnCursor);
            addEvent(dom, "keyup", pui.returnCursor);
          }
          addEvent(dom, "focus", pui.setActiveElement);
          addEvent(dom, "keydown", pui.setActiveElement);
          addEvent(dom, "change", setModified);
          if (dom.tagName != "SELECT") {addEvent(dom, "click", setModified);}
			else{
			// prevent pagedown key from selecting last option in select box (not operational for Firefox)
			addEvent(dom, "keydown", function(e) {
			if (!e) e = window.event;
			var key = e.keyCode;
			if (key == 34) {
				e.cancel=true; 
				if (e.preventDefault) e.preventDefault(); 
				return false; 
				}
			});
		  
		  }
        }
        
        if (dom.tagName == "INPUT" && dom.type == "radio") {
          // radio buttons come in groups, they are not individually modified
          // therefore, we will set the modified flag to true to force posting of radio values
          dom.modified = true;
        }
        
        if (dom.cursorRecord != null || dom.cursorField != null || dom.cursorRow != null || dom.cursorColumn != null) {
          addEvent(dom, "click", pui.returnCursor);
        }
        
        addEvent(dom, "click", pui.setActiveElement);

      }
      
      // determine first field to set focus on
      if (!isDesignMode && !pui.iPadEmulation && pui.focusField.dom == null && !dom.disabled && !dom.readOnly && properties["visibility"] != "hidden") {
        if (dom.tagName == "INPUT") {
          if (pui.isTextbox(dom) || dom.type == "checkbox" || dom.type == "radio" || dom.type == "file") {
            pui.focusField.dom = dom;
          }
        }
        if (dom.tagName == "TEXTAREA" || dom.tagName == "SELECT") {
          pui.focusField.dom = dom;
        }
        if (dom.comboBoxWidget != null) {
          pui.focusField.dom = dom.comboBoxWidget.getBox();
        }
      }
          
      // add grids to grids array, so that it shows up as a record format
      if (isDesignMode && properties["field type"] == "grid") {
        designer.grids.push(designItem);
      }
      if (isDesignMode && properties["field type"] == "layout") {
        designer.layouts.push(designItem);
      }
          
      // call widget's initialize function
      var fieldType = properties["field type"];
      if (fieldType != null) {
        var widget = pui.widgets[fieldType];
        if (widget != null && widget.initialize != null) {
          widget.initialize({
            design: isDesignMode,
            properties: properties,
            dom: dom,
            designItem: designItem
          });
        }
      }
      
      if (!isDesignMode && properties["field type"] == "layout") {
        pui.layoutsDisplayed.push(dom.layout);
      }
      
      // get grid data
      if (!isDesignMode && properties["field type"] == "grid") {
        var subfiles = parms.subfiles;
        var subfile;
        var subfileData;
        var fieldNames;
        var ref;
        var errors;
        var recName = pui.formatUpper(properties["record format name"]);
        if (subfiles != null) subfile = subfiles[recName];
        if (subfile != null) subfileData = subfile.data;
        if (subfile != null) fieldNames = subfile["field names"];
        if (subfile != null) ref = subfile.ref;
        if (subfile != null) errors = subfile.errors;

        dom.grid.fileId = parms["fileId"];
        if (typeof(pui["view"]) != "undefined") {
          
          dom.grid.storageKey = "pui-grid-" + pui["view"];
          
        }        
        else if (typeof(parms["file"]) != "undefined" && typeof(parms["library"]) != "undefined") {
          
          dom.grid.storageKey = "pui-grid-" + parms["library"] + "-" + parms["file"] + "-" + recName;
          
        }

        if (subfileData != null) dom.grid.dataArray = subfileData;
        else dom.grid.dataArray = [];

        if (fieldNames != null) dom.grid.fieldNames = fieldNames;
        else dom.grid.fieldNames = [];
        
        // Convert PHP-style grid data (array of name/value pairs) to normal grid format (2-dimensional array of data and an array of field names) 
        if (pui.handler != null && subfileData == null) {
          subfileData = data[pui.formatUpper(properties["record format name"])];
          if (subfileData != null && subfileData.length > 0) {
            fieldNames = [];
            var dataArray = [];
            for (var fieldName in subfileData[0]) { 
              fieldNames.push(fieldName);
            }
            for (var j = 0; j < subfileData.length; j++) {
              var entry = [];
              var record = subfileData[j];
              for (var k = 0; k < fieldNames.length; k++) {
                var fieldName = fieldNames[k];
                entry.push(record[fieldName]);
              }
              dataArray.push(entry); 
            }
            dom.grid.dataArray = dataArray; 
            dom.grid.fieldNames = fieldNames; 
            subfile = {};
          }
        }
        
        if (ref != null) dom.grid.ref = ref;
        else dom.grid.ref = {};  
        
        if (errors != null) dom.grid.errors = errors;
        
        var msgKey = items[i]["subfile message key"];
        var msgQ = items[i]["subfile program message queue"];
        var ctlMsgQ = items[i]["subfile control program message queue"];
        if ( (msgKey != null && msgKey != "" && msgQ != null && msgQ != "") || 
             (ctlMsgQ != null && ctlMsgQ != "") ) {
          if (dom.grid.scrollbarObj != null) dom.grid.scrollbarObj.rowLabel = "Message";
          dom.grid.runtimeChildren.push({
            "id": "_msgsfltext",
            "column": "0",
            "field type": "output field",
            "grid": properties["id"],
            "left": "5px",
            "top": "5px",
            "cursor": "pointer",
            "onclick": 'pui.showMessageSubfileHelp(this);',
            "value": {
              "dataLength": "132",
              "dataType": "char",
              "fieldName": "text",
              "formatting": "Text",
              "textTransform": "none",
              "trimLeading": "false",
              "trimTrailing": "true",
              "lowerCaseField": true
            }
          });
          dom.grid.runtimeChildren.push({
            "id": "_msgsflhelp",
            "column": "0",
            "field type": "output field",
            "grid": properties["id"],
            "left": "0px",
            "top": "0px",
            "visibility": "hidden",
            "value": {
              "dataLength": "9999",
              "dataType": "char",
              "fieldName": "help",
              "formatting": "Text",
              "textTransform": "none",
              "trimLeading": "false",
              "trimTrailing": "true",
              "lowerCaseField": true
            }
          });
          dom.grid.runtimeChildren.push({
            "id": "_msgsflid",
            "column": "0",
            "field type": "output field",
            "grid": properties["id"],
            "left": "0px",
            "top": "0px",
            "visibility": "hidden",
            "value": {
              "dataLength": "7",
              "dataType": "char",
              "fieldName": "id",
              "formatting": "Text",
              "textTransform": "none",
              "trimLeading": "false",
              "trimTrailing": "true",
              "lowerCaseField": true
            }
          });
          dom.grid.runtimeChildren.push({
            "id": "_msgsfldate",
            "column": "0",
            "field type": "output field",
            "grid": properties["id"],
            "left": "0px",
            "top": "0px",
            "visibility": "hidden",
            "value": {
              "dataLength": "7",
              "dataType": "char",
              "fieldName": "date",
              "formatting": "Text",
              "textTransform": "none",
              "trimLeading": "false",
              "trimTrailing": "true",
              "lowerCaseField": true
            }
          });
          dom.grid.runtimeChildren.push({
            "id": "_msgsfltime",
            "column": "0",
            "field type": "output field",
            "grid": properties["id"],
            "left": "0px",
            "top": "0px",
            "visibility": "hidden",
            "value": {
              "dataLength": "6",
              "dataType": "char",
              "fieldName": "time",
              "formatting": "Text",
              "textTransform": "none",
              "trimLeading": "false",
              "trimTrailing": "true",
              "lowerCaseField": true
            }
          });
        }
        
        if (dom.grid.dataArray.length == 0) {
          if (pui.isBound(items[i]["subfile message key"]) || 
              pui.isBound(items[i]["subfile program message queue"])) {
            dom.grid.hideSubfile();
          }
        }

        //if (properties["display subfile"] == "false") {
        if (subfile == null) {
          dom.grid.hideSubfile();
        }
        
        var recNum = Number(properties["subfile record number"]);
        if (isNaN(recNum)) recNum = 1;
        if (recNum < 1 || recNum > 9999) recNum = 1;
        if (properties["position at top"] != "true") {
          var numRows = dom.grid.cells.length;
          if (dom.grid.hasHeader) numRows = numRows - 1;
          if (dom.grid.isInitCollapsed()) {
            numRows = numRows * dom.grid.foldMultiple;
          }
          var pageNum = parseInt( (recNum - 1) / numRows);
          var topRecNum = pageNum * numRows + 1;
          dom.grid.recNum = topRecNum;
        }
        else {          
          dom.grid.recNum = recNum;
        }
        if (properties["place cursor"] == "true") {
          dom.grid.placeCursorRRN = recNum;
          pui.placeCursorOnSubfile = true;
        }
        
        gridsToRender.push(dom.grid);
        pui.gridsDisplayed.push(dom.grid);
      }
      
      if (!isDesignMode && parms.subfileRow != null) {
        // save reference to dom
        dom.subfileRow = parms.subfileRow;
        if (items[i].domEls == null) items[i].domEls = [];
        items[i].domEls[parms.subfileRow - 1] = dom;
      }
  	    	        
    }  // end if already rendered condition

    if ((pui["controller"] != null || typeof pui.handler == "function") && properties != null && properties["set as modified"] != "false") {
      dom.modified = true;
    }
    
    if (!isDesignMode && parms.dataArrayIndex != null) {
      dom.dataArrayIndex = parms.dataArrayIndex;
    }
    
    // If rendering into collapsed grid, disable any elements which are 
    // below the viewable portion of the cell. 
    
    if (!isDesignMode && gridObj != null && !gridObj.expanded) {
    
      var cell = container;
      var height = parseInt(cell.style.height);
      if (!isNaN(height)) {
      
        var top = parseInt(dom.style.top);
        if (isNaN(top)) top = 0;        
        if (top > height && (dom.tagName == "INPUT" || dom.tagName == "SELECT" || dom.tagName == "TEXTAREA") && !dom.disabled) {
        
          dom.reenableOnExpand = true;
          dom.disabled = true;
          
        }
        
      }         
      
    }    

  }  // end for loop to process all items


  // process server side errors for this format
  if (!isDesignMode) {
    var errors = parms["errors"];
    if (errors != null) {
      if (parms.subfileRow != null) {
        errors = errors[String(parms.subfileRow)];
        if (errors != null) {
          pui.showErrors(errors, parms.subfileRow);
        }
      }
      else {
        pui.showErrors(errors);
      }
    }
  }

  // set active tabs on tab panels
  for (var i = 0; i < tabPanels.length; i++) {
    var tabPanel = document.getElementById(tabPanels[i]).tabPanel;
    if (activeTabs[i]) tabPanel.selectedTab = activeTabs[i];
    tabPanel.draw();
  }

  // render grid data
  for (var i = 0; i < gridsToRender.length; i++) {
    var grid = gridsToRender[i];
    if (pui.focusField != null && pui.focusField.setFocusFlag == true) {
      grid.placeCursorRRN = null;  // "set focus" takes precedence over "place cursor" 
    }
    if (grid.isInitCollapsed()) {
      grid.collapse(getObj(grid.tableDiv.id + "_expander"));
    }
    else {
      if (grid.subfileHidden) continue;
      grid.getData();
    }
    if (grid.subfileHidden) continue;
    if (grid.recNum > 1 && grid.scrollbarObj != null && grid.scrollbarObj.type == "sliding") {
      grid.scrollbarObj.setScrollTopToRow(grid.recNum);
    }
    else {
      if (pui.placeCursorOnSubfile && pui.cursorValues.setColumn == null && pui.cursorValues.setRow == null) {
        if (pui.focusField == null || pui.focusField.setFocusFlag != true) {
          setTimeout(function() {
            grid.placeCursor(true);
          }, 1);
        }
      }
    }
    if (grid.scrollbarObj != null) {
      grid.scrollbarObj.ready = true;
      if (!isDesignMode && grid.scrollbarObj.type == "sliding" && grid.scrollbarObj.rowsPerPage == 1) {
        grid.scrollbarObj.draw();
      }
    }
    grid.makeSortable();
    grid.restoreState();
  }

  // execute global onload event
  if (!isDesignMode && pui["onload"] != null && typeof pui["onload"] == "function" && parms.rowNum == null && parms.runOnload !== false) {
    pui["onload"](parms);
  }

  // execute format's onload event / save onsubmit event
	if (screenProperties != null && !isDesignMode) {
  	if (parms.runOnload !== false) {
    	var onloadProp = screenProperties["onload"];
    	if (onloadProp != null && onloadProp != "") {
    	  try {
    	    eval('var format = "' + screenProperties["record format name"] + '";');
    	    eval('var file = "' + parms.file + '";');
    	    eval(onloadProp);
    	  }
    	  catch(err) {
    	    pui.alert("Onload Error:\n" + err.message);
    	  }
    	}
  	}
  	pui.onsubmitProp = screenProperties["onsubmit"];
	}	

}


pui.attachResponse = function(dom) {
  function clickEvent() {
    if (dom.disabled == true) return;
    if (dom.getAttribute != null && dom.getAttribute("disabled") == "true") return;
    
    if (dom.parentPagingBar != null) {
      if (dom.nextPage == true && !dom.parentPagingBar.grid.atBottom()) {
        dom.parentPagingBar.grid.pageDown();
        return;
      }
      if (dom.prevPage == true && !dom.parentPagingBar.grid.atTop()) {
        dom.parentPagingBar.grid.pageUp();
        return;
      }
    }
    
    if (dom.shortcutKey != null) {
    
      pui.keyName = dom.shortcutKey;
    
    }
    
    // Little fix here: Do not pickup doms with matching shortcut key if 
    // we are dealing with a grid paging bar item. 
    
    // This allows paging controls for grids in same control format to 
    // function independently of one another.
    var doms = [];
    if (dom.shortcutKey != null && !dom.parentPagingBar) {
      for (formatName in pui.keyMap) {
        var keyMapDomArray = pui.keyMap[formatName][pui.keyName];
        if (keyMapDomArray != null) {
          for (var i = 0; i < keyMapDomArray.length; i++) {
            doms.push(keyMapDomArray[i]);
          }
        }
      }

    }
    else {
      doms.push(dom);
    }

    for (var i = 0; i < doms.length; i++) {
      doms[i].responseValue = "1";
      if (doms[i].bypassValidation == "true" || doms[i].bypassValidation == "send data") {
        pui.bypassValidation = doms[i].bypassValidation;
      }
    }

    var cell = dom.parentNode;
    if (cell != null) {
      var gridDiv = cell.parentNode;
      if (gridDiv != null) {
        var grid = gridDiv.grid;
        if (grid != null) {
          grid.setCursorRRN(cell.row);
        }
      }
    }
    
    var returnVal = pui.respond();
    
    if (returnVal == false) {
      for (var i = 0; i < doms.length; i++) {
        doms[i].responseValue = "0";
      }
      pui.bypassValidation = "false";
    }    
  }
  addEvent(dom, "click", clickEvent);
}


pui.showErrors = function(errors, rrn) {
  var globalMessages = [];
  for (var i = errors.length - 1; i >= 0; i = i - 1) {
    var err = errors[i];
    var msg = err.msg;
    if (err["encoded"]) {
      msg = pui.formatting.decodeGraphic(msg);  
    }
    // replace system formatting options
    msg = msg.replace(/&N/g, "<br/>");
    msg = msg.replace(/&P/g, "<br/>");
    msg = msg.replace(/&B/g, "<br/>");
    var dom = err.dom;
    var errId = err.id;
    if (rrn != null) errId += "." + rrn;
    if (dom == null && errId != null) dom = getObj(errId);
    if (dom == null || dom.tagName == null) {
      if (msg != null && msg != "") globalMessages.push(msg);
      continue;
    }
    // 'dom' is the widget element. 
    // 'tipBox' is the element the tool tip is attached to
    // this is the interior textbox for a combobox widget.
    if (dom.parentNode && dom.parentNode.comboBoxWidget) {
    
      dom = dom.parentNode;
    
    }   
    var tipBox = dom;    
    if (dom.comboBoxWidget != null) { 
      tipBox = dom.comboBoxWidget.getBox();
    }
    if (dom.pui.properties["error message location"] == "alert") {
      globalMessages.push(msg);
    
    }
    else {
      var tip = tipBox.validationTip;
      if (tip == null) {
        tip = new pui.ValidationTip(dom); 
      }
      pui.addCssClass(tipBox, "invalid");
      tip.setMessage(msg); 
      tip.show(3000, true);     
      var cell = dom.parentNode;
      if (cell != null) {
        var gridDiv = cell.parentNode;
        if (gridDiv != null) {
          var grid = gridDiv.grid;
          if (grid != null) grid.validationTips[dom.id] = tip;
        }
      }
    }

  }    
  
  if (globalMessages.length > 0) {
    var messagesText = "";
    for (var i = globalMessages.length - 1; i >= 0; i = i - 1) {  // these messages are in reverse order, so we loop backwards
      if (i != globalMessages.length - 1) messagesText += "<br/>";
      messagesText += globalMessages[i];
    }
    var displayText = messagesText;
    while (displayText.indexOf("<br/>") >= 0) {
      displayText = displayText.replace("<br/>", "\n");
    }
    setTimeout(function() {
      pui.alert(displayText);
    }, 1);
  }
  
  // show first error and focus cursor to it
  var setFocusField = !pui.screenIsReady;
  setTimeout(function() {
    pui.ignoreBlurs = true;
    for (var i = 0; i < errors.length; i++) {
      var id = errors[i].id;
      if (rrn != null) id += "." + rrn;
      var dom = errors[i].dom;
      
      if (dom == null && id != null) dom = getObj(id);
      if (dom != null) {
        if (dom.comboBoxWidget != null) dom = dom.comboBoxWidget.getBox();
        try {
          dom.focus();
          if (pui["highlight on focus"]) dom.select();
          dom.validationTip.show();
          if (setFocusField) {
            pui.focusField.dom = dom;
            pui.focusField.setFocusFlag = true;
          }
          break;
        }
        catch(e) {
        }
      }
    }
    setTimeout(function() {
      pui.ignoreBlurs = false;
    }, 0);
  }, 0);

}

pui.respond = function() {
  
  if (!pui.screenIsReady) {
    return false;
  }
  
  var response = pui.buildResponse();
  
  if (typeof response.valid == "boolean" && response.valid == false) {    
    if (pui.bypassValidation != "true" && (pui.bypassValidation != "send data" || response.nobypass == true)) {
      response.nobypass = false;
      pui.showErrors(response.errors);
      pui.rrnTracker = {};
      pui.keyName = "";
      return false;
    }
  }

  // handle screen's "onsubmit" event
  if (pui.onsubmitProp != null && pui.onsubmitProp != "") {
    try {
      pui.referenceToResponse = response;  // create temporary reference to response object, so it can be updated by certain API's
      var onsubmitReturnVal = eval(pui.onsubmitProp);
      if (typeof onsubmitReturnVal == "function") {
        onsubmitReturnVal = onsubmitReturnVal(response);
      }
      delete pui.referenceToResponse;
      if (onsubmitReturnVal == false) {
        pui.rrnTracker = {};
        pui.keyName = "";
        return false;
      }
    }
    catch(err) {
      pui.alert("Onsubmit Error:\n" + err.message);
      pui.rrnTracker = {};
      pui.keyName = "";
      return false;
    }
  }
  
  // handle global onsbumit event
  if (pui["onsubmit"] != null && typeof pui["onsubmit"] == "function") {
    if (pui["onsubmit"]() == false) {
      pui.rrnTracker = {};
      pui.keyName = "";
      return false;
    }
  }
  
  pui.screenIsReady = false;  // this prevents double-submits

  pui.showWaitAnimation();
  var uploading = false;
  if (pui.bypassValidation != "true" && (pui.bypassValidation != "send data" || response.nobypass == true)) {
    uploading = pui.processUpload(response);
  }
  if (!uploading) pui.submitResponse(response);
  
  return true;
}

pui.buildResponse = function() {
  var response = {};

  for (var fieldName in pui.changeResponseElements) {
    var domArr = pui.changeResponseElements[fieldName];
    for (var i = 0; i < domArr.length; i++) {
      var dom = domArr[i];
      if (dom.modified && pui.bypassValidation != "true") {
        response[fieldName] = "1";
        break;
      }
    }
    if (response[fieldName] != "1") response[fieldName] = "0";
  }

  for (var fieldName in pui.isBlankElements) {
    var domArr = pui.isBlankElements[fieldName];
    for (var i = 0; i < domArr.length; i++) {
      var dom = domArr[i];
      if (typeof dom.value == "string" && trim(dom.value) == "") {
        response[fieldName] = "1";
        break;
      }
    }
    if (response[fieldName] != "1") response[fieldName] = "0";
  }

  for (var fieldName in pui.dupElements) {
    var domArr = pui.dupElements[fieldName];
    for (var i = 0; i < domArr.length; i++) {
      var dom = domArr[i];
      if (pui.isDup(dom)) {
        response[fieldName] = "1";
        break;
      }
    }
    if (response[fieldName] != "1") response[fieldName] = "0";
  }

  for (var fieldName in pui.responseElements) {
    var doms = pui.responseElements[fieldName];
    var dom = doms[0];
    var boxDom = dom;
    if (dom.comboBoxWidget != null) boxDom = dom.comboBoxWidget.getBox();
    var value = null;
    if (dom.responseValue != null) {
      value = dom.responseValue;      
      if (value == "0") {  // handle same indicator variables bound to multiple buttons
        for (var i = 1; i < doms.length; i++) {
          if (doms[i].responseValue == "1") {
            value = "1";
            break;
          }
        }
      }
      else if (dom.responseValue == "" && dom.pui.properties["field type"] == "menu" && doms.length > 1) {  // handle same response variable bound to multiple menus
        for (var i = 1; i < doms.length; i++) {
          if (doms[i].responseValue != "") {
            value = doms[i].responseValue;
            break;
          }
        }
      }
      response[fieldName] = value;
    }
    else {
      if (pui.modified && pui.bypassValidation != "true" && pui.bypassValidation != "send data") {
        if (dom.ME == true && dom.modified != true) {
          response.valid = false;
          if (response.errors == null) response.errors = [];
          response.errors.push({ dom: boxDom, msg: pui.getLanguageText("runtimeMsg", "ME") });
          continue;
        }
        if (dom.MF == true && dom.modified == true && boxDom.maxLength != null && boxDom.value != null && (boxDom.maxLength != boxDom.value.length || boxDom.value === boxDom.emptyText)) {
          response.valid = false;
          if (response.errors == null) response.errors = [];
          response.errors.push({ dom: boxDom, msg: pui.getLanguageText("runtimeMsg", "MF") });
          continue;
        }
      }
      if (pui.bypassValidation != "true" && pui.bypassValidation != "send data" && dom.puirequired == true && !dom.disabled) {
        if ( (typeof boxDom.value == "string" && (trim(boxDom.value) == "" || boxDom.value === boxDom.emptyText)) ||
             (dom.fileUpload != null && dom.fileUpload.getCount() < 1) ) {
          response.valid = false;
          if (response.errors == null) response.errors = [];
          var msg = pui.getLanguageText("runtimeMsg", "required");
          if (dom.fileUpload != null) msg = pui.getLanguageText("runtimeMsg", "file required");
          response.errors.push({ dom: boxDom, msg: msg });
          continue;
        }
      }
      if (dom.fileUpload != null && pui.bypassValidation != "true" && pui.bypassValidation != "send data") {
        var msg = dom.fileUpload.validateCount();
        if (msg == null) {
          msg = dom.fileUpload.validateNames();
        }
        if (msg != null) {
          response.valid = false;
          if (response.errors == null) response.errors = [];
          response.errors.push({ dom: dom, msg: msg });
          continue;
        }        
      }
      if (dom.modified == true && pui.bypassValidation != "true") {
        if (dom.tagName == "INPUT") {
          switch(dom.type) {
            case "text":
            case "number":
            case "password":
            case "file":
            case "hidden":
            case "":
            // following are new HTML5 input types
            case "number":
            case "date":
            case "datetime":
            case "time":
            case "email":
            case "url":
            case "month":
            case "tel":
            case "url":
            case "color":
            case "datetime-local":
            case "search":
            case "week":
              value = dom.value;
              if (value === dom.emptyText) value = "";
              if (dom.autoCompValueField != null) {
              
                // Following config. value is undefined by default.
                
                // If set to false, don't use an empty hidden field value.
                if (pui["force auto complete match"] != false || dom.autoCompValueField.value != "") {
                 
                  value = dom.autoCompValueField.value;
                  
                }
                
              }
              if (pui.isDup(value)) {
                var dupMask = "";
                var replaceChar = " ";
                if (dom.formattingInfo != null && pui.formatting.isNumericType(dom.formattingInfo.dataType)) {
                  replaceChar = "0";
                }
                var numericValue = "";
                for (var j = 0; j < value.length; j++) {
                  var ch = value.substr(j, 1);
                  if (ch == pui["dup"]["char"]) {
                    dupMask += "1";
                    ch = replaceChar;
                    value = value.substr(0, j) + ch + value.substr(j + 1);
                  }
                  else {
                    dupMask += "0";
                  }
                  if (ch >= "0" && ch <= "9") {
                    numericValue += ch;
                  }
                }
                if (replaceChar != "0") response[fieldName + ".dup"] = dupMask;
                if (replaceChar == "0") {
                  var len = Number(dom.formattingInfo.dataLength);
                  if (isNaN(len)) len = 0;
                  var dec = dom.formattingInfo.decPos;
                  if (isNaN(dec)) dec = 0;
                  len = len - dec;
                  if (len < 0) len = 0;
                  var numPart = numericValue.substr(0, len);
                  var decPart = numericValue.substr(len);
                  if (decPart.length > dec) decPart = decPart.substr(0, dec);
                  var decimalChar = ".";
                  if (pui.appJob.decimalFormat == "I" || pui.appJob.decimalFormat == "J") {
                    decimalChar = ",";
                  }
                  var negative = (value.indexOf("-") != -1);
                  value = numPart;
                  if (decPart != "") {
                   value += decimalChar + decPart;
                  }
                  if (negative) value = "-" + value;
                }
              }
              break;
              
            case "checkbox":
              if (dom.checked) {
                if (dom.checkedValue != null && dom.checkedValue != "") value = dom.checkedValue;
                else value = "1";
              }
              else {
                if (dom.uncheckedValue != null && dom.uncheckedValue != "") value = dom.uncheckedValue;
                else value = " ";
              }
              break;

            case "radio":
              for (var j = 0; j < doms.length; j++) {
                var radioDom = doms[j];
                if (radioDom.checked && radioDom["radioValue"] != null) {
                  value = radioDom["radioValue"];
                  break;
                }
              }
              break;
          }
        }
        if (dom.tagName == "SELECT") {
          var multiple = false;
          if (dom.getAttribute("multiple") != null) multiple = true;
          if (!multiple) value = dom.value;
          if (multiple) {
            var values = [];
            for (var j = 0; j < dom.options.length; j++) {
              if (dom.options[j].selected) values.push(dom.options[j].value);
            }
            value = values.join(",");
          }
        }
        if (dom.tagName == "TEXTAREA") {
          value = dom.value;
          if (value === dom.emptyText) value = "";
        }
        if (dom.comboBoxWidget != null) {
          value = dom.comboBoxWidget.getValue();
          if (value === dom.comboBoxWidget.getBox().emptyText) value = "";
        }
        if (dom.slider != null) {
          value = dom.value;
          if (value != null) value = String(value);
        }
        if (dom.signaturePad != null) {
          value = dom.signaturePad.getValue();
        }
        if (dom.onOffSwitch != null) {
          value = "";
          if (dom.onOffSwitch.isOn && dom.onOffSwitch.onValue != null) {
            value = dom.onOffSwitch.onValue;
          }
          else if (!dom.onOffSwitch.isOn && dom.onOffSwitch.offValue != null) {
            value = dom.onOffSwitch.offValue;
          }        
        }
        if (dom.type == "grid selection") {
          value = dom.value;  // this is not a real dom element
        }
      }
    }

    if (typeof value == "string" && pui.bypassValidation != "true") {
      if (trim(value) == "" && dom.blankValues != null && dom.blankValues.length >= 1) {
        value = dom.blankValues[0];
      }

      if (dom.signaturePad != null && pui.bypassValidation != "send data") {
        if (value.length > dom.formattingInfo.maxLength) {
          response.valid = false;
          if (response.errors == null) response.errors = [];
          response.errors.push({ dom: dom, msg: pui.getLanguageText("runtimeMsg", "signature overflow") });
          continue;          
        }
      }
      
      var formattingObj = dom.formattingInfo;
      if (formattingObj != null && formattingObj.dataType != "expression") {
        formattingObj.value = value;
        formattingObj["revert"] = true;
        if (dom.responseValue != null) formattingObj.formatting = "Text";
        value = pui.FieldFormat.format(formattingObj);
        if (typeof value == "object") {
          response.valid = false;
          response.nobypass = true;
          if (response.errors == null) response.errors = [];
          response.errors.push({ dom: boxDom, msg: value.msg });
          continue;
        }

        var skipValidation = false;
        if (pui.bypassValidation == "send data") skipValidation = true;
        if (pui.isDup(dom)) skipValidation = true;
        if (dom.allowBlanks == true && typeof dom.value == "string" && trim(dom.value) == "") skipValidation = true;
        
        if (!skipValidation) {
        
          if (dom.validateName == true) {
            var valNameMsg = designUtils.validateName(value);
            if (valNameMsg != "" && valNameMsg != "is too long.") {
              response.valid = false;
              if (response.errors == null) response.errors = [];
              response.errors.push({ dom: boxDom, msg: "Name " + valNameMsg });
              continue;
            }
          }

          if (dom.validateEmail == true) {
            if (!pui.validateEmail(value)) {
              response.valid = false;
              if (response.errors == null) response.errors = [];
              var msg = pui.getLanguageText("runtimeMsg", "invalid email");
              response.errors.push({ dom: boxDom, msg: msg });
              continue;
            }
          }
        
          if (typeof dom.validValues == "string") {
            var validValues = pui.parseCommaSeparatedList(dom.validValues);
            var invalid = true;
            for (var i = 0; i < validValues.length; i++) {
              if (rtrim(String(validValues[i])) == value) {
                invalid = false;
                break;
              }
            }
            if (invalid) {
              response.valid = false;
              if (response.errors == null) response.errors = [];
              response.errors.push({ dom: boxDom, msg: pui.getLanguageText("runtimeMsg", "validValues") + validValues.join(", ") + "." });
              continue;
            }
          }
  
          if (typeof dom.compOperator == "string" && typeof dom.compValue == "string") {
            var compValue = dom.compValue;
            var boxValue = value;
            if (formattingObj.formatting == "Number") {
              compValue = Number(compValue);
              boxValue = Number(boxValue);
            }
            var compValueDisp = compValue;
            if (typeof compValue == "string") {
              compValue = rtrim(compValue);
              compValueDisp = "'" + compValueDisp + "'";
            }
            if (typeof boxValue == "string") boxValue = rtrim(boxValue);            
            var msg = "";
            switch(dom.compOperator) {
              case "Equal":
                if (compValue != boxValue) msg = "Value must equal " + compValueDisp + ".";
                break;
              case "Not Equal":
                if (compValue == boxValue) msg = "Value must not equal " + compValueDisp + ".";
                break;
              case "Greater Than":
                if (boxValue <= compValue) msg = "Value must be greater than " + compValueDisp + ".";
                break;
              case "Greater Than or Equal":
                if (boxValue < compValue) msg = "Value must be greater than or equal to " + compValueDisp + ".";
                break;
              case "Less Than":
                if (boxValue >= compValue) msg = "Value must be less than " + compValueDisp + ".";
                break;
              case "Less Than or Equal":
                if (boxValue > compValue) msg = "Value must be less than or equal to " + compValueDisp + ".";
                break;
            }
            if (msg != "") {
              response.valid = false;
              if (response.errors == null) response.errors = [];
              response.errors.push({ dom: boxDom, msg: msg });
              continue;
            }
          }
  
          if (typeof dom.rangeLow == "string") {
            var rangeLow = dom.rangeLow;
            var boxValue = value;
            if (formattingObj.formatting == "Number") {
              rangeLow = Number(rangeLow);
              boxValue = Number(boxValue);
            }
            if (typeof rangeLow == "string") rangeLow = rtrim(rangeLow);
            if (typeof boxValue == "string") boxValue = rtrim(boxValue);
            if (boxValue < rangeLow) {
              var rangeLowDisp = dom.rangeLow;
              if (formattingObj.formatting != "Number") rangeLowDisp = "'" + rangeLowDisp + "'";
              var msg = "Value must be greater than or equal to " + rangeLowDisp + ".";
              if (dom.rangeHigh != null) {
                var rangeHighDisp = dom.rangeHigh;
                if (formattingObj.formatting != "Number") rangeHighDisp = "'" + rangeHighDisp + "'";
                msg = "Valid range is " + rangeLowDisp + " to " + rangeHighDisp + "."
              }
              response.valid = false;
              if (response.errors == null) response.errors = [];
              response.errors.push({ dom: boxDom, msg: msg });
              continue;
            }
          }
  
          if (typeof dom.rangeHigh == "string") {
            var rangeHigh = dom.rangeHigh;
            var boxValue = value;
            if (formattingObj.formatting == "Number") {
              rangeHigh = Number(rangeHigh);
              boxValue = Number(boxValue);
            }
            if (typeof rangeHigh == "string") rangeHigh = rtrim(rangeHigh);
            if (typeof boxValue == "string") boxValue = rtrim(boxValue);
            if (boxValue > rangeHigh) {
              var rangeHighDisp = dom.rangeHigh;
              if (formattingObj.formatting != "Number") rangeHighDisp = "'" + rangeHighDisp + "'";
              var msg = "Value must be less than or equal to " + rangeHighDisp + ".";
              if (dom.rangeLow != null) {
                var rangeLowDisp = dom.rangeLow;
                if (formattingObj.formatting != "Number") rangeLowDisp = "'" + rangeLowDisp + "'";
                msg = "Valid range is " + rangeLowDisp + " to " + rangeHighDisp + "."
              }
              response.valid = false;
              if (response.errors == null) response.errors = [];
              response.errors.push({ dom: boxDom, msg: msg });
              continue;
            }
          }
        
        }
                
        response[fieldName] = value;
        if (dom.subfileRow != null) {
          var sflName = fieldName.split(".")[0];
          var rrnName = sflName + ".rrn";
          var trackerName = rrnName + "=" + dom.subfileRow;
          if (pui.rrnTracker[trackerName] != true) {            
            if (response[rrnName] == null) response[rrnName] = [];
            response[rrnName].push(dom.subfileRow);
            pui.rrnTracker[trackerName] = true;
          }
          var subfileChangedField = pui.subfileChangedFields[sflName];
          if (subfileChangedField != null) {
            response[sflName + "." + subfileChangedField + "." + dom.subfileRow] = "1";
          }
        }
      }
    }
  }
  if (pui.keyName != null && pui.keyName != "") {
    var fkey = pui.fkeyValues[pui.keyName];
    if (fkey != null && fkey > 0) { 
      response["fkey"] = String(fkey);
    }
    var aid = pui.aidKeyValues[pui.keyName];
    if (aid != null) { 
      response["aid"] = String(aid);
    }
    else {
      response["aid"] = pui.aidKeyValues["Enter"]; // Default to enter key if key not found.
    }    
  }
  
  if (pui.cursorFields.record != null && pui.cursorFields.record != "" && pui.cursorValues.record != null && pui.cursorValues.record != "") {
    response[pui.cursorFields.record] = pui.cursorValues.record;
  }
  if (pui.cursorFields.field != null && pui.cursorFields.field != "" && pui.cursorValues.field != null && pui.cursorValues.field != "") {
    response[pui.cursorFields.field] = pui.cursorValues.field;
  }
  if (pui.cursorFields.position != null && pui.cursorFields.position != "" && pui.cursorValues.position != null && pui.cursorValues.position != "") {
    response[pui.cursorFields.position] = pui.cursorValues.position;
  }
  if (pui.cursorFields.row != null && pui.cursorFields.row != "" && pui.cursorValues.row != null && pui.cursorValues.row != "") {
    response[pui.cursorFields.row] = pui.cursorValues.row;
  }
  if (pui.cursorFields.column != null && pui.cursorFields.column != "" && pui.cursorValues.column != null && pui.cursorValues.column != "") {
    response[pui.cursorFields.column] = pui.cursorValues.column;
  }
  var rowNum = Number(pui.cursorValues.row);
  if (!isNaN(rowNum) && rowNum > 0) response["row"] = String(rowNum);
  var columnNum = Number(pui.cursorValues.column);
  if (!isNaN(columnNum) && columnNum > 0) response["column"] = String(columnNum);
  if (pui.cursorValues.wrow != null) response["wrow"] = String(pui.cursorValues.wrow);
  if (pui.cursorValues.wcolumn != null) response["wcolumn"] = String(pui.cursorValues.wcolumn);
  
  for (var cursorRRNFieldName in pui.cursorRRNs) {
    var dom = pui.cursorRRNs[cursorRRNFieldName];
    if (dom.cursorRRN != null) {
      response[cursorRRNFieldName] = dom.cursorRRN;
    }
  }

  for (var returnRRNFieldName in pui.returnRRNs) {
    var dom = pui.returnRRNs[returnRRNFieldName];
    if (dom.returnRRN != null) {
      response[returnRRNFieldName] = dom.returnRRN;
      if (pui.keyName == "PageUp") {
        response[returnRRNFieldName] = 1;
      }
      if (pui.keyName == "PageDown") {
        response[returnRRNFieldName] += dom.grid.getSubfilePage();
      }
    }
  }

  for (var topRRNName in pui.topRRNs) {
    var topRRN = pui.topRRNs[topRRNName];
    response[topRRNName] = topRRN;
  }

  for (var sflModeFieldName in pui.sflModes) {
    var dom = pui.sflModes[sflModeFieldName];
    if (dom.grid.expanded) {
      response[sflModeFieldName] = "0";
    }
    else {
      response[sflModeFieldName] = "1";
    }
  }
  
  if (pui.columnSortResponseGrid != null) {
    var field = pui.columnSortResponseGrid.tableDiv.columnSortResponseField;
    var value = pui.columnSortResponseGrid.columnSortResponse;
    if (field != null && value != null) {
      response[field] = value;
    }
  }
  
  for (var fmt in pui.changedFields) {
    if (pui.ctlRecModified[fmt] && pui.bypassValidation != "true") {
      response[pui.changedFields[fmt]] = "1";
    }
    else {
      response[pui.changedFields[fmt]] = "0";
    }
  }
  
  if (pui.populateWindowTopLeft) {
    if (pui.windowTopField != null && pui.lastWindow != null) {
      response[pui.windowTopField] = String(parseInt(pui.lastWindow.style.top));
    }
    if (pui.windowLeftField != null && pui.lastWindow != null) {
      response[pui.windowLeftField] = String(parseInt(pui.lastWindow.style.left));
    }  
  }

  if (pui.validCommandKeyField != null) {
    if (response["aid"] != pui.aidKeyValues["Enter"]) {
      response[pui.validCommandKeyField] = "1";
    }
    else {
      response[pui.validCommandKeyField] = "0";
    }
  }
  
  for (var i = 0; i < pui.setOffFields.length; i++) {
    setOffField = pui.setOffFields[i];
    if (response[setOffField] == null) {  // not already set
      response[setOffField] = "0";
    }
  }

  if (pui.dragDropFields.respond == true) {
    if (pui.dragDropFields.ddElementId != null) {
      response[pui.dragDropFields.ddElementId] = pui["dragDropInfo"]["dd element id"];
    }
    if (pui.dragDropFields.ddRecordNumber != null) {
      var recordNum = pui["dragDropInfo"]["dd record number"];
      if (recordNum == null) recordNum = 0;
      response[pui.dragDropFields.ddRecordNumber] = String(recordNum);
    }
    if (pui.dragDropFields.targetElementId != null) {
      response[pui.dragDropFields.targetElementId] = pui["dragDropInfo"]["target element id"];
    }
    if (pui.dragDropFields.targetRecordNumber != null) {
      var recordNum = pui["dragDropInfo"]["target record number"];
      if (recordNum == null) recordNum = 0;
      response[pui.dragDropFields.targetRecordNumber] = String(recordNum);
    }
  }

  if (pui.backButtonField != null) {
    if (pui.sendBackButtonResponse) {
      response[pui.backButtonField] = "1";
    }
    else {
      response[pui.backButtonField] = "0";
    }
  }
  
  return response;
}


pui.submitResponse = function(response) {
  var url;
  if (pui.genie == null) url = getProgramURL("PUI0001200.pgm");
  else url = getProgramURL("PUI0002110.pgm");
  if (pui.psid != null && pui.psid != "") url += "/" + pui.psid;
  if (pui.handler != null && typeof pui.handler == "string") url = pui.handler;

  if (pui.handler != null && typeof pui.handler == "function") {
    pui.handler(response);
  }  
  else {
    pui.timeoutMonitor.end();
    ajaxJSON({
      "url": url,
      "method": "post",
      "params": response,
      "sendAsBinary": false,
      "saveResponse": true,
      "suppressAlert": true,
      "handler": function(parms) {
        pui.hideWaitAnimation();
        if (parms == null) {
          //document.body.style.backgroundColor = "#DFE8F6";
          document.body.innerHTML = '<div style="font-family: Trebuchet MS; width: 95%; text-align: center; font-size: 200%;"><br/>' + pui.getLanguageText("runtimeMsg", "session ended text") + '<br/><br/>' + pui.getLanguageText("runtimeMsg", "close browser text") + '</div>';
          var returnVal = shutDown();
          if (returnVal == false) return;
          pui.shutdownOnClose = false;
          pui.confirmOnClose = false;
          context = "";
          return;
        }        
        parms.container = pui.runtimeContainer;
        if (pui.genie == null) pui.render(parms);
        else pui.render5250(parms);
      },
      "onfail": function(req) {
        if (pui["onoffline"] == null) pui.alert(pui.getNoConnectionMessage(req));
        pui.hideWaitAnimation(true);
        pui.resetResponseValues();
        if (pui["onoffline"] != null) pui["onoffline"]();
      }      
    });
  }
}


pui.resetResponseValues = function() {
  // set response values back to "0"
  for (var fieldName in pui.responseElements) {
    var doms = pui.responseElements[fieldName];
    for (var i = 0; i < doms.length; i++) {
      if (doms[i].responseValue == "1") {
        doms[i].responseValue = "0"
      }
    }
  }
  pui.screenIsReady = true;
}


pui.cancelResponse = function(messages) {
  for (var id in messages) {
    var msg = messages[id];
    var dom = getObj(id);
    if (dom != null) {
      var tip = dom.validationTip;
      if (tip != null) tip.hide();
      tip = new pui.ValidationTip(dom);
      tip.setMessage(msg);
      tip.show();
    }    
  }
  pui.hideWaitAnimation(true);
  for (var i = 0; i < pui.gridsDisplayed.length; i++) {  
    var grid = pui.gridsDisplayed[i];
    grid.unMask();
  }
  pui["unmaskScreen"]();
  pui.resetResponseValues();
}


pui.evalBoundProperty = function(propValue, data, ref) {
  if (!pui.isBound(propValue) && !pui.isTranslated(propValue)) return propValue;
  
  var formattingObj = propValue;

  if (data == null) {
    if (formattingObj["designValue"] != null) return formattingObj["designValue"];
    return "";
  }
 
  var fieldName = formattingObj.fieldName;
  if (formattingObj["lowerCaseField"] != true && pui.handler == null) {
    fieldName = fieldName.toUpperCase();
  }
  var dataValue;
  if (formattingObj.dataType == "expression") {
    dataValue = pui.evalIndicatorExpression(formattingObj.fieldName, data);
  }
  else {
    dataValue = data[fieldName];
    if (dataValue == null) dataValue = "";
  }              
  formattingObj.value = dataValue;
  if (formattingObj.dataType == "reference") {
    var referenceObj = ref[fieldName];
    if (referenceObj != null) {
      formattingObj.dataType = pui.translateDataType(referenceObj.dataType);
      formattingObj.dataLength = String(referenceObj.dataLength);
      formattingObj.decPos = String(referenceObj.decPos);
    }
  }
  
  if (formattingObj["formatting"] == "Text") {
    if (pui.formatting.isNumericType(formattingObj.dataType)) {
      if (formattingObj["textTransform"] != null) delete formattingObj["textTransform"];
      if (formattingObj["trimLeading"] != null) delete formattingObj["trimLeading"];
      if (formattingObj["trimTrailing"] != null) delete formattingObj["trimTrailing"];
      formattingObj["formatting"] = "Number";
      formattingObj["numSep"] = "false";
      formattingObj["zeroBalance"] = "false";
      formattingObj["zeroFill"] = "false";
      formattingObj["curSym"] = "";
      formattingObj["units"] = "";
      formattingObj["negNum"] = "-999.00";
    }
    //if (formattingObj.dataType == "date") {
    //  // to do
    //}
    //if (formattingObj.dataType == "time") {
    //  // to do
    //}
    //if (formattingObj.dataType == "timestamp") {
    //  // to do
    //}
  }
  
  return pui.FieldFormat.format(formattingObj);
}

pui.evalIndicatorExpression = function(expression, data) {
  var iMainValue = false;
  var iRows = expression.split(" or ");
  for (var row = 0; row < iRows.length; row++) {
    var iRow = iRows[row];
    var iRowValue = true;
    var iCols = iRow.split(" and ");
    for (var col = 0; col < iCols.length; col++) {
      var indicator = iCols[col];
      var not = false;
      if (indicator.substr(0, 1) == "N") {
        not = true;
        indicator = indicator.substr(1);
      }
      indicator = "*IN" + indicator;
      var iValue = (data[indicator] == "1");
      if (not) iValue = !iValue;
      if (!iValue) {
        iRowValue = false;
        break;
      }
    }
    if (iRowValue) {
      iMainValue = true;
      break;
    }
  }
  if (iMainValue) return "1";
  return "0";
}


pui.showWaitAnimation = function() {
  //pui.runtimeContainer.style.zoom = 1;  // triggers hasLayout in IE  ??

  //pui.runtimeContainer.style.opacity = 0.5;
  //pui.runtimeContainer.style.filter = "alpha(opacity=50)";
  var animation;
  if (pui["loading animation"]["text"] != null) {
    animation = document.createElement("div");
    animation.innerHTML = pui["loading animation"]["text"];
    animation.style.backgroundColor = "#cccccc";
    animation.style.border = "1px solid #333333";
    animation.style.fontSize = "10px";
    animation.style.fontFamily = "Sans-Serif";
  }
  else {
    animation = document.createElement("img");
    animation.src = pui["loading animation"]["path"];
    var width = pui["loading animation"]["width"];
    var height = pui["loading animation"]["height"];
    animation.style.width = width + "px";
    animation.style.height = height + "px";
  }
  animation.style.position = "absolute";
  var left = pui["loading animation"]["left"];
  animation.style.left = left + "px";
  var top = pui["loading animation"]["top"];
  top += Math.max(document.body.scrollTop, document.documentElement.scrollTop)
  animation.style.top = top + "px";
  animation.style.zIndex = 250;
  animation.id = "_pui_loading_animation";
  pui.runtimeContainer.appendChild(animation);
  
  for (var i = 0; i < pui.gridsDisplayed.length; i++) {  
    var grid = pui.gridsDisplayed[i];
    if (!grid.subfileHidden) grid.mask();
  }
  
}

pui.hideWaitAnimation = function(removeAnimationImage) {
  //pui.runtimeContainer.style.opacity = "";
  //pui.runtimeContainer.style.filter = "";
  if (removeAnimationImage == true) {
    var animation = getObj("_pui_loading_animation");
    if (animation != null && animation.parentNode != null) {
      animation.parentNode.removeChild(animation);
    }
  }
}


pui.handleHotKey = function(e, keyName) {

  if (context != "dspf") return;
  
  if (!e) e = window.event;
  var key = e.keyCode;
  var fkey;
  
  fkey = key - 111;

  if (keyName == null) {
    if (fkey >= 1 && fkey <= 12) {
      if(!pui["is_old_ie"] || (fkey > 1 || e.shiftKey)){
        if(e.shiftKey){
          fkey = fkey + 12;
        }
        else if(e.modifiers && Event.SHIFT_MASK){
          fkey = fkey + 12;
        }
        keyName = "F" + fkey;
        if (e.altKey) {
          keyName = "Alt-" + keyName;
        }
        else if (e.ctrlKey) {
          keyName = "Ctrl-" + keyName;
        }
      }
    }
    else {
      switch (key) {
        case 13: 
          keyName = "Enter";
          break;
        case 19: 
          keyName = "Pause/Break";
          break;
        case 27: 
          keyName = "Escape";
          break;
        case 33: 
          keyName = "PageUp";
          break;
        case 34: 
          keyName = "PageDown";
          break;
        case 44: 
          keyName = "PrtScn";
          break;
      }
    }
  }
  
  if (keyName == "Ctrl-F9") {  // Handle shortcut to download the JSON for this screen
    pui["downloadJSON"]();
    return false;
  }
  
  var processKey = (keyName != null && pui.lastFormatName != null);
  if (processKey && keyName != "Enter") {
    if (pui.keyMap[pui.lastFormatName][keyName] == null) {
      processKey = false;
    }
    else if (keyName == "PageUp" || keyName == "PageDown") {
      
      // Do not take action for page up / page down when multiple grids 
      // with paging bar are on screen.
      var pbar = false;
      for (var i = 0; i < pui.gridsDisplayed.length; i++) {
        
        var grid = pui.gridsDisplayed[i];
        if (grid.pagingBar && grid.pagingBar.showPagingControls) {
          
          if (pbar == false) {
            
            pbar = true;
            
          }
          else {
            
            processKey = false;
            break;
            
          }
          
        }
        
      }
      
    }
    
  }
  
  if  (processKey) {
    var doms = [];
    var mustRespond = false;
    for (var formatName in pui.keyMap) {
      var domArray = pui.keyMap[formatName][keyName];
      if (domArray != null) {
        var allDisabled = true;
        for (var i = 0; i < domArray.length; i++) {
          var dom = domArray[i];
          if (!dom.disabled) allDisabled = false;
          if (dom.parentPagingBar != null) {
            if (dom.nextPage == true && !dom.parentPagingBar.grid.atBottom()) {
              dom.parentPagingBar.grid.pageDown();
              preventEvent(e);
              if (pui["is_old_ie"]) {
                  try {
                    e.keyCode = 0;
                  }
                  catch(e) {}
              }
              return false;
            }
            if (dom.prevPage == true && !dom.parentPagingBar.grid.atTop()) {
              dom.parentPagingBar.grid.pageUp();
              preventEvent(e);
              if (pui["is_old_ie"]) {
                try {
                  e.keyCode = 0;
                }
                catch(e) {}
              }
              return false;
            }
            if (dom.disabled) {
              preventEvent(e);
              if (pui["is_old_ie"]) {
                try {
                  e.keyCode = 0;
                }
                catch(e) {}
              }
              return false;
            }
          }  
          doms.push(dom);
        }
        if (doms.length >= 1 && typeof doms[0].onclick == "function" && dom.nextPage != true && dom.prevPage != true) {
          doms[0].onclick();
          pui.runtimeContainer.focus();
          preventEvent(e);
          if (pui["is_old_ie"]) {
            try {
              e.keyCode = 0;
            }
            catch(e) {}
          }
          return false;
        }
        if (allDisabled) {
          preventEvent(e);
          if (pui["is_old_ie"]) {
            try {
              e.keyCode = 0;
            }
            catch(e) {}
          }
          return false;
        }
        mustRespond = true;
      }
    }
    if (keyName == "Enter" && !pui.disableEnter) {
      mustRespond = true;
    }
    if (mustRespond) {
      pui.keyName = keyName;

      for (var i = 0; i < doms.length; i++) {
        doms[i].responseValue = "1";
        if (doms[i].bypassValidation == "true" || doms[i].bypassValidation == "send data") {
          pui.bypassValidation = doms[i].bypassValidation;
        }
      }

      var returnVal = pui.respond();
      
      if (returnVal == false) {
        for (var i = 0; i < doms.length; i++) {
          doms[i].responseValue = "0";
        }  
        pui.bypassValidation = "false";
      }    

      preventEvent(e);
      if (pui["is_old_ie"]) {
        try {
          e.keyCode = 0;
        }
        catch(e) {}
      }
      return false;
    }
  }

  if (keyName != null && ((keyName != "PageUp" && keyName != "PageDown") || pui.autoPageGrid)) {
    preventEvent(e);
    if (pui["is_old_ie"]) {
      try {
        e.keyCode = 0;
      }
      catch(e) {}
    }
    return false;
  }

}


pui.handleF1 = function(e) {
  return pui.handleHotKey(e, "F1");
}


pui["run"] = function(config) {
  var mobile = (config["mobile"] === true);
  var parameter = config["parameter"];
  var program = config["program"];
  if (program == null) program = "";
  var container = config["container"];
  var workstnid = config["workstnid"];
  if (workstnid == null) workstnid = "";
  workstnid = workstnid.toUpperCase();
  var debug = config["debug"];
  var log = config["log"];
  if (debug == null) debug = "0";
  if (log == null) log = "0";
  var library = "*LIBL";
  var progParts = program.split("/");
  if (progParts.length == 2) {
    library = progParts[0];
    program = progParts[1];
  }
  if (container == null) container = "pui";
  if (typeof container == "string") container = document.getElementById(container);
  addEvent(document.body, "keydown", pui.handleHotKey);
  addEvent(document.body, "help", pui.handleF1);
  addEvent(document.body, "mousedown", pui.clearCursor);
  if (config["jsonURL"] == null && config["mode"] != "preview") {
    pui.assignUnloadEvents();
  }
  container.setAttribute("tabindex", "0");
  pui.runtimeContainer = container;
  pui.showWaitAnimation();
  var method = "post";
  var url = getProgramURL("PUI0001200.pgm");  
  if (config["jsonURL"] != null) {
  
    // Use GET here to avoid 412 - Precondition Failed in Chrome and IOS7 Safari.
    url = config["jsonURL"] + "?r=" + Math.floor((Math.random() * 1000000000) + 1);
    method = "get";  
    
  }
  var ajaxParams = {
    "program": program.toUpperCase(),
    "library": library.toUpperCase(),
    "init": "1",
    "debug": debug,
    "log": log,
    "workstnid": workstnid
  };
  if (config["suffixid"] == "1") {
    ajaxParams["suffixid"] = "1";
  }  
  if (config["duplicateid"] == "1") {
    ajaxParams["duplicateid"] = "1";
  }
  if (mobile) {
    ajaxParams["mobile"] = "1";
    if (parameter == null) parameter = "";
    ajaxParams["p1"] = parameter;
    ajaxParams["l1"] = "250";
  }
  var params = config["params"];
  if (params != null) {
    for (var param in params) {
      ajaxParams[param] = params[param];
    }
  }
  if (config["mode"] == "preview") {
    if (window.opener == null || window.opener.pui == null || window.opener.pui["generatePreview"] == null) {
      container.innerHTML = "";
      pui.alert("Preview data is no longer available.  You can rebuild the preview in the Visual Designer.");
    }
    else {
      var preview = window.opener.pui["generatePreview"]();
      preview.container = container;
      pui.isPreview = true;
      if (window.opener.pui.viewdesigner) {
        pui.handler = function(response) {
          ajaxJSON({
            "url": "dummy_url",
            "method": "post",
            "params": response,
            "sendAsBinary": false,
            "suppressAlert": true,
            "handler": function() {
               document.body.innerHTML = '<br/><br/>Preview screen submitted.';
            },
            "onfail": function() {
               document.body.innerHTML = '<br/><br/>Preview screen submitted.';
            }
          });
        };
      }
      else {
        pui.handler = null;
      }
      pui.render(preview);
    }
  }
  else {

    // get puiRefreshId cookie 
    var puiRefreshId = pui["getCookie"]("puiRefreshId");
    if (puiRefreshId != null) {
      // delete the cookie
      pui["deleteCookie"]("puiRefreshId", "/");
      // set refresh parameter and append persistence id
      ajaxParams = {
        "refresh": "1"
      }
      url += "/" + puiRefreshId;
    }

    ajaxJSON({
      "url": url,
      "method": method,
      "sendAsBinary": false,
      "params": ajaxParams,
      "saveResponse": true,
      "suppressAlert": true,
      "handler": function(parms) {
        pui.hideWaitAnimation();
        parms.container = container;
        pui.render(parms);
      },
      "onfail": function(req) {
        pui.hideWaitAnimation(true);
        setTimeout(function() {
          if (pui["onoffline"] == null) {
            pui.alert(pui.getNoConnectionMessage(req));
            if (pui.touchDevice) {
              setTimeout(function() {
                if (navigator["app"] != null && navigator["app"]["exitApp"] != null) { // Check for exitApp api in PhoneGap
                  navigator["app"]["exitApp"](); 
                }
              }, 500);
            }
          }
          else {
            pui["onoffline"]();
          }
        }, 500);
      }
    });
  }
}

pui["signon"] = function(config) {
  var mobile = (config["mobile"] === true);
  var container = config["container"];
  var debug = config["debug"];
  var workstnid = config["workstnid"];
  var atriumitem = config["atrium_item"];
  if (atriumitem == null) atriumitem = "";
  if (workstnid == null) workstnid = "";
  workstnid = workstnid.toUpperCase();
  var log = config["log"];
  if (container == null) container = "pui";
  if (debug == null) debug = "0";
  if (log == null) log = "0";
  if (typeof container == "string") container = document.getElementById(container);
  addEvent(document.body, "keydown", pui.handleHotKey);
  addEvent(document.body, "help", pui.handleF1);
  pui.assignUnloadEvents();
  container.setAttribute("tabindex", "0");
  pui.runtimeContainer = container;
  pui.showWaitAnimation();  
  var url = getProgramURL("PUI0001200.pgm");
  
  // New -- provide program parameter also for signed in sessions.
  var program = "";
  var library = "";
  if (typeof(config["program"]) != "undefined") {
    library = "*LIBL";
    var progParts = config["program"].split("/");
    if (progParts.length == 2) {
      library = progParts[0];
      program = progParts[1];
    } 
  }
  
  var ajaxParams = {
    "signon": "1",
    "program": program.toUpperCase(),
    "library": library.toUpperCase(),    
    "init": "1",
    "debug": debug,
    "log": log,
    "workstnid": workstnid,
    "atrium_item": atriumitem    
  };
  if (config["suffixid"] == "1") {
    ajaxParams["suffixid"] = "1";
  }
  if (config["duplicateid"] == "1") {
    ajaxParams["duplicateid"] = "1";
  }
  if (mobile) {
    ajaxParams["mobile"] = "1";
  }  
  var params = config["params"];
  if (params != null) {
    for (var param in params) {
      ajaxParams[param] = params[param];
    }
  }

  // get puiRefreshId cookie 
  var puiRefreshId = pui["getCookie"]("puiRefreshId");
  if (puiRefreshId != null) {
    // delete the cookie
    pui["deleteCookie"]("puiRefreshId", "/");
    // set refresh parameter and append persistence id
    ajaxParams = {
      "refresh": "1"
    }
    url += "/" + puiRefreshId;
  }

  ajaxJSON({
    "url": url,
    "method": "post",
    "sendAsBinary": false,
    "params": ajaxParams,
    "saveResponse": true,
    "suppressAlert": true,
    "handler": function(parms) {
      pui.hideWaitAnimation();
      parms.container = container;
      pui.render(parms);
    },
    "onfail": function(req) {
      pui.hideWaitAnimation(true);
      setTimeout(function() {
        if (pui["onoffline"] == null) {
          pui.alert(pui.getNoConnectionMessage(req));
          if (pui.touchDevice) {
            setTimeout(function() {
              if (navigator["app"] != null && navigator["app"]["exitApp"] != null) { // Check for exitApp api in PhoneGap
                navigator["app"]["exitApp"](); 
              }
            }, 500);
          }
        }
        else {
          pui["onoffline"]();
        }
      }, 500);
    }
  });
}


pui.runMVC = function(response) {

  ajaxJSON({
    "url": pui.normalizeURL(pui["controller"]) + "?r=" + Math.floor((Math.random()*1000000000)+1),
    "method": "get",
    "params": response,
    "sendAsBinary": false,
    "saveResponse": true,
    "suppressAlert": true,
    "handler": function(parms) {
      pui.hideWaitAnimation();
      if (parms == null) {
        //document.body.style.backgroundColor = "#DFE8F6";
        document.body.innerHTML = '<div style="font-family: Trebuchet MS; width: 95%; text-align: center; font-size: 200%;"><br/>' + pui.getLanguageText("runtimeMsg", "session ended text") + '<br/><br/>' + pui.getLanguageText("runtimeMsg", "close browser text") + '</div>';
        return;
      }        
      parms.container = pui.runtimeContainer;

      var data = parms["data"];
      if (data == null) data = {};
      if (parms["view"] != null) {   // view changed by controller
        pui["view"] = parms["view"]; 
      }
      if (parms["redirect"] != null) {
        location.href = parms["redirect"];
        return;
      }
      if (parms["controller"] != null) {
        pui["controller"] = parms["controller"];
        pui.runMVC({});
        return;
      }
      if (parms["html"] != null) {
        pui.runtimeContainer.innerHTML = parms["html"];
        return;
      }
      var format = parms["format"];
      if (format == null) format = parms["screen"];
      var formats = parms["formats"];
      if (formats == null) formats = parms["screens"];
      pui.show({
        "path": pui.normalizeURL(pui["view"]),
        "data": data,
        "format": format,  // if not specified, the first format is used
        "formats": formats,
        "handler": function(response) {
          pui.runMVC(response);
        }
      });
    },
    "onfail": function(req) {
      if (pui["onoffline"] == null) pui.alert(pui.getNoConnectionMessage(req));
      pui.hideWaitAnimation(true);
      pui.resetResponseValues();
      if (pui["onoffline"] != null) pui["onoffline"]();
    }      
  });

}

pui.start = function() {  
  var parms = getQueryStringParms();
  pui.canvasSize = parms["canvasSize"];
  var program = parms["pgm"];
  if (program == null) program = parms["program"];
  var debug = parms["debug"]
  var container = parms["container"];
  var workstnid = parms["workstnid"];
  var suffixid = parms["suffixid"];
  var duplicateid = parms["duplicateid"];
  var log = parms["log"];
  var atriumItem = parms["atrium_item"];
  var initPgm = parms["initpgm"];
  var jsonURL = parms["jsonURL"];
  var mode = parms["mode"];
  var controller = parms["controller"];
  var mobile = (parms["mobile"] === "1");
  var params = {};
  if (pui.detectMobileEmulation != null && typeof pui.detectMobileEmulation == "function") pui.detectMobileEmulation(container);
  for (var i = 1; i <= 255; i++) {
    var parmValue = parms["p" + i];
    var parmLen = parms["l" + i];
    if (parmValue == null || parmLen == null) break;
    params["p" + i] = parmValue;
    params["l" + i] = parmLen;
  }
  
  if (controller != null) pui["controller"] = controller;
  
  if (pui["controller"] != null) {
    addEvent(document.body, "keydown", pui.handleHotKey);
    addEvent(document.body, "help", pui.handleF1);
    addEvent(document.body, "mousedown", pui.clearCursor);
    pui.runMVC({});
    return;
  }
  
  var config = {
    "container": container, 
    "debug": debug, 
    "log": log, 
    "workstnid": workstnid,
    "suffixid": suffixid,
    "duplicateid": duplicateid,    
    "mobile": mobile,
    "params": params
  };
  if (program == null && jsonURL == null && mode == null) {
    // Signed in session. Look for Atrium item 
    // and initial program request.
    if (atriumItem != null) {
      config["atrium_item"] = atriumItem; 
    }
    else if (initPgm != null) {
      config["program"] = initPgm;
    }  
    pui["signon"](config);
  }  
  else {
    config["program"] = program;
    if (jsonURL != null) config["jsonURL"] = jsonURL;
    if (mode != null) config["mode"] = mode;
    pui["run"](config);
  }
}


pui.newSession = function() {
  window.location.reload();
}

pui.closeSession = function() {

  if (window.parent != window && typeof(window.parent["Atrium"]) != "undefined") {
    window["Atrium"]["closeTab"]();  
    return;
  }

  //document.body.style.backgroundColor = "#DFE8F6";
  document.body.innerHTML = '<div style="width: 95%; text-align: center; font-size: 200%;"><br/>' + pui.getLanguageText("runtimeMsg", "close browser text") + '</div>';
  
  // This can throw an exception in some older releases of FireFox 3 when attempting to 
  // close a window that was not opened through scripting.
  try {
    window.close();
  }
  catch(e) {
  }

  if (navigator["app"] != null && navigator["app"]["exitApp"] != null) { // Check for exitApp api in PhoneGap
    navigator["app"]["exitApp"](); 
  }
}

pui.formatErrorText = function() {
  var dom = document.getElementById("ESHELP");
  var text;
  if (dom != null) {
    text = dom.innerHTML;
    if (text != null) {
      var searchFor = "Recovery  . . . :";
      text = text.replace(searchFor, "<br/><br/>" + searchFor);
      searchFor = searchFor.replace("  ", " ");  // replace 2 spaces with one (IE)
      text = text.replace(searchFor, "<br/><br/>" + searchFor);
      dom.innerHTML = text;
    }
  }
}



// Mask the screen
pui["maskScreen"] = function(parms) {

  var bodyWidth = document.documentElement.clientWidth - 2;
  var bodyHeight = document.documentElement.clientHeight - 2;
  if (bodyWidth < 0) bodyWidth = 0;
  if (bodyHeight < 0) bodyHeight = 0;
  
  
  var maskDiv;
  if (pui.maskDiv == null) {
    maskDiv = document.createElement("div");
    pui.maskDiv = maskDiv;
  }
  else {
    maskDiv = pui.maskDiv;
  }
  pui.runtimeContainer.appendChild(maskDiv);
  
  maskDiv.isPUIWindowMask = true;
  maskDiv.style.position = "absolute";
  
  
  
 
  maskDiv.style.left = "0px";
  maskDiv.style.top = "0px";
  if (pui.genie != null || pui.runtimeContainer.offsetLeft != 0 || pui.runtimeContainer.offsetTop != 0) {
    maskDiv.style.display = "none";
    setTimeout(function() {
      //maskDiv.style.left = (-pui.runtimeContainer.offsetLeft) + "px";
      //maskDiv.style.top = (-pui.runtimeContainer.offsetTop) + "px";
	  var runtimePosition = getDivPosition(pui.runtimeContainer);
	  maskDiv.style.left = (0-runtimePosition.x) + "px";
      maskDiv.style.top = (0-runtimePosition.y) + "px";
      maskDiv.style.display = "";
    }, 0);
  }
  maskDiv.style.width = bodyWidth + "px";
  maskDiv.style.height = bodyHeight + "px";
  maskDiv.style.backgroundColor = pui["window mask color"];
  pui.windowZIndex++;
  maskDiv.style.zIndex = pui.windowZIndex;
  var opacity = pui["window mask opacity"];
  maskDiv.style.opacity = opacity / 100;
  maskDiv.style.filter = "alpha(opacity=" + opacity + ")";
  if (typeof maskDiv.style.MozUserSelect != "undefined") maskDiv.style.MozUserSelect = "none";

  
  addEvent(window, "resize", resize);
  addEvent(window, "scroll", scroll);
  
  
  
 function getDivPosition(obj) {
    var pos = {'x':0,'y':0};
    if(obj.offsetParent) {
        while(1) {
          pos.x += obj.offsetLeft;
          pos.y += obj.offsetTop;
          if(!obj.offsetParent) {
            break;
          }
          obj = obj.offsetParent;
        }
    } else if(obj.x) {
        pos.x += obj.x;
        pos.y += obj.y;
    }
    return pos;
  }
  
  
  
  
  function resize() {
    if (pui["resizeFrequency"] != null && pui.lastResizeTime != null && (new Date).getTime() - pui.lastResizeTime < pui["resizeFrequency"]) return; 
    pui.lastResizeTime = (new Date).getTime();
         
    bodyWidth = document.documentElement.clientWidth - 2;
    bodyHeight = document.documentElement.clientHeight - 2;
    
    if (maskDiv != null) {
        maskDiv.style.height = bodyHeight + "px";
        maskDiv.style.width = bodyWidth + "px";
    }
        
    scroll();
  }
  
  function scroll() {
    if (pui["scrollFrequency"] != null && pui.lastScrollTime != null && (new Date).getTime() - pui.lastScrollTime < pui["scrollFrequency"]) return; 
    pui.lastScrollTime = (new Date).getTime();

    var top = document.documentElement.scrollTop;
    var left = document.documentElement.scrollLeft;
    if(!pui["is_old_ie"]) {
      top = window.pageYOffset;
      left = window.pageXOffset;
    } 
	var runtimePosition = getDivPosition(pui.runtimeContainer);	
    if (pui.genie != null || pui.runtimeContainer.offsetLeft != 0 || pui.runtimeContainer.offsetTop != 0) {
      left -= runtimePosition.x;
      if (context == "dspf") top -= runtimePosition.y;
      else top = -pui.runtimeContainer.offsetTop;      
    }
      
    if(maskDiv != null) {
      maskDiv.style.top = top + "px";
      maskDiv.style.left = left + "px";
    }
  }
  
}



pui["unmaskScreen"] = function() {
  if (pui.maskDiv == null) return;
  var parent = pui.maskDiv.parentNode;
  if (parent != pui.runtimeContainer) return;
  parent.removeChild(pui.maskDiv);
}



pui.setupWindowDiv = function(parms, layer) {

  var format = layer.formats[0];

  pui.hideWaitAnimation(true);

  // disable elements of background screen
  function disableByTag(tag) {
    var elems = parms.container.getElementsByTagName(tag);
    for (var i = 0; i < elems.length; i++) {
      var elem = elems[i];
      if (elem.onclick) elem.onclick = null;
      elem.id = "";
      elem.removeAttribute("id");
      elem.disabled = true;
      elem.readOnly = true;
    }        
  }
  disableByTag("a");
  disableByTag("input");
  disableByTag("button");
  disableByTag("div");
  disableByTag("select");
  disableByTag("textarea");

  
  var maskScreenValue;
  if (format != null) {
    maskScreenValue = pui.evalBoundProperty(format.metaData.screen["mask screen"], format.data, format.ref);
  }
  var maskScreen = true;
  if (maskScreenValue == "false") maskScreen = false;
  
  if (maskScreen) {
    // mask screen
    pui["maskScreen"](parms);
  }


  var windowDiv = document.createElement("div");
  pui.windowZIndex++;
  windowDiv.style.zIndex = pui.windowZIndex;
  windowDiv.style.position = "absolute";
  var left;
  if (format != null) {
    left = pui.evalBoundProperty(format.metaData.screen["window left"], format.data, format.ref);
  }
  pui.lastWindowLeft = left;
  if (left == null) left = "0px";
  if (left.length <= 2 || left.substr(left.length - 2) != "px") {
    left = parseInt(left);
    if (isNaN(left)) left = 0;
    left = left * pui.standardColumnWidth + pui["leftOffset"];
    left = left + "px";
    pui.populateWindowTopLeft = false;
  }
  var top;
  if (format != null) {
    top = pui.evalBoundProperty(format.metaData.screen["window top"], format.data, format.ref);
  }
  pui.lastWindowTop = top;
  if (top == null) top = "0px";
  if (top.length <= 2 || top.substr(top.length - 2) != "px") {
    top = parseInt(top);
    if (isNaN(top)) top = 0;
    top = top * pui.standardRowHeight + pui.topOffset;
    top = top + "px";
    pui.populateWindowTopLeft = false;
  }
  
  windowDiv.style.left = left;
  windowDiv.style.top = top;
  windowDiv.isPUIWindow = true;
  pui.runtimeContainer.appendChild(windowDiv);
  parms.container = windowDiv;
  pui.lastWindow = windowDiv;
} 

pui.centerWindow = function() {
  var windowDims = pui.getDimensions(pui.lastWindow);
  var screenDims = pui.getDimensions(pui.runtimeContainer);
  var left = parseInt((screenDims.x2 - (windowDims.x2 - windowDims.x1)) / 2) - windowDims.x1;
  var top = parseInt((screenDims.y2 - (windowDims.y2 - windowDims.y1)) / 2) - windowDims.y1;
  if (left < -windowDims.x1) left = -windowDims.x1;
  if (top < -windowDims.y1) top = -windowDims.y1;
  pui.lastWindow.style.left = left + "px";
  pui.lastWindow.style.top = top + "px";
}

pui.getDimensions = function(screen) {
  var dims = {
    x1: 99999,
    y1: 99999,
    x2: 0,
    y2: 0
  }
  var obj = screen.firstChild;
  while (obj != null) {
    if (!obj.isPUIWindow && !obj.isPUIWindowMask && obj.style != null && obj.style.position == "absolute") {
      var x1 = obj.offsetLeft;
      var y1 = obj.offsetTop;
      var x2 = x1 + obj.offsetWidth;
      var y2 = y1 + obj.offsetHeight;
      if (x1 < dims.x1) dims.x1 = x1;
      if (y1 < dims.y1) dims.y1 = y1;
      if (x2 > dims.x2) dims.x2 = x2;
      if (y2 > dims.y2) dims.y2 = y2;
    }
    obj = obj.nextSibling;
  }
  if (screen.id == "5250" && dims.x1 == 99999 && dims.x2 == 0 && dims.y1 == 99999 && dims.y2 == 0) {
    dims.x1 = 0;
    dims.y1 = 0;
    dims.x2 = screen.parentNode.offsetWidth;
    dims.y2 = screen.parentNode.offsetHeight;
  }
  if (dims.x1 == 99999) dims.x1 = 0;
  if (dims.y1 == 99999) dims.y1 = 0;
  return dims;
}


pui.showMessageSubfileHelp = function(textObj) {

  if (pui.messageSubfileHelpWindowDiv != null && pui.messageSubfileHelpWindowDiv.style.display != "none" && pui.messageSubfileHelpWindowDiv.parentNode != null) {
    // help already shown, user clicked message again, so we hide the help
    pui.messageSubfileHelpWindowDiv.style.display = "none";
    return;
  }

  var textId = textObj.id;
  var suffix = textId.substr(textId.indexOf("."));
  var prefix = "_msgsfl";
  
  var id = get(prefix + "id" + suffix);
  
  var date = get(prefix + "date" + suffix);
  if (date.length == 7 && date.substr(0,1) == "1") {
    date = "20" + date.substr(1);
    var year = Number(date.substr(0,4));
    var month = Number(date.substr(4,2)) - 1;
    var day = Number(date.substr(6,2));
    var dateObj = new Date(year, month, day);
    var dateFormat = pui.appJob.dateFormat;
    if (dateFormat == "") dateFormat = "*ISO";
    var keyword = pui.formatting.keywords.DATFMT[dateFormat];
    var dispFormat = keyword.pattern.replace(/\B/g, pui.appJob.dateSeparator);
    date = dateObj.format(dispFormat, 'en_US');
  }
  
  var time = get(prefix + "time" + suffix);
  var tSep = pui.appJob["timeSeparator"];
  if (tSep == null) tSep = ".";
  time = time.substr(0,2) + tSep + time.substr(2,2) + tSep + time.substr(4,2);
  
  var text = textObj.innerHTML;
  
  var help = get(prefix + "help" + suffix);
  help = help.replace(/&amp;N/g, "<br/><br/>");
  help = help.replace("Cause . . . . . :", "<strong>Cause:</strong>");
  help = help.replace("Recovery  . . . :", "<strong>Recovery:</strong>");
  
  var content = '<div style="height: 30px; text-align: center; padding-top: 3px;"><strong>Additional Message Information</strong></div>';
  content += '<div style="height: 215px; overflow-y: auto; white-space: normal;">';
  content += "<strong>Message Id:</strong> " + id + "<br/><br/>";
  content += "<strong>Message:</strong> " + text + "<br/><br/>";
  content += "<strong>Date/Time:</strong> " + date + " " + time;
  content += help;
  content += "<br/><br/>";
  content += "</div>";
  
  var gridObj = textObj.parentNode.parentNode;
  var top = parseInt(gridObj.style.top);
  top = top - 260;
  if (top < 5) top = 5;
  var left = parseInt(gridObj.style.left);
  left += 3;
  
  var div;
  if (pui.messageSubfileHelpWindowDiv == null || pui.messageSubfileHelpWindowDiv.parentNode == null) {
    div = document.createElement("div");
    gridObj.parentNode.appendChild(div);
  }
  else {
    div = pui.messageSubfileHelpWindowDiv;
  }
  div.style.position = "absolute";
  div.style.left = left + "px";
  div.style.top = top + "px";
  div.style.width = "640px";
  div.style.height = "250px";
  div.style.border = "1px solid #cccccc";
  div.style.zIndex = pui.windowZIndex;
  div.style.whiteSpace = "normal";
  div.style.fontFamily = "Arial";
  div.style.backgroundColor = "#ffffff";
  div.style.color = "#555555";
  div.style.paddingLeft = "8px";
  div.innerHTML = content;
  div.style.display = "";
  var img = document.createElement("img");
  img.style.position = "absolute";
  img.style.top = "3px";
  img.style.right = "2px";
  img.style.cursor = "pointer";
  img.src = pui.normalizeURL("/profoundui/proddata/images/buttons/close/x1.png");
  img.onmouseover = function() {
    img.src = pui.normalizeURL("/profoundui/proddata/images/buttons/close/x1_hover.png");
  }
  img.onmouseout = function() {
    img.src = pui.normalizeURL("/profoundui/proddata/images/buttons/close/x1.png");
  }
  img.onclick = function() {
    div.style.display = "none";
  }
  div.appendChild(img);
  
  pui.messageSubfileHelpWindowDiv = div;
  
}

pui.setActiveElement = function(e) {
  var target = getTarget(e);
  if (!(target.tagName=="INPUT" && target.type=="button"))
    pui.activeElement = target;
}


pui.returnCursor = function(e, dom) {
  var target;
  if (e != null) target = getTarget(e);
  if (dom != null) target = dom;
  var cell = target.parentNode;
  var parentGrid = null;
  if (cell != null && cell.parentNode != null) {
    parentGrid = cell.parentNode.grid;
  }
  var isButton = false;
  if (target.tagName == "A" || target.tagName == "BUTTON" || (target.tagName == "INPUT" && target.type == "button") || target.button != null) {
    isButton = true;
  }
  var elem = target;
  if (elem.parentNode.comboBoxWidget != null) elem = elem.parentNode;
  if (elem.tagName == "OPTION" && elem.parentNode.tagName == "SELECT") elem = elem.parentNode;
  pui.cursorValues.record = elem.cursorRecord;
  pui.cursorValues.field = elem.cursorField;
  var pos = getCursorPosition(target) + 1;
  if (pos <= 0) pos = 1;
  if (target.maxLength != null && target.maxLength >= 1 && pos > target.maxLength) pos = target.maxLength;
  pui.cursorValues.position = String(pos);
  pui.cursorValues.elementId = elem.id;
  pui.cursorValues.row = elem.cursorRow;
  pui.cursorValues.wrow = null;
  pui.cursorValues.wcolumn = null;
  var winTop = pui.lastWindowTop;
  if (winTop != null) {
    if (winTop.length <= 2 || winTop.substr(winTop.length - 2) != "px") {
      winTop = Number(winTop);
      if (!isNaN(winTop) && winTop > 0) {
        pui.cursorValues.wrow = pui.cursorValues.row;
        if (pui.cursorValues.row != null) pui.cursorValues.row = Number(pui.cursorValues.row) + winTop;
        //pui.cursorValues.wrow = winTop;
      }
    }
  }
  if (cell != null && cell.row != null && typeof cell.row == "number") {
    if (pui.cursorValues.row != null) {
      pui.cursorValues.row = Number(pui.cursorValues.row) + cell.row;
      if (parentGrid != null && parentGrid.hasHeader) pui.cursorValues.row -= 1;
      pui.cursorValues.row = String(pui.cursorValues.row);
    }
    if (parentGrid != null) parentGrid.setCursorRRN(cell.row);
  }
  var winLeft = pui.lastWindowLeft;
  if (winLeft != null) {
    if (winLeft.length <= 2 || winLeft.substr(winLeft.length - 2) != "px") {
      winLeft = Number(winLeft);
      //if (!isNaN(winLeft) && winLeft > 0) {
      //  pui.cursorValues.wcolumn = winLeft;
      //}
    }
  }

  if (elem.cursorColumn == null) { 
    pui.cursorValues.column = null;
  }
  else {
    pui.cursorValues.column = Number(elem.cursorColumn) + Number(pos) - 1;
    if (!isNaN(winLeft) && winLeft > 0) {
      pui.cursorValues.wcolumn = pui.cursorValues.column;
      pui.cursorValues.column = pui.cursorValues.column + winLeft + 1;
    }

  }
  if (!isButton) {
    for (var i = 0; i < pui.gridsDisplayed.length; i++) {
      var grid = pui.gridsDisplayed[i];
      if (grid != parentGrid) {
        grid.tableDiv.cursorRRN = 0;
      }
    }
  }
}

pui.clearCursor = function(e) {
  var clear = false;
  var target = getTarget(e);
  if (target == document.body) clear = true;
  if (target == pui.runtimeContainer) clear = true;
  if (target.parentNode != null && target.parentNode.panel != null) clear = true;
  if (clear) {
    pui.cursorValues.field = null;
    pui.cursorValues.position = null;
    pui.cursorValues.elementId = null;
  }
}


pui.applyFocusClass = function(e) {
  var dom = getTarget(e);
  var cssClass = dom.className;
  if (cssClass == null) cssClass = "";
  cssClass = trim(cssClass);
  if (cssClass.indexOf(dom.focusClass) == -1) {
    cssClass += " " + dom.focusClass;
  }
  dom.className = cssClass;
}


pui.removeFocusClass = function(e) {
  var dom = getTarget(e);
  var cssClass = dom.className;
  if (cssClass == null) cssClass = "";
  cssClass = trim(cssClass);
  while (cssClass.indexOf(dom.focusClass) >= 0) {
    cssClass = cssClass.replace(dom.focusClass, "");
  }
  dom.className = trim(cssClass);
}


pui.translateDataType = function(dtype) {
  switch (dtype) {
    case 0: return "char";
    case 7: return "zoned";
    case 9: return "packed";
    case 10: return "floating";
    case 15: return "graphic";
    case 16: return "date";
    case 17: return "time";
    case 18: return "timestamp";
    default: return "char";
  }
}


pui.isDup = function(parm) {
  var value = "";
  if (typeof parm == "string") value = parm;
  if (typeof parm == "object") value = parm.value;
  if (value == null) value = "";
  if (typeof value != "string") value = String(value);
  return (value.indexOf(pui["dup"]["char"]) != -1);
}


pui.goToNextElement = function(target) {
    
  function findNextObj(obj) {
  
     var cell = obj.parentNode;
     var rtnObj = obj.nextSibling;
  
     if (rtnObj != null && rtnObj.grid != null) {
       if (rtnObj.grid.hasHeader) rtnObj = rtnObj.grid.cells[1][0].firstChild;
       else rtnObj = rtnObj.grid.cells[0][0].firstChild;      
     }
  
     // if within grid, go to elements in the next cell  
     if (rtnObj == null && cell.parentNode.grid != null) {
       if (cell.nextSibling != null) {
         rtnObj = cell.nextSibling.firstChild;
       }
       else {
         rtnObj = findNextObj(cell.parentNode.nextSibling);
       } 
     }

     return rtnObj;     
  }
  
  if (target.parentNode.comboBoxWidget != null) target = target.parentNode;
  var nextObj = target;
  
  while ((nextObj = findNextObj(nextObj)) != null) {
  
    var nextObjBox = nextObj;
    if (nextObj != null && nextObj.comboBoxWidget != null) nextObjBox = nextObj.comboBoxWidget.getBox();
  
    var tag = nextObjBox.tagName;
    if (tag == "INPUT" || tag == "SELECT" || tag == "TEXTAREA" || tag == "A") {
      if (!nextObjBox.readOnly && !nextObjBox.disabled && nextObj.style.visibility != "hidden" && nextObjBox.tabIndex != "-1" ) {
        try {
          nextObjBox.focus();
          if (pui["highlight on focus"]) nextObjBox.select();
          setTimeout(function() {
            pui.returnCursor(null, nextObjBox);
          }, 0);
        }
        catch(e) {}
        break;
      }
    }
    
  }
}


pui.goToClosestElement = function(baseElem, direction) {
  if (baseElem.parentNode.comboBoxWidget != null) baseElem = baseElem.parentNode;
  var baseX = parseInt(baseElem.style.left);
  if (isNaN(baseX)) return null;
  var baseY = parseInt(baseElem.style.top);
  if (isNaN(baseY)) return null;
  var container = baseElem.parentNode;
  var gridDom = container.parentNode;
  if (gridDom.grid != null) {  // the base element is within a grid
    var cellX = parseInt(baseElem.parentNode.style.left);
    if (isNaN(cellX)) return null;
    var cellY = parseInt(baseElem.parentNode.style.top);
    if (isNaN(cellY)) return null;
    var gridX = parseInt(gridDom.style.left);
    if (isNaN(gridX)) return null;
    var gridY = parseInt(gridDom.style.top);
    if (isNaN(gridY)) return null;
    baseX += cellX + gridX;
    baseY += cellY + gridY;
    container = gridDom.parentNode;
  }
  
  var curElem = null;
  var curXDiff = 99999;
  var curYDiff = 99999;
  var elems = [];
  function addElemsByTag(tag) {
    var elemsForThisTag = container.getElementsByTagName(tag);
    var elem;
    for (var i = 0; i < elemsForThisTag.length; i++) {
      elem = elemsForThisTag[i];
      if ((elem.tagName.toUpperCase() == "INPUT" && elem.type.toUpperCase() == "BUTTON") || elem.tabIndex == -1) continue;
      elems.push(elem);
    }
  }
  addElemsByTag("input");
  addElemsByTag("select");
  addElemsByTag("textarea");
  addElemsByTag("a");
  
  for (var i = 0; i < elems.length; i++) {
    var elem = elems[i];
    if (elem.readOnly || elem.disabled || elem.style.visibility == "hidden" || elem.parentNode.style.visibility == "hidden") continue;
    if (elem.tagName == "A") elem = elem.parentNode;
    var x = parseInt(elem.style.left);
    if (isNaN(x)) continue;
    var y = parseInt(elem.style.top);
    if (isNaN(y)) continue;
    gridDom = elem.parentNode.parentNode;
    if (gridDom.grid != null) {  // the element is within a grid
      var cellX = parseInt(elem.parentNode.style.left);
      if (isNaN(cellX)) return null;
      var cellY = parseInt(elem.parentNode.style.top);
      if (isNaN(cellY)) return null;
      var gridX = parseInt(gridDom.style.left);
      if (isNaN(gridX)) continue;
      var gridY = parseInt(gridDom.style.top);
      if (isNaN(gridY)) continue;
      x += cellX + gridX;
      y += cellY + gridY;
    }
    var xDiff = Math.abs(baseX - x);
    var yDiff = Math.abs(baseY - y);
    if ((direction == "down" && y > baseY) || (direction == "up" && baseY > y)) {
      if (yDiff < curYDiff || (yDiff == curYDiff && xDiff < curXDiff)) {
        curElem = elems[i];
        curXDiff = xDiff;
        curYDiff = yDiff;
      }
    }
    if ((direction == "right" && x > baseX) || (direction == "left" && baseX > x)) {
      if (yDiff <=3 && xDiff < curXDiff) {
        curElem = elems[i];
        curXDiff = xDiff;
        curYDiff = yDiff;
      }
    }
  }

  if (curElem != null) {
    try {
      curElem.focus();
      if (pui["highlight on focus"]) curElem.select();
      setTimeout(function() {
        pui.returnCursor(null, curElem);
      }, 0);
    }
    catch(e) {}
  }
}


pui.fieldUpper = pui.formatUpper = function(fieldName) {
  if (fieldName == null) return "";
  if (pui.handler != null || pui.viewdesigner) return fieldName;
  else return fieldName.toUpperCase(); 
}


pui.doFieldExit = function(target) {

  if (!target.disabled && !target.readOnly) {
    if ( target.tagName == "TEXTAREA" 
       || (target.tagName == "INPUT" &&  ( target.type=="text" 
                                        || target.type=="number" 
                                        || target.type=="password"))) {
      var pos = target.cursorPosition;
      if (pui.touchDevice) {
         pos = getCursorPosition(target);
      }
      if (pos == null) return false;
      
      if (pos < 0) pos = 0;
      var value = target.value.substr(0, pos);
      if (target.rjZeroFill == true && target.maxLength != null) {
        while (value.length < target.maxLength) {
          value = "0" + value;
        }
      }
      target.value = value;
      target.modified = true;
    } 
  }  

  if (target.autoAdvance == true) {
    pui.keyName = "Enter";
    pui.click();
  }
  else {
    pui.goToNextElement(target);
  }
    
  return false;
}

pui.translate = function(parms) {
  
  // Translation map will always be sent from up-to-date backend.
  // Allow compatability with older backend for now. 
  var translationMap = parms["translations"];
  if (translationMap == null) {
    
    return;
    
  }
  
  // The map comes in UTF-16, hex encoded.
  for (var i in translationMap) {
    
    translationMap[i] = pui.formatting.decodeGraphic(translationMap[i]);
    
  }
  
  var msg = "";
  var layers = parms["layers"];
  
  for (var iLayer = 0; iLayer < layers.length; iLayer++) {
  
    var layer = layers[iLayer];
    var formats = layer["formats"];
    
    for (var iFmt = 0; iFmt < formats.length; iFmt++) {
      
      var format = formats[iFmt];
      var screen = format["metaData"]["screen"];
      var items = format["metaData"]["items"];
      
      msg += pui.doTranslate(screen, translationMap, true);
      
      for (var iItem = 0; iItem < items.length; iItem++) {
        
        var item = items[iItem];
        msg += pui.doTranslate(item, translationMap);
        
      }
      
    }    
    
  }
  
  if (msg != "") {
  
    return "Missing translation data:\n\n" + msg;
    
  }

}

pui.doTranslate = function(obj, translationMap, isScreen) {

  isScreen = (isScreen === true);
  
  var rtn = "";
  
  for (var propName in obj) {
    
    var propVal = obj[propName];
    
    if (pui.isTranslated(propVal)) {
      
      var phraseIds = propVal["translations"];
      var phrases = [];
      for (var i = 0; i < phraseIds.length; i++) {
        
        var id = phraseIds[i];
        // Id zero is reserved for blank/empty entry in 
        // list-type properties. 
        var phrase = (id == 0) ? "" : translationMap[id];
        if (phrase != null) {
          
          phrases.push(phrase);
          
        }
        else {
        
          var designValue = propVal["designValue"];
          if (phraseIds.length > 1) {
            
            designValue = JSON.parse(designValue)[i];
            
          }
          
          phrases.push(designValue);
          
          if (isScreen) {
            
            rtn += "Record format \"" + trim(obj["record format name"]) + "\" ";
            
          }
          else {
            
            rtn += "Widget \"" + trim(obj["id"]) + "\" ";
            
          }
          
          rtn += ", property \"" + trim(propName) + "\". ";
          rtn += "Phrase: " + designValue;
          rtn += " (" + id + ").\n";
        
        }
        
      }
      
      if (phrases.length == 1) {
        
        obj[propName] = phrases[0];  
        
      }
      else if (phrases.length > 1) {
      
        obj[propName] = JSON.stringify(phrases);
        
      }              
      
    }    
    
  }
  
  return rtn;
  
}
