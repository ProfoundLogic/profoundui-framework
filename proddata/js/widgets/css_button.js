//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2013 Profound Logic Software, Inc.
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
 * CSS Button Class
 * @constructor
 */

pui.CSSButton = function() {
  this.container = null;
  this.designMode = null;
  this.forProxy = false;
  
  var link;
  var innerSpan;
  var textSpan;
  var iconSpan;
  
  var swatch = "a";
  var disabled = false;
  var iconShadowClass = " ui-icon-shadow";
  if (is_firefox) iconShadowClass = "";
  
  var me = this;

  this.init = function() {
    if (me.forProxy) {
      link = document.createElement("span");  // using span circumvents conflicting Ext .x-dd-drag-ghost class css rule
    }
    else {
      link = document.createElement("a");
    }  
    innerSpan = document.createElement("span");
    textSpan = document.createElement("span");
    iconSpan = document.createElement("span");
    link.className = "ui-btn ui-shadow ui-btn-corner-all ui-btn-up-" + swatch;
    link.style.marginTop = "0";
    link.style.marginBottom = "0";
    innerSpan.className = "ui-btn-inner ui-btn-corner-all";
    textSpan.className = "ui-btn-text";
    iconSpan.className = "ui-icon" + iconShadowClass;
    innerSpan.appendChild(textSpan);
    innerSpan.appendChild(iconSpan);
    link.appendChild(innerSpan);
    me.container.appendChild(link);
    addEvent(link, "mouseover", function() {
      if (disabled) return;
      pui.removeCssClass(link, "ui-btn-up-" + swatch);
      pui.addCssClass(link, "ui-btn-hover-" + swatch);
    });
    addEvent(link, "mouseout", function() {
      pui.removeCssClass(link, "ui-btn-hover-" + swatch);
      pui.addCssClass(link, "ui-btn-up-" + swatch);
    });
    addEvent(link, "focus", function() {
      if (disabled) return;
      pui.addCssClass(link, "ui-focus");
    });
    addEvent(link, "blur", function() {
      pui.removeCssClass(link, "ui-focus");
    });
    function down() {
      if (disabled) return;
      pui.removeCssClass(link, "ui-btn-up-" + swatch);
      pui.addCssClass(link, "ui-btn-down-" + swatch);
    }
    function up() {
      pui.removeCssClass(link, "ui-btn-down-" + swatch);
      pui.addCssClass(link, "ui-btn-up-" + swatch);
    }
    addEvent(link, "mousedown", down);
    addEvent(link, "touchstart", down);
    addEvent(document, "mouseup", up);
    addEvent(document, "touchend", up);
  }
  
  this.setText = function(text) {
    textSpan.innerHTML = text;
  }
  
  this.setSwatch = function(newSwatch) {
    if (newSwatch == null || newSwatch == "") newSwatch = "a";  // default
    if (newSwatch.length > 1) newSwatch = newSwatch.substr(0, 1);
    newSwatch = newSwatch.toLowerCase();
    if (swatch == newSwatch) return;
    var classes = link.className.split(" ");
    for (var i = 0; i < classes.length; i++) {
      var cls = classes[i];
      if (cls.length > 2 && cls.substr(cls.length - 2, 2) == "-" + swatch) {
        var newCls = cls.substr(0, cls.length - 1) + newSwatch;
        pui.removeCssClass(link, cls);
        pui.addCssClass(link, newCls);
        break;
      }
    }
    swatch = newSwatch;
  }
  
  this.setIconPosition = function(pos) {
    pui.removeCssClass(link, "ui-btn-icon-left");
    pui.removeCssClass(link, "ui-btn-icon-right");
    pui.removeCssClass(link, "ui-btn-icon-top");
    pui.removeCssClass(link, "ui-btn-icon-bottom");
    if (pos != "left" && pos != "right") return;
    pui.addCssClass(link, "ui-btn-icon-" + pos);
  }
  
  this.setIcon = function(icon) {
    if (icon == "left arrow") icon = "arrow-l";
    if (icon == "right arrow") icon = "arrow-r";
    if (icon == "up arrow") icon = "arrow-u";
    if (icon == "down arrow") icon = "arrow-d";
    if (icon == null) icon = "";
    if (icon !=  "") icon = " ui-icon-" + icon;
    iconSpan.className = "ui-icon" + icon + iconShadowClass; 
  }
  
  this.setMini = function(flag) {
    if (flag == true) pui.addCssClass(link, "ui-mini");
    else pui.removeCssClass(link, "ui-mini");
  }
  
  this.setDisabled = function(flag) {
    disabled = flag;
  }
  
  this.setStraightEdge = function(edge) {
    link.style.borderTopLeftRadius = "";
    link.style.borderTopRightRadius = "";
    link.style.borderBottomLeftRadius = "";
    link.style.borderBottomRightRadius = "";
    innerSpan.style.borderTopLeftRadius = "";
    innerSpan.style.borderTopRightRadius = "";
    innerSpan.style.borderBottomLeftRadius = "";
    innerSpan.style.borderBottomRightRadius = "";
    switch(edge) {
      case "left":
        link.style.borderTopLeftRadius = "0";
        link.style.borderBottomLeftRadius = "0";
        innerSpan.style.borderTopLeftRadius = "0";
        innerSpan.style.borderBottomLeftRadius = "0";
        break;
      case "right":
        link.style.borderTopRightRadius = "0";
        link.style.borderBottomRightRadius = "0";
        innerSpan.style.borderTopRightRadius = "0";
        innerSpan.style.borderBottomRightRadius = "0";       
        break;
      case "top":
        link.style.borderTopRightRadius = "0";
        link.style.borderTopLeftRadius = "0";
        innerSpan.style.borderTopRightRadius = "0";
        innerSpan.style.borderTopLeftRadius = "0";
        break;
      case "bottom":
        link.style.borderBottomRightRadius = "0";
        link.style.borderBottomLeftRadius = "0";
        innerSpan.style.borderBottomRightRadius = "0";
        innerSpan.style.borderBottomLeftRadius = "0";
        break;
      case "all":
        link.style.borderTopLeftRadius = "0";
        link.style.borderBottomLeftRadius = "0";
        link.style.borderTopRightRadius = "0";
        link.style.borderBottomRightRadius = "0";
        innerSpan.style.borderTopLeftRadius = "0";
        innerSpan.style.borderBottomLeftRadius = "0";
        innerSpan.style.borderTopRightRadius = "0";
        innerSpan.style.borderBottomRightRadius = "0";       
        break;      
      default:
        break;
    }
  }
  
  this.setHeight = function(height) {  // can be in 100%    
    if (typeof height == "number") height = height + "px";
    link.style.height = height;
  }
  
  this.setStyle = function(styleName, styleValue) {
    var parts = styleName.split(" ");
    if (parts.length == 2) {
      styleName = parts[0] + parts[1].substr(0, 1).toUpperCase() + parts[1].substr(1);
    }
    if (styleName == "textAlign") {
      link.style[styleName] = styleValue;
    }
    else {
      textSpan.style[styleName] = styleValue;
    }
  }
  
  this.setHref = function(href) {
    if (me.designMode) return;
    link.href = href;
  }
  
  this.setTarget = function(target) {
    if (me.designMode) return;
    link.target = target;
  }
  
  this.setLineHeight = function(containerHeight) {
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
  
  this.getLink = this.getMainSpan = function() {
    return link;
  }

  this.getInnerSpan = function() {
    return innerSpan;
  }

  this.getTextSpan = function() {
    return textSpan;
  }

  this.setAllStyles = function(properties) {
    var styles = ["color", "font family", "font size", "font style", "font variant", "font weight", "letter spacing", "text align", "text decoration", "text transform", "word spacing"];
    for (var i = 0; i < styles.length; i++) {
      var style = styles[i];
      var value = properties[style];
      if (value != null) me.setStyle(style, value);
    }
  }
 
}



pui.widgets.getCSSButtonProxy = function(defaultParms) {
  var defaults = {};
  for (var x in defaultParms) {
    defaults[x] = defaultParms[x];
  }
  if (defaults.value == null) defaults.value = "Click Here";
  if (defaults.width == null) defaults.width = "160px";
  if (defaults.height == null) defaults.height = "42px";
  if (defaults["theme"] == null) defaults["theme"] = "c - Gray";
  var dom = document.createElement("div");
  dom.style.width = defaults.width;
  dom.style.height = defaults.height;
  var button = new pui.CSSButton();
  button.container = dom;
  button.designMode = true;
  button.forProxy = true;
  button.init();
  button.setText(defaults["value"]);
  button.setSwatch(defaults["theme"]);
  button.setIcon(defaults["icon"]);
  button.setIconPosition(defaults["icon position"]);
  button.setMini(defaults["small button"] == "true");
  button.setStraightEdge(defaults["straight edge"]);
  return dom;
}





pui.widgets.add({
  name: "css button",
  newValue: "Click Here",
  inlineEdit: true,
  defaults: {
    "width": "160px",
    "theme": "c - Gray"
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
        parms.dom.button.setStyle(parms.propertyName, parms.value);
        break;
      default:
        break;
    }
  },
  
  propertySetters: {

    "field type": function(parms) {
      var button = new pui.CSSButton();
      button.container = parms.dom;
      button.designMode = parms.design;
      parms.dom.innerHTML = "";
      button.init();
      parms.dom.button = button;
      button.setText(parms.evalProperty("value"));
      button.setSwatch(parms.evalProperty("theme"));
      button.setIcon(parms.evalProperty("icon"));
      button.setIconPosition(parms.evalProperty("icon position"));
      button.setMini(parms.evalProperty("small button") == "true");
      button.setStraightEdge(parms.evalProperty("straight edge"));
      button.setHeight("100%");
    },
    
    "theme": function(parms) {
      parms.dom.button.setSwatch(parms.value);
    },

    "value": function(parms) {
      parms.dom.button.setText(parms.value);
    },

    "icon": function(parms) {
      parms.dom.button.setIcon(parms.value);
    },

    "icon position": function(parms) {
      parms.dom.button.setIconPosition(parms.value);
    },

    "small button": function(parms) {
      var mini = (parms.value == "true" || parms.value == true);
      parms.dom.button.setMini(mini);
    },

    "disabled": function(parms) {
      var disabled = (parms.value == "true" || parms.value == true);
      parms.dom.button.setDisabled(disabled);
    },

    "straight edge": function(parms) {
      parms.dom.button.setStraightEdge(parms.value);
    },
    
    "hyperlink reference": function(parms) {
      var href = parms.value;
      if (parms.designMode) href = null;
      parms.dom.button.setHref(href);
    },
    
    "target": function(parms) {
      parms.dom.button.setTarget(parms.value);
    },
    
    "height": function(parms) {
      parms.dom.button.setLineHeight(parms.value);
    }    

  }
  
});

