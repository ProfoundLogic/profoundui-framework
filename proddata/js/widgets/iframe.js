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
  name: "iframe",
  newId: "IFrame",
  menuName: "IFrame",
  defaults: {
    width: "400px",
    height: "300px",
    "z index": "25",
    "background color": "#FFFFFF",
    "frame border": "true"
  },
  
  propertySetters: {
  
    "field type": function(parms) {
      if (parms.design) {
        parms.dom.innerHTML = "IFrame content will appear here.";
        parms.dom.style.overflow = "hidden";
      }
      else {
        parms.dom.innerHTML = "";
        url = parms.evalProperty("iframe url");
        if (url == null || url == "") {
          parms.dom.innerHTML = "IFrame URL property not specified.";
        }
        else {
          var widthHeight = "";
          var width = parseInt(parms.properties["width"]);
          var height = parseInt(parms.properties["height"]);
          if (width > 0) widthHeight += ' width="' + parms.properties["width"] + '"';
          if (height > 0) widthHeight += ' height="' + parms.properties["height"] + '"';
          var html = '<iframe src="' + url;
          html += '" frameborder="';
          html += (parms.properties["frame border"] == "true") ? "1" : "0";
          html += '"' + widthHeight + '>';
          parms.dom.innerHTML = html;
        }
      }
    },
    "visibility": function(parms) {
      
      if (!parms.design) {
      
        var iframe = parms.dom.getElementsByTagName("iframe");
        if (iframe && iframe.length == 1) {
      
          iframe = iframe[0];
          if (parms.value == "hidden") {
          
            iframe.style.visibility = "hidden";
            iframe.style.display = "none";
          
          }
          else {
          
            iframe.style.visibility = "";
            iframe.style.display = "";
          
          }
        
        }
      
      }
    }
    
  }
  
});

