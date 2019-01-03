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



pui["fileupload"] = {};

/**
 * File Upload Class
 * @param {Object} container
 * @constructor
 */

pui["fileupload"].FileUpload = function(container) {

  // Private fields.
  var me = this;
  var mainBox = container;
  var formAction = getProgramURL("PUI0009109.PGM");
  
  var form;
  var iframe;
  var controlBox;
  var listBox;
  var table;  
  var selectors = [];
  var clearLink;
  var uploadLink;
  var transactionId = 1;
  var submitHandle;
  var timeout = 86400000;
  var error = "";  
  var disabled = false;
  
  var MODE_STANDARD = 0;
  var MODE_ENHANCED = 1;
  var MODE_SINGLE = 2;
  
  var selectionMode = MODE_STANDARD;
  
  var fileLimit = 1;
  var sizeLimit = 10;
  var targetDirectory = "";
  var altName = "";
  var overwrite = false;
  var allowedTypes = [];
  var uploadEvent; 

  // Constructor.
  createIFrame();
  createForm();
  createControlBox();
  createListBox();

  // Public methods. 
  
  this.render = function() {

    // Create selector only if not done before, or if we 
    // are in standard select mode.
    
    // In standard-select mode it is necessary to add a new selector once one is used to provide 
    // multiple file upload. In any mode, at least one selector is needed.
    if (selectionMode == MODE_STANDARD || selectors.length == 0) {
    
      createSelector();
      
    }
    
    if (table.tBodies.length > 0) {
    
      table.removeChild(table.tBodies[0]);
    
    }
    
    var tBody = table.appendChild(document.createElement("tbody"));
    
    var names = [];
    var sizes = [];
    if (selectionMode == MODE_ENHANCED) {
    
      for (var i = 0; i < selectors[0].input.files.length; i++) {
      
        names.push(selectors[0].input.files[i].name);
        sizes.push(selectors[0].input.files[i].size);
      
      }
    
    }
    else {
    
      for (var i = 0; i < selectors.length; i++) {
      
        if (selectors[i].input.value != "") {
        
          names.push(selectors[i].input.value.substr(selectors[i].input.value.lastIndexOf("\\") + 1));
          
        }
      
      }        
    
    }       
    
    for (var i = 0; i < names.length; i++) {
    
      var name = names[i] + ((selectionMode == MODE_ENHANCED) ? " (" + formatBytes(sizes[i], 2) + ")" : ""); 
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
      
      if (selectionMode == MODE_STANDARD) {
        // Show the Remove link for each file selected in standard mode.
            
        col = row.insertCell(-1);
        col.className = "remove-col";
        var a = document.createElement("a");
        a.href = "javascript: void(0);";
        a.className = "remove";
        a.appendChild(document.createTextNode(pui["getLanguageText"]("runtimeText", "upload remove text")));
        a.puiFileIndex = i;
        if (a.attachEvent) {
          a.attachEvent("onclick", removeFile);
        }
        else if (a.addEventListener) {
          a.addEventListener("click", removeFile, false);
        }
        col.appendChild(a);
        
      }
      
    }      
  
  };
  
  this.setFileLimit = function(newLimit) {
  
    if (newLimit != null && !isNaN(newLimit)) {
    
      fileLimit = newLimit; 
    
    }
  
  };
  
  this.setSizeLimit = function(newLimit) {
  
    if (newLimit != null && !isNaN(newLimit)) {
    
      sizeLimit = newLimit; 
    
    }
  
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
    if (doclear) this["clear"]();
  };
  
  this.getTargetDirectory = function() {
  
    return targetDirectory;
  
  };
  
  /**
   * Return a list of file names selected.
   * @returns {Array} Returns an array of strings.
   */
  this["getFileNames"] = function() {
  
    var names = [];
  
    if (selectionMode == MODE_ENHANCED) {
    
      for (var i = 0; i < selectors[0].input.files.length; i++) {
      
        names.push(selectors[0].input.files[i].name);
      
      }
    
    }
    else {
    
      for (var i = 0; i < selectors.length; i++) {
      
        if (selectors[i].input.value != "") {
        
          names.push(selectors[i].input.value.substr(selectors[i].input.value.lastIndexOf("\\") + 1));
          
        }
      
      }        
    
    }
    
    return names;   
  
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
    for (var i = 0; i < selectors.length; i++) {
    
      selectors[i].input.disabled = disabled;
    
    }  
  
  };
  
  this.setOverwrite = function(value) {
  
    if (typeof(value) == "boolean") {
    
      overwrite = value;
    
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
  
  /**
   * Return the number of files selected.
   * @returns {Number}
   */
  this.getCount = function() {
  
    if (selectionMode == MODE_ENHANCED) {
    
      return selectors[0].input.files.length;
    
    }
    else if (selectionMode == MODE_SINGLE){
      return (selectors[0] != null && selectors[0].input.value != "" ? 1 : 0);
    }
    else {
    
      // Current selector is always unused.
      return selectors.length - 1;
    
    }
  
  };
  
  this.validateCount = function() {
  
    if (this.getCount() > fileLimit) {
    
      return pui["getLanguageText"]("runtimeMsg", "upload file limit", [ fileLimit ]);
    
    } 
  
  };
  
  /**
   * Check for duplicate file names in standard selection.
   * @returns {String|undefined}  Returns a string error message if a duplicate was found.
   */
  this.validateNames = function() {
  
    if (selectionMode == MODE_STANDARD) {
    
      var arr = this["getFileNames"]();
      var used = {};
      for (var i = 0; i < arr.length; i++) {
      
        if (typeof(used[arr[i]]) != "undefined") {
        
          return pui["getLanguageText"]("runtimeMsg", "upload duplicate file");
        
        }
        
        used[arr[i]] = true;
      
      }
    
    }
  
  };

  this.upload = function() {
  
    if (submitHandle != null || (context == "genie" && pui.genie.formSubmitted)) {
    
      return;
    
    }  
  
    submitHandle = {}; // Will be set to true value later.
    error = "";
      
    if (typeof(window["cordova"]) != "undefined") {
    
      var params = {};
      params["dir"] = targetDirectory;
      params["overwrite"] = overwrite;
      params["flimit"] = fileLimit;
      params["slimit"] = sizeLimit;
      params["altname"] = altName;
      params["allowedTypes"] = allowedTypes;      
      params["files"] = [];
      
      if (selectionMode == MODE_ENHANCED) {
        
        for (var i = 0; i < selectors[0].input.files.length; i++) {
        
          params["files"].push(selectors[0].input.files[i]);
          
        }
        
      }
      else if (selectionMode == MODE_STANDARD) {
       
        for (var i = 0; i < selectors.length - 1; i++) { // Prevent last unused control from posting.
          
          params["files"][i] = selectors[i].input.files[0];
          
        }        
        
      }
      else if (selectionMode == MODE_SINGLE) {
        if (selectors[0] != null && selectors[0].input.value != ""){
          params["files"][0] = selectors[0].input.files[0];
        }
      }
      
      pui.upload(params, function(success, errorMsg) {
        
        if (!success) {
          
          error = errorMsg;
          
        }
        submitHandle = null;
        
      });
      
    }
    else {
    
      if (context == "genie") {
        
        pui.submitLog(pui.genie.formSubmitted = true); 
        pui.showWaitAnimation();
      
      }      
      
      // These 3 values are always passed on the form action URL.
      // This is because they are absolutely necessary in order to 
      // notify the browser when the form submit is complete. 
      
      // Form POST data may not be available if the input buffer size is 
      // exceeded, for example.
      form.action = formAction;
      form.action += "?AUTH=";
      if (pui["appJob"] && pui["appJob"]["auth"]) {
  
        form.action += encodeURIComponent(pui["appJob"]["auth"]);
      
      }   
      form.action += "&trans=" + encodeURIComponent(transactionId);
      form.action += "&id=" + encodeURIComponent(mainBox.id);     
      if (pui["isCloud"]) {
        form.action += "&workspace_id=" + pui.cloud.ws.id;
      }
      
      form.elements["flimit"].value = fileLimit;
      form.elements["slimit"].value = sizeLimit;
      form.elements["dir"].value = targetDirectory;
      form.elements["altname"].value = altName;
      form.elements["overwrite"].value = (overwrite) ? "1" : "0";
      var els = [].slice(form.querySelectorAll("input[name=\"type\"]"));
      while (els.length > 0) {
        var el = els.pop();
        el.parentNode.removeChild(el);
      }
      for (var i = 0; i < allowedTypes.length; i++) {
      
        var hidden = createNamedElement("input", "type");
        hidden.type = "hidden";
        hidden.value = allowedTypes[i];
        form.appendChild(hidden);
      
      } 
      
      submitHandle = setTimeout(function() {
      
        me.completeTransaction(transactionId, {"success":false,"error": pui["getLanguageText"]("runtimeMsg", "upload timeout")});
      
      }, timeout);
      
      // This prevents unused control from being posted.
      if (selectionMode == MODE_STANDARD) {
      
        selectors[selectors.length - 1].input.disabled = true;
      
      }
      
      form.submit();
    
    }
  
  };
  
  this["completeTransaction"] = function(id, response) {
  
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
    
      // Passed as object already when timed out.
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
    
    // This is disabled before submit.
    if (selectionMode == MODE_STANDARD) {
    
      selectors[selectors.length - 1].input.disabled = false;
    
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
      
        this.doUploadEvent();
      
      }
      else {
      
        pui.alert(responseObj["error"]);
      
      }    
    
    }
  
  };
  
  this.isSubmitting = function() {
  
    return (submitHandle != null);
  
  };
  
  this.getError = function() {
  
    return error;
  
  };
  
  this.getId = function() {
  
    return mainBox.id;
  
  };
  
  this.doUploadEvent = function() {
  
    if (uploadEvent && uploadEvent != "") {
    
      var obj = {};
      obj["dir"] = this.getTargetDirectory();
      obj["names"] = this["getFileNames"]();
      
      var func = function() {
        eval("var info = arguments[0];");
        try {
        
          var func2 = eval(uploadEvent);
          if (typeof(func2) == "function") {
          
            func2(arguments[0]);
          
          }
          
        }
        catch (e) {
        
          pui.scriptError(e, "onupload Error:\n");
                
        }
        
      };
    
      func(obj);
    
    }  
  
  };
  
  // API methods.
  this["clear"] = function() {
  
    if (submitHandle == null && !disabled) {
    
      while(selectors.length > 0) {
      
        selectors[selectors.length - 1].parentNode.removeChild(selectors[selectors.length - 1]);
        selectors.pop();
      
      }
      
      this.render();
    
    }  
  
  };

  // Private methods.

  function createForm() {
    
    form = document.createElement("form");
    form.enctype = "multipart/form-data";
    form.encoding = "multipart/form-data"; // For IE7/8.
    form.method = "post";
    form.target = "frame_" + mainBox.id;
    form.className = "upload-form";
    
    var hidden = createNamedElement("input", "flimit");
    hidden.type = "hidden";
    form.appendChild(hidden);  
            
    hidden = createNamedElement("input", "slimit");
    hidden.type = "hidden";
    form.appendChild(hidden);  
            
    hidden = createNamedElement("input", "altname");
    hidden.type = "hidden";
    form.appendChild(hidden);    
          
    hidden = createNamedElement("input", "dir");
    hidden.type = "hidden";
    form.appendChild(hidden);  
    
    hidden = createNamedElement("input", "overwrite");
    hidden.type = "hidden";
    form.appendChild(hidden);  
            
    
    mainBox.appendChild(form);      
    
  }
  
  function createIFrame() {
  
    iframe = createNamedElement("iframe", "frame_" + mainBox.id);
    iframe.src = pui.normalizeURL("/profoundui/proddata/html/blank.html");
    iframe.className = "upload-frame";
    iframe.style.display = "none";
    mainBox.appendChild(iframe);
  
  }
  
  function createControlBox() {
  
    controlBox = document.createElement("div");
    controlBox.className = "control-box";
    form.appendChild(controlBox);
  
  }
  
  function createSelector() {
  
    // For standard selection mode, remove current selector if unused.
    // Otherwise, hide it before a new one is created.
    var selector;
    if (selectionMode == MODE_STANDARD) {
    
        if (selectors.length > 0) {
        
          selector = selectors[selectors.length - 1];
          if (selector.input.value == "") {
          
            selector.parentNode.removeChild(selector);
            selectors.splice(selectors.length - 1, 1);
          
          }
          else {
          
            selector.style.display = "none";  
          
          }
        
        }
    
    }  
  
    selector = document.createElement("a");
    selector.className = "control-proxy";
    selector.appendChild(document.createTextNode(pui["getLanguageText"]("runtimeText", "upload select text")));
    
    var input = document.createElement("input");
    input.name = "file";
    input.type = "file";
    input.className = "control";
    
    if (selectionMode == MODE_ENHANCED) {
    
      input.multiple = true;
      if(typeof(input.files) == "undefined") selectionMode = MODE_STANDARD; //Fallback for older browsers.
      
      
    }
    
    if (input.attachEvent) {
      
      input.attachEvent("onchange", me.render);
      selector.attachEvent("onclick", checkSelect);

    }
    else if (input.addEventListener) {

      input.addEventListener("change", me.render, false);
      selector.addEventListener("click", checkSelect, false);

    }    

    selector.input = input;        
    selectors.push(selector);        
    selector.appendChild(input);        
    
    if (clearLink == null) {
    
      clearLink = document.createElement("a");
      clearLink.href = "javascript: void(0);";
      clearLink.appendChild(document.createTextNode(pui["getLanguageText"]("runtimeText", "upload clear text")));
      clearLink.className = "clear";
      
      if (clearLink.attachEvent) {
      
        clearLink.attachEvent("onclick", clearFiles);
      
      }
      else if (clearLink.addEventListener) {
      
        clearLink.addEventListener("click", clearFiles, false); 
      
      }
      
      controlBox.appendChild(clearLink);  
    
    }

    if (clearLink == null) {
    
      controlBox.appendChild(selector);
    
    }
    else {
    
      controlBox.insertBefore(selector, clearLink);
    
    }
    
    if (context == "genie") {
    
      if (uploadLink == null) {
    
        uploadLink = document.createElement("a");
        uploadLink.href = "javascript: void(0);";
        uploadLink.appendChild(document.createTextNode(pui["getLanguageText"]("runtimeText", "upload upload text")));
        uploadLink.className = "upload"; 
      
      } 
      
      if (uploadLink.attachEvent) {
      
        uploadLink.attachEvent("onclick", uploadFiles);
      
      }
      else if (uploadLink.addEventListener) {
      
        uploadLink.addEventListener("click", uploadFiles, false); 
      
      }  
      
      controlBox.appendChild(uploadLink);        
    
    }
        
  }
  
  function createListBox() {
  
    listBox = document.createElement("div");
    listBox.className = "list-box";
    
    table = document.createElement("table");
    table.className = "list";
    listBox.appendChild(table);
    
    form.appendChild(listBox);
    
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
  
  }
  
  function removeFile(e) {
  
    e = e || window.event;
    var target = e.target || e.srcElement;
    
    if (submitHandle == null) {
    
      // Remove specified selector.
      var index = target.puiFileIndex;
      selectors[index].parentNode.removeChild(selectors[index]);
      selectors.splice(index, 1);
      
      me.render();
    
    }
    
    e.cancelBubble = true;
    e.returnValue = false;
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    return false;
  
  }
  
  function clearFiles(e) {
  
    e = e || window.event;
    
    me["clear"]();
    
    e.cancelBubble = true;
    e.returnValue = false;
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    return false;
      
  }  
  
  function uploadFiles(e) {
  
    e = e || window.event;
  
    if (submitHandle == null && !inDesignMode() && !pui.genie.formSubmitted) {
    
      // Validate here, for Rich UI, validation is done as part of the 
      // main screen submit process.
  
      if (me.getCount() == 0) {
      
        pui.alert(pui["getLanguageText"]("runtimeMsg", "upload no files"));
        return;
      
      }
      else {
      
        var err = me.validateCount();
        if (!err) {
        
          err = me.validateNames();
        
        }
        
        if (err) {
        
          pui.alert(err);
          return;
        
        }
      
      }
      
      me.upload();
    
    }
  
    if (e) {
    
      e.cancelBubble = true;
      e.returnValue = false;
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      return false;
      
    }  
  
  }
  
  function formatBytes(bytes, precision) {  
  
    var units = ["B", "KB", "MB", "GB", "TB"];  
    var bytes = Math.max(bytes, 0);  
    var pow = Math.floor((bytes ? Math.log(bytes) : 0) / Math.log(1024)); 
    pow = Math.min(pow, units.length - 1);  
    bytes = bytes / Math.pow(1024, pow);  
    precision = (typeof(precision) == "number" ? precision : 0);  
    return (Math.round(bytes * Math.pow(10, precision)) / Math.pow(10, precision)) + " " + units[pow];
  
  }  

};

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
          
          var namesArray = fileUpload["getFileNames"]();
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
  
  propertySetters: {
  
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
    
    "onupload": function(parms) {

      if (parms.design) return;
    
      parms.dom["fileUpload"].setUploadEvent(parms.newValue);
    
    },
    
    "disabled": function(parms) {
    
      if (parms.design) return;
      
      var disabled = (parms.value == "true");
      parms.dom["fileUpload"].setDisabled(disabled);
    
    }
    
  }
  
});