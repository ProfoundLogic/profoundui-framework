//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2015 Profound Logic Software, Inc.
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



pui.widgets.panelStyles = {
  "Simple": {
    left: 10,
    right: 10,
    top: 33,
    bottom: 9,
    background: "#bad3e9",
    textBackground: "#004eae",
    textTopPadding: "7px"
  },
  "Evergreen": {
    left: 10,
    right: 10,
    top: 30,
    bottom: 30,
    background: "#edeef0",
    textBackground: "#288e28",
    textTopPadding: "7px"
  },
  "Ruby": {
    left: 6,
    right: 6,
    top: 25,
    bottom: 25,
    background: "#e1e0e0",
    textBackground: "#cc3333",
    textTopPadding: "7px",
    fontSize: "14px"
  },
  "Sapphire": {
    left: 9,
    right: 9,
    top: 30,
    bottom: 30,
    background: "#edeef0",
    textBackground: "#2570cb",
    textTopPadding: "7px"
  },
  "Polished": {
    left: 10,
    right: 10,
    top: 30,
    bottom: 30,
    background: "#edeef0",
    textBackground: "#4f6592",
    textTopPadding: "7px"
  },
  "Contemporary": {
    left: 6,
    right: 6,
    top: 28,
    bottom: 28,
    background: "#a7a9ac",
    textBackground: "#387adc",
    textTopPadding: "7px"
  },
  "Slate": {
    left: 11,
    right: 11,
    top: 30,
    bottom: 30,
    background: "#a5a7ac",
    textBackground: "#3568ce",
    textTopPadding: "7px"
  },
  "Smoke": {
    left: 11,
    right: 11,
    top: 34,
    bottom: 34,
    background: "#7a7a7b",
    textBackground: "#7479a0",
    textTopPadding: "10px"
  },
  "Pine": {
    left: 6,
    right: 6,
    top: 25,
    bottom: 25,
    background: "#d2d2d2",
    textBackground: "#288e28",
    textTopPadding: "7px"
  },
  "Ice Blue": {
    left: 10,
    right: 10,
    top: 13,
    bottom: 13,
    background: "#92c0f4",
    textBackground: "#92c0f4",
    textTopPadding: "7px",
    noTitle: true
  },
  "Glass": {
    left: 6,
    right: 6,
    top: 11,
    bottom: 11,
    background: "#c9dff3",
    textBackground: "#c9dff3",
    textTopPadding: "7px",
    noTitle: true
  },
  "Navy": {
    left: 11,
    right: 11,
    top: 24,
    bottom: 24,
    background: "#1c325f",
    textBackground: "#1c325f",
    textTopPadding: "7px",
    noTitle: true
  },
  "Steel Blue": {
    left: 7,
    right: 7,
    top: 9,
    bottom: 9,
    background: "#5d7ac5",
    textBackground: "#5d7ac5",
    textTopPadding: "7px",
    noTitle: true
  },
  "Harvest": {
    left: 8,
    right: 8,
    top: 18,
    bottom: 18,
    background: "#e68b2c",
    textBackground: "#e68b2c",
    textTopPadding: "7px",
    noTitle: true
  },
  "Professional Dialog": {
    left: 8,
    right: 8,
    top: 33,
    bottom: 33,
    background: "#d7e5f7",
    textBackground: "#0055e5",
    textTopPadding: "7px",
    width: 400,
    height: 200,    
    dialog: true
  },
  "Classic Dialog": {
    left: 10,
    right: 10,
    top: 34,
    bottom: 34,
    background: "#ffffff",
    textBackground: "#0d89b8",
    textTopPadding: "7px",
    width: 400,
    height: 200,    
    dialog: true
  },
   "Simple Dialog": {
    left: 4,
    right: 4,
    top: 30,
    bottom: 30,
    background: "#ebf0f5",
    textBackground: "#bad0ee",
    textTopPadding: "7px",
    width: 400,
    height: 200,    
    dialog: true
  },
  "Polished Dialog": {
    left: 10,
    right: 10,
    top: 44,
    bottom: 44,
    background: "#ffffff",
    textBackground: "#f1f3f3",
    textTopPadding: "7px",
    width: 400,
    height: 200,    
    dialog: true
  },
  "Modern Dialog": {
    left: 13,
    right: 13,
    top: 70,
    bottom: 70,
    background: "#e8e7e2",
    textBackground: "#7d9ccd",
    textTopPadding: "14px",
    width: 400,
    height: 300,    
    dialog: true
  },
  "Glass Dialog": {
    left: 7,
    right: 7,
    top: 44,
    bottom: 44,
    background: "#ffffff",
    textBackground: "#d7e5f7",
    textTopPadding: "7px",
    width: 400,
    height: 250,
    dialog: true
  },
  "Crimson Dialog": {
    left: 2,
    right: 2,
    top: 32,
    bottom: 32,
    background: "#ffffff",
    textBackground: "#b83c3d",
    textTopPadding: "7px",
    width: 400,
    height: 200,
    dialog: true
  }
}

