//  Profound UI Runtime  -- A Javascript Framework for Rich Displays
//  Copyright (c) 2014 Profound Logic Software, Inc.
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
 * Widgets Class
 * @constructor
 */

pui.Widgets = function() {
  // private variables
  var me = this;
  var widgetArray = [];

  // private functions
  function deriveNewId(name) {
    var words = name.split(" ");
    var newId = "";
    for (var i = 0; i < words.length; i++) {
      word = words[i];
      word = word.charAt(0).toUpperCase() + word.substr(1); // Capitalize
      newId += word;
    }
    return newId;
  }
  
  function deriveMenuName(name) {
    var words = name.split(" ");
    var menuName = "";
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      word = word.charAt(0).toUpperCase() + word.substr(1); // Capitalize
      if (menuName != "") menuName += " ";
      menuName += word;
    }
    return menuName;
  }

  // public methods
  this.getAllWidgets = function() {
    return widgetArray;
  }
  
  this.getWidgetList = function(fullList) {
    if (fullList == null) fullList = true;
    var list = [];
    for (var i = 0; i < widgetArray.length; i++) {
      var widget = widgetArray[i];
      if (widget.context != null && widget.context != context) continue;
      if (fullList || (!widget.customSizing && widget.name != "layout")) list.push(widget.name);
    }
    list.sort();
    return list;
  }
  
  this.getMenuOptions = function() {
    var menu = [];
    for (var i = 0; i < widgetArray.length; i++) {
      var menuName = widgetArray[i].menuName;
      if (typeof menuName == "string") {
        menu.push(menuName);
      }
      else {  // multiple names
        for (var j = 0; j < menuName.length; j++) {
          menu.push(menuName[j]);
        }
      }
    }
    menu.sort();
    return menu;
  }

  this.getWidgetByMenuName = function(menuName) {
    for (var i = 0; i < widgetArray.length; i++) {
      var widget = widgetArray[i];
      if (typeof widget.menuName == "string") {
        if (menuName == widget.menuName) return widget;
      }
      else {  // multiple names
        for (var j = 0; j < widget.menuName.length; j++) {
          if (menuName == widget.menuName[j]) return widget;
        }
      }
    }
    return null;
  }
  
  this.add = function(obj) {
    var name = obj.name;
    if (name != null) {
      // assign defaults
      if (obj.newId == null) obj.newId = deriveNewId(name);
      if (obj.menuName == null) obj.menuName = deriveMenuName(name);
      if (obj.newValue == null) obj.newValue = "";
      if (obj.tag == null) obj.tag = "div";
      if (obj.inputType == null && obj.tag == "input") obj.inputType = "text";
      if (obj.defaults == null) obj.defaults = {};
      if (obj.pickIcon1 == null) obj.pickIcon1 = "";
      if (obj.pickIcon2 == null) obj.pickIcon2 = "";
      if (obj.labelProperty == null) obj.labelProperty = "";
      if (obj.resizable == null) obj.resizable = true;
      if (obj.customSizing == null) obj.customSizing = false;
      if (obj.container == null) obj.container = false;
      if (obj.canBelongToGrid == null) obj.canBelongToGrid = true;
      if (obj.canBelongToLayout == null) obj.canBelongToLayout = true;
      if (obj.inlineEdit == null) obj.inlineEdit = false;
      // add widget
      widgetArray.push(obj);
      me[name] = obj;
      // Update the properties model with the new field type.
      if (!pui.codeBased) getPropertiesNamedModel()["field type"].choices = me.getWidgetList(false);
    }
  }
  
}

pui.widgets = new pui.Widgets();


