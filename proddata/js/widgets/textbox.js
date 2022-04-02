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



pui.widgets.add({
  name: "textbox",
  tag: "input",
  newId: "TextBox",
  defaults: {
    "css class": "input"
  },

  propertySetters: {
  
    "field type": function(parms) {
      parms.dom.value = parms.evalProperty("value");
      if (!parms.design) {
        applyAutoComp(parms.properties, parms.originalValue, parms.dom);
        if (pui.iPadEmulation && !pui.iPhoneEmulation && parms.dom.id.indexOf(".") == -1) {
          addEvent(parms.dom, "focus", function(event) {
            getObj("ipadKeyboard").style.display = "";
          });
          addEvent(parms.dom, "blur", function(event) {
            getObj("ipadKeyboard").style.display = "none";
          });
        }
        // Retain default browser behavior unless the user sets this...
        if (typeof pui["allow spellcheck"] == "boolean")
          parms.dom.spellcheck = pui["allow spellcheck"];
        //If they are changing a date field to a textbox, remove the calendar
        if(parms.dom.calimg) pui.removeCal(parms.dom);
        // Default off if not set by 'html auto complete' property.
        if (parms.dom.getAttribute("autocomplete") == null && (context != "genie" || !pui.genie.config.browserAutoComplete)) {
          parms.dom.setAttribute("autocomplete", "off");
          if (context == "dspf")
            parms.dom.setAttribute("name", pui.randomTextBoxName());
        }
      }
      if (parms.design) { 
        parms.dom.readOnly = true;
        parms.dom.spellcheck = false;
      }
    },
    
    "value": function(parms) {
      if (parms.dom.autoCompTranslated) {
      
        parms.dom.autoCompTranslated = false;
      
      }
      else {
      
        parms.dom.value = parms.value;
        
      }
    },
    
    "input type": function(parms) {
      if (!parms.design) {
        try { 
          parms.dom.setAttribute("type", parms.value);
        } catch(e) { }
      }
    },
    
    "browser auto complete": function(parms) {
      if (!parms.design) {
        parms.dom.setAttribute("autocomplete", parms.value);
        if (context == "dspf") {
          if (parms.value == "off")
            parms.dom.setAttribute("name", pui.randomTextBoxName());
          else
            parms.dom.removeAttribute("name");
        }
      }
    },

    "choices url": function(parms) {
      if (!parms.design && parms.dom && parms.dom.autoComp && typeof parms.dom.autoComp.updateUrl === "function") {
        parms.dom.autoComp.updateUrl(parms.value);
      }
    }
  
  },

  globalAfterSetter: function(parms) {
    // If the textbox has a floating placeholder, then properties have been applied to the placeholder div
    // instead of the actual textbox. For certain properties (and this list should be added to), move them to
    // the inner textbox.
    if (parms.dom && parms.dom.floatingPlaceholder != null) {
      var box = parms.dom.floatingPlaceholder.getBox();
      var propertyName = parms.propertyName;
      var pnm = getPropertiesNamedModel();
      var stylename;

      if (pnm[propertyName] && pnm[propertyName].stylename) stylename = pnm[propertyName].stylename;
      else if (pnm[propertyName] && pnm[propertyName].attribute) stylename = pnm[propertyName].attribute;

      if (stylename) {
        switch (propertyName) {
          case "disabled":
          case "read only":
            box[stylename] = parms.newValue;
            parms.dom.removeAttribute(stylename);
            break;          
          case "border radius":
          case "text align":
          case "height":
              box.style[stylename] = parms.dom.style[stylename];
              parms.dom.style[stylename] = "";
              break;
        }
      }
    }
  }
  
});