pui.widgets.defaultPanelWidth = 200;
pui.widgets.defaultPanelHeight = 100;


pui.widgets.getPanelProxy = function(defaults) {
  var pstyle = defaults["panel style"];
  var settings = pui.widgets.panelStyles[pstyle];
  
  var parms = {};
  parms.dom = document.createElement("div");
  parms.dom.style.position = "relative";
  parms.dom.style.width = pui.widgets.defaultPanelWidth + "px";
  if (settings.width != null) parms.dom.style.width = settings.width + "px";
  parms.dom.style.height = pui.widgets.defaultPanelHeight + "px";
  if (settings.height != null) parms.dom.style.height = settings.height + "px";
  parms.isProxy = true;  

  parms.properties = {};
  parms.properties.width = pui.widgets.defaultPanelWidth + "px";
  if (settings.width != null) parms.properties.width = settings.width;;
  parms.properties.height = pui.widgets.defaultPanelHeight + "px";
  if (settings.height != null) parms.properties.height = settings.height;
  parms.properties.value = "Panel Title";
  if (settings.dialog == true) {
    parms.properties.value = "Dialog Title";
  }
  if (settings.noTitle == true) {
    parms.properties.value = "";
  }
  parms.properties["panel style"] = pstyle;
  parms.evalProperty = function(propName) {
    return parms.properties[propName];
  }
  pui.widgets["panel"].propertySetters["field type"](parms);
  
  if (settings.textColor != null) parms.dom.panel.textDiv.style.color = settings.textColor;
  if (settings.textAlign != null) parms.dom.panel.textDiv.style.textAlign = settings.textAlign;
  if (settings.fontSize != null) parms.dom.panel.textDiv.style.fontSize = settings.fontSize;
  parms.dom.style.color = parms.dom.panel.textDiv.style.color;
  parms.dom.style.textAlign = parms.dom.panel.textDiv.style.textAlign;
  parms.dom.style.fontSize = parms.dom.panel.textDiv.style.fontSize;  
  
  return parms.dom;
}

