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

pui["fileupload"] = {};

/**
 * File Upload Class. Parent class of FileUploadDND.
 * (See test cases in #6686 for a large list.)
 * @param {Element} container
 * @constructor
 */
pui["fileupload"].FileUpload = function(container) {
  // Private fields.
  this._mainBox = container;

  // If no child constructor sets these prior to calling FileUpload constructor, then set them here.
  this._clearLinkClass = this._clearLinkClass || "clear";
  this._uploadLinkClass = this._uploadLinkClass || "upload";
  this._alwaysShowProgressBar = this._alwaysShowProgressBar || false;
  this._validateBeforeUpload = this._validateBeforeUpload || true; // Avoid duplicate names, too many files

  this._abortLink = null; // visible when upload starts. hidden when stopped.

  this._transactionId = 1; // This is used to avoid submitting twice? Or to prevent browser caching responses.
  this._submitHandle = null;
  this._timeout = 86400000;
  this._error = ""; // This holds error from the last upload attempt. If non-empty, assume selectors haven't been marked "done".
  this._disabled = false;

  this._xhr = null; // XMLHttpRequest. Referenced here to allow aborting.

  this._selectionMode = this.MODE_STANDARD;

  this._fileLimit = 1;
  this._sizeLimit = 10;
  this._targetDirectory = "";
  this._altName = "";
  this._overwrite = false;
  this._generateNames = false;
  this._allowedTypes = [];
  this._actualFileNames = [];

  // An array of File objects added to after the browser lets the user drop or choose a file.
  this.fileList = [];

  this._createBoxes();
};

pui["fileupload"].FileUpload.prototype.MODE_STANDARD = 0;
pui["fileupload"].FileUpload.prototype.MODE_ENHANCED = 1;
pui["fileupload"].FileUpload.prototype.MODE_SINGLE = 2;

//
// Public methods.
//

/**
 * Render the widget's internal elements to reflect their states.
 * render is called in onchange/change events, this.clear, and when "field type" property is set.
 */
pui["fileupload"].FileUpload.prototype.render = function() {
  if (this._table.tBodies.length > 0) {
    this._table.removeChild(this._table.tBodies[0]);
  }
  var tBody = this._table.appendChild(document.createElement("tbody"));

  if (this._error.length > 0) this._showMessage(this._error);
  else this._clearErrors();

  var filesPending = false;
  for (var i = 0; i < this.fileList.length; i++) {
    var name = this.fileList[i].name + (" (" + pui.formatBytes(this.fileList[i].size, 2) + ")");
    var row = tBody.insertRow(-1);
    row.className = "row";
    if (i % 2 == 0) {
      row.className += " even";
    }
    else {
      row.className += " odd";
    }
    var col = row.insertCell(-1);
    col.className = "name-col";
    col.title = name;
    col.appendChild(document.createTextNode(name));

    // Indicate success for the file.
    if (this.fileList[i].done) {
      col = row.insertCell(-1);
      col.className = "remove-col";

      col = row.insertCell(-1);
      col.className = "status-col";
      var txt = document.createTextNode(pui["getLanguageText"]("runtimeText", "upload finished text"));
      col.appendChild(txt);
    }
    // Add a "remove" link.
    else {
      filesPending = true;

      if (this._selectionMode == this.MODE_STANDARD) {
        // Show the Remove link for each file selected in standard mode.
        // (Note: assume mode is always STANDARD for the child DND class, so it should show a remove link here.)
        col = row.insertCell(-1);
        col.className = "remove-col";

        var a = document.createElement("a");
        a.href = "javascript: void(0);";
        a.className = "remove";
        a.appendChild(document.createTextNode(pui["getLanguageText"]("runtimeText", "upload remove text")));
        a.puiFileIndex = i;
        a.isRemoveLink = true; // Let this.handleEvent know what type of click to handle.
        a.addEventListener("click", this, false);

        col.appendChild(a);
      }
    }
  }

  this._uploadLink.style.display = (context == "genie" && filesPending) ? "" : "none";
  this._progressBar.style.display = this._alwaysShowProgressBar ? "" : "none";
  this._abortLink.style.display = "none"; // render shouldn't be called while uploading, so this can hide.

  if (filesPending || this.fileList.length > 0) {
    this._clearLink.style.display = "";
    this._mainBox.classList.remove("empty"); // #6686. Services requested different styling when no files were selected.
  }
  else {
    this._clearLink.style.display = "none";
    this._mainBox.classList.add("empty");
  }
};

pui["fileupload"].FileUpload.prototype.setFileLimit = function(newLimit) {
  if (newLimit != null && !isNaN(newLimit)) {
    this._fileLimit = newLimit;
  }
};

