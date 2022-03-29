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
 * Combo Box Class
 * @constructor
 */

pui.ComboBoxWidget = function() {

  this.container = null;
  this.div = null;
  this.oldDom = null;
  this.design = false;
  this["choices"] = [];
  this["choice values"]= [];  
  this["select box placement"] = "";
  
  this.box = null;         //the input box.
  this._arrow = null;       //the down/up arrow.
  this._choicesDiv = null;  //the container for the choices.
};
pui.ComboBoxWidget.prototype = Object.create(pui.BaseClass.prototype);

/**
 * Initialize the ComboBox elements. Called once when the "field type" property is set.
 */
pui.ComboBoxWidget.prototype.init = function() {
  
  if (this.div == null) {
    this.div = document.createElement("div");
    if (this.container != null) this.container.appendChild(this.div);
    this.div.style.position = "absolute";
    this.div.style.top = "100px";
    this.div.style.left = "100px";

  }

  //When adding a combo box in design mode, a dotted border is hardcoded in Designer.js
  // as an inline style. Clearing the border allows css classes to be used
  if (this.design) this.div.style.border = "";
  if (this.div.style.width == null) this.div.style.width = "80px";
  if (context == "genie" && (this.div.style.height == null || this.div.style.height == "")) 
    this.div.style.height = "20px";

  if (this.box == null) {
    this.box = document.createElement("input");
    this.div.appendChild(this.box);
  }

  this.box.type = "text";
  // Default off if not set by 'html auto complete' property.
  if (this.box.getAttribute("autocomplete") == null && (context != "genie" || !pui.genie.config.browserAutoComplete)) {
    this.box.setAttribute("autocomplete", "off");
    if (context == "dspf")
      this.box.setAttribute("name", pui.randomTextBoxName());
  }

  this.box.style.fontFamily = this.div.style.fontFamily;
  if (typeof this.div.name == "string")
    this.box.name = this.div.name;
  if (this.design) {
    this.box.style.cursor = "default";
    this.box.readOnly = true;
  }

  this.box.addEventListener("keyup", this);

  if (this._arrow == null) {
    this._arrow = document.createElement("div");
    this.div.appendChild(this._arrow);

    this._arrow.addEventListener('mousedown', this);
    this._arrow.addEventListener('mouseup', this);
  }
  this._arrow.className = "combo-arrow";
  this._arrow.combo = true;

  var win;
  var prt = this.div.parentNode;
  while (prt) {

    if (prt.isPUIWindow) {

      win = prt;
      break;

    }

    prt = prt.parentNode;

  }

  if (this._choicesDiv == null) {
    this._choicesDiv = document.createElement("div");
    this._choicesDiv.className = "combo-options";
    if (context == "dspf" && inDesignMode()) {
      toolbar.designer.container.appendChild(this._choicesDiv);
    }
    else {
      if (win) {
        win.appendChild(this._choicesDiv);
      }
      else {
        pui.runtimeContainer.appendChild(this._choicesDiv);
      } 
    }
  }
  this._choicesDiv.style.display = "none";
  this._choicesDiv.className = "combo-options";
  this.setClass(this.div.className.split(" ")[1]);

  pui.widgetsToCleanup.push(this);  //Causes destroy to be called when record format or screen changes; ensure listeners are removed. #7139.
};

/**
 * Set the widths and z-index of the input box. Called in "field type" and "width" property setters; can be called in doDetectSubfilePatterns.
 */
pui.ComboBoxWidget.prototype.draw = function() {
  var boxWidth = 0;  
  var comWidth = this.div.style.width;	//get the width of the combo box
  var newWidth = this.div.offsetWidth; //get the width in pixels
  var arrowWidth = parseInt(getComputedStyle(this._arrow).width) + 3;

  if (comWidth[comWidth.length - 1] === "%") {	//if the last character of the width is a % sign
    boxWidth = (1 - (arrowWidth / newWidth)) * 100; //find the percent width for input box
    if (isNaN(boxWidth) || boxWidth < 0) boxWidth = 0;  //if the width is not a number or < 0 -- width = 1 
    this.box.style.width = boxWidth + "%";  //the new width + the % sign
    this.box.style.zIndex = -1; // Disable input box to overlaps dropdown button of comboBoxWidget
  }
  else {    //if the width of the combo box does not end in a % sign
    boxWidth = parseInt(comWidth) - arrowWidth ;  //get the number of the width - width of arrow div (arrowWidth)
    if (isNaN(boxWidth) || boxWidth < 0) boxWidth = 0;  //if the width is not a number or < 0 -- width = 1 
    this.box.style.width = boxWidth + "px";  //the new width + "px" 
  }
};

