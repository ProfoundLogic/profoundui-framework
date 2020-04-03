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



/**
 * CSS Panel Header
 * @constructor
 */

pui.CSSPanelSection = function() {
  this.container = null;
  this.type = "body";
  this.forLayout = false;
  
  var mainSpan;
  var innerSpan;
  var textSpan;
  var iconSpan;
  var layoutContainer;
  
  var swatch = "c";
  var swatchLength = 1;
  
  var me = this;

  this.init = function() {
    mainSpan = document.createElement("span");
    innerSpan = document.createElement("span");
    if (me.type == "header") textSpan = document.createElement("span");
    mainSpan.className = "ui-btn ui-shadow ui-btn-corner-all ui-btn-up-" + swatch + " no-shadow";
    mainSpan.style.marginTop = "0";
    mainSpan.style.marginBottom = "0";
    mainSpan.style.cursor = "default";
    innerSpan.className = "ui-btn-inner ui-btn-corner-all";
    if (me.type == "header") {
      textSpan.className = "ui-btn-text";
      innerSpan.appendChild(textSpan);
    }
    if (me.forLayout && me.type == "body") {
      layoutContainer = document.createElement("div");
      layoutContainer.setAttribute("container", "true");
      layoutContainer.style.position = "absolute";
      layoutContainer.style.width = "100%";
      layoutContainer.style.height = "100%";
      layoutContainer.style.overflow = "hidden";
      mainSpan.appendChild(layoutContainer); 
    }
    mainSpan.appendChild(innerSpan);
    me.container.appendChild(mainSpan);
  }
  
  this.setText = function(text) {
    if (me.type != "header") return;
    if (text == null || pui.isBound(text) || pui.isTranslated(text) || pui.isWorkflow(text)) text = "";
    textSpan.innerHTML = text;
  }
  
  this.setSwatch = function(newSwatch) {
    if (newSwatch == null || newSwatch == "" || pui.isBound(newSwatch)) newSwatch = "c";  // default

    //Preconfigured themes A-G have the format 'A - Black'
    //'B - Blue', etc. This makes sure only 'A', 'B', etc is used 
    //for the class generation
    var regex = / - {1}.*/g;
    newSwatch = newSwatch.replace(regex, '');
    
    newSwatch = newSwatch.toLowerCase();
    if (swatch == newSwatch) return;
    var classes = mainSpan.className.split(" ");
    for (var i = 0; i < classes.length; i++) {
      var cls = classes[i];
      if (cls.length > 2 && cls.substr(cls.length - (swatchLength + 1), swatchLength + 1) == "-" + swatch) {
        var newCls = cls.substr(0, cls.length - swatchLength) + newSwatch;
        pui.removeCssClass(mainSpan, cls);
        pui.addCssClass(mainSpan, newCls);
        break;
      }
    }
    swatch = newSwatch;
    swatchLength = swatch.length;
  }
  
  this.setStraightEdge = function(edge) {
    if (edge == null || pui.isBound(edge)) return;
    mainSpan.style.borderTopLeftRadius = "";
    mainSpan.style.borderTopRightRadius = "";
    mainSpan.style.borderBottomLeftRadius = "";
    mainSpan.style.borderBottomRightRadius = "";
    innerSpan.style.borderTopLeftRadius = "";
    innerSpan.style.borderTopRightRadius = "";
    innerSpan.style.borderBottomLeftRadius = "";
    innerSpan.style.borderBottomRightRadius = "";
    switch(edge) {
      case "left":
        mainSpan.style.borderTopLeftRadius = "0";
        mainSpan.style.borderBottomLeftRadius = "0";
        innerSpan.style.borderTopLeftRadius = "0";
        innerSpan.style.borderBottomLeftRadius = "0";
        break;
      case "right":
        mainSpan.style.borderTopRightRadius = "0";
        mainSpan.style.borderBottomRightRadius = "0";
        innerSpan.style.borderTopRightRadius = "0";
        innerSpan.style.borderBottomRightRadius = "0";       
        break;
      case "top":
        mainSpan.style.borderTopRightRadius = "0";
        mainSpan.style.borderTopLeftRadius = "0";
        innerSpan.style.borderTopRightRadius = "0";
        innerSpan.style.borderTopLeftRadius = "0";
        break;
      case "bottom":
        mainSpan.style.borderBottomRightRadius = "0";
        mainSpan.style.borderBottomLeftRadius = "0";
        innerSpan.style.borderBottomRightRadius = "0";
        innerSpan.style.borderBottomLeftRadius = "0";
        break;
      case "all":
        mainSpan.style.borderTopLeftRadius = "0";
        mainSpan.style.borderBottomLeftRadius = "0";
        mainSpan.style.borderTopRightRadius = "0";
        mainSpan.style.borderBottomRightRadius = "0";
        innerSpan.style.borderTopLeftRadius = "0";
        innerSpan.style.borderBottomLeftRadius = "0";
        innerSpan.style.borderTopRightRadius = "0";
        innerSpan.style.borderBottomRightRadius = "0";       
        break;      
      default:
        break;
    }
  }
  
  this.setHeight = function(height) {
    if (typeof height == "number") height = height + "px";
    mainSpan.style.height = height;
  }
  
  this.setStyle = function(styleName, styleValue) {
    if (me.type != "header") return;  
    if (pui.isBound(styleValue)) styleValue = "";
    var parts = styleName.split(" ");
    if (parts.length == 2) {
      styleName = parts[0] + parts[1].substr(0, 1).toUpperCase() + parts[1].substr(1);
    }
    if (styleName == "textAlign") {
      mainSpan.style[styleName] = styleValue;
    }
    else {
      textSpan.style[styleName] = styleValue;
    }
  }
  
  this.setAllStyles = function(properties) {
    var styles = ["color", "font family", "font size", "font style", "font variant", "font weight", "letter spacing", "text align", "text decoration", "text transform", "word spacing"];
    for (var i = 0; i < styles.length; i++) {
      var style = styles[i];
      var value = properties[style];
      if (value != null) me.setStyle(style, value);
    }
  }

  this.setLineHeight = function(containerHeight) {
    if (me.type != "header") return;
    if (me.container == null) return;
    if (containerHeight != null) {
      me.container.style.height = containerHeight;
    }
    if (me.container.style.height != null && me.container.style.height != "") {
      var height = link.offsetHeight - 26;
      if (height < 0) height = 0;
      textSpan.style.lineHeight =  height + "px";
    }
    else {
      textSpan.style.lineHeight = null;
    }
  }

  this.getMainSpan = function() {
    return mainSpan;
  }

  this.getInnerSpan = function() {
    return mainSpan;
  }

  this.getTextSpan = function() {
    return textSpan;
  }

}



