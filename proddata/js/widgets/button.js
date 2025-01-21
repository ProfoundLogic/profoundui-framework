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
  name: "button",
  tag: "input",
  inputType: "button",
  newValue: "Click Here",
  inlineEdit: true,
  defaults: {
    "width": !pui["is_quirksmode"] ? "100px" : null,
    "css class": "button"
  },

  propertySetters: {

    "field type": function(parms) {
      parms.dom.value = parms.evalProperty("value");
      if (parms.design && parms.properties["field type"] != "button") {
        var cssClass = parms.designItem.properties["css class"];
        if (cssClass == null) cssClass = "";
        if (!pui.isBound(cssClass)) {
          if (cssClass.indexOf("button") < 0) {
            if (cssClass != "") cssClass += " ";
            cssClass += "button";
            parms.designItem.properties["css class"] = cssClass;
            parms.designItem.propertiesChanged["css class"] = true;
            parms.dom.className = cssClass;
          }
        }
      }

      // Assist with garbage-collection.
      parms.dom.puiTrackEvent = pui.trackEvent;
      parms.dom.destroy = pui.basicDestroy;

      if (!parms.design) {
        var onkeydown = function(e) {
          // prevent enter key from bubbling so that user can press enter to initiate the button
          // otherwise the enter key response would be sent to the server instead
          var key = e.keyCode;
          if (key == 13) {
            e.cancelBubble = true;
          }
        };
        addEvent(parms.dom, "keydown", onkeydown); // Add event, and also track listener for removal.
      }
    },

    "value": function(parms) {
      parms.dom.value = parms.value;
    }

  }

});
