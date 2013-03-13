//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2013 Profound Logic Software, Inc.
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

pui["fileupload"]["select text"] = "Select Files";
pui["fileupload"]["clear text"] = "Clear";
pui["fileupload"]["remove text"] = "Remove";

pui["fileupload"]["file limit"] = "Limit of {FILE_LIMIT} file(s) exceeded.";
pui["fileupload"]["size limit"] = "Limit of {SIZE_LIMIT}MB per file exceeded.";
pui["fileupload"]["duplicate file"] = "Duplicate files selected.";
pui["fileupload"]["invalid type"] = "One or more files are of invalid type.";
pui["fileupload"]["file exists"] = "One or more files already exist on the file system.";
pui["fileupload"]["prevented"] = "Operation prevented by exit program.";

pui["fileupload"]["input limit"] = "Total input size limit exceeded.";
pui["fileupload"]["no session"] = "Not connected to a valid session.";
pui["fileupload"]["timeout"] = "Transaction timed out.";
pui["fileupload"]["invalid response"] = "The server response is missing or invalid.";

/**
 * File Upload Class
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
  var transactionId = 1;
  var submitHandle;
  var timeout = 86400000;
  var error = "";  
  
  var enhanced = false;
  var fileLimit = 1;
  var sizeLimit = 10;
  var targetDirectory = "";
  var altName = "";
  var overwrite = false;
  var allowedTypes = [];

  // Constructor.
  createIFrame();
  createForm();
  createControlBox();
  createListBox();

  // Public methods. 
  
  this.render = function() {

    // Create selector only if not done before, or if we 
    // are in single select mode.
    
    // In single-select mode it is necessary to add a new selector once one is used to provide 
    // multiple file upload. 
    if (!enhanced || selectors.length == 0) {
    
      createSelector();
      
    }
    
    if (table.tBodies.length > 0) {
    
      table.removeChild(table.tBodies[0]);
    
    }
    
    var tBody = table.appendChild(document.createElement("tbody"));
    
    var names = [];
    var sizes = [];
    if (enhanced) {
    
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
    
      var name = names[i] + ((enhanced) ? " (" + formatBytes(sizes[i], 2) + ")" : ""); 
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
	    
	    if (!enhanced) {      
	          
  	    col = row.insertCell(-1);
  	    col.className = "remove-col";
  	    var a = document.createElement("a");
  	    a.href = "javascript: void(0);";
  	    a.className = "remove";
  	    a.appendChild(document.createTextNode(pui["fileupload"]["remove text"]));
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
  
  }
  
  this.setFileLimit = function(newLimit) {
  
    if (newLimit != null && !isNaN(newLimit)) {
    
      fileLimit = newLimit; 
    
    }
  
  }
  
  this.setSizeLimit = function(newLimit) {
  
    if (newLimit != null && !isNaN(newLimit)) {
    
      sizeLimit = newLimit; 
    
    }
  
  }  
  
  this.setMode = function(newMode) {
  
    // It is necessary to clear all file selectors when the mode is changing.
    if ((newMode == "enhanced" && !enhanced) || (newMode != "enhanced" && enhanced)) {
    
      enhanced = (newMode == "enhanced");
      clearFiles();
    
    }
  
  }
  
  this.getTargetDirectory = function() {
  
    return targetDirectory;
  
  }
  
  this.getFileNames = function() {
  
    var names = [];
  
    if (enhanced) {
    
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
  
  }
  
  this.setTargetDirectory = function(value) {
  
    if (typeof(value) == "string") {
    
      targetDirectory = value;
      if (targetDirectory.length > 1 && targetDirectory.charAt(targetDirectory.length - 1) == "/") {
      
        targetDirectory = targetDirectory.substr(0, targetDirectory.length - 1);
      
      }
    
    }
  
  }
  
  this.setAltName = function(value) {
  
    if (typeof(value) == "string") {
    
      altName = value;
    
    }
  
  }  
  
  this.setOverwrite = function(value) {
  
    if (typeof(value) == "boolean") {
    
      overwrite = value;
    
    }    
  
  }
  
  this.setAllowedTypes = function(types) {
  
    if (types && types.constructor && types.constructor.toString().indexOf("function Array") != -1) {
    
      allowedTypes = types;
    
    }
  
  }
  
  this.getCount = function() {
  
    if (enhanced) {
    
      return selectors[0].input.files.length;
    
    }
    else {
    
      // Current selector is always unused.
      return selectors.length - 1;
    
    }
  
  }
  
  this.validateCount = function() {
  
    if (this.getCount() > fileLimit) {
    
      return pui["fileupload"]["file limit"].replace(/{FILE_LIMIT}/g, fileLimit);
    
    } 
  
  }
  
  this.validateNames = function() {
  
    if (!enhanced) {
    
      var arr = this.getFileNames();
      var used = {};
      for (var i = 0; i < arr.length; i++) {
      
        if (typeof(used[arr[i]]) != "undefined") {
        
          return pui["fileupload"]["duplicate file"];
        
        }
        
        used[arr[i]] = true;
      
      }
    
    }
  
  }

  this.upload = function() {
  
    if (submitHandle != null) {
    
      return;
    
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
    
    form.elements["flimit"].value = fileLimit;
    form.elements["slimit"].value = sizeLimit;
    form.elements["dir"].value = targetDirectory;
    form.elements["altname"].value = altName;
    form.elements["overwrite"].value = (overwrite) ? "1" : "0";
    while(form.elements["type"]) {
    
      if (form.elements["type"].length) {
      
        form.removeChild(form.elements["type"][0]);
        
      }
      else {
      
        form.removeChild(form.elements["type"]);  
      
      }
    
    }
    for (var i = 0; i < allowedTypes.length; i++) {
    
      var hidden = createNamedElement("input", "type");
      hidden.type = "hidden";
      hidden.value = allowedTypes[i];
      form.appendChild(hidden);
    
    } 
    
    submitHandle = setTimeout(function() {
    
      me.completeTransaction(transactionId, {"success":false,"error":pui["fileupload"]["timeout"]});
    
    }, timeout);
    
    // This prevents unused control from being posted.
    if (!enhanced) {
    
      selectors[selectors.length - 1].input.disabled = true;
    
    }
    
    error = "";  
    form.submit();
  
  }
  
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
        parsed = true;
        
      }
      catch(e) {
      
        responseObj = {"success":false,"error":pui["fileupload"]["invalid response"]}; 
      
      }
      
    }
    else {
    
      // Passed as object already when timed out.
      responseObj = response;
    
    }
    
    if (!responseObj["success"]) {
    
      if (responseObj["key"]) {
      
        responseObj["error"] = pui["fileupload"][responseObj["key"]];
      
      }
      error = responseObj["error"];
      error = error.replace(/{FILE_LIMIT}/g, fileLimit);
      error = error.replace(/{SIZE_LIMIT}/g, sizeLimit);
    
    }
    
    // This is disabled before submit.
    if (!enhanced) {
    
      selectors[selectors.length - 1].input.disabled = false;
    
    }    
    
    submitHandle = null;
    transactionId++;  
  
  }
  
  this.isSubmitting = function() {
  
    return (submitHandle != null);
  
  }
  
  this.getError = function() {
  
    return error;
  
  }
  
  this.getId = function() {
  
    return mainBox.id;
  
  }

  // Private methods.

	function createForm() {
		
		form = document.createElement("form");
		form.method = "post";
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
	
	  // For single selection mode, remove current selector if unused.
	  // Otherwise, hide it before a new one is created.
	  var selector;
    if (!enhanced) {
    
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
	  selector.href = "javascript: void(0);";
	  selector.className = "control-proxy";
	  selector.appendChild(document.createTextNode(pui["fileupload"]["select text"]));
	  
	  var input = document.createElement("input");
		input.name = "file";
		input.type = "file";
		input.className = "control";
		
		if (enhanced) {
		
			input.multiple = true;
			enhanced = (typeof(input.files) != "undefined");
			
			
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
		  clearLink.appendChild(document.createTextNode(pui["fileupload"]["clear text"]));
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
	  
	  if (submitHandle == null) {
	  
      while(selectors.length > 0) {
      
        selectors[selectors.length - 1].parentNode.removeChild(selectors[selectors.length - 1]);
        selectors.pop();
      
      }
      
      me.render();
    
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

}

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

}

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
      
          // Build response.
          var fileUpload = pui.fileUploadElements[i];
          var qualField = fileUpload.qualField;
          
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
          
          var namesArray = fileUpload.getFileNames();
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
      
        pui.submitResponse(param);  
        
      }
      else {
      
        pui.cancelResponse(errors);
      
      }
    
    }
    else {
    
      setTimeout(function() {
        pui.checkUploads(param)
      }, interval);
    
    }

}

pui.widgets.add({

  context: "dspf",
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

        if (parms.dom.fileUpload == null) {
        
          parms.dom.fileUpload = new pui["fileupload"].FileUpload(parms.dom);
          pui.fileUploadElements.push(parms.dom.fileUpload);
        
        }
        
        // Process multiple occurence property.
        var suffix = 1;
        var prop = "allowed type";
        var types = [];
        while (typeof(parms.properties[prop]) == "string") {
       
          types.push(parms.properties[prop]); 
          prop = "allowed type " + (++suffix);
        
        }
        parms.dom.fileUpload.setAllowedTypes(types);

        parms.dom.fileUpload.render();

    },
    
    "selection mode": function(parms) {
    
      parms.dom.fileUpload.setMode(parms.newValue); 
    
    },
    
    "number of files": function(parms) {
    
      if (parms.design) return;
    
      parms.dom.fileUpload.setFileLimit(parseInt(parms.newValue, 10)); 
    
    },
    
    "size limit": function(parms) {
    
      if (parms.design) return;
    
      parms.dom.fileUpload.setSizeLimit(parseInt(parms.newValue, 10)); 
    
    },
    
    "target directory": function(parms) {
    
      if (parms.design) return;
    
      parms.dom.fileUpload.setTargetDirectory(trim(parms.newValue));   
    
    },
    
    "rename to": function(parms) {
    
      if (parms.design) return;
    
      parms.dom.fileUpload.setAltName(trim(parms.newValue));   
    
    },
    
    "overwrite files": function(parms) {
    
      if (parms.design) return;
    
      parms.dom.fileUpload.setOverwrite(parms.newValue == "true" || parms.newValue == true);   
    
    }
    
  }
  
});