pui.ComboBoxWidget.prototype.setValue = function(value) {
  this.box.value = value;    
  pui.checkEmptyText(this.box);
};

pui.ComboBoxWidget.prototype.getValue = function() {
  return this.box.value;
};

pui.ComboBoxWidget.prototype.setReadOnly = function(isReadOnly) {
  this.box.readOnly = isReadOnly;
};

pui.ComboBoxWidget.prototype.setDisabled = function(isDisabled) {
  this.box.disabled = isDisabled;
};

pui.ComboBoxWidget.prototype.setMaxLength = function(maxLength) {
  this.box.maxLength = maxLength;
};

pui.ComboBoxWidget.prototype.setBoxAttribute = function(attr, value) {
  this.box.setAttribute(attr, value);
};

pui.ComboBoxWidget.prototype.setClass = function(className) {
  this.box.className = "combo-main-box " + className.split(" ")[0];
  pui.addCssClass(this._choicesDiv, this.box.className.split(" ")[1] + "-combo-options");
  pui.addCssClass(this._arrow, this.box.className.split(" ")[1] + "-combo-arrow");
};

pui.ComboBoxWidget.prototype.assignJSEvent = function(jsEventName, func) {
  // re-assign event to the box and remove it from the main div element of the combo box
  this.box[jsEventName] = func;
  if (this.div[jsEventName] != null) {
    this.div[jsEventName] = function() {};
  }
};

/**
 * Clear choices and choice values. Used in the "field type" property setter.
 */
pui.ComboBoxWidget.prototype.clear = function() {
  this["choices"] = [];
  this["choice values"] = [];
  this.box.value = "";
  pui.checkEmptyText(this.box);
};

/**
 * Returns the input box; used in several property setters and in pui.floatPlaceholder.
 * @returns {Element}
 */
pui.ComboBoxWidget.prototype.getBox = function() {
  return this.box;
};

/**
 * Show the choices drop-down when the arrow was clicked or the "showChoices" API method was called.
 */