pui["fileupload"].FileUpload.prototype.setSizeLimit = function(newLimit) {
  if (newLimit != null && !isNaN(newLimit)) {
    this._sizeLimit = newLimit;
  }
};

/**
 * Set the selection mode. If the mode changed, clear the selectors.
 * @param {String} newMode
 * @returns {undefined}
 */
pui["fileupload"].FileUpload.prototype.setMode = function(newMode) {
  var doclear = false;
  // It is necessary to clear all file selectors when the mode is changing.
  if (newMode == "enhanced") {
    if (this._selectionMode != this.MODE_ENHANCED) doclear = true;
    this._selectionMode = this.MODE_ENHANCED;
  }
  else if (newMode == "standard") {
    if (this._selectionMode != this.MODE_STANDARD) doclear = true;
    this._selectionMode = this.MODE_STANDARD;
  }
  else if (newMode == "single") {
    if (this._selectionMode != this.MODE_SINGLE) doclear = true;
    this._selectionMode = this.MODE_SINGLE;
  }

  if (this._selectFilesLink && this._selectFilesLink.input) {
    this._selectFilesLink.input.multiple = (this._selectionMode == this.MODE_ENHANCED);
  }

  if (doclear) this["clear"]();
};

pui["fileupload"].FileUpload.prototype.getTargetDirectory = function() {
  return this._targetDirectory;
};

pui["fileupload"].FileUpload.prototype.setTargetDirectory = function(value) {
  if (typeof (value) == "string") {
    this._targetDirectory = value;
    if (this._targetDirectory.length > 1 && this._targetDirectory.charAt(this._targetDirectory.length - 1) == "/") {
      this._targetDirectory = this._targetDirectory.substr(0, this._targetDirectory.length - 1);
    }
  }
};

pui["fileupload"].FileUpload.prototype.setAltName = function(value) {
  if (typeof (value) == "string") {
    this._altName = value;
  }
};

pui["fileupload"].FileUpload.prototype.setDisabled = function(state) {
  this._disabled = state;
};

pui["fileupload"].FileUpload.prototype.setOverwrite = function(value) {
  if (typeof (value) == "boolean") {
    this._overwrite = value;
  }
};

pui["fileupload"].FileUpload.prototype.setGenerateNames = function(value) {
  if (typeof (value) == "boolean") {
    this._generateNames = value;
  }
};

pui["fileupload"].FileUpload.prototype.setUploadEvent = function(value) {
  this._uploadEvent = value;
};

pui["fileupload"].FileUpload.prototype.setAllowedTypes = function(types) {
  if (Array.isArray(types)) {
    this._allowedTypes = types;
  }
};

/**
 * Return the number of files that were uploaded or selected. Needed for submitting response.
 * In Genie, needed for validation and to know if autoUpload can occur.
 * @returns {Number}
 */
pui["fileupload"].FileUpload.prototype.getCount = function() {
  var count = 0;
  for (var i = 0; i < this.fileList.length; i++) {
    if (context != "genie" || this.fileList[i].done != true) {
      count++;
    }
  }
  return count;
};

/**
 * Check if number of files selected is too high Called by pui.buildResponse (render.js) or by Genie uploadLinkClick.
 * TODO: see if this is necessary anymore now that the original uploader can warn upon picking files, preventing too many from being selected.
 * @returns {undefined|String}
 */
pui["fileupload"].FileUpload.prototype.validateCount = function() {
  if (this.getCount() > this._fileLimit) {
    return pui["getLanguageText"]("runtimeMsg", "upload file limit", [this._fileLimit]);
  }
};

/**
 * Check for duplicate file names in standard selection.
 * Called by pui.buildResponse (render.js) and the Genie uploadLinkClick.
 * TODO: see if this is necessary anymore now that the original uploader can warn upon picking files, preventing duplicates from being selected.
 * @returns {String|undefined}  Returns a string error message if a duplicate was found.
 */
pui["fileupload"].FileUpload.prototype.validateNames = function() {
  if (this._selectionMode == this.MODE_STANDARD) {
    var arr = this["getFileNames"](true);
    var used = {};
    for (var i = 0; i < arr.length; i++) {
      if (typeof (used[arr[i]]) != "undefined") {
        return pui["getLanguageText"]("runtimeMsg", "upload duplicate file");
      }

      used[arr[i]] = true;
    }
  }
};

/**
 * Send the upload XMLHTTPRequest. called by pui.processUpload() after user clicked a bound button.
 * In Genie, this is after user clicks Upload.
 * Note: this checked for Cordova in the past to use FormElements instead of iframes.
 *   Iframes were replaced, but the tests for Cordova remain to preserve previous behavior. The tests could possibly be removed.
 */
