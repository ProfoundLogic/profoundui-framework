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



pui.widgets.add({
  name: "radio button",
  tag: "input",
  inputType: "radio",
  labelProperty: "label",
  resizable: false,
  defaults: {
    label: "Radio Button"
  },
  
  propertySetters: {
  
    "field type": function(parms) {
      if (parms.design && !pui["is_quirksmode"]) {
        if (!pui["is_old_ie"]) {
          parms.dom.style.margin = "2px";
        }
      }
      if (!parms.design) {
        var labelText = parms.evalProperty("label");
        if (labelText != "") {
          if (parms.properties["left"] != null) parms.dom.style.left = parms.properties["left"];
          if (parms.properties["top"] != null) parms.dom.style.top = parms.properties["top"]; 
          buildLabel(parms.dom, labelText);
        }
        if (context == "dspf") {
          var value = parms.evalProperty("value");
          var groupValue = parms.evalProperty("radio button group");
          if (value != null && groupValue != null) {
            if ((value == groupValue) || (!isNaN(Number(value)) && !isNaN(Number(groupValue)) && Number(value) == Number(groupValue))) {
              if (pui["is_old_ie"]) parms.dom.name = "radio";  // temporary name -- fixes problem of checkboxes being checked off in IE8 standards mode when radio button's checked dom property is set to true
              parms.dom.checked = true;
            }
          }        
          addEvent(parms.dom, "click", function() {
            if (parms.dom.readOnly) {
              if (parms.dom.checked == false) parms.dom.checked = true;
              else if (parms.dom.checked == true) parms.dom.checked = false;
            }
          });
        }
        else if (context == "genie") {
        
          var relatedId = parms.evalProperty("related field"); 
          var attrs;
          var hide = false;
          if (parms.dom.fieldInfo) {
          
            // Transformed 5250 field.
            attrs = parms.dom.fieldInfo;
          
          }
          else if (relatedId != "") {
          
            // Related radio.
            if (parms.dom.relatedObj) {
              
              if (parms.dom.relatedObj.fieldInfo) {
              
                attrs = related.fieldInfo;
                
              }
            
            }
            else {
            
              // No related field. Assume 5250 field not 
              // conditioned for display. 
              hide = true;
            
            }
          
          }
          
          if (attrs) {
          
            if (attrs["bypass"]) {
            
              parms.dom.disabled = true;
              var attr = attrs["attr"];
              hide = (attr == "27" || attr == "2F" || attr == "37" || attr == "3F");              
            
            }
          
          }
          
          if (hide) {
          
            parms.dom.style.visibility = "hidden";
            if (parms.dom.labelObj) {
            
              parms.dom.labelObj.style.visibility = "hidden";
            
            }            
          
          }  
       
        }
      }
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
    },
    "css class": function(parms) {
      
      if (parms.design && parms.designItem.label) {
      
        parms.designItem.label.className = "label-for";
        var cls = trim(parms.value.split(" ")[0]);
        if (cls != "")
          pui.addCssClass(parms.designItem.label, "label-for-" + cls);
        
      } 
      
    }
    
  }
    
});

