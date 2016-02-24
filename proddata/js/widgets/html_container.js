//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2016 Profound Logic Software, Inc.
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
  name: "html container",
  inlineEdit: true,
  defaults: {
    html: "<i>HTML Content</i>",
    "white space": "normal",
    width: "200px",
    height: "100px"
  },

  propertySetters: {
  
    "field type": function(parms) {
      parms.dom.innerHTML = parms.evalProperty("html");
    },
    
    "html": function(parms) {
      parms.dom.innerHTML = parms.value;
    }

  }

});