pui["fileupload"].FileUpload.prototype.upload = function() {
  if (this._disabled) return;
  var cordova = (typeof window["cordova"] != "undefined");

  if (this._submitHandle != null || (context == "genie" && pui.genie.formSubmitted)) {
    return;
  }

  // Hide these links while uploading.
  this._clearLink.style.display = "none";
  this._uploadLink.style.display = "none";

  this._submitHandle = {}; // Will be set to true value later.
  this._clearErrors();

  if (!cordova && context == "genie") {
    pui.submitLog(pui.genie.formSubmitted = true);
    pui.showWaitAnimation();
  }

  var params = {};
  params["dir"] = this._targetDirectory;
  params["overwrite"] = this._overwrite;
  params["generateNames"] = (this._generateNames ? "1" : "0");
  params["flimit"] = this._fileLimit;
  params["slimit"] = this._sizeLimit;
  params["altname"] = this._altName;
  this._addAllowedTypesParam(params);

  params["files"] = [];
  for (var i = 0; i < this.fileList.length; i++) {
    if (this.fileList[i].done != true) {
      params["files"].push(this.fileList[i]);
    }
  }

  var me = this;
  if (!cordova) {
    // Set a timer function to run if the transaction fails to complete.
    // We won't use the XHR ontimeout event because that only works for
    // asynchronous requests, and ours is synchronous.
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
    this._submitHandle = setTimeout(function() {
      me._completeTransaction(me._transactionId, {
        "success": false,
        "error": pui["getLanguageText"]("runtimeMsg", "upload timeout")
      });
    }, this._timeout);

    this._uploadLink.style.display = "none";

    params["onprogress"] = this._xhronprogress.bind(this);
    params["onabort"] = this._xhronabort.bind(this);
    params["onload"] = this._xhrFinished.bind(this);
  }

  // Always upload in Cordova. (This was the behavior before 12/17/19.)
  if (cordova) {
    this._xhr = pui.upload(params, function(success, errorMsg) {
      if (!success) {
        me._error = errorMsg;
      }
      me._submitHandle = null;
    });
  }
  // Else only call upload when files are chosen.
  else if (params["files"].length > 0) {
    this._abortLink.style.display = "";
    params["id"] = this._mainBox.id; // Ensure PUI0009109 passes the Widget ID from POST data into the PUIUPLEXIT program. #6158
    params["mode"] = "widget";
    this._xhr = pui.upload(params, function(success, errorMsg) {
      if (!success) {
        me._error = errorMsg;
        me._submitHandle = null;
        me._clearLink.style.display = "";
        me._abortLink.style.display = "none";
      }
    });
  }
  else {
    this._submitHandle = null;
  }
};

/**
 * Returns true if there is some timeout running for the upload.
 * @returns {Boolean}
 */
pui["fileupload"].FileUpload.prototype.isSubmitting = function() {
  return (this._submitHandle != null);
};

/**
 * Return the error value, which may be an empty string.
 * @returns {String}
 */
pui["fileupload"].FileUpload.prototype.getError = function() {
  return this._error;
};

/**
 * Return the ID of the main box (to go along with error information).
 * @returns {String}
 */
pui["fileupload"].FileUpload.prototype.getId = function() {
  return this._mainBox.id;
};

//
// Public API methods.
//

/**
 * Remove all files, errors, and re-renders the widget.
 */
pui["fileupload"].FileUpload.prototype["clear"] = function() {
  if (this._submitHandle == null && !this._disabled) {
    while (this.fileList.length > 0) {
      this.fileList.pop();
    }

    this._clearErrors();

    this.render();
  }
};

/**
 * Return a list of file names uploaded in RDF. In Genie, return number selected to upload.
 * @param {Boolean} validate  When true, only add those that are not done. Else add those that are.
 * @returns {Array} Returns an array of strings.
 */
pui["fileupload"].FileUpload.prototype["getFileNames"] = function(validate) {
  var names = [];
  for (var i = 0; i < this.fileList.length; i++) {
    if (context != "genie" ||
      (validate && this.fileList[i].done != true) ||
      (!validate && this.fileList[i].done)) {
      names.push(this.fileList[i].name);
    }
  }
  return names;
};

/**
 * Returns an array containing actual file names saved to server.
 * @returns {Array}
 */
pui["fileupload"].FileUpload.prototype["getActualFileNames"] = function() {
  return this._actualFileNames.slice();
};

pui["fileupload"].FileUpload.prototype["getGenerateNames"] = function() {
  return this._generateNames;
};

//
// Private methods.
//

/**
 * Handle a completed upload. Clear the timeout. Populate this.error if necessary.
 * @param {Number} id
 * @param {Object|String} response
 */