pui.widgets.resizePanel = function(panel, settings, width, height, parms) {

  if (typeof width == "string") {
    if (width != "" && !isNaN(width)) width += "px";
    if (width.length >= 3 && width.substr(width.length - 2) == "px") width = parseInt(width);
    else width = panel.topLeftDiv.parentNode.offsetWidth;
  }
  if (typeof height == "string") {
    if (height != "" && !isNaN(height)) height += "px";
    if (height.length >= 3 && height.substr(height.length - 2) == "px") height = parseInt(height);
    else height = panel.topLeftDiv.parentNode.offsetHeight;
  }  
  if (typeof width != "number") width = parseInt(width);
  if (isNaN(width)) width = pui.widgets.defaultPanelWidth;
  if (typeof height != "number") height = parseInt(height);
  if (isNaN(height)) height = pui.widgets.defaultPanelHeight;

  var overlap = 0;
  if (pui["is_touch"] && !pui["is_mouse_capable"] && !parms.design) overlap = 1;

  var resized = false;
  if (height < settings.top + settings.bottom) {
    height = settings.top + settings.bottom;
    panel.textDiv.parentNode.style.height = height + "px";    
    resized = true;
  }
  if (width < settings.left + settings.right) {
    width = settings.left + settings.right;
    panel.textDiv.parentNode.style.width = width + "px";
    resized = true;
  }
  if (resized && parms != null && parms.design == true) {
    parms.designItem.designer.selection.positionSizies();
  }

  panel.topLeftDiv.style.width = settings.left + "px";
  panel.topLeftDiv.style.height = settings.top + "px";

  panel.topMiddleDiv.style.left = (settings.left - overlap) + "px";
  panel.topMiddleDiv.style.height = settings.top + "px";
  panel.topMiddleDiv.style.width = (width - settings.left - settings.right + overlap * 2) + "px";
  
  panel.topRightDiv.style.left = (width - settings.right) + "px";
  panel.topRightDiv.style.height = settings.top + "px";
  panel.topRightDiv.style.width = settings.right + "px";

  panel.leftImage.style.top = (settings.top - overlap) + "px";
  panel.leftImage.style.width = settings.left + "px";
  panel.leftImage.style.height = (height - settings.top - settings.bottom + overlap * 2) + "px";

  panel.middleDiv.style.left = (settings.left - overlap) + "px";
  panel.middleDiv.style.top = (settings.top - overlap) + "px";
  panel.middleDiv.style.width = (width - settings.left - settings.right + overlap * 2) + "px";
  panel.middleDiv.style.height = (height - settings.top - settings.bottom + overlap * 2) + "px";

  panel.rightImage.style.left = (width - settings.right) + "px";
  panel.rightImage.style.top = (settings.top - overlap) + "px";
  panel.rightImage.style.width = settings.right + "px";
  panel.rightImage.style.height = (height - settings.top - settings.bottom + overlap * 2) + "px";

  panel.bottomLeftDiv.style.top = (height - settings.bottom) + "px";
  panel.bottomLeftDiv.style.width = settings.left + "px";
  panel.bottomLeftDiv.style.height = settings.bottom + "px";

  panel.bottomMiddleDiv.style.left = (settings.left - overlap) + "px";
  panel.bottomMiddleDiv.style.top = (height - settings.bottom) + "px";
  panel.bottomMiddleDiv.style.height = settings.bottom + "px";
  panel.bottomMiddleDiv.style.width = (width - settings.left - settings.right + overlap * 2) + "px";
  
  panel.bottomRightDiv.style.left = (width - settings.right) + "px";
  panel.bottomRightDiv.style.top = (height - settings.bottom) + "px";
  panel.bottomRightDiv.style.height = settings.bottom + "px";
  panel.bottomRightDiv.style.width = settings.right + "px";

  panel.textDiv.style.left = settings.left + "px";
  panel.textDiv.style.top = "0px";
  panel.textDiv.style.width = (width - settings.left - settings.right) + "px";
  if (settings.top < 15) panel.textDiv.style.height = "15px";
  else panel.textDiv.style.height = settings.top + "px";

}


