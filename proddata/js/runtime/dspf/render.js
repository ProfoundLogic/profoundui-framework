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
pui.widgetsToCleanup = [];
pui.layoutsDisplayed = [];
pui.bypassValidation = "false";
pui.ddBypassValidation = "false";
pui.lastFormatName = null;
pui.placeCursorOnSubfile = false;
pui.iPadEmulation = false;
pui.iPhoneEmulation = false;
pui.columnSortResponseGrid = null;
pui.fieldNameSortResponseGrid = null;
pui.fileUploadElements = [];
pui.activeElement = null;
pui.autoPageGrid = false;
pui.currentFormatNames = [];
pui["no focus"] = false;
pui.restoreStyles = {};
pui.windowStack = null;
//Needed for assigning unique attribute to these layouts in background layers so their styles appear. Incremented in each ResponsiveLayout constructor.
pui.responsiveLayoutTracker = 0;

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
pui["loading animation"]["zIndex"] = 250;
pui["loading animation"]["css"] = 'pui-animation';

pui["auto tab"] = false;  // when the user reaches the end of the field, the cursor is automatically advanced to the next field
pui["enable arrow keys"] = false;
pui["horizontal auto arrange"] = false;
pui["buttons per row"] = 1;  //required when pui["horizontal auto arrange"] set to true

// Parent namespace for wikihelp functions, settings, and objects.
pui["wikihelp"] = {}; 

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
};

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
  "Clear": 0xBD,
  "Enter": 0xF1,
  "Alt-F1": 0xF3,               // Help Key
  "Help": 0xF3,
  "PageUp": 0xF4,
  "PageDown": 0xF5,
  "Print": 0xF6,
  "RecordBackspace": 0xF8,      // Not implemented
  "AutoEnter": 0x3F             // Not implemented
  
};


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
};


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
};


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
};


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
          var oRangeArr = oRange.split("-");
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
        var oRangeArr = oRange.split("-");
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

};


pui.cleanup = function() {

  pui.dummyBox = null;

  if (pui.oldRenderParms != null && pui.isPreview != true) {
    if (pui.oldRenderParms["layers"]) {
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
  
  if (typeof FusionCharts != "undefined")
    for (var i = 0; i < pui.chartsRendered.length; i++)      
      if (FusionCharts(pui.chartsRendered[i]))
        FusionCharts(pui.chartsRendered[i]).dispose();      
  pui.chartsRendered = [];
  
  for (var i = 0; i < pui.widgetsToCleanup.length; i++){
    var widget = pui.widgetsToCleanup[i];
    if (widget != null && typeof widget.destroy == "function") widget.destroy();
  }
  pui.widgetsToCleanup = [];
  
  for (var prop in pui.restoreStyles)
    document.body.style[prop] = pui.restoreStyles[prop];
  pui.restoreStyles = {};
  
  pui.killFrames();
  
};


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
};


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
};


