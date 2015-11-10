//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2015 Profound Logic Software, Inc.
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

// pui["fileUpload"] is the old file_upload widget, so we use a
// different string on window.pui to avoid overwriting the other widget's class.
pui["fileUploadDND"] = {};

/**
 * File Upload Class.
 * 
 * File created by: Matthew Denninghoff.
 * Date created: 10/30/2015.
 * 
 * Limitations: This widget will not work with IE versions less than 10 or
 * with Microsoft Edge (as of 11/4/15).
 * 
 * @param {Object} container
 * @returns {undefined}
 */
pui["fileUploadDND"].FileUpload = function(container) {
	// Private fields.
	var me = this; // alias used for on-event handlers with different "this" pointer.
	var mainBox = container;
	var postAction = getProgramURL("PUI0009109.PGM");

	var dropBox; // drop target.
	var controlBox; // holds the "Start Upload" and "Clear" links.
	var listBox;
	var progressBar;

	var table; // HTML table element that gets file names and links to remove them.

	// In this widget selectors is an array of File objects, which are
	// created by the browser upon dropping a file. File objects are immutable.
	var selectors = [];
	// Links that only appear if auto-upload is false or if context is Genie.
	var clearLink = null; // removes all selectors when clicked.
	var abortLink = null; // visible when upload starts. hidden when stopped.

	var transactionId = 1; // This is used to avoid submitting twice? Or to prevent browser caching responses.
	var submitHandle = null; // Gets a numeric timer id after a submit. Null when not uploading.
	var timeout = 86400000; // Timeout used for upload submit in milliseconds. 1 day.
	var error = "";
	var validationTip = null; // Tool tip for RichUI alerts instead of popups.
	
	var xhr = null;	// XMLHttpRequest. Referenced here to allow aborting.
	
	//
	// These are user-modifiable widget properties.
	//
	var autoSubmit = false;
	var disabled = false;
	var fileLimit = 1;
	var sizeLimit = 10;
	var targetDirectory = "";
	var altName = "";
	var overwrite = false;
	var allowedTypes = []; // List of accepted MIME file types.

	var uploadEvent; // The user-defined onupload property.

	// Provide an error element to show the last upload's error message.
	if( context === "genie" ) var errorElem;
	

	//
	// Construct HTML elements.
	//
	createDropBox();
	createControlBox();
	createListBox();
	//createProgressBox();

	//
	// Public methods. 
	//

	/**
	 * Render the widget's internal elements to reflect their states.
	 *   Adds/removes entries from the list-box.
	 *
	 * Note: render() is called in onchange/change events, this.clear, and when
	 * "field type" property is set (e.g. page load or "field type" is set).
	 * 
	 * @returns {undefined}
	 */
	this.render = function() {
		// Remove all existing entries in the file list; empty the table tbody.
		if (table.tBodies.length > 0) {
			table.removeChild(table.tBodies[0]);
		}
		var tBody = table.appendChild(document.createElement("tbody"));
		
		// For genie, show the error message in the list.
		if( error.length > 0 && context === "genie" ) {
			errorElem.innerHTML = error;
		}
		
		// For each File, add a row into the table list.
		for (var i = 0; i < selectors.length; i++) {
			var name = selectors[i].name + (" (" + formatBytes(selectors[i].size, 2) + ")");
			var row = tBody.insertRow(-1);
			row.className = "row";
			if (i % 2 === 0) {
				row.className += " even";
			} else {
				row.className += " odd";
			}
			var col = row.insertCell(-1);
			col.className = "name-col";
			col.title = name;
			col.appendChild(document.createTextNode(name));

			// Indicate success for the file.
			if( selectors[i].done ) {
				col = row.insertCell(-1);
				col.className = "status-col";
				var txt = document.createTextNode(pui["getLanguageText"]("runtimeText","upload finished text"));
				col.appendChild(txt);
			}
		}
		// end foreach filename.
	};
	//end of render().

	/**************************************************************************/
	// Property change handlers. Called upon property change, page load, or 
	// explicitly inside the object.
	this.setAutoSubmit = function(autosub) {
		autoSubmit = (autosub === true || autosub === "true");
	};

	this.setFileLimit = function(newLimit) {
		if (newLimit !== null && !isNaN(newLimit)) {
			fileLimit = newLimit;
		}
	};
	this.setSizeLimit = function(newLimit) {
		if (newLimit !== null && !isNaN(newLimit)) {
			sizeLimit = newLimit;
		}
	};

	this.setTargetDirectory = function(value) {
		if (typeof(value) === "string") {
			targetDirectory = value;
			if (targetDirectory.length > 1 && targetDirectory.charAt(targetDirectory.length - 1) === "/") {
				targetDirectory = targetDirectory.substr(0, targetDirectory.length - 1);
			}
		}
	};
	this.setAltName = function(value) {
		if (typeof(value) === "string") {
			altName = value;
		}
	};
	this.setDisabled = function(state) {
		disabled = (state === "true" || state === true);
	};
	this.setOverwrite = function(value) {
		if (value === "true" || value === true) {
			overwrite = value;
		}
	};
	this.setUploadEvent = function(value) {
		uploadEvent = value;
	};
	this.setAllowedTypes = function(types) {
		if (types && types.constructor && types.constructor.toString().indexOf("function Array") !== -1) {
			allowedTypes = types;
		}
	};

	/**************************************************************************/
	//
	// Property fetching methods.
	//

	// Return the targetDirectory.
	this.getTargetDirectory = function() {
		return targetDirectory;
	};

	// Returns an array containing names from selected File objects.
	this.getFileNames = function() {
		var names = [];
		for (var i = 0; i < selectors.length; i++) {
			names.push(selectors[i].name);
		}
		return names;
	};

	/**
	 * Return the number of files dragged into the widget ready for upload.
	 * 
	 * @returns {Number}
	 */
	this.getCount = function() {
		return selectors.length;
	};

	// Return whether 
	this.isSubmitting = function() {
		return (submitHandle !== null);
	};
	this.getError = function() {
		return error;
	};
	this.getId = function() {
		return mainBox.id;
	};
	//
	// These two validation methods must exist because render.js calls them.
	// They aren't used anywhere else in this file, because validation happens
	// on drop instead of on page submit.
	//
	this.validateCount = function() {
		if (this.getCount() > fileLimit) {
			return pui["getLanguageText"]("runtimeMsg", "upload file limit", [fileLimit]);
		}
	};

	this.validateNames = function() {
		var arr = this.getFileNames();
		var used = {};
		for (var i = 0; i < arr.length; i++) {
			if (typeof(used[arr[i]]) !== "undefined") {
				return pui["getLanguageText"]("runtimeMsg", "upload duplicate file");
			}
			used[arr[i]] = true;
		}
	};

	/**
	 * this.upload() is called by pui.processUpload() after user clicked a
	 * bound button. If we dropped in files prior to the click, then the
	 * filenames should still be with us. So pui.checkUploads() will send our
	 * data back to the RPG program.
	 * 
	 * @returns {undefined}
	 */
	this.upload = function() {
		// Nothing needs to happen.
		return;
	};
	// end upload().

	/**
	 * Handle a completed upload. Clear the timeout.
	 * Populate this.error, if necessary.
	 * 
	 * Note: this declaration no longer needs to be this["completeTransaction"]
	 * because it is only called by this widget code, not some external AJAX 
	 * javascript.
	 * 
	 * @param {type} id
	 * @param {Object} responseObj  An object parsed by xhronload().
	 * @returns {undefined}
	 */
	this.completeTransaction = function(id, responseObj) {
		// Quit if no current submit or if transaction id is not current.
		// This indicates completion of transaction that has already been aborted. 
		if (submitHandle === null || id !== transactionId) {
			return;
		}
		clearTimeout(submitHandle);
		abortLink.style.visibility = "hidden";

		if (!responseObj["success"]) {
			if (responseObj["key"]) {
				responseObj["error"] = pui["getLanguageText"]("runtimeMsg", "upload " + responseObj["key"]);
			}
			error = responseObj["error"];
			if (responseObj["key"] === "file limit")
				error = error.replace("&1", fileLimit);
			if (responseObj["key"] === "size limit")
				error = error.replace("&1", sizeLimit);
			
			// Show the error. for non auto-submit widgets, nothing else will
			// cause the error to appear.
			if (context !== "genie" && ! autoSubmit ) {
				showError(error);
			}
		}
		else //success.
		{
			// Mark all selectors as done.
			for(var i=0; i < selectors.length; i++) {
				selectors[i].done = true;
			}
		}
		
		// Redraw so the table shows success next to each file; otherwise error.
		me.render();
		clearLink.style.display = ""; // show the Clear link.
		
		submitHandle = null;
		transactionId++;
		if (context === "genie") {
			pui.genie.formSubmitted = false;
			pui.hideWaitAnimation(true);
			// Finish here for Genie. 
			// For Rich UI, the result is checked in the 
			// main screen submit processing.
			if (responseObj["success"]) {
				this.doUploadEvent();
			} else {
				showError(responseObj["error"]);
			}
		} else if( autoSubmit ) {
			pui.keyName = "Enter";
			pui.click();
		}
	};
	// end completeTransaction().


	/**
	 * Handle ther user-defined code from the onupload property.
	 * Genie only.
	 */
	this.doUploadEvent = function() {
		if (uploadEvent && uploadEvent.length > 0) {
			var obj = {};
			obj["dir"] = this.getTargetDirectory();
			obj["names"] = this.getFileNames();
			var func = function() {
				eval("var info = arguments[0];");
				try {
					var func2 = eval(uploadEvent);
					if (typeof(func2) === "function") {
						func2(arguments[0]);
					}
				} catch (e) {
					showError("onupload Error:\n" + e.message);
				}
			};
			func(obj);
		}
	}; // end doUploadEvent().

	/***************************************************************************
	 *
	 * API methods.
	 */

	/**
	 * Remove all selectors and render the widget.
	 * Note: called from this.clearFiles().
	 * @returns {undefined}
	 */
	this["clear"] = function() {
		if (submitHandle === null && !disabled) {
			while (selectors.length > 0) {
				selectors.pop();
			}

			// Remove a validationTip that this widget added. If pui added it,
			// then we can't find it.
			if (validationTip !== null) {
				validationTip.hide();
				validationTip = null;
			}

			clearLink.style.display = "none"; // hide the Clear link .
			error = "";
			if( context === "genie" ) errorElem.style.display = "none";
			progressBar.value = 0;
			this.render();
		}
	};

	/***************************************************************************
	 *
	 * Private methods.
	 */

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
		e.stopPropagation();	// The event only applies to dropBox.
		e.preventDefault();		// prevent the default dragover on dropBox.
		if (disabled || submitHandle !== null || inDesignMode()) return false;
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
		e.stopPropagation();
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
		e.stopPropagation();
		e.preventDefault();
		
		if (disabled || submitHandle !== null || (context === "genie" && pui.genie.formSubmitted) || inDesignMode() ) return;
		
		if( e.dataTransfer.files === null || e.dataTransfer.files === undefined ) {
			console.log("Browser doesn't support dataTransfer.files API");
			return;
		}
		pui.removeCssClass(this, "dragover");

		// In each drop event, clear the validation hint, since files 
		// causing it to appear were blocked from being added.
		if (validationTip !== null) {
			validationTip.hide();
			validationTip = null;
		}
		
		// Remove all selectors.
		while (selectors.length > 0) {
			selectors.pop();
		}
		
		// Remove previous error.
		error = "";
		if( context === "genie") errorElem.style.display = "none";
		var hadError = false;

		// Look at each dropped file.
		for (var i = 0; i < e.dataTransfer.files.length; i++) {
			
			// Fix MIME type. PUI uses image/jpg whereas a browser may use image/jpeg.
			var ftypeTmp = e.dataTransfer.files[i].type.replace(/image\/jpeg/i, "image/jpg");

			// If there is nothing in allowedTypes[], allow the file.
			// If the file's type was in allowedTypes[], allow it.
			var allowedT = (allowedTypes.length <= 0 || allowedTypes.indexOf(ftypeTmp) >= 0);

			// Only add the file to our list if it passes our parameter checks.

			// Don't add if the MIME type is not accepted, or if the
			// file was a directory. Browsers prevent JS from selecting
			// files not explicitly chosen by the user, so we can't read
			// everything in a directory. Ignore them for now.
			if (!allowedT || isDirectory(e.dataTransfer.files[i])) {
				hadError = true;
				showError(pui["runtimeMsg"]["en_US"]["upload invalid type"]);
			}
			// Don't add if file is larger than limit.
			else if (e.dataTransfer.files[i].size > sizeLimit * 1048576) {
				hadError = true;
				showError(pui["getLanguageText"]("runtimeMsg", "upload size limit", [sizeLimit]));
			}
			// Don't add if we have passed the limit of files.
			else if (selectors.length >= fileLimit) {
				hadError = true;
				showError(pui["getLanguageText"]("runtimeMsg", "upload file limit", [fileLimit]));
			}
			// Don't add empty files.
			else if (e.dataTransfer.files[i].size <= 0) {
				hadError = true;
				console.log("Ignoring empty file: " + e.dataTransfer.files[i].name);
			}
			// Otherwise, add the file to our list.
			else {
				selectors.push(e.dataTransfer.files[i]);
			}
		}
		// done looking at each dropped file.
		
		// Remove all files if any one failed validation. This prevents upload.
		if( hadError ) {
			while( selectors.length > 0 ) selectors.pop();
		}
		
		// Redraw table to show chosen files.
		me.render();
		
		// Hide the clear link when uploading.
		clearLink.style.display = "none";

		// See if any files were valid.
		if (selectors.length > 0 ) {
			submitHandle = {}; // Will be set to timeout value later.
			
			if (context === "genie") {
				pui.genie.formSubmitted = true;
				pui.showWaitAnimation();
			}

			// Setup the URL for the XMLHTTPRequest to POST.
			var postURL = postAction + "?AUTH=";
			if (pui["appJob"] && pui["appJob"]["auth"]) {
				postURL += encodeURIComponent(pui["appJob"]["auth"]);
			}
			postURL += "&trans=" + encodeURIComponent(transactionId);
			postURL += "&id=" + encodeURIComponent(mainBox.id);

			// Use FormData object here instead of HTML form elements.
			// XHR accepts FormData objects, and we aren't using a form.
			var formData = new FormData();
			formData.append('flimit', fileLimit);
			formData.append('slimit', sizeLimit);
			formData.append('dir', targetDirectory);
			formData.append('altname', altName);
			formData.append('overwrite', (overwrite ? "1" : "0"));
			// For each file in our list, put it into the FormData object.
			for (var i = 0; i < selectors.length; i++) {
				formData.append('file', selectors[i]);
			}

			// Note: we can skip sending the MIME type since we validated it
			// in the ondrop function already. (Simplifies handling jpg/jpeg.)

			// Set a timer function to run if the transaction fails to complete.
			// We won't use the XHR ontimeout event because that only works for
			// asynchronous requests, and ours is synchronous.
			// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
			submitHandle = setTimeout(function() {
				me.completeTransaction(transactionId, {
					"success": false,
					"error": pui["getLanguageText"]("runtimeMsg", "upload timeout")
				});
			}, timeout);

			xhr = new XMLHttpRequest();
			xhr.open('POST', postURL);

			// Define how to handle progress events.
			if ("upload" in xhr) {
				xhr.upload.onprogress = xhronprogress;
			}

			// Define what to do when upload is complete.
			xhr.onload = xhronload;
			
			// Define how to handle abort.
			xhr.onabort = xhronabort;

			// Start the XHR post.
			abortLink.style.visibility = "visible";
			xhr.send(formData);
		} // done handling files were selected.
	}
	// end boxdrop();
	
	/**
	 * Handler for xhr.onload event; i.e. the XMLHttpRequest finished.
	 * @param {type} e
	 * @returns {undefined}
	 */
	function xhronload(e) {
		progressBar.value = 100;
		var responseObj;
		var respTransId = transactionId;
		/* The CGI returns an HTML page for the old uploader, but we
		 * only need the JavaScript embedded in that page. So extract it.
		 * It wants to call completeTransaction() on our widget.
		 */
		if (xhr.responseText.search(/completeTransaction\((\d),(\{[^\}]+\})\)/i) >= 0) {
			respTransId = parseInt(RegExp.$1, 10);
			responseObj = RegExp.$2.replace(/'/g, "\""); // Single-quoted strings throw exceptions.
			responseObj = JSON.parse(responseObj);
		} else {
			responseObj = {
				"success": false,
				"error": pui["getLanguageText"]("runtimeMsg", "upload invalid response")
			};
		}

		me.completeTransaction(respTransId, responseObj);
	}
	//end xhronload();
	
	/**
	 * Handler for xhr.onprogress event.
	 * @param {type} event
	 * @returns {undefined}
	 */
	function xhronprogress(event) {
		if (event.lengthComputable) {
			var complete = (event.loaded / event.total * 100 | 0);
			progressBar.value = complete;
		}
	}
	
	/**
	 * Handler for xhr.onabort event.
	 * @param {type} e
	 * @returns {undefined}
	 */
	function xhronabort(e) {
		progressBar.value = 0;
		var responseObj = {"success": false, "error": pui["getLanguageText"]("runtimeMsg", "upload cancelled")};
		me.completeTransaction(transactionId, responseObj);
	}

	//**************************************************************************
	// Methods to create boxes for inside the widget.
	//
	
	/**
	 * Create a dropBox for accepting dragged files.
	 * @returns {undefined}
	 */
	function createDropBox() {
		dropBox = document.createElement("div");
		dropBox.className = "drop-box";
		var str = pui["getLanguageText"]("runtimeText", "upload drophere text");
		var txtnd = document.createTextNode(str);
		dropBox.appendChild(txtnd);

		// Event Handlers for dropBox.
		dropBox.addEventListener("dragover", boxdragover );
		dropBox.addEventListener("dragleave", boxdragleave );
		dropBox.addEventListener("drop", boxdrop );
		
		mainBox.appendChild(dropBox);
	}
	// end createDropBox().

	/**
	 * Create a control box to hold the control links. The links will appear
	 * after a file is dropped when auto-upload is false; or in Genie.
	 * 
	 * @returns {undefined}
	 */
	function createControlBox() {
		controlBox = document.createElement("div");
		controlBox.className = "control-box";
		
		clearLink = document.createElement("a");
		clearLink.className = "clear-files";
		clearLink.style.display = "none";
		clearLink.appendChild(document.createTextNode(pui["getLanguageText"]("runtimeText", "upload clear text")));
		if (clearLink.attachEvent) {
			clearLink.attachEvent("onclick", clearFiles);
		} else if (clearLink.addEventListener) {
			clearLink.addEventListener("click", clearFiles, false);
		}
		controlBox.appendChild(clearLink);

		// Create a progress tag.
		progressBar = document.createElement("progress");
		progressBar.id = "progbar_" + mainBox.id;
		progressBar.max = 100;
		progressBar.value = 0;
		controlBox.appendChild(progressBar);
		
		// Create an abort link.
		abortLink = document.createElement("a");
		abortLink.className = "abort-upload";
		abortLink.appendChild(document.createTextNode("[x]"));
		abortLink.style.visibility = "hidden";

		if( abortLink.attachEvent ) // for IE10.
			abortLink.attachEvent("onclick", abortUpload);
		else if( abortLink.addEventListener)
			abortLink.addEventListener("click", abortUpload);
		controlBox.appendChild(abortLink);
		
		if( context === "genie" ) {
			errorElem = document.createElement("p");
			errorElem.className = "error";
			errorElem.style.display = "none";
			controlBox.appendChild(errorElem);
		}

		mainBox.appendChild(controlBox);
	}
	// end createControlBox().

	function createListBox() {
		listBox = document.createElement("div");
		listBox.className = "list-box";
		table = document.createElement("table");
		table.className = "list";
		listBox.appendChild(table);
		mainBox.appendChild(listBox);
	}

	/**
	 * Show the error message somewhere on screen. Genie and DSPF present the
	 * message differently.
	 * 
	 * @param {String} message
	 * @returns {undefined}
	 */
	function showError(message) {
		if (context === "genie") {
			errorElem.style.display = "";
			errorElem.innerHTML = message;
		} else {
			if (validationTip !== null)
				validationTip.hide();
			validationTip = new pui.ValidationTip(mainBox);
			validationTip.setMessage(message);
			validationTip.show();
		}
	}

	/**
	 * Handler for the "Clear" link onclick in the control-box.
	 * 
	 * @param {type} e
	 * @returns {Boolean}
	 */
	function clearFiles(e) {
		e = e || window.event;
		me["clear"]();
		e.cancelBubble = true;
		e.returnValue = false;
		if (e.preventDefault)
			e.preventDefault();
		if (e.stopPropagation)
			e.stopPropagation();
		return false;
	}
	
	/**
	 * Handler for the "[x]" abort link in the control box.
	 * @param {type} e
	 * @returns {Boolean}
	 */
	function abortUpload(e) {
		e.preventDefault();
		e.stopPropagation();
		if( xhr && xhr.abort ) {
			xhr.abort();
		}
		
		return false;
	}//end abortUpload().

	/**
	 * Helper function to format the file size.
	 * @param {type} bytes
	 * @param {type} precision
	 * @returns {String}
	 */
	function formatBytes(bytes, precision) {
		var units = ["B", "KB", "MB", "GB", "TB"];
		bytes = Math.max(bytes, 0);
		var pow = Math.floor((bytes ? Math.log(bytes) : 0) / Math.log(1024));
		pow = Math.min(pow, units.length - 1);
		bytes = bytes / Math.pow(1024, pow);
		precision = (typeof(precision) === "number" ? precision : 0);
		return (Math.round(bytes * Math.pow(10, precision)) / Math.pow(10, precision)) + " " + units[pow];
	}

	/**
	 * Returns true if the indicated file is a directory.
	 * Directories appear as 0 or 4096 byte files with an empty MIME type.
	 * @param {File} file
	 * @returns {Boolean}
	 */
	function isDirectory(file) {
		return (file && file.type.length <= 0 && (file.size % 4096) === 0);
	}
};
// end of pui["fileUpload"].FileUpload().


