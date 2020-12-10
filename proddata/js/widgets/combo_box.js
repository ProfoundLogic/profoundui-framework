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
  
  var me = this;
  var box;
  this._box = null;
  
  var arrow;
  var choicesDiv;
  this._choicesDiv = null;
  
  var spacerDiv = null;
  this["showChoices"] = function() {
    showChoices();
  };

  this.init = function() {
    if (me.div == null) {
      me.div = document.createElement("div");
      if (me.container != null) me.container.appendChild(me.div);
      me.div.style.position = "absolute";
      me.div.style.top = "100px";
      me.div.style.left = "100px";
 
    }
  
    //When adding a combo box in design mode, a dotted border is hardcoded in Designer.js
    // as an inline style. Clearing the border allows css classes to be used
    if(me.design) me.div.style.border = "";
    if (me.div.style.width == null) me.div.style.width = "80px";
    if (context == "genie" && (me.div.style.height == null || me.div.style.height == "")) 
      me.div.style.height = "20px";
    if (pui["is_quirksmode"]) {
      if (pui["is_old_ie"]) me.div.style.height = "22px";
      else me.div.style.height = "19px";
    }
    
    if (me._box == null) {
      me._box = document.createElement("input");
      me.div.appendChild(me._box);
      box = me._box;
    }

    box.type = "text";
    // Default off if not set by 'html auto complete' property.
    if (box.getAttribute("autocomplete") == null && (context != "genie" || !pui.genie.config.browserAutoComplete)) {
      box.setAttribute("autocomplete", "off");
      if (context == "dspf")
        box.setAttribute("name", pui.randomTextBoxName());
    }
    
    box.style.fontFamily = me.div.style.fontFamily;  
    if (typeof me.div.name == "string")
      box.name = me.div.name;
    if (me.design) {
      box.style.cursor = "default";
      box.readOnly = true;
    }
    
    if (arrow == null) {
      arrow = document.createElement("div");
      me.div.appendChild(arrow);
      
      arrow.addEventListener('mousedown', me);
      arrow.addEventListener('mouseup', me);
    }
    arrow.className = "combo-arrow";
    arrow.combo = true;
    
    var win;
    var prt = me.div.parentNode;
    while (prt) {
    
      if (prt.isPUIWindow) {
      
        win = prt;
        break;
      
      }
    
      prt = prt.parentNode;
    
    }

    if (me._choicesDiv == null) {
      me._choicesDiv = document.createElement("div");
      choicesDiv = me._choicesDiv;    //todo: move "choicesDiv" references from closure into this._choicesDiv and test.
      choicesDiv.className = "combo-options";
      if (context == "dspf" && inDesignMode()) {
        toolbar.designer.container.appendChild(choicesDiv);
      }
      else {
        if (win) {
          win.appendChild(choicesDiv);
        }
        else {
          pui.runtimeContainer.appendChild(choicesDiv);
        } 
      }
      addEvent(document, "click", function(e) {
        
        var target = getTarget(e);
        if (target != arrow)
          me['hideChoices']();
        
      });
    }
    choicesDiv.style.display = "none";
    choicesDiv.className = "combo-options";
    me.setClass(me.div.className.split(" ")[1]);
    
  };

  this.draw = function() {
    var boxWidth = 0;  
    var comWidth = me.div.style.width;	//get the width of the combo box
    var newWidth = me.div.offsetWidth; //get the width in pixels
    var arrowWidth = arrow.offsetWidth + 3;
    
    if (comWidth[comWidth.length - 1] === "%") {	//if the last character of the width is a % sign
      boxWidth = (1 - (arrowWidth / newWidth)) * 100; //find the percent width for input box
      if (isNaN(boxWidth) || boxWidth < 0) boxWidth = 0;  //if the width is not a number or < 0 -- width = 1 
      box.style.width = boxWidth + "%";  //the new width + the % sign
      box.style.zIndex = -1; // Disable input box to overlaps dropdown button of comboBoxWidget
    }
    else{    //if the width of the combo box does not end in a % sign
      boxWidth = parseInt(comWidth) - arrowWidth ;  //get the number of the width - width of arrow div (arrowWidth)
      if (isNaN(boxWidth) || boxWidth < 0) boxWidth = 0;  //if the width is not a number or < 0 -- width = 1 
      box.style.width = boxWidth + "px";  //the new width + "px" 
    }
  };
  
  this.setValue = function(value) {
    box.value = value;    
    pui.checkEmptyText(box);
  };

  this.getValue = function() {
    return box.value;
  };
  
  this.setReadOnly = function(isReadOnly) {
    box.readOnly = isReadOnly;
  };

  this.setDisabled = function(isDisabled) {
    box.disabled = isDisabled;
  };

  this.setMaxLength = function(maxLength) {
    box.maxLength = maxLength;
  };
  
  this.setBoxAttribute = function(attr, value) {
    box.setAttribute(attr, value);
  };
  
  this.setClass = function(className) {
    box.className = "combo-main-box " + className.split(" ")[0];
    pui.addCssClass(choicesDiv, box.className.split(" ")[1] + "-combo-options");
    pui.addCssClass(arrow, box.className.split(" ")[1] + "-combo-arrow");
    if(spacerDiv != null) {
      pui.addCssClass(spacerDiv, box.className.split(" ")[1] + "-combo-spacer");
    }
  };
  
  this.assignJSEvent = function(jsEventName, func) {
    // re-assign event to the box and remove it from the main div element of the combo box
    box[jsEventName] = func;
    if (me.div[jsEventName] != null) {
      me.div[jsEventName] = function() {};
    }
  };

  this.clear = function() {
    me["choices"] = [];
    me["choice values"] = [];
    box.value = "";
    pui.checkEmptyText(box);
  };
  
  this.getBox = function() {
    return me._box;
  };
  
  this.setFocus = function() {  
    me._box.focus();
  };

  function setChoicesPos() {
  
    var top = me.div.offsetTop;
    var left = me.div.offsetLeft;
    
    var prt = me.div.parentNode;
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
    
      if (me.div.parentNode["layerInfo"]) {
      
        top += me.div.parentNode.offsetTop + me.div.parentNode.clientTop;
        left += me.div.parentNode.offsetLeft + me.div.parentNode.clientLeft;
      
      }
    
    }
    
    // Shift down by height of widget div. 
    top += me.div.offsetHeight;
    
    choicesDiv.style.top = top + "px";
    choicesDiv.style.left = left + "px";
  
  }

  function showChoices() {
    
    if (typeof(me.div["onoptiondisplay"]) == "function") {
      me.div["onoptiondisplay"]();
    }
    
    choicesDiv.innerHTML = "";
    choicesDiv.style.display = "";
    if (me["choices"].length > 5 || me["choices"].length == 0) {
      choicesDiv.style.height = "";
    }
    else {
      choicesDiv.style.height = "auto";
    }
    
    setChoicesPos();
    var minWidth = parseInt(me.div.style.width);
    if (pui["is_old_ie"] && me["choices"].length > 5) minWidth = minWidth - 22;
    if (minWidth < 20) minWidth = 20;

    spacerDiv = document.createElement("div");
    spacerDiv.className = "combo-spacer";
    spacerDiv.style.width = minWidth + "px";
    choicesDiv.appendChild(spacerDiv);

    for (var i = 0; i < me["choices"].length; i++) {
      var optDiv = document.createElement("div");
      optDiv.innerHTML = me["choices"][i] + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
      optDiv.choiceValue = me["choice values"][i];
      if (optDiv.choiceValue == null) optDiv.choiceValue =  me["choices"][i];
      optDiv.choiceText =  me["choices"][i];
	  optDiv.className = "combo-option";
      optDiv.addEventListener('click', me);
      optDiv.addEventListener('mousedown', me);
      optDiv.addEventListener('mouseover', me);
      optDiv.addEventListener('mouseout', me);
      choicesDiv.appendChild(optDiv);
    }
    var top = parseInt(choicesDiv.style.top, 10);

    if (me["select box placement"] === "above") {
      choicesDiv.style.top = top - me.div.offsetHeight - choicesDiv.offsetHeight + "px";
    } else if (me["select box placement"] !== "below") {
      var scrollTop = pui.getWindowScrollTop();
      if (top - scrollTop + choicesDiv.offsetHeight > pui["getWindowSize"]()["height"]) {
        var newTop = top - choicesDiv.offsetHeight - box.offsetHeight - 3;
        if (newTop - scrollTop >= 0) top = newTop;
      }
      choicesDiv.style.top = top + "px";    
    }
  }
  
};

