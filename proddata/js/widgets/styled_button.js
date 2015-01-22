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



pui.widgets.buttonStyles = {
  "Ice Blue": {
    left: 5,
    right: 5,
    top: 5,
    bottom: 5,
    hasOverState: true,
    hasClickState: true,
    editBackgroundColor: "#cee7ff"
  },
  "Apricot": {
    left: 5,
    right: 5,
    top: 5,
    bottom: 5,
    hasOverState: true,
    hasClickState: true,
    editBackgroundColor: "#ffe7ce"
  },
  "Royal Blue": {
    left: 2,
    right: 2,
    top: 2,
    bottom: 2,
    hasOverState: false,
    hasClickState: false,
    textColor: "#000000",
    editBackgroundColor: "#a5c0ff"
  },
  "Bright Gold": {
    left: 2,
    right: 2,
    top: 2,
    bottom: 2,
    hasOverState: false,
    hasClickState: false,
    textColor: "#000000",
    editBackgroundColor: "#ffd880"
  },
  "Glass": {
    left: 6,
    right: 6,
    top: 11,
    bottom: 11,
    hasOverState: false,
    hasClickState: false,
    editBackgroundColor: "#c9dff3"
  },
  "Black Marble": {
    left: 5,
    right: 5,
    top: 5,
    bottom: 5,
    hasOverState: true,
    hasClickState: true,
    clickStateIsNormalState: true,
    textColor: "#ffffff",
    editBackgroundColor: "#666666"
  },
  "Classic Style": {
    left: 5,
    right: 5,
    top: 5,
    bottom: 5,
    hasOverState: true,
    hasClickState: false,
    editBackgroundColor: "#d8dbd8"
  },
  "Cherry": {
    left: 5,
    right: 5,
    top: 5,
    bottom: 5,
    hasOverState: true,
    hasClickState: false,
    editBackgroundColor: "#e3c9ec"
  },
  "Simplistic": {
    left: 5,
    right: 5,
    top: 5,
    bottom: 5,
    hasOverState: true,
    hasClickState: true,
    editBackgroundColor: "#f6f2ed"
  },
  "Silver Accent": {
    left: 5,
    right: 5,
    top: 5,
    bottom: 5,
    hasOverState: true,
    hasClickState: true,
    editBackgroundColor: "#f7f7ff"
  },
  "Caramel": {
    left: 5,
    right: 5,
    top: 10,
    bottom: 8,
    hasOverState: true,
    hasClickState: true,
    clickStateIsNormalState: true,
    textColor: "#ffffff",
    hiColor: "#000000",
    editBackgroundColor: "#c0a254"
  },
  "Lime Green": {
    left: 5,
    right: 5,
    top: 10,
    bottom: 8,
    hasOverState: true,
    hasClickState: true,
    clickStateIsNormalState: true,
    textColor: "#ffffff",
    hiColor: "#000000",
    editBackgroundColor: "#54c07e"
  },
  "Raspberry Red": {
    left: 5,
    right: 5,
    top: 10,
    bottom: 8,
    hasOverState: true,
    hasClickState: true,
    clickStateIsNormalState: true,
    textColor: "#ffffff",
    hiColor: "#000000",
    editBackgroundColor: "#c05469"
  },
  "Steel Blue": {
    left: 5,
    right: 5,
    top: 10,
    bottom: 8,
    hasOverState: true,
    hasClickState: true,
    clickStateIsNormalState: true,
    textColor: "#ffffff",
    hiColor: "#000000",
    editBackgroundColor: "#526fbf"
  },
  "Violet": {
    left: 5,
    right: 5,
    top: 10,
    bottom: 8,
    hasOverState: true,
    hasClickState: true,
    clickStateIsNormalState: true,
    textColor: "#ffffff",
    hiColor: "#000000",
    editBackgroundColor: "#c054c0"
  },
  "Flash Style": {
    left: 5,
    right: 5,
    top: 5,
    bottom: 5,
    hasOverState: false,
    hasClickState: false,
    editBackgroundColor: "#efefef"
  },
  "Blue Gel": {
    left: 23,
    right: 23,
    top: 10,
    bottom: 10,
    hasOverState: false,
    hasClickState: false,
    textColor: "#ffffff",
    editBackgroundColor: "#3072ee",
    width: 125
  },
  "Red Gel": {
    left: 23,
    right: 23,
    top: 10,
    bottom: 10,
    hasOverState: false,
    hasClickState: false,
    textColor: "#ffffff",
    editBackgroundColor: "#ec352f",
    width: 125
  },
  "Brown Gel": {
    left: 23,
    right: 23,
    top: 10,
    bottom: 10,
    hasOverState: false,
    hasClickState: false,
    textColor: "#ffffff",
    editBackgroundColor: "#eca430",
    width: 125
  },
  "Purple Gel": {
    left: 23,
    right: 23,
    top: 10,
    bottom: 10,
    hasOverState: false,
    hasClickState: false,
    textColor: "#ffffff",
    editBackgroundColor: "#712be9",
    width: 125
  },
  "Green Gel": {
    left: 23,
    right: 23,
    top: 10,
    bottom: 10,
    hasOverState: false,
    hasClickState: false,
    textColor: "#ffffff",
    editBackgroundColor: "#6eec2f",
    width: 125
  }
}


