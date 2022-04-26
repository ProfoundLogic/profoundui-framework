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
  pickIcon1IsDiv: true,
  icon1Class: 'pui-prompt',

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
      var promptIcon = parms.evalProperty("prompt icon");
      if (parms.design) { 
        parms.dom.readOnly = true;
        parms.dom.spellcheck = false;
        var itm = parms.designItem;
        itm.promptIcon = null;
        if (promptIcon) {
          itm.promptIcon = promptIcon;
          parms.dom.sizeMe = function() {            
            itm.drawIcon();
            itm.mirrorDown();
          };
        }
      }
      if (promptIcon) {
        parms.dom.alwaysSizeMe = true;  //Don't just do sizeMe when dimensions are percents and in layouts.
        if (!parms.design) {
          pui.addPrompt(parms);
        }
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
    },
    
    "prompt icon": function(parms) {
      var promptIcon = parms.value;
      if (parms.design) {        
        var itm = parms.designItem;
        itm.promptIcon = null;
        if (promptIcon) itm.promptIcon = promptIcon;
        itm.drawIcon();
        itm.mirrorDown();
      }
    },
    
    "css class": function(parms) {
      if (parms.design) {
        parms.designItem.drawIcon();
      } 
      else {        
        // To Do
      }
    }
  
  },

  globalAfterSetter: function(parms) {

    if (parms.propertyName == 'field type' && parms.oldDom && parms.oldDom.floatingPlaceholder != null && parms.dom && parms.dom.floatingPlaceholder == null) {
      pui.floatPlaceholder(parms.dom);
    }

    if (parms.dom && parms.dom.floatingPlaceholder != null) {
      pui.movePropertiesFromFloatingPlaceholderDiv(parms);
    }
  }
  
});


pui.addPrompt(parms) {

  var prompter = document.createElement("div");  
  var promptIcon = parms.evalProperty("prompt icon");
  prompter.classList.add("pui-prompt");
  if (promptIcon.substr(0,9) === 'material:') {
    var icon = promptIcon.substr(9);
    prompter.innerText = trim(icon);
    prompter.classList.add('pui-material-icons');
  }
  else if (promptIcon.substr(0, 12) === 'fontAwesome:') {
    var icon = trim(promptIcon.substr(12));
    prompter.classList.add('pui-fa-icons fa-' + icon);
    prompter.innerText = '';
  }
  else {
    var iconSets = pui.getDefaultIconSets();
    if (pui["customIconList"] && pui["customIconList"]) {
      if (Array.isArray(pui["customIconList"]["icons"]) && pui["customIconList"]["icons"].length) {
        iconSets =  pui["customIconList"]["icons"];
      }
    }
    var iconValueArr = promptIcon.split(':');
    var iconValueType =  iconValueArr.shift().split('-');
    var iconValueClassList = iconValueType.pop();
    iconValueType = iconValueType.join('-');
    var iconVal = iconValueArr.pop();
    iconSets.every(function(iconSet) {
      var type = iconSet["type"];
      var iconClassName = iconSet["classList"][iconValueClassList];
      if (iconValueType === type) {
        var classes = (iconClassName + iconVal).split(" ");
        for (var i = 0; i < classes.length; i++) {
          prompter.classList.add(classes[i]);
        }
        prompter.innerHTML = '';
        return false;
      }
      return true;
    });
  }
  
  parmd.dom.parentNode.appendChild(prompter);
  parms.dom.prompter = prompter;

}