/**
 * CSS Panel
 * @constructor
 */

pui.CSSPanel = function() {
  this.container = null;
  this.forLayout = false;
  
  var headerDiv;
  var bodyDiv;
  var headerPanel;
  var bodyPanel;
  var hasHeader = true;
  var headerHeight = 40;
  var straightEdge = "none";
  
  var me = this;  
  
  this.init = function() {
    headerDiv = document.createElement("div");
    bodyDiv = document.createElement("div");
    headerDiv.style.position = "absolute";
    headerDiv.style.left = "0px";
    headerDiv.style.top = "0px";
    headerDiv.style.width = "100%";
    bodyDiv.style.position = "absolute";
    bodyDiv.style.left = "0px";
    bodyDiv.style.width = "100%";
    headerPanel = new pui.CSSPanelSection();
    headerPanel.type = "header";
    headerPanel.forLayout = me.forLayout;
    headerPanel.container = headerDiv;
    headerPanel.init();
    headerPanel.setSwatch("b");
    headerPanel.setHeight("100%");
    bodyPanel = new pui.CSSPanelSection();
    bodyPanel.type = "body";
    bodyPanel.forLayout = me.forLayout;
    bodyPanel.container = bodyDiv;
    bodyPanel.init();
    bodyPanel.setHeight("100%");
    me.setStraightEdge("none");
    me.container.appendChild(headerDiv);
    me.container.appendChild(bodyDiv);
    me.resize();

    var windowDiv = me.container.parentNode;
    if (windowDiv != null && windowDiv.isPUIWindow == true) {
      me.makeDraggable();
    }
    if (windowDiv == null) {
      setTimeout(function() {
        var windowDiv = me.container.parentNode;
        if (windowDiv != null && windowDiv.isPUIWindow == true) {
          me.makeDraggable();
        }
      }, 0);
    }
  }
  
  this.makeDraggable = function() {
    var windowDiv = me.container.parentNode;
    
    pui.makeMovable({attachto: headerDiv, move: windowDiv, boundat: 'click'});
  
    addEvent(headerDiv, "touchstart", function(e) {
      if (e.touches.length != 1) return;  // Only deal with one finger
      var touch = e.touches[0];
      windowDiv.touch = {};
      windowDiv.touch.startX = touch.pageX;
      windowDiv.touch.startY = touch.pageY;
      windowDiv.touch.startLeft = parseInt(windowDiv.style.left);
      windowDiv.touch.startTop = parseInt(windowDiv.style.top);
    });
    addEvent(headerDiv, "touchmove", function(e) {
      if (e.touches.length != 1) return;  // Only deal with one finger
      var touch = e.touches[0];
      var x = touch.pageX;
      var y = touch.pageY;
      windowDiv.style.left = (windowDiv.touch.startLeft - windowDiv.touch.startX + x) + "px";
      windowDiv.style.top = (windowDiv.touch.startTop - windowDiv.touch.startY + y) + "px";
      e.preventDefault();
    });
    headerDiv.style.cursor = "move";
    if( headerDiv.firstChild != null) //avoid null error in IE9,IE10.
      headerDiv.firstChild.style.cursor = "move";
  };

  this.setHasHeader = function(flag) {
    if (flag) {
      headerDiv.style.display = "";
    }
    else {
      headerDiv.style.display = "none";
    }
    hasHeader = flag;
    me.setStraightEdge(straightEdge);
    me.resize();
  }
  
  this.setHeaderHeight = function(height) {
    height = parseInt(height);
    if (isNaN(height) || height <= 0) height = 40;  // default
    headerHeight = height;    
    me.resize();
  }

  this.setStraightEdge = function(edge) {
    if (edge == null || pui.isBound(edge)) return;
    straightEdge = edge;
    if (!hasHeader) {
      bodyPanel.setStraightEdge(edge);
      return;
    }
    switch(edge) {
      case "left":
        headerPanel.setStraightEdge("left");
        headerPanel.getMainSpan().style.borderBottomRightRadius = "0";
        headerPanel.getInnerSpan().style.borderBottomRightRadius = "0";
        bodyPanel.setStraightEdge("left");
        bodyPanel.getMainSpan().style.borderTopRightRadius = "0";
        bodyPanel.getInnerSpan().style.borderTopRightRadius = "0";
        break;
      case "right":
        headerPanel.setStraightEdge("right");
        headerPanel.getMainSpan().style.borderBottomLeftRadius = "0";
        headerPanel.getInnerSpan().style.borderBottomLeftRadius = "0";
        bodyPanel.setStraightEdge("right");
        bodyPanel.getMainSpan().style.borderTopLeftRadius = "0";
        bodyPanel.getInnerSpan().style.borderTopLeftRadius = "0";
        break;
      case "top":
        headerPanel.setStraightEdge("all");
        bodyPanel.setStraightEdge("top");
        break;
      case "bottom":
        headerPanel.setStraightEdge("bottom");
        bodyPanel.setStraightEdge("all");
        break;
      case "all":
        headerPanel.setStraightEdge("all");
        bodyPanel.setStraightEdge("all");
        break;      
      default:
        headerPanel.setStraightEdge("bottom");
        bodyPanel.setStraightEdge("top");
        break;
    }
  }
  
  this.setText = function(text) {
    headerPanel.setText(text);
  }
  
  this.getTextSpan = function() {
    return headerPanel.getTextSpan();
  }
  
  this.setStyle = function(styleName, styleValue) {
    headerPanel.setStyle(styleName, styleValue);
  }

  this.setAllStyles = function(properties) {
    headerPanel.setAllStyles(properties);
  }
  
  this.setHeaderSwatch = function(swatch) {
    headerPanel.setSwatch(swatch);
  }

  this.setBodySwatch = function(swatch) {
    bodyPanel.setSwatch(swatch);
  }
  
  this.resize = function(newHeight) {
    var totalHeight;
    if (typeof newHeight == "string") {
      if (newHeight.length < 3 || newHeight.substr(newHeight.length - 2, 2) != "px") {
        newHeight = null;
      }
    }
    if (newHeight != null && !isNaN(parseInt(newHeight))) totalHeight = parseInt(newHeight);
    else totalHeight = me.container.offsetHeight;
    var hdrHeight = headerHeight;
    if (!hasHeader) hdrHeight = - 1;
    var bodyHeight = totalHeight - hdrHeight - 5;
    if (bodyHeight < 0) bodyHeight = 0;
    if (hasHeader) headerDiv.style.height = hdrHeight + "px";
    bodyDiv.style.top = (hdrHeight + 1) + "px";
    bodyDiv.style.height = bodyHeight + "px";
  }
  
  this.setHeight = function(height) {
    me.container.style.height = height;
    me.resize(height);
  }
  
  this.getHeaderMainSpan = function() {
    return headerPanel.getMainSpan();
  }
  
  this.getHeaderHeight = function() {
    return headerHeight;
  }

}