/******************************************************************************/
// Note: The functions pui.processUpload() and pui.checkUploads() are defined in file_upload.js.


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
			 * dom["fileUpload"] is a property of our mainBox, not of window.pui.
			 * runtime/dspf/render.js requires a "fileUpload" property, so we must use the exact string.
			 * pui["fileUpload"] is the old file_upload widget, so we use a
			 * different string on window.pui to avoid overwriting the other widget's class.
			 * 
			 * .dom["fileUpload"] is undefined on a new page load or after pui.submitReponse();
			 * i.e. in RichUI when screen/record-format changes.
			 */
			if (parms.dom["fileUpload"] === undefined) {
				parms.dom["fileUpload"] = new pui["fileUploadDND"].FileUpload(parms.dom);

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
			if( ! pui["fileUploadDND"].myPreventDefAdded ) {
				window.addEventListener("dragover", pui["fileUploadDND"].myPreventDef, false);
				window.addEventListener("drop", pui["fileUploadDND"].myPreventDef, false);
				pui["fileUploadDND"].myPreventDefAdded = true;
			}
		},
		//end field type.

		"auto submit": function(parms) {
			if (parms.design)
				return;
			parms.dom["fileUpload"].setAutoSubmit(parms.value);
		},
		"number of files": function(parms) {
			if (parms.design)
				return;
			parms.dom["fileUpload"].setFileLimit(parseInt(parms.value, 10));
		},
		"size limit": function(parms) {
			if (parms.design)
				return;
			parms.dom["fileUpload"].setSizeLimit(parseInt(parms.value, 10));
		},
		"target directory": function(parms) {
			if (parms.design)
				return;
			parms.dom["fileUpload"].setTargetDirectory(trim(parms.value));
		},
		"rename to": function(parms) {
			if (parms.design)
				return;
			parms.dom["fileUpload"].setAltName(trim(parms.value));
		},
		"overwrite files": function(parms) {
			if (parms.design)
				return;
			parms.dom["fileUpload"].setOverwrite(parms.value);
		},
		"onupload": function(parms) {
			if (parms.design)
				return;
			parms.dom["fileUpload"].setUploadEvent(parms.newValue);
		},
		// Only called when property is set or removed.
		"disabled": function(parms) {
			if (parms.design)
				return;
			parms.dom["fileUpload"].setDisabled(parms.value);
		}
	}
}); //end of call to pui.widgets.add().

/*
	Prevent a dropped file from becoming the new page.
	http://stackoverflow.com/questions/6756583/prevent-browser-from-loading-a-drag-and-dropped-file
	Required for Firefox, Chrome, and IE11, IE10, .
*/
pui["fileUploadDND"].myPreventDef = function(e) {
	e = e || event;
	e.preventDefault();
};
// Flag to avoid adding redundant window listeners.
pui["fileUploadDND"].myPreventDefAdded = false;