pui.widgets.getStyledButtonProxy = function(defaults) {
  var bstyle = defaults["button style"];
  var parms = {};
  parms.dom = document.createElement("div");
  parms.dom.style.position = "relative";
  parms.dom.style.width = "100px";
  if (defaults.width != null) parms.dom.style.width = defaults.width;
  parms.dom.style.height = "23px";
  parms.isProxy = true;
  
  parms.properties = {};
  parms.properties.width = "100px";
  if (defaults.width != null) parms.properties.width = defaults.width;
  parms.properties.height = "23px"
  parms.properties.value = "Click Here";
  parms.properties["button style"] = bstyle;
  parms.evalProperty = function(propName) {
    return parms.properties[propName];
  }
  pui.widgets["styled button"].propertySetters["field type"](parms);
  
  var textColor =  pui.widgets.buttonStyles[bstyle].textColor;
  if (textColor != null) parms.dom.button.textDiv.style.color = textColor;
  
  if (defaults["font size"] != null) parms.dom.button.textDiv.style.fontSize = defaults["font size"];
  if (defaults["font family"] != null) parms.dom.button.textDiv.style.fontFamily = defaults["font family"];
  if (defaults["font weight"] != null) parms.dom.button.textDiv.style.fontWeight = defaults["font weight"];
  if (defaults["text align"] != null) parms.dom.button.textDiv.style.textAlign = defaults["text align"];
  
  return parms.dom;
}

pui.widgets.setStyledButtonImages = function(bstyle, buttonObj, state) {
  var path = pui.normalizeURL("/profoundui/proddata/images/buttons/" + bstyle + "/");
  buttonObj.topLeftDiv.style.backgroundImage = "url('" + path + "topleft" + state + ".png')";      
  buttonObj.topMiddleDiv.style.backgroundImage = "url('" + path + "topmiddle" + state + ".png')";
  buttonObj.topRightDiv.style.backgroundImage = "url('" + path + "topright" + state + ".png')";          
  buttonObj.leftImage.src = path + "left" + state + ".png";
  buttonObj.middleImage.src = path + "middle" + state + ".png";
  buttonObj.rightImage.src = path + "right" + state + ".png";
  buttonObj.leftImage.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + path + "left" + state + ".png" + "', sizingMethod='scale')";
  buttonObj.middleImage.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + path + "middle" + state + ".png" + "', sizingMethod='scale')";
  buttonObj.rightImage.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + path + "right" + state + ".png" + "', sizingMethod='scale')";
  buttonObj.bottomLeftDiv.style.backgroundImage = "url('" + path + "bottomleft" + state + ".png')";
  buttonObj.bottomMiddleDiv.style.backgroundImage = "url('" + path + "bottommiddle" + state + ".png')";
  buttonObj.bottomRightDiv.style.backgroundImage = "url('" + path + "bottomright" + state + ".png')";
  // preload -hi and -click images into cache
  var settings = pui.widgets.buttonStyles[bstyle];
  if (settings != null && settings.cached != true) {
    function preload(imageName) {
      var image = new Image(); 
      image.src = path + imageName + ".png";
    }
    if (settings.hasOverState == true && state != "-hi") {
      preload("topleft-hi");
      preload("topmiddle-hi");
      preload("topright-hi");
      preload("left-hi");
      preload("middle-hi");
      preload("right-hi");
      preload("bottomleft-hi");
      preload("bottommiddle-hi");
      preload("bottomright-hi");
    }
    if (settings.hasClickState == true && settings.clickStateIsNormalState != true && state != "-click") {
      preload("topleft-click");
      preload("topmiddle-click");
      preload("topright-click");
      preload("left-click");
      preload("middle-click");
      preload("right-click");
      preload("bottomleft-click");
      preload("bottommiddle-click");
      preload("bottomright-click");
    }
    settings.cached = true;
  }
}

