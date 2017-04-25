//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2017 Profound Logic Software, Inc.
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




pui.loadSelectBoxChoices = function(choicesString, choiceValuesString, dom) {

  var choices = pui.parseCommaSeparatedList(choicesString);
  var choiceValues = pui.parseCommaSeparatedList(choiceValuesString);

  dom.choices = {};
  for (var i = 0; i < choices.length; i++) {
    var optionText = choices[i];
    var optionValue = choiceValues[i];
    if (optionValue == null || choiceValuesString == "") optionValue = optionText;
    if (dom.tagName == "SELECT") {
      var option = new Option(optionText, optionValue);
      dom.options[dom.options.length] = option;
    }
    dom.choices[optionValue] = optionText;
  }  
}

pui.setSelectBoxValue = function(value, dom) {
  
  // If this is a numeric field in Genie, trim blanks...
  if (dom.fieldInfo != null && dom.fieldInfo.shift != null) {
    if (dom.fieldInfo.shift == '2' 
     || dom.fieldInfo.shift == '3'
     || dom.fieldInfo.shift == '5'
     || dom.fieldInfo.shift == '7') {
       value = trim(value);
       dom.pui.properties["value"] = value;
    }
  }
  
  if (dom.tagName == "INPUT") {  // read-only select box widgets do not get converted into dropdowns
    if (dom.choices != null && dom.choices[value] != null) {
      dom.value = dom.choices[value];
    }
    else {
      dom.value = value;
    }
    dom.pui.properties["value"] = value;
    return;
  }
  var multiple = false;
  if (dom.getAttribute("multiple") != null) multiple = true;
  if (!multiple) {
    dom.value = value;
    dom.pui.properties["value"] = value;
  }
  if (multiple) {
    var values = value.split(",");
    for (var i = 0; i < dom.options.length; i++) {
      var opt = dom.options[i];
      for (var j = 0; j < values.length; j++) {
        if (values[j] == opt.value) {
          opt.selected = true;
          break;
        }
      }
    }
  }
}