pui.widgets.getCSSPanelProxy = function(defaultParms) {
  var defaults = {};
  for (var x in defaultParms) {
    defaults[x] = defaultParms[x];
  }
  if (defaults.value == null) defaults.value = "Panel Title";
  if (defaults.width == null) defaults.width = "200px";
  if (defaults.height == null) defaults.height = "300px";
  if (defaults["header theme"] == null) defaults["header theme"] = "B - Blue";
  if (defaults["body theme"] == null) defaults["body theme"] = "C - Gray";
  var dom = document.createElement("div");
  dom.style.width = defaults.width;
  dom.style.height = defaults.height;
  dom.style.position = "relative";
  var panel = new pui.CSSPanel();
  panel.container = dom;
  panel.init();
  panel.setText(defaults["value"]);
  panel.setHeaderSwatch(defaults["header theme"]);
  panel.setBodySwatch(defaults["body theme"]);
  panel.setStraightEdge(defaults["straight edge"]);
  panel.setHasHeader(defaults["has header"] !== "false" && defaults["has header"] !== false);
  panel.setHeaderHeight(defaults["header height"]);
  panel.setHeight(defaults["height"]);  
  return dom;
}





pui.widgets.add({
  name: "css panel",
  menuName: "CSS Panel",
  newId: "Panel",
  newValue: "Panel Title",
  inlineEdit: true,
  defaults: {
    "width": "200px",
    "height": "300px",
    "z index": "8"
  },
  
  globalPropertySetter: function(parms) {
    switch(parms.propertyName) {
      case "color":
      case "font family":
      case "font size":
      case "font style":
      case "font variant":
      case "font weight":
      case "letter spacing":
      case "text align":
      case "text decoration":
      case "text transform":
      case "word spacing":
        parms.dom.panel.setStyle(parms.propertyName, parms.value);
        break;
      default:
        break;
    }
  },
  
  propertySetters: {

    "field type": function(parms) {
      
      parms.dom.sizeMe = function() {
        parms.dom.panel.resize();
      }
      
      var panel = new pui.CSSPanel();
      panel.container = parms.dom;
      parms.dom.innerHTML = "";
      panel.init();
      parms.dom.panel = panel;
      var height = parms.evalProperty("height");
      if (height != null) panel.setHeight(height);
      panel.setText(parms.evalProperty("value"));
      panel.setHeaderSwatch(parms.evalProperty("header theme"));
      panel.setBodySwatch(parms.evalProperty("body theme"));
      panel.setStraightEdge(parms.evalProperty("straight edge"));
      var hasHeader = parms.evalProperty("has header");
      hasHeader = (hasHeader !== "false" && hasHeader !== false);
      panel.setHasHeader(hasHeader);
      panel.setHeaderHeight(parms.evalProperty("header height"));
    },
    
    "header theme": function(parms) {
      parms.dom.panel.setHeaderSwatch(parms.value);
    },

    "body theme": function(parms) {
      parms.dom.panel.setBodySwatch(parms.value);
    },

    "value": function(parms) {
      parms.dom.panel.setText(parms.value);
    },

    "straight edge": function(parms) {
      parms.dom.panel.setStraightEdge(parms.value);
    },

    "has header": function(parms) {
      var hasHeader = (parms.value !== "false" && parms.value !== false);
      parms.dom.panel.setHasHeader(hasHeader);
    },

    "header height": function(parms) {
      parms.dom.panel.setHeaderHeight(parms.value);
    },
    
    "height": function(parms) {
      parms.dom.panel.setHeight(parms.value);
    }

  }
  
});