pui.widgets.resizeStyledButton = function(button, settings, width, height, parms) {

  if (typeof width == "string") {
    if (width != "" && !isNaN(width)) width += "px";
    if (width.length >= 3 && width.substr(width.length - 2) == "px") width = parseInt(width);
    else width = button.topLeftDiv.parentNode.offsetWidth;
  }
  if (typeof height == "string") {
    if (height != "" && !isNaN(height)) height += "px";
    if (height.length >= 3 && height.substr(height.length - 2) == "px") height = parseInt(height);
    else height = button.topLeftDiv.parentNode.offsetHeight;
  }  
  if (typeof width != "number") width = parseInt(width);
  if (isNaN(width)) width = 100;
  if (typeof height != "number") height = parseInt(height);
  if (isNaN(height)) height = 23;

  var resized = false;
  if (height < settings.top + settings.bottom) {
    height = settings.top + settings.bottom;
    button.textDiv.parentNode.style.height = height + "px";    
    resized = true;
  }
  if (width < settings.left + settings.right) {
    width = settings.left + settings.right;
    button.textDiv.parentNode.style.width = width + "px";
    resized = true;
  }
  if (resized && parms != null && parms.design == true) {
    parms.designItem.designer.selection.positionSizies();
  }

  button.topLeftDiv.style.width = settings.left + "px";
  button.topLeftDiv.style.height = settings.top + "px";

  button.topMiddleDiv.style.left = settings.left + "px";
  button.topMiddleDiv.style.height = settings.top + "px";
  button.topMiddleDiv.style.width = (width - settings.left - settings.right) + "px";
  
  button.topRightDiv.style.left = (width - settings.right) + "px";
  button.topRightDiv.style.height = settings.top + "px";
  button.topRightDiv.style.width = settings.right + "px";

  button.leftImage.style.top = settings.top + "px";
  button.leftImage.style.width = settings.left + "px";
  button.leftImage.style.height = (height - settings.top - settings.bottom) + "px";

  button.middleImage.style.left = settings.left + "px";
  button.middleImage.style.top = settings.top + "px";
  button.middleImage.style.width = (width - settings.left - settings.right) + "px";
  button.middleImage.style.height = (height - settings.top - settings.bottom) + "px";

  button.rightImage.style.left = (width - settings.right) + "px";
  button.rightImage.style.top = settings.top + "px";
  button.rightImage.style.width = settings.right + "px";
  button.rightImage.style.height = (height - settings.top - settings.bottom) + "px";

  button.bottomLeftDiv.style.top = (height - settings.bottom) + "px";
  button.bottomLeftDiv.style.width = settings.left + "px";
  button.bottomLeftDiv.style.height = settings.bottom + "px";

  button.bottomMiddleDiv.style.left = settings.left + "px";
  button.bottomMiddleDiv.style.top = (height - settings.bottom) + "px";
  button.bottomMiddleDiv.style.height = settings.bottom + "px";
  button.bottomMiddleDiv.style.width = (width - settings.left - settings.right) + "px";
  
  button.bottomRightDiv.style.left = (width - settings.right) + "px";
  button.bottomRightDiv.style.top = (height - settings.bottom) + "px";
  button.bottomRightDiv.style.height = settings.bottom + "px";
  button.bottomRightDiv.style.width = settings.right + "px";

  button.textDiv.style.left = settings.left + "px";
  button.textDiv.style.top = "0px";
  button.textDiv.style.width = (width - settings.left - settings.right) + "px";
  button.textDiv.style.height = height + "px";
  button.textDiv.style.lineHeight = height + "px";

}