pui["fileupload"].FileUpload.prototype._completeTransaction = function(id, response) {
  // Quit if no current submit or if transaction id is not current.
  // This indicates completion of transaction that has already been aborted.
  if (this._submitHandle == null || id != this._transactionId) {
    return;
  }
  clearTimeout(this._submitHandle);

  var responseObj;
  if (typeof (response) == "string") {
    try {
      responseObj = eval("(" + response + ")");
    }
    catch (e) {
      responseObj = { "success": false, "error": pui["getLanguageText"]("runtimeMsg", "upload invalid response") };
    }
  }
  else {
    responseObj = response;
  }

  if (!responseObj["success"]) {
    if (responseObj["key"]) {
      responseObj["error"] = pui["getLanguageText"]("runtimeMsg", "upload " + responseObj["key"]);
    }
    this._error = responseObj["error"];
    if (responseObj["key"] == "file limit") {
      this._error = this._error.replace("&1", this._fileLimit);
    }
    if (responseObj["key"] == "size limit") {
      this._error = this._error.replace("&1", this._sizeLimit);
    }
  }
  // Success:
  else {
    // Mark all files as done.
    for (var i = 0; i < this.fileList.length; i++) {
      this.fileList[i].done = true;
    }
    this._actualFileNames = responseObj["fileNames"];
  }

  this._submitHandle = null;
  this._transactionId++;

  if (context == "genie") {
    pui.submitLog(pui.genie.formSubmitted = false);
    pui.hideWaitAnimation();
    // Finish here for Genie. For Rich UI, the result is checked in the main screen submit processing.
    if (responseObj["success"] == true) {
      // Handle the user-defined code from the onupload property.
      if (this._uploadEvent && this._uploadEvent.length > 0) {
        // Export the upload directory and filenames to an "info" variable that custom code can use.
        var obj = {
          "dir": this.getTargetDirectory(),
          "names": this._generateNames ? this["getActualFileNames"]() : this["getFileNames"](false)
        };
        var me = this;
        var func1 = function(obj) {
          eval("var info = arguments[0];");
          try {
            var func2 = eval(me._uploadEvent);
            if (typeof (func2) == "function") {
              func2(obj);
            }
          }
          catch (e) {
            me._uploadEventException(e);
          }
        };
        func1(obj);
      }
    }
  }
  this.render(); // Make sure hidden elements are no longer hidden if unnecessary. Show errors.

  this._xhr = null;
};

/**
 * Handle exceptions with Genie uploads. (This is a function so that child classes can handle the error differently.)
 * @param {Event} e
 */
pui["fileupload"].FileUpload.prototype._uploadEventException = function(e) {
  pui.scriptError(e, "onupload Error:\n");
};

/**
 * Remove files if any were already uploaded. Or if there was an error, remove all files.
 * Called when SelectFiles clicked or boxdrop in FileUploadDND.
 */
pui["fileupload"].FileUpload.prototype._checkAndRemoveFiles = function() {
  if (this.fileList.length > 0 && this.fileList[0] && (this.fileList[0].done || this._error.length > 0)) {
    while (this.fileList.length > 0) {
      this.fileList.pop();
    }
  }
};

/**
 * Handler for xhr.onload event; i.e. the XMLHttpRequest finished.
 * @param {Event} event   onload event.
 */
