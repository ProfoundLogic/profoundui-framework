
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
  
  var me = this;
  var box;
  var arrow;
  var choicesDiv;
  var cellDiv;
  var gridDiv;

  this.init = function() {
    if (me.div == null) {
      me.div = document.createElement("div");
      if (me.container != null) me.container.appendChild(me.div);
      me.div.style.position = "absolute";      
      me.div.style.top = "100px";      
      me.div.style.left = "100px";
    }
    
    me.div.style.backgroundColor = "#ffffff";
    me.div.style.overflow = "hidden";
    me.div.style.border = "1px solid #7f9db9";
    if (me.div.style.width == null) me.div.style.width = "80px";
    me.div.style.height = "20px";
    if (quirksMode) {
      if (is_ie) me.div.style.height = "22px";
      else me.div.style.height = "19px";
    }
    
    if (box == null) {
      box = document.createElement("input");
      me.div.appendChild(box);
    }

    box.type = "text";
    box.setAttribute("autocomplete", "off");
    box.style.position = "absolute";
    box.style.border = "0px none";
    box.style.top = "0px";
    box.style.left = "1px";
    box.style.paddingTop = "1px";
    box.style.fontFamily = "Trebuchet MS";
    box.style.fontWeight = "normal";
    box.style.outline = "none";
    box.className = "input";
    if (me.oldDom != null && me.oldDom.tagName == "INPUT") {
      box.className = me.oldDom.className;
    }
    me.div.className = "input";
    box.name = me.div.name;
    if (me.design) {
      box.style.cursor = "default";
      box.readOnly = true;
    }
    
    if (arrow == null) {
      arrow = document.createElement("img");
      me.div.appendChild(arrow);
    }
    arrow.src = pui.normalizeURL("/profoundui/proddata/images/combo/down_arrow.gif");
    arrow.style.position = "absolute";
    arrow.style.top = "0px";
    arrow.style.right = "0px";
    arrow.style.width = "18px";
    arrow.style.height = "20px";
    arrow.onclick = function(e) {
      if (choicesDiv.style.display == "none" && !box.disabled) showChoices();
      else hideChoices();      
      preventEvent(e);
    }    

    if (choicesDiv == null) {
      choicesDiv = document.createElement("div");
      var parent = me.div.parentNode;
      if (!me.design && parent.parentNode.grid != null) {
        cellDiv = parent;
        gridDiv = cellDiv.parentNode;
        parent = gridDiv.parentNode;
      }
      parent.appendChild(choicesDiv);      
      addEvent(document, "click", hideChoices);
    }
    choicesDiv.style.display = "none";
    choicesDiv.style.position = "absolute";
    choicesDiv.style.overflowX = "hidden";
    choicesDiv.style.overflowY = "auto";
    choicesDiv.style.height = "110px";
    choicesDiv.style.backgroundColor = "#EAF2FB";
    choicesDiv.style.border = "1px solid #A4BED4";
    choicesDiv.style.zIndex = 130;    
  }

  this.draw = function() {
    var boxWidth = parseInt(me.div.style.width) - 21;
    if (isNaN(boxWidth) || boxWidth < 0) boxWidth = 0;    
    box.style.width = boxWidth + "px";
  }
  
  this.setStyleProperty = function(propertyName, propertyValue) {
    var words = propertyName.split(" ");
    if (words.length == 2) words[1] = words[1].substr(0,1).toUpperCase() + words[1].substr(1);
    var styleName = words.join("")
    box.style[styleName] = propertyValue;  
  }
  
  this.setValue = function(value) {
    box.value = value;    
  }

  this.getValue = function() {
    return box.value;
  }
  
  this.setReadOnly = function(isReadOnly) {
    box.readOnly = isReadOnly;
  }

  this.setDisabled = function(isDisabled) {
    box.disabled = isDisabled;
  }

  this.setMaxLength = function(maxLength) {
    box.maxLength = maxLength;
  }
  
  this.setBoxAttribute = function(attr, value) {
    box.setAttribute(attr, value);
  }
  
  this.setClass = function(className) {
    box.className = className;
  }
  
  this.assignJSEvent = function(jsEventName, func) {
    // re-assign event to the box and remove it from the main div element of the combo box
    box[jsEventName] = func;
    if (me.div[jsEventName] != null) {
      me.div[jsEventName] = function() {};
    }
  }

  this.clear = function() {
    me["choices"] = [];
    me["choice values"] = [];
    box.value = "";
  }
  
  this.getBox = function() {
    return box;
  }
  
  this.setFocus = function() {  
    box.focus();
  }

  function hideChoices() {
    choicesDiv.innerHTML = "";
    choicesDiv.style.display = "none";
  }

  function showChoices() {
    choicesDiv.innerHTML = "";
    choicesDiv.style.display = "";
    choicesDiv.style.left = me.div.style.left;
    choicesDiv.style.top = (parseInt(me.div.style.top) + parseInt(me.div.style.height) + 1) + "px";
    if (gridDiv != null && cellDiv != null) {
      choicesDiv.style.left = (parseInt(choicesDiv.style.left) + parseInt(gridDiv.style.left) + parseInt(cellDiv.style.left)) + "px";
      choicesDiv.style.top = (parseInt(choicesDiv.style.top) + parseInt(gridDiv.style.top) + parseInt(cellDiv.style.top)) + "px";
    }        
    var minWidth = parseInt(me.div.style.width);
    if (is_ie && me["choices"].length > 5) minWidth = minWidth - 22;
    if (minWidth < 20) minWidth = 20;
    var spacerDiv = document.createElement("div");
    spacerDiv.style.width = minWidth + "px";
    spacerDiv.style.height = "0px";
    spacerDiv.style.fontSize = "0px";
    spacerDiv.style.padding = "0px";
    spacerDiv.style.margin = "0px";
    spacerDiv.style.border = "0px none";
    spacerDiv.style.cursor = "default";
    choicesDiv.appendChild(spacerDiv);
    for (var i = 0; i < me["choices"].length; i++) {
      var optDiv = document.createElement("div");
      optDiv.innerHTML = me["choices"][i] + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
      optDiv.style.whiteSpace = "nowrap";
      optDiv.choiceValue = me["choice values"][i];
      if (optDiv.choiceValue == null) optDiv.choiceValue =  me["choices"][i];
      optDiv.choiceText =  me["choices"][i];
      optDiv.style.overflow = "hidden";
      optDiv.style.fontFamily = box.style.fontFamily;
      optDiv.style.fontSize = "12px";
      optDiv.style.padding = "2px";
      optDiv.style.cursor = "default";
      optDiv.onmouseover = function(e) {
        var target = getTarget(e);
        target.style.backgroundImage = "url(" + pui.normalizeURL("/profoundui/proddata/images/combo/selection_background.gif") + ")";
        target.style.backgroundPosition = "center bottom";
        target.style.backgroundRepeat = "repeat-x";
      }
      optDiv.onmouseout = function(e) {
        var target = getTarget(e);
        target.style.backgroundImage = "";
      }
      optDiv.onmousedown = function(e) {
        preventEvent(e);
      }
      optDiv.onclick = function(e) {
        var target = getTarget(e);
        if (!box.readOnly && !me.design) {
          box.value = target.choiceValue;
          box.modified = true;
          me.div.modified = true;
          if (context == "genie" && box.fieldInfo != null && box.fieldInfo["idx"] != null) {
            pui.response[box.fieldInfo["idx"]] = box;
          }

          var tip = box.validationTip;
          if (tip != null) {
            tip.hide();
            tip.doneShowing = true;
            pui.removeCssClass(box, "invalid");
          }
          pui.checkEmptyText(box);
        }
        hideChoices();
        if (!pui.touchDevice) me.setFocus();
        if (me.div.selectEvent != null && !box.readOnly && !me.design) {
          me.div.selectEvent(box.value, target.choiceText, me.div);
        }
        preventEvent(e);
      }
      choicesDiv.appendChild(optDiv);
    }    
  }


}















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
      parms.dom.comboBoxWidget.init();
      if (width != null && width != "") {
        parms.dom.style.width = width;
      }
      parms.dom.comboBoxWidget.draw();
        
      // Use program, if given.
      var url = parms.evalProperty("choices url");
      if (url != "" && !parms.design) {
      	
      	var req = new pui.Ajax(url);
      	req["async"] = true;
      	req["suppressAlert"] = true;
      	req["onready"] = function() {
      	  parms.dom.comboBoxWidget.clear();
          var response = checkAjaxResponse(req, "Generate Combo Box Options");        	  
      	  if (!response) return;
          var opts = response;
          for (var i = 0; i < opts.length; i++) {
            var opt = opts[i];
            parms.dom.comboBoxWidget["choices"].push(opt.text);
            parms.dom.comboBoxWidget["choice values"].push(opt.value);
          }               
          parms.dom.comboBoxWidget.setValue(parms.evalProperty("value"));
      	}
        parms.dom.comboBoxWidget.clear();
        parms.dom.comboBoxWidget.setValue("Loading...");
      	req.send();
      	return;
      }
      
      // Use database file settings, if given.
      if (parms.evalProperty("choices database file") != "") {
        if (!parms.design) {
          var maxChoices  = parms.evalProperty("max choices");
          var file        = parms.evalProperty("choices database file");
          var textFields   = pui.getFieldList(parms.evalProperty("choice options field")); 
          var valueField  = parms.evalProperty("choice values field");
          if (valueField == null || valueField == "") valueField = textFields[0];
          var whereClause = parms.evalProperty("choices selection criteria");
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
          if (maxChoices != null && maxChoices != "") {
          	ajaxRequest["postData"] += "&maxcount=" + encodeURIComponent(maxChoices);
          }
          ajaxRequest["onsuccess"] = function() {
          	              	
          	var response = checkAjaxResponse(ajaxRequest, "Generate Dropdown Box Options");
          	parms.dom.comboBoxWidget.clear();
          	if (!response) return;              	
            
            if (parms.properties["blank option"] == "true") {
              var blankOptionLabel = parms.evalProperty("blank option label");
              if (blankOptionLabel == null) blankOptionLabel = "";
              parms.dom.comboBoxWidget["choices"].push(blankOptionLabel);
              parms.dom.comboBoxWidget["choice values"].push("");
            }
            var opts = response;
            for (var i = 0; i < opts.length; i++) {
              var opt = opts[i];
              parms.dom.comboBoxWidget["choices"].push(opt.text);
              parms.dom.comboBoxWidget["choice values"].push(opt.value);
            }               
            parms.dom.comboBoxWidget.setValue(parms.evalProperty("value"));
          }
          parms.dom.comboBoxWidget.clear();
          parms.dom.comboBoxWidget.setValue("Loading...");
          ajaxRequest.send();
        }
        return;
      }
      
      //parms.dom.comboBoxWidget["choices"] = parms.evalProperty("choices").split(",");
      //parms.dom.comboBoxWidget["choice values"] = parms.evalProperty("choice values").split(",");
      parms.dom.comboBoxWidget.setValue(parms.evalProperty("value"));
      return;

    },





    "choices": function(parms) {
      if (parms.dom.comboBoxWidget != null) {      
        var choices = parms.value;
        if (choices != null && choices != "") {
          parms.dom.comboBoxWidget["choices"] = choices.split(",");
        }
        else {
          parms.dom.comboBoxWidget["choices"] = [];
        }
      }
    },
    
    "choice values": function(parms) {
      if (parms.dom.comboBoxWidget != null) {
        var choiceValues = parms.value;
        if (choiceValues != null && choiceValues != "") {
          parms.dom.comboBoxWidget["choice values"] = choiceValues.split(",");
        }
        else {
          parms.dom.comboBoxWidget["choice values"] = [];
        }
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
        eval("var value = arguments[0];");
        eval("var text = arguments[1];");
        eval("var object = arguments[2];");
        try {
          eval(parms.value);
        }
        catch(err) {
          pui.alert("Onselect Error:\n" + err.message);        
        }
      }

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
        parms.dom.comboBoxWidget.setStyleProperty(parms.propertyName, parms.value)
        break;
    }
  }
  
});






