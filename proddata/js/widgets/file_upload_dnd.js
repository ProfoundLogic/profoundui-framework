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
 * File Upload DND Class. Inherits from pui.fileupload.FileUpload class.
 * File created by: Matthew Denninghoff.
 * Date created: 10/30/2015.
 * (See test cases in #6686 for a large list.)
 * 
 * Limitations: This widget will not work with IE versions less than 10.
 * 
 * @constructor
 * @param {Element} container
 * @returns {FileUploadDND}
 */
pui["fileupload"].FileUploadDND = function(container) {

  // Configuration options to override the parent.
  this._clearLinkClass = "clear-files";
  this._uploadLinkClass = "upload-files";
  this._alwaysShowProgressBar = true;
  this._validateBeforeUpload = false;
  
  this._showSelectFiles = (pui["dnd upload show select"] === true); //True/false by configuration; can be set by the "show select" property.
  
  //
  // These are user-modifiable widget properties.
  //
  this._autoSubmit = false;     // DSPF only.
  this._autoUpload = false;     // Genie only.
  
  // Variables necessary for the readNextFile() handlers to process the file list in sequence.
  this._droppedFileList = null;
  this._droppedCtr = 0;
  
  // super(). Assign properties from the parent class onto a new instance of this class; construct boxes.
  pui["fileupload"].FileUpload.call(this, container);
};

// Let FileUploadDND inherit from FileUpload.
pui["fileupload"].FileUploadDND.prototype = Object.create(pui["fileupload"].FileUpload.prototype);

// Private methods.

/**
 * Create a dropBox for accepting dragged files. Add the other control elements below it.
 */
pui['fileupload'].FileUploadDND.prototype._createBoxes = function(){
  this._dropBox = document.createElement("div");
  this._dropBox.className = "drop-box";
  this._setupDropBox();
  this._mainBox.appendChild(this._dropBox);
  
  // Event Handlers for drag/drop. Added to main box to allow dropping anywhere. Feedback only shows in drop-box.
  this._mainBox.addEventListener("dragover", this);
  this._mainBox.addEventListener("dragleave", this);
  this._mainBox.addEventListener("drop", this);
  
  this._controlBox = document.createElement("div");
  this._controlBox.className = "control-box";
  
  this._setupControlBox();
  this._createListBox();
};

/**
 * Setup text inside the Drop Box. Text may change when the "show select" property changes.
 */
pui['fileupload'].FileUploadDND.prototype._setupDropBox = function(){
  // Always add a select files link. Display it when configured.
  this._createSelectFilesLink(this._dropBox, pui["getLanguageText"]("runtimeText", "upload select text"));
  this._selectFilesLink.classList.add('dnd-upl-sel');  //Add space below the text.
  this._selectFilesLink.style.display = this._showSelectFiles ? 'block' : 'none';
  
  var str = pui["getLanguageText"]("runtimeText", "upload " + (this._showSelectFiles ? "or " : "") + "drophere text");
  var textnode = document.createTextNode(str);
  this._dropBox.appendChild(textnode);
};

/**
 * Generic event handler allowing event handlers to access class properties.
 * @param {Event} e
 * @returns {Boolean|undefined} 
 */
pui['fileupload'].FileUploadDND.prototype['handleEvent'] = function(e){
  switch (e.type){
    //
    // Handlers for drag/drop events.
    //
    case 'dragover': 
      // Handler for the dropBox.ondragover event. This works better than the ondragenter event.
      e.preventDefault();
      e.stopPropagation();
      if (this._disabled || this._submitHandle != null) return false;
      e.dataTransfer.dropEffect = "copy";
      this._dropBox.classList.add('dragover');  //Indicate that drop is allowed here.
      return false;

    case 'dragleave':
      e.preventDefault();
      e.stopPropagation();
      this._dropBox.classList.remove('dragover');
      return false;

    //
    // Adds files to our widget, validates them, and starts the upload.
    //
    case 'drop':
      // Prevent page redirect on file drop into our box.
      e.stopPropagation();
      e.preventDefault();

      this._dropBox.classList.remove('dragover');
      if (this._disabled || this._submitHandle !== null || (context === "genie" && pui.genie.formSubmitted) || inDesignMode()) return;

      if (e.dataTransfer.files === null || e.dataTransfer.files === undefined) {
        // This case shouldn't happen since we previously disabled the ondrop
        // handler for older browsers, but catch and log in case it does.
        console.log("Browser doesn't support dataTransfer.files API");
        return;
      }

      // Remove files which already attempted to upload.
      this._checkAndRemoveFiles();

      // In each drop event, clear the validation hint, since files 
      // causing it to appear were blocked from being added.
      // Remove previous error.
      this._clearErrors();

      // Don't add anything if too many files have been dropped in.
      if (this.fileList.length + e.dataTransfer.files.length > this._fileLimit) {
        this._showMessage(pui["getLanguageText"]("runtimeMsg", "upload file limit", [this._fileLimit]));
        return;
      } 

      // If the dropped item had files/directories, then start reading them.
      if( e.dataTransfer.files.length > 0 ) {
        this._droppedFileList = e.dataTransfer.files;
        this._droppedCtr = 0;
        this._readNextFile();
      }
      else {
        // This happens when some text was dragged or in IE10/IE11 when a folder
        // was dragged in. IE doesn't put folders in the dataTransfer FileList.
        this._showMessage(pui["getLanguageText"]("runtimeMsg", "upload invalid type"));
      }
      return;

    //
    // Handlers for FileReader.
    //
    case 'load':
      this._droppedFileList[this._droppedCtr].isReadable = true;
      this._readerHandleNext();
      return;
    case 'error':
      this._droppedFileList[this._droppedCtr].isReadable = false;
      this._readerHandleNext();
      return;
  }

  // Let parent class handle all else.
  return pui['fileupload'].FileUpload.prototype['handleEvent'].call(this, e);  
};

/**
 * Initiate one file reader on the list of dropped files and assign handlers.
 * The handlers determine if the file was readable; directories are unreadable.
 * 
 * To ensure the script waits until the last file is finished reading, the
 * next call to readNextFile() is only called from the handlers.
 */
pui['fileupload'].FileUploadDND.prototype._readNextFile = function() {
  var reader = new FileReader();
  reader.addEventListener('load', this);
  reader.addEventListener('error', this);
  // Attempt to start reading. Note: the obfuscator will mangle this without the string.
  reader["readAsArrayBuffer"](this._droppedFileList[this._droppedCtr]);
};

pui['fileupload'].FileUploadDND.prototype._readerHandleNext = function(){
  if( this._droppedCtr == this._droppedFileList.length - 1 ) {
    // We are the last file. This should only run after all the files attempted to open. Process the list of dropped files. Once 
    // here, we know if dropped objects were directories or readable files.

    this._processFileList(this._droppedFileList); //Validate files, render, display any notices.
    this._droppedFileList = null;
    this._droppedCtr = 0;
    
    // Do nothing or auto upload or auto submit, which causes upload.
    // Note: assume the UI prevented dropping if genie form has submitted, etc.
    if (this.getCount() > 0){
      if( this._autoUpload && context === "genie"){
        this.upload();
      }
      else if( this._autoSubmit && context === "dspf") {
        pui.keyName = "Enter";
        pui.click();
      }
    }
  }
  else {
    // There are more files.
    this._droppedCtr++;
    this._readNextFile();
  }
};

/**
 * Overrides. Note: we can skip sending the MIME type since we validated it in the ondrop function already. 
 * (Simplifies handling jpg/jpeg.) Called by this.upload.
 * @param {Object} params  pui.upload parameters setup in parent class.
 */
pui["fileupload"].FileUploadDND.prototype._addAllowedTypesParam = function(params){
  params["allowedTypes"] = [];
};

/**
 * Overrides. Called when the user onupload has an exception in Genie.
 * @param {Exception|String} e
 */
pui["fileupload"].FileUploadDND.prototype._uploadEventException = function(e){
  var msg = e.message != null ? e.message : e;
  this._error = "onupload Error:\n" + msg;
};

//
// Public methods. 
//

pui["fileupload"].FileUploadDND.prototype.setAutoSubmit = function(autosub) {
  this._autoSubmit = (autosub === true || autosub === "true");
};

pui["fileupload"].FileUploadDND.prototype.setAutoUpload = function(autoup) {
  this._autoUpload = (autoup === true || autoup === "true");
};

/**
 * Handle property change for "show select"--show or hide the "Select Files" link.
 * @param {Boolean} val
 */
pui['fileupload'].FileUploadDND.prototype.showSelect = function(val){
  this._showSelectFiles = val;
  this._dropBox.innerHTML = '';
  this._setupDropBox();
};

/******************************************************************************/
/*
 * pui.widgets.add() gets called when a Genie or Rich UI session begins.
 * Defines the widget and its default parameters.
 * Certain events are defined to handle when the widget is added, changed, or
 * loaded in a screen.
 *
 * See "pui.widgets.add( config )" (https://docs.profoundlogic.com/x/goBQ)
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
      // Process multiple occurrence property.
      var suffix = 1;
      var prop = "allowed type";
      var types = [];
      while (typeof(parms.properties[prop]) === "string") {
        types.push(parms.evalProperty(prop));
        prop = "allowed type " + (++suffix);
      }
      parms.dom["fileUpload"].setAllowedTypes(types);
      parms.dom["fileUpload"].render();
      
      // In case these were lost, add them here. (Adding is harmless if the listener already exists, because the browser will not
      // assign the same function/object to listen for the same event more than once.)
      window.addEventListener("dragover", pui["fileupload"].myPreventDef, false);
      window.addEventListener("drop", pui["fileupload"].myPreventDef, false);
    },
    
    "auto submit": function(parms) {
      if (!parms.design) parms.dom["fileUpload"].setAutoSubmit(parms.value);
    },
    "auto upload": function(parms) {
      if(!parms.design) parms.dom["fileUpload"].setAutoUpload(parms.value);
    },
    "show select": function(parms){
      parms.dom["fileUpload"].showSelect(parms.value == 'true' || parms.value == true);
    },
        
    "number of files":       pui["fileupload"].propset["number of files"],
    "size limit":            pui["fileupload"].propset["size limit"],
    "target directory":      pui["fileupload"].propset["target directory"],
    "rename to":             pui["fileupload"].propset["rename to"],
    "overwrite files":       pui["fileupload"].propset["overwrite files"],
    "generate unique names": pui["fileupload"].propset["generate unique names"],
    "onupload":              pui["fileupload"].propset["onupload"],
    "disabled":              pui["fileupload"].propset["disabled"]  //Note: only called when property is set or removed.
  },
  
  globalAfterSetter: pui['fileupload'].globalAfterSetter
});

/**
 * Prevent a dropped file from becoming the new page.
 * http://stackoverflow.com/questions/6756583/prevent-browser-from-loading-a-drag-and-dropped-file
 * #7243: only prevent files from dropping; don't prevent text from being drag-dropped on the page.
 * @param {Event} e
 */
pui["fileupload"].myPreventDef = function(e) {
  var list = e.dataTransfer.items;  //Edge, Chrome, Firefox
  if (list != null){
    for (var i=0, n=list.length; i < n; i++){
      if (list[i]['kind'] === 'file'){
        e.preventDefault();
        return;
      }
    }
  }
  list = e.dataTransfer.types;  //IE11
  if (list != null){
    for (var i=0, n=list.length; i < n; i++){
      if (list[i] === 'Files'){
        e.preventDefault();
        return;
      }
    }
  }
};
window.addEventListener("dragover", pui["fileupload"].myPreventDef, false);
window.addEventListener("drop", pui["fileupload"].myPreventDef, false);