pui.widgets.add({
  name: "panel",
  newValue: "Panel Title",
  canBelongToGrid: false,
  inlineEdit: true,
  container: true,
  defaults: {
    "width": pui.widgets.defaultPanelWidth + "px",
    "height": pui.widgets.defaultPanelHeight + "px",
    "panel style": "Simple",
    "z index": "8"
  },
  
  propertySetters: {

    "field type": function(parms) {

      parms.dom.sizeMe = function() {
        var pstyle = parms.properties["panel style"];
        var settings = pui.widgets.panelStyles[pstyle];
        if (settings == null) {
          var pstyle = pui.widgets.getPanelStyles()[0];
          settings = pui.widgets.panelStyles[pstyle];
        }
        var panel = parms.dom.panel;
        pui.widgets.resizePanel(panel, settings, parms.dom.offsetWidth, parms.dom.offsetHeight, parms);
      }

      //parms.dom.style.fontFamily = "Arial";
      //parms.dom.style.color = "#ffffff";
      if (parms.properties.color != null) {
        parms.dom.style.color = parms.properties.color;
      }
      //parms.dom.style.fontSize = "12px";
      //parms.dom.style.fontWeight = "bold";

      parms.dom.innerHTML = "";
      if (typeof parms.dom.style.MozUserSelect!="undefined") parms.dom.style.MozUserSelect = "none";
      
      var panel = {};
      
      panel.topLeftDiv = document.createElement("div");
      panel.topMiddleDiv = document.createElement("div");
      panel.topRightDiv = document.createElement("div");
      panel.leftImage = document.createElement("div");
      panel.middleDiv = document.createElement("div");
      panel.rightImage = document.createElement("div");
      panel.bottomLeftDiv = document.createElement("div");
      panel.bottomMiddleDiv = document.createElement("div");
      panel.bottomRightDiv = document.createElement("div");      
      panel.textDiv = document.createElement("div");
      
      panel.topLeftDiv.style.position = "absolute";
      panel.topLeftDiv.style.padding = "0px";
      panel.topLeftDiv.style.margin = "0px";
      panel.topMiddleDiv.style.position = "absolute";
      panel.topMiddleDiv.style.padding = "0px";
      panel.topMiddleDiv.style.margin = "0px";
      panel.topRightDiv.style.position = "absolute";
      panel.topRightDiv.style.padding = "0px";
      panel.topRightDiv.style.margin = "0px";      
      panel.leftImage.style.position = "absolute";
      panel.leftImage.style.padding = "0px";
      panel.leftImage.style.margin = "0px";
      panel.middleDiv.style.position = "absolute";
      panel.middleDiv.style.padding = "0px";
      panel.middleDiv.style.margin = "0px";
      panel.middleDiv.className = "content-area";
      panel.rightImage.style.position = "absolute";
      panel.rightImage.style.padding = "0px";
      panel.rightImage.style.margin = "0px";      
      panel.bottomLeftDiv.style.position = "absolute";
      panel.bottomLeftDiv.style.padding = "0px";
      panel.bottomLeftDiv.style.margin = "0px";
      panel.bottomMiddleDiv.style.position = "absolute";
      panel.bottomMiddleDiv.style.padding = "0px";
      panel.bottomMiddleDiv.style.margin = "0px";
      panel.bottomRightDiv.style.position = "absolute";
      panel.bottomRightDiv.style.padding = "0px";
      panel.bottomRightDiv.style.margin = "0px";
      
      panel.topLeftDiv.style.top = "0px";
      panel.topLeftDiv.style.left = "0px";
      panel.topLeftDiv.style.backgroundRepeat = "no-repeat";
      
      panel.topMiddleDiv.style.top = "0px";
      panel.topMiddleDiv.style.backgroundRepeat = "repeat-x";
      
      panel.topRightDiv.style.top = "0px";
      panel.topRightDiv.style.backgroundRepeat = "no-repeat";
      
      panel.leftImage.style.left = "0px";
                  
      panel.bottomLeftDiv.style.left = "0px";
      panel.bottomLeftDiv.style.backgroundRepeat = "no-repeat";
      
      panel.bottomMiddleDiv.style.backgroundRepeat = "repeat-x";
      
      panel.bottomRightDiv.style.backgroundRepeat = "no-repeat";
      
      panel.leftImage.style.backgroundRepeat = "repeat-y";
      panel.rightImage.style.backgroundRepeat = "repeat-y";
      
      panel.textDiv.style.position = "absolute";
      panel.textDiv.style.verticalAlign = "middle";
      //panel.textDiv.style.display = "table-cell";
      panel.textDiv.style.display = "";
      if (!pui.iPadEmulation) {
        panel.textDiv.style.cursor = "default";
      }
      panel.textDiv.style.overflow = "hidden";
      panel.textDiv.style.webkitTapHighlightColor = "rgba(0,0,0,0)"; 
      
      // default styling
      //panel.textDiv.style.fontFamily = "Arial";
      //panel.textDiv.style.color = "#ffffff";
      //panel.textDiv.style.fontSize = "12px";
      //panel.textDiv.style.fontWeight = "bold";
      if (parms.properties.color != null) {
         panel.textDiv.style.color = parms.properties.color;
      }
      if (parms.properties["text align"] != null) {
         panel.textDiv.style.textAlign = parms.properties["text align"];
      }
      if (parms.properties["font size"] != null) {
         panel.textDiv.style.fontSize = parms.properties["font size"];
      }
      parms.dom.style.fontFamily = panel.textDiv.style.fontFamily;
      parms.dom.style.color = panel.textDiv.style.color;
      parms.dom.style.fontSize = panel.textDiv.style.fontSize;
      parms.dom.style.fontWeight = panel.textDiv.style.fontWeight;
      parms.dom.style.textAlign = panel.textDiv.style.textAlign;
      
      parms.dom.appendChild(panel.topLeftDiv);
      parms.dom.appendChild(panel.topMiddleDiv);
      parms.dom.appendChild(panel.topRightDiv);
      parms.dom.appendChild(panel.leftImage);
      parms.dom.appendChild(panel.middleDiv);
      parms.dom.appendChild(panel.rightImage);
      parms.dom.appendChild(panel.bottomLeftDiv);
      parms.dom.appendChild(panel.bottomMiddleDiv);
      parms.dom.appendChild(panel.bottomRightDiv);
      parms.dom.appendChild(panel.textDiv);
      
      // Enable dragging if within window      
      var windowDiv = parms.dom.parentNode;      
      if (!parms.design && windowDiv != null && windowDiv.isPUIWindow == true) {
        function mousedown(event) {
          var cursorStartX = getMouseX(event);
          var cursorStartY = getMouseY(event);
          var startLeft = parseInt(windowDiv.style.left);
          var startTop = parseInt(windowDiv.style.top);    
          function mousemove(event) {            
            var x = getMouseX(event);
            var y = getMouseY(event);
            if (x < 0) x = 0;
            if (y < 0) y = 0;
            windowDiv.style.top  = (startTop - cursorStartY + y) + "px";
            windowDiv.style.left = (startLeft - cursorStartX + x) + "px";
          }
          function mouseup() {
            removeEvent(document, "mousemove", mousemove);
            removeEvent(document, "mouseup", mouseup);
          }
          addEvent(document, "mousemove", mousemove);
          addEvent(document, "mouseup",   mouseup);
          preventEvent(event);      
        }
        addEvent(panel.textDiv, "mousedown", mousedown);
        addEvent(panel.topLeftDiv, "mousedown", mousedown);
        addEvent(panel.topRightDiv, "mousedown", mousedown);        


        addEvent(panel.textDiv, "touchstart", function(e) {
          if (e.touches.length != 1) return;  // Only deal with one finger
          var touch = e.touches[0]
          windowDiv.touch = {};
          windowDiv.touch.startX = touch.pageX;
          windowDiv.touch.startY = touch.pageY;
          windowDiv.touch.startLeft = parseInt(windowDiv.style.left);
          windowDiv.touch.startTop = parseInt(windowDiv.style.top);
        });
        addEvent(panel.textDiv, "touchmove", function(e) {
          if (e.touches.length != 1) return;  // Only deal with one finger
          var touch = e.touches[0];
          var x = touch.pageX;
          var y = touch.pageY;
          windowDiv.style.left = (windowDiv.touch.startLeft - windowDiv.touch.startX + x) + "px";
          windowDiv.style.top = (windowDiv.touch.startTop - windowDiv.touch.startY + y) + "px";
          e.preventDefault();
        });
        
        panel.textDiv.style.cursor = "move";
        panel.topLeftDiv.style.cursor = "move";
        panel.topRightDiv.style.cursor = "move";
      }

      parms.dom.panel = panel;
      
      var savedValue = parms.value;
      parms.value = parms.properties["panel style"];
      pui.widgets["panel"].propertySetters["panel style"](parms);
      parms.value = savedValue;
      
      parms.dom.panel.textDiv.innerHTML = parms.evalProperty("value");
    },
        
    "panel style": function(parms) { 
      var pstyle = parms.value;      
      var settings = pui.widgets.panelStyles[pstyle];
      if (settings == null) {
        var pstyle = pui.widgets.getPanelStyles()[0];
        settings = pui.widgets.panelStyles[pstyle];
      }
      var path = pui.normalizeURL("/profoundui/proddata/images/panels/" + pstyle + "/");
      parms.dom.panel.pstyle = pstyle;
      var panel = parms.dom.panel;
      
      panel.topLeftDiv.style.backgroundImage = "url('" + path + "topleft.png')";      
      panel.topMiddleDiv.style.backgroundImage = "url('" + path + "topmiddle.png')";
      panel.topRightDiv.style.backgroundImage = "url('" + path + "topright.png')";          
      
      //panel.leftImage.src = path + "left.png";
      //panel.leftImage.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + path + "left.png" + "', sizingMethod='scale')";
      panel.leftImage.style.backgroundImage = "url('" + path + "left.png')";
      
      panel.middleDiv.style.backgroundColor = settings.background;
      
      //panel.rightImage.src = path + "right.png";
      //panel.rightImage.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + path + "right.png" + "', sizingMethod='scale')";
      panel.rightImage.style.backgroundImage = "url('" + path + "right.png')";
      
      panel.bottomLeftDiv.style.backgroundImage = "url('" + path + "bottomleft.png')";
      panel.bottomMiddleDiv.style.backgroundImage = "url('" + path + "bottommiddle.png')";
      panel.bottomRightDiv.style.backgroundImage = "url('" + path + "bottomright.png')";
      panel.textDiv.style.paddingTop = settings.textTopPadding;
      panel.textDiv.className = "panel " + pstyle.split(" ").join("-").toLowerCase() + "-panel";

      pui.widgets.resizePanel(panel, settings, parms.properties["width"], parms.properties["height"]);
    },

    "value": function(parms) {
      parms.dom.panel.textDiv.innerHTML = parms.value;
    },

    "width": function(parms) {
      if (pui.isNumericString(parms.value)) parms.dom.style.width = parms.value + "px";
      else parms.dom.style.width = parms.value;
      var pstyle = parms.properties["panel style"];
      var settings = pui.widgets.panelStyles[pstyle];
      if (settings == null) {
        var pstyle = pui.widgets.getPanelStyles()[0];
        settings = pui.widgets.panelStyles[pstyle];
      }
      var panel = parms.dom.panel;

      pui.widgets.resizePanel(panel, settings, parms.value, parms.properties["height"], parms);
    },
    
    "height": function(parms) {
      if (pui.isNumericString(parms.value)) parms.dom.style.height = parms.value + "px";
      else parms.dom.style.height = parms.value;
      var pstyle = parms.properties["panel style"];
      var settings = pui.widgets.panelStyles[pstyle];
      if (settings == null) {
        var pstyle = pui.widgets.getPanelStyles()[0];
        settings = pui.widgets.panelStyles[pstyle];
      }
      var panel = parms.dom.panel;

      pui.widgets.resizePanel(panel, settings, parms.properties["width"], parms.value, parms);
    },
    
    "color": function(parms) {
      var value = parms.value;
      //if (value == null || value == "") value = "#ffffff";
      parms.dom.panel.textDiv.style.color = value;
      parms.dom.style.color = parms.dom.panel.textDiv.style.color;
    },
    
    "font family": function(parms) {
      var value = parms.value;
      //if (value == null || value == "") value = "Arial";
      parms.dom.panel.textDiv.style.fontFamily = value;
      parms.dom.style.fontFamily = parms.dom.panel.textDiv.style.fontFamily;
    },
    
    "font size": function(parms) {
      var value = parms.value;
      //if (value == null || value == "") value = "12px";
      parms.dom.panel.textDiv.style.fontSize = value;
      parms.dom.style.fontSize = parms.dom.panel.textDiv.style.fontSize;
    },
    
    "font style": function(parms) {
      parms.dom.panel.textDiv.style.fontStyle = parms.value;
    },

    "font variant": function(parms) {
      parms.dom.panel.textDiv.style.fontVariant = parms.value;
    },

    "font weight": function(parms) {
      var value = parms.value;
      //if (value == null || value == "") value = "bold";
      parms.dom.panel.textDiv.style.fontWeight = value;
      parms.dom.style.fontWeight = parms.dom.panel.textDiv.style.fontWeight;
    },

    "letter spacing": function(parms) {
      parms.dom.panel.textDiv.style.letterSpacing = parms.value;
    },

    "text align": function(parms) {
      parms.dom.panel.textDiv.style.textAlign = parms.value;
    },

    "text decoration": function(parms) {
      parms.dom.panel.textDiv.style.textDecoration = parms.value;
    },

    "text transform": function(parms) {
      parms.dom.panel.textDiv.style.textTransform = parms.value;
    },
    
    "word spacing": function(parms) {
      parms.dom.panel.textDiv.style.wordSpacing = parms.value;
    }

  }
  
});


