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
pui.changedFields = {};
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
pui.responseRoutine = null;
pui.responseRoutineRow = null;
pui.responseRoutineGrid = null;
pui.ddBypassValidation = "false";
pui.lastFormatName = null;
pui.scrolledGridName = null;
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
pui.screenEventsToCleanup = [];
pui.programStorage = {};
pui.recording = {
  "payloads": [],
  "responses": []
};
pui.translationMap = [];

// this is normally stored in a theme, but themes are not available at runtime
// so for now, this is just hardcoded
pui.standardRowHeight = 20;
pui.standardColumnWidth = 8;
pui["leftOffset"] = 140;
pui.topOffset = 0;
pui.pagingBarHeight = 27;
pui["vertical button spacing"] = 33; // this accounts for the height of the button as well, used in non-window formats
pui["horizontal button spacing"] = 90; // this accounts for the width of the button as well, used in window formats

pui["highlight on focus"] = false;

pui["window mask color"] = "#CCCCCC";
pui["window mask opacity"] = 50;

pui["loading animation"] = {};
pui["loading animation"]["path"] = pui.normalizeURL("/profoundui/proddata/images/loading.gif");
pui["loading animation"]["default"] = pui["loading animation"]["path"];
pui["loading animation"]["left"] = 10;
pui["loading animation"]["top"] = 10;
pui["loading animation"]["width"] = 16;
pui["loading animation"]["height"] = 16;
pui["loading animation"]["zIndex"] = 250;
pui["loading animation"]["css"] = "pui-animation";

pui["auto tab"] = false; // when the user reaches the end of the field, the cursor is automatically advanced to the next field
pui["enable arrow keys"] = false;
pui["horizontal auto arrange"] = false;
pui["buttons per row"] = 1; // required when pui["horizontal auto arrange"] set to true
pui["strict tab control"] = false;
// This is a global setting that can be override the behavior of onsubmit, if set to true, it prioritizes the onsubmit statements of the screen over submitting the form.
pui["prioritize onsubmit event"] = pui["prioritize onsubmit event"] ? pui["prioritize onsubmit event"] : false;
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
  "Pause/Break": 0xBD, // Clear Key
  "Clear": 0xBD,
  "Enter": 0xF1,
  "Alt-F1": 0xF3, // Help Key
  "Help": 0xF3,
  "PageUp": 0xF4,
  "PageDown": 0xF5,
  "Print": 0xF6,
  "RecordBackspace": 0xF8, // Not implemented
  "AutoEnter": 0x3F // Not implemented

};

