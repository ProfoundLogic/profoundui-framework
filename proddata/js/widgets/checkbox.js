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



pui.widgets.add({
  name: "checkbox",
  tag: "input",
  inputType: "checkbox",
  labelProperty: "label",
  resizable: false,
  defaults: {
    label: "Checkbox"
  },

  propertySetters: {
  
    "field type": function(parms) {
      var objValue = parms.evalProperty("value");
      var checkedValue = parms.evalProperty("checked value");
      parms.dom.checkedValue = checkedValue;
      if (!pui["is_quirksmode"]) {
        if (!pui["is_old_ie"]) {
          parms.dom.style.margin = "2px";
        }
      }
      if (context == "genie" && parms.dom.originallyChecked != null && parms.properties["value"] == null && parms.properties["checked value"] == null) {
        parms.dom.checked = parms.dom.originallyChecked;
      }
      else {
        if (objValue == checkedValue) parms.dom.checked = true;
        else parms.dom.checked = false;
      }
      if (!parms.design) {
        var uncheckedValue = parms.evalProperty("unchecked value");
        parms.dom.uncheckedValue = uncheckedValue;
        checkboxObjects.push(parms.dom);
        var labelText = parms.evalProperty("label");
        if (labelText != "") buildLabel(parms.dom, labelText);
        if (context == "dspf") {
          addEvent(parms.dom, "click", function() {
            if (parms.dom.readOnly) {
              if (parms.dom.checked == false) parms.dom.checked = true;
              else if (parms.dom.checked == true) parms.dom.checked = false;
            }
          });
        }
      }
      // Fixes printing problem for IE8. 
      // -- DR.
      pui.fixCheckPrint(parms.dom);      
    },
    
    "value": function(parms) {
      var checkedValue = parms.evalProperty("checked value");
      parms.dom.checkedValue = checkedValue;
      if (parms.value == checkedValue) parms.dom.checked = true;
      else parms.dom.checked = false;    
      // Fixes printing problem for IE8. 
      // -- DR.
      pui.fixCheckPrint(parms.dom);        
    },
    
    "checked value": function(parms) {
      var objValue = parms.evalProperty("value");
      var checkedValue = parms.value;
      parms.dom.checkedValue = checkedValue;
      if (objValue == checkedValue) parms.dom.checked = true;
      else parms.dom.checked = false;
      // Fixes printing problem for IE8. 
      // -- DR.
      pui.fixCheckPrint(parms.dom);        
    },
    "visibility": function(parms) {
      
      if (!parms.design && parms.dom.labelObj) {
      
        if (parms.value == "hidden") {
        
          parms.dom.labelObj.style.visibility = "hidden";
        
        }
        else {
        
          parms.dom.labelObj.style.visibility = "";
        
        }
      
      }
    }    
  }

});

