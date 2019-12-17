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

/**
 * File Upload DND Class. Inherits from pui.fileupload.FileUpload class.
 * 
 * File created by: Matthew Denninghoff.
 * Date created: 10/30/2015.
 * 
 * Limitations: This widget will not work with IE versions less than 10 or
 * with Microsoft Edge (as of 11/4/15).
 * 
 * Required by obfuscator:
 * @constructor
 * @param {Object} container
 * @returns {undefined}
 */
pui["fileupload"].FileUploadDND = function(container) {
  
  var extraParms = {
    preConstruct: createDropBox,
    alwaysShowProgressBar: true,
    selectFilesLink: false,
    clearLinkClass: "clear-files",
    uploadLinkClass: "upload-files",
    validateBeforeUpload: false
  };
  
  // Assign properties from the parent class onto a new instance of this class.
  pui["fileupload"].FileUpload.call(this, container, extraParms);
  
  // Private fields.
  var me = this; // alias used for on-event handlers with different "this" pointer.
  
  var dropBox; // drop target.
  
  //
  // These are user-modifiable widget properties.
  //
  var autoSubmit = false;     // DSPF only.
  var autoUpload = false;     // Genie only.
  
  // Variables necessary for the readNextFile() handlers to process the file list in sequence.
  var droppedFileList = null;
  var droppedCtr = 0;
  
  //
  // Public methods. 
  //

  this.setAutoSubmit = function(autosub) {
    autoSubmit = (autosub === true || autosub === "true");
  };
  
  this.setAutoUpload = function(autoup) {
    autoUpload = (autoup === true || autoup === "true");
  };

  /**
   * Note: we can skip sending the MIME type since we validated it in the ondrop function already. (Simplifies handling jpg/jpeg.)
   * Called by this.upload. Overrides.
   * @param {Object} params  pui.upload parameters setup in parent class.
   */
  this.addAllowedTypesParam = function(params){
    params["allowedTypes"] = [];
  };
  
  // Overrides. Called when the user onupload has an exception in Genie.
  this.uploadEventException = function(e){
    me.setError("onupload Error:\n" + e.message);
  };

  //
  // Handlers for dropBox events.
  //

  /**
   * Handler for the dropBox.ondragover event. This works better than the 
   * ondragenter event.
   * 
   * @param {type} e
   * @returns {Boolean}
   */
  function boxdragover(e) {
    e = e || event;
    var submitHandle = me.getSubmitHandle();
    e.returnValue = false;
    if( e.stopPropagation )
      e.stopPropagation();  // The event only applies to dropBox.
    if( e.preventDefault )
      e.preventDefault();    // prevent the default dragover on dropBox.
    if (me.isDisabled() || submitHandle != null || inDesignMode() || pui.isPreview ) return false;
    e.dataTransfer.dropEffect = "copy";
    // Add a CSS class to indicate that drop is allowed here.
    pui.addCssClass(dropBox, "dragover");
    return false;
  }
  
  /**
   * Handler for dropBox.ondragleave event.
   * 
   * @param {type} e
   * @returns {Boolean}
   */
  function boxdragleave(e) {
    e = e || event;
    e.returnValue = false;
    if( e.stopPropagation )
      e.stopPropagation();
    if( e.preventDefault )
      e.preventDefault();
    pui.removeCssClass(dropBox, "dragover");
    return false;
  }
  
  /**
   * Handler for dropBox.ondrop event.
   * This adds files to our widget, validates them, and starts the upload.
   * 
   * @param {type} e
   * @returns {undefined}
   */
  function boxdrop(e) {
    // Prevent page redirect on file drop into our box.
    e = e || event;
    e.returnValue = false;
    if( e.stopPropagation )
      e.stopPropagation();
    if( e.preventDefault )
      e.preventDefault();
    
    var submitHandle = me.getSubmitHandle();
    if (me.isDisabled() || submitHandle !== null || (context === "genie" && pui.genie.formSubmitted) || inDesignMode() || pui.isPreview ) return;
    
    if( e.dataTransfer.files === null || e.dataTransfer.files === undefined ) {
      // This case shouldn't happen since we previously disabled the ondrop
      // handler for older browsers, but catch and log in case it does.
      console.log("Browser doesn't support dataTransfer.files API");
      return;
    }
    pui.removeCssClass(this, "dragover");
  
    // Remove files which already attempted to upload.
    me.checkAndRemoveFiles();

    // In each drop event, clear the validation hint, since files 
    // causing it to appear were blocked from being added.
    // Remove previous error.
    me.clearErrors();
    
    // Don't add anything if too many files have been dropped in.
    var fileLimit = me.getFileLimit();
    if (me.fileList.length + e.dataTransfer.files.length > fileLimit) {
      me.showError(pui["getLanguageText"]("runtimeMsg", "upload file limit", [fileLimit]));
      return;
    } 
    
    // If the dropped item had files/directories, then start reading them.
    if( e.dataTransfer.files.length > 0 ) {
      droppedFileList = e.dataTransfer.files;
      droppedCtr = 0;
      readNextFile();
    } else {
      // This happens when some text was dragged or in IE10/IE11 when a folder
      // was dragged in. IE doesn't put folders in the dataTransfer FileList.
      me.showError(pui["getLanguageText"]("runtimeMsg", "upload invalid type"));
    }
  }
  
  /**
   * Initiate one file reader on the list of dropped files and assign handlers.
   * The handlers determine if the file was readable; directories are unreadable.
   * 
   * To ensure the script waits until the last file is finished reading, the
   * next call to readNextFile() is only called from the handlers.
   * 
   * @returns {undefined}
   */
  function readNextFile() {
    var reader = new FileReader();
    reader.onload = function() {
      droppedFileList[droppedCtr].isReadable = true;
      // We are the last file.
      if( droppedCtr == droppedFileList.length - 1 ) {
        processDropList();
      }
      else {
        droppedCtr++;
        readNextFile();
      }
    };
    reader.onerror = function() {
      droppedFileList[droppedCtr].isReadable = false;
      // We are the last file.
      if( droppedCtr == droppedFileList.length - 1 ) {
        processDropList();
      }
      else {
        droppedCtr++;
        readNextFile();
      }
    };
    // Attempt to start reading. The obfuscator will mangle this without string.
    reader["readAsArrayBuffer"](droppedFileList[droppedCtr]);
  }
  
  /**
   * This should only be called by the FileReader handlers after all the files
   * attempted to open. Once here, we know if dropped objects were directories
   * or readable files. 
   * 
   * @returns {undefined}
   */
  function processDropList()
  {
    var pushlist = [];
    var hadError = false;
    var sizeLimit = me.getSizeLimit();
    var allowedTypes = me.getAllowedTypes();

    // Look at each dropped file.
    for (var i = 0; i < droppedFileList.length && !hadError; i++) {
      var exists = false;
      // See if the file's name already exists in the upload list.
      for (var j = 0; j < me.fileList.length; j++) {
        if (me.fileList[j].name === droppedFileList[i].name) {
          exists = true;
          break;
        }
      }

      // Fix MIME type. PUI uses image/jpg whereas a browser may use image/jpeg.
      var ftypeTmp = droppedFileList[i].type.replace(/image\/jpeg/i, "image/jpg");
      
      // If there is nothing in allowedTypes[], allow the file.
      // If the file's type was in allowedTypes[], allow it.
      var allowedT = (allowedTypes.length <= 0 || allowedTypes.indexOf(ftypeTmp) >= 0);

      // Only add the file to our list if it passes our parameter checks.

      // Don't add if the MIME type is not accepted, or if the
      // file was a directory. Browsers prevent JS from selecting
      // files not explicitly chosen by the user, so we can't read
      // everything in a directory. Ignore them for now.
      if (!allowedT || ! droppedFileList[i].isReadable ) {
        hadError = true;
        me.setError(pui["getLanguageText"]("runtimeMsg", "upload invalid type"));
        console.log('Content-Type "%s" not permitted for upload.', ftypeTmp); //This is helpful.
      }
      // Don't add if the same filename is already in the list.
      else if (exists) {
        hadError = true;
        me.setError(pui["getLanguageText"]("runtimeMsg", "upload duplicate file"));
      }
      // Don't add if file is larger than limit.
      else if (droppedFileList[i].size > sizeLimit * 1048576) {
        hadError = true;
        me.setError(pui["getLanguageText"]("runtimeMsg", "upload size limit", [sizeLimit]));
      }
      // Otherwise, add the file to our list.
      else {
        pushlist.push(droppedFileList[i]);
      }
    }
    // done looking at each dropped file.

    // Only add files if none of them had errors.
    if( ! hadError ) {
      for (var i = 0; i < pushlist.length; i++) {
        me.fileList.push(pushlist[i]);
      }
    }
    pushlist = null;
    
    // Redraw table to show chosen files and the correct links.
    me.render();
    
    // Do nothing or auto upload or auto submit, which causes upload.
    // Note: assume the UI prevented dropping if genie form has submitted, etc.
    if (me.getCount() > 0){
      if( autoUpload && context === "genie"){
        me.upload();
      }
      else if( autoSubmit && context === "dspf") {
        pui.keyName = "Enter";
        pui.click();
      }
    }
  }
    
  //**************************************************************************
  // Methods to create boxes for inside the widget.
  //
  
  /**
   * Create a dropBox for accepting dragged files.
   * @returns {undefined}
   */
  function createDropBox() {
    
    var dropUploadSupported = true;
    if( ! window["File"] || ! window["FileList"] || ! window["FileReader"] ) dropUploadSupported = false;
    
    dropBox = document.createElement("div");
    dropBox.className = "drop-box";
    var str = pui["getLanguageText"]("runtimeText", "upload drophere text");
    if( ! dropUploadSupported ) {
      str = pui["getLanguageText"]("runtimeText","upload browser unsupported");
      dropBox.style.whiteSpace = "pre-wrap";
      dropBox.style.overflowX = "auto";
    }
    var txtnd = document.createTextNode(str);
    dropBox.appendChild(txtnd);

    // Event Handlers for dropBox.
    if( dropUploadSupported && dropBox.addEventListener ) {
      dropBox.addEventListener("dragover", boxdragover );
      dropBox.addEventListener("dragleave", boxdragleave );
      dropBox.addEventListener("drop", boxdrop );
    }
    
    container.appendChild(dropBox);
  }

};