pui.ComboBoxWidget.prototype['showChoices'] = function() {
  var choicesDiv = this._choicesDiv; 

  // Change arrow when opened
  if (this._arrow.className.split(" ")[0] != "open"){
    this._arrow.className = "open combo-arrow " + this.box.className.split(" ")[1] + "-combo-arrow";
  }

  if (typeof(this.div["onoptiondisplay"]) == "function") this.div["onoptiondisplay"]();
  
  choicesDiv.innerHTML = "";
  choicesDiv.style.display = "";
  if (this["choices"].length > 5 || this["choices"].length == 0) {
    // The default height set in CSS is 110px, so let CSS determine the height with 0 or > 5 elements.
    choicesDiv.style.height = "";
  }
  else {
    // With fewer than 6 elements, override the CSS height of 110px with just enough space for the elements.
    choicesDiv.style.height = "auto";
  }

  //
  // Set the position of the choices box.
  //
  var top = this.div.offsetTop;
  var left = this.div.offsetLeft;

  var prt = this.div.parentNode;
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

    if (this.div.parentNode["layerInfo"]) {

      top += this.div.parentNode.offsetTop + this.div.parentNode.clientTop;
      left += this.div.parentNode.offsetLeft + this.div.parentNode.clientLeft;

    }

  }

  // Shift down by height of widget div. 
  top += this.div.offsetHeight;

  choicesDiv.style.top = top + "px";
  choicesDiv.style.left = left + "px";
    
  //
  // Add an DIV for each choice/value.
  //
  for (var i=0, n=this["choices"].length; i < n; i++){
    var optDiv = document.createElement("div");
    optDiv.innerHTML = this["choices"][i];
    optDiv.choiceValue = this["choice values"][i];
    if (optDiv.choiceValue == null) optDiv.choiceValue = this["choices"][i];
    optDiv.choiceText =  this["choices"][i];
    optDiv.className = "combo-option";
    optDiv.addEventListener('click', this);
    optDiv.addEventListener('mousedown', this);
    optDiv.addEventListener('mouseover', this);
    optDiv.addEventListener('mouseout', this);
    choicesDiv.appendChild(optDiv);
  }
  
  //
  // Set the choice options width so that the right border aligns with the combo box.
  //
  var minWidth = this.div.offsetWidth;
  if (minWidth < 20 && /\d+px$/.test(this.div.style.width)) minWidth = parseInt(this.div.style.width);  //Fallback to parsing the style.
  
  // The scrollbar overlay or position is browser-specific; width must be adjusted for some browsers. #7160.
  choicesDiv.classList.remove('padr20');
  if (choicesDiv.scrollHeight > choicesDiv.offsetHeight){
    // There is a scrollbar.
    
    // Compensate for browser variations. #7160.
    // IE11 places scrollbars outside the element when setting width via min-width.
    if (pui['is_ie']) minWidth -= 17;
    // Firefox overlays the scrollbar on the DIV. If any option text is longer than the combo width, fix how the scrollbar covers it.
    else if (pui['is_firefox']) choicesDiv.classList.add('padr');
  }
  // Note: use min-width (not width) so that combo options can automatically expand further right if needed.
  if (minWidth < 20) minWidth = 20;
  choicesDiv.style.minWidth = minWidth + 'px';
  
  //
  // Place the choices DIV above or below the combo-box depending on the placement property.
  //
  top = parseInt(choicesDiv.style.top, 10);
  if (this["select box placement"] === "above") {
    choicesDiv.style.top = top - this.div.offsetHeight - choicesDiv.offsetHeight + "px";
  }
  else if (this["select box placement"] !== "below") {
    var scrollTop = pui.getWindowScrollTop();
    if (top - scrollTop + choicesDiv.offsetHeight > pui["getWindowSize"]()["height"]) {
      // If there is not enough room on the page below the combo-box, then place the options above it.
      var newTop = top - choicesDiv.offsetHeight - this.box.offsetHeight - 3;
      if (newTop - scrollTop >= 0) top = newTop;
    }
    choicesDiv.style.top = top + "px";    
  }
  
  // When the choices are visible, then add document listeners to hide them on scroll or click. 
  // These are cleaned up in destroy and when the choices are hidden.
  document.addEventListener('click', this);
  document.addEventListener('scroll', this, true);  //Listen for all scroll events on the page when the choices are visible. #7139.
};

/**
 * Set the ComboBox input element's CSS style. Fix any problem characters.
 * Called internally and by Designer.
 * @param {String} propertyName
 * @param {String} propertyValue
 */
pui.ComboBoxWidget.prototype.setStyleProperty = function(propertyName, propertyValue) {
  var words = propertyName.split(" ");
  if (words.length == 2) words[1] = words[1].substr(0,1).toUpperCase() + words[1].substr(1);
  var styleName = words.join("");

  if (propertyName == "text transform" && propertyValue == "uppercase"){
    this.box.value = pui.replaceProblemCaseChars(this.box.value, false);  //Prevent German eszett from becoming "SS". lower-case eszett becomes capital eszett.
  }

  this.box.style[styleName] = propertyValue;
  this._choicesDiv.style[styleName] = propertyValue;  //Let the choices DIVs match the style in the the input box. #6490.
};

/**
 * 
 */
pui.ComboBoxWidget.prototype['hideChoices'] = function() {
  //change arrow when closed
  if(this._arrow != null && this._arrow.className.split(" ")[0] == "open"){
    this._arrow.className = "combo-arrow " + this.box.className.split(" ")[1] + "-combo-arrow";
  }
  this._choicesDiv.innerHTML = "";
  this._choicesDiv.style.display = "none";
  this._removeHideListeners();
};

