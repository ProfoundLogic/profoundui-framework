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
  name: "field set panel",
  canBelongToGrid: false,
  tag: "fieldset",
  newId: "FieldSet",
  newValue: "Field Set",
  container: true,
  inlineEdit: true,
  defaults: {
    width: "300px",
    height: "200px",
    "z index": "8"
  },

  propertySetters: {
  
    "field type": function(parms) {
      var styleString = '';
      if (parms.evalProperty("color") != null && parms.evalProperty("color") != ' ') {
    	  styleString = ' style="color: ' + parms.evalProperty("color") + ';"' ;
      }
      var value = parms.evalProperty("value");
      if (value != null && value != "") {
      
        parms.dom.innerHTML = '<legend' + styleString + '>' + value + '</legend>';
        
      }
      else {
      
        parms.dom.innerHTML = "";
      
      }
    },
    
    "value": function(parms) {
    	var styleString = '';
        if (parms.evalProperty("color") != null && parms.evalProperty("color") != ' ') {
      	  styleString = ' style="color: ' + parms.evalProperty("color") + ';"' ;
        }
        var value = parms.value;	
        if (value != null && value != "") {
        
          parms.dom.innerHTML = '<legend' + styleString + '>' + value + '</legend>';
          
        }
        else {
        
          parms.dom.innerHTML = "";
        
        }
    },

    "color": function(parms) {
      // set color on legend
      var legend = parms.dom.firstChild;
      if (legend != null && legend.tagName == "LEGEND") {
        legend.style.color = parms.value;
      }
    }
    
  }
  
});