/**
 * Set the ComboBox input element's CSS style. Fix any problem characters.
 * @param {String} propertyName
 * @param {String} propertyValue
 */
pui.ComboBoxWidget.prototype.setStyleProperty = function(propertyName, propertyValue) {
  var words = propertyName.split(" ");
  if (words.length == 2) words[1] = words[1].substr(0,1).toUpperCase() + words[1].substr(1);
  var styleName = words.join("");

  if (propertyName == "text transform" && propertyValue == "uppercase"){
    this._box.value = pui.replaceProblemCaseChars(this._box.value, false);  //Prevent German eszett from becoming "SS". lower-case eszett becomes capital eszett.
  }

  this._box.style[styleName] = propertyValue;
  this._choicesDiv.style[styleName] = propertyValue;  //Let the choices DIVs match the style in the the input box. #6490.
};

/**
 * 
 */
pui.ComboBoxWidget.prototype['hideChoices'] = function() {
  this._choicesDiv.innerHTML = "";
  this._choicesDiv.style.display = "none";
};

/**
 * Handle any events when the listener is "this".
 * @param {Event} e
 */
pui.ComboBoxWidget.prototype['handleEvent'] = function(e){
  switch (e.type){
    case 'click':
      this._optionClick(e);
      break;
    case 'mousedown':
      // Handles the arrow and the option div.
      preventEvent(e);
      break;
    case 'mouseup':
      // Mouseup on the Arrow element.
      if (this._choicesDiv.style.display == 'none' && !this._box.disabled) this['showChoices']();
      else this['hideChoices']();
      preventEvent(e);      
      break;
      
    // Set the class name of the option elements. CSS rules for these were changed to use :hover, but customers may still use the old class.
    case 'mouseover':
      e.target.classList.add('combo-option-select');
      break;
    case 'mouseout':
      e.target.classList.remove('combo-option-select');
      break;
  }
};