/**
 * Remove document listeners for scroll or click when the option list is hidden or on destroy. Removing makes debugging easier
 * when many elements exist and avoids a memory leak and accumulation of unnecessary click listeners.
 */
pui.ComboBoxWidget.prototype._removeHideListeners = function(){
  document.removeEventListener('scroll', this, true);
  document.removeEventListener('click', this);
};

/**
 * Handle any events when the listener is "this".
 * @param {Event} e
 */
pui.ComboBoxWidget.prototype['handleEvent'] = function(e){
  var target = e.target;
  switch (e.type){
    case 'click':
      // Click fired on a choice option or the document.
      
      if (target && target.parentNode == this._choicesDiv){
        // The user clicked on an option on this combo-box.
        
        if (!this.box.readOnly && !this.design) {
          this.box.value = target.choiceValue;
          this.box.modified = true;
          this.div.modified = true;
          pui.updateReactState(this.div);
          if (this.formatName != null && pui.ctlRecModified != null) {
            pui.ctlRecModified[this.formatName] = true;
          }
          if (context == "genie" && this.box.fieldInfo != null && this.box.fieldInfo["idx"] != null) {
            pui.response[this.box.fieldInfo["idx"]] = this.box;
          }

          var tip = this.box.validationTip;
          if (tip != null) {
            tip.hide();
            tip.doneShowing = true;
            pui.removeCssClass(this.box, tip.getInvalidClass());
          }
          pui.checkEmptyText(this.box);
        }
        this['hideChoices']();
        if (!pui["is_touch"] || pui["is_mouse_capable"]) this.box.focus();
        if (this.div.selectEvent != null && !this.box.readOnly && !this.design) {
          this.div.selectEvent(this.box.value, target.choiceText, this.div);
        }
        preventEvent(e);

      }
      else if (target != this._arrow){
        // The click was on the document anywhere but this arrow.
         this['hideChoices']();
      }
      break;
      
    case 'keyup':
      // Keyup fired on the input box.
      var keyCode = e.keyCode;
      
      if (this._choicesDiv.style.display === "none" || this.box.readOnly || this.box.disabled) {
        return;
      }

      // Check for printable character being typed. 
      if ((keyCode == 8) || (keyCode >= 46 && keyCode <= 90) || (keyCode >= 96 && keyCode <= 111) || (keyCode >= 186 && keyCode <= 222) || keyCode === 32) {
        // A printable character was typed, so hide any the combo options
        var search = this.box.value.toLowerCase();
        
        var optDivs = this._choicesDiv.getElementsByClassName("combo-option");
        for (var i=0, n=optDivs.length, optDiv; i < n && (optDiv = optDivs[i]); i++) {
          if (search) {
            var text = getInnerText(optDiv).trim().toLowerCase();
            optDiv.style.display = text.indexOf(search) >= 0 ? "" : "none";
          }
          else {
            optDiv.style.display = "";
          }
        }
      }
      break;
      
    case 'mousedown':
      // Handles the arrow and the option div.
      preventEvent(e);
      break;
    case 'mouseup':
      // Mouseup on the Arrow element.
      if (this._choicesDiv.style.display == 'none' && !this.box.disabled) this['showChoices']();
      else this['hideChoices']();
      preventEvent(e);      
      break;
      
    // Set the class name of the option elements. CSS rules for these were changed to use :hover, but customers may still use the old class.
    case 'mouseover':
      target.classList.add('combo-option-select');
      break;
    case 'mouseout':
      target.classList.remove('combo-option-select');
      break;

    case 'scroll':
      // If anywhere on the page containing this combo-box scrolls, then hide the options on-scroll to avoid the elements separating. #7139.
      // (Anywhere except the choicesDiv, which may have many elements; e.g. WRKACTJOB choices.)
      // Note: no need to throttle this scroll-linked code with timeouts, because the listener is quickly removed upon scroll.
      if (target != this._choicesDiv) this['hideChoices']();
      break;
  }
};


/**
 * Ensure that document listeners do not persist after this object is gone.
 */
pui.ComboBoxWidget.prototype.destroy = function(){
  this._removeHideListeners();
  this.deleteOwnProperties();
};