pui.render = function(parms) {
  
  if (typeof pui["beforeRender"] === "function") {
    var rv = pui["beforeRender"](parms);
    if (rv) parms = rv;
  }

  if (parms["pjsVersion"] != null) {
    pui.pjsVersion = parms["pjsVersion"];
  }

  pui.nodejs = (parms["nodejs"] === true);
  pui.ejsData = null;
  
  if (parms["version"] != null && pui["version"] != null && parms["version"] != pui["version"]) {
    var msg = null;
    var parmVersion = parms["version"].split('.');
    var parmBaseVersion = parmVersion.shift();
    var parmFixPack = parmVersion.join('.');
    if (parms["nodejs"]) {
      if (pui["version"] < parms["version"]) {  // nodejs sends min version
        msg = "Installed copy of Profound.js requires Profound UI client-side Version " + parmBaseVersion + ', Fix Pack ' + parmFixPack + " or above. Profound UI client-side version is Version " + pui["baseVersion"] + ', Fix Pack ' + pui["fixPackVersion"] + ".";
      }
    } 
    else {
      msg = "Profound UI server-side (Version " + parmBaseVersion + ', Fix Pack '+ parmFixPack + ") doesn't match client-side JavaScript (Version " + pui["baseVersion"] + ', Fix Pack '+ pui["fixPackVersion"] + ")";
    }
    if (msg != null && window.console && window.console.error) {
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
    pui.screenIsReady = true; //Allow Atrium tabs to be closed when there is an Unrecoverable Error.
    return;
  }

  if (parms["closeTab"] == true && window.parent != window && pui.checkForAtrium(window.parent)) {
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
  if (!parms["message"]) pui["layers"] = parms["layers"];
  if (parms["ctrlJob"] != null) {
    if (pui["ctrlJob"] == null) pui["ctrlJob"] = {};
    for (var prop in parms["ctrlJob"]) {
      pui["ctrlJob"][prop] = parms["ctrlJob"][prop];
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
  if (pui["isCloud"]) {
    pui.confirmOnClose = false;
  }
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
  
  if (parms["message"]) {
    var format = parms["message"]["format"].toLowerCase();
    pui["message"] = parms["message"]["message"];
    pui.resetResponseValues();    
    pui.hideWaitAnimation();
    if (pui.onmessageProps && pui.onmessageProps[format]) {
      try {
        eval('var message = pui["message"];');
        eval(pui.onmessageProps[format]);
      }
      catch(err) {
        pui.scriptError(err, "Onmessage Error:\n");
      }      
    }
    return;
  }
  
  if (parms["html"]) {
    // Render html
    parms.container.innerHTML = parms["html"];
    parms.container.style.width = "100%";
    if (pui.genie && pui.genie.middleDiv != null) pui.genie.middleDiv.style.width = "100%";
    // Evaluate any <script> tags in the html
    var scripts = parms.container.getElementsByTagName("script");
    
    function loadScript(idx) {
      var script = scripts[idx];
      if (script == null) return;

      if (script.innerHTML) {
        var js = script.innerHTML;
        eval.call(window, js);
        loadScript(idx + 1);
      }
      else {
        pui["loadJS"]({
          "path": script.src,
          "callback": function() {
            loadScript(idx + 1);
          },
          "onerror": function() {
            loadScript(idx + 1);
          }
        });
      }
    }
    loadScript(0);
    
    pui.screenIsReady = true;
    pui.isHtml = true;
    
    return;
  }
  else {
    pui.isHtml = false;
  }
  if (pui.isPreview !== true && pui.canvasSize == null) parms.container.style.width = "";
  if (pui.genie && pui.genie.middleDiv != null) pui.genie.middleDiv.style.width = "";

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
  
  // Prevent overlays from persisting incorrectly between screens by removing
  // existing elements on each render.
  if( pui["wikihelp"]["overlays"] != null ) {
    while(pui["wikihelp"]["overlays"].length > 0) {
      var overlay = pui["wikihelp"]["overlays"].pop();
      if( overlay.parentNode != null && typeof overlay.parentNode.removeChild == "function")
        overlay.parentNode.removeChild(overlay);
      // Try to delete the extra object from the node. IE<8 can't delete it, so catch.
      try{ delete overlay["pui"];}
      catch(ex){}
      overlay = null;
    }
  }
  // Create a list to allow finding, hiding, and showing wiki-help overlays.
  pui["wikihelp"]["overlays"] = [];

  pui.windowStack = [];
  
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
    pui.widgetsToCleanup = [];
    pui.layoutsDisplayed = [];
    pui.fileUploadElements = [];
    pui.onmessageProps = {};

    var formats = layers[i].formats;
    if (i == 0) {
      pui.lastWindow = null;
      pui.lastWindowLeft = null;
      pui.lastWindowTop = null;
      var animation = null;
      if (formats.length > 0 && formats[0].metaData != null && formats[0].metaData.screen != null ){
        animation = pui.evalBoundProperty(formats[0].metaData.screen["animation"], formats[0].data, formats[0].ref);
      }
      if (parms.transition && parms.transition["animation"]) {
        animation = parms.transition["animation"];
      }
      if (typeof animation === "string") {
        animation = animation.trim();
        if (animation === "") animation = null;
      }
      if (pui.canvasSize || parms.designMode || pui.genie != null) animation = null;
      if (animation) {
        pui.hideWaitAnimation();
        var setupObj =  {
          container: parms.container,
          animation: animation,
          animatedScreenProperty: pui.evalBoundProperty(formats[0].metaData.screen["animated screen"], formats[0].data, formats[0].ref),
          overlay: pui.evalBoundProperty(formats[0].metaData.screen["overlay screens"], formats[0].data, formats[0].ref)
        };
        if (parms.transition && parms.transition["animation"]) {
          setupObj.animatedScreenProperty = parms.transition["screen"];
          setupObj.overlay = parms.transition["overlay"];
        }
        parms.container = pui.transitionAnimation.setup(setupObj);
        pui.runtimeContainer = parms.container;
      }
      else {
        pui.transitionAnimation.cleanup();
        parms.container.innerHTML = "";
      }
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
    pui.currentFormatNames = [];
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
    
    pui.windowStack.push(parms.container);
    
  }
  
  if (animation) pui.transitionAnimation.animate();

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
          else if (pui.cursorValues.noFocus != "no focus on page") {
            try {
              pui.focusField.dom.focus();
              if (pui.focusField.dom.tagName != "SELECT" && pui.focusField.dom.type != "checkbox" && pui.focusField.dom.type != "radio") {
                if (pui["is_old_ie"]) {
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

  pui.screenIsReady = true;

  pui.setupGridsDisplayedScrollBar();
  
  if (pui.observed != null) pui.observed.update();

  // Does nothing if in design mode or break messages aren't enabled.
  pui["breakMessagesInit"]();
};

/**
 * Setup scrollbars for grids displayed. This should happen after all formats are rendered and
 * grids are displayed. renderFormat will call this again to setup scrollbars for grids added lazily.
 * @returns {undefined}
 */
pui.setupGridsDisplayedScrollBar = function(){
  for (var i = 0; i < pui.gridsDisplayed.length; i++) {
    var grid = pui.gridsDisplayed[i];
    if (grid.scrollbarObj != null && !grid.scrollBarsSetupAfterRender) {
      if (grid.scrollbarObj.attachOnScroll != null && typeof grid.scrollbarObj.attachOnScroll == "function") {
        grid.scrollbarObj.attachOnScroll();
      }
      grid.scrollbarObj.ready = true;
      if (grid.scrollbarObj.rowsPerPage == 1) grid.scrollbarObj.draw();
      //Needed so grids in lazy-load layouts are processed, but no grids are processed twice.
      grid.scrollBarsSetupAfterRender = true;
    }
  }
};

/**
 * Render a record format, items in a grid row, or items inside a lazily-loaded layout.
 * This gets called once by pui.render for a record format, and it can be called again by a Grid or Layout.
 * Some code runs for either of those cases; some should only run for one of those cases.
 * When called by lazy layouts, most of the code should behave the same as when called by pui.render().
 * @param {Object} parms
 * @returns {undefined}
 */
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
  var ctlErrors = [];
  var ctlErrorMap = {};
  
  // Detect when code should only run if renderFormat is called for the record format (not grid or layout).
  var isMainFormat = parms.rowNum == null && parms.lazyContainerNum == null;

  if (pui["controller"] != null && screenProperties != null) {
    
    var suffix = "";
    var cnt = 1;
    var propname = "error condition";
    while (screenProperties[propname + suffix]) {
      
      var condition = pui.evalBoundProperty(screenProperties[propname + suffix], data);
      if (condition == "1") {
        
        var msg = pui.evalBoundProperty(screenProperties["error message" + suffix], data);
        ctlErrors.push({"msg": msg});
        break;
        
      }
      suffix = " " + (++cnt);
      
    }
    
  }
  
  if (!isDesignMode && parms.subfileRow == null && parms.lazyContainerNum == null) {
    pui.currentFormatNames.push(formatName);
  }
  
  if (screenProperties != null) {
    if (pui.evalBoundProperty(screenProperties["show as window"], data, parms.ref) == "true") isWin = true;
    if (screenProperties["window reference"] != null && screenProperties["window reference"] != "") isWin = true;
  }
  
  // Setup cursor and bypass validation.
  if (!isDesignMode && isMainFormat) {
    pui.keyMap[formatName] = {};
    var obj = parms.metaData.screen["return cursor record"];
    if (pui.isBound(obj)) pui.cursorFields.record = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["return cursor field"];
    if (pui.isBound(obj)) pui.cursorFields.field = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["return cursor position"];
    if (pui.isBound(obj)) pui.cursorFields.position = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["return cursor row"];
    if (pui.isBound(obj)) pui.cursorFields.row = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["return cursor column"];    
    if (pui.isBound(obj)) pui.cursorFields.column = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["changed"];
    if (pui.isBound(obj)) pui.changedFields[formatName] = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["window left"];
    if (pui.isBound(obj)) pui.windowLeftField = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["window top"];
    if (pui.isBound(obj)) pui.windowTopField = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["valid command key"];
    if (pui.isBound(obj)) pui.validCommandKeyField = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(obj["fieldName"]);
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
      pui.setOffFields.push(formatName + "." + pui.fieldUpper(obj["fieldName"]));
      idx++;
      obj = parms.metaData.screen["set off " + idx];
    }
    
    pui.ddBypassValidation = pui.evalBoundProperty(screenProperties["bypass validation"], data, parms.ref);
    
    pui.cursorValues.setRow = pui.evalBoundProperty(screenProperties["set cursor row"], data, parms.ref);
    pui.cursorValues.setColumn = pui.evalBoundProperty(screenProperties["set cursor column"], data, parms.ref);
    pui.cursorValues.noFocus = pui.evalBoundProperty(screenProperties["no focus"], data, parms.ref);
    if (pui.cursorValues.noFocus == "true") pui.cursorValues.noFocus = true;
    if (pui["no focus"] == "true" || pui["no focus"] == true) pui.cursorValues.noFocus = true;
    if (pui.isBound(screenProperties["set cursor condition"])) {
      var setCursor = pui.evalBoundProperty(screenProperties["set cursor condition"], data, parms.ref);
      if (setCursor != true && setCursor != "true") {
        pui.cursorValues.setRow = null;
        pui.cursorValues.setColumn = null;
      }
    }
  }
  
  // set record format level properties in Designer.
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
  
  if (!isDesignMode && isMainFormat) {
    if (pui.evalBoundProperty(screenProperties["disable enter key"], data, parms.ref) == "true") {
      pui.disableEnter = true;
    }
  } 	
  
  // process items
  var namedModel = getPropertiesNamedModel();
  var tabPanels = [];
  var activeTabs = [];  
  var gridsToRender = [];
  var lazyLayouts = {};   //Collection of layouts whose contents load later. key: DOM ID of layout;
    // value: when value is a pui.Layout, then it is a lazy-loaded layout being rendered on this pass.
    //  when value is an object like {root: a pui.Layout, container: n }, then this is a container that 
    //  is inside the lazy layout, and this container will be rendered on a later pass.
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
    
    // "export file name" property replaced "csv file name"; this supports files using older property.
    if(items[i]["csv file name"] != null && items[i]["export file name"] == null)
      items[i]["export file name"] = items[i]["csv file name"];
  
    // Detect the item's container: a grid or layout.
    var gridObj = null;
    var container = null;
    var gridId = items[i].grid;
    var layoutId = items[i]["layout"];
    if (gridId != null) {  // item belongs to a grid. Note: in parms.items, grid must come before its items; else, item won't render in grid.
      var gridDom = getObj(gridId);
      if (gridDom != null) {
        gridObj = gridDom.grid;
        var colNum = Number(items[i].column);
        if (items[i]["columnId"] == undefined) items[i]["columnId"] = colNum;
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
      else if ( lazyLayouts[gridId] != null ){
        // The item is inside a grid that is a child of a lazy layout.
        saveItemForLazyLoad(gridId);
        continue;
      }
    }
    else if (layoutId != null) {
      var layoutDom = getObj(layoutId);
      // The layout must already exist in the DOM; otherwise, the item goes into the main container.
      // (Meaning, the parms.items object must place the layouts before items that reference them.)
      if (layoutDom != null && layoutDom.layout != null) {
        var containerNumber = Number(items[i]["container"]);
        
        // The item is within a lazy-load layout.
        if ( lazyLayouts[layoutId] != null ){
          saveItemForLazyLoad(layoutId, containerNumber);
          continue;
        }
        else {
          // The item is in a non-lazy layout.
          container = layoutDom.layout.containers[containerNumber - 1];
        }
      }
      else if ( lazyLayouts[layoutId] != null ){
        // The item is inside a layout that is a child of a lazy layout.
        saveItemForLazyLoad(layoutId);
        continue;
      }
    }
    // Save an item to render later when a lazy-load layout contains it (directly or indirectly).
    // If the item is directly in a layout being rendered on this pass, then contNum parameter must be set.
    function saveItemForLazyLoad(containerId, contNum){
      var lazylayout;
      // The item is in a container (grid/layout) that is in a lazy-layout.
      if (lazyLayouts[containerId].root != null && lazyLayouts[containerId].container != null){
        lazylayout = lazyLayouts[containerId].root;
        contNum = lazyLayouts[containerId].container;
      }else{
        // The item is directly in a lazy-layout. (contNum parameter must be set.)
        lazylayout = lazyLayouts[containerId];
      }
      
      lazylayout.deferLazyChild( contNum - 1, items[i]);  //Save for later.
      
      // If this item can contain other items, then this allows this item's items to be deferred.
      if (items[i]["field type"] == "layout" || items[i]["field type"] == "grid"){
        lazyLayouts[items[i]["id"]] = { root: lazylayout, container: contNum };
      }
    }
    
    // If the item wasn't in a grid or layout, set its container to the canvas or a parameter.
    if (container == null) {
      if (isDesignMode) container = designer.container;
      else container = parms.container;
    }
    
    // Create dom element for item.
    var dom;
    if (!isDesignMode && parms.subfileRow != null && items[i].domEls != null && items[i].domEls[parms.subfileRow-1] != null) {
      // Item is already created inside a grid, so use that element.
      dom = items[i].domEls[parms.subfileRow-1];
      if (container != null) {
        container.appendChild(dom);
        if (dom.redisplay == true) {
          dom.style.display = "";
          dom.redisplay = false;
        }
        if (dom.calimg != null) {
          container.appendChild(dom.calimg);
          if (dom.calimg.needsToBeMoved) {
        	  pui.moveCal(dom);
          }
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

        if (dom.highlighted === true) {
          pui.dehighlightText(dom);
          dom.highlighted = false;
        }

        if (parms.highlighting != null && parms.highlighting.text != "" && String(items[i]["column"]) === String(parms.highlighting.col)) {
          if (dom.tagName == "DIV") {  
            pui.highlightText(dom, parms.highlighting.text);
            dom.highlighted = true;
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
        if (items[i].insertBeforeObj != null) {
          container.insertBefore(dom, items[i].insertBeforeObj);
        }
        else {
          container.appendChild(dom);
        }
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
      
      // get properties for the item and put them into the "properties" object.
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
            if (propValue["longName"] && propValue.fieldName) {
              if (!propValue["lowerCaseField"] && pui.handler == null) {
                pui.longFieldNameTable[pui.fieldUpper(propValue["longName"])] =  pui.fieldUpper(propValue.fieldName);
                pui.longFieldNameTable[pui.fieldUpper(propValue.fieldName)] = pui.fieldUpper(propValue["longName"]);
              } else {
                pui.longFieldNameTable[propValue["longName"]] =  propValue.fieldName;
                pui.longFieldNameTable[propValue.fieldName] = propValue["longName"];
              }
            }

            if ( prop == "row background" && items[i]["field type"] == "grid" ){
              // The grid's "row background" property is a per-record field; it can be different per record. So `data` won't contain an entry for the "row background"
              // field. To avoid letting an indicator's off-value become the color for each row, this must be a blank string. Issue 4775.
              newValue = "";
            }else{
              newValue = pui.evalBoundProperty(propValue, data, parms.ref);
            }

            if (prop == "value" || prop == "html") {
              // assign cursor record and field
              dom.cursorRecord = formatName;
              dom.cursorField = pui.fieldUpper(propValue.fieldName);
              
              if (dom["pui"] == null ) dom["pui"] = {};   //Expose field and format for custom widgets. #3440.
              dom["pui"]["formatName"] = formatName;
              dom["pui"]["fieldName"] = dom.cursorField;
              
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
            if (prop == "field name sort response") {
              dom.fieldNameSortResponseField = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(propValue.fieldName);
            }
            if (prop == "subfile changed") {
              pui.subfileChangedFields[properties["record format name"]["toLowerCase"]()] = pui.fieldUpper(propValue.fieldName);
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
  
      // Retain information about tab panels, tab-layouts and their active tabs.
      if (properties["field type"] == "tab panel" || (properties["field type"] == "layout" && properties["template"] == "tab panel")) {
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

              if (pui["is_touch"] && !pui["is_mouse_capable"] && propname == "value" && properties["field type"] == "textbox" && formattingObj["formatting"] == "Number") {
              
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

                  dom.type = "number";  //Field uses numeric keyboard in Android.
                  //Note: iOS could show a number-only keyboard when .pattern="[0-9]*"; but that keyboard
                  //has no "-", and Y format allows "-". The iOS keyboard  has numbers and characters.
                  
                  //Browsers do not respect the maxlength attribute when input type="number"; so enforce the length manually. #3582.
                  if (formattingObj["maxLength"] > 0){
                    //Note: if the input were invalid (NaN), the .value property would be ""; so the length could not be
                    //checked. Prevent a trailing dash from invalidating the value, and length enforcement still works.
                    //Soft and hardware backspace keys do not fire textInput events.
                    addEvent(dom, "textInput", function(e){
                      var target = getTarget(e);
                      if (target == null || target.value == null) return;
                      //When the field is empty, .value is "" and validity.valid is true. Allow dash. When validity.valid 
                      //is false, then the field is not empty. Prevent, because another dash would not make it valid.
                      //If the field is not empty and is valid, a trailing dash would invalidate. Deny.
                      if (e.data == "-" && target["validity"] != null
                      && ((target.value != "" && target["validity"].valid ) || !target["validity"].valid) ){
                        preventEvent(e);
                      }
                      //Prevent field from becoming too long.
                      else if (target.maxLength > 0 && target.value.length >= target.maxLength)
                        preventEvent(e);
                    });
                  } //endif maxLength > 0.
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
                var fieldName = pui.fieldUpper(formattingObj.fieldName);
                var qualField = formatName + "." + fieldName;
                if (pui.handler != null) qualField = fieldName;
                if (parms.subfileRow != null) {
                  qualField += "." + (parms.subfileRow);
                }
                if (pui.dupElements[qualField] == null) pui.dupElements[qualField] = [];
                pui.dupElements[qualField].push(dom);
              }

              if (pui.isInputCapableProperty(propname, dom)) {
                
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
                    newDom.extraDomEls = dom.extraDomEls;
                    newDom.labelObj = dom.labelObj;
                    newDom.modified = dom.modified;
                    newDom.disabled = dom.disabled;
                    dom.parentNode.replaceChild(newDom, dom);
                    newDom.checked = dom.checked;
                    newDom.parentTabPanel = dom.parentTabPanel ;
                    newDom.parentTab = dom.parentTab;                    
                    newDom.onblur = dom.onblur;
                    newDom.onchange = dom.onchange;
                    newDom.oninput = dom.oninput;
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
                    newDom["pui"] = dom["pui"];
                    dom = newDom;                    
                  }
                  dom["radioValue"] = properties["value"];
                }
                
                if (pui.responseElements[qualField] == null) pui.responseElements[qualField] = [];

                // When widget in a subfile is changed with setDataValue() prior to rendering
                // the element, there will be an entry in pui.responseElements with "modifiedBeforeRender" set.
                // Now that we are actually rendering the element, we replace that entry with the proper DOM element.
                if (pui.responseElements[qualField][0] != null && pui.responseElements[qualField][0].modifiedBeforeRender) {
                  pui.responseElements[qualField] = [];
                  dom.modified = true;
                  pui.modified = true;
                }
                
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
                  dom["fileUpload"].qualField = qualField;
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

            if (propname == "row font color" && properties["field type"] == "grid") {
              if (pui.isBound(items[i][propname])) {
                dom.grid.rowFontColorField = items[i][propname];
              }
            }

            if (propname == "row background" && properties["field type"] == "grid") {
              if (pui.isBound(items[i][propname])) {
                dom.grid.rowBackgroundField = items[i][propname];
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
              if (dom["pui"]["properties"]["field type"] === "combo box") {
                var box = dom.comboBoxWidget.getBox();
                box.focusClass = trim(propValue);
                addEvent(box, "focus", pui.applyFocusClass);
                addEvent(box, "blur", pui.removeFocusClass);
              } else {
                dom.focusClass = trim(propValue);
                addEvent(dom, "focus", pui.applyFocusClass);
                addEvent(dom, "blur", pui.removeFocusClass);
              }
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
              addEvent(boxDom, "keyup", pui.autoAdvanceOnKeyUp);
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
            var allowFieldExit = false;
            if (( pui["always allow field exit"] == true || pui["always allow field exit"]=="true" )
                && ( properties["field type"] == "combo box"
                  || properties["field type"] == "date field"
                  || properties["field type"] == "spinner"
                  || properties["field type"] == "textbox" ) ) {
              allowFieldExit = true;
            }
            if (propname == "allow field exit" && propValue == "true") {
              allowFieldExit = true;
            }
            if (allowFieldExit == true) {
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
              var boxValue;
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
					if (shortcutKey != null)
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
        
        if (parms.highlighting != null && parms.highlighting.text != "" && String(properties["column"]) === String(parms.highlighting.col)) {
          if (dom.tagName == "DIV") {  
            pui.highlightText(dom, parms.highlighting.text);
            dom.highlighted = true;
          }
        }
        
        if (pui["controller"] != null && propname.indexOf("error condition") == 0 && propValue == "1" && !ctlErrorMap[dom.id]) {
          
          var suffix = "";
          if (propname.length > "error condition".length) {
            
            suffix = " " + parseInt(propname.substr("error condition".length), 10);
            
          }
          var msg = properties["error message" + suffix];
          ctlErrors.push({"id": dom.id, "msg": msg});
          ctlErrorMap[dom.id] = true;
          
        }
        
      } //done processing each in properties.

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
        if (properties["field type"] == "combo box" || properties["field type"] == "date field" || properties["field type"] == "spinner" || properties["field type"] == "textbox" || properties["field type"] == "password field" || properties["field type"] == "checkbox") {
          var boxDom = dom;
          if (dom.comboBoxWidget != null) boxDom = dom.comboBoxWidget.getBox();
          addEvent(boxDom, "keydown", function(event) {
            event = event || window.event;
            var target = getTarget(event);
            if (target.autoComp && target.autoComp.isOpen())
              return;
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
        var crow = properties["cursor row"];
        if (dom.parentNode && dom.parentNode.parentNode && dom.parentNode.parentNode.grid) {
          var adj = parseInt(crow, 10);
          if (dom.parentNode.parentNode.grid.hasHeader) {
            adj += dom.parentNode.row - 1;
          }  
          else {
            adj += dom.parentNode.row;
          }
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
          if (dom.comboBoxWidget != null) {
            dom.comboBoxWidget.formatName = formatName;
            boxDom = dom.comboBoxWidget.getBox();
          }
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
            if (event.ctrlKey && key != 88 && key != 86) return;  // all ctrl keys except Ctrl-X & Ctrl-V
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
              //Apply key filter to handle Android virtual keyboard keys, which don't always fire "keypress". Issue 3582.
              if (dom.type == "number" && dom.formattingInfo["noExtraSpaces"] ){
                addEvent(boxDom, "textInput", function(e) {
                  e = e || window.event;
                  if(!keyFilter.test(e.data))
                    preventEvent(e);
                });
              }
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
            
            // If the SELECT box is in a subfile and browser is Firefox, then the pgup/pgdn
            // keys would change the value and also page the grid; this behavior is confusing. (See Issue 2556.)
            // So prevent the grid from paging in Firefox. preventEvent stops the key event bubbling
            // up to the grid. This forces the user to focus outside the SELECT in order to page.
            if( parms.subfileRow > 0 && pui["is_firefox"] ){
              addEvent(dom, "keydown", function(e){
                e = e || window.event;
                if(e.keyCode == 33 || e.keyCode == 34){
                  preventEvent(e);
                }
              });
            }
          }
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
        // A list of layouts to be destroyed when pui.cleanup is called.
        pui.layoutsDisplayed.push(dom.layout);
        // Items in lazy-loaded layouts will render later. Store the format's fields and data
        // in case any of the items need them.
        if (properties["lazy load"] == "true" && typeof dom.layout.saveFormat == "function" ){
          lazyLayouts[ properties["id"] ] = dom.layout;
          dom.layout.saveFormat( parms );
        }
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
        dom.grid.sflrcdnbr = recNum;
        if (isNaN(recNum)) { 
          recNum = 1;
          dom.grid.sflrcdnbr = 0;
        }
        if (recNum < 1 || recNum > 9999) {
          recNum = 1;
          dom.grid.sflrcdnbr = 0;
        }
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
    
    if (!isDesignMode && gridObj != null && !gridObj["expanded"]) {
    
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
    var errors;
    if (pui["controller"] != null && ctlErrors.length > 0) {
      errors = ctlErrors;
    }
    else {
      errors = parms["errors"];
    }
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

  // set active tabs on tab panels and tab layouts.
  for (var i = 0; i < tabPanels.length; i++) {
    var tabElem = document.getElementById(tabPanels[i]);
    var tabPanel = tabElem.tabPanel;
    if (!tabPanel){
      tabPanel = tabElem.tabLayout;
    }
    if (tabPanel){
      if (activeTabs[i]) tabPanel.selectedTab = activeTabs[i];
      tabPanel.selectedTabChanged();  //Re draws the tabs.
    }
  }

  if (isDesignMode) {
    for (var i = 0; i < designer.grids.length; i++) {
      designer.grids[i].dom.grid.doExpandToLayout(true);
    }
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
      grid.scrollbarObj.setScrollTopToRow(grid.recNum, true);
    }
    if (pui.placeCursorOnSubfile && pui.cursorValues.setColumn == null && pui.cursorValues.setRow == null) {
      if (pui.focusField == null || pui.focusField.setFocusFlag != true) {
        setTimeout(function() {
          grid.placeCursor(true);
        }, 1);
      }
    }
    if (grid.scrollbarObj != null) {
      if (!isDesignMode && grid.scrollbarObj.type == "sliding" && grid.scrollbarObj.rowsPerPage == 1) {
        grid.scrollbarObj.draw();
      }
      // Paging scrollbar needs the PageUp/PageDown keys to be in the KeyMap so
      //  the handleHotKey routine can used to page up/down on scrollbar events.
      //  PagingBar handles those keys for Genie and GenieHandler. ???
      if (!isDesignMode && typeof screenProperties["record format name"] === "string"
        && grid.scrollbarObj.type == "paging" ) {
        var formatName = screenProperties["record format name"];
        var formatNameUC = pui.formatUpper(formatName);
        // It is possible for formatName to be lowercase; it comes from format.metaData.screen,
        // whereas the fieldname in pui.keyMap comes from format.name, which seems to stay in caps.
        if( pui.keyMap[formatName] == null && pui.keyMap[formatNameUC] != null )
          formatName = formatNameUC;

        if (pui.keyMap[formatName] != null ){
          if (pui.keyMap[formatName]["PageDown"] == null) {
            pui.keyMap[formatName]["PageDown"] = [];
            pui.keyMap[formatName]["PageDown"].push(grid.pagingBar.nextLink);
            grid.pagingBar.pageDownHotKeyDefined = true;
          }
          if (pui.keyMap[formatName]["PageUp"] == null) {
            pui.keyMap[formatName]["PageUp"] = [];
            pui.keyMap[formatName]["PageUp"].push(grid.pagingBar.prevLink);
            grid.pagingBar.pageUpHotKeyDefined = true;
          }
        }
      }
    }
    grid.makeSortable();
    grid.restoreState();
  }
  
  // Render the items inside the lazy-loaded layouts' currently visible container if it wasn't already rendered.
  // (Needed by accordions. tabPanel.selectedTabChanged causes a tab layout's items to render before this.)
  for (var layoutid in lazyLayouts ){
    if (typeof lazyLayouts[layoutid].renderItems == "function"){
      lazyLayouts[layoutid].renderItems();
    }
  }
  
  if (!isDesignMode) {

    // execute global onload event
    if (pui["onload"] != null && typeof pui["onload"] == "function" && isMainFormat && parms.runOnload !== false && !pui.usingGenieHandler) {
      pui["onload"](parms);
    }

    // execute format's onload event & onmessage event / save onsubmit event
    if (screenProperties != null) {
      if (parms.runOnload !== false) {
        var onloadProp = screenProperties["onload"];
        if (onloadProp != null && onloadProp != "") {
          try {
            eval('var format = "' + screenProperties["record format name"] + '";');
            eval('var file = "' + parms.file + '";');
            eval(onloadProp);
          }
          catch(err) {
            pui.scriptError(err, "Onload Error:\n");
          }
        }
      }
      pui.onsubmitProp = screenProperties["onsubmit"];
      if (screenProperties["onmessage"] && typeof screenProperties["record format name"] === "string") {
        pui.onmessageProps[screenProperties["record format name"].toLowerCase()] = screenProperties["onmessage"];  // save for display.screen.executeMessage() API

        if (parms["msgInfo"] != null && isMainFormat && parms.runOnload !== false && !pui.usingGenieHandler) {
          pui["message"] = parms["msgInfo"];
          try {
            eval('var message = pui["message"];');
            eval(screenProperties["onmessage"]);
          }
          catch(err) {
            pui.scriptError(err, "Onmessage Error:\n");
          }          
        }

      }
    }
    
    if ( parms.lazyContainerNum != null ){
      if (pui.screenIsReady){
        // This layout loaded after pui.render() finished, so new grids need scrollbars setup here.
        pui.setupGridsDisplayedScrollBar();
      }

      // A container inside a lazy-loaded layout has just been rendered, so fire an event.
      if ( parms.onlazyload != null ){
        try{
          eval('var lazyContainerNum = "'+parms.lazyContainerNum+'";');
          eval(parms.onlazyload);
        }
        catch(err){
          pui.scriptError(err, "OnLazyLoad Error:\n");
        }
      }
    }
  }
};


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
    
    var doms = [];
    if (dom.shortcutKey != null) {
      // If this is a grid paging bar item, do not pickup doms with matching shortcut key in other grids.
      // This allows paging controls for grids in same control format to function independently of one another.
      if (dom.parentPagingBar){
        doms.push(dom);
      }
      
      for (var formatName in pui.keyMap) {
        var keyMapDomArray = pui.keyMap[formatName][pui.keyName];
        if (keyMapDomArray != null) {
          for (var i = 0; i < keyMapDomArray.length; i++) {
            if (!keyMapDomArray[i].parentPagingBar){    //Push if this item isn't in a grid. See issue 4807.
              doms.push(keyMapDomArray[i]);
            }
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
    
    pui.destURL = null;
    pui.destParams = null;
    pui.destBookmarkable = null;
    pui.destRedirect = null;    
    
    if (dom.pui && dom.pui.properties && dom.pui.properties["destination url"]) {
      
      var props = dom.pui.properties;
      
      pui.destURL = props["destination url"];
      pui.destBookmarkable = (!props["bookmarkable"] || props["bookmarkable"] == "true");
      pui.destRedirect = (props["redirect to destination"] == "true");
      pui.destParams = [];

      var suffix = 1;
      var prop1 = "destination parameter name";
      var prop2 = "destination parameter value";          
      while (props[prop1]) {
        
        pui.destParams.push([props[prop1], props[prop2]]);
        prop1 = "destination parameter name " + (++suffix);
        prop2 = "destination parameter value " + suffix;
        
      }
      
    }    

    var returnVal = pui.respond();
    
    pui.destURL = null;
    pui.destParams = null;
    pui.destBookmarkable = null;
    pui.destRedirect = null;     
    
    if (returnVal == false) {
      for (var i = 0; i < doms.length; i++) {
        doms[i].responseValue = "0";
      }
      pui.bypassValidation = "false";
    }    
  }
  addEvent(dom, "click", clickEvent);
};


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
      if (!tip.doneShowing) {
        pui.addCssClass(tipBox, tip.getInvalidClass());
        tip.setMessage(msg); 
        tip.show(3000, true);
      }
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
          if (setFocusField) {
            pui.focusField.dom = dom;
            pui.focusField.setFocusFlag = true;
          }
          else {
            dom.focus();
            if (pui["highlight on focus"]) dom.select();
          }
          if (!tip.doneShowing) dom.validationTip.show();
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

};

pui.respond = function() {

  if (pui.observer != null) return false;

  //if (!pui.screenIsReady) {
  if (pui["isServerBusy"]()) {
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

  hide_calendar();

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
      pui.scriptError(err, "Onsubmit Error:\n");
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
  if (!uploading) {
    pui["haltFrames"]();
    pui.submitResponse(response);
  }
 
  return true;
};

pui.buildResponse = function() {
    
  var response = {};

  for (var fieldName in pui.changeResponseElements) {
    var domArr = pui.changeResponseElements[fieldName];
    for (var i = 0; i < domArr.length; i++) {
      var dom = domArr[i];
      if (dom.modified && (pui["controller"] != null || pui.bypassValidation != "true")) {
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
    
    // If it's a 'radio button' control we want to change the 
    //  'dom' entry to the 'modified' one, if any.
    if (dom.type == "radio") {
    	for (var j = 0; j < doms.length; j++) {
    		var radioDom = doms[j];
    		if (radioDom.modified) {
    			dom = radioDom;
    			break;
    		}
    	}    
    }
    
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
      // handle same response variable bound to multiple menus. (Note: dom.pui could be null if grid setDataValue created the domEl. Issue 3034.)
      else if (dom.responseValue == "" && dom.pui != null && dom.pui.properties["field type"] == "menu" && doms.length > 1) {
        for (var i = 1; i < doms.length; i++) {
          if (doms[i].responseValue != "") {
            value = doms[i].responseValue;
            break;
          }
        }
      }
      
      // When an element is modified by setDataValue, but never modified
      // by normal means (i.e. modified before rendering) we need to set 
      // it in the rrnTracker, etc.
      
      if (dom.modifiedBeforeRender) {
        var splitName = fieldName.split(".");
        var sflName = splitName[0];
        var subfileRow = parseInt(splitName[splitName.length-1]);
        if (!isNaN(subfileRow) && subfileRow > 0) {
          var rrnName = sflName + ".rrn";
          var trackerName = rrnName + "=" + subfileRow;
          if (pui.rrnTracker[trackerName] != true) {            
            if (response[rrnName] == null) response[rrnName] = [];
            response[rrnName].push(subfileRow);
            pui.rrnTracker[trackerName] = true;
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
          response.errors.push({ dom: boxDom, msg: pui["getLanguageText"]("runtimeMsg", "ME") });
          if (boxDom.validationTip!=null && boxDom.validationTip.doneShowing!=null) boxDom.validationTip.doneShowing=false;
          continue;
        }
        if (dom.MF == true && dom.modified == true && boxDom.maxLength != null && boxDom.value != null && (boxDom.maxLength != boxDom.value.length || boxDom.value === boxDom.emptyText)) {
          response.valid = false;
          if (response.errors == null) response.errors = [];
          response.errors.push({ dom: boxDom, msg: pui["getLanguageText"]("runtimeMsg", "MF") });
          if (boxDom.validationTip!=null && boxDom.validationTip.doneShowing!=null) boxDom.validationTip.doneShowing=false;
          continue;
        }
      }
      if (pui.bypassValidation != "true" && pui.bypassValidation != "send data" && dom.puirequired == true && !dom.disabled) {
        if ( (typeof boxDom.value == "string" && (trim(boxDom.value) == "" || boxDom.value === boxDom.emptyText)) ||
             (dom["fileUpload"] != null && dom["fileUpload"].getCount() < 1) ) {
          response.valid = false;
          if (response.errors == null) response.errors = [];
          var msg = pui["getLanguageText"]("runtimeMsg", "required");
          if (dom["fileUpload"] != null) msg = pui["getLanguageText"]("runtimeMsg", "file required");
          response.errors.push({ dom: boxDom, msg: msg });
          if (boxDom.validationTip!=null && boxDom.validationTip.doneShowing!=null) boxDom.validationTip.doneShowing=false;
          continue;
        }
      }
      if (dom["fileUpload"] != null && pui.bypassValidation != "true" && pui.bypassValidation != "send data") {
        var msg = dom["fileUpload"].validateCount();
        if (msg == null) {
          msg = dom["fileUpload"].validateNames();
        }
        if (msg != null) {
          response.valid = false;
          if (response.errors == null) response.errors = [];
          response.errors.push({ dom: dom, msg: msg });
          if (dom.validationTip!=null && dom.validationTip.doneShowing!=null) dom.validationTip.doneShowing=false;
          continue;
        }        
      }
      if (dom.modified == true && (pui["controller"] != null || pui.bypassValidation != "true")) {
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
                
                // Prevent character values from ever going into numeric fields by clearing the value: #4441.
                // Formatting info tells the data type.
                if ( dom.formattingInfo != null && dom.formattingInfo.dataType != "expression"
                && pui.formatting.isNumericType( dom.formattingInfo.dataType )) {

                  // See if the string has only characters that appear in numbers, including (0.00) 0,00 but not "CR".
                  // This will clear out anything containing non-numeric characters.
                  var numericRe = /^[0-9,.\- \(\)]+/;
                  if (! numericRe.test(value) ){
                    value = "";
                  }
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

    if (typeof value == "string" && (pui["controller"] != null || pui.bypassValidation != "true")) {
      if (trim(value) == "" && dom.blankValues != null && dom.blankValues.length >= 1) {
        value = dom.blankValues[0];
      }

      if (dom.signaturePad != null && pui.bypassValidation != "send data") {
        if (value.length > dom.formattingInfo.maxLength) {
          response.valid = false;
          if (response.errors == null) response.errors = [];
          response.errors.push({ dom: dom, msg: pui["getLanguageText"]("runtimeMsg", "signature overflow") });
          if (dom.validationTip!=null && dom.validationTip.doneShowing!=null) dom.validationTip.doneShowing=false;
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
          if (boxDom.validationTip!=null && boxDom.validationTip.doneShowing!=null) boxDom.validationTip.doneShowing=false;
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
              if (boxDom.validationTip!=null && boxDom.validationTip.doneShowing!=null) boxDom.validationTip.doneShowing=false;
              continue;
            }
          }

          if (dom.validateEmail == true) {
            if (!pui.validateEmail(value)) {
              response.valid = false;
              if (response.errors == null) response.errors = [];
              var msg = pui["getLanguageText"]("runtimeMsg", "invalid email");
              response.errors.push({ dom: boxDom, msg: msg });
              if (boxDom.validationTip!=null && boxDom.validationTip.doneShowing!=null) boxDom.validationTip.doneShowing=false;
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
              response.errors.push({ dom: boxDom, msg: pui["getLanguageText"]("runtimeMsg", "validValues") + validValues.join(", ") + "." });
              if (boxDom.validationTip!=null && boxDom.validationTip.doneShowing!=null) boxDom.validationTip.doneShowing=false;
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
              if (boxDom.validationTip!=null && boxDom.validationTip.doneShowing!=null) boxDom.validationTip.doneShowing=false;
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
              var msg = pui["getLanguageText"]("runtimeMsg", "invalid low range", [ rangeLowDisp ]);
              if (dom.rangeHigh != null) {
                var rangeHighDisp = dom.rangeHigh;
                if (formattingObj.formatting != "Number") rangeHighDisp = "'" + rangeHighDisp + "'";
                msg = pui["getLanguageText"]("runtimeMsg", "invalid range", [ rangeLowDisp, rangeHighDisp ]);
              }
              response.valid = false;
              if (response.errors == null) response.errors = [];
              response.errors.push({ dom: boxDom, msg: msg });
              if (boxDom.validationTip!=null && boxDom.validationTip.doneShowing!=null) boxDom.validationTip.doneShowing=false;
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
              var msg = pui["getLanguageText"]("runtimeMsg", "invalid high range", [ rangeHighDisp ]);
              if (dom.rangeLow != null) {
                var rangeLowDisp = dom.rangeLow;
                if (formattingObj.formatting != "Number") rangeLowDisp = "'" + rangeLowDisp + "'";
                msg = pui["getLanguageText"]("runtimeMsg", "invalid range", [ rangeLowDisp, rangeHighDisp ]);
              }
              response.valid = false;
              if (response.errors == null) response.errors = [];
              response.errors.push({ dom: boxDom, msg: msg });
              if (boxDom.validationTip!=null && boxDom.validationTip.doneShowing!=null) boxDom.validationTip.doneShowing=false;
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
          var subfileChangedField = pui.subfileChangedFields[sflName["toLowerCase"]()];
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
    if (dom.grid["expanded"]) {
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

  if (pui.fieldNameSortResponseGrid != null) {
    var field = pui.fieldNameSortResponseGrid.tableDiv.fieldNameSortResponseField;
    var value = pui.fieldNameSortResponseGrid.fieldNameSortResponse;
    if (field != null && value != null) {
      response[field] = value;
    }
  }
  
  for (var fmt in pui.changedFields) {
    if (pui.ctlRecModified[fmt] && (pui["controller"] != null || pui.bypassValidation != "true")) {
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
    var setOffField = pui.setOffFields[i];
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
  
  if (pui["controller"] != null) {
  
    var count = 0;
    var layers = pui.oldRenderParms["layers"];
    for (var i = 0; i < layers.length; i++) {
    
      var formats = layers[i]["formats"];
      for (var j = 0; j < formats.length; j++) {
      
        response["pui-recname." + (++count)] = formats[j]["metaData"]["screen"]["record format name"];
      
      }
    
    }  
  
  }
  
  if (typeof pui["beforeRespond"] === "function") {
    var rv = pui["beforeRespond"](response);
    if (rv) response = rv;
  }
  
  return response;
};


pui.submitResponse = function(response, value) {

  if (pui["isCloudPreview"]) {    
    setTimeout(function() {
      pui.screenIsReady = true;
      pui.hideWaitAnimation();
    }, 500);
    return;
  }

  if (pui.isHtml) {
    if (!pui.screenIsReady) return false;
    pui.screenIsReady = false;
  }

  if (response == null) {
    response = pui["captureData"]();
  }
  else if (typeof response === "string") {
    response = pui["captureData"](response, value);
  }

  var url;
  if (pui.genie == null) url = getProgramURL("PUI0001200.pgm");
  else url = getProgramURL("PUI0002110.pgm");
  if (pui.psid != null && pui.psid != "") url += "/" + pui.psid;
  if (pui.handler != null && typeof pui.handler == "string") url = pui.handler;
  if (pui["overrideSubmitUrl"] != null && typeof pui["overrideSubmitUrl"] == "function") {
    try {
      url = pui["overrideSubmitUrl"](url);
    }
    catch(e) {
    }
  }

  if (pui.handler != null && typeof pui.handler == "function") {
    if (pui.destURL) {
      var parts = pui.destURL.split("?");
      var query = "";
      url = parts[0];
      if (parts.length > 1) query = parts[1];
      var paramStr = "";
      var paramArr = [];
      for (var i = 0; i < pui.destParams.length; i++) {
        var name = pui.destParams[i][0];
        var value = pui.destParams[i][1];        
        if (paramStr != "") paramStr += "&";
        paramStr += encodeURIComponent(name) + "=" + encodeURIComponent(value);
        paramArr.push("\"" + name + "\"", "\"" + value + "\"");
        response[name] = value;
      }
      if (pui.destBookmarkable) {
        if (query != "") query += "&";
        query += paramStr;
      }
      if (query != "") url += "?" + query;    
      if (pui.destRedirect) {
        if (pui.destBookmarkable) {
          location.href = url;  
        }
        else {
          var code = "postTo(\"" + url + "\"";
          if (paramArr.length > 0) {
            code += "," + paramArr.join(",");
          }
          code += ");";
          eval(code);
        }
        return;
      }
      else {
        pui["controller"] = url;
      }
    }   
    pui.handler(response);
  }  
  else {
    pui.timeoutMonitor.end();
    pui.showWaitAnimation();
    
    function sendRichDisplayScreen() {

      if (pui["isCloud"]) response["workspace_id"] = pui.cloud.ws.id;

      ajaxJSON({
        "url": url,
        "method": "post",
        "params": response,
        "sendAsBinary": false,
        "saveResponse": true,
        "suppressAlert": true,
        "handler": function(parms) {
          if (parms == null) {
            //document.body.style.backgroundColor = "#DFE8F6";
            document.body.innerHTML = '<div style="font-family: Trebuchet MS; width: 95%; text-align: center; font-size: 200%;"><br/>' + pui["getLanguageText"]("runtimeMsg", "session ended text") + '<br/><br/>' + pui["getLanguageText"]("runtimeMsg", "close browser text") + '</div>';
            var returnVal = shutDown();
            if (returnVal == false) return;
            pui.shutdownOnClose = false;
            pui.confirmOnClose = false;
            context = "";
            return;
          }
          parms.container = pui.runtimeContainer;

          /* Check for a session timeout message.  If retries are configured, 
           * do them here. */
          
          var formatName = "";
          var displayFile = "";
          if (parms != null 
              && parms["layers"] != null 
              && parms["layers"][0] != null 
              && parms["layers"][0]["formats"] != null 
              && parms["layers"][0]["formats"][0] != null 
              && parms["layers"][0]["formats"][0]["name"] != null 
              && parms["layers"][0]["formats"][0]["file"] != null) {
            formatName = parms["layers"][0]["formats"][0]["name"]; 
            displayFile = parms["layers"][0]["formats"][0]["file"]; 
          }
          if (pui["session timeout retries"] > 0 ) {
            if ((formatName === "TIMOUTSCRN" && displayFile === "PUISCREENS")
                 || (pui.genie && parms != null && parms["exception"] == "PUI0003")) {
              pui.sessionRetryCount += 1;
              if (pui.sessionRetryCount <= pui["session timeout retries"]) {
                setTimeout( sendRichDisplayScreen, 2000 );
                return;
              }
            }
          }
          pui.sessionRetryCount = 0;
          
          // If any items depend on external files, wait for those to load before
          // rendering. Otherwise, pui.render/render5250 is called without waiting.
          if (pui.genie == null) pui.loadDependencyFiles(parms, function(){ pui.render(parms); });
          // Don't load dependency-scripts yet--just render. Genie loads dependencies after fetching screen customizations.
          else pui.render5250(parms);
        },
        "onfail": function(req) {
          if (pui["onoffline"] == null && !pui["suppress comm errors"]) pui.alert(pui.getNoConnectionMessage(req));
          pui.hideWaitAnimation();
          pui.resetResponseValues();
          if (pui["onoffline"] != null) pui["onoffline"]();
        }      
      });
    }
    sendRichDisplayScreen();
  }
};
pui["submit"] = pui.submitResponse;  // short-hand


pui.resetResponseValues = function() {
  // set response values back to "0"
  for (var fieldName in pui.responseElements) {
    var doms = pui.responseElements[fieldName];
    for (var i = 0; i < doms.length; i++) {
      if (doms[i].responseValue == "1") {
        doms[i].responseValue = "0";
      }
    }
  }
  pui.screenIsReady = true;
};


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
  pui.hideWaitAnimation();
  for (var i = 0; i < pui.gridsDisplayed.length; i++) {  
    var grid = pui.gridsDisplayed[i];
    grid.unMask();
  }
  pui["unmaskScreen"]();
  pui.resetResponseValues();
};


pui.evalBoundProperty = function(propValue, data, ref) {
  if (!pui.isBound(propValue) && !pui.isTranslated(propValue)) return propValue;
  
  var formattingObj = propValue;

  if (data == null) {
    if (formattingObj["designValue"] != null) return formattingObj["designValue"];
    return "";
  }
 
  var fieldName = formattingObj.fieldName;
  if (data["__pui_show"] && formattingObj["longName"]) fieldName = formattingObj["longName"];
  if (formattingObj["lowerCaseField"] != true && pui.handler == null) {
    fieldName = pui.fieldUpper(fieldName);
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
  }
  
  return pui.FieldFormat.format(formattingObj);
};

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
};


pui.showWaitAnimation = function() {
  pui.hideWaitAnimation();
  var animation;
  if (pui["loading animation"]["css"] != null && !pui["is_old_ie"] && pui["loading animation"]["path"] == pui.normalizeURL("/profoundui/proddata/images/loading.gif") && pui["loading animation"]["text"] == null) {
    animation = document.createElement("div");
    animation.className = pui["loading animation"]["css"];
  } else {
    if (pui["loading animation"]["text"] != null) {
      animation = document.createElement("div");
      animation.innerHTML = pui["loading animation"]["text"];
      animation.style.backgroundColor = "#cccccc";
      animation.style.border = "1px solid #333333";
      animation.style.fontSize = "10px";
      animation.style.fontFamily = "Sans-Serif";
    } else {
      animation = document.createElement("img");
      animation.src = pui["loading animation"]["path"];
      var width = pui["loading animation"]["width"];
      var height = pui["loading animation"]["height"];
      animation.style.width = width + "px";
      animation.style.height = height + "px";
    }
    if (pui["loading animation"]["alt"] != null && pui["loading animation"]["alt"].length > 0)
      animation.alt = pui["loading animation"]["alt"];
      animation.style.position = "absolute";
      var left = pui["loading animation"]["left"];
      if (pui.isHtml && left < 0) left = 0;
      animation.style.left = left + "px";
      var top = pui["loading animation"]["top"];
      top += Math.max(document.body.scrollTop, document.documentElement.scrollTop);
      animation.style.top = top + "px";
      animation.style.zIndex = pui["loading animation"]["zIndex"];
  }
  animation.id = "_pui_loading_animation";
  pui.runtimeContainer.appendChild(animation);

  for (var i = 0; i < pui.gridsDisplayed.length; i++) {
    var grid = pui.gridsDisplayed[i];
    if (!grid.subfileHidden) grid.mask();
  }

};

pui.hideWaitAnimation = function() {
  var animation = getObj("_pui_loading_animation");
  if (animation != null && animation.parentNode != null) {
    animation.parentNode.removeChild(animation);
  }
};


pui.handleHotKey = function(e, keyName) {

  if (context != "dspf" || pui.isHtml) return;
   
  if (!e) e = window.event;
  var key = e.keyCode;
  var fkey;

  // If a break message is showing, dismiss only if the user presses the enter key
  if (pui.breakMessageShowing) {
    pui.breakMessageDismiss(e);
    return;
  }

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
  
  // NOTE: In most cases, only the command keys defined on the last format written (pui.lastFormatName)
  //       are available. PageUp/PageDown are exceptions to this rule. 
  //       This being the case, the Grid widgets Next/Prev links should probably also enable/disable 
  //       based on this logic and also buttons/links created for ROLLUP/ROLLDOWN in non-SFLCTL formats 
  //       should also show/hide accordingly. I don't think these are implemented correctly, but users have not 
  //       reported any problems yet.
  //       - DR 08/19/2015
  var processKey = (
    keyName != null && pui.lastFormatName != null && 
    (
      keyName == "Enter" || keyName == "PageUp" || keyName == "PageDown" || 
      pui.keyMap[pui.lastFormatName][keyName] != null
    )
  );    
    
  if (processKey && keyName == "PageUp" || keyName == "PageDown") {
      
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
            if (dom.nextPage == true && !dom.parentPagingBar.pageDownResponseDefined) {
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
            if (dom.prevPage == true && !dom.parentPagingBar.pageUpResponseDefined) {
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

      var returnVal = pui.respond();;
      
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

};


pui.handleF1 = function(e) {
  return pui.handleHotKey(e, "F1");
};


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
    "pathname": location.pathname,
    "debug": debug,
    "log": log,
    "workstnid": workstnid
  };
  if (pui["isCloud"]) {
    ajaxParams["workspace_id"] = pui.cloud.ws.id;
    ajaxParams["workspace_url"] = location.href;    
  }
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
      // If any items depend on external files, wait for those to load before
      // rendering. Without dependencies, pui.render is called without waiting.
      pui.loadDependencyFiles(preview, function(){ pui.render(preview); });
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
      };
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
        parms.container = container;

        // If any items depend on external files, wait for those to load before
        // rendering. Otherwise, pui.render is called without waiting.
        pui.loadDependencyFiles(parms, function(){ pui.render(parms); });
      },
      "onfail": function(req) {
        pui.hideWaitAnimation();
        setTimeout(function() {
          if (pui["onoffline"] == null) {
            if (!pui["suppress comm errors"])
              pui.alert(pui.getNoConnectionMessage(req));
            if (pui["is_touch"]) {
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
};

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
  if (pui.observer == null) pui.showWaitAnimation();  
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
    "pathname": location.pathname,
    "debug": debug,
    "log": log,
    "workstnid": workstnid,
    "atrium_item": atriumitem    
  };
  if (pui["isCloud"]) {
    ajaxParams["workspace_id"] = pui.cloud.ws.id;
    ajaxParams["workspace_url"] = location.href;
  }  
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
    };
    url += "/" + puiRefreshId;
  }

  if (pui.observer != null) return;

  ajaxJSON({
    "url": url,
    "method": "post",
    "sendAsBinary": false,
    "params": ajaxParams,
    "saveResponse": true,
    "suppressAlert": true,
    "handler": function(parms) {
      parms.container = container;
      
      // If any items depend on external files, wait for those to load before
      // rendering. Otherwise, pui.render is called without waiting.
      pui.loadDependencyFiles(parms, function(){ pui.render(parms); });
    },
    "onfail": function(req) {
      pui.hideWaitAnimation();
      setTimeout(function() {
        if (pui["onoffline"] == null) {
          if (!pui["suppress comm errors"])
            pui.alert(pui.getNoConnectionMessage(req));
          if (pui["is_touch"]) {
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
};


pui.runMVC = function(response) {

  response["profoundui"] = "1";
  ajaxJSON({
    "url": pui.normalizeURL(pui["controller"]),
    "method": "post",
    "params": response,
    "sendAsBinary": false,
    "saveResponse": true,
    "suppressAlert": true,
    "handler": function(parms) {
      if (parms == null) {
        document.body.innerHTML = '<div style="font-family: Trebuchet MS; width: 95%; text-align: center; font-size: 200%;"><br/>' + pui["getLanguageText"]("runtimeMsg", "session ended text") + '<br/><br/>' + pui["getLanguageText"]("runtimeMsg", "close browser text") + '</div>';
        pui.closeSession();   //Without this, a parent atrium tab can't be closed by clicking [x].
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
      var appJob = parms["appJob"] || {};
      pui.show({
        "path": pui.normalizeURL(pui["view"]),
        "data": data,
        "format": format,  // if not specified, the first format is used
        "formats": formats,
        "appJob": appJob,
        "handler": function(response) {
          pui.runMVC(response);
        }
      });
    },
    "onfail": function(req) {
      if (pui["onoffline"] == null && !pui["suppress comm errors"]) pui.alert(pui.getNoConnectionMessage(req));
      pui.hideWaitAnimation();
      pui.resetResponseValues();
      if (pui["onoffline"] != null) pui["onoffline"]();
    }      
  });

};

pui.start = function() {
  pui.startMouseCapableMonitoring();
  var parms = getQueryStringParms();
  pui.canvasSize = parms["canvasSize"];
  var program = parms["pgm"];
  if (program == null) program = parms["program"];
  var debug = parms["debug"];
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
  var observe = (parms["observe"] === "1");
  if (observe) pui.observed.enabled = true;
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
    "params": params,
    "observe": observe
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
};

pui["downloadJobLog"] = function(jobLog) {
  pui.downloadAsAttachment("text/plain", jobLog["fileName"], jobLog["data"]);
};

pui.newSession = function() {
  window.location.reload();
};

pui.closeSession = function() {

  if (window.parent != window && pui.checkForAtrium(window.parent)) {
    window["Atrium"]["closeTab"]();  
    return;
  }
  
  if (window.parent != window && window.parent.pui["isCloud"]) {
    var ext = window.parent["Ext"];
    if (ext && ext["getCmp"]) {
      var stopButton = ext["getCmp"]("_south_panel_stop");
      if (stopButton) {
        if (typeof stopButton["handler"] === "function") {
          stopButton["handler"]();
          return;
        }
      }
    }
  }
 
  //document.body.style.backgroundColor = "#DFE8F6";
  document.body.innerHTML = '<div style="width: 95%; text-align: center; font-size: 200%;"><br/>' + pui["getLanguageText"]("runtimeMsg", "close browser text") + '</div>';
  
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
};

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
};



// Mask the screen
pui["maskScreen"] = function(parms) {

  var bodyWidth = document.documentElement.clientWidth - 2;
  var bodyHeight = document.documentElement.clientHeight - 2;
  if (bodyWidth < 0) bodyWidth = 0;
  if (bodyHeight < 0) bodyHeight = 0;
  
  
  var maskDiv;
  if (pui.maskDiv == null) {
    maskDiv = document.createElement("div");
    maskDiv.id = "pui-screen-mask";
    pui.maskDiv = maskDiv;
  }
  else {
    maskDiv = pui.maskDiv;
  }
  pui.runtimeContainer.appendChild(maskDiv);
  
  maskDiv.isPUIWindowMask = true;
  maskDiv.style.position = "absolute";
  maskDiv.style.padding = "0px";
  
  
 
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
    if (document.documentElement.scrollHeight > document.documentElement.clientHeight) {
      // This corrects offset position being off when this code runs during a resize while the 
      // vertical scrollbar is present. That results in scrollbars appearing when they shouldn't 
      // after a resize while the mask is up.  
      // This is arbitrary, but it's not cleaer how to calculate this correctly. 
      // This is probably "good enough" for most browsers. 
      pos.x += 8;  
    
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
  
};



pui["unmaskScreen"] = function() {
  if (pui.maskDiv == null) return;
  var parent = pui.maskDiv.parentNode;
  if (parent != pui.runtimeContainer) return;
  parent.removeChild(pui.maskDiv);
};


/**
 * Called by pui.render when a layer is not the first.
 * Disables background elements and removes "id" attributes of elements.
 * @param {Object} parms  Parameters passed to pui.render.
 * @param {Object} layer  The current layer being rendered in pui.render.
 * @returns {undefined}
 */
pui.setupWindowDiv = function(parms, layer) {

  var format = layer.formats[0];

  pui.hideWaitAnimation();

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
      
      if (typeof elem.sentToBackground == "function"){
        elem.sentToBackground();
      }
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
}; 

/**
 * Adjusts the left and top position of pui.lastWindow to be centered on the
 * screen. pui.lastWindow should be the window most recently added.
 * 
 * See issues 1430 and 1786 for example test cases if you change this function.
 * 
 * @returns {undefined}
 */
pui.centerWindow = function() {
  // get dimensions of current window:
  var windowDims = pui.getDimensions(pui.lastWindow);
  
  // Starting with pui.runtimeContainer, which is first in windowStack, find
  // a window that has a size to it.
  // Centering will happen on that "screen" size.
  var screenDims;
  for (var w=0; w < pui.windowStack.length; w++) {
    screenDims = pui.getDimensions(pui.windowStack[w]);
    if (screenDims.x1!=screenDims.x2 && screenDims.y1!=screenDims.y2) break;
  }
  
  // calculate centering:
  
  var left = parseInt((screenDims.x2 - (windowDims.x2 - windowDims.x1)) / 2) - windowDims.x1;
  var top = parseInt((screenDims.y2 - (windowDims.y2 - windowDims.y1)) / 2) - windowDims.y1;
  
  if (left < -windowDims.x1) left = -windowDims.x1;
  if (top < -windowDims.y1) top = -windowDims.y1;
  pui.lastWindow.style.left = left + "px";
  pui.lastWindow.style.top = top + "px";
};

pui.getDimensions = function(screen) {
  var dims = {
    x1: 99999,
    y1: 99999,
    x2: 0,
    y2: 0
  };
  // Look at the dimensions of each of the screen's child nodes. After the
  // loop finishes, a rectangle bounded by the values in "dims" would contain
  // all of the widgets. That rectangle should be the size of the screen.
  var obj = screen.firstChild;
  while (obj != null) {
    if (!obj.isPUIWindow && !obj.isPUIWindowMask && obj.style != null && obj.style.position == "absolute" && obj.pui) {
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
};


pui.showMessageSubfileHelp = function(textObj) {
  // Allow the helpWindowDiv to be seen again when it is detached from the DOM but it and its parent aren't null. Issue 2992.
  if (pui.messageSubfileHelpWindowDiv != null && !document.body.contains(pui.messageSubfileHelpWindowDiv)){
    pui.messageSubfileHelpWindowDiv = null;
  }

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
  
  var minWidth = 600;
  var width = gridObj.clientWidth - 25;
  if (width < minWidth) {
    width = minWidth;
  }
  
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
  div.style.width = width + "px";
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
  };
  img.onmouseout = function() {
    img.src = pui.normalizeURL("/profoundui/proddata/images/buttons/close/x1.png");
  };
  img.onclick = function() {
    div.style.display = "none";
  };
  div.appendChild(img);
  
  pui.messageSubfileHelpWindowDiv = div;
  
};

pui.setActiveElement = function(e) {
  var target = getTarget(e);
  if (!(target.tagName=="INPUT" && target.type=="button"))
    pui.activeElement = target;
  var dom = target;
  if (dom.parentNode && dom.parentNode.comboBoxWidget) dom = dom.parentNode;
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
    
};


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
  if (elem.parentNode != null && elem.parentNode.comboBoxWidget != null) elem = elem.parentNode;
  if (elem.tagName == "OPTION" && elem.parentNode.tagName == "SELECT") elem = elem.parentNode;
  if (elem.tagName == "IMG" && elem.parentNode.tagName == "BUTTON"){
    elem = elem.parentNode;
    isButton = true;
  } 
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
};

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
};


pui.applyFocusClass = function(e) {
  var dom = getTarget(e);
  var cssClass = dom.className;
  if (cssClass == null) cssClass = "";
  cssClass = trim(cssClass);
  if (cssClass.indexOf(dom.focusClass) == -1) {
    cssClass += " " + dom.focusClass;
  }
  dom.className = cssClass;
  // For Combo Boxes
  if (dom.parentNode && dom.parentNode["pui"]["properties"]["field type"] === "combo box") {
    var parent = dom.parentNode;
    var parentClass = parent.className;
    if (parentClass == null) parentClass = "";
    parentClass = trim(parentClass);
    if (parentClass.indexOf(dom.focusClass) == -1) {
      parentClass += " " + dom.focusClass;
    }
    parent.className = parentClass;
  }
};


pui.removeFocusClass = function(e) {
  var dom = getTarget(e);
  var cssClass = dom.className;
  if (cssClass == null) cssClass = "";
  cssClass = trim(cssClass);
  while (cssClass.indexOf(dom.focusClass) >= 0) {
    cssClass = cssClass.replace(dom.focusClass, "");
  }
  dom.className = trim(cssClass);
  // For Combo Boxes
  if (dom.parentNode && dom.parentNode["pui"]["properties"]["field type"] === "combo box") {
    var parent = dom.parentNode;
    var parentClass = parent.className;
    if (parentClass == null) parentClass = "";
    parentClass = trim(parentClass);
    while (parentClass.indexOf(dom.focusClass) >= 0) {
      parentClass = parentClass.replace(dom.focusClass, "");
    }
    parent.className = parentClass;
  }
};


pui.autoAdvanceOnKeyUp = function(event) {
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
};


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
};


pui.isDup = function(parm) {
  var value = "";
  if (typeof parm == "string") value = parm;
  if (typeof parm == "object") value = parm.value;
  if (value == null) value = "";
  if (typeof value != "string") value = String(value);
  return (value.indexOf(pui["dup"]["char"]) != -1);
};


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
};


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
      if (elem.tagName == "A" && elem.parentNode.pui != null && elem.parentNode.pui.properties != null && elem.parentNode.pui.properties["field type"] == "hyperlink" && elem.parentNode.tabIndex == -1 ){
        continue; //Hyperlink widgets are A wrapped in DIV with tabIndex set on the DIV. Make sure to see the tabIndex. #4771.
      }
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
    var mainElem = elem;
    if (elem.parentNode.comboBoxWidget != null) mainElem = elem.parentNode;
    var x = parseInt(mainElem.style.left);
    if (isNaN(x)) continue;
    var y = parseInt(mainElem.style.top);
    if (isNaN(y)) continue;
    gridDom = mainElem.parentNode.parentNode;
    if (gridDom.grid != null) {  // the element is within a grid
      var cellX = parseInt(mainElem.parentNode.style.left);
      if (isNaN(cellX)) return null;
      var cellY = parseInt(mainElem.parentNode.style.top);
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
};


pui.fieldUpper = pui.formatUpper = function(fieldName) {
  if (fieldName == null) return "";
  if (pui.handler != null || pui.viewdesigner || pui["pjsDefaultMode"] === "case-sensitive") return fieldName;
  else return fieldName.toUpperCase(); 
};


pui.doFieldExit = function(target) {

  if (!target.disabled && !target.readOnly) {
    if ( target.tagName == "TEXTAREA" 
       || (target.tagName == "INPUT" &&  ( target.type=="text" 
                                        || target.type=="number" 
                                        || target.type=="password"))) {
      var pos = target.cursorPosition;
      if (pui["is_touch"] && !pui["is_mouse_capable"]) {
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
      var needsOnchange = (target.value !== value);
   	  target.value = value;
	  target.modified = true;
      if (needsOnchange && typeof target.onchange === 'function') {
  		  target.onchange();
      }
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
};

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

};

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
  
};

/**
 * Set timeout to show help overlays when they come into view. Assume this onscroll
 * handler is attached only when help overlays are on.
 * @returns {undefined}
 */
pui["wikihelp"].onscroll = function(){
  // If another handler is queued, then remove it so only one runs.
  if (pui["wikihelp"].onscrollTimeoutVal != null ){
    clearTimeout(pui["wikihelp"].onscrollTimeoutVal);
  }
  
  // Delay to avoid expensive checking all elements frequently (60fps is 16.6ms per frame).
  pui["wikihelp"].onscrollTimeoutVal = setTimeout(pui["wikihelp"].onscrollTimeout, 17);
};

/**
 * Show help overlays when they come into view. Callback for setTimeout in onscroll.
 * @returns {undefined}
 */
pui["wikihelp"].onscrollTimeout = function(){
  // Look at each overlay and retest its visibility if it isn't already visible.
  for(var i=0; i < pui["wikihelp"]["overlays"].length; i++ ) {
    var overlay = pui["wikihelp"]["overlays"][i];
    
    if (!overlay["pui"].isVisible){
      overlay["pui"].isVisible = pui["wikihelp"].isVisible( getObj(overlay["pui"]["fieldId"]) );
      if( overlay["pui"].isVisible ) overlay.style.display = "block";
    }
  }
};

/**
 * Check if the specified element is not hidden underneath any other elements.
 * 
 * @param {String} el        Widget's DOM element to test.
 * @returns {Boolean|Null}
 *    False if the element is in a tab panel and the parent tab is not selected.
 *    True if the specified element is on top of other elements.
 */
pui["wikihelp"].isVisible = function(el){
  if (el == null) return false;
  
  // Check if the element is in a tab panel, and if the parent tab is selected.
  if( el.parentTabPanel && el.parentTab ) {
    var partabPanel = document.getElementById(el.parentTabPanel);
    if( ! partabPanel ) return false;   //The parent tab panel could not be found. Assume element isn't visible.
    var seltab = partabPanel.getTab();
    
    if (seltab !== parseInt(el.parentTab,10) ) return false; //The parent tab is not selected, so element is not visible.
  }
  
  var rect = el.getBoundingClientRect();    //Gets coordinates relative to viewport.
  var midpx = Math.round((rect.left + rect.right) / 2);
  var midpy = Math.round((rect.top + rect.bottom) / 2);
  
  // See what elements are at the widget's corners. (Note: elementFromPoint uses viewport coordinates.)
  // Testing 2px off exact corner catches grids and widgets that paint other elements in their exact corner.
  // Test multiple points in case element isn't scrolled completely in view.
  var topleftEl  = document.elementFromPoint(rect.left  + 2, rect.top + 2);
  var botrightEl = document.elementFromPoint(rect.right - 2, rect.bottom - 2);
  var botleftEl  = document.elementFromPoint(rect.left  + 2, rect.bottom - 2);
  var midpEl     = document.elementFromPoint(midpx, midpy);

  if (topleftEl === el || midpEl === el || botrightEl === el || botleftEl === el
  || el.contains(topleftEl) || el.contains(midpEl) || el.contains(botrightEl)
  || el.contains(botleftEl) ){
    return true;
  }

  // If the element is in a container, the user may scroll the layout later, making it visible.
  return (el.parentNode != null && el.parentNode.getAttribute("container") == "true");
};

/**
 * Show overlays on every widget in the current formats.
 * If the overlays were previously created, they are made visible and the 
 * function returns. Otherwise, overlay elements are created for each current
 * format.
 * 
 * @returns {undefined}
 */
pui["wikihelp"]["overlayOn"] = function() {
  if (pui["layers"] == null) return;
  
  addEvent( window, "scroll", pui["wikihelp"].onscroll ); //If any widgets become visible, shows overlay.
  
  // If the overlays have already been constructed, then show them.
  if( pui["wikihelp"]["overlays"].length > 0 ) {
    for(var i=0; i < pui["wikihelp"]["overlays"].length; i++) {
      var overlay = pui["wikihelp"]["overlays"][i];

      // Re-test visibility in case elements changed since the overlays were created.
      overlay["pui"].isVisible = pui["wikihelp"].isVisible( getObj(overlay["pui"]["fieldId"]) );
      
      if( overlay["pui"].isVisible ) overlay.style.display = "block";
      
      // Elements inside hidden accordion sections can't report a valid offsetWidth/offsetHeight.
      // Try fetching those values again in case the elements are visible now.
      var el = document.getElementById(overlay["pui"]["fieldId"]);
      pui["wikihelp"].sizeOverlay(el, overlay);
      
    }//end showing each overlay.
  }
  // The overlays haven't been constructed yet; create them.
  else {
    pui["wikihelp"].createOverlays(true);
  }
};

/**
 * Create overlay divs for each item in all current formats.
 * 
 * @param {boolean} displayOverlays    If true, the overlay's style.display value is block.
 *                                  Else, the style.display value is none.
 * @returns {undefined}
 */
pui["wikihelp"].createOverlays = function(displayOverlays) {
  var curfmtNames = currentFormatNames();
  // Look in each layer.
  for(var lyrIdx=0; lyrIdx < pui["layers"].length; lyrIdx++ ) {
    var layer = pui["layers"][lyrIdx];
    // Look in each format.
    for(var fmtIdx=0; fmtIdx < layer.formats.length; fmtIdx++ ) {
      var format = layer.formats[fmtIdx];
      // Ignore formats that aren't current.
      if( pui.arrayIndexOf(curfmtNames, format.name) < 0 ) continue;

      // Look at each item in this format.
      for(var itmIdx=0; itmIdx < format.metaData.items.length; itmIdx++ ) {
        var item = format.metaData.items[itmIdx];
        if( ! item.id ) continue;
        
        // Get the widget element to determine the overlay's position and size.
        var el = getObj( item.id );
        if( ! el ) continue;
        if( item["field type"] === "layout") continue;
        if( item["field type"] === "panel") continue;
        if( item["field type"] === "css panel") continue;
        if( item["visibility"] === "hidden") continue;
          
        // Info to pass on to the onclick handler and to pui.wikihelp.skipItem.
        var details = {};
        details["dspf"] = format.file;
        details["recfmt"] = format.name;
        details["fieldId"] = item.id;
        details["field type"] = item["field type"];
        
        // Pass along field name for bound fields.
        if( typeof(item.value) == "object" && item.value.fieldName )
          details["fieldName"] = item.value.fieldName;
        else if(typeof(item["menu response"]) == "object" && item["menu response"].fieldName)
          details["fieldName"] = item["menu response"].fieldName;
        else if(typeof(item.response) == "object" && item.response.fieldName)
          details["fieldName"] = item.response.fieldName;
        else
          details["fieldName"] = "";
        
        // Let the end-developer limit which items to overlay via this API function.
        if (typeof pui["wikihelp"]["skipItem"] == "function" && pui["wikihelp"]["skipItem"](details) === true ) continue;

        // Create a new overlay div that we can position absolutely.
        var overlay = document.createElement("div");
        overlay.className = "pui-wikih-overlay";
        overlay.style.position = "absolute";
        el.parentNode.appendChild(overlay);

        overlay["pui"] = details;
        
        // Pass the original element's tab details to the overlay to help determine visibility.
        if( el.parentTabPanel && el.parentTab ) {
          overlay["pui"].parentTabPanel = el.parentTabPanel;
          overlay["pui"].parentTab = parseInt(el.parentTab, 10);
        }
        
        // Note: the onscroll event will re-test elements that were originally out of the viewport.
        overlay["pui"].isVisible = pui["wikihelp"].isVisible(el);

        // Show the overlay, unless there is a parent tab that isn't selected.
        if( overlay["pui"].isVisible && displayOverlays ) overlay.style.display = "block";
        else overlay.style.display = "none";
        
        // Extra details needed for special case widgets.
        if( item["field type"] === "grid" && item["csv export"] === "true" ){
          overlay["pui"].pagingBarHeight = pui.pagingBarHeight;
        }
        if( item["field type"] === "styled button" ){
          overlay["pui"].itemHeight = item["height"];
        }

        overlay.style.zIndex = el.style.zIndex + 100;
        
        
        // Match the overlay's position with the position of the widget.
        if( el.style.top.length > 0 ) overlay.style.top = el.style.top;
        else if( el.style.bottom.length > 0 ) overlay.style.bottom = el.style.bottom;
        if( el.style.left.length > 0 ) overlay.style.left = el.style.left;
        else if( el.style.right.length > 0 ) overlay.style.right = el.style.right;

        // Look for user-defined text content.
        if( pui["wikihelp"]["overlayText"] ) {
          overlay.appendChild(document.createTextNode(pui["wikihelp"]["overlayText"]));
        }

        // Add an image for the overlay.
        if( pui["wikihelp"]["image"] ) {
          var img = document.createElement("img");
          img.src = pui["wikihelp"]["image"];
          overlay.appendChild(img);
        }

        pui["wikihelp"].sizeOverlay(el, overlay);
        
        addEvent(overlay, "click", pui["wikihelp"].onClickOverlay );
        pui["wikihelp"]["overlays"].push(overlay);

      }//end looking at each item.
    }//end looking at each format.
  }//end looking at each layer.
};

/**
 * Calculate the width and height of an overlay box based on the underlying widget properties.
 * @param {Object} el       The widget's DOM element.
 * @param {Object} overlay  The help overlay object for a widget.
 * @returns {undefined}
 */
pui["wikihelp"].sizeOverlay = function(el, overlay){
  // Match the width/height of the widget on the page; zIndex over it.
  // Workaround for IE8,IE9 offset values returning 0: call getBoundingClientRect
  el.getBoundingClientRect();
  var ovwidth = el.offsetWidth;
  var ovheight = el.offsetHeight;

  // Special cases; adjust position and size of overlay.
  // 
  // Radio buttons and checkboxes have multiple elements not inside a parent div.
  if( overlay["pui"]["field type"] === "radio button" ) {
    overlay.style.margin = "3px 3px 0 5px";
    // The next sibling 
    if( el.nextSibling && el.nextSibling.tagName.toLowerCase() == "div" ) {
      ovwidth = el.offsetWidth + el.nextSibling.offsetWidth;
      ovheight = Math.max(el.offsetHeight, el.nextSibling.offsetHeight);
    }
  }
  else if( overlay["pui"]["field type"] === "checkbox" ) {
    overlay.style.margin = "2px";
    if( el.nextSibling && el.nextSibling.tagName.toLowerCase() == "div" ) {
      ovwidth = el.offsetWidth + el.nextSibling.offsetWidth;
      ovheight = Math.max(el.offsetHeight, el.nextSibling.offsetHeight);
    }
  }
  // Tab panels contain other elements, so only overlay the tabs to 
  // prevent clicking them.
  else if( overlay["pui"]["field type"] === "tab panel") {
    // 2nd child Node contains the tabs. Use height from tabs.
    ovheight = el.childNodes[1].offsetHeight;
    overlay.style.fontSize = (ovheight * 0.85) + "px";
  }
  else if( overlay["pui"]["field type"] === "date field") {
    ovwidth = el.offsetWidth + 22;
  }
  else if( overlay["pui"]["field type"] === "grid" && overlay["pui"].pagingBarHeight != null ) {
    ovheight += overlay["pui"].pagingBarHeight;
  }
  else if( overlay["pui"]["field type"] === "styled button" && !overlay["pui"].itemHeight ){
    ovheight = 0;
    // Look at the dimensions of each of the widget's child elements, and add overall height.
    var buttonChild = el.firstChild;
    while (buttonChild != null) {
      if ( buttonChild.style != null && buttonChild.style.position == "absolute" ) {
        var btnChildHgt = buttonChild.offsetTop + buttonChild.offsetHeight;
        if (btnChildHgt > ovheight) ovheight = btnChildHgt;
      }
      buttonChild = buttonChild.nextSibling;
    }
  }

  overlay.style.width = ovwidth + "px";
  overlay.style.height = ovheight + "px";

  // Set user-defined text size: scale the font unless explicitly told not to.
  if( pui["wikihelp"]["overlayText"] && pui["wikihelp"]["fontScale"] != false ) {
    // Get user-defined font scaling factors or use the best determined
    // values for Helvetica font with latin characters.
    var fontScale = Number(pui["wikihelp"]["fontScale"]);
    if( isNaN(fontScale)) fontScale = 1.56;

    // Calculate the largest font size for the text to remain in its box.
    // Works for most boxes with short (1-4 chars) strings.
    var fontWidth = ovwidth / pui["wikihelp"]["overlayText"].length;
    var fontHeight = Math.min( fontWidth * fontScale, ovheight * fontScale / 2);
    overlay.style.fontSize = fontHeight + "px";
  }
  
  // Set image overlay size.
  if( pui["wikihelp"]["image"] ) {
    var img = overlay.getElementsByTagName("img")[0];
    // By default make the image square. Otherwise it stretches for some fields.
    if( pui["wikihelp"]["imageSquare"] !== false ) {
      var size = Math.min(ovwidth, ovheight);
      img.width = size;
      img.height = size;
    }
    else {
      img.width = ovwidth;
      img.height = ovheight;
    }
  }
};

/**
 * Hide all wiki-help widget overlays.
 * 
 * @returns {undefined}
 */
pui["wikihelp"]["overlayOff"] = function() {
  removeEvent( window, "scroll", pui["wikihelp"].onscroll );

  for(var i=0; i < pui["wikihelp"]["overlays"].length; i++ ) {
    pui["wikihelp"]["overlays"][i].style.display = "none";
  }
};

/**
 * Handler for wiki-help overlay onclick. This function packages the
 * display file name, current record format name, and field id into an object
 * and passes those values to a user-defined onclick function, if it exists.
 * 
 * @param {Object} event
 * @returns {Boolean}
 */
pui["wikihelp"].onClickOverlay = function(event) {
  event = event || window.event; //cross browser event.
  preventEvent(event); //cross browser event.preventDefault and cancelBubble.
  
  var target = event.target || event.srcElement; //srcElement is for IE<9.
  
  // An image may capture the click event, so get the div node, which has the
  // parameters we need to pass along.
  if( target.parentNode["pui"] && target.parentNode["pui"]["dspf"] ) target = target.parentNode;
  
  // Export the event, display file name, record format name, clicked field id,
  // and field name to the user's handler function if it exists.
  var params = {};
  params["dspf"] = target["pui"]["dspf"];
  params["recfmt"] = target["pui"]["recfmt"];
  params["fieldId"] = target["pui"]["fieldId"];
  params["fieldName"] = target["pui"]["fieldName"];
  params["field type"] = target["pui"]["field type"];
  params["event"] = event;
  if( typeof(pui["wikihelp"]["onclick"]) === "function") 
    pui["wikihelp"]["onclick"](params);
  params = null;
  
  return false;
};

/**
 * Returns an object containing the display file name and all formats.
 * This is the screen-level-help API function.
 * 
 * @returns {Object}
 */
pui["wikihelp"]["getScreenInfo"] = function() {
  
  if( pui["wikihelp"]["overlays"].length < 1 )
    pui["wikihelp"].createOverlays(false);
  
  var info = {};
  info["formats"] = currentFormatNames();
  info["dspf"] = pui["layers"][0]["formats"][0].file;
  
  info["fields"] = [];
  // If we need to fetch items from current formats, iterate over pui.wikihelp.overlays.
  for(var i=0; i < pui["wikihelp"]["overlays"].length; i++ ) {
    var field = {};
    field.id = pui["wikihelp"]["overlays"][i]["pui"]["fieldId"];
    if( pui["wikihelp"]["overlays"][i]["pui"]["fieldName"]
    && pui["wikihelp"]["overlays"][i]["pui"]["fieldName"].length > 0 )
      field.name = pui["wikihelp"]["overlays"][i]["pui"]["fieldName"];
    info["fields"].push( field );
  }
  
  return info;
};


pui.isInputCapableProperty = function(propname, dom) {
  
  if ((propname == "response") ||
      (propname == "chart response") ||  
      (propname == "menu response") ||  
      (propname == "upload response") ||  
      (propname == "tab response") ||  
      (propname == "active tab") ||  
      (propname == "radio button group") ||  
      (propname == "page down response" && dom.grid != null && dom.grid.pagingBar != null) ||  
      (propname == "page up response" && dom.grid != null && dom.grid.pagingBar != null) ||  
      (propname == "value" 
      && (
          (dom.tagName == "INPUT" && dom.type != "button") 
          || dom.tagName == "SELECT"  
          || dom.tagName == "TEXTAREA" 
          || dom.comboBoxWidget != null 
          || dom.slider != null 
          || dom.signaturePad != null 
          || dom.onOffSwitch != null
         )
      )
     ) {
    return true;
  }

  return false;
};


pui.transitionAnimation = {
  setup: function(config) {
    this.animation = config.animation;
    this.animatedScreenProperty = config.animatedScreenProperty;
    if (this.animatedScreenProperty !== "previous") this.animatedScreenProperty = "new";
    this.overlay = (config.overlay === "true" || config.overlay === true);
    pui.transitionAnimation.cleanup();
    
    // Capture previous screen and remove any id's to avoid clashing when the new screen is rendered
    var containerId = config.container.id;
    this.prevScreen = config.container;
    this.prevScreen.id = "pui-previous";
    this.prevScreen.style.zIndex = 10;
    var allElems = this.prevScreen.getElementsByTagName("*");
    for (var i = 0; i < allElems.length; i++) {
      var elem = allElems[i];
      if (elem.hasAttribute("id")) elem.removeAttribute("id");
    }

    // Create new screen as brand new pui div
    this.newScreen = document.createElement("div");
    this.newScreen.id = containerId;
    this.newScreen.style.zIndex = 20;
    this.prevScreen.parentNode.appendChild(this.newScreen);    
    return this.newScreen;
  },
  
  animate: function() {
    this.adjustHeight();
    var animatedScreen = this.newScreen;
    if (this.animatedScreenProperty === "previous") {
      this.prevScreen.style.zIndex = 30;
      animatedScreen = this.prevScreen;
    }
    if (!this.overlay || this.animatedScreenProperty === "previous") {
      animatedScreen.addEventListener("animationend", function(event) {
        pui.transitionAnimation.cleanup();
      }, false);
    }
    else {
      var mask = document.createElement("div");
      mask.className = "pui-animation-mask";
      if (this.prevScreen.firstChild) this.prevScreen.insertBefore(mask, this.prevScreen.firstChild);
      else this.prevScreen.appendChild(mask);
    }

    // Remove class when animation completes to prevent scrollbars from appearing on iOS
    if (this.animatedScreenProperty === "new") {
      animatedScreen.addEventListener("animationend", function(event) {
        animatedScreen.className = "";
      }, false);
    }
	
    animatedScreen.className = "pui-" + this.animation + "-" + this.animatedScreenProperty;
  },
  
  cleanup: function() {
    if (!this.prevScreen) return;
    this.prevScreen.innerHTML = "";
    if (this.prevScreen.parentNode) this.prevScreen.parentNode.removeChild(this.prevScreen);
    this.prevScreen = null;
  },
  
  adjustHeight: function() {
    // This logic was borrowed from Mobile Layout
  
    // If height is unset, IE returns "auto", and all others return "0px"    
    var parentStyle = pui.getComputedStyle(this.newScreen);
    if (parentStyle != null && ( parentStyle["height"]=="0px" || parentStyle["height"]=="auto" )) {
      pui.restoreStyles["padding"] = document.body.style.padding;
      document.body.style.padding = "0";
      pui.restoreStyles["height"] = document.body.style.height;
      document.body.style.height = "100%";
      document.body.parentNode.style.padding = "0";
      document.body.parentNode.style.height = "100%";
      pui.restoreStyles["overflow"] = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      this.newScreen.style.padding = "0";
      this.newScreen.style.height = "100%";
    }
    
    // Layout widget also had some exceptions for iOS .. this should be tested and we should see if this logic needs to be added
    
    pui.resize();

  }
};