pui["fileupload"].FileUpload.prototype._xhrFinished = function(event) {
  this._progressBar.value = 100;
  var responseObj;
  try {
    try {
      // For PJS 7.4.0 and later, the response should be valid JSON and should not need special processing. PJS-818.
      responseObj = JSON.parse(event.target.responseText);
    }
    catch (ignored2) {
      var responsetxt = event.target.responseText.replace(/'/g, "\""); // Single-quoted strings throw exceptions.
      responseObj = JSON.parse(responsetxt);
    }
  }
  catch (ignored) {
    responseObj = {
      "success": false,
      "error": pui["getLanguageText"]("runtimeMsg", "upload invalid response")
    };
  }
  this._completeTransaction(this._transactionId, responseObj);
};

/**
 * Handler for xhr.onprogress event.
 * @param {Event} event
 */
pui["fileupload"].FileUpload.prototype._xhronprogress = function(event) {
  if (event.lengthComputable) {
    var complete = (event.loaded / event.total * 100 | 0);
    this._progressBar.value = complete;
    this._progressBar.style.display = "";
  }
};

/**
 * Handler for xhr.onabort event.
 */
pui["fileupload"].FileUpload.prototype._xhronabort = function() {
  this.resetProgressBar();
  var responseObj = { "success": false, "error": pui["getLanguageText"]("runtimeMsg", "upload cancelled") };
  this._completeTransaction(this._transactionId, responseObj);
};

pui["fileupload"].FileUpload.prototype.resetProgressBar = function() {
  this._progressBar.value = 0;
};

/**
 * Original uploader sends file types to PUI0009109 for validation. Child classes may not, so this function gets overridden.
 * @param {Object} params
 */
pui["fileupload"].FileUpload.prototype._addAllowedTypesParam = function(params) {
  params["allowedTypes"] = this._allowedTypes;
};

/**
 * Show a validation tip next to the upload widget. (FileUploadDND calls this directly.)
 * E.g. error tip happens with too many files, when drag/drop and autoSubmit true, when cancelling uploads.
 * @param {String} message
 */
pui["fileupload"].FileUpload.prototype._showMessage = function(message) {
  if (this._mainBox.validationTip != null) this._mainBox.validationTip.hide(); // Hide with animation--takes tithis.
  this._mainBox.validationTip = new pui.ValidationTip(this._mainBox); // New element can appear without waiting.
  this._mainBox.validationTip.setMessage(message);
  this._mainBox.validationTip.show();
};

/**
 * Hide error tip, reset progress bar, clear internal "error".
 */
pui["fileupload"].FileUpload.prototype._clearErrors = function() {
  this._error = "";
  this.resetProgressBar();

  if (this._mainBox.validationTip != null && typeof this._mainBox.validationTip.hide == "function") {
    this._mainBox.validationTip.hide();
  }
};

pui["fileupload"].FileUpload.prototype._initFileInputElement = function() {
  if (this._selectFilesLink.input != null) {
    // IE10 does not allow the input's value to change via JS, so the old input must be replaced upon the user clicking clear or remove.
    this._selectFilesLink.input.removeEventListener("change", this, false);
    this._selectFilesLink.removeChild(this._selectFilesLink.input);
  }

  var input = document.createElement("input");
  input.name = "file";
  input.type = "file";
  input.className = "control";
  input.style.display = "none"; // Avoid odd Firefox problem where input overlaps link and cursor isn't a pointer.
  // See Redmine #6441 - Retain "multiple" attribute when replacing input element.
  if (this._selectFilesLink.input != null) {
    input.multiple = this._selectFilesLink.input.multiple;
  }

  input.addEventListener("change", this, false);

  this._selectFilesLink.input = input;
  this._selectFilesLink.appendChild(input);
};

pui["fileupload"].FileUpload.prototype._createBoxes = function() {
  this._controlBox = document.createElement("div");
  this._controlBox.className = "control-box";

  this._createSelectFilesLink(this._controlBox, pui["getLanguageText"]("runtimeText", "upload select text"));

  this._setupControlBox();
  this._createListBox();
};

/**
 * Create a "Select Files" link and add it to the parent element.
 * @param {Element} parent
 * @param {String} linkText
 */
pui["fileupload"].FileUpload.prototype._createSelectFilesLink = function(parent, linkText) {
  this._selectFilesLink = document.createElement("a");
  this._selectFilesLink.className = "control-proxy";
  this._selectFilesLink.appendChild(document.createTextNode(linkText));

  this._selectFilesLink.addEventListener("click", this, false);
  this._initFileInputElement();
  parent.appendChild(this._selectFilesLink);
};

/**
 * Create a container for Select Files link, clear link, upload link, progress bar, and abort link.
 */
pui["fileupload"].FileUpload.prototype._setupControlBox = function() {
  this._clearLink = document.createElement("a");
  this._clearLink.href = "javascript: void(0);";
  this._clearLink.appendChild(document.createTextNode(pui["getLanguageText"]("runtimeText", "upload clear text")));
  this._clearLink.className = this._clearLinkClass;
  this._clearLink.addEventListener("click", this, false);
  this._clearLink.style.display = "none";
  this._controlBox.appendChild(this._clearLink);

  // Only used in Genie.
  this._uploadLink = document.createElement("a");
  this._uploadLink.href = "javascript: void(0);";
  this._uploadLink.appendChild(document.createTextNode(pui["getLanguageText"]("runtimeText", "upload upload text")));
  this._uploadLink.className = this._uploadLinkClass;
  this._uploadLink.addEventListener("click", this, false);
  this._controlBox.appendChild(this._uploadLink);

  this._progressBar = document.createElement("progress");
  this._progressBar.id = "progbar_" + this._mainBox.id;
  this._progressBar.max = 100;
  this._progressBar.value = 0;
  this._progressBar.style.display = (this._alwaysShowProgressBar ? "" : "none");
  this._controlBox.appendChild(this._progressBar);

  this._abortLink = document.createElement("a");
  this._abortLink.className = "abort-upload";
  this._abortLink.innerHTML = "[x]";
  this._abortLink.style.display = "none";
  this._abortLink.addEventListener("click", this);
  this._controlBox.appendChild(this._abortLink);

  this._mainBox.appendChild(this._controlBox);
};

pui["fileupload"].FileUpload.prototype._createListBox = function() {
  this._listBox = document.createElement("div");
  this._listBox.className = "list-box";

  this._table = document.createElement("table");
  this._table.className = "list";
  this._listBox.appendChild(this._table);

  this._mainBox.appendChild(this._listBox);
};

/**
 * Handle any events to which an instance of FileUpload was added as a listener.
 * @param {Event} e
 * @returns {undefined|Boolean}
 */
pui["fileupload"].FileUpload.prototype["handleEvent"] = function(e) {
  if (e.type == "click") {
    switch (e.target) {
      case this._selectFilesLink: // "Select Files" was clicked.
        if (this._submitHandle != null || this._disabled || inDesignMode()) {
          // If the file upload is disabled, in design mode, or ??, then do not respond to clicks on "Select Files".
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        this._selectFilesLink.input.click(); // If the input is hidden, then regular clicks won't reach it. Force clicks to reach it.
        return;

      case this._clearLink: // "Clear" was clicked.
        this["clear"]();
        e.preventDefault();
        e.stopPropagation();
        return false;

      case this._abortLink: // The "[x]" abort link in the control box was clicked.
        e.preventDefault();
        e.stopPropagation();
        if (this._xhr && this._xhr.abort) {
          this._xhr.abort();
        }
        return false;

      case this._uploadLink: // Handle click on the uploadLink, Genie only.
        if (this._submitHandle == null && !inDesignMode() && !pui.genie.formSubmitted) {
          // Let user attempt to upload again in case there was an error.
          // e.g. attempt to drop in file when there already was a file ready to upload.
          this._clearErrors();

          // Genie must validate here. In Rich UI validation is done as part of the main screen submit process.
          // DragDrop already does validation upon dropping. Assumes uploadLink cannot be clicked unless files are chosen.
          if (this._validateBeforeUpload) {
            // Count the files that were not already uploaded (those which did not have "Finished" indicated, if any).
            var err = this.validateCount();
            if (!err) {
              err = this.validateNames();
            }
            if (err) {
              this._showMessage(err);
              return false;
            }
          }

          this.upload();
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    if (e.target.isRemoveLink) {
      // Handle a click on a "remove" link; remove a file from the selectors list and re-render.
      e.preventDefault();
      e.stopPropagation();

      // Ignore clicks while upload is in progress.
      if (this._submitHandle !== null) return false;

      var target = e.target || e.srcElement;
      // Remove specified file.
      var index = target.puiFileIndex;
      this.fileList.splice(index, 1);

      this._clearErrors();
      this.render();

      return false;
    }
  }
  else if (e.type == "change") {
    var files = e.target.files;

    if (this._selectionMode != this.MODE_STANDARD) {
      // For single selection or extended, existing choices get replaced with new choices.
      this.fileList = [];
    }

    this._initFileInputElement(); // Ensure that onchange always fires after choosing another file. #5876.

    this._checkAndRemoveFiles();

    // This original uploader now prevents files from being added that are too large, the wrong content-type, etc. So, clear error on change.
    this._clearErrors();

    this._processFileList(files);
  }
};

/**
 * Make sure the chosen files have the correct content-types, are not duplicates, and are not too large.
 * Display the chosen files that are valid; show a tip when files were not acceptable. (Used in the change listener and in child classes.)
 * @param {FileList} list
 */
pui["fileupload"].FileUpload.prototype._processFileList = function(list) {
  var i;
  // We are the last file. This should only run after all the files attempted to open. Process the list of dropped files. Once
  // here, we know if dropped objects were directories or readable files.
  var notice; var pushlist = [];
  var hadError = false;

  // Look at each dropped file.
  for (i = 0; i < list.length && !hadError; i++) {
    var exists = false;
    // See if the filename already exists in the upload list.
    for (var j = 0; j < this.fileList.length; j++) {
      if (this.fileList[j].name === list[i].name) {
        exists = true;
        break;
      }
    }

    // If there is nothing in allowedTypes[], allow the file.
    // If the file's type was in allowedTypes[], allow it.
    var ftypeTmp = list[i].type;
    var allowedT = (this._allowedTypes.length <= 0 || this._allowedTypes.indexOf(ftypeTmp) >= 0);

    // 6839: FIX MIME type:
    //  Historically, we allowed "image/jpg" for a jpeg even though the standard
    //  (and value provided by browsers) is "image/jpeg" so this is needed for
    //  backward compatibility.
    if (!allowedT && ftypeTmp.toLowerCase() === "image/jpg" && this._allowedTypes.indexOf("image/jpeg") >= 0) allowedT = true;
    if (!allowedT && ftypeTmp.toLowerCase() === "image/jpeg" && this._allowedTypes.indexOf("image/jpg") >= 0) allowedT = true;

    // PUI 701: File Upload Allowed Type Bound Field
    // double check when the allowedtypes is populated from a bound field, if it does, trim the types before checking.
    // This is needed for Genie or dspf, where the allowed types are set by a bound field.
    // if genie, check for trimmed allowed types.
    if ((context == "dspf" || context == "genie") && this._allowedTypes.length > 0 && !allowedT) {
      // clone the _allowedTypes array so we can trim it.
      // trim the allowed types array to remove any that are not in the list.
      allowedTClone = this._allowedTypes.map(function(type) {
        return type.toLowerCase().trim();
      });
      allowedT = (this._allowedTypes.length <= 0 || allowedTClone.indexOf(ftypeTmp) >= 0);
      // check if the file type is in the trimmed allowed types.
      // backward compatibility for image types. jpg and jpeg.
      if (!allowedT && ftypeTmp.toLowerCase() === "image/jpeg" && allowedTClone.indexOf("image/jpg") >= 0) allowedT = true;
      if (!allowedT && ftypeTmp.toLowerCase() === "image/jpg" && allowedTClone.indexOf("image/jpeg") >= 0) allowedT = true;
      if (!allowedT && ftypeTmp.toLowerCase() === "image/png" && allowedTClone.indexOf(ftypeTmp) >= 0) allowedT = true;
    }
    // Only add the file to our list if it passes our parameter checks.

    // Don't add if the MIME type is not accepted, or if the
    // file was a directory. Browsers prevent JS from selecting
    // files not explicitly chosen by the user, so we can't read
    // everything in a directory. Ignore them for now.
    if (!allowedT || list[i].isReadable === false) {
      hadError = true;
      notice = pui["getLanguageText"]("runtimeMsg", "upload invalid type");
      console.log('Content-Type "%s" not permitted for upload.', ftypeTmp); // This is helpful.
    }
    // Don't add if the same filename is already in the list.
    else if (exists) {
      hadError = true;
      notice = pui["getLanguageText"]("runtimeMsg", "upload duplicate file");
    }
    // Don't add if file is larger than limit.
    else if (list[i].size > this._sizeLimit * 1048576) {
      hadError = true;
      notice = pui["getLanguageText"]("runtimeMsg", "upload size limit", [this._sizeLimit]);
    }
    // Otherwise, add the file to our list.
    else {
      pushlist.push(list[i]);
    }
  }
  // done looking at each dropped file.

  // Only add files if none of them had errors.
  if (!hadError) {
    for (i = 0; i < pushlist.length; i++) {
      this.fileList.push(pushlist[i]);
    }
  }
  pushlist = null;

  // Redraw table to show chosen files and the correct links.
  this.render();
  if (notice) this._showMessage(notice);
};

//
// Global utility functions.
//

/**
 * Called by pui.respond to start uploading and to know when something is uploading.
 * @param {Object} param    Response object that gets passed on
 * @returns {Boolean}
 */
pui.processUpload = function(param) {
  if (pui.fileUploadElements.length > 0) {
    for (var i = 0; i < pui.fileUploadElements.length; i++) {
      pui.fileUploadElements[i].upload();
    }

    pui.checkUploads(param);

    return true;
  }
  else {
    return false;
  }
};

/**
 * If necessary, cycle until uploads are complete, then submit or cancel a response.
 * @param {Object} param    Response object from pui.respond.
 */
pui.checkUploads = function(param) {
  var interval = 250;
  var i;

  var done = true;
  for (i = 0; i < pui.fileUploadElements.length; i++) {
    if (pui.fileUploadElements[i].isSubmitting()) {
      done = false;
      break;
    }
  }

  if (done) {
    var errors = {};
    var good = true;
    for (i = 0; i < pui.fileUploadElements.length; i++) {
      var error = pui.fileUploadElements[i].getError();
      if (error != "") {
        good = false;
        errors[pui.fileUploadElements[i].getId()] = error;
      }
    }

    if (good) {
      for (i = 0; i < pui.fileUploadElements.length; i++) {
        var fileUpload = pui.fileUploadElements[i];
        var qualField = fileUpload.qualField;

        // Build response.

        // Response looks like this:

        // Header:

        // Number of files (3S, 0)
        // Directory (256A)

        // Detail (1 for each file):

        // Name (256A)

        var fileCount = fileUpload.getCount();
        if (fileCount > 99) {
          fileCount = 99;
        }
        fileCount = String(fileCount);
        while (fileCount.length < 3) {
          fileCount = "0" + fileCount;
        }

        var targetDirectory = fileUpload.getTargetDirectory();
        if (targetDirectory.length > 256) {
          targetDirectory = targetDirectory.substr(0, 256);
        }
        else {
          while (targetDirectory.length < 256) {
            targetDirectory += " ";
          }
        }

        var namesArray = (fileUpload["getGenerateNames"]()) ? fileUpload["getActualFileNames"]() : fileUpload["getFileNames"](false);
        var names = "";
        for (var j = 0; j < namesArray.length; j++) {
          var name = namesArray[j];
          if (name.length > 256) {
            name = name.substr(0, 256);
          }
          else {
            while (name.length < 256) {
              name += " ";
            }
          }

          names += name;
        }

        param[qualField] = fileCount + targetDirectory + names;
      }

      pui["haltFrames"]();
      pui.submitResponse(param);
    }
    else {
      pui.cancelResponse(errors);
    }
  }
  else {
    setTimeout(function() {
      pui.checkUploads(param);
    }, interval);
  }
};

// Property setters. Some are re-used in child classes.

pui["fileupload"].propset = {
  "field type": function(parms) {
    if (parms.dom["fileUpload"] == null) {
      parms.dom["fileUpload"] = new pui["fileupload"].FileUpload(parms.dom);
      if (context == "dspf") pui.fileUploadElements.push(parms.dom["fileUpload"]);
    }
    // Process multiple occurrence property.
    var suffix = 1;
    var prop = "allowed type";
    var types = [];
    while (typeof (parms.properties[prop]) == "string") {
      var mimeType = parms.evalProperty(prop);
      if (types.length === 0 || types.indexOf(mimeType) === -1) types.push(mimeType);
      // 6839: FIX MIME type:  Historically, PUI supported image/jpg (which is not a valid MIME type)
      //   instead of the correct image/jpeg.  For backward compatibility, if one is specified,
      //   allow both.
      if (mimeType.toLowerCase() === "image/jpg" && types.indexOf("image/jpeg") === -1) types.push("image/jpeg");
      if (mimeType.toLowerCase() === "image/jpeg" && types.indexOf("image/jpg") === -1) types.push("image/jpg");

      prop = "allowed type " + (++suffix);
    }
    parms.dom["fileUpload"].setAllowedTypes(types);

    parms.dom["fileUpload"].render();
  },

  "selection mode": function(parms) {
    parms.dom["fileUpload"].setMode(parms.value);
  },

  "number of files": function(parms) {
    if (parms.design) return;

    parms.dom["fileUpload"].setFileLimit(parseInt(parms.value, 10));
  },

  "size limit": function(parms) {
    if (parms.design) return;

    parms.dom["fileUpload"].setSizeLimit(parseInt(parms.value, 10));
  },

  "target directory": function(parms) {
    if (parms.design) return;

    parms.dom["fileUpload"].setTargetDirectory(trim(parms.value));
  },

  "rename to": function(parms) {
    if (parms.design) return;

    parms.dom["fileUpload"].setAltName(trim(parms.value));
  },

  "overwrite files": function(parms) {
    if (parms.design) return;

    parms.dom["fileUpload"].setOverwrite(parms.value == "true" || parms.value == true);
  },

  "generate unique names": function(parms) {
    if (parms.design) return;

    parms.dom["fileUpload"].setGenerateNames(parms.value == "true" || parms.value == true);
  },

  "onupload": function(parms) {
    if (parms.design) return;

    parms.dom["fileUpload"].setUploadEvent(parms.newValue);
  },

  "disabled": function(parms) {
    if (parms.design) return;

    var disabled = (parms.value == "true");
    parms.dom["fileUpload"].setDisabled(disabled);
  }
};

/**
 * Make sure the "empty" css class gets set after render calls the "css class" property setter, which clears any existing css classes.
 * TODO: it would be better for properties to not change the DOM repeatedly; let one final render() call setup the DOM.
 * @param {Object} parms
 */
pui["fileupload"].globalAfterSetter = function(parms) {
  var match = /^css class( \d+)?$/.exec(parms.propertyName);
  if (match != null) parms.dom["fileUpload"].render();
};

pui.widgets.add({

  name: "file upload",
  newId: "FileUpload",
  menuName: "File Upload",
  defaults: {
    width: "400px",
    height: "150px",
    "css class": "pui-file-upload",
    "selection mode": "standard",
    "size limit": "10",
    "number of files": "1",
    "overwrite files": "false"
  },

  propertySetters: pui["fileupload"].propset,

  globalAfterSetter: pui["fileupload"].globalAfterSetter

});