pui.widgets.add({
  name: "select box",
  tag: "select",
  menuName: ["Dropdown Box", "List Box"],

  propertySetters: {
  
    "field type": function(parms) {

      if (parms.dom.tagName == "SELECT") parms.dom.options.length = 0;
      parms.dom.choices = {};
      
      // Use program, if given.
      var url = parms.evalProperty("choices url");
      if (url != "" && !parms.design) {
      	
      	var req = new pui.Ajax(pui.appendAuth(url));
      	req["async"] = true;
      	req["suppressAlert"] = true;
      	req["onready"] = function() {
    	    if (parms.dom.tagName == "SELECT") parms.dom.options.length = 0;
    	    parms.dom.choices = {};
          var response = checkAjaxResponse(req, "Generate Dropdown Box Options");        	  
    	    if (!response) return;
          var opts = response;
          for (var i = 0; i < opts.length; i++) {
            if (parms.dom.tagName == "SELECT") {
              try {
                parms.dom.add(opts[i]);
              }
              catch(e) {
                parms.dom.add(opts[i], null);
              }
            }
            parms.dom.choices[opts[i].value] = opts[i].text;
          }
          pui.setSelectBoxValue(parms.evalProperty("value"), parms.dom);
        }
        if (parms.dom.tagName == "SELECT") {
          parms.dom.options.length = 0;
          parms.dom.options[0] = new Option(pui["getLanguageText"]("runtimeMsg", "loading"), "");
        }
      	req.send();
      	return;
      }
      
      // Use database file settings, if given.
      if (parms.evalProperty("choices database file") != "") {
        if (!parms.design) {
          var maxChoices  = parms.evalProperty("max choices");
          var file        = parms.evalProperty("choices database file");
          var textFields  = pui.getFieldList(parms.evalProperty("choice options field")); 
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
          ajaxRequest["postData"] += "&UTF8=Y";
          ajaxRequest["onsuccess"] = function() {

            var eventCode = parms.evalProperty("ondbload");
            if (typeof eventCode != "string" || eventCode == "") eventCode = null;
            
          	var response = checkAjaxResponse(ajaxRequest, "Generate Dropdown Box Options");
          	if (parms.dom.tagName == "SELECT") parms.dom.options.length = 0;
          	if (!response) {
          	  if (eventCode) pui.executeDatabaseLoadEvent(eventCode, false, parms.dom.id); 
          	  return;              	
          	}
            
            if (parms.properties["blank option"] == "true") {
              var blankOptionLabel = parms.evalProperty("blank option label");
              if (blankOptionLabel == null) blankOptionLabel = "";
              if (parms.dom.tagName == "SELECT") parms.dom.options[0] = new Option(blankOptionLabel, "");
            }
            var opts = response;            
            for (var i = 0; i < opts.length; i++) {
              if (parms.dom.tagName == "SELECT") {
                try {
                  parms.dom.add(opts[i]);
                }
                catch(e) {
                  parms.dom.add(opts[i], null);
                }
              }
              parms.dom.choices[opts[i].value] = opts[i].text;
            }               
            pui.setSelectBoxValue(parms.evalProperty("value"), parms.dom);
            if (eventCode) pui.executeDatabaseLoadEvent(eventCode, true, parms.dom.id); 
          }
          if (parms.dom.tagName == "SELECT") {
            parms.dom.options.length = 0;
            parms.dom.options[0] = new Option(pui["getLanguageText"]("runtimeMsg", "loading"), "");
          }
          ajaxRequest.send();
        }
        return;
      }
    
      var choicesString = parms.evalProperty("choices");
      var choiceValuesString = parms.evalProperty("choice values");
      pui.loadSelectBoxChoices(choicesString, choiceValuesString, parms.dom);
      pui.setSelectBoxValue(parms.evalProperty("value"), parms.dom);
    },
    
    "value": function(parms) {
      pui.setSelectBoxValue(parms.value, parms.dom);
    },
    
    "choices": function(parms) {
    
      // Can't have this happening at the same time as other population options.
      // Causes timing/order of events issues if you call 'get()' while Ajax calls
      // are in progress.
      var db = parms.evalProperty("choices database file");
      var url = parms.evalProperty("choices url");
      
      if (db != "" || url != "") {
      
        return;
        
      } 
    
      if (parms.dom.tagName == "SELECT") parms.dom.options.length = 0;
      var choicesString = parms.value; 
      var choiceValuesString = parms.evalProperty("choice values");
      pui.loadSelectBoxChoices(choicesString, choiceValuesString, parms.dom);
      pui.setSelectBoxValue(parms.evalProperty("value"), parms.dom);
    },

    "choice values": function(parms) {
    
      // Can't have this happening at the same time as other population options.
      // Causes timing/order of events issues if you call 'get()' while Ajax calls
      // are in progress.
      var db = parms.evalProperty("choices database file");
      var url = parms.evalProperty("choices url");
      
      if (db != "" || url != "") {
      
        return;
        
      }    
    
      if (parms.dom.tagName == "SELECT") parms.dom.options.length = 0;
      var choicesString = parms.evalProperty("choices");
      var choiceValuesString = parms.value; 
      pui.loadSelectBoxChoices(choicesString, choiceValuesString, parms.dom);
      pui.setSelectBoxValue(parms.evalProperty("value"), parms.dom);
    },
    
    "select box height": function(parms) {
      // Process change in select box height for IE6 -- list boxes show normally, but dropdowns show as textboxes in design mode  
      if (parms.design && pui["is_old_ie"] && pui["ie_mode"] == 6) {
        var nmodel = getPropertiesNamedModel();
        applyPropertyToField(nmodel["field type"], parms.properties, parms.dom, "select box", parms.design, parms.designItem, parms.resizer);
      }
    }

  }

});