/**
 * Global property setter. The propertySetters code would be simpler if all the non "field type" properties were handled by this class.
 * @param {Object} parms
 */
pui.ComboBoxWidget.prototype.setProperty = function(parms){
  switch (parms.propertyName) {
    case "color":          
    case "font family":    
    case "font size":      
    case "font style":     
    case "font variant":   
    case "font weight":    
    case "letter spacing": 
    case "text align":     
    case "text decoration":
    case "text transform": 
    case "word spacing":   
    case "background color":   
      this.setStyleProperty(parms.propertyName, parms.value);
      break;
      
    case "select box placement": 
      if (!parms.design) this["select box placement"] = parms.value;
      break;
  }
};







pui.widgets.add({
  name: "combo box",
  defaults: {
    "width": "80px",
    "css class": "input",
    "font family": "Trebuchet MS"
  },

  propertySetters: {
  
    "field type": function(parms) {
      if (parms.dom.comboBoxWidget == null) {
        parms.dom.comboBoxWidget = new pui.ComboBoxWidget();
      }
      parms.dom.comboBoxWidget.div = parms.dom;
      parms.dom.comboBoxWidget.design = parms.design;
      parms.dom.comboBoxWidget.oldDom = parms.oldDom;
      
      // Fetch each "css class" property value so they can be added to the main DOM element.
      var base = "css class";
      var suffix = "";
      var cls = "";
      while (typeof parms.properties[base + suffix] == "string") {
        
        if (cls != "")
          cls += " ";
        cls += parms.properties[base + suffix];
        
        if (suffix == "")
          suffix = " 2";
        else 
          suffix = " " + (parseInt(suffix, 10) + 1);
        
      }
      if (cls === "" && parms.dom.fieldInfo) {
        var attr = parms.dom.fieldInfo["attr"];
        cls += " A" + attr;
        if (parms.dom.fieldInfo.bypass) {
           var nonDisplay = (attr == "27" || attr == "2F" || attr == "37" || attr == "3F");
          cls += (nonDisplay) ? " hide" : " readOnly";
        }
        cls = trim(cls);
      }
      parms.dom.className = "combo-main " + trim(cls);
      
      parms.dom.comboBoxWidget.init();
      
      var width = parms.evalProperty("width");
      if (width != null && width != "") {
        parms.dom.style.width = width;
      }
      parms.dom.comboBoxWidget.draw();
        
      // Use program, if given.
      var url = parms.evalProperty("choices url");
      if (url != "" && !parms.design) {
      	
      	var req = new pui.Ajax(pui.appendAuth(url));
      	req["async"] = true;
      	req["suppressAlert"] = true;
      	req["onready"] = function() {
      	  parms.dom.comboBoxWidget.clear();
          var response = checkAjaxResponse(req, "Generate Combo Box Options");        	  
      	  if (!response) return;
          var opts = response;
          for (var i = 0; i < opts.length; i++) {
            var opt = opts[i];
            if (opt != null && opt.nodeType != "OPTION" && opt.text != null && opt.value != null){
              opt = new Option(opt.text, opt.value);  //Option data can be JSON object; make into DOM element. Issue 4900.
            }
            parms.dom.comboBoxWidget["choices"].push(opt.text);
            parms.dom.comboBoxWidget["choice values"].push(opt.value);
          }
          parms.dom.comboBoxWidget.setValue(parms.evalProperty("value"));
      	};
        parms.dom.comboBoxWidget.clear();
        parms.dom.comboBoxWidget.setValue(pui["getLanguageText"]("runtimeMsg", "loading"));
      	req.send();
      	return;
      }
      
      // Use database file settings, if given.
      if (parms.evalProperty("choices database file") != "") {
        if (!parms.design) {
          var maxChoices    = parms.evalProperty("max choices");
          var file          = parms.evalProperty("choices database file");
          var textFields    = pui.getFieldList(parms.evalProperty("choice options field")); 
          var valueField    = parms.evalProperty("choice values field");
          if (valueField   == null || valueField == "") valueField = textFields[0];
          var whereClause   = parms.evalProperty("choices selection criteria");
          var orderByFields = pui.getFieldList(parms.evalProperty("order by"));
          
          if (orderByFields[0] != "") {
          
            for (var i = 0; i < orderByFields.length; i++) {
            
              var fld = orderByFields[i];
              if (pui.arrayIndexOf(textFields, fld) == -1) {
              
                textFields.push(fld);
              
              }
            
            }
          
          }
          
          // Value field must always be second for backend SQL programs to work properly.
          var fieldList = textFields[0] + ", " + valueField;
          textFields.splice(0, 1);
          if (textFields.length > 0) {
          
            fieldList += ", " + textFields.join();
          
          }          
          
          var sql = "SELECT DISTINCT " + fieldList + " FROM " + file;
          if (whereClause && whereClause != "") {
            sql += " WHERE " + whereClause;
          }
          if (orderByFields[0] != "") {
            sql += " ORDER BY " + orderByFields.join();
          }
          
          var url = getProgramURL("PUI0009103.PGM");
          var ajaxRequest = new pui.Ajax(url);
          ajaxRequest["method"] = "post";
          ajaxRequest["async"] = true;
          ajaxRequest["suppressAlert"] = true;
          if (pui.pjs_session_id) ajaxRequest["postData"] = "AUTH=" + pui.pjs_session_id;
          else ajaxRequest["postData"] = "AUTH=" + pui.appJob.auth;
          if (pui["secLevel"] > 0) {
          
            ajaxRequest["postData"] += "&q=" + encodeURIComponent(pui.getSQLVarName(parms.dom));
            
            var pstring = pui.getSQLParams(parms.properties);
            if (pstring != "") {
            
              ajaxRequest["postData"] += "&" + pstring;
            
            }          
          
          }
          else {
          
            ajaxRequest["postData"] += "&q=" + pui.aes.encryptString(sql);
           
          }

          if (pui["isCloud"]) {
            ajaxRequest["postData"] += "&workspace_id=" + pui.cloud.ws.id;
          }

          if (maxChoices != null && maxChoices != "") {
          	ajaxRequest["postData"] += "&maxcount=" + encodeURIComponent(maxChoices);
          }
          if( pui["read db driven data as ebcdic"] !== true ) ajaxRequest["postData"] += "&UTF8=Y";

          ajaxRequest["onsuccess"] = function() {
          	              	
            var eventCode = parms.evalProperty("ondbload");
            if (typeof eventCode != "string" || eventCode == "") eventCode = null;
            
          	var response = checkAjaxResponse(ajaxRequest, "Generate Dropdown Box Options");
          	parms.dom.comboBoxWidget.clear();
          	if (!response) {
              if (eventCode) pui.executeDatabaseLoadEvent(eventCode, false, parms.dom.id); 
          	  return;              	
          	}
            
            if (parms.properties["blank option"] == "true") {
              var blankOptionLabel = parms.evalProperty("blank option label");
              if (blankOptionLabel == null) blankOptionLabel = "";
              parms.dom.comboBoxWidget["choices"].push(blankOptionLabel);
              parms.dom.comboBoxWidget["choice values"].push("");
            } 
            var opts = response;
            for (var i = 0; i < opts.length; i++) {
              var opt = opts[i];
              if (opt != null && opt.nodeType != "OPTION" && opt.text != null && opt.value != null){
                opt = new Option(opt.text, opt.value);  //Option can be JSON object; make into DOM element. Issue 4900.
              }
              parms.dom.comboBoxWidget["choices"].push(opt.text);
              parms.dom.comboBoxWidget["choice values"].push(opt.value);
            }               
            parms.dom.comboBoxWidget.setValue(parms.evalProperty("value"));
            if (eventCode) pui.executeDatabaseLoadEvent(eventCode, true, parms.dom.id); 
        };
          parms.dom.comboBoxWidget.clear();
          parms.dom.comboBoxWidget.setValue(pui["getLanguageText"]("runtimeMsg", "loading"));
          ajaxRequest.send();
        }
        return;
      }
      
      parms.dom.comboBoxWidget.setValue(parms.evalProperty("value"));
      if (parms.design && parms.properties["choices"]) {
        
        var nmodel = getPropertiesNamedModel();
        var propConfig = nmodel["choices"];
        applyPropertyToField(
          propConfig,
          parms.properties,
          parms.designItem.dom,
          parms.properties["choices"], 
          true, 
          parms.designItem
        );    
        
      }
      return;

    },





    "choices": function(parms) {
      if (parms.dom.comboBoxWidget != null) {      
        parms.dom.comboBoxWidget["choices"] = pui.parseCommaSeparatedList(parms.value);
      }
    },
    
    "choice values": function(parms) {
      if (parms.dom.comboBoxWidget != null) {
        parms.dom.comboBoxWidget["choice values"] = pui.parseCommaSeparatedList(parms.value);
      }
    },
    
    "value": function(parms) {
      if (parms.dom.comboBoxWidget != null) {
        parms.dom.comboBoxWidget.setValue(parms.value);
      }
    },
    
    "read only": function(parms) {      
      if (parms.dom.comboBoxWidget != null && !parms.design) {
        if (parms.value == true || parms.value == "true") {
          parms.dom.comboBoxWidget.setReadOnly(true);
        }
        else {
          parms.dom.comboBoxWidget.setReadOnly(false);
        }
      }
    },
    
    "disabled": function(parms) {      
      if (parms.dom.comboBoxWidget != null && !parms.design) {
        if (parms.value == true || parms.value == "true") {
          parms.dom.comboBoxWidget.setDisabled(true);
        }
        else {
          parms.dom.comboBoxWidget.setDisabled(false);
        }
      }
    },
    
    "css class": function(parms) {
      if (parms.dom.comboBoxWidget != null) {
        parms.dom.comboBoxWidget.setClass(parms.value);
      }
    },
    
    "width": function(parms) {
      if (parms.dom.comboBoxWidget != null) {
        parms.dom.style.width = parms.value;
        parms.dom.comboBoxWidget.draw();
      }
    },
    
    "onselect": function(parms) {
      parms.dom.selectEvent = function() {
        if (pui.isRoutine(parms.properties["onselect"])) {
          pui["runLogic"](parms.properties["onselect"]["routine"], parms.dom.subfileRow, parms.dom.subfileName);
          return;
        }
        eval("var value = arguments[0];");
        eval("var text = arguments[1];");
        eval("var object = arguments[2];");
        try {
          eval(parms.value);
        }
        catch(err) {
          pui.scriptError(err, "Onselect Error:\n" + err.message);        
        }
      };
    },

    "input type": function(parms) {
      try {
        if (!parms.design && parms.dom.comboBoxWidget != null) 
          parms.dom.comboBoxWidget.getBox().setAttribute("type", parms.value);
      }
      catch(e) { }
    },
    
    "browser auto complete": function(parms) {
      if (!parms.design && parms.dom.comboBoxWidget != null) {
        parms.dom.comboBoxWidget.getBox().setAttribute("autocomplete", parms.value);
        if (context == "dspf") {
          if (parms.value == "off")
            parms.dom.comboBoxWidget.getBox().setAttribute("name", pui.randomTextBoxName());
          else
            parms.dom.comboBoxWidget.getBox().removeAttribute("name");
        }
      }
    }

  },
  
  globalPropertySetter: function(parms) {
    if (parms.dom && parms.dom.comboBoxWidget && typeof parms.dom.comboBoxWidget.setProperty === 'function'){
      parms.dom.comboBoxWidget.setProperty(parms);
    }
  },
  
  afterSetters: {
  
    "tab index": function(parms) {
    
      parms.dom.removeAttribute("tabindex");
      parms.dom.comboBoxWidget.getBox().setAttribute("tabindex", parms.value);
    
    },

    "placeholder": function(parms) {

      parms.dom.removeAttribute("placeholder");
      parms.dom.comboBoxWidget.getBox().setAttribute("placeholder", parms.value);

    }
    
  },
  globalAfterSetter: function(parms) {
    if (parms.propertyName.substr(0, 9) == "css class") {
      if (parms.dom.className.indexOf("combo-main") == -1) {
        parms.dom.className = "combo-main " + parms.dom.className;
      }
    }
  }

  
});






