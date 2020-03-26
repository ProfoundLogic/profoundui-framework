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
 * @param {Object} container
 * @param {Null|Object} extras    Extra parameters needed by child constructors.
 * @constructor
 */
pui["fileupload"].FileUpload = function(container, extras) {

  // Private fields.
  var me = this;
  var mainBox = container;
  
  if (extras == null){
    extras = {
      alwaysShowProgressBar: false,
      selectFilesLink: true,
      clearLinkClass: "clear",
      uploadLinkClass: "upload",
      validateBeforeUpload: true    //Avoid duplicate names, too many files
    };
  }
  
  var controlBox;
  var listBox;
  var table;
  var clearLink;
  var uploadLink;     //Used only in Genie.
  var progressBar;
  var abortLink = null; // visible when upload starts. hidden when stopped.
  var selector;   //The Select Files link containing the input element.
  
  var transactionId = 1;  // This is used to avoid submitting twice? Or to prevent browser caching responses.
  var submitHandle = null;
  var timeout = 86400000;
  var error = "";   // This holds error from the last upload attempt. If non-empty, assume selectors haven't been marked "done".
  var disabled = false;
  
  var xhr = null;  // XMLHttpRequest. Referenced here to allow aborting.
  
  var MODE_STANDARD = 0;
  var MODE_ENHANCED = 1;
  var MODE_SINGLE = 2;
  
  var selectionMode = MODE_STANDARD;
  
  var fileLimit = 1;
  var sizeLimit = 10;
  var targetDirectory = "";
  var altName = "";
  var overwrite = false;
  var generateNames = false;
  var allowedTypes = [];
  var uploadEvent; 
  var actualFileNames = [];
  
  // An array of File objects added to after the browser lets the user drop or choose a file.
  this.fileList = [];
  
  // Constructor.
  if (typeof extras.preConstruct == 'function') extras.preConstruct();
  createControlBox();
  createListBox();
  
  // Public methods. 
  
  /**
   * Render the widget's internal elements to reflect their states.
   * render is called in onchange/change events, this.clear, and when "field type" property is set.
   */
  this.render = function() {
    
    if (table.tBodies.length > 0) {
      table.removeChild(table.tBodies[0]);
    }
    var tBody = table.appendChild(document.createElement("tbody"));

    if (error.length > 0) me.showError(error);
    else me.clearErrors();

    var filesPending = false;
    for (var i = 0; i < me.fileList.length; i++) {
      var name = me.fileList[i].name + (" (" + pui.formatBytes(me.fileList[i].size, 2) + ")");
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
      if( me.fileList[i].done ) {
        col = row.insertCell(-1);
        col.className = "remove-col";
        
        col = row.insertCell(-1);
        col.className = "status-col";
        var txt = document.createTextNode(pui["getLanguageText"]("runtimeText","upload finished text"));
        col.appendChild(txt);
      }
      // Add a "remove" link.
      else {
        filesPending = true;
        
        if (selectionMode == MODE_STANDARD) {
          // Show the Remove link for each file selected in standard mode.
          // (Note: assume mode is always STANDARD for the child DND class, so it should show a remove link here.)
          col = row.insertCell(-1);
          col.className = "remove-col";

          var a = document.createElement("a");
          a.href = "javascript: void(0);";
          a.className = "remove";
          a.appendChild(document.createTextNode(pui["getLanguageText"]("runtimeText", "upload remove text")));
          a.puiFileIndex = i;
          a.addEventListener("click", removeFile, false);

          col.appendChild(a);
        }
      }
    }
    
    uploadLink.style.display = (context == "genie" && filesPending) ? "": "none";
    clearLink.style.display = (filesPending || me.fileList.length > 0) ? "" : "none";
    progressBar.style.display = extras.alwaysShowProgressBar ? "" : "none";
    abortLink.style.display = "none";   //render shouldn't be called while uploading, so this can hide.
  };
  
  this.setFileLimit = function(newLimit) {
    if (newLimit != null && !isNaN(newLimit)) {
      fileLimit = newLimit;
    }
  };
  
  this.getFileLimit = function(){
    return fileLimit;
  };
  
  this.setSizeLimit = function(newLimit) {
    if (newLimit != null && !isNaN(newLimit)) {
      sizeLimit = newLimit;
    }
  };
  
  this.getSizeLimit = function(){
    return sizeLimit;
  };
  
  /**
   * Set the selection mode. If the mode changed, clear the selectors.
   * @param {String} newMode
   * @returns {undefined}
   */
  this.setMode = function(newMode) {
  
    var doclear = false;
    // It is necessary to clear all file selectors when the mode is changing.
    if (newMode == "enhanced"){
      if (selectionMode != MODE_ENHANCED) doclear = true;
      selectionMode = MODE_ENHANCED;
    }
    else if(newMode == "standard"){
      if (selectionMode != MODE_STANDARD) doclear = true;
      selectionMode = MODE_STANDARD;
    }
    else if(newMode == "single"){
      if (selectionMode != MODE_SINGLE) doclear = true;
      selectionMode = MODE_SINGLE;
    }
    
    if (selector && selector.input){
      selector.input.multiple = (selectionMode == MODE_ENHANCED);
    }
    
    if (doclear) this["clear"]();
  };
  
  this.getTargetDirectory = function() {
  
    return targetDirectory;
  
  };
  
  /**
   * Return a list of file names uploaded in RDF. In Genie, return number selected to upload.
   * @param {Boolean} validate  When true, only add those that are not done. Else add those that are.
   * @returns {Array} Returns an array of strings.
   */
  this["getFileNames"] = function(validate) {
    var names = [];
    for (var i=0; i < me.fileList.length; i++) {
      if (context != "genie" 
        || ( validate && me.fileList[i].done != true )
        || (!validate && me.fileList[i].done)){
        names.push(me.fileList[i].name);
      }
    }
    return names;
  };
  
  /**
   * Returns an array containing actual file names saved to server.
   * @returns {Array}
   */
  this["getActualFileNames"] = function() {
    
    return actualFileNames.slice();
    
  };
  
  this["getGenerateNames"] = function() {

    return generateNames;

  };

  this.setTargetDirectory = function(value) {
  
    if (typeof(value) == "string") {
    
      targetDirectory = value;
      if (targetDirectory.length > 1 && targetDirectory.charAt(targetDirectory.length - 1) == "/") {
      
        targetDirectory = targetDirectory.substr(0, targetDirectory.length - 1);
      
      }
    
    }
  
  };
  
  this.setAltName = function(value) {
  
    if (typeof(value) == "string") {
    
      altName = value;
    
    }
  
  };
  
  this.setDisabled = function(state) {
    disabled = state;
  };
  
  this.isDisabled = function(){
    return disabled;
  };
  
  this.setOverwrite = function(value) {
  
    if (typeof(value) == "boolean") {
    
      overwrite = value;
    
    }    
  
  };
  
  this.setGenerateNames = function(value) {
  
    if (typeof(value) == "boolean") {
    
      generateNames = value;
    
    }    
  
  };
  
  this.setUploadEvent = function(value) {

    uploadEvent = value; 
  
  };
  
  this.setAllowedTypes = function(types) {
  
    if (types && types.constructor && types.constructor.toString().indexOf("function Array") != -1) {
    
      allowedTypes = types;
    
    }
  
  };
  
  this.getAllowedTypes = function(){
    return allowedTypes;
  };
  
  /**
   * Return the number of files that were uploaded or selected. Needed for submitting response.
   * In Genie, needed for validation and to know if autoUpload can occur.
   * @returns {Number}
   */
  this.getCount = function() {
    var count = 0;
    for (var i = 0; i < me.fileList.length; i++) {
      if (context != "genie" || me.fileList[i].done != true)
        count++;
    }
    return count;
  };
  
  /**
   * Check if number of files selected is too high Called by pui.buildResponse or by Genie uploadLinkClick.
   * @returns {undefined|String}
   */
  this.validateCount = function() {
  
    if (me.getCount() > fileLimit) {
    
      return pui["getLanguageText"]("runtimeMsg", "upload file limit", [ fileLimit ]);
    
    } 
  
  };
  
  /**
   * Check for duplicate file names in standard selection.
   * Called by pui.buildResponse and the Genie uploadLinkClick.
   * @returns {String|undefined}  Returns a string error message if a duplicate was found.
   */
  this.validateNames = function() {
  
    if (selectionMode == MODE_STANDARD) {
    
      var arr = me["getFileNames"](true);
      var used = {};
      for (var i = 0; i < arr.length; i++) {
      
        if (typeof(used[arr[i]]) != "undefined") {
        
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
  this.upload = function() {
    if (disabled) return;
    var cordova = (typeof window["cordova"] != "undefined");
    
    if (submitHandle != null || (context == "genie" && pui.genie.formSubmitted)) {  
      return;
    }
    
    // Hide these links while uploading.
    clearLink.style.display = "none";
    uploadLink.style.display = "none";
    
    submitHandle = {}; // Will be set to true value later.
    me.clearErrors();
    
    if (!cordova && context == "genie") {
      pui.submitLog(pui.genie.formSubmitted = true); 
      pui.showWaitAnimation();
    }

    var params = {};
    params["dir"] = targetDirectory;
    params["overwrite"] = overwrite;
    params["generateNames"] = (generateNames ? "1" : "0");
    params["flimit"] = fileLimit;
    params["slimit"] = sizeLimit;
    params["altname"] = altName;
    me.addAllowedTypesParam(params);
    params["files"] = [];
    for (var i = 0; i < me.fileList.length; i++) {
      if (me.fileList[i].done != true)
        params["files"].push(me.fileList[i]);
    }
    
    if (!cordova) {
      // Set a timer function to run if the transaction fails to complete.
      // We won't use the XHR ontimeout event because that only works for
      // asynchronous requests, and ours is synchronous.
      // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
      submitHandle = setTimeout(function(){
        completeTransaction(transactionId, {
          "success": false,
          "error": pui["getLanguageText"]("runtimeMsg", "upload timeout")
        });
      }, timeout);

      uploadLink.style.display = "none";
      
      params["onprogress"] = xhronprogress;
      params["onabort"] = xhronabort;
      params["onload"] = xhrFinished;
    }
    
    // Always upload in Cordova. (This was the behavior before 12/17/19.)
    if (cordova){
      xhr = pui.upload(params, function(success, errorMsg) {
        if (!success) {
          error = errorMsg;
        }
        submitHandle = null;
      });
    }
    // Else only call upload when files are chosen.
    else if (params["files"].length > 0){
      abortLink.style.display = "";
      xhr = pui.upload(params);
    }
    else {
      submitHandle = null;
    }
  };
    
  /**
   * Handle a completed upload. Clear the timeout. Populate this.error if necessary.
   * @param {Number} id
   * @param {Object|String} response
   */
  function completeTransaction(id, response) {
    // Quit if no current submit or if transaction id is not current.
    // This indicates completion of transaction that has already been aborted. 
    if (submitHandle == null || id != transactionId) {
      return;
    }
    clearTimeout(submitHandle);
    
    var responseObj;
    if (typeof(response) == "string") {
      try {
        responseObj = eval("(" + response + ")");
      }
      catch(e) {
        responseObj = {"success":false,"error": pui["getLanguageText"]("runtimeMsg", "upload invalid response")}; 
      }
    }
    else {
      responseObj = response;
    }
    
    if (!responseObj["success"]) {
      if (responseObj["key"]) {
        responseObj["error"] = pui["getLanguageText"]("runtimeMsg", "upload " + responseObj["key"] );
      }
      error = responseObj["error"];
      if (responseObj["key"] == "file limit")
        error = error.replace("&1", fileLimit);
      if (responseObj["key"] == "size limit")
        error = error.replace("&1", sizeLimit);
    }
    // Success:
    else {
      // Mark all files as done.
      for (var i=0; i < me.fileList.length; i++) {
        me.fileList[i].done = true;
      }
      actualFileNames = responseObj["fileNames"];
    }
    
    submitHandle = null;
    transactionId++;
    
    if (context == "genie") {
      pui.submitLog(pui.genie.formSubmitted = false);
      pui.hideWaitAnimation();
      // Finish here for Genie. 
      // For Rich UI, the result is checked in the 
      // main screen submit processing.
      if (responseObj["success"] == true) {
        doUploadEvent();
      }
    }
    me.render();  //Make sure hidden elements are no longer hidden if unnecessary. Show errors.
  
    xhr = null;
  };
  
  // Overridden in child classes.
  this.isSubmitting = function() {
  
    return (submitHandle != null);
  
  };
  
  this.getError = function() {
    return error;
  };
  
  this.getId = function() {
  
    return mainBox.id;
  
  };
  
  /**
   * Handle the user-defined code from the onupload property. Genie only.
   */
  function doUploadEvent() {
    if (uploadEvent && uploadEvent.length > 0) {
      var obj = {};
      obj["dir"] = me.getTargetDirectory();
      obj["names"] = (generateNames) ? me["getActualFileNames"]() : me["getFileNames"](false);
      
      var func = function() {
        eval("var info = arguments[0];");
        try {
          var func2 = eval(uploadEvent);
          if (typeof(func2) == "function") {
            func2(arguments[0]);
          }
        }
        catch (e) {
          me.uploadEventException(e);
        }
      };
    
      func(obj);
    }
  };
  
  this.uploadEventException = function(e){
    pui.scriptError(e, "onupload Error:\n");
  };
  
  /**
   * Handler for the "[x]" abort link in the control box.
   * @param {Event} e
   * @returns {Boolean}
   */
  function abortUpload(e) {
    if(e.preventDefault) e.preventDefault();
    if(e.stopPropagation) e.stopPropagation();
    e.cancelBubble = true;
    e.returnValue = false;
    if( xhr && xhr.abort ) {
      xhr.abort();
    }
    return false;
  }
  
  // API methods.
  
  /**
   * Remove all files, errors, and re-renders the widget.
   */
  this["clear"] = function() {
    if (submitHandle == null && !disabled) {
      while(me.fileList.length > 0) {
        me.fileList.pop();
      }
      
      me.clearErrors();

      me.render();
    }
  };
  
  // Private methods.
  
  /**
   * Create a container for Select Files link, clear link, upload link, progress bar, and abort link.
   */
  function createControlBox() {
    controlBox = document.createElement("div");
    controlBox.className = "control-box";
    
    // Add a "Select Files" link with an input element unless the child class does not want it.
    if (extras.selectFilesLink) createSelectFilesLink();

    clearLink = document.createElement("a");
    clearLink.href = "javascript: void(0);";
    clearLink.appendChild(document.createTextNode(pui["getLanguageText"]("runtimeText", "upload clear text")));
    clearLink.className = extras.clearLinkClass;
    clearLink.addEventListener("click", clearFiles, false);
    clearLink.style.display = "none";
    controlBox.appendChild(clearLink);
    
    // Only used in Genie.
    uploadLink = document.createElement("a");
    uploadLink.href = "javascript: void(0);";
    uploadLink.appendChild(document.createTextNode(pui["getLanguageText"]("runtimeText", "upload upload text")));
    uploadLink.className = extras.uploadLinkClass;
    uploadLink.addEventListener("click", uploadLinkClick, false);
    controlBox.appendChild(uploadLink);
    
    progressBar = document.createElement("progress");
    progressBar.id = "progbar_" + mainBox.id;
    progressBar.max = 100;
    progressBar.value = 0;
    progressBar.style.display = (extras.alwaysShowProgressBar ? "" : "none");
    controlBox.appendChild(progressBar);
    
    abortLink = document.createElement("a");
    abortLink.className = "abort-upload";
    abortLink.innerHTML = "[x]";
    abortLink.style.display = "none";
    abortLink.addEventListener("click", abortUpload);
    controlBox.appendChild(abortLink);
    
    mainBox.appendChild(controlBox);
  }

  function createSelectFilesLink() {
    
    selector = document.createElement("a");
    selector.className = "control-proxy";
    selector.appendChild(document.createTextNode(pui["getLanguageText"]("runtimeText", "upload select text")));
    
    selector.addEventListener("click", checkSelect, false);
    initFileInputElement();
    controlBox.appendChild(selector);
  }
  
  function initFileInputElement(){
    if (selector.input != null){
      // IE10 does not allow the input's value to change via JS, so the old input must be replaced upon the user clicking clear or remove.
      selector.input.removeEventListener("change", fileOnChange, false);
      selector.removeChild(selector.input);
    }
    
    var input = document.createElement("input");
    input.name = "file";
    input.type = "file";
    input.className = "control";
    input.style.display = "none";   //Avoid odd Firefox problem where input overlaps link and cursor isn't a pointer.
    
    input.addEventListener("change", fileOnChange, false);
    
    selector.input = input;
    selector.appendChild(input);
  }
  
  function fileOnChange(e){
    var files = e.target.files;
    if (selectionMode != MODE_STANDARD) {
      // For single selection or extended, existing choices get replaced with new choices.
      me.fileList = [];
    }
    
    initFileInputElement(); // Ensure that onchange always fires after choosing another file. #5876.
    
    me.checkAndRemoveFiles();
    
    for(var i=0; i < files.length; i++){
      me.fileList.push(files[i]);
    }
    me.render();
  }
  
  /**
   * Remove files if any were already uploaded. Or if there was an error, remove all files.
   * Called when SelectFiles clicked or boxdrop in FileUploadDND.
   */
  this.checkAndRemoveFiles = function(){
    if( me.fileList.length > 0 && me.fileList[0] && (me.fileList[0].done || me.getError().length > 0 )) {
      while (me.fileList.length > 0) {
        me.fileList.pop();
      }
    }
  };
  
  function createListBox() {
    
    listBox = document.createElement("div");
    listBox.className = "list-box";
    
    table = document.createElement("table");
    table.className = "list";
    listBox.appendChild(table);
    
    mainBox.appendChild(listBox);
  }
  
  /**
   * Handler for xhr.onload event; i.e. the XMLHttpRequest finished.
   * @param {Event} event   onload event.
   */
  function xhrFinished(event) {
    progressBar.value = 100;
    var responseObj;
    try {
      var responsetxt = event.target.responseText.replace(/'/g, "\""); // Single-quoted strings throw exceptions.
      responseObj = JSON.parse(responsetxt);
    }
    catch(ignored){
      responseObj = {
        "success": false,
        "error": pui["getLanguageText"]("runtimeMsg", "upload invalid response")
      };
    }
    completeTransaction(transactionId, responseObj);
  }
   
  /**
   * Handler for xhr.onprogress event.
   * @param {type} event
   */
  function xhronprogress(event) {
    if (event.lengthComputable) {
      var complete = (event.loaded / event.total * 100 | 0);
      progressBar.value = complete;
      progressBar.style.display = "";
    }
  }
  
  /**
   * Handler for xhr.onabort event.
   */
  function xhronabort() {
    me.resetProgressBar();
    var responseObj = {"success": false, "error": pui["getLanguageText"]("runtimeMsg", "upload cancelled")};
    completeTransaction(transactionId, responseObj);
  }
  
  function checkSelect(e) {
  
    e = e || window.event;
    
    if (submitHandle != null) {
    
      e.cancelBubble = true;
      e.returnValue = false;
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      return false;      
    
    }
    selector.input.click(); //If the input is hidden, then regular clicks won't reach it. Force clicks to reach it.
  }
  
  /**
   * Handler for a "remove" link onclick event.
   * Remove a file from the selectors list and re-render.
   * @param {type} e
   * @returns {Boolean}
   */
  function removeFile(e) {
    e = e || window.event;
    e.cancelBubble = true;
    e.returnValue = false;
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    
    // Ignore clicks while upload is in progress.
    if (submitHandle !== null) {
      return false;
    }
    
    var target = e.target || e.srcElement;
    // Remove specified file.
    var index = target.puiFileIndex;
    me.fileList.splice(index, 1);
    
    me.clearErrors();
    me.render();
    
    return false;
  }
  
  function clearFiles(e){
    e = e || window.event;
    me["clear"]();
    e.cancelBubble = true;
    e.returnValue = false;
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    return false;
  }
  
  // Handle click on the uploadLink, Genie only.
  function uploadLinkClick(e) {
    e = e || window.event;
    if (submitHandle == null && !inDesignMode() && !pui.genie.formSubmitted) {
      // Let user attempt to upload again in case there was an error.
      // e.g. attempt to drop in file when there already was a file ready to upload.
      me.clearErrors(); 
      
      // Genie must validate here. In Rich UI validation is done as part of the main screen submit process.
      // DragDrop already does validation upon dropping. Assumes uploadLink cannot be clicked unless files are chosen.
      if (extras.validateBeforeUpload){
        // Count the files that were not already uploaded (those which did not have "Finished" indicated, if any).
        var err = me.validateCount();
        if (!err) {
          err = me.validateNames();
        }
        if (err) {
          me.showError(err);
          return false;
        }
      }
      
      me.upload();
    }
    e.cancelBubble = true;
    e.returnValue = false;
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    return false;
  }
  
  // Methods needed by child classes.
  
  this.getSubmitHandle = function(){ return submitHandle; };
  this.resetProgressBar = function(){ progressBar.value = 0; };
  
  this.addAllowedTypesParam = function(params){
    params["allowedTypes"] = allowedTypes;
  };

  /**
   * Show an error as a validation tip next to the upload widget. (FileUploadDND calls this directly.)
   * E.g. error tip happens with too many files, when drag/drop and autoSubmit true, when cancelling uploads.
   * @param {String} message
   */
  this.showError = function(message){
    
    if (mainBox.validationTip != null) mainBox.validationTip.hide();  //Hide with animation--takes time.
    mainBox.validationTip = new pui.ValidationTip(mainBox); //New element can appear without waiting.
    mainBox.validationTip.setMessage(message);
    mainBox.validationTip.show();
  };
  
  this.setError = function(message){
    error = message;
  };
  
  /**
   * Hide error tip, reset progress bar, clear internal "error".
   */
  this.clearErrors = function(){
    error = "";
    me.resetProgressBar();
    
    if (mainBox.validationTip != null && typeof mainBox.validationTip.hide == 'function'){
      mainBox.validationTip.hide();
    }
  };

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

    var done = true;
    for (var i = 0; i < pui.fileUploadElements.length; i++) {
    
      if (pui.fileUploadElements[i].isSubmitting()) {
      
        done = false;
        break;
      
      }
  
    }
    
    if (done) {
    
      var errors = {};
      var good = true;
      for (var i = 0; i < pui.fileUploadElements.length; i++) {
 
        var error = pui.fileUploadElements[i].getError();
        if (error != "") {
        
          good = false;
          errors[pui.fileUploadElements[i].getId()] = error;
        
        }
    
      }
      
      if (good) {
      
        for (var i = 0; i < pui.fileUploadElements.length; i++) { 
      
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
          while(fileCount.length < 3) {
          
            fileCount = "0" + fileCount;  
          
          }
          
          var targetDirectory = fileUpload.getTargetDirectory();
          if (targetDirectory.length > 256) {
          
            targetDirectory = targetDirectory.substr(0, 256);
          
          }
          else {
          
            while(targetDirectory.length < 256) {
            
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

      // Process multiple occurence property.
      var suffix = 1;
      var prop = "allowed type";
      var types = [];
      while (typeof(parms.properties[prop]) == "string") {

        types.push(parms.evalProperty(prop)); 
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
  
  propertySetters: pui["fileupload"].propset
  
});