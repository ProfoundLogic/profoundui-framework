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

// function to process the change in [password field][show visibility eye] property
function buildVisibilityEye(parms) {
  var showVisibilityEye = parms.properties["show visibility eye"];
  var dom = parms.dom;
  var passwordElement = document.getElementById(dom.id); 
  if (showVisibilityEye === "true") {
    var eyeElement = document.createElement('i');
    passwordElement.style.zIndex = '21';
    eyeElement.id = dom.id.replace('Password', 'PasswordEye');
    eyeElement.classList = 'pui-fa-solid-icons fa-eye';
    eyeElement.style.top = passwordElement.offsetTop + ((passwordElement.offsetHeight / 2) - 9) + 'px';
    eyeElement.style.left = passwordElement.offsetLeft + (passwordElement.offsetWidth - 35) + 'px';
    eyeElement.style.fontSize = '20px';
    eyeElement.style.color = 'lightslategray';
    eyeElement.style.zIndex = '22';
    eyeElement.style.position = 'absolute';
    eyeElement.style.cursor = 'pointer';
    passwordElement.before(eyeElement);

    // add event listener for the toggle control
    eyeElement.addEventListener('click', function(e) {
      var passwordtype = passwordElement.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordElement.setAttribute('type', passwordtype);
      eyeElement.classList.toggle('fa-eye-slash');
    })

  } else {
    // remove visibility eye from the widget
    var eyeElementID = dom.id.replace('Password','PasswordEye');
    var eyeElement = document.getElementById(eyeElementID);
    if (eyeElement !== null) {
      eyeElement.remove();
      passwordElement.style.zIndex = '';
    }
  }
}

// reposition the visibility eye when the [passowrd field] widget is moved on the canvas
function onPasswordElementMove(parms) {
  var showVisibilityEye = parms.properties["show visibility eye"];
  if (showVisibilityEye === "true") {
    var dom = parms.dom;
    var passwordElement = document.getElementById(dom.id); 
    var eyeElementID = dom.id.replace('Password','PasswordEye');
    var eyeElement = document.getElementById(eyeElementID);
    if (eyeElement !== null) {
      eyeElement.style.top = passwordElement.offsetTop + ((passwordElement.offsetHeight / 2) - 9) + 'px';
      eyeElement.style.left = passwordElement.offsetLeft + (passwordElement.offsetWidth - 35) + 'px';
    }
  }  
}

pui.widgets.add({
  name: "password field",
  tag: "input",
  inputType: "password",
  newId: "Password",

  propertySetters: {
  
    "field type": function(parms) {
      parms.dom.value = parms.evalProperty("value");
      if (!parms.design) {
        if (pui.iPadEmulation && !pui.iPhoneEmulation) {
          addEvent(parms.dom, "focus", function(event) {
            getObj("ipadKeyboard").style.display = "";
          });
          addEvent(parms.dom, "blur", function(event) {
            getObj("ipadKeyboard").style.display = "none";
          });
        }
        // Default off if not set by 'html auto complete' property.
        if (parms.dom.getAttribute("autocomplete") == null && (context != "genie" || !pui.genie.config.browserAutoComplete)) {
          parms.dom.setAttribute("autocomplete", "off");
          if (context == "dspf")
            parms.dom.setAttribute("name", pui.randomTextBoxName());
        }
      }
    },
    
    "value": function(parms) {
      parms.dom.value = parms.value;
    },
    
    "top": function(parms){
      onPasswordElementMove(parms);
    },

    "left": function(parms){
      onPasswordElementMove(parms);
    },

    "width": function(parms){
      onPasswordElementMove(parms);
    },

    "height": function(parms){
      onPasswordElementMove(parms);
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
  
    "show visibility eye": function(parms) {
      if(parms.properties["parent tab"] === undefined){
        parms.properties["show visibility eye"] = parms.value;
        buildVisibilityEye(parms);
      } else {
        pui.alert("Cannot turn property to true when password field is contained in a Tab Panel control. Please use a Tab Layout control.")
      }
    }
  
  },

  globalAfterSetter: function(parms) {
    if (parms.propertyName == 'field type' && parms.oldDom && parms.oldDom.floatingPlaceholder != null && parms.dom && parms.dom.floatingPlaceholder == null) {
      pui.floatPlaceholder(parms.dom);
    }
  }
  
});

