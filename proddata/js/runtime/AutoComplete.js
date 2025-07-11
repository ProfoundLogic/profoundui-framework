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

/**
 * Auto-Complete Class
 * @param {Object} config Configuration.
 * @constructor
 */

function AutoComplete(config) {
  /* PRIVATE MEMBERS */
  var cancelQuery = false;

  // Internal fields.
  var me = this;
  var top;
  var left;
  var resultPane;
  var shadowDiv;
  var leftShadow;
  var rightShadow;
  var centerShadow;
  var leftCorner;
  var rightCorner;
  var firstField;
  var activeRecord = null;
  var records = [];
  var typeAheadTimer;
  var hiddenField;
  var selectedRecord;
  var scrollingIntoView = false;
  var scrollable = false;
  var usingScrollbar = false;
  var scrollbarWidth = getScrollbarWidth();
  var maxHeight = null;
  var inMouseClick = false;
  var keyPressed = false;

  // Fields adjustable through config. object.
  var container;
  var textBox;
  var url;
  var valueField;
  var topAdjust;
  var leftAdjust;
  var zIndex;
  var width;
  var baseParams;
  var paramName;
  var limit;
  var shadow;
  var template;
  var typeAheadDelay;
  var onselect;
  var beforequery;
  var onload;
  var choices;
  var values;
  var recordSet;
  var ondbload;
  var sentsequence = 0; // Helps prevent out-of-order results.

  /* CONSTRUCTOR */

  // Apply configuration options.
  url = config.url;
  valueField = config.valueField;

  // Text box can be either id or dom object.
  if (typeof (config.textBox) == "object") textBox = config.textBox;
  else textBox = document.getElementById(config.textBox);
  textBox.setAttribute("autocomplete", "off");
  if (config.container) {
    container = config.container;
  }
  else {
    container = textBox.parentNode;
  }
  // Set maxLength to a large number.
  // Removing the attribute using removeAttribute() causes -1
  // to be assigned in FF, causing problems.
  // Saving the old length which is the length of the field so that we can accurate report the 5250 cursor position
  if (context == "genie") {
    textBox.setAttribute("fieldLength", textBox.getAttribute("maxLength"));
    textBox.setAttribute("maxLength", "133");
  }
  // Set hard-coded choices and values, if provided.
  if (config.choices && config.values) {
    var translated = false;
    var compare = trim(textBox.value);
    recordSet = [];
    choices = config.choices;
    values = config.values;
    for (var i = 0; i < values.length; i++) {
      if (choices[i] != null) {
        recordSet[recordSet.length] = [];
        recordSet[recordSet.length - 1][0] = trim(choices[i]);
        recordSet[recordSet.length - 1][1] = trim(values[i]);
        if (!translated && compare != "") {
          if (compare == trim(values[i])) {
            textBox.value = trim(choices[i]);
            textBox.autoCompTranslated = true;
            translated = true;
          }
        }
      }
    }
    recordSet.sort(function(a, b) {
      if (a[0].toUpperCase() < b[0].toUpperCase()) return -1;
      else return 1;
    });
    firstField = "field1";
    valueField = "field2";
  }

  // If value field is different than the display field,
  // check for an exact match and set the value.
  if (valueField) {
    if (context == "genie") {
      // Remove text box name attribute and create a hidden field with old text box name in the form.
      var textBoxName = textBox.getAttribute("name");
      textBox.removeAttribute("name");
      try {
        hiddenField = document.createElement("<input name=\"" + textBoxName + "\" />");
      }
      catch (e) {
        hiddenField = document.createElement("input");
        hiddenField.name = textBoxName;
      }
      hiddenField.type = "hidden";
      hiddenField.value = textBox.value;
      hiddenField.autoCompBox = textBox;
      if (textBox.fieldInfo != null) {
        // Save the field row and col numbers as attributes because we are removing fieldInfo from the textbox.
        textBox.setAttribute("fieldRow", textBox.fieldInfo.row); // #6101.
        textBox.setAttribute("fieldCol", textBox.fieldInfo.col);
        var idx = textBox.fieldInfo["idx"];
        hiddenField.fieldInfo = textBox.fieldInfo;
        pui.response[idx] = hiddenField;
        textBox.fieldInfo = null;
      }
      document.forms["main"].appendChild(hiddenField);
    }

    if (context == "dspf") {
      hiddenField = { value: "" };
      textBox.autoCompValueField = hiddenField;
    }
  }

  // Use supplied adjustments, otherwise default to zero.
  if (config.topAdjust) topAdjust = config.topAdjust;
  else topAdjust = 0;
  if (config.leftAdjust) leftAdjust = config.leftAdjust;
  else leftAdjust = 0;

  // Use supplied zIndex, otherwise default to 100000.
  if (config.zIndex) zIndex = config.zIndex;
  else zIndex = 100000;

  // Take width from config. Otherwise this will be calculated when data is
  // received for the first time.
  if (typeof (config.width) != "undefined") width = config.width;

  // Base parameters will be sent on all Ajax requests.
  if (config.baseParams) baseParams = config.baseParams;

  // The contents of the box will be sent as this parameter name. Defaults to "query".
  if (config.paramName) paramName = config.paramName;
  else paramName = "query";

  // Record limit sent to server.
  if (typeof (config.limit) != "undefined") limit = config.limit;

  // Shadowing will default on.
  if (typeof (config.shadow) != "undefined" && config.shadow == false) shadow = false;
  else shadow = true;

  // Assign events.
  if (typeof (config.beforequery) == "function") beforequery = config.beforequery;
  if (typeof (config.onload) == "function") onload = config.onload;
  if (config.onselect != null) onselect = config.onselect;
  if (config.ondbload != null) ondbload = config.ondbload;

  // Assign custom template, if supplied. This will be set up with a default on
  // first record retrieval, if not supplied.
  if (typeof (config.template) != "undefined") template = config.template;

  // Assign type ahead delay. Default to 0.2 second.
  if (typeof config.typeAheadDelay === "number") typeAheadDelay = config.typeAheadDelay;
  else typeAheadDelay = 200;

  // Take scrollable/maxHeight from config. default=false
  if (typeof (config.scrollable) != "undefined" && typeof (config.maxHeight) != "undefined" && config.maxHeight != null) {
    scrollable = config.scrollable;
    maxHeight = config.maxHeight;
  }

  // Create result pane, and shadowing divs. These will be sized/positioned when data is shown or when the window is resized.

  resultPane = document.createElement("div");
  resultPane.style.display = "none";
  resultPane.style.margin = "0px";
  resultPane.style.padding = "0px";
  resultPane.style.position = "absolute";
  resultPane.style.zIndex = zIndex;
  resultPane.className = "autocomplete-results " + trim(textBox.id) + "-autocomplete-results";

  resultPane.addEventListener("mousedown", doClick, false);
  resultPane.addEventListener("mouseup", doMouseUp, false);
  container.appendChild(resultPane);

  if (shadow) {
    // When using CSS url(), the URLs given must be qualified with https:// in SSL mode.
    // IE issues security warnings if this is not done.
    var imageBaseURL = "";
    if (HTTPS == "ON") {
      imageBaseURL = "https://" + HTTP_HOST;
    }
    imageBaseURL += pui.normalizeURL("/profoundui/proddata/images/");
    shadowDiv = document.createElement("div");
    shadowDiv.style.display = "none";
    shadowDiv.style.padding = "0px";
    shadowDiv.style.margin = "0px";
    shadowDiv.style.position = "absolute";
    shadowDiv.style.zIndex = zIndex - 1;
    shadowDiv.style.fontSize = "0px";
    leftShadow = document.createElement("div");
    leftShadow.style.padding = "0px";
    leftShadow.style.margin = "0px";
    leftShadow.style.position = "absolute";
    leftShadow.style.background = "transparent url(" + imageBaseURL + "shadow-side.png) repeat-y scroll";
    shadowDiv.appendChild(leftShadow);
    leftCorner = document.createElement("div");
    leftCorner.style.padding = "0px";
    leftCorner.style.margin = "0px";
    leftCorner.style.position = "absolute";
    leftCorner.style.background = "transparent url(" + imageBaseURL + "shadow.png) no-repeat scroll 0px -12px";
    shadowDiv.appendChild(leftCorner);
    centerShadow = document.createElement("div");
    centerShadow.style.padding = "0px";
    centerShadow.style.margin = "0px";
    centerShadow.style.position = "absolute";
    centerShadow.style.background = "transparent url(" + imageBaseURL + "shadow.png) repeat-x scroll 0px -36px";
    shadowDiv.appendChild(centerShadow);
    rightShadow = document.createElement("div");
    rightShadow.style.padding = "0px";
    rightShadow.style.margin = "0px";
    rightShadow.style.position = "absolute";
    rightShadow.style.background = "transparent url(" + imageBaseURL + "shadow-side.png) repeat-y scroll -6px";
    shadowDiv.appendChild(rightShadow);
    rightCorner = document.createElement("div");
    rightCorner.style.padding = "0px";
    rightCorner.style.margin = "0px";
    rightCorner.style.position = "absolute";
    rightCorner.style.background = "transparent url(" + imageBaseURL + "shadow.png) no-repeat scroll 0px -6px";
    shadowDiv.appendChild(rightCorner);
    container.appendChild(shadowDiv);
  }

  // Attach events.
  textBox.addEventListener("keyup", doKeyUp, false);
  textBox.addEventListener("keydown", doKeyDown, false);
  textBox.addEventListener("blur", doBlur, false);
  textBox.addEventListener("input", onInput, false);
  if (!Array.isArray(pui.autoCompleteList) || pui.autoCompleteList.length == 0) {
    window.addEventListener("resize", pui.autoCompResize, false);
    pui.autoCompleteList = [];
  }
  pui.autoCompleteList.push(me);
  if (!pui.widgetsToCleanup) {
    pui.widgetsToCleanup = [];
  }
  pui.widgetsToCleanup.push(me);
  /* END CONSTRUCTOR */

  /* PUBLIC METHODS */
  this.setTemplate = function(setValue) {
    template = setValue;
  };

  this.isOpen = function() {
    return (resultPane.style.display == "block");
  };

  this.setWidth = function(setVal) {
    width = setVal;
  };

  this.getSelectedRecord = function() {
    return selectedRecord;
  };

  this.destroy = function() {
    if (textBox) {
      textBox.removeEventListener("keyup", doKeyUp);
      textBox.removeEventListener("keydown", doKeyDown);
      textBox.removeEventListener("blur", doBlur);
      textBox.removeEventListener("input", onInput);
    }
    for (var i = pui.autoCompleteList.length - 1; i >= 0; i--) {
      if (pui.autoCompleteList[i] === this) {
        pui.autoCompleteList.splice(i, 1);
        break;
      }
    }

    // If no other auto-complete widgets are open, remove the resize event listener. e.g. we wouldn't always
    // remove "resize" if "this" was in a grid cell, the grid is scrolling, but there is an autocomplete outside the grid.
    if (pui.autoCompleteList.length == 0) {
      window.removeEventListener("resize", pui.autoCompResize);
    }

    resultPane = null;
    shadowDiv = null;
    leftShadow = null;
    rightShadow = null;
    centerShadow = null;
    leftCorner = null;
    rightCorner = null;
    firstField = null;
    activeRecord = null;
    records = null;
    typeAheadTimer = null;
    hiddenField = null;
    selectedRecord = null;
    container = null;
    textBox = null;
    baseParams = null;
    shadow = null;
    onselect = null;
    beforequery = null;
    onload = null;
    choices = null;
    values = null;
    recordSet = null;
    ondbload = null;
    this.destroy = null; // Avoid letting error be called again.
    me = null;
  };

  this.updateUrl = function(newUrl) {
    url = newUrl;
  };

  this.resize = function() {
    if (this.isOpen()) showResults();
  };

  /* PRIVATE METHODS */

  function getScrollbarWidth() {
    var measureDiv = document.createElement("div");
    measureDiv.style.overflow = "scroll";
    measureDiv.style.visibility = "hidden";
    measureDiv.style.position = "absolute";
    document.body.appendChild(measureDiv);
    measureDiv.style.height = "50px";
    measureDiv.style.width = "50px";

    var measureContent = document.createElement("div");
    measureContent.style.height = "1px";
    measureDiv.appendChild(measureContent);

    var insideWidth = measureContent.offsetWidth;
    var outsideWidth = measureDiv.offsetWidth;
    measureDiv.parentElement.removeChild(measureDiv);

    return outsideWidth - insideWidth;
  }

  function doBlur(event) {
    event = event || window.event;
    // We don't want to execute the blur (regardless of browser)
    // if we are in the process of clicking in the result pane.
    if (usingScrollbar && inMouseClick) return;
    cancelQuery = true;
    setTimeout(hideResults, 200);
  }

  function doKeyDown(event) {
    keyPressed = true; // Signals onInput to not handle the query.

    event = event || window.event;
    var keyCode = event.keyCode;

    // Select appropriate item if up/down arrow keys are pressed and the result pane is visible.
    if ((keyCode == 38 || keyCode == 40) && resultPane.style.display == "block") {
      var index;
      if (keyCode == 38) {
        if (activeRecord != null) index = activeRecord - 1;
        else index = records.length - 1;
      }
      else if (keyCode == 40) {
        if (activeRecord != null) index = activeRecord + 1;
        else index = 0;
      }
      if (index < 0 || index >= records.length) index = null;
      activateRecord(index, true);
      event.cancelBubble = true;
      event.returnValue = false;
      if (event.preventDefault) event.preventDefault();
      if (event.stopPropagation) event.stopPropagation();
      return false;
    }
    else if (keyCode == 9 && activeRecord != null) {
      selectRecord();
    }
    else if (keyCode == 9 && activeRecord == null && pui["autocomplete tab selects"] == true) {
      activeRecord = 0;
      selectRecord(); // First record is selected if it exists. If no records exist, nothing happens. #5954.
    }
    // Select record if enter is pressed, the result pane is shown and a record is highlighted.
    // Hide the result pane if it is shown and a record is not selected.
    else if (keyCode == 13) {
      var resultsDisplayed = (resultPane.style.display == "block");
      // If there's only 1 result displayed and the user has entered a case-insensitive match,
      // we'll assume that they want to auto-select that value and allow the "enter" to make it's
      // way to the application. (Redmine #878)
      if (resultsDisplayed && resultPane.children.length == 1 &&
        resultPane.children[0].textContent.toUpperCase() === event.currentTarget.value.toUpperCase()) {
        activeRecord = 0;
        selectRecord();
        hideResults();
        return true;
      }
      if (resultsDisplayed && activeRecord != null) {
        selectRecord();
        hideResults();
        event.cancelBubble = true;
        event.returnValue = false;
        if (event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
        return false;
      }
      else {
        hideResults();
        if (resultsDisplayed) {
          event.cancelBubble = true;
          event.returnValue = false;
          if (event.preventDefault) event.preventDefault();
          if (event.stopPropagation) event.stopPropagation();
          return false;
        }
      }
    }
  }

  function doKeyUp(event) {
    keyPressed = false; // Clear the signal so onInput may handle a subsequent query.

    event = event || window.event;
    var keyCode = event.keyCode;

    if (textBox.readOnly || textBox.disabled) {
      return;
    }

    // Hide the result pane if there are no characters in the box.
    if (trim(textBox.value) == "") {
      if (hiddenField) hiddenField.value = "";
      hideResults();
      return;
    }

    // Query server when a printable character is pressed and there is at least one non-blank character in the box.
    // Second portion of if statement checks if running in mobile device browser or mobile client, and
    // checks if the keycode is 0. This is a fix for issue #593
    if ((keyCode == 8) || (keyCode >= 46 && keyCode <= 90) || (keyCode >= 96 && keyCode <= 111) || (keyCode >= 186 && keyCode <= 222) ||
      ((window.cordova != null || typeof window.orientation !== "undefined") && (keyCode == 0 || keyCode == 229))) {
      if (textBox.value.replace(/ /g, "") != "") {
        if (choices && values) {
          doLookup(rtrim(textBox.value.toUpperCase()));
        }
        else {
          clearTimeout(typeAheadTimer);
          cancelQuery = false;
          typeAheadTimer = setTimeout(function() {
            doQuery(rtrim(textBox.value));
          }, typeAheadDelay);
        }
      }
    }
  }

  /**
   * Handle the textbox value changing as a result of pasting with the mouse or browser Edit menu. Added for issue 3817.
   * @returns {undefined}
   */
  function onInput() {
    if (keyPressed) return; // If keys were pressed, then doKeyUp will handle the changed text.

    // Hide the result pane if there are no characters in the box.
    if (trim(textBox.value) == "") {
      if (hiddenField) hiddenField.value = "";
      hideResults();
      return;
    }

    if (textBox.value.replace(/ /g, "") != "") {
      if (choices && values) {
        doLookup(rtrim(textBox.value.toUpperCase()));
      }
      else {
        cancelQuery = false;
        doQuery(rtrim(textBox.value)); // This sets the TextBox value if a result returns.
      }
    }
  }

  function activateRecord(index, scrollIntoView) {
    if (activeRecord != null && resultPane.childNodes != null && resultPane.childNodes[activeRecord] != null) {
      resultPane.childNodes[activeRecord].className = resultPane.childNodes[activeRecord].className.replace(" autocomplete-selected", "");
      resultPane.childNodes[activeRecord].className = resultPane.childNodes[activeRecord].className.replace("autocomplete-selected", "");
    }
    if (index != null) {
      var recordDiv = resultPane.childNodes[index];
      recordDiv.className += " autocomplete-selected";

      // scroll record into view if necessary
      if (scrollIntoView == true && typeof recordDiv.scrollIntoView === "function") {
        // get window scroll top
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

        // get window height
        var y = 0;
        if (self.innerHeight) {
          y = self.innerHeight;
        }
        else if (document.documentElement && document.documentElement.clientHeight) {
          y = document.documentElement.clientHeight;
        }
        else if (document.body) {
          y = document.body.clientHeight;
        }

        // calulate bottom of window
        var bottom = scrOfY + y;

        // get offset location of record
        var offset = recordDiv.offsetTop + recordDiv.parentNode.offsetTop;
        var container = recordDiv.parentNode.parentNode;
        offset += container.offsetTop;
        if (container.parentNode != null && container.parentNode.grid != null) {
          offset += container.parentNode.offsetHeight;
          offset += container.parentNode.parentNode.offsetHeight;
        }

        if (offset + recordDiv.offsetHeight > bottom || offset < scrOfY) {
          scrollingIntoView = true;
          recordDiv.scrollIntoView(true);
          setTimeout(function() {
            scrollingIntoView = false;
          }, 1);
        }

        if (usingScrollbar && recordDiv.offsetTop > maxHeight && !scrollingIntoView) {
          scrollingIntoView = true;
          recordDiv.scrollIntoView(true);
          setTimeout(function() {
            scrollingIntoView = false;
          }, 1);
        }
      }
    }
    activeRecord = index;
  }

  function doLookup(query) {
    if (hiddenField) hiddenField.value = "";

    if (query == "") return;

    // Send dummy record in onload event so that template can be created.
    onload({ results: [{ "field1": "" }] });

    records = [];

    for (var i = 0; i < recordSet.length; i++) {
      if (config.containsMatch) {
        if (recordSet[i][0].toUpperCase().indexOf(query) != -1) {
          records.push({ "field1": recordSet[i][0], "field2": recordSet[i][1] });
        }
      }

      else { // Contains match is false. Only adds records that begin with query
        if (recordSet[i][0].toUpperCase().indexOf(query) == 0) {
          records.push({ "field1": recordSet[i][0], "field2": recordSet[i][1] });
        }
      }
    }

    if (records.length == 0) { // The function ends here if there were no matches
      hideResults();
    }

    else if (hiddenField && records.length == 1 && textBox.value.toUpperCase() == records[0][firstField].toUpperCase()) {
      hiddenField.value = getRecordValue(records[0], valueField);
      hideResults();
    }

    else {
      showResults();
    }
  }

  function doQuery(query) {
    // Do not send blank query.
    if (query == "") {
      hideResults();
      return;
    }

    if (beforequery && beforequery(baseParams, query) == false) return;
    selectedRecord = null;
    var postData = encodeURIComponent(paramName) + "=" + encodeURIComponent(query);
    if (limit != null) postData += "&limit=" + limit;
    if ((limit == null || limit == "") && pui["Default Auto Complete Max Choices"] != null) {
      postData += "&limit=" + encodeURIComponent(pui["Default Auto Complete Max Choices"]);
    }
    if (baseParams) {
      for (var i in baseParams) {
        // Do not send null or undefined values for baseParams["AUTH"]
        if (baseParams[i] == null && i === "AUTH") continue;
        postData += "&";
        postData += encodeURIComponent(i) + "=" + encodeURIComponent(baseParams[i]);
      }
    }

    if (pui["read db driven data as ebcdic"] !== true) postData += "&UTF8=Y";

    if (hiddenField) autoCompQueries += 1;
    var req;
    if (baseParams["AUTH"]) {
      req = new pui.Ajax(pui.appendAuth(url));
    }
    else {
      req = new pui.Ajax(url);
    }
    req["method"] = "post";
    req["async"] = true;
    req["suppressAlert"] = true;
    req["postData"] = postData;
    req["sequence"] = sentsequence; // Helps avoid using out-of-sequence results.
    req["onready"] = function(req) {
      if (hiddenField) autoCompQueries -= 1;

      if (req["sequence"] != null) {
        if (req["sequence"] < sentsequence) return; // Newer results have been received, so discard this out-of-sequence one. #5136.
        sentsequence++;
      }

      var response = checkAjaxResponse(req, "Generate Auto-Complete Suggestions");
      if (!response) {
        if (ondbload) pui.executeDatabaseLoadEvent(ondbload, false, textBox.id);
        return;
      }

      if (trim(textBox.value) == "") {
        hideResults();
        return;
      }
      if (cancelQuery) {
        hideResults();
        return;
      }

      var data;
      data = eval(response);
      records = data.results;

      if (context === "dspf" && typeof data["valueField"] === "string") {
        valueField = data["valueField"];
        hiddenField = { value: "" };
        textBox.autoCompValueField = hiddenField;
      }

      // Set value field and first field if not already defined.
      if ((valueField == null || firstField == null) && records != null && records.length > 0) {
        for (var i in records[0]) {
          if (valueField == null) valueField = i;
          if (firstField == null) firstField = i;
        }
      }

      if (hiddenField && records != null && records.length == 1 && textBox.value.toUpperCase() == records[0][firstField].toUpperCase()) {
        hiddenField.value = getRecordValue(records[0], valueField);
      }
      else if (hiddenField) {
        hiddenField.value = "";
      }

      if (records != null && records.length > 0) {
        if (onload) onload(data);
        showResults();
      }
      else hideResults();

      if (ondbload) pui.executeDatabaseLoadEvent(ondbload, true, textBox.id);
    };
    req.send();
  }

  function showResults() {
    drawResults();
    resultPane.style.display = "block";
    position();
    if (scrollable) makeScrollable();
    if (shadow) applyShadow();
  }

  function position() {
    var refEl = textBox;
    top = textBox.offsetTop;
    left = textBox.offsetLeft;
    if (textBox.parentNode != null && textBox.parentNode.floatingPlaceholder) {
      top = textBox.parentNode.offsetTop;
      left = textBox.parentNode.offsetLeft;
      refEl = textBox.parentNode;
    }

    var prt = refEl.parentNode;
    if (prt.parentNode.grid) {
      // Add cell offset.
      top += prt.offsetTop;
      left += prt.offsetLeft;

      // Add grid offset.
      prt = prt.parentNode;
      top += prt.offsetTop;
      left += prt.offsetLeft;

      prt = prt.parentNode;
    }

    // Add any container offset.
    if (prt.getAttribute("container") == "true") {
      var offset = pui.layout.getContainerOffset(prt);
      top += offset.y;
      left += offset.x;
    }

    // Add Genie window offset, if any.
    if (context == "genie") {
      if (refEl.parentNode["layerInfo"]) {
        top += refEl.parentNode.offsetTop + refEl.parentNode.clientTop;
        left += refEl.parentNode.offsetLeft + refEl.parentNode.clientLeft;
      }
    }

    // Shift down by height of textbox.
    top += textBox.offsetHeight;

    // Apply any configured adjustments.
    top += topAdjust;
    left += leftAdjust;

    var scrollTop = pui.getWindowScrollTop();
    if (top - scrollTop + resultPane.offsetHeight > pui["getWindowSize"]()["height"]) {
      var newTop = top - resultPane.offsetHeight - textBox.offsetHeight - 3;
      if (newTop - scrollTop >= 0) top = newTop;
    }

    resultPane.style.top = top + "px";
    resultPane.style.left = left + "px";
  }

  function hideResults() {
    if (resultPane != null) resultPane.style.display = "none";
    if (shadow) shadowDiv.style.display = "none";
    records = [];
    activeRecord = null;
  }

  function applyShadow() {
    shadowDiv.style.top = (top + 3) + "px";
    shadowDiv.style.left = (left - 4) + "px";
    shadowDiv.style.width = (width + 10) + "px";
    shadowDiv.style.height = (resultPane.offsetHeight + 2) + "px";
    leftShadow.style.top = "0px";
    leftShadow.style.left = "0px";
    leftShadow.style.width = "6px";
    if (resultPane.offsetHeight >= 6) leftShadow.style.height = (resultPane.offsetHeight - 6) + "px";
    if (resultPane.offsetHeight >= 6) leftCorner.style.top = (resultPane.offsetHeight - 6) + "px";
    leftCorner.style.left = "0px";
    leftCorner.style.height = "6px";
    leftCorner.style.width = "6px";
    if (resultPane.offsetHeight >= 6) centerShadow.style.top = (resultPane.offsetHeight - 6) + "px";
    centerShadow.style.left = "6px";
    centerShadow.style.height = "6px";
    centerShadow.style.width = (width - 2) + "px";
    rightShadow.style.top = "0px";
    rightShadow.style.right = "0px";
    rightShadow.style.width = "6px";
    if (resultPane.offsetHeight >= 6) rightShadow.style.height = (resultPane.offsetHeight - 6) + "px";
    if (resultPane.offsetHeight >= 6) rightCorner.style.top = (resultPane.offsetHeight - 6) + "px";
    rightCorner.style.right = "0px";
    rightCorner.style.height = "6px";
    rightCorner.style.width = "6px";
    shadowDiv.style.display = "block";
  }

  function drawResults() {
    var i; // loop iterator
    // Width sizing can work in one of two ways:

    // 1. In "auto" mode (default) the right edge of the inner pane will line up to the right edge of the text box.
    // 2. In "manual" mode (the config's "width" parameter is set) the result pane will be sized to the supplied width.

    // Width is set to either user defined value or calculated width.
    // The text box and result pane borders are taken into consideration.
    var calcWidth = textBox.offsetWidth;
    if (!pui["is_old_ie"] || !pui["is_quirksmode"]) calcWidth -= 2;
    if (width == null || width < calcWidth) width = calcWidth;
    resultPane.style.width = width + "px";

    var recs = records;
    if (config.columnData) {
      recs = [];
      var gotSome = false;
      for (i = 0; i < config.columnData.length; i++) {
        // test if textbox entry starts the same as data
        var val1 = textBox.value;
        var val2 = choices[i];
        // Avoid null reference errrors.
        if (val1 !== null && val2 !== null) {
          val2 = val2.substr(0, val1.length);
          val1 = val1.toUpperCase();
          val2 = val2.toUpperCase();
        }
        if (val1 == val2) {
          var rec = config.columnData[i];
          recs.push(rec);
          gotSome = true;
        }
        else {
          if (gotSome) break;
        }
      }
    }

    // Set template if not provided.
    if (!template) {
      var fieldName;
      // eslint-disable-next-line no-unreachable-loop
      for (i in recs[0]) {
        fieldName = i;
        break;
      }
      template = "<div class=\"autocomplete-item\">(" + fieldName + ")</div>";
    }

    resultPane.innerHTML = "";
    var html;
    for (i = 0; i < recs.length; i++) {
      // Replace all fields in the template;
      html = template;
      for (var k in recs[i]) {
        html = html.replace("(" + k + ")", recs[i][k]);
      }
      resultPane.innerHTML += html;
      resultPane.lastChild.setAttribute("recordIndex", String(i));
    }
    for (i = 0; i < resultPane.childNodes.length; i++) {
      resultPane.childNodes[i].addEventListener("mousemove", doMouseMove, false);
    }
  }

  function selectRecord() {
    if (activeRecord == null) return;
    // eslint-disable-next-line no-unreachable-loop
    for (var i in records[activeRecord]) {
      textBox.value = records[activeRecord][i];
      break;
    }
    selectedRecord = records[activeRecord];
    if (hiddenField != null) {
      if (records[activeRecord] != null) {
        hiddenField.value = getRecordValue(records[activeRecord], valueField);
      }
    }
    if (onselect) {
      if (pui.isRoutine(config.onSelectProp)) {
        pui["runLogic"](config.onSelectProp["routine"], textBox.subfileRow, textBox.subfileName);
        return;
      }
      try {
        var func = eval(onselect);
        if (typeof func == "function") func(selectedRecord, textBox);
      }
      catch (e) {
        pui.scriptError(e, "Onselect error:\n");
      }
    }
  }

  function getRecordValue(record, valueField) {
    var value = record[valueField];
    // valueField may be an expression rather than a simple field name
    // in which case the backend will return an alias, and the look up will not work
    if (value == null) {
      // however, the value field is always appended as the last field in the sql expression
      // so we loop throug all fields to get the last value
      for (var field in record) {
        value = record[field];
      }
    }
    return value;
  }

  function doMouseMove(event) {
    if (scrollingIntoView) return;

    event = event || window.event;
    var target = event.target || event.srcElement;

    var recordIndex = target.getAttribute("recordIndex");
    if (recordIndex == "" || recordIndex == null) {
      target = target.parentNode;
      recordIndex = target.getAttribute("recordIndex");
      if (recordIndex == "" || recordIndex == null) return;
    }

    activateRecord(Number(recordIndex));
  }

  function isOnScrollbar(event) {
    if (usingScrollbar && scrollbarWidth != null && resultPane.offsetWidth != null) {
      var scrollbarStart = event.currentTarget.getBoundingClientRect().right - scrollbarWidth;
      var mousePos = pui.getMouseX(event);
      if (mousePos > scrollbarStart) {
        return true;
      }
    }
    return false;
  }

  function doClick(event) {
    inMouseClick = true;
    setTimeout(function() {
      textBox.focus();
    }, 0);
    if (isOnScrollbar(event)) return;
    selectRecord();
    hideResults();
  }

  function doMouseUp(event) {
    inMouseClick = false;
  }

  function makeScrollable() {
    resultPane.style.height = "";
    usingScrollbar = false;

    if (resultPane.clientHeight > maxHeight) {
      resultPane.style.height = String(maxHeight) + "px";
      usingScrollbar = true;
    }

    resultPane.style.overflowY = "auto";
  }
}

// This function is used: in widgets/textbox.js
pui.applyAutoComp = function(properties, originalValue, domObj) {
  var containsMatch;
  var i; // loop iterator
  var where;
  var file = evalPropertyValue(properties["choices database file"], originalValue, domObj);
  var temp = evalPropertyValue(properties["choice options field"], originalValue, domObj);
  var fields = pui.getFieldList(temp);
  var url = evalPropertyValue(properties["choices url"], originalValue, domObj);
  var urlReverse = evalPropertyValue(properties["use choices url for reverse lookup"], originalValue, domObj);
  urlReverse = (url != "" && urlReverse != null && (urlReverse == "true" || urlReverse == true)) ? true : false;
  var valueField = evalPropertyValue(properties["choice values field"], originalValue, domObj);
  var limit = evalPropertyValue(properties["max choices"], originalValue, domObj);
  containsMatch = (evalPropertyValue(properties["contains match"]) == "true");
  var choices = evalPropertyValue(properties["choices"], originalValue, domObj);

  choices = pui.parseCommaSeparatedList(choices);
  if (choices.length == 0) choices = [""];

  var values = evalPropertyValue(properties["choice values"], originalValue, domObj);
  if (values == "") {
    values = [];
    for (i = 0; i < choices.length; i++) {
      values.push(choices[i]);
    }
  }
  else {
    values = pui.parseCommaSeparatedList(values);
  }
  if (values.length == 0) values = [""];

  var tpl = trim(evalPropertyValue(properties["results template"], originalValue, domObj));
  if (tpl == "") tpl = null;

  // Apply auto complete if any of the settings are given.
  if ((file != "" && fields[0] != "") || url != "" || (choices.length > 0 && choices[0] != "" && values[0] != "")) {
    // Check for onselect event handler.
    var onSelectProp = evalPropertyValue(properties["onselect"], originalValue, domObj);
    var onselect;
    if (onSelectProp != null && onSelectProp != "") {
      onselect = onSelectProp;
      // Strip off any argument list that is given.
      var pos = onselect.indexOf("(");
      if (pos != -1) {
        if (onselect.substr(pos + 1, 1) == ")") {
          onselect = onselect.substr(0, pos);
        }
      }
    }

    // Check for ondbload event handler
    var onDbLoadProp = evalPropertyValue(properties["ondbload"], originalValue, domObj);
    if (typeof onDbLoadProp != "string" || onDbLoadProp == "") onDbLoadProp = null;

    // Create sql query and base params.
    var baseParams = {};
    if (pui["isCloud"]) {
      baseParams["workspace_id"] = pui.cloud.ws.id;
    }
    if (pui.pjs_session_id) baseParams["AUTH"] = pui.pjs_session_id;
    else {
      if (url == "" || !pui.nodejs) {
        baseParams["AUTH"] = pui.appJob.auth;
        if (typeof pui["vId"] !== "undefined") baseParams["VID"] = pui["vId"];
      }
    }

    if (url == "" && choices[0] == "" && values[0] == "") {
      containsMatch = (evalPropertyValue(properties["contains match"], originalValue, domObj) == "true");
      var sql = "SELECT DISTINCT ";
      for (i = 0; i < fields.length; i++) {
        if (i != 0) sql += ", ";
        sql += fields[i];
      }
      if (valueField != "") sql += "," + valueField;
      sql += " FROM " + file;
      sql += " WHERE UPPER(" + fields[0] + ") LIKE '";
      if (containsMatch) sql += "%";
      sql += "!!QUERY!!%'";
      where = evalPropertyValue(properties["choices selection criteria"], originalValue, domObj);
      if (where != "") sql += " AND (" + where + ")";
      sql += " ORDER BY " + fields[0];
    }

    if (domObj.autoComp != null && domObj.autoComp.destroy != null) {
      domObj.autoComp.destroy();
      domObj.autoComp = null;
    }

    var container;
    if (context == "dspf" && inDesignMode()) {
      container = toolbar.designer.container;
    }
    else {
      var prt = domObj.parentNode;
      while (prt) {
        if (prt.isPUIWindow) {
          container = prt;
          break;
        }
        prt = prt.parentNode;
      }

      if (container == null) {
        container = pui.runtimeContainer;
      }
    }

    var safeUpperCase = function(str) {
      // The following business gets around certain browsers (i.e. Chrome)
      // upper-casing the German eszett character to SS, which throws off
      // matching in SQL WHERE clause.
      // This code converts eszett to 'capital eszett', which IBM doesn't seem to
      // recognize. Then the rest of the string is upper-cased, and the eszett
      // is then set back to normal.
      str = rtrim(str.replace(/\u00DF/g, "\u1E9E"));
      str = str.toUpperCase();
      str = str.replace(/\u1E9E/g, "\u00DF");
      return str;
    };

    var autoComp = new AutoComplete({
      textBox: domObj,
      url: (url != "") ? url : getProgramURL("PUI0009102.PGM"),
      baseParams: baseParams,
      container: container,
      containsMatch: containsMatch,
      choices: (choices[0] != "") ? choices : null,
      values: (values[0] != "") ? values : null,
      limit: (limit != "") ? limit : null,
      template: tpl,
      onselect: onselect,
      onSelectProp: properties["onselect"],
      ondbload: onDbLoadProp,
      typeAheadDelay: pui["autocomplete typeahead delay"],
      valueField: (url == "" && choices[0] == "" && values[0] == "" && valueField != "" && valueField != fields[0]) ? valueField : null,
      beforequery: (url == "" && choices[0] == "" && values[0] == "")
        ? function(baseParams, query) {
          if (evalPropertyValue(properties["case sensitive"], originalValue, domObj) == "true") {
          // Note: PUIWIDGET.cpp sees the "case sensitive" property and decides not to use UPPER in the query.
          //
          // If "text transform" or the bound setting for text transform are set, then make the user's input
          // upper/lower case. They would want this if their database values are already all upper/lowercase.
            if (evalPropertyValue(properties["text transform"], originalValue, domObj) == "uppercase" ||
            (domObj.formattingInfo != null && domObj.formattingInfo.textTransform == "uppercase")) {
              query = safeUpperCase(query);
            }
            else if (evalPropertyValue(properties["text transform"], originalValue, domObj) == "lowercase" ||
            (domObj.formattingInfo != null && domObj.formattingInfo.textTransform == "lowercase")) {
              query = rtrim(query.toLowerCase());
            }
          }
          else {
          // When "case sensitive" is off, always upper case. PUIWIDGET will use UPPER() in query.
            query = safeUpperCase(query);
          }

          if (query == "") return false;

          if (pui["secLevel"] > 0) {
            if (evalPropertyValue(properties["contains match"], originalValue, domObj) == "true") {
              query = "%" + trim(query) + "%";
            }
            else {
              query += "%";
            }
            baseParams["q"] = pui.getSQLVarName(domObj);
            baseParams["p1"] = query;
            pui.getSQLParams(properties, baseParams);
          }
          else {
            query = query.replace(/'/g, "''"); // escape single quotes only when secLevel=0
            baseParams["q"] = pui.aes.encryptString(sql.replace("!!QUERY!!", query));
          }
        }
        : null,

      onload: function(data) {
        // Quit if the auto complete template and sizing have already
        // been done. This flag will be embedded into the dom object
        // at the end of this function.
        if (tpl) return;
        if (domObj.autoCompSized != null) {
          if (domObj.autoCompTemplate) autoComp.setTemplate(domObj.autoCompTemplate);
          if (domObj.autoCompTotalWidth) autoComp.setWidth(domObj.autoCompTotalWidth);
          return;
        }

        var measureDiv = document.createElement("div");
        measureDiv.style.position = "absolute";
        measureDiv.style.top = "0px";
        measureDiv.style.left = "0px";
        measureDiv.style.className = "autocomplete-item";
        measureDiv.style.visibility = "hidden";
        document.body.appendChild(measureDiv);
        var template = "<div class=\"autocomplete-item\">";
        var colWidths = data.colWidths;
        var records = data.results;
        var firstRec = records[0];
        var index = 0;
        var totalWidth = 0;
        var temp;

        for (var i in firstRec) {
          // Quit when we have processed number of fields
          // equivalent to field display array size.
          // The "value" field (if used) is tacked onto the
          // end of the query, so appears in the data record
          // but not in the field display array...
          if (url == "" && index == fields.length) break;

          // When using a choices url that has returned a valueField, don't include
          // the valueField in the default template.
          if (url != "" && typeof data["valueField"] === "string" && i == data["valueField"]) continue;

          measureDiv.innerHTML = "";
          template += "<div class=\"autocomplete-col\" style=\"float: left; width: ";
          if (colWidths && colWidths[index]) {
            if (typeof (colWidths[index]) == "number") {
              for (var j = 0; j < colWidths[index]; j++) {
                measureDiv.innerHTML += "a";
              }
              template += (measureDiv.offsetWidth + 5) + "px;\"";
              totalWidth += measureDiv.offsetWidth + 5;
            }
            else if (typeof (colWidths[index]) == "string") {
              template += colWidths[index] + ";\"";
              temp = Number(colWidths[index].replace("px", ""));
              if (!isNaN(temp)) totalWidth += temp;
            }
            else {
              template += "100px\"";
              totalWidth += 100;
            }
          }
          else {
            template += "100px\"";
            totalWidth += 100;
          }
          template += ">(" + i + ")</div>";
          index++;
        }
        template += "</div>";
        // Attach the template and totalWidth to the dom element so that if ApplyProperty is used
        // to change the parameter markers it will save the template and width #4212
        domObj.autoCompTemplate = template;
        domObj.autoCompTotalWidth = totalWidth + 20;
        domObj.autoCompSized = true;
        autoComp.setWidth(domObj.autoCompTotalWidth);
        autoComp.setTemplate(domObj.autoCompTemplate);
        document.body.removeChild(measureDiv);
      },
      shadow: (pui["is_old_ie"] && pui["ie_mode"] <= 6) ? false : true,
      scrollable: true,
      maxHeight: isNaN(parseInt(evalPropertyValue(properties["max height"], originalValue, domObj)))
        ? null
        : parseInt(evalPropertyValue(properties["max height"], originalValue, domObj))

    });
    domObj.autoComp = autoComp;

    // If using value field, try to populate box with display value.
    if ((urlReverse || (url == "" && fields[0] != "" && valueField != "" && valueField != fields[0])) && domObj.value != "") {
      // Make request to server to get "display value for field" (reverse query)

      var req = new pui.Ajax((url != "") ? url : getProgramURL("PUI0009102.PGM"));

      req["method"] = "post";
      req["async"] = true;
      req["suppressAlert"] = true;

      if (pui.pjs_session_id) req["postData"] = "AUTH=" + pui.pjs_session_id;
      else {
        req["postData"] = "AUTH=" + pui.appJob.auth;
        if (typeof pui["vId"] !== "undefined") req["postData"] += "&VID=" + pui["vId"];
      }

      if (urlReverse) {
        req["postData"] += "&reverse=1&value=" + encodeURIComponent(rtrim(domObj.value));
      }
      else if (pui["secLevel"] > 0) {
        req["postData"] += "&q=" + encodeURIComponent(pui.getSQLVarName(domObj)) + ".reverse";
        req["postData"] += "&p1=" + encodeURIComponent(rtrim(domObj.value));
        var pstring = pui.getSQLParams(properties);
        if (pstring != "") {
          req["postData"] += "&" + pstring;
        }
      }
      else {
        where = evalPropertyValue(properties["choices selection criteria"], originalValue, domObj);
        var sql2 = "SELECT " + fields[0] + " FROM " + file + " WHERE " + valueField + " = '" + rtrim(domObj.value).replace("'", "''") + "'";
        if (where != "") sql2 += " AND (" + where + ")";
        req["postData"] += "&q=" + pui.aes.encryptString(sql2);
      }

      req["postData"] += "&limit=1";

      if (pui["isCloud"]) {
        req["postData"] += "&workspace_id=" + pui.cloud.ws.id;
      }

      req["onready"] = function(req) {
        autoCompQueries -= 1;

        var response = checkAjaxResponse(req, "Generate Auto-Complete Suggestions.");
        if (!response) {
          // If FACM is false, then submit the value to the server, even when the query has an error.
          // If FACM is not false, then a query error makes the value not submit to the server.
          if (pui["force auto complete match"] !== false) {
            domObj.value = "";
          }
          return;
        }
        var firstField;
        var firstRec = response.results[0];
        // eslint-disable-next-line no-unreachable-loop
        for (var i in firstRec) {
          firstField = i;
          break;
        }
        if (firstField == null) {
          // If the field's value doesn't match any auto-complete results, then clear the value.
          // If FACM is false, then the response value should be used, even when no autocomplete results match.
          if (pui["force auto complete match"] !== false) {
            domObj.value = "";
          }
        }
        else {
          if (domObj.autoCompValueField != null) domObj.autoCompValueField.value = domObj.value; // #7294. Store the existing value.
          domObj.value = firstRec[firstField];
        }
      };
      autoCompQueries += 1;

      req.send();
    }
  }
};

pui.autoCompResize = function() {
  for (var i = 0, length = pui.autoCompleteList.length; i < length; i++) {
    pui.autoCompleteList[i].resize();
  }
};