// Let FileUploadDND inherit from FileUpload.
pui["fileupload"].FileUploadDND.prototype = Object.create(pui["fileupload"].FileUpload.prototype);

/******************************************************************************/
/*
 * pui.widgets.add() gets called when a Genie or Rich UI session begins.
 * Defines the widget and its default parameters.
 * Certain events are defined to handle when the widget is added, changed, or
 * loaded in a screen.
 *
 * http://www.profoundlogic.com/docs/pages/viewpage.action?pageId=5275778
 */
pui.widgets.add({
  /* Field type name of the widget. Must match the "widget" property in designer/Toolbox.js. */
  name: "file upload dnd",
  /* Prefix for the id property of a newly added file upload widget; e.g. "FileUploadDND1" becomes the id. */
  newId: "FileUploadDND",
  /* Appears atop the Properties menu when a widget of this type is selected. */
  menuName: "File Upload DND",
  defaults: {
    /* Default properties for a newly added widget of type "file upload dnd". */
    width: "300px",
    height: "252px",
    /* Use the same CSS as "file upload" widget. */
    "css class": "pui-file-upload",
    "size limit": "10",
    "number of files": "1",
    "overwrite files": "false"
  },
  /* Property-setter functions are called when the named property is set or
   * removed. Each are also called when the page loads or is refreshed ONLY IF
   * the property is set (unless noted otherwise below).
   * 
   * The parameter, parms.design, is true when the page is Visual Designer
   * and when design mode is On for Genie.
   * 
   * I put validation code in the setter functions instead of these handlers. MD.
   */
  propertySetters: {
    /* The "field type" function calls the widget constructor and render(). */
    "field type": function(parms) {
      /*
       * If we haven't already constructed an instance of FileUpload, do it now.
       * dom["fileUpload"] is a property of our container, not of window.pui.
       * runtime/dspf/render.js requires a "fileUpload" property, so we must use the exact string.
       * pui["fileUpload"] is the old file_upload widget, so we use a
       * different string on window.pui to avoid overwriting the other widget's class.
       * 
       * .dom["fileUpload"] is undefined on a new page load or after pui.submitReponse();
       * i.e. in RichUI when screen/record-format changes.
       */
      if (parms.dom["fileUpload"] === undefined) {
        parms.dom["fileUpload"] = new pui["fileupload"].FileUploadDND(parms.dom);

        // This pushes our widget instance onto the global list of 
        // file upload widgets. When a submit happens, each widget's
        // upload() function will be called.
        if (context === "dspf")
          pui.fileUploadElements.push(parms.dom["fileUpload"]);
      }
      // Process multiple occurence property.
      var suffix = 1;
      var prop = "allowed type";
      var types = [];
      while (typeof(parms.properties[prop]) === "string") {
        types.push(parms.evalProperty(prop));
        prop = "allowed type " + (++suffix);
      }
      parms.dom["fileUpload"].setAllowedTypes(types);
      parms.dom["fileUpload"].render();
      // If it wasn't already added, override the default drop behavior
      // for screens using this widget. By default the browser will open
      // the dropped page and navigate away. Prevent that.
      if( ! pui["fileupload"].myPreventDefAdded ) {
        // For old IE, don't add listener, because drag/drop isn't even supported.
        window.addEventListener("dragover", pui["fileupload"].myPreventDef, false);
        window.addEventListener("drop", pui["fileupload"].myPreventDef, false);
        pui["fileupload"].myPreventDefAdded = true;
      }
    },
    
    "auto submit": function(parms) {
      if (parms.design)
        return;
      parms.dom["fileUpload"].setAutoSubmit(parms.value);
    },
    "auto upload": function(parms) {
      if(parms.design )
        return;
      parms.dom["fileUpload"].setAutoUpload(parms.value);
    },
    "number of files":       pui["fileupload"].propset["number of files"],
    "size limit":            pui["fileupload"].propset["size limit"],
    "target directory":      pui["fileupload"].propset["target directory"],
    "rename to":             pui["fileupload"].propset["rename to"],
    "overwrite files":       pui["fileupload"].propset["overwrite files"],
    "generate unique names": pui["fileupload"].propset["generate unique names"],
    "onupload":              pui["fileupload"].propset["onupload"],
    "disabled":              pui["fileupload"].propset["disabled"]  //Note: only called when property is set or removed.
  }
});

/*
  Prevent a dropped file from becoming the new page.
  http://stackoverflow.com/questions/6756583/prevent-browser-from-loading-a-drag-and-dropped-file
  Required for Firefox, Chrome, and IE11, IE10, .
*/
pui["fileupload"].myPreventDef = function(e) {
  e = e || event;
  e.returnValue = false;
  if( e. preventDefault)
    e.preventDefault();
};
// Flag to avoid adding redundant window listeners.
pui["fileupload"].myPreventDefAdded = false;