pui.protectFormat = function(format) {
  var items = format["metaData"]["items"];
  for (var i = 0; i < items.length; i++) {
    var itm = items[i];
    var type = itm["field type"];
    if (type == "checkbox" || type == "combo box" || type == "date field" || type == "password field" || type == "radio button" || type == "select box" || type == "spinner" || type == "text area" || type == "textbox" || type == "graphic button" || type == "hyperlink") {
      if (type == "graphic button" || type == "hyperlink") {
        itm["disabled"] = "true";
      }
      else {
        itm["read only"] = "true";
        itm["set focus"] = "false";
      }
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
  var i; // loop iterator
  var itm;
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
  for (i = 0; i < items.length; i++) {
    itm = items[i];
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
    for (i = 0; i < items.length; i++) {
      itm = items[i];
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
  var oRange;
  var oRangeArr;
  var format;
  var i; // loop iterator
  var j; // loop iterator
  var itm;
  var items;
  function isValueInMultOccurProperty(value, obj, baseProp) {
    var name = baseProp;
    var i = 1;

    while (obj[name] != null && obj[name] != "") {
      if (obj[name] === value) {
        return true;
      }
      i++;
      name = baseProp + " " + i;
    }
    return false;
  }

  var oHigh = null;
  var oGrid = null;
  if (formats.length > 1) {
    var formatsToProtect = new Set();
    var foundProtect = false;

    for (i = formats.length - 1; i >= 0; i--) {
      format = formats[i];
      var isProtected = (
        pui.evalBoundProperty(format["metaData"]["screen"]["protect"], format["data"], format["ref"]) == "true"
      );

      if (isProtected) {
        foundProtect = true;
      }

      if (foundProtect && i !== formats.length - 1) {
        formatsToProtect.add(format);
      }
    }
    for (i = 0; i < formats.length; i++) {
      format = formats[i];
      if (formatsToProtect.has(format)) {
        pui.protectFormat(format);
      }
      var clearLine = format["metaData"]["screen"]["clear line"];
      if (clearLine != null && clearLine != "") {
        oRange = format["metaData"]["screen"]["overlay range"];
        var startingLine = format["metaData"]["screen"]["starting line"];
        if (startingLine == null) {
          if (oRange != null) startingLine = oRange.split("-")[0];
          else startingLine = "1";
        }
        startingLine = parseInt(startingLine);
        if (isNaN(startingLine) || startingLine < 1) startingLine = 1;
        var isInputCapableFormat = false;
        items = format["metaData"]["items"];
        for (var x = 0; x < items.length; x++) {
          itm = items[x];
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
        oRange = format["metaData"]["screen"]["overlay range"];
        if (oRange != null) {
          oRangeArr = oRange.split("-");
          if (oRangeArr.length == 2) {
            oHigh = Number(oRangeArr[1]);
            items = format["metaData"]["items"];
            for (j = 0; j < items.length; j++) {
              itm = items[j];
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
    for (i = 0; i < formats.length; i++) {
      format = formats[i];
      oRange = format["metaData"]["screen"]["overlay range"];
      if (oRange != null) {
        oRangeArr = oRange.split("-");
        if (oRangeArr.length == 2) {
          var oLow = Number(oRangeArr[0]);
          if (!isNaN(oLow) && oLow > oHigh) { // overlay range low of this format is higher than the overlow range high of the subfile control format
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
            items = format["metaData"]["items"];
            for (j = 0; j < items.length; j++) {
              itm = items[j];
              if (itm["grid"] != null) continue;
              var itmType = itm["field type"];
              if (itmType != "panel" && itmType != "css panel" && !pui.isBound(itm["top"]) && !isValueInMultOccurProperty("stationary", itm, "css class")) {
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
  var i;
  pui.dummyBox = null;

  if (pui.oldRenderParms != null && pui.isPreview != true) {
    if (pui.oldRenderParms["layers"]) {
      for (var j = 0; j < pui.oldRenderParms["layers"].length; j++) {
        var layer = pui.oldRenderParms["layers"][j];
        for (i = 0; i < layer.formats.length; i++) {
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

  while (pui.gridsDisplayed.length > 0) {
    var grid = pui.gridsDisplayed.pop();
    if (grid != null && typeof grid.destroy == "function") grid.destroy();
  }

  while (pui.layoutsDisplayed.length > 0) {
    var layout = pui.layoutsDisplayed.pop();
    if (layout != null && typeof layout.destroy == "function") layout.destroy();
  }

  if (typeof FusionCharts != "undefined") {
    while (pui.chartsRendered.length > 0) {
      var chart = pui.chartsRendered.pop();
      if (chart != null && FusionCharts(chart)) {
        FusionCharts(chart).dispose();
      }
    }
  }

  // Widgets and DOM nodes that have a "destroy" method.
  while (pui.widgetsToCleanup.length > 0) {
    var widget = pui.widgetsToCleanup.pop();
    if (widget != null && typeof widget.destroy == "function") widget.destroy();
  }

  while (pui.screenEventsToCleanup.length > 0) {
    var ref = pui.screenEventsToCleanup.pop();
    if (typeof ref === "object" && ref !== null) {
      ref.eventObj.removeEventListener(ref.eventName, ref.eventFunc);
    }
  }

  for (var prop in pui.restoreStyles) {
    document.body.style[prop] = pui.restoreStyles[prop];
  }
  pui.restoreStyles = {};

  if (!pui["keep frames"]) pui.killFrames();
};

pui.resizeTimeout = 0;
/**
 * Listener for resize events on "window". (Registered at the beginning of pui.render; called directly in mobileEmulator.js.)
 * Tell all immediate children of runtime container that it resized. All layouts are reached recursively.
 * @param {Event} event
 */
pui.resize = function(event) {
  if (pui.runtimeContainer == null) return;

  clearTimeout(pui.resizeTimeout); // throttle resizing
  pui.resizeTimeout = setTimeout(pui.resizeChildrenOf, 10, pui.runtimeContainer);
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
  var prop;
  var i; // loop iterator
  var j; // loop iterator
  var format;

  pui.widgetsToPostRender = [];

  if (pui.recordTest) pui.record(parms);
  pui.clientLogic = parms.clientLogic;

  if (typeof pui["beforeRender"] === "function") {
    var rv = pui["beforeRender"](parms);
    if (rv) parms = rv;
  }
  // Set the local parameter for PJS version
  if (parms["pjsVersion"] != null) {
    pui.pjsVersion = parms["pjsVersion"];
  }

  if (typeof pui.pjsDefaultMode_original == "undefined") {
    pui.pjsDefaultMode_original = pui["pjsDefaultMode"] || null;
  }
  if (parms["pjsDefaultMode"]) {
    pui["pjsDefaultMode"] = parms["pjsDefaultMode"];
  }
  else {
    pui["pjsDefaultMode"] = pui.pjsDefaultMode_original;
  }

  if (typeof pui.widgetURLPrefix_original == "undefined") {
    pui.widgetURLPrefix_original = pui["widgetURLPrefix"] || null;
  }
  if (parms["pjsWidgetURLPrefix"]) {
    pui["widgetURLPrefix"] = parms["pjsWidgetURLPrefix"];
  }
  else {
    pui["widgetURLPrefix"] = pui.widgetURLPrefix_original;
  }

  pui.pjs_session_id = null;
  if (parms["pjs_id"]) {
    pui.pjs_session_id = parms["pjs_id"];
  }

  if (parms["pjsDatabaseConnections"]) {
    pui["databaseConnections"] = parms["pjsDatabaseConnections"];
  }

  pui.nodejs = (parms["nodejs"] === true);
  pui.ejsData = null;
  // Error Handling for client
  if (parms["version"] != null && pui["version"] != null && parms["version"] != pui["version"]) {
    var msg = null;
    var parmVersion = parms["version"].split(".");
    var parmBaseVersion = parmVersion.shift();
    var parmFixPack = parmVersion.join(".");
    if (parms["nodejs"]) {
      var compVers = pui["getVersionComparer"]();
      if (compVers["isLessThan"](pui["version"], parms["version"])) { // nodejs sends min version
        msg = "Installed copy of Profound.js requires Profound UI client-side Version " + parmBaseVersion + ", Fix Pack " + parmFixPack + " or above. Profound UI client-side version is Version " + pui["baseVersion"] + ", Fix Pack " + pui["fixPackVersion"] + ".";
      }
    }
    else {
      msg = "Profound UI server-side (Version " + parmBaseVersion + ", Fix Pack " + parmFixPack + ") doesn't match client-side JavaScript (Version " + pui["baseVersion"] + ", Fix Pack " + pui["fixPackVersion"] + ")";
    }
    if (msg != null && window.console && window.console.error) {
      console.error(msg);
    }
  }
  // Identifying the version of Internet explorer.
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

  if (!pui.isPreview && !pui.backButtonSetup && history.pushState != null && history.replaceState != null) {
    var withinNodeRunEmbedBox = (window.parent && window.parent != window && pui.windowAccessible(window.parent) && window.parent.noderun);
    if (!withinNodeRunEmbedBox) {
      history.replaceState({ puipage: "previous" }, document.title);
      history.pushState({ puipage: "current" }, document.title);
      addEvent(window, "popstate", pui.popstate);
      pui.backButtonSetup = true;
    }
  }

  // React can render multiple screens as components, so we can't clean up other components when a new one is rendered
  if (!window["React"] && !window["Vue"]) {
    pui.cleanup();
  }

  pui.oldRenderParms = parms;

  // handle errors
  var success = parms.success;
  if (success == null) success = true;
  if (!success) {
    document.body.innerHTML = "<h1>Unrecoverable Error</h1> <p>Unrecoverable error <strong>" + parms["exception"] + "</strong> occurred while handling an exception. The original exception id is <strong>" + parms["cause"] + "</strong>.</p> <p>Please contact the server administrator to determine the cause of the problem.";
    pui.screenIsReady = true; // Allow Atrium tabs to be closed when there is an Unrecoverable Error.
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
    for (prop in parms["ctrlJob"]) {
      pui["ctrlJob"][prop] = parms["ctrlJob"][prop];
    }
  }

  if (pui.iPadEmulation && !pui.iPhoneEmulation) {
    getObj("ipadKeyboard").style.display = "none";
  }

  if (!pui.isAutoTesting) {
    pui.attachOnUserActivity();
  }
  if (pui.handler == null) {
    pui.timeout = parms["timeout"];
    try {
      var atriumSettings = Atrium["getSettings"]();
    }
    catch (error) {
    }
    var atriumTimeout = (atriumSettings && atriumSettings["ACTIMEOUT"] === "1");
    if (!pui.isAutoTesting) {
      if (!atriumTimeout && pui["client side timeout"] == true) {
        pui.timeoutMonitor.start();
      }
      else {
        pui.autoKeepAlive.setup();
      }
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
  pui.responseRoutine = null;
  pui.responseRoutineRow = null;
  pui.responseRoutineGrid = null;
  pui.placeCursorOnSubfile = false;
  pui.activeElement = null;
  pui.sendBackButtonResponse = false;
  pui.autoPageGrid = false;

  var translateError = pui.translate(parms);
  if (translateError != null) {
    pui.alert(translateError);
  }

  if (parms["message"]) {
    format = parms["message"]["format"].toLowerCase();
    pui["message"] = parms["message"]["message"];
    pui.resetResponseValues();
    pui.hideWaitAnimation();
    if (pui.onmessageProps && pui.onmessageProps[format]) {
      try {
        eval('var message = pui["message"];');
        eval(pui.onmessageProps[format]);
      }
      catch (err) {
        pui.scriptError(err, "Onmessage Error:\n");
      }
    }
    return;
  }

  if (parms["html"]) {
    // Render html
    pui.clearChildNodes(parms.container);
    parms.container.innerHTML = parms["html"];
    parms.container.style.width = "100%";
    if (pui.genie && pui.genie.middleDiv != null) pui.genie.middleDiv.style.width = "100%";
    // Evaluate any <script> tags in the html
    var scripts = parms.container.getElementsByTagName("script");

    var loadScript = function(idx) {
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
    };
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

  for (i = 0; i < layers.length; i++) {
    pui.overlayAdjust(layers[i].formats);
  }

  // handle document title property
  if (layers.length > 0) {
    var layer = layers[layers.length - 1];
    if (layer.formats.length > 0) {
      format = layer.formats[layer.formats.length - 1];
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
  if (pui["wikihelp"]["overlays"] != null) {
    while (pui["wikihelp"]["overlays"].length > 0) {
      var overlay = pui["wikihelp"]["overlays"].pop();
      if (overlay.parentNode != null && typeof overlay.parentNode.removeChild == "function") {
        overlay.parentNode.removeChild(overlay);
      }
      // Try to delete the extra object from the node. IE<8 can't delete it, so catch.
      try {
        delete overlay["pui"];
      }
      catch (ex) {}
      overlay = null;
    }
  }
  // Create a list to allow finding, hiding, and showing wiki-help overlays.
  pui["wikihelp"]["overlays"] = [];

  pui.windowStack = [];

  for (i = 0; i < layers.length; i++) {
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
    pui.responseRoutine = null;
    pui.responseRoutineRow = null;
    pui.responseRoutineGrid = null;

    var formats = layers[i].formats;
    if (i == 0) {
      pui.lastWindow = null;
      pui.lastWindowLeft = null;
      pui.lastWindowTop = null;
      var animation = null;
      if (formats.length > 0 && formats[0].metaData != null && formats[0].metaData.screen != null) {
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
        var setupObj = {
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
        pui.clearChildNodes(parms.container);
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
          for (j = 0; j < refItems.length; j++) {
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
    for (j = 0; j < formats.length; j++) {
      format = formats[j];
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

  if (!pui.lastFormatName && pui["format"]) {
    pui.lastFormatName = pui["format"];
  }

  if (animation) pui.transitionAnimation.animate();

  if (!pui.isAutoTesting && pui.focusField != null && pui.focusField.dom != null && (!pui.placeCursorOnSubfile || pui.cursorValues.setRow != null || pui.cursorValues.setColumn != null || pui.focusField.setFocusFlag == true)) {
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
                    if (tr != null && tr.collapse != null && tr.select != null) {
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
    if (!pui.isAutoTesting) pui["focusOnContainer"]();
  }

  pui.screenIsReady = true;

  // Perform any post-render processing
  if (pui.widgetsToPostRender) {
    while (pui.widgetsToPostRender.length > 0) {
      var widget = pui.widgetsToPostRender.shift();
      if (widget && typeof widget.postRender === "function") {
        widget.postRender();
      }
    }
  }

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
pui.setupGridsDisplayedScrollBar = function() {
  for (var i = 0; i < pui.gridsDisplayed.length; i++) {
    var grid = pui.gridsDisplayed[i];
    if (grid.scrollbarObj != null && !grid.scrollBarsSetupAfterRender) {
      if (grid.scrollbarObj.attachOnScroll != null && typeof grid.scrollbarObj.attachOnScroll == "function") {
        grid.scrollbarObj.attachOnScroll();
      }
      grid.scrollbarObj.ready = true;
      if (grid.scrollbarObj.rowsPerPage == 1) grid.scrollbarObj.draw();
      // Needed so grids in lazy-load layouts are processed, but no grids are processed twice.
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
  var propname;
  var msg;
  var designItem;
  var wfData;
  var propValue;
  var dateISO;
  var gridDom;
  var cls;
  var boxDom;
  var box;
  var shortcutKey;
  var suffix;
  var fieldType;
  var fieldName;
  var top;
  var errors;
  var time = timer();
  var widget;
  // retrieve parameters
  var isDesignMode = parms.designMode;
  if (isDesignMode == null) isDesignMode = false;
  var screenProperties = parms.metaData.screen;
  var items = parms.metaData.items;
  var ddsFieldOrder = parms.metaData["dds field order"];
  var dspfRecordLayout = parms.metaData["dspf record layout"];
  var subfileFieldOrder = parms.metaData["subfile field order"];
  var designer = parms.designer;
  var data = parms.data;
  var formatName = parms.name;
  var isWin = false;
  var ctlErrors = [];
  var ctlErrorMap = {};
  var strictTabControl = pui["strict tab control"];

  // Detect when code should only run if renderFormat is called for the record format (not grid or layout).
  var isMainFormat = parms.rowNum == null && parms.lazyContainerNum == null;

  if (pui["controller"] != null && screenProperties != null) {
    suffix = "";
    var cnt = 1;
    propname = "error condition";
    while (screenProperties[propname + suffix]) {
      var condition = pui.evalBoundProperty(screenProperties[propname + suffix], data);
      if (condition == "1") {
        msg = pui.evalBoundProperty(screenProperties["error message" + suffix], data);
        ctlErrors.push({ "msg": msg });
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
    formatName = formatName || pui["format"];
    pui.keyMap[formatName] = {};
    var namePrefix = pui.handler == null ? formatName + "." : "";
    // Note: all "return cursor location", RTNCSRLOC, fields need to be output for each format that uses them, even with overlays. Issue 4920.
    var obj = parms.metaData.screen["return cursor record"];
    if (pui.isBound(obj)) {
      if (pui.cursorFields.record == null) pui.cursorFields.record = {};
      pui.cursorFields.record[namePrefix + pui.fieldUpper(obj["fieldName"])] = true;
    }
    obj = parms.metaData.screen["return cursor field"];
    if (pui.isBound(obj)) {
      if (pui.cursorFields.field == null) pui.cursorFields.field = {};
      pui.cursorFields.field[namePrefix + pui.fieldUpper(obj["fieldName"])] = true;
    }
    obj = parms.metaData.screen["return cursor position"];
    if (pui.isBound(obj)) {
      if (pui.cursorFields.position == null) pui.cursorFields.position = {};
      pui.cursorFields.position[namePrefix + pui.fieldUpper(obj["fieldName"])] = true;
    }
    obj = parms.metaData.screen["return cursor row"];
    if (pui.isBound(obj)) {
      if (pui.cursorFields.row == null) pui.cursorFields.row = {};
      pui.cursorFields.row[namePrefix + pui.fieldUpper(obj["fieldName"])] = true;
    }
    obj = parms.metaData.screen["return cursor column"];
    if (pui.isBound(obj)) {
      if (pui.cursorFields.column == null) pui.cursorFields.column = {};
      pui.cursorFields.column[namePrefix + pui.fieldUpper(obj["fieldName"])] = true;
    }

    obj = parms.metaData.screen["changed"];
    if (pui.isBound(obj)) pui.changedFields[formatName] = namePrefix + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["window left"];
    if (pui.isBound(obj)) pui.windowLeftField = namePrefix + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["window top"];
    if (pui.isBound(obj)) pui.windowTopField = namePrefix + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["valid command key"];
    if (pui.isBound(obj)) pui.validCommandKeyField = namePrefix + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["back button"];
    if (pui.isBound(obj)) pui.backButtonField = namePrefix + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["dd element id"];
    if (pui.isBound(obj)) pui.dragDropFields.ddElementId = namePrefix + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["dd record number"];
    if (pui.isBound(obj)) pui.dragDropFields.ddRecordNumber = namePrefix + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["target element id"];
    if (pui.isBound(obj)) pui.dragDropFields.targetElementId = namePrefix + pui.fieldUpper(obj["fieldName"]);
    obj = parms.metaData.screen["target record number"];
    if (pui.isBound(obj)) pui.dragDropFields.targetRecordNumber = namePrefix + pui.fieldUpper(obj["fieldName"]);

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

    if (parms.lastLayer && screenProperties["strict tab control"] != null && screenProperties["strict tab control"] != "") {
      strictTabControl = (pui.evalBoundProperty(screenProperties["strict tab control"], data, parms.ref) === "true");
    }
  }

  // set record format level properties in Designer.
  if (isDesignMode) {
    designer.currentScreen.name = screenProperties["record format name"];
    if (designer.currentScreen.name == null || designer.currentScreen.name == "") {
      designer.currentScreen.name = "[Unnamed Screen]";
    }
    for (propname in screenProperties) {
      propValue = screenProperties[propname];
      designer.screenProperties[designer.currentScreen.screenId][propname] = propValue;
      designer.screenPropertiesChanged[designer.currentScreen.screenId][propname] = true;

      if (pui.wf.tracker && pui.isRoutine(propValue)) {
        if (isDesignMode) {
          wfData = {};
          if (parms.keepRoutines) wfData = null;
          if (pui.display && typeof pui.display.logic === "object" && typeof pui.display.logic[propValue.routine] === "object") {
            wfData = pui.display.logic[propValue.routine];
          }
          pui.wf.tracker.update({
            name: propValue.routine,
            designItem: designer,
            designer: designer,
            property: propname,
            data: wfData
          });
        }
      }

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
        }, designer, true);
      }
    }

    // 7415. Send field order to designer
    designer.ddsFieldOrder = ddsFieldOrder;
    designer.subfileFieldOrder = subfileFieldOrder;
    if (dspfRecordLayout) designer.addDspfRecordLayout(dspfRecordLayout);
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
  var lazyLayouts = {}; // Collection of layouts whose contents load later. key: DOM ID of layout;
  // value: when value is a pui.Layout, then it is a lazy-loaded layout being rendered on this pass.
  //  when value is an object like {root: a pui.Layout, container: n }, then this is a container that
  //  is inside the lazy layout, and this container will be rendered on a later pass.
  var treeLevelItemAdded = false;
  if (parms.treeLevelItem !== undefined && parms.treeLevelItem !== null) {
    items.push(parms.treeLevelItem); // temp only; removed after loop below is done
    treeLevelItemAdded = true;
  }
  for (var i = 0; i < items.length; i++) {
    if (parms["hideControlRecord"] == true && !isDesignMode && items[i]["field type"] != "grid" && items[i]["grid"] == null && items[i]["cursor row"] != null) {
      continue;
    }

    if (!isDesignMode && parms.rowNum != null && items[i]["field type"] == "output field" && items[i]["visibility"] == "hidden") {
      top = parseInt(items[i]["top"]);
      var left = parseInt(items[i]["left"]);
      if (!isNaN(top) && top < 0 && !isNaN(left) && left < 0) {
        // don't render subfile hidden fields - this improves performance
        continue;
      }
    }

    // don't allow invisible(auto arrange)/disabled function key buttons to be activated by a shortcut key
    // this is accomplished by removing the "shortcut key" property
    if (!isDesignMode) {
      var autoArrange = items[i]["auto arrange"] || "false";
      if (autoArrange == "true" || (pui.isBound(autoArrange) && pui.evalBoundProperty(autoArrange, data, parms.ref) == "true")) {
        var vis = items[i]["visibility"];
        if (vis == "hidden" || (pui.isBound(vis) && pui.evalBoundProperty(vis, data, parms.ref) == "hidden")) {
          if (items[i]["shortcut key"] != null) delete items[i]["shortcut key"];
        }
      }
    }
    if (!isDesignMode && items[i]["shortcut key"] != null) {
      var dis = items[i]["disabled"];
      if (dis == "true" || (pui.isBound(dis) && pui.evalBoundProperty(dis, data, parms.ref) == "true")) {
        delete items[i]["shortcut key"];
      }
    }

    // "export file name" property replaced "csv file name"; this supports files using older property.
    if (items[i]["csv file name"] != null && items[i]["export file name"] == null) {
      items[i]["export file name"] = items[i]["csv file name"];
    }

    // Detect the item's container: a grid or layout.
    var gridObj = null;
    var container = null;
    var gridId = items[i].grid;
    var layoutId = items[i]["layout"];
    if (gridId != null) { // item belongs to a grid. Note: in parms.items, grid must come before its items; else, item won't render in grid.
      gridDom = getObj(gridId);
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
            if (items[i].domEls != null) delete items[i].domEls; // must not be present, may be there from cached mvc response object
            gridObj.runtimeChildren.push(items[i]);
            continue;
          }

          // Resolve translations.
          msg = "";
          msg += pui.doTranslate(items[i], pui.translationMap, pui.translationMap2, false, gridObj.translationPlaceholderMap);

          if (msg != "") {
            pui.alert("Missing translation data:\n\n" + msg);
          }
        }
      }
      else if (lazyLayouts[gridId] != null) {
        // The item is inside a grid that is a child of a lazy layout.
        saveItemForLazyLoad(gridId, items[i]);
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
        if (lazyLayouts[layoutId] != null) {
          saveItemForLazyLoad(layoutId, items[i], containerNumber);
          continue;
        }
        else {
          // The item is in a non-lazy layout.
          container = layoutDom.layout.containers[containerNumber - 1];
        }
      }
      else if (lazyLayouts[layoutId] != null) {
        // The item is inside a layout that is a child of a lazy layout.
        saveItemForLazyLoad(layoutId, items[i]);
        continue;
      }
    }

    // If the item wasn't in a grid or layout, set its container to the canvas or a parameter.
    if (container == null) {
      if (isDesignMode) container = designer.container;
      else container = parms.container;
    }

    // Create dom element for item.
    var dom;
    if (!isDesignMode && parms.subfileRow != null && items[i].domEls != null && items[i].domEls[parms.subfileRow - 1] != null) {
      // Item is already created inside a grid, so use that element.
      dom = items[i].domEls[parms.subfileRow - 1];
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
        if (parms.highlighting != null && parms.highlighting.text != "" && (String(items[i]["column"]) === String(parms.highlighting.col) || parms.highlighting.col === "*all")) {
          if (dom.tagName == "DIV") {
            pui.highlightText(dom, parms.highlighting.text);
            dom.highlighted = true;
          }
        }
      }
    }
    else {
      widget = pui.widgets[items[i]["field type"]];
      if (typeof widget === "object" && widget !== null && typeof widget.tag === "string" && widget.tag.length > 0) {
        // Attempt to avoid a mismatch in applyPropertyToField and thus memory leaks.
        dom = document.createElement(widget.tag);
        dom.type = widget.inputType;

        // PUI-704: widget properties need to be evaluated at least once, except in IDE/Designer.
        if (!isDesignMode) dom.mismatch = true;
      }
      else {
        dom = document.createElement("div");
      }

      dom.style.position = "absolute";
      dom.setAttribute("puiwdgt", items[i]["field type"]); // Mark the dom Element to assist with styling in profoundui.css. Sets absolute position.
      var leftpx = items[i].left;
      var toppx = items[i].top;
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
      designItem = null;
      if (isDesignMode) {
        designItem = designer.addItem(dom, true);
        designItem.properties = properties;
        designItem.properties.newitem = "true";
        designItem.propertiesChanged.newitem = true;
        fieldType = items[i]["field type"];
        if (fieldType == "styled button" || fieldType == "panel" || fieldType == "css panel" || fieldType == "css button" || fieldType == "Layout") {
          designItem.dom.style.borderStyle = "none";
        }
      }
      var rangeLowDateISO = null;
      var rangeHighDateISO = null;
      // get properties for the item and put them into the "properties" object.
      for (var prop in items[i]) {
        if (prop == "domEls") continue;
        propValue = items[i][prop];
        var newValue;
        if (pui.wf.tracker && pui.isRoutine(propValue)) {
          if (isDesignMode) {
            wfData = {};
            if (parms.keepRoutines) wfData = null;
            if (pui.display && typeof pui.display === "object" && typeof pui.display.logic === "object" && typeof pui.display.logic[propValue.routine] === "object") {
              wfData = pui.display.logic[propValue.routine];
            }
            pui.wf.tracker.update({
              name: propValue.routine,
              designItem: designItem,
              designer: designer,
              property: prop,
              data: wfData
            });
          }
        }
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
            }, designer, true);
            newValue = propValue;
          }
          else {
            if (pui.isSQLProp(prop)) dom.hasBoundSQLProps = true;
            if (propValue["longName"] && propValue.fieldName) {
              if (!propValue["lowerCaseField"] && pui.handler == null) {
                pui.longFieldNameTable[pui.fieldUpper(propValue["longName"])] = pui.fieldUpper(propValue.fieldName);
                pui.longFieldNameTable[pui.fieldUpper(propValue.fieldName)] = pui.fieldUpper(propValue["longName"]);
              }
              else {
                pui.longFieldNameTable[propValue["longName"]] = propValue.fieldName;
                pui.longFieldNameTable[propValue.fieldName] = propValue["longName"];
              }
            }
            if (items[i]["field type"] == "grid" && (prop == "row background" || prop == "row font color")) {
              // These grid properties are per-record fields; values can be different per record. To avoid letting an indicator's
              // off-value become the color for each row, this must be blank or not evaluated here. Issue 4775. 6391.
              newValue = "";
            }
            else if (prop.includes("grid row translation placeholder value") && items[i]["field type"] == "grid") {
              newValue = propValue;
            }
            else if (prop.includes("translation placeholder value") && items[i]["grid"] != null) {
              newValue = propValue;
            }
            else {
              propValue["revert"] = false;
              newValue = pui.evalBoundProperty(propValue, data, parms.ref);
              // normalize range low/high for date data type
              if ((prop == "range low" || prop == "range high") && propValue.dataType == "date") {
                var dateFormatSave = propValue.dateFormat;
                propValue.dateFormat = "Y-m-d"; // convert to *ISO format YYYY-DD-DD
                dateISO = pui.evalBoundProperty(propValue, data, parms.ref);
                propValue.dateFormat = dateFormatSave; // put back saved value
                if (prop == "range low") {
                  rangeLowDateISO = dateISO;
                }
                else {
                  rangeHighDateISO = dateISO;
                }
              }
            }

            if (prop == "value" || prop == "html") {
              // assign cursor record and field
              dom.cursorRecord = formatName;
              dom.cursorField = pui.fieldUpper(propValue.fieldName);

              if (dom["pui"] == null) dom["pui"] = {}; // Expose field and format for custom widgets. #3440.
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
                // also remove numeric formatting when using choices url, since it is capable of
                // providing both option and value, and they may not both be numeric.
                var textUrl = pui.evalBoundProperty(items[i]["choices url"], data, parms.ref);
                if (textUrl != null && textUrl != "" && propValue["formatting"] == "Number") {
                  propValue["formatting"] = "Text";
                  propValue.keyFilter = null;
                  propValue.maxLength = null;
                }
              }
            }
            if (prop == "cursor record number") {
              pui.cursorRRNs[(pui.handler == null ? formatName + "." : "") + pui.fieldUpper(propValue.fieldName)] = dom;
            }
            else if (prop == "subfile return rrn") {
              pui.returnRRNs[(pui.handler == null ? formatName + "." : "") + pui.fieldUpper(propValue.fieldName)] = dom;
            }
            else if (prop == "return mode") {
              pui.sflModes[(pui.handler == null ? formatName + "." : "") + pui.fieldUpper(propValue.fieldName)] = dom;
            }
            else if (prop == "column sort response") {
              dom.columnSortResponseField = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(propValue.fieldName);
            }
            else if (prop == "field name sort response") {
              dom.fieldNameSortResponseField = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(propValue.fieldName);
              dom.fieldNameSortResponseFieldLength = propValue.dataLength;
            }
            else if (prop == "initial sort field") {
              dom.initialSortFieldLength = propValue.dataLength;
            }
            else if (prop == "filter response") {
              dom.filterResponseField = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(propValue.fieldName);
            }
            else if (prop == "subfile changed") {
              pui.subfileChangedFields[properties["record format name"]["toLowerCase"]()] = pui.fieldUpper(propValue.fieldName);
            }
            if (prop == "column sort response" || prop == "field name sort response") {
              if (pui.isBound(items[i]["return sort order"])) {
                dom.returnSortOrderField = (pui.handler == null ? formatName + "." : "") + pui.fieldUpper(items[i]["return sort order"].fieldName);
              }
            }
          }
        } // endif bound to a field
        else { // not bound to a field
          if (!isDesignMode && container != null && container.isPUIWindow) {
            if (container.signature == null) container.signature = "";
            if (prop == "id" || prop == "top" || prop == "left") {
              container.signature += propValue;
            }
          }

          newValue = propValue; // resolved value for property NOT bound to a field

          // normalize range low/high for date data type, for specified literals
          if ((prop == "range low" || prop == "range high") && items[i].value && items[i].value.dataType == "date") {
            var dateFieldValue = items[i].value;
            var formattingObjTemp = {};

            // dummy up an object to pass to pui.FieldFormat.format() to convert to *ISO
            // this formattingObjTemp has no keyword, so the "To-Format" would be *ISO
            formattingObjTemp.dataType = dateFieldValue.dataType;
            formattingObjTemp.dateFormat = dateFieldValue.dateFormat; // "From-Format": date format in json
            formattingObjTemp.formatting = dateFieldValue.formatting;
            formattingObjTemp.locale = dateFieldValue.locale;
            formattingObjTemp.value = newValue; // rangeLow/rangeHigh value in json format
            formattingObjTemp.revert = true; // back to *ISO format
            dateISO = pui.FieldFormat.format(formattingObjTemp);

            if (prop == "range low") {
              rangeLowDateISO = dateISO;
            }
            else {
              rangeHighDateISO = dateISO;
            }
          }
        } // endif not bound to a field

        if (items[i].grid != null && !isDesignMode) { // Resolve translation placeholder values
          switch (prop) {
            case "value":
            case "tab names":
            case "header text":
            case "export file name":
            case "tool tip":
            case "on text":
            case "off text":
            case "html":
            case "label":
            case "alternate text":
            case "empty text":
            case "placeholder":
            case "choices":
            case "blank option label":
            case "names":
              var gridTranslationPlaceholderMap = null;
              gridDom = getObj(items[i].grid);
              if (gridDom != null) {
                gridTranslationPlaceholderMap = gridDom.grid.translationPlaceholderMap;
                if (gridTranslationPlaceholderMap != null) {
                  if (gridTranslationPlaceholderMap.keys != null && gridTranslationPlaceholderMap.values != null) {
                    var tempTranslationPlaceholderMap = { keys: [], values: [] };
                    for (key in gridTranslationPlaceholderMap.keys) {
                      tempTranslationPlaceholderMap.keys.push(gridTranslationPlaceholderMap.keys[key]);
                    }
                    for (value in gridTranslationPlaceholderMap.values) {
                      tempTranslationPlaceholderMap.values.push(pui.evalBoundProperty(gridTranslationPlaceholderMap.values[value], data, parms.ref));
                    }

                    tempTranslationPlaceholderMap = pui.addWidgetTranslationPlaceholders(items[i], tempTranslationPlaceholderMap, data, parms.ref);

                    for (var p = 0; p < tempTranslationPlaceholderMap.keys.length; p++) {
                      newValue = newValue["replaceAll"]("(&" + tempTranslationPlaceholderMap.keys[p] + ")", tempTranslationPlaceholderMap.values[p]);
                    }
                  }
                }
              }
          }
        }
        properties[prop] = newValue;
      } // endfor thru all properties

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
      for (propname in properties) {
        var propConfig;
        if (dom.propertiesNamedModel == null) propConfig = pui.getPropConfig(namedModel, propname);
        else propConfig = pui.getPropConfig(dom.propertiesNamedModel, propname);
        if (propConfig != null) {
          propValue = properties[propname];
          if (!isDesignMode) {
            var formattingObj = items[i][propname];

            // if (pui.isRoutine(formattingObj)) {
            //  if (propname == "response") {
            //    var shortcutKey = properties["shortcut key"];
            //    if (shortcutKey != null && shortcutKey != "") {
            //      if (pui.keyMap[formatName] == null) pui.keyMap[formatName] = {};
            //      if (pui.keyMap[formatName][shortcutKey] == null) pui.keyMap[formatName][shortcutKey] = [];
            //      pui.keyMap[formatName][shortcutKey].push(dom);
            //      dom.shortcutKey = shortcutKey;
            //    }
            //    if (gridId == null) {
            //      dom.responseValue = "0";
            //    }
            //    if (properties["onclick"] == null || properties["onclick"] == "") {
            //      dom.responseRoutine = formattingObj.routine;
            //      pui.attachResponse(dom);
            //    }
            //  }
            // }

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
                    (!formattingObj["units"] || formattingObj["units"] == "") &&
                    pui.appJob.decimalFormat != "I" && pui.appJob.decimalFormat != "J") {
                  dom.type = "number"; // Field uses numeric keyboard in Android.
                  // Note: iOS could show a number-only keyboard when .pattern="[0-9]*"; but that keyboard
                  // has no "-", and Y format allows "-". The iOS keyboard  has numbers and characters.

                  // Browsers do not respect the maxlength attribute when input type="number"; so enforce the length manually. #3582.
                  if (formattingObj["maxLength"] > 0) {
                    // Note: if the input were invalid (NaN), the .value property would be ""; so the length could not be
                    // checked. Prevent a trailing dash from invalidating the value, and length enforcement still works.
                    // Soft and hardware backspace keys do not fire textInput events.
                    addEvent(dom, "textInput", function(e) {
                      var target = getTarget(e);
                      if (target == null || target.value == null) return;
                      // When the field is empty, .value is "" and validity.valid is true. Allow dash. When validity.valid
                      // is false, then the field is not empty. Prevent, because another dash would not make it valid.
                      // If the field is not empty and is valid, a trailing dash would invalidate. Deny.
                      if (e.data == "-" && target["validity"] != null &&
                      ((target.value != "" && target["validity"].valid) || !target["validity"].valid)) {
                        preventEvent(e);
                      }
                      // Prevent field from becoming too long.
                      else if (target.maxLength > 0 && target.value.length >= target.maxLength) {
                        preventEvent(e);
                      }
                    });
                  } // endif maxLength > 0.
                }
              }

              var qualField;
              if (propname == "changed") {
                setFieldNameAndQualField();
                if (pui.changeResponseElements[qualField] == null) pui.changeResponseElements[qualField] = [];
                pui.changeResponseElements[qualField].push(dom);
              }

              if (propname == "is blank") {
                setFieldNameAndQualField();
                if (pui.isBlankElements[qualField] == null) pui.isBlankElements[qualField] = [];
                pui.isBlankElements[qualField].push(dom);
              }

              if (propname == "dup key response" && properties["allow dup key"] == "true") {
                setFieldNameAndQualField();
                if (pui.dupElements[qualField] == null) pui.dupElements[qualField] = [];
                pui.dupElements[qualField].push(dom);
              }

              if (pui.isInputCapableProperty(propname, dom)) {
                setFieldNameAndQualField();
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
                    try { // IE9 doesn't support this syntax any more;
                      newDom = document.createElement('<input name="' + radioName + '" type="radio">');
                    }
                    catch (e) {
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
                    newDom.parentTabPanel = dom.parentTabPanel;
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

                var isDataGrid = (gridObj != null && gridObj.isDataGrid() == true);
                if (!isDataGrid && pui.responseElements[qualField] == null) pui.responseElements[qualField] = [];

                // When widget in a subfile is changed with setDataValue() prior to rendering
                // the element, there will be an entry in pui.responseElements with "modifiedBeforeRender" set.
                // Now that we are actually rendering the element, we replace that entry with the proper DOM element.
                if (!isDataGrid && pui.responseElements[qualField][0] != null && pui.responseElements[qualField][0].modifiedBeforeRender) {
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
                else if (!isDataGrid) {
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
                  cls = dom.tabPanel;
                  if (cls) cls.sendTabResponse = true;
                }
                if (propname == "active tab") {
                  cls = dom.tabPanel;
                  if (cls) cls.sendActiveTab = true;
                }
                if (propname == "response") {
                  shortcutKey = properties["shortcut key"];
                  if (shortcutKey != null && shortcutKey != "") {
                    if (pui.keyMap[formatName] == null) pui.keyMap[formatName] = {};
                    if (pui.keyMap[formatName][shortcutKey] == null) pui.keyMap[formatName][shortcutKey] = [];
                    pui.keyMap[formatName][shortcutKey].push(dom);
                    dom.shortcutKey = shortcutKey;
                  }
                  if (gridId == null) {
                    dom.responseValue = "0";
                  }
                  if (properties["onclick"] == null || properties["onclick"] == "" || pui.isRoutine(properties["onclick"])) {
                    if (pui.isRoutine(properties["onclick"])) dom.responseRoutine = properties["onclick"].routine;
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
              else if (dom.pui && dom.pui.widget && dom.pui.widget.isInputCapableProp(propname)) {
                setFieldNameAndQualField();
                if (pui.responseElements[qualField] == null) pui.responseElements[qualField] = [];
                pui.responseElements[qualField].push(dom);
                dom.pui.widget.setFormattingObj(propname, formattingObj, qualField);
              }
            }

            if (propname == "selection field" && properties["field type"] == "grid") {
              if (pui.isBound(items[i]["selection field"])) {
                dom.grid.selectionField = items[i]["selection field"];
              }
            }

            if (propname == "row is hidden field" && properties["field type"] == "grid") {
              if (pui.isBound(items[i]["row is hidden field"])) {
                dom.grid.hiddenField = items[i]["row is hidden field"];
              }
            }

            if (propname == "tree level field" && properties["field type"] == "grid") {
              if (pui.isBound(items[i]["tree level field"])) {
                dom.grid.treeLevelField = items[i]["tree level field"]["fieldName"];
                dom.grid.hasTreeLevelColumn = true;
                dom.grid.sortable = false;
                if (dom.grid.treeLevelColumnId == null) {
                  dom.grid.treeLevelColumnId = 0;
                }
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

            if (propname.includes("grid row translation placeholders") && properties["field type"] == "grid") {
              dom.grid.translationPlaceholderMap = pui.buildTranslationPlaceholderMap(null, items[i], null, data, parms.ref);
            }

            if (propname == "shortcut key" && propValue != null && propValue != "" && !pui.isBound(items[i]["response"])) {
              if (pui.keyMap[formatName] == null) pui.keyMap[formatName] = {};
              if (pui.keyMap[formatName][propValue] == null) pui.keyMap[formatName][propValue] = [];
              pui.keyMap[formatName][propValue].push(dom);
              dom.shortcutKey = propValue;
              if (gridId == null) {
                dom.responseValue = "0";
              }
              if (properties["onclick"] == null || properties["onclick"] == "" || pui.isRoutine(properties["onclick"])) {
                if (pui.isRoutine(properties["onclick"])) dom.responseRoutine = properties["onclick"].routine;
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
                  if (dom.floatingPlaceholder != null) pui.focusField.dom = dom.floatingPlaceholder.getBox();
                  pui.focusField.setFocusFlag = true;
                }
              }
            }
            if (propname == "focus class" && !pui.isBound(propValue) && trim(propValue) != "") {
              if (dom["pui"]["properties"]["field type"] === "combo box") {
                box = dom.comboBoxWidget.getBox();
                box.focusClass = trim(propValue);
                addEvent(box, "focus", pui.applyFocusClass);
                addEvent(box, "blur", pui.removeFocusClass);
              }
              else {
                dom.focusClass = trim(propValue);
                addEvent(dom, "focus", pui.applyFocusClass);
                addEvent(dom, "blur", pui.removeFocusClass);
              }
            }
            if (propname == "required" && propValue == "true") {
              dom.puirequired = true;
              if (dom.floatingPlaceholder != null) dom.floatingPlaceholder.getBox().puirequired = true;
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
              boxDom = dom;
              if (dom.comboBoxWidget != null) boxDom = dom.comboBoxWidget.getBox();
              if (dom.floatingPlaceholder != null) boxDom = dom.floatingPlaceholder.getBox();
              boxDom.autoAdvance = true;
              addEvent(boxDom, "keyup", pui.autoAdvanceOnKeyUp);
            }
            if (propname == "allow dup key" && propValue == "true") {
              addEvent(dom, "keydown", pui.dupKey);
            }
            var allowFieldExit = false;
            if ((pui["always allow field exit"] == true || pui["always allow field exit"] == "true") &&
                (properties["field type"] == "combo box" ||
                  properties["field type"] == "date field" ||
                  properties["field type"] == "spinner" ||
                  properties["field type"] == "textbox")) {
              allowFieldExit = true;
            }
            if (propname == "allow field exit" && propValue == "true") {
              allowFieldExit = true;
            }
            if (allowFieldExit == true) {
              boxDom = dom;
              if (dom.comboBoxWidget != null) boxDom = dom.comboBoxWidget.getBox();
              if (dom.floatingPlaceholder != null) boxDom = dom.floatingPlaceholder.getBox();
              if (pui.isBound(items[i]["value"]) && items[i]["value"]["rjZeroFill"] == "true") {
                dom.rjZeroFill = true;
                boxDom.rjZeroFill = true;
              }
              addEvent(boxDom, "keydown", function(event) {
                event = event || window.event;
                var key = event.keyCode;
                if ((key == pui["field exit key"] || key == pui["field exit minus key"]) && !event.shiftKey && (pui["field exit key"] == 17 || !event.ctrlKey)) {
                  var target = getTarget(event);
                  pui.storeCursorPosition(target);
                  if (pui.doFieldExit(target, key == pui["field exit minus key"]) == false) {
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
            if (propname.length >= 11 && propname.substr(0, 11) == "blank value" && propValue != null && propValue != "") {
              if (dom.blankValues == null) dom.blankValues = [];
              dom.blankValues.push(propValue);
              box = dom;
              if (dom.floatingPlaceholder != null) box = dom.floatingPlaceholder.getBox();
              if (dom.comboBoxWidget != null) box = dom.comboBoxWidget.getBox();
              var boxValue;
              if (box.tagName == "DIV") boxValue = getInnerText(box);
              else boxValue = box.value;
              if (boxValue == propValue) {
                // clear box
                if (box.tagName == "DIV") pui.clearChildNodes(box);
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
              if (rangeLowDateISO != null) {
                dom.rangeLowDateISO = rangeLowDateISO;
              }
            }

            if (propname == "range high" && propValue != null && propValue != "") {
              dom.rangeHigh = propValue;
              if (rangeHighDateISO != null) {
                dom.rangeHighDateISO = rangeHighDateISO;
              }
            }

            if (propname == "checked value") {
              dom.checkedValue = propValue;
            }
            if (propname == "unchecked value") {
              dom.uncheckedValue = propValue;
            }
            if (propname == "indeterminate value") {
              dom.indeterminateValue = propValue;
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
                  shortcutKey = properties["shortcut key"];
                  if (pui.autoArrange.keys[shortcutKey] == true) {
                    // repeat fkeys do not render
                    dom.style.display = "none";
                    dom.style.visibility = "hidden";
                  }
                  else {
                    if (shortcutKey != null) {
                      pui.autoArrange.keys[shortcutKey] = true;
                    }
                    if (isWin || pui["horizontal auto arrange"]) {
                      if (pui.autoArrange.top == null) pui.autoArrange.top = parseInt(dom.style.top);
                      if (pui.autoArrange.left == null) {
                        pui.autoArrange.left = parseInt(dom.style.left);
                        pui.autoArrange.startLeft = parseInt(dom.style.left);
                      }
                      else {
                        if (pui["horizontal auto arrange"]) {
                          // This will re-arrange the buttons to fill the first line before wrapping to the second line
                          if (pui.autoArrange.buttonCount == null) {
                            pui.autoArrange.buttonCount = 0;
                          }

                          if (pui.autoArrange.startTop == null) {
                            pui.autoArrange.startTop = parseInt(dom.style.top);
                          }

                          pui.autoArrange.buttonCount++;

                          // calculate left using modulus
                          pui.autoArrange.left = pui.autoArrange.startLeft + (pui.autoArrange.buttonCount % pui["buttons per row"]) * pui["horizontal button spacing"];

                          // calculate top (the row) using division
                          pui.autoArrange.top = pui.autoArrange.startTop + Math.floor(pui.autoArrange.buttonCount / pui["buttons per row"]) * pui["vertical button spacing"];
                        }
                        else {
                          // this is a window. it will move buttons on each line to fill blanks but not wrap to the previous line
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
            dom.style.visibility = ""; // ensures that the grid's visibility is not overridden
          }
        }
        if (parms.highlighting != null && parms.highlighting.text != "" && (String(properties["column"]) === String(parms.highlighting.col) || parms.highlighting.col === "*all")) {
          if (dom.tagName == "DIV") {
            pui.highlightText(dom, parms.highlighting.text);
            dom.highlighted = true;
          }
        }
        if (pui["controller"] != null && propname.indexOf("error condition") == 0 && propValue == "1" && !ctlErrorMap[dom.id]) {
          suffix = "";
          if (propname.length > "error condition".length) {
            suffix = " " + parseInt(propname.substr("error condition".length), 10);
          }
          msg = properties["error message" + suffix];
          ctlErrors.push({ "id": dom.id, "msg": msg });
          ctlErrorMap[dom.id] = true;
        }
      } // done processing each in properties.

      // float placeholder
      if (!isDesignMode && properties["float placeholder"] == "true") {
        pui.floatPlaceholder(dom);
      }

      // assign auto tabbing events to input boxes
      if (pui["auto tab"] == true && properties["prevent auto tab"] != "true") {
        if (properties["field type"] == "combo box" || properties["field type"] == "date field" || properties["field type"] == "spinner" || properties["field type"] == "textbox" || properties["field type"] == "password field") {
          boxDom = dom;
          if (dom.comboBoxWidget != null) boxDom = dom.comboBoxWidget.getBox();
          if (dom.floatingPlaceholder != null) boxDom = dom.floatingPlaceholder.getBox();
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
            if (box.floatingPlaceholder != null) box = box.floatingPlaceholder.getBox();

            if (printableChar && box.value.length == box.maxLength && (pui["is_touch"] || (getCursorPosition(box) >= box.maxLength))) {
              pui.gotoNextElementAndPossiblySelect(target);
              preventEvent(event);
              return false;
            }
          });
        }
      }

      // assign arrow key navigation events to input boxes
      if (pui["enable arrow keys"] == true) {
        if (properties["field type"] == "combo box" || properties["field type"] == "date field" || properties["field type"] == "spinner" || properties["field type"] == "textbox" || properties["field type"] == "password field" || properties["field type"] == "checkbox") {
          boxDom = dom;
          if (dom.comboBoxWidget != null) boxDom = dom.comboBoxWidget.getBox();
          if (dom.floatingPlaceholder != null) boxDom = dom.floatingPlaceholder.getBox();
          pui.addarrowKeyEventHandler(boxDom);
        }
      }

      if (strictTabControl) {
        if (properties["field type"] == "combo box" || properties["field type"] == "date field" || properties["field type"] == "spinner" || properties["field type"] == "textbox" || properties["field type"] == "password field" || properties["field type"] == "checkbox") {
          boxDom = dom;
          if (dom.comboBoxWidget != null) boxDom = dom.comboBoxWidget.getBox();
          if (dom.floatingPlaceholder != null) boxDom = dom.floatingPlaceholder.getBox();
          addEvent(boxDom, "keydown", function(event) {
            event = event || window.event;
            var target = getTarget(event);
            if (target.autoComp && target.autoComp.isOpen()) {
              return;
            }
            if (event.keyCode == 9) { // tab key
              // Identify if the dom is inside the tab layout.
              // to identify the tab layout, we need to check if the parent element has a tabId and containerNumber
              if (event.parentElement && (!event.parentElement.containerNumber || !event.parentElement.tabId)) {
                // If the parent element does not have a tabId and containerNumber, then the dom is not inside the tab layout.
                gotoElement(target, !event.shiftKey);
                preventEvent(event);
                return false;
              }
            }
          });
        }
      }

      if (items[i]["grid"] !== undefined && items[i]["grid"] !== null) {
        var myGrid = getObj(items[i]["grid"]).grid;
        if (myGrid.hasTreeLevelColumn && myGrid.treeLevelField !== null &&
            items[i]["id"] == (items[i]["grid"] + myGrid.treeLevelItemId)) { // button to expand/collapse tree levels
          boxDom = dom;
          boxDom["pui"]["rrn"] = parms.subfileRow;
          boxDom["pui"]["grid"] = items[i]["grid"];
          addEvent(boxDom, "keydown", function(event) {
            event = event || window.event;
            var target = getTarget(event);
            var keyCode = event.keyCode;
            var box = target;
            var myGrid = getObj(box["pui"]["grid"]).grid;
            var myRRN = box["pui"]["rrn"];

            if (keyCode == 37) { // left arrow key
              myGrid["expandTreeLevel"](myRRN);
              preventEvent(event);
              return false;
            }
            if (keyCode == 39) { // right arrow key
              myGrid["collapseTreeLevel"](myRRN);
              preventEvent(event);
              return false;
            }
          });
        }
      }

      // check set cursor row / column
      if (!isDesignMode && properties["visibility"] != "hidden" &&
           pui.cursorValues.setRow != null && pui.cursorValues.setRow != "" &&
           pui.cursorValues.setColumn != null && pui.cursorValues.setColumn != "" &&
           dom.clientWidth > 0) {
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
            // if (pui.focusField.dom == null || pui.focusField.setFocusFlag != true) {
            // "set cursor row" and "set cursor column" take precedence over other propertiess like "set focus"
            pui.focusField.dom = dom;
            if (dom.comboBoxWidget != null) pui.focusField.dom = dom.comboBoxWidget.getBox();
            if (dom.floatingPlaceholder != null) pui.focusField.dom = dom.floatingPlaceholder.getBox();
            pui.focusField.setFocusFlag = true;
            // }
          }
        }
      }

      // attach events that keep track of modified state / cursor, apply a key filter, set max length
      if (!isDesignMode) {
        function setModified(e) {
          pui.setModified(e, formatName);
        }

        if ((window["React"] || window["Vue"]) && dom.formattingInfo) {
          if (dom["pui"] == null) dom["pui"] = {};
          dom.pui.data = data;
          if (parms.gridRecord) {
            dom.pui.data = parms.gridRecord;
          }
          dom.pui.dataProp = dom.formattingInfo.fieldName;
        }

        // textboxes and text areas
        if ((dom.comboBoxWidget != null) || (dom.floatingPlaceholder != null) || (dom.tagName == "TEXTAREA") || (dom.tagName == "INPUT" && (pui.isTextbox(dom) || dom.type == "file"))) {
          boxDom = dom;
          if (dom.comboBoxWidget != null) {
            dom.comboBoxWidget.formatName = formatName;
            boxDom = dom.comboBoxWidget.getBox();
          }
          if (dom.floatingPlaceholder != null) {
            dom.floatingPlaceholder.formatName = formatName;
            boxDom = dom.floatingPlaceholder.getBox();
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
                var target = getTarget(event);
                // Don't prevent keyboard actions like cut/copy/paste.
                // Don't prevent typing into field when text is selected.
                if (event.ctrlKey || target.selectionStart !== target.selectionEnd) {
                  return;
                }
                var key = event.keyCode;
                if ((key >= 48 && key <= 57) || // 0-9
                     (key >= 65 && key <= 90) || // a-z
                     (key == 32) || // space
                     (key >= 106 && key <= 111) || // * + - . /
                     (key >= 186 && key <= 192) || // ; = , - . / `
                     (key >= 219 && key <= 222)) { // [ \ ] '
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
          addEvent(boxDom, "input", setModified); // Make sure to catch that Chrome X changed the field. #5602.

          boxDom.cursorPosition = 0;
          addEvent(boxDom, "mouseup", pui.storeEventCursorPosition);
          addEvent(boxDom, "mousedown", pui.storeEventCursorPosition);
          addEvent(boxDom, "keyup", pui.storeEventCursorPosition);

          // When an element on a mobile device receives focus, the virtual keyboard pops up. If that element is
          // inside a grid with "expand to layout" enabled, the grid will be cleared and re-rendered at the new
          // size, causing focus to be lost. This, in turn, causes the virtual keyboard to be closed again, and
          // now the mobile user cannot type into the field. Solution: Mark the grid as "resizeOnly" long enough for
          // the keyboard to open... this prevents the grid from clearing/re-rendering.

          if (pui["is_touch"]) {
            boxDom.parentGridObj = pui.findParentGrid(boxDom);
            addEvent(boxDom, "focus", function(evt) {
              if (evt.srcElement.parentGridObj) evt.srcElement.parentGridObj.resizeOnly = true;
              setTimeout(function(input) {
                if (input.parentGridObj) input.parentGridObj.resizeOnly = false;
              }, 1000, evt.srcElement);
            });
          }

          addEvent(boxDom, "keydown", function(event) {
            event = event || window.event;
            var key = event.keyCode;
            if (key >= 9 && key <= 45 && key != 32) return; // includes keys like arrow keys, ctrl, shift, etc.
            if (key >= 112 && key <= 145) return; // includes f1-f12, num lock, scroll lock, etc.
            if (event.ctrlKey && key != 88 && key != 86) return; // all ctrl keys except Ctrl-X & Ctrl-V
            setModified(event);
          });
          if (dom.formattingInfo && dom.formattingInfo.keyFilter) {
            // apply key filter
            (function() {
              var keyFilter = dom.formattingInfo.keyFilter;
              addEvent(boxDom, "keypress", function(e) {
                e = e || window.event;
                pui.keyFilter(e, keyFilter);
              });
              // Apply key filter to handle Android virtual keyboard keys, which don't always fire "keypress". Issue 3582.
              if (dom.type == "number" && dom.formattingInfo["noExtraSpaces"]) {
                addEvent(boxDom, "textInput", function(e) {
                  e = e || window.event;
                  if (!keyFilter.test(e.data)) {
                    preventEvent(e);
                  }
                });
              }
            })();
          }
          if (dom.formattingInfo != null && dom.formattingInfo.edtMsk != null && dom.formattingInfo.edtMsk != "") {
            boxDom.needChangeEvent = false;
            addEvent(boxDom, "focus", function(e) {
              var target = getTarget(e);
              target.needChangeEvent = false;
            });
            addEvent(boxDom, "blur", function(e) {
              var target = getTarget(e);
              if (target.needChangeEvent) {
                if (typeof target.onchange === "function") target.onchange(e);
                target.needChangeEvent = false;
              }
            });
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
                if (typeof (target.selectionStart) == "number") {
                  sel = (target.selectionStart == 0 && target.selectionEnd == target.value.length);
                }
                else if (typeof (document.selection) != "undefined") {
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
                target.needChangeEvent = true;
                preventEvent(event);
                pui.applyEditMask(target, event, pos);
                if (pui["is_old_ie"]) {
                  try {
                    event.keyCode = 0;
                  }
                  catch (e) {}
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
            if (key == 38 || key == 40) { // up or down arrow
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
          if (dom.tagName != "SELECT") {
            addEvent(dom, "click", setModified);
          }
          else {
            // prevent pagedown key from selecting last option in select box (not operational for Firefox)
            addEvent(dom, "keydown", function(e) {
              if (!e) e = window.event;
              var key = e.keyCode;
              if (key == 34) {
                e.cancel = true;
                if (e.preventDefault) e.preventDefault();
                return false;
              }
            });

            // If the SELECT box is in a subfile and browser is Firefox, then the pgup/pgdn
            // keys would change the value and also page the grid; this behavior is confusing. (See Issue 2556.)
            // So prevent the grid from paging in Firefox. preventEvent stops the key event bubbling
            // up to the grid. This forces the user to focus outside the SELECT in order to page.
            if (parms.subfileRow > 0 && pui["is_firefox"]) {
              addEvent(dom, "keydown", function(e) {
                e = e || window.event;
                if (e.keyCode == 33 || e.keyCode == 34) {
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
        if (dom.floatingPlaceholder != null) {
          pui.focusField.dom = dom.floatingPlaceholder.getBox();
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
      fieldType = properties["field type"];
      if (fieldType != null) {
        widget = pui.widgets[fieldType];
        if (widget != null && widget.initialize != null) {
          widget.initialize({
            design: isDesignMode,
            properties: properties,
            dom: dom,
            designItem: designItem
          });
        }

        if (dom.pui && dom.pui.widget && dom.pui.widget) {
          // Instances of BasicWidget wait for all properties to be set before rendering.
          dom.pui.widget.basicRender();
        }
        else if (dom.layoutT) dom.layoutT.render(parms);
      }

      if (!isDesignMode && properties["field type"] == "layout") {
        // A list of layouts to be destroyed when pui.cleanup is called.
        pui.layoutsDisplayed.push(dom.layout);
        // Items in lazy-loaded layouts will render later. Store the format's fields and data
        // in case any of the items need them.
        if (properties["lazy load"] == "true" && typeof dom.layout.saveFormat == "function") {
          lazyLayouts[properties["id"]] = dom.layout;
          dom.layout.saveFormat(parms);
        }
      }

      // get grid data
      if (!isDesignMode && properties["field type"] == "grid") {
        var subfiles = parms.subfiles;
        var subfile;
        var subfileData;
        var fieldNames;
        var ref;
        var recName = pui.formatUpper(properties["record format name"]);
        if (subfiles != null) subfile = subfiles[recName];
        if (subfile != null) subfileData = subfile.data;
        if (subfile != null) fieldNames = subfile["field names"];
        if (subfile != null) ref = subfile.ref;
        if (subfile != null) errors = subfile.errors;

        dom.grid.fileId = parms["fileId"];
        if (typeof (pui["view"]) != "undefined") {
          dom.grid.storageKey = "pui-grid-" + pui["view"];
        }
        else if (typeof (parms["file"]) != "undefined" && typeof (parms["library"]) != "undefined") {
          dom.grid.storageKey = "pui-grid-" + parms["library"] + "-" + parms["file"] + "-" + recName;
        }

        if (properties["persist state"] === "program only" && subfile && subfile["renderCount"] === 1) {
          delete pui.programStorage[dom.grid.storageKey];
        }

        if (subfile != null && subfile["useServerState"] && subfile["storedState"] != null) {
          dom.grid.useServerState = true;
          dom.grid.storedState = subfile["storedState"];
        }

        if (subfileData != null) dom.grid.dataArray = subfileData;
        else dom.grid.dataArray = [];

        if (fieldNames != null) dom.grid.fieldNames = fieldNames;
        else dom.grid.fieldNames = [];

        // Convert PHP-style grid data (array of name/value pairs) to normal grid format (2-dimensional array of data and an array of field names)
        if (pui.handler != null && subfileData == null) {
          subfileData = data[pui.formatUpper(properties["record format name"])];
          if (!subfileData) subfileData = [];
          fieldNames = [];
          var dataArray = [];
          var fieldNamesObj = {};
          for (j = 0; j < items.length; j++) {
            var gridItem = items[j];
            if (gridItem["grid"] === properties.id) {
              for (var gridItemProp in gridItem) {
                var gridItemValue = gridItem[gridItemProp];
                if (pui.isBound(gridItemValue)) {
                  fieldNamesObj[gridItemValue["fieldName"]] = true;
                }
              }
            }
          }
          fieldNames = Object.keys(fieldNamesObj);

          for (j = 0; j < subfileData.length; j++) {
            var entry = [];
            var record = subfileData[j];
            for (var k = 0; k < fieldNames.length; k++) {
              fieldName = fieldNames[k];
              entry.push(record[fieldName]);
            }
            dataArray.push(entry);
          }
          dom.grid.dataArray = dataArray;
          dom.grid.fieldNames = fieldNames;
          dom.grid.gridRecordData = subfileData;
          subfile = {};
        }

        if (ref != null) dom.grid.ref = ref;
        else dom.grid.ref = {};

        if (errors != null) dom.grid.errors = errors;

        var msgKey = items[i]["subfile message key"];
        var msgQ = items[i]["subfile program message queue"];
        var ctlMsgQ = items[i]["subfile control program message queue"];
        if ((msgKey != null && msgKey != "" && msgQ != null && msgQ != "") ||
             (ctlMsgQ != null && ctlMsgQ != "")) {
          if (dom.grid.scrollbarObj != null) dom.grid.scrollbarObj.rowLabel = "Message";
          dom.grid.runtimeChildren.push({
            "id": "_msgsfltext",
            "column": "0",
            "field type": "output field",
            "grid": properties["id"],
            "left": "5px",
            "top": "5px",
            "cursor": "pointer",
            "onclick": "pui.showMessageSubfileHelp(this);",
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

        // if (properties["display subfile"] == "false") {
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
          dom.grid.updateRecNumFromSflRcdNbr(recNum);
        }
        else {
          dom.grid.recNum = recNum;
        }
        if (properties["place cursor"] == "true") {
          dom.grid.placeCursorRRN = recNum;
          pui.placeCursorOnSubfile = true;
        }
        dom.grid.setupHiddenRows();
        gridsToRender.push(dom.grid);
        pui.gridsDisplayed.push(dom.grid);
      }

      if (!isDesignMode && parms.subfileRow != null) {
        // save reference to dom
        dom.subfileRow = parms.subfileRow;
        dom.subfileName = parms.name;
        if (items[i].domEls == null) items[i].domEls = [];
        items[i].domEls[parms.subfileRow - 1] = dom;
      }
    } // end if already rendered condition

    if ((pui["controller"] != null || typeof pui.handler == "function") && properties != null && properties["set as modified"] != "false") {
      dom.modified = true;
    }

    if (!isDesignMode && parms.dataArrayIndex != null) {
      dom.dataArrayIndex = parms.dataArrayIndex;
    }

    // If rendering into collapsed grid, disable any elements which are
    // below the viewable portion of the cell.

    if (!isDesignMode && gridObj != null && !gridObj["expanded"] && container) {
      var cell = container;
      var height = parseInt(cell.style.height);
      if (!isNaN(height)) {
        top = parseInt(dom.style.top);
        if (isNaN(top)) top = 0;
        if (top > height && (dom.tagName == "INPUT" || dom.tagName == "SELECT" || dom.tagName == "TEXTAREA") && !dom.disabled) {
          dom.reenableOnExpand = true;
          dom.disabled = true;
        }
      }
    }
  } // end for loop to process all items

  if (treeLevelItemAdded) {
    items.pop();
  } // remove temp treeLevelItem added to be processed in loop above

  // process server side errors for this format
  if (!isDesignMode) {
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
        // Reconstruct errors
        for (var errorInd = 0; errorInd < errors.length; errorInd++) {
          // Declare each error in a variable
          var error = errors[errorInd];
          // If it is true, check for the type, only Object should proceed.
          // Numbers,string and bool are valid JSON so we need to specify that the value we need is of "object"
          var errorJSON = isJSON(error.msg);
          if (errorJSON && typeof errorJSON == "object") {
            if (!pui.translationMap || pui.translationMap.length <= 0) {
              continue;
            }
            else {
              // Get the widget property using items variable and error[id]
              var widgetProps = items.find(function(item) {
                return item.id === error["id"];
              });
              // // get the translation Map by building it.
              var translationMapPlaceholder = pui.buildTranslationPlaceholderMap(widgetProps, null, screen, parms["data"], parms["ref"]);
              // // Get the placeholderMap
              if (translationMapPlaceholder.keys && translationMapPlaceholder.keys.length > 0) {
                error.msg = widgetProps["error message"];
              }
              else error.msg = pui.translationMap[errorJSON["transId"]];
            }
          }
          else continue;
        };
        pui.showErrors(errors);
      }
    }
  }
  // Identifying if the string is can be parsed as JSON object.
  function isJSON(value) {
    try {
      return JSON.parse(value);
    }
    catch (error) {
      return false;
    }
  }
  // When the "setTab" API was called before tabs render, set active tabs on tab panels and tab layouts.
  for (i = 0; i < tabPanels.length; i++) {
    var tabElem = document.getElementById(tabPanels[i]);
    var tabPanel = tabElem.tabPanel;
    if (!tabPanel) {
      tabPanel = tabElem.layoutT;
    }
    if (tabPanel && typeof tabPanel.drawChanged === "function") {
      if (activeTabs[i]) tabPanel.selectedTab = activeTabs[i];
      tabPanel.drawChanged(); // Re draws the tabs.
    }
  }

  if (isDesignMode) {
    for (i = 0; i < designer.grids.length; i++) {
      designer.grids[i].dom.grid.doExpandToLayout(true);
    }
  }

  gridsToRender.forEach(function(grid) {
    if (pui.focusField != null && pui.focusField.setFocusFlag == true) {
      grid.placeCursorRRN = null; // "set focus" takes precedence over "place cursor"
    }
    if (grid.isInitCollapsed()) {
      grid.collapse(getObj(grid.tableDiv.id + "_expander"));
    }
    else {
      if (grid.subfileHidden) return;
      grid.getData();
    }
    if (grid.subfileHidden) return;
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
      if (!isDesignMode && typeof screenProperties["record format name"] === "string" &&
        grid.scrollbarObj.type == "paging") {
        var formatName = screenProperties["record format name"];
        var formatNameUC = pui.formatUpper(formatName);
        // It is possible for formatName to be lowercase; it comes from format.metaData.screen,
        // whereas the fieldname in pui.keyMap comes from format.name, which seems to stay in caps.
        if (pui.keyMap[formatName] == null && pui.keyMap[formatNameUC] != null) {
          formatName = formatNameUC;
        }

        if (pui.keyMap[formatName] != null) {
          if (pui.keyMap[formatName]["PageDown"] == null) {
            pui.keyMap[formatName]["PageDown"] = [];
          }
          // pui.keyMap[formatName]["PageDown"].push(grid.pagingBar.nextLink);
          grid.pagingBar.pageDownHotKeyDefined = true;
          if (pui.keyMap[formatName]["PageUp"] == null) {
            pui.keyMap[formatName]["PageUp"] = [];
          }
          // pui.keyMap[formatName]["PageUp"].push(grid.pagingBar.prevLink);
          grid.pagingBar.pageUpHotKeyDefined = true;
        }
      }
    }

    if (grid.isTreeInitCollapsed()) {
      grid.gridTree.collapseAll();
      grid.refreshGridTree();
    }

    grid.makeSortable();
    grid.restoreState();
  });

  // Render the items inside the lazy-loaded layouts' currently visible container if it wasn't already rendered.
  // (Needed by accordions. tabPanel.drawChanged causes a tab layout's items to render before this.)
  for (var layoutid in lazyLayouts) {
    var layout = lazyLayouts[layoutid];
    if (layout) {
      var vci = -1;
      if (typeof layout.getVisibleContainerIndex === "function") vci = layout.getVisibleContainerIndex();
      if (typeof layout.renderItems === "function") layout.renderItems(vci);
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
        if (pui.clientLogic) {
          var initialRoutine = screenProperties["initial routine"];
          if (initialRoutine && initialRoutine["routine"]) {
            var routineName = initialRoutine["routine"];
            try {
              eval("pui[\"routineFunction\"] = function() {\r\n" + pui.clientLogic[routineName] + "\r\n}; \r\npui[\"routineFunction\"]();");
            }
            catch (err) {
              console.error(err);
            }
          }
        }

        var onloadProp = screenProperties["onload"];
        if (onloadProp != null && onloadProp != "") {
          try {
            eval('var format = "' + screenProperties["record format name"] + '";');
            eval('var file = "' + parms.file + '";');
            eval(onloadProp);
          }
          catch (err) {
            pui.scriptError(err, "Onload Error:\n");
          }
        }
      }
      pui.onsubmitProp = screenProperties["onsubmit"];
      if (screenProperties["onmessage"] && typeof screenProperties["record format name"] === "string") {
        pui.onmessageProps[screenProperties["record format name"].toLowerCase()] = screenProperties["onmessage"]; // save for display.screen.executeMessage() API

        if (parms["msgInfo"] != null && isMainFormat && parms.runOnload !== false && !pui.usingGenieHandler) {
          pui["message"] = parms["msgInfo"];
          try {
            eval('var message = pui["message"];');
            eval(screenProperties["onmessage"]);
          }
          catch (err) {
            pui.scriptError(err, "Onmessage Error:\n");
          }
        }
      }

      ["onkeydown", "onkeypress", "onkeyup"].forEach(function(eventPropName) {
        if (isMainFormat && parms.lastLayer && screenProperties[eventPropName] != null && screenProperties[eventPropName] != "") {
          var func = function(e) {
            pui["temp_event"] = e;
            eval("var event = pui.temp_event;");
            eval('var format = "' + screenProperties["record format name"] + '";');
            eval('var file = "' + parms.file + '";');
            try {
              var customFunction = eval(screenProperties[eventPropName]);
              if (typeof customFunction == "function") {
                if (!e) e = window.event;
                customFunction(e);
              }
            }
            catch (err) {
              pui.scriptError(err, eventPropName.substr(0, 1).toUpperCase() + eventPropName.substr(1) + " Error:\n");
            }
          };
          var evName = eventPropName.substring(2); // Remove "on" from the event name.
          document.body.addEventListener(evName, func);
          pui.screenEventsToCleanup.push({ eventObj: document.body, eventName: evName, eventFunc: func });
        }
      });
    }

    if (parms.lazyContainerNum != null) {
      if (pui.screenIsReady) {
        // This layout loaded after pui.render() finished, so new grids need scrollbars setup here.
        pui.setupGridsDisplayedScrollBar();
      }

      // A container inside a lazy-loaded layout has just been rendered, so fire an event.
      if (parms.onlazyload != null) {
        try {
          eval('var lazyContainerNum = "' + parms.lazyContainerNum + '";');
          eval(parms.onlazyload);
        }
        catch (err) {
          pui.scriptError(err, "OnLazyLoad Error:\n");
        }
      }
    }
  }
  if (pui["enable arrow keys"] == true) {
    pui.enableArrowKeysForGridQuickFilters();
  }
  time = timer(time);
  if (pui.renderLog) {
    console.log("Format " + formatName + " rendered in " + time + "ms");
  }

  /**
   * Save an item to render later when a lazy-load layout contains it (directly or indirectly).
   * If the item is directly in a layout being rendered on this pass, then contNum parameter must be set.
   * @param {String} containerId
   * @param {Object} item
   * @param {Undefined|Number} contNum
   */
  function saveItemForLazyLoad(containerId, item, contNum) {
    var lazylayout;
    // The item is in a container (grid/layout) that is in a lazy-layout.
    if (lazyLayouts[containerId].root != null && lazyLayouts[containerId].container != null) {
      lazylayout = lazyLayouts[containerId].root;
      contNum = lazyLayouts[containerId].container;
    }
    else {
      // The item is directly in a lazy-layout. (contNum parameter must be set.)
      lazylayout = lazyLayouts[containerId];
    }
    lazylayout.deferLazyChild(contNum - 1, item); // Save for later.

    // If this item can contain other items, then this allows this item's items to be deferred.
    if (item["field type"] == "layout" || item["field type"] == "grid") {
      lazyLayouts[item["id"]] = { root: lazylayout, container: contNum };
    }
  }

  // Set fieldName and qualField variables used for bound fields.
  function setFieldNameAndQualField() {
    fieldName = pui.fieldUpper(formattingObj.fieldName);
    qualField = formatName + "." + fieldName;
    if (pui.handler != null) qualField = fieldName;
    if (parms.subfileRow != null) {
      qualField += "." + (parms.subfileRow);
    }
  }
}; // pui.renderFormat

// Add arrow key event handler for grid quick filters
pui.enableArrowKeysForGridQuickFilters = function() {
  // Reset the "arrowDownDetected" flag because the pui.addarrowKeyEventHandler
  //  is only created once, when this js file is first loaded.
  pui.arrowKeyEventHandler.resetArrowDownDetectedBeforeOnQuickFilter();
  // var grid = null;
  // var inputElement = null;
  var inputElementArray = null;
  var gridArray = document.querySelectorAll("[puiwdgt='grid']");
  if (gridArray.length < 1) {
    return;
  };
  for (var i = 0; i < gridArray.length; i++) {
    inputElementArray = gridArray[i].querySelectorAll("input.qf");
    if (inputElementArray.length < 1) {
      continue;
    };
    for (var y = 0; y < inputElementArray.length; y++) {
      inputElementArray[y].style.left = "2px";
      inputElementArray[y].style.top = "30px";
      pui.addarrowKeyEventHandler(inputElementArray[y]);
    };
  };
}; /* pui.enableArrowKeysForGridQuickFilters */

pui.arrowKeyEventHandler = new function() {
  var me = this;
  me.arrowDownDetectedBeforeOnQuickFilter = false;

  me.resetArrowDownDetectedBeforeOnQuickFilter = function() {
    me.arrowDownDetectedBeforeOnQuickFilter = false;
  };

  me.handler = function(event) {
    event = event || window.event;
    var target = getTarget(event);
    if (target.autoComp && target.autoComp.isOpen()) {
      return;
    }
    var keyCode = event.keyCode;
    var box = target;
    if (box.comboBoxWidget != null) box = box.comboBoxWidget.getBox();
    if (box.floatingPlaceholder != null) box = box.floatingPlaceholder.getBox();
    if (keyCode == 37) { // left arrow key
      if (getCursorPosition(box) <= 0) {
        pui.goToClosestElement(target, "left");
        preventEvent(event);
        return false;
      }
    }
    if (keyCode == 38) { // up arrow key
      pui.goToClosestElement(target, "up");
      preventEvent(event);
      return false;
    }
    if (keyCode == 39) { // right arrow key
      if (getCursorPosition(box) >= box.value.length) {
        pui.goToClosestElement(target, "right");
        preventEvent(event);
        return false;
      }
    }
    if (keyCode == 40) { // down arrow key
      pui.goToClosestElement(target, "down");
      preventEvent(event);
      // Check if it's the first time the down key is hit on a quick filter. If so, fire the down key even again.
      if (!me.arrowDownDetectedBeforeOnQuickFilter && target.className.includes("qf") && target.nodeName === "INPUT") {
        me.arrowDownDetectedBeforeOnQuickFilter = true;
        setTimeout(function() {
          target.dispatchEvent(event);
        }, 50);
      }
      return false;
    }
  };
}();

// Add arrow key event handler
//   Note: Blur event handler for quick filters redraws the grid losing the focus on the grid field on first execution.
//         Workaround is to fire the down key event for a second time.
pui.addarrowKeyEventHandler = function(element) {
  if (typeof element === "undefined" || typeof element.tagName === "undefined" || element.tagName !== "INPUT") {
    return;
  }
  addEvent(element, "keydown", pui.arrowKeyEventHandler.handler);
}; /* end addarrowKeyEventHandler */

pui.attachResponse = function(dom) {
  dom.handlesResponse = true; // Flag for handler code to know if target or its ancestor should be "dom".
  addEvent(dom, "click", pui.responseClickEvent);
};

/**
 * Handler for click event when an element that sends a response is clicked.
 * This is its own function to avoid creating a new function for each element,
 * and so the click event can be removed.
 * @param {Event} evt
 */
pui.responseClickEvent = function(evt) {
  var dom = evt.target;
  // Find the element associated with the response.
  while (dom != null && !dom.handlesResponse) {
    dom = dom.parentNode;
  }
  if (dom == null) return;

  var i;
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
    if (dom.parentPagingBar) {
      doms.push(dom);
    }

    for (var formatName in pui.keyMap) {
      var keyMapDomArray = pui.keyMap[formatName][pui.keyName];
      if (keyMapDomArray != null) {
        for (i = 0; i < keyMapDomArray.length; i++) {
          if (!keyMapDomArray[i].parentPagingBar) { // Push if this item isn't in a grid. See issue 4807.
            doms.push(keyMapDomArray[i]);
          }
        }
      }
    }
  }
  else {
    doms.push(dom);
  }

  for (i = 0; i < doms.length; i++) {
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

  pui.responseRoutine = dom.responseRoutine;
  pui.responseRoutineRow = dom.subfileRow;
  pui.responseRoutineGrid = dom.subfileName;

  var returnVal = pui.respond();

  pui.destURL = null;
  pui.destParams = null;
  pui.destBookmarkable = null;
  pui.destRedirect = null;

  if (returnVal == false) {
    for (i = 0; i < doms.length; i++) {
      doms[i].responseValue = "0";
    }
    pui.bypassValidation = "false";
    pui.responseRoutine = null;
    pui.responseRoutineRow = null;
    pui.responseRoutineGrid = null;
  }
};

pui.showErrors = function(errors, rrn) {
  var i; // loop iterator
  var globalMessages = [];
  for (i = errors.length - 1; i >= 0; i = i - 1) {
    var err = errors[i];
    var msg = err.msg;
    if (err["encoded"]) {
      msg = pui.formatting.decodeGraphic(msg);
    }

    // if error message is scripted, then resolve the value
    // this logic is cloned from properties.js.evalPropertyValue() where a scripted property value is resolved
    var js = null;
    var msgSave;

    if (String(msg).substr(0, 3).toLowerCase() == "js:") {
      js = msg.substr(3);
    }
    if (String(msg).substr(0, 11).toLowerCase() == "javascript:") {
      js = msg.substr(11);
    }
    if (String(msg).substr(0, 7).toLowerCase() == "script:") {
      js = msg.substr(7);
    }
    if (js !== null && trim(js) !== "") {
      msgSave = msg; // saved/restored if msg not found
      try {
        msg = eval(js);
      }
      catch (err) {
        if (!pui.suppressPropertyScriptingErrors) {
          pui.suppressPropertyScriptingErrors = true;
          setTimeout(function() {
            pui.alert("Expression '" + trim(js) + "' contains an error:\n\n" + err.message);
            pui.suppressPropertyScriptingErrors = false;
          }, 1);
        }
      }

      if (typeof (msg) == "undefined") { // saved/restored if msg not found
        msg = msgSave;
      }
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
    if (dom.parentNode && dom.parentNode.floatingPlaceholder) {
      dom = dom.parentNode;
    }
    var tipBox = dom;
    if (dom.comboBoxWidget != null) {
      tipBox = dom.comboBoxWidget.getBox();
    }
    if (dom.floatingPlaceholder != null) {
      tipBox = dom.floatingPlaceholder.getBox();
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
    for (i = globalMessages.length - 1; i >= 0; i = i - 1) { // these messages are in reverse order, so we loop backwards
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
        if (dom.floatingPlaceholder != null) dom = dom.floatingPlaceholder.getBox();
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
        catch (e) {
        }
      }
    }
    setTimeout(function() {
      pui.ignoreBlurs = false;
    }, 0);
  }, 0);
};

pui.respond = function() {
  var onsubmitReturnVal = "";
  if (pui.observer != null) return false;

  // if (!pui.screenIsReady) {
  if (pui["isServerBusy"]()) {
    return false;
  }

  if (pui.isAutoTesting) {
    return false;
  }

  // Create a new setting with is named "prioritize onsubmit event" and if it is set to true
  if (pui["prioritize onsubmit event"] == true) {
    // handle screen's "onsubmit" event, but identify it has a value first
    if (pui.onsubmitProp != null && pui.onsubmitProp != "") {
      // if the value if the on submit are code, then execute the code.
      onsubmitReturnVal = eval(pui.onsubmitProp);
    }
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
  if (typeof onsubmitReturnVal == "function" && pui["prioritize onsubmit event"] == true) {
    onsubmitReturnVal = onsubmitReturnVal(response);
  }
  // handle screen's "onsubmit" event
  if (pui.onsubmitProp != null && pui.onsubmitProp != "" && pui["prioritize onsubmit event"] == false) {
    try {
      onsubmitReturnVal = "";
      pui.referenceToResponse = response; // create temporary reference to response object, so it can be updated by certain API's
      onsubmitReturnVal = eval(pui.onsubmitProp);
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
    catch (err) {
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

  pui.screenIsReady = false; // this prevents double-submits

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

pui.buildResponse = function(customResponseElements) {
  var fieldName;
  var domArr;
  var i; // loop iterator
  var j; // loop iterator
  var msg;
  var dom;
  var radioDom;
  var boxValue;
  var rangeHighDisp;
  var rangeLowDisp;
  var sflName;
  var rrnName;
  var trackerName;
  var value;
  var field;
  var recordNum;
  var response = {};

  if (!customResponseElements) {
    for (fieldName in pui.changeResponseElements) {
      domArr = pui.changeResponseElements[fieldName];
      for (i = 0; i < domArr.length; i++) {
        dom = domArr[i];
        if (dom.modified && (pui["controller"] != null || pui.bypassValidation != "true")) {
          response[fieldName] = "1";
          break;
        }
      }
      if (response[fieldName] != "1") response[fieldName] = "0";
    }

    for (fieldName in pui.isBlankElements) {
      domArr = pui.isBlankElements[fieldName];
      for (i = 0; i < domArr.length; i++) {
        dom = domArr[i];
        if (typeof dom.value == "string" && trim(dom.value) == "") {
          response[fieldName] = "1";
          break;
        }
      }
      if (response[fieldName] != "1") response[fieldName] = "0";
    }

    for (fieldName in pui.dupElements) {
      domArr = pui.dupElements[fieldName];
      for (i = 0; i < domArr.length; i++) {
        dom = domArr[i];
        if (pui.isDup(dom)) {
          response[fieldName] = "1";
          break;
        }
      }
      if (response[fieldName] != "1") response[fieldName] = "0";
    }

    pui.gridsDisplayed.forEach(function(grid) {
      if (grid.useServerState && grid.storageKey != null && grid.storedState != null && grid.storedState != "") {
        var storageKeyVar = pui.formatUpper(grid.recordFormatName) + ".storageKey";
        var storedStateVar = pui.formatUpper(grid.recordFormatName) + ".storedState";
        response[storageKeyVar] = grid.storageKey;
        response[storedStateVar] = grid.storedState;
      }
    });
  }

  var responseElements = pui.responseElements;
  if (customResponseElements) responseElements = customResponseElements;

  for (fieldName in responseElements) {
    var doms = responseElements[fieldName];
    dom = doms[0];

    // If it's a 'radio button' control we want to change the
    //  'dom' entry to the 'modified' one, if any.
    if (dom.type == "radio") {
      for (j = 0; j < doms.length; j++) {
        radioDom = doms[j];
        if (radioDom.modified) {
          dom = radioDom;
          break;
        }
      }
    }

    var boxDom = dom;
    if (dom.comboBoxWidget != null) boxDom = dom.comboBoxWidget.getBox();
    if (dom.floatingPlaceholder != null) boxDom = dom.floatingPlaceholder.getBox();
    value = null;
    if (dom.responseValue != null) {
      value = dom.responseValue;
      if (value == "0") { // handle same indicator variables bound to multiple buttons
        for (i = 1; i < doms.length; i++) {
          if (doms[i].responseValue == "1") {
            value = "1";
            break;
          }
        }
      }
      // handle same response variable bound to multiple menus. (Note: dom.pui could be null if grid setDataValue created the domEl. Issue 3034.)
      else if (dom.responseValue == "" && dom.pui != null && dom.pui.properties["field type"] == "menu" && doms.length > 1) {
        for (i = 1; i < doms.length; i++) {
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
        sflName = splitName[0];
        var subfileRow = parseInt(splitName[splitName.length - 1]);
        if (!isNaN(subfileRow) && subfileRow > 0) {
          rrnName = sflName + ".rrn";
          trackerName = rrnName + "=" + subfileRow;
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
          if (boxDom.validationTip != null && boxDom.validationTip.doneShowing != null) boxDom.validationTip.doneShowing = false;
          continue;
        }
        if (dom.MF == true && dom.modified == true && boxDom.maxLength != null && boxDom.value != null && (boxDom.maxLength != boxDom.value.length || boxDom.value === boxDom.emptyText)) {
          response.valid = false;
          if (response.errors == null) response.errors = [];
          response.errors.push({ dom: boxDom, msg: pui["getLanguageText"]("runtimeMsg", "MF") });
          if (boxDom.validationTip != null && boxDom.validationTip.doneShowing != null) boxDom.validationTip.doneShowing = false;
          continue;
        }
      }
      if (pui.bypassValidation != "true" && pui.bypassValidation != "send data" && dom.puirequired == true && !dom.disabled) {
        if ((typeof boxDom.value == "string" && (trim(boxDom.value) == "" || boxDom.value === boxDom.emptyText)) ||
             (dom["fileUpload"] != null && dom["fileUpload"].getCount() < 1)) {
          response.valid = false;
          if (response.errors == null) response.errors = [];
          msg = pui["getLanguageText"]("runtimeMsg", "required");
          if (dom["fileUpload"] != null) msg = pui["getLanguageText"]("runtimeMsg", "file required");
          response.errors.push({ dom: boxDom, msg: msg });
          if (boxDom.validationTip != null && boxDom.validationTip.doneShowing != null) boxDom.validationTip.doneShowing = false;
          continue;
        }
      }
      if (dom["fileUpload"] != null && pui.bypassValidation != "true" && pui.bypassValidation != "send data") {
        msg = dom["fileUpload"].validateCount();
        if (msg == null) {
          msg = dom["fileUpload"].validateNames();
        }
        if (msg != null) {
          response.valid = false;
          if (response.errors == null) response.errors = [];
          response.errors.push({ dom: dom, msg: msg });
          if (dom.validationTip != null && dom.validationTip.doneShowing != null) dom.validationTip.doneShowing = false;
          continue;
        }
      }
      if (dom.modified == true && (pui["controller"] != null || pui.bypassValidation != "true")) {
        if (dom.tagName == "INPUT") {
          switch (dom.type) {
            case "text":
            case "number":
            case "password":
            case "file":
            case "hidden":
            case "":
            // following are new HTML5 input types
            case "date":
            case "datetime":
            case "time":
            case "email":
            case "url":
            case "month":
            case "tel":
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
                if (dom.formattingInfo != null && dom.formattingInfo.dataType != "expression" &&
                pui.formatting.isNumericType(dom.formattingInfo.dataType)) {
                  // See if the string has only characters that appear in numbers, including (0.00) 0,00 but not "CR".
                  // This will clear out anything containing non-numeric characters.
                  var numericRe = /^[0-9,.\- ()]+/;
                  if (!numericRe.test(value)) {
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
                for (j = 0; j < value.length; j++) {
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
              if (dom.indeterminate) {
                if (dom.indeterminateValue !== null && dom.indeterminateValue !== "") value = dom.indeterminateValue;
                else value = "2";
              }
              else if (dom.checked) {
                if (dom.checkedValue != null && dom.checkedValue != "") value = dom.checkedValue;
                else value = "1";
              }
              else {
                if (dom.uncheckedValue != null && dom.uncheckedValue != "") value = dom.uncheckedValue;
                else value = " ";
              }
              break;

            case "radio":
              for (j = 0; j < doms.length; j++) {
                radioDom = doms[j];
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
            for (j = 0; j < dom.options.length; j++) {
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
        if (dom.floatingPlaceholder != null) {
          value = dom.floatingPlaceholder.getValue();
          if (value === dom.floatingPlaceholder.getBox().emptyText) value = "";
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
          value = dom.value; // this is not a real dom element
        }
        if (dom.type == "grid hidden field") {
          value = dom.value; // this is not a real dom element
        }

        if (dom.pui && dom.pui.widget) {
          value = dom.pui.widget.getFieldValue(fieldName);
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
          if (dom.validationTip != null && dom.validationTip.doneShowing != null) dom.validationTip.doneShowing = false;
          continue;
        }
      }

      var formattingObj;
      if (dom.pui && dom.pui.widget && dom.pui.widget) formattingObj = dom.pui.widget.getFormattingObj(fieldName);
      else formattingObj = dom.formattingInfo;
      if (formattingObj != null && formattingObj.dataType != "expression") {
        if (formattingObj.textTransform != "uppercase" && dom.pui && dom.pui.properties && dom.pui.properties["text transform"] == "uppercase" && formattingObj.dataType == "char") {
          value = pui.replaceProblemCaseChars(value, true); // Capital ẞ isn't supported in EBCDIC, so lower-case it for char.
        }
        formattingObj.value = value;
        formattingObj["revert"] = true;
        if (dom.responseValue != null) formattingObj.formatting = "Text";
        value = pui.FieldFormat.format(formattingObj);
        if (typeof value == "object") {
          response.valid = false;
          response.nobypass = true;
          if (response.errors == null) response.errors = [];
          response.errors.push({ dom: boxDom, msg: value.msg });
          if (boxDom.validationTip != null && boxDom.validationTip.doneShowing != null) boxDom.validationTip.doneShowing = false;
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
              if (boxDom.validationTip != null && boxDom.validationTip.doneShowing != null) boxDom.validationTip.doneShowing = false;
              continue;
            }
          }

          if (dom.validateEmail == true) {
            if (!pui.validateEmail(value)) {
              response.valid = false;
              if (response.errors == null) response.errors = [];
              msg = pui["getLanguageText"]("runtimeMsg", "invalid email");
              response.errors.push({ dom: boxDom, msg: msg });
              if (boxDom.validationTip != null && boxDom.validationTip.doneShowing != null) boxDom.validationTip.doneShowing = false;
              continue;
            }
          }

          if (typeof dom.validValues == "string") {
            var validValues = pui.parseCommaSeparatedList(dom.validValues);
            var invalid = true;
            for (i = 0; i < validValues.length; i++) {
              if (rtrim(String(validValues[i])) == value) {
                invalid = false;
                break;
              }
            }
            if (invalid) {
              response.valid = false;
              if (response.errors == null) response.errors = [];

              // Present valid values as a comma separated list where the last value is separated by "or"
              // and if any of the values are blank, use the word "blank" instead.
              for (i = 0; i < validValues.length; i++) {
                if (typeof validValues[i] === "string" && validValues[i].trim() === "") {
                  validValues[i] = pui["getLanguageText"]("runtimeMsg", "blank");
                }
              }
              var valuesCount = validValues.length;
              if (valuesCount > 1) {
                var lastValue = validValues.pop();
                validValues = validValues.join(", ");
                if (valuesCount > 2) {
                  validValues += ",";
                }
                validValues += " " + pui["getLanguageText"]("runtimeMsg", "or") + " " + lastValue;
              }
              else {
                validValues = validValues[0];
              }

              response.errors.push({ dom: boxDom, msg: pui["getLanguageText"]("runtimeMsg", "validValues") + validValues + "." });
              if (boxDom.validationTip != null && boxDom.validationTip.doneShowing != null) boxDom.validationTip.doneShowing = false;
              continue;
            }
          }

          if (typeof dom.compOperator == "string" && typeof dom.compValue == "string") {
            var compValue = dom.compValue;
            boxValue = value;
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
            msg = "";
            switch (dom.compOperator) {
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
              if (boxDom.validationTip != null && boxDom.validationTip.doneShowing != null) boxDom.validationTip.doneShowing = false;
              continue;
            }
          }

          var boxValueDateISO = null;

          if (typeof dom.rangeLow == "string") {
            var rangeLow = dom.rangeLow;
            boxValue = value;

            if (formattingObj.formatting == "Number") {
              rangeLow = Number(rangeLow);
              boxValue = Number(boxValue);
            }

            if (typeof rangeLow == "string") rangeLow = rtrim(rangeLow);
            if (typeof boxValue == "string") boxValue = rtrim(boxValue);

            if (formattingObj.formatting == "Date") {
              boxValueDateISO = pui.FieldFormat["Date"].getDateISO(boxValue, formattingObj); // *ISO format for compare
              boxValue = boxValueDateISO;
              rangeLow = dom.rangeLowDateISO;
            }

            if (boxValue < rangeLow) {
              rangeLowDisp = dom.rangeLow;
              if (formattingObj.formatting != "Number") rangeLowDisp = "'" + rangeLowDisp + "'";
              msg = pui["getLanguageText"]("runtimeMsg", "invalid low range", [rangeLowDisp]);
              if (dom.rangeHigh != null) {
                rangeHighDisp = dom.rangeHigh;
                if (formattingObj.formatting != "Number") rangeHighDisp = "'" + rangeHighDisp + "'";
                msg = pui["getLanguageText"]("runtimeMsg", "invalid range", [rangeLowDisp, rangeHighDisp]);
              }
              response.valid = false;
              if (response.errors == null) response.errors = [];
              response.errors.push({ dom: boxDom, msg: msg });
              if (boxDom.validationTip != null && boxDom.validationTip.doneShowing != null) boxDom.validationTip.doneShowing = false;
              continue;
            }
          }

          if (typeof dom.rangeHigh == "string") {
            var rangeHigh = dom.rangeHigh;
            boxValue = value;

            if (formattingObj.formatting == "Number") {
              rangeHigh = Number(rangeHigh);
              boxValue = Number(boxValue);
            }

            if (formattingObj.formatting == "Date") {
              if (boxValueDateISO == null) { // not done yet
                boxValue = pui.FieldFormat["Date"].getDateISO(boxValue, formattingObj);
              } // *ISO format for compare
              else {
                boxValue = boxValueDateISO;
              }
              rangeHigh = dom.rangeHighDateISO;
            }

            if (typeof rangeHigh == "string") rangeHigh = rtrim(rangeHigh);
            if (typeof boxValue == "string") boxValue = rtrim(boxValue);

            if (boxValue > rangeHigh) {
              rangeHighDisp = dom.rangeHigh;
              if (formattingObj.formatting != "Number") rangeHighDisp = "'" + rangeHighDisp + "'";
              msg = pui["getLanguageText"]("runtimeMsg", "invalid high range", [rangeHighDisp]);
              if (dom.rangeLow != null) {
                rangeLowDisp = dom.rangeLow;
                if (formattingObj.formatting != "Number") rangeLowDisp = "'" + rangeLowDisp + "'";
                msg = pui["getLanguageText"]("runtimeMsg", "invalid range", [rangeLowDisp, rangeHighDisp]);
              }
              response.valid = false;
              if (response.errors == null) response.errors = [];
              response.errors.push({ dom: boxDom, msg: msg });
              if (boxDom.validationTip != null && boxDom.validationTip.doneShowing != null) boxDom.validationTip.doneShowing = false;
              continue;
            }
          }
        }

        response[fieldName] = value;
        if (dom.subfileRow != null) {
          sflName = fieldName.split(".")[0];
          rrnName = sflName + ".rrn";
          trackerName = rrnName + "=" + dom.subfileRow;
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

  if (pui.responseRoutine) {
    response["routine"] = pui.responseRoutine;
    if (pui.responseRoutineRow && pui.responseRoutineGrid) {
      response["routineRow"] = pui.responseRoutineRow;
      response["routineGrid"] = pui.responseRoutineGrid;
    }
  }

  if (customResponseElements) {
    return response;
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

  // Handle "return cursor location" fields, which may be collections. Each format that uses these types of fields should get values,
  // even when overlaid. See issue 4920 for test case.
  function fillReturnCursorData(field, value) {
    if (field != null && field != "" && value != null && value != "") {
      if (typeof field == "object") {
        for (var qualfield in field) {
          response[qualfield] = value;
        }
      }
      else {
        response[field] = value;
      }
    }
  }
  function upCursorValue(value) {
    if (!pui["uppercase cursor fields"]) return value;
    if (typeof value !== "string") return value;
    return value.toUpperCase();
  }
  fillReturnCursorData(pui.cursorFields.record, upCursorValue(pui.cursorValues.record));
  fillReturnCursorData(pui.cursorFields.field, upCursorValue(pui.cursorValues.field));
  fillReturnCursorData(pui.cursorFields.position, pui.cursorValues.position);
  fillReturnCursorData(pui.cursorFields.row, pui.cursorValues.row);
  fillReturnCursorData(pui.cursorFields.column, pui.cursorValues.column);

  var rowNum = Number(pui.cursorValues.row);
  if (!isNaN(rowNum) && rowNum > 0) response["row"] = String(rowNum);
  var columnNum = Number(pui.cursorValues.column);
  if (!isNaN(columnNum) && columnNum > 0) response["column"] = String(columnNum);
  if (pui.cursorValues.wrow != null) response["wrow"] = String(pui.cursorValues.wrow);
  if (pui.cursorValues.wcolumn != null) response["wcolumn"] = String(pui.cursorValues.wcolumn);

  for (var cursorRRNFieldName in pui.cursorRRNs) {
    dom = pui.cursorRRNs[cursorRRNFieldName];
    if (dom.cursorRRN != null) {
      response[cursorRRNFieldName] = dom.cursorRRN;
    }
  }

  for (var returnRRNFieldName in pui.returnRRNs) {
    dom = pui.returnRRNs[returnRRNFieldName];
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
    dom = pui.sflModes[sflModeFieldName];
    if (dom.grid["expanded"]) {
      response[sflModeFieldName] = "0";
    }
    else {
      response[sflModeFieldName] = "1";
    }
  }

  if (pui.columnSortResponseGrid != null) {
    field = pui.columnSortResponseGrid.tableDiv.columnSortResponseField;
    value = pui.columnSortResponseGrid.columnSortResponse;
    if (field != null && value != null) {
      response[field] = value;
    }
    field = pui.columnSortResponseGrid.tableDiv.returnSortOrderField;
    value = pui.columnSortResponseGrid.returnSortOrder;
    if (field != null && value != null) {
      response[field] = value;
    }
  }

  if (pui.fieldNameSortResponseGrid != null) {
    field = pui.fieldNameSortResponseGrid.tableDiv.fieldNameSortResponseField;
    value = pui.fieldNameSortResponseGrid.fieldNameSortResponse;
    if (field != null && value != null) {
      response[field] = value;
    }
    field = pui.fieldNameSortResponseGrid.tableDiv.returnSortOrderField;
    value = pui.fieldNameSortResponseGrid.returnSortOrder;
    if (field != null && value != null) {
      response[field] = value;
    }
  }

  if (pui.filterResponseGrid != null) {
    field = pui.filterResponseGrid.tableDiv.filterResponseField;
    value = pui.filterResponseGrid.filterResponse;
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

  for (i = 0; i < pui.setOffFields.length; i++) {
    var setOffField = pui.setOffFields[i];
    if (response[setOffField] == null) { // not already set
      response[setOffField] = "0";
    }
  }

  if (pui.dragDropFields.respond == true) {
    if (pui.dragDropFields.ddElementId != null) {
      response[pui.dragDropFields.ddElementId] = pui["dragDropInfo"]["dd element id"];
    }
    if (pui.dragDropFields.ddRecordNumber != null) {
      recordNum = pui["dragDropInfo"]["dd record number"];
      if (recordNum == null) recordNum = 0;
      response[pui.dragDropFields.ddRecordNumber] = String(recordNum);
    }
    if (pui.dragDropFields.targetElementId != null) {
      response[pui.dragDropFields.targetElementId] = pui["dragDropInfo"]["target element id"];
    }
    if (pui.dragDropFields.targetRecordNumber != null) {
      recordNum = pui["dragDropInfo"]["target record number"];
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
    for (i = 0; i < layers.length; i++) {
      var formats = layers[i]["formats"];
      for (j = 0; j < formats.length; j++) {
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
    catch (e) {
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
        value = pui.destParams[i][1];
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
    try {
      var atriumSettings = Atrium["getSettings"]();
    }
    catch (error) {
    }
    var atriumTimeout = (atriumSettings && atriumSettings["ACTIMEOUT"] === "1");
    if (atriumTimeout) {
      Atrium["resetInactivityTimeout"]();
    }
    pui.showWaitAnimation();

    function sendRichDisplayScreen() {
      if (pui.recordTest) {
        pui.recording["payloads"].push({
          url: url,
          data: Object.assign({}, response)
        });
      }

      if (pui["isCloud"]) response["workspace_id"] = pui.cloud.ws.id;

      ajaxJSON({
        "url": pui.addRequestId(url),
        "method": "post",
        "params": response,
        "sendAsBinary": false,
        "saveResponse": true,
        "suppressAlert": true,
        "handler": function(parms) {
          if (parms == null) {
            function exit() {
              var returnVal = shutDown();
              if (returnVal == false) return;
              if (typeof pui != "undefined" && pui != null) {
                pui.shutdownOnClose = false;
                pui.confirmOnClose = false;
              }
              context = "";
            }
            if (getQueryStringParms()["record"] === "1") {
              document.body.innerHTML = '<div id="close-browser-msg" style="font-family: Trebuchet MS; width: 95%; text-align: center; font-size: 200%;"><br/>' + pui["getLanguageText"]("runtimeMsg", "session ended text") + '</div><div style="background-color: transparent" class="genie-sign-on--right"><button id="exitButton" class="genie-sign-on--exit">Exit</button><button id="saveRecordingButton" class="genie-sign-on--save-recording">Save Recording</button></div>';
              var exitButton = getObj("exitButton");
              exitButton.onclick = function() {
                exit();
              };
              var saveRecordingButton = getObj("saveRecordingButton");
              saveRecordingButton.onclick = function() {
                // Initiate saving of the recording
                saveRecordingButton.disabled = true;
                saveRecordingButton.innerHTML = "Saving...";
                pui["saveRecording"](function() {
                  saveRecordingButton.innerHTML = "Saved!";
                  setTimeout(function() {
                    exit();
                  }, 750);
                });
              };
              return;
            }
            document.body.innerHTML = '<div id="close-browser-msg" style="font-family: Trebuchet MS; width: 95%; text-align: center; font-size: 200%;"><br/>' + pui["getLanguageText"]("runtimeMsg", "session ended text") + "<br/><br/>" + pui["getLanguageText"]("runtimeMsg", "close browser text") + "</div>";
            exit();
            return;
          }
          parms.container = pui.runtimeContainer;

          /* Check for a session timeout message.  If retries are configured,
           * do them here. */

          var formatName = "";
          var displayFile = "";
          if (parms != null &&
              parms["layers"] != null &&
              parms["layers"][0] != null &&
              parms["layers"][0]["formats"] != null &&
              parms["layers"][0]["formats"][0] != null &&
              parms["layers"][0]["formats"][0]["name"] != null &&
              parms["layers"][0]["formats"][0]["file"] != null) {
            formatName = parms["layers"][0]["formats"][0]["name"];
            displayFile = parms["layers"][0]["formats"][0]["file"];
          }
          if (pui["session timeout retries"] > 0) {
            if ((formatName === "TIMOUTSCRN" && displayFile === "PUISCREENS") ||
                 (pui.genie && parms != null && parms["exception"] == "PUI0003")) {
              pui.sessionRetryCount += 1;
              if (pui.sessionRetryCount <= pui["session timeout retries"]) {
                setTimeout(sendRichDisplayScreen, 2000);
                return;
              }
            }
          }
          pui.sessionRetryCount = 0;

          // If any items depend on external files, wait for those to load before
          // rendering. Otherwise, pui.render/render5250 is called without waiting.
          if (pui.genie == null) {
            pui.loadDependencyFiles(parms, function() {
              pui.render(parms);
            });
          }
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
pui["submit"] = pui.submitResponse; // short-hand

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
    grid["unMask"]();
  }
  pui["unmaskScreen"]();
  pui.resetResponseValues();
};

pui.evalBoundProperty = function(propValue, data, ref) {
  if (!pui.isBound(propValue) && !pui.isTranslated(propValue) && !pui.isRoutine(propValue)) return propValue;

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

  if (data["__pui_skipdecode"]) formattingObj["__pui_skipdecode"] = data["__pui_skipdecode"]; // For load-fields-into-widgets.

  var dataValue;
  if (formattingObj.dataType == "expression") {
    dataValue = pui.evalIndicatorExpression(formattingObj.fieldName, data);
  }
  else {
    dataValue = data[fieldName];
    if (dataValue == null) dataValue = "";
  }
  formattingObj.value = dataValue;
  if (formattingObj.dataType == "reference" && ref != null) {
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
  if (pui["loading animation"]["css"] != null && !pui["is_old_ie"] && pui["loading animation"]["path"] == pui["loading animation"]["default"] && pui["loading animation"]["text"] == null) {
    animation = document.createElement("div");
    animation.className = pui["loading animation"]["css"];
  }
  else {
    if (pui["loading animation"]["text"] != null) {
      animation = document.createElement("div");
      animation.innerHTML = pui["loading animation"]["text"];
      animation.style.backgroundColor = "#cccccc";
      animation.style.border = "1px solid #333333";
      animation.style.fontSize = "10px";
      animation.style.fontFamily = "Sans-Serif";
    }
    else {
      animation = document.createElement("div");
      animation.style.backgroundImage = "url('" + pui["loading animation"]["path"] + "')";
      animation.style.backgroundRepeat = "no-repeat";
      animation.style.backgroundSize = "100%";
      var width = pui["loading animation"]["width"];
      var height = pui["loading animation"]["height"];
      animation.style.width = width + "px";
      animation.style.height = height + "px";
    }
    if (pui["loading animation"]["alt"] != null && pui["loading animation"]["alt"].length > 0) {
      animation.alt = pui["loading animation"]["alt"];
    }
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

  for (var i = 0; i < pui.gridsDisplayed.length; i++) {
    var grid = pui.gridsDisplayed[i];
    if (!grid.subfileHidden) grid["unMask"]();
  }
};

pui.handleHotKey = function(e, keyName) {
  var i; // loop iterator
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
      if (!pui["is_old_ie"] || (fkey > 1 || e.shiftKey)) {
        if (e.shiftKey) {
          fkey = fkey + 12;
        }
        else if (e.modifiers && Event.SHIFT_MASK) {
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

  if (keyName == "Ctrl-F9") { // Handle shortcut to download the JSON for this screen
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

  if (processKey && (keyName == "PageUp" || keyName == "PageDown")) {
    // Do not take action for page up / page down when multiple grids
    // with paging bar are on screen.
    var pbar = false;
    for (i = 0; i < pui.gridsDisplayed.length; i++) {
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

  if (processKey) {
    var doms = [];
    var mustRespond = false;
    var pagingLinksUseKey = false;
    for (var formatName in pui.keyMap) {
      var domArray = pui.keyMap[formatName][keyName];
      if (domArray != null) {
        var allDisabled = true;
        for (i = 0; i < domArray.length; i++) {
          var dom = domArray[i];
          if (!dom.disabled) allDisabled = false;
          if (dom.parentPagingBar != null) {
            // ---- locate dom grid that had been the orignal target...
            if ((pui.scrolledGridName !== undefined && pui.scrolledGridName !== null) &&
              dom.parentPagingBar.grid.recordFormatName != pui.scrolledGridName) {
              continue;
            }
            // ----

            if (dom.nextPage == true && !dom.parentPagingBar.grid.atBottom()) {
              dom.parentPagingBar.grid.pageDown();
              preventEvent(e);
              if (pui["is_old_ie"]) {
                try {
                  e.keyCode = 0;
                }
                catch (e) {}
              }
              return false;
            }
            if (dom.nextPage == true && !dom.parentPagingBar.pageDownResponseDefined) {
              preventEvent(e);
              if (pui["is_old_ie"]) {
                try {
                  e.keyCode = 0;
                }
                catch (e) {}
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
                catch (e) {}
              }
              return false;
            }
            if (dom.prevPage == true && !dom.parentPagingBar.pageUpResponseDefined) {
              preventEvent(e);
              if (pui["is_old_ie"]) {
                try {
                  e.keyCode = 0;
                }
                catch (e) {}
              }
              return false;
            }
            if (dom.disabled) {
              preventEvent(e);
              if (pui["is_old_ie"]) {
                try {
                  e.keyCode = 0;
                }
                catch (e) {}
              }
              return false;
            }
          }
          if (dom.prevPage == true || dom.nextPage == true) {
            pagingLinksUseKey = true;
          }
          doms.push(dom);
        }
        // I'm guessing the following block's purpose is to click when onclick is defined, but only when the shortcut key isn't also
        // for a grid's pageUp/pageDown. So, I added the "pagingLinksUseKey". For more explanation, see issue 4807.
        if (doms.length >= 1 && typeof doms[0].onclick == "function" && !doms[0].responseRoutine && dom.nextPage != true && dom.prevPage != true && !pagingLinksUseKey) {
          doms[0].onclick();
          pui.runtimeContainer.focus();
          preventEvent(e);
          if (pui["is_old_ie"]) {
            try {
              e.keyCode = 0;
            }
            catch (e) {}
          }
          return false;
        }
        if (allDisabled) {
          preventEvent(e);
          if (pui["is_old_ie"]) {
            try {
              e.keyCode = 0;
            }
            catch (e) {}
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

      for (i = 0; i < doms.length; i++) {
        doms[i].responseValue = "1";
        if (doms[i].bypassValidation == "true" || doms[i].bypassValidation == "send data") {
          pui.bypassValidation = doms[i].bypassValidation;
        }
        if (doms[i].responseRoutine) {
          pui.responseRoutine = doms[i].responseRoutine;
          pui.responseRoutineRow = doms[i].subfileRow;
          pui.responseRoutineGrid = doms[i].subfileName;
        }
      }

      var returnVal = pui.respond();

      if (returnVal == false) {
        for (i = 0; i < doms.length; i++) {
          doms[i].responseValue = "0";
        }
        pui.bypassValidation = "false";
        pui.responseRoutine = null;
        pui.responseRoutineRow = null;
        pui.responseRoutineGrid = null;
      }

      preventEvent(e);
      if (pui["is_old_ie"]) {
        try {
          e.keyCode = 0;
        }
        catch (e) {}
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
      catch (e) {}
    }
    return false;
  }
};

pui.handleF1 = function(e) {
  return pui.handleHotKey(e, "F1");
};

pui["run"] = function(config) {
  var mobile = (config["mobile"] === true);
  var screenshot = (config["screenshot"] === true);
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
  pui.renderLog = (config["renderLog"] === true);
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
  if (config["jsonURL"] == null && config["replay"] == null && config["mode"] != "preview") {
    pui.assignUnloadEvents();
  }
  container.setAttribute("tabindex", "0");
  pui.runtimeContainer = container;
  pui.showWaitAnimation();
  var method = "post";
  var url = getProgramURL("PUI0001200.pgm");
  var jsonURL = config["jsonURL"];
  if (config["replay"]) {
    jsonURL = "/profoundui/userdata/automated-testing/tests/" + config["replay"];
    if (!jsonURL.endsWith(".json")) jsonURL += ".json";
  }
  if (jsonURL != null) {
    // Use GET here to avoid 412 - Precondition Failed in Chrome and IOS7 Safari.
    url = jsonURL + "?r=" + Math.floor((Math.random() * 1000000000) + 1);
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
  if (config["lang"] != null && config["lang"] != "") {
    ajaxParams["lang"] = config["lang"];
  }
  if (pui["isCloud"]) {
    ajaxParams["workspace_id"] = pui.cloud.ws.id;
    ajaxParams["workspace_url"] = location.href;
    if (screenshot) ajaxParams["screenshot"] = "1";
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
  ajaxParams["screen_width"] = screen.width;
  if (pui.canvasSize) ajaxParams["screen_width"] = pui.canvasSize.split("x")[0];
  var params = config["params"];
  if (params != null) {
    for (var param in params) {
      ajaxParams[param] = params[param];
    }
  }
  if (config["mode"] == "preview") {
    var genPreview = null;
    if (window.opener && window.opener.pui && typeof window.opener.pui["generatePreview"] === "function") genPreview = window.opener.pui["generatePreview"];
    if (window.parent && window.parent != window && pui.windowAccessible(window.parent) && window.parent.noderun && typeof window.parent.noderun["generatePreview"] === "function") {
      genPreview = window.parent.noderun["generatePreview"];
    }
    var preview;
    if (genPreview) {
      preview = genPreview(config["previewTab"]);
    }
    if (!preview) {
      pui.clearChildNodes(container);
      pui.alert("Preview data is no longer available.  You can rebuild the preview in the Visual Designer.");
    }
    else {
      preview.container = container;
      pui.isPreview = true;
      var dummySubmit = false;
      if (window.opener && window.opener.pui && window.opener.pui.viewdesigner) dummySubmit = true;
      if (window.opener && window.opener.pui && window.opener.pui.nodedesigner) dummySubmit = true;
      if (window.parent && window.parent != window && pui.windowAccessible(window.parent) && window.parent.noderun) dummySubmit = true;
      if (dummySubmit) {
        pui.handler = function(response) {
          ajaxJSON({
            "url": "/profoundui/dummy_submit",
            "method": "post",
            "params": response,
            "sendAsBinary": false,
            "suppressAlert": true,
            "handler": function() {
              document.body.innerHTML = "<br/><br/>Preview screen submitted.";
            },
            "onfail": function() {
              document.body.innerHTML = "<br/><br/>Preview screen submitted.";
            }
          });
        };
      }
      else {
        pui.handler = null;
      }
      // If any items depend on external files, wait for those to load before
      // rendering. Without dependencies, pui.render is called without waiting.
      pui.loadDependencyFiles(preview, function() {
        pui.render(preview);
      });
    }
  }
  else {
    // get puiRefreshId cookie
    var puiRefreshId = pui["getCookie"]("puiRefreshId");
    if (puiRefreshId != null) {
      // delete the cookie
      pui["deleteCookie"]("puiRefreshId", "/", null, null, "Strict");
      // set refresh parameter and append persistence id
      ajaxParams = {
        "refresh": "1"
      };
      url += "/" + puiRefreshId;
    }

    if (pui.recordTest) {
      pui.recording["payloads"].push({
        url: url,
        data: ajaxParams
      });
    }

    ajaxJSON({
      "url": pui.addRequestId(url),
      "method": method,
      "sendAsBinary": false,
      "params": ajaxParams,
      "saveResponse": true,
      "suppressAlert": true,
      "handler": function(parms) {
        function loadMobileExtensionFilesCompletion() {
          if (Array.isArray(parms["payloads"])) { // Recording replay
            pui.replay = parms;
            pui.replayStep = Number(config["step"]);
            if (!pui.replayStep || isNaN(pui.replayStep)) pui.replayStep = 1;
            var container = parms.container;
            parms = parms["payloads"][pui.replayStep - 1]["response"];
            parms = JSON.parse(JSON.stringify(parms));
            parms.container = container;
            parms["version"] = pui["version"];
            pui.createReplayUI();
          }
          pui.render(parms);
        }
        function loadDependencyFilesCompletion() {
          pui.loadMobileExtensionFiles(mobile, loadMobileExtensionFilesCompletion);
        }
        parms.container = container;

        // If any items depend on external files, wait for those to load before
        // rendering. Then, if mobile, wait to load files from userdata/extension/mobile
        // before rendering. Otherwise, pui.render is called without waiting.
        pui.loadDependencyFiles(parms, loadDependencyFilesCompletion);
      },
      "onfail": function(req) {
        pui.hideWaitAnimation();
        setTimeout(function() {
          if (pui["onoffline"] == null) {
            if (!pui["suppress comm errors"]) {
              pui.alert(pui.getNoConnectionMessage(req));
            }
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
  var screenshot = (config["screenshot"] === true);
  var container = config["container"];
  var debug = config["debug"];
  var workstnid = config["workstnid"];
  var atriumitem = config["atrium_item"];
  if (atriumitem == null) atriumitem = "";
  if (workstnid == null) workstnid = "";
  workstnid = workstnid.toUpperCase();
  var log = config["log"];
  var plog = config["plog"];
  var autotest = config["autotest"];
  pui.renderLog = (config["renderLog"] === true);
  if (container == null) container = "pui";
  if (debug == null) debug = "0";
  if (log == null) log = "0";
  if (plog == null) plog = "0";
  if (autotest == null) autotest = "0";
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
  if (typeof (config["program"]) != "undefined") {
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
    "plog": plog,
    "autotest": autotest,
    "workstnid": workstnid,
    "atrium_item": atriumitem
  };
  if (config["lang"] != null && config["lang"] != "") {
    ajaxParams["lang"] = config["lang"];
  }
  if (pui["isCloud"]) {
    ajaxParams["workspace_id"] = pui.cloud.ws.id;
    ajaxParams["workspace_url"] = location.href;
    if (screenshot) ajaxParams["screenshot"] = "1";
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
  ajaxParams["screen_width"] = screen.width;
  if (pui.canvasSize) ajaxParams["screen_width"] = pui.canvasSize.split("x")[0];
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
    pui["deleteCookie"]("puiRefreshId", "/", null, null, "Strict");
    // set refresh parameter and append persistence id
    ajaxParams = {
      "refresh": "1"
    };
    url += "/" + puiRefreshId;
  }

  if (pui.observer != null) return;

  if (pui.recordTest) {
    pui.recording["payloads"].push({
      url: url,
      data: ajaxParams
    });
  }

  ajaxJSON({
    "url": pui.addRequestId(url),
    "method": "post",
    "sendAsBinary": false,
    "params": ajaxParams,
    "saveResponse": true,
    "suppressAlert": true,
    "handler": function(parms) {
      parms.container = container;

      // If any items depend on external files, wait for those to load before
      // rendering. Otherwise, pui.render is called without waiting.
      pui.loadDependencyFiles(parms, function() {
        pui.render(parms);
      });
    },
    "onfail": function(req) {
      pui.hideWaitAnimation();
      setTimeout(function() {
        if (pui["onoffline"] == null) {
          if (!pui["suppress comm errors"]) {
            pui.alert(pui.getNoConnectionMessage(req));
          }
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
        pui.clearChildNodes(document.body);
        document.body.innerHTML = '<div id="close-browser-msg" style="font-family: Trebuchet MS; width: 95%; text-align: center; font-size: 200%;"><br/>' + pui["getLanguageText"]("runtimeMsg", "session ended text") + "<br/><br/>" + pui["getLanguageText"]("runtimeMsg", "close browser text") + "</div>";
        pui.closeSession(); // Without this, a parent atrium tab can't be closed by clicking [x].
        return;
      }
      parms.container = pui.runtimeContainer;

      var data = parms["data"];
      if (data == null) data = {};
      if (parms["view"] != null) { // view changed by controller
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
        pui.clearChildNodes(pui.runtimeContainer);
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
        "format": format, // if not specified, the first format is used
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
  var plog = parms["plog"];
  var autotest = parms["autotest"];
  pui.recordTest = (parms["record"] === "1");
  var atriumItem = parms["atrium_item"];
  var initPgm = parms["initpgm"];
  var jsonURL = parms["jsonURL"];
  var replay = parms["replay"];
  var step = parms["step"];
  var mode = parms["mode"];
  var controller = parms["controller"];
  var mobile = (parms["mobile"] === "1");
  var screenshot = (parms["screenshot"] === "1");
  var observe = (parms["observe"] === "1");
  if (observe) pui.observed.enabled = true;
  var lang = "";
  if (parms["lang"] != null) lang = parms["lang"];
  pui.renderLog = (parms["renderLog"] === "1");
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
    "plog": plog,
    "autotest": autotest,
    "workstnid": workstnid,
    "suffixid": suffixid,
    "duplicateid": duplicateid,
    "mobile": mobile,
    "screenshot": screenshot,
    "params": params,
    "observe": observe,
    "lang": lang,
    "renderLog": pui.renderLog
  };
  if (program == null && jsonURL == null && replay == null && mode == null) {
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
    if (replay != null) config["replay"] = replay;
    if (step != null) config["step"] = step;
    if (mode != null) config["mode"] = mode;
    if (config["mode"] === "preview") {
      config["previewTab"] = parms["previewTab"];
    }
    pui["run"](config);
  }
};

pui.newSession = function() {
  window.location.reload();
};

pui.closeSession = function() {
  if (window.parent != window && pui.checkForAtrium(window.parent)) {
    window["Atrium"]["closeTab"]();
    return;
  }

  var parentAccessible = pui.windowAccessible(window.parent); // Avoid exception when session is in iframe in different origin than parent. #5165.

  if (window.parent != window && parentAccessible && window.parent.pui && window.parent.pui["isCloud"]) {
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

  if (window.parent != window && parentAccessible && window.parent.noderun && typeof window.parent.noderun["stopApp"] === "function") {
    window.parent.noderun["stopApp"]();
    return;
  }

  pui.clearChildNodes(document.body);
  document.body.innerHTML = '<div id="close-browser-msg" style="width: 95%; text-align: center; font-size: 200%;"><br/>' + pui["getLanguageText"]("runtimeMsg", "close browser text") + "</div>";

  // This can throw an exception in some older releases of FireFox 3 when attempting to
  // close a window that was not opened through scripting.
  try {
    window.close();
  }
  catch (e) {
  }

  // Uncomment this to restore the previous behavior of pui.closeSession() terminating the Android mobile client app.
  // if (navigator["app"] != null && navigator["app"]["exitApp"] != null) { // Check for exitApp api in PhoneGap
  //   navigator["app"]["exitApp"]();
  // }

  // If mobile client, restart the webview and return to the connections screen
  if (window["puiMobileClient"] != null) {
    window.location.href = "index.html";
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
      // maskDiv.style.left = (-pui.runtimeContainer.offsetLeft) + "px";
      // maskDiv.style.top = (-pui.runtimeContainer.offsetTop) + "px";
      var runtimePosition = getDivPosition(pui.runtimeContainer);
      maskDiv.style.left = (0 - runtimePosition.x) + "px";
      maskDiv.style.top = (0 - runtimePosition.y) + "px";
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
    var pos = { "x": 0, "y": 0 };
    if (obj.offsetParent) {
      while (1) {
        pos.x += obj.offsetLeft;
        pos.y += obj.offsetTop;
        if (!obj.offsetParent) {
          break;
        }
        obj = obj.offsetParent;
      }
    }
    else if (obj.x) {
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
    if (pui["resizeFrequency"] != null && pui.lastResizeTime != null && (new Date()).getTime() - pui.lastResizeTime < pui["resizeFrequency"]) return;
    pui.lastResizeTime = (new Date()).getTime();

    bodyWidth = document.documentElement.clientWidth - 2;
    bodyHeight = document.documentElement.clientHeight - 2;

    if (maskDiv != null) {
      maskDiv.style.height = bodyHeight + "px";
      maskDiv.style.width = bodyWidth + "px";
    }

    scroll();
  }

  function scroll() {
    if (pui["scrollFrequency"] != null && pui.lastScrollTime != null && (new Date()).getTime() - pui.lastScrollTime < pui["scrollFrequency"]) return;
    pui.lastScrollTime = (new Date()).getTime();

    var top = document.documentElement.scrollTop;
    var left = document.documentElement.scrollLeft;
    if (!pui["is_old_ie"]) {
      top = window.pageYOffset;
      left = window.pageXOffset;
    }
    var runtimePosition = getDivPosition(pui.runtimeContainer);
    if (pui.genie != null || pui.runtimeContainer.offsetLeft != 0 || pui.runtimeContainer.offsetTop != 0) {
      left -= runtimePosition.x;
      if (context == "dspf") top -= runtimePosition.y;
      else top = -pui.runtimeContainer.offsetTop;
    }

    if (maskDiv != null) {
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

      if (elem.layoutT != null && typeof elem.layoutT.sentToBackground == "function") {
        elem.layoutT.sentToBackground();
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
  windowDiv.className = "pui-window-div";
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
  for (var w = 0; w < pui.windowStack.length; w++) {
    screenDims = pui.getDimensions(pui.windowStack[w]);
    if (screenDims.x1 != screenDims.x2 && screenDims.y1 != screenDims.y2) break;
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
  if (pui.messageSubfileHelpWindowDiv != null && !document.body.contains(pui.messageSubfileHelpWindowDiv)) {
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
  if (date.length == 7 && date.substr(0, 1) == "1") {
    date = "20" + date.substr(1);
    var year = Number(date.substr(0, 4));
    var month = Number(date.substr(4, 2)) - 1;
    var day = Number(date.substr(6, 2));
    var dateObj = new Date(year, month, day);
    var dateFormat = pui.appJob.dateFormat;
    if (dateFormat == "") dateFormat = "*ISO";
    var keyword = pui.formatting.keywords.DATFMT[dateFormat];
    var dispFormat = keyword.pattern.replace(/\B/g, pui.appJob.dateSeparator);
    date = dateObj.format(dispFormat, "en_US");
  }

  var time = get(prefix + "time" + suffix);
  var tSep = pui.appJob["timeSeparator"];
  if (tSep == null) tSep = ".";
  time = time.substr(0, 2) + tSep + time.substr(2, 2) + tSep + time.substr(4, 2);

  var text = textObj.innerHTML;

  var help = get(prefix + "help" + suffix);
  help = help.replace(/&amp;N/g, "<br/><br/>");
  help = help.replace("Cause . . . . . :", "<strong>Cause:</strong>");
  help = help.replace("Recovery  . . . :", "<strong>Recovery:</strong>");
  help = help.trim();
  if (help && help.substr(0, 1) !== "<") { // no markup already added
    help = "<br/><br/><strong>Additional Information:</strong> " + help;
  }

  var content = '<div class="pui-sflmsg-panel-heading"><strong>Additional Message Information</strong></div>';
  content += '<div class="pui-sflmsg-panel-content">';
  content += "<strong>Message Id:</strong> " + id + "<br/><br/>";
  content += "<strong>Message:</strong> " + text + "<br/><br/>";
  content += "<strong>Date/Time:</strong> " + date + " " + time;
  content += help;
  content += "<br/><br/>";
  content += "</div>";

  var gridObj = textObj.parentNode.parentNode;
  var top = parseInt(gridObj.style.top);
  var left = parseInt(gridObj.style.left);
  left += 3;
  var node = gridObj.parentNode;
  while (node && node !== pui.runtimeContainer && node !== document.body) {
    top += node.offsetTop;
    left += node.offsetLeft;
    node = node.offsetParent;
  }

  var minWidth = 600;
  var width = gridObj.clientWidth - 25;
  if (width < minWidth) {
    width = minWidth;
  }

  var div;
  if (pui.messageSubfileHelpWindowDiv == null || pui.messageSubfileHelpWindowDiv.parentNode == null) {
    div = document.createElement("div");
    pui.runtimeContainer.appendChild(div);
  }
  else {
    div = pui.messageSubfileHelpWindowDiv;
  }
  div.style.position = "absolute";
  div.style.width = width + "px";
  div.className = "pui-sflmsg-panel";
  div.style.zIndex = pui.windowZIndex;
  div.innerHTML = content;
  div.style.display = "";
  var closeButton = document.createElement("div");
  closeButton.style.position = "absolute";
  closeButton.style.top = "3px";
  closeButton.style.right = "2px";
  closeButton.className = "pui-sflmsg-panel-close-button";
  closeButton.onclick = function() {
    div.style.display = "none";
    if (div.parentNode) div.parentNode.removeChild(div);
  };
  div.style.left = left + "px";
  top = top - div.offsetHeight - 5;
  if (top < 5) top = 5;
  div.style.top = top + "px";
  div.appendChild(closeButton);

  pui.messageSubfileHelpWindowDiv = div;
};

pui.setActiveElement = function(e) {
  var target = getTarget(e);
  if (!(target.tagName == "INPUT" && target.type == "button")) {
    pui.activeElement = target;
  }
  var dom = target;
  if (dom.parentNode && dom.parentNode.comboBoxWidget) dom = dom.parentNode;
  if (dom.parentNode && dom.parentNode.floatingPlaceholder) dom = dom.parentNode;
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
  if (cell && cell.comboBoxWidget) cell = cell.parentNode;
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
  if (elem.parentNode != null && elem.parentNode.floatingPlaceholder != null) elem = elem.parentNode;
  if (elem.tagName == "OPTION" && elem.parentNode.tagName == "SELECT") elem = elem.parentNode;
  if (elem.tagName == "IMG" && elem.parentNode.tagName == "BUTTON") {
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
        // pui.cursorValues.wrow = winTop;
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
      // if (!isNaN(winLeft) && winLeft > 0) {
      //  pui.cursorValues.wcolumn = winLeft;
      // }
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
  if (dom.parentNode && dom.parentNode["pui"] && dom.parentNode["pui"]["properties"]["field type"] === "combo box") {
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
  if (dom.parentNode && dom.parentNode["pui"] && dom.parentNode["pui"]["properties"]["field type"] === "combo box") {
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
  if (box.floatingPlaceholder != null) box = box.floatingPlaceholder.getBox();
  if (box.value.length == box.maxLength && (pui["is_touch"] || (getCursorPosition(box) >= box.maxLength))) {
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

pui.gotoNextElementAndPossiblySelect = function(target) {
  function findNextObj(obj) {
    var beforeElements = [];
    var afterElements = [];

    var allInputs = document.querySelectorAll("INPUT,SELECT,TEXTAREA");
    var element = null;
    var objIdx = null;
    for (var iCnt = 0; iCnt < allInputs.length; iCnt++) {
      element = allInputs[iCnt];

      // 1. We don't need to keep track of current obj.
      // 2. We don't care about hidden, readonly or not focusable elements (this will not drop all 100% of them... but close)
      // 3. We want the element in the propery order (starting at current Obj)
      if (element == obj) objIdx = iCnt;
      else if (!element.clientHeight || !element.clientWidth || element.readOnly == "true" || element.disabled == "true" || element.tabIndex == "-1") continue;
      else if (!objIdx) beforeElements.push(element);
      else afterElements.push(element);
    }

    // We want the afterElements to be before the beforeElements (so that it is in the proper order from current obj)
    var allElements = afterElements.concat(beforeElements);
    // Whatever the first element is, should be the next element we take them to...
    if (allElements.length > 0) {
      return allElements[0];
    }

    return null;
  }

  var nextObj = target;

  while ((nextObj = findNextObj(nextObj)) != null) {
    var nextObjBox = nextObj;
    if (nextObj != null && nextObj.comboBoxWidget != null) nextObjBox = nextObj.comboBoxWidget.getBox();
    if (nextObj != null && nextObj.floatingPlaceholder != null) nextObjBox = nextObj.floatingPlaceholder.getBox();

    var tag = nextObjBox.tagName;
    if (tag == "INPUT" || tag == "SELECT" || tag == "TEXTAREA" || tag == "A") {
      if (!nextObjBox.readOnly && !nextObjBox.disabled && nextObj.style.visibility != "hidden" && nextObjBox.tabIndex != "-1") {
        try {
          nextObjBox.focus();
          // If the element we are trying to force focus doesn't get focus -- then it has something else causing this field to not allow it to be focused
          // This should catch 100% of the other causes.
          if (document.activeElement != nextObjBox) {
            continue;
          }
          if (pui["highlight on focus"]) nextObjBox.select();
          setTimeout(function() {
            pui.returnCursor(null, nextObjBox);
          }, 0);
        }
        catch (e) {}
        break;
      }
    }
  }
};

pui.positionIsCalc = function(position) {
  var isCalc = position.search(/calc/i);
  if (isCalc >= 0) return true;
  else return false;
};

pui.getCalcValue = function(domElement, position) {
  // TODO: Get the values of percent.
  // TODO: calculate for the base PX.
  var positionValue;
  var parentSpread;
  if (position == "left" || position == "right") {
    positionValue = domElement.style[position];
    parentSpread = domElement.parentNode.offsetWidth;
  }
  if (position == "bottom" || position == "top") {
    positionValue = domElement.style[position];
    parentSpread = domElement.parentNode.offsetHeight;
  }
  var value;
  // TODO: remove the "calc","(" and ")"
  value = positionValue.replace(/calc|[{()}]/gi, "");
  // Divide the current value into 3. 1st value ( percent ), operand (+, -, *, /), 2nd value
  value = value.split(" ");
  // Value 0 is the first value, 1 is the operand and 2 is the 2nd value
  // Only passed 1 value (might be uneccessary but gonna put it anyway.)
  if (value.length < 2) {
    if (value[0].search("%") >= 0) {
      return pui.measurementInPixel(value[0], parentSpread);
    }
    return pui.measurementInPixel(value[0]);
  }
  var firstValue;
  var secondValue;
  var operand = value[1];
  // Calculate
  // Get percent in decimal.
  // Check if Percent
  if (value[0].search("%") >= 0) {
    // Example 50% will be ( 50/100 = 0.5 (value as decimal) * parentWidth )
    firstValue = pui.measurementInPixel(value[0], parentSpread);
  }
  else {
    firstValue = pui.measurementInPixel(value[0]);
  }
  secondValue = pui.measurementInPixel(value[2]);
  return eval(firstValue + operand + secondValue);
};
pui.measurementInPixel = function(value, parentSpread) {
  // Default value on parameters does not work on compilation.
  // If percent the parentSpread ( total width or height of the parent ) is required.
  // If value is empty return 0
  if (value === "") return 0;
  if (value.search("%") >= 0) {
    // no parentSpread, do nothing
    if (!parentSpread) return null;
    return Math.round((parseInt(value) / 100) * parseInt(parentSpread));
  }
  // Rem is reliant on font-size of the html while em is reliant on the parent div.
  // setting the value of 16 seems to work okay.
  if (value.search(/rem/i) >= 0 || value.search(/em/i) >= 0) {
    return parseInt(parseInt(value) * 16);
  }
  else {
    return parseInt(value);
  }
};
pui.goToClosestElement = function(baseElem, direction) {
  var cellX;
  var cellY;
  var gridX;
  var gridY;
  if (baseElem.parentNode.comboBoxWidget != null) baseElem = baseElem.parentNode;
  if (baseElem.parentNode.floatingPlaceholder != null) baseElem = baseElem.parentNode;
  var parentWidth = baseElem.parentNode.offsetWidth;
  var parentHeight = baseElem.parentNode.offsetHeight;
  // TODO: Check for the "calc"
  // TODO: condition if it has calc.
  // Get the value of baseX
  var baseX = pui.positionIsCalc(baseElem.style.left) ? pui.getCalcValue(baseElem, "left") : pui.measurementInPixel(baseElem.style.left, parentWidth);
  if (isNaN(baseX)) return null;
  // Get the value of baseY
  var baseY = pui.positionIsCalc(baseElem.style.top) ? pui.getCalcValue(baseElem, "top") : pui.measurementInPixel(baseElem.style.top, parentHeight);
  if (isNaN(baseY)) return null;
  // Get the parent of the inputs
  var container = baseElem.parentNode;
  var gridDom = container.parentNode;
  if (gridDom.grid != null) { // the base element is within a grid
    cellX = parseInt(baseElem.parentNode.style.left);
    if (isNaN(cellX)) return null;
    cellY = parseInt(baseElem.parentNode.style.top);
    if (isNaN(cellY)) return null;
    gridX = parseInt(gridDom.style.left);
    if (isNaN(gridX)) return null;
    gridY = parseInt(gridDom.style.top);
    if (isNaN(gridY)) return null;
    baseX += cellX + gridX;
    baseY += cellY + gridY;
    container = gridDom.parentNode;
  }

  var curElem = null;
  var curXDiff = 99999;
  var curYDiff = 99999;
  var elems = [];
  // Function to add elements/inputs in the elems variable.
  function addElemsByTag(tag) {
    var elemsForThisTag = container.getElementsByTagName(tag);
    var elem;
    for (var i = 0; i < elemsForThisTag.length; i++) {
      elem = elemsForThisTag[i];
      if (elem.tagName == "A" && elem.parentNode.pui != null && elem.parentNode.pui.properties != null && elem.parentNode.pui.properties["field type"] == "hyperlink" && elem.parentNode.tabIndex == -1) {
        continue; // Hyperlink widgets are A wrapped in DIV with tabIndex set on the DIV. Make sure to see the tabIndex. #4771.
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
    // var mainElemWidth = elem;
    // var mainElemHeigth = elem;
    if (elem.parentNode.comboBoxWidget != null) mainElem = elem.parentNode;
    if (elem.parentNode.floatingPlaceholder != null) mainElem = elem.parentNode;
    // if (pui.positionIsCalc(mainElem.style.left)) var x = pui.getCalcValue(mainElem,'left')
    // else var x = pui.measurementInPixel(mainElem.style.left,parentWidth);
    var x = pui.positionIsCalc(mainElem.style.left) ? pui.getCalcValue(mainElem, "left") : pui.measurementInPixel(mainElem.style.left, parentWidth);
    if (isNaN(x)) continue;
    // if (pui.positionIsCalc(mainElem.style.top)) var y = pui.getCalcValue(mainElem,'top')
    // else var y = pui.measurementInPixel(mainElem.style.top,parentHeight);
    var y = pui.positionIsCalc(mainElem.style.top) ? pui.getCalcValue(mainElem, "top") : pui.measurementInPixel(mainElem.style.top, parentHeight);

    if (isNaN(y)) continue;
    gridDom = mainElem.parentNode.parentNode;
    if (gridDom.grid != null) { // the element is within a grid
      cellX = parseInt(mainElem.parentNode.style.left);
      if (isNaN(cellX)) return null;
      cellY = parseInt(mainElem.parentNode.style.top);
      if (isNaN(cellY)) return null;
      gridX = parseInt(gridDom.style.left);
      if (isNaN(gridX)) continue;
      gridY = parseInt(gridDom.style.top);
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
      if (yDiff <= 3 && xDiff < curXDiff) {
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
    catch (e) {}
  }
};

pui.fieldUpper = pui.formatUpper = function(fieldName) {
  if (fieldName == null) return "";
  if (pui.handler != null || pui.viewdesigner || pui["pjsDefaultMode"] === "case-sensitive") return fieldName;
  else return fieldName.toUpperCase();
};

pui.doFieldExit = function(target, minus) {
  if (!target.disabled && !target.readOnly) {
    if (target.tagName == "TEXTAREA" ||
       (target.tagName == "INPUT" && (target.type == "text" ||
                                        target.type == "number" ||
                                        target.type == "password"))) {
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
      else if (minus && !value.includes("-")) {
        var numValue = Number(value);
        if (!isNaN(numValue) && numValue != 0) {
          value = "-" + value;
        }
      }
      var needsOnchange = (target.value !== value);
      target.value = value;
      target.modified = true;
      if (needsOnchange && typeof target.onchange === "function") {
        target.onchange();
      }
    }
  }

  if (target.autoAdvance == true) {
    pui.keyName = "Enter";
    pui.click();
  }
  else {
    pui.gotoNextElementAndPossiblySelect(target);
  }

  return false;
};

pui.translate = function(parms) {
  var i;
  // Translation map will always be sent from up-to-date backend.
  // Allow compatability with older backend for now.
  pui.translationMap = parms["translations"];
  pui.translationMap2 = parms["translations 2"];
  if (pui.translationMap == null) {
    return;
  }

  // The map comes in UTF-16, hex encoded.
  for (i in pui.translationMap) {
    pui.translationMap[i] = pui.formatting.decodeGraphic(pui.translationMap[i]);
  }

  if (pui.translationMap2) {
    for (i in pui.translationMap2) {
      pui.translationMap2[i] = pui.formatting.decodeGraphic(pui.translationMap2[i]);
    }
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
      var translationPlaceholderMap = pui.buildTranslationPlaceholderMap(null, null, screen, format["data"], format["ref"]);
      msg += pui.doTranslate(screen, pui.translationMap, pui.translationMap2, true, translationPlaceholderMap);
      for (var iItem = 0; iItem < items.length; iItem++) {
        var item = items[iItem];
        if (!item["grid"]) { // skip items in grid now, and we will call doTranslate on them later
          var itemTranslationPlaceholderMap = pui.buildTranslationPlaceholderMap(item, null, screen, format["data"], format["ref"]);
          msg += pui.doTranslate(item, pui.translationMap, pui.translationMap2, false, itemTranslationPlaceholderMap);
        }
      }
    }
  }

  if (msg != "") {
    return "Missing translation data:\n\n" + msg;
  }
};

pui.doTranslate = function(obj, translationMap, translationMap2, isScreen, translationPlaceholderMap) {
  var i; // loop iterator
  isScreen = (isScreen === true);
  var rtn = "";

  for (var propName in obj) {
    var propVal = obj[propName];
    if (pui.isTranslated(propVal)) {
      var phraseIds = propVal["translations"];
      var phrases = [];
      var phrases2 = [];
      for (i = 0; i < phraseIds.length; i++) {
        var id = phraseIds[i];
        // Id zero is reserved for blank/empty entry in
        // list-type properties.
        var phrase = (id == 0) ? "" : translationMap[id];
        var phrase2 = (id == 0) ? "" : translationMap2 ? translationMap2[id] : null;

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

        if (phrase2 != null) {
          phrases2.push(phrase2);
        }
      }
      if (phrases.length == 1) {
        obj[propName] = phrases[0];
        if (phrases2.length == 1 && phrases2[0]) {
          obj[propName + "_secondary"] = phrases2[0];
        }
      }
      else if (phrases.length > 1) {
        obj[propName] = JSON.stringify(phrases);
        // Check if at least one non-empty secondary phrase exists
        var hasSecondary = false;
        for (var j = 0; j < phrases2.length; j++) {
          if (phrases2[j]) {
            hasSecondary = true;
            break;
          }
        }
        if (hasSecondary) {
          obj[propName + "_secondary"] = JSON.stringify(phrases2);
        }
      }

      if (!obj["grid"]) {
        for (i = 0; i < translationPlaceholderMap.keys.length; i++) {
          obj[propName] = obj[propName]["replaceAll"]("(&" + translationPlaceholderMap.keys[i] + ")", translationPlaceholderMap.values[i]);
        }
      }
    }
  }

  return rtn;
};

/**
 * Builds a map in the format of {keys: [], values: []}.
 * It will take parameters in the function of either a screen alone, the grid alone, or a screen and a widget.
 * If we are doing translations for a screen, or a screen and a widget, all bound values will be resolved.
 * If we are doing translations for a grid, bound values will not be resolved, so that they can be resolved on each grid row.
 * @returns {undefined}
 */
pui.buildTranslationPlaceholderMap = function(widget, grid, screen, data, ref) {
  var value;
  var map = {
    keys: [],
    values: []
  };

  if (grid) { // Build a map for a grid
    for (property in grid) {
      if (property.includes("grid row translation placeholder key")) {
        value = "grid row translation placeholder value" + property.slice(36);
        map.keys.push(grid[property]);
        map.values.push(grid[value]);
      }
    }
  }
  else { // Then we are building a map for a screen
    for (property in screen) {
      if (property.includes("translation placeholder key")) {
        value = "translation placeholder value" + property.slice(27);
        map.keys.push(screen[property]);
        map.values.push(pui.evalBoundProperty(screen[value], data, ref));
      }
    }
  }

  if (widget) {
    map = pui.addWidgetTranslationPlaceholders(widget, map, data, ref);
  }
  return map;
};

/**
 * This function will take an existing Translation Placeholder Map, in the format of {keys: [], values: []} and will add the
 * translation placeholders to it from the included widget.
 * @returns {undefined}
 */
pui.addWidgetTranslationPlaceholders = function(widget, map, data, ref) {
  if (widget != null && map != null) {
    for (property in widget) {
      if (property.includes("translation placeholder key") && !property.includes("grid row")) {
        var value = "translation placeholder value" + property.slice(27);
        if (map.keys.indexOf(widget[property]) > -1) {
          map.values[map.keys.indexOf(widget[property])] = pui.evalBoundProperty(widget[value], data, ref);
        }
        else {
          map.keys.push(widget[property]);
          map.values.push(pui.evalBoundProperty(widget[value], data, ref));
        }
      }
    }
  }
  else {
    pui.alert("Missing translation data:\n\nTranslation Placeholder error processing widget level translation placeholders.");
  }
  return map;
};

/**
 * Set timeout to show help overlays when they come into view. Assume this onscroll
 * handler is attached only when help overlays are on.
 * @returns {undefined}
 */
pui["wikihelp"].onscroll = function() {
  // If another handler is queued, then remove it so only one runs.
  if (pui["wikihelp"].onscrollTimeoutVal != null) {
    clearTimeout(pui["wikihelp"].onscrollTimeoutVal);
  }

  // Delay to avoid expensive checking all elements frequently (60fps is 16.6ms per frame).
  pui["wikihelp"].onscrollTimeoutVal = setTimeout(pui["wikihelp"].onscrollTimeout, 17);
};

/**
 * Show help overlays when they come into view. Callback for setTimeout in onscroll.
 * @returns {undefined}
 */
pui["wikihelp"].onscrollTimeout = function() {
  // Look at each overlay and retest its visibility if it isn't already visible.
  for (var i = 0; i < pui["wikihelp"]["overlays"].length; i++) {
    var overlay = pui["wikihelp"]["overlays"][i];

    if (!overlay["pui"].isVisible) {
      overlay["pui"].isVisible = pui["wikihelp"].isVisible(getObj(overlay["pui"]["fieldId"]));
      if (overlay["pui"].isVisible) overlay.style.display = "block";
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
pui["wikihelp"].isVisible = function(el) {
  if (el == null) return false;

  // Check if the element is in a tab panel, and if the parent tab is selected.
  if (el.parentTabPanel && el.parentTab) {
    var partabPanel = document.getElementById(el.parentTabPanel);
    if (!partabPanel) return false; // The parent tab panel could not be found. Assume element isn't visible.
    var seltab = partabPanel.getTab();

    if (seltab !== parseInt(el.parentTab, 10)) return false; // The parent tab is not selected, so element is not visible.
  }

  var rect = el.getBoundingClientRect(); // Gets coordinates relative to viewport.
  var midpx = Math.round((rect.left + rect.right) / 2);
  var midpy = Math.round((rect.top + rect.bottom) / 2);

  // See what elements are at the widget's corners. (Note: elementFromPoint uses viewport coordinates.)
  // Testing 2px off exact corner catches grids and widgets that paint other elements in their exact corner.
  // Test multiple points in case element isn't scrolled completely in view.
  var topleftEl = document.elementFromPoint(rect.left + 2, rect.top + 2);
  var botrightEl = document.elementFromPoint(rect.right - 2, rect.bottom - 2);
  var botleftEl = document.elementFromPoint(rect.left + 2, rect.bottom - 2);
  var midpEl = document.elementFromPoint(midpx, midpy);

  if (topleftEl === el || midpEl === el || botrightEl === el || botleftEl === el ||
  el.contains(topleftEl) || el.contains(midpEl) || el.contains(botrightEl) ||
  el.contains(botleftEl)) {
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

  addEvent(window, "scroll", pui["wikihelp"].onscroll); // If any widgets become visible, shows overlay.

  // If the overlays have already been constructed, then show them.
  if (pui["wikihelp"]["overlays"].length > 0) {
    for (var i = 0; i < pui["wikihelp"]["overlays"].length; i++) {
      var overlay = pui["wikihelp"]["overlays"][i];

      // Re-test visibility in case elements changed since the overlays were created.
      overlay["pui"].isVisible = pui["wikihelp"].isVisible(getObj(overlay["pui"]["fieldId"]));

      if (overlay["pui"].isVisible) overlay.style.display = "block";

      // Elements inside hidden accordion sections can't report a valid offsetWidth/offsetHeight.
      // Try fetching those values again in case the elements are visible now.
      var el = document.getElementById(overlay["pui"]["fieldId"]);
      pui["wikihelp"].sizeOverlay(el, overlay);
    }// end showing each overlay.
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
  for (var lyrIdx = 0; lyrIdx < pui["layers"].length; lyrIdx++) {
    var layer = pui["layers"][lyrIdx];
    // Look in each format.
    for (var fmtIdx = 0; fmtIdx < layer.formats.length; fmtIdx++) {
      var format = layer.formats[fmtIdx];
      // Ignore formats that aren't current.
      if (pui.arrayIndexOf(curfmtNames, format.name) < 0) continue;

      // Look at each item in this format.
      for (var itmIdx = 0; itmIdx < format.metaData.items.length; itmIdx++) {
        var item = format.metaData.items[itmIdx];
        if (!item.id) continue;

        // Get the widget element to determine the overlay's position and size.
        var el = getObj(item.id);
        if (!el) continue;
        if (item["field type"] === "layout") continue;
        if (item["field type"] === "panel") continue;
        if (item["field type"] === "css panel") continue;
        if (item["visibility"] === "hidden") continue;

        // Info to pass on to the onclick handler and to pui.wikihelp.skipItem.
        var details = {};
        details["dspf"] = format.file;
        details["recfmt"] = format.name;
        details["fieldId"] = item.id;
        details["field type"] = item["field type"];

        // Pass along field name for bound fields.
        if (typeof (item.value) == "object" && item.value.fieldName) {
          details["fieldName"] = item.value.fieldName;
        }
        else if (typeof (item["menu response"]) == "object" && item["menu response"].fieldName) {
          details["fieldName"] = item["menu response"].fieldName;
        }
        else if (typeof (item.response) == "object" && item.response.fieldName) {
          details["fieldName"] = item.response.fieldName;
        }
        else {
          details["fieldName"] = "";
        }

        // Let the end-developer limit which items to overlay via this API function.
        if (typeof pui["wikihelp"]["skipItem"] == "function" && pui["wikihelp"]["skipItem"](details) === true) continue;

        // Create a new overlay div that we can position absolutely.
        var overlay = document.createElement("div");
        overlay.className = "pui-wikih-overlay";
        overlay.style.position = "absolute";
        el.parentNode.appendChild(overlay);

        overlay["pui"] = details;

        // Pass the original element's tab details to the overlay to help determine visibility.
        if (el.parentTabPanel && el.parentTab) {
          overlay["pui"].parentTabPanel = el.parentTabPanel;
          overlay["pui"].parentTab = parseInt(el.parentTab, 10);
        }

        // Note: the onscroll event will re-test elements that were originally out of the viewport.
        overlay["pui"].isVisible = pui["wikihelp"].isVisible(el);

        // Show the overlay, unless there is a parent tab that isn't selected.
        if (overlay["pui"].isVisible && displayOverlays) overlay.style.display = "block";
        else overlay.style.display = "none";

        // Extra details needed for special case widgets.
        if (item["field type"] === "grid" && item["csv export"] === "true") {
          overlay["pui"].pagingBarHeight = pui.pagingBarHeight;
        }
        if (item["field type"] === "styled button") {
          overlay["pui"].itemHeight = item["height"];
        }

        overlay.style.zIndex = el.style.zIndex + 100;

        // Match the overlay's position with the position of the widget.
        if (el.style.top.length > 0) overlay.style.top = el.style.top;
        else if (el.style.bottom.length > 0) overlay.style.bottom = el.style.bottom;
        if (el.style.left.length > 0) overlay.style.left = el.style.left;
        else if (el.style.right.length > 0) overlay.style.right = el.style.right;

        // Look for user-defined text content.
        if (pui["wikihelp"]["overlayText"]) {
          overlay.appendChild(document.createTextNode(pui["wikihelp"]["overlayText"]));
        }

        // Add an image for the overlay.
        if (pui["wikihelp"]["image"]) {
          var img = document.createElement("img");
          img.src = pui["wikihelp"]["image"];
          overlay.appendChild(img);
        }

        pui["wikihelp"].sizeOverlay(el, overlay);

        addEvent(overlay, "click", pui["wikihelp"].onClickOverlay);
        pui["wikihelp"]["overlays"].push(overlay);
      }// end looking at each item.
    }// end looking at each format.
  }// end looking at each layer.
};

/**
 * Calculate the width and height of an overlay box based on the underlying widget properties.
 * @param {Object} el       The widget's DOM element.
 * @param {Object} overlay  The help overlay object for a widget.
 * @returns {undefined}
 */
pui["wikihelp"].sizeOverlay = function(el, overlay) {
  // Match the width/height of the widget on the page; zIndex over it.
  // Workaround for IE8,IE9 offset values returning 0: call getBoundingClientRect
  el.getBoundingClientRect();
  var ovwidth = el.offsetWidth;
  var ovheight = el.offsetHeight;

  // Special cases; adjust position and size of overlay.
  //
  // Radio buttons and checkboxes have multiple elements not inside a parent div.
  if (overlay["pui"]["field type"] === "radio button") {
    overlay.style.margin = "3px 3px 0 5px";
    // The next sibling
    if (el.nextSibling && el.nextSibling.tagName.toLowerCase() == "div") {
      ovwidth = el.offsetWidth + el.nextSibling.offsetWidth;
      ovheight = Math.max(el.offsetHeight, el.nextSibling.offsetHeight);
    }
  }
  else if (overlay["pui"]["field type"] === "checkbox") {
    overlay.style.margin = "2px";
    if (el.nextSibling && el.nextSibling.tagName.toLowerCase() == "div") {
      ovwidth = el.offsetWidth + el.nextSibling.offsetWidth;
      ovheight = Math.max(el.offsetHeight, el.nextSibling.offsetHeight);
    }
  }
  // Tab panels contain other elements, so only overlay the tabs to
  // prevent clicking them.
  else if (overlay["pui"]["field type"] === "tab panel") {
    // 2nd child Node contains the tabs. Use height from tabs.
    ovheight = el.childNodes[1].offsetHeight;
    overlay.style.fontSize = (ovheight * 0.85) + "px";
  }
  else if (overlay["pui"]["field type"] === "date field") {
    ovwidth = el.offsetWidth + 22;
  }
  else if (overlay["pui"]["field type"] === "grid" && overlay["pui"].pagingBarHeight != null) {
    ovheight += overlay["pui"].pagingBarHeight;
  }
  else if (overlay["pui"]["field type"] === "styled button" && !overlay["pui"].itemHeight) {
    ovheight = 0;
    // Look at the dimensions of each of the widget's child elements, and add overall height.
    var buttonChild = el.firstChild;
    while (buttonChild != null) {
      if (buttonChild.style != null && buttonChild.style.position == "absolute") {
        var btnChildHgt = buttonChild.offsetTop + buttonChild.offsetHeight;
        if (btnChildHgt > ovheight) ovheight = btnChildHgt;
      }
      buttonChild = buttonChild.nextSibling;
    }
  }

  overlay.style.width = ovwidth + "px";
  overlay.style.height = ovheight + "px";

  // Set user-defined text size: scale the font unless explicitly told not to.
  if (pui["wikihelp"]["overlayText"] && pui["wikihelp"]["fontScale"] != false) {
    // Get user-defined font scaling factors or use the best determined
    // values for Helvetica font with latin characters.
    var fontScale = Number(pui["wikihelp"]["fontScale"]);
    if (isNaN(fontScale)) fontScale = 1.56;

    // Calculate the largest font size for the text to remain in its box.
    // Works for most boxes with short (1-4 chars) strings.
    var fontWidth = ovwidth / pui["wikihelp"]["overlayText"].length;
    var fontHeight = Math.min(fontWidth * fontScale, ovheight * fontScale / 2);
    overlay.style.fontSize = fontHeight + "px";
  }

  // Set image overlay size.
  if (pui["wikihelp"]["image"]) {
    var img = overlay.getElementsByTagName("img")[0];
    // By default make the image square. Otherwise it stretches for some fields.
    if (pui["wikihelp"]["imageSquare"] !== false) {
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
  removeEvent(window, "scroll", pui["wikihelp"].onscroll);

  for (var i = 0; i < pui["wikihelp"]["overlays"].length; i++) {
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
  event = event || window.event; // cross browser event.
  preventEvent(event); // cross browser event.preventDefault and cancelBubble.

  var target = event.target || event.srcElement; // srcElement is for IE<9.

  // An image may capture the click event, so get the div node, which has the
  // parameters we need to pass along.
  if (target.parentNode["pui"] && target.parentNode["pui"]["dspf"]) target = target.parentNode;

  // Export the event, display file name, record format name, clicked field id,
  // and field name to the user's handler function if it exists.
  var params = {};
  params["dspf"] = target["pui"]["dspf"];
  params["recfmt"] = target["pui"]["recfmt"];
  params["fieldId"] = target["pui"]["fieldId"];
  params["fieldName"] = target["pui"]["fieldName"];
  params["field type"] = target["pui"]["field type"];
  params["event"] = event;
  if (typeof (pui["wikihelp"]["onclick"]) === "function") {
    pui["wikihelp"]["onclick"](params);
  }
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
  if (pui["wikihelp"]["overlays"].length < 1) {
    pui["wikihelp"].createOverlays(false);
  }

  var info = {};
  info["formats"] = currentFormatNames();
  info["dspf"] = pui["layers"][0]["formats"][0].file;

  info["fields"] = [];
  // If we need to fetch items from current formats, iterate over pui.wikihelp.overlays.
  for (var i = 0; i < pui["wikihelp"]["overlays"].length; i++) {
    var field = {};
    field.id = pui["wikihelp"]["overlays"][i]["pui"]["fieldId"];
    if (pui["wikihelp"]["overlays"][i]["pui"]["fieldName"] &&
    pui["wikihelp"]["overlays"][i]["pui"]["fieldName"].length > 0) {
      field.name = pui["wikihelp"]["overlays"][i]["pui"]["fieldName"];
    }
    info["fields"].push(field);
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
      (propname == "active section") ||
      (propname == "radio button group") ||
      (propname == "page down response" && dom.grid != null && dom.grid.pagingBar != null) ||
      (propname == "page up response" && dom.grid != null && dom.grid.pagingBar != null) ||
      (propname == "value" &&
      (
        (dom.tagName == "INPUT" && dom.type != "button") ||
          dom.tagName == "SELECT" ||
          dom.tagName == "TEXTAREA" ||
          dom.comboBoxWidget != null ||
          dom.floatingPlaceholder != null ||
          dom.slider != null ||
          dom.signaturePad != null ||
          dom.onOffSwitch != null
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

      if (elem.layoutT != null && typeof elem.layoutT.sentToBackground == "function") elem.layoutT.sentToBackground(); // Fix 5044.
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
    pui.clearChildNodes(this.prevScreen);
    if (this.prevScreen.parentNode) this.prevScreen.parentNode.removeChild(this.prevScreen);
    this.prevScreen = null;
  },

  adjustHeight: function() {
    // This logic was borrowed from Mobile Layout

    // If height is unset, IE returns "auto", and all others return "0px"
    var parentStyle = pui.getComputedStyle(this.newScreen);
    if (parentStyle != null && (parentStyle["height"] == "0px" || parentStyle["height"] == "auto")) {
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

function timer(time) {
  var now = new Date().getTime();
  if (time) {
    now -= time;
  }
  return now;
}

pui.findParentGrid = function(obj) {
  var parent = obj.parentElement;
  while (parent) {
    obj = parent;
    if (obj.grid) return obj.grid;
    parent = obj.parentElement;
  }
  return null;
};

/**
 * Request a Job Log download from the server and prompt the user to save it.
 * Assume only Profound UI calls this function when a user clicked a "Download Job Log" link in puiscreens.dspf.
 * The link to download the job log should only be visible if there is a joblog key.
 * @param {Object} parms
 */
pui["downloadJobLog"] = function(parms) {
  var xhr, outputEl, jobinfo, filename;
  if (arguments.length === 1 && typeof parms === "object" && parms !== null) {
    filename = parms["filename"];
    jobinfo = parms["jobinfo"];
    outputEl = parms["outputEl"];
  }
  else if (arguments.length === 4) {
    // Handle PJS error screen from 6.0.0-beta4 or older.
    jobinfo = arguments[0];
    filename = arguments[2];
    outputEl = arguments[3];
  }

  if (outputEl == null || parms == null || typeof jobinfo !== "string" || typeof filename !== "string") {
    console.log("Cannot download job log. Parameter(s) to function are incorrect.");
    return;
  }

  pui.clearChildNodes(outputEl);
  outputEl.innerHTML = pui["getLanguageText"]("runtimeMsg", "downloading x", ["..."]);

  var filesaverPath = "/jszip/FileSaver.min.js";
  if (typeof saveAs == "function" || pui.getScript(pui.normalizeURL(filesaverPath)) != null) {
    makeXHR();
  }
  else {
    pui["loadJS"]({ "path": filesaverPath, "callback": makeXHR });
  }

  function makeXHR() {
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = joblogFetch;
    xhr.open("POST", getProgramURL("PUI0009118.pgm"), true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("jobinfo=" + jobinfo);
  }

  function joblogFetch() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        if (typeof xhr.response === "string" && xhr.response.length > 0) {
          var contentDisp = xhr.getResponseHeader("Content-Disposition");
          if (contentDisp === "attachment") {
            // The Content-Disposition header is "attachment" when the response is good. Store the results.
            var filesaver = saveAs(new Blob([xhr.response]), filename, { "type": "text/plain;charset=utf-8" });
            filesaver["onwriteend"] = filesaverWriteEnded;
          }
          else {
            // The response is error plain text.
            outputEl.innerHTML = pui["getLanguageText"]("runtimeMsg", "failed to load x", ["Job Log"]) + "<br>" + xhr.response;
          }
        }
        else {
          outputEl.innerHTML = "Job log download error: Empty Response";
        }
      }
      else {
        outputEl.innerHTML = "Job log download error:<br>HTTP " + xhr.status + "<br>" + xhr["responseURL"];
      }
    }
  }

  function filesaverWriteEnded() {
    outputEl.innerHTML = pui["getLanguageText"]("runtimeText", "upload finished text");
    setTimeout(function() {
      outputEl.innerHTML = "";
    }, 3000);
  }
};