/**
 * Handle the user clicking on an option DIV element.
 * @param {MouseEvent} e
 */
pui.ComboBoxWidget.prototype._optionClick = function(e){
  var target = getTarget(e);
  if (!this._box.readOnly && !this.design) {
    this._box.value = target.choiceValue;
    this._box.modified = true;
    this.div.modified = true;
    pui.updateReactState(this.div);
    if (this.formatName != null && pui.ctlRecModified != null) {
      pui.ctlRecModified[this.formatName] = true;
    }
    if (context == "genie" && this._box.fieldInfo != null && this._box.fieldInfo["idx"] != null) {
      pui.response[this._box.fieldInfo["idx"]] = this._box;
    }

    var tip = this._box.validationTip;
    if (tip != null) {
      tip.hide();
      tip.doneShowing = true;
      pui.removeCssClass(this._box, tip.getInvalidClass());
    }
    pui.checkEmptyText(this._box);
  }
  this['hideChoices']();
  if (!pui["is_touch"] || pui["is_mouse_capable"]) this.setFocus();
  if (this.div.selectEvent != null && !this._box.readOnly && !this.design) {
    this.div.selectEvent(this._box.value, target.choiceText, this.div);
  }
  preventEvent(e);
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
      var width = parms.evalProperty("width");
      parms.dom.comboBoxWidget.oldDom = parms.oldDom;
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
        var attr = parms.dom.fieldInfo.attr;
        cls += " A" + attr;
        if (parms.dom.fieldInfo.bypass) {
           var nonDisplay = (attr == "27" || attr == "2F" || attr == "37" || attr == "3F");
          cls += (nonDisplay) ? " hide" : " readOnly";
        }
        cls = trim(cls);
      }
      parms.dom.className = "combo-main " + trim(cls);
      parms.dom.comboBoxWidget.init();
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
          if (context == "genie") ajaxRequest["postData"] = "AUTH=" + GENIE_AUTH;
          if (context == "dspf") ajaxRequest["postData"] = "AUTH=" + pui.appJob.auth;
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
    },

    "select box placement": function(parms) {
      try {
        if (!parms.design && parms.dom.comboBoxWidget != null) 
          parms.dom.comboBoxWidget["select box placement"] = parms.value;
      }
      catch(e) { }
    }

  },
  
  globalPropertySetter: function(parms) {    
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
        parms.dom.comboBoxWidget.setStyleProperty(parms.propertyName, parms.value);
        break;
    }
  },
  
  afterSetters: {
  
    "tab index": function(parms) {
    
      parms.dom.removeAttribute("tabindex");
      parms.dom.comboBoxWidget.getBox().setAttribute("tabindex", parms.value);
    
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