pui.widgets.add({
  name: "styled button",
  newValue: "Click Here",
  inlineEdit: true,
  defaults: {
    "width": "100px",
    "height": "23px",
    "button style": "Ice Blue"    
  },
  
  propertySetters: {

    "field type": function(parms) {

      parms.dom.sizeMe = function() {
        var bstyle = parms.properties["button style"];
        var settings = pui.widgets.buttonStyles[bstyle];
        if (settings == null) {
          var bstyle = pui.widgets.getButtonStyles()[0];
          settings = pui.widgets.buttonStyles[bstyle];
        }
        var button = parms.dom.button;
        pui.widgets.resizeStyledButton(button, settings, parms.dom.offsetWidth, parms.dom.offsetHeight, parms);
      }

      parms.dom.style.textAlign = "center";
      //parms.dom.style.fontFamily = "Arial";
      //parms.dom.style.color = "#335588";
      if (parms.properties.color != null) {
        parms.dom.style.color = parms.properties.color;
      }
      //parms.dom.style.fontSize = "12px";
      //parms.dom.style.fontWeight = "bold";

      parms.dom.innerHTML = "";
      
      var button = {};
      
      button.topLeftDiv = document.createElement("div");
      button.topMiddleDiv = document.createElement("div");
      button.topRightDiv = document.createElement("div");
      button.leftImage = document.createElement("img");
      button.middleImage = document.createElement("img");
      button.rightImage = document.createElement("img");
      button.bottomLeftDiv = document.createElement("div");
      button.bottomMiddleDiv = document.createElement("div");
      button.bottomRightDiv = document.createElement("div");      
      button.textDiv = document.createElement("div");

      button.topLeftDiv.style.position = "absolute";
      button.topLeftDiv.style.padding = "0px";
      button.topLeftDiv.style.margin = "0px";
      button.topMiddleDiv.style.position = "absolute";
      button.topMiddleDiv.style.padding = "0px";
      button.topMiddleDiv.style.margin = "0px";
      button.topRightDiv.style.position = "absolute";
      button.topRightDiv.style.padding = "0px";
      button.topRightDiv.style.margin = "0px";      
      button.leftImage.style.position = "absolute";
      button.leftImage.style.padding = "0px";
      button.leftImage.style.margin = "0px";
      button.middleImage.style.position = "absolute";
      button.middleImage.style.padding = "0px";
      button.middleImage.style.margin = "0px";
      button.rightImage.style.position = "absolute";
      button.rightImage.style.padding = "0px";
      button.rightImage.style.margin = "0px";      
      button.bottomLeftDiv.style.position = "absolute";
      button.bottomLeftDiv.style.padding = "0px";
      button.bottomLeftDiv.style.margin = "0px";
      button.bottomMiddleDiv.style.position = "absolute";
      button.bottomMiddleDiv.style.padding = "0px";
      button.bottomMiddleDiv.style.margin = "0px";
      button.bottomRightDiv.style.position = "absolute";
      button.bottomRightDiv.style.padding = "0px";
      button.bottomRightDiv.style.margin = "0px";
      
      button.topLeftDiv.style.top = "0px";
      button.topLeftDiv.style.left = "0px";
      button.topLeftDiv.style.backgroundRepeat = "no-repeat";
      
      button.topMiddleDiv.style.top = "0px";
      button.topMiddleDiv.style.backgroundRepeat = "repeat-x";
      
      button.topRightDiv.style.top = "0px";
      button.topRightDiv.style.backgroundRepeat = "no-repeat";
      
      button.leftImage.style.left = "0px";
                  
      button.bottomLeftDiv.style.left = "0px";
      button.bottomLeftDiv.style.backgroundRepeat = "no-repeat";
      
      button.bottomMiddleDiv.style.backgroundRepeat = "repeat-x";
      
      button.bottomRightDiv.style.backgroundRepeat = "no-repeat";
      
      button.textDiv.style.position = "absolute";
      button.textDiv.style.verticalAlign = "middle";
      //button.textDiv.style.display = "table-cell";
      button.textDiv.style.display = "";
      //if (!pui.iPadEmulation) {
      //  button.textDiv.style.cursor = "default";
      //}
      button.textDiv.style.overflow = "hidden";
      button.textDiv.onselectstart = function(e) { return false };
      if (typeof button.textDiv.style.MozUserSelect!="undefined") button.textDiv.style.MozUserSelect = "none";
      
      // default styling
      button.textDiv.style.textAlign = "center";
      if (parms.properties["text align"] != null) {
        button.textDiv.style.textAlign = parms.properties["text align"];
      }
      //button.textDiv.style.fontFamily = "Arial";
      if (parms.properties["font family"] != null) {
        button.textDiv.style.fontFamily = parms.properties["font family"];
      }
      //button.textDiv.style.color = "#335588";
      if (parms.properties.color != null) {
         button.textDiv.style.color = parms.properties.color;
      }
      //button.textDiv.style.fontSize = "12px";
      if (parms.properties["font size"] != null) {
        button.textDiv.style.fontSize = parms.properties["font size"];
      }
      //button.textDiv.style.fontWeight = "bold";
      if (parms.properties["font weight"] != null) {
        button.textDiv.style.fontWeight = parms.properties["font weight"];
      }

      function mouseover(e) {
        if ( (parms.dom.getAttribute!=null && parms.dom.getAttribute("disabled")=="true" )
          || ( parms.dom.disabled!=null && parms.dom.disabled==true ) ) {
          return;
        }
        parms.dom.mouseIsOver = true;
        if (parms.dom.clickedDown == true) return;
        var bstyle = parms.dom.button.bstyle;
        var settings = pui.widgets.buttonStyles[bstyle];
        if (settings == null) {
          var bstyle = pui.widgets.getButtonStyles()[0];
          settings = pui.widgets.buttonStyles[bstyle];
        }
        if (settings.hasOverState) {
          pui.widgets.setStyledButtonImages(bstyle, parms.dom.button, "-hi");
        }
        if (settings.hiColor != null) {
          parms.dom.button.textDiv.style.color = settings.hiColor;
        }
      }      
      if (parms.isProxy != true) addEvent(parms.dom, "mouseover", mouseover);

      function mouseout(e) {
        parms.dom.mouseIsOver = false;
        if (parms.dom.clickedDown == true) return;
        if (pui["is_old_ie"]) {
          var rel = e.relatedTarget || e.toElement;
          if (rel && rel != parms.dom) rel = rel.parentNode;
          if (rel == parms.dom) return;        
        }
          
        var bstyle = parms.dom.button.bstyle;
        var settings = pui.widgets.buttonStyles[bstyle];
        if (settings == null) {
          var bstyle = pui.widgets.getButtonStyles()[0];
          settings = pui.widgets.buttonStyles[bstyle];
        }
        if (settings.hasOverState) {
          pui.widgets.setStyledButtonImages(bstyle, parms.dom.button, "");
        }
        if (settings.hiColor != null) {
          var textColor = parms.properties["color"];
          if (textColor == null) textColor = settings.textColor;
          //if (textColor == null) textColor = "#335588";
          parms.dom.button.textDiv.style.color = textColor;
        }
      }      
      if (parms.isProxy != true) addEvent(parms.dom, "mouseout", mouseout);
      
      function mousedown(event) {
        if ( (parms.dom.getAttribute!=null && parms.dom.getAttribute("disabled")=="true" )
          || ( parms.dom.disabled!=null && parms.dom.disabled==true ) ) {
          return;
        }
        if (pui.isRightClick(event)) return;
        parms.dom.clickedDown = true;
        var bstyle = parms.dom.button.bstyle;
        var settings = pui.widgets.buttonStyles[bstyle];
        if (settings == null) {
          var bstyle = pui.widgets.getButtonStyles()[0];
          settings = pui.widgets.buttonStyles[bstyle];
        }
        parms.dom.button.textDiv.style.left = (settings.left + 1) + "px";
        parms.dom.button.textDiv.style.top = "1px";
        if (settings.hasClickState) {
          var state = "-click";
          if (settings.clickStateIsNormalState == true) state = "";
          pui.widgets.setStyledButtonImages(bstyle, parms.dom.button, state);
        }
      }
      if (parms.isProxy != true) addEvent(parms.dom, "mousedown", mousedown);
      
      function mouseup() {
        parms.dom.clickedDown = false;
        var bstyle = parms.dom.button.bstyle;
        var settings = pui.widgets.buttonStyles[bstyle];
        if (settings == null) {
          var bstyle = pui.widgets.getButtonStyles()[0];
          settings = pui.widgets.buttonStyles[bstyle];
        }
        parms.dom.button.textDiv.style.left = settings.left + "px";
        parms.dom.button.textDiv.style.top = "0px";        
        if (settings.hasClickState) {
          var state = "";
          //button.textDiv.style.color = "#335588";
          //if (parms.properties.color != null) {
             button.textDiv.style.color = parms.properties.color;
          //}
          if (settings.hasOverState && parms.dom.mouseIsOver == true) {
            state = "-hi";
            if (settings.hiColor != null) {
              parms.dom.button.textDiv.style.color = settings.hiColor;
            }
          }
          pui.widgets.setStyledButtonImages(bstyle, parms.dom.button, state);
        }
      }
      if (parms.isProxy != true) {
        addEvent(document, "mouseup", mouseup);
      }

      parms.dom.appendChild(button.topLeftDiv);
      parms.dom.appendChild(button.topMiddleDiv);
      parms.dom.appendChild(button.topRightDiv);
      parms.dom.appendChild(button.leftImage);
      parms.dom.appendChild(button.middleImage);
      parms.dom.appendChild(button.rightImage);
      parms.dom.appendChild(button.bottomLeftDiv);
      parms.dom.appendChild(button.bottomMiddleDiv);
      parms.dom.appendChild(button.bottomRightDiv);
      parms.dom.appendChild(button.textDiv);
      
      parms.dom.button = button;
      
      var savedValue = parms.value;
      parms.value = parms.properties["button style"];
      pui.widgets["styled button"].propertySetters["button style"](parms);
      parms.value = savedValue;
      
      parms.dom.button.textDiv.innerHTML = parms.evalProperty("value");
    },
        
    "button style": function(parms) { 
      var bstyle = parms.value;      
      var settings = pui.widgets.buttonStyles[bstyle];
      if (settings == null) {
        var bstyle = pui.widgets.getButtonStyles()[0];
        settings = pui.widgets.buttonStyles[bstyle];
      }
      var path = pui.normalizeURL("/profoundui/proddata/images/buttons/" + bstyle + "/");
      parms.dom.button.bstyle = bstyle;
      var button = parms.dom.button;
      
      pui.widgets.setStyledButtonImages(bstyle, button, "");
      button.textDiv.className = "styled-button " + bstyle.split(" ").join("-").toLowerCase() + "-button";
      
      pui.widgets.resizeStyledButton(button, settings, parms.properties["width"], parms.properties["height"]);
    },

    "value": function(parms) {
      parms.dom.button.textDiv.innerHTML = parms.value;
    },

    "width": function(parms) {
      if (pui.isNumericString(parms.value)) parms.dom.style.width = parms.value + "px";
      else parms.dom.style.width = parms.value;
      
      var bstyle = parms.properties["button style"];
      var settings = pui.widgets.buttonStyles[bstyle];
      if (settings == null) {
        var bstyle = pui.widgets.getButtonStyles()[0];
        settings = pui.widgets.buttonStyles[bstyle];
      }
      var button = parms.dom.button;
      
      pui.widgets.resizeStyledButton(button, settings, parms.value, parms.properties["height"], parms);
    },
    
    "height": function(parms) {
      if (pui.isNumericString(parms.value)) parms.dom.style.height = parms.value + "px";
      else parms.dom.style.height = parms.value;
      
      var bstyle = parms.properties["button style"];
      var settings = pui.widgets.buttonStyles[bstyle];
      if (settings == null) {
        var bstyle = pui.widgets.getButtonStyles()[0];
        settings = pui.widgets.buttonStyles[bstyle];
      }
      var button = parms.dom.button;
      
      pui.widgets.resizeStyledButton(button, settings, parms.properties["width"], parms.value, parms);
    },
    
    "color": function(parms) {
      var value = parms.value;
      //if (value == null || value == "") value = "#335588";
      parms.dom.button.textDiv.style.color = value;
    },
    
    "font family": function(parms) {
      var value = parms.value;
      //if (value == null || value == "") value = "Arial";
      parms.dom.button.textDiv.style.fontFamily = value;
    },
    
    "font size": function(parms) {
      var value = parms.value;
      //if (value == null || value == "") value = "12px";
      parms.dom.button.textDiv.style.fontSize = value;
    },
    
    "font style": function(parms) {
      parms.dom.button.textDiv.style.fontStyle = parms.value;
    },

    "font variant": function(parms) {
      parms.dom.button.textDiv.style.fontVariant = parms.value;
    },

    "font weight": function(parms) {
      var value = parms.value;
      //if (value == null || value == "") value = "bold";
      parms.dom.button.textDiv.style.fontWeight = value;
    },

    "letter spacing": function(parms) {
      parms.dom.button.textDiv.style.letterSpacing = parms.value;
    },

    "text align": function(parms) {
      var value = parms.value;
      if (value == null || value == "") value = "center";
      parms.dom.button.textDiv.style.textAlign = value;
    },

    "text decoration": function(parms) {
      parms.dom.button.textDiv.style.textDecoration = parms.value;
    },

    "text transform": function(parms) {
      parms.dom.button.textDiv.style.textTransform = parms.value;
    },
    
    "word spacing": function(parms) {
      parms.dom.button.textDiv.style.wordSpacing = parms.value;
    }

  }
  
});